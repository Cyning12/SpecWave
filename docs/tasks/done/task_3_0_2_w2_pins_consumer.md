# Task：3.0.2 W2 · pins consumer 模式（F-3 + F-4 · 消费侧钉版保鲜闸）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（均 2026-09-23 00 代签 · 授权真值：维护者本窗「授权00签收所有过程文档」· 依据 R1 审查 PASS · blocking 0）· 30/40 闭环完成（四门 929 · 928 pass + 1 skip · 0 fail · release 零回归 64/64）· 2026-09-23 · **未发版 / 未 commit**）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_0_2_patch_v1_zh.md`](../../roadmap/PLAN_3_0_2_patch_v1_zh.md)（**HG-NEXT-PLAN=approved** · 2026-09-23 维护者签收）· **W2 节** + 硬约束 **3**（patch 纪律门 · additive 允许 / 默认面零漂移）/ **4**（「不要静默」总则）/ **9**（README 版本字面自律）  
> **范围主源**：ops-desk-api 反馈文 **F-3**（消费侧钉版散落四面手工对齐 · `pins check` 面向发布仓自身 · 消费仓无 `assets/release-pins.yaml` 即 exit 2 不可用）+ **F-4**（`readTruthVersion` 硬读 `package.json#version` · 消费仓 `private:true` 无 version 即误 BLOCK）  
> **基线**：3.0.2 W1 已 CLOSE: PASS（`task/specwave-3-0-2` 分支）· `spec-wave@3.0.1` published  
> **行号口径**：本 task 全部 `file:line` 为 **2026-09-23 10-task 起草棒实读现值**  
> **Open Folder**：仓根 · **工作分支**：`task/specwave-3-0-2`  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A（同 3.0.1 / 2.4.x patch 先例）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-2-w2-pins-consumer` |
| **test_strategy** | `required` |
| **test_strategy_note** | 红测先行：回退链四态 / --truth 三态 / ^~ 归一 WARN / 非精确拒 / 默认 CI 扫描漂移→fix→复跑 PASS / workflows 缺失提示 / 声明源自定义钉面与 failClosed / release 模式基线零回归；四门为波末硬条款 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `task/specwave-3-0-2` |
| **graph_delta** | `none` |
| **graph_delta_note** | pins 命令面 additive；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 消费侧反馈收口的能力波；无规范增量；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0.2 patch 波次系列；合入 main 与 tag/push 由 00 在验收后按本版授权代跑 |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-23 维护者签收 PLAN_3_0_2（原话「授权00签收所有过程文档，进行此版本的升级，验收完成后进行tag + push，只需要等人来发版」） |
| HG-SPEC-SIGNOFF | N/A | — | 本版无独立 SPEC 夹（同 3.0.1 / 2.4.x 先例） |
| HG-TASK-DRAFT | approved | 20, 30 | 2026-09-23 00 代签 · 授权真值：维护者本窗「授权00签收所有过程文档」· task lint PASS · 10 invoke 已落 |
| HG-AUDIT-R1 | approved | 30 | 2026-09-23 00 代签 · 依据 [`task_3_0_2_w2_pins_consumer_audit_R1_20260923.md`](../../harness/reviews/task_3_0_2_w2_pins_consumer_audit_R1_20260923.md)（PASS · blocking 0 · release 面冻结硬边界） |

---

## 背景与目标

消费仓每次升级 spec-wave 须手工对齐四个面：① `package.json` devDependencies exact；② CI workflow `spec-wave@x.y.z` 字面；③ 测试 mock 钉版字面；④ env 文档面。任一面漏改即静默漂移（测试 mock 旧版但 CI 新版）。现行 `pins check` 声明源 `assets/release-pins.yaml` 面向**发布仓自身**（F-A1-01 failClosed），消费仓无此资产即 exit 2 不可用（F-3）；且真值源 `readTruthVersion` 硬读 `package.json#version`，消费仓常 `private:true` 无 version（F-4 前置隐患）。

**完成态**：`pins check/fix --consumer` 落地——真值源回退链 + `--truth` 显式指定；可选声明源 `.spec-wave/pins-consumer.yaml`；缺省内置默认钉面（CI workflow `<pkg>@X.Y.Z` 字面逐文件合成具体 pin）；复用既有 `evaluatePin`/`planFix`/S2 拒写/备份避让机制；**release 模式（无 `--consumer`）行为与输出逐字不变**。

---

## 范围

严格对齐 PLAN **W2 节**。

