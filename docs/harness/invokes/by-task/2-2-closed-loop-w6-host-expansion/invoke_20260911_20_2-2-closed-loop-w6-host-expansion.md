# invoke · 20-task-audit · 2.2.0 闭环起步 W6 task R1 书面审

> **hat_id**：`20-task-audit` · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w6-host-expansion`  
> **帽条文**：`assets/harness/prompts/20-task-audit.md`

## 授权来源

维护者 2026-09-11 会话预授权（00 代签先例 · 出处 `docs/harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md`）· HG-SPEC-SIGNOFF / HG-NEXT-PLAN / HG-TASK-DRAFT = approved

## 动作

1. 书面审 `docs/tasks/active/task_2_2_closed_loop_w6_host_expansion.md`（B1 三宿主）：对照 SPEC 核对范围/非范围/验收可断言/failure_paths 沿用/思考轮闭合/依赖行/禁 git add -A
2. 审查文落盘：`docs/harness/reviews/task_2_2_closed_loop_w6_host_expansion_audit_R1_20260911.md`（结论 pass · 零内容阻塞）
3. 翻 task 人工闸表 `HG-AUDIT-R1` pending → **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · R1 pass）
4. 机械闸：六份全完成后统一 `npx spec-wave verify --target . --task <task>` · 真实输出回填审查文
5. 依赖 W1 核对：release-pins.yaml 数据依赖 · schema 冻结 STOP 条款（F-W6-01）核对

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / `.github/` / `delivery/` / `package.json` · 未改 task 实质内容
- 未碰 W1 的 reviews 与 invokes/by-task/2-2-closed-loop-w1-*（另一子 Agent 负责）
- 未附 30 Prompt · 未派 30（闸表 approved 后由维护者 / 00 派工）

## 下一棒

维护者 / 00 派 30（`feat(2.2-W6): …` · 禁 git add -A）。