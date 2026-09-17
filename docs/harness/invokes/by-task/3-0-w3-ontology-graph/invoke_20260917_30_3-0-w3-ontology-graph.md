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

## 阶段二（F2 真口径 + 判据加固六项 · 验收 #4/#8 · 00 放行）

GATE_VERIFY 复跑：双闸 approved · VERIFY: PASS。

### F2 真口径（S4.3 · src/cli-lifecycle.ts）

- `discipline show` / `lifecycle show` 增 `[--target PATH]`（缺省 = cwd · resolveTarget · DEF-019 同口径）；
  三层解析优先级：`<target>/assets/harness/<name>` → `<target>/.coding-kit/assets/harness/<name>` → `packageRoot()` 兜底；
  human 输出首行 `source: <相对路径>` / `source: package-fallback（消费者资产未找到 · 显示包内自述口径）`；
  `discipline show` SoT 尾注行按实际来源改写（fallback 标 `包内 …（package-fallback）`）。
- 坏资产即红：消费者资产（1/2 层）解析/校验失败 → exit 2 点名路径（不静默回退）；三层均缺 → exit 2 fail-closed
  （30 裁决登记：task「现状 :57 同口径延续」与「exit 2 fail-closed」字面冲突，采 fail-closed 统一 exit 2 ·
  grep 实证无既有断言钉缺件 exit 1 面）。
- dry-run 维持包内自述口径（S4.3 范围 = show 双命令 · 传 packageRoot() 走三层解析第 1 层即包内件 · 行为逐字等价现状）。
- 机检一致（验收 #4 · test/cli-f2-asset-source.test.ts 8 用例 · 红测先行 8/8 先红后绿）：
  --json 与所读 yaml deep-equal · human 计数重算一致 · sample ⊆ statements · 来源正（消费者版生效）/误（fallback 标注）
  fixture · 坏资产 exit 2 fixture ×2 · 优先级 fixture · dogfood cwd 缺省钉。

### 判据加固六项（S4.4 · src/cli-graph-hgm.ts · 附录 A 配方机械复现）

修复前真值面：研究文 §5.1 在案 + 本棒开工复跑逐字一致（a1 误报 exit 2 · a2 漏报 · b1 永久红 · b2 PASS · c1 恒 warn · c2 恒绿）。
修复后复跑（同配方）：六构造全 exit 0 —— a1 转绿 · a2 PASS（D2 正确不管）· b1 转绿 · b2 仍绿 · c1 violations 0 零 D3 噪声 · c2 violations 0（公理移除）。

| 项 | 处置 | 修复后判据 fixture（test/graph-axioms-hardening.test.ts 9 用例 · 红测先行 6 红 3 对照绿） |
|----|------|------|
| ADV-A1/A2 · D2 裸子串 | **必修落地**：`.includes('30')` → `hatIdMatchesSegment`（split('-') 首段等值 '30' · 禁裸子串 · 导出供 S4.5 hat 词汇归一复用） | a1 转绿（130-helper PASS）· a2 PASS + 登记（execute-code 属未声明帽漂移 · 兜住面 = S4.5 hat 词汇 Warning · F-W3-09 · 阶段三）· 真阳性对照（30-execute-code / 短形 30 仍 FAIL exit 2 点名 D2 · 不削弱） |
| ADV-B1/B2 · rejected→draft | **接真 (i) 落地**（task 定稿主选）：① ingestRepo 补发 TaskStatusChanged（md status ≠ 事件轨投影时 · 幂等键 idempotencyKey 扩展 new_status 摘要 · 重跑零重复 fixture 钉死）；② 公理新语义（task 定稿自由度「或按公理新语义判定」内 30 定稿）：清偿后继 = TaskStatusChanged(draft) ∨ 同闸 GateStatusChanged(≠rejected) | b1 转绿（rejected→approved PASS）· b2 仍绿（兼容面不收回）· b3 接真 fixture（漂移补发 → 清偿 PASS · 幂等）· 真红保留（rejected 后静默搁置仍 FAIL exit 2 点名） |
| ADV-C1 · D3 空转 | **移除+登记落地**：删除公理 + 码注释登记（CHECKED 边不可构造 · 恒 warn 噪声 · 零消费者 · 接真归 W6 G7） | c1 violations 无 D3 项 PASS · 注释锚断言在案 |
| ADV-C2 · S2 死判据 | **移除+登记落地**：删除公理 + 码注释登记（SYNCED 边不可构造 · 恒绿假安全感 · S2 真保护在 isS2RelPath 执行侧拦截 · 对外文案不得声称 axioms check 保护 S2 —— 文案负向 grep 归验收 #12 阶段四面） | c2 violations 无 S2 项 PASS · 注释锚断言在案 |

