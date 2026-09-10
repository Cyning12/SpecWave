# Task：2.x W5 · dogfood + 发版准备 2.0.0

> **状态**：`done` · **HG-PUBLISH=approved**（人 publish · `latest=2.0.0`）  
> **关联**：PLAN_2x W5 · **depends_on** W1–W4 CLOSE  
> **00 颗粒度**：W5 整波  
> **归档**：[`../../roadmap/ACCEPTANCE_2x_host_adapt_2_0_0_zh.md`](../../roadmap/ACCEPTANCE_2x_host_adapt_2_0_0_zh.md)

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2x-host-adapt-w5-release` |
| **test_strategy** | `required`（四门 + dogfood） |
| **freeze_id** | bump `2.0.0`；F5 钉点同步；**publish 仅人** |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `false` — Agent 可 bump/tag；**publish 仅人** |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 · 2026-09-10 |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2x_host_adapt_w5_release_audit_R1_20260910.md` |
| HG-PUBLISH | **approved** | publish | 2026-09-10 · 人 · `npm view` → `latest=2.0.0` |

---

## 目标

W1–W4 齐套后：dogfood、CHANGELOG、F5 钉点、`2.0.0` bump/tag；人 publish。

## 范围

- [x] 干净仓 dogfood：`host apply --tools cursor,claude --profile core`  
- [x] 四门绿  
- [x] CHANGELOG `2.0.0` · README 入口  
- [x] bump + tag（Agent）  
- [x] 人 `npm publish`（**HG-PUBLISH=approved** · `latest=2.0.0`）

## 非范围

Agent publish · deprecate 文案改钉（可选另 task）· 2.1 workspaces

## 验收

对齐 `04` §W5 **全勾**；F6-A–E **pass**（见验收归档）。

### 自检结论（执行者）

| 命令 | 退出码 |
|------|--------|
| `npm run typecheck && npm test && npm run build && npm run test:lib` | **0**（发版前 / 40 复跑） |
| `npm view dsh-coding-kit version` | **`2.0.0`**（人 publish 后核验） |

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 拆单 · 闸 pending |
| 2026-09-10 | 20-audit R1 通过 · **HG-AUDIT-R1=approved** · 开 30（HG-PUBLISH 仍 pending） |
| 2026-09-10 | 30 bump/tag `2.0.0` 就绪 · 未 CLOSE · **人 npm publish 未勾** |
| 2026-09-10 | **40 CLOSE** · 迁 `docs/tasks/done/` · git/tag DONE · **HG-PUBLISH pending** |
| 2026-09-10 | **人 publish** · **HG-PUBLISH=approved** · 系列归档 · 开 `2.0.1` docs patch |
