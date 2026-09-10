# Host-adapt · 落点矩阵与 CLI

> 适配表示例：[`examples/mvp-hosts.yaml`](./examples/mvp-hosts.yaml)  
> Schema：[`host-adapt.schema.json`](./host-adapt.schema.json)  
> 仓根叙事：README「一包多宿主（F6）」· 录屏清单：[`../../../docs/guides/DOGFOOD_host_adapt_cursor_claude_录屏清单_v1_zh.md`](../../../docs/guides/DOGFOOD_host_adapt_cursor_claude_录屏清单_v1_zh.md)

## CLI

```bash
npx dsh-coding-kit host validate [--file PATH] [--json]
npx dsh-coding-kit host apply --tools cursor,claude --profile core [--dry-run|--yes]
npx dsh-coding-kit host update [--tools LIST] [--yes] [--force]
```

- 默认 **dry-run**；`--yes` 才写盘。  
- **U-01**：表 version / 可选 `dsh-tools` peer 不匹配 → exit **2**、零写入。  
- 默认**跳过** `harness-30-execute` / `harness-40-self-check`（与 `skills install` 同口径）。

## 宿主 × 表面（MVP）

| host_id | always_on | commands (core) | skills |
|---------|-----------|-----------------|--------|
| `cursor` | `.cursor/rules/*.mdc` | `.cursor/commands/kit-*.md` | `.cursor/skills` |
| `claude` | `CLAUDE.md`（marker merge） | `.claude/commands/kit-*.md` | `.claude/skills` |
| `dsh` | （可空） | **可空**（不强迫 slash） | `.dsh/skills`（≈ `skills install --target`） |
| `agents` | `AGENTS.md` | 可空 | `.agents/skills` |

Core 五命令：`kit-apply-standards` · `kit-verify` · `kit-gate-status` · `kit-init-guide` · `kit-hat-reanchor`（前缀 **`kit-`**；禁止冒充 `opsx-*`）。

## 纪律

- **S2**（`docs/tasks` / reviews / invokes）永不作为物化 target。  
- **local** 块（`cyning-harness-local`）永不覆写。  
- **update**：conflict 默认 skip；`--force` 显式覆盖并备份 `.coding-kit/backups/host-update/`。
