# 审查文 · 3.0.1 W5 pin-hook-version task R1

> **hat**：20-task-audit（书面审查 · R1 · 独立上下文 · 非起草者）  
> **日期**：2026-09-18  
> **被审对象**：[`docs/tasks/active/task_3_0_1_w5_pin_hook_version.md`](../../tasks/active/task_3_0_1_w5_pin_hook_version.md)（slug `3-0-1-w5-pin-hook-version` · `draft` · 无独立 SPEC · HG-SPEC-SIGNOFF=N/A）  
> **对照基准**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（HG-NEXT-PLAN=approved · **W5 节** + 硬约束 **3/5** · 及 7/8/10）· [`acceptance_3_0_0_specwave_20260918.md`](./acceptance_3_0_0_specwave_20260918.md) **§6.2 P2-2**（`:367-372`）· 10 invoke `docs/harness/invokes/by-task/3-0-1-w5-pin-hook-version/invoke_20260918_10_3-0-1-w5-pin-hook-version.md` · 先例形态 [`task_3_0_1_w4_docs_precision_audit_R1_20260918.md`](./task_3_0_1_w4_docs_precision_audit_R1_20260918.md)  
> **审查方式**：只读通读 task + PLAN W5/硬约束 3·5（及 7/8/10）+ 验收 §6.2 P2-2；**独立再钉** `hooks.ts` / `materialize.ts` / `cmd.ts` / 手册 §7.3 / `package.json#version` / `RELEASING.md`；`node bin/specgate.js task lint` → **LINT: PASS**；**未改被审 task 任何字节 · 未改 `src/`**。

---

## 结论摘要（内容闸 / 流程闸分列）

| 维度 | 结论 | 说明 |
|------|------|------|
| **内容闸**（范围 / 非范围 / 验收 / failure_paths / 思考轮 / 硬约束 3·5 / 默认字节零漂移） | **PASS · 零内容阻塞** | 严格贴 PLAN W5：可选旗标 + 文档；**不改默认物化**；缺省=kit_semver；帮助/CHANGELOG「实验性 · 缺省关闭」；A1 无旗标=3.0.0 逐字节；marker 双形态防 verify 假红 |
| **流程闸** | **pending（不由本帽签）** | `HG-TASK-DRAFT=pending` · `HG-AUDIT-R1=pending`（blocks 30）· HG-NEXT-PLAN 已 approved · HG-SPEC-SIGNOFF=N/A 正确 |
| **总结论** | **PASS** | 可进 00 代签过程闸 → 再下发 30；**本审查文不附 30 Prompt** |

---

## 1. 逐项核对（对照 PLAN W5 + 硬约束 3/5）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 = PLAN W5（可选钉版旗标 · 不改默认 · RELEASING/手册 CI 建议） | **PASS** | task §范围 ①–⑤ 与 PLAN W5·范围逐条对应；完成态同口径 |
| **不改默认物化内容**（无旗标字节 = 3.0.0） | **PASS** | 非范围首行 · A1 · A7 · F-W5-01；PLAN 编排理由 5 / 风险 5 |
| **可选旗标** `--pin-hook-version[=SEMVER]` | **PASS** | 范围① · A2 · PLAN W5 命名建议 |
| **缺省 semver = kit_semver**（↔ `package.json` version） | **PASS** | 范围① · A2 · PLAN「缺省取当前 kit_semver」· task 要求 30 钉死读源 |
| **帮助 / CHANGELOG「实验性 · 缺省关闭」** | **PASS** | 范围①/④ · A5 · F-W5-02/14 · PLAN 风险 5 |
| **不带旗标与 3.0.0 逐字节一致** | **PASS** | A1 + 范围② + test_strategy 红测① · F-W5-01 最高风险 |
| **带旗标后 verify rc=0**（marker 双形态） | **PASS** | 范围③ · A3 · F-W5-03；`isPackageManagedHookEntry` 整串匹配坑与 W1/P1-1 同型已写明 |
| **不改 hook-guard 分发 / fail-closed 不松** | **PASS** | 非范围 · A4 · F-W5-06；硬约束 3 |
| **不引入锁文件 / 不转默认 / 不触 schema** | **PASS** | 非范围表 · A7 · F-W5-07/08；转默认归 3.1（PLAN 非范围） |
| 硬约束 **3**（patch 纪律门 · 可选缺省关闭 ≠ 新增默认能力面） | **PASS** | 背景「与硬约束 3 边界」· R3 · F-W5-08 STOP；PLAN 已授权本可选旗标入 3.0.1 |
| 硬约束 **5**（不要静默 · 非法 semver / update 旗标） | **PASS** | F-W5-04/05 · 范围① update 挂面 · A5 文案可见 |
| 硬约束 **7/8/10**（回归锁 · 四门 · RELEASING 全量 test） | **PASS** | 范围⑤ · A8/A9 · F-W5-10/13 · `test_strategy=required` |
| 验收机械可判 | **PASS** | A1–A6 diff/grep/verify/文档 · A7 非范围 · A8 四门 · A9 关账 |
| failure_paths | **PASS** | F-W5-00~14：闸拒 · 字节漂移 · 默认误开 · marker 假红 · 静默忽略 · 非法 semver · 越界 · RELEASING/pins · 发布 · stage · 四门 · 文案 |
| R0–R5 思考轮 | **PASS** | 控制表逐轮回填 · early_stop 全 no · residual_risks 五条真实（字节漂移 / marker / 误写默认 / 裸旗标解析 / RELEASING pins） |
| 人工闸表形态 | **PASS** | **4 列** · id 无内嵌破坏解析的粗体 · HG-AUDIT-R1 pending blocks 30 · 00 代签授权在案 |
| 与 §6.2 P2-2 主源对齐 | **PASS** | 事实/建议承接：可选钉版 **或** 文档预热/`--command`；**未**采纳「改默认物化命令」 |
| `test_strategy=required`（行为锁 + RELEASING/pins） | **PASS** | 元信息 note + §测试策略 · A/B diff + verify + 四门 |
| 行为变更类 · 旧测 grep 影响面 | **PASS（锁在 A1/A7）** | 本波**不改默认值/松紧**；新路径仅旗标开启。A1 固化无旗标=3.0.0 字面即存量物化影响面锁；扩 marker 须保未钉版路径识别不回退（提示见 §4） |
| task lint（流程核对 · 只读） | **PASS** | `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w5_pin_hook_version.md` → `LINT: PASS`（W3 占位符 warn · draft 合法） |
| 未扩 W6 / release bump | **PASS** | 非范围 + F-W5-09 · 每波一 task |

