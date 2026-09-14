# invoke · 10-task · 2.4 W1 pins 提取修正 task 起草（SPEC 01 三项范围转可验收 task）

> **hat_id**：`10-task` · **日期**：2026-09-14  
> **task_slug**：`2-4-gate-strength-w1-pins-extract`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-14 本窗签收 PLAN_2_4（HG-NEXT-PLAN=approved · `docs/roadmap/PLAN_2_4_gate_strength_v1_zh.md` 头部与人工闸表）并**书面授权 00 代签本版后续全部过程闸**（HG-SPEC-SIGNOFF / HG-TASK-DRAFT / HG-AUDIT-R1 / CLOSE · HG-RELEASE 不在授权范围，tag/push/publish 仍仅人）。HG-SPEC-SIGNOFF / HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文落盘后由 00 签 approved · 本帽不代签）。**00 只委派不亲自实现**（harness-00-delegate-only 口径 · 30 改码由执行棒承担）。

## 动作

1. 起草 `docs/tasks/active/task_2_4_gate_strength_w1_pins_extract.md`（蓝本 SPEC `docs/spec/2_4-gate-strength/01_w1_pins_extract_fix_v1.md` · signed）。
2. 预填 Harness 元信息：test_strategy=required / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / wiki_delta=none / invoke_retention_profile=default / close_pr_policy=exempt。
3. 范围三项（SPEC 01 §3 逐字承接）：① N7 pin-16 refstyle 分支（`src/cli-pins.ts:295` · 本棒复核现值）；② N8 pin-17 表行锚定（`:348-390` 裸词命中 · 双命中断言口径）；③ N9 pin-08 语义格位锁定（`:221-258` 双判 · 状态列点式唯一真值 · `X_Y*` 不计入）+ yaml semantics 更新。
4. 非范围显式列：引擎架构 / N10（归 W6）/ S2 / git 自动化 / RELEASING 措辞 / --force 禁新增 / W2–W6 / 发版动作。
5. 验收 8 条全部机械可断言（①–⑤ 对齐 SPEC 01 §7 · ⑥–⑧ 增补 TEST-LOCK / gate-check+close / 提交边界）。
6. failure_paths 7 行（F-W1-01..06 对齐 SPEC §8 + F-T-01 闸纪律）+ R0–R5 思考轮 + 控制表（early_stop=R5 · residual_risks ×2）。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / `package.json`（30 的事 · 且 HG-AUDIT-R1=pending）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 git commit / tag / push / npm publish（commit 由 30 棒逐路径精确 add · tag/push/publish 仅人）
- 未扩大范围到 W2–W6

## 下一棒

20-task-audit R1 书面审 → 审查文落盘 `docs/harness/reviews/` → **签 HG-AUDIT-R1=approved**（00 代签 · 2026-09-14 维护者授权）→ 30/40（`feat(2.4-W1): …` · 禁 git add -A · 禁 tag/push/publish）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w1_pins_extract.md` 过闸扫描。
