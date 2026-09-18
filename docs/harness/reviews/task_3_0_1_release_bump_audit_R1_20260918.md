# 审查文 · 3.0.1 release-bump task R1

> **hat**：20-task-audit（书面审查 · R1 · 独立上下文 · 非起草者）  
> **日期**：2026-09-18  
> **被审对象**：[`docs/tasks/done/task_3_0_1_release_bump.md`](../../tasks/done/task_3_0_1_release_bump.md)（slug `3-0-1-release-bump` · `draft` · 无独立 SPEC · HG-SPEC-SIGNOFF=N/A）  
> **对照基准**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md)（**HG-NEXT-PLAN=approved** · **release 行** + **发布边界** + 硬约束 **10/12** · HG-RELEASE 仅人）· 10 invoke `docs/harness/invokes/by-task/3-0-1-release-bump/invoke_20260918_10_3-0-1-release-bump.md` · 先例 bump [`docs/tasks/done/task_2_4_2_patch.md`](../../tasks/done/task_2_4_2_patch.md) · [`ACCEPTANCE_2_4_2_patch_2_4_2_zh.md`](../../roadmap/ACCEPTANCE_2_4_2_patch_2_4_2_zh.md) · W7 HG-RELEASE `blocks=—` 裁定（[`task_3_0_w7_closeout_external.md`](../../tasks/done/task_3_0_w7_closeout_external.md)）· W1–W6 done 汇总面  
> **审查方式**：只读通读 task + PLAN release/发布边界/硬约束 10·12 + 先例 bump 九件套 + CHANGELOG Unreleased / MIGRATION 缺口 / 手册头栏；`node bin/specgate.js task lint` → **LINT: PASS**；**未改被审 task 任何字节 · 未改 `src/`**。

---

## 结论摘要（内容闸 / 流程闸分列）

| 维度 | 结论 | 说明 |
|------|------|------|
| **内容闸**（九件套 / pin-10 / 禁发布四动作 / W1–W6 汇总 / 手册钉 / HG-RELEASE blocks / failure_paths / 思考轮） | **PASS · 零内容阻塞** | 严格贴 PLAN release + 发布边界；簿记九件套齐全；pin-10 设计红口径正确；禁 tag/push/publish；CHANGELOG 骨架含 W1–W4 Fixed 归拢义务；手册默认保留文件名 |
| **流程闸** | **pending（不由本帽签）** | `HG-TASK-DRAFT=pending` · `HG-AUDIT-R1=pending`（blocks 30）· `HG-RELEASE=pending` 且 **`blocks_hats=—`（不拦 30）** · HG-NEXT-PLAN 已 approved · HG-SPEC-SIGNOFF=N/A 正确 |
| **总结论** | **PASS** | 可进 00 代签过程闸（HG-TASK-DRAFT + HG-AUDIT-R1）→ 再下发 30 簿记；**本审查文不附 30 Prompt** |

---

