# Task：3.0.1 W5 · 物化 hooks 钉版能力（可选旗标 · P2-2）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（**2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· 依据 [`task_3_0_1_w5_pin_hook_version_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_w5_pin_hook_version_audit_R1_20260918.md) PASS · blocking 0）· 30/40 闭环完成 · 2026-09-18 · **未发版 / 未 commit**）  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（**HG-NEXT-PLAN=approved** · 2026-09-18 维护者签收 · 授权 00 代签过程闸 · HG-RELEASE / tag / push / publish 仍仅人）· **W5 节** + 硬约束 **3**（patch 纪律门）/ **5**（「不要静默」总则）/ **7**（修严须配回归锁）/ **8**（波末 typecheck+test）/ **10**（RELEASING 双重敏感）  
> **范围主源**：[`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) **§6.2 P2-2**（物化 hooks 门禁命令未钉版本 · 离线取包失败 ⇒ fail-closed 阻断）  
> **基线**：`spec-wave@3.0.0` published（npm `latest` = 3.0.0 · tag `v3.0.0`）· 前序波次 **W1–W4 均已 CLOSE: PASS**  
> **行号口径**：本 task 全部 `file:line` 为 **2026-09-18 10-task 起草棒实读现值**（PLAN 仅点 `materialize.ts` · 本棒再钉到真正命令串生成处）  
> **Open Folder**：仓根  
> **本版无独立 SPEC**：HG-SPEC-SIGNOFF=N/A（同 2.4.x / W1–W4 patch 先例）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-1-w5-pin-hook-version` |
| **test_strategy** | `required` |
| **test_strategy_note** | 红测先行：① **不带旗标** `host apply` 物化 hooks 命令串与 3.0.0 **逐字节一致**（`npx spec-wave hook-guard --trigger …`，无 `@semver`）② **带旗标**（裸旗标或缺省 `kit_semver` / 显式 `=SEMVER`）命令串含 `npx spec-wave@<semver> hook-guard …` ③ 带旗标物化后 `host verify` **rc=0**（钉版不得破坏自校验 / 本包条目识别）④ 帮助文案与 CHANGELOG 显式标「实验性 · 缺省关闭」⑤ 离线/受限取包路径 fail-closed exit 2 **语义不松**（仅可更明确提示 · 可选负向）。四门为波末硬条款；触及 `RELEASING.md` ⇒ 全量 `npm test`（硬约束 10） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 可选 CLI 旗标 + hooks 命令串生成；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | patch 级可选钉版旗标（非规范增量）；关账经验是否晋升 wiki 归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0.1 patch 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-18 维护者签收 PLAN_3_0_1（原文意图：「身为00，统筹3.0.1的升级，授权签收过程文档」）· 开 W 波限制已解除 |
| HG-SPEC-SIGNOFF | N/A | — | 本版无独立 SPEC 夹（属 3.0.0 验收后 patch · 同 2.4.1/2.4.2 / W1–W4 先例） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-18 00 代签** · 授权真值：维护者本窗「授权签收过程文档」· task lint PASS · 10/20 invoke 已落 |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-18 00 代签** · 依据 [`task_3_0_1_w5_pin_hook_version_audit_R1_20260918.md`](../../harness/reviews/task_3_0_1_w5_pin_hook_version_audit_R1_20260918.md)（PASS · blocking 0 · 不改默认物化 · 实验性缺省关闭） |

---

## 背景与目标

3.0.0 验收报告 §6.2 **P2-2**：`host apply` 物化的 `.cursor/hooks.json` / `.claude/settings.json`（及 shell-hook 脚本）中，命令为 `npx spec-wave hook-guard --trigger …`——**不带 `@<semver>` 钉版**。hook-guard 默认门禁命令会再调 `npx spec-wave …`；离线/沙箱 CI 取包失败 ⇒ **fail-closed exit 2**（语义安全 · 宁拦不放），但给确定性 CI 带来噪音。

**根因（2026-09-18 再钉 · 命令串真值）**：
- `src/host/hooks.ts:20-21` `hookGuardCommand` 硬编码 `` `npx spec-wave hook-guard --trigger ${trigger}` ``（**无 `@semver`**）
- 同文件 `:35-40` / `:53` `entryFor` 经该函数写入 config-hook 条目；`:183-193` `buildShellHookScript` 硬编码 `exec npx spec-wave hook-guard --trigger pre-commit`
- `src/host/hooks.ts:79-84` `isPackageManagedHookEntry` 以 `hookGuardCommand(trigger)` **整串**做本包条目识别 marker —— 钉版实现若只改命令串而不扩识别口径 ⇒ **verify 假红**（与 W1/P1-1 同型）
- `src/host/materialize.ts:455-543` 物化编排：`:466` 调 `buildShellHookScript` · `:512` 调 `mergeHookConfig`（落点调用处 · 非字面串源头）
- CLI 旗标挂点：`src/host/cmd.ts:53-54` `APPLY_USAGE`（现无钉版旗标）· `:235-262` `cmdHostApply` 解析 `--tools/--profile/--target/--file` 后 `rest.length>0` 即未知参数拒；`:129-140` `takeOptionalFlag` **要求必须跟值** ⇒ 裸 `--pin-hook-version`（缺省 `kit_semver`）须新解析形态，不可直接复用
- 文档：`docs/guides/使用手册-v3.0.0-zh.md:469-488` §7.3 已有「用 `--command` 显式钉版」实践建议；`RELEASING.md` **尚无**「CI 预热 npm 缓存 / 物化钉版旗标」可操作建议（硬约束 10）

**完成态**：`host apply` 增**可选**实验性旗标（命名建议 `--pin-hook-version[=SEMVER]`；裸旗标或缺省值取当前 `kit_semver` / `package.json` version）；**不带旗标时物化输出与 3.0.0 逐字节一致**；带旗标时命令写为 `npx spec-wave@<semver> hook-guard …`；本包条目识别与 `host verify` 在钉版路径仍绿；帮助 / CHANGELOG 标「实验性 · 缺省关闭」；`RELEASING.md` + 使用手册 §7.3 补确定性 CI 建议（预热缓存 **或** 显式钉版旗标 **或** `--command` 自带命令）。**不改默认物化内容 · 不转默认（转默认归 3.1）**。

**与硬约束 3 边界**：本波仅加**缺省关闭**的可选旗标 + 文档，**不**扩默认能力面、**不**改判定松紧、**不**触 schema。若实现滑向「默认钉版 / 改无旗标字节 / 锁文件 / 改 hook-guard 分发语义」⇒ **立即 STOP 上报**移出 3.0.1。

---

## 范围

严格对齐 PLAN **W5 节**（不得扩到 W6 / release bump · 不得改默认物化字节 · 不得转默认钉版）。

- [x] **① `host apply` 可选钉版旗标**
  - 挂点：`src/host/cmd.ts:53-54`（`APPLY_USAGE` / 可视情况同步 `HOST_USAGE:50-51`）· `:235-262`（`cmdHostApply` 解析链）
  - 命名建议：`--pin-hook-version[=SEMVER]`（或等价：裸旗标 = 开 + 缺省 semver；`--pin-hook-version 3.0.0` / `=3.0.0` 显式）
  - **缺省 semver** 取当前 `kit_semver`（与粘性/`package.json` version 同源口径 · 现值 `3.0.0` · 实现钉死读源并在自证写明）
  - 非法 semver / 空值 ⇒ **exit 1** 用法错误（可见提示 · 硬约束 5）
  - 帮助文案须含「**实验性 · 缺省关闭**」
  - `host update`：若走同一物化函数，**透传同旗标或明示帮助「仅 apply 支持」**（禁止用户带旗标却被静默忽略 · 交 20 审裁定挂面；默认建议与 apply 同挂以免静默）
- [x] **② 命令串生成支持可选 `@semver`（不改默认字面）**
  - 真值：`src/host/hooks.ts:20-21` `hookGuardCommand`（及 `:183-193` shell-hook 脚本内 `exec npx …`）
  - 编排透传：`src/host/materialize.ts:466` / `:512` 一带（`MaterializeOpts` 或等价参数线程）
  - **不带旗标**：输出与 3.0.0 **逐字节一致**（config-hook JSON + shell-hook 脚本）
  - **带旗标**：`npx spec-wave@<semver> hook-guard --trigger …`
- [x] **③ 本包条目识别 / verify 钉版路径不假红**
  - `src/host/hooks.ts:79-84` `isPackageManagedHookEntry`（及 verify 包含性比对依赖的产品条目生成）须同时识别**未钉版**与**钉版**命令串；带旗标 apply 后 `host verify` **rc=0**
- [x] **④ 文档：RELEASING + 使用手册 §7.3 + CHANGELOG**
  - `RELEASING.md`：补「确定性 CI」可操作建议（预热 npm 缓存 **或** `host apply --pin-hook-version` **或** `hook-guard --command` 自带钉版命令）——硬约束 10
  - `docs/guides/使用手册-v3.0.0-zh.md:469-488` §7.3：在既有 `--command` 建议旁**并列**可选物化旗标（标明实验性 · 缺省关闭 · 不改无旗标默认物化）
  - `CHANGELOG.md`：登记本能力为「实验性 · 缺省关闭」（发版节可随 release 波润色，本波至少有可检索登记位或 `[Unreleased]`/`3.0.1` 草稿位 · 交 30 与 20 对齐，**禁止**暗示默认已钉版）
- [x] **⑤ 回归锁（硬约束 7）**
  - A/B：同 target / 同 tools 下不带旗标 vs 带旗标物化结果 `diff` 断言
  - 不带旗标 = 3.0.0 命令字面；带旗标含 `@<semver>`；带旗标后 verify rc=0
  - 帮助/`--help` 输出含实验性/缺省关闭关键词（机检可 grep）

---

## 非范围

| 项 | 理由 |
|----|------|
| **改默认物化内容**（无旗标时写入 `@semver`） | PLAN W5 硬钉 · 与 W1 同型假红坑 · **禁止** |
| 将钉版**转默认开启** | PLAN 非范围表 · **归 3.1**（须先设计已物化用户迁移提示） |
| 改 `hook-guard` 分发语义 / 默认门禁命令 / fail-closed 松紧 | PLAN W5 非范围 · 硬约束 3 |
| 引入锁文件 / vendor 依赖包 / 捆绑 npm 包缓存 | PLAN W5 非范围 |
| 扩 `config-hook` 落点映射表 / 触 host-adapt schema | 硬约束 3/6 · W6/3.1 |
| W6 terminology/claims 扫描面 · validate WARN | W6 · 本波不扩 |
| bump `package.json` → 3.0.1 / tag / push / publish | release 波 · **仅人** |
| 覆写 S2 过程域既有档 | 硬约束 1 · 只新增不覆写 |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（HG-RELEASE 不在代签范围） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-W5-00） | 30 **拒开工**（verify 机械拦 exit 2） | 是（审查文落盘 + 00 签后） | 是 |
| 不带旗标物化字节相对 3.0.0 漂移（F-W5-01） | 验收 A1 失败 · **打回**（最高风险 · 假红源） | 是 | 是 |
| 默认开启钉版 / 文档暗示「已默认钉版」（F-W5-02） | 违反 PLAN 风险 5 / 非范围 · **打回** | 是 | 是 |
| 钉版后本包条目识别失败 ⇒ verify 假红（F-W5-03） | A3 失败 · 打回（须扩 marker / 产品条目同源） | 是 | 是 |
| `update` 接受或透传旗标却静默忽略（F-W5-04） | 违反硬约束 5 · 打回（同挂或明示不支持） | 是 | 是 |
| 非法 semver 静默回落未钉版字面（F-W5-05） | 打回 · 须 exit 1 可见 | 是 | 是 |
| 改 hook-guard 分发语义 / 放松离线 fail-closed（F-W5-06） | 越非范围 / 硬约束 3 · **STOP** 或打回 | — | 是 |
| 引入锁文件 / vendor（F-W5-07） | 越非范围 · 打回 | — | 是 |
| 触 schema / 改判定松紧 / 转默认能力面（F-W5-08） | **立即 STOP 上报** · 移出 3.0.1（硬约束 3） | — | 是 |
| 顺手开 W6 / bump 3.0.1（F-W5-09） | 打回（每波一 task · 本波仅 W5） | — | — |
| 改 `RELEASING.md` 后未跑全量 `npm test` / pins 误伤（F-W5-10） | 打回（硬约束 8/10） | 是 | 是 |
| 越权 tag/push/publish/deprecate（F-W5-11） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟域外档（F-W5-12） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| 四门任一红（F-W5-13） | 停止 · 先修再关账 | 是 | 是 |
| 帮助/CHANGELOG 未标「实验性 · 缺省关闭」（F-W5-14） | A5 失败 · 打回 | 是 | 是 |

---

## 验收标准

- [x] **A1 无旗标字节锁**：同条件 `host apply`（不带钉版旗标）物化的 hooks 命令串与 3.0.0 期望字面 **逐字节一致**（至少覆盖 cursor/claude config-hook；若测 shell-hook 则脚本内 `exec` 行同锁）——期望字面：`npx spec-wave hook-guard --trigger <t>`（**无** `@`）
- [x] **A2 带旗标钉版**：`--pin-hook-version`（裸旗标 ⇒ 当前 kit_semver）与/或显式 SEMVER 物化后，命令串含 `npx spec-wave@<semver> hook-guard --trigger …`；`diff` 相对无旗标路径**仅**钉版段差异（不得顺带改其他落点语义）
- [x] **A3 verify 绿**：带旗标物化后 `host verify` **rc=0**（本包条目识别与包含性比对不因 `@semver` 假红）
- [x] **A4 离线语义不松**：钉版不改变 fail-closed 方向；取包失败仍为阻断级（exit 2 族 · 与既有 hook-guard/门禁契约一致）；不得为「过 CI」而改成 fail-open
- [x] **A5 实验性标注**：`host apply --help`（或用法串）与 CHANGELOG 登记含「实验性」与「缺省关闭」（或等价措辞）；**不得**写「默认钉版」
- [x] **A6 文档**：`RELEASING.md` 与《使用手册》§7.3 已补确定性 CI 建议（预热缓存 **或** 物化钉版旗标 **或** `--command`）；§7.3 不删除既有 `--command` 建议
- [x] **A7 非范围钉死**：无旗标默认字节未改；未转默认；未改 hook-guard 分发语义；未引入锁文件；未开 W6；未触 schema；未 bump 3.0.1
- [x] **A8 四门**：`npm run typecheck` · `npm test` · `npm run build` · `npm run test:lib` 全绿（含 RELEASING/pins 敏感面）
- [x] **A9 关账**：`npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w5_pin_hook_version.md` → exit 0 + `task close --yes`；提交 `fix(3.0.1-W5): …` · 禁 `git add -A` · 未执行 tag/push/publish

---

## 给执行帽的必读列表

1. [`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md) — W5 节全文 · 硬约束 **3/5/7/8/10** · 风险 5/7 · 非范围「P2-2 默认钉版归 3.1」
2. [`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](../../harness/reviews/acceptance_3_0_0_specwave_20260918.md) §6.2 P2-2（`:367-372`）
3. 挂点再钉（2026-09-18）：`src/host/hooks.ts:20-21`（`hookGuardCommand`）· `:79-84`（条目识别）· `:183-193`（shell-hook）· `src/host/materialize.ts:455-543`（`:466`/`:512`）· `src/host/cmd.ts:53-54`/`235-262`/`129-140` · `docs/guides/使用手册-v3.0.0-zh.md:469-488` · `RELEASING.md`（现无钉版 CI 专节 · 本波新增）· `package.json` version=`3.0.0`
4. 先例 [`docs/tasks/done/task_3_0_1_w4_docs_precision.md`](../done/task_3_0_1_w4_docs_precision.md)（同系列元信息 / 闸表 4 列 / 无 SPEC / 文档敏感）
5. `docs/standards/` 涉 CLI / 物化时 30 自裁引用 L2

---

## 思考轮

### R0 · 证据

PLAN_3_0_1 HG-NEXT-PLAN=approved；W1–W4 CLOSE: PASS；§6.2 P2-2 与 PLAN W5 对齐。本棒实读：命令串真值在 `hooks.ts:20-21`（非仅 materialize 编排）；`cmdHostApply` 无钉版旗标且 `takeOptionalFlag` 不能表达「裸旗标」；手册 §7.3 已有 `--command` 建议、RELEASING 缺 CI 钉版专建议；`isPackageManagedHookEntry` 整串匹配 ⇒ 钉版必须同源扩识别，否则 verify 假红。

### R1 · 范围

仅可选旗标 + 命令串可选 `@semver` + 识别/verify 绿 + RELEASING/手册/CHANGELOG 实验性标注；显式排除改默认物化、转默认、改 hook-guard 语义、锁文件、W6、release bump。

### R2 · 方案

CLI 解析挂 apply（update 同挂或明示）→ 透传至 `hookGuardCommand`/`buildShellHookScript` → 缺省关闭保字节；单测 A/B diff + verify；文档三处补「实验性 · 缺省关闭」与 CI 三选一建议。

### R3 · 边界

硬约束 3：可选缺省关闭 ≠ 新增默认能力面；滑向默认钉版/schema/松紧 ⇒ STOP。硬约束 5：禁止静默忽略旗标/非法 semver。硬约束 10：改 RELEASING 必全量 test。

### R4 · 可测性

A1–A6 机检（diff/grep/verify/帮助）· A7 非范围 · A8 四门 · A9 关账；`test_strategy=required`（行为锁 + RELEASING/pins）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（重点：默认字节零漂移 · marker 双形态 · 实验性文案 · update 挂面裁定）；HG-TASK-DRAFT / HG-AUDIT-R1 待评审文与 00 代签。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | P2-2 证据与 hooks/CLI/手册 file:line 再钉齐 | no |
| R1 | 仅 W5 可选旗标 · 排除改默认/转默认/W6 | no |
| R2 | CLI→hooks 透传 · A/B diff · 文档实验性 | no |
| R3 | 硬约束 3/5/10 · 禁 schema/转默认 | no |
| R4 | A1–A9 可机检 · required | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① 无旗标路径字节漂移触发存量 verify 假红（F-W5-01）；② 钉版后 marker 未扩致 A3 假红（F-W5-03）；③ 旗标被文档/帮助误写成默认开启（F-W5-02）；④ `takeOptionalFlag` 误用导致裸旗标解析错（F-W5-05）；⑤ 改 RELEASING 误伤 pins（F-W5-10）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 须有可失败自动化（建议 `test/*pin*hook*` 或扩既有 host-adapt/hooks 测）：无旗标字节锁 · 带旗标 `@semver` 断言 · 带旗标后 verify rc=0 ·（可选）非法 semver exit 1。波末四门 + 改 RELEASING 后全量 `npm test`。红测先行：先固化「无旗标 = 3.0.0 字面」快照再实现旗标路径。

---

## 提交信息约定

- 实现提交：`fix(3.0.1-W5): …`（pin-hook-version optional · P2-2）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟** W6 草稿 · 不裹挟 release bump · 不裹挟无关 S2 档
- **禁 tag / push / publish / deprecate（仅人）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_1_w5_pin_hook_version.md`

---

### 自检结论（执行者）

30/40 · 2026-09-18 · A1–A9 机检 PASS · 四门绿 · 未 commit / 未 tag/push/publish。

#### 验收勾选

A1–A9 全勾 · 证据见 `test/w5-pin-hook-version.test.ts` + 四门日志。

#### invoke

`docs/harness/invokes/by-task/3-0-1-w5-pin-hook-version/invoke_20260918_30_40_3-0-1-w5-pin-hook-version.md`

Wiki: none

### 经验总结（执行者）

- 命令串真值在 `hooks.ts`（非仅 materialize）；`isPackageManagedHookEntry` / `hookConfigContains` / shell-hook verify 须双形态，否则钉版后 verify 假红。
- 裸 `--pin-hook-version` 不可复用 `takeOptionalFlag`；缺省 semver 钉 `kitPackageSemver()` ← `package.json#version`。
- S2 过程档须显式 `git add` 才过 doc-links 入库判据（基线 34 不涨）。

### KPI（30/40）

Task_KPI%: 95（范围①–⑤与 A1–A9 全绿 · 红测 8/8 · 无旗标字节锁 + marker 双形态 + verify 绿 · 四门 895+6 · 零默认钉版/schema/W6/bump/发版越权 · 未 git commit 留给维护者）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同棒闭环

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 初稿 · 10-task（PLAN W5 / §6.2 P2-2）· 状态 draft · HG-TASK-DRAFT/HG-AUDIT-R1=pending · HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=N/A · 行号再钉见上（hooks.ts 为命令串真值）· 闸表 4 列且 id 单元格无内嵌粗体 · test_strategy=required · 补自检/KPI 占位过 E5 |
| 2026-09-18 | **00 代签**：HG-TASK-DRAFT + HG-AUDIT-R1 → approved · R1 PASS · blocking 0 |
