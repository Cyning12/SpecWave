# Invoke：20（task-audit R1）· 3-0-w3-ontology-graph

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w3-ontology-graph` |
| task_paths | `docs/tasks/active/task_3_0_w3_ontology_graph.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要

对 W3 task（3.0 本体驱动图谱统一 · A4 ontology-check 接线 + 引用完整性修复 + F2 真口径 + 判据加固六项 + F1 受限形态统一 + ONTO-OPEN 不开放登记 + 零新依赖证明）做 R1 书面审查：对照 SPEC 04 / 研究真值（ONTO-OPEN=不开放 · F1=受限统一 双裁决已批准）/ PLAN W3+硬约束 3/13/14/15 逐项核对范围/非范围/验收/failure_paths/思考轮；逐条复核 10-task 留下的五条重点（闸行裁决不设 HG-SCHEMA-CHANGE 四理由+升级条款 · F2 消费者资产三层解析语义 · D3/S2 移除+登记定稿 · tech-graph 浅登记零 breaking 证明链 · VersionShape/pin-03 单源划界）+ 新发现二（短帽 id 漂移 Warning 降级）；审查文落盘 `docs/harness/reviews/`。**禁止**改 task 实质、代签 HG-AUDIT-R1、改 src/`assets/ontology.yaml`/SPEC/PLAN。

## 独立复核证据（本帽实测）

- `npm test` 全量复跑：**726 tests / 140 suites / 725 pass / 0 fail / 1 skip**（94.3s）· typecheck **0 错** · pins **17/17**（pin-03 product_semver 钉含）· HEAD `fb280df` · 工作区仅本 task 文件 untracked —— 与基线节逐字一致；W2 done 锁终态交叉一致
- 探针复跑 `node scripts/onto-probe.mts` → `conforms: false` / 3 处 sh:class VIOLATION（DisciplinePackage/BusinessRepository/TraceArtifact）/ **exit 2** 逐字一致；依赖基线实测：dependencies 仅 `js-yaml` · lock 非 dev 顶层 = **2**（argparse · js-yaml）
- 行号抽核约 40 处全中（cli-graph 分派/exit2 · hgm HAS_GATE :269/D2 裸子串 :346/D3/S2/idempotencyKey · yaml kind 枚举 :87 逐字 · lifecycle assetsHarnessFile/SoT 行 · shared KIT_LAYOUT_DIR · ontology 15 类/8 帽/悬空两点 · pins pin-03/04/05/06 · 探针 · 测试锚点 · coverage 325 行 · _tech_graph 14 份/5 .graph.yaml）
- 关键实证：`cli/init.ts` 零物化 assets/harness（F2 fallback 诚实口径前提成立）· `isS2RelPath` 执行侧拦截在案（S2 移除登记的真保护面）· ontology gates blocks_hats 用 V2 全形（GateShape 严格 ⊆ 自洽）· 存量短形漂移实证（本 task 闸表 `20, 30`/`30` 自身即证）
- 机检：`gate-check` + `verify` 双咬住 HG-AUDIT-R1 pending（❌ 拒 30 · VERIFY: BLOCKED）· `task lint` PASS
- grep 新发现两处登记补列项：`cli-graph-yaml.ts:412` KIND_TO_CLASS 第二硬拷贝 · `test/ontology-shallow.test.ts`/`test/assets-ontology.test.ts` 未列既有面清单（③ `/未接线/` 断言与 S4.1/S4.6 头注释硬耦合必破须登记）

## 结论

**PASS-with-issues**（blocking 0 · advisory 4：A1 闸裁决④类比强度注记 · A2 classes 计数 16±1→17±1 口径 · A3 KIND_TO_CLASS :412 第二硬拷贝 · A4 两 ontology 测试件补列）—— 审查文：`docs/harness/reviews/task_3_0_w3_ontology_graph_audit_R1_20260917.md`

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 代签 · 维护者 2026-09-16 授权模式）
- ⛔ 未改 task / SPEC / PLAN / src / test / fixtures / `assets/ontology.yaml` 实质内容（S2 只新增：本 invoke + 审查文）
- ⛔ HG-AUDIT-R1 仍 pending ⇒ 未附 30 Prompt，仅出维护者签闸清单

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 20-task-audit R1 审查完成落盘 |
