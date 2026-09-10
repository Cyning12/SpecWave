# Task Audit R1：2x-host-adapt-w3-skills-update

> **task**：`docs/tasks/active/task_2x_host_adapt_w3_skills_update.md`  
> **日期**：2026-09-10  
> **角色**：20-task-audit（00 代签）  
> **对照**：SPEC `01` / `04` §W3 · PLAN B-UPD · 依赖 W2 **DONE**

---

## 结论

| 项 | 判定 |
|----|------|
| 验收可测 | 是（skills 落点 · update conflict skip · `--force` 覆盖） |
| 与 SPEC 对齐 | 是（F6-A skills 面；update 刷新产品块） |
| 非范围 | 清晰（不默认 30/40 · 无 onboard · 无 bump） |
| **签收** | **HG-AUDIT-R1=approved** · 可 30 |

---

## Freeze

| ID | 冻结值 |
|----|--------|
| CLI | `npx dsh-coding-kit host update [--tools cursor,claude,dsh,agents] [--profile core] [--target PATH] [--file PATH] [--json] [--dry-run\|--yes] [--force]` |
| 默认 | dry-run 零写入；`--yes` 写入 **add** 与内容相同 skip；**conflict 默认不覆盖** |
| `--force` | 显式覆盖 conflict（先备份 `.coding-kit/backups/host-apply/` 同族或 `host-update/`） |
| `--yes`+`--dry-run` | exit 1 |
| 刷新面 | **commands + skills**（always_on 可刷新产品块，local 永不覆写；与 apply 同 merge 纪律） |
| skills 源 | `assets/skills/*` 目录；复用 `cli-skills` 跳过 30/40 逻辑（`EXECUTE_HAT_DIRS` / track）；**禁止**默认 `--with-execute-hats` |
| 落点矩阵 | dsh→`.dsh/skills`；cursor→`.cursor/skills`；claude→`.claude/skills`；agents→`.agents/skills`；成文 `assets/ide/host-adapt/README.md` |
| 表示例 | `mvp-hosts.yaml` **须含** dsh/cursor/claude/**agents** 四行 skills |
| S2 | 命中 → exit 2 整次零写入 |
| apply | W3 起 `host apply` **亦可**物化 skills（与表一致）；W2 测须仍绿 |

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | R1 通过 · 00 代签 |