- [x] **① CLI 面（additive）**
  - `pins check --consumer [--target PATH] [--json] [--truth <path#jsonpath>]`
  - `pins fix --consumer [--target PATH] [--yes] [--truth <path#jsonpath>]`
  - `--consumer` 缺省 = release 模式（现行行为逐字不变 · A8 机械钉）；`--truth` 仅在 `--consumer` 下合法（单独用 ⇒ exit 1 用法提示）
- [x] **② 真值源（F-4）**
  - 回退链：`devDependencies["spec-wave"]` → `dependencies["spec-wave"]` → `package.json#version`，首个存在者胜；三处皆缺 ⇒ exit 2 + `PINS: BLOCKED` **点名完整链条**
  - `--truth <path#jsonpath>`：path 相对 `--target` 仓根（禁绝对路径与 `../` 越界 · 复用 `resolvePinPath` 同口径）；jsonpath 为点分隔键（如 `devDependencies.spec-wave`）；文件缺/JSON 坏/键缺/值非串 ⇒ exit 2 点名；指定即跳过回退链
  - 包名：缺省 `spec-wave`；声明源 `package_name` 可覆盖（作用于回退链前两档与默认钉面正则）
  - 取值口径：精确 `X.Y.Z` 直接采用；`^X.Y.Z`/`~X.Y.Z` 剥前缀归一 + **stderr WARN**（`--json` 下入 `warnings` 数组 · 「不要静默」）；`*`/`latest`/`workspace:*`/`x.y.z` 以外范围表达式 ⇒ exit 2 + 可操作提示（建议改 exact）
- [x] **③ 声明源（可选）**
  - 路径 `.spec-wave/pins-consumer.yaml`（`version: "1"` · `package_name` 可选 · `pins` 复用既有 Pin schema：id/path/extract/expected/required/fixable/note）
  - `expected.kind: package-version` 语义 = **consumer truth**（复用 `expectedString` 映射 · 不新增 expected kind）
  - 声明源**存在** ⇒ 以其 pins 为准（替代内置默认钉面 · 文档明写「显式 > 缺省」）；语法坏 / 缺 pins 列表 / 行缺字段 ⇒ exit 2 failClosed（与 `loadPins` 同形态前缀）
  - 声明源 pin 落点路径安全：复用 `resolvePinPath`（禁绝对路径与 `../`）
- [x] **④ 内置默认钉面（声明源缺失时）**
  - 枚举 `.github/workflows/*.{yml,yaml}` → **逐文件合成具体 pin**：extract `{ kind: regex-all, pattern: '<pkg>@(\d+\.\d+\.\d+)', flags: g }` · expected `{ kind: package-version }` · `required: true` · `fixable: true`（包名正则特殊字符须转义）
  - workflows 目录不存在 / 零 yaml 文件 ⇒ **0 落点 + 显式提示行**（「未声明 `.spec-wave/pins-consumer.yaml` 且未发现 CI workflow 钉面 · 0 落点」· 不静默 PASS 假象 · 硬约束 4）
  - 合成 pin id 形态 30 自裁，但须**稳定可复现**（同仓两次运行 id 一致 · 建议含文件名）
- [x] **⑤ 求值与修复复用**
  - check：逐 pin 走既有 `evaluatePin`（consumer truth 注入）· 偏差 ⇒ exit 2（D-PINS-EXIT 语义沿用）
  - fix：默认 dry-run 零写盘 + 逐行 hunks 预览；`--yes` 写盘；S2 落点命中**整体拒写** exit 2（`isS2RelPath` 沿用 · 无豁免参数）；写前备份 `.bak` → 避让 `.pins-fix-backup` → 两级皆占跳过 exit 2（3.0-W5 NEW-8 机制沿用）；写盘成功自动清理自写备份
- [x] **⑥ 输出与信封**
  - 人类输出首行点名模式与真值来源，如 `pins check [consumer] · 真值源 package.json#devDependencies.spec-wave = 3.0.1 · 落点 N`
  - `--json` 信封**只增不改**：增 `mode: "consumer"` · `truth_source` · `warnings`（有 WARN 时）；release 模式信封零变化（既有 `truth_version`/`status`/`pins` 键不动）
  - 输出**无仓根绝对路径**（沿用 cli-json-no-abs-path 纪律 · 既有测试面会扫 pins --json）
