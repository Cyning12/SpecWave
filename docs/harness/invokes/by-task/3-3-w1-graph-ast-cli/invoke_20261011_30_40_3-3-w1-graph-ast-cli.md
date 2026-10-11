# invoke · 30/40 · 3-3-w1-graph-ast-cli

| 项 | 内容 |
|----|------|
| **hat_id** | `30` / `40` |
| **日期** | 2026-10-11 |
| **闸** | HG-AUDIT-R1=approved（00 按授权） |
| **实现** | `src/cli-graph-ast.ts` · `cli-graph.ts` 接线 · `usage.ts` · `test/graph-ast-check.test.ts` |

## 摘要

W1：注册 `graph ast check`；peer 缺失 → `no_ts_peer` exit 0；无可检项 checked=0；有待检 + peer → `ast_not_implemented` stub；不进 verify。

## 下一棒

四门 → commit → 00 close。
