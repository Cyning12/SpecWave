# Invoke：10（task 起草）· 3-0-1-w6-mech-coverage

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-1-w6-mech-coverage` |
| task_paths | `docs/tasks/active/task_3_0_1_w6_mech_coverage.md` |
| plan_path | `docs/roadmap/PLAN_3_0_1_patch_v1_zh.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |

## 授权来源

00 委派：W1–W5 均已 CLOSE: PASS（硬约束 9 已满足）；维护者 2026-09-18 签收 PLAN（HG-NEXT-PLAN=approved）并授权 00 代签过程文档闸；本帽只起草 **W6** task，**不代签任何闸**、不改 `src/`、不开 release bump。

## 动作

1. 通读 PLAN **W6 节** · 硬约束 **3/5/9** · 风险 **4** + 验收报告镜像 §6.3 P3-2 / P3-7。
2. 对照先例 `docs/tasks/done/task_3_0_1_w5_pin_hook_version.md`（同系列元信息 / 闸表 4 列 / 无 SPEC）· 条件闸先例 `task_3_0_1_w2_gate_table_contract.md`（`HG-W2-REVIEW`）。
3. **再钉 file:line 现值**（2026-09-18）：`assets/harness/terminology.yaml:24-30` · `scripts/check-terminology.mjs:2-8/:59-60` · `CHANGELOG.md:134`（历史「门控手动测试」· 风险 4 活证）· `assets/harness/claims-boundary.yaml:69-73` · `scripts/check-claims.mjs:54-59` · `src/host/hooks.ts:60-79/:104-106` · `src/host/materialize.ts:508-511` · `src/host/cmd.ts:256-288` · `docs/guides/使用手册-v3.0.0-zh.md:450/:454-458` · `MIGRATION.md:141` 一带。
4. 落盘 `docs/tasks/active/task_3_0_1_w6_mech_coverage.md`（slug `3-0-1-w6-mech-coverage` · status `draft` · HG-TASK-DRAFT/HG-AUDIT-R1/HG-W6-REVIEW=pending · HG-SPEC-SIGNOFF=N/A · 闸表 4 列 · id 单元格无内嵌 `**`）。
5. 范围：① CHANGELOG→terminology（+claims 同口径评估）+「门控」负向 ② validate 非映射+config-hook→WARN（apply 仍 fail-closed）+ B5/MIGRATION 明写；非范围钉死：不改 apply · 不扩映射 · 不做 P3-1 语义匹配；`test_strategy=required`；条件闸说明由 20 裁定启用或 N/A。
6. `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w6_mech_coverage.md` → 修至 PASS。

## 未做（禁区）

- 未改 `src/` / `test/` / 产品文实质内容 / 单测实现（仅起草 task + 本 invoke）
- 未代签任何闸 · 未 git commit / push / publish · 未开 release bump

## 下一棒

20-task-audit R1（重点：历史节扫描面口径与 `HG-W6-REVIEW` 是否启用 · claims 是否纳入 CHANGELOG · WARN 契约只增不改 · 映射键文案对齐 CONFIG_HOOK_HOSTS · 硬约束 3 边界）→ 审查文落 `docs/harness/reviews/` →（若需）扫描面评审文 → 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 +（条件）HG-W6-REVIEW → 30/40（GATE_VERIFY 首输出 → `fix(3.0.1-W6): …` → 自证 → `task close --yes`）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 10-task：W6 mech-coverage task + 本 invoke 落盘 · lint 见同窗回报 |
