# 规划 · 2.1.2 · SpecWave 改名收口

> **状态**：`signed` · **CLOSED**（W0–W4 DONE · **HG-PUBLISH** / **HG-DEPRECATE-HARNESS=approved** · `2.1.2` **published** · 2026-09-10）  
> **目标发版**：`spec-wave@2.1.2`（**patch** · 改名完整度 + 溯源 + 迁移链 + init 健壮性）  
> **基线**：`spec-wave@2.1.1` published · 改名验收曾未达发版级完整  
> **证据**：[`.workbuddy/output/审查报告-SpecWave-2.1.1-改名验收.md`](../../.workbuddy/output/审查报告-SpecWave-2.1.1-改名验收.md)  
> **系列 SPEC**：[`docs/spec/2_1_2-rename-closeout/`](../spec/2_1_2-rename-closeout/)（`signed` · **CLOSED**）  
> **验收**：[`ACCEPTANCE_2_1_2_rename_closeout_2_1_2_zh.md`](./ACCEPTANCE_2_1_2_rename_closeout_2_1_2_zh.md)

---

## 一句话

用 **2.1.2** 收口改名：tag↔npm 可溯源、废弃链直达 `spec-wave`、对外自报名与 assets 一致，并修 `init --yes` 挂起。

---

## Waves

| Wave | 覆盖 | 状态 |
|------|------|------|
| W0 | 签收 B-* | **DONE** |
| W1 | CLI 身份 + MIGRATION/RELEASING | **DONE** |
| W2 | assets / README / AGENTS | **DONE** |
| W3 | init `--yes` 非交互 | **DONE** |
| W4 | bump · tag · publish · deprecate | **DONE** |

---

## 人工闸

| human_gate_id | status |
|---------------|--------|
| **HG-NEXT-212** | **approved** |
| **HG-SPEC-SIGNOFF** | **approved** |
| **HG-PUBLISH** | **approved** · 人 · 2026-09-10 |
| **HG-DEPRECATE-HARNESS** | **approved** · 人 · 2026-09-10 |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft · signed · 开波 |
| 2026-09-10 | **CLOSED** · `spec-wave@2.1.2` published · 链式 deprecate 切断 |
