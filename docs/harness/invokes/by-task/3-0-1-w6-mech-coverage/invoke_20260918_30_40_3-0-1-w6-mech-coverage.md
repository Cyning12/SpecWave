# invoke · 30-execute + 40-self-check · 3-0-1-w6-mech-coverage

> **hat_id**：`30` + `40`（同棒）· **日期**：2026-09-18  
> **task_slug**：`3-0-1-w6-mech-coverage`  
> **性质**：W6 机检覆盖面与校验一致性（P3-2 / P3-7 · 未发版 · 未 commit）

## GATE_VERIFY（首输出）

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_1_w6_mech_coverage.md
| gate | status | blocks_30 | 30 影响 |
|------|--------|-----------|--------|
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
| HG-W6-REVIEW | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_1_w6_mech_coverage.md
```

三闸 approved → **可开工**。契约真值：PLAN W6 · R1 PASS · 扫描面评审（全量扫 + `:134` 改措辞 · claims 本波不纳入）· 00 代签。

## 改动摘要

| # | 文件 | 变更 |
|---|------|------|
| ① | `assets/harness/terminology.yaml` | targets 追加 `CHANGELOG.md`（闭集 6→7） |
| ② | `scripts/check-terminology.mjs` | 头注释同步「七目标」 |
| ③ | `CHANGELOG.md` | `:134`「门控手动测试」→「门禁手动测试」；Unreleased 登记 W6 |
| ④ | `assets/harness/claims-boundary.yaml` | 近旁注释：W6 评估 CHANGELOG 不入 claims（A5） |
| ⑤ | `src/host/cmd.ts` | validate：非映射 + config-hook → WARN（stderr / json#warnings）· exit 0 |
| ⑥ | 使用手册 B5 · `MIGRATION.md` | PASS+WARN · 映射键 = claude/cursor/gemini |
| ⑦ | `test/w6-mech-coverage.test.ts` | A1–A9 机检锁 |
| ⑧ | `assets/sha256.manifest` | terminology / claims-boundary 哈希追认 |

**未触**：apply fail-closed · `CONFIG_HOOK_HOSTS` 扩表 · claims 语义匹配 · schema · bump 3.0.1 · tag/push/publish。

## 自证（A1–A11）

| # | 结果 | 证据 |
|---|------|------|
| A1 | PASS | terminology targets 含 CHANGELOG · 仓基线 rc=0 |
| A2 | PASS | 注入「门控」exit 2 点名 CHANGELOG.md |
| A3 | PASS | 后门控制 / 门控 skip 不误报 |
| A4 | PASS | 原六目标仍在 targets |
| A5 | PASS | claims 显式不纳入（评审文 S-CLAIMS + yaml 注释） |
| A6 | PASS | acme-hook validate PASS + WARN · json#warnings |
| A7 | PASS | apply rc=2；none 对照绿；映射宿主无本 WARN |
| A8 | PASS | 手册 B5 + MIGRATION 明写 |
| A9 | PASS | 未扩表 / 未松 apply / 未改 claims 语义 / 未触 schema / 未 bump |
| A10 | PASS | typecheck · test · build · test:lib |
| A11 | PASS | gate-check → task close（本棒）· 未 commit |

## 禁区自检

未 `npm publish` / tag / push / deprecate · 未 `git commit` · 未 bump · 未触 schema · 未扩 `CONFIG_HOOK_HOSTS` · S2 过程档**显式 add**（doc-links 入库 · 禁 `git add -A`）。

## 下一棒

维护者：逐文件确认 stage → `fix(3.0.1-W6): mech coverage · P3-2/P3-7` → release 裁量。

## 关账

`gate-check` exit 0 · `task close --yes` → **CLOSE: PASS** · 归档 `docs/tasks/done/task_3_0_1_w6_mech_coverage.md`。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 30 开工：GATE_VERIFY PASS · 落盘本 invoke · 红测先行 |
| 2026-09-18 | 30/40 收口：实现 + A1–A11 + 四门 + close PASS · 未发版 · 未 commit |
