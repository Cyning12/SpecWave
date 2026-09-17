# Invoke：10（task 起草）· 3-0-w7-ci-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-w7-ci-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w7_ci_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要（委派 Prompt）

00 委派（tag `v3.0.0`（`3d1b9d3`）+ main 双 CI run 35245272523 / 35245273138 红 · 缺陷真值已查实 · bugfix 双轨跳 SPEC · task 结构照 done/task_3_0_w1_ci_hotfix 精简 · mini）：起草文档链接机检 CI hotfix task —— ① 缺陷真值写入背景节（`test/check-doc-links.test.ts:35` 正向测红 · `S2(i)=34 ≠ 基线 23` · 本地绿 23 / 干净 clone 34）；② 根因 `scripts/check-doc-links.mjs:96` `existsSync` 判「可解析 (i)」为文件系统状态，本机 `.workbuddy/` 实体在致少计 11（硬约束 10 同族）；③ 修法（已定）判据改**入库状态**（`inRepo ? gitTracked.has(targetRel) : existsSync(targetAbs)` · 环境无关 · 与 level (ii) 同真值源）· 基线按修后实测重建（预期 34）；④ 范围：checker 判据 + 头注释 / test 正向基线更新 + 新增环境无关性负向 fixture / 基线-文档同步（探针 + ACCEPTANCE 若引用 23 → 标注级更新·逐处登记）/ 模拟 CI 实证（`git clone .` 干净 clone PASS · 修前真红 34 对照）；⑤ 验收 5 条（修后 clone PASS · 本地 PASS 同值 34 · 环境无关 fixture 红 · 全量 npm test 全绿 · typecheck/pins 17/17）+ `### 人工闸`（HG-NEXT-PLAN/HG-SPEC-SIGNOFF=approved 上行 · HG-TASK-DRAFT pending 20,30 · HG-AUDIT-R1 pending 30）；⑥ failure_paths F-HOT2-01（基线重建后仍与 CI 不一致 → STOP）/ F-HOT2-02（tracked-based 误伤仓外/生成物 → 仓外 existsSync）/ F-HOT2-03（tag 移动争议 → 不在范围 · 归 00）· R0–R5 填全 · 基线实测。禁区：不实现代码（除起草）· 不改 `src/` 产品面 · 不 tag/push/publish · 不 commit。

## 动作与独立复核证据（本帽实测）

- **CI 真值复核**（`gh`）：run `35245272523` / `35245273138` 均 `conclusion=failure` · `headSha=3d1b9d38…`（= tag `v3.0.0`）· `event=push` · `workflow=ci`；`test (22.x)` / `test (24.x)` 双 job failure，`audit` / `secrets-scan` success；`--log-failed` 逐字命中 `DOC LINKS (i) 非S2 = 0 · S2 = 34 / 冻结基线 23` + `not ok 1`（唯一失败测 = `test/check-doc-links.test.ts:35` · 同文件其余 3 fixture 绿）。
- **发布阻断复现**（修前）：本地 `node scripts/check-doc-links.mjs` → `非S2=0 · S2=23 / 基线 23 · exit 0`（假绿）；干净 clone `git clone . /tmp/x && git checkout v3.0.0 && node scripts/check-doc-links.mjs` → `非S2=0 · S2=34 / 基线 23 · exit 2`（真红）。S2 集合 diff：clone−local = **11**，全为 `.workbuddy/output/验收报告-SpecWave-2.2.0/2.3.0/2.4.0/2.4.1.md`（4 distinct target）。
- **三组对照实验（法定位）**（`/private/tmp` 探针副本 · 仓内零改动 · 本地/clone 双跑）：A 父派单字面最小式 `inRepo ? gitTracked.has(rel) : existsSync(abs)` → S2 42/42 · **非 S2(i) 48**（全目录链）；B +目录前缀 `trackedDirs.has(rel)` → S2 34/34 · **非 S2(i) 1**（`../../guides/DOGFOOD_host_adapt_cursor_claude_录屏清单_v1_zh.md` · 默认 `git ls-files` 八进制转义）；**C 法定（+`-c core.quotepath=false ls-files -z` 原样读取）→ S2 34/34 · 非 S2(i) 0 · 双端 S2 集合逐条 IDENTICAL**。⇒ 字面单行式证伪 · 法定修法三件套（仓外 existsSync / tracked 目录前缀 / `-z` 原样读取）缺一即回归。
- **环境无关 fixture 预演**：临时 root `git init` + `.gitignore .workbuddy/` + 实体 `.workbuddy/x.md` + S2 md 引用 → pre-fix `S2=0`（`--s2-baseline 0` exit 0 掩盖）；post-fix `S2=1`（`--s2-baseline 1` exit 0 · `--s2-baseline 0` exit 2）。既有 (ii) fixture 复绿分支：post-fix 无 `git add` → 转红 exit 2；`git init + git add docs/roadmap/tracked.md` → 复绿 exit 0 ⇒ 范围 2③ 修改正确且必需。
- **基线复跑**：`npm test` **859 tests / 164 suites / 858 pass / 0 fail / 1 skip**（≈62s）· `npm run typecheck` **0 错** · `node bin/specgate.js pins check` **17/17 PASS**（pin-10 = tag `v3.0.0`）· HEAD `3d1b9d3` · 注解 tag `v3.0.0` → commit `3d1b9d3`。
- **文档同步核对**：`ACCEPTANCE_3_0_architecture_leap_3_0_0_zh.md` 三处 23 命中 `:35 / :45 / :62`；`w7_release_probe_3_0_0_20260917.md` grep 零引用 23（零改动 · S2 只新增不覆写）。
- **同类面快扫**：`scripts/` 内以 FS 存在性充当可达性判据的**唯一真红面** = `check-doc-links.mjs:96`；已守卫/非本族面逐条列出；git 不可用不可诊断性登记为残余候选（硬约束 10 尚差一步 · 不裹挟）。
- **结构/闸机检**：`task lint` **LINT: PASS**；起草时 `verify` = `VERIFY: BLOCKED · HG-AUDIT-R1 pending · ❌ 拒 30`（起草件入 active/ 后 checker S2 仍 = 23 · 零新增坏链）。

