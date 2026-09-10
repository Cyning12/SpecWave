# 纪律覆盖 vs 本体论 · 口径对齐（O3 · 1.12）

> **目的**：收窄「已接线 / wired」误读；**不**新增 CLI。

## 两套资产

| 资产 | 路径 | 「接线」含义 |
|------|------|--------------|
| **discipline-coverage** | `assets/harness/discipline-coverage.yaml` | 某条纪律/闸在本包 `src/` **是否有 mechanized 实现**（`mechanical` / `partial` / `prompt-only` / `not_wired`） |
| **ontology** | `assets/ontology.yaml` | 包/实例域类与公理（ONTO-*）的**声明式模型**；`product_semver` 钉包版本（F5=B） |

## 关键对齐句

1. **discipline「wired / mechanical」≠ ontology 被 CLI 全量校验。**  
   `status: mechanical` 只说明对应闸在 `src/` 有锚点；**不**表示存在独立的 `ontology-check` 子命令。
2. **ontology 现行消费面（1.12 浅落地）**：  
   - 钉点测：`product_semver` ↔ `package.json`（及 README / discipline `as_of_package_version`）  
   - 浅结构测：`test/ontology-shallow.test.ts`  
   - 人读投影：`docs/ontology/CURRENT_CAPABILITY.md`（**非**第二钉点）
3. **`npx dsh-coding-kit graph axioms check`** 校验的是 **HGM 图谱公理**，**不是** `assets/ontology.yaml` 全文。  
4. **独立 `ontology-check` CLI**：仍 **未接线**；若要做，须另开 SPEC（非 1.12 范围）。

## 误读反例

| 误读 | 纠正 |
|------|------|
| 「discipline 全 mechanical ⇒ ontology 已校验」 | 否；两套资产 |
| 「CURRENT_CAPABILITY 标题版本 = 包钉」 | 否；守 F5=B |
| 「axioms check 通过 = ontology.yaml OK」 | 否；对象不同 |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | O3 初版 |
