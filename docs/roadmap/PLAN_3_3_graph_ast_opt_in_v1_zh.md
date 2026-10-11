# 规划 · 3.3.0 · 图谱 AST 闸（opt-in · symbol / 有界 call）

> **状态**：`approved` · **IMPLEMENTED · 待发版**（W1–W4 簿记已落 · bump `3.3.0` · tag/push/publish 仅人）· **HG-NEXT-PLAN=approved**（2026-10-11 维护者本窗签收 · 原文「授权00签收后续所有文档」）  
> **目标发版**：`spec-wave@3.3.0`（**minor** · 消费者可观察新能力 · registry `latest` 仍为 `3.2.0` 直至人 publish）  
> **基线**：`spec-wave@3.2.0`（ib check / struct_rel / indexes check MVP · **已 published**）  
 
> **配套 SPEC**：[`../spec/3_3-graph-ast-opt-in/`](../spec/3_3-graph-ast-opt-in/README.md)（**HG-SPEC-SIGNOFF=approved** · 同窗）  
> **格式模板**：[`PLAN_3_2_graph_ib_and_indexes_v1_zh.md`](./PLAN_3_2_graph_ib_and_indexes_v1_zh.md)（结构骨架沿用）  
> **反哺来源**：kimi-code-meta · `BACKPORT_tech_graph_tools_to_specwave_v1_zh.md`（§5 P4 · §11）  
> **00 派发**：[`../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_s0_dispatch_10_spec.md`](../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_s0_dispatch_10_spec.md)  
> **起草日期**：2026-10-11

---

## 一句话

在 3.2 点 path / opt-in indexes 之上，以 **opt-in** 交付 `graph ast check`（symbol 核对 + **有界 call**）；不进默认 `verify`；无 TS peer / 非 TS / 无 IB 零强迫；不整包移植消费仓 AST 工具，不并 indexes schema v2，不夸大 callgraph。

---

## 范围来源校核

