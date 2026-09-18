# 审查文 · 3.0.1 W6 mech-coverage task R1

> **hat**：20-task-audit（书面审查 · R1 · 独立上下文 · 非起草者）  
> **日期**：2026-09-18  
> **被审对象**：[`docs/tasks/done/task_3_0_1_w6_mech_coverage.md`](../../tasks/done/task_3_0_1_w6_mech_coverage.md)（slug `3-0-1-w6-mech-coverage` · `draft` · 无独立 SPEC · HG-SPEC-SIGNOFF=N/A）  
> **对照基准**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（HG-NEXT-PLAN=approved · **W6 节** + 硬约束 **3/5/9** · 风险 **4**）· [`acceptance_3_0_0_specwave_20260918.md`](./acceptance_3_0_0_specwave_20260918.md) **§6.3 P3-2 / P3-7**（`:440-443` / `:470-482`）· 10 invoke `docs/harness/invokes/by-task/3-0-1-w6-mech-coverage/invoke_20260918_10_3-0-1-w6-mech-coverage.md` · 先例形态 [`task_3_0_1_w5_pin_hook_version_audit_R1_20260918.md`](./task_3_0_1_w5_pin_hook_version_audit_R1_20260918.md) · 条件闸先例 [`w2_gate_parse_warning_contract_review_20260918.md`](./w2_gate_parse_warning_contract_review_20260918.md)  
> **姊妹裁定**：扫描面契约见 [`w6_changelog_scan_surface_review_20260918.md`](./w6_changelog_scan_surface_review_20260918.md)（**HG-W6-REVIEW 启用**）  
> **审查方式**：只读通读 task + PLAN W6/硬约束 3·5·9/风险 4 + 验收 §6.3；**独立再钉** terminology / CHANGELOG:134 / materialize config-hook / validate 挂点；`node bin/specgate.js task lint` → **LINT: PASS**；**未改被审 task 任何字节 · 未改 `src/`**。

---

## 结论摘要（内容闸 / 流程闸分列）

| 维度 | 结论 | 说明 |
|------|------|------|
| **内容闸**（范围 / 非范围 / 验收 / failure_paths / 思考轮 / 硬约束 3·5·9 / 风险 4） | **PASS · 零内容阻塞** | 严格贴 PLAN W6：CHANGELOG→terminology + claims **评估** · validate WARN · B5/MIGRATION；**不改** apply fail-closed · **不扩**映射 · **不做** P3-1 语义匹配 |
| **流程闸** | **pending（不由本帽签）** | `HG-TASK-DRAFT=pending` · `HG-AUDIT-R1=pending`（blocks 30）· **`HG-W6-REVIEW=pending`（本棒裁定：启用 · 见姊妹评审文）** · HG-NEXT-PLAN 已 approved · HG-SPEC-SIGNOFF=N/A 正确 |
| **总结论** | **PASS** | 可进 00 代签过程闸（须**同时**签 HG-W6-REVIEW）→ 再下发 30；**本审查文不附 30 Prompt** |

---

## 1. 逐项核对（对照 PLAN W6 + 硬约束 3/5/9 + 风险 4）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 = PLAN W6（P3-2 覆盖 + P3-7 WARN + 文档） | **PASS** | task §范围 ①–⑤ 与 PLAN W6·范围逐条对应；完成态同口径 |
| **P3-2** CHANGELOG 纳入 terminology +「门控」负向 | **PASS** | 范围① · A1–A4 · F-W6-01/08/09 · PLAN 验收要点 |
| **历史节口径 / 风险 4**（条件闸） | **PASS（交姊妹文裁定）** | 范围①末条 · F-W6-01 · HG-W6-REVIEW；活证 `:134` 本棒再钉成立 |
| **claims 同口径评估**（禁止静默跳过） | **PASS** | 范围② · A5 · F-W6-02；裁定结论见姊妹文（**本波不纳入** · 须显式留痕） |
| **禁止** claims 语义匹配（P3-1） | **PASS** | 非范围 · A9 · F-W6-06 |
| **P3-7** validate 非映射+config-hook → WARN · exit 0 | **PASS** | 范围③ · A6 · F-W6-03/07；硬约束 5 / W2 告警契约同源 |
| **不改** apply fail-closed | **PASS** | 非范围首行 · A7 · F-W6-04；挂点 `materialize.ts:508-511` |
| **不扩** `CONFIG_HOOK_HOSTS` | **PASS** | 非范围 · A9 · F-W6-05 STOP；真值键 claude/cursor/gemini |
| B5 / MIGRATION 明写边界 · 宿主列举对齐代码 | **PASS** | 范围④ · A8 · F-W6-14；手册现写 DSH 须改对齐 |
| 硬约束 **3**（patch 纪律 · 禁松紧/扩表/schema） | **PASS** | 背景段 · R3 · F-W6-03/04/05 |
| 硬约束 **5**（不要静默） | **PASS** | F-W6-02 · WARN 可见 · 禁静默缩面 |
| 硬约束 **9**（W6-① 在 W4 后） | **PASS** | W4 已 CLOSE · task 元信息声明 |
| 验收机械可判 | **PASS** | A1–A8 机检 · A9 非范围 · A10 四门 · A11 关账 |
| failure_paths | **PASS** | F-W6-00~14：双闸拒 · 历史红 · 静默 · WARN/exit · 越界 · 边界误报 · 发布 · stage · 四门 · 文档 |
| R0–R5 思考轮 | **PASS** | 控制表逐轮回填 · early_stop 全 no · residual_risks 五条真实 |
| 人工闸表形态 | **PASS** | **4 列** · id 无内嵌破坏解析的粗体 · HG-AUDIT-R1 / HG-W6-REVIEW pending blocks 30 |
| 与 §6.3 P3-2/P3-7 主源对齐 | **PASS** | 覆盖盲区 + validate/apply 两关不一致；未采纳扩映射 / 改 apply |
| `test_strategy=required` | **PASS** | 元信息 note + §测试策略 · 红测先行 |
| 行为变更类 · 旧测 grep 影响面 | **PASS（锁在 A4/A7）** | terminology 六目标零回归 + apply 不松；WARN 为 additive |
| task lint（流程核对 · 只读） | **PASS** | `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w6_mech_coverage.md` → `LINT: PASS`（W3 占位符 warn · draft 合法） |
| 未扩 release bump | **PASS** | 非范围 + F-W6-10/11 |

