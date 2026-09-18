# Task：3.0.1 release · 收尾 bump（3.0.0 → 3.0.1 · W1–W6 全 CLOSE 后发版准备）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（**2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· 依据 [`task_3_0_1_release_bump_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_release_bump_audit_R1_20260918.md) PASS · blocking 0）· HG-RELEASE=pending（仅人 · `blocks_hats=—` 不拦 30 簿记）· 30/40 闭环完成 · 2026-09-18 · **未发版 / 未 commit / 未 tag**）  
> **wave**：release（3.0.1 patch · 收尾 bump · 同 2.4.2 / 2.3 wiring-release / 3.0 W7 bump 先例）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（**HG-NEXT-PLAN=approved** · 2026-09-18 维护者签收 · 授权 00 代签过程文档闸 · **HG-RELEASE / tag / push / publish 不在授权范围 · 仍仅人**）· **release 行** + **发布边界** + 硬约束 **10**（RELEASING 双重敏感）/ **12**（禁 Agent publish/tag/push）  
> **范围主源**：PLAN release 波 + W1–W6 done tasks（摘要入 CHANGELOG Fixed/Added）  
> **基线**：`spec-wave@3.0.0` published（npm `latest` = 3.0.0 · tag `v3.0.0` ↔ `895b975`）· **W1–W6 均已 CLOSE: PASS** · `package.json#version` 仍为 `3.0.0`  
> **发版纪律**：[`RELEASING.md`](../../../RELEASING.md)（本棒只做 bump 簿记段；**tag / push / npm publish / deprecate 仅人**）  
> **Open Folder**：仓根  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A（属 3.0.0 验收后 patch · 同 2.4.1/2.4.2 先例）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-1-release-bump` |
| **test_strategy** | `required` |
| **test_strategy_note** | 无新产品行为故无「红测先行改实现」义务；四门（typecheck / test / build / test:lib）+ `pins check`（pin-10 tag-gated 设计红可接受）为验收硬条款；**RELEASING.md 双重敏感**（硬约束 10 · pin-07 落点 + 九步顺序测）改后必跑**全量** `npm test`；版本断言联改沿 2.4.2/2.3 release 先例（perl 双模式字面+转义 · 历史标题与红测留证注释保留） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 版本钉 bump 机械动作 + 过程档；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 发版簿记 bump，无编码规范/流程增量；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0.1 patch 发版系列；合入由维护者 push+tag（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-18 维护者签收 PLAN_3_0_1（原文意图：「身为00，统筹3.0.1的升级，授权签收过程文档」）· release 波限制已解除 |
| HG-SPEC-SIGNOFF | N/A | — | 本版无独立 SPEC 夹（属 3.0.0 验收后 patch · 同 2.4.1/2.4.2 / W1–W6 先例） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· task lint PASS · 10/20 invoke 已落 |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-18 00 代签** · 依据 [`task_3_0_1_release_bump_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_release_bump_audit_R1_20260918.md)（PASS · blocking 0） |
| HG-RELEASE | pending | — | 3.0.1 发版闸 · **仅人**（tag / push / publish / deprecate）· **不拦 30 簿记** · **不在 00 代签范围** |

> **HG-RELEASE 说明**：本闸语义 = 发布动作（仅人），**不**把 `30` 写入 `blocks_hats`；30 可做 package.json/CHANGELOG/pins/ACCEPTANCE/RELEASING/手册钉等簿记。Agent **仍禁止**执行 tag/push/publish/deprecate。

---

## 背景与目标

3.0.1 patch 规划（PLAN）W1–W6 均已 CLOSE: PASS：粘性表源（P1-1）· 闸表契约（P2-4）· pins IO fail-closed（P3-8）· 文档精确化（P2-1/P2-3/P3-3/P5/P6）· 可选 hooks 钉版旗标（P2-2）· 机检覆盖面与 validate WARN（P3-2/P3-7）。维护者下令「继续」→ 开 **release 波**：把工作树版本真值从 `3.0.0` 簿记到 `3.0.1`，交付到「待发版」为止。

