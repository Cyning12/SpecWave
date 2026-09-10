# 01 · 表面 parity 矩阵（2.1）

> **状态**：`draft` · 隶属 `2_1-skills-orchestration`

---

## 1. 双表面

| 表面 | 资产源 | 用户直觉 |
|------|--------|----------|
| **Skills** | `assets/skills/harness-*` | Cursor「技能」· Claude skills · DSH `.dsh/skills` |
| **Commands（编排）** | `assets/ide/commands/{cursor,claude}/…` | Cursor `/kit-…` · Claude `/kit:…` · DSH 等价入口 |

两者 **互补**：Skills=戴帽做事；Commands=编排跑闸/入口说明。`kit-hat-reanchor` 可 POINTER 到 skill，不复制全文。

---

## 2. 宿主 × 表面（2.1 目标态）

| host_id | Skills | Commands / 编排 | 发现方式（验收） |
|---------|--------|-----------------|------------------|
| `cursor` | `.cursor/skills/harness-*` | `.cursor/commands/kit-*.md` | `/h` 技能 · `/kit` 命令 |
| `claude` | `.claude/skills/harness-*` | `.claude/commands/kit/<verb>.md` → **`/kit:verb`** | 输入 `/kit` 弹出命名空间列表 |
| `dsh` | `.dsh/skills/harness-*` **+** `.dsh/skills/kit-*`（编排） | **无** `.dsh/commands/`；编排用 skills `/name`（B 已冻结） | DSH Web `/kit-verify` 等 + CLI 同真值 |
| `agents` | `.agents/skills/harness-*` | 可空或薄 POINTER（W4 可选） | 目录断言为主 |

`host apply --tools cursor,claude,dsh --profile core` 须一次覆盖上表 core 行。

---

## 3. profile

| profile | Skills | Commands |
|---------|--------|----------|
| `core`（默认） | 全量默认 skills（跳过 30/40） | 五条：verify / gate-status / init-guide / apply-standards / hat-reanchor |
| `expanded` | 同 skills | + `kit-hat-*`（薄壳→skill）及 [`02`](./02_commands_and_skills_catalog_v1.md) 所列可选条 |

---

## 4. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
| 2026-09-10 | DSH 行：编排 skills + B 冻结 |
