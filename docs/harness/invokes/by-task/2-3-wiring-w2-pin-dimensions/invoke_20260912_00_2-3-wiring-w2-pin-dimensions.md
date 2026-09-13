# invoke · 00 · 2.3 W2 钉面维度扩展 task 派工与签闸授权登记（含前提证伪裁决留痕）

> **hat_id**：`00` · **日期**：2026-09-12  
> **task_slug**：`2-3-wiring-w2-pin-dimensions`

## 授权来源

维护者 2026-09-12 会话授权：00 代签本次所有过程文档（与 2.2.0/2.2.1/2.3-SPEC/W1 同授权链）；00 委派 W2 实现棒走完整链路（10-task → 20-task-audit → HG-AUDIT-R1 代签 → 30+40 → close → 独立 commit `feat(2.3-W2): …`）。

## 动作

1. 委派 W2 棒：按 SPEC `docs/spec/2_3-wiring-completion/02_w2_pin_dimensions_v1.md` 起草 task 并走全链路。
2. **前提证伪处置（本棒 R0 → 00 裁决 · 已闭环）**：W2 棒 10-task R0 实测证伪 SPEC 02 原稿「校验①现状应 PASS」（`README.md:273`→`MIGRATION.md` 安装后真死链 · npm pack 实证；`README.zh-CN.md` npm 自动入包误报）→ W2 棒按硬约束 STOP 上报 → 00 裁决 **Q1=A**（白名单 = files[] ∪ npm 自动入包 `README*`/`LICEN(S)E*` 规则 · MIGRATION.md 入 files 为 task 内前置修复）· **Q2=仓根级**（docs/ 任意深度出范围）· **Q3=F-W2-03 改写为全深度口径预留注记** → SPEC 02 修订重签（commit 80eaa14 · HG-SPEC-SIGNOFF 00 代签）→ 放行续走。
3. 闸表落盘：HG-NEXT-PLAN / HG-SPEC-SIGNOFF / HG-TASK-DRAFT = approved（00 代签）；HG-AUDIT-R1 初置 pending，待 20-task-audit R1 审查文落盘后按授权代签 approved。
4. 硬约束交底：S2 只新增不覆写 · 禁 --force/--allow-* 绕过 · 不动 host-adapt schema · 不扩 W3–W7 · 不改根 README 宿主行（W7① 职责 · 本波机制先行 + 数据豁免过渡 until_wave: W7）· RELEASING.md 双重敏感 · 破坏性自证后全量还原 · 每步落盘后再继续 · 提交禁 `git add -A`。

## 下一棒

W2 棒自闭环：20-task-audit R1 → HG-AUDIT-R1 代签 → GATE_VERIFY → 30+40 → gate-check → task close --yes → 独立 commit → 交付报告回 00。
