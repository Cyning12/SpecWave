# Invoke：00（统筹）· 3-0-w6-observability-audit

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-w6-observability-audit` |
| task_paths | `docs/tasks/active/task_3_0_w6_observability_audit.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 人授权（原文意图）

维护者 2026-09-16 本窗：**PLAN_3_0 + 3.0 SPEC 系列双签 approved**，原话「**签收，授权00签收后续所有文档**」——授权 00 代签后续过程文档闸（**HG-RELEASE / npm publish / tag / push 不在范围** · 发布四动作仅人不变）。**00 只委派不亲自实现**（harness-00-delegate-only 口径）。

## 闸扫描与代签依据

- 上游双闸：HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗 · 落 task `### 人工闸` 表）
- HG-TASK-DRAFT=approved（**2026-09-17 00 代签** · 同授权 · task lint PASS）
- HG-AUDIT-R1=approved（**2026-09-17 00 代签** · 同授权 · 依据审查文 `docs/harness/reviews/task_3_0_w6_observability_audit_audit_R1_20260917.md`：R1 · PASS-with-issues · blocking 0 · advisory A1–A4）
- **闸行裁决**：W6 不设 HG-SCHEMA-CHANGE 新行（10-task 起草裁决 · 三理由 + 升级条款落 task 闸表下注 · 20-task-audit R1 复核通过）：① coverage 回写 = 按已批准 schema 写数据（status/note/gap 字段值变更 · 键形态零变更）· ② C6 审计事件 schema = 新增内部落盘格式（无既有消费者契约）· ③ F4 trigger 字段 = additive 扩键（loadDiscipline 校验面 cli-lifecycle.ts:87-89 容忍 · 20 审实证成立）

## 派发链

W5 done（810/154/809/0/1 锁终态）→ 10-task 起草（规格化七项 + 基线复跑 + N2-C 前基线实测 27/80=33.8% 逃逸率 100% + 起草发现三条：G2 已接线对账 · yaml 锚点 W0 旧址 · C1/C2/D3 真残留 · 见 10 invoke）→ **00 代签 HG-TASK-DRAFT**（+ 头部闸态同步授权）→ 20-task-audit R1 书面审（PASS-with-issues · blocking 0 · advisory A1–A4 · 五条重点全裁定 · 见 20 invoke 与审查文）→ **00 代签 HG-AUDIT-R1** + pre-30 invoke 三件套补落（10/20/00 齐 · W1–W5 先例）→ 30/40。

## 关键裁定

1. **双签承接与顺序**（硬约束 1/6/14/15 同构）：task 落闸行（双 pending）→ HG-TASK-DRAFT 代签 → 20 审查文落盘 → HG-AUDIT-R1 代签 → 30 改码；泛化机检全程咬住（pending 期 verify 实证 exit 2 拒 30 · 双签后 + invoke 三件套齐 VERIFY: PASS）
2. **G7 落地档裁定**：20 审重点②裁定「诚实口径优先可接受（warn-only → partial 不虚标 closed · G4 warn-only 态即 closed 不对称先例登记 · 不须打回不须回 SPEC 回注）」—— **00 接受**：G7 落地为 warn-only 时 statements A5/B2 升 partial · gaps G7 不回写 closed · **SPEC ⑦「mechanical/closed」字面偏差登记在案**（诚实口径优先于 SPEC 字面 · 不虚标 · 归 00/维护者终裁通道留痕）
3. **四 advisory 处置**（全部带入 30 执行要求 · 落 HG-AUDIT-R1 行注明）：
   - **A1（登记级）**：N2-C 前基线复跑重建登记 —— 20 复测 81/27/33.3% vs task 80/27/33.8%（分母时点差 · FAIL 27 件逐文件枚举全中 · 逃逸率 100% 实质成立）· 30 执行要求：开工按基线节自带纪律（F-W0-05 同式）复跑重建基线并登记 · 前后对比用同脚本同语料
   - **A2（标注级）**：行号小疵 —— cmdDiscipline 分发实为 cli-lifecycle.ts:474-495（task 引 :478-495）· 30 执行期以改前复读现值为准（与 W4/W5 A4 同型处置）
   - **A3（口径级）**：gitignore 只覆盖本仓 —— `docs/harness/audit/*.jsonl` 排除仅本仓 .gitignore 生效 · **消费仓脏面口径须入 30 自检结论登记**（消费仓自行决定追踪口径 · 观测面非证据面分工在案）
   - **A4（留档级）**：双 invoke 已补落 —— 10/00 invoke 本笔补齐（10 代笔 · 00 裁定授权）· pre-30 三件套齐（fail-safe 闸此前正确咬住）
4. **commit 授权**：本笔 commit（task + 审查文 + invoke 三件套）为 00 当次书面授权 · 显式列路径 · 禁 add -A · 不 push

## 未做（禁区）

- 未实现代码 · 未改 SPEC/PLAN/src/scripts/assets/test 既有件（30 的事）
- 未 push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 四动作余者仅人）

## 下一棒

30 实现棒：GATE_VERIFY（双闸 approved · pre-30 invoke 三件套齐 · VERIFY: PASS）→ 按 task S6.1–S6.7 执行（红测先行 · A1–A4 执行要求 · N2-C FAIL 逃逸率 100%→0% 硬判据不降不得完成 · 审计轨永不入 S2 三域机械断言 · G7 warn-only 落地档回写 partial）→ 验收 14 条全绿 → 40 复核 → `task close --yes` 关账（00 口径：close 待 40 后另放行）。
