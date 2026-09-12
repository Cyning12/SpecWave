# invoke · 20-task-audit · W8 task R1 书面审（发版前 bump）

> **hat_id**：`20-task-audit` · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w8-release-prep`  
> **帽条文**：`assets/harness/prompts/20-task-audit.md`

## 授权来源

维护者 2026-09-11 会话预授权 + 直接下令 bump（00 代签先例落表 · 与 `spec_2_2_closed_loop_start_audit_R1_20260911.md` 同构）。

## 动作

1. 书面审 `docs/tasks/active/task_2_2_closed_loop_w8_release_prep.md`：范围/非范围/验收/failure_paths/R0–R5 逐条核对（轻量：bump 机械动作）
2. 核对 pins 机制覆盖钉面：`assets/release-pins.yaml` 12 钉面（pin-01..12）与 bump 触及落点（package.json version / ontology / discipline / README×2 / RELEASING / spec 索引行 / host-adapt README×2）一一对应；S2 机械拒写在案；pin-08 半可写（人工补行 · 本波转 IMPLEMENTED 属既有行改状态列）、pin-10 git tag 待人打
3. 结论落盘：`docs/harness/reviews/task_2_2_closed_loop_w8_release_prep_audit_R1_20260911.md` → **pass · 零内容阻塞**
4. task 人工闸表 HG-AUDIT-R1 → approved（00 代签注明授权出处）

## 未做（禁区）

- 未改 task 实质内容（审出阻塞则退回 10-task）
- 未改 `src/` / `test/` / `assets/` / `package.json`
- 未代签人闸实质授权（仅按维护者预授权落表）

## 下一棒

00 派 30 执行 bump；30 开工前 `npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w8_release_prep.md` 过闸扫描（GATE_VERIFY）。
