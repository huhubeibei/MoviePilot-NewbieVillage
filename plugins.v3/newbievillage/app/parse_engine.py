"""
命名解析引擎：纯正则、离线、可解释。

设计要点：
- 规则来自 data/parser/*.json，pattern 直接作用于原始文本（finditer + span），
  天然支持 WEB-DL 这类含连接符的形态；
- 同维度内重叠命中按 priority（高者优先）与 span 长度去重；
- 输出分段（segments）供前端逐段高亮，dims 摘要供卡片展示，
  unrecognized 保留未识别 token 作为 LLM 兜底（M4）的输入。
本模块只依赖标准库，便于脱离 MP 运行时独立测试。
"""

import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

# 维度展示顺序（影视 7 维 + 音乐维度 + 附加信息维）。
DIM_ORDER = [
    "episode", "resolution", "source", "vcodec", "audio", "edition",
    "format", "quality", "release_type", "year", "group",
]
_DIM_RANK = {dim: idx for idx, dim in enumerate(DIM_ORDER)}

_FLAG_MAP = {"i": re.IGNORECASE, "s": re.DOTALL, "m": re.MULTILINE}

_SPLIT_RE = re.compile(r"[^0-9A-Za-z\u4e00-\u9fff@.&+]+")

# 维度 → 前端配色（Vuetify 色名）。
DIM_COLORS = {
    "episode": "indigo",
    "resolution": "green",
    "source": "blue",
    "vcodec": "teal",
    "audio": "orange",
    "edition": "deep-purple",
    "format": "green",
    "quality": "teal",
    "release_type": "deep-orange",
    "year": "brown",
    "group": "pink",
}

_VIDEO_HINT = ("episode", "resolution", "source", "vcodec")
_MUSIC_HINT = ("format", "quality", "release_type")

# auto 模式判定 kind 后，只保留该家族的维度，避免音乐文件出现"FLAC 音轨"这类影视视角噪音。
_KIND_DIMS = {
    "video": {"episode", "resolution", "source", "vcodec", "audio", "edition", "year", "group"},
    "music": {"format", "quality", "release_type", "year"},
}


class ParseRule:
    """单条解析规则。"""

    __slots__ = ("id", "dim", "pattern", "flags", "label", "ref", "priority", "value_group", "compiled", "kind", "warn")

    def __init__(self, raw: Dict[str, Any]):
        self.id = str(raw.get("id") or "")
        self.dim = str(raw.get("dim") or "")
        self.pattern = str(raw.get("pattern") or "")
        self.flags = str(raw.get("flags") or "")
        self.label = str(raw.get("label") or "")
        self.ref = raw.get("ref")
        self.priority = int(raw.get("priority") or 0)
        self.value_group = raw.get("value_group")
        self.kind = raw.get("kind")
        self.warn = bool(raw.get("warn"))
        flag = _FLAG_MAP.get(self.flags.lower(), 0)
        self.compiled = re.compile(self.pattern, flag)

    def value_of(self, match: re.Match) -> str:
        if self.value_group is None:
            return match.group(0)
        try:
            return match.group(int(self.value_group)) or match.group(0)
        except IndexError:
            return match.group(0)