### 既有面盘点（盯防结论 · F-W2-13 同式 · 除 A4 两件外零自改）

- `cli-g1g7:354-380` PASS/FAIL 冒烟：fixture 闸表短形 `30` 经段边界判仍命中 D2 → 零破（全绿实证）；
- `cli-json-no-abs-path:377-381`（axioms --json 相对化）与 :422-433（show --json 无绝对前缀 · fallback 层）零破；
- `cli-discipline-coverage` ③（/as_of: 2.4.2/ · /status 口径 = 本包实接线/）零破（两行保留）；
- dry-run 守卫系（cli-lifecycle-guards / cli-task-close-guards 等 tmp fixture 仓无 assets/harness → fallback 包内件）零破；
- grep 实证 test/ 无 D3/S2/rejected→draft/TaskStatusChanged/CHECKED/SYNCED 公理断言面（assets-ontology ④ 的裸公理 id 正则是 ontology.yaml 面 · 不涉及 hgm）；
- **timeline --task 全绿**（eventMatchesTaskSlug 未动 · snapshot 消费面零变更 · buildSnapshot 本阶段零改动）。

### 锁逐项（阶段二）

| 锁 | 结果 |
|----|------|
| npm test | 合并态 754/143/753 pass/0 fail/1 skip（duration 94.5s）· commit 3 独立态（stash 隔离）745/142/744/0 · commit 4 前 754 同绿 |
| typecheck / build / test:lib | 0 错 · PASS · 6/6 |
| pins / verify / assets verify | 17/17 · VERIFY: PASS · 110/110（本阶段未动 assets · 无需 rebuild） |
| 附录 A 复跑 | 修复前六构造逐字一致在案 → 修复后六构造全 exit 0（真红残留面 = b1r/a3 对照 fixture 钉死） |

### 提交（逐文件显式 add · 禁 add -A · 不 push 不 tag）

- commit 3 `b710c0c` feat(3.0-W3): F2 真口径 —— src/cli-lifecycle.ts · test/cli-f2-asset-source.test.ts
- commit 4（本批）fix(3.0-W3): graph axioms 判据加固六项 —— src/cli-graph-hgm.ts · test/graph-axioms-hardening.test.ts · 本 invoke 追加

### 偏差登记（阶段二）

1. task S4.3「三层均缺 → exit 2 fail-closed（现状 :57 同口径延续）」字面冲突（:57 现状 fail 默认 exit 1）—— 30 裁决采 fail-closed 统一 exit 2（仓内 fail-closed 语义 = exit 2 · 无既有断言钉 exit 1 缺件面 · grep 实证），登记备 20/00 复核。
2. a2 兜住面（未声明帽 Warning）归阶段三 S4.5 —— 本阶段仅钉 D2 边界行为 + 登记（task 定稿原文即如此分派）。
3. 验收 #12「无 axioms check 保护 S2 叙事」文案负向 grep 归阶段四（ONTO-OPEN/文案面）—— 本阶段码注释登记先行。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 30 阶段一落档：A4 接线 + 引用完整性补声明（TraceArtifact 待答挂起登记）· 锁逐项实测 · A4 断言登记 diff |
| 2026-09-17 | 30 阶段二追加：F2 真口径 + 判据加固六项 · 附录 A 修复前后复跑留证 · 既有面盘点零自改 · 偏差三条登记 |
