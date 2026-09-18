# 规划 · 3.0.1 · 验收缺口收口（patch）

> **状态**：`approved` · **HG-NEXT-PLAN=approved**（2026-09-18 维护者本窗签收（原文：「身为00，统筹3.0.1的升级，授权签收过程文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.4.0/3.0.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）
> **目标发版**：`spec-wave@3.0.1`（**patch** · 收 3.0.0 完整验收所得**单点/文档级**缺口：误报、静默忽略陷阱、退出码分类不一致、口径滞后。**不触 schema · 不新增能力面 · 不改任何判定语义的松紧方向**）
> **基线**：`spec-wave@3.0.0` published（npm `latest` = 3.0.0 · tag `v3.0.0` ↔ `895b975` · `time.3.0.0` = 2026-09-18T00:17:55Z）
> **判断依据（范围主源）**：[`.workbuddy/output/验收报告-SpecWave-3.0.0.md`](../harness/reviews/acceptance_3_0_0_specwave_20260918.md) §6「发现清单」（**P1×1 · P2×4 · P3×8**）+ 附 B「未覆盖面与残余」
> **入库镜像（硬约束 14）**：`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`（与上者**字节一致** · 已 `git add`）
>
> ⚠️ **链接口径**：范围主源的**原件**位于 `.workbuddy/output/`（该目录被 `.gitignore` 忽略、**不入库**），故上方 `href` 指向其**入库镜像**——显示文本保留原件路径以便对照。判据同报告 §7.3「链接可解析 ≠ 目标入库」：`check-doc-links` 的 (ii) 判据要求目标被 git 跟踪，指向未入库原件会**判红**（起草期已实测并据此修正）。
> **格式模板**：[`PLAN_2_4_gate_strength_v1_zh.md`](./PLAN_2_4_gate_strength_v1_zh.md)（结构骨架沿用）

---

## 一句话

3.0.0 验收结论为 **0 P0 / 1 P1 / 4 P2 / 8 P3**——核心三项承诺（门禁真咬 · 旧表零改动 · 对外可达面不变）**全部经对照实验证实**，故**无需 minor**；3.0.1 只收其中的 **patch 级项**：legacy `--file` 表上 `host verify` 的**误报**（P1-1）、闸表 **3 列被静默忽略**的文案/解析契约错配（P2-4）、`pins` 同类 IO 的**退出码分类不一致**（P3-8）、以及若干口径滞后与文档精度（P2-1/P2-3 · P3-3/P3-5/P3-6）与机检覆盖面缺口（P3-2/P3-7）。**不动 host-adapt schema、不改判定语义方向、不拉 3.1 的架构项进场。**

---

## 范围来源校核（14 口径只读复核 · 2026-09-18 逐条钉 `file:line` 现值）

> 范围主源 = 3.0.0 验收报告 §6 十三条发现 + 附 B 残余。下表**已按当日工作树复核代码行号现值**（非沿用报告内行号——报告撰写期与复核期行号已漂移，本次逐条重钉）。

