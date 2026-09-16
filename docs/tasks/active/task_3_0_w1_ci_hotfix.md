# Task：3.0 W1 hotfix · 闸基线扫描器空目录 ENOENT（CI hotfix · bugfix · mini）

> **状态**：`active`（2026-09-16 10-task 起草 · **HG-TASK-DRAFT / HG-AUDIT-R1 双闸 approved**（00 代签 · 授权真值：维护者本窗「授权00代签」）· 20-task-audit R1 **PASS**（blocking 0 · advisory A1–A2 · A1 已搭车修 · A2 带入 30 守加性原则）· **30 可开工**）  
> **缺陷真值（已查实）**：CI run **35066550895**（push `f9f9c02` 后）`test/w1-gate-generalization.test.ts:179` 失败 —— spawn `scripts/scan-human-gates-baseline.mts:101` 的 `readdirSync('docs/tasks/active')` **ENOENT**。根因：W1/W0 task 全 close 后 `docs/tasks/active/` 为空目录 · git 不跟踪空目录 ⇒ CI 新鲜 checkout 无此目录；本地目录恒在 ⇒ **本地 667 全绿 CI 1 红**。**环境依赖不健壮**（PLAN 硬约束 **10** 同族：环境依赖必须可诊断）  
> **SPEC**：bugfix · **双轨可跳独立 SPEC**（HG-SPEC-SIGNOFF 上行 approved 继承 · 范围/验收/failure_paths 由本 task 承载）  
> **基线（2026-09-16 本棒复跑实测 · 详见「开工基线」节）**：HEAD `f9f9c02` · npm test **667 tests / 130 suites / 666 pass / 0 fail / 1 skip** · typecheck 0 错 · pins **17/17**  
> **行号口径**：本 task 全部行号为 2026-09-16 本棒实读现值  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-w1-ci-hotfix` |
| **test_strategy** | `required` |
| **test_strategy_note** | 验收主体 = 负向锁三连：① 新负向 fixture（无 docs/tasks/active/ 临时树跑扫描器 → exit 0 + 文件数 0 + skipped 注记逐字断言）；② git-archive 模拟 CI 实证（临时拷贝**显式删除** docs/tasks/active/ 跑 w1-gate-generalization → 修复前真红已钉 · 修复后 15/15 转绿 · 硬约束 6）；③ 有目录环境零行为差（A2 比对 232 行逐条 + manifest 一致 · F-HOT-01）。红测先行：负向 fixture 先红后绿 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,00`（mini hotfix · 40 复核由 00 视情加挂） |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 扫描器健壮性守卫；不改图谱资产（`docs/_tech_graph/` 零触碰） |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 无规范增量；同类无守卫面排查登记为 W5/W7 候选（见「同类面快扫登记」节 · 晋升与否归 20/00 裁定） |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0 波次 hotfix；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-16 维护者本窗签收 PLAN_3_0（上行继承 · 3.0 双签之一） |
| HG-SPEC-SIGNOFF | approved | — | 人 · 2026-09-16 维护者本窗签收 3.0 SPEC 系列（上行继承 · 本 task 为 bugfix · 双轨可跳独立 SPEC） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-16 00 代签** · 授权真值：维护者本窗「授权00代签」· task lint PASS |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-16 00 代签** · 授权真值：维护者本窗「授权00代签」· 依据审查文 [`docs/harness/reviews/task_3_0_w1_ci_hotfix_audit_R1_20260916.md`](../../harness/reviews/task_3_0_w1_ci_hotfix_audit_R1_20260916.md)（R1 · PASS · blocking 0 · advisory A1–A2 · A1 已搭车修 · A2 带入 30 守加性原则） |

---

## 背景与目标

**A-真值（CI）**：run 35066550895 · `test/w1-gate-generalization.test.ts:179`（存量快照回归锁 · A2 重扫测）红 —— 该测 spawn `scripts/scan-human-gates-baseline.mts`，其 :101 `readdirSync(abs)` 对 `SCAN_DIRS`（:31 · `docs/tasks/active` + `docs/tasks/done`）**无 existsSync 守卫**，新鲜 checkout 中 `docs/tasks/active/` 不存在 ⇒ ENOENT 崩溃。

**A-根因**：W1 close 归档（`f9f9c02`）后 active/ 为空目录；git 不跟踪空目录 ⇒ CI 无此目录；本地工作区目录恒在 ⇒ 本地全绿 CI 红。典型的**环境依赖不健壮 + 环境差遮蔽**（硬约束 10 同族）。

