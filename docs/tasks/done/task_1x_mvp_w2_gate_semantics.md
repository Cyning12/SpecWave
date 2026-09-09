# Task：1x-mvp W2 · P0 门禁语义对齐（F2）

> **状态**：`done`  
> **关联图谱**：无  
> **关联 SPEC**：`docs/spec/1x-mvp/F2_gate_semantics.md`（signed · 依赖 W1/F1 DONE）  
> **00 颗粒度**：单 task = SPEC **W2 整波**；文档契约 + 缺口测 + help 一句；不大改 exit 族

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `1x-mvp-w2-gate-semantics` |
| **test_strategy** | `required` |
| **test_strategy_note** | 新测钉死 exit 2 / 用法 1 / check 恒 0；README 契约关键字可机器断言 |
| **code_quality_bar** | `recommended` |
| **freeze_id** | 退出码族 `0` 放行·`1` 用法/非阻断·`2` 门禁阻断 failClosed；命令面不变 |
| **orchestration** | `Cursor Task 链` |
| **semi_auto** | `false` |
| **audit_profile** | `full` |
| **invoke_retention_profile** | `minimal` |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 语义文档化；不改 flow |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 契约落 README / SPEC / CHANGELOG |
| **experience_capture** | `recommended` |
| **kpi_aggregator** | `CLOSE` |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit docs+test 轨；00 合入 |
| **entry_invoke_30** | `docs/harness/invokes/by-task/1x-mvp-w2-gate-semantics/invoke_20260909_30_40_1x-mvp-w2-gate-semantics.md` |
| **maintainer_release_hold** | `true` |

### 00 维护者授权（2026-09-09 · 延续 W1 整波模式）

| 权限 | 00 |
|------|-----|
| W2 过程档签收 · HG-AUDIT-R1 · 30→40→CLOSE | ✅（用户「继续 W2 统筹」） |
| bump / publish | ⛔ |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | approved | 10,30 | 系列整包 |
| HG-TASK-DRAFT | approved | 22-R1,30 | 00 代签 |
| HG-AUDIT-R1 | approved | 30 | reviews/…_w2_…_R1_20260909.md |

---

## 背景与目标

W1 已统一 S2 真值源。W2：把 P0 门禁 **exit 2 = 阻断 / failClosed / 分层强制（文档-only）** 写成对外契约，并用自动化钉死，对齐 V4。

## 范围（细颗粒）

### W2.0 过程档
- [x] task / audit R1 / invoke

### W2.1 审计
- [x] 现网：verify/gate-check/audit P0 失败已 `fail(..., 2)`；`check` 恒 0；用法缺参默认 exit 1
- [x] 缺口：README 无独立「退出码 / failClosed / 分层强制」专节；`--help` 未列 exit 族

### W2.2 文档 + 测
- [x] README 中英专节
- [x] CLI `usage()` 追加 Exit codes 三行
- [x] `test/gate-semantics.test.ts`（契约关键字 + exit 矩阵）
- [x] F2 SPEC 验收勾选；系列 README W2 DONE；CHANGELOG Unreleased

### W2.3 非范围遵守
- [x] 不引入云四层引擎；不大改 exit 族；不 bump

## 非范围
F3–F5；宿主 hooks；D5 白名单重做；major 破坏性改码；publish

## 验收
- [x] README 成文 exit 2 / failClosed / 分层强制
- [x] P0 失败路径测断言 status===2
- [x] D5 无制品 → exit 2
- [x] 用法错误 → 非 2 优先（exit 1）
- [x] check → 0

## failure_paths
| ID | 触发 | 行为 |
|----|------|------|
| T-F2-01 | 文档与实现 exit 不一致 | 测红 |
| T-F2-02 | 误把分层强制做成远程引擎 | 打回 |
| T-F2-03 | 破坏性改 exit 族 | 打回 |

## 思考轮控制
| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | F2 signed；W1 DONE | no |
| R1 | 文档+测+help；非大改码 | no |
| R2 | 方案 A | no |
| R3 | 消费者 CI 兼容 | no |
| R4 | required 新测 | no |
| R5 | 00 代签可 30 | no |

**residual_risks**：个别历史测仍用 `!==0` 而非 `===2`；本波新测钉死 2，不强制改写全部旧断言。

## 自检
- [x] typecheck / 相关测绿
- [x] 未 publish

## 修订记录
| 日期 | 摘要 |
|------|------|
| 2026-09-09 | 00 起草代签 · 开 30 |
