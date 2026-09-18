# invoke · 30-execute + 40-self-check · 3-0-1-w4-docs-precision

> **hat_id**：`30` + `40`（同棒）· **日期**：2026-09-18  
> **task_slug**：`3-0-1-w4-docs-precision`  
> **性质**：W4 口径回填与文档精确化（P2-1 / P2-3 / P3-3 / P3-5 / P3-6 · 未发版 · 未 commit）

## GATE_VERIFY（首输出）

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_1_w4_docs_precision.md
| gate | status | blocks_30 | 30 影响 |
|------|--------|-----------|--------|
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_1_w4_docs_precision.md
```

双闸 approved → **可开工**。契约真值：PLAN W4 · R1 PASS · 00 代签派棒。

## 改动摘要（五项）

| # | 文件 | 变更 |
|---|------|------|
| ① | `MIGRATION.md` §① | 「行为不变」→「默认落点不变；内置表升级 v2 并新增 hooks 物化（additive）」 |
| ② | `CHANGELOG.md` Tests | 841→864（863 pass + 1 skip）+ TTY hotfix `0e1f165` +5；tag-gated 改过去式 |
| ③ | `package.json` `files` | 补列 `README.zh-CN.md`（pack 路径清单不变 · total files=275） |
| ④ | `delivery/research_report.md` | 作者 `90+` → `90–110+` + as_of 2026-09（SR-17「90+ CLI」豁免） |
| ⑤ | `scripts/check-doc-links.mjs` | 注释：`.workbuddy/` 除 9 件 tracked 外忽略 · 点名 `git ls-files` |

**未触**：W6-① / terminology 扫描面 · schema · src 行为 · `.workbuddy/` 迁文件 · `.gitignore` · bump 3.0.1 · tag/push/publish。

## 自证（A1–A10）

| # | 结果 | 证据 |
|---|------|------|
| A1 | PASS | MIGRATION:133「默认落点不变」+「新增 hooks 物化（additive）」 |
| A2 | PASS | CHANGELOG:29「841 → 864」+ `0e1f165` +5 · tag-gated 过去式 · `859` 现行基线 0 命中 |
| A3 | PASS | `files` 含 README.zh-CN.md · pack 路径清单 diff 空 · total files=275 |
| A4 | PASS | `:170`/`:395` → `90–110+` · SR-17「90+ CLI」豁免 |
| A5 | PASS | 注释「除 9 件 tracked」+ `git ls-files` · tracked=9 · 未迁/未改 gitignore |
| A6 | PASS | `check-doc-links` rc=0 · S2=34（过程档显式 add 后） |
| A7 | PASS | `npm test` 887 pass + 1 skip |
| A8 | PASS | 未开 W6-①/W5 · 未触 schema · 未 bump |
| A9 | PASS | typecheck / test / build / test:lib(6) |
| A10 | PASS | gate-check exit 0 · task close（本棒） |

## 禁区自检

未 `npm publish` / tag / push / deprecate · 未 `git commit` · 未 bump 3.0.1 · 未触 schema · 未开 W6-① · 未 `git add -A`（W4 过程档显式 add 以满足 doc-links 入库判据）。

## 下一棒

维护者：逐文件确认 stage → `fix(3.0.1-W4): docs precision · P2-1/P2-3/P3-3/P3-5/P3-6` → 开 W5/W6 或 release 裁量。

## 关账

`gate-check` exit 0 · `task close --yes` → **CLOSE: PASS** · 归档 `docs/tasks/done/task_3_0_1_w4_docs_precision.md`。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 30 开工：GATE_VERIFY PASS · 落盘本 invoke · 开始五项改动 |
| 2026-09-18 | 30/40 收口：五项落地 + A1–A10 + 四门 + close PASS · 未发版 · 未 commit |
