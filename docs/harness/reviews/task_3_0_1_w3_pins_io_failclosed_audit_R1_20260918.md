# 审查文 · 3.0.1 W3 pins-io-failclosed task R1

> **hat**：20-task-audit（书面审查 · R1 · 独立上下文 · 非起草者）  
> **日期**：2026-09-18  
> **被审对象**：[`docs/tasks/active/task_3_0_1_w3_pins_io_failclosed.md`](../../tasks/active/task_3_0_1_w3_pins_io_failclosed.md)（slug `3-0-1-w3-pins-io-failclosed` · `draft` · 无独立 SPEC · HG-SPEC-SIGNOFF=N/A）  
> **对照基准**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（HG-NEXT-PLAN=approved · **W3 节** + 硬约束 **3/5**）· [`acceptance_3_0_0_specwave_20260918.md`](./acceptance_3_0_0_specwave_20260918.md) **§6.3 P3-8** · 10 invoke `docs/harness/invokes/by-task/3-0-1-w3-pins-io-failclosed/invoke_20260918_10_3-0-1-w3-pins-io-failclosed.md` · 先例形态 [`task_3_0_1_w2_gate_table_contract_audit_R1_20260918.md`](./task_3_0_1_w2_gate_table_contract_audit_R1_20260918.md)  
> **审查方式**：只读通读 task + PLAN W3/硬约束 3·5 + §6.3 P3-8；**独立再钉** `src/cli-pins.ts` `loadPins` / `readTruthVersion` 行号；`node bin/specgate.js task lint` → **LINT: PASS**；**未改被审 task 任何字节 · 未改 `src/`**。

---

## 结论摘要（内容闸 / 流程闸分列）

| 维度 | 结论 | 说明 |
|------|------|------|
| **内容闸**（范围 / 非范围 / 验收 / failure_paths / 思考轮 / 硬约束 3·5 / 回归锁面） | **PASS · 零内容阻塞** | 严格贴 PLAN W3；未扩 W4–W6/release；try/catch→exit 2+`PINS: BLOCKED` · TOCTOU · 三负向 · **缺文件原文案保留** · 不改 PASS/`pins fix`/其他 exit 均钉死 |
| **流程闸** | **pending（不由本帽签）** | `HG-TASK-DRAFT=pending` · `HG-AUDIT-R1=pending`（blocks 30）· HG-NEXT-PLAN 已 approved · HG-SPEC-SIGNOFF=N/A 正确 |
| **总结论** | **PASS** | 可进 00 代签过程闸 → 再下发 30；**本审查文不附 30 Prompt** |

---

## 1. 逐项核对（对照 PLAN W3）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 = PLAN W3 三条（try/catch 对齐 loadPins / TOCTOU / 三负向） | **PASS** | task §范围 ①–③ 与 PLAN W3·范围 1–3 逐条对应；④ 对称+基线不回退承接验收要点 |
| **try/catch → exit 2 + `PINS: BLOCKED`** | **PASS** | 范围① · A1/A3/A4 · F-W3-01/03；文案与 `loadPins` 前缀族对齐 |
| **TOCTOU**（existsSync ↔ 读取） | **PASS** | 范围②；与 P3-8 建议「可顺带收敛」一致 |
| **文件不存在原分支保留** | **PASS** | 范围② · 非范围「并入新分支改文案」· A5 · F-W3-02；对齐 PLAN W3 **风险**钉死 |
| **三负向**（截断 / chmod 000 / 冲突标记） | **PASS** | 范围③ · A1/A3/A4 · F-W3-03；硬约束 7 |
| **不改 pins check PASS / pins fix / 其他 exit** | **PASS** | 非范围表首三行 · A6/A7 · F-W3-05/06；不引入通用 IO 框架（F-W3-07） |
| A2 对称不回退（坏声明源） | **PASS** | 范围④ · A2 · F-W3-04；与报告 A2 对照 |
| 硬约束 **3**（patch 纪律门） | **PASS** | 非范围「触 schema / 改判定松紧 / 新增能力面」+ F-W3-08 STOP |
| 硬约束 **5**（不要静默） | **PASS** | IO 失败统一前缀可见；禁静默崩溃级 exit 1 归因错位 |
| 验收机械可判 | **PASS** | A1–A9：三负向 / 对称 / 缺文件 / 基线 / 非范围 / 四门 / 关账 |
| failure_paths | **PASS** | F-W3-00~12：闸拒 · 分类码 · 缺文件文案 · 三负向 · 对称 · PASS · fix/exit · IO 框架 · schema · 扩波 · 发布 · stage · 四门 |
| R0–R5 思考轮 | **PASS** | 控制表逐轮回填 · early_stop 全 no · residual_risks 三条真实（缺文件并入 / fixture 卫生 / 顺手改 PASS·fix） |
| 人工闸表形态 | **PASS** | **4 列** · id 无内嵌破坏解析的粗体 · HG-AUDIT-R1 pending blocks 30 · 00 代签授权在案（PLAN/task） |
| 与 §6.3 P3-8 主源对齐 | **PASS** | A1–A4 对照表 · 「信封统一、分类码不统一」定性 · 建议文案形态均承接 |
| `test_strategy=required` + 红测先行 | **PASS** | 元信息 note + §测试策略与 A1–A6 闭环 |
| 行为变更类 · 旧测影响面 | **PASS（等价锁面）** | 见 §4；字面「旧测 grep」未单列标题，**不退回** |
| task lint（流程核对 · 只读） | **PASS** | `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_w3_pins_io_failclosed.md` → `LINT: PASS` |
| 未扩 W4+ / release | **PASS** | 非范围 + F-W3-09/10；每波一 task |

