# Invoke：40（review-of-work）· 3-0-w7-tty-color-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 40-review-of-work |
| task_slug | `3-0-w7-tty-color-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w7_tty_color_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |
| 复核对象 | `3ceb42c`（hotfix task + R1/R2 审查文 + invoke 三件套）→ `0e1f165`（helper `plain-env.ts` + `plain-env.test.ts` + 两处 spawn 改 `plainEnv`）→ `62b0811`（30 invoke + task 自检回填 · HEAD） |
| 复核结论 | **PASS**（blocking 0 · advisory 4）· 下一棒 00 放行 → 维护者 push（发布四动作仅人） |

## 复核范围与方式

独立复核 30 交付的发布阻断面修复（TTY 发布链假红 hotfix：新 helper `test/_helpers/plain-env.ts` + 两处 spawn 钉死 `plainEnv()` + 回归锁三连 `test/plain-env.test.ts`）。

**不接受「30 说绿」**：平台锁全部独立复跑；三态双态（普通 / `FORCE_COLOR=1` / pty 真 TTY）逐命令自跑；干净 clone 按指令逐字执行 `git clone -q . /tmp/tc-sim40`（clone 后补 `npm ci` 装依赖，见 advisory A1）；回归锁三连以 40 自建 temp 树直接调用 scanner 复现机制 A/B 与 `plainEnv()` 中和面；修前对照在同一 clone `git checkout 3ceb42c` 复现真红（2 fail / pty 1 fail）。temp 件全落 `/private/tmp` 与 `/tmp`，已清；工作树净复核在案。

**本轮只读复核 · 未改 `test/` / `src/` / `scripts/` / task 实质内容 · 未代签任何闸 · 未 tag / push / publish / deprecate。**

## 独立实测证据（40 本棒自跑）

### 平台锁复跑（本仓根 · HEAD `62b0811`）

| 项 | 实测 | 预期 | 判 |
|----|------|------|----|
| `npm test`（普通 · 非 TTY） | **864 tests / 165 suites / 863 pass / 0 fail / 1 skip** · exit 0（62.0s） | 864/165/863/0/1 | ✓ 逐字 |
| `FORCE_COLOR=1 npm test`（发布临门） | **864 / 165 / 863 pass / 0 fail / 1 skip** · exit 0（60.3s） | 864/165/863/0/1 | ✓ 逐字 |
| `npm run typecheck` | **0 错** · exit 0 | 0 错 | ✓ |
| `npm run build` | exit 0 | 0 错 | ✓ |
| `npm run test:lib` | **6 tests / 6 pass / 0 fail** · exit 0 | 6/6 | ✓ |
| `node bin/specgate.js pins check` | **PINS: PASS · 17/17 落点一致** · exit 0 | 17/17 | ✓ |
| `node bin/specgate.js assets verify` | **ASSETS: PASS · 113/113 文件一致** · exit 0 | 113/113 | ✓ |
| `node scripts/check-terminology.mjs` | **TERMINOLOGY: PASS**（canonical 5/5 · 判红面 门控 残留 0） · exit 0 | PASS | ✓ |
| `node scripts/check-claims.mjs` | **CLAIMS: PASS**（7 文件 · forbidden 命中 0） · exit 0 | PASS | ✓ |
| `node scripts/check-doc-links.mjs` | **DOC LINKS: PASS**（非S2(i)=0 非S2(ii)=0 · S2 冻结基线 34/34） · exit 0 | PASS | ✓ |
| `node bin/specgate.js verify --target . --task <本 task>` | HG-TASK-DRAFT approved + HG-AUDIT-R1 approved · **VERIFY: PASS** · exit 0 | PASS | ✓ |
| `npx spec-wave task lint --file <本 task>` | **LINT: PASS** · exit 0 | PASS | ✓ |
| 依赖 | package.json / package-lock.json 零改动 · 零新增 | 零新增 | ✓ |

### pty 真 TTY 双态（`env -u NO_COLOR TERM=xterm-256color script -q /dev/null …`）

| 项 | 实测 | 预期 | 判 |
|----|------|------|----|
| pty 定向 2 文件（scan + cli-discipline · 父命令逐字） | **8 tests / 2 suites / 8 pass / 0 fail** · exit 0 | 0 fail | ✓ |
| pty FC=0 定向 2 文件 | **8 / 2 / 8 pass / 0 fail** · exit 0 | 0 fail | ✓ |
| pty 定向 3 文件（含 plain-env） | **12 / 3 / 12 pass / 0 fail** · exit 0 | 0 fail | ✓ |
| **pty 全量 `npm test`**（维护者发布链 TTY 态） | **864 / 165 / 863 pass / 0 fail / 1 skip** · exit 0 | 0 fail | ✓（修前 pty 全量 1 fail） |

### 定向 3 文件 FC=0 / FC=1（scan + cli-discipline + plain-env）

```text
FORCE_COLOR=0 node --test --experimental-strip-types <3 files>  → 12 tests / 3 suites / 12 pass / 0 fail · exit 0
FORCE_COLOR=1 node --test --experimental-strip-types <3 files>  → 12 tests / 3 suites / 12 pass / 0 fail · exit 0
```

### 回归锁三连独立验证（40 自建 temp 树直调 scanner · 不采信锁测自证）

```text
PROBE 1 现象锁（A 机制 · FORCE_COLOR=1 且 NO_COLOR unset）
  stdout 原始字节(od)：文 件 数 :  033 [ 3 3 m 0 033 [ 3 9 m  → has_ANSI=YES
  stripAnsi(stdout).includes('文件数: 0') → YES   （着色真发生且可还原）
PROBE 2 修复锁（plainEnv 组合 FORCE_COLOR=0 + NO_COLOR=1）
  has_ANSI=NO · has_target('文件数: 0')=YES · stderr_bytes=0
PROBE 3 B 机制（FORCE_COLOR=1 + NO_COLOR=1）
  stderr 互斥警告=YES · stderr_bytes=164
PROBE 4 契约锁（真实 helper import · ambient 7 组合）
  ambient[] / [FC=1] / [NC=1] / [FC=1,NC=1] / [FC=0] / [FC=2] / [FC=true]
    → 恒 {"FC":"0","NC":"1"} · stripAnsi('a\u001b[33m0\u001b[39m')='a0'
```

⇒ 契约锁（恒两键 · 任意 ambient 组合确定）· 现象锁（FC=1 注入含 ANSI + stripAnsi 还原目标串）· 修复锁（plainEnv spawn 零 ANSI + 含目标 + stderr 零互斥警告 + 探针子进程 env 两键）**三条独立成立**；修复锁不依赖 `stripAnsi`（F-TC-02 满足）。`test/plain-env.test.ts` 4/4 在 FC=0 与 FC=1 下均绿。

### 干净 clone 复跑（核心 · `git clone -q . /tmp/tc-sim40`）

```text
$ rm -rf /tmp/tc-sim40 && git clone -q . /tmp/tc-sim40 && cd /tmp/tc-sim40 && npm ci
CLONE_HEAD = 62b0811928217944a17d9128870352b8eb35075b（= 最终 HEAD）· NPM_CI=OK
$ npm test                → 864 / 165 / 863 pass / 0 fail / 1 skip · exit 0
$ FORCE_COLOR=1 npm test  → 864 / 165 / 863 pass / 0 fail / 1 skip · exit 0
$ pty 2 文件              → 8 / 2 / 8 pass / 0 fail · exit 0
$ pty 3 文件              → 12 / 3 / 12 pass / 0 fail · exit 0
```

### 修前对照（同一 clone `git checkout 3ceb42c` · 独立复现真红）

```text
$ FORCE_COLOR=1 node --test <scan + cli-discipline>  → 8 tests / 6 pass / 2 fail · exit 1
    ✖ scan-human-gates-baseline（:66 · A 机制数字实参着色）
    ✖ cli-discipline-coverage（:85 · B 机制 stderr 警告污染 JSON.parse）
$ pty 2 文件                                         → 8 / 7 pass / 1 fail · exit 1（仅 scan · A）
$ 普通 2 文件                                       → 8 / 8 pass / 0 fail · exit 0（非 TTY 不触发）
  （复跑后已 checkout 回 62b0811）
```

⇒ 修前真红 / 修后真绿 **因果链独立成立**：TTY 发布链（pty 全量）由 1 fail → 0 fail；`FORCE_COLOR=1` 全量由 2 fail → 0 fail。

### 同族面核正

| 项 | 实测 |
|----|------|
| `grep -rn "env: { ...process.env }" test/` | 修后 **36 命中 / 31 文件**（修前 37/32 · 唯一真红 B 已改） |
| `文件数: 0` 断言面 | 真红 A 仅 `test/scan-human-gates-baseline.test.ts:66` 一处 + 锁测 `test/plain-env.test.ts` |
| helper 收集面 | `test/_helpers/plain-env.ts` 不匹配 `test/*.test.ts` glob ⇒ 不入套件（仅被 2 spawn + 锁测 import） |
| `plainEnv()` 落点 | `runScanner`（scan :48 `env: plainEnv()`）· `runCli`（cli-discipline :47 `env: plainEnv()`）· 各 1 处 |

### 产品面零改动与 commit 卫生

| 项 | 实测 |
|----|------|
| `git diff 3ceb42c..HEAD --stat` | 仅 `test/`（4 文件）+ `docs/`（2 文件）· **`src/` / `scripts/` / `package.json` / `bin/` / `assets/` 零改动** |
| 逐笔 scope | `3ceb42c` = 7 docs（task + R1/R2 + 00/10/20 invoke）· `0e1f165` = 4 test（helper + 锁测 + 两 spawn）· `62b0811` = 2 docs（30 invoke + task 自检）· 无裹挟面 |
| `git status --porcelain` | **空**（工作树净 · `lib/` 为 ignored 构建产物不影响） |
| push | `main...origin/main [ahead 3]`（三笔未推） |
| tag | `v3.0.0`（annotated tag 对象 `1a4d641`）peel = **`fad0637`**（**未移动 · 未触碰**） |
| 禁区 | 未 `git add -A`（逐文件显式 add）· 未 tag / push / publish / deprecate |

## 发现清单

- **blocking：0** —— 平台锁独立复跑全绿且逐字；发布临门 `FORCE_COLOR=1 npm test` 864/165/863/0/1；pty 全量 0 fail；干净 clone 双态 + pty 全绿；修前真红 2 fail/pty 1 fail 独立复现；回归锁三连独立成立；产品面零改动；工作树净 · 未 push / 未 tag。
- **advisory：4**（非阻断）
  - **A1（40 新增 · 复跑口径留档）**：新鲜 clone 无 `node_modules`，`npm test` 前须先装依赖（40 实跑 `npm ci` 后双态方绿）；30 invoke 的「新鲜 clone 复跑」块只记 `git clone` + `npm test`，未记安装步。建议后续 clone 复跑留档补 `npm ci`（复现口径完备性 · 非代码问题）。
  - **A2（40 新增 · commit 约定偏差）**：修复 commit `0e1f165` 用前缀 `fix(3.0-W7):`，task「提交信息约定」建议式为 `test(3.0-W7-hotfix): …`。scope 正确、内容吻合，仅前缀/scope 标签偏差，不影响验收。
  - **A3（40 观察 · 修复锁 stderr 判据）**：修复锁断言「stderr 不含 `NO_COLOR`/`FORCE_COLOR` 互斥警告」而非「stderr 为空」（30 偏差登记 ③）。40 实测 `plainEnv()` 下 scanner stderr = **0 bytes** ⇒ 语义等价成立；仅提示未来 Node 引入的无关告警不会被锁捕获。非阻断。
  - **A4（40 观察 · 顶层警告）**：`FORCE_COLOR=1` / pty 全量运行顶层 `node --test` 自身会打印一次 `NO_COLOR`/`FORCE_COLOR` 互斥警告（agent shell ambient `NO_COLOR=1` · 见 `--trace-warnings` 提示），**不影响测试结果**（0 fail）。环境性观察 · 非缺陷。

## 结论

**PASS**（blocking 0 · advisory 4）。

- **双态数字**：普通 `npm test` **864 / 165 / 863 pass / 0 fail / 1 skip** · `FORCE_COLOR=1 npm test` **864 / 165 / 863 pass / 0 fail / 1 skip**（均 exit 0）。
- **pty 数字**：定向 2 文件 **8/8/0** · FC=0 **8/8/0** · 3 文件 **12/12/0** · **全量 864/165/863/0/1**（修前全量 1 fail）。
- **clone 复跑**：`/tmp/tc-sim40` @ 最终 HEAD `62b0811` → 普通与 FC=1 双态 **864/165/863/0/1** · pty 2 文件 8/8/0 · pty 3 文件 12/12/0。
- **回归锁验证**：契约锁（恒 `FC=0 ∧ NC=1` · 7 ambient 组合）· 现象锁（FC=1 含 ANSI + `stripAnsi` 还原「文件数: 0」）· 修复锁（`plainEnv` 零 ANSI + 含目标 + stderr 0 互斥警告 + 探针 env 两键）三连独立成立。
- **回归锁三连·修前对照**：`3ceb42c` clone FC=1 **2 fail**（:66 A + :85 B）· pty **1 fail**（A）· 普通 0 fail。
- **卫生**：`git diff 3ceb42c..HEAD` 仅 test/ + docs/ · 工作树净 · **未 push / 未 tag（`v3.0.0` peel = `fad0637`）**。

## 未做（禁区）

未改 `test/` / `src/` / `scripts/` / task 实质内容 · 未代签任何闸（HG-AUDIT-R1 等以 task 表真值为准）· **未 tag / push / publish / deprecate** · 未删/移 tag。本棒唯一写面 = 本 invoke（S2 只新增 · 单文件显式 add · 不 push）。

## 下一棒

00 放行 → 维护者 push 三笔（`3ceb42c` → `0e1f165` → `62b0811`）→ 复核 CI workflow（`test (22.x)/(24.x)` + `tech-graph`）转绿 → 30 `task close` 归档。**发布四动作仍仅人**。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 40 review-of-work 复核完成：独立复跑平台锁全绿（864/165/863/0/1 双态 · typecheck 0 · build 0 · test:lib 6/6 · pins 17/17 · assets 113/113 · terminology/claims/doc-links PASS · verify/task lint PASS）· pty 定向与全量均 0 fail · 干净 clone `62b0811` 双态 + pty 全绿 · 修前 `3ceb42c` 真红（FC=1 2 fail / pty 1 fail）· 回归锁三连独立验证 · 产品面零改动 · 工作树净 · 未 push / 未 tag（`v3.0.0` 未触碰）· 总结论 **PASS（blocking 0 · advisory 4）** |
