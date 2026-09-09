# F1 · S2 过程域真值源唯一化

> **状态**：`signed` · 隶属 `1x-mvp`  
> **feature_id**：`F1` / `F1.1`  
> **对齐**：X7 → R1 → V1 · 痛点 P1  
> **test_strategy**：`required`  
> **HG-SPEC-SIGNOFF**：跟随系列（**approved** · 2026-09-09 · 整包）  
> **上游**：高层架构 §2.2 P1 / §6.3 F1 · 系统设计 §3.2.M7 / O-08

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **spec_slug** | `1x-mvp/F1_s2_truth_source` |
| **freeze_id（草案）** | 共享常量名建议 `S2_TRUTH_PREFIXES`；落点 `src/cli-shared.ts`；语义「永不覆写」不变 |
| **depends_on** | 无 |
| **blocks** | F2（门禁结论一致率）、部分 F4/F5 回归 |

---

## 1. 背景与目标

「永不覆写 S2」是 kit 硬约束，但实现分裂为 **4 份互不一致硬编码**：

| 锚点 | 形态（现状） |
|------|----------------|
| `src/index.ts:13` | 3 项裸形态：`docs/tasks` / `reviews` / `invokes/by-task` |
| `src/cli-refresh-ide-blocks.ts:299` | regex：`docs/(tasks\|harness/reviews\|harness/invokes/by-task)` |
| `src/cli-graph-hgm.ts:367` | 5 项并集（含带/不带 `docs/harness` 前缀） |
| `src/cli-skills.ts:272-283` | 路径后缀/包含判定 + 额外白名单语义 |

**一句话目标**：收敛为 **1 份共享常量 + 统一判定函数**，使跨命令对同一路径的「是否 S2」结论一致率 **100%**。

**完成态行为**

1. 仅一处定义 S2 前缀真值；其余模块 `import`，禁止本地再硬编码等价列表。  
2. `check` / `verify` / `gate-check` / `audit` / `init` / `upgrade` / `sync prompts` / `skills *` / `refresh-ide-blocks` / HGM axioms 对同一相对路径判定一致。  
3. 命中 S2 时行为仍为 **拒写 / 跳过覆写**，并显式提示（语义不削弱）。  
4. 自动化测试覆盖：共享常量唯一性扫描 + 跨命令同路径矩阵。

---

## 2. 范围

### 2.1 In

- 抽取 `S2_TRUTH_PREFIXES`（或等价名）与 `isS2Path` / `assertNotS2` 到公共模块  
- 替换上述 4 处及同类重复（若审计发现第 5 处一并收敛）  
- 回归：永不覆写语义、插件面 `init_coding_kit` 跳过 S2  
- 文档一句：README / SPEC 声明「S2 真值源唯一」

### 2.2 非范围

- 不改 S2 三目录业务含义（仍为 tasks / reviews / invokes/by-task）  
- 不改过程轨文件格式 / CLOSE 闸（属 doc-health）  
- 不引入宿主适配表（F6）  
- 不在本 F 解决 `.cyning-harness` 目录语义（F4）

---

## 3. 方案要点（R2 摘要）

| 方案 | 要点 | 结论 |
|------|------|------|
| A. 共享常量 + 统一 helper | 一处定义；CLI/插件两侧可各自再导出薄封装 | **推荐** |
| B. 各文件继续本地列表但加 lint 强制相等 | 仍多份；易漂 | **弃选** |
| C. 外置 yaml 配置 | 过度；S2 是硬约束非用户配置 | **弃选**（1.x） |

**前缀规范（草案 · 待实现拍板）**：对外文档口径统一为带 `docs/` 的规范路径：

- `docs/tasks/`
- `docs/harness/reviews/`
- `docs/harness/invokes/by-task/`

兼容探测可接受「历史裸 `reviews/` / `invokes/by-task/`」若与现网命令行为等价；须在单测矩阵写死，禁止静默扩大/缩小保护面。

---

## 4. 验收标准

- [x] 全仓 `rg` 无第二份 S2 前缀字面量列表（允许测试 fixture 引用常量）  
- [x] 同路径矩阵：至少覆盖「规范三前缀命中 / 近邻非 S2 不误杀」  
- [x] `init` / `upgrade` / `sync prompts` / `skills install` / `refresh-ide-blocks --yes` 对 S2 仍拒写或跳过  
- [x] 插件面与 CLI 面对同一相对路径结论一致  
- [x] 度量：硬编码份数 4 → 1；门禁结论一致率 100%（对齐 V1）

---

## 5. failure_paths

| ID | 触发 | 行为 | 可重试 |
|----|------|------|--------|
| F1-01 | 收敛后保护面缩小（某路径原被保护现可写） | 测试红；禁止合入 | 是（扩回前缀） |
| F1-02 | 保护面意外扩大（误杀 `.coding-kit` 等） | 测试红；回滚常量 | 是 |
| F1-03 | 插件面与 CLI 面仍各写一份 | 审计 FAIL；打回 | 是 |
| F1-04 | 仅改常量未改调用点 | 行为分裂仍在；矩阵测抓出 | 是 |

---

## 6. 思考轮（本 F）

| 轮 | 摘要 |
|----|------|
| R0 | P1 / X7 证据链完整（四锚点） |
| R1 | 只统一真值源；不改「永不覆写」产品语义 |
| R2 | 推荐共享常量；弃选多列表+lint、外置 yaml |
| R3 | 风险=保护面漂移；用矩阵测锁边界 |
| R4 | `test_strategy=required`；先写可失败测再改实现 |
| R5 | 可交 20-spec-audit；开放：裸前缀兼容是否保留 |

---

## 7. 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-09 | v0-draft |
| 2026-09-09 | 系列签收（整包）；可交 00 拆 W1 task |
| 2026-09-09 | W1 落地：共享常量 + 四锚点替换 + `test/s2-truth-source.test.ts` |
