"""
LLM 兜底：解析引擎未识别的片段交给用户本机 MP 配置的 LLM 补全。

设计要点（docs/实现方案共识.md 7.3）：
- 只复用本实例的 LLM_* 运行时设置（每人的 key 各自生效，插件不含凭据）；
- 兜底是独立按钮而非自动触发；8 秒超时，失败降级为纯规则结果；
- 结果不写入词典，前端标注「AI 推断，仅供参考」。

LLMHelper 为宿主内部模块，这里延迟导入：避免拖慢插件加载，
也避免个别宿主版本 agent 模块异常时拖垮整个插件。
"""

import asyncio
import json
import re
import time
from typing import Any, Dict, Optional

from app.runtime.settings import get_runtime_setting

from app.sdk.logging import logger

FALLBACK_TIMEOUT = 8

PROMPT_TEMPLATE = """你是影视与音乐文件名解析助手。下面是一个文件名，以及纯正则引擎没能识别的片段。
文件名：{text}
未识别片段：{tokens}

请根据影视/音乐发布命名常识推断这些片段的含义，可能的维度：来源、分辨率、视频编码、音轨、HDR制式、版本、发布组、季集、音乐格式、规格、发行类型。
严格输出 JSON，不要输出任何其他文字或代码块标记：
{{"tags": [{{"label": "维度名", "value": "推断值"}}], "explanation": "整段命名的一句话总结"}}"""


def llm_status() -> Dict[str, Any]:
    """读取本实例 LLM 配置状态；provider 与 model 齐备才视为可用。"""
    provider = str(get_runtime_setting("LLM_PROVIDER") or "").strip()
    model = str(get_runtime_setting("LLM_MODEL") or "").strip()
    return {
        "available": bool(provider and model),
        "provider": provider,
        "model": model,
    }


def _extract_json(text: str) -> Optional[Dict[str, Any]]:
    """从回复中提取 JSON（容忍代码块围栏与前后杂文本）。"""
    if not text:
        return None
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        data = json.loads(match.group(0))
        return data if isinstance(data, dict) else None
    except ValueError:
        return None


async def test_connection() -> Dict[str, Any]:
    """连通性测试：复用 MP 设置页同款的最小 LLM 调用。"""
    from app.agent.llm.helper import LLMHelper

    result = await LLMHelper.test_current_settings(prompt="请只回复 OK", timeout=15)
    return {
        "ok": True,
        "provider": result.get("provider"),
        "model": result.get("model"),
        "duration_ms": result.get("duration_ms"),
        "reply_preview": result.get("reply_preview"),
    }


async def fallback_parse(text: str, parse_result: Dict[str, Any]) -> Dict[str, Any]:
    """对未识别片段做 LLM 推断，返回结构化标签与总结。失败抛异常由调用方降级。"""
    status = llm_status()
    if not status["available"]:
        raise ValueError("LLM 未配置：需要在本机 MP 设置中填写 AI 提供商与模型")

    tokens = [t for t in (parse_result.get("unrecognized") or []) if t]
    if not tokens:
        raise ValueError("没有未识别片段，无需 AI 兜底")

    prompt = PROMPT_TEMPLATE.format(text=text, tokens="、".join(tokens))
    started = time.perf_counter()

    from app.agent.llm.helper import LLMHelper

    llm = await LLMHelper.get_llm(streaming=False, thinking_level="off")
    try:
        response = await asyncio.wait_for(llm.ainvoke(prompt), timeout=FALLBACK_TIMEOUT)
    finally:
        try:
            await LLMHelper.close_llm(llm)
        except Exception:  # noqa: BLE001 — 关闭失败不影响主流程
            pass

    reply = LLMHelper.extract_text_content(getattr(response, "content", response)).strip()
    duration_ms = round((time.perf_counter() - started) * 1000)
    data = _extract_json(reply)
    if not data:
        logger.warning(f"影音新手村 LLM 兜底返回非 JSON：{reply[:120]}")
        raise ValueError("AI 返回内容无法解析为 JSON")

    tags = data.get("tags") if isinstance(data.get("tags"), list) else []
    clean_tags = [
        {"label": str(t.get("label") or "")[:20], "value": str(t.get("value") or "")[:40]}
        for t in tags
        if isinstance(t, dict) and t.get("value")
    ]
    return {
        "tags": clean_tags,
        "explanation": str(data.get("explanation") or "")[:200],
        "provider": status["provider"],
        "model": status["model"],
        "duration_ms": duration_ms,
    }
