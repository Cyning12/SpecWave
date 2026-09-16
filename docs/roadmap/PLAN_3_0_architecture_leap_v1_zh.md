# 规划 · 3.0.0 · 架构跃迁（architecture leap）

> **状态**：`approved` · **HG-NEXT-PLAN=approved**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）
> **目标发版**：`spec-wave@3.0.0`（**major** · 本产品首次触 schema 的 breaking 版本 · 路线研究 §5「3.0.0 架构跃迁」波次兑现）
> **基线**（2026-09-15 复核实测）：**码基线 = `2.4.2`** —— main HEAD `2557119` ↔ tag **`v2.4.2`（已落位且已推远端）** · `package.json#version=2.4.2` · `CHANGELOG.md` `## [2.4.2] - 2026-09-15` · **`pins check` 17/17 PASS**（含此前 design-red 的 **pin-10 `git = v2.4.2` 已转绿**）。**发布基线 = `2.4.1`** —— 实测 `npm view spec-wave version` = **`2.4.1`**（**2.4.2 尚未 publish** · 发布动作仅人）。
> ⚠️ **口径不符待修（且修复时机受限）**：`CHANGELOG.md:10` 的 2.4.2「发布状态」仍写"**待发版** · tag `v2.4.2` **待人打**"，与实测不符（tag 已打且已推远端）。**但 `v2.4.2` 已 tag，此刻修改会让 tag ≠ HEAD**（违"不移动 tag"纪律）⇒ **不得改 2.4.2 提交本身**，修正须**随下一笔提交搭车**（3.0 开工首提交或另开 patch），并在该提交说明中注明"补正 2.4.2 口径滞后"。归 W7 对外口径统一核查。
> 2.4.1 验收归档：[`ACCEPTANCE_2_4_1_patch_2_4_1_zh.md`](./ACCEPTANCE_2_4_1_patch_2_4_1_zh.md)
> **范围主源**：① [`路线研究-SpecWave-2.2-3.0.md`](../../.workbuddy/output/路线研究-SpecWave-2.2-3.0.md) §5「3.0.0 · 架构跃迁」+ §4 条目全表（加权评分与证据）；② [`.workbuddy/output/验收报告-SpecWave-2.4.0.md`](../../.workbuddy/output/验收报告-SpecWave-2.4.0.md) §6.2「建议并入 3.0.0」；③ [`.workbuddy/output/验收报告-SpecWave-2.4.1.md`](../../.workbuddy/output/验收报告-SpecWave-2.4.1.md) §4/§6.2 残余；④ [`assets/harness/discipline-coverage.yaml`](../../assets/harness/discipline-coverage.yaml) `deferred` / `not_wired` 项
> ⚠️ **主源①②③ 均未入库（本轮实测）**：`.workbuddy/` 被 `.gitignore:4` 整体忽略，三份材料 `git ls-files --error-unmatch` 全部报"未匹配"（该目录 24 件中仅 8 件曾被 force-add）⇒ **链接仅对维护者本机有效，clone / 评审员不可达**。④ 在仓正常。**处置**：W3/W7 须将**被引为证据**的材料镜像入 `docs/harness/reviews/`（tracked）并回填仓内链接（见硬约束 14）；本档暂保留本机链接以维持起草可追溯性。
> **格式模板**：[`PLAN_2_4_gate_strength_v1_zh.md`](./PLAN_2_4_gate_strength_v1_zh.md)（结构骨架沿用）
> **起草日期**：2026-09-15

---

## 一句话

2.2 建闭环、2.3 接线、2.3.1/2.4/2.4.1 补强度——但**产品最大的卖点始终是悬空的**：`host-adapt` 的 `verify` 与 `hooks` surface 至今未实现（`cli-host.ts` 不读 verify · schema 无 hooks），**P0 门禁装不进宿主**，SpecWave 与 Ruler/spec-kit 的差距因此拉不开。3.0.0 就是把这根主线接上：**适配表 schema 跃迁（A3+B2+B3）→ 门禁真入宿主（hooks 物化 + `host verify`）→ 生态化（B5 插件机制）**，并把 2.4.x 验收攒下的"判据语义化"债一次性收口。

---

## 范围来源校核

> 逐条钉证据出处；**未复核代码行号现值**（起草只读 · 行号以各 W 波 task 复核为准）。

| # | 项 | ID | 级别 | 出处 | 入 3.0 结论 |
|---|----|----|------|------|-------------|
| 1 | host-adapt `hooks`/`verify` surface 落地（**战略核心**） | A3 | 战略级 · breaking | 路线 §4 主线一（价值 9 / 代价 4）· **本轮复核实测**：schema **有** `verify`（`host-adapt.schema.json:52,86-95`）且 13 宿主全声明、`validateVerify` 只做校验（`cli-host.ts:370-379,433`）——**全仓无一处消费**；`hooks` **不存在**（`additionalProperties:false` 白名单 `cli-host.ts:416` 仅 allow always_on/skills/commands/verify · `src/` grep `hooks` = **0**） | ✅ **W1 + W2** |
| 2 | 适配表分层（`defaults` + host 级 `extends`） | B2 | 架构 | 路线 §4 主线二（10+ 宿主将大量重复） | ✅ W1 |
| 3 | `commands` 动词名入表（去硬编码） | B3 | 架构 | 路线 §4 主线二（`cli-host.ts` 硬编码动词名） | ✅ W1 |
| 4 | 宿主适配包插件机制（多表合并 + 用户级加载） | B5 | 生态 | 路线 §4 主线二 · **本轮复核修正**：不是"外部表接不进来"（`--file` 早已可用），而是**无 catalog（不可发现/无版本）+ 无用户级目录（须每次手传）+ 无多表合并（不能"内置 13 + 我的增量"）** | ✅ W2 |
| 5 | `ontology-check` 接线 | A4 | 接线 | 路线 §4 主线一（`src/` grep `ontology` = 0） | ✅ W3 |
| 6 | 双图谱统一（HGM ↔ tech-graph 共享 schema） | F1 | 架构 | 路线 §4 主线六（价值 6 / 代价 5） | ✅ W3 |
| 7 | `discipline`/`lifecycle show` 改读消费者资产 | F2 | 口径 | 路线 §4 主线六 | ✅ W3 |
| 8 | 判据语义化统一（长度门槛/裸子串/字面连续 → 语义边界） | NEW-4/5/10/11 + pin-08 · **R-2/R-3/R-4 已由 2.4.2 交付** · **R-5 残余** | P2×4 | 2.4.0 报告 §6.2 + 2.4.1 报告 §4 + **2.4.2 交付核对（2026-09-15）** | ✅ **W4**（口径已收窄） |
| 9 | 机械清扫与可诊断性 | NEW-6/7/8/12 + **R-6** · **R-1 已由 2.4.2 交付** | P3×4 + P2 | 2.4.0 报告 §6.2 + 2.4.1 报告 §4 + **2.4.2 交付核对（2026-09-15）** | ✅ W5（口径已收窄） |
| 10 | 结构化审计日志落盘 | C6 | 可观测 | 路线 §4 主线三（`audit` 不落痕） | ✅ W6 |
| 11 | S2 公理接真实触发源 | F4 | 架构 | 路线 §4 主线六 | ✅ W6 |
| 12 | 闸未接线补全（G2 reviews / G4 思考轮 / N2-C lint→block / G7 执行证据） | — | 接线 | `discipline-coverage.yaml` `not_wired` G2/G4 · `deferred` G6/G7/N2-C | ✅ W6 |
| 13 | wiki 能力补全（双向/增量/冲突） | F3 | DX | 路线 §4 主线六 | ✅ W7 |
| 14 | 测试 spawn 削减（354 → <50） | E3 | 工程健康 | 路线 §4 主线五（`cli-g1g7` 45× · `refresh` 41×） | ✅ **W0（第一批）+ W7（收尾）** |
| 15 | 拆三个 god-file（cli-host / cli / cli-checks） | E4 | 工程健康 | 路线 §4 主线五（价值 6 / **代价 5**） | ✅ **W0** |
| 16 | `assets manifest rebuild` 追认残留（设计性） | N5 | P2（设计） | 2.4.0 报告 §2/§6.2（绑 provenance 未启用） | ⚠️ **口径登记**（W4 附）· 不封堵 |
| 17 | 自研 IDE / 第二分发通道 / 远程 Policy 引擎 | — | — | 路线 §6 冻结 | ❌ 冻结 |
| 18 | provenance / OIDC 启用 | C5 | — | 路线 §7（npm/GitHub 账号配置） | ❌ **仅人** |
| 19 | `docs/roadmap/` 既有 PLAN 档相对链接坏链（`../.workbuddy/…` 解析到 `docs/.workbuddy/…`）＋ **被引证据未入库**（`.workbuddy/` 整体 gitignore） | — | P3（链接）· P2（证据可达性） | 本档起草时实测（PLAN_2_3 坏 4 · PLAN_2_4 坏 2）；**本轮实测**：`.workbuddy/` 被 `.gitignore:4` 忽略 · 范围主源①②③ 与探针脚本共 **≥4 件 `git ls-files` 未命中** | ✅ W7（两级链接机检 + 证据入库清偿 · 硬约束 14） |
| 20 | **对外物料竞品口径过期与定性偏差**（旧数值 + 把 spec-kit 门禁定性为"流程性"） | — | P2（口径） | 本档起草时外部复核（2026-09-15）· 落点 `delivery/promotion/*`（4 份）+ `delivery/research_report.md` | ✅ **W7** |
| 21 | **第三方自定义 agent 接入面**（非内置 13 宿主 · 用户 2026-09-15 提问） | B5 前置 | 生态 · 口径 | 本轮复核实测：`host validate/apply/update` **均已接受 `--file PATH`**（`cli-host.ts:472/1140/1301` · `resolveValidateFile:438-441` 有 fileArg 即用、否则回包内默认 `:56,440`）→ **外部单表今天即可注入**；缺的是 catalog + 用户级目录自动加载 + 多表合并 | ✅ **W2（B5）**· 验收含自定义表 e2e |
| 22 | **本体归属与开放边界**（ontology 只服务 SpecWave 自身，还是开放给消费者/宿主构建对应性本体 · 用户 2026-09-15 提问） | A4/F1 前置 | 架构 · 口径 | 本轮复核实测：`assets/ontology.yaml` 是 **SpecWave 自身产品设计本体**（头注释自述 · `classes` 全为 Package/Instance 自有概念 · 人类真值在**私仓**不随包 · `product_semver` 随每次 bump 变 · `src/` 零引用）；而 `graph yaml compile\|check\|export`（`src/cli.ts:110`）**已是公开 CLI**、源目录缺省为**消费者仓**的 `docs/_tech_graph/`（`cli-graph.ts:77`）→ **图能力已开放、本体层未开放** | ✅ **W3 研究裁决**（含"显式不开放"合法结论） |
| 23 | **本体形式化路线：是否引入 OWL**（用户 2026-09-15 提问） | A4/F1 前置 | 架构 · 技术选型 | 本轮专项研究（研究文 10 节）· 四障碍：① OWA↔CWA **语义根本冲突** ② 唯一 npm OWL-DL 推理机 **LGPL-3.0 + v0.1.0** ③ 标准 SHACL 实现 **408 传递依赖**（基线 2）④ **无消费者** | ✅ **已裁决不引入** · 采 SHACL 语义子集自研零依赖 · 3.x 留复议触发条件 |
| 24 | **随包 ontology 自身引用完整性已破**（本轮实验发现） | A4 证据 | P2（缺陷） | 4 形状（40 行 · 零依赖）校验得 **3 处 `sh:class` 违规**：`relations[0]`(`embedsInto`) 两端 `DisciplinePackage`→`BusinessRepository` 未声明 · `relations[3]`(`produces`) 客体 `TraceArtifact` 未声明 | ✅ **W3-A4**（接线即真红 · 修复或显式豁免须留痕） |
| 25 | **30 帽人工闸判定为白名单硬编码**（**存量既存缺口** · 本轮实测） | HG 判定机制 | P1（机制） | `evaluateMayStart30`（`cli-shared.ts:292-306`）与 `formatGateCheck`（`cli.ts:487-525`）**只认 3 个 ID**（`HG-AUDIT-R1`/`HG-TASK-DRAFT`/`HG-GRAPH-MODULES`）；实测存量 **73 份 task / 229 条 HG 行 / 13 种闸 ID**，其中 `HG-SPEC-SIGNOFF`（**55 行** · 多处 `blocks_hats=10-task,30`）**语义上应拒 30 却从不被检查** ⇒ 3.0 新设 `HG-SCHEMA-CHANGE` 若不改机制即"**写了闸也咬不住**"。**泛化兼容性实测**：229 行中 `blocks含30 ∧ status≠approved` = **0 行** ⇒ 泛化**零误伤** | ✅ **W1 增项**（闸判定泛化 + 回归锁） |
| 26 | **W0 是否应改走 2.5.0**（维护者 2026-09-16 提问 · 与既有 §7.3「不开 2.5.0」纪律相撞） | 版本路由 | P1（路由裁决） | **实测关键事实**：`package.json#exports` **只暴露 `.` / `./cordis.patch.yml` / `./package.json`** ⇒ 用 Node 自引用解析实证（`import.meta.resolve`）得 `spec-wave` → `lib/index.js` **OK**，而 `spec-wave/lib/cli.js` / `/cli-checks.js` / `/cli-host.js` / 甚至 `/lib/index.js` **全部 `ERR_PACKAGE_PATH_NOT_EXPORTED`** ⇒ **三个 god-file 对外不可达（published-but-sealed）**，`bin/*.js` 靠包内相对路径 `../lib/cli.js` 消费（`bin/specgate.js:2` · `bin/dsh-coding-kit.js:2`）。故 **W0 对外零变更 ⇒ semver 上是 patch 级**，而 §7.3 恰是"不要为补丁活儿单开 minor" | ✅ **裁决：不迁 2.5.0**（理由与替代方案见下裁决块） |

