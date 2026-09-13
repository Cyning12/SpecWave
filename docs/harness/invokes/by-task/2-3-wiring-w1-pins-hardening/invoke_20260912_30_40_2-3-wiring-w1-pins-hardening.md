# invoke · 30+40 · 2.3 W1 pins 机制补强实现与自证（GATE_VERIFY PASS 后开工 · 验收 ①–⑩ 全过）

> **hat_id**：`30`+`40`（同 Agent 闭环）· **日期**：2026-09-12  
> **task_slug**：`2-3-wiring-w1-pins-hardening`  
> **开工闸**：`node bin/specgate.js verify --target . --task docs/tasks/active/task_2_3_wiring_w1_pins_hardening.md` → 闸扫描表 HG-TASK-DRAFT/HG-AUDIT-R1 均 approved · VERIFY: PASS exit 0

## 动作（实现）

1. **① pin-08 严化**（D-23-PIN08-STRICT）：`src/cli-pins.ts` spec-index-row 分支重写为双判（(A) 状态/描述列含版本串 + (B) slug 列含版本串或 `X_Y-` 前缀）· mismatch detail 附兜底嫌疑行号；`assets/release-pins.yaml` pin-08 semantics 数据声明同步严化。
2. **② 三面入钉**（D-23-PIN-3FACES · 纯数据）：pin-13 CHANGELOG `^## \[(\d+\.\d+\.\d+)\]` / pin-14 MIGRATION `spec-wave@X` regex-all / pin-15 AGENTS `npx spec-wave@X` regex-all · 均 fixable=true · yaml note 写清叙事行口径与产品块纪律。
3. **③ 失配 fixture 补全**：`test/pins-consistency.test.ts` 新增 W1-B1..B12（pin-04/06/07/10/11/12 失配逐一真失败 · pin-10 git init 隔离不真打 tag · pin-13/14/15 破坏-修复 · F-W1-02/F-W1-04 · pin-08 严化反例）；C组 TEST-LOCK 联改 12→15。
4. **④ slug 修复**（D-23-SPEC-SLUG）：`src/cli-checks.ts` extractSpecSlug basename ∈ {readme,index} → 父目录名；`src/cli.ts` verifySpecMode 目录路径干净用法错 exit 1（止血 EISDIR）；`test/cli-verify-spec.test.ts` 增目录型正/负向 7 测。
5. **⑤ unfixable 评估**：`eval_unfixable_overlap_20260912.md`（本目录）——结论**不修**（零触发 · failClosed 方向 · 代价不匹配 · 监控缓解已就位）。

## 自证（真实命令 · 完整证据见 task 自检结论）

- 验收①：docs/spec/README.md L18 改 9.9.9 + L19 desc 注入 spec-wave@2.2.1 → `pins check` exit 2 · 兜底嫌疑行 L19 · 改回 PASS。
- 验收③：CHANGELOG/MIGRATION/AGENTS 分别破坏 → 各报 `文件:行号` exit 2 → `pins fix --yes` 收敛 → check 15/15 PASS · AGENTS marker 块完整。
- 验收⑦：typecheck 0 错 · npm test 484/484（基线 464 + 新增 20）· pins check 15/15 exit 0。
- ⑨ gate-check PASS · task close --yes 闭环。

## 未做（禁区）

- 未加任何 --force/--allow-* 绕过；未动 host-adapt schema；未扩 W2–W7；未动 RELEASING.md 措辞；未 git tag/push/publish；提交逐路径精确 add（禁 git add -A）。
