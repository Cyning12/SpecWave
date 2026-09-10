# Invoke · 30/40 · 2x-host-adapt-w2-cursor-claude

> **hat**：30-execute → 40-self-check  
> **task**：`docs/tasks/done/task_2x_host_adapt_w2_cursor_claude.md`  
> **日期**：2026-09-10  
> **状态**：`closed`  
> **HG-AUDIT-R1**：approved（00 代签 · `docs/harness/reviews/task_2x_host_adapt_w2_cursor_claude_audit_R1_20260910.md`）

---

## 30 执行要点

见 audit freeze：`host apply --tools cursor,claude --profile core`；默认 dry-run；`--yes` 写 always_on + commands(core)；S2 拒；local 不覆写；覆写先备份。

禁止：skills 物化（W3）· bump · publish · `opsx-*` · 默认分发 30/40 hats。

## 30 结果

- **结论**：PASS · 待 40（**未 CLOSE task**）
- **CLI**：`host apply --tools cursor,claude --profile core` 默认 dry-run（exit 0）；`--yes` 写 always_on + core 五命令（exit 0）；S2/校验失败 exit 2 零写入；缺 `--tools` / `--yes`+`--dry-run` / `host update` → exit 1
- **测**：`node --test --experimental-strip-types test/host-adapt-apply.test.ts` 7 pass；`test/host-adapt-validate.test.ts` 8 pass；`npm run typecheck` pass
- **文件**：`src/cli-host.ts` · `src/cli.ts` · `assets/ide/commands/{cursor,claude}/kit-*.md`（五条）· `test/host-adapt-apply.test.ts` · README 双文件 + CHANGELOG Unreleased
- **未做**：skills 物化 · `host update` · bump / publish · 物化 execute hats · 删 `.cyning-harness`
- **阻塞**：无

## 40 自检（对照 `04` §W2）

- [x] dry-run 报告完整（计划写入路径）  
- [x] `--yes` 写入 always_on + core commands；不碰 S2  
- [x] `.cursor/commands/kit-verify.md`（或等价）存在  
- [x] local 块不被覆写  
- [x] 相关单测绿；typecheck 不红  
- [x] 无 bump/publish；CHANGELOG 一句  
- [x] task → done；`04` §W2 勾选

## 40 结果

| 项 | 判定 | 证据 |
|----|------|------|
| dry-run 报告 | **pass** | 单测：零写入 + planned 含 `.cursor/commands/kit-verify.md` / `CLAUDE.md` / `.cursor/rules/` |
| `--yes` always_on + core | **pass** | tmp 写入 `.cursor` + `.claude` 五命令 + `CLAUDE.md` + `05-kit-starter.mdc` |
| 不碰 S2 | **pass** | `target_dir: docs/tasks` → exit 2 · 零写入 |
| kit-verify 文件 | **pass** | 资产 `assets/ide/commands/{cursor,claude}/kit-verify.md`；apply 后目标仓存在；明示 exit 0/1/2 |
| local 不覆写 | **pass** | CLAUDE.md `cyning-harness-local` 正文 `LOCAL_KEEP_ME` 仍在 |
| 单测 + typecheck | **pass** | `host-adapt-apply` 7/7 · `tsc --noEmit` exit 0 |
| 无 bump / publish | **pass** | 包版仍 `1.12.1`；CHANGELOG Unreleased 一句 `host apply`；无 `opsx-*` |
| 关账勾选 | **pass** | task → done；invoke closed；`04` §W2 全勾；PLAN/README W2 DONE |

### 40 复跑命令（2026-09-10）

```text
node --test --experimental-strip-types test/host-adapt-apply.test.ts
→ 7 pass · exit 0

npm run typecheck
→ exit 0 · dsh-coding-kit@1.12.1
```

**结论**：W2 验收全绿；**无阻断缺陷**；未改 `src/`；**W2 CLOSE**。STOP：未 commit / publish / bump / 开 W3 src。

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 00 开棒 · 待 30 |
| 2026-09-10 | 30 PASS · 待 40（未 CLOSE） |
| 2026-09-10 | **40 CLOSE** · 自检全 pass · invoke → closed · task 迁 done |
