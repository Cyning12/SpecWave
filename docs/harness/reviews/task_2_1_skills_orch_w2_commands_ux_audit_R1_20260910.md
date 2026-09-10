# Task Audit R1：2_1-skills-orch-w2-commands-ux

> **task**：`docs/tasks/active/task_2_1_skills_orch_w2_commands_ux.md`  
> **日期**：2026-09-10  
> **角色**：20-task-audit（00 统筹代签 · 维护者签收授权本窗过程档）  
> **对照**：SPEC `02`/`03` §2 · `04` §W2 · PLAN B-CMD-UX · **W1 DONE**

---

## 结论

| 项 | 判定 |
|----|------|
| 验收可测 | 是（落点路径 + frontmatter 字段断言） |
| failure_paths | 是（W2-01..03） |
| 与 SPEC 对齐 | 是（仅 Commands UX；不越界 W3 DSH kit 编排） |
| 依赖 | W1 DONE · 可开工 |
| freeze 充分 | 是（见下） |
| **签收** | **HG-AUDIT-R1=approved** · 可 30 |

---

## Freeze（本波生效）

| ID | 冻结值 |
|----|--------|
| Claude 源 | `assets/ide/commands/claude/kit/<verb>.md`（五条 verb：`verify` · `gate-status` · `init-guide` · `apply-standards` · `hat-reanchor`） |
| Claude 目标 | `.claude/commands/kit/<verb>.md` → 用户可见 **`/kit:verb`** |
| Cursor 源 | 仍扁平 `assets/ide/commands/cursor/kit-*.md` |
| Cursor frontmatter | **须**含 `name: "/kit-…"` · `description` · 建议 `id` / `kit_command_id`（对齐 SPEC `02` §4） |
| 适配表 | `mvp-hosts.yaml` claude `commands.from` 指向 `assets/ide/commands/claude/kit/*`（或等价能写出子目录的 from） |
| **旧扁平迁移** | `host apply`/`update` 写新布局时：若存在旧 `.claude/commands/kit-*.md`（根下扁平）→ **备份后删除或移入 backups**（与既有 host-update 备份根一致），**禁止**新旧双份同语义并存 |
| 禁区 | 不写 DSH `kit-*` 编排 skills（W3）；不 expanded；不 bump/publish；不冒充 opsx |

---

## 对照清单

| 来源 | 要求 | R1 |
|------|------|----|
| `04` W2 | Claude `/kit:` 可发现（文件断言） | 纳入 30 |
| `04` W2 | Cursor frontmatter | 纳入 30 |
| `04` W2 | 旧扁平迁移 | freeze 上表 |
| B-CMD-UX | OpenSpec 观感 | 本波目标 |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | R1 pass · 00 代签 |
