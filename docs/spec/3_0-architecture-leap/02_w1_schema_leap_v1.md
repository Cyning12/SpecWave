# 02 · W1 · 适配表 schema 跃迁 + 闸判定泛化（schema leap）· **本次核心 · breaking**

> **状态**：`signed`（**HG-SPEC-SIGNOFF=approved** · 2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人 · **HG-SCHEMA-CHANGE=pending** —— 本波硬前置人闸）  
> **隶属**：`3_0-architecture-leap` · **3.0 被定为 major 的唯一硬理由**  
> **test_strategy**：`required`（向后兼容回归锁 + extends/defaults 正负 fixture + 闸泛化回归锁）  
> **上游**：PLAN_3_0 W1 节 · 路线研究 §4 主线一/二（A3/B2/B3）· 校核表 #1/#2/#3/#25（闸泛化实测）  
> ⚠️ 行号为起草轮快照（`cli-host.ts:370-379,416,433` · `cli-shared.ts:292-306` · `cli.ts:487-525`），**W1 task 起草时须回源码复核现值**

---

## 1. 背景

**A3 现状（本轮复核实测）**：schema **有** `verify`（`host-adapt.schema.json:52,86-95`）且 13 宿主全声明、`validateVerify` 只做校验（`cli-host.ts:370-379,433`）——**全仓无一处消费**；`hooks` **不存在**（`additionalProperties:false` 白名单 `cli-host.ts:416` 仅 allow always_on/skills/commands/verify · `src/` grep `hooks` = **0**）。产品最大卖点悬空，P0 门禁装不进宿主。

**B2/B3 现状**：10+ 宿主适配表大量重复（无分层继承）；commands 动词名硬编码在 `cli-host.ts`（应数据驱动入表）。

**闸判定现状（存量既存缺口 · 校核表 #25 实测）**：`evaluateMayStart30`（`cli-shared.ts:292-306`）与 `formatGateCheck`（`cli.ts:487-525`）**只认 3 个白名单闸 ID**（`HG-AUDIT-R1`/`HG-TASK-DRAFT`/`HG-GRAPH-MODULES`）；存量 **73 份 task / 229 条 HG 行 / 13 种闸 ID** 中，`HG-SPEC-SIGNOFF`（55 行 · 多处 `blocks_hats=10-task,30`）**语义上应拒 30 却从不被检查** ⇒ 3.0 新设 `HG-SCHEMA-CHANGE` 若不改机制即「写了闸也咬不住」（自指依赖：该闸是 W1 自己的准入闸）。

**为什么四项同属一波**：`hooks`/`verify`/`defaults`/`extends`/commands 动词名同属 `mvp-hosts.yaml` 一个 schema，必须一波设计到底，另起一波会二次 breaking。闸判定泛化与适配表 schema 无耦合，但并入 W1 是因为不修则 W1 准入闸形同虚设（PLAN 编排理由 #2）。

## 2. 目标

1. **schema_version 化**：`mvp-hosts.yaml` schema 增 `schema_version` 字段 + `hooks` 节 + `verify` 节（声明层），向后兼容读旧扁平格式。
2. **B2 分层**：`defaults`（全局默认）+ host 级 `extends`（继承与覆盖），替代扁平全量重复。
3. **B3 数据驱动**：commands 动词名入表，去 `cli-host.ts` 硬编码。
4. **闸判定泛化（HG-GENERIC）**：30 判定由白名单 3 闸 → **声明式全闸**——「任何 `blocks_hats` 含 `30` 的非 approved 闸 → 拒 30」，`formatGateCheck` 同步泛化渲染全部命中行；保留 `HG-AUDIT-R1` **缺行即拒**（fail-closed by absence）。
5. **向后兼容红线**（硬约束 4）：旧扁平格式**零改动仍可读**（按 `schema_version` 缺省探测），旧 → 新等价语义明确。

## 3. 范围

