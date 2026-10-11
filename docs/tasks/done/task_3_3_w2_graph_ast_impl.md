# Task：3.3 W2 · graph ast check 实装（symbol + 有界 call）

> **状态**：`done` · **00 验收关账** 2026-10-11（A1–A11）  
> **上游 SPEC**：[`docs/spec/3_3-graph-ast-opt-in/`](../../spec/3_3-graph-ast-opt-in/README.md)（**HG-SPEC-SIGNOFF=approved** · 2026-10-11 维护者）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md`](../../roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md)（**HG-NEXT-PLAN=approved**）· **W2 · AST 实现 + 测**  
> **SPEC 波钉**：[`04_execution_waves.md`](../../spec/3_3-graph-ast-opt-in/04_execution_waves.md) **W2** · [`03_cli_and_review.md`](../../spec/3_3-graph-ast-opt-in/03_cli_and_review.md) §1.1 / §3–§4 · [`02_product_scheme.md`](../../spec/3_3-graph-ast-opt-in/02_product_scheme.md) §3  
> **前波**：[`docs/tasks/done/task_3_3_w1_graph_ast_cli.md`](../done/task_3_3_w1_graph_ast_cli.md)（W1 CLI 面 · stub `ast_not_implemented` · commit `fe454f0`）  
> **过程授权**：维护者授权本 epic **00 签收过程文档**（`HG-TASK-DRAFT` / `HG-AUDIT-R1` · 须 lint + 20-task-audit R1 PASS）· 见 [`invoke_20261011_00_epic_signoff.md`](../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_epic_signoff.md)  
> **行号口径**：本 task `file:line` 为 **2026-10-11 10-task 起草棒实读现值**（实现前 30 须复核）  
> **Open Folder**：仓根 · **工作分支**：`task/specwave-3-3-graph-ast`

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-3-w2-graph-ast-impl` |
| **test_strategy** | `required` |
| **test_strategy_note** | 正负向 fixture 先行/同步：symbol 存在/缺失 · 同 path 有界 call 缺失/存在 · 跨 path 不红 · 无 IB · 无 peer · TBD 跳过；替换 W1 A4 stub 断言；既有 drift/ib/indexes/yaml/scaffold + W1 契约测零回归；四门为波末硬条款 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `task/specwave-3-3-graph-ast` |
| **graph_delta** | `none` |
| **graph_delta_note** | 本波实装 CLI 深检；**不**改 kit 自图语料语义；测用临时 fixture |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 能力面加深；手册分责归 **W3**；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.3.0 epic W2；合入由维护者/00 按当次授权 |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | epic 级 · 2026-10-11 维护者签收 SPEC（继承 · 非本波代签） |
| HG-NEXT-PLAN | approved | — | epic 级 · 同窗签收 PLAN（继承） |
| HG-TASK-DRAFT | approved | 20, 30 | 2026-10-11 **00 签收**（维护者授权签收过程文档）· 依据 lint PASS + [`task_3_3_w2_graph_ast_impl_audit_R1_20261011.md`](../../harness/reviews/task_3_3_w2_graph_ast_impl_audit_R1_20261011.md) PASS · blocking 0 |
| HG-AUDIT-R1 | approved | **30** | 2026-10-11 **00 签收**（同授权）· 依据同上 20 审 R1 PASS · **可 30** |

---

## 背景与目标

W1 已钉 `graph ast check` CLI 面、peer skip=`no_ts_peer`、stub `ast_not_implemented` 与「不进默认 verify」。本波替换 stub：对已声明 IB 且可解析的 TS/TSX 文件做 **symbol 核对** + **有界 call**（同 path 红 · 跨 path 不红）。

**本波（W2）完成态**：peer 可用且有待检项时进入真检；symbol 缺失 → exit 2 · `missing_ib_symbol`；同 path 有界 call 引用缺失 → exit 2 · `missing_bounded_call`；跨 path 边不红（`inform.cross_path_edges` 可计）；无 IB / 无 peer / TBD 跳过语义保持 W1；**消除** `ast_not_implemented` 作为有 peer 待检时的正常出口；四门绿 · 未 bump/tag/push/publish。手册分责留给 **W3**。

---

## 范围

严格对齐 SPEC `04` **W2** + PLAN **W2** + SPEC `02` §3 / `03` §1.1。

### 必做