**边界确认**：2.4.x 序列已把"门禁强度"与"发布卫生"打到 PASS-with-issues 且无 P1 —— **3.0 不再做 2.x 式强度补丁的重复劳动**，只做**架构级跃迁 + 语义化收口**。

### 版本路由复裁 · W0 是否改走 2.5.0（维护者 2026-09-16 提问）

> **背景**：本仓已有一条**既有纪律** —— 2.4.0 验收报告 §7.3「**不开 2.5.0**」（原文：*"不要为它单开 2.5.0 minor。否则等于用一个新 minor 承接本该是补丁的活，反而把 3.0 的 schema 战线拉长"*），§7.1 更以**四处规划真值互证**确认"2.5 从未立项"（`docs/roadmap/` 无 `PLAN_2_5*` · 路线研究 §5 只定义 2.2/2.3/3.0 三波 · `PLAN_2_4` §非范围把 E3/E4 判归 3.0.0 · `src/` 对 `2.5.0` 零命中）。该纪律被 `task_2_4_1_patch.md` · 审查文 · 验收档**四处引用**为承接依据。本轮提问正面相撞，故须复裁而非默认沿用。

**裁决：不迁 2.5.0。W0 保持为 3.0.0 的首波（`feat(3.0-W0)`）。**

**五条理由（逐条有实测支撑）：**

1. **W0 在 semver 上是 patch 级 —— 它既不需要 minor，"非 breaking 重构"也不构成开 minor 的理由。** 实测 `package.json#exports` **只暴露 `.` / `./cordis.patch.yml` / `./package.json`**；用 Node 自引用解析（同样受 `exports` 约束）实证：`spec-wave` → `lib/index.js` **OK**，而 `spec-wave/lib/cli.js` / `/lib/cli-checks.js` / `/lib/cli-host.js` / `/lib/index.js` **全部 `ERR_PACKAGE_PATH_NOT_EXPORTED`**。⇒ **对外可达面 = 裸名 `spec-wave` + 3 个 bin + `cordis.patch.yml` + `package.json`**；W0 不动 `src/index.ts`、不动 `bin/`、不动 `exports` ⇒ **对外零变更**。semver 只规定"**不得**在 minor/patch 里 breaking"，**并不要求**"非 breaking 的重构**必须**单开 minor"。探针脚本：`.workbuddy/output/_frag/exports_probe_20260916.mjs`（⚠️ 本地件 · 未入库 · 须按硬约束 14 随验收文入库）。
2. **W0 的收益是内部性的，不靠发版兑现。** W0 全部收益 = **W1..W7 的开发期减阻**（见编排理由 #1）。该收益在 commit 落到 main 那一刻即兑现；消费者从 npm 装到重构后的文件布局，**没有任何可观察差别**。⇒ 2.5.0 会是一个**消费者感知不到任何变化**的发版，而发版成本是真实的（bump 九件套 + CHANGELOG + `pins` 17 项 + 验收报告 + tag + **人 publish**）。
3. **2.5.0 想买到的东西，可以更便宜地买到。** 逐项拆解——
   | 2.5.0 的潜在收益 | 实际是否需要发版 |
   |---|---|
   | 消费者回滚粒度 | ❌ 不需要 —— 重构非 breaking，**不存在**"回滚到 2.5.0 以避开 3.0 破坏"这回事（用户要的恰恰是 3.0 的 schema 跃迁） |
   | 二分（bisect）定位点 | ⚠️ 部分 —— 但 **commit 级已给**（W0.6「每文件一 commit · 独立可回退」），且 `tag` 按 `RELEASING.md` 属**维护 Agent 可执行**项 |
   | **独立验收证据** | ✅ **唯一站得住的真需求** —— 但**与发版解耦**：跑五重锁 + 落 `docs/harness/reviews/` 验收文即可，无需 publish |
   ⇒ **唯一真理由（独立验收）不需要 2.5.0。**
4. **打破 §7.3 的代价远大于收益。** 开 2.5.0 会让"**2.4.x → 3.0.0 直达**"这条线在 **5+ 份文档**（2.4.0 验收报告 §7 · `task_2_4_1_patch` · R1 审查文 · `ACCEPTANCE_2_4_1` · 各 invoke 记录）里同时失效，需连带改写 —— 而收益按理由 3 接近于零。本档亦从未提及 2.5/路由（本轮补此块修正）。
5. **反之，W0 留在 3.0.0 无任何坏处。** major **允许**同时含 breaking 与非 breaking 内容；W0 无对外破坏 ⇒ **不污染 3.0.0 的 breaking 语义**（"3.0 被定为 major 的**唯一硬理由**仍是 A3 适配表 schema 跃迁"这一论断保持成立）。**风险解耦靠 commit 粒度 + 验收粒度，不靠版本号。**

**维护者直觉的正确解法（不在版本号上）** —— 提问背后的真实关切是"**别把一个 3783 行的重构和 breaking 变更绑在同一版里**"，该关切成立，故迁入三条**替代措施**：

- **M1 · W0 必须有独立验收文**（`docs/harness/reviews/` · 以 W0.5 五重锁为验收工具），且**须在 W1 动 schema 之前**落盘 —— 把"W0 被埋在 3.0 大版本里"变成"**W0 有自己的证据面**"。这是 2.5.0 唯一真收益的等价替代。
- **M2 · commit 级可回退保持**（W0.6 既有）＋ **W1 起手前一次全绿实测**（W0.7 既有）⇒ 重构回归**永远不会**迫使回退 W1 的 schema 工作。
- **M3 · 对外可达面不变式**（新增锁⑥ · 见 W0.5）⇒ 把"零行为变更"的证明从**内部** d.ts 提升到**对外**可达面。

**若未来要翻此裁决**，须满足：3.0.0 之前出现**必须单独发版**的消费者可见需求（如 W0 意外夹带行为变更 —— 但按 W0.5 五重锁即应被拦下），或 W0 的独立验收文**未过**且需以发版回滚 —— 二者皆为**触发器**，非常态路径。

> ⚠️ **2.4.2 交付对账（2026-09-15 · 本档基线刷新时逐条核实源码）**：本档初稿把 **R-1 / R-2 / R-3** 列入 3.0 范围，但 **2.4.2 已把它们全部交付**（registry `latest=2.4.2` · tag `v2.4.2` ↔ `2557119` · 实测四门全绿 + pins 17/17）。核实证据：
> - **R-1（`host validate` 缺省基）** → 已交付：`src/cli-host.ts:489-498,552`（注释即写「2.4.2 R-1」· `findGitRoot(path.dirname(abs))` 上溯 · 仓外 `outside_repo: true`）
> - **R-2（否定词表 + 同句共现窗口）** → 已交付：`src/cli-checks.ts:688` `REVIEW_NEG_RE` 已含 `not\s*pass` 与 `不[^。；\n]{0,12}通过` / `未[^。；\n]{0,12}通过`
> - **R-3（pin-16 无引号 HTML 属性）** → 已交付：`src/cli-pins.ts:327` `htmlARe` 已是 `"([^"]+)"|'([^']+)'|([^\s>]+)` 三选一（`:338` 捕获组联改）
>
> ⇒ **W4 / W5 范围已据实收窄**（校核表 #8/#9 同步）。**仍真开**：`R-5`（`不\n通过` 跨行形态 · 2.4.2 明确留 3.0 · K 断言钉死防顺手修）、`R-6`（git 分档诊断 + 套件前置探测）、`NEW-4`（pin-17 表行语义判）、`pin-08`（版本串↔发布态绑定）、`NEW-5`（`N=20` → 语义闸）、`NEW-10`（exempt 真实性 + close/verify 口径统一）、`NEW-11`（词表广义化）、`NEW-6/7/8/12`（机械清扫）。
> **教训复用**：这正是硬约束外的"回写前复核来源材料'缺什么'类断言"纪律第二次生效（首次为 B5 理由被 `--file` 证伪）—— **上一版交付后必须逐条回源码核对，不可沿用旧报告的范围表**。

---

## 波次总表

