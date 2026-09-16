# Invoke：30（task 实现）· 3-0-w0-refactor-prep

| 字段 | 值 |
|------|-----|
| hat_id | 30-execute-code |
| task_slug | `3-0-w0-refactor-prep` |
| task_paths | `docs/tasks/active/task_3_0_w0_refactor_prep.md`（close 后 `docs/tasks/done/`） |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 指令摘要（委派 Prompt）

00 委派（HG-TASK-DRAFT + HG-AUDIT-R1 双 approved 后）：按 task 范围 ①–⑥ 执行 W0 重构预备 —— 非功能波零行为变更 · 三 god-file 拆分 barrel 化（顺序 cli-checks → cli-host → cli · 模块边界以 task 定稿表为准 · PLAN W0.4 已取代）· E3 第一批 spawn 下沉（隔离 commit · 删了不补=未完成）· 锁③ 快照脚本固化 · M1 独立验收文（早于 W1 动 schema）。六重锁逐 commit 全绿才允许交付；锁任一不过回退 STOP 如实回报；禁 `git add -A`；tag/push/publish/deprecate 仅人；逐阶段 00 验收放行制。

## GATE_VERIFY（首输出 · 改码前机械闸）

`node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w0_refactor_prep.md` →

| human_gate_id | task表status | blocks_30 | 30 影响 |
|---------------|--------------|-----------|---------|
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |

**VERIFY: PASS**（exit 0 · bin 等价命令 · 未用 npx —— 本机 npx OOM 已登记 F-W0-07 · 2.4.2 先例同款）。30 纪律真值片段：仓内 `docs/harness/prompts/` 不存在（host 物化到消费者仓）→ 按 fallback 读 `assets/harness/prompts/FRAGMENT_30_gate_verify_v1_zh.md`（同源资产）。

## 五阶段执行摘要（00 逐阶段验收）

1. **阶段一（b51acf3）**：锁③ 前置（`scripts/check-export-surface.mjs` + 拆分前基线快照 7/43/9 · build 后取）→ 拆 cli-checks（1007 行 · 43 exports）→ src/checks/* 六模块 · 原文件降级纯 barrel。六重锁全绿。
2. **阶段二（1a34242）**：拆 cli-host（1458 行 · 9 exports）→ src/host/* 八模块 · sniffHostContract 直留 barrel（D3）。六重锁全绿。
3. **阶段三（161a9aa + 8dc8bfd）**：拆 cli（1318 行 · 7 exports）→ src/cli/* 六模块。首轮锁① 第 5 红（cli-p0 静态扫描 EISDIR · readdir × src/cli/ 目录布局耦合 · 干净 cache 对照仍红 + stash 对照因果确证）→ 按铁律整体回退 STOP 上报；**00 裁决选项 A**：先行 `161a9aa`（withFileTypes 递归扫描适配 · 禁跳过目录 · 探针实证注入→红→撤→绿）→ `8dc8bfd` 复写交付。bin 冻结面实证：两 bin --help 逐字一致 · --version=2.4.2 · test:lib 6/6。
4. **阶段四（4bebcf9）**：E3 第一批 —— cli-g1g7（14 its）/ cli-refresh（27 its）spawn 断言下沉 makeCore 进程内直调 cmd* · 断言逐字保留 · it 数零增删 · 烟测各 5 条保全链。spawn 静态净调用：g1g7 44→16 · refresh 40→8 · 全套件 580→520（−10.3%）；耗时 4.49→1.80s / 5.30→1.68s。
5. **阶段五（本件 + M1）**：M1 独立验收文落盘 `docs/harness/reviews/w0_refactor_prep_acceptance_M1_20260916.md` → KPI/自检结论/勾选/状态补齐 → Hub 索引行 → `gate-check` exit 0 → `task close --yes`。

## 六重锁终态（每 commit 前后同口径）

① npm test **607/116/602 pass+4 点名环境红+1 skip** 五阶段逐字一致 · 零意外红终态（环境红 = cli-docs-122 D8 / cli-p0 D8 / pack-hygiene ×2 · EPERM exit 255 · 干净 cache 对照 24/24 转绿两次独立复现 · 处置仅人）· ② 锁② 10 文件消费者 import 面 `git diff` 0 行 · ③ 三份 d.ts 导出集合（7/43/9）拆分前后逐字一致（`.workbuddy/3.0-w0/export-surface-baseline.txt` · 关键名单已 inline 入 M1）· ④ test:lib 6/6 · pins 17/17 · ⑤ typecheck 0 错 · build 0 错 · ⑥ package.json exports/files · bin/ 零改动 · 未新增 `./lib/*` 子路径 · 两 bin --help 逐字一致。

## commit 清单（五笔 · 显式逐文件 add · 全程未 push/tag）

`b51acf3`（拆 cli-checks + 锁③脚本）→ `1a34242`（拆 cli-host）→ `161a9aa`（cli-p0 扫描适配）→ `8dc8bfd`（拆 cli）→ `4bebcf9`（E3 第一批）。每 commit 独立可回退；阶段三首轮整体回退一次（git restore + clean · 干净可证）后按 00 裁决重做。上游 untracked 产物（SPEC 系列 / PLAN / R1 审查文 / 10·20·00 invoke / `docs/spec/README.md`）零裹挟。

## 偏差登记（三条 · 已入 M1）

1. **布局适配**（00 裁决 · 不计行为变更）：cli-p0 readdir 静态扫描 × src/cli/ 目录 → `161a9aa` withFileTypes 递归（探针实证覆盖未缩）。
2. **isMain 自举块直留 barrel**（定稿「isMain 随行 main」唯一执行偏差 · 00 验收确认成立）：`import.meta.url` 自指判基须以 `src/cli.ts` 路径为准（node src/cli.ts 直跑入口行为不变）。
3. **spawn 口径差值**：全套件静态 `runCli(` 净调用本棒实测 580 vs task 起草快照 ≈588（±8 系起草轮后套件微增 · F-W0-08 同口径前后对比有效性不受影响）。

## 未做（禁区）

- 未改 SPEC / PLAN / 既有 reviews / assets / docs/_tech_graph；未碰 src/index.ts / host-contract.ts 等非 god-file 模块（import 复用除外）。
- 未执行 tag / push / publish / deprecate（四动作全仅人）；未用 `git add -A`。
- 未做 E3 其余 spawn 削减（520 → <50 归 W7）；未动 W1+ 任何工作（M1 落盘前 W1 不得动 schema · 已兑现）。

## 下一棒

40 review-of-work（五 commit 复盘 · M1 复核）→ 00 关账（KPI 聚合 · task close 后 PLAN 波次表回写归 00/维护者）。W1 可在 M1（已落盘）之后排程动 schema。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 30 实现棒五阶段完成 · 六重锁全绿 · 五 commit · M1 落盘 · 本 invoke 留档 |
