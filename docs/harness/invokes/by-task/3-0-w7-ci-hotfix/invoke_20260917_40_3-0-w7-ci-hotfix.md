# Invoke：40（review-of-work）· 3-0-w7-ci-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 40-review-of-work |
| task_slug | `3-0-w7-ci-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w7_ci_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |
| 复核对象 | `ef1c06f`（hotfix task + R1 审查文 + invoke 三件套）→ `98bc9e0`（checker 判据 + test 三改 + ACCEPTANCE 基线 34）→ `fdcc8b9`（30 invoke + task 自检回填 · HEAD） |
| 复核结论 | **PASS-with-issues**（blocking 0 · advisory 5）· 下一棒 00 放行 → 维护者 push（发布四动作仅人） |

## 复核范围与方式

独立复核 30 交付的发布阻断面修复（`scripts/check-doc-links.mjs` (i) 判据由文件系统存在性改**入库状态** · tracked 集合 `-z` 原样读取 · 冻结基线 23→34 · test 三改 · ACCEPTANCE 三处基线 · 模拟 CI 实证）。

**不接受「30 说绿」**：平台锁全部独立复跑；核心「干净 clone」按指令逐字执行 `rm -rf /tmp/ci-sim40 && git clone -q . /tmp/ci-sim40`；修前对照在同一 clone `git checkout ef1c06f` 复现真红；三件套以 `3d1b9d3` 原始脚本逐字派生 5 变体（A_pre / B_pre / A_post / D_post）复现 48/1/47/0 分档；环境无关 fixture 与 F-HOT2-02 仓外分支由 40 自造 temp root 重放；local↔clone 的 S2 (i) 集合由 `--json` 机械 diff。temp 件全落 `/private/tmp` 且已清（工作树净复核在案）。

## 独立实测证据（40 本棒自跑）

### 平台锁复跑

| 项 | 实测 | 预期 | 判 |
|----|------|------|----|
| `npm run typecheck` | 0 错（exit 0） | 0 错 | ✓ |
| `npm run build` | exit 0 | 0 错 | ✓ |
| `npm test` | **860 tests / 164 suites / 859 pass / 0 fail / 1 skip**（58.7s · exit 0） | 860/164/859 pass/0 fail/1 skip | ✓ 逐字 |
| `npm run test:lib` | **6/6 pass**（exit 0） | 6/6 | ✓ |
| `node bin/specgate.js pins check` | **17/17 PASS**（pin-10 = tag `v3.0.0`）· exit 0 | 17/17 | ✓ |
| `node bin/specgate.js assets verify` | **113/113 PASS** · exit 0 | 113/113 | ✓ |
| `node scripts/check-terminology.mjs` | **PASS**（canonical 5/5 · 判红面 门控 残留 0） | PASS | ✓ |
| `node scripts/check-claims.mjs` | **PASS**（7 文件 · forbidden 命中 0） | PASS | ✓ |
| `verify --target . --task <本 task>` | `HG-TASK-DRAFT approved` + `HG-AUDIT-R1 approved` · **VERIFY: PASS** | PASS | ✓ |
| `npx spec-wave task lint --file <本 task>` | **LINT: PASS** | PASS | ✓ |

### 干净 clone 复现（发布阻断核心 · 修复前/后）

```text
$ rm -rf /tmp/ci-sim40 && git clone -q . /tmp/ci-sim40 && cd /tmp/ci-sim40 && node scripts/check-doc-links.mjs
[POST-FIX · HEAD fdcc8b9]
DOC LINKS (i) 非S2 = 0 · S2 = 34 / 冻结基线 34 · (ii) 非S2 = 0
DOC LINKS: PASS · 非S2(i)=0 非S2(ii)=0 · S2 冻结基线 34 处（current task 参数化排除）   → exit 0（真绿）

[LOCAL · 仓根]
DOC LINKS (i) 非S2 = 0 · S2 = 34 / 冻结基线 34 · (ii) 非S2 = 0                                   → exit 0

