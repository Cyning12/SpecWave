# invoke · 00 · 2.3 W1 pins 机制补强 task 派工与签闸授权登记

> **hat_id**：`00` · **日期**：2026-09-12  
> **task_slug**：`2-3-wiring-w1-pins-hardening`

## 授权来源

维护者 2026-09-12 会话授权：00 代签本次所有过程文档（与 2.2.0/2.2.1/2.3-SPEC 同授权链）；00 委派 W1 实现棒走完整链路（10-task → 20-task-audit → HG-AUDIT-R1 代签 → 30+40 → close → 独立 commit `feat(2.3-W1): …`）。

## 动作

1. 委派 W1 棒：按 SPEC `docs/spec/2_3-wiring-completion/01_w1_pins_hardening_v1.md`（signed）起草 task 并走全链路。
2. 闸表落盘：HG-NEXT-PLAN / HG-SPEC-SIGNOFF / HG-TASK-DRAFT = approved（00 代签）；HG-AUDIT-R1 初置 pending，待 20-task-audit R1 审查文落盘后按授权代签 approved。
3. 硬约束交底：S2 只新增不覆写 · 禁 --force/--allow-* 绕过 · 不动 host-adapt schema · 不扩 W2–W7 · RELEASING.md 双重敏感（改措辞必跑全量 npm test）· SPEC 前提有误即 STOP 上报 · 每步落盘后再继续 · 提交禁 `git add -A`。

## 下一棒

W1 棒自闭环：20-task-audit R1 → HG-AUDIT-R1 代签 → GATE_VERIFY → 30+40 → gate-check → task close --yes → 独立 commit → 交付报告回 00。
