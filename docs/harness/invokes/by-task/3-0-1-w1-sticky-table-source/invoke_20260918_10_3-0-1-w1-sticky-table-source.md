# Invoke：10（task 起草）· 3-0-1-w1-sticky-table-source

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-1-w1-sticky-table-source` |
| task_paths | `docs/tasks/active/task_3_0_1_w1_sticky_table_source.md` |
| plan_path | `docs/roadmap/PLAN_3_0_1_patch_v1_zh.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |

## 授权来源

00 委派（invoke `docs/harness/invokes/by-task/3-0-1-patch-plan/invoke_20260918_00_3-0-1-patch-plan.md`）：维护者 2026-09-18 签收 PLAN（HG-NEXT-PLAN=approved）并授权 00 代签过程文档闸；本帽只起草 W1 唯一核心波次 task，**不代签任何闸**、不改 `src/`。

## 动作

1. 通读 PLAN 全文（W1 节 · 硬约束 3/4/5 · 非范围表 · 波次总表 W1 行）+ 验收报告镜像 §6.1 P1-1。
2. 对照先例 `task_2_4_2_patch.md`（patch / 无 SPEC）与 `task_3_0_w1_schema_leap.md`（多波首波形态）择适：本波采 **2.4.x patch 元信息 + 闸表**，无 HG-SCHEMA-CHANGE。
3. **再钉 file:line 现值**（2026-09-18）：`sticky.ts:8-14` / `:97-113` · `cmd.ts:652` / `:656` / apply `:363` / update `:548` · `table.ts:99-102`。
4. 落盘 `docs/tasks/active/task_3_0_1_w1_sticky_table_source.md`（slug `3-0-1-w1-sticky-table-source` · status `draft` · HG-TASK-DRAFT/HG-AUDIT-R1=pending · HG-SPEC-SIGNOFF=N/A · 闸表 4 列 · id 单元格无内嵌 `**`）。
5. 范围严格对齐 PLAN W1（可选 `table_source` · verify 取表优先级 · fail-closed 不静默 · 回归锁）；硬约束：version 保持 1 · 字段可选 · 双向兼容留证 · 不触 schema · 不改判定松紧 · 不 bump 默认物化。
6. `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w1_sticky_table_source.md` → 修至 PASS。

## 未做（禁区）

- 未改 `src/` / `test/` / README 产品文 / 单测实现
- 未开 W2–W6 task · 未代签任何闸 · 未 git commit / push / publish

## 下一棒

20-task-audit R1（重点：必填误实现风险 · sha256 WARN vs 硬红 · 双向兼容留证口径 · 范围未扩 W2+）→ 审查文落 `docs/harness/reviews/` → 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 → 30/40（GATE_VERIFY 首输出 → `fix(3.0.1-W1): …` → 自证 → `task close --yes`）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 10-task：W1 sticky table_source task + 本 invoke 落盘 · lint 见同窗回报 |
