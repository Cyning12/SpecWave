# 04 · W4 · A5+A6 闸语义接线（gate wiring）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）· 隶属 `2_3-wiring-completion`  
> **test_strategy**：`required`（每闸负向真失败 + 正向回归 + discipline-coverage 状态联动）  
> **上游**：路线 §2.2/§4 A5/A6 · `discipline-coverage.yaml` 四项 not_wired（**注意：yaml note 部分过期**——as_of 2.2.1 停在 2026-08-24 T4/T5/T6 接线之前未回写，本表 §1 已按 W4 棒证据级复核更正 · HEAD=661f6e2）· `src/cli-status.ts:94-97` 代理口径注释 · PROMPT §3 W4 行  
> **⚠️ 硬前置（D-23-W4-REVIEW-FIRST · 已定案）**：**门禁语义变更须先出接线方案评审文（落盘 `docs/harness/reviews/`）并经 20-task-audit R1，评审通过前 30 拒改码。**

---

## 1. 背景

`discipline-coverage.yaml` 自我登记的 4 项 `not_wired` 闸（诚实披露是本仓卖点，但「诚实靠注释维持」正是路线第一主线要根治的病灶）：

| 闸 | 标题 | 现状（W4 棒证据级复核 · HEAD=661f6e2 · **更正 yaml note 过期口径**） |
|----|------|------------------|
| **G2** | reviews 留档闸 | yaml note「verify/close 无 reviews 闸」**不成立**：`verify --task` 已有 R<n> 审查文**存在性**硬闸（`cli.ts:827-833` · b7c15ae DEF-003 T4）；`task close` 已有 close_review 存在性闸（`cli.ts:46` → `evalCloseReview` `cli-checks.ts:184-192` · 5eac847 T6）。**真正未接线 = 结论级「R1 通过判定」**：全 `src/` 无审查文结论解析 |
| **G4** | 思考轮结构 | 实质属实（行号漂移：实际 `cli-checks.ts:838-843` 非 `cli.ts:498-503`）；本包仅 W4 warn-only · 旧包 E8–E10 结构断言未随包 |
| **FULL-reviews** | 裸 verify 全量 reviews + 双路径 | 前半属实（裸 `verify` 不存在 · `cli.ts:775`）；后半「不查 reviews」**有误**（--task 模式已查 · 见 G2 行） |
| **INVOKE-HATS** | 多帽 invoke 留档集合闸 | yaml note「close 无 invoke 集合闸」**不成立**：close_invoke 帽集合闸已接线（CLOSE_GUARD_ORDER 首项 → `evalCloseInvokeHats` `cli-checks.ts:170-182`）。**属实仅剩**：`task lint-done` 仍 slug 级存在性（`cli-task-extra.ts:323-344` 不查帽集合） |

另有 **A6 · `reviews.CLOSE` 代理口径**：`cli-status.ts:94-97` 注释自认「非『close 审查通过』强证据」（复核属实 · 仍在）——存在「未审查即可关账」路径。事实卡 §11 据此禁称「关账必经审查通过」。