**完成态**：`package.json#version`=`3.0.1`；CHANGELOG 含 `## [3.0.1]` 节（汇总 W1–W6 · 发布状态「待发版」）；`pins fix --yes` 后 pins 对齐且 pin-10「git tag v3.0.1 缺失」为**设计红留痕**；ACCEPTANCE_3_0_1 档落 `docs/roadmap/`；使用手册版本钉已按本 task「手册钉策略」同步；RELEASING 台账 + 人 checklist 3.0.1 节已备（改后全量 npm test）；MIGRATION 已补「3.0.0→3.0.1 无强制动作项」（若缺）；四门绿。**未**执行 tag/push/publish。

---

## 范围

严格对齐 PLAN **release 行** + **发布边界**（不得改 W1–W6 已交付行为 · 不得触 schema）。

- [ ] **① bump 真值源**：`package.json#version` `3.0.0` → `3.0.1`（**唯一手工版本改动点** · **不用** `npm version` 防顺手 tag）；`package-lock.json` 同步
- [ ] **② CHANGELOG `## [3.0.1]` 节**（**顺序硬约束 · 先于 pins fix** · 同 2.3/2.4.2 先例 · 防 pin-13 回写历史头）
  - 将 `## [Unreleased]` 中已登记的 W5/W6 Added 与 **尚缺的 W1–W4 Fixed 摘要**一并归拢为 `## [3.0.1] - YYYY-MM-DD`（日期取 bump 当日）
  - **Fixed（建议骨架 · 30 按 done task 验收句压缩）**：
    - W1：粘性可选 `table_source`；默认 `host verify` 取表与 `apply` 同源；非内置表源不可用 fail-closed 不静默退回内置
    - W2：README 双语最小骨架 4 列 + 空解析告警（含 id 内嵌粗体子形态提示）；不放宽 `GATE_ROW_RE`
    - W3：`readTruthVersion` 坏 `package.json` → exit 2 + `PINS: BLOCKED`（与 `loadPins` 同形态）
    - W4：MIGRATION §① 措辞精确化 · CHANGELOG `[3.0.0]` Tests 864 回填 · `files` 列 README.zh-CN · research 作者数区间化 · check-doc-links 注释口径
  - **Added/Changed**：W5 可选 `--pin-hook-version`（实验性 · 缺省关闭）· W6 terminology 扫 CHANGELOG + validate config-hook WARN
  - **发布状态行写「待发版（tag/push/publish 仅人）」**（不冒充已 published）
  - Unreleased 仅留空壳
- [ ] **③ `pins fix --yes`**：先 `pins check` 观察偏差 → `node bin/specgate.js pins fix --yes`（或等价 `npx` 本地 bin）对齐钉面 → 复跑；**唯一可接受偏差** = pin-10 git tag `v3.0.1` 缺失（**设计红** · 待人打 tag 后须 17/17）
- [ ] **④ 叙事漂移巡检**（2.4.2/2.3 经验）：机械替换造成的「已 published」假叙事改回真值（RELEASING latest 行 · README 双语「现行 published」指针等）；pins 未钉的现行版引用与测试版本断言联改留痕（perl 双模式 · 历史标题/红测留证注释保留）
- [ ] **⑤ ACCEPTANCE 档**：新建 [`docs/roadmap/ACCEPTANCE_3_0_1_patch_3_0_1_zh.md`](../../roadmap/ACCEPTANCE_3_0_1_patch_3_0_1_zh.md)（W1–W6 台账摘要 + release 门禁基线 + pin-10 设计红登记 + 发布边界「待发版」· 结构参照 [`ACCEPTANCE_2_4_2_patch_2_4_2_zh.md`](../../roadmap/ACCEPTANCE_2_4_2_patch_2_4_2_zh.md)）；可选：`docs/spec/README.md` 增 3.0.1 patch 索引行（pin-08 边界正则下 `` `3.0.1` 待发版 `` 形态 · 若本波无独立 SPEC 夹则一行指针即可）
- [ ] **⑥ 使用手册版本钉同步**（现有 [`docs/guides/使用手册-v3.0.0-zh.md`](../../guides/使用手册-v3.0.0-zh.md)）
  - **推荐策略（patch · 少链漂移）**：**保留文件名** `使用手册-v3.0.0-zh.md`；更新头栏「版本 / 适用包」钉为 **`spec-wave@3.0.1`（待发版）**，并一行注明「手册基线仍为 3.0.0 架构面；3.0.1 patch 差异见 CHANGELOG `[3.0.1]` / MIGRATION『无强制动作项』」；文内安装示例 `npx spec-wave@3.0.0` 等**现行钉**改为 `@3.0.1`（历史对照句可保留）
  - **备选（若 20/00 裁定文件名须跟 semver）**：`git mv` → `使用手册-v3.0.1-zh.md` + 旧路径留短 POINTER 跳转；须同步一切入站链接（W5/W6 reviews · PLAN · 验收镜像）并过 `check-doc-links`
  - **禁止**：为改名而改产品行为文案；禁止把待发版写成已 published
