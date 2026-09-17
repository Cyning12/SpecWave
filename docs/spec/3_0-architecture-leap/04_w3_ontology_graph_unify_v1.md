# 04 · W3 · 本体驱动的图谱统一（ontology-driven graph unification）· **研究前置**

> **状态**：`signed`（**HG-SPEC-SIGNOFF=approved** · 2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）  
> **隶属**：`3_0-architecture-leap` · **本波第一步是研究文落盘，不可跳过；实施在研究裁决之后**  
> **test_strategy**：`required`（负向 fixture 真红转绿 + 对抗构造验证 + 零新依赖证明）  
> **上游**：PLAN_3_0 W3 节 · 路线研究 §4 主线一/六（A4/F1/F2）· 校核表 #5/#6/#7/#22/#23/#24 · **OWL 裁决已定（D-30-OWL-REJECT）**  
> ⚠️ **研究文雏形未入库**（`.workbuddy/output/研究-3.0-W3-本体与图谱-OWL引入评估.md` 被 `.gitignore:4` 忽略）⇒ **本波动工前必须把正式版落盘 `docs/harness/reviews/`（tracked）并回填仓内链接，否则不得引用为证据**（硬约束 14 · EVID-PROV）
> ✅ **2026-09-17 已清偿**：正式版落盘 [`docs/harness/reviews/w3_ontology_graph_research_20260917.md`](../../harness/reviews/w3_ontology_graph_research_20260917.md)（tracked · 全部证据 tracked 路径+行号实测）· 探针 [`scripts/onto-probe.mts`](../../../scripts/onto-probe.mts)（复跑 `conforms: false` / exit 2 · 3 处 `sh:class` 违规确认）—— 本 ⚠️ 块与验收 8 的「研究文落盘 + 探针镜像 + 链接回填」项由此清偿（硬约束 14 · EVID-PROV）。
> ⚠️ 行号为起草轮快照（图谱源码体量 `471`/`597`/`113` 行等），W3 task 起草时须回源码复核现值
> **波次顺序**：本波须排在 W1 之后（PLAN 编排理由 #4 · 与 W1 无代码耦合但须免误归因）。

---

## 1. 背景

**为什么合并成一波**：路线研究原把 A4（ontology-check 接线 · 性价比 2.0）与 F1（双图谱统一 · 性价比 1.2 · 全表垫底）列为独立项且 F1「无从下手」。本轮盘点发现：**ontology 恰恰就是两图缺的那个共同 schema** —— 以它为本体底座，A4 不再是孤立接线、F1 也不再是把两个不相干的东西焊在一起，两者是同一件事的两半。**先研究、后实施。**

**三套本体零共享 schema（实测盘点）**：① **HGM 事件溯源图**（`src/cli-graph-hgm.ts` 471 行 · `graph ingest` → `.coding-kit/events/*` → `graph snapshot` → `snapshot.json` · `graph axioms check` 违例 exit 2 · 由 `timeline --task` 消费）；② **tech-graph 编译图**（`src/cli-graph-yaml.ts` 597 行 · `*.graph.yaml` → MD/`graph.json` · schema id `inform_graph.v3` · 源目录缺省为**消费者仓** `docs/_tech_graph/` · 仓自身那份不随 npm 包发布）；③ **`assets/ontology.yaml`**（113 行 · 随包发布 · `src/` 零引用 · SpecWave 自身产品设计本体 · 人类真值在私仓不随包 · `product_semver` 随每次 bump 变 → 实为钉面资产而非能力）。合计 **1271 行图谱源码 + 13 份仓内图谱档**，两图零共享 schema、第三套本体与两者都不相连。

**停更事实（已实测确认）**：真实图谱功能改动止于 2026-08-25~08-28，此后近三周零功能演进（ontology.yaml 仅随发版 bump 改 `product_semver`）→ 该子系统同时具备「长期停更」+「从未被对抗复攻」两个特征，是本波**必须先研究、不可直接排期实现**的硬理由。

**同轮新发现（A4 由此获得实质价值）**：随包 `assets/ontology.yaml` **自身引用完整性已破** —— 4 条形状（约 40 行 · 零新依赖 · 仅既有 `js-yaml`）校验即得 **3 处 `sh:class` 违规**：`relations[0]`（`embedsInto`）两端 `DisciplinePackage` → `BusinessRepository` 未声明、`relations[3]`（`produces`）客体 `TraceArtifact` 未声明（疑为私仓本体裁剪到随包版本时丢失）⇒ **A4 一上线即真红**；处置二选一必须留痕：真修（补齐声明）或显式登记为设计性裁剪豁免（不得静默放过）。

