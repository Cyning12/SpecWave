# Invoke：10（task 起草）· 3-0-w7-tty-color-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-w7-tty-color-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w7_tty_color_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |

## 指令摘要（委派 Prompt）

00 委派（维护者本机 TTY 发布链 `prepublishOnly` 稳定红 · bugfix 双轨跳 SPEC · task 结构照 done/`task_3_0_w7_ci_hotfix` 精简 · mini）：起草 TTY 色彩假红 hotfix task —— ① 缺陷真值写入背景节（`FORCE_COLOR=1` 下 `test/scan-human-gates-baseline.test.ts:64` `includes('文件数: 0')` 假 · 发布阻断）；② 根因（数字实参 `util.inspect` 着色 + `runCli` stdout/stderr 拼接被 stderr 警告污染）；③ 影响面（`FORCE_COLOR=1` 全量恰 2 测 · 其余绿）；④ 两处 spawn 面（`runScanner` 省略 env 默认继承 · `runCli` `env: {...process.env}`）；⑤ 范围唯一（新 helper `plain-env.ts` + 两处 spawn 改 `plainEnv()` + 回归锁三连 + 同族 grep 登记）；⑥ 验收（`FORCE_COLOR=1 npm test` 0 fail 为发布临门 + 普通 0 fail + 锁测红→绿 + 定向两测双环境 + typecheck/pins）；⑦ `### 人工闸` 双 approved 上行 · HG-TASK-DRAFT / HG-AUDIT-R1 均 pending；⑧ failure_paths F-TC-00–04；⑨ R0–R5 填全 · 基线实测。禁区：不实现代码（除起草）· 不改产品 `src/` · 不 tag/push/publish · 不 commit。

## 动作与独立复核证据（本帽实测）

- **三态隔离实测**（串行单跑 · 避免 `pack-hygiene` trap 文件互扰）：
  - 普通 `npm test` → **860 tests / 164 suites / 859 pass / 0 fail / 1 skip**（exit 0 · ≈64.5s）。
  - `FORCE_COLOR=1 npm test`（agent shell 亦带 `NO_COLOR=1`）→ **860 / 857 pass / 2 fail / 1 skip**（exit 1）· 红面 = `scan-human-gates-baseline.test.ts:52`（:64 断言）+ `cli-discipline-coverage.test.ts:81`（:85 `JSON.parse`）。
  - 真 TTY（`env -u NO_COLOR TERM=xterm-256color script -q /dev/null node --test …`）→ **1 fail** = 仅 scan（`cli-discipline` ③ 此态绿）。**补注**：2 fail 依赖 ambient `NO_COLOR=1`（B 机制）；真 TTY 仅 1 fail（A 机制）。
- **机制 A（数字实参着色）**：`scripts/scan-human-gates-baseline.mts:195` `console.log('文件数:', files.length, …)` 数字实参走 `util.inspect`；`FORCE_COLOR=1` 下 stdout = `文件数: \u001b[33m0\u001b[39m`。**注入来源探针实证**：`node --test` 在 `stdout.isTTY && TERM≠dumb` 时向测试文件子进程注入 `FORCE_COLOR=1`（pty+`TERM=xterm-256color` ⇒ `PROBE_FORCE_COLOR="1"`；`TERM=dumb`/管道 ⇒ `undefined`）。
- **机制 B（stderr 警告污染）**：`runCli` 返回 `stdout+'\n'+stderr`；`FORCE_COLOR=1` 与 `NO_COLOR=1` 并存时子进程 Node 向 stderr 打 `Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.` ⇒ 追加于 JSON 后 ⇒ `JSON.parse` 抛 `Unexpected non-whitespace character`。实测：`JSON.parse(stdout)` OK / `JSON.parse(stdout+'\n'+stderr)` 失败于 `position=stdout_len+1`。
- **`plainEnv()` 组合实测**：`FORCE_COLOR=0` + `NO_COLOR=1` ⇒ 子进程零 ANSI **且**零 stderr 互斥警告（修 A 与 B）。
- **同族 spawn 面快扫**：`grep -rn "env: { ...process.env }" test/` = **37 命中 / 32 文件**；真红仅 2 处（`runScanner` 隐式继承 + `cli-discipline` 显式继承）；其余断言面为 JSON/模板串/exit 码，FORCE_COLOR=1 全量实测绿；`test/_helpers/core-harness.ts:45-50`/`:51-59` `withCaptured` 以 `a.map(String)` 归一 ⇒ `runCore` 进程内套件免疫。
- **基线**：HEAD `fad0637` · tag `v3.0.0` 在 · `npm run typecheck` **0 错** · `node bin/specgate.js pins check` **17/17 PASS**。
- **结构/闸机检**：`task lint` **LINT: PASS**；起草时 `verify` = **BLOCKED · HG-TASK-DRAFT/HG-AUDIT-R1 双 pending · 拒 30**（正确态）。

