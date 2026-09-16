# Invoke：00（统筹）· 3-0-w2-gates-in-hosts

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-w2-gates-in-hosts` |
| task_paths | `docs/tasks/active/task_3_0_w2_gates_in_hosts.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 人授权（原文意图）

维护者 2026-09-16 本窗：**PLAN_3_0 + 3.0 SPEC 系列双签 approved**，原话「**签收，授权00签收后续所有文档**」——授权 00 代签后续过程文档闸（**HG-RELEASE / npm publish / tag / push 不在范围** · 发布四动作仅人不变）；W1 schema 签属请示答复：「**授权00代签**」（代签授权真值 · W2 沿用同模式）。**00 只委派不亲自实现**（harness-00-delegate-only 口径）。

## 闸扫描与代签依据

- 上游双闸：HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗 · 落 task `### 人工闸` 表）
- HG-TASK-DRAFT=approved（**2026-09-16 00 代签** · 同授权 · task lint PASS）
- HG-AUDIT-R1=approved（**2026-09-16 00 代签** · 同授权 · 依据审查文 `docs/harness/reviews/task_3_0_w2_gates_in_hosts_audit_R1_20260916.md`：R1 · PASS-with-issues · blocking 0 · advisory A1–A3）
- **闸行裁决**：W2 不设 HG-SCHEMA-CHANGE 新行（10-task 起草裁决 · 四理由落 task 闸表下注 · 20-task-audit R1 复核通过：裁决成立 · 理由③附类比强度注记 advisory A1 · operative 论据 = 硬约束 3 闸对象限定 + catalog 属新 artifact 自有格式）

## 派发链

W1 done（schema v2 已交付 · 三闸 approved）→ 10-task 起草（机制族取证定稿 13 格 + 内置表 v2 化方案 + B5/verify/e2e 定稿 + 基线复跑 · 见 10 invoke）→ **00 代签 HG-TASK-DRAFT**（+ 两处表述同步授权）→ 20-task-audit R1 书面审（PASS-with-issues · blocking 0 · 独立复现全部基线数字 + 30+ 行号抽核 + 机制族外部文档抽样取证 4 件 + verify 行级断言全量 grep 实测为零 · 见 20 invoke）→ **00 代签 HG-AUDIT-R1** + pre-30 invoke 三件套补落（10/20/00 齐 · W1 先例）→ 30/40。

## 关键裁定

1. **双签承接与顺序**（硬约束 3/15 同构）：task 落闸行（双 pending）→ 20 审查文落盘 → 00 代签 → 30 改码；泛化机检全程咬住（verify 实证 pending 期 exit 2 拒 30）
2. **三 advisory 处置**（全部带入 30 执行登记 · 落 HG-AUDIT-R1 行注明）：A1 闸裁决理由③类比强度注记（30/00 引用裁决时以闸对象论为主论据 · 类比仅旁证）· A2 F-W2-13 登记口径可按实测收窄（行级 verify 断言影响面=零 · 30 自检引用即可 · 登记纪律不变）· A3 e2e 验收文须登记 CLI 版本串（gemini CLI 已由 Antigravity CLI 取代的官方横幅数据点 · 本审环境 gemini CLI 缺席须先装 · F-W2-06/07 兜底）
3. **机制族两处修正认可**：cursor 候选→定稿 / gemini none→定稿（20 审外部官方文档抽样取证真实 · codex 保守裁决有据）——SPEC §5.1 授权面内
4. **一笔 commit 授权**（网络恢复与否不影响 · 不 push）：task 文 + R1 审查文 + invoke 三件套 · 逐文件显式 add · 禁 add -A · CI hotfix 并行链（task_3_0_w1_ci_hotfix 及其审查文/invoke 目录）逐路径排除不得裹挟
5. 逐棒授权落笔：HG-TASK-DRAFT 翻转 → 头行同步 → 两修（S3.8/R5 表述）→ HG-AUDIT-R1 代签 → 授权 10-task 代笔补落本两件 invoke（S2 只新增 · W1 先例）

## 未做（禁区）

- 未亲自实现代码（delegate-only）· 未改 SPEC/PLAN/reviews 既有档 / src / test（S2 只新增不覆写）
- 未执行 push / tag / publish / deprecate（仅人 · HG-RELEASE 不在代签授权范围 · commit 不 push）

## 下一棒

30 实现棒：开工前 `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w2_gates_in_hosts.md` 过 GATE_VERIFY（双闸 approved · may_start_30=true · pre-30 invoke 三件套齐）→ 范围 ①–⑨ → 验收 14 条（机械锁全绿 + 红测先行 + A1/A2/A3 执行登记）→ `task close --yes`。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 00 统筹落档：双签承接 · 两闸代签依据 · 五项关键裁定（10-task 按 00 授权代笔补落） |
