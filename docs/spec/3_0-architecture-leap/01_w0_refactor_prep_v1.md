# 01 · W0 · 重构预备（refactor prep · 三 god-file 拆分 + E3 第一批）· **非功能波**

> **状态**：`signed`（**HG-SPEC-SIGNOFF=approved** · **HG-NEXT-PLAN=approved** · 2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）  
> **隶属**：`3_0-architecture-leap` · **本波非功能：零行为变更** · 提交 `feat(3.0-W0): …`（**不迁 2.5.0** · D-30-VERSION-ROUTE）  
> **test_strategy**：`required`（**六重机械锁**为验收主体 + 独立验收文 M1）  
> **上游**：PLAN_3_0 W0 节（W0.1–W0.7 完整细化）· 路线研究 §4 主线五（E3/E4）· 「版本路由复裁」块  
> ⚠️ 本文件行号 / 用例计数均为 2026-09-15/16 起草轮快照，**W0 task 起草时须回源码与复跑实测复核现值**（PLAN 明示「未复核代码行号现值」；2.4.2 基线 607 用例中 2 个 tag-gated 用例随 `v2.4.2` tag 落位应已转绿，须以复跑为基线）

---

## 1. 背景

三个 god-file 合计 **3783 行 = `src/` 的 38.4%**（实测：`cli-host.ts` 1458 · `cli.ts` 1318 · `cli-checks.ts` 1007；旧稿 ~1105/~844 已过期）。3.0 各波**都会改这三个文件**：`cli-host.ts` 被 W1/W2（hooks/verify 消费 + 物化）、`cli-checks.ts` 被 W4（NEW-5 语义闸 / R-5）、`cli.ts` 被 W1（闸判定泛化 `formatGateCheck`）与 W6（`verify --task` 补 lint）。**一次拆完 = 后续每波回归面都变小**；分散在各波顺带拆则会反复触发重构型回归。同时 E3 须先为 W2 新增的大量宿主端到端测试减负，否则测试耗时线性爆炸。

**版本路由已复裁**：W0 对外零变更（三 god-file 经 `package.json#exports` 实测**对外密封** —— published-but-sealed），semver 上是 patch 级 ⇒ **不开 2.5.0**，以 M1 独立验收文 + commit 级可回退 + 锁⑥ 对外可达面不变式作等价替代（M1/M2/M3）。

**风险刻画收紧（2026-09-16 实测）**：不存在「打穿外部消费者」的风险（外部根本进不来 —— `import.meta.resolve` 对 `spec-wave/lib/*` 全部 `ERR_PACKAGE_PATH_NOT_EXPORTED`），风险面只剩**内部行为漂移**，正是六重锁的观测对象。E4 代价初判由 5 下调为 **4**（编制劳动仍在），**待 W0 task 起草复核**。

## 2. 目标

1. 三 god-file **内部实现搬迁 + 原文件降级为纯 barrel（re-export）**，消费者一行不改（D-30-BARREL · 本条不可动）。
2. 「零行为变更」从主观承诺降级为**机械可证**（六重锁全绿）。
3. 落 **M1 独立验收文**于 `docs/harness/reviews/`，**早于 W1 动 schema** —— 把「重构被埋在 3.0 大版本里」变成「重构有自己的证据面」。
4. E3 第一批：`cli-g1g7`（45×）/ `refresh`（41×）的 spawn 型断言下沉为核心逻辑单测 + 少量烟测，总 spawn 从 354 起步下降。

## 3. 范围

