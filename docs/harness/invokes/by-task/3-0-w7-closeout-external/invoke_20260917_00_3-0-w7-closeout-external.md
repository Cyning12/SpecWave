# Invoke：00（统筹）· 3-0-w7-closeout-external

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-w7-closeout-external` |
| task_paths | `docs/tasks/active/task_3_0_w7_closeout_external.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 人授权（原文意图）

维护者 2026-09-16 本窗：**PLAN_3_0 + 3.0 SPEC 系列双签 approved**，原话「**签收，授权00签收后续所有文档**」——授权 00 代签后续过程文档闸（**HG-RELEASE / npm publish / tag / push 不在范围** · 发布四动作仅人不变）。**00 只委派不亲自实现**（harness-00-delegate-only 口径）。

## 闸扫描与代签依据

- 上游双闸：HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗 · 落 task `### 人工闸` 表）
- HG-TASK-DRAFT=approved（**2026-09-17 00 代签** · 同授权 · task lint PASS）
- HG-AUDIT-R1=approved（**2026-09-17 00 代签** · 同授权 · 依据审查文 `docs/harness/reviews/task_3_0_w7_closeout_external_audit_R3_20260917.md`：R3 · PASS · blocking 0）
- **HG-RELEASE**=pending · **blocks_hats=—（不拦 30）**：00 裁定（2026-09-17）—— 发布动作闸语义（tag/publish/push 仅人）· 含 `30` 会致 W7 全体实现被系统性拒开工（GATE_VERIFY 实测 3 行 → 2 行）· 硬约束 15 机检要求对「发布动作」闸不适用（此登记即解释）· **不拆 task**
- **闸行裁决**：W7 不设 HG-SCHEMA-CHANGE 新行（10-task 起草四理由 + 升级条款 · 留 20 复核）

## 派发链

W0–W6 全 done（W6 终局 841/160/840/0/1）→ 10-task 起草（S7.1–S7.10 十面 + 基线复跑 + 坏链两级/spawn 671/证据 31/K 落点实测 + 起草发现 CHANGELOG:10 已 published）→ **00 代签 HG-TASK-DRAFT** → 20-task-audit **R1**（BLOCKING 1 + advisory 7 · 退回 10-task）→ 10-task B1 回填（方案 b 精确枚举）→ **R2**（根因定位：canonical 被当 forbidden）→ 10-task A/B 正名回填（弃用词判据）→ **R3**（PASS · A12/A13 搭车修）→ **00 代签 HG-AUDIT-R1** + pre-30 invoke 五件套齐（10/20×3/00）→ 30。

## 关键裁定

1. **HG-RELEASE 不拦 30**（00 · 2026-09-17）：`blocks_hats` 30 → `—` · 理由 = 发布动作闸（tag/publish/push 仅人）非代码变更闸 · 发布前探针与 compat 项由验收 #9/§S7.10 承载 · **不拆 task** · 00 显式确认 A1 偏差并建议 10-spec 后续给 SPEC §10 加注记
2. **E3 重定基**（00）：<50 按旧 354 快照口径不可达已由 W0 F-W0-08 重建（354→580→520→现 671 · 真实值变化非回归）· 显式登记「<50 归 3.x/后续波次」· 目标定稿 **≤300（规范下限 · 机检）** · F-W7-07 STOP 保留
3. **链接 S2 豁免**（00 接受等价口径）：S2 永不覆写优先于链接字面 ⇒ S2 域 26 处冻结基线 + 参数化排除 current task 路径 · active/ 其他新增坏链仍拦 · 非 S2 硬判 0
4. **术语 canonical 正名**（00 最终裁定 · 基于 GLOSSARY 真值亲读）：撤销 `人闸` 弃用词定性（GLOSSARY 五保留词 · 与 `人工闸` 节名/表名二者均合法）· 唯一判红 = 变体词 `门控`（应为 `门禁`）· 判红面 = 六目标闭集（README 双语/GLOSSARY/RELEASING[除 skip]/MIGRATION/delivery/promotion）· 闭集外不扫 + `.workbuddy/output/**` 豁免 · 残留守 0
5. **A1 显式确认**：HG-RELEASE 不适用 blocks-30 强制（发布动作闸语义）· **tag 取严 = 3.0.0 tag 留维护者**（与 AGENTS.md 本地块一致 · SPEC§3⑩/RELEASING⑤/README:380 的 Agent 可 tag 口径本波不执行 · 差异登记留 W7 报告）
6. **A12/A13 处置**：A12 六目标闭集 + `.workbuddy/output/**` 豁免行 · A13 基线 `人闸` 计次 74 / 行口径 task 65 vs 20 审 67 ±2 · 30 复跑重建登记（F-W0-05 式）
7. **commit 授权**：本笔 commit（task + R1/R2/R3 审查文 + invokes/by-task/3-0-w7-closeout-external/ 全目录）为 00 当次书面授权 · 显式列路径 · 禁 add -A · 不 push

## 未做（禁区）

- 未实现代码 · 未改 SPEC/PLAN/src/scripts/assets/test/交付物料既有件（30 的事）
- 未 push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 四动作余者仅人）

## 下一棒

30 实现棒：GATE_VERIFY（双闸 approved · pre-30 invoke 五件套齐 · VERIFY: PASS）→ 按 task S7.1–S7.10 执行 → 验收 14 条全绿 → 40 复核 → `task close --yes` 关账。
