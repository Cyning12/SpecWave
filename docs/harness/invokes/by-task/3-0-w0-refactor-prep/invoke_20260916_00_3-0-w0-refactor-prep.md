# Invoke：00（统筹）· 3-0-w0-refactor-prep

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-w0-refactor-prep` |
| task_paths | `docs/tasks/active/task_3_0_w0_refactor_prep.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 人授权（原文意图）

维护者 2026-09-16 本窗：**PLAN_3_0 + 3.0 SPEC 系列双签 approved**（HG-NEXT-PLAN / HG-SPEC-SIGNOFF），原话「**签收，授权00签收后续所有文档**」——授权 00 代签后续过程文档闸（**HG-RELEASE 不在范围** · 发布四动作仅人不变）。**00 只委派不亲自实现**（harness-00-delegate-only 口径）。

## 闸扫描与代签依据

- 上游双闸：HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗 · 落 task `### 人工闸` 表）
- HG-TASK-DRAFT=approved（**2026-09-16 00 代签** · 授权真值：维护者本窗「签收，授权00签收后续所有文档」· HG-RELEASE 不在范围）
- HG-AUDIT-R1=approved（**2026-09-16 00 代签** · 依据审查文 `docs/harness/reviews/task_3_0_w0_refactor_prep_audit_R1_20260916.md`：R1 · PASS-with-issues · blocking 0 · advisory A1–A4）

## 派发链

10-task 起草（复核现值 + 基线复跑 + 模块边界定稿 D1–D6 · 见 10 invoke）→ 20-task-audit R1 书面审（独立复现全部基线数字与锁② 清单 · 审查文落盘 reviews/ · 见 20 invoke）→ **00 代签双闸** → pre-30 invoke 三件套补落（10/20/00 齐）→ 30/40。

## 关键裁定

1. **A1 搭车修，不等 20 审回填轮**：D6 行号标注 `:11-15` → `:10-14`（20 审实测值 · 只改标注数字）
2. **A2/A3/A4 带入 30 执行要求**（spawn 口径登记 · 环境红登记粒度 · 降级态 M1 字段 · 落 HG-AUDIT-R1 行注明）
3. **npx OOM 处置**：`npx spec-wave verify` 本机 V8 heap OOM（npx 走 registry 拉包 · 环境 artifact）⇒ GATE_VERIFY 统一用仓内 dogfood 等价命令 `node bin/specgate.js verify`（同源码同判定 · 2.4.2 先例）
4. **F-W0-07 环境债仅人**：npm cache root-owned（pack 系 4 用例 EPERM 环境红）已登记 task 基线节与 failure_paths · cache 属主修复（sudo chown）仅人 · 不修产品代码
5. 逐棒授权落笔：HG-TASK-DRAFT 翻转 → 头行同步（搭车不等 20 审）→ HG-AUDIT-R1 代签 + A1 → 授权 10-task 补落本两件 invoke（S2 只新增 · 2.4.2「补落后三件套齐」先例）

## 未做（禁区）

- 未亲自实现代码（delegate-only）· 未改 SPEC/PLAN/reviews 既有档（S2 只新增不覆写）
- 未执行 tag / push / publish / deprecate（仅人 · HG-RELEASE 不在代签授权范围）

## 下一棒

30 实现棒：开工前 `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w0_refactor_prep.md` 过 GATE_VERIFY（三件套齐 · may_start_30=true）→ 范围 ①–⑥ → 六重锁全绿 + M1 验收文 → `task close --yes`。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 00 统筹落档：双签承接 · 派发链 · 双闸代签依据 · 五项关键裁定（10-task 按 00 授权代笔补落） |
