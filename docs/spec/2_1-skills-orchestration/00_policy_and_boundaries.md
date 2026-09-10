# 00 · 政策与边界（2.1）

> **状态**：`draft` · 隶属 `2_1-skills-orchestration`  
> **test_strategy**：`not_applicable`（本文件为政策；实现波另标 `required`）

---

## 1. 目标

1. **Skills parity**：`harness-00` / `10-spec` / `10-task` / `20-*` / `hat-reanchor`（默认跳过 30/40）在 Cursor · Claude · DSH · agents **均可发现并调用**。  
2. **Orchestration parity**：core（及可选 expanded）编排在 Cursor / Claude 以 **slash Commands** 呈现；DSH 以 **工具或 skill 等价入口** 呈现；**Verify 真值仍为 CLI exit（failClosed=2）**。  
3. **宿主差异诚实**：允许文件布局不同（扁平 vs 子目录），**禁止**语义漂移或冒充他产品前缀。

---

## 2. 非范围

- OpenSpec change/delta、spec-kit specify→implement 主流程  
- 默认分发 30/40 execute hats  
- Agent publish / deprecate / 云 Policy  
- 把 DSH 伪装成 Cursor 命令面板  

---

## 3. 硬纪律（继承 2.0 + 强化）

| ID | 条文 |
|----|------|
| S2 | `docs/tasks` / `reviews` / `invokes/by-task` **永不**作为物化 target |
| PREFIX | Commands 仅 `kit-` / Claude `kit:`；Skills 仅 `harness-`；**禁** `opsx` / `openspec` / `speckit` 前缀 |
| LOCAL | `cyning-harness-local` 块永不覆写 |
| GATE | Command/Skill **不得**在未跑 CLI 或 exit≠0 时宣称闸过 |
| SKIP-3040 | 默认跳过 execute hats；`--with-execute-hats` 或显式 T1 另议 |
| DRY | `host apply/update` 默认 dry-run；`--yes` 写盘；conflict 默认 skip |

---

## 4. failure_paths（摘要）

| 触发 | 行为 |
|------|------|
| 适配表 / U-01 契约失败 | exit **2** · 零写入 |
| 目标路径落在 S2 | exit **2** · 拒 |
| Claude 落点改布局导致旧扁平文件残留 | `host update` 须定义迁移/清理策略（W2 细写）；不得静默双份语义冲突 |
| DSH 编排入口缺失 | W3 验收 FAIL（无等价面） |

---

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
