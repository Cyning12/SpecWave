# Task：3.3 W3 · 图谱 AST 文档分责（保真表 + 有界 call 文案）

> **状态**：`done` · **00 验收关账** 2026-10-11（A1–A8）  
 
> **上游 SPEC**：[`docs/spec/3_3-graph-ast-opt-in/`](../../spec/3_3-graph-ast-opt-in/README.md)（**HG-SPEC-SIGNOFF=approved** · 2026-10-11 维护者）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md`](../../roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md)（**HG-NEXT-PLAN=approved**）· **W3 · 文档分责**  
> **SPEC 波钉**：[`04_execution_waves.md`](../../spec/3_3-graph-ast-opt-in/04_execution_waves.md) **W3** · [`03_cli_and_review.md`](../../spec/3_3-graph-ast-opt-in/03_cli_and_review.md) §2 · [`02_product_scheme.md`](../../spec/3_3-graph-ast-opt-in/02_product_scheme.md) §4  
> **前波**：[`docs/tasks/done/task_3_3_w2_graph_ast_impl.md`](../done/task_3_3_w2_graph_ast_impl.md)（W2 实装 · commit `82abf30`）  
> **样板**：[`docs/tasks/done/task_3_2_w4_migration_docs.md`](../done/task_3_2_w4_migration_docs.md)（3.2 W4 保真分责 + MIGRATION）  
> **过程授权**：维护者授权本 epic **00 签收过程文档**（`HG-TASK-DRAFT` / `HG-AUDIT-R1` · 须 lint + 20-task-audit R1 PASS）· 见 [`invoke_20261011_00_epic_signoff.md`](../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_epic_signoff.md)  
> **行号口径**：2026-10-11 · Open Folder 仓根 · **工作分支**：`task/specwave-3-3-graph-ast`

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-3-w3-ast-docs` |
| **test_strategy** | `recommended` |
| **test_strategy_note** | 文档波：四门为波末硬条款；验收靠文件/grep 自检；若改 CI sample 则注释存在性断言；不强制新增单元测 |
| **code_quality_bar** | `standard` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `task/specwave-3-3-graph-ast` |
| **graph_delta** | `none` |
| **graph_delta_note** | 仅文档 / 样例注释 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 能力面文案收敛；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.3.0 epic W3；合入由维护者/00 按当次授权 |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | epic 级 · 2026-10-11 维护者签收 SPEC（继承 · 非本波代签） |
| HG-NEXT-PLAN | approved | — | epic 级 · 同窗签收 PLAN（继承） |
| HG-TASK-DRAFT | approved | 20, 30 | 2026-10-11 **00 签收** · lint + [`task_3_3_w3_ast_docs_audit_R1_20261011.md`](../../harness/reviews/task_3_3_w3_ast_docs_audit_R1_20261011.md) PASS |
| HG-AUDIT-R1 | approved | **30** | 2026-10-11 **00 签收** · **可 30** |

---

## 背景与目标

W1–W2 已交付 opt-in `graph ast check`（symbol + 有界 call · peer skip0 · **不**进默认 verify）。3.2 W4 手册保真分责表仍写「AST 未交付」。本波把对外文案收敛到「已交付、有界、opt-in」，并写清与消费仓本地 `graph:ast-check` 的分工：SpecWave **不**替代业务方言全量 AST。

**本波完成态**：手册保真分责含 `graph ast check`；专节钉死有界 call ≠ 完整 callgraph / 不进默认 verify / 无 peer skip0；MIGRATION 与 README 双语对齐；可选 CI 注释步；对外无违纪夸大；四门绿 · 未 bump/tag/push/publish。

---

## 范围

严格对齐 SPEC `04` **W3** + PLAN **W3** + SPEC `02` §4 / `03` §2。**原则上不改 src 行为**；若仅修正 usage 一行文案可（勿改判定语义）。

### 必做

