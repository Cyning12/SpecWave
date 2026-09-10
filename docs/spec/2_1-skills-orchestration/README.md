# 2.1 · 多平台技能 + 编排 · SPEC 系列

> **状态**：`signed` · **IMPLEMENTED** · **`2.1.0` published**（**HG-PUBLISH=approved** · 2026-09-10 · 人）  
> **spec_slug**：`2_1-skills-orchestration`  
> **目标包**：`dsh-coding-kit@2.1.0`（npm `latest` · tag `v2.1.0`）  
> **上游规划**：[`PLAN_2_1_skills_orchestration_v1_zh.md`](../../roadmap/PLAN_2_1_skills_orchestration_v1_zh.md)（**signed** · W0–W5 **DONE**）  
> **验收归档**：[`../../roadmap/ACCEPTANCE_2_1_skills_orch_2_1_0_zh.md`](../../roadmap/ACCEPTANCE_2_1_skills_orch_2_1_0_zh.md)  
> **基线**：[`2x-host-adapt`](../2x-host-adapt/) @ `2.0.0` **IMPLEMENTED**  
> **Open Folder**：`dsh-coding-kit/`  
> **实现**：W1–W5 **DONE**（commit `6d66484` · tag `v2.1.0` · **npm published**）

---

## 一句话

同一规范源下的 **Skills（帽子）** 与 **Commands（编排）**，在 Cursor / Claude Code / DSH（+ agents）达到 **可发现、可调用、真值仍在 CLI** 的 parity；对齐 OpenSpec 的 `/` 直观方案，职责不与 `opsx` / `speckit` 合并。

---

## 读序

1. [`../../roadmap/PLAN_2_1_skills_orchestration_v1_zh.md`](../../roadmap/PLAN_2_1_skills_orchestration_v1_zh.md)  
2. [`00_policy_and_boundaries.md`](./00_policy_and_boundaries.md)  
3. [`01_surface_parity_v1.md`](./01_surface_parity_v1.md)  
4. [`02_commands_and_skills_catalog_v1.md`](./02_commands_and_skills_catalog_v1.md)  
5. [`03_host_ux_mapping_v1.md`](./03_host_ux_mapping_v1.md)  
6. [`04_waves_and_acceptance_v1.md`](./04_waves_and_acceptance_v1.md)  
7. [`05_demo_narrative_v1.md`](./05_demo_narrative_v1.md)（对外宣讲双轴流程）  
8. Tasks：`docs/tasks/done/task_2_1_skills_orch_w*.md`

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-NEXT-21** | **approved**（2026-09-10） | ~~开 W1+ 实现~~ |
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-10） | ~~本系列定稿~~ |
| **HG-AUDIT-R1** | **approved**（W1–W5） | ~~各波 30~~ |
| **HG-PUBLISH** | **approved**（2026-09-10 · 人） | ~~`2.1.0` publish~~ |

---

## 与 2.0 关系

| 2.0 已交付 | 2.1 增量 |
|------------|----------|
| `host validate/apply/update` 管道 | UX / 发现性 / expanded profile / DSH 编排等价 |
| core 五条扁平 `kit-*` | Claude 命名空间 + frontmatter 对齐 |
| skills 落点矩阵 | 多宿主发现验收 + 录屏固化 |
| DSH `commands=[]` | **B**：编排 skills 写入 `.dsh/skills`（`/` 可调）；禁虚构 `.dsh/commands/` |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft 立档 |
| 2026-09-10 | B-DSH-ORCH=B 上游对齐；增 05 Demo 叙事 |
| 2026-09-10 | **signed** · HG-NEXT-21 / HG-SPEC-SIGNOFF=approved |
| 2026-09-10 | **published** · HG-PUBLISH=approved · `latest=2.1.0` |
