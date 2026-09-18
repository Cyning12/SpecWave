# Task：3.0.1 W6 · 机检覆盖面与校验一致性（P3-2 / P3-7）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · HG-W6-REVIEW=approved（**2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· 依据 R1 [`task_3_0_1_w6_mech_coverage_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_w6_mech_coverage_audit_R1_20260918.md) PASS · blocking 0 · 扫描面 [`w6_changelog_scan_surface_review_20260918.md`](../../harness/reviews/w6_changelog_scan_surface_review_20260918.md)）· 30/40 闭环完成 · 2026-09-18 · **未发版 / 未 commit**）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（**HG-NEXT-PLAN=approved** · 2026-09-18 维护者签收 · 授权 00 代签过程闸 · HG-RELEASE / tag / push / publish 仍仅人）· **W6 节** + 硬约束 **3**（patch 纪律门）/ **5**（「不要静默」总则）/ **9**（**W6-① 须在 W4 之后** · W4 已 CLOSE）  
> **范围主源**：[`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) **§6.3 P3-2 / P3-7**  
> **基线**：`spec-wave@3.0.0` published（npm `latest` = 3.0.0 · tag `v3.0.0`）· 前序波次 **W1–W5 均已 CLOSE: PASS**（硬约束 9 已满足）  
> **行号口径**：本 task 全部 `file:line` 为 **2026-09-18 10-task 起草棒实读现值**（PLAN/验收报告行号可能漂移 · 已再钉）  
> **Open Folder**：仓根  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A（同 2.4.x / W1–W5 patch 先例）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-1-w6-mech-coverage` |
| **test_strategy** | `required` |
| **test_strategy_note** | 红测先行：① 基线 `CHANGELOG.md` 纳入 terminology 后 rc=0（或按评审裁定的扫描面子集后 rc=0）② 向 `CHANGELOG.md` 注入变体词「门控」⇒ exit 2 点名 ③ 边界词「后门控制」/「门控 skip」不误报 ④ 存量六目标（README 双语 / GLOSSARY / RELEASING / MIGRATION / delivery/promotion/**）零回归 ⑤ `host validate --file <acme-hook.yaml>`（非映射表宿主 + `mechanism: config-hook`）⇒ **PASS + 显式 WARN**（stderr 或 `--json#warnings` · exit 0 不变）⑥ 同表 `host apply … --yes` 仍 **rc=2** 点名 fail-closed（行为不松）⑦ `mechanism: none` 对照仍绿。`check-claims` 是否同口径纳入 CHANGELOG：本波须**评估结论落盘**（纳入则补负向；不纳入须写明理由 · 禁止 silently skip）。四门为波末硬条款 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 机检扫描面 + validate WARN；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | patch 级覆盖面/可见性补齐（非规范增量）；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0.1 patch 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-18 维护者签收 PLAN_3_0_1（原文意图：「身为00，统筹3.0.1的升级，授权签收过程文档」）· 开 W 波限制已解除 |
| HG-SPEC-SIGNOFF | N/A | — | 本版无独立 SPEC 夹（属 3.0.0 验收后 patch · 同 2.4.1/2.4.2 / W1–W5 先例） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· task lint PASS · 10/20 invoke 已落 |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-18 00 代签** · 依据 R1 [`task_3_0_1_w6_mech_coverage_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_w6_mech_coverage_audit_R1_20260918.md)（PASS · blocking 0） |
| HG-W6-REVIEW | **approved** | 30 | **2026-09-18 00 代签** · 依据 [`w6_changelog_scan_surface_review_20260918.md`](../../harness/reviews/w6_changelog_scan_surface_review_20260918.md)：terminology **全量扫** CHANGELOG · `:134`「门控手动测试」**改措辞** · claims **本波不纳入** |

---

## 背景与目标

3.0.0 验收报告 §6.3：

- **P3-2**：`check-terminology` 判红面为**六目标闭集**（`assets/harness/terminology.yaml` `variants[].targets`）；闭集外不扫 ⇒ 向 **`CHANGELOG.md`** 注入变体词「门控」**0 命中**（对外可见活文件却是盲区）。基础面（canonical 5/5、边界排除）正常。
- **P3-7**：非映射表宿主声明 `mechanism: config-hook` 时，`host validate` **静默 PASS**，但 `host apply` **fail-closed exit 2**（行为正确 · 点名不静默）；两关判据不一致 + B5/`MIGRATION` 边界文案未与「validate 应 WARN」对齐。

**根因（2026-09-18 再钉）**：

- P3-2：`assets/harness/terminology.yaml:24-30` 六目标 = `README.md` / `README.zh-CN.md` / `GLOSSARY.md` / `RELEASING.md` / `MIGRATION.md` / `delivery/promotion/**`（**无 CHANGELOG.md**）；脚本 `scripts/check-terminology.mjs:59-60` 仅扫 `v.targets`；注释 `:6` 仍写「六目标闭集」。
- P3-2 风险实证：现行 `CHANGELOG.md` 历史节已有「门控 skip」（`:49`/`:65`/`:99` · 可走 `exempt_patterns`）与 **「门控手动测试」**（`:134` · **非** `门控 skip` 豁免 ⇒ 若全文件纳入将真红）——正是 PLAN **风险 4**（历史节扫描面口径须评审/裁定）。
- P3-2 同口径评估：`assets/harness/claims-boundary.yaml:69-73` `scan_targets` 现亦**无** `CHANGELOG.md`；匹配核 `scripts/check-claims.mjs:54-59`（固定子串 · **禁止**本波改成语义匹配 = P3-1 设计边界）。
- P3-7 apply 真值：`src/host/hooks.ts:60-79` `CONFIG_HOOK_HOSTS`（现值键 **`claude` / `cursor` / `gemini`**）· `:104-106` `configHookSpecOf`；`src/host/materialize.ts:508-511` 无映射 ⇒ `fail(…fail-closed…, 2)`（验收报告写 `:506` 已漂移）。
- P3-7 validate 静默：`src/host/cmd.ts:256-288` schema 零 issue 后直接 `HOST VALIDATE: PASS`，**无**「非映射 + config-hook」WARN 通道；schema `src/host/schema.ts:141-171` / `:151+` 只校验 mechanism 枚举完备，**不**查落点映射表。
- 文档挂点：`docs/guides/使用手册-v3.0.0-zh.md:454-458`（B5 自定义宿主 · 仍写 validate **PASS**）· `MIGRATION.md`（§② hooks 声明约 `:141` · **未**明写非映射宿主 apply fail-closed / validate 应 WARN）· 手册 `:450` 宿主列举与代码 `CONFIG_HOOK_HOSTS` 键集需对齐口径（**只改文案对齐真值 · 不扩映射表**）。

**完成态**：① `CHANGELOG.md` 纳入 terminology 判红面（及 claims **同口径评估结论**）+ 「门控」注入负向；② `host validate` 对「非 `CONFIG_HOOK_HOSTS` + `mechanism: config-hook`」输出 **WARN**（提示 apply 将 fail-closed；建议 `mechanism: none` 仅 L1+L2）且 **exit 0 / PASS 不升级为 FAIL**；③ B5 手册 + `MIGRATION.md` 明写该边界；④ **不改** apply fail-closed · **不扩**落点映射 · **不重写** claims 语义匹配。

**与硬约束 3/5/9**：硬约束 9 已满足（W4 CLOSE）；本波只补覆盖面与可见性（硬约束 5）；滑向「扩映射表 / 改 apply 松紧 / 语义匹配 claims / 触 schema」⇒ **立即 STOP**（硬约束 3）。

---

## 范围

严格对齐 PLAN **W6 节**（不得扩到 release bump · 不得改 apply fail-closed · 不得扩 `CONFIG_HOOK_HOSTS` · 不得做 P3-1 语义匹配）。

- [x] **① P3-2：`CHANGELOG.md` 纳入 `check-terminology` + 注入负向**
  - `assets/harness/terminology.yaml:24-30` `targets` **追加** `CHANGELOG.md`（或按 `HG-W6-REVIEW`/20 裁定改为「仅现行版本节」实现：须在评审文/审查文钉死实现形态，禁止静默缩面）
  - 同步脚本头注释 `scripts/check-terminology.mjs:2-8`（「六目标」→ 新闭集计数/表述）
  - 负向：注入「门控」⇒ **exit 2** 点名；边界：「后门控制」「门控 skip」**不误报**
  - 存量六目标零回归（`test/check-terminology.test.ts` 扩或加 W6 专测）
  - **历史节口径（条件闸）**：实读 `:134`「门控手动测试」全文件纳入会红 —— 20 须裁定：改历史措辞 / 豁免模式 / 仅扫现行节；若属扫描面契约变更 ⇒ 启用 `HG-W6-REVIEW` 先落评审文
- [x] **② P3-2 附属：`check-claims` 同口径评估**
  - 评估是否将 `CHANGELOG.md` 加入 `assets/harness/claims-boundary.yaml:69-73` `scan_targets`
  - **纳入**：补基线绿 +（可选）forbidden 注入负向；**不纳入**：审查文/自检写明理由（威胁模型/误报成本）
  - **禁止**改 `scripts/check-claims.mjs:54-59` 为语义/同义匹配（P3-1 · 非范围）
- [x] **③ P3-7：`host validate` 非映射 + `config-hook` → WARN**
  - 挂点建议：`src/host/cmd.ts:256-288`（schema PASS 之后、打印 PASS 之前）· 映射真值 `src/host/hooks.ts:60-79`/`104-106`
  - 文案须提示：宿主不在 config-hook 落点映射表内 ⇒ **`apply` 将 fail-closed**；如需仅 L1+L2 请用 `mechanism: none`
  - **exit 语义不变**（仍 rc=0 · verdict PASS）；WARN 走 **stderr**；`--json` 入 **`warnings`**（只增不改 · 硬约束 5 / W2 告警契约同源）
  - **不改** `src/host/materialize.ts:508-511` apply fail-closed
- [x] **④ 文档：B5 手册 + MIGRATION 明写边界**
  - `docs/guides/使用手册-v3.0.0-zh.md:454-458`：validate **PASS** → **PASS + WARN**；映射表宿主列举与 `CONFIG_HOOK_HOSTS` 真值对齐（现值 claude/cursor/gemini · **不扩表**）
  - `MIGRATION.md`：在 2.4.2→3.0.0 / hooks 相关节（约 `:141` 一带）明写「非映射宿主 `config-hook`：validate WARN · apply fail-closed · 自定义宿主用 `none`」
  - 可选：`CHANGELOG.md` 登记本波可见性/覆盖面补齐（勿暗示扩 L3 映射）
- [x] **⑤ 回归锁（硬约束 7）**
  - terminology：基线 · 注入门控 · 边界词 · 六目标零回归
  - validate：acme-hook（config-hook · 非映射）PASS+WARN；同表 apply rc=2；acme-none（mechanism: none）apply/validate 绿
  - 内置映射宿主（如 cursor）validate **无**本 WARN、apply 行为零回归

---

## 非范围

| 项 | 理由 |
|----|------|
| 改 `apply` fail-closed 为放行 / 降级 exit | PLAN W6 非范围 · 报告判定**行为正确** · 硬约束 3 |
| 扩 `CONFIG_HOOK_HOSTS` / 落点映射至更多宿主 | PLAN 非范围表 · **归 3.1+** |
| 重写 `check-claims` 为语义/同义匹配（P3-1） | 设计边界裁决 · **不进 3.0.1** |
| 触 host-adapt schema / `schema_version` | 硬约束 3/6 |
| 改判定语义松紧方向（把 WARN 升 FAIL、或放松 apply） | 硬约束 3 |
| W1–W5 已关闭项重开 / release bump `3.0.1` | 每波一 task · release 波 · **仅人** |
| 覆写 S2 过程域既有档 | 硬约束 1 · 只新增不覆写 |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（HG-RELEASE 不在代签范围） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-W6-00） | 30 **拒开工**（verify 机械拦 exit 2） | 是（审查文落盘 + 00 签后） | 是 |
| 20 裁定需扫描面评审但 HG-W6-REVIEW=pending 即 30（F-W6-00b） | 30 **拒开工** | 是（评审文落盘 + 00 签或改 N/A） | 是 |
| 全文件纳入 CHANGELOG 未处理历史「门控手动测试」致基线红（F-W6-01） | 打回 · 须走口径裁定（改史 / 豁免 / 缩面） | 是 | 是 |
| 静默缩扫描面或静默不评估 claims（F-W6-02） | 违反硬约束 5 · 打回 | 是 | 是 |
| validate WARN 改成 FAIL / 改 exit（F-W6-03） | 打回（本波只增可见性） | 是 | 是 |
| apply fail-closed 被放松或删除（F-W6-04） | 越非范围 · **打回或 STOP** | — | 是 |
| 扩 `CONFIG_HOOK_HOSTS` / 触 schema（F-W6-05） | **立即 STOP** 上报 · 移出 3.0.1（硬约束 3） | — | 是 |
| 重写 claims 语义匹配（F-W6-06） | 越 P3-1 非范围 · 打回 | — | 是 |
| WARN 污染 `--json` 键集（F-W6-07） | 打回 · stderr / `warnings` 只增不改 | 是 | 是 |
| 存量六目标 terminology 回归红（F-W6-08） | 打回 | 是 | 是 |
| 边界词误报（后门控制 / 门控 skip）（F-W6-09） | A 验收失败 · 打回 | 是 | 是 |
| 顺手 bump 3.0.1 / 开 release（F-W6-10） | 打回 | — | — |
| 越权 tag/push/publish/deprecate（F-W6-11） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟域外档（F-W6-12） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| 四门任一红（F-W6-13） | 停止 · 先修再关账 | 是 | 是 |
| 手册/MIGRATION 仍写 validate 静默 PASS（F-W6-14） | A6 失败 · 打回 | 是 | 是 |

---

## 验收标准

- [x] **A1 terminology 覆盖**：`CHANGELOG.md` 已在判红面（或评审钉死的等价扫描面子集）；仓基线 `node scripts/check-terminology.mjs` **rc=0**
- [x] **A2 注入负向**：向 `CHANGELOG.md`（或裁定的扫描子集可写位）注入「门控」⇒ **exit 2** 且点名文件/行；清除后复绿
- [x] **A3 边界不误报**：「后门控制」「门控 skip」路径 **rc=0**（与既有 fixture 同口径）
- [x] **A4 六目标零回归**：原六目标文件/目录扫描行为与命中口径不回退
- [x] **A5 claims 同口径结论**：要么 `CHANGELOG.md` 已入 `claims-boundary.yaml` scan_targets 且基线绿，要么审查文/自检**显式**写明不纳入理由（禁止沉默）
- [x] **A6 validate WARN**：非映射宿主 + `config-hook` ⇒ `HOST VALIDATE: PASS` + **显式 WARN**（人类面可见；`--json` 含 `warnings`）；**rc=0**
- [x] **A7 apply 不松**：同表 `host apply --tools <id> --file … --yes` 仍 **rc=2** 且文案点名无落点映射；`mechanism: none` 对照 **rc=0**
- [x] **A8 文档**：手册 B5 段（约 `:454-458`）与 `MIGRATION.md` 已明写「validate WARN · apply fail-closed · 自定义用 none」；映射宿主列举与代码真值一致（不扩表）
- [x] **A9 非范围钉死**：未改 apply 松紧；未扩映射表；未做 claims 语义匹配；未触 schema；未 bump 3.0.1
- [x] **A10 四门**：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib` 全绿
- [x] **A11 关账**：`npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w6_mech_coverage.md` → exit 0 + `task close --yes`；提交 `fix(3.0.1-W6): …` · 禁 `git add -A` · 未执行 tag/push/publish

---

## 给执行帽的必读列表

1. [`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md) — W6 节全文 · 硬约束 **3/5/9** · 风险 **4**（CHANGELOG 历史节）· 非范围 P3-1/映射扩展
2. [`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) §6.3 P3-2（约 `:440-443`）· P3-7（约 `:470-482`）
3. 挂点再钉（2026-09-18）：`assets/harness/terminology.yaml:24-30` · `scripts/check-terminology.mjs:2-8/:59-60` · `CHANGELOG.md:134`（历史「门控手动测试」）· `assets/harness/claims-boundary.yaml:69-73` · `scripts/check-claims.mjs:54-59` · `src/host/hooks.ts:60-79/:104-106` · `src/host/materialize.ts:508-511` · `src/host/cmd.ts:256-288` · `src/host/schema.ts:141-171` · `docs/guides/使用手册-v3.0.0-zh.md:450/:454-458` · `MIGRATION.md:141` 一带 · `test/check-terminology.test.ts`
4. 条件闸先例 [`docs/tasks/done/task_3_0_1_w2_gate_table_contract.md`](../done/task_3_0_1_w2_gate_table_contract.md)（`HG-W2-REVIEW`）· 同系列元信息先例 [`docs/tasks/done/task_3_0_1_w5_pin_hook_version.md`](../done/task_3_0_1_w5_pin_hook_version.md)
5. `docs/standards/` 涉机检/CLI 时 30 自裁引用 L2

---

## 思考轮

### R0 · 证据

PLAN_3_0_1 HG-NEXT-PLAN=approved；W1–W5 CLOSE: PASS（硬约束 9 满足）；§6.3 P3-2/P3-7 与 PLAN W6 对齐。本棒实读：terminology 六目标无 CHANGELOG；CHANGELOG `:134`「门控手动测试」全文件纳入会红（风险 4 活证）；claims scan_targets 亦无 CHANGELOG；validate `cmd.ts:256-288` 无 WARN；apply fail 在 `materialize.ts:508-511`；映射表真值 `hooks.ts` claude/cursor/gemini；手册 B5 仍写 validate PASS。

### R1 · 范围

仅① CHANGELOG→terminology（+claims 评估）② validate WARN ③ B5/MIGRATION 明写；显式排除改 apply、扩映射、claims 语义匹配、schema、release bump。

### R2 · 方案

yaml targets 扩面（或评审钉死缩面）+ 负向测；validate 在 schema PASS 后查 `configHookSpecOf` 缺失发 WARN；文档改 PASS→PASS+WARN；条件闸 `HG-W6-REVIEW` 兜底历史节口径。

### R3 · 边界

硬约束 3：WARN≠改松紧、扩表=STOP。硬约束 5：禁止静默缩面/静默跳过 claims 评估。硬约束 9：已满足（W4 先于本波）。

### R4 · 可测性

A1–A8 机检 · A9 非范围 · A10 四门 · A11 关账；`test_strategy=required`。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（重点：历史节口径 · claims 是否纳入 · WARN 契约只增不改 · 映射键文案对齐）；HG-TASK-DRAFT / HG-AUDIT-R1 /（条件）HG-W6-REVIEW 待评审文与 00 代签。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | P3-2/P3-7 证据与 file:line 再钉齐 · 风险 4 活证 `:134` | no |
| R1 | 仅 W6 覆盖面+WARN · 排除 apply/扩表/P3-1 | no |
| R2 | yaml 扩面 · validate WARN · 文档 · 条件闸 | no |
| R3 | 硬约束 3/5/9 · 禁 schema/扩表/松 apply | no |
| R4 | A1–A11 可机检 · required | no |
| R5 | 待 20 审 R1 裁定充分性与 HG-W6-REVIEW | no |

**residual_risks**：① 历史节「门控手动测试」全文件纳入基线红（F-W6-01 · 风险 4）；② WARN 升 FAIL 或污染 JSON（F-W6-03/07）；③ 文档宿主列举与 `CONFIG_HOOK_HOSTS` 漂移（A8）；④ claims 评估被沉默跳过（F-W6-02）；⑤ 条件闸与 AUDIT-R1 双闸遗漏。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 须有可失败自动化（建议扩 `test/check-terminology.test.ts` + 新增 `test/w6-mech-coverage.test.ts` 或等价）：CHANGELOG 注入门控负向 · 边界词 · validate WARN+apply rc=2 对偶 · none 对照。波末四门全绿。红测先行：先固化「闭集外 CHANGELOG 注入现不红」对照（或文档化已变红的期望）再改 yaml/实现。

---

## 提交信息约定

- 实现提交：`fix(3.0.1-W6): …`（mech coverage · P3-2/P3-7）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟** release bump · 不裹挟无关 S2 档
- **禁 tag / push / publish / deprecate（仅人）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w6_mech_coverage.md`

---

### 自检结论（执行者）

30/40 · 2026-09-18 · A1–A11 机检 PASS · 四门绿 · 未 commit / 未 tag/push/publish。

#### 验收勾选

A1–A11 全勾 · 证据见 `test/w6-mech-coverage.test.ts` + 四门日志 · HG-W6-REVIEW 扫描面评审文（S-TERM 全量扫 · S-CLAIMS 不纳入）。

#### invoke

`docs/harness/invokes/by-task/3-0-1-w6-mech-coverage/invoke_20260918_30_40_3-0-1-w6-mech-coverage.md`

Wiki: none

### 经验总结（执行者）

- terminology 全量扫 CHANGELOG 前须先改史措辞（`:134`「门控手动测试」→「门禁手动测试」）；禁靠扩 exempt 掩盖。
- claims 本波不纳入：CHANGELOG 历史节合法复述「四宿主」/「406 用例」会真红；A5 须显式写理由（硬约束 5）。
- validate WARN 与 W2 同源：stderr + `--json#warnings` 只增不改 · 不升 FAIL · 不松 apply。
- S2 过程档须显式 `git add` 才过 doc-links 入库判据（基线 34 不涨）；assets yaml 注释勿写相对路径形链接（DEF-009）。

### KPI（30/40）

Task_KPI%: 96（①–⑤与 A1–A11 全绿 · terminology 全量扫+负向+边界 · validate PASS+WARN/apply rc=2 对偶 · claims 显式不纳入 · 四门绿 · 零扩表/松 apply/语义 claims/schema/bump/发版越权 · 未 git commit 留给维护者）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同棒闭环

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 初稿 · 10-task（PLAN W6 / §6.3 P3-2/P3-7）· 状态 draft · HG-TASK-DRAFT/HG-AUDIT-R1/HG-W6-REVIEW=pending · HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=N/A · 行号再钉见上（materialize fail `:508-511` · CHANGELOG 风险活证 `:134` · CONFIG_HOOK_HOSTS=claude/cursor/gemini）· 闸表 4 列且 id 单元格无内嵌粗体 · 条件闸 HG-W6-REVIEW（历史节扫描面 · 20 可 N/A）· test_strategy=required · 补自检/KPI 占位过 E5 |
| 2026-09-18 | **00 代签三闸**：HG-TASK-DRAFT + HG-AUDIT-R1 + HG-W6-REVIEW → approved · 全量扫 + 改 :134 措辞 · claims 本波不纳入 |
| 2026-09-18 | **30/40 收口**：实现 + A1–A11 + 四门 + close · 未发版 · 未 commit |
