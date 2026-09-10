---
description: sync prompts 纪律：默认 dry-run；conflict 不覆盖
kit_command_id: kit-sync-prompts-guide
---

先跑 `npx spec-wave sync prompts`（默认 dry-run）看清单；再按需 `--yes`。
已存在且内容不同 → conflict，不覆盖，除非显式 `--force`。
只写 Starter prompts 白名单；禁止写入 S2（tasks/reviews/invokes）。
禁止无闸 `kit-30` / `kit-publish`。
