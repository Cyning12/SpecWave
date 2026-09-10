# 2.x · 宿主适配（F6）· SPEC 系列

> **状态**：`signed`（**HG-SPEC-SIGNOFF=approved** · 2026-09-10 · 维护者「批准」· 00 代签）  
> **spec_slug**：`2x-host-adapt`  
> **拟发版**：`dsh-coding-kit@2.0.0`  
> **基线包**：`1.12.1`（1.x **CLOSED**）  
> **上游规划**：[`PLAN_2x_host_adapt_v1_zh.md`](../../roadmap/PLAN_2x_host_adapt_v1_zh.md)（**signed**）  
> **1.x 审计**：[`AUDIT_1x_residual_after_1_12_1_zh.md`](../../roadmap/AUDIT_1x_residual_after_1_12_1_zh.md)  
> **P6-prep**：[`../1x-closeout/host_landing_inventory_v1.md`](../1x-closeout/host_landing_inventory_v1.md)  
> **Open Folder**：`dsh-coding-kit/`  
> **实现**：须各 wave `HG-AUDIT-R1` 后方可 30 改码

---

## 一句话

单一规范源 → N 宿主原生配置位（**always_on + skills + commands**）；Verify 真值仍在 CLI failClosed；DSH 为首个宿主。

---

## 读序

1. [`../../roadmap/PLAN_2x_host_adapt_v1_zh.md`](../../roadmap/PLAN_2x_host_adapt_v1_zh.md)  
2. [`00_policy_and_boundaries.md`](./00_policy_and_boundaries.md)  
3. [`01_landing_surface_matrix_v1.md`](./01_landing_surface_matrix_v1.md)  
4. [`02_commands_catalog_draft_v1.md`](./02_commands_catalog_draft_v1.md)  
5. [`03_borrow_research_openspec_and_peers_v1.md`](./03_borrow_research_openspec_and_peers_v1.md)  
6. [`04_waves_and_acceptance_v1.md`](./04_waves_and_acceptance_v1.md)  
7. Tasks：`docs/tasks/active/task_2x_host_adapt_w1_*.md` …

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-NEXT-2X** | **approved**（2026-09-10） | ~~开主线~~ |
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-10） | ~~定稿~~ · 授权拆实现 task |
| **HG-AUDIT-R1** | pending（按 wave） | 各实现 30 |
| **HG-PUBLISH** | pending | `2.0.0` publish（仅人） |

---

## Wave 索引

| Wave | task_slug | 状态 |
|------|-----------|------|
| W0 | `2x-host-adapt-w0-signoff` | **done** |
| W1 | `2x-host-adapt-w1-schema` | **done** |
| W2 | `2x-host-adapt-w2-cursor-claude` | **done** |
| W3 | `2x-host-adapt-w3-skills-update` | **done** |
| W4 | `2x-host-adapt-w4-dsh-u01` | **done** |
| W5 | `2x-host-adapt-w5-release` | **done**（publish 待人 / HG-PUBLISH pending） |

---

## 目录树

```text
docs/spec/2x-host-adapt/
├── README.md
├── 00_policy_and_boundaries.md
├── 01_landing_surface_matrix_v1.md
├── 02_commands_catalog_draft_v1.md
├── 03_borrow_research_openspec_and_peers_v1.md
└── 04_waves_and_acceptance_v1.md
```

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 初立草稿 |
| 2026-09-10 | 推进 PLAN_2x / waves |
| 2026-09-10 | **HG-SPEC-SIGNOFF=approved**；W0 DONE；拆 W1–W5 |
| 2026-09-10 | W1 **done**（40 CLOSE） |
| 2026-09-10 | W2 **done**（40 CLOSE） |
| 2026-09-10 | W3 **done**（40 CLOSE） |
| 2026-09-10 | W4 **done**（40 CLOSE） |
| 2026-09-10 | W5 **done**（40 CLOSE · git/tag `v2.0.0` · publish 待人） |
