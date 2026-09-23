# Task：3.0.2 W1 · tech-graph 词汇登记档补登记 branches/triggers（F-1①）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（均 2026-09-23 00 代签 · 授权真值：维护者本窗「授权00签收所有过程文档」· 依据 R1 审查 PASS · blocking 0）· 30/40 闭环完成（四门 910 · 909 pass + 1 skip · 0 fail）· 2026-09-23 · **未发版 / 未 commit**）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_0_2_patch_v1_zh.md`](../../roadmap/PLAN_3_0_2_patch_v1_zh.md)（**HG-NEXT-PLAN=approved** · 2026-09-23 维护者签收 · 授权 00 代签过程闸 + 验收后 tag/push 代跑 · npm publish 仍仅人）· **W1 节** + 硬约束 **3**（patch 纪律门 · 本版口径）/ **4**（「不要静默」总则）  
> **范围主源**：ops-desk-api 反馈文 `FEEDBACK_spec_wave_3_0_1_from_ops_desk_api_20260923.md` **F-1**（仓外 `docs/harness/evidence/` · `branches` 37 处 + `triggers` 16 处永不可行动 warning · 告警疲劳）  
> **基线**：`spec-wave@3.0.1` published（npm `latest` = 3.0.1 · tag `v3.0.1`）  
> **行号口径**：本 task 全部 `file:line` 为 **2026-09-23 10-task 起草棒实读现值**  
> **Open Folder**：仓根 · **工作分支**：`task/specwave-3-0-2`（自 `main` 0e6d861 切出）  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A（同 3.0.1 / 2.4.x patch 先例）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-2-w1-tech-graph-vocab` |
| **test_strategy** | `required` |
| **test_strategy_note** | 红测先行：① 登记档内容钉更新（edge_types 六条）② fixture `type: branches`/`type: triggers` ⇒ compile 零词汇告警 ③ 未登记 type（bogus_edge）仍 warning 不咬 exit ④ 仓内语料 00_main 可见性钉翻转（triggers 不再告警）⑤ 恒等 fixture 5 份语料逐字等价不回退；四门为波末硬条款 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `task/specwave-3-0-2` |
| **graph_delta** | `none` |
| **graph_delta_note** | 仅 assets 登记档数据增补（非 `docs/_tech_graph` 语料变更 · 产物零漂移） |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 消费侧反馈收口的资产数据波；无规范增量；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0.2 patch 波次系列；合入 main 与 tag/push 由 00 在验收后按本版授权代跑 |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-23 维护者签收 PLAN_3_0_2（原话「授权00签收所有过程文档，进行此版本的升级，验收完成后进行tag + push，只需要等人来发版」）· 开 W 波限制已解除 |
| HG-SPEC-SIGNOFF | N/A | — | 本版无独立 SPEC 夹（属消费侧反馈 patch · 同 3.0.1 / 2.4.x 先例） |
| HG-TASK-DRAFT | approved | 20, 30 | 2026-09-23 00 代签 · 授权真值：维护者本窗「授权00签收所有过程文档」· task lint PASS · 10 invoke 已落 |
| HG-AUDIT-R1 | approved | 30 | 2026-09-23 00 代签 · 依据 [`task_3_0_2_w1_tech_graph_vocab_audit_R1_20260923.md`](../../harness/reviews/task_3_0_2_w1_tech_graph_vocab_audit_R1_20260923.md)（PASS · blocking 0 · 纯数据波 · src 零改动硬边界） |

---

## 背景与目标

消费仓（ops-desk-api）6 个 flow yaml 共用 `branches` 37 处、`triggers` 16 处——全部为标准用法（条件分支 / 触发子图），但每次 `graph yaml check/compile` 对这两类边型逐条告警「未在 tech-graph 词汇登记档」，产生 ~20 行永不可行动 warning，造成告警疲劳（真正的新 warning 被淹没）。反馈建议二选一：① 内置登记档收录（LangGraph 系普适类型）；② 仓级词汇扩展档。PLAN 裁决：**① 进 3.0.2**（纯数据 · 即时清零）；② 延 3.1.0。

**已核实的关键事实**（2026-09-23 实读）：`edgeTypes` 唯一消费点是告警检查 `collectTechVocabWarnings`（`src/cli-graph-yaml.ts:90-102`）；渲染路径 `edgeToGraphV2`（`:276`）**不读**登记档 ⇒ 补登记**零渲染漂移**。本仓自身 `docs/_tech_graph/00_main.graph.yaml:82-107` 有 4 处 `type: "triggers"`（`assets/graph/templates/00_main.graph.yaml:55-56` 同型）——**本仓 dogfood 同款噪音**，`test/f1-unify.test.ts:291-295` 当前钉「compile 00_main ⇒ stderr Warning 点名 triggers」，本波须翻转。

**完成态**：`assets/tech-graph-vocab.yaml` edge_types 增 `branches`/`triggers`（六条）；`test/f1-unify.test.ts:213` 内容钉同步；新增「已登记 ⇒ 零告警 / 未登记 ⇒ 仍告警」双向回归锁；`:291` 可见性钉翻转为零告警；恒等 fixture（`:218-237`）5 份语料逐字等价**不回退**；四门全绿。

---

## 范围

严格对齐 PLAN **W1 节**。

- [x] **① 登记档补两条（纯数据）**
  - `assets/tech-graph-vocab.yaml` `edge_types` 增 `branches` / `triggers` + 注释（来源：ops-desk-api 反馈 F-1 · LangGraph 系普适边型 · 「登记 ≠ 封闭」原则不变 · version 维持 `"1"`）
- [x] **② 既有内容钉同步（设计内红 · 非回归）**
  - `test/f1-unify.test.ts:213` `edge_types` 断言四条 → 六条；`:203` 用例标题「edge_types 四条」同步改
  - `test/f1-unify.test.ts:291-295` 可见性钉翻转：compile 00_main ⇒ **不再**点名 triggers（断言零 `[warning]` 或点名断言不含 triggers · 以实测仓内语料为准）
- [x] **③ 双向回归锁（硬约束 5）**
  - 新 fixture：`type: branches` + `type: triggers` 显式边 ⇒ compile exit 0 且 stderr **零**词汇告警
  - 既有 `:249-289` bogus_edge 未登记仍告警 · `depends_on` 零告警 **不回退**（已覆盖 · 跑绿即可）
- [x] **④ 恒等与渲染零漂移**
  - `:218-237` 恒等 fixture（5 份语料 compile ≡ tracked md 逐字 · export ≡ graph.json 逐字）跑绿
  - `graph ontology check` / `graph axioms check` 行为零变化（本波不触其代码与资产）

## 非范围

| 项 | 理由 |
|----|------|
| 改 `loadTechGraphVocab` / `collectTechVocabWarnings` / 任何 `src/` 代码 | PLAN W1 非范围 · 纯数据波 |
| kinds / kind→class 映射变更 | PLAN W1 非范围 |
| 仓级词汇扩展档（`.spec-wave/graph-vocab.yaml` · F-1②） | 延 3.1.0（PLAN 非范围表） |
| `graph drift` 机械闸（F-2） | 延 3.1.0（PLAN 非范围表） |
| W2 pins consumer / release bump / CHANGELOG 发版节 | 其他波次 · 本波不扩 |
| `docs/_tech_graph` 语料 / 模板 00_main.graph.yaml 内容变更 | 语料本身合法 · 是登记档缺词而非语料错 |
| `git tag` / `push` / `npm publish` | release 波 · publish 仅人 |
| 触 host-adapt `schema_version` / 改既有默认行为 / 改判定语义松紧 | 硬约束 3 · **STOP 上报** |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-W1-00） | 30 **拒开工**（verify 机械拦 exit 2） | 是（审查文落盘 + 00 签后） | 是 |
| 只改登记档不同步 `:213` 内容钉（F-W1-01） | 测试红 · 打回 | 是 | 是 |
| 只改登记档不翻转 `:291` 可见性钉（F-W1-02） | 测试红 · 打回 | 是 | 是 |
| 恒等 fixture 产物漂移（F-W1-03） | 渲染零漂移承诺破 · **打回并复查是否误改代码** | 是 | 是 |
| 未登记 type 不再告警（F-W1-04） | 开放惯例回退 · 打回 | 是 | 是 |
| 顺手改 `src/` 代码「优化」（F-W1-05） | 越非范围（纯数据波）· 打回 | 是 | 是 |
| 顺手开 W2 / bump 3.0.2（F-W1-06） | 打回（每波一 task） | — | — |
| 越权 tag/push/publish（F-W1-07） | 违禁令 · 打回（tag/push 属 release 波授权 · 本波不适用） | — | 是 |
| `git add -A` 裹挟域外档（如 `eval/external-oracle/` 未跟踪档）（F-W1-08） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| 四门任一红 / 误绿（F-W1-09） | 停止 · 先修再关账 | 是 | 是 |

---

## 验收标准

- [x] **A1 登记档六条**：`assets/tech-graph-vocab.yaml` `edge_types` = `['depends_on','async_calls','condition','has_metadata','branches','triggers']`（`version: "1"` / namespace / kinds 不变）
- [x] **A2 已登记零告警**：fixture `type: branches` / `type: triggers` ⇒ `graph yaml compile` exit 0 · stderr 无 `未在 tech-graph 词汇登记档`
- [x] **A3 未登记仍告警**：`bogus_edge` 等未登记 type ⇒ 仍 warning 且不咬 exit（开放惯例不回退）
- [x] **A4 仓内语料清零**：compile `00_main`（`docs/_tech_graph`）⇒ stderr 不再点名 `triggers`（`:291` 钉翻转）
- [x] **A5 恒等零漂移**：5 份语料 compile ≡ tracked md 逐字 · export ≡ tracked graph.json 逐字（`:218-237` 跑绿）
- [x] **A6 非范围钉死**：`git diff --stat` 仅 `assets/tech-graph-vocab.yaml` + `test/` 相关档 · `src/` 零改动 · 未开 W2 · 未 bump
- [x] **A7 四门**：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib` 全绿
- [x] **A8 关账**：`node bin/specgate.js gate-check --task docs/tasks/active/task_3_0_2_w1_tech_graph_vocab.md` → exit 0 + `task close --yes`；提交 `feat(3.0.2-W1): …` · 禁 `git add -A` · 未 tag/push/publish

