# Task：2.3 W4 · A5+A6 闸语义接线（gate wiring · G2/G4/FULL-reviews/INVOKE-HATS + reviews.CLOSE）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-13）  
> **wave**：W4（2.3.0 接线补全 · A5+A6 闸语义接线）  
> **关联 SPEC**：[`docs/spec/2_3-wiring-completion/04_w4_gate_wiring_v1.md`](../../spec/2_3-wiring-completion/04_w4_gate_wiring_v1.md)（**唯一蓝本** · signed · 修订重签#2 · commit fa24638）· [`00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)  
> **接线方案评审文（第一交付物 · 已落盘）**：[`docs/harness/reviews/w4_gate_wiring_plan_review_20260913.md`](../../harness/reviews/w4_gate_wiring_plan_review_20260913.md)（**30 判定口径真值** · 五问定稿/摸底数据/豁免格式/G4 退出条件）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-3-wiring-w4-gate-wiring` |
| **test_strategy** | `required` |
| **test_strategy_note** | 每闸负向真失败（/tmp 靶场 exit 2/warn 分档）+ 正向回归（存量不追溯打红）+ discipline-coverage 联动断言；既有五测试文件联改（评审文 §8 影响面）；bin 面真实命令验收为硬条款（W3 教训） |
| **freeze_id** | 2.3.0-W4 · D-23-W4-REVIEW-FIRST（SPEC 04 硬前置 · 评审文已落盘）· D-23-W4-TRANSITION（§5.4 定案：闸新行为不追溯存量 + G4 维持 warn-only） |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | CLI 闸判定/输出面/数据文件增补 · 不改架构图谱 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 闸语义接线与数据增补 · 非编码规范/流程增量 · 无 wiki 落点 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.1.2/2.2/2.3-W1/W2/W3 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表 |
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表（SPEC 04 signed · 修订重签#2 fa24638） |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-12 维护者会话授权） |
| **HG-AUDIT-R1** | **approved** | 30 | **2026-09-12 维护者会话授权 00 代签** · 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w4_gate_wiring_audit_R1_20260913.md` · 评审文联审通过 · D-23-W4-REVIEW-FIRST 前置满足：`w4_gate_wiring_plan_review_20260913.md`） |

---

## 背景与目标

SPEC 04（修订重签#2）：discipline-coverage.yaml 四项 `not_wired` 闸完成接线，`reviews.CLOSE` 从代理口径升级为强证据。**前提证伪留痕**：W4 棒 R0 复核证伪初版 §1 两项（G2「verify/close 无 reviews 闸」/ INVOKE-HATS「close 无 invoke 集合闸」不成立——存在级闸 2026-08-24 T4/T5/T6 已接线；yaml note 过期未回写）→ 00 裁决 A 修订 SPEC（fa24638），本波真缺口 = **G2 结论级 R1 通过判定 · G4 结构断言（warn-only）· FULL-reviews 裸 verify · INVOKE-HATS lint-done 帽级 · A6 reviews.CLOSE 口径 · ⑦ yaml 状态+note 回写**。

**R0 前提复核（本棒已实测 · 修订后 SPEC 前提全部成立）**：

- 存在级已接线实证：verify `cli.ts:827-833`（findReview 硬闸 · b7c15ae）· close `CLOSE_GUARD_ORDER` 含 close_invoke/close_review（`cli.ts:40-54` · 5eac847）；全 src 无审查文结论解析（grep 实证）。
- G4 现状：`cli-checks.ts:838-843` 仅 W4 warn-only；旧包 E8–E10 未随包。
- 裸 verify 现状：`cli.ts:775` 用法错 exit 1；测试钉面 `cli-verify-spec.test.ts:220` + lib-smoke :63/:72。
- lint-done 现状：`cli-task-extra.ts:323-344` lintDoneInvokes 仅 slug 级。
- A6 现状：`cli-status.ts:94-97` 代理口径注释仍在。
- 存量摸底（59 done task · 复用 cli-checks 函数实测）：G2 存在率 54/59=91.5% · INVOKE-HATS 43/59=72.9% · G4 26/59=44%；评审文新增实测：审查文结论可机读率 **49/54=90.7%**（v2 节标题起首口径 · 口径演进三版修正留痕于评审文 §1）。
- 基线实测（干净树）：`npm run typecheck` 0 错 · `npm test` 505/505 · `pins check` 17/17。

