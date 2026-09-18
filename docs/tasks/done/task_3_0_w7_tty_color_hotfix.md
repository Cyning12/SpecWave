# Task：3.0 W7 hotfix · 测试子进程继承 FORCE_COLOR 致 TTY 发布链假红（spawn env 钉死 + 回归锁）（CI hotfix · bugfix · mini）

> **状态**：`done`（2026-09-18 10-task 起草 · **HG-TASK-DRAFT = approved**（2026-09-17 00 代签 · task lint PASS）· **HG-AUDIT-R1 = approved**（2026-09-18 00 代签 · 依据 R1 BLOCKED→B1 回填 + R2 PASS · blocking 0 · advisory R2-A1 带入 30）⇒ **双闸 approved · 30 可开工**；本棒不实现 test/src · 不 tag/push/publish · 2026-09-18 30 修复交付（`0e1f165` + `62b0811` · 验收 6/6 · 锁 864/165/863/0/1 · clone/pty 双态 0 fail）+ 40 复核 **PASS**（blocking 0 · advisory 4 · 40 留档 `b0a2fb1`）+ 00 裁定 **Task_KPI%: 95** · task close 归档 `done/`）
> **缺陷真值（已查实 · 本棒 pty/隔离双实测）**：维护者本机 **TTY** 终端跑 `prepublishOnly` 链（`typecheck && npm test && …`）稳定红于 `test/scan-human-gates-baseline.test.ts:64`（`stdout.includes('文件数: 0')` 假）；本机 **非 TTY**（agent shell · `TERM=dumb`）与 **CI（非 TTY）** 全绿。**发布阻断**。
> **SPEC**：bugfix · **双轨可跳独立 SPEC**（HG-SPEC-SIGNOFF 上行 approved 继承 · 范围/验收/failure_paths 由本 task 承载）
> **根因（本棒复现确证 · 双机制 · 详见「根因与修法」节）**：**A** `FORCE_COLOR=1` 下 Node `console.log('文件数:', <number>)` 对**数字实参**走 `util.inspect` 着色 ⇒ stdout = `文件数: \u001b[33m0\u001b[39m` ⇒ `includes` 假（pty 下 `node --test` 向测试子进程注入 `FORCE_COLOR=1` 已被本棒探针实证）；**B** `FORCE_COLOR=1` 与 `NO_COLOR=1` 并存时子进程 Node 向 **stderr** 打警告，被 `runCli` 的 `stdout+'\n'+stderr` 拼接 ⇒ `JSON.parse` 抛错。
> **基线（2026-09-18 本棒隔离复跑实测 · 详见「开工基线」节）**：HEAD `fad0637` · 普通 `npm test` **860 tests / 164 suites / 859 pass / 0 fail / 1 skip** · `FORCE_COLOR=1 npm test` **860 / 857 pass / 2 fail / 1 skip** · `node --test` pty（`TERM=xterm-256color` · 无 `NO_COLOR`）**1 fail** = scan 测 · typecheck 0 错 · pins **17/17** · tag `v3.0.0` 在
> **行号口径**：本 task 全部行号为 2026-09-18 本棒实读现值（HEAD `fad0637`）
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-w7-tty-color-hotfix` |
| **test_strategy** | `required` |
| **test_strategy_note** | 验收主体 = **环境确定性锁三连**：① 新增回归锁测：以**显式 `FORCE_COLOR=1`** spawn 扫描器证明「着色确实发生」且 `stripAnsi(out)` 可还原目标串（红-现象锁），并以 `plainEnv()` spawn 断言输出**零 ANSI** 且含 `文件数: 0`（绿-修复锁）；② **定向两测在 `FORCE_COLOR=0/1` 双环境均绿**（scan :52 与 cli-discipline :81）；③ **全量双环境**：`npm test` 与 `FORCE_COLOR=1 npm test` 均 0 fail。红测先行：新锁测在未建 helper 前**红**（import 失败 / 断言 ANSI 缺失），建后绿。 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,00`（mini hotfix · 40 复核由 00 视情加挂） |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 改的是 `test/` 侧 spawn env 钉死；`docs/_tech_graph/` 图谱/本体/HGM 资产零触碰 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 无规范增量（`docs/coding_wiki/` 本仓不存在 · W7 前例实证）；「测试 spawn env 须脱离 ambient FORCE_COLOR」是否升为通用守卫面登记为 3.x/W5 候选 · 晋升归 20/00 裁定 |
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
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗授权（tag/push 代跑 + 过程文档闸代签模式）· task lint PASS |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-18 00 代签** · 授权真值：维护者本窗授权 · 依据 R1（BLOCKED→B1 回填）+ R2（PASS · blocking 0 · advisory R2-A1）审查文 · R2-A1 带入 30（plainEnv 字段进程内断言 + spawn 探针等价满足） |

---

## 背景与目标

**现象**：维护者本机 TTY 终端跑发布链 `npm run prepublishOnly`（`typecheck && npm test && build && test:lib && pins check && assets verify && check-pack-hygiene`）**稳定红**于 `test/scan-human-gates-baseline.test.ts:64`（`assert.ok(r.stdout.includes('文件数: 0'))` 为假）；本机非 TTY（agent shell）与 CI（非 TTY）**全绿** ⇒ 发布临门不可判。

