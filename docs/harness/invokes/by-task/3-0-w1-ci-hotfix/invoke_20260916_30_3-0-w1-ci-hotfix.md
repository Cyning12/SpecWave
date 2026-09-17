# Invoke：30（执行）· 3-0-w1-ci-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 30 |
| task_slug | `3-0-w1-ci-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w1_ci_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16（修复交付 · 2026-09-17 关账材料补落） |
| 交付 commit | `e7e868b`（fix · 2 文件）· 前置 docs commit `9809703`（task + R1 审查文 + invoke 00/10/20） |

## GATE_VERIFY（改码前 · FRAGMENT_30 纪律 · 真值 = task 人工闸表）

`node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w1_ci_hotfix.md` → 首输出闸扫描表：**HG-TASK-DRAFT / HG-AUDIT-R1 双闸 approved**（HG-NEXT-PLAN / HG-SPEC-SIGNOFF 上行 approved）· **VERIFY: PASS** · exit 0。断言面：`HG-AUDIT-R1` 非 pending ⇒ 30 可开工（task 人工闸表为唯一真值 · 非 invoke 字面 approved）。

## 修复实现摘要

- **`scripts/scan-human-gates-baseline.mts`**：`SCAN_DIRS`（`docs/tasks/active` + `docs/tasks/done`）**双目录 existsSync 守卫** —— 目录缺失按**零文件**处理（`continue` · 不崩 · 语义正确：无 active task 即零采集）；守卫风格照 `cli-status.ts:35` / `cli-sync.ts:20` 先例（existsSync→continue）。
- **skipped-missing 双通道诊断**（硬约束 10 可诊断 · F-HOT-03）：console 注记 `skipped-missing 目录（缺失按零文件处理）: <dirs>` + snapshot `meta.skipped_missing_dirs` **加性键**（**仅缺失时出现**；有目录时 meta 五键 `generated_at/generator/semantics/scan_dirs/criteria` 零差异 · A2 加性原则）。
- **`test/scan-human-gates-baseline.test.ts`**（新增 118 行）：缺失目录负向 fixture **3 例** —— ①**双缺**（exit 0 · 文件数 0 · 注记逐字 · meta 双目录）②**单缺**（仅 active 缺 · 注记/meta 只列 active · 双目录守卫各自独立）③**双在**（零注记 · meta 无 `skipped_missing_dirs` 键 · F-HOT-01 套件内半锁）。
- **唯一改点**：scanner 扫描循环 + 测试新增；扫描口径 / 判定逻辑 / 行 verdict 语义 / baseline fixture / `docs/tasks/active/.gitkeep` **零触碰**（F-HOT-02 禁项零命中）。

## 验收 #1–#6 证据摘要（40 补做复核已核 · 本棒据实落档）

| # | 证据 |
|---|------|
| #1 负向 fixture/单测 | 自造无 `docs/tasks/active/`（含双目录均缺）临时树跑扫描器 → **exit 0** · console 逐字 `skipped-missing 目录（缺失按零文件处理）: docs/tasks/active + docs/tasks/done` · `文件数: 0` · `meta.skipped_missing_dirs=["docs/tasks/active","docs/tasks/done"]` · `files_scanned=0` / `total_gate_rows=0`；同树跑**修复前** scanner（`git show e7e868b^:scripts/scan-human-gates-baseline.mts`）→ **exit 1** · `ENOENT ... scandir .../docs/tasks/active` at `:101:22`（与 CI run 35066550895 逐字同签名）。套件内 3/3 绿（双缺/单缺/双在）。 |
| #2 既有 A2 比对测试 | `test/w1-gate-generalization.test.ts` **15/15 全绿**（含 :179 存量快照回归锁 **232 行逐条不变** · F-HOT-01）。 |
| #3 平台锁 | 定向 `test/scan-human-gates-baseline.test.ts + test/w1-gate-generalization.test.ts` **18 tests / 5 suites / 18 pass / 0 fail / 0 skip**（W1 15 + hotfix 3）· `npm run typecheck` **0 错** · `node bin/specgate.js pins check` **17/17** · 全量平台锁（40 复核终态）**841 tests / 160 suites / 840 pass / 0 fail / 1 skip**（基线 667 纯加性零回退）。 |
| #4 模拟 CI 环境实证 | 临时拷贝：`git archive HEAD \| tar -x` + `git init && git add -A && git commit` + **显式 `rm -rf docs/tasks/active`** + `npm ci --ignore-scripts` **真装** → `node --test --test-concurrency=1 --experimental-strip-types test/w1-gate-generalization.test.ts` → **15 tests / 4 suites / 15 pass / 0 fail**。修复前真红已由 R0/修复前 scanner 崩溃钉死 ⇒ **红转绿成立**。 |
| #5 有目录零行为差 | 真仓（active/ + done/ 均在）分别以修复前后 scanner 同参跑 → **snapshot JSON 逐字节 IDENTICAL**；console 逐行 IDENTICAL（唯一差 = 各自 `--out` 路径回显 · 非行为面）；修复后 `meta` **5 键** · **无** `skipped_missing_dirs` 键（加性键只出现在缺失分支 · A2 加性原则兑现）。 |
| #6 结构闸 | `npx spec-wave task lint --file docs/tasks/active/task_3_0_w1_ci_hotfix.md` → **LINT: PASS**。 |

## CI 证据链（gh 机检 · headSha 核验）

- run **35066550895** · headSha `f9f9c02`（W1 close）→ **failure**（`test (22.x)` :179 ENOENT · 本 task 缺陷真值）。
- run **35081308164** · headSha `e7e868ba7ee0ce57caf5f807f4149e9af2654111`（本 fix）→ **success**（secrets-scan / test 22.x / test 24.x / audit 全绿）。

## commit / 锁终态

- `e7e868b`（fix · 2 文件 · 无裹挟）：`scripts/scan-human-gates-baseline.mts`(+14) + `test/scan-human-gates-baseline.test.ts`(+118 · 新增) · `git show --name-only` 与提交信息一致 · 无 `docs/tasks/active/.gitkeep`（F-HOT-02 禁项零命中）。
- 锁终态（40 复核实测）：`npm test` **841 tests / 160 suites / 840 pass / 0 fail / 1 skip** · `npm run typecheck` 0 错 · pins **17/17** · 定向 **18/18** · verify PASS · lint PASS。
- 提交纪律：逐文件显式 add · 禁 `git add -A` · **未 push / tag / publish / deprecate**（四动作仅人 · 无代跑授权）。

## 偏差登记（全留痕）

1. **开工 HEAD 与 task 起草基线差异**：task「开工基线」节记 HEAD `f9f9c02`（2026-09-16 10-task 起草时）；30 实际开工 HEAD = `9809703`（task + R1 审查文 + invoke 00/10/20 docs commit）。按 W1 同式纪律以复跑实测重建核对，未沿用旧数字强行比对，平台锁 / 定向分档复核一致。
2. **git 线非相邻**：修复 commit `e7e868b` 与 docs commit `9809703` 之间夹 `2daaacd docs(3.0-W2)`（15:41:13）—— 非缺陷，仅存证两笔 hotfix commit 在 git 线上非相邻。
3. **模拟 CI 首跑操作顺序教训**：`git archive HEAD` 取**已提交态**，修复未 commit 时首跑仍取旧 HEAD（真红）—— 教训：模拟 CI 须在修复 commit 之后跑（或显式对工作树验证），否则会把「未提交的修复」误判为未生效；本棒最终以 `e7e868b` commit 后 HEAD 复跑取绿。
4. **residual ① 掩盖效应对冲**：本 task 文件落入 active/ 后新鲜 checkout 的 active/ 非空会顺带掩盖 CI 红 —— 已由验收 #4 显式 `rm -rf docs/tasks/active` 负向锁对冲，未以「CI 已绿」替代守卫交付。

## 未做（禁区）

未动 `src/` / `test/fixtures/` / `assets/` / SPEC / PLAN / baseline fixture · 未签任何闸 · 未 push / tag / publish / deprecate（本棒写面 = scanner + 测试 + task 关账材料 · 探针临件随手清除）。

## 下一棒

40 补做复核（已落 `invoke_20260916_40_3-0-w1-ci-hotfix.md`）→ 本棒补关账材料（invoke_30 + 自检结论 + 验收勾选 + `### KPI（00）` + done Hub 索引行）→ `task close --yes` 归档 `done/` → 维护者放行合入（发布四动作仅人）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 30 执行留档补落：GATE_VERIFY（双闸 approved · VERIFY: PASS）+ 修复实现摘要（existsSync 双目录守卫 + skipped-missing 双通道 + 负向 fixture 3 例）+ 验收 #1–#6 证据（据 40 复核已核事实）+ commit `e7e868b` / 锁终态 + 偏差 4 条 |
