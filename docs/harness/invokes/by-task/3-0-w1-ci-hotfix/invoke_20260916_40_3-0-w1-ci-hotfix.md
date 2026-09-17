# Invoke：40（review-of-work）· 3-0-w1-ci-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 40-review-of-work |
| task_slug | `3-0-w1-ci-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w1_ci_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16（补做复核落笔 2026-09-17 · W6 收官后） |
| 复核对象 | `9809703`（task + R1 审查文 + invoke 三件套 · docs）· `e7e868b`（fix · 2 文件）—— git 线 `9809703 → 2daaacd（W2 docs 夹层）→ e7e868b`（两笔均已在 origin/main） |

## 复核范围与方式

补做 3.0 W1 CI hotfix 的 40 复核（原波漏做 40 与关账）。独立复核 `e7e868b` 交付（`scripts/scan-human-gates-baseline.mts` 对缺失 tasks 目录的 existsSync 双目录守卫 + skipped-missing 双通道诊断 · `test/scan-human-gates-baseline.test.ts` 负向锁）。**不接受「30 说绿」**：平台锁全部 40 本棒独立复跑 · 验收 #1/#4 本棒自造临时树重放（不复用 30 fixture）· A2 零行为差以「修复前 scanner（`e7e868b^` 版本）vs 修复后 scanner 同树对跑」byte 级比对 · CI 结论以 `gh run view --json headSha` 机检 · 关账就绪以 `task close` dry-run 实测。探针临件全落 /tmp 且随手清除（工作树净复核在案）。

## 独立实测证据（40 本棒自跑）

### 平台锁复跑

| 项 | 实测 | 预期 | 判 |
|----|------|------|----|
| `npm run typecheck` | 0 错（exit 0） | 0 错 | ✓ |
| `npm test` | **841 tests / 160 suites / 840 pass / 0 fail / 1 skip**（≈109.7s） | W6 后终态 | ✓ 逐字 |
| `node bin/specgate.js pins check` | **17/17 PASS** | 17/17 | ✓ |
| 定向 `node --test test/scan-human-gates-baseline.test.ts test/w1-gate-generalization.test.ts` | **18 tests / 5 suites / 18 pass / 0 fail / 0 skip**（W1 15 + hotfix 3） | 全绿 | ✓ |
| `verify --target . --task <本 task>` | **VERIFY: PASS**（exit 0 · 双闸 approved） | PASS | ✓ |
| `task lint --file <本 task>` | **LINT: PASS** | PASS | ✓ |
| `task close --file <本 task>`（dry-run） | **CLOSE: BLOCKED · exit 2**（5 守卫 fail · 见 B1） | READY | ✗ 关账未就绪 |

### 验收抽核（40 独立构造重放）

- **#1 负向 fixture（本棒自造最小临时树 · 非复用 30 fixture）**：`scripts/` + `src/` 最小树 + 无 `docs/tasks/` → 修复后 scanner **exit 0** · console 逐字 `skipped-missing 目录（缺失按零文件处理）: docs/tasks/active + docs/tasks/done` · `文件数: 0` · snapshot `meta` 6 键（原 5 键 + `skipped_missing_dirs:["docs/tasks/active","docs/tasks/done"]`）· `files_scanned=0` / `total_gate_rows=0`。**同树跑修复前 scanner（`git show e7e868b^:scripts/scan-human-gates-baseline.mts`）→ exit 1 · `ENOENT ... scandir '.../docs/tasks/active'` at `:101:22`** —— 与 CI run 35066550895 逐字同签名，红/绿对照本棒亲证。
- **#4 模拟 CI（忠实复跑 · `npm ci` 真装）**：`git archive HEAD | tar -x` → `git init && git add -A && git commit` → `rm -rf docs/tasks/active` → `npm ci --ignore-scripts` **OK** → `node --test --test-concurrency=1 --experimental-strip-types test/w1-gate-generalization.test.ts` → **15 tests / 4 suites / 15 pass / 0 fail**。修复前真红由 R1 审查文场景 A（14 过 1 红）钉死 + 本棒修复前 scanner 崩溃复现佐证 ⇒ 红转绿成立。
- **A2 有目录零行为差（本棒 byte 级对跑）**：真仓（active/ + done/ 均在）分别以修复前后 scanner 同参跑 → **snapshot JSON 逐字节 IDENTICAL**；console 逐行 IDENTICAL（唯一差 = 各自 `--out` 路径回显 · 非行为面）；修复后 `meta` **5 键**（`generated_at/generator/semantics/scan_dirs/criteria`）· **无 `skipped_missing_dirs` 键**。加性键只出现在缺失分支，既有 meta 五键语义零改动（R1 advisory A2 加性原则兑现）。
- **双在态断言**：`test/scan-human-gates-baseline.test.ts` 三例（双缺 / 仅 active 缺 / 双在）本棒定向复跑 3/3 绿；双在态断言 `!('skipped_missing_dirs' in meta)` 与 console 无 `skipped-missing` —— 套件内零行为差半锁到位。

### CI 证据链（`gh` 机检 · headSha 核验）

- run **35066550895** · headSha `f9f9c02`（W1 close）→ **failure**（`test (22.x)` 红 · 与本 task 缺陷真值一致）。
- run **35081308164** · headSha `e7e868ba7ee0ce57caf5f807f4149e9af2654111`（本 fix）→ **success**（secrets-scan / test 22.x / test 24.x / audit 全绿）。
- 其后已 push 的 ci 全绿无复红：`c7c663b`(35081701823) · `2b6e7c3c`(35171999796) · `fb280df1`(35175781734) · `9c895db`(35186028123) · `3664e6f`(35204135841) · `b461b34`(35217454138)。W6 波 commit 未 push（`origin/main` = `b461b34` · `HEAD` ahead 7）。

### commit 卫生

- `9809703`（docs · 5 文件）：task + R1 审查文 + invoke 00/10/20 三件 · 无裹挟。
- `e7e868b`（fix · 2 文件）：`scripts/scan-human-gates-baseline.mts`(+14) + `test/scan-human-gates-baseline.test.ts`(+118 · 新增) · 无 `docs/tasks/active/.gitkeep`（F-HOT-02 禁项零命中）· `git show --name-only` 与提交信息一致。
- 拓扑注记：两笔 hotfix commit 之间夹 `2daaacd docs(3.0-W2)`（15:41:13）—— 非缺陷，仅存证「共两笔」在 git 线上非相邻。
- 工作树净（`git status --porcelain` 仅 W7 起草 untracked `task_3_0_w7_closeout_external.md`）· `git tag --points-at HEAD` 空（无新 tag）· 发布四动作零触碰。

## 发现清单

- **blocking：1**
  - **B1 · 30 执行留档缺位 → 关账机械 BLOCKED**（`task close` dry-run exit 2 实测）：`required_invoke_hats=10,20,30,00` 但热修无 30 invoke（目录仅 00/10/20 + 本 40）→ `close_invoke: missing invoke hats: 30`；同因 30 未回填 → `close_acceptance: 验收标准 6 项未勾选`（task :106-111 全 `[ ]`）· `close_status: active` · `close_kpi: 缺 ### KPI 节` · `close_hub_index: Hub 缺索引行`。⇒「30 close --yes」直跑必 BLOCKED；须先补 30 执行留档（invoke_30 + 自检结论回填 + 验收勾选 + KPI 节 + Hub 索引行），或显式 `--allow-invoke-gap` / `--allow-unchecked`（不建议 · 本波证据充分可留）。