## 1. 逐项核对（对照 PLAN release + 发布边界 + 硬约束 10/12）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 = PLAN **release 行**（version · pins · CHANGELOG · ACCEPTANCE · 手册钉） | **PASS** | 范围①③②⑤⑥ 与 PLAN `:57` 一一对应；完成态同口径 |
| **发布边界** MIGRATION「3.0.0→3.0.1 无动作项」 | **PASS** | 范围⑧ · A7 · F-REL-12；PLAN `:198` 明示；本棒再钉 MIGRATION **仍无**该专节 |
| 硬约束 **10**（RELEASING 双重敏感 · 全量 npm test） | **PASS** | 范围⑦ · A6 · F-REL-05 · `test_strategy_note` |
| 硬约束 **12**（禁 Agent publish/tag/push） | **PASS** | 非范围首行 · A9 · F-REL-01/13 · 提交约定 |
| **HG-RELEASE** 仅人 · `blocks_hats=—` 不拦 30 | **PASS** | 闸表 + 说明块 · 沿 W7 00 裁定；与 PLAN `:179` 一致 |
| **pin-10 设计红**（`v3.0.1` 缺失可接受 · 打 tag 后 17/17） | **PASS** | 范围③ · A3 · F-REL-06/07 · 完成态「设计红留痕」 |
| **CHANGELOG 先于 pins fix**（防 pin-13） | **PASS** | 范围②「顺序硬约束」· F-REL-03 |
| **禁 `npm version`**（防顺手 tag） | **PASS** | 非范围 · F-REL-13 · A1「唯一手工点」 |
| **禁已 published 假叙事** | **PASS** | 范围②发布状态「待发版」· ④叙事巡检 · F-REL-04 · 非范围「回填待人 publish」 |
| W1–W6 **汇总面**入 CHANGELOG Fixed/Added | **PASS** | 范围②骨架：W1–W4 Fixed + W5/W6 Added；A2；本棒再钉 Unreleased **仅有** W5/W6（W1–W4 待归拢 · 义务已写清） |
| **手册钉策略**（默认保留文件名 + 头栏钉 3.0.1 待发版） | **PASS** | 范围⑥推荐/备选/禁止三档 · A5 · F-REL-11 |
| 硬约束 **3**（不改 W1–W6 行为 / 不触 schema） | **PASS** | 非范围 · F-REL-10 · A9 |
| 验收机械可判 | **PASS** | A1–A8 机检/diff · A9 非范围 · A10 关账 |
| failure_paths | **PASS** | F-REL-00~13：拒开工 · 发布四动作 · stage · 顺序 · 叙事 · 双重敏感 · pins 偏差 · pin-10 误判 · 断言联改 · 四门 · 行为返工 · 手册链 · MIGRATION · npm version |
| R0–R5 思考轮 | **PASS** | 控制表逐轮回填 · early_stop 全 no · residual_risks 五条真实（pin-10 / RELEASING / 手册改名 / W1–W4 归拢 / 转义断言） |
| 人工闸表形态 | **PASS** | **4 列** · id 单元格无内嵌破坏解析的粗体 · HG-AUDIT-R1 pending blocks 30 · HG-RELEASE blocks=— |
| `test_strategy=required` | **PASS** | 元信息 note + §测试策略 · 四门 + pins + RELEASING 全量 test（无新产品行为红测义务 · 说明充分） |
| 行为变更类 · 旧测 grep 影响面 | **N/A（簿记波）** | 本波不改产品行为；版本断言联改已钉 perl 双模式（F-REL-08） |
| task lint（流程核对 · 只读） | **PASS** | `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_1_release_bump.md` → `LINT: PASS` |
| 与 2.4.2 bump 先例对齐 | **PASS** | 手工 version → CHANGELOG 先行 → pins fix → 叙事/断言联改 → ACCEPTANCE/RELEASING；本版加手册钉 + MIGRATION 无动作项（PLAN 发布边界增量） |

---

## 2. 九件套完整性核对（①–⑨）

| # | 件套项 | task 落点 | 对照 | 结论 |
|---|--------|-----------|------|------|
| ① | `package.json#version` 手工 bump + lock | 范围① · A1 | PLAN release · 2.4.2 | **齐** |
| ② | CHANGELOG `## [3.0.1]`（先于 pins · 待发版 · W1–W6） | 范围② · A2 | PLAN · 2.4.2 | **齐** |
| ③ | `pins fix --yes` · 仅 pin-10 设计红 | 范围③ · A3 | PLAN · 2.4.2 | **齐** |
| ④ | 叙事漂移巡检 + 版本断言联改 | 范围④ · F-REL-04/08 | 2.4.2/2.3 经验 | **齐** |
| ⑤ | ACCEPTANCE_3_0_1 档（± spec 索引） | 范围⑤ · A4 | PLAN · ACCEPTANCE_2_4_2 模板 | **齐** |
| ⑥ | 使用手册版本钉（保留文件名优先） | 范围⑥ · A5 | PLAN release「手册钉同步」 | **齐** |
| ⑦ | RELEASING 台账 + 人 checklist · 全量 test | 范围⑦ · A6 | 硬约束 10 · 2.4.2 | **齐** |
| ⑧ | MIGRATION「无强制动作项」短节 | 范围⑧ · A7 | PLAN 发布边界 | **齐** |
| ⑨ | 四门 + gate-check / close / 独立 chore commit | 范围⑨ · A8/A10 | 2.4.2 · 硬约束 8 同族 | **齐** |

**blocking 缺口：无。** PLAN release 行未逐字列出 ④⑦⑧，但 ⑧ 属发布边界硬要求、⑦ 属硬约束 10、④ 属先例防假叙事——task 扩写合理，非越界。

---

## 3. 独立再钉（工作树只读 · 2026-09-18）