**本体形式化路线已裁决（D-30-OWL-REJECT · 2026-09-15）**：**不引入 OWL**。四道硬障碍任一即可否决 —— ① OWA↔CWA 语义根本冲突（决定性：门禁全是 CWA，「必须存在审查文」类规则 OWL 表达不出 · 可运行实验证实）；② 唯一 npm OWL-DL 推理机 LGPL-3.0 + v0.1.0；③ 标准 SHACL 实现 408 传递依赖（基线 2 · 约 200×）；④ 无消费者。**采纳**：OWL 分层建模思想（TBox/RBox/ABox）+ SHACL CWA 语义子集自研零依赖校验器；内部真值仍 YAML；OWL/Turtle 仅作可选导出留白；**3.x 复议须同时满足研究文 §7.3 三条触发条件**（外部消费者 / 跨组织交换 / 重新评估许可与依赖）且复议走 HG-SCHEMA-CHANGE 式人闸（不得写成「永不」）。

**边界澄清（避免混淆）**：「消费者构建自己的图」**今天已可用**（`graph yaml compile|check|export` 是公开 CLI，源目录缺省即消费者仓）；**未开放的是本体层**（语义/schema 由消费者声明），不是图能力本身。研究文须把两者分开陈述。

## 2. 目标

1. **前置专项研究（第一步 · 不可跳过）**：三套本体统一可行性测绘 + 消费侧盘点 + `graph axioms check` 判据强度对抗验证 + **本体归属与开放边界裁决（ONTO-OPEN）** + OWL 否决完整论证（含 3.x 复议触发条件）。
2. **A4 接线**：`ontology-check` 让 `ontology.yaml` 从声明变为可机检真值（自研 SHACL 语义子集校验器 · 零新依赖）。
3. **F1 图谱统一**：按研究文选定方案，以 ontology 为共同本体底座（不引 OWL 后目标改为「**共享 YAML 本体 + 各自编译**」，非「RDF 化 + 推理对齐」）。
4. **F2 真口径**：`discipline show` / `lifecycle show` 改读消费者资产（O3 真口径，替代自述口径）。

## 3. 范围

| # | 项 | 形态 | 出处 |
|---|----|------|------|
| ① | **研究文落盘（tracked）**：三本体最小公因子 · 消费侧盘点 · axioms 判据对抗验证 · **ONTO-OPEN 裁决**（开放/不开放二选一 + 对外口径约束 · 不得留空）· OWL 否决论证（能力矩阵 + 四障碍 + 方案 A~D + 落地设计 + 3.x 触发条件）· schema 统一方案 A/B 对比 + 迁移成本 + 是否值得跨 major 裁决 | `docs/harness/reviews/` 落盘 + 探针脚本镜像入库（`.workbuddy` 雏形与 `onto_probe_20260915.mjs` 均本地件） | PLAN W3 前置 · 硬约束 14 |
| ② | **A4 `ontology-check` 接线**：自研「SHACL 语义子集」校验器（`targetClass`/`minCount`/`maxCount`/`class`/`datatype`/`pattern`/`in`/`severity` + 机读报告）· **零新依赖（仅既有 `js-yaml`）** | CLI 命令 + 校验器 + 负向 fixture | 路线 §4 · 校核 #5 |
| ③ | **本体引用完整性修复（接线即真红 · 硬要求）**：`relations[].subject/object ⊆ classes[].id` · `human_gates[].blocks_hats ⊆ 已声明帽` · `axioms[].id` 匹配 `^ONTO-[A-Z0-9]+$` —— 接线前 3 处违规 / 接线后 0 处；处置二选一（真修 / 显式豁免登记）**必须留痕** | 修复或豁免登记 + 回归锁 | 校核 #24 · ONTO-REF |
| ④ | **F1 双图谱统一**：按研究文方案，ontology 为共同本体底座，「共享 YAML 本体 + 各自编译」；统一后**同 schema 校验通过且不产生双份真值（单源）** | 公共 schema + 两图适配器 | 校核 #6 · 研究文裁决 |
| ⑤ | **F2 真口径**：`discipline show` / `lifecycle show` 改读消费者资产（O3） | CLI 输出改造 + 机检一致断言 | 校核 #7 |
| ⑥ | **本体开放（仅当研究文判「开放」才做）**：只开放 **L-C 约束层**与 **L-I 实例层**；**L-T 产品本体保持 SpecWave 自有**（避免消费者可改产品语义导致门禁不可信）· 不预置/不臆造消费者领域本体内容 | schema + 校验器 + 编译路径开放 | ONTO-OPEN 裁决 · 研究文 §7.4 |
| ⑦ | **`graph axioms check` 判据加固**：照 2.4/2.4.1 方法做三类对抗构造（裸子串/字面连续/枚举顶包）——修复前真红、修复后转绿（或明确登记为设计性残留） | 对抗 fixture + 判据修复 | PLAN W3 研究问题③ |

