# invoke · 10-task · 2.3 W4 A5+A6 闸语义接线 task 起草（SPEC 04 转可验收 task · 评审文先行）

> **hat_id**：`10-task` · **日期**：2026-09-13  
> **task_slug**：`2-3-wiring-w4-gate-wiring`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-12 会话授权（00 委派 W4 实现棒走完整链路）· HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文 + 签闸 · 本帽不代签）。

## R0 前提复核（本帽实测 · 曾证伪 → 00 裁决 A → SPEC 修订重签#2 后全成立）

- **证伪留痕**：SPEC 04 初版 §1 表两项不成立——G2「verify/close 无 reviews 闸」（实证 b7c15ae T4 + 5eac847 T6 已接线存在级）· INVOKE-HATS「close 无 invoke 集合闸」（同 T6 close_invoke 已接线）；根因 = discipline-coverage.yaml note 停在 2026-08-24 前未回写。**STOP 上报 → 00 裁决 A → SPEC 04 修订重签（fa24638）**，范围②⑤改「存在级→结论级/帽级升级」· §5.4 过渡定案 · ⑦含 note 回写。
- 修订后前提复核全成立：全 src 无审查文结论解析（grep 实证）· G4 仅 W4 warn-only（`cli-checks.ts:838-843`）· 裸 verify 用法错（`cli.ts:775` · 钉面 cli-verify-spec.test.ts:220 + lib-smoke :63/:72）· lint-done slug 级（`cli-task-extra.ts:323-344`）· A6 代理注释在（`cli-status.ts:94-97`）。
- 存量摸底（59 done task · 复用 cli-checks 单一实现源）：G2 存在率 54/59=91.5% · INVOKE-HATS 43/59=72.9% · G4 26/59=44%（完整 R0–R5 12/26）；**结论可机读率实测 49/54=90.7%**（v2 节标题起首口径 · 三版修正留痕：行级 47 → 节级 29（NEG 方向错）→ 48 → v2 49）。
- 基线实测（干净树）：typecheck 0 错 · `npm test` 505/505 · `pins check` 17/17。
- F-W4-01 判读：不追溯定案下不触发熔断（评审文 §1）。

## 动作

1. **评审文先行落盘**（D-23-W4-REVIEW-FIRST 第一交付物）：`docs/harness/reviews/w4_gate_wiring_plan_review_20260913.md` —— 五问逐项定稿（G2 结论级 v2 解析口径 / G4 W5–W7 warn-only / 裸 verify done failClosed+active 信息报告 / lint-done 帽级 failClosed / A6 观测面如实化）+ 存量摸底 + 「新 task」判定口径（目录分档 + 数据清单）+ 豁免格式钉死（F-W4-04 四字段）+ G4 退出条件写死 + 事实卡 §11 维持禁称 + 旧测影响面 8 行。
2. 起草 `docs/tasks/active/task_2_3_wiring_w4_gate_wiring.md`（蓝本 SPEC 04 修订重签#2）。
3. 预填 Harness 元信息：test_strategy=required / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / wiki_delta=none（预填）/ invoke_retention_profile=default / close_pr_policy=exempt。
4. 范围九项：①评审文（已落盘）②G2 结论级 ③G4 W5–W7 ④裸 verify ⑤lint-done 帽级 ⑥A6 reviews.CLOSE ⑦yaml 回写 ⑧豁免数据（reviews 10 + invoke_hats 16）⑨测试联改（评审文 §8 影响面）。
5. 非范围十项显式列（deferred 三项 / hooks / 新豁免旗标 / 既有闸语义 / TASK_TEMPLATE / 事实卡解禁 / RELEASING / 发版动作 / --force / S2 CLI 写）。
6. 验收 8 条全部机械可断言（①–⑥ 对齐 SPEC 04 §7 · ⑦ bin 面硬条款（W3 教训）· ⑧ close+提交边界）+ failure_paths 9 行（F-W4-01..08 + F-T-01）+ R0–R5 思考轮槽 + 控制表（early_stop=R5 · residual_risks ×4）。
7. `node bin/specgate.js task lint --file docs/tasks/active/task_2_3_wiring_w4_gate_wiring.md` → **PASS**（W3 占位符 warn · draft 期合法）。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / 任何文档面（30 的事 · 且 HG-AUDIT-R1=pending）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 git tag / push / npm publish（仅人）
- 未扩大范围 · 未碰 RELEASING.md / host-adapt schema / 事实卡

## 下一棒

20-task-audit R1 书面审（审评审文 + task 草稿）→ 审查文落盘 `docs/harness/reviews/` + invoke_\*_20_\* → **签 HG-AUDIT-R1=approved**（2026-09-12 维护者会话授权 00 代签）→ 30/40（`feat(2.3-W4): …` · 禁 git add -A · 禁 tag/push/publish）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w4_gate_wiring.md` 过闸扫描。
