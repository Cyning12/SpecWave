# invoke · 00 · 2.3 W6 编排与代签（委派链路 + HG-AUDIT-R1 代签落表）

> **hat_id**：`00-orchestrator`（本棒 00 授权由维护者 2026-09-12 会话预授权承载）· **日期**：2026-09-13  
> **task_slug**：`2-3-wiring-w6-host-completion`  
> **帽条文**：`assets/harness/prompts/00-orchestrator.md`

## 授权来源

维护者 2026-09-12 会话授权（与 2.2.0/2.2.1/2.3-W1–W5 各波同模式）：HG-SPEC-SIGNOFF / HG-TASK-DRAFT / HG-AUDIT-R1 由 00 代签落表并注明授权出处。

## 动作

1. 委派 W6 实现棒走完整链路（10 → 20 → HG-AUDIT-R1 → 30+40 → close → 独立 commit），PROMPT 硬约束下达：S2 只新增不覆写 · 禁 --force/--allow-* · 事实卡 §10/§11 口径 · RELEASING 双重敏感 · schema 触即 STOP · assets manifest 同步纪律。
2. HG-TASK-DRAFT = approved 代签落表（task 人工闸表）。
3. 20-task-audit R1 pass 零阻塞后：**HG-AUDIT-R1 = approved 代签落表**（注明「2026-09-12 维护者会话授权 00 代签」· 审查文 `task_2_3_wiring_w6_host_completion_audit_R1_20260913.md`）。
4. **W2「封闭三条」张力裁决确认**：W2 注记（封闭三条）写于 SPEC 06 签署前；SPEC 06 §5.3 + F-W6-05 + 当棒 PROMPT 明文授权六新豁免（until_wave=W7 · W7 统一关账）→ 裁决执行侧按 SPEC 06 落地，非前提证伪不 STOP；留痕于 task R0 / 审查文 #7 / 本 invoke。

## 未做（禁区）

- 未亲自改码（00 只委派 · 30/40 由实现棒闭环）
- 未签发 HG-SPEC-SIGNOFF 之外的任何新授权 · 未执行 git tag / push / npm publish（仅人）

## 下一棒

30+40 闭环（GATE_VERIFY 全 approved 才动手）→ 波末 gate-check + task close --yes → `feat(2.3-W6): …` 独立提交 → 交付报告（PROMPT §6 格式 · 含六宿主取证卡结论）。
