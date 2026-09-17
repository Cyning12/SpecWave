# Task：3.0 W7 hotfix · 文档链接机检环境依赖（本地 23 假绿 / CI 34 红 · 存在性判据改入库状态并重建基线）（CI hotfix · bugfix · mini）

> **状态**：`done`（2026-09-17 10-task 起草 · **HG-TASK-DRAFT = approved**（2026-09-17 00 代签 · 授权真值：维护者本窗授权（tag/push 代跑「授权」+ 过程文档闸代签模式）· task lint PASS）· **HG-AUDIT-R1 = approved**（2026-09-17 00 代签 · 授权真值：维护者本窗授权 · 依据审查文 [`task_3_0_w7_ci_hotfix_audit_R1_20260917.md`](../../harness/reviews/task_3_0_w7_ci_hotfix_audit_R1_20260917.md)（R1 · PASS-with-issues · blocking 0 · advisory A1–A6 · A4/A5/A6 已搭车修 · A1/A2 带入 30））· **30 可开工**（GATE_VERIFY PASS））· 2026-09-17 30 修复交付（`98bc9e0` + `fdcc8b9` · 验收 6/6 勾选 · 锁 860/164/859/0/1 · clone/local 双 34 IDENTICAL）· 40 复核 **PASS-with-issues**（blocking 0 · advisory 5 · 40 留档 `44662d1`）· 00 收官裁定 **Task_KPI%: 94** · task close 归档 `done/`
> **缺陷真值（已查实 · 本棒复跑）**：tag `v3.0.0`（`3d1b9d3`）+ `main` 双 CI run **35245272523 / 35245273138**（push · 同 headSha）红 —— `test (22.x)` 与 `test (24.x)` 双 job **failure** · 全仓唯一失败测 = `test/check-doc-links.test.ts:35` 正向测。CI 日志逐字：`DOC LINKS (i) 非S2 = 0 · S2 = 34 / 冻结基线 23 · (ii) 非S2 = 0` / `DOC LINKS: FAIL · 非S2(i)=0 非S2(ii)=0 · S2(i)=34 ≠ 基线 23`（同文件其余 3 条 fixture 全绿 · 失败面单一）。
> **SPEC**：bugfix · **双轨可跳独立 SPEC**（HG-SPEC-SIGNOFF 上行 approved 继承 · 范围/验收/failure_paths 由本 task 承载）
> **根因（本棒实读 + 三组对照实验定位 · 详见「根因与修法」节）**：`scripts/check-doc-links.mjs:96` `const exists = existsSync(targetAbs)` —— 「可解析 (i)」用**文件系统存在性**判定。本机 `.workbuddy/`（`.gitignore` 忽略但实体在）使 S2 文内 11 处 `.workbuddy/output/验收报告-*.md` 链接「存在」⇒ 少计 11 ⇒ 本地 **23 假绿**；CI/干净 clone 无该实体 ⇒ **34 真红**。**环境依赖判据（硬约束 10 同族）+ 冻结基线 23 系假绿口径**。
> **基线（2026-09-17 本棒复跑实测 · 详见「开工基线」节）**：HEAD `3d1b9d3`（= tag `v3.0.0`）· npm test **859 tests / 164 suites / 858 pass / 0 fail / 1 skip** · typecheck 0 错 · pins **17/17** · 本地 checker **23 假绿** / 干净 clone **34 真红**
> **行号口径**：本 task 全部行号为 2026-09-17 本棒实读现值（HEAD `3d1b9d3`）
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-w7-ci-hotfix` |
| **test_strategy** | `required` |
| **test_strategy_note** | 验收主体 = **环境无关性负向锁三连**：① 新负向 fixture（临时 root 放 gitignore 但实体在的 `.workbuddy/x.md` + 引用它的 S2 md → 修后仍计 (i) 坏链 · 修前 S2=0 被文件系统存在性掩盖 = 真红对照）；② **本地 vs 干净 clone 同值双跑**（两处 S2 (i) 集合逐条一致 · 非 S2 (i)/(ii)=0 · S2=34=冻结基线）；③ **模拟 CI 真红转绿**（`git clone .` 干净 clone：修前 34 ≠ 23 exit 2 · 修后 PASS exit 0 · 硬约束 6）。并锁两条实测回归面：目录链 48 处不得误伤 · 非 ASCII tracked 链 1 处不得误伤。红测先行：新 fixture 先红后绿。 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,00`（mini hotfix · 40 复核由 00 视情加挂） |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 改的是文档链接机检脚本的**判据真值源**（文件系统 → 入库状态）与冻结基线；`docs/_tech_graph/` 图谱/本体/HGM 资产零触碰 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 无规范增量（`docs/coding_wiki/` 本仓不存在 · 本棒实证）；「环境依赖判据（FS 存在性 vs 入库状态）」是否升为通用守卫面登记为 3.x/W5 候选 · 晋升归 20/00 裁定 |
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
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗授权（tag/push 代跑「授权」+ 过程文档闸代签模式）· task lint PASS |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗授权 · 依据审查文 [`task_3_0_w7_ci_hotfix_audit_R1_20260917.md`](../../harness/reviews/task_3_0_w7_ci_hotfix_audit_R1_20260917.md)（R1 · PASS-with-issues · blocking 0 · advisory A1–A6 · A4/A5/A6 已搭车修 · **A1/A2 带入 30 执行要求**：修复 commit 后以最终 commit 干净 clone 复跑 checker（验收 #1/#2）；S2 基线以最终 commit 克隆实测为准） |