[PRE-FIX · git checkout ef1c06f]
DOC LINKS (i) 非S2 = 0 · S2 = 34 / 冻结基线 23 · (ii) 非S2 = 0
DOC LINKS: FAIL · 非S2(i)=0 非S2(ii)=0 · S2(i)=34 ≠ 基线 23                                      → exit 2（真红）
（复核 ef1c06f 脚本确为修前：:22 S2_FROZEN_BASELINE = 23 · :96 existsSync）
```

**结论**：修复**确实消除**「本地假绿 / CI 真红」的环境依赖 —— 修后本地与干净 clone 同值同绿；修前 clone 逐字复现 CI run 35245272523 的 `S2(i)=34 ≠ 基线 23`。

### local ↔ clone S2 (i) 集合逐条 IDENTICAL

```text
local s2Count=34 clone s2Count=34
local nonS2i=0 nonS2ii=0 | clone nonS2i=0 nonS2ii=0
local s2.i len=34 clone s2.i len=34 · only-local=0 · only-clone=0
IDENTICAL=true
```

### 三件套独立验证（由 `3d1b9d3` 原始脚本逐字派生 · 本地仓根）

| 变体 | 判据 | 本地 S2 | 非 S2 (i) | 判 |
|------|------|---------|-----------|----|
| A_pre 字面最小式 | `inRepo ? gitTracked.has(rel) : existsSync(abs)`（无 tracked 目录前缀 · 默认 ls-files） | 42 | **48** | ✓ 与 task/F-HOT2-04 逐字吻合（47 目录链 + 1 非 ASCII） |
| B_pre A + 目录前缀 | `… OR trackedDirs.has(rel)`（仍默认 ls-files） | 34 | **1** | ✓ 唯一坏链 = 非 ASCII 指南（F-HOT2-05） |
| A_post 修后缺目录前缀 | 法定脚本去 `trackedDirs`（继承 `-z`） | 42 | **47** | ✓ 复现 30 偏差登记 ②（47 vs 48 派生差异） |
| **C 法定（= 入库状态 + 目录前缀 + `-z`）** | 现行脚本 | **34** | **0** | ✓ 双端 IDENTICAL · 环境无关 |

**仓外 `existsSync` 分支（F-HOT2-02）40 自造 temp root 重放**：仓外目标**存在** → 保留分支 exit 0；去分支变体 D_post → 非 S2(i)=1 exit 2；仓外目标**缺失** → exit 2。⇒ 三件套（仓外 existsSync / tracked 目录前缀 / `-z` 原样读取）**缺一即回归**，因果链独立成立。

### 环境无关 fixture（硬约束 6 · 40 自造 temp root）

```text
临时 root git init + .gitignore .workbuddy/ + 实体 .workbuddy/x.md + 引用它的 docs/tasks/s2.md
pre-fix  : S2(i)=0 · --s2-baseline 0 → exit 0（假绿 · 被 FS 存在性掩盖）
post-fix : S2(i)=1 · --s2-baseline 0 → exit 2（真红） · --s2-baseline 1 → exit 0（绿）
```

**红测先行独立复现**：
- HEAD 版 test 文件（5 测）+ 修前脚本 → **3 pass / 2 fail**（正向基线 34 + 新 fixture 红）—— 与 30 invoke 逐字吻合。
- HEAD 版 test 文件 + 修后脚本 → **5 pass / 0 fail**（40 定向抽跑）。
- 修前 clone 自带 test 文件（4 测）+ 修前脚本 → 3 pass / 1 fail（正向 S2=34≠23）。

### 基线一致性

| 项 | 实测 |
|----|------|
| `ACCEPTANCE_3_0_architecture_leap_3_0_0_zh.md` | :35 / :46 / :63 三处 = **34** · :36 口径补注（旧 23 系 FS 假绿 · 34 为入库状态重建值）在位 |
| 同档残留字面 23 | 仅 :36 / :46 / :63 三处**历史口径说明**（「旧 23 系…」）· 无裸基线 23 |
| `S2_PARAM_EXCLUDE` | `['docs/tasks/active/task_3_0_w7_ci_hotfix.md']`（仅 task 路径 · :28） |
| task 文件自身 broken (i) 条目 | **0**（即使排除失效亦不增计数） |
| local ↔ clone S2 (i) | **逐条 IDENTICAL**（34 = 34 · only-local=0 / only-clone=0） |

### commit 卫生与 CI 现状

| 项 | 实测 |
|----|------|
| 三笔 diff scope | `ef1c06f` = 5 docs（task/R1 审查文/00·10·20 invoke）· `98bc9e0` = ACCEPTANCE + `scripts/check-doc-links.mjs` + `test/check-doc-links.test.ts`（3 文件）· `fdcc8b9` = 30 invoke + task 自检回填（2 文件）· 无裹挟面 |
| 越界面 | `.gitignore` 零改动 · `src/` / `lib/` / `bin/` / CI workflow 零改动 · 无 `git add -f` 新入库的 `.workbuddy` 证据 |
| 工作树 | `git status --short` **空**（净） |
| tag | `git tag --points-at HEAD` **空** · `v3.0.0` 仍指 `3d1b9d3`（**未移动 · 未触碰**） |
| push | `origin/main..HEAD` = **3 笔未推**（`fdcc8b9` / `98bc9e0` / `ef1c06f`） |
| CI | `gh run list` 实测 run `35245272523`（workflow=ci · branch=`v3.0.0`）与 `35245273138`（ci · main）均 `failure` · headSha = `3d1b9d3`（= 修复未推 · 预期红） |

## 发现清单

- **blocking：0** —— 平台锁独立复跑全绿且逐字；干净 clone 修复后真绿 34 / 修复前真红 34≠23；三件套 48/1/0 与 F-HOT2-02 独立复现；环境无关 fixture 红→绿；基线三处 34 + 补注在位；local↔clone 集合 IDENTICAL；工作树净 · 未 tag / 未 push。
- **advisory：5**（非阻断）
  - **A1（40 新增 · 根因表述精度）**：task 背景/根因节称本机 `.workbuddy/`「`.gitignore` 忽略但实体在」「git 不跟踪」；40 实测 `.workbuddy/` **有 9 个 tracked 文件**（含非 ASCII：安全设计.md / 系统设计.md / 部署说明.md / 部署架构图.svg / 高层架构设计.md + UserStory.md / material_digest.md / research_report.md / phase0_charter.md）。**被引用的 11 处目标 `验收报告-SpecWave-*.md` 确未入库** ⇒ 根因（少计 11）与修法（入库判据）**不受影响**；仅建议表述精确化。非阻断。
  - **A2（40 新增 · out-of-repo 分支当前仓未被内容触发）**：以修后脚本派生 D（去 `inRepo` 仓外 `existsSync` 分支）在**当前仓**非 S2(i) 仍 =0（仓内无仓外相对链）⇒ F-HOT2-02 的断链回归锁不被真实仓内容覆盖；40 自造 fixture 证明该分支必需。建议后续可选补 1 条隔离 fixture（与 20 audit A3 同族）。非阻断。
  - **A3（40 新增 · 留档精度）**：30 invoke 记录 clone HEAD = `98bc9e0`（修复 commit），最终 HEAD 为 `fdcc8b9`；40 独立以 `fdcc8b9` clone 复跑仍 PASS `S2=34` 且 local↔clone IDENTICAL ⇒ A2「以最终 commit 克隆实测为准」**满足**；仅留档提示。非阻断。
  - **A4（40 新增 · CI 转绿待推）**：修复三笔**未 push**，CI 仍红于 `3d1b9d3`（run 35245272523 / 35245273138 均 failure）。推后须复核 ci `test (22.x)/(24.x)` 与 tech-graph 转绿（本地 860/859/0/1 + clone checker 34 PASS 已独立绿 ⇒ 预期转绿）。流程面提醒。非阻断。
  - **A5（40 新增 · 派生方法学）**：30 偏差登记 ②（修后脚本派生「字面式」继承 `-z` ⇒ 47；`3d1b9d3` 原始脚本派生 ⇒ 48）**经 40 逐字复现**（A_post=47 / A_pre=48），登记准确；建议后续复现 A/B/C 三档统一以原始脚本派生以免口径漂移。非阻断。

## 结论

**PASS-with-issues**（blocking 0 · advisory 5）。

- **独立复跑计数**：`npm test` **860 / 164 / 859 pass / 0 fail / 1 skip** · typecheck 0 · build 0 · test:lib 6/6 · pins 17/17 · assets 113/113 · terminology/claims PASS · `verify --task` PASS · task lint PASS。
- **干净 clone 复跑（核心）**：修后 `fdcc8b9` → **PASS · S2=34=冻结基线 · exit 0**；修前 `ef1c06f` → **真红 S2(i)=34 ≠ 23 · exit 2**（与 CI 逐字）· 本地与 clone 同值 34 · S2 (i) 集合 IDENTICAL。
- **三件套**：A_pre=48 / B_pre=1 / A_post=47 / C=0；仓外 `existsSync` 分支由自造 fixture 证明必需；环境无关 fixture pre 假绿 S2=0 → post 真红 S2=1；红测先行 3 pass/2 fail → 5 pass/0 fail。
- **基线一致性**：ACCEPTANCE 三处 23→34 + 口径补注在位 · `S2_PARAM_EXCLUDE` 仅 task 路径 · clone/local S2 集合逐条 IDENTICAL。
- **卫生**：三笔 scope 干净 · 工作树净 · **未 push / 未 tag（`v3.0.0` 仍指 `3d1b9d3`）** · CI 仍未推故红（预期）。

## 未做（禁区）

未改 `scripts/` / `test/` / `src/` / SPEC / PLAN / task 实质内容 · 未代签任何闸 · **未 tag / push / publish / deprecate** · 未删 `.workbuddy` 实体 / 未改 `.gitignore`。本棒唯一写面 = 本 invoke（S2 只新增 · 单文件显式 add · 不 push）。

## 下一棒

00 放行 → 维护者 push 三笔（`ef1c06f` → `98bc9e0` → `fdcc8b9`）→ 复核 CI workflow `ci` `test (22.x)/(24.x)` 与 `tech-graph` 转绿 → 30 `task close` 归档。**发布四动作仍仅人**（`git tag` 已存在 `v3.0.0`@`3d1b9d3` · 本 hotfix 不移动 tag）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 40 review-of-work 复核完成：独立复跑平台锁全绿（860/164/859/0/1 · typecheck 0 · test:lib 6/6 · pins 17/17 · assets 113/113 · terminology/claims PASS · verify/task lint PASS）· 干净 clone 修后 PASS 34 / 修前真红 34≠23 · local↔clone S2 集合 IDENTICAL · 三件套 48/1/47/0 + F-HOT2-02 fixture 独立复现 · 环境无关 fixture 红→绿与红测先行 3/2 复现 · 基线三处 34 + 补注在位 · 工作树净 · 未 push/未 tag（`v3.0.0` 未触碰）· 总结论 PASS-with-issues（blocking 0 · advisory 5） |
