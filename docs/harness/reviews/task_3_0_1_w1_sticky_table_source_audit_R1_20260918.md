# 审查文 · 3.0.1 W1 sticky table_source task R1

> **hat**：20-task-audit（书面审查 · R1 · 独立上下文 · 非起草者）  
> **日期**：2026-09-18  
> **被审对象**：[`docs/tasks/active/task_3_0_1_w1_sticky_table_source.md`](../../tasks/active/task_3_0_1_w1_sticky_table_source.md)（slug `3-0-1-w1-sticky-table-source` · `draft` · 无独立 SPEC · HG-SPEC-SIGNOFF=N/A）  
> **对照基准**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（HG-NEXT-PLAN=approved · **W1 节** + 硬约束 **3/4/5**）· [`docs/harness/reviews/acceptance_3_0_0_specwave_20260918.md`](./acceptance_3_0_0_specwave_20260918.md) **§6.1 P1-1** · 10 invoke `docs/harness/invokes/by-task/3-0-1-w1-sticky-table-source/invoke_20260918_10_3-0-1-w1-sticky-table-source.md` · 先例形态 [`task_2_4_2_patch_audit_R1_20260915.md`](./task_2_4_2_patch_audit_R1_20260915.md)  
> **审查方式**：只读通读 task + PLAN W1/硬约束 + §6.1 P1-1；**独立再钉** `sticky.ts` / `cmd.ts` / `table.ts` 行号现值；可选跑 `node bin/specgate.js task lint`（**LINT: PASS**）；**未改被审 task 任何字节 · 未改 `src/`**。

---

## 结论摘要（内容闸 / 流程闸分列）

| 维度 | 结论 | 说明 |
|------|------|------|
| **内容闸**（范围 / 非范围 / 验收 / failure_paths / 思考轮 / 硬约束 4·5 / 回归锁面） | **PASS · 零内容阻塞** | 严格贴 PLAN W1；未扩 W2–W6/release；行为变更类具备**等价回归锁面**（见 §4） |
| **流程闸** | **pending（不由本帽签）** | `HG-TASK-DRAFT=pending` · `HG-AUDIT-R1=pending`（blocks 30）· HG-NEXT-PLAN 已 approved · HG-SPEC-SIGNOFF=N/A 正确 |
| **总结论** | **PASS** | 可进 00 代签过程闸 → 再下发 30；**本审查文不附 30 Prompt** |

---

## 1. 逐项核对（对照 PLAN W1）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 = PLAN W1 四条（类型+写盘 / verify 优先级 / fail-closed / 回归锁） | **PASS** | task §范围 ①–④ 与 PLAN W1·范围 1–4 逐条对应；主方案采纳修复建议①（粘性表源），弃仅 WARN 不修同源（R2） |
| 非范围封堵 W2–W6 / bump / schema / 物化字节 / 判定松紧 | **PASS** | 非范围表 13 行 + F-W1-06/07；硬约束 3（patch 纪律门）写进失败路径 |
| 硬约束 **4**（version=1 · 字段可选 · 双向兼容留证） | **PASS** | 范围① + A5/A6/A7 + F-W1-01；明示禁 bump version / 禁必填 |
| 硬约束 **5**（不静默 · fail-closed 点名） | **PASS** | 范围③ + A2 + F-W1-02；严禁静默退回内置 |
| 验收机械可判 | **PASS** | A1–A9：rc / 点名输出 / 四门 / gate-check / 禁 `git add -A` |
| failure_paths | **PASS** | F-W1-00~11 成表：闸拒 · 必填误实现 · 静默退回 · sha256 误硬红 · 路径基准 · `--file` 优先 · schema/扩范围 · 发布越权 · stage 纪律 · 四门/兼容 · 负向误绿 |
| R0–R5 思考轮 | **PASS** | 控制表逐轮回填 · early_stop 全 no · residual_risks 四条真实（含 sha256 / 路径基准 / 双向兼容兜底） |
| 人工闸表形态 | **PASS** | 4 列 · id 无内嵌 `**` · HG-AUDIT-R1 pending blocks 30 · 00 代签授权注记在案 |
| 与 §6.1 P1-1 主源对齐 | **PASS** | 三步复现 · over-report 定性 · 粘性不记表源根因 · 修复建议① 均承接；报告历史行号 `cmd.ts:62` 已由 PLAN/task 再钉为 verify `:652`（见 §2） |
| `test_strategy=required` + 红测先行 | **PASS** | 元信息 note + §测试策略五条与范围④/A1–A5 闭环 |
| task lint（流程核对 · 只读） | **PASS** | `node bin/specgate.js task lint --file …` → `LINT: PASS` |

