# Task：2.x W1 · 适配表 schema + host validate

> **状态**：`done`  
> **关联 SPEC**：`docs/spec/2x-host-adapt/`（signed）· PLAN_2x W1  
> **00 颗粒度**：W1 整波

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2x-host-adapt-w1-schema` |
| **test_strategy** | `required` |
| **test_strategy_note** | 先有非法表/S2 target 可失败测，再接线 validate |
| **freeze_id** | 命令名建议 `host validate`（可微调但须 freeze）；不实现 apply 写盘 |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none`（或仅文档指针） |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | 系列已签 |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 · 2026-09-10（用户批准后拆单） |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2x_host_adapt_w1_schema_audit_R1_20260910.md` |

---

## 目标

落地声明式宿主适配表 schema + **只读/校验** CLI：非法表非 0；target 落 S2 → 拒。

## 范围

- [x] `assets/ide/host-adapt/`（或等价）schema + 示例表  
- [x] `npx dsh-coding-kit host validate`（名以 freeze 为准）  
- [x] 单测：合法/非法/S2 拒  
- [x] README/CHANGELOG Unreleased 一句  

## 过程档（00）

| 项 | 路径 / 状态 |
|----|-------------|
| 20-audit R1 | `docs/harness/reviews/task_2x_host_adapt_w1_schema_audit_R1_20260910.md` · **pass** |
| invoke 30/40 | `docs/harness/invokes/by-task/2x-host-adapt-w1-schema/invoke_20260910_30_40_2x-host-adapt-w1-schema.md` · **closed** |
| freeze | CLI=`host validate`；S2→exit 2；缺件→exit 1；非法表→exit 2；无 apply |

## 非范围

`host apply` 写盘 · Cursor/Claude 物化（W2）· bump 2.0.0

## 验收

对齐 `04` §W1 勾选（**已全勾**）。

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W1-01 | schema 缺文件 | exit 1 用法/缺件 |
| W1-02 | target 含 S2 前缀 | 拒 · exit 2 或成文等价阻断 |
| W1-03 | 无 HG-AUDIT-R1 改码 | 拒开工 |

### 自检结论（执行者）

| 命令 | 退出码 |
|------|--------|
| `node --test --experimental-strip-types test/host-adapt-validate.test.ts` | **0**（8/8） |
| `node --experimental-strip-types src/cli.ts host validate` | **0** |
| `npm run typecheck` | **0** |

验收表：范围 4 项 + `04` §W1（含非法/S2）**全 pass**。已知未测：`host apply`（本波非范围）；publish/bump（禁止）。无阻断缺陷。

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | W0 拆单 · HG-AUDIT-R1 pending |
| 2026-09-10 | 20-audit R1 通过 · **HG-AUDIT-R1=approved** · 开 30 |
| 2026-09-10 | **CLOSE** · 40 自检全 pass · 迁 `docs/tasks/done/` · W1 DONE |
