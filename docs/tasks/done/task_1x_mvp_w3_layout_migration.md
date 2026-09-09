# Task：1x-mvp W3 · 目录语义收敛 + 迁移文档面（F4 + F3）

> **状态**：`done`  
> **关联图谱**：无  
> **关联 SPEC**：`docs/spec/1x-mvp/F4_directory_semantics.md` · `F3_legacy_migration.md`（signed · W1/W2 DONE）  
> **00 颗粒度**：单 task = SPEC **W3 整波**；F4 改码（方案 B）+ F3 文档面；**不**执行 npm deprecate

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `1x-mvp-w3-layout-migration` |
| **test_strategy** | `required`（F4 写路径）· F3 文档面 `recommended` |
| **test_strategy_note** | 新写默认 `.coding-kit`；legacy 种子 upgrade 后写新且旧目录保留；相关 CLI 测对齐 |
| **code_quality_bar** | `recommended` |
| **freeze_id** | 方案 B：`KIT_LAYOUT_DIR=.coding-kit` · `LEGACY_LAYOUT_DIR=.cyning-harness` 只读；S2 永不覆写 |
| **orchestration** | `Cursor Task 链` |
| **semi_auto** | `false` |
| **audit_profile** | `full` |
| **invoke_retention_profile** | `minimal` |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `feat/hat-identity-system-reanchor` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **wiki_delta_note** | MIGRATION.md + README 双文件 |
| **experience_capture** | `recommended` |
| **kpi_aggregator** | `CLOSE` |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit docs+code 轨；00 合入 |
| **entry_invoke_30** | `docs/harness/invokes/by-task/1x-mvp-w3-layout-migration/invoke_20260909_30_40_1x-mvp-w3-layout-migration.md` |
| **maintainer_release_hold** | `true` |

### 00 维护者授权（2026-09-09 · 用户「commit，然后继续 W3」）

| 权限 | 00 |
|------|-----|
| W3 过程档签收 · HG-AUDIT-R1 · 30→40→CLOSE | ✅ |
| bump / publish / npm deprecate | ⛔ |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | 10,30 | 系列整包 |
| HG-TASK-DRAFT | approved | 22-R1,30 | 00 代签 |
| HG-AUDIT-R1 | approved | 30 | reviews/…_w3_…_R1_20260909.md |
| HG-EOS-DATE | pending | deprecate 实操 | **不**阻塞本波文档面 |
| HG-PUBLISH | pending | publish | release_hold |

---

## 背景与目标

W1/W2 已收敛 S2 与门禁语义。W3：落地 F4 方案 B（新写 `.coding-kit`、legacy 只读）并补齐 F3 迁移文档面（EOS 日历提案占位，真实 deprecate 等人闸）。

## 范围（细颗粒）

### W3.0 过程档
- [x] task / audit R1 / invoke

### W3.1 F4 代码
- [x] `KIT_LAYOUT_DIR` / `LEGACY_LAYOUT_DIR` / `resolveLayoutFile` / `legacyLayoutHint`
- [x] manifest / events / snapshot / invoke_index / local.json / backups 新写 kit；读新优先
- [x] upgrade 读 legacy 写 kit；不删旧目录
- [x] 相关测期望对齐 `.coding-kit`

### W3.2 F3 文档面
- [x] 根 `MIGRATION.md`（最小路径 · 布局 · EOS 提案 · deprecate 草稿 · 仅人清单）
- [x] README / README.zh-CN 迁移与备份路径对齐方案 B
- [x] **未**执行 `npm deprecate`；未宣称 EOS 已生效

### W3.3 收口
- [x] F3/F4 SPEC 验收勾选（文档/代码可达项）；系列 README W3 DONE；CHANGELOG Unreleased
- [x] typecheck + 相关/全量测绿
- [x] 未 bump / 未 publish

## 非范围
F5；真实 deprecate；删除消费者 `.cyning-harness`；改 marker 注释语法名；publish

## 验收
- [x] 新写默认根 `.coding-kit`
- [x] `.cyning-harness` 无创建/写入默认目标（测钉）
- [x] legacy 可读；upgrade 写新且旧保留
- [x] MIGRATION 可独立完成迁移阅读；与 F4 表述一致
- [x] EOS 日仍 TBD + `HG-EOS-DATE=pending` 明示（不伪完成 T1）

## failure_paths
| ID | 触发 | 行为 |
|----|------|------|
| T-W3-01 | 新代码仍写 `.cyning-harness` | 测红 |
| T-W3-02 | 实现删除旧目录 | 禁止；打回 |
| T-W3-03 | Agent 执行 deprecate | 禁止 |
| T-W3-04 | 无 EOS 日却勾「deprecate 已执行」 | 打回 |

## 思考轮控制
| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | F3/F4 signed；W1/W2 DONE | no |
| R1 | 单波 F4 码 + F3 文档 | no |
| R2 | 方案 B；EOS 占位 | no |
| R3 | 测全量对齐写路径 | no |
| R4 | required 写路径 | no |
| R5 | 00 代签可 30 | no |

**residual_risks**：存量消费者双目录并存时人工清理节奏未规定；EOS 日历空。

## 自检
- [x] typecheck / 相关测绿
- [x] 未 publish / 未 deprecate

## 修订记录
| 日期 | 摘要 |
|------|------|
| 2026-09-09 | 00 起草代签 · 开 30 · CLOSE → done/ |
