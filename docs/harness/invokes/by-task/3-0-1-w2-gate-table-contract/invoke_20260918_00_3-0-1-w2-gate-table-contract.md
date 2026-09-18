# Invoke：00（统筹）· 3-0-1-w2-gate-table-contract · 代签三闸 → 派 30

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-1-w2-gate-table-contract` |
| task_path | `docs/tasks/active/task_3_0_1_w2_gate_table_contract.md` |
| review_paths | R1 `task_3_0_1_w2_gate_table_contract_audit_R1_20260918.md` · 契约 `w2_gate_parse_warning_contract_review_20260918.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |

## 人授权

维护者 2026-09-18：「授权签收过程文档」——过程闸代签成立；HG-RELEASE / tag / push / publish **不在范围**。

## 代签

| 闸 | 动作 | 依据 |
|----|------|------|
| HG-TASK-DRAFT | approved | lint PASS · 10/20 invoke 齐 |
| HG-AUDIT-R1 | approved | R1 PASS · blocking 0 |
| HG-W2-REVIEW | approved | 契约评审 C1–C8 落盘 |

## 带入 30（契约裁定摘要）

1. 空解析告警：**stderr**（人读）+ `--json` 只增 `warnings: string[]`
2. 文案须覆盖：4 列提示 + id 内嵌 `**` 提示
3. **不放宽** `GATE_ROW_RE` · **不改** `evaluateMayStart30` / exit
4. README 双语 3→4 列 + 模板注明 id 禁内嵌粗体；样例入测

## 未做

本窗未改 `src/` · 未亲自 30 · 未 tag/push/publish

## 下一棒

30/40：GATE_VERIFY → 红测先行 → 实现 W2 → 自证 → `task close --yes` · 建议提交 `fix(3.0.1-W2): …` · 禁 `git add -A` · **不要代 commit**（留给维护者）

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 00 代签三闸 · 派 30/40 |
