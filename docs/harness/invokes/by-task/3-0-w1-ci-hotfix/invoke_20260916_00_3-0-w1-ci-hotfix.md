# Invoke：00（统筹）· 3-0-w1-ci-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-w1-ci-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w1_ci_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 人授权（原文意图）

维护者 2026-09-16 本窗：**PLAN_3_0 + 3.0 SPEC 系列双签 approved**，原话「**签收，授权00签收后续所有文档**」—— 授权 00 代签后续过程文档闸（**HG-RELEASE / npm publish / tag / push 不在范围** · 发布四动作仅人不变）。本 task = CI hotfix（bugfix · 双轨跳独立 SPEC · mini）。**00 只委派不亲自实现**（harness-00-delegate-only 口径）。

## 闸扫描与代签依据

- 上游双闸：HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗 · 上行继承 · 落 task `### 人工闸` 表）
- HG-TASK-DRAFT=approved（**2026-09-16 00 代签** · 授权真值：维护者本窗「授权00代签」· task lint PASS）
- HG-AUDIT-R1=approved（**2026-09-16 00 代签** · 同授权 · 依据审查文 `docs/harness/reviews/task_3_0_w1_ci_hotfix_audit_R1_20260916.md`：R1 · PASS · blocking 0 · advisory A1–A2 · A1 已搭车修 · A2 带入 30 守加性原则）

## 派发链

10-task 起草（缺陷复核 + **git archive 模拟新鲜克隆实证恰 1 红** + 同类面快扫登记 + 基线复跑 667/130/666/0/1 · 见 10 invoke）→ **00 代签 HG-TASK-DRAFT** → 20-task-audit R1 快审（PASS · blocking 0 · advisory A1/A2 · 场景 A/B 双独立实证 · 见 20 invoke）→ **00 裁定三件套**：HG-AUDIT-R1 代签 + A1 搭车修（计数 16→19 + 补列漏计点）+ R5 表述同步 → pre-30 invoke 三件套补落（10/20/00 齐 · W0/W1 先例）→ 30。

## 关键裁定

1. **A1 搭车修不等 W5/W7 立项**：登记节计数瑕疵（16→19）+ 补列 `cli-status.ts:57` · `cli-skills.ts:211` 等漏计守卫点 · 全量清点归 W5/W7 排查 task 立项时订正（20 审口径沿用）。
2. **A2 带入 30 执行要求**（加性原则）：`skipped_missing_dirs` 为例式命名 · 30 实现不得改既有 meta 五键（`generated_at/generator/semantics/scan_dirs/criteria`）语义 · 有目录路径 console/snapshot 输出零差异 · 验收 #2/#5 机械兜底 · 落 HG-AUDIT-R1 行注明。
3. **residual ① 经 20 审场景 B 亲证**（本 task 文件入 active/ 即顺带掩盖 CI 红 · 未修复 15/15 全绿实证）⇒ 验收 #4 显式删目录负向锁 + 验收 #1 永久负向 fixture 为 30 不可绕行通道（硬约束 6）· 30 不得以「CI 已绿」替代守卫交付。
4. **一笔 commit 授权（不 push）**：`docs(3.0-W1): CI hotfix task（双闸 approved）+ R1 审查文 + invoke 三件套` —— task 文 + R1 审查文 + invokes/by-task/3-0-w1-ci-hotfix/ 三件 · 逐文件显式 add · 禁 add -A · **修复包（30 交付）就绪后由 00 呈维护者放行统一推**。
5. 逐棒授权落笔：HG-TASK-DRAFT 翻转 → 头部同步 → HG-AUDIT-R1 代签 + A1 + R5 → 授权 10-task 代笔补落 10/00 两件 invoke（S2 只新增 · W0/W1 先例）。

## 未做（禁区）

- 未亲自实现代码（delegate-only）· 未动 src / scripts / test 既有件（S2 只新增不覆写 · 修复归 30）。
- 未执行 push / tag / publish / deprecate（仅人 · HG-RELEASE 不在代签授权范围 · commit 不 push）。

## 下一棒

30 实现棒：开工前 `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w1_ci_hotfix.md` 过 GATE_VERIFY（双闸 approved · VERIFY: PASS · pre-30 invoke 三件套齐）→ 范围唯一（scanner 双目录守卫 + skipped-missing 诊断 · A2 加性原则）→ 验收 6 条（负向 fixture 先红后绿 + 模拟 CI 显式删目录红转绿 + 667+N 零回退 + pins 17/17）→ 波末 `gate-check` exit 0 → 00 呈维护者放行统一 push。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 00 统筹落档：双签承接 · 双闸代签依据 · 五项关键裁定（10-task 按 00 授权代笔补落） |