---

## 2. 行号现值独立再钉（与 task 声明对照）

> 本棒 2026-09-18 只读实读工作树；**全部精确命中 · 无阻塞级漂移**。`package.json#version` = **`3.0.0`**。`RELEASING.md` **无**「钉版 / 预热 npm 缓存 / pin-hook」专节（本波待补 · 与 task 一致）。

| # | task / PLAN / 验收声明 | 本棒现值 | 结果 |
|---|------------------------|----------|------|
| 1 | `src/host/hooks.ts:20-21` `hookGuardCommand` 无 `@semver` | `:19-22`：`hookGuardCommand` 返回 `` `npx spec-wave hook-guard --trigger ${trigger}` `` | ✅ |
| 2 | `:35-40` / `:53` `entryFor` 经该函数写入 | `:35-40` `matcherEntry` → `hookGuardCommand(trigger)` · `:53` cursor `entryFor` 同调 | ✅ |
| 3 | `:79-84` `isPackageManagedHookEntry` 整串 includes `hookGuardCommand(trigger)` | `:79-84` 精确命中 · 钉版后若只改命令串不扩识别 ⇒ verify 假红 | ✅ |
| 4 | `:183-193` `buildShellHookScript` 硬编码 `exec npx spec-wave hook-guard …` | `:183-195`：`:193` `exec npx spec-wave hook-guard --trigger pre-commit`（无 `@`） | ✅ |
| 5 | `src/host/materialize.ts:455-543` · `:466` / `:512` | `:455-543` hooks 编排；`:466` `buildShellHookScript(...)` · `:512` `mergeHookConfig(...)` | ✅ |
| 6 | `src/host/cmd.ts:53-54` `APPLY_USAGE` 无钉版旗标 | `:53-54` 仅 tools/profile/target/file/json/dry-run/yes | ✅ |
| 7 | `:235-262` `cmdHostApply` 解析后 `rest.length>0` 拒未知 | `:235-262` 精确命中 · `:262` 未知参数 fail | ✅ |
| 8 | `:129-140` `takeOptionalFlag` 须跟值 | `:129-140`：下一 token 缺或 `-` 开头 ⇒ fail「须跟值」· **不可**直接表达裸旗标 | ✅ |
| 9 | 手册 `docs/guides/使用手册-v3.0.0-zh.md:469-488` §7.3 | `:469` `### 7.3` · `:485-488` 已有 `--command` 钉版实践建议 · **尚无**物化旗标并列 | ✅ |
| 10 | acceptance §6.2 P2-2 `:367-372` | `:367-372` 事实/建议与 task 主源引用一致 | ✅ |
| 11 | `package.json` version=`3.0.0` · sticky `kit_semver` 字段存在 | `package.json:3` `"version": "3.0.0"` · `src/host/sticky.ts:19` `kit_semver?: string`（写入口 `:167`） | ✅ |
| 12 | `RELEASING.md` 现无钉版 CI 专建议 | `rg` 无 pin-hook / 预热缓存 / 钉版物化命中 | ✅ |

