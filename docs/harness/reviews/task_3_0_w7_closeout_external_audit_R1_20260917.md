# 审查文：task_3_0_w7_closeout_external · R1（20-task-audit）

> **hat_id**：20-task-audit · **轮次**：R1 · **日期**：2026-09-17  
> **审查对象**：`docs/tasks/active/task_3_0_w7_closeout_external.md`（3.0 W7 收尾与对外 · 含 3.0.0 release bump · HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1=pending）  
> **对照真值**：SPEC `docs/spec/3_0-architecture-leap/08_w7_closeout_external_v1.md`（signed · 范围 ①–⑩ · §5 设计要点 · 验收 1–10 · F-W7-01–06 · §10 人工闸）· PLAN `PLAN_3_0_architecture_leap_v1_zh.md` W7 节（:288-293）+ K-1~K-4 台账（:295-308）+ 硬约束 1/7/8/9/14/15/16（:330-345）· `RELEASING.md`（九件套/探针/分工）· `CHANGELOG.md` · `MIGRATION.md` · `delivery/research_report.md` + `delivery/promotion/` · 格式先例 `task_3_0_w6_observability_audit_audit_R1_20260917.md`  
> **审查性质**：书面审查 + 独立复核实测（基线全量复跑 + 自研链接两级机检脚本复测 + spawn 计数复算 + 证据/tracked 复点 + K 落点逐条抽核 + 术语变体全语料扫描 + 闸机检）；**未改** task / SPEC / PLAN / src / assets / test / package.json 实质内容；**不代签** HG-AUDIT-R1（归 00 代签）

---

## 一、结论摘要

| 维度 | 结论 |
|------|------|
| **内容**（可执行性 / 与 SPEC+PLAN 一致性） | **BLOCKING 1**（B1 S7.3 术语机检对 `人工闸` 的 forbid/allowlist 口径不足以「不误伤」——非 S2 扫描面实测 **119 处** `人工闸`，含 ~45 条 `##` 级节标题于已签 SPEC/PLAN，而豁免仅列 `### 人工闸`）· advisory 7（A1 HG-RELEASE 裁定 vs SPEC §10 :133 字面 + tag 权限三处冲突 · A2 task 自身 2 处 W6 链接断链 + S2 冻结基线须含 in-flight task · A3 证据件数 33 vs 实测 31 · A4 E3 分布 55 文件 vs 实测 53 · A5 F-W7-07 目标软口径 · A6 bump 清单漏 `release-tag-identity` 点名 · A7 W7 invoke 目录缺 10/00）。其余常规核对全过。 |
| **流程闸** HG-AUDIT-R1 | **pending**（真值以 task `### 人工闸` 表为准）；本审查文落盘即满足「20 审查文落盘」前置，签署归 **00 代签**（维护者 2026-09-16 授权模式），**pending 期间 30 拒改码**（本审机检实测：`task lint` PASS ✓（W3 占位符 warn 属 draft 期合法）· `gate-check` exit 2 ❌ 拒 30 ✓（仅渲染 HG-TASK-DRAFT approved + HG-AUDIT-R1 pending 两行 · **HG-RELEASE 不渲染** ✓）· `verify --target . --task …` 首输出闸扫描表 + `VERIFY: BLOCKED · HG-AUDIT-R1 pending` exit 2 ✓） |
| 思考轮 R0–R5 | 控制表填全（六轮 early_stop 全 no · residual_risks 八条每条带缓解 · ①②对应本审重点 1/3 裁定面）· R5 待本轮裁定——**本轮裁定：不足（B1 须 10-task 回填后再审）** |

---

## 二、常规核对（对照 SPEC / PLAN / 硬约束逐项）

