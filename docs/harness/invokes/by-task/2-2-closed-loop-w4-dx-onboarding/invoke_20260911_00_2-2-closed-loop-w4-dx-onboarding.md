# invoke · 00 · 2.2.0 闭环起步 W4 派工留档（pre-30）

> **hat_id**：`00` · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w4-dx-onboarding`

## 人授权（原文意图）

维护者 2026-09-11 会话预授权：「授权签收此次 spec 及其相关后续所有过程文档」→ HG-SPEC-SIGNOFF / HG-NEXT-PLAN / HG-TASK-DRAFT = **approved**（00 代签落表 · 出处 `docs/harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md`）。

## 动作

1. 委派 10-task 子棒起草 `task_2_2_closed_loop_w4_dx_onboarding.md`（W2–W7 批量 · 本档为 W4 单波）
2. 落 task 人工闸表：三闸 approved（00 代签注明）· **HG-AUDIT-R1 = pending（仅人签 · 00 不代）**
3. pre-30 invoke 留档：本份 + `invoke_20260911_10_2-2-closed-loop-w4-dx-onboarding.md`（v2.14+ 硬闸）
4. lint-wiki-delta 早检已跑（`task lint-wiki-delta --scope active` → PASS · scanned 7 · issues 0）

## 下一棒

20-task-audit R1（书面审 → `docs/harness/reviews/`）→ 维护者签 HG-AUDIT-R1 → 30 改码。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w4_dx_onboarding.md` 过闸扫描。
