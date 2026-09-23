# 规划 · 3.0.2 · 消费侧反馈收口（patch）

> **状态**：`approved` · **HG-NEXT-PLAN=approved**（2026-09-23 维护者本窗签收，原文：「授权00签收所有过程文档，进行此版本的升级，验收完成后进行tag + push，只需要等人来发版」· 授权 00 代签本版后续全部过程文档闸（与 2.4.0/3.0.0/3.0.1 同模式）· **本版授权面扩大**：tag + push 在授权范围（验收完成后由 00 代跑）· **npm publish / deprecate 仍仅人**）
> **目标发版**：`spec-wave@3.0.2`（**patch** · 收 ops-desk-api 消费侧 3.0.1 反馈：**F-1① 词汇登记档噪音内置登记** + **F-3/F-4 pins consumer 模式（additive）**。**不触 schema · 不改既有命令默认行为与判定语义 · F-2 / F-1② 延 3.1.0**）
> **基线**：`spec-wave@3.0.1` published（npm `latest` = 3.0.1 · tag `v3.0.1` 已存在 · 发布回填缺 → 本版 release 波顺带回填 CHANGELOG 3.0.1 发布状态）
> **范围主源**：ops-desk-api 反馈文 `FEEDBACK_spec_wave_3_0_1_from_ops_desk_api_20260923.md`（消费仓 `docs/harness/evidence/` · 仓外档不入库 · 关键内容已逐条校核进本规划「范围来源校核」表）
> **格式模板**：[`PLAN_3_0_1_patch_v1_zh.md`](./PLAN_3_0_1_patch_v1_zh.md)（结构骨架沿用）

---

## 一句话

3.0.1 消费侧实测反馈四条：F-1 词汇登记档对 `branches`/`triggers` 两类普适边型逐条告警（37+16 处永不可行动噪音 · 告警疲劳）；F-3 消费侧钉版散落四面无机械保鲜闸（`pins check` 面向发布仓自身 · 消费仓无 `assets/release-pins.yaml` 即 exit 2 不可用）；F-4 其前置隐患（真值源硬读 `package.json#version` · 消费仓 `private:true` 无 version 会被误 BLOCK）；F-2 图谱漂移缺机械闸（新命令面 · 延 3.1.0）。3.0.2 收 **F-1①（纯数据）+ F-3/F-4（additive 能力面）**，让消费仓升级从「四面手工对齐」变为「一条 CI 机械闸」。

---

## 范围来源校核（反馈四条逐条钉 `file:line` 现值 · 2026-09-23 00 实读复核）

| # | 反馈 | 级别 | 证据出处（反馈 §x · 代码现值） | 入 3.0.2 结论 |
|---|------|------|--------------------------------|--------------|
| 1 | **F-1** `graph yaml check` 对 `branches`/`triggers` 逐条告警「未在词汇登记档」 | 高频噪音 | 反馈 F-1 · `assets/tech-graph-vocab.yaml:20-24`（edge_types 仅 4 条）· `src/cli-graph-yaml.ts:90-102`（`collectTechVocabWarnings` 唯一消费点）· `:276/:374/:517/:650`（渲染路径 `edgeToGraphV2` **不读**登记档 ⇒ 补登记零渲染漂移） | ✅ **W1**（选 ① 内置登记 · 纯数据） |
| 2 | **F-2** 图谱漂移缺机械闸（`graph drift` 类命令） | 中频 | 反馈 F-2 · `src/cli-graph.ts:46-62`（子命令仅 yaml/ingest/snapshot/axioms/ontology · 无 drift） | ⏸ **延 3.1.0**（新命令面 + 锚点提取栈无关性设计 · 见非范围） |
| 3 | **F-3** 消费侧钉版四面手工对齐（package exact / CI 字面 ×3 / 测试 mock ×16 / env 文档面）· `pins check` 消费仓不可用 | 每次升级 | 反馈 F-3 · `src/cli-pins.ts:62-83`（`loadPins` 缺 `assets/release-pins.yaml` 即 failClosed exit 2 · 面向发布仓自身） | ✅ **W2**（`--consumer` 模式 · additive） |
| 4 | **F-4** `readTruthVersion` 硬读 `package.json#version` · 消费仓 `private:true` 无 version 即误 BLOCK | F-3 前置 | 反馈 F-4 · `src/cli-pins.ts:85-106`（`:104` 缺 version 即 fail） | ✅ **W2**（与 F-3 同波 · consumer 真值源回退链 + `--truth`） |

