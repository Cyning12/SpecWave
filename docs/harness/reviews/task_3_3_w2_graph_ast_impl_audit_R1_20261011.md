# 审查 · 20-task-audit R1 · 3-3-w2-graph-ast-impl

> **日期**：2026-10-11 · **hat**：20-task-audit  
> **task**：[`docs/tasks/done/task_3_3_w2_graph_ast_impl.md`](../../tasks/done/task_3_3_w2_graph_ast_impl.md)  
> **上游 SPEC**：[`docs/spec/3_3-graph-ast-opt-in/`](../../spec/3_3-graph-ast-opt-in/README.md) · [`04` W2](../../spec/3_3-graph-ast-opt-in/04_execution_waves.md) · [`02` §3](../../spec/3_3-graph-ast-opt-in/02_product_scheme.md) · [`03` §1.1](../../spec/3_3-graph-ast-opt-in/03_cli_and_review.md)（HG-SPEC-SIGNOFF=approved）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md`](../../roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md) **W2 · AST 实现 + 测**（HG-NEXT-PLAN=approved）  
> **前波**：[`task_3_3_w1_graph_ast_cli.md`](../../tasks/done/task_3_3_w1_graph_ast_cli.md) · stub `ast_not_implemented` · `fe454f0`  
> **防回灌对照**：**不**把 AST 绑进默认 `verify` · **不**改 drift/ib/indexes 缺省 · **不**跨 path 红 · **不**开 W3+ 手册/bump · **不**整包 cp / 七域硬编码  
> **方式**：只读对照 SPEC/PLAN/task · 抽核 R0（`cli-graph-ast.ts` stub · collect 无 symbol · 测 A4 断言 stub）· `task lint` → PASS · **未改** task 实质（签闸另棒）· **不代签**人闸（本审文记录内容结论）

---

## 结论

| 维度 | 结果 |
|------|------|
| **内容** | **PASS** · **blocking 0** · 不退回 10-task |
| **流程闸** | 内容审当时 pending；**00 按授权签收后可 30**（见 task 表） |
| **symbol / 有界 call / 跨 path 不红 / stub 消除** | **可测锁**（A1–A8 + failure_paths + 非范围） |
| **审查结论** | **通过** · PASS · blocking 0 |

---

## 机械闸

| 项 | 结果 |
|----|------|
| `npx spec-wave task lint --file docs/tasks/active/task_3_3_w2_graph_ast_impl.md` | **PASS** |

---

## 核对项（内容）

| # | 核对 | 结果 |
|---|------|------|
| 1 | **范围对齐** SPEC `04` W2（symbol · 有界 call · 无 IB/无 peer · 禁整包/七域 · 回归 · 四门）+ PLAN W2 + `02` §3 + `03` §1.1；未扩 W3 手册 / W4 bump / callgraph / indexes v2 | ✅ |
| 2 | **symbol 红**：A2 + failure · `missing_ib_symbol` · exit 2 | ✅ |
| 3 | **有界 call**：同 path 负 A3 · 正 A4 · 跨 path 不红 A5 · inform 可选 | ✅ |
| 4 | **W1 契约保持**：A6 无 IB / `no_ts_peer` skip0 · A7 TBD 跳过 · A8 消除 stub | ✅ |
| 5 | **非范围** vs SPEC/PLAN：callgraph · verify 绑入 · indexes v2 · meta · W3/W4 · 七域 | ✅ |
| 6 | **验收 A1–A11**：正负向 fixture + 跨 path + 四门 + 关账 均可机检 | ✅ |
| 7 | **failure_paths**：闸序拒开工 · symbol/call 红 · 跨 path 不红 · 禁 stub 残留 · 禁进 verify | ✅ |
| 8 | **行为变更（K7）旧测影响面**：明示改写 `graph-ast-check` A4 · 既有 ib/indexes/drift/verify 零回归 | ✅ |
| 9 | **test_strategy=required** · 临时 fixture · 不进 verify | ✅ |
| 10 | **R0 抽核**（2026-10-11）：`cli-graph-ast.ts` 仍 `ast_not_implemented`；`collectAstCheckable` 无 symbol；测 A4 断言 stub；`typescript` 仅 devDep；verify 无 ast 步 | ✅ |
| 11 | 闸表 4 列 · `HG-AUDIT-R1` blocks **30** · epic 双闸继承 approved · 本波两闸审时 **pending** | ✅ |
| 12 | 元信息：`required_invoke_hats` 含 20 · `graph_delta/wiki_delta=none` · `close_pr_policy=exempt` · lint **PASS** | ✅ |
| 13 | 思考轮 R0–R5 + 控制表闭合 · residual_risks 三条具体（声明粒度 · 引用假阳性 · path 跳过分责） | ✅ |

---

## 思考轮审查（阶段 C）

| 轮 | 裁定 |
|----|------|
| R0 证据 | **充分**（stub/A4/collect 缺口与包面一致） |
| R1 范围 | **充分**（仅 W2 真检 · 排除 W3–W4） |
| R2 方案 | **充分**（TS AST 最小声明+引用 · 同 path 红 · 跨 path inform） |
| R3 边界 | **充分**（只读 · 不替 ib · 不进 verify · 不整包） |
| R4 可测 | **充分**（A1–A11 fixture · 四门+close） |
| R5 就绪 | **充分**（待本审 + **00 按授权**签过程闸） |

**思考审查结论**：充分，无退回 10-task 项。

---

## Blocking（内容阻塞）

无。**blocking 0**。

---

## Advisory（非阻塞观察）

| ID | 说明 | 建议 |
|----|------|------|
| **N1** | `collectAstCheckable` 今日不带 symbol | 30 须扩展 collect（或并行收集）并跳过 TBD |
| **N2** | 原测 A4 锁 stub | **必须改写**，否则 W2 关账假绿 |
| **N3** | path 缺失本波钉跳过 | 测中可覆盖「缺文件不因 AST 红」；文案引导 ib check |
| **N4** | optional peer `typescript` | 可选；勿进强制 `dependencies` |
| **N5** | K7 旧测影响面 | 30 自检列 `test/graph-ast*` / `graph-ib*` / `graph-indexes*` / `graph-drift*` / verify |

**无 FAIL / 无退回 10-task 项。**

---

## 流程闸（真值在 task 表）

| 闸 | 状态 | 说明 |
|----|------|------|
| HG-SPEC-SIGNOFF | approved | epic · 维护者 · 继承 |
| HG-NEXT-PLAN | approved | epic · 继承 |
| HG-TASK-DRAFT | **待 00 签**（本审 PASS 后） | lint + 本审 PASS |
| HG-AUDIT-R1 | **待 00 签**（本审 PASS 后） | **签后可 30** |

---

## 签收

本审查 R1 为终轮（内容）：**PASS · blocking 0 · 通过 · 签收（内容可执行）**。  
**流程闸**：维护者授权本 epic 由 **00 签收过程文档**；lint PASS + 本审 PASS 后 00 可将 HG-TASK-DRAFT / HG-AUDIT-R1 标 approved。

---

## 维护者签闸（20 后 · 30 前）

- [x] 已读 R1 审查结论（PASS · blocking 0 · N1–N5 非阻塞）
- [x] 在 task 人工闸表将 **HG-TASK-DRAFT** 改为 approved（**00 按授权** · 2026-10-11）
- [x] 在 task 人工闸表将 **HG-AUDIT-R1** 改为 approved（**00 按授权** · 2026-10-11）
- [x] 签闸落盘（本 epic 波次全链 · 随 W2 commit）
- [x] 下发 30/40（同窗波次全链）

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

**签名**：20-task-audit · R1 · 2026-10-11 · 仅书面审查  
**落盘**：`docs/harness/reviews/task_3_3_w2_graph_ast_impl_audit_R1_20261011.md`
