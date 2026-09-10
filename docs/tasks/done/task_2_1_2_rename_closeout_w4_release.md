# Task：2.1.2 W4 · bump · tag · 发版

> **状态**：`done` · **wave**：W4  
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
| **freeze_id** | bump **2.1.2**；Agent 不代 publish/deprecate |
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
| HG-AUDIT-R1 | **approved** | **30** | 00 代签 |
| **HG-PUBLISH** | **approved** | — | 人 · 2026-09-10 · `npm view`=`2.1.2` · 00 核验落表 |
| **HG-DEPRECATE-HARNESS** | **approved** | — | 人 · 2026-09-10 · harness/dsh 文案已指 `spec-wave` · 00 核验落表 |

---

## 目标

建立 `v2.1.2` ↔ `spec-wave@2.1.2` 可溯源绑定；切断链式废弃。

## 范围

- [x] bump · 钉点 · CHANGELOG · 四门  
- [x] tag `v2.1.2`（人/00 协助）  
- [x] `npm publish`（人）  
- [x] ACCEPTANCE 归档  
- [x] `@cyning/harness` + `dsh-coding-kit` deprecate（人）  

## 验收标准

- [x] `npm view spec-wave version` = 2.1.2  
- [x] tag ↔ package.json 身份一致  
- [x] deprecate 链直达 `spec-wave`  

### 自检结论（00 CLOSE）

```text
npm view spec-wave version → 2.1.2
@cyning/harness deprecated → use spec-wave … @2.1.2
dsh-coding-kit deprecated → renamed to spec-wave@2.1.2
git show v2.1.2:package.json → name=spec-wave version=2.1.2
```

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 |
| 2026-09-10 | 30 bump 准备 · 四门绿 |
| 2026-09-10 | **CLOSE** · 人 publish + deprecate · 00 核验归档 |
