# Task：1.12 收口 W1 · CI/全量测稳 + dogfood（C2/C3）

> **状态**：`done`  
> **关联规划**：`docs/roadmap/PLAN_post_1.11_zh.md` · `docs/spec/1x-closeout/`  
> **00 颗粒度**：单 task = **W1**（C2+C3）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `1x-closeout-w1-ci-dogfood` |
| **test_strategy** | `required`（C2）· C3 `recommended` |
| **test_strategy_note** | 全量测须可在 CI/本机稳定绿；dogfood 纪要落 reviews |
| **freeze_id** | 不改 P0 exit 族；不改 S2/布局语义 |
| **orchestration** | `Cursor Task 链` |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **entry_invoke_30** | `docs/harness/invokes/by-task/1x-closeout-w1-ci-dogfood/invoke_20260910_30_40_1x-closeout-w1-ci-dogfood.md` |
| **maintainer_release_hold** | `false`（收口发版由 W4 / RELEASING） |

### 人工闸

| human_gate_id | status | 说明 |
|---------------|--------|------|
| HG-NEXT-PLAN | approved | 先 1.12 |
| HG-CLOSEOUT-SIGNOFF | approved | 00 代签 · 2026-09-10 |
| HG-TASK-DRAFT | approved | 00 代签 · 2026-09-10 |
| HG-AUDIT-R1 | approved | 00 代签 · 2026-09-10 |

---

## 背景与目标

验收报告记：F1–F5 新测绿，但整包 `npm test` 曾在沙箱 SIGKILL。W1：证伪全量测稳定性，并做一次消费者侧 dogfood 纪要。

## 范围

### W1.0
- [x] task / audit R1 / invoke（签收后）

### W1.1 C2
- [x] 本机跑通 `npm run typecheck && npm test && npm run build && npm run test:lib`
- [x] 沙箱 SIGKILL 未在本机复现（全量绿）
- [x] 证据见 audit / invoke 回填

### W1.2 C3
- [x] 临时目录 `init --preset harness-only --yes` 后 `check`（本仓 CLI）
- [x] 纪要：`docs/harness/reviews/task_1x_closeout_w1_ci_dogfood_dogfood_20260910.md`

## 非范围
C1 deprecate；O* 本体论改码；P6-prep；bump/publish；F6

## 验收
- [x] 四门命令可重复绿  
- [x] dogfood 纪要至少 1 条  
- [x] 本波未单独 bump（版本 bump 归发版准备）

## failure_paths
| ID | 触发 | 行为 |
|----|------|------|
| T-W1-01 | 全量测仍红且无根因 | 停；只交缺口清单 |
| T-W1-02 | 借机改产品语义 | 打回 |

## 修订记录
| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 00 起草 |
| 2026-09-10 | 00 代签 · C2/C3 完成 · CLOSE → done/ |
