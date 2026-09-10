# 宿主落点清单 · P6-prep（1.12 · 声明式）

> **状态**：`signed` / **done（prep）** · 1x-closeout W4  
> **非目标**：不做多宿主编译器 / F6 引擎（2.0）  
> **用途**：为 2.0 F6 适配表提供盘点真值  
> **上游**：[`PLAN_post_1.11_zh.md`](../../roadmap/PLAN_post_1.11_zh.md) · P6-prep

---

## 现行落点（kit 包内）

| host_id | 落点路径（消费者仓） | 包内源 | 物化方式 | 状态 |
|---------|----------------------|--------|----------|------|
| `agents` | `AGENTS.md` | `assets/ide/adapters/AGENTS.md.fragment.example` | marker merge（手工/未来适配表） | 已有片段 |
| `claude` | `CLAUDE.md` | `assets/ide/adapters/CLAUDE.md.fragment.example` | marker merge | 已有片段 |
| `cursor` | `.cursor/rules/05-harness-starter.mdc` | `assets/ide/adapters/cursor-harness-starter.mdc.example` | 复制 example | 已有片段 |
| `dsh` | 宿主内 `apply_coding_standards` / `.coding-kit` | `assets/standards` 等 | DSH 插件面 | **首个宿主**（现行） |

## 过程 / 布局（非宿主 IDE，但与分发相关）

| id | 路径 | 说明 |
|----|------|------|
| `kit_layout` | `.coding-kit/` | F4 现行写根 |
| `legacy_layout` | `.cyning-harness/` | legacy 只读 |
| `s2` | `docs/tasks` / `docs/harness/reviews` / `docs/harness/invokes/by-task` | 永不覆写 |

## 2.0 候选（本波不实现）

| host_id | 候选落点 | 备注 |
|---------|----------|------|
| `copilot` | `.github/copilot-instructions.md` 等 | 待 F6 SPEC |
| `codex` | 待查上游约定 | 待 F6 SPEC |

### 已知缺口（2026-09-10 补记 · 不改 prep 签收范围）

| 缺口 | 说明 | 承接 |
|------|------|------|
| **commands 表面未列** | 本表仅 always_on 片段；缺 `.cursor/commands` / `.claude/commands` 等 | [`../2x-host-adapt/01_landing_surface_matrix_v1.md`](../2x-host-adapt/01_landing_surface_matrix_v1.md) |
| **skills IDE 落点未列** | 包内 `skills install` 主攻 `.dsh/skills`；多宿主 skills 路径未进本表 | 同上 · `02`/`03` |

## DSH 契约嗅探（需求条文 · 1.12 只成文）

- **需求 ID**：U-01（架构）  
- **行为草案**：加载插件前探测宿主/契约版本；不匹配 → 降级提示，不静默写坏  
- **实现**：2.0；本波不接线

## 签收

| 项 | 值 |
|----|-----|
| prep 范围 | 声明清单 + U-01 成文 |
| F6 引擎 | **拒开工**（2.0） |
| 签收 | 00 · 2026-09-10 · W4 CLOSE |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | W4 初版盘点 |
| 2026-09-10 | prep **signed/done** |
| 2026-09-10 | 补记 commands/skills 缺口 POINTER → `docs/spec/2x-host-adapt/`（**不**重开 prep 范围） |
