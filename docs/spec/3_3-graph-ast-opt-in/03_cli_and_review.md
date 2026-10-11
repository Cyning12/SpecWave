# 03 · 命令面与失败路径

> **状态**：`draft` · 隶属 `3_3-graph-ast-opt-in`  
> **说明**：下列命令名为产品意图钉；argv / peer 探测细节以各波 task 复核 `src/cli-graph*.ts` 与包依赖面现值为准。

---

## 1. 命令面（拟新增）

### 1.1 AST 闸（W1 面 · W2 实现 · 核心）

```text
npx spec-wave graph ast check [--target PATH] [--input DIR] [--json]
```

| 行为 | 约定 |
|------|------|
| 扫描 | `--input`（缺省 `docs/_tech_graph`）下 `*.graph.yaml`（递归策略对齐 ib/drift） |
| 对象 | `nodes[].implementedBy` 中待检 symbol；符合条件的边做有界 call |
| 跳过 | 无 IB；path/symbol 空或 `TBD`；kind 不在可检集；非 TS 文件 |
| peer 缺失 | **skip**（推荐 exit 0 + `skipped_reason`）或 exit 1 usage——W1 钉一种 |
| 红 · symbol | 文件在但符号不在 AST → **exit 2** · `missing_ib_symbol` |
| 红 · 有界 call | 同 path 引用缺失 → **exit 2** · `missing_bounded_call` |
| 跨 path 边 | **不红**（可 Inform 计数） |
| 绿 | 无红项 → **exit 0**（含 checked=0 / skipped） |
| `--json` | 既有信封；列 issues / skipped / inform 计数 |
| 默认 verify | **不**自动调用 |

### 1.2 既有命令（不改默认语义）

```text
npx spec-wave graph drift …
npx spec-wave graph ib check …
npx spec-wave graph indexes check …
npx spec-wave graph yaml compile|export|check …
npx spec-wave graph scaffold …
npx spec-wave verify …
```

| 纪律 | 约定 |
|------|------|
| 缺省判定 | **不变**（3.2 语义冻结） |
| indexes | **不**借本版升 schema v2 |
| verify | **不**新增默认 AST 步 |

## 2. 审核 / 手册协议

手册（W3）须：

1. 更新保真分责表（四行 · 见 02 §4）。  
2. 专节标明：**有界 call ≠ 完整 callgraph**；跨文件边不红的理由。  
3. CI 样例：AST 步骤仅作**可选注释**或独立 job 示例；**禁止**写入默认硬门禁样例而不加说明。  
4. 非 TS 仓：写明 skip / usage 行为，避免「装了 kit 就必须装 typescript」误解。

## 3. 失败路径（可观测）

| 触发 | 系统行为 | 可重试 | 用户可见 |
|------|----------|--------|----------|
| symbol 在 path 对应 AST 中不存在 | exit 2 · 点名 node/path/symbol | 是（改码或改 YAML） | 是 / CI 红 |
| 同 path 有界 call 引用缺失 | exit 2 · 点名 edge/from/to | 是 | 是 / CI 红 |
| 跨 path 边 | exit 0（就该项）· 可选 inform 计数 | — | 摘要非红 |
| 无 TS peer | exit 0 skip（推荐）或 exit 1 usage | 是（安装 peer） | 明确原因 |
| 全无 IB / 全跳过 | exit 0 · checked=0 | — | 摘要 |
| path 文件不存在 | 实现波钉：跳过 / 或 `missing_ib_path` 同类红（推荐引导先跑 ib check） | 是 | 是 |
| `--json` 且有红项 | exit 2 · JSON 列差异 | 是 | 是 |
| 非 git 仓 | 沿用 `resolveTarget` fail 形态 | 是 | 是 |
| 试图写盘「修复」图谱或源码 | **禁止** | — | — |
| 改 3.2 drift/ib/indexes/yaml 缺省语义 | 打回 | 是 | 审查 / 测红 |
| 把 AST 塞进默认 verify | 打回（非范围） | — | — |
| 对外宣称完整 callgraph | 打回（文案纪律） | — | — |
| 并入 indexes schema v2 | 打回（本棒非范围） | — | — |
| 整包移植 / 七域硬编码 / issue-sync | 打回 | — | — |

## 4. Exit 码摘要

| 码 | 含义（本命令） |
|----|----------------|
| **0** | 绿；或合法 skip（无 peer / 无可检项 / checked=0） |
| **1** | usage / 参数错误（若 W1 选「无 peer → usage」则归此；与 skip=0 互斥） |
| **2** | 机械红（missing symbol / missing bounded call / 配置非法 fail-closed 等） |

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | draft · 10-spec |
