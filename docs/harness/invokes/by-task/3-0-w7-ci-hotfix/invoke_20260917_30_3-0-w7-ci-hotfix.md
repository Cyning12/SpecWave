# Invoke：30（execute · CI hotfix）· 3-0-w7-ci-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 30 |
| task_slug | `3-0-w7-ci-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w7_ci_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |
| 修复 commit | `98bc9e0`（`98bc9e05af35cf97856cf5bad4ac6f44cbeff44f`） |
| GATE_VERIFY | `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w7_ci_hotfix.md` → 双闸 approved · VERIFY: PASS · exit 0 |

## 指令摘要

30 实现棒：GATE_VERIFY（双闸 approved · VERIFY: PASS）→ 按 task 范围 1–3 + 验收 #1–#6 执行：① `scripts/check-doc-links.mjs` (i) 存在性判据由**文件系统存在性**改为**入库状态**（tracked 文件 ∪ tracked 目录前缀 · 仓外维持 `existsSync`）· tracked 集合 `-z` 原样读取 · 冻结基线 23→34 · `S2_PARAM_EXCLUDE` 改本 task 路径；② test 三改（正向 34 · 新增环境无关 fixture · (ii) 复绿分支 `git init`+`git add`）；③ ACCEPTANCE 三处 23→34 标注；④ 模拟 CI 实证。**禁** `add -A` / 掩蔽式假绿 / tag / push / publish。A1：修复 commit 后 clone 复跑 #1/#2；A2：基线以最终 commit 克隆实测为准。

## 执行证据（本棒实测）

### GATE_VERIFY 首输出（FRAGMENT_30 纪律 · 真值 = task 人工闸表）

```text
task: task_3_0_w7_ci_hotfix.md
| gate | status | blocks_30 | 30 影响 |
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_w7_ci_hotfix.md
[exit 0]
```

### 三件套实现摘要

1. **(i) 判据入库化**：`const exists = inRepo ? gitTracked.has(targetRel) || trackedDirs.has(targetRel) : existsSync(targetAbs)`。`trackedDirs` = `deriveTrackedDirs(gitTracked)` 推导的全部祖先目录（git 只跟踪文件 · 目录链须祖先前缀命中 · F-HOT2-02/04）。
2. **tracked 集合原样读取**：`spawnSync('git', ['-c','core.quotepath=false','ls-files','-z'], …)` + `split('\0')`（防非 ASCII 路径八进制转义 · F-HOT2-05）。
3. **基线重建 + 头注释口径**：`S2_FROZEN_BASELINE = 23 → 34`；头注释改「入库状态而非文件系统状态」并登记环境依赖根因/重建理由；`S2_PARAM_EXCLUDE = ['docs/tasks/active/task_3_0_w7_ci_hotfix.md']`（防自咬 · F-HOT2-07）。

### 修前对照（@ `ef1c06f` · 本棒复跑）

```text
本地  : DOC LINKS (i) 非S2 = 0 · S2 = 23 / 冻结基线 23 · (ii) 非S2 = 0  → exit 0（假绿）
clone : DOC LINKS (i) 非S2 = 0 · S2 = 34 / 冻结基线 23 · (ii) 非S2 = 0  → exit 2（真红）
        DOC LINKS: FAIL · 非S2(i)=0 非S2(ii)=0 · S2(i)=34 ≠ 基线 23
S2 集合 diff：clone−local = 11（local−clone = 0）· 全为 .workbuddy/output/验收报告-SpecWave-2.2.0/2.3.0/2.4.0/2.4.1.md
```

### 三组对照复跑（由 `3d1b9d3` 原始脚本逐字派生 · 本地根）

```text
A 字面最小式（inRepo ? gitTracked.has(rel) : existsSync(abs)）→ 非S2(i)=48 · S2=42
B A + 目录前缀（trackedDirs.has(rel)）                        → 非S2(i)=1  · S2=34（唯一坏链 = 非 ASCII 指南）
C 法定（+ -c core.quotepath=false ls-files -z 原样读取）      → 非S2(i)=0  · S2=34
```

### 环境无关 fixture 红→绿（范围 2② · F-HOT2-05/08）

```text
临时 root git init + .gitignore .workbuddy/ + 实体 .workbuddy/x.md + 引用它的 S2 md：
pre-fix  : S2(i)=0 → --s2-baseline 1 exit 2（红 · 被 FS 存在性掩盖）
post-fix : S2(i)=1 → --s2-baseline 1 exit 0 · --s2-baseline 0 exit 2（绿）
```

定向红→绿（`node --test test/check-doc-links.test.ts`）：修前 **3 pass / 2 fail**（正向 34 + 新 fixture 红）→ 修后 **5 pass / 0 fail**。

### 模拟 CI 实证（A1 · 修复 commit `98bc9e0` 后 · A2）

```text
$ rm -rf /tmp/ci-sim && git clone -q . /tmp/ci-sim && cd /tmp/ci-sim && node scripts/check-doc-links.mjs
DOC LINKS (i) 非S2 = 0 · S2 = 34 / 冻结基线 34 · (ii) 非S2 = 0
DOC LINKS: PASS · 非S2(i)=0 非S2(ii)=0 · S2 冻结基线 34 处（current task 参数化排除）
[exit 0]
clone HEAD = 98bc9e05af35cf97856cf5bad4ac6f44cbeff44f

