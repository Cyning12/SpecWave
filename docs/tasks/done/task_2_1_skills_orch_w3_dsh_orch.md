# Task：2.1 W3 · DSH 编排 skills（B-DSH-ORCH=B）

> **状态**：`done`  
> **关联 SPEC**：`03` §3 · PLAN W3  
> **依赖**：W2 CLOSE（建议；可与 W2 串行）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1-skills-orch-w3-dsh-orch` |
| **test_strategy** | `required` |
| **freeze_id** | 编排写入 `.dsh/skills/kit-*`；**禁止** `.dsh/commands/`；正文同 Cursor kit 语义 |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | 系列已签 · B=B |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 · 2026-09-10 |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2_1_skills_orch_w3_dsh_orch_audit_R1_20260910.md` · **W2 DONE** |

---

## 目标

DSH 上 core 五条编排以 **skills `/name`** 可发现；真值仍 CLI。

## 范围

- [x] 资产：`assets/ide/skills-orch/kit-*/SKILL.md` + apply 映射到 `.dsh/skills/kit-*`  
- [x] 测：apply `--tools dsh` 后存在 kit-verify 等；**不**创建 `.dsh/commands`  
- [x] 文档：上游指针 deepseek-harness `docs/subsystems/skills.md`（`assets/ide/skills-orch/README.md` · host-adapt README）  

## 非范围

`ctx.commands.register` 插件真·command · expanded · publish

## 验收

`04` §W3（前三项已勾；R1 行留给 00）。

### 自检结论（执行者）

| 命令 | 退出码 |
|------|--------|
| `node --test --experimental-strip-types test/host-adapt-w3-dsh-orch.test.ts` | **0**（4/4） |
| `node --test --experimental-strip-types test/host-adapt-*.test.ts` | **0**（36/36） |
| `npm run typecheck` | **0** |

验收：`.dsh/skills` = harness 六 + `kit-*` 五；`commands: []`；无 `.dsh/commands` 目录/写入；正文必跑 CLI、禁口头代闸。未碰 W4 expanded、bump/publish/commit、Claude 布局。剩余风险：DSH Web GUI `/kit-verify` 实机发现依赖人录屏；上游 skills 发现器行为以 deepseek-harness 为准。

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W3-01 | 写出 `.dsh/commands/` | 拒 / 测 FAIL |
| W3-02 | 编排 skill 口头代闸 | 正文纪律 FAIL |
| W3-03 | HG-AUDIT-R1 pending | 拒开工 |

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1 pending |
| 2026-09-10 | 30/40：skills-orch 五条 + dsh 双 from + 测绿 |
| 2026-09-10 | **CLOSE** · 待 00 归档 · 交 W4 |

| 2026-09-10 | **CLOSE** · 归档 done · 交 W4 |
