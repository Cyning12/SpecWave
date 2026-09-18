# invoke · 30-execute + 40-self-check · 3-0-1-w1-sticky-table-source

> **hat_id**：`30` + `40`（同棒）· **日期**：2026-09-18  
> **task_slug**：`3-0-1-w1-sticky-table-source`  
> **性质**：W1 粘性 `table_source` 实现 + 自证（未发版 · 未 commit）

## GATE_VERIFY（首输出）

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_1_w1_sticky_table_source.md
| gate | status | blocks_30 | 30 影响 |
|------|--------|-----------|--------|
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_1_w1_sticky_table_source.md
```

`may_start_30` 等价：HG-AUDIT-R1=approved → **可开工**。

## 改动摘要

| 文件 | 变更 |
|------|------|
| `src/host/sticky.ts` | 可选 `table_source`（`builtin` \| `file{path,sha256}`）；`buildTableSourceForSticky`；`writeHostToolsSticky` 写表源；`version` 仍为 1；未知根字段忽略 |
| `src/host/cmd.ts` | apply/update 写粘性传入表源；verify 取表 `--file` > sticky > builtin；file 不可用 exit 2 点名；sha256 不符 **WARN** |
| `src/cli-host.ts` | re-export `HostToolsTableSource` / `buildTableSourceForSticky` |
| `test/host-adapt-sticky-table-source.test.ts` | A1–A7 + update 写源回归（红测先行） |

**未触**：host-adapt schema · `package.json` bump · 默认物化内容 · W2–W6。

## 自证（A1–A9）

| # | 结果 | 证据 |
|---|------|------|
| A1 | PASS | `--file` v1 旧表 apply → 默认 verify rc=0；粘性 `table_source.kind=file` |
| A2 | PASS | 移走表 → verify rc=2 点名路径 + `--file`/`host apply` 提示 |
| A3 | PASS | 显式 `--file` 优先于粘性 |
| A4 | PASS | builtin apply → `table_source.kind=builtin` + 默认 verify PASS |
| A5 | PASS | 无 `table_source` 旧粘性可读 · verify 走内置 |
| A6 | PASS | 含 `table_source` 粘性经 3.0.0 读路径等价（`parseStickyLike300` 忽略未知键不报错）· **限制**：本机无 3.0.0 tarball CLI 实测，采用审查文 §3.2 B 兜底 |
| A7 | PASS | `version===1`；可选字段；sha256 漂移仅 WARN 仍 PASS |
| A8 | （四门命令结果见 task 自检节） | typecheck / test / build / test:lib |
| A9 | （gate-check + close） | 见 task 自检 |

旧测影响面扫读（advisory）：`host-adapt-sticky` / `w2-host-verify` / `host-adapt-update` 相关套件与 W1 新测一并绿。

## 禁区自检

未 `npm publish` / tag / push / deprecate · 未 `git commit` · 未 `git add -A`（仅显式 add 过程档与实现文件）· 未 bump 3.0.1。

## 下一棒

维护者：逐文件 `git add` → `fix(3.0.1-W1): sticky table_source + verify 取表同源` → 开 W2 或 release 裁量。

## 关账

`gate-check` exit 0 · `task close --yes` → **CLOSE: PASS** · 已归档 `docs/tasks/done/task_3_0_1_w1_sticky_table_source.md`。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 30/40 同棒：粘性 table_source + verify 取表 + 回归锁 · close PASS · 未发版 · 未 commit |
