# Task：2.1.2 W4 · bump · tag · 发版准备

> **状态**：`active` · **wave**：W4  
> **关联 SPEC**：[`docs/spec/2_1_2-rename-closeout/01_release_traceability_v1.md`](../../spec/2_1_2-rename-closeout/01_release_traceability_v1.md) · `05`  
> **依赖**：W1–W3 CLOSE  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1_2-rename-closeout-w4-release` |
| **test_strategy** | `required` |
| **test_strategy_note** | 钉点全仓 = 2.1.2；四门绿；tag 探针文档化 |
| **freeze_id** | bump **2.1.2**；**Agent 不** publish/deprecate；准备清单给人 |
| **required_invoke_hats** | `30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-212 | **approved** | — | — |
| HG-SPEC-SIGNOFF | **approved** | — | — |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 |
| HG-AUDIT-R1 | **approved** | **30** | 00 代签 · R1=`docs/harness/reviews/task_2_1_2_rename_closeout_w4_release_audit_R1_20260910.md` · **不含** publish |
| **HG-PUBLISH** | pending | — | **仅人** |
| **HG-DEPRECATE-HARNESS** | pending | — | **仅人** |

---

## 目标

建立 `v2.1.2` ↔ `spec-wave@2.1.2` 可溯源绑定；交付人发版与 harness deprecate 清单。

## 范围

- [x] bump `package.json` + ontology/discipline/README 等钉点 → **2.1.2**  
- [x] CHANGELOG `[2.1.2]` 节（改名收口 · 溯源说明）  
- [x] 四门：`npm run typecheck` → `test` → `build` → `test:lib`  
- [x] 准备：`git tag v2.1.2` 步骤写入 RELEASING / 人 checklist（**人**执行 tag+publish）  
- [x] ACCEPTANCE 草稿 `docs/roadmap/ACCEPTANCE_2_1_2_rename_closeout_2_1_2_zh.md`  
- [x] 人 checklist：`npm deprecate` 更新 `@cyning/harness` 文案  

## 非范围

Agent 执行 `npm publish` / `npm deprecate` / `git tag -f`

## 验收标准

- [x] 工作树 version=2.1.2 · 钉点一致 · 四门绿  
- [x] 人 checklist 完整（tag · publish · harness deprecate · ACCEPTANCE）  
- [x] **HG-PUBLISH** / **HG-DEPRECATE-HARNESS** 仍仅人（表内 pending · 未代签）  

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W4-01 | 无 tag 即 publish | 违规 RELEASING · 拒宣告 |
| W4-02 | Agent 代 publish | 禁 |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 |

---

### 自检结论（执行者）

| 项 | 结论 |
|----|------|
| version | `package.json` = **2.1.2** · ontology/discipline/README 钉点一致 |
| 四门 | `typecheck` → `test`(405) → `build` → `test:lib`(4) · **FOUR_GATES_EXIT=0** |
| ACCEPTANCE | `docs/roadmap/ACCEPTANCE_2_1_2_rename_closeout_2_1_2_zh.md`（A1/A2/A4 **pending**） |
| 人 checklist | `RELEASING.md`「人 checklist · 2.1.2」+ ACCEPTANCE |
| 禁区 | **未** `npm publish` / `npm deprecate` / `git tag` / `git push` |
| 闸 | `HG-PUBLISH` / `HG-DEPRECATE-HARNESS` **仍 pending** · **未**移 `done/` |

### 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 |
| 2026-09-10 | **30** bump 2.1.2 · 钉点 · CHANGELOG · 四门绿 · ACCEPTANCE 草稿 · 人 checklist；publish 仅人 |
