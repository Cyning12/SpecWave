# 01 · 问题与目标

> **状态**：`draft` · 隶属 `3_3-graph-ast-opt-in`

---

## 1. 问题陈述

3.2 已交付 `graph ib check`（点 **path** 存在）· `struct_rel` · opt-in `graph indexes check`。业务仓反哺备忘（2026-10-11 §11）复查结论：

| # | 痛点 | 后果 |
|---|------|------|
| P1 | **符号未证**：IB 可写 `symbol`，3.2 只透传不校验；假 export / 改名后 path 仍在 → ib check 仍绿 | 图谱「挂了符号名」却与源码脱节 |
| P2 | **有界 call 缺口**：flow 边两端为 method/type 时，同文件引用失败在 meta 可红；SpecWave 无闸 | 消费仓须自备 `ast_sync_check` A3 切片 |
| P3 | **peer 强迫风险**：若把 AST 默认进 core/`verify`，非 TS 仓被迫装 `typescript` | 违背「可选深度」反哺原则 |
| P4 | **能力夸大风险**：meta A3 明确「跨 path ≠ AST call」；若对外写成 callgraph 会误导签收 | 信任债 |
| P5 | **indexes 线格式差距**（meta ≠ SW MVP） | 本棒**不**用 AST epic 顺带做 schema v2（另裁） |

本 SPEC **收窄**反哺范围：采纳备忘 **P4** 的通用语义（symbol + 有界 call · opt-in）；**明确不**并入 indexes schema v2、issue-sync、业务 completeness、七域硬编码、完整 callgraph。

## 2. 完成态行为（消费者可观察）

接入 SpecWave ≥3.3 且维护者**显式**启用 AST 闸的业务仓：

1. **命令**：`npx spec-wave graph ast check`（名称见 03）可对 `--input` 下图语料中的 IB 做 AST 相关核对。  
2. **symbol**：对声明了 `implementedBy.symbol`（及实现波钉定的 kind 规则）的节点，在对应 `path` 的 TS AST 中核对声明/导出/类成员存在；缺失 → **exit 2** · 差异可 `--json`。  
3. **有界 call**：对符合条件的边（两端均为可检的 method/type 类节点 · 细节见 02），**同 path** 时 caller 文件须含对 callee 的 Identifier/PropertyAccess 类引用；失败 → **exit 2**。**跨 path** → **不记红**（Inform/计数即可 · 诚实有界 · **≠** 完整 callgraph）。  
4. **零强迫**：未安装可用 TS 解析 peer、或目标非 TS 语料 → **skip**（exit 0 + 明确摘要）或 **清晰 usage**（exit 1）——实现波钉一种主路径并测锁；**禁止**静默假绿后假装已检。  
5. **零打扰**：无任何 IB / 无可检 symbol 的仓跑该命令 → **exit 0**（checked=0 或等价）。  
6. **不进默认 verify**：`npx spec-wave verify` **不**自动调用 AST 闸。  
7. **既有命令**：`graph drift` / `graph ib check` / `graph indexes check` / `graph yaml *` / `graph scaffold` 缺省 stdout/exit 语义不变。

## 3. 成功判据（产品级）

| 角色 | 成功长什么样 |
|------|----------------|
| TS trilayer 消费仓维护者 | 可不靠本地 A2/A3 全套方言检出「假 symbol」与「同文件假 call 边」；仍知跨文件有界 |
| 非 TS / 无 peer 仓维护者 | 不装 typescript → 无新强制红、无安装胁迫 |
| 普通无 IB 仓 | 跑 ast check → 绿且无新义务 |
| 审查人 / CI | AST 显式 opt-in 接线；手册无 callgraph 夸大 |
| kit 维护者 | 无 Python 整包进仓；indexes v2 / 关账链未偷运 |

## 4. 非目标（再强调）

- 不做完整跨文件 callgraph / 类型系统级解析证明。  
- 不做 indexes schema v2。  
- 不做 issue / 产品 diff 关账。  
- 不强制所有仓写 symbol。  
- 不自动重画图谱。  
- 不把 AST 并进默认 `verify`。  
- 不修改 3.2 已签收验收叙事为「本就含 AST」。  

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | draft · 10-spec |