**边界确认**：
- 反馈「无阻塞摩擦」确认 3.0.1 patch 升级路径零破坏；本版性质同为**收口 + 消费侧体验**，不是补救安全缺口。
- F-1 方案①（内置登记）与②（仓级扩展档）二选一：**① 进 3.0.2**（纯数据 · 即时清零噪音）；**② 延 3.1.0**（与 F-2 同波统一设计 `.spec-wave/` 消费仓配置目录约定）。

---

## 波次总表

| Wave | 主题 | 内容 | 出处 | 级别 |
|------|------|------|------|------|
| **W1** | **tech-graph 词汇登记档补登记（F-1①）** | `assets/tech-graph-vocab.yaml` edge_types 增 `branches` / `triggers`（LangGraph 系普适类型 · 注明来源）；回归锁：已登记 type 零 warning · 未登记仍 warning；恒等 fixture 同步 | 反馈 F-1 · `assets/tech-graph-vocab.yaml` | 纯数据 |
| **W2** | **pins consumer 模式（F-3 + F-4）** | `pins check/fix --consumer`：真值源回退链 `devDependencies["spec-wave"]` → `dependencies["spec-wave"]` → `version` + `--truth <path#jsonpath>` 显式指定；可选声明源 `.spec-wave/pins-consumer.yaml`（缺省 = 内置默认钉面：`.github/workflows/*.{yml,yaml}` 全部 `<pkg>@X.Y.Z` 字面 · 逐文件合成具体 pin 复用既有求值/修复机）；`--yes` 才写盘 · S2 拒写沿用 | 反馈 F-3/F-4 · `src/cli-pins.ts` | additive 能力面 |
| **release** | **3.0.2 收尾 bump + 授权内 tag/push** | `package.json` 3.0.1→3.0.2 · `pins fix --yes` 全链对齐 · CHANGELOG 3.0.2 节 + **3.0.1 发布状态回填** · `docs/spec/README.md` 索引行（pin-08 人工）· ACCEPTANCE 档 · MIGRATION 无动作项注 · **tag `v3.0.2` + push（本版授权）** · publish 仅人 | 维护者 2026-09-23 授权 | — |

**编排理由**：

1. **W1 先行**：纯数据零代码，独立提交，即时兑现消费仓最大噪音源的清零；其回归锁也为 W2 提供了「测试怎么写」的最小样板。
2. **W2 主体**：F-4 是 F-3 的前置（consumer 模式缺真值源回退即误 BLOCK），二者同波同测避免「半特性」；全部改动收敛在 `src/cli-pins.ts` + 新增测试档 + usage 文案，与 W1 零耦合。
3. **release 收尾**：复用 3.0.1 release 波先例；本版 tag/push 在授权面内（00 代跑），npm publish 仍仅人。
4. **每波一个独立 task、单独提交**（`feat(3.0.2-W<n>): …` / `docs(3.0.2-release): …`）；每波链路：10-task → 20-task-audit（审查文落盘 `docs/harness/reviews/`）→ 00 代签 HG-AUDIT-R1 → 30/40（GATE_VERIFY 首输出 → 实现 → 自证 → `gate-check` → `task close --yes`）。
5. **patch 纪律门（本版口径 · 见硬约束 3）**：additive 能力面**允许**（维护者 2026-09-23 签收本范围）；**触 schema / 改既有默认行为 / 改判定语义松紧 ⇒ 立即 STOP 上报**。

---

## W1 · tech-graph 词汇登记档补登记（F-1①）

