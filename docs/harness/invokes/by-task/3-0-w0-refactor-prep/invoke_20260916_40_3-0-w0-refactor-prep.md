# Invoke：40（review-of-work 独立复核）· 3-0-w0-refactor-prep

| 字段 | 值 |
|------|-----|
| hat_id | 40-review-of-work |
| task_slug | `3-0-w0-refactor-prep` |
| task_paths | `docs/tasks/active/task_3_0_w0_refactor_prep.md`（close 后 `docs/tasks/done/`） |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |
| 复核对象 | HEAD `67e57d4`（五笔实现 commit + 一笔文档 commit · `1067f32..HEAD`） |

## 复核范围（委派 Prompt）

task 验收标准 11 项逐条核对实证；独立复跑 typecheck / build / export-surface / test:lib / pins / npm test；锁② 10 文件抽查 `git diff 1067f32..HEAD`；零行为变更抽验（三 barrel 纯 re-export · 两 bin --help 对基线）；M1 验收文核对（20 审 advisory A2/A3/A4 落文 · 硬约束 14 关键数字 inline · 偏差登记）；commit 粒度 / 禁 add -A / 未 push-tag。**禁区遵守**：未改 src/test/SPEC/PLAN/task/M1；本 invoke 单独 commit；未 push/tag；未代签任何闸。

## 独立实测证据（本帽本机复跑 · 不接受「30 说绿」）

