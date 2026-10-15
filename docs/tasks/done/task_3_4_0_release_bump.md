# Task：3.4.0 release · 收尾 bump（3.3.0 → 3.4.0 · PR #36 合入后发版簿记 + 3.3.0 回填清偿）

> **状态**：`done` · **00 验收关账** 2026-10-15（A1–A11 全 PASS）· **HG-TASK-DRAFT=approved** · **HG-AUDIT-R1=approved**（均 2026-10-15 00 代签 · 授权真值：维护者本窗「好的，全部完成我来操作发版」）· **HG-RELEASE-TAG-PUSH / HG-RELEASE-PUBLISH**：人 2026-10-15 已执行（tag `v3.4.0` object `25a4686` ↔ `c4d027b` · publish registry `latest=3.4.0` 端点实测）  
> **wave**：release（3.4.0 minor · 单 feature 收尾 bump · 沿 3.0.1/3.0.2 先例 · **本版差异：tag/push/publish 三动作全仅人**）  
> **范围主源**：PR [#36](https://github.com/Cyning12/SpecWave/pull/36)（feat(review-gates) 址B 双址扫描 · merge commit `008fb6f` · Closes issue [#35](https://github.com/Cyning12/SpecWave/issues/35)）+ **3.3.0 发布回填缺**（人 2026-10-11 publish 后未回填 · registry `latest=3.3.0` · `time.3.3.0`=2026-10-11T06:33:10.216Z · tag `v3.3.0` ↔ `197b337` · 均 2026-10-15 实测）  
> **基线**：`spec-wave@3.3.0` published（npm `latest`=3.3.0 · tag `v3.3.0`）· `package.json#version`=`3.3.0` · pins 17/17  
> **发版纪律**：[`RELEASING.md`](../../../RELEASING.md)（本棒做 bump 簿记段；**tag/push/npm publish/deprecate 仅人**）  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A（单 feature · issue #35 承载需求与方案裁定 · 沿 3.0.1/2.4.x 先例）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-4-0-release-bump` |
| **test_strategy** | `required` |
| **test_strategy_note** | 无新产品行为故无「红测先行改实现」义务；四门（typecheck / test / build / test:lib）+ `pins check`（pin-10 tag-gated 设计红 · 人打 tag 后须 17/17 转绿）为验收硬条款；**RELEASING.md 双重敏感**改后必跑**全量** `npm test`；版本断言联改沿 3.0.x 先例（perl 双模式字面+转义） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `release/3-4-0-bump`（PR 合入 `main`） |
| **graph_delta** | `none` |
| **graph_delta_note** | 版本钉 bump 机械动作 + 过程档；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 发版簿记 bump，无编码规范/流程增量；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.4.0 发版簿记；PR 合并后 tag/push/publish 由人执行 |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | N/A | — | 本版无独立 SPEC 夹（单 feature · issue #35 承载 · 同 3.0.1 / 2.4.x 先例） |
| HG-NEXT-PLAN | approved | — | 人 · 2026-10-15 维护者本窗指令「全部完成我来操作发版」（发版决策 + 簿记授权） |
| HG-TASK-DRAFT | approved | 20, 30 | 2026-10-15 00 代签 · 授权真值：维护者本窗「好的，全部完成我来操作发版」· task lint PASS |
| HG-AUDIT-R1 | approved | 30 | 2026-10-15 00 代签 · 依据 [`task_3_4_0_release_bump_audit_R1_20261015.md`](../../harness/reviews/task_3_4_0_release_bump_audit_R1_20261015.md)（PASS · blocking 0 · tag/push/publish 仅人硬边界） |
| HG-RELEASE-TAG-PUSH | **pending** | — | `git tag v3.4.0` + push **仅人**（本窗维护者自留）· 不拦 30 簿记 |
| HG-RELEASE-PUBLISH | **pending** | — | `npm publish` / `npm deprecate` **仅人** · Agent 永禁 · 不拦 30 簿记 |

> **闸说明**：HG-RELEASE-TAG-PUSH / HG-RELEASE-PUBLISH 语义 = 发布动作，**不**把 `30` 写入 `blocks_hats`；30 可做 package.json/CHANGELOG/pins/ACCEPTANCE/RELEASING/手册钉等簿记。tag/push/publish 全由人执行。

---

## 背景与目标

PR #36（review-gates 址B `docs/audits/task-review/` 扫描 + 命名口径 · 下游 ops-desk-api 双址规约上游根治 · Closes #35）已合入 `main`（merge `008fb6f`）。开 **release 波**：把工作树版本真值从 `3.3.0` 簿记到 `3.4.0`（semver **minor** · feat 向后兼容新增），交付到「**bump 已合 main · 台账齐 · tag/push/publish 待人**」为止。

**附带清偿（3.3.0 回填缺）**：人 2026-10-11 publish 3.3.0 后未做 ⑨ 回填 —— CHANGELOG `[3.3.0]` 发布状态仍为「待发版」、spec 索引行仍为「待发版（planned）」、RELEASING「最近一次发版」表与人 checklist `3.3.0` 节仍为待执行、手册头栏仍为「待发版」、MIGRATION 包钉仍为「待发版」。本波按 3.0.1 回填先例一并清偿（事实以 2026-10-15 `npm view` 实测为准 · 禁凭记忆）。

**完成态**：`package.json#version`=`3.4.0`；CHANGELOG 含 `## [3.4.0]` 节 + `[3.3.0]` 回填为已发布；`pins fix --yes` 对齐钉面（打 tag 前仅 pin-10 设计红）；`docs/spec/README.md` 增 3.4.0 索引行 + 3.3.0 行回填 published；ACCEPTANCE_3_4_0 档落盘；RELEASING 台账 + 人 checklist 3.4.0 节齐备（3.3.0 节标记已完成）；手册头栏钉 `spec-wave@3.4.0`；MIGRATION「3.3.0 → 3.4.0 无动作项」；四门绿；PR 合入 `main`；**未** tag/push/publish。

---

## 范围

严格对齐 RELEASING 硬步骤 ①–④ + ⑦（Agent 可做段）+ 3.0.2 release task 模板。

- [x] **① bump 真值源**：`package.json#version` `3.3.0` → `3.4.0`（**唯一手工版本改动点** · **不用** `npm version` 防顺手 tag）；`package-lock.json` 同步
- [x] **② CHANGELOG**（**顺序硬约束 · 先于 pins fix** · 防 pin-13 回写历史头）
  - 新增 `## [3.4.0] - 2026-10-15`：主题行（review-gates 址B 双址扫描 minor · PR #36 · issue #35 · 无独立 SPEC 夹）+ **Added**（`findLatestReview` 扩第三址 `docs/audits/task-review/` + 址B 命名口径 `YYYYMMDD_<slug>_r<n>.md` · 按址绑定不串址 · normalizeSlug/去 task_ 前缀/_v\<n\> 剥离 · 跨址最高 R 轮 · 址B 不存在零噪音 · findReview 同源投影）+ **发布状态行**：「**待发版（tag/push/publish 仅人）**（bump 已落 · registry `latest` 仍为 `3.3.0` 直至人 publish · pin-10 打 tag 前设计红）」
  - **回填 `[3.3.0]` 发布状态行** → 已发布（人 2026-10-11 publish · registry `latest=3.3.0` · `time.3.3.0`=2026-10-11T06:33:10.216Z · tag `v3.3.0` ↔ `197b337` · 回填由 00 代核 · 2026-10-15）
  - Unreleased 仅留空壳
- [x] **③ `pins fix --yes`**：先 `pins check` 观察偏差 → `node bin/specgate.js pins fix --yes` → 复跑；**打 tag 前唯一可接受偏差** = pin-10 git tag `v3.4.0` 缺失（**设计红** · 人打 tag 后须 17/17）
- [x] **④ 叙事漂移巡检**：机械替换造成的假叙事改回真值；版本断言联改留痕（perl 双模式 · 历史标题/红测留证注释保留）；**3.3.0 回填一律用 registry 实测事实 · 不冒充、不漏填**
- [x] **⑤ ACCEPTANCE 档**：新建 `docs/roadmap/ACCEPTANCE_3_4_review_gates_dual_address_3_4_0_zh.md`（PR #36 台账摘要 + release 门禁基线 + pin-10 设计红登记与清偿路径 + 发布边界「bump 已合 main · tag/push/publish 待人」· 结构参照 ACCEPTANCE_3_0_2）；ACCEPTANCE_3_3_0 档补一行回填注（已发布事实）
- [x] **⑥ spec 索引行**：`docs/spec/README.md` 增 `3.4.0` 行（pin-08 语义格位口径 · 状态格含边界点式 `3.4.0` + 发布态措辞）· **回填 3.3.0 行**状态「待发版（planned）→ published」（保行形态其余不动）
- [x] **⑦ 使用手册版本钉同步**（`docs/guides/使用手册-v3.0.0-zh.md` · 沿「保留文件名」策略）：头栏「版本 / 适用包」钉 `spec-wave@3.4.0`（**待发版 · tag/push/publish 待人**）；手册基线行续写「3.4.0 minor 差异见 CHANGELOG `[3.4.0]`」；**禁止**把待发版写成已 published
- [x] **⑧ RELEASING 台账 + 人 checklist**【**双重敏感** · 改后必跑全量 npm test】
  - 「最近一次发版」表：工作树行写 `3.4.0` bump 已落 · tag/push/publish 待人（registry `latest` 真值 `3.3.0`）；**3.3.0 行下沉为「前一 latest（已 published）」**并补实测事实（`time.3.3.0` · tag ↔ `197b337`）；主题行增 3.4.0 摘要；验收台账增 3.4.0 行
  - `### 人 checklist · 3.3.0 发版` 节标记**已完成**（人 2026-10-11 执行 tag/push/publish · 00 代核 2026-10-15 registry 实测）· 勾选框按实勾
  - 新增 `### 人 checklist · 3.4.0 发版` 节：tag/push/publish 项全未勾（仅人 · 留哈希回填位）
- [x] **⑨ MIGRATION**：头栏包钉 `spec-wave@3.4.0`（待发版）· 补「3.3.0 → 3.4.0 无强制动作项」（址B 扫描为新增能力 · 既有址A 行为不变 · 消费仓审查文落址B 后上游 verify 直认 · 不暗示 breaking）
- [x] **⑩ 禁** tag / push / publish / deprecate（本棒）· **禁** `npm version` · **禁** `git add -A` · **禁** 改 PR #36 已交付行为
- [x] **⑪ 四门 + 关账**：波末四门绿 + `pins check`（打 tag 后 **17/17** 实测清偿）→ PR [#38](https://github.com/Cyning12/SpecWave/pull/38) 合 main（合并提交 `4680965` · main CI 4/4 绿）→ `task close --yes`；提交约定：簿记 `chore(release): bump to 3.4.0`（逐文件显式 add）· ⑨ 回填棒（publish 后）以 docs PR 收口

## 非范围

| 项 | 理由 |
|----|------|
| `git tag` / `git push` / `npm publish` / `npm deprecate` | **仅人**（HG-RELEASE-TAG-PUSH / HG-RELEASE-PUBLISH = pending · 维护者本窗自留） |
| 3.4.0「已 published」叙事回填 | 待人 publish 后 ⑨ 回填（避免冒充已发布） |
| 改 PR #36 已交付行为 / review-gates 判定语义 | 已合并冻结 · release 只簿记 |
| spec 审查扫描面（findSpecReview）扩址B | issue #35 已裁登记 follow-up · 不在本版 |
| 触 host-adapt schema / 图谱资产 | graph_delta=none |
| `npm version`（会顺手造 tag） | 禁 · 唯一手工改 `package.json#version` |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改簿记（F-REL-00） | 30 **拒开工**（verify 机械拦 exit 2） | 是（20 审 + 00 签后） | 是 |
| 越权 tag/push/publish/deprecate（F-REL-01） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟域外档（F-REL-02） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| pins fix 先于 CHANGELOG `## [3.4.0]` 节落盘（F-REL-03） | pin-13 可能回写历史头 · 验收 FAIL | 是（还原 · 按序重做） | — |
| 叙事漂移未巡检（假「已 published 3.4.0」入库 · 含手册/RELEASING/MIGRATION）（F-REL-04） | 验收 FAIL · 打回 | 是 | 是 |
| RELEASING 改动后未跑全量 npm test（F-REL-05 · 双重敏感） | 验收 FAIL · 补跑 | 是 | — |
| 打 tag 前 pins 偏差非「仅 pin-10」（F-REL-06） | 验收 FAIL · 修漏网钉面 | 是 | 是 |
| 断言联改漏网（转义 `3\.3\.0`）（F-REL-07） | npm test 红 · perl 双模式补齐 | 是 | — |
| 四门任一意外红（F-REL-08） | 停止 · 先修 | 是 | 是 |
| 3.3.0 回填事实凭记忆失准（F-REL-09） | 验收 FAIL · 以 `npm view` 实测重钉 | 是 | 是 |
| spec 索引行不合格位（状态格缺边界点式串或发布态措辞）（F-REL-10） | pin-08 红 · 打回修正行形态 | 是 | 是 |
| 用 `npm version` 顺手造 tag（F-REL-11） | 违范围 · 打回 | 是 | — |
| CI 未绿即合 PR（F-REL-12） | RELEASING 硬步骤 ⑥ · 禁合 | 是 | 是 |

---

## 验收标准

- [x] **A1 bump 单点**：`package.json#version`=`3.4.0`（唯一手工版本改动 + lock 同步 · 无 `npm version` 痕迹）
- [x] **A2 CHANGELOG**：`[3.4.0]` 节齐（主题/Added/发布状态「待发版 · tag/push/publish 仅人」）· `[3.3.0]` 回填已发布（registry 实测事实 · 含 `time.3.3.0` 与 tag ↔ `197b337`）
- [x] **A3 pins**：打 tag 前偏差仅 pin-10（设计红留痕 · 清偿路径登记 = 人打 tag 后复跑 17/17）
- [x] **A4 叙事真值**：全仓 grep 无「3.4.0 已 published」假叙事 · 手册/RELEASING/CHANGELOG/spec 索引行/MIGRATION 的 registry latest 均写 `3.3.0`（直至人 publish）
- [x] **A5 ACCEPTANCE 档**：`ACCEPTANCE_3_4_review_gates_dual_address_3_4_0_zh.md` 落盘（PR #36 台账 + 门禁基线 + pin-10 设计红 + 发布边界）· ACCEPTANCE_3_3_0 补回填注
- [x] **A6 spec 索引**：3.4.0 行入表（pin-08 语义格位合格 · `pins check` pin-08 ok）· 3.3.0 行状态已回填 published
- [x] **A7 手册钉**：头栏 `spec-wave@3.4.0`（待发版 · tag/push/publish 待人）· 基线行续写 3.4.0 · 无「已 published」
- [x] **A8 RELEASING**：台账三处更新（latest 行 / 3.3.0 下沉行 / 主题与验收行）· 3.3.0 checklist 标已完成 · 3.4.0 checklist tag/push/publish 全未勾 · 改后全量 npm test 绿
- [x] **A9 MIGRATION**：「3.3.0 → 3.4.0 无强制动作项」在档 · 包钉 `3.4.0` 待发版 · 不暗示 breaking
- [x] **A10 四门**：typecheck · test · build · test:lib 全绿
- [x] **A11 关账**：PR #38 合 main（`4680965` · main CI 4/4 绿 · tag-gated 设计红随人打 tag 清偿）· 提交逐文件显式 add · Agent **未**执行 tag/push/publish/deprecate（人 2026-10-15 全执行 · registry `latest=3.4.0` 端点实测）

---

## 给执行帽的必读列表

1. [`docs/tasks/done/task_3_0_2_release_bump.md`](../done/task_3_0_2_release_bump.md)（release 波全套动作模板 · 本 task 与其差异 = tag/push 不授权代跑 · 全仅人）
2. `RELEASING.md` 全文（九步 · 台账 · checklist 体例）
3. PR #36 body + issue #35（CHANGELOG 摘要素材 · 红绿对照证据在案）
4. `docs/spec/README.md` 3.3.0 行（索引行形态模板 · pin-08 语义格位）
5. [`docs/roadmap/ACCEPTANCE_3_0_2_patch_3_0_2_zh.md`](../../roadmap/ACCEPTANCE_3_0_2_patch_3_0_2_zh.md)（单波 ACCEPTANCE 结构模板）

---

## 思考轮

### R0 · 证据

PR #36 已合 main（merge `008fb6f` · CI 10 项全绿 · 本地 worktree 复核四门绿 989 tests）；3.3.0 回填缺口实钉（CHANGELOG/spec 索引/RELEASING/手册/MIGRATION 五处「待发版」滞留 · registry `latest=3.3.0` · `time.3.3.0`=2026-10-11T06:33:10.216Z · tag `v3.3.0` ↔ `197b337` 均 2026-10-15 `npm view`/git 实测）；基线 pins 17/17。

### R1 · 范围

仅 release 波：bump · CHANGELOG（含 3.3.0 回填）· pins fix · 叙事巡检 · ACCEPTANCE · spec 索引行 · 手册钉 · RELEASING 台账与双 checklist · MIGRATION · 关账。排除：tag/push/publish/deprecate · 3.4.0 已发布回填 · 改 PR #36 行为 · spec 扫描面扩址（follow-up）。

### R2 · 方案

沿 3.0.2 release task 全套动作模板，两处差异定案：① tag/push **不**授权代跑（维护者本窗「我来操作发版」· 三动作全仅人 · HG-RELEASE-* 均 pending）；② 3.3.0 回填清偿并入本波（独立子项 · 事实全实测）。版本号裁 minor（PR #36 = feat 向后兼容新增 · semver）。

### R3 · 边界

tag/push/publish 仅人是硬边界；3.3.0 回填为事实订正非覆写 S2 留痕；发现需改产品行为才能簿记 ⇒ STOP 上报。

### R4 · 可测性

A1–A11 全机检（grep 叙事 · pins 设计红口径 · 索引行 pin-08 · 四门 · PR CI）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核；HG-TASK-DRAFT / HG-AUDIT-R1 由 00 按维护者本窗授权代签；HG-RELEASE-TAG-PUSH / HG-RELEASE-PUBLISH = pending（人自留）。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 回填缺口与 registry 事实钉齐 · PR #36 合并态钉齐 | no |
| R1 | 仅 release 波 · tag/push/publish 冻结 | no |
| R2 | 模板沿用 + 两差异定案 · minor 裁定 | no |
| R3 | tag/push/publish 仅人 / 回填性质两硬边界 | no |
| R4 | A1–A11 全机检 | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① 回填事实凭记忆（F-REL-09 · 全部 `npm view`/git 实测重钉）；② 手册/台账「待发版」措辞误写已发布（F-REL-04 · A4 grep）；③ spec 索引行格位不合格（F-REL-10 · A6 pin-08 机检）；④ pins fix 顺序颠倒回写历史头（F-REL-03 · 范围②顺序硬约束）。

---

### 自检结论（执行者）

**30 簿记棒自检：PASS（⑪/A11 已勾 · 全项终态）**（2026-10-15 · 00 代签授权 = 维护者本窗「全部完成我来操作发版」· 人 tag/push/publish 已执行 · ⑨ 回填 00 代核）

| 项 | 结果 |
|----|------|
| ① bump | `package.json` + `package-lock.json` 各仅 version 行 `3.3.0`→`3.4.0` · 未用 `npm version`（lock 改动前先 `git checkout -- package-lock.json` 复位防 npm install 带入 peer 写入） |
| ② CHANGELOG | `[3.4.0] - 2026-10-15` 节齐（先于 pins fix 落盘 · F-REL-03 遵守）· `[3.3.0]` 回填已发布（registry 实测：`latest=3.3.0` · `time.3.3.0`=2026-10-11T06:33:10.216Z · tag `v3.3.0` ↔ `197b337`） |
| ③ pins | `pins fix --yes` 写 9 处 · 复跑 **16/17 · 唯一偏差 pin-10**（tag `v3.4.0` 缺失 · 设计红 · 清偿归人打 tag） |
| ④ 叙事巡检 | pins fix 漂移全修回真值（README 双语现行包行 / MIGRATION 头栏+L17+L211 / 手册头栏+§2 五处 / RELEASING 台账）· 簿记时点全仓 grep 无「3.4.0 已 published」假叙事 · publish 后 ⑨ 回填棒已把全叙事翻真（registry `latest=3.4.0` 端点实测 · `time.3.4.0`=2026-10-15T07:09:13.832Z · tag `v3.4.0` ↔ `c4d027b` · 含手册命令示例钉 30 处 + README 迁移节钉版漂移 6 处修齐） |
| ⑤ ACCEPTANCE | `ACCEPTANCE_3_4_review_gates_dual_address_3_4_0_zh.md` 落盘（门禁基线已回填实测）· ACCEPTANCE_3_3_0 头栏补 published 回填注 |
| ⑥ spec 索引 | 3.4.0 行入表（pin-08 ok）· 3.3.0 行回填 published |
| ⑦ 手册 | 头栏钉 `spec-wave@3.4.0`（⑨ 回填后 = **已发布** · registry `latest=3.4.0`）· 基线行续写 · §2 事实行翻真 · 命令示例钉 3.3.0→3.4.0 共 30 处 · 变更表加行 |
| ⑧ RELEASING | 「最近一次发版」表 + 主题/验收行（3.4.0 → CLOSED 已 published）+ 3.3.0 checklist 标已完成（按实勾 · 00 代核）· 3.4.0 checklist **标已完成按实勾**（tag object `25a4686` · 探针 00 代核）· 改后全量 npm test 已跑（双重敏感遵守 · 含 DEF-001 T5 步骤⑥正则「CI…绿」首命中顺序假红修复：L13 措辞改 success） |
| ⑨ MIGRATION | 头栏包钉 3.4.0（⑨ 回填后 = 已发布 · `latest=3.4.0`）· 「3.3.0 → 3.4.0 无强制动作项」节在档 · 末尾变更表加行（簿记行 + published 回填行） |
| ⑩ 禁区 | 本棒**未**执行 tag/push/publish/deprecate · 未用 `npm version` · 逐文件显式 add（无 `-A`）· PR #36 行为零改动 |
| ⑪ 四门 | `typecheck` 0 错 · `npm test` **1003 · 1000 pass + 2 tag-gated 设计红**（`release-tag-identity` / `pins-consistency` A 组 pin-10 · F-REL-06 登记 · 非产品回归）+ 1 skip · `build` exit 0 · `test:lib` **6/6** · `assets verify` **113/113**（rebuild ~3：ontology/discipline-coverage/host-adapt README）· `check-doc-links` PASS（S2 冻结基线 34 未动 · 新文件入库后复绿） |

**断言联改留痕**（F-REL-07）：7 个测试文件 `3.3.0`→`3.4.0` 字面钉随 bump 例行更新（cli-discipline-coverage / cli-docs-121 / cli-docs-122 / cli-p0 / cli-refresh-ide-blocks / cli-upgrade-compat / cli-validation · 含转义 `3\.3\.0` 双模式 · D28-1 断言改钉 `spec-wave 3.4.0`）+ README.md L399 Prompt「version pinned at 3.4.0」。历史标题与红测留证注释未动。

**结论**：①–⑪ 全 CLOSE · A1–A11 全 PASS。打 tag 后复跑实证：`pins check` **17/17** · `release-tag-identity` 转绿 · 全量测设计红清偿 · main CI（`4680965`）4/4 绿 · registry `latest=3.4.0`（端点实测 2026-10-15）。**task 可 close。**

---

### KPI（00）

Task_KPI%: 100（A1–A11 全 PASS · bump 3.4.0 + 3.3.0 ⑨ 清偿 + 3.4.0 ⑨ 回填全落 · 发布三动作边界守住（Agent 零 tag/push/publish/deprecate）· 打 tag 后 pins 17/17 · 全量测 1002 pass / 0 fail / 1 skip）

- rubric：`KPI_RUBRIC_v1_2`

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-10-15 | 10-task 初稿 · 00 代签过程闸（维护者授权「全部完成我来操作发版」）· 20 审 R1 PASS · blocking 0 |
| 2026-10-15 | 30 簿记 bump 3.4.0 全档（①–⑩）· PR [#38](https://github.com/Cyning12/SpecWave/pull/38) 合 main（`4680965`）· 人 tag `v3.4.0` + publish |
| 2026-10-15 | ⑨ 回填棒：全叙事翻 published（registry 端点实测 `latest=3.4.0` · `time.3.4.0`=2026-10-15T07:09:13.832Z）· ⑪/A11 勾 · **00 close** |