| 核对项 | 结论 | 证据（本审独立复核） |
|--------|------|------|
| 范围 ①–⑩ 与 SPEC §3 | ✅ 逐项对应且规格化 | S7.1 F3 wiki（①）· S7.2 E3（②）· S7.3 术语（③）· S7.4 A3 边界（④）· S7.5 K-1~K-4（⑤）· S7.6 MIGRATION（⑥）· S7.7 链接两级（⑦）· S7.8 证据清偿（⑧）· S7.9 2.4.2 搭车（⑨）· S7.10 bump（⑩）——无自创范围 · 无遗漏 |
| 非范围与 SPEC §4 + PLAN W7 | ✅ 全继承 + 明示 | SPEC §5 条全在（新宿主/新命令面 · 回改历史物料 · 单值数值 · 修改 2.4.2 已 tag 提交 · npm publish 仅人）+ 本棒明示（S2 覆写 · schema 变更 · 修 S2 stale 链接 · E3 删测凑数 · G6 翻转 · `docs/coding_wiki/` 新建）· 与 PLAN W7 非范围（:291 不新增宿主/新命令面）逐字对齐 · 依赖零新增（task :77 声称 dependencies=仅 js-yaml · **本审实证 package.json dependencies = {`js-yaml`:^4.1.0} ✓**） |
| 验收标准与 SPEC §7 | ✅ 1–10 全覆盖 + 加强 4 条 | SPEC 1→#1 · 2→#2 · 3→#3 · 4→#4（S2 等价口径，重点 3）· 5→#5 · 6→#6 · 7→#7（重定基，重点 1）· 8→#8 · 9→#9 · 10→#10；#11 F3 fixture · #12 既有面零意外改动（F-W2-13 同式）· #13 结构闸 · #14 执行粒度/发布边界为加强项，命令+fixture+期望 exit 全落验收节 |
| failure_paths 与 SPEC §8 | ✅ F-W7-01–06 全继承 | 逐条对应且行为更具体；新增 F-W7-07–13（E3 重定目标不达 STOP · 术语误伤 · A3 黑名单源只能引未入库件 · 镜像泄敏/改写 · S2 (ii) 误报 · `git add -A` 裹挟 · 越权 tag/push/publish/deprecate）逐条必要——07 是重点 1、08 是重点 5、11 是重点 3 的 task 面兑现 |
| 依赖 / 必读列表 | ✅ 充分（唯 2 处 W6 链接断链 → A2） | SPEC+PLAN+现码行号（本审抽核 30+ 处全中）+ 资产/口径源 + 既有测试面三文件（cli-help/cli-g1g7/cli-json-no-abs-path · **本审 `grep -rln 'cmdWiki\\|wiki export\\|exportWikiGraph' test/` 命中恰此三件 ✓**）+ done 先例 + RELEASING/MIGRATION。唯 :6 与 :300 引 W6 task 用 `./`（active/）而文件实位于 `docs/tasks/done/` → 2 处断链（A2） |
| 思考轮控制表 R0–R5 | ✅ 填全 | R0 含基线全量复跑 + 链接两级实测 + spawn 671 + 证据未入库 + 起草发现（CHANGELOG:10 已修正）；R1–R3 闭合；R4 验收 14 条全机械 + 非机械点留痕面机械化；R5 待本轮（裁定不足，见 B1） |
| `### 人工闸` 表可机检性（硬约束 15） | ✅（HG-RELEASE 语义例外登记在案 → A1） | 闸表在 `### 人工闸` 节；本审实测 `gate-check` 渲染 2 行（HG-TASK-DRAFT approved blocks 20,30 / HG-AUDIT-R1 pending → ❌ 拒 30 · exit 2）· `verify` 首输出闸扫描表 + `VERIFY: BLOCKED`（exit 2）· `task lint` PASS。**HG-RELEASE 因 blocks_hats=— 不渲染**（00 裁定机械生效 ✓，但与 SPEC §10 :133「若落 task 表 blocks_hats 须含 30」字面冲突 → A1） |
| 闸行裁决（不设 HG-SCHEMA-CHANGE · task :45 留 20 复核） | ✅ 裁决成立 | 理由①（3.0.0 bump = 数据面 · 17 钉面 path/extract 全不变 · `pins fix` 按已批准机制）——本审实证 `assets/release-pins.yaml` 17 钉面在案 + `pins check` 17/17 ✓；理由②（MIGRATION 只改散文/状态行 · W1 适配表 schema 变更已走 HG-SCHEMA-CHANGE approved）——本审实证 MIGRATION.md :126-150 为草案节 + w1_schema_change_review_20260916.md 在案 ✓；理由③（F3 wiki 输出键只增 · 无既有外部消费者）——**本审实证 cli-wiki.ts 190 行 · 消费测试恰 3 件 · additive 键容忍** ✓；理由④（术语/链接/证据/K/黑名单皆文档数据面）✓。升级条款（执行期触 schema/改键语义/删键 → STOP → 评审文 → 人闸）客观可判 · 与硬约束 3 顺序兼容 · **本审不判定须补闸行** |
| test_strategy 与硬约束 6（修严配负向 fixture） | ✅（术语面须补口径 → B1） | 修严面全配红测先行：F3 冲突/增量负 fixture · 术语/链接/黑名单负 fixture · 迁移洞 STOP。三机检脚本 + fixture 写法落在案；唯术语 forbid/allowlist 口径不足（B1） |
| 行为变更类「旧测 grep 影响面」提醒（K7） | ✅ 覆盖 | 验收 #12「既有面零意外改动」+ 预期登记面逐条列明（cli-wiki 输出键增/usage 行扩 · 术语/链接/黑名单脚本+test · PLAN_2_x 链接修 · K 物料 · MIGRATION 定稿 · README/CHANGELOG/RELEASING/pins/测试版本断言 · assets manifest rebuild）+ 测试策略 ③ 既有面回归点名 |
| 硬约束 1/7/8/9/14/15 落位 | ✅（15 的发布动作闸例外 → A1） | #1 S2 只新增（本 task + 演练/镜像/登记件）；#7 不追溯存量 + 不回改已外发 + 不移 tag；#8 每波单独提交 + 禁 `git add -A`（F-W7-12）；#9 未落地一律「将新增/规划中」（claims-boundary.yaml + 黑名单机检）；#14 证据镜像/登记 + `git ls-files` 命中；#15 闸落表且可机检（HG-RELEASE 例外已登记） |
| 基线节数字独立复跑 | ✅ 核心全中（3 项口径差 → A3/A4） | 本审复跑：HEAD `f4bbaf7`（= task 所述「起草期 W6 close 归档」· 与测量点 `e894f64` 关系自洽 ✓）· 工作区 untracked = 本 task 1 件 ✓ · tag `v2.4.2` 在 ✓ · `npm test` **841 tests / 160 suites / 840 pass / 0 fail / 1 skip**（111.3s · task 108.7s 机差量级 ✓）· `typecheck` **0 错** ✓ · `pins check` **17/17 PASS · exit 0** ✓ · `assets verify` **111/111 PASS** ✓ · deps 仅 js-yaml ✓ · `docs/coding_wiki/` 不存在 ✓ · 与 W6 锁终态逐字一致 ✓ |
| spawn 671 独立复算（重点 1 前提） | ✅ 671 精确（文件分布 → A4） | 本审自算：`runCli(` 行命中 **724** − `function runCli` 定义行 **53** = **671** ✓；头部文件逐字全中（pins-consistency 89 · cli-w4-gate-wiring 65 · cli-w5-assets-integrity 34 · cli-verify-spec 34 · cli-json-no-abs-path 34 · cli-skills-install 24 · cli-p0 22 · w2-hooks-materialize 20 · w2-b5-merge 20）。**分布文件数实测 53，非 task 所称 55**（A4） |
| 链接两级独立复测（重点 3 前提） | ✅ (i) 非 S2=12 / (ii)=36·10 distinct 逐字全中（S2 26 须含 in-flight task → A2） | 本审自研脚本复测（docs/**/*.md inline+refdef）：**(i) 非 S2 坏链 = 12 精确**（PLAN_2_3 ×4 · PLAN_2_4 ×2 · PLAN_2_2 ×3 · feedback ×1 · spec ×2，逐文件/逐目标全中）· **S2 = 29**，其中 **26 为起草前基线**（task 声称 26 ✓），**+3 为本 task 自身**（2 处 W6 断链 + 1 处负 fixture 字面）；**(ii) .workbuddy 未入库链 = 36 实例 / 10 distinct 精确**（路线研究 · 验收报告-2.2.0/2.3.0/2.4.0/2.4.1 · PROMPT-2.2.0/2.3.0 · 推广事实卡-2.1.3/2.2.0 · 审查报告-2.1.1 · 逐 basename 全中），另 +1 为 task 内负 fixture 示例。总 = 38 → 41、36 → 37 的差恰由新 task 解释 ✓ |
| 证据未入库/tracked 独立复点 | ⚠️ tracked 9 中 · 件数 33 vs 实测 31（A3） | `git ls-files .workbuddy` = **9** ✓（task 声称 9）；`.workbuddy/output` 顶层文件 **23** + `_frag/` **8** = **31 文件**（task 声称 24+9=33 → A3，用 F-W0-05 式复跑重建即可）· W3 两件已清偿（w3_ontology_graph_research_20260917.md 在 `docs/harness/reviews/` tracked ✓ · 探针脚本在案） |
| K 落点内容锚独立抽核（重点 4② 前提） | ✅ 全中 | research_report.md **:120**「30+ agent 集成」✓ · **:169**「30+ AI 编码 agent 集成」✓ · **:170**「扩展 105 个（60+ 作者）、预设 22 个、贡献者 200+」✓ · **:172**「门控是**流程性**的…不是**机械性**的」✓ · **:220**「30+ 个 agent 集成」✓ · **:258**「30+ 集成与 200+ 贡献者」✓ · **:267**「跨宿主 30+ 集成」✓ · **:395** SR-07 出处行（30/105/22 presets/200+）✓；`delivery/高层架构设计.md:196`「多宿主（30+ 集成）」✓；`promotion/03:30`「流程性」✓ · `04:65`「30+ 集成」✓ · `04:66`（机械执行列「流程性」）✓ · `01:11`（四宿主/2.1.3 自述）✓ · `01:77`（下一步能力「规划中」）✓ · `02:12`（spec-wave@2.1.3）✓ |
| CHANGELOG 2.4.2 实态独立实证（重点 4① 前提） | ✅ 属实 | `CHANGELOG.md:10` = 「**已 published** · tag `v2.4.2`…」（非滞后）✓ · commit `1067f32` = `docs(release): 2.4.2 发布回填（探针全过 · 过程档转 published）` 且 diff 含 CHANGELOG.md ✓ · ⇒ SPEC 范围⑨「口径滞后」确已饱和，task 改「零残留确认 + 提交说明义务」属实且忠实 |
| tag/migrate 先例实态 | ✅ | tag `v2.4.1` → `c89f92d` ✓（task S7.6 :165「tag 实测存在 · c89f92d」逐字）· MIGRATION.md :126 节标题「2.4.2 → 3.0.0（breaking）· 适配表 schema 跃迁（**草案**）」✓ · :166 修订记录 ✓ · 定稿对象 :126-150 范围准确 |
| 现码行号抽核（30+ 处） | ✅ 全中 | `src/cli-wiki.ts` 190 行 ✓ · `src/cli/usage.ts` wiki 行 :86 ✓ · README.md/README.zh-CN.md **:378** published 指针 ✓ · AGENTS.md **:61** `npx spec-wave@2.4.2 host update` ✓ · `assets/ide/host-adapt/README.md:61` ✓ · `docs/spec/README.md:23`（pin-08）+ **:24** 3.0 索引行 ✓ · MIGRATION :3/:4/:7/:85 现行指引行 ✓ · GLOSSARY :11 五保留词（门禁/过程轨/帽制/人闸/真值源）✓ · `.gitignore:4` `.workbuddy/` ✓ |
| 术语变体全语料独立扫描（重点 5 前提） | ⚠️ 口径不足（→ B1） | 非 S2 扫描面（143 件）：`人工闸` = **119 处**（全 tracked 450）· `门控` = **16 处**（全 tracked **90**，非 task 所声称 77）· `帽子体系` = **0**。`人工闸` 中 ~45 条为 `##` 级节标题（`## 人工闸` / `## 10. 人工闸` / `## 人工闸与验收口径`，遍布已签 docs/spec/** 与 docs/roadmap PL**）+ `人工闸表` ×12（含 **GLOSSARY.md 自身 :82**）——task 豁免只列 `### 人工闸`（三井号），字面无法覆盖 → B1 |
| W0–W6 前置兑现 | ✅ | W6 done（841/160/840/0/1 与本审复跑逐字一致 · HEAD f4bbaf7 = W6 close 归档 commit ✓）· SPEC 08 signed（HG-SPEC-SIGNOFF approved 2026-09-16 ✓）· W2 hooks 交付（task 必读 :298 引 w2 e2e 在案）· W3 研究/探针入库 ✓ |

**常规核对结论：除 B1 外无其他内容阻塞。**

---

## 三、五条重点逐条结论（10-task 留下 · 含本审独立复核证据）

### 重点 1 · E3 重定基裁定（<50 vs 671）——⚠️ 诚实口径接受 · 附 A5 目标软口径

- **裁定忠实度**：task S7.2 :109 逐字登记「SPEC 范围②『<50』按旧 354 快照口径的偏差处理…**显式登记『<50 按重定基不可达 · 归 3.x 或后续波次』**（循 G7 诚实口径先例 · 不硬凑不虚标）」——与 00 裁定一致，**属 honest under-claim，方向保守，接受**（W6 重点 2「G7 诚实口径优先」先例同式）；residual_risks ① + 验收 #7 三点同文在案 ✓；
- **数字链独立复算**：W0 M1 验收文实测 **580（619−39）→ 520** ✓（本审实读 :106-131）；现值 **724−53=671** ✓；520+151=671 与套件 607→841（+234 用例）自洽 ✓ —— 「真值变化非回归」成立；
- **F-W7-07 STOP 通道表达**：task :116 + :261 + 验收 #7 三处保留「连重定目标（≤300 建议下限）亦不可达 → 不得静默放宽 → 回 10-spec 走 SPEC 行修订」——通道**存在且方向正确**；但 **A5**：重定目标「由 30 按实测与风险定」且仅「建议 ≤300」，主验收判据 #7 为「显著下降」软口径，STOP 阈值锚在「建议」二字上，客观可裁性弱。**建议 00/10-spec 将 ≤300 由「建议」升为**规范下限**（或由 10-task 在 S7.2 写明定档规则），使 #7 与 F-W7-07 均可机检**（不阻塞签闸 · 30 执行时按 baseline 复跑定档即可）。

### 重点 2 · HG-RELEASE 不拦 30 裁定——⚠️ 实体裁定成立 · 须补 SPEC 字面偏差登记（A1）

- **实体裁定成立**：HG-RELEASE 语义 = 发布动作（tag/push/publish/deprecate 仅人）· 非代码变更闸 ✓；本审机检实证 00 裁定的机械效果 —— `gate-check` 现渲 **2 行（HG-TASK-DRAFT + HG-AUDIT-R1）** 且仅 HG-AUDIT-R1 拒 30 ✓，若 blocks_hats 含 30 则 HG-RELEASE pending 会与 HG-AUDIT-R1 并列系统性拒 W7 全部改码（task :47「3 行拒 30 → 2 行」经本审复测成立）✓；「发布前探针/compat 项由验收 #9/§S7.10 承载 · publish 仅人不变」✓；
- **与硬约束 15 的关系论证**：硬约束 15(a) 原文「新增闸…必须落 W 波 task 表，且 `blocks_hats` 须**显式含 `30`**（否则泛化判定不会咬）」——其规范目的是「让闸真咬住 30」。HG-RELEASE 的语义目的**恰是不该咬 30 改码**，故 00 的语义裁决**有实质道理**；但 **SPEC §10 :131-133 明文反：**「若落 W7 task 的 `### 人工闸` 表，`blocks_hats` 须含 `30`（硬约束 15）」——task 以 `—` 覆盖了**已签 SPEC 的字面强制条款**，属「偏差登记」而非 SPEC 修订。**A1（advisory · 须 00/维护者确认）**：循 W6「SPEC 已 signed · 字面修订须重走签署通道 · 偏差登记 + 00 裁定为合规偏差通道」先例，**本审不判定 blocking**，但要求 00 代签 HG-AUDIT-R1 时**显式确认此偏差**，且建议 10-spec 给 SPEC §10 加一句「发布动作类闸不适用 blocks-30 强制」的注记（否则 SPEC 与 task 长期字面互斥）；
- **连带发现（A1 附带）**：task :42/:208/:241 将 **`git tag` 列为「仅人」**，而 **SPEC §3 ⑩ 明文「tag（Agent 可执行段）」**、**RELEASING.md ⑤「npm version + tag（Agent 默认可做）」+ :168**、**README.md :380「Agent may bump/tag」** 均为「Agent 可 tag」——**三处与 task 冲突**。task 取更严方向（安全），但与 SPEC 字面未登记。建议在 3.0.0 的 RELEASING 新节 + SPEC 注记里**统一「tag 仅人」或「tag 可 Agent」**并同步 RELEASING/README（否则同仓两套口径）。

### 重点 3 · 链接 S2 豁免裁定——✅ 等价口径可签 · 附 A2 in-flight task 口径

- **冲突属实**：SPEC §3 ⑦/验收 4 字面「docs/**/**.md 坏链数 = 0」与硬约束 1「S2 三域永不覆写」对 S2 域**不可同时满足**（S2 历史链接/归档 task 的 stale 链接不可修）✓；
- **等价兑现可签**：本审自研脚本复测 **非 S2 (i) = 12 精确 · (ii) = 36 实例 / 10 distinct 精确**（逐条全中，见常规核对表）——「非 S2 硬判 0 + S2 冻结基线 + 新增 S2 坏链仍拦」的等价口径**可签**（少声称面可机检 · 不虚标）；
- **精度确认**：task 称 S2 = 26 处（起草前基线），本审实测 S2 = 29，**差 3 恰为本 task 自身**（2 处 W6 断链 + 1 负 fixture 字面）——**26 为真**，但 **A2**：W7 task 本身在 S2 域，脚本落盘后会把 task 自身 3 处计入 S2，与「冻结基线 26」不符。**建议 10-task/30 明确「冻结基线是否含 in-flight active task」并写明**（含则基线取 29−fixture 或排除 active/；不含则脚本须排除当前 task），否则 `新增 S2 坏链仍须拦` 会自咬；并**修 task :6/:300 两处 `./task_3_0_w6_observability_audit.md` → `../done/…`**（W6 已归档 done）——这两处是 task 自身的真实断链，属标注级，修在后即可。

