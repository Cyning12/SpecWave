# invoke · 00 · 3.3 epic S0 盘点 → 派 10-spec

| 项 | 内容 |
|----|------|
| **hat_id** | `00` |
| **日期** | 2026-10-11 |
| **触发** | 维护者本窗：统筹 minor epic `3_3-graph-ast-opt-in`（拟 `spec-wave@3.3.0`）· delegate-only |
| **Open Folder** | 本仓根（SpecWave / dsh-coding-kit） |
| **禁区** | 勿改 kimi-code-meta；本窗不改 `src/` / `bin/` / `test/` |

## S0 盘点结果

| 产物 | 状态 |
|------|------|
| `docs/spec/3_3-graph-ast-opt-in/` | **不存在** |
| `docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md` | **不存在** |
| `docs/roadmap/ACCEPTANCE_3_3_*` | **不存在** |
| 本 slug 下过程闸 / 实现 task | **无** |

基线对照：`3_2-graph-ib-and-indexes` = **signed / IMPLEMENTED**（拟 `3.2.0` · 待人 publish）；AST 在 3.2 `00_policy` / PLAN 钉为 **另 Epic（反哺 P4）**。

## 决策（S0）

- **派 10-spec**：落盘 SPEC 夹 + PLAN（draft）· 闸表 `HG-SPEC-SIGNOFF` / `HG-NEXT-PLAN` = **pending**
- **不**开实现波（S1）；**不**代签双闸；**不**改实现码
- 默认范围：opt-in `graph ast check`（symbol / 有界 call）· 不进默认 verify · 不强迫非 TS 仓 · **不**并入 indexes schema v2（除非维护者本窗另示）

## 闸（当前）

| human_gate_id | status | 路径（待 10-spec 落盘后） |
|---------------|--------|---------------------------|
| HG-SPEC-SIGNOFF | **pending**（尚无档） | `docs/spec/3_3-graph-ast-opt-in/README.md`（及 `00_policy`） |
| HG-NEXT-PLAN | **pending**（尚无档） | `docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md` |

## 下一棒（已派）

- **帽**：10-spec · Task `4afc61b5-9d36-41e4-a175-b97a6b5c8de0`（2026-10-11）  
- **产出已落盘**：`docs/spec/3_3-graph-ast-opt-in/`（README + 00–05）+ `docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md`  
- **交棒后（当前）**：**停 · 等人签** 双闸；可选先派 20-spec-audit  

## 本窗未改

- `src/` / `bin/` / `test/` / `assets/` 产品实现  
- kimi-code-meta  

## 过程授权

- 本 invoke **未**含「00 本窗亲自 30」  
- 本 invoke **未**含「授权 00 签收后续过程文档」（待 SPEC/PLAN 签收窗另授）  
- `HG-RELEASE-*` / tag / push / `npm publish`：**仅人**