**根因 A（数字实参着色 · 本棒 pty 复现确证）**：
1. `scripts/scan-human-gates-baseline.mts:195` `console.log('文件数:', files.length, '· 含闸节文件:', filesWithSection)` —— **数字实参**经 Node `console.log` 走 `util.inspect`；`FORCE_COLOR=1` 下 stdout 为 `文件数: \u001b[33m0\u001b[39m` ⇒ `includes('文件数: 0')` 为假。
2. `FORCE_COLOR` 来源：Node test runner 在**色彩可用 TTY**（`process.stdout.isTTY` 且 `TERM≠dumb`）下向**每个测试文件子进程**注入 `FORCE_COLOR=1`；测试文件再 spawn 扫描器时继承 ⇒ 红。**本棒探针实证**：pty + `TERM=xterm-256color` ⇒ 测试子进程 `PROBE_FORCE_COLOR="1"`；pty 但 `TERM=dumb` 或管道 ⇒ `undefined`（agent shell 的 `TERM=dumb` 即「非 TTY 全绿」成因）。
3. 复现命令（两条任一）：`FORCE_COLOR=1 node --test --experimental-strip-types test/scan-human-gates-baseline.test.ts` → 红；`env -u NO_COLOR TERM=xterm-256color script -q /dev/null node --test --experimental-strip-types test/scan-human-gates-baseline.test.ts` → 红（本棒实测 3 测中 1 红）。

**根因 B（stderr 警告污染 · 与 A 同族 · `FORCE_COLOR=1` 且 `NO_COLOR=1` 并存）**：
1. `test/cli-discipline-coverage.test.ts` 的 `runCli`（:47）返回 `\`${r.stdout ?? ''}\n${r.stderr ?? ''}\``（stdout **拼接** stderr）。
2. 同时存在 `NO_COLOR=1`（agent shell 常态）与注入的 `FORCE_COLOR=1` 时，子进程 Node 向 **stderr** 打警告 `Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.` ⇒ 追加于 JSON 之后 ⇒ `JSON.parse(r.out)`（:85）抛 `Unexpected non-whitespace character after JSON`。
3. 本棒复现：单独 `JSON.parse(stdout)` **OK**；`JSON.parse(stdout+'\n'+stderr)` **失败**于 `position = stdout_len + 1`（警告体）。**注**：纯 TTY（无 `NO_COLOR`）不触发 B ⇒ 维护者 TTY 发布链只红 A（scan 1 测）；agent shell 实测 `FORCE_COLOR=1 npm test` 红 **2 测**（A + B）。

**影响面（本棒隔离实测 · 三态）**：
- 纯 TTY（pty + `TERM=xterm-256color` · `NO_COLOR` 未设）⇒ **1 测红** = `test/scan-human-gates-baseline.test.ts:52`（:64 断言）。
- `FORCE_COLOR=1 npm test`（agent shell 亦带 `NO_COLOR=1`）⇒ **2 测红** = 上述 `:52` + `test/cli-discipline-coverage.test.ts:81`（:85 `JSON.parse`）；**860 tests / 857 pass / 2 fail / 1 skip**。**注**：**2 fail 依赖 ambient `NO_COLOR=1`**（B 机制）；**真 TTY 无 `NO_COLOR` 仅 1 fail**（A 机制）。
- 普通 `npm test`（非 TTY · 未注入 `FORCE_COLOR`）⇒ **860 / 164 / 859 pass / 0 fail / 1 skip**。

**两处 spawn 面（本棒实读）**：
- `test/scan-human-gates-baseline.test.ts` 的 `runScanner`（:42-49）—— **省略 `env` 键 ⇒ 默认继承 `process.env`**（含注入的 `FORCE_COLOR`）。
- `test/cli-discipline-coverage.test.ts` 的 `runCli`（:41-45）—— `env: { ...process.env }` 显式继承。

**目标**：测试侧**钉死 spawn env**（不继承 ambient `FORCE_COLOR`），使 **TTY / 非 TTY / CI 三态确定同绿**；产品输出与 `npm test` 脚本**零变更**。

---

## 根因与修法（给 30 的执行口径 · 本棒不实现）

**唯一改点：`test/` 侧（3 件 · 缺一即验收红）**。

1. **新增共享 helper `test/_helpers/plain-env.ts`**（纯函数 · 不引产品代码 · 不被 `npm test` 的 `test/*.test.ts` glob 收集）：
   ```ts
   /** TTY 发布链下 node --test 会向测试子进程注入 FORCE_COLOR=1；spawn 子进程前须以此钉死。 */
   export function plainEnv(): NodeJS.ProcessEnv {
     // 唯一取值（00 裁定 B1）：两键同置 —— FORCE_COLOR:'0' 保零着色且不触发互斥警告 · NO_COLOR:'1' 满足回归锁契约。
     return { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }
   }
   /** 仅用于**断言**：还原被 FORCE_COLOR 注色的 stdout（禁用于采样/落盘）。 */
   export function stripAnsi(s: string): string {
     return s.replace(/\u001b\[[0-9;]*[mK]/g, '')
   }
   ```
   - **取值契约（00 裁定 B1 · 钉单一取值）**：`plainEnv()` 恒为 `FORCE_COLOR:'0'+NO_COLOR:'1'` · 保证子进程输出无色且零 stderr 互斥警告 · **30 只验证不选型**（无候选并列 · 无回填项）。
   - 不采用「在测试内改 `process.env`」或「在 `npm test` 脚本前置 env」（后者不可移植 · 且越范围）——env 钉死**只发生在 spawn 边界**（F-TC-01）。

