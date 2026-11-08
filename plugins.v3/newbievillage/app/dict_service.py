"""
词典服务：加载内置/远端词典，提供检索、每日一词与版本状态。

加载优先级：远端副本（dict_remote.json）版本 >= 内置版本时整体替换，
否则使用内置四领域词典。任何坏数据都被跳过而不是抛错。
"""

import json
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

DOMAINS = ("video", "music", "pt", "moviepilot")
REQUIRED_FIELDS = ("term", "domain", "one_line")


def _read_json(path: Path) -> Optional[Any]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


class DictService:
    """词典加载与检索。"""

    def __init__(self, builtin_dir: Path, remote_dir: Path):
        self.builtin_dir = Path(builtin_dir)
        self.remote_dir = Path(remote_dir)
        self._cache: Optional[Dict[str, Any]] = None

    # ---------- 加载 ----------

    def _builtin_version(self) -> int:
        meta = _read_json(self.builtin_dir / "_meta.json") or {}
        try:
            return int(meta.get("version") or 1)
        except (TypeError, ValueError):
            return 1

    @staticmethod
    def _valid_term(term: Any) -> bool:
        return (
            isinstance(term, dict)
            and all(term.get(field) for field in REQUIRED_FIELDS)
            and term.get("domain") in DOMAINS
        )

    def _load(self) -> Dict[str, Any]:
        if self._cache is not None:
            return self._cache
        version = self._builtin_version()
        source = "builtin"
        terms: List[Dict[str, Any]] = []
        extras: Dict[str, Any] = {}

        remote = _read_json(self.remote_dir / "dict_remote.json")
        if isinstance(remote, dict) and isinstance(remote.get("terms"), list):
            remote_version = remote.get("version")
            if isinstance(remote_version, int) and remote_version >= version:
                terms = [t for t in remote["terms"] if self._valid_term(t)]
                source, version = "remote", remote_version
                # 远端携带的天梯/体积矩阵随远端生效
                if isinstance(remote.get("ladders"), dict):
                    extras["ladders"] = remote["ladders"]
                if isinstance(remote.get("size_matrix"), dict):
                    extras["size_matrix"] = remote["size_matrix"]

        if not terms:
            for domain in DOMAINS:
                data = _read_json(self.builtin_dir / f"{domain}.json")
                if not isinstance(data, dict):
                    continue
                for term in data.get("terms") or []:
                    if self._valid_term(term):
                        terms.append(term)
            terms.sort(key=lambda t: (DOMAINS.index(t["domain"]), t.get("term", "")))

        if "ladders" not in extras:
            builtin_ladders = _read_json(self.builtin_dir / "ladders.json")
            if isinstance(builtin_ladders, dict):
                if isinstance(builtin_ladders.get("ladders"), dict):
                    extras["ladders"] = builtin_ladders["ladders"]
                if isinstance(builtin_ladders.get("size_matrix"), dict):
                    extras["size_matrix"] = builtin_ladders["size_matrix"]

        self._cache = {"version": version, "source": source, "terms": terms, **extras}
        return self._cache

    def invalidate(self) -> None:
        """远端刷新后清空缓存，下次访问重新加载。"""
        self._cache = None

    # ---------- 查询 ----------

    def list_terms(
        self, domain: Optional[str] = None, q: Optional[str] = None
    ) -> Dict[str, Any]:
        data = self._load()
        q_low = (q or "").strip().lower()
        result: List[Dict[str, Any]] = []
        for term in data["terms"]:
            if domain and term["domain"] != domain:
                continue
            if q_low:
                haystack = " ".join(
                    [
                        term.get("term", ""),
                        " ".join(term.get("aliases") or []),
                        term.get("one_line", ""),
                        " ".join(term.get("tags") or []),
                    ]
                ).lower()
                if q_low not in haystack:
                    continue
            result.append(term)
        return {
            "version": data["version"],
            "source": data["source"],
            "count": len(result),
            "terms": result,
            "ladders": data.get("ladders") or {},
            "size_matrix": data.get("size_matrix") or {},
        }

    def daily_term(self) -> Dict[str, Any]:
        """每日一词：按日期序数轮换，无状态、跨端一致。"""
        data = self._load()
        terms = data["terms"]
        if not terms:
            return {}
        return terms[date.today().toordinal() % len(terms)]

    def active_version(self) -> int:
        return int(self._load().get("version") or 1)

    def remote_meta(self) -> Optional[Dict[str, Any]]:
        meta = _read_json(self.remote_dir / "remote_meta.json")
        return meta if isinstance(meta, dict) else None

    def status(self) -> Dict[str, Any]:
        """词典版本状态：内置/远端版本、词条计数、领域分布。"""
        data = self._load()
        builtin_meta = _read_json(self.builtin_dir / "_meta.json") or {}
        by_domain = {domain: 0 for domain in DOMAINS}
        for term in data["terms"]:
            by_domain[term["domain"]] = by_domain.get(term["domain"], 0) + 1
        return {
            "active_version": data["version"],
            "active_source": data["source"],
            "count": len(data["terms"]),
            "by_domain": by_domain,
            "builtin": {
                "version": self._builtin_version(),
                "updated_at": builtin_meta.get("updated_at"),
            },
            "remote": self.remote_meta(),
        }
