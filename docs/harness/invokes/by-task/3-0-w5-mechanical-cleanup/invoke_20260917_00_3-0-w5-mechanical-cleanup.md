# Invoke：00（统筹）· 3-0-w5-mechanical-cleanup

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-w5-mechanical-cleanup` |
| task_paths | `docs/tasks/active/task_3_0_w5_mechanical_cleanup.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 人授权（原文意图）

维护者 2026-09-16 本窗：**PLAN_3_0 + 3.0 SPEC 系列双签 approved**，原话「**签收，授权00签收后续所有文档**」——授权 00 代签后续过程文档闸（**HG-RELEASE / npm publish / tag / push 不在范围** · 发布四动作仅人不变）。**00 只委派不亲自实现**（harness-00-delegate-only 口径）。

## 闸扫描与代签依据

- 上游双闸：HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗 · 落 task `### 人工闸` 表）
- HG-TASK-DRAFT=approved（**2026-09-17 00 代签** · 同授权 · task lint PASS）
- HG-AUDIT-R1=approved（**2026-09-17 00 代签** · 同授权 · 依据审查文 `docs/harness/reviews/task_3_0_w5_mechanical_cleanup_audit_R1_20260917.md`：R1 · PASS-with-issues · blocking 0 · advisory A1–A4）
- **闸行裁决**：W5 不设 HG-SCHEMA-CHANGE 新行（10-task 起草裁决 · 三理由 + 升级条款落 task 闸表下注 · 20-task-audit R1 复核在案）：① NEW-6 动 `package.json` `files` 否定项=数据行非结构格式变更 · ② R-6 `error_kind`=additive 扩键（契约「键集只增不改」显式允许只增）· ③ NEW-12 契约修订的人闸通道=HG-AUDIT-R1（本表在案）

## 派发链

W4 done（794/150/793/0/1 锁终态）→ 10-task 起草（规格化六项 + 基线复跑 + git 依赖测试面 4 文件盘点 + SPEC 示例正则不完备起草发现 · 见 10 invoke）→ **00 代签 HG-TASK-DRAFT**（+ 头部闸态同步授权）→ 20-task-audit R1 书面审（PASS-with-issues · blocking 0 · advisory A1–A4 · 见 20 invoke 与审查文）→ **00 代签 HG-AUDIT-R1** + pre-30 invoke 三件套补落（10/20/00 齐 · W1/W2/W3/W4 先例）→ 30/40。

## 关键裁定

1. **双签承接与顺序**（硬约束 6/10/14/15 同构）：task 落闸行（双 pending）→ HG-TASK-DRAFT 代签 → 20 审查文落盘 → HG-AUDIT-R1 代签 → 30 改码；泛化机检全程咬住（pending 期 verify 实证 exit 2 拒 30 · 双签后 + invoke 三件套齐 VERIFY: PASS）
2. **四 advisory 处置**（全部带入 30 执行要求 · 落 HG-AUDIT-R1 行注明）：
   - **A1（登记级）**：NEW-12 键碰撞语义登记 —— key 相对化后撞名（原不同绝对路径相对化后同 key）后者覆盖 · 信封不得依赖碰撞面 · 30 执行要求：碰撞语义入 cli-shared.ts 契约注释 + fixture 或注释面登记
   - **A2（文案级）**：NEW-8 双占（`.bak` 与 `.pins-fix-backup` 皆被占）跳过写盘的点名文案须含「**请手动处置后重跑**」指引 · 用户可自助恢复（零损失 + 可操作指引双要件）
   - **A3（机检级）**：NEW-7 案 B 显式声明机检双锚 —— ① `check-pack-hygiene.mjs` 头注释控制点声明 · ② 测试实跑行（pack-hygiene.test.ts 内实跑断言）—— 双锚 grep 断言在案 · 防注释被静默删致「隐性单点」回潮
   - **A4（标注级）**：行号小疵注记 —— 30 执行期以改前复读现值为准（task 行号为 2026-09-17 起草轮实读快照 · 与 W4 A4 同型处置）
3. **NEW-7 档位裁定确认**：20 审通过案 B（显式声明 + 指认事实第二控制点）· 案 A 升级通道未启用 —— 00 认可 · 机检双锚按 A3 执行
4. **commit 授权**：本笔 commit（task + 审查文 + invoke 三件套）为 00 当次书面授权 · 显式列路径 · 禁 add -A · 不 push

## 未做（禁区）

- 未实现代码 · 未改 SPEC/PLAN/src/scripts/package.json/test 既有件（30 的事）
- 未 push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 四动作余者仅人）

## 下一棒

30 实现棒：GATE_VERIFY（双闸 approved · pre-30 invoke 三件套齐 · VERIFY: PASS）→ 按 task S5.1–S5.6 执行（红测先行 · A1–A4 执行要求 · R-1 只验不回改零 diff 硬锁 · exit code 语义零变更红线）→ 验收 10 条全绿 → 40 复核 → `task close --yes` 关账（00 口径：close 待 40 后另放行）。