- **范围**：
  1. `assets/tech-graph-vocab.yaml` `edge_types` 增 `branches` / `triggers` 两条 + 注释（来源：ops-desk-api 反馈 F-1 · LangGraph 系图谱普适类型 · 登记 ≠ 封闭原则不变）。
  2. 回归锁：fixture flow yaml 显式 `type: branches` / `type: triggers` ⇒ `graph yaml check` **零** 词汇告警；未登记 type（如 `zzz_custom`）⇒ 仍 warning 不咬 exit（开放惯例不回退）。
  3. 若测试侧存在该档的**恒等 fixture / 逐字等价钉**（`src/cli-graph-yaml.ts:43-47` 注释提及单源 grep 断言锚），同步更新并注明版本。
- **非范围**：不改 `loadTechGraphVocab` / `collectTechVocabWarnings` 代码；不改 kinds / kind→class 映射；不做仓级词汇扩展档（F-1② 延 3.1.0）；不改渲染（`edgeToGraphV2` 不读登记档 · 已核实零漂移）。
- **验收要点**：消费侧 6 个 flow yaml 共用 `branches` 37 处 / `triggers` 16 处形态 ⇒ 构造等价 fixture 后 `graph yaml check` stderr 词汇告警 **0 行**；未登记 type 告警行数与 3.0.1 一致；`graph ontology check` / `graph axioms check` 行为零变化；四门全绿。
- **风险**：恒等 fixture 若逐字钉死登记档全文 ⇒ 加两条即红，须在同一提交内同步（此为设计内红 · 非回归）。

## W2 · pins consumer 模式（F-3 + F-4）

- **范围**：
  1. **CLI**：`pins check --consumer [--target PATH] [--json] [--truth <path#jsonpath>]` / `pins fix --consumer [--target PATH] [--yes] [--truth <path#jsonpath>]`；release 模式（无 `--consumer`）行为**逐字不变**。
  2. **真值源（F-4）**：consumer 模式回退链 `devDependencies["spec-wave"]` → `dependencies["spec-wave"]` → `package.json#version`，首个存在者胜；三处皆缺 ⇒ exit 2 + `PINS: BLOCKED` 点名链条。包名可经声明源 `package_name` 覆盖（缺省 `spec-wave`）。`--truth <path#jsonpath>` 显式指定时跳过回退链（jsonpath 为点分隔键 · 如 `devDependencies.spec-wave`）；指定源缺失/非串 ⇒ exit 2。
  3. **取值口径**：truth 须为精确 `X.Y.Z`；`^X.Y.Z` / `~X.Y.Z` 剥前缀归一 + **stderr WARN**（推荐 exact · 「不要静默」总则）；其他形态（`*` / `latest` / `workspace:*` / 范围表达式）⇒ exit 2 + 可操作提示。WARN 在 `--json` 下入 `warnings` 数组（信封只增不改）。
  4. **声明源**：消费仓可选 `.spec-wave/pins-consumer.yaml`（`version: "1"` · `package_name` 可选 · `pins` 复用既有 Pin schema · `expected.kind: package-version` 语义 = consumer truth）；**缺省**（声明源不存在）⇒ 内置默认钉面：枚举 `.github/workflows/*.{yml,yaml}` 逐文件合成 `regex-all '<pkg>@(\d+\.\d+\.\d+)'` 具体 pin（`fixable: true` · 包名前缀精确匹配防误伤他包）；目录不存在 ⇒ 0 落点 + 显式提示行（不静默 PASS 假象）。声明源存在但语法坏/行缺字段 ⇒ exit 2 failClosed（与 `loadPins` 同形态）。
  5. **复用而非改写**：具体 pin 求值走既有 `evaluatePin`、修复走既有 `planFix` / S2 拒写 / 备份避让三级机制；`pins fix --consumer` 默认 dry-run，`--yes` 才写盘。
  6. **输出**：人类输出首行点名模式与真值来源（如 `pins check [consumer] · 真值源 package.json#devDependencies.spec-wave = 3.0.1`）；`--json` 信封增 `mode: "consumer"` / `truth_source`（只增不改）。
  7. **usage 文案**：`PINS_USAGE` + `src/cli/usage.ts` pins 节补 consumer 两行；README 补一节（示例一律用 `@<x.y.z>` 占位形态防 pin-05/06 钉面漂移）；`MIGRATION.md` 补「3.0.1 → 3.0.2 无动作项 · consumer pins 可选启用」。
  8. **测试**（红测先行）：真值回退链四态 / `--truth` 三态 / ^~ 归一 + WARN / 非精确拒 / 默认 CI 扫描漂移 exit 2 → fix --yes 写盘 → 复跑 PASS / workflows 目录缺失提示 / 声明源自定义钉面（模拟 ops-desk 测试 mock 字面场景）/ release 模式基线零回归。
