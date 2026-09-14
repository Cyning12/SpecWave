# Task：2.4 W6 · P3 清扫（P3 cleanup）

> **状态**：`active`（HG-TASK-DRAFT=approved · **HG-AUDIT-R1=approved**（00 代签 · 2026-09-14） · 2026-09-14 开单）  
> **wave**：W6（2.4.0 门禁强度补全 · 收尾清扫）  
> **关联 SPEC**：[`docs/spec/2_4-gate-strength/06_w6_p3_cleanup_v1.md`](../../spec/2_4-gate-strength/06_w6_p3_cleanup_v1.md)（**唯一蓝本** · signed）· [`00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-4-gate-strength-w6-p3-cleanup` |
| **test_strategy** | `required` |
| **test_strategy_note** | N10 大小写差异 fixture（假红复现 + 负向对照不误放）· N14 slug 不一致 fixture（豁免命中行为与声明口径一致）· N4 行为零变更回归（exit 1 用例） |
| **freeze_id** | 2.4.0-W6 · D-24-N4-REGISTER 已冻结（SPEC 06 §6 · HG-SPEC-SIGNOFF approved）；N10 = 大小写不敏感 + 磁盘存在性二次确认 · N14 = meta slug 优先统一 |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 口径统一定点，不改架构图谱 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | P3 口径修正 · 无规范增量 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.2/2.3 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-14 维护者本窗签收 PLAN_2_4 |
| HG-SPEC-SIGNOFF | **approved** | — | 2026-09-14 维护者授权 00 代签 |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-14 维护者授权） |
| **HG-AUDIT-R1** | **approved** | 30 | 00 代签 · 2026-09-14 · 维护者授权 · 依据审查文 [`docs/harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md`](../../harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md)（R1 结论 PASS） |

---

## 背景与目标

三个 P3 收尾项（验收报告 §3.K/§3.O/§3.E · 本棒只读复核有效）：N10 —— pin-16 白名单精确串比（`src/cli-pins.ts:295-325` 比对区）致 `foo.md` vs `FOO.md` 假阳；N14 —— `task lint-done` slug 级存在性判用文件名 slug（`src/cli-task-extra.ts:73`）而帽级/豁免判用 meta slug（`:110-113`），不一致时豁免永不命中；N4 —— 安全拒绝走 exit 1 符合契约（§3.E 判定非缺陷 · 仅留痕）。目标：N10/N14 口径统一（各配 fixture）· N4 登记留痕（不改行为）。

**已定案（冻结 · 不得翻案）**：D-24-N4-REGISTER（仅留痕）；N10 = 大小写不敏感 + 磁盘存在性二次确认（双平台语义一致）；N14 = meta slug 优先统一（文件名兜底）。

## 范围

- [ ] ① **N10 大小写口径统一**（`src/cli-pins.ts:295-325` 比对区定点）：链接目标与白名单成员大小写不敏感比较 → 命中后再以 `existsSync` 磁盘存在性二次确认（最终判据）；fixture：`foo.md` vs 盘上 `FOO.md`（白名单含 `FOO.md`）→ 修复前假红（复现 §3.K）· 修复后 PASS；负向对照（盘上无任何大小写变体）→ 仍 exit 2 不误放。
- [ ] ② **N14 slug 口径统一**（`src/cli-task-extra.ts:73/:110-113` 定点）：存在性判集合键统一为 `meta.task_slug ?? 文件名 slug`（meta 优先 · 文件名兜底 · normalizeSlug 归一沿用）；fixture：文件名 slug ≠ meta slug 样本 → 豁免命中行为与声明口径一致；生产数据（命名合规）零行为变化回归。
- [ ] ③ **N4 留痕登记**：「`--task/--spec` 仓外路径拒绝走 exit 1（用法档 · 符合 SPEC 00 §2.4）——下游 CI 若需安全事件信号应匹配拒绝文案而非仅 exit 2」落盘（2.4.0 ACCEPTANCE 档「留痕」节接口 · 或 `discipline-coverage.yaml` note · 本 task 定落点）；行为零变更（exit 1 用例回归）。

## 非范围

| 项 | 理由 |
|----|------|
| 通用「大小写策略」框架 | 只治 pin-16 一处假阳（SPEC 06 §4） |
| lint-done 豁免语义本身 | 只统一 slug 取值口径 · 判定逻辑不动 |
| N4 行为变更（exit 1 → exit 2） | 报告判定符合契约 · 改行为破 SPEC 00 §2.4（F-W6-04） |
| W1–W5 任何实现项 | 各自独立 task |
| minor bump 2.4.0 / tag / publish | 属发版波 · publish 仅人 |

---

## 失败路径（failure_paths · 对齐 SPEC 06 §8）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W6-01 | 大小写不敏感命中但盘上无该名 | 不放行（磁盘存在性为最终判据）· 按既有口径报 mismatch/missing | 是 | 失配输出 |
| F-W6-02 | 同名不同大小写两文件并存（Linux） | 存在性确认命中其一即放行 · 歧义不升级 | 是 | — |
| F-W6-03 | meta slug 缺失且文件名不合规 | 文件名兜底 + normalizeSlug 归一 · 豁免仍不命中则按缺口报（failClosed 现状语义） | 是 | 缺口输出 |
| F-W6-04 | N4 被误当缺陷改行为 | task 非范围锁死 · 改 exit 码即超出本 SPEC | — | 评审拦截 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（闸扫描阻断） | 是 | 须先 20-task-audit R1 + 00 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–④ 逐字对齐 SPEC 06 §7 四条；⑤–⑦ 为本棒纪律性增补。

- [ ] ① **N10 fixture**：大小写差异样本修复前假红 · 修复后 PASS；负向对照（盘上无变体）仍 exit 2 不误放。贴实际命令与输出。
- [ ] ② **N14 fixture**：文件名 slug ≠ meta slug 样本 → 豁免命中与声明口径一致（有测）；生产数据零行为变化回归。
- [ ] ③ **N4**：留痕文本落盘位置明确可查 · exit 1 行为零变更（用例回归）。
- [ ] ④ `npm run typecheck` 0 错 · `npm test` 全绿（含新增）· `node bin/specgate.js pins check` exit 0。
- [ ] ⑤ **行为变更旧测影响面（TEST-LOCK）**：pin-16 比对与 lint-done slug 断言影响面逐处列出并联改（grep 留证）。
- [ ] ⑥ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_4_gate_strength_w6_p3_cleanup.md` 通过 + `task close --yes` 闭环。
- [ ] ⑦ **提交边界**：禁 `git add -A`；逐路径精确 `git add`；提交信息 `feat(2.4-W6): …`。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_4-gate-strength/06_w6_p3_cleanup_v1.md`](../../spec/2_4-gate-strength/06_w6_p3_cleanup_v1.md)（**唯一蓝本**）
3. [`docs/spec/2_4-gate-strength/00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)
4. 现状文件：`src/cli-pins.ts`（:295-325 比对区）· `src/cli-task-extra.ts`（:73 · :110-113）· `test/pins-consistency.test.ts` · lint-done 测试夹
5. 证据原文：`.workbuddy/output/验收报告-SpecWave-2.3.0.md` §3.K/§3.O/§3.E
6. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w6_p3_cleanup.md`（GATE_VERIFY）

---

## 测试策略（Harness）

**test_strategy**: `required`

- N10：大小写差异 fixture（正/负双向）；N14：slug 不一致 fixture + 生产合规回归；N4：exit 1 用例回归 + 留痕存在性核查。
- 改行为必联改断言（TEST-LOCK）。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| `src/cli-pins.ts` N10 大小写口径 | ⬜ | — |
| `src/cli-task-extra.ts` N14 slug 口径 | ⬜ | — |
| N4 留痕落盘 | ⬜ | — |

### 自检结论（执行者）

（30/40 回填：验证命令与退出码表 · 验收 ①–⑦ 逐条 · 已知未测项 · Task_KPI%）

---

## 思考轮（10-task）

### R0 · 证据

SPEC 06 为唯一蓝本（signed）；三项前提本棒只读复核有效（cli-pins.ts:295-325 · cli-task-extra.ts:73/:110-113 · §3.E 契约判定）。

### R1 · 范围

范围 = SPEC 06 §3 三项逐字承接；非范围 = 06 §4（N4 行为锁死是本波最重要的边界）。

### R2 · 方案

N10/N14 口径已定案（SPEC 06 §6）；N4 落盘位置（ACCEPTANCE 接口 vs 覆盖表 note）留本 task 定稿，倾向 ACCEPTANCE 档「留痕」节（随发版波自然收口）。

### R3 · 边界

30 开工硬边界 = HG-AUDIT-R1 翻 approved（本帽不签发）；双平台语义一致 · 生产数据零行为变化 · N4 不改行为三条转入 failure_paths；提交边界 = 禁 `git add -A`。

### R4 · 可测性

验收 7 条全部可机械/可观测：fixture 双向、回归、留痕存在性、四门命令、gate-check、提交边界。

### R5 · 派工就绪

task 结构对齐 lint E1–E8；pre-30 invoke（10）同棒落盘。**下一棒**：20-task-audit R1 → HG-AUDIT-R1 签闸（00 代签 · 2026-09-14 维护者授权）→ 30/40。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC signed + 行号复核） | no |
| R1 | 范围/非范围划定（06 §3/§4 · N4 锁死） | no |
| R2 | N10/N14 定案 · N4 落盘位置留 task 定稿 | no |
| R3 | 边界四条（开工闸 / 双平台 / 零行为变化 / 提交）落入 task | no |
| R4 | 验收 7 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此 | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 已 signed，三项口径全部定案或留有界定稿位，无新增开放问题。  
**residual_risks**：① N10 同名冲突歧义（低危 · F-W6-02 口径明示）；② N14 统一后外部脚本依赖文件名 slug（本仓内机制 · 无外部消费者证据）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | 开单 · 10-task · 蓝本 SPEC 06（signed）· 行号只读复核（cli-pins.ts:295-325 · cli-task-extra.ts:73/:110-113） |
