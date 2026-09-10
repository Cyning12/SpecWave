# Task：2.1 W4 · profile=expanded（kit-hat-*）

> **状态**：`done`  
> **关联 SPEC**：`02` §3 · PLAN W4  
> **依赖**：W3 CLOSE

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1-skills-orch-w4-expanded` |
| **test_strategy** | `required` |
| **freeze_id** | 默认 `core`；`--profile expanded` 才写 kit-hat-*；仍跳过 30/40 execute hats |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | — | |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 · 2026-09-10 |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2_1_skills_orch_w4_expanded_audit_R1_20260910.md` · **W3 DONE** |

---

## 目标

`host apply/update --profile expanded` 物化 `kit-hat-*` 薄壳；conflict/`--force` 与 2.0 一致。

## 范围

- [x] commands 资产 + profile 过滤  
- [x] 测：core 无 hat 壳；expanded 有；force/conflict  
- [x] 禁 `kit-30` / `kit-publish`  

## 非范围

bump 2.1.0 · publish · onboard

## 验收

`04` §W4（前两项已勾；R1 行留给 00）。

### 自检结论（执行者）

| 命令 | 退出码 |
|------|--------|
| `node --test --experimental-strip-types test/host-adapt-w4-expanded.test.ts` | **0**（6/6） |
| `node --test --experimental-strip-types test/host-adapt-*.test.ts` | **0**（42/42） |
| `npm run typecheck` | **0** |

验收：`--profile core` 不写 kit-hat-* / graph-check / sync-prompts-guide；`--profile expanded` 写出五条 hat + graph/sync，Cursor 扁平 `kit-hat-*.md` 与 Claude `kit/hat-*.md` 对称；update conflict/`--force` 同 2.0；无 kit-30/kit-publish；仍跳过 30/40 skills；未改 W3 dsh orch、未 bump/publish/commit。

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W4-01 | 默认 core 写出 expanded | 测 FAIL |
| W4-02 | 无闸 30 slash | 拒 |
| W4-03 | HG-AUDIT-R1 pending | 拒开工 |

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1 pending |
| 2026-09-10 | 30/40：解锁 expanded · hat 薄壳七条 · 测绿 |
| 2026-09-10 | **CLOSE** · 待 00 归档 · 交 W5 |
