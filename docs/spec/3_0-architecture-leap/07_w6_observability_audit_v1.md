# 07 · W6 · 可观测与审计（observability & audit）

> **状态**：`signed`（**HG-SPEC-SIGNOFF=approved** · 2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）  
> **隶属**：`3_0-architecture-leap` · 靠后波（消费前序波次产出的真值面：discipline 覆盖率 · hooks 执行证据）  
> **test_strategy**：`required`（负向 fixture + FAIL 率前后数字 + 快照断言）  
> **上游**：PLAN_3_0 W6 节 · 路线研究 §4 主线三/六（C6/F4）· `assets/harness/discipline-coverage.yaml` `not_wired` G2/G4 · `deferred` G6/G7/N2-C（校核 #10/#11/#12）

---

## 1. 背景

三路可观测债：① **C6** —— `audit` 不落痕（无结构化审计日志，过程证据只能靠聊天与 invoke 快照）；② **F4** —— S2 公理接的是纸面/代理口径，非真实触发源；③ **闸未接线** —— `discipline-coverage.yaml` 登记的 `not_wired`（G2 reviews 存在性闸 · G4 思考轮控制表）与 `deferred`（N2-C lint→block · G7 执行证据）项，即「闸写了但判定逻辑没接」。

## 2. 目标

C6 结构化审计日志落盘（**独立于 S2 过程轨** · 机读字段完备）· F4 S2 公理接真实触发源 · 闸未接线补全（G2 / G4 / N2-C / G7），并把 `discipline-coverage.yaml` 对应项回写为 `mechanical/closed`。

## 3. 范围

| # | 项 | 形态 | 出处 |
|---|----|------|------|
| ① | **C6 · 结构化审计日志落盘**：机读字段完备（schema 化 + 快照断言）· **独立于 S2 过程轨** · 本地落盘 | 审计日志模块 + 落点（**永不入 S2 三域** · 00 §1） | 路线 §4 主线三 · 校核 #10 |
| ② | **F4 · S2 公理接真实触发源**：当前纸面/代理口径 → 真实触发源 | 触发源接线 + fixture | 路线 §4 主线六 · 校核 #11 |
| ③ | **G2 · reviews 存在性闸接线**：`verify --task` / `task close` 检查审查文存在性（缺 → BLOCKED 点名） | 判据接线 + 负向 fixture 真红 | discipline-coverage `not_wired` |
| ④ | **G4 · 思考轮控制表闸接线**：思考轮控制表存在/完备性入判定 | 判据接线 + 负向 fixture | discipline-coverage `not_wired` |
| ⑤ | **N2-C · `verify --task` 补 lint 步**：lint 入 verify 链路（`cli.ts` · W0 后 `src/cli/verify.ts`）· **FAIL 率须实测下降（前后数字）** | 链路接线 + 实测指标 | discipline-coverage `deferred` |
| ⑥ | **G7 · 执行证据（runner）**：执行证据面接线 | 判据接线 + fixture | discipline-coverage `deferred` |
| ⑦ | **coverage 回写**：`discipline-coverage.yaml` 对应项 `not_wired`/`deferred` → `mechanical`/`closed` | 数据回写 + 机检一致 | PLAN W6 验收④ |

## 4. 非范围

| 项 | 理由 |
|----|------|
| 遥测上报 / 接外部日志服务 | 本地落盘即可（PLAN W6 明示） |
| **审计日志写入 S2 三域** | **禁区**（硬约束 1 · 00 §1 · 「永不覆写」边界） |
| G6 归档类 | 归 W7（术语统一 + 引用一致 + 冲突裁决） |

## 5. 设计要点

- **C6 与 S2 过程域边界**（本波最大风险点）：审计日志是**独立的机读过程轨**（落点 task 定稿 · 候选 `docs/harness/audit/` 或仓内新轨），**只新增不覆写**同 S2，但**永不**写入 `docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/` 三域；字段 schema 化（事件类型 / 时间 / task / 闸态 / 结果 · 具体字段 task 定稿）。
- **N2-C 完成判据**（沿用 2.4 PLAN 硬约束「修严型必须配负向 fixture 回归锁」精神）：FAIL 率**不降则本项不得标记完成** —— 接线后须给前后实测数字。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 审计日志 = 本地结构化落盘（独立轨） | **采纳** | 机读可消费 · 不接外部服务（遥测冻结面）· 独立 S2 保「永不覆写」 |
| 审计日志 = 写入 S2 三域 | 弃选 | 违硬约束 1（S2 过程域永不覆写 · 边界混淆） |
| N2-C 完成 = FAIL 率实测下降 | **采纳** | 防「接了线但没效果」式假完成（2.4 硬约束精神沿用） |
| N2-C 完成 = 接线即算 | 弃选 | 无效接线无法被识别 |