---

## 背景与目标

**A-真值（CI · 本棒经 `gh` 复核）**：run **35245272523** 与 **35245273138** 均 `conclusion=failure` · `headSha=3d1b9d38c76183c649af10b0523b2237f0582699`（= tag `v3.0.0`）· `event=push` · `workflow=ci`。同 run 内 `test (22.x)` / `test (24.x)` 双 job `failure`，`audit` / `secrets-scan` 两 job `success`。失败根因行：

```text
# Subtest: 正向：真实仓 非S2(i)=0 非S2(ii)=0 · S2 冻结基线 23 · exit 0
not ok 1 - 正向：真实仓 非S2(i)=0 非S2(ii)=0 · S2 冻结基线 23 · exit 0
  location: 'test/check-doc-links.test.ts:35:3'
  DOC LINKS (i) 非S2 = 0 · S2 = 34 / 冻结基线 23 · (ii) 非S2 = 0
  DOC LINKS: FAIL · 非S2(i)=0 非S2(ii)=0 · S2(i)=34 ≠ 基线 23
```

**A-根因（本棒定位 · 逐条可复跑）**：

1. `scripts/check-doc-links.mjs:96` 的「可解析 (i)」判据 = `existsSync(targetAbs)`，即**本机文件系统状态**，而非**入库（`git ls-files`）状态**。
2. 本机 `.workbuddy/` 被 `.gitignore:4` 整体忽略，但**实体在**（含 11 处 `验收报告-SpecWave-2.2.0/2.3.0/2.4.0/2.4.1.md`）；S2 文内（`docs/tasks/done/*_patch.md`、`docs/harness/reviews/*_audit_*.md`）引用这些路径的链接在本地 `existsSync` 为真 ⇒ **不计 (i) 坏链** ⇒ 本地 23。
3. CI / 干净 clone 无该实体（git 不跟踪）⇒ 同样 11 处计入 (i) ⇒ **34**。实测：干净 clone `git clone . /tmp/x && git checkout v3.0.0` → `S2=34 ≠ 23` exit 2（与 CI 逐字吻合）。
4. **冻结基线 23 系假绿口径**（在「文件系统存在性」判据下本地实测值）；判据本身环境依赖（硬约束 **10** 同族）⇒ 基线随环境漂移，CI 是不可信绿。

**A-本棒对照实验（定位修法边界 · `/private/tmp` 临时脚本副本 · 仓内零改动）**：

| 实验 | 判据 | 本地 S2 | clone S2 | 非 S2 (i) | 结论 |
|------|------|--------|----------|-----------|------|
| 修前 | `existsSync` | 23 | 34 | 0 | 假绿 vs 真红 |
| 最小改法（parent 字面式） | `inRepo ? gitTracked.has(targetRel) : existsSync(targetAbs)` | 42 | 42 | **48** | **不可用**：目录链（`../spec/…/` 等）被误伤 → 非 S2 (i) 0→48 硬回归 |
| + 目录前缀守卫 | `… OR trackedDirs.has(targetRel)` | 34 | 1 | **1** | 仍不可用：非 ASCII 路径被 `git ls-files` 默认八进制转义 → `.has` 永不命中（`docs/guides/DOGFOOD_host_adapt_cursor_claude_录屏清单_v1_zh.md`） |
| **法定修法（本 task 采纳）** | 目录前缀 + **原样读取 tracked 集合**（`-z`） | **34** | **34** | **0** | 两处集合 **逐条 IDENTICAL** · 环境无关 |

**目标**：把 (i) 判据从「文件系统存在性」改为「**入库状态**」（与 level (ii) 同一真值源 `git ls-files`），并按修后实测**重建冻结基线 23 → 34**；配环境无关性负向 fixture 回归锁（硬约束 6），使本地与 CI/干净 clone **同值同绿**。

---

## 根因与修法（给 30 的执行口径 · 本棒不实现）

**唯一改点**：`scripts/check-doc-links.mjs` 内 (i) 存在性判据 + tracked 集合读取 + 基线常量。

**法定修法（三件须同时成立 · 缺一即回归 · 本棒对照实验已钉）**：

1. **(i) 判据入库化** —— `inRepo` 目标：`gitTracked.has(targetRel) || trackedDirs.has(targetRel)`（tracked **文件** 或 **tracked 目录前缀**）；仓外目标：维持 `existsSync(targetAbs)`（F-HOT2-02）。
   - `trackedDirs` = 由 tracked 文件集推导的全部祖先目录集合（git 只跟踪文件 · `../spec/3_0-architecture-leap/` 这类目录链须命中 · 否则非 S2 (i) 0→**48** · F-HOT2-04）。
2. **tracked 集合原样读取** —— `spawnSync('git', ['-c','core.quotepath=false','ls-files','-z'], { cwd: root, encoding:'utf8' })` + `split('\0')`。默认 `git ls-files`（无 `-z` + 默认 `core.quotePath=true`）对非 ASCII 路径输出八进制转义（如 `"…\345\275\225…"`）· `Set.has(UTF-8 路径)` 永不命中 ⇒ 非 S2 (i) 0→**1**（F-HOT2-05）。
3. **基线重建** —— `S2_FROZEN_BASELINE = 23` → **34**（修后本地/干净 clone 双跑实测同值）· 头注释口径同步为「**入库状态而非文件系统状态**」+ 登记环境依赖根因与重建理由。