| # | 项 | 级别 | 出处 | 入 3.3 结论 |
|---|----|------|------|-------------|
| 1 | opt-in `graph ast check` | 高 | 反哺 P4 · 00 派发默认范围 | ✅ **W1–W2** |
| 2 | symbol 核对（≈ A2 切片） | 高 | 反哺 P4 · meta γ | ✅ **W2** |
| 3 | 有界 call（同文件 · ≈ A3） | 高 | 反哺 P4 · 派发「有界 call」 | ✅ **W2** |
| 4 | 不进默认 `verify` | 高 | 3.2 政策先例 · 派发 | ✅ 硬约束 |
| 5 | 无 peer / 非 TS 零强迫 | 高 | 反哺原则 §4 · 派发 | ✅ **W1** 契约 |
| 6 | 无 IB 零打扰 | 高 | 3.2 零打扰纪律延伸 | ✅ |
| 7 | 文档分责（drift/ib/indexes/**ast**） | 中 | 反哺 §7/§9 · 3.2 W4 先例 | ✅ **W3** |
| 8 | bump 3.3.0 + ACCEPTANCE | 中 | minor 收口 | ✅ **W4** |
| 9 | 完整 callgraph / 跨文件 AST call 证明 | — | A3 诚实边界 | ❌ 禁止夸大 |
| 10 | indexes schema v2 | — | §11 差距 · 派发默认排除 | ❌ **另裁** |
| 11 | 整包 cp `tools/tech_graph` | — | 反哺原则 · 3.2 先例 | ❌ 禁止 |
| 12 | 七域硬编码 / issue-sync / completeness 业务阈值 | — | 反哺 §6 | ❌ 留消费仓 / 禁止进 core |
| 13 | 改 3.2 drift/ib/indexes/yaml 缺省语义 | — | 兼容纪律 | ❌ 禁止 |
| 14 | 自动重画图谱 / 自动人签 | — | 闸纪律 | ❌ 禁止 |

---

## 波次总表

| Wave | 主题 | 内容 | 级别 |
|------|------|------|------|
| **W0** | 签收 | SPEC/PLAN 审签 · 拆 task | 文档 |
| **W1** | **契约 / CLI 面** | 子命令注册 · peer/skip/usage · `--json` 信封 · 不进 verify | 契约 |
| **W2** | **AST 实现 + 测** | symbol + 有界 call · 正负向 fixture · 零回归 | 核心 |
| **W3** | 文档分责 | 手册四行分责 · 禁夸大 · 可选 CI 注释 | DX |
| **W4** | 收尾发版 | CHANGELOG · ACCEPTANCE · bump 3.3.0 | release |

**编排理由**：先锁 opt-in/peer/verify 边界（防强迫与假绿）→ 再填 AST 最小切片 → 文档收敛文案 → 发版。相对 3.2 的五波，本版无独立 struct_rel/indexes 实现波（已在 3.2），故收为 W0–W4。每波独立 task、独立提交、四门绿、禁 `git add -A`。

---

## W1 · 契约 / CLI 面（细节钉）

- **命令**：`graph ast check [--target] [--input] [--json]`  
- **peer**：可选；缺失 → skip(0)+reason **或** usage(1)（钉一种）  
- **verify**：不注册  
- **验收**：help 可见；行为测锁；既有命令零回归  

## W2 · AST 实现

- **symbol**：缺失 → exit 2 · `missing_ib_symbol`  
- **有界 call**：同 path 缺失引用 → exit 2；跨 path 不红  
- **绿**：含 checked=0 / 合法 skip  
- **验收**：正负向 + 跨 path fixture + 3.2 命令回归  

## W3 · 文档

- 保真分责表含 ast；专节有界 ≠ callgraph  
- 可选 sample workflow **注释** `graph ast check`  

## W4 · release

- bump `3.3.0` · pins · CHANGELOG · ACCEPTANCE · 索引行状态  
- tag/push/publish 按当次授权（publish 默认仅人）  

---

## 非范围（明确不做）

| 项 | 说明 |
|----|------|
| 完整 callgraph | 跨文件不红；禁夸大 |
| indexes schema v2 | 另 epic / 维护者另示 |
| issue-sync / task 关账链 | 消费仓方言 |
| 业务 completeness 阈值 / 七域硬编码 | 禁止进产品 |
| 整包 Python/JS 工具 | 反哺原则 |
| 改 3.2 命令缺省语义 | 兼容 |
| AST 默认进 verify | 政策 |
| 多语言 AST | 另裁 |
| 图谱 UI / 自定义本体开放 | 沿用既有边界 |

---

## 硬约束

1. S2 过程域永不覆写。  
2. 禁止新增 `--force` / `--allow-*` 绕过。  
3. 不改 3.2 `graph drift` / `graph ib check` / `graph indexes check` / `graph yaml *` **缺省**判定语义。  
4. AST 默认**不**绑进 `verify`。  
5. 修严/新闸配负向 fixture；跨 path 不红须有测。  
6. 闸须落 task `### 人工闸` 才可机检。  
7. 对外文案：有界 call ≠ 完整 callgraph。  
8. 本 PLAN 为意图钉；实现前 10-task 回源与反哺语义复核。  
9. **禁止**改 kimi-code-meta；**禁止** Agent 代签本表闸。  

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| HG-NEXT-PLAN | **approved**（2026-10-11 维护者 · 「授权00签收后续所有文档」） | 开 W1 实现 |
| HG-SPEC-SIGNOFF | **approved**（同窗 · 见 SPEC README） | 拆波 task |

**过程授权**：维护者授权本 epic 由 **00 签收后续所有过程文档**（各波 `HG-TASK-DRAFT` / `HG-AUDIT-R1` · 依据 lint + 20-task-audit R1）；release/publish 仍仅人。见 [`../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_epic_signoff.md`](../harness/invokes/by-task/3-3-graph-ast-opt-in/invoke_20261011_00_epic_signoff.md)。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | draft · 与 SPEC `3_3-graph-ast-opt-in` 同棒落盘 · 双闸 pending |
| 2026-10-11 | approved · HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved · 过程授权 00 签后续文档 · 开拆 W1 |
| 2026-10-11 | IMPLEMENTED · 待发版 · W1–W3 CLOSE · W4 bump 3.3.0 · HG-RELEASE-* pending |
