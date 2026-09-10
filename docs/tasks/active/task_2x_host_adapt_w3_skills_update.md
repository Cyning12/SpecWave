# Task：2.x W3 · skills 落点 + host update

> **状态**：`active`  
> **关联**：PLAN_2x W3 · **depends_on** W2（建议）  
> **00 颗粒度**：W3 整波

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2x-host-adapt-w3-skills-update` |
| **test_strategy** | `required` |
| **freeze_id** | `host update` 默认不覆盖 conflict；`--force` 显式；与 `skills install` 路径矩阵一致成文 |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 · 2026-09-10 |
| HG-AUDIT-R1 | **pending** | **30** | |

---

## 目标

适配表 skills 行与现有 `skills install` 对齐；`host update` 刷新 **产品** commands/skills。

## 范围

- [ ] 表内 skills 落点（cursor/claude/agents/dsh）  
- [ ] `host update`（或等价子命令）  
- [ ] conflict 报告 + 默认不覆盖  
- [ ] 测 + 文档  

## 非范围

默认装 30/40 · onboard/explore（推迟项）· bump 2.0

## 验收

对齐 `04` §W3。

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 拆单 · HG-AUDIT-R1 pending |
