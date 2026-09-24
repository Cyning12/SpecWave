# Task：3.0.2 post-publish DX · 发版回填 + README 上手摩擦（P0+P1）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · HG-GH-RELEASE=approved · 2026-09-24 · 人「签收」· 00 代签落表 · 30 交付 · 40 关账）   


> **wave**：post-publish DX（docs + GitHub Release notes · **无** src 产品逻辑变更）  
> **上游**：无独立 SPEC / PLAN 夹（摩擦清偿 · 同 2.3.1 / 3.0.2 patch 先例 · **HG-SPEC-SIGNOFF=N/A**）  
> **基线（用户给定已核实 · 30 仍须重钉）**：`npm view spec-wave dist-tags` → `latest: 3.0.2`（**已 published**）· GitHub Releases 页 length **0**（存在 tag `v3.0.0`/`v3.0.1`/`v3.0.2`）· `package.json#engines.node` = `^22.19.0 || >=24.0.0`  
> **发版纪律**：[`RELEASING.md`](../../../RELEASING.md) ⑨ 回填口径（**本波做已 published 真值回填** · **不**再 publish）  
> **Open Folder**：仓根 · **工作分支**：`main`（或维护者指定 `task/*`）  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-2-postpublish-dx` |
| **test_strategy** | `recommended` |
| **test_strategy_note** | 无 src 产品逻辑变更 → 无「红测先行改实现」义务；验收以文档断言 / `npm view`·`gh` 探针 / grep 叙事巡检为主。改 `RELEASING.md` 触发**双重敏感**（须全量 `npm test`）。若 20/30 扩范围改 `init` quickstart 打印 → **须升** `required` 并补 init 文本断言（本草稿默认不改 src） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main`（或维护者指定） |
| **graph_delta** | `none` |
| **graph_delta_note** | 文档/Release 面；不改图谱 yaml/compile 资产（`docs/_tech_graph/02_version.md` 滞后另案 · 见非范围） |
| **wiki_delta** | `none` |
| **wiki_delta_note** | DX / 发版回填文案；无编码规范晋升 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 post-publish DX；合入由维护者（同 2.3.1 / 3.0.2 release 先例） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | N/A | — | 本波无新 SPEC 夹（同 2.3.1 / 3.0.2 patch 先例） |
| HG-TASK-DRAFT | **approved** | ~~20, 30~~ | 人 · 2026-09-24 本窗「签收」· 00 代签落表 |
| HG-AUDIT-R1 | **approved** | ~~30~~ | 人 · 2026-09-24 本窗「签收」· 00 代签落表 · 20 R1 PASS（`docs/harness/reviews/task_3_0_2_postpublish_dx_audit_R1_20260924.md`） |
| HG-GH-RELEASE | **approved** | — | 人 · 2026-09-24 本窗「签收」· 00 代签落表 · 授权 `gh release create` 至少 `v3.0.2`（建议同波 `v3.0.0`/`v3.0.1`）· **不拦** 30 文档 |
| HG-RELEASE-PUBLISH | N/A | — | registry `latest=3.0.2` **已 published** · 本波**禁止**再 `npm publish` / `npm deprecate` |

> **闸说明**：`HG-RELEASE-PUBLISH` 不适用（已发版）。`HG-GH-RELEASE` 语义 = Releases 页补建动作，**不**把 `30` 写入 `blocks_hats`；30 可先做 docs 回填与 README 收敛；Release 创建待闸签后执行。

---

## 背景与目标

`spec-wave@3.0.2` **已 npm publish**（registry `latest=3.0.2`），但对外/台账仍大量写「待发版 · registry latest 仍 3.0.1」——与 3.0.2 release-bump 波「publish 仅人」预备口径冲突，形成**假叙事摩擦**。同时：双语 README 首屏无醒目 Node Prerequisites（engines 已钉 `^22.19.0 \|\| >=24.0.0` · 本机 Node 20 会踩坑）；首屏塞满多宿主百科与 Entry A·B 全命令；GitHub Releases 页为空（有 tag 无 Release）。

