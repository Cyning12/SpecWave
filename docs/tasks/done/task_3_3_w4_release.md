# Task：3.3 W4 · release 收尾（3.2.0 → 3.3.0 · W1–W3 CLOSE 后发版簿记）

> **状态**：`done` · **00 验收关账** 2026-10-11（A1–A9）· HG-RELEASE-* **pending**（tag/push/publish 待人）  
 
> **上游 SPEC/PLAN**：[`3_3-graph-ast-opt-in`](../../spec/3_3-graph-ast-opt-in/README.md) · [`04` W4](../../spec/3_3-graph-ast-opt-in/04_execution_waves.md) · [`PLAN_3_3`](../../roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md)  
> **结构模板**：[`task_3_2_w5_release.md`](../done/task_3_2_w5_release.md) · ACCEPTANCE 样板 [`ACCEPTANCE_3_2_graph_ib_and_indexes_3_2_0_zh.md`](../../roadmap/ACCEPTANCE_3_2_graph_ib_and_indexes_3_2_0_zh.md)  
> **基线**：工作树 `package.json#version`=`3.2.0`（registry `latest=3.2.0` 已 published · 本地 tag `v3.2.0` 存在）  
> **发版纪律**：[`RELEASING.md`](../../../RELEASING.md) · **tag/push/npm publish 仅人**（本波默认不代跑）  
> **同支**：`task/specwave-3-3-graph-ast` · W3 tip=`9348190`  
> **过程授权**：维护者授权本 epic **00 签收过程文档**（`HG-TASK-DRAFT` / `HG-AUDIT-R1` · 须 lint + 20-task-audit R1 PASS）· **不**代签 `HG-RELEASE-*` · 见 [`invoke_20261011_00_epic_signoff.md`](../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_epic_signoff.md)

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-3-w4-release` |
| **test_strategy** | `required` |
| **test_strategy_note** | 四门绿；pins 打 tag 前仅 pin-10 设计红可接受（同 3.2 W5 · 缺 `v3.3.0` tag） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `task/specwave-3-3-graph-ast` |
| **graph_delta** | `none` |
| **graph_delta_note** | 版本钉 bump · 不改图谱语义 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 20/00 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 统一 PR（3.3 epic 同支） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | epic · 2026-10-11 维护者（继承） |
| HG-NEXT-PLAN | approved | — | epic · 同窗（继承） |
| HG-TASK-DRAFT | approved | 20, 30 | 2026-10-11 **00 签收** · lint + [`task_3_3_w4_release_audit_R1_20261011.md`](../../harness/reviews/task_3_3_w4_release_audit_R1_20261011.md) PASS |
| HG-AUDIT-R1 | approved | **30** | 2026-10-11 **00 签收** · **可 30 簿记** · HG-RELEASE-* 仍 pending |
| HG-RELEASE-TAG-PUSH | **pending** | — | tag/push **仅人** · 不拦 30 簿记 |
| HG-RELEASE-PUBLISH | **pending** | — | `npm publish` **仅人** · Agent 永禁 |

---

## 背景与目标

W1 CLI 面 · W2 AST 实装 · W3 文档分责均 CLOSE 后，簿记 bump **3.3.0**，交付到「bump 已落 · 台账齐 · tag/push/publish 待人」。

**本波完成态**：CHANGELOG `[3.3.0]`（graph ast check opt-in · symbol/有界 call · 不进默认 verify）· ACCEPTANCE 新档 · spec 索引本行 IMPLEMENTED/待发版 · pins 对齐 · package `3.3.0` · 四门绿（pin-10 设计红除外）· **未** tag/push/publish。

---

## 范围

严格对齐 SPEC `04` **W4** + PLAN **W4** + 样板 3.2 W5。

- [x] **①** bump：`package.json` + lock `3.2.0` → `3.3.0`（**不用** `npm version`）  
- [x] **②** CHANGELOG `## [3.3.0]`：W1–W3 摘要 + 待发版行；必要时回填 `[3.2.0]` 已 published（registry 实测）  
- [x] **③** pins 对齐（`pins fix --yes` · 打 tag 前仅 pin-10 设计红可接受 · 登记清偿路径）  
- [x] **④** ACCEPTANCE：`docs/roadmap/ACCEPTANCE_3_3_graph_ast_opt_in_3_3_0_zh.md`（W1–W3 台账 + epic 验收勾选 + pin-10 设计红）  
- [x] **⑤** `docs/spec/README.md` 本 epic 行 → IMPLEMENTED（`3.3.0` 待发版 / planned）  
- [x] **⑥** SPEC README / `04` 验收总表与 W4 勾选 · 状态可标 IMPLEMENTED · 待发版；PLAN 发版叙述对齐  
- [x] **⑦** RELEASING 人 checklist 预填 `3.3.0`（tag/push/publish 未勾）· 「最近一次发版」表对齐  
- [x] **⑧** 手册/README/MIGRATION/AGENTS 版本头栏与钉面同步（禁假「已 published 3.3.0」）  
- [x] **⑨** 四门绿 · commit `chore(3.3-W4): bump 3.3.0 acceptance and changelog` · **00 close**  
- [x] **⑩** **禁** tag / push / publish（本棒）· **禁** 把 AST 塞进默认 verify · **禁** indexes v2 · **禁** 改 kimi-code-meta

## 非范围

