# invoke · 00 · 2.2.0 闭环起步 W8 派工留档（pre-30）

> **hat_id**：`00` · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w8-release-prep`

## 人授权（原文意图）

维护者 2026-09-11 会话预授权 + **直接下令执行 2.2.0 发版前 bump**：「维护者已直接下令本动作；发布本体 push/tag/npm publish 归维护者，你禁止 publish/tag/push」→ HG-SPEC-SIGNOFF / HG-NEXT-PLAN / HG-TASK-DRAFT / HG-AUDIT-R1 = **approved**（00 代签落表 · bump 为维护者直接下令的机械动作 · 与 2.2.0 系列代签先例同构）。

## 动作

1. 委派 10-task 起草 `task_2_2_closed_loop_w8_release_prep.md`；委派 20-task-audit R1 书面审（审查文落盘 pass）
2. 落 task 人工闸表：四闸 approved（00 代签注明授权出处）
3. pre-30 invoke 留档：`invoke_20260911_{10,20,00}_2-2-closed-loop-w8-release-prep.md` 三件齐（v2.14+ 硬闸）
4. 禁令复述入 task failure_paths：禁 publish/tag/push · 禁 `git add -A` · 不裹挟 `.workbuddy/`

## 下一棒

30 执行 bump（package.json → 2.2.0 · pins check/fix · CHANGELOG 2.2.0 节 · spec 索引行 IMPLEMENTED · 四门绿 · 精确 add 提交）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w8_release_prep.md` 过闸扫描。
