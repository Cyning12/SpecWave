# invoke · 30-execute + 40-self-check · 3-0-1-w2-gate-table-contract

> **hat_id**：`30` + `40`（同棒）· **日期**：2026-09-18  
> **task_slug**：`3-0-1-w2-gate-table-contract`  
> **性质**：W2 闸表契约封堵（文档 4 列 + 空解析告警 + 样例入测 · 未发版 · 未 commit）

## GATE_VERIFY（首输出）

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_1_w2_gate_table_contract.md
| gate | status | blocks_30 | 30 影响 |
|------|--------|-----------|--------|
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
| HG-W2-REVIEW | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_1_w2_gate_table_contract.md
```

三闸 approved → **可开工**。契约真值：C1–C8（stderr + `--json#warnings` 只增 · 不放宽 `GATE_ROW_RE` · 不改 `evaluateMayStart30` / exit）。

## 改动摘要

| 文件 | 变更 |
|------|------|
| `README.md` / `README.zh-CN.md` | 最小骨架闸表 3→4 列 + 4 列/id 禁内嵌粗体提示 |
| `assets/harness/templates/TASK_TEMPLATE.md` | 注明 id 单元格勿内嵌粗体 |
| `src/cli-shared.ts` | `parseHumanGates`：节存在但 0 行 → 可收集告警（可选 `warnings` sink） |
| `src/cli/gates.ts` | `formatGateCheck` 回传 `warnings`；`gate-check` stderr / `--json#warnings` |
| `src/cli/verify.ts` | `--json` 只增 `warnings`；人读镜像 stderr |
| `test/w2-gate-table-contract.test.ts` | A1–A7 红测（3/4 列 · 内嵌 `**` · README/模板入测 · 存量零变化） |

**未触**：`GATE_ROW_RE` 放宽 · `evaluateMayStart30` · schema · W3+ · package bump · tag/push/publish。

## 自证（A1–A9）

| # | 结果 | 证据 |
|---|------|------|
| A1 | PASS | README / zh-CN 4 列 + 提示；TASK_TEMPLATE id 禁内嵌粗体 |
| A2 | PASS | 空节→stderr WARN + `--json#warnings`；exit/`may_start_30` 不变 |
| A3 | PASS | 3 列告警；4 列无告警+may_start；3 列 pending 不回退 |
| A4 | PASS | id 内嵌 `**` → miss + 告警 |
| A5 | PASS | README/模板逐字入测非空 |
| A6 | PASS | docs/tasks 二次解析相等 · 有闸行无空告警 |
| A7 | PASS | GATE_ROW_RE 未放宽 · 未改 evaluateMayStart30 |
| A8 | PASS | typecheck / test(881) / build / test:lib(6) |
| A9 | PASS | gate-check exit 0 · task close（本棒） |

## 禁区自检

未 `npm publish` / tag / push / deprecate · 未 `git commit` · 未 `git add -A`（逐文件显式 add）· 未 bump 3.0.1 · 未触 schema。

## 下一棒

维护者：逐文件确认 stage → `fix(3.0.1-W2): gate table 4-col docs + empty-parse warnings` → 开 W3 或 release 裁量。

## 关账

`gate-check` exit 0 · `task close --yes` → **CLOSE: PASS** · 归档 `docs/tasks/done/task_3_0_1_w2_gate_table_contract.md`。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 30 开工：GATE_VERIFY PASS · 落盘本 invoke · 开始改码 |
| 2026-09-18 | 30/40 收口：实现+红测+四门+close PASS · 未发版 · 未 commit |
