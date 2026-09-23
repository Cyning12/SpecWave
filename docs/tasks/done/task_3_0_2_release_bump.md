# Task：3.0.2 release · 收尾 bump（3.0.1 → 3.0.2 · W1–W2 全 CLOSE 后发版准备 + 授权内 tag/push）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（均 2026-09-23 00 代签 · 授权真值：维护者本窗「授权00签收所有过程文档」· 依据 R1 审查 PASS · blocking 0）· 30/40 簿记闭环完成（①–⑨ + ⑪–⑫ · ⑩/A10 预勾归 00 按 HG-RELEASE-TAG-PUSH=approved 执行）· 2026-09-23 · **未发版 / 未 tag / 未 push / 未 publish**）  
> **wave**：release（3.0.2 patch · 收尾 bump · 同 3.0.1 / 2.4.2 先例 · **本版差异：tag/push 在 00 授权面内 · publish 仍仅人**）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_0_2_patch_v1_zh.md`](../../roadmap/PLAN_3_0_2_patch_v1_zh.md)（**HG-NEXT-PLAN=approved** · 2026-09-23 维护者签收 · 授权 00 代签过程文档闸 + **验收完成后 tag + push 代跑** · npm publish / deprecate 不在授权面）· **release 行** + **发布边界** + 硬约束 **7**（RELEASING 双重敏感）/ **9**（README 版本字面自律）/ **10**（tag/push 授权口径）  
> **范围主源**：PLAN release 波 + W1–W2 done tasks（摘要入 CHANGELOG）+ **3.0.1 发布回填缺**（人 2026-09-18 publish 后未回填 · registry `latest=3.0.1` · `time.3.0.1`=2026-09-18T07:42:30Z · tag `v3.0.1` ↔ `0e6d861` · 均 2026-09-23 实测）  
> **基线**：`spec-wave@3.0.1` published（npm `latest` = 3.0.1 · tag `v3.0.1`）· **W1 / W2 均已 CLOSE: PASS** · `package.json#version` 仍为 `3.0.1`  
> **发版纪律**：[`RELEASING.md`](../../../RELEASING.md)（本棒做 bump 簿记段 + 授权内 tag/push；**npm publish / deprecate 仅人**）  
> **Open Folder**：仓根 · **工作分支**：`task/specwave-3-0-2`（合入 `main` 为快进合并）  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A（同 3.0.1 / 2.4.x 先例）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-2-release-bump` |
| **test_strategy** | `required` |
| **test_strategy_note** | 无新产品行为故无「红测先行改实现」义务；四门（typecheck / test / build / test:lib）+ `pins check`（pin-10 tag-gated 设计红 · **本版 tag 由 00 代打后须复跑 17/17 转绿留证**）为验收硬条款；**RELEASING.md 双重敏感**（硬约束 7 · pin-07 落点 + 九步顺序测）改后必跑**全量** `npm test`；版本断言联改沿 3.0.1/2.4.2 先例（perl 双模式字面+转义 · 历史标题与红测留证注释保留） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `task/specwave-3-0-2`（波末快进合入 `main`） |
| **graph_delta** | `none` |
| **graph_delta_note** | 版本钉 bump 机械动作 + 过程档；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 发版簿记 bump，无编码规范/流程增量；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0.2 patch 发版系列；main 快进 + tag + push 由 00 按维护者 2026-09-23 授权代跑；publish 仅人 |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-23 维护者签收 PLAN_3_0_2（原话「授权00签收所有过程文档，进行此版本的升级，验收完成后进行tag + push，只需要等人来发版」） |
| HG-SPEC-SIGNOFF | N/A | — | 本版无独立 SPEC 夹（同 3.0.1 / 2.4.x 先例） |
| HG-TASK-DRAFT | approved | 20, 30 | 2026-09-23 00 代签 · 授权真值：维护者本窗「授权00签收所有过程文档」· task lint PASS · 10 invoke 已落 |
| HG-AUDIT-R1 | approved | 30 | 2026-09-23 00 代签 · 依据 [`task_3_0_2_release_bump_audit_R1_20260923.md`](../../harness/reviews/task_3_0_2_release_bump_audit_R1_20260923.md)（PASS · blocking 0 · publish 仅人硬边界） |
| HG-RELEASE-TAG-PUSH | approved | — | 3.0.2 tag + push 代跑闸 · 人 · 2026-09-23 本窗授权「验收完成后进行tag + push」· 限 `main` 快进 + annotated `v3.0.2` + 原子推 · **前置 = 验收全绿（含 pin-10 转绿路径）** · 不拦 30 簿记 |
| HG-RELEASE-PUBLISH | pending | — | 3.0.2 npm publish / deprecate · **仅人** · **不在 00 授权面** · 不拦 30 簿记 |

> **闸说明**：HG-RELEASE-TAG-PUSH / HG-RELEASE-PUBLISH 语义 = 发布动作，**不**把 `30` 写入 `blocks_hats`；30 可做 package.json/CHANGELOG/pins/ACCEPTANCE/RELEASING/手册钉等簿记。tag/push 由 00 在验收全绿后按授权执行；publish 仍仅人。

---

## 背景与目标

3.0.2 patch（PLAN）W1（tech-graph 词汇登记档补 `branches`/`triggers` · F-1①）与 W2（pins consumer 模式 · F-3/F-4）均 CLOSE: PASS 后，开 **release 波**：把工作树版本真值从 `3.0.1` 簿记到 `3.0.2`，交付到「**tag 已打 · main 已推 · publish 待人**」为止。

**附带清偿（3.0.1 回填缺）**：人 2026-09-18 publish 3.0.1 后未做 ⑨ 回填 —— CHANGELOG `[3.0.1]` 发布状态仍为「待发版」、spec 索引行仍为「待发版（planned）」、RELEASING「最近一次发版」表与人 checklist `3.0.1` 节仍为待执行、手册头栏仍为「待发版」。本波按 3.0.0 回填先例一并清偿（事实以 2026-09-23 `npm view` 实测为准 · 禁凭记忆）。

**完成态**：`package.json#version`=`3.0.2`；CHANGELOG 含 `## [3.0.2]` 节 + `[3.0.1]` 回填为已发布；`pins fix --yes` 对齐钉面；`docs/spec/README.md` 增 3.0.2 patch 索引行（pin-08 语义格位合格）；ACCEPTANCE_3_0_2 档落盘；RELEASING 台账 + 人 checklist 3.0.2 节齐备（3.0.1 节标记已完成）；手册头栏钉 `spec-wave@3.0.2`；MIGRATION「3.0.1 → 3.0.2 无动作项」核验在档（W2 已写则引用）；四门绿；**`main` 快进 + `git tag v3.0.2`（annotated）+ `pins check` 复跑 17/17 + `git push origin main v3.0.2` 原子推 + 探针代核**；**未**执行 npm publish / deprecate。

