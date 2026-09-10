# 03 · 宿主 UX 映射（2.1）

> **状态**：`draft` · 隶属 `2_1-skills-orchestration`  
> **对标样本**：OpenSpec — Cursor 扁平 `opsx-*.md`；Claude 子目录 `opsx/explore.md` → `/opsx:explore`  
> **DSH 上游**：本机 `/Users/cyning/Desktop/deepseek-harness`（约 `0.1.3-alpha.2`）

---

## 1. Cursor

| 项 | 2.0 | 2.1 |
|----|-----|-----|
| Skills | `.cursor/skills/harness-*` | 同；验收要求 `/` 技能菜单可滤 `harness` |
| Commands | `.cursor/commands/kit-*.md` | 补 `name`/`id`/`description`；`/kit` 可发现 |
| 落点 CLI | `host apply --tools cursor` | 不变 |

---

## 2. Claude Code

| 项 | 2.0 | 2.1 |
|----|-----|-----|
| Skills | `.claude/skills/harness-*` | 同；发现性验收 |
| Commands | **扁平** `.claude/commands/kit-verify.md` | **子目录** `.claude/commands/kit/verify.md` → **`/kit:verify`** |
| 迁移 | — | `host update`：新布局写入；旧扁平 `kit-*.md` 策略（删/提示/备份）须在 W2 freeze，避免双命令 |

---

## 3. DSH（B-DSH-ORCH = **B** · 已冻结）

**意图（B）**：编排面也要能用 **`/` 调出**（与 Cursor/Claude 观感对齐）。

**上游事实**（不可违背）：

| 机制 | 官方落点 / API | 依据 |
|------|----------------|------|
| 项目本地可 `/name` 的指令文件 | **`<projectRoot>/.dsh/skills`**（rank 100 `project-dsh`）；另有 `.agents/skills` | `docs/subsystems/skills.md` · `packages/skill/skill-filesystem` |
| Human Commands（不进模型消息） | 仅插件 **`ctx.commands.register()`** | `docs/subsystems/commands.md` · `packages/interaction/commands` |
| `.dsh/commands/*.md` | **不存在**扫描逻辑 | 全仓无此路径 |

**2.1 落地（B 重述后的唯一主方案）**：

1. `host apply --tools dsh` 除帽子 `harness-*` 外，再写入 **编排 skills**（建议 id：`kit-verify` · `kit-gate-status` · `kit-init-guide` · `kit-apply-standards` · `kit-hat-reanchor`），目录形如 `.dsh/skills/kit-verify/SKILL.md`（或官方允许的扁平 `kit-verify.md`）。  
2. 正文与 Cursor `kit-*.md` **同语义**：必跑对应 CLI；禁止口头代闸。  
3. **禁止**创建 `.dsh/commands/`（对上游无效，易误导消费者）。  
4. 真·`ctx.commands.register` 若未来要做「不进模型的一键执行」→ **另开子项**，不阻塞 2.1.0 默认路径。

| 已拒绝 | 原因 |
|--------|------|
| 原草案「写 `.dsh/commands`」字面 B | 上游无发现器 |
| 仅文档、无可 `/` 的编排 skill（旧 C） | 不满足 B 的发现性 |
| 把编排只藏在 `harness-*` 长文里 | 难发现、难与 Cursor `/kit` 对照 |

---

## 4. 与 OpenSpec / spec-kit 共存

| 前缀 | 产品 |
|------|------|
| `/opsx…` · `/openspec…` | OpenSpec |
| `/speckit…` | spec-kit |
| `/kit…` · `harness-…` | dsh-coding-kit |

同仓允许并存；kit 文档与 command/skill 正文 **禁止**指导用户改用错误前缀完成闸。

---

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
| 2026-09-10 | **B-DSH-ORCH=B** 按 deepseek-harness 重述为 `.dsh/skills` + `/name` |
