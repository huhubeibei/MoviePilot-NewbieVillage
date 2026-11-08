"""提取 MP 内置过滤规则 id 清单（AST 解析 rules.py 中的内置字典）。"""

import ast
import json

source = open("/app/app/application/rules.py", encoding="utf-8", errors="ignore").read()
tree = ast.parse(source)
for node in ast.walk(tree):
    if isinstance(node, ast.Assign) and isinstance(node.value, ast.Dict):
        keys = [
            k.value for k in node.value.keys
            if isinstance(k, ast.Constant) and isinstance(k.value, str)
        ]
        if "BLU" in keys and "4K" in keys:
            print("BUILTIN_IDS=" + json.dumps(keys, ensure_ascii=False))
            break
