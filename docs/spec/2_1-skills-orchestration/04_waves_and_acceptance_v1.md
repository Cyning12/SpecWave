# 04 · Waves 与验收（2.1.0）

> **状态**：`signed` · 隶属 `2_1-skills-orchestration`  
> **上游规划**：[`../../roadmap/PLAN_2_1_skills_orchestration_v1_zh.md`](../../roadmap/PLAN_2_1_skills_orchestration_v1_zh.md)

---

## 1. Wave 勾选（实现前全空）

### W0 · 签收

- [x] `HG-NEXT-21=approved`  
- [x] `HG-SPEC-SIGNOFF=approved`（本系列 `00`–`05` + B-* 冻结含 **B-DSH-ORCH=B**）  
- [x] 拆出 W1–W5 task 文件（active）

### W1 · Skills parity

- [x] `host apply --tools cursor,claude,dsh --profile core --yes` 后三方 skills 目录断言  
- [x] 录屏/清单：Cursor `/h` 可见六条 harness（跳过 30/40）  
- [x] **`HG-AUDIT-R1`** for W1 task（2026-09-10 · 00 代签 · 30 CLOSE） 

### W2 · Commands UX

- [x] Claude：`/kit:verify` 等（子目录落点）可发现  
- [x] Cursor：frontmatter `name`/`description` 齐全；`/kit` 可发现  
- [x] 旧扁平 Claude 文件迁移策略有测或 dogfood 勾选  
- [x] **`HG-AUDIT-R1`** for W2 task（2026-09-10 · 00 代签 · 30 CLOSE） 

### W3 · DSH 编排（B 已冻结）

- [x] `host apply --tools dsh` 写入 `.dsh/skills/kit-*`（或约定名）编排 skills  
- [x] **不**创建 `.dsh/commands/`  
- [x] DSH Web `/kit-verify`（或等价）可发现；跑通 `verify` failClosed  
- [x] **`HG-AUDIT-R1`** for W3 task（2026-09-10 · 00 代签 · 30 CLOSE） 

### W4 · expanded

- [x] `--profile expanded` 物化 `kit-hat-*` 等；默认 core 不变  
- [x] `host update` conflict / `--force` 行为与 2.0 一致  
- [x] **`HG-AUDIT-R1`** for W4 task（2026-09-10 · 00 代签 · 30 CLOSE） 

### W5 · 发版

- [x] 更新录屏清单 · README「一包多宿主」2.1 段  
- [x] CHANGELOG · bump `2.1.0` · 四门绿 · tag `v2.1.0`  
- [ ] **`HG-PUBLISH`** 仅人 · `npm view` = `2.1.0`

---

## 2. 产品验收（一票否决）

| # | 条款 |
|---|------|
| A1 | 闸真值仍在 CLI；command/skill 不得口头代闸 |
| A2 | 前缀不与 opsx/speckit 冲突 |
| A3 | S2 / local / 跳过 30/40 纪律保持 |
| A4 | Cursor + Claude + DSH 在 dogfood 清单可勾完 skills+编排（DSH 按等价面） |

---

## 3. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
| 2026-09-10 | W0 勾选 · signed |
| 2026-09-10 | W1：三方 skills 断言 + 录屏 `/h` 口径勾选（R1 闸行仍由过程档） |
| 2026-09-10 | W2：Claude `kit/<verb>` 落点 + Cursor frontmatter + 旧扁平迁移测（R1 闸行待 00） |
| 2026-09-10 | W3：`.dsh/skills/kit-*` 编排 + 禁 `.dsh/commands`（R1 闸行待 00） |
| 2026-09-10 | W4：`--profile expanded` kit-hat-* + conflict/force（R1 闸行待 00） |
| 2026-09-10 | W5：文档/CHANGELOG/bump/tag 勾选；`HG-PUBLISH` 仍 pending（仅人） |
