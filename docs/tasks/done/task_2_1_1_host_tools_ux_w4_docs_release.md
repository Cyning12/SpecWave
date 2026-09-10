# Task：2.1.1 W4 · 文档完整更新 + bump 2.1.1

> **状态**：`done` · **wave**：W4  
> **关联 SPEC**：`03` §W4 · 验收 **A5** · PLAN **B-HOST-ADAPT-README**  
> **依赖**：W1–W3 CLOSE  
> **Open Folder**：`dsh-coding-kit/`

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1_1-host-tools-ux-w4-docs-release` |
| **test_strategy** | `recommended` |
| **test_strategy_note** | 四门 + 文档与行为一致人工勾；禁止 Agent publish |
| **freeze_id** | semver `2.1.1`；**完整更新** `assets/ide/host-adapt/README.md`（非脚注）；**禁止** Agent `npm publish` |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-211 | approved | — | |
| HG-SPEC-SIGNOFF | approved | — | |
| HG-TASK-DRAFT | **approved** | 22, 30 | 2026-09-10 · 00 代签 |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2_1_1_host_tools_ux_w4_docs_release_audit_R1_20260910.md` · W1–W3 CLOSE |
| HG-PUBLISH | **approved** | publish | 2026-09-10 · 人 · `npm view`=`2.1.1` |

---

## 目标

行为落地后 **完整改写** host-adapt README；仓根 README/Demo 对齐；bump `2.1.1`；四门绿；publish 等人。

## 范围

- [x] **完整更新** [`assets/ide/host-adapt/README.md`](../../../assets/ide/host-adapt/README.md)：CLI · 粘性 · update 解析序 A · `init --tools` · dogfood；删 2.1.0「无参=全表」与仅预告脚注  
- [x] 仓根 README 双文件 / 录屏或 Demo 升包路径一句  
- [x] CHANGELOG `[2.1.1]`；清 Unreleased Planned  
- [x] bump package + 钉点（ontology/discipline 等与 2.1.0 同口径）  
- [x] 四门：`npm run typecheck` → `npm test` → `npm run build` → `npm run test:lib`  
- [ ] tag `v2.1.1`（人决定是否 push）；**不** Agent publish  · **待 release commit 后打 tag**

## 非范围

改 W1–W3 产品行为（仅收口）· Agent publish

## 验收标准

- [x] SPEC `03` §W4 勾选 · 产品验收 A1–A5  
- [x] `assets/ide/host-adapt/README.md` **全文**对齐 2.1.1（非脚注）  
- [x] bump `2.1.1` · 四门绿 · tag 待 commit；**未** Agent publish  
- [x] `HG-PUBLISH` 仅人  

### 自检结论（执行者）

| 门 | exit |
|----|------|
| `npm run typecheck` | **0** |
| `npm test` | **0** |
| `npm run build` | **0** |
| `npm run test:lib` | **0** |

`FOUR_GATES_EXIT=0` · VERIFY PASS · **未** `npm publish` / **未** `git push` · **未**移 done（交 00）· annotated tag 待 release commit 后由 00/人打 `v2.1.1`

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W4-01 | 只改 README 脚注未全文 | 验收 A5 FAIL |
| W4-02 | Agent publish | 禁 |
| W4-03 | HG-AUDIT-R1 pending | 拒开工 |
| W4-04 | 四门红仍 bump | 拒 |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1/PUBLISH pending |
| 2026-09-10 | W1–W3 CLOSE · R1 代签可 30 |
| 2026-09-10 | 30：全文 host-adapt + bump 2.1.1 + 四门绿；tag 待 commit；HG-PUBLISH pending |
| 2026-09-10 | **CLOSE** · 00 复跑四门 `FOUR_GATES_EXIT=0` · 归档 · 待人 commit/tag/publish |
| 2026-09-10 | **HG-PUBLISH=approved** · registry `2.1.1` · 根 README 完整 UX 回填 |