| # | 项 | 级别 | 证据出处（报告 §x · 代码/文件现值） | 3.0.0 状态 | 入 3.0.1 结论 |
|---|----|------|--------------------------------------|-----------|--------------|
| 1 | **P1-1** legacy/自定义表 `--file` 物化后，**默认 `host verify` 误报 exit 2** | **P1** | §6.1 · `src/host/sticky.ts:8-14`（类型无表源字段）· `:97-113`（写入不含表源）· `src/host/cmd.ts:652`（`loadMergedTables(data, fileArg)`）· `:656`（粘性仅供 `toolIds`/`profile`） | 未修 | ✅ **W1（本版核心）** |
| 2 | **P2-4** README「最小骨架」闸表 **3 列**，解析器要求 **4 列** ⇒ 静默忽略<br>**★ 子形态（本规划起草期实测捕获 · 报告未含）**：id 单元格**内嵌**粗体 `**` ⇒ 整行解析失败 | P2 | §6.2/§5.6 · `README.md:98` · `README.zh-CN.md:98`（均 3 列 · 实测 **0 行被解析**）· `assets/harness/templates/TASK_TEMPLATE.md:41`（模板已是 4 列 ✅ · 实测 2 行被解析）· `src/cli-shared.ts:25-26`（`GATE_ROW_RE` · id 组 `([^*\|]+?)` **排除 `*`**）· `:270-286`（`parseHumanGates` 空解析**无告警**） | 未修 | ✅ **W2**（含新子形态） |
| 3 | **P3-8** `readTruthVersion` 无 `try/catch` ⇒ 坏 `package.json` 得**崩溃级 exit 1**（同模块 `loadPins` 为干净 exit 2） | P3 | §6.3 P3-8 · `src/cli-pins.ts:85-91`（`:88` 裸 `JSON.parse(readFileSync(...))`）vs `:62-83`（有 `try/catch`） | 未修 | ✅ **W3** |
| 4 | **P2-1** `MIGRATION.md` §①「行为不变」对**内置路径**措辞欠精确（内置 v2 净增 2 件 hooks 物化） | P2 | §6.2 P2-1 · `MIGRATION.md` §① | 未修 | ✅ W4 |
| 5 | **P2-3** `CHANGELOG.md` `[3.0.0]` Tests 段「841 → 859」**滞后**于实发 864 | P2 | §6.2 P2-3 · `CHANGELOG.md:29` | 未修 | ✅ W4 |
| 6 | **P3-5** `README.zh-CN.md` 被打进包但不在 `files` 白名单 | P3 | §6.3 P3-5 · `package.json:25-36`（列 `README.md`，未列 `README.zh-CN.md`） | 未修 | ✅ W4 |
| 7 | **P3-6** 竞品口径「作者数」仍为单值 `90+`，未区间化 + `as_of` | P3 | §6.3 P3-6 · `delivery/research_report.md` | 未修 | ✅ W4 |
| 8 | **P3-3** `.workbuddy/` 有 **9 件实际 tracked**，与 `check-doc-links` 注释「全忽略」矛盾 | P3 | §6.3 P3-3 · `scripts/check-doc-links.mjs:4/24` · `.gitignore:4` | 未修 | ✅ W4（**仅改注释口径** · 不迁文件） |
| 9 | **P2-2** 物化 hooks 的门禁命令**未钉版本**（离线取包失败 ⇒ fail-closed 阻断） | P2 | §6.2 P2-2 · `src/host/materialize.ts`（hooks 命令生成处） | 未修 | ✅ W5（**只加可选钉版旗标 + 文档** · **不改默认物化内容** · 见风险） |
| 10 | **P3-2** `check-terminology` 六目标闭集外不扫 ⇒ `CHANGELOG.md` 为盲区 | P3 | §6.3 P3-2 · `scripts/check-terminology.mjs` · `assets/harness/terminology.yaml` | 未修 | ✅ W6 |
| 11 | **P3-7** 非内置宿主声明 `config-hook`：`validate` PASS 但 `apply` fail-closed（文档未明示） | P3 | §6.3 P3-7 · `src/host/materialize.ts:506` | 未修 | ✅ W6（`validate` 改 **WARN** + B5/MIGRATION 明写） |
| 12 | **P3-1** `check-claims` 固定子串匹配 ⇒ 同义改写可绕过 | P3 | §6.3 P3-1 · `scripts/check-claims.mjs:54` | 未修 | ⏸ **不进 3.0.1**（设计边界 · 威胁模型=自漂移 · 词表对自漂移已足够 · 若需加强归 3.1） |
| 13 | **P3-4** 库入口 `exports["."]` 硬静态 import 可选 peer ⇒ 无 peer 时库消费者失败 | P3 | §6.3 P3-4 · `lib/index.js:4` | **pre-existing**（2.4.1 同行同 import · 非 3.0.0 回归） | ⏸ **不进 3.0.1**（改动触及模块初始化路径 + 非本版回归 · 归下个 minor 统一评估） |
| 14 | 附 B #25 留证 + 红队 ID↔标签对齐 | 过程项 | 报告附 B.1(b)/(c) | 留证待补 | ⏸ **非产品范围**（验收过程留证 · 见「非范围」表） |

**边界确认**：
- 3.0.0 验收**全部 P0 = 0**，且**唯一 P1 的失败方向是 over-report（误报）而非漏检** ⇒ 本版性质是**收口**，不是补救安全缺口。
- 报告 §6.3 中对红队两项 P2 的**降级裁决**（P3-1/P3-2）**维持**：P3-2 的「`CHANGELOG` 未纳扫描面」子项**升级进 W6**（可修的真实覆盖缺口），P3-1 的「同义改写」子项**判定为设计边界不动**。

---

## 波次总表