**完成态**：对外真值一律「`3.0.2` **已 published**」（含实测 `time` / dist-tags / tag tip）；README 双语顶部醒目 Prerequisites + 最小上手路径（3–5 步）+「空仓复制模板后 `test_strategy=required` 如何最小可绿」样例（**仅文档/模板指引 · 禁物化进消费者 `docs/tasks/`**）；至少 `v3.0.2` GitHub Release 存在（notes 指向 CHANGELOG `[3.0.2]`）；工作树既有 `RELEASING.md` 排版-only dirty **不得**冒充完成。

---

## 拆分裁决（10）

**单 task 覆盖 P0+P1**（不拆波）。理由：① 同属 post-publish 对外摩擦 · 无新产品逻辑；② README 收敛与发布态回填同碰双语入口 · 拆波会双倍闸签；③ `HG-GH-RELEASE` 已把 Release 动作与文档回填解耦。若 20 审认定 README 大改与回填风险过高，可建议拆 `*-docs` / `*-gh-release`——**默认不拆**。

---

## 范围

### P0

- [x] **① 发版文案回填为已 published**（事实一律 `npm view` / `git` / `gh` **重钉** · 禁凭记忆；用户给定 `latest=3.0.2` 为开工假设 · 30 须复测写入）
  - `RELEASING.md`：「最近一次发版」表 · 验收行 · `### 人 checklist · 3.0.2 发版`（publish / 探针 / ⑨ 回填项按实勾选并留实测字段）——**【双重敏感 · 改后全量 `npm test`】**
  - **Dirty 纪律**：工作树已有未提交 `RELEASING.md` 改动（多为表格排版 · **内容仍写 pending**）——30 **以「回填已 published 真值」为准**；**勿**把排版-only dirty 当完成；可在同一实质回填 diff 内顺带收排版，但验收勾选看**发布态措辞与 checklist 真值**，不看 diff 行数
  - `docs/roadmap/ACCEPTANCE_3_0_2_patch_3_0_2_zh.md`：头部与发布边界从「待发版 / latest=3.0.1」→ **已 published**
  - `CHANGELOG.md`：`## [3.0.2]` **发布状态行** → 已发布（含 registry / `time.3.0.2` / tag tip 实测）
  - `docs/guides/使用手册-v3.0.0-zh.md`：头栏 + 章 2「待发版 / latest 仍 3.0.1」叙事 → 已发布真值（保留文件名策略不变）
  - `docs/spec/README.md`：`3.0.2` 索引行状态格 `待发版（planned）` → **published**（pin-08 语义格位合格）
  - `README.md` / `README.zh-CN.md`：文末「Current package / 现行包」行 pending → published
  - 全仓叙事巡检：现行对外面无「`3.0.2` 待发版 / pending release / registry latest 仍 `3.0.1`」假叙事（历史 changelog 节 / done task 留痕除外 · 30 自裁白名单并入自检）
- [x] **② Node Prerequisites 进上手区**：`README.md` + `README.zh-CN.md` **顶部醒目** Prerequisites（Node **22.19+** / **24+** · 对齐 `package.json#engines` · 明示 Node 20 会踩坑）；双语对齐非机翻
- [x] **③ GitHub Releases**：为至少 **`v3.0.2`** 建 Release（`gh release create` · notes 建议指向 `CHANGELOG.md` `[3.0.2]` 节）；**建议同波**回填 `v3.0.0` / `v3.0.1`（tags 已在 · notes 各指对应 CHANGELOG 节 · 同属 `HG-GH-RELEASE`）；**不**新建 tag · **不**改 tag tip

### P1

- [x] **④ README 首屏收敛 + 最小可绿样例**
  - 首屏结构建议：品牌一句 → **Prerequisites** → **最小上手 3–5 步**（validate/apply 或 init 最短路径 · 链详章）→ 链「核心对象」/ GLOSSARY；**多宿主全表 / Entry 全命令百科 / 迁移 / 发版**下沉到后文章节或既有链接
  - 补「空仓：复制 `TASK_TEMPLATE` 后默认 `test_strategy=required` 时如何最小可绿」样例（步骤级指引 · 指向模板路径 · **禁止**物化示例 task 进消费者 `docs/tasks/` · **S2 红线**）
  - 历史改名（SpecGate / `dsh-coding-kit`）**降噪**：首屏至多一行脚注或链 `MIGRATION.md`，勿喧宾