- **非范围**：不改 release 模式任何行为与输出；不做 `pins fix` 对声明源文件本身的生成/改写；不扫描 `package-lock.json` / `pnpm-lock.yaml`（锁档版本解析归 3.1 评估）；不做 F-1② 仓级词汇扩展档（虽同为 `.spec-wave/` 目录 · 不在本波接线）；不支持多包钉（单包名 · 多包归 3.1）；不新建「消费仓初始化向导」。
- **验收要点**：A1 回退链四态逐个断言；A2 `--truth` 显式指定跳过回退链；A3 `^`/`~` 归一 WARN 可见 · 非精确 exit 2；A4 ops-desk 四面场景仿真（package exact + CI 3 处字面 + 测试 mock 清单经声明源）漂移 exit 2 · fix --yes 后全绿；A5 声明源缺失走内置默认 · workflows 缺失显式提示；A6 release 模式 17 pin 基线零回归；A7 四门全绿。
- **风险**：① 默认钉面零落点时「静默 PASS」假象 ⇒ 显式提示行钉死；② `<pkg>@` 正则在 workflow 中误伤 `npx spec-wave@<占位>` 类文档注释 ⇒ 占位形态无数字不匹配 · 正则自带 \d 锚；③ 声明源路径越界 ⇒ 复用 `resolvePinPath`（禁绝对路径与 `../`）；④ consumer 模式被误用于发布仓自身 ⇒ usage 文案注明分工（release 模式 = 发布仓 · consumer 模式 = 消费仓）。

## release · 3.0.2 收尾 bump + 授权内 tag/push

- **范围**：`package.json` → 3.0.2；`pins fix --yes` 对齐全链（ontology product_semver / discipline-coverage / README ×2 / RELEASING 现行行 / host-adapt README）；`docs/spec/README.md` 人工补 3.0.2 索引行（pin-08 语义格位口径 · 发布态措辞同格）；CHANGELOG `[3.0.2]` 节 + **`[3.0.1]` 发布状态回填**（tag `v3.0.1` 已存在 · registry 事实以 `npm view` 实测为准）；`MIGRATION.md` 无动作项注；ACCEPTANCE 档（`docs/roadmap/ACCEPTANCE_3_0_2_patch_3_0_2_zh.md`）。
- **tag/push（本版授权）**：波次提交先落 `task/specwave-3-0-2` 分支 → 验收全绿 → `main` 快进合并 → `git tag v3.0.2` → `pins check` 复跑 17/17 转绿（pin-10 设计红清偿）→ `git push origin main v3.0.2`。
- **非范围**：`npm publish` / `npm deprecate` **仅人**（不在授权面）；不动 `eval/specwave-external-benchmark` 分支搭车档（TraceArtifact 伞类 wip 已独立保全 · 未经 20 审不入本版）。

---

## 非范围（明确不做 · 属 3.1.0+ 或冻结）

