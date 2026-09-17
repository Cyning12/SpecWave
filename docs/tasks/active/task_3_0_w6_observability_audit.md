# Task：3.0 W6 · 可观测与审计（C6 结构化审计日志落盘 + F4 S2 公理接真实触发源 + G2/G4 闸接线 + N2-C verify 补 lint + G7 执行证据 + coverage 回写）

> **状态**：`draft`（2026-09-17 10-task 起草 · HG-TASK-DRAFT / HG-AUDIT-R1 双 approved（00 代签 · 授权真值：维护者本窗「授权00代签」· 依据审查文 docs/harness/reviews/task_3_0_w6_observability_audit_audit_R1_20260917.md · R1 PASS-with-issues blocking 0 · advisory A1–A4 带入 30 执行要求 · G7 warn-only 诚实口径 00 裁定接受）· 30 可开工）
> **SPEC 真值**：[`docs/spec/3_0-architecture-leap/07_w6_observability_audit_v1.md`](../../spec/3_0-architecture-leap/07_w6_observability_audit_v1.md)（signed · HG-SPEC-SIGNOFF=approved 2026-09-16 · 范围 ①–⑦ · 验收 1–6 · F-W6-01–05 · §5 设计要点）
> **上游 PLAN**：[`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W6 节（:281-286）+ 硬约束 **1**（S2 永不覆写 · :330）/ **2**（禁新绕过参数 · :331）/ **6**（修严配负向 fixture · :335）/ **7**（不追溯存量 · :336）/ **10**（环境依赖可诊断 · :339）/ **14**（证据入库 · :343）/ **15**（闸不落表即虚设 · :344）
> **前置已兑现**：W0–W5 全 done（W5 锁终态 810/154/809 pass/0 fail/1 skip · [`task_3_0_w5_mechanical_cleanup.md`](../done/task_3_0_w5_mechanical_cleanup.md)）· SPEC signed · W2 hooks 执行面已交付（hook-guard 分发 + shell-hook 物化 · `src/host/hookguard.ts` / `src/host/hooks.ts`）
> **基线（2026-09-17 本棒复跑实测 · 详见「开工基线」节）**：HEAD `b461b34` · npm test **810 tests / 154 suites / 809 pass / 0 fail / 1 skip** · typecheck 0 错 · pins **17/17** · task 语料 lint FAIL **27/80（33.8%）**（N2-C 前基线）
> **行号口径**：本 task 全部行号为 2026-09-17 本棒实读现值（HEAD `b461b34` · W0 后新布局：verify 链路 `src/cli/verify.ts` · close 面 `src/cli/task-cmd.ts` + `src/checks/close-guards.ts` · 审查文面 `src/checks/review-gates.ts` · invoke 帽面 `src/checks/invoke-hats.ts` · audit/gate-check `src/cli/gates.ts` · lint `src/checks/lint.ts`）
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-w6-observability-audit` |
| **test_strategy** | `required` |
| **test_strategy_note** | 验收主体 = 机械锁全绿：C6 schema 快照断言 + 落盘失败降级 fixture + S2 拒写 fixture + G2 回归锁/负向 fixture + G4 负向 fixture 红转绿 + N2-C lint 步入链负向 fixture 与 FAIL 率前后数字 + G7 执行证据事件 fixture + coverage 回写与 discipline show 一致机检 + 审计落点不在 S2 机械断言 + pins 17/17 + 依赖零新增 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 改的是 CLI 门禁链路/审计落盘/checks 判据与覆盖率 yaml 数据；图谱/本体/HGM 零触碰 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 无规范增量；审计事件 schema 与 FAIL 率口径入代码注释与本 task（注释/登记面非规范面）· 晋升与否归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-16 维护者本窗签收 PLAN_3_0（上行继承 · 3.0 双签之一） |
| HG-SPEC-SIGNOFF | approved | — | 人 · 2026-09-16 维护者本窗签收 3.0 SPEC 系列（同时授权 00 代签后续过程文档闸 · HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗「授权00代签」· task lint PASS |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗「授权00代签」· 依据审查文 docs/harness/reviews/task_3_0_w6_observability_audit_audit_R1_20260917.md（R1 · PASS-with-issues · blocking 0 · advisory A1–A4 带入 30：A1 N2-C 基线复跑重建登记（27 件枚举一致 · 分母时点差）· A2 行号小疵 · A3 gitignore 只覆盖本仓（消费仓脏面口径自检登记）· A4 双 invoke 已补落）· **G7 落地档裁定：00 接受 warn-only 诚实口径（不虚标 closed · SPEC ⑦ 字面偏差登记）** |

> **闸行裁决（留 20-task-audit 复核）：W6 不设 HG-SCHEMA-CHANGE 行**。理由三条：① coverage 回写是把 `discipline-coverage.yaml` 既有 `status`/`note`/`gap` 字段按已批准 schema **写数据**（not_wired/deferred → mechanical/closed/partial · 键形态与字段集零变更 · 类比 W4 闸行裁决②/W5 闸行裁决①「按已批准 schema 写数据」）；② C6 审计事件 schema 是**新增内部落盘格式**（JSONL · 无既有消费者契约可破 · 属新文件新机制而非既有 schema 变更）；③ F4 若给 statements 增 `trigger` 等触发源字段为 **additive 扩键** —— `loadDiscipline` 校验面（`src/cli-lifecycle.ts:87-89`）只查 version/as_of_package_version/statements 数组存在性，additive 键被容忍（契约只增先例 = `src/cli-shared.ts` relativizeOutputValue 契约注释面）。**升级条款（30 执行期 STOP 通道）**：若执行期发现须改既有键语义/删键/触 host-adapt schema 或任何对外契约 → **STOP**，先评审文 → 走 HG-SCHEMA-CHANGE 式人闸 → 才改码（硬约束 3）。

---

## 背景与目标

SPEC 07 三路可观测债：① C6 —— `audit` 不落痕（`src/cli/gates.ts:172-205` cmdAudit 只打印 PASS/FAIL · 无结构化落盘）；② F4 —— `discipline-coverage.yaml` statements 的 status 来自 2026-08-24 人工重盘（`source_audit` 字段自述 · 纸面/代理口径 · 无触发源字段）；③ 闸未接线 —— 本棒实读复核后的**现值对账**（起草发现 · 留 20 复核）：

- **G2 reviews 存在性闸：现码已接线**（verify --task `src/cli/verify.ts:323-328` 存在级 + :338-371 结论级 · close `evalCloseReview` `src/checks/close-guards.ts:95-111`）——yaml gaps G2 行已 closed（2.3.0）；残留 not_wired 在 statements **C1/C2**（note 仍写「本包未接线」· 已过期）。W6 的 G2 工作 = **防回退回归锁 + 负向 fixture 实证 + C1/C2 回写**，非新接线。
- **G4 思考轮控制表：真未接线** —— `src/checks/lint.ts:102-132` W5–W7 仅 warn-only（D-23-W4-G4-EXIT：升 failClosed 唯一路径 = 后续 SPEC 明文裁决 · **SPEC 07 范围④（signed）即该裁决**）；statements **D3** not_wired。本波接线入 verify --task 判定。
- **N2-C verify --task 补 lint：真未接线** —— cmdVerify --task 链（`src/cli/verify.ts:303-410`）无 lint 步；gaps N2-C deferred。**FAIL 率须实测下降（前后数字 · 不降不得完成 · SPEC 验收③）**。
- **G7 执行证据：真未接线** —— gaps G7 deferred（「方向二 runner」）· statements A5/B2 notes「真跑过无证据」。W2 已交付 hook-guard 实跑面（`src/host/hookguard.ts:53-64,126-131`）· 本波接执行证据事件。
- **附带起草发现**：yaml 全部机制锚点仍指 W0 前旧址（`src/cli.ts#381-428` 等 · W0 拆分后失效）· 回写时逐条刷新为 W0 后新址。

本 task 把 SPEC 范围 ①–⑦ 规格化为 30 可执行面（S6.1–S6.7），每条修严配负向 fixture（红测先行 · 硬约束 6），审计轨与 S2 三域边界机械锁死（硬约束 1）。

---

## 开工基线（2026-09-17 本棒复跑实测 · 验收比对的唯一基准）

> 30 开工时若复跑结果与本表不符，按 F-W0-05 同式纪律处置（以复跑实测重建基线并登记 · 不得沿用旧数字强行比对）。

| 项 | 实测值 | 备注 |
|----|--------|------|
| git HEAD | `b461b34` | 工作区 clean（本 task 起草后 +1 untracked）· tag `v2.4.2` 存在 |
| `npm test` | **810 tests / 154 suites / 809 pass / 0 fail / 1 skip** | duration ≈96s · 与 W5 锁终态逐字一致（复跑确认 · 硬约束 14 证据 = 本表文本） |
| `npm run typecheck` | **0 错** | strict + noUncheckedIndexedAccess |
| `node bin/specgate.js pins check` | **17/17 PASS** | pin-10 = git-tag 钉（git 操作仅人 F-A1-05） |
| C6 现值 | `src/cli/gates.ts:172-205` cmdAudit：gate-check + runTestCheck → 打印 `audit: PASS/FAIL` 后 `fail('ICVO audit 未通过', 2)` | **无任何结构化落盘**（C6 债实锤面）· `docs/harness/audit/` 目录不存在（glob 实证） |
| S2 拒写既有机制 | `src/cli-shared.ts:90-98` `S2_TRUTH_PREFIXES`（docs/tasks · docs/harness/reviews · docs/harness/invokes/by-task）+ :123-131 `assertNotS2Abs` | F-W6-02 机械拒写复用此单一真值源 · `src/cli-skills.ts:367-369` 有「拒写：dest 命中 S2」先例文案 |
| F4 现值 | `assets/harness/discipline-coverage.yaml` statements 字段集 = id/source/summary/status/mechanism/gap/notes/mechanism_quality（**无触发源字段**）· `source_audit` 自述 2026-08-24 人工重盘 | 纸面/代理口径实锤 · loadDiscipline 校验仅查 version/as_of/statements（`src/cli-lifecycle.ts:87-89` · additive 键容忍） |
| G2 现值 | verify --task 存在级闸 `src/cli/verify.ts:323-328` + 结论级 :338-371 · close `evalCloseReview` `src/checks/close-guards.ts:95-111`（CLOSE_GUARD_ORDER `src/cli/usage.ts:8-22` 第 6 位 `close_review`） | **已接线**（SPEC 范围③前提与现码偏差 · 起草发现 · 本波 = 回归锁 + 回写 · S6.3） |
| G4 现值 | `src/checks/lint.ts:102-132`：有思考轮节 → W5 槽位/W6 控制表/W7 early_stop reason 全 warn-only（不挡 LINT: PASS） | D-23-W4-G4-EXIT 升级通道 = SPEC 明文裁决 · SPEC 07 ④ signed 即兑现 · statements D3 not_wired |
| N2-C 现值 | cmdVerify --task 链（`src/cli/verify.ts`）：formatGateCheck :303 → runTestCheck :316 → 审查文闸 :323/:338 → pre-30 invoke hats :374 → 可选 wiki-lint :390 —— **无 lint 步** | `--allow-lint-fail` 旗标名已在 DEF-011 清单登记（verify.ts:248 注释 · 本波真接线消费） |
| **N2-C FAIL 率前基线**（lintTaskFile 全量语料实测） | 语料 = `docs/tasks/{done,active}/*.md` 排除非 task 的 README.md = **80 件** · lint FAIL **27 件（33.8%）**（规则分布：E3×22 · E5×17 · E4×10 · E2×3 · E6×1 · 含 README 则 28/81=34.6% 含 E1×1）· **lint 逃逸率 = 100%**（lint 不在 verify 链 · 27/27 全逃逸）· warn 面：W4×34 · W5×14 · W6×1 | 实测方法 = `lintTaskFile`（`src/checks/lint.ts:21`）直调扫全语料（node --experimental-strip-types 单进程 · 与 test 同运行形态）· 后对比设计见 S6.5 |
| G7 现值 | hook-guard 实跑门禁（`src/host/hookguard.ts` runGateCommand :53-64 · 阻断 exit 2 :126-131）· **执行结果不落任何证据轨** | A5/B2 gap=G7「真跑过无证据」· W2 e2e 真实 git commit 测试面已实证门禁真跑（证据在测试非运行轨） |
| coverage 回写面 | gaps：G6 deferred（**归 W7 · 本波不动**）· G7 deferred · N2-C deferred；statements not_wired：**C1/C2/D3** | G2/G4 gap 行已 closed（与 SPEC 头部登记口径偏差 · 起草发现在案）· 机制锚点全为 W0 前旧址（回写须刷新） |
| 依赖基线 | `package.json` dependencies = **仅 `js-yaml`** | 本波零新依赖（审计落盘用 node:fs · 硬约束 13 同精神） |

---

## W6 实现规格（10-task 定稿 · 30 按此实施）

### S6.1 C6 · 结构化审计日志落盘（SPEC 范围① · 验收 1/5）

- **落点定稿**：`<target>/docs/harness/audit/audit.jsonl`（**append-only · 每行一事件 JSON（JSONL）· 只新增不覆写**）。评估结论：候选 `docs/harness/audit/` **采纳** —— 不在 `S2_TRUTH_PREFIXES`（`src/cli-shared.ts:90-98` 实证三前缀）· 与 S2 过程轨平级独立 · 机械断言落点不在 S2（验收 #10）。**禁区**：永不写入 `docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`。
- **字段集（v1 · `schema_version: "1"` · 快照断言面）**：
  - 必填：`schema_version`（string · 恒 "1"）· `event`（enum：`verify` | `gate_check` | `task_close` | `audit` | `hook_guard`）· `ts`（ISO-8601 UTC）· `verdict`（`PASS` | `BLOCKED` | `FAIL`）· `exit_code`（number）
  - 可选：`task`（slug 或缺省）· `gates`（闸态快照数组 `{id, status}` · 有 --task 时填）· `detail`（点名摘要）· `duration_ms`（number）· `degraded` + `degrade_reason`（F-W6-01/F-W6-05 分档留痕）
  - 路径字段一律相对化（toRel 口径 · G3 纪律 · 绝不绝对路径）。
- **接线面（三产出点 · 同一 `appendAuditEvent` 单一实现源 · 建议新模块 `src/audit/log.ts`）**：① `cmdAudit`（`src/cli/gates.ts:188-204` · 主产出点 · C6 名义主体）；② `cmdVerify` --task 各 verdict 出口（`src/cli/verify.ts` 各 fail/PASS 点 · 含闸态快照）；③ `cmdTaskClose` verdict（`src/cli/task-cmd.ts` BLOCKED/READY/PASS 三态）。`hook_guard` 事件归 S6.6（G7 面）。
- **默认开落盘**：audit/verify --task/task close 运行时默认追加事件（C6 目标 = 「不落痕」→ 落痕默认开）；**不加 opt-out 绕过旗标**（观测面不仿 --allow-* 面 · 留 20 复核）。
- **F-W6-01 降级**：落盘失败（EACCES/ENOSPC/目录不可建）→ stderr `warn: audit 落盘失败（降级 · 门禁主流程不受影响）: <reason>` · **exit code 与 verdict 零变更**（审计是观测面不阻断 · fixture 断言）。
- **F-W6-02 机械拒写**：可选 `--audit-file <path>` 覆盖落点 → 必经 `assertNotS2Abs`（`src/cli-shared.ts:123`）· 命中 S2 三域 → 拒写点名（`cli-skills.ts:367-369` 先例文案同式）· **无豁免参数**（硬约束 2）。
- **git 追踪口径（草案裁决 · 留 20 复核）**：`docs/harness/audit/*.jsonl` 入 `.gitignore`（运行流 = 观测面非证据面 · 防每次跑门禁脏工作区）；被引为证据的具体事件**摘录入 invoke/自检结论**（tracked · 硬约束 14 同口径 · 与 W5「证据面 = 自检结论文本」先例一致）。
- **快照断言**：fixture 跑 audit/verify → 读 audit.jsonl → 逐键断言字段集/类型/必填性（`Object.keys` 快照 + 必填键存在性 + event 枚举值域）。

### S6.2 F4 · S2 公理接真实触发源（SPEC 范围② · F-W6-05）

- **现状盘点（基线节在案）**：statements 无触发源字段 · status 来自人工重盘纸面口径。
- **方案定稿**：新增 `discipline check` 子命令（src 内随包分发 · 消费仓可用 · 与 `discipline show` 同档 `src/cli-lifecycle.ts`）—— 对 statements 中登记 `trigger`（**additive 新字段 · 只增 · 闸行裁决③**）的条目**实跑验证**：`trigger = { command, expect }`（如 A1 类：构造 pending 闸 fixture task → `verify --task` → 期望 exit 2 BLOCKED）。输出**纸面口径与真实口径可区分**：双列 `declared`（yaml status 纸面值）vs `verified`（实跑结果 · pass/fail/unreachable）。
- **v1 接线范围（收窄 · 登记）**：S2 公理面 statements（A1/A5/A6/A7/B4）+ 本波新接线四条（G2/G4/N2-C/G7 对应声明）· 全量 mechanical 条目触发源化为后续波次（非范围 · 登记留痕）。
- **hooks 执行证据（W2 产出）消费**：`hook_guard` 审计事件（S6.6）作为「hooks 门禁真跑过」的真实触发源 · discipline check 可查审计轨佐证。
- **F-W6-05 分档**：trigger 不可达（git 缺 / 环境不具备 / fixture 依赖不满足）→ `verified: unreachable` 分档 + 原因点名 · **不误报 fail**（硬约束 10 精神 · R-6 先例）。

### S6.3 G2 · reviews 存在性闸（SPEC 范围③ · **现码已接线 · 本波 = 回归锁 + 回写**）

- **现状实证（起草发现 · 留 20 复核）**：verify --task 存在级 `src/cli/verify.ts:323-328`（缺 → `VERIFY: BLOCKED · missing R<n> review` exit 2 · `--allow-no-review` 真豁免留痕 :329-335）+ 结论级 :338-371 · close `evalCloseReview` `src/checks/close-guards.ts:95-111`。**SPEC ③「接线」前提与现码偏差** —— 本波不重接，兑现为：
- **① 防回退回归锁**：负向 fixture（temp 仓 task 无审查文 → verify --task BLOCKED 点名 · task close `close_review` fail 点名）若未来闸被移除即转红；
- **② 负向 fixture 真红实证**：现态复跑点名输出入自检结论（硬约束 14 文本证据面）；
- **③ statements C1/C2 回写**（S6.7 · not_wired → mechanical · 机制锚点刷新 W0 后新址）。
- **不追溯存量**（硬约束 7 · F-W6-03）：done 面 warn 降级与 `legacy-gate-exempt.yaml` 豁免通道**既有**（verify.ts:347-364 · 本波零变更 · 波及入豁免留痕同既有口径）。

### S6.4 G4 · 思考轮控制表闸接线（SPEC 范围④ · 验收 2）

- **改造点**：`src/cli/verify.ts` cmdVerify --task 链新增思考轮结构判定步（复用 `src/checks/lint.ts:102-132` 同族判据 · 抽共享 helper 或 lintTaskFile 内升 error 级 · 30 择一并注释口径）。
- **判据定稿**：task **有思考轮节**（`### R0` 或思考轮标题 · W4 触发同口径）且 缺 R0–R5 槽位 / 缺控制表（`| 轮 | 结论 | early_stop |` 表头）/ early_stop=yes 缺 reason → **active 面 failClosed**：`VERIFY: BLOCKED · 思考轮控制表缺口（缺 <槽位/控制表/reason> 点名）` exit 2；**done 面 warn 降级不挡**（D-23-W4-TRANSITION 同式 · 不追溯存量 · 硬约束 7 · 波及入 `legacy-gate-exempt.yaml` 豁免留痕）；**无思考轮节维持豁免**（SPEC 承载 / bugfix 轨 · W4 语义不动）。本波即 D-23-W4-G4-EXIT「后续 SPEC 明文裁决」的兑现（SPEC 07 ④ signed 在案）。
- **负向 fixture（红测先行 · 硬约束 6）**：缺控制表的 fixture task → **接线前** verify PASS（warn-only 现状）真红留证 → **接线后** BLOCKED 点名复绿 · done 目录同名 fixture warn 不挡对照。

### S6.5 N2-C · `verify --task` 补 lint 步 + FAIL 率实测（SPEC 范围⑤ · 验收 3 · **不降不得完成**）

- **插入点定稿**：`src/cli/verify.ts` cmdVerify --task 链 · `runTestCheck`（:316）之后、审查文闸（:323）之前插入 lint 步：`lintTaskFile`（`src/checks/lint.ts:21` 单一实现源复用）→ `errors` 非空 → `VERIFY: BLOCKED · task lint FAIL（E 规则点名 · 逐条列示）` exit 2；`warnings` 不挡（W1–W7 warn-only 语义不动 · G4 由 S6.4 独立接线 · 两闸正交）。
- **done 面降级**：task 文件在 `*/done/` → lint FAIL 降级 warn 不挡（不追溯存量 · 与 G2 结论级 done 降级同式 · :347-364 先例）。
- **`--allow-lint-fail` 真豁免留痕**（DEF-011 清单登记旗标本波接线 · verify.ts:248 注释在案）：豁免生效 → `waived[]` + 文本留痕（与 T4 `--allow-no-review` 同式）。
- **FAIL 率实测方法（定稿口径 · 前后数字入自检结论）**：
  - **语料**：`docs/tasks/{done,active}/*.md` 排除非 task 的 README.md（80 件 · 基线节在案）。
  - **指标定义**：**lint 逃逸率** = 语料中 lint errors>0 的文件在 `verify --task` 下未因 lint 被判 BLOCKED 的比例（lint 缺陷穿透门禁率）。
  - **前基线（本棒实测）**：lint FAIL 27/80（33.8%）· 逃逸率 **100%**（lint 不在链 · 27/27 全逃逸）。
  - **后测设计**：接线后同口径复跑 —— ① 负向 fixture（lint-FAIL fixture task → BLOCKED 点名 E 规则 · 红转绿）；② 全量语料复跑：active 面逃逸率须 = **0%**（failClosed）· done 面 27 件存量走 warn 降级逐条登记（不追溯 · 豁免/降级清单入自检结论）；③ 逃逸率 100% → 0%（active 口径）为**硬完成判据 · 不降不得标记完成**（SPEC 验收③ · F-W6-04）。
  - **防口径漂移**：前后两次测量用同一脚本同一语料（脚本入 `scripts/` 或测试 fixture · 30 定稿 · 命令入自检结论 · 硬约束 14）。

### S6.6 G7 · 执行证据接线（SPEC 范围⑥）

- **判据细化（对照 yaml 语义 · SPEC residual_risk ② 兑现）**：A5/B2「真跑过无证据」→ 执行证据 = **审计轨中存在对应事件且 `exit_code` 与声称吻合**。
- **接线面**：① `hook_guard` 事件落审计轨（`src/host/hookguard.ts` runGateCommand :53-64 后 · 字段含 trigger/command 摘要/gate exit_code · 门禁真跑过即留证）；② verify/task close/audit 事件自带 exit_code（S6.1）= 门禁真跑过证据面。
- **close 对照判据（本波定稿 warn-only · 留 20 复核）**：task close 时自检结论声称跑过 verify 而审计轨无对应 `verify` PASS 事件 → `close: warn · 执行证据缺口` 点名**不挡 close**（合规率未知 · 与 G4 warn-only 先例 D-23-W4-G4-EXIT 同式 · 升 failClosed 归后续 SPEC 明文裁决）。
- **fixture**：hook-guard 跑门禁 → 审计轨 `hook_guard` 事件存在且 exit_code 吻合断言；close warn 对照正/负 fixture。
- **回写口径联动（S6.7 · 诚实优先）**：G7 落地为 warn-only ⇒ statements A5/B2 升 `partial`（有机制但覆盖不全）· gap G7 行回写按落地档定 —— **若 warn-only 则 G7 不回写 closed**（SPEC ⑦ 字面 mechanical/closed 与诚实口径冲突时 · 偏差登记留 20/00 裁定）。

### S6.7 coverage 回写（SPEC 范围⑦ · 验收 4）

- **回写清单**：statements **C1/C2/D3** not_wired → mechanical（锚点刷新 W0 后新址）· **A5/B2** gap:G7 消除 + status 按 S6.6 落地档（failClosed→mechanical · warn-only→partial）· gaps **N2-C** deferred → closed（closed_in 口径随 3.0.0 · 参照 WIKI-DELTA "unreleased" 先例）· gaps **G7** 按落地档 · gaps **G6 不动**（归 W7）· `as_of_package_version` 与 source_audit 注记同步更新。
- **锚点刷新（起草发现 · 顺带清偿）**：现存机制锚点全为 W0 前 `src/cli.ts#xxx` 旧址 —— 本波回写时**逐条复核刷新**为 W0 后新址（verify.ts / checks/ / cli-task-extra.ts 等 · 只回写本波触及条目 + 明显失效锚点 · 全量重盘非范围 · yaml 头注「禁止每周全量重盘」纪律遵守）。
- **机检一致**：`discipline show`（`src/cli-lifecycle.ts:114-152` 只读 yaml）输出 status 计数快照断言与 yaml 回写一致（W3 F2 后真口径面）+ `discipline check`（S6.2）登记条目全绿。

---

## 非范围（SPEC §4 全继承 + 本棒明示）

| 项 | 理由 |
|----|------|
| 遥测上报 / 接外部日志服务 | SPEC §4 / PLAN W6 明示（本地落盘即可） |
| **审计日志写入 S2 三域** | **禁区**（硬约束 1 · F-W6-02 机械拒写 · 无豁免参数） |
| G6 归档类（git 行为层） | 归 W7（SPEC §4 · gaps G6 deferred 本波不动） |
| statements 全量触发源化 | S6.2 v1 收窄 S2 公理面 + 本波四条 · 全量为后续波次（登记留痕） |
| coverage yaml 全量重盘 / 锚点全量刷新 | yaml 头注纪律（禁每周全量重盘）· 只回写本波触及条目 |
| 审计落盘 opt-out 旗标（`--no-audit` 类） | 默认不开新绕过面（硬约束 2 精神）· 若 20 裁定需要则评审后加 |
| exit code 语义变更 | 既有面零变更 · 新增 BLOCKED 均走既有 exit 2（VERIFY_BLOCKED_EXIT_CODE `src/cli/usage.ts:28`） |
| 新运行时依赖 | 审计落盘用 node:fs · dependencies 仍仅 `js-yaml` |
| tag/push/publish/deprecate | 仅人（RELEASING.md · 无代跑授权） |

---

## failure_paths

| ID | 触发 | 行为 | 可重试 | 用户可见 |
|----|------|------|--------|----------|
| F-W6-01（继承 SPEC） | 审计日志落盘失败（权限/磁盘） | 门禁主流程不受影响（观测面降级）· stderr 显式 warning · verdict/exit code 零变更 · fixture 断言 | 是 | 是 |
| F-W6-02（继承 SPEC） | 审计日志被指向 S2 三域（`--audit-file`） | `assertNotS2Abs` 机械拒写点名（S2_TRUTH_PREFIXES 单一真值源）· 无豁免参数 | 是 | 是 |
| F-W6-03（继承 SPEC） | G2 接线误伤存量合规 task | 不追溯存量（硬约束 7）· done 面 warn 降级与 legacy-gate-exempt.yaml 豁免通道既有 · 波及入豁免留痕 | 是 | 是 |
| F-W6-04（继承 SPEC） | N2-C 接线后 FAIL 率不降 | 本项不得标记完成 · 回查 lint 步是否真入链（fixture 红转绿 + 全量复跑对照为判据） | 是 | 是 |
| F-W6-05（继承 SPEC） | F4 真实触发源不可达（环境缺触发条件） | `verified: unreachable` 分档诊断 + 原因点名（硬约束 10 精神）· 纸面 declared 与真实 verified 输出可区分 | 是 | 是 |
| **F-W6-06（本棒新增）** | audit.jsonl 并发追加交错 / 坏行混入 | JSONL 逐行容错：消费端逐行解析 · 坏行 skip + warn · 不因坏行拒写新事件 · 单行原子追加 | 是 | 是 |
| **F-W6-07（本棒新增）** | `--audit-file` 指向仓外路径 | 拒绝（C1-b/F-W2-02 同式跨仓禁止 · exit 1 用法错口径）· 落点须在 target 仓内 | 是 | 是 |
| **F-W6-08（本棒新增）** | G4/N2-C 升 failClosed 误伤存量 done task | done 目录 warn 降级不挡（D-23-W4-TRANSITION 同式）· 豁免走 legacy-gate-exempt.yaml 既有通道 · 逐条登记入自检结论 | 是 | 是 |
| **F-W6-09（本棒新增）** | `--allow-lint-fail` 滥用绕过 lint 步 | 真豁免非静默：waived[] + 文本留痕（T4 同式）· 豁免面可审计 | 是 | 是 |
| **F-W6-10（本棒新增）** | 审计流默认落盘致消费仓工作区脏 | 草案裁决 `.gitignore` 排除 `docs/harness/audit/*.jsonl`（S6.1 · 留 20 复核）· 证据摘录入 invoke/自检结论（硬约束 14） | — | 是 |
| F-W6-11 | `git add -A` 裹挟域外档 | 打回 · 撤 stage 逐文件显式 add | 是 | — |
| F-W6-12 | 越权执行 tag/push/publish/deprecate | 违禁令 · 打回（四动作全仅人） | — | 是 |

---

## 验收标准（必须自证，不接受「我改完了」）

- [ ] **#1 C6 字段 schema 快照断言**（SPEC 验收 1 · S6.1）：fixture 跑 audit/verify --task → audit.jsonl 事件逐键断言（必填五键 `schema_version/event/ts/verdict/exit_code` 存在 + 类型 + `schema_version==="1"` + event 枚举值域 + 可选键类型）· `Object.keys` 快照在案 · append-only 断言（两次运行行数递增 · 无覆写 · 首行内容逐字不变）
- [ ] **#2 C6 三产出点接线**（S6.1）：cmdAudit / cmdVerify --task / cmdTaskClose 三面各落事件（同一 appendAuditEvent 单一实现源 · fixture 三面断言）· 闸态快照 gates[] 在有 --task 时非空
- [ ] **#3 F-W6-01 降级 fixture**：落盘目录不可写（chmod 000 / 只读模拟）→ stderr warning 点名 + 主流程 verdict 与 exit code 零变更断言（修复前后对照）
- [ ] **#4 F-W6-02 S2 拒写 fixture**：`--audit-file` 分别指向 docs/tasks/ · docs/harness/reviews/ · docs/harness/invokes/by-task/ 三域 → 逐一拒写点名（exit 非 0 · 无豁免参数可绕）
- [ ] **#5 G2 回归锁 + 负向 fixture 实证**（SPEC 验收 2 前半 · S6.3）：temp 仓 task 无审查文 → verify --task `BLOCKED · missing R<n> review` 点名 exit 2 · task close `close_review` fail 点名 · 现态复跑输出入自检结论（防回退锁 · 闸被移除 fixture 即红）
- [ ] **#6 G4 负向 fixture 红转绿**（SPEC 验收 2 后半 · S6.4）：有思考轮节缺控制表 fixture → 接线前 verify PASS（warn-only）真红留证 → 接线后 `BLOCKED` 点名缺项 · done 目录同 fixture warn 不挡对照 · 无思考轮节豁免 fixture 不挡
- [ ] **#7 N2-C FAIL 率前后数字**（SPEC 验收 3 · S6.5 · **不降不得完成**）：lint 步入链（lintTaskFile 复用 · errors→BLOCKED 点名 E 规则 · warnings 不挡）· 负向 fixture 红转绿 · **前 = 逃逸率 100%（27/27）· 后 = active 面 0%** 同口径复跑对照表入自检结论 · done 存量 27 件 warn 降级逐条登记 · `--allow-lint-fail` 豁免留痕 fixture
- [ ] **#8 G7 执行证据 fixture**（S6.6）：hook-guard 跑门禁 → 审计轨 `hook_guard` 事件存在且 exit_code 吻合断言 · verify/close 事件 exit_code 在轨 · close warn 对照正/负 fixture（不挡 close）
- [ ] **#9 coverage 回写机检**（SPEC 验收 4 · S6.7）：C1/C2/D3 → mechanical · N2-C → closed · A5/B2/G7 按落地档（warn-only 则 partial + 偏差登记）· G6 不动 · 失效锚点刷新登记 · `discipline show` status 计数快照断言与 yaml 一致 · `discipline check` 登记条目全绿（unreachable 分档不误报）
- [ ] **#10 审计落点不在 S2 机械断言**（SPEC 验收 5）：默认落点 `docs/harness/audit/audit.jsonl` 对 `S2_TRUTH_PREFIXES` 三前缀逐一否定断言（isS2RelPath 单测）+ #4 拒写 fixture 联动
- [ ] **#11 平台锁**（SPEC 验收 6）：`npm run typecheck` 0 错 · `npm test` 全绿（基线 810/154/809/0/1 + 新增用例数 · 零意外红 · skip 数变化逐条归因）· pins **17/17** · 依赖零新增（dependencies diff 空）
- [ ] **#12 既有面零意外改动**（F-W2-13 同式纪律）：除登记项外既有断言零改动全绿 · 登记项逐条列明于自检结论（预期登记面：verify.ts 链插两步 · lint.ts G4 判定升级面 · gates.ts cmdAudit 落盘 · task-cmd.ts verdict 落盘 · hookguard.ts 事件落盘 · cli-lifecycle.ts discipline check · usage.ts 用法串 · yaml 回写 · .gitignore 一行）
- [ ] **#13 结构闸**：`npx spec-wave task lint --file docs/tasks/active/task_3_0_w6_observability_audit.md` PASS
- [ ] **#14 执行粒度**：提交逐文件显式 add（禁 `git add -A`）· 每 commit 独立可回退 · 每 commit 前后 npm test 同绿 · 未执行 tag/push/publish/deprecate · 波末 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w6_observability_audit.md` → exit 0 + `task close --yes` 闭环（待 40 复核后另行 · 00 口径）

---

## 给执行帽的必读列表

1. SPEC [`07_w6_observability_audit_v1.md`](../../spec/3_0-architecture-leap/07_w6_observability_audit_v1.md) 全文（范围 ①–⑦ · 非范围 · 验收 1–6 · F-W6-01–05 · §5 设计要点 C6↔S2 边界）· [`00_policy_and_boundaries.md`](../../spec/3_0-architecture-leap/00_policy_and_boundaries.md)（S2/P0/流程边界）
2. PLAN [`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W6 节（:281-286）+ 硬约束 1/2/6/7/10/14/15（:330-344）
3. 现码（2026-09-17 实读行号 · 改前复读）：`src/cli/verify.ts`（cmdVerify --task 链 :303-410 · lint 步插入点 :316/:323 之间 · G2 存在级 :323-328 · done 降级先例 :347-364 · DEF-011 注释 :248）· `src/cli/gates.ts`（cmdAudit :172-205 · C6 主产出点）· `src/cli/task-cmd.ts`（cmdTaskClose verdict 三态 :116-168）· `src/checks/lint.ts`（lintTaskFile :21 · G4 warn-only :102-132）· `src/checks/close-guards.ts`（evalCloseReview :95-111 · CLOSE_GUARD_ORDER 消费面）· `src/checks/review-gates.ts`（findLatestReview :92-114 · evalReviewConclusion :164-205）· `src/checks/invoke-hats.ts`（G4 相邻面 · 帽集合判据先例）· `src/cli-shared.ts`（S2_TRUTH_PREFIXES :90-98 · assertNotS2Abs :123-131 · parseHumanGates · toRel）· `src/cli/usage.ts`（CLOSE_GUARD_ORDER :8-22 · VERIFY_BLOCKED_EXIT_CODE :28）· `src/cli-lifecycle.ts`（loadDiscipline :79-91 · formatDisciplineShow :114-152 · discipline 子命令分发 :478-495）· `src/host/hookguard.ts`（runGateCommand :53-64 · cmdHookGuard :66-131）
4. 资产：`assets/harness/discipline-coverage.yaml`（statements C1/C2/D3 not_wired · gaps G6/G7/N2-C deferred · 头注 status 口径与「禁全量重盘」纪律）· `docs/harness/legacy-gate-exempt.yaml`（豁免四字段格式）
5. 既有测试面：`test/cli-task-close-guards.test.ts`（close 守卫 fixture 先例）· `test/w2-shell-hook.test.ts`（gitAvailable 探测先例 :47-49 · e2e 真实 commit 面）· `test/cli-json-no-abs-path.test.ts`（assertJsonNoAbsRoot :47 · 快照断言先例）· `test/cli-security-closure.test.ts`（exit 1/2 边界用例组）
6. done task 先例：[`task_3_0_w5_mechanical_cleanup.md`](../done/task_3_0_w5_mechanical_cleanup.md)（红测先行 · F-W2-13 登记纪律 · 闸行裁决体例 · 阶段锁计数口径）· `task_3_0_w4_semantic_criteria.md`（评审文驱动判据定稿先例）
7. `RELEASING.md`（发布边界 · 四动作仅人）

---

## 思考轮

### R0 · 证据

SPEC 07（signed · 范围 ①–⑦ · 验收 1–6 · F-W6-01–05）+ PLAN W6 节（:281-286）+ 硬约束 1/2/6/7/10/14/15 + 本棒全量实读复核：基线复跑（810/154/809/0/1 · duration ≈96s · typecheck 0 · pins 17/17 · HEAD `b461b34` · tree clean · tag v2.4.2 在）· 现码行号逐条实读（verify.ts :303-410 链 · gates.ts cmdAudit :172-205 · lint.ts G4 warn-only :102-132 · close-guards.ts evalCloseReview :95-111 · cli-shared.ts S2 面 :90-131 · hookguard.ts 实跑面 :53-131）· **N2-C 前基线实测**（lintTaskFile 全语料 80 件 · FAIL 27/80=33.8% · 逃逸率 100% · 规则分布 E3×22/E5×17/E4×10/E2×3/E6×1）· 起草发现三条（G2 已接线 SPEC 前提偏差 · yaml 锚点 W0 前旧址全失效 · C1/C2 not_wired 真残留）。

### R1 · 范围

①–⑦ 照规格化节 S6.1–S6.7（SPEC §3 对照）；非范围照 SPEC §4 全继承 + 本棒明示六条：statements 全量触发源化缓做 · coverage 禁全量重盘 · 审计 opt-out 旗标不设 · exit code 零变更 · 零新依赖 · 发布四动作仅人。

### R2 · 方案

C6 落点定稿 `docs/harness/audit/audit.jsonl`（候选采纳 · 不在 S2_TRUTH_PREFIXES 实证 · JSONL append-only · 字段集必填五键+可选五键）· F4 定稿 `discipline check` 实跑验证（declared vs verified 双列可区分 · v1 收窄 S2 公理面）· G2 不重接（回归锁+回写 · 现码已接线实证）· G4 升级通道 = SPEC 07 ④ signed 兑现 D-23-W4-G4-EXIT · N2-C lint 步插 runTestCheck 后（复用 lintTaskFile 单一源 · `--allow-lint-fail` DEF-011 旗标接线）· FAIL 率指标定稿 = lint 逃逸率（防「存量不合规率不追溯导致指标不动」口径陷阱）· G7 warn-only 落地（合规率未知 · 先例同式）· S2 拒写复用 assertNotS2Abs（不造第二真值源）。

### R3 · 边界

S2 只新增（本 task 文件 + 30 执行留档）· **审计轨永不入 S2 三域**（机械断言 #10 + F-W6-02 拒写）· **不签任何闸**（双 pending 待 00 翻转）· 闸行裁决（不设 HG-SCHEMA-CHANGE 三理由 + 升级条款）留 20 复核 · 硬约束 1/2/6/7/10/14/15 · 观测面降级不阻断主流程（F-W6-01）· 不追溯存量（done warn 降级三面：G2 既有/G4/N2-C）· G7 诚实口径优先于 SPEC ⑦ 字面（warn-only → partial 不回写 closed · 偏差登记）· 禁裹挟 · 发布仅人。

### R4 · 可测性

验收 14 条全机械可断言（命令 + fixture + 期望输出均落验收节）：C6 快照断言 + append-only · F-W6-01 降级对照 · S2 拒写三域逐一点名 · G2 回归锁 · G4/N2-C 红测先行 · **N2-C 前后数字硬判据（100%→0% · 不降不得完成）** · G7 事件在轨断言 · coverage 回写快照一致 · 落点否定断言 · 平台锁 · 结构闸 · 执行粒度。唯一非纯机械点 = G7 落地档裁定与 .gitignore 追踪口径（机械化其留痕面：裁定理由入自检结论 · 留 20 复核）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待审查文落盘 + 00 代签 · 维护者 2026-09-16 授权模式）；双闸 pending 待 00 翻转；G7 落地档 / git 追踪口径 / 闸行裁决留 20 复核；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | SPEC signed + PLAN W6 + 基线全量复跑（810/154/809/0/1 · typecheck 0 · pins 17/17 · HEAD b461b34）+ 现码行号逐条实读 + N2-C 前基线实测（27/80=33.8% · 逃逸率 100%）+ 起草发现三条 | no |
| R1 | 范围 ①–⑦ + S6.1–S6.7 规格化 · 非范围 SPEC §4 全继承 + 本棒明示六条 | no |
| R2 | C6 落点/字段集定稿 · F4 discipline check 定稿 · G2 回归锁化 · G4 升级通道兑现 · N2-C 逃逸率指标 · G7 warn-only · S2 拒写复用单一源 | no |
| R3 | S2 只新增 + 审计轨永不入三域 · 不签闸 · 硬约束 1/2/6/7/10/14/15 · 观测面降级不阻断 · 不追溯存量 · G7 诚实口径优先 · 发布仅人 | no |
| R4 | 验收 14 条全机械 · N2-C 前后数字硬判据 · 红测先行面明示 · 非机械点留痕面机械化 | no |
| R5 | 待 20 审 R1 裁定充分性 · 双闸待 00 翻转 · G7 落地档 + 追踪口径 + 闸行裁决留 20 复核 | no |

**residual_risks**：① **G7 warn-only 落地与 SPEC ⑦「mechanical/closed」字面冲突**（缓解：诚实回写 partial + 偏差登记留 20/00 裁定 · 不虚标 closed）；② **审计流 git 追踪口径争议**（.gitignore 排除 = 观测面非证据面 · 缓解：草案裁决在案 + 证据摘录走 invoke/自检结论 · 留 20 复核）；③ **discipline check v1 覆盖收窄**（仅 S2 公理面 + 本波四条 · 全量触发源化后续波次 · 缓解：收窄登记入 yaml notes + 自检结论）；④ **N2-C 存量 27 件 lint-FAIL 降级面**（done warn 不挡 · 缓解：逐条登记 + 豁免通道既有 · 硬约束 7）；⑤ **审计落盘默认开对消费仓的 DX 影响**（每跑门禁追加一行 · 缓解：.gitignore 排除 + F-W6-01 降级不阻断 + F-W6-06 坏行容错）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 验收主体 = **机械锁全绿**（C6 schema 快照 + 降级/拒写 fixture + G2 回归锁 + G4/N2-C 负向 fixture + G7 事件 fixture + coverage 一致机检 + 落点否定断言 · 命令与判据见验收节），辅以：① **红测先行**（G4/N2-C 每条修严 fixture 修复前真红留证 · 修复后转绿 · 硬约束 6；G2 为防回退锁形态 · 现态实证点名入自检结论）；② 每 commit 前后 `npm test` 同绿（基线 810/154/809/0/1 · skip 数变化逐条归因 · 环境红按 F-W0-07 同式对照实验先行定性）；③ 既有面回归（cli-task-close-guards / w2-shell-hook / cli-json-no-abs-path / cli-security-closure 等 · 登记项逐条列明 · F-W2-13 同式纪律）；④ **N2-C FAIL 率前后数字为硬完成判据**（同脚本同语料 · 逃逸率 100%→0% · 不降不得标记完成 · SPEC 验收③）；⑤ duration 加性克制（基线 ≈96s · 审计落盘 fixture 用 temp target 不触真仓）。**本波是可观测接线波 · 红绿纪律 = 修严面 fixture 先行 · 观测面降级≠放行（exit code 零变更断言）· 诚实口径优先于 SPEC 字面（G7 落地档）。**

---

## 提交信息约定

- `feat(3.0-W6): C6 结构化审计日志落盘（audit.jsonl append-only · 三产出点 · S2 拒写 · F-W6-01 降级）`
- `feat(3.0-W6): F4 discipline check 真实触发源（declared/verified 双列 · unreachable 分档）+ G7 执行证据事件`
- `feat(3.0-W6): G4 思考轮控制表入 verify --task（active failClosed · done warn 降级）+ N2-C lint 步入链（--allow-lint-fail 留痕 · FAIL 逃逸率 100%→0%）`
- `feat(3.0-W6): coverage 回写（C1/C2/D3 mechanical · N2-C closed · G7 按落地档 · 锚点刷新）+ discipline show 一致机检`
- `test(3.0-W6): 负向 fixture 组（G2 回归锁 · G4/N2-C 红转绿 · S2 拒写三域 · F-W6-01 降级）`
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界（F-W6-11）
- **禁 tag / push / publish / deprecate（仅人 · 无代跑授权）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w6_observability_audit.md`

---

### 自检结论（执行者）

（待 30 回填）

### KPI（00）

（待 00 收官裁定回填）