| Wave | 主题 | 内容 | 出处 | 级别 |
|------|------|------|------|------|
| **W1** | **粘性表源持久化（本版核心）** | P1-1：`.coding-kit/host-tools.json` 增**可选** `table_source`（`builtin` \| `<relpath>` + `sha256`）；`host verify` 缺省**优先按粘性表源**解析表（与 `apply` 同源）；粘性表源为**非内置**且落点不可用时 **fail-closed 并给出可操作提示**（**不得静默退回内置表**）；`--file` 显式传入**仍然最高优先** | 报告 §6.1 · `src/host/sticky.ts` · `src/host/cmd.ts` | **P1** |
| **W2** | **闸表契约封堵（文档陷阱）** | P2-4：① `README.md:98` / `README.zh-CN.md:98` 最小骨架闸表**补第 4 列 `说明`**（与随包模板 `TASK_TEMPLATE.md:41` 对齐）；② `parseHumanGates` 增**空解析告警**——检测到 `### 人工闸` 节却解析出 **0 行** ⇒ 输出显式提示（"闸表存在但 0 行被识别，请确认是否为 4 列"），**退出码语义不变** | 报告 §6.2/§5.6 · `src/cli-shared.ts:25-26/270-286` | P2 |
| **W3** | **校验 IO 统一 fail-closed** | P3-8：`readTruthVersion` 的解析/读取包 `try/catch` ⇒ 统一为 `exit 2` + `PINS: BLOCKED` 前缀（与同模块 `loadPins` 同形态）；顺带收敛 `:87` `existsSync` 判存与 `:88` 读取之间的 **TOCTOU**；补"坏 `package.json`（截断 / `chmod 000` / 残留冲突标记）⇒ exit 2"三负向回归锁 | 报告 §6.3 P3-8 · `src/cli-pins.ts:85-91` | P3 |
| **W4** | **口径回填与文档精确化** | P2-1 `MIGRATION.md` §① 改为「默认落点不变；内置表升级为 v2 并**新增** hooks 物化（additive）」；P2-3 `CHANGELOG.md:29` Tests 段回填为 **864（863 pass + 1 skip）** 并注明 TTY hotfix 增量；P3-5 `package.json:files` 补列 `README.zh-CN.md`；P3-6 `delivery/research_report.md` 作者数 `90+` → **区间 + `as_of 2026-09`**；P3-3 `scripts/check-doc-links.mjs:4/24` 注释改为「除 9 件显式 tracked 外均忽略」 | 报告 §6.2 P2-1/P2-3 · §6.3 P3-3/P3-5/P3-6 | P2+P3 |
| **W5** | **物化 hooks 钉版能力（可选）** | P2-2：`host apply` **新增可选旗标**（如 `--pin-hook-version`）使物化 hooks 命令写为 `npx spec-wave@<semver> hook-guard …`；**默认物化内容一字不变**；`RELEASING.md` / 使用手册补「CI 须预热 npm 缓存或显式钉版」的可操作建议 | 报告 §6.2 P2-2 | P2 |
| **W6** | **机检覆盖面与校验一致性** | P3-2：把 `CHANGELOG.md` 纳入 `check-terminology`（及 `check-claims` 同口径）判红面；P3-7：`host validate` 对「非内置宿主 + `mechanism: config-hook`」改为 **WARN**（提示 `apply` 将 fail-closed）+ B5/`MIGRATION.md` 明写该边界 | 报告 §6.3 P3-2/P3-7 · `src/host/materialize.ts:506` | P3 |
| **release** | **3.0.1 收尾 bump** | `package.json` 3.0.0→3.0.1 · `pins fix` 对齐（pin-10 待人打 tag）· CHANGELOG 3.0.1 节 · ACCEPTANCE 档 · 使用手册版本钉同步 | 维护者下令（同 2.4.x patch 先例） | — |

**编排理由**：

1. **W1 先行且独立**：唯一 P1、唯一有用户可感后果（阻断级 `exit 2`）的项；改动面**只落在 `sticky.ts` + `cmd.ts` 的表源解析处**，与其余各波零耦合 ⇒ 先做可尽早消除"狼来了的门禁"这一腐蚀性风险。
2. **W2 紧随**：与 W1 同为"用户会照文档/照机制走错"的类；**纯文档 + 告警**，无行为风险；W1 修的是"粘性诱导省略旗标"，W2 修的是"照抄骨架被静默忽略"，二者合起来才真正封住"正确操作却失败"的复合坑。
3. **W3 独立小项**：`cli-pins.ts` 单文件单点，与 W1/W2 无耦合，可在 W1 之后任意时点做；放前是因其同属"**错误分类码不统一**"族（P1-1 是 over-report，P3-8 是 error-class 错位），一并收掉便于 release 时统一讲"3.0.1 修的是信号质量"。
4. **W4 靠中后**：口径回填须引用 **W1–W3 落地后的最终事实面**（否则回填的数字/措辞会二次过期）；且 W4 的 `package.json:files` 与 `MIGRATION` 改动会**触 pins check 的钉面** ⇒ 必须在 pins 相关改动（W3）之后，避免归因混淆。
5. **W5 单列且保守**：P2-2 的"改默认物化命令"会**改变已物化用户的字节** ⇒ 触发 `host verify` 假红，与 W1 正在修的问题**同型**。故本版**只加旗标、不改默认**，把"是否默认钉版"作为 3.1 的独立议题。
6. **W6 收尾**：两项均为低风险、无耦合的覆盖面补齐；W6-② 的 `validate` WARN 与 W1 的"缺省不一致要提示"**同一设计语言**（不一致要可见、不要静默），放最后便于与 W1 的文案口径统一审。
7. **每波一个独立 task、单独提交（`fix(3.0.1-W<n>): …`）**；每波链路：10-task → 20-task-audit（审查文落盘 `docs/harness/reviews/`）→ HG-AUDIT-R1 → 30/40（GATE_VERIFY 首输出 → 实现 → 自证 → `gate-check` → `task close --yes`）。
8. **patch 纪律门**：任一波若发现实现需要**触 schema / 改判定语义松紧 / 新增对外能力面** ⇒ **立即 STOP 上报**，移出本版（归 3.1）。