**配套（防自咬 · 本棒实测）**：本 task 草稿入 active/ 后链接机检 **S2 仍 = 23**（零新增坏链 · 本棒实测）；但 in-flight 过程件（审查文 / 30 invoke / 自检回填）会持续增链，且 `S2_PARAM_EXCLUDE` 现指向的 W7 closeout task 已归档 done（条目失效）⇒ 改为 `['docs/tasks/active/task_3_0_w7_ci_hotfix.md']`（沿用 W7 参数化排除口径 · 防自咬污染 34 · F-HOT2-07）。

**红线**：仓外分支必须保留 `existsSync`；不得以删除本地 `.workbuddy` 实体 / `git add -f` 入库 / 改 `.gitignore` 制造「环境一致」假绿（判据修的是**环境无关**，不是**环境相同** · F-HOT2-08）。

---

## 开工基线（2026-09-17 本棒复跑实测 · 验收比对的唯一基准）

> 30 开工时若复跑结果与本表不符，按 F-W0-05 同式纪律处置（以复跑实测重建基线并登记 · 不得沿用旧数字强行比对）。

| 项 | 实测值 | 备注 |
|----|--------|------|
| git HEAD | `3d1b9d3`（= tag `v3.0.0`） | 工作区 clean（本 task 起草后 +1 untracked）· tag **在** |
| `npm test` | **859 tests / 164 suites / 858 pass / 0 fail / 1 skip** | duration ≈62s · tag 已打 ⇒ pin-10 tag-gated 现绿 |
| `npm run typecheck` | **0 错** | strict + noUncheckedIndexedAccess |
| `node bin/specgate.js pins check` | **17/17 PASS · exit 0** | 含 pin-10 = tag `v3.0.0` 钉 |
| 本地 checker（修前） | **S2=23 = 冻结基线 23 · exit 0（假绿）** | `node scripts/check-doc-links.mjs` · `.workbuddy/` 实体在 |
| 干净 clone checker（修前） | **S2=34 ≠ 23 · exit 2（真红）** | `git clone . /tmp/x && git checkout v3.0.0` · 与 CI run 35245272523 逐字吻合 |
| 修后预期基线 | **本地 34 / clone 34 / 非 S2 (i)(ii)=0 / PASS** | 本棒对照实验已实测（R0 表）· 30 须复跑确认并以其重建为准 |

---

## 范围（唯一）

- [x] **1. `scripts/check-doc-links.mjs`**：(i) 存在性判据改**入库状态**（inRepo = tracked 文件 ∪ tracked 目录前缀 · 仓外仍 `existsSync`）· tracked 集合**原样读取**（`-z`/quotepath=false）· `S2_FROZEN_BASELINE` 重建 **23→34** · `S2_PARAM_EXCLUDE` 更新为本 task 路径（防自咬 · 本棒实测草稿零坏链 S2=23 · 防 in-flight 过程件增链）· 头注释口径同步（「入库状态而非文件系统状态」+ 环境依赖根因/重建理由）。
- [x] **2. `test/check-doc-links.test.ts`**：① 正向测期望基线随重建值更新（:35 用例名 + :39 `冻结基线 23` → **34**）；② **新增环境无关性负向 fixture**（临时 root `git init` · 放 gitignore 但实体在的 `.workbuddy/x.md` + 引用它的 S2 md → 修后仍计 (i) 坏链：`--s2-baseline 1` exit 0 / `--s2-baseline 0` exit 2；修前同 fixture S2=0 = 真红对照）；③ **既有负向 (ii) fixture 复绿分支须 `git init` + `git add docs/roadmap/tracked.md`**（tracked-based 下「写在临时目录但未入库」不再算可解析 · 不改则该测修后转红 · 本棒预演实证）。
- [x] **3. 基线/文档同步（标注级 · 逐处登记）**：`docs/roadmap/ACCEPTANCE_3_0_architecture_leap_3_0_0_zh.md` 三处 `S2 冻结基线 23` → **34**（:35 / :45 / :62）· 同处加一行口径补注（23 系 FS 存在性假绿口径 · 34 为入库状态重建值）；`docs/harness/reviews/w7_release_probe_3_0_0_20260917.md` **grep 实测零引用 23 ⇒ 零改动**（S2 只新增不覆写 · 硬约束 1）。
- [x] **4. 模拟 CI 实证**：`git clone . /tmp/ci-sim && cd /tmp/ci-sim && node scripts/check-doc-links.mjs` → 修后 PASS（`S2=34 / 冻结基线 34` exit 0）；修前同命令真红 34（R0 已实测）· 留证（命令 + 输出写入 30 invoke）。

## 非范围

