# 审查文 · 3.0.1 W2 gate-table-contract task R1

> **hat**：20-task-audit（书面审查 · R1 · 独立上下文 · 非起草者）  
> **日期**：2026-09-18  
> **被审对象**：[`docs/tasks/done/task_3_0_1_w2_gate_table_contract.md`](../../tasks/done/task_3_0_1_w2_gate_table_contract.md)（slug `3-0-1-w2-gate-table-contract` · 关账后路径 · 审时为 `active/` · `draft` · 无独立 SPEC · HG-SPEC-SIGNOFF=N/A）  
> **对照基准**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（HG-NEXT-PLAN=approved · **W2 节** + 硬约束 **3/5** + HG-W2-REVIEW）· [`acceptance_3_0_0_specwave_20260918.md`](./acceptance_3_0_0_specwave_20260918.md) **§5.6 / §6.2 P2-4** · 10 invoke `docs/harness/invokes/by-task/3-0-1-w2-gate-table-contract/invoke_20260918_10_3-0-1-w2-gate-table-contract.md` · 先例形态 [`task_3_0_1_w1_sticky_table_source_audit_R1_20260918.md`](./task_3_0_1_w1_sticky_table_source_audit_R1_20260918.md)  
> **姊妹产出**：契约评审 [`w2_gate_parse_warning_contract_review_20260918.md`](./w2_gate_parse_warning_contract_review_20260918.md)（HG-W2-REVIEW）  
> **审查方式**：只读通读 task + PLAN W2/硬约束 + §5.6/P2-4；**独立再钉** README / TASK_TEMPLATE / `cli-shared` 行号；`node bin/specgate.js task lint` → **LINT: PASS**；**未改被审 task 任何字节 · 未改 `src/`**。

---

## 结论摘要（内容闸 / 流程闸分列）

| 维度 | 结论 | 说明 |
|------|------|------|
| **内容闸**（范围 / 非范围 / 验收 / failure_paths / 思考轮 / 硬约束 3·5 / 回归锁面） | **PASS · 零内容阻塞** | 严格贴 PLAN W2；未扩 W3–W6/release；**不放宽** `GATE_ROW_RE`；exit/`evaluateMayStart30` 钉死；告警通道与样例入测齐备 |
| **流程闸** | **pending（不由本帽签）** | `HG-TASK-DRAFT=pending` · `HG-AUDIT-R1=pending`（blocks 30）· `HG-W2-REVIEW=pending`（blocks 30 · 条件闸 · 评审文已落盘）· HG-NEXT-PLAN 已 approved · HG-SPEC-SIGNOFF=N/A 正确 |
| **总结论** | **PASS** | 可进 00 代签过程闸（含 HG-W2-REVIEW）→ 再下发 30；**本审查文不附 30 Prompt** |

---

