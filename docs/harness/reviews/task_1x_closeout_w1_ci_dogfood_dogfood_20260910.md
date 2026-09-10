# Dogfood 纪要 · W1 C3 · 1x-closeout

> **日期**：2026-09-10  
> **CLI**：`node --experimental-strip-types src/cli.ts`（本仓源）  
> **目标目录**：`/tmp/dsh-dogfood-RHeM2C`（临时 · 已可删）

## 步骤与退出码

| 步骤 | 命令 | exit |
|------|------|------|
| init | `init --preset harness-only --yes` | **0** |
| check | `check` | **0** |

## 观察

- 写入根：`.coding-kit/manifest.json`（**未**写 `.cyning-harness/`）
- `manifest.version` = 当时包版本；`preset=harness-only`；`check` 输出「已是最新」
- 未触碰 S2（`docs/tasks` / reviews / invokes）

## 结论

消费者最小路径 **init → check** exit 契约与 P0 文档一致（0=放行）。无缺陷开单。