---

## 2. 行号现值独立再钉（与 task 声明对照）

> 本棒 2026-09-18 只读实读工作树；**关键挂点全部精确命中 · 无阻塞级漂移**。验收报告仍写 `materialize.ts:506` / 映射含 **dsh** —— **已漂移**；task 再钉正确，30 以 task + 本表为准。

| # | task / PLAN / 验收声明 | 本棒现值 | 结果 |
|---|------------------------|----------|------|
| 1 | `assets/harness/terminology.yaml:24-30` 六目标无 CHANGELOG | `:24-30` targets = README 双语 / GLOSSARY / RELEASING / MIGRATION / `delivery/promotion/**` · **无** `CHANGELOG.md` | ✅ |
| 2 | `exempt_patterns` 仅 `"门控 skip"` · 词边界 `后门控制` | `:32-37` 精确命中 | ✅ |
| 3 | `scripts/check-terminology.mjs:2-8` 注释「六目标闭集」· `:59-60` 扫 `v.targets` | 头注释 `:2-8` · 循环 `:59-60` `for (const target of v.targets \|\| [])` | ✅ |
| 4 | **`CHANGELOG.md:134`「门控手动测试」**（风险 4 活证） | `:134` 在 **`## [2.3.0]`** 历史节：`SPEC_WAVE_E2E_NETWORK=1` **门控手动测试** · **非** `门控 skip` 豁免 ⇒ 全文件纳入将 **真红** | ✅ |
| 5 | 历史「门控 skip」可豁免位 | `:49` / `:65` / `:99` 均含 `门控 skip`（exempt 可过） | ✅ |
| 6 | 现行节无「门控」 | `## [Unreleased]`（`:5-10`）与 `## [3.0.0]`（`:11-35`）**0** 命中 | ✅ |
| 7 | `assets/harness/claims-boundary.yaml:69-73` 无 CHANGELOG | `scan_targets` = promotion/** + README 双语 + GLOSSARY · **无** CHANGELOG | ✅ |
| 8 | `scripts/check-claims.mjs:54-59` 固定子串 | `:54-59` `indexOf(phrase)` 循环 · 非语义匹配 | ✅ |
| 9 | claims 若全文件纳入会红（评估用） | CHANGELOG `:94` 含 expired 词 **`四宿主`** / **`406 用例`**（历史快照叙述语境） | ✅ 佐证「本波不纳入」 |
| 10 | `src/host/hooks.ts:60-79` `CONFIG_HOOK_HOSTS` | `:60-79` 键 **`claude` / `cursor` / `gemini`**（**非**验收文旧写 dsh） | ✅ |
| 11 | `:104-106` `configHookSpecOf` | `:104-106` 精确命中 | ✅ |
| 12 | **`src/host/materialize.ts:508-511`** config-hook fail-closed | `:508-511`：`configHookSpecOf` 缺失 ⇒ `fail(…fail-closed…, 2)`（报告 `:506` 已漂移） | ✅ |
| 13 | `src/host/cmd.ts:256-288` validate 静默 PASS | schema 后 `:256-274` FAIL 分支 · `:276-288` 直接 PASS · **无**非映射+config-hook WARN 通道 | ✅ |
| 14 | 手册 B5 `:450/:454-458` 仍写 validate PASS · 列举含 DSH | `:454-458` 表仍写 Cursor/Claude/**DSH** · validate **PASS** 静默口径 | ✅（待 30 改文案） |
| 15 | `MIGRATION.md:141` 一带 hooks 声明 | `:141` 一带仍为声明说明 · **未**明写非映射 validate WARN / apply fail-closed | ✅（待 30） |
| 16 | acceptance §6.3 P3-2/P3-7 | `:440-443` / `:470-482` 与 task 主源一致 | ✅ |

**提示级（非阻塞）**：验收 P3-7 根因句仍写映射「cursor / claude / **dsh**」——产品真值为 **gemini** 第三键；本波只改文案对齐，**不**把 dsh 加回映射表。

---

## 3. 开放问题 / 裁定指针

| # | 议题 | 裁定 |
|---|------|------|
| A | CHANGELOG 扫描面（全量 / 仅现行 / 历史加白） | **见姊妹文** · **全量扫** + **改 `:134` 措辞** · 禁默缩为仅现行节 |
| B | `check-claims` 是否同口径纳入 CHANGELOG | **见姊妹文** · **本波不纳入** · 须在 30 自检/关账显式写理由（A5） |
| C | HG-W6-REVIEW 启用或 N/A | **启用**（扫描面契约变更 · 同源 W2）· **禁止**改 N/A |
| D | validate WARN 通道 | **沿用 W2 C1**：stderr + `--json#warnings` 只增不改 · exit/verdict 不变 |
| E | wiki 是否晋升 | **本波不晋升**（`wiki_delta=none`） |

---

## 4. WARN / 映射文案 / 非范围锁面

| 检查 | 结论 |
|------|------|
| A6 WARN · rc=0 · 不升 FAIL | **PASS 条款** · F-W6-03 |
| A7 apply 仍 rc=2 · none 对照绿 | **PASS 条款** · 禁改 `materialize.ts:508-511` |
| A8 宿主列举 = claude/cursor/gemini | **PASS 条款** · 禁扩表 |
| A9 非范围钉死 | **PASS** · schema / P3-1 / release bump |
| JSON `warnings` 只增不改 | **PASS 条款** · F-W6-07 · 硬约束 5 |

**提示级（给 30 · 非阻塞）**：JSON 早退路径（`cmd.ts:276-284`）须与人类路径**同时**挂 WARN；实现前 `rg` 既有 host validate 测，确认 PASS 字面与 exit 不回退。

---

## 5. 发现的问题

- **FAIL / 内容阻塞：无（blocking = 0）**  
- **advisory（提示级）**：  
  1. 扫描面与 claims 口径以姊妹评审文为准（§3 A/B）  
  2. 验收报告 dsh ↔ 代码 gemini 漂移 · 只改文档（§2）  
  3. validate JSON 早退须同步 WARN（§4）

---

## 结论

**R1 总结论：PASS · 零内容阻塞 · blocking=0 · 可进 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 + HG-W6-REVIEW → 30 开工。**

范围贴 PLAN W6；硬约束 3/5/9 边界清晰；风险 4 活证 `:134` 成立并由姊妹文钉死处置。行号关键挂点全部精确命中。流程闸仍 pending，**禁止**本审附 30 可复制 Prompt。

---

## 维护者签闸（20 后 · 30 前）

> 本 task HG-TASK-DRAFT / HG-AUDIT-R1 / HG-W6-REVIEW 由 **00 代签**（维护者 2026-09-18 授权过程文档闸 · task/PLAN 表在案）。HG-RELEASE / tag / push / publish **仍仅人**。

- [ ] 已读 R1 审查结论（含 §2 行号再钉 · §3 指针）
- [ ] 已读姊妹文 [`w6_changelog_scan_surface_review_20260918.md`](./w6_changelog_scan_surface_review_20260918.md)（扫描面 + claims 裁定）
- [ ] 在 task 人工闸表将 **HG-TASK-DRAFT** 改为 approved（00 代签 · 日期）
- [ ] 在 task 人工闸表将 **HG-AUDIT-R1** 改为 approved（00 代签 · 日期 · status 格勿内嵌破坏解析的粗体）
- [ ] 在 task 人工闸表将 **HG-W6-REVIEW** 改为 approved（00 代签 · 日期 · **本波启用 · 勿改 N/A**）
- [ ] commit 过程文档（禁 `git add -A` · 不裹挟 `src/` 未授权改动）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；`HG-AUDIT-R1` 或 `HG-W6-REVIEW` 仍为 pending 时必须拒开工（见 `TEMPLATE_30_gate_stop.md`）。

---

**签名**：20 审查棒（20-task-audit · R1）· 2026-09-18 · 独立上下文非起草者 · 仅书面审查 · **未改被审 task / 未改实现码 · 未附 30 Prompt**。
