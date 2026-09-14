# invoke · 00 · 2.3.0 release 编排与代签（委派链路 + HG-AUDIT-R1 代签落表）

> **hat_id**：`00-orchestrator`（本棒 00 授权由维护者 2026-09-12 会话预授权承载）· **日期**：2026-09-14  
> **task_slug**：`2-3-wiring-release`  
> **帽条文**：`assets/harness/prompts/00-orchestrator.md`

## 授权来源

维护者 2026-09-12 会话授权（与 2.2.0/2.2.1/2.3-W1–W7 各波同模式）：HG-TASK-DRAFT / HG-AUDIT-R1 由 00 代签落表并注明授权出处「2026-09-12 维护者会话授权 00 代签」。

## 动作

1. 委派本棒（release 收尾 bump）走完整链路（10 → 20 → HG-AUDIT-R1 → 30+40 → close → 独立 commit），PROMPT 硬约束下达：S2 只新增不覆写 · 禁 --force/--allow-* · 不动 host-adapt schema · assets 被碰即 manifest rebuild+verify · 事实卡 §10/§11 口径（.workbuddy 不动）· **禁 tag/push/publish/deprecate（仅人 · 交付到「待发版」为止）** · GATE_VERIFY 全 approved 才动手 · 逐条真实命令自证。
2. HG-TASK-DRAFT = approved 代签落表（task 人工闸表）。
3. 20-task-audit R1 pass 零阻塞后：**HG-AUDIT-R1 = approved 代签落表**（注明「2026-09-12 维护者会话授权 00 代签」· 审查文 `task_2_3_wiring_release_audit_R1_20260914.md`）。

## 未做（禁区）

- 未亲自改码（00 只委派 · 30/40 由实现棒闭环 · 本 invoke 为 00 本职工件非实现码）
- 未执行 git tag / git push / npm publish / npm deprecate（仅人）· 未签 HG-RELEASE（仍 pending）

## 下一棒

30+40 闭环（GATE_VERIFY 后开工）：package.json bump → CHANGELOG 2.3.0 节先行 → spec 索引行 → pins fix --yes → 叙事漂移巡检 → 联改（文档 + 8 测试文件）→ RELEASING 待办节 + ACCEPTANCE 档 + PLAN 台账 → 四门 + assets verify → gate-check → close → `chore(release): bump to 2.3.0 — wiring completion` 独立提交 → 交付报告（PROMPT §6 格式 + 移交清单）。