## 1. 逐项核对（对照 PLAN W2）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 = PLAN W2 四条（README 4 列+提示 / 空解析告警 / id 内嵌 `**` / 回归锁） | **PASS** | task §范围 ①–④ 与 PLAN W2·范围 1–4 逐条对应；主方案 = 改文档 + 告警，**弃**放宽正则 |
| 非范围封堵放宽正则 / 改判定 / W3+ / bump / schema | **PASS** | 非范围表 + F-W2-01/08/09；硬约束 3 写入失败路径 |
| 硬约束 **3**（patch 纪律门） | **PASS** | 非范围「触 schema / 改判定松紧 / 新增能力面」+ F-W2-08 STOP |
| 硬约束 **5**（不要静默） | **PASS** | 范围② 空解析告警 + A2；禁静默忽略闸表 |
| **不放宽 `GATE_ROW_RE`** | **PASS** | 非范围首行 · A7 · F-W2-01；与报告「改实现」备选对立并显式不采纳 |
| **exit 语义不变** · 不改 `evaluateMayStart30` | **PASS** | 范围② · A2/A7 · F-W2-03；非范围「改判定」 |
| 告警走 **stderr** / `--json#warnings`（只增不改） | **PASS** | 范围② · A2 · F-W2-02；细节由契约评审文裁定（见姊妹产出） |
| **id 内嵌 `**` 子形态** | **PASS** | 范围③ · A4 · F-W2-05；文档+告警并列+负向测三件套 |
| **样例入测**（README×2 + TASK_TEMPLATE 逐字喂解析器） | **PASS** | 范围④ · A5 · F-W2-04；对齐 PLAN「表写了 ≠ 表被解析必须入测」 |
| 验收机械可判 | **PASS** | A1–A9：文档 / 告警 / A/B / 子形态 / 样例 / 存量 / 硬约束 / 四门 / 关账 |
| failure_paths | **PASS** | F-W2-00~12：双闸拒 · 放宽正则 · JSON 污染 · exit · 样例漏测 · 子形态 · 存量漂移 · 术语 · schema · 扩波 · 发布越权 · stage · 四门 |
| R0–R5 思考轮 | **PASS** | 控制表逐轮回填 · early_stop 全 no · residual_risks 四条真实（JSON 污染 / 术语 / 样例漏测 / 双闸遗漏） |
| 人工闸表形态 | **PASS** | **4 列** · id 无内嵌破坏解析的粗体 · HG-AUDIT-R1 + HG-W2-REVIEW 均 pending blocks 30 · 00 代签授权在案 |
| 与 §5.6 / P2-4 主源对齐 | **PASS** | A/B 3 列 vs 4 列 · 误导理由 · 文档陷阱定性 · 子形态内嵌 `**` 均承接 |
| `test_strategy=required` + 红测先行 | **PASS** | 元信息 note + §测试策略与范围④/A1–A6 闭环 |
| 行为变更类 · 旧测影响面 | **PASS（等价锁面）** | 见 §4；字面「旧测 grep」未单列标题，**不退回** |
| task lint（流程核对 · 只读） | **PASS** | `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w2_gate_table_contract.md` → `LINT: PASS` |
| HG-W2-REVIEW 启用理由 | **PASS** | 触及空解析告警契约 + 样例入测；条件闸正当；评审文已另落盘 |

---

## 2. 行号现值独立再钉（与 task 声明对照）

> 本棒 2026-09-18 只读实读工作树；**全部精确命中 · 无阻塞级漂移**。

| # | task / PLAN 声明 | 本棒现值 | 结果 |
|---|------------------|----------|------|
| 1 | `README.md:98` 最小骨架 `### 人工闸` | `:98` `### 人工闸` · `:99` 表头 **3 列**（无 `说明`）· `:100` 样例行 | ✅ |
| 2 | `README.zh-CN.md:98` 同形 | `:98`–`:100` 同为 **3 列**骨架 | ✅ |
| 3 | `TASK_TEMPLATE.md:41` 正确 4 列 | `:41` 表头含 `说明` · `:42` 分隔行 · `:43-44` 样例闸行 | ✅ |
| 4 | `cli-shared.ts:25-26` `GATE_ROW_RE` | `:25-26` 四单元格 · id 组 `([^*|]+?)` **排除 `*`** | ✅ |
| 5 | `cli-shared.ts:270-286` `parseHumanGates` | `:270` 起 · `:271` `extractSection` · `:272` 无节 return [] · `:285` return gates · **空解析无告警** | ✅ |

**提示级（非阻塞）**：`evaluateMayStart30` 位于同文件 `:300` 起（task 非范围已点名「不改」· 未要求钉行号）——30 勿顺手改判定。

---

## 3. 开放问题 / 裁定指针

