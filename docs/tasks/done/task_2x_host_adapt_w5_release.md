# Task：2.x W5 · dogfood + 发版准备 2.0.0

> **状态**：`done`（人 `npm publish` **待人 / HG-PUBLISH pending**）  
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
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2x_host_adapt_w5_release_audit_R1_20260910.md` |
| HG-PUBLISH | **pending** | publish | **仅人** |

---

## 目标

W1–W4 齐套后：dogfood、CHANGELOG、F5 钉点、`2.0.0` bump/tag；人 publish。

## 范围

- [x] 干净仓 dogfood：`host apply --tools cursor,claude --profile core`  
- [x] 四门绿  
- [x] CHANGELOG `2.0.0` · README 入口  
- [x] bump + tag（Agent）  
- [ ] 人 `npm publish`（**待人 / HG-PUBLISH pending**）

## 非范围

Agent publish · deprecate 文案改钉（可选另 task）· 2.1 workspaces

## 验收

对齐 `04` §W5（四门/dogfood/audit **已勾**；人 publish **未勾**）。F6-A–E 可勾。

### 自检结论（执行者）

| 命令 | 退出码 |
|------|--------|
| `npm run typecheck && npm test && npm run build && npm run test:lib` | **0**（typecheck OK · 369 pass / 0 fail · build OK · test:lib 4 pass） |

验收表：范围 dogfood / 四门 / CHANGELOG / bump+tag **pass**；人 `npm publish` **待人**（未跑）。已知未测：npm publish / git push（禁止）。无阻断缺陷。过程档 CLOSE，**HG-PUBLISH 仍 pending**。

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 拆单 · 闸 pending |
| 2026-09-10 | 20-audit R1 通过 · **HG-AUDIT-R1=approved** · 开 30（HG-PUBLISH 仍 pending） |
| 2026-09-10 | 30 bump/tag `2.0.0` 就绪 · 未 CLOSE · **人 npm publish 未勾** |
| 2026-09-10 | **40 CLOSE** · 迁 `docs/tasks/done/` · git/tag DONE · **HG-PUBLISH pending** |
