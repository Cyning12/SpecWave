# Task：1.12 收口 W4 · P6-prep + D1/D2 + 发版准备

> **状态**：`done`（过程档 · **待人 `npm publish`**）  
> **关联规划**：`docs/roadmap/PLAN_post_1.11_zh.md` · `docs/spec/1x-closeout/`  
> **00 颗粒度**：单 task = **W4**（声明清单 + releases/promotion + bump/tag）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `1x-closeout-w4-p6-prep-docs` |
| **test_strategy** | `recommended` |
| **freeze_id** | 不做 F6 适配引擎；publish 仅人 |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **entry_invoke_30** | `docs/harness/invokes/by-task/1x-closeout-w4-p6-prep-docs/invoke_20260910_30_40_1x-closeout-w4-p6-prep-docs.md` |
| **maintainer_release_hold** | `false` — Agent 可 bump/tag；**publish 仅人** |

### 人工闸

| human_gate_id | status | 说明 |
|---------------|--------|------|
| HG-CLOSEOUT-SIGNOFF | approved | 00 代签 |
| HG-TASK-DRAFT | approved | 00 代签 · 2026-09-10 |
| HG-AUDIT-R1 | approved | 00 代签 · 2026-09-10 |
| HG-PUBLISH | **pending** | 人执行 `npm publish` |

---

## 范围

- [x] P6-prep：`docs/spec/1x-closeout/host_landing_inventory_v1.md` 标 signed/done（prep）
- [x] D1：`docs/releases/06_1_11_to_1_12.md` + README 指针
- [x] D2：`delivery/promotion/` 标 1.x MVP DONE + 链 PLAN_post_1.11
- [x] 发版准备：CHANGELOG · bump 1.12.0 · 钉点 · 四门绿 · pack dry-run · tag（**不** publish）

## 非范围
F6 引擎；`npm publish`；`npm deprecate`

## 验收
- [x] 宿主清单 prep 关账  
- [x] releases / promotion 已更新  
- [x] tag `v1.12.0` 就绪；RELEASING 注明待人 publish

## 修订记录
| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 00 代签 · W4 完成 · 停留 publish 前 |
