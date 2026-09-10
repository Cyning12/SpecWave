# Task：1.12 收口 W2 · EOS 日历（C1）

> **状态**：`done`  
> **关联规划**：`docs/roadmap/PLAN_post_1.11_zh.md` · `docs/spec/1x-closeout/`  
> **00 颗粒度**：单 task = **W2**（C1 文档面；deprecate **仅人**）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `1x-closeout-w2-eos-calendar` |
| **test_strategy** | `recommended`（文档） |
| **freeze_id** | 不改 CLI；不执行 `npm deprecate` |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **entry_invoke_30** | `docs/harness/invokes/by-task/1x-closeout-w2-eos-calendar/invoke_20260910_30_40_1x-closeout-w2-eos-calendar.md` |
| **maintainer_release_hold** | `false` |

### 人工闸

| human_gate_id | status | 说明 |
|---------------|--------|------|
| HG-CLOSEOUT-SIGNOFF | approved | 00 代签 |
| HG-TASK-DRAFT | approved | 00 代签 · 2026-09-10 |
| HG-AUDIT-R1 | approved | 00 代签 · 2026-09-10 |
| HG-EOS-DATE | **pending** | 阻塞 deprecate 实操；**不**阻塞日历提案成文 |

---

## 范围

- [x] `MIGRATION.md` 填入具体提案日（announce / 新注册截止 / EOS）· 明确标 **提案** 直至 `HG-EOS-DATE`
- [x] deprecate 文案草稿保留；**禁止** Agent 执行 `npm deprecate`
- [x] 关闭本 task

## 非范围
执行 deprecate；改产品码；bump/publish

## 验收
- [x] 日历提案日成文且状态列为提案 / 待人闸  
- [x] 未跑 `npm deprecate`

## 修订记录
| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 00 代签 · 日历提案成文 · CLOSE → done/ |
