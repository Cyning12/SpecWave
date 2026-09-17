# Invoke：30（执行）· 3-0-w3-ontology-graph（阶段一 · A4 ontology-check 接线 + 引用完整性修复）

| 字段 | 值 |
|------|-----|
| hat_id | 30 |
| task_slug | `3-0-w3-ontology-graph` |
| task_paths | `docs/tasks/active/task_3_0_w3_ontology_graph.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## GATE_VERIFY（第 0 步）

`node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w3_ontology_graph.md` → HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · **VERIFY: PASS**（exit 0 · 开工前实测）。

## 本棒范围（阶段一 · 且仅阶段一）

task S4.1/S4.2 · 验收 #1/#2（部分）/#3（待答登记）/#7（本阶段面）· 硬约束 13/14。F2/S4.4 判据加固/S4.5 HGM+tech-graph/S4.6 ONTO-OPEN 文案 = **后续棒**，本棒未触碰。

## 交付

1. **SHACL 语义子集校验器**（`src/cli-graph-ontology.ts` 新件 · 零新依赖仅 js-yaml 经 src/yaml.ts）：五形状 = 探针四形状转正（ClassShape/RelationShape/AxiomShape/GateShape）+ VersionShape（恒 Warning · message 注 see pin-03 · 单源划界 F-W3-11）。profile 显式声明 `spec-wave-shacl-subset/v1`（不声称标准合规 · 硬约束 13 · F-W3-06 · 源码与输出全文零 "W3C" 字样）。
2. **CLI 接线**（`src/cli-graph.ts`）：`graph ontology check [--file PATH] [--json]`（--file 缺省 = 包内 assets/ontology.yaml）+ help 行。exit 语义 fail-closed：Violation → 2 逐行点名（`shape @ where :: message` 探针同源）；仅 Warning/Info → 0 含警示行；不可读/解析失败 → 2。
3. **引用完整性真修**（`assets/ontology.yaml` · 接线前 3 处留证不改写 → 现余 1）：`DisciplinePackage`（Package 域）· `BusinessRepository`（Instance 域 · cli-graph-hgm.ts:255 活实例锚）补声明；`hasGate` 关系补声明（Task→HumanGate · :269 HAS_GATE 活边型追认 · S4.5-2 同源 · 闸行裁决③）。
4. **负向 fixture ×6 + 正向 + severity 分级 + fail-closed + --json 键集钉死 + help 钉 + 待答计数钉**（`test/ontology-check.test.ts` 新件 11 用例 · 红测先行留证：实现前全红 `graph 子命令未知: ontology` → 实现后全绿）。

## A4 既有面登记（20 审 R1-A4 · F-W2-13 同式 · 逐字 diff）

- `test/assets-ontology.test.ts` ③（唯一实破断言）：
  - 删：`assert.match(body, /未接线/, '须明示 ontology-check 本包未接线')`
  - 增：`assert.match(body, /graph ontology check/, '头注释须指向已接线的 graph ontology check（3.0-W3 S4.1）')` + `assert.equal(body.includes('未接线'), false, 'ontology-check 已接线 · 不得残留未接线自述')`
  - 理由：S4.1 接线后头注释「未接线」自述失真（R-TRUTH-1）——断言随 `assets/ontology.yaml` 头注释同 commit 翻转。
- `test/ontology-shallow.test.ts`：**盘点后零 diff**（ additive 兼容：classes 增行不破其断言 · 20 审预判成立）。
- 计划外既有面（登记）：`assets/sha256.manifest` —— ontology.yaml 内容变更致 assets verify hash 失配（exit 2 拦截实证），按提示 `assets manifest rebuild --yes` 重生成（两 commit 各一次 · 修复对象=manifest 声明 · 资产为真值）。其余测试一律零改动。

## TraceArtifact 待答状态（F-W3-08 · 验收 #3 挂起登记）

对账问法（a 伞类 / b 改指 / c 豁免 三分支 · task S4.2 末）已由 00 出示维护者（00 invoke 关键裁定 4）；**本棒开工时未随棒得答** → 按 task 硬步骤跳过 produces 处置（不擅自二选一 · 不静默放过），处置独立 commit 后补。机械锁：`test/ontology-check.test.ts` 登记项钉「3→1 · Violation × 1 = relations[3].object TraceArtifact」，得答处置落地后须翻转为 0 / exit 0。

## 锁逐项（本棒复跑实测）

| 锁 | 结果 |
|----|------|
| npm test | commit 1 前：737/141/736 pass/0 fail/1 skip（基线 726+新增 11 · duration 93.2s ≈ 基线 94s）· commit 2 前复跑同绿（见 commit 2 留证） |
| npm run typecheck | 0 错（两 commit 前各一次） |
| pins check | 17/17 PASS（pin-03 product_semver 钉不受 VersionShape 干扰 · 本包 2.4.2 对齐无警示行） |
| 探针复跑 | `node scripts/onto-probe.mts`：3 → **1**（仅余 TraceArtifact · exit 2 · 与校验器同源一致 · 探针保留独立实现作研究证据，数据面修复后自动同步） |
| graph ontology check（仓内件） | exit 2 · Violation × 1 = TraceArtifact（待答 · 登记钉死） |
| 零新依赖 | `git diff HEAD~2 -- package.json package-lock.json` 空 · lock 非 dev 顶层 = 2（argparse/js-yaml）不增 |
| assets verify | PASS 110/110（manifest 重生成后） |
| verify（GATE_VERIFY 复跑） | VERIFY: PASS |
| build / test:lib | 见 commit 2 前复跑留证 |

## 偏差登记

1. `docs/ontology/CURRENT_CAPABILITY.md:37` 与 `docs/ontology/DISCIPLINE_ALIGNMENT.md:21` 仍含「ontology-check 未接线」陈旧自述 —— 无测试钉面被破（ontology-shallow 仅钉 /F5=B|第二钉点/ 与 /ontology.yaml/）；归 S4.6 文案阶段统一处理（该阶段 own README/对外文案与负向 grep），本棒登记不动。
2. 探针脚本未改调 src 校验器（task S4.2「30 裁决：建议」为可选项）——保留独立实现作研究证据留证（研究文 §6.1 输出形态不动）；其校验逻辑与 src 校验器同源，数据面修复后输出自动同步（本棒 3→1 实证）。
3. 验收 #2「接线后 0 Violation」因 TraceArtifact 待答暂为 1 —— F-W3-08 既定挂起分支，非范围违约（task residual_risks ①：维护者长时不答则挂起不算范围违约 · 留痕即清偿）。

## 提交（逐文件显式 add · 禁 add -A · 不 push 不 tag）

- commit 1 `d960bc8` feat(3.0-W3): ontology-check 接线 —— src/cli-graph-ontology.ts · src/cli-graph.ts · test/ontology-check.test.ts · assets/ontology.yaml（头注释）· test/assets-ontology.test.ts（A4 登记）· assets/sha256.manifest
- commit 2（本 invoke 同批）fix(3.0-W3): ontology 引用完整性补声明 —— assets/ontology.yaml（classes +2 · relations +1）· test/ontology-check.test.ts（计数钉 3→1）· assets/sha256.manifest · 本 invoke

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 30 阶段一落档：A4 接线 + 引用完整性补声明（TraceArtifact 待答挂起登记）· 锁逐项实测 · A4 断言登记 diff |
