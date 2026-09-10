# 起草 · 2.1.2 W0 · SpecWave 改名收口签收

> **status**：`done` · **wave**：W0  
> **spec**：[`docs/spec/2_1_2-rename-closeout/`](../../spec/2_1_2-rename-closeout/)  
> **plan**：[`docs/roadmap/PLAN_2_1_2_rename_closeout_v1_zh.md`](../../roadmap/PLAN_2_1_2_rename_closeout_v1_zh.md)  
> **test_strategy**：`not_applicable`  
> **wiki_delta**：`none`  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1_2-rename-closeout-w0-planning` |
| **test_strategy** | `not_applicable` |
| **wiki_delta** | `none` |
| **required_invoke_hats** | `00` |
| **close_pr_policy** | `exempt` |

### 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-NEXT-212** | **approved** | 2026-09-10 人授权 · 00 代签落表 |
| **HG-SPEC-SIGNOFF** | **approved** | B-* 冻结 · 2026-09-10 |
| **HG-AUDIT-R1** | n/a | — |

---

## 背景与目标

立项 **2.1.2**：收口 SpecWave 改名发版完整度（溯源 · 迁移链 · 对外身份 · init `--yes`）。

## 范围

- [x] PLAN + SPEC `00`–`05` + 索引  
- [x] **HG-NEXT-212** + **HG-SPEC-SIGNOFF**  
- [x] 冻结 B-*（含 B-SEMVER-212 / B-INIT-YES / B-REPORT-SCHEMA=拒绝）  
- [x] 人授权：**00 可代签后续过程文档**（AUDIT-R1 / reviews / task CLOSE）；PUBLISH/DEPRECATE 仅人  
- [x] 拆 W1–W4 task  

## 非范围

实现码 · bump · publish · deprecate

## 验收

- [x] 两闸 approved · B-* 写入 SPEC README  
- [x] W1–W4 task 已建  

## 失败路径

| 触发 | 行为 |
|------|------|
| 闸 pending | **停** |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | **CLOSE** · 签收 · 拆波 · 交 W1 |