| Wave | 主题 | 内容 | 出处 | 级别 |
|------|------|------|------|------|
| **W0** | **重构预备**（非功能 · **完整版三文件拆分**） | E4：拆 `cli-host`(1458) / `cli`(1318) / `cli-checks`(1007) = **3783 行（src 的 38.4%）** → **内部搬迁 + 原文件降级为 barrel（消费者零改动）**，落 `src/host/*` · `src/cli/*` · `src/checks/*`；**零行为变更六重锁**（用例计数 / 消费者 import 零 diff / 导出面快照 / `test:lib`+pins / typecheck+build / **对外可达面不变式**）+ **独立验收文（M1 · 早于 W1 动 schema）**；E3 第一批：`cli-g1g7` / `refresh` 的 spawn 型断言下沉为核心逻辑单测 | 路线 §4 主线五 + 本轮实测 + **版本路由复裁（不迁 2.5.0）** | 工程健康 |
| **W1** | **适配表 schema 跃迁 + 闸判定泛化（本次核心 · breaking）** | A3 schema 增 `hooks` / `verify` surface + `schema_version`；B2 增 `defaults` + host 级 `extends`；B3 `commands` 动词名入表；**闸判定泛化**（30 判定由白名单 3 闸 → 声明式全闸，`HG-SCHEMA-CHANGE` 由此才真咬得住 · 实测零误伤）；**向后兼容读旧扁平格式** | 路线 §4 主线一/二 + 本轮实测 | 战略级 · breaking |
| **W2** | **门禁入住宿主 + 接入面开放（战略目标兑现）** | A3 兑现面：`hooks` 物化到 13 宿主落点 + `host verify` 物化 + **P0 门禁在宿主内真实生效**；B5 适配包插件机制（catalog + 用户级目录 + 多表合并）；**第三方自定义 agent 接入（非内置宿主）须端到端走通且不改包发版** | 路线 §4 主线一/二 + 本轮复核 | 战略级 · 生态 |
| **W3** | **本体驱动的图谱统一（研究前置）** | 前置专项研究（三套本体零共享 schema 的最小公因子 + 消费侧盘点 + `graph axioms check` 判据强度对抗验证 + **本体归属与开放边界裁决**）；A4 `ontology-check` 接线；F1 以 ontology 为共同本体底座的图谱统一；F2 `discipline`/`lifecycle show` 真口径 | 路线 §4 主线一/六 + 本轮实测/复核 | 研究 + 接线 · 架构 |
| **W4** | **防伪判据语义化（评审先行 · 自评类豁免）** | NEW-5：`N=20` 长度门槛 → 语义闸；**R-5 + NEW-11**：否定词表广义化（跨行形态 + 跨语言）；NEW-4：pin-17 表行语义判；pin-08 版本串↔发布态绑定；NEW-10：exempt 真实性 + close/verify 口径统一；**KPI 已裁决不动（取消每帽 · 不补语义闸）** · ~~R-3（pin-16 无引号属性）已由 2.4.2 交付~~ · ~~R-2/R-4 窗口已由 2.4.2 交付~~ | 2.4.0 §6.2 + 2.4.1 §4 + **2.4.2 对账** + 2026-09-15 裁决 | P2×4（已收窄） |
| **W5** | **机械清扫与可诊断性** | NEW-6 卫生门通配语义；NEW-7 卫生门第二控制点；NEW-8 `pins fix` 备份不误删；NEW-12 相对化覆盖对象 key；**R-6** git 依赖分档诊断 + 套件前置探测 · ~~R-1 `host validate` 缺省基取仓根 已由 2.4.2 交付~~ | 2.4.0 §6.2 + 2.4.1 §4 + **2.4.2 对账** | P3×4 + P2（已收窄） |
| **W6** | **可观测与审计** | C6 结构化审计日志落盘（独立于 S2 过程轨）；F4 S2 公理接真实触发源；闸未接线补全（G2 reviews 存在性闸 / G4 思考轮控制表 / N2-C `verify --task` 含 lint / G7 执行证据） | 路线 §4 主线三/六 + discipline-coverage | 可观测 · 接线 |
| **W7** | **收尾与对外** | F3 wiki 能力补全；E3 剩余 spawn 削减；术语统一（术语表 ↔ 文档）；A3 对外口径边界；**对外物料竞品口径修订（K-1~K-4 台账）**；`MIGRATION.md` **breaking 迁移节**；**链接两级机检 + 证据入库清偿（硬约束 14）**；3.0.0 release bump | 路线 §4 主线四/六 + 本轮外部复核 + 本轮链接/证据实测 | DX · 收尾 · 口径 |

**编排理由**：

1. **W0 必须最先**。旧稿说"**唯一理由是减阻**"，**完整版口径下理由升级为两条**（维护者 2026-09-15 选定完整版）：
   - **减阻（对 W1）**：A3 要在 `cli-host.ts`（最大 god-file）里加 `hooks`/`verify` 消费逻辑；在 1458 行文件上叠架构改动会让 W1 的回归面失控。**拆完再加**。
   - **全局减阻（对 3.0 每一波）**：三个 god-file **在 3.0 各波都会被改** —— `cli-host.ts` 被 W1/W2（hooks/verify 消费 + 物化）、`cli-checks.ts` 被 W4（NEW-5 语义闸 / R-5）、`cli.ts` 被 W1（**闸判定泛化** `formatGateCheck` + init 的 host 段）与 W6（`verify --task` 补 lint）。**一次拆完 = 后续每波回归面都变小**；分散在各波顺带拆则会反复触发重构型回归。
   - 同时 E3 削减 spawn 是因为 3.0 会新增大量宿主端到端测试，不先减负则测试耗时线性爆炸。
2. **W1 是全局锚点**：`hooks`/`verify`/`defaults`/`extends` 四项**同属 `mvp-hosts.yaml` 一个 schema**，必须一波设计到底，另起一波会二次 breaking。这也是 3.0 被定为 major 的**唯一硬理由**。**本轮增补**：W1 另带**闸判定泛化**（`cli-shared.ts:292` `evaluateMayStart30` + `cli.ts:487` `formatGateCheck`）—— 它与适配表 schema **无耦合**，之所以仍并入 W1，是因为 `HG-SCHEMA-CHANGE` 是 W1 自己的硬前置闸，**闸机制不修则 W1 的准入闸形同虚设**（自指依赖）；且该泛化同时修掉存量既存缺口（`HG-SPEC-SIGNOFF` 等 10 种闸从未被判定逻辑采集）。
3. **W2 紧跟 W1**：W2 是 W1 的**消费侧**（物化 + 校验），schema 定稿后立刻兑现"门禁入宿主"这一战略目标；B5 插件机制建立在 B2 的分层 catalog 上，天然同波。
4. **W3 与 W4/W5 无代码耦合**：W3 在 ontology/图谱层，W4 在 checks/pins 判据层，W5 在卫生/路径层 —— 三波**可并行**（或按人力顺序），但都必须排在 W1 之后以免误归因。
5. **W4 评审先行**：判据语义变更是**闸行为变更**，循 2.4-W2 已验证的路径（先出评审文 → 存量波及实测 → 定档 → 不追溯）；排在 W1 之后是因为 pin-16/17 的语义判据会受适配表结构影响。
6. **W6 靠后**：审计日志与闸接线都消费前序波次产出的真值面（discipline 覆盖率、hooks 执行证据）。
7. **W7 收尾**：文档/口径/迁移必须引用最终事实面，避免二次回潮。
8. **每波一个独立 task、单独提交（`feat(3.0-W<n>): …`）**，链路同 2.x：10-task → 20-task-audit（审查文落盘 `docs/harness/reviews/`）→ `HG-AUDIT-R1` → 30 GATE_VERIFY 首输出 → 实现 → 自证 → `gate-check` → `task close --yes`。

---

## W0 · 重构预备（非功能 · **完整版三文件拆分** · 2026-09-15 细化）

> **本波口径已定**（维护者 2026-09-15 选择）：**完整版**，拆 `cli-host.ts` + `cli.ts` + `cli-checks.ts` 三个 god-file（非收窄版）。
> **版本路由已复裁**（维护者 2026-09-16 提问 · 见「版本路由复裁」块）：**不迁 2.5.0**，W0 保持为 3.0.0 首波（`feat(3.0-W0)`）；配套 **M1 独立验收文** + **M3 对外可达面不变式（锁⑥）**。两个**显式触发器**成立方可翻案。

### W0.1 实测体量（2026-09-15 · 非估）

| 文件 | 实测行数 | 占 `src/` 比 | 备注 |
|------|---------|-------------|------|
| `src/cli-host.ts` | **1458** | — | 适配与物化（最大） |
| `src/cli.ts` | **1318** | — | CLI 入口 + 全命令实现（**旧稿写 ~1105 已过期**） |
| `src/cli-checks.ts` | **1007** | — | 门禁判据 + 关账守卫（**旧稿写 ~844 已过期**） |
| 三文件合计 | **3783** | **38.4%**（`src/` 共 9855 行 / 19 档） | — |

### W0.2 消费者清单（**拆分设计的硬约束** · 逐一实测）

| 被拆文件 | 消费者 | 消费符号 |
|---------|-------|---------|
| `cli.ts` | **`bin/specgate.js:2`** · **`bin/dsh-coding-kit.js:2`** | 经 **`../lib/cli.js`** 取 `runCli` / `exitWithCliError` → **冻结公共面** |
| `cli-checks.ts` | `src/cli.ts:27` · `src/cli-lifecycle.ts:7` · `src/cli-task-extra.ts:20` · `src/cli-status.ts:18` · `test/cli-wiki-delta-section.test.ts:9` · `lib/cli-task-extra.d.ts:1`（类型） | 4 兄弟模块 + 1 测试 + 1 类型（`LegacyGateExemptEntry`） |
| `cli-host.ts` | `src/cli.ts:8` | `cmdHost` · `listKnownHostIds` |

> ⇒ **准确表述（2026-09-16 纠正）**：三个文件**不是"内部私有"**，但**也不是"有稳定外部消费者"** —— 它们是**已发布但对外密封（published-but-sealed）**的内部模块。实测 `package.json#exports` 只暴露 `.` / `./cordis.patch.yml` / `./package.json`，`import.meta.resolve` 对 `spec-wave/lib/cli.js` · `/cli-checks.js` · `/cli-host.js` · `/lib/index.js` **全部返回 `ERR_PACKAGE_PATH_NOT_EXPORTED`** ⇒ **包外无处可达**；`bin/*.js` 靠**包内相对路径** `../lib/cli.js` 消费（`bin/specgate.js:2` · `bin/dsh-coding-kit.js:2`）。
> ⇒ **设计结论不变**（barrel 原则照旧 —— 因为 `bin/` 与兄弟模块是**真实消费者**，其 import 面必须零 diff），但**风险刻画收紧**：**不存在"打穿外部消费者"的风险**（外部根本进不来），风险面只剩**内部行为漂移**，而后者正是 W0.5 五重锁的观测对象。

### W0.3 拆分原则（**关键设计决定**）

**内部实现搬迁 + 原文件降级为纯 barrel（re-export）** —— 即：

```
src/cli.ts          →  保留为 barrel：re-export runCli / exitWithCliError（+ 测试/兄弟模块仍在用的符号）
src/cli-host.ts     →  保留为 barrel：re-export cmdHost / listKnownHostIds / 粘性 API / validateHostAdaptDoc …
src/cli-checks.ts   →  保留为 barrel：re-export 全部既有 export（40+ 符号）
新实现落在         →  src/cli/ · src/host/ · src/checks/ 子目录
```

**为什么这样拆**：消费者的 `import ... from './cli-checks.ts'` **一行都不用改** ⇒ 把"零行为变更"从**主观承诺**降级为**机械可证**（见 W0.5 锁②：消费者 import 面 `git diff` 必须为空）。

### W0.4 模块边界（按职责域 · 依实测函数归属划分）

