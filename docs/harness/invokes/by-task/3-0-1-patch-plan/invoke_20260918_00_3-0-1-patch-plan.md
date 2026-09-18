# Invoke：00（统筹）· 3.0.1 PLAN 签收 → 派 W1

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-1-patch-plan` → `3-0-1-w1-sticky-table-source` |
| plan_path | `docs/roadmap/PLAN_3_0_1_patch_v1_zh.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-18 |

## 人授权（原文意图）

维护者 2026-09-18 本窗：**「身为00，统筹3.0.1的升级，授权签收过程文档」**

1. **签收本规划** → `HG-NEXT-PLAN=approved`（已落 PLAN 头栏 + 人工闸表）
2. **授权 00 代签本版后续全部过程文档闸** → HG-TASK-DRAFT / HG-AUDIT-R1 / HG-W2-REVIEW（条件）/ CLOSE（与 2.4.0/3.0.0 同模式）
3. **仍仅人**：HG-RELEASE · npm publish / deprecate · tag · push

## 闸扫描

| 闸 | 状态 | 说明 |
|----|------|------|
| HG-NEXT-PLAN | **approved** | 2026-09-18 维护者本窗 · 开 W 波限制解除 |
| HG-AUDIT-R1（×6 波） | pending → 00 代签 | 每波须 20 审查文落盘后方可签 |
| HG-W2-REVIEW | pending（条件） | 仅 W2 契约变更时启用 |
| HG-RELEASE | pending | **不在代签范围** |

## 编排裁定

1. **波次顺序硬钉**：W1 → W2 → W3 → W4 → W5 → W6 → release（PLAN 硬约束 9：W6-① 必须在 W4 之后）
2. **每波一 task、单独提交** `fix(3.0.1-W<n>): …`；禁 `git add -A`
3. **patch 纪律门**：触 schema / 改判定语义松紧 / 新增对外能力面 ⇒ STOP 上报移出 3.0.1
4. **00 只委派不亲自实现**（harness-00-delegate-only；无「本窗亲自 30」例外句）
5. **本版无独立 SPEC 夹**（属 3.0.0 验收后 patch · 同 2.4.1/2.4.2 先例）⇒ W 波 task 的 HG-SPEC-SIGNOFF=N/A

## 动作（本窗已做）

1. PLAN 头栏 `draft` → `approved` · HG-NEXT-PLAN 翻转
2. 人工闸表同步授权口径（HG-AUDIT-R1 / HG-W2-REVIEW 代签路径 · HG-RELEASE 仍仅人）
3. 修订表 + 文末「已签收」块落盘
4. **本窗未改** `src/` / 实现测

## 派发链（下一棒）

**10-task**：起草 `docs/tasks/active/task_3_0_1_w1_sticky_table_source.md`（slug `3-0-1-w1-sticky-table-source`）  
→ 20-task-audit（审查文落 `docs/harness/reviews/`）  
→ 00 代签 HG-TASK-DRAFT + HG-AUDIT-R1  
→ 30/40（GATE_VERIFY 首输出 → 实现 → 自证 → `task close --yes`）

## 未做（禁区）

- 未亲自实现代码（delegate-only）
- 未开 W2–W6 task（W1 闭环后再拆）
- 未执行 tag / push / publish / deprecate

## 下一棒

10-task · W1 粘性表源持久化（PLAN W1 节 · P1-1）

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 00 统筹：PLAN 签收落盘 · 过程文档代签授权登记 · 派 W1 10-task |
