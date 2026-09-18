# Invoke：00 · 3-0-1-w4-docs-precision · 代签 → 派 30

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-1-w4-docs-precision` |
| review | `docs/harness/reviews/task_3_0_1_w4_docs_precision_audit_R1_20260918.md` |
| created | 2026-09-18 |

## 代签

| 闸 | 状态 | 依据 |
|----|------|------|
| HG-TASK-DRAFT | approved | lint PASS · invoke 齐 |
| HG-AUDIT-R1 | approved | R1 PASS · blocking 0 |

授权：维护者「授权签收过程文档」· HG-RELEASE 不在范围。

## 带入 30（PLAN W4 五项）

1. MIGRATION §①：「默认落点不变；内置表升级 v2 + hooks 物化（additive）」
2. CHANGELOG Tests：859 → **864**（863 pass + 1 skip）+ TTY hotfix 注记；tag-gated 改过去式
3. package.json `files` 补 `README.zh-CN.md`（pack dry-run 清单须不变）
4. research_report 作者数 → 区间 + `as_of 2026-09`
5. check-doc-links 注释：`.workbuddy/` 除 9 件 tracked 外忽略（**不迁文件**）

**硬钉**：禁提前开 W6-①；改后全量 `npm test`（pins）；禁 `git add -A`。

## 下一棒

30/40：GATE_VERIFY → 五项口径 → 验收 grep/pack/doc-links/test → `task close --yes` · 建议 `fix(3.0.1-W4): …` · **不要 git commit**

## 修订

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 00 代签双闸 · 派 30/40 |