### 可选（本波默认可做 · 非硬勾）

- [ ] 若 Prerequisites 与 `init` quickstart 打印明显冲突 → **单列变更单**评估后改 `INIT_QUICKSTART`（升 `test_strategy=required` + init 文本断言）——**默认不做**（见非范围）

---

## 非范围

| 项 | 理由 |
|----|------|
| `npm publish` / `npm deprecate` | 已 published · Agent 禁令 · HG-RELEASE-PUBLISH=N/A |
| 改 `src/` 产品逻辑 / host-adapt schema / 闸语义 | 本波 docs + Release · 无行为变更目标 |
| 默认改 `init` quickstart / `INIT_QUICKSTART` | 非必须；扩则另评估测 · 见可选 |
| 物化示例 task 进消费者 `docs/tasks/` | **S2 红线**（同 2.2 W4） |
| 新建 git tag / 改写既有 tag | Release 只挂已有 tag |
| 回填早于 `v3.0.0` 的 GitHub Release | 成本/收益低 · 非本波摩擦焦点 |
| `docs/_tech_graph/02_version.md` 全量追时间线 | 仍停在 1.12.x · 属独立图谱卫生波 |
| 把工作树 `RELEASING.md` 排版-only dirty 当完成 | 验收看发布态真值 |
| 改 README「实质产品承诺」超 DX（新功能宣传） | 只收敛结构 + 真值 + Prerequisites |
| S2 过程域当 host 物化 target | AGENTS.md local 禁区 |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改文档（F-PP-00） | 30 **拒开工**（verify 机械拦） | 是（20 审 + 人签后） | 是 |
| 越权 `npm publish` / `deprecate`（F-PP-01） | 违禁令 · 打回 | — | 是 |
| HG-GH-RELEASE=pending 即 `gh release create`（F-PP-02） | 拒执行 · 停待人签 | 是 | 是 |
| 回填事实凭记忆 / 与 `npm view` 冲突（F-PP-03） | 验收 FAIL · 以探针重钉 | 是 | 是 |
| 把 RELEASING 排版-only dirty 当完成（F-PP-04） | 验收 FAIL · 须发布态真值改写 | 是 | — |
| RELEASING 改后未跑全量 `npm test`（F-PP-05 · 双重敏感） | 验收 FAIL · 补跑 | 是 | — |
| 物化示例进消费者 `docs/tasks/`（F-PP-06 · S2） | 越红线 · 打回 | — | 是 |
| 双语 README Prerequisites / 上手路径漂移（F-PP-07） | 验收 FAIL · 对齐 | 是 | 是 |
| 首屏仍喧宾改名史 / 全宿主百科未下沉（F-PP-08） | 验收 FAIL · 再收敛 | 是 | 是 |
| Release notes 无 CHANGELOG 指向或挂错 tag（F-PP-09） | 验收 FAIL · 修 notes / 重建 | 是 | 是 |
| 顺手改 src / schema（F-PP-10） | 打回或 STOP | — | 是 |
| `git add -A` 裹挟域外档（F-PP-11） | 打回 · 逐文件显式 add | 是 | — |
| 假叙事漏网（现行面仍写 3.0.2 待发版）（F-PP-12） | grep 巡检红 · 打回 | 是 | 是 |

---

## 验收标准

（分组仅作文内标签 · **勿**在本节下开 `###` 子标题——lint `extractSection(..., '\\n##')` 会误截 `###`）