2. **两处 spawn 改用 `plainEnv()`**：`runScanner` 补 `env: plainEnv()`；`runCli` 的 `env: { ...process.env }` → `env: plainEnv()`。**并顺带全仓 grep 同族面**（见「同类面快扫登记」）：`grep -rn "env: { ...process.env }" test/`（37 命中 / 32 文件）+ 隐式继承面（如 `runScanner`）—— 若发现「断言子进程 stdout 含 `label: <number>`」的真实同族面，**逐处纳入本 task 同式修复并在范围节登记**；否则只登记不改（本棒实测：FORCE_COLOR=1 全量仅 2 红 ⇒ 无额外真红面）。

3. **回归锁（关键 · 验收 ③）**：新增 `test/plain-env.test.ts`（或等价独立文件）：
   - **现象锁**：以 `env: { ...process.env, FORCE_COLOR: '1' }`（`delete env.NO_COLOR` 防警告）spawn 扫描器 → 断言 stdout **含 ANSI** 且 `stripAnsi(stdout).includes('文件数: 0')`（证明「着色真发生 + 断言侧可还原」）。
   - **修复锁**：以 `env: plainEnv()` spawn 扫描器 → 断言子进程 `NO_COLOR==='1'` ∧ `FORCE_COLOR==='0'` ∧ stdout **不含** `/\u001b\[/` ∧ **stderr 零互斥警告** ∧ `includes('文件数: 0')`（证明 helper 中和 ambient 着色且不引入新告警）。
   - **契约锁**：`plainEnv()` 恒返回 `FORCE_COLOR==='0'` ∧ `NO_COLOR==='1'`（**在 ambient FORCE_COLOR/NO_COLOR 任意组合下均确定**）；`stripAnsi('a\u001b[33m0\u001b[39m') === 'a0'`。
   - 红测先行：建 helper/接入前，现象锁与断言在 `FORCE_COLOR=1` 下**红**；接入后绿。

**红线（本 task 不实现 · 30 亦不得越）**：
- **不改产品代码**（`src/` / `scripts/` 的 `console.log` 着色属 TTY 正常行为 · 保持）—— 修的是**测试采样环境**，不是产品输出。
- **不改 `package.json` 的 `test` / `prepublishOnly` 脚本**（不可移植地在脚本前置 env · 且与本 task scope 冲突）。
- **`stripAnsi` 仅用于断言**，禁止用它清洗后落盘/对比采样（F-TC-02）。
- 不改 CI workflow、不改测试断言目标串、不新增依赖、不动 `docs/` 其他面。
- `git tag` / `push` / `npm publish` / `npm deprecate` 全**仅人**（无代跑授权）；tag 重打争议归 00（F-TC-04）。

---

## 开工基线（2026-09-18 本棒隔离复跑实测 · 验收比对的唯一基准）

> 30 开工时若复跑结果与本表不符，须以复跑实测重建基线并登记（沿用 W7 前例 F-W0-05 同式纪律），不得沿用旧数字强行比对。

| 项 | 实测值 | 备注 |
|----|--------|------|
| git HEAD | `fad0637` | 工作区 clean（本 task 起草后 +1 untracked）· tag `v3.0.0` **在** |
| `npm test`（普通） | **860 tests / 164 suites / 859 pass / 0 fail / 1 skip** | duration ≈64.5s · exit 0 |
| `FORCE_COLOR=1 npm test` | **860 / 857 pass / 2 fail / 1 skip** | exit 1 · 红面 = `scan-human-gates-baseline.test.ts:52` + `cli-discipline-coverage.test.ts:81` |
| pty TTY（`TERM=xterm-256color` · 无 `NO_COLOR`） | **1 fail** = `scan-human-gates-baseline.test.ts:52` | 维护者发布链的 1 红面（根因 A · 非 TTY/agent 不红） |
| `npm run typecheck` | **0 错** | strict + noUncheckedIndexedAccess |
| `node bin/specgate.js pins check` | **17/17 PASS · exit 0** | 含 pin-10 = tag `v3.0.0` 钉（tag 在 ⇒ 现绿） |
| 修后预期 | `npm test` + `FORCE_COLOR=1 npm test` **双 0 fail** · 定向两测 0/1 双环境均绿 · 新增锁测 N 条后 `859+N pass` | 30 须复跑确认 |

---

## 范围（唯一 · 全测试侧 · 不改产品输出）

- [x] **1. 新增 `test/_helpers/plain-env.ts`**：导出 `plainEnv()`（`{ ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }`）+ `stripAnsi(s)`（防御性 · 仅断言用）。纯函数 · 零产品 import · 不被 `test/*.test.ts` glob 收集。
- [x] **2. 两处 spawn 改 `plainEnv()`**：`test/scan-human-gates-baseline.test.ts`（`runScanner` :42-49 补 `env: plainEnv()`）· `test/cli-discipline-coverage.test.ts`（`runCli` :41-45 `env: { ...process.env }` → `env: plainEnv()`）。
- [x] **3. 同族 spawn 面全仓扫描 + 逐处登记**：`grep -rn "env: { ...process.env }" test/`（本棒：**37 命中 / 32 文件**）+ **隐式继承面**（无 `env` 键的 `runScanner`、`pack-hygiene` 等）；对「断言子进程 stdout 含 `label: <number>`」的面逐处判定。**实测无额外真红面**（FORCE_COLOR=1 全量仅 2 红）⇒ 表登记即可；若 30 复跑发现新真红面则同式纳入并登记。
- [x] **4. 回归锁测（关键）**：`test/plain-env.test.ts`（或等价）—— 现象锁（显式 `FORCE_COLOR=1` spawn ⇒ 有 ANSI · `stripAnsi` 还原 `文件数: 0`）+ 修复锁（`plainEnv()` spawn ⇒ 零 ANSI · 含 `文件数: 0`）+ 契约锁（`plainEnv` 字段 · `stripAnsi` 单测）。红测先行。