**A-本棒复核实证（R0 · 10-task 已跑）**：
- 本地 `ls docs/tasks/active/` 为空 · `git ls-files docs/tasks/active/` 零命中 · `git status --porcelain` 干净 · HEAD `f9f9c02`。
- **模拟新鲜克隆实证**：`git archive HEAD` + `git init` 临时拷贝 + `npm ci` 跑该测试文件 → **15 测恰 1 红**（:179 重扫测 · `ENOENT ... scandir '.../docs/tasks/active'` at `scan-human-gates-baseline.mts:101:22` · 14/15 pass）—— 与 CI 真值逐字吻合，修复前真红已钉（硬约束 6 前半）。
- **复现方法陷阱登记**：裸 `git archive`（无 `.git`）会额外带红 3 个 gate-check CLI 测（`--target 不在任何 git 仓内` · 复现方法假象 · **非本缺陷**）—— 模拟 CI 实证**必须 `git init`**（验收 #4 命令已含）。
- **掩盖风险登记（residual ①）**：本 task 文件落入 active/ 后，新鲜 checkout 的 active/ 即非空 ⇒ CI 红被「顺带掩盖」（与 .gitkeep 同构）—— 故验收 #4 必须在临时拷贝中**显式删除** `docs/tasks/active/` 做负向锁，否则修复无法被证明。

**目标**：扫描器对 `SCAN_DIRS` 双目录加 existsSync 守卫 —— 缺失目录按**零文件**处理（不崩 · 语义正确：无 active task 即零采集）；守卫后输出注明 skipped-missing 目录（console + snapshot meta 诊断字段 · 硬约束 10 可诊断口径）。

---

## 开工基线（2026-09-16 本棒复跑实测 · 验收比对的唯一基准）

> 30 开工时若复跑结果与本表不符，按 W1 同式纪律处置（以复跑实测重建基线并登记 · 不得沿用旧数字强行比对）。

| 项 | 实测值 | 备注 |
|----|--------|------|
| git HEAD | `f9f9c02` | 工作区干净 · `docs/tasks/active/` 空目录零 git 跟踪 |
| `npm test` | **667 tests / 130 suites / 666 pass / 0 fail / 1 skip** | duration ≈78s |
| `npm run typecheck` | **0 错** | strict + noUncheckedIndexedAccess |
| `node bin/specgate.js pins check` | **17/17 PASS** | 含 pin-14 / pin-17 |
| 模拟 CI 实证（修复前） | git archive + git init 拷贝跑 w1-gate-generalization → **15 测 1 红**（:179 ENOENT） | 负向锁前半已钉 · 命令见验收 #4 |

---

## 范围

- [ ] **唯一**：`scripts/scan-human-gates-baseline.mts` 扫描循环（:99-104 · 改点 :101）对 `SCAN_DIRS`（:31 · `docs/tasks/active` + `docs/tasks/done` 双目录同式）加 **existsSync 守卫** —— 目录缺失按零文件处理（不崩 · continue）· 守卫后输出注明 skipped-missing 目录（console 行 + snapshot `meta` 诊断字段，如 `skipped_missing_dirs` · 硬约束 10 可诊断口径）。守卫风格照仓内先例（`src/cli-status.ts:35` / `src/cli-sync.ts:20` / `src/cli-task-extra.ts:33` existsSync→continue/return []）。

## 非范围

