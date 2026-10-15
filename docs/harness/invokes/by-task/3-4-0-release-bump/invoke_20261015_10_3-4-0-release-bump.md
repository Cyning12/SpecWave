# invoke · 10-task · 3-4-0-release-bump

> **hat_id**：`10-task` · **日期**：2026-10-15  
> **task_slug**：`3-4-0-release-bump`  
> **性质**：PR #36（review-gates 址B 双址 · Closes #35）合入后 release 波起草（沿 3.0.2 release 模板 + 两差异）

## 产出

- [`docs/tasks/active/task_3_4_0_release_bump.md`](../../../../tasks/active/task_3_4_0_release_bump.md)（初稿 · 闸表 4 列 · 双 release 闸 pending · R0–R5 预置 · A1–A11）

## 两差异（相对 3.0.2 release task）

1. tag/push **不**授权代跑（维护者本窗 2026-10-15「我来操作发版」· HG-RELEASE-TAG-PUSH / HG-RELEASE-PUBLISH 均 pending · 三动作全仅人）
2. 3.3.0 回填清偿并入（registry `latest=3.3.0` · `time.3.3.0`=2026-10-11T06:33:10.216Z · tag `v3.3.0` ↔ `197b337` · 均 2026-10-15 `npm view`/git 实测）

## 版本裁定

minor（3.3.0 → 3.4.0）：PR #36 = feat 向后兼容新增（`findLatestReview` 扫描面扩第三址 + 址B 命名口径 · 既有址A 行为不变 · 反向钉死测试在案）· semver minor。

## 机械闸

- `task lint` PASS（W3 占位提醒为 draft 期合法）

## 交接

- 下一棒：20-task-audit R1 → 00 代签 → 30/40 簿记（**禁** tag/push/publish/deprecate）