---

## W1 · 粘性表源持久化（本版核心）

- **范围**：
  1. `src/host/sticky.ts:8-14` 的 `HostToolsSticky` **增可选字段** `table_source`（形态建议 `{ kind: 'builtin' }` 或 `{ kind: 'file', path: <相对仓根>, sha256: <hex> }`）；`:97-113` 的 `writeHostToolsSticky` 在写盘时记录本次 `apply`/`update` **实际使用的表源**。
  2. `src/host/cmd.ts:652` 的 `verify` 表解析改为：**`--file` 显式传入 > 粘性 `table_source` > 内置**（与 `apply` 同源优先级）；`:656` 处粘性不再只供 `toolIds`/`profile`。
  3. **粘性表源为 `file` 且该表不可用/`sha256` 不符** ⇒ **fail-closed `exit 2` 并给出可操作提示**（点名记录的表路径 + 建议"带 `--file` 或重新 `host apply`"）；**严禁静默退回内置表**（静默退回正是 P1-1 的成因）。
  4. 补回归锁：`--file` 旧表 `apply` → **默认 `verify`（不带 `--file`）应 rc=0**；对照锁：把该表改坏/移走 → 默认 `verify` **rc=2 且理由点名表源**。
- **非范围**：**不 bump 粘性 `version`（保持 `1`）**——旧 `3.0.0` 写入的粘性（无 `table_source`）必须继续可读，且 `3.0.1` 写入的粘性必须仍能被 `3.0.0` 读取（未知字段忽略）；不改 `host apply`/`update` 的**落点物化内容**；不改 `verify` 的比对逻辑与 exit code 档位（仅改**取表的来源**）；不动 host-adapt schema（`schema_version` 维持 `2`）。
- **验收要点**：
  - **主回归**：3.0.0 的 P1-1 三步复现（`apply --file <v2.4.1 旧表> --yes` → 默认 `verify` → 带 `--file` 复跑）**第三步不再必要**：第二步即 **rc=0**。
  - **对照**：`builtin` 表路径上 `apply` → 默认 `verify` 行为**与 3.0.0 逐字一致**（零回归 · 用报告 §4.1 的四件套命令复核）。
  - **向后兼容**：手工构造 `3.0.0` 形态粘性（无 `table_source`）⇒ 默认 `verify` 走内置表（与 3.0.0 同行为）+ 可选提示；`3.0.1` 形态粘性交由 `3.0.0` CLI 读取 ⇒ **不报错**（实测一次，落盘留证）。
  - **不静默**：表源不可用场景的输出必须**点名表路径与原因**（不可只给 "missing"）。
- **风险**：① 粘性字段新增若被误实现为**必填** ⇒ 全部存量用户 `verify`/`update` 直接报错（**必须可选 + 缺省回落**，此项为本波最高风险点，须有专门负向 fixture）；② `sha256` 强校验会让"用户合法手改表"变成硬红 ⇒ 定档为**记哈希、默认只比对存在性与路径**，哈希不符**先 WARN**（是否升级为硬红交评审文定夺）；③ 相对路径基准须钉为**仓根**（`--target`），避免跨目录调用时表源错位（沿用报告 §6.3 的"基参不一致"教训）。

## W2 · 闸表契约封堵（文档陷阱）

- **范围**：
  1. **文档**：`README.md:98` 与 `README.zh-CN.md:98` 的「最小骨架」闸表由 3 列补为 **4 列**（`| human_gate_id | status | blocks_hats | 说明 |`），与随包 `assets/harness/templates/TASK_TEMPLATE.md:41` 一致；并在两份 README 该处**加一行提示**："闸表须 **4 列**（末列为 `说明`）；3 列会被静默忽略"。
  2. **实现**：`src/cli-shared.ts:270-286` `parseHumanGates` 增**空解析告警**——`section` 存在但 `gates.length === 0` ⇒ 输出显式提示（建议含出现次数与"请确认是否为 4 列"）；**exit code 语义不变**（`check` 恒 0 / 阻断仍由 `evaluateMayStart30` 决定）。
  3. **★ 新增子形态（本规划起草期实测捕获 · 报告 §6.2 未含）**：`GATE_ROW_RE` 的 id 捕获组为 `([^*|]+?)`，**排除 `*`** ⇒ **`human_gate_id` 单元格中间若含粗体标记 `**`，该闸行整体解析失败**。实测反例：`| HG-W2-REVIEW（**条件闸** · …） | pending | 30 | … |` → **MISSED**；而 `| **HG-NEXT-PLAN** |`（`**` 仅**包裹**整个 id）→ **PARSED**。故本波须：① 在 W2 的空解析告警文案中**并列提示该形态**；② 在 `TASK_TEMPLATE.md` / 两份 README 的骨架处**注明"id 单元格内不要用粗体"**；③ 负向 fixture 覆盖此形态。
  4. 补回归锁：**3 列闸表 + `HG-AUDIT-R1=approved`** ⇒ 告警存在；**4 列同内容** ⇒ 无告警且 `may_start_30=true`；**3 列 + pending** 的既有阻断行为不回退；**4 列但 id 单元格含内嵌 `**`** ⇒ 告警存在（新子形态）。
