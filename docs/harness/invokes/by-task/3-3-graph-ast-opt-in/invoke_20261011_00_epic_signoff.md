# invoke · 00 · 3.3 epic 签收与过程授权

| 项 | 内容 |
|----|------|
| **hat_id** | `00` |
| **日期** | 2026-10-11 |
| **触发** | 维护者本窗：「授权00签收后续所有文档，将W1~W4全部完成后再汇报」 |
| **SPEC** | `docs/spec/3_3-graph-ast-opt-in/` |
| **PLAN** | `docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md` |

## 已办

1. 回填 **HG-SPEC-SIGNOFF** / **HG-NEXT-PLAN** → **approved**（SPEC README · 00_policy · PLAN · `04` W0）  
2. 记录过程授权：本 epic 各波 **00 可签** `HG-TASK-DRAFT` / `HG-AUDIT-R1`（须 `task lint` PASS + 20-task-audit R1 PASS · blocking 0）  
3. **不**代签 `HG-RELEASE-*` / tag / push / `npm publish`  
4. 编排：串行完成 W1→W4 后统一短报（本窗 delegate-only · 不亲自 30）  

## 本窗未改

- `src/` / `test/` / `bin/`（留给各波 30）  

## 下一棒

派波次全链（10-task → 20-task-audit → 00 签过程闸 → 30/40 → close · 一波一 commit）。
