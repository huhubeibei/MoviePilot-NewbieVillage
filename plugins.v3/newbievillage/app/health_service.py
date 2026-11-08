"""
配置体检引擎：读用户真实配置，逐项真检测，输出结构化结果。

原则（docs/实现方案共识.md）：
- 每项检查都读真实配置/做真实探测，不做假检查；
- 只读不写，任何探测带超时或用安全方式（如日志扫描代替 NFS stat，避免挂死）；
- 输出统一为 CheckResult：status ∈ ok/warn/error/info，附解释与修复建议。
"""

import json
import os
import re
import socket
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

from app.runtime.settings import get_runtime_setting

from app.sdk.logging import logger

LOG_DIR = Path("/config/logs")


class CheckResult:
    """单项体检结果。"""

    def __init__(self, id: str, title: str, status: str, message: str,
                 details: Optional[List[str]] = None, advice: str = ""):
        self.id = id
        self.title = title
        self.status = status  # ok / warn / error / info
        self.message = message
        self.details = details or []
        self.advice = advice

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id, "title": self.title, "status": self.status,
            "message": self.message, "details": self.details, "advice": self.advice,
        }


def _get_config(key: str) -> Any:
    try:
        from app.db.oper.systemconfig import SystemConfigOper
        return SystemConfigOper().get(key)
    except Exception as err:
        logger.warning(f"影音新手村体检读取配置 {key} 失败：{err}")
        return None


def _as_list(value: Any) -> List[Dict[str, Any]]:
    return [v for v in (value or []) if isinstance(v, dict)]


# ---------- 1. 目录映射缺失/自洽 ----------

def check_directories() -> CheckResult:
    dirs = _as_list(_get_config("Directories"))
    if not dirs:
        return CheckResult("directories", "目录映射缺失", "error",
                           "尚未配置任何目录映射，下载完成后 MP 无法整理文件",
                           advice="设定 → 存储 → 目录映射，添加「下载目录 → 媒体库目录」")
    details, status = [], "ok"
    names = set()
    for d in dirs:
        name = d.get("name") or "(未命名)"
        if name in names:
            details.append(f"存在同名目录配置「{name}」，匹配时可能互相干扰")
            status = max(status, "warn", key=["ok", "info", "warn", "error"].index)
        names.add(name)
        dl, lib = d.get("download_path"), d.get("library_path")
        if not lib:
            details.append(f"「{name}」未设置媒体库目录（library_path），整理无法进行")
            status = "error"
        if dl and lib and dl.rstrip("/") == lib.rstrip("/"):
            details.append(f"「{name}」下载目录与媒体库目录相同，硬链接/复制无意义")
            status = "warn"
    if status == "ok":
        message = f"共 {len(dirs)} 条目录配置，自洽性检查通过"
    else:
        message = f"共 {len(dirs)} 条目录配置，发现 {len(details)} 处问题"
    return CheckResult("directories", "目录映射缺失", status, message, details,
                       "每个「下载目录→媒体库目录」条目需路径完整且互不相同")


# ---------- 2. 分类无规则 ----------

def check_classification_rules() -> CheckResult:
    dirs = _as_list(_get_config("Directories"))
    policy = _get_config("MediaClassificationPolicy") or {}
    active = policy.get("active") or {}
    categories = _as_list(active.get("categories"))
    by_type: Dict[str, int] = {}
    for c in categories:
        if c.get("enabled", True):
            by_type[c.get("media_type")] = by_type.get(c.get("media_type"), 0) + 1
    details, status = [], "ok"
    for d in dirs:
        if not d.get("library_category_folder"):
            continue
        mt = d.get("media_type") or "全部类型"
        if mt == "全部类型":
            continue
        if not by_type.get(mt):
            details.append(f"目录「{d.get('name')}」开启了二级分类目录，但分类策略中没有「{mt}」的可用分类")
            status = "warn"
    if status == "ok":
        message = "目录的二级分类配置与分类策略匹配"
    else:
        message = "存在开启了二级分类但没有对应分类项的目录"
    return CheckResult("classification-rules", "分类无规则", status, message, details,
                       "设定 → 分类策略 中为对应媒体类型添加分类，或关闭目录的二级分类子目录")


# ---------- 5. 分类策略 revision/fallbacks/规则引用 ----------