- **非范围**：**不放宽** `GATE_ROW_RE`（报告 §6.2 P2-4 的"改实现"备选方案**不采纳**——放宽会让既有 3 列存量"看起来生效"，反而掩盖文档漂移）；不改 `evaluateMayStart30` 的判定（报告 §4.6 已证泛化正确）；不改 `extractSection` 的节域口径。
- **验收要点**：A/B 对照复现报告 §5.6 原表（3 列 ⇒ 解析 `[]` + 告警；4 列 ⇒ 正常解析）；两份 README 的骨架**逐字**喂解析器 ⇒ **解析非空**（这是本波的核心断言：**"表写了 ≠ 表被解析"必须入测**）；**id 单元格内嵌 `**`** 形态 ⇒ 告警 + 有测；`TASK_TEMPLATE.md` 骨架**逐字**喂入 ⇒ 解析数 ≥ 1（模板侧不回退）；存量 task（`docs/tasks/` 全量）解析结果**零变化**。
- **自证前置**：本规划自身的闸表**已用真实 `GATE_ROW_RE` 实测通过**（4/4 行解析 · 见「人工闸」节自证块）；首轮曾因 id 内嵌 `**` 得 1 个 MISSED 并当场修正——**该过程即为本波的价值演示**。
- **风险**：告警若打到 stdout 可能污染 `--json` 消费方 ⇒ 告警走 **stderr**（或 `--json` 下入 `warnings` 字段），须与既有 `--json` 信封契约（"只增不改"）一致；告警文案若含中文术语需过 `check-terminology`（注意 `门控` 类变体词）。

## W3 · 校验 IO 统一 fail-closed

- **范围**：
  1. `src/cli-pins.ts:85-91`：把 `:88` 的 `JSON.parse(readFileSync(abs,'utf8'))` 包入 `try/catch` ⇒ `fail('PINS: BLOCKED · 真值源 package.json 不可解析或不可读: ' + e.message, 2)`；与 `:62-83` `loadPins` 的形态/前缀**对齐**。
  2. 收敛 `:87` `existsSync` 与 `:88` 读取之间的 **TOCTOU**（判存失败与读取失败合并为同一 fail-closed 分支）。
  3. 补三负向回归锁：截断 JSON / `chmod 000` / **残留 git 冲突标记** ⇒ 均 **exit 2 且带 `PINS: BLOCKED` 前缀**。
- **非范围**：不改 `pins check` 的判定语义与 PASS 输出；不改 `pins fix` 行为；不改其他命令的 exit code 档位；不引入通用"IO 包装"框架（**单点收口即可**）。
- **验收要点**：报告 §6.3 P3-8 的 **A1/A3/A4 三行实测从 exit 1 转为 exit 2 且前缀统一**；A2（坏 `pins.yaml` → exit 2）**不回退**（对称性成为"两处同形态"）；`pins check` 基线 rc=0 不变。
- **风险**：若把"文件不存在"也并入新分支，会**改变现有缺文件时的退出码**（`:87` 现为 exit 2 并带独立文案）⇒ 必须保留原分支单独文案，仅新增"存在但不可读/不可解析"通道。

## W4 · 口径回填与文档精确化

- **范围**：
  - **P2-1**：`MIGRATION.md` §①「行为不变」改为「**默认落点不变**；内置表升级为 v2 并**新增** hooks 物化（additive）」——消除"内置路径也行为完全不变"的歧义。
  - **P2-3**：`CHANGELOG.md:29` Tests 段由「841 → 859 …」回填为「841 → **864**（863 pass + 1 skip · 打 tag 后全绿）」并注明 **TTY 色彩 hotfix（`0e1f165`）其后 +5**；保留"tag-gated 设计红 ×2"作为过程留痕（改为过去式表述）。
  - **P3-5**：`package.json:25-36` `files` 补列 `README.zh-CN.md`（自证性；不改打包结果——npm 本就默认含 `README*`）。
  - **P3-6**：`delivery/research_report.md` 作者数 `90+` → **区间 + `as_of 2026-09`**（与同批 K-1~K-4 口径统一）。
  - **P3-3**：`scripts/check-doc-links.mjs:4/24` 注释改为「`.workbuddy/` 除 **9 件显式 tracked** 外均忽略」，并列出该 9 件的判据来源（`git ls-files`）；**不迁动文件**。
