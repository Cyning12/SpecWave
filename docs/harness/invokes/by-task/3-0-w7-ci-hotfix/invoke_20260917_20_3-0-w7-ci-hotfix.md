# Invoke：20（task-audit R1）· 3-0-w7-ci-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w7-ci-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w7_ci_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |
| 审查文 | `docs/harness/reviews/task_3_0_w7_ci_hotfix_audit_R1_20260917.md` |

## 指令摘要

对 3.0 W7 CI hotfix task（`scripts/check-doc-links.mjs` (i) 存在性判据由**文件系统存在性**改为**入库状态** + tracked 集合原样读取 + 冻结基线 23→34 + `S2_PARAM_EXCLUDE` 防自咬 + test 正向值/新环境无关 fixture/(ii) fixture 入库化 + `ACCEPTANCE` 三处标注）做 R1 书面审查：核对范围唯一性 / 非范围 / 验收 #1–#6 可执行性 / failure_paths F-HOT2-00–08 / R0–R5 思考轮 / 闸表可机检 / 基线数字；逐条裁定 10-task 留下的三条重点（① 法定修法三件套机检锁死 + 字面单行式反例；② 环境无关 fixture 唯一硬证 + (ii) 分支 `git add`；③ 边界与防自咬）。**禁止**改 task 实质、代签 HG-AUDIT-R1、改 `scripts/`/`test/`/来源文件。审查文落盘 `docs/harness/reviews/`。

## 独立复核证据（本帽实测 · 未采信 task 转述）

- **发布阻断双跑复现**：本地 `node scripts/check-doc-links.mjs` → `非S2=0 · S2=23 / 基线 23 · exit 0`（假绿）；干净 clone `git clone -q . /tmp/ci-sim && git checkout v3.0.0 && node scripts/check-doc-links.mjs` → `非S2=0 · S2=34 / 基线 23 · exit 2`（真红）。S2 集合 diff：**clone−local = 11**（local−clone = 0），distinct target = 4（`.workbuddy/output/验收报告-SpecWave-2.2.0.md`×2 / `2.3.0`×3 / `2.4.0`×3 / `2.4.1`×3）。
- **CI 真值**：`gh run view` → run `35245272523` / `35245273138` 均 `conclusion=failure · event=push · headSha=3d1b9d38…` · `workflowName=ci` · failure job = `test (22.x)` / `test (24.x)`；`--log-failed` 逐字命中 `not ok 1` + `DOC LINKS (i) 非S2 = 0 · S2 = 34 / 冻结基线 23`（`test/check-doc-links.test.ts:35`）。
- **基线全量复跑**：`npm test` **859 tests / 164 suites / 858 pass / 0 fail / 1 skip**（61.97s）· `npm run typecheck` **0 错（exit 0）** · `node bin/specgate.js pins check` **17/17 PASS · exit 0**（pin-10 = tag `v3.0.0`）· HEAD `3d1b9d3` · 注解 tag `v3.0.0` → commit `3d1b9d3` = HEAD · 工作区 clean + `?? docs/tasks/active/`（唯一 untracked = 本 task 起草件）。
- **三组对照实验独立复现**（`/private/tmp` 探针副本 · 仓内零改动 · 本地/clone 双跑）：A 字面最小式 `inRepo ? gitTracked.has(rel) : existsSync(abs)` → S2 42/42 · **非 S2(i) 48**（全目录链）；B +目录前缀 `trackedDirs.has(rel)` → S2 34/34 · **非 S2(i) 1**（`../../guides/DOGFOOD_host_adapt_cursor_claude_录屏清单_v1_zh.md` · 默认 `git ls-files` 八进制转义）；**C 法定（+`-c core.quotepath=false ls-files -z` 原样读取）→ S2 34/34 · 非 S2(i) 0 · 双端 S2 集合逐条 IDENTICAL**。
- **环境无关 fixture 复现**：临时 root `git init` + `.gitignore .workbuddy/` + 实体 `.workbuddy/x.md` + S2 md 引用 → pre-fix `S2=0`（`--s2-baseline 0` exit 0 掩盖）；post-fix `S2=1`（`--s2-baseline 1` exit 0 · `--s2-baseline 0` exit 2）。(ii) 复绿分支：post-fix 无 `git add` → **转红 exit 2**；`git init + git add docs/roadmap/tracked.md` → **复绿 exit 0**。
- **文档/结构核对**：`ACCEPTANCE_3_0_architecture_leap_3_0_0_zh.md` 三处 23 命中 **:35 / :45 / :62**；`w7_release_probe_3_0_0_20260917.md` grep `23` = **NONE**（零改动口径成立）；`S2_PARAM_EXCLUDE` 现路径 `docs/tasks/active/task_3_0_w7_closeout_external.md` **active 缺 / done 在**（归档失效属实）；`docs/coding_wiki/` 不存在 · `docs/_tech_graph/` 存在；`scripts/` 内 FS 判据快扫行号逐条命中（唯 `check-doc-links.mjs:96` 真红面）。
- **闸机检**：`npx spec-wave task lint --file docs/tasks/active/task_3_0_w7_ci_hotfix.md` = **LINT: PASS**；`npx spec-wave verify --target . --task …` = **VERIFY: BLOCKED · HG-AUDIT-R1 pending · ❌ 拒 30**（`HG-TASK-DRAFT approved` 不拦 · `HG-NEXT-PLAN/HG-SPEC-SIGNOFF blocks=—` 不渲染）。