| 目标模块 | 来自 | 内容（实测归属） |
|---------|------|----------------|
| `src/host/table.ts` | cli-host | `DEFAULT_EXAMPLE_REL` · `resolveValidateFile` · `listKnownHostIds` · `hostToolsStickyAbs` · `kitPackageSemver` |
| `src/host/sticky.ts` | cli-host | `HostToolsSticky` · `parse/load/writeHostToolsSticky` |
| `src/host/schema.ts` | cli-host | `validateHostAdaptDoc` 及 `isPlainObject`/`requireString`/`checkS2Field`/`validateAlwaysOn`/`validateDirFrom`/`validateVerify` |
| `src/host/commands.ts` | cli-host | `CORE_COMMAND_VERBS` · `EXPANDED_COMMAND_STEMS` · `parse{C,Expanded}CommandBasename` · `commandEntryApplies` · `assertHostProfile` · legacy Claude 扁平落点 |
| `src/host/materialize.ts` | cli-host | `planApply` · `commitPlannedWrites` · marker merge 族（`extractProductInner`/`wrapProductBlock`/`mergeMarkdownAlwaysOn`…）· `expandFromGlob`/`expandSkillSources` |
| `src/host/backup.ts` | cli-host | `backupsRoot` · `backupFile` · `atomicWrite` · `pruneBackups` · `ensureBackupGen`（`BACKUP_KEEP`） |
| `src/host/report.ts` | cli-host | `hostBanner` · `printHostHuman` · `emitHostFail` · `emitU01Degraded` · `tableVersionOf` |
| `src/host/cmd.ts` | cli-host | `cmdHost` · `cmdHostValidate` · `cmdHostApply` · `cmdHostUpdate` |
| `src/cli/main.ts` | cli.ts | `runCli` · `isMain` · `exitWithCliError`（**barrel 对外面**） |
| `src/cli/usage.ts` | cli.ts | `usage` · `INIT_USAGE` · `TASK_USAGE` · `CLOSE_GUARD_ORDER` · `VALID_PRESETS` · `VERIFY_BLOCKED_EXIT_CODE` · `collectVerifyObservability` · `readPkgVersion` |
| `src/cli/init.ts` | cli.ts | manifest 读写（`manifestWritePath`/`manifestPath`/`readManifest`）· `nowUtc` · `isLegacyHarnessLineVersion` · `compareVersion` · `isInteractiveInit` · `parseInitToolsArg` · `promptInitTools` · `cmdInit` · `cmdUpgrade` |
| `src/cli/gates.ts` | cli.ts | `cmdCheck` · `formatGateCheck` · `cmdGateCheck` · `cmdAudit` |
| `src/cli/verify.ts` | cli.ts | `cmdVerify` · `verifySpecMode` · `verifyBareReviewsMode` · `wikiLintJson` · `printWikiLintIssues` |
| `src/cli/task-cmd.ts` | cli.ts | `cmdTask` · `cmdTaskLint` · `cmdTaskClose` |
| `src/checks/invoke-hats.ts` | cli-checks | `PRE30_HATS` · `extractHatsFromInvokeName` · `resolveRequiredInvokeHats` · `collect/missingInvokeHats` · `checkPre30InvokeHats` |
| `src/checks/close-guards.ts` | cli-checks | `CloseGuardOutcome` · `taskTargetRoot` · `evalClose*`（~14）· `evalCloseGuard` · `isCloseHubGateEnabled` · `findHubFile` · `resolvePrMergedState` · `listBareSpecFiles` |
| `src/checks/review-gates.ts` | cli-checks | `evalSpecReviewsRetention` · `findSpecReview` · `findLatestReview` · `findReview` · `evalReviewConclusion` · `extractSpecSlug` · `shouldSkipSpecAudit` |
| `src/checks/exempt.ts` | cli-checks | `LEGACY_GATE_EXEMPT_REL` · `LegacyGateExempt(Entry)` · `loadLegacyGateExempt` |
| `src/checks/test-artifacts.ts` | cli-checks | `runTestCheck` · `hasTestArtifacts` · `walkFiles` · `workflowHasTestStep` · `listWorkflowFiles` |
| `src/checks/lint.ts` | cli-checks | `lintTaskFile` · `LintIssue` · `PLACEHOLDER_RE` · `CHECKBOX_RE` · `ABS_PATH_RE` · `KNOWN_STATUS_TOKENS` |

> **注**：以上为**归属建议**（依实测行号与函数聚簇）；具体边界以 W0 task 的 10-task 定稿为准，**但"barrel 保留 + 消费者零改动"这一条不可动**。

### W0.5 零行为变更的六重机械锁（本波核心验收）

| # | 锁 | 判据 |
|---|-----|------|
| ① | **用例计数锁** | `npm test` 拆分前后同为 **607 用例 / 606 pass / 0 fail / 1 skip**（2.4.2 基线实测值） |
| ② | **消费者 import 面零 diff** | `git diff` 对 `src/cli-lifecycle.ts` / `cli-task-extra.ts` / `cli-status.ts` / `test/cli-wiki-delta-section.test.ts` 的 **import 语句** 必须为空（**barrel 原则的机械化证明**） |
| ③ | **公共导出面快照锁** | `lib/cli.d.ts` / `lib/cli-checks.d.ts` / `lib/cli-host.d.ts` 的**导出符号名集合**拆分前后逐字一致（脚本提取比对 · 建议固化为 W0 交付的检查脚本） |
| ④ | **发布链路锁** | `npm run test:lib` 6/6 绿（覆盖 `bin/*.js → lib/cli.js → src` 全链）· `pins check` 17/17 |
| ⑤ | **平台锁** | `typecheck`（strict + `noUncheckedIndexedAccess`）· `build` 均零错 |
| ⑥ | **对外可达面不变式**（2026-09-16 新增 · 比锁③更有意义） | 断言**包外真正可触达的面**逐项不变：`package.json#exports` 映射（键与目标值）· `lib/index.d.ts` 导出符号集 · 三个 bin（`spec-wave`/`specgate`/`dsh-coding-kit`）的 `--help` 与行为 · `files` 清单。**理由**：锁③只快照内部 `lib/*.d.ts`；而实测对外唯一入口是裸名 `spec-wave`（→`lib/index.js`）+ 3 bin（`exports` 封死全部 subpath）⇒ **锁⑥ 才是"消费者零感知"的机械化证明**。另须断言 `exports` 中**不得新增**任何 `./lib/*` 子路径（防重构顺带开放 deep import） |

> **M1 · 独立验收文（2026-09-16 新增 · 版本路由复裁的配套）**：本波必须在 `docs/harness/reviews/` 落**一份独立的 W0 验收文**（以五重锁+锁⑥为验收工具 · 含拆分前后实测数字与快照 diff 结论），且**必须早于 W1 动 schema**。⇒ 把"重构被埋在 3.0 大版本里"变成"**重构有自己的证据面**"，作为 2.5.0 唯一真收益（独立验收）的等价替代（见「版本路由复裁」理由 3/M1）。**该验收文不得只引 `.workbuddy/` 下件**（硬约束 14）。

### W0.6 执行与回退粒度

- **每文件一个 commit**（`refactor(3.0-W0): 拆 cli-host → host/*` 等）× 3，**不混行为变更**；`E3` spawn 削减另起 commit（与 E4 隔离）。
- **每个 commit 独立可回退**：任一个红 → **只 revert 该文件对应的 commit**，另两个保留（不整体重启）。
- **顺序建议**：`cli-checks.ts`（消费面最大但**无外部冻结面**）→ `cli-host.ts`（W1 直接前置）→ `cli.ts`（触冻结面，风险最高，最后做）。
- **禁止** `git add -A`；禁止顺带改行为 / 文案 / exit code。

### W0.7 范围、硬前置与风险

- **范围**：E4 三文件拆分（上式）；E3 第一批 —— `cli-g1g7` 45× / `refresh` 41× 的 spawn 型断言下沉为核心逻辑单测 + 少量烟测，把总 spawn 从 354 起步下降。
- **硬前置**：**重构与行为变更严格分离 commit**；每 commit 前后 `npm test` 同绿（**2.4.2 基线 607 用例**＝604 pass+2 tag-gated+1 skip → **tag `v2.4.2` 已落位，tag-gated 应已转绿**，故 W0 开工时须以**复跑实测**为基线，不得沿用旧数字）。
- **非范围**：不改任何 CLI 行为、输出、exit code、错误文案；不动 schema；不动 pins；不动 `bin/`；**不动 `package.json#exports` / `files`，不新增任何 `./lib/*` 子路径**（防重构顺带开放 deep import —— 见 W0.5 锁⑥）。
- **风险**：E4 原判**代价 5**、回归面最大 —— **但 2026-09-16 实测收紧**：三 god-file **对外不可达**（`exports` 封死全部 subpath ⇒ 包外零消费者）⇒ **"打穿外部消费者"风险实测为 0**，剩余风险仅**内部行为漂移**（由五重锁+锁⑥ 观测）。故**代价初判由 5 下调为 4**（编制劳动仍在，故不低于 4），**待 W0 task 起草复核**。①②③⑥锁任一不过即**停并回退该 commit**；E3 削减 spawn 可能掩盖回归 → 下沉断言**必须配等价单测**，"删了不补"视为未完成；若 `src/cli.ts`（触冻结面）反复不过 → **允许把 `cli.ts` 留到 W0b 延后**，仅交出 `cli-checks` + `cli-host`（W1 只依赖后者）。

## W1 · 适配表 schema 跃迁（本次核心 · breaking）

- **范围**：三项同属 `mvp-hosts.yaml` schema，**一波设计**：
  - **A3 上半**：schema 增 `hooks` 节（宿主 hook 声明：机制族 + 触发点 + 命令）与 `verify` 节（宿主侧校验声明）；增 `schema_version` 字段
  - **B2**：增 `defaults`（全局默认）+ host 级 `extends`（继承与覆盖），替代当前扁平全量重复
  - **B3**：`commands` 动词名入表（去 `cli-host.ts` 硬编码动词名，改为数据驱动）
  - **A3 下半 · 闸判定泛化（本轮实测新增 · `HG-SCHEMA-CHANGE` 的机制前提）**：新增人闸要"真能咬住"，须先修**存量既存缺口** —— 30 判定现为**白名单硬编码**（`evaluateMayStart30` `cli-shared.ts:292-306` · `formatGateCheck` `cli.ts:487-525` 只认 `HG-AUDIT-R1`/`HG-TASK-DRAFT`/`HG-GRAPH-MODULES`），而**存量已有 13 种 HG 闸 / 229 行**（`HG-SPEC-SIGNOFF` 55 行从未被检查 · 其 `blocks_hats` 多处含 `30`）。**改为声明式泛化**：「**任何 `blocks_hats` 含 `30` 的非 approved 闸 → 拒 30**」，`formatGateCheck` 表同步泛化渲染全部命中行；保留 `HG-AUDIT-R1` **缺行即拒**（fail-closed by absence）。**兼容性已实测**：229 行中 `blocks含30 ∧ status≠approved` = **0 行** ⇒ 泛化对存量**零误伤**（`HG-SPEC-SIGNOFF=N/A`、`HG-EOS-DATE=pending` 等 `blocks=—`/非 30 行不受影响）
  - **向后兼容**：旧扁平格式**零改动仍可读**（按 `schema_version` 缺省探测），旧格式 → 新格式的等价语义明确
