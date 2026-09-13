# 04 · W4 · A5+A6 闸语义接线（gate wiring）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）· 隶属 `2_3-wiring-completion`  
> **test_strategy**：`required`（每闸负向真失败 + 正向回归 + discipline-coverage 状态联动）  
> **上游**：路线 §2.2/§4 A5/A6 · `discipline-coverage.yaml` 四项 not_wired（本棒复核 :29-33/:39-43/:64-68/:74-78 属实）· `src/cli-status.ts:94` 代理口径注释 · PROMPT §3 W4 行  
> **⚠️ 硬前置（D-23-W4-REVIEW-FIRST · 已定案）**：**门禁语义变更须先出接线方案评审文（落盘 `docs/harness/reviews/`）并经 20-task-audit R1，评审通过前 30 拒改码。**

---

## 1. 背景

`discipline-coverage.yaml` 自我登记的 4 项 `not_wired` 闸（诚实披露是本仓卖点，但「诚实靠注释维持」正是路线第一主线要根治的病灶）：

| 闸 | 标题 | 现状（本棒复核） |
|----|------|------------------|
| **G2** | reviews 留档闸 | `findReview` 仅 status 使用（`cli-status.ts:70`）；verify/close 无 reviews 闸 |
| **G4** | 思考轮结构 | 本包仅 W4 warn-only（`cli.ts:498-503`） |
| **FULL-reviews** | 裸 verify 全量 reviews + 双路径 | verify 须 --task 且不查 reviews（`cli.ts:402`） |
| **INVOKE-HATS** | 多帽 invoke 留档集合闸 | close 无 invoke 集合闸；`task lint-done` 仅 slug 级 |

另有 **A6 · `reviews.CLOSE` 代理口径**：`cli-status.ts:94-107` 注释自认「非『close 审查通过』强证据」——存在「未审查即可关账」路径。事实卡 §11 据此禁称「关账必经审查通过」。

## 2. 目标

四项 not_wired 闸完成接线（声明 → 接线 → 可验证），`reviews.CLOSE` 从代理口径升级为强证据；接线后 `discipline-coverage.yaml` 状态如实变更（pin-04 联动）。

## 3. 范围

| # | 项 | 内容 |
|---|----|------|
| ① | **接线方案评审文**（先行） | 四项闸 + reviews.CLOSE 的接线语义逐项设计：触发点（verify/close/lint-done 哪一处）· 判定口径 · 失败行为（exit 2 / warn）· 豁免与过渡 · 误伤面评估（存量 task 合规率摸底）——落盘 `docs/harness/reviews/` |
| ② | G2 reviews 留档闸接线 | 按评审定稿（候选：`task close` 前置 reviews 存在性 + R1 通过判定） |
| ③ | G4 思考轮结构接线 | 按评审定稿（候选：lint 级 E8–E10 结构断言 · warn-only 过渡窗） |
| ④ | FULL-reviews 接线 | 按评审定稿（候选：裸 `verify`（无 --task）扫 reviews 双路径） |
| ⑤ | INVOKE-HATS 接线 | 按评审定稿（候选：close 前置 invoke 帽集合闸 · 复用 `cli-checks.ts` `missingInvokeHats` 既有实现） |
| ⑥ | A6 reviews.CLOSE 语义补强 | status 的 reviews.CLOSE 从「已归档」代理口径升级为「close 审查通过」强证据口径；注释与 `discipline show` 输出同步 |
| ⑦ | `discipline-coverage.yaml` 状态更新 | 四项 not_wired → closed（含 `closed_in: "2.3.0"` 与接线证据 note）；pin-04 随 bump 联动 |

## 4. 非范围

| 项 | 理由 |
|----|------|
| deferred 三项（G6 git 行为层 · G7 执行证据 · N2-C verify 含 lint） | 路线明确定性 deferred · 不在 A5 |
| host hooks 化（闸装进宿主） | A3 · 3.0 · 触 schema 即 STOP |
| 新豁免命令行旗标 | P0 纪律；过渡走数据/配置（评审定） |
| 改变既有闸（G1/G3 等 closed 项）语义 | 本波只接线 not_wired |
| ontology-check（A4） | 3.0 |

## 5. 设计（评审前的候选口径 · 非定稿）

### 5.1 接线评审文必答问题（每项闸）

1. **触发点**：verify / gate-check / close / lint-done 哪一处或多处？
2. **失败档**：exit 2 failClosed 还是 warn-only 起步？（G4 有 warn-only 现状先例）
3. **存量误伤面**：本仓 `docs/tasks/done/` 全部已归档 task 在新口径下合规率多少？（摸底数据必须入评审文）
4. **过渡机制**：数据级豁免清单 / 宽限波次 / 仅对新 task 生效——三选一或组合。
5. **事实卡联动**：reviews.CLOSE 升级后，§11「关账必经审查通过」禁称是否解禁（须 20-spec-audit 或维护者口径确认）。

### 5.2 reviews.CLOSE 候选语义

