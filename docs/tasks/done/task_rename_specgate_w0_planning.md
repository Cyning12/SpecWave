# 起草 · SpecGate 改名 W0 · 规划签收

> **状态**：`done` · **wave**：W0  
> **spec**：[`docs/spec/rename-specgate/`](../../spec/rename-specgate/)  
> **plan**：[`docs/roadmap/PLAN_rename_specgate_v1_zh.md`](../../roadmap/PLAN_rename_specgate_v1_zh.md)  
> **test_strategy**：`not_applicable`  
> **wiki_delta**：`none`  
> **Open Folder**：现行仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `rename-specgate-w0-planning` |
| **test_strategy** | `not_applicable` |
| **wiki_delta** | `none` |
| **required_invoke_hats** | `00` |
| **close_pr_policy** | `exempt` |

### 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-RENAME** | **approved** | 2026-09-10 人签收 |
| **HG-SPEC-SIGNOFF** | **approved** | `spec-wave@2.1.1` · Rename · 2026-09-10 |
| **HG-AUDIT-R1** | n/a | — |

---

## 背景与目标

立项将 **`dsh-coding-kit` → SpecGate**：npm **`spec-wave@2.1.1`**；GitHub **Rename → SpecGate**。

## 范围

- [x] 落盘 PLAN + SPEC + CHANGELOG Planned  
- [x] **HG-RENAME** + **HG-SPEC-SIGNOFF**  
- [x] B-SEMVER=**A** · B-REPO=**Rename**  
- [x] 拆 W1–W4 task  

## 非范围

实现改名码 · publish · deprecate（后续波）

## 验收标准

- [x] 两闸 approved  
- [x] npm 名冻结 `specgate` · 版本 2.1.1  
- [x] W1–W4 task 已建  

### 自检结论（执行者）

00 · 2026-09-10 · CLOSE · 交 W1/W3

## failure_paths

| 触发 | 行为 |
|------|------|
| 闸 pending | **停** |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 |
| 2026-09-10 | **CLOSE** · 签收 SEMVER=A · REPO=Rename |
