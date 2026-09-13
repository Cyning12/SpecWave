# invoke · 10-task · 2.3 W1 pins 机制补强 task 起草（SPEC 01 五项范围转可验收 task）

> **hat_id**：`10-task` · **日期**：2026-09-12  
> **task_slug**：`2-3-wiring-w1-pins-hardening`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-12 会话授权（00 委派 W1 实现棒走完整链路）· HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文 + 签闸 · 本帽不代签）。

## 动作

1. 起草 `docs/tasks/active/task_2_3_wiring_w1_pins_hardening.md`（蓝本 SPEC `docs/spec/2_3-wiring-completion/01_w1_pins_hardening_v1.md` · signed）。
2. 预填 Harness 元信息：test_strategy=required / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / **wiki_delta=none（预填）** / invoke_retention_profile=default / close_pr_policy=exempt。
3. 范围五项（SPEC 01 §3 逐字承接）：① pin-08 弱钉改严（机械口径本 task 定稿：双判 (A) 状态/描述列含版本串 + (B) slug 列含版本串或 `X_Y-` 前缀 · 反例/回归双向推演已过）；② CHANGELOG/MIGRATION/AGENTS 三面纯数据入钉 pin-13/14/15；③ pin-04/06/07/10/11/12 失配 fixture 补全；④ `extractSpecSlug` 目录型 README/index 父目录回退 + `--spec` 目录路径干净 exit 1 止血；⑤ unfixable 误报评估文落盘（实现非必须）。
4. 非范围显式列：引擎架构 / unfixable 实现 / S2 / git 自动化 / pin-01 证伪 / RELEASING 措辞 / --force 禁新增 / W2–W7 / 发版动作。
5. 验收 10 条全部机械可断言（①–⑦ 对齐 SPEC 01 §7 · ⑧–⑩ 增补 TEST-LOCK 影响面 / gate-check+close / 提交边界）。
6. failure_paths 8 行（F-W1-01..07 对齐 SPEC §8 + F-T-01 闸纪律）+ R0–R5 思考轮槽 + 控制表（early_stop=R5 · residual_risks ×3）。
7. `npx spec-wave task lint --file docs/tasks/active/task_2_3_wiring_w1_pins_hardening.md` → PASS（输出见 00 汇报/自检）。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / `package.json` / 任何文档面（30 的事 · 且 HG-AUDIT-R1=pending）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 git tag / push / npm publish（仅人）
- 未扩大范围到 W2–W7

## 下一棒

20-task-audit R1 书面审 → 审查文落盘 `docs/harness/reviews/` → **签 HG-AUDIT-R1=approved**（2026-09-12 维护者会话授权 00 代签）→ 30/40（`feat(2.3-W1): …` · 禁 git add -A · 禁 tag/push/publish）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w1_pins_hardening.md` 过闸扫描。
