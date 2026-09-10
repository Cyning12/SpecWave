---
name: "/kit-init-guide"
id: "kit-init-guide"
description: "分清插件 init_coding_kit 与 CLI init（双入口不合并）"
kit_command_id: kit-init-guide
---

双入口互不替代，禁止混成同一动词。

插件面（DSH 会话）：
- 工具名是 init_coding_kit（不是 CLI 子命令）
- 对话请模型调用该工具；不覆盖已有文件

CLI 面（Cursor / CI / 终端）：
- npx dsh-coding-kit init --preset harness-only [--yes]
- 过程落盘根 .coding-kit/ ；不写 S2 过程域

勿把 init_coding_kit 与 CLI init 写成同一步。POINTER：仓根 README「选哪条入口」。
