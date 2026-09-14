# Task：2.4 W2 · 结论级闸强度增强（conclusion gate strength）· 评审先行

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（00 代签 · 2026-09-14 · 维护者授权）· 评审文双前置已消解 · 30+40 闭环完成 · 2026-09-14）  
> **wave**：W2（2.4.0 门禁强度补全 · 闸语义波）  
> **关联 SPEC**：[`docs/spec/2_4-gate-strength/02_w2_conclusion_gate_strength_v1.md`](../../spec/2_4-gate-strength/02_w2_conclusion_gate_strength_v1.md)（**唯一蓝本** · signed）· [`00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-4-gate-strength-w2-conclusion-gate` |
| **test_strategy** | `required` |
| **test_strategy_note** | reviews 闸测试夹扩组（「结论节内只写通过二字」负向 fixture 修复前真红 · 负面词守卫回归）；存量波及实测登记为验收硬条款 |
| **freeze_id** | 2.4.0-W2 · D-24-W2-REVIEW-FIRST / D-24-W2-NO-RETRO 已冻结（SPEC 02 §6 · HG-SPEC-SIGNOFF approved）；**强度档位已定档 S1 · N=20**（评审文 [`w2_conclusion_gate_strength_review_20260914.md`](../../harness/reviews/w2_conclusion_gate_strength_review_20260914.md) §4 · 存量 48 份实测误伤 0/48 · 2026-09-14 30 回填） |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 闸判据强度调整，不改架构图谱 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 闸语义强度变更（机制内）· 若评审定档 S2 须同步 20-task-audit 帽条文模板（届时评估 wiki_delta 升级） |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.2/2.3 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-14 维护者本窗签收 PLAN_2_4 |
| HG-SPEC-SIGNOFF | **approved** | — | 2026-09-14 维护者授权 00 代签 |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-14 维护者授权） |
| **HG-AUDIT-R1** | **approved** | 30 | 00 代签 · 2026-09-14 · 维护者授权 · 依据审查文 [`docs/harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md`](../../harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md)（R1 结论 PASS）· **注意：本签闸不解除 D-24-W2-REVIEW-FIRST**，30 开工仍须强度方案评审文先落盘 reviews/ |

> **评审先行（D-24-W2-REVIEW-FIRST · 硬前置）**：30 动手前**须先有强度方案评审文落盘 `docs/harness/reviews/`**（候选档位 S1/S2/S3 对比 + 存量 done task 审查文合规率实测 + 定档结论）且经 20-task-audit R1；评审通过前 30 拒改码。HG-AUDIT-R1 签闸与评审文落盘同为 30 开工前置，缺一不可。

---

## 背景与目标

2.3.1 已修 N11 本体（`evalReviewConclusion` `src/cli-checks.ts:684-704` 强制结论/签收节存在 · 无节直接判未通过 :702 · 通过词 :681 须落节内）。**残余（2.3.1 验收档主动登记 · 归 2.4）**：结论节存在但只写「通过」二字仍可机读过闸——A2 绕过面从全文收窄为结论节内。目标：判据推进到「结论节含最低限度实质签收内容」；档位由评审文定夺（SPEC 02 §5.2 候选 S1/S2/S3）；新行为不追溯存量（D-24-W2-NO-RETRO）。

## 范围

- [x] ① **强度方案评审文落盘**（硬前置）：`docs/harness/reviews/` 新增评审文 · 含候选档位对比 + 存量 done task 审查文合规率实测（抽验样本核因）+ 定档结论与理由；经 20-task-audit R1。
- [x] ② **`evalReviewConclusion` 按评审定档增强**（`src/cli-checks.ts:684-704` 定点）：空结论节 / 仅通过词无实质内容 → 判未通过；定档结论回填本 task freeze_id 行。
- [x] ③ **负向 fixture**：「结论节内只写通过二字」→ `verify --task` exit 2（修复前真红 · 固化 A2 收窄形态）；合规审查文 exit 0；负面词守卫（通过词+未否定「退回」）仍 exit 2 回归锁。
- [x] ④ **存量波及处置**：实测波及的历史审查文循 2.3.1 N11 先例入 `docs/harness/legacy-gate-exempt.yaml`（四字段齐 · 显式类型判 · reason 点名本波接线波及）→ 裸 verify 复跑 PASS（豁免命中留痕数与登记一致）；零波及则登记「零波及」结论。

## 非范围

| 项 | 理由 |
|----|------|
| 结论节存在性判定本身 | 2.3.1 已落地 · 本波只推进节内强度 |
| 追溯打红存量 done task | D-24-W2-NO-RETRO（循 D-23-W4-TRANSITION / 2.3.1 双先例） |
| 豁免机制语义变更 | 既有豁免旗标不动 · 波及处置只消费既有豁免清单 |
| 通过词词表扩展/收窄 | 默认沿用 `REVIEW_PASS_RE` 现词表（评审可议） |
| S2 目录任何写（豁免清单为登记性新增 · 非覆写） | 00 §1 |
| W1/W3–W6 任何实现项 | 各自独立 task |
| minor bump 2.4.0 / tag / publish | 属发版波 · publish 仅人 |

---

## 失败路径（failure_paths · 对齐 SPEC 02 §8）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W2-01 | 定档过严误伤真实合规审查文 | 评审文以存量实测合规率为界定档 · 误伤面可枚举即返修档位 | 是 | 评审文含合规率表 |
| F-W2-02 | 波及存量未登记直接豁免 | 禁止——波及逐条入豁免清单留痕（四字段 · 显式类型判）· 否则裸 verify 打红即为信号 | 是 | 豁免命中留痕 |
| F-W2-03 | 结论节含否定词 + 通过词 | 负面词守卫优先判未通过（2.3-W4 既有语义 · 回归锁） | 是 | failClosed 输出 |
| F-W2-04 | 评审文未落盘即派 30 | 30 **拒开工**（本 task 硬前置 + 人工闸表双保险） | 是 | 须先评审文 + HG-AUDIT-R1 |
| F-W2-05 | 豁免条目 `authorized_by: 00` 无引号 falsy | 2.3.1 N13 显式类型判已修 · 新增条目沿用引号规范 | 是 | 无效条目留痕 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（`npx spec-wave verify --task` 闸扫描阻断） | 是 | 须先 20-task-audit R1 + 00 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑤ 逐字对齐 SPEC 02 §7 五条；⑥–⑧ 为本棒纪律性增补。

- [x] ① **评审文落盘**（30 动手前硬核对）：`docs/harness/reviews/` 含强度方案评审文（档位对比 + 存量合规率实测 + 定档）· 经 20-task-audit R1。
- [x] ② **负向 fixture 真红转绿**：「结论节只写通过二字」→ 修复前 exit 0 · 修复后 exit 2；合规审查文 exit 0。贴实际命令与输出。
- [x] ③ **负面词守卫不回退**：通过词 + 未否定「退回」仍 exit 2（B2 对照形态回归）。
- [x] ④ **存量波及登记**：波及清单 + 豁免条目落盘（四字段齐）· 裸 verify 复跑 PASS 且豁免命中留痕数与登记一致（或零波及结论）。
- [x] ⑤ `npm run typecheck` 0 错 · `npm test` 全绿（含新增）· `discipline-coverage.yaml` 相关 note 回写（若覆盖表口径受影响）。
- [x] ⑥ **行为变更旧测影响面（TEST-LOCK）**：reviews 闸既有用例影响面逐处列出并联改（grep 留证）。
- [x] ⑦ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_4_gate_strength_w2_conclusion_gate.md` 通过 + `task close --yes` 闭环。
- [x] ⑧ **提交边界**：禁 `git add -A`；逐路径精确 `git add`；提交信息 `feat(2.4-W2): …`。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_4-gate-strength/02_w2_conclusion_gate_strength_v1.md`](../../spec/2_4-gate-strength/02_w2_conclusion_gate_strength_v1.md)（**唯一蓝本**）
3. [`docs/spec/2_4-gate-strength/00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)
4. **本波评审文**（`docs/harness/reviews/` · 定档结论 · 30 动手硬前置）
5. 现状文件：`src/cli-checks.ts`（REVIEW_SECTION_HEAD_RE :680 · REVIEW_PASS_RE :681 · evalReviewConclusion :684-704）· `docs/harness/legacy-gate-exempt.yaml` · 2.3.1 N11 波及处置先例（`docs/tasks/done/task_2_3_1_patch.md`）
6. 证据原文：`.workbuddy/output/验收报告-SpecWave-2.3.0.md` §3.L · `docs/roadmap/ACCEPTANCE_2_3_1_patch_2_3_1_zh.md`「已知残余」第 3 条
7. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w2_conclusion_gate.md`（GATE_VERIFY · HG-AUDIT-R1=pending 或评审文未落盘时**拒开工**）

---

## 测试策略（Harness）

**test_strategy**: `required`

- reviews 闸测试夹扩组：A2 收窄形态负向（结论节只写通过二字 → exit 2 · 修复前真红）· 合规正向 · 负面词守卫回归。
- 存量波及实测：抽验样本核因 + 波及清单登记（循 2.3.1 N11 先例格式）。
- 破坏性自证（验收 ②③）为硬条款；改行为必联改断言（TEST-LOCK）。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| 评审文落盘 + 定档 | ✅ | `docs/harness/reviews/w2_conclusion_gate_strength_review_20260914.md` · S1·N=20 · 存量误伤 0/48 |
| `src/cli-checks.ts` evalReviewConclusion 增强 | ✅ | `REVIEW_MIN_SUBSTANCE=20` + `REVIEW_PASS_STRIP_RE`（`gi` 全局）· substance 判据插于通过词判定之后、pass 分支之前（:712-717 区间 · 否定守卫 :708 不动） |
| 负向 fixture + 波及处置 | ✅ | `test/cli-w4-gate-wiring.test.ts` 新增 2.4-W2 describe（6 用例 · 评审文 §5 五条 + done 降级锁）· 存量 66 份复测新判据波及 **0**（零波及 · 无新增豁免条目） |

### 自检结论（执行者）

**验证命令与退出码表**（2026-09-14 · 30 棒）：

| 命令 | 退出码 | 结果 |
|------|--------|------|
| `node bin/specgate.js verify --target . --task docs/tasks/active/task_2_4_gate_strength_w2_conclusion_gate.md`（开工前 GATE_VERIFY） | 0 | PASS · HG-TASK-DRAFT/HG-AUDIT-R1 双 approved |
| 修复前真红：`## 结论\n通过` / `## 签收\nPASS`（tmp fixture · 现行 2.3.1 码） | 0 | VERIFY: PASS（残余缺口复现 · 修复前真红留证） |
| 修复后：A2 收窄形态 `## 结论\n通过` | 2 | BLOCKED · 内容量不足（去通过词后非空白 4<20 字符 · S1·N=20） |
| 修复后：变体 `## 签收\nPASS` / `## 结论\n零阻塞` | 2 | BLOCKED · 内容量不足（2<20 / 4<20） |
| 修复后：边界探针 恰 19（`通过 abcdefghijklmno`） | 2 | BLOCKED · 19<20 |
| 修复后：边界探针 恰 20（`通过 abcdefghijklmnop`） | 0 | VERIFY: PASS |
| 修复后：合规正向（实质结论节） | 0 | VERIFY: PASS |
| 修复后：守卫回归（通过词+实质内容+未否定「退回」） | 2 | BLOCKED · 含否定结论词（守卫优先不回退） |
| 存量全量复测（/tmp/w2_retest.mts · 真实 evalReviewConclusion 新判据 · findLatestReview 同名口径） | — | done 66 份：无匹配审查文 5 · PASS 48 · FAIL 13 全部为既有判据失败（5 无通过词 + 8 无结论节 = 2.3.1 N11 豁免/既有缺口面）· **新判据（内容量不足）波及 = 0** |
| `node bin/specgate.js verify --target .`（裸 verify 仓级） | 0 | PASS · 豁免留痕 5 条全为 2.3.1 N11 既有条目 · 零新增 |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | 550 tests · 549 pass · 0 fail · 1 skipped（既有 skip） |
| `npm run build` | 0 | tsc 通过 |
| `npm run test:lib` | 0 | 6/6 pass |
| `node bin/specgate.js pins check` | 0 | PINS: PASS · 17/17 |
| `node bin/specgate.js assets manifest rebuild --yes` + `assets verify` | 0 | ~1 变更（discipline-coverage.yaml note 回写）· ASSETS: PASS 110/110 |

**验收 ①–⑧ 逐条**：
① 评审文 `w2_conclusion_gate_strength_review_20260914.md` 已落盘且经 20-task-audit R1（30 动手前硬核对 PASS）。  
② 真红→绿：修复前 `## 结论\n通过` exit 0（命令与输出见上表第 2 行）· 修复后 exit 2（test/cli-w4-gate-wiring.test.ts 2.4-W2 describe 用例 ① 固化）· 合规 exit 0（用例 ③）。  
③ 守卫回归：用例 ⑤ 通过词+实质内容+未否定「退回」exit 2。  
④ 存量波及 = **0**（66 份复测新判据零波及 · 与评审文 0/48 实测一致）→ 登记「零波及」结论 · 无需新增豁免条目 · 裸 verify PASS 留痕数（5）与 2.3.1 登记一致。  
⑤ typecheck 0 错 · npm test 全绿含新增 6 用例 · `discipline-coverage.yaml` G2 note 回写 2.4-W2 S1·N=20 + manifest rebuild。  
⑥ TEST-LOCK 影响面（grep `零内容阻塞（fixture` 留证）：旧 fixture 串去通过词后 substance=14<20，联改 15 文件 24 处（cli-w4-gate-wiring / cli-security-closure / gate-semantics / cli-g1g7 / cli-verify-with-wiki-lint×3 / cli-verify-review×3 / cli-p0×5 / cli-task-close-guards / cli-task-close-done-snapshot / cli-lifecycle-guards×3 / cli-flags / cli-verify-invoke-hats / cli-status-obs / cli-verify-observability×4），统一追加实质结论句（substance=42）；cli-verify-review R2 变体（substance=19）同步联改。  
⑦ gate-check + task close 见关账记录。  
⑧ 提交边界：逐路径精确 add · `feat(2.4-W2): 结论级闸强度增强（S1·N=20 定档）`。

**已知未测项**：无（评审文 §5 五条 fixture 全覆盖 + done 降级锁；存量复测脚本为一次性 /tmp 制品未入仓，与评审文 `/tmp/w2_sim.mts` 先例一致）。

**Task_KPI**：验收 8/8 逐条自证 · 范围 ①–④ 全落地（④ 走 SPEC §7.4 明文允许的零波及登记分支）· 非范围零触碰（exit code 语义 / 豁免机制 / 词表 / S2 目录均未动）· 100%。

### KPI（00）

Task_KPI%: 100（验收 8/8 自证通过 · 四门绿 549 pass+1 既有门控 skip · pins 17/17 · assets 110/110 · 修复前真红留证（exit 0→2）· 存量 66 份复测新判据波及 0 零豁免新增 · TEST-LOCK 15 文件 24 处联改 · 不 bump 版本号）

---

## 思考轮（10-task）

### R0 · 证据

SPEC 02 为唯一蓝本（signed）；前提本棒只读复核有效：`evalReviewConclusion` :684-704 现状（节存在 ∧ 通过词落节内即过 · 节内容量无判据）；2.3.1 波及处置先例（8 份入豁免清单 · 裸 verify 复跑 PASS 留痕 18）。

### R1 · 范围

范围 = SPEC 02 §3 四项逐字承接（评审文 → 实现 → fixture → 波及处置 · 顺序即依赖）；非范围 = 02 §4 + 纪律增补。

### R2 · 方案

档位不定死（SPEC 02 §5.2 候选 S1/S2/S3 留评审文）；本帽已定 = 评审先行 + 不追溯存量（D-24 双冻结）。

### R3 · 边界

30 开工硬边界 = 评审文落盘 **且** HG-AUDIT-R1 approved（双前置 · 本帽均不签发）；豁免清单为登记性新增（S2 只新增不覆写）；提交边界 = 禁 `git add -A`。

### R4 · 可测性

验收 8 条全部可机械/可观测：评审文存在性、exit 码对照、波及登记与豁免留痕数核对、四门命令、gate-check、提交边界。

### R5 · 派工就绪

task 结构对齐 lint E1–E8；pre-30 invoke（10）同棒落盘。**下一棒**：20-task-audit R1 书面审 → **强度方案评审文落盘** → HG-AUDIT-R1 签闸（00 代签 · 2026-09-14 维护者授权）→ 30/40。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC signed + 现状只读复核 + 2.3.1 先例） | no |
| R1 | 范围/非范围划定（02 §3/§4 + 纪律增补） | no |
| R2 | 档位留评审 · 双冻结已定 | no |
| R3 | 双前置开工闸 + S2 登记性新增 + 提交边界落入 task | no |
| R4 | 验收 8 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此 | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 已 signed，双前置纪律明确，档位开放点已显式隔离给评审文（freeze_id 行注明回填），无新增开放问题。  
**residual_risks**：① 评审文定档若选 S2 须同步 20-task-audit 帽条文模板（wiki_delta 届时升级评估）；② 「实质内容」机械化判定的博弈面（failClosed 方向 · 误伤即返修档位）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | 开单 · 10-task · 蓝本 SPEC 02（signed）· 评审先行硬前置落表 · 行号只读复核（cli-checks.ts:680-704） |
| 2026-09-14 | 30 实现 · 定档回填 S1·N=20（评审文 §4）· evalReviewConclusion 增 substance 判据 · W2 测试组 6 用例（红→绿留证）· TEST-LOCK 联改 15 文件 24 处 · 存量 66 份复测波及 0（零波及登记）· discipline-coverage G2 note 回写 + manifest rebuild · 四门+pins/assets 全绿 |
