"""修复 heredoc 转义事故：重写三条规则的 pattern 为正确的正则。"""

import json
from pathlib import Path

FIXED = {
    "src_tvrip": "\\bTVRip\\b",
    "au_lpcm": "\\bL?PCM\\d?\\b",
    "vc_legacy": "\\bVC-?1\\b|\\bMPEG-?2\\b",
}

path = Path(__file__).resolve().parent.parent / "data" / "parser" / "video_rules.json"
data = json.loads(path.read_text(encoding="utf-8"))
for rule in data["rules"]:
    if rule["id"] in FIXED:
        old = json.dumps(rule["pattern"], ensure_ascii=False)
        rule["pattern"] = FIXED[rule["id"]]
        print(f'{rule["id"]}: {old} -> {json.dumps(rule["pattern"], ensure_ascii=False)}')
path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
