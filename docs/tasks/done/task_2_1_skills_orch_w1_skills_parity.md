# Task：2.1 W1 · Skills 多宿主 parity

> **状态**：`done`  
> **关联 SPEC**：`docs/spec/2_1-skills-orchestration/`（signed）· PLAN_2_1 W1  
> **00 颗粒度**：W1 整波

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1-skills-orch-w1-skills-parity` |
| **test_strategy** | `required` |
| **test_strategy_note** | 先有 host apply 后三方 skills 目录可失败断言，再补缺口 |
| **freeze_id** | 默认跳过 30/40；断言 harness 六条落盘；不改 Claude commands 布局（W2） |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | 系列已签 |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 · 2026-09-10（维护者签收后拆单） |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2_1_skills_orch_w1_skills_parity_audit_R1_20260910.md` |

---

## 目标

保证 `host apply --tools cursor,claude,dsh --profile core` 后 **三方** 均有默认 `harness-*` 六条 skills（跳过 30/40）；录屏清单补 Cursor `/h` 镜头勾选口径。

## 范围

- [x] 测：apply 后 `.cursor/skills` / `.claude/skills` / `.dsh/skills` 含六条 harness（目录或 SKILL.md 存在性）  
- [x] 若 2.0 管道已满足：补断言 + 文档勾选即可；缺口则修 apply/skills 矩阵（**不**做 W2/W3）  
- [x] 更新 `docs/guides/DOGFOOD_*` 或 `05` 交叉指针一句（Skills 镜）  
- [x] CHANGELOG Unreleased（2.1）一句  

## 非范围

Claude `/kit:` 布局 · DSH `kit-*` 编排 skills · expanded · bump 2.1.0 · publish

## 验收

对齐 `04` §W1（除 R1 已签）。

### 自检结论（执行者）

| 命令 | 退出码 |
|------|--------|
| `node --test --experimental-strip-types test/host-adapt-w1-skills-parity.test.ts` | **0**（1/1） |
| `node --test --experimental-strip-types test/host-adapt-w1-skills-parity.test.ts test/host-adapt-apply.test.ts test/host-adapt-update.test.ts` | **0**（13/13） |

验收：范围 4 项勾选；2.0 管道已物化三方六条 · 本波仅加测 + DOGFOOD §5.1 + `05` 指针 + CHANGELOG。未改 `src/`。已知未测：Cursor GUI `/h` 实机（人录屏勾）；W2/W3 非范围。无阻断缺陷。

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W1-01 | apply 后缺任一方 harness 技能目录 | 测 FAIL / exit 2 成文 |
| W1-02 | 默认写出 30/40 | 拒 · 与 skills install 同口径 |
| W1-03 | 无 HG-AUDIT-R1 改码 | 拒开工 |

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1 代签可 30 |
| 2026-09-10 | 30/40：补 W1 测绿 · 文档口径 · 无 src 缺口 |
| 2026-09-10 | **CLOSE** · 归档 done · 交 W2 |
