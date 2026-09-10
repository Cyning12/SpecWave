# 规划 · 2.1.2 · SpecWave 改名收口

> **状态**：`signed`（**HG-NEXT-212** · **HG-SPEC-SIGNOFF** = **approved** · 2026-09-10）  
> **目标发版**：`spec-wave@2.1.2`（**patch** · 改名完整度 + 溯源 + 迁移链 + init 健壮性）  
> **基线**：`spec-wave@2.1.1` published · 改名验收 ⚠️ 未达发版级完整  
> **证据**：[`.workbuddy/output/审查报告-SpecWave-2.1.1-改名验收.md`](../../.workbuddy/output/审查报告-SpecWave-2.1.1-改名验收.md)  
> **系列 SPEC**：[`docs/spec/2_1_2-rename-closeout/`](../spec/2_1_2-rename-closeout/)（`signed`）  
> **禁**：Agent `npm publish` / `npm deprecate` / `git tag -f` 强推  
> **过程闸**：人授权 **00 代签** HG-AUDIT-R1 / task 过程文档；**HG-PUBLISH** / **HG-DEPRECATE-HARNESS** 仅人  

---

## 一句话

用 **2.1.2** 收口改名：tag↔npm 可溯源、废弃链直达 `spec-wave`、对外自报名与 assets 一致，并修 `init --yes` 挂起。

---

## 版本切分

| 版本 | 定位 |
|------|------|
| **2.1.1** | host tools UX + 改名半完成（功能真可用 · 身份半改） |
| **2.1.2** | **本规划**：改名发版完整度收口 |
| **2.2+** | workspaces / ontology-check / REPORT_SCHEMA 改 id 等另闸 |

---

## Waves（摘要）

| Wave | 覆盖 | 人闸 | 状态 |
|------|------|------|------|
| W0 | 签收 B-* | HG-NEXT-212 · HG-SPEC-SIGNOFF | **DONE** |
| W1 | CLI 身份 + MIGRATION/RELEASING | HG-AUDIT-R1（00 可代签） | **DONE** |
| W2 | assets / README / AGENTS | HG-AUDIT-R1（00 可代签） | **DONE** |
| W3 | init `--yes` 非交互 | HG-AUDIT-R1（00 可代签） | **DONE** |
| W4 | bump · tag · publish · harness deprecate 文案 | HG-PUBLISH · HG-DEPRECATE-HARNESS（**仅人**） | **OPEN**（30 准备中） |

细则见 SPEC [`05_waves_and_acceptance_v1.md`](../spec/2_1_2-rename-closeout/05_waves_and_acceptance_v1.md)。

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-NEXT-212** | **approved** | 2026-09-10 |
| **HG-SPEC-SIGNOFF** | **approved** | B-* 冻结 · 2026-09-10 |
| **HG-PUBLISH** | pending | 仅人 |
| **HG-DEPRECATE-HARNESS** | pending | 仅人 |

---

## 读序

1. 审查报告  
2. 本文件  
3. [`../spec/2_1_2-rename-closeout/README.md`](../spec/2_1_2-rename-closeout/README.md)  

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft 立档 |
| 2026-09-10 | **signed** · 开 W1 |
