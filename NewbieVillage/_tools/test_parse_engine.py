"""解析引擎测试：加载 _tools/parse_cases.json 逐条断言。

用法：python _tools/test_parse_engine.py  （在插件目录下执行）
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.parse_engine import ParseEngine  # noqa: E402

engine = ParseEngine([ROOT / "data" / "parser"])
cases = json.loads((ROOT / "_tools" / "parse_cases.json").read_text(encoding="utf-8"))["cases"]

passed = 0
failed = []
for case in cases:
    result = engine.parse(case["input"], kind=case.get("kind_in", "auto"))
    problems = []

    # kind 断言（空输入默认 video，不强制）
    if case["input"].strip() and "expect_kind" in case:
        if result["kind"] != case["expect_kind"]:
            problems.append(f"kind={result['kind']} 期望 {case['expect_kind']}")

    got_dims = result["dims"]
    for dim, expected_values in (case.get("expect_dims") or {}).items():
        got_values = [str(entry["value"]) for entry in got_dims.get(dim, [])]
        got_labels = [str(entry["label"]) for entry in got_dims.get(dim, [])]
        for want in expected_values:
            if not any(want in g or want in l for g, l in zip(got_values, got_labels)):
                problems.append(f"dim[{dim}] 缺少 {want}（实际 value={got_values} label={got_labels}）")

    for dim, want_ref in (case.get("expect_ref") or {}).items():
        got_refs = [entry.get("ref") for entry in got_dims.get(dim, [])]
        if want_ref is None:
            if any(g is not None for g in got_refs):
                problems.append(f"dim[{dim}] 不应带 ref（实际 {got_refs}）")
        elif want_ref not in got_refs:
            problems.append(f"dim[{dim}] ref 应为 {want_ref}（实际 {got_refs}）")

    if "expect_warnings" in case:
        got_warn_count = len(result.get("warnings") or [])
        if got_warn_count != case["expect_warnings"]:
            problems.append(
                f"warnings 数量 {got_warn_count} 期望 {case['expect_warnings']}（实际 {result.get('warnings')}）"
            )

    if problems:
        failed.append((case["name"], problems))
    else:
        passed += 1

print(f"通过 {passed}/{len(cases)}")
for name, problems in failed:
    print(f"FAIL {name}:")
    for p in problems:
        print(f"  - {p}")
sys.exit(1 if failed else 0)