- [x] **① 手册保真分责表**：[`docs/guides/使用手册-v3.0.0-zh.md`](../../guides/使用手册-v3.0.0-zh.md) §10 四行扩/改至含 `graph ast check`（与 drift / ib / indexes 并列）；补命令面一行（若尚无）
- [x] **② 专节纪律**：同手册（或紧邻 §10）写明：**有界 call ≠ 完整 callgraph**；**opt-in**；**不**进默认 `verify`；无 TS peer → skip exit 0（`no_ts_peer` · 非 usage=1）
- [x] **③ MIGRATION / 消费仓指引**：仓根 [`MIGRATION.md`](../../../MIGRATION.md) 更新保真闸列表与禁止事项——去掉「AST 未交付」违纪禁令口径，改为「已交付有界切片」+ 与本地业务 `graph:ast-check` / 全量方言分工（SW **不**替代）
- [x] **④ README 双语**：[`README.zh-CN.md`](../../../README.zh-CN.md) / [`README.md`](../../../README.md) 命令列表与保真分责段对齐（链手册 §10）
- [x] **⑤ 可选 CI 样例注释**：[`assets/ci/samples/tech-graph.yml.example`](../../../assets/ci/samples/tech-graph.yml.example)（及 samples README 一句）加**注释**可选 `graph ast check`；**禁止**写成默认硬门且无说明；indexes 仍不写硬门禁
- [x] **⑥ 对外无违纪夸大**：grep 自检禁「完整 callgraph」「默认 verify 已含 AST」类宣称
- [x] **⑦ 波末**：四门绿 · gate-check · 提交 `docs(3.3-W3): fidelity table and bounded-call messaging for graph ast` · 禁 `git add -A` · 禁 bump/tag/push/publish · 00 close（task → done · SPEC `04` W3 勾选）

### 可选（不阻塞关账）

- [x] **O1**：`src/cli/usage.ts`（或 graph help）若仍残留「stub / 未实现」误导文案 → **仅**改一行说明为「symbol + 有界 call（非 callgraph）」；**勿**改 exit / skip / 判定语义

## 非范围

| 项 | 理由 |
|----|------|
| bump `3.3.0` / CHANGELOG 发版收口 / ACCEPTANCE | **W4** |
| tag / push / `npm publish` | 仅人 / 当次授权 |
| 改 AST 判定松紧 / peer skip 语义 / 进默认 verify | 禁 · W1–W2 冻结 |
| indexes schema v2 | 另裁 |
| 改 kimi-code-meta / 整包移植 | 反哺纪律 |
| 宣称完整 callgraph / 默认 verify 已含 AST | 文案纪律 |
| 删消费仓本地 `graph:ast-check` | SW 不替代；消费仓自决 |
| 改 drift / ib / indexes / yaml 缺省判定 | 3.2 兼容冻结 |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即改文档落地 | 30 **拒开工**（verify 机械拦） | 是（20 审 + 00 签后） | 是 |
| 对外出现「完整 callgraph」或「默认 verify 已含 AST」 | 打回 · 关账拒签 | 是 | 审查 / grep |
| 仍写「AST 未交付」而命令已交付 | 打回 | 是 | 审查 |
| CI 样例把 `graph ast check` 写成无说明硬门 | 打回 | 是 | 审查 |
| 改 AST 判定语义 / 进 verify | 打回 | 是 | 测红 / 审查 |
| 四门红 | 停 · 修文档/附带 | 是 | 是 |
| bump / tag / push / publish | 打回 · 非本波 | — | 是 |

---

## 验收标准

- [x] **A1 保真表**（必做）：手册 §10 保真分责表含 `graph ast check` 行（与 drift / ib / indexes 并列）；意图对齐 SPEC `02` §4
- [x] **A2 专节**（必做）：手册含专节/段落钉死：有界 call ≠ 完整 callgraph · opt-in · 不进默认 verify · 无 peer skip0（`no_ts_peer`）
- [x] **A3 MIGRATION**（必做）：MIGRATION 更新保真闸含 ast；写明与本地业务 `graph:ast-check` 分工（SW 不替代全量方言）；禁止事项不再写「AST 未交付」
- [x] **A4 README 双语**（必做）：中英 README 命令列表或保真段可见 `graph ast check` / 有界口径；链手册或等价
- [x] **A5 无违纪夸大**（必做）：对改动文档 grep 无「完整 callgraph」「默认 verify 已含 AST」宣称（禁令句本身可保留）
- [x] **A6 CI 可选注释**（推荐）：`tech-graph.yml.example` 注释含 `graph ast check`（明示可选/非硬门禁）或明示跳过不挡关账
- [x] **A7 四门绿**（必做）：`npm run typecheck` → `npm test` → `npm run build` → `npm run test:lib`
- [x] **A8 关账**（必做）：`gate-check` exit 0 + 验收勾选 + 提交约定 message · 禁 `git add -A` · 未 tag/push/publish/bump · task 可移 `docs/tasks/done/` · SPEC `04` W3 勾选 · **00 close**

