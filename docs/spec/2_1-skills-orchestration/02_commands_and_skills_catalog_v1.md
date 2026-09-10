# 02 · Commands / Skills 目录（2.1）

> **状态**：`draft` · 隶属 `2_1-skills-orchestration`  
> **继承**：[`../2x-host-adapt/02_commands_catalog_draft_v1.md`](../2x-host-adapt/02_commands_catalog_draft_v1.md)（2.0 core/expanded 草案）

---

## 1. Skills（默认包 · 跳过 30/40）

| skill_id | 含义 |
|----------|------|
| `harness-00-delegate-only` | 00 统筹：有 SPEC/task 初稿时禁亲自实现，只委派 |
| `harness-10-spec` | 起草/修订 SPEC |
| `harness-10-task` | 起草/修订 Harness task |
| `harness-20-spec-audit` | 书面审查 SPEC |
| `harness-20-task-audit` | 书面审查 task |
| `harness-hat-reanchor` | 长对话丢帽重锚 |

---

## 2. Commands · core（编排轴 · **非**帽链顺序）

> 五项按 **运维横切** 选：入口说明 / 规范 / 闸态 / verify / 丢帽救急。  
> **不是** 00→10→20→30 推进序；推进见 §1 Skills 与 §3 expanded。宣讲流程见 [`05`](./05_demo_narrative_v1.md)。

| command_id | Cursor 可见 | Claude 可见 | DSH（B）可见 | 真值 |
|------------|-------------|-------------|--------------|------|
| `kit-verify` | `/kit-verify` | `/kit:verify` | skill `/kit-verify` | `verify --task` · exit 0/1/2 |
| `kit-gate-status` | `/kit-gate-status` | `/kit:gate-status` | skill `/kit-gate-status` | `status` / `gate-check` + task 闸表 |
| `kit-init-guide` | `/kit-init-guide` | `/kit:init-guide` | skill `/kit-init-guide` | 双入口说明（插件≠CLI） |
| `kit-apply-standards` | `/kit-apply-standards` | `/kit:apply-standards` | skill `/kit-apply-standards` | DSH 工具或 standards POINTER |
| `kit-hat-reanchor` | `/kit-hat-reanchor` | `/kit:hat-reanchor` | skill `/kit-hat-reanchor` | POINTER → skill `harness-hat-reanchor` |

---

## 3. Commands · expanded（`profile=expanded`）

| command_id | 映射 skill / CLI |
|------------|------------------|
| `kit-hat-00-delegate` | `harness-00-delegate-only` |
| `kit-hat-10-spec` | `harness-10-spec` |
| `kit-hat-10-task` | `harness-10-task` |
| `kit-hat-20-spec-audit` | `harness-20-spec-audit` |
| `kit-hat-20-task-audit` | `harness-20-task-audit` |
| `kit-graph-check` | `graph yaml check` 指引 |
| `kit-sync-prompts-guide` | `sync prompts` dry-run 纪律 |

**仍禁止**：无闸 `kit-30` / `kit-publish` / OpenSpec 语义 archive。

---

## 4. Frontmatter（Cursor 最低字段）

```yaml
---
name: "/kit-verify"
id: "kit-verify"
description: "编排跑 dsh-coding-kit verify（failClosed；解释 exit 0/1/2）"
kit_command_id: kit-verify
---
```

Claude 文件可含 `description`；命名空间由路径 `kit/verify.md` 决定。

---

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft · 对齐 2.0 catalog + Claude 冒号命名 |
| 2026-09-10 | 标明 core=编排轴；DSH 列 `/kit-*` skill；链 05 Demo |