---

## 2. 行号现值独立再钉（与 task 声明对照）

> 本棒 2026-09-18 只读实读工作树；**全部精确命中 · 无阻塞级漂移**。

| # | task / PLAN 声明 | 本棒现值 | 结果 |
|---|------------------|----------|------|
| 1 | `sticky.ts:8-14` `HostToolsSticky` 无表源 | `:8-14` 仅 `version/host_ids/profile/updated_at/kit_semver?` · **无** `table_source` | ✅ |
| 2 | `sticky.ts:28-81` `parseHostToolsSticky` | `:28` 起 · `:69-80` 组装返回 · 未知字段未写入类型（利于反向兼容留证） | ✅ |
| 3 | `sticky.ts:97-113` `writeHostToolsSticky` | `:97-113` 写盘 body 无表源 · `version: 1` 硬编码 | ✅ |
| 4 | `cmd.ts:62-74` `loadMergedTables` | `:62-74` 有 `--file` 则单表路径 · 否则 mergeUser | ✅ |
| 5 | `cmd.ts:363` apply 写粘性 | `:363` `writeHostToolsSticky(target, toolIds, profile)` | ✅ |
| 6 | `cmd.ts:548` update 写粘性 | `:548` 同形调用 | ✅ |
| 7 | `cmd.ts:634-635` verify `resolveValidateFile(fileArg)` | `:634-635` 缺省 → 内置表 abs | ✅ |
| 8 | `cmd.ts:652` `loadMergedTables(data, fileArg)` | `:652` 逐字命中 | ✅ |
| 9 | `cmd.ts:656` 粘性仅供 toolIds/profile | `:656` load · `:658-671` 消费 `host_ids`/`profile` · **不参与取表** | ✅ |
| 10 | `table.ts:99-102` `resolveValidateFile` | `:99-102` `fileArg` 缺省恒 `packageRoot()+DEFAULT_EXAMPLE_REL` | ✅ |

**提示级（非阻塞）**：验收报告 §6.1 根因句仍写历史锚点 `cmd.ts:62` / `:656`；PLAN 范围校核表与本 task 已重钉 verify 取表为 `:652`——**以 task/PLAN 现值为准**，30 勿回退到报告旧行号。

---

## 3. 开放问题书面裁定（供 00/30 执行）

### 3.1 PLAN W1 风险② · `sha256` 不符：WARN vs 硬红（★ 本波裁定）

**背景张力**：PLAN W1·范围 3 字面含「不可用/`sha256` 不符 ⇒ fail-closed」；同节**风险②**与硬约束叙事则要求「记哈希、默认只比存在性与路径，哈希不符**先 WARN**，升级硬红交评审」。task 范围③ / F-W1-03 / R2 已采风险②口径。

**R1 裁定（本波锁定 · 30 须遵守）**：

1. **路径不存在 / 不可读 / YAML 不可解析** → **硬红 exit 2**，输出须**点名粘性记录的表路径与原因** + 可操作建议（带 `--file` 或重新 `host apply`）。**严禁**静默退回内置。  
2. **路径存在且可解析，仅 `sha256` 与粘性记录不符** → **本波默认 WARN（非硬红）**；仍用该文件表源继续 verify（存在性/路径优先）。  
3. **本波不升级为硬红**。理由：硬红手改表会**新造一类 over-report**，与 P1-1「狼来了的门禁」同型腐蚀；P1-1 根因是**取错表**，不是「表内容漂移未锁哈希」。哈希仍须写入粘性供取证与日后评审升级。  
4. 若未来要升级硬红，须**另开 task / 评审**，不得在 W1 顺手收紧。

