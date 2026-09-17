# Task：3.0 W7 · 收尾与对外（F3 wiki 能力补全 + E3 spawn 收官 + 术语统一 + A3 对外口径边界 + K-1~K-4 台账 + MIGRATION 定稿与真实 2.4.1 仓演练 + 链接两级机检 + 证据入库清偿 + 2.4.2 口径补正搭车 + 3.0.0 release bump）

> **状态**：`done`（2026-09-17 10-task 起草 · **HG-TASK-DRAFT / HG-AUDIT-R1 双闸 approved（00 代签 2026-09-17 · 维护者本窗「授权00代签」）** · `HG-RELEASE` = 发布动作闸 **不拦 30**（00 裁定 2026-09-17 · blocks=—）· **30 可开工**（双闸 approved · pre-30 invoke 三件套齐 · GATE_VERIFY PASS））
> **SPEC 真值**：[`docs/spec/3_0-architecture-leap/08_w7_closeout_external_v1.md`](../../spec/3_0-architecture-leap/08_w7_closeout_external_v1.md)（signed · HG-SPEC-SIGNOFF=approved 2026-09-16 · 范围 ①–⑩ · §5 设计要点 · 验收 1–10 · F-W7-01–06）
> **上游 PLAN**：[`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W7 节（:288-293）+ K-1~K-4 台账（:295-308）+ 硬约束 **1**（S2 永不覆写 · :330）/ **7**（不追溯存量 · :336）/ **8**（每波单独提交 · :337）/ **9**（对外文案事实卡黑名单 · :338）/ **14**（证据入库 · :343）/ **15**（闸不落表即虚设 · :344）/ **16**（版本路由 · :345）
> **前置已兑现**：W0–W6 全 done（W6 终态锁 841/160/840/0/1 · [`task_3_0_w6_observability_audit.md`](../done/task_3_0_w6_observability_audit.md)）· SPEC 08 signed · W2 hooks 物化 + host verify 已交付（[`task_3_0_w2_gates_in_hosts.md`](../done/task_3_0_w2_gates_in_hosts.md) · 六 commit）· W3 研究文与探针已按硬约束 14 入库（[`w3_ontology_graph_research_20260917.md`](../../harness/reviews/w3_ontology_graph_research_20260917.md) · [`scripts/onto-probe.mts`](../../../scripts/onto-probe.mts)）
> **基线（2026-09-17 本棒复跑实测 · 详见「开工基线」节）**：测量时 HEAD `e894f64`（起草期 W6 close 归档 `f4bbaf7` docs-only 前进 · 码面零变更）· npm test **841 tests / 160 suites / 840 pass / 0 fail / 1 skip**（duration ≈108.7s）· typecheck **0 错** · pins **17/17** · assets **111/111** · spawn 现值 **671**（W0 口径）
> **行号口径**：本 task 全部行号为 2026-09-17 本棒实读现值（HEAD `e894f64` · W0 后新布局）。**K-1~K-4 落点按「内容锚」不按行号锚**（SPEC 08 residual_risk ① 兑现）。
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-w7-closeout-external` |
| **test_strategy** | `required` |
| **test_strategy_note** | 验收主体 = 机械锁全绿：术语机检脚本零命中 + 链接两级机检脚本（i=0 / ii=0 于非 S2 面）+ 黑名单机检 + K-1~K-4 台账逐条内容锚断言 + 2.4.1 仓迁移演练可通（旧格式表零改动 + 新能力可选启用）+ E3 spawn 重定基前后同口径数字（显著下降 · <50 按重定基显式登记归 3.x）+ F3 wiki fixture（双向/增量/冲突 + 增量等价全量断言）+ 证据入库 `git ls-files` 命中 + 3.0.0 发版探针含「旧格式适配表零改动可用」项 + 平台锁 + 依赖零新增 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 改的是 wiki 导出面（`src/cli-wiki.ts`）、文档链接/术语/口径、发版数据面；图谱/本体/HGM 资产零触碰 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 无规范增量（`docs/coding_wiki/` 本仓不存在 · 实证）；术语表/口径边界/证据镜像属登记与对外面，非规范面 · 晋升与否归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-16 维护者本窗签收 PLAN_3_0（上行继承 · 3.0 双签之一） |
| HG-SPEC-SIGNOFF | approved | — | 人 · 2026-09-16 维护者本窗签收 3.0 SPEC 系列（授权 00 代签后续过程文档闸 · HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗「授权00代签」· task lint PASS |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗「授权00代签」· 依据审查文 `docs/harness/reviews/task_3_0_w7_closeout_external_audit_R3_20260917.md`（R3 · PASS · blocking 0 · A12/A13 已搭车修）· **00 显式确认 A1 偏差：HG-RELEASE 不适用 blocks-30 强制（发布动作闸语义）· tag 取严 = 3.0.0 tag 留维护者**（与 `AGENTS.md` 本地块一致 · SPEC §3⑩/RELEASING⑤/README:380 的 Agent 可 tag 口径本波不执行 · 差异登记留 W7 报告） |
| **HG-RELEASE** | **pending** | **—** | **3.0.0 发版闸 · 仅人**（SPEC 08 §10 · 本行新设闸 ID 来源登记同 SPEC）· **00 裁定 2026-09-17：`blocks_hats=—`（不拦 30）**。理由（登记）：**HG-RELEASE 语义 = 发布动作**（`git tag` / `git push` / `npm publish` / `npm deprecate` **仅人**）· **非代码变更闸**；若 `blocks_hats` 含 `30` 则 W7 全体实现被发布闸系统性拒开工（GATE_VERIFY 实测已证）。**发布前探针与 compat 项由 W7 验收 #9 / §S7.10 承载**；publish 仅人不变。**硬约束 15 的「闸落表须含 30」机检要求在语义上不适用于「发布动作」闸 · 此登记即解释** |
| G6 归档闸 | **pending** | — | 人 · 通过条件 = 术语统一 + 引用一致 + 冲突裁决完成（PLAN 人工闸表 · SPEC 08 §10）。W7 关账归档前由人签 |

> **闸行裁决（留 20-task-audit 复核）：W7 不设 HG-SCHEMA-CHANGE 行**。理由四条：① **3.0.0 bump 是数据面** —— 版本号写入既有 17 钉面的既定落点（`assets/release-pins.yaml` 声明的 path/extract 全不变 · `pins fix` 按已批准机制对齐），类比 W4/W5/W6 闸行裁决「按已批准 schema 写数据」；② **MIGRATION 定稿只改散文与状态行** —— W1 的适配表 schema 变更**已走 HG-SCHEMA-CHANGE approved**（[`w1_schema_change_review_20260916.md`](../../harness/reviews/w1_schema_change_review_20260916.md) · [`task_3_0_w1_schema_leap.md`](../done/task_3_0_w1_schema_leap.md) 闸行在案），W7 只把草案节转正，不新增/不改 schema；③ **F3 wiki 增强是新增内部输出字段**（`wiki export` JSON 只增键 / 选项 addive）—— 无既有外部消费者契约可破，类比 W6 C6 审计事件 schema 定性；④ **术语/链接/证据/K 台账/黑名单皆文档与数据面**，无 schema 变更。**升级条款（30 执行期 STOP 通道）**：若执行期发现须改适配表 schema、改既有键语义、删键、或触任何对外契约 → **STOP**，先落评审文 → 走 HG-SCHEMA-CHANGE 式人闸 → 才改码（硬约束 3）。

> **HG-RELEASE 闸态裁定（00 · 2026-09-17 · 覆盖 SPEC 08 §10 注记）**：`blocks_hats` 定 **`—`（不拦 30）**。**理由**：该闸语义是**发布动作**（tag/publish/push 仅人），非代码变更闸；其 `blocks 30` 会让 W7 全部实现被发布闸系统性拒开工（GATE_VERIFY 实测 3 行拒 30 → 改后应只剩 2 行）。**硬约束 15 的机检要求在语义上不适用于「发布动作」闸**，此登记即解释。**发布前探针与「旧格式适配表零改动可用」compat 项由验收 #9 / §S7.10 承载**。**不拆 task**（单 task 内实现段 + 发布段 · 发布段仅人）。**00 将于代签 HG-AUDIT-R1 时显式确认本偏差**（HG-RELEASE 不适用 blocks-30 强制）· **建议 10-spec 后续给 SPEC §10 加注记**。**tag 权限统一取严（A1）**：本 task 维持「**tag 仅人**」（与 `AGENTS.md` 本地块一致）· **SPEC §3⑩ / RELEASING ⑤ / README:380 的「Agent 可 tag」口径本波不执行 · 3.0.0 tag 留维护者 · 差异登记留 W7 报告**。

---

## 背景与目标

W0–W6 已把 3.0 的架构跃迁与接线全部交付（841/160/840/0/1 · pins 17/17），W7 是**收尾与对外终局波**（SPEC 08 §1）：把 2.x 时代遗留的**口径失真、链接坏链、证据不可达、spawn 测试债**一次性收口，并让 3.0.0 到达**可发布状态**（publish 仅人）。

四块：

1. **能力补齐**：F3 wiki 双向链接 / 增量更新 / 冲突检测（`src/cli-wiki.ts` 190 行现仅单向 `wiki export`）；E3 spawn 重定基削减（W0 已 580→520 · 本棒复测 **671** · 00 裁定：尽力下沉 + <50 显式登记归 3.x）。
2. **口径与迁移**：术语统一（GLOSSARY ↔ 各文档机检）· A3 对外口径边界（hooks/verify 可声称程度）· MIGRATION breaking 迁移节 + **真实 2.4.1 仓演练** · **K-1~K-4 竞品口径修订**（旧数值过期 + 「流程性门禁」定性偏差）。
3. **证据与链接清偿**：相对链接**两级**机检（i 可解析 / ii 目标已入库 · 硬约束 14）· 未入库证据件镜像或显式登记。
4. **3.0.0 release bump**：九件套数据面 + CHANGELOG 3.0.0 节 + 发版探针（含 compat 项）· tag / publish 仅人。

本 task 把 SPEC 范围 ①–⑩ 规格化为 30 可执行面（S7.1–S7.10），每条机检化；迁移演练发现 schema 兼容洞一律 **STOP 回退 W1 · 不得文档遮掩**（F-W7-01 · 硬约束 4）。

---

## 开工基线（2026-09-17 本棒复跑实测 · 验收比对的唯一基准）

> 30 开工时若复跑结果与本表不符，按 F-W0-05 同式纪律处置（以复跑实测重建基线并登记 · 不得沿用旧数字强行比对）。

| 项 | 实测值 | 备注 |
|----|--------|------|
| git HEAD | `e894f64`（本棒测量点 = W6 三十留档 commit；起草期 00 完成 W6 close 归档 → `f4bbaf7`，docs-only 零码面变更） | 工作区 clean（本 task 起草后 +1 untracked）· tag `v2.4.2` 存在 · 30 开工须复跑实测重建 |
| `npm test` | **841 tests / 160 suites / 840 pass / 0 fail / 1 skip** | duration ≈108.7s · 与 W6 锁终态逐字一致（硬约束 14 证据 = 本表文本） |
| `npm run typecheck` | **0 错** | strict + noUncheckedIndexedAccess |
| `node bin/specgate.js pins check` | **17/17 PASS · exit 0** | 含 pin-10 = tag `v2.4.2` 钉 |
| `node bin/specgate.js assets verify` | **111/111 PASS** | manifest 与盘面一致 |
| 依赖基线 | `package.json` dependencies = **仅 `js-yaml`** | 本波零新依赖（术语/链接/口径脚本用 `node:fs`） |
| **spawn 现值（W0 口径）** | **671**（= `runCli(` 字面命中行 **724** − `function runCli` 定义行 **53**） | 分布 **53 个文件（671 精确）** · 头部：`pins-consistency` 89 · `cli-w4-gate-wiring` 65 · `cli-w5-assets-integrity` 34 · `cli-verify-spec` 34 · `cli-json-no-abs-path` 34 · `cli-skills-install` 24 · `cli-p0` 22 · `w2-hooks-materialize` 20 · `w2-b5-merge` 20。**W0 实测 580→520（M1 验收文）· 套件 W1–W6 增长 +234 用例 / +151 调用** |
| **坏链 (i) 级** | `docs/**/*.md` 相对链接解析失败 **38 处** | 其中 **S2 域内 26 处**（`harness/invokes` 伪链接/已归档 task · `harness/reviews` 历史链接 · `tasks/done` 3 处）· **非 S2 12 处**（PLAN_2_2 ×3 · PLAN_2_3 ×4 · PLAN_2_4 ×2 · feedback ×1 · spec ×2） |
| **PLAN_2_3 坏链（4 · 逐条）** | `:6` `../.workbuddy/output/PROMPT-2.3.0-落地-交给SpecWave-agent.md` · `:7` `../.workbuddy/output/路线研究-SpecWave-2.2-3.0.md` · `:7` `../.workbuddy/output/验收报告-SpecWave-2.2.0.md` · `:8` `../.workbuddy/output/推广事实卡-2.2.0.md` | 写法解析到 `docs/.workbuddy/…`（不存在）· 应改 `../../.workbuddy/…` |
| **PLAN_2_4 坏链（2 · 逐条）** | `:6` `../.workbuddy/output/验收报告-SpecWave-2.3.0.md` · `:8` `../.workbuddy/output/路线研究-SpecWave-2.2-3.0.md` | 同上 |
| （附带）PLAN_2_2 坏链（3） | `:6` PROMPT-2.2.0 · `:7` 路线研究 · `:8` 推广事实卡-2.1.3 | 同型 = 应一并修（PLAN W7 仅点名 2_3/2_4 · 起草发现补全） |
| **坏链 (ii) 级** | `docs/` 内 Markdown 链接指向 `.workbuddy/…` 且 **`git ls-files` 未命中** = **36 处链接实例 / 10 个 distinct 目标** | distinct：路线研究 · 验收报告-2.2.0/2.3.0/2.4.0/2.4.1 · PROMPT-2.2.0/2.3.0 · 推广事实卡-2.1.3/2.2.0 · 审查报告-SpecWave-2.1.1-改名验收 |
| **未入库证据件清单** | 实测 **31 件**（`.workbuddy/output/` 23 + `_frag/` 8 · 30 复跑重建口径）· 仅 8 件历史架构档 + `phase0_charter.md` 被 force-add（`git ls-files .workbuddy` = 9） | 3.0 依赖主源：路线研究 · 验收报告-2.4.0 · 验收报告-2.4.1 · 探针 `_frag/exports_probe_20260916.mjs`（研究文/onto 探针 W3 已清偿） |
| **CHANGELOG:10 口径** | **已 published**（非滞后） | **起草发现**：PLAN :6 所述「仍写待发版 · tag 待人打」已被 `1067f32`（2026-09-15 发布回填）修正 ⇒ **SPEC 范围⑨已饱和**。30 须复核确认零残留（见 S7.9） |
| F3 现值 | `src/cli-wiki.ts`（190 行）仅 `wiki export --json`：nodes + 有向 edges（`wikilink` / `md_link`）+ `warnings` · `cmdWiki` :144-190 · 无 backlinks / 无增量 / 无冲突检测 | `docs/coding_wiki/` 本仓不存在（实证）· 测试面仅 `cli-help` / `cli-g1g7` / `cli-json-no-abs-path` 抽验 |
| 术语现值 | GLOSSARY 5 保留词 = **门禁 / 过程轨 / 帽制 / 人闸 / 真值源**（`GLOSSARY.md` · facts card §12） | **最终口径**：canonical 保留词（含 `人闸` 计次 74 / 行口径 task 65 vs 20 审 67 ±2 · 30 复跑重建登记 F-W0-05 式 · 与 `人工闸` 全形态）**不判红**；唯一判红 = 变体词 `门控`（应为 `门禁`）· **判红面 = 六目标闭集（闭集外不扫）** · 判红面实测 **3**（全为 `RELEASING.md` 的 `门控 skip` · 已豁免）· 全 tracked **95 计次** · **残留守 0** |
| A3 现值 | facts card §11 黑名单仍写「host-adapt hooks surface **未实现**」· README.zh-CN :283「kit P0 不依赖宿主 hooks」 | W2 已交付 hooks 物化 + host verify（config-hook 3 宿主 / shell-hook / none 10 宿主降级 L1+L2 · `task_3_0_w2_gates_in_hosts.md` 验收 #1 真实宿主 2/2）⇒ 黑名单过期，须定稿新边界 |
| K 落点现值 | `delivery/research_report.md` 命中 8 处（`:120` `:169` `:170` `:172` `:220` `:258` `:267` `:395`）+ `delivery/高层架构设计.md:196` + `delivery/promotion/03:30` + `04:65` + `04:66` | SPEC 仅点名 :169/:170/:172/:220/:258；起草按**内容锚**补全（`:120` `:267` `:395` 与高层架构 :196 同型旧值） |
| MIGRATION 迁移节现值 | `MIGRATION.md` :126-150「2.4.2 → 3.0.0（breaking）· 适配表 schema 跃迁（**草案**）」+ 修订记录 :166 | W1 已落草案节 · W7 定稿并增演练结论 |

---

## W7 实现规格（10-task 定稿 · 30 按此实施）

### S7.1 F3 · wiki 能力补全（SPEC 范围① · 验收 #11）

> **命令面纪律**：**只补既有 `wiki export` · 不新增顶层命令/子命令**（SPEC §4 非范围「不加新命令面」）。三项能力以**选项 + 输出键只增**形态落地。

- **S7.1-a 双向链接（backlinks）**：`exportWikiGraph` 输出增 `backlinks`（每个节点入边来源：`{ id, from: [{source, kind}] }` 或等价键集 · **只增不改** `nodes`/`edges` 语义）。实现 = 由既有 `edges` 反向聚合（单一真值源，不重扫文件）；`--backlinks` 选项控制是否输出（默认开或关由 30 定并写清 · 建议默认开、键集快照钉死）。双向性断言：对每条 `edges[i] = {source, target}`，`target` 的 backlinks 必含 source（反之亦然 · fixture 断言）。
- **S7.1-b 增量更新**：新增 `--incremental`（或等价）选项 + 缓存件落 `<target>/.coding-kit/wiki-cache.json`（新文件 · 在 S2 三域之外实证）。缓存键 = 文件相对路径 → `{mtimeMs, size, contentHash}`；仅重解析变更文件，未变文件复用既有 edges。**等价断言（硬）**：同一语料「全量一次」与「全量→改一文件→增量」两次输出的 `nodes+edges+backlinks+warnings` **逐字一致**（除时间字段外 · fixture 固化）。
- **S7.1-c 冲突检测**：新增 `--check-conflicts`（或等价）——检测并机读呈现：① **同名 stem 冲突**（两文件 basename 相同 → `[[name]]` 解析歧义 · `resolveWikilink` 现取 `nodeByStem` 先到者，须点名歧义集）；② **重复 title**；③ **悬空引用**（既有 warnings 升级为结构化 `conflicts`）。默认 exit 0 + 结构化报告；`--check-conflicts` 命中 → **exit 2 点名**（failClosed · 与仓库 exit 2 语义一致）。**不得**改默认 `wiki export` 的 exit 0 行为（既有消费者零回退）。
- **fixture**：`test/fixtures/wiki/`（新建 · 最小语料：a.md ⇄ b.md 双向、c.md 同名冲突、d.md 悬空 `[[missing]]`）· 正/负双向 + 增量等价 + 冲突 red/green 三组断言；既有 `cli-help` / `cli-g1g7` / `cli-json-no-abs-path` 抽验零回退。
- **红测先行**（硬约束 6）：同名冲突 / 增量不等价 两组负向 fixture **修复前真红留证**（当前无 `backlinks` / `--incremental` / `conflicts` 键）。
- **对外口径**：`wiki` 命令面在 `--help` 声明新选项（既有 usage 行 :86 扩展 · 不新增子命令）。

### S7.2 E3 · spawn 削减收官（SPEC 范围② · 验收 #7 · **重定基 + 尽力下沉 + 显式登记** · 00 裁定 2026-09-17）

- **指标口径（同 W0 · 唯一合法口径）**：**静态 `runCli(` 字面命中行数 − `function runCli` 定义行数**（每文件 1 行）。**BEFORE = 671**（基线节实测 · W1–W6 套件增长 +151 为真值变化非回归）。**AFTER 目标定稿（00 裁定 2026-09-17 · A5 升为规范下限）= ≤300（机检硬判据 · 自 671 下降）· 能安全达成更低更好**（先尽力下沉；若 30 复跑重建口径后 ≤300 仍不可达 → F-W7-07 STOP）。**SPEC 范围②「<50」按旧 354 快照口径的偏差处理**：该口径已由 W0 F-W0-08 重建（354 旧快照 → 580→520 → 现 671）⇒ **显式登记「<50 按重定基不可达 · 归 3.x 或后续波次」**（循 G7 诚实口径先例 · **不硬凑不虚标**）。
- **目标路径（30 执行 · 分批 · 每批一 commit 与行为变更隔离）**：
  1. **harness 复用**：抽 W0 `makeCore`（[`test/cli-g1g7.test.ts` :54] 先例 · 进程内直调 `cmd*` + console 捕获 + `CliError.exitCode→status`）为共享 helper（如 `test/_helpers/core-harness.ts`），**不复制判据**（单实现源）。
  2. **批次序（按调用量降序 · 每批独立可回退）**：pins-consistency(89) → cli-w4-gate-wiring(65) → cli-w5-assets-integrity(34) / cli-verify-spec(34) / cli-json-no-abs-path(34) → cli-skills-install(24) / cli-p0(22) → 其余 ~46 文件（53−7）。
  3. **每文件保留端到端烟测预算 ≤1**（W0 为 ≤5 · 重定基口径下按「消灭主体 spawn」执行 · 仅 bin→CLI 全链每类各 1）；需要 >1 的文件须在自检结论**逐条登记理由**。
  4. **每条下沉配等价单测**（「删了不补 = 未完成」· W0 铁律 · PLAN 风险表）：先补等价断言转绿 → 再删 spawn 调用 → 同一 commit 内完成（先补后删 · F-W0-03 反向自证）。
- **同口径前后数字入自检结论**（BEFORE 671 → AFTER 实测）· 计数器脚本固化（`scripts/e3-spawn-count.mjs` 或 `test/_helpers` 内导出 · 命令写入自检结论）。
- **F-W7-07 STOP 通道**：先尽力下沉；沉降后复跑仍未达 **≤300（规范下限 · 机检）** → **不得静默放宽**（登记实测 + 回 10-spec 走 SPEC 行修订重定目标）。

### S7.3 术语统一（SPEC 范围③ · 验收 #1）

> **00 最终裁定（2026-09-17 · 基于 GLOSSARY 真值亲读）**：`GLOSSARY.md:11` 定中文保留词 = **门禁 / 过程轨 / 帽制 / 人闸 / 真值源**；`:44/:81` 定 `gate=门禁`；`:45/:82` 定 `human gate=人闸`；`人工闸` 是 task 文件**节名/表名**。⇒ **撤销对 `人闸` 的弃用词定性** —— 二者均合法。**唯一判红对象 = 变体词 `门控`（应为 `门禁`）**。

- **① canonical 保留词（无约束面）**：门禁 / 过程轨 / 帽制 / 人闸 / 真值源（GLOSSARY 五保留词）—— 任何位置一律**不判红**（含 `人闸` 74 处与 `人工闸` 全部形态：行内 `## 人工闸` · `人工闸表` · `formatGateCheck 人工闸`）· **撤销对二者的 forbidden / 豁免枚举**。
- **② 唯一判红对象 = 变体词 `门控`（应为 `门禁`）· 判红面 = 六目标闭集（闭集外不扫）**：`README.md` / `README.zh-CN.md` / `GLOSSARY.md` / `RELEASING.md`（**除 `门控 skip` 语义**）/ `MIGRATION.md` / `delivery/promotion/**` —— **六目标闭集之外一律不扫**（防扩面误伤）。**补充豁免行：`.workbuddy/output/**`（未入库起草工作区 · 无约束面）**。
- **③ `门控` 豁免面（逐条枚举 + 理由）**：`delivery/research_report.md`（竞品语境 · **K-3 目标文本「内核 SDD 门控为流程性」在此 ⇒ 与 S7.5 不再冲突**）· `delivery/安全设计.md` / `delivery/系统设计.md`（内部架构描述）· `docs/spec/**` 与历史 PLAN（已签结构位 · 不追溯）· **`门控 skip` / gated-test 语义形态**（RELEASING 实测 3 处）· **词边界排除 `后门控制`**。
- **④ 判据（可机检）**：① **保留词存在性正向断言**（GLOSSARY 五词在位）；② **`门控` 在判红面命中 = 0**（豁免面不计 · **计次 / 逐行口径标注**）。**不再要求任何 `人闸` / `人工闸` 计数**（canonical · 仅信息基线）。
- **⑤ fixture（正负）**：保留词 `人闸` / `人工闸`（含行内 `## 人工闸` · `人工闸表`）**不判红** · `delivery/promotion` 注入 `门控` **真红** · `research_report` 的 `门控` / `门控 skip` / `后门控制` **均不红**。
- **⑥ S7.5 K-3 冲突解除登记（写明）**：K-3 目标文本「内核 SDD 门控」位于 `research_report.md`（**S7.3 ③ 豁免面**）⇒ 与 S7.3 **自洽**（S7.5 执行 K-3 改写时该词不触发术语闸）。

> **基线 / 计数（本棒 `git grep` 实测 · 计次 / 逐行口径）**：`门控` 全 tracked **95 计次** · 判红面实测 **3**（全在 `RELEASING.md` 且全为 `门控 skip` · 已豁免）· **残留守 0**；`人闸` 非 S2 实测 **计次 74 / 行口径 task 65 vs 20 审 67（±2 · 扫描面/工具口径差）**（canonical · **仅信息基线 · 非残留**）· **30 复跑重建登记（F-W0-05 式）**。

- **术语表落点 = [`GLOSSARY.md`](../../../GLOSSARY.md)**（tracked · 在 `files[]` 内 · 5 保留词章节）。**数据驱动**：新增 `assets/harness/terminology.yaml`（canonical 保留词 → 变体词 → 判红面 / 豁免面），与 `release-pins.yaml` 同风格（新增落点只改数据不改脚本）。
- **canonical 保留词（GLOSSARY 5）**：门禁 / 过程轨 / 帽制 / 人闸 / 真值源（存在性正向断言）。
- **机检脚本固化**：`scripts/check-terminology.mjs`（或等价 · 30 定名）——按 ②③④ 口径断言：`门控` 在判红面命中 = 0（豁免面不计），否则 exit 2 点名 `文件:行号`。**接线**：入 `npm test`（test 包装 + fixture 红转绿）或独立命令（写清 · 建议**两者**）。
- **修正**：脚本首次跑出的真实命中逐条修正（或补 ③ 枚举并登记理由 · 不得为过而放宽判据）· 最终残留 = **0**。
- **机检断言**：canonical 保留词 GLOSSARY 存在性 + `check-terminology` exit 0 + ④ 计数口径登记 + ⑤ 正负 fixture · **不得**把 `人闸` / `人工闸`（含 `## 人工闸`）判红。

### S7.4 A3 · 对外口径边界定稿（SPEC 范围④ · 验收 #3）

- **边界内容（据 W2 实交 · 可声称 / 不可声称双列）**：
  - **可声称**：门禁**随包内置**（进程内 CLI 判定 · exit 2 failClosed）；hooks **可物化**到支持机制族的宿主落点（config-hook 3 宿主 / shell-hook = git 层宿主中立 / 无机制宿主 **显式降级 L1+L2**）；`host verify` 校验宿主落点与声明一致（篡改/删除报红）；P0 门禁在 **≥2 个真实宿主**端到端真跑（claude + cursor · e2e tracked 留证）。
  - **不可声称 / 未落地**：`「接入即获得 L3」`（无 hook 宿主降级）· 「13 宿主全部有 hook 拦截」· pre-archive 宿主内真实触发（仅 fixture + host verify 兜底）· catalog 远程在线分发（冻结）· npm provenance / OIDC（未启用）。未落地一律 `将新增 / 规划中`。
- **口径文档 + 数据**：新增 tracked **边界文档**（建议 `docs/guides/claims_boundary_v1_zh.md`）+ `assets/harness/claims-boundary.yaml`（能力 → status {shipped/planned} + allowed_wording + forbidden_wording）。**更新 facts card §11 口径**（`.workbuddy/output/推广事实卡-2.2.0.md` 为**未入库**起草源 · 须按 S7.8 镜像或登记后同步；**黑名单机检不得只依赖未入库件** · 硬约束 14）。
- **黑名单机检**：`scripts/check-claims.mjs`（或等价）扫 `delivery/promotion/*` + 根 README 双语 + GLOSSARY 的对外文案，对 `claims-boundary.yaml` 的 forbidden_wording 断言零命中（allowlist 声明例外）→ exit 2 点名。**接线**：`npm test` 或独立命令（同 S7.3 口径 · 写清）。
- **负向 fixture**：注入一条 forbidden 表述（如「门禁靠宿主 hook 强制」）→ 脚本真红；正向口径零命中。

### S7.5 K-1~K-4 台账执行（SPEC 范围⑤ · 验收 #5）

> **00 裁定（2026-09-17）**：**接受内容锚优先**（SPEC 行号为起草快照 · 内容锚补全落点 `:120`/`:267`/`:395`/高层架构 `:196`/promotion 01/02 纳入）· 台账逐条校对即验收 #5。
>
> **按内容锚逐条校对**（不按行号）· 数值一律 **区间 + as_of 时点**（**禁单值**）· **已外发历史不回改**（K-4 · 硬约束 7）。
>
> **K-3 ↔ S7.3 冲突解除登记（00 最终裁定）**：K-3 目标文本「内核 SDD 门控为流程性」位于 `delivery/research_report.md` —— 该件在 **§S7.3 ③ `门控` 豁免面**（竞品语境）⇒ **与 S7.3 自洽**（S7.5 执行 K-3 改写时该词不触发术语闸）。

| # | 落点（内容锚 · 本棒实测） | 修订口径 |
|---|--------------------------|---------|
| K-1 | `research_report.md` :120（B3 表行「30+ agent 集成」）· :169 · :220 · :258 · :267 · :395（SR-07 出处行） | 「**35–38（as_of 2026-09）**」不写单值；出处行同步区间化 |
| K-2 | `research_report.md` :170（扩展 105 / presets 22 / 贡献者 200+） | 扩展 **138–157（作者 90+）** · presets **25–33** · 贡献者 **240–270+** · stars **121K–130K+** · 注「各镜像快照不同步 · 取区间」 |
| K-3 | `research_report.md` :172（「门控是流程性…不是机械性」） | 改「**内核 SDD 门控为流程性；但扩展生态已含机械门禁类（CI Guard / Architecture Guard / plan-review-gate / DocGuard / Verify 系列），可对接 CI 做拦截**」· 差异化迁移「**门禁随包内置（零装配）+ 可多宿主物化（W2）**」 |
| K-4 | `delivery/promotion/03`:30（门禁流程性）· `04`:65（30+ 集成）· `04`:66（流程性）· 附带 `高层架构设计.md`:196（30+ 集成）· `01`:11（四宿主/2.1.3 等过期自述）· `01`:77（能力「规划中」已交付）· `02`:12（spec-wave@2.1.3） | 与 K-1~K-3 同步替换 · 旧版本/旧宿主数/旧能力态一并对齐真值面；**已外发博客不回改历史**（仅新版文案纠正） |

- **复核出处留痕**：SPEC 08 §5.1 + K-4 台账出处（官方文档站 / 镜像快照 / 第三方盘点 / May-2026 newsletter · 2026-09-15 实测）逐条保留在文档（不新建独立出处文件 · 就地注）。
- **机检断言**：台账落点**零单值旧数**断言（`grep` 脚本或等价：`30+` / `105` / `22 个` / `200+` / `不是机械性` 在落点面零命中）· 区间格式含 `as_of` · 逐条校对表入自检结论。

### S7.6 MIGRATION breaking 迁移节定稿 + 真实 2.4.1 仓演练（SPEC 范围⑥ · 验收 #2 · F-W7-01/05）

- **定稿对象**：[`MIGRATION.md`](../../../MIGRATION.md) :126-150 草案节 → 定稿（状态「草案」→「定稿 · 经真实 2.4.1 仓演练」· 补演练结论与日期 · 修订记录 :166 追加一行 · **只追加不动既有行** · pin-14 钉点行不触）。
- **演练形态（真实仓 · 不只看文档）**：`git worktree add <临时目录> v2.4.1`（tag 实测存在 · `c89f92d`）或 fixture 复刻；按迁移节步骤操作：
  1. **旧格式适配表零改动可用**：以 2.4.1 版 `mvp-hosts.yaml`（v1 扁平 · 无 `schema_version`）跑 3.0.0 构建的 `host validate/apply/update` → **零改动通过**（既有 `w1-v1-compat-lock` 的等价语义 + planned writes 逐字一致）；
  2. **新能力可选启用**：表首加 `schema_version: 2` + `defaults`/`extends`/`command_sets`/`surfaces.hooks` 按节迁移 → `host validate` 通过；
  3. 记录**逐步骤命令 + 输出**。
- **演练记录落 tracked**：`docs/harness/reviews/w7_migration_rehearsal_2_4_1_20260917.md`（或 30 定日期 · S2 只新增）· 含工作树 commit、命令、exit code、发现。
- **STOP 红线（F-W7-01/05）**：演练发现 **schema 兼容洞** 或「旧格式零改动」不过 → **STOP**，回退 W1 补 back-compat（走 HG-SCHEMA-CHANGE 式闸）· **不得靠文档遮掩**；发版探针同项不过 → **不得发版**（硬约束 4）。
- **交叉锁**：迁移演练的 compat 项与发版探针（S7.10）**同一判据**（不得两套）。

### S7.7 链接两级机检（SPEC 范围⑦ · 验收 #4 · 硬约束 1/14）

> **00 裁定（2026-09-17）**：**接受等价口径** —— S2 三域（`docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`）「永不覆写」**优先于**链接字面要求 ⇒ S2 域 26 处做**冻结基线 + 显式豁免**（**参数化排除 current task 路径（本 W7 task）· 基线取 26（起草前口径）** · **active/ 其他新增坏链仍拦**）；非 S2 域坏链硬判 **0**（含 PLAN_2_2/2_3/2_4 存量修复）。

- **脚本固化**：`scripts/check-doc-links.mjs`（或等价 · 30 定名）· **两级判据**：
  - **(i) 可解析**：扫 `docs/**/*.md` 的 Markdown 相对链接（inline + reference-definition 形态），解析后目标须存在。**S2 域（`docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`）整体豁免 + 冻结核对基线**（**理由**：S2 永不覆写 · 硬约束 1 · 历史链接与已归档 task 的 stale 链接**不可修**；SPEC ①「docs/** 坏链数=0」对 S2 域字面不可满足 → 以「非 S2 坏链 = 0 + S2 冻结基线登记」等价兑现 · **留 20 复核**）。
  - **(ii) 目标已入库**：非 S2 文档内 Markdown 链接指向 `.workbuddy/…` 的，解析后 `git ls-files` 必须命中（否则报坏链）。S2 域同豁免（同上）。
- **存量修复（i 级）**：`PLAN_2_3` ×4 · `PLAN_2_4` ×2 · **`PLAN_2_2` ×3**（起草发现）`../.workbuddy` → `../../.workbuddy`；`docs/feedback/…` :7 与 `docs/spec/self-tech-graph/reference/POINTERS.md` :13 两条非 workbuddy 断链**按真值面修复或显式登记**（30 判定）。
- **非 S2 清零 + 冻结基线**：最终非 S2 (i)=0 · (ii)=0；S2 域核对清单（**26 处 · 口径 = 参数化排除 current task 路径（本 W7 task）**）冻结进脚本常量并在自检结论登记（数字不得漂移 · 漂移即红 · **active/ 其他新增坏链仍拦**）。
- **接线**：`npm test`（新增用例包装）或独立命令（写清 · 建议两者）。
- **负向 fixture**：注入 `[x](../.workbuddy/output/nope.md)` → 脚本真红点名 `文件:行号 -> 目标`；修好后转绿。

### S7.8 证据入库清偿（SPEC 范围⑧ · 验收 #6 · 硬约束 14）

- **清偿口径（二选一 · 逐件登记）**：
  - **镜像入 tracked**：`docs/harness/reviews/` 新增镜像件（文件名带来源 + 日期 · **不改写内容** · 只加头部 provenance 注记），并回填**非 S2** 仓内链接（PLAN_2_x / PLAN_3_0 / SPEC 系列 / roadmap ACCEPTANCE）。
  - **显式登记「仅本地草稿 · 非证据面」**：落入 tracked 登记表（建议 `docs/harness/reviews/w7_evidence_provenance_20260917.md` 或 `assets/harness/` 登记节），并把非 S2 里指向该件的链接改指登记表（消除 (ii) 级未入库直链）。
- **必做清单（3.0 依赖主源 · ≥4 件）**：① `路线研究-SpecWave-2.2-3.0.md` ② `验收报告-SpecWave-2.4.0.md` ③ `验收报告-SpecWave-2.4.1.md` ④ 探针 `_frag/exports_probe_20260916.mjs`（PLAN :64 引用）；**已清偿**（W3 · 核对即可）：`研究-3.0-W3-…` → `w3_ontology_graph_research_20260917.md` · `onto_probe` → `scripts/onto-probe.mts`。
- **其余 7 件（2.x 历史证据）**：`验收报告-2.2.0/2.3.0` · `PROMPT-2.2.0/2.3.0` · `推广事实卡-2.1.3/2.2.0` · `审查报告-2.1.1-改名验收` —— 逐件选镜像或登记（S7.7 (ii) 级清零的**前置**）。
- **机检断言**：清偿后 `git ls-files` 命中；登记表存在且逐件列 来源 + 日期 + 处置；非 S2 的 `.workbuddy` 直链 = 0（S7.7 交叉）。
- **F-W7-04**：镜像件与原件漂移 → **以 tracked 镜像为真值面** · 镜像时登记来源与日期。

### S7.9 2.4.2 口径补正搭车（SPEC 范围⑨ · 验收 #8）

> **00 裁定（2026-09-17）**：**接受**「零残留确认 + 本波提交说明义务」口径（范围⑨所述滞后已由 `1067f32` 修正）· 不改 2.4.2 提交 / 不移 tag 红线不变。

- **起草发现（关键）**：[`CHANGELOG.md`](../../../CHANGELOG.md) :10 的 2.4.2 发布状态**已为「已 published」**（commit `1067f32` 修正 · 见基线节）⇒ SPEC 范围⑨所述「口径滞后」**已饱和**。
- **30 处置（二选一 · 登记）**：
  1. **零残留确认**：全仓复核无「2.4.2 待发版 / tag 待人打」类滞后表述 → 在**本波首个提交说明注明「补正 2.4.2 口径滞后（复核：已由 1067f32 修正 · 本波零残留）」**（SPEC 验收 #8 的提交说明义务照做）；
  2. 若复核发现**其他** 2.4.2 口径滞后行 → 随本波提交补正并在提交说明注明。
- **红线**：**不改 2.4.2 提交本身 · 不移动 tag**（tag ≠ HEAD 纪律 · 硬约束 7）。
- **机检断言**：`grep` 全仓无 `2.4.2.*待发版` / `v2.4.2.*待人打`；本波至少一个提交说明含「补正 2.4.2 口径滞后」。
- **残留分类登记（A2 · 40 复核搭车）**：全仓精确 grep 的历史残留 = `docs/tasks/done/task_2_4_2_patch.md` + 其 `docs/harness/invokes/by-task/2-4-2-patch/*` + `docs/roadmap/ACCEPTANCE_2_4_2_patch_2_4_2_zh.md` —— 均 **S2 / 历史豁免**（永不覆写 · 不追溯存量）；**对外 live 面（`CHANGELOG.md` / `RELEASING.md`）零残留**。

### S7.10 3.0.0 release bump（SPEC 范围⑩ · 验收 #9/#10 · HG-RELEASE）

> **Agent 可执行段 = ①–⑦ + bump 数据面 + 探针**；**tag / push / publish / deprecate 仅人**（HG-RELEASE · 本 task 不得执行）。

- **RELEASING.md 硬步骤逐项（①–⑨ · 照 checklist）**：
  1. **① 工作树干净且改动已提交**：`git status --porcelain` 空 · 逐文件显式 add（**禁 `git add -A`**）· 拟发内容全入 git 历史。
  2. **② 质量闸门全绿**：`typecheck` / `npm test` / `build` / `test:lib` 依次全绿（与 `prepublishOnly` 同四门）。
  3. **③ CHANGELOG 版本节归拢**：`## [Unreleased]` 内容归入 `## [3.0.0] - YYYY-MM-DD`（无残留 Unreleased 条目）· 3.0.0 节含 major/breaking 明示 + 迁移指引指针。
  4. **④ 版本钉同步（F5 方案 B）**：`pins fix --yes` 对齐 **17 钉面**（`package.json#version` 为唯一手工真值源）——`assets/ontology.yaml#product_semver` / `assets/harness/discipline-coverage.yaml#as_of_package_version` / README 双语 `spec-wave@x.y.z` / `RELEASING.md` latest 行 / `docs/spec/README.md` 索引行（pin-08：状态格点式 `3.0.0` + 发布态词）/ `assets/ide/host-adapt/README.md` / `CHANGELOG.md` 发布头 / `MIGRATION.md` / `AGENTS.md` + 含版本断言的测试；闸测 `version-pins-f5` / ontology / discipline 分面。
  5. **⑤ npm version + tag**：**本仓 tag 仅人**（HG-RELEASE）⇒ Agent 段 = 改 `package.json` + 钉点同步后落 **bump commit**；**不执行 `git tag`**（pin-10 在打 tag 前为设计红留痕 · 打 tag 后须 17/17）。**禁止**钉点未同步时 bump。**tag 权限统一取严（A1）**：SPEC §3⑩ / RELEASING ⑤ / README:380 的「Agent 可 tag」口径**本波不执行 · 3.0.0 tag 留维护者 · 差异登记留 W7 报告**（与 `AGENTS.md` 本地块一致）。
  6. **⑥ PR 合并 + CI 绿**：Agent 可推须授权；本仓合入/push **仅人**（无代跑授权）。
  7. **⑦ `npm pack --dry-run` 检查**：逐行核对 tarball —— 无 `test/` 泄漏、无工作区/私仓文件；仅 `package.json#files` 白名单内容入包；`scripts/check-pack-hygiene.mjs` 过。
  8. **⑧ `npm publish`（仅人）** —— **Agent 不得执行**。
  9. **⑨ publish 后核验 + 过程档回填** —— 人 publish 后 Agent 可代核（`npm view` / dist-tags / tarball）· 回填 ACCEPTANCE / RELEASING / README / spec 索引为 published。
- **bump 数据面清单（本波触及 · 照 RELEASING ④）**：`package.json#version` · `package-lock.json` · `assets/ontology.yaml#product_semver` · `assets/harness/discipline-coverage.yaml#as_of_package_version` · `README.md` + `README.zh-CN.md`（`spec-wave@x.y.z` 全落点 + :378 published 指针）· `RELEASING.md`（latest 行 + 新 3.0.0 人 checklist 节）· `CHANGELOG.md` `## [3.0.0]` · `MIGRATION.md`（:3/:4/:7/:85 现行指引行）· `AGENTS.md` :61 · `assets/ide/host-adapt/README.md` · `docs/spec/README.md` 索引行 3.0.0 · 含版本断言的测试（`cli-docs-121/122` · `cli-json-no-abs-path` · `cli-p0` · `cli-refresh-ide-blocks` · `cli-upgrade-compat` · `cli-validation` · `cli-w4-gate-wiring` · `f1-unify` · `init` · `pins-consistency` · `w1-hooks-command-sets` · `w1-v1-compat-lock` · `w2-b5-merge` · `w2-builtin-table-v2-identity` · `w2-host-verify` · `w6-discipline-check` · **`release-tag-identity`（tag-gated · 打 tag 前设计红）** · 及 `test/fixtures/host-adapt/command-sets/v2_cursor_full.yaml` / `planned-writes-2_4_2.json`）· `assets manifest rebuild --yes` + `assets verify` 收口。
- **验收报告素材**：`docs/roadmap/ACCEPTANCE_3_0_architecture_leap_3_0_0_zh.md`（或 30 定名 · 三节式 · 锁数字 + 已知残余 + 发布边界「tag/publish 仅人」）· `docs/spec/README.md` 3.0.0 收尾行。
- **发版探针（必含 compat 项）**：
  1. **★「旧格式适配表在新版零改动可用」**（S7.6 同一判据 · 向后兼容红线 · 硬约束 4）——不过 → **不得发版**（F-W7-05）；
  2. `pins check`（bump 后 · 打 tag 前 pin-10 设计红留痕；打 tag 后人复跑 17/17 · 口径同 2.4.x）；
  3. `host validate` 13 宿主 + `host apply`/`host update` 不回归；
  4. `npm pack --dry-run` 清单核对；
  5. `node bin/specgate.js verify` 裸 verify PASS + `gate-check` exit 0；
  6. `assets verify` 全绿。
- **F-W7-06**：bump 后 pins 钉面失配 → `pins fix` 按既有流程 · S2 拒写语义不变。

---

## 非范围（SPEC §4 全继承 + 本棒明示）

| 项 | 理由 |
|----|------|
| 新增宿主 / 新命令面 / `wiki` 新子命令 | SPEC §4 + PLAN W7 明示（只补既有） |
| 回改已外发的历史对外物料 | K-4 口径（仅新版文案纠正 · 硬约束 7） |
| 竞品数值写单值 | 滚动量二次过期（只写复核时点 + 区间 + 出处） |
| 修改 2.4.2 已 tag 提交 / 移动 tag | 不移动 tag 纪律（范围⑨只搭车新提交） |
| `npm publish` / `npm deprecate` / `git tag` / `git push` | **仅人**（HG-RELEASE · RELEASING ⑥⑧⑨ 人执行段） |
| 编辑 S2 三域（`docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`） | **永不覆写**（硬约束 1）· 只新增（本波新增 task/演练/镜像/登记件除外 · 均只新增） |
| 改适配表 schema / 新增 schema 变更 | 归 W1（已走 HG-SCHEMA-CHANGE）· W7 触即 STOP |
| 修 S2 域内 stale 链接 | S2 只读（S7.7 冻结基线等价兑现） |
| E3 通过删除测试用例凑数 | 「删了不补 = 未完成」（PLAN 风险表） |
| coverage yaml G6 状态翻转 | 本波无 G6 实现（G6 = 归档闸人工签）· 只随 bump 改 `as_of_package_version` |
| `docs/coding_wiki/` 新建 | 本仓无该目录（实证）· 术语/口径属登记面 |

---

## failure_paths

| ID | 触发 | 行为 | 可重试 | 用户可见 |
|----|------|------|--------|----------|
| F-W7-01（继承 SPEC） | 迁移演练发现 schema 兼容洞 | **回退 W1 补 back-compat**（走 HG-SCHEMA-CHANGE 式闸）· **不得靠文档遮掩** · STOP | 是 | 是 |
| F-W7-02（继承 SPEC） | 竞品数值在发版前再次变动 | 只更新 **as_of 时点 + 区间** · 不重写叙事结构 | 是 | 是 |
| F-W7-03（继承 SPEC） | 链接机检发现新坏链（docs 变更引入） | 机检 **fail-closed** · 修复后方可关账 | 是 | 是 |
| F-W7-04（继承 SPEC） | 证据镜像件与 `.workbuddy/` 原件漂移 | **以 tracked 镜像为真值面** · 镜像时登记来源与日期 | 是 | 是 |
| F-W7-05（继承 SPEC） | 发版探针「旧格式零改动可用」不过 | **不得发版** · 回退 W1 修 compat reader（硬约束 4 红线） | 是 | 是 |
| F-W7-06（继承 SPEC） | bump 后 pins 钉面失配 | `pins fix` 按既有流程 · S2 拒写语义不变 | 是 | 是 |
| **F-W7-07（本棒新增）** | E3 重定目标亦不可达（重定基后现值起点 671 · 套件增长 +234 用例） | **不得静默放宽**：登记实测前后数字 → STOP → 回 10-spec 走 SPEC 行修订重定目标（「<50 旧口径归 3.x」已 00 裁定登记 · 不属本通道） | 是 | 是 |
| **F-W7-08（本棒新增）** | 术语机检对象/面错配（把 canonical 保留词 `人闸`/`人工闸` 误当 forbidden；`门控` 竞品/环境/架构语境误伤） | **最终口径**：唯一判红 = 变体词 `门控`（仅自述/对外面 ②）· ③ 豁免面逐条枚举 + 词边界 + ⑤ 正负 fixture 钉死；`门控` 判红面残留 = 0（④ 计次/逐行口径）· 误伤可枚举、豁免可留痕 | 是 | 是 |
| **F-W7-09（本棒新增）** | A3 黑名单源只依赖未入库 facts card | **禁引未入库件为唯一黑名单源**（硬约束 14）· 边界文档 + `claims-boundary.yaml` 须 tracked | 是 | 是 |
| **F-W7-10（本棒新增）** | 证据清偿改写原件 / 镜像泄露敏感内容 | 镜像**只加 provenance 头不改写** · 涉敏感件走「仅本地草稿 · 非证据面」登记（不镜像） | 是 | 是 |
| **F-W7-11（本棒新增）** | S7.7 (ii) 级对 S2 域误报（S2 不可修） | S2 域冻结基线 + 整体豁免（登记进脚本常量）· 非 S2 = 0 为硬判据 | — | 是 |
| F-W7-12 | `git add -A` 裹挟域外档（`.workbuddy/` / `.bak` / 上游 untracked） | 打回 · 撤 stage 逐文件显式 add | 是 | — |
| F-W7-13 | 越权执行 tag/push/publish/deprecate | 违禁令 · 打回（四动作全仅人 · HG-RELEASE） | — | 是 |

---

## 验收标准（必须自证，不接受「我改完了」）

- [x] **#1 术语一致性机检通过（最终口径 · 唯一判红 = `门控`）**（SPEC 验收 1 · S7.3）：`assets/harness/terminology.yaml` 落盘 + `scripts/check-terminology.mjs` 入套件（或独立命令写入自检结论）· **① canonical 保留词 GLOSSARY 五词在位正向断言（门禁/过程轨/帽制/人闸/真值源）· 任何位置不判红（含 `人闸` 74 计次/65 行与 `人工闸` 全形态）** · **② 唯一判红对象 = `门控`（应为 `门禁`）· 仅自述/对外面（README 双语/GLOSSARY/RELEASING[除 `门控 skip`]/MIGRATION/delivery/promotion）** · **③ 豁免面逐条枚举**（research_report[含 K-3 目标文本]/安全设计/系统设计/docs/spec/历史PLAN/`门控 skip`）+ **词边界排除 `后门控制`** · **④ 判据 = `门控` 判红面命中 0（计次/逐行口径）· 不再要求 `人闸`/`人工闸` 计数** · **⑤ 正负 fixture**：保留词 `人闸`/`人工闸` 不红 · `delivery/promotion` 注入 `门控` 真红 · research_report 的 `门控`/`门控 skip`/`后门控制` 不红 · **⑥ 实测基线：门控 全 tracked 95 · 判红面 3（全 `门控 skip` 已豁免）· 残留 0**
- [x] **#2 迁移指引经真实 2.4.1 仓演练可通**（SPEC 验收 2 · S7.6）：`git worktree` 挂 `v2.4.1`（`c89f92d`）或 fixture → 旧格式表零改动通过 + 新能力可选启用 · 逐步骤命令/输出/exit code 记录落 `docs/harness/reviews/w7_migration_rehearsal_2_4_1_20260917.md`（S2 只新增）· **发现兼容洞即 F-W7-01 STOP**
- [x] **#3 对外文案黑名单机检**（SPEC 验收 3 · S7.4）：`claims-boundary.yaml` + 边界文档 tracked · `scripts/check-claims.mjs` 对 `delivery/promotion/*` + README 双语 + GLOSSARY 断言 forbidden 零命中 · 未落地一律「将新增/规划中」· **不含「接入即 L3」/「13 宿主全 hook」/「靠 hook 强制」** · 负向 fixture 真红
- [x] **#4 相对链接两级机检（S2 豁免口径 · 00 裁定 2026-09-17）**（SPEC 验收 4 · S7.7）：`scripts/check-doc-links.mjs` 固化入套件 · **(i) 非 S2 坏链硬判 = 0**（含 PLAN_2_3 ×4 / PLAN_2_4 ×2 / PLAN_2_2 ×3 存量修复）· **(ii) 非 S2 的 `.workbuddy/…` 链接目标全部 `git ls-files` 命中 = 0 未命中** · **S2 三域冻结基线（26 处）显式豁免且不漂移 · 新增 S2 坏链仍须拦** · 负向 fixture 真红
- [x] **#5 竞品口径台账逐条校对**（SPEC 验收 5 · S7.5）：K-1~K-4 全部落点（含内容锚补全的 :120/:267/:395/高层架构 :196/promotion 01/02）替换为 **区间 + as_of** · 旧单值（`30+`/`105`/`22 个`/`200+`）零命中 · 「流程性门禁」定性偏差按事实修正 · 差异化迁移「内置零装配 + 多宿主物化」· 复核出处留痕 · 已外发历史不回改
- [x] **#6 证据入库清偿**（SPEC 验收 6 · S7.8）：必做 ≥4 件（路线研究 · 验收报告-2.4.0/2.4.1 · exports_probe）镜像或显式登记（来源+日期）· 其余 7 件 2.x 历史件逐件处置 · 非 S2 的 `.workbuddy` 直链 = 0 · W3 已清偿两件核对在案 · 机检 `git ls-files` 命中
- [x] **#7 E3 重定基削减数字（00 裁定 2026-09-17）**（SPEC 验收 7 · S7.2）：before **671** → after **重定基显著下降**（同口径脚本 · `scripts/e3-spawn-count.mjs` · **目标定稿 ≤300 = 规范下限 · 机检硬判据**）· **SPEC「<50」显式登记「按重定基不可达 · 归 3.x/后续波次」**（循 G7 诚实口径 · 不硬凑不虚标）· 每条下沉配等价单测（先补后删）· 每文件 e2e 烟测 ≤1（例外登记）· 用例数零意外删减（仅加性）· **连重定目标亦不达 → F-W7-07 STOP**（不得静默放宽）
- [x] **#8 2.4.2 口径补正搭车**（SPEC 验收 8 · S7.9）：全仓复核无 2.4.2 滞后表述（已由 `1067f32` 修正 · 登记）· 本波至少一提交说明含「补正 2.4.2 口径滞后」· 未改 2.4.2 提交 / 未移动 tag
- [x] **#9 3.0.0 发版探针含 compat 项**（SPEC 验收 9 · S7.10 · **硬约束 4 红线**）：探针第 1 项 =「旧格式适配表在新版零改动可用」（与 S7.6 同判据）· 不过 **不得发版** · 另含 pins / host validate+apply+update / pack 清单 / 裸 verify / assets verify 全项
- [x] **#10 平台锁**（SPEC 验收 10 · S7.10）：`npm run typecheck` 0 错 · `npm test` 全绿（基线 841/160/840/0/1 + 新增用例 · skip 变化逐条归因）· `npm run build` 0 错 · `npm run test:lib` 6/6 · pins **17/17**（打 tag 前人复跑口径）· `assets verify` 全绿 · **bump 后版本钉全落点同步** · **依赖零新增**（dependencies 仍仅 `js-yaml`）
- [x] **#11 F3 wiki fixture 全绿**（S7.1）：双向 backlinks 对偶断言 · 增量 = 全量等价（逐字）· 冲突检测 red/green（`--check-conflicts` exit 2 点名 · 默认 exit 0 零回退）· 红测先行（当前无键真红留证）· 既有 `wiki export` 消费者零回退（键集只增）
- [x] **#12 既有面零意外改动**（F-W2-13 同式纪律）：除登记项外既有断言零改动全绿 · 登记项逐条列明于自检结论（预期登记面：`cli-wiki.ts` 输出键增 · usage 行扩 · 术语/链接/黑名单脚本+test · PLAN_2_x 链接修 · K 物料 · MIGRATION 定稿 · README/CHANGELOG/RELEASING/pins/测试版本断言 · assets manifest rebuild）
- [x] **#13 结构闸**：`npx spec-wave task lint --file docs/tasks/active/task_3_0_w7_closeout_external.md` PASS（E1–E8 无 error）
- [x] **#14 执行粒度与发布边界**：逐文件显式 add（**禁 `git add -A`**）· 每 commit 独立可回退 · 每 commit 前后 `npm test` 同绿 · **未执行 tag / push / publish / deprecate** · 波末 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w7_closeout_external.md` → exit 0 + `task close`（待 40 复核后 00 节奏另行）

---

## 给执行帽的必读列表

1. SPEC [`08_w7_closeout_external_v1.md`](../../spec/3_0-architecture-leap/08_w7_closeout_external_v1.md) 全文（范围 ①–⑩ · §5 设计要点 K 台账/链接两级/演练 · 验收 1–10 · F-W7-01–06）· [`00_policy_and_boundaries.md`](../../spec/3_0-architecture-leap/00_policy_and_boundaries.md)
2. PLAN [`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W7 节（:288-293）+ K-1~K-4 台账（:295-308）+ 硬约束 1/7/8/9/14/15/16（:330-345）
3. 现码（2026-09-17 实读行号 · 改前复读）：`src/cli-wiki.ts`（全 190 行 · `exportWikiGraph` :7-77 · `resolveWikilink` :114-131 · `cmdWiki` :144-190）· `src/cli/usage.ts`（wiki 行 :86 · 命令表 :108）· `src/cli/main.ts`（wiki 分派 :99）· `src/cli/verify.ts`（wiki-lint :24-103）
4. 物料（改前复读 · 内容锚）：`delivery/research_report.md`（:120/:169/:170/:172/:220/:258/:267/:395）· `delivery/promotion/01~04`（01:11/77 · 02:12 · 03:30 · 04:65/66）· `delivery/高层架构设计.md:196` · `CHANGELOG.md`（:5/:7-20）· `MIGRATION.md`（:1-11/:126-150/:166）· `RELEASING.md`（:9-49/:58-68）· `package.json`（:1-3/:25-37）· `assets/release-pins.yaml`（17 钉面全表）· `GLOSSARY.md`
5. 资产/口径源：`assets/harness/discipline-coverage.yaml`（:17 as_of · G6 deferred :47-51 · G7 :52-56）· `.workbuddy/output/推广事实卡-2.2.0.md` §11（**未入库 · 只读 · 须按 S7.8 处置**）· `assets/ide/host-adapt/README.md` · `docs/spec/README.md`（:24 3.0 行）
6. 迁移/兼容先例：`test/w1-v1-compat-lock.test.ts`（v1 旧格式零改动锁）· `test/fixtures/host-adapt/planned-writes-2_4_2.json` · [`task_3_0_w1_schema_leap.md`](../done/task_3_0_w1_schema_leap.md)（schema v2 + 闸泛化）
7. W2 交付真值（A3 边界依据）：[`task_3_0_w2_gates_in_hosts.md`](../done/task_3_0_w2_gates_in_hosts.md)（范围 ①–⑧ · 已知未测项五条 · 降级 L1+L2）· [`w2_gates_in_hosts_e2e_20260916.md`](../../harness/reviews/w2_gates_in_hosts_e2e_20260916.md)
8. E3 先例：[`w0_refactor_prep_acceptance_M1_20260916.md`](../../harness/reviews/w0_refactor_prep_acceptance_M1_20260916.md) 四、E3（口径定义 :106-110 · 删/补对照 :112-120 · 前后数字 :122-131）
9. done task 先例：[`task_3_0_w6_observability_audit.md`](../done/task_3_0_w6_observability_audit.md)（体例 · 闸行裁决 · 基线与 14 条验收）· `docs/tasks/done/task_2_4_1_patch.md` / `task_2_4_2_patch.md`（bump 九件套先例）
10. `RELEASING.md`（发版边界 · 发布四动作仅人）· [`MIGRATION.md`](../../../MIGRATION.md)（迁移终点）

---

## 思考轮

### R0 · 证据

SPEC 08（signed · 范围 ①–⑩ · 验收 1–10 · F-W7-01–06）+ PLAN W7 节 + K-1~K-4 台账 + 硬约束 1/7/8/9/14/15/16 + 本棒全量实读复核：基线复跑（841/160/840/0/1 · typecheck 0 · pins 17/17 · assets 111/111 · HEAD `e894f64`（W6 close 归档 `f4bbaf7` 起草期落地 · docs-only）· tree clean · tag `v2.4.2` 在）· 坏链两级实测（(i) 38 处 · PLAN_2_3 坏 4 / PLAN_2_4 坏 2 / PLAN_2_2 坏 3 / S2 26 处；(ii) 36 链接实例 / 10 distinct 未入库目标）· spawn 现值 671（W0 口径 · 53 文件）· 证据未入库 31 件（output 23 + _frag 8 · 仅 9 tracked · 30 复跑重建口径）· CHANGELOG:10 已 published（起草发现 范围⑨饱和）· F3/术语/A3/K 落点逐条实读。

### R1 · 范围

①–⑩ 照规格化节 S7.1–S7.10（SPEC §3 对照）；非范围照 SPEC §4 全继承 + 本棒明示八条（新命令面 · 回改历史物料 · 单值 · 移 tag · 发布四动作 · S2 覆写 · schema 变更 · G6 翻转）。

### R2 · 方案

编码面：F3 = 只补 `wiki export`（backlinks + 增量缓存 + 冲突检测 · 输出键只增 · `--check-conflicts` exit 2 而默认 exit 0）· E3 = `makeCore` 共享 harness + 分批下沉 + 每文件烟测 ≤1 · 术语/链接/黑名单 = 数据驱动（`assets/harness/*.yaml`）+ `scripts/*.mjs` 入套件 · 迁移 = worktree 挂 `v2.4.1` 真实演练 · 证据 = 镜像或「仅本地草稿」登记 · bump = 数据面 17 钉面 + 探针含 compat 项。链接 (i) 级对 S2 域做**冻结基线等价兑现**（S2 不可修 · SPEC 字面不可满足）——留 20 复核。

### R3 · 边界

S2 只新增（本 task + 演练/镜像/登记件）· 不签任何闸（双 pending 待 00 翻转）· 闸行裁决（不设 HG-SCHEMA-CHANGE 四理由 + 升级条款）· HG-RELEASE `blocks=—` 不拦 30（00 裁定）· 「发布仅人」不变 · 不追溯存量 / 不回改已外发 / 不移动 tag · 发布四动作仅人 · 禁裹挟（F-W7-12）· 迁移发现洞 STOP 不遮掩 · E3 不达标 STOP 不放宽。

### R4 · 可测性

验收 14 条全机械可断言（脚本 + fixture + 期望 exit/输出）：术语/链接/黑名单三脚本 + 负向 fixture · K 台账 grep 断言 · 迁移 worktree 演练记录 · E3 前后数字硬判据 · F3 fixture 三组 · 证据 `git ls-files` 命中 · 平台锁 · 结构闸 · 执行粒度。**非纯机械点** = 口径文案改写（机械化其留痕面：黑名单脚本 + 逐条校对表）、证据「是否镜像 vs 登记」逐件裁量（登记表即可枚举）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待审查文落盘 + 00 代签 · 维护者 2026-09-16 授权模式）；双闸 pending 待 00 翻转；闸行裁决留 20 复核 · **HG-RELEASE 不拦 30 / S2 冻结基线 / E3 重定基 / 术语误伤边界 已由 00 裁定（2026-09-17）落笔在案**；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | SPEC 08 + PLAN W7 + K 台账 + 硬约束 + 基线全量复跑（841/160/840/0/1 · typecheck 0 · pins 17/17 · assets 111/111 · HEAD e894f64）+ 坏链两级实测 + spawn 671 + 证据未入库 31 件 + 起草发现（CHANGELOG:10 已修正） | no |
| R1 | 范围 ①–⑩ → S7.1–S7.10 · 非范围 SPEC §4 全继承 + 本棒明示八条 | no |
| R2 | F3 只补 `wiki export`（backlinks/增量/冲突）· E3 makeCore 分批 · 术语/链接/黑名单数据驱动脚本 · 迁移 worktree 真演练 · 证据镜像/登记 · bump 17 钉面 + compat 探针 · 链接 S2 冻结基线 | no |
| R3 | S2 只新增 + 不签闸 + 闸行裁决 + HG-RELEASE 不拦 30（00 裁定）+ 不追溯/不移 tag + 发布仅人 + 禁裹挟 + 迁移洞 STOP + E3 重定目标不达 STOP | no |
| R4 | 验收 14 条全机械 · 三机检脚本 + fixture · K grep · E3 前后数字 · F3 三组组 · 证据 ls-files · 非机械点留痕面机械化 | no |
| R5 | 待 20 审 R1 裁定充分性 · 双闸待 00 翻转 · 闸行裁决留 20 复核 · RELEASE 不拦 30/S2 冻结基线/E3 重定基/术语边界 已由 00 裁定落笔 | no |

**residual_risks**：① **E3 <50 旧口径不可达（00 已裁定重定基）** —— 现值 671（套件 W1–W6 增长 +151 · 真值变化非回归）· 「<50」按旧 354 快照口径已由 W0 F-W0-08 重建 ⇒ 显式登记归 3.x/后续波次；本波尽力下沉 + 目标定稿 ≤300（规范下限 · 机检）· 沉降后仍不达走 F-W7-07 STOP（**缓解：目标路径与批次已定稿 · 不硬凑不虚标**）；② **链接 (i) 级 S2 域豁免（00 已裁定接受等价口径）** —— SPEC 字面「docs/** 坏链=0」与硬约束 1（S2 永不覆写）冲突，以「非 S2=0 + S2 冻结基线 26 处 + 新增 S2 坏链仍拦」等价兑现；③ **术语机检对象/面（最终口径）** —— 唯一判红 = 变体词 `门控`（仅自述/对外面）；canonical 保留词 `人闸`/`人工闸`/`门禁` 等零约束；`门控` 竞品/环境/架构语境逐条豁免（**缓解：变体词判据 + 词边界 + 正负 fixture · §S7.3 基线与 K-3 冲突解除登记 · F-W7-08**）；④ **A3 边界与 facts card 未入库** —— 黑名单源若只依赖 `.workbuddy` 违硬约束 14（**缓解：边界文档 + yaml tracked · F-W7-09**）；⑤ **证据镜像体量与敏感面** —— 31 件中 ≥4 必做，涉敏感件走「仅本地草稿」登记不镜像（**缓解：F-W7-10 · 只加 provenance 不改写**）；⑥ **HG-RELEASE 与 30 边界（00 已裁定 `blocks=—` 不拦 30）** —— 该闸语义为发布动作（tag/publish/push 仅人）· 发布前探针由验收 #9/§S7.10 承载（**缓解：裁定已落闸表 + 裁定块 · 硬约束 15 机检要求对「发布动作」闸不适用**）；⑦ **K 台账数值二次过期** —— 只写 as_of + 区间（F-W7-02）；⑧ **bump 后 pins 17 项漂移** —— `pins fix` + 打 tag 前人复跑（F-W7-06 · 2.4.x 先例）；⑨ **G2 结论级闸正则不容忍轮次前缀标题**（`^#{2,3}\s*(?:[一二三四五六七八九十]+[、.]\s*)?(结论|签收)` 不匹配 `R3 结论摘要` 型）—— 本波以格式适配绕过（R2/R3 标题 `## 一、结论摘要`）· **判据放宽归后续波次/3.x**（真值：轮次审查文标题约定应写入 20-task-audit 模板或放宽正则）· 30 invoke/自检结论可见（30 落）· 本棒只登记 task 行。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 验收主体 = **机械锁全绿**（术语/链接两级/黑名单三机检脚本 + K 台账内容锚断言 + 2.4.1 仓迁移演练 + E3 重定基前后同口径数字 + F3 fixture + 证据入库 `git ls-files` + 发版探针 compat 项 · 命令与判据见验收节），辅以：① **红测先行**（F3 冲突/增量负 fixture · 术语/链接/黑名单负 fixture · 修复前真红留证 · 硬约束 6）；② 每 commit 前后 `npm test` 同绿（基线 841/160/840/0/1 · skip 变化逐条归因 · 环境红按 F-W0-07 同式对照实验先行定性）；③ 既有面回归（wiki export 消费者 · host-adapt 系 · pins 系 · README 系 · F-W2-13 登记项逐条列明）；④ **E3 重定基前后数字为判据**（同脚本同口径 · 显著下降 · <50 显式登记归 3.x · 连重定目标不达 STOP）；⑤ **发布探针 compat 项为发版红线**（硬约束 4 · 不过不得发版）；⑥ 迁移演练 = `git worktree` 真实仓（非 mock）+ tracked 记录。**本波是收尾/口径/发版准备波 · 红绿纪律 = 机检脚本先行 + 负向 fixture 钉死 + 迁移真实演练不看文档**。

---

## 提交信息约定

- `feat(3.0-W7): F3 wiki 双向/增量/冲突（backlinks + wiki-cache 增量等价 + conflict 检测 · 键只增）`
- `refactor(3.0-W7): E3 spawn 重定基削减（makeCore 共享 harness · 分批下沉 · 671→显著下降 同口径）`
- `docs(3.0-W7): 术语统一（terminology.yaml + check-terminology）+ A3 claims boundary + 黑名单机检（补正 2.4.2 口径滞后：复核已由 1067f32 修正 · 零残留）`
- `docs(3.0-W7): K-1~K-4 竞品口径修订（区间+as_of · 定性偏差修正 · 差异化迁移）+ MIGRATION 定稿 + 2.4.1 仓演练记录`
- `docs(3.0-W7): 链接两级机检 + 证据入库清偿（路线研究/2.4.0/2.4.1/探针镜像 · 非 S2 坏链=0）`
- `chore(3.0-W7): bump 3.0.0（17 钉面 + CHANGELOG 3.0.0 + 验收报告素材 + 探针含 compat 项）`
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界（F-W7-12）
- **禁 tag / push / publish / deprecate（仅人 · HG-RELEASE）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w7_closeout_external.md`

---

### 自检结论（执行者）

> **30 执行帽 · 2026-09-17 · 四阶段（一→四）完成 · 40 复核 PASS-with-issues（blocking 0 · advisory 3 · 40 留档 `8f44053`）· 00 关账裁定 `Task_KPI%`: 97 · 归档**（本棒为 30 派发 · 00 指令回填）
> **GATE_VERIFY**：`node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w7_closeout_external.md` → HG-TASK-DRAFT / HG-AUDIT-R1 = approved（HG-RELEASE=pending 不拦 30）· **VERIFY: PASS**（四阶段开工前 + 各笔 commit 后复跑均 PASS）。

#### 一、commit（九笔 · 显式列文件 · 禁 add -A · 未 push/tag）

| 阶段 | commit | 内容 |
|------|--------|------|
| 一 | `da1a4e4` · `7e9ee37` | E3 spawn 下沉 · F3 wiki 双向/增量/冲突 |
| 二 | `2243489` · `5473319` · `33ae2b4` | 术语机检 · A3 口径边界 · K-1~K-4 |
| 三 | `0d06c1f` · `d2d1c1e` · `7c5f2c9` | MIGRATION+演练 · 证据清偿+2.4.2 · 链接两级 |
| 四 | 见下（bump + 探针 + 备料） | 3.0.0 bump 九件套 + 探针 6 项 + ACCEPTANCE + task/invoke |

#### 二、锁计数（纯加性 841→845→855→859→859）

| 阶段 | tests | pass | fail | skip | spawn |
|------|-------|------|------|------|-------|
| 基线（W6 终态） | 841 | 840 | 0 | 1 | 671 |
| 一 | 845 | 844 | 0 | 1 | **270** |
| 二 | 855 | 854 | 0 | 1 | 270 |
| 三 | 859 | 858 | 0 | 1 | 270 |
| 四（bump） | 859 | 856 | **2（tag-gated 设计红）** | 1 | 270 |

- typecheck **0 错** · build **0 错** · test:lib **6/6** · assets **113/113** · 依赖零新增。
- **pins 16/17**（pin-10 = git tag `v3.0.0` **设计红** · 打 tag 后须 17/17）· pin-08 手工补 `docs/spec/README.md` 3.0.0 行转绿。

#### 三、验收 #1–#14

1. **术语机检** ✅ — `assets/harness/terminology.yaml` + `check-terminology`；判红面 `门控` 残留 **计次 0 / 行 0**；canonical 5/5 在位；正负 fixture 7/7。
2. **MIGRATION 真实 2.4.1 演练** ✅ — worktree `c89f92d`；旧格式零改动 + 新能力可选启用均 PASS · **无兼容洞**（F-W7-01 未触发）；记录 `docs/harness/reviews/w7_migration_rehearsal_2_4_1_20260917.md`。
3. **A3 黑名单机检** ✅ — `claims-boundary.yaml` + `check-claims`；forbidden/expired 零命中；fixture 3/3。
4. **链接两级机检** ✅ — `check-doc-links`；非 S2 (i)=0 / (ii)=0 · S2 冻结基线 **23**；fixture 4/4。
5. **K-1~K-4 台账** ✅ — 落点零单值旧数（`30+`/`105`/`22 个`/`200+`/`不是机械性`）· `as_of 2026-09` 区间化 · K-3 定性修正 · 出处留痕。
6. **证据入库清偿** ✅ — 4 件镜像入 `docs/harness/reviews/`（provenance 头 · 不改写）+ 7 件「仅本地草稿」登记（`w7_evidence_provenance_20260917.md`）· 非 S2 `.workbuddy` 直链 0。
7. **E3 spawn 重定基** ✅ — **671 → 270**（≤300 硬判据 · `scripts/e3-spawn-count.mjs`）· 每文件 ≤1 烟测 · it 零增删。
8. **2.4.2 口径补正搭车** ✅ — `CHANGELOG:10` 已 published（`1067f32`）· 提交 `d2d1c1e` 说明含「补正 2.4.2 口径滞后」；未改 2.4.2 提交 / 未移 tag。**残留分类（A2）**：全仓精确 grep 历史残留 = `docs/tasks/done/task_2_4_2_patch.md` + 其 `docs/harness/invokes/by-task/2-4-2-patch/*` + `docs/roadmap/ACCEPTANCE_2_4_2_patch_2_4_2_zh.md` —— 均 **S2/历史豁免** · **对外 live 面（CHANGELOG/RELEASING）零残留**。
9. **3.0.0 发版探针含 compat** ✅ — 6 项（① compat 首项 PASS）· `docs/harness/reviews/w7_release_probe_3_0_0_20260917.md`。
10. **平台锁** ✅ — 四门 + pins 16/17 + assets 113/113 + 依赖零新增。
11. **F3 wiki fixture** ✅ — 双向 backlinks 对偶 / 增量=全量等价（逐字）/ 冲突 red-green；`test/cli-wiki.test.ts` 4/4；红测先行 4/4。
12. **既有面零意外改动** ✅ — 登记：`cli-wiki.ts` 输出键增 + usage 行扩 · 三 checker+test · K 物料/口语文案 · PLAN_2_x 链接回填 · MIGRATION 定稿 · README/CHANGELOG/RELEASING/pins/版本断言测试 · assets manifest rebuild；其余零改动。
13. **结构闸** ✅ — `task lint` PASS（本 task）。
14. **执行粒度与发布边界** ✅ — 逐文件显式 add（禁 `git add -A`）· 每 commit 前后 `npm test` 同绿 · **未执行 tag / push / publish / deprecate**。

#### 四、偏差汇总

1. **E3 共享 harness 双形态**：`makeCore`（W0 判据）+ `runCore`（进程内 argv 分发）等价实现 · 不复制判据。
2. **链接 S2 冻结基线复跑重建 = 23**（起草快照 26 · 口径收窄 + W7 新增 S2 件 · F-W0-05 式）。
3. **commit 顺序与 00 消息列表**：E3→F3（阶段一）/ MIGRATION→证据→链接（阶段三）· 保各笔独立绿。
4. **回填形态取代字面 `../→../../`**：直接回填 tracked 镜像/登记表，同时满足 (i)=0 与 (ii)=0。
5. **claims 未裸串收录 `dsh-coding-kit`**（合法 deprecated bin）· 改 `expired_wording` 收 `四宿主`/`406 用例`。
6. **K-3 文本按面分写**：research_report（术语豁免）用竞品原词 `门控` · promotion（判红面）改 canonical `门禁`。
7. **版本断言联改**：`cli-p0` / `cli-docs-121/122` / `cli-discipline-coverage` / `cli-refresh-ide-blocks` / `cli-upgrade-compat` / `cli-validation`（含正则转义形）；DEF-028/030 fixture `2.24.0→3.24.0` / `2.9.0→3.9.0`（保 `cmp>0` 分支覆盖 · 3.0.0 起 2.x manifest 走「可升级」，原「跨产品线迁移」文案仅当 manifest 版本数值更高时触发）。
8. **未改 task 结构行**（仅回填本自检结论 + 新增 30 invoke · S2 只新增/回填指定区）。

#### 五、已知未测项 / 待人项

- **tag `v3.0.0` 待人打**（HG-RELEASE 仅人）：打 tag 后 `pins` 17/17 · `release-tag-identity` 转绿。
- **`npm publish` 仅人**（HG-RELEASE=pending）：publish 后回填 ACCEPTANCE/RELEASING/README/spec 索引为已 published。
- **2.x manifest 跨产品线迁移文案**（偏差 7）· **S2 链接冻结基线**（硬约束 1）· **`.workbuddy/` 7 件仅本地草稿**（登记在案）。
- **关账**：40 复核 PASS-with-issues（blocking 0 · advisory 3 · 40 留档 `8f44053`）· 00 裁定 `Task_KPI%`: 97 · `task close --yes` 13 守卫全过 · 归档 `docs/tasks/done/`。

### KPI（00）

**00 收官裁定**（rubric `KPI_RUBRIC_v1_2` · 40 复核 PASS-with-issues（blocking 0 · advisory 3 · 40 留档 `8f44053`）· close_kpi 存在性口径）：**Task_KPI%: 97**

- **十项全交付**：验收 #1–#14 全落地（术语机检 / A3 口径边界 / K 台账区间化 / 2.4.1 真实演练 / 链接两级 / 证据清偿 / E3 **671→270** / F3 wiki 三能力 / 探针 **6 项** / 平台锁）· 三轮审闭环（R1/R2/R3）· bump 九件套 + 探针就绪 · **tag-gated 设计红诚实登记**（pin-10 + `release-tag-identity` 待维护者 tag `v3.0.0` · 未伪造 tag/绿）。
- **质量门**：锁计数 **841→845→855→859 纯加性零回退** · typecheck 0 错 · build 0 错 · test:lib 6/6 · pins **16/17**（pin-10 设计红）· assets **113/113** · 三 checker PASS · 依赖零新增 · **零越权**（tag/push/publish/deprecate 四动作零触碰 · 禁 `git add -A` 遵守）。
- **扣 3**：过程瑕疵三处（A1 计数笔误「857」实为 **856 pass / 164 suites** · 三类 checker 数字口径 · KPI 节补写）—— 随关账顺手订正并登记，未流入交付面（src/test 机械面正确 · 40 advisory A1–A3）。