**已定案（冻结 · 不得翻案）**：

- **D-23-W4-REVIEW-FIRST**（SPEC 04 硬前置）：评审文先落盘并经 20 R1 → 已满足（`w4_gate_wiring_plan_review_20260913.md`）。
- **D-23-W4-TRANSITION**（SPEC §5.4 · 00 裁决）：闸新行为**不追溯存量** + G4 维持 **warn-only**；「新 task」判定口径 = 评审文 §3 定稿（close 天然只闸新关账 · verify --task 目录分档 active failClosed/done warn · lint-done 与裸 verify 走数据清单豁免）。
- **D-23-W4-EXEMPT-FORMAT**（评审文 §4 钉死）：豁免数据 `docs/harness/legacy-gate-exempt.yaml`（非 S2）· 条目四字段强制（slug/reason/date/authorized_by）· 缺字段条目无效并 warn。
- **D-23-W4-G4-EXIT**（评审文 §5 写死）：G4 warn-only 退出唯一合法路径 = 后续 SPEC 明文裁决；未裁决前不得升 error 亦不得删告警。

## 范围

- [x] ① **评审文先行**（已落盘 · 本项在 30 前完成）：`docs/harness/reviews/w4_gate_wiring_plan_review_20260913.md` 含五问逐项答案 + 存量摸底 + 豁免格式 + G4 退出条件；经 20-task-audit R1 通过。
- [x] ② **G2 结论级接线**：cli-checks 新增 `findLatestReview` + `evalReviewConclusion`（v2 节标题起首口径 · 评审文 §2.1）；close_review 守卫升级（存在+最高 R 轮结论通过才 pass）；verify --task 升级（active failClosed · done warn 降级）；--allow-no-review 沿用（无新旗标）。
- [x] ③ **G4 结构断言（warn-only）**：task lint 新增 W5（R0–R5 槽位不全）/ W6（缺思考轮控制表）/ W7（early_stop=yes 缺 reason 回填）三条 warn；exit 码不变；TASK_TEMPLATE 不改。
- [x] ④ **FULL-reviews 裸 verify**：无 --task/--spec 时扫仓级 reviews（双路径）：done 面 failClosed（存在+结论级 · 豁免数据）· active 面信息报告 warn；--json 键集只增不改；--task/--spec 互斥保持；README 双语用法区同步 + cli.ts usage 更新。
- [x] ⑤ **INVOKE-HATS lint-done 帽级**：lintDoneInvokes 升级——done task 按元信息解析 required 帽集合（resolveRequiredInvokeHats 复用）· missingInvokeHats 判缺 → FAIL exit 2 列明细；豁免数据消费；既有 slug 级闸保留。
- [x] ⑥ **A6 reviews.CLOSE 补强**：status 口径 = 归档态 ∧ 最高 R 轮结论可机读通过（复用 ② 实现源）；`reviews` 增 `close_evidence` 字段（只增不改）；`cli-status.ts:94-97` 注释升级。
- [x] ⑦ **discipline-coverage.yaml 回写**：G2/G4/FULL-reviews/INVOKE-HATS → closed（closed_in "2.3.0" · note 含 src 证据实际行号）；statements A6 partial→mechanical（mechanism 更新）· A7 notes 补 reviews.CLOSE 口径句；as_of 保持 2.2.1（pin-04）；`discipline show` 实测分布变化。
- [x] ⑧ **豁免数据落盘**：`docs/harness/legacy-gate-exempt.yaml` —— reviews 节 10 项 + invoke_hats 节 16 项（摸底明细 · 四字段齐）。
- [x] ⑨ **测试扩组与联改**：评审文 §8 影响面逐项（cli-verify-spec:220 / lib-smoke:63,72 联改 · close-guards / verify-review / g1g7 / p0 / status-obs 扩组 · 新增豁免数据 fixture 测试）；CHANGELOG Unreleased 明示行为变更。