- [x] **A1 RELEASING**（P0 回填）：台账 latest 行 / 验收行 / `3.0.2` 人 checklist 反映 **已 published**（含探针字段）· **非**仅排版；改后全量 `npm test` 绿
- [x] **A2 ACCEPTANCE_3_0_2**（P0 回填）：头部与发布边界为已 published（registry `latest=3.0.2` 实测）
- [x] **A3 CHANGELOG**（P0 回填）：`[3.0.2]` 发布状态行为已发布（含 `time` / tag 实测）
- [x] **A4 手册头栏**（P0 回填）：`使用手册-v3.0.0-zh.md` 无「待发版 / latest 仍 3.0.1」现行叙事
- [x] **A5 spec 索引**（P0 回填）：`docs/spec/README.md` `3.0.2` 行状态 **published**（pin-08 合格 · `pins check` 相关钉不红）
- [x] **A6 README 现行包行**（P0 回填）：双语文末 / 现行包行为 published · 与 registry 一致
- [x] **A7 叙事巡检**（P0 回填）：现行对外面 grep 无「`3.0.2` 待发版 / pending release / latest 仍 `3.0.1`」假叙事（白名单仅历史档 · 列入自检）
- [x] **A8 Prerequisites**（P0）：双语 README 顶部醒目节含 Node **22.19+** / **24+**（对齐 engines）· 明示 Node 20 风险 · 双语对齐
- [x] **A9 GH Release `v3.0.2`**（P0）：`gh release view v3.0.2` 成功 · notes 指向 CHANGELOG `[3.0.2]`（或等价锚）· **HG-GH-RELEASE=approved** 后执行留证
- [x] **A10（建议）GH Release `v3.0.0`/`v3.0.1`**（P0）：同波建成或在自检/修订记录显式 defer 理由（默认荐建）
- [x] **A11 首屏收敛**（P1）：首屏可读为 Prerequisites → 最小 3–5 步 → 链详章；全宿主表 / 全命令百科不在首屏主体
- [x] **A12 最小可绿样例**（P1）：双语含「空仓复制模板 + `test_strategy=required` 最小可绿」指引 · **未**物化文件进 `docs/tasks/`（S2 反向检查）
- [x] **A13 改名降噪**（P1）：SpecGate / `dsh-coding-kit` 不占首屏主体（脚注或 MIGRATION 链）
- [x] **A14 四门**（关账 · RELEASING 触及时硬勾 · 否则推荐）：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib`
- [x] **A15 关账**：`gate-check` → `task close --yes` · 逐文件显式 add · **未** publish / deprecate · **未**新建 tag

---

## 给执行帽的必读列表

1. 本 task（闸表 · Dirty 纪律 · S2 红线）
2. 先例 [`docs/tasks/done/task_3_0_2_release_bump.md`](../done/task_3_0_2_release_bump.md)（⑨ 回填反向：本波从「待发版」→「已 published」）
3. 先例 [`docs/tasks/done/task_2_2_closed_loop_w4_dx_onboarding.md`](../done/task_2_2_closed_loop_w4_dx_onboarding.md)（README DX · S2 禁物化）
4. `RELEASING.md` ⑨ · `CHANGELOG.md` `[3.0.2]` · `docs/roadmap/ACCEPTANCE_3_0_2_patch_3_0_2_zh.md`
5. `README.md` / `README.zh-CN.md` · `package.json#engines`
6. `AGENTS.md` local（禁 `npm publish` · S2 勿当 host 物化 target）
7. `docs/standards/` 涉文 L2（30 自裁）

---

## 思考轮

### R0 · 证据

用户给定已核实：`dist-tags.latest=3.0.2`（已 published）· Releases length 0（tags `v3.0.0`/`v3.0.1`/`v3.0.2` 在）· engines `^22.19.0 \|\| >=24.0.0`。仓内扫面：RELEASING / ACCEPTANCE_3_0_2 / CHANGELOG `[3.0.2]` / 手册头栏 / spec 索引 `3.0.2` 行 / README 双语现行包行仍写「待发版 · latest 仍 3.0.1」；README 首屏无 Prerequisites、先塞多宿主百科；工作树 `RELEASING.md` dirty（排版为主 · 内容仍 pending）。

### R1 · 范围

P0：⑨ 回填已 published 面 + Prerequisites + 至少 `v3.0.2` Release（建议同波 3.0.0/3.0.1）。P1：README 首屏收敛 + 最小可绿样例 + 改名降噪。单 task。排除：publish、默认改 src/init、S2 物化、图谱时间线追平、早于 3.0.0 的 Release。

### R2 · 方案

- 拆波【弃 · 同主题 docs · 闸成本倍增】vs 单 task【采纳】。
- `v3.0.0`/`v3.0.1` Release：非范围【弃 · Releases 页仍残缺】vs 同波建议一并【采纳 · A10 可 defer 但默认荐建】。
- init 打印 Node：默认做【弃 · 扩测面】vs 仅 README Prerequisites【采纳 · 可选升级条款已写】。
- `test_strategy`：`required`【弃 · 无实现红测】vs `recommended`【采纳 · RELEASING 双重敏感仍强制全量 test】。
- Dirty RELEASING：以 diff 存在当完成【弃】vs 以发布态真值勾选【采纳 · F-PP-04】。