---

## 范围

严格对齐 PLAN **release 行** + **发布边界**（不得改 W1–W2 已交付行为 · 不得触 schema）。

- [x] **① bump 真值源**：`package.json#version` `3.0.1` → `3.0.2`（**唯一手工版本改动点** · **不用** `npm version` 防顺手 tag）；`package-lock.json` 同步
- [x] **② CHANGELOG**（**顺序硬约束 · 先于 pins fix** · 同 3.0.1 先例 · 防 pin-13 回写历史头）
  - 新增 `## [3.0.2] - 2026-09-23`：主题行（消费侧反馈收口 patch · PLAN 链接 · 无独立 SPEC 夹）+ **Fixed**（W1：登记档补 `branches`/`triggers` 清零不可行动告警）+ **Added**（W2：`pins check/fix --consumer` · 真值源回退链 · `--truth` · `.spec-wave/pins-consumer.yaml` · 内置 CI workflow 字面钉面）+ **发布状态行**：「**待发版（publish 仅人）**（bump 已落 · tag `v3.0.2` 由 00 按授权代打并随 main 原子推 · registry `latest` 仍为 `3.0.1` 直至人 publish · pin-10 打 tag 前设计红）」
  - **回填 `[3.0.1]` 发布状态行** → 已发布（人 2026-09-18 publish · registry `latest=3.0.1` · `time.3.0.1`=2026-09-18T07:42:30Z · tag `v3.0.1` ↔ `0e6d861` · 回填由 00 代核 · 2026-09-23）
  - Unreleased 仅留空壳
