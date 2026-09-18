# Task：3.0.1 W3 · 校验 IO 统一 fail-closed（P3-8）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（**2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· 依据 [`task_3_0_1_w3_pins_io_failclosed_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_w3_pins_io_failclosed_audit_R1_20260918.md) PASS · blocking 0）· 30/40 闭环完成 · 2026-09-18 · **未发版 / 未 commit**）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（**HG-NEXT-PLAN=approved** · 2026-09-18 维护者签收 · 授权 00 代签过程闸 · HG-RELEASE / tag / push / publish 仍仅人）· **W3 节** + 硬约束 **3**（patch 纪律门）/ **5**（「不要静默」总则）  
> **范围主源**：[`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) **§6.3 P3-8**（`readTruthVersion` 无 try/catch ⇒ 坏 `package.json` 得崩溃级 exit 1；同模块 `loadPins` 为干净 exit 2 + `PINS: BLOCKED`）  
> **基线**：`spec-wave@3.0.0` published（npm `latest` = 3.0.0 · tag `v3.0.0`）· 前序波次 W1 / W2 均已 CLOSE: PASS  
> **行号口径**：本 task 全部 `file:line` 为 **2026-09-18 10-task 起草棒实读现值**（PLAN 行号可能漂移 · 已再钉）  
> **Open Folder**：仓根  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A（同 2.4.x / W1 / W2 patch 先例）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-1-w3-pins-io-failclosed` |
| **test_strategy** | `required` |
| **test_strategy_note** | 红测先行：① 截断 JSON `package.json` ⇒ exit 2 + `PINS: BLOCKED` 前缀（A1）② `chmod 000` ⇒ exit 2 + 同前缀（A3）③ 残留 git 冲突标记 ⇒ exit 2 + 同前缀（A4）④ 坏 `pins.yaml` / 声明源 ⇒ exit 2 不回退（A2 对称）⑤ 文件不存在仍走原分支文案「真值源缺失」⑥ `pins check` 基线 PASS / rc=0 不变；四门为波末硬条款 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | patch 级单点 IO 分类码对齐；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 修复性 patch（同类 IO 退出码统一 fail-closed）；无规范增量；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0.1 patch 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-18 维护者签收 PLAN_3_0_1（原文意图：「身为00，统筹3.0.1的升级，授权签收过程文档」）· 开 W 波限制已解除 |
| HG-SPEC-SIGNOFF | N/A | — | 本版无独立 SPEC 夹（属 3.0.0 验收后 patch · 同 2.4.1/2.4.2 / W1 / W2 先例） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· task lint PASS · 10/20 invoke 已落 |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-18 00 代签** · 依据 [`task_3_0_1_w3_pins_io_failclosed_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_w3_pins_io_failclosed_audit_R1_20260918.md)（PASS · blocking 0 · 缺文件原分支保留 · 三负向→exit2+`PINS: BLOCKED`） |

---

## 背景与目标

3.0.0 验收报告 §6.3 **P3-8**：同一模块 `src/cli-pins.ts` 内，`loadPins`（声明源 YAML）有 `try/catch` ⇒ 坏文件得干净 **exit 2** + **`PINS: BLOCKED`** 前缀；而 `readTruthVersion`（真值源 `package.json`）的 `JSON.parse(readFileSync(...))` **未包裹** ⇒ 截断 JSON / 不可读 / 残留冲突标记时得 **exit 1**（崩溃类信封），**无**统一前缀。属「信封统一、分类码不统一」——消费方惯以 exit 2=门禁、exit 1=工具崩，归因易错位。

**完成态**：`readTruthVersion` 解析/读取包 `try/catch`，与 `loadPins` 同形态统一为 **exit 2 + `PINS: BLOCKED` 前缀**；收敛 `existsSync` 与读取之间的 TOCTOU；三负向回归锁固化；**保留「文件不存在」原分支独立文案**；不改 `pins check` PASS 语义 / `pins fix` / 其他 exit 档位。

---

## 范围

严格对齐 PLAN **W3 节**（不得扩到 W4–W6 / release bump · 不得引入通用 IO 包装框架）。

- [x] **① `readTruthVersion` 包 try/catch → fail-closed exit 2**
  - `src/cli-pins.ts`：`readFileSync` + `JSON.parse` 均包 try/catch → `fail(..., 2)` + `PINS: BLOCKED`（对齐 `loadPins`）
- [x] **② 收敛 TOCTOU**
  - 先读再判 ENOENT → 保留「真值源缺失」原文案；存在但不可读/不可解析走统一 catch 文案
- [x] **③ 三负向回归锁（硬约束 7）**
  - **截断 JSON** / **`chmod 000`** / **冲突标记** ⇒ 均 exit **2** + `PINS: BLOCKED`
- [x] **④ 对称与基线不回退**
  - 坏 `pins.yaml` ⇒ 仍 exit 2 + `PINS: BLOCKED`；完好仓 `pins check` rc=0
## 非范围

| 项 | 理由 |
|----|------|
| 改 `pins check` 判定语义与 PASS 输出 | PLAN W3 非范围 |
| 改 `pins fix` 行为 | PLAN W3 非范围 |
| 改其他命令的 exit code 档位 | PLAN W3 非范围 |
| 引入通用「IO 包装」框架 | PLAN W3 非范围 · **单点收口即可** |
| 把「文件不存在」并入新分支并改文案 | PLAN W3 风险 · 会改变现有缺文件退出码/文案 |
| W1 粘性表源 / W2 闸表 / W4 口径 / W5 钉版旗标 / W6 机检面 | 其他波次 · 本波不扩 |
| bump `package.json` → 3.0.1 / CHANGELOG 发版节 / tag / push / publish | release 波 · **仅人** |
| 触 host-adapt `schema_version` / schema 变更 | 硬约束 3/6 · **STOP 上报** |
| 改判定语义松紧方向 / 新增对外能力面 | 硬约束 3 · **STOP 上报** |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（HG-RELEASE 不在代签范围） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-W3-00） | 30 **拒开工**（verify 机械拦 exit 2） | 是（审查文落盘 + 00 签后） | 是 |
| 坏 `package.json` 仍 exit 1 / 无 `PINS: BLOCKED` 前缀（F-W3-01） | P3-8 未收口 · 打回 | 是 | 是 |
| 「文件不存在」文案/档位被并入新分支改掉（F-W3-02） | 违反 PLAN 风险钉死 · 打回 | 是 | 是 |
| 三负向任一仍 exit 1 或前缀缺失（F-W3-03） | 回归锁拦截 · 打回 | 是 | 是 |
| A2（坏声明源）对称行为回退（F-W3-04） | 打回 | 是 | 是 |
| `pins check` 基线 PASS / rc=0 漂移（F-W3-05） | 打回 | 是 | 是 |
| 改 `pins fix` / 其他命令 exit 档位（F-W3-06） | 越非范围 · 打回 | 是 | 是 |
| 引入通用 IO 包装框架（F-W3-07） | 越非范围 · 打回 | 是 | 是 |
| 触 schema / 改判定松紧 / 新增能力面（F-W3-08） | **立即 STOP 上报** · 移出 3.0.1（硬约束 3） | — | 是 |
| 顺手开 W4+ / bump 3.0.1（F-W3-09） | 打回（每波一 task · 本波仅 W3） | — | — |
| 越权 tag/push/publish/deprecate（F-W3-10） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟域外档（F-W3-11） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| 四门任一红 / 负向 fixture 误绿（F-W3-12） | 停止 · 先修再关账 | 是 | 是 |

---

## 验收标准

- [x] **A1 截断 JSON**：报告 §6.3 P3-8 A1 复现路径 ⇒ **exit 2** 且输出含 `PINS: BLOCKED` 前缀（不再 exit 1）
- [x] **A2 对称不回退**：坏声明源 / 坏 `pins.yaml`（报告 A2）⇒ 仍 exit 2 + `PINS: BLOCKED`
- [x] **A3 chmod 000**：`package.json` 不可读 ⇒ exit 2 + `PINS: BLOCKED` 前缀
- [x] **A4 冲突标记**：`package.json` 含 `<<<<<<< HEAD` 等残留 ⇒ exit 2 + `PINS: BLOCKED` 前缀
- [x] **A5 缺文件文案保留**：`package.json` 不存在 ⇒ 仍走原分支文案（含「真值源缺失」）· exit 2 · **不得**被新 catch 文案替换
- [x] **A6 基线 PASS**：完好仓 `pins check` rc=0 · PASS 输出语义与改前一致
- [x] **A7 非范围钉死**：未改 `pins fix`；未改其他命令 exit 档位；未引入通用 IO 包装；未触 schema；未开 W4+
- [x] **A8 四门**：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib` 全绿（tag-gated 设计红留痕口径同前例）
- [x] **A9 关账**：`npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w3_pins_io_failclosed.md` → exit 0 + `task close --yes`；提交 `fix(3.0.1-W3): …` · 禁 `git add -A` · 未执行 tag/push/publish
---

## 给执行帽的必读列表

1. [`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md) — W3 节全文 · 硬约束 3/5 · 风险 6/7
2. [`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) §6.3 P3-8（含 A1–A4 对照表）
3. `src/cli-pins.ts:62-83`（`loadPins` · 对齐形态）· `:85-91`（`readTruthVersion` · 本波挂点 · `:87` existsSync · `:88` 裸 parse）
4. 先例 [`docs/tasks/done/task_3_0_1_w2_gate_table_contract.md`](../done/task_3_0_1_w2_gate_table_contract.md)（同系列元信息 / 闸表 4 列 / 无 SPEC）
5. `docs/standards/` 涉码 L2（30 自裁引用）

---

## 思考轮

### R0 · 证据

PLAN_3_0_1 已 HG-NEXT-PLAN=approved；W1/W2 CLOSE: PASS；范围主源 §6.3 P3-8 与 PLAN W3 明确。本棒实读：`loadPins` `:62-83` 有 try/catch → exit 2 + `PINS: BLOCKED`；`readTruthVersion` `:85-91` 中 `:88` 裸 `JSON.parse(readFileSync(...))` 无 try/catch；`:87` 缺文件已为 exit 2 独立文案。硬约束 3/5 钉死边界。

### R1 · 范围

仅 W3：`readTruthVersion` try/catch → exit 2 + 统一前缀 · TOCTOU 收敛 · 三负向（截断 / chmod 000 / 冲突标记）· 保留缺文件原文案；显式排除改 PASS/`pins fix`/其他 exit、通用 IO 框架、W4–W6、release bump。

### R2 · 方案

采纳 PLAN：单点包 try/catch，文案对齐 `loadPins` 前缀族；缺文件分支保留；三负向固化进测试套件（硬约束 7）。

### R3 · 边界

S2 只新增；禁触 schema；禁改判定松紧/能力面；发布四动作仅人；发现需触纪律门三项 ⇒ STOP。

### R4 · 可测性

A1/A3/A4 负向 · A2 对称 · A5 缺文件文案 · A6 基线 PASS · 四门；红测先行防误绿。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核；HG-TASK-DRAFT / HG-AUDIT-R1 待评审文与 00 代签。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | P3-8 证据与 file:line 再钉齐 | no |
| R1 | 仅 W3 · 保留缺文件文案 · 排除 W4+ | no |
| R2 | 单点 try/catch + 三负向锁 | no |
| R3 | 硬约束 3/5 · 禁通用框架 | no |
| R4 | A1–A6 / 四门可机检 | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① 误把缺文件并入新分支改文案（F-W3-02）；② 负向 fixture 权限/`/tmp` 卫生导致误绿/误红（F-W3-03/12）；③ 顺手改 `pins fix` 或 PASS 输出（F-W3-05/06）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 先写可失败测试再改实现：① 截断 JSON ⇒ exit 2 + `PINS: BLOCKED`；② chmod 000 ⇒ 同；③ 冲突标记 ⇒ 同；④ 坏声明源对称不回退；⑤ 缺文件原文案；⑥ 基线 `pins check` rc=0。波末四门 + gate-check。

---

## 提交信息约定

- 实现提交：`fix(3.0.1-W3): …`（pins IO fail-closed · readTruthVersion）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟** `.workbuddy/` 未跟踪档 · 不裹挟 W4+ 草稿
- **禁 tag / push / publish / deprecate（仅人）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w3_pins_io_failclosed.md`

---

### 自检结论（执行者）

**帽**：30 实现 + 40 自证（同棒）· **日期**：2026-09-18 · **未发版 · 未 git commit**（留给 00/维护者）

#### GATE_VERIFY

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_1_w3_pins_io_failclosed.md
| HG-TASK-DRAFT | approved | … |
| HG-AUDIT-R1 | approved | ✅ 可 30 |
VERIFY: PASS
```

#### 实现要点

- `readTruthVersion`：先 `readFileSync` 再 `JSON.parse`，均包 try/catch → `fail(..., 2)` + `PINS: BLOCKED`；ENOENT 保留「真值源缺失」原文案（TOCTOU 收敛）
- 红测：`test/w3-pins-io-failclosed.test.ts`（A1–A6 · 6 例）
- **未**改 `pins fix` / PASS 语义 / 其他 exit · **未**引入通用 IO 框架 · **未**触 schema / W4+

#### 验收勾选

- [x] A1 截断 JSON → exit 2 + `PINS: BLOCKED`
- [x] A2 坏 pins.yaml 对称不回退
- [x] A3 chmod 000 → exit 2 + 前缀
- [x] A4 冲突标记 → exit 2 + 前缀
- [x] A5 缺文件原文案保留
- [x] A6 基线 `pins check` rc=0
- [x] A7 非范围钉死
- [x] A8 四门：typecheck · test(887 pass + 1 skip) · build · test:lib(6)
- [x] A9 gate-check + task close（本棒）· 未 commit / tag / push / publish

#### invoke

`docs/harness/invokes/by-task/3-0-1-w3-pins-io-failclosed/invoke_20260918_30_40_3-0-1-w3-pins-io-failclosed.md`

Wiki: none（修复性 patch · 无规范增量）

### 经验总结（执行者）

- P3-8 根因是同模块 IO 分类码不一致：`loadPins` exit 2 信封 vs `readTruthVersion` 裸 parse 崩溃级 exit 1；单点 try/catch 对齐即可，勿引通用 IO 框架。
- 缺文件必须保留「真值源缺失」原文案；TOCTOU 用先读再判 ENOENT，勿把缺文件并入「不可解析或不可读」。
- check-doc-links S2：未入库互相链接抬高计数；关账前过程档须逐文件 `git add`（禁 `git add -A`）。

### KPI（30/40）

Task_KPI%: 95（范围①–④与 A1–A8 全绿 · 红测 6/6 · 缺文件原文案保留 · 四门绿 · 零 schema/bump/发版越权 · 未 git commit 留给维护者）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同棒闭环

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 初稿 · 10-task（PLAN W3 / §6.3 P3-8）· 状态 draft · HG-TASK-DRAFT/HG-AUDIT-R1=pending · HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=N/A · 行号再钉 `cli-pins.ts:62-83`（loadPins）· `:85-91`（readTruthVersion · `:87` existsSync · `:88` 裸 parse）· 闸表 4 列且 id 单元格无内嵌粗体 |
| 2026-09-18 | **00 代签**：HG-TASK-DRAFT + HG-AUDIT-R1 → approved · R1 PASS · blocking 0 |
| 2026-09-18 | **30/40**：`readTruthVersion` fail-closed · 红测 A1–A6 · 四门绿 · gate-check/close · 未 commit |