| # | 声明 | 本棒现值 | 结果 |
|---|------|----------|------|
| 1 | `package.json#version` 仍 `3.0.0` | `"version": "3.0.0"` | ✅ 基线正确 |
| 2 | CHANGELOG Unreleased 仅 W5/W6 · W1–W4 Fixed 待归拢 | `:5-10` Added 仅 W6/W5 两条 · **无** W1–W4 Fixed | ✅ 与 R0/范围②一致 |
| 3 | MIGRATION 缺「3.0.0→3.0.1 无动作项」 | `rg` 无命中「3.0.0.*3.0.1 / 无强制 / 无动作」 | ✅ ⑧ 确有必要 |
| 4 | 手册文件名钉 v3.0.0 · 头栏仍 3.0.0 published | `docs/guides/使用手册-v3.0.0-zh.md` 存在 · 头栏 `:3` `spec-wave@3.0.0`（已 published 叙事） | ✅ ⑥ 策略对症 |
| 5 | W1–W6 done 均在 | `docs/tasks/done/task_3_0_1_w{1..6}_*.md` ×6 · 状态 `done` | ✅ 汇总源可取 |
| 6 | PLAN HG-NEXT-PLAN=approved · HG-RELEASE 仅人 | PLAN 头栏 + `:179` / `:196-198` | ✅ |
| 7 | HG-RELEASE `blocks=—` 先例 | W7 task 闸表 + 裁定块 | ✅ 本 task 同构正确 |

**提示级（非阻塞）**：部分 W 波 done 头栏仍写「未 commit」——属工作树过程态；release 以 **done + CLOSE 语义** 为汇总源即可。30 归拢 CHANGELOG 时以 done task 验收句为准，勿臆造 Fixed 文案。

---

## 4. pin-10 / 发布禁令 / 手册策略（重点复核）

| 检查 | 结论 |
|------|------|
| pin-10 = **唯一**可接受 pins 红 · 留痕 · 勿冒充 17/17 | **PASS 条款** · A3/A8 · F-REL-06/07 |
| Agent **禁** tag / push / publish / deprecate | **PASS** · 非范围 · A9 · F-REL-01 · HG-RELEASE |
| HG-RELEASE **不**写入 `blocks_hats=30` | **PASS** · 闸表 `—` · 说明块明示 30 可簿记 |
| 手册：**推荐**保留 `使用手册-v3.0.0-zh.md` + 头栏钉 `@3.0.1（待发版）` | **PASS** · 少链漂移合理 |
| 手册：**备选**改名须 POINTER + 入站链 + check-doc-links | **PASS** · F-REL-11 |
| 手册：**禁止**待发版写成已 published / 为改名改产品行为文案 | **PASS** |

---

## 5. 发现的问题

- **FAIL / 内容阻塞：无（blocking = 0）**  
- **advisory（提示级 · 不退回 10-task）**：  
  1. 30 写 CHANGELOG 时必须把 Unreleased 的 W5/W6 **与** W1–W4 Fixed 摘要一并迁入 `## [3.0.1]`（A2 · residual ④）  
  2. 默认走「保留手册文件名」；若 00 裁定改名，先列入站链清单再 `git mv`  
  3. RELEASING 改后**不得**只跑子集 test（F-REL-05）  
  4. W 波若尚未合入同一 bump 基线，00 代签前确认 working tree 含 W1–W6 交付面（过程提示 · 非 task 内容缺陷）

---

## 结论

**R1 总结论：PASS · 零内容阻塞 · blocking=0 · 可进 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1 → 30 簿记开工。**

九件套完整；pin-10 设计红与禁发布四动作口径正确；HG-RELEASE `blocks=—` 与 W7/PLAN 一致；手册钉策略可执行；W1–W6 汇总义务写清。流程闸仍 pending，**禁止**本审附 30 可复制 Prompt。

---

## 维护者签闸（20 后 · 30 前）

> 本 task HG-TASK-DRAFT / HG-AUDIT-R1 由 **00 代签**（维护者 2026-09-18 授权过程文档闸 · task/PLAN 表在案）。**HG-RELEASE / tag / push / publish 仍仅人**（不在过程闸授权范围）。

- [ ] 已读 R1 审查结论（含 §2 九件套 · §3 再钉 · §4 pin-10/手册）
- [ ] 在 task 人工闸表将 **HG-TASK-DRAFT** 改为 approved（00 代签 · 日期）
- [ ] 在 task 人工闸表将 **HG-AUDIT-R1** 改为 approved（00 代签 · 日期 · status 格勿内嵌破坏解析的粗体）
- [ ] **勿**代签 HG-RELEASE（仅人 · 发布动作）
- [ ] commit 过程文档（禁 `git add -A` · 不裹挟未授权 `src/`）
- [ ] 再下发 Harness 30 Prompt（簿记 bump · 非 publish）

30 Agent 将以 task 表为准；`HG-AUDIT-R1` 仍为 pending 时必须拒开工（见 `TEMPLATE_30_gate_stop.md`）。HG-RELEASE=pending **不**构成 30 拒开工理由（`blocks_hats=—`）。

---

**签名**：20 审查棒（20-task-audit · R1）· 2026-09-18 · 独立上下文非起草者 · 仅书面审查 · **未改被审 task / 未改实现码 · 未附 30 Prompt · 未 tag/push/publish**。