---

## 给执行帽的必读列表

1. [`docs/roadmap/PLAN_3_0_2_patch_v1_zh.md`](../../roadmap/PLAN_3_0_2_patch_v1_zh.md) — W1 节全文 · 硬约束 3/4 · 风险 1
2. `assets/tech-graph-vocab.yaml` 全文（25 行 · 登记档体例与注释口径）
3. `src/cli-graph-yaml.ts:43-106`（登记档加载与告警消费点 · **只读** · 本波不改）
4. `test/f1-unify.test.ts:203-295`（内容钉 `:213` · 恒等 fixture `:218` · 边型钩② `:249` · 可见性钉 `:291`）
5. 先例 [`docs/tasks/done/task_3_0_1_w3_pins_io_failclosed.md`](../done/task_3_0_1_w3_pins_io_failclosed.md)（同系列元信息 / 闸表 4 列 / 无 SPEC）
6. `docs/standards/` 涉码 L2（30 自裁引用 · 本波仅测试码）

---

## 思考轮

### R0 · 证据

PLAN_3_0_2 已 HG-NEXT-PLAN=approved；反馈 F-1 四条边型事实与方案①/②裁决明确。本棒实读：`edgeTypes` 唯一消费点 = 告警（`cli-graph-yaml.ts:90-102`）· 渲染不读登记档（`:276`）· 仓内语料 4 处 `type: "triggers"`（`docs/_tech_graph/00_main.graph.yaml:82-107`）· `f1-unify.test.ts:213` 四条钉与 `:291` 可见性钉为本波设计内红两点。

