# invoke · 40 · 2-4-gate-strength-w2-conclusion-gate（自检）

> **hat**：40-self-check · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w2_conclusion_gate.md`
> **自检结论全文**：task 文件「自检结论（执行者）」节（验证命令与退出码表 · 验收 ①–⑧ 逐条 · 已知未测项 · Task_KPI）

## 动作

1. 逐条核对验收 ①–⑧：评审文硬前置（落盘 + R1）→ 修复前真红（exit 0 复现残余缺口）→ 修复后六形态（A2 收窄 / 双变体 / 19-20 边界 / 合规正向 / 守卫回归 / done 降级锁）exit 码全符合。
2. 存量全量复测：66 份 done task · 新判据波及 0（零波及登记 · 无新增豁免）· 裸 verify PASS 留痕数与 2.3.1 登记一致。
3. 四门：`npm run typecheck` 0 错 · `npm test` 550 tests · 549 pass · 0 fail · 1 skipped（既有门控 skip）· `npm run build` 通过 · `npm run test:lib` 6/6。
4. `node bin/specgate.js pins check` → PINS: PASS 17/17；`assets manifest rebuild --yes` + `assets verify` → PASS 110/110（~1 变更 = discipline-coverage.yaml note 回写）。
5. TEST-LOCK：grep `零内容阻塞（fixture` 留证 · 15 文件 24 处联改齐全无半改（含 cli-verify-review R2 变体 substance=19 边界档）。

## 未做（禁区）

未 `git add -A` · 未 tag/push/publish · 未 bump 版本号（属发版波）· 未动 exit code 语义 / 豁免机制 / S2 目录 · 未加 `--allow-*` 绕过参数。

## 已知未测项

无。评审文 §5 五条 fixture 全覆盖 + done 降级不回退锁；存量复测脚本为一次性 /tmp 制品未入仓（与评审文 `/tmp/w2_sim` 先例一致）。
