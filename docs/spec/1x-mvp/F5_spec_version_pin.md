# F5 · SPEC 钉版一致性发布前校验

> **状态**：`signed` · 隶属 `1x-mvp` · **W4 DONE**（`HG-F5-PIN-MODE=B`）  
> **feature_id**：`F5` / `F5.1`  
> **对齐**：X6 → R5 → V2 · 痛点 P2  
> **test_strategy**：`required`  
> **上游**：高层架构 §1.3 / §6.3 F5 · RELEASING.md ④ pins · `package.json`  
> **选型**：**B**（2026-09-09 维护者「选择 B」）——废除仓根 `SPEC.md` 版本钉检查；只钉 ontology / discipline / README

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **spec_slug** | `1x-mvp/F5_spec_version_pin` |
| **freeze_id** | 包版本真值 = `package.json#version`；现行钉点偏差目标 = **0**；仓根 `SPEC.md` = **archived epic**（非钉点） |
| **现状锚点（落地后）** | `product_semver` / `as_of_package_version` / README `@x.y.z` 与包一致；`SPEC.md` 带 ARCHIVED banner，标题可保持史实 1.2.0 |

---

## 1. 背景与目标

对外承诺失真：历史 epic `SPEC.md` 钉在 1.2.0，包已演进；若把标题当现行契约会误判。

**一句话目标（方案 B）**：版本钉集合 = **ontology + discipline-coverage + README**；发布前自动校验偏差 ≠ 0 则红；**不**要求仓根 `SPEC.md` 与包版本对齐。

**完成态行为**

1. 钉点清单（现行）：`package.json` ↔ `assets/ontology.yaml#product_semver` ↔ `assets/harness/discipline-coverage.yaml#as_of_package_version` ↔ README 双文件中的 `dsh-coding-kit@x.y.z`。  
2. 仓根 `SPEC.md`：加 **ARCHIVED EPIC** banner；明确非现行包契约。  
3. 校验进 `npm test`（故随 `prepublishOnly`）；RELEASING ④ 与 B 对齐。  
4. 度量：对外「现行钉点」偏差 → **0**（对齐 V2）；史实 epic 数字允许保留。

---

## 2. 范围

### 2.1 In

- 钉点清单成文 + `test/version-pins-f5.test.ts`  
- `SPEC.md` archived 处理（方案 B）  
- RELEASING ④ / 系列 README / CHANGELOG  
- 既有 ontology / discipline 单测保留为分面钉

### 2.2 非范围

- 不自动 `npm version` / publish  
- 不重写 1.2.0 epic 过程档正文（仅 banner / 状态条）  
- 不把 `docs/spec/1x-mvp/` 打进 npm `files`  
- 不新建「现行对外散文 SPEC」与包版本对齐（那是方案 A，已弃选）  
- 不深化本体论实践本体（仅把钉点面交给 ontology）

---

## 3. 方案要点（已拍板）

| 方案 | 要点 | 结论 |
|------|------|------|
| A. 现行契约文件与 package 对齐 | 新增现行 SPEC 头 = 包版本 | **弃选**（维护者选 B） |
| **B. 废除仓根 SPEC 版本钉，只钉 ontology/discipline/README** | 减少历史债；利于本体论真值面 | **已选** |
| C. 纯手工改标题 | V2 不达标 | **弃选** |

### 3.1 校验语义（B）

```text
FAIL 当且仅当：
  - ontology product_semver ≠ package.json version
  - 或 discipline as_of_package_version ≠ package.json version
  - 或 README.md / README.zh-CN.md 中任一 dsh-coding-kit@x.y.z ≠ 包版本
  - 或仓根 SPEC.md 缺少 ARCHIVED EPIC / 方案 B 免责声明

PASS 允许：
  - SPEC.md 标题仍含 @1.2.0（史实）且包版本为其他（如 1.10.0）
```

退出码：测试失败 → 非 0（发布准备阻断）；不改变运行时 P0 退出码族（F2）。

---

## 4. 验收标准

- [x] 钉点清单写入本 SPEC / RELEASING（方案 B 无歧义）  
- [x] 自动校验：故意改歪钉点 → 测试红（见既有 ontology/discipline 测 + 本波聚合测）  
- [x] 一致 → 绿  
- [x] 仓根 `SPEC.md` 不再导致「当前包=1.2.0」误读（ARCHIVED banner）  
- [x] `npm pack --dry-run` 仍不含 SPEC.md（既有 D8）  
- [x] 对齐 V2：现行钉点偏差 0  

---

## 5. failure_paths

| ID | 触发 | 行为 | 可重试 |
|----|------|------|--------|
| F5-01 | 只改 README 不改闸 | 仍可带病发布；验收判未完成 | 是 |
| F5-02 | 校验误伤历史过程档 | 收窄钉点；SPEC 标 archived | 是 |
| F5-03 | 把 SPEC 打进 npm files | 违背 freeze；打回 | 是 |
| F5-04 | A/B 未拍板却开工 | ~~已消除~~（B 已批） | — |
| F5-05 | 又要求 SPEC 标题=包版本 | 违背 B；打回 | 是 |

---

## 6. 思考轮（本 F）

| 轮 | 摘要 |
|----|------|
| R0 | X6 数字清楚 |
| R1 | 机械化 pins；历史 epic 与现行契约分离 |
| R2 | **人选 B** |
| R3 | 不进 npm files；publish 仍仅人 |
| R4 | required |
| R5 | W4 落地 |

---

## 7. 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-09 | v0-draft |
| 2026-09-09 | 系列签收；A/B 改挂 `HG-F5-PIN-MODE` |
| 2026-09-09 | **HG-F5-PIN-MODE=B**；W4 落地（archived SPEC + `version-pins-f5` 测） |
