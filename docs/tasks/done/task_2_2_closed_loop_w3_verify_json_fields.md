# Task：2.2 W3 · `verify --json` 补可观测字段（C2）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-11） · **wave**：W3  
> **关联 SPEC**：[`docs/spec/2_2-closed-loop-start/02_security_closure_v1.md`](../../spec/2_2-closed-loop-start/02_security_closure_v1.md) §W3（C2）· [`06_waves_and_acceptance_v1.md`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W3  
> **依赖**：无硬依赖（建议 W2 先落，避免 `--json` 与拒止路径输出改动相互打架）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-2-closed-loop-w3-verify-json-fields` |
| **test_strategy** | `required` |
| **test_strategy_note** | 四字段测试断言 + 既有字段回归断言；契约只增不改由 diff 级测试钉死 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | CLI JSON 输出字段增量；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | JSON 契约增量落 CHANGELOG；不晋升 coding_wiki |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身发版系列；合入由维护者 push+tag（同 2.1.2 先例） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-11 会话预授权 · 00 代签落表（[`docs/harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md`](../../harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md)） |
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-11 会话预授权 · 00 代签落表（同上审查文） |
| HG-TASK-DRAFT | **approved** | 20, 30 | 人 · 2026-09-11 会话预授权 · 00 代签 |
| HG-AUDIT-R1 | **approved** | ~~30~~ | 人 · 2026-09-11 会话预授权 · 00 代签落表 · R1 pass（[`docs/harness/reviews/task_2_2_closed_loop_w3_verify_json_fields_audit_R1_20260911.md`](../../harness/reviews/task_2_2_closed_loop_w3_verify_json_fields_audit_R1_20260911.md)） |

---

## 背景与目标

`verify --json` 缺 `traceId` / `exitCode` / `source` / `injectedFiles`，而安全设计 §7.2 明文要求（事实卡 §11 亦列其为缺字段）。

**完成态行为**：`verify --json` 输出在既有字段之上**只增不改**地补四字段；traceId 为单次运行级标识（不接外部遥测 · 零云纪律）。

---

## 范围

- [x] `verify --json` 补 `traceId`（单次运行标识）
- [x] 补 `exitCode`（与进程退出码一致）
- [x] 补 `source`（判定来源）
- [x] 补 `injectedFiles`（注入文件清单）
- [x] 测试断言四字段存在与语义 + 既有字段回归不变

## 非范围

- **契约只增不改**：既有字段名与语义不变（下游可能已消费 · F-W3-01）
- `audit --json`、审计落盘不做（C6 · 3.0）
- traceId 不接外部遥测（零云纪律）
- 落地前对外文案**仍不得**宣称 JSON 可观测性完整（事实卡 §11 禁称 · 发布后由事实卡维护者解除）

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| `--json` 改既有字段语义（F-W3-01） | 验收 FAIL · 契约只增不改 | — | — |
| `exitCode` 与进程实际退出码不一致 | 测试断言红 · 验收 FAIL | 是（修实现重跑） | 是 |
| traceId 试图接外部遥测/网络 | 拒设计（零云纪律）· 打回 | — | — |
| 对外文案提前宣称 JSON 可观测性完整 | 打回（事实卡 §11 · F-X-04） | — | — |

---

## 验收标准

- [x] `verify --json` 输出含 `traceId` / `exitCode` / `source` / `injectedFiles` 四字段且有测试断言
- [x] `exitCode` 字段值与进程退出码一致（测试断言）
- [x] 既有字段回归不变（测试断言 · 契约只增不改）
- [x] 对外文案零违禁宣称（grep 自查 · 事实卡 §11）
- [x] `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` 四门绿（与 `.github/workflows/ci.yml` 一致 · 06 硬纪律 A-2.2-12）
- [x] `npx --yes spec-wave task lint-wiki-delta --target .` 通过（wiki_delta 预检）
- [x] 波末 `npx spec-wave gate-check --task <本 task>` 通过（HG-AUDIT-R1=approved 后）

---

## 给执行帽的必读列表

1. SPEC：[`02_security_closure_v1.md`](../../spec/2_2-closed-loop-start/02_security_closure_v1.md) §W3 · [`06`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W3 + A-2.2-06
2. `src/cli.ts` verify 命令 `--json` 输出组装点（30 自行定位 · 注意与 W2 拒止路径的 exit 码一致性）
3. 安全设计 §7.2 字段要求（SPEC 02 §W3 证据行所引）
4. 事实卡 `.workbuddy/output/推广事实卡-2.1.3.md` §11（禁称清单）

---

## 思考轮

### R0 · 证据

SPEC 02 §W3：缺四字段属实（PROMPT §3 W3 行 + 事实卡 §11 双源）。

### R1 · 范围

仅 `verify --json` 四字段增量；audit --json / 审计落盘 / 遥测均出范围。

### R2 · 方案

（30 前由 20 审复核：traceId 生成口径——进程内随机/时间戳基运行标识【荐 · 零依赖】vs 引入 uuid 依赖【弃 · 零云零依赖纪律】；injectedFiles 来源复用 verify 既有注入清单数据流【荐】。）

### R3 · 边界

契约只增不改 · 零云 · exitCode 必须与真实退出码同源（禁止两处各算）。

### R4 · 可测性

四字段存在性 + exitCode 一致性 + 旧字段回归三类断言先红后绿。

### R5 · 签收就绪

本槽由 20-task-audit R1 复核后判充分；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 双源证据一致 | no |
| R1 | 单命令四字段 · 最小增量 | no |
| R2 | 运行级标识零依赖（待 20 复核） | no |
| R3 | 契约只增不改 · exitCode 同源 | no |
| R4 | 三类断言先红后绿 | no |
| R5 | 待 20 审裁定 | no |

**residual_risks**：下游若已按字段序/字段全集做严格校验可能感知新增字段（缓解：CHANGELOG 明示新增四字段 · 属只增契约允许面）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 先可失败字段断言再改实现；旧字段回归必须仍绿。

---

## 提交信息约定

- 提交信息：`feat(2.2-W3): …`（独立提交 · 前缀不变）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟 D0 未提交改动**（`delivery/promotion/` 4 份 + `package.json` description/keywords · F-X-06 / D0-PROT）
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w3_verify_json_fields.md`

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 2026-09-11 · 全部命令真实执行 · 完整输出见 invoke `invoke_20260911_30_40_2-2-closed-loop-w3-verify-json-fields.md` 与交付汇报）

**实现摘要**：新模块 `src/inject-collect.ts`（cordis-free）收口 M1 注入收集逻辑（自 `index.ts` 逐字节搬迁：resolveReadRoot / listMarkdownFiles / includeForProfile / DEF-017 24k 截断 · cordis/dsh-tools 系 devDependencies，CLI 不得经 index.ts 传递依赖）；`src/index.ts` 改 import + 再导出 `loadMarkdownBundle`（插件面契约不变 · assets.test.ts 原路径导入仍绿）；`src/cli.ts` `VERIFY_BLOCKED_EXIT_CODE=2` 唯一常量（exitCode 同源纪律 R3 · JSON 字段与 fail() 共用 · verify 内 9 处 `fail('',2)` 全改引常量 · gate-check/audit/close 等其他命令不动）；`collectVerifyObservability()`（traceId=`verify-<ts36>-<4B hex>` 进程内生成 · 零依赖零云 · 不接外部遥测；source/injectedFiles 复用 `loadMarkdownBundle('l1+l2')` 注入默认档 · 安全设计 §7.2 T-03 取证基线口径）；task/spec 两模式 emitJson 同口径只增不改补四字段（位置：既有字段之后 · waived/wiki_lint/skipped 条件字段之前）。

**验证命令与退出码**（cwd=仓根 · 行为自证用本地构建产物 `node bin/specgate.js`（npx 发布版 2.1.3 尚无本波代码））：

| 命令 | exit | 结果 |
|------|------|------|
| `npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w3_verify_json_fields.md`（开工前 GATE_VERIFY） | 0 | VERIFY: PASS · HG-TASK-DRAFT/HG-AUDIT-R1 均 approved 与声称一致 |
| 先红：`node --test --experimental-strip-types test/cli-verify-observability.test.ts`（实现前） | 非 0 | 四字段断言全红（traceId 两次运行均 undefined · PASS/BLOCKED 态缺四字段） |
| `node bin/specgate.js verify --target . --task <本 task> --json`（PASS 态自证 · node 断言） | 0 | 含四字段 · traceId=`verify-mtxt8gzf-7e0d98c7` · exitCode=**0**=进程退出码（PASS_PROC_EXIT=0）· source=`package` · injectedFiles=13（全相对路径）· command/verdict/blocked/target/task 回归不变 |
| BLOCKED 态自证（临时消费者仓 fixture seed .git · 缺 R<n> 审查文 → verify --json） | **2** | BLOCKED_PROC_EXIT=**2** · JSON exitCode=**2**=进程退出码 · verdict=BLOCKED · 四字段仍在 |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **444/444 pass**（439 基线 + 新增 cli-verify-observability 5 测：双态四字段 + exitCode 一致性 + 键集 diff 级钉死 + 旧字段回归 + traceId 运行级 + --spec 模式） |
| `npm run build` | 0 | — |
| `npm run test:lib` | 0 | 4/4 pass |
| `npx --yes spec-wave task lint-wiki-delta --target .` | 0 | LINT-WIKI-DELTA: PASS · scanned 54 · missing 0 |
| 事实卡 §11 违禁宣称自查：`git diff` grep「可观测性完整 / observability complete」 | 0 命中 | 零违禁 · 事实卡本体不动（解除归发布后维护者 · F-X-04） |
| `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w3_verify_json_fields.md`（波末） | 0 | 闸检查：未发现阻塞 |

**验收 7 条全部 pass**（四字段存在+断言 · exitCode 双态与进程退出码一致 · 旧字段回归+键集 diff 级钉死 · 零违禁宣称 · 四门绿 · lint-wiki-delta · 波末 gate-check）。

**已知未测项**：CI workflow 实跑（本地四门与 CI 同源已绿）；`--json` `target` 字段维持现状（W2 留痕 · 契约只增不改仅允许新增）；下游字段全集严格校验感知新增字段（task residual_risks 已登记 · CHANGELOG Unreleased 已明示新增四字段）。

---

### KPI（00）

Task_KPI%: 100（验收 7/7 自证通过 · 四门绿 · PASS/BLOCKED 双态 exitCode=进程退出码实测 · 444/444 测试含 5 新增全绿 · 契约只增不改由键集 diff 级断言钉死 · 事实卡 §11 零违禁）

---

### 经验总结

1. **CLI 复用插件面逻辑须先切断运行时依赖**：`index.ts` 顶部 import cordis/dsh-tools（devDependencies · 消费者仓不存在），CLI 直接 import `loadMarkdownBundle` 会让发布包在消费者侧崩；将注入收集逻辑收口到 cordis-free 的 `inject-collect.ts` 后两侧共用同一实现源（R3「禁止两处各算」），index.ts 仅以再导出保持插件面契约。
2. **「字段与退出码同源」用常量收口而非约定**：`VERIFY_BLOCKED_EXIT_CODE` 单常量同时喂 emitJson 的 `exitCode` 字段与 `fail()`，9 处调用点逐处改引；测试再以「JSON 字段 === 进程真实退出码」双态断言外证，同源纪律既有内证（单常量）又有外证（进程级断言）。
3. **契约只增不改的可测形**：键集 diff 级断言（无旗标时 keys === 既有五键 + 新增四键）比逐字段存在断言更能钉死「不删不改既有字段」；新增字段一律置于既有字段之后、条件字段（waived/wiki_lint/skipped）之前，下游字段序感知面最小。
4. **wiki_delta 作答**：`none` —— JSON 契约增量落 CHANGELOG（Unreleased · 随发版棒）；以上为仓内工程经验，无可晋升 coding_wiki 的通用编码规范增量（stable 判定由 CLOSE 棒复核 · 与元信息 `wiki_delta_note` 一致）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-11 | 初稿 · 10-task 批量拆波（W2–W7 每波一份 · 00 委派）· 预填 Harness 元信息 + wiki_delta |
| 2026-09-11 | W3 实现落地 · 30+40 闭环：verify --json 只增不改补 traceId/exitCode/source/injectedFiles（inject-collect 收口 · VERIFY_BLOCKED_EXIT_CODE 同源常量 · task/spec 双模同口径）· cli-verify-observability 5 测新增 · 验收 7/7 自证全过（提交 da66325） |
