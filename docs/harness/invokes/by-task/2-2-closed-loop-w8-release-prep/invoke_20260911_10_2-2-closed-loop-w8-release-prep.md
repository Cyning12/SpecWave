# invoke · 10-task · 2.2.0 闭环起步 W8 task 起草（发版前 bump）

> **hat_id**：`10-task` · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w8-release-prep`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-11 会话预授权 + **直接下令本 bump 动作**（bump 为机械动作 · 发布本体 push/tag/publish 归维护者）· HG-SPEC-SIGNOFF / HG-NEXT-PLAN / HG-TASK-DRAFT = approved（00 代签落表 · 出处：`docs/harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md`）

## 动作

1. 起草 `docs/tasks/active/task_2_2_closed_loop_w8_release_prep.md`（2.1.3 → 2.2.0 发版前 bump）
2. 预填 Harness 元信息：test_strategy=required / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / **wiki_delta=none（预填）** / invoke_retention_profile=default / close_pr_policy=exempt
3. 人工闸表：四闸（HG-SPEC-SIGNOFF / HG-NEXT-PLAN / HG-TASK-DRAFT / HG-AUDIT-R1）按维护者会话预授权 + 00 代签先例落 approved；HG-AUDIT-R1 由 20-task-audit R1 审查文 pass 支撑（bump 为维护者直接下令的机械动作）
4. failure_paths 明示：禁 publish/tag/push · 禁 `git add -A` · pins fix 漏网钉面手工修留痕 · 四门红停止
5. 预置 R0–R5 思考轮槽 + 思考轮控制表（residual_risks 已填：pin-10 tag 待人打的 pins check 口径）

## 未做（禁区）

- 未改 `package.json` / `src/` / `test/` / `assets/` / `CHANGELOG.md` / `docs/spec/README.md`（30 的事）
- 未执行 git tag / git push / npm publish（归维护者 · 本 task 非范围）
- 未裹挟 `.workbuddy/`

## 下一棒

20-task-audit R1 书面审 → 落审查文 → 00 派 30（`chore(release): bump to 2.2.0 — closed-loop start` · 禁 git add -A）。