| # | 项 | 形态 | 出处 |
|---|----|------|------|
| ① | **E4 拆 `cli-checks.ts`**（1007 行）→ `src/checks/*`（invoke-hats / close-guards / review-gates / exempt / test-artifacts / lint），原文件降级为 barrel re-export 全部既有 export（40+ 符号） | 内部搬迁 + barrel · 建议首做（消费面最大但**无外部冻结面**） | PLAN W0.4 模块边界表 |
| ② | **E4 拆 `cli-host.ts`**（1458 行）→ `src/host/*`（table / sticky / schema / commands / materialize / backup / report / cmd），barrel re-export `cmdHost` / `listKnownHostIds` / 粘性 API / `validateHostAdaptDoc` 等 | 内部搬迁 + barrel · **W1 直接前置** | PLAN W0.4 |
| ③ | **E4 拆 `cli.ts`**（1318 行）→ `src/cli/*`（main / usage / init / gates / verify / task-cmd），barrel re-export `runCli` / `exitWithCliError`（+ 测试/兄弟模块仍在用符号） | 内部搬迁 + barrel · **触冻结面（`bin/*.js` 消费 `../lib/cli.js`），风险最高，最后做** | PLAN W0.3/W0.4 |
| ④ | **E3 第一批**：`cli-g1g7` / `refresh` spawn 型断言下沉为核心逻辑单测（每条下沉必须配等价单测）+ 保留少量烟测 | 测试改造 · **另起 commit 与 E4 隔离** | 路线 §4 主线五 · PLAN W0.7 |
| ⑤ | **锁③快照脚本固化**：`lib/cli.d.ts` / `lib/cli-checks.d.ts` / `lib/cli-host.d.ts` 导出符号名集合提取比对脚本，固化为 W0 交付的检查脚本 | 工具脚本 | PLAN W0.5 锁③ |
| ⑥ | **M1 独立验收文**：含拆分前后实测数字与快照 diff 结论 · 落盘 `docs/harness/reviews/`（**不得只引 `.workbuddy/`** · 硬约束 14） | 验收文 · **早于 W1** | 「版本路由复裁」M1 |

> 模块边界归属建议（依实测函数聚簇）见 PLAN W0.4 表；具体边界以 W0 task 的 10-task 定稿为准，**但「barrel 保留 + 消费者零改动」不可动**。

## 4. 非范围

| 项 | 理由 |
|----|------|
| 任何 CLI 行为、输出、exit code、错误文案变更 | 本波非功能 · 硬约束 5（重构与行为变更分离） |
| schema / pins / `bin/` 改动 | PLAN W0.7 明示 |
| `package.json#exports` / `files` 改动 · 新增任何 `./lib/*` 子路径 | 防重构顺带开放 deep import（锁⑥断言对象） |
| E3 其余 spawn 削减（354 → <50 收官） | 归 W7 收尾；本波只做第一批 |
| 顺带「顺手优化」（重命名、文案、逻辑等价改写） | 一律视为行为变更风险，禁止（W0.6：不混行为变更） |

## 5. 设计

### 5.1 barrel 原则（D-30-BARREL）

```
src/cli.ts          →  保留为 barrel：re-export runCli / exitWithCliError（+ 仍被消费符号）
src/cli-host.ts     →  保留为 barrel：re-export cmdHost / listKnownHostIds / 粘性 API / validateHostAdaptDoc …
src/cli-checks.ts   →  保留为 barrel：re-export 全部既有 export（40+ 符号）
新实现落在         →  src/cli/ · src/host/ · src/checks/ 子目录
```

消费者的 `import ... from './cli-checks'` **一行都不用改** ⇒ 锁②（消费者 import 面 `git diff` 为空）即 barrel 原则的机械化证明。

### 5.2 消费者清单（拆分设计硬约束 · PLAN W0.2 实测）

| 被拆文件 | 消费者 | 消费符号 |
|---------|-------|---------|
| `cli.ts` | `bin/specgate.js:2` · `bin/dsh-coding-kit.js:2` | 经 `../lib/cli.js` 取 `runCli` / `exitWithCliError` → **冻结公共面** |
| `cli-checks.ts` | `src/cli.ts:27` · `cli-lifecycle.ts:7` · `cli-task-extra.ts:20` · `cli-status.ts:18` · `test/cli-wiki-delta-section.test.ts:9` · `lib/cli-task-extra.d.ts:1`（类型） | 4 兄弟模块 + 1 测试 + 1 类型（`LegacyGateExemptEntry`） |
| `cli-host.ts` | `src/cli.ts:8` | `cmdHost` · `listKnownHostIds` |

