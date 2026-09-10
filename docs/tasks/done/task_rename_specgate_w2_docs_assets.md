# Task：SpecGate W2 · 文档/资产叙事 + refresh 映射

> **状态**：`done` · **wave**：W2  
> **依赖**：W1 CLOSE  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `rename-specgate-w2-docs-assets` |
| **test_strategy** | `required` |
| **test_strategy_note** | refresh 映射可测；文档钉点测 |
| **freeze_id** | 叙事 SpecGate / `npx spec-wave`；保留 DSH 为可选；B-REFRESH |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-RENAME | approved | — | |
| HG-SPEC-SIGNOFF | approved | — | |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_rename_specgate_w2_docs_assets_audit_R1_20260910.md` · W1 CLOSE |

---

## 目标

全库用户可见文案切到 SpecGate / `specgate`；`refresh-ide-blocks` 增加旧 `npx dsh-coding-kit` → `npx spec-wave`。

## 范围

- [x] README 双文件 · RELEASING · MIGRATION（迁移节）· About 口径  
- [x] assets prompts/skills/host-adapt 等 `npx dsh-coding-kit` 示例 → 新名（过渡说明可留一句）  
- [x] refresh-ide-blocks 映射表 + 测  
- [x] dogfood 落点内命令字面（若在仓内）  

## 非范围

publish · deprecate · 改产品行为（非改名）

## 验收标准

- [x] 根 README 首屏 SpecGate / `spec-wave@2.1.1`  
- [x] refresh 映射测绿  
- [x] SPEC `02` §W2 勾选  

### 自检结论（执行者）

30 PASS · VERIFY 前闸 OK · README/MIGRATION/RELEASING/assets/dogfood 叙事 → SpecGate · `npx spec-wave`；refresh A5–A7 + M17b 测；未 publish / 未 bump / 双 bin 未改。00 CLOSE → `done`。

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W2-01 | 文档仍主推 dsh-coding-kit 为唯一名 | FAIL |
| W2-02 | R1 pending 改码 | 拒 |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1 pending |
| 2026-09-10 | W1 CLOSE · R1 代签可 30 |
| 2026-09-10 | 30 PASS · 00 CLOSE → `done` · 派 W4 |
