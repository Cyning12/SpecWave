# Invoke：10（task 起草）· 3-0-1-w4-docs-precision

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-1-w4-docs-precision` |
| task_paths | `docs/tasks/active/task_3_0_1_w4_docs_precision.md` |
| plan_path | `docs/roadmap/PLAN_3_0_1_patch_v1_zh.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |

## 授权来源

00 委派：W1–W3 均已 CLOSE: PASS；维护者 2026-09-18 签收 PLAN（HG-NEXT-PLAN=approved）并授权 00 代签过程文档闸；本帽只起草 **W4** task，**不代签任何闸**、不改 `src/`、不开 W5/W6。

## 动作

1. 通读 PLAN **W4 节** · 硬约束 **8/9/10** + 验收报告镜像 §6.2 P2-1/P2-3 · §6.3 P3-3/P3-5/P3-6。
2. 对照先例 `docs/tasks/done/task_3_0_1_w3_pins_io_failclosed.md`（同系列元信息 / 闸表 4 列 / 无 SPEC / pins 敏感）。
3. **再钉 file:line 现值**（2026-09-18）：`MIGRATION.md:131-133` · `CHANGELOG.md:27-29` · `package.json:25-37`（`:30` README.md）· `delivery/research_report.md:170/:395` · `scripts/check-doc-links.mjs:4/:24` · `.gitignore:4` · `git ls-files .workbuddy/` =9。
4. 落盘 `docs/tasks/active/task_3_0_1_w4_docs_precision.md`（slug `3-0-1-w4-docs-precision` · status `draft` · HG-TASK-DRAFT/HG-AUDIT-R1=pending · HG-SPEC-SIGNOFF=N/A · 闸表 4 列 · id 单元格无内嵌 `**`）。
5. 范围严格对齐 PLAN W4 五项；非范围钉死：不迁 `.workbuddy` 文件、不改 `.gitignore`、不动 S2 覆写、不提前开 W6-①；`test_strategy=required`（pins 钉面敏感说明）。
6. `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w4_docs_precision.md` → 修至 PASS。

## 未做（禁区）

- 未改 `src/` / `test/` / 产品文实质内容 / 单测实现（仅起草 task + 本 invoke）
- 未开 W5/W6 task · 未代签任何闸 · 未 git commit / push / publish

## 下一棒

20-task-audit R1（重点：五项口径齐全 · 非范围含不迁 `.workbuddy`/不改 `.gitignore`/不提前 W6-① · pins 全量测 · grep/pack/links 断言）→ 审查文落 `docs/harness/reviews/` → 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 → 30/40（GATE_VERIFY 首输出 → `fix(3.0.1-W4): …` → 自证 → `task close --yes`）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 10-task：W4 docs-precision task + 本 invoke 落盘 · lint 见同窗回报 |
