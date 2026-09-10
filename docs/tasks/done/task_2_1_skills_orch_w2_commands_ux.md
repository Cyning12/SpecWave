# Task：2.1 W2 · Commands UX（Claude `/kit:` + Cursor frontmatter）

> **状态**：`done`（30/40 已过 · 待 00 CLOSE）  
> **关联 SPEC**：`docs/spec/2_1-skills-orchestration/` · PLAN W2  
> **依赖**：W1 CLOSE（或 00 明示并行例外）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1-skills-orch-w2-commands-ux` |
| **test_strategy** | `required` |
| **freeze_id** | Claude 落点 `.claude/commands/kit/<verb>.md`；Cursor frontmatter 含 `name`/`description`；旧扁平迁移策略 freeze |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | 系列已签 |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 · 2026-09-10 |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2_1_skills_orch_w2_commands_ux_audit_R1_20260910.md` · **W1 DONE** |

---

## 目标

Cursor `/kit` 与 Claude `/kit:verb` 发现性对齐 OpenSpec 观感；`host apply/update` 写入新布局。

## 范围

- [x] 资产：`assets/ide/commands/claude/kit/*.md`（或 migrate 路径）  
- [x] Cursor frontmatter 最低字段（SPEC `02` §4）  
- [x] 旧扁平 `kit-*.md` 迁移/清理策略 + 测或 dogfood  
- [x] mvp-hosts.yaml / apply 路径更新  

## 非范围

DSH kit 编排 skills（W3）· expanded（W4）· bump

## 验收

`04` §W2（前三项已勾；R1 行由 00）。

### 自检结论（执行者）

| 命令 | 退出码 |
|------|--------|
| `node --test --experimental-strip-types test/host-adapt-w2-commands-ux.test.ts` | **0**（5/5） |
| `node --test --experimental-strip-types test/host-adapt-*.test.ts` | **0**（32/32） |
| `npm run typecheck` | **0** |

验收：Claude 源/落点 `kit/<verb>.md`；Cursor `name`/`description`/`id`/`kit_command_id`；apply/update 备份后删旧扁平、禁双份。未碰 W3 DSH kit-*、W4 expanded、bump/publish/commit。剩余风险：消费者仓若手改旧扁平文件名非 `kit-<verb>.md` 则不会自动清；GUI `/kit:` 实机发现依赖人录屏。

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W2-01 | 新旧双份同语义冲突未处理 | 测 FAIL 或 update 明示 |
| W2-02 | 冒充 opsx 前缀 | 拒 |
| W2-03 | HG-AUDIT-R1 pending 改码 | 拒开工 |

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1 pending |
| 2026-09-10 | 30/40：Claude kit 子目录 + Cursor frontmatter + 迁移测绿 |
| 2026-09-10 | **CLOSE** · 归档 done · 交 W3 |
