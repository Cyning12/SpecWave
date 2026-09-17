# Invoke：30（execute · TTY 色彩 hotfix）· 3-0-w7-tty-color-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 30 |
| task_slug | `3-0-w7-tty-color-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w7_tty_color_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |
| 修复 commit | `0e1f165`（`0e1f165b09868a021fe7d36c197146dc4c1c5627`） |
| GATE_VERIFY | `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w7_tty_color_hotfix.md` → 双闸 approved · VERIFY: PASS · exit 0 |

## 指令摘要

30 实现棒：GATE_VERIFY（HG-TASK-DRAFT / HG-AUDIT-R1 双闸 **approved** · VERIFY: PASS）→ 按 task 范围 1–4 + 验收 #1–#6 执行：① 新增 `test/_helpers/plain-env.ts`（`plainEnv()` 唯一取值 `{ ...process.env, FORCE_COLOR:'0', NO_COLOR:'1' }` + `stripAnsi()` 仅断言）；② 两处 spawn 改 `plainEnv()`（scan `runScanner` 补 `env` · cli-discipline `runCli` 换 `env`）；③ 新增 `test/plain-env.test.ts` 回归锁三连（现象/修复/契约）；④ 全量 FC=0/1 + pty 双态 + clone 复跑。**禁** `add -A` / 改产品 `src/`/`scripts/` / 改 npm scripts / tag / push / publish。A1：修复 commit（`0e1f165`）后 clone 复跑；A2：pty 复跑；R2-A1：修复锁 env 可观测性以「进程内契约锁 + spawn 探针」双满足。

## 执行证据（本棒实测）

### GATE_VERIFY 首输出（FRAGMENT_30 纪律 · 真值 = task 人工闸表）

```text
task: task_3_0_w7_tty_color_hotfix.md
| gate | status | blocks_30 | 30 影响 |
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_w7_tty_color_hotfix.md
[exit 0]
```

### 三件套实现摘要

1. **`test/_helpers/plain-env.ts`（新 · 唯一取值）**：`plainEnv(): NodeJS.ProcessEnv => { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }`（注释理由：TTY 发布链下 `node --test` 向测试子进程注入 `FORCE_COLOR=1`，spawn 前须钉死采样环境）；`stripAnsi(s) => s.replace(/\u001b\[[0-9;]*[mK]/g, '')`（仅断言 · 防御）。零产品 import · 不被 `test/*.test.ts` glob 收集。
2. **两处 spawn 钉死**：`test/scan-human-gates-baseline.test.ts` `runScanner` 由「省略 env（隐式继承）」→ `{ encoding:'utf8', cwd: root, env: plainEnv() }`；`test/cli-discipline-coverage.test.ts` `runCli` 由 `env: { ...process.env }` → `env: plainEnv()`。
3. **回归锁三连 `test/plain-env.test.ts`**：① 契约锁（ambient FC/NC 7 组合下进程内断言 `plainEnv()` 恒 `FC=0 ∧ NC=1` + `stripAnsi` 还原单测 · R2-A1 等价满足）；② 现象锁（显式 `FORCE_COLOR=1`（删 `NO_COLOR`）spawn 扫描器 ⇒ stdout 含 ANSI ∧ `stripAnsi` 还原「文件数: 0」）；③ 修复锁（`plainEnv()` spawn ⇒ 零 ANSI ∧ stderr 零互斥警告 ∧ 含「文件数: 0」+ 另一 spawn 探针断言子进程 `NO_COLOR='1' ∧ FORCE_COLOR='0'`）。

### 红测先行（未建 helper 前红 · 建后绿）

```text
$ node --test --experimental-strip-types test/plain-env.test.ts        # helper 未建
ERR_MODULE_NOT_FOUND: Cannot find module '…/test/_helpers/plain-env.ts'
ℹ tests 1 · pass 0 · fail 1 · exit 1                                   （红）

$ node --test --experimental-strip-types test/plain-env.test.ts        # helper 建成后
ℹ tests 4 · suites 1 · pass 4 · fail 0 · exit 0                        （绿）
```

### 修前对照（@ `3ceb42c` · 本棒复跑钉死）

```text
定向两测 FC=1   : 8 tests / 6 pass / 2 fail   （scan :64 A 机制 + cli-discipline :85 B 机制）
定向两测 普通   : 8 tests / 8 pass / 0 fail
定向两测 pty    : 8 tests / 7 pass / 1 fail   （env -u NO_COLOR TERM=xterm-256color script）
根因快照：FORCE_COLOR=1 ⇒ console.log('文件数:', 0) = 文件数: \u001b[33m0\u001b[39m；
          FORCE_COLOR=1 且 NO_COLOR=1 ⇒ stderr 警告 "The 'NO_COLOR' env is ignored …"（164 bytes）；
          FORCE_COLOR=0 且 NO_COLOR=1 ⇒ stdout 无色 · stderr 0 bytes（plainEnv 组合实测零告警）
```

### 修后复跑（本地 · 定向 3 文件 = scan + cli-discipline + plain-env）

```text
普通      : 12 tests / 3 suites / 12 pass / 0 fail / 0 skip · exit 0
FORCE_COLOR=1 : 12 tests / 3 suites / 12 pass / 0 fail / 0 skip · exit 0
pty（2 文件 exact） : 8 tests / 2 suites / 8 pass / 0 fail · exit 0
pty FC=0（2 文件）  : 8 tests / 2 suites / 8 pass / 0 fail · exit 0
```

### 全量双环境（发布临门 · 验收 #1/#2）

```text
$ FORCE_COLOR=1 npm test
ℹ tests 864 · suites 165 · pass 863 · fail 0 · skipped 1 · duration_ms 62685 · exit 0

$ npm test
ℹ tests 864 · suites 165 · pass 863 · fail 0 · skipped 1 · duration_ms 62745 · exit 0
```

（基线 860/164/859/0/1 · N=4 新锁测 ⇒ 860+4=864 tests · 164+1=165 suites · 859+4=863 pass · 纯加性零回退。）

### 新鲜 clone 复跑（A1 · 修复 commit `0e1f165`）

```text
$ rm -rf /tmp/w7-clone && git clone -q . /tmp/w7-clone && cd /tmp/w7-clone
clone HEAD = 0e1f165b09868a021fe7d36c197146dc4c1c5627

$ FORCE_COLOR=1 npm test    → 864 / 165 / 863 pass / 0 fail / 1 skip · exit 0
$ npm test                  → 864 / 165 / 863 pass / 0 fail / 1 skip · exit 0
$ env -u NO_COLOR TERM=xterm-256color script -q /dev/null node --test     test/scan-human-gates-baseline.test.ts test/cli-discipline-coverage.test.ts
                            → 8 / 2 / 8 pass / 0 fail · exit 0（parent 原命令）
$ （3 文件 pty）            → 12 / 3 / 12 pass / 0 fail · exit 0
```

### 质量门（本棒实测）

```text
npm run typecheck            → 0 错 · exit 0
node bin/specgate.js pins check      → PINS: PASS · 17/17 落点一致 · exit 0
node bin/specgate.js assets verify   → ASSETS: PASS · 113/113 文件一致 · exit 0
node scripts/check-terminology.mjs   → TERMINOLOGY: PASS · 判红面 门控 残留 0 · exit 0
node scripts/check-claims.mjs        → CLAIMS: PASS · forbidden_wording 零命中 · exit 0
node scripts/check-doc-links.mjs     → DOC LINKS: PASS · S2=34/34 冻结基线 · exit 0
npx spec-wave task lint --file …     → LINT: PASS · exit 0
npm run test:lib                     → 6 tests / 6 pass / 0 fail · exit 0
依赖                                  → 零新增
```

### 同族 spawn 面（范围 3 · 只改 2 真红 · 其余登记不改）

`grep -rn "env: { ...process.env }" test/` = **37 命中 / 32 文件**（与 task 口径一致）；隐式继承面 = scan `runScanner`（唯一）。真红仅 2：scan `runScanner`（A · 数字实参着色）· cli-discipline `runCli`（B · stderr 警告拼接）。判据：`FORCE_COLOR=1 npm test` 全量 **0 fail** ⇒ 无额外真红面，其余 36 处 / 31 文件登记不改（断言面为 JSON/模板串/exit 码）。`文件数: 0` 全仓仅 scan :64 一处断言。

### 验收逐项

- **#1 ✓ 发布临门**：`FORCE_COLOR=1 npm test` → **864 / 165 / 863 pass / 0 fail / 1 skip** · exit 0（修前同命令 2 fail：scan :64 + cli-discipline :85）。
- **#2 ✓ 普通零回退**：`npm test` → **864 / 165 / 863 pass / 0 fail / 1 skip** · exit 0（基线 859 pass + 4 新锁）。
- **#3 ✓ 回归锁红→绿**：现象锁（FC=1 spawn 有 ANSI + `stripAnsi` 还原「文件数: 0」）+ 修复锁（`plainEnv()` spawn 零 ANSI ∧ 零互斥警告 ∧ 含「文件数: 0」）+ 契约锁 + spawn env 探针；helper 未建前 import 失败红（1 fail），建后 4/4 绿（FC=0/1 均绿）。
- **#4 ✓ 定向双态 + pty**：3 文件 FC=0/1 均 12/12/0；pty（无 NO_COLOR · TERM=xterm-256color）2 文件 8/8/0 · FC=0 pty 8/8/0（修前 pty 1 fail）。
- **#5 ✓ typecheck / pins / assets**：typecheck 0 错 · pins 17/17 PASS · assets 113/113 PASS · test:lib 6/6 · 依赖零新增。
- **#6 ✓ 结构闸**：`npx spec-wave task lint --file …` PASS；`node bin/specgate.js verify` 双闸 approved · VERIFY: PASS。

### 锁计数（纯加性零回退）

| 项 | 基线（task 起草 @fad0637 · 本棒复跑） | 本棒终态 |
|----|--------------------------------------|----------|
| `npm test` | 860 / 164 / 859 / 0 / 1 | **864 / 165 / 863 / 0 / 1**（+4 锁测 · +1 suite） |
| `FORCE_COLOR=1 npm test` | 860 / 857 / 2 / 1 | **864 / 863 / 0 / 1** |
| pty 定向 | 1 fail | **0 fail** |
| typecheck | 0 错 | 0 错 |
| pins / assets | 17/17 / 113/113 | 17/17 / 113/113 |
| terminology / claims / doc-links | PASS | PASS（S2=34/34） |
| test:lib | 6/6 | 6/6 |
| 依赖 | js-yaml 唯一 | 零新增 |

## 授权边界

- ⛔ 未 `git add -A`（逐文件显式 add）· 未 tag / push / publish / deprecate
- ⛔ 未改 `src/` 产品面 / `scripts/`（含 scanner `console.log` 数字实参）/ `package.json` scripts / CI workflow
- ⛔ 未改测试断言目标串（`文件数: 0` 保持）· `stripAnsi` 仅用于断言（F-TC-02）
- ⛔ S2 只新增：本 invoke + task 自检回填（R1/R2 审查文与 00/10/20 invoke 零触碰）

## 偏差登记

1. **开工 HEAD `3ceb42c` ≠ task 起草期 `fad0637`**（+1 docs 提交 = task + R1/R2 审查文 + invoke 三件套）。本棒复跑重建基线并逐字吻合 task 表：普通 860/164/859/0/1 · FC=1 2 fail（:64 + :85）· pty 1 fail · typecheck 0 · pins 17/17 · tag `v3.0.0` 在。
2. **`plainEnv()` 互斥警告实测边界**：`FORCE_COLOR='0' + NO_COLOR='1'` ⇒ stderr **0 bytes**（零告警 · 修复锁判据成立）；`FORCE_COLOR='1' + NO_COLOR='1'` ⇒ stderr 164 bytes 互斥警告（B 机制）。task B1 单一取值经实测确证。
3. **修复锁 stderr 判据**：断言「不含 `NO_COLOR`/`FORCE_COLOR` 互斥警告」而非「stderr 为空」，避免与 Node 未来的无关告警耦合；语义满足 task :95「stderr 零互斥警告」。
4. **R2-A1 可观测性**：修复锁「子进程 `NO_COLOR='1' ∧ FORCE_COLOR='0'`」以**另 spawn 探针**（`node -e` 打印 env）直接实证 + 契约锁进程内断言 `plainEnv()` 字段双满足（R2-A1 明示二者等价）。
5. **clone 时点**：A1 clone 取**修复 commit `0e1f165`**（代码终态）；其后 `docs(3.0-W7): 30 invoke 留证` 为 S2 文档提交，对测试面无影响（与同族 W7 CI hotfix 先例一致）。
6. **`--experimental-strip-types` 于 Node v24.15.0 无试验告警**（实测 scanner stderr 干净），修复锁不受其影响。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 30 修复交付：新 helper `plain-env.ts`（唯一取值 `FORCE_COLOR:'0'+NO_COLOR:'1'`）· 两处 spawn 钉死 `plainEnv()` · 回归锁三连（现象/修复/契约 + env 探针）· 红测先行（import 失败红 → 4/4 绿）· 全量 FC=0/1 864/165/863/0/1 双绿 · pty 双态 0 fail · clone `0e1f165` FC=0/1 同值 · 质量门全绿 · 修复 commit `0e1f165` · 零越权 |
