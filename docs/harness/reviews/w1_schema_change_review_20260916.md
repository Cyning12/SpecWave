# W1 · schema 变更评审文（schema change review）· v2 设计草案

> **状态**：`draft` · 待 **HG-SCHEMA-CHANGE** 批准（00 代签 · 已获维护者 2026-09-16 授权「签收，授权00签收后续所有文档」· 与 2.3.0/2.4.0 同模式）
> **起草**：2026-09-16 · W1 schema 变更评审棒（设计评审 · **非实现**）

> **上游**：[`docs/spec/3_0-architecture-leap/02_w1_schema_leap_v1.md`](../../spec/3_0-architecture-leap/02_w1_schema_leap_v1.md)（signed · HG-SPEC-SIGNOFF=approved）· [`docs/roadmap/PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W1 节 + 硬约束 3/4/12/15
> **性质**：3.0 W1 的**硬前置**（PLAN 硬约束 3：先评审文 → HG-SCHEMA-CHANGE 闸 → 才可开 W1 task 改码）。本文只出设计；实现归 W1 task（30）。
> **证据纪律**：全部证据引仓内 **tracked 路径 + 行号**（2026-09-16 本棒实测）；不引 `.workbuddy/` 件（硬约束 14 · `.workbuddy/` 被 `.gitignore` 整体忽略 · clone/评审员不可达）。

---

## 1. 现状测绘（2026-09-16 实测 · W0 拆分后新布局）

### 1.1 schema 现结构

- **schema 文件现址**：`assets/ide/host-adapt/host-adapt.schema.json`（97 行）。
  ⚠️ **口径修正**：SPEC §1 与校核表引用路径 `assets/ide/host-adapt/schema/host-adapt.schema.json` **已不存在**；现路径无 `schema/` 中间层（本棒 glob 实测仅三件：`host-adapt.schema.json` · `examples/mvp-hosts.yaml` · `README.md`）。W1 task 起草时以此为准。
- **JSON schema 白名单**（`additionalProperties:false` 现值）：
  - 根：`required: [version, hosts]`（`host-adapt.schema.json:7-8`）；`version` 为**字符串**（`:10-14`，现值 `"1"` · `mvp-hosts.yaml:10`）。
  - HostRow：`required: [host_id, surfaces]`（`:25`）。
  - Surfaces：`required: [always_on, skills, commands]` + 可选 `verify`（`:38,52`）——**四节结构**。
  - VerifyEntry：`{kind: const "cli", bin, failClosed?}`（`:86-95`）。
- **手写校验器现址**（W0 后）：`src/host/schema.ts`。`validateHostAdaptDoc`（`:112-164`）白名单现值与 JSON schema 一致：根额外键拒（`:118-121`，仅 allow `version`/`hosts`）· 行额外键拒（`:133-136`，仅 `host_id`/`surfaces`）· surfaces 白名单 `['always_on','skills','commands','verify']`（`:143-144`）· 三节必填（`:153-157`）· `validateVerify`（`:92-109` · `:161` 调用）。S2 路径扫描 `checkS2Field`（`:22-30`）。
### 1.2 verify：13 宿主全声明 · 零消费（实证）

- **声明面**：`mvp-hosts.yaml` 13 个宿主行**全部**带 `verify: {kind: cli, bin: spec-wave, failClosed: true}`（`:24-27, 44-47, 64-67, 78-81, 93-96, 107-110, 121-124, 150-153, 164-167, 176-179, 190-193, 204-207, 216-219`）。
- **消费面 = 零**（本棒复测，与 SPEC §1 校核 #1 一致）：
  - `grep verify src/host` 仅命中：`schema.ts:144,161`（校验）· `commands.ts:7`（同名 core 命令动词，与 verify 节无关）· `cmd.ts:96`（注释）。
  - `grep failClosed src` 中读 verify 节 `failClosed` 键的仅 `schema.ts:98,106-107`（校验布尔型）；其余命中均为别子系统同名概念。
  - `src/host/cmd.ts:503-512`：host 子命令仅 `validate`/`apply`/`update` 三个——**无 `host verify`**。
  - 结论：verify 声明经 `validateVerify` 校验后**无任何代码读取使用**；`host apply/update` 物化路径不消费它（消费归 W2 的 `host verify` 物化）。

### 1.3 hooks：不存在（实证）

- `grep hooks src` = **0 命中**（本棒实测）。
- surfaces 白名单（`schema.ts:143-144` · `host-adapt.schema.json:38-52`）不含 `hooks`；任何带 `hooks` 键的表今天即被 `additionalProperties:false` 口径拒红。

### 1.4 动词名硬编码清单（逐一列出）

- **`CORE_COMMAND_VERBS`**（`src/host/commands.ts:6-12` · 5 项）：`verify` · `gate-status` · `init-guide` · `apply-standards` · `hat-reanchor`
- **`EXPANDED_COMMAND_STEMS`**（`src/host/commands.ts:20-28` · 7 项）：`hat-00-delegate` · `hat-10-spec` · `hat-10-task` · `hat-20-spec-audit` · `hat-20-task-audit` · `graph-check` · `sync-prompts-guide`
- 关联硬编码：`kit-30`/`kit-publish` 禁令目前**只是注释纪律**（`commands.ts:17-19` 注释「禁 kit-30 / kit-publish」），无机检。
- **消费点**：`src/host/materialize.ts:343-365`（物化时按 basename 解析 + core/expanded 完整性检查 `missing` 计算）· `commands.ts:60-67`（旧 Claude 扁平落点 `.claude/commands/kit-<verb>.md` 探测）。

### 1.5 表定位与闸判定现状（W1 范围④相关）

- 表定位：`src/host/table.ts:7`（`DEFAULT_EXAMPLE_REL`）· `resolveValidateFile`（`:45-48` · 有 `--file` 即用、否则回包内默认）· `listKnownHostIds`（`:51-68`）。
- 闸判定：`parseHumanGates`（`src/cli-shared.ts:270-286` · 只读 `### 人工闸` 节）· `evaluateMayStart30`（`:292-306` · **白名单 3 闸**硬编码：HG-AUDIT-R1 缺行/非 approved 即拒 · HG-TASK-DRAFT（blocks 含 30 且非 approved 拒）· HG-GRAPH-MODULES（pending 拒））· `formatGateCheck`（`src/cli/gates.ts:54-98` · 只渲染该 3 行）。
- 存量规模复核：SPEC §1 快照为 73 task / 229 HG 行 / 13 种闸 ID；本棒快测（active+done，表行口径）约 **284 表行 / 17 种闸 ID**（口径与 SPEC 快照不同，仅证机制结论方向不变）——**W1 task 必须以统一口径重新生成真实基线快照**（SPEC residual_risks ② · 见 §6 OQ-5）。

---

## 2. 新 schema 设计（v2 草案 · 本评审文核心）

### 2.1 `schema_version` 字段（形态裁决：**整数**）

SPEC §5.1 留「整数或语义串（评审文定）」⇒ **本文裁定：整数**。

- **新增独立键** `schema_version`（integer），**不复用**既有 `version: "1"` 字符串字段。理由：① `version` 是表内容版本串（`host-adapt.schema.json:10-14` 定义为 string），改其类型即对旧表 breaking；② 独立键使「缺省 = v1」探测无歧义。
- **取值**：缺省（键不存在）= **v1 旧扁平语义**；`schema_version: 2` = 本版新语义；**> 2 → fail-closed 报「未知 schema_version」**（F-W1-03 · 不得静默按旧格式解析）；非整数 → schema 校验报红。
- **歧义边界钉死**（SPEC residual_risks ③）：v1 白名单根仅 allow `version`/`hosts`（`schema.ts:118-121`），**任何合法 v1 表不可能已含 `schema_version` 键**（含则今天即报红）⇒ 「旧表恰好含同名键」的歧义在机制上不存在，探测逻辑无灰色地带。
- `version` 字符串字段**保留不动**（`tableVersionOf` 等报告面既有消费不回归 · W1 非范围）。

### 2.2 `hooks` 节结构（口径：**只声明与物化 · 运行时归宿主**）

位置：**host 级 `surfaces.hooks`**（与 always_on/skills/commands/verify 并列 · 物化归属与宿主强绑定，根级无意义）。

| 字段 | 形态 | 说明 |
|------|------|------|
| `mechanism` | 枚举 `shell-hook` / `config-hook` / `none` | **机制族**（三族定稿 · 见 OQ-1）：shell 钩子注入 / 宿主配置文件声明式钩子 / 无 hook 能力（→ 显式降级 · 对应 PLAN W2「降级留痕」口径） |
| `triggers` | 触发点枚举数组（task 定稿 · 如 pre-commit / pre-archive） | 机制族非 none 时必填 |
| `command` | 字符串 | 宿主侧执行命令（如 `npx spec-wave verify --target .`） |

- **W1 边界**：schema 校验 + 声明入表 + 可机检（非法 hooks 报红 / 合法报绿 · 验收 #3）即止；**物化归 W2 · 运行时永不归 SpecWave**（SPEC 非范围 · SPEC §6「hooks 语义=只声明与物化」采纳行 · PLAN W1 风险条）。
- **v1 兼容缺省**：旧表无 hooks 节 → 内部模型映射为 `mechanism: none`（语义 = 未声明，与现状零行为差）。
- S2 扫描沿用：hooks 不含落盘路径字段（command 为执行串非路径），无需扩展 `checkS2Field`；若 W2 物化引入落点字段再评。

### 2.3 `verify` 节承接设计

- **结构不变**：v1 的 `surfaces.verify: {kind, bin, failClosed?}` **原样承接**进 v2 同位置，`validateVerify` 校验语义保留（SPEC §5.1「既有校验逻辑保留并接入新 schema」）。
- **消费口径不变**：W1 仍**只校验不消费**（`host verify` 物化归 W2 · SPEC 非范围）——本波不把 verify 接进任何执行路径，避免 W1/W2 职责混淆。
- **defaults/extends 参与**：verify 节可入 `defaults`（13 宿主 verify 声明当前逐字重复 13 遍 · `mvp-hosts.yaml` §1.2 实测 · 正是 B2 要消的重复面），按 §2.4 合并规则解析。

### 2.4 `defaults` + host 级 `extends`：合并语义（裁决级）

形态示意：

| 层 | 键 | 说明 |
|----|----|------|
| 根 | `defaults.surfaces`（可选） | 全局默认面（partial surfaces） |
| host 行 | `extends: <host_id 或 "defaults">`（可选） | 继承另一 host 行或根 defaults |
| host 行 | `surfaces`（只写差异面） | 覆盖/深合并按下行规则 |

**解析序**：`defaults` → `extends` 链（拓扑序）→ host 自身 `surfaces`，后者覆盖前者。

| 维度 | 规则（本文裁定） | 理由 |
|------|-------------|------|
| 标量（如 verify.bin） | 子覆盖父 | 直觉语义 |
| 对象（如 verify 整体） | **逐键深合并**（子只写 `failClosed` 可继承父 `kind`/`bin`） | 消重复是 B2 初衷；整体替换会逼用户抄全 |
| 数组（always_on/skills/commands 条目列表） | **整体替换**：子声明该键即以子数组为准；未声明则继承 | 条目列表是有序集合，逐元素合并语义不可预测、fixture 不可钉；replace 是唯一可证语义。追加语法（`+key` 等）**显式不做**（防过度设计 · 留 v3 复议） |
| **循环继承** | **拒绝并报循环链**（A→B→A · 含自继承 A→A）· 负向 fixture 固化（F-W1-02） | SPEC 验收 #2 硬性要求 |
| 未知 extend 目标 | 拒绝并点名（负向 fixture · SPEC 验收 #2） | fail-closed |
| 链深 | 防御上限（建议 8）· 超限报红 | 防病态输入；正常表 1–2 层 |
| `extends: defaults` | 合法（指向根 defaults 伪节点）· defaults 自身不得 extends | 语义闭环 |

- **解析时机**：校验后、消费前一次性解析为**全量展开的内部模型**（resolved rows）——下游（materialize / pins / report）只看到展开后的行，**无需感知 extends**。
- **pin-17 约束（重要）**：extends 是**可选**特性；`hosts` 必须保持**数组·每行带 `host_id` 标量**的现结构（§5.1 前提论证）。

### 2.5 commands 动词名入表（B3 · 替硬编码）

新增**根级** `command_sets` 节（数据驱动 · 替 `src/host/commands.ts:6-28` 常量）：

| 子键 | 现值来源 | 说明 |
|------|---------|------|
| `core` | = CORE_COMMAND_VERBS 现 5 项（§1.4） | 非空数组 · 逐项非空字符串 |
| `expanded` | = EXPANDED_COMMAND_STEMS 现 7 项（§1.4） | 同上 |
| `forbidden` | `kit-30` · `kit-publish` | 现注释纪律（`commands.ts:17-19`）→ **机检化**：出现在 core/expanded 即报红 |

- **消费改造**：`materialize.ts:343-365` 的 basename 解析与 `missing` 完整性检查改读表数据；`commands.ts` 常量删除（parse 函数保留但数据源入表）。
- **fail-closed**（F-W1-07）：v2 表缺 `command_sets` → 报红，**不回退硬编码默认**；含 `forbidden` 条目 → 报红。
- **兼容桥**：v1 路径（无 `command_sets` 键）由 back-compat reader **注入内建目录** = 当前常量现值（§3.2 映射表），使旧表行为逐字不变。
- **profile 语义不动**：`commandEntryApplies`（`commands.ts:47-52` · expanded ⊇ core）为行为逻辑非数据，保留；`CommandsEntry.profile` 枚举（`schema.ts:78-87`）不变。

### 2.6 闸判定泛化（范围④ · HG-GENERIC · 本闸的机制前提）

- `evaluateMayStart30`（`cli-shared.ts:292-306`）：白名单 3 闸 → **声明式全闸扫描**：任何 `blocksHats` 含 `30` 且 `status ≠ approved` 的闸行 → 拒 30 并点名闸 ID；**保留 HG-AUDIT-R1 缺行即拒**（fail-closed by absence · F-W1-05）。
- `formatGateCheck`（`src/cli/gates.ts:54-98`）：泛化渲染**全部** `blocks_hats` 含 30 的命中行（不再只列 3 行 · 验收 #6）。
- **回归锁**：存量全量 HG 行判定结果**逐条不变**（扫描快照基线 · 验收 #5）+ 新 fixture：仅含 `HG-SCHEMA-CHANGE | pending | 30` 一行的 task 断言 `may_start_30 === false` 且 `evaluateMayStart30()` 返回 `{ok:false, reason:'HG-SCHEMA-CHANGE pending'}`。
- **自指依赖说明**：HG-SCHEMA-CHANGE 是 W1 自己的准入闸；泛化改造落码前该闸咬不住 ⇒ 顺序只能是「本评审文 → 闸批准 → task 落闸行 → 30 改码（含泛化）」（见 §6 OQ-7）。

---
## 3. 向后兼容方案（硬约束 4 三重保险 · 逐一落实为设计）

### 3.1 保险① · back-compat reader 探测逻辑

```
parse(yaml) → root
  ├─ root 含 'schema_version' 键？
  │    ├─ 是 · 整数 2        → v2 解析路径（§2 全新校验 + defaults/extends 解析）
  │    ├─ 是 · 整数 > 2      → fail-closed「未知 schema_version」（F-W1-03）
  │    └─ 是 · 非整数        → schema 校验报红
  └─ 否                      → v1 解析路径：既有 validateHostAdaptDoc 语义原样
                               （白名单/必填/S2 扫描不动）→ §3.2 映射入新内部模型
```

### 3.2 保险② · 旧扁平格式 → 新内部模型 语义等价映射表

| v1 旧格式（现状） | v2 内部模型映射 | 等价性 |
|---|---|---|
| `version: "1"` | 原样保留（报告面不动） | 恒等 |
| `hosts[]` 每行全量 surfaces | resolved rows = 原行（无 defaults/extends 可解析 · 恒等展开） | 恒等 |
| `surfaces.verify` | 同位置同语义（§2.3） | 恒等 |
| 无 `hooks` 键 | `hooks = {mechanism: none}`（未声明缺省） | 现状零行为差 |
| 无 `command_sets` 键 | 注入内建目录 = `commands.ts:6-28` 常量现值 | 行为逐字不变 |
| 无 `schema_version` 键 | v1 语义 | 定义如此 |

### 3.3 保险③ · 旧表零改动通过的验证方案（fixture 设计）

- **compat 回归锁 fixture**：2.4.2 版 `mvp-hosts.yaml` **逐字拷贝**固化为测试 fixture → 新版 `host validate` / `host apply`（dry-run）**零改动通过**（SPEC 验收 #1）；断言物化计划（planned writes）与旧版逐字一致（防映射漂移）。
- **既有 11 件 host 测试全绿不改动**（§5.2）——它们全部跑在 v1 格式上，本身就是 compat 锁的另一半。
- **迁移指引**即第三重保险的人文面（§4）。

---

## 4. 迁移指引要点（MIGRATION.md 草案素材 · 2.4.2 → 3.0.0）

> 现状 `MIGRATION.md` 为 1.12/改名线文档（`MIGRATION.md:1-11`），无 3.0 节。以下素材供 W1 落「2.4.2 → 3.0.0（breaking）」节，W7 定稿。

1. **什么都不用做（默认路径）**：仅用内置 13 宿主的消费者，升级 `spec-wave@3.0.0` 后 `host apply/update` 行为不变；旧格式适配表（含 `--file` 自定义表）**零改动继续可读**（缺省按 v1 解析）。
2. **自定义表作者（可选迁移）**：欲用新能力时 —— ① 表首加 `schema_version: 2`；② 可选：把多行重复的 `verify`/`skills` 提入 `defaults` 或改用 `extends`；③ **必做**：声明 `command_sets`（v2 表缺此节 fail-closed · F-W1-07）；④ 可选：声明 `surfaces.hooks`（机制族 + 触发点 + 命令 · 只声明，物化随后续版本）。
3. **禁止事项**：不要手写 `schema_version` > 2（fail-closed 拒）；不要在 `command_sets` 中含 `kit-30`/`kit-publish`（机检拒）。
4. **落点不变**：13 宿主既有物化路径不变（W1 非范围 · PLAN W1 非范围条）。

---

## 5. 对 pins / 测试面的影响

### 5.1 pin-17（13 宿主双语命中）—— 前提成立性论证

pin-17（`assets/release-pins.yaml:173-206` · kind `readme-host-row`）的提取逻辑（`src/cli-pins.ts:382-395`）：**直接 `yamlLoad` 原始表 → 逐行取 `hosts[].host_id`**，**不经过 schema 校验、不做 defaults/extends 解析**。

- **前提成立的条件**：v2 必须保持 ① 表文件路径不变（`release-pins.yaml:174` 钉死 `assets/ide/host-adapt/examples/mvp-hosts.yaml`）；② `hosts` 为**数组**且**每行带 `host_id` 标量**（`cli-pins.ts:389-392` 的提取形态）；③ 13 个宿主 id 不变（`release-pins.yaml:193-206` host_hits 键集）。
- **本设计的满足性**：§2 全部新增节（schema_version/defaults/command_sets/hooks）均为**新增键**；`extends` 为可选且 `host_id` 仍在行级 ⇒ 原始 YAML 层 `hosts[].host_id` 提取不受任何影响。**设计约束登记**：v2 **禁止**把 hosts 改为 map 形态、禁止把 host_id 移出行级（否则 pin-17 extract_error fail-closed）。
- 表内容改写（用 defaults/extends 消重复）属 W1 task 的**可选**动作；即使做，pin-17 绿的前提仍成立（词锚判据读 README 双语表行 · `cli-pins.ts:419-428` · 与适配表内部结构无关）。

### 5.2 现有 host 系测试影响面盘点（11 件 · 全须不改动保持绿）

| 测试文件 | 影响评估 |
|---|---|
| `test/host-adapt-validate.test.ts`（合法/非法/S2/--json · `:47-142`） | v1 路径回归锁 · 零改动须绿 |
| `test/host-adapt-apply.test.ts` / `host-adapt-update.test.ts` / `host-adapt-sticky.test.ts` | 物化/刷新/粘性 · v1 路径 · 零改动须绿 |
| `test/host-adapt-u01.test.ts`（契约嗅探） | 与 schema 无关 · 须绿 |
| `test/host-adapt-w1-skills-parity.test.ts` / `w2-commands-ux` / `w3-dsh-orch` / `w4-expanded` / `w6-three-hosts` / `w6-2_3-six-hosts` | 历史波次特性锁（含 commands 物化面）· 动词名入表后**行为须逐字不变** · 零改动须绿 |

- **新增 fixture**（W1 task 落）：compat 回归锁（§3.3）· extends/defaults 正负（覆盖/深合并/循环/未知目标 · 验收 #2）· hooks 红绿（验收 #3）· command_sets 缺失/禁词红（F-W1-07）· 闸泛化双锁（验收 #5/#6）。
- `pins check` 17/17 仍绿为验收 #4 硬条。

---
## 6. 风险与开放问题

| # | 问题 | 级别 | 建议处置 |
|---|------|------|---------|
| OQ-1 | hooks 触发点枚举集合未钉（pre-commit / pre-archive / …?）· 机制族三族外是否预留扩展位 | **blocking**（v2 schema 定稿前须定） | 本文建议三族定稿 + 触发点枚举在 **W1 task 起草时**钉死并进 schema enum；扩展留 v3 复议。**维护者若对三族划分有异议须在闸批注中提出** |
| OQ-2 | 数组合并语义 replace vs 逐元素合并 vs 追加语法 | **blocking**（fixture 语义依赖） | 本文已裁定 **replace**（§2.4 表）；追加语法显式不做。异议须闸前提出，否则 W1 task 按本文执行 |
| OQ-3 | `schema_version` 整数 vs 语义串（SPEC §5.1 留白） | 本文已裁定**整数** · 非 blocking | 20-task-audit 复核；异议闸前提 |
| OQ-4 | verify 节 W1 仍零消费（`host verify` 归 W2）——「声明机检但无消费」窗口期口径 | 非 blocking · 口径确认 | 与现状一致（§1.2 实证已如此）· 对外文案不得暗示 verify 已生效（硬约束 9）· W2 兑现 |
| OQ-5 | 闸泛化「存量逐条不变」基线快照口径未统一（SPEC 快照 229 行/13 闸 vs 本棒快测约 284 行/17 闸 · 口径不同） | **blocking**（验收 #5 的可证性依赖） | **W1 task 起草时以统一脚本口径重新生成基线快照**并固化为 fixture；20-task-audit 核对口径与计数 |
| OQ-6 | command_sets 内建默认值（v1 兼容桥）与 `commands.ts` 常量删除后的漂移防护 | 非 blocking | W1 task 加 fixture 断言内建目录 = 现 5+7 项逐字值；删除常量时同步 |
| OQ-7 | HG-SCHEMA-CHANGE 自指 bootstrap（闸是 W1 自己的准入闸 · 泛化码未落前靠人工纪律） | 非 blocking · 顺序已明 | 顺序：本评审文 → 00 代签闸 → W1 task 落闸行（§7）→ 30 改码。泛化落码前闸的约束靠人工纪律 + task 闸表（硬约束 15） |
| OQ-8 | SPEC/校核表引用的 schema 路径（`assets/ide/host-adapt/schema/host-adapt.schema.json`）与现址（无 `schema/` 层）不符 | 非 blocking · 标注级 | 本文 §1.1 已修正登记；W1 task 以现址为准；SPEC :7 行号快照条款已预告此类漂移 |

---

## 7. 闸行草案（W1 task `### 人工闸` 表 · HG-SCHEMA-CHANGE 行建议写法）

> 供 10-task 起草 W1 task 时落入 `### 人工闸` 表（`parseHumanGates` 只采集该节 · `cli-shared.ts:270-271` · 硬约束 15）。表头沿用现行四列格式（参照 `docs/tasks/done/task_3_0_w0_refactor_prep.md:36-41`）。

```markdown
### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-16 维护者本窗签收 PLAN_3_0 |
| HG-SPEC-SIGNOFF | approved | — | 人 · 2026-09-16 维护者本窗签收 3.0 SPEC 系列（同时授权 00 代签后续过程文档闸） |
| **HG-SCHEMA-CHANGE** | **pending** | **30** | **通过条件**：schema 变更评审文 [`docs/harness/reviews/w1_schema_change_review_20260916.md`](../../harness/reviews/w1_schema_change_review_20260916.md) 落盘并经批准（00 代签 · 授权真值：维护者 2026-09-16 本窗「签收，授权00签收后续所有文档」）。**status 翻 approved 前 W1 30 拒改任何 schema/表/校验码**（硬约束 3/15 · F-W1-04 泛化后由 evaluateMayStart30 机检咬住） |
| HG-TASK-DRAFT | pending | 20, 30 | 00 代签（同授权） |
| **HG-AUDIT-R1** | **pending** | **30** | 20-task-audit 审查文 PASS 后 00 代签（同授权） |
```

- **机检路径**：闸行落 task `### 人工闸` 表 + `blocks_hats` 含 `30` ⇒ W1 泛化改造交付后 `evaluateMayStart30` 声明式咬住（验收 #5 fixture 即此行形态）；泛化交付前由人工纪律 + GATE_VERIFY 扫描兜底。
- **blocks 含 30 的硬理由**：不含则泛化判定不咬（硬约束 15a）· 且本闸的语义就是「未批准前 30 拒改码」（PLAN 硬约束 3）。

---

## 8. 评审结论

**建议批准**（带 OQ-1/OQ-2/OQ-5 三条 blocking 项的处置意见：OQ-1/OQ-2 由本文裁定先行、异议闸前提出；OQ-5 由 W1 task 重扫基线闭环）。三重保险（§3）+ pin-17 前提论证（§5.1）+ 闸行草案（§7）齐备，满足 PLAN 硬约束 3/4/12/15 对「schema 变更评审文」的全部前置要求。

## 9. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-16 | draft · W1 schema 变更评审棒 · 全文证据 tracked 路径+行号实测（W0 后新布局：`src/host/*` · `src/cli/gates.ts`）· schema 现址修正登记（§1.1） |
