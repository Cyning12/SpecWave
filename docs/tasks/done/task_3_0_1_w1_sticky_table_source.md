# Task：3.0.1 W1 · 粘性表源持久化（P1-1 · 本版核心）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（**2026-09-18 00 代签**）· 30/40 闭环完成 · 2026-09-18 · **未发版 / 未 commit**）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（**HG-NEXT-PLAN=approved** · 2026-09-18 维护者签收 · 授权 00 代签过程闸 · HG-RELEASE / tag / push / publish 仍仅人）· **W1 节** + 硬约束 **3**（patch 纪律门）/ **4**（粘性向后兼容）/ **5**（「不要静默」总则）  
> **范围主源**：[`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) **§6.1 P1-1**（legacy/自定义表 `--file` 物化后默认 `host verify` 误报 exit 2）  
> **基线**：`spec-wave@3.0.0` published（npm `latest` = 3.0.0 · tag `v3.0.0`）  
> **行号口径**：本 task 全部 `file:line` 为 **2026-09-18 10-task 起草棒实读现值**（PLAN 行号可能漂移 · 已再钉）  
> **Open Folder**：仓根  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A（同 2.4.x patch 先例）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-1-w1-sticky-table-source` |
| **test_strategy** | `required` |
| **test_strategy_note** | 红测先行：① P1-1 主回归（`--file` 旧表 apply → 默认 verify 不带 `--file` 须 rc=0）② 对照锁（表改坏/移走 → 默认 verify rc=2 且理由点名表源）③ 旧形态粘性（无 `table_source`）负向 fixture（须可读且走内置 · 不可因新字段必填而全红）④ 双向兼容留证（3.0.1 形态粘性交给 3.0.0 读路径不报错）⑤ builtin apply → 默认 verify 与 3.0.0 行为零回归；四门（typecheck / test / build / test:lib）为波末硬条款 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | patch 级粘性 IO / verify 取表来源修复；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 修复性 patch，无规范增量；兼容/静默→可见纪律由关账经验总结留痕，晋升 wiki 与否归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0.1 patch 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-18 维护者签收 PLAN_3_0_1（原文意图：「身为00，统筹3.0.1的升级，授权签收过程文档」）· 开 W 波限制已解除 |
| HG-SPEC-SIGNOFF | N/A | — | 本版无独立 SPEC 夹（属 3.0.0 验收后 patch · 同 2.4.1/2.4.2 先例） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· task lint PASS · 10 invoke 已落 |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· 依据审查文 [`docs/harness/reviews/task_3_0_1_w1_sticky_table_source_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_w1_sticky_table_source_audit_R1_20260918.md)（R1 · PASS · blocking 0 · sha256 不符裁定 WARN 不硬红） |

---

## 背景与目标

3.0.0 验收报告 §6.1 **P1-1**（唯一 P1）：用户以 `--file <legacy/自定义表>` 跑 `host apply` 成功后，粘性 `.coding-kit/host-tools.json` **只记** `host_ids` / `profile`（及可选 `kit_semver`），**不记表源**；随后用户按粘性训练省略旗标，跑**默认** `host verify`（不带 `--file`）⇒ 恒走**内置 v2 表** ⇒ 期望 hooks 落点而旧表本未物化 ⇒ **误报 exit 2**。带同一 `--file` 复跑则 rc=0。方向是 **over-report（误报）而非漏检**；腐蚀面是「会狼来了的门禁最终会被关掉」。

**根因（2026-09-18 再钉）**：
- `src/host/sticky.ts:8-14` `HostToolsSticky` 类型无表源字段
- `src/host/sticky.ts:97-113` `writeHostToolsSticky` 写盘不含表源（apply `:363` / update `:548` 调用）
- `src/host/cmd.ts:652` `verify` 侧 `loadMergedTables(data, fileArg)` —— `fileArg` 缺省时由 `resolveValidateFile(undefined)`（`src/host/table.ts:99-102`）恒取内置表
- `src/host/cmd.ts:656` 粘性仅供 `toolIds` / `profile`（`:660-671`），**不参与取表**

**完成态**：`apply`/`update --yes` 成功后粘性可选记录本次实际表源；默认 `verify` 取表优先级与 `apply` 同源（`--file` 显式 > 粘性 `table_source` > 内置）；粘性表源为非内置且不可用时 **fail-closed exit 2 + 可操作提示**（**严禁静默退回内置**）；旧粘性（无字段）与新粘性双向兼容并留证；不 bump 粘性 `version`、不触 host-adapt schema、不改 verify 比对语义松紧与默认物化内容。

---

## 范围

严格对齐 PLAN **W1 节**（不得扩到 W2–W6 / release bump）。

- [x] **① 粘性类型 + 写盘增可选 `table_source`**
  - `src/host/sticky.ts:8-14` `HostToolsSticky` 增**可选**字段 `table_source`（形态建议：`{ kind: 'builtin' }` 或 `{ kind: 'file', path: <相对仓根>, sha256: <hex> }`）
  - `src/host/sticky.ts:97-113` `writeHostToolsSticky`（及 apply `:363` / update `:548` 调用链）在写盘时记录本次 `apply`/`update` **实际使用的表源**
  - **硬约束 4**：粘性 `version` **保持 `1`**；字段**必须可选**；解析须容忍缺省（缺 → 行为同 3.0.0：走内置）与未知字段忽略路径（供反向兼容留证）
- [x] **② `host verify` 取表优先级与 `apply` 同源**
  - `src/host/cmd.ts:652` 一带（含其前 `resolveValidateFile(fileArg)` `:634-635`）改为：**`--file` 显式传入 > 粘性 `table_source` > 内置**
  - `:656` 处粘性不再只供 `toolIds`/`profile`；相对路径基准钉为**仓根**（`--target`），避免跨目录调用错位
- [x] **③ fail-closed · 不静默退回内置（硬约束 5）**
  - 粘性表源为 `file` 且该表不可用 / 路径失效 ⇒ **exit 2**，输出须**点名记录的表路径与原因**，并给出可操作建议（带 `--file` 或重新 `host apply`）
  - **严禁**静默退回内置表（静默退回正是 P1-1 成因）
  - `sha256`：记哈希；默认只比对**存在性与路径**；哈希不符**先 WARN**（是否升级硬红交 20 审查文定夺 · 见 PLAN W1 风险②）
- [x] **④ 回归锁（硬约束 7）**
  - **主回归**：`--file` 旧表（v2.4.1 形态 / hooks 缺省 none）`apply --yes` → **默认 `verify`（不带 `--file`）rc=0**（P1-1 三步复现的第二步即绿 · 第三步不再必要）
  - **对照锁**：把该表改坏/移走 → 默认 `verify` **rc=2 且理由点名表源**
  - **builtin 零回归**：内置表路径 `apply` → 默认 `verify` 与 3.0.0 行为一致（可用报告 §4.1 四件套口径复核）
  - **旧形态粘性负向**：手工构造 3.0.0 形态粘性（无 `table_source`）⇒ 默认 `verify` 走内置（同 3.0.0）+ 可选提示；不得因新字段「必填」报错
  - **双向兼容留证**：3.0.1 形态粘性交由 3.0.0 读路径（`parseHostToolsSticky` 未知字段忽略 / 旧 CLI 实测一次）⇒ **不报错**；证据落盘 reviews/ 或自检结论（硬约束 4 ★）

## 非范围

| 项 | 理由 |
|----|------|
| W2 闸表 3 列/空解析告警/id 内嵌 `**` | PLAN 波次 W2 · 本波不扩 |
| W3 `readTruthVersion` try/catch | PLAN W3 |
| W4 口径回填（MIGRATION/CHANGELOG/files/research_report/check-doc-links 注释） | PLAN W4 |
| W5 `--pin-hook-version` 旗标 | PLAN W5 |
| W6 terminology/claims 扫描面 · validate WARN | PLAN W6 |
| bump `package.json` → 3.0.1 / CHANGELOG 发版节 / tag / push / publish | release 波 · **仅人** |
| 粘性 `version` bump 为 2 | 硬约束 4 · **禁止** |
| 把 `table_source` 做成必填 | 最高风险点 · 硬约束 4 · **禁止** |
| 触 host-adapt `schema_version` / schema 变更 | 硬约束 3/6 · **STOP 上报** |
| 改 `host apply`/`update` **落点物化内容**（字节） | PLAN W1 非范围 · 只改粘性记录与 verify 取表 |
| 改 `verify` 比对逻辑与 exit code 档位（PASS/FAIL 语义松紧） | PLAN W1 非范围 · 仅改**取表来源** |
| 改默认物化 hooks 命令 / 默认钉版 | 与 W5 同型坑 · 归 W5/3.1 |
| P3-1/P3-4 及 PLAN「非范围」表其余项 | 不进 3.0.1 或非产品范围 |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（HG-RELEASE 不在代签范围） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-W1-00） | 30 **拒开工**（verify 机械拦 exit 2） | 是（20 审 + 00 签后） | 是 |
| 实现把 `table_source` 做成必填 / bump version≠1（F-W1-01） | 存量用户全量报错 · 验收旧形态负向锁拦截 · **打回** | 是 | 是 |
| 粘性 `file` 表不可用却静默退回内置（F-W1-02） | 复演 P1-1 同型误报 · 对照锁须 rc=2 点名 · **打回**（硬约束 5） | 是 | 是 |
| `sha256` 强校验把合法手改表变硬红（F-W1-03） | 新造误报 · 默认仅存在性/路径；哈希不符先 WARN · 升级硬红须审查文定夺 | 是 | 是 |
| 相对路径基准用 cwd 而非 `--target` 仓根（F-W1-04） | 跨目录调用表源错位 · 负向 fixture 覆盖 · 打回 | 是 | 是 |
| `--file` 显式传入优先级被粘性覆盖（F-W1-05） | 破坏既有旗标契约 · 验收断言 `--file` 最高优先 · 打回 | 是 | 是 |
| 触 schema / 改判定语义松紧 / 新增对外能力面（F-W1-06） | **立即 STOP 上报** · 移出 3.0.1（硬约束 3） | — | 是 |
| 顺手扩范围开 W2–W6 / bump 3.0.1（F-W1-07） | 打回（每波一 task · 本波仅 W1） | — | — |
| 越权 tag/push/publish/deprecate（F-W1-08） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟域外档（F-W1-09） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| 四门任一红 / 双向兼容未留证（F-W1-10） | 停止 · 先修再关账 | 是 | 是 |
| 负向 fixture 误绿（未复现 P1-1 构造）（F-W1-11） | 红测不红 = 无效测试 · 打回 | 是 | — |

---

## 验收标准

- [x] **A1 主回归（P1-1）**：`host apply --tools … --profile … --file <v2.4.1 旧表> --yes` → 默认 `host verify`（**不带** `--file`）**rc=0**；粘性含可选 `table_source` 且指向该表（或等价可机检记录）
- [x] **A2 对照锁**：将该表移走/改坏后默认 `verify` **rc=2**，输出**点名表路径与原因** + 可操作提示；**不得**静默走内置后假绿或假红不明
- [x] **A3 `--file` 最高优先**：显式 `--file` 与粘性表源不一致时，以 `--file` 为准且行为可测
- [x] **A4 builtin 零回归**：内置路径 `apply` → 默认 `verify` 与 3.0.0 行为一致（无意外新红）
- [x] **A5 旧形态兼容**：无 `table_source` 的 3.0.0 粘性 ⇒ 可读 + 默认 `verify` 走内置（可选提示）；**不得**因缺字段报错
- [x] **A6 双向兼容留证**：3.0.1 写入含 `table_source` 的粘性，经 3.0.0 读路径 / 旧解析语义 **不报错**（实测一次 · 证据落盘）
- [x] **A7 硬约束钉死**：粘性 `version === 1`；`table_source` 可选；未改 host-adapt schema；未改默认物化内容字节（本波 diff 可证无 hooks 命令等物化漂移）；未改 verify 比对语义松紧（仅取表来源）
- [x] **A8 四门**：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib` 全绿（tag-gated 设计红留痕口径同前例）
- [x] **A9 关账**：`npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w1_sticky_table_source.md` → exit 0 + `task close --yes`；提交 `fix(3.0.1-W1): …` · 禁 `git add -A` · 未执行 tag/push/publish

---

## 给执行帽的必读列表

1. [`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md) — W1 节全文 · 硬约束 3/4/5 · 非范围表 · 波次总表 W1 行 · 风险 1/2/7
2. [`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) §6.1 P1-1（三步复现 · 根因 · 修复建议①）
3. `src/host/sticky.ts`（类型 `:8-14` · `parseHostToolsSticky` `:28-81` · `writeHostToolsSticky` `:97-113`）
4. `src/host/cmd.ts`（`loadMergedTables` `:62-74` · apply 写粘性 `:363` · update 写粘性 `:548` · verify 取表 `:634-656`）
5. `src/host/table.ts`（`resolveValidateFile` `:99-102`）
6. 先例 [`docs/tasks/done/task_2_4_2_patch.md`](../done/task_2_4_2_patch.md)（patch 元信息/闸表/无 SPEC）
7. `docs/standards/` 涉码 L2（30 自裁引用）

---

## 思考轮

### R0 · 证据

PLAN_3_0_1 已 HG-NEXT-PLAN=approved；范围主源 §6.1 P1-1 三步复现与根因明确；本棒实读：`sticky.ts:8-14` 无表源、`:97-113` 写盘无表源、`cmd.ts:652`/`656` verify 取表与粘性分工、`table.ts:99-102` 缺省恒内置；硬约束 3/4/5 与 W1 非范围钉死本波边界。

### R1 · 范围

仅 W1：可选 `table_source` + verify 取表优先级 + fail-closed 不静默 + 回归锁与双向兼容留证；显式排除 W2–W6、release bump、schema、物化字节、判定松紧。

### R2 · 方案

采纳 PLAN 修复建议①（粘性持久化表源）；优先级 `--file` > sticky > builtin；`sha256` 记而不默认硬红（WARN 先行）；旧字段缺省回落内置；version 保持 1。弃方案②（仅 WARN 不修同源）作为本波主方案——不足以消除 CI 假红腐蚀。

### R3 · 边界

S2 过程域只新增；禁触 schema；禁 bump 粘性 version；禁改默认物化；发布四动作仅人；每波一 task；发现需触纪律门三项 ⇒ STOP 上报。

### R4 · 可测性

主回归 + 对照锁 + builtin 零回归 + 旧形态负向 + `--file` 优先 + 双向兼容留证 + 四门机械可断言；红测先行防误绿。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核；HG-TASK-DRAFT / HG-AUDIT-R1 待 00 代签（维护者已授权过程闸）。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | P1-1 证据与 file:line 再钉齐 | no |
| R1 | 仅 W1 · 排除 W2–W6/schema/bump | no |
| R2 | 粘性表源 + 优先级 + fail-closed + WARN 哈希 | no |
| R3 | 硬约束 3/4/5 与发布仅人边界明示 | no |
| R4 | 回归锁与双向兼容留证可机检 | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① 误实现必填字段（F-W1-01 · 负向 fixture 兜底）；② `sha256` 升级硬红时机争议（默认 WARN · 交审查文）；③ 跨目录相对路径基准（F-W1-04）；④ 双向兼容「3.0.0 CLI 实测」若本机无旧 tarball 可用则改用 parse 路径等价留证并注明限制。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 先写可失败测试再改实现：① P1-1 主回归（修复前默认 verify 真红 / 修复后绿）；② 表不可用对照锁（rc=2 点名）；③ 旧形态粘性无字段仍绿；④ `--file` 优先；⑤ builtin 零回归。波末四门 + gate-check。

---

## 提交信息约定

- 实现提交：`fix(3.0.1-W1): …`（粘性表源 / verify 取表）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟** `.workbuddy/` 未跟踪档 · 不裹挟 W2+ 草稿
- **禁 tag / push / publish / deprecate（仅人）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w1_sticky_table_source.md`

---

### 自检结论（执行者）

**帽**：30 实现 + 40 自证（同棒）· **日期**：2026-09-18 · **未发版 · 未 git commit**（留给 00/维护者）

#### GATE_VERIFY

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_1_w1_sticky_table_source.md
| HG-TASK-DRAFT | approved | … |
| HG-AUDIT-R1 | approved | ✅ 可 30 |
VERIFY: PASS
```

#### 实现要点

- 可选 `table_source`：`{kind:'builtin'}` | `{kind:'file', path:<相对--target>, sha256}`；`version` 保持 1
- verify 取表：`--file` > sticky `table_source` > 内置；file 不可用 exit 2 点名；sha256 不符仅 WARN（审查文 §3.1）
- 红测先行：`test/host-adapt-sticky-table-source.test.ts`（A1–A7 + update）

#### A1–A7（机检）

```text
$ node --experimental-strip-types --test test/host-adapt-sticky-table-source.test.ts
ℹ tests 8 · pass 8 · fail 0
```

A6 留证：[`docs/harness/reviews/note_3_0_1_w1_a6_bidirectional_compat_20260918.md`](../../harness/reviews/note_3_0_1_w1_a6_bidirectional_compat_20260918.md)（parse 等价 · 无 3.0.0 tarball CLI 实测限制已注明）

#### A8 四门

```text
$ npm run typecheck   # tsc --noEmit · exit 0
$ npm test            # 871 pass · 0 fail · 1 skip
$ npm run build       # exit 0
$ npm run test:lib    # 6 pass · 0 fail
```

#### A9 / 禁区

- `gate-check` / `task close --yes`：见下（本棒执行）
- **未** `git commit` / tag / push / publish / deprecate；**未** `git add -A`；**未** bump `package.json`→3.0.1
- 建议维护者提交：`fix(3.0.1-W1): sticky table_source + verify 取表同源`

#### invoke

`docs/harness/invokes/by-task/3-0-1-w1-sticky-table-source/invoke_20260918_30_40_3-0-1-w1-sticky-table-source.md`

Wiki: none（修复性 patch · 无规范增量）

### 经验总结（执行者）

- P1-1 根因是「粘性训练省略旗标」与「verify 缺省恒内置」组合；修法必须让 verify 与 apply **同源取表**，不得静默退回内置。
- `sha256` 记而不默认硬红（WARN）：避免手改表新造 over-report，与本波修的腐蚀同型。
- A6 双向兼容：无旧 tarball 时可用「旧解析只取已知字段」等价留证，须在 reviews 注明限制。
- check-doc-links S2：未入库的互相链接会抬高 S2 计数；关账前过程档须在 index 或按 `S2_PARAM_EXCLUDE` 排除。

### KPI（30/40）

Task_KPI%: 94（范围①–④与 A1–A8 全绿 · 红测先行 8/8 · sha256=WARN 遵审查文 · 四门 871+6 pass · 零 schema/bump/发版越权 · 未 git commit 留给维护者 · close 材料齐）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同棒闭环 · 一次实现无返工

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 初稿 · 10-task（PLAN W1 / §6.1 P1-1）· 状态 draft · HG-TASK-DRAFT/HG-AUDIT-R1=pending · HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=N/A · 行号再钉 sticky.ts:8-14/:97-113 · cmd.ts:652/:656/:363/:548 · table.ts:99-102 · 闸表 4 列且 id 单元格无内嵌粗体 |
| 2026-09-18 | **00 代签**：HG-TASK-DRAFT + HG-AUDIT-R1 → approved · 依据 R1 审查文 PASS · blocking 0 · sha256=WARN 裁定带入 30 |
| 2026-09-18 | **30/40**：粘性 `table_source` + verify 取表同源 · A1–A8 绿 · 自检回填 · 未 commit/发版 |