- **硬前置**：**先出 schema 变更评审文**（落盘 `docs/harness/reviews/`）→ 新设人闸 **`HG-SCHEMA-CHANGE`**，且**必须把该闸行写进 W1 自身 task 文的 `### 人工闸` 表**（`parseHumanGates` 只读 `### 人工闸` 节 —— 闸不落表则泛化改造亦采集不到，等同虚设）；本波是 breaking，须同步 `MIGRATION.md` 迁移节草案。
- **非范围**：不改 13 宿主既有落点路径（物化目标不变）；不改 pin-17 的"表行 ∧ 词锚"判据（表结构与宿主 id 不变）；不引入第二份适配表。
- **验收要点**：① 旧格式 `mvp-hosts.yaml` 在新版**零改动**通过（向后兼容回归锁）；② `extends`/`defaults` 合并语义有正/负 fixture（覆盖、深合并、循环继承拒绝）；③ `hooks` 节声明可被机检（对应 A4 式"声明→接线"口径）；④ 13 宿主 `host apply` / `host update` 端到端不回归；⑤ `pins check` 17/17 仍绿（含 pin-17 13 宿主双语命中）；⑥ **闸判定泛化回归锁（把硬约束 3 从文档承诺变为机械可证）**：新 fixture 构造**只含** `HG-SCHEMA-CHANGE | pending | 30` 一行的 task，断言 `evaluateMayStart30()` 返回 `{ ok:false, reason:'HG-SCHEMA-CHANGE pending' }` 且 `status` 的 `may_start_30 === false`；**并断言存量 229 条 HG 行的判定结果逐条不变**（泛化零行为漂移 · 以扫描快照为基线）；⑦ `gate-check` 输出表**泛化渲染**所有 `blocks_hats` 含 30 的闸行（不再只列 3 行）。
- **风险**：**breaking 面最广**（所有宿主消费者）→ 必须有 back-compat reader + 版本探测 + 显式迁移指引三重保险；`hooks` 语义若过度设计（如内置运行时）会拖累 W2 → 口径定为"**只声明与物化，运行时归宿主**"。

## W2 · 门禁入住宿主 + 接入面开放（战略目标兑现）

- **范围**：A3 兑现面 —— ① `hooks` **物化**到 13 宿主落点（按 W1 的"机制族"抽象：shell-hook / config-hook / 无 hook 降级）；② `host verify` **物化**（校验宿主侧已物化内容与声明一致，检出人为篡改）；③ **P0 门禁在宿主内真实生效**（宿主触发 hook → 门禁拒绝脏提交/脏归档，而非仅 CLI 侧把关）；B5 —— 适配包插件机制（catalog + 多表合并 + 用户级目录 `~/.spec-wave/hosts/` 加载）。
  - **B5 的准确缺口（本轮复核修正）**：**不是"外部表接不进来"**——`host validate` / `apply` / `update` **早已接受 `--file PATH`**（`cli-host.ts:472/1140/1301`；`resolveValidateFile:438-441` 有 `fileArg` 即用、否则回包内默认 `:56,440`），**第三方今天就能用一张外部表接入自有 agent，无需改包发版**。真正缺的是：① **catalog**（表不可发现 · 无版本/完整性声明）；② **用户级目录**（必须每次手传 `--file`，无法"装一次全局可用"）；③ **多表合并**（只能一张表，无法"内置 13 宿主 + 我的增量"组合）。
  - **第三方视角（本波硬要求）**：B5 交付后须保证**新增一个非内置自定义 agent 全程不改 spec-wave 发版** —— "写一张表 → `--file`（现状路径）或 catalog（B5 路径）→ 物化 + verify"闭环可用。
- **非范围**：不替宿主实现 hook 运行时；不做远程/在线分发（第二分发通道已冻结）；不新增**内置**宿主（B4 已于 2.3 完成 13 宿主）；**不承诺"接入即获得 L3"**（无 hook 能力的宿主降级 L1+L2）。
- **验收要点**：① **至少 2 个真实宿主端到端演示**（hook 被宿主真实触发 → 门禁拒绝一次脏提交，留录屏/日志证据）；② `host verify` 对人为篡改的宿主落点报红、对合规报绿；③ 用户级目录加载**不破坏**内置 13 宿主（负向 fixture：恶意/损坏的用户表不得覆盖内置）；④ `pins check` 与 `host validate` 全绿；⑤ **第三方自定义 agent 端到端（本波新增硬要求）**：新造一个**不在内置 13 宿主之列**的宿主 id，仅凭一张用户表走通 `host apply --file`（现状路径）与 catalog 加载（B5 路径）**两条路**，且 `host verify` 对其生效 → **证明接入面不依赖改包发版**；⑥ **无 hook 宿主的降级留痕**：声明 `hooks` 但宿主无可用机制时，显式降级 L1+L2 且输出中**可区分**，不得静默装作已进 L3。
- **风险**：各宿主 hook 机制差异大且文档质量参差 → **按机制族抽象而非逐宿主硬编码**，无 hook 能力的宿主显式降级并留痕；B5 与 W1 catalog 强耦合 → 若 W1 延后则 B5 顺延，不得抢跑。

## W3 · 本体驱动的图谱统一（研究前置）

> **为什么合并成一波**：路线研究原把 `A4 ontology-check 接线`（性价比 2.0）与 `F1 双图谱统一`（**性价比 1.2 · 全表垫底**）列为两条独立项，且 F1 被归入「主线六 · 架构级（远期）」——**无从下手**。但本轮盘点发现：**ontology 恰恰就是两图缺的那个共同 schema**。把它作为本体底座，A4 不再是孤立"接线"、F1 也不再是"把两个不相干的东西焊在一起"，两者是同一件事的两半。**先研究、后实施。**

> **本体形式化路线已裁决（2026-09-15 · 用户点名「是否引入 OWL」· 结论见研究文）**：**不引入 OWL**。四道硬障碍（任一单独即可否决）——① **语义假设根本冲突**（决定性）：OWL 是 **OWA**（开放世界，"没写"≠"不存在"），而 SpecWave 的每一条门禁（结论闸 / pins / S2 保护 / HG 闸）全是 **CWA**（封闭世界，缺失即红）；「必须存在审查文」这类规则**在 OWL 里表达不出来**（已用可运行实验证实）。② **许可**：npm 上唯一可用的 OWL-DL 推理机 `rdf-reasoner-konclude`（Konclude→WASM · SROIQ · 2026-05）为 **LGPL-3.0-or-later**（wrapper 与 wasm 均 LGPLv3）+ **v0.1.0** —— MIT 包不可捆、成熟度不足以担门禁。③ **依赖爆炸**：标准 SHACL 实现 `shacl-engine` 虽 MIT，但 **11 直接依赖 → 408 传递依赖**（本项目基线仅 **2 个非 dev 依赖**，约 **200×**）。④ **无消费者**：消费侧实测无任何代码把图谱当真值用 ⇒ 推理是**确定的成本 vs 假设的收益**。**采纳 OWL 的「分层建模」思想（TBox/RBox/ABox）+ 采用 SHACL 的 CWA 语义子集，自研零依赖校验器**；内部真值仍 YAML；**OWL/Turtle 仅作可选导出出口**，触发条件（三条同时满足）见研究文 §7.3。

> **同轮新发现（A4 由此获得实质价值 · 非形式主义）**：随包 `assets/ontology.yaml` **自身引用完整性已破** —— 用 4 条形状（约 40 行 · **零新依赖**，仅用既有 `js-yaml`）校验即得 **3 处 `sh:class` 违规**：`relations[0]`（`embedsInto`）两端 `DisciplinePackage` → `BusinessRepository` 未声明、`relations[3]`（`produces`）客体 `TraceArtifact` 未声明（`classes` 15 项均不含此三类，疑为私仓本体裁剪到随包版本时丢失）。⇒ **A4「ontology-check 接线」一上线即真红**；首批形状集已备好（研究文 §7.2）。**探针脚本**：`.workbuddy/output/_frag/onto_probe_20260915.mjs`（运行即 `conforms: false` / exit 2）—— ⚠️ **本地件 · 未入库**，W3 须随研究文一并镜像入 tracked 路径。

> **研究文（⚠️ 尚未入库 · 本轮实测）**：雏形落于 `.workbuddy/output/研究-3.0-W3-本体与图谱-OWL引入评估.md`（10 节 · 含能力矩阵 / 四障碍 / 方案 A~D 对比 / 落地设计 / 证据出处）。**但 `.workbuddy/` 整体被 `.gitignore:4` 忽略** —— 实测 `git check-ignore -v` 命中 `.gitignore:4:.workbuddy/`、`git ls-files --error-unmatch` 报"**未匹配任何 Git 已知文件**"（该目录下仅 9 份 2026-09-09 的专家团产物曾被 force-add 留痕）⇒ **该文不在仓，任何 clone / 评审员都无法验证**；而本档与**硬约束 13** 均引用其 §7.3 ⇒ **W3 动工前必须把正式版落盘 `docs/harness/reviews/`（tracked · 该目录现有 77 文）并在本档回填仓内链接**，否则**不得引用为证据**（见硬约束 14）。

- **前置专项研究（本波第一步，不可跳过）**：三套本体零共享 schema 的现状测绘与统一可行性——
  - **三套本体实测盘点**：① **HGM 事件溯源图**（`src/cli-graph-hgm.ts` 471 行 · `graph ingest` → `.coding-kit/events/*` → `graph snapshot` → `snapshot.json` · `graph axioms check` 违例 exit 2 · 由 `timeline --task` 消费）；② **tech-graph 编译图**（`src/cli-graph-yaml.ts` 597 行 · `*.graph.yaml` → MD/`graph.json` · schema id `inform_graph.v3` · **源目录缺省为消费者仓** `docs/_tech_graph/`，仓库自身那份**不随 npm 包发布**）；③ **`assets/ontology.yaml`**（113 行 · **随包发布** · `src/` 零引用 · 身份见研究问题 ④）。合计 **1271 行图谱源码 + 13 份仓内图谱档**，两图零共享 schema、第三套本体与两者都不相连。
  - **停更事实（用户 2026-09-15 指出"图谱很久没升级过" · 已实测确认）**：真实图谱功能改动止于 **2026-08-25~08-28**（`cli-graph-yaml.ts` 末次实质改动 `0486583` 2026-08-28 幂等化 · `cli-graph-hgm.ts` 末次实质改动 `5ceb119`/`ec63bef` 2026-08-24）；此后**近三周**图谱源码零功能演进，`assets/ontology.yaml` 仅随每次发版 bump 改 `product_semver`（钉面对齐）。→ **该子系统同时具备"长期停更"+"从未被对抗复攻"两个特征，是本波必须先研究、不可直接排期实现的硬理由。**
  - **研究问题**：① 三者的**最小公因子**是什么（节点/边/事件的公共语义）？ontology 能否成为两图的共同本体底座？② **消费侧盘点**——现在谁在读图谱（实测只有人看 + `timeline` 读 HGM + CI 做 `git diff` 漂移检查），没有代码把图谱当真值用；③ `graph axioms check` 的**判据强度对抗验证**（照 2.4/2.4.1 的方法：裸子串/字面连续/枚举顶包三类构造）——图谱子系统**从未被任何一轮验收复攻过**，属"未受检验"区；④ **本体的归属与开放边界**（用户 2026-09-15 提问）——`assets/ontology.yaml` 现状是 **SpecWave 自身的产品设计本体**（头注释自述"cyning-harness 产品设计本体 · 机器可读抽取"；`classes` 全为自有概念：Package[Track/Template/Preset/WizardTool/IDEFragment] + Instance[Task/Hat/HumanGate/InvokeSnapshot/AuditReview/Inform|Constrain|VerifyArtifact]；人类真值在**私仓** `DESIGN_ONTOLOGY_v1_zh.md` 且**不随包分发**；`product_semver` 随每次 bump 变 → 实为**钉面资产而非能力**；头注释自认"独立的 ontology-check 本包未接线"）。**须裁决：本体是"SpecWave 自用元模型"（现状），还是"可被消费者/宿主扩展的底座"？** 若是后者，须**分两层**——**产品本体**（SpecWave 自身 · dogfood · 随包 · 管 Track/Hat/Gate）vs **实例/领域本体**（消费者在自己仓声明自己的业务语义，SpecWave 只供 schema + 校验器 + 编译到图的路径，**不预置内容**）；若是前者，**明确登记"不提供自定义本体能力"** 并约束对外文案，避免暗示；⑤ **本体形式化路线（是否引入 OWL）** —— **已裁决"不引入"**（理由见上方裁决块 · 障碍①②③④），研究文须补**完整论证**（能力矩阵 + 四障碍 + 方案 A~D 对比 + 落地设计）并为 **3.x 复议保留显式触发条件**（不得写成"永不"）。
  - **研究问题的边界澄清（避免混淆）**：**"消费者构建自己的图"今天已可用**——`graph yaml compile|check|export` 是公开 CLI（`src/cli.ts:110`），源目录缺省即**消费者仓**的 `docs/_tech_graph/`（`cli-graph.ts:77`，且可传 `inputArg` 指向任意目录）；`graph ingest|snapshot|axioms` 亦公开。**未开放的是本体层**（语义/schema 由消费者声明），不是图能力本身。研究文须把"图能力（已有）"与"本体能力（未开放）"分开陈述，不得混为一谈。
  - **产出**：`docs/harness/reviews/` 落盘研究文（含 schema 统一方案 A/B 对比 + 迁移成本 + 是否值得跨 major 的裁决 + **本体归属与开放边界裁决** + **本体形式化路线裁决（OWL 否决论证与 3.x 复议触发条件）**）。**雏形已产出**：本轮研究文（`.workbuddy/output/研究-3.0-W3-本体与图谱-OWL引入评估.md`）。
