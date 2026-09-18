# invoke · 30-execute + 40-self-check · 3-0-1-release-bump

> **hat_id**：`30` + `40`（同棒）· **日期**：2026-09-18  
> **task_slug**：`3-0-1-release-bump`  
> **性质**：3.0.1 收尾 bump 簿记（未发版 · 未 commit · 未 tag/push/publish）

## GATE_VERIFY（首输出）

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_1_release_bump.md
| gate | status | blocks_30 | 30 影响 |
|------|--------|-----------|--------|
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_1_release_bump.md
```

HG-AUDIT-R1=approved → **可开工**。HG-RELEASE=pending · `blocks_hats=—` → **允许簿记** · **禁止** tag/push/publish/deprecate。

契约真值：task · R1 audit · 00 invoke · PLAN release · RELEASING.md · 2.4.2 bump 先例。手册策略：保留文件名 `使用手册-v3.0.0-zh.md`。

## 改动摘要

| # | 文件 | 变更 |
|---|------|------|
| ① | `package.json` / `package-lock.json` | version `3.0.0` → `3.0.1`（唯一手工点 · 未用 `npm version`） |
| ② | `CHANGELOG.md` | `## [3.0.1] - 2026-09-18` 汇总 W1–W6 · 发布状态「待发版」· Unreleased 空壳（**先于** pins fix） |
| ③ | pins fix | `node bin/specgate.js pins fix --yes` · pin-10 设计红留痕 |
| ④ | 叙事巡检 | RELEASING latest / README 双语现行包行改回「待发版」真值（registry latest 仍 `3.0.0`） |
| ⑤ | `docs/roadmap/ACCEPTANCE_3_0_1_patch_3_0_1_zh.md` | 台账 + 门禁基线 + pin-10 登记 |
| ⑥ | `docs/spec/README.md` | `` `3.0.1` 待发版（planned）`` 收尾行（pin-08） |
| ⑦ | `RELEASING.md` | 台账 + 人 checklist 3.0.1（全未勾选） |
| ⑧ | `MIGRATION.md` | 「3.0.0 → 3.0.1 无强制动作项」 |
| ⑨ | `docs/guides/使用手册-v3.0.0-zh.md` | 保留文件名 · 头栏/现行钉同步 3.0.1 |
| ⑩ | 测试断言 | perl 双模式 · 历史标题与红测留证注释保留 |

**未触**：产品行为 · schema · tag / push / publish / deprecate · git commit。

## 自证（A1–A10）

| # | 结果 | 证据 |
|---|------|------|
| A1 | PASS | `package.json#version`=`3.0.1` · 未用 `npm version` |
| A2 | PASS | `## [3.0.1] - 2026-09-18` · W1–W6 · 待发版 · Unreleased 空壳 |
| A3 | PASS | pins **16/17** · 唯一红 = pin-10 `v3.0.1` 缺失 |
| A4 | PASS | `docs/roadmap/ACCEPTANCE_3_0_1_patch_3_0_1_zh.md` |
| A5 | PASS | 手册保留文件名 · 头栏钉 `spec-wave@3.0.1`（待发版） |
| A6 | PASS | RELEASING 台账 + 人 checklist 3.0.1（全未勾选）· 全量 `npm test` 已跑 |
| A7 | PASS | MIGRATION「3.0.0 → 3.0.1 无强制动作项」 |
| A8 | PASS | typecheck 0 · test 906/903 pass/2 设计红/1 skip · build 0 · test:lib 6/6 |
| A9 | PASS | 未改产品行为 · 未触 schema · 未 tag/push/publish/deprecate |
| A10 | PASS | gate-check exit 0 · `task close --yes` → CLOSE: PASS |

设计红（非产品回归）：`pins-consistency` A 组 + `release-tag-identity`。打 `v3.0.1` 后须 17/17。

## 禁区自检

未 `npm publish` / tag / push / deprecate · 未 `git commit` · 未 `git add -A`。为 check-doc-links 入库判据，对 ACCEPTANCE / task / R1 审查 / Hub 行做了**逐文件** `git add`（关账后 active→done 链改指 `done/`）。

## 关账

`gate-check` exit 0 · `task close --yes` → **CLOSE: PASS** · 归档 `docs/tasks/done/task_3_0_1_release_bump.md`。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 30 开工：GATE_VERIFY PASS · 落盘本 invoke · 其后改簿记 |
| 2026-09-18 | 30/40 收口：簿记 + 四门 + close PASS · pin-10 设计红 · 未发版 · 未 commit |
