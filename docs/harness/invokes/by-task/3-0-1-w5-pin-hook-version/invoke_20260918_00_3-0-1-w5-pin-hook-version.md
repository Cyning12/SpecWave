# Invoke：00 · 3-0-1-w5-pin-hook-version · 代签 → 派 30

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-1-w5-pin-hook-version` |
| review | `docs/harness/reviews/task_3_0_1_w5_pin_hook_version_audit_R1_20260918.md` |
| created | 2026-09-18 |

## 代签

| 闸 | 状态 | 依据 |
|----|------|------|
| HG-TASK-DRAFT | approved | lint PASS · invoke 齐 |
| HG-AUDIT-R1 | approved | R1 PASS · blocking 0 |

授权：维护者「授权签收过程文档」· HG-RELEASE 不在范围。

## 带入 30

1. 可选 `--pin-hook-version[=SEMVER]`（缺省 kit_semver）→ `npx spec-wave@<semver> hook-guard …`
2. **不带旗标 = 3.0.0 逐字节**（禁改默认物化）
3. 帮助 + CHANGELOG + RELEASING/手册：标「实验性 · 缺省关闭」+ CI 钉版建议
4. 带旗标后 verify rc=0；离线仍 fail-closed exit 2

## 下一棒

30/40：GATE_VERIFY → 实现 → 四门 → `task close --yes` · 建议 `fix(3.0.1-W5): …` · **不要 git commit**

## 修订

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 00 代签双闸 · 派 30/40 |
