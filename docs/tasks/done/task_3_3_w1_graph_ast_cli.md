# Task：3.3 W1 · graph ast check CLI 面（opt-in stub / peer skip）

> **状态**：`done` · **00 验收关账** 2026-10-11（A1–A10）  
> **上游 SPEC**：[`docs/spec/3_3-graph-ast-opt-in/`](../../spec/3_3-graph-ast-opt-in/README.md)（**HG-SPEC-SIGNOFF=approved** · 2026-10-11 维护者）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md`](../../roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md)（**HG-NEXT-PLAN=approved** · 同窗）· **W1 · 契约 / CLI 面**  
> **SPEC 波钉**：[`04_execution_waves.md`](../../spec/3_3-graph-ast-opt-in/04_execution_waves.md) **W1** · [`03_cli_and_review.md`](../../spec/3_3-graph-ast-opt-in/03_cli_and_review.md) §1.1 · [`02_product_scheme.md`](../../spec/3_3-graph-ast-opt-in/02_product_scheme.md) §2  
> **过程授权**：维护者授权本 epic **00 签收过程文档**（`HG-TASK-DRAFT` / `HG-AUDIT-R1` · 须 lint + 20-task-audit R1 PASS）· 见 [`invoke_20261011_00_epic_signoff.md`](../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_epic_signoff.md) · [`invoke_20261011_00_orchestrate_w1_w4.md`](../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_orchestrate_w1_w4.md)  
> **行号口径**：本 task `file:line` 为 **2026-10-11 10-task 起草棒实读现值**（实现前 30 须复核）  
> **Open Folder**：仓根 · **工作分支**：`task/specwave-3-3-graph-ast`（自主干切出 · 与 epic 统筹一致）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-3-w1-graph-ast-cli` |
| **test_strategy** | `required` |
| **test_strategy_note** | 红测/契约测先行：临时 fixture；覆盖 peer 缺失 skip=0 · help 可见 · 不进 verify · stub 不假绿（`ast_not_implemented`）· 无 IB checked=0 · `--json` · 既有 drift/ib/indexes/yaml/scaffold 零回归；四门为波末硬条款 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `task/specwave-3-3-graph-ast` |
| **graph_delta** | `none` |
| **graph_delta_note** | 本波新增 CLI/测；**不**改 kit 自图语料语义；dogfood 只读对照 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 能力面新增；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.3.0 epic W1；合入由维护者/00 按当次授权 |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | epic 级 · 2026-10-11 维护者签收 SPEC（继承 · 非本波代签） |
| HG-NEXT-PLAN | approved | — | epic 级 · 同窗签收 PLAN（继承） |
| HG-TASK-DRAFT | approved | 20, 30 | 2026-10-11 **00 签收**（维护者授权签收过程文档 · 原文「授权00签收后续所有文档」）· 依据 lint PASS + [`task_3_3_w1_graph_ast_cli_audit_R1_20261011.md`](../../harness/reviews/task_3_3_w1_graph_ast_cli_audit_R1_20261011.md) PASS · blocking 0 |
| HG-AUDIT-R1 | approved | **30** | 2026-10-11 **00 签收**（同授权）· 依据同上 20 审 R1 PASS · **可 30** |

---

## 背景与目标

3.2 已交付 `graph ib check`（点 path）与 `graph indexes check`（opt-in 双向）；AST symbol / 有界 call 仍未产品化。3.3 epic 要交付 **opt-in** `graph ast check`，且**不**进默认 `verify`、无 TS peer 零强迫。

**本波（W1）完成态**：注册 CLI 面与契约测锁——peer 缺失 → **skip exit 0** + `skipped_reason`（**禁止** usage=1）；无 IB / 无可检项 → exit 0 · checked=0；深检未实装时显式 `skipped_reason`（如 `ast_not_implemented`）· **不得假绿假装已做 symbol/call**；`--json` 信封对齐 ib/indexes；四门绿 · 未 bump/tag/push/publish。深检留给 **W2**。

---

## 范围

严格对齐 SPEC `04` **W1** + PLAN **W1** + SPEC `02` §2 / `03` §1.1。统筹钉死：**无 TS peer → skip exit 0**（非 usage=1）。

### 必做