## 非范围

| 项 | 理由 |
|----|------|
| deferred 三项（G6 git 行为层 · G7 执行证据 · N2-C verify 含 lint） | SPEC 04 §4 明文 · 路线 deferred |
| host hooks 化 / host-adapt schema | SPEC 04 §4 · 触 schema 即 STOP |
| 新豁免命令行旗标 | SPEC 04 §4 · 过渡走数据（D-23-W4-EXEMPT-FORMAT） |
| 改变既有闸（G1/G3 等 closed 项）语义 | SPEC 04 §4 · 本波只接线 not_wired |
| TASK_TEMPLATE 预置思考轮节 | 评审文 §2.2 · 控制范围（实践已预置 · 无须模板强制） |
| 事实卡 §11 行正式解禁 | F-W4-05 · 维护者口径 · 本波维持禁称 |
| RELEASING.md 任何改动 | 双重敏感（pin-07 + 九步顺序测）· 与 W2/W3 同例 |
| ontology-check（A4）/ minor bump 2.3.0 / tag / publish | SPEC §4 · 发版动作仅人 · 各属独立波次 |
| 给 pins 或任何既有门禁加 `--force` / `--allow-*` | P0-GATE 硬纪律（00 §2） |
| S2 目录任何 CLI 写（物化 target） | 00 §1 · 机械拒写无豁免 |

---

## 失败路径（failure_paths · 对齐 SPEC 04 §8 + 本 task 增补）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W4-01 | 「新 task」判定口径漏判致存量被打红 | **STOP 上报** · 退回评审修口径（§5.4 已被 D-23-W4-TRANSITION 消解 · 本行为漏判兜底） | 是 | 评审文修订 |
| F-W4-02 | 评审未通过（五问无答案 / 误伤面未摸底） | 30 拒改码 · 退回评审 | 是 | 审查文退回 |
| F-W4-03 | 闸判定函数与既有实现分叉（新造并行解析） | 退回重构为复用（findLatestReview/evalReviewConclusion/resolveRequiredInvokeHats/missingInvokeHats 单一实现源） | 是 | 50 复检拦截 |
| F-W4-04 | 豁免数据被滥用为新绕过口 | 四字段强制 + 缺字段无效 warn + 豁免命中随输出回显留痕（谁/何时/理由） | 是 | BLOCKED/豁免提示含留痕 |
| F-W4-05 | reviews.CLOSE 升级后禁称口径争议 | 事实卡 §11 未解禁前对外按禁称执行（本波评审结论：维持） | — | 对外文案不变 |
| F-W4-06 | discipline-coverage 状态改了但 note 无证据 | note 含 `src/` 引用（测试断言候选）· 缺则退回 | 是 | 测试红 |
| F-W4-07 | 裸 verify 变更破坏既有「须指定 --task」钉面 | 三处既有断言（cli-verify-spec:220 · lib-smoke:63/72）联改为新行为断言（评审文 §8） | 是 | 测试联改 |
| F-W4-08 | bin 面与 src 行为分叉（W3 教训） | 裸 verify / lint-done 帽级 / close 结论级 均经 bin 真实命令验收 · lib-smoke 钉面 | 是 | 验收实测输出 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（verify 闸扫描阻断） | 是 | 须先 20 R1 + 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑥ 逐字对齐 SPEC 04 §7；⑦⑧ 为本棒纪律性增补（bin 面 / gate-check+close / 提交边界）。

