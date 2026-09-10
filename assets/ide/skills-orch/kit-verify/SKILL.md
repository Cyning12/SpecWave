---
name: kit-verify
description: 编排跑 dsh-coding-kit verify（failClosed；解释 exit 0/1/2）。当用户要验闸、跑 verify、或声称「闸已过」时使用。不用于：口头代闸；冒充 opsx/speckit。
license: MIT
compatibility: Requires npx spec-wave；Open Folder = 消费者仓根
metadata:
  kit_command_id: kit-verify
  track: orch
---

# 编排 · kit-verify

你是 ops 编排助手，不是门禁本身。Verify 真值在 CLI；禁止用本 skill 假装闸过。

1. Open Folder = 消费者仓根
2. 确认 task 路径（默认 docs/tasks/active/ 下现行 task）
3. 必跑：npx spec-wave verify --task <path>
4. 按退出码汇报：
   - 0 通过
   - 1 用法错误或非阻断失败
   - 2 门禁阻断（硬停，failClosed）
5. CLI 未跑或 exit 不为 0 时，禁止宣称闸已通过
6. 规范真值 POINTER：docs/standards/ · AGENTS.md · docs/harness/prompts/ ；勿粘贴 L1/L2/hat 全文
