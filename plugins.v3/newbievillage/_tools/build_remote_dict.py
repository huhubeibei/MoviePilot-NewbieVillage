"""构建远端词典发布文件：合并四领域内置词典为单一 dict.json。

用法：python _tools/build_remote_dict.py
产物：data/remote/dict.json（发布到 GitHub 后作为远端刷新源）。
"""

import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DICT_DIR = ROOT / "data" / "dict"
OUT = ROOT / "data" / "remote" / "dict.json"
DOMAINS = ("video", "music", "pt", "moviepilot")


def main() -> None:
    meta = json.loads((DICT_DIR / "_meta.json").read_text(encoding="utf-8"))
    terms = []
    for domain in DOMAINS:
        data = json.loads((DICT_DIR / f"{domain}.json").read_text(encoding="utf-8"))
        terms.extend(data.get("terms") or [])
    ladders_file = json.loads((DICT_DIR / "ladders.json").read_text(encoding="utf-8"))
    payload = {
        "version": int(meta.get("version") or 1),
        "updated_at": meta.get("updated_at") or date.today().isoformat(),
        "terms": terms,
        "ladders": ladders_file.get("ladders") or {},
        "size_matrix": ladders_file.get("size_matrix") or {},
        "buyers_guide": ladders_file.get("buyers_guide") or {},
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"written {OUT} version={payload['version']} terms={len(terms)}")


if __name__ == "__main__":
    main()