| 项 | 理由 |
|----|------|
| `git tag` / `git push` / `npm publish` | 仅人 · HG-RELEASE-* pending |
| W1–W3 返工 / 改 AST 判定语义 | 已关 / 冻结 |
| AST 默认进 `verify` | 政策硬约束 |
| indexes schema v2 | 另裁 |
| 改 kimi-code-meta / 整包移植 | 反哺纪律 |

---

## 失败路径

| 触发 | 行为 | 可重试 | 可见 |
|------|------|--------|------|
| HG-AUDIT-R1 pending | 拒 30 | 是 | 是 |
| 误 tag/push/publish | 打回 | — | 是 |
| 假 published 叙事（声称已 published 3.3.0） | 打回 | 是 | 审查 |
| 把 AST 写进默认 verify | 打回 | — | 是 |
| 四门非设计红失败 | 停 | 是 | 是 |
| `git add -A` / `npm version` | 打回 | — | 是 |

---

## 验收标准

- [x] **A1**：`package.json#version`=`3.3.0` + lock 同步  
- [x] **A2**：CHANGELOG 有 `[3.3.0]` 且含 W1–W3（opt-in · symbol/有界 call · 不进默认 verify）  
- [x] **A3**：ACCEPTANCE 档存在（W1–W3 台账 + epic 验收勾选）  
- [x] **A4**：spec 索引行 IMPLEMENTED / `3.3.0` 待发版（planned）  
- [x] **A5**：RELEASING 有 `3.3.0` checklist（发布三动作未勾）  
- [x] **A6**：无假「已 published 3.3.0」表述  
- [x] **A7**：四门绿（pin-10 / `release-tag-identity` 设计红除外口径同 3.2）  
- [x] **A8**：工作树无 `v3.3.0` tag · 未 publish 3.3.0  
- [x] **A9**：gate-check + close · 约定 commit message · **00 close**（task → done · SPEC `04` W4 勾选）

---

## 给执行帽的必读列表

1. [`task_3_2_w5_release.md`](../done/task_3_2_w5_release.md) · [`ACCEPTANCE_3_2_…`](../../roadmap/ACCEPTANCE_3_2_graph_ib_and_indexes_3_2_0_zh.md)  
2. `RELEASING.md` · `CHANGELOG.md` · `package.json` · `assets/release-pins.yaml`  
3. SPEC/PLAN 3.3 · W1–W3 done：`fe454f0` / `82abf30` / `9348190`  
4. 过程授权 invoke · FRAGMENT_30_gate_verify  

---

## 思考轮

### R0 · 证据

`package.json` version=`3.2.0`；registry `latest=3.2.0`；本地有 `v3.2.0`、无 `v3.3.0`；W1–W3 CLOSE；CHANGELOG 无 `[3.3.0]`；无 `ACCEPTANCE_3_3_*`；`docs/spec/README.md` 尚无 `3_3-graph-ast-opt-in` 行。

### R1 · 范围

仅 W4 release 簿记。排 tag/push/publish；排 AST→verify；排 indexes v2。

### R2 · 方案

沿 3.2 W5 模板 · bump 3.3.0 · ACCEPTANCE 新档 · pins fix · 回填 3.2.0 published 叙事。

### R3 · 边界

Agent 永禁 publish；HG-RELEASE-* pending；pin-10 缺 tag 设计红须登记清偿路径。

### R4 · 可测性

A1–A9 文件/版本断言 + 四门。

### R5 · 签收就绪

交 20 → 00 签过程闸 → 30 簿记 → 00 close。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 3.2.0 待 bump → 3.3.0 | no |
| R1 | 仅 W4 簿记 | no |
| R2 | 沿 3.2 W5 | no |
| R3 | 禁发版三动作 · pin-10 设计红可接受 | no |
| R4 | A1–A9 | no |
| R5 | 待 20 | no |

**residual_risks**：① 3.2.0 已 published 但过程档仍写「待发版」——30 须回填，避免 3.3 叙事与 registry 漂移；② 缺 `v3.3.0` tag → pin-10 设计红（预期 · 人清偿）。

---

## 测试策略（Harness）

**test_strategy**: `required`

---

## 提交信息约定

- `chore(3.3-W4): bump 3.3.0 acceptance and changelog`

### 自检结论（执行者）

**帽**：30 簿记 + 40 自证（同棒）· **日期**：2026-10-11 · **未** tag / push / publish / deprecate

#### GATE_VERIFY

```text
$ npx spec-wave verify --target . --task docs/tasks/active/task_3_3_w4_release.md
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_3_w4_release.md
```

#### 验收勾选

- [x] A1–A8 PASS · A9 close 本棒完成
- [x] 四门：typecheck/build/test:lib 绿 · npm test 仅 pin-10 族设计红 ×2 + lint-done 已补 30/40 invoke
- [x] 无 `v3.3.0` tag · 未 publish · pins 16/17（仅 pin-10）

#### invoke

`docs/harness/invokes/by-task/3-3-w4-release/`

### KPI（00）

Task_KPI%: 96（A1–A9 · bump 3.3.0 · 发布三动作边界守住 · 四门仅 pin-10 设计红）

- rubric：`KPI_RUBRIC_v1_2`

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | 10-task 初稿 · 00 开拆 W4 · HG-RELEASE-* pending |
| 2026-10-11 | 20 审 R1 PASS · **00 签收** 过程闸 · 可 30 簿记 · RELEASE 仍 pending |
| 2026-10-11 | 30/40：bump 3.3.0 簿记 · A1–A9 · **00 close** · 未 tag/push/publish |