- 现状：`status` 里 reviews.CLOSE = 「reviews 目录存在该 task 相关归档文件」（代理）。
- 候选（评审定）：close 时校验「该 task 的 20-task-audit 审查文存在且结论 pass」→ status 口径改读真实审查结论；`task close` 的 6 项检查保持不变或并入。

### 5.3 既有实现复用

- `cli-checks.ts`：`collectInvokeHats` / `missingInvokeHats`（INVOKE-HATS 直接复用）· `findSpecReview` / `findReview`（G2/FULL-reviews 复用单一实现源）。
- 原则：**接线优先复用既有判定函数，不新造并行实现**（沿袭 SPEC-reviews 单一实现源先例）。

## 6. 方案对比（R2 摘要 · 方向级）

| 方案 | 结论 | 理由 |
|------|------|------|
| 先评审文后实现（D-23-W4-REVIEW-FIRST） | **已定案** | PROMPT 硬性要求 · 门禁语义影响全消费者 failClosed 行为 |
| 四闸一次全接（单 task 单波） | **采纳** | 同一语义族 · 评审一次覆盖 · discipline-coverage 一次更新 |
| 四闸分波接线 | 弃选 | 语义耦合（reviews 族 G2/FULL-reviews/A6 相互牵连），拆开评审会互相推翻 |
| G4 直接 failClosed | 弃选（倾向） | 存量 task 思考轮结构合规率未知 · warn-only 过渡更稳；评审摸底后定 |
| 新造判定实现 | 弃选 | 复用 cli-checks 既有函数（单一实现源纪律） |

## 7. 验收标准

1. **评审文先行**：`docs/harness/reviews/` 落盘接线方案评审文，含 §5.1 五问逐项答案 + 存量摸底数据；经 20-task-audit R1 通过。
2. **四闸负向真失败**：每闸构造违规靶场 → 对应命令按评审定档失败（exit 2 或 warn）；贴命令与输出。
3. **正向回归**：本仓 done task 全集在新口径下按过渡机制处理（合规直通 / 豁免入数据）；`npm test` 全绿。
4. **reviews.CLOSE**：status 输出新口径有测；事实卡 §11 禁称处置结论落评审文。
5. **discipline-coverage**：四项状态变更 + note 含接线证据（`src` 位置）；`discipline show` 实测分布变化；`pins check` PASS。
6. `npm run typecheck` 0 错。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W4-01 | 存量 task 大面积不合规（摸底 <阈值） | **STOP 上报**：评审文降级该闸为 warn-only 起步或推迟接线 · 不硬接 |
| F-W4-02 | 评审未通过（五问无答案 / 误伤面未摸底） | 30 拒改码 · 退回评审 |
| F-W4-03 | 闸判定函数与 SPEC-reviews 既有实现分叉 | 退回重构为复用（单一实现源纪律） |
| F-W4-04 | 豁免数据被滥用为新绕过口 | 豁免走数据文件 + 留痕要求（谁/何时/理由）· 评审文钉格式 |
| F-W4-05 | reviews.CLOSE 升级后禁称口径争议 | 事实卡 §11 行未正式解禁前，对外仍按禁称执行 |
| F-W4-06 | discipline-coverage 状态改了但 note 无证据 | pin/测试断言 note 含 `src/` 引用（数据完整性评审点） |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = 路线 §2.2 A5/A6 + discipline-coverage 四项 not_wired（本棒复核行号）+ cli-status:94 注释 | no |
| R1 | 范围 = ①–⑦（评审文 + 四闸 + CLOSE + 覆盖表）；非范围 = deferred 三项 / hooks / 新豁免旗标 / 既有闸语义 | no |
| R2 | §6 表：评审先行 **定案** / 单波 **荐** / 分波 弃 / G4 直接 failClosed 弃 / 新造实现 弃 | no |
| R3 | 边界：存量误伤 STOP 条件 · 单一实现源 · 豁免数据化 · 禁称联动 | no |
| R4 | `test_strategy=required`：每闸负向真失败 + 正向回归 + 覆盖表联动 | no |
| R5 | **已签收**（2026-09-12 · HG-SPEC-SIGNOFF=approved · 00 代签）· 下一棒：00 拆 W4 task（评审文为 task 内第一交付物） | no |

**residual_risks**：本波是全 2.3 语义风险最高波——任何闸严化都改变消费者 failClosed 面；评审文的存量摸底是熔断器（F-W4-01）。G4 warn-only 过渡窗的退出条件须在评审文写死，防「永久 warn」。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-12 维护者会话授权 00 代签 · 与 2.2.0/2.2.1 同模式） | ~~本 SPEC 定稿 · 冻结 D-23-W4-REVIEW-FIRST~~（已冻结） |
| HG-AUDIT-R1（W4 task） | pending | W4 30 改码前（task 阶段 00 代签 · **评审文落盘+R1 通过为前置**） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | draft · 10-spec · 四闸 not_wired 现状复核 · 评审先行硬前置 |
| 2026-09-12 | signed · HG-SPEC-SIGNOFF approved（00 代签） |