- [x] **⑦ 文案**
  - `PINS_USAGE`（`src/cli-pins.ts:16-17`）+ `src/cli/usage.ts:87-88` pins 节补 consumer 两行 + 分工注（release 模式 = 发布仓自身 · consumer 模式 = 消费仓）
  - README / README.zh-CN 补一小节（consumer pins 用法 · 示例版本字面一律 `@<x.y.z>` 占位形态 · 硬约束 9 防 pin-05/06 钉面漂移）
  - `MIGRATION.md` 补「3.0.1 → 3.0.2 无动作项 · consumer pins 可选启用」
  - CHANGELOG 留 release 波写（本波不动）
- [x] **⑧ 测试（红测先行 · 新档 `test/pins-consumer.test.ts`）**
  - 回退链四态 / `--truth` 三态（正常 · 键缺 · 值非串）/ ^~ 归一 + WARN 可见 / 非精确拒（`*` · `workspace:*`）
  - 默认钉面：tmp 仓 devDeps 3.0.1 + workflow 内 `spec-wave@3.0.0` ⇒ exit 2 mismatch → `fix --consumer`（dry-run 零写盘断言）→ `--yes` 写盘 → 复跑 PASS
  - workflows 缺失 ⇒ 0 落点提示行可见
  - 声明源：自定义 pins（模拟测试 mock 字面文件清单）漂移 exit 2 · fix 写盘 · `package_name` 覆盖生效 · 坏语法/缺字段 exit 2
  - 越界防护：声明源 pin path `../x` / `--truth /abs` ⇒ 拒
  - release 模式零回归：`node bin/specgate.js pins check`（本仓）输出形态不变 · 既有 `test/pins-consistency.test.ts` / `test/w3-pins-io-failclosed.test.ts` 全绿不修改（除非 pin 计数行须机械同步 · 属设计内红须注明）

## 非范围

| 项 | 理由 |
|----|------|
| 改 release 模式任何行为/输出/exit 档位 | 硬约束 3 · A8 机械钉 |
| 新增 extract/expected kind（复用既有 schema） | 数据驱动纪律 · 不扩求值器 |
| 锁档（package-lock/pnpm-lock）版本钉 | 3.1 评估（PLAN 非范围表） |
| 多包 consumer 钉 / 声明源生成器 / 消费仓初始化向导 | 3.1 评估（PLAN 非范围表） |
| F-1② `.spec-wave/graph-vocab.yaml`（虽同目录约定） | 延 3.1.0 · 本波仅 pins 声明源 |
| F-2 `graph drift` | 延 3.1.0 |
| CHANGELOG 发版节 / bump 3.0.2 / spec 索引行 | release 波 |
| `git tag` / `push` / `npm publish` | release 波授权 / publish 仅人 |
| 触 host-adapt schema / 改既有默认行为 / 改判定语义松紧 | 硬约束 3 · **STOP 上报** |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-W2-00） | 30 **拒开工**（verify 机械拦 exit 2） | 是 | 是 |
| release 模式输出/行为漂移（F-W2-01） | 既有 pins 测试红 · 打回 | 是 | 是 |
| 回退链顺序错（version 先于 devDeps）（F-W2-02） | A1 红 · 打回 | 是 | 是 |
| ^/~ 归一静默（无 WARN）（F-W2-03） | 违硬约束 4 · 打回 | 是 | 是 |
| 零落点静默 PASS（F-W2-04） | 违硬约束 4 · 打回（提示行 + 测试钉） | 是 | 是 |
| 声明源坏语法被当「缺失」回落默认（F-W2-05） | failClosed 被绕过 · 打回（存在且坏 ≠ 缺失） | 是 | 是 |
| fix 默认写盘 / S2 落点被写（F-W2-06） | 违 S2 机械拒写 · 打回 | 是 | 是 |
| `--json` 信封改既有键 / 含绝对路径（F-W2-07） | 信封契约破 · 打回 | 是 | 是 |
| README 示例用真实版本字面（F-W2-08） | pin-05/06 钉面漂移 · 打回（`@<x.y.z>` 占位） | 是 | 是 |
| 顺手新增 extract kind / 开 release 波（F-W2-09） | 越非范围 · 打回 | — | — |
| `git add -A` 裹挟域外档（F-W2-10） | 打回（逐文件显式 add） | 是 | — |
| 四门任一红 / 误绿（F-W2-11） | 停止 · 先修再关账 | 是 | 是 |

---

## 验收标准

