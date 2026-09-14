# invoke · 10-task · 2.4 W2 结论级闸强度增强 task 起草（SPEC 02 四项范围转可验收 task · 评审先行）

> **hat_id**：`10-task` · **日期**：2026-09-14  
> **task_slug**：`2-4-gate-strength-w2-conclusion-gate`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-14 本窗签收 PLAN_2_4 并**书面授权 00 代签本版后续全部过程闸**（HG-RELEASE 除外 · tag/push/publish 仍仅人）。HG-SPEC-SIGNOFF / HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文落盘后由 00 签 approved · 本帽不代签）。**00 只委派不亲自实现**。

## 动作

1. 起草 `docs/tasks/active/task_2_4_gate_strength_w2_conclusion_gate.md`（蓝本 SPEC `docs/spec/2_4-gate-strength/02_w2_conclusion_gate_strength_v1.md` · signed）。
2. 预填 Harness 元信息：test_strategy=required / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / wiki_delta=none（定档 S2 时升级评估）/ close_pr_policy=exempt。
3. **评审先行落表（D-24-W2-REVIEW-FIRST 硬前置）**：30 动手前须先有强度方案评审文落盘 `docs/harness/reviews/`（候选档位 S1/S2/S3 + 存量合规率实测 + 定档）且经 20-task-audit R1——与 HG-AUDIT-R1 签闸同为 30 开工双前置。
4. 范围四项（SPEC 02 §3 逐字承接）：① 评审文落盘 ② `evalReviewConclusion`（`src/cli-checks.ts:684-704` · 本棒复核现值）按定档增强 ③ 「结论节只写通过二字」负向 fixture ④ 存量波及循 2.3.1 N11 先例入 legacy-gate-exempt.yaml 留痕。
5. freeze_id 行注明：双 D-24 定案冻结 · **强度档位未冻结**（评审文定夺后回填）。
6. 验收 8 条机械可断言 + failure_paths 7 行 + R0–R5（early_stop=R5）。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / `package.json`；未写评审文（评审文是 20 审阶段的产物 · 本帽只立硬前置条款）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 git commit / tag / push / npm publish
- 未定死强度档位（SPEC 授权评审文定夺）

## 下一棒

20-task-audit R1 书面审 → **强度方案评审文落盘 `docs/harness/reviews/`（档位定夺 + 存量实测）** → 审查文落盘 → **签 HG-AUDIT-R1=approved**（00 代签 · 2026-09-14 维护者授权）→ 30/40（`feat(2.4-W2): …` · 禁 git add -A）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w2_conclusion_gate.md` 过闸扫描。