- [x] **③ `pins fix --yes`**：先 `pins check` 观察偏差 → `node bin/specgate.js pins fix --yes` 对齐钉面 → 复跑；**打 tag 前唯一可接受偏差** = pin-10 git tag `v3.0.2` 缺失（**设计红** · 00 代打 tag 后须 17/17）
- [x] **④ 叙事漂移巡检**（3.0.1 经验）：机械替换造成的假叙事改回真值；pins 未钉的现行版引用与测试版本断言联改留痕（perl 双模式 · 历史标题/红测留证注释保留）；**3.0.1 回填一律用 registry 实测事实 · 不冒充、不漏填**
- [x] **⑤ ACCEPTANCE 档**：新建 `docs/roadmap/ACCEPTANCE_3_0_2_patch_3_0_2_zh.md`（W1–W2 台账摘要 + release 门禁基线 + pin-10 设计红登记与清偿记录 + 发布边界「tag 已打 · publish 待人」· 结构参照 [`ACCEPTANCE_3_0_1_patch_3_0_1_zh.md`](../../roadmap/ACCEPTANCE_3_0_1_patch_3_0_1_zh.md)）；ACCEPTANCE_3_0_1 档补一行回填注（已发布事实）
- [x] **⑥ spec 索引行**：`docs/spec/README.md` 增 `` `3.0.2`（patch 收尾行） `` 行（slug 含 `3.0.2` · 状态格含边界点式 `3.0.2` + 发布态措辞 · pin-08 语义格位口径）· **回填 3.0.1 行**状态「待发版（planned）→ published」（保行形态其余不动）
  - **行文本已预验证（10-task 棒 · /tmp pin-08 探针 PASS · 2026-09-23）**：30 直接用以下两行文本（3.0.2 新行插于 3.0.1 行后 · 3.0.1 行仅替换状态格片段）：
    - 3.0.2 新行：`| `3.0.2`（patch 收尾行） | —（无独立 SPEC 夹） | **signed** · **`3.0.2` 待发版（planned）**（publish 仅人 · tag `v3.0.2` 由 00 按授权代打）· 属 3.0.1 后消费侧反馈 patch（task `3-0-2-release-bump`）· 归档 [`../roadmap/ACCEPTANCE_3_0_2_patch_3_0_2_zh.md`](../roadmap/ACCEPTANCE_3_0_2_patch_3_0_2_zh.md) | 3.0.2 · patch：W1 tech-graph 词汇登记档补 branches/triggers（F-1① · ops-desk 反馈）· W2 pins consumer 模式（F-3/F-4 · `--consumer` 旗标 + 真值回退链 + `--truth` + `.spec-wave/pins-consumer.yaml`）；规划 [`../roadmap/PLAN_3_0_2_patch_v1_zh.md`](../roadmap/PLAN_3_0_2_patch_v1_zh.md) |`
    - 3.0.1 行替换片段：`**`3.0.1` 待发版（planned）**` → `**`3.0.1` published**（2026-09-18 人 publish · registry `latest=3.0.1` · `time.3.0.1`=2026-09-18T07:42:30Z · tag `v3.0.1` ↔ `0e6d861` · 00 代核回填 2026-09-23）`
- [x] **⑦ 使用手册版本钉同步**（[`docs/guides/使用手册-v3.0.0-zh.md`](../../guides/使用手册-v3.0.0-zh.md) · 沿 3.0.1「保留文件名」策略）
  - 头栏「版本 / 适用包」钉为 `spec-wave@3.0.2`（**待发版 · publish 待人** · tag `v3.0.2` 00 代打）；手册基线行续写「3.0.2 patch 差异见 CHANGELOG `[3.0.2]` / MIGRATION『无强制动作项』」
  - 文内**现行钉** `npx spec-wave@3.0.1 …` 等示例改 `@3.0.2`（历史对照句可保留）；章 2「安装与版本确认」叙事按「registry latest 仍 3.0.1 直至人 publish」写真值
  - **禁止**把待发版写成已 published