- [x] **A1 回退链四态**：devDeps exact ⇒ 用之；devDeps 缺 deps 在 ⇒ deps；均缺 version 在 ⇒ version；三处皆缺 ⇒ exit 2 点名完整链条
- [x] **A2 --truth 三态**：`custom.json#devDependencies.spec-wave` 正常取值且跳过回退链；键缺 ⇒ exit 2；值非串 ⇒ exit 2；路径越界（绝对/`../`）⇒ 拒
- [x] **A3 取值口径**：`^3.0.1`/`~3.0.1` ⇒ 归一为 `3.0.1` + stderr WARN（`--json` 入 `warnings`）；`*`/`workspace:*` ⇒ exit 2 + exact 建议
- [x] **A4 默认钉面闭环**：tmp 仓（devDeps 3.0.1 + workflow `spec-wave@3.0.0` 两处）⇒ check exit 2 报 2/2 失配 → fix dry-run 零写盘（文件内容不变断言）→ fix --yes 写盘 → 复跑 PASS
- [x] **A5 零落点提示**：无声明源且无 workflows ⇒ 输出含显式提示行（含 `.spec-wave/pins-consumer.yaml` 指引）
- [x] **A6 声明源**：自定义 pins（测试 mock 字面文件）漂移 exit 2 · fix --yes 写盘复跑 PASS；`package_name: dsh-coding-kit` 覆盖生效；坏语法/缺字段 exit 2 failClosed（**不**回落默认钉面）
- [x] **A7 fix 纪律**：S2 路径（如 `docs/tasks/x.md`）声明为落点 ⇒ fix 整体拒写 exit 2 零写盘
- [x] **A8 release 零回归**：`node bin/specgate.js pins check`（本仓）与 3.0.1 输出形态一致；既有 pins 测试全绿（pins-consistency / w3-pins-io-failclosed / cli-json-no-abs-path）
- [x] **A9 信封只增不改**：consumer `--json` 含 `mode`/`truth_source`（有 WARN 时含 `warnings`）· release `--json` 键集零变化 · 无仓根绝对路径
- [x] **A10 输出点名**：人类输出首行含 `[consumer]` 与真值来源（如 `package.json#devDependencies.spec-wave`）
- [x] **A11 文案**：PINS_USAGE + usage.ts 补 consumer 行；README 双语小节（`@<x.y.z>` 占位 · `grep -o 'spec-wave@[0-9.]*' README*.md` 仅现行版本命中）；MIGRATION 无动作项注
- [x] **A12 四门**：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib` 全绿
- [x] **A13 关账**：`gate-check` exit 0 + `task close --yes`；提交 `feat(3.0.2-W2): …` · 禁 `git add -A` · 未 tag/push/publish

---

## 给执行帽的必读列表

1. [`docs/roadmap/PLAN_3_0_2_patch_v1_zh.md`](../../roadmap/PLAN_3_0_2_patch_v1_zh.md) — W2 节全文 · 硬约束 3/4/9 · 风险 2/3/4
2. `src/cli-pins.ts` 全文（`:62-83` loadPins failClosed 形态 · `:85-106` readTruthVersion · `:590-594` runPinsCheck · `:612-652` planFix/unfixableReason · `:676-778` cmdPinsCheck/cmdPinsFix · `:780-798` cmdPins 旗标环）
3. `test/pins-consistency.test.ts`（release 基线 · 零回归面）· `test/w3-pins-io-failclosed.test.ts`（3.0.1 W3 同族测试样板）
4. `src/cli/usage.ts:80-95`（usage 体例）
5. 先例 [`docs/tasks/done/task_3_0_1_w3_pins_io_failclosed.md`](../done/task_3_0_1_w3_pins_io_failclosed.md)（同系列元信息 / 红测先行 / 闸表 4 列）
6. `docs/standards/` 涉码 L2（30 自裁引用）

---

## 思考轮

### R0 · 证据

PLAN_3_0_2 已 HG-NEXT-PLAN=approved；反馈 F-3/F-4 事实钉齐（`cli-pins.ts:62-83` loadPins 缺档 failClosed · `:85-106` version 硬读 · `:104` 缺 version 即 fail）；W1 已 CLOSE: PASS。ops-desk 四面场景（package exact / CI ×3 / mock ×16 / env 文档面）中前三面可机械钉 · env 文档面属消费仓自建口径（非本波）。

### R1 · 范围

仅 W2：--consumer 旗标 + 真值回退链 + --truth + 可选声明源 + 内置默认钉面 + 复用求值/修复 + 文案 + 测试。排除：release 模式任何改动 · 新 extract/expected kind · 锁档 · 多包 · F-1②/F-2 · release 波动作。

### R2 · 方案

关键取舍：① 声明源**存在即替代**默认钉面（显式 > 缺省 · 避免双层钉面打架）；② 默认钉面**逐文件合成具体 pin** 而非扩 Pin schema 加 glob（复用 `evaluatePin`/`planFix` 零改动 · 数据驱动纪律）；③ ^/~ 归一 + WARN 而非硬拒（消费仓存量 ^ 钉常见 · 「不要静默」折中）；④ `--truth` 仅在 --consumer 下合法（防 release 模式语义混淆）。

### R3 · 边界

release 模式逐字不变是硬边界（A8）；不新增求值器 kind 是硬边界；S2 拒写无豁免是硬边界；发现需改 release 行为才能实现 ⇒ STOP 上报。

### R4 · 可测性

A1–A13 全机检（tmp 仓 fixture · spawn CLI · 文件内容断言 · 输出正则 · diff --stat）· 无人工判读。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核；HG-TASK-DRAFT / HG-AUDIT-R1 待 00 代签。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | F-3/F-4 证据与 file:line 钉齐 | no |
| R1 | 仅 W2 · release 面冻结 | no |
| R2 | 四大取舍定案（替代语义/合成 pin/归一 WARN/--truth 限域） | no |
| R3 | 三大硬边界 · 需改 release 即 STOP | no |
| R4 | A1–A13 全机检 | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① 声明源坏被当缺失回落默认（F-W2-05 · 测试钉死「存在且坏 ⇒ exit 2」）；② 合成 pin id 不稳定导致 --json 消费方 diff 噪音（范围④要求稳定可复现）；③ README 示例字面误用真实版本（F-W2-08 · A11 grep 断言）；④ consumer/release 双模式文案分工不清致误用（范围⑦分工注）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 红测先行：新档 `test/pins-consumer.test.ts` 先写 A1–A7 用例（对未实现 CLI 红）→ 实现转绿；A8 零回归靠既有套件全程绿；波末四门 + gate-check。tmp 仓 fixture 用 node:test + mkdtemp（同 w3-pins-io-failclosed 样板）。

---

## 提交信息约定

- 实现提交：`feat(3.0.2-W2): pins consumer 模式（F-3/F-4 · 消费侧钉版保鲜闸 · ops-desk 反馈）`
- **禁 `git add -A`**：逐文件显式 add（`src/cli-pins.ts` · `src/cli/usage.ts` · `test/pins-consumer.test.ts` · README×2 · MIGRATION · 过程档）
- **不裹挟** `eval/external-oracle/` 未跟踪档 · 不裹挟 release 波草稿
- **禁 tag / push / publish**（tag/push 属 release 波授权 · 本波仅 commit 至 `task/specwave-3-0-2`）
- 波末跑 `node bin/specgate.js gate-check --task docs/tasks/active/task_3_0_2_w2_pins_consumer.md`

---

### 自检结论（执行者）

**帽**：30 实现（委派链 · 见下）+ 40 自证（fork `de06a1af` 验证电池 + 00 全量四门复跑）· **日期**：2026-09-23 · **未发版 · 未 git commit**（commit 由 00 执行）  
**实现作者链（delegate-only 全程守住 · 00 未写实现码）**：设计草稿 `c88a94be`（A1 红测档 + 函数级设计）→ 实现草稿 `79f0145b`（W1 功臣 · cli-pins 全文草稿）→ 誊写接线 `de06a1af` fork（微批①函数层 + 段6 fix 路径 + 段8 测试）· 文案 `fc81c6ef` fork（段7 usage/README×2/MIGRATION）· 设计裁决 R-1（无字面 workflow 预筛跳过 · 00 插入）

#### GATE_VERIFY

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_2_w2_pins_consumer.md
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS
```