---

## 给执行帽的必读列表

1. SPEC `02` §4 · `03` §2 · `04` W3 · PLAN W3  
2. 样板 [`task_3_2_w4_migration_docs.md`](../done/task_3_2_w4_migration_docs.md) 及其改动落点（手册 §10 · MIGRATION · README · `assets/ci/samples/`）  
3. 前波 W2 close 遗留：[`invoke_20261011_00_close_3-3-w2.md`](../../harness/invokes/by-task/3-3-w2-graph-ast-impl/invoke_20261011_00_close_3-3-w2.md)  
4. 现行文案落点（30 实读）：手册 §10「保真分责」· MIGRATION「禁止事项」· README 保真段 · CI sample  

---

## 思考轮

### R0 · 证据

W2=`82abf30` 已交付 `graph ast check`；手册/MIGRATION/README 仍写「AST 未交付」——与产品面冲突，须本波纠正。

### R1 · 范围

仅文档 + 可选 CI 注释 + 可选 usage 一行；不改判定语义；不 bump。

### R2 · 方案

改手册分责表+专节 → MIGRATION 分工/禁令 → README 双语 → CI 注释；grep 禁夸大。

### R3 · 边界

不宣称完整 callgraph；不进默认 verify；不替代消费仓全量方言；不改 kimi-code-meta / indexes v2。

### R4 · 可测性

A1–A5 文件/grep；A6 可选；A7–A8 四门+close。

### R5 · 签收就绪

交 20 → 00 按授权签过程闸 → 30 落文档。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | W2 已齐待文档纠偏 | no |
| R1 | 仅 W3 文档 | no |
| R2 | 手册+MIGRATION+README+可选 CI | no |
| R3 | 禁夸大 / 不进 verify | no |
| R4 | A1–A8 | no |
| R5 | 待 20 | no |

**residual_risks**：none（文档波；消费仓本地脚本命名因仓而异，文案用 `graph:ast-check` 作通称即可）

---

## 测试策略（Harness）

**test_strategy**: `recommended`

---

## 提交信息约定

- `docs(3.3-W3): fidelity table and bounded-call messaging for graph ast`

### 自检结论（执行者）

- verify/gate-check：闸 approved · pre-30 invoke 10/20/00 已补  
- A1：手册 §10 保真表含 `graph ast check`  
- A2：有界 call ≠ callgraph 专节 · opt-in · 不进 verify · peer skip0  
- A3：MIGRATION 分工 + 禁夸大（不再写 AST 未交付）  
- A4：README 中英命令列表 + 保真段  
- A5：grep 仅禁令句含「完整 callgraph / 默认 verify 已含 AST」  
- A6：CI sample 注释可选 `graph ast check`  
- A7：四门绿 · assets manifest rebuild（samples）  
- A8：close 留本棒 · 附带 A11 测路径 `done/`（W2 关账漂移）· O1 usage/help 去 stub  
- 未 bump/tag/push/publish

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | 10-task 初稿 · 00 开拆 W3 |
| 2026-10-11 | 20 审 R1 PASS · **00 签收** 过程闸 · 可 30 |
| 2026-10-11 | 30：手册/MIGRATION/README/CI · A1–A7 勾 · A8 留 00 |
| 2026-10-11 | **00 验收关账** · A8 close · SPEC04 W3 勾选 · W4 未开 |

### KPI（00）

Task_KPI%: 96（A1–A8 · 文档波 · 四门绿 · 保真分责+有界文案；扣分：无）

- rubric：`KPI_RUBRIC_v1_2`
