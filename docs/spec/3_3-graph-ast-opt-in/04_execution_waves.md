# 04 · 执行波次

> **状态**：`signed` · 隶属 `3_3-graph-ast-opt-in`  
> 每波独立 task · 独立提交（`feat(3.3-W<n>): …`）· 禁 `git add -A` · 波末 `gate-check`

---

## W0 · 签收（文档波 · 零实现码）

- [x] 20-spec-audit：**豁免**（2026-10-11 维护者直签双闸 · 原文「授权00签收后续所有文档」；过程记 [`invoke_20261011_00_epic_signoff.md`](../../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_epic_signoff.md)）  
- [x] **HG-SPEC-SIGNOFF=approved**（2026-10-11 维护者）  
- [x] **HG-NEXT-PLAN=approved**（同窗）  
- [x] 00 拆 **W1** task；W2–W4 按波拆  
- [x] 过程授权：本 epic 各波 **00 可签** `HG-TASK-DRAFT` / `HG-AUDIT-R1`（须 lint PASS + 20-task-audit R1 PASS）；**不**代签 `HG-RELEASE-*` / publish  

## W1 · 契约 / CLI 面（无深 AST 或仅 stub）

- [x] CLI 注册：`graph ast check [--target] [--input] [--json]`（help 可见）  
- [x] peer / 非 TS / 无 IB 行为契约测锁（**钉死 skip=0** + `skipped_reason=no_ts_peer` · 禁 usage=1）  
- [x] `--json` 信封字段草稿（issues / skipped_reason / inform）  
- [x] **不**改 verify 默认链；**不**改 drift/ib/indexes 缺省  
- [x] 若本波仅 stub：须 exit 行为符合「未实现深检时不假绿假装已检」（显式 `skipped_reason=ast_not_implemented` · 发版前 W2 须实装）  
- [x] 四门绿 · HG-AUDIT-R1 · gate-check；禁 bump/tag/push/publish  

## W2 · AST 实现 + 测（symbol + 有界 call）

- [x] symbol 核对：正（符号存在 → 0）· 负（缺失 → 2 · `missing_ib_symbol`）  
- [x] 有界 call：同 path 缺失引用 → 2；跨 path → 不红（inform 可选）  
- [x] 无 IB → 0；无 peer → 与 W1 契约一致  
- [x] 抽最小语义；禁整包 cp；禁七域硬编码  
- [x] 回归：既有 drift / ib / indexes / yaml / scaffold 测试全绿  
- [x] 四门绿 · HG-AUDIT-R1 · gate-check  

## W3 · 文档分责

- [x] 手册保真分责表扩至含 `graph ast check`  
- [x] 专节：有界 call ≠ callgraph；opt-in；不进默认 verify  
- [x] MIGRATION / 消费仓指引：与本地 `graph:ast-check` 分工（SW 不替代业务方言全量）  
- [x] 可选：CI 样例**注释**步骤；无强制硬门  
- [x] 对外无违纪夸大表述 · gate-check  

## W4 · bump / ACCEPTANCE（release 簿记）

- [ ] CHANGELOG / ACCEPTANCE / `docs/spec/README.md` 本行状态  
- [ ] bump `3.3.0` · pins 对齐  
- [ ] **tag/push/publish 按当次授权**（publish 默认仅人）  

## 编排理由

1. **W0**：双闸未批前零实现，避免未签收改码。  
2. **W1 先钉面**：peer/skip/usage/verify 边界是产品风险最高处，须先契约测锁再填实现。  
3. **W2 实装**：symbol → 有界 call 同波交付最小可签切片（拆两 task 亦可，但语义同属 P4）。  
4. **W3 文档靠后**：避免未交付命令写进主路径；发版前收敛文案纪律。  
5. **W4 收口**：minor bump；与 3.2 W5 对称。  

**明确延后（本 epic 外）**：indexes schema v2 · 完整 callgraph · issue-sync · 业务 completeness · 多语言 AST · meta defer 七域政策引擎。

## 验收总表（epic 级）

- [ ] fixture：假 symbol → ast check exit 2；真 symbol → exit 0  
- [ ] fixture：同 path 有界 call 缺失 → exit 2；跨 path → 不红  
- [ ] 无 peer / 无 IB → 零强迫、行为与契约一致  
- [ ] `verify` 默认链无 AST 步  
- [ ] 既有 drift / ib / indexes / yaml / scaffold 零回归  
- [ ] 对外无「完整 callgraph / 默认 verify 已含 AST」违纪表述  

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | draft · 10-spec · W0–W4（相对 3.2 的 W0–W5，本版无独立 struct_rel/indexes 波） |
