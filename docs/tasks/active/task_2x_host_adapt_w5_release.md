# Task：2.x W5 · dogfood + 发版准备 2.0.0

> **状态**：`active`  
> **关联**：PLAN_2x W5 · **depends_on** W1–W4 CLOSE  
> **00 颗粒度**：W5 整波

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2x-host-adapt-w5-release` |
| **test_strategy** | `required`（四门 + dogfood） |
| **freeze_id** | bump `2.0.0`；F5 钉点同步；**publish 仅人** |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `recommended`（若 CLI 面进图谱） |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `false` — Agent 可 bump/tag；**publish 仅人** |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 · 2026-09-10 |
| HG-AUDIT-R1 | **pending** | **30** | 本波若含 bump 前实现收口 |
| HG-PUBLISH | **pending** | publish | **仅人** |

---

## 目标

W1–W4 齐套后：dogfood、CHANGELOG、F5 钉点、`2.0.0` bump/tag；人 publish。

## 范围

- [ ] 干净仓 dogfood：`host apply --tools cursor,claude --profile core`  
- [ ] 四门绿  
- [ ] CHANGELOG `2.0.0` · README 入口  
- [ ] bump + tag（Agent）  
- [ ] 人 `npm publish`  

## 非范围

Agent publish · deprecate 文案改钉（可选另 task）· 2.1 workspaces

## 验收

对齐 `04` §W5；F6-A–E 可勾。

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 拆单 · 闸 pending |