| 项 | 命令 | 实测 |
|----|------|------|
| git 线 | `git log --oneline 1067f32..HEAD` | 6 commit：b51acf3 → 1a34242 → 161a9aa → 8dc8bfd → 4bebcf9 → 67e57d4；`main...origin/main [ahead 6]` **未 push**；HEAD 无 tag；逐 commit `--stat` 粒度正确（8/9/1/7/2/2 文件 · 锁③脚本搭车 b51acf3 · E3 隔离 4bebcf9 · 文档独立 67e57d4）· 域外档零裹挟 |
| 锁⑤ 平台 | `npm run typecheck` / `npm run build` | **0 错 / 0 错**（exit 0） |
| 锁③ 快照 | `node scripts/check-export-surface.mjs --check .workbuddy/3.0-w0/export-surface-baseline.txt` | **PASS · 逐字一致**（exit 0 · 注：--check 须带基线文件参数，裸跑 exit 2 系 failClosed 用法守卫）；**独立交叉验**：从 `git show 1067f32:src/{cli,cli-checks,cli-host}.ts` 直接提取 export 符号 = **7/43/9**，与快照三段逐一 diff **IDENTICAL**（不依赖 30 快照自体自洽） |
| 锁④ 发布链 | `npm run test:lib` / `node bin/specgate.js pins check` | **6/6 PASS** / **17/17 PASS**（exit 0） |
| 锁① 用例 | `npm test` 全量 | **tests 607 / suites 116 / pass 602 / fail 4 / skipped 1** —— 与基线逐字一致；4 红逐一点名复核 = cli-docs-122 D8 + cli-p0 D8 + pack-hygiene ×2，全为 `npm pack --dry-run` EPERM exit 255（本机 npm cache root-owned · F-W0-07 登记环境红）· **零意外红（无第 5 红）**；cli-docs-122 单文件复跑确认第 4 红身份（EPERM） |
| 锁② 消费者面 | `git diff 1067f32..HEAD -- <锁② 10 文件>` | **全空（0 行）**；授权改动面仅 test/cli-p0.test.ts（161a9aa · +19−5）+ test/cli-g1g7.test.ts + test/cli-refresh-ide-blocks.test.ts（4bebcf9）；package.json / bin/ / docs/_tech_graph / assets 零 diff |
| 锁⑥ 对外面 | `node bin/specgate.js --help` / `node bin/dsh-coding-kit.js --help` diff 基线 | **两 bin --help 与 .workbuddy 基线逐字 IDENTICAL**；`--version` = **2.4.2**；exports 键集不变（package.json 零 diff 即证未新增 `./lib/*` 子路径） |
| barrel 抽验 | 读 src/cli-checks.ts / src/cli-host.ts / src/cli.ts 全文 | 三件均**纯 re-export + 注释**（52/21/32 行）· 无逻辑；`sniffHostContract` 直留 cli-host barrel（D3）✓；cli.ts 留 isMain 自举块（登记偏差 · import.meta.url 自指判基理由成立）✓ |
| E3 同口径 | 静态 `runCli(` 命中 − 定义行（1067f32 vs HEAD） | cli-g1g7 **44→16** · cli-refresh **40→8** · 全套件 **580→520（−60 · −10.3%）**；it 数 g1g7 14/14 · refresh 27/27 **零增删**；makeCore 进程内 harness 实证存在（g1g7 14 命中 · refresh 3 命中）· 烟测各 5 条（≤5 档） |
| 波末闸 | `node bin/specgate.js gate-check --task <task>` | **exit 0**（HG-TASK-DRAFT / HG-AUDIT-R1 均 approved · 未发现阻塞） |
| 布局适配 | `git show 161a9aa` | withFileTypes + 递归下探 cli 前缀目录 · 禁跳过目录（src/cli/*.ts 留在扫描面）· 断言意图不缩 —— 与 00 裁决选项 A 逐字吻合 |

## M1 验收文核对（`docs/harness/reviews/w0_refactor_prep_acceptance_M1_20260916.md`）

- **A2（spawn 口径定义写明）**：✅ §四「口径定义」明示「静态 `runCli(` 字面命中 − `function runCli` 定义行」+ 全套件基线 580（619−39）+ 与 task 快照 ≈588 差值 ±8 登记 —— 本帽同口径独立复测数字逐一吻合。
- **A3（环境红三字段）**：✅ §三 表 = 测试文件 + 用例名 + 失败形态（EPERM exit 255 · npm cache root-owned）+ 干净 cache 对照 24/24 转绿 + 处置仅人 —— 与本帽实测 4 红身份一致。
- **A4（交付范围=完整字段）**：✅ §一 显式「交付范围 = 完整（A4 字段）」+ 范围 ①–⑥ × commit 对照表 + W0-SPLIT 备而未用及未达降级条件说明（无沉默格子）。
- **硬约束 14（关键数字直接写进文内）**：✅ 580→520 · 7/43/9 全量符号名单 inline · 耗时 4.49→1.80s / 5.30→1.68s · 607/116/602+4+1 五阶段表 —— 非仅引 .workbuddy。
- **偏差登记**：✅ §五 两条如实（cli-p0 布局适配 161a9aa · isMain 自举直留 barrel）+ §四 spawn 口径 ±8 —— 与 git 实证一致。

## 验收标准 11 项逐条结论

锁① ✅（607 计数独立复现逐字一致）· 锁② ✅（10 文件 0 行）· 锁③ ✅（脚本入 git + PASS + 独立交叉验）· 锁④ ✅（6/6 · 17/17）· 锁⑤ ✅（0 错 ×2）· 锁⑥ ✅（五项全立）· 执行粒度 ✅（5+1 commit · 独立可回退 · 显式 add · 未 push/tag）· E3 等价性 ✅（删/补对照 + 同口径 −60 + it 零增删 + 烟测 ≤5）· M1 落盘 ✅（reviews/ · S2 只新增 · 证据入 tracked）· 波末 gate-check ✅（exit 0；`task close --yes` 留待 30 关账棒 · 本复核通过即解锁）· 范围 ①–⑥ ✅ 全交付（未触发 W0-SPLIT）。

## 结论

**PASS**（blocking **0** · advisory **3**）—— 六重锁全绿经本帽独立复跑逐字复现；「零行为变更」机械可证成立；M1 如实且满足 20 审 A2/A3/A4 与硬约束 14；五笔实现 commit + 一笔文档 commit 粒度、边界、授权面全部合规。**30 可关账。**

## 发现（advisory · 均不阻塞关账）

1. **30 invoke 措辞超前**（标注级）：30 invoke 阶段五写「gate-check exit 0 → task close --yes」如已闭环，实测 task 仍在 `active/` 未 close —— 流程顺序本即「40 复核 → 30 关账」，invoke 系计划口径超前表述，关账后自然消解。
2. **Hub 索引行预写**（标注级）：`docs/tasks/done/README.md` 工作区已预写本 task 关账索引行（uncommitted · 指向 done/ 路径而 task 尚未迁移）；属未提交工作区状态、非 commit 裹挟，close 时随迁移一并显式 add 即自洽。
3. **锁③脚本用法提示**（标注级）：`check-export-surface.mjs --check` 须带基线文件参数（裸跑 exit 2 用法提示系 failClosed 守卫）；M1 引用了基线路径故证据链完整，仅后续复用者须注意带参。

## 下一棒

**30 关账**：`node bin/specgate.js task close --yes`（或 npx 等价）闭环 —— 本 invoke 为 close_invoke 守卫五件套（10/20/30/40/00）最后一块，落盘后 close 前置齐备；Hub 索引行随 task 迁移 done/ 一并显式 add（禁 `git add -A` · 上游 SPEC/PLAN/reviews untracked 产物仍不得裹挟）。关账后归 00：KPI 聚合 · PLAN 波次表回写（归 00/维护者）· W1 可排程（M1 硬前置已兑现）。

## 禁区遵守

未改 src/test/SPEC/PLAN/task 文/M1/既有 reviews；本 invoke 单文件显式 add 独立 commit（`docs(3.0-W0): 40 invoke 留档（review-of-work 复核）`）；未 push/tag/publish/deprecate；未代签任何闸。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 40 review-of-work 独立复核：PASS（blocking 0 · advisory 3）· 六重锁 + E3 数字 + 锁② 零 diff + 两 bin --help 全部本机独立复跑复现 · M1 A2/A3/A4 落文核对通过 · 本 invoke 留档 |
