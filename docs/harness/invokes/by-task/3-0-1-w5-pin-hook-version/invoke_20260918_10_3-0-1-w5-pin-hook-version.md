# Invoke：10（task 起草）· 3-0-1-w5-pin-hook-version

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-1-w5-pin-hook-version` |
| task_paths | `docs/tasks/active/task_3_0_1_w5_pin_hook_version.md` |
| plan_path | `docs/roadmap/PLAN_3_0_1_patch_v1_zh.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |

## 授权来源

00 委派：W1–W4 均已 CLOSE: PASS；维护者 2026-09-18 签收 PLAN（HG-NEXT-PLAN=approved）并授权 00 代签过程文档闸；本帽只起草 **W5** task，**不代签任何闸**、不改 `src/`、不开 W6。

## 动作

1. 通读 PLAN **W5 节** · 硬约束 **3/5**（及 7/8/10）+ 验收报告镜像 §6.2 P2-2。
2. 对照先例 `docs/tasks/done/task_3_0_1_w4_docs_precision.md`（同系列元信息 / 闸表 4 列 / 无 SPEC）。
3. **再钉 file:line 现值**（2026-09-18）：`src/host/hooks.ts:20-21`（`hookGuardCommand`）· `:79-84`（条目识别）· `:183-193`（shell-hook）· `src/host/materialize.ts:455-543`（`:466`/`:512`）· `src/host/cmd.ts:53-54`/`235-262`/`129-140` · `docs/guides/使用手册-v3.0.0-zh.md:469-488` · `RELEASING.md`（缺钉版 CI 专节）· `package.json` version=`3.0.0`。
4. 落盘 `docs/tasks/active/task_3_0_1_w5_pin_hook_version.md`（slug `3-0-1-w5-pin-hook-version` · status `draft` · HG-TASK-DRAFT/HG-AUDIT-R1=pending · HG-SPEC-SIGNOFF=N/A · 闸表 4 列 · id 单元格无内嵌 `**`）。
5. 范围：可选旗标 `--pin-hook-version[=SEMVER]` · 缺省 kit_semver · **不带旗标与 3.0.0 逐字节一致** · RELEASING/手册补 CI 建议；非范围钉死：不改默认物化 · 不改 hook-guard 分发 · 不引入锁文件 · 转默认归 3.1；`test_strategy=required`。
6. `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w5_pin_hook_version.md` → 修至 PASS。

## 未做（禁区）

- 未改 `src/` / `test/` / 产品文实质内容 / 单测实现（仅起草 task + 本 invoke）
- 未开 W6 task · 未代签任何闸 · 未 git commit / push / publish

## 下一棒

20-task-audit R1（重点：默认字节零漂移 · marker 双形态 · 实验性/缺省关闭文案 · update 挂面是否同挂 · 硬约束 3 边界）→ 审查文落 `docs/harness/reviews/` → 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 → 30/40（GATE_VERIFY 首输出 → `fix(3.0.1-W5): …` → 自证 → `task close --yes`）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 10-task：W5 pin-hook-version task + 本 invoke 落盘 · lint 见同窗回报 |
