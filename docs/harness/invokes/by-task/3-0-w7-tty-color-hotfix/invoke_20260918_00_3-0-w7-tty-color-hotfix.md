# Invoke：00（统筹）· 3-0-w7-tty-color-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-w7-tty-color-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w7_tty_color_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |
| 审查文 | `docs/harness/reviews/task_3_0_w7_tty_color_hotfix_audit_R1_20260918.md` · `docs/harness/reviews/task_3_0_w7_tty_color_hotfix_audit_R2_20260918.md` |

## 人授权（原文意图）

维护者本窗授权 00 代签后续过程文档闸（**授权真值（转录）：tag/push 代跑「授权」+ 过程文档闸代签模式**）；**发布四动作（tag / push / npm publish / npm deprecate）与 tag 决策仍归人 / 00**。本 task = TTY 色彩（`FORCE_COLOR`）发布链假红 hotfix（bugfix · 双轨跳独立 SPEC · mini）。**00 只委派不亲自实现**（harness-00-delegate-only 口径）。

## 闸扫描与代签依据

- 上游双闸：HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗 · 上行继承 · 落 task `### 人工闸` 表）
- HG-TASK-DRAFT=approved（**2026-09-17 00 代签** · 授权真值：维护者本窗授权 · task lint PASS）
- HG-AUDIT-R1=approved（**2026-09-18 00 代签** · 同授权 · 依据审查文 `task_3_0_w7_tty_color_hotfix_audit_R1_20260918.md`（R1 · **BLOCKED** · BLOCKING 1 = B1 · advisory 5）+ `…_audit_R2_20260918.md`（R2 · **PASS** · blocking 0 · advisory **R2-A1** · `can_sign: true`）；**R2-A1 带入 30**）
- ⇒ **双闸 approved · 30 可开工**（`verify --task` 预期 VERIFY: PASS）

## 派发链

10-task 起草（三态复现：普通 859 pass · `FORCE_COLOR=1` 2 fail · 真 TTY 1 fail · 机制 A pty 探针 + 机制 B `JSON.parse` 双复现 + 同族 37 命中/32 文件 · 见 10 invoke）→ **00 代签 HG-TASK-DRAFT（2026-09-17）** → 20-task-audit R1（**BLOCKED** · BLOCKING 1 B1「plainEnv 候选并列/30 回填」· advisory 5 · 见 R1 审查文与 20 invoke）→ 10-task B1 闭合 + A1–A5 回填 → 20-task-audit R2（**PASS** · B1 CLOSED · A1–A5 全忠实 · blocking 0 · advisory R2-A1 · 见 R2 审查文与 20 R2 invoke）→ **00 裁定：HG-AUDIT-R1 代签（2026-09-18）** → pre-30 invoke 三件套补落（10/20/00 齐 · W1/W7 先例）→ 30。

## 关键裁定

1. **双机制 A/B 分列裁定（采信 10-task 精度补正）**：**A** = `FORCE_COLOR=1` 下 `console.log('文件数:', <number>)` 数字实参经 `util.inspect` 着色（scan :64 断言假）；**B** = `runCli` 将 stdout+stderr 拼接，`FORCE_COLOR=1` ∧ `NO_COLOR=1` 并存时子进程 stderr 互斥警告污染 JSON（cli-discipline :85 `JSON.parse` 抛错）。两机制同族（FORCE_COLOR 泄漏进 spawn 子进程）· 同一修法覆盖。
2. **三态口径裁定**：**2 fail** 依赖 ambient `NO_COLOR=1`（agent shell 合成态 · FORCE_COLOR=1 全量）；**真 TTY（无 NO_COLOR）仅 1 fail**（scan）；普通非 TTY 全绿。task 背景「影响面」三态表为准。
3. **plainEnv 单一取值裁定（B1 闭合）**：`test/_helpers/plain-env.ts` `plainEnv()` **恒为** `{ ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }`（两键同置 ⇒ 零着色且**不触发** NO_COLOR/FORCE_COLOR 互斥警告）· **30 只验证不选型**（删候选 a/b 二择一与「30 两态实测定稿回填」）· `stripAnsi` 仅用于断言（F-TC-02）。
4. **R2-A1 带入 30**：修复锁 :95「断言**子进程** `NO_COLOR==='1' ∧ FORCE_COLOR==='0'`」的可观测性 —— 扫描器 stdout 不输出 env；30 可以「进程内断言 `plainEnv()` 字段（:96 契约锁）+ 另 spawn 探针」任一方式满足，二者等价（**非阻断**）。
5. **一笔 commit 授权（不 push）**：`docs(3.0-W7): TTY 色彩 hotfix task（双闸 approved）+ R1/R2 审查文 + invoke 三件套` —— task 文 + R1/R2 审查文 + `invokes/by-task/3-0-w7-tty-color-hotfix/` 全目录（10/20/00 + 20 R2）· 逐文件显式 add · 禁 `add -A` · **不 push 不 tag**（修复包 30 交付后由 00 呈维护者放行统一推）。
6. **禁区不变**：`test/` / `src/` 一字不动（修复归 30）· 本波只 task/审查/invoke 文档面。

## 未做（禁区）

- 未亲自实现代码（delegate-only）· 未动 `test/` / `src/` / `scripts/` 来源文件（修复归 30）。
- 未执行 push / tag / publish / deprecate（仅人 · tag 决策归 00 · commit 不 push）。
- 未裹挟工作区其他 untracked 档（逐文件显式 add · 禁 `add -A`）。

## 下一棒

30 实现棒：开工前 `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w7_tty_color_hotfix.md` 过 GATE_VERIFY（**双闸 approved · VERIFY: PASS** · pre-30 invoke 三件套齐）→ 范围唯一（`test/_helpers/plain-env.ts` 单值 + 两处 spawn 改 `plainEnv()` + 回归锁三连 + 同族登记）→ 验收 6 条（**#1 `FORCE_COLOR=1 npm test` 0 fail 发布临门** · #3 锁测红→绿 · #4 双环境 + pty 复跑 · R2-A1 等价满足）→ 波末 `gate-check` exit 0 → 00 呈维护者放行统一 push。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 00 统筹落档：双签承接 + 双闸代签依据（HG-TASK-DRAFT 2026-09-17 · HG-AUDIT-R1 2026-09-18 · 依据 R1 BLOCKED→B1 回填 + R2 PASS）+ 六裁定（A/B 双机制 / 三态口径 / plainEnv 单一取值 B1 / R2-A1 带入 30 / 一笔 commit 不 push / 禁区 test-src 不动）· 10-task 按 00 授权代笔补落本 invoke（pre-30 三件套之一） |