- **实施范围**：A4 —— `ontology-check` 接线，让 `ontology.yaml` 从**声明**变为**可机检真值**（现状 `src/` grep `ontology` = 0）；**实现口径已定**：**自研「SHACL 语义子集」校验器**（`targetClass`/`minCount`/`maxCount`/`class`/`datatype`/`pattern`/`in`/`severity` + 机读报告）· **零新依赖**（仅既有 `js-yaml`）· **不引 OWL/RDF/SPARQL 运行时**；F1 —— 按研究文选定的方案做图谱统一（**以 ontology 为共同本体底座**；不引 OWL 后统一目标改为"**共享 YAML 本体 + 各自编译**"，而非"RDF 化 + 推理对齐"）；F2 —— `discipline show` / `lifecycle show` 改读消费者资产（O3 真口径，替代自述口径）。**本体开放仅在研究文判"开放"时才做**（且只开放 **L-C 约束层**与 **L-I 实例层**；**L-T 产品本体保持 SpecWave 自有**，避免"消费者可改产品语义"导致门禁不可信 —— 口径来自研究文 §7.4）。
- **非范围**：不重写 ontology 内容（只接线与统一）；**不预置/不臆造消费者的领域本体内容**；**不引入 OWL / RDF / SPARQL 运行时，不做 DL 推理**（裁决见上）；**不实现 OWL/Turtle 导出器**（只做"可导出"的命名留白，如稳定 IRI 友好命名空间）；不做图谱可视化 UI；不动 S2 三域；`docs/_tech_graph/` 维持"不随 npm 发布"；**不新增任何运行时依赖**（A4/F1/F2 全部落在既有 `js-yaml` 之上）。
- **验收要点**：① `ontology-check` 对故意漂移的 ontology 报红、对合规报绿（负向 fixture）；② 统一后两图**同 schema 校验通过且不产生双份真值**（单源）；③ `graph axioms check` 的三类对抗构造**修复前真红、修复后转绿**（或明确登记为设计性残留）；④ `discipline show` 输出与 `discipline-coverage.yaml` 逐项一致（机检）；⑤ **本体开放边界有明确裁决落盘**（开放 / 不开放二选一皆可，但必须**写明结论 + 对外口径约束**，不得留空或模糊）；⑥ **本体引用完整性（本轮实测已真红·硬要求）**：`relations[].subject/object ⊆ classes[].id`、`human_gates[].blocks_hats ⊆ 已声明帽`、`axioms[].id` 匹配 `^ONTO-[A-Z0-9]+$` —— 三类形状 **接线前 3 处违规 / 接线后 0 处**，且**该缺陷的处置二选一必须留痕**：真修（补齐声明）或**显式登记为设计性裁剪豁免**（不得静默放过）；⑦ **零新依赖证明**：`dependencies` 变更前后一致（仅 `js-yaml`），lock 非 dev 计数不增。
- **风险**：F1 代价 5（全表最高档之一）→ 若研究文判定"统一不划算"，**允许本波只交付 A4 + F2 + 判据加固，把统一显式降级为 3.x 并留痕**，不得为凑范围硬做；**不引 OWL 后 F1 复杂度已下调**（无需 RDF 化 / 推理对齐 / 三元组库选型，统一退化为"共享 YAML 本体 + 各自编译"）→ **代价初判由 5 下调为 3**（理由：砍掉三项最高成本项后，剩余为"抽公共 schema + 两图各配适配器 + 单源校验"；仍高于 A4 的 3 因含两图改造，故不降为 2）· **待 W3 研究文定稿复核**（勿沿用旧值 5）；**本体开放代价未估** → 与 F1 同列为**可降级项**（判"不开放"即零实施成本，仅落口径）；图谱不随包发行 → 统一方案须同时说明"包内消费者拿不到图谱"这一约束如何处理；**自研 SHACL 子集与标准实现可能行为分歧**（研究文 §8·R1）→ 显式声明 profile + 建对照 fixture，**不得对外声称 W3C 一致性**。

## W4 · 防伪判据语义化（评审先行 · 自评类豁免）

- **范围**：把**防伪类**"弱判据"统一升级为**语义边界判据** ——（**自评类判据排除在外**：见下 KPI 条 + 硬约束 11）
  - **结论闸**：NEW-5（`REVIEW_MIN_SUBSTANCE=20` 只是长度门槛，填充 16 字即过）→ 语义闸（须含签收主体/对象/结论动词的组合，而非纯长度）；**R-5 + NEW-11**（`不\n通过` **跨行漏网**、词表仅中文）→ 跨行形态封堵 + 跨语言词表 —— ⚠️ **R-2/R-4 的同句共现窗口（`不[^。；\n]{0,12}通过`）与 `not\s*pass` 已由 2.4.2 交付**（`src/cli-checks.ts:688`），本波**只做真残余**：`\n` 换行形态（2.4.2 以 K 断言钉死防顺手修，显式留 3.0）+ 词表广义化。
  - **pins**：NEW-4（pin-17 伪表行顶包 → 须"宿主 id 落主键列 + 表头结构"双命中）；pin-08（版本串须与**发布态措辞**绑定，而非仅边界完整）—— ⚠️ **R-3（pin-16 无引号 HTML 属性）已由 2.4.2 交付**（`src/cli-pins.ts:327` 三选一），本波**不再列**。
  - **豁免**：NEW-10（`legacy-gate-exempt` 的 `authorized_by` 只校验非空字符串 → 真实性核验；且 `close` 不消费 exempt 与裸 `verify` 逻辑分叉 → 口径统一）
  - **KPI 关账判据（本轮实测发现 · ✅ 已裁决 · 本波唯一"不做语义化"的例外）**：`close_kpi` 只验「`### KPI` 节存在 + 含**可解析分数**」三种形态任一，**不验评分口径**。实测数据：74 份任务中 **37 份有 KPI 节**（另 37 份无）；有节的 37 份 **100% 只用 `Task_KPI%`**，`D1–D5` 表与「四维 1–5」两形态**零采用**；分数 **min 90 / max 100 / 中位 96 / 均值 96.8**，**18/37 为满分**（值域压缩、区分度趋零）；**0 份**出现分帽 KPI；`kpi_aggregator` 实测 **27/27 全为 `CLOSE`**（`00` 档零采用）；且 `KPI_RUBRIC_v1_2` 被每份任务引用，但**评分表本体不随包**（真值在私仓 `SDD_HAT_FLOW_v2_zh.md §6`，`POINTER_SDD_HAT_FLOW.md` 明示"不随 spec-wave 发布"）→ **包消费者见引用、见不到规则**。
    **维护者裁决（2026-09-15）**：**① 取消「每帽 KPI」设想** —— 该机制**从未实现**（模板仅一节 `### KPI（00）`，由 00 帽汇总），今后**不再作为规划项**（用户指示原文："暂时先取消该设想"）；**② 不补语义闸** —— 理由原文：**"补了语义可能还会限制思考"**，即不给**自评类**判据设机械门槛，避免以判据替代思考；**③ `close_kpi` 本体维持现状** —— 仅保留"节存在 + 含可解析分数"的**存在性约束**，**不新增**任何语义/事实绑定约束，**不落地**分帽，**不移除**该节（零变更）。**遗留口径登记**：`KPI_RUBRIC_v1_2` 引用而不随包的问题**本波不处理**（属对外可解释性，若日后要动，归 W7 对外口径）。
  - **由此确立的判据分类原则（升级为硬约束 11）**：**防伪类判据继续语义化，自评类判据不语义化** —— 本波结论闸（NEW-5 / R-4 / R-5）与 pins（NEW-4 / pin-08 / R-3）的语义化属**防伪**（防"没通过写成通过"、防"版本串漂移"），**照做**；KPI 属**自评**（给思考打分），设机械门槛会反向约束思考，**不做**。二者边界须在 W4 评审文中**显式写明**，避免后续波次把"语义化"当成无差别口升级。
  - **附**：N5 口径登记（`assets manifest rebuild` 的追认语义在 provenance 未启用前提下**不封堵**，只做口径标注）
- **硬前置**：**先出判据语义方案评审文**（落盘 `docs/harness/reviews/`）再动手 —— 闸语义变更影响所有消费者的 failClosed 行为；**不追溯存量**（沿用 D-24-W2-NO-RETRO）。
- **非范围**：不改结论节存在性判定；不改豁免机制的存在性（只加真实性约束）；不追溯 done task。
- **验收要点**：① 每条负向 fixture **修复前真红、修复后转绿**（全部固化为回归锁）；② 存量波及**实测登记**（现行审查文 / spec 索引行 / done task 全量复跑，误伤须可枚举、豁免须可留痕）；③ 新增语义判据的**正例（真实合规文书）零回退**。
- **风险**：语义判据过严会误伤真实合规文 → 定档以"**误伤率可枚举、豁免可留痕**"为界（该路径已被 2.4-W2 验证可行：S1·N=20 存量误伤 0/48）；跨语言词表难以穷尽 → 只承诺"常见形态覆盖 + 残余显式登记"，不承诺完备。

## W5 · 机械清扫与可诊断性

