# Invoke：10（task 起草）· 3-0-1-w3-pins-io-failclosed

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-1-w3-pins-io-failclosed` |
| task_paths | `docs/tasks/active/task_3_0_1_w3_pins_io_failclosed.md` |
| plan_path | `docs/roadmap/PLAN_3_0_1_patch_v1_zh.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |

## 授权来源

00 委派：W1/W2 均已 CLOSE: PASS；维护者 2026-09-18 签收 PLAN（HG-NEXT-PLAN=approved）并授权 00 代签过程文档闸；本帽只起草 **W3** task，**不代签任何闸**、不改 `src/`、不开 W4+。

## 动作

1. 通读 PLAN **W3 节** · 硬约束 3/5 + 验收报告镜像 §6.3 P3-8（含 A1–A4）。
2. 对照先例 `docs/tasks/done/task_3_0_1_w2_gate_table_contract.md`（同系列元信息 / 闸表 4 列 / 无 SPEC）。
3. **再钉 file:line 现值**（2026-09-18）：`src/cli-pins.ts:62-83`（`loadPins`）· `:85-91`（`readTruthVersion` · `:87` existsSync · `:88` 裸 `JSON.parse`）。
4. 落盘 `docs/tasks/active/task_3_0_1_w3_pins_io_failclosed.md`（slug `3-0-1-w3-pins-io-failclosed` · status `draft` · HG-TASK-DRAFT/HG-AUDIT-R1=pending · HG-SPEC-SIGNOFF=N/A · 闸表 4 列 · id 单元格无内嵌 `**`）。
5. 范围严格对齐 PLAN W3（try/catch → exit 2 + `PINS: BLOCKED` · TOCTOU · 三负向 · 保留缺文件原文案）；不改 PASS/`pins fix`/其他 exit；不引入通用 IO 框架。
6. `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w3_pins_io_failclosed.md` → 修至 PASS。

## 未做（禁区）

- 未改 `src/` / `test/` / 产品文 / 单测实现
- 未开 W4–W6 task · 未代签任何闸 · 未 git commit / push / publish

## 下一棒

20-task-audit R1（重点：缺文件文案保留 · 三负向锁 · 不改 PASS/`pins fix` · 范围未扩 W4+）→ 审查文落 `docs/harness/reviews/` → 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 → 30/40（GATE_VERIFY 首输出 → `fix(3.0.1-W3): …` → 自证 → `task close --yes`）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 10-task：W3 pins-io-failclosed task + 本 invoke 落盘 · lint 见同窗回报 |
