# Invoke：10（task 起草）· 3-0-1-w2-gate-table-contract

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-1-w2-gate-table-contract` |
| task_paths | `docs/tasks/active/task_3_0_1_w2_gate_table_contract.md` |
| plan_path | `docs/roadmap/PLAN_3_0_1_patch_v1_zh.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |

## 授权来源

00 委派：W1 已 CLOSE: PASS；维护者 2026-09-18 签收 PLAN（HG-NEXT-PLAN=approved）并授权 00 代签过程文档闸；本帽只起草 **W2** task，**不代签任何闸**、不改 `src/`、不开 W3+。

## 动作

1. 通读 PLAN **W2 节** · 硬约束 3/5 · 人工闸 HG-W2-REVIEW（条件闸）+ 验收报告镜像 §5.6 / §6.2 P2-4。
2. 对照先例 `docs/tasks/done/task_3_0_1_w1_sticky_table_source.md`（同系列元信息 / 闸表 4 列 / 无 SPEC）。
3. **再钉 file:line 现值**（2026-09-18）：`README.md:98` · `README.zh-CN.md:98` · `TASK_TEMPLATE.md:41` · `cli-shared.ts:25-26`（`GATE_ROW_RE`）· `:270-286`（`parseHumanGates`）。
4. 落盘 `docs/tasks/active/task_3_0_1_w2_gate_table_contract.md`（slug `3-0-1-w2-gate-table-contract` · status `draft` · HG-TASK-DRAFT/HG-AUDIT-R1/HG-W2-REVIEW=pending · HG-SPEC-SIGNOFF=N/A · 闸表 4 列 · id 单元格无内嵌 `**` · **含 HG-W2-REVIEW** 条件闸 blocks 30）。
5. 范围严格对齐 PLAN W2（README 4 列+提示 · 空解析告警 · id 内嵌 `**` 子形态 · 回归锁）；**不放宽** `GATE_ROW_RE`；exit 语义不变；告警 stderr / `--json#warnings`。
6. `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w2_gate_table_contract.md` → 修至 PASS。

## 未做（禁区）

- 未改 `src/` / `test/` / README 产品文 / 单测实现
- 未开 W3–W6 task · 未代签任何闸 · 未 git commit / push / publish

## 下一棒

20-task-audit R1（重点：不放宽正则 · 告警通道不污染 JSON · HG-W2-REVIEW 启用理由 · 样例入测断言 · 范围未扩 W3+）→ 审查文落 `docs/harness/reviews/` → 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 + HG-W2-REVIEW → 30/40（GATE_VERIFY 首输出 → `fix(3.0.1-W2): …` → 自证 → `task close --yes`）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 10-task：W2 gate-table-contract task + 本 invoke 落盘 · lint 见同窗回报 |