---

## 2. 行号现值独立再钉（与 task 声明对照）

> 本棒 2026-09-18 只读实读工作树 `src/cli-pins.ts`；**全部精确命中 · 无阻塞级漂移**。

| # | task / PLAN / P3-8 声明 | 本棒现值 | 结果 |
|---|-------------------------|----------|------|
| 1 | `cli-pins.ts:62-83` `loadPins`（有 try/catch → exit 2 + `PINS: BLOCKED`） | `:62` `function loadPins` · `:68-72` try/`yamlLoad`/catch → `fail(..., 2)` · `:83` `return pins` | ✅ |
| 2 | `cli-pins.ts:85-91` `readTruthVersion` | `:85` `function readTruthVersion` · `:91` `return pkg.version` | ✅ |
| 3 | `:87` `existsSync` · 缺文件独立文案 | `:87` `if (!existsSync(abs)) fail('PINS: BLOCKED · 真值源缺失: package.json（exit 2）', 2)` | ✅ |
| 4 | `:88` 裸 `JSON.parse(readFileSync(...))`（无 try/catch · 本波挂点） | `:88` `const pkg = JSON.parse(readFileSync(abs, 'utf8')) as { version?: string }` · **未包裹** | ✅ |

**提示级（非阻塞）**：PLAN W3·范围 2 写「判存失败与读取失败合并为同一 fail-closed **分支**」；task/风险节已正确裁为「存在但不可读/不可解析」走新 catch，**缺文件仍单独文案**——与 PLAN **风险**钉死一致。30 勿把 `:87` 并入 catch 改文案。

---

## 3. 开放问题 / 裁定指针

| # | 议题 | 裁定 |
|---|------|------|
| A | TOCTOU 实现形态（先读再判 vs exists+try） | **实现自由 · 契约钉死**：缺文件原文案不变；存在但不可读/不可解析 → exit 2 + `PINS: BLOCKED` 前缀 |
| B | catch 文案用「或」还是「/」 | **采纳 task/PLAN**：`不可解析或不可读`（与 P3-8 建议「/」语义等价 · 非阻塞） |
| C | wiki 是否晋升「同类 IO 分类码统一」 | **本波不晋升**（`wiki_delta=none` 维持）；关账经验留痕即可，晋升归后续 00 |
| D | 是否启用条件评审闸（类 HG-W2-REVIEW） | **否** · 本波为单点分类码对齐 · 无扫描面/告警契约变更 |

---

## 4. 行为变更类 · 旧测影响面 / 等价回归锁

本波改 **`readTruthVersion` 坏真值源退出码/前缀**（exit 1→2 + `PINS: BLOCKED`），属行为 / 分类码变更。

| 检查 | 结论 |
|------|------|
| 字面「旧测 grep 影响面」独立验收项 | **未单列标题** |
| **等价回归锁面** | **具备** → **不退回** |

等价锁面映射：

- **三负向主回归** A1 / A3 / A4（截断 · chmod 000 · 冲突标记）  
- **对称不回退** A2  
- **缺文件原文案** A5  
- **基线 PASS** A6（`pins check` rc=0）  
- **非范围钉死** A7（fix / 其他 exit / IO 框架 / schema / 不扩波）  
- **四门** A8  

**提示级（给 30 · 非阻塞）**：实现前建议 `rg` 扫既有 `pins` / `readTruthVersion` / `cli-pins` 测，确认是否依赖「坏 package.json ⇒ exit 1」；新测须覆盖 A1–A6，不得仅靠旧测碰巧绿。

---

## 5. 发现的问题

- **FAIL / 内容阻塞：无（blocking = 0）**  
- **advisory（提示级）**：  
  1. TOCTOU 实现自由但缺文件文案契约钉死（§3 A）  
  2. 旧测 grep 未单列 → 等价锁面已够（§4）  
  3. wiki 晋升本波不做（§3 C）

---

## 结论

**R1 总结论：PASS · 零内容阻塞 · blocking=0 · 可进 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 → 30 开工。**

范围/非范围/验收/failure_paths/思考轮对齐 PLAN W3 与硬约束 3/5；`cli-pins.ts` 行号 4 组全部精确命中；**try/catch→exit 2+`PINS: BLOCKED` · TOCTOU · 三负向 · 缺文件原文案保留 · 不改 PASS/`pins fix`/其他 exit**均钉死。流程闸仍 pending，**禁止**本审附 30 可复制 Prompt。

---

## 维护者签闸（20 后 · 30 前）

> 本 task HG-TASK-DRAFT / HG-AUDIT-R1 由 **00 代签**（维护者 2026-09-18 授权过程文档闸 · task/PLAN 表在案）。HG-RELEASE / tag / push / publish **仍仅人**。

- [ ] 已读 R1 审查结论（含 §2 行号再钉 · §4 等价锁面）
- [ ] 在 task 人工闸表将 **HG-TASK-DRAFT** 改为 approved（00 代签 · 日期）
- [ ] 在 task 人工闸表将 **HG-AUDIT-R1** 改为 approved（00 代签 · 日期 · status 格勿内嵌破坏解析的粗体）
- [ ] commit 过程文档（禁 `git add -A` · 不裹挟 `src/` 未授权改动）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；`HG-AUDIT-R1` 仍为 pending 时必须拒开工（见 `TEMPLATE_30_gate_stop.md`）。

---

**签名**：20 审查棒（20-task-audit · R1）· 2026-09-18 · 独立上下文非起草者 · 仅书面审查 · **未改被审 task / 未改实现码**。
