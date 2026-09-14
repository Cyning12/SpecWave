# invoke · 10-task · 2.4 W5 物料与对外口径对齐 task 起草（SPEC 05 五项范围转可验收 task · 纯文档波）

> **hat_id**：`10-task` · **日期**：2026-09-14  
> **task_slug**：`2-4-gate-strength-w5-materials-messaging`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-14 本窗签收 PLAN_2_4 并**书面授权 00 代签本版后续全部过程闸**（HG-RELEASE 除外 · tag/push/publish 仍仅人）。HG-SPEC-SIGNOFF / HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文落盘后由 00 签 approved · 本帽不代签）。**00 只委派不亲自实现**。

## 动作

1. 起草 `docs/tasks/active/task_2_4_gate_strength_w5_materials_messaging.md`（蓝本 SPEC `docs/spec/2_4-gate-strength/05_w5_materials_messaging_v1.md` · signed）。
2. 预填 Harness 元信息：test_strategy=required（grep 机检口径 · 纯文档波）/ required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / wiki_delta=none / close_pr_policy=exempt。
3. 范围五项（SPEC 05 §3 逐字承接）：① N3 物料 4 份逐份处置（翻新/快照 · 默认快照标注最低代价合规）② T-03 降调（README/事实卡）③ 安全设计 `:77`/§5.3.1 A-1 行（约 :768）/`:418` 收窄 ④ 关账声称核查（与 W2 状态一致）⑤ N6 aider 行补 `conventions-file: AGENTS.md`（`README.md:38` · 报告原引 :106 已漂移 · 本棒复核更正）。
4. 非范围显式列：威胁模型结构 / 其他设计文档 / provenance 启用（仅人）/ 物料钉面化 / **任何代码改动** / 发版动作。
5. 验收 8 条机械可断言（grep 三组前后对照 + pins check 回归 + npm test）+ failure_paths 7 行 + R0–R5（early_stop=R5）。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / `package.json`；本波为纯文档波（30 也只做文档面）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 git commit / tag / push / npm publish
- 未提前恢复「关账必经审查通过」对外声称（W2 落地前维持保守口径 · 00 §4）

## 下一棒

20-task-audit R1 书面审（含物料逐份处置方式确认）→ 审查文落盘 `docs/harness/reviews/` → **签 HG-AUDIT-R1=approved**（00 代签 · 2026-09-14 维护者授权）→ 30/40（`docs(2.4-W5): …` · 禁 git add -A · 禁 tag/push/publish）。30 动手前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w5_materials_messaging.md` 过闸扫描。