| # | 议题 | 裁定 |
|---|------|------|
| A | 空解析告警通道（stderr vs JSON） | **见契约评审文** [`w2_gate_parse_warning_contract_review_20260918.md`](./w2_gate_parse_warning_contract_review_20260918.md) §2 C1–C5：人读 stderr；`--json` 只增 `warnings[]`；不污染 stdout；非 breaking |
| B | 是否构成契约变更 → HG-W2-REVIEW | **是 · additive observability** · 评审文已可支撑 00 代签 |
| C | wiki 是否晋升「样例入测 / id 禁内嵌粗体」 | **本波不晋升**（`wiki_delta=none` 维持）；关账经验总结留痕即可，晋升归后续 00 波次 |
| D | `parseHumanGates` API 形态（副作用 vs 返回 warnings） | **实现自由 · 契约约束输出通道**；不得以 API 重构为名改判定 |

---

## 4. 行为变更类 · 旧测影响面 / 等价回归锁

本波改 **空解析可见性** + **README 样例列数**，属轻度行为 / 文档契约变更。

| 检查 | 结论 |
|------|------|
| 字面「旧测 grep 影响面」独立验收项 | **未单列标题** |
| **等价回归锁面** | **具备** → **不退回** |

等价锁面映射：

- **A/B 主回归** A3 · 3 列告警 / 4 列无告警+may_start  
- **子形态负向** A4  
- **样例入测** A5（README 非空 · 模板 ≥1）  
- **存量零变化** A6  
- **硬约束钉死** A7（正则 / 判定 / schema / 不扩波）  
- **四门** A8  

**提示级（给 30 · 非阻塞）**：实现前建议 `rg` 扫既有闸解析 / `status` / `gate-check` 测，确认 fixtures 是否依赖「静默空表」；新测须覆盖 A1–A6，不得仅靠旧测碰巧绿。

---

## 5. 发现的问题

- **FAIL / 内容阻塞：无（blocking = 0）**  
- **advisory（提示级）**：  
  1. 契约通道细节以姊妹评审文为准（§3 A）  
  2. 旧测 grep 未单列 → 等价锁面已够（§4）  
  3. wiki 晋升本波不做（§3 C）

---

## 结论

**R1 总结论：PASS · 零内容阻塞 · blocking=0 · 可进 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 + HG-W2-REVIEW → 30 开工。**

范围/非范围/验收/failure_paths/思考轮对齐 PLAN W2 与硬约束 3/5；行号 5 组全部精确命中；**不放宽正则 · exit/判定不变 · 告警 stderr/`warnings` · id 内嵌子形态 · 样例入测**均钉死。流程闸仍 pending，**禁止**本审附 30 可复制 Prompt。

---

## 维护者签闸（20 后 · 30 前）

> 本 task HG-TASK-DRAFT / HG-AUDIT-R1 / HG-W2-REVIEW 由 **00 代签**（维护者 2026-09-18 授权过程文档闸 · task 表在案）。HG-RELEASE / tag / push / publish **仍仅人**。

- [ ] 已读 R1 审查结论（含 §2 行号再钉 · §4 等价锁面）
- [ ] 已读契约评审 [`w2_gate_parse_warning_contract_review_20260918.md`](./w2_gate_parse_warning_contract_review_20260918.md)（通道 C1–C8）
- [ ] 在 task 人工闸表将 **HG-TASK-DRAFT** 改为 approved（00 代签 · 日期）
- [ ] 在 task 人工闸表将 **HG-AUDIT-R1** 改为 approved（00 代签 · 日期 · status 格勿内嵌破坏解析的粗体）
- [ ] 在 task 人工闸表将 **HG-W2-REVIEW** 改为 approved（00 代签 · 日期 · 须评审文已落盘）
- [ ] commit 过程文档（禁 `git add -A` · 不裹挟 `src/` 未授权改动）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；`HG-AUDIT-R1` 或 `HG-W2-REVIEW` 仍为 pending 时必须拒开工（见 `TEMPLATE_30_gate_stop.md`）。

---

**签名**：20 审查棒（20-task-audit · R1）· 2026-09-18 · 独立上下文非起草者 · 仅书面审查 · **未改被审 task / 未改实现码**。
