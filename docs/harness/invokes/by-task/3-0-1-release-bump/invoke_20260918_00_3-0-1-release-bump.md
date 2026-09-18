# Invoke：00 · 3-0-1-release-bump · 代签过程闸 → 派 30

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-1-release-bump` |
| review | `docs/harness/reviews/task_3_0_1_release_bump_audit_R1_20260918.md` |
| created | 2026-09-18 |

## 代签

| 闸 | 状态 | 依据 |
|----|------|------|
| HG-TASK-DRAFT | approved | lint PASS · invoke 齐 |
| HG-AUDIT-R1 | approved | R1 PASS · blocking 0 |
| HG-RELEASE | **仍 pending** | **仅人** · 不在代签范围 · blocks=— 不拦 30 |

授权：维护者「继续」+「授权签收过程文档」。

## 带入 30

1. package.json 3.0.0→3.0.1（不用 npm version）
2. CHANGELOG `## [3.0.1]` 汇总 W1–W6 · 发布状态「待发版」
3. pins fix --yes · pin-10 设计红留痕
4. ACCEPTANCE_3_0_1 · RELEASING checklist · 手册版本钉（默认保留文件名）
5. MIGRATION「3.0.0→3.0.1 无强制动作项」若未写全
6. **禁** tag / push / publish / deprecate · **不要 git commit**（维护者自行提交）

## 下一棒

30/40 簿记 → 四门 → `task close --yes` · 建议 `chore(3.0.1): bump`

## 修订

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 00 代签双闸 · HG-RELEASE 仍仅人 · 派 30 |