### 5.3 零行为变更六重机械锁（本波核心验收 · PLAN W0.5 + 锁⑥）

| # | 锁 | 判据 |
|---|-----|------|
| ① | **用例计数锁** | `npm test` 拆分前后用例计数一致（2.4.2 基线 607 用例 · **W0 开工时须复跑实测为基线**，tag-gated 已随 `v2.4.2` 落位转绿） |
| ② | **消费者 import 面零 diff** | `git diff` 对 `cli-lifecycle.ts` / `cli-task-extra.ts` / `cli-status.ts` / `test/cli-wiki-delta-section.test.ts` 的 import 语句必须为空 |
| ③ | **公共导出面快照锁** | 三份 `lib/*.d.ts` 导出符号名集合拆分前后逐字一致（范围 ⑤ 脚本比对） |
| ④ | **发布链路锁** | `npm run test:lib` 6/6 绿（覆盖 `bin/*.js → lib/cli.js → src` 全链）· `pins check` 17/17 |
| ⑤ | **平台锁** | `typecheck`（strict + `noUncheckedIndexedAccess`）· `build` 零错 |
| ⑥ | **对外可达面不变式**（M3 · 2026-09-16 新增） | `package.json#exports` 映射（键与目标值）不变 · `lib/index.d.ts` 导出符号集不变 · 三个 bin 的 `--help` 与行为不变 · `files` 清单不变 · **不得新增任何 `./lib/*` 子路径**（防 deep import 顺带开放） |

> 锁⑥ 比锁③ 更有意义：锁③ 只快照内部 `lib/*.d.ts`；实测对外唯一入口是裸名 `spec-wave` + 3 bin ⇒ 锁⑥ 才是「消费者零感知」的机械化证明。

### 5.4 执行与回退粒度（PLAN W0.6）

- **每文件一个 commit**（`refactor(3.0-W0): 拆 cli-host → host/*` 等）× 3，不混行为变更；E3 spawn 削减另起 commit。
- **每个 commit 独立可回退**：任一个红 → 只 revert 该文件对应 commit，另两个保留。
- **顺序**：`cli-checks.ts` → `cli-host.ts` → `cli.ts`（触冻结面最后做）。
- **禁止 `git add -A`**；禁止顺带改行为 / 文案 / exit code。
- 锁①②③⑥ 任一不过即**停并回退该 commit**。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 内部搬迁 + 原文件降级为 barrel | **采纳（D-30-BARREL）** | 消费者零改动 ⇒ 零行为变更机械可证（锁②）；`bin/` 与兄弟模块是真实消费者 |
| 原地拆分改消费者 import | 弃选 | 回归面扩散到 4 兄弟模块 + 测试 + bin · 「零变更」只能靠人工承诺 |
| W0 单开 2.5.0 minor 发版 | **弃选（D-30-VERSION-ROUTE 复裁）** | W0 semver 上 patch 级（对外密封实测）· 收益内部性不靠发版兑现 · 独立验收改用 M1 验收文等价替代 · 打破 2.4.0 §7.3 纪律代价远大于收益 |
| 收窄版（只拆 cli-host） | 备择降级（W0-SPLIT） | 仅当 `cli.ts`（触冻结面）反复不过时启用：交出 cli-checks + cli-host 即可解锁 W1，`cli.ts` 留 W0b 延后 |

## 7. 验收标准（必须自证，不接受「我改完了」）

