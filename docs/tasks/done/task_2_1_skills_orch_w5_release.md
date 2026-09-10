# Task：2.1 W5 · dogfood + bump 2.1.0

> **状态**：`done`  
> **关联 SPEC**：`04` §W5 · `05` Demo  
> **依赖**：W1–W4 CLOSE

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1-skills-orch-w5-release` |
| **test_strategy** | `recommended` |
| **test_strategy_note** | 四门 + F5 钉点；人手 dogfood 勾选 |
| **freeze_id** | semver `2.1.0`；**禁止** Agent publish |
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
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2_1_skills_orch_w5_release_audit_R1_20260910.md` · W1–W4 DONE |
| HG-PUBLISH | **approved** | publish | 2026-09-10 · 人 · `npm view`=`2.1.0` |

---

## 目标

录屏清单 / README 2.1 段 · CHANGELOG · bump · tag `v2.1.0` · 四门绿；publish 等人。

## 范围

- [x] 文档对齐 05 Demo  
- [x] ontology / discipline / README 钉 `2.1.0`  
- [x] tag；**已** npm publish（人 · 2026-09-10）  
- [x] 过程档回填 · ACCEPTANCE 立档  

## 非范围

Agent publish · 改 W1–W4 产品行为（仅收口）

## 验收

`04` §W5 **全勾**（含 HG-PUBLISH）。

## 实现备忘（30/40 · 2026-09-10）

- bump `2.1.0`：package.json · ontology · discipline · README 双文件 · DOGFOOD · `05` · 测试硬编码 / 转义正则 · D30-2 fixture 升至 `2.9.0`（高于包）
- CHANGELOG `[2.1.0]` 汇总 W1–W4；Unreleased Planned 清
- 四门：`typecheck` · `test` · `build` · `test:lib` 全绿
- annotated tag `v2.1.0`；**未** push / **未** npm publish

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W5-01 | Agent publish | 禁 |
| W5-02 | 四门红仍 bump | 拒 |
| W5-03 | HG-AUDIT-R1 pending 改码 | 拒开工 |

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1/PUBLISH pending |
| 2026-09-10 | 30/40 CLOSE · bump+tag · 移 done · HG-PUBLISH 仍 pending |
| 2026-09-10 | **HG-PUBLISH=approved** · registry `2.1.0` · 过程档回填 |