## 非范围

| 项 | 理由 |
|----|------|
| 改 `src/` 产品面 / `scripts/`（含 `scan-human-gates-baseline.mts` 的 `console.log` 数字实参） | TTY 下着色是 Node 正常行为 · 产品输出**不得**为迁就测试而改（改产品 = 掩盖测试采样缺陷） |
| 改 `package.json` `test`/`prepublishOnly` 脚本 | 在脚本里前置 `FORCE_COLOR=0` 不可移植（跨平台）/ 会改变开发者 TTY 输出 · 且越范围 |
| 改 CI `.github/workflows/ci.yml` | CI 非 TTY 本不触发 · 不需动（改则是掩盖而非定因） |
| 改测试断言目标串（如把 `文件数: 0` 改成正则容忍 ANSI） | 以 `stripAnsi` 或 env 钉死是**测试侧确定化**；放宽断言会丢失「零文件」语义 |
| 删除/移动/重打 tag `v3.0.0` | 争议项不在本 task 范围 · 归 00/维护者决策（F-TC-04 · 本 task 不 tag/push） |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（无代跑授权） |
| 历史留档/其他 task 内的同类描述 | 只新增不覆写 |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-TC-00） | 30 **拒开工**（GATE_VERIFY 机械拦 exit 2 · 闸真值以本 task 表为准） | 是（20 审 + 人签后） | 是 |
| 仅在 TTY/CI 分叉 → 未以显式 env 钉死（F-TC-01） | 验收 ②③ 双向拦（`FORCE_COLOR=0/1` 双环境 + pty 复跑）；30 须在 spawn 边界钉 env，不得依赖 ambient | 是 | — |
| `stripAnsi` 掩盖真实输出（F-TC-02） | 禁用于采样/落盘（仅断言）· 20/40 审查拦；验收 ③ 的修复锁直接断言 `plainEnv()` 输出**无 ANSI**（不靠 stripAnsi 才能过） | 是 | — |
| 漏改同族 spawn 面（F-TC-03） | 全仓 grep 清单逐处登记 · 验收 ① 在 `FORCE_COLOR=1` 下零 fail 兜底 | 是 | — |
| tag 需重打/移动（F-TC-04） | **不在本 task 范围** · 归 00 决策 · 本 task 不 tag/push | — | 是 |
| 验收 ①/② 双环境不一致 | 以复跑实测重建基线并登记 · **不得**沿用本表数字硬套 | 是 | 是 |
| 改产品输出以让测试变绿 | 越范围 · diff 出现 `src/`/`scripts/` 改动即打回 | — | 是 |
| 越权 tag/push/publish/deprecate | 违禁令 · 打回（四动作全仅人） | — | 是 |

---

## 验收标准（必须自证，不接受「我改完了」）

> **计数口径**：本 task 验收 = **6 条（#1–#6）** · failure_paths = **8 条（F-TC-00–04 + 双环境基线 + 产品越改 + 越权）**。本 task 为 bugfix · 双轨可跳独立 SPEC。
> **发布临门判据**：#1（`FORCE_COLOR=1 npm test` 全绿）是本 hotfix 的**唯一**放行条件。

- [x] **#1 发布临门：`FORCE_COLOR=1 npm test` 全绿（0 fail）**（F-TC-01/03）：仓根 `FORCE_COLOR=1 npm test` → **860+N tests / 859+N pass / 0 fail / 1 skip**（N=新增锁测数 · 与 #2 同式 · = 普通基线的 pass 全数）。**对照**：修复前同命令 **2 fail**（`:52` + `:81` · 本 task R0 已实测钉死）。留证：命令 + 两端 summary 写入 30 invoke。
- [x] **#2 普通 `npm test` 全绿（零回退）**：`npm test` → **860 / 164 / 859 pass / 0 fail / 1 skip**（或 +N 新锁测后 `860+N / 859+N pass / 0 fail`）；exit 0。
- [x] **#3 回归锁测真红→绿（F-TC-01/02）**：新锁测在未接入 helper 前**红**（现象锁在 `FORCE_COLOR=1` 下断言失败 / import 失败）；接入后绿：现象锁（`FORCE_COLOR=1` spawn ⇒ stdout 含 ANSI · `stripAnsi` 还原 `文件数: 0`）+ 修复锁（`plainEnv()` spawn ⇒ 零 ANSI · 含 `文件数: 0`）+ 契约锁。留证：先红后绿的两次命令 + 输出。
- [x] **#4 定向两测 `FORCE_COLOR=0/1` 双环境均绿**（F-TC-01）：`node --test --experimental-strip-types test/scan-human-gates-baseline.test.ts test/cli-discipline-coverage.test.ts` 于 `FORCE_COLOR=0` 与 `FORCE_COLOR=1` **均 0 fail**（修复前：`FORCE_COLOR=1` = 2 fail / `FORCE_COLOR=0` = 0 fail）。附 pty 复跑：`env -u NO_COLOR TERM=xterm-256color script -q /dev/null node --test …` 两文件 **0 fail**（修复前 1 fail）。
- [x] **#5 typecheck / pins（tag `v3.0.0` 在 ⇒ 全绿）**：`npm run typecheck` **0 错** · `node bin/specgate.js pins check` **17/17 PASS** · 依赖零新增。
- [x] **#6 结构闸**：`npx spec-wave task lint --file docs/tasks/active/task_3_0_w7_tty_color_hotfix.md` PASS（E1–E8 / W5–W7：R0–R5 槽位 + 控制表齐）。

