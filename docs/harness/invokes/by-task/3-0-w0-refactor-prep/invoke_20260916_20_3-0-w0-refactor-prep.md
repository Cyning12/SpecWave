# Invoke：20（task-audit R1）· 3-0-w0-refactor-prep

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w0-refactor-prep` |
| task_paths | `docs/tasks/active/task_3_0_w0_refactor_prep.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 指令摘要

对 W0 task（3.0 首波 · 三 god-file 拆分 barrel 化 + E3 第一批 + 六重锁 + M1 验收文）做 R1 书面审查：对照 SPEC 01/政策边界/系列 README/PLAN W0 节逐项核对范围/非范围/验收/failure_paths/思考轮；逐条复核 10-task 留下的五条重点（D6 消费者增补 · 锁① 基线口径 · E3 烟测档位 · 锁③ 快照脚本 · W0-SPLIT 与 M1 衔接）；审查文落盘 `docs/harness/reviews/`。**禁止**改 task 实质、代签 HG-AUDIT-R1、改 SPEC/PLAN/src/test。

## 独立复核证据（本帽实测）

- 消费者 grep（静态 + 动态宽口径）：锁② 10 文件清单无漏无多；`src/cli.ts` 测试直接消费者仅 `test/init.test.ts`（已在清单）
- `npm test` 全量复跑：607 tests / 116 suites / 602 pass / 4 fail / 1 skip —— 与 task 基线逐字一致；4 红 = D8（cli-docs-122）+ D8（cli-p0）+ pack-hygiene ×2
- 干净 cache 对照实验重做：3 个 pack 系文件 **24/24 转绿**（F-W0-07 定性复现）
- typecheck 0 错 · test:lib 6/6 · pins 17/17 · export 计数 43/9/7 · 行数 1458/1318/1007=3783 —— 全部独立复现

## 结论

**PASS-with-issues**（blocking 0 · advisory 4：A1 行号标注 · A2 spawn 口径登记 · A3 环境红登记粒度 · A4 降级态 M1 字段）—— 审查文：`docs/harness/reviews/task_3_0_w0_refactor_prep_audit_R1_20260916.md`

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 代签 · 维护者 2026-09-16 授权模式）
- ⛔ 未改 task / SPEC / PLAN / src / test（S2 只新增：本 invoke + 审查文）
- ⛔ HG-AUDIT-R1 仍 pending ⇒ 未附 30 Prompt，仅出维护者签闸清单

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 20-task-audit R1 审查完成落盘 |
