# Task Audit R1：2x-host-adapt-w2-cursor-claude

> **task**：`docs/tasks/active/task_2x_host_adapt_w2_cursor_claude.md`  
> **日期**：2026-09-10  
> **角色**：20-task-audit（00 统筹代签 · 维护者授权本窗 W1–W5）  
> **对照**：SPEC `00` / `01` / `02` / `04` §W2 · PLAN_2x W2 · 依赖 W1 **DONE**

---

## 结论

| 项 | 判定 |
|----|------|
| 验收可测 | 是（dry-run 报告 · `--yes` 落点 · S2 拒 · local 不覆写 · backup） |
| failure_paths | 是（W2-01 已满足：W1 CLOSE；W2-02 须有备份策略） |
| 与 SPEC 对齐 | 是（F6-B ≥2 非 DSH；commands=core；Verify 不物化伪闸） |
| test_strategy | `required` · 充分 |
| 非范围 | 清晰（无 skills update / 无 DSH U-01 / 无 bump） |
| **签收** | **HG-AUDIT-R1=approved** · 可 30 |

**零阻塞**：W1 已 CLOSE；apply 只物化 always_on + commands(core)。

---

## Freeze（本波生效）

| ID | 冻结值 |
|----|--------|
| CLI | `npx dsh-coding-kit host apply --tools cursor,claude --profile core [--target PATH] [--file PATH] [--json] [--dry-run\|--yes]` |
| 默认 | **dry-run**（零写入）；`--yes` 才写盘；`--yes` 与 `--dry-run` 不可同现 → exit 1 |
| 表 | 先 `validate`；失败 → **exit 2**、不写 |
| 宿主 | `--tools` 逗号分隔；本波测 **cursor+claude**；未知 host_id → exit 1；**不**因 dsh 行 commands=[] 失败 |
| always_on · md | `CLAUDE.md`（及若表含 AGENTS）：**marker merge** 产品块 `cyning-harness:begin/end`；**永不**改 `cyning-harness-local`；无文件则新建产品块；无 marker 的既有文件 → **追加**产品块（不整文件覆写） |
| always_on · mdc | `.cursor/rules/*.mdc`：缺失则写；已存在且内容不同 → 备份后写 **仅当** kit 管理（含产品 marker 或同源头）；否则 conflict 跳过（`--force` 本波可不实现，留给 W3） |
| commands | 从 `assets/ide/commands/{cursor,claude}/kit-*.md` 物化 core 五条；文件名 `kit-*.md`；**禁止** `opsx-*` |
| S2 | 任一写盘路径 `assertNotS2Abs` / `isS2RelPath` → **exit 2** 且零写入（先规划后写） |
| 备份 | `--yes` 覆写已存在文件前：复制到 `.coding-kit/backups/host-apply/<UTCts>/`（对标 refresh-ide-blocks · 保留 5 代） |
| skills | **本波不物化** skills 行 |
| 双入口 | `kit-init-guide` 必须分清插件 `init_coding_kit` ≠ CLI `init` |
| Verify | command 只编排 CLI；`kit-verify` 明示 exit 0/1/2；禁止 markdown 假装闸过 |

---

## 对照清单

| 来源 | 要求 | R1 |
|------|------|----|
| `04` W2 | dry-run 报告完整 | 纳入 30 |
| `04` W2 | `--yes` always_on + commands(core)；不碰 S2 | 纳入 |
| `04` W2 | Cursor 可见 `kit-verify`（文件存在断言） | 纳入单测 |
| `04` W2 | local / 用户块不覆写 | 纳入单测 |
| `00` | kit-* 前缀；Verify 真值 CLI | 纳入资产纪律 |
| W2-02 | `--yes` 须可回滚 | 备份目录冻结 |

---

## 缺口（不阻塞 · 30 自消）

1. core 五命令薄 POINTER，勿复制 L1/L2/hat 全文。  
2. README + CHANGELOG Unreleased 一句。  
3. `host apply` 未知子命令以外：W3 的 `host update` 本波仍可 exit 1。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | R1 通过 · 00 代签 HG-AUDIT-R1 |