| # | 项 | 形态 | 出处 |
|---|----|------|------|
| ① | **A3 上半 · schema 增节**：`hooks`（宿主 hook 声明：机制族 + 触发点 + 命令）· `verify`（宿主侧校验声明 · 既有校验逻辑保留并接入新 schema）· `schema_version` | `host-adapt.schema.json` + `mvp-hosts.yaml` + `cli-host.ts`（W0 后为 `src/host/schema.ts`）校验/解析 | 路线 §4 主线一 · 校核 #1 |
| ② | **B2 分层**：`defaults` + host 级 `extends`，合并语义（覆盖 / 深合并 / **循环继承拒绝**） | schema + 合并器 + 正/负 fixture | 路线 §4 主线二 · 校核 #2 |
| ③ | **B3 动词名入表**：`CORE_COMMAND_VERBS` / `EXPANDED_COMMAND_STEMS` 等硬编码迁移为表数据驱动 | `cli-host.ts`（W0 后 `src/host/commands.ts`）去硬编码 | 路线 §4 主线二 · 校核 #3 |
| ④ | **闸判定泛化**：`evaluateMayStart30` 改声明式全闸扫描；`formatGateCheck` 泛化渲染所有 `blocks_hats` 含 30 的闸行（不再只列 3 行）；`HG-AUDIT-R1` 缺行即拒保留 | `cli-shared.ts` + `cli.ts`（W0 后 `src/cli/gates.ts`） | 校核 #25 · PLAN W1 增项 |
| ⑤ | **向后兼容 reader**：`schema_version` 缺省探测旧扁平格式，旧格式零改动通过；旧 → 新等价语义文档化 | 兼容层 + 回归锁 fixture | 硬约束 4 |
| ⑥ | **`HG-SCHEMA-CHANGE` 闸设立**：schema 变更评审文落盘 `docs/harness/reviews/` → 人闸批准 → 才可改码；**闸行写进 W1 task 的 `### 人工闸` 表且 `blocks_hats` 含 `30`** | 评审文 + task 闸表（硬约束 3/15） | PLAN W1 硬前置 |
| ⑦ | **`MIGRATION.md` 迁移节草案**：2.4.2 → 3.0.0 breaking 迁移指引（W7 定稿） | 文档草案 | PLAN W1 硬前置 |

## 4. 非范围

| 项 | 理由 |
|----|------|
| 改 13 宿主既有落点路径 | 物化目标不变（物化归 W2 兑现面） |
| 改 pin-17「表行 ∧ 词锚」判据 | 表结构与宿主 id 不变；pin-17 语义判归 W4（NEW-4） |
| 引入第二份适配表 | PLAN W1 明示 |
| hooks 运行时实现 | 口径定为「只声明与物化，运行时归宿主」；物化归 W2 |
| B5 catalog / 用户级目录 / 多表合并 | 归 W2（B5 依赖本波 schema · 不得抢跑） |
| 追溯存量 task 闸表 | 不追溯存量（硬约束 7 · D-24-W2-NO-RETRO 沿用） |

## 5. 设计

### 5.1 schema 演进（一次性设计 · 具体字段以评审文定稿）

- `schema_version`：整数或语义串（评审文定），缺省 = 旧扁平格式（v1 语义）。
- `hooks` 节：宿主 hook 声明 = **机制族**（shell-hook / config-hook / 无 hook 降级）+ 触发点 + 命令；**只声明与物化，运行时归宿主**（防过度设计拖累 W2）。
- `verify` 节：承接既有 13 宿主声明，接入新 schema 层级；既有 `validateVerify` 校验语义保留。
- `defaults` + `extends`：host 声明可继承 defaults 或另一 host 节，覆盖语义与深合并规则须正负 fixture 钉死；**循环继承必须拒绝**（负向 fixture）。

### 5.2 向后兼容 reader（硬约束 4 三重保险）

1. **back-compat reader**：`schema_version` 缺省 → 按旧扁平格式解析，语义等价映射到新内部模型。
2. **版本探测**：显式 `schema_version` 分流解析路径。
3. **迁移指引**：`MIGRATION.md` 草案（范围 ⑦）。

