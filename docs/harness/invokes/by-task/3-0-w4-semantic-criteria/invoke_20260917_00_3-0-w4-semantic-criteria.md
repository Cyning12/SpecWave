# Invoke：00（统筹）· 3-0-w4-semantic-criteria

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-w4-semantic-criteria` |
| task_paths | `docs/tasks/active/task_3_0_w4_semantic_criteria.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 人授权（原文意图）

维护者 2026-09-16 本窗：**PLAN_3_0 + 3.0 SPEC 系列双签 approved**，原话「**签收，授权00签收后续所有文档**」——授权 00 代签后续过程文档闸（**HG-RELEASE / npm publish / tag / push 不在范围** · 发布四动作仅人不变）。**00 只委派不亲自实现**（harness-00-delegate-only 口径）。

## 闸扫描与代签依据

- 上游双闸：HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗 · 落 task `### 人工闸` 表）
- HG-TASK-DRAFT=approved（**2026-09-17 00 代签** · 同授权 · task lint PASS）
- HG-AUDIT-R1=approved（**2026-09-17 00 代签** · 同授权 · 依据审查文 `docs/harness/reviews/task_3_0_w4_semantic_criteria_audit_R1_20260917.md`：R1 · PASS-with-issues · blocking 0 · advisory A1–A4）
- **闸行裁决**：W4 不设 HG-SCHEMA-CHANGE 新行（10-task 起草裁决 · 三理由 + 升级条款落 task 闸表下注 · 20-task-audit R1 复核通过：裁决成立且为三波先例中最干净一例 · 理由①类比标注小疵 advisory A4 注记 · operative 论据 = 硬约束 3 闸对象限定为结构格式变更 + D-23-W2-CHECK-FORM 数据面既定（yaml :64-65/:177 注释 20 审实证））

## 派发链

W3 done（773/145/772/0/1 锁终态）→ W4 评审先行（评审文落盘 217 行 · 六判据形态定稿 + 存量全量实测 + OQ-1–OQ-4 荐案 · D-24-W2-REVIEW-FIRST 循例兑现 · SPEC 范围⑧已销）→ 10-task 起草（规格化七项 + 基线复跑 + 6 件误伤名单落盘核实 · 见 10 invoke）→ **00 代签 HG-TASK-DRAFT**（+ 头部闸态同步授权）→ 20-task-audit R1 书面审（PASS-with-issues · blocking 0 · 独立复跑全部基线数字 + 30+ 处行号抽核 + 评审文实测数字探针复刻全量复跑逐字一致 + grep 新发现 A1/A2 两补列项 · 见 20 invoke）→ **00 代签 HG-AUDIT-R1** + pre-30 invoke 三件套补落（10/20/00 齐 · W1/W2/W3 先例）→ 30/40。

## 关键裁定

1. **双签承接与顺序**（硬约束 6/7/11/15 同构）：task 落闸行（双 pending）→ HG-TASK-DRAFT 代签 → 20 审查文落盘 → HG-AUDIT-R1 代签 → 30 改码；泛化机检全程咬住（pending 期 verify 实证 exit 2 拒 30 · 双签后 + invoke 三件套齐 VERIFY: PASS）
2. **四 advisory 处置**（全部带入 30 执行要求 · 落 HG-AUDIT-R1 行注明）：
   - **A1（登记级）**：NEW-10 A1 将咬 **4 处既有豁免 fixture**（`test/cli-w4-gate-wiring.test.ts:304-320`（2.3-W4 四字段齐 · authorized_by `00（fixture）` · A1 ②③ 不合）· :336-352（N14 meta slug 豁免命中 · 同形态）· 另两处同文件同形态 +`"00"` ×1）—— **30 执行要求**：A1 判据上线与 4 处 fixture 重锚（authorized_by 改过 A1 形态）**同 commit** + 逐条入验收 #11 既有面登记清单（F-W2-13 同式纪律）
   - **A2（登记级）**：`test/pins-consistency.test.ts:1301-1311` 断言真仓 pin-08 semantics 含「规划中…行身份合格」旧句 —— S5.5 S_mid 绑定把规划中/planned 纳入发布态集，旧句描述将被替换的宽松口径 —— **30 执行要求**：semantics 改写与该断言更新**同 commit** + 登记
   - **A3（口径级）**：验收 #2 复跑分母写明 = **88 基线集**（第 89 件 = 评审文自身 · 无结论节 · 不被 findLatestReview 消费 · 分母 63 不变）· 30 复跑按 88 基线集口径执行并写明
   - **A4（标注级）**：闸行裁决理由①自引「类比 W3 闸行裁决②」标注小疵（「按已批准 schema 写数据」系 W2 理由②原文）—— 注记：30/00 引用闸行裁决时以闸对象论 + 数据面既定论为主论据 · 类比仅旁证（与 W2/W3 R1 同型处置）
3. **档位裁定确认**：20 审重点 1 裁定**维持档 M**（误伤 6 件枚举个案探针复现逐字一致 · 档 S 备选通道未启用 · 改档不属范围违约定性成立）—— 00 认可 · 6 件豁免登记清单照评审文 §7 底稿执行

## 未做（禁区）

- 未实现代码 · 未改 SPEC/PLAN/src/test/yaml 既有件（30 的事）
- 未 push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 四动作余者仅人）

## 下一棒

30 实现棒：GATE_VERIFY（双闸 approved · pre-30 invoke 三件套齐 · VERIFY: PASS）→ 按 task S5.1–S5.8 执行（红测先行 · K 断言同 commit 硬锁 · A1/A2 同 commit 重锚+登记 · 复跑分母 88 基线集 · 存量波及与评审文 §7 基线核对）→ 验收 13 条全绿 → 40 复核 → `task close --yes` 关账（00 口径：close 待 40 后另放行）。
