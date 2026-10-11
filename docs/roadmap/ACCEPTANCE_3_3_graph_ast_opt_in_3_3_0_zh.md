# ACCEPTANCE · 3.3.0 minor（图谱 AST 闸 opt-in · symbol / 有界 call epic · W1–W3）台账

> **版本**：`spec-wave@3.3.0`（**待发版** · bump 已落 · tag/push/publish **仅人** · registry `latest` 仍为 `3.2.0` 直至人 publish · task slug `3-3-w4-release`）
> **task**：[`docs/tasks/done/task_3_3_w4_release.md`](../tasks/done/task_3_3_w4_release.md)（slug `3-3-w4-release` · epic SPEC [`../spec/3_3-graph-ast-opt-in/`](../spec/3_3-graph-ast-opt-in/)）
> **规划**：[`PLAN_3_3_graph_ast_opt_in_v1_zh.md`](PLAN_3_3_graph_ast_opt_in_v1_zh.md)（HG-NEXT-PLAN=approved · 2026-10-11）
> **SPEC**：[`../spec/3_3-graph-ast-opt-in/`](../spec/3_3-graph-ast-opt-in/)（HG-SPEC-SIGNOFF=approved · 2026-10-11）
> **依据**：W1–W3 done tasks + 各波 R1 审查文（PASS · blocking 0）+ 20 审 R1 [`../harness/reviews/task_3_3_w4_release_audit_R1_20261011.md`](../harness/reviews/task_3_3_w4_release_audit_R1_20261011.md)

## 波次台账（W1–W3 · 全 CLOSE: PASS）

| 波 | 摘要 | task · commit |
|----|------|---------------|
| W1 | `graph ast check` CLI 面（opt-in · peer skip0 · stub/skip 契约 · 不进默认 verify） | [`task_3_3_w1_graph_ast_cli.md`](../tasks/done/task_3_3_w1_graph_ast_cli.md)（`fe454f0`） |
| W2 | AST 实装：symbol 核对 + 有界 call（同 path 红 / 跨 path 不红） | [`task_3_3_w2_graph_ast_impl.md`](../tasks/done/task_3_3_w2_graph_ast_impl.md)（`82abf30`） |
| W3 | 文档分责：保真表 + 有界 ≠ callgraph + MIGRATION/README + CI 可选注释 | [`task_3_3_w3_ast_docs.md`](../tasks/done/task_3_3_w3_ast_docs.md)（`9348190`） |

## SPEC `04` 验收总表对照（epic 级 · 本档勾选）

| 验收项 | 对照 |
|--------|------|
| fixture：假 symbol → ast check exit 2；真 symbol → exit 0 | ✅ W2 红测 + task A* |
| fixture：同 path 有界 call 缺失 → exit 2；跨 path → 不红 | ✅ W2 fixture + task A* |
| 无 peer / 无 IB → 零强迫、行为与契约一致 | ✅ W1 契约测（skip0 / `no_ts_peer`）+ W2 |
| `verify` 默认链无 AST 步 | ✅ W1–W3 硬约束 · 未注册进 verify |
| 既有 drift / ib / indexes / yaml / scaffold 零回归 | ✅ W1–W3 四门绿 · 未改 3.2 缺省判定 |
| 对外无「完整 callgraph / 默认 verify 已含 AST」违纪表述 | ✅ W3 分责表 / 手册 / README 口径 |

## 门禁基线（release 簿记棒 · 2026-10-11）

| 门禁 | 结果 |
|------|------|
| `npm run typecheck` | exit 0 |
| `npm test` | **999** · **996 pass** + **2 tag-gated 设计红**（`release-tag-identity` / `pins-consistency` A 组 pin-10）+ 1 skip · **不是**产品回归 · 人打 `v3.3.0` 后须全绿 |
| `npm run build` / `test:lib` | exit 0 · test:lib **6/6** |
| `pins check` | **16/17** · 唯一偏差 = pin-10 git tag `v3.3.0` 缺失（**设计红** · 人打 tag 后须 **17/17**） |
| `assets verify` | **113/113** |

## pin-10 设计红登记与清偿路径

- **登记**：bump 后 `pins check` 唯一预期偏差 = pin-10（tag `v3.3.0` 不存在 · 打 tag 前必经态 · 同 3.2.0 先例）。
- **清偿路径**：**人**按 HG-RELEASE-TAG-PUSH（仍 pending）执行 `git tag -a v3.3.0` → 复跑 `pins check` **17/17** + 全量 `npm test` 全绿 → `git push`（原子推）→ 人 `npm publish` → ⑨ 回填「已 published」。
- **本棒未清偿**：未执行 `git tag` / `git push` / `npm publish` / `npm deprecate`。

## 已知残余

- pin-10 / `release-tag-identity` 在人打 `v3.3.0` 前为**设计红** · 不记为产品回归。
- registry `latest=3.2.0`（已 published）· 「3.3.0 已 published」叙事回填归人 publish 后 ⑨ · **本棒禁假 published**。
- AST **不**进默认 `verify` · indexes schema v2 **不**并入本 epic。

## 发布边界

- **bump 已落 · tag/push/publish 待人**（HG-RELEASE-TAG-PUSH / HG-RELEASE-PUBLISH = pending · Agent 永禁 publish）。
- RELEASING 人 checklist `3.3.0` 节：簿记就绪项可预勾 · **tag / push / publish / 打 tag 后 pins 17/17 / ⑨ 回填** 全未勾。
- spec 索引 `3_3-graph-ast-opt-in` 行 → **IMPLEMENTED** · `` `3.3.0` 待发版（planned） ``（**非** published）。