- [x] **① CLI 接线**：`graph ast check [--target PATH] [--input DIR] [--json]` 接入 `src/cli-graph.ts`（help 列出 · 未知子命令不再吞掉 `ast`）；实现落新模块（推荐 `src/cli-graph-ast.ts`）· 样板 `cli-graph-ib.ts` / `cli-graph-indexes.ts`
- [x] **② peer 契约（钉死）**：无可用 `typescript`（相对 `--target` 解析失败）→ **exit 0** · 报告含 `skipped_reason`（推荐键值 `no_ts_peer`）· **禁止** exit 1 usage
- [x] **③ 无 IB / 无可检项**：扫描 input 下 graph yaml；无待检 IB → **exit 0** · `checked=0`（零打扰）
- [x] **④ stub 不假绿**：本波**不**实现 symbol / 有界 call 深检；若 peer 可用且存在待检项（或实现选择统一 stub 路径）→ **exit 0** + 显式 `skipped_reason`（如 `ast_not_implemented`）· issues 不得假装已核对通过
- [x] **⑤ `--json`**：经 `printJson`；信封含 `command` / `ok` / `issues` / `skipped_reason`（可空）/ checked 类计数 / 可选 inform；**禁止**改既有 drift/ib/indexes/yaml/scaffold 默认 stdout/exit
- [x] **⑥ 不进 verify**：默认 `verify` 链**不**调用 `graph ast check`；测锁
- [x] **⑦ 测试**：新建 `test/graph-ast-check.test.ts`（或等价）；peer 缺失 · help · 不进 verify · stub skip · 无 IB；既有 graph 套件零回归
- [x] **⑧ usage**：`src/cli/usage.ts`（及 graph `--help`）可发现 `graph ast check`
- [x] **⑨ 波末**：四门绿 · HG-AUDIT-R1（00 签后）· gate-check；禁 bump/tag/push/publish；禁 `git add -A`；禁开 W2+ 深检实现

### 可选（不阻塞关账）

- [x] **O1**：顶层 `usage.ts` 是否同步列出 `graph indexes check`（历史缺口）——本波**可不**修；若顺手修须单独说明且不挡关账 · A-opt1=N/A（未修 indexes 历史缺口）

## 非范围

| 项 | 理由 |
|----|------|
| symbol / 有界 call 深检实装 | **W2** |
| 完整 callgraph / 跨 path 红 | SPEC 禁止夸大 |
| 把 AST 绑进默认 `verify` | 政策硬约束 |
| 改 drift / ib / indexes / yaml 缺省语义 | 3.2 兼容冻结 |
| indexes schema v2 | 另裁 |
| 改 kimi-code-meta / 整包移植 | 反哺纪律 |
| 七域硬编码 / issue-sync / completeness 业务 | 禁进 core |
| 强制 `typescript` 进 `dependencies` | 零强迫 · prefer 动态探测 |
| bump 3.3.0 / tag / push / `npm publish` | W4 / 仅人 |
| 污染本仓 dogfood `_tech_graph` 当负向 fixture | 测用临时目录 |
| 自动 approved 任何 HG | 闸纪律（本波过程闸仅 00 按授权） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码 | 30 **拒开工**（verify 机械拦） | 是（20 审 + 00 签后） | 是 |
| 无 typescript peer | **exit 0** · `skipped_reason=no_ts_peer`（或等价）· **非** usage=1 | 是（安装 peer） | 是 / 摘要 |
| 无 IB / 全跳过 / 无可检项 | **exit 0** · checked=0 | — | 摘要 |
| 深检未实装（W1 stub） | **exit 0** · `skipped_reason=ast_not_implemented`（或等价）· 不假绿 | 是（W2） | 是 |
| `--json` 且 skip | exit 0 · JSON 含 skipped_reason | — | 是 |
| 非 git 仓 | 沿用 `resolveTarget` fail 形态 | 是 | 是 |
| 试图写盘「修复」图谱或源码 | **禁止** | — | — |
| 改 drift/ib/indexes/yaml 缺省 | 打回 | 是 | 审查 / 测红 |
| 把 AST 塞进默认 verify | 打回 | — | — |
| 实现完整 symbol/call（越 W1） | 打回 · 留给 W2 | — | — |
| `git add -A` 裹挟域外档 | 打回 | 是 | — |
| 四门任一红 | 停止 · 先修再关账 | 是 | 是 |

---

## 验收标准

> **必做** A1–A10 为关账硬条款；**可选** A-opt1 不挡关账。

