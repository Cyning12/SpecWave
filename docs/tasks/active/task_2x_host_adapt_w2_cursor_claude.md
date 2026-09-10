# Task：2.x W2 · Cursor + Claude 物化（always_on + commands core）

> **状态**：`active`  
> **关联**：`2x-host-adapt` · PLAN_2x W2 · **depends_on** W1  
> **00 颗粒度**：W2 整波

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2x-host-adapt-w2-cursor-claude` |
| **test_strategy** | `required` |
| **freeze_id** | `host apply --tools cursor,claude --profile core`；默认 dry-run；`--yes` 写盘；不碰 S2；不覆写 local 块 |
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

≥2 非 DSH 宿主可物化：Cursor + Claude Code 的 **always_on + commands(core)**。

## 范围

- [ ] core commands 资产（`kit-apply-standards` / `kit-verify` / `kit-gate-status` / `kit-init-guide` / `kit-hat-reanchor`）  
- [ ] always_on 适配（rules / CLAUDE fragment；可复用/演进现有 adapters）  
- [ ] `host apply --dry-run` / `--yes`  
- [ ] 测：文件落点、S2 拒写、local 不覆写  

## 非范围

skills update（W3）· DSH U-01（W4）· expanded profile 全量 · bump 2.0

## 验收

对齐 `04` §W2；满足 F6-B。

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W2-01 | W1 未 CLOSE 即开写盘 | 拒开工或 BLOCKED |
| W2-02 | `--yes` 无备份策略导致不可回滚 | audit 打回 |

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 拆单 · HG-AUDIT-R1 pending |