1. **六重锁全绿**：锁①–⑥ 逐项留实测证据（用例计数 · diff 为空 · 快照一致 · test:lib 6/6 + pins 17/17 · typecheck/build 零错 · 可达面逐项比对）。
2. **每个 commit 前后 `npm test` 同绿**（以 W0 开工复跑实测为基线，不沿用旧数字）。
3. **E3 下沉等价性**：每条下沉的 spawn 断言有等价核心逻辑单测，「删了不补」视为未完成；总 spawn 计数较 354 下降（给前后数字）。
4. **M1 独立验收文落盘** `docs/harness/reviews/`：含六重锁实测数字、快照 diff 结论、消费者 import 面 diff（应为空）、可达面比对；**不得只引 `.workbuddy/` 下件**（硬约束 14）；**该验收文过闸前 W1 不得动 schema**。
5. `package.json` `exports` / `files` / `bin/` **零改动**（机械断言）。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W0-01 | 锁①②③⑥ 任一不过 | 停并回退对应 commit（不整体重启 · 每文件独立可回退） |
| F-W0-02 | `cli.ts` 拆分反复不过（触冻结面） | 启用 W0-SPLIT 降级：只交 cli-checks + cli-host，`cli.ts` 留 W0b；W1 只依赖 cli-host，不被阻塞 |
| F-W0-03 | E3 下沉断言掩盖回归（删了不补） | 视为未完成 · 验收 #3 拒过 |
| F-W0-04 | 重构顺带新增 `./lib/*` exports 子路径 | 锁⑥ 拦截 · 必须回退（防 deep import 顺带开放） |
| F-W0-05 | 开工基线与 2.4.2 旧数字不符（tag-gated 转绿等） | 以复跑实测重建基线并在验收文登记，不得沿用旧数字强行比对 |
| F-W0-06 | barrel 漏 re-export 某符号（消费者编译错） | 锁⑤ typecheck + 锁③ 快照比对拦截 · 回退补符号 |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = PLAN W0.1 实测体量（3783/38.4%）· W0.2 消费者清单逐行实测 · exports 探针（对外密封）· 版本路由复裁块 | no |
| R1 | 范围 = ①–⑥；非范围 = 任何行为变更 / exports·files·bin / E3 收官（归 W7） | no |
| R2 | §6 表：barrel vs 改消费者 · 2.5.0 vs 留 3.0（复裁）· 完整版 vs 收窄版（维护者已定完整版 · 收窄仅作降级备择） | no |
| R3 | 边界：非功能波零行为变更 · 冻结公共面（bin 消费 `../lib/cli.js`）· 每文件独立 commit 可回退 · S2 只增验收文不覆写 | no |
| R4 | `test_strategy=required`：六重锁即验收主体 + E3 等价单测 + M1 验收文留证 | no |
| R5 | **已签收**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）· 下一棒：00 逐波拆 task（10-task）→ 20-task-audit → HG-AUDIT-R1（00 代签）→ 30/40 | no |

**residual_risks**：① 模块边界归属为建议（PLAN W0.4），task 定稿可能微调（缓解：barrel 原则不变 · 锁③兜住漏符号）；② E3 下沉与 E4 同波但隔离 commit，若基线复跑发现既有 flaky 须先登记（缓解：F-W0-05）；③ 内部行为漂移无法被锁完全穷尽（缓解：607 用例 + test:lib 全链 · 漂移面已被「对外密封」事实收窄）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）| 本 SPEC 定稿 |
| HG-AUDIT-R1（W0 task） | pending | W0 30 改码前（20 审查文落盘后签） |

> **机检诚实登记**：本表位于 SPEC 档（非 task 文 `### 人工闸` 节），`parseHumanGates` 不采集 ⇒ 不可机检 · 纯人工纪律；task 拆单时须把对应闸行复制进 task 文 `### 人工闸` 表（`blocks_hats` 按需含 `30`）才受 30 判定约束（硬约束 15）。

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-16 | draft · 10-spec · 自 PLAN W0.1–W0.7 + 版本路由复裁收敛 · 行号/计数为起草轮快照待 task 复核 |
| 2026-09-16 | 10-spec 修订 · 20-spec-audit R1 advisory A1 落实（标注/登记级 · 无实质变更） |
| 2026-09-16 | signed · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）· R5 回填 |