## 关键交付与回执（00 授权落笔）

1. **task 落盘**：`docs/tasks/active/task_3_0_w7_ci_hotfix.md`（256 行 · 验收 6 条 / F-HOT2-00–08 / R0–R5 + 控制表 / 三组对照实验 + fixture 预演 + 基线节）。
2. **HG-TASK-DRAFT 翻转**（00 回执授权 · 2026-09-17）：`pending` → `approved`（00 代签 · 授权真值：维护者本窗授权（tag/push 代跑「授权」+ 过程文档闸代签模式）· task lint PASS）· 头部状态行同步（`draft` → `pending`）· verify 回报（HG-AUDIT-R1 pending 正确拒 30）。
3. **HG-AUDIT-R1 代签落笔**（00 裁定 · 2026-09-17）：`pending` → `approved` · 依据审查文 `docs/harness/reviews/task_3_0_w7_ci_hotfix_audit_R1_20260917.md`（R1 · PASS-with-issues · blocking 0 · advisory A1–A6）。
4. **搭车修**（20 审 advisory · 00 裁定）：A4 R5/控制行文案由「双 pending」同步双 approved · A5 F-HOT2-04 `tagged-based` → `tracked-based` · A6 验收 6 条 / F-HOT2-00–08 计数口径订正 · A1/A2 带入 30 执行要求。
5. 本两件 invoke 代笔补落（00 裁定授权 · W0/W1「pre-30 三件套齐」先例 · 20 审 invoke 已由 20 帽自落）。

## 未做（禁区）

- 未实现代码（`scripts/` / `test/` / `src/` 来源文件一字未动 · 修复归 30）。
- 未自行签发任何闸（三次翻闸/代签均为 00 明确书面授权后落笔）。
- 未执行 git push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 发布四动作仅人）。
- 未裹挟工作区其他 untracked 档（逐文件显式 add · 禁 add -A）。

## 下一棒

30 实现棒：GATE_VERIFY 首输出（双闸 approved · VERIFY: PASS · pre-30 invoke 三件套齐）→ 按 task 范围唯一项执行（checker (i) 判据入库化三件套 + tracked 集合原样读取 + 基线 23→34 + `S2_PARAM_EXCLUDE` 防自咬；test 正向 34 / 环境无关 fixture / (ii) fixture 入库化；ACCEPTANCE 三处标注）→ 验收 6 条全绿（**A1**：修复 commit 后以最终 commit 干净 clone 复跑 #1/#2；**A2**：S2 基线以最终 commit 克隆实测为准）→ 波末 `gate-check` exit 0。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 10-task 起草完成 + 实证（CI 双 run 复核 / 本地假绿 clone 真红 / 三组对照实验法定位 / fixture 预演 / 同类面快扫）+ 基线复跑（859-164-858-0-1 · typecheck 0 · pins 17/17 · tag v3.0.0）+ 两次闸落笔（00 授权）+ A4/A5/A6 搭车修 + A1/A2 带入 30 · 00 授权后代笔补落本 invoke（pre-30 三件套之一） |
