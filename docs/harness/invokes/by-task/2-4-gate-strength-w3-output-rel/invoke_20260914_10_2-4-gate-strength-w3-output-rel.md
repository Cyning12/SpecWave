# invoke · 10-task · 2.4 W3 输出层统一相对化 task 起草（SPEC 03 三项范围转可验收 task）

> **hat_id**：`10-task` · **日期**：2026-09-14  
> **task_slug**：`2-4-gate-strength-w3-output-rel`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-14 本窗签收 PLAN_2_4 并**书面授权 00 代签本版后续全部过程闸**（HG-RELEASE 除外 · tag/push/publish 仍仅人）。HG-SPEC-SIGNOFF / HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文落盘后由 00 签 approved · 本帽不代签）。**00 只委派不亲自实现**。

## 动作

1. 起草 `docs/tasks/active/task_2_4_gate_strength_w3_output_rel.md`（蓝本 SPEC `docs/spec/2_4-gate-strength/03_w3_output_rel_unified_v1.md` · signed）。
2. 预填 Harness 元信息：test_strategy=required / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / wiki_delta=none / close_pr_policy=exempt。
3. 范围三项（SPEC 03 §3 逐字承接）：① 输出层统一出口（D-24-OUTPUT-REL-EXIT）② V2 泄漏清单四处逐项修复（行号本棒复核：`cli.ts:1017-1037` lint#file · `:1148-1164` close#dest/done_snapshot.path · `:571`/`:899` verify/gate-check#task · `:1136`/`:1167`/`:1171` close 人类输出）③ 「任何 --json 输出不得含绝对路径」机械断言组（含断言自身负向自证）。
4. 非范围显式列：exit code / 键集 / 文案措辞 / C6 / 其他波 / 发版动作。
5. 验收 8 条机械可断言 + failure_paths 7 行（F-W3-01..05 + F-T-01）+ R0–R5（early_stop=R5）。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / `package.json`（30 的事 · 且 HG-AUDIT-R1=pending）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 git commit / tag / push / npm publish
- 未扩大范围到 W1/W2/W4–W6

## 下一棒

20-task-audit R1 书面审 → 审查文落盘 `docs/harness/reviews/` → **签 HG-AUDIT-R1=approved**（00 代签 · 2026-09-14 维护者授权）→ 30/40（`feat(2.4-W3): …` · 禁 git add -A · 禁 tag/push/publish）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w3_output_rel.md` 过闸扫描。
