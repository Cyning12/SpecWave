# invoke · 10-task · 2.4 W6 P3 清扫 task 起草（SPEC 06 三项范围转可验收 task）

> **hat_id**：`10-task` · **日期**：2026-09-14  
> **task_slug**：`2-4-gate-strength-w6-p3-cleanup`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-14 本窗签收 PLAN_2_4 并**书面授权 00 代签本版后续全部过程闸**（HG-RELEASE 除外 · tag/push/publish 仍仅人）。HG-SPEC-SIGNOFF / HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文落盘后由 00 签 approved · 本帽不代签）。**00 只委派不亲自实现**。

## 动作

1. 起草 `docs/tasks/active/task_2_4_gate_strength_w6_p3_cleanup.md`（蓝本 SPEC `docs/spec/2_4-gate-strength/06_w6_p3_cleanup_v1.md` · signed）。
2. 预填 Harness 元信息：test_strategy=required / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / wiki_delta=none / close_pr_policy=exempt。
3. 范围三项（SPEC 06 §3 逐字承接）：① N10 pin-16 大小写口径（`src/cli-pins.ts:295-325` 比对区 · 大小写不敏感 + 磁盘存在性二次确认 · 本棒复核现值）② N14 lint-done slug 口径统一（`src/cli-task-extra.ts:73` vs `:110-113` · meta 优先文件名兜底）③ N4 仅留痕登记（D-24-N4-REGISTER · 行为零变更 · 落点随 task 定稿倾向 ACCEPTANCE 档）。
4. 非范围显式列：通用大小写框架 / 豁免语义 / N4 行为变更（锁死）/ 其他波 / 发版动作。
5. 验收 7 条机械可断言 + failure_paths 6 行 + R0–R5（early_stop=R5）。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / `package.json`（30 的事 · 且 HG-AUDIT-R1=pending）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 git commit / tag / push / npm publish
- 未把 N4 当缺陷改行为（§3.E 判定符合契约 · 改 exit 码即超 SPEC）

## 下一棒

20-task-audit R1 书面审 → 审查文落盘 `docs/harness/reviews/` → **签 HG-AUDIT-R1=approved**（00 代签 · 2026-09-14 维护者授权）→ 30/40（`feat(2.4-W6): …` · 禁 git add -A · 禁 tag/push/publish）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w6_p3_cleanup.md` 过闸扫描。
