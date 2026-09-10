# Host-adapt · 落点矩阵与 CLI

> 适配表示例：[`examples/mvp-hosts.yaml`](./examples/mvp-hosts.yaml)  
> Schema：[`host-adapt.schema.json`](./host-adapt.schema.json)  
> 仓根叙事：README「一包多宿主（F6）」· 录屏清单：[`../../../docs/guides/DOGFOOD_host_adapt_cursor_claude_录屏清单_v1_zh.md`](../../../docs/guides/DOGFOOD_host_adapt_cursor_claude_录屏清单_v1_zh.md)

## CLI

```bash
npx dsh-coding-kit host validate [--file PATH] [--json]
npx dsh-coding-kit host apply --tools cursor,claude --profile core|expanded [--dry-run|--yes]
npx dsh-coding-kit host update [--tools LIST] [--profile core|expanded] [--yes] [--force]
```

- 默认 **dry-run**；`--yes` 才写盘。  
- **U-01**：表 version / 可选 `dsh-tools` peer 不匹配 → exit **2**、零写入。  
- 默认**跳过** `harness-30-execute` / `harness-40-self-check`（与 `skills install` 同口径）。  
- **`expanded`**：在 core 之上物化 `kit-hat-*`（及 `kit-graph-check` / `kit-sync-prompts-guide`）；禁 `kit-30` / `kit-publish`。

## 宿主 × 表面（MVP）

| host_id | always_on | commands (core) | skills |
|---------|-----------|-----------------|--------|
| `cursor` | `.cursor/rules/*.mdc` | `.cursor/commands/kit-*.md` | `.cursor/skills` |
| `claude` | `CLAUDE.md`（marker merge） | `.claude/commands/kit/<verb>.md`（`/kit:verb`） | `.claude/skills` |
| `dsh` | （可空） | **`[]`（禁止 `.dsh/commands`）** | `.dsh/skills`：帽子 `assets/skills/*` **+** 编排 `assets/ide/skills-orch/*`（`/kit-*`；上游 deepseek-harness `project-dsh` / `docs/subsystems/skills.md`） |
| `agents` | `AGENTS.md` | 可空 | `.agents/skills` |

Core 五命令：`kit-apply-standards` · `kit-verify` · `kit-gate-status` · `kit-init-guide` · `kit-hat-reanchor`（前缀 **`kit-`**；禁止冒充 `opsx-*`）。  
Expanded（`--profile expanded`）：`kit-hat-00-delegate` · `kit-hat-10-spec` · `kit-hat-10-task` · `kit-hat-20-spec-audit` · `kit-hat-20-task-audit` · `kit-graph-check` · `kit-sync-prompts-guide`（Claude：`kit/hat-…` / `kit/graph-check` 等 → `/kit:hat-…`）。

## 纪律

- **S2**（`docs/tasks` / reviews / invokes）永不作为物化 target。  
- **local** 块（`cyning-harness-local`）永不覆写。  
- **update**：conflict 默认 skip；`--force` 显式覆盖并备份 `.coding-kit/backups/host-update/`。