- [x] **① 替换 stub**：`src/cli-graph-ast.ts` 去掉「有 peer + 待检 → `ast_not_implemented`」假绿路径；改为 symbol + 有界 call 真检（样板：W1 本文件 · `cli-graph-ib.ts` 遍历/信封）
- [x] **② symbol 核对**：IB 含有效 `path` + 非空非 `TBD` `symbol` · 目标文件存在且为 TS/TSX → 在 AST 中查声明/export/类成员等同名符号；缺失 → issue `missing_ib_symbol` · 汇总 exit **2**
- [x] **③ 有界 call**：边两端均可检（有效 path+symbol）时：同 path → caller 文件 AST 须含对 callee symbol 的 Identifier / PropertyAccess 类引用（排除声明名自身）；缺失 → `missing_bounded_call` · exit **2**；**跨 path → 不红** · `inform.cross_path_edges` 递增（可选摘要）
- [x] **④ 跳过语义**：无 IB / 无可检项 → exit 0 · checked=0；path/symbol 空或 `TBD` 跳过；非 TS/TSX 跳过；无 typescript peer → **保持 W1** `no_ts_peer` skip exit 0；不硬编码 kind 字面量（F1 单源）
- [x] **⑤ path 缺失**：文件不存在 → **跳过**该 IB 的 AST 项（点 path 仍归 `graph ib check`；本命令不替代 ib）
- [x] **⑥ peer 依赖**：复用包内已有 `typescript`（devDep）；已标 **optional peer**；探测逻辑对齐 W1 `hasTypescriptPeer`（相对 `--target` · 不回落 kit 内假阳性）
- [x] **⑦ 不进 verify / 不改缺省**：默认 `verify` **不**调用 ast check；**不**改 drift/ib/indexes/yaml 缺省判定
- [x] **⑧ 测试**：扩展 `test/graph-ast-check.test.ts`——symbol 正/负 · 有界 call 同 path 正/负 · 跨 path 不红 · 无 IB · 无 peer · TBD 跳过；**改写**原 A4 stub 断言；既有 graph 套件零回归
- [x] **⑨ 纪律**：禁整包 cp 消费仓工具；禁七域硬编码 / defer 目录抄袭；禁完整 callgraph；禁 indexes schema v2；禁改 kimi-code-meta；禁开 W3+ 实现码
- [x] **⑩ 波末**：四门绿 · HG-AUDIT-R1（00 签后）· gate-check；禁 bump/tag/push/publish；禁 `git add -A`

### 可选（不阻塞关账）

- [x] **O1**：usage/help 文案从「W1 stub」改为「symbol + 有界 call（非 callgraph）」——推荐同波改以免误导

## 非范围

| 项 | 理由 |
|----|------|
| 完整 callgraph / 跨 path call 红 | SPEC 禁止夸大 |
| 把 AST 绑进默认 `verify` | 政策硬约束 |
| 改 drift / ib / indexes / yaml 缺省语义 | 3.2 兼容冻结 |
| indexes schema v2 | 另裁 |
| 手册保真分责 / MIGRATION 专节 | **W3** |
| bump 3.3.0 / tag / push / `npm publish` | **W4** / 仅人 |
| 改 kimi-code-meta / 整包移植 | 反哺纪律 |
| 七域硬编码 / issue-sync / completeness 业务 | 禁进 core |
| 强制 `typescript` 进 `dependencies` | 零强迫 |
| 类型相容 / overload 全集 / re-export 深追 | 本版最小证明 |
| 多语言 AST | 另裁 |
| 污染本仓 dogfood `_tech_graph` 当负向 fixture | 测用临时目录 |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码 | 30 **拒开工**（verify 机械拦） | 是（20 审 + 00 签后） | 是 |
| symbol 在 path AST 中不存在 | exit 2 · `missing_ib_symbol` · 点名 node/path/symbol | 是（改码或改 YAML） | 是 / CI 红 |
| 同 path 有界 call 引用缺失 | exit 2 · `missing_bounded_call` · 点名 edge/from/to | 是 | 是 / CI 红 |
| 跨 path 边 | 就该项 **不红** · inform 计数可选 | — | 摘要非红 |
| 无 typescript peer | **exit 0** · `skipped_reason=no_ts_peer`（非 usage=1） | 是（安装 peer） | 是 |
| 无 IB / 全跳过 / checked=0 | exit 0 | — | 摘要 |
| path/symbol 空或 TBD | 跳过该项 | — | — |
| path 文件不存在 | 跳过该项 AST（引导先 `graph ib check`） | 是 | 摘要 |
| `--json` 且有红项 | exit 2 · JSON 列 issues | 是 | 是 |
| 非 git 仓 | 沿用 `resolveTarget` fail 形态 | 是 | 是 |
| 仍走 `ast_not_implemented` 当正常有 peer 出口 | 打回（本波须消除） | 是 | 审查 / 测红 |
| 跨 path 记红 / 完整 callgraph | 打回 | — | — |
| 把 AST 塞进默认 verify | 打回 | — | — |
| 改 drift/ib/indexes/yaml 缺省 | 打回 | 是 | 审查 / 测红 |
| 整包 cp / 七域硬编码 / indexes v2 | 打回 | — | — |
| `git add -A` 裹挟域外档 | 打回 | 是 | — |
| 四门任一红 | 停止 · 先修再关账 | 是 | 是 |