### 3.2 其余开放点（一并裁定）

| # | 议题 | 裁定 |
|---|------|------|
| A | 旧粘性无 `table_source` 时是否强制 WARN | **不强制**；允许可选提示。缺字段 ⇒ 走内置（同 3.0.0）；**不得**报错（A5 / F-W1-01） |
| B | 双向兼容「3.0.0 CLI 实测」本机无旧 tarball | **采纳** task residual_risks④：可用 `parseHostToolsSticky` / 旧解析语义等价留证，**须在自检/reviews 注明限制**；不得空过 A6 |
| C | `table_source` 形态 | 采纳 PLAN/task 建议：`{ kind:'builtin' }` \| `{ kind:'file', path:<相对仓根>, sha256:<hex> }`；相对路径基准 = `--target` 仓根（F-W1-04） |
| D | `--file` vs 粘性冲突 | **`--file` 最高优先**（A3 / F-W1-05）；不得被粘性覆盖 |

---

## 4. 行为变更类 · 旧测影响面 / 等价回归锁

本波改 **verify 默认取表策略** + **粘性写盘字段**，属行为变更类。

| 检查 | 结论 |
|------|------|
| 字面「旧测 grep 影响面」独立验收项 | **未单列标题** |
| **等价回归锁面**（用户本波审计口径允许） | **具备** → **不退回** |

等价锁面映射：

- **主回归** A1 / 范围④ · P1-1 三步第二步转绿  
- **对照锁** A2 · 表不可用硬红点名  
- **builtin 零回归** A4  
- **旧形态负向** A5 · 防必填误实现  
- **`--file` 优先** A3  
- **双向兼容** A6  
- **四门** A8  

**提示级（给 30 · 非阻塞）**：实现前建议 `rg` 扫既有 `test/host-adapt-sticky.test.ts` · `test/w2-host-verify.test.ts` · `test/host-adapt-update.test.ts` · `test/init.test.ts`（粘性形状断言）确认是否需同步扩展 fixture；**新测仍须覆盖 A1–A6**，不得仅依赖旧测碰巧绿。

---

## 5. 发现的问题

- **FAIL / 内容阻塞：无（blocking = 0）**  
- **advisory（提示级）**：  
  1. 报告 §6.1 历史行号 vs task 再钉（§2 末）  
  2. PLAN 范围 3 与风险②字面张力 → **已由本审 §3.1 裁定 WARN**  
  3. 旧测 grep 未单列标题 → 等价锁面已够；30 宜补扫既有 sticky/verify 测（§4）

---

## 结论

**R1 总结论：PASS · 零内容阻塞 · 可进 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 → 30 开工。**

范围/非范围/验收/failure_paths/思考轮对齐 PLAN W1 与硬约束 3/4/5；行号 10 组全部精确命中；行为变更具备等价回归锁面；**sha256 不符本波锁定 WARN（不硬红）**。流程闸仍 pending，**禁止**本审附 30 可复制 Prompt。

---

## 维护者签闸（20 后 · 30 前）

> 本 task HG-TASK-DRAFT / HG-AUDIT-R1 由 **00 代签**（维护者 2026-09-18 授权过程文档闸 · task 表在案）。HG-RELEASE / tag / push / publish **仍仅人**。

- [ ] 已读 R1 审查结论（含 §3.1 sha256=WARN 裁定与 §4 等价锁面）
- [ ] 在 task 人工闸表将 **HG-TASK-DRAFT** 改为 approved（00 代签 · 日期）
- [ ] 在 task 人工闸表将 **HG-AUDIT-R1** 改为 approved（00 代签 · 日期 · status 格勿内嵌破坏解析的粗体）
- [ ] commit 过程文档（禁 `git add -A` · 不裹挟 `src/` 未授权改动）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；`HG-AUDIT-R1=pending` 时必须拒开工（见 `TEMPLATE_30_gate_stop.md`）。

---

**签名**：20 审查棒（20-task-audit · R1）· 2026-09-18 · 独立上下文非起草者 · 仅书面审查 · **未改被审 task / 未改实现码**。