- [x] **⑧ RELEASING 台账 + 人 checklist**【**双重敏感** · 硬约束 7】
  - 「最近一次发版」表：工作树/latest 行写 `3.0.2` bump 已落 · tag 00 代打 · publish 待人（registry `latest` 真值 `3.0.1`）；**3.0.1 行下沉为「前一 latest（已 published）」**并补实测事实（tag ↔ `0e6d861` · `time.3.0.1`）；主题行换 3.0.2 摘要；验收台账增 3.0.2 行
  - `### 人 checklist · 3.0.1 发版` 节标记**已完成**（人 2026-09-18 执行 tag/push/publish · 探针 00 代核 2026-09-23 · registry 实测）· 勾选框按实勾
  - 新增 `### 人 checklist · 3.0.2 发版` 节：tag/push 项**预勾**（00 按授权代跑 · 留 commit/tag 哈希回填位）· publish 及其后项全未勾（仅人）
  - 改后**必跑全量** `npm test`
- [x] **⑨ MIGRATION 核验**：`MIGRATION.md` 已有「3.0.1 → 3.0.2 无动作项 + consumer pins 可选启用」（W2 范围⑦已写）；本波仅核验在档且措辞不暗示 breaking · 缺则补
- [x] **⑩ 授权内 tag/push（00 代跑 · HG-RELEASE-TAG-PUSH=approved）**【**预勾 · 归 00 按授权执行 · 簿记棒未执行 · 证据（tag hash · pins 17/17 · ls-remote）由 00 回填**】
  - 前置断言：W1/W2/release 全部 commit 落 `task/specwave-3-0-2` · 四门绿 · pins 打 tag 前偏差**仅 pin-10**
  - `git checkout main && git merge --ff-only task/specwave-3-0-2`（快进 · 无 merge commit）
  - `git tag -a v3.0.2 -m 'spec-wave 3.0.2（消费侧反馈收口 patch · W1 vocab 登记 · W2 pins consumer · publish 仅人）'`
  - `node bin/specgate.js pins check` 复跑 ⇒ **17/17**（pin-10 设计红清偿）· 全量 `npm test` 复跑全绿（tag-gated 红转绿留证）
  - `git push origin main v3.0.2`（**原子推**单条 · 禁「先 main 后 tag」竞态 · 沿 2.4.2 授权代跑先例）
  - 探针代核：`git show v3.0.2:package.json` → `version=3.0.2`；`npm view spec-wave version`（绕缓存）→ 仍 `3.0.1`（publish 待人 · 真值写照）；`git ls-remote origin main v3.0.2` 与本地一致
- [x] **⑪ 四门 + 关账**：波末 `gate-check` → `task close --yes`；提交约定：簿记 `chore(release): bump to 3.0.2`（独立 · 逐文件显式 add）· 回填如与簿记同批须在同 commit 信息内分列

## 非范围

