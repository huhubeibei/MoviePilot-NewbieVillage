---
id: 05-qb-password
title: "MP 连不上下载器？qBittorrent 密码要两侧同步"
domain: moviepilot
storyline: "保号之路"
settings: "下载器"
---

# MP 连不上下载器？qBittorrent 密码要两侧同步

## 现象

MP 突然提示下载器连接失败，下载任务状态异常；但直接打开 qBittorrent WebUI 登录一切正常。

## 排查

1. **分别登录验证**：qB WebUI 能登录 → 问题在 MP 侧的对接配置，而不是 qB 本身。
2. **检查 MP 下载器配置**：用户名/密码、地址、端口逐项核对。
3. **回忆最近改动**：qB 侧改过 WebUI 密码（或启用了 HTTPS / 反向代理认证），MP 侧没有同步更新。

## 结论

- qBittorrent 的 WebUI 凭据改动必须**两侧同步**：qB 侧改完，MP「下载器」配置里立刻更新。
- qB 开启「对 localhost 绕过认证」选项时，容器内外的 MP 走的路径不同，别依赖这个旁路。
- 密码这类敏感信息不出现在日志和截图里，排障时用「测试连接」按钮验证。

## 关联设置

- **下载器**：设定 → 下载器，测试连接通过后再保存