- **非范围**：不改任何物料的事实性数字（除 P3-6 的区间化）；不翻新 `delivery/` 其他设计文档；不改 `.gitignore`；不动 S2 过程域。
- **验收要点**：`grep -n "859" CHANGELOG.md` 不再命中"现行基线"位；`grep "90+" delivery/research_report.md` 命中为零或已带区间；`node scripts/check-doc-links.mjs` rc=0 且注释与 `git ls-files .workbuddy/ | wc -l`（=9）一致；`npm pack --dry-run` 文件清单**不变**（P3-5 只补自证、不改结果）。
- **风险**：`CHANGELOG`/`MIGRATION` 均受 **pins 钉面** 约束 ⇒ 改措辞后必跑全量 `npm test`（含 pins 相关用例）；`CHANGELOG.md` 改动若与 W6-① 的扫描面开启**同时**落地，可能触发**新纳入的术语判红** ⇒ **W6-① 必须在 W4 之后**（见编排理由与硬约束 9）。

## W5 · 物化 hooks 钉版能力（可选旗标）

- **范围**：为 `host apply` 增**可选旗标**（命名建议 `--pin-hook-version[=SEMVER]`，缺省取当前 `kit_semver`），使物化的 hooks 命令写为 `npx spec-wave@<semver> hook-guard …`；**不带旗标时输出与 3.0.0 逐字节一致**；在 `RELEASING.md` 与《使用手册》§7.3 补"确定性 CI 的可操作建议"（预热 npm 缓存 **或** 显式钉版 **或** `--command` 自带命令）。
- **非范围**：**不改默认物化内容**（此为与 W1 同型的坑：改默认会让已物化用户 `verify` 假红）；不改 `hook-guard` 的分发语义；不引入"锁文件"或 vendor 依赖包。
- **验收要点**：带旗标 / 不带旗标的 `host apply` 各跑一次，`diff` 断言"不带旗标 = 3.0.0 输出"、"带旗标 = 命令含 `@<semver>`"；带旗标物化后 `host verify` **rc=0**（钉版不破坏自校验）；离线环境下带旗标版本仍 fail-closed exit 2（语义不变，仅提示更明确）。
- **风险**：旗标语义若被理解为"默认开启"会造成物化字节漂移 ⇒ 帮助文案与 CHANGELOG 须显式写"**实验性 · 缺省关闭**"；下个版本再评估是否转默认（连同"已物化用户的迁移提示"一起设计）。

## W6 · 机检覆盖面与校验一致性

- **范围**：
  - **P3-2**：把 `CHANGELOG.md` 纳入 `scripts/check-terminology.mjs` 的目标集（`assets/harness/terminology.yaml`），并按同口径评估 `check-claims` 是否一并纳入；补"向 `CHANGELOG.md` 注入变体词「门控」⇒ exit 2"负向 fixture。
  - **P3-7**：`host validate` 对「**非内置宿主 + `mechanism: config-hook`**」由 PASS 改为 **WARN**（文案提示"该宿主不在 config-hook 落点映射表内，`apply` 将 fail-closed；如需仅 L1+L2 请用 `mechanism: none`"）；在 B5 接入面文档与 `MIGRATION.md` **明写**该边界。
- **非范围**：不改 `apply` 的 fail-closed 行为（报告 §6.3 P3-7 判定**行为正确**，仅"两关判据不一致 + 文档未明示"是缺口）；不扩 `config-hook` 落点映射表（那是 3.1 的宿主扩展议题）；不把 `check-claims` 全量重写为语义匹配（同义改写绕过维持 P3-1 的"设计边界"裁决）。
- **验收要点**：`CHANGELOG.md` 基线 rc=0、注入变体词 rc=2、边界词（`后门控制` / `门控 skip`）**不误报**；`validate --file <acme-hook.yaml>` 由"静默 PASS"变为"PASS + 显式 WARN"，且 `apply` 仍 rc=2（行为不变、可见性补齐）；`terminology.yaml` 扩充后**存量六目标零回归**。
- **风险**：把 `CHANGELOG.md` 纳入后，**历史版本节**（1.x/2.x）内的旧表述可能触发判红 ⇒ 需评审定"是否只扫现行版本节 / 是否对历史节加白"；此为本波最可能需要评审先行的点（若涉及扫描面口径变更，循 W2-评审先例）。

---

## 非范围（明确不做 · 属 3.1+ 或冻结）