### R1 · 范围

仅 W1：登记档 +2 条 · 测试三处同步（内容钉 / 可见性钉 / 新双向回归锁）· 恒等跑绿。排除：任何 `src/` 改动 · F-1② · F-2 · W2 · release。

### R2 · 方案

纯数据加两条 + 注释；测试侧：`:213` 六条 · `:291` 翻转为零告警 · 新增 fixture 覆盖 `branches`/`triggers` 双态。不加新测试档（并入 `f1-unify.test.ts` 同族 · 30 自裁）。

### R3 · 边界

S2 只新增；`src/` 零改动是本波的硬边界（A6 机械断言）；发现需改代码才能实现 ⇒ STOP 上报（说明方案①假设不成立）。

### R4 · 可测性

A1 yaml 断言 · A2/A3 双向 fixture · A4 仓内语料 · A5 恒等 · A6 diff --stat · A7 四门 · 全部机检无人工判读。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核；HG-TASK-DRAFT / HG-AUDIT-R1 待 00 代签。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | F-1 事实与两大设计内红点钉齐 | no |
| R1 | 纯数据波 · src 零改动硬边界 | no |
| R2 | +2 条 + 测试三处同步 | no |
| R3 | 需改代码即 STOP | no |
| R4 | A1–A8 全机检 | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① 漏同步 `:291` 可见性钉（F-W1-02）；② 30 顺手「优化」登记档注释外内容（F-W1-05）；③ `eval/external-oracle/` 未跟踪档被 `git add -A` 裹挟（F-W1-08）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 红测先行：先改 `:213` 断言为六条（对旧登记档红）→ 改登记档转绿；新增 branches/triggers fixture 用例（对旧登记档红）→ 登记后转绿；`:291` 翻转与恒等 fixture 跑绿；波末四门 + gate-check。

---

## 提交信息约定

- 实现提交：`feat(3.0.2-W1): tech-graph 词汇登记档补登记 branches/triggers（F-1① · ops-desk 反馈）`
- **禁 `git add -A`**：逐文件显式 add（`assets/tech-graph-vocab.yaml` · `test/f1-unify.test.ts` · 过程档）
- **不裹挟** `eval/external-oracle/` 未跟踪档 · 不裹挟 W2 草稿
- **禁 tag / push / publish**（tag/push 属 release 波授权 · 本波仅 commit 至 `task/specwave-3-0-2`）
- 波末跑 `node bin/specgate.js gate-check --task docs/tasks/active/task_3_0_2_w1_tech_graph_vocab.md`