**提示级（非阻塞）**：PLAN 总表仅点 `materialize.ts`；task 正确再钉到 `hooks.ts` 命令串真值——30 以 task 挂点为准。

---

## 3. 开放问题 / 裁定指针

| # | 议题 | 裁定 |
|---|------|------|
| A | `host update` 是否同挂 `--pin-hook-version` | **默认建议与 apply 同挂并透传**（避免带旗标被静默忽略 · 硬约束 5 / F-W5-04）。若实现上 update 不走同一物化参数线程，**必须**在帮助明文「仅 apply 支持」并对未知旗标 **exit 1**（禁止吞掉） |
| B | 裸旗标解析形态 | **不可**复用 `takeOptionalFlag`（`:129-140` 强制跟值）。30 须新解析（`--pin-hook-version` / `=SEMVER` / 空值非法 exit 1）· 自证写明 |
| C | 缺省 semver 读源 | **钉死**：裸旗标缺省 = 当前包 `package.json#version`（与粘性写入之 `kit_semver` 同源口径 · 现值 `3.0.0`）；自证注明读点，避免「读粘性旧值」歧义 |
| D | wiki 是否晋升 | **本波不晋升**（`wiki_delta=none`）；关账留痕即可 |
| E | 是否启用条件评审闸 | **否** · 可选缺省关闭旗标 + 文档 · 无 schema/扫描面契约变更 |

---

## 4. 默认字节 / marker / 实验性文案锁面

本波最高风险 = **无旗标路径字节漂移**（与 W1 同型假红 · PLAN 风险 5）及 **钉版后 marker 未扩**（F-W5-03）。

| 检查 | 结论 |
|------|------|
| A1 无旗标 = 3.0.0 逐字节 | **PASS 条款** · 红测须先固化快照再实现 |
| A2 仅钉版段 diff | **PASS 条款** · 禁顺带改其他落点 |
| A3 / marker 双形态 | **PASS 条款** · `isPackageManagedHookEntry` + 产品条目生成同源 |
| A5 实验性 · 缺省关闭 | **PASS 条款** · 禁「默认钉版」措辞 |
| RELEASING 触 pins（硬约束 10） | **PASS** · A8 + F-W5-10 全量 `npm test` |

**提示级（给 30 · 非阻塞）**：实现前 `rg` 既有 hooks/host-adapt 测，确认无旗标期望字面不被改写；扩识别后补「未钉版仍识别」对称断言。

---

## 5. 发现的问题

- **FAIL / 内容阻塞：无（blocking = 0）**  
- **advisory（提示级）**：  
  1. update 挂面：同挂优先，否则帮助明示 + 拒静默（§3 A）  
  2. 裸旗标须新解析，禁复用 `takeOptionalFlag`（§3 B）  
  3. 缺省 semver 读 `package.json#version`（§3 C）  
  4. PLAN 仅点 materialize · task 已再钉 hooks.ts（§2）

---

## 结论

**R1 总结论：PASS · 零内容阻塞 · blocking=0 · 可进 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 → 30 开工。**

范围贴 PLAN W5；**不改默认物化** · 可选旗标 · 缺省=kit_semver · 帮助/CHANGELOG「实验性 · 缺省关闭」 · 无旗标与 3.0.0 逐字节一致 · marker/verify 绿 · 硬约束 3/5 边界清晰。行号 12 组全部精确命中。流程闸仍 pending，**禁止**本审附 30 可复制 Prompt。

---

## 维护者签闸（20 后 · 30 前）

> 本 task HG-TASK-DRAFT / HG-AUDIT-R1 由 **00 代签**（维护者 2026-09-18 授权过程文档闸 · task/PLAN 表在案）。HG-RELEASE / tag / push / publish **仍仅人**。

- [ ] 已读 R1 审查结论（含 §2 行号再钉 · §3 update/裸旗标/读源裁定 · §4 字节与 marker 锁面）
- [ ] 在 task 人工闸表将 **HG-TASK-DRAFT** 改为 approved（00 代签 · 日期）
- [ ] 在 task 人工闸表将 **HG-AUDIT-R1** 改为 approved（00 代签 · 日期 · status 格勿内嵌破坏解析的粗体）
- [ ] commit 过程文档（禁 `git add -A` · 不裹挟 `src/` 未授权改动）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；`HG-AUDIT-R1` 仍为 pending 时必须拒开工（见 `TEMPLATE_30_gate_stop.md`）。

---

**签名**：20 审查棒（20-task-audit · R1）· 2026-09-18 · 独立上下文非起草者 · 仅书面审查 · **未改被审 task / 未改实现码**。
