# Task：2.1.2 W3 · init `--yes` 非交互加固

> **状态**：`done` · **wave**：W3  
> **关联 SPEC**：[`docs/spec/2_1_2-rename-closeout/04_init_noninteractive_v1.md`](../../spec/2_1_2-rename-closeout/04_init_noninteractive_v1.md)  
> **依赖**：W1 CLOSE（可与 W2 并行，建议 W2 后或并行由 00 裁）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1_2-rename-closeout-w3-init-yes` |
| **test_strategy** | `required` |
| **test_strategy_note** | `init --yes` 无 `--tools` → exit 1 且不阻塞；mock isTTY+`--yes` 等价 |
| **freeze_id** | B-INIT-YES；**不**改粘性/update 缺省 A；**不** bump |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-212 | **approved** | — | — |
| HG-SPEC-SIGNOFF | **approved** | — | — |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 |
| HG-AUDIT-R1 | **approved** | **30** | 00 代签 · R1=`docs/harness/reviews/task_2_1_2_rename_closeout_w3_init_yes_audit_R1_20260910.md` |

---

## 目标

`--yes` ⇒ 非交互；缺 `--tools` 快速 exit 1，PTY 下不挂起。

## 范围

- [x] `src/cli.ts`（或 init 路径）：存在 `--yes` 且无 `--tools` → exit 1 · 不读 stdin  
- [x] 单测覆盖（含 isTTY mock 或等价）  
- [x] CHANGELOG Unreleased 一句  

## 非范围

bump/publish · assets 全文 · 改 TTY 无 `--yes` 时的询问体验（保持）

## 验收标准

- [x] `init --yes`（无 tools）exit 1 · 有限时  
- [x] 相关测绿  

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W3-01 | 测依赖长 timeout 等挂起 | FAIL |
| W3-02 | 破坏真非 TTY exit 1 | 拒 |

## 自检结论（30）

- `isInteractiveInit(stdin, { yes })`：`--yes` ⇒ 非交互，禁止 `promptInitTools`
- `node --test test/init.test.ts` 9/9 PASS；`npm run typecheck` PASS
- 未 bump / 未 publish / 未改 REPORT_SCHEMA / bin

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 |
| 2026-09-10 | 30：B-INIT-YES 落地 · 单测 · CHANGELOG；仍 active 待 40 |
| 2026-09-10 | **CLOSE** · 00 归档 done · 交 W4 |
