# W7 · 证据入库清偿登记（EVID-PROV · 硬约束 14 · 验收 #6）

> **任务**：`docs/tasks/active/task_3_0_w7_closeout_external.md` S7.8 · 验收 #6 · 硬约束 14 · F-W7-04
> **日期**：2026-09-17 · **执行**：30 执行帽
> **背景**：`.workbuddy/` 整体被 `.gitignore` 忽略（对 clone/评审员不可达）⇒「可解析 ≠ 在仓」。本表把 3.0 依赖证据与 2.x 历史件逐件处置登记。
> **真相规则（F-W7-04）**：镜像件与 `.workbuddy/` 原件若漂移 ⇒ **以 tracked 镜像为真值面**（镜像只加 provenance 头 · 不改写内容 · 登记来源与日期）。

## 一、必做 ≥4 件（镜像入 `docs/harness/reviews/`）

| # | 来源（`.workbuddy/` · 仅本地草稿） | tracked 镜像（真值面） | 处置 |
|---|-----------------------------------|----------------------|------|
| 1 | `.workbuddy/output/路线研究-SpecWave-2.2-3.0.md` | [`w7_evidence_route_research_2_2_to_3_0_20260917.md`](w7_evidence_route_research_2_2_to_3_0_20260917.md) | 镜像（2026-09-17） |
| 2 | `.workbuddy/output/验收报告-SpecWave-2.4.0.md` | [`w7_evidence_acceptance_2_4_0_20260917.md`](w7_evidence_acceptance_2_4_0_20260917.md) | 镜像（2026-09-17） |
| 3 | `.workbuddy/output/验收报告-SpecWave-2.4.1.md` | [`w7_evidence_acceptance_2_4_1_20260917.md`](w7_evidence_acceptance_2_4_1_20260917.md) | 镜像（2026-09-17） |
| 4 | `.workbuddy/output/_frag/exports_probe_20260916.mjs` | [`w7_evidence_exports_probe_20260916_20260917.mjs`](w7_evidence_exports_probe_20260916_20260917.mjs) | 镜像（2026-09-17） |

非 S2 仓内引用（PLAN_2_2/2_3/2_4 · PLAN_3_0 · `docs/spec/*/README.md`）已回填指向上述 tracked 镜像。

## 二、W3 已清偿（核对在案）

| 来源 | tracked 真值面 | 处置 |
|------|---------------|------|
| `研究-3.0-W3-本体与图谱-OWL引入评估.md` | [`w3_ontology_graph_research_20260917.md`](w3_ontology_graph_research_20260917.md) | W3 已清偿（核对在案 · 不重复镜像） |
| `_frag/onto_probe_20260915.mjs` | [`scripts/onto-probe.mts`](../../scripts/onto-probe.mts) | W3 已清偿（核对在案 · 不重复镜像） |

## 三、其余 2.x 历史件（显式登记「仅本地草稿 · 非证据面」· 不镜像）

| # | 来源（`.workbuddy/output/`） | 处置 | 理由 |
|---|------------------------------|------|------|
| 5 | `PROMPT-2.2.0-落地-交给SpecWave-agent.md` | 仅本地草稿 · 非证据面 | 2.x 过程提示词 · 非 3.0 依赖证据 |
| 6 | `PROMPT-2.3.0-落地-交给SpecWave-agent.md` | 仅本地草稿 · 非证据面 | 同上 |
| 7 | `验收报告-SpecWave-2.2.0.md` | 仅本地草稿 · 非证据面 | 2.x 历史验收 · 已被 2.4.x 取代 |
| 8 | `验收报告-SpecWave-2.3.0.md` | 仅本地草稿 · 非证据面 | 同上 |
| 9 | `推广事实卡-2.1.3.md` | 仅本地草稿 · 非证据面 | 2.x 对外物料历史快照 |
| 10 | `推广事实卡-2.2.0.md` | 仅本地草稿 · 非证据面 | 同上（其 §11 口径已被 A3 `claims-boundary.yaml` 取代） |
| 11 | `审查报告-SpecWave-2.1.1-改名验收.md` | 仅本地草稿 · 非证据面 | 2.x 审查历史 |

上述 7 件在非 S2 文档中的引用已改指本登记表（消除 S7.7 (ii) 级未入库直链）。

## 四、残留声明

- `.workbuddy/` 本机保留（未删除 · 未纳入 tracked）；其内容以本表所列 tracked 真值面为准。
- 非 S2 的 `.workbuddy/` 直链 = **0**（S7.7 (ii) 级交叉锁）；S2 域（`docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`）历史直链永不覆写、冻结豁免。

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-17 | 初版 · 3.0 W7 S7.8（4 镜像 + W3 两件核对 + 7 件「仅本地草稿」登记 · 非 S2 直链清零） |