#### 实现要点

- `src/cli-pins.ts` **+231/−8**（全 additive）：CONSUMER_PINS_REL · loadConsumerDeclaration（存在且坏 ≠ 缺失 failClosed）· normalizeConsumerVersion（^/~ 归一 + 可见 WARN）· readConsumerTruth（--truth path#jsonpath 全负向 + F-4 回退链点名完整链）· escapeRegExpLit · synthDefaultConsumerPins（sort 稳定 id consumer-wf-* · **R-1 数字锚内容预筛**）· printCheckHuman 可选 header（release 逐字不变）· cmdPinsCheckConsumer/cmdPinsFixConsumer · **runPinsFixBody 抽取共享**（S2 拒写/NEW-8 备份避让/unfixable 尾句单源）· 旗标环（--truth 限 consumer 域 exit 1）
- `test/pins-consumer.test.ts`（新档 · **19 用例全绿**）：A1×4 回退链 · A2×5 --truth · A3×3 取值口径 · A4×2 默认钉面闭环 + A4b R-1 预筛 · A6×4 声明源 · A7×1 S2 拒写
- 文案：`src/cli/usage.ts` +3 · README 双语各 +29 小节（@<x.y.z> 占位 · pin-05/06 不破 · **pins check 17/17 PASS**）· MIGRATION +11「3.0.1 → 3.0.2 无强制动作项」
- **release 零回归钉死**：pins-consistency 64/64 · w3 6/6 · cli-json-no-abs-path 34/34（多次复跑一致）

