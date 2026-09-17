# Invoke：00（统筹）· 3-0-w3-ontology-graph

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-w3-ontology-graph` |
| task_paths | `docs/tasks/active/task_3_0_w3_ontology_graph.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 人授权（原文意图）

维护者 2026-09-16 本窗：**PLAN_3_0 + 3.0 SPEC 系列双签 approved**，原话「**签收，授权00签收后续所有文档**」——授权 00 代签后续过程文档闸（**HG-RELEASE / npm publish / tag / push 不在范围** · 发布四动作仅人不变）。2026-09-17 维护者本窗：W3 前置研究文双裁决「**两条均接受00的建议**」（ONTO-OPEN=不开放 · F1=受限形态统一 · 研究文 §7/§9 建议转为批准定案）。**00 只委派不亲自实现**（harness-00-delegate-only 口径）。

## 闸扫描与代签依据

- 上游双闸：HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗 · 落 task `### 人工闸` 表）
- HG-TASK-DRAFT=approved（**2026-09-17 00 代签** · 同授权 · task lint PASS）
- HG-AUDIT-R1=approved（**2026-09-17 00 代签** · 同授权 · 依据审查文 `docs/harness/reviews/task_3_0_w3_ontology_graph_audit_R1_20260917.md`：R1 · PASS-with-issues · blocking 0 · advisory A1–A4）
- **闸行裁决**：W3 不设 HG-SCHEMA-CHANGE 新行（10-task 起草裁决 · 四理由 + 升级条款落 task 闸表下注 · 20-task-audit R1 复核通过：裁决成立 · 理由④附类比强度注记 advisory A1 · operative 论据 = 硬约束 3 闸对象限定为结构格式变更 + 缺陷修复既定处置（SPEC §3-③）+ 新 artifact 自有格式自描述）

## 派发链

W2 done（726/140/725/0/1 锁终态）→ W3 前置研究棒（研究文落盘 + 探针入库 · 硬约束 14 清偿 · 双裁决建议获维护者批准）→ 10-task 起草（规格化七项 + 基线复跑 + 两处新发现登记 · 见 10 invoke）→ **00 代签 HG-TASK-DRAFT**（+ 头部闸态同步授权）→ 20-task-audit R1 书面审（PASS-with-issues · blocking 0 · 独立复跑全部基线数字 + 约 40 处行号抽核 + cli/init 零物化与 isS2RelPath 真保护面实证 + grep 新发现 A3/A4 两补列项 · 见 20 invoke）→ **00 代签 HG-AUDIT-R1** + A2 搭车修 + pre-30 invoke 三件套补落（10/20/00 齐 · W1/W2 先例）→ 30/40。

## 关键裁定

1. **双签承接与顺序**（硬约束 3/15 同构）：task 落闸行（双 pending）→ HG-TASK-DRAFT 代签 → 20 审查文落盘 → HG-AUDIT-R1 代签 → 30 改码；泛化机检全程咬住（pending 期 verify 实证 exit 2 拒 30 · 双签后 VERIFY: PASS）
2. **四 advisory 处置**：A2 **已搭车修**（S4.5-1 classes 计数 16±1 → 17±1 · 本批落笔）· A1 **注记**（30/00 引用闸行裁决时以闸对象论 + 缺陷修复论为主论据 · 类比仅旁证 · 与 W2 R1-A1 同型）· A3/A4 **带入 30 执行要求**（A3：`cli-graph-yaml.ts:412` KIND_TO_CLASS 第二硬拷贝入验收 #6 单源断言口径 + 恒等 fixture 语料含 export 面 · A4：`test/ontology-shallow.test.ts`/`test/assets-ontology.test.ts` 两件入既有面登记清单 · `/未接线/` 断言随 S4.1/S4.6 头注释改动登记更新 · F-W2-13 同式纪律）—— 全部落 HG-AUDIT-R1 行注明
3. **两处新发现认可**：hasGate 补声明（HGM 全量适配必要前提 · 20 审确认落在已批准 F1 裁决内涵面内）· 短帽 id 漂移 Warning 降级（零 breaking 下唯一一致选择 · 全量归一化登记 3.x）
4. **TraceArtifact 对账为 30 第一动作序列**（F-W3-08）：私仓仅维护者可见 · 未得答不得二选一 · 先交其余范围 · 问答全文 tracked 留档（验收 #3）
5. **一笔 commit 授权**（不 push）：task 文 + R1 审查文 + invoke 三件套 · 逐文件显式 add · 禁 add -A
6. 逐棒授权落笔：HG-TASK-DRAFT 翻转 → 头部同步 → A2 搭车修 → HG-AUDIT-R1 代签 → 授权 10-task 代笔补落本两件 invoke（S2 只新增 · W1/W2 先例）

## 未做（禁区）

- 未亲自实现代码（delegate-only）· 未改 SPEC/PLAN/reviews 既有档 / src / test / `assets/ontology.yaml`（S2 只新增不覆写）
- 未执行 push / tag / publish / deprecate（仅人 · HG-RELEASE 不在代签授权范围 · commit 不 push）

## 下一棒

30 实现棒：开工前 `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w3_ontology_graph.md` 过 GATE_VERIFY（双闸 approved · pre-30 invoke 三件套齐 · VERIFY: PASS）→ 范围 ①–⑦（TraceArtifact 对账先行）→ 验收 14 条（机械锁全绿 + 红测先行 + A1/A3/A4 执行登记）→ `task close --yes`。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 00 统筹落档：双签承接 · 两闸代签依据 · 六项关键裁定（10-task 按 00 授权代笔补落） |
