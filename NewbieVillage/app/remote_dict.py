"""
远端词典刷新：拉取 → 校验 → 原子落盘。

设计约束：任何一步失败都不破坏现有词典；远端版本低于当前时拒绝写入。
"""

import json
import os
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

from app.sdk.network import RequestUtils

from .dict_service import DOMAINS, REQUIRED_FIELDS

FETCH_TIMEOUT = 15


def fetch_remote_dict(url: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """拉取远端词典 JSON，返回 (数据, 错误信息)。"""
    if not url:
        return None, "未配置远端词典 URL"
    try:
        resp = RequestUtils(timeout=FETCH_TIMEOUT).get_res(url)
    except Exception as err:
        return None, f"请求失败：{err}"
    if resp is None:
        return None, "请求失败：无响应"
    if resp.status_code != 200:
        return None, f"请求失败：HTTP {resp.status_code}"
    try:
        return resp.json(), None
    except ValueError:
        return None, "响应不是合法 JSON"


def validate_remote_dict(data: Any, current_version: int) -> Optional[str]:
    """校验远端数据结构与版本。返回错误信息，None 表示通过。"""
    if not isinstance(data, dict) or not isinstance(data.get("terms"), list):
        return "数据结构错误：缺少 terms 列表"
    version = data.get("version")
    if not isinstance(version, int) or version <= 0:
        return "数据结构错误：version 必须为正整数"
    if version < current_version:
        return f"远端版本 {version} 低于当前 {current_version}，已拒绝"
    for term in data["terms"]:
        if not isinstance(term, dict):
            return "数据结构错误：存在非法词条"
        missing = [field for field in REQUIRED_FIELDS if not term.get(field)]
        if missing:
            return f"词条 [{term.get('term', '?')}] 缺少字段：{'、'.join(missing)}"
        if term.get("domain") not in DOMAINS:
            return f"词条 [{term.get('term', '?')}] 领域非法：{term.get('domain')}"
    return None


def save_remote_dict(remote_dir: Path, data: Dict[str, Any], url: str) -> Dict[str, Any]:
    """原子写入远端副本与元信息，返回 meta。"""
    remote_dir = Path(remote_dir)
    remote_dir.mkdir(parents=True, exist_ok=True)
    meta = {
        "version": data["version"],
        "updated_at": data.get("updated_at"),
        "fetched_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "fetched_ts": time.time(),
        "source_url": url,
        "count": len(data["terms"]),
    }
    target = remote_dir / "dict_remote.json"
    tmp = remote_dir / "dict_remote.json.tmp"
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    os.replace(tmp, target)
    (remote_dir / "remote_meta.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return meta
