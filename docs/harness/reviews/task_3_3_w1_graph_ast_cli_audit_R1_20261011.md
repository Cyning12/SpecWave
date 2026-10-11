# 审查 · 20-task-audit R1 · 3-3-w1-graph-ast-cli

> **日期**：2026-10-11 · **hat**：20-task-audit  
> **task**：[`docs/tasks/done/task_3_3_w1_graph_ast_cli.md`](../../tasks/done/task_3_3_w1_graph_ast_cli.md)  
> **上游 SPEC**：[`docs/spec/3_3-graph-ast-opt-in/`](../../spec/3_3-graph-ast-opt-in/README.md) · [`04` W1](../../spec/3_3-graph-ast-opt-in/04_execution_waves.md) · [`02` §2](../../spec/3_3-graph-ast-opt-in/02_product_scheme.md) · [`03` §1.1](../../spec/3_3-graph-ast-opt-in/03_cli_and_review.md)（HG-SPEC-SIGNOFF=approved）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md`](../../roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md) **W1 · 契约 / CLI 面**（HG-NEXT-PLAN=approved）  
> **统筹钉死**：[`invoke_20261011_00_orchestrate_w1_w4.md`](../invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_orchestrate_w1_w4.md)（peer=skip0 · 不进 verify · stub 不假绿）  
> **防回灌对照**：3.2 ib/indexes · **不**把 AST 绑进默认 `verify` · **不**改 drift/ib/indexes 缺省 · **不**开 W2 深检  
> **方式**：只读对照 SPEC/PLAN/task · 抽核 R0（`cli-graph.ts` help/分发无 `ast` · 已有 `ib`/`indexes`）· `task lint` → PASS · **未改** task 实质 / 闸表 / `src/` / `test/` / `bin/` · **不代签**人闸  

---

## 结论

| 维度 | 结果 |
|------|------|
| **内容** | **PASS** · **blocking 0** · 不退回 10-task |
| **流程闸** | 内容审当时 pending；**00 已按授权签收**（见 task 表 · 签后可 30） |
| **peer=skip0 / 不进 verify / stub 不假绿** | **可测锁**（A2 + A4 + A6 + failure_paths + 非范围） |
| **审查结论** | **通过** · PASS · blocking 0 |

---

## 机械闸

| 项 | 结果 |
|----|------|
| `npx spec-wave task lint --file docs/tasks/active/task_3_3_w1_graph_ast_cli.md` | **PASS** |

---

## 核对项（内容）

| # | 核对 | 结果 |
|---|------|------|
| 1 | **范围对齐** SPEC `04` W1（CLI 注册 · peer/skip · `--json` · 不进 verify · stub 不假绿 · 四门）+ PLAN W1 + `02` §2 + `03` §1.1；未扩 W2 深检 / W3 文档 / W4 bump | ✅ |
| 2 | **peer 钉死**：统筹 + task 明确 **skip exit 0**（禁止 usage=1）· A2 + failure 覆盖 | ✅ |
| 3 | **stub 不假绿**：A4 + `ast_not_implemented` · 非范围钉死 W2 深检 | ✅ |
| 4 | **无 IB 零打扰**：A3 · checked=0 · 对齐 3.2 纪律 | ✅ |
| 5 | **非范围** vs SPEC/PLAN：深检 · callgraph · verify 绑入 · indexes v2 · meta · bump/publish | ✅ |
| 6 | **验收 A1–A10**：help / peer skip / 无 IB / stub / `--json` / 不进 verify / 只读 / 零回归 / 四门 / 关账 均可机检 | ✅ |
| 7 | **failure_paths**：闸序拒开工 · peer skip · stub · 禁进 verify · 禁越 W1；对齐 `03` §3–§4 | ✅ |
| 8 | **行为变更（K7）旧测影响面**：additive 新子命令 · A8 零回归 + A6 verify 不绑 · 充分 | ✅ |
| 9 | **test_strategy=required** · 契约测锁 · 临时 fixture · 不进 verify | ✅ |
| 10 | **R0 抽核**（2026-10-11）：`cli-graph.ts` help 含 ib/indexes · **无** `ast`；分发无 `ast`；`usage.ts` 无 ast；`typescript` 仅 devDep；verify 无 graph ast 步 | ✅ |
| 11 | 闸表 4 列 · `HG-AUDIT-R1` blocks **30** · epic 双闸继承 approved · 本波两闸 **pending**（本棒不改） | ✅ |
| 12 | 元信息：`required_invoke_hats` 含 20 · `graph_delta/wiki_delta=none` · `close_pr_policy=exempt` · lint **PASS** | ✅ |
| 13 | 思考轮 R0–R5 + 控制表闭合 · residual_risks 三条具体（探测歧义 · stub/无 IB 两态 · W2 接手） | ✅ |

---

## 思考轮审查（阶段 C）

| 轮 | 裁定 |
|----|------|
| R0 证据 | **充分**（无 ast 命令 · ib/indexes 样板 · TS 仅 devDep；抽核一致） |
| R1 范围 | **充分**（仅 W1 CLI/契约 · 排除 W2–W4） |
| R2 方案 | **充分**（新模块 + peer skip0 + stub reason + printJson） |
| R3 边界 | **充分**（只读 · 零打扰 · 不进 verify · 不强制 dep） |
| R4 可测 | **充分**（A1–A10 fixture · 四门+close） |
| R5 就绪 | **充分**（待本审 + **00 按授权**签 HG-TASK-DRAFT / HG-AUDIT-R1） |

**思考审查结论**：充分，无退回 10-task 项。

---

## Blocking（内容阻塞）

无。**blocking 0**。

---

## Advisory（非阻塞观察）

| ID | 说明 | 建议 |
|----|------|------|
| **N1** | peer 探测「相对 target」vs「包内 resolve」易歧义 | 30 **必须**以 A2 临时 target 无 typescript 为契约真值并测锁；文档化探测顺序 |
| **N2** | 无 IB（A3）与 stub reason（A4）两态 | 分测；JSON 在 A3 可 `skipped_reason=null`；有待检且未实装才写 `ast_not_implemented` |
| **N3** | SPEC `03` 曾写 peer「skip 或 usage」二选一 | 本 epic 统筹已钉 skip=0；30 勿回退 usage=1 |
| **N4** | 顶层 `usage.ts` 仍缺 `graph indexes check` | A-opt1 不挡；本波至少补 `ast` |
| **N5** | K7 旧测影响面 | 30 自检列 `test/graph-ib*` / `test/graph-indexes*` / `test/graph-drift*` / verify 相关 |

**无 FAIL / 无退回 10-task 项。**

---

## 流程闸（真值在 task 表）

| 闸 | 状态 | 说明 |
|----|------|------|
| HG-SPEC-SIGNOFF | approved | epic · 维护者 · 继承 |
| HG-NEXT-PLAN | approved | epic · 继承 |
| HG-TASK-DRAFT | **approved**（00 · 2026-10-11 · 审后签） | lint + 本审 PASS |
| HG-AUDIT-R1 | **approved**（00 · 2026-10-11 · 审后签） | **可 30** |

---

## 签收

本审查 R1 为终轮（内容）：**PASS · blocking 0 · 通过 · 签收（内容可执行）**。  
**流程闸仍 pending**：维护者 / **00 按 epic 授权**签 task 表后才可下发 30；**本审不附 30 可复制 Prompt**。

---

## 维护者签闸（20 后 · 30 前）

- [x] 已读 R1 审查结论（PASS · blocking 0 · N1–N5 非阻塞 · peer=skip0 / stub 不假绿 / 不进 verify 可测锁）
- [x] 在 task 人工闸表将 **HG-TASK-DRAFT** 改为 approved（**00 按授权** · 2026-10-11）
- [x] 在 task 人工闸表将 **HG-AUDIT-R1** 改为 approved（**00 按授权** · 2026-10-11）
- [x] 签闸落盘（本 epic 波次全链 · 随 W1 commit）
- [x] 下发 30/40（同窗波次全链）

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

**签名**：20-task-audit · R1 · 2026-10-11 · 仅书面审查  
**落盘**：`docs/harness/reviews/task_3_3_w1_graph_ast_cli_audit_R1_20261011.md`
