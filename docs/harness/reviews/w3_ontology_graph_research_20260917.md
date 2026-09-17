# 研究文 · 3.0 W3 前置 · 本体与图谱统一（ontology-driven graph unification）

> **状态**：`research-final`（W3 前置专项研究 · 决策支持档 · ONTO-OPEN 与 F1 两条裁决建议均**已批准**（2026-09-17 维护者本窗 · 原文「两条均接受00的建议」））
> **落盘日期**：2026-09-17（W3 第一步 · 硬约束 14 清偿：雏形镜像入 tracked）
> **雏形来源**：`.workbuddy/output/研究-3.0-W3-本体与图谱-OWL引入评估.md`（2026-09-15 起草轮本地件 · 被 `.gitignore:4` 忽略 · 本文继承其 10 节骨架，**全部证据改为 tracked 路径 + 行号实测**，不再引用 `.workbuddy/` 为证据）
> **探针**：`scripts/onto-probe.mts`（tracked 镜像 · 运行即 `conforms: false` / exit 2 · 输出见 §6）
> **上游**：[`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W3 节 + 硬约束 13/14 + 校核 #22/#23/#24 · [`04_w3_ontology_graph_unify_v1.md`](../../spec/3_0-architecture-leap/04_w3_ontology_graph_unify_v1.md)（SPEC · signed）
> **复核基准**：main HEAD `2b6e7c3`（2026-09-17）· 行号均为本日复核实测值（SPEC 头部 ⚠️ 块要求的「回源码复核现值」已执行：471/597/113 三数复核**不变**）

---

## 摘要（结论先行）

| # | 裁决/结论 | 性质 |
|---|----------|------|
| 1 | 三套本体实测盘点复核成立：**471 + 597 + 113 = 1181 行图谱/本体源码（+ `src/cli-graph.ts` 203 行分派面）+ 14 份仓内图谱档**，两图零共享 schema、ontology 与两者均不相连 | 实测 |
| 2 | 停更事实复核成立：图谱功能改动止于 2026-08-24~08-28；`ontology.yaml` 内容改动止于 2026-08-24（`3ce5f2e`），此后仅发版 bump | 实测（git log） |
| 3 | **本体引用完整性：3 处 `sh:class` 违规复跑实证**（`conforms: false` / exit 2）；处置建议**真修优先**（决策程序见 §6.3） | 实测（探针） |
| 4 | **`graph axioms check` 首次对抗复攻：6 组构造全部留证** —— D2 裸子串过配+漏配双中、rejected→draft 清偿路径不在公开管道内（永久红）、D3 空转恒 warn、S2 死判据恒绿；6 项全部登记**待修**（归 W3 范围⑦ 判据加固 task） | 实测（对抗构造 · 本文首次） |
| 5 | **消费侧真值用者：无**。仅 `timeline --task` / `status` 读 HGM 事件轨、CI 做 tech-graph 漂移锁步、人看 MD；无任何代码把 `graph.json` / `snapshot.json` / `ontology.yaml` 当决策真值 | 实测（grep） |
| 6 | **ONTO-OPEN 建议：3.0 判「不开放」** —— 显式登记「不提供自定义本体能力」+ 对外口径约束 + 复议触发条件（论证见 §7 · **已批准** 2026-09-17 维护者本窗） | 建议 |
| 7 | **F1 建议：做「受限形态统一」**（共享 YAML 本体作 TBox + HGM 全量适配 + tech-graph 浅登记 · 各自编译），代价复核 3 成立；若人力不足可依法走 W3-SPLIT 降级（论证见 §9 · **已批准** 2026-09-17 维护者本窗） | 建议 |
| 8 | OWL 否决（D-30-OWL-REJECT）完整论证留档：能力矩阵 + 四障碍 + 方案 A~D + SHACL 语义子集落地设计 + **3.x 复议三触发条件**（不写成「永不」） | 留档（不重议） |

---

## 1. 三套本体实测盘点（2026-09-17 复核）

| # | 资产 | 行数（实测 `wc -l`） | 随包发布 | `src/` 引用 | 真实身份 |
|---|------|------------------|---------|-------------|---------|
| ① | `src/cli-graph-hgm.ts`（HGM 事件溯源图） | **471** | ✅（lib 编译物） | ✅ `src/cli-timeline.ts:9` · `src/cli-status.ts:19` | 事件图 + 手写公理（`graph ingest` → `.coding-kit/events/*.jsonl` → `graph snapshot` → `graph/snapshot.json` · `graph axioms check` 违例 exit 2 · `src/cli-graph.ts:202`） |
| ② | `src/cli-graph-yaml.ts`（tech-graph 编译图） | **597** | ✅（lib 编译物） | ✅ `src/cli-graph.ts:3-10` | `*.graph.yaml` → MD/`graph.json` · schema id `inform_graph.v3`（`src/cli-graph-yaml.ts:6`）· 源目录缺省为**消费者仓** `docs/_tech_graph/`（`src/cli-graph.ts:77`） |
| ③ | `assets/ontology.yaml` | **113** | ✅（`package.json#files` 含 `assets`） | ❌ **零引用**（`grep -rn ontology src/` 零命中 · 2026-09-17 复跑） | **SpecWave 自身产品设计本体**（头注释自述 · `assets/ontology.yaml:1-4` · 人类真值在私仓不随包 · `product_semver` 随 bump 变 → 钉面资产而非能力 · 头注释自认「独立的 ontology-check 本包未接线」 `:4`） |
| — | 分派面 `src/cli-graph.ts` | 203 | ✅ | — | `graph` 子命令分派（注册于 `src/cli/main.ts:95-96` · W0 重构后位置，SPEC 所引 `src/cli.ts:110` 为重构前快照） |
| — | 仓内图谱档 `docs/_tech_graph/` | **14 份 tracked**（`git ls-files` 实测：5×`.graph.yaml` + 8×`.md` + `shared/graph.json`） | ❌ **不随包**（`package.json#files` 仅 `bin/lib/assets/…`） | — | 仓自用 tech-graph 实例（消费者语义示范 + CI 漂移锁步对象） |

**结构实测**：
- **HGM**：事件类型 `HgmEvent`（`src/cli-graph-hgm.ts:15-23`）；快照节点 kind ∈ `BusinessRepository / Task / HumanGate / Hat`（`:255-275`），边 type ∈ `HAS_GATE / BLOCKS`（`:269-275`）；公理 4 条 D2/D3/S2/rejected→draft（`:298-392`）。
- **tech-graph**：节点 `{id,label,kind∈flow/struct/external}`（`src/cli-graph-yaml.ts:21,80-89`），边 `{from,to,mark,type,label,anchors,sync}`（`:22-29,306-316`），编译产物 schema `graph_v2`（`:329`）。
- **ontology**：`classes` 15（`assets/ontology.yaml:10-41` · Package 域 5 + Instance 域 10）· `relations` 4（`:43-59`）· `axioms` 6（`:62-74` · 全 `ONTO-` 前缀）· `starter_hats` 4 + `extended_hats` 4（`:77-99`）· `human_gates` 4（`:101-111`）。

**三者关系**：两图各自定义节点/边词汇，**零共享 schema**；ontology 的 `classes` 与 HGM 节点 kind 存在**实质词汇重叠**（`Task / Hat / HumanGate` 三名全同，`BusinessRepository` 名同但 ontology 未声明 —— 恰是 §6 违规之一），与 tech-graph 词汇（`flow/struct/external` 表现层）**零语义重叠**。

## 2. 停更事实（git log 实证 · 2026-09-17 复跑）

| 资产 | 末次**实质**改动 | 此后改动性质 |
|------|----------------|-------------|
| `src/cli-graph-yaml.ts` | `0486583` 2026-08-28（`generated_at` 幂等化 #27）· 前序 `52a7135/011283c/ed20ca8` 2026-08-25（DEF-031~033） | `317446e` 2026-09-14 为 2.3-W7 DX 批次（非图谱功能） |
| `src/cli-graph-hgm.ts` | `5ceb119` / `ec63bef` 2026-08-24（DEF-022 / DEF-016） | `d366be8`/`ac37de7` 2026-09-09 为布局/S2 搬迁（非图谱功能）· `317446e` 2026-09-14 DX 批次 |
| `assets/ontology.yaml` | `3ce5f2e` 2026-08-24（DEF-004 对齐包现实 + ONTO- 前缀） | 其后全部历史为 `chore(release): bump` / rename（`268ca21`→`2557119` 等 8 笔 · 仅 `product_semver` 随行） |

⇒ **2026-08-28 后零功能演进（约三周）**，叠加「从未被对抗复攻」（见 §5 首段）—— SPEC §1「先研究、不可直接排期实现」的硬理由复核成立。

## 3. 最小公因子分析

### 3.1 公共语义（三者逐项对照）

| 维度 | HGM | tech-graph | ontology.yaml | 公共因子 |
|------|-----|-----------|---------------|---------|
| 节点 | `{id,label,kind,...}`（`cli-graph-hgm.ts:240-243`） | `{id,label,kind}` + 枚举校验（`cli-graph-yaml.ts:80-89`） | `classes[].{id,domain,subclasses}`（`ontology.yaml:10-41`） | **有类型的节点**（id + 分类词汇） |
| 边 | `{from,to,type,...props}`（`cli-graph-hgm.ts:244-246`） | `{from,to,mark,type,...}`（`cli-graph-yaml.ts:306-316`） | `relations[].{id,subject,object,cardinality}`（`ontology.yaml:43-59`） | **有类型的有向边**（from/to + 关系词汇） |
| 事件 | `HgmEvent` 七字段（`cli-graph-hgm.ts:15-23`） | 无（只有派生戳 `contentStamp` · `cli-graph-yaml.ts:188-191`） | 无（`axioms` 是声明式规则非事件） | **仅 HGM 有** —— 事件语义不进公因子 |
| 约束/公理 | `checkAxioms` 手写 4 条（`cli-graph-hgm.ts:335-392`） | `validateGraphYaml` 结构校验（`cli-graph-yaml.ts:53-120`） | `axioms[]` 纯文本无机检 | **都有「校验」概念、零共享机制** |

**结论**：最小公因子 = **属性图内核（typed-node + typed-directed-edge + 词汇表）**。事件溯源是 HGM 私有维度；编译/派生是 tech-graph 私有维度。

### 3.2 ontology 能否成为共同底座？——**分层答案**

- **对 HGM：能（实质重叠）**。HGM 节点 kind `Task/Hat/HumanGate/BusinessRepository` 与 ontology `classes` 名对名重叠（4/4），边 `HAS_GATE/BLOCKS` 与 `relations`（`blocks: HumanGate→Hat` · `ontology.yaml:48-51`）语义对应。ontology 可直接充当 HGM 实例词汇的 **TBox**，`graph snapshot` 产物可按 `node.kind ⊆ classes` 机检。
- **对 tech-graph：只能浅接（表现层词汇）**。其 kind `flow/struct/external`（`cli-graph-yaml.ts:87`）与边型 `depends_on/async_calls/condition/has_metadata`（`:201-267`）是**文档表现层**分类，与产品本体零语义重叠；强行塞入产品本体是臆造语义（违 PLAN 非范围「不臆造」）。
- **⇒ 统一的可行形态不是「一个 schema 管两图」，而是「一个 TBox 内核 + 两个各自适配器」**（见 §9 方案 B）。

### 3.3 方案 A/B 对比 + 迁移成本

| | 方案 A · 全量统一 | 方案 B · 受限统一（内核 TBox + 各自适配） |
|---|------------------|----------------------------------------|
| 内容 | 两图 schema 合并为一，tech-graph 词汇入产品本体 | ontology 仅作 TBox 内核（节点/边/词汇 + 命名纪律）；HGM 全量适配（kind/type ⊆ 声明）；tech-graph 浅登记（表现层词汇独立 namespace 登记 + 校验钩） |
| 语义真实性 | ❌ tech-graph 被迫臆造产品语义 | ✅ 各自词汇如实归属 |
| 对外 breaking | ❌ `graph yaml` 是公开 CLI（`src/cli/main.ts:95`），消费者自有 `*.graph.yaml` 格式被迫迁移 | ✅ tech-graph 侧**可加性**变更（词汇登记不改变 `inform_graph.v3` 读法）；HGM 侧是仓内产物，无对外面 |
| 迁移成本 | 高（两图重写 + 消费者迁移指引 + 双份真值风险期） | **中（复核 = 3）**：A4 形状种子已有（`scripts/onto-probe.mts` 40 行）；HGM 适配 ≈ 校验接线（kind 名已对齐）；tech-graph 浅登记 ≈ 词汇表 + 校验钩 |
| 双份真值风险 | 高（合并期两 schema 并存） | 低（TBox 单源 · 两图只读它） |

⇒ **方案 B 占优**；方案 A 的唯一卖点（「形式上的完全统一」）恰是其语义造假之源。细化裁决见 §9。

## 4. 消费侧盘点（grep 实证 · 2026-09-17）

**问题：有没有代码把图谱当真值用？—— 没有。**

| 消费者 | 消费对象 | 证据（tracked） | 是否「真值用」 |
|--------|---------|----------------|-------------|
| `timeline --task` | HGM 事件轨（`loadEvents`/`filterEventsForTask`/`ingestRepoIdempotent`） | `src/cli-timeline.ts:9,37-41` | 否（展示性回放 · 无匹配事件仅 WARN · `cli-timeline.ts:53-58`） |
| `status` | HGM 事件计数（`summarizeTaskHgm`） | `src/cli-status.ts:19,93` | 否（观测字段 `event_count/last_at` · 读失败回 `null` 不阻断 · `cli-graph-hgm.ts:448-458`） |
| CI `tech-graph.yml` | tech-graph 编译漂移锁步（compile → `git diff --exit-code` → `graph yaml check`） | `.github/workflows/tech-graph.yml:28-32` | 半（把 yaml 当「MD 生成的真值源」做漂移拦截 · 但不消费图语义做产品判定） |
| 人 | `docs/_tech_graph/*.md`（Mermaid + 结构化表） | `docs/_tech_graph/` 14 份 tracked | —（人读） |
| `graph axioms check` 自身 | HGM 快照+事件轨 | `src/cli-graph.ts:181-202` | 自产自销（无任何下游消费其 PASS/FAIL —— grep 无 CI/他命令调用） |
| （全无） | `graph.json` / `snapshot.json` | `grep -rn "graph\.json\|snapshot\.json" src/`：命中者全是**写方/校验方**（`cli-graph-yaml.ts` 导出与 check · `cli-graph-hgm.ts:6` 路径常量），**无一处读方做决策** | 否 |
| （全无） | `assets/ontology.yaml` | `grep -rn ontology src/` = **0 命中** | 否（纯钉面资产） |

**边界澄清（SPEC §1 要求分开陈述）**：**图能力今天已开放** —— `graph yaml compile|check|export` 与 `graph ingest|snapshot|axioms` 均为公开 CLI，源目录缺省即消费者仓 `docs/_tech_graph/`（`src/cli-graph.ts:77` 且 `--input` 可指任意目录）；**未开放的是本体层**（语义/schema 由消费者声明）。另：**包内消费者拿不到本仓图谱**（`docs/_tech_graph/` 不在 `package.json#files` · 维持现状为既定非范围）—— 统一方案的消费者面因此只到「消费者建自己的图」，不到「读 SpecWave 的图」（F-W3-05 的处置：**登记为既定约束**，统一收益落在仓内单源与消费者自建图的 schema 一致性，不落在图谱分发）。

## 5. `graph axioms check` 判据强度对抗验证（**首次复攻** · 照 2.4 方法）

**复攻史核查**：`grep checkAxioms test/` = **0 命中**（无直接单测）；既有覆盖仅 `test/cli-g1g7.test.ts:354-380`（PASS/FAIL 冒烟）与 `test/cli-json-no-abs-path.test.ts:377-381`（路径相对化）。**裸子串 / 字面连续 / 枚举顶包三类对抗构造从未被构造过** —— 图谱子系统自 2026-08 定型以来未受任何一轮判据强度复攻，本文为**首次**。

**方法**：在 `/tmp` 构造 6 组事件轨 fixture（`.coding-kit/events/2026-09.jsonl`），对每组跑 `node bin/dsh-coding-kit.js graph axioms check --target <dir>`，记录违规与 exit code（fixture 配方全文见附录 A，可机械复现）。

### 5.1 实测结果（2026-09-17 · 修复前真值面）

| # | 构造（类别） | 靶判据 | 预期语义 | **实测** | 判定 |
|---|------------|--------|---------|---------|------|
| ADV-A1 | 闸 pending 阻塞帽 `130-helper`（**裸子串过配**：含子串 `30` 但非 30 帽） | D2 | 应 PASS | **FAIL exit 2 · `[D2/error] gate … pending 且阻塞 30 帽`** | ❌ **误报**（`cli-graph-hgm.ts:346` `.includes('30')` 裸子串） |
| ADV-A2 | 闸 pending 阻塞帽 `execute-code`（**裸子串漏配**：语义即 30 帽改名/拼写漂移，不含子串 `30`） | D2 | 应 FAIL | **PASS exit 0 · violations 0** | ❌ **漏报**（同一根因） |
| ADV-B1 | 闸 rejected 后走**公开管道可达**的修复（再发 `GateStatusChanged(approved)`）· 无 `TaskStatusChanged(draft)`（**字面连续**：只认字面后继事件） | rejected→draft | 修复后应转绿 | **FAIL exit 2 · `[rejected→draft/error]` 永久红** | ❌ **清偿路径不在公开管道内**（`cli-graph-hgm.ts:317-322` 只认 `TaskStatusChanged(draft)`） |
| ADV-B2 | 同上 + **手写** `TaskStatusChanged(draft)` | rejected→draft | — | **PASS exit 0** | ⚠️ 唯一清偿手段是**管道永不产出**的事件类型（`ingestRepo` 只产 `RepositoryAdopted/TaskCreated/GateStatusChanged` · `cli-graph-hgm.ts:172-228`） |
| ADV-C1 | task `in_progress`（**枚举顶包/空转**：`CHECKED` 边在 `buildSnapshot` 无任何 case 产出） | D3 | 有 GateCheckRun 才应报 | **PASS exit 0 · 恒报 `[D3/warn]`**（warn 不咬 exit） | ❌ **空转噪声判据**（触发边型不可构造 ⇒ 凡 in_progress 必 warn · `cli-graph-hgm.ts:357-371`） |
| ADV-C2 | 手写 sync 事件 touch S2 路径 `docs/tasks/…`（**枚举顶包/死判据**：`SYNCED` 边在 `buildSnapshot` 无任何 case 产出） | S2 | 应 FAIL exit 2 | **PASS exit 0 · violations 0** | ❌ **死判据恒绿**（违规路径不可构造 · `cli-graph-hgm.ts:373-387`） |

### 5.2 根因归簇（全部指向同一结构缺陷）

`buildSnapshot`（`cli-graph-hgm.ts:251-285`）只认 4 种事件、只产 2 种边；而 `checkAxioms` 的 4 条公理依赖 **6 种事件/边型**（多出 `HumanGateRejected` 的后续 `TaskStatusChanged`、`CHECKED` 边、`SYNCED` 边）——**公理的语义面超出快照的构造面**：S2/D3 因此不可触发（恒绿/恒 warn 空转），rejected→draft 因此不可清偿（恒红），D2 虽可触发但判据是裸子串（过配+漏配双中）。

### 5.3 处置登记（本棒不修码 · 归 W3 范围⑦ 判据加固 task 的 30）

| 项 | 建议 | 严重度 |
|----|------|-------|
| ADV-A1/A2（D2 裸子串） | **必修**：`hat_id` 改结构化等值（对 `blocks_hats` 元素与已声明帽精确匹配，或以段边界切分后等值判 `30`），负向 fixture = 本构造 A1/A2 | error 级误判/漏判 · 真值正确性 |
| ADV-B1/B2（rejected→draft 不可清偿） | **二选一**：(i) ingest 产 `TaskStatusChanged(draft)` 事件（task markdown 状态回 draft 时），清偿入公开管道；(ii) 公理降级为 warn 并登记设计性残留。**不得维持现状**（error 级永久红 = 一次 rejected 终身 exit 2） | 可用性阻断 |
| ADV-C1（D3 空转） | **移除或接真**：要么删除该公理，要么让 `graph ingest` 真实消费 GateCheckRun 记录产 `CHECKED` 边（接 `verify`/`gate-check` 执行证据 · 与 W6 G7 有协同） | 噪声 |
| ADV-C2（S2 死判据） | **移除或接真**：要么删除，要么定义 sync 事件来源（harness-sync 执行轨）并产 `SYNCED` 边 | 假安全感（恒绿的「S2 保护」叙事不得在对外口径中声称） |

> 以上即 SPEC 验收 3「三类对抗构造修复前真红、修复后转绿（或明确登记为设计性残留）」的**修复前真值面留证**；转绿验证归判据加固 task。

## 6. 本体引用完整性复核（探针重跑实证）

### 6.1 复跑（2026-09-17 · tracked 探针）

```
$ node scripts/onto-probe.mts
形状数: 4 · 校验对象: ontology.yaml
实体: classes=15 relations=4 axioms=6 gates=4
conforms: false
  [VIOLATION] RelationShape @ relations[0].subject :: sh:class 违反 —— 未声明的类: DisciplinePackage
  [VIOLATION] RelationShape @ relations[0].object  :: sh:class 违反 —— 未声明的类: BusinessRepository
  [VIOLATION] RelationShape @ relations[3].object  :: sh:class 违反 —— 未声明的类: TraceArtifact
exit=2
```

**违规数 = 3 · 复跑确认**（与起草轮一致）。源码直读复核：`assets/ontology.yaml:44-46`（`embedsInto: DisciplinePackage→BusinessRepository` 两端悬空）· `:56-58`（`produces: Hat→TraceArtifact` 客体悬空）；`classes` 15 项（`:10-41`）确不含此三类。探针与 `.workbuddy` 原件逐行 diff：校验逻辑全同（仅文件头注释更新为 tracked 口径）。

### 6.2 违规语义分析（决定处置方向的事实）

| 悬空类 | 语义实证 | 处置倾向 |
|--------|---------|---------|
| `BusinessRepository` | **HGM 真实在用**：`buildSnapshot` 把 `RepositoryAdopted` 主体建成 kind=`BusinessRepository` 节点（`cli-graph-hgm.ts:255`）——该类在代码里有活实例 | **补声明**（且此举把 ontology 与 HGM 词汇正式连通 · 与 §9 F1 协同） |
| `DisciplinePackage` | 产品自指（纪律包嵌入业务仓 · `embedsInto` 关系语义自明）；`classes` 中 Package 域 5 类恰是其内涵 | **补声明** |
| `TraceArtifact` | `produces: Hat→TraceArtifact` 客体；既有 `AuditReview/InformArtifact/ConstrainArtifact/VerifyArtifact`（`ontology.yaml:34-41`）疑为其裁剪后残片——**私仓真值 `DESIGN_ONTOLOGY_v1_zh.md` 不随包，本棒不可达** | **决策程序**：与私仓对账 —— 若 `TraceArtifact` 是伞类则补声明；若裁剪时已被四个 Artifact 类取代则把 `produces.object` 改指既有类。**对账前不得二选一** |

### 6.3 处置建议（留痕二选一 · F-W3-04）

**建议：真修优先**。三条类中两条（`BusinessRepository/DisciplinePackage`）有仓内实证可直接补声明；`TraceArtifact` 按 §6.2 决策程序先对账。**仅当私仓对账证明三处皆为设计性裁剪时**，才走「显式登记设计性裁剪豁免」（豁免登记须落 `ontology.yaml` 头注释 + A4 校验器豁免清单 · 不得静默放过）。无论哪条路，SPEC 验收 6「接线前 3 处 / 接线后 0 处」均须留痕。

## 7. ONTO-OPEN 裁决建议（**已批准**（2026-09-17 维护者本窗 · 原文「两条均接受00的建议」））

**问题**（校核 #22）：本体是「SpecWave 自用元模型」（现状），还是「可被消费者/宿主扩展的底座」？

### 7.1 事实面（本文 §1/§4 实测）

- `ontology.yaml` 是 **SpecWave 自身产品设计本体**（头注释自述 `:1-4` · classes 全为自有概念 · 人类真值在私仓不随包 · `product_semver` 随 bump 变 = 钉面资产）；`src/` 零引用。
- **图能力已开放、本体层未开放**（§4 边界澄清）—— 消费者**今天已能**在自己仓建自己的图；缺的只是「消费者声明自己的语义/schema」。
- **零消费者实证**：没有任何代码（仓内或可推断的仓外）消费本体语义做判定（§4）；开放本体层的收益属**假设性**（与 OWL 障碍④同构）。

### 7.2 两方案论证

| | 开放（仅 L-C 约束层 + L-I 实例层 · L-T 自有） | 不开放（显式登记） |
|---|---------------------------------------------|-------------------|
| 内容 | 消费者可写自己的形状（L-C）与领域实例（L-I）；L-T 产品本体保持 SpecWave 自有（防消费者改产品语义 ⇒ 门禁不可信） | 登记「不提供自定义本体能力」+ 约束对外文案（不得暗示） |
| 实施成本 | 中：须定义消费者形状 schema + 校验器开放面 + 编译路径 + 文档 + 长期兼容承诺 | **零**（F-W3-03） |
| 收益 | 假设性（无消费者提出需求 · 2026-09-15 用户提问是「是否该做」而非「我要用」） | 消除口径模糊（校核 #22 的「不得留空」以显式登记满足） |
| 风险 | 开放即承诺：schema 一旦公开即成兼容面，无消费者也要维护；与「无消费者不做形式化」（OWL 障碍④）的裁决逻辑自相矛盾 | 未来真出现需求须复议（但复议成本 = 一次裁决 + 当时再实施，无沉没） |

### 7.3 建议：**3.0 判「不开放」**（**已批准**（2026-09-17 维护者本窗 · 原文「两条均接受00的建议」））

> **建议结论：ONTO-OPEN = 不开放** · **已批准**（2026-09-17 维护者本窗 · 原文「两条均接受00的建议」）。本体维持「SpecWave 自用元模型」定位；对外显式登记「不提供自定义本体能力」并约束文案（README/docs 不得出现「可扩展本体/自定义 schema」类暗示）；**图能力已开放**的口径保持不变（消费者自建图 ≠ 自定义本体，两者分开陈述）。
> **复议触发条件**（任一 + 走 `HG-SCHEMA-CHANGE` 式人闸）：① 出现**真实消费者请求**（issue/使用证据，非假设）；② W3 图谱统一落地且 A4 校验器稳定一个 minor 后重估开放面；③ 宿主/插件生态（B5 之后）出现对本体的拉取需求。
> 若 00/维护者改判「开放」：则按 SPEC 范围⑥ 执行 —— **只开放 L-C 约束层与 L-I 实例层，L-T 产品本体保持自有**，不预置/不臆造消费者领域本体内容。

## 8. OWL 否决完整论证（D-30-OWL-REJECT 留档 · 不重议）

> 裁决已于 2026-09-15 锤定（PLAN W3 裁决块 · SPEC §1）；本节留全档：能力矩阵 + 四障碍 + 方案 A~D + 落地设计 + 3.x 复议触发条件。**不得写成「永不」。**

### 8.1 能力矩阵（SpecWave 真实需求 × OWL 表达能力）

| SpecWave 需求 | 实例（tracked 出处） | OWL | 实际所需机制 |
|--------------|--------------------|-----|-------------|
| 概念分层 | `Track ⊐ GraphTrack…`（`ontology.yaml:11-13`） | ✅ 强项 | 类层次 |
| 关系与基数 | `produces: Hat→TraceArtifact 0..*`（`ontology.yaml:56-59`） | ✅ 强项 | 属性 + 基数 |
| **引用完整性** | 关系端点须 ∈ 已声明类（§6 实测 3 处违规） | ❌ **表达不出**（OWA） | CWA `sh:class` 校验 |
| **存在性门禁** | 缺审查文 → BLOCKED（全部 P0 门禁同型） | ❌ **表达不出** | CWA `sh:minCount 1` |
| 闭词表/枚举 | `hat_id ∈ {10-task,…}`（`ontology.yaml:77-99`） | 🔶 `owl:oneOf` 语义是推理非校验 | `sh:in` |
| 字符串模式 | `^ONTO-[A-Z0-9]+$`（`ontology.yaml:62-74`） | ❌ | `sh:pattern` |
| 跨域规则 | sync 不得覆盖 S2（`cli-graph-hgm.ts:373-387`） | ❌ | 自定义规则 + `isS2RelPath` |
| 一致性推理 | 「推出隐含事实」 | ✅ OWL 独有价值 | DL 推理机 —— **无消费者**（§4） |

**判读**：SpecWave 今天需要的几乎全是右列（CWA 校验）；OWL 的独有价值（推理）**没有消费者**（§4 实测）。补充事实：**仓内已有「事实上的 SHACL」** —— `checkAxioms` 返回 `{axiom,severity,message,node}`（`cli-graph-hgm.ts:338`）与 SHACL `ValidationResult`（focusNode/resultMessage/resultSeverity）同构；缺口不是「没有 OWL」，而是已有机制无统一 schema、未覆盖本体层、未被消费。

### 8.2 四道硬障碍（任一单独即可否决）

1. **OWA↔CWA 语义根本冲突（决定性 · 非工具成熟度）**：OWL 开放世界「没写 ≠ 不存在」；SpecWave 每条门禁（结论闸/pins/S2 保护/HG 闸）都是封闭世界「缺失即违规」。「必须存在审查文」在 OWL 里**表达不出来**。§6 探针即**可运行反证**：同一文件，CWA 校验报 3 处违规 exit 2，OWA 判定「不报错 —— 未声明的类只是未知」（`scripts/onto-probe.mts` 对照组输出）。
2. **许可障碍**：npm 唯一 OWL-DL 推理机 `rdf-reasoner-konclude`（Konclude→WASM · SROIQ · 2026-05 发布）= **LGPL-3.0-or-later + v0.1.0**（wrapper 与 wasm 均 LGPLv3 · 单一作者）—— MIT 包不可捆，成熟度不足以担 failClosed 门禁。
3. **依赖爆炸**：标准 SHACL 实现 `shacl-engine`（MIT）= 11 直接 → **408 传递依赖**；本项目基线 **2 个非 dev 依赖**（`argparse` + `js-yaml` · 2026-09-17 复核实测 `package-lock.json`）⇒ 约 **200×**，与「零装配、离线可用」定位正面冲突。
4. **无消费者**：§4 实测无任何代码把图谱/本体当真值用 ⇒ 推理是**确定成本 vs 假设收益**。

### 8.3 方案 A~D 对比

| 方案 | 内容 | 新依赖 | 许可 | 能过门禁 | 裁决 |
|------|------|-------|------|---------|------|
| A · 全量 OWL | 本体改写 OWL/Turtle + DL 推理机门禁 | +1 大件（wasm） | ⚠️ LGPL-3.0 | ❌ 语义错配 | ❌ 否决 |
| B · 标准 SHACL | YAML→RDF + `shacl-engine` | +408 | ✅ MIT | ✅ | ❌ 3.0 否决（可 3.x 复议） |
| **C · 轻量自有本体层** | 借 OWL 分层 + SHACL CWA 语义子集，自研零依赖校验器；内部真值仍 YAML | **0** | ✅ 自有 | ✅ | ✅ **采纳（D-30-OWL-REJECT）** |
| D · 只文档化 | 本体只当文档不接校验 | 0 | — | ❌ | ❌ 不足以兑现 A4 |

### 8.4 SHACL 语义子集落地设计（A4 实现口径 · 已定）

- **三层模型（借 OWL 分层不借推理）**：L-T 术语层（TBox · `classes/relations` · SpecWave 自有）· L-C 约束层（SHACL 形状 · 存在性/基数/闭词表/模式/严重度）· L-I 实例层（ABox · 消费者仓实例 · 仅当 §7 改判开放才涉及）。
- **形状集**：`targetClass / minCount / maxCount / class / datatype / pattern / in / severity(Violation·Warning·Info)` + 机读报告；**零新依赖（仅既有 `js-yaml` · `package.json` 实测单依赖）**；CWA 语义（缺失即红 · 与门禁同假设）。
- **首批形状种子已备好且一接线即真红**：`scripts/onto-probe.mts` 四形状（ClassShape / RelationShape / AxiomShape / GateShape）· 实测 3 处违规（§6）。建议增补 `VersionShape`（`product_semver ↔ package.json#version` · **Warning**）—— 注意与既有 pin 机制**单源**划界，不得双份真值。
- **一致性承诺边界**：只声称「SHACL **语义子集**的忠实实现」+ 显式 profile 声明 + 与标准实现的对照 fixture；**对外不得声称 W3C 一致性**（硬约束 13 · F-W3-06）。
- **OWL/Turtle 仅作「可导出」留白**：ID 采用稳定 IRI 友好命名空间（如 `spec-wave:` 前缀）；**不实现导出器**（非范围）。

### 8.5 3.x 复议触发条件（**三条同时满足** + 走 `HG-SCHEMA-CHANGE` 式人闸）

1. 出现**外部消费者**：需要把 SpecWave 本体导入 Protégé / 三元组库 / SPARQL 端点；
2. 出现**跨组织交换**需求（与第三方知识图谱对齐 · OWL 上下游对接）；
3. 届时**重新评估许可与依赖**（LGPL 推理机 / 408 依赖 SHACL 实现 / 或自研 Turtle 序列化器 —— 后者只做写出不做推理，成本最低）。

在此之前：只留「可导出」设计留白。本裁决**不是「永不」**——OWL 的价值（推理 + 开放世界互操作）在真出现时再引入才是对的时机；现在引入得到的是「OWL 的复杂度 + 我们的语义错配」两个世界的缺点。

## 9. F1 统一 vs 降级裁决建议（**已批准**（2026-09-17 维护者本窗 · 原文「两条均接受00的建议」））

### 9.1 候选

- **候选一 · 统一（受限形态）**：按 §3.3 方案 B —— ontology 作 TBox 内核；**HGM 全量适配**（`node.kind ⊆ classes` · `edge.type ⊆ relations` · 与 §6 `BusinessRepository` 补声明同源协同）；**tech-graph 浅登记**（表现层词汇 `flow/struct/external` + 4 边型入独立 namespace 登记 + 校验钩 · 不改 `inform_graph.v3` 读法 · 对公开 CLI 零 breaking）；各自编译保留；单源校验（两图只读同一 TBox，不产生双份真值）。
- **候选二 · 降级 3.x（W3-SPLIT）**：本波只交 A4（ontology-check 接线）+ F2（真口径）+ 判据加固（§5.3）；统一显式降级并留痕。

### 9.2 论证

| 维度 | 分析 |
|------|------|
| 价值 | 统一的真价值不在「形式合并」，在**消灭三处词汇漂移面**：① HGM kind 与 ontology classes 已实质重叠但无约束（§3.2）——不接线则漂移不可见；② §6 的 `BusinessRepository` 补声明天然就是 HGM 适配的一半；③ tech-graph 浅登记把「表现层词汇」从隐式枚举（`cli-graph-yaml.ts:87` 硬编码）变为显式登记。 |
| 代价 | 复核 **3 成立**（不引 OWL 后已砍 RDF 化/推理对齐/三元组库三项）：A4 种子 40 行已有；HGM 适配 ≈ 校验接线 + fixture；tech-graph 浅登记 ≈ 词汇表 + 校验钩；无对外 breaking（§3.3）。 |
| 风险 | §4 实测零真值消费者 ⇒ 统一收益是**内部一致性**而非消费者价值 —— 这是降级派的最强论据；但 A4 本身（接线即真红 + §5 判据加固）已使本波必然触碰本体校验面，**增量做 HGM 适配的边际成本低、协同高**（同一份 TBox、同一次 fixture 工程）。 |
| 降级合法性 | SPEC §5.3 / F-W3-02 明示允许 · 不得为凑范围硬做 —— 降级是**合法选项**，不是失败。 |

### 9.3 建议：**做候选一（受限形态统一）**，代价复核 3 维持（**已批准**（2026-09-17 维护者本窗 · 原文「两条均接受00的建议」））

> **建议结论：F1 = 统一（受限形态）** · **已批准**（2026-09-17 维护者本窗 · 原文「两条均接受00的建议」），边界 = 「ontology 作 TBox + HGM 全量适配 + tech-graph 浅登记 + 各自编译 + 单源校验」；**tech-graph 词汇不入产品本体**（防臆造语义）。理由：① 与 A4/§6 修复同源协同，边际成本低；② 对公开 CLI 零 breaking（可加性）；③ 消灭真实词汇漂移面。**若 00 复核人力不足**：依法走 W3-SPLIT，本波只交 A4 + F2 + 判据加固，统一降级 3.x 留痕 —— 该路径已获 SPEC 预授权，不算范围违约。

## 10. 证据出处（全部 tracked · 2026-09-17 复核）

**源码与资产**
- `assets/ontology.yaml`（113 行 · 结构 `:10-111` · 违规点 `:44-46,:56-58` · 身份自述 `:1-4`）
- `src/cli-graph-hgm.ts`（471 行 · 事件 `:15-23` · 快照 `:237-296` · 公理 `:298-392` · D2 裸子串 `:346`）
- `src/cli-graph-yaml.ts`（597 行 · schema `:6` · 校验 `:53-120` · 编译 `:278-336` · check `:544-597`）
- `src/cli-graph.ts`（203 行 · 缺省源目录 `:77` · axioms exit 2 `:202`）· `src/cli/main.ts:95-96`（graph 注册）
- 消费侧：`src/cli-timeline.ts:9,37-41` · `src/cli-status.ts:19,93` · `.github/workflows/tech-graph.yml:28-32`
- 依赖基线：`package.json`（`dependencies` = `js-yaml` 单依赖 · `files` 不含 `docs/`）· `package-lock.json`（非 dev = 2：`argparse` · `js-yaml`）
- 图谱档：`docs/_tech_graph/` 14 份 tracked（`git ls-files` 实测）
- 探针：`scripts/onto-probe.mts`（`node scripts/onto-probe.mts` → `conforms: false` / exit 2 · 输出全文见 §6.1）
- 测试史核查：`test/cli-g1g7.test.ts:354-380` · `test/cli-json-no-abs-path.test.ts:377-381`（`grep checkAxioms test/` = 0）

**git 实证**（`git log --date=short` · 2026-09-17 复跑 · 命令与结果见 §2 表）
- 停更：`0486583`(2026-08-28) · `5ceb119`/`ec63bef`/`3ce5f2e`(2026-08-24) 后零功能演进
- `.gitignore:4`：`.workbuddy/` 整体忽略（`git check-ignore -v` 实测命中）—— 本文即硬约束 14 的清偿落点

**对抗验证**：§5 全部 6 组构造的 fixture 配方与运行命令见附录 A（可机械复现 · 仓外 `/tmp` 靶场，零仓内写痕）

**上游文档**
- `docs/roadmap/PLAN_3_0_architecture_leap_v1_zh.md`（W3 节 · 硬约束 13/14 · 校核 #22/#23/#24）
- `docs/spec/3_0-architecture-leap/04_w3_ontology_graph_unify_v1.md`（signed · 范围①–⑦ · 验收 1–9）

**外部核实**（2026-09-15 起草轮 · 转述自雏形 · 非本文新测）
- `rdf-reasoner-konclude` 0.1.0（npm 首个 OWL-DL wasm 推理机 · LGPL-3.0-or-later）· `shacl-engine`（MIT · 11 直接/408 传递依赖）· OWL=OWA / SHACL=CWA 语义对照（W3C 生态共识）

---

## 附录 A · 对抗 fixture 配方（§5 机械复现）

> 靶场：`/tmp/w3_axioms_adv/<case>/.coding-kit/events/2026-09.jsonl`（每行一个 `HgmEvent` JSON：`event_id/occurred_at/actor/source` + 下列 `type/subject/data`）。运行：`node bin/dsh-coding-kit.js graph axioms check --target /tmp/w3_axioms_adv/<case>`。

| case | 事件行（type / subject / data 要点） | 实测 |
|------|--------------------------------------|------|
| a1 | `GateStatusChanged` · `gate:t1:HG-X` · `{new_status:"pending", task_slug:"t1", human_gate_id:"HG-X", blocks_hats:["130-helper"]}` | FAIL exit 2（D2 误报） |
| a2 | 同 a1 但 `blocks_hats:["execute-code"]` | PASS exit 0（D2 漏报） |
| b1 | ① `GateStatusChanged` · `gate:t1:HG-AUDIT-R1` · `new_status:"rejected"` ② 同 subject `new_status:"approved"`（次日） | FAIL exit 2（永久红） |
| b2 | b1 + 手写 `TaskStatusChanged` · `task:t1` · `{task_slug:"t1", new_status:"draft"}` | PASS exit 0 |
| c1 | `TaskCreated` · `task:t1` · `{task_slug:"t1", status:"in_progress", …}` | PASS exit 0 · 恒 `[D3/warn]` |
| c2 | `SyncApplied` · `repo:x` · `{files_touched:["docs/tasks/active/task_t1.md"]}` | PASS exit 0（S2 死判据） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-17 | 正式版落盘（tracked）· 继承 `.workbuddy` 雏形 10 节骨架 · 全部证据改 tracked 路径+行号实测 · 新增：§5 axioms 首次对抗复攻（6 构造）· §6 探针复跑 · §7 ONTO-OPEN 建议（不开放）· §9 F1 建议（受限统一）· 两条裁决建议均**待 00/维护者批准** |
| 2026-09-17 | 双裁决回填（**标注级 · 结论一字未动**）：ONTO-OPEN = 不开放 · F1 = 受限形态统一 —— 两条均**已批准**（2026-09-17 维护者本窗 · 原文「两条均接受00的建议」）（00 传达）· 头部状态行 / 摘要 6~7 / §7·§7.3 / §9·§9.3 标题导语的「待批准」标记同步回填 |