### 5.3 闸判定泛化（声明式 · 实测零误伤）

- 现状：白名单 3 闸硬编码（`HG-AUDIT-R1`/`HG-TASK-DRAFT`/`HG-GRAPH-MODULES`）。
- 目标：**任何 `blocks_hats` 含 `30` 的非 approved 闸 → 拒 30**；`formatGateCheck` 渲染全部命中行。
- **保留** `HG-AUDIT-R1` 缺行即拒（fail-closed by absence）—— absence 与 pending 双通道都咬。
- **兼容性已实测**：存量 229 行中 `blocks含30 ∧ status≠approved` = **0 行** ⇒ 泛化对存量**零误伤**（`HG-SPEC-SIGNOFF=N/A`、`HG-EOS-DATE=pending` 等 `blocks=—`/非 30 行不受影响）。
- **仍须回归锁**：以扫描快照为基线，断言存量 229 条 HG 行判定结果**逐条不变**（泛化零行为漂移）。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 闸判定 = 声明式全闸扫描 | **采纳（D-30-HG-GENERIC）** | 否则 `HG-SCHEMA-CHANGE` 咬不住（自指依赖）· 存量零误伤已实测 · 顺带修复 `HG-SPEC-SIGNOFF` 等 10 种闸从未被采集的存量缺口 |
| 闸判定 = 白名单扩第 4 个闸 | 弃选 | 补丁式 · 下一个新闸又要改码 · 不解决「写了闸咬不住」的机制病根 |
| schema 演进 = 单波一次设计（hooks+verify+defaults+extends+version） | **采纳** | 同属一个 schema · 分波会二次 breaking（PLAN 编排理由 #2） |
| schema 演进 = A3 先行、B2/B3 后续波 | 弃选 | 二次 breaking · 适配表重写两遍 |
| hooks 语义 = 只声明与物化 | **采纳** | 运行时归宿主 · 防内置运行时过度设计拖累 W2（PLAN W1 风险条） |
| hooks 语义 = 内置 hook 运行时 | 弃选 | 越界替宿主实现运行时 · W2 非范围既定 |

## 7. 验收标准（必须自证，不接受「我改完了」）

