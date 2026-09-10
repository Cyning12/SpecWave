# 起草 · 2.1.1 W0 · host tools UX 规划签收

> **status**：`done` · **wave**：W0  
> **spec**：[`docs/spec/2_1_1-host-tools-ux/`](../../spec/2_1_1-host-tools-ux/)  
> **plan**：[`docs/roadmap/PLAN_2_1_1_host_tools_ux_v1_zh.md`](../../roadmap/PLAN_2_1_1_host_tools_ux_v1_zh.md)  
> **test_strategy**：`not_applicable`  
> **wiki_delta**：`none`  
> **Open Folder**：`dsh-coding-kit/`

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1_1-host-tools-ux-w0-planning` |
| **test_strategy** | `not_applicable` |
| **wiki_delta** | `none` |
| **required_invoke_hats** | `00` |
| **close_pr_policy** | `exempt` |

### 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-NEXT-211** | **approved** | 开 2.1.1 实现 · 2026-09-10 人签收 |
| **HG-SPEC-SIGNOFF** | **approved** | SPEC 定稿 · UPDATE-DEFAULT=A · 2026-09-10 人签收 |
| **HG-AUDIT-R1** | n/a | — |

---

## 背景与目标

立项 **2.1.1**：优化 host tools **安装与更新**；**init 默认询问 IDE/宿主**（**对齐** OpenSpec `init --tools`）；粘性选型使升包后 `host update --yes` 不必再抄 LIST。

## 范围

- [x] 落盘 PLAN + SPEC `00`–`03` + 索引 + CHANGELOG Planned  
- [x] 维护者批准 **HG-NEXT-211** + **HG-SPEC-SIGNOFF**  
- [x] 冻结 B-UPDATE-DEFAULT = **A**（2026-09-10）  
- [x] 冻结 **B-HOST-ADAPT-README**：W4 对 `assets/ide/host-adapt/README.md` **完整更新**（行为落地后）  
- [x] 拆 W1–W4 task  

## 非范围

实现码 · bump · publish · OpenSpec delta · **本波不改** host-adapt README 正文（留给 W4）  

## 验收

- [x] 两闸 approved  
- [x] 子案 **A** 写入 PLAN 采纳冻结表  
- [x] W1–W4 task 已建（W4 含 host-adapt README 完整更新勾选）  

## 失败路径

| 触发 | 行为 |
|------|------|
| 闸 pending | **停**；只报 gate_id + 本路径 |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · 闸 pending |
| 2026-09-10 | 接受方案 A；W4 强制完整更新 host-adapt README |
| 2026-09-10 | **CLOSE** · 两闸 approved · 拆 W1–W4 · 归档 done |