def check_classification_policy() -> CheckResult:
    policy = _get_config("MediaClassificationPolicy") or {}
    if not policy:
        return CheckResult("policy", "分类策略结构校验", "info",
                           "未配置分类策略（使用默认行为）")
    active = policy.get("active") or {}
    history = policy.get("history") or {}
    details, status = [], "ok"
    a_rev, h_rev = active.get("revision"), history.get("revision")
    if isinstance(a_rev, int) and isinstance(h_rev, int) and h_rev >= a_rev:
        details.append(f"history revision ({h_rev}) 不早于 active revision ({a_rev})，手改 JSON 常见错误")
        status = "error"
    cat_ids = {c.get("id") for c in _as_list(active.get("categories")) if c.get("id")}
    # fallbacks 形态为 {媒体类型: category_id} 字典
    fallbacks = active.get("fallbacks") or {}
    if isinstance(fallbacks, dict):
        for mt, cid in fallbacks.items():
            if cid and cid not in cat_ids:
                details.append(f"「{mt}」的兜底分类指向不存在的 category_id：{cid}")
                status = "error"
    else:
        for fb in _as_list(fallbacks):
            cid = fb.get("category_id") if isinstance(fb, dict) else fb
            if cid and cid not in cat_ids:
                details.append(f"兜底分类指向不存在的 category_id：{cid}")
                status = "error"
    for rule in _as_list(active.get("rules")):
        target = rule.get("target") or {}
        cid = target.get("category_id")
        if rule.get("kind") == "category" and rule.get("enabled", True) and cid and cid not in cat_ids:
            details.append(f"规则「{rule.get('name')}」指向不存在的分类：{cid}")
            status = "error"
    if status == "ok":
        message = f"策略结构完整（active revision {a_rev}，{len(cat_ids)} 个分类）"
    else:
        message = "分类策略存在结构性错误"
    return CheckResult("policy", "分类策略结构校验", status, message, details,
                       "优先用界面编辑分类策略；手改 JSON 前先备份")


# ---------- 3. 下载器对接 ----------

def check_downloaders() -> CheckResult:
    dirs = _as_list(_get_config("Directories"))
    needs_downloader = any(d.get("monitor_type") == "downloader" for d in dirs)
    downloaders = _as_list(_get_config("Downloaders"))
    enabled = [d for d in downloaders if d.get("enabled")]
    if not downloaders:
        return CheckResult("downloaders", "下载器对接", "error",
                           "未配置任何下载器，MP 无法下载和监控整理",
                           advice="设定 → 下载器 添加 qBittorrent/Transmission 并测试连接")
    if needs_downloader and not enabled:
        return CheckResult("downloaders", "下载器对接", "error",
                           "有目录配置为「下载器监控」但没有已启用的下载器",
                           details=[f"已配置 {len(downloaders)} 个下载器，全部处于停用状态"],
                           advice="启用下载器，或将目录监控方式改为其他")
    return CheckResult("downloaders", "下载器对接", "ok",
                       f"已配置 {len(downloaders)} 个下载器（启用 {len(enabled)} 个）",
                       details=[f"{d.get('name')}（{d.get('type')}）" for d in enabled])


# ---------- 4. 硬链接跨盘（真实 st_dev 探测） ----------

def check_hardlink() -> CheckResult:
    dirs = _as_list(_get_config("Directories"))
    link_dirs = [d for d in dirs if (d.get("transfer_type") or "").lower() in ("link", "reflink")]
    if not link_dirs:
        return CheckResult("hardlink", "硬链接跨盘", "info",
                           "没有使用硬链接整理的目录配置")
    details, status = [], "ok"
    dev_cache: Dict[str, Optional[int]] = {}

    def dev_of(path: str) -> Optional[int]:
        key = path.rstrip("/") or "/"
        if key not in dev_cache:
            try:
                dev_cache[key] = os.stat(key).st_dev
            except OSError:
                dev_cache[key] = None
        return dev_cache[key]

    for d in link_dirs:
        name = d.get("name") or "(未命名)"
        dl, lib = d.get("download_path"), d.get("library_path")
        if not dl or not lib:
            continue
        dl_dev, lib_dev = dev_of(dl), dev_of(lib)
        if dl_dev is None:
            details.append(f"「{name}」下载目录 {dl} 在 MP 容器内不存在（未挂载或路径写错）")
            status = "error"
        elif lib_dev is None:
            details.append(f"「{name}」媒体库目录 {lib} 在 MP 容器内不存在（未挂载或路径写错）")
            status = "error"
        elif dl_dev != lib_dev:
            details.append(f"「{name}」下载目录与媒体库目录位于不同文件系统，硬链接会退化为复制（占双倍空间）")
            status = "warn"
    if status == "ok":
        message = f"{len(link_dirs)} 个硬链接目录的源/目标均在同一文件系统，链接可行"
    else:
        message = "硬链接配置存在跨盘或路径不可达问题"
    return CheckResult("hardlink", "硬链接跨盘", status, message, details,
                       "下载目录与媒体库目录必须在同一文件系统/同一块盘上，硬链接才能零拷贝")


