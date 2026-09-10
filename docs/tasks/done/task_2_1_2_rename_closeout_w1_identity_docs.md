# Task：2.1.2 W1 · CLI 身份 + MIGRATION/RELEASING

> **状态**：`done` · **wave**：W1  
> **关联 SPEC**：[`docs/spec/2_1_2-rename-closeout/`](../../spec/2_1_2-rename-closeout/) · `02` · `03`  
> **PLAN**：[`docs/roadmap/PLAN_2_1_2_rename_closeout_v1_zh.md`](../../roadmap/PLAN_2_1_2_rename_closeout_v1_zh.md)  
> **依赖**：W0 签收  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1_2-rename-closeout-w1-identity-docs` |
| **test_strategy** | `required` |
| **test_strategy_note** | 联改 cli-help / cli-validation 断言；help 首行 SpecWave CLI；status 包名 spec-wave |
| **freeze_id** | **不** bump version（仍 2.1.1 至 W4）；**不**改 assets 全文（W2）；**不**改 init（W3）；**不** publish |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-212 | **approved** | — | 2026-09-10 |
| HG-SPEC-SIGNOFF | **approved** | — | B-* 冻结 |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 |
| HG-AUDIT-R1 | **approved** | **30** | 00 代签 · R1=`docs/harness/reviews/task_2_1_2_rename_closeout_w1_identity_docs_audit_R1_20260910.md` |

---

## 目标

对外 CLI 自报名与迁移/发版文档与 **SpecWave / `spec-wave`** 一致；切断「钉废弃中间包」文案。

## 范围

- [x] `src/cli.ts` help 首行 → `SpecWave CLI (v${version})`  
- [x] doctor/status：当前包叙事 → `spec-wave ${pkgVersion}`（去掉与下行 `npx spec-wave` 矛盾）  
- [x] 联改 `test/cli-help.test.ts` · `test/cli-validation.test.ts`  
- [x] `MIGRATION.md`：终点 SpecWave；`spec-wave` 非过渡 bin；醒目声明 `dsh-coding-kit` deprecated；钉点 → 指向 `spec-wave`（版本可写 2.1.1 现行 / 注明升至 2.1.2）  
- [x] `RELEASING.md`：纠正状态倒挂（旧包已 deprecate · 新包已 publish · 现推进 2.1.2）  
- [x] CHANGELOG Unreleased 一句（2.1.2 Planned）  

## 非范围

assets/README DSH 入口（W2）· init `--yes`（W3）· bump/tag/publish（W4）· REPORT_SCHEMA · bin 文件名

## 验收标准

- [x] `npx`/node CLI `--help` 首行含 `SpecWave CLI`  
- [x] status/doctor 无「当前=dsh-coding-kit」与「建议 spec-wave」自相矛盾  
- [x] `npm test` 相关测绿（含联改断言）  
- [x] MIGRATION 含 deprecate 醒目句且不以废弃包为终点  
- [x] RELEASING 与 registry 真值不倒挂  

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W1-01 | 只改文案不改测断言 | test 红 · 拒 CLOSE |
| W1-02 | 误 bump 到 2.1.2 | 退回 · 留给 W4 |
| W1-03 | Agent publish | 禁 |
| W1-04 | HG-AUDIT-R1 pending 改码 | 拒开工 |

## 给执行帽必读

1. SPEC `00` · `02` · `03` · README B-CLI-IDENTITY / B-DEPRECATE-CHAIN  
2. 审查报告 §P0-2 · §P1-1 · §P1-2 · §7 第一批  
3. 本 task 闸表  

## 自检结论（执行者）

- **VERIFY**：`npx spec-wave verify` PASS · `HG-AUDIT-R1=approved`  
- **改动**：help=`SpecWave CLI`；`check` 跨产品线当前包=`spec-wave ${pkgVersion}`；测断言联改；MIGRATION 切断链式废弃；RELEASING 对齐「旧 deprecate / 新已 publish / 推进 2.1.2」；CHANGELOG Unreleased 加 Planned 句  
- **测**：`npm run typecheck` 绿；`cli-help` + `cli-validation` + `docs-releasing` **34/34 PASS**  
- **未做（非范围）**：version bump · assets/README DSH · init `--yes` · publish/deprecate · task 未移 `done/`（交 00）  
- **残留**：`@cyning/harness` registry deprecate 文案仍指 `dsh-coding-kit`（`HG-DEPRECATE-HARNESS` 仅人）

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1 代签可 30 |
| 2026-09-10 | **30 落地**：CLI 身份 + 测断言 + MIGRATION/RELEASING/CHANGELOG；相关测绿；待 40 / 00 CLOSE |
| 2026-09-10 | **CLOSE** · 00 归档 done · 交 W2 |
