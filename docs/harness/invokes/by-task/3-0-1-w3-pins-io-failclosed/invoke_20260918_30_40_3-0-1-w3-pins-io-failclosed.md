# invoke · 30-execute + 40-self-check · 3-0-1-w3-pins-io-failclosed

> **hat_id**：`30` + `40`（同棒）· **日期**：2026-09-18  
> **task_slug**：`3-0-1-w3-pins-io-failclosed`  
> **性质**：W3 pins IO fail-closed（`readTruthVersion` try/catch → exit 2 + `PINS: BLOCKED` · 未发版 · 未 commit）

## GATE_VERIFY（首输出）

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_1_w3_pins_io_failclosed.md
| gate | status | blocks_30 | 30 影响 |
|------|--------|-----------|--------|
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_1_w3_pins_io_failclosed.md
```

双闸 approved → **可开工**。契约真值：P3-8 / PLAN W3（缺文件原文案保留 · 三负向→exit 2 + 前缀 · 不改 PASS/`pins fix`）。

## 改动摘要

| 文件 | 变更 |
|------|------|
| `src/cli-pins.ts` | `readTruthVersion`：读+parse 包 try/catch → `fail(..., 2)`；ENOENT 保留「真值源缺失」；收敛 TOCTOU |
| `test/w3-pins-io-failclosed.test.ts` | A1–A6 红测（截断 / 坏 pins.yaml / chmod 000 / 冲突标记 / 缺文件 / 基线 PASS） |

**未触**：`pins fix` · 其他命令 exit · 通用 IO 框架 · schema · W4+ · package bump · tag/push/publish。

## 自证（A1–A9）

| # | 结果 | 证据 |
|---|------|------|
| A1 | PASS | 截断 JSON → exit 2 + `PINS: BLOCKED` · `不可解析或不可读` |
| A2 | PASS | 坏 pins.yaml → exit 2 + `PINS: BLOCKED` · 声明源 |
| A3 | PASS | chmod 000 → exit 2 + `PINS: BLOCKED`（spawn） |
| A4 | PASS | 冲突标记 → exit 2 + `PINS: BLOCKED` |
| A5 | PASS | 缺文件 →「真值源缺失」原文案 · exit 2 · 无「不可解析或不可读」 |
| A6 | PASS | 完好仓 `pins check` rc=0 · `PINS: PASS` |
| A7 | PASS | 仅 `cli-pins.ts` `readTruthVersion` · 未改 fix/其他 exit/框架 |
| A8 | PASS | typecheck / test(887 pass + 1 skip) / build / test:lib(6) |
| A9 | PASS | gate-check exit 0 · task close（本棒） |

## 禁区自检

未 `npm publish` / tag / push / deprecate · 未 `git commit` · 未 bump 3.0.1 · 未触 schema · 未 `git add -A`（W3 过程档显式 add 以满足 doc-links 入库判据）。

## 下一棒

维护者：逐文件确认 stage → `fix(3.0.1-W3): pins IO fail-closed · readTruthVersion` → 开 W4 或 release 裁量。

## 关账

`gate-check` exit 0 · `task close --yes` → **CLOSE: PASS** · 归档 `docs/tasks/done/task_3_0_1_w3_pins_io_failclosed.md`。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 30 开工：GATE_VERIFY PASS · 落盘本 invoke · 开始改码 |
| 2026-09-18 | 30/40 收口：实现+红测+四门+close PASS · 未发版 · 未 commit |
