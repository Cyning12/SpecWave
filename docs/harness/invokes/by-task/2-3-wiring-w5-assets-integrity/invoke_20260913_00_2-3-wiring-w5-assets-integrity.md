# invoke · 00 · 2.3 W5 A2 资产完整性校验派工（SPEC 05 → 10-task 起草授权）

> **hat_id**：`00-orchestrator` · **日期**：2026-09-13  
> **task_slug**：`2-3-wiring-w5-assets-integrity`  
> **帽条文**：`assets/harness/prompts/00-orchestrator.md`

## 授权来源

维护者 2026-09-12 会话授权（00 委派 W5 实现棒走完整链路 · 与 W1–W4 同制）：10-task → 20-task-audit → HG-AUDIT-R1（00 代签注明授权出处）→ GATE_VERIFY 全 approved → 30+40 → gate-check → task close --yes → 独立 commit `feat(2.3-W5): …`（逐路径 add · 禁 git add -A）。

## 动作

1. 确认蓝本：SPEC 05 signed（HG-SPEC-SIGNOFF=approved · 2026-09-12 授权 00 代签）· 政策文件 00_policy_and_boundaries.md（S2 / P0-GATE / 文案纪律）。
2. 委派本棒（W5 实现棒）执行全链路；HG-TASK-DRAFT = approved（00 代签落表）；HG-AUDIT-R1 待 20 R1 审查文落盘后按同授权代签。
3. 硬约束交底：S2 只新增不覆写 · 禁 --force/--allow-* · 不动 host-adapt schema · RELEASING.md 零改动 · 事实卡 §11 禁称维持（落地后本波也不改对外文档宣称）· bin 面真实命令验收（W3 教训）· W4 新闸 dogfood 自证。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / 任何文档面（本帽只委派不亲自改码）
- 未签发 HG-AUDIT-R1（须 20 R1 先行）
- 未 tag / push / npm publish（仅人）

## 下一棒

10-task 起草 task 文件（本 invoke 同棒落盘）→ 20-task-audit R1 → HG-AUDIT-R1 代签 → 30/40。
