# Task：3.0 W0 · 重构预备（refactor prep · 三 god-file 拆分 barrel 化 + E3 第一批 + 六重锁 + M1 验收文）

> **状态**：`done`（2026-09-16 30 实现棒 W0 收官 · HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗双签）· HG-TASK-DRAFT=approved（2026-09-16 00 代签）· HG-AUDIT-R1=approved（2026-09-16 00 代签 · R1 审查文 PASS-with-issues）· 六重锁全绿 · M1 落盘）  
> **SPEC 真值**：[`docs/spec/3_0-architecture-leap/01_w0_refactor_prep_v1.md`](../../spec/3_0-architecture-leap/01_w0_refactor_prep_v1.md)（范围 ①–⑥ · 六重锁 · 方案对比 · 验收 1–5 · F-W0-01–06）· 政策边界 [`00_policy_and_boundaries.md`](../../spec/3_0-architecture-leap/00_policy_and_boundaries.md) · 系列 README [`README.md`](../../spec/3_0-architecture-leap/README.md)（D-30-VERSION-ROUTE / D-30-BARREL 已定案 · W0-SPLIT 待决归本 task）  
> **上游 PLAN**：[`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W0 节（W0.1–W0.7）  
> **本波非功能：零行为变更** · 提交 `refactor(3.0-W0): …` / `test(3.0-W0): …`（**不迁 2.5.0** · D-30-VERSION-ROUTE）  
> **基线（2026-09-16 本棒复跑实测 · 详见「开工基线」节）**：HEAD `1067f32`（tag `v2.4.2` ↔ `2557119` 已推远端）· npm test 607 用例（4 红全为环境红 · 详见 F-W0-07）· typecheck 0 错 · build 0 错 · test:lib 6/6 · pins check 17/17  
> **环境警示**（沿用 2.4.2 教训）：本机 `/usr/bin/git` 可能是 Xcode shim（exit 69）——git 调用异常时 `PATH="/opt/homebrew/bin:$PATH"` 前置重跑；**裸跑全红须先做对照实验再下结论**；本棒另实测 npm cache 含 root-owned 文件致 pack 系 4 用例 EPERM 环境红（F-W0-07）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-w0-refactor-prep` |
| **test_strategy** | `required` |
| **test_strategy_note** | 验收主体 = **零行为变更六重机械锁**（用例计数 / 消费者 import 零 diff / 导出面快照 / test:lib+pins / typecheck+build / 对外可达面不变式）+ E3 下沉等价单测（「删了不补 = 未完成」）+ M1 独立验收文留证；每 commit 前后 npm test 同绿（以开工复跑实测为基线，不沿用旧数字） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 纯内部重构 + 测试下沉；不改图谱资产（`docs/_tech_graph/` 零触碰） |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 非功能波，无规范增量；「环境红对照实验先行」与「基线复跑不沿用旧数字」教训由 M1 验收文承载，晋升 wiki 与否归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · **2026-09-16 维护者本窗签收 PLAN_3_0**（3.0 双签之一） |
| HG-SPEC-SIGNOFF | **approved** | — | 人 · **2026-09-16 维护者本窗签收 3.0 SPEC 系列**（同时授权 00 代签后续过程文档闸） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-16 00 代签** · 授权真值：维护者本窗「签收，授权00签收后续所有文档」（HG-RELEASE 不在范围） |
| **HG-AUDIT-R1** | **approved** | **30** | **2026-09-16 00 代签** · 授权真值：维护者本窗「签收，授权00签收后续所有文档」 · 依据审查文 [`docs/harness/reviews/task_3_0_w0_refactor_prep_audit_R1_20260916.md`](../../harness/reviews/task_3_0_w0_refactor_prep_audit_R1_20260916.md)（R1 · PASS-with-issues · blocking 0 · advisory A1–A4 · A1 已搭车修 · A2/A3/A4 带入 30 执行要求） |

---

## 背景与目标

三个 god-file 合计 **3783 行 = `src/` 的 38.4%**（2026-09-16 本棒复核实测，与 SPEC 快照一致：`cli-host.ts` 1458 · `cli.ts` 1318 · `cli-checks.ts` 1007；`src/` 共 9855 行 / 19 档）。3.0 各波都会改这三个文件（cli-host ← W1/W2 · cli-checks ← W4 · cli ← W1/W6），**一次拆完 = 后续每波回归面都变小**。

**对外风险实测为零**：`package.json#exports` 只暴露 `.` / `./cordis.patch.yml` / `./package.json`，三 god-file published-but-sealed（包外不可达）⇒ 风险面只剩**内部行为漂移**，即六重锁的观测对象。E4 代价初判 5→4（SPEC §1 · 本棒复核维持 4：编制劳动仍在，且 `cli.ts` 触 bin 冻结面）。

目标（SPEC §2 继承）：

1. 三 god-file **内部实现搬迁 + 原文件降级为纯 barrel（re-export）**，消费者一行不改（D-30-BARREL · 不可动）。
2. 「零行为变更」从主观承诺降级为**机械可证**（六重锁全绿）。
3. 落 **M1 独立验收文**于 `docs/harness/reviews/`，**早于 W1 动 schema**。
4. E3 第一批：`cli-g1g7` / `refresh` 的 spawn 型断言下沉为核心逻辑单测 + 少量烟测。

---

## 开工基线（2026-09-16 本棒复跑实测 · 锁① 与验收 #2 的比对基准）

> SPEC 头部明示「行号 / 用例计数为起草轮快照，task 起草时须复核现值」。本棒已全量复跑，**以下数字即本 task 基线**；30 开工时若复跑结果与本表不符，按 F-W0-05/F-W0-07/F-W0-08 处置并登记，不得沿用旧数字强行比对。

| 项 | 实测值 | 备注 |
|----|--------|------|
| git HEAD | `1067f32`（`docs(release): 2.4.2 发布回填`） | tag `v2.4.2` ↔ `2557119` 已推远端；release-tag-identity 用例已转绿（tag 落位实证） |
| `npm test` | **607 tests / 116 suites / 602 pass / 4 fail / 1 skip** | **4 fail 全为环境红**（F-W0-07）：pack 系 3 文件（`cli-docs-122` D8 · `cli-p0` D8 · `pack-hygiene` ×2）因本机 npm cache 含 root-owned 文件致 `npm pack --dry-run` EPERM exit 255；以干净 cache（`npm_config_cache` 指向新目录）复跑该 3 文件 **24/24 全绿** ⇒ **有效基线 = 606 pass + 1 skip + 0 产品红** |
| `npm run typecheck` | **0 错** | strict + noUncheckedIndexedAccess |
| `npm run build` | **0 错** | `lib/` 已 gitignore，build 不脏树 |
| `npm run test:lib` | **6/6 PASS** | 覆盖 `bin/*.js → lib/cli.js → src` 全链 |
| `node bin/specgate.js pins check` | **17/17 PASS** | 含 pin-10 git tag v2.4.2（已转绿） |
| 行数复核 | cli-host **1458** · cli **1318** · cli-checks **1007** = **3783** | 与 SPEC/PLAN 快照一致；`src/` 总 9855（38.4%） |
| spawn 基线（E3） | `cli-g1g7` `runCli(` 45 行（含 1 定义行 · 实 **44** 调用）· `cli-refresh-ide-blocks` 41 行（含 1 定义行 · 实 **40** 调用）· 全套件 spawn 包装 helper 调用 **≈588** | 路线研究「354」为旧快照口径（套件已增长 + 口径不同）⇒ 按 F-W0-08 以本口径重建；E3 验收须给**同口径前后数字** |
| 工作区状态 | `docs/spec/README.md` 改动 + SPEC 系列/PLAN/审查文 untracked | 系 10-spec/20-spec-audit 上游产物，**30 不得裹挟提交**（禁 `git add -A`） |

---

## 范围

- [x] **① E4 拆 `cli-checks.ts`（1007 行）→ `src/checks/*`**（首做 · 消费面最大但无外部冻结面）：
  - 新实现落 `src/checks/invoke-hats.ts` / `close-guards.ts` / `review-gates.ts` / `exempt.ts` / `test-artifacts.ts` / `lint.ts`（模块边界按本 task「模块边界定稿表」执行）
  - 原文件降级为纯 barrel，re-export **全部 43 个既有 export**（本棒逐个数过），消费者一行不改
- [x] **② E4 拆 `cli-host.ts`（1458 行）→ `src/host/*`**（次做 · W1 直接前置）：
  - 新实现落 `src/host/table.ts` / `sticky.ts` / `schema.ts` / `commands.ts` / `materialize.ts` / `backup.ts` / `report.ts` / `cmd.ts`
  - 原文件降级为纯 barrel，re-export 全部 9 个既有 export（含 `sniffHostContract` 自 `./host-contract.ts` 的 re-export 行**直留 barrel**）
- [x] **③ E4 拆 `cli.ts`（1318 行）→ `src/cli/*`**（**最后做 · 触冻结面**：`bin/specgate.js:2` / `bin/dsh-coding-kit.js:2` 经 `../lib/cli.js` 消费 `runCli` / `exitWithCliError`）：
  - 新实现落 `src/cli/main.ts` / `usage.ts` / `init.ts` / `gates.ts` / `verify.ts` / `task-cmd.ts`
  - 原文件降级为纯 barrel，re-export 全部 7 个既有 export（`runCli` / `exitWithCliError` / `INIT_QUICKSTART` / `InitToolsSelection` / `isInteractiveInit` / `parseInitToolsArg` / `promptInitTools`）
  - **反复不过 → 启用 W0-SPLIT 降级**（F-W0-02）：只交 ①②，`cli.ts` 留 W0b；W1 只依赖 ②，不被阻塞
- [x] **④ E3 第一批（另起 commit 与 E4 隔离）**：
  - `test/cli-g1g7.test.ts`（44 调用）/ `test/cli-refresh-ide-blocks.test.ts`（40 调用）的 spawn 型断言下沉为核心逻辑单测（直接 import 核心函数断言），**每条下沉必须配等价单测——「删了不补 = 未完成」**
  - 每文件保留少量端到端烟测（建议各 ≤5 条 · 保住 bin→CLI 全链至少一条）
  - 全套件总 spawn 计数较基线（≈588）下降，M1 验收文给同口径前后数字
- [x] **⑤ 锁③快照脚本固化（W0 交付物 · 入 git）**：
  - 提取 `lib/cli.d.ts` / `lib/cli-checks.d.ts` / `lib/cli-host.d.ts` 导出符号名集合（排序）并前后比对的脚本，落 `scripts/`（该目录已有 `check-pack-hygiene.mjs` 先例 · 建议名 `check-export-surface.mjs`）
  - 用法：拆分前跑一遍存快照 → 拆分后跑一遍断言逐字一致；脚本本身与快照产物路径须在 M1 验收文中可引用
- [x] **⑥ M1 独立验收文（早于 W1 动 schema · 硬约束 14）**：
  - 落盘 `docs/harness/reviews/`（只新增不覆写 · S2），含：六重锁逐项实测数字 · 快照 diff 结论 · 消费者 import 面 diff（应为空）· 对外可达面逐项比对 · E3 spawn 前后计数 · 已知环境红登记
  - **不得只引 `.workbuddy/` 下件**；被引证据须入 tracked 路径
  - **该验收文落盘前，W1 不得动 schema**（硬前置 · 00 排程约束）

## 模块边界定稿表（10-task 定稿 · PLAN W0.4 建议的复核落定 · 「barrel 保留 + 消费者零改动」不可动）

> 本棒已逐函数回源码核实存在性（2026-09-16）。**与 PLAN W0.4 的差异共 6 条，见表后「定稿差异清单」**。

### cli-checks.ts → src/checks/（43 个 export 全覆盖）

| 目标模块 | 内容（定稿归属） |
|---------|----------------|
| `src/checks/invoke-hats.ts` | `PRE30_HATS` · `extractHatsFromInvokeName` · `resolveRequiredInvokeHats` · `collectInvokeHats` · `missingInvokeHats` · `checkPre30InvokeHats` |
| `src/checks/close-guards.ts` | `CloseGuardOutcome` · `UNCHECKED_RE`【定稿新增】· `CLOSE_STATUSES`【定稿新增】· `taskTargetRoot` · `evalCloseSlug` / `SelfCheck` / `Acceptance` / `Status` / `InvokeHats` / `Review` / `GraphDelta` / `Kpi` / `Experience` / `WikiDelta` / `WikiPromotion` / `PrMerged` / `HubIndex`（evalClose* 实测 **13** 个）· `evalCloseGuard` · `isCloseHubGateEnabled` · `findHubFile` · `resolvePrMergedState` · `listBareSpecFiles` |
| `src/checks/review-gates.ts` | `extractSpecSlug` · `shouldSkipSpecAudit` · `findSpecReview` · `evalSpecReviewsRetention` · `findLatestReview` · `findReview` · `evalReviewConclusion`（内部常量 `REVIEW_NEG_RE` 随行 · 2.4.2 R-2 形态不动） |
| `src/checks/exempt.ts` | `LEGACY_GATE_EXEMPT_REL` · `LegacyGateExemptEntry` · `LegacyGateExempt` · `loadLegacyGateExempt` |
| `src/checks/test-artifacts.ts` | `runTestCheck`（内部 `hasTestArtifacts` · `walkFiles` · `workflowHasTestStep` · `listWorkflowFiles` 随行） |
| `src/checks/lint.ts` | `lintTaskFile` · `LintIssue` · `PLACEHOLDER_RE`（内部 `CHECKBOX_RE` · `ABS_PATH_RE` · `KNOWN_STATUS_TOKENS` 随行） |

### cli-host.ts → src/host/（9 个 export 全覆盖）

| 目标模块 | 内容（定稿归属） |
|---------|----------------|
| `src/host/table.ts` | `DEFAULT_EXAMPLE_REL` · `resolveValidateFile` · `listKnownHostIds`（导出）· `hostToolsStickyAbs` · `kitPackageSemver` |
| `src/host/sticky.ts` | `HostToolsSticky` · `parseHostToolsSticky` · `loadHostToolsSticky` · `writeHostToolsSticky` |
| `src/host/schema.ts` | `validateHostAdaptDoc` · `HostValidateIssue`【定稿新增 · 导出类型 · 与 validateHostAdaptDoc 同族】（内部 `isPlainObject` · `requireString` · `checkS2Field` · `validateAlwaysOn` · `validateDirFrom` · `validateVerify` 随行） |
| `src/host/commands.ts` | `CORE_COMMAND_VERBS` · `EXPANDED_COMMAND_STEMS` · 内部类型 `CoreCommandVerb` / `ExpandedCommandStem` · `parseCoreCommandBasename`【PLAN 缩写 `parseCCommandBasename` 的全名】· `parseExpandedCommandBasename` · `commandEntryApplies` · `assertHostProfile` · legacy Claude 扁平落点 |
| `src/host/materialize.ts` | `planApply` · `commitPlannedWrites` · marker merge 族（`extractProductInner` / `wrapProductBlock` / `mergeMarkdownAlwaysOn` …）· `expandFromGlob` · `expandSkillSources` |
| `src/host/backup.ts` | `backupsRoot` · `backupFile` · `atomicWrite` · `pruneBackups` · `ensureBackupGen`（`BACKUP_KEEP`） |
| `src/host/report.ts` | `hostBanner` · `printHostHuman` · `emitHostFail` · `emitU01Degraded` · `tableVersionOf` |
| `src/host/cmd.ts` | `cmdHost` · `cmdHostValidate` · `cmdHostApply` · `cmdHostUpdate` |
| （barrel 直留） | `export { sniffHostContract } from './host-contract.ts'` —— 实现本就在 `host-contract.ts`，barrel 保留该 re-export 行即可，**不归任何新模块** |

### cli.ts → src/cli/（7 个 export 全覆盖）

| 目标模块 | 内容（定稿归属） |
|---------|----------------|
| `src/cli/main.ts` | `runCli` · `exitWithCliError`（**barrel 对外面 · bin 冻结面**）（内部 `isMain` 随行） |
| `src/cli/usage.ts` | `usage` · `INIT_USAGE` · `TASK_USAGE` · `CLOSE_GUARD_ORDER` · `VALID_PRESETS` · `VERIFY_BLOCKED_EXIT_CODE` · `collectVerifyObservability` · `readPkgVersion` |
| `src/cli/init.ts` | `INIT_QUICKSTART`【定稿新增 · 导出 · `test/init.test.ts` 消费 · init 完成后 :391 打印】· `InitToolsSelection`【定稿新增 · 导出类型】· `isInteractiveInit` · `parseInitToolsArg` · `promptInitTools` · `cmdInit` · `cmdUpgrade`（内部 `manifestWritePath` · `manifestPath` · `readManifest` · `nowUtc` · `isLegacyHarnessLineVersion` · `compareVersion` 随行） |
| `src/cli/gates.ts` | `cmdCheck` · `formatGateCheck` · `cmdGateCheck` · `cmdAudit` |
| `src/cli/verify.ts` | `cmdVerify` · `verifySpecMode` · `verifyBareReviewsMode` · `wikiLintJson` · `printWikiLintIssues` |
| `src/cli/task-cmd.ts` | `cmdTask` · `cmdTaskLint` · `cmdTaskClose` |

### 定稿差异清单（vs PLAN W0.4 建议 · 均已经 PLAN 授权的 task 定稿权微调 · barrel 原则未动）

| # | 差异 | 定性 |
|---|------|------|
| D1 | `parseCCommandBasename` → 实际全名 `parseCoreCommandBasename`（:231 · PLAN 为 brace 缩写） | 标注级 · 非实质差异 |
| D2 | 补 4 个 PLAN 未列的**导出**符号归属：`HostValidateIssue`→schema · `INIT_QUICKSTART`→init · `InitToolsSelection`→init · `UNCHECKED_RE`+`CLOSE_STATUSES`→close-guards | 补漏 · 锁③ 快照断言必需（漏了会被锁③拦） |
| D3 | `sniffHostContract`（:45）系自 `./host-contract.ts` 的 re-export → **barrel 直留**，不归新模块 | 补漏 · 同上 |
| D4 | evalClose* 实测 **13** 个（PLAN 写 ~14；13 + `evalCloseGuard` = 14 个判据入口） | 计数核准 |
| D5 | `REVIEW_NEG_RE` / `CHECKBOX_RE` / `ABS_PATH_RE` / `KNOWN_STATUS_TOKENS` / `CoreCommandVerb` / `ExpandedCommandStem` 均为**内部符号**（非 export）→ 随所属模块行，不进 barrel | 口径明确 |
| D6 | **消费者清单增补**（锁② 断言面同步扩）：`cli-host.ts` 除 `src/cli.ts:8` 外另有 **4 个测试直接消费者** —— `test/host-adapt-sticky.test.ts:10-14`（`loadHostToolsSticky` / `parseHostToolsSticky` / `HostToolsSticky`）· `test/init.test.ts:17`（`listKnownHostIds` / `parseHostToolsSticky`）· `test/host-adapt-w6-three-hosts.test.ts:9` · `test/host-adapt-w6-2_3-six-hosts.test.ts:9`（均 `listKnownHostIds`）；barrel 保路径不变即全覆盖 | 补漏 · SPEC §5.2 表只列了 `src/cli.ts:8` |

### 锁② 消费者 import 面零 diff 断言清单（定稿 · 以下文件整文件零改动）

`src/cli-lifecycle.ts` · `src/cli-task-extra.ts` · `src/cli-status.ts` · `test/cli-wiki-delta-section.test.ts` · `test/host-adapt-sticky.test.ts` · `test/init.test.ts` · `test/host-adapt-w6-three-hosts.test.ts` · `test/host-adapt-w6-2_3-six-hosts.test.ts` · `bin/specgate.js` · `bin/dsh-coding-kit.js`

（`src/cli.ts` 本身是 ③ 的被拆对象，其内部 import 重排属拆分动作本身；它对 `./cli-checks.ts` / `./cli-host.ts` 的 import 在 barrel 化后继续成立，最终态下它也只剩 barrel re-export。）

## 非范围

| 项 | 理由 |
|----|------|
| 任何 CLI 行为、输出、exit code、错误文案变更 | 本波非功能 · 硬约束 5（重构与行为变更分离） |
| schema / pins / `bin/` 改动 | PLAN W0.7 明示 |
| `package.json#exports` / `files` 改动 · 新增任何 `./lib/*` 子路径 | 防重构顺带开放 deep import（锁⑥断言对象） |
| E3 其余 spawn 削减（全套件 ≈588 → <50 收官） | 归 W7；本波只做第一批（cli-g1g7 + refresh） |
| 顺带「顺手优化」（重命名、文案、逻辑等价改写） | 一律视为行为变更风险，禁止（W0.6） |
| `src/index.ts` / `host-contract.ts` / 其余 16 个 `src/` 模块 | 非 god-file · 本波不动 |
| W1+ 任何工作（hooks/verify/schema_version/闸判定泛化等） | 逐波独立链路；M1 验收文落盘前 W1 不得动 schema |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（无代跑授权） |
| SPEC / PLAN / reviews 既有档改动 | S2 只新增不覆写；本波只新增 M1 验收文 |
| 工作区既有 untracked/modified 档（SPEC 系列 · PLAN · 审查文 · `docs/spec/README.md`） | 上游 10/20 帽产物 · **不得裹挟提交** |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-W0-00） | 30 **拒开工**（verify 机械拦 exit 2 · 闸真值以本表为准） | 是（20 审 + 00 签后） | 是 |
| 锁①②③⑥ 任一不过（F-W0-01） | **停并回退对应 commit**（不整体重启 · 每文件独立可回退） | 是 | 是 |
| `cli.ts` 拆分反复不过（触冻结面）（F-W0-02） | 启用 **W0-SPLIT 降级**：只交 cli-checks + cli-host 两个 commit + E3 + ⑤⑥，`cli.ts` 留 W0b 延后；W1 只依赖 cli-host，不被阻塞；降级决策入 M1 验收文与修订记录 | 是 | 是 |
| E3 下沉断言掩盖回归（删了不补）（F-W0-03） | 视为未完成 · 验收 #3 拒过 | 是 | 是 |
| 重构顺带新增 `./lib/*` exports 子路径（F-W0-04） | 锁⑥ 拦截 · 必须回退（防 deep import 顺带开放） | 是 | 是 |
| 开工复跑与本 task 基线节数字不符（F-W0-05） | 以复跑实测重建基线并在 M1 验收文登记，不得沿用旧数字强行比对 | 是 | 是 |
| barrel 漏 re-export 某符号（消费者编译错）（F-W0-06） | 锁⑤ typecheck + 锁③ 快照比对拦截 · 回退补符号 | 是 | — |
| pack 系用例 EPERM 环境红（npm cache root-owned）（F-W0-07 · 本棒新增） | **先对照实验**：`npm_config_cache` 指向新建空目录复跑；转绿即定性环境红并登记（本基线已实测 24/24 转绿），仍红才定性产品问题；**不得**为修环境改产品代码，cache 属主修复（`sudo chown`）仅人 | 是 | 是 |
| spawn 基线与路线研究「354」不符（F-W0-08 · 本棒新增） | 已按同口径实测重建（≈588 · 见基线节）；E3 验收只认**同口径前后对比** | 是 | — |
| `git add -A` 裹挟域外档（上游 SPEC/PLAN/reviews 产物 · 本仓 2.x 教训）（F-W0-09） | 打回 · 撤 stage 逐文件显式 add | 是 | — |
| git shim exit 69 致裸跑异常（F-W0-10 · 环境警示条款） | `PATH="/opt/homebrew/bin:$PATH"` 前置重跑对照 · 仍异常才定性 | 是 | — |
| 越权执行 tag/push/publish/deprecate（F-W0-11） | 违禁令 · 打回（四动作全仅人） | — | 是 |

---

## 验收标准（必须自证，不接受「我改完了」）

- [x] **锁① 用例计数锁**：每个 commit 前后 `npm test` 用例计数一致（基线 607 total / 116 suites；pass 数以同环境同口径为准 —— 环境红须先按 F-W0-07 对照排除，有效基线 606 pass + 1 skip）；E3 commit 允许用例总数变化（下沉=删 spawn 断言 + 补等价单测 + 留烟测），但**零意外红**且计数变化在 M1 验收文逐项对账
- [x] **锁② 消费者 import 面零 diff**：`git diff` 对「锁② 断言清单」10 个文件**整文件为空**（barrel 原则的机械化证明）
- [x] **锁③ 公共导出面快照锁**：范围 ⑤ 脚本比对 `lib/cli.d.ts` / `lib/cli-checks.d.ts` / `lib/cli-host.d.ts` 导出符号名集合，拆分前后**逐字一致**（排序后 diff 为空）；脚本入 git 且 M1 可引用
- [x] **锁④ 发布链路锁**：`npm run test:lib` 6/6 绿 · `node bin/specgate.js pins check` 17/17
- [x] **锁⑤ 平台锁**：`npm run typecheck` 0 错 · `npm run build` 0 错
- [x] **锁⑥ 对外可达面不变式**（逐项比对清单）：① `package.json` 的 `exports`（键与目标值）/`files`/`bin` `git diff` 为空；② `lib/index.d.ts` 导出符号集拆分前后一致；③ 三个 bin（`spec-wave` / `specgate` / `dsh-coding-kit`）`--help` 输出 diff 为空；④ **未新增任何 `./lib/*` exports 子路径**
- [x] **执行粒度**：每文件一 commit（顺序 **cli-checks → cli-host → cli**）+ E3 另起 commit + ⑤脚本可搭车或独立；每个 commit 独立可回退；`git diff --cached` 可证无裹挟；未执行 tag/push/publish/deprecate
- [x] **E3 下沉等价性**：每条下沉的 spawn 断言有等价核心逻辑单测（M1 验收文列对照表：删了哪条 · 补了哪条）；每文件保留 ≤5 条烟测；总 spawn 计数较基线（≈588 · 同口径）下降并给前后数字
- [x] **M1 独立验收文落盘** `docs/harness/reviews/`：含六重锁实测数字、快照 diff 结论、消费者 import 面 diff（应为空）、锁⑥逐项比对、E3 前后计数、环境红登记；**不得只引 `.workbuddy/` 下件**；S2 只新增
- [x] 波末 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w0_refactor_prep.md` → exit 0 + `task close --yes` 闭环

---

## 给执行帽的必读列表

1. SPEC [`01_w0_refactor_prep_v1.md`](../../spec/3_0-architecture-leap/01_w0_refactor_prep_v1.md) 全文（六重锁 §5.3 · 执行回退 §5.4 · 验收 §7 · F-W0-01–06 §8）· [`00_policy_and_boundaries.md`](../../spec/3_0-architecture-leap/00_policy_and_boundaries.md)（S2/P0/流程边界）· [`README.md`](../../spec/3_0-architecture-leap/README.md) 已定案裁决表
2. PLAN [`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W0.1–W0.7（**W0.4 已被本 task「模块边界定稿表」取代 · 以本 task 为准**）
3. `src/cli-checks.ts`（43 export）· `src/cli-host.ts`（9 export）· `src/cli.ts`（7 export）全文；`src/host-contract.ts`（sniffHostContract 实现源 · 不动）
4. 消费者文件（锁② 清单 10 个 · 只读核对不得改）
5. `scripts/check-pack-hygiene.mjs`（scripts/ 落点与风格先例）· `test/lib-smoke/cli-lib-smoke.test.ts`（锁④ 全链冒烟本体）
6. done task [`task_2_4_2_patch.md`](../done/task_2_4_2_patch.md)（基线复跑 / 环境红对照实验 / 逐文件显式 add 先例）
7. `RELEASING.md`（发布边界 · 本波不触发发版但四动作仅人同规）

---

## 思考轮

### R0 · 证据

SPEC 01（双签 approved）+ PLAN W0 节 + 本棒全量复核实测：行数 1458/1318/1007=3783 与快照一致；消费者清单逐行 grep 实证（**新发现 cli-host 另有 4 个测试直接消费者** · SPEC §5.2 表未列）；三文件 export 逐个数过（43/9/7 · 锁③ 断言面）；基线复跑 607/602+4 环境红+1 skip（干净 cache 复跑 24/24 转绿）· typecheck/build 0 错 · test:lib 6/6 · pins 17/17；spawn 同口径实测 ≈588（路线研究 354 为旧快照）；W0.4 归属逐符号核实（6 条差异已定稿）。

### R1 · 范围

①–⑥ 照 SPEC；锁② 断言面按 D6 扩为 10 文件；E3 只第一批（cli-g1g7 + refresh）；scripts/ 新增一个快照脚本属范围 ⑤ 明示交付。非范围照 SPEC §4 + 上游 untracked 档不裹挟 + W1+ 一行不碰。

### R2 · 方案

barrel 方案已定案（D-30-BARREL · 不重议）；模块边界在 PLAN W0.4 建议上行 task 定稿权微调（D1–D6 · barrel 原则未动）；锁③ 脚本落 `scripts/`（有 check-pack-hygiene.mjs 先例）；E3 烟测每文件 ≤5 条为建议档（30 可按断言聚簇微调但须保住全链烟测）；W0-SPLIT 降级路径写入 F-W0-02。

### R3 · 边界

S2 只新增（M1 验收文）不覆写；本 task 不改 SPEC/PLAN/reviews；四发布动作仅人；禁 `git add -A`（工作区有上游 untracked 产物 · 裹挟风险实测存在）；环境红只登记不修产品（cache chown 仅人）；`lib/` gitignore 故 build 不脏树（锁③ 快照须在 build 后取）。

### R4 · 可测性

六重锁逐条机械可断言（命令 + 期望输出均落入验收节）；E3 等价性以「删除/补充对照表 + 同口径 spawn 计数」机械对账；锁⑥ 五项逐条 `git diff`/快照比对；环境红有对照实验判据（F-W0-07）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待审查文落盘 + 00 代签 · 维护者 2026-09-16 授权模式）；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | SPEC 双签 approved · 行数/消费者/export/基线/spawn 全量复核实测（含 2 处 SPEC 快照偏差：cli-host 测试消费者 ×4 · spawn 口径） | no |
| R1 | 范围 ①–⑥ + 锁② 面扩 10 文件 · 非范围含不裹挟上游档 | no |
| R2 | 模块边界定稿（差异 D1–D6 · barrel 不动）· 锁③ 落 scripts/ · 降级路径落 F-W0-02 | no |
| R3 | S2 只新增 · 发布仅人 · 环境红不修产品 · lib gitignore 快照须 build 后取 | no |
| R4 | 六重锁 + E3 对照表 + 锁⑥ 五项全机械可断言 | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① 内部行为漂移无法被锁完全穷尽（缓解：607 用例 + test:lib 全链 + 漂移面已被「对外密封」收窄）；② E3 下沉若触及既有 flaky 用例，可能与拆分红混淆（缓解：F-W0-05/07 对照实验先行 · E3 与 E4 隔离 commit 可独立回退）；③ 锁③ 快照依赖 `npm run build` 产物，若 30 在未 build 状态下比对会误红（缓解：验收节明示「快照须 build 后取」）；④ spawn 计数口径为 helper 调用计数（≈588），若 30 用更精确口径（如运行时实际 spawn 数）须同口径前后对比并在 M1 登记口径（F-W0-08）；⑤ `cli.ts` 拆分触 bin 冻结面仍是全波最高风险点（缓解：顺序最后 · W0-SPLIT 降级备择 · 锁④ 全链冒烟兜底）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 本波验收主体 = **六重机械锁全绿**（命令与判据见验收节），辅以：① E3 下沉等价单测（先写核心逻辑单测转绿 → 再删对应 spawn 断言 · 每文件留 ≤5 烟测）；② 每 commit 前后 `npm test` 同绿（基线见本 task「开工基线」节 · 环境红按 F-W0-07 对照排除）；③ 锁③ 快照脚本自证（拆分前后各跑一遍 diff 为空）；④ M1 验收文汇聚全部实测数字留证。**本波不新增产品行为，故无「红测先行」义务；E3 等价单测先行（先补后删）即本波的红绿纪律形态。**

---

## 提交信息约定

- `refactor(3.0-W0): 拆 cli-checks → checks/*（barrel 化 · 锁①–⑥ 绿）`
- `refactor(3.0-W0): 拆 cli-host → host/*（barrel 化 · 锁①–⑥ 绿）`
- `refactor(3.0-W0): 拆 cli → cli/*（barrel 化 · 触 bin 冻结面 · 锁①–⑥ 绿）`（**顺序固定：checks → host → cli**；W0-SPLIT 降级时本 commit 不交付）
- `chore(3.0-W0): 锁③ 导出面快照脚本（scripts/）`（可搭车首个 refactor commit 或独立）
- `test(3.0-W0): E3 第一批 spawn 下沉（cli-g1g7 / refresh 等价单测 + 烟测）`（**与 E4 隔离 · 独立可回退**）
- `docs(3.0-W0): M1 独立验收文（docs/harness/reviews/）`
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界（工作区有上游 SPEC/PLAN/reviews untracked 产物 · F-W0-09）
- **禁 tag / push / publish / deprecate（仅人 · 无代跑授权）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w0_refactor_prep.md`

---

### 自检结论（执行者）

**GATE_VERIFY 首输出闸扫描表**（2026-09-16 改码前机械闸 · `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w0_refactor_prep.md` → VERIFY: PASS · bin 等价未用 npx）：

| human_gate_id | task表status | 用户/invoke声称 | 一致？ | blocks_30 | 30可开工？ |
|---------------|--------------|-----------------|--------|-----------|------------|
| HG-TASK-DRAFT | approved | — | Y | 20,30 | — |
| HG-AUDIT-R1 | approved | — | Y | Y | ✅ |

reviews 存在性 + pre-30 invoke hats 均由 verify 机械接线核验通过；30 纪律片段按 fallback 读 `assets/harness/prompts/FRAGMENT_30_gate_verify_v1_zh.md`（仓内 docs/harness/prompts/ 不存在 · 同源资产）。

**六重锁逐项实测**（五 commit 各自前后同口径 · 全绿 · 汇聚真值见 M1 `docs/harness/reviews/w0_refactor_prep_acceptance_M1_20260916.md`）：① 607/116/602 pass+4 点名环境红+1 skip 五阶段逐字一致 · 零意外红终态；② 锁② 10 文件消费者 import 面 git diff 0 行；③ 三份 d.ts 导出集合（7/43/9）拆分前后逐字一致（快照脚本 `scripts/check-export-surface.mjs` 入 git）；④ test:lib 6/6 · pins 17/17；⑤ typecheck 0 错 · build 0 错；⑥ exports/files/bin 零改动 · 两 bin --help 逐字一致 · --version=2.4.2 · 未新增 `./lib/*` 子路径。

**E3 对照表**：删/补聚簇级对照 + spawn 前后数字（口径：静态 `runCli(` 命中 − 定义行 · g1g7 44→16 · refresh 40→8 · 全套件 580→520 −10.3%）+ 耗时红利（4.49→1.80s · 5.30→1.68s）+ 烟测各 5 条 · it 数零增删 —— 全表见 M1 第四节。

**已知未测项**：① 环境红 4 例（EPERM exit 255 · npm cache root-owned · 干净 cache 对照 24/24 转绿两次独立复现 · 属主修复仅人）；② E3 其余 spawn 削减（520 → <50）归 W7；③ 内部行为漂移无法被锁完全穷尽（607 用例 + test:lib 全链缓解）。

**过程留痕**：阶段三首轮锁① 第 5 红（cli-p0 静态扫描 EISDIR · 布局耦合）→ 对照实验（干净 cache 仍红 + stash 因果确证）→ 整体回退 STOP 上报 → 00 裁决选项 A（`161a9aa` 扫描适配 + 两 commit 粒度 · 探针实证注入→红→撤→绿）→ `8dc8bfd` 交付。五 commit：b51acf3 / 1a34242 / 161a9aa / 8dc8bfd / 4bebcf9（显式逐文件 add · 零裹挟 · 未 push/tag）。偏差登记三条（布局适配 · isMain 自举直留 barrel · spawn 口径差值 ±8）已入 M1 第五节。

### KPI（00）

Task_KPI%: 96（验收 11/11 落地：六重锁全绿 + 执行粒度五 commit 独立可回退 + E3 等价性（删/补对照 + 同口径 −60 · it 零增删）+ M1 落盘 + 波末 gate-check exit 0 + close 闭环 · 范围 ①–⑥ 全交付未触发 W0-SPLIT · 阶段三第 5 红按 F-W0-07 对照实验 + 铁律回退 STOP 纪律执行（未强行交付）· 探针实证扫描覆盖未缩 · 零发布本体越权）

- rubric：`KPI_RUBRIC_v1_2` · 五阶段 00 逐验收放行 · 阶段三一轮回退后按 00 裁决一次通过（选项 A 两 commit 粒度）
- 范围守界：仅 task 范围 ①–⑥ + 00 裁决布局适配（161a9aa）· 未碰 SPEC/PLAN/reviews 既有档 / assets / docs/_tech_graph / 非 god-file 模块 / W1+ · 上游 untracked 档零裹挟（F-W0-09）
- 质量门：typecheck 0 错 · npm test 607/602 pass+4 环境红+1 skip 零意外红 · build 0 错 · test:lib 6/6 · pins 17/17 · 三份 d.ts 快照逐字一致 · 两 bin --help 逐字一致

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 30 实现棒收官回填：范围 ①–⑥ 全交付（五 commit b51acf3/1a34242/161a9aa/8dc8bfd/4bebcf9 · 未触发 W0-SPLIT）；六重锁全绿（607 计数五阶段逐字一致 · 锁② 0 行 · 快照 7/43/9 逐字一致 · test:lib 6/6 · pins 17/17 · typecheck/build 0 错 · 对外可达面不变式全项）；E3 第一批 spawn 580→520（同口径 · it 零增删 · 2.5×/3.2× 提速）；M1 落盘 reviews/ + 30 invoke 留档；偏差登记三条（布局适配 161a9aa · isMain 自举直留 barrel · spawn 口径差值 ±8）；自检结论 + KPI 自评（Task_KPI%: 96）+ 勾选/状态 → done |
| 2026-09-16 | 初稿 · 10-task（W0 SPEC 双签 approved 后首波拆单）：行数复核与快照一致（1458/1318/1007=3783）；消费者清单 grep 实证并**增补 cli-host 测试消费者 ×4**（锁② 面扩 10 文件 · D6）；W0.4 模块边界逐函数核实并定稿（差异 D1–D6 · barrel 原则未动）；基线全量复跑（npm test 607=602+4 环境红+1 skip · 干净 cache 对照 24/24 转绿 · typecheck/build 0 错 · test:lib 6/6 · pins 17/17）；spawn 同口径实测 ≈588 重建基线（路线研究 354 为旧快照 · F-W0-08）；六重锁逐条具体化为可执行判据；E3「删了不补=未完成」+ 烟测 ≤5 档；M1 验收文硬要求（落 reviews/ · 早于 W1 动 schema · 不引 .workbuddy/）；执行粒度（checks→host→cli · E3 隔离 · 禁 git add -A）与 W0-SPLIT 降级（F-W0-02）落表；新增 F-W0-07（npm cache 环境红对照）/F-W0-09/10/11 |
