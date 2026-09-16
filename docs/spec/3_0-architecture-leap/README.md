# 3.0.0 · 架构跃迁（architecture leap）· SPEC 系列

> **状态**：`signed`（**HG-SPEC-SIGNOFF=approved** · **HG-NEXT-PLAN=approved** · 2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）  
> **spec_slug**：`3_0-architecture-leap`  
> **目标包**：`spec-wave@3.0.0`（**major** · 本产品首次触 schema 的 breaking 版本）  
> **上游规划**：[`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md)（**draft** · 含 26 组范围校核 + 版本路由复裁 + 16 条硬约束）  
> **判断依据（范围主源）**：PLAN_3_0「范围来源校核」① 路线研究 §5/§4 · ② 2.4.0 验收报告 §6.2 · ③ 2.4.1 验收报告 §4/§6.2 · ④ [`assets/harness/discipline-coverage.yaml`](../../../assets/harness/discipline-coverage.yaml) `deferred`/`not_wired` 项  
> ⚠️ **主源 ①②③ 未入库（起草轮实测）**：`.workbuddy/` 被 `.gitignore:4` 整体忽略，三份材料对 clone / 评审员不可达 ⇒ **本系列暂以 PLAN_3_0 为仓内唯一可追溯真值**；证据镜像清偿归 W3/W7（PLAN 硬约束 14），清偿完成前本系列不得仅凭 `.workbuddy/` 链接声称证据。  
> **基线**：码基线 `2.4.2`（main HEAD `2557119` ↔ tag `v2.4.2` 已推远端 · `pins check` 17/17）· 发布基线 `2.4.1`（npm `latest` · **2.4.2 尚未 publish** · 发布动作仅人）  
> **2.4.2 交付对账**：R-1 / R-2 / R-3 已由 2.4.2 交付，**不进 3.0**；W4/W5 范围已据实收窄（仅真残余 R-5/R-6 等）——**起草教训：上一版交付后必须逐条回源码核对，不可沿用旧报告范围表**（PLAN 校核表 #8/#9 对账块）  
> **Open Folder**：本仓根（本地目录可仍名 `dsh-coding-kit/`）

---

## 一句话

2.2 建闭环、2.3 接线、2.3.1/2.4/2.4.1/2.4.2 补强度——但产品最大卖点始终悬空：`host-adapt` 的 `verify` 与 `hooks` surface 至今未实现，P0 门禁装不进宿主。3.0.0 接上这根主线：**W0 重构预备（非功能）→ W1 适配表 schema 跃迁 + 闸判定泛化（核心 · breaking）→ W2 门禁真入宿主 + 接入面开放（B5）→ W3 本体驱动图谱统一（研究前置）→ W4 防伪判据语义化 → W5 机械清扫 → W6 可观测与审计 → W7 收尾与对外**。

---

## 读序

1. PLAN_3_0（范围校核 26 组 · 版本路由复裁 · OWL 裁决 · KPI 裁决 · 硬约束 1–16 · 风险表 · 条目全表）
2. [`00_policy_and_boundaries.md`](./00_policy_and_boundaries.md)（S2 禁区 · P0 门禁 · 范围外声明 · 对外文案纪律 · 流程边界 · 硬约束收敛）
3. [`01_w0_refactor_prep_v1.md`](./01_w0_refactor_prep_v1.md)（**W0 · 重构预备**：三 god-file 拆分 barrel 原则 + 六重锁 + **独立验收文 M1** + E3 第一批 · 非功能）
4. [`02_w1_schema_leap_v1.md`](./02_w1_schema_leap_v1.md)（**W1 · 适配表 schema 跃迁 + 闸判定泛化 · 本次核心 · breaking**）
5. [`03_w2_gates_in_hosts_v1.md`](./03_w2_gates_in_hosts_v1.md)（W2 · 门禁入住宿主 + B5 接入面开放 · 战略目标兑现）
6. [`04_w3_ontology_graph_unify_v1.md`](./04_w3_ontology_graph_unify_v1.md)（W3 · 本体驱动图谱统一 · **研究前置**）
7. [`05_w4_semantic_criteria_v1.md`](./05_w4_semantic_criteria_v1.md)（W4 · 防伪判据语义化 · 评审先行）
8. [`06_w5_mechanical_cleanup_v1.md`](./06_w5_mechanical_cleanup_v1.md)（W5 · 机械清扫与可诊断性）
9. [`07_w6_observability_audit_v1.md`](./07_w6_observability_audit_v1.md)（W6 · 可观测与审计）
10. [`08_w7_closeout_external_v1.md`](./08_w7_closeout_external_v1.md)（W7 · 收尾与对外 + 3.0.0 release bump）

---

## 已定案裁决（PLAN 落锤 · 本系列直接继承，不再重议）

| ID | 定案 | 说明 |
|----|------|------|
| **D-30-VERSION-ROUTE** | **W0 不迁 2.5.0 · 保持为 3.0.0 首波** | 复裁五条理由：W0 semver 上是 patch 级（三 god-file 经 `exports` 实测**对外不可达**）· 收益内部性不靠发版兑现 · 独立验收改用 M1 验收文等价替代 · 打破 2.4.0 §7.3 纪律代价远大于收益 · 留 3.0 不污染 breaking 语义。**翻案触发器**（二选一）：出现必须单独发版的消费者可见需求 / W0 验收文未过需以发版回滚 |
| **D-30-BARREL** | **W0 拆分 = 内部搬迁 + 原文件降级为纯 barrel** | 消费者 import 面 `git diff` 必须为空（锁②）——「零行为变更」从主观承诺降级为机械可证；**本条不可动** |
| **D-30-OWL-REJECT** | **本体形式化不引入 OWL** | 四障碍任一即可否决：OWA↔CWA 语义根本冲突（决定性）· 唯一 npm OWL-DL 推理机 LGPL-3.0+v0.1.0 · 标准 SHACL 实现 408 传递依赖（基线 2）· 无消费者。**采纳**：OWL 分层建模思想 + SHACL CWA 语义子集自研零依赖校验器；OWL/Turtle 仅作可选导出留白；**3.x 复议须同时满足研究文 §7.3 三条触发条件且走 HG-SCHEMA-CHANGE 式人闸**（不得写成「永不」） |
| **D-30-KPI-NO-SEM** | **取消「每帽 KPI」设想 · 不补语义闸 · `close_kpi` 本体零变更** | 维护者 2026-09-15 裁决：自评类判据设机械门槛会反向约束思考（原文：「补了语义可能还会限制思考」）；`KPI_RUBRIC_v1_2` 引而不随包问题本版不处理（归 W7 对外口径类，若日后动） |
| **D-30-CRITERIA-SPLIT** | **判据两分：防伪类继续语义化 · 自评类不语义化**（硬约束 11） | 结论闸/pins/豁免真实性 = 防伪（照做）；KPI = 自评（只留存在性约束）；**禁止**以「统一语义化」为名对自评类加机械门槛；边界须在 W4 评审文显式写明 |
| **D-30-HG-GENERIC** | **30 闸判定泛化：声明式全闸替代白名单 3 闸** | 「任何 `blocks_hats` 含 30 的非 approved 闸 → 拒 30」；保留 `HG-AUDIT-R1` 缺行即拒（fail-closed by absence）；存量 229 条 HG 行实测**零误伤**（`blocks含30 ∧ status≠approved` = 0 行），仍须扫描快照基线回归锁 |
| **D-30-B5-GAP** | **B5 真实缺口 = catalog + 用户级目录 + 多表合并**（非「外部表接不进」） | `--file` 早已可用（复核证伪旧口径）；硬要求：新增非内置自定义宿主**全程不改包发版**（硬约束 12） |

## 待决裁决（起草轮未锤 · 归对应波次）

| ID | 待决问题 | 归属 | 口径 |
|----|---------|------|------|
| **ONTO-OPEN** | 本体归属与开放边界：SpecWave 自用元模型 vs 消费者可扩展底座（开放 / 不开放二选一皆可，**必须落盘结论 + 对外口径约束**，不得留空） | W3 研究文 | 若开放：仅 L-C 约束层 + L-I 实例层，**L-T 产品本体保持自有**；若不开放：显式登记并约束对外文案 |
| **W3-SPLIT** | F1 双图谱统一是否降级 3.x（研究文判「不划算」时允许只交付 A4+F2+判据加固） | W3 研究文 | 不引 OWL 后 F1 代价初判 5→3；**不得为凑范围硬做** |
| **W0-SPLIT** | 若 `src/cli.ts`（触冻结面）反复不过：允许降级为「只拆 cli-checks + cli-host」，`cli.ts` 留 W0b 延后 | W0 task | W1 只依赖 cli-host 拆分 |
| **OPEN-W4-STATUS-CELL** | pin-08 语义格位「发布态措辞绑定」具体档位 | W4 评审文 | 评审先行（D-24-W2-REVIEW-FIRST 先例沿用） |

---

## 波次总表（与 PLAN 一致 · 每波独立 SPEC 文件）

| Wave | 主题 | 级别 | 核心交付 |
|------|------|------|---------|
| **W0** | 重构预备（**非功能**） | 工程健康 | E4 三 god-file（3783 行 / src 38.4%）拆分为 barrel + 六重锁 + **独立验收文（M1 · 早于 W1 动 schema）** + E3 第一批 spawn 下沉 |
| **W1** | **适配表 schema 跃迁 + 闸判定泛化（核心 · breaking）** | 战略级 | A3 schema 增 `hooks`/`verify`/`schema_version` · B2 `defaults`+`extends` · B3 commands 动词名入表 · HG-GENERIC · 向后兼容旧扁平格式 |
| **W2** | 门禁入住宿主 + 接入面开放 | 战略级 · 生态 | hooks 物化 13 宿主 + `host verify` 物化 + P0 门禁宿主内真生效 + B5（catalog/用户级目录/多表合并）+ 第三方自定义 agent e2e |
| **W3** | 本体驱动图谱统一（**研究前置**） | 研究 + 架构 | 前置研究文（tracked 落盘）→ A4 ontology-check 接线（接线即真红：3 处引用完整性违规）· F1 图谱统一 · F2 真口径 |
| **W4** | 防伪判据语义化（**评审先行**） | P2×4（已收窄） | NEW-5 结论闸语义化 · R-5 跨行否定封堵 + NEW-11 词表广义化 · NEW-4 pin-17 表行语义判 · pin-08 发布态绑定 · NEW-10 exempt 真实性 |
| **W5** | 机械清扫与可诊断性 | P3×4+P2 | NEW-6/7/8/12 · R-6 git 分档诊断 + 套件前置探测 |
| **W6** | 可观测与审计 | 可观测 · 接线 | C6 结构化审计落盘（独立于 S2）· F4 S2 公理接真实触发源 · G2/G4/N2-C/G7 闸接线补全 |
| **W7** | 收尾与对外 | DX · 收尾 | F3 wiki 补全 · E3 收尾 · 术语统一 · K-1~K-4 竞品口径修订 · MIGRATION.md · 链接两级机检 + 证据入库清偿 · **3.0.0 release bump** |

**编排理由（PLAN 继承）**：W0 最先（减阻 + 把「闸判定泛化」等机制改造放进已拆分模块，改动面可定位）→ W1 schema 跃迁是 W2 兑现面的前提且必须趁 W0 后模块清晰时做 → W2 兑现战略卖点 → W3 研究前置不可跳过（图谱子系统「长期停更 + 从未被对抗复攻」）→ W4/W5 语义化与清扫独立 → W6 审计 → W7 收尾对外。**B5 与 W1 catalog 强耦合，W1 延后则 B5 顺延，不得抢跑**。

---

## 思考轮控制（10-spec · 系列级）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = PLAN_3_0（draft · 含 26 组范围校核逐条钉出处 + 版本路由复裁 5 理由 + OWL 否决四障碍 + KPI 实测数据 74 任务盘点 + 2.4.2 对账）；主源 ①②③ 未入库（硬约束 14 待清偿）；主题 = **major 3.0.0 架构跃迁**，breaking 唯一硬理由 = A3 适配表 schema 跃迁 | no |
| R1 | 范围 = W0–W7 八波（上表）；非范围 = 冻结项（自研 IDE/第二分发通道/远程 Policy 引擎）· 仅人项（provenance/OIDC 启用 · npm publish/deprecate/tag/push）· 2.4.2 已交付项（R-1/R-2/R-3）· 2.x 式强度补丁重复劳动 · KPI 语义化（已裁决不做）· OWL/RDF/SPARQL 运行时（已裁决不引） | no |
| R2 | 方案对比散落各波 SPEC：W0 barrel vs 原地拆分（**barrel 荐** · 消费者零改动机械可证）· W1 闸泛化声明式 vs 扩白名单（**声明式荐** · 否则 HG-SCHEMA-CHANGE 咬不住）· W3 OWL vs SHACL 子集自研（**自研荐** · 四障碍）· W2 hooks 按机制族抽象 vs 逐宿主硬编码（**机制族荐**）· 对外口径区间+as_of vs 单值（**区间荐** · 防二次过期） | no |
| R3 | 边界：S2 永不覆写 · P0 不可绕过（禁 `--force`/`--allow-*`）· 向后兼容红线（旧格式零改动可用）· 闸不落表即虚设（`### 人工闸` 节才可机检）· 证据必须入库 · 版本路由不凭直觉开 minor · 重构与行为变更分离 commit | no |
| R4 | `test_strategy=required`（全系列）：W0 六重锁 · W1 向后兼容回归锁 + 泛化回归锁（存量 229 行逐条不变）· W2 双宿主 e2e + 第三方自定义 agent e2e · W3 负向 fixture 真红转绿 + 零新依赖证明 · W4 每条修严配负向 fixture + 存量波及实测登记 · W5 git 不可用显式 skip · W6 N2-C FAIL 率前后数字 · W7 真实 2.4.1 仓迁移演练 + 链接两级机检 | no |
| R5 | **已签收**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）· 下一棒：00 逐波拆 task（10-task）→ 20-task-audit → HG-AUDIT-R1（00 代签）→ 30/40 | no |

**residual_risks**：① 主源 ①②③ 未入库，本系列引用的复核结论（零误伤 229 行 · 3 处 ontology 违规 · exports 封死等）暂只有 PLAN 单点转述（缓解：W3/W7 证据镜像清偿 · 各波 task 起草时回源码复核行号现值——PLAN 明示「未复核代码行号现值」）；② W1 breaking 面最广（13 宿主消费者），back-compat reader + 版本探测 + MIGRATION.md 三重保险任一缺失即不可放行；③ W2 各宿主 hook 机制文档质量参差，e2e 证据采集可能超预算（缓解：机制族抽象 + 至少 2 宿主下限 + 无 hook 显式降级）；④ W3 研究文若判 F1 不划算，波次拆分须留痕（W3a/W3b · W3b 可延 3.x）；⑤ 竞品口径是滚动量（缓解：只写区间+as_of+出处 · 不写单值）。

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-NEXT-PLAN** | **approved**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）| 维护者签收 PLAN_3_0；签收前不得开 W 波 task（PLAN 头部口径） |
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）| 本 SPEC 系列定稿 · 冻结「已定案裁决」表 |
| **HG-SCHEMA-CHANGE** | **pending**（W1 前置 · 3.0 新设） | schema 变更评审文落盘 `docs/harness/reviews/` + 维护者批准前，W1 30 拒改码；**须落 W1 task 的 `### 人工闸` 表且 `blocks_hats` 含 `30`**（硬约束 3/15 · 否则泛化判定亦咬不住） |
| HG-AUDIT-R1（每波 ×8） | pending | 各波 30 改码前（10-task → 20-task-audit → 人签/授权代签 · 逐波独立） |
| HG-RELEASE（3.0.0 发版） | pending | publish（**仅人**）；发布前探针必含「旧格式适配表在新版零改动可用」 |

> **机检诚实登记**：本表在 SPEC README（非 task 文）内，`parseHumanGates` 只采集 task 文 `### 人工闸` 节 ⇒ **本表为人工纪律**；各 W 波 task 拆单时须把对应闸行复制进 task 的 `### 人工闸` 表才受 30 判定约束（硬约束 15）。
>
> **HG-RELEASE 闸 ID 来源登记**：`HG-RELEASE` 为本 SPEC 新设闸 ID（PLAN_3_0 人工闸表未列 · 精神与「publish 仅人」一致非矛盾）；若落 W7 task 的 `### 人工闸` 表，`blocks_hats` 须含 `30`（硬约束 15）。

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-16 | draft 立档 · 10-spec · 源自 PLAN_3_0（draft · 2026-09-15/16 复核轮）· 全系列八波 + 政策边界 · 双闸 pending 待维护者签收 |
| 2026-09-16 | 10-spec 修订 · 20-spec-audit R1 advisory A3/A4 落实（标注/登记级 · 无实质变更） |
| 2026-09-16 | signed · HG-SPEC-SIGNOFF=approved · HG-NEXT-PLAN 同步 approved（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）· R5 回填 |