## 7. 验收标准（必须自证，不接受「我改完了」）

1. **审计日志字段完备且可机读**：schema 化 + 快照断言（字段集 / 类型 / 必填性）。
2. **G2/G4 负向 fixture 真红**：缺审查文 → BLOCKED 点名；缺思考轮控制表 → BLOCKED 点名。
3. **N2-C FAIL 率实测下降**：给前后数字（接线前基线 vs 接线后）· **不降不得标记完成**。
4. **coverage 回写机检**：`discipline-coverage.yaml` 对应项 `not_wired` → `mechanical`/`closed`，且与 `discipline show` 输出一致（W3 F2 后的真口径面）。
5. **审计落点不在 S2 三域**（机械断言）。
6. `npm run typecheck` 0 错 · `npm test` 全绿（含新增）。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W6-01 | 审计日志落盘失败（权限/磁盘） | 门禁主流程不受影响（审计是观测面 · 降级留痕不阻断）· 但落盘失败须显式 warning |
| F-W6-02 | 审计日志被指向 S2 三域 | 机械拒写（与 S2 保护同语义）· 无豁免参数 |
| F-W6-03 | G2 接线误伤存量合规 task | 不追溯存量（硬约束 7）· 波及入豁免留痕 |
| F-W6-04 | N2-C 接线后 FAIL 率不降 | 本项不得标记完成 · 回查 lint 步是否真的入链 |
| F-W6-05 | F4 真实触发源不可达（环境缺触发条件） | 分档诊断（硬约束 10 精神）· 纸面口径与真实口径输出可区分 |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = `discipline-coverage.yaml` `not_wired` G2/G4 + `deferred` G6/G7/N2-C 登记 · 路线 §4 主线三/六 · PLAN W6 节 | no |
| R1 | 范围 = ①–⑦；非范围 = 遥测 / 外部日志服务 / S2 写入 / G6（归 W7） | no |
| R2 | §6 表：独立审计轨 vs 写 S2 · FAIL 率判据 vs 接线即算 | no |
| R3 | 边界：C6↔S2 边界明示 · 审计是观测面不阻断主流程 · N2-C 不降不完成 | no |
| R4 | `test_strategy=required`：快照断言 + G2/G4 负向 fixture + FAIL 率前后数字 | no |
| R5 | **已签收**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）· 下一棒：00 逐波拆 task（10-task）→ 20-task-audit → HG-AUDIT-R1（00 代签）→ 30/40 | no |

**residual_risks**：① C6 落点未定时与既有轨道的边界争议（缓解：task 定稿 + 机械断言 #5）；② G7「执行证据」定义在 discipline-coverage 中粒度较粗（缓解：task 阶段对照 yaml 语义细化判据）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）| 本 SPEC 定稿 |
| HG-AUDIT-R1（W6 task） | pending | W6 30 改码前 |

> **机检诚实登记**：本表位于 SPEC 档（非 task 文 `### 人工闸` 节），`parseHumanGates` 不采集 ⇒ 不可机检 · 纯人工纪律；task 拆单时须把对应闸行复制进 task 文 `### 人工闸` 表（`blocks_hats` 按需含 `30`）才受 30 判定约束（硬约束 15）。

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-16 | draft · 10-spec · 自 PLAN W6 + discipline-coverage 登记收敛 |
| 2026-09-16 | 10-spec 修订 · 20-spec-audit R1 advisory A1 落实（标注/登记级 · 无实质变更） |
| 2026-09-16 | signed · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗双签（原文：「签收，授权00签收后续所有文档」）· 授权 00 代签本版后续全部过程文档闸（与 2.3.0/2.4.0 同模式）· HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人）· R5 回填 |