| 项 | 理由 |
|----|------|
| `npm publish` / `npm deprecate` | **仅人**（HG-RELEASE-PUBLISH · 不在授权面） |
| 3.0.2「已 published」叙事回填 | 待人 publish 后 ⑨ 回填（避免冒充已发布） |
| 改 W1–W2 已交付行为 / 返修实现 | 每波一 task 已 CLOSE · release 只簿记 |
| 触 host-adapt schema / 改判定语义松紧 | PLAN 硬约束 3 · 触即 STOP |
| 覆写 S2 过程域既有档 | 硬约束 1 · 只新增（3.0.1 回填为既有档**事实订正** · 非覆写过程留痕） |
| `npm version`（会顺手造 tag） | 禁 · 唯一手工改 `package.json#version` |
| 非快进合入 / merge commit / rebase 历史 | 发布卫生 · `--ff-only` 机械拦 |
| `--force` / `--allow-*` / `git add -A` / force push | 禁令 |
| `eval/specwave-external-benchmark` 分支 wip 档 | 已独立保全 · 不入本版（PLAN 风险 7） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改簿记（F-REL-00） | 30 **拒开工**（verify 机械拦 exit 2） | 是（20 审 + 00 签后） | 是 |
| 越权 npm publish / deprecate（F-REL-01） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟域外档（F-REL-02） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| pins fix 先于 CHANGELOG `## [3.0.2]` 节落盘（F-REL-03） | pin-13 可能回写历史头 · 验收 FAIL | 是（还原 · 按序重做） | — |
| 叙事漂移未巡检（假「已 published」入库 · 含 3.0.2 与手册）（F-REL-04） | 验收 FAIL · 打回 | 是 | 是 |
| RELEASING 改动后未跑全量 npm test（F-REL-05 · 双重敏感） | 验收 FAIL · 补跑 | 是 | — |
| 打 tag 前 pins 偏差非「仅 pin-10」（F-REL-06） | 验收 FAIL · 修漏网钉面 | 是 | 是 |
| tag 后未复跑 17/17 即 push（F-REL-07） | 授权前置未满足 · 打回 | 是 | 是 |
| 断言联改漏网（转义 `3\.0\.1`）（F-REL-08） | npm test 红 · perl 双模式补齐 | 是 | — |
| 四门任一意外红（F-REL-09） | 停止 · 先修 | 是 | 是 |
| 顺手改 W1–W2 行为 / 触 schema（F-REL-10） | 打回或 **STOP** 上报 | — | 是 |
| 3.0.1 回填事实凭记忆失准（F-REL-11） | 验收 FAIL · 以 `npm view` 实测重钉 | 是 | 是 |
| 非快进合入 / 产生 merge commit（F-REL-12） | `--ff-only` 机械拦 · 打回整理 | 是 | — |
| 先 push main 后 push tag 竞态（F-REL-13） | 违原子推规则 · 打回（未推则重组单条推） | 是 | — |
| spec 索引行不合格位（状态格缺边界点式串或发布态措辞）（F-REL-14） | pin-08 红 · 打回修正行形态 | 是 | 是 |
| 用 `npm version` 顺手造 tag（F-REL-15） | 违范围 · 打回 | 是 | — |

---

## 验收标准

- [x] **A1 bump 单点**：`package.json#version`=`3.0.2`（唯一手工版本改动 + lock 同步 · 无 `npm version` 痕迹）
- [x] **A2 CHANGELOG**：`[3.0.2]` 节齐（主题/Fixed/Added/发布状态「待发版 · publish 仅人」）· `[3.0.1]` 回填已发布（registry 实测事实 · 含 `time.3.0.1` 与 tag ↔ `0e6d861`）
- [x] **A3 pins 两阶段**：打 tag 前偏差仅 pin-10（设计红留痕）· 00 代打 tag 后复跑 **17/17 PASS**（清偿记录入 ACCEPTANCE）
- [x] **A4 叙事真值**：全仓 grep 无「3.0.2 已 published」假叙事 · 手册/RELEASING/CHANGELOG/spec 索引行的 registry latest 均写 `3.0.1`（直至人 publish）
- [x] **A5 ACCEPTANCE 档**：`ACCEPTANCE_3_0_2_patch_3_0_2_zh.md` 落盘（含 W1–W2 台账 + 门禁基线 + pin-10 清偿 + 发布边界）· ACCEPTANCE_3_0_1 补回填注
- [x] **A6 spec 索引**：3.0.2 patch 行入表（pin-08 语义格位合格 · `pins check` pin-08 ok）· 3.0.1 行状态已回填 published
- [x] **A7 手册钉**：头栏 `spec-wave@3.0.2`（待发版 · publish 待人）· 文内现行示例 `@3.0.2` · 无「已 published」
- [x] **A8 RELEASING**：台账三处更新（latest 行 / 3.0.1 下沉行 / 主题与验收行）· 3.0.1 checklist 标已完成 · 3.0.2 checklist tag/push 预勾 publish 未勾 · 改后全量 npm test 绿
- [x] **A9 MIGRATION**：「3.0.1 → 3.0.2 无动作项 + consumer pins 可选启用」在档 · 不暗示 breaking
- [x] **A10 tag/push 代跑**【**预勾 · 归 00 执行 · 证据由 00 回填**】：`main` 快进（`--ff-only`）· annotated `v3.0.2` · 原子推单条 · 探针三项代核留证（`git show v3.0.2:package.json` · `npm view` 仍 3.0.1 · `git ls-remote` 一致）
- [x] **A11 四门**：typecheck · test（tag 后全绿）· build · test:lib
- [x] **A12 关账**：`gate-check` exit 0 + `task close --yes` · 提交逐文件显式 add · **未**执行 publish / deprecate

