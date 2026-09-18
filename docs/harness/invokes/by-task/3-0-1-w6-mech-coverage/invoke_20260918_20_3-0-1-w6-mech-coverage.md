# invoke · 20-task-audit · 3-0-1-w6-mech-coverage（R1 书面审 · 实质审查已完成）

> **hat_id**：`20-task-audit` · **日期**：2026-09-18  
> **task_slug**：`3-0-1-w6-mech-coverage`  
> **性质**：实质审查留痕（本棒即 20 审查棒当棒落盘 · task `required_invoke_hats` 含 20）。

## 实质制品

1. 审查文：`docs/harness/reviews/task_3_0_1_w6_mech_coverage_audit_R1_20260918.md`  
   （**R1 结论：PASS · 零内容阻塞 · blocking=0** · 可进 00 代签 · **未附 30 Prompt**）
2. 扫描面评审文：`docs/harness/reviews/w6_changelog_scan_surface_review_20260918.md`  
   （**HG-W6-REVIEW 启用** · 全量扫 + `:134` 改措辞 · claims 本波不纳入）

## 动作（审查文自述摘要）

书面审 `docs/tasks/active/task_3_0_1_w6_mech_coverage.md`（对照 PLAN_3_0_1 W6 + 硬约束 3/5/9 + 风险 4 + acceptance §6.3 P3-2/P3-7 + 10 invoke · 先例 W5 R1 / W2 契约评审）：

1. 内容闸 / 流程闸分列：内容 **PASS**；`HG-TASK-DRAFT` / `HG-AUDIT-R1` / `HG-W6-REVIEW` 仍 **pending**（条件闸**启用** · 勿 N/A）。  
2. 核对：CHANGELOG→terminology + claims **评估** · validate WARN · B5/MIGRATION；**不改** apply · **不扩**映射 · **不做** P3-1。  
3. **独立再钉** `terminology.yaml:24-30` · `check-terminology.mjs:2-8/:59-60` · **`CHANGELOG.md:134`** · `claims-boundary.yaml:69-73` · `hooks.ts:60-79/:104-106` · **`materialize.ts:508-511`** · `cmd.ts:256-288` —— 全部精确命中。  
4. 扫描面裁定：全量扫 · `:134`「门控手动测试」**改措辞** · 禁仅现行节/整段加白；claims **不纳入**（`:94` 四宿主/406 用例 · 显式 A5 理由）。  
5. 只读 lint：`node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w6_mech_coverage.md` → `LINT: PASS`。

## 未做（禁区）

未改 task 实质内容 · 未改 `src/` / `test/` · 未代签 human_gate（三闸仍 pending）· 未 git commit / push / publish · **未附 30 可复制 Prompt**。

## 下一棒

00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 + **HG-W6-REVIEW**（维护者已授权过程闸 · 须已读 R1 + 扫描面评审文）→ 30/40（GATE_VERIFY 首输出 → `fix(3.0.1-W6): …` → 自证 → `task close --yes`）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 20-task-audit R1：task 审查文 + HG-W6-REVIEW 扫描面评审文 + 本 invoke 落盘 · 结论 PASS · 条件闸启用 |