- **advisory：1**
  - **A1 · `close_self_check` 占位判定被 `---` 绕过（pre-existing · 非本修复引入）**：task `### 自检结论` 节仍为 `（待 30 执行棒回填）`，但直调 `evalCloseSelfCheck` 返回 `{"status":"pass","detail":"自检结论已回填"}` —— `PLACEHOLDER_RE=/^（[^）]*(回填|待填)[^）]*）$/` 只滤占位行，节域内尾部 `---` 分隔线被计入 substantive ⇒ 占位节误判 pass。本棒未改码（禁区）；建议 00/后续波次裁定。

## 结论

**PASS-with-issues**（交付/代码面 PASS · 关账面 BLOCKED · blocking 1 · advisory 1）—— `e7e868b` 修复经 40 独立复跑属实：平台锁全绿且计数逐字（typecheck 0 · npm test 841/160/840/0/1 · pins 17/17 · 定向 18/18 · verify PASS · lint PASS）；验收 #1 自造临时树负向 fixture exit 0 + skipped 注记逐字 + meta 加性键（修复前同树 ENOENT :101:22 崩溃对照）；验收 #4 忠实模拟 CI（`npm ci` 真装）15/15 绿；A2 修复前后 snapshot 逐字节 IDENTICAL（有目录零行为差 · meta 五键语义零改）；CI 证据链 35066550895(fail f9f9c02) → 35081308164(success e7e868b) 且其后已 push ci 全绿；commit 卫生良好、无 .gitkeep、未 push/tag。唯一 blocking = 30 执行留档缺位致关账未就绪（非代码问题）。

## 未做（禁区）

未改 src / scripts / test / SPEC / PLAN / baseline fixture / task 文（问题回本 00）· 未签任何闸 · 未 push / tag / publish / deprecate（本棒唯一写面 = 本 invoke 新增 · 探针临件全清于 /tmp）。

## 下一棒

**先 30 补执行留档，再 `30 task close --yes`**：补 `invoke_<date>_30_3-0-w1-ci-hotfix.md` + task「自检结论」回填 + 验收 #1–#6 勾选 + `### KPI` 节 + done Hub 索引行 → `task close --yes` 归档 done/。若确要走豁免，`--allow-invoke-gap --allow-unchecked` 须逐项留痕（不推荐 · 本波证据充分可留档）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 40 补做复核落盘：平台锁 + 验收 #1/#4 + A2 + CI + commit 卫生独立实测 · 发现 B1（30 留档缺位致 close BLOCKED）/ A1（`close_self_check` 占位绕过 · pre-existing）· 交付面 PASS、关账面 BLOCKED |
