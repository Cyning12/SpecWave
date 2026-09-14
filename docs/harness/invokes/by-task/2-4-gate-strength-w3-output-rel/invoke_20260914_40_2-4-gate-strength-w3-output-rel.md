# invoke · 40 · 2-4-gate-strength-w3-output-rel（自检）

> **hat**：40-self-check · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w3_output_rel.md`
> **自检结论全文**：task 文件「自检结论（执行者）」节（验证命令与退出码表 · 验收 ①–⑧ 逐条 · 已知未测项 · Task_KPI）

## 动作

1. 逐条核对验收 ①–⑧：GATE_VERIFY PASS → V2 四处修复前后对照（HEAD worktree vs 工作区 · 绝对入参 · 留证见 invoke 30 §2 表）→ 机械断言 21 测全绿 + 负向自证 4 例真红 → `status --json#task_path` 干净对照断言相对口径保持 + 键集 6 组钉死 → close 人类输出三处相对化 + `CLOSE: PASS` 冻结文案断言 → CHANGELOG [Unreleased] 2.4.0 接口说明 → TEST-LOCK 联改 2 处（done-snapshot 期望 + cli-shared 边界守卫使 cli-flags 免改）→ 提交边界逐路径 git add。
2. 四门：`npm run typecheck` 0 错 · `npm test` 571 tests · 570 pass · 0 fail · 1 skipped（既有）· `npm run build` 通过 · `npm run test:lib` 6/6。
3. `node bin/specgate.js pins check` → PINS: PASS 17/17；`assets verify` → PASS 110/110（本棒无 assets/ 变更 · 无需 manifest rebuild）。
4. 波末 `verify --task` PASS → `task close --yes` 归档闭环。

## 未做（禁区）

未 `git add -A` · 未 tag/push/publish · 未 bump 版本号（属发版波）· 未动 exit code 语义 / `--json` 键集 / 错误文案措辞 / 冻结文案 · 未动 S2 目录以外的 host 物化 target · 未加 `--allow-*` 绕过参数。

## 已知未测项

仓外 target（/tmp 靶场）toRel 语义沿用既有（F-W3-02 · 断言判据只认仓根绝对前缀）；`emitHostFail` base 取 `process.cwd()`（cwd≠target 时仓内绝对值兜底为原样 · 与既有 toRel 调用点口径一致）；断言命令面清单为人工枚举（SPEC 03 §9 residual_risk ① 既定 · 新命令接入时评审）。