| 项 | 理由 |
|----|------|
| 改 `src/` 产品面 / `lib/` / `bin/` | checker 是 `scripts/` 独立脚本（`npm test` 接线）· 不进产品入口；本 task 零产品面变更 |
| 修 34 处 S2 冻结坏链本身 | S2 永不覆写（硬约束 1）· 历史 stale 链接不可修 · 基线只登记不追债 |
| `.workbuddy/` 实体 / `.gitignore` / `git add -f` | 判据修「环境无关」而非「环境相同」· 删实体/force-add 是**掩盖**（F-HOT2-08） |
| 移动/重打/删除 tag `v3.0.0` | 争议项不在本 task 范围 · 归 00/维护者决策（F-HOT2-03） |
| 改 `.github/workflows/ci.yml` / 测试矩阵 / 其他检查脚本（`check-terminology` / `check-claims` / `scan-human-gates-baseline` 等） | 已守卫或非本缺陷面 · 不裹挟（本棒 `scripts/` 快扫：唯 `:96` 命中本族） |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（无代跑授权） |
| 历史留档里的 23（`docs/tasks/done/task_3_0_w7_closeout_external.md` :401/:416 · W7 40 invoke） | S2 历史留档 · 只新增不覆写 |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-HOT2-00） | 30 **拒开工**（verify 机械拦 exit 2 · 闸真值以本 task 表为准） | 是（20 审 + 签后） | 是 |
| 修后基线重建值仍与干净 clone / CI 不一致（F-HOT2-01） | 验收 #1/#2 双跑不一致即 **STOP** · 以复跑实测重建基线并登记 · **不得**沿用 34 硬套 | 是 | 是 |
| tracked-based 误伤**仓外/生成物**链接（F-HOT2-02） | 仓外分支保留 `existsSync`；误伤即验收 #2 非 S2(i)≠0 拦 | 是 | — |
| tracked-based 误伤**目录链接**（`../spec/…/` 等 · git 不跟踪目录）→ 非 S2 (i) 0→48（F-HOT2-04） | 必须用 tracked 目录前缀（`trackedDirs`）判目录 · 验收 #2 拦 | 是 | — |
| tracked 集合默认 quotePath 转义非 ASCII → 误判未入库（F-HOT2-05） | tracked 集合原样读取（`-z`/quotepath=false）· 验收 #2 拦 | 是 | — |
| 既有 (ii) fixture 复绿分支未 `git add` → 修复后转红（F-HOT2-06） | fixture 须 `git init` + `git add` · 验收 #4 `npm test` 拦 | 是 | — |
| 本 task 自身坏链污染基线（`S2_PARAM_EXCLUDE` 未更新）（F-HOT2-07） | 计数 >34 → 验收 #2 拦 | 是 | — |
| 以删本地 `.workbuddy` / `git add -f` / 改 `.gitignore` 制造环境一致假绿（F-HOT2-08） | 非范围明示 · diff 出现上述动作即打回 · 20/40 审查拦 | 是 | — |
| tag 移动争议（F-HOT2-03） | **不在本 task 范围** · 归 00 决策 | — | 是 |
| 越权 tag/push/publish/deprecate | 违禁令 · 打回（四动作全仅人） | — | 是 |

---

## 验收标准（必须自证，不接受「我改完了」）

> **计数口径（A6 订正）**：本 task 验收 = **6 条（#1–#6）** · failure_paths = **9 条（F-HOT2-00–08）**（审查指令括注「5 条 / F-HOT2-01..05」为子集 · 以本 task 现值为真值）。
> **30 执行要求（A1/A2 带入 · 00 裁定）**：#1/#2 的 `git clone .` 取**修复 commit 后的 HEAD**（未提交即跑仍是修前脚本 · 见 A1）；S2 基线以**最终 commit 克隆实测**为准（过程件若增链按 F-HOT2-01 重建并登记 · 见 A2）。

- [x] **#1 模拟 CI 实证（修后绿）**（F-HOT2-01 · 硬约束 6）：`git clone . /tmp/ci-sim && cd /tmp/ci-sim && node scripts/check-doc-links.mjs` → **exit 0** 且输出 `非S2(i)=0 非S2(ii)=0 · S2 冻结基线 34`。**对照**：修复前同命令 **exit 2** · `S2(i)=34 ≠ 基线 23`（本 task R0 已实测钉死）。留证：命令 + 两端输出写入 30 invoke。**本棒实测（修复 commit `98bc9e0`）**：clone → `S2=34 / 冻结基线 34` exit 0；修前 clone `ef1c06f` → `S2(i)=34 ≠ 23` exit 2。
- [x] **#2 本地 checker PASS 且与 clone 同值**（环境无关核心）：仓根 `node scripts/check-doc-links.mjs` → **exit 0** · `S2 = 34 = 冻结基线`；且本地与 `/tmp/ci-sim` 的 S2 (i) **集合逐条一致**（本棒 R0 对照实验：IDENTICAL）。**回归锁**：非 S2 (i)=**0** 且非 S2 (ii)=**0**（目录链 48 处 + 非 ASCII tracked 链 1 处均不得回归）。**本棒实测**：本地 exit 0 · S2=34 · clone 同值 34 · S2 (i) 集合 diff 空 **IDENTICAL** · 非 S2 (i)=0 (ii)=0（三组对照 48/1/0 复跑复现）。
- [x] **#3 环境无关性负向 fixture 红→绿**（F-HOT2-05/08 · 硬约束 6）：新 fixture 在临时 root（`git init`）放 gitignore 但实体在的 `.workbuddy/x.md` + 引用它的 S2 md → 修后 `--s2-baseline 1` **exit 0**（该链计入 S2 (i)）· `--s2-baseline 0` **exit 2**；**修前同 fixture S2=0**（被文件系统存在性掩盖）= 真红对照（本棒 R0 预演：pre-fix S2=0 exit 2 · post-fix S2=1 exit 0）。**本棒实测**：定向测试修前 3 pass / 2 fail（正向 34 + 新 fixture 红）→ 修后 5 pass / 0 fail。
- [x] **#4 全量 npm test 全绿**：`npm test` → **858 pass / 0 fail / 1 skip**（不含新增测前 · tag `v3.0.0` 已打 ⇒ pin-10 tag-gated 现绿）；新增 fixture N 条后 **858+N pass / 0 fail**。既有 4 条 check-doc-links fixture 全绿（含按范围 2③ 调整的 (ii) 复绿分支）。**本棒实测**：`npm test` → **860 tests / 164 suites / 859 pass / 0 fail / 1 skip**（= 基线 858 + 1 新 fixture）。
- [x] **#5 typecheck / pins**：`npm run typecheck` **0 错** · `node bin/specgate.js pins check` **17/17 PASS**。**本棒实测**：typecheck 0 错 · pins 17/17 · build 0 · test:lib 6/6 · assets 113/113 · terminology/claims PASS · 依赖零新增。
- [x] **#6 结构闸**：`npx spec-wave task lint --file docs/tasks/active/task_3_0_w7_ci_hotfix.md` PASS（E1–E8 / W5–W7：R0–R5 槽位 + 控制表齐）。**本棒实测**：`task lint` → `LINT: PASS`。