### 重点 4 · 两条实态偏差——✅ 双双独立实证属实

- **① CHANGELOG 2.4.2 已修正 ⇒ 范围⑨改零残留确认**：本审实证 CHANGELOG.md:10 = 已 published；commit **1067f32** 存在且 diff 含 CHANGELOG.md（`docs(release): 2.4.2 发布回填`）——task :85/:199/:201 的起草发现**属实且落笔忠实**（改了范围⑨口径而非硬将「补正」写成改文件 · 保留提交说明义务 · 红线不变 tag/不改 2.4.2 提交 ✓）；
- **② K 台账内容锚补全**：本审对 task S7.5 K-1~K-4 表 + :89 + :295 的**全部落点逐条抽核存在性**（research_report 8 处 + 高层架构:196 + promotion 01:11/77/02:12/03:30/04:65/04:66），**全中且旧值确在**（见常规核对「K 落点内容锚独立抽核」行）✓；00 裁定「内容锚优先 · promotion 01/02 纳入」忠实落笔 ✓。**唯 A2 附**：开工基线 :89 的 K 落点行只列 `promotion/03:30 · 04:65 · 04:66`，未列 K-4 表与必读 :295 已含的 `01:11/77`、`02:12`——属基线行与规格节自相不齐（标注级，30 按 K-4 表执行为准）。

