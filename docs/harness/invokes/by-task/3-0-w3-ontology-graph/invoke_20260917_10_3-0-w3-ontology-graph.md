# Invoke：10（task 起草）· 3-0-w3-ontology-graph

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-w3-ontology-graph` |
| task_paths | `docs/tasks/active/task_3_0_w3_ontology_graph.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要（委派 Prompt）

00 委派（W0/W1/W2 已 CLOSE · W3 前置研究文落盘且**双裁决已批准**（2026-09-17 维护者本窗「两条均接受00的建议」：ONTO-OPEN=不开放 · F1=受限形态统一）· 授权真值：维护者 2026-09-16「签收，授权00签收后续所有文档」）：起草 3.0 W3 task —— ① 必读研究真值全文（§5 axioms 六构造+附录 A · §6 三违规+处置 · §7 ONTO-OPEN · §8.4 SHACL 子集 · §9 F1 边界）+ SPEC 04（范围 ①–⑦ · 验收 1–9 · F-W3-01–07）+ PLAN W3 节/硬约束 13/14 + 现码实读（`assets/ontology.yaml` · `scripts/onto-probe.mts` · `cli-graph-hgm/yaml/graph.ts` · `cli-lifecycle.ts` · `discipline-coverage.yaml`）+ W2 done task（格式模板）；② 范围规格化七项：A4 ontology-check 接线（CLI 定名 + 五形状 + VersionShape 单源划界）· 引用完整性修复（真修优先 + TraceArtifact 对账硬步骤）· F2 真口径 · 判据加固六项（逐条转绿 fixture 或设计性残留登记）· F1 受限统一（HGM 全量适配 + tech-graph 浅登记）· ONTO-OPEN 不开放登记 · 零新依赖证明；③ 基线复跑实测写入；④ 闸表落 HG-TASK-DRAFT / HG-AUDIT-R1 均 pending · **不签任何闸** · HG-SCHEMA-CHANGE 闸行裁决写明理由。禁区：不实现代码 · 不改 SPEC/PLAN/reviews/ontology.yaml · 不签闸 · 不 commit · 禁 git add -A。

## 动作与独立复核证据（本帽实测）

- **基线复跑**：HEAD `fb280df` · npm test **726/140/725 pass/0 fail/1 skip**（≈94s · 与 W2 锁终态逐字一致）· typecheck 0 错 · pins 17/17 · 探针复跑 `conforms: false` / 3 处 sh:class VIOLATION（DisciplinePackage/BusinessRepository/TraceArtifact）/ **exit 2**（接线前真值面留证）· 依赖基线 dependencies 仅 `js-yaml` · lock 非 dev 顶层 = **2**（argparse · js-yaml）· 体量复核不变（hgm 471 / yaml 597 / ontology 113 / graph 203）
- **规格化定稿**：CLI 定名 `graph ontology check [--file] [--json]`（`graph <域> check` 三段式同构）· 五形状（探针四种子转正 + VersionShape=Warning 与 pin-03 单源划界 · `release-pins.yaml:27-32` 实证 pin-03 为唯一强制钉）· TraceArtifact 对账硬步骤三态（补声明/改指/豁免 · **未得答不得二选一** · F-W3-08）· F2 三层解析优先级（`<target>/assets/harness/` → `<target>/.coding-kit/assets/harness/` → packageRoot 兜底 + 来源标注 · `cli/init.ts` 零物化 assets 实证）· D2 段边界判（必修）· rejected→draft 接真 (i) 为主 · D3/S2 移除+登记为主 · tech-graph 浅登记落新档 `assets/tech-graph-vocab.yaml` + 恒等 fixture · ONTO-OPEN 落 README 双入口
- **两处新发现登记**：① `HAS_GATE` 边型（`cli-graph-hgm.ts:269`）在 TBox relations 无对应 —— HGM 全量适配须补声明 `hasGate`（研究文仅覆盖 BLOCKS↔blocks 一半）；② 存量闸表短帽 id（`20`/`30` · 本 task 闸表自身即实证）与 TBox V2 帽 id 系统漂移 —— hat 词汇面只能 Warning 级 + 前缀段归一（F-W3-09 · 咬 exit 则自咬现行合规 task）
- **闸行裁决**：W3 不设 HG-SCHEMA-CHANGE 行（四理由：结构零变更 · 缺陷修复非演进（校核 #24/SPEC §3-③）· 活词汇追认登记（:255/:269 在先）· 新档自有格式（W2 catalog 先例）+ 升级条款（越出二选一/语义面 breaking → STOP 走人闸）· 留 20-task-audit 复核）
- 落 `docs/tasks/active/task_3_0_w3_ontology_graph.md`（330 行）· `task lint` PASS · failure_paths 继承 F-W3-01–07 + 新增 F-W3-08–14 · 验收 14 条全机械 · R0–R5 五槽 + residual_risks 七条