本地 : DOC LINKS (i) 非S2 = 0 · S2 = 34 / 冻结基线 34 · (ii) 非S2 = 0  → exit 0
S2 (i) 集合：local vs clone diff 为空 → IDENTICAL（均 34 · nonS2i=0 · nonS2ii=0）
```

### 锁计数（纯加性零回退）

| 项 | 基线（task 起草 @3d1b9d3） | 本棒终态 |
|----|--------------------------|----------|
| npm test | 859 / 164 / 858 / 0 / 1 | **860 / 164 / 859 / 0 / 1**（+1 新 fixture） |
| typecheck | 0 错 | 0 错 |
| build | 0 | 0 |
| test:lib | 6/6 | 6/6 |
| pins | 17/17 | 17/17 |
| assets verify | 113/113 | 113/113 |
| terminology / claims | PASS | PASS |
| 本地 checker | S2=23 假绿 | S2=34 PASS |
| clone checker | S2=34 真红 | S2=34 PASS |
| 依赖 | js-yaml 唯一 | 零新增 |

### 验收逐项

- #1 ✓ 模拟 CI 修后绿（clone `98bc9e0` → exit 0 · S2 冻结基线 34）；修前对照 clone `ef1c06f` → exit 2 · S2(i)=34 ≠ 基线 23。
- #2 ✓ 本地 checker PASS 且与 clone 同值 34 · S2 (i) 集合逐条 IDENTICAL · 非 S2 (i)=(ii)=0（目录链 48 处 + 非 ASCII 1 处零回归 · 三组对照 48/1/0）。
- #3 ✓ 环境无关 fixture 红→绿（pre S2=0 掩盖 / post S2=1 · baseline 1 exit 0 · baseline 0 exit 2）。
- #4 ✓ 全量 npm test 860/164/859/0/1（= 基线 858 + 1 新 fixture）；既有 4 fixture 全绿（含 (ii) 复绿分支 `git init`+`git add`）。
- #5 ✓ typecheck 0 错 · pins 17/17 PASS。
- #6 ✓ `npx spec-wave task lint --file …` PASS。

### 文档/防自咬登记

- `docs/roadmap/ACCEPTANCE_3_0_architecture_leap_3_0_0_zh.md` 三处 23→34（:35 / :45 / :62）+ :35 口径补注（旧 23 系 FS 假绿口径 · 34 为入库状态重建值）。
- `docs/harness/reviews/w7_release_probe_3_0_0_20260917.md` grep `23` = 零引用 ⇒ 零改动。
- S2 只新增：本 invoke + task 自检回填（task 经 `S2_PARAM_EXCLUDE` 排除）；历史留档 23（done task / W7 invoke）零触碰。

### 偏差登记

1. **三组对照 A 的复算差异（方法学）**：直接由**修后**脚本派生「字面式」变体会继承 `-z` 原样读取 → 非 S2(i)=47（非 48）；按 task 口径由 `3d1b9d3` **原始**脚本派生则 A=48（47 目录链 + 1 非 ASCII）· B=1 · C=0，与 task/审查文逐字吻合。本棒以原始脚本复现，登记该派生差异。
2. 开工 HEAD `ef1c06f`（= task 提交，含 task/R1 审查文/invoke 三件套），非 task 起草期 `3d1b9d3`；判据环境依赖与基线差（23/34）逐字复现一致。
3. `S2_PARAM_EXCLUDE` 仅排除 task 路径（advisory A2）；本 invoke/审查文为 S2 且已入库，实测零增链（本地/clone 均 34 IDENTICAL）⇒ 无需扩展排除清单或重建基线。

## 授权边界

- ⛔ 未 `git add -A`（逐文件显式 add）· 未 tag / push / publish / deprecate
- ⛔ 未删本地 `.workbuddy` 实体 / 未 `git add -f` / 未改 `.gitignore`（F-HOT2-08）
- ⛔ 未改 `src/` 产品面 / `lib/` / `bin/` / CI workflow / 其他 check 脚本
- ⛔ S2 既有文只新增不覆写（除 task 指定自检回填面）

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 30 修复交付：判据入库状态（tracked 文件∪目录前缀 + `-z` 原样读取）· 基线 23→34 · test 三改 · ACCEPTANCE 三处 · 模拟 CI + 双端 34 IDENTICAL · 锁全绿（860/164/859/0/1 · typecheck 0 · pins 17/17 · assets 113/113）· 修复 commit `98bc9e0` |