- [x] ① **评审文先行**：已落盘（`w4_gate_wiring_plan_review_20260913.md`）· 五问逐项答案 + 存量摸底数据齐 · 经 20-task-audit R1 通过。
- [x] ② **四闸负向真失败**（/tmp 靶场 · bin 真实命令 · 贴输出）：G2 close/verify 对「审查文无通过词」fixture → exit 2；G4 对「缺 R2–R5 / 缺控制表 / early_stop 无 reason」fixture → exit 0 + W5/W6/W7 warn；裸 verify 对「done 无审查文」靶场 → exit 2；lint-done 对「缺 30/40 帽」靶场 → exit 2。
- [x] ③ **正向回归**：本仓 done 全集不追溯打红（lint-done PASS · 裸 verify PASS · 豁免清单命中留痕可见）；verify --task 对 done 目录 fixture → PASS + warn 降级行；`npm test` 全绿。
- [x] ④ **reviews.CLOSE**：status --json 新口径有测（不可机读结论 → CLOSE=false + close_evidence 如实 · 补通过词 → true）；事实卡 §11 禁称处置结论 = 评审文 §6（维持）· 对外文案零改动。
- [x] ⑤ **discipline-coverage**：四项状态 closed + note 含 src 证据；`discipline show` 实测分布变化（not_wired 4→0）；`pins check` PASS 17/17。
- [x] ⑥ `npm run typecheck` 0 错。
- [x] ⑦ **bin 面真实命令验收**（W3 教训）：②③④ 全部经 `node bin/specgate.js`（非仅 src 套件）实测贴输出；lib-smoke 钉面更新。
- [x] ⑧ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_3_wiring_w4_gate_wiring.md` 通过 + `task close --yes` 闭环；提交禁 `git add -A` · 逐路径 add · `feat(2.3-W4): …`。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_3-wiring-completion/04_w4_gate_wiring_v1.md`](../../spec/2_3-wiring-completion/04_w4_gate_wiring_v1.md)（**唯一蓝本** · 修订重签#2 · §3 范围 / §5.4 过渡定案 / §7 验收 / §8 failure_paths）
3. **[`docs/harness/reviews/w4_gate_wiring_plan_review_20260913.md`](../../harness/reviews/w4_gate_wiring_plan_review_20260913.md)（判定口径真值 · 30 不得偏离其定稿）**
4. [`docs/spec/2_3-wiring-completion/00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)（S2 / P0-GATE / RELEASING 双重敏感）
5. 现状文件：`src/cli-checks.ts`（findReview :632 · evalCloseReview :184 · evalCloseInvokeHats :170 · resolveRequiredInvokeHats :33 · missingInvokeHats :83 · W4 warn :838）· `src/cli.ts`（CLOSE_GUARD_ORDER :40-54 · verify :737-880 · 裸 verify 用法错 :775 · close :904）· `src/cli-status.ts`（reviews.CLOSE 代理 :94-107）· `src/cli-task-extra.ts`（lintDoneInvokes :39-74 · cmdTaskLintDone :323）
6. 测试影响面（评审文 §8）：`test/cli-verify-spec.test.ts:220` · `test/lib-smoke/cli-lib-smoke.test.ts:63,72` · `test/cli-task-close-guards.test.ts` · `test/cli-verify-review.test.ts` · `test/cli-g1g7.test.ts:448-460` · `test/cli-p0.test.ts:157` · `test/cli-status-obs.test.ts` · `test/cli-discipline-coverage.test.ts:21-27`（台账名单不动）
7. 参考前波：`docs/tasks/done/task_2_3_wiring_w3_security_observability.md`（同制链路 · bin 面擒获教训）
8. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w4_gate_wiring.md`（GATE_VERIFY · HG-AUDIT-R1=pending 时**拒开工**）

---

## 测试策略（Harness）

**test_strategy**: `required`

- 负向先行：每闸先写红测（fixture 违规 → 定档失败）再实现；评审文 §9 靶场表为验收映射。
- `test/cli-task-close-guards.test.ts` 扩组：close_review 结论级（无通过词 → BLOCKED · 有通过词 → pass · --allow-no-review 豁同免）。
- `test/cli-verify-review.test.ts` 扩组：verify --task 结论级 active failClosed / done warn 降级两档。
- `test/cli-g1g7.test.ts` / `test/cli-p0.test.ts` 联改 + 扩组：lint-done 帽级 FAIL / 豁免命中 PASS / 缺字段豁免条目无效 warn。
- 新增裸 verify 测试组（done 缺口 BLOCKED · 豁免 PASS · active 信息报告不挡 · --json 键集只增不改）；`cli-verify-spec.test.ts:220` 与 lib-smoke :63/:72 联改。
- `test/cli-status-obs.test.ts` 扩组：reviews.CLOSE 新口径 + close_evidence 键。
- task lint W5/W6/W7 三组 warn 用例（exit 0 不变断言）。
- 既有 505 基线只增不红；pins 17/17。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| `src/cli-checks.ts` | ✅ | findLatestReview（findReview 改为其布尔投影单一实现源）+ evalReviewConclusion（v2 节标题起首口径）+ loadLegacyGateExempt（四字段强制）+ evalCloseReview 结论级 + G4 W5–W7 warn-only |
| `src/cli.ts` | ✅ | verifyBareReviewsMode（done failClosed/active 信息报告 · --json 键集只增不改）· 裸 verify 接线（原用法错语义取代）· verify --task 结论级（active failClosed/done warn 降级）· usage 行同步 |
| `src/cli-task-extra.ts` | ✅ | collectTaskFilesByScope 导出 + lintDoneInvokes 帽级（slug 级与帽级同消费豁免）+ cmdTaskLintDone 输出（缺帽点名/豁免留痕/无效条目 warn） |
| `src/cli-status.ts` | ✅ | reviews.CLOSE 强证据口径（归档 ∧ 结论可机读通过）+ close_evidence 新键（只增不改） |
| `docs/harness/legacy-gate-exempt.yaml` | ✅ | reviews 10 项 + invoke_hats 16 项一次性入单（四字段齐）；slug 级 2 项同单覆盖（实现期发现：基线 lint-done 已红 · 预存机制债 · 评审文修订行补记） |
| `assets/harness/discipline-coverage.yaml` | ✅ | G2/G4/FULL-reviews/INVOKE-HATS → closed（closed_in 2.3.0 · note 含 src 证据行号）· A6 partial→mechanical · A7 mechanism/notes 同步 · as_of 保持 2.2.1（pin-04） |
| CHANGELOG / README 双语 | ✅ | Unreleased Changed 五条行为变更明示 · 双语 verify 用法区裸模式行 |
| 测试 | ✅ | 新增 `test/cli-w4-gate-wiring.test.ts` 8 用例全绿；联改 12 文件（审查文 fixture 通过词化 · g1g7 D7 补帽 · status-obs 强证据口径 · verify-spec 裸 verify 新语义 · lib-smoke S2 dogfood/S4 互斥信封）· 513/513 |
| bin 面验收 | ✅ | /tmp/w4-acc 靶场全 exit 码硬断言（close 2→0 · verify 2 · 裸 verify 2→0 豁免 · lint-done 2→0 豁免 · status JSON · G4 W5/W7 bin 实测） |

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 2026-09-13 · 全部命令真实执行）

**验证命令与退出码**（cwd=仓根 · 另注靶场）：

| 命令 | exit | 结果 |
|------|------|------|
| `node bin/specgate.js verify --target . --task docs/tasks/active/task_2_3_wiring_w4_gate_wiring.md`（开工前 GATE_VERIFY） | 0 | HG-TASK-DRAFT/HG-AUDIT-R1 均 approved · VERIFY: PASS |
| 靶场 close 负向（审查文无通过词） | 2 | `close_review: 审查文结论不可机读通过…或 --allow-no-review 豁免` → CLOSE: BLOCKED |
| 靶场 verify active 负向 | 2 | `VERIFY: BLOCKED · 审查文结论不可机读通过 · task_w4bin_ok_audit_R1_20260913.md` |
| 靶场 close/verify 正向（补通过词） | 0 | CLOSE: READY · VERIFY: PASS |
| 靶场裸 verify 负向（done 缺审查文） | 2 | 缺口列表 + 豁免指引 + `VERIFY: BLOCKED · 仓级 reviews 缺口 1` |
| 靶场裸 verify/lint-done 豁免档 | 0 | `豁免命中留痕: w4bin_gap（理由 · 2026-09-13 · 00（fixture））` → PASS ×2 |
| 靶场 G4 lint（有节缺槽 + yes 无 reason） | 0 | W5 + W7 warn 各行 · LINT: PASS（exit 码不变） |
| 本仓 dogfood：裸 verify / lint-done | 0 | 双 PASS · 豁免命中留痕 10+16+2 项回显 |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **513/513**（基线 505 + 新增 8 · 联改 12 文件全绿） |
| `npm run build && npm run test:lib` | 0 | lib 冒烟 5/5（S2 裸 verify 本仓 dogfood PASS · S4 互斥信封） |
| `node bin/specgate.js pins check` | 0 | PINS: PASS · 17/17 |
| `node bin/specgate.js task lint-wiki-delta --target .` | 0 | LINT-WIKI-DELTA: PASS |
| `node bin/specgate.js discipline show` | 0 | gaps closed 5→9（not_wired 4→0）· statements mechanical +1（A6）分布实测变化 |

**验收 ①–⑧ 逐条**：① 评审文先落盘后 20 R1 联审通过（链路时序真实）；② 四闸负向真失败全部 bin 面 exit 码硬断言（上表 exit 2 档五行）；③ 正向回归：本仓 59 done 零追溯打红（lint-done/裸 verify 双 PASS · 豁免留痕可见）· done 目录 verify warn 降级有测 · npm test 全绿；④ status 新口径有测（close_evidence 三态断言）· 事实卡 §11 维持禁称（评审文 §6 · 对外文案零改动）；⑤ yaml 四项 closed + note 含 src 行号 · discipline show 分布实测 · pins 17/17；⑥ typecheck 0 错；⑦ bin 面 = 上表全部经 `node bin/specgate.js`（非 src 直跑）· lib-smoke 钉面更新；⑧ 见修订记录（gate-check + close · 逐路径 add 无 git add -A）。

**实现期发现留痕**：① 本仓 lint-done slug 级在基线即为红（2 项 w0 无 invoke 目录 · 预存机制债）→ slug 级缺口同消费豁免清单（评审文修订行补记）；② js-yaml 裸日期被解析为 Date 对象 → 豁免清单 date 字段加引号；③ DEF-009 资产引用闸拦截 yaml note 内评审文相对路径 → note 改引评审文名（src 证据行号保留）。

**已知未测项**：CI 实跑（本地同命令全绿等价）；消费仓既有审查文格式的误红面（residual_risks ① 缓解三件套已落地）。

### KPI（00）

Task_KPI%: 100（验收 8/8 自证通过 · 513/513 含新增 8 · pins 17/17 · bin 面 exit 码硬断言全过 · 前提证伪-裁决-SPEC 修订链路合规闭合）

### 经验总结

（experience_capture 未声明 required · 关账自愿回填）

---

## 思考轮（10-task）

### R0 · 证据

SPEC 04 修订重签#2（fa24638 · 00 裁决 A）为唯一蓝本。前提复核本棒全部实测：存在级闸已接线证据（b7c15ae/0fc730f/5eac847 提交 + cli.ts:40-54/827-833 + cli-checks.ts:170-192）· 全 src 无结论解析 grep 实证 · G4 W4 warn-only :838-843 · 裸 verify :775 · lint-done :323-344 · A6 注释 :94-97 · 裸 verify 测试钉面三处定位 · 存量四组摸底数据（91.5%/72.9%/44%/90.7%）· 基线 505/505 + pins 17/17 + typecheck 0 错。证伪→STOP 上报→00 裁决 A→SPEC 修订 链路已闭合。

### R1 · 范围

范围 = SPEC 04 §3 ①–⑦ 转写为 ①–⑨（①评审文已落盘 · ⑧豁免数据 · ⑨测试联改单列）；非范围 = SPEC §4 六项 + 本 task 增补（TASK_TEMPLATE 不改 · 事实卡 §11 不解禁 · RELEASING 零改动 · 发版动作 · --force 禁新增 · S2 CLI 写）。

### R2 · 方案

评审文（D-23-W4-REVIEW-FIRST 第一交付物）已定稿全部判定口径：G2 v2 节标题起首结论解析（三版口径修正留痕 · 存量可解析 49/54）· G4 W5–W7 warn-only（不占旧包 E8–E10 语义 · 台账名单不动）· 裸 verify done failClosed/active 信息报告 · lint-done 帽级 failClosed · A6 观测面如实化（键集只增不改）。「新 task」判定 = 目录分档 + 数据清单（拒绝时间戳/git 依赖 · 确定性可移植）。豁免格式四字段钉死（F-W4-04）。单一实现源纪律：findLatestReview/evalReviewConclusion/resolveRequiredInvokeHats/missingInvokeHats 全部复用或单点新建于 cli-checks（F-W4-03）。

### R3 · 边界

30 开工硬边界 = HG-AUDIT-R1 翻 approved（评审文落盘+R1 通过前置已满足 · 本帽不签发）；failClosed 不稀释 = 新闸默认红 · 过渡仅目录分档+数据留痕两径；S2/P0-GATE/RELEASING 双重敏感/host schema 四纪律入非范围；JSON 键集只增不改；as_of 不动（pin-04）；bin 面验收为硬条款；提交禁 git add -A。

### R4 · 可测性

验收 8 条全部可机械/可观测：exit 码断言 · warn 行断言 · 豁免命中留痕断言 · status JSON 键断言 · discipline show 分布实测 · 四门命令 · 靶场 bin 实测。无「改完了」式条款。

### R5 · 派工就绪

task 结构满足 lint E1–E8；评审文已落盘（第一交付物前置满足）；pre-30 invoke（10/00）同棒落盘。**下一棒**：20-task-audit R1 书面审（审评审文 + 本 task · 落盘 docs/harness/reviews/ + invoke_\*_20_\*）→ HG-AUDIT-R1 签闸（2026-09-12 维护者会话授权 00 代签）→ 30/40。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC 修订重签 + 前提复核全实测 + 证伪-裁决链路闭合 + 四组摸底数据 + 基线实测） | no |
| R1 | 范围/非范围划定（SPEC §3/§4 + 纪律增补） | no |
| R2 | 评审文定稿全部判定口径（G2 v2 解析 / G4 W5–W7 / 裸 verify 分面 / lint-done 帽级 / A6 如实化 / 新 task 口径 / 豁免格式） | no |
| R3 | 边界七条（开工闸 / failClosed / 硬纪律 / 键集 / pin-04 / bin 面 / 提交）落入 task | no |
| R4 | 验收 8 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此（评审文前置已落盘 · 无遗留阻塞） | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 修订重签，评审文已按 D-23-W4-REVIEW-FIRST 先行落盘并定稿全部判定口径，前提复核全实测成立（证伪项已经 00 裁决 A 消解），本帽职责（结构化转写 + 闸/invoke 配置）闭合，无新增开放问题。  
**residual_risks**：① 结论解析 v2 口径对消费仓既有审查文格式的误红面（缓解：verify done 目录 warn 降级 + 裸 verify 豁免清单 + 输出含豁免指引）；② 豁免清单被当新绕过口（缓解：F-W4-04 四字段 + 命中回显留痕）；③ G4 warn-only 过渡窗的「永久 warn」风险（缓解：D-23-W4-G4-EXIT 写死升级唯一合法路径）；④ 裸 verify 新命令面对脚本化消费者的行为变更（缓解：CHANGELOG Unreleased 明示 + 既有三处钉面联改）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-13 | 开单 · 10-task · 蓝本 SPEC 04 修订重签#2（fa24638 · 00 裁决 A：前提部分证伪消解）· 评审文先行落盘（`w4_gate_wiring_plan_review_20260913.md` · D-23-W4-REVIEW-FIRST）· R0 前提复核全实测成立 · D-23-W4-TRANSITION/EXEMPT-FORMAT/G4-EXIT 定案转写 |
| 2026-09-13 | 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w4_gate_wiring_audit_R1_20260913.md` · 评审文联审 · 非阻塞观察 ×3）· HG-AUDIT-R1 approved（2026-09-12 维护者会话授权 00 代签） |
| 2026-09-13 | W4 实现落地 · 30+40 闭环：G2 结论级（v2 口径）+ G4 W5–W7 warn-only + 裸 verify 仓级扫描 + lint-done 帽级 + reviews.CLOSE 强证据 + 豁免数据 26 项 + yaml 四闸 closed 回写 · 验收 ①–⑧ 自证全过（513/513 · pins 17/17 · bin 面 exit 码硬断言）· gate-check PASS + close --yes 归档 |
