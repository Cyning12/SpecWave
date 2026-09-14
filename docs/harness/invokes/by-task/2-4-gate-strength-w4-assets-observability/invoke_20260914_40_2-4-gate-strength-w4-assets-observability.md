# invoke · 40 · 2-4-gate-strength-w4-assets-observability（自检）

> **hat**：40-self-check · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w4_assets_observability.md`
> **自检结论全文**：task 文件「自检结论（执行者）」节（验证命令与退出码表 · 验收 ①–⑧ 逐条 · 已知未测项 · Task_KPI）

## 动作

1. 逐条核对验收 ①–⑧：GATE_VERIFY PASS → N2 先红后绿（stash 旧码复现静默 PASS → 新码 WARN 点名 + `--json#excluded` + 删除消失）→ N5 快照断言两路（dry-run / `--yes` 整句锁文案 · 「追认」「provenance（未启用）」关键词）→ 三负向回退（mismatch/missing/extra 既有用例全绿仍 exit 2 + 新增「warning 不掩负向」钉死）→ CI 语义不变（exit code 未动 · workflows 未触 · 无 `continue-on-error`/`|| true`）→ TEST-LOCK 影响面 3 处核对零联改 → 提交边界逐路径 git add。
2. 四门：`npm run typecheck` 0 错 · `npm test` 575 tests · 574 pass · 0 fail · 1 skipped（既有门控 skip）· `npm run build` 通过 · `npm run test:lib` 6/6。
3. `node bin/specgate.js pins check` → PINS: PASS 17/17；`assets verify` → PASS 110/110 无 WARN（仓内无排除项 · 本棒无 assets/ 变更 · 无需 manifest rebuild）。
4. 波末 `verify --task` PASS + `gate-check --task` 未发现阻塞 → `task close --yes` 归档闭环。

## 未做（禁区）

未 `git add -A` · 未 tag/push/publish · 未 bump 版本号（属发版波）· 未动 exit code 语义 / `--json` 既有键集 / CI 接线 · 未加 rebuild 二次确认旗标（默认警示口径）· 未收窄对外口径（归 W5）。

## 已知未测项

无。F-W4-01 截断、F-W4-02 前缀/字段区分、F-W4-03 文案快照、F-W4-04 CI 判读均有对应用例；rebuild 无 `--json` 面（既有 CLI 形态 · SPEC §3②「人类输出与 --json 面同口径」在 rebuild 面无 json 出口可挂，警示常量单一来源保两路一致）。
