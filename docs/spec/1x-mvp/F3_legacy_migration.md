# F3 · 旧产品线迁移治理

> **状态**：`signed` · 隶属 `1x-mvp`  
> **feature_id**：`F3` / `F3.1`  
> **对齐**：R4 → V3 · 痛点 P3  
> **test_strategy**：`recommended`（文档与清单为主；涉及 `upgrade`/`check` 文案处可 required）  
> **协同**：`F4`（目录切换 T2）· `R-07` refresh-ide-blocks（T3）  
> **上游**：高层架构 §3.2（Kiro 迁移范式）· 系统设计 §4.5.3 T0–T4

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **spec_slug** | `1x-mvp/F3_legacy_migration` |
| **freeze_id（草案）** | 旧包名 `@cyning/harness`；新包 `dsh-coding-kit`；`from_version` 语义保持 |
| **人闸** | `HG-EOS-DATE` · `HG-PUBLISH`（deprecate **仅人**） |

---

## 1. 背景与目标

旧产品线 `@cyning/harness` 与 kit 双轨并行；有最小迁移路径（README）但 **无公开 EOS / deprecate / 过渡窗时间表**。

**一句话目标**：发布可执行的迁移治理包——**deprecate 公告 + EOS 日 + 新注册截止 + MIGRATION 文档 + 过渡窗规则**（借鉴 Kiro 范式，不借其 IDE/云形态）。

**完成态行为**

1. 公开时间表：EOS 日、新注册截止日（须早于或等于 EOS）、过渡期内安全修复策略。  
2. `npm deprecate @cyning/harness "<迁移说明 + kit 版本钉>"`（**仅人**执行）。  
3. 仓内 `MIGRATION.md`（或等价专节）覆盖：依赖替换 → `upgrade --yes` → CI 字面替换 →（推荐）skills install；链到 F4 目录语义。  
4. `check` 对跨产品线 `from_version` 的提示语义保持/加强（不误报降级）。

---

## 2. 范围

### 2.1 In

| 阶段 | 内容 | Owner |
|------|------|-------|
| T0 | 方案评审；deprecate 文案定稿 | 架构/维护者 |
| T1 | 时间表发布 + `npm deprecate` | **仅人** |
| T3 协同 | 指向既有 `refresh-ide-blocks`（R-07）完成 IDE 字面刷新 | 研发 |
| T4 | EOS 日达成后的沟通与撤销预案 | 维护者 |

- MIGRATION 文档（中英或中英指针）  
- README「Migrating from @cyning/harness」与时间表交叉引用  
- 过程检查清单（维护者执行 deprecate 前后）

### 2.2 非范围

- **不**在本 F 完成 F4 代码切换（见 F4）  
- **不** Archive GitHub 旧仓（若存在）除非人另签  
- **不**强制消费者立即升级（过渡窗内旧包仍可安装，但挂 deprecate 警告）  
- **不** Agent 执行 npm deprecate

---

## 3. 方案要点（R2）

| 方案 | 要点 | 结论 |
|------|------|------|
| A. Kiro 式完整范式（EOS + 截止 + deprecate + 指南 + 过渡补丁） | 与调研结论一致 | **推荐** |
| B. 仅 README 一句「请迁移」 | 不可预期；V3 不达标 | **弃选** |
| C. 立即 unpublish 旧包 | 破坏存量；过高 | **弃选** |

**时间数字**：具体日历日 **留空待 `HG-EOS-DATE`**；SPEC 只锁「必须有公开日 + 截止 ≤ EOS + 过渡窗规则成文」。

---

## 4. 验收标准

- [ ] 公开文档含：EOS 日、新注册截止、过渡窗、迁移三步最小路径  
- [ ] MIGRATION（或等价）可独立阅读完成迁移  
- [ ] deprecate 文案草稿已写入文档；实操勾选「仅人」  
- [ ] 与 F4 方案 B 表述一致（目标目录 `.coding-kit`，非继续写死 `.cyning-harness` 为新标准）  
- [ ] 对齐 V3：迁移时间表「无 → 已发布」

---

## 5. failure_paths

| ID | 触发 | 行为 | 可重试 |
|----|------|------|--------|
| F3-01 | Agent 自行 npm deprecate | 禁止；记事故；人撤销/重发 | 否/人处理 |
| F3-02 | EOS 日未填却宣称 F3 完成 | 闸：`HG-EOS-DATE=pending` | 是 |
| F3-03 | 时间表与 F4 目录目标矛盾 | 打回统一口径 | 是 |
| F3-04 | 过渡窗内停止一切旧包安全修复且未公告 | 违背范式；补公告或恢复策略 | 是 |

---

## 6. 思考轮（本 F）

| 轮 | 摘要 |
|----|------|
| R0 | R4 / Kiro 范式已在调研冻结 |
| R1 | 文档+人闸为主；代码面最小 |
| R2 | 推荐完整范式；弃选只写一句/立即 unpublish |
| R3 | deprecate 与 EOS 仅人；与 F4 协同 |
| R4 | recommended；清单可勾选验收 |
| R5 | 开放：EOS 具体日、旧仓是否 Archive |

---

## 7. 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-09 | v0-draft |
| 2026-09-09 | 系列签收；`HG-EOS-DATE` 仍 pending（阻塞 T1 deprecate，不阻塞 W1） |
