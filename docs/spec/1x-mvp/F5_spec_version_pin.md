# F5 · SPEC 钉版一致性发布前校验

> **状态**：`signed` · 隶属 `1x-mvp`  
> **feature_id**：`F5` / `F5.1`  
> **对齐**：X6 → R5 → V2 · 痛点 P2  
> **test_strategy**：`required`  
> **上游**：高层架构 §1.3 / §6.3 F5 · RELEASING.md ④ pins · `package.json` vs 仓根 `SPEC.md`  
> **残余闸**：`HG-F5-PIN-MODE`（A vs B）· W4 改码前须补拍

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **spec_slug** | `1x-mvp/F5_spec_version_pin` |
| **freeze_id（草案）** | 包版本真值 = `package.json#version`；对外承诺钉点偏差目标 = **0** |
| **现状锚点** | 仓根 `SPEC.md` 标题/拟发版仍钉 **1.2.0**；包 **1.10.0**（落后 8 个版本）；`ontology.yaml` 等已有部分钉测 |

---

## 1. 背景与目标

对外承诺失真：历史 epic `SPEC.md` 钉在 1.2.0，包已演进至 1.10.0；评估者按 SPEC 理解能力边界会误判。RELEASING 已有**人工** pins 清单，但 **SPEC 版本钉未进自动阻断闸**。

**一句话目标**：定义「版本钉集合」并做成 **发布前自动校验**——偏差 ≠ 0 则 **FAIL / 阻断 publish 准备**。

**完成态行为**

1. 明确钉点清单（最少）：`package.json` ↔ 约定的 SPEC 版本字段（见方案）↔ `assets/ontology.yaml` ↔ `discipline-coverage.yaml` 的 `as_of_package_version`（后者已有测，纳入同一闸叙述）。  
2. 校验器在 CI 与/或 `prepublishOnly` 可运行；本地 `npm test` 或专用 script 可红。  
3. 文档说明：仓根 `SPEC.md` 若保留为**历史已签 epic**，须改为「历史档 + 现行能力指针」，**禁止**继续让标题暗示「当前包=1.2.0」而不加免责声明。  
4. 度量：版本钉偏差 8 → **0**（对齐 V2）。

---

## 2. 范围

### 2.1 In

- 钉点清单成文 + 自动校验实现（script 或 test）  
- 处理仓根 `SPEC.md` 与现行包版本关系的**产品决策落地**（见 R2）  
- 更新 RELEASING：④ 与自动闸对齐（人仍执行 publish）  
- README 对外版本表述与包版本一致

### 2.2 非范围

- 不自动 `npm version` / publish（仅人）  
- 不重写 1.2.0 历史 epic 的过程档内容（可加 POINTER / 状态条）  
- 不把本系列 `docs/spec/1x-mvp/` 打进 npm `files`  
- 不解决 X3 发布回顾续写到 1.10.0 的全文（可列为后续；本 F 只锁版本钉）

---

## 3. 方案要点（R2）

| 方案 | 要点 | 结论 |
|------|------|------|
| **A. 现行契约文件与 package 对齐** | 新增/更新「现行对外 SPEC」版本头 = 包版本；历史 `SPEC.md` 降级为 archived epic + 醒目 banner | **推荐候选** |
| **B. 废除仓根 SPEC 版本钉检查，只钉 ontology/discipline/README** | 减少历史债纠缠 | **候选**；须在签收时二选一 |
| C. 每次发版手工改 SPEC 标题数字、无机器闸 | 现状放大版；V2 不达标 | **弃选** |

**开放拍板（维护者）**：A vs B。草稿阶段两种验收路径都写清，签收时删一条。

### 3.1 校验语义（草案）

```text
FAIL 当且仅当：
  - 任一「现行钉点」解析出版本 ≠ package.json version
  - 或现行对外文档仍声称包版本为过期 epic 版本且无 archived 标记
```

退出码建议：校验脚本失败 → 非 0（发布准备阻断）；不改变运行时 P0 门禁退出码族（F2）。

---

## 4. 验收标准

- [ ] 钉点清单写入本 SPEC / RELEASING，无歧义  
- [ ] 自动校验：故意改歪一处钉点 → 测试或 script **红**  
- [ ] 恢复一致 → **绿**  
- [ ] 仓根 `SPEC.md` 不再导致「当前包=1.2.0」的对外误读（A 或 B 落地）  
- [ ] `npm pack --dry-run` 仍不含须保密/过程-only 文件（既有纪律）  
- [ ] 对齐 V2：偏差 0

---

## 5. failure_paths

| ID | 触发 | 行为 | 可重试 |
|----|------|------|--------|
| F5-01 | 只改 README 不改闸 | 仍可带病发布；验收判未完成 | 是 |
| F5-02 | 校验误伤历史过程档 | 收窄钉点范围；历史档标 archived | 是 |
| F5-03 | 把 SPEC 打进 npm files | 违背既有 freeze；打回 | 是 |
| F5-04 | A/B 未拍板却开工改码 | 00 拒；先补 `HG-F5-PIN-MODE`（系列已签收仍阻塞 W4） | 是 |

---

## 6. 思考轮（本 F）

| 轮 | 摘要 |
|----|------|
| R0 | X6 数字清楚（1.2.0 vs 1.10.0） |
| R1 | 机械化 pins；历史 epic 与现行契约分离 |
| R2 | A/B 候选；弃选纯手工 |
| R3 | 不进 npm files；publish 仍仅人 |
| R4 | required；故意不一致必须可失败 |
| R5 | **必须人拍 A vs B** 后方可称可签收完成态 |

---

## 7. 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-09 | v0-draft |
| 2026-09-09 | 系列签收；A/B 改挂 `HG-F5-PIN-MODE` |