- [ ] **⑦ RELEASING 台账 + 人 checklist 3.0.1 节**【**双重敏感** · 硬约束 10】
  - 「最近一次发版」表：工作树版本行写 **bump 已落 · 待发版**（现行 registry latest 仍写真值 `3.0.0` 直至人 publish）；增「验收（3.0.1）」台账行链 ACCEPTANCE；主题行摘要 W1–W6
  - 九步之后新增「人 checklist · `3.0.1` 发版（**待执行**）」节（模板同 3.0.0/2.4.2 · 含原子推规则 · pin-10 打 tag 后 17/17 · **全未勾选**）
  - 改后**必跑全量** `npm test`（不得只跑子集）
- [ ] **⑧ MIGRATION「3.0.0→3.0.1 无强制动作项」**：PLAN 发布边界要求本段；W4 仅修了 §① 内置路径措辞，**未**写「无动作项」专节 ⇒ 本波**补写**短节（含：粘性向后兼容 · 无强制迁移 · 可选了解 W5 旗标 / W6 WARN 可见性）；不暗示 breaking
- [ ] **⑨ 四门 + 关账准备**：`npm run typecheck` · `npm test`（tag-gated 设计红留痕可接受）· `npm run build` · `npm run test:lib`；波末 `gate-check` → `task close --yes`；提交约定 `chore(release): bump to 3.0.1`（独立 · 逐文件显式 add）

## 非范围

| 项 | 理由 |
|----|------|
| `git tag` / `git push` / `npm publish` / `npm deprecate` | **仅人**（HG-RELEASE · PLAN 硬约束 12 · 维护者未授代跑） |
| RELEASING/CHANGELOG/README「已 published」叙事回填 | 待人 publish 后 ⑨ 回填（避免冒充已发布） |
| 改 W1–W6 已交付行为 / 返修实现 | 每波一 task 已 CLOSE · release 只簿记 |
| 触 host-adapt schema / 改判定语义松紧 / 新增对外能力面 | PLAN 硬约束 3 · 触即 STOP |
| 覆写 S2 过程域既有档 | 硬约束 1 · 只新增 |
| `npm version`（会顺手造 tag） | 禁 · 唯一手工改 `package.json#version` |
| `--force` / `--allow-*` / `git add -A` | 禁令 |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改簿记（F-REL-00） | 30 **拒开工**（verify 机械拦 exit 2） | 是（20 审 + 00 签后） | 是 |
| 越权执行 tag/push/publish/deprecate（F-REL-01） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟域外档（F-REL-02） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| pins fix 先于 CHANGELOG `## [3.0.1]` 节落盘（F-REL-03） | pin-13 可能回写历史头 · 验收 FAIL | 是（还原 · 按序重做） | — |
| 叙事漂移未巡检（假「已 published」入库）（F-REL-04） | 验收 FAIL · 打回 | 是 | 是 |
| RELEASING 改动后未跑全量 npm test（F-REL-05 · 双重敏感） | 验收 FAIL · 补跑 | 是 | — |
| pins check 偏差非「仅 pin-10」设计红（F-REL-06） | 验收 FAIL · 修漏网钉面 | 是 | 是 |
| pin-10 设计红被误判为产品回归（F-REL-07） | 留痕说明 · 待人打 `v3.0.1` 后复跑 | 是 | — |
| 断言联改漏网（转义 `3\.0\.0`）（F-REL-08） | npm test 红 · perl 双模式补齐 | 是 | — |
| 四门任一意外红（F-REL-09） | 停止 · 先修 | 是 | 是 |
| 顺手改 W1–W6 行为 / 触 schema（F-REL-10） | 打回或 **STOP** 上报 | — | 是 |
| 手册改名未更新入站链致 check-doc-links 红（F-REL-11） | 打回 · 或改回「保留文件名」策略 | 是 | 是 |
| MIGRATION 仍缺「无强制动作项」且宣称完成（F-REL-12） | A8 失败 · 打回 | 是 | 是 |
| 用 `npm version` 顺手造 tag（F-REL-13） | 违范围 · 打回（删本地误 tag 若未 push） | 是 | — |

