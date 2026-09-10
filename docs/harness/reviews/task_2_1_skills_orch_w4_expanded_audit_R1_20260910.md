# Task Audit R1：2_1-skills-orch-w4-expanded

> **task**：`docs/tasks/active/task_2_1_skills_orch_w4_expanded.md`  
> **日期**：2026-09-10  
> **角色**：20-task-audit（00 统筹代签）  
> **对照**：SPEC `02` §3 · PLAN B-EXPANDED · **W3 DONE**

---

## 结论

| 项 | 判定 |
|----|------|
| 验收可测 | 是（core 无 hat 壳；expanded 有；conflict/force） |
| 与 SPEC 对齐 | 是 |
| 依赖 | W3 DONE |
| freeze 充分 | 是 |
| **签收** | **HG-AUDIT-R1=approved** · 可 30 |

---

## Freeze（本波生效）

| ID | 冻结值 |
|----|--------|
| CLI | `host apply|update` 允许 `--profile core\|expanded`（默认 **core**） |
| expanded 物化 | Cursor：`.cursor/commands/kit-hat-*.md`（及 SPEC `02` §3 所列 `kit-graph-check` / `kit-sync-prompts-guide` **本波至少落地 kit-hat-*** 五条帽子薄壳；graph/sync 可选但建议一并） |
| Claude | `.claude/commands/kit/hat-<…>.md` 或与 Cursor 对称的 `kit/hat-00-delegate.md` 等（命名须能形成 `/kit:hat-…`；**禁止** `kit-30`） |
| 正文 | 薄 POINTER → 对应 `harness-*` skill；不复制 L1 全文 |
| 默认 | `--profile core`（或缺省）**不得**写出任何 `kit-hat-*` |
| conflict/`--force` | 与 2.0 host update 同口径 |
| 仍跳过 | 30/40 execute **skills**；禁 `kit-publish` / 无闸 `kit-30` |
| 禁区 | 不 bump 2.1.0；不 publish；不改 W3 dsh orch 语义 |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | R1 pass · 00 代签 |
