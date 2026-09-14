# invoke · 40 · 2-4-gate-strength-w6-p3-cleanup（自检）

> **hat**：40-self-check · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w6_p3_cleanup.md`
> **自检结论全文**：task 文件「自检结论（执行者）」节（验收 ①–⑦ 逐条 · 命令与退出码表 · 红→绿留证 · Task_KPI）

## 动作

1. 逐条核对验收 ①–⑦：GATE_VERIFY PASS → N10 修复前假红复现（mktemp fixture exit 2）→ 修复后同 fixture exit 0 + 负向对照 exit 2（F-W6-01 不误放）→ N14 stash 旧码复现豁免不命中 FAIL → 新码 PASS + 留痕 → 生产 done 70 份 meta==文件名 零 diff 盘点 → N4 留痕落盘可查 + exit 1 用例组零变更回归。
2. 四门：`npm run typecheck` 0 错 · `npm test` 582 tests · 581 pass · 0 fail · 1 skipped（tag-gated 设计跳过 · 与基线同例）· `npm run build` 通过 · `npm run test:lib` 6/6。
3. `node bin/specgate.js pins check` → PINS: PASS 17/17（pin-16 扫描 96 markdown 0 失配）；`assets manifest rebuild --yes`（~2 变更）→ `assets verify` PASS 110/110；真实仓 `task lint-done` PASS。
4. 波末 `verify --task` PASS + `gate-check --task` 通过 → `task close --yes` 归档闭环（见关账记录）。

## 未做（禁区）

未 `git add -A`（逐路径精确 add）· 未 tag/push/publish/bump · 未改 N4 行为（D-24-N4-REGISTER）· 未扩大为通用大小写策略框架（SPEC 06 §4 非范围）。

## 已知未测项

F-W6-02（Linux 同名两变体并存）无机测 fixture —— macOS FS 不支持同名两变体，口径「存在性确认命中其一即放行」由仓根条目快照实现天然覆盖；N10 负向双平台等价性由快照大小写不敏感保证（非 existsSync 平台语义）。