---

## 给执行帽的必读列表

1. [`docs/roadmap/PLAN_3_0_2_patch_v1_zh.md`](../../roadmap/PLAN_3_0_2_patch_v1_zh.md) — release 行 · 发布边界 · 硬约束 7/9/10 · 风险 5/6
2. 先例 [`docs/tasks/done/task_3_0_1_release_bump.md`](../done/task_3_0_1_release_bump.md)（release 波全套动作模板 · 本 task 与其差异 = tag/push 授权 + 3.0.1 回填清偿）
3. W1/W2 done tasks（CHANGELOG 摘要素材 · close 后路径 `docs/tasks/done/`）
4. `RELEASING.md` 全文（九步 · 台账 · checklist 体例）
5. `docs/spec/README.md` 3.0.1 行（patch 收尾行形态模板 · pin-08 语义格位）
6. `docs/standards/` 涉文 L2（30 自裁引用）

---

## 思考轮

### R0 · 证据

PLAN_3_0_2 已 HG-NEXT-PLAN=approved（含 tag/push 授权原话）；W1/W2 CLOSE: PASS；3.0.1 回填缺口实钉（CHANGELOG/spec 索引/RELEASING/手册四处「待发版」滞留 · registry `latest=3.0.1` · `time.3.0.1`=2026-09-18T07:42:30Z · tag `v3.0.1` ↔ `0e6d861` 均 2026-09-23 `npm view`/git 实测）。

### R1 · 范围

仅 release 波：bump · CHANGELOG（含 3.0.1 回填）· pins fix · 叙事巡检 · ACCEPTANCE · spec 索引行 · 手册钉 · RELEASING 台账与双 checklist · MIGRATION 核验 · 授权内 tag/push · 关账。排除：publish/deprecate · 3.0.2 已发布回填 · 改 W1–W2 行为 · schema。

### R2 · 方案

沿 3.0.1 release task 全套动作模板，三处差异定案：① tag/push 由 00 代跑（授权 · 原子推 · 前置 = 验收全绿 + pin-10 转绿复跑）；② 3.0.1 回填清偿并入本波（独立子项 · 事实全实测）；③ 发布状态口径统一为「待发版（publish 仅人）」（tag/push 已授权代跑 · 不冒充 published）。

### R3 · 边界

publish 仅人是硬边界；快进合并是硬边界；3.0.1 回填为事实订正非覆写 S2 留痕；发现需改产品行为才能簿记 ⇒ STOP 上报。

### R4 · 可测性

A1–A12 全机检（grep 叙事 · pins 两阶段 · 索引行 pin-08 · 探针三命令 · 四门）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核；HG-TASK-DRAFT / HG-AUDIT-R1 待 00 代签；HG-RELEASE-TAG-PUSH 已 approved（授权原文在闸表）。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 回填缺口与 registry 事实钉齐 | no |
| R1 | 仅 release 波 · publish 冻结 | no |
| R2 | 模板沿用 + 三差异定案 | no |
| R3 | publish 仅人 / 快进 / 回填性质三硬边界 | no |
| R4 | A1–A12 全机检 | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① 回填事实凭记忆（F-REL-11 · 全部 `npm view`/git 实测重钉）；② tag/push 前置未满足即推（F-REL-07/13 · 前置断言清单 + 原子推单条）；③ 手册/台账「待发版」措辞误写已发布（F-REL-04 · A4 grep）；④ spec 索引行格位不合格（F-REL-14 · A6 pin-08 机检）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 无新产品行为，无红测先行义务；四门 + pins 两阶段（打 tag 前仅 pin-10 设计红 · 代打 tag 后 17/17）+ 全量 npm test（RELEASING 双重敏感）+ 探针三命令代核为硬条款。

