# Task Audit R1：2_1-skills-orch-w3-dsh-orch

> **task**：`docs/tasks/active/task_2_1_skills_orch_w3_dsh_orch.md`  
> **日期**：2026-09-10  
> **角色**：20-task-audit（00 统筹代签）  
> **对照**：SPEC `03` §3 · `02` core 表 · PLAN **B-DSH-ORCH=B** · **W2 DONE**

---

## 结论

| 项 | 判定 |
|----|------|
| 验收可测 | 是（`.dsh/skills/kit-*` 存在性；无 `.dsh/commands`） |
| failure_paths | 是（W3-01..03） |
| 与 SPEC/上游对齐 | 是（skills `/name`；禁虚构 commands 目录） |
| 依赖 | W2 DONE |
| freeze 充分 | 是 |
| **签收** | **HG-AUDIT-R1=approved** · 可 30 |

---

## Freeze（本波生效）

| ID | 冻结值 |
|----|--------|
| 编排 skills 源 | 新建 `assets/ide/skills-orch/`（或等价）下五条：`kit-verify` · `kit-gate-status` · `kit-init-guide` · `kit-apply-standards` · `kit-hat-reanchor`（`SKILL.md` 或官方允许扁平） |
| 正文语义 | 与 Cursor `kit-*.md` **同语义**（必跑 CLI；禁口头代闸） |
| DSH 落点 | `host apply --tools dsh` → `.dsh/skills/<id>/`（与 harness-* **并存**） |
| 适配表 | dsh `skills` 可多条 `from`（帽子 `assets/skills/*` + 编排 `assets/ide/skills-orch/*`），或单一 from 能覆盖两者；**commands 仍 `[]`** |
| **禁止** | 任何路径创建/写入 **`.dsh/commands/`** |
| 禁区 | 不改 Claude/Cursor commands 布局（W2 已定）；不 expanded；不 bump/publish |
| 上游钉 | 发现根 = `.dsh/skills`（deepseek-harness `project-dsh`） |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | R1 pass · 00 代签 |
