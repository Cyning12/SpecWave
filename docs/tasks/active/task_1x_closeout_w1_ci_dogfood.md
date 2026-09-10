# Task：1.12 收口 W1 · CI/全量测稳 + dogfood（C2/C3）

> **状态**：`draft`  
> **关联规划**：`docs/roadmap/PLAN_post_1.11_zh.md` · `docs/spec/1x-closeout/`  
> **00 颗粒度**：单 task = **W1**（C2+C3）；不大改产品语义

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `1x-closeout-w1-ci-dogfood` |
| **test_strategy** | `required`（C2）· C3 `recommended` |
| **test_strategy_note** | 全量测须可在 CI/本机稳定绿；dogfood 纪要可落 reviews |
| **freeze_id** | 不改 P0 exit 族；不改 S2/布局语义 |
| **orchestration** | `Cursor Task 链` |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` 或 `feat/1x-closeout-w1` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true`（本波不 bump） |

### 人工闸

| human_gate_id | status | 说明 |
|---------------|--------|------|
| HG-NEXT-PLAN | approved | 先 1.12 |
| HG-CLOSEOUT-SIGNOFF | pending | 系列可与本 task 同签或后补 |
| HG-TASK-DRAFT | pending | 人确认后 00 代签或人签 |
| HG-AUDIT-R1 | pending | 30 前 |

---

## 背景与目标

验收报告记：F1–F5 新测 21/21 绿，但整包 `npm test` 曾在沙箱 SIGKILL。W1：证伪/修复全量测稳定性，并做一次消费者侧 dogfood 纪要。

## 范围

### W1.0
- [ ] task / audit R1 / invoke（签收后）

### W1.1 C2
- [ ] 本机或 CI 跑通 `npm run typecheck && npm test && npm run build && npm run test:lib`
- [ ] 若失败：定位超时/OOM/竞态；最小修复（测隔离、超时、并发）  
- [ ] 在 PR/纪要中写清「全量绿」证据（命令 + 退出码）

### W1.2 C3
- [ ] 在临时目录或样例仓跑 `npx dsh-coding-kit@1.11.0 check` / `verify`（或本仓 bin）抽样  
- [ ] 记录 exit 契约与异常（reviews 或 task 回填）

## 非范围
C1 deprecate；O* 本体论改码；P6-prep；bump/publish；F6

## 验收
- [ ] 四门命令可重复绿（或已登记已知 CI 限制 + 修复计划）  
- [ ] dogfood 纪要至少 1 条  
- [ ] 未 bump

## failure_paths
| ID | 触发 | 行为 |
|----|------|------|
| T-W1-01 | 全量测仍红且无根因 | 停；只交缺口清单 |
| T-W1-02 | 借机改产品语义 | 打回 |

## 修订记录
| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 00 起草（待人签 HG-TASK-DRAFT / 系列签） |
