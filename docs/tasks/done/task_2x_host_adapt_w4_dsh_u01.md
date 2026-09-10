# Task：2.x W4 · DSH 行 + U-01 契约嗅探

> **状态**：`done`  
> **关联**：PLAN_2x W4 · F6-C / F6-D  
> **00 颗粒度**：W4 整波

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2x-host-adapt-w4-dsh-u01` |
| **test_strategy** | `required` |
| **freeze_id** | DSH：commands 可空；tools/skills 原生；U-01 不匹配 → 降级提示、禁止静默写坏 |
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
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2x_host_adapt_w4_dsh_u01_audit_R1_20260910.md` |

---

## 目标

适配表 DSH 行完备；U-01 契约/宿主版本嗅探 + 不匹配降级。

## 范围

- [x] DSH host 行（skills/tools；commands=n/a 或空）  
- [x] U-01 探测与降级路径（插件或 CLI 入口成文 + 测）  
- [x] 错版本不静默写坏  

## 过程档（00）

| 项 | 路径 / 状态 |
|----|-------------|
| 20-audit R1 | `docs/harness/reviews/task_2x_host_adapt_w4_dsh_u01_audit_R1_20260910.md` · **pass** |
| invoke 30/40 | `docs/harness/invokes/by-task/2x-host-adapt-w4-dsh-u01/invoke_20260910_30_40_2x-host-adapt-w4-dsh-u01.md` · **closed** |
| freeze | DSH `commands: []`；不写 kit-* slash；U-01 不匹配 → exit 2 零写入；`init_coding_kit` degraded 拒绝复制 |

## 非范围

多宿主全表（copilot/codex 可声明暂缓）· bump 2.0

## 验收

对齐 `04` §W4（**已全勾**）。

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W4-01 | 版本不匹配仍写盘 | 测红 · 修至降级 |
| W4-02 | 强迫 DSH 必装 slash | audit 打回（违反 C 行） |

### 自检结论（执行者）

| 命令 | 退出码 |
|------|--------|
| `node --test --experimental-strip-types test/host-adapt-u01.test.ts test/host-adapt-update.test.ts test/host-adapt-apply.test.ts test/host-adapt-validate.test.ts` | **0**（26/26） |

验收表：范围 3 项 + `04` §W4 **全 pass**。DSH 不强制 slash；U-01 6 项含 `init_coding_kit` degraded 零复制。已知未测：publish/bump（禁止）；W5 发版（另棒）。无阻断缺陷。

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 拆单 · HG-AUDIT-R1 pending |
| 2026-09-10 | 20-audit R1 通过 · **HG-AUDIT-R1=approved** · 开 30 |
| 2026-09-10 | **CLOSE** · 40 自检全 pass · 迁 `docs/tasks/done/` · W4 DONE |
