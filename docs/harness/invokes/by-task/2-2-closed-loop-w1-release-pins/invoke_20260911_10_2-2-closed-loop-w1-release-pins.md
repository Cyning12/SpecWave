# invoke · 10-task · 起草 W1 task（release pins）

> **hat_id**：`10-task` · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w1-release-pins`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 闸扫描

| gate | status |
|------|--------|
| HG-SPEC-SIGNOFF | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表） |
| HG-NEXT-PLAN | **approved**（同上 · D-* 四项冻结采纳推荐） |
| HG-TASK-DRAFT | **approved**（00 代签 · 本棒落表） |
| HG-AUDIT-R1 | **pending**（待 20-task-audit R1 审查文 + 人签 · 此前 30 拒改码） |

## 动作

1. 读蓝本 SPEC `docs/spec/2_2-closed-loop-start/01_release_pins_v1.md`（signed · 20-spec-audit R1 pass 零阻塞）+ 00 政策 + 06 验收 + 审查文 R1
2. 起草 `docs/tasks/active/task_2_2_closed_loop_w1_release_pins.md`：验收 ①–⑤ 逐字对齐 01 §8 + 增补 ⑥⑦（审查文非阻塞观察移交：spec 索引行状态翻 signed · 补 2.1.3 patch 收尾行 D-SPEC-213-ROW）· failure_paths 对齐 01 §9 F-A1-01–07 · R0–R5 思考轮闭合（early_stop=R5）
3. 元信息：`required_invoke_hats=10,20,30,40,00` · `invoke_retention_profile=default` · `git_branch=main` · `graph_delta=none` · `wiki_delta=none` · `close_pr_policy=exempt`
4. 提交边界提醒写入验收 ⑪：禁 `git add -A` · 提交信息 `feat(2.2-W1): release pin check + fix`
5. `npx spec-wave task lint --file <task>` → **PASS**
6. **本窗未改** src/ / test/ / assets 代码资产 / .github/ / delivery/ / package.json

## 停点

**停**。下一棒：20-task-audit 出 R1 审查文（落 `docs/harness/reviews/` + 补 invoke_\*_20_\*）→ 人签 HG-AUDIT-R1 → 00 派 30。
