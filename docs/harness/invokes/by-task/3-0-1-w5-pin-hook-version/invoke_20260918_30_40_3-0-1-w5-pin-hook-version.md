# invoke · 30-execute + 40-self-check · 3-0-1-w5-pin-hook-version

> **hat_id**：`30` + `40`（同棒）· **日期**：2026-09-18  
> **task_slug**：`3-0-1-w5-pin-hook-version`  
> **性质**：W5 可选 `--pin-hook-version`（P2-2 · 实验性 · 缺省关闭 · 未发版 · 未 commit）

## GATE_VERIFY（首输出）

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_1_w5_pin_hook_version.md
| gate | status | blocks_30 | 30 影响 |
|------|--------|-----------|--------|
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_1_w5_pin_hook_version.md
```

双闸 approved → **可开工**。契约真值：PLAN W5 · R1 PASS · 00 代签 · §6.2 P2-2 · 命令串真值 `src/host/hooks.ts`。

## 改动摘要

| # | 文件 | 变更 |
|---|------|------|
| ① | `src/host/hooks.ts` | `hookGuardCommand(pin?)` · marker/contain/shell 双形态 · `shellHookMatchesProduct` |
| ② | `src/host/materialize.ts` | `planApply.hookPinVersion` 透传 |
| ③ | `src/host/cmd.ts` | apply/update 同挂 `--pin-hook-version[=SEMVER]` · 新解析（禁 takeOptionalFlag）· 帮助「实验性 · 缺省关闭」 |
| ④ | `src/host/verify.ts` | shell-hook 认钉版形态 |
| ⑤ | `CHANGELOG.md` / `RELEASING.md` / 使用手册 §7.3 | 实验性登记 + CI 三选一建议 |
| ⑥ | `test/w5-pin-hook-version.test.ts` | A1–A5/A6 机检锁 |

**缺省 semver 读源**：`kitPackageSemver()` ← `package.json#version`（与粘性 `kit_semver` 同源）。  
**未触**：默认物化字节 · hook-guard 分发 · 锁文件 · schema · W6 · bump 3.0.1 · tag/push/publish。

## 自证（A1–A9）

| # | 结果 | 证据 |
|---|------|------|
| A1 | PASS | 无旗标字面 = `npx spec-wave hook-guard …`；CLI A/B strip `@ver` 后逐字节等 |
| A2 | PASS | 裸旗标 → kit_semver；`=9.9.9` 显式 |
| A3 | PASS | 带旗标 apply 后 verify rc=0 |
| A4 | PASS | 未改 hook-guard 分发 / fail-closed |
| A5 | PASS | help + CHANGELOG「实验性 · 缺省关闭」 |
| A6 | PASS | RELEASING 专节 + 手册 §7.3 三选一（保留 `--command`） |
| A7 | PASS | 无默认钉版 / 无锁文件 / 无 schema / 无 W6 / 无 bump |
| A8 | PASS | typecheck · test 895p+1s · build · test:lib 6 |
| A9 | PASS | gate-check → task close（本棒） |

## 禁区自检

未 `npm publish` / tag / push / deprecate · 未 `git commit` · 未 bump · 未触 schema · 未开 W6 · S2 过程档**显式 add**（doc-links 入库 · 禁 `git add -A`）。

## 下一棒

维护者：逐文件确认 stage → `fix(3.0.1-W5): pin-hook-version optional · P2-2` → 开 W6 或 release 裁量。

## 关账

`gate-check` exit 0 · `task close --yes` → **CLOSE: PASS** · 归档 `docs/tasks/done/task_3_0_1_w5_pin_hook_version.md`。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 30 开工：GATE_VERIFY PASS · 落盘本 invoke · 红测先行 |
| 2026-09-18 | 30/40 收口：实现 + A1–A9 + 四门 + close PASS · 未发版 · 未 commit |
