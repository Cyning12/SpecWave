# Skills · 编排轴（DSH `/kit-*`）

> **用途**：DSH 项目本地 slash 发现根为 `.dsh/skills`（上游 deepseek-harness · `project-dsh` · `docs/subsystems/skills.md`）。  
> **无** `.dsh/commands` 扫描器；编排面以本目录五条 skill 物化，与帽子 `assets/skills/harness-*` 并存。

| skill_id | 真值 |
|----------|------|
| `kit-verify` | `verify --task` · exit 0/1/2 |
| `kit-gate-status` | `status` / `gate-check` + task 闸表 |
| `kit-init-guide` | 双入口（插件 ≠ CLI） |
| `kit-apply-standards` | DSH 工具或 standards POINTER |
| `kit-hat-reanchor` | POINTER → `harness-hat-reanchor` |

正文语义与 Cursor `assets/ide/commands/cursor/kit-*.md` 对齐：必跑 CLI；禁止口头代闸。

物化：`mvp-hosts.yaml` → `host_id: dsh` · `skills` 第二条 `from: assets/ide/skills-orch/*` → `.dsh/skills/kit-*/SKILL.md`。