| 项 | 理由 |
|----|------|
| 改扫描口径 / 判定逻辑 / 行 verdict 语义 / `SCAN_DIRS` 内容 | 守卫只许影响「目录缺失」分支 · 有目录时**零行为差**（F-HOT-01） |
| 改基线 fixture `test/fixtures/human-gates/baseline_20260916.json` | A2 比对真值不动 |
| 其他扫描面（`cli-status` / `cli-sync` / `cli-task-extra` / checks/* 等已守卫面 · `cli-skills` / `cli-wiki` 低危面） | 已守卫面不动 · 低危面登记 W5/W7 候选（见「同类面快扫登记」节）· 不裹挟 |
| **`docs/tasks/active/` 目录本身**（加 `.gitkeep` / 改 `.gitignore` / CI 建目录等） | **守卫是正解 · `.gitkeep` 是掩盖**（F-HOT-02）：空目录是合法语义态（无 active task 即零采集）· `.gitkeep` 制造「目录必非空」的虚假不变量、掩盖环境依赖不健壮根因 · 未来波次再次全 close 时其他裸扫描面照样再犯 |
| 追溯其他测试/命令的环境依赖面 | 登记 W5/W7 候选排查项 · 本棒不修 |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（无代跑授权） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-HOT-00 · 沿 W1 例） | 30 **拒开工**（verify 机械拦 exit 2 · 闸真值以本表为准） | 是（20 审 + 签后） | 是 |
| 守卫改变有目录时行为 → 修复后重扫产物与基线不一致（F-HOT-01） | 验收 #2/#5 双锁拦截（A2 比对 232 行逐条 + manifest 文件集一致）· 守卫只允许影响「目录缺失」分支 | 是 | — |
| 误加 `.gitkeep` 掩盖根因（F-HOT-02） | 非范围明示 · diff 出现 `docs/tasks/active/.gitkeep` 即打回 · 20/40 审查拦 | 是 | — |
| 缺失目录被静默吞掉无诊断（F-HOT-03） | 输出必须含 skipped-missing 注记（console + snapshot meta）· 验收 #1 逐字断言 | 是 | 是 |
| 只守卫 active 漏 done（F-HOT-04） | SCAN_DIRS 双目录同式守卫 · 验收 #1 负向 fixture 覆盖双缺失组合 | 是 | — |
| 越权 tag/push/publish/deprecate（F-HOT-05） | 违禁令 · 打回（四动作全仅人） | — | 是 |

---

## 验收标准（必须自证，不接受「我改完了」）

- [ ] **#1 负向 fixture/单测**（F-HOT-03/F-HOT-04）：在无 `docs/tasks/active/` 的临时目录树（或 mock · 含双目录均缺失组合）跑扫描器 → **exit 0** · 缺失目录文件数 = 0 · 输出含 **skipped 注记**（console 行 + snapshot meta 诊断字段逐字断言）。（实现提示：扫描器 `REPO_ROOT` 自 `import.meta.url` 推导 · 临时树须保 `scripts/` + `src/` 相对结构 · 或由 30 裁定最小重构使 root 可注入 · 不扩范围）
- [ ] **#2 既有 A2 比对测试全绿**：`test/w1-gate-generalization.test.ts` **15 测全绿**（含 :179 存量快照回归锁 232 行逐条不变 · F-HOT-01）
- [ ] **#3 平台锁**：全量 `npm test` **667+N 全绿零回退**（N = 本棒新增测数 · 环境红先对照实验定性）· `npm run typecheck` 0 错 · `node bin/specgate.js pins check` **17/17**
- [ ] **#4 模拟 CI 环境实证**（硬约束 6 负向锁）：临时拷贝中**显式删除** `docs/tasks/active/` 后跑该测试文件 → 修复前真红（本 task R0 已实证 1 红）· 修复后 **15/15 转绿**。参考命令：`TMP=$(mktemp -d); git archive HEAD | tar -x -C $TMP; cd $TMP && git init -q && git add -A && git commit -qm x && rm -rf docs/tasks/active && npm ci --ignore-scripts && node --test --test-concurrency=1 --experimental-strip-types test/w1-gate-generalization.test.ts`（**必须 `git init`**：裸 archive 无 `.git` 带出 3 个 gate-check 测红假象 · R0 登记；**必须 `rm -rf docs/tasks/active`**：本 task 文件入 active/ 后目录非空会掩盖缺陷 · residual ①）
- [ ] **#5 有目录环境零行为差**（F-HOT-01 锁）：本仓正常环境重扫 → snapshot 对 baseline manifest 文件集 + 行键（gate_id,status,blocks,出现序）逐条一致（即 #2 :179 断言面 · 双目录均在时守卫零介入的另一半证明）
- [ ] **#6 结构闸**：`npx spec-wave task lint --file docs/tasks/active/task_3_0_w1_ci_hotfix.md` PASS

---

## 给执行帽的必读列表

1. `scripts/scan-human-gates-baseline.mts`（:31 SCAN_DIRS · :99-104 扫描循环 · **:101 裸 readdirSync = 唯一改点** · :135-162 snapshot meta 结构）
2. `test/w1-gate-generalization.test.ts`（:179 重扫回归锁 · :178-222 describe · 本棒实读现值）
3. `test/fixtures/human-gates/baseline_20260916.json`（A2 比对真值 · 不动）
4. done task [`task_3_0_w1_schema_leap.md`](../done/task_3_0_w1_schema_leap.md)（扫描器由来 · A2 口径 · F-W1-09 比对面纪律 · 基线复跑先例）
5. PLAN [`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) 硬约束 **6**（修严型必须配负向 fixture 回归锁）/ **10**（环境依赖必须可诊断）
6. 仓内守卫先例（照抄风格）：`src/cli-status.ts:35` · `src/cli-sync.ts:20` · `src/cli-task-extra.ts:33`（existsSync→continue/return []）· `test/cli-skills-install.test.ts:303`（`existsSync(dir) ? readdirSync(dir) : []`）

---

## 同类面快扫登记（W5/W7 候选排查项）

**登记排查项**：「仓库级扫描器/测试对空目录/缺失目录环境的健壮性」（2026-09-16 10-task 本棒 grep 全仓 `readdirSync` 快扫 · 晋升 W5/W7 正式排查与否归 20/00 裁定）。

- **唯一真红面（本 task 修复）**：`scripts/scan-human-gates-baseline.mts:101` —— 全仓唯一对「git 不跟踪（空）目录」的裸 `readdirSync`。
- **已守卫面（existsSync 族 19 处 + try/catch 族 + failClosed 设计 · 不动 · R1 审 A1 订正计数并补列）**：existsSync 族 **19 处** = `cli-status.ts:35` / `cli-sync.ts:20,62` / `cli-task-extra.ts:33,93,306` / `checks/invoke-hats.ts:65` / `checks/review-gates.ts:55,102` / `checks/close-guards.ts:395` / `cli-graph-hgm.ts:76,141` / `cli-graph-yaml.ts:126` / `cli-refresh-ide-blocks.ts:107,375` / `host/materialize.ts:105,120,137` / `host/backup.ts:39`（**A1 补列漏计守卫点**：`cli-status.ts:57` · `cli-skills.ts:211` 等 · 全量清点归 W5/W7 排查 task 立项时订正）；try/catch 族 `checks/test-artifacts.ts:8-12,45-49` / `cli-graph-yaml.ts:141-145`；failClosed 设计 `cli-assets.ts:49`（assets 缺失 = BLOCKED · 有意行为）。
- **残余低危候选（本棒不修 · W5/W7 裁定）**：`src/cli-wiki.ts:82`（`listMarkdownFiles` walk 入口无 existsSync · wiki root 缺失时 ENOENT）· `src/cli-skills.ts:74,282`（promptsDir / skills 源目录 · kit 内 git 跟踪非空资产 · 恒在 · 非空目录环境依赖）· `src/cli-pins.ts:299,307`（target root 恒在 · walk 入口守卫情况待复核）。
- **测试面**：`test/*` 对 `test/fixtures/`、`src/` 等 git 跟踪非空目录的 `readdirSync` 依赖属低风险（新鲜 checkout 恒有）· 不登记。

---

## 思考轮

### R0 · 证据

CI 真值（run 35066550895 · :179 红 · ENOENT）+ 本地复核（active/ 空 · `git ls-files` 零命中 · HEAD f9f9c02 干净树）+ **git archive + git init 模拟新鲜克隆实证恰 1 红**（:179 · scanner :101:22 · 与 CI 逐字吻合）+ 裸 archive 3 红假象登记（须 git init）+ 基线实测 667/130/666/0/1 · typecheck 0 · pins 17/17 + 全仓 readdirSync 快扫（scanner:101 为唯一真红面 · 16 处已守卫 · 3 组低危候选）。

### R1 · 范围

唯一 = scanner 双目录 existsSync 守卫 + skipped-missing 诊断输出；非范围含 .gitkeep 禁令（理由落表）· 口径/fixture/判定逻辑不动 · 其他扫描面不裹挟 · 发布四动作仅人。

### R2 · 方案

existsSync 守卫 continue（照 `cli-status.ts:35` / `cli-sync.ts:20` 先例 · 零新依赖零新语义）· 缺失目录计零文件（无 active task 即零采集 · 语义正确）· skipped-missing 落 console + snapshot meta（硬约束 10 可诊断 · F-HOT-03）· 不修目录本身（.gitkeep 掩盖 · F-HOT-02）。

### R3 · 边界

S2 只新增（本 task + 30 交付 scripts/test 改动）· 不签任何闸 · 逐文件显式 add 禁裹挟 · 不动 baseline fixture · 低危候选面只登记不修 · 本 task 文件入 active/ 的掩盖效应由验收 #4 显式删目录对冲。

### R4 · 可测性

验收 6 条全机械（负向 fixture exit 0 + 注记逐字 · 15 测全绿 · 667+N 零回退 · git-archive 显式删目录红转绿 · manifest 逐条 · task lint）· 红测先行 = 负向 fixture 先红后绿 + 修复前真红 R0 已钉。

### R5 · 签收就绪

草稿预置五槽完毕；充分性经 20-task-audit R1 复核 **PASS**（[审查文](../../harness/reviews/task_3_0_w1_ci_hotfix_audit_R1_20260916.md) · blocking 0 · advisory A1–A2 · A1 已搭车修 · A2 带入 30 守加性原则）；HG-TASK-DRAFT / HG-AUDIT-R1 均已 **approved**（2026-09-16 00 代签 · 授权真值：维护者本窗「授权00代签」）；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | CI 真值 + 本地复核 + 模拟克隆实证 1 红钉死 + 基线 667/666/0/1 · typecheck 0 · pins 17/17 + 同类面快扫完毕 | no |
| R1 | 范围唯一（双目录守卫 + 诊断输出）· 非范围含 .gitkeep 禁令 | no |
| R2 | existsSync 先例方案 · 零文件语义 · skipped-missing 双通道诊断 | no |
| R3 | S2 只新增 · 不签闸 · 禁裹挟 · 掩盖效应对冲入验收 #4 | no |
| R4 | 验收 6 条全机械 · 红测先行面明示 | no |
| R5 | 20 审 R1 PASS（blocking 0 · advisory A1–A2）· 双闸 approved（2026-09-16 00 代签 · A1 已搭车修） | no |

**residual_risks**：① **本 task 文件入 active/ 即顺带掩盖 CI 红**（新鲜 checkout 目录非空 · 与 .gitkeep 同构）—— 缓解：验收 #4 显式 `rm -rf docs/tasks/active` 负向锁 + residual 登记 · 30 不得以「CI 已绿」替代守卫交付；② `docs/tasks/done/` 未来若整体清空/搬迁同类再犯（缓解：守卫双目录同式覆盖 + W5/W7 排查项登记兜底）；③ 低危无守卫残余面（`cli-wiki.ts:82` / `cli-skills.ts:74,282` / `cli-pins.ts:299,307`）本棒不修（缓解：登记节落盘 · 20/00 裁定是否立 W5/W7 排查 task）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 验收主体 = **负向锁三连**（① 新负向 fixture 缺失目录 exit 0 + skipped 注记逐字断言；② git-archive 模拟 CI 显式删目录红转绿 · 硬约束 6；③ 有目录环境 A2 比对 232 行逐条 + manifest 一致 · F-HOT-01），辅以：红测先行（负向 fixture 先红后绿）· 每 commit 前后 `npm test` 同绿（基线 667/130/666/0/1）。**本棒是健壮性修严波 · 红绿纪律 = 缺失目录新行为 fixture 先行 · 有目录旧行为回归锁兜住。**

---

## 提交信息约定

- `test(3.0-W1): 扫描器缺失目录负向 fixture（exit 0 + skipped 注记 · F-HOT-03/04 先红）`
- `fix(3.0-W1): 闸基线扫描器空目录守卫（existsSync 双目录 · skipped-missing 可诊断 · CI run 35066550895 hotfix）`
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界
- **禁 tag / push / publish / deprecate（仅人 · 无代跑授权）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w1_ci_hotfix.md`

---

### 自检结论（执行者）

（待 30 执行棒回填）

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 初稿 · 10-task（CI run 35066550895 hotfix · bugfix 双轨跳 SPEC）：缺陷真值 + 根因落背景节 · 本棒实证（active/ 空零跟踪 · git archive+init 模拟恰 1 红 · 裸 archive 3 红假象登记）· 基线复跑（667/130/666/0/1 · typecheck 0 · pins 17/17）· 范围唯一（scanner 双目录 existsSync 守卫 + skipped-missing 诊断）· 非范围含 .gitkeep 禁令（理由落表）· 验收 6 条（含 #4 模拟 CI 显式删目录负向锁 · 对冲本 task 文件掩盖效应）· F-HOT-00–05 · R0–R5 五槽 + residual 三条 · 同类面快扫登记（1 真红 + 16 已守卫 + 3 组低危候选）· 本棒不签任何闸 |
