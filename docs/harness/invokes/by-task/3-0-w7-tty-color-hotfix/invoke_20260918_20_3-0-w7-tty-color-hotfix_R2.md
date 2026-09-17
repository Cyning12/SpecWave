# Invoke：20（task-audit R2 · B1 闭合复核）· 3-0-w7-tty-color-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w7-tty-color-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w7_tty_color_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |
| 前置审查文 | `docs/harness/reviews/task_3_0_w7_tty_color_hotfix_audit_R1_20260918.md`（R1 · BLOCKED · B1） |
| 本轮审查文 | `docs/harness/reviews/task_3_0_w7_tty_color_hotfix_audit_R2_20260918.md` |
| 结论 | **PASS**（B1 CLOSED · A1–A5 忠实 · blocking 0 · advisory 1 · 可签） |

## 指令摘要

对 B1 + A1–A5 回填后的 task 做 **R2 闭合复核**：核 B1 是否闭合（契约/片段/两把锁/范围/R2 六处一致 · 无「二择一 · 30 定稿回填」残留）· A1–A5 落点忠实性 · 抽跑 `task lint`。按 00 指令**不复跑全量**（R1 基线已实测；本轮仅 task 文档变更）。**禁止**改 task、代签 HG-AUDIT-R1。R2 审查文 + 本 invoke 落盘 S2。

## 独立复核证据（本帽实测）

- **B1 单一取值六处一致**：片段 :81 = 契约 :88 = 修复锁 :95 = 契约锁 :96 = 范围 #1 :126 = R2 :218，均为 `{ ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }`；契约句「30 只验证不选型（无候选并列 · 无回填项）」。
- **残留扫描**（`候选｜二择一｜二选一｜定稿｜回填`）：4 命中均非缺陷 = :27 守卫面候选 · :88 否定句 · :265 自检槽 · :281 修订记录史实。
- **A1** :165 `860+N / 859+N`；**A2** :193 `37 命中/32 文件 · 非红 36 处/31 文件`；**A3** :91/:128/:189 `grep -rn`；**A4** :104/:140 单次 `npm deprecate`；**A5** :96「ambient 任意组合下均确定」· :179 core-harness `:45-50/:51-59`（实读吻合）· :61 补注「2 fail 依赖 ambient NO_COLOR=1；真 TTY 仅 1 fail」。
- **流程闸**：`npx spec-wave task lint --file …` = **LINT: PASS**（exit 0）· `npx spec-wave verify --target . --task …` = **VERIFY: BLOCKED · HG-AUDIT-R1 pending · 拒 30**（exit 2 · 闸表未变）。
- **仓内零改动**：git status 仅 R1/R2 S2 新增 + `docs/tasks/active/` untracked；`test/`/`src/` 零 tracked 改动。
- **未复跑全量**（按 00 指令）：R1 基线 2026-09-18 实测继续有效（普通 860/164/859/0/1 · FC=1 860/857/2/1 · pty 全量 860/858/1 · pins 17/17 · typecheck 0）。

## 结论

**PASS —— B1 闭合 · A1–A5 忠实落点 · blocking 0 · advisory 1（非阻断）· 可签。** 单一取值六处一致、无「二择一」残留；task lint PASS；闸表不变（HG-AUDIT-R1 pending，**本帽不代签**）。**advisory R2-A1**（非阻断）：修复锁 :95「断言子进程 `NO_COLOR='1'/FORCE_COLOR='0'`」的可观测性可由「进程内断言 `plainEnv()` 字段（:96 契约锁）+ 另 spawn 探针」任一满足。

**带入 30（00 指定）**：① 修复 commit 后以**最终 commit 新鲜 clone** 复跑；② **pty 双态复跑**（`env -u NO_COLOR TERM=xterm-256color script -q /dev/null …`）0 fail；③ S2 基线以最终 commit 克隆实测为准。

**下一棒**：00 代签 **HG-AUDIT-R1 = approved** → 30（GATE_VERIFY PASS 后开工）。R2 通过 ⇒ **可签**。

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 / 维护者）
- ⛔ 未改 task 实质 / 未改 `test/`/`src/` / 未签任何闸
- ⛔ S2 只新增：R2 审查文 + 本 invoke（未覆写 R1 审查文 / R1 invoke）

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 20-task-audit R2 闭合复核 · 结论 **PASS**（B1 CLOSED · A1–A5 忠实 · blocking 0 · advisory 1）· task lint PASS · verify 仍 BLOCKED（HG-AUDIT-R1 pending）· 不代签 · 明确可签 |
