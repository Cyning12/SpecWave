# docs/spec · kit 侧 SPEC 索引

> **公约**：新长期 SPEC → 专属夹 `docs/spec/<slug>/`（见 [`doc-health/03_spec_layout_convention.md`](./doc-health/03_spec_layout_convention.md)）。  
> **产品总 SPEC**：仓根 [`SPEC.md`](../../SPEC.md)（不强制迁入本目录）。  
> **试点消费者**：`ops-desk-api` → 镜像 `docs/spec/doc-health/`（POINTER · process · FEEDBACK）。

| slug | 路径 | 状态 | 一句话 |
|------|------|------|--------|
| `1x-mvp` | [`1x-mvp/`](./1x-mvp/) | **signed** · **1.11.0 published** · 三方验收通过 | 1.x MVP F1–F5；下一版见 [`1x-closeout/`](./1x-closeout/) |
| `1x-closeout` | [`1x-closeout/`](./1x-closeout/) | **signed** · **CLOSED**（`1.12.0`+`1.12.1`）· `@cyning/harness` deprecated | 1.x 收口完成；审计见 [`../roadmap/AUDIT_1x_residual_after_1_12_1_zh.md`](../roadmap/AUDIT_1x_residual_after_1_12_1_zh.md) |
| `2x-host-adapt` | [`2x-host-adapt/`](./2x-host-adapt/) | **signed** · **IMPLEMENTED** · **`2.0.0` published** · 归档 [`../roadmap/ACCEPTANCE_2x_host_adapt_2_0_0_zh.md`](../roadmap/ACCEPTANCE_2x_host_adapt_2_0_0_zh.md) | F6：四类落点 + commands；规划 [`../roadmap/PLAN_2x_host_adapt_v1_zh.md`](../roadmap/PLAN_2x_host_adapt_v1_zh.md) |
| `2_1-skills-orchestration` | [`2_1-skills-orchestration/`](./2_1-skills-orchestration/) | **signed** · **IMPLEMENTED** · **`2.1.0` published** · 归档 [`../roadmap/ACCEPTANCE_2_1_skills_orch_2_1_0_zh.md`](../roadmap/ACCEPTANCE_2_1_skills_orch_2_1_0_zh.md) | 2.1：多平台技能+编排；规划 [`../roadmap/PLAN_2_1_skills_orchestration_v1_zh.md`](../roadmap/PLAN_2_1_skills_orchestration_v1_zh.md) |
| `2_1_1-host-tools-ux` | [`2_1_1-host-tools-ux/`](./2_1_1-host-tools-ux/) | **signed** · **IMPLEMENTED** · **`2.1.1` published** · 归档 [`../roadmap/ACCEPTANCE_2_1_1_host_tools_ux_2_1_1_zh.md`](../roadmap/ACCEPTANCE_2_1_1_host_tools_ux_2_1_1_zh.md) | 2.1.1：init 选平台 + 粘性 tools + update UX（对齐 OpenSpec）；规划 [`../roadmap/PLAN_2_1_1_host_tools_ux_v1_zh.md`](../roadmap/PLAN_2_1_1_host_tools_ux_v1_zh.md) |
| `rename-specgate` | [`rename-specgate/`](./rename-specgate/) | **signed** · W0–W4 DONE（功能/发版）· 改名完整度残留 → [`2_1_2-rename-closeout/`](./2_1_2-rename-closeout/) | 产品改名 SpecWave · npm `spec-wave@2.1.1` · GitHub Rename；规划 [`../roadmap/PLAN_rename_specgate_v1_zh.md`](../roadmap/PLAN_rename_specgate_v1_zh.md) |
| `2_1_2-rename-closeout` | [`2_1_2-rename-closeout/`](./2_1_2-rename-closeout/) | **signed** · **IMPLEMENTED** · **`2.1.2` published** · **CLOSED** · 归档 [`../roadmap/ACCEPTANCE_2_1_2_rename_closeout_2_1_2_zh.md`](../roadmap/ACCEPTANCE_2_1_2_rename_closeout_2_1_2_zh.md) | 改名收口：tag↔npm 溯源 · 切断链式废弃 · 对外身份一致 · init `--yes`；规划 [`../roadmap/PLAN_2_1_2_rename_closeout_v1_zh.md`](../roadmap/PLAN_2_1_2_rename_closeout_v1_zh.md) |
| `2.1.3`（patch 收尾行） | —（无独立 SPEC 夹） | **signed** · **`2.1.3` published** · 属 `2_1_2-rename-closeout` 系列残留修复（git 8797b76 + 82fe0dc） | 2.1.3 · 溯源自动化 · patch：README/断言收尾 + 发布溯源测（tag↔package.json · `test/release-tag-identity.test.ts`）；tag `v2.1.3` ↔ `spec-wave@2.1.3` |
| `2_2-closed-loop-start` | [`2_2-closed-loop-start/`](./2_2-closed-loop-start/) | **signed** · **IMPLEMENTED** · **待发版**（W1–W7 CLOSE · 459/459 绿 · bump `2.2.0` 已落 main · tag/publish 归维护者） | 2.2.0 闭环起步：W1 版本/身份钉自动化（核心）+ W2–W7 安全封堵/可观测字段/上手断档/术语表/三宿主/小清理；规划 [`../roadmap/PLAN_2_2_closed_loop_start_v1_zh.md`](../roadmap/PLAN_2_2_closed_loop_start_v1_zh.md) |
| `doc-health` | [`doc-health/`](./doc-health/) | draft · HG-SPEC-SIGNOFF=pending | 文档健康度 + CLOSE 强绑定 · 试点 ops-desk-api |
| `self-tech-graph` | [`self-tech-graph/`](./self-tech-graph/) | **signed** · **W0–W4 CLOSE** · **已发 1.9.1**（npm `latest` · tag `v1.9.1`） | kit 自身三层技术图谱 + 外置三树迁留 · 读序见 [`self-tech-graph/README.md`](./self-tech-graph/README.md) |

**历史过程 SPEC（留外 · 树 B 历史债）**：工作区 `docs/dsh_coding_kit_init/spec/`（SPEC 1.0→1.2.2 过程档）· 现行仓根 [`SPEC.md`](../../SPEC.md) · 指针 [`self-tech-graph/reference/POINTERS.md`](./self-tech-graph/reference/POINTERS.md)