**根因留痕（机制债）**：本次前提证伪的根因是 `discipline-coverage.yaml` 的 note/**as_of 回写滞后**——T4/T5/T6 接线落地后 note 未同步更新，「诚实靠人写注释维持」的病灶在覆盖表自身复发。本波范围⑦因此**必须含 note 回写**（接线证据 + 正确行号 + as_of 对齐）；若某项显式不回写须在 task 报告说明理由。

## 2. 目标

四项 not_wired 闸完成接线（声明 → 接线 → 可验证），`reviews.CLOSE` 从代理口径升级为强证据；接线后 `discipline-coverage.yaml` 状态如实变更（pin-04 联动）。

## 3. 范围

| # | 项 | 内容 |
|---|----|------|
| ① | **接线方案评审文**（先行） | 四项闸 + reviews.CLOSE 的接线语义逐项设计：触发点（verify/close/lint-done 哪一处）· 判定口径 · 失败行为（exit 2 / warn）· 豁免与过渡 · 误伤面评估（存量 task 合规率摸底）——落盘 `docs/harness/reviews/` |
| ② | G2 reviews 留档闸**存在级→结论级升级** | 存在性闸已接线（verify `cli.ts:827-833` · close `cli-checks.ts:184-192`）；本波升级 = **R1 通过判定（结论级）**：解析审查文结论（pass/阻塞项）· 按评审定稿接入 close/verify 判定链 |
| ③ | G4 思考轮结构接线 | 按评审定稿（候选：lint 级 E8–E10 结构断言）；**维持 warn-only 过渡**（00 裁决 · 见 §5.4） |
| ④ | FULL-reviews 接线 | 按评审定稿（候选：裸 `verify`（无 --task）扫 reviews 双路径）；口径更正：--task 模式已查 reviews（本波不重复接线该面） |
| ⑤ | INVOKE-HATS **帽级升级（lint-done）** | close_invoke 帽集合闸已接线（`cli-checks.ts:170-182`）；本波升级 = `task lint-done` 从 slug 级存在性升级为**帽集合校验**（复用 `missingInvokeHats` 既有实现） |
| ⑥ | A6 reviews.CLOSE 语义补强 | status 的 reviews.CLOSE 从「已归档」代理口径升级为「close 审查通过」强证据口径；注释与 `discipline show` 输出同步 |
| ⑦ | `discipline-coverage.yaml` 状态 + **note 回写** | 四项 not_wired → closed（含 `closed_in: "2.3.0"` · 接线证据 note 含**正确行号** · as_of 回写对齐）；pin-04 随 bump 联动；**note 回写为本波必做**（根因留痕见 §1 · 显式不回写须 task 报告说明） |

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
3. **存量误伤面**：**已实测**（W4 棒 · §5.4：G2 91.5% / INVOKE-HATS 72.9% / G4 44%）——评审文引用该数据即可，无需重复摸底。
4. **过渡机制**：**已定案（§5.4 · 00 裁决）**——闸新行为不追溯存量（仅对 2.3.0 起新 task 生效）+ G4 维持 warn-only；评审文只需定稿「新 task」判定口径。
5. **事实卡联动**：reviews.CLOSE 升级后，§11「关账必经审查通过」禁称是否解禁（须 20-spec-audit 或维护者口径确认）。

### 5.2 reviews.CLOSE 候选语义

- 现状：`status` 里 reviews.CLOSE = 「reviews 目录存在该 task 相关归档文件」（代理）。
- 候选（评审定）：close 时校验「该 task 的 20-task-audit 审查文存在且结论 pass」→ status 口径改读真实审查结论；`task close` 的 6 项检查保持不变或并入。

### 5.4 过渡口径定案（00 裁决 · 2026-09-12 · 循 W2 先例）

W4 棒存量合规率摸底（59 done task · 复用 `cli-checks` 单一实现源实测）：

| 闸 | 存量合规率 | 追溯后果 |
|----|-----------|----------|
| G2 reviews 存在率 | 54/59 = **91.5%**（缺者均 w0-planning/signoff 类） | 追溯即 5 项历史 task 红 |
| INVOKE-HATS required 帽集合 | 43/59 = **72.9%**（rename/2.1.x 波缺 30/40 · w0 缺 00） | 追溯即 16 项红 |
| G4 思考轮节 | 26/59 = **44%**（完整 R0–R5 仅 12/26） | 追溯即大面积红 |

**定案**：① **闸新行为不追溯存量**——新接线判定仅对 2.3.0 起新 task 生效（存量 72.9%/44% 若追溯，F-W4-01 熔断必然触发，等于借接线之名行大面积打红之实）；② **G4 维持 warn-only 过渡**，退出条件须在评审文写死（防「永久 warn」）；③ 过渡机制的「新 task」判定口径（task 创建时间 / epic_slug 属 2.3 系列 / 数据清单）随评审文定稿。

### 5.3 既有实现复用

- `cli-checks.ts`：`collectInvokeHats` / `missingInvokeHats`（INVOKE-HATS 直接复用）· `findSpecReview` / `findReview`（G2/FULL-reviews 复用单一实现源）。
- 原则：**接线优先复用既有判定函数，不新造并行实现**（沿袭 SPEC-reviews 单一实现源先例）。

## 6. 方案对比（R2 摘要 · 方向级）

| 方案 | 结论 | 理由 |
|------|------|------|
| 先评审文后实现（D-23-W4-REVIEW-FIRST） | **已定案** | PROMPT 硬性要求 · 门禁语义影响全消费者 failClosed 行为 |
| 四闸一次全接（单 task 单波） | **采纳** | 同一语义族 · 评审一次覆盖 · discipline-coverage 一次更新 |
| 四闸分波接线 | 弃选 | 语义耦合（reviews 族 G2/FULL-reviews/A6 相互牵连），拆开评审会互相推翻 |
| G4 直接 failClosed | 弃选（**定案 warn-only**） | 存量实测仅 44% 合规（§5.4）· 00 裁决维持 warn-only 过渡，退出条件评审文写死 |
| 新造判定实现 | 弃选 | 复用 cli-checks 既有函数（单一实现源纪律） |

## 7. 验收标准

1. **评审文先行**：`docs/harness/reviews/` 落盘接线方案评审文，含 §5.1 五问逐项答案 + 存量摸底数据；经 20-task-audit R1 通过。
2. **四闸负向真失败**：每闸构造违规靶场 → 对应命令按评审定档失败（exit 2 或 warn）；贴命令与输出。
3. **正向回归**：本仓 done task 全集在新口径下**不追溯打红**（§5.4 定案）；新 task 靶场按新口径判定；`npm test` 全绿。
4. **reviews.CLOSE**：status 输出新口径有测；事实卡 §11 禁称处置结论落评审文。
5. **discipline-coverage**：四项状态变更 + note 含接线证据（`src` 位置）；`discipline show` 实测分布变化；`pins check` PASS。
6. `npm run typecheck` 0 错。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W4-01 | 存量 task 大面积不合规（实测 72.9%/44% · §5.4） | **已被 §5.4 定案消解**：新行为不追溯存量；若「新 task」判定口径漏判致存量被打红 → **STOP 上报** · 退回评审修口径 |
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
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-12 维护者会话授权 00 代签 · **修订重签 #2：W4 前提部分证伪** · 00 裁决=A · 与 2.2.0/2.2.1 同模式） | ~~本 SPEC 定稿 · 冻结 D-23-W4-REVIEW-FIRST~~（已冻结 · 修订后维持 · 新增 §5.4 过渡口径定案） |
| HG-AUDIT-R1（W4 task） | pending | W4 30 改码前（task 阶段 00 代签 · **评审文落盘+R1 通过为前置**） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | draft · 10-spec · 四闸 not_wired 现状复核 · 评审先行硬前置 |
| 2026-09-12 | signed · HG-SPEC-SIGNOFF approved（00 代签） |
| 2026-09-12 | **修订 #2** · W4 10-task R0 证据级证伪（yaml note 过期 · as_of 停在 T4/T5/T6 接线前未回写）：G2/INVOKE-HATS「未接线」不成立（存在级已接线 · 真正缺口为结论级/帽级）· G4 行号漂移 · FULL-reviews 后半有误 · A6 属实；00 裁决=A（循 W2 先例修订重签）：范围②⑤改「存在级→结论级/帽级升级」· §5.4 过渡口径定案（不追溯存量 + G4 warn-only · 存量摸底 91.5%/72.9%/44% 入档）· 范围⑦含 note 回写 · HG-SPEC-SIGNOFF 重签 |
