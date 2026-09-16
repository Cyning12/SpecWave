# Invoke：10（task 起草）· 3-0-w1-ci-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-w1-ci-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w1_ci_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 指令摘要（委派 Prompt）

00 委派（CI run 35066550895 红 · 缺陷真值已查实 · bugfix 双轨跳 SPEC · task 结构照 done/task_3_0_w1_schema_leap 精简 · mini 一页）：起草 CI hotfix task —— ① 范围唯一：`scripts/scan-human-gates-baseline.mts` 对 `docs/tasks/active/` 与 `docs/tasks/done/` 扫描加 existsSync 守卫（缺失目录按零文件处理）+ 输出注明 skipped-missing 目录（可诊断 · 硬约束 10 口径）；② 验收含新负向 fixture（exit 0 + 文件数 0 + skipped 注记）· w1-gate-generalization 15 测全绿 · 全量 667+N 零回退 + typecheck/pins · **模拟 CI 环境实证**（临时拷贝删 docs/tasks/active/ 后跑该测试文件 · 修复前真红修复后转绿 · 硬约束 6）；③ 非范围含不改口径/fixture · **不动 active/ 目录本身（不加 .gitkeep · 理由写进 task）**；④ failure_paths F-HOT-01（修复后重扫与基线不一致 ⇒ 守卫不得改变有目录时任何行为）/ F-HOT-02（误加 .gitkeep 掩盖）· R0–R5 填全 · 同类无守卫 readdirSync 快扫登记（W5/W7 候选）；⑤ 基线复跑 npm test（667/130/666/0/1）+ typecheck + pins 实测。禁区：不实现代码 · 不签闸 · 不改其他文件 · 不 commit。

## 动作与独立复核证据（本帽实测）

- **缺陷复核**：本地 `ls docs/tasks/active/` 为空 · `git ls-files docs/tasks/active/` 零命中 · HEAD `f9f9c02` · 工作区干净。
- **模拟新鲜克隆实证（修复前真红钉死）**：`git archive HEAD` + `git init` + `npm ci` 临时拷贝跑 `test/w1-gate-generalization.test.ts` → **15 测恰 1 红**（:179 重扫测 · `ENOENT ... scandir '.../docs/tasks/active'` at `scan-human-gates-baseline.mts:101:22` · 14/15 pass）—— 与 CI run 35066550895 真值逐字吻合。**复现陷阱登记**：裸 `git archive`（无 `.git`）额外带红 3 个 gate-check CLI 测（`--target 不在任何 git 仓内` · 方法假象 · 非本缺陷）⇒ 模拟 CI 必须 `git init`（验收 #4 命令已含）。
- **掩盖风险登记（residual ①）**：本 task 文件落 active/ 后新鲜 checkout 目录即非空 ⇒ CI 红被顺带掩盖（与 .gitkeep 同构）⇒ 验收 #4 强制临时拷贝中显式 `rm -rf docs/tasks/active/` 做负向锁（20 审场景 B 后续亲证成立）。
- **基线复跑**：npm test **667/130/666 pass/0 fail/1 skip**（≈78s）· typecheck 0 错 · pins **17/17**。
- **同类面快扫**（全仓 grep `readdirSync` 逐面抽核）：`scanner:101` = 唯一对 git 不跟踪（可空）目录的裸读 · existsSync 族 19 处 + try/catch 族 + failClosed 设计三族已守卫 · 低危候选 3 组（`cli-wiki.ts:82` / `cli-skills.ts:74,282` / `cli-pins.ts:299,307`）登记 W5/W7 候选 · 测试面低风险不登记。
- 落 task 文；`task lint` PASS（E5 缺自检结论节首验后补占位节复跑 PASS）· gate-check 实证双 pending 正确拒 30 · 草稿落盘后 w1 测试文件 15/15 复跑仍全绿（F-W1-09 比对面纪律成立）。

## 关键交付与回执（00 授权落笔）

1. **HG-TASK-DRAFT 翻转**（00 回执授权 · 2026-09-16）：pending → approved（00 代签 · 授权真值：维护者本窗「授权00代签」· task lint PASS）· 头部状态行同步 · verify 回报（HG-AUDIT-R1 pending 正确拒 30）。
2. **HG-AUDIT-R1 代签落笔**（00 裁定 · 2026-09-16）：pending → approved · 依据审查文 `docs/harness/reviews/task_3_0_w1_ci_hotfix_audit_R1_20260916.md`（R1 · PASS · blocking 0 · advisory A1–A2 · A1 已搭车修 · A2 带入 30 守加性原则）· 头部同步。
3. **A1 搭车修**（20 审 advisory · 00 裁定）：「同类面快扫登记」已守卫计数 16 → **19** 订正 + 补列漏计守卫点 `cli-status.ts:57` · `cli-skills.ts:211` 等（全量清点归 W5/W7 排查 task 立项时订正）。
4. **R5 表述同步**（00 裁定）：R5 节 + 控制行「HG-TASK-DRAFT 同待签 / 双闸 pending 待签」→ 双闸 approved（2026-09-16 00 代签）口径。
5. 本两件 invoke 代笔补落（00 裁定授权 · W0/W1「pre-30 三件套齐」先例 · 20 审 invoke 已由 20 帽自落 · verify 实测三件套齐后 PASS）。

## 未做（禁区）

- 未实现代码（src / scripts / test 一字未动 · 修复归 30）。
- 未自行签发任何闸（两次翻闸均为 00 明确书面授权后落笔）。
- 未执行 git push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 四动作仅人 · 不 push 待修复包就绪统一推）。
- 未裹挟工作区其他 untracked 档（逐文件显式 add）。

## 下一棒

30 实现棒：GATE_VERIFY 首输出（双闸 approved · VERIFY: PASS · pre-30 invoke 三件套齐）→ 按 task 范围唯一项执行（scanner 双目录 existsSync 守卫 + skipped-missing 双通道诊断 · **A2 守加性原则**：既有 meta 五键语义零改动 · 有目录路径 console/snapshot 输出零差异）→ 验收 6 条全绿（负向 fixture 先红后绿 + 模拟 CI 显式删目录红转绿 + A2 比对零漂移）→ 波末 `gate-check` exit 0。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 10-task 起草完成 + 实证三件套（模拟克隆恰 1 红 / 裸 archive 假象登记 / 掩盖风险登记）+ 基线复跑 + 同类面快扫 + 两次代签落笔（00 授权）+ A1 修 + R5 同步 · 00 授权后代笔补落本 invoke（三件套之一） |