---

## 验收标准

> **必做** A1–A11 为关账硬条款；**可选** A-opt1 不挡关账。

- [x] **A1 symbol 正**（必做）：fixture 真 symbol 存在 → `graph ast check` **exit 0** · issues 无 `missing_ib_symbol`
- [x] **A2 symbol 负**（必做）：fixture 假 symbol → **exit 2** · issues 含 `missing_ib_symbol`
- [x] **A3 有界 call 同 path 负**（必做）：同 path 两端可检但 caller 无对 callee 引用 → **exit 2** · `missing_bounded_call`
- [x] **A4 有界 call 同 path 正**（必做）：同 path 且有引用 → 就该项不红（整图无其它红则 exit 0）
- [x] **A5 跨 path 不红**（必做）：跨 path 边 **不**产生 `missing_bounded_call`；exit 就该项为绿；`inform.cross_path_edges >= 1`（若实现计数）
- [x] **A6 无 IB / 无 peer**（必做）：无 IB → exit 0 · checked=0；无 peer → exit 0 · `no_ts_peer`（**非** status=1）；对齐 W1
- [x] **A7 TBD/空跳过**（必做）：symbol 或 path 为空/`TBD` 不因该项红
- [x] **A8 stub 消除**（必做）：peer 可用且有待检 IB 时 **不得**再以 `skipped_reason=ast_not_implemented` 作为正常出口（原 W1 A4 改写）
- [x] **A9 不进 verify / 只读 / 零回归**（必做）：verify 默认链无 `graph ast check` 步；成功/红路径零写盘目标图谱；既有 drift/ib/indexes/yaml/scaffold 相关测全绿
- [x] **A10 四门**（必做）：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib` 全绿
- [x] **A11 关账**（必做）：`gate-check` exit 0 + 验收勾选 + 提交 `feat(3.3-W2): graph ast check symbol and bounded call` · 禁 `git add -A` · 未 tag/push/publish/bump · task 可移 `docs/tasks/done/` · SPEC `04` W2 勾选

- [x] **A-opt1**（可选）：help/usage 去掉「W1 stub / ast_not_implemented」误导表述

---

## 给执行帽的必读列表

1. [`docs/spec/3_3-graph-ast-opt-in/04_execution_waves.md`](../../spec/3_3-graph-ast-opt-in/04_execution_waves.md) **W2** · [`02`](../../spec/3_3-graph-ast-opt-in/02_product_scheme.md) §3 · [`03`](../../spec/3_3-graph-ast-opt-in/03_cli_and_review.md) §1.1 / §3–§4  
2. [`docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md`](../../roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md) **W2**  
3. 前波：[`docs/tasks/done/task_3_3_w1_graph_ast_cli.md`](../done/task_3_3_w1_graph_ast_cli.md) · `src/cli-graph-ast.ts` · `test/graph-ast-check.test.ts`  
4. 样板：`src/cli-graph-ib.ts` · `src/cli-graph.ts` · `src/cli-shared.ts`（`printJson`）  
5. 统筹：[`invoke_20261011_00_orchestrate_w1_w4.md`](../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_orchestrate_w1_w4.md)  
6. `docs/standards/` 涉码 L2（改 `src/` 时 · 30 自裁）

---

## 思考轮

### R0 · 证据（起草棒实读现值）

| 锚点 | 实读 |
|------|------|
| W1 stub | `src/cli-graph-ast.ts` · peer 在且有待检 → `skipped_reason: 'ast_not_implemented'` · `checked: 0` |
| collect 无 symbol | `collectAstCheckable` 只推 path/source/nodeId · **未**带 symbol（W2 须补） |
| ib 收集 | `cli-graph-ib.ts` `collectImplementedByPaths` 校验 symbol 类型但不透出字段 |
| peer 探测 | `hasTypescriptPeer` · 相对 target `package.json` createRequire · 禁回落 kit |
| 测 A4 | `test/graph-ast-check.test.ts` 断言 `ast_not_implemented` · **W2 必须改写** |
| typescript | `package.json` · `devDependencies.typescript` · 非 peer（本波可加 optional peer） |
| verify | 无 graph ast 默认步（W1 A6 锁） |
| SPEC/PLAN | `04` W2 未勾；`02` §3.1–3.2；`03` exit 2 kinds |

本波 HG-TASK-DRAFT / HG-AUDIT-R1 起草时仍 **pending**。

### R1 · 范围

仅 W2：替换 stub · symbol + 有界 call · 测 · 不进 verify。排除 W3 手册、W4 bump、callgraph、indexes v2。

### R2 · 方案

- 扩展 collect：IB 带 symbol；跳过空/TBD；缺文件跳过。  
- 动态 `require('typescript')`（相对 target，与 peer 探测一致）解析 SourceFile。  
- 声明名集合（function/class/interface/type/enum/var/method/property）做 symbol 存在性。  
- 边：两端可检且同 path → 引用扫描；跨 path → inform++。  
- 可选 optional peer 声明；不进 dependencies。

### R3 · 边界

只报告不写盘；跨 path 永不因 call 红；不替代 ib path 闸；不整包移植；不进默认 verify。

### R4 · 可测性

A1–A9 临时 fixture + exit/json；A10–A11 四门+gate-check/close。先改写 A4。

### R5 · 签收就绪

五槽完毕；交 20-task-audit → **00 按维护者授权**签 HG-TASK-DRAFT + HG-AUDIT-R1 后方可 30。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | stub/A4 待替换 · collect 缺 symbol · TS 仅 devDep | no |
| R1 | 仅 W2 真检 · 排 W3–W4 / callgraph | no |
| R2 | TS AST 最小声明+引用 · 同 path 红 · 跨 path inform | no |
| R3 | 只读 · 不替 ib · 不进 verify | no |
| R4 | A1–A11 机检 | no |
| R5 | 待 20 审 R1 · 00 签过程闸 | no |

**residual_risks**：① 声明探测粒度（export default / 命名空间）可能漏检——本版钉「具名声明最小集」并测锁；② 引用扫描假阳性（同名局部变量）——有界诚实边界，文档/W3 标明非 callgraph；③ path 缺失跳过 vs 红——本波钉跳过，依赖 ib check 分责。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 正负向 + 跨 path 不红测与实现同步；改写 W1 stub 断言；既有 graph 套件与 W1 peer/无 IB/verify 契约测零回归；波末四门 + gate-check。

**旧测影响面（K7）**：`test/graph-ast-check.test.ts`（A4 必改）；`test/graph-ib*` / `graph-indexes*` / `graph-drift*` / verify 相关 **不得**改缺省语义。

---

## 提交信息约定

- 实现提交：`feat(3.3-W2): graph ast check symbol and bounded call`  
- **禁 `git add -A`**：逐文件显式 add  
- **不裹挟** `eval/external-oracle/` 等未跟踪档 · 不裹挟 W3+  
- **禁 tag / push / publish / bump 3.3.0**  
- 波末：`npx spec-wave gate-check --task docs/tasks/active/task_3_3_w2_graph_ast_impl.md`（或本仓 `node bin/` 等价）

---

### 自检结论（执行者）

- **hat**：30-execute（兼 40 自检）· 工作支 `task/specwave-3-3-graph-ast`（关账提交）
- **GATE**：`gate-check` → HG-AUDIT-R1=approved · VERIFY 可 30
- **实现**：`src/cli-graph-ast.ts` 真检 symbol + 有界 call；optional peer `typescript`；消除 `ast_not_implemented`
- **测**：`test/graph-ast-check.test.ts` **14** 例全绿
- **四门 / A10**：typecheck · test（998 pass / 0 fail · 含 ast×14）· build · test:lib **全绿**
- **A11**：00 本窗 close · 未 bump/tag/push/publish
- **advisory**：N1–N5 已吸收；A-opt1=已做

### KPI（00）

Task_KPI%: 96（A1–A11 全绿 · ast check 14 测 · 四门绿 · stub 消除 · 跨 path 不红 · 不进 verify；扣分：无）

- rubric：`KPI_RUBRIC_v1_2` · 30/40 实现 + 00 签闸/关账

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | 10-task 初稿 · 00 开拆 W2 · HG-TASK-DRAFT / HG-AUDIT-R1 **pending** · 过程授权已记 |
| 2026-10-11 | 20 审 R1 PASS · **00 签收** HG-TASK-DRAFT / HG-AUDIT-R1 → approved · 可 30 |
| 2026-10-11 | 30/40：W2 实现 · A1–A10 · A11 close 由 00 |
| 2026-10-11 | **00 验收关账** · A11 close · SPEC04 W2 勾选 · W3 未开 |
