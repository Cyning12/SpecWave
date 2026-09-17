# Invoke：20（task-audit R2 · 复审）· 3-0-w7-closeout-external

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w7-closeout-external` |
| task_paths | `docs/tasks/active/task_3_0_w7_closeout_external.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |
| round | R2（R1 后续复审） |

## 指令摘要

00 指令 R2 复审：10-task 已按 R1 的 B1 + A1–A6 回填（仅改 `docs/tasks/active/task_3_0_w7_closeout_external.md`）。逐项复核 B1 是否闭合（① 精确枚举豁免模式 ② 冻结计数 ③ 正负 fixture ④ 扫描面边界 · 与「不整体放宽/不追溯存量」自洽），A1–A6 逐条核对落笔忠实度，出 R2 结论。**禁止**改 task 实质、代签 HG-AUDIT-R1。

## 独立复核证据（本帽实测）

- **B1 闭合判定（决定性）**：本审自研豁免模拟脚本，按 task S7.3 ② 的 5 条 `人工闸` 豁免（`^#{2,6}\s*.*人工闸` / `人工闸表` / `formatGateCheck 人工闸` / `parseHumanGates`·`human_gate`·`GATE` / `### 人工闸`）与 2 条 `门控` 豁免（`门控 skip` / `spec-kit 门控`）逐行判定：
  - **① forbidden 面（README 双语/GLOSSARY/RELEASING/MIGRATION/delivery/**/docs/ontology/**）残留 = 9**：`人工闸` 5（`delivery/安全设计.md:217/:290/:598/:780` · `delivery/系统设计.md:1284` 行内 ``  `## 人工闸` ``）+ `门控` 4（`delivery/research_report.md:120/:166/:172` · `delivery/安全设计.md:566` 的 `后门控制` 裸子串误报）
  - **①+docs/spec（⑤）残留 = 16**：`人工闸` 11（+ `docs/spec/2x-host-adapt/00_policy_and_boundaries.md:36` · `02_commands_catalog_draft_v1.md:15` · `03_borrow_research_openspec_and_peers_v1.md:118` · `docs/spec/self-tech-graph/reference/architecture_1.2.2.md:14` · `cli_surface_1.2.2.md:47/:57`）+ `门控` 5（+ `docs/spec/3_0-architecture-leap/08_w7_closeout_external_v1.md:62`）
  - ⇒ **「豁免后余量 = 0」不成立 · B1 未闭合**。
- **冻结计数核对**：`人工闸` 非 S2 **119**（出现计数；按行计 98）· 全 tracked **450**；`门控` 扫描面 **16** · 全 tracked **90** —— 与 task ③ 一致（口径注：119 为计次，逐行报告会读 98 行 ≠ 119，见 A11）
- **决定性自冲突**：S7.5 K-3（task :153）强制把 `research_report.md:172` 改为「内核 SDD 门控为流程性…」——该文本含 `门控` 且不带 `spec-kit` 前缀 ⇒ 落实 K-3 即在 forbidden 面新增残留；S7.3 与 S7.5 互相拆台
- **A1–A6 落笔核对（全落地）**：A1 :47 裁定块「00 将于代签时显式确认偏差 + 建议 SPEC §10 加注记 + tag 权限统一取严（SPEC §3⑩/RELEASING⑤/README:380 Agent 可 tag 本波不执行 · 3.0.0 tag 留维护者 · 差异登记留 W7 报告）」✓ · A2 :6/:297 改 `../done/task_3_0_w6_observability_audit.md`（链接机检确认修好）· S7.7 :172/:178 冻结基线「排除 current in-flight active task · 26」✓ · A3 :84/R0 31 件 ✓ · A4 :78/R0 53 文件 ✓ · A5 :109/:116/#7 ≤300 硬判据 ✓ · A6 :217 补 `release-tag-identity`（tag-gated）✓
- **链接机检**：W7 task 自身坏链仅剩 1 处 = :180 负 fixture 字面 `../.workbuddy/output/nope.md`（设计示例 · 被「排除 active task」口径覆盖）
- **闸机检**：`task lint` PASS（W3 占位符 warn draft 期合法）· `gate-check` **exit 2**（仅渲染 HG-TASK-DRAFT approved + HG-AUDIT-R1 pending 拒 30 · HG-RELEASE 不渲染）

## 结论

**R2 = 仍 BLOCKING（B1 未闭合）· 不可签为通过**。A1–A6 六条回填全部落地且忠实；但 B1 的闭合判据经本审独立模拟不成立（① 面残留 9 · ①+docs/spec 16），且 S7.5 K-3 ↔ S7.3 `门控` 豁免自冲突（K-3 强制写入的文本本身即残留；另含行内 `## 人工闸` 行首锚失效、`后门控制` 裸子串误报、`门控` 竞品义未枚举）。Advisory 4：A8 基线 :112「其余 ~48」应 ~46 · A9 基线 :87 仍写 `门控` 77（S7.3③ 为 16/90）· A10 S7.7「排除 active」与「含 active/ 新档」措辞须参数化说明 · A11 冻结计数计次/计行口径。**下一棒仍为 10-task**（按 R2 四·B1 的 (a)/(b) 路径闭合）；不代签；不附 30 Prompt。审查文：`docs/harness/reviews/task_3_0_w7_closeout_external_audit_R2_20260917.md`

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 代签 · 维护者 2026-09-16 授权模式）
- ⛔ 未改 task / SPEC / PLAN / src / assets / test / package.json / 物料 实质内容（S2 只新增：本 invoke + R2 审查文）
- ⛔ 仍存 blocking（B1）且 HG-AUDIT-R1 pending ⇒ 未附 30 Prompt，仅出维护者签闸清单；下一棒 = 10-task 闭合 S7.3

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 20-task-audit R2 复审完成落盘 · A1–A6 全落地 · B1 独立模拟未闭合（残留 9/16） · 结论仍 blocking · 退回 10-task |