# ---------- 6. 规则串引用失效 ----------

def _builtin_rule_ids() -> set:
    """MP 内置规则 id（BUILTIN_RULE_SET）；拿不到时用兜底清单。"""
    fallback = {
        "BLU", "4K", "1080P", "720P", "CNSUB", "GZ", "SPECSUB", "BLURAY", "UHD",
        "H265", "H264", "DOLBY", "ATMOS", "HDR", "SDR", "REMUX", "WEBDL", "FREE",
        "CNVOI", "HKVOI", "60FPS", "3D", "HIRES", "LOSSLESS", "FLAC", "ALAC",
        "APE", "WAV", "DSD", "MP3", "AAC", "OPUS", "BITRATE320", "BITRATE256",
        "BITRATE192",
    }
    try:
        from app.application.rules import BUILTIN_RULE_SET
        ids = set(BUILTIN_RULE_SET.keys())
        return ids or fallback
    except Exception:
        return fallback


def check_filter_rules() -> CheckResult:
    custom = _as_list(_get_config("CustomFilterRules"))
    custom_ids = {c.get("id") for c in custom if c.get("id")}
    valid_ids = custom_ids | _builtin_rule_ids()
    groups = _as_list(_get_config("UserFilterRuleGroups"))
    details, status = [], "ok"

    # 自定义规则的 include/exclude 正则可编译性
    for rule in custom:
        for field in ("include", "exclude"):
            expr = (rule.get(field) or "").strip()
            if not expr:
                continue
            try:
                re.compile(expr)
            except re.error as err:
                details.append(f"自定义规则「{rule.get('name')}」的 {field} 正则编译失败：{err}")
                status = "error"

    # 规则组串引用的规则 id 必须存在（内置 + 自定义）
    token_re = re.compile(r"[A-Za-z0-9_\-\u4e00-\u9fff]+")
    for g in groups:
        expr = g.get("rule_string") or ""
        for token in token_re.findall(expr.replace("&", " ").replace(">", " ").replace("!", " ")):
            if token not in valid_ids:
                details.append(f"规则组「{g.get('name')}」引用了不存在的规则：{token}")
                status = "error"

    # 订阅/搜索引用的规则组必须存在
    group_names = {g.get("name") for g in groups if g.get("name")}
    for key, label in (("SubscribeFilterRuleGroups", "订阅"), ("SearchFilterRuleGroups", "搜索")):
        for ref in _as_list(_get_config(key)):
            name = ref.get("name") if isinstance(ref, dict) else None
            if name and name not in group_names:
                details.append(f"{label}引用了不存在的规则组：{name}")
                status = "error"

    if status == "ok":
        message = f"{len(custom)} 条自定义规则、{len(groups)} 个规则组，引用完整且正则可编译"
    else:
        message = "过滤规则存在引用失效或正则错误"
    return CheckResult("filter-rules", "规则串引用失效", status, message, details,
                       "设定 → 过滤规则组：删掉的规则要先解除引用；正则错误会导致整条规则失效")


# ---------- 7. 识别词正则有效性 ----------

def check_identifiers() -> CheckResult:
    words = _get_config("CustomIdentifiers")
    lines: List[str] = []
    if isinstance(words, list):
        for w in words:
            if isinstance(w, str):
                lines.append(w)
            elif isinstance(w, dict):
                lines.append(str(w.get("content") or w.get("word") or ""))
    if not lines:
        return CheckResult("identifiers", "识别词正则有效性", "info",
                           "未配置自定义识别词")
    details, status = [], "ok"
    for line in lines:
        raw = (line or "").strip()
        if not raw or raw.startswith("#"):
            continue
        # 替换型：A => B，校验 A 的正则；否则整行视为正则
        expr = raw.split("=>")[0].strip() if "=>" in raw else raw
        if not expr or expr.startswith("@"):
            continue
        try:
            re.compile(expr)
        except re.error as err:
            details.append(f"识别词正则编译失败：{raw[:40]}…（{err}）")
            status = "error"
    if status == "ok":
        message = f"{len(lines)} 行识别词，正则全部可编译"
    else:
        message = "存在编译失败的识别词正则"
    return CheckResult("identifiers", "识别词正则有效性", status, message, details,
                       "设定 → 识别词：正则写错会导致该条不生效，先用「识别测试」验证")


# ---------- 8. 媒体服务器 ----------