---

## 验收标准

- [x] **A1 version**：`package.json#version` = `3.0.1`（唯一手工点 · 未用 `npm version`）
- [x] **A2 CHANGELOG**：存在 `## [3.0.1]` 节；含 W1–W6 摘要（Fixed/Added）；发布状态为**待发版**；Unreleased 无残留本版条目
- [x] **A3 pins**：`pins fix --yes` 后 `pins check` → 对齐；唯一可接受红 = pin-10 `v3.0.1` 缺失（设计红留痕）
- [x] **A4 ACCEPTANCE**：`docs/roadmap/ACCEPTANCE_3_0_1_patch_3_0_1_zh.md` 存在且链本 task / PLAN / W1–W6
- [x] **A5 手册钉**：头栏/适用包钉已同步 3.0.1（保留文件名**或**改名+POINTER+入站链全绿 · 策略与自检一致）
- [x] **A6 RELEASING**：台账 + 人 checklist 3.0.1 节已落；改后**全量** `npm test` 已跑
- [x] **A7 MIGRATION**：含「3.0.0 → 3.0.1 无强制动作项」（或等价标题）短节
- [x] **A8 四门**：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib` 全绿（tag-gated 设计红口径同 2.4.x · 如实留痕不冒充 17/17）
- [x] **A9 非范围**：未改 W1–W6 产品行为；未触 schema；未执行 tag/push/publish/deprecate
- [x] **A10 关账**：`gate-check` exit 0 + `task close --yes`；提交边界可证无裹挟

---

## 给执行帽的必读列表

1. [`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md) — release 行 · 发布边界 · HG-RELEASE · 硬约束 10/12
2. 先例 bump：[`docs/tasks/done/task_2_4_2_patch.md`](../done/task_2_4_2_patch.md) bump 段 · [`docs/tasks/done/task_2_3_wiring_release.md`](../done/task_2_3_wiring_release.md) · W7 HG-RELEASE `blocks=—` 裁定（[`task_3_0_w7_closeout_external.md`](../done/task_3_0_w7_closeout_external.md)）
3. ACCEPTANCE 模板：[`docs/roadmap/ACCEPTANCE_2_4_2_patch_2_4_2_zh.md`](../../roadmap/ACCEPTANCE_2_4_2_patch_2_4_2_zh.md)
4. W1–W6 done：`docs/tasks/done/task_3_0_1_w{1..6}_*.md`（CHANGELOG Fixed 摘要源）
5. [`RELEASING.md`](../../../RELEASING.md) · [`CHANGELOG.md`](../../../CHANGELOG.md) · [`MIGRATION.md`](../../../MIGRATION.md) · [`docs/guides/使用手册-v3.0.0-zh.md`](../../guides/使用手册-v3.0.0-zh.md)
6. `docs/standards/` 涉簿记/文档时 30 自裁引用 L2

---

## 思考轮

### R0 · 证据

