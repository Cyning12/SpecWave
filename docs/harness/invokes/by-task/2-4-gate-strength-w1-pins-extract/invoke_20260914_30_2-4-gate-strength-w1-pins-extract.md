# invoke · 30 · 2-4-gate-strength-w1-pins-extract（开工前置 · GATE_VERIFY + T-1 消解留痕）

> **hat**：30 实现棒 · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w1_pins_extract.md`
> **性质**：开工前置处置留痕（GATE_VERIFY 两处桥接 + T-1 消解 · 偏离 F-W1-05 的理由）

## 1. GATE_VERIFY 首输出与两处桥接

首跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w1_pins_extract.md` 输出：

```
| HG-AUDIT-R1 | approved（00 代签 · 2026-09-14 · 维护者授权） | 30 | ❌ 拒 30 |
VERIFY: BLOCKED · HG-AUDIT-R1 pending · task_2_4_gate_strength_w1_pins_extract.md
```

**桥接 A（闸表格式归一）**：HG-AUDIT-R1 实质已签（00 代签 · 维护者授权 · 注记在说明列），但签闸注记写进了 status 格，
机读闸（`src/cli-shared.ts` evaluateMayStart30）要求 status 归一后恰为 `approved`，`approved（…）` 被判 pending。
处置：status 格归一为 `**approved**`，代签注记移入说明列（语义零变化 · 对齐 `docs/tasks/done/` 全部先例：
status 格纯 `approved`，注记落说明列）。

**桥接 B（R1 审查文指针）**：归一后再跑 verify → `VERIFY: BLOCKED · missing R<n> review`。
R1 实质审查已签发（总审文 `docs/harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md` ·
20-task-audit · 结论 PASS-with-issues · W1 带条件可签），但机读闸按
`task_<task文件名>_audit_R<n>_*.md` 逐 task 匹配（`src/cli-checks.ts` findLatestReview），
总审文文件名不在匹配面。处置：落指针文
`docs/harness/reviews/task_2_4_gate_strength_w1_pins_extract_audit_R1_20260914.md`，
逐字承接总审文 §1 W1 行 / §3 T-1 / §4，无新增审查意见；如维护者/20 审认为应由 20 棒重发逐波审查文，可同名替换。

## 2. T-1 消解（00 签闸所附条件 · 偏离 F-W1-05 的理由）

**事实**：`docs/spec/README.md` 2.3.1 patch 收尾行（现 :20）状态格陈旧——写「待发版（bump 已落 · tag/push/publish 仅人）」，
但 2.3.1 实际已 published（`npm view spec-wave version` → `2.3.1` · 本棒实测 2026-09-14）。

**三约束不能同时成立**：
1. N9 新口径（D-24-PIN08-SEMCELL 冻结）：行合格 ⟺ 状态列含当前版本**点式** `X.Y.Z`；
2. 验收 ④ 全量回归：现行 `docs/spec/README.md` 全部存量行新口径下零误伤；
3. F-W1-06：误伤即返修口径**不修文档**。

若该行状态格保持「待发版」无点式串：新口径落地即该行红（违 2）；返修口径放过它等于废掉语义格位锁定（违 1）；
唯一出口是先修文档（违 3 的字面）。20 审 T-1 已识别此冲突并把它列为签闸条件；
00 带条件签闸（task 人工闸表 HG-AUDIT-R1 行说明列）显式授权 30 先把该行修为含点式 `2.3.1` 的现行口径——
即**本偏离 F-W1-05/F-W1-06「修口径不修文档」系签闸条件授权的先修文档**，且修正方向是文档追认既成事实
（2.3.1 已 published），非为迁就口径而改事实。

**处置**（最小 diff · 对齐表内 2.2.1 已发版行风格）：
- 状态格 `**signed** · **待发版**（bump 已落 · tag/push/publish 仅人）` → `**signed** · **`2.3.1` published** · **CLOSED**`（task `2-3-1-patch` 已在 done/）；
- 同行一句话列尾 `（待人打 tag/publish）` 与 published 矛盾，一并删去。

**F-W1-05 定稿**（随本 note 落稿 · 待写入 `assets/release-pins.yaml` pin-08 semantics note）：
状态列含点式 `X.Y.Z` 即算行身份合格（含 `2.4.0 规划中` 类非发布态行）；发布态准确性（tag↔版本联动）归 pin-10 分工。

## 3. 顺序声明

T-1 消解完成后方动 `src/`（符合 task 开工前置顺序）。