## 4. 非范围

| 项 | 理由 |
|----|------|
| 重写 ontology 内容 | 只接线与统一 |
| 预置/臆造消费者的领域本体内容 | PLAN W3 明示 |
| **OWL / RDF / SPARQL 运行时 · DL 推理** | **已裁决不引**（D-30-OWL-REJECT · 硬约束 13） |
| 实现 OWL/Turtle 导出器 | 只做「可导出」命名留白（稳定 IRI 友好命名空间） |
| 图谱可视化 UI | PLAN W3 明示 |
| 动 S2 三域 | 硬约束 1 |
| `docs/_tech_graph/` 随 npm 发布 | 维持现状 |
| **新增任何运行时依赖** | A4/F1/F2 全部落在既有 `js-yaml` 之上（硬约束 13 · 验收⑦） |
| 对外声称 W3C 一致性 | 自研 SHACL 子集与标准实现可能行为分歧 · 只声称「SHACL 语义子集」并显式声明 profile + 对照 fixture（研究文 §8·R1） |

## 5. 设计

### 5.1 研究文结构（第一步交付物 · 沿用雏形 10 节骨架）

能力矩阵 → 四障碍论证（OWL 否决）→ 方案 A~D 对比 → 落地设计 → 三本体最小公因子 → 消费侧盘点 → axioms 对抗验证结论 → **ONTO-OPEN 裁决（含对外口径约束）** → F1 统一方案 A/B + 迁移成本 + 跨 major 值否裁决 → 证据出处（全部 tracked 路径）。

### 5.2 SHACL 语义子集校验器（A4 实现口径已定）

- 支持形状：`targetClass` / `minCount` / `maxCount` / `class` / `datatype` / `pattern` / `in` / `severity` + 机读报告。
- 输入：`assets/ontology.yaml`（YAML 内部真值）；零新依赖（仅 `js-yaml`）。
- **不引 OWL/RDF/SPARQL 运行时**；CWA 语义（缺失即红 · 与门禁同语义假设）。
- 显式 profile 声明 + 与标准实现的对照 fixture（防行为分歧被误当 W3C 一致）。

### 5.3 F1 统一目标（不引 OWL 后的降级形态）

「共享 YAML 本体 + 各自编译」：抽公共 schema（节点/边/事件公共语义 = 研究文最小公因子），HGM 与 tech-graph 各配适配器，单源校验，不产生双份真值。**若研究文判「统一不划算」**：允许本波只交付 A4 + F2 + 判据加固，把统一显式降级为 3.x 并留痕（W3-SPLIT），**不得为凑范围硬做**。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 本体形式化 = 自研 SHACL CWA 语义子集（零依赖） | **采纳（D-30-OWL-REJECT）** | 四障碍（OWA↔CWA 冲突 · LGPL · 408 依赖 · 无消费者）任一即可否决 OWL；采纳其分层建模思想 |
| 本体形式化 = 引入 OWL + Konclude WASM 推理 | 弃选 | 语义根本冲突（决定性）+ 许可 + 依赖爆炸 + 无消费者 |
| 图谱统一 = 共享 YAML 本体 + 各自编译 | **采纳（研究文复核）** | 不引 OWL 后砍掉 RDF 化/推理对齐/三元组库三项最高成本 · F1 代价初判 5→3 |
| 图谱统一 = RDF 化 + 推理对齐 | 弃选 | 依附于已否决的 OWL 路线 |
| 本体开放 = 分层开放（L-C/L-I 开放 · L-T 自有） | **仅当 ONTO-OPEN 判开放时采纳** | 消费者可改产品语义则门禁不可信；判「不开放」则零实施成本仅落口径 |
| 图谱真值留在 `.workbuddy/` 类未 tracked 面 | 弃选 | 证据必须入库（硬约束 14） |

## 7. 验收标准（必须自证，不接受「我改完了」）

