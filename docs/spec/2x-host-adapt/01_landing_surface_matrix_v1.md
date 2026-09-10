# 01 · 宿主落点面矩阵（四类表面）

> **状态**：`draft` · 隶属 `2x-host-adapt`  
> **上游盘点**：[`../1x-closeout/host_landing_inventory_v1.md`](../1x-closeout/host_landing_inventory_v1.md)  
> **问题**：P6-prep 只覆盖 **always_on 文档/规则片段**；多平台「明确使用」还缺 **commands** 与显式 skills 落点行。

---

## 1. 四类落点（F6 适配表列）

| surface_id | 含义 | 用户感知 | kit 职责 |
|------------|------|----------|----------|
| **always_on** | 打开仓即生效的指针/规则 | AGENTS / CLAUDE / `.cursor/rules` | Inform/Constrain POINTER（薄） |
| **skills** | Agent Skills（长文能力包） | `.dsh/skills` / `.claude/skills` / `.agents/skills` | 现有 `skills build|install` |
| **commands** | IDE slash / 命令面板入口 | `.cursor/commands` / `.claude/commands` / … | **2.0 新增一等公民** |
| **verify** | 机械门禁 | 终端 / CI | **不物化进 IDE 伪闸**；command 只唤起 CLI |

> **原则**：`commands` = Orchestrate 可发现入口；`verify` = 真值；禁止用 markdown command「假装 exit 0」。

---

## 2. 宿主 × 表面（扩展盘点 · draft）

| host_id | always_on | skills | commands | verify 入口 | 1.12 现状 |
|---------|-----------|--------|----------|-------------|-----------|
| `dsh` | （可选）薄 AGENTS | `.dsh/skills`（已接线） | **可选/空**（工具调用为主） | `npx dsh-coding-kit …` + 插件工具 | 首宿主；无 slash 产品面 |
| `cursor` | `.cursor/rules/*.mdc` | `.cursor/skills` 或 `.agents/skills` | **`.cursor/commands/kit-*.md`** | command → CLI | 仅有 rules example |
| `claude` | `CLAUDE.md` marker | `.claude/skills` | **`.claude/commands/…`** | 同上 | 仅有 CLAUDE fragment |
| `agents` | `AGENTS.md` marker | `.agents/skills` | 视 client；可仅 skills | 同上 | 仅有 AGENTS fragment |
| `codex` | 待查 | `.agents/skills`（OpenSpec 亦共享此树） | skills 优先 | CLI | P6-prep 候选 |
| `copilot` | `.github/copilot-instructions.md` 等 | 有限 | 有限 | CI + CLI | P6-prep 候选 |

---

## 3. 适配表行（示意 · 非实现 schema）

```yaml
# 示意 only · 2.0 真 schema 另开 freeze
host_id: cursor
surfaces:
  always_on:
    - target: .cursor/rules/05-kit-starter.mdc
      source: assets/ide/adapters/cursor-kit-starter.mdc
  skills:
    - target_dir: .cursor/skills
      from: assets/skills/*   # 或子集 profile
  commands:
    - target_dir: .cursor/commands
      from: assets/ide/commands/cursor/*
      profile: core           # 见 02 · core vs expanded
  verify:
    kind: cli
    bin: dsh-coding-kit
    failClosed: true
```

---

## 4. Profile（借鉴 OpenSpec · 采纳建议）

| profile | 默认安装的 commands 集合 | 用途 |
|---------|--------------------------|------|
| **core** | apply-standards / verify / gate-status / init-guide / hat-reanchor | 新装默认；少而硬 |
| **expanded** | + hat-10-spec / hat-10-task / hat-20-* / graph-check / sync-prompts-guide / onboard | 权力用户 / 维护者仓 |
| **custom** | 声明式勾选 | 对标 OpenSpec `config profile` |

**delivery**（可选独立轴）：`skills-only` | `commands-only` | `both`（默认 both）—— DSH 行可强制 `skills(+tools)-primary`。

---

## 5. 与 P6-prep 表的 delta

| 项 | P6-prep | 本矩阵 |
|----|---------|--------|
| 列 | host → 单路径 | host → **多 surface** |
| commands | **未列** | **必列**（可标 `n/a`） |
| skills 落点 | 未进 IDE 表 | 显式行 |
| profile | 无 | core / expanded |

---

## 6. 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 初稿：四类表面 + 宿主矩阵 + profile |