| 项 | 归属 | 说明 |
|----|------|------|
| P3-1 `check-claims` 同义改写绕过加固 | 3.1（如需要） | 3.0.0 验收已**降级裁决**为设计边界（威胁模型 = 维护者自漂移 · 词表匹配按设计即够）；加固属"强度增强"，非 patch 范畴 |
| P3-4 库入口硬 import 可选 peer 改惰性 | 下个 minor | 触及模块初始化路径；且**非 3.0.0 回归**（2.4.1 同型同行为）⇒ 随"库消费者 API 面"一并评估 |
| P2-2 物化 hooks **默认**钉版 | 3.1 | 本版只加旗标；转默认需先设计"已物化用户迁移提示"（否则重演 P1-1 同型假红） |
| `config-hook` 落点映射表扩展至更多宿主 | 3.1+ | 与"13 宿主 L3 全覆盖"战略议题同批 |
| host-adapt `schema_version` 3 / 任何 schema 变更 | 下个 major | **触 schema 即 STOP**（本版硬约束 3） |
| 自研 IDE · 第二分发通道 · 远程 Policy 引擎 | **冻结** | 沿用既有决议 |
| npm provenance / OIDC 启用 | **仅人** | 账号配置仅人；文档口径已随 3.0.0 对齐 |
| 报告附 B 的 #25 留证 + 红队 ID↔标签对齐 | **过程留证**（非产品范围） | 属 3.0.0 验收的**证据完备性**事项，不构成产品缺口；建议**随本版任一波的 task 顺带补留证**（不单开波） |
| `npm publish` / `tag` / `push` / `deprecate` | **仅人** | Agent 禁止 |

---

## 硬约束（沿用 2.4 PLAN §硬约束 + 本版新增）

1. **S2 过程域永不覆写**：`docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`（只新增不覆写）。
2. **P0 门禁不可绕过**：禁止任何 `--force` / `--allow-*` 新绕过参数（verify / gate-check / audit / pins / assets verify）。
3. **★ patch 纪律门（本版新增）**：凡实现需要「**触 schema** / **改判定语义松紧方向** / **新增对外能力面**」⇒ **立即 STOP 上报**，移出 3.0.1。本版**只收**误报、静默、分类码、口径、覆盖面五类。
4. **★ 粘性格式向后兼容（本版新增 · W1 关键）**：`.coding-kit/host-tools.json` 的 `version` **保持 `1`**；新增字段**必须可选**；`3.0.1` 写入的粘性**必须仍可被 `3.0.0` 读取**（未知字段忽略）；反之 `3.0.0` 写入的粘性**必须仍可被 `3.0.1` 读取**（缺省回落内置表）。★ **实测双向兼容并留证**。
5. **★ "不要静默"总则（本版新增）**：本版所有改动的共同主题是**把静默变成可见**——缺省不一致要提示（W1）、空解析要告警（W2）、IO 失败要统一前缀（W3）、两关判据不一致要 WARN（W6-②）。**任何"退回缺省 / 忽略输入 / 解析为空"的路径都必须留下可见痕迹**。
6. **不动 host-adapt schema**：`schema_version` 维持 `2`；schema 变更即 STOP 上报。
7. **修严/改行为型变更必须配回归锁**：凡"修复前真红、修复后转绿"的构造（W1 主回归与对照 · W2 A/B · W3 三负向 · W6 注入）一律固化进测试套件。
8. **每波提交前 `npm run typecheck` + `npm test` 必过**；每波单独提交 `fix(3.0.1-W<n>): …` · **禁 `git add -A`**。
9. **★ 波次顺序约束（本版新增）**：**W6-①（`CHANGELOG.md` 纳入术语扫描面）必须在 W4（`CHANGELOG` 口径回填）之后** —— 否则 W4 修改 `CHANGELOG` 时会先被新纳入的扫描面判红，造成归因混乱。
10. **RELEASING.md 双重敏感**（pin-07 落点 + 九步顺序测）：改措辞后必跑全量 `npm test`。
11. **对外文案受事实卡黑名单约束**：未落地能力一律「将新增 / 规划中」口径。
12. Agent **禁止** `npm publish` / `npm deprecate` / `tag` / `push`（仅人）。

---

## 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| **HG-NEXT-PLAN** | **approved**（2026-09-18 · 维护者本窗签收，原话「身为00，统筹3.0.1的升级，授权签收过程文档」） | 30 | 开 W1 task 起草（签收限制已解除） |
| HG-AUDIT-R1（每波 ×6） | pending → 逐波由 00 代签（维护者 2026-09-18 书面授权 · 每波仍须 20 审查文落盘后方可签） | 30 | 各波 30 改码前（task 阶段逐波走 10-task → 20-task-audit → 00 代签） |
| HG-W2-REVIEW（条件闸 · 仅 W2 涉及扫描面/告警契约变更时启用） | pending → 条件触发时由 00 代签（须评审文先落盘） | 30 | W2 若被判定为"契约变更"⇒ 先出评审文（落盘 `docs/harness/reviews/`）再改码 |
| HG-RELEASE（3.0.1 发版） | pending（**不在授权范围** · tag/push/publish 仍仅人） | — | publish / tag / push（**仅人**） |

