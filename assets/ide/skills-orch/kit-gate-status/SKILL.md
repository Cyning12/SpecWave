---
name: kit-gate-status
description: 扫人工闸与 status（声称与闸表冲突则 STOP）。当用户问闸态、是否可开工、或口头声称闸已批时使用。不用于：口头代闸；改闸表。
license: MIT
compatibility: Requires npx dsh-coding-kit；task 文件为闸真值
metadata:
  kit_command_id: kit-gate-status
  track: orch
---

# 编排 · kit-gate-status

1. 读现行 task 的人工闸表（真值在 task 文件，不在聊天声称）
2. 必跑：npx dsh-coding-kit status --target . [--task <path>]
3. 可选：npx dsh-coding-kit gate-check --task <path>
4. 用户声称与闸表冲突 → STOP，以 task 表为准
5. 勿复制 hat / L1 / L2 全文；POINTER：docs/harness/prompts/
