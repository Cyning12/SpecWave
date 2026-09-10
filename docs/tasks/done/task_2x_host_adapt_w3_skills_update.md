# Task：2.x W3 · skills 落点 + host update

> **状态**：`done`  
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
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2x_host_adapt_w3_skills_update_audit_R1_20260910.md` |

---

## 目标

适配表 skills 行与现有 `skills install` 对齐；`host update` 刷新 **产品** commands/skills。

## 范围

- [x] 表内 skills 落点（cursor/claude/agents/dsh）  
- [x] `host update`（或等价子命令）  
- [x] conflict 报告 + 默认不覆盖  
- [x] 测 + 文档  

## 过程档（00）

| 项 | 路径 / 状态 |
|----|-------------|
| 20-audit R1 | `docs/harness/reviews/task_2x_host_adapt_w3_skills_update_audit_R1_20260910.md` · **pass** |
| invoke 30/40 | `docs/harness/invokes/by-task/2x-host-adapt-w3-skills-update/invoke_20260910_30_40_2x-host-adapt-w3-skills-update.md` · **closed** |
| freeze | CLI=`host update`；默认 dry-run；`--yes` add/skip；conflict 默认不覆盖；`--force` 显式；skills 矩阵含 agents；跳过 30/40 |

## 非范围

默认装 30/40 · onboard/explore（推迟项）· bump 2.0

## 验收

对齐 `04` §W3（**已全勾**）。

### 自检结论（执行者）

| 命令 | 退出码 |
|------|--------|
| `node --test --experimental-strip-types test/host-adapt-update.test.ts test/host-adapt-apply.test.ts test/host-adapt-validate.test.ts` | **0**（20/20） |

验收表：范围 4 项 + `04` §W3 **全 pass**。mvp-hosts 含 agents；矩阵 README 成文；默认跳过 30/40。已知未测：DSH U-01（W4 非范围）；publish/bump（禁止）。无阻断缺陷。

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 拆单 · HG-AUDIT-R1 pending |
| 2026-09-10 | 20-audit R1 通过 · **HG-AUDIT-R1=approved** · 开 30 |
| 2026-09-10 | **CLOSE** · 40 自检全 pass · 迁 `docs/tasks/done/` · W3 DONE |
