# Task：3.0.1 W2 · 闸表契约封堵（P2-4 · 文档陷阱）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · HG-W2-REVIEW=approved（**2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· 依据 R1 [`task_3_0_1_w2_gate_table_contract_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_w2_gate_table_contract_audit_R1_20260918.md) PASS · blocking 0 · 契约评审 [`w2_gate_parse_warning_contract_review_20260918.md`](../../harness/reviews/w2_gate_parse_warning_contract_review_20260918.md)）· 30/40 闭环完成 · 2026-09-18 · **未发版 / 未 commit**）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（**HG-NEXT-PLAN=approved** · 2026-09-18 维护者签收 · 授权 00 代签过程闸 · HG-RELEASE / tag / push / publish 仍仅人）· **W2 节** + 硬约束 **3**（patch 纪律门）/ **5**（「不要静默」总则）  
> **范围主源**：[`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) **§6.2 P2-4** + **§5.6** A/B 对照（README 最小骨架 3 列被静默忽略）· PLAN 起草期捕获的 id 内嵌 `**` 子形态  
> **基线**：`spec-wave@3.0.0` published（npm `latest` = 3.0.0 · tag `v3.0.0`）· 前序波次 W1 已 CLOSE: PASS  
> **行号口径**：本 task 全部 `file:line` 为 **2026-09-18 10-task 起草棒实读现值**（PLAN 行号可能漂移 · 已再钉）  
> **Open Folder**：仓根  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A（同 2.4.x / W1 patch 先例）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-1-w2-gate-table-contract` |
| **test_strategy** | `required` |
| **test_strategy_note** | 红测先行：① 3 列闸表 + `HG-AUDIT-R1=approved` ⇒ 空解析告警存在（stderr 或 `--json#warnings`）且 exit 语义不变 ② 4 列同内容 ⇒ 无告警且 `may_start_30=true` ③ 3 列 + pending 既有阻断不回退 ④ id 单元格内嵌 `**` ⇒ 告警 + 负向测 ⑤ README.md / README.zh-CN.md / TASK_TEMPLATE.md 骨架**逐字**喂 `parseHumanGates`（README 修后非空 · 模板 ≥1）⑥ `docs/tasks/` 全量解析结果零变化；四门为波末硬条款 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | patch 级文档 + 空解析告警；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 修复性 patch（文档陷阱封堵 + 可见告警）；无规范增量；「样例入测 / id 禁内嵌粗体」纪律由关账经验总结留痕，晋升 wiki 与否归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0.1 patch 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-18 维护者签收 PLAN_3_0_1（原文意图：「身为00，统筹3.0.1的升级，授权签收过程文档」）· 开 W 波限制已解除 |
| HG-SPEC-SIGNOFF | N/A | — | 本版无独立 SPEC 夹（属 3.0.0 验收后 patch · 同 2.4.1/2.4.2 / W1 先例） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· task lint PASS · 10/20 invoke 已落 |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-18 00 代签** · 依据 R1 [`task_3_0_1_w2_gate_table_contract_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_w2_gate_table_contract_audit_R1_20260918.md)（PASS · blocking 0） |
| HG-W2-REVIEW | **approved** | 30 | **2026-09-18 00 代签** · 依据契约评审 [`w2_gate_parse_warning_contract_review_20260918.md`](../../harness/reviews/w2_gate_parse_warning_contract_review_20260918.md)（C1–C8：stderr + `--json#warnings` 只增不改 · 不放宽 `GATE_ROW_RE` · 不改判定/exit） |

---

## 背景与目标

3.0.0 验收报告 §6.2 **P2-4** / §5.6：双语 README「最小骨架」闸表为 **3 列**，而 `GATE_ROW_RE` 要求 **4 个单元格** ⇒ 照抄骨架后闸表**静默解析为空**；即使把 `HG-AUDIT-R1` 写成 `approved`，仍 `may_start_30=false`，且理由误导为「非 approved」而非「表未被识别」。随包 `TASK_TEMPLATE.md` 已是正确 4 列；属**文档与实现长期不一致**（非 3.0.0 回归 · fail-closed）。

PLAN 起草期另捕获**独立子形态**：id 捕获组 `([^*|]+?)` **排除 `*`** ⇒ id 单元格**内嵌**粗体 `**` 时整行 MISSED（外层整格包裹 `**HG-…**` 仍可 PARSED）。

**完成态**：① 两份 README 骨架改为 4 列并提示；② `parseHumanGates` 在「有 `### 人工闸` 节但 0 行」时显式告警（stderr / `--json` 的 `warnings` · **exit 语义不变**）；③ 文档注明 id 禁内嵌粗体 + 告警文案并列提示 + 负向测；④ 回归锁固化 A/B 与样例入测；**不放宽** `GATE_ROW_RE`。

---

## 范围

严格对齐 PLAN **W2 节**（不得扩到 W3–W6 / release bump · 不得放宽正则）。

- [x] **① 文档：双语 README 最小骨架 3→4 列 + 提示**
  - `README.md:98` / `README.zh-CN.md:98`（表头现为 `| human_gate_id | status | blocks_hats |` · 样例行约 `:100`）补第 4 列 `说明`，表头对齐 `| human_gate_id | status | blocks_hats | 说明 |`
  - 与随包 `assets/harness/templates/TASK_TEMPLATE.md:41`（已是 4 列 ✅）一致
  - 两份 README 该处各加一行提示：闸表须 **4 列**（末列为 `说明`）；3 列会被静默忽略
  - 两份 README + `TASK_TEMPLATE.md` 骨架处注明：**id 单元格内不要用粗体**（内嵌 `**` 会导致整行解析失败）
- [x] **② 实现：`parseHumanGates` 空解析告警（硬约束 5）**
  - `src/cli-shared.ts:270-286`：`section` 存在但 `gates.length === 0` ⇒ 显式提示（建议含出现次数与「请确认是否为 4 列」；**并列提示 id 内嵌 `**` 子形态**）
  - **exit code 语义不变**（`check` 恒 0 / 阻断仍由 `evaluateMayStart30` 决定）
  - 告警走 **stderr**；`--json` 下入信封 **`warnings` 字段**（只增不改 · 不污染既有 JSON 消费方）
- [x] **③ id 内嵌 `**` 子形态：文档 + 告警 + 负向测**
  - 文档见①；告警文案见②；负向 fixture：4 列但 id 格含内嵌 `**` ⇒ 解析 miss + 告警存在
- [x] **④ 回归锁（硬约束 7）**
  - **3 列闸表 + `HG-AUDIT-R1=approved`** ⇒ 告警存在
  - **4 列同内容** ⇒ 无告警且 `may_start_30=true`
  - **3 列 + pending** 既有阻断行为不回退
  - **4 列但 id 单元格含内嵌 `**`** ⇒ 告警存在
  - README / README.zh-CN / TASK_TEMPLATE 骨架**逐字**喂解析器入测（修后 README 非空 · 模板 ≥1）
  - `docs/tasks/` 全量存量 task 解析结果**零变化**

## 非范围

| 项 | 理由 |
|----|------|
| **放宽 `GATE_ROW_RE`**（使第 4 列可选） | PLAN W2 非范围 · 报告「改实现」备选**不采纳**（掩盖文档漂移） |
| 改 `evaluateMayStart30` 判定 | PLAN W2 非范围 · 报告 §4.6 已证泛化正确 |
| 改 `extractSection` 节域口径 | PLAN W2 非范围 |
| W1 粘性表源 / W3 pins IO / W4 口径 / W5 钉版旗标 / W6 机检面 | 其他波次 · 本波不扩 |
| bump `package.json` → 3.0.1 / CHANGELOG 发版节 / tag / push / publish | release 波 · **仅人** |
| 触 host-adapt `schema_version` / schema 变更 | 硬约束 3/6 · **STOP 上报** |
| 改判定语义松紧方向 / 新增对外能力面 | 硬约束 3 · **STOP 上报** |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（HG-RELEASE 不在代签范围） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1 或 HG-W2-REVIEW=pending 即 30 改码（F-W2-00） | 30 **拒开工**（verify 机械拦 exit 2） | 是（评审文落盘 + 00 签后） | 是 |
| 放宽 `GATE_ROW_RE` / 使第 4 列可选（F-W2-01） | 掩盖文档漂移 · **打回**（PLAN 非范围） | 是 | 是 |
| 空解析告警打到 stdout 污染 `--json`（F-W2-02） | 破坏下游解析 · 须 stderr 或 `warnings` · 打回 | 是 | 是 |
| 告警改变 exit code / 阻断语义（F-W2-03） | 违反「exit 语义不变」· 打回 | 是 | 是 |
| README 改 4 列但样例未入测 / 仍解析空（F-W2-04） | 核心断言失败 · 打回 | 是 | 是 |
| id 内嵌 `**` 无告警无负向测（F-W2-05） | 子形态未封 · 打回 | 是 | 是 |
| 存量 `docs/tasks/` 解析结果漂移（F-W2-06） | 回归锁拦截 · 打回 | 是 | 是 |
| 告警文案触发 `check-terminology` 变体词红（F-W2-07） | 术语机检拦 · 改文案后再测 | 是 | 是 |
| 触 schema / 改判定松紧 / 新增能力面（F-W2-08） | **立即 STOP 上报** · 移出 3.0.1（硬约束 3） | — | 是 |
| 顺手开 W3+ / bump 3.0.1（F-W2-09） | 打回（每波一 task · 本波仅 W2） | — | — |
| 越权 tag/push/publish/deprecate（F-W2-10） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟域外档（F-W2-11） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| 四门任一红 / 负向 fixture 误绿（F-W2-12） | 停止 · 先修再关账 | 是 | 是 |

---

## 验收标准

- [x] **A1 文档骨架**：`README.md` 与 `README.zh-CN.md` 最小骨架闸表为 **4 列**（含 `说明`）+ 明示「须 4 列 / 3 列静默忽略」+ 「id 单元格内不要用粗体」；`TASK_TEMPLATE.md` 骨架仍 4 列且含 id 禁内嵌粗体提示（不回退）
- [x] **A2 空解析告警**：存在 `### 人工闸` 但解析 0 行 ⇒ stderr（或 `--json#warnings`）含可操作提示（4 列 + id 内嵌 `**` 并列）；**不改变**既有 exit / `may_start_30` 判定语义
- [x] **A3 A/B 回归**：3 列 + `HG-AUDIT-R1=approved` ⇒ 有告警；4 列同内容 ⇒ 无告警且 `may_start_30=true`；3 列 + pending 阻断不回退
- [x] **A4 子形态**：4 列但 id 内嵌 `**` ⇒ 该行 miss + 告警存在（有自动化负向测）
- [x] **A5 样例入测**：两份 README 与 `TASK_TEMPLATE.md` 骨架**逐字**喂 `parseHumanGates` ⇒ README 解析非空 · 模板解析数 ≥ 1
- [x] **A6 存量零变化**：`docs/tasks/`（active+done）全量解析结果与改前一致（或等价机检快照）
- [x] **A7 硬约束钉死**：未放宽 `GATE_ROW_RE`；未改 `evaluateMayStart30` / `extractSection`；未触 schema；未开 W3+
- [x] **A8 四门**：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib` 全绿（tag-gated 设计红留痕口径同前例）
- [x] **A9 关账**：`npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w2_gate_table_contract.md` → exit 0 + `task close --yes`；提交 `fix(3.0.1-W2): …` · 禁 `git add -A` · 未执行 tag/push/publish

---

## 给执行帽的必读列表

1. [`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md) — W2 节全文 · 硬约束 3/5 · 人工闸 HG-W2-REVIEW · 风险 3/7
2. [`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) §5.6 + §6.2 P2-4（含 id 内嵌 `**` 子形态）
3. `README.md:98` · `README.zh-CN.md:98`（最小骨架 · 现 3 列）
4. `assets/harness/templates/TASK_TEMPLATE.md:41`（正确 4 列对照）
5. `src/cli-shared.ts:25-26`（`GATE_ROW_RE` · **本波不放宽**）· `:270-286`（`parseHumanGates` · 告警挂点）
6. 先例 [`docs/tasks/done/task_3_0_1_w1_sticky_table_source.md`](../done/task_3_0_1_w1_sticky_table_source.md)（同系列元信息 / 闸表 4 列 / 无 SPEC）
7. `docs/standards/` 涉码 L2（30 自裁引用）

---

## 思考轮

### R0 · 证据

PLAN_3_0_1 已 HG-NEXT-PLAN=approved；W1 CLOSE: PASS；范围主源 §5.6/§6.2 P2-4 与 PLAN W2 子形态明确。本棒实读：`README.md:98` / `README.zh-CN.md:98` 仍为 3 列表头；`TASK_TEMPLATE.md:41` 已 4 列；`GATE_ROW_RE` `:25-26`；`parseHumanGates` `:270-286` 空解析**无告警**。硬约束 3/5 与「不放宽正则」钉死边界。本波启用 HG-W2-REVIEW（告警契约 + 样例入测）。

### R1 · 范围

仅 W2：README 4 列+提示 · 空解析告警（stderr/`warnings` · exit 不变）· id 内嵌 `**` 文档+告警+负向测 · 回归锁与样例入测；显式排除放宽 `GATE_ROW_RE`、改判定、W3–W6、release bump。

### R2 · 方案

采纳 PLAN：文档修骨架（推荐路径）+ 空解析告警（防未来漂移）+ **不**放宽正则；告警通道 stderr / `--json#warnings` 防污染；子形态与 3 列并列提示。

### R3 · 边界

S2 只新增；禁触 schema；禁改 exit/判定松紧；发布四动作仅人；HG-W2-REVIEW 须评审文落盘后 00 代签；发现需触纪律门三项 ⇒ STOP。

### R4 · 可测性

A/B（3 列告警 / 4 列无告警）· id 内嵌负向 · README/模板逐字入测 · 存量零变化 · 四门；红测先行防误绿。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核；HG-TASK-DRAFT / HG-AUDIT-R1 / HG-W2-REVIEW 待评审文与 00 代签。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | P2-4 证据与 file:line 再钉齐 · HG-W2-REVIEW 启用 | no |
| R1 | 仅 W2 · 禁放宽正则 · 排除 W3+ | no |
| R2 | 文档+告警+样例入测 · stderr/warnings | no |
| R3 | 硬约束 3/5 · 条件闸须评审文 | no |
| R4 | A/B/子形态/样例/存量可机检 | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① 告警污染 `--json`（F-W2-02 · stderr/`warnings` 兜底）；② 术语机检命中告警文案（F-W2-07）；③ README 骨架改后样例入测漏断言（F-W2-04）；④ 条件闸与 HG-AUDIT-R1 双闸遗漏其一即 30 拒开工。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 先写可失败测试再改实现：① 3 列 approved ⇒ 有告警；② 4 列同内容 ⇒ 无告警 + may_start；③ id 内嵌 `**` 负向；④ README/模板逐字入测；⑤ 存量解析快照零变化。波末四门 + gate-check。

---

## 提交信息约定

- 实现提交：`fix(3.0.1-W2): …`（闸表 4 列文档 + 空解析告警）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟** `.workbuddy/` 未跟踪档 · 不裹挟 W3+ 草稿
- **禁 tag / push / publish / deprecate（仅人）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w2_gate_table_contract.md`

---

### 自检结论（执行者）

**帽**：30 实现 + 40 自证（同棒）· **日期**：2026-09-18 · **未发版 · 未 git commit**（留给 00/维护者）

#### GATE_VERIFY

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_1_w2_gate_table_contract.md
| HG-TASK-DRAFT | approved | … |
| HG-AUDIT-R1 | approved | ✅ 可 30 |
| HG-W2-REVIEW | approved | ✅ 可 30 |
VERIFY: PASS
```

#### 实现要点

- README / README.zh-CN 最小骨架 3→4 列 + 4 列/id 禁内嵌粗体提示；`TASK_TEMPLATE.md` 同注
- `parseHumanGates`：节存在但 0 行 → `EMPTY_GATE_TABLE_WARNING`（可选 `warnings` sink）；`gate-check`/`verify`：stderr + `--json#warnings` 只增
- **未**放宽 `GATE_ROW_RE` · **未**改 `evaluateMayStart30` / exit
- 红测：`test/w2-gate-table-contract.test.ts`（10 例）

#### A1–A7（机检）

```text
$ node --test test/w2-gate-table-contract.test.ts
ℹ tests 10 · pass 10 · fail 0
```

#### A8 四门

```text
$ npm run typecheck   # exit 0
$ npm test            # 881 pass · 0 fail · 1 skip
$ npm run build       # exit 0
$ npm run test:lib    # 6 pass · 0 fail
```

#### A9 / 禁区

- `gate-check` exit 0 · `task close --yes`：见下（本棒执行）
- **未** `git commit` / tag / push / publish / deprecate；**未** `git add -A`（逐文件显式 add）；**未** bump `package.json`→3.0.1；**未**触 schema
- 建议维护者提交：`fix(3.0.1-W2): gate table 4-col docs + empty-parse warnings`

#### invoke

`docs/harness/invokes/by-task/3-0-1-w2-gate-table-contract/invoke_20260918_30_40_3-0-1-w2-gate-table-contract.md`

Wiki: none（修复性 patch · 无规范增量）

### 经验总结（执行者）

- P2-4 根因是文档 3 列与 `GATE_ROW_RE` 4 列不一致；修文档 + 空解析可见告警，**不**放宽正则以免掩盖漂移。
- 告警契约：人读 stderr、机读 `--json#warnings` 只增；勿污染 stdout 主载荷。
- check-doc-links S2：未入库互相链接抬高计数；关账前过程档须逐文件 `git add`（禁 `git add -A`）。

### KPI（30/40）

Task_KPI%: 95（范围①–④与 A1–A8 全绿 · 红测 10/10 · C1–C8 遵契约评审 · 四门绿 · 零 schema/bump/发版越权 · 未 git commit 留给维护者）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同棒闭环

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 初稿 · 10-task（PLAN W2 / §5.6+§6.2 P2-4）· 状态 draft · HG-TASK-DRAFT/HG-AUDIT-R1/HG-W2-REVIEW=pending · HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=N/A · 行号再钉 README.md:98 · README.zh-CN.md:98 · TASK_TEMPLATE.md:41 · cli-shared.ts:25-26/:270-286 · 闸表 4 列且 id 单元格无内嵌粗体 · 启用条件闸 HG-W2-REVIEW |
| 2026-09-18 | **00 代签三闸**：HG-TASK-DRAFT + HG-AUDIT-R1 + HG-W2-REVIEW → approved · R1 PASS · 契约评审 C1–C8 带入 30 |
| 2026-09-18 | **30/40**：README/模板 4 列+提示 · 空解析告警 · 红测 10/10 · 四门绿 · 自检回填 · 未 commit/发版 |
