# invoke · 20-task-audit · 3-0-1-w2-gate-table-contract（R1 书面审 · 实质审查已完成）

> **hat_id**：`20-task-audit` · **日期**：2026-09-18  
> **task_slug**：`3-0-1-w2-gate-table-contract`  
> **性质**：实质审查留痕（本棒即 20 审查棒当棒落盘 · task `required_invoke_hats` 含 20）。

## 实质制品

- 审查文：`docs/harness/reviews/task_3_0_1_w2_gate_table_contract_audit_R1_20260918.md`  
  （**R1 结论：PASS · 零内容阻塞 · blocking=0** · 可进 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 + HG-W2-REVIEW · **未附 30 Prompt**）
- 契约评审：`docs/harness/reviews/w2_gate_parse_warning_contract_review_20260918.md`  
  （**HG-W2-REVIEW**：additive 告警契约 · stderr + `--json#warnings` 只增不改 · 不放宽正则 · 不改 `evaluateMayStart30` · **可支撑 00 代签**）

## 动作（审查文自述摘要）

书面审 `docs/tasks/active/task_3_0_1_w2_gate_table_contract.md`（对照 PLAN_3_0_1 W2 + 硬约束 3/5 + acceptance §5.6/P2-4 + 10 invoke）：

1. 内容闸 / 流程闸分列：内容 **PASS**；`HG-TASK-DRAFT` / `HG-AUDIT-R1` / `HG-W2-REVIEW` 仍 **pending**。  
2. 核对：不放宽 `GATE_ROW_RE` · exit 语义不变 · 告警 stderr/`warnings` · id 内嵌 `**` 子形态 · 样例入测 · 未扩 W3+。  
3. **独立再钉** README.md:98 · README.zh-CN.md:98 · TASK_TEMPLATE.md:41 · cli-shared.ts:25-26/:270-286 —— 全部精确命中。  
4. 行为变更类：字面「旧测 grep」未单列，但 A1–A8 构成等价回归锁面 → **不退回**。  
5. 条件闸：落盘 HG-W2-REVIEW 契约评审文（通道 / 文案 / 只增不改 / 非 breaking）。  
6. 只读 lint：`node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w2_gate_table_contract.md` → `LINT: PASS`。

## 未做（禁区）

未改 task 实质内容 · 未改 `src/` / `test/` · 未代签 human_gate（三闸仍 pending）· 未 git commit / push / publish · **未附 30 可复制 Prompt**。

## 下一棒

00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 + HG-W2-REVIEW（维护者已授权过程闸 · 须已读两份审查文）→ 30/40（GATE_VERIFY 首输出 → 实现须遵守契约评审 C1–C8 → `fix(3.0.1-W2): …` → 自证 → `task close --yes`）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 20-task-audit R1：task 审查文 + HG-W2-REVIEW 契约评审 + 本 invoke 落盘 · 结论 PASS |
