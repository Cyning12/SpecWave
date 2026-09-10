# Invoke · 30/40 · 2_1-skills-orch-w1-skills-parity

| 字段 | 值 |
|------|-----|
| task_slug | `2_1-skills-orch-w1-skills-parity` |
| hat_id | `30（含 40）` |
| opened | 2026-09-10 |
| status | **closed** |
| notes | 00 派发 · HG-AUDIT-R1=approved · 维护者签收授权本窗过程档 |

## 关棒摘要（≤10 行）

1. 冒烟：`host apply --tools cursor,claude,dsh --profile core --yes` 已物化三方六条；无 30/40 → **无 src 缺口**  
2. 新增 `test/host-adapt-w1-skills-parity.test.ts`（存在性 + 禁 30/40）· exit **0**  
3. DOGFOOD §5.1 Skills/`/h` 口径；`05` 交叉指针；CHANGELOG Unreleased W1 一句  
4. 未碰 W2 Claude `/kit:`、W3 kit-* 编排、bump/publish/commit  
5. `04` §W1 断言项与录屏口径已勾（R1 除外按派发）

## 开棒 Prompt（交给 30）

Open Folder = `dsh-coding-kit/`。读：

1. `docs/tasks/active/task_2_1_skills_orch_w1_skills_parity.md`
2. `docs/harness/reviews/task_2_1_skills_orch_w1_skills_parity_audit_R1_20260910.md`（freeze）
3. SPEC `01` / `04` §W1 · PLAN_2_1 W1

实现并验收：

- 单测：tmp 仓 `host apply --tools cursor,claude,dsh --profile core --yes` 后，三方 skills 根下存在六条 harness（跳过 30/40）
- 缺口才改 `src/` / 适配表；**禁止** W2 Claude 子目录、W3 DSH kit 编排、bump/publish
- 四门相关：至少 `npm test` 中新测绿；typecheck 若动 TS
- 回填 task 自检结论 + 勾选范围；本 invoke 关棒摘要 ≤10 行

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开棒 |
| 2026-09-10 | 关棒 · 测绿 · 文档 · closed |
