# Invoke：10（task 起草）· 3-0-1-release-bump

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-1-release-bump` |
| task_paths | `docs/tasks/active/task_3_0_1_release_bump.md` |
| plan_path | `docs/roadmap/PLAN_3_0_1_patch_v1_zh.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |

## 授权来源

00 委派 / 维护者下令「继续」：W1–W6 均已 CLOSE: PASS；开 **3.0.1 release** 波。本帽只起草 release bump task，**不代签任何闸**、不改 `src/` 产品逻辑、不执行 tag/push/publish。

## 动作

1. 通读 PLAN **release 行** · **发布边界** · HG-RELEASE（仅人）· 硬约束 **10/12**。
2. 对照先例：`docs/tasks/done/task_2_4_2_patch.md` bump 段 · `ACCEPTANCE_2_4_2_patch_2_4_2_zh.md` · `RELEASING.md` · W7 `HG-RELEASE blocks=—` 裁定。
3. 摘要 W1–W6 done tasks 入 CHANGELOG Fixed/Added 规划骨架；确认 MIGRATION 缺「3.0.0→3.0.1 无强制动作项」。
4. 落盘 `docs/tasks/active/task_3_0_1_release_bump.md`（slug `3-0-1-release-bump` · status `draft` · HG-NEXT-PLAN=approved · SPEC=N/A · TASK-DRAFT/AUDIT-R1=pending · HG-RELEASE=pending 且 `blocks_hats=—` · 闸表 4 列 · id 单元格无内嵌 `**`）。
5. 范围钉死：package.json 手工 bump · CHANGELOG 先行 · pins fix（pin-10 设计红）· ACCEPTANCE · 手册钉策略 · RELEASING checklist · MIGRATION 无动作项；`test_strategy=required`。
6. `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_release_bump.md` → 修至 PASS。

## 未做（禁区）

- 未改 `src/` 产品逻辑 / 未改 W1–W6 已交付行为
- 未代签任何闸 · 未 git commit / tag / push / publish

## 下一棒

20-task-audit R1（重点：CHANGELOG W1–W4 归拢 · 手册保留文件名 vs 改名 · MIGRATION 无动作项 · HG-RELEASE 不拦 30 · RELEASING 双重敏感）→ 审查文落 `docs/harness/reviews/` → 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 → 30/40（GATE_VERIFY 首输出 → `chore(release): bump to 3.0.1` → 自证 → `task close --yes`）→ **人** HG-RELEASE（tag/push/publish）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 10-task：3.0.1 release-bump task + 本 invoke 落盘 · lint 见同窗回报 |
