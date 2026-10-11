# 00 · 政策与边界（3.3 · AST opt-in）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-10-11 维护者签收）· 隶属 `3_3-graph-ast-opt-in` · 目标 `spec-wave@3.3.0`（minor）  
> **政策先例**：3.2 `00_policy` 钉「AST 另 Epic · 禁整包 cp · 不进默认 verify」——本版承接该另 Epic，纪律不变。

---

## 1. S2 禁区（过程域 · 永不覆写）

| 目录 | 纪律 |
|------|------|
| `docs/tasks/` | 只新增不覆写 |
| `docs/harness/reviews/` | 只新增不覆写 |
| `docs/harness/invokes/by-task/` | 只新增不覆写 |

本版命令**只读报告**图谱语料与源码 AST 探测结果；**禁止**自动「修复写回」`docs/_tech_graph` 真值或改写业务源码。

## 2. P0 门禁纪律

1. 判定走进程内机械逻辑（或显式子进程 probe）；符号/有界 call 类红档 **exit 2**。  
2. **禁止**新增 `--force` / `--allow-*` 绕过参数。  
3. 修严型变更须配负向 fixture（修复前真红、修复后转绿）。  
4. 人工闸只有写在 task 文 `### 人工闸` 节才可机检。  
5. **禁止**把本版 AST 闸默认绑进 `npx spec-wave verify`（除非后续独立 epic 人签另开——**本棒默认否**）。

## 3. 本版明确不做（非范围）

| 项 | 归属 |
|----|------|
| 整包移植消费仓 `tools/tech_graph/*.py` / `ast_symbol_probe.mjs` 原样进产品 | **禁止**；只抽最小通用语义（symbol + 有界 call） |
| **完整 callgraph** / 跨文件解析器级 call 证明 | **禁止**；对外不得夸大为 callgraph |
| 把 AST 默认塞进 `verify` 或改 3.2 drift / ib / indexes **缺省**语义 | **禁止** |
| indexes schema v2 / 与 meta `by_path_*`·`by_symbol_*` 同构 | **本棒排除**（除非维护者另示） |
| 七域 `DOMAIN_ORDER`、trilayer defer 政策目录布局抄入产品 | **禁止**；豁免/defer 若做须配置化且最小 |
| `graph_issue_sync` / 产品 diff 关账 / task `graph_delta` 方言 | **留消费仓** |
| completeness 硬编码 P0 模块集 / 边数阈值 | **留消费仓** |
| 强迫非 TS 仓安装 `typescript` peer | **禁止**；无 peer → skip 或清晰 usage |
| 强制所有仓写 `implementedBy.symbol` | **禁止**；无 IB / 无 symbol → 零打扰或跳过 |
| 自动重画 / 改写图谱语料 | **禁止**（只报告） |
| 自动 approved 任何 `HG-*` | **禁止** |
| 自定义本体类开放 / 图谱 UI | 沿用既有边界 |
| `npm publish` / `npm deprecate` | **仅人** |
| 宿主适配表 schema 变更 | 非本版 |

## 4. 对外文案纪律

- 新能力称：**opt-in AST 符号闸** / **有界 call 核对**（同文件引用 · 非完整 callgraph）。  
- **禁止**宣称「完整 callgraph」「一次接入替代消费仓全部 `graph:ast-check` 方言」「默认 verify 已含 AST」。  
- 手册必须区分：`graph drift`（边 + 模块表）· `graph ib check`（点 path）· `graph indexes check`（倒排 · opt-in）· `graph ast check`（符号 / 有界 call · opt-in）。  
- 未落地波次一律「规划中」。

## 5. 版本与 semver

- 本版为 **minor**：新增 opt-in 命令面 / 可选 peer 依赖策略；**不**改 3.2 既有命令 **缺省**判定松紧。  
- `nodes[].implementedBy` 仍为**可选**；AST 闸仅作用于「有 path 且需检 symbol/call 的节点」；无 IB 仓跑该命令 → **exit 0**（checked=0）或等价零打扰（实现波钉一种并测锁）。  
- 若实现波发现必须 bump `SCHEMA_VERSION` / 破坏既有 YAML 校验 → **STOP** · 另开 major 或人裁。

## 6. 流程边界

- 本棒（10-spec）只产出 SPEC + PLAN；**不改** `src/` / `bin/` / `assets/` / `test/`。  
- 后续：20-spec-audit（推荐）→ 人签 HG-SPEC-SIGNOFF + HG-NEXT-PLAN → 00 拆 task → 每波 20-task-audit → HG-AUDIT-R1 → 30/40。  
- 行号引用为起草快照；各波 10-task 须回源码与消费仓 probe 语义复核现值。  
- **禁止**修改 kimi-code-meta。

## 7. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| HG-SPEC-SIGNOFF | **approved**（2026-10-11 维护者 · 「授权00签收后续所有文档」） | 本夹定稿 / 开拆 task |
| HG-NEXT-PLAN | **approved**（同窗） | 开实现波 |

## 8. 修订

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | draft · 10-spec |
