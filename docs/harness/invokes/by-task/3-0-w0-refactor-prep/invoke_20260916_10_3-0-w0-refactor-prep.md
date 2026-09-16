# Invoke：10（task 起草）· 3-0-w0-refactor-prep

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-w0-refactor-prep` |
| task_paths | `docs/tasks/active/task_3_0_w0_refactor_prep.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 指令摘要（委派 Prompt）

00 委派（维护者 2026-09-16 本窗双签 HG-NEXT-PLAN + HG-SPEC-SIGNOFF approved 后）：起草 3.0 W0 首波 task —— ① 必读 SPEC 01/政策边界/系列 README/PLAN W0 节 + done 2.4 模板；② **复核现值**（SPEC 行号/计数为快照）：实读三 god-file 核行数、W0.2 消费者清单逐行 grep 实证、W0.4 模块边界逐函数核实并**定稿**（barrel 保留 + 消费者零改动不可动）；③ **基线复跑**（npm test / typecheck / pins check 开工前全绿基线）；④ 六重锁具体化为可执行判据 + E3「删了不补=未完成」+ M1 验收文硬要求 + 执行回退粒度（checks→host→cli · E3 隔离 · 禁 git add -A · W0-SPLIT 降级入 failure_paths）；⑤ `### 人工闸` 表至少含 `HG-AUDIT-R1 | pending | 30`。禁区：不实现代码 · 不改 SPEC/PLAN/reviews · 不签发任何闸 · S2 只新增 task 文件。

## 动作与独立复核证据（本帽实测）

- **行数复核**：cli-host 1458 · cli 1318 · cli-checks 1007 = 3783（src 总 9855 · 38.4%）—— 与 SPEC 快照一致
- **消费者 grep 实证**：cli-checks 5 处 + 类型 1 处（lib/cli-task-extra.d.ts:1）✓ 快照属实；**cli-host 新发现 4 个测试直接消费者**（host-adapt-sticky:10-14 · init:17 · w6-three-hosts:9 · w6-2_3-six-hosts:9）—— SPEC §5.2 未列 ⇒ 锁② 断言面扩 10 文件（定稿差异 D6）
- **export 逐个数过**：cli-checks 43 / cli-host 9 / cli 7；W0.4 归属逐符号核实 ⇒ 定稿差异 D1–D6（补 4 个未列导出符号归属 · sniffHostContract barrel 直留 · evalClose* 实测 13 · parseCoreCommandBasename 全名 · 内部符号口径）
- **基线全量复跑**：npm test 607/116/602+4fail+1skip（4 fail 全为 npm cache root-owned EPERM 环境红 · 干净 cache 对照 24/24 转绿 ⇒ 有效基线 606+1skip · F-W0-07）· typecheck 0 错 · build 0 错 · test:lib 6/6 · pins 17/17 · spawn 同口径实测 ≈588（路线研究 354 旧快照 · F-W0-08 重建）
- 落 `docs/tasks/active/task_3_0_w0_refactor_prep.md`；`task lint` PASS（仅 W3 draft 合法占位）；GATE_VERIFY 实证闸表可机检

## 关键交付与回执（00 授权落笔）

1. **HG-TASK-DRAFT 翻转**（00 回执授权 · 2026-09-16）：pending → approved「00 代签 · 授权真值：维护者本窗「签收，授权00签收后续所有文档」（HG-RELEASE 不在范围）」；头行同步
2. **A1 搭车修**（20 审 advisory · 00 裁定）：D6 行 `host-adapt-sticky.test.ts:11-15` → `:10-14`
3. **HG-AUDIT-R1 代签落笔**（00 裁定 · 2026-09-16）：pending → approved，依据审查文 `docs/harness/reviews/task_3_0_w0_refactor_prep_audit_R1_20260916.md`（R1 · PASS-with-issues · blocking 0 · advisory A1–A4 · A1 已搭车修 · A2/A3/A4 带入 30 执行要求）；头行同步
4. 本两件 invoke 补落（00 裁定授权 · 2.4.2「补落后三件套齐」先例）

## 未做（禁区）

- 未改 `src/` / `test/` / `bin/` / `assets/` / SPEC / PLAN / reviews 既有档（30 的事 · 本帽只起草）
- 未自行签发任何闸（两次翻闸均为 00 明确回执授权后落笔）
- 未执行 git commit / tag / push / publish（四动作仅人）
- 未碰工作区上游 untracked 产物（SPEC 系列 / PLAN / 审查文）

## 下一棒

30 实现棒：GATE_VERIFY 首输出 → 按 task 范围 ①–⑥ 执行（顺序 cli-checks → cli-host → cli · E3 隔离 commit · 锁①–⑥ 全绿 · M1 验收文落盘 reviews/）→ `task close --yes` 关账。20 审 A2/A3/A4 advisory 带入 30 执行要求。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 10-task 起草完成 · lint PASS · 00 授权后补落本 invoke（三件套之一） |
