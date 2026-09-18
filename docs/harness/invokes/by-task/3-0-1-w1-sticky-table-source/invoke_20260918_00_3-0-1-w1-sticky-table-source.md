# Invoke：00（统筹）· 3-0-1-w1-sticky-table-source · 代签闸 → 派 30

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-1-w1-sticky-table-source` |
| task_path | `docs/tasks/active/task_3_0_1_w1_sticky_table_source.md` |
| review_path | `docs/harness/reviews/task_3_0_1_w1_sticky_table_source_audit_R1_20260918.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |

## 人授权（原文意图）

维护者 2026-09-18：「身为00，统筹3.0.1的升级，授权签收过程文档」——过程闸代签成立；**HG-RELEASE / tag / push / publish 不在范围**。

## 闸扫描与代签

| 闸 | 动作 | 依据 |
|----|------|------|
| HG-NEXT-PLAN | 已 approved（PLAN） | 维护者本窗签收 |
| HG-TASK-DRAFT | **00 代签 → approved** | task lint PASS · 10 invoke 齐 |
| HG-AUDIT-R1 | **00 代签 → approved** | R1 审查文 PASS · blocking 0 |
| HG-RELEASE | 仍 pending | 仅人 |

## 带入 30 的关键裁定（审查文 §5）

1. **sha256 不符 → WARN 不硬红**（路径不可用仍 exit 2）
2. 双向兼容：优先 parse 未知字段忽略留证；旧 CLI 端到端可选
3. `table_source` **必须可选** · `version` 恒 `1`
4. advisory：开工前扫读 `test/host-adapt-sticky.test.ts` · `test/w2-host-verify.test.ts` · `test/host-adapt-update.test.ts` · `test/init.test.ts`

## 未做（禁区）

- 本窗未改 `src/` · 未亲自 30
- 未 tag / push / publish

## 下一棒

30/40：GATE_VERIFY 首输出 → 红测先行 → 实现 W1 ①–④ → 自证 A1–A9 → `task close --yes` · 提交信息建议 `fix(3.0.1-W1): …` · 禁 `git add -A`

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 00 代签双闸 · 派 30/40 |
