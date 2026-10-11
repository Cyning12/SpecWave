# 02 · 产品方案（契约 · peer · 有界语义）

> **状态**：`draft` · 隶属 `3_3-graph-ast-opt-in`

---

## 1. 总览

| 轨 | 中文名 | 本版职责 | 对应波（见 04） |
|----|--------|----------|----------------|
| **A 契约/CLI 面** | 命令入口 · 跳过语义 · 信封 | `graph ast check` argv / exit / `--json`；peer 探测契约 | W1 |
| **B AST 实现** | symbol + 有界 call | 抽 meta A2/A3 最小语义；fixture 正负向 | W2 |
| **C 文档分责** | 手册 / MIGRATION 行 | drift / ib / indexes / **ast** 四行分责；禁夸大 | W3 |
| **D 发版** | 3.3.0 收口 | CHANGELOG · ACCEPTANCE · bump | W4 |

## 2. 轨 A · 命令与依赖策略

### 2.1 产品名（推荐）

```text
npx spec-wave graph ast check [--target PATH] [--input DIR] [--json]
```

| 规则 | 约定 |
|------|------|
| 与 3.2 分责 | path 存在仍由 `graph ib check`；本命令**不**替代 ib，可假设调用方已关心 path，或实现波选择「path 缺失时先报 ib 同类红 / 跳过」——须在 W1 task 钉一种并测锁 |
| 默认 verify | **不**注册进 `verify` 默认链 |
| `--json` | 经既有 `printJson` 信封；**只增不改**其它命令默认 stdout/exit |

### 2.2 TypeScript peer / 非 TS（零强迫）

| 场景 | 期望行为（意图钉 · W1 测锁一种） |
|------|----------------------------------|
| 无可用 `typescript`（或实现选定的解析 peer） | **skip**：exit 0 + stdout/JSON 标明 `skipped_reason=no_ts_peer`；**或** exit 1 清晰 usage（二选一钉死；推荐 **skip=0** 以免 CI 误伤非 TS 仓） |
| 目标文件扩展名非 TS/TSX（或无待检节点） | 跳过该文件/节点；全跳过 → exit 0 |
| peer 存在且有待检项 | 进入机械核对；红 → exit 2 |

**禁止**：把 `typescript` 列为强制 `dependencies` 以致非 TS 消费者安装失败；prefer `optionalDependencies` / `peerDependenciesMeta.optional` / 动态 `require` 探测（实现波选栈内既有惯例）。

### 2.3 与 IB 契约的关系（沿用 3.2）

```text
nodes:
  - id: N_entry
    label: Entry
    kind: phase          # 或 method|type 等；kind 枚举以实现波对齐图谱本体为准
    implementedBy:
      path: "src/cli.ts"
      symbol: "cmdVerify"   # 3.3 开始可被 ast check 核对（若存在且非 TBD）
```

| 规则 | 约定 |
|------|------|
| 无 `implementedBy` | 不计；零打扰 |
| path 空 / `TBD` | 跳过 |
| symbol 空 / `TBD` | **不做** symbol 红；有界 call 是否仍检以实现波钉（推荐：两端缺 symbol 则跳过该边） |
| 不强制写 symbol | 合法 |

## 3. 轨 B · AST 语义（从 meta 抽最小集）

> 灵感：消费仓 `ast_sync_check` A2 / A3；**禁止**整包移植。下列为产品意图钉，非源码行号契约。

### 3.1 Symbol 核对（≈ A2 切片）

| 项 | 约定 |
|----|------|
| 对象 | 有 `path` + 非空 `symbol` 的 IB 节点（kind 过滤由 W2 钉：至少覆盖 method/type；file/external 可跳过） |
| 绿 | 目标文件 AST 中存在同名声明 / export / 类成员（探测粒度对齐「可维护的最小证明」） |
| 红 | 文件存在但符号找不到 → exit 2 · kind 建议 `missing_ib_symbol` |
| 非范围 | 类型相容性、overload 全集、跨文件 re-export 深追（可二期；本版可不做） |

### 3.2 有界 call（≈ A3 切片 · 诚实有界）

| 项 | 约定 |
|----|------|
| 对象 | 图边两端节点均可检（method/type + 有效 path/symbol） |
| **同 path** | caller 文件 AST 须含对 callee symbol 的 Identifier / PropertyAccess 类引用；失败 → exit 2 · kind 建议 `missing_bounded_call` |
| **跨 path** | **不记红**；可在摘要中计 `cross_path_edges_inform=N`（可选） |
| 对外文案 | **有界 call ≠ 完整 callgraph**（强制） |
| defer/豁免 | 若做，须配置化（禁抄七域 defer 目录）；本版可裁到「不做 defer、仅红/绿」——W2 裁量并留痕 |

### 3.3 明确不做的 AST 深度（本版）

- 全项目 callgraph / 指向分析  
- 多语言（Python 等）AST  
- indexes `by_symbol_*` 双向深对齐（属 indexes 轨；本棒不扩 schema v2）  
- meta A4–A6 若存在的业务扩展规则  

## 4. 轨 C · 文档分责

手册保真表须扩为四行（在 3.2 三行基础上）：

| 层 | 命令 | 查什么 |
|----|------|--------|
| 边 + 模块表 | `graph drift` | 一级目录覆盖 · `edges[].anchors[].path` |
| 点 path | `graph ib check` | `nodes[].implementedBy.path` |
| 倒排 | `graph indexes check` | IB ↔ indexes 双向（opt-in） |
| 符号 / 有界 call | `graph ast check` | symbol 存在性 + 同文件有界引用（opt-in · **非** callgraph） |

## 5. 方案对比（摘要 · 详 R2）

| 方案 | 结论 |
|------|------|
| 整包 cp meta `ast_sync_check` + probe | **弃**：语言栈/七域/defer 政策绑死 |
| 把 AST 默并进 `verify` / `ib check` | **弃**：强迫非 TS；改 3.2 预期 |
| 仅文档「请自备 AST」 | **弃**：反哺 P4 已证可产品化最小切片 |
| opt-in `graph ast check` + peer 可跳过 + 有界语义钉死 | **推荐**（本 SPEC） |
| 顺带 indexes schema v2 | **弃（本棒）**：范围爆炸；维护者未另示 |

## 6. 修订

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | draft · 10-spec |