1. **`ontology-check` 双向**：对故意漂移的 ontology 报红、对合规报绿（负向 fixture）。
2. **单源统一**：统一后两图同 schema 校验通过且不产生双份真值（若 F1 降级 3.x · 本项以降级留痕替代）。
3. **axioms 对抗验证**：三类对抗构造修复前真红、修复后转绿（或明确登记为设计性残留）。
4. **F2 机检一致**：`discipline show` 输出与 `discipline-coverage.yaml` 逐项一致（机检）。
5. **ONTO-OPEN 裁决落盘**：开放/不开放二选一皆可，但必须写明结论 + 对外口径约束，不得留空或模糊。
6. **本体引用完整性（硬要求）**：三类形状接线前 3 处违规 / 接线后 0 处，且处置二选一（真修 / 显式豁免）**留痕**。
7. **零新依赖证明**：`dependencies` 变更前后一致（仅 `js-yaml`），lock 非 dev 计数不增。
8. **研究文 tracked 落盘** `docs/harness/reviews/` + 探针脚本镜像入库 + 本 SPEC 与 PLAN 回填仓内链接（硬约束 14 清偿）。
9. `npm run typecheck` 0 错 · `npm test` 全绿（含新增）。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W3-01 | ontology 漂移（声明与校验形状不符） | `ontology-check` exit 2 点名违规形状（fail-closed） |
| F-W3-02 | 研究文判 F1 不划算 | 启用 W3-SPLIT：只交 A4+F2+判据加固，统一显式降级 3.x 留痕 · 不得硬做 |
| F-W3-03 | ONTO-OPEN 判「不开放」 | 零实施成本 · 显式登记「不提供自定义本体能力」+ 约束对外文案（避免暗示） |
| F-W3-04 | 引用完整性 3 处违规的处置争议 | 真修或显式豁免登记二选一 · 均须留痕 · 不得静默放过 |
| F-W3-05 | 图谱不随包发行导致统一方案消费者不可达 | 研究文须说明「包内消费者拿不到图谱」约束如何处理 · 不得回避 |
| F-W3-06 | 自研 SHACL 子集与标准实现行为分歧 | 显式声明 profile + 对照 fixture · 对外不得声称 W3C 一致性 |
| F-W3-07 | 3.x 想复议 OWL | 须同时满足研究文 §7.3 三条触发条件 + 走 HG-SCHEMA-CHANGE 式人闸 |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = 三套本体实测盘点（471+597+113 行）· 停更事实（2026-08-28 后零功能演进）· 引用完整性 3 处违规探针（conforms:false / exit 2）· OWL 四障碍论证 · PLAN W3 节 | no |
| R1 | 范围 = ①–⑦；非范围 = OWL/RDF/SPARQL · 可视化 UI · 重写本体内容 · 新运行时依赖 | no |
| R2 | §6 表：SHACL 子集自研 vs OWL · YAML 共享本体 vs RDF 化 · 分层开放 vs 全开放/全封闭 | no |
| R3 | 边界：研究前置不可跳过（停更 + 未受对抗检验双特征）· 图能力已开放 vs 本体能力未开放须分开陈述 · L-T 产品本体不开放 · 证据入库 | no |
| R4 | `test_strategy=required`：负向 fixture · 三类对抗构造 · 零新依赖证明 · F2 机检一致 | no |
| R5 | **已签收**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）· 下一棒：00 逐波拆 task（10-task）→ 20-task-audit → HG-AUDIT-R1（00 代签）→ 30/40 | no |

**residual_risks**：① 研究文雏形与探针脚本均在 `.workbuddy/`（未入库），起草轮结论（3 处违规 · 四障碍）暂只有 PLAN 转述（缓解：范围 ① 清偿 · task 复跑探针）；② F1 代价初判 3 未经研究文定稿复核（缓解：W3-SPLIT 降级路径 · 不硬做）；③ 本体开放代价未估（缓解：判「不开放」即零成本 · F-W3-03）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）| 本 SPEC 定稿 |
| HG-AUDIT-R1（W3 task） | pending | W3 实施项 30 改码前（研究文落盘本身不触 30） |

> **机检诚实登记**：本表位于 SPEC 档（非 task 文 `### 人工闸` 节），`parseHumanGates` 不采集 ⇒ 不可机检 · 纯人工纪律；task 拆单时须把对应闸行复制进 task 文 `### 人工闸` 表（`blocks_hats` 按需含 `30`）才受 30 判定约束（硬约束 15）。

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-16 | draft · 10-spec · 自 PLAN W3 + 校核 #5/#6/#7/#22/#23/#24 收敛 · OWL 裁决继承 D-30-OWL-REJECT 不重议 |
| 2026-09-16 | 10-spec 修订 · 20-spec-audit R1 advisory A1/A2/A5 落实（标注/登记级 · 无实质变更） |
| 2026-09-16 | signed · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）· R5 回填 |
| 2026-09-17 | 标注级回填（**无实质变更**）：研究文正式版落盘 `docs/harness/reviews/w3_ontology_graph_research_20260917.md`（tracked）+ 探针镜像 `scripts/onto-probe.mts` 入库 · 头部 ⚠️ 块旁加「已清偿」注记（硬约束 14 · 验收 8 研究文落盘项 · 00 委派 W3 研究棒执行） |
