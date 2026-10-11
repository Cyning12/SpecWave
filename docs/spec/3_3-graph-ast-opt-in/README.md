# SPEC：3.3 · 图谱 AST 闸（opt-in · symbol / 有界 call）

> **状态**：`signed` · **HG-SPEC-SIGNOFF=approved**（2026-10-11 维护者 · 「授权00签收后续所有文档」）· **HG-NEXT-PLAN=approved**（同窗）  
> **track**：`epic`  
> **拟发版**：`spec-wave@3.3.0`（**minor** · 消费者可观察新能力：opt-in `graph ast check`；**tag/push/publish 仅人**）  
> **基线**：`spec-wave@3.2.0`（graph ib check / struct_rel / graph indexes check MVP · **AST 未交付**；3.2 政策钉「AST 另 Epic」）  
> **规划**：[`../../roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md`](../../roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md)（**HG-NEXT-PLAN=approved** · 同窗）  
> **布局公约**：[`../doc-health/03_spec_layout_convention.md`](../doc-health/03_spec_layout_convention.md)  
> **反哺来源**：业务仓（kimi-code-meta）Inform 备忘 `BACKPORT_tech_graph_tools_to_specwave_v1_zh.md`（§5 P4 · §11 未采纳复查 · **勿**整包 `cp tools/tech_graph`）  
> **过程授权**：维护者授权 **00 签收后续所有过程文档**（本 epic 各波 `HG-TASK-DRAFT` / `HG-AUDIT-R1` · 须 lint PASS + 20-task-audit R1 PASS · **不**代签 `HG-RELEASE-*` / publish）· 见 [`../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_epic_signoff.md`](../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_epic_signoff.md)  
> **00 派发**：[`../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_s0_dispatch_10_spec.md`](../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_s0_dispatch_10_spec.md)

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **spec_slug** | `3_3-graph-ast-opt-in` |
| **test_strategy** | `required` |
| **test_strategy_note** | symbol 正负向 + 有界 call 同文件引用失败红 / 跨文件不红（诚实有界）；无 TS peer / 非 TS / 无 IB 仓行为测锁；临时目录 fixture，勿污染本仓 dogfood；既有 drift / ib / indexes / yaml / scaffold 零回归 |
| **freeze_id** | 不改 3.2 `graph drift` / `graph ib check` / `graph indexes check` / `graph yaml *` **缺省**判定语义；**不**把 AST 绑进默认 `npx spec-wave verify`；**不**并入 indexes schema v2 |
| **depends_on_spec** | `3_2-graph-ib-and-indexes`（可选 IB 契约 · 点路径闸 · indexes MVP）· `3_1-tech-graph-scaffold`（drift / yaml 基线） |
| **semantic_align** | 边（drift）· 点 path（ib）· 倒排（indexes opt-in）· **符号/有界 call（ast opt-in）** 分闸；无 IB 仓零打扰；无 TS peer 零强迫 |

---

## 人闸

| human_gate_id | status | blocks | 说明 |
|---------------|--------|--------|------|
| HG-SPEC-SIGNOFF | **approved** | 10-task / 拆波 | 2026-10-11 维护者本窗签收（原文「授权00签收后续所有文档」）· 维护者直签（免正式 20-spec-audit） |
| HG-NEXT-PLAN | **approved** | 开实现波 | 同窗签收 · 开 W1 限制已解除 |

> 本表在 SPEC 档，属人工纪律；拆 task 时须复制进 task 文 `### 人工闸` 节才可机检。

---

## 一句话目标

在 3.2「点 path 存在 + 可选 indexes」之上，以 **opt-in** 交付 `graph ast check`：对已声明 IB 的 TypeScript 仓做 **symbol 核对**与 **有界 call**（同文件引用；非完整 callgraph）；无 peer / 非 TS / 无 IB 仓零强迫、默认 `verify` 不跑；不整包移植消费仓 AST 工具链，不夸大能力。

## 读序

1. [`00_policy_and_boundaries.md`](./00_policy_and_boundaries.md) — 政策与边界  
2. [`01_problem_and_goals.md`](./01_problem_and_goals.md) — 问题与完成态  
3. [`02_product_scheme.md`](./02_product_scheme.md) — 产品方案（peer · 分责 · 有界语义）  
4. [`03_cli_and_review.md`](./03_cli_and_review.md) — 命令面与失败路径  
5. [`04_execution_waves.md`](./04_execution_waves.md) — 执行波次  
6. [`05_thinking_rounds.md`](./05_thinking_rounds.md) — 思考轮 R0–R5  

## 目录树

```text
docs/spec/3_3-graph-ast-opt-in/
├── README.md
├── 00_policy_and_boundaries.md
├── 01_problem_and_goals.md
├── 02_product_scheme.md
├── 03_cli_and_review.md
├── 04_execution_waves.md
└── 05_thinking_rounds.md
```

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | draft · 10-spec · 据 00 S0 派发 + 反哺 P4 / §11 + 3.2 政策先例落盘 SPEC + PLAN |
| 2026-10-11 | signed · HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved（维护者「授权00签收后续所有文档」）· 开拆 W1–W4 |