PLAN HG-NEXT-PLAN=approved · release 行明示 bump 套件；W1–W6 CLOSE: PASS；`package.json` 仍 3.0.0；CHANGELOG Unreleased 仅有 W5/W6（W1–W4 Fixed 摘要待归拢）；MIGRATION 无「3.0.0→3.0.1 无动作项」节（发布边界缺口）；手册文件名钉 v3.0.0；RELEASING latest 仍 3.0.0 published；W7 已裁定 HG-RELEASE `blocks=—`。

### R1 · 范围

仅簿记：version · CHANGELOG · pins fix · ACCEPTANCE · 手册钉 · RELEASING checklist · MIGRATION 无动作项；显式排除 tag/push/publish 与 W1–W6 行为返工。

### R2 · 方案

沿 2.4.2/2.3 release：手工 package.json → CHANGELOG 先行 → pins fix → 叙事巡检 → ACCEPTANCE/RELEASING/MIGRATION/手册；手册默认保留文件名+头栏钉（备选改名须链全绿）。

### R3 · 边界

HG-RELEASE 不拦 30 簿记但仍禁发布四动作；硬约束 3/10/12；S2 只新增；不用 npm version。

### R4 · 可测性

A1–A10 均可机检或 diff 断言；`test_strategy=required`（全量回归 + pins）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（重点：CHANGELOG W1–W4 是否漏归拢 · 手册策略 · MIGRATION 无动作项 · HG-RELEASE blocks=— · 双重敏感全量 test）。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | W1–W6 CLOSE · version 仍 3.0.0 · MIGRATION/手册/CHANGELOG 缺口齐 | no |
| R1 | 仅 release 簿记 · 排除发布四动作与行为返工 | no |
| R2 | 2.4.2 九件套 + 手册保留文件名优先 | no |
| R3 | HG-RELEASE 不拦 30 · 硬约束 3/10/12 | no |
| R4 | A1–A10 可断言 · required | no |
| R5 | 待 20 审 R1 | no |

**residual_risks**：① pin-10 / release-tag-identity 在打 tag 前为设计红（F-REL-07）；② RELEASING 措辞触发九步顺序测红（F-REL-05）；③ 手册若改名漏链（F-REL-11）；④ CHANGELOG 归拢漏 W1–W4（A2）；⑤ 断言联改漏转义形态（F-REL-08）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 无新产品行为测试义务；波末四门 + pins check（pin-10 设计红留痕）+ RELEASING 改后全量 `npm test` 为硬条款。版本断言联改须一轮 perl 双模式覆盖，禁止只改字面漏转义。

---

## 提交信息约定

- bump 提交：`chore(release): bump to 3.0.1`（独立提交）
- **禁 `git add -A`**：逐文件显式 add
- **禁 tag / push / publish / deprecate（仅人 · HG-RELEASE）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_release_bump.md`

---

### 自检结论（执行者）

> GATE_VERIFY PASS（HG-AUDIT-R1=approved · HG-RELEASE pending 且 blocks=—）。`package.json#version`=3.0.1（未用 npm version）。CHANGELOG `## [3.0.1]` 汇总 W1–W6 · 待发版。pins **16/17**（唯一红 = pin-10 `v3.0.1` 缺失）。typecheck 0 · npm test 906 / 903 pass / 2 设计红 / 1 skip · build 0 · test:lib 6/6。未执行 tag/push/publish/deprecate · 未 git commit。

### KPI（00）

Task_KPI%: 94（A1–A10 簿记闭环 · pins 16/17 仅 pin-10 设计红 · 四门除 2 条 tag-gated 设计红外全绿 · 未 tag/push/publish/commit）

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 初稿 · 10-task（维护者下令继续 → 3.0.1 release bump）· HG-TASK-DRAFT/HG-AUDIT-R1=pending · HG-RELEASE=pending（blocks=—）· HG-NEXT-PLAN=approved · SPEC=N/A · 手册钉策略写清（默认保留文件名）· MIGRATION 无动作项纳入范围（W4 未写全）· 补 `### 自检结论`/`### KPI` 占位过 E5 |
| 2026-09-18 | **00 代签**：HG-TASK-DRAFT + HG-AUDIT-R1 → approved · HG-RELEASE 仍 pending（仅人 · 不在代签范围） |
