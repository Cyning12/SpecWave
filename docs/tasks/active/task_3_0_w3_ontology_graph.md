# Task：3.0 W3 · 本体驱动的图谱统一（A4 ontology-check 接线 + F2 真口径 + 判据加固 + F1 受限形态统一）

> **状态**：`active`（2026-09-17 10-task 起草 · **HG-TASK-DRAFT / HG-AUDIT-R1 双 approved**（00 代签 · 授权真值：维护者本窗「授权00代签」）· 20-task-audit R1 **PASS-with-issues**（blocking 0 · advisory A1–A4 · A2 已搭车修 · A3/A4 带入 30 执行登记）· **30 可开工**）  
> **SPEC 真值**：[`docs/spec/3_0-architecture-leap/04_w3_ontology_graph_unify_v1.md`](../../spec/3_0-architecture-leap/04_w3_ontology_graph_unify_v1.md)（signed · HG-SPEC-SIGNOFF=approved · 范围 ①–⑦ · 验收 1–9 · F-W3-01–07）  
> **研究真值（双裁决已批准）**：[`docs/harness/reviews/w3_ontology_graph_research_20260917.md`](../../harness/reviews/w3_ontology_graph_research_20260917.md)（research-final · 2026-09-17 维护者本窗「两条均接受00的建议」—— **ONTO-OPEN = 不开放**（显式登记 + 三条复议触发 · §7）· **F1 = 受限形态统一**（ontology 作 TBox 内核 + HGM 全量适配 + tech-graph 浅登记 · 各自编译 · 公开 CLI 零 breaking · §9））  
> **上游 PLAN**：[`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W3 节（:237-257）+ 硬约束 **3**（schema 变更人闸）/ **13**（本体层零运行时依赖 · 不得声称 W3C 一致性）/ **14**（证据必须入库）/ **15**（闸不落表即虚设）  
> **前置已兑现**：W2 done（[`task_3_0_w2_gates_in_hosts.md`](../done/task_3_0_w2_gates_in_hosts.md) · 锁终态 726/140/725 pass/0 fail/1 skip）· 研究文落盘 + 探针 `scripts/onto-probe.mts` 入库（硬约束 14 清偿 · SPEC 头部 ✅ 注记 · 验收 #8 项已销）  
> **基线（2026-09-17 本棒复跑实测 · 详见「开工基线」节）**：HEAD `fb280df` · npm test **726 tests / 140 suites / 725 pass / 0 fail / 1 skip** · typecheck 0 错 · pins **17/17** · 探针复跑 `conforms: false` / exit 2（3 处 sh:class 违规在案）· lock 非 dev 依赖 **2**（argparse + js-yaml）  
> **行号口径**：本 task 全部行号为 2026-09-17 本棒实读现值（HEAD `fb280df` · SPEC 头部行号快照已按 SPEC 自身条款回源码复核）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-w3-ontology-graph` |
| **test_strategy** | `required` |
| **test_strategy_note** | 验收主体 = 机械锁全绿：ontology-check 双向 fixture（漂移报红 exit 2 点名形状 / 合规报绿 exit 0 · --json 键集钉死）+ 引用完整性接线前 3 处/接线后 0 处留痕 + axioms 六构造对抗 fixture（附录 A 配方机械复现 · 逐条转绿或设计性残留登记）+ F2 机检一致（--json deep-equal + 消费者资产优先 fixture）+ F1 单源（HGM 实例校验 PASS + tech-graph 恒等 fixture + 词汇单源 grep 断言）+ ONTO-OPEN 文案正负 grep + 零新依赖证明 + pins 17/17；新行为一律**红测先行**（负 fixture 先红后绿） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 改的是图谱**校验面**（ontology-check / HGM 实例校验 / tech-graph 词汇登记档）与 `assets/ontology.yaml` 内容修复；`docs/_tech_graph/` 14 份仓内图谱档零触碰 · 不改 `inform_graph.v3` 读法 · HGM 快照/事件格式零变更 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 无规范增量；ONTO-OPEN 登记落 README 口径节与 ontology.yaml 头注释（文案面非规范面）· 晋升与否归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-16 维护者本窗签收 PLAN_3_0（上行继承 · 3.0 双签之一） |
| HG-SPEC-SIGNOFF | approved | — | 人 · 2026-09-16 维护者本窗签收 3.0 SPEC 系列（同时授权 00 代签后续过程文档闸 · HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗「授权00代签」· task lint PASS |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗「授权00代签」· 依据审查文 [`docs/harness/reviews/task_3_0_w3_ontology_graph_audit_R1_20260917.md`](../../harness/reviews/task_3_0_w3_ontology_graph_audit_R1_20260917.md)（R1 · PASS-with-issues · blocking 0 · advisory A1–A4 · A2 已搭车修 · A1 注记 · A3/A4 带入 30 执行要求） |

> **闸行裁决（留 20-task-audit 复核）：W3 不设 HG-SCHEMA-CHANGE 行**。理由四条：① 硬约束 3 的闸对象 = schema（**结构格式**）变更 —— 本波对 `assets/ontology.yaml` 的 YAML 结构（`classes/relations/axioms/starter_hats/extended_hats/human_gates` 键形态与字段集）**零变更**，补声明是在既有列表结构内增数据行（类比 W2 闸行裁决②：按已批准 schema 写**数据**非格式变更）；② 性质 = **缺陷修复**非 schema 演进 —— 校核 #24 登记为 P2 缺陷（随包资产引用完整性已破），SPEC §3-③ 明示「真修（补齐声明）」为既定处置选项、验收 6 硬要求「接线后 0 处」，修复属 task 范围内既定动作；③ F1 适配的 `hasGate` 关系补声明与 `BusinessRepository` 类补声明同源 —— 是**把代码里已活用的词汇追认登记进 TBox**（`cli-graph-hgm.ts:255` BusinessRepository 活实例 · `:269` HAS_GATE 活边型在先），登记追认现实非创造新语义；④ tech-graph 浅登记落**新档** `assets/tech-graph-vocab.yaml`（新 artifact 自有格式 · `version: "1"` 自描述 · 类比 W2 闸行裁决③ catalog.yaml · 历史上新 artifact 自有格式从未触发 schema 闸）。**升级条款（30 执行期 STOP 通道）**：若 TraceArtifact 对账结论超出「补声明 / 改指既有类」二选一（如需新建带 subclasses 层级的伞类、改类层次、改 relations 基数语义），或执行期发现须**删除/改名**既有类或关系（语义面 breaking）→ **STOP**，先评审文 → 走 HG-SCHEMA-CHANGE 式人闸 → 才改码（硬约束 3）。

---

## 背景与目标

**研究已闭环、裁决已批准（本 task 不重议）**：W3 前置研究文（research-final）完成三套本体实测盘点（471 + 597 + 113 行 + 203 行分派面）、消费侧盘点（**零真值消费者**）、`graph axioms check` **首次对抗复攻**（6 构造全部留证 · §5）、引用完整性 3 处违规复跑（§6）、OWL 否决全档（§8 · D-30-OWL-REJECT 不重议）。2026-09-17 维护者本窗批准双裁决：**ONTO-OPEN = 不开放**（§7 · 显式登记 + 复议三触发）· **F1 = 受限形态统一**（§9 候选一 · TBox 内核 + HGM 全量适配 + tech-graph 浅登记 · 各自编译 · 零 breaking）。W3-SPLIT 降级路径（F-W3-02）**不启用**。

**四块实施面**（SPEC §3 范围 ②–⑦ 对照 · 范围①研究文已销）：

1. **A4 ontology-check 接线**（范围②）：`assets/ontology.yaml` 从声明变为可机检真值 —— 自研 SHACL 语义子集校验器（零新依赖仅 `js-yaml` · 硬约束 13）+ CLI 子命令 + 探针四形状种子转正 + VersionShape（Warning · 与 pin-03 单源划界）。
2. **引用完整性修复（接线即真红 · 处置=真修优先）**（范围③）：`relations[0]` embedsInto 两端 `DisciplinePackage`/`BusinessRepository` 未声明 + `relations[3]` produces 客体 `TraceArtifact` 未声明 —— 前两者有仓内实证直接补声明；**TraceArtifact 须先与私仓 DESIGN_ONTOLOGY 对账**（硬步骤 S4.2 · F-W3-08）。
3. **F2 真口径**（范围⑤）：`discipline show` / `lifecycle show` 改读消费者资产（O3 真口径替代自述口径）· 输出与 `discipline-coverage.yaml` 逐项一致（机检断言）。
4. **判据加固**（范围⑦）：研究文 §5.3 登记六项 —— D2 裸子串双中（过配+漏配）· rejected→draft 永久红（清偿路径不在公开管道）· D3 空转（CHECKED 边不可构造）· S2 死判据（SYNCED 边不可构造）—— 逐条「修复前真红/修复后转绿」负向 fixture 或**显式设计性残留登记**。
5. **F1 受限统一**（范围④）：ontology 作 TBox 内核 · HGM 全量适配（node.kind ⊆ classes · edge.type ⊆ relations）· tech-graph 浅登记（`flow/struct/external` + 4 边型入独立 namespace 登记档 + 校验钩 · 零 breaking）· 单源校验（两图只读同一 TBox/登记档 · 不产生双份真值）。
6. **ONTO-OPEN 不开放登记**（F-W3-03 口径落地）：显式登记「不提供自定义本体能力」+ 对外文案约束（无「可扩展本体」暗示 · grep 负向断言机检）。

---

## 开工基线（2026-09-17 本棒复跑实测 · 验收比对的唯一基准）

> 30 开工时若复跑结果与本表不符，按 F-W0-05 同式纪律处置（以复跑实测重建基线并登记 · 不得沿用旧数字强行比对）。

| 项 | 实测值 | 备注 |
|----|--------|------|
| git HEAD | `fb280df` | 工作区 clean（本棒交付 = 本 task 文件一件 · untracked）· 其上 `2b6e7c3` = W2 归档 |
| `npm test` | **726 tests / 140 suites / 725 pass / 0 fail / 1 skip** | duration ≈94s · 与 W2 锁终态逐字一致（复跑确认） |
| `npm run typecheck` | **0 错** | strict + noUncheckedIndexedAccess |
| `node bin/specgate.js pins check` | **17/17 PASS** | 含 pin-03（ontology product_semver ↔ package version · `release-pins.yaml:27-32`）· pin-04（discipline-coverage as_of · `:33-38`） |
| 探针复跑 | `node scripts/onto-probe.mts` → `conforms: false` · 3 处 VIOLATION · **exit 2** | 本棒复跑逐字确认（DisciplinePackage / BusinessRepository / TraceArtifact）· 即「接线前 3 处」真值面留证（研究文 §6.1 同值） |
| 依赖基线 | `package.json` dependencies = **仅 `js-yaml`** · lock 非 dev 顶层 = **2**（`argparse` · `js-yaml`） | 验收 #7 零新依赖证明的比对照 |
| 图谱源码体量复核 | `cli-graph-hgm.ts` **471** · `cli-graph-yaml.ts` **597** · `ontology.yaml` **113** · `cli-graph.ts` **203** | 与研究文 §1/SPEC ⚠️ 快照逐字一致（复核不变） |
| 既有 axioms 测试面 | `test/cli-g1g7.test.ts:354-380`（PASS/FAIL 冒烟）· `test/cli-json-no-abs-path.test.ts:377-381`（路径相对化）· `grep checkAxioms test/` = 0 | 判据加固不得破既有两面；新增对抗 fixture 独立成件 |

---

## W3 实现规格（10-task 定稿 · 30 按此实施）

### S4.1 A4 ontology-check 接线（范围② · 研究文 §8.4 口径已定）

- **CLI 定名**：`graph ontology check [--file PATH] [--json]`（挂 `cmdGraph` 分派 · `cli-graph.ts:19-52` 增 `ontology` 子命令分支 · help 文案同步 :21-31）。**命名理由**：与既有 `graph axioms check` / `graph yaml check` 同构（`graph <域> check` 三段式），避免新顶命令；`--file` 缺省 = 包内 `assets/ontology.yaml`（packageRoot 解析 · 同 `cli-lifecycle.ts:36-38` assetsHarnessFile 口径），`--file` 显式给出则校验该文件（负向 fixture 与消费者自查共用入口 · **非**本体开放 —— 校验器开放 ≠ 本体内容开放，ONTO-OPEN 口径见 S4.6）。
- **校验器**（新 src 模块 · 命名 30 裁决 · 建议 `src/cli-graph-ontology.ts`）：SHACL 语义子集 CWA 校验 —— 形状原语 `targetClass / minCount / maxCount / class / datatype / pattern / in / severity(Violation·Warning·Info)` + **机读报告**（`--json` 键集 `{command, ontology, profile, shapes, entities, conforms, violations:[{shape, where, message, severity}]}` · 30 定稿后以 cli-flags 键集 fixture 钉死）。**零新依赖**（仅既有 `js-yaml` 经 `src/yaml.ts` yamlLoad · 硬约束 13）。
- **首批形状 = 探针四形状种子转正 + VersionShape**（探针 `onto-probe.mts:29-58` 逻辑迁入 src · 探针脚本本体保留为研究证据不删）：
  1. **ClassShape**：`classes[].id` 存在且唯一（minCount + 唯一性）。
  2. **RelationShape**：`relations[].subject/object ⊆ classes[].id`（sh:class 类比 · CWA 引用完整性）+ `cardinality` 模式 `^\d+\.\.(\d+|\*)$|^\d+$`（sh:pattern）。
  3. **AxiomShape**：`axioms[].id` 匹配 `^ONTO-[A-Z0-9]+$`（闭命名空间）+ `text` 必填（minCount）。
  4. **GateShape**：`human_gates[].blocks_hats ⊆ starter_hats ∪ extended_hats 的 hat_id`（sh:class 类比）。
  5. **VersionShape（新增 · severity=Warning）**：`product_semver ↔ package.json#version` 一致。**单源划界论证**：pin-03（`release-pins.yaml:27-32` · required: true · fixable: true）是版本钉的**唯一强制真值源**；VersionShape 仅为 ontology-check 报告内的 **Warning 级观察项** —— 不咬 exit、不修复、报告注明 `see pin-03`；两者结论分歧时以 pin-03 为准。**不得形成双份强制真值**（研究文 §8.4 警示）。
- **exit 语义（fail-closed）**：conforms → exit 0；任一 **Violation** 级违规 → exit 2 点名形状（`shape @ where :: message` 逐行 · 与探针输出格式同源）；仅 Warning/Info → exit 0（报告含警示行）；ontology 不可读/YAML 解析失败 → exit 2（fail-closed · F-W3-01）。
- **一致性承诺边界（F-W3-06）**：报告含 `profile` 串（建议 `spec-wave-shacl-subset/v1` · 30 定稿）+ 对照 fixture（同一漂移样本的期望违规集钉死）；**对外不得声称 W3C 一致性**（硬约束 13 · 文案负向 grep 入验收 #12）。
- **负向 fixture**（红测先行）：故意漂移样本 ≥4 件 —— 删类声明致 RelationShape 红 / axiom id 去 ONTO- 前缀致 AxiomShape 红 / blocks_hats 塞未声明帽致 GateShape 红 / 缺 subject 端点致 minCount 红 —— 每件报红点名形状 exit 2；合规件（修复后 `assets/ontology.yaml` 本体）报绿 exit 0。

### S4.2 本体引用完整性修复（范围③ · 接线即真红 · 真修优先 · 研究文 §6）

**接线前真值面（已留证 · 不得改写历史）**：探针复跑 3 处 `sh:class` 违规（本 task 基线节 + 研究文 §6.1 · `ontology.yaml:44-46` embedsInto 两端悬空 · `:56-58` produces 客体悬空 · `classes` 15 项 `:10-41` 确不含此三类）。

**修复动作（30 执行 · 逐处留痕）**：

| 悬空类 | 处置（定稿） | 依据 |
|--------|-------------|------|
| `BusinessRepository` | **补声明**（`classes` 增 `{id: BusinessRepository, domain: Instance}`） | HGM 活实例在先：`buildSnapshot` 把 `RepositoryAdopted` 主体建成 kind=`BusinessRepository` 节点（`cli-graph-hgm.ts:255`）· 与 F1 HGM 适配同源协同（研究文 §6.2） |
| `DisciplinePackage` | **补声明**（`classes` 增 `{id: DisciplinePackage, domain: Package}`） | 产品自指（纪律包嵌入业务仓 · `embedsInto` 语义自明 · Package 域 5 类是其内涵） |
| `TraceArtifact` | **对账后二选一（硬步骤 · 见下）** | 私仓真值 `DESIGN_ONTOLOGY_v1_zh.md` 不随包 · 本仓不可达（研究文 §6.2） |

**TraceArtifact 对账硬步骤（F-W3-08 · 30 执行期第一动作序列）**：

1. 30 在动 `produces` 关系**之前**，向维护者出示对账问题（问法见本节末「对账问法」· 私仓仅维护者可见）。
2. **未得答不得二选一** —— 阻塞期间先交其余范围（A4 校验器/F2/判据加固/F1 其余 · `produces` 处置单独一个 commit 后补），**不得擅自二选一、不得静默放过**。
3. 得答后按答二选一并**留痕**（问与答全文入 30 invoke 留档或验收文 · 硬约束 14）：
   - **答 = 伞类**（四个 Artifact 是其残片/子类）→ 补声明 `{id: TraceArtifact, domain: Instance}`（**不得**挂 subclasses 层级 —— 层级属语义面扩张 · 走闸行裁决升级条款 STOP）；
   - **答 = 已被取代**（裁剪时四 Artifact 类已替代伞类）→ `produces.object` 改指既有类（改指何类以维护者答为准 · 保留 `cardinality: "0..*"` 不变）；
   - **答 = 设计性裁剪**（三处悬空皆为有意裁剪）→ 显式登记设计性裁剪**豁免**（`ontology.yaml` 头注释 + 校验器豁免清单 · 豁免后校验器对豁免项不报红但**须在报告中列 exempted 项** · 不得静默 · 研究文 §6.3）。
4. **回归锁**：修复/豁免后 `graph ontology check` 对 `assets/ontology.yaml` 0 Violation（验收 #2）；探针脚本 `scripts/onto-probe.mts` 复跑同步转绿（探针逻辑与校验器同源 · 若探针保留独立实现则须同步修 · 30 裁决：建议探针改调 src 校验器单源）。

**对账问法（给维护者 · 30 照此出示）**：

> 「私仓 `DESIGN_ONTOLOGY_v1_zh.md` 中 `produces: Hat→TraceArtifact` 的 `TraceArtifact`，现状是以下哪种？
> (a) **仍是伞类**（`AuditReview/InformArtifact/ConstrainArtifact/VerifyArtifact` 是其子类或残片）→ 随包 ontology 补声明 `TraceArtifact`（Instance 域 · 不挂子类层级）；
> (b) **已被四个 Artifact 类取代**（裁剪随包版时伞类被展开）→ `produces.object` 改指既有类（请指定改指哪一个/哪几个）；
> (c) **有意裁剪不随包** → 三处悬空整体登记为设计性裁剪豁免（头注释 + 校验器豁免清单）。」

### S4.3 F2 真口径（范围⑤ · discipline/lifecycle show 改读消费者资产）

**现状（自述口径）**：`loadDiscipline`/`loadLifecycle` 硬读 `packageRoot()/assets/harness/<name>`（`cli-lifecycle.ts:36-68`）—— 任何仓里跑 `discipline show` 看到的都是**包内自述**资产。

**改造定稿（O3 真口径）**：

- 两命令增 `[--target PATH]`（缺省 = cwd · 复用 `resolveTarget` · 与 `lifecycle dry-run` DEF-019 口径一致 `cli-lifecycle.ts:389`）。
- **解析优先级**（30 按序实现 · 逐层 existsSync 探测）：
  1. `<target>/assets/harness/<name>`（**消费者资产** · O3 真口径 —— 本仓即 dogfood 实例：仓根 `assets/harness/` tracked 在案）；
  2. `<target>/.coding-kit/assets/harness/<name>`（布局内消费者资产 · KIT_LAYOUT_DIR `cli-shared.ts:143`）；
  3. `packageRoot()/assets/harness/<name>`（**包内自述兜底**）—— 命中本层时输出**来源标注行**：`source: package-fallback（消费者资产未找到 · 显示包内自述口径）`；命中 1/2 层时输出 `source: <相对路径>`。
- **解析失败纪律**：三层均缺 → exit 2 fail-closed（现状 `:57` 同口径延续）；消费者资产存在但 YAML 解析失败/校验失败 → exit 2 点名该路径（**不得**静默回退包内件 —— 坏资产即红）。
- **机检一致断言（验收 #4）**：`--json` 输出与所读 yaml 解析结果 **deep-equal**（逐项一致的机械化形态）；human 输出按 status 聚合计数与 yaml 重算一致、`sample statements` ⊆ `statements[].id`；**来源正误 fixture**：临时 target 放改造版 coverage（如篡改一条 status）→ 输出反映消费者版而非包内版（证明真口径生效）+ fallback 标注行 fixture。
- **诚实口径登记**：init 现状**不物化** `assets/harness/` 入消费者仓（`cli/init.ts` 实读确认）⇒ 真实消费者多走 fallback 层 —— 来源标注行即诚实口径（不假装读到了消费者资产）；`discipline show` 输出尾注 `SoT = ...` 行（`:121`）按实际来源改写。

### S4.4 判据加固（范围⑦ · 研究文 §5.3 六项 · 逐条定稿）

> 修复前真值面已由研究文 §5.1 留证（6 构造实测表 :107-117 · 附录 A 配方 :286-297 可机械复现）。本波交付**修复后转绿 fixture** 或**设计性残留登记** —— 逐条二选一留痕（下表「定稿」列即 10-task 裁决 · 备选列留给 30 执行期证据不足时的登记通道 · 走备选须在 invoke 留档写明理由）。

| 项 | 构造 | 定稿 | 备选（登记通道） | 修复后判据 |
|----|------|------|------------------|-----------|
| ADV-A1/A2 · D2 裸子串 | a1（`130-helper` 过配）· a2（`execute-code` 漏配） | **必修**：`cli-graph-hgm.ts:346` `.includes('30')` 改**语义边界判** —— `blocks_hats` 元素按段边界切分（`split('-')` 首段等值 `'30'` · 或等值匹配 V2 帽 id `30-*` 前缀段）· **禁裸子串** | —（必修无备选） | a1 转绿（PASS exit 0）· a2 由 S4.5 HGM 实例校验的 hat 词汇面兜住（未声明帽 Warning 点名）· 双 fixture 在案 |
| ADV-B1/B2 · rejected→draft 永久红 | b1（rejected→approved 公开管道修复仍红）· b2（手写 TaskStatusChanged 才绿） | **接真（选 (i)）**：`ingestRepo` 增 `TaskStatusChanged` 事件产出 —— task md `status` 与事件轨既有投影（`task_status`）不一致时补发（幂等键照 `idempotencyKey` :404-409 既有口径扩展）· 清偿路径入公开管道 | **降级（选 (ii)）**：公理降 severity=warn + 设计性残留登记（code 注释 + 本 task 回填）· 仅当 (i) 执行期证据不足时启用 | b1 修复后转绿（rejected→approved 后续轨道含 draft 回退或按公理新语义判定 · 30 按 (i) 语义定稿 fixture）；b2 不再是唯一清偿手段（公开管道可产 `TaskStatusChanged`） |
| ADV-C1 · D3 空转 | c1（task in_progress 恒 warn · CHECKED 边不可构造） | **移除**：删除 D3 公理（`:357-371`）+ 登记（不可构造边型 · 恒 warn 噪声 · 无消费者）· 移除留痕入 code 注释与本节 | **接真**：ingest 消费 GateCheckRun 证据产 CHECKED 边（与 W6 G7 执行证据面协同）· 范围膨胀 · 须 20/00 批准扩范围 | c1 修复后零 D3 噪声（PASS exit 0 · violations 无 D3 项）· 移除登记在案 |
| ADV-C2 · S2 死判据 | c2（手写 sync 事件 touch S2 恒绿 · SYNCED 边不可构造） | **移除 + 口径登记**：删除 S2 公理（`:373-387`）+ 登记「S2 真保护在 sync 拒绝面（`isS2RelPath` 等执行侧拦截 · 非 axioms 事后判定）」· **对外文案不得声称 `graph axioms check` 保护 S2**（假安全感 · 研究文 §5.3 警示 · 文案负向 grep 入验收 #12） | **接真**：定义 sync 事件来源（harness-sync 执行轨）产 SYNCED 边 · 同须批准扩范围 | c2 修复后：公理已移除（恒绿假象消除 · 登记在案）；若接真则违规路径可构造且真红（fixture 手写 SYNCED touch S2 → exit 2） |

**既有面保护**：`test/cli-g1g7.test.ts:354-380`（PASS/FAIL 冒烟）与 `test/cli-json-no-abs-path.test.ts:377-381` 须随判据变更**盘点登记**（D3/S2 移除可能改变既有冒烟断言 · F-W2-13 同式纪律：逐条登记 · 行为断言面零意外改动）；`graph axioms check` 的 exit 2 语义（`cli-graph.ts:202`）不变。

### S4.5 F1 受限形态统一（范围④ · 研究文 §9 候选一 · 已批准）

**边界（逐字继承批准口径）**：ontology 作 TBox 内核 · HGM 全量适配 · tech-graph 浅登记 · 各自编译保留 · 单源校验 · 公开 CLI 零 breaking · **tech-graph 词汇不入产品 classes**（防臆造语义 · F-W3-10）。

1. **TBox 内核**：`assets/ontology.yaml` 的 `classes`（修复后 **17±1** 项 —— 现状 15 + 已定稿补 2（DisciplinePackage/BusinessRepository）= 下限 17 · TraceArtifact 答=伞类则 18 · 20-task-audit R1-A2 口径）+ `relations`（修复后 5±1 条 · 含下述 `hasGate`）为两图共享词汇真值。
2. **HGM 全量适配**（新校验面 · 挂 `graph ontology check --hgm [--target PATH]` · 30 可与 S4.1 同模块实现）：
   - 读 `<target>` 事件轨 → `buildSnapshot`（复用 `cli-graph-hgm.ts:237-296` 不重写）→ 实例校验：**node.kind ⊆ TBox classes**（现 kind ∈ `BusinessRepository/Task/HumanGate/Hat` · 修复后全在 TBox）· **edge.type ⊆ TBox relations**（现 type ∈ `HAS_GATE/BLOCKS` · 见下映射）· Violation 级 exit 2。
   - **边型映射与 `hasGate` 补声明**：`BLOCKS`（gate→hat）↔ TBox `blocks`（HumanGate→Hat · `ontology.yaml:48-51`）语义对应；`HAS_GATE`（task→gate · `cli-graph-hgm.ts:269`）在 TBox **无对应关系** —— 补声明 `{id: hasGate, subject: Task, object: HumanGate, cardinality: "1..*"}`（与 BusinessRepository 补声明同源：代码活边型追认登记 · 闸行裁决③覆盖）。适配层映射表（`HAS_GATE→hasGate` · `BLOCKS→blocks`）**单点声明**（一处常量 · 两图校验共用）。
   - **hat 词汇面（F-W3-09）**：BLOCKS 边 `hat_id` 与 TBox 帽词表（starter+extended 8 帽 `ontology.yaml:77-99`）对照 —— 存量 task 闸表大量短形（`20`/`30`）与 V2 全形（`30-execute-code`）并存 ⇒ **短形按前缀段归一**（`30` ≡ `30-execute-code` 段首等值）· 归一后仍未命中 → **Warning 点名**（词汇漂移观察 · **不咬 exit** · 不得静默）· 归一化映射同样单点声明。
   - **零 breaking**：`graph axioms check` / `graph snapshot` 输出与 exit 语义**零变更**；HGM 适配是纯新增校验面。
3. **tech-graph 浅登记**（新档 + 校验钩 · 零 breaking）：
   - **新档 `assets/tech-graph-vocab.yaml`**（`version: "1"` 自描述 · namespace `tech:` · `kinds: [flow, struct, external]` · `edge_types: [depends_on, async_calls, condition, has_metadata]` · 头注释明示「**表现层词汇登记 · 非产品本体类** · 公开 CLI 词汇真值单源」）。**入 `package.json#files` 的 assets 既含 · 随包发布**。
   - **校验钩①（kind 单源化）**：`validateGraphYaml` 的 kind 枚举（`cli-graph-yaml.ts:87` 硬编码数组）改从登记档读取 —— **恒等 fixture**：对既有测试语料（仓内 `docs/_tech_graph/` 5 份 + 既有 fixture）registry 驱动校验结果 ≡ 硬编码旧行为逐字一致（零 breaking 的机械证明）· src 内不再存在第二份 `flow/struct/external` 硬拷贝（grep 断言入验收 #6）。
   - **校验钩②（边型 · Warning 级新增）**：`*.graph.yaml` 显式 `edges[].type` ∉ 登记档 → **Warning 行**（不咬 exit · 表现层开放惯例保留：`::label` 派生自定义 type 合法 · `edgeToGraphV2` :209-267）—— 登记≠封闭，浅登记只把隐式枚举变显式。
   - **不改 `inform_graph.v3` 读法**（schema_version 校验 `:63-65` 原样）· 消费者既有 `*.graph.yaml` 零迁移。
4. **单源校验（验收 #6 机检）**：两图校验只读同一 TBox / 登记档 —— grep 断言：src 内 `flow/struct/external` 仅出现于登记档加载点（常量残留 = 双份真值 · 打回）；HGM 映射表单点声明；**不产生第二份词汇拷贝**。

### S4.6 ONTO-OPEN 不开放登记（F-W3-03 口径落地 · 研究文 §7 已批准）

- **落点定稿**：① `README.md` + `README.zh-CN.md` **双入口口径节**（图能力已开放 vs 本体层不开放**分开陈述** · 建议句：「图能力已开放：`graph yaml compile|check|export` 与消费者自建图今天可用；**不提供自定义本体能力**（3.0 ONTO-OPEN 裁决 · 本体为 SpecWave 自用元模型）」· 字面 30 定稿 · **不动 pin-05/06 钉版本串行** `README.md`/`README.zh-CN.md` 版本出现处）；② `assets/ontology.yaml` 头注释增登记行（自用元模型定位 + 不开放 + 复议触发指向研究文 §7.3）。**不选 host-adapt 文档**：本体非宿主适配面，落 README 双入口与消费者第一眼面一致（研究文 §7.3「对外显式登记」）。
- **对外文案约束（机检 · 验收 #5/#12）**：**负向 grep** —— `README*.md` / `docs/`（豁免研究文/SPEC/PLAN/本 task 的裁决叙述语境 · 机检以词表+路径豁免清单实现）不得出现 `可扩展本体` / `自定义本体` / `custom ontology` / `extensible ontology` 类暗示；**正向 grep** —— README 双文件含「不提供自定义本体能力」登记句。
- **复议触发条件**（不重议 · 仅指向）：研究文 §7.3 三条（真实消费者请求 / A4 稳定一个 minor 后重估 / B5 后生态拉取需求）+ HG-SCHEMA-CHANGE 式人闸 —— 登记句注明指向研究文。

### S4.7 零新依赖证明（验收 #7 · 硬约束 13）

- 全部实现落在既有 `js-yaml`（经 `src/yaml.ts`）+ node 内置模块之上 · `package.json` dependencies 变更前后一致（仅 `js-yaml`）· lock 非 dev 顶层计数 = 2 不增。
- 机检：`git diff` 对 `package.json` dependencies 块为空 + lock 非 dev 计数复算脚本（基线节口径）· 入验收 #7 命令面。

---

## 范围

- [x] **① A4 ontology-check 接线**（SPEC §3-② · S4.1）：`graph ontology check [--file] [--json]` · SHACL 语义子集校验器（五形状 · VersionShape=Warning 单源划界）· 机读报告 + profile 声明 · fail-closed exit 2 · 负向 fixture ≥4
- [x] **② 引用完整性修复**（TraceArtifact 分支挂起登记 · 见自检结论 #3）（SPEC §3-③ · S4.2）：BusinessRepository/DisciplinePackage 补声明 · **TraceArtifact 对账硬步骤（先问维护者 → 得答二选一 → 留痕）** · 接线前 3 处/接线后 0 处回归锁 · 探针转绿
- [x] **③ F2 真口径**（SPEC §3-⑤ · S4.3）：show 双命令增 `--target` · 消费者资产三层解析优先级 + 来源标注 · fallback 诚实口径 · --json deep-equal 机检
- [x] **④ 判据加固六项**（SPEC §3-⑦ · S4.4）：D2 语义边界判（必修）· rejected→draft 接真 (i)（备选降级 (ii) 登记）· D3 移除（主）· S2 移除 + 口径登记（主）· 六构造逐条「转绿 fixture / 设计性残留登记」留痕
- [x] **⑤ F1 受限统一**（SPEC §3-④ · S4.5）：TBox 内核 · HGM 全量适配（kind ⊆ classes · type ⊆ relations · `hasGate` 补声明 · hat 词汇 Warning 面）· tech-graph 浅登记（`assets/tech-graph-vocab.yaml` 新档 + kind 单源化恒等 fixture + 边型 Warning 钩）· 单源 grep 断言 · 公开 CLI 零 breaking
- [x] **⑥ ONTO-OPEN 不开放登记**（S4.6）：README 双入口登记句 + ontology.yaml 头注释 · 文案正负 grep 机检 · 复议触发指向研究文 §7.3
- [x] **⑦ 零新依赖证明**（S4.7）：dependencies diff 空 + lock 非 dev 计数 2 不增（机检命令）

## 非范围

| 项 | 理由 |
|----|------|
| 引入 OWL / RDF / SPARQL 运行时 · DL 推理 | **已裁决不引**（D-30-OWL-REJECT · 硬约束 13 · 研究文 §8 全档不重议） |
| 实现 OWL/Turtle 导出器 | SPEC §4 · 只做「可导出」命名留白（稳定 IRI 友好命名空间 · ID 命名纪律维持 `ONTO-` 前缀等现状） |
| 重写 ontology 内容（类层次/公理文本/帽表语义重设计） | SPEC §4 · 本波只接线 + 修引用完整性 + F1 适配所需最小补声明 |
| 预置/臆造消费者领域本体内容 · 开放本体层（L-C/L-I） | SPEC §4/§3-⑥ · ONTO-OPEN=不开放已批准 · 登记即交付（S4.6） |
| tech-graph 词汇入产品 classes（`flow/struct/external` 塞进 TBox） | 臆造语义（研究文 §3.2 · F-W3-10）· 只入 `tech:` namespace 浅登记档 |
| 改 `inform_graph.v3` 读法 / 消费者 `*.graph.yaml` 迁移 | 零 breaking 红线（研究文 §9.1 · S4.5-3） |
| `graph axioms check` exit 语义变更 · HGM 快照/事件格式变更 | 既有面保护（S4.4/S4.5 · 适配=纯新增校验面） |
| D3/S2 接真（GateCheckRun/sync 事件源设计） | 范围膨胀 · 默认移除+登记（S4.4）· 接真须 20/00 批准扩范围另议（3.x 候选） |
| 图谱可视化 UI · `docs/_tech_graph/` 随 npm 发布 | SPEC §4 · 维持现状 |
| 动 S2 三域（`docs/tasks` / `docs/harness/reviews` / `invokes/by-task` 既有档改写） | 硬约束 1 · 本波只新增（本 task 文件 + 30 执行留档） |
| 新增任何运行时依赖 | 硬约束 13 · 验收 #7 |
| 对外声称 W3C 一致性 | 硬约束 13 · F-W3-06 · 只声称「SHACL 语义子集」+ profile + 对照 fixture |
| 发布四动作（tag/push/publish/deprecate） | 仅人 · 无代跑授权（RELEASING.md） |

---

## failure_paths

| 触发 | 行为 | 可重试 | 用户可见 |
|------|------|--------|----------|
| ontology 漂移（声明与校验形状不符）（F-W3-01） | `graph ontology check` exit 2 点名违规形状（`shape @ where :: message` 逐行 · fail-closed） | 是（修复后） | 是 |
| 研究文判 F1 不划算（F-W3-02） | **已消解**：2026-09-17 维护者批准 F1=受限统一 · W3-SPLIT 不启用；若 30 执行期发现统一代价实证超预算 → STOP 回 00/维护者复裁（不得自行降级硬做） | 是 | 是 |
| ONTO-OPEN 判「不开放」（F-W3-03） | **已是定案**：零实施成本 · 显式登记 + 文案约束（S4.6）· 暗示性文案入负向 grep 机检 | — | 是 |
| 引用完整性处置争议（F-W3-04） | 真修 / 显式豁免二选一**留痕**（S4.2 逐处登记表 + 对账问答留档）· 不得静默放过 | 是 | 是 |
| 图谱不随包发行 → 统一消费者不可达（F-W3-05） | **既定约束登记**（研究文 §4 末段）：统一收益 = 仓内单源 + 消费者自建图 schema 一致性 · 不落图谱分发 · 登记句入 ONTO-OPEN 口径 | — | 是 |
| 自研 SHACL 子集与标准实现行为分歧（F-W3-06） | 显式 profile 声明（报告 `profile` 键）+ 对照 fixture · 对外不得声称 W3C 一致性（文案负向 grep） | — | 是 |
| 3.x 想复议 OWL（F-W3-07） | 须同时满足研究文 §7.3/§8.5 三条触发条件 + HG-SCHEMA-CHANGE 式人闸 · 本波不开启 | — | — |
| **TraceArtifact 私仓对账阻塞（F-W3-08 · 本棒新增）** | 30 执行期未得维护者答 → **STOP 该处置分支** · 先交其余范围 · `produces` 处置独立 commit 后补 · **不得擅自二选一** | 是（得答后） | 是 |
| **HGM 适配词汇漂移（F-W3-09 · 本棒新增）** | 短帽 id / 未声明帽 / 边型映射争议 → Warning 级点名 + 登记 · 不咬 exit · 不得静默 · 映射表单点声明留痕 | 是 | 是 |
| **tech-graph 浅登记误标产品语义（F-W3-10 · 本棒新增）** | 把 `flow/struct/external`/边型塞进产品 classes 或在文案称为「产品本体一部分」→ 打回 · 表现层词汇只入 `tech:` namespace 登记档 | 是 | — |
| **VersionShape 与 pin-03 双份真值（F-W3-11 · 本棒新增）** | VersionShape 越权升级为 Violation/修复面 → 打回 · 恒 Warning 观察项 · 报告注 `see pin-03`（S4.1 单源划界） | 是 | — |
| **浅登记校验钩破既有消费（F-W3-12 · 本棒新增）** | kind 单源化后既有语料校验结果漂移 / 边型 Warning 误咬 exit → 恒等 fixture 拦截 · 不得放行 | 是 | 是 |
| `git add -A` 裹挟域外档（F-W3-13） | 打回 · 撤 stage 逐文件显式 add | 是 | — |
| 越权执行 tag/push/publish/deprecate（F-W3-14） | 违禁令 · 打回（四动作全仅人） | — | 是 |

---

## 验收标准（必须自证，不接受「我改完了」）

- [x] **#1 ontology-check 双向**（SPEC 验收 1 · S4.1）：负向 fixture ≥4（RelationShape/AxiomShape/GateShape/minCount 各一）报红**点名形状** exit 2 · 合规件报绿 exit 0 · 仅 Warning 件 exit 0 含警示行 · ontology 不可读/解析失败 exit 2 · `--json` 键集 fixture 钉死
- [x] **#2 引用完整性（硬要求）**（⚠️ 3→1 挂起分支 · TraceArtifact 处置后翻 0 · 机械锁在案）（SPEC 验收 6 · S4.2）：接线前 3 处违规留证在案（基线节 + 研究文 §6.1 · 不得改写）· 接线后 `graph ontology check` 对 `assets/ontology.yaml` **0 Violation** exit 0 · 探针复跑同步转绿 · 三处处置逐条留痕（补声明 commit / 对账问答全文 / 豁免登记三态之一）
- [x] **#3 TraceArtifact 对账留痕**（⚠️ 挂起清偿 · 维护者答「倾向 b 但 Artifact 不明确 · 后续再考虑」· 问答全文入自检结论+30 invoke · 归 3.x）（S4.2 硬步骤 · F-W3-08）：维护者问与答全文入 tracked 留档（invoke 或验收文）· 处置与答一致（补声明 / 改指 / 豁免三态对应）· 未得答擅改 = 验收不通过
- [x] **#4 F2 机检一致**（SPEC 验收 4 · S4.3）：`discipline show --json` 与所读 yaml **deep-equal** · human 计数重算一致 + sample ⊆ statements · **来源正误 fixture**（临时 target 改造版 coverage → 输出反映消费者版 + source 行 · fallback 层标注行 fixture）· `lifecycle show` 同口径（states/transitions ⊆ yaml）
- [x] **#5 ONTO-OPEN 登记**（SPEC 验收 5 · S4.6）：README 双文件含「不提供自定义本体能力」登记句（正向 grep）· 暗示词负向 grep 零命中（词表 + 豁免清单机检）· `ontology.yaml` 头注释登记行在案 · pin-05/06 钉版本串行零触碰（pins 17/17 兜住）
- [x] **#6 F1 单源统一**（SPEC 验收 2 · S4.5）：`graph ontology check --hgm` 对仓内真实事件轨 PASS（node.kind ⊆ classes · edge.type ⊆ relations exit 0）· `hasGate` 补声明在 TBox · 映射表单点 · tech-graph **恒等 fixture**（registry 驱动 ≡ 硬编码旧行为逐字）· **grep 单源断言**（src 无第二份 `flow/struct/external` 硬拷贝）· `graph axioms check`/`graph snapshot`/graph yaml 三面输出与 exit 零漂移
- [x] **#7 零新依赖证明**（SPEC 验收 7 · S4.7）：`package.json` dependencies diff 为空（仅 `js-yaml`）· lock 非 dev 顶层计数复算 = **2** 不增 · 命令输出入自检结论
- [x] **#8 axioms 对抗六构造**（SPEC 验收 3 · S4.4）：附录 A 配方机械复现 · 修复前真红留证（研究文 §5.1 在案）· 修复后逐条：a1 转绿 · a2 由 HGM hat 词汇 Warning 面兜住 · b1 转绿或降级登记 · c1 零 D3 噪声 · c2 处置在案（移除登记 / 接真真红）—— 每条「转绿 fixture / 设计性残留登记」二选一留痕 · 既有 axioms 两测试面登记项逐条列明
- [x] **#9 研究文 tracked**（SPEC 验收 8）：已清偿（2026-09-17 研究文 + 探针 + SPEC/PLAN 回填）· 波末复核链接仍 `git ls-files` 命中
- [x] **#10 平台锁**（SPEC 验收 9）：`npm run typecheck` 0 错 · `npm test` 全绿（基线 726 + 新增用例数 · 零意外红 · 环境红先对照实验定性 · duration 控制在基线 ≈94s 加性克制）· pins **17/17**
- [x] **#11 既有面零意外改动**：`cli-g1g7` / `cli-json-no-abs-path` / graph yaml 系 / pins-consistency 系既有断言（除登记项）零改动全绿 · 登记项逐条列明于自检结论（F-W2-13 同式纪律）
- [x] **#12 文案红线**：对外文档无 W3C 一致性声称（负向 grep · `W3C` 命中仅限研究文/SPEC/任务文的否决与边界叙述豁免清单）· 无「axioms check 保护 S2」叙事（S4.4-C2）· 无本体开放暗示（验收 #5 负向面）
- [x] **#13 结构闸**：`npx spec-wave task lint --file docs/tasks/active/task_3_0_w3_ontology_graph.md` PASS
- [x] **#14 执行粒度**（gate-check/task close 待 40 复核后另行 · 00 口径）：提交逐文件显式 add（禁 `git add -A`）· 每 commit 独立可回退 · 每 commit 前后 npm test 同绿 · 未执行 tag/push/publish/deprecate · 波末 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w3_ontology_graph.md` → exit 0 + `task close --yes` 闭环

---

## 给执行帽的必读列表

1. **研究真值全文** [`w3_ontology_graph_research_20260917.md`](../../harness/reviews/w3_ontology_graph_research_20260917.md)（§5 六构造+附录 A 配方 · §6 3 违规+处置建议 · §7 ONTO-OPEN 批准结论 · §8.4 SHACL 子集落地设计 · §9 F1 边界 · 附录 A fixture 配方机械复现）
2. SPEC [`04_w3_ontology_graph_unify_v1.md`](../../spec/3_0-architecture-leap/04_w3_ontology_graph_unify_v1.md) 全文（范围 ①–⑦ · 非范围 · 验收 1–9 · F-W3-01–07）· [`00_policy_and_boundaries.md`](../../spec/3_0-architecture-leap/00_policy_and_boundaries.md)（S2/P0/流程边界）
3. PLAN [`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W3 节（:237-257）+ 硬约束 3/13/14/15（:332,:342,:343,:359 区）
4. 现码（2026-09-17 实读行号 · 改前复读）：`src/cli-graph.ts`（分派 :19-52 · help :21-31 · 缺省 input :77 · axioms exit 2 :202）· `src/cli-graph-hgm.ts`（HgmEvent :15-23 · buildSnapshot :237-296（BusinessRepository :255 · HAS_GATE :269 · BLOCKS :271-276）· checkRejectedToDraft :298-333（:317-322）· checkAxioms :335-392（D2 裸子串 :346 · D3 :357-371 · S2 :373-387）· idempotencyKey :404-409）· `src/cli-graph-yaml.ts`（SCHEMA_VERSION :6 · validateGraphYaml :53-120（kind 枚举 :87）· classifyLabel :201-207 · edgeToGraphV2 :209-267 · contentStamp :188-191）· `src/cli-lifecycle.ts`（assetsHarnessFile :36-38 · loadLifecycle :40-53 · loadDiscipline :55-68 · formatDisciplineShow :91-124 · show 分派 :370-378/:447-455）· `src/cli-shared.ts`（KIT_LAYOUT_DIR :143 · resolveTarget/takeOption/printJson/fail 复用面）· `src/cli/main.ts`（graph 注册 :3,:96 · discipline/lifecycle 注册 :6,:72-76）· `src/yaml.ts`（yamlLoad 单源）
5. 资产：`assets/ontology.yaml`（113 行 · 头注释 :1-4 · classes :10-41 · relations :43-59 · axioms :62-74 · hats :77-99 · gates :101-111）· `assets/harness/discipline-coverage.yaml`（325 行 · gaps :18-83 · statements :85+）· `assets/harness/lifecycle.yaml` · `assets/release-pins.yaml`（pin-03 :27-32 · pin-04 :33-38 · pin-05/06 README 钉版本串）· `scripts/onto-probe.mts`（77 行 · 四形状种子 :29-58 · exit 2 :77）
6. 既有测试面：`test/cli-g1g7.test.ts:354-380` · `test/cli-json-no-abs-path.test.ts:377-381` · `test/cli-discipline-coverage.test.ts`（DEF-005 重盘回归闸）· `test/pins-consistency.test.ts`（pin-03/04 fixture :168,:514 区）· graph yaml 系 fixture（`docs/_tech_graph/` 5 份 .graph.yaml）
7. done task 先例：[`task_3_0_w2_gates_in_hosts.md`](../done/task_3_0_w2_gates_in_hosts.md)（闸行裁决四理由体例 · F-W2-13 登记纪律 · 恒等锁先例）· [`task_3_0_w1_schema_leap.md`](../done/task_3_0_w1_schema_leap.md)（HG-SCHEMA-CHANGE 过闸先例 · 红测先行）· [`task_3_0_w0_refactor_prep.md`](../done/task_3_0_w0_refactor_prep.md)（F-W0-05 基线重建/F-W0-07 环境红对照）
8. `RELEASING.md`（发布边界 · 四动作仅人）· `README.md` / `README.zh-CN.md`（S4.6 落点 · pin-05/06 钉版本串行禁动）

---

## 思考轮

### R0 · 证据

SPEC 04（signed）+ PLAN W3/硬约束 + 研究真值全文（双裁决已批准）+ 本棒全量实读复核：基线复跑（726/140/725/0/1 · duration ≈94s · typecheck 0 · pins 17/17 · HEAD `fb280df`）· 探针复跑逐字确认（conforms:false · 3 处 · exit 2）· 依赖基线（dependencies 仅 js-yaml · lock 非 dev 2）· 现码行号现值（hgm 471/yaml 597/onto 113/graph 203 与研究文 §1 复核一致）· **新发现两处在案**：① `HAS_GATE` 边型（`cli-graph-hgm.ts:269`）在 TBox relations 无对应 —— HGM 全量适配须补声明 `hasGate`（研究文「BLOCKS 语义对应」已覆盖另一半）；② 存量闸表短帽 id（`20`/`30` · 本仓 task 文件实证）与 TBox V2 帽 id 系统漂移 —— hat 词汇面只能 Warning + 前缀段归一（F-W3-09）· F2 现状面实读（`cli-lifecycle.ts:36-68` 硬读 packageRoot · init 不物化 assets 入消费者仓）· pin-03 已是 product_semver 强制钉（VersionShape 单源划界的事实基）。

### R1 · 范围

①–⑦ 照规格化节 S4.1–S4.7（SPEC §3 范围②–⑦ + F-W3-03 口径落地）；非范围照 SPEC §4 全继承 + 本棒明示：tech-graph 词汇不入产品 classes · axioms exit 语义不变 · D3/S2 接真不做（移除+登记为主）· 本体开放不做（已批准不开放）· 发布四动作仅人。

### R2 · 方案

已批准裁决全继承（ONTO-OPEN=不开放 · F1=受限统一 · D-30-OWL-REJECT）。**本棒定稿新增**：CLI 定名 `graph ontology check`（`graph <域> check` 三段式同构 · --file 缺省包内件）· 五形状集（探针四 + VersionShape=Warning 单源划界 pin-03）· TraceArtifact 对账硬步骤三态（补声明/改指/豁免 · 未得答不得二选一）· F2 三层解析优先级 + 来源标注（fallback 诚实口径 · 坏资产即红不回退）· D2 段边界判 · rejected→draft 接真 (i) 为主 · D3/S2 移除+登记为主 · `hasGate` 补声明 · tech-graph 浅登记落新档 `assets/tech-graph-vocab.yaml`（新 artifact 自有格式 · 恒等 fixture 证零 breaking）· 边型钩 Warning 级（表现层开放惯例保留）· ONTO-OPEN 落 README 双入口（非 host-adapt · 本体非宿主面）。

### R3 · 边界

S2 只新增（本 task 文件 · 不改 SPEC/PLAN/reviews/ontology.yaml 既有档）· **不签任何闸**（双 pending 待 00 翻转）· HG-SCHEMA-CHANGE 不设新行（四理由 + 升级条款落闸表下注 · 留 20 复核）· 硬约束 13（零新依赖 · 不声称 W3C）· 硬约束 14（对账问答/e2e 证据入 tracked）· 硬约束 9 文案口径（不暗示本体开放/不声称 axioms 保 S2）· pin-03/04/05/06 钉面零触碰 · 禁 `git add -A` · 发布四动作仅人 · 私仓仅维护者可见 ⇒ 对账是硬阻塞非可选（F-W3-08）。

### R4 · 可测性

验收 14 条全机械可断言（命令 + fixture 路径 + 期望输出均落验收节）：ontology-check 双向四类红 · 引用完整性 3→0 回归锁 · 六构造附录 A 机械复现 · F2 deep-equal + 来源正误 fixture · tech-graph 恒等 fixture · 单源 grep 断言 · 文案正负 grep · 依赖 diff + lock 计数 · pins 17/17。红测先行面 = ontology-check 负 fixture + 六构造对抗 fixture + F2 来源 fixture + tech-graph 恒等 fixture（先红后绿）。TraceArtifact 对账是唯一非机械验收点 → 以「问答全文 tracked 留档 + 处置与答一致」机械化其留痕面。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待审查文落盘 + 00 代签 · 维护者 2026-09-16 授权模式）；双闸 pending 待 00 翻转；闸行裁决（不设 HG-SCHEMA-CHANGE + 升级条款）留 20 复核；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | SPEC signed + 研究文双裁决批准 + 基线全量复跑（726/140/725/0/1 · typecheck 0 · pins 17/17 · 探针 3 处 exit 2 · lock 非 dev 2）+ 现码行号复核 + 两处新发现（hasGate 缺口 · 短帽 id 漂移）+ F2/pin-03 现状面实读 | no |
| R1 | 范围 ①–⑦ + S4.1–S4.7 规格化 · 非范围 SPEC §4 全继承 + 本棒明示五条 | no |
| R2 | 批准裁决全继承 + CLI 定名 + 五形状 + 对账硬步骤三态 + F2 三层解析 + D2 段边界 + D3/S2 移除主 + 浅登记新档恒等 fixture + ONTO-OPEN 落 README 双入口 | no |
| R3 | S2 只新增 · 不签闸 · 闸行裁决留 20 · 硬约束 9/13/14 · pins 钉面零触碰 · 禁裹挟 · 发布仅人 · 对账硬阻塞 | no |
| R4 | 验收 14 条全机械 · 红测先行面明示 · 对账留痕机械化 · 既有面登记纪律 | no |
| R5 | 待 20 审 R1 裁定充分性 · 双闸待 00 翻转 · 闸行裁决留 20 复核 | no |

**residual_risks**：① **TraceArtifact 对账依赖维护者**（私仓不随包 · 答期不可控）—— 缓解：F-W3-08 STOP 通道 + 先交其余范围 + 处置独立 commit 后补；若维护者长时不答则该分支挂起不算范围违约（留痕即清偿）；② **D3/S2「移除」裁决若被 20/维护者改判「接真」** —— 接真含 GateCheckRun/sync 事件源设计（范围膨胀 · 与 W6 面协同）—— 缓解：本 task 定稿移除+登记 · 接真留 3.x · R1 审查可提出改判；③ **F2「消费者资产」现实稀薄**（init 不物化 assets 入消费者仓 · 真实消费者多走 fallback）—— 缓解：来源标注行诚实口径 · 若 20 审认为「消费者资产」另有所指（如 `.coding-kit/` profile 资产）须 R1 提出 · 三层解析已预留该层；④ **`hasGate` 补声明越出「缺陷修复」范畴**（它服务 F1 适配非 §6 三违规本身）—— 缓解：闸行裁决③论证（代码活边型追认登记）+ 升级条款 + 留 20 复核；⑤ **短帽 id（`20`/`30`）与 V2 帽词表系统漂移** —— Warning 级 + 前缀段归一只兜住现状 · 若判须全量归一化则是数据面迁移（存量 task 改写）→ 3.x 另议 · 本波不开启；⑥ **浅登记新输出面（边型 Warning · HGM 校验）对既有快照/输出断言测试的影响** —— 缓解：30 执行期盘点 + F-W2-13 同式登记纪律 + 恒等 fixture；⑦ **`--file` 开放校验器入口被误读为「本体开放」** —— 缓解：S4.6 文案分开陈述（校验器开放 ≠ 本体内容开放）+ 负向 grep 机检。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 验收主体 = **机械锁全绿**（ontology-check 双向 fixture + 引用完整性 3→0 回归锁 + 六构造对抗 fixture + F2 deep-equal/来源 fixture + tech-graph 恒等 fixture + 单源/文案 grep 断言 + 零新依赖证明 + pins 17/17 · 命令与判据见验收节），辅以：① **红测先行**（ontology-check 负 fixture · 六构造 · F2 来源 fixture · 恒等 fixture 先红后绿 · 硬约束 6 修严型负向锁）；② 每 commit 前后 `npm test` 同绿（基线 726/140/725/0/1 · 环境红按 F-W0-07 同式对照实验先行定性）；③ 既有面回归（cli-g1g7 / cli-json-no-abs-path / graph yaml 系 / pins-consistency 系 · 登记项逐条列明 · F-W2-13 同式纪律）；④ TraceArtifact 对账留痕（问答全文 tracked · 处置与答一致）；⑤ duration 加性克制（基线 ≈94s）。**本波是校验接线波（声明→机检真值）· 红绿纪律 = 新校验面全部 fixture 先行 · 既有图面全部恒等/回归锁兜住。**

---

## 提交信息约定

- `feat(3.0-W3): ontology-check 接线（graph ontology check + SHACL 语义子集校验器五形状 · 零新依赖 · 负向 fixture）`
- `fix(3.0-W3): ontology 引用完整性修复（BusinessRepository/DisciplinePackage 补声明 · TraceArtifact 对账处置留痕）`
- `feat(3.0-W3): F2 真口径（discipline/lifecycle show --target · 消费者资产三层解析 + 来源标注）`
- `fix(3.0-W3): axioms 判据加固（D2 语义边界判 · rejected→draft 接真 · D3/S2 移除登记）`
- `feat(3.0-W3): F1 受限统一（hasGate 补声明 + HGM 实例校验 + tech-graph-vocab 浅登记档 + 恒等 fixture）`
- `docs(3.0-W3): ONTO-OPEN 不开放登记（README 双入口 + ontology 头注释 · 不动 pin-05/06 钉版本串行）`
- `test(3.0-W3): 对抗 fixture 组（六构造机械复现 + ontology-check 负 fixture + F2 来源 fixture）`
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界（F-W3-13）
- **禁 tag / push / publish / deprecate（仅人 · 无代跑授权）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w3_ontology_graph.md`

---

### 自检结论（执行者）

**GATE_VERIFY 首输出闸扫描表**（2026-09-17 阶段一改码前机械闸 · `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w3_ontology_graph.md` → VERIFY: PASS · 四阶段开工各复跑一次全 PASS）：

| human_gate_id | task表status | 用户/invoke声称 | 一致？ | blocks_30 | 30可开工？ |
|---------------|--------------|-----------------|--------|-----------|------------|
| HG-TASK-DRAFT | approved（00 代签） | — | Y | 20,30 | — |
| HG-AUDIT-R1 | approved（00 代签 · 依据 R1 审查文 PASS-with-issues blocking 0 · advisory A1–A4 全带入执行登记） | — | Y | Y | ✅ |

**四阶段锁计数汇总**（纯加性零回退 · 同锁全绿：typecheck 0 错 · build 0 错 · test:lib 6/6 · pins 17/17 · verify VERIFY: PASS）：

| 阶段 | commit | npm test（tests/suites/pass/fail/skip） | 新增 |
|------|--------|------------------------------------------|------|
| 基线（开工复跑实测） | 5fe92df | 726/140/725/0/1 | — |
| 一 · A4 ontology-check 接线 + 引用完整性补声明 | d960bc8 / 28cd0bd | 737/141/736/0/1 | +11 测 +1 套件 |
| 二 · F2 真口径 + 判据加固六项 | b710c0c / e2f775d | 754/143/753/0/1 | +17 测 +2 套件 |
| 三 · F1 受限统一 | a192bd9 | 767/144/766/0/1 | +13 测 +1 套件 |
| 四 · ONTO-OPEN 文案 + #12 + 挂起登记（docs + 机检） | 本棒 | 773/145/772/0/1 | +6 测 +1 套件 |

**验收 14 条逐项实测**：
- **#1 ontology-check 双向** ✅ 负向 fixture ×6（RelationShape 未声明类/minCount 缺端点/pattern 违/AxiomShape 命名空间/GateShape 未声明帽/ClassShape 唯一性+缺 id）报红点名 exit 2 · 合规报绿 exit 0 · VersionShape 恒 Warning exit 0 含警示行+see pin-03 · 不可读/解析失败 exit 2 · --json 键集钉死（test/ontology-check.test.ts 11/11 · 红测先行留证：实现前全红「graph 子命令未知: ontology」）。
- **#2 引用完整性** ⚠️ **挂起分支（既定）**：接线前 3 处留证未改写（基线节 + 研究文 §6.1）· 接线后 DisciplinePackage/BusinessRepository/hasGate 补声明落地 → **3→1**（仅余 produces→TraceArtifact · 机械锁 test/ontology-check.test.ts 登记项钉「Violation × 1」· 探针复跑 3→1 同步）· **0 待 TraceArtifact 处置后翻转**（挂起登记见 #3）。
- **#3 TraceArtifact 对账留痕** ⚠️ **挂起清偿（F-W3-08 既定分支）**：对账问法（a 伞类/b 改指/c 豁免 · S4.2 末）由 00 出示维护者；**维护者 2026-09-17 答复：「倾向 b 但对 Artifact 不明确 · 后续再考虑」** —— 答非三态确态 → 00 裁定挂起登记：produces→TraceArtifact **挂起 · 倾向 (b) 改指既有 Artifact 类 · 待私仓对账确认 · 归 3.x**；ontology.yaml 本体不动（不写声明不写豁免）· 机械锁维持 Violation × 1 不得翻 0 · 问与答全文入本行 + 30 invoke 留档（硬约束 14 · residual_risks ①：挂起不算范围违约 · 留痕即清偿）。
- **#4 F2 机检一致** ✅ show 双命令 --target 三层解析（消费者资产/布局内/包内兜底 + source 标注行 · 坏资产即红 exit 2 不静默回退）· --json 与所读 yaml deep-equal · human 计数重算一致 · sample ⊆ statements · 来源正/误 fixture（test/cli-f2-asset-source.test.ts 8/8 · 红测先行 8/8 先红后绿）。
- **#5 ONTO-OPEN 登记** ✅ README 双文件含「不提供自定义本体能力」登记句 + 图能力开放分述（校验器开放 ≠ 本体内容开放）+ 复议触发三条件指向研究文 §7.3 · ontology.yaml 头注释登记行在案 · 暗示词负向 grep 零命中（词表+否定语境守卫+路径豁免清单机检 · test/onto-open-docs.test.ts）· pin-05/06 钉版本串行零触碰。
- **#6 F1 单源统一** ✅ `graph ontology check --hgm` 实例校验（kind ⊆ classes · type ⊆ relations 经单点映射 HGM_EDGE_TO_TBOX · hat 前缀段归一 Warning 不咬 exit）· hasGate 补声明在 TBox · tech-graph-vocab.yaml 浅登记档 · **恒等 fixture：仓内 5 份语料 compile ≡ tracked md 逐字 · export ≡ tracked graph.json 逐字（三方比对：tracked ≡ 改前基线 ≡ 改后产物）** · grep 单源断言（src 内 flow/struct/external 字面量零残留 · A3 口径 :412 KIND_TO_CLASS 同迁）· axioms/snapshot/yaml 三面零漂移（test/f1-unify.test.ts 13/13）。
- **#7 零新依赖证明** ✅ `git diff` 对 package.json/package-lock.json 空（dependencies 仅 js-yaml）· lock 非 dev 顶层计数复算 = 2（argparse/js-yaml）不增（阶段一两 commit 间实测在案）。
- **#8 axioms 对抗六构造** ✅ 附录 A 配方机械复现：修复前复跑与研究文 §5.1 逐字一致（留证）→ 修复后六构造全 exit 0 —— a1 转绿（D2 段边界判）· a2 PASS+正确语义（兜住面 = S4.5 hat 词汇 Warning · F-W3-09）· b1 转绿（接真 (i)：ingest 补发 TaskStatusChanged 幂等 + 公理新语义清偿后继含同闸重审流转）· b2 仍绿 · c1 零 D3 噪声（移除+登记）· c2 公理移除登记（真保护在 isS2RelPath 执行侧）· 真红残留面钉死（rejected 静默搁置仍 FAIL · 30 帽真阳性仍 FAIL）（test/graph-axioms-hardening.test.ts 9/9 · 红测先行 6 红 3 对照绿）。
- **#9 研究文 tracked** ✅ 已清偿（2026-09-17 研究文+探针入库 · 波末复核 git ls-files 命中）。
- **#10 平台锁** ✅ 终态 773/145/772 pass/0 fail/1 skip（duration ≈94s 加性克制）· typecheck 0 错 · pins 17/17。
- **#11 既有面零意外改动** ✅ 登记项逐条（F-W2-13 同式）：① test/assets-ontology.test.ts ③ /未接线/ 断言登记式翻转（20 审 R1-A4 授权面 · diff 入 30 invoke 阶段一节）；② assets/sha256.manifest 随 ontology.yaml/新档 rebuild ×3（assets verify 闸拦截实证 → 修复后 PASS）；③ test/ontology-shallow.test.ts 盘点后零 diff。其余测试一律零改动（cli-g1g7/cli-json-no-abs-path/graph yaml 系/pins-consistency 系/dry-run 系全绿实证）。
- **#12 文案红线** ✅ 机检（test/onto-open-docs.test.ts 6/6）：W3C 命中仅限豁免清单（研究文/SPEC/PLAN/task/reviews/invokes 否决与边界叙述）· 无「axioms check 保护 S2」叙事（否定语境守卫）· 无本体开放暗示 · docs/ontology 两处陈旧「未接线」自述清退（阶段一偏差①清偿）。
- **#13 结构闸** ✅ `task lint` PASS（回填后本棒复跑实证）。
- **#14 执行粒度** ✅ 六 commit（d960bc8 / 28cd0bd / b710c0c / e2f775d / a192bd9 / 本棒 docs）逐文件显式 add 零裹挟（git status 全程审边界）· 每 commit 前后 npm test 同绿（commit 3 stash 隔离独立态 745/142/744/0 实测）· 未执行 tag/push/publish/deprecate · 波末 `gate-check` + `task close --yes` 待 40 复核后另行（00 口径：close 待 40 后另放行）。

**F-W2-13 同式登记（既有断言改动面 · 逐条）**：唯一被授权改动 = test/assets-ontology.test.ts ③（A4 授权）；计划外拦截两件 = assets manifest rebuild（sha256 闸 · 修复对象=manifest 声明非资产）· def009 对 tech-graph-vocab.yaml 头注释路径 token 拦截（改己方新档措辞 · 既有断言零改动）。

**已知未测项/挂账**：① TraceArtifact produces 处置（挂起 · 归 3.x · 机械锁钉 Violation × 1）；② HGM 本仓真实事件轨缺（无 .coding-kit/events · fixture 以 tmp 仓 seed+ingest 真实轨道构造）；③ rejected→draft 公理新语义为 30 在 task 定稿自由度内的定稿（备 20/40 复核）；④ 边型钩② stderr Warning 对仓内语料 7 条（设计内可见性 · 「输出零漂移」按 stdout/产物/exit 划界备复核）；⑤ S4.3 缺件 exit code 裁决（统一 exit 2 fail-closed · task 字面「现状同口径」冲突备复核）。

**过程留痕**：六 commit 逐文件显式 add · STOP/回退事件零次 · 红测先行留证三面（阶段一实现前全红 · 阶段二 14 红 3 对照绿 · 阶段三 stash 隔离补证）· 附录 A 修复前后复跑逐字留档（30 invoke）· 操作教训：bin 面实证前须先 build（bin → lib 编译产物 · 阶段三恒等预验首轮空 stderr 即此因）。

### KPI（00）

**30 自评备料**（待 00 收官裁定 · rubric `KPI_RUBRIC_v1_2`）：**Task_KPI%: 95**（自评）—— 验收 14 条中 12 条全机械落地 · #2/#3 走 F-W3-08 既定挂起分支（维护者答非确态 · 留痕即清偿 · 机械锁钉死不得翻 0）· 战略目标兑现（ontology 从声明变机检真值 + 两图 TBox 单源 + 判据首次对抗加固）· 零伪造零冒充 · 偏差 10 条全登记。

- 范围守界：仅 S4.1–S4.7 与 00 四阶段放行面 · ontology.yaml 结构零变更（classes/relations 增数据行 · 闸行裁决①）· SPEC/PLAN/reviews 既有档零改写（S2 只增：30 invoke 一件）· pins 钉面零触碰 · 发布四动作零触碰。
- 质量门：773/145/772 pass/0 fail/1 skip 终态 · typecheck/build 0 错 · test:lib 6/6 · pins 17/17 · assets verify 111/111 · verify 四阶段开工+收棒全 PASS · 每 commit 前后同绿。
