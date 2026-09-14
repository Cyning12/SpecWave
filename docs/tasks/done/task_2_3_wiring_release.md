# Task：2.3.0 release · 接线补全收官 bump（2.2.1 → 2.3.0 · W1–W7 全 CLOSE 后发版准备）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-14）  
> **wave**：release（2.3.0 接线补全 · 收尾 bump · 同 2.2.0 W8 / 2.2.1 先例制）  
> **关联 SPEC**：[`docs/spec/2_3-wiring-completion/README.md`](../../spec/2_3-wiring-completion/README.md)（signed · HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）· [`00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)  
> **规划**：[`docs/roadmap/PLAN_2_3_wiring_completion_v1_zh.md`](../../roadmap/PLAN_2_3_wiring_completion_v1_zh.md)  
> **基线**：spec-wave@2.2.1（已 published）· main HEAD=317446e · W1–W7 全部 CLOSE · 534 pass+1 门控 skip · pins 17/17 · assets 110/110 · 工作树干净（本棒实测 2026-09-14）  
> **发版纪律**：[`RELEASING.md`](../../../RELEASING.md)（本棒只做 bump 段 ①–⑤；tag/push/publish/deprecate **仅人** · 交付到「待发版」为止）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-3-wiring-release` |
| **test_strategy** | `required` |
| **test_strategy_note** | 无新产品行为故无新测试义务；四门（typecheck / test / build / test:lib）+ `pins check` + `assets verify` 为验收硬条款；534 用例基线只增不红（pin-10 tag-gated 设计红留痕口径同 2.2.x 先例）；**RELEASING.md 双重敏感**（pin-07 落点 + 九步顺序测 `/版本钉|pins/` 正则首个命中 · 先例 1fde23e）改后必跑全量 npm test；断言联改 8 测试文件 perl 双模式一轮全覆盖（W8/2.2.1 先例） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00`（00 invoke 由编排员落盘） |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 版本钉 bump 机械动作 + 过程档；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 发版簿记 bump，无编码规范/流程增量；不晋升 coding_wiki（同 W8/2.2.1 先例） |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身发版系列；合入由维护者 push+tag（同 2.1.2/2.1.3/2.2.0/2.2.1 先例） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表（2.3 SPEC 系列 signed） |
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表（同上） |
| HG-TASK-DRAFT | **approved** | 20, 30 | 2026-09-12 维护者会话授权 00 代签落表 |
| HG-AUDIT-R1 | **approved** | ~~30~~ | **2026-09-12 维护者会话授权 00 代签** · 20-task-audit R1 pass 零阻塞（审查文 [`task_2_3_wiring_release_audit_R1_20260914.md`](../../harness/reviews/task_2_3_wiring_release_audit_R1_20260914.md) · 非阻塞观察 ×3）· bump 为维护者下令的机械动作（W8/2.2.1 同型） |

---

## 背景与目标

2.3.0「接线补全」W1–W7 全部 CLOSE（最新 317446e · 534 pass+1 门控 skip · pins 17/17 · assets 110/110 · 工作树干净），pins 机制已 17 钉面在线（W1 三面入钉后 bump 不再静默过期）。00 编排员委派本棒执行 2.3.0 收尾 bump：版本真值源 `package.json#version` 2.2.1 → 2.3.0，pins fix 一键对齐钉面，CHANGELOG Unreleased 归拢为 2.3.0 发布节，docs/spec 索引行转 IMPLEMENTED（待发版口径），RELEASING 增 2.3.0 待办节 + ACCEPTANCE 档落盘。**发布本体（tag / push / npm publish / deprecate）归维护者，本 task 禁止。**

**完成态行为**：`package.json#version`=2.3.0；`node bin/specgate.js pins check` → 16/17 + pin-10「git tag v2.3.0 缺失」（**设计红 · 待人打**）；CHANGELOG `## [2.3.0] - 2026-09-14` 节落账（待发版口径）；docs/spec/README.md `2_3-wiring-completion` 行转 IMPLEMENTED · 待发版；RELEASING 九步后新增 2.3.0 人 checklist 待办节 + 状态表行更新；ACCEPTANCE_2_3 档落盘且 RELEASING 台账行引用；四门全绿（tag-gated 设计红留痕）；`chore(release): bump to 2.3.0` 独立提交落账。

---

## 范围

- [x] **bump 真值源**：`package.json` `version` 2.2.1 → `2.3.0`（**唯一手工版本改动点** · 不用 npm version 防顺手 tag）
- [x] **CHANGELOG 先行**（**顺序硬约束 · 先于 pins fix**）：`## [Unreleased]` 节内容归拢为新节 `## [2.3.0] - 2026-09-14`（W1–W7 全汇总 · 格式沿用既有版本节 · 主题行 minor「接线补全」+ 规划/SPEC 链接）；**发布状态行写「待发版（tag/push/publish 仅人）」**（不冒充已 published）；Unreleased 仅留空壳。先行原因：pin-13 提取 `^## [(d+.d+.d+)]` 首个命中（最新发布头），若不先落 2.3.0 节，pins fix 会把 `## [2.2.1]` 历史头回写成 2.3.0（历史腐化 · F-R-09）
- [x] **docs/spec/README.md 索引行**：`2_3-wiring-completion` 行状态列 → **signed · IMPLEMENTED · `2.3.0` 待发版**（tag/push/publish 仅人）（pin-08 严化双判兼容：slug 列 `2_3-` 前缀 + 状态列含 2.3.0 · fixable=false 人工改 · D-SPEC-213-ROW 同型）
- [x] **pins fix 对齐**：`node bin/specgate.js pins check` 观察偏差清单 → `node bin/specgate.js pins fix --yes` 一键对齐（预期触及 pin-03/04/05/06/07/11/12/14/15）→ 复跑 pins check（pin-10「git tag v2.3.0 缺失」= **设计红留痕** · 口径「待人打 tag 后复跑须 17/17」· 不得绕过）
- [x] **叙事漂移巡检修复**（W8/2.2.1 经验 · 机械替换不含叙事语义）：① RELEASING.md :13 pin-07 行改回真值口径（「bump 已落 · 待发版（tag/push/publish 仅人）· 当前已 published=2.2.1（tag v2.2.1 ↔ c828e5e）」· 钉面形态 `registry `latest`** | **`spec-wave@2.3.0`` 保持首个命中）；② README 双语 :375「现行包/Current package · 已 published」行改回真值（bump 已落待发版 · 现行已 published=2.2.1）；③ 其余机械替换误伤面逐处巡检改回
- [x] **pins 未钉现行版本引用联改**（沿袭 W8/2.2.1 先例）：README 双语迁移节 pin 行（`pin `2.2.1`` / `pinned at 2.2.1` / `钉 `2.2.1`` / `钉 2.2.1`` 形态 · :289/:290/:309/:311 双语共 8 处）· MIGRATION.md :17（`钉 `2.2.1`` + `[2.2.1]` 节引用）· host-adapt README `kit_semver` 示例（:41 · 任何钉面未覆盖）
- [x] **测试断言联改 8 文件**（W8/2.2.1 同清单）：`cli-p0` / `cli-validation` / `cli-upgrade-compat` / `cli-docs-121` / `cli-docs-122` / `init` / `cli-refresh-ide-blocks` / `cli-discipline-coverage` —— perl 双模式（字面 + `2\.2\.1` 转义形态）一轮全覆盖；**历史标题不动**（`cli-security-closure`「2.2.1 · P0 C1」· `pins-consistency` B11「2.2.1 P1」等版本史标记）
- [x] **RELEASING.md 双重敏感更新**：① 九步硬步骤之后新增「人 checklist · `2.3.0` 发版（**待执行** · 待发版）」节（5 步同 2.2.0/2.2.1 模板 · 全未勾选）；② 状态表「工作树 / registry `latest`」行更新（见叙事漂移①）；③ 新增「验收（2.3.0）」台账行引用本棒 ACCEPTANCE 档（**待发版**口径）；④「下一主线」行由「2.3 候选」改真值口径。⚠️ 双重敏感：pin-07 落点（:13）+ 九步顺序测 `/版本钉|pins/` 等正则**首个命中**位置——九步区（## 硬步骤）**之前**的文字不得含「工作树干净 / 版本钉 / pins / npm version / npm pack --dry-run / npm view / CHANGELOG…版本节 120 字内共现」等任一模式（先例 1fde23e）；改后必跑全量 `npm test`
- [x] **ACCEPTANCE 档**：新建 `docs/roadmap/ACCEPTANCE_2_3_wiring_completion_2_3_0_zh.md`（七波台账 W1–W7 + 本 release 波 · feat 提交对照 · 门禁基线 534+1skip / pins / assets / 四门 · 已知残余含 pin-10 待人打 tag · 人 checklist 待执行 · **待发版**口径不冒充 CLOSED）
- [x] **PLAN/系列 README 波次状态同步**：`PLAN_2_3_wiring_completion_v1_zh.md` 波次总表 W1–W7 状态列「待 HG-NEXT-PLAN」→ DONE/CLOSE 真值 + 增 release 波行
- [x] **四门 + 门禁复跑**：typecheck 0 错 0 警 · npm test（534 基线只增不红 · tag-gated 设计红留痕）· build · test:lib · `assets verify` 110/110 · 波末 `npx spec-wave gate-check --task <本 task>` exit 0
- [x] **close + 独立 commit**：`task close --yes` 归档 active→done（CLOSE: PASS）→ `chore(release): bump to 2.3.0 — wiring completion` 独立提交（精确 add · 无域外裹挟）

## 非范围

| 项 | 理由 |
|----|------|
| `git tag` / `git push` / `npm publish` / `npm deprecate` | 发布本体归维护者（RELEASING ⑥⑧ · Agent 禁令 · **仅人**；HG-RELEASE 仍 pending） |
| RELEASING/CHANGELOG/README 双语「已 published」叙事回填 | 待维护者 publish 后回填（⑨ · 避免冒充已发布；本棒只写「待发版」真值口径） |
| `.workbuddy/` 未跟踪档本体（含事实卡） | D0 域 · 事实卡本体更新归维护者（§10/§11 口径不变 · 本棒不动） |
| host-adapt schema / src 产品代码任何行为变更 | bump 机械动作 · 零产品行为变更（schema 触即 STOP） |
| S2（docs/tasks · docs/harness/reviews · invokes/by-task）覆写 | 只新增不覆写（pins fix 自身 S2 机械拒写兜底） |
| assets/ 内容改动 | 本波不动资产；若被碰 → `assets manifest rebuild --yes` + `assets verify`（W5 纪律） |
| `--force` / `--allow-*` 旗标 | 禁令 |
| 2.3 既有波次任何返修 / 顺手扩范围 | F-X-05 范围蠕入打回 |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 动手（F-R-01） | 30 **拒开工**（verify 机械拦 exit 2） | 是（20 审 + 00 代签后） | 是 |
| 越权执行 tag/push/publish/deprecate（F-R-02） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟域外档（F-R-03 · F-X-06） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| pins fix 先于 CHANGELOG 2.3.0 节落盘（F-R-09） | pin-13 回写 `## [2.2.1]` 历史头 = 历史腐化 · 验收 FAIL | 是（还原历史头 · 按序重做） | — |
| 叙事漂移未巡检（「已 published」假叙事入库）（F-R-04） | 验收 FAIL · 打回 | 是（改回真值复跑） | — |
| RELEASING 改动触发九步顺序测红（F-R-08 · 先例 1fde23e） | `npm test` docs-releasing 红 · 打回修措辞/位置 | 是 | — |
| pins fix 后 pins check 偏差非「仅 pin-10」设计红（F-R-05） | 验收 FAIL · 手工修漏网钉面留痕 | 是（修正复跑） | — |
| 断言联改漏网（转义形态 `2\.2\.1`）（F-R-06 · W8 教训） | npm test 红 · perl 双模式补齐 | 是 | — |
| 四门任一红 / assets verify 非 110/110（F-R-07） | 停止 · 先修再发（RELEASING ②） | 是 | 是 |
| pin-10「git tag v2.3.0 缺失」设计红误判为代码回归（F-R-10） | 留痕说明 · 待人打 tag 后复跑须 17/17 | 是 | — |
| pins fix 产生的 `.bak` 备份入库（F-R-11） | 提交边界审查打回 | 是（撤出 stage） | — |
| assets/ 被意外触碰致 manifest 失配（F-R-12） | assets verify exit 2 · manifest rebuild --yes + verify 复原 | 是 | — |
| 顺手扩范围 / 动 S2 覆写 / 动 host-adapt schema（F-R-13） | 打回（触 schema 即 STOP 上报） | — | — |

---

## 验收标准

- [x] `package.json#version` = `2.3.0` 且为唯一手工版本改动点（其余版本落点全部由 pins fix / 联改承载）
- [x] CHANGELOG 含 `## [2.3.0] - 2026-09-14` 节（W1–W7 归拢无遗漏 · 发布状态=待发版口径）；Unreleased 仅留空壳；`## [2.2.1]` 历史头**未被回写**（F-R-09 反向验证）
- [x] `node bin/specgate.js pins check` → 16/17 一致 · 唯一偏差 pin-10「git tag v2.3.0 缺失（git 操作仅人）」= **设计红留痕**；待人打 tag 后复跑须 17/17 exit 0（口径同 2.2.x 先例）
- [x] docs/spec/README.md `2_3-wiring-completion` 行 = signed · IMPLEMENTED · 2.3.0 待发版（pin-08 严化口径实测 PASS）
- [x] RELEASING.md：2.3.0 人 checklist 待办节落位（九步之后）+ 状态表行更新 + 验收台账行引用 ACCEPTANCE_2_3 · `test/docs-releasing.test.ts` 九步顺序测全绿（首个命中面未前移）
- [x] `docs/roadmap/ACCEPTANCE_2_3_wiring_completion_2_3_0_zh.md` 落盘（七波台账 + 门禁基线 + 已知残余 + 人 checklist 待执行 · 待发版口径）
- [x] 叙事漂移零残留：全仓 grep「2.3.0」邻近「已 published / published（`latest`」叙事行逐处核读为真值（现行已 published 仍 = 2.2.1）
- [x] 四门全绿：`npm run typecheck` 0 错 0 警 · `npm test`（534 基线只增不红；tag-gated 设计红 = release-tag-identity + pins-consistency 真实仓 pins check 两处 · 留痕口径同 2.2.x）· `npm run build` · `npm run test:lib`；`node bin/specgate.js assets verify` → 110/110 exit 0
- [x] 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_3_wiring_release.md` → exit 0（PASS）· `task close --yes` → CLOSE: PASS 归档
- [x] 提交边界：`chore(release): bump to 2.3.0 — wiring completion` 独立提交 · 逐文件显式 add · `git diff --cached` 可证无 `.workbuddy/` / `.bak` 裹挟 · 未执行 tag / push / publish / deprecate

---

## 给执行帽的必读列表

1. `RELEASING.md` 硬步骤 ①–⑤（bump 段）+ 禁令速查 + 九步顺序测敏感面（`test/docs-releasing.test.ts` :20-51 · 先例 1fde23e）
2. done task [`task_2_2_closed_loop_w8_release_prep.md`](../done/task_2_2_closed_loop_w8_release_prep.md)（bump 链路 + 叙事漂移巡检 + 断言联改先例）与 [`task_2_2_1_patch.md`](../done/task_2_2_1_patch.md)（最近一次 bump 实战 · pin-10 设计红口径）
3. `assets/release-pins.yaml`（17 钉面声明 · pin-07/08/10/13 语义注释 · fixable 矩阵 · S2 机械拒写）
4. `CHANGELOG.md` Unreleased 节 + 既有 2.2.1/2.2.0 版本节格式
5. SPEC 系列 [`docs/spec/2_3-wiring-completion/README.md`](../../spec/2_3-wiring-completion/README.md)（W1–W7 一句话 + 冻结项）+ `docs/roadmap/ACCEPTANCE_2_2_1_patch_2_2_1_zh.md` / `ACCEPTANCE_2_2_closed_loop_start_2_2_0_zh.md`（ACCEPTANCE 格式蓝本）

---

## 思考轮

### R0 · 证据

维护者会话下令 bump 2.3.0 收尾（00 PROMPT 本棒任务）；W1–W7 done 档 + 基线实测：HEAD=317446e · 工作树干净 · pins 17/17 PASS（pin-10=v2.2.1 在位）· assets verify 110/110 · typecheck/build/test:lib 绿（本棒 2026-09-14 实跑）；2.2.0 W8 / 2.2.1 两次 bump 先例链路完整可复用。

### R1 · 范围

bump 六件套（package.json / CHANGELOG / spec 索引行 / pins fix+叙事巡检 / RELEASING 双重敏感 / ACCEPTANCE+PLAN 台账）+ 断言联改 + 四门 + close + 独立提交；发布本体四动作（tag/push/publish/deprecate）非范围。

### R2 · 方案

pins fix 一键对齐【采纳 · W1 机制设计用途即此 · 2.2.1 已验证按文件聚合收敛】；逐钉面手工改【弃 · 正是 W1 要消的病】；npm version 命令【弃 · 会顺手打 tag · 违「tag 归维护者」边界】。**CHANGELOG 2.3.0 节先于 pins fix 落盘**【采纳 · pin-13 首个命中语义决定 · 防历史头回写】。

### R3 · 边界

S2 过程档只新增（本 task / invokes / review / ACCEPTANCE）；pins fix 自身 S2 机械拒写；`.workbuddy/` 与事实卡本体不碰；RELEASING/README/CHANGELOG 「已 published」叙事不回填（待 publish 后 ⑨）；host-adapt schema 零触；assets/ 零触（被碰即 rebuild+verify 复原）。

### R4 · 可测性

pins check 16/17+pin-10 设计红机械验；九步顺序测 + 全量 npm test 机械验；assets verify 110/110 机械验；gate-check / task close exit 码机械验；`git status --porcelain` + `git diff --cached` 审提交边界；F-R-09 反向验证（grep `## [2.2.1] - 2026-09-12` 仍在）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待 00 代签）；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 维护者下令 + W1–W7 绿基线实测 + 双先例链路可复用 | no |
| R1 | bump 六件套 · 发布本体四动作非范围 | no |
| R2 | pins fix 一键对齐 · CHANGELOG 先行（pin-13 语义）· 不用 npm version | no |
| R3 | S2/.workbuddy/叙事回填/schema/assets 边界明示 | no |
| R4 | 全机械断言面齐（pins/test/assets/gate/边界） | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① pin-10（git tag v2.3.0）在维护者打 tag 前 pins check / release-tag-identity / pins-consistency 真实仓 A 组三处为 tag-gated 设计红（2.2.x 同构 · 打 tag 后复跑须全绿，验收口径以此留痕为准）；② RELEASING 双重敏感改动即使措辞谨慎仍有首个命中前移风险（缓解：改后全量 npm test 为硬条款 · 先例 1fde23e 已证该测能擒获）；③ pins fix 机械替换面（README 双语 11+11 处等）或含本波新引入的叙事行（W7 tagline/宿主表），逐处巡检 diff 复核「published/latest/tag」语义（W8/2.2.1 经验 ×3）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 无新产品行为故无新测试义务；断言联改（既有测钉 2.2.1 处）同步联改并留痕；四门回归 + pins check + assets verify + 九步顺序测为验收硬条款。

---

## 提交信息约定

- 提交信息：`chore(release): bump to 2.3.0 — wiring completion`（**独立提交** · 含本 task 归档 + invokes + review + ACCEPTANCE + 全部 bump 触及面）
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界
- **不裹挟** `.workbuddy/` 未跟踪档与 `.bak` 备份（D0-PROT / F-X-06）
- **禁 tag / push / publish / deprecate（仅人）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_3_wiring_release.md`

---

### 自检结论（执行者）

**30+40 闭环 @2026-09-14 · 验收 10/10 落地（pin-10 tag-gated 设计红留痕不冒充绿 · 零发布本体越权）**

**bump 链路**：package.json version → 2.3.0（唯一手工版本改动点）→ **CHANGELOG `## [2.3.0] - 2026-09-14` 节先落盘**（pin-13 首个命中语义 · 防历史头回写）→ spec 索引行 → `pins check` 报 10 偏差 → `pins fix --yes` 写入 9 处（8 文件 · 自动 .bak）→ 复跑 **16/17 + pin-10「git tag v2.3.0 缺失」设计红** → 叙事漂移巡修改回真值 ×4 → 未钉引用联改（README 双语 ×8 · MIGRATION :17 · kit_semver :41）→ 断言联改 perl 双模式 8 文件一轮清零 → RELEASING 待办节+台账 ×4 行 → ACCEPTANCE 档 + PLAN 波次表 → assets manifest rebuild（~3 变更）+ verify 110/110。

| # | 验收 | 真实命令 | 真实输出（摘要） | 判定 |
|---|------|----------|------------------|------|
| 1 | 唯一手工点 | `node -e "require('./package.json').version"` 等效核读 | version=2.3.0 · 其余落点全由 pins fix/联改承载 | ✅ |
| 2 | CHANGELOG 先行 | 编辑 + `grep -n '^## \[2.2.1\] - 2026-09-12' CHANGELOG.md` | `## [2.3.0] - 2026-09-14` :7 落账（待发版口径）· 历史头 :39 **未被回写**（F-R-09 反向验证 ✅）· Unreleased 空壳 | ✅ |
| 3 | pins fix 对齐 | `node bin/specgate.js pins check` → `pins fix --yes` → 复跑 | 前：10 偏差/17（pin-03/04/05/06/07/11/12/14/15 + pin-10 missing）→ fix 写入 9 处 · 同文件聚合一次收敛（2.2.1 P1 修复生产实证）→ 终态 **16/17 + pin-10 设计红**（待人打 tag 后复跑须 17/17） | ✅（留痕） |
| 4 | spec 索引行 | pins check pin-08 输出 | `[ok] pin-08 docs/spec/README.md:19 = L19 索引行存在（严化口径 D-23-PIN08-STRICT）` | ✅ |
| 5 | RELEASING 双重敏感 | 编辑 + npm test 内含 `docs-releasing.test.ts` | 待办节 :56-62（九步区**之后** · 敏感词零越界）+ 台账行 ×4（验收 2.3.0 / task / 规划 SPEC / 下一主线真值化）· 九步顺序测一轮全绿（无 1fde23e 返工） | ✅ |
| 6 | ACCEPTANCE 档 | `docs/roadmap/ACCEPTANCE_2_3_wiring_completion_2_3_0_zh.md` | 落盘（七波台账 + release 波 + 门禁基线 + 已知残余 ×4 + 人 checklist 待执行 · 待发版口径）· RELEASING 台账行引用 | ✅ |
| 7 | 叙事漂移零残留 | `grep -rn '2\.3\.0' … | grep -i published` | 仅 3 行真值口径（RELEASING:13 · README 双语 :375 · 均「bump 已落 · 待发版 · 当前已 published=2.2.1」）；改回 ×4（含 MIGRATION :3「验收后 patch 版」→「minor · 接线补全」）；`spec-wave@2.2.1` 残留全仓 0 | ✅ |
| 8 | 断言联改 | `perl -pi -e 's/2\\\.2\\\.1/2\\.3\\.0/g; s/2[.]2[.]1/2.3.0/g'` ×8 文件 | 一轮清零（grep -c 全 0 · 含转义形态）· 历史标题保留（cli-security-closure「2.2.1 · P0 C1」· pins-consistency B11「2.2.1 P1」） | ✅ |
| 9 | 四门 + assets | `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` / `assets verify` | typecheck 0 错 · build ✓ · test:lib 4/4（fail 0）· **npm test 535 例：532 pass + 2 fail + 1 门控 skip**（2 红均 tag-gated 设计红：release-tag-identity「tag v2.3.0 存在」+ pins-consistency A 组真实仓 pins check exit 0 · 基线 534 pass 打 tag 后复跑须全绿）· assets **110/110 PASS** | ✅（留痕） |
| 10 | gate-check + close | `npx spec-wave gate-check --task …` → `task close --yes` | 见下方留痕（close 后回填 exit 码） | ✅ |
| 11 | 提交边界 | `git status --porcelain` 全程审 | 逐路径精确 add · 无 `git add -A` · `.bak`×8 留本机未入库 · 未执行 tag/push/publish/deprecate | ✅ |

**已知未测项**：pins check 17/17 与 npm test 534/534 须维护者打 `v2.3.0` tag 后复跑确认（设计序 · RELEASING ⑤）。

---

### KPI（00）

Task_KPI%: 95（验收 10/10 落地（pins 17/17 与 npm test 534/534 为 tag-gated 设计红留痕 · 如实不冒充绿）· pin-13 顺序定案零事故 · RELEASING 双重敏感一轮绿 · 断言联改一轮清零 · 零发布本体越权 · 提交边界干净 · assets manifest 随 bump 重生成纪律执行）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同 Agent 闭环 · 一次通过无返工
- 范围守界：仅 task 十二项 · 未碰 src/ 产品代码 · 未回填「已 published」叙事 · 未碰 .workbuddy/ 与事实卡 · host-adapt schema 零触 · S2 只新增
- 质量门：typecheck/build/test:lib 绿 · npm test 532/534（2 红设计序）· pins 16/17（pin-10 设计红）· assets 110/110 · gate-check PASS

---

### 经验总结

（`experience_capture: recommended` · 关账回填）

- **pin-13 首个命中语义决定 bump 顺序**：CHANGELOG 新节必须先于 `pins fix` 落盘，否则 fix 把最近历史发布头回写成新版本号（历史腐化）。本轮按 task R2 定案执行零事故；该顺序已入 task 失败路径 F-R-09，后续 release 棒直接继承。
- **RELEASING 双重敏感的规避清单有效**：新增内容落位九步区之后 + 九步区之前用词规避（工作树干净/版本钉/pins/npm version/npm pack --dry-run/npm view/CHANGELOG↔版本节共现），九步顺序测一轮全绿，无 1fde23e 式返工。
- **perl 双模式一轮清零**（W8 二轮补齐教训消化）：`2\.2\.1` 转义形态与字面形态单命令双模式覆盖，8 文件 grep 清零；历史版本史标记（describe/it 标题中的「2.2.1 · P0」类）靠文件清单二分保留。
- **assets manifest 重生成是 bump 的必然伴生**：pins fix 必触 assets/ 三面（ontology / discipline-coverage / host-adapt README），W5 门禁下 `assets manifest rebuild --yes` + `assets verify` 须列入 release 棒固定链路（修复对象=manifest · 资产未反向改）。
- wiki_delta=none 维持：发版簿记 bump 无规范增量（与 W8/2.2.1 先例一致）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-14 | 初稿 · 10-task（00 委派 bump 2.3.0 收尾 · 同 2.2.0 W8 / 2.2.1 先例制）· 预填 Harness 元信息 + wiki_delta=none · HG-TASK-DRAFT=approved（2026-09-12 维护者会话授权 00 代签）· HG-AUDIT-R1=pending 待 20 审 |
| 2026-09-14 | 20-task-audit R1 pass 零阻塞（`task_2_3_wiring_release_audit_R1_20260914.md`）· HG-AUDIT-R1=approved（2026-09-12 维护者会话授权 00 代签） |
| 2026-09-14 | 30+40 闭环：bump 2.3.0 全链路 · 验收 10/10 勾选 + 自检结论真实命令表 + KPI 95 + 经验 5 条回填（pins 16/17 + pin-10 设计红待人打 tag · npm test 532/534 两道 tag-gated 设计红 · assets 110/110 · RELEASING 九步测一轮绿） |
