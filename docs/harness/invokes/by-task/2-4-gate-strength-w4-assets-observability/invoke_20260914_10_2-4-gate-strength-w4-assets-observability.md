# invoke · 10-task · 2.4 W4 资产门禁可观测补全 task 起草（SPEC 04 三项范围转可验收 task）

> **hat_id**：`10-task` · **日期**：2026-09-14  
> **task_slug**：`2-4-gate-strength-w4-assets-observability`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-14 本窗签收 PLAN_2_4 并**书面授权 00 代签本版后续全部过程闸**（HG-RELEASE 除外 · tag/push/publish 仍仅人）。HG-SPEC-SIGNOFF / HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文落盘后由 00 签 approved · 本帽不代签）。**00 只委派不亲自实现**。

## 动作

1. 起草 `docs/tasks/active/task_2_4_gate_strength_w4_assets_observability.md`（蓝本 SPEC `docs/spec/2_4-gate-strength/04_w4_assets_observability_v1.md` · signed）。
2. 预填 Harness 元信息：test_strategy=required / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / wiki_delta=none / close_pr_policy=exempt。
3. 范围三项（SPEC 04 §3 逐字承接）：① N2 verify 排除项显式 warning（`src/cli-assets.ts:29` 排除点旁 · `--json` 增 `excluded` 字段 · 不升 exit 2 · D-24-W4-WARN-ONLY）② N5 rebuild 追认警示（`:189`/`:196` 两路 · 快照断言 · 二次确认旗标为 20 审可选项）③ 三负向回退锁。
4. 非范围显式列：签名体系 / exit 2 升级 / 对外口径收窄（归 W5）/ provenance 启用（仅人）/ 遥测 / 发版动作。
5. 验收 8 条机械可断言 + failure_paths 7 行 + R0–R5（early_stop=R5）。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / `package.json`（30 的事 · 且 HG-AUDIT-R1=pending）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 git commit / tag / push / npm publish
- 未动对外文案（T-03 降调等归 W5 · 本波只补 CLI 侧可观测性）

## 下一棒

20-task-audit R1 书面审（含 rebuild 二次确认可选项定夺）→ 审查文落盘 `docs/harness/reviews/` → **签 HG-AUDIT-R1=approved**（00 代签 · 2026-09-14 维护者授权）→ 30/40（`feat(2.4-W4): …` · 禁 git add -A · 禁 tag/push/publish）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w4_assets_observability.md` 过闸扫描。