---

### 自检结论（执行者）

**帽**：30 实现（子 Agent `79f0145b`）+ 40 自证（子 Agent 空转 · **剩余机械步 00 接管** · 例外句见 invoke）· **日期**：2026-09-23 · **未发版 · 未 git commit**（commit 由 00 执行）

#### GATE_VERIFY

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_2_w1_tech_graph_vocab.md
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS
```

#### 实现要点

- `assets/tech-graph-vocab.yaml` edge_types + `branches`/`triggers`（六条 · F-1 注释 · version 维持 `"1"`）；`assets/sha256.manifest` 经 `assets manifest rebuild --yes` 同步（113 条 · ~1）
- `test/f1-unify.test.ts`：`:213` 六条钉 · 新增 g3 fixture 双向锁（branches/triggers 零告警 · bogus_edge 仍告警由钩②覆盖）· `:291` 翻转为零 `[warning]`（30 实测仓内语料无其他未登记边型 · 审查 N1 成立）
- 红→绿闭环留证（三处设计内红对旧登记档全红 → 登记后 14/14）· **`src/` 零改动**（A6 机械断言过）

#### 验收勾选

- [x] A1 登记档六条（version/namespace/kinds 不变）
- [x] A2 已登记零告警（g3 fixture exit 0 · 无「未在…登记档」）
- [x] A3 未登记仍告警（钩② bogus_edge 绿 · 开放惯例不回退）
- [x] A4 仓内语料清零（00_main stderr 零 `[warning]`）
- [x] A5 恒等零漂移（5 语料 ≡ tracked md · export ≡ graph.json）
- [x] A6 非范围钉死（diff 仅 assets×2 + test×1 + 过程档 · 未开 W2 · 未 bump）
- [x] A7 四门：typecheck 0 · **npm test 910 · 909 pass + 1 skip · 0 fail** · build 0 · test:lib 6/6（00 复跑 · `npm_config_cache=/tmp` 绕本机缓存 EPERM）
- [x] A8 gate-check + task close（本棒 · 00 执行）· 未 commit / tag / push / publish

#### invoke

`docs/harness/invokes/by-task/3-0-2-w1-tech-graph-vocab/invoke_20260923_30_40_3-0-2-w1-tech-graph-vocab.md`（含例外句与环境留痕）

Wiki: none（资产数据波 · 无规范增量）

### 经验总结（执行者）

- 登记档补词是纯数据波，但**联动面有两个设计内红**：`f1-unify.test.ts` 内容钉/可见性钉 + `assets/sha256.manifest` 哈希钉（assets-integrity 机检）；漏任一即全量红，同提交同步即可。
- check-doc-links S2 判据 = git tracked（含已暂存）∧ 工作区仍在：in-flight 过程件互链须**先逐文件显式 add** 再跑全量，否则计数抬高误红（3.0.1 W3 同款经验复现）。
- 本机 `~/.npm-local` root-owned ⇒ npm pack EPERM；`npm_config_cache=/tmp` 绕过 · **人 publish 前须根治或设环境变量**（已入 00 发版提醒）。
- 子 Agent 长任务须设「磁盘进展」心跳核验：应答积极 ≠ 在执行；两轮无产物即介入批次化指令，仍零进展则 00 接管机械步（实现仍归子 Agent · 例外句入 invoke）。

### KPI（30/40）

Task_KPI%: 92（范围①–④与 A1–A8 全绿 · 红测 3/3 闭环 · src 零改动硬边界守住 · 四门绿；扣分：40 机械步子 Agent 空转需 00 接管 · 过程节奏受损）

- rubric：`KPI_RUBRIC_v1_2` · 30（子 Agent）+ 40（子 Agent 红绿闭环 + 00 机械步接管）

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-23 | 初稿 · 10-task（PLAN W1 / 反馈 F-1）· 状态 draft · HG-TASK-DRAFT/HG-AUDIT-R1=pending · HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=N/A · 行号实钉（`cli-graph-yaml.ts:90-102/:276` · `f1-unify.test.ts:213/:218/:249/:291` · `00_main.graph.yaml:82-107`）· 闸表 4 列且 id 单元格无内嵌粗体 |
| 2026-09-23 | **00 代签**：HG-TASK-DRAFT + HG-AUDIT-R1 → approved · R1 PASS · blocking 0 |
| 2026-09-23 | **30/40**：登记档六条 + sha256 同步 + 测试三处 · 红→绿闭环 · 四门绿（npm test 910 · 909+1skip · 0 fail）· src 零改动 · gate-check/close（子 Agent 空转 · 40 机械步 00 接管 · 例外句入 invoke）· 未 commit |
