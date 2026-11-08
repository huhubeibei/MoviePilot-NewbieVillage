---
id: 06-nfs-stale
title: "容器突然起不来、路径全变死链？NFS stale handle 处理记"
domain: general
storyline: "目录与整理"
settings: "存储"
---

# 容器突然起不来、路径全变死链？NFS stale handle 处理记

## 现象

挂载 NFS 的虚拟机/容器启动失败，目录操作全部报 `Stale file handle`，之前一直好好的。

## 排查

1. **确认 NFS 服务端正常**：服务端（NAS）共享在线、导出配置没变。
2. **判断触发原因**：服务端重启/重建共享/存储池迁移后，客户端缓存的文件句柄（handle）失效，指向了不存在的 inode。
3. **验证方式**：对挂载点执行 `ls` 必现 Stale file handle，卸载重挂后恢复。

## 结论

- Stale file handle = 客户端缓存的句柄失效，**卸载重挂**即恢复（`umount` 后重新 `mount`，或 PVE 里重挂存储）。
- 依赖 NFS 挂载的容器要配置**启动顺序/依赖**：宿主挂载不正常时容器自动等待，避免反复崩溃重启。
- 长期方案：给关键挂载加 fstab/挂载配置的容错（`x-systemd.automount` 等按需挂载），减少启动时序问题。

## 关联设置

- **存储**：MP 侧确认映射路径在重挂后依然有效，必要时重启 MP 容器刷新句柄