def check_mediaservers() -> CheckResult:
    servers = _as_list(_get_config("MediaServers"))
    if not servers:
        return CheckResult("mediaservers", "媒体服务器连接", "info",
                           "未配置媒体服务器（Emby/Jellyfin/Plex），MP 无法推送入库和播放状态",
                           advice="设定 → 媒体服务器 添加并测试连接")
    details, status = [], "ok"
    for s in servers:
        if not s.get("enabled", True):
            details.append(f"「{s.get('name')}」处于停用状态")
            status = max(status, "info", key=["ok", "info", "warn", "error"].index)
            continue
        conf = s.get("config") or {}
        endpoint = str(conf.get("host") or conf.get("endpoint") or "")
        host_port = endpoint.replace("http://", "").replace("https://", "").strip("/")
        if not host_port:
            details.append(f"「{s.get('name')}」未填写服务器地址")
            status = "warn"
            continue
        host, _, port = host_port.partition(":")
        try:
            sock = socket.create_connection(
                (host, int(port or (443 if endpoint.startswith("https") else 80))), timeout=2.5)
            sock.close()
            details.append(f"「{s.get('name')}」({s.get('type')}) 网络可达")
        except OSError as err:
            details.append(f"「{s.get('name')}」({s.get('type')}) 无法连接 {host}:{port or '?'}（{err.__class__.__name__}）")
            status = "warn"
    if status == "ok":
        message = f"{len(servers)} 个媒体服务器全部可达"
    else:
        message = "媒体服务器连接存在告警（详见明细）"
    return CheckResult("mediaservers", "媒体服务器连接", status, message, details,
                       "设定 → 媒体服务器：地址端口正确、凭据有效；本检查只探测网络可达性")


# ---------- 9. NFS stale（日志扫描，避免 stat 挂死） ----------

def check_nfs_stale() -> CheckResult:
    hits: List[str] = []
    try:
        log_files = sorted(LOG_DIR.glob("moviepilot.log*"),
                           key=lambda p: p.stat().st_mtime, reverse=True)[:2]
        for lf in log_files:
            try:
                with open(lf, "r", encoding="utf-8", errors="ignore") as f:
                    tail = f.readlines()[-2000:]
                for line in tail:
                    if "tale file handle" in line or "Stale file handle" in line:
                        hits.append(line.strip()[:160])
            except OSError:
                continue
    except Exception as err:
        logger.warning(f"影音新手村体检扫描日志失败：{err}")
    if not hits:
        return CheckResult("nfs", "NFS stale 迹象", "ok",
                           "近期日志中未发现 Stale file handle 痕迹")
    unique = list(dict.fromkeys(hits))[:5]
    return CheckResult("nfs", "NFS stale 迹象", "warn",
                       f"日志中发现 {len(hits)} 处 Stale file handle 记录（存储挂载句柄失效）",
                       unique, "卸载重挂对应 NFS/网络存储后重启 MP 容器刷新句柄")


# ---------- 10. LLM 配置 ----------

def check_llm() -> CheckResult:
    provider = str(get_runtime_setting("LLM_PROVIDER") or "").strip()
    model = str(get_runtime_setting("LLM_MODEL") or "").strip()
    if not provider:
        return CheckResult("llm", "AI/LLM 配置", "info",
                           "未配置 LLM 提供商（解析器 AI 兜底不可用，不影响其他功能）",
                           advice="设定 → AI 填写提供商、模型和密钥后，可在本插件配置页测试连通性")
    if not model:
        return CheckResult("llm", "AI/LLM 配置", "warn",
                           f"已选提供商 {provider} 但未选择模型，AI 功能不可用",
                           advice="设定 → AI 选择模型（必要的话补 API Key）")
    return CheckResult("llm", "AI/LLM 配置", "ok",
                       f"{provider} / {model} 已配置（解析器 AI 兜底可用）")


CHECKS: List[Callable[[], CheckResult]] = [
    check_directories,
    check_classification_rules,
    check_classification_policy,
    check_downloaders,
    check_hardlink,
    check_filter_rules,
    check_identifiers,
    check_mediaservers,
    check_nfs_stale,
    check_llm,
]


def run_all_checks() -> Dict[str, Any]:
    """运行全部体检项，返回汇总。单项失败不影响其他项。"""
    results: List[Dict[str, Any]] = []
    for check in CHECKS:
        try:
            results.append(check().to_dict())
        except Exception as err:
            logger.error(f"影音新手村体检项 {check.__name__} 执行失败：{err}")
            results.append({
                "id": check.__name__, "title": check.__name__, "status": "error",
                "message": f"检查执行失败：{err}", "details": [], "advice": "",
            })
    counts = {"ok": 0, "info": 0, "warn": 0, "error": 0}
    for r in results:
        counts[r["status"]] = counts.get(r["status"], 0) + 1
    return {"results": results, "summary": counts, "total": len(results)}
