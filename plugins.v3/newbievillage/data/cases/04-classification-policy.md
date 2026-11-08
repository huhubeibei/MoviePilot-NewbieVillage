---
id: 04-classification-policy
title: "分类策略改了不生效？v3 的 active/history 双份配置"
domain: moviepilot
storyline: "目录与整理"
settings: "分类策略, 二级分类"
---

# 分类策略改了不生效？v3 的 active/history 双份配置

## 现象

在分类策略里新增/修改了规则，新入库的文件没有按预期归类，或者保存时直接报校验错误。

## 排查

1. **确认生效范围**：分类策略只影响**之后**整理的文件，存量文件不会自动重新归类——这是最常见的误会。
2. **检查策略结构**：MP v3 的 MediaClassificationPolicy 是 `active + history` 双份包装，`history` 的 revision 必须**早于** active 的 revision，手改 JSON 时版本号写反了 pydantic 校验直接拒绝。
3. **核对规则引用**：规则里引用的分类 ID 必须存在于 categories 中，规则串里引用了已删除的规则 ID 会导致整条规则失效。

## 结论

- 优先用**界面**编辑分类策略，手改 JSON 前先备份。
- 改完策略想立刻看到效果：对目标文件手动触发一次重新整理。
- 修改规则组/规则 ID 前先全局搜引用（订阅、搜索设置里可能挂着规则组）。

## 关联设置

- **分类策略**：设定 → 分类策略
- **二级分类**：categories 与目录结构一一对应，改目录结构前先改这里
