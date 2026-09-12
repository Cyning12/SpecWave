# invoke · 10-task · 2.2.0 闭环起步 W3 task 起草

> **hat_id**：`10-task` · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w3-verify-json-fields`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-11 会话预授权（00 委派本棒批量起草 W2–W7 task）· HG-SPEC-SIGNOFF / HG-NEXT-PLAN / HG-TASK-DRAFT = approved（00 代签落表）· 出处：`docs/harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md`

## 动作

1. 起草 `docs/tasks/active/task_2_2_closed_loop_w3_verify_json_fields.md`（verify --json 补字段（C2））
2. 预填 Harness 元信息（批量拆 task 义务 · K4）：test_strategy / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / **wiki_delta=none（预填）** / invoke_retention_profile=default
3. 人工闸表：HG-AUDIT-R1 保持 **pending**（10 不签发 · 待 20-task-audit R1 + 人签）
4. 预置 R0 + R1–R5 思考轮槽 + 思考轮控制表（residual_risks 已填）
5. 机械闸：`npx spec-wave task lint --file` → **PASS**；`task lint-wiki-delta --scope active` → PASS（scanned 7 · issues 0）

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` 代码资产 / `.github/` / `delivery/` / `package.json`
- 未碰 `task_2_2_closed_loop_w1_release_pins.md` 与 `docs/spec/2_2-closed-loop-start/*`（另一棒负责）
- 未签 HG-AUDIT-R1

## 下一棒

20-task-audit R1 书面审 → 人签 HG-AUDIT-R1 → 30 派工（`feat(2.2-W3): …` · 禁 git add -A）。
