# Invoke：20（task-audit R1）· 3-0-w1-ci-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w1-ci-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w1_ci_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 指令摘要

对 3.0 W1 CI hotfix mini task（闸基线扫描器空目录 ENOENT · bugfix 双轨跳 SPEC）做 R1 书面快审：常规核对（范围唯一 · .gitkeep 禁令 · 验收 6 条 · F-HOT-00–05 · R0–R5 · 闸表可机检）+ 逐条复核 10-task 留下的三条重点（验收 #4 充分性 · F-HOT-01 加性边界 · 同类面登记）；审查文落盘 `docs/harness/reviews/`。**禁止**改 task 实质、代签 HG-AUDIT-R1、改 src/scripts/test/fixtures。

## 独立复核证据（本帽实测）

- **场景 A（复现）**：git archive HEAD + git init + `rm -rf docs/tasks/active` + npm ci + 跑 w1-gate-generalization → 叶测 14 过 **1 红**（:179 · `ENOENT scandir docs/tasks/active` at scanner:101:22）—— 与 CI run 35066550895 逐字吻合
- **场景 B（掩盖实证）**：fresh clone + 本 task 文件入 active/（未修复）→ **15/15 全绿 exit 0** —— residual ① 真实成立 ⇒ 验收 #4 显式删目录负向锁必要且充分（叠加 #1 入永久套件恒跑锁）
- F-HOT-01：:190-191 比对面仅解构 `files` 键 · meta 零比对 · console 仅断言 exit status ⇒ meta 加性键零风险；fixture 实测 75 文件/232 行/11 假与 task、:179 断言三方一致
- 同类面：全仓 readdirSync 27 处抽核 · scanner:101 唯一真红面成立 · 残余 3 组低危定性成立 · 「16 处」计数与自列清单（19 处）不符 → advisory A1
- 机检：verify BLOCKED exit 2（HG-AUDIT-R1 pending ❌ 拒 30）· task lint PASS · HEAD `f9f9c02` · active/ 零 git 跟踪

## 结论

**PASS**（blocking 0 · advisory 2：A1 登记节计数瑕疵 · A2 F-HOT-01 加性原则成文留白）—— 审查文：`docs/harness/reviews/task_3_0_w1_ci_hotfix_audit_R1_20260916.md`

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 代签 · 维护者本窗授权模式 · 待审查文落盘后翻转）
- ⛔ 未改 task / src / scripts / test / fixtures（S2 只新增：本 invoke + 审查文）
- ⛔ HG-AUDIT-R1 仍 pending ⇒ 未附 30 Prompt，仅出维护者签闸清单

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 20-task-audit R1 快审完成落盘（mini task · 场景 A/B 双实证） |
