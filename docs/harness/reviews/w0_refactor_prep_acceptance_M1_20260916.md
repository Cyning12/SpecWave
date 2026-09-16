# M1 独立验收文：3.0 W0 重构预备（三 god-file 拆分 barrel 化 + E3 第一批）

| 字段 | 值 |
|------|-----|
| 类型 | M1 独立验收（task_3_0_w0_refactor_prep 范围 ⑥ · 硬约束 14） |
| task | `docs/tasks/active/task_3_0_w0_refactor_prep.md`（close 后 `docs/tasks/done/`） |
| 执行帽 | 30（五阶段 · 00 逐阶段验收放行） |
| 验收日 | 2026-09-16 |
| 基线 HEAD | `1067f32`（v2.4.2 ↔ `2557119` 已推远端） |
| 收官 HEAD | `4bebcf9`（五 commit · 未 push/tag · 发布四动作全仅人） |

> **硬约束 14 口径**：关键实测数字全部直接写进本文；`.workbuddy/` 下临时产物
> （锁③基线快照 / bin --help 基线）仅作辅助标注路径，不作唯一证据源。

## 一、交付范围 = 完整（A4 字段）

| 范围 | 交付 | commit |
|------|------|--------|
| ① 拆 cli-checks.ts（1007 行 · 43 exports）→ src/checks/* 六模块 + 纯 barrel | ✅ | `b51acf3` |
| ② 拆 cli-host.ts（1458 行 · 9 exports）→ src/host/* 八模块 + 纯 barrel（sniffHostContract 直留 · D3） | ✅ | `1a34242` |
| ③ 拆 cli.ts（1318 行 · 7 exports）→ src/cli/* 六模块 + 纯 barrel（触 bin 冻结面） | ✅ | `8dc8bfd` |
| ④ E3 第一批（cli-g1g7 / cli-refresh spawn 下沉 · 独立 commit） | ✅ | `4bebcf9` |
| ⑤ 锁③ 快照脚本 `scripts/check-export-surface.mjs`（入 git · 搭车 ①） | ✅ | `b51acf3` |
| ⑥ M1 独立验收文（本文 · 早于 W1 动 schema） | ✅ | 本件 |
| （布局适配 · 00 裁决搭车）cli-p0 静态扫描兼容 cli* 目录 | ✅ | `161a9aa` |

**W0-SPLIT 降级预案（F-W0-02）备而未用**：cli.ts 拆分首轮曾触发锁① 第 5 红
（cli-p0 静态扫描 EISDIR · 布局耦合非产品回归），按铁律回退 STOP 上报；
00 裁决选项 A（先修测试扫描适配 + 两 commit 粒度）后一轮通过，
**未达「≥2 轮回退仍红」降级条件 ⇒ W0b 无需登记**。

## 二、六重锁实测汇聚

### 锁① 用例计数锁

| 时点 | tests | suites | pass | fail | skip | 结论 |
|------|-------|--------|------|------|------|------|
| 开工基线（2026-09-16 复跑） | 607 | 116 | 602 | 4 | 1 | 4 fail 全为点名环境红（见第四节） |
| b51acf3 后 | 607 | 116 | 602 | 4 | 1 | 逐字一致 |
| 1a34242 后 | 607 | 116 | 602 | 4 | 1 | 逐字一致 |
| 161a9aa 后 | 607 | 116 | 602 | 4 | 1 | 逐字一致（修复测在 pass 列） |
| 8dc8bfd 后 | 607 | 116 | 602 | 4 | 1 | 逐字一致 · 零意外红 |
| 4bebcf9 后 | 607 | 116 | 602 | 4 | 1 | E3 允许计数变化 · 实测零增删（14/14 + 27/27 its 不变） |

每 commit 前后同环境同口径；未出现任何第 5 个红进入终态。

### 锁② 消费者 import 面零 diff

断言清单 10 文件（task 定稿 D6）：`src/cli-lifecycle.ts` · `src/cli-task-extra.ts` ·
`src/cli-status.ts` · `test/cli-wiki-delta-section.test.ts` · `test/host-adapt-sticky.test.ts` ·
`test/init.test.ts` · `test/host-adapt-w6-three-hosts.test.ts` · `test/host-adapt-w6-2_3-six-hosts.test.ts` ·
`bin/specgate.js` · `bin/dsh-coding-kit.js`。

证据形态：每阶段 `git diff -- <上述文件> | wc -l` = **0**（①②③ 阶段全量 10 文件 +
`src/cli.ts`（③ 被拆对象 · 其内部 import 重排属拆分动作本身）；④ 阶段仅 2 个测试文件
改动 · 其余 8 文件 + 2 bin 同式 0 行）。**消费者一行不改（D-30-BARREL）机械可证。**

### 锁③ 公共导出面快照锁

- 脚本（入 git）：`scripts/check-export-surface.mjs`（--snapshot/--check · 排序集合逐字比对 · failClosed exit 2 · 未识别 export 形态即报错的防解析器漂移设计）。
- 基线快照（临时产物 · 辅助标注）：`.workbuddy/3.0-w0/export-surface-baseline.txt`（拆分前 `npm run build` 后取）。
- 结论：①②③ 每阶段拆后 build → `--check` **PASS · 三份 d.ts 导出符号集合与基线逐字一致**。

关键数字（直接写进本文 · 排序后集合基数与全量名单）：
- `lib/cli.d.ts`（**7**）：INIT_QUICKSTART · InitToolsSelection · exitWithCliError · isInteractiveInit · parseInitToolsArg · promptInitTools · runCli
- `lib/cli-checks.d.ts`（**43**）：CLOSE_STATUSES · CloseGuardOutcome · LEGACY_GATE_EXEMPT_REL · LegacyGateExempt · LegacyGateExemptEntry · LintIssue · PLACEHOLDER_RE · PRE30_HATS · UNCHECKED_RE · checkPre30InvokeHats · collectInvokeHats · evalCloseAcceptance · evalCloseExperience · evalCloseGraphDelta · evalCloseGuard · evalCloseHubIndex · evalCloseInvokeHats · evalCloseKpi · evalClosePrMerged · evalCloseReview · evalCloseSelfCheck · evalCloseSlug · evalCloseStatus · evalCloseWikiDelta · evalCloseWikiPromotion · evalReviewConclusion · evalSpecReviewsRetention · extractHatsFromInvokeName · extractSpecSlug · findHubFile · findLatestReview · findReview · findSpecReview · isCloseHubGateEnabled · lintTaskFile · listBareSpecFiles · loadLegacyGateExempt · missingInvokeHats · resolvePrMergedState · resolveRequiredInvokeHats · runTestCheck · shouldSkipSpecAudit · taskTargetRoot
- `lib/cli-host.d.ts`（**9**）：HostToolsSticky · HostValidateIssue · cmdHost · listKnownHostIds · loadHostToolsSticky · parseHostToolsSticky · sniffHostContract · validateHostAdaptDoc · writeHostToolsSticky

### 锁④ 发布链路锁

每阶段复跑：`npm run test:lib` **6/6 PASS**（bin → lib/cli.js → src 全链冒烟 ·
③ 阶段最关键锁 · bin 冻结面行为实证）· `node bin/specgate.js pins check` **17/17 PASS**。

### 锁⑤ 平台锁

每阶段：`npm run typecheck` **0 错**（strict + noUncheckedIndexedAccess + verbatimModuleSyntax）·
`npm run build` **0 错**。

### 锁⑥ 对外可达面不变式

| 项 | 实测 |
|----|------|
| `package.json` exports/files/bin `git diff` | **0 行**（每阶段） |
| `bin/` `git diff` | **0 行**（每阶段） |
| `lib/index.d.ts` 导出集合 | index.ts 零触碰 · diff 为空 |
| 三 bin `--help` | `bin/specgate.js` 与 `bin/dsh-coding-kit.js` 拆分前基线（`.workbuddy/3.0-w0/bin-help-baseline.txt` · `bin-help-dsh-baseline.txt` · 46 行）拆分后**逐字一致（diff 为空）**；两 bin 输出互相一致；`--version` = `2.4.2` |
| 新增 `./lib/*` exports 子路径 | **零**（exports 键集不变：`.` / `./cordis.patch.yml` / `./package.json`） |

## 三、环境红登记（A3 三字段粒度 · F-W0-07）

| 文件 | 用例 | 失败形态 |
|------|------|----------|
| test/cli-docs-122.test.ts | D8: npm pack --dry-run 不含 SPEC.md；filename 含 2.4.2 | `npm pack --dry-run` EPERM exit 255（本机 npm cache 含 root-owned 文件） |
| test/cli-p0.test.ts | D8: 三 bin spec-wave+specgate+dsh-coding-kit；patch 为 insert；pack 不含 SPEC.md | 同上 EPERM exit 255 |
| test/pack-hygiene.test.ts | 正向：当前包清单无 *.bak/*~/.DS_Store → PASS | 同上 EPERM exit 255 |
| test/pack-hygiene.test.ts | 负向：仓根造 README.trap.bak → exit 2 点名 | 同上 EPERM exit 255（断言面拿不到 pack 清单） |

- **干净 cache 对照实验**：`npm_config_cache=$(mktemp -d)` 复跑该 3 文件 → **24/24 全绿**（两次独立复现：10-task 起草棒 + 20 审 R1 审查文 §二 · 本 30 棒阶段三第 5 红排查时再证对照方法论有效）。
- **处置**：环境红只登记不修产品；cache 属主修复（`sudo chown`）**仅人**。
- **判据说明**：「裸跑全红/意外红先对照实验再定性」——阶段三第 5 红（EISDIR）即按此先
  做干净 cache 对照（仍红 ⇒ 非环境红）+ stash 拆分前对照（转绿 ⇒ 因果确证布局耦合），
  再行回退上报，未径直改码。

## 四、E3 第一批（范围 ④ · commit `4bebcf9`）

### 口径定义（F-W0-08 同口径前后对比）

**静态** `runCli(` 字面命中行数 − `function runCli` 定义行数（每文件 1 行）。
全套件基线系本棒同口径实测 **580**（619 − 39）；task 起草快照 ≈588 · **差值 ±8 系起草轮后
套件微增**（登记于此 · 不影响同口径前后对比有效性）。

### 删/补对照（聚簇级 · 全部断言逐字保留 · it 数零增删）

| 文件 | its | 烟测（≤5 · spawn 保留） | 下沉（进程内直调 cmd* · makeCore harness） |
|------|-----|--------------------------|----------------------------------------------|
| test/cli-g1g7.test.ts | 14 不变 | D1/G1 status · D2/G2 lifecycle · D3/G3 graph compile · D5/G5 skills · D6/G6 wiki（bin→CLI 全链 ≥1 ✓） | timeline ×2 its · lifecycle dry-run ×2 its · graph ingest ×2 its · sync index · D7/G7 三命令 · G7-strict → `makeCore(cmdTimeline/cmdLifecycle/cmdGraph/cmdSync/cmdTaskLintDone/cmdTaskLintWikiDelta/cmdTaskCheck)` |
| test/cli-refresh-ide-blocks.test.ts | 27 不变 | M01 · M03 · M08 · M12 · M18（全链写盘/dry-run/malformed/git 脏树/schema） | M02/M04–M07/M09–M11/M13–M17/M17b/M17c/M19a/M19b/D29-1..5 → `makeCore(cmdRefreshIdeBlocks)`（M19a → `cmdUpgrade` + `readPkgVersion`） |

下沉机制：console.log/console.error/process.stdout.write 捕获 + CliError.exitCode→status /
message→stderr（逐字对齐 bin/exitWithCliError 行为 · src 唯一直接 process.exit 为其本体）。

### 前后数字与红利

| 指标 | 前 | 后 | Δ |
|------|-----|-----|---|
| spawn 静态调用点 · cli-g1g7 | 44 | 16 | −28 |
| spawn 静态调用点 · cli-refresh | 40 | 8 | −32 |
| spawn 静态调用点 · 全套件 | 580 | 520 | **−60（−10.3%）** |
| 单文件耗时（real）· cli-g1g7 | 4.49s | 1.80s | **2.5×** |
| 单文件耗时（real）· cli-refresh | 5.30s | 1.68s | **3.2×** |

先补后删纪律（F-W0-03 反向自证）：makeCore 等价断言形态先行转绿（两文件各自 14/14 ·
27/27），再删除对应 spawn 调用，同一 commit 内完成；零用例增删（607 total 不变实测）。

## 五、布局适配登记（00 裁决 · 不计行为变更）

1. **cli-p0 静态扫描 × src/cli/ 目录（commit `161a9aa`）**：「CLI 源码不把闸命令注册为
   ctx.tools」（test/cli-p0.test.ts:588）对 `readdir(src)` 的 cli* 条目逐一 readFile，
   task 定稿 `src/cli/` 目录命中扫描 → EISDIR 确定性红（干净 cache 对照仍红 · stash
   拆分前转绿 · 因果确证）。00 裁决选项 A：**withFileTypes + 递归下探 cli 前缀目录**
   （禁跳过目录 · 扫描面 = 顶层 cli* 文件 + cli* 目录内全部 .ts · 断言意图与覆盖不缩）。
   **探针实证**：往 `src/cli/main.ts` 注入 `ctx.tools.register` → 该测即红（扫描面覆盖
   新目录）→ 撤回即绿 → 文件逐字复原零残留。无 src/cli/ 目录态下 607 全量验证该测在
   pass 列（递归对不存在目录零影响）。
2. **isMain 自举块直留 barrel**（定稿「isMain 随行 main」的唯一执行偏差 · 00 验收确认
   成立）：`if (isMain())` 自举与 isMain 留 `src/cli.ts` —— `import.meta.url` 自指判基，
   移入 `src/cli/main.ts` 将使 `node src/cli.ts` 直跑入口失效（basename 判据
   cli.ts ≠ main.ts · 全部 E2E spawn 测试的入口形态）。barrel 注释已留痕。

## 六、commit 清单（五笔 · 显式逐文件 add · 禁 git add -A 全程遵守）

| commit | 类型 | 粒度 |
|--------|------|------|
| `b51acf3` | refactor | 拆 cli-checks → src/checks/*（8 files · 锁③脚本搭车） |
| `1a34242` | refactor | 拆 cli-host → src/host/*（9 files） |
| `161a9aa` | test | cli-p0 静态扫描布局适配（1 file · 独立绿） |
| `8dc8bfd` | refactor | 拆 cli → src/cli/*（7 files · 触 bin 冻结面） |
| `4bebcf9` | test | E3 第一批 spawn 下沉（2 files · 与 E4 隔离） |

每 commit 独立可回退（F-W0-01 粒度）；阶段三曾整体回退一次（cli.ts 首轮 ·
git restore + clean · 干净可证）后按 00 裁决重做交付。上游 untracked 产物
（SPEC 系列 / PLAN / R1 审查文 / 10·20·00 invoke / `docs/spec/README.md`）
**全程零裹挟**（F-W0-09 · 每 commit `git status --porcelain` 审边界）。

## 七、结论

**W0 六重锁全绿 · 「零行为变更」从主观承诺降为机械可证**：三 god-file（3783 行 =
src/ 38.4%）内部实现搬迁完成，原文件全部降级为纯 barrel，消费者一行不改，
对外可达面（exports/files/bin/d.ts 导出面/--help/--version）逐项不变式成立；
E3 第一批 spawn −60（−10.3%）且零用例增删。**M1 早于 W1 动 schema 的硬前置
（硬约束 14）已兑现 —— W1 可排程。**

已知残余（登记非阻塞）：① 内部行为漂移无法被锁完全穷尽（缓解：607 用例 +
test:lib 全链 + 对外密封收窄）；② 环境红 4 例待仅人修复 npm cache 属主；
③ E3 其余 spawn 削减（520 → <50）归 W7。