> ⚠️ 本表为 **4 列**（末列 `说明`）。3 列会被 `GATE_ROW_RE`（`src/cli-shared.ts:25-26`）**静默忽略**——这正是本版 W2 要封堵的陷阱；本规划自身即按正确形态书写（自证）。
>
> **自证已实测（2026-09-18 · 用真实 `GATE_ROW_RE` 逐行喂入）**：
> ```
> PARSED   3 gate-row(s) <- 本规划人工闸          (want HG-NEXT-PLAN)
> PARSED   2 gate-row(s) <- TASK_TEMPLATE.md     (want HG-AUDIT-R1)
> MISSED   0 gate-row(s) <- README.md 最小骨架     (want HG-AUDIT-R1)   ← P2-4 活证
> MISSED   0 gate-row(s) <- README.zh-CN.md 最小骨架 (want HG-AUDIT-R1) ← P2-4 活证
> ```
> 首轮该探针**在本规划上即命中一个 MISSED**（`HG-W2-REVIEW（**条件闸** …）`——id 单元格内嵌粗体）⇒ 已修正，并作为**新子形态**并入 W2 范围（见 W2·范围 3）。**"规划自身也要过自己写的解析器"** —— 此为"文档样例入测"纪律的现场应用。

---

## 发布边界

- 全部 W 波与 release 波的 **tag / push / npm publish / npm deprecate 仅人**（或按维护者当次书面授权），Agent 禁止。
- 3.0.1 bump 后 pin-10 待人打 `v3.0.1` tag 复跑转绿（设计红 · 口径同 2.4.x patch 先例）。
- **本版无需 `MIGRATION.md` 强制迁移节**：3.0.1 为 patch，且核心改动（粘性表源）**向后兼容**；仅在 `MIGRATION.md` 补一段"3.0.0 → 3.0.1 无动作项"的说明（含 P2-1 的措辞修正）。

---

## 风险与依赖

| # | 风险 | 影响 | 对策 |
|---|------|------|------|
| 1 | W1 粘性新字段被实现为必填 | **存量用户全量报错**（远重于 P1-1 本身） | 硬约束 4 + 专门负向 fixture（旧形态粘性 ⇒ 正常走内置表） |
| 2 | W1 哈希强校验 → 用户合法改表变硬红 | 新造一类误报（与 P1-1 同型） | 默认只比存在性/路径；哈希不符先 WARN；升级为硬红须评审 |
| 3 | W2 告警污染 `--json` 消费方 | 破坏下游解析 | 走 stderr 或 `--json#warnings`；信封"只增不改" |
| 4 | W6-① 纳入 `CHANGELOG` 后历史版本节判红 | 大面积误报 | 评审定"是否只扫现行版本节"；先出评审文（HG-W2-REVIEW 同源） |
| 5 | W5 旗标被误当默认开启 | 物化字节漂移 → verify 假红 | 帮助/CHANGELOG 显式标"实验性 · 缺省关闭" |
| 6 | W4 改 `CHANGELOG`/`MIGRATION` 触 pins 钉面 | pins check 报红 | 随改随跑全量 `npm test`；先做 W3 再做 W4（硬约束 9） |
| 7 | 报告行号与工作树漂移（**已发生**：报告写 `cmd.ts:62/656`，现值 `:652/656`） | 引用失效 | 本规划已**逐条重钉行号现值**；各 W 波 task 起草时**再钉一次** |
| 8 | 过程留证（#25 · ID↔标签对齐）被遗忘 | 验收证据链不完整（不影响产品） | 挂在本版任一波 task 内顺带补，不单开波 |

**依赖**：
- 维护者**签收 HG-NEXT-PLAN** 后方可开 W1。
- 各波 20-task-audit 审查文落盘 `docs/harness/reviews/` 后方可 30 改码。
- 发布依赖维护者打 tag（pin-10 设计红转绿）。

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-18 | draft · 范围主源 = 3.0.0 验收报告 §6（P1×1 / P2×4 / P3×8）+ 附 B；14 口径逐条校核并**重钉 `file:line` 现值**；波次 W1–W6 + release；硬约束沿用 2.4 PLAN 并新增 4 条（patch 纪律门 · 粘性向后兼容 · "不要静默"总则 · 波次顺序约束） |
| 2026-09-18 | **起草期自证捕获 P2-4 新子形态**：以真实 `GATE_ROW_RE` 逐行喂入本规划与 README/模板（探针落盘 `/tmp`），得 `本规划 4/4 PARSED` · `README.md 0 行` · `README.zh-CN.md 0 行`（P2-4 活证）· `TASK_TEMPLATE.md 2 行`；**首轮本规划自身 1 个 MISSED**（`HG-W2-REVIEW（**条件闸** …）` —— id 单元格**内嵌**粗体使整行失效）⇒ 已修正，并将该子形态并入 W2 范围/验收要点；同步在「人工闸」节落自证块 |
| 2026-09-18 | **HG-NEXT-PLAN approved**：维护者本窗签收本规划并授权 00 代签本版后续全部过程文档闸（HG-TASK-DRAFT / HG-AUDIT-R1 / HG-W2-REVIEW / CLOSE）；HG-RELEASE 不在授权范围，tag/push/publish 仍仅人 |

---

**已签收 · HG-NEXT-PLAN=approved**（2026-09-18 · 维护者授权 00 代签过程闸 · 各 W 波仍须 20 审查文落盘后由 00 逐波签 HG-AUDIT-R1 方可 30 改码）