#### 验收勾选

- [x] A1 回退链四态 · A2 --truth 三态+越界 · A3 ^/~ 归一 WARN + 非精确拒 · A4 默认钉面闭环（dry-run 零写盘 → --yes 写盘 → 复跑 PASS · consumer-wf-ci）· A5 零落点提示行 · A6 声明源（自定义/fix/package_name/坏不回落/越界）· A7 S2 拒写零写盘
- [x] A8 release 零回归（64/64 + 6/6 + 34/34）· A9 信封只增（mode/truth_source/warnings · 无绝对路径）· A10 输出点名 [consumer] + 真值来源 · A11 文案（usage/README/MIGRATION · grep 仅 @3.0.1 命中）
- [x] A12 四门：typecheck 0 · npm test **929 · 928 pass + 1 skip · 0 fail** · build 0 · test:lib 6/6（00 复跑 · npm_config_cache=/tmp 绕本机 EPERM）
- [x] A13 gate-check + task close（00 执行）· 提交逐文件显式 add · 未 tag/push/publish

#### invoke

`docs/harness/invokes/by-task/3-0-2-w2-pins-consumer/invoke_20260923_30_40_3-0-2-w2-pins-consumer.md`（含作者链与微批过程留痕）

Wiki: none（能力波 · 无规范增量）

### 经验总结（执行者）

- **大体量实现委派的三形态与解法**：自由生成易长转（两 Agent 各空转 3-4 轮）⇒ 有效链路 = 设计草稿与实现草稿分离产出（消息文本即可）→ fork 继承上下文 + **微批机械誊写规格**（函数级逐步骤 + 每段验证判据）→ 段7/段8 按文件面并行拆分。三次「中断 + 收窄 + 重贴规格」均立即促成交付。
- **磁盘心跳须区分风格**：「零产出」可能是「晚产出」（c88a94be 一次性交出测试档+完整设计草稿）；心跳查问给一轮窗口再干预。
- release 零回归的最强钉 = pins-consistency 64/64 反复跑（每次实现段落盘后必跑）；printCheckHuman 加可选 header 而不改默认行是「additive 不碰旧面」的范式。
- R-1 类细化（预筛跳过无字面文件）来自草稿评审期的边界追问——实现草稿的「注意点」段值得逐条过，常藏真场景。

### KPI（30/40）

Task_KPI%: 95（范围①–⑧与 A1–A13 全绿 · release 零回归多轮钉死 · R-1 边界细化捕获真实误报场景 · 作者链与微批过程全留痕；扣分：两名首派 Agent 空转耗轮 · 委派节奏管理成本）

- rubric：`KPI_RUBRIC_v1_2` · 30（委派链四棒）+ 40（fork 验证电池 + 00 四门复跑）

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-23 | 初稿 · 10-task（PLAN W2 / 反馈 F-3+F-4）· 状态 draft · HG-TASK-DRAFT/HG-AUDIT-R1=pending · 行号实钉（`cli-pins.ts:62-83/:85-106/:590-594/:612-652/:676-798` · `usage.ts:87-88`）· 闸表 4 列且 id 单元格无内嵌粗体 |
| 2026-09-23 | **00 代签**：HG-TASK-DRAFT + HG-AUDIT-R1 → approved · R1 PASS · blocking 0 |
| 2026-09-23 | **30/40**：委派链四棒（c88a94be 设计 → 79f0145b 草稿 → de06a1af 誊写微批①/段6/段8 · fc81c6ef 段7）· cli-pins +231/−8 · 测试 19 用例 · release 零回归 64/64 · 四门 929/928+1skip/0fail · gate-check/close · 未 commit |
