# Invoke：20（task-audit R1）· 3-0-w7-tty-color-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w7-tty-color-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w7_tty_color_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |
| 审查文 | `docs/harness/reviews/task_3_0_w7_tty_color_hotfix_audit_R1_20260918.md` |
| 结论 | **BLOCKED**（BLOCKING 1 B1 · advisory 5 · 退回 10-task） |

## 指令摘要

对 3.0 W7 TTY 色彩确定性 hotfix task（测试侧 spawn env 钉死 `plainEnv()` + 两处 spawn 改接 + 回归锁三连；修因 = 维护者本机 TTY 发布链 `prepublishOnly` 稳定红于 `test/scan-human-gates-baseline.test.ts:64`）做 R1 书面审查：核对范围唯一性 / 非范围 / 验收 #1–#6 可执行性 / failure_paths F-TC-00–04 / R0–R5 / 闸表可机检 / 基线数字；逐条裁定 10-task 留下的三条重点（① 双机制 A/B 分列准确性；② 三态影响面口径；③ `plainEnv` 契约与回归锁设计 + 同族 37 spawn 面判定）。**禁止**改 task 实质、代签 HG-AUDIT-R1、改 `test/`/`src/`。审查文落盘 `docs/harness/reviews/`。

## 独立复核证据（本帽实测 · 未采信 task 转述）

- **三态基线全量复跑（全中）**：普通 `npm test` = **860 tests / 164 suites / 859 pass / 0 fail / 1 skip**（62.2s）· `FORCE_COLOR=1 npm test` = **860 / 164 / 857 pass / 2 fail / 1 skip**（红 = `scan-human-gates-baseline.test.ts:52` + `cli-discipline-coverage.test.ts:81`）· pty 全量 `env -u NO_COLOR TERM=xterm-256color script -q /dev/null npm test` = **860 / 164 / 858 pass / 1 fail / 1 skip**（唯一红 = scan）· 定向两测 FC=1 = 8/6 pass/2 fail · FC=0 = 8/8 pass/0 fail · pty 单测 scan = 3/2 pass/1 fail。
- **机制 A 独立复现**：`FORCE_COLOR=1 node -e "console.log('文件数:', 0)"` → stdout `文件数: \u001b[33m0\u001b[39m`；string 实参零注色。**注入源 = node --test（非 npm）**：pty+`TERM=xterm-256color` ⇒ 测试子进程 `PROBE_FORCE_COLOR="1"`，管道或 `TERM=dumb` ⇒ `undefined`。
- **机制 B 独立复现**：`FORCE_COLOR=1 NO_COLOR=1` ⇒ stderr 互斥警告；`FORCE_COLOR=0 NO_COLOR=1` ⇒ 空（警告仅在 FC 真值时触发）。子进程 `discipline show --json` stdout 完整 JSON，`JSON.parse(stdout)` OK · `JSON.parse(stdout+'\n'+stderr)` 失败于 position 17681（= stdout 长 + 1）。
- **plainEnv 取值矩阵（重点 3 判据）**：候选 (a) `{...env,FORCE_COLOR:'0'}` = 全态零 ANSI/零警告 ✓；**字面候选 (b) `{...env,NO_COLOR:'1'}`（不删 ambient FC）在 ambient FC=1 下 ANSI=true · WARN=true ✗**；候选 (b2) + `delete env.FORCE_COLOR` ✓；组合 `{...env,FORCE_COLOR:'0',NO_COLOR:'1'}` ✓。
- **结构闸**：`npx spec-wave task lint --file …` = **LINT: PASS** · `npx spec-wave verify --target . --task …` = **VERIFY: BLOCKED · HG-AUDIT-R1 pending · 拒 30**（exit 2）· `node bin/specgate.js pins check` = **17/17 PASS** · `npm run typecheck` = **0 错** · 同族 `env: { ...process.env }` = **37 命中 / 32 文件**（task :190 一致 · :194「35 处」不一致）· 引用行号快扫逐条属实（string 实参模板串免疫；`w6-lint-escape-rate.mjs` 无 test 引用）。
- **仓内零改动**：仅新增审查文 + 本 invoke；`git status --porcelain` 仍为 `?? docs/tasks/active/`（未改 task/test/src）。

## 三条重点结论

1. **双机制 A/B 分列：成立**。A（数字实参着色）与 B（stderr 警告污染 `JSON.parse`）因果链可分离（B 额外要求 `NO_COLOR=1`）· 注入源 node --test 探针实证 · 三态归因与实测逐条吻合。
2. **三态影响面口径：接受**。三态全量复跑全中；`FORCE_COLOR=1` 为 A+B 合成超集、真 TTY 为仅 A；**TTY 探针已在验收 #4 保留**（BSD `script` 语法本帽验证可用）⇒ 不要求收敛单一口径或补探针。前提（2 fail 依赖 ambient `NO_COLOR=1`）task 已注明。
3. **plainEnv 契约与回归锁：不充分 · 阻断（B1）**。:82 片段/默认候选 (a) 与 :127/:97/:219 硬编码组合冲突（契约锁 `NO_COLOR==='1'` 会让候选 (a) 必红）；字面候选 (b) 在真实 ambient FC=1 下不达「零 ANSI ∧ 零警告」。**建议钉单一取值**（推荐组合 `FORCE_COLOR:'0'+NO_COLOR:'1'`）并删「二择一/30 定稿回填」。同族 37 面判定**可接受**（全量 FC=1 2 红 + 全量 pty 1 红双向兜底）。

## 结论

**BLOCKED —— 内容阻塞 1（B1 · plainEnv() 取值契约自相矛盾 + 字面候选 (b) 不达零警告）· advisory 5**。范围唯一 / 非范围清晰 / failure_paths F-TC-00–04 闭合 / R0–R5 填全 / 闸表可机检 / **基线数字全中**；重点 1 成立 · 重点 2 接受 · 重点 3 阻断。**advisory 5**：A1 验收 #1 缺 +N 数字口径 · A2 同族计数 37/32 vs「35 处」不一致 · A3 范围 #2 `grep -n` 缺 -r · A4 非范围表重复 `npm deprecate` · A5 文案/行号精度（契约锁「与 process.env 无关」措辞 · core-harness 行号 · 2 fail 前提点明）。均非阻断，建议随 B1 一并回填。

**下一棒**：**10-task 回填 B1（+A1–A5）** → task lint PASS → **20 R2 复审**。（因阻断，**未附 30 Prompt**。）

**流程闸**：HG-TASK-DRAFT = approved（00 代签）· **HG-AUDIT-R1 维持 pending** · 本帽**不代签** · 30 以 task 表为准（pending 拒开工）。审查文：`docs/harness/reviews/task_3_0_w7_tty_color_hotfix_audit_R1_20260918.md`。

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归维护者 / 00 代签）
- ⛔ 未改 task 实质 / 未改 `test/`/`src/`/`scripts/` / 未签任何闸
- ⛔ S2 只新增：本 invoke + 审查文（未覆写历史 reviews / invoke）
- 有内容阻塞（B1）⇒ **未附 30 Prompt**，仅出回填清单 + 签闸注意（本轮不可签）

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 20-task-audit R1 审查完成 · 总结论 **BLOCKED**（BLOCKING 1 B1 · advisory 5）· 三重点：A/B 成立 · 三态接受 · plainEnv 契约阻断 · 独立复跑全中（普通 860/164/859/0/1 · FC=1 860/857/2/1 · 全量 pty 860/858/1 · pins 17/17 · typecheck 0 · lint PASS · verify BLOCKED）· 不代签 HG-AUDIT-R1 · 下一棒 10-task 回填 |