### R3 · 边界

publish 冻结；S2 永不物化示例进 `docs/tasks/`；`HG-GH-RELEASE` 未签不得 `gh release create`；回填事实只认探针；不碰 schema/src（除非可选 init 单列）。

### R4 · 可测性

A1–A7 grep/探针；A8 节标题+engines 字面对齐；A9–A10 `gh release view`；A11–A13 结构抽检 + S2 反向 `git status`；A14 四门；A15 gate-check。

### R5 · 签收就绪

五槽预置完毕；充分性由 20-task-audit R1 裁定；HG-TASK-DRAFT / HG-AUDIT-R1 / HG-GH-RELEASE 待人。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 已 published 与文档/Releases 空窗摩擦钉齐 | no |
| R1 | P0+P1 单 task · publish/src/S2 冻结 | no |
| R2 | 单 task · 建议三 Release · 仅 README Prerequisites · recommended | no |
| R3 | 闸 / S2 / 探针三硬边界 | no |
| R4 | 探针+grep+gh view+四门可断言 | no |
| R5 | 待 20 审 R1 | no |

**residual_risks**：① `time.3.0.2` / tag tip 须 30 实测（F-PP-03）；② Dirty RELEASING 误当完成（F-PP-04）；③ README 大收敛误伤宿主矩阵深链（抽检互链）；④ `HG-GH-RELEASE` 久悬导致 A9 无法关账（过程可先合 docs · Release 后置勾）。

---

## 测试策略（Harness）

**test_strategy**: `recommended` —— 文档断言与 registry/gh 探针为主；无 src 红测义务。触 `RELEASING.md` ⇒ 全量 `npm test`（双重敏感）。若扩 `init` 打印 ⇒ 升 `required` 并补 init 关键行断言（本波默认不扩）。

---

## 提交信息约定

- docs：`docs(3.0.2-postpublish-dx): …`
- Release 动作本身不进 git commit（GitHub Releases 元数据）；相关 notes 若落仓文件则随 docs 提交
- **禁 `git add -A`**：逐文件显式 add；勿裹挟无关 dirty
- **禁** `npm publish` / `npm deprecate` / 新建 tag
- 波末：`npx spec-wave gate-check --task docs/tasks/active/task_3_0_2_postpublish_dx.md`

---

### 自检结论（执行者）

**30（2026-09-24）**：A1–A14 完成 · A15 留 40/00。探针 `latest=3.0.2` · `time.3.0.2`=2026-09-24T00:55:45.386Z · tip `3d71b90`。GH Releases `v3.0.0`/`v3.0.1`/`v3.0.2` 已建（v3.0.2=Latest）。四门 + `pins check` 17/17 绿。未 publish / 未新建 tag / 未改 src / 未 task close / 未 commit。

**40（2026-09-24）**：独立重钉探针一致 · Releases `v3.0.0`/`v3.0.1`/`v3.0.2`（Latest=`v3.0.2`）· verify PASS · gate-check exit 0 · A15 勾 · `task close --yes` · **未** publish/deprecate/新建 tag/改 src/commit。

### KPI（40）

Task_KPI%: 96（A1–A15 齐 · 40 独立重钉 `latest=3.0.2` / `time.3.0.2`=2026-09-24T00:55:45.386Z · GH Releases v3.0.0/1/2（Latest=v3.0.2 · notes→CHANGELOG）· README 双语 Prerequisites+最小上手+空仓 required 指引 · S2 未物化 · verify PASS · gate-check exit 0 · 四门由 30 留证 · 未 publish/deprecate/新建 tag）

- rubric：`KPI_RUBRIC_v1_2` · aggregator：`CLOSE` · 40 关账棒

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-24 | 40 关账：A15 · gate-check · task close → `docs/tasks/done/` |
| 2026-09-24 | 10-task 初稿：单 task 覆盖 P0+P1 · HG-GH-RELEASE · HG-RELEASE-PUBLISH=N/A · Dirty RELEASING 纪律 · S2 红线 |
