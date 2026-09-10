# 现行能力一页 · 自 ontology 投影（O2 · 1.12）

> **生成纪律**：本页为人读投影；**版本钉真值**仍为 `package.json` + `assets/ontology.yaml#product_semver`（F5=B）。  
> **勿**把本页标题版本当作第二钉点。

**包版本**：见 `package.json`（发版后与 `ontology.product_semver` 对齐）。  
**本体 schema**：`assets/ontology.yaml` · `version` 字段（本体文档版本，≠ 包 semver）。

## 包域类（classes · domain=Package）

Track（含子类 Graph/Wiki/Standards/Process/Verify/IDE）· Template · Preset · WizardTool · IDEFragment

## 实例域类（domain=Instance）

AdoptedProfile · VersionManifest · Task · Hat · HumanGate · InvokeSnapshot · AuditReview · Inform/Constrain/VerifyArtifact

## Starter hats

| hat_id | role |
|--------|------|
| 10-task | TaskRequirementsHat |
| 20-task-audit | TaskAuditHat（alias 22） |
| 30-execute-code | ExecuteHat |
| 40-self-check | SelfCheckHat |

## 核心公理（ONTO-*）

- **ONTO-P1**：纪律包不含业务代码与 LLM Runtime  
- **ONTO-S2**：禁止 sync 覆盖 docs/tasks、reviews、invokes/by-task  
- **ONTO-D1 / D2 / D7**：审查留档 · HG-AUDIT-R1 · public push 人闸  

完整列表以 `assets/ontology.yaml#axioms` 为准。

## 机器校验

- 浅校验：`test/ontology-shallow.test.ts`（结构 + ONTO- 前缀 + product_semver）  
- HGM 公理：`npx dsh-coding-kit graph axioms check`（**不**校验本 ontology 文件；独立 `ontology-check` 仍未接线）

## 与 discipline「已接线」口径

见 [`DISCIPLINE_ALIGNMENT.md`](./DISCIPLINE_ALIGNMENT.md)（O3）：discipline `mechanical` ≠ ontology CLI 全量校验。

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | O2 初版投影 |
| 2026-09-10 | 链 O3 对齐说明 |
