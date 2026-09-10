---
name: kit-init-guide
description: 分清插件 init_coding_kit 与 CLI init（双入口不合并）。当用户问如何初始化 coding-kit / 插件 vs CLI 时使用。不用于：静默改 S2。
license: MIT
compatibility: DSH 会话可调 init_coding_kit；CLI 用 npx dsh-coding-kit init
metadata:
  kit_command_id: kit-init-guide
  track: orch
---

# 编排 · kit-init-guide

双入口互不替代，禁止混成同一动词。

插件面（DSH 会话）：
- 工具名是 init_coding_kit（不是 CLI 子命令）
- 对话请模型调用该工具；不覆盖已有文件

CLI 面（Cursor / CI / 终端）：
- npx dsh-coding-kit init --preset harness-only [--yes]
- 过程落盘根 .coding-kit/ ；不写 S2 过程域

勿把 init_coding_kit 与 CLI init 写成同一步。POINTER：仓根 README「选哪条入口」。
