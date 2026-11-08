"""
案例服务：读取 data/cases 下的 markdown 案例。

格式：YAML 风格 frontmatter（id/title/domain/storyline/settings）+ 正文
（现象 → 排查 → 结论 → 关联设置）。frontmatter 手工解析，避免引入 yaml 依赖。
"""

from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

_FIELDS = ("id", "title", "domain", "storyline", "settings")

# 案例领域 → 展示名（与词典领域保持一致，另允许 general）。
DOMAIN_TITLES = {
    "video": "影视命名",
    "music": "音乐命名",
    "pt": "PT 行为",
    "moviepilot": "MP 概念",
    "general": "综合",
}


def _parse_frontmatter(text: str) -> Tuple[Optional[Dict[str, str]], str]:
    """拆分 frontmatter 与正文；无 frontmatter 时返回 (None, 原文)。"""
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None, text
    meta: Dict[str, str] = {}
    end = None
    for idx in range(1, len(lines)):
        line = lines[idx]
        if line.strip() == "---":
            end = idx
            break
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        if key in _FIELDS:
            value = value.strip()
            # frontmatter 值允许包裹引号，取内容去掉成对引号
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            meta[key] = value
    if end is None:
        return None, text
    content = "\n".join(lines[end + 1:]).strip()
    return meta, content


class CaseService:
    """案例列表与详情。"""

    def __init__(self, cases_dir: Path):
        self.cases_dir = Path(cases_dir)

    def _read_case(self, path: Path) -> Optional[Dict[str, Any]]:
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            return None
        meta, content = _parse_frontmatter(text)
        if not meta or not meta.get("id") or not meta.get("title"):
            return None
        return {
            "id": meta["id"],
            "title": meta["title"],
            "domain": meta.get("domain", "general"),
            "domain_title": DOMAIN_TITLES.get(meta.get("domain", "general"), "综合"),
            "storyline": meta.get("storyline", "综合"),
            "settings": [s.strip() for s in meta.get("settings", "").split(",") if s.strip()],
            "content": content,
        }

    def list_cases(self) -> List[Dict[str, Any]]:
        """案例列表（不含正文），按文件名排序保证稳定顺序。"""
        cases = []
        for path in sorted(self.cases_dir.glob("*.md")):
            case = self._read_case(path)
            if case:
                case.pop("content", None)
                cases.append(case)
        return cases

    def get_case(self, case_id: str) -> Optional[Dict[str, Any]]:
        """按 id 取案例全文；case_id 已在路由/调用侧做字符串处理，这里不过滤路径。"""
        if not case_id or "/" in case_id or "\\" in case_id or ".." in case_id:
            return None
        path = self.cases_dir / f"{case_id}.md"
        if not path.is_file():
            return None
        return self._read_case(path)