---

## 给执行帽的必读列表

1. `test/scan-human-gates-baseline.test.ts`（:42-49 `runScanner` 省略 env 继承 · **:64 红断言** · :60/:72 注记/meta 断言）
2. `test/cli-discipline-coverage.test.ts`（:41-48 `runCli` `env: { ...process.env }` + stdout/stderr 拼接 · **:85 `JSON.parse` 红点** · :81 用例）
3. `scripts/scan-human-gates-baseline.mts`（:191-201 `console.log` 数字实参面 · **:195 唯一被断言命中**）
4. `test/_helpers/core-harness.ts`（:45-50 `withCaptured` console 捕获以 `a.map(String)` 归一 · :51-59 stdout.write 捕获 ⇒ 进程内 `runCore` 测试对 FORCE_COLOR **免疫** · 同族面判定的设计证据）
5. done task [`task_3_0_w7_ci_hotfix.md`](../done/task_3_0_w7_ci_hotfix.md)（同族 CI hotfix 先例 · **结构模板** · bugfix 双轨跳 SPEC · 模拟 CI 负向锁 · 偏差登记表式）
6. done task [`task_3_0_w1_ci_hotfix.md`](../done/task_3_0_w1_ci_hotfix.md)（本文件红测来源套件的前身 · scanner 缺失目录守卫由来）
7. PLAN [`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) 硬约束 **6**（修严型必须配负向 fixture）/ **10**（环境依赖必须可诊断）
8. Node 环境事实（本棒实证）：`node --test` 在 `stdout.isTTY && TERM≠dumb` 下向测试子进程注入 `FORCE_COLOR=1`；agent shell `TERM=dumb` 不注入 ⇒ 双态分叉真因

---

## 同类面快扫登记（本棒 grep 实测 · 本 task 只改 2 处真红面 · 其余登记）

**扫描口径**：① `grep -rn "env: { ...process.env }" test/`（**37 命中 / 32 文件**）· ② 隐式继承（无 `env` 键的 spawn 面）· ③ 对照组 `FORCE_COLOR=1 npm test` 全量（**仅 2 红** ⇒ 其余非真红）。

- **真红 A（本 task 修）**：`test/scan-human-gates-baseline.test.ts` `runScanner`（**省略 env ⇒ 继承**）⇒ :64 断言红（数字实参着色）。
- **真红 B（本 task 修）**：`test/cli-discipline-coverage.test.ts` `runCli`（:45 `env: {...process.env}`）⇒ :85 `JSON.parse` 红（stderr 警告拼接 · 需 `NO_COLOR=1` 并存）。
- **同族但实测非红（登记不改 · 37 命中 / 32 文件中除真红 B 外的 36 处 / 31 文件 `env: {...process.env}`）**：这些 spawn 面的断言面为 **JSON 结构 / 模板字符串输出 / exit 码**，非「数字实参 `label: <number>` 子串」；代表证据：`src/cli-lifecycle.ts:374`（`unevaluated_count` 模板串）· `src/cli-graph.ts:312`（`violations` 模板串）· `src/cli-task-extra.ts:400/455`（`done slugs`/`scanned` 模板串）· `src/cli/verify.ts:103`（`scanned` 模板串）—— 均为 string 实参，`console.log` 不注色。
- **进程内免疫面（登记 · 设计证据）**：`test/_helpers/core-harness.ts:45-50`（console 捕获 `a.map(String).join(' ')`）· `:51-59`（stdout.write 捕获） ⇒ 使用 `runCore` 的套件**无 spawn**、对 FORCE_COLOR 免疫。
- **测试外脚本（非本族 · 登记不改）**：`scripts/w6-lint-escape-rate.mjs:37/108` 有数字实参 `console.log`，但**无任何 test 引用**（本棒 grep 实测 `test/` 零命中）⇒ 不进 `npm test` 面。
- **测试内 spawn 的脚本清单（本棒实测）**：`scripts/scan-human-gates-baseline.mts`（真红 A）· `scripts/check-pack-hygiene.mjs`（`pack-hygiene.test.ts` 断言 exit 码/文案 · FORCE_COLOR=1 全量实测绿）⇒ 无额外真红面。

## 依赖

- 运行期：Node ≥ 22.19（`engines`）；`node --test` + `--experimental-strip-types`（本仓 test 脚本既有口径）。
- 仓内：`test/_helpers/plain-env.ts`（新）↔ 两处 spawn（`runScanner` / `runCli`）↔ 新锁测文件。
- 上游：无独立 SPEC（bugfix 双轨）；依据 PLAN 硬约束 6/10 + 同族 done task `task_3_0_w7_ci_hotfix.md`。

---

## 思考轮

### R0 · 证据

三态隔离实测：普通 `npm test` **860/164/859 pass/0 fail/1 skip** · `FORCE_COLOR=1 npm test` **857 pass/2 fail/1 skip**（`scan-human-gates-baseline.test.ts:52` + `cli-discipline-coverage.test.ts:81`）· pty（`TERM=xterm-256color` · 无 `NO_COLOR`）**1 fail**（仅 scan）。机制 A 逐字证据：FORCE_COLOR=1 下扫描器 stdout `文件数: \u001b[33m0\u001b[39m`；`node --test` pty 探针 `PROBE_FORCE_COLOR="1"` vs `TERM=dumb`/管道 `undefined`。机制 B 复现：`JSON.parse(stdout)` OK / `JSON.parse(stdout+'\n'+stderr)` 失败于 `position=stdout_len+1`（NO_COLOR/FORCE_COLOR 警告）。`plainEnv()` 组合（`FORCE_COLOR=0` + `NO_COLOR=1`）实测零 ANSI + 零 stderr 警告。基线：typecheck 0 错 · pins 17/17 · tag `v3.0.0` 在 · HEAD `fad0637`。

### R1 · 范围

唯一 = 测试侧三件：新 helper `plain-env.ts` + 两处 spawn 改 `plainEnv()` + 回归锁三连（现象/修复/契约）；同族面全仓 grep 登记。非范围：`src/`/`scripts/` 产品面、`package.json` 脚本、CI workflow、断言放宽、tag 决策、发布四动作、历史留档。

### R2 · 方案

钉死 **spawn 边界 env**（`FORCE_COLOR:'0'` + `NO_COLOR:'1'`），不依赖 ambient、不改产品输出、不改 npm 脚本；`stripAnsi` 仅断言；回归锁以「显式 `FORCE_COLOR=1` spawn 证明着色 + `plainEnv()` spawn 证明中和」双面闭环。**不**采：改产品 `console.log`（掩盖）· 脚本前置 env（不可移植）· 放宽断言（丢语义）· 全局改 `process.env`（污染并行套件）。

### R3 · 边界

只改 `test/`（2 现有文件 + 2 新文件：helper + 锁测）· 逐文件显式 add 禁裹挟 · 不动 `docs/` 其他面 · 不签任何闸 · tag/push/publish 零触碰 · 30 开工先 GATE_VERIFY。

### R4 · 可测性

验收 6 条全机械：`FORCE_COLOR=1 npm test` 0 fail（发布临门）· 普通 npm test 0 fail · 锁测红→绿 · 定向两测双环境 + pty 均绿 · typecheck/pins · task lint。红测先行面明确（新锁测 + 修复前 FORCE_COLOR=1 的 2 红 R0 已钉）。**双环境同绿 = 环境确定性的唯一硬判据。**

### R5 · 签收就绪

草稿预置五槽完毕；**HG-TASK-DRAFT approved（2026-09-17 00 代签）· HG-AUDIT-R1 approved（2026-09-18 00 代签 · 依据 R1 BLOCKED→B1 回填 + R2 PASS）** ⇒ **双闸 approved · 30 可开工**（GATE_VERIFY PASS）；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 三态实测（普通 859 pass / FC=1 2 fail / pty 1 fail）+ 机制 A/B 双复现 + plainEnv 组合实测 + 基线 pins 17/17 · tag 在 | no |
| R1 | 范围唯一测试侧三件 · 非范围含产品/脚本/CI/tag 决策 | no |
| R2 | spawn 边界 env 钉死 + stripAnsi 仅断言 + 双面回归锁 · 否四类掩盖式方案 | no |
| R3 | 只改 test/ · 禁裹挟 · 不签闸 · 发布四动作零触碰 | no |
| R4 | 验收 6 条全机械 · 双环境同绿硬判据 · 红测先行面明示 | no |
| R5 | 五槽齐 · 双闸 approved（HG-TASK-DRAFT 2026-09-17 · HG-AUDIT-R1 2026-09-18 · 均 00 代签）⇒ 30 可开工 · residual 见下 | no |

**residual_risks**：① **ambient `NO_COLOR` 语义不确定性** —— 本修令 `plainEnv()` 固定 `NO_COLOR:'1'`；若将来某测试**需要** Color 输出（如专门验 ANSI），须显式覆盖 `plainEnv()`（**缓解**：契约锁 + 现象锁明示覆盖方式）；② **同族面遗漏** —— 全仓 37 命中 + 隐式继承面以 grep 判定，未来新增 spawn 面若断言数字标签会复发（**缓解**：FORCE_COLOR=1 全量验收 ① 兜底 + 本表登记；建议升 3.x/W5 通用守卫面 · 本棒只登记）；③ **`node --test` 注入行为随 Node 版本漂移** —— 本棒实证 v24.15.0 在 TTY 注入；低版本/未来版本行为可能不同 ⇒ 修法（spawn 边界钉 env）对「注入与否」**两态均确定**（**缓解**：不依赖注入存在性 · 只依赖 env 钉死）；④ **`stripAnsi` 正则覆盖面** —— 仅覆盖 SGR(`m`)/`K`；若产品引入其他 ANSI 序列（光标/Osc）断言锁可能不还原（**缓解**：仅断言用 · 修复锁不依赖 stripAnsi）；⑤ 本 task 不 tag/push，CI 转绿待维护者推后核（归 00）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 验收主体 = **环境确定性锁三连**（① 新回归锁测：现象锁 `FORCE_COLOR=1` spawn 有 ANSI + `stripAnsi` 还原；修复锁 `plainEnv()` spawn 零 ANSI；契约锁字段/单测；② 定向两测 `FORCE_COLOR=0/1` + pty 均绿；③ 全量双环境 `npm test` / `FORCE_COLOR=1 npm test` 均 0 fail）。红测先行：新锁测在 helper 接入前先红；修复前 `FORCE_COLOR=1 npm test` 2 红 = R0 已钉。每 commit 前后 `npm test` 同绿（基线 859 pass / 0 fail / 1 skip）。**本棒是测试环境确定化波 · 红绿纪律 = 现象锁先行（红）· 修复锁与全量双环境兜住零回退。**

---

## 提交信息约定

- `test(3.0-W7-hotfix): plain-env helper + 回归锁（FORCE_COLOR=1 现象锁先红 · F-TC-01/02）`
- `test(3.0-W7-hotfix): 两处 spawn 钉死 plainEnv（scan/cli-discipline · TTY 发布链假红 hotfix）`
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界
- **禁 tag / push / publish / deprecate（仅人 · 无代跑授权）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w7_tty_color_hotfix.md`

---

### 自检结论（执行者）

**GATE_VERIFY 首输出**（FRAGMENT_30 纪律 · 真值 = task 人工闸表）：`node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w7_tty_color_hotfix.md` → **HG-TASK-DRAFT / HG-AUDIT-R1 双闸 approved** · **VERIFY: PASS** · exit 0。

**修复 commit**：`0e1f165`（`0e1f165b09868a021fe7d36c197146dc4c1c5627`）· `fix(3.0-W7): 测试侧 FORCE_COLOR 确定性（plainEnv 单一取值 + 两处 spawn + 回归锁三连 · 验收 #1）`。

**范围三件**：① 新 helper `test/_helpers/plain-env.ts`（`plainEnv()` 唯一取值 `{ ...process.env, FORCE_COLOR:'0', NO_COLOR:'1' }` + `stripAnsi()` 仅断言 · 零产品 import · 不被 `test/*.test.ts` glob 收集）；② 两处 spawn 钉死（scan `runScanner` 补 `env: plainEnv()` · cli-discipline `runCli` `{ ...process.env }` → `plainEnv()`）；③ 回归锁三连 `test/plain-env.test.ts`（现象/修复/契约 + spawn env 探针）。同族 `grep -rn "env: { ...process.env }" test/` = **37 命中 / 32 文件**，真红仅 2（scan + cli-discipline），其余 36 处登记不改。

**验收逐项**：#1 ✓ 发布临门 `FORCE_COLOR=1 npm test` **864 / 165 / 863 pass / 0 fail / 1 skip** · exit 0（修前同命令 2 fail：scan :64 + cli-discipline :85）· #2 ✓ 普通 `npm test` **864 / 165 / 863 pass / 0 fail / 1 skip** · exit 0（基线 859 pass + 4 新锁）· #3 ✓ 锁红→绿（helper 未建 import 失败 1 fail → 建后 4/4 · FC=0/1 均绿）· #4 ✓ 定向 3 文件 FC=0/1 均 12/12/0 · pty 双态 8/8/0（修前 pty 1 fail）· #5 ✓ typecheck 0 错 · pins 17/17 · assets 113/113 · test:lib 6/6 · 依赖零新增 · #6 ✓ task lint PASS + verify 双闸 approved。

**回归锁三连断言点**：① 契约锁 —— ambient FC/NC 7 组合下进程内断言 `plainEnv()` 恒 `FORCE_COLOR==='0'` ∧ `NO_COLOR==='1'` + `stripAnsi('a\u001b[33m0\u001b[39m')==='a0'`；② 现象锁 —— `env: { ...process.env, FORCE_COLOR:'1' }`（删 `NO_COLOR`）spawn 扫描器 ⇒ stdout 含 `/\u001b\[/` ∧ `stripAnsi(stdout).includes('文件数: 0')`；③ 修复锁 —— `env: plainEnv()` spawn ⇒ `!/\u001b\[/.test(stdout)` ∧ 含「文件数: 0」∧ stderr 零 `NO_COLOR`/`FORCE_COLOR` 互斥警告；另 spawn 探针断言子进程 `NO_COLOR==='1' ∧ FORCE_COLOR==='0'`（R2-A1）。

**锁计数（纯加性零回退）**：

| 项 | 实测 |
|----|------|
| 基线（task 起草 @fad0637 · 本棒复跑） | 普通 860 / 164 / 859 / 0 / 1 · FC=1 860 / 857 / 2 / 1 · pty 1 fail |
| 本棒终态 | **普通 864 / 165 / 863 / 0 / 1** · **FC=1 864 / 165 / 863 / 0 / 1** · pty 0 fail |
| clone `0e1f165` | FC=0/1 双态 **864 / 165 / 863 / 0 / 1** · pty 8/8/0 |
| typecheck / pins / assets / test:lib | 0 错 / 17/17 / 113/113 / 6/6 |
| terminology / claims / doc-links | PASS / PASS / PASS（S2=34/34） |
| 依赖 | 零新增 |

**偏差登记**：① 开工 HEAD `3ceb42c` ≠ task 起草期 `fad0637`（+1 docs 提交）· 复跑重建基线与 task 表逐字吻合；② `FORCE_COLOR='0'+NO_COLOR='1'` 实测 stderr **0 bytes**（零告警），`FORCE_COLOR='1'+NO_COLOR='1'` 164 bytes 互斥警告（B 机制）—— B1 单一取值确证；③ 修复锁 stderr 判据取「不含互斥警告」而非「stderr 为空」（防未来无关告警耦合 · 语义满足 task :95）；④ clone 取修复 commit `0e1f165`（代码终态），其后的 invoke docs 提交对测试面零影响；⑤ pty/定向数字以复跑实测为准（与 task 表一致）。详见 30 invoke `docs/harness/invokes/by-task/3-0-w7-tty-color-hotfix/invoke_20260918_30_3-0-w7-tty-color-hotfix.md`。

**40 复核登记（PASS · blocking 0 · advisory 4 · 40 留档 `b0a2fb1`）**：① **A1 clone 复跑口径** —— 新鲜 clone 无 `node_modules`，复跑前须先 `npm ci`（40 实跑 `npm ci` 后双态方绿；本棒首次 clone 复跑以 node_modules 符号链接等价满足 · 后续 clone 复跑留档补齐 `npm ci` 步）；② **A2 commit 前缀偏差登记** —— 修复 commit `0e1f165` 用 `fix(3.0-W7):` 而 task「提交信息约定」建议 `test(3.0-W7-hotfix):`，scope 正确、内容吻合，仅前缀/scope 标签偏差，不影响验收；③ **A3 stderr 判据语义等价** —— 修复锁断言「不含互斥警告」而非「stderr 为空」，40 实测 `plainEnv()` 下 scanner stderr = **0 bytes** ⇒ 语义等价成立（仅提示未来无关告警不被锁捕获）；④ **A4 顶层警告** —— `FORCE_COLOR=1`/pty 全量运行顶层 `node --test` 自身打印一次 NO_COLOR/FORCE_COLOR 互斥警告（ambient `NO_COLOR=1`），**不影响测试结果**（0 fail）。以上四条均非阻断。

---

### KPI（00）

**00 收官裁定**（rubric `KPI_RUBRIC_v1_2` · 40 复核 PASS（blocking 0 · advisory 4 · 40 留档 `b0a2fb1`）· close_kpi 存在性口径）：**Task_KPI%: 95**

- **修复三件套质量高**：`plainEnv()` 单一取值 `FORCE_COLOR:'0'+NO_COLOR:'1'` 钉死 spawn 采样环境 + 两处真红面（scan `runScanner` 隐式继承 / cli-discipline `runCli` 显式继承）同式收口 + 回归锁三连（契约/现象/修复 + env 探针）；`FORCE_COLOR=1 npm test` 发布临门 **864 / 165 / 863 pass / 0 fail / 1 skip**（修前 2 fail）· TTY pty 全量 0 fail · 干净 clone 双态同值 —— 环境确定性硬判据兑现。
- **质量门**：锁纯加性零回退（860/164/859/0/1 → **864/165/863/0/1**）· typecheck 0 错 · pins 17/17 · assets 113/113 · terminology/claims/doc-links PASS（S2=34/34）· test:lib 6/6 · 零越权（仅 `test/` + `docs/` · 禁 `add -A` 遵守 · 未 push/tag/publish）。
- **扣 5**：缺陷在**发布准备期**（维护者 TTY 跑 `prepublishOnly`）才被发现且需**第二轮 hotfix**（W7 内第二例），测试侧环境确定化仍存遗漏面；40 advisory 4（A1 clone 须先 `npm ci` · A2 commit 前缀偏差 · A3 stderr 判据语义等价 · A4 顶层自打警告）均非阻断且已登记。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 初稿 · 10-task（TTY FORCE_COLOR 发布链假红 hotfix · bugfix 双轨跳 SPEC）：三态基线实测 + 根因 A（数字实参着色 · pty 探针实证入背景）与根因 B（stderr 警告污染 JSON.parse · 同族第二机制）· 范围唯一（helper + 两处 spawn + 回归锁三连）· 非范围含产品/脚本/CI/tag · 验收 6 条（#1 `FORCE_COLOR=1 npm test` 发布临门）· F-TC-00–04 · R0–R5 五槽 + residual 五条 · 同族 spawn 面 37 命中/32 文件 grep 登记 · 本棒不签任何闸 |
| 2026-09-18 | 00 验收裁定：三条精度补正（A/B 双机制 · 2 测口径 · pty 注入来源）全部采信 · **HG-TASK-DRAFT `pending` → approved**（2026-09-17 00 代签 · 授权真值：维护者本窗授权（tag/push 代跑 + 过程文档闸代签模式）· task lint PASS）· 头部状态行 `draft` → `pending` · HG-AUDIT-R1 维持 pending（30 仍拒开工）· 补记带入 30：`plainEnv()` 取值契约「无色 + 无 NO_COLOR/FORCE_COLOR 互斥警告」· acceptance #4 pty 复跑保留 |
| 2026-09-18 | 00 裁定 B1 闭合 + A1–A5 搭车：**plainEnv 钉单一取值** `FORCE_COLOR:'0'+NO_COLOR:'1'`（删候选 a/b 与 30 定稿回填 · 契约句「30 只验证不选型」）· 修复锁补「子进程 NO_COLOR='1' ∧ FORCE_COLOR='0' ∧ stderr 零互斥警告」· A1 验收 #1 计数 `860+N/859+N` · A2 同族计数 `37 命中/32 文件`（非红 36 处/31 文件）· A3 范围 #2 grep 补 `-r` · A4 非范围 deprecate 去重 · A5 契约锁「ambient 任意组合下均确定」+ core-harness 行号 `:45-50`/`:51-59` + 补注「2 fail 依赖 ambient NO_COLOR=1 · 真 TTY 仅 1 fail」 |
| 2026-09-18 | **HG-AUDIT-R1 `pending` → approved**（00 代签 · 授权真值：维护者本窗授权 · 依据 R1（BLOCKED→B1 回填）+ R2（PASS · blocking 0 · advisory R2-A1 · `can_sign: true`）审查文）· 头部状态行同步「双闸 approved · 30 可开工」· R5 正文/控制行同步 · R2-A1 带入 30（修复锁可观测性以 plainEnv 字段进程内断言 + spawn 探针等价满足）· pre-30 invoke 三件套（10/20/00）补齐 |