- [x] **A1 命令面**（必做）：`graph --help`（及/或 `graph ast check --help`）可发现 `graph ast check` 与旗标 `--target` / `--input` / `--json`；未知子命令不再把 `ast` 吞掉后无用法  
- [x] **A2 peer 缺失 skip**（必做）：临时 target **无**可解析 `typescript` → **exit 0** · 输出/JSON 含 `skipped_reason`（`no_ts_peer` 或文档等价）· **status ≠ 1**  
- [x] **A3 无 IB 零打扰**（必做）：无任何 `implementedBy` 的图 → **exit 0** · checked=0（或等价计数）  
- [x] **A4 stub 不假绿**（必做）：peer 可用或存在待检 IB 时，W1 **不得**输出「已完成 symbol/call 核对」的假 PASS；须显式 `skipped_reason`（如 `ast_not_implemented`）且 exit 0，**或**尚无可检项走 A3  
- [x] **A5 `--json`**（必做）：`--json` 经 `printJson` 可解析；含 `command: "graph ast check"` · `ok` · `issues` · `skipped_reason`（可 null）· 计数字段；既有其它 graph `--json` 零回归  
- [x] **A6 不进 verify**（必做）：对已有/本 task 跑 `verify --task …` **不**强制执行 `graph ast check`（stdout 不出现该步为硬门）  
- [x] **A7 只读**（必做）：成功/skip 路径零写盘目标 `_tech_graph`  
- [x] **A8 既有命令零回归**（必做）：不改 drift/ib/indexes/yaml/scaffold 缺省语义；既有相关测试全绿  
- [x] **A9 四门**（必做）：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib` 全绿  
- [x] **A10 关账**（必做）：`gate-check` exit 0 + 验收勾选 + 提交 `feat(3.3-W1): graph ast check CLI surface (opt-in stub/skip)` · 禁 `git add -A` · 未 tag/push/publish/bump · task 可移 `docs/tasks/done/` · SPEC `04` W1 勾选  

- [x] **A-opt1**（可选）：顶层 usage 是否补 `graph indexes check` 历史缺口 — N/A（本波未修）

---

## 给执行帽的必读列表

1. [`docs/spec/3_3-graph-ast-opt-in/04_execution_waves.md`](../../spec/3_3-graph-ast-opt-in/04_execution_waves.md) **W1** · [`02`](../../spec/3_3-graph-ast-opt-in/02_product_scheme.md) §2 · [`03`](../../spec/3_3-graph-ast-opt-in/03_cli_and_review.md) §1.1 / §3–§4  
2. [`docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md`](../../roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md) **W1**  
3. 统筹钉死：[`invoke_20261011_00_orchestrate_w1_w4.md`](../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_orchestrate_w1_w4.md)（peer=skip0 · 不进 verify · stub 不假绿）  
4. 样板：`src/cli-graph.ts` · `src/cli-graph-ib.ts` · `src/cli-graph-indexes.ts` · `src/cli/usage.ts` · `src/cli-shared.ts`（`printJson`）  
5. 样板 task：`docs/tasks/done/task_3_2_w1_graph_ib_check.md` · `task_3_2_w3_graph_indexes.md`  
6. `docs/standards/` 涉码 L2（改 `src/` 时 · 30 自裁）

---

## 思考轮

### R0 · 证据（起草棒实读现值）

| 锚点 | 实读 |
|------|------|
| graph help 无 ast | `src/cli-graph.ts:55-58` 列 ib / indexes · **无** `ast` |
| 分发无 ast | `src/cli-graph.ts:77-84` 有 `ib` / `indexes` · **无** `ast` 分支 |
| 顶层 usage | `src/cli/usage.ts:76` 有 ib · **无** ast（indexes 亦未列 · 本波可选） |
| ib 样板 | `src/cli-graph-ib.ts` · `runGraphIbCheck` + `--json` + exit 2 红项 |
| indexes 样板 | `src/cli-graph-indexes.ts` · opt-in · 不进 verify（测锁于 `test/graph-indexes-check.test.ts` A8） |
| typescript | `package.json` · `devDependencies.typescript` · **非** peerDependencies；动态探测为宜 |
| verify | `src/cli/verify.ts` · 人工闸/lint/审查 · **无** graph ast 步 |
| SPEC/PLAN | `04` W1；PLAN W1；03 §1.1；epic 双闸 approved · 过程授权 00 签 |

本波 HG-TASK-DRAFT / HG-AUDIT-R1 起草时仍 **pending**。

### R1 · 范围

仅 W1：CLI 注册 + peer skip=0 + stub/skip 信封 + 测 + 不进 verify。排除 W2 深检、W3 手册、W4 bump。

### R2 · 方案

- 新模块 `cli-graph-ast.ts`：复用 ib 的 yaml 遍历 / `resolveTarget` / `printJson` 模式。  
- peer：相对 `--target` 的 `createRequire` 探测 `typescript`；失败 → `no_ts_peer` exit 0。  
- stub：peer 在且有待检项 → `ast_not_implemented` exit 0（W2 替换为真检）。  
- 缺省不改 verify / drift / ib / indexes。

### R3 · 边界

只报告不写盘；无 IB 零打扰；不做深检；不代签 release 闸；不进默认 verify；不强制 typescript dependencies。

### R4 · 可测性

A1–A8 临时 fixture + exit/stdout/json；A9–A10 四门+gate-check/close。契约测先行。

### R5 · 签收就绪

五槽完毕；交 20-task-audit → **00 按维护者授权**签 HG-TASK-DRAFT + HG-AUDIT-R1 后方可 30。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 无 ast 命令 · ib/indexes 可参考 · TS 仅 devDep | no |
| R1 | 仅 W1 CLI/契约 · 排 W2+ | no |
| R2 | 新模块 + peer skip0 + stub reason | no |
| R3 | 只读 · 零打扰 · 不进 verify | no |
| R4 | A1–A10 机检 | no |
| R5 | 待 20 审 R1 · 00 签过程闸 | no |

**residual_risks**：① peer 探测相对 target vs 包内 resolve 歧义——A2 以临时 target 无 typescript 为准并测锁；② stub 与「无 IB checked=0」两态并存——A3/A4 分测，避免消费者误读「已检」；③ W2 接手时须替换 `ast_not_implemented` 路径而非叠加假绿。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 先（或同步）落地契约测（peer 缺失 skip · help · 不进 verify · stub reason · 无 IB · `--json`），再接线实现；既有 graph 套件零回归；波末四门 + gate-check。

---

## 提交信息约定

- 实现提交：`feat(3.3-W1): graph ast check CLI surface (opt-in stub/skip)`  
- **禁 `git add -A`**：逐文件显式 add  
- **不裹挟** `eval/external-oracle/` 等未跟踪档 · 不裹挟 W2+ 实现  
- **禁 tag / push / publish / bump 3.3.0**  
- 波末：`npx spec-wave gate-check --task docs/tasks/active/task_3_3_w1_graph_ast_cli.md`（或本仓 `node bin/` 等价）

---

### 自检结论（执行者）

- **hat**：30-execute（兼 40 自检）· 工作支 `task/specwave-3-3-graph-ast`（关账提交）
- **GATE**：`gate-check` → HG-AUDIT-R1=approved · VERIFY 可 30
- **实现**：`src/cli-graph-ast.ts` · `cli-graph.ts` / `usage.ts` 接线；peer=`no_ts_peer` skip0；stub=`ast_not_implemented`；不进 verify
- **测**：`test/graph-ast-check.test.ts` **9** 例全绿
- **四门 / A9**：typecheck · test（994 pass / 0 fail · 含 ast×9）· build · test:lib **全绿**
- **A10**：00 本窗 close · 未 bump/tag/push/publish
- **advisory**：N1–N5 已吸收；A-opt1=N/A

### KPI（00）

Task_KPI%: 96（A1–A10 全绿 · ast check 9 测 · 四门绿 · peer skip0 · stub 不假绿 · 不进 verify；扣分：无）

- rubric：`KPI_RUBRIC_v1_2` · 30/40 实现 + 00 签闸/关账

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | 10-task 初稿 · 00 开拆 W1 · HG-TASK-DRAFT / HG-AUDIT-R1 **pending** · 过程授权已记 |
| 2026-10-11 | 20 审 R1 PASS · **00 签收** HG-TASK-DRAFT / HG-AUDIT-R1 → approved · 可 30 |
| 2026-10-11 | 30/40：W1 实现 · A1–A9 · A10 close 由 00 |
| 2026-10-11 | **00 验收关账** · A10 close · SPEC04 W1 勾选 · W2 未开 |