- **范围**：NEW-6 —— `check-pack-hygiene.mjs` 黑名单由精确后缀改**通配语义**（`\.(bak|BAK)(\.|$| )` 等），`package.json` `files` 否定项同步；NEW-7 —— 卫生门加第二控制点，或**显式声明**仅 `prepublishOnly` 单点依赖（避免"以为有双保险"）；NEW-8 —— `pins fix` 的备份清理改"**存在即改名/跳过**"，不再无条件 `unlink` 同名既有 `.bak`；NEW-12 —— `relativizeOutputValue` 覆盖**对象 key**（当前只改 value）；**R-6** —— `pins` `extract_error` 按因分档（git 不存在 / 执行失败 / 非 git 仓 / tag 缺失）+ 测试套件加 git 可用性前置探测（不可用则显式 skip 并标注）。⚠️ **R-1（`host validate` 缺省基取仓根 + 仓外 `outside_repo`）已由 2.4.2 交付**（`src/cli-host.ts:489-498,552`），本波**不再列**（其验收项 ④ 随之作废）。
- **非范围**：不重做卫生门架构；不引入新依赖；不改 exit code 语义。
- **验收要点**：① NEW-6 负向 fixture：`.bak2` / `.bak.md` / 尾空格 `.bak ` 均被拦；② NEW-8 负向 fixture：用户既有同名 `.bak` 在 `pins fix` 后**存活**；③ NEW-12 fixture：以路径为 key 的 JSON 输出被相对化；④ **R-6：在 git 不可用环境（模拟 license 未同意 → exit 69）下，套件显式 skip 而非 fail**，且 `pins check` 输出区分"git 不可用"与"钉面偏差"；⑤ **R-1 回归确认（非本波实现）**：以 2.4.2 既有行为为基线，跨目录 `host validate --json` 仍无绝对路径（**只验不回改**，防本波机械清扫误伤）。
- **风险**：低。唯一注意点是 R-6 的"skip 而非 fail"可能与"failClosed 不可绕过"原则冲突 → 口径：**skip 仅限"环境不具备"（git 不存在/不可执行），"钉面真偏差"一律 exit 2**，两者在输出中必须可区分。

## W6 · 可观测与审计

- **范围**：C6 —— 结构化审计日志落盘（**独立于 S2 过程轨**，机读字段完备）；F4 —— S2 公理接真实触发源（当前为纸面/代理口径）；闸未接线补全 —— G2（reviews 存在性闸：`verify --task` / `task close` 的审查文存在性）、G4（思考轮控制表）、N2-C（`verify --task` 补 lint 步，**须 FAIL 率下降**）、G7（执行证据 · runner）。
- **非范围**：不做遥测上报（本地落盘即可）；不接外部日志服务；**审计日志不得写入 S2 三域**。
- **验收要点**：① 审计日志字段完备且可机读（schema 化 + 快照断言）；② G2/G4 接线后负向 fixture 真红（缺审查文 → BLOCKED 点名）；③ N2-C 的 FAIL 率**实测下降**（须给前后数字）；④ `discipline-coverage.yaml` 对应项 `not_wired` → `mechanical/closed` 回写。
- **风险**：C6 与 S2 过程域边界须明确（否则违反"永不覆写"硬约束）；N2-C 若 FAIL 率不降则本项**不得标记完成**（沿用 2.4 PLAN 硬约束"修严型必须配负向 fixture 回归锁"）。

## W7 · 收尾与对外

- **范围**：F3 —— wiki 能力补全（双向链接 / 增量更新 / 冲突检测）；E3 剩余 spawn 削减（收官至目标区间）；术语统一（术语表 ↔ 各文档机检）；**A3 对外口径边界**（hooks 能力可声称到什么程度，受事实卡黑名单约束）；**对外物料竞品口径修订（本轮外部复核发现 · 见 §对外口径修订台账）**；`MIGRATION.md` **breaking 迁移节**（2.4.2 → 3.0.0 用户照做即可）；**文档相对链接修复（本轮起草实测发现）** —— `docs/roadmap/` 既有 PLAN 档的 `../.workbuddy/…` 写法解析到 `docs/.workbuddy/…`（不存在）实为**坏链**（实测：PLAN_2_3 坏 4 · PLAN_2_4 坏 2 · PLAN_3_0 起草稿坏 4 已修），应统一改为 `../../.workbuddy/…` 并把**相对链接可解析性**纳入机检；**⚠️ 但"可解析"≠"在仓"** —— `.workbuddy/` 整体被 gitignore，故链接纪律须**两级**：**(i) 可解析**（路径语法对）**(ii) 目标已入库**（`git ls-files` 命中）。**证据入库清偿（硬约束 14）**：把 3.0 依赖的 `.workbuddy/output/` 材料（路线研究 + 2.4.0/2.4.1 验收报告 + W3 研究文 + 探针脚本，本轮实测共 **4+ 件未入库**）**镜像入 `docs/harness/reviews/`** 并回填仓内链接；3.0.0 release bump。
- **非范围**：不新增宿主；不加新命令面（只把既有命令补齐）。
- **验收要点**：① 术语一致性机检通过；② 迁移指引经**真实 2.4.1 仓演练**可通（不只看文档）；③ 对外文案黑名单机检（未落地能力一律"将新增/规划中"口径）；④ **相对链接两级机检**：(i) `docs/**/**.md` 相对链接坏链数 = 0（含修复 PLAN_2_3 / PLAN_2_4 存量坏链）；(ii) **`docs/` 内引用的 `../../.workbuddy/…` 目标必须 `git ls-files` 命中**（可解析但未入库视为坏链 · 硬约束 14）；⑤ **竞品口径台账逐条校对**：旧数值全部替换为带 `as_of` 时点的实测区间，且"流程性门禁"定性偏差已按事实修正（见下台账）；⑥ **证据入库清偿完成**：3.0 引用的 `.workbuddy/output/` 未入库件（本轮实测 ≥4 件）全部镜像入 `docs/harness/reviews/` 或显式登记"仅本地草稿 · 非证据面"。
- **风险**：低。迁移演练若发现 schema 兼容洞 → 回退 W1 补 back-compat，**不得靠文档遮掩**。竞品数值是**滚动量**（会持续增长）→ 只写"复核时点 + 区间 + 出处"，不写单值，避免二次过期。

#### 对外口径修订台账（本轮外部复核 · 2026-09-15）

> 起因：本档起草时复核对外物料，发现 2.x 时代写入的竞品事实**已过期**，且有一条**定性偏差**。这两类都必须修订，否则 3.0 的"差异化"叙事建立在失真的对照面上。

| # | 落点 | 现行写法（过期/偏差） | 复核事实（2026-09-15） | 修订口径 |
|---|------|--------------------|----------------------|---------|
| K-1 | `delivery/research_report.md:169` · `:220` · `:258` | "**30+** AI 编码 agent 集成" | 已扩至 **35–38** 个集成（2026-07 ≈35 → 2026-09 ≈38） | 改 `35–38（as_of 2026-09）`；不写单值 |
| K-2 | `delivery/research_report.md:170` | "社区扩展 **105** 个（60+ 作者）、预设 **22** 个、贡献者 200+" | 扩展 **138–157**（作者 90+）· presets **25–33** · 贡献者 **240–270+** · stars **121K–130K+**（跨快照区间） | 改区间 + as_of 时点；注明"各镜像快照不同步，取区间" |
| K-3 | `delivery/research_report.md:172` | spec-kit"门控是**流程性**的……不是**机械性**的" | **定性偏差**（已由官方文档原文证伪）："Community extensions like **CI Guard** and **Architecture Guard** add compliance gates and governance"；生态另有 **plan-review-gate**（spec+plan 先评审合并才放行任务）· DocGuard（CDD enforcement + spec-kit hooks）· Verify Extension（post-implementation quality gate）· Verify Tasks（phantom completion 检测）等**机械判定类**扩展 | 改为"**内核 SDD 门控为流程性；但扩展生态已含机械门禁类（CI Guard / Architecture Guard / plan-review-gate / DocGuard / Verify 系列），可对接 CI 做拦截**"——**kit 的差异化不再落在"有没有机械门禁"，而落在"门禁是否随包内置（零装配）+ 可多宿主物化（3.0 W2）"** |
| K-4 | `delivery/promotion/`（01~04 四份） | 引用上述旧数值/旧定性 | 同上 | 与 K-1~K-3 同步替换；发布博客若已外发则**不回改历史**，仅在新版对外文案中纠正（沿用"不追溯存量"） |

**复核出处**（2026-09-15 实测）：Spec Kit 官方文档站 `github.github.com/spec-kit/`（"30 integrations · 105 community extensions (60+ authors) · 22 presets · 200+ contributors"+CI Guard/Architecture Guard 原文）；镜像快照（38 integrations · 157 extensions · 33 presets · 270+ contributors · 130K+ stars）；第三方盘点（2026-07：121,000+ stars · 240+ contributors · 35 integrations · 138 extensions · 25 presets）；Spec Kit May-2026 Newsletter（扩展 92→105、presets 18→21）。

**注**：本台账由 W7 执行；2.4.2 已开工（R-1/R-2/R-3 patch），故**不另开 2.4.2 口径 task**，统一收在 3.0 W7（用户 2026-09-15 指示）。

---

## 非范围（明确不做 · 沿用既有决议）

| 项 | 决议 | 来源 |
|----|------|------|
| 自研 IDE | **冻结** | 路线 §6 |
| 第二分发通道 | **冻结** | 路线 §6 |
| 远程 Policy 引擎 | **冻结**（分层强制为文档级） | 路线 §6 · `README.md:170` |
| 商业模式 / 商业化路线 | **非范围**（用户未勾选该维度） | 路线 §6 |
| 1.x 老产品线 | **CLOSED** | `RELEASING.md` |
| `@cyning/harness` / `dsh-coding-kit` | 已 deprecate，仅迁留指引 | npm registry |
| provenance / OIDC 启用 | **仅人**（npm/GitHub 账号配置） | 路线 §7 |
| `npm publish` / `deprecate` / tag / push | **仅人**（或按维护者当次书面授权） | 本仓纪律 |
| 2.x 式"门禁强度补丁"的重复劳动 | **不做**（2.4.x 已收口至无 P1） | 2.4.1 验收报告 §7 |

---

## 硬约束（沿用 2.4 PLAN §硬约束 + 3.0 新增）