| 项 | 归属 | 说明 |
|----|------|------|
| F-2 `graph drift` 图谱漂移机械闸 | **3.1.0** | 新命令面 + 锚点提取栈无关性设计（模块目录/路由前缀/表名/SSE 事件）；MVP「一级包目录必须出现在 modules 表」也需基线与白名单设计；与 F-1② 同波统一 `.spec-wave/` 配置目录约定 |
| F-1② 仓级词汇扩展档（`.spec-wave/graph-vocab.yaml`） | **3.1.0** | 新加载面 + 合并语义 fail-loud 定案；W1 已用①清零当下噪音 |
| 锁档（package-lock/pnpm-lock）版本钉 | 3.1 评估 | 锁档解析是独立设计题 |
| 多包 consumer 钉 / consumer 声明源生成器 | 3.1 评估 | 本版单包名 + 手写声明源即可覆盖反馈场景 |
| `harness.verify` capability 透传 `warnings` 数组 | 消费仓自建 | 反馈文末「本仓后续动作」已自领 · 非上游范围 |
| host-adapt `schema_version` / 任何 schema 变更 | 下个 major | 触 schema 即 STOP |
| `npm publish` / `npm deprecate` | **仅人** | 不在本版授权面 |

---

## 硬约束（沿用 3.0.1 PLAN §硬约束 + 本版口径调整）

1. **S2 过程域永不覆写**：`docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`（只新增不覆写）。
2. **P0 门禁不可绕过**：禁止任何 `--force` / `--allow-*` 新绕过参数。
3. **★ patch 纪律门（本版口径 · 维护者 2026-09-23 签收）**：**additive 能力面允许**（`--consumer` 新旗标 + `.spec-wave/pins-consumer.yaml` 新可选档 · 无旗标时全部既有行为逐字不变）；凡实现需要「**触 schema** / **改既有命令默认行为** / **改判定语义松紧方向**」⇒ **立即 STOP 上报**移出 3.0.2。
4. **「不要静默」总则**：truth 归一要 WARN、零落点要提示、声明源坏要 failClosed、真值源链条要在输出点名——任何「退回缺省 / 解析为空」路径必须留可见痕迹。
5. **修严/改行为型变更必须配回归锁**：W1 已登记/未登记双态锁 · W2 全 A 系红测先行 · 固化进测试套件。
6. **每波提交前 `npm run typecheck` + `npm test` 必过**；每波单独提交 · **禁 `git add -A`**。
7. **RELEASING.md 双重敏感**（pin-07 落点 + 九步顺序测）：改措辞后必跑全量 `npm test`。
8. **对外文案受事实卡黑名单约束**：consumer pins 已落地才写「已支持」；F-2 / F-1② 一律「规划中（3.1.0）」口径。
9. **README 版本字面自律**：consumer 文档示例一律 `@<x.y.z>` 占位（pin-05/06 regex-all 钉面 · 真实版本字面会被钉死）。
10. **tag/push 仅按本版授权口径代跑**（验收全绿后 · main 快进 + `v3.0.2`）；`npm publish` / `deprecate` Agent 禁止。

---

## 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved（2026-09-23 · 维护者本窗签收，原话「授权00签收所有过程文档，进行此版本的升级，验收完成后进行tag + push，只需要等人来发版」） | 30 | 开 W1 task 起草（签收限制已解除） |
| HG-TASK-DRAFT | pending → 逐波由 00 代签（每波 ×3 · 维护者 2026-09-23 书面授权 · task lint PASS 后方可签） | 20, 30 | 各波 20 审查前 |
| HG-AUDIT-R1 | pending → 逐波由 00 代签（每波 ×3 · 同授权 · 每波仍须 20 审查文落盘后方可签） | 30 | 各波 30 改码前 |
| HG-RELEASE-TAG-PUSH（3.0.2） | approved（2026-09-23 · 维护者本窗授权「验收完成后进行tag + push」· 限 main 快进 + `v3.0.2` · 验收全绿为前置） | — | tag + push 代跑（本版授权扩大面） |
| HG-RELEASE-PUBLISH（3.0.2） | pending（**不在授权范围** · npm publish / deprecate 仍仅人） | — | publish 仅人 |