def load_rules(paths: List[Path]) -> List[ParseRule]:
    """加载并合并规则文件，按 kind 过滤在 parse 时进行。"""
    rules: List[ParseRule] = []
    for path in paths:
        try:
            data = json.loads(Path(path).read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        for raw in data.get("rules") or []:
            try:
                rules.append(ParseRule(raw))
            except re.error:
                continue
    return rules


class ParseEngine:
    """文件名解析引擎。"""

    def __init__(self, rules_dirs: List[Path]):
        paths: List[Path] = []
        for d in rules_dirs:
            d = Path(d)
            if d.is_dir():
                paths.extend(sorted(d.glob("*.json")))
        self._rules = load_rules(paths)

    # ---------- 对外接口 ----------

    def parse(self, text: str, kind: str = "auto") -> Dict[str, Any]:
        text = (text or "").strip()
        if not text:
            return {"kind": kind, "segments": [], "dims": {}, "unrecognized": [], "title_hint": ""}
        rules = self._select_rules(kind, text)
        hits = self._collect(text, rules)
        if kind == "auto":
            detected_kind = self._detect_kind(hits)
            allowed = _KIND_DIMS[detected_kind]
            hits = [h for h in hits if h["dim"] in allowed]
        else:
            detected_kind = kind
        hits = self._dedupe_by_dim(hits)
        segments = self._build_segments(text, hits)
        dims = self._summarize_dims(hits)
        unrecognized = self._collect_unrecognized(segments)
        warnings = self._collect_warnings(hits)
        return {
            "kind": detected_kind,
            "segments": segments,
            "dims": dims,
            "unrecognized": unrecognized,
            "title_hint": self._title_hint(text, hits),
            "warnings": warnings,
        }

    @staticmethod
    def _collect_warnings(hits: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """warn 规则命中汇总（枪版等新手坑），同规则多条去重。"""
        seen = set()
        result = []
        for hit in sorted(hits, key=lambda h: h["start"]):
            if not hit.get("warn") or hit["rule_id"] in seen:
                continue
            seen.add(hit["rule_id"])
            result.append({"label": hit["label"], "value": hit["value"]})
        return result

    # ---------- 内部实现 ----------

    def _select_rules(self, kind: str, text: str) -> List[ParseRule]:
        if kind in ("video", "music"):
            return [r for r in self._rules if r.kind in (None, kind)]
        # auto：全部规则都跑，最后按命中倾向判定 kind。
        return list(self._rules)

    def _collect(self, text: str, rules: List[ParseRule]) -> List[Dict[str, Any]]:
        hits: List[Dict[str, Any]] = []
        for rule in rules:
            try:
                matches = list(rule.compiled.finditer(text))
            except re.error:
                continue
            for m in matches:
                if m.start() == m.end():
                    continue
                hits.append(
                    {
                        "start": m.start(),
                        "end": m.end(),
                        "dim": rule.dim,
                        "label": rule.label,
                        "ref": rule.ref,
                        "value": rule.value_of(m),
                        "rule_id": rule.id,
                        "priority": rule.priority,
                        "warn": rule.warn,
                    }
                )
        # 同规则同 span 去重
        seen = set()
        unique = []
        for h in hits:
            key = (h["rule_id"], h["start"], h["end"])
            if key not in seen:
                seen.add(key)
                unique.append(h)
        return unique

    @staticmethod
    def _dedupe_by_dim(hits: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """同维度内重叠的命中保留 priority 高、span 长的一条。"""

        def better(a: Dict[str, Any], b: Dict[str, Any]) -> bool:
            if a["priority"] != b["priority"]:
                return a["priority"] > b["priority"]
            la, lb = a["end"] - a["start"], b["end"] - b["start"]
            if la != lb:
                return la > lb
            return a["start"] < b["start"]

        hits = sorted(hits, key=lambda h: (h["start"], h["end"]))
        kept: List[Dict[str, Any]] = []
        for hit in hits:
            conflict = False
            for other in kept:
                if other["dim"] == hit["dim"] and hit["start"] < other["end"] and other["start"] < hit["end"]:
                    if better(other, hit) or (
                        other["priority"] == hit["priority"]
                        and (other["end"] - other["start"]) >= (hit["end"] - hit["start"])
                    ):
                        conflict = True
                        break
            if not conflict:
                # 反向清理：已有命中与新命中同维且新命中更优
                kept = [
                    k
                    for k in kept
                    if not (
                        k["dim"] == hit["dim"]
                        and k["start"] < hit["end"]
                        and hit["start"] < k["end"]
                        and better(hit, k)
                    )
                ]
                kept.append(hit)
        return kept

    @staticmethod
    def _build_segments(text: str, hits: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """按字符覆盖构建展示分段；同 dim 同值相邻合并。"""
        covered: Dict[int, Dict[str, Any]] = {}
        for hit in sorted(hits, key=lambda h: (h["priority"], h["end"] - h["start"]), reverse=True):
            for pos in range(hit["start"], hit["end"]):
                if pos not in covered:
                    covered[pos] = hit
        segments: List[Dict[str, Any]] = []
        cur = None
        for pos, ch in enumerate(text):
            hit = covered.get(pos)
            key = (hit["dim"] if hit else None, hit["value"] if hit else None, hit["rule_id"] if hit else None)
            if cur is not None and cur["key"] == key:
                cur["raw"] += ch
                cur["seg"]["raw"] += ch
                cur["end"] = pos + 1
            else:
                if cur is not None:
                    segments.append(cur["seg"])
                cur = {
                    "key": key,
                    "raw": ch,
                    "start": pos,
                    "end": pos + 1,
                    "seg": {
                        "raw": ch,
                        "dim": hit["dim"] if hit else None,
                        "label": hit["label"] if hit else None,
                        "ref": hit["ref"] if hit else None,
                        "value": hit["value"] if hit else None,
                    },
                }
        if cur is not None:
            segments.append(cur["seg"])
        # 相邻同维同值但被中间覆盖打断的不再合并（保持直观）
        return [s for s in segments if s["raw"].strip() or s["dim"] is None]

    @staticmethod
    def _summarize_dims(hits: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        dims: Dict[str, List[Dict[str, Any]]] = {}
        for hit in sorted(hits, key=lambda h: (_DIM_RANK.get(h["dim"], 99), h["start"])):
            entry = {
                "value": hit["value"],
                "label": hit["label"],
                "ref": hit["ref"],
                "raw": hit["value"],
                "warn": hit.get("warn", False),
            }
            bucket = dims.setdefault(hit["dim"], [])
            if not any(e["value"] == entry["value"] and e["label"] == entry["label"] for e in bucket):
                bucket.append(entry)
        return dims

    @staticmethod
    def _collect_unrecognized(segments: List[Dict[str, Any]]) -> List[str]:
        tokens: List[str] = []
        for seg in segments:
            if seg["dim"] is not None:
                continue
            for token in _SPLIT_RE.split(seg["raw"]):
                token = token.strip(".-_ ")
                if token and any(c.isalnum() for c in token):
                    tokens.append(token)
        # 去重保序
        seen = set()
        result = []
        for t in tokens:
            if t.lower() not in seen:
                seen.add(t.lower())
                result.append(t)
        return result

    @staticmethod
    def _detect_kind(hits: List[Dict[str, Any]]) -> str:
        score = {"video": 0, "music": 0}
        for hit in hits:
            if hit["dim"] in _VIDEO_HINT:
                score["video"] += 2
            elif hit["dim"] in _MUSIC_HINT:
                score["music"] += 2
            elif hit["dim"] == "year":
                score["video"] += 1
                score["music"] += 1
        if score["music"] > score["video"]:
            return "music"
        return "video"

    @staticmethod
    def _title_hint(text: str, hits: List[Dict[str, Any]]) -> str:
        first = min((h["start"] for h in hits), default=len(text))
        head = text[:first]
        head = re.sub(r"^\[.*?]\s*", "", head)
        head = head.replace(".", " ").replace("_", " ").strip(" -~")
        return head
