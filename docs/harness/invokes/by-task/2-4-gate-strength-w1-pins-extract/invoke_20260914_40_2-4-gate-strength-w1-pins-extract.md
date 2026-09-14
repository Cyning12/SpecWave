# invoke · 40 · 2-4-gate-strength-w1-pins-extract（自检）

> **hat**：40-self-check · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w1_pins_extract.md`
> **自检结论全文**：task 文件「自检结论（执行者）」节（验证命令与退出码表 · 验收 ①–⑧ 逐条 · 已知未测项 · Task_KPI）

## 动作

1. 逐条核对验收 ①–⑧：三负向 fixture 修复前真红（actual=0/expected=2 三条断言失败留证 · §3.H/§3.I/§3.J 复现）→ 修复后转绿（exit 2 点名文件:行号/host/侧）· 对照组全符合。
2. 真仓回归：`node bin/specgate.js pins check` → PINS: PASS 17/17（零误伤）；pin-08 真仓对照实验（状态格 2.3.1→9.9.9 → exit 2 · 兜底嫌疑行 L20 · 恢复后 PASS · 还原确认）。
3. 四门：`npm run typecheck` 0 错 · `npm test` 543 pass + 1 门控 skip（SPEC_WAVE_E2E_NETWORK）· `npm run build` 通过 · `npm run test:lib` 6/6。
4. `node bin/specgate.js assets verify` PASS 110/110（release-pins.yaml 变更经 `assets manifest rebuild --yes` 重登记 · dry-run 先行）。
5. TEST-LOCK：三 extract kind 消费面 grep 留证（仅 test/pins-consistency.test.ts）· 联改齐全无半改。

## 未做（禁区）

未 `git add -A` · 未 tag/push/publish · 未动 RELEASING.md / pin-10 / 引擎架构 / S2 目录 · 未加 `--force`/`--allow-*` 绕过参数。

## 已知未测项

pin-16 大小写口径（N10 假阳）归 W6（P3 · 本波非范围）；refstyle 尖括号折叠写法已由 N7 fixture 覆盖。