## 关键交付与回执（00 授权落笔）

1. **task 落盘**：`docs/tasks/active/task_3_0_w7_tty_color_hotfix.md`（验收 6 条 / F-TC-00–04 / R0–R5 + 控制表 / 三态基线 + 双机制 + 同族登记）。
2. **HG-TASK-DRAFT 翻转**（00 回执授权 · 2026-09-17 代签）：`pending` → `approved` · 头部状态行 `draft` → `pending` · verify 回报（HG-AUDIT-R1 pending 拒 30 · 正确）。
3. **B1 闭合 + A1–A5 搭车**（00 裁定）：`plainEnv()` 钉**单一取值** `{ ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }`（删候选 a/b 与「30 定稿回填」）· 修复锁补子进程 env + stderr 零警告 · A1 计数 `860+N/859+N` · A2 同族 `37 命中/32 文件` · A3 grep `-rn` · A4 deprecate 去重 · A5 契约锁「ambient 任意组合下均确定」+ core-harness 行号核正 + 2 fail 前提补注。
4. **HG-AUDIT-R1 代签落笔**（00 裁定 · 2026-09-18 · 依据 R1 BLOCKED→B1 回填 + R2 PASS）：`pending` → `approved` ⇒ 双闸 approved · 30 可开工。
5. 本两件 invoke（10/00）代笔补落（00 裁定授权 · W1/W7「pre-30 三件套齐」先例 · 20 审 invoke 已由 20 帽自落）。

## 未做（禁区）

- 未实现代码（`test/` / `src/` / `scripts/` 一字未动 · 修复归 30）。
- 未自行签发任何闸（翻闸/代签均为 00 明确书面授权后落笔）。
- 未执行 git push / tag / publish / deprecate。
- 未裹挟工作区其他 untracked 档（逐文件显式 add · 禁 `add -A`）。

## 下一棒

30 实现棒：GATE_VERIFY 首输出（双闸 approved · VERIFY: PASS · pre-30 invoke 三件套齐）→ 按 task 范围唯一项执行（新增 `test/_helpers/plain-env.ts` 单值 · 两处 spawn 改 `plainEnv()` · 回归锁三连 · 同族登记）→ 验收 6 条全绿（**发布临门 = `FORCE_COLOR=1 npm test` 0 fail**；R2-A1：修复锁可观测性以 plainEnv 字段进程内断言 + spawn 探针等价满足；pty 双态复跑）→ 波末 `gate-check` exit 0。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 10-task 起草完成 + 实证（三态基线 / 机制 A pty 探针 / 机制 B JSON.parse / plainEnv 组合 / 同族 37-32 扫描 / typecheck 0 / pins 17/17）+ 双闸落笔（HG-TASK-DRAFT 2026-09-17 · HG-AUDIT-R1 2026-09-18 · 均 00 授权）+ B1/A1–A5 回填 · 00 授权后代笔补落本 invoke（pre-30 三件套之一） |