### 重点 5 · 术语机检边界——❌ 判据当前**不可「不误伤」**（B1）

- **方向正确**：数据驱动 `terminology.yaml` + allowlist + 负向 fixture（`门控`/`人工闸` 例外 fixture 钉死）= 可机检骨架成立，00 裁定「两类例外须 fixture 钉死不误伤」忠实落笔 ✓；`帽子体系` 实测 0 命中（无存量债）✓；
- **但口径不足（B1）**：`人工闸` 在**非 S2 扫描面实测 119 处**，其中 ~45 条是 **`##` 级节标题**（`## 人工闸` · `## 10. 人工闸` · `## 人工闸与验收口径`，分布于 **已签 docs/spec/** 与历史 PLAN** ）、`人工闸表` ×12（**含 GLOSSARY.md 自身 :82**）、以及 `formatGateCheck 人工闸` 等。task 的豁免只写 `### 人工闸`（三井号），**字面覆盖不到 `##` 级节标题与 `人工闸表` 复合词** ⇒ 按 task 字面实现，机检会判红 ~100 处**合法结构/契约用词**，而 `最终非 allowlist 命中 = 0` 只能靠**改写已签 SPEC/PLAN 标题**（违硬约束 7 不追溯存量 + `SPEC 已 signed`）或**把 allowlist 宽到覆盖全部标题**（违 S7.3「不得为过而整体放宽判据」）——**两条路都与 task 自订纪律冲突**。**本审裁定：blocking，退回 10-task 改 S7.3**（详见四·B1 回填清单）。

---

## 四、发现清单

### Blocking（1 条 · 须 10-task 回填后再送 00）

| # | 小节 | 内容 | 回填要求 |
|---|------|------|----------|
| **B1** | **§S7.3 术语统一（SPEC 范围③ · 验收 #1）** | `人闸 ↔ 人工闸` 的 forbidden 面/allowlist 面口径不足：非 S2 扫描面实测 **`人工闸` 119 处**（全 tracked 450），豁免仅列 `### 人工闸`，覆盖不到 **`##` 级节标题（~45 条 · 含已签 SPEC/PLAN）**、`人工闸表` ×12（含 GLOSSARY 自身）、`formatGateCheck 人工闸` 等；按字面实现 → 大面积误伤，且「非 allowlist 命中=0」与「不得整体放宽 / 不追溯存量」三者不可同时成立。另：`门控` 计数 task 记 77（全 tracked 实测 90 · 扫描面 16）亦未标口径 | 在 §S7.3 二选一并写清：**(a) 收窄 forbid 面**（仅限 kit **自述散文**，如 README/GLOSSARY/RELEASING/MIGRATION/delivery 文案；**不扫** docs/spec/** 与历史 PLAN 的结构标题），或 **(b) 精确枚举豁免模式**：标题层级无关（`^#{2,6}\\s*.*人工闸`）+ `人工闸表` + `formatGateCheck 人工闸` + `parseHumanGates`/GATE 机器 token，并**冻结实测命中数（119→豁免后余量）入基线**；二方案均须补**正向/负向 fixture**（`## 人工闸` 不判红 · 注入散文 `人工闸` 真红），并在基线节按「扫描面口径」登记 `人工闸/门控` 两计数 |

### Advisory（7 条 · 不阻塞内容，但 A1/A2 建议签闸前处理）

| # | 级别 | 内容 | 建议落点 |
|---|------|------|----------|
| A1 | 治理/登记级 | **HG-RELEASE 裁定 vs SPEC 字面 + tag 权限冲突**：SPEC §10 :133 明文「若落 task 表，`blocks_hats` 须含 `30`」，task 置 `—`（实体理由成立 · 机械效果经本审实证）；且 task 将 `git tag` 列「仅人」与 **SPEC §3 ⑩「tag（Agent 可执行段）」**、**RELEASING ⑤**、**README.md :380** 冲突 | 00 代签 HG-AUDIT-R1 时显式确认偏差 + 建议 10-spec 给 SPEC §10 加「发布动作闸不适用 blocks-30」注记；3.0.0 RELEASING 新节统一 tag 权限并同步 README/RELEASING |
| A2 | 标注/口径级 | **task 自身 2 处 W6 断链**（:6 / :300 `./task_3_0_w6_observability_audit.md` → 实位于 `docs/tasks/done/`）+ **S2 冻结基线须定义 in-flight task**：实测 S2 = 29 = 起草前 26 + 本 task 3 处 | 10-task 修两链接为 `../done/…`；S7.7 写明冻结基线是否含 current active task（否则自咬） |
| A3 | 登记级 | **证据件数 33 vs 实测 31**：`.workbuddy/output` 顶层 23 文件 + `_frag` 8 文件（task 记 24+9=33）；`git ls-files .workbuddy` = 9 全中 | 30 按开工基线节 F-W0-05 式复跑重建口径并入自检结论（≥4 必做面不受影响） |
| A4 | 标注级 | **E3 分布文件数 55 vs 实测 53**（`runCli(` 文件 53 · 定义行 53）；核心值 724−53=**671** 精确 · 批次序 7 文件不受影响 | 30 复跑时以实测 53 登记（或修正基线行） |
| A5 | 判据级 | **F-W7-07 / 验收 #7 目标软口径**：重定目标「由 30 定 · 建议 ≤300」，主判据为「显著下降」 | 建议 00/10-spec 将 ≤300 升为规范下限（或写明定档规则），使 #7 与 F-W7-07 均可机检 |
| A6 | 标注级 | **bump 版本断言测试清单漏点名**：`test/release-tag-identity.test.ts`（RELEASING ⑤ 明示 tag-gated · 打 tag 前设计红）未出现在 §S7.10 测试清单（`version-pins-f5` 已在 ④） | 30 在 bump 清单补点名（属既有 tag-gated 面，不新增工作） |
| A7 | 登记级 | **W7 invoke 目录不存在**：required_invoke_hats=10,20,30,40,00 · pre-30 闸 = {10,20,00}；本审落 20 后仍缺 10/00 | 00 代签前后确认 10/00 invoke 落盘（缺则 `verify --task` BLOCKED 点名 · fail-safe 不静默穿透） |

---

## 五、总结论

**BLOCKING 1 · advisory 7 — 退回 10-task 回填 §S7.3 后再送 00 代签**。task 与 SPEC/PLAN/硬约束的**范围/非范围/验收/failure_paths/依赖/思考轮**逐项一致，闸行裁决（不设 HG-SCHEMA-CHANGE 四理由）经本审复核成立，关键数字与行号经**独立复跑 / 自研链接机检 / spawn 复算 / 术语全语料扫描 / K 落点逐条抽核 / 闸机检**核对（npm test **841/160/840/0/1** · typecheck 0 · pins **17/17** · assets **111/111** · spawn **671** · 链接 (i) 非 S2 **12** / S2 **26**（+3 in-flight） · (ii) **36/10 distinct** · tracked .workbuddy **9** · HEAD **f4bbaf7** · deps 仅 js-yaml · 30+ 处行号全中）。**唯一内容阻塞 = B1 术语机检对 `人工闸` 的口径不足以「不误伤」且与「不得整体放宽 / 不追溯存量」自相冲突**（非 S2 扫描面实测 119 处，含 ~45 条已签 SPEC/PLAN 的 `##` 级标题），须 10-task 在 S7.3 收窄 forbid 面或精确枚举豁免模式并冻结计数。五条重点结论：**① E3 重定基诚实口径接受（循 G7 · 数字链 580→520→671 独立复算自洽）+ A5 目标宜升为规范下限**；**② HG-RELEASE 不拦 30 实体裁定成立（机械效果本审实证：gate-check 仅 2 行 · 仅 HG-AUDIT-R1 拒 30）+ A1 须补 SPEC §10 字面偏差登记与 tag 权限统一**；**③ 链接 S2 冻结基线等价口径可签（非 S2=12 / (ii)=36·10 精确）+ A2 定义 in-flight task 并修 task 自身 2 断链**；**④ 两条实态偏差（CHANGELOG 已由 1067f32 修正 / K 内容锚补全）独立实证双双属实**；**⑤ 术语机检骨架可机检但当前口径误伤面大 → B1**。思考轮审查：R0–R5 填全 · 充分性裁定**不足**（B1 未闭合前不得送签）。

本审**不代签** HG-AUDIT-R1；签署归 00（维护者 2026-09-16 授权模式）。**因存在 blocking 且 HG-AUDIT-R1 仍 pending，按纪律不附 30 Prompt**，下一棒为 **10-task（回填 B1 + 建议一并处理 A1/A2）**，并出维护者签闸清单：

## 维护者签闸（20 后 · 30 前）

- [ ] 已读 R1 审查结论（本文 · 含 blocking B1 与 advisory A1–A7）
- [ ] **先下 10-task**：按 B1 回填清单改 task §S7.3（收窄 forbid 面或精确枚举豁免 + fixture + 冻结计数），并建议一并落实 A1/A2
- [ ] 复审通过后，在 task 人工闸表将 HG-AUDIT-R1 改为 approved（00 代签 · 维护者 2026-09-16 授权 · 日期）；**确认 A1 的 SPEC §10 偏差与 tag 权限统一**
- [ ] commit task 文档或确认已签（连同本棒交付：本审查文 + `docs/harness/invokes/by-task/3-0-w7-closeout-external/invoke_20260917_20_3-0-w7-closeout-external.md` · 逐文件显式 add · 禁 `git add -A`）
- [ ] 确认 10/00 invoke 落盘（A7 · pre-30 闸 required ∩ {10,20,00} 须齐 · fail-safe）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | R1 · 20-task-audit：常规核对 19 项（含基线全量独立复跑逐字一致 · 自研链接两级机检复测 (i) 非 S2=12/total 41 · S2=29（26 起草前基线+3 in-flight）· (ii)=36/10 distinct · spawn 724−53=671 复算 · 证据 tracked 9/件数 33→实测 31 · K 落点 15 处逐条抽核全中 · CHANGELOG/1067f32 实态实证 · 术语全语料扫描 人工闸 119/门控 90/帽子体系 0 · W0 M1 580→520 实读）；五条重点逐条独立裁定（E3 重定基诚实口径接受+A5 · HG-RELEASE 实体成立+A1 SPEC 字面偏差与 tag 权限冲突 · 链接 S2 等价口径可签+A2 in-flight task · 两实态偏差双双属实 · 术语口径不足 B1）；闸机检 task lint PASS / gate-check exit 2（仅 2 行 · HG-RELEASE 不渲染）/ verify exit 2；总结论 **BLOCKING 1（B1 §S7.3 人工闸 口径不足以不误伤）+ advisory 7**，**退回 10-task**；不代签 HG-AUDIT-R1 · 不附 30 Prompt |