---

## 提交信息约定

- 簿记提交：`chore(release): bump to 3.0.2（W1 vocab 登记 · W2 pins consumer · 3.0.1 回填清偿）`
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟** `eval/external-oracle/` 未跟踪档 · `eval/` 分支 wip 档
- **tag/push**：仅按范围⑩授权口径（annotated · 原子推 · 前置断言）· **禁 npm publish / deprecate**
- 波末跑 `node bin/specgate.js gate-check --task docs/tasks/active/task_3_0_2_release_bump.md`

---

### 自检结论（执行者）

**帽**：30 簿记 + 40 自证（同棒 · 接棒 fork · 唯一执行体）· **日期**：2026-09-23 · **未发版 / 未 tag / 未 push / 未 publish**（⑩ 归 00 按 HG-RELEASE-TAG-PUSH 执行）

#### GATE_VERIFY

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_2_release_bump.md
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_2_release_bump.md
```

#### 簿记要点（①–⑨）

- **① bump**：package.json + package-lock.json ×2（唯一手工版本点 · 未用 npm version）
- **② CHANGELOG**（先于 pins fix）：`[3.0.2]` 节（主题/Fixed W1/Added W2/发布状态「待发版 · publish 仅人」）· `[3.0.1]` 回填已发布（registry 实测 `time.3.0.1` · tag ↔ `0e6d861`）
- **③ pins**：check 11 偏差 → fix --yes 写 9 处 → 复跑**仅 pin-10**（设计红 · 第一阶段判据达成）
- **④ 叙事巡检**：假「3.0.2 已 published」grep 零命中；README 双语 :406 现行包行/迁移节钉版、测试断言联改 8 档（cli-p0/cli-upgrade-compat/cli-refresh-ide-blocks/cli-validation/cli-docs-121/cli-docs-122/cli-discipline-coverage/docs-releasing · 历史波名与留证注释保留）· docs-releasing 步骤④正则题面精确化（台账正当命令名 `pins check` 误中宽正则致顺序假红 · 断言联改留痕）
- **⑤ ACCEPTANCE**：3.0.2 档落盘（W1–W2 台账 + 门禁基线 + pin-10 登记与清偿路径 + 发布边界 + 3.0.1 回填清偿清单）· 3.0.1 档补回填注
- **⑥ spec 索引**：预验证行文本逐字入表（pin-08 ok）· 3.0.1 行回填 published
- **⑦ 手册**：头栏 spec-wave@3.0.2（待发版 · publish 待人 · tag 00 代打）· 文内现行示例 @3.0.2（blanket + 修订表 3.0.1 史实行还原 + 新行）· 章 2 registry 真值 3.0.1
- **⑧ RELEASING**：latest 行 / 3.0.1 下沉行 / 主题行 ×2 / 验收台账行 ×2 · 人 checklist 3.0.1 节标已完成按实勾选 · 新增 3.0.2 节（tag/push 预勾留 hash 回填位 · publish 未勾 · 含 npm 缓存 EPERM 提醒）· 改后全量 npm test 跑过（双重敏感）
- **⑨ MIGRATION**：「3.0.1 → 3.0.2 无动作项」在档核验（W2 段7 已写 :169 · 不暗示 breaking）

#### 验收勾选

- [x] A1 bump 单点（package.json + lock ×2）
- [x] A2 CHANGELOG 双面（[3.0.2] 齐 · [3.0.1] 回填实测）
- [x] A3 pins 两阶段（打 tag 前仅 pin-10 设计红 · 17/17 清偿归 00 回填）
- [x] A4 叙事真值（假 published 零命中 · registry latest 一律 3.0.1）
- [x] A5 ACCEPTANCE 双档
- [x] A6 spec 索引（pin-08 机检合格）
- [x] A7 手册钉
- [x] A8 RELEASING（台账 + 双 checklist · 改后全量 npm test）
- [x] A9 MIGRATION 在档
- [x] A10 tag/push【预勾 · 归 00 执行 · 证据回填】
- [x] A11 四门：typecheck 0 · **npm test 929 · 打 tag 前 926 pass + 2 设计红 + 1 skip · 0 产品回归** · build 0 · test:lib 6/6
- [x] A12 关账（gate-check + close · 逐文件显式 add · 未 publish/deprecate）

#### invoke

`docs/harness/invokes/by-task/3-0-2-release-bump/invoke_20260923_30_40_3-0-2-release-bump.md`

Wiki: none（发版簿记 · 无规范增量）

### 经验总结（执行者）

- pins fix 的版本字面机械替换只覆盖 `spec-wave@X.Y.Z` 形态：README 另有 `pin `3.0.1`` / `pinned at 3.0.1` / `version pinned at 3.0.1` 散形态与 :406 现行包叙事行，须靠叙事巡检逐个改回真值（本波双语各 4 处 + :406 假叙事拼接行）。
- 测试断言联改的分类判据：断言现行包版本（manifest/pkg/pack filename/as_of）必翻；历史波名 describe、留证注释、fixture 旧版（1.2.0/2.24.0/3.24.0/3.9.0/99.0.0）必留；**blanket 替换后须回扫修订表等史实行被误翻**（手册 2026-09-18 初版行 spec-wave@3.0.1 → 被 blanket 误翻 3.0.2 · 已还原）。
- 元守卫测试的宽正则会与正当文档演进打架（docs-releasing 步骤④ /版本钉|pins/ 被台账 `pins check` 命令名误中）：断言联改应把元守卫钉到步骤题面而非禁止文档出现命令名。
- check-doc-links 的 done/ 任务链接须「先 stage 新档 → 关账 mv → 再 stage → 复跑」两段走（同 W1 经验 · 本波实测两段均复绿）。

### KPI（30/40）

Task_KPI%: 96（①–⑨ + ⑪–⑫ 全绿 · pins 两阶段第一阶段仅 pin-10 · 假叙事零命中 · 四门打 tag 前 926+2 设计红+1 skip · 3.0.1 回填全实测；⑩ 归 00 预勾回填 · 待 00 tag/push 后 17/17 与探针证据补齐即满）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同棒闭环（接棒 fork 唯一执行体）

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-23 | 初稿 · 10-task（PLAN release 行 · 沿 3.0.1 release 模板 + 三差异：tag/push 授权代跑 · 3.0.1 回填清偿 · 发布口径「publish 仅人」）· 状态 draft · HG-TASK-DRAFT/HG-AUDIT-R1=pending · HG-RELEASE-TAG-PUSH=approved（授权原文在闸表）· HG-RELEASE-PUBLISH=pending（仅人）· registry 事实 2026-09-23 `npm view` 实测（`latest=3.0.1` · `time.3.0.1`=2026-09-18T07:42:30Z）· `v3.0.1` ↔ `0e6d861` git 实测 · 闸表 4 列且 id 单元格无内嵌粗体 |
| 2026-09-23 | **00 代签**：HG-TASK-DRAFT + HG-AUDIT-R1 → approved · R1 PASS · blocking 0 |
| 2026-09-23 | **30/40（接棒 fork）**：①–⑨ 簿记全落 + ⑪ 四门（929 · 926+2 设计红+1 skip · 0 产品回归）+ ⑫ 关账 · pins 打 tag 前仅 pin-10 · 叙事巡检零假 published · 3.0.1 回填全实测 · ⑩/A10 预勾归 00（HG-RELEASE-TAG-PUSH=approved）· 未 tag/push/publish |
