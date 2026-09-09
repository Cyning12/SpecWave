# Task：1x-mvp W1 · S2 过程域真值源唯一化（F1）

> **状态**：`done`  
> **关联图谱**：无（内部常量收敛 · 不改 flow 拓扑）  
> **关联 SPEC**：`docs/spec/1x-mvp/`（F1 · HG-SPEC-SIGNOFF=approved）  
> **00 颗粒度**：单 task = SPEC **W1 整波**；子步 W1.0–W1.5 细验收；改 `src/` + 单测

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `1x-mvp-w1-s2-truth` |
| **test_strategy** | `required` |
| **test_strategy_note** | 先有可失败矩阵测与唯一性扫描，再改实现；既有 init/upgrade/S2 回归须仍绿 |
| **code_quality_bar** | `strict` |
| **freeze_id** | `S2_TRUTH_PREFIXES@cli-shared` · 规范三前缀 + legacy 裸前缀并集 · 「永不覆写」语义不削弱 |
| **orchestration** | `Cursor Task 链` |
| **semi_auto** | `false` |
| **audit_profile** | `full` |
| **invoke_retention_profile** | `minimal` |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 仅共享常量与调用点；不改 `_tech_graph` flow |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 契约在 SPEC/README/CHANGELOG Unreleased；不晋升 coding_wiki |
| **experience_capture** | `recommended` |
| **kpi_aggregator** | `CLOSE` |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 docs+src 轨；由 00 合入，非业务 PR 闸对象 |
| **entry_invoke_30** | `docs/harness/invokes/by-task/1x-mvp-w1-s2-truth/invoke_20260909_30_40_1x-mvp-w1-s2-truth.md` |
| **maintainer_release_hold** | `true` — 本波不 bump / tag / publish |

### 00 维护者授权（2026-09-09）

| 权限 | 00 | 维护者保留 |
|------|-----|------------|
| W1 阶段过程文档签收（task / audit / invoke） | ✅（用户授权「整个 W1」） | — |
| HG-AUDIT-R1 · 调度 30→40→CLOSE | ✅ | — |
| bump / tag / publish | ⛔ | ✅ |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | 10-task, 30 | 系列整包签 · 2026-09-09 |
| HG-TASK-DRAFT | approved | 22-R1, 30 | 2026-09-09 00 代签（用户授权 W1 全过程档） |
| HG-AUDIT-R1 | approved | 30 | 见 `docs/harness/reviews/task_1x_mvp_w1_s2_truth_audit_R1_20260909.md` · 00 代签 |

---

## 背景与目标

X7：S2「永不覆写」前缀硬编码 **4 份互不一致**（`index.ts` / `cli-refresh-ide-blocks.ts` / `cli-graph-hgm.ts` / `cli-skills.ts`）。W1=F1：收敛为 **1 份共享常量 + 统一判定**，跨面一致率 100%；语义不削弱。

**完成态**：`S2_TRUTH_PREFIXES` + `isS2RelPath` / `isS2AbsPath` 落 `cli-shared.ts`；四处及审计发现的同类点全部改引用；矩阵测 + 唯一性扫描绿；README/CHANGELOG 一句。

---

## 范围（细颗粒）

### W1.0 · 过程档

- [x] 本 task 落盘 active
- [x] 20-task-audit R1 + 00 代签 HG-AUDIT-R1
- [x] invoke 30/40 留档

### W1.1 · 锚点审计（实现前）

- [x] 确认四锚点行为并集（见 invoke / 本 task「审计结论」）
- [x] 冻结前缀并集：规范三路径 + legacy 裸 `reviews/` / `invokes/by-task/`（禁止缩小保护面）

### W1.2 · 可失败测试先行

- [x] 新增 `test/s2-truth-source.test.ts`：相对路径矩阵 + 绝对路径矩阵 + `.dsh/skills` 白名单 + 源码唯一性扫描
- [x] 覆盖：规范三前缀命中；legacy 裸前缀命中；近邻非 S2（`.coding-kit` / `docs/harness/prompts` / `assets/skills`）不误杀

### W1.3 · 实现