1. **向后兼容回归锁**：旧格式 `mvp-hosts.yaml`（2.4.2 版）在新版**零改动**通过 `host validate` / `apply`（fixture 固化）。
2. **extends/defaults 合并语义**：正 fixture（覆盖 · 深合并）+ 负 fixture（**循环继承拒绝** · 未知 extend 目标）全部固化。
3. **`hooks` 节可机检**：schema 校验对非法 hooks 声明报红、对合法报绿（对应 A4 式「声明→接线」口径）。
4. **13 宿主端到端不回归**：`host apply` / `host update` 全宿主绿；`pins check` 17/17 仍绿（含 pin-17 13 宿主双语命中）。
5. **闸判定泛化回归锁**：新 fixture 构造**只含** `HG-SCHEMA-CHANGE | pending | 30` 一行的 task，断言 `evaluateMayStart30()` 返回 `{ ok:false, reason:'HG-SCHEMA-CHANGE pending' }` 且 `status` 的 `may_start_30 === false`；**并断言存量 229 条 HG 行判定结果逐条不变**（扫描快照基线）。
6. **`gate-check` 泛化渲染**：输出表列出所有 `blocks_hats` 含 30 的闸行（不再只列 3 行）· 快照断言。
7. **`HG-SCHEMA-CHANGE` 闸已落 W1 task 的 `### 人工闸` 表**（`blocks_hats` 含 `30`）—— 闸不落表即虚设（硬约束 15）。
8. `MIGRATION.md` 迁移节草案落盘（W7 定稿前的可评审形态）。
9. `npm run typecheck` 0 错 · `npm test` 全绿（含新增 fixture）。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W1-01 | 旧格式适配表含未知新字段 | 按 `additionalProperties:false` 既有口径拒绝并点名字段；旧格式本身不受影响 |
| F-W1-02 | `extends` 循环继承（A→B→A） | 合并器拒绝并报循环链 · 负向 fixture 固化 |
| F-W1-03 | `schema_version` 高于当前实现认知 | fail-closed 报「未知 schema_version」· 不得静默按旧格式解析 |
| F-W1-04 | 闸表存在 `blocks_hats=30` 且 pending 的新闸 ID（泛化后） | 拒 30 并在 `gate-check` 输出点名该闸（泛化目标行为） |
| F-W1-05 | task 文无 `### 人工闸` 节 / 无 `HG-AUDIT-R1` 行 | 保留缺行即拒（fail-closed by absence） |
| F-W1-06 | 泛化对存量 task 判定翻转 | 验收 #5 回归锁拦截 · 不得放行；确需翻转的须评审文论证并入豁免留痕 |
| F-W1-07 | 动词名入表后某宿主表缺 commands 节 | 按表数据缺失 fail-closed 报红（不再回退硬编码默认）· 13 宿主流转前全量校验 |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = 校核 #1（verify 声明无消费 · hooks 零命中实测）· #25（白名单 3 闸 · 229 行 13 种闸 · 零误伤实测）· PLAN W1 节 | no |
| R1 | 范围 = ①–⑦；非范围 = 落点路径 / pin-17 判据 / 第二份表 / hooks 运行时 / B5（归 W2） | no |
| R2 | §6 表：声明式泛化 vs 扩白名单 · 单波 schema 设计 vs 分波 · 声明物化 vs 内置运行时 | no |
| R3 | 边界：breaking 三重保险（compat reader + 版本探测 + MIGRATION）· 闸不落表即虚设 · 不追溯存量 · HG-SCHEMA-CHANGE 自指依赖（先泛化机制闸才真） | no |
| R4 | `test_strategy=required`：compat 回归锁 · extends 正负 fixture · 泛化回归锁（存量 229 行逐条不变 + 新闸 fixture）· 13 宿主 e2e | no |
| R5 | **已签收**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）· HG-SCHEMA-CHANGE 仍 pending（本波硬前置人闸 · 不在本次翻转范围）· 下一棒：00 逐波拆 task（10-task）→ 20-task-audit → HG-AUDIT-R1（00 代签）→ 30/40 | no |

**residual_risks**：① breaking 面最广（全部宿主消费者）——三重保险任一缺失即不可放行（缓解：验收 #1/#2 硬锁）；② 泛化虽实测零误伤，但「扫描快照基线」须 task 阶段真实生成（缓解：验收 #5）；③ `schema_version` 探测与旧格式歧义边界（如旧表恰好含同名键）须评审文钉死（缓解：F-W1-01/F-W1-03）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）| 本 SPEC 定稿 |
| **HG-SCHEMA-CHANGE** | **pending** | schema 变更评审文落盘 `docs/harness/reviews/` + 维护者批准前，W1 30 拒改码；**须落 W1 task `### 人工闸` 表且 `blocks_hats` 含 `30`** |
| HG-AUDIT-R1（W1 task） | pending | W1 30 改码前 |

> **机检诚实登记**：本表位于 SPEC 档（非 task 文 `### 人工闸` 节），`parseHumanGates` 不采集 ⇒ 不可机检 · 纯人工纪律；task 拆单时须把对应闸行复制进 task 文 `### 人工闸` 表（`blocks_hats` 按需含 `30`）才受 30 判定约束（硬约束 15）。

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-16 | draft · 10-spec · 自 PLAN W1 + 校核 #1/#2/#3/#25 收敛 · 行号快照待 task 复核 |
| 2026-09-16 | 10-spec 修订 · 20-spec-audit R1 advisory A1 落实（标注/登记级 · 无实质变更） |
| 2026-09-16 | signed · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）· R5 回填 |
