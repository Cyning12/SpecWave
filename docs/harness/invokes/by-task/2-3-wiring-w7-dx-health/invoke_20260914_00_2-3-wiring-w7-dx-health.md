# invoke · 00 · 2.3 W7 编排与代签（委派链路 + HG-AUDIT-R1 代签落表）

> **hat_id**：`00-orchestrator`（本棒 00 授权由维护者 2026-09-12 会话预授权承载）· **日期**：2026-09-14  
> **task_slug**：`2-3-wiring-w7-dx-health`  
> **帽条文**：`assets/harness/prompts/00-orchestrator.md`

## 授权来源

维护者 2026-09-12 会话授权（与 2.2.0/2.2.1/2.3-W1–W6 各波同模式）：HG-SPEC-SIGNOFF / HG-TASK-DRAFT / HG-AUDIT-R1 由 00 代签落表并注明授权出处。

## 动作

1. 委派 W7 实现棒（收官波）走完整链路（10 → 20 → HG-AUDIT-R1 → 30+40 → close → 独立 commit），PROMPT 硬约束下达：S2 只新增不覆写 · 禁 --force/--allow-* · 事实卡 §10/§11 口径 · RELEASING 双重敏感 · pin-17 九豁免关账（失陈债机检自执行）· aider 行「注入层支持」措辞保持 · E5 熔断超量即停 · **不做 bump**（版本号/CHANGELOG 发布头归 00 后续 release 棒）。
2. HG-TASK-DRAFT = approved 代签落表（task 人工闸表）。
3. 20-task-audit R1 pass 零阻塞后：**HG-AUDIT-R1 = approved 代签落表**（注明「2026-09-12 维护者会话授权 00 代签」· 审查文 `task_2_3_wiring_w7_dx_health_audit_R1_20260914.md`）。

## 未做（禁区）

- 未亲自改码（00 只委派 · 30/40 由实现棒闭环 · 本 invoke 为 00 本职工件非实现码）
- 未签发 HG-SPEC-SIGNOFF 之外的任何新授权 · 未执行 git tag / push / npm publish（仅人）

## 下一棒

30+40 闭环（GATE_VERIFY 全 approved 才动手）：README 双语 13 宿主表 → pin-17 摘 9 豁免关账 → GLOSSARY 两处 → E2 离线 fixture → E5 修 62 错 → manifest rebuild + 四门 + gate-check + close → `feat(2.3-W7): …` 独立提交 → 交付报告（PROMPT §6 格式 · 含 pin-17 关账前后对照）。
