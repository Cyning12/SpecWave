# Invoke：00（统筹）· 3-0-w1-schema-leap

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-w1-schema-leap` |
| task_paths | `docs/tasks/active/task_3_0_w1_schema_leap.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 人授权（原文意图）

维护者 2026-09-16 本窗：**PLAN_3_0 + 3.0 SPEC 系列双签 approved**，原话「**签收，授权00签收后续所有文档**」——授权 00 代签后续过程文档闸（**HG-RELEASE / npm publish / tag / push 不在范围** · 发布四动作仅人不变）；W1 schema 签属请示答复：「**授权00代签**」（HG-SCHEMA-CHANGE 代签授权真值）。**00 只委派不亲自实现**（harness-00-delegate-only 口径）。

## 闸扫描与代签依据

- 上游双闸：HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗 · 落 task `### 人工闸` 表）
- HG-SCHEMA-CHANGE=approved（**2026-09-16 00 代签** · 授权真值：维护者本窗「授权00代签」（W1 schema 签属请示答复）· 依据：schema 评审文 `docs/harness/reviews/w1_schema_change_review_20260916.md` 落盘并经 00 批准 · OQ-1/OQ-2 按文裁定执行 · OQ-5 由 task 快照闭环）
- HG-TASK-DRAFT=approved（**2026-09-16 00 代签** · 同授权 · task lint PASS）
- HG-AUDIT-R1=approved（**2026-09-16 00 代签** · 同授权 · 依据审查文 `docs/harness/reviews/task_3_0_w1_schema_leap_audit_R1_20260916.md`：R1 · PASS-with-issues · blocking 0 · advisory A1–A3）

## 派发链

schema 变更评审棒（评审文落盘 reviews/ · **00 批准** · HG-SCHEMA-CHANGE 硬前置兑现 · 硬约束 3）→ 10-task 起草（OQ 三硬动作闭环 + 基线复跑 · 见 10 invoke）→ **00 代签双闸**（HG-SCHEMA-CHANGE / HG-TASK-DRAFT）→ 20-task-audit R1 书面审（PASS-with-issues · blocking 0 · 独立复现全部基线数字与快照再生成 · 见 20 invoke）→ **00 代签 HG-AUDIT-R1** + A1 修扫描器 + pre-30 invoke 三件套补落（10/20/00 齐 · W0 先例）→ 30/40。

## 关键裁定

1. **评审文批准先行**（硬约束 3 顺序：评审文 → 闸 → task 落闸行 → 30 改码 · OQ-7 自指 bootstrap 靠人工纪律 + 闸表 + GATE_VERIFY 兜底至泛化交付）
2. **A1 修扫描器不等回填轮**：`--out` 必填 + 已存在拒写（fail-closed）+ 绝对路径原样使用（20 审裸跑覆写事故的机制化根治 · baseline sha256 `002f3fc2` 实证不变）
3. **A2/A3 带入 30 执行要求**（#5② 行级比对有效锁口径 = 文件级 may_start_30 逐文件不变 + 行键集不变 · F-W1-11 可选类型层加强 · 落 HG-AUDIT-R1 行注明）
4. **两笔 commit 授权**（网络未恢复 · 不 push）：commit 1 = 评审文独立成笔（HG-SCHEMA-CHANGE 前置兑现留证）· commit 2 = task + R1 审查文 + OQ-5 扫描器与快照 fixture + invoke 三件套 · 逐文件显式 add · 禁 add -A
5. 逐棒授权落笔：双闸翻转 → 头行同步 → HG-AUDIT-R1 代签 + A1 → 授权 10-task 代笔补落本两件 invoke（S2 只新增 · W0「pre-30 三件套齐」先例）

## 未做（禁区）

- 未亲自实现代码（delegate-only）· 未改 SPEC/PLAN/reviews 既有档（S2 只新增不覆写）
- 未执行 push / tag / publish / deprecate（仅人 · HG-RELEASE 不在代签授权范围 · 网络未恢复 commit 不 push）

## 下一棒

30 实现棒：开工前 `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w1_schema_leap.md` 过 GATE_VERIFY（三闸 approved · may_start_30=true · pre-30 invoke 三件套齐）→ 范围 ①–⑦ → 验收 13 条（三重保险机械锁 + 红测先行 + A2/A3 执行要求）→ `task close --yes`。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 00 统筹落档：双签承接 · 评审文批准 · 三闸代签依据 · 五项关键裁定（10-task 按 00 授权代笔补落） |