1. **S2 过程域永不覆写**：`docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`（只新增不覆写）。
2. **P0 门禁不可绕过**：禁止任何 `--force` / `--allow-*` 新绕过参数。
3. **`HG-SCHEMA-CHANGE` 为 3.0 新增人闸（须可机检）**：任何 schema 变更须先评审文 → 人闸通过 → 才可改码；触 schema 未过闸即 STOP。**该闸须落 W1 task 的 `### 人工闸` 表且 `blocks_hats` 含 `30`**，并由 W1 闸判定泛化（验收⑥回归锁）保证 `may_start_30 === false` —— 否则本约束不可兑现（见硬约束 15）。
4. **向后兼容红线**：W1 交付物必须能让**旧格式适配表零改动继续工作**；不满足则本波不算完成。
5. **重构与行为变更分离**：W0 的每个 commit 不得包含行为变更；拆分前后 `npm test` pass 数必须一致。
6. **修严型变更必须配负向 fixture 回归锁**（沿用 2.4 硬约束 9）。
7. **不追溯存量**（D-24-W2-NO-RETRO 沿用）。
8. **每波单独提交** `feat(3.0-W<n>): …` · **禁 `git add -A`**；每波提交前 `npm run typecheck` + `npm test` 必过。
9. **对外文案受事实卡黑名单约束**：未落地能力一律"将新增 / 规划中"口径。
10. **环境依赖必须可诊断**（R-6 教训）：凡对外部二进制（git 等）有硬依赖的门禁，其失败信息须按因分档，且套件在环境不具备时显式 skip。
11. **判据分两类，处置相反**（2026-09-15 裁决 · KPI 案）：**防伪类**（结论闸 / pins / 豁免真实性 —— 防"没通过写成通过"、"版本串漂移"）**继续语义化**；**自评类**（KPI 等给思考打分的判据）**不语义化**，只保留存在性约束。**禁止**以"统一语义化"为名对自评类加机械门槛。
12. **接入面不得依赖改包发版**（W2 B5 硬要求）：新增一个**非内置**自定义宿主/agent，必须仅凭用户表（`--file` 或 catalog）即可接入；任何要求"改 spec-wave 源码后重新发版才能接入"的设计一律视为 B5 未达成。
13. **本体层零运行时依赖**（W3 裁决 · 2026-09-15）：`ontology-check` / 图谱统一 / 本体开放**不得引入 OWL / RDF / SPARQL 运行时**（含 wasm 推理机与第三方 SHACL 引擎），实现只能落在既有 `js-yaml` 之上。对外**不得声称 W3C 一致性**，只声称"SHACL 语义子集"。3.x 复议须**同时满足研究文 §7.3 三条触发条件**（外部消费者 / 跨组织交换 / 重新评估许可与依赖），且复议本身须走 `HG-SCHEMA-CHANGE` 式人闸。
14. **证据必须入库**（本轮实测教训）：`.workbuddy/` 被 `.gitignore:4` 整体忽略 ⇒ **其中的文件对任何 clone / 评审员不可达**。故：**被本档 / 约束条 / 任务文引为"证据"的材料，必须镜像入受版本控制的路径**（`docs/harness/reviews/` · `docs/spec/` · `docs/roadmap/` 等）并回填仓内链接；`.workbuddy/output/` 仅作**起草工作区**，**不得作为唯一证据面**。本档已实测 4 件违规引用（范围主源①②③ + 探针脚本），W3/W7 须清偿。
15. **闸不落表即虚设**（本轮实测教训）：人工闸**只有写在 task 文的 `### 人工闸` 表**（`parseHumanGates` 只采集 `### 人工闸` 节 · `cli-shared.ts:271`）**才可能被判定逻辑采集**。因此 ——（a）新增闸（`HG-SCHEMA-CHANGE` 等）**必须落 W 波 task 表**，且 `blocks_hats` 须**显式含 `30`**（否则泛化判定不会咬）；（b）规划档（本档）的 `## 人工闸与验收口径` 属 `##` 级、**不可机检**，仅人工纪律，**不得据此宣称"闸已生效"**。
16. **版本路由不得凭直觉开 minor**（2.4.0 §7.3 沿用 + 2026-09-16 复裁强化）：**非 breaking 的工作一律不为它单开 minor**（补丁活儿走 patch，重构活儿随所在 major/minor 列车的首波）。**开新 minor 须先证"有消费者可观察的新增能力"**；仅"想要独立验收/回退粒度"**不构成**开 minor 的理由（改用 M1 独立验收文 + commit 级可回退满足）。`npm publish` / `tag` / `push` 仍**仅人**（`RELEASING.md` 分工：①–⑦ 与 bump/tag 可 Agent，⑧ publish 仅人）。

---

## 人工闸与验收口径

| Gate | 位置 | 通过条件 |
|------|------|---------|
| `HG-NEXT-PLAN` | 本档 | 维护者签收本规划（签收前不得开 W 波 task） |
| **`HG-SCHEMA-CHANGE`** | **W1 前置** | schema 变更评审文落盘 + 维护者批准 |
| `HG-AUDIT-R1` | 每波 | 20-task-audit 审查文 PASS |
| 30 `GATE_VERIFY` | 每波 | `spec-wave verify --target . --task …` 首输出闸扫描表全 approved |
| G6 归档 | W7 | 术语统一 + 引用一致 + 冲突裁决完成 |

> **机检状态（诚实登记 · 本轮实测）**：本档闸列于 `## 人工闸与验收口径`（`##` 级），**不被 `parseHumanGates` 采集**（该函数只读 `### 人工闸` 节 · `cli-shared.ts:271`）⇒ **本档闸不可机检 · 纯人工纪律**。`HG-NEXT-PLAN` 在 task 文件中已有 **25 次先例**（可机检），故 **W 波 task 拆单时应把规划闸写进各自的 `### 人工闸` 表**（届时才受 30 判定约束）；`HG-SCHEMA-CHANGE` 同理 —— **W1 起必须写进 W1 task 的 `### 人工闸` 表且 `blocks_hats` 含 `30`**，否则 W1 的泛化改造亦咬不住它（见硬约束 15）。

**发版口径补充**：3.0.0 为 **major**，`MIGRATION.md` 必须含 2.4.2 → 3.0.0 的 breaking 迁移节；发布前探针须包含"**旧格式适配表在新版零改动可用**"这一项（向后兼容红线）。

---

## 风险与依赖

| 风险 | 说明 | 缓解 |
|------|------|------|
| **A3 触 schema（breaking）** | 适配表格式变更，影响全部 13 宿主消费者 | 向后兼容 reader + `schema_version` 探测 + `MIGRATION.md` + major bump |
| **E4 代价初判 4（原 5）** | god-file 拆分编制劳动大，可能拖累 W1 开工 | 实测三 god-file **对外不可达**（`exports` 封死 subpath）⇒ 外部破坏风险为 0，风险面收窄为内部漂移；六重锁 + W0 独立验收文把关；拆分前后同绿为硬放行条件；必要时可降级为"只拆 cli-host" |
| **版本路由被误改（重开 2.5.0）** | W0 是 3783 行重构，直觉上"该单独发版"；但 §7.3 纪律与 semver 事实均不支持 | 已复裁并落「版本路由复裁」块（5 条理由 + 3 条替代措施 M1/M2/M3）；改动路由须满足块末**两个显式触发器**之一，不得默认沿用直觉 |
| **W1 与 B5 强耦合** | B5 依赖 W1 的 catalog | B5 随 W1 顺延，不抢跑 |
| **各宿主 hook 机制差异** | 稳定性与文档质量参差 | 按机制族抽象 + 无 hook 宿主显式降级留痕 |
| **语义判据过严误伤** | W4 可能误伤真实合规文书 | 评审先行 + 存量波及实测 + 误伤率可枚举为定档边界（2.4-W2 已验证） |
| **E3 削减掩盖回归** | 下沉的 spawn 断言若不等价 | 每条下沉必须配等价单测，"删了不补"视为未完成 |
| **F1 代价初判 3（原 5）** | 双图谱统一可能仍超预算 | 不引 OWL 后已砍三项高成本项 → 降至 3；若研究文复核仍判不划算，可拆 W3a/W3b，W3b 允许延至 3.x |
| **闸判定泛化引入行为变更** | W1 把 30 判定由白名单改声明式，所有 task 的 `may_start_30` 计算逻辑被替换 | 已实测存量 **零误伤**（229 行中 `blocks含30 ∧ status≠approved` = 0）；仍须以**扫描快照为基线**加回归锁（断言存量判定逐条不变）＋ 保留 `HG-AUDIT-R1` 缺行即拒 |
| **环境依赖不可诊断** | 外部二进制不可用时门禁红但无法归因 | W5 R-6：分档诊断 + 套件前置探测（本轮 2.4.1 验收的真实教训） |

---

## 附 · 条目全表（ID ↔ 波次 ↔ 价值/代价）

| ID | 候选项 | 价值 | 代价 | 性价比 | 波次 |
|---|---|---|---|---|---|
| A3 | host-adapt `hooks`/`verify` surface | 9 | 4 | 2.25 | **W1 + W2** |
| A4 | `ontology-check` 接线 | 6 | 3 | 2.0 | W3 |
| B2 | 适配表分层 | 6 | 3 | 2.0 | W1 |
| B3 | commands 动词名入表 | 5 | 3 | 1.67 | W1 |
| B5 | 宿主适配包插件机制（**含第三方自定义 agent 接入面**） | 6 | 4 | 1.5 | W2 |
| F1 | 双图谱统一（**不引 OWL 后代价初判由 5 下调为 3**） | 6 | **3**（初判 · 待 W3 研究文定稿复核） | 2.0 | W3 |
| F2 | discipline/lifecycle 真口径 | 5 | 3 | 1.67 | W3 |
| F3 | wiki 能力补全 | 4 | 3 | 1.33 | W7 |
| F4 | S2 公理接真实触发源 | 4 | 3 | 1.33 | W6 |
| C6 | 结构化审计日志 | 6 | 3 | 2.0 | W6 |
| E3 | 测试 spawn 削减 | 6 | 4 | 1.5 | **W0 + W7** |
| E4 | 拆三 god-file（**完整版 · 实测 3783 行 / 38.4%** · barrel 原则 + **六重锁** · **W0 独立验收文**） | 6 | **4**（初判 · 外部破坏风险实测为 0 · 待 W0 起草复核） | 1.5 | **W0**（**不迁 2.5.0** · 见「版本路由复裁」） |
| NEW-4/5/10/11 | 判据语义化（**防伪类** · R-5 换行残余 + 词表广义化） | — | — | — | W4（**R-2/R-3/R-4 已由 2.4.2 交付**） |
| close_kpi | KPI 关账（**已裁决：取消每帽 · 不补语义闸 · 本体零变更**） | — | — | — | W4 · 零实施 |
| NEW-6/7/8/12 · R-6 | 机械清扫与可诊断性 | — | — | — | W5（**R-1 已由 2.4.2 交付**） |
| G2/G4/N2-C/G7 | 闸未接线补全 | — | — | — | W6 |
| K-1~K-4 | 对外竞品口径修订（过期数值 + 定性偏差） | — | — | — | W7 |
| B5-EXT | **第三方自定义 agent 接入面**（catalog + 用户级目录 + 多表合并） | — | — | — | W2 |
| ONTO-OPEN | **本体归属与开放边界裁决**（开放 / 不开放） | — | — | — | W3 研究 |
| ONTO-OWL | **本体形式化路线裁决**（已否决 OWL · 3.x 留触发条件） | — | — | — | W3 研究 · **已完成** |
| ONTO-REF | **ontology 引用完整性 3 处悬空**（A4 一接线即真红） | — | — | — | W3 · A4 |
| HG-GENERIC | **30 判定泛化**（白名单 3 闸 → 声明式全闸 · 实测零误伤） | — | — | — | **W1** |
| EVID-PROV | **证据入库纪律**（禁引 `.workbuddy/` · 研究文须落 `docs/harness/reviews/`） | — | — | — | **W3 前置 + 硬约束 14** |

**编排落点说明**：A1/A2/A5/A6/B1/B4/C1–C5/C7/D0–D6/E1/E2/E5 均已在 **2.2.0 / 2.3.0 / 2.3.1 / 2.4.0 / 2.4.1** 五波落地或显式归档，3.0 不重复收录；2.2/2.3/2.4 的波次真值分别见各 `PLAN_2_x_*_v1_zh.md` 与 `CHANGELOG.md`。
