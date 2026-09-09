# Task：1x-mvp W4 · SPEC 钉版闸（F5 · 方案 B）

> **状态**：`done`  
> **关联 SPEC**：`docs/spec/1x-mvp/F5_spec_version_pin.md`  
> **人闸**：`HG-F5-PIN-MODE=B`（2026-09-09 维护者「选择 B」）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `1x-mvp-w4-spec-version-pin` |
| **test_strategy** | `required` |
| **freeze_id** | 现行钉点 = ontology + discipline + README；SPEC.md archived 非钉点 |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `feat/hat-identity-system-reanchor` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **entry_invoke_30** | `docs/harness/invokes/by-task/1x-mvp-w4-spec-version-pin/invoke_20260909_30_40_1x-mvp-w4-spec-version-pin.md` |
| **maintainer_release_hold** | `false` — **1.11.0** 已 npm 发版（2026-09-09） |

### 00 授权

| 权限 | |
|------|--|
| W4 过程档 · HG-AUDIT-R1 · 30→40→CLOSE | ✅（用户「选择 B，然后继续统筹」） |
| bump（后续） | ✅ Agent 默认可（RELEASING） |
| publish | 人已完成 1.11.0；后续发版仍仅人 |

### 人工闸

| human_gate_id | status |
|---------------|--------|
| HG-SPEC-SIGNOFF | approved |
| HG-F5-PIN-MODE | **approved = B** |
| HG-TASK-DRAFT | approved（00 代签） |
| HG-AUDIT-R1 | approved |
| HG-PUBLISH | **approved（1.11.0）** |

---

## 范围

- [x] 拍板写入系列 README / F5 SPEC  
- [x] `SPEC.md` ARCHIVED banner  
- [x] `test/version-pins-f5.test.ts`  
- [x] RELEASING ④ 对齐 B  
- [x] CHANGELOG / 关账  

## 非范围

新建现行散文 SPEC（A）；深化 ontology 本体实践；旧包 deprecate

## 验收

- [x] 现行钉点偏差 0（测绿）  
- [x] SPEC 史实 @1.2.0 可与包版本并存  
- [x] **1.11.0** 已 bump + 人 publish（`npm view latest=1.11.0`）  

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-09 | 00 代签 · CLOSE → done/ |
| 2026-09-09 | 发版后回填：`HG-PUBLISH` approved · hold 放开 |
