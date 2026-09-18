# Invoke：00 · 3-0-1-w6-mech-coverage · 代签三闸 → 派 30

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-1-w6-mech-coverage` |
| reviews | R1 `task_3_0_1_w6_mech_coverage_audit_R1_20260918.md` · 扫描面 `w6_changelog_scan_surface_review_20260918.md` |
| created | 2026-09-18 |

## 代签

| 闸 | 状态 | 依据 |
|----|------|------|
| HG-TASK-DRAFT | approved | lint PASS · invoke 齐 |
| HG-AUDIT-R1 | approved | R1 PASS · blocking 0 |
| HG-W6-REVIEW | approved | 扫描面评审落盘 |

授权：维护者「授权签收过程文档」· HG-RELEASE 不在范围。

## 带入 30（扫描面裁定）

1. `terminology.yaml` targets **追加** `CHANGELOG.md`（**全量扫** · 禁只扫现行节 / 整段加白）
2. 改 `CHANGELOG.md:134`「门控手动测试」措辞避变体词（使基线 rc=0）
3. 注入「门控」负向 fixture ⇒ exit 2；边界词不误报；存量六目标零回归
4. `check-claims`：**本波不纳入** CHANGELOG（显式理由已在评审文）
5. `host validate`：非内置 + config-hook → PASS + WARN；apply 仍 rc=2；B5/MIGRATION 明写

## 下一棒

30/40：GATE_VERIFY → 实现 → 四门 → `task close --yes` · 建议 `fix(3.0.1-W6): …` · **不要 git commit**

## 修订

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 00 代签三闸 · 派 30/40 |
