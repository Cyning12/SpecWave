# invoke · 10-task · 3-0-2-release-bump

> **hat_id**：`10-task` · **日期**：2026-09-23  
> **task_slug**：`3-0-2-release-bump`  
> **性质**：PLAN_3_0_2 release 波起草（沿 3.0.1 release 模板 + 三差异）

## 产出

- [`docs/tasks/done/task_3_0_2_release_bump.md`](../../../../tasks/done/task_3_0_2_release_bump.md)（初稿 · 闸表 4 列 · 双 release 闸 · R0–R5 预置 · A1–A12）

## 三差异（相对 3.0.1 release task）

1. tag/push 由 00 按维护者 2026-09-23 授权代跑（HG-RELEASE-TAG-PUSH=approved · 原子推 · 前置=验收全绿）
2. 3.0.1 回填清偿并入（registry `latest=3.0.1` · `time.3.0.1`=2026-09-18T07:42:30Z · tag `v3.0.1` ↔ `0e6d861` · 均 2026-09-23 `npm view`（绕缓存 `--cache /tmp` 避 EPERM）/git 实测）
3. 发布口径统一「待发版（publish 仅人）」（不冒充 published）

## 机械闸

- `task lint` PASS（W3 占位提醒为 draft 期合法）

## 交接

- 下一棒：20-task-audit R1 → 00 代签 → 30/40（**须待 W1/W2 close 后串行**）