## 结论

**PASS-with-issues —— 内容审查零阻塞（BLOCKING 0 · advisory 6）**。范围唯一 / 非范围清晰 / 验收 #1–#6 全可执行 / failure_paths F-HOT2-00–08 闭合 / R0–R5 填全且充分 / 闸表可机检 / 基线数字全中。三条重点**均裁定成立**：① 法定修法三件套（仓外 `existsSync` / 目录前缀 / `-z` 原样读取）被 failure_paths + 验收 #2 机检锁死，字面单行式显式列为反例（独立复现 48/1/0）；② 环境无关 fixture 设计成立（pre `S2=0` / post `S2=1`，(ii) 分支须 `git add` 否则转红）；③ 边界与防自咬成立（S2 只新增 · 禁掩盖 · 排除参数防自咬 · tag 归 00 · git 不可诊断性只登记不裹挟）。**advisory 6**：A1 clone 语义需 commit 后执行 · A2 排除面未覆盖审查文/invoke · A3 两条回归面仅真实仓锁（无隔离 fixture）· A4 R5 文案 stale（双 pending）· A5 行文小疵（tagged-based / F-HOT2-06 引用）· A6 验收计数口径（task 实为 6 条 · F-HOT2-00–08）。均非阻断。

**流程闸**：HG-TASK-DRAFT = approved（00 代签）· **HG-AUDIT-R1 维持 pending** · 本帽**不代签** · 30 以 task 表为准（pending 拒开工）。审查文：`docs/harness/reviews/task_3_0_w7_ci_hotfix_audit_R1_20260917.md`。

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归维护者 / 00 代签）
- ⛔ 未改 task 实质 / 未改 `scripts/check-doc-links.mjs` / `test/check-doc-links.test.ts` / 其他来源文件 / 未签任何闸
- ⛔ S2 只新增：本 invoke + 审查文（未覆写历史 reviews / probe / ACCEPTANCE）
- 无内容阻塞但 HG-AUDIT-R1 仍 pending ⇒ **未附 30 Prompt**，仅出维护者签闸清单

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 20-task-audit R1 审查完成 · 总结论 PASS-with-issues（BLOCKING 0 · advisory 6）· 三条重点均成立 · 独立复跑全中 · 不代签 HG-AUDIT-R1 |
