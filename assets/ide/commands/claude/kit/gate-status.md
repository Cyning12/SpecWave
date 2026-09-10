---
description: 扫人工闸与 status（声称与闸表冲突则 STOP）
kit_command_id: kit-gate-status
---

1. 读现行 task 的人工闸表（真值在 task 文件，不在聊天声称）
2. 必跑：npx dsh-coding-kit status --target . [--task <path>]
3. 可选：npx dsh-coding-kit gate-check --task <path>
4. 用户声称与闸表冲突 → STOP，以 task 表为准
5. 勿复制 hat / L1 / L2 全文；POINTER：docs/harness/prompts/