- [x] `src/cli-shared.ts` 导出 `S2_TRUTH_PREFIXES` / `isS2RelPath` / `isS2AbsPath` / `assertNotS2Abs`
- [x] `src/index.ts` 删除本地列表，改用共享
- [x] `src/cli-refresh-ide-blocks.ts` 删除 `S2_RE`，改用共享
- [x] `src/cli-graph-hgm.ts` 删除局部 `s2Prefixes`，改用共享
- [x] `src/cli-skills.ts` 删除 `isS2Dest` 本地实现，改用共享（保留 skills 白名单语义）

### W1.4 · 回归与文档

- [x] `npm test`（至少 s2 新测 + 既有 S2 相关）与 `npm run typecheck`
- [x] README / README.zh-CN 一句：S2 真值源唯一
- [x] CHANGELOG `[Unreleased]` 记 F1
- [x] 更新 `docs/spec/1x-mvp/F1_s2_truth_source.md` 验收勾选 + 系列 README W1 状态

### W1.5 · 收口

- [x] 40 自检勾选
- [x] task → `done/`（close exempt）

## 审计结论（W1.1）

| 锚点 | 原形态 | 并入并集后 |
|------|--------|------------|
| `index.ts` | `docs/tasks` · `reviews` · `invokes/by-task` | 补 `docs/harness/reviews` · `docs/harness/invokes/by-task`（扩大保护，符合不削弱） |
| `cli-refresh-ide-blocks.ts` | 仅 `docs/tasks` · `docs/harness/reviews` · `docs/harness/invokes/by-task` | 补 legacy 裸前缀（扩大） |
| `cli-graph-hgm.ts` | 五元并集 | 对齐共享五元 |
| `cli-skills.ts` | abs 段匹配 + `.dsh/skills` 白名单 | 共享 abs 判定 + 同白名单 |

## 非范围

- F2 门禁语义文档化 / F3 EOS / F4 目录方案 B / F5 版本钉
- F6 宿主适配表；bump/publish；改 CLOSE 闸；删消费者旧目录

## 依赖

- `docs/spec/1x-mvp/F1_s2_truth_source.md`
- `docs/spec/1x-mvp/README.md`（W1 = F1）

## 验收标准

- [x] `rg`/`test` 证明 `src/` 无第二份 S2 前缀字面量列表（测内扫描）
- [x] 矩阵测绿；既有 `init`/`upgrade`/refresh S2 测不回归
- [x] 插件面与 CLI 面共用 `cli-shared` 导出
- [x] 硬编码份数 4 → 1

## failure_paths

| ID | 触发 | 行为 | 可重试 | 可见 |
|----|------|------|--------|------|
| T-F1-01 | 保护面缩小 | 矩阵测红；禁合入 | 是 | 测 |
| T-F1-02 | 误杀 `.coding-kit` / prompts | 矩阵测红 | 是 | 测 |
| T-F1-03 | 仅改常量未改调用点 | 唯一性扫描或行为测红 | 是 | 测 |
| T-F1-04 | 无 HG-AUDIT-R1 | 拒 30 | 是 | 闸 |

## 思考轮控制

| 轮 | 主题 | 结论摘要 | early_stop |
|----|------|----------|------------|
| R0 | 读 F1 SPEC | W1=F1；四锚点已知 | no |
| R1 | 范围 | 共享常量+替换+测+文档一句；非 F2–F6 | no |
| R2 | 方案 | 并集五前缀 + helper；弃选多列表 lint / 外置 yaml | no |
| R3 | 失败路径 | 保护面漂移用矩阵锁；skills 白名单保留 | no |
| R4 | 可测性 | required；新文件 `test/s2-truth-source.test.ts` | no |
| R5 | 可签 | 用户授权 00 代签 W1 全过程档 | no |

**residual_risks**：abs 判定对路径中偶然含 `/reviews/` 段的历史误杀面与 skills 现状同级（不借本波扩大/缩小该历史行为以外的规则）。

## 给执行帽必读

- `docs/spec/1x-mvp/F1_s2_truth_source.md`
- `src/cli-shared.ts` / 四锚点文件
- `test/init.test.ts` · `test/cli-p0.test.ts` · `test/cli-refresh-ide-blocks.test.ts`（S2 回归）

## 自检（30/40）

- [x] typecheck 绿
- [x] `node --test … test/s2-truth-source.test.ts` 绿
- [x] 相关回归未故意跳过
- [x] 未 bump 版本 / 未 publish

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-09 | 00 起草 + 代签 R1；开 30 执行 W1 |
