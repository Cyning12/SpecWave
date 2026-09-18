# Task：3.0.1 W4 · 口径回填与文档精确化（P2-1 / P2-3 / P3-3 / P3-5 / P3-6）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（**2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· 依据 [`task_3_0_1_w4_docs_precision_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_w4_docs_precision_audit_R1_20260918.md) PASS · blocking 0）· 30/40 闭环完成 · 2026-09-18 · **未发版 / 未 commit**）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（**HG-NEXT-PLAN=approved** · 2026-09-18 维护者签收 · 授权 00 代签过程闸 · HG-RELEASE / tag / push / publish 仍仅人）· **W4 节** + 硬约束 **8**（波末 typecheck+test）/ **9**（**W6-① 须在 W4 之后**）/ **10**（RELEASING 双重敏感 · 本波改 `CHANGELOG`/`MIGRATION`/`package.json:files` 同属 pins 钉面族）  
> **范围主源**：[`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) **§6.2 P2-1 / P2-3** · **§6.3 P3-3 / P3-5 / P3-6**  
> **基线**：`spec-wave@3.0.0` published（npm `latest` = 3.0.0 · tag `v3.0.0`）· 前序波次 **W1 / W2 / W3 均已 CLOSE: PASS**  
> **行号口径**：本 task 全部 `file:line` 为 **2026-09-18 10-task 起草棒实读现值**（PLAN 行号可能漂移 · 已再钉）  
> **Open Folder**：仓根  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A（同 2.4.x / W1–W3 patch 先例）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-1-w4-docs-precision` |
| **test_strategy** | `required` |
| **test_strategy_note** | 交付物以文档/白名单/注释为主，**不强制新增实现单测文件**；但 `CHANGELOG.md` / `MIGRATION.md` / `package.json:files` 触 **pins 钉面**（硬约束 8/10 · PLAN W4 风险 6）⇒ 波末全量 `npm test`（含 pins 相关用例）为硬条款；另须机检：grep 断言 · `npm pack --dry-run` 清单不变 · `node scripts/check-doc-links.mjs` rc=0。**禁止**本波提前开启 W6-①（把 `CHANGELOG.md` 纳入 `check-terminology` 扫描面） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 口径/文档精确化；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 验收缺口口径回填（非规范增量）；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0.1 patch 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-18 维护者签收 PLAN_3_0_1（原文意图：「身为00，统筹3.0.1的升级，授权签收过程文档」）· 开 W 波限制已解除 |
| HG-SPEC-SIGNOFF | N/A | — | 本版无独立 SPEC 夹（属 3.0.0 验收后 patch · 同 2.4.1/2.4.2 / W1–W3 先例） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· task lint PASS · 10/20 invoke 已落 |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-18 00 代签** · 依据 [`task_3_0_1_w4_docs_precision_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_w4_docs_precision_audit_R1_20260918.md)（PASS · blocking 0 · 五项齐全 · 禁提前 W6-①） |

---

## 背景与目标

3.0.0 验收报告收口五项 **文档/口径** 缺口（非判定语义松紧、非 schema）：

| 项 | 问题（摘要） | 完成态 |
|----|--------------|--------|
| **P2-1** | `MIGRATION.md` §①「行为不变」对**内置路径**欠精确（内置 v2 净增 hooks 物化） | 改为「**默认落点不变**；内置表升级为 v2 并**新增** hooks 物化（additive）」 |
| **P2-3** | `CHANGELOG.md` `[3.0.0]` Tests 段「841 → 859」滞后于实发 864 | 回填 **864（863 pass + 1 skip）** + 注明 TTY hotfix（`0e1f165`）其后 +5；tag-gated 设计红改为过去式留痕 |
| **P3-5** | `README.zh-CN.md` 入包但不在 `files` 白名单 | `package.json:files` **补列** `README.zh-CN.md`（自证；`npm pack` 结果不变） |
| **P3-6** | Spec Kit **作者数**仍单值 `90+` | → **区间 + `as_of 2026-09`**（与同批 K-1~K-4 口径统一） |
| **P3-3** | `check-doc-links` 注释暗示 `.workbuddy/`「全忽略」，与 9 件 tracked 矛盾 | **仅改注释**：「除 9 件显式 tracked 外均忽略」+ 列出 `git ls-files` 判据；**不迁文件** |

**编排前置**：W1–W3 已 CLOSE，本波引用落地后事实面；且须在 pins 相关改动（W3）之后，避免归因混淆。硬约束 **9**：W6-① 术语扫描面**不得**与本波同时开。

---

## 范围

严格对齐 PLAN **W4 节**五项（不得扩到 W5/W6 / release bump · 不得迁 `.workbuddy/` 文件 · 不得改 `.gitignore` · 不动 S2 过程域内容覆写）。

- [x] **① P2-1 · `MIGRATION.md` §① 措辞精确化**
  - 挂点：`MIGRATION.md:131-133`（§① 标题 / 「行为不变」句 · 2026-09-18 再钉）
  - 改为「**默认落点不变**；内置表升级为 v2 并**新增** hooks 物化（additive）」——消除「内置路径也行为完全不变」歧义
- [x] **② P2-3 · `CHANGELOG.md` Tests 段回填**
  - 挂点：`CHANGELOG.md:27-29`（`[3.0.0]` · `### Tests` · 「841 → 859」行）
  - 回填为「841 → **864**（863 pass + 1 skip · 打 tag 后全绿）」并注明 **TTY 色彩 hotfix（`0e1f165`）其后 +5**；「tag-gated 设计红 ×2」改为**过去式**过程留痕
- [x] **③ P3-5 · `package.json:files` 补列中文 README**
  - 挂点：`package.json:25-37`（`files` 数组 · 现列 `README.md` @`:30`，**未列** `README.zh-CN.md`）
  - 补列 `README.zh-CN.md`；**不改**其他 `files` 项语义
- [x] **④ P3-6 · 竞品作者数区间化**
  - 挂点：`delivery/research_report.md:170` / `:395`（Spec Kit **作者**口径仍含单值 `90+`；同批其他指标已区间 + `as_of`）
  - 作者数 `90+` → **区间 + `as_of 2026-09`**；不翻新 `delivery/` 其他设计文档的事实数字（除本项区间化）
- [x] **⑤ P3-3 · `check-doc-links` 注释口径**
  - 挂点：`scripts/check-doc-links.mjs:4` / `:24`（`.workbuddy/` 忽略/假绿叙述）；对照 `.gitignore:4`（`.workbuddy/`）· `git ls-files .workbuddy/` **=9**
  - 注释改为「`.workbuddy/` 除 **9 件显式 tracked** 外均忽略」，并列出该 9 件的判据来源（`git ls-files`）；**不迁动文件** · **不改**链接判据实现

---

## 非范围

| 项 | 理由 |
|----|------|
| 迁出 / 重命名 / 删除 `.workbuddy/` 下 9 件 tracked 文件 | PLAN W4 非范围 · **仅改注释口径** |
| 改 `.gitignore`（含 `:4` `.workbuddy/`） | PLAN W4 非范围 · 用户硬钉 |
| 改 `check-doc-links` 判据实现 / S2 冻结基线 / 扫描逻辑 | 仅注释；行为正确 |
| 翻新 `delivery/` 其他设计文档或非作者数字事实 | PLAN W4 非范围 |
| 提前开启 W6-①（`CHANGELOG.md` 纳入 `check-terminology` / `check-claims` 扫描面） | 硬约束 **9** · 须在 W4 **之后** |
| W6-② `validate` WARN / B5 边界文 | W6 · 本波不扩 |
| W5 钉版旗标 / 默认物化命令 | W5 · 本波不扩 |
| W1–W3 已关账实现再改 | 前序波次 · 本波不回滚 |
| bump `package.json` → 3.0.1 / CHANGELOG 发版节 / tag / push / publish | release 波 · **仅人** |
| 触 host-adapt `schema_version` / schema 变更 | 硬约束 3/6 · **STOP 上报** |
| 改判定语义松紧方向 / 新增对外能力面 | 硬约束 3 · **STOP 上报** |
| 覆写 S2 过程域既有档 | 硬约束 1 · 只新增不覆写 |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（HG-RELEASE 不在代签范围） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-W4-00） | 30 **拒开工**（verify 机械拦 exit 2） | 是（审查文落盘 + 00 签后） | 是 |
| §① 仍写「行为不变」致内置路径歧义未消（F-W4-01） | P2-1 未收口 · 打回 | 是 | 是 |
| `CHANGELOG` Tests 现行基位仍命中「859」或未注明 TTY +5（F-W4-02） | P2-3 未收口 · 打回 | 是 | 是 |
| `files` 未列 `README.zh-CN.md` 或顺手改其他 files 语义（F-W4-03） | P3-5 未收口/越界 · 打回 | 是 | 是 |
| Spec Kit 作者数仍单值 `90+` 未区间化（F-W4-04） | P3-6 未收口 · 打回 | 是 | 是 |
| 迁 `.workbuddy/` 文件 / 改 `.gitignore` / 改链接判据实现（F-W4-05） | 越非范围 · 打回 | 是 | 是 |
| 注释仍暗示「全忽略」且与 `git ls-files`=9 矛盾（F-W4-06） | P3-3 未收口 · 打回 | 是 | 是 |
| `npm pack --dry-run` 文件清单相对改前漂移（F-W4-07） | P3-5 自证失败（应只补白名单不改结果）· 打回 | 是 | 是 |
| `check-doc-links` rc≠0（F-W4-08） | 打回 | 是 | 是 |
| 全量 `npm test` 红 / pins 钉面误伤（F-W4-09） | 打回（硬约束 8/10） | 是 | 是 |
| 本波顺手开 W6-① 术语扫描面或改 `terminology.yaml` 目标集（F-W4-10） | 违反硬约束 9 · **STOP** / 打回 | — | 是 |
| 触 schema / 改判定松紧 / 新增能力面（F-W4-11） | **立即 STOP 上报** · 移出 3.0.1（硬约束 3） | — | 是 |
| 顺手开 W5/W6 / bump 3.0.1（F-W4-12） | 打回（每波一 task · 本波仅 W4） | — | — |
| 越权 tag/push/publish/deprecate（F-W4-13） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟域外档（F-W4-14） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| 四门任一红（F-W4-15） | 停止 · 先修再关账 | 是 | 是 |

---

## 验收标准

- [x] **A1 P2-1**：`MIGRATION.md` §① 不再用「行为不变」掩盖内置路径 additive hooks；文案含「默认落点不变」+「新增 hooks 物化（additive）」（或等价精确措辞 · 与 PLAN / 验收报告建议对齐）
- [x] **A2 P2-3**：`grep -n "859" CHANGELOG.md` **不再命中** `[3.0.0]` Tests **现行基线**位；该段写明 **864（863 pass + 1 skip）** 与 TTY hotfix（`0e1f165`）+5；tag-gated 设计红为过去式留痕
- [x] **A3 P3-5**：`package.json` `files` 含 `README.zh-CN.md`；`npm pack --dry-run` 文件清单相对改前**不变**（仅自证白名单）
- [x] **A4 P3-6**：Spec Kit **作者数**已 **区间 + `as_of 2026-09`**；`grep "90+" delivery/research_report.md` 对作者口径命中为零或已带区间（非作者语境如 SR-17「90+ CLI」若仍命中，须在自证中显式区分并经 20 审裁定豁免或同改）
- [x] **A5 P3-3**：`scripts/check-doc-links.mjs:4/24` 注释改为「除 9 件显式 tracked 外均忽略」并点名 `git ls-files` 判据；`git ls-files .workbuddy/ | wc -l` **=9**；**未**迁文件、**未**改 `.gitignore`
- [x] **A6 链接机检**：`node scripts/check-doc-links.mjs` → **rc=0**
- [x] **A7 pins / 全量测**：全量 `npm test` 绿（含 pins 钉面；tag-gated 设计红留痕口径同前例）——本波文档改动不得误伤 pins
- [x] **A8 非范围钉死**：未迁 `.workbuddy/`；未改 `.gitignore`；未改链接判据实现；未开 W6-① 术语扫描面；未开 W5/W6；未触 schema；未 bump 3.0.1
- [x] **A9 四门**：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib` 全绿
- [x] **A10 关账**：`npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w4_docs_precision.md` → exit 0 + `task close --yes`；提交 `fix(3.0.1-W4): …` · 禁 `git add -A` · 未执行 tag/push/publish

---

## 给执行帽的必读列表

1. [`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md) — W4 节全文 · 硬约束 **8/9/10** · 风险 6/7
2. [`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) §6.2 P2-1/P2-3 · §6.3 P3-3/P3-5/P3-6
3. 挂点再钉（2026-09-18）：`MIGRATION.md:131-133` · `CHANGELOG.md:27-29` · `package.json:25-37`（`:30` README.md）· `delivery/research_report.md:170/:395` · `scripts/check-doc-links.mjs:4/:24` · `.gitignore:4` · `git ls-files .workbuddy/` =9
4. 先例 [`docs/tasks/done/task_3_0_1_w3_pins_io_failclosed.md`](../done/task_3_0_1_w3_pins_io_failclosed.md)（同系列元信息 / 闸表 4 列 / 无 SPEC / pins 敏感）
5. `docs/standards/` 涉文 / 涉 `package.json` 时 30 自裁引用 L2

---

## 思考轮

### R0 · 证据

PLAN_3_0_1 已 HG-NEXT-PLAN=approved；W1–W3 CLOSE: PASS；范围主源 §6.2/§6.3 五项与 PLAN W4 对齐。本棒实读再钉：`MIGRATION.md:133` 仍「行为不变」；`CHANGELOG.md:29` 仍「841 → 859」；`package.json:25-37` `files` 无 `README.zh-CN.md`；`research_report.md:170/:395` 作者仍 `90+`；`check-doc-links.mjs:4/:24` 注释未写「9 件 tracked」例外；`git ls-files .workbuddy/`=9。硬约束 8/9/10 钉死 pins 与 W6-① 顺序。

### R1 · 范围

仅 W4 五项口径/文档/白名单/注释；显式排除迁 `.workbuddy/`、改 `.gitignore`、改链接实现、开 W6-①、W5/W6、release bump。

### R2 · 方案

按 PLAN 逐条改措辞/补列/区间化/注释；自证用 grep + `npm pack --dry-run` 前后对照 + `check-doc-links` + 全量 `npm test`（pins）。

### R3 · 边界

S2 只新增；禁触 schema；禁改判定松紧/能力面；发布四动作仅人；W6-① 不得本波提前；发现需触纪律门三项 ⇒ STOP。

### R4 · 可测性

A1–A6 机检断言 · A7 pins/全量测 · A8 非范围 · A9 四门 · A10 关账；`test_strategy=required` 因 pins 钉面敏感（非因需新写实现红测）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核；HG-TASK-DRAFT / HG-AUDIT-R1 待评审文与 00 代签。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 五项证据与 file:line 再钉齐 | no |
| R1 | 仅 W4 · 排除迁文件/W6-①/W5+ | no |
| R2 | 文档+白名单+注释 · grep/pack/links/pins 自证 | no |
| R3 | 硬约束 8/9/10 · 禁 schema | no |
| R4 | A1–A10 可机检 · pins ⇒ required | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① `CHANGELOG`/`MIGRATION` 措辞误伤 pins 钉面（F-W4-09）；② `npm pack --dry-run` 对照不严导致清单静默漂移（F-W4-07）；③ `grep "90+"` 误伤 SR-17 非作者语境或漏改作者位（F-W4-04）；④ 30 误开 W6-① 术语面（F-W4-10）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 说明：虽以文档为主、**可不新增** `test/*.test.ts`，但因 **pins 钉面敏感**（`CHANGELOG` / `MIGRATION` / `package.json:files`），波末必须全量 `npm test` + typecheck/build/test:lib；并以 grep / `npm pack --dry-run` / `check-doc-links` 作验收断言。红测「先行」对本波含义 = 改前先跑一遍基线（pack 清单快照 + links rc=0 + test 绿）再改，而非强制先写失败用例。

---

## 提交信息约定

- 实现提交：`fix(3.0.1-W4): …`（docs precision · P2-1/P2-3/P3-3/P3-5/P3-6）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟** `.workbuddy/` 未跟踪档 · 不裹挟 W5/W6 草稿 · 不裹挟 release bump
- **禁 tag / push / publish / deprecate（仅人）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w4_docs_precision.md`

---

### 自检结论（执行者）

**帽**：30 实现 + 40 自证（同棒）· **日期**：2026-09-18 · **未发版 · 未 git commit**（留给 00/维护者）· 五项口径（P2-1/P2-3/P3-3/P3-5/P3-6）全绿 · 四门 887 pass + 1 skip / test:lib 6 · `check-doc-links` rc=0 · pack 路径清单不变 · SR-17「90+ CLI」豁免。

#### 验收勾选

- [x] A1 P2-1 · MIGRATION §①「默认落点不变」+「新增 hooks 物化（additive）」
- [x] A2 P2-3 · CHANGELOG Tests 841→864 + TTY `0e1f165` +5 · tag-gated 过去式 · `859` 现行基线 0 命中
- [x] A3 P3-5 · `files` 含 `README.zh-CN.md` · pack **路径清单**不变（total files=275 · 仅 MIGRATION 体积/shasum 因改文变）
- [x] A4 P3-6 · 作者 `90–110+` + as_of 2026-09 · SR-17「90+ CLI」豁免（非作者）
- [x] A5 P3-3 · 注释「除 9 件 tracked 外忽略」+ `git ls-files` · tracked=9 · 未迁文件/未改 `.gitignore`
- [x] A6 `check-doc-links` rc=0（S2=34）
- [x] A7 全量 `npm test` 887 pass + 1 skip · pins 未误伤
- [x] A8 非范围钉死（未开 W6-① / W5 / schema / bump）
- [x] A9 四门：typecheck · test(887+1skip) · build · test:lib(6)
- [x] A10 gate-check + task close（本棒）· 未 commit / tag / push / publish

#### invoke

`docs/harness/invokes/by-task/3-0-1-w4-docs-precision/invoke_20260918_30_40_3-0-1-w4-docs-precision.md`

Wiki: none（口径回填 · 无规范增量）

### 经验总结（执行者）

- pins 钉面族（CHANGELOG/MIGRATION/`files`）改措辞后必须全量 `npm test`；本波零行为逻辑改动仍可能误伤钉面。
- `npm pack`「清单不变」指**路径集合**；内容改文会导致 size/shasum 变，属预期。
- check-doc-links S2：W4 task↔audit 未入库互相链接抬高计数 +3；关账前过程档须逐文件 `git add`（禁 `git add -A`）。
- SR-17「90+ CLI」非作者语境豁免；作者位须区间化。

### KPI（30/40）

Task_KPI%: 95（范围①–⑤与 A1–A10 全绿 · grep/pack/links 机检齐 · 四门绿 · 零 schema/W6-①/bump/发版越权 · 未 git commit 留给维护者）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同棒闭环

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 初稿 · 10-task（PLAN W4 / §6.2 P2-1·P2-3 / §6.3 P3-3·P3-5·P3-6）· 状态 draft · HG-TASK-DRAFT/HG-AUDIT-R1=pending · HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=N/A · 行号再钉见上 · 闸表 4 列且 id 单元格无内嵌粗体 · test_strategy=required（pins 敏感说明） · 补 `### 自检结论`/`### KPI` 占位过 E5 |
| 2026-09-18 | **00 代签**：HG-TASK-DRAFT + HG-AUDIT-R1 → approved · R1 PASS · blocking 0 |
| 2026-09-18 | **30/40**：五项口径落地 · A1–A10 绿 · 四门绿 · gate-check/close · 未 commit |