---

## 给执行帽的必读列表

1. `scripts/check-doc-links.mjs`（:19-24 基线与 `S2_PARAM_EXCLUDE` · **:96 唯一判据改点** · :117-118 tracked 集合读取 · :32-62 链接提取）
2. `test/check-doc-links.test.ts`（:34-75 四条 fixture · **:35/:39 正向基线** · :55-67 待调整的 (ii) 复绿分支 · :69-74 S2 基线拦）
3. done task [`task_3_0_w1_ci_hotfix.md`](../done/task_3_0_w1_ci_hotfix.md)（同族 CI hotfix 先例 · bugfix 双轨跳 SPEC · 模拟 CI 负向锁 · 偏差登记表式）
4. done task [`task_3_0_w7_closeout_external.md`](../done/task_3_0_w7_closeout_external.md)（:179-180 链接两级判据由来 · :279/:401/:416 基线 23 历史口径）
5. PLAN [`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) 硬约束 **1**（S2 永不覆写 · :330）/ **6**（修严型必须配负向 fixture · :335）/ **10**（环境依赖必须可诊断 · :339）/ **14**（证据必须入库 · :343）
6. [`ACCEPTANCE_3_0_architecture_leap_3_0_0_zh.md`](../../roadmap/ACCEPTANCE_3_0_architecture_leap_3_0_0_zh.md)（:35/:45/:62 待标注 23→34）
7. [`w7_release_probe_3_0_0_20260917.md`](../../harness/reviews/w7_release_probe_3_0_0_20260917.md)（grep 实测零引用 23 · 零改动）
8. CI 真值：run 35245272523 / 35245273138（`gh run view <id> --log-failed` · 失败测 `test/check-doc-links.test.ts:35`）

## 依赖

- 运行期：`git`（checker 已依赖 `git ls-files` 判 (ii)；本修使 tracked 集合成为 (i)/(ii) 共同真值源）。
- 仓内：`scripts/check-doc-links.mjs` ↔ `test/check-doc-links.test.ts`（spawn 调用）· 基线常量 `S2_FROZEN_BASELINE` 被正向测与 CLI 共用。
- 上游：无独立 SPEC（bugfix 双轨）；依据 PLAN 硬约束 6/10 + W7 链接两级判据（done task 与 SPEC 08 §5.2）。

---

## 同类面快扫登记（本棒不修 · 归 20/00 裁定）

**登记排查项**：「`scripts/` 内以**文件系统存在性**充当**入库/可达性**判据的面」（2026-09-17 本棒 grep 全仓 `scripts/` 快扫）。

- **唯一真红面（本 task 修复）**：`scripts/check-doc-links.mjs:96`。
- **已守卫/非本族面（不动）**：`scan-human-gates-baseline.mts:105`（W1 hotfix 已加 existsSync 目录守卫）· `check-terminology.mjs:29,41` / `check-claims.mjs:27,39`（目录/单文件存在性守卫 · 非 gitignore 证据判据）· `check-export-surface.mjs:49,73`（产物存在性 · 与入库无冲突）。
- **残余低危候选（本棒不修）**：**git 不可用时的可诊断性**（`scripts/check-doc-links.mjs:117` `spawnSync('git',…)` 失败时 `gitTracked` 为空 ⇒ 全 in-repo 链接判坏 · 方向 fail-closed 但报错未按因分档 · 硬约束 10 尚差一步）—— 建议升为后续 W5/3.x 候选 · 本棒只登记。

---

## 思考轮

### R0 · 证据

CI 真值（run **35245272523** / **35245273138** 双 failure · `headSha=3d1b9d3` · `test(22.x)`/`test(24.x)` 双 job 红 · 唯一失败测 `:35` · 日志逐字 `S2(i)=34 ≠ 基线 23`）+ 本棒复跑（本地 checker 23 exit 0 假绿 · 干净 clone `/tmp/x`@v3.0.0 checker 34 exit 2 真红 · 两端 S2 差集 = 11 处 `.workbuddy/output/验收报告-*.md`）+ **三组对照实验**（字面式 42/48 不可用 → +目录前缀 34/非S2=1 → +原样读取 **34/34/非S2=0 IDENTICAL**）+ 环境无关 fixture 预演（pre-fix S2=0 exit 2 / post-fix S2=1 exit 0）+ 基线实测 **859/164/858/0/1** · typecheck 0 · pins **17/17** · tag `v3.0.0`@`3d1b9d3` + `scripts/` FS 判据快扫（唯 `:96` 命中本族）。

### R1 · 范围

唯一 = checker (i) 判据入库化（tracked 文件 ∪ tracked 目录前缀 · 仓外 existsSync）+ tracked 集合原样读取 + 基线 23→34 + `S2_PARAM_EXCLUDE` in-flight 更新 + test 正向值/新负向 fixture/(ii) fixture 入库化 + ACCEPTANCE 三处标注；非范围含 tag 决策、S2 追债、`.workbuddy`/`.gitignore` 掩盖式修法、`src/` 产品面、发布四动作。

### R2 · 方案

(i)/(ii) 同真值源（`git ls-files`）· 目录链以 tracked 前缀推导（不引入 `existsSync` 目录回退 · 保持环境无关）· tracked 集合 `-z` 原样读取（避免 quotePath 转义）· 基线按修后双跑实测重建 · 防自咬参数化排除 in-flight 本 task。**不**采字面式最小改法（实测非 S2 (i) 0→48 硬回归）· **不**采删实体/force-add 掩盖（F-HOT2-08）。

### R3 · 边界

S2 只新增（本 task + 30 invoke/review）· 不追债 34 处冻结坏链 · 不改 S2 历史留档 · 不改 CI workflow · 不签任何闸 · 逐文件显式 add 禁裹挟 · `docs/roadmap/` 标注只改三处数字 + 一行补注 · tag/push/publish 零触碰。

### R4 · 可测性

验收 6 条全机械（clone PASS + 本地同值集合逐条 + fixture 红→绿 + 858+N 零回退 + typecheck/pins + task lint）· 红测先行 = 环境无关 fixture 先红（pre-fix S2=0）后绿 + 修前 clone 真红 R0 已钉 · 双跑同值为环境无关的唯一硬判据。

### R5 · 签收就绪

草稿预置五槽完毕；20-task-audit R1 审查文已落盘 **PASS-with-issues（blocking 0 · advisory A1–A6）**；**HG-TASK-DRAFT approved + HG-AUDIT-R1 approved（均 2026-09-17 00 代签）** —— 30 可开工（闸真值以 task 表为准）；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | CI 双 run 真值 + 本地 23 假绿 / clone 34 真红 + 三组对照实验定位法定修法 + fixture 预演 + 基线 859/858/0/1 · pins 17/17 · tag 在 + scripts/ 快扫 | no |
| R1 | 范围唯一（checker 判据 + tracked 读取 + 基线 + test 三改 + ACCEPTANCE 三处）· 非范围含 tag/S2 追债/掩盖式修法 | no |
| R2 | (i)/(ii) 同真值源 + tracked 目录前缀 + `-z` 原样读取 + 基线重建 + 防自咬排除 | no |
| R3 | S2 只新增 · 不签闸 · 禁裹挟 · 标注级改动边界明确 | no |
| R4 | 验收 6 条全机械 · 红测先行面明示 · 本地/clone 双跑同值为硬判据 | no |
| R5 | 20-task-audit R1 已落盘（PASS-with-issues · blocking 0 · advisory A1–A6）· 双闸 approved（2026-09-17 00 代签）· A4/A5/A6 已搭车修 · A1/A2 带入 30 | no |

**residual_risks**：① **(i) 语义收严的代价** —— tracked-based 使「本地存在但未入库的非 `.workbuddy` 链接」亦判坏链；本仓实测非 S2 (i)=0（目录链 + tracked 非 ASCII 全覆盖后），但未来引入未入库生成物链接会红（**缓解**：仓外分支保留 `existsSync` · tracked 目录前缀 · fixture 明示语义）；② **git 不可用不可诊断** —— `gitTracked` 为空时全 in-repo 链接判坏（fail-closed 方向正确 · 报错未按因分档 · 硬约束 10 尚差一步）（**缓解**：登记「同类面快扫」后续 W5/3.x 候选 · 本棒不裹挟）；③ **`S2_PARAM_EXCLUDE` 过期** —— in-flight 路径在 task 归档 done 后失效，本 task 自身坏链届时将计入（历史留档面 · 归后续）；④ **34 处 S2 冻结坏链不修**（硬约束 1）· 基线只登记；⑤ **CI 平台矩阵 22.x/24.x** 本修走 Node API + git · 无平台特化分支（小面局部改动）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 验收主体 = **环境无关性负向锁三连**（① 新环境无关 fixture 红→绿；② 本地 vs 干净 clone 双跑同值 + S2 (i) 集合逐条一致；③ 模拟 CI 真红转绿 · 硬约束 6），并锁两条实测回归面（目录链 48 处 · 非 ASCII tracked 链 1 处）。红测先行：新 fixture 先红（pre-fix S2=0）后绿。每 commit 前后 `npm test` 同绿（基线 858 pass / 0 fail / 1 skip）。**本棒是环境无关修严波 · 红绿纪律 = tracked-based 新行为 fixture 先行 · 旧行为（非 S2 硬判 0 + S2 冻结集）回归锁兜住。**

---

## 提交信息约定

- `test(3.0-W7-hotfix): 链接机检环境无关 fixture（gitignore 实体 .workbuddy 仍判坏链 · F-HOT2-05 先红）`
- `fix(3.0-W7-hotfix): 文档链接 (i) 判据改入库状态（tracked 文件/目录前缀 · 原样读取 · 基线 23→34 · CI run 35245272523 hotfix）`
- `docs(3.0-W7-hotfix): ACCEPTANCE 冻结基线 23→34 标注（FS 存在性假绿口径补注）`
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界
- **禁 tag / push / publish / deprecate（仅人 · 无代跑授权）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w7_ci_hotfix.md`

---

### 自检结论（执行者）

**GATE_VERIFY 首输出**（FRAGMENT_30 纪律 · 真值 = task 人工闸表）：`node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w7_ci_hotfix.md` → **HG-TASK-DRAFT / HG-AUDIT-R1 双闸 approved** · **VERIFY: PASS** · exit 0（HG-AUDIT-R1 非 pending ⇒ 30 可开工）。

**修复 commit**：`98bc9e0`（`98bc9e05af35cf97856cf5bad4ac6f44cbeff44f`）· `fix(3.0-W7): check-doc-links 判据改入库状态（tracked 文件∪目录前缀 + -z 原样读取 · 环境无关 · 基线重建 34 · 验收 #1/#2）`。

**验收逐项**：#1 ✓ 模拟 CI 修后绿（clone `98bc9e0` → `S2=34 / 冻结基线 34` exit 0；修前 clone `ef1c06f` → `S2(i)=34 ≠ 23` exit 2）· #2 ✓ 本地 exit 0 · `S2=34=冻结基线` · 本地与 clone 的 S2 (i) 集合 **diff 空 IDENTICAL** · 非 S2 (i)=0 (ii)=0（目录链 48 处 + 非 ASCII 1 处零回归）· #3 ✓ 环境无关 fixture 红→绿（pre-fix `S2=0` baseline 1 exit 2 红 → post-fix `S2=1` baseline 1 exit 0 / baseline 0 exit 2）· #4 ✓ `npm test` **860 tests / 164 suites / 859 pass / 0 fail / 1 skip**（= 基线 858 + 1 新 fixture）· #5 ✓ typecheck 0 错 · pins 17/17 · #6 ✓ `task lint` PASS。

**锁计数（纯加性零回退）**：

| 项 | 实测 |
|----|------|
| 基线（task 起草 @3d1b9d3） | 859 tests / 164 suites / 858 pass / 0 fail / 1 skip |
| 本棒终态 | **860 / 164 / 859 / 0 / 1**（+1 新 fixture） |
| typecheck / build / test:lib | 0 错 / 0 / 6/6 |
| pins / assets / terminology / claims | 17/17 / 113/113 / PASS / PASS |
| 本地 / clone checker | S2=34 PASS / S2=34 PASS（集合 IDENTICAL） |
| 依赖 | 零新增 |

**已知未测项/边界**：① CI 平台矩阵 22.x/24.x 两档（本修走 Node API + git · 无平台特化分支）；② git 不可用时可诊断性（`spawnSync('git',…)` 失败 → tracked 空 → 全 in-repo 链接判坏 · 方向 fail-closed · 报错未按因分档 · 硬约束 10 尚差一步）本棒只登记不裹挟（residual ②/§同类面快扫）；③ (i) 语义收严：未来引入「本地存在但未入库的非 `.workbuddy` 链接」会红（缓解：仓外维持 `existsSync` · tracked 目录前缀 · fixture 明示语义）。

**偏差登记**：① 开工 HEAD `ef1c06f`（= task 提交）≠ task 起草期 `3d1b9d3`（复跑重建核对 · 判据 23/34 逐字一致）；② 三组对照 A 的派生差异：由**修后**脚本派生「字面式」继承 `-z` ⇒ 非 S2(i)=47；按 task 口径由 `3d1b9d3` 原始脚本派生 ⇒ A=48（47 目录链 + 1 非 ASCII）/ B=1 / C=0，与 task/审查文吻合；③ `S2_PARAM_EXCLUDE` 仅排除 task 路径（advisory A2），本 invoke/审查文实测零增链 ⇒ 无需扩展排除或重建基线；④ 修复 commit 与本文档/invoke commit 分离（两笔 · A1 口径 clone 取修复 commit）。

**40 复核登记（PASS-with-issues · blocking 0 · advisory 5 · 40 留档 `44662d1`）**：① **A1 根因表述精度**：库内 `.workbuddy/` 实有 **9 个 tracked 文件**，被引用的 **11 处** `验收报告-SpecWave-*.md` 确**未入库**（少计 11 · 修法「入库判据」不受影响）；② **A3 留档精度**：30 invoke 记录 clone 时点 = 修复 commit `98bc9e0`，40 以**最终 `fdcc8b9`** clone 复跑仍 `S2=34` 且 local↔clone IDENTICAL（A2「以最终 commit 克隆实测为准」满足）；③ **A5 派生方法学**：A=47（修后脚本派生 · 继承 `-z`）/ 48（`3d1b9d3` 原始脚本派生）经 40 逐字复现，登记准确。**A4（CI 转绿待推）归 00** 推后核 CI · **A2（out-of-repo 分支隔离 fixture）登记 3.x/后续**。

### KPI（00）

**00 收官裁定**（rubric `KPI_RUBRIC_v1_2` · 40 复核 PASS-with-issues（blocking 0 · advisory 5）· close_kpi 存在性口径）：**Task_KPI%: 94**

- **修复三件套质量高**：判据改**入库状态**（tracked 文件 ∪ tracked 目录前缀 · 仓外 `existsSync`）+ tracked 集合 `-c core.quotepath=false ls-files -z` 原样读取；40 独立派生复现 **48/1/0**（A_pre/B_pre/C）· 干净 clone 修后 PASS `S2=34` / 修前真红 `34≠23` · local↔clone S2 (i) 集合逐条 IDENTICAL · 环境无关 fixture 红→绿（pre `S2=0` 假绿 → post `S2=1`）· 红测先行 3 pass/2 fail → 5 pass/0 fail —— 修严型硬约束 **6**（负向回归锁）与 **10**（环境依赖可诊断）双兑现。
- **质量门**：锁纯加性零回退（基线 859/164/858/0/1 → **860/164/859/0/1**）· typecheck 0 错 · build 0 · test:lib 6/6 · pins 17/17 · assets 113/113 · terminology/claims PASS · verify/task lint PASS · 零越权（`scripts`/`test` 外零改 · 禁 `add -A` 遵守 · 未 push/tag · 无 `.gitignore`/`git add -f` 掩盖）。
- **扣 6**：缺陷逃过 W7 三轮审 + 40 审 + CI 需 hotfix 返工，且首版冻结基线 23 系「文件系统存在性」假绿口径（环境依赖）为主扣分项；advisory 5（A1 根因表述精度 / A2 out-of-repo 隔离 fixture / A3 留档时点 / A4 CI 转绿待推 / A5 派生方法学）均非阻断且已登记。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 初稿 · 10-task（CI run 35245272523/35245273138 hotfix · bugfix 双轨跳 SPEC）：CI 真值 + 根因（:96 FS 存在性 · `.workbuddy` 实体少计 11）落背景节 · 三组对照实验定位法定修法（字面式 42/48 不可用 → tracked 目录前缀 + 原样读取 → 34/34/0 IDENTICAL）· 基线复跑（859/164/858/0/1 · typecheck 0 · pins 17/17 · tag v3.0.0@3d1b9d3）· 范围唯一（checker 判据 + tracked 读取 + 基线重建 + test 三改 + ACCEPTANCE 三处标注）· 非范围含 tag 决策/掩盖式修法 · 验收 6 条（含 #1 模拟 CI 真红转绿 · #3 环境无关 fixture 红→绿 · #2 双跑同值）· F-HOT2-00~08 · R0–R5 五槽 + residual 五条 · 同类面快扫（唯 :96 真红 + git 不可诊断候选）· 本棒不签任何闸 |
| 2026-09-17 | HG-TASK-DRAFT `pending` → **approved**（00 代签 · 授权真值：维护者本窗授权 · tag/push 代跑「授权」+ 过程文档闸代签模式 · task lint PASS）；HG-AUDIT-R1 维持 pending（30 仍拒开工）· 头部状态行同步（`draft` → `pending`） |
| 2026-09-17 | HG-AUDIT-R1 `pending` → **approved**（00 代签 · 依据 R1 审查文 PASS-with-issues · blocking 0 · advisory A1–A6）· 搭车修 A4（R5/控制行由「双 pending」同步双 approved）+ A5（F-HOT2-04 `tagged-based` → `tracked-based`）+ A6（验收 6 条 / F-HOT2-00–08 计数口径订正）+ A1/A2 带入 30 执行要求 · 头部状态行同步 |
| 2026-09-17 | 30 修复交付：checker (i) 判据入库状态（tracked 文件 ∪ tracked 目录前缀 · 仓外 `existsSync`）+ tracked 集合 `-z` 原样读取 · 基线 23→34 · `S2_PARAM_EXCLUDE` 改本 task 路径 · test 三改（正向 34 / 环境无关 fixture / (ii) `git init`+`git add`）· ACCEPTANCE 三处 23→34 + 口径补注 · 模拟 CI 修后 PASS + 本地/clone 双 34 IDENTICAL · 锁 860/164/859/0/1 · 修复 commit `98bc9e0` · 自检回填（验收 6/6 勾选 + 偏差 3 条） |
| 2026-09-17 | 40 复核 **PASS-with-issues**（blocking 0 · advisory 5 · 留档 `44662d1`）→ 00 收官裁定 **Task_KPI%: 94** · A1/A3/A5 登记入自检结论 · A4 归 00（推后核 CI）· A2 登记 3.x/后续 · ### KPI（00）节回填 · 状态 `pending` → `done` · task close 归档 `done/`（13 守卫全过 · invoke 五件套齐） |
