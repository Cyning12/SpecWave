# invoke · 00 · 2.3 W4 A5+A6 闸语义接线 task 派工与签闸授权登记

> **hat_id**：`00` · **日期**：2026-09-13  
> **task_slug**：`2-3-wiring-w4-gate-wiring`

## 授权来源

维护者 2026-09-12 会话授权：00 代签本次所有过程文档（与 2.2.0/2.2.1/2.3-SPEC/W1/W2/W3 同授权链）；00 委派 W4 实现棒走完整链路（评审文 → 10-task → 20-task-audit → HG-AUDIT-R1 代签 → 30+40 → close → 独立 commit `feat(2.3-W4): …`）。

## 动作

1. 委派 W4 棒：按 SPEC `docs/spec/2_3-wiring-completion/04_w4_gate_wiring_v1.md`（signed · HG-SPEC-SIGNOFF approved 00 代签 · **修订重签#2 fa24638**）走全链路。
2. **证伪裁决留痕（裁决 A）**：W4 棒 R0 前提复核证伪初版 SPEC 04 §1 两项（G2/INVOKE-HATS 存在级闸已接线 · yaml note 过期）→ STOP 上报 → 00 循 W2 先例裁决修订重签（fa24638）· §5.4 过渡定案（闸新行为不追溯存量 + G4 warn-only · 存量摸底 91.5%/72.9%/44% 入档）· 范围⑦含 note 回写 → 放行续走。
3. 闸表落盘：HG-NEXT-PLAN / HG-SPEC-SIGNOFF / HG-TASK-DRAFT = approved（00 代签）；HG-AUDIT-R1 初置 pending，待 20-task-audit R1 审查文落盘后按授权代签 approved（**评审文落盘+R1 通过为前置** · 评审文已落盘 `w4_gate_wiring_plan_review_20260913.md`）。
4. 硬约束交底：S2 只新增不覆写 · 禁 --force/--allow-* 绕门禁 · 不动 host-adapt schema · RELEASING.md 双重敏感（本波零改动）· 对外文案守事实卡 §10/§11（reviews.CLOSE 升级后 §11 禁称维持 · F-W4-05）· failClosed 不可稀释（误红不误绿）· W3 教训（CLI 行为改动必须 bin 真实命令验收）· 每步落盘后再继续 · 提交禁 `git add -A`。
5. R0 前提复核结论登记：修订后 SPEC 前提全实测成立；存量摸底四组数据（91.5%/72.9%/44%/90.7%）入档评审文 §1；F-W4-01 不触发熔断。

## 下一棒

W4 棒自闭环：20-task-audit R1 → HG-AUDIT-R1 代签 → GATE_VERIFY → 30+40 → gate-check → task close --yes → 独立 commit → 交付报告回 00。
