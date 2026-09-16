# Invoke：20（task-audit R1）· 3-0-w1-schema-leap

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w1-schema-leap` |
| task_paths | `docs/tasks/active/task_3_0_w1_schema_leap.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 指令摘要

对 W1 task（3.0 核心 breaking 波 · 适配表 schema 跃迁 schema_version/hooks/defaults+extends/command_sets + 闸判定泛化 + HG-SCHEMA-CHANGE 闸 + MIGRATION 草案）做 R1 书面审查：对照 SPEC 02 / schema 评审文 / PLAN W1+硬约束 3/4/12/15 / 政策边界逐项核对范围/非范围/验收/failure_paths/思考轮；逐条复核 10-task 留下的五条重点（OQ-1 两点定稿 · OQ-5 比对面纪律与快照再生成 · 验收#10 与 F-W1-13 张力 · pin-17 四禁与 pin-14 · F-W1-08–15 必要性）；审查文落盘 `docs/harness/reviews/`。**禁止**改 task 实质、代签 HG-AUDIT-R1、改 SPEC/PLAN/src/test/fixtures/脚本。

## 独立复核证据（本帽实测）

- `npm test` 全量复跑：**607 tests / 116 suites / 606 pass / 0 fail / 1 skip**（原 4 环境红已消）· typecheck **0 错** · pins **17/17**（pin-14/pin-17 含）· HEAD `98d2062` —— 与基线节逐字一致
- 快照再生成比对：挪开 W1 task 重扫 → 75/232/12/0/11 与 fixture 逐字一致（含 W1 task 时 76/237/13/1/12 · 结构 diff 恰好仅 W1 条目）；行级复核 blocks 含 30 = 139 · 翻转候选 0 · 无闸节 11 文件清单一致
- gate 系断言 grep：断言面 = exit code + JSON 键集 + `/→ 30 不可开工|BLOCKED/` 文案片段；test/ 内 `| HG-… |` 字面全为输入 fixture（8 件）· formatGateCheck 测试零 import
- 行号抽核 12 处全中（schema.ts/commands.ts/materialize.ts/table.ts/cmd.ts/cli-shared.ts/gates.ts/cli-pins.ts）· `grep hooks src`=0 · mvp-hosts.yaml verify ×13 · task-cmd close=renameSync 归档 ✓
- 机检：`gate-check`/`verify` 对 W1 task 均咬住 HG-AUDIT-R1 pending（❌ 拒 30 · VERIFY BLOCKED）· `task lint` PASS
- ⚠️ 过程事故：裸跑扫描器误覆写 fixture（默认 out 即基线路径）→ 确定性复原（78898 字节一致 · diff 仅 W1 条目）→ 转 advisory A1

## 结论

**PASS-with-issues**（blocking 0 · advisory 3：A1 扫描器默认 out/绝对路径警示 · A2 #5② 行级比对有效锁口径 · A3 F-W1-11 可选类型层加强）—— 审查文：`docs/harness/reviews/task_3_0_w1_schema_leap_audit_R1_20260916.md`

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 代签 · 维护者 2026-09-16 授权模式）
- ⛔ 未改 task / SPEC / PLAN / src / test / fixtures / 脚本实质内容（S2 只新增：本 invoke + 审查文）
- ⛔ HG-AUDIT-R1 仍 pending ⇒ 未附 30 Prompt，仅出维护者签闸清单

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 20-task-audit R1 审查完成落盘 |