## 关键交付与回执（00 授权落笔）

1. **HG-TASK-DRAFT 翻转**（00 回执授权 · 2026-09-17）：pending → approved（00 代签 · 授权真值：维护者本窗「授权00代签」· task lint PASS）· 头部闸态同步 · verify 回报（HG-AUDIT-R1 pending 正确拒 30 · 真实 exit 2）
2. **A2 搭车修**（00 回执授权 · 2026-09-17）：S4.5-1「classes 修复后 16±1」→「**17±1**」（20-task-audit R1-A2 口径：现状 15 + 已定稿补 2 = 下限 17 · TraceArtifact 答=伞类则 18 · relations 5±1 不变）
3. **HG-AUDIT-R1 代签落笔**（00 裁定 · 2026-09-17）：pending → approved · 依据审查文 `docs/harness/reviews/task_3_0_w3_ontology_graph_audit_R1_20260917.md`（R1 · PASS-with-issues · blocking 0 · advisory A1–A4 · A2 已搭车修 · A1 注记 · A3/A4 带入 30 执行要求）· 头部状态行同步（draft → active · 30 可开工）
4. 本两件 invoke 代笔补落（00 裁定授权 · W1/W2「pre-30 三件套齐」先例 · 格式对齐 W2 目录件）

## 未做（禁区）

- 未实现代码 · 未改 SPEC/PLAN/reviews/src/test/`assets/ontology.yaml` 既有件（30 的事 · 本帽只起草）
- 未自行签发任何闸（三次落笔均为 00 明确回执授权后执行）
- 未 push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 四动作余者仅人）
- 未裹挟域外档（commit 逐文件显式 add · `task_3_0_w1_ci_hotfix` 已在仓与本链无涉）

## 下一棒

30 实现棒：GATE_VERIFY 首输出（双闸 approved · pre-30 invoke 三件套齐 · VERIFY: PASS）→ 按 task 范围 ①–⑦ 执行（**第一动作序列 = TraceArtifact 对账问法出示维护者** · F-W3-08）→ 验收 14 条全绿（红测先行 + 恒等 fixture + 对账留痕）→ `task close --yes` 关账。20 审 A1–A4 处置：A2 已搭车修（本 invoke #2）· A1 注记（引用闸行裁决以闸对象论+缺陷修复论为主论据 · 类比仅旁证）· A3/A4 带入 30 执行登记（KIND_TO_CLASS :412 第二硬拷贝入单源断言口径 · 两 ontology 测试件入既有面清单 + `/未接线/` 断言随头注释改动登记更新）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 10-task 起草完成 + 两处新发现登记（hasGate 缺口 · 短帽 id 漂移）+ 三次 00 授权落笔（HG-TASK-DRAFT 翻转 · A2 搭车修 · HG-AUDIT-R1 代签）· 00 授权后代笔补落本 invoke（pre-30 三件套之一） |