> ⚠️ 本表为 **4 列**（末列 `说明`）——3 列会被 `GATE_ROW_RE`（`src/cli-shared.ts:25-26`）静默忽略（3.0.1 W2 已封堵的陷阱 · 本规划按正确形态书写自证）。
>
> **自证已实测（2026-09-23 · 用真实 `GATE_ROW_RE` 逐行喂入 · 探针口径同 3.0.1 PLAN 先例）**：本表 5/5 行 PARSED（HG-NEXT-PLAN / HG-TASK-DRAFT / HG-AUDIT-R1 / HG-RELEASE-TAG-PUSH / HG-RELEASE-PUBLISH · 0 MISSED）。注：`parseHumanGates` 以 `### 人工闸`（三级标题）为节域锚（`src/cli-shared.ts:280`），PLAN 用 `## 人工闸` 属规划文体例（同 3.0.1 PLAN）· 闸真值以各 task 档（三级标题 + 4 列）为准。

---

## 发布边界

- **tag / push**：本版授权 00 代跑（验收全绿后 · `main` 快进 + `v3.0.2` · HG-RELEASE-TAG-PUSH=approved）。
- **npm publish / deprecate**：仅人（HG-RELEASE-PUBLISH 不在授权面 · 人 publish 后回填 CHANGELOG 发布状态口径同 3.0.0 先例）。
- **本版无需 `MIGRATION.md` 强制迁移节**：3.0.2 为 patch 且 additive；仅补「3.0.1 → 3.0.2 无动作项」说明 + consumer pins 可选启用指引。

---

## 风险与依赖

| # | 风险 | 影响 | 对策 |
|---|------|------|------|
| 1 | W1 恒等 fixture 逐字钉登记档全文 | 加两条即红被误判回归 | 同提交同步 fixture + 注明（设计内红） |
| 2 | W2 零落点静默 PASS 假象 | 消费仓误以为有闸实际无 | 硬约束 4 · 显式提示行 + 测试钉 |
| 3 | W2 声明源 schema 与 release-pins 漂移成双真值 | 长期维护分叉 | 复用同一 Pin 类型与 `loadPins` 校验形态 · 注释互指 |
| 4 | consumer 模式误用于发布仓自身 | 真值源语义错位 | usage 分工注明 · 输出点名模式 |
| 5 | release 波 3.0.1 回填事实错误（registry 状态记忆失真） | CHANGELOG 失实 | 以 `npm view spec-wave` 实测为准 · 禁凭记忆 |
| 6 | tag/push 代跑时机错误（验收未绿即推） | 发布事故 | HG-RELEASE-TAG-PUSH 前置 = 验收全绿 + pin-10 转绿后推送 |
| 7 | `eval/` 分支 wip 档混入本版 | 范围污染 | 已独立 commit 保全于 eval 分支 · 本版分支自 main 切出 |

**依赖**：
- 各波 20-task-audit 审查文落盘 `docs/harness/reviews/` 后方可 00 代签 HG-AUDIT-R1 → 30 改码。
- tag/push 代跑依赖验收全绿（含 pin-10 设计红清偿路径）。

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-23 | draft · 范围主源 = ops-desk-api 反馈文 F-1~F-4（仓外 `docs/harness/evidence/` · 逐条校核并钉 `file:line` 现值）；波次 W1/W2/release；硬约束沿用 3.0.1 并按本版授权口径调整（additive 能力面允许 · tag/push 入授权面 · publish 仍仅人） |
| 2026-09-23 | **HG-NEXT-PLAN approved**：维护者本窗签收（原话见闸表）· 授权 00 代签本版后续全部过程文档闸 + 验收后 tag/push 代跑 |

---

**已签收 · HG-NEXT-PLAN=approved**（2026-09-23 · 维护者授权 00 代签过程闸 + 验收后 tag/push 代跑 · 各 W 波仍须 20 审查文落盘后由 00 逐波签 HG-AUDIT-R1 方可 30 改码 · npm publish 仅人）
