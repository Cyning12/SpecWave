# 审查文：task_3_0_w6_observability_audit · R1（20-task-audit）

> **hat_id**：20-task-audit · **轮次**：R1 · **日期**：2026-09-17  
> **审查对象**：`docs/tasks/active/task_3_0_w6_observability_audit.md`（3.0 W6 可观测与审计 · HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1=pending）  
> **对照真值**：SPEC `docs/spec/3_0-architecture-leap/07_w6_observability_audit_v1.md`（signed · 范围 ①–⑦ · 验收 1–6 · F-W6-01–05）· PLAN `PLAN_3_0_architecture_leap_v1_zh.md` W6 节（:281-286）+ 硬约束 1/2/6/7/10/14/15（:330-344）· `assets/harness/discipline-coverage.yaml`（G2/G4/N2-C/G7 登记现值 · 本审实读）· 格式先例 `task_3_0_w5_mechanical_cleanup_audit_R1_20260917.md`  
> **审查性质**：书面审查 + 独立复核实测（基线全量复跑 + N2-C 前基线 lintTaskFile 全语料复测 + 行号抽核 + G2 已接线 grep 实证 + 闸机检）；**未改** task / SPEC / PLAN / src / assets / test / package.json 实质内容；**不代签** HG-AUDIT-R1（归 00 代签）

---

## 一、结论摘要

| 维度 | 结论 |
|------|------|
| **内容**（可执行性 / 与 SPEC+PLAN 一致性） | **PASS-with-issues**：blocking **0** · advisory **4**（A1 N2-C 前基线复测口径差 ±1（81/27/33.3% vs 声称 80/27/33.8% · FAIL 27 逐文件全中 · 逃逸率 100% 实质成立）· A2 一处行号快照小疵（cmdDiscipline :478-495 → 实测 :474-495）· A3 草案① .gitignore 只覆盖本仓 · 消费仓脏面口径须自检登记 · A4 W6 invoke 目录现为空（10 invoke 未落盘 · pre-30 闸 required ∩ {10,20,00} 须齐）；均不阻塞签闸） |
| **流程闸** HG-AUDIT-R1 | **pending**（真值以 task `### 人工闸` 表为准）；本审查文落盘即满足「20 审查文落盘」前置，签署归 **00 代签**（维护者 2026-09-16 授权模式），**pending 期间 30 拒改码**（本审机检实测：`task lint` PASS ✓（W3 占位符 warn 属 draft 期合法）· `gate-check` exit 2 ❌ 拒 30 ✓ · `verify` 首输出闸扫描表 + `VERIFY: BLOCKED · HG-AUDIT-R1 pending` exit 2 ✓） |
| 思考轮 R0–R5 | 控制表填全（六轮 early_stop 全 no · residual_risks 五条每条带缓解 · ①②恰对应本审重点 2/4 裁定面）· R5 待本轮裁定——**本轮裁定：充分** |

---

## 二、常规核对（对照 SPEC / PLAN / 硬约束逐项）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 ①–⑦ 与 SPEC §3 | ✅ 逐项对应且规格化 | ① C6→S6.1（落点定稿 docs/harness/audit/audit.jsonl · append-only · 字段集必填五键+可选 · 三产出点单一实现源）· ② F4→S6.2（discipline check declared/verified 双列 · v1 收窄登记）· ③ G2→S6.3（**现码已接线 · 回归锁+回写**）· ④ G4→S6.4（active failClosed · done warn 降级）· ⑤ N2-C→S6.5（lint 步插 runTestCheck 后 · 逃逸率硬判据）· ⑥ G7→S6.6（hook_guard 事件 + close warn-only）· ⑦ coverage→S6.7（回写清单 + 锚点刷新 + 机检一致）——无自创范围 |
| 非范围与 SPEC §4 + PLAN W6 | ✅ 全继承 + 合规增益 | SPEC 三条全在（遥测/外部日志 · S2 三域禁区 · G6 归 W7）+ 本棒明示六条（全量触发源化缓做 · 禁全量重盘 · 不设 opt-out · exit code 零变更 · 零新依赖 · 发布四动作仅人）——与 PLAN W6 非范围（:284）及风险口径（:286 不降不完成）逐字对齐 · 依赖零新增（dependencies 仅 `js-yaml` ^4.1.0 本审实证 package.json:86-88 ✓） |
| 验收标准与 SPEC §7 | ✅ 1–6 全覆盖 + 机械化加强 | SPEC 1→#1/#2（schema 快照 + append-only + 三产出点）· 2→#5/#6（G2 回归锁 + G4 红转绿）· 3→#7（逃逸率 100%→0% 硬判据 · 不降不得完成）· 4→#9（回写 + discipline show 快照一致）· 5→#10（落点对 S2_TRUTH_PREFIXES 三前缀逐一否定断言）· 6→#11（typecheck + 全绿 + pins 17/17 + 依赖零新增）；#3/#4（F-W6-01/02 fixture）· #8（G7 事件在轨）· #12（F-W2-13 同式登记纪律）· #13（task lint）· #14（执行粒度 + gate-check 闭环）为加强项，命令+fixture+期望输出全落验收节 |
| failure_paths 与 SPEC §8 | ✅ F-W6-01–05 全继承 | 逐条对应且行为列更具体；新增 F-W6-06–12（JSONL 坏行容错 · --audit-file 仓外拒绝 · G4/N2-C 误伤存量降级 · --allow-lint-fail 滥用留痕 · 审计流脏工作区 · 裹挟 · 越权发布）逐条必要——06 是 JSONL append-only 消费面补全 · 10 正是本审重点 4① 的 task 面兑现 |
| 依赖 / 必读列表 | ✅ 充分 | SPEC+PLAN+现码行号（本审抽核 25+ 处全中 · 1 处小疵见 A2 · 见下）+ 资产锚 + 既有测试面四文件 + done 先例 + RELEASING |
| 思考轮控制表 R0–R5 | ✅ 填全 | R0 含基线全量复跑 + 行号逐条实读 + N2-C 前基线实测 + 起草发现三条（本审全部独立复现 · 见下）；R1–R3 闭合；R4 验收 14 条全机械 + 非机械点留痕面机械化（G7 落地档裁定理由入自检结论）；R5 待本轮（裁定充分） |
| `### 人工闸` 表可机检性（硬约束 15） | ✅ | 闸表在 `### 人工闸` 节；本审实测 `npx spec-wave gate-check --task …` 渲染两闸行（HG-TASK-DRAFT approved blocks 20,30 / HG-AUDIT-R1 pending → ❌ 拒 30 · **exit 2**）· `verify --target . --task …` 首输出闸扫描表 + `VERIFY: BLOCKED · HG-AUDIT-R1 pending`（**exit 2**）· `task lint` PASS |
| 闸行裁决（不设 HG-SCHEMA-CHANGE · task :43 留 20 复核） | ✅ 裁决成立 | 理由①（coverage 回写 = 按已批准 schema 写数据 · 键形态与字段集零变更）成立——类比 W4①/W5① 同构 ✓；理由②（C6 审计事件 schema = 新增内部落盘格式 · 无既有消费者契约可破）成立——docs/harness/audit/ 目录不存在（本审实证）· 全新文件全新机制 ✓；理由③（F4 statements 增 `trigger` = additive 扩键）成立——loadDiscipline 校验面仅查 version/as_of_package_version/statements 数组存在性（`src/cli-lifecycle.ts:87-89` 本审实证 ✓）· additive 键被容忍 · formatDisciplineShow 只读 id/status/summary（:114-152 实证 · 新增键不影响 show 输出）· --json 为 additive（契约只增先例）· **F4 trigger 嵌套对象（{command, expect}）属 additive 可选项非既有键语义变更，不擦「格式变更」边**；升级条款触发条件客观可判（改既有键语义/删键/触 host-adapt schema → STOP → 评审文 → HG-SCHEMA-CHANGE 式人闸）· 与硬约束 3 顺序兼容 · **本审不判定须补闸行** |
| test_strategy 与硬约束 6（修严配负向 fixture） | ✅ 适配正确 | 修严面全配红测先行：G4 缺控制表 fixture（接线前 warn-only PASS 真红留证 → 接线后 BLOCKED 转绿）· N2-C lint-FAIL fixture 红转绿 · S2 拒写三域逐一点名 · F-W6-01 降级前后对照 · G2 为防回退锁形态（现态实证点名入自检结论 · 与修严红测语义区分正确——G2 闸已在，不存在「修复前红」面）——红绿纪律写进测试策略节与验收节双落 |
| 行为变更类「旧测 grep 影响面」提醒（K7） | ✅ 覆盖 | 验收 #12「既有面零意外改动」+ 预期登记面逐条列明（verify.ts 链插两步 · lint.ts G4 升级面 · gates.ts cmdAudit · task-cmd.ts · hookguard.ts · cli-lifecycle.ts · usage.ts · yaml · .gitignore）+ 测试策略 ③ 既有面回归点名四测试文件（cli-task-close-guards / w2-shell-hook / cli-json-no-abs-path / cli-security-closure）——F-W2-13 同式纪律适配 ✓ |
| 硬约束 1/2/6/7/10/14/15 落位 | ✅ | #1：审计轨永不入 S2 三域（#10 机械断言 + F-W6-02 拒写复用 assertNotS2Abs 单一真值源）；#2：不设 opt-out + --allow-lint-fail 为 DEF-011 已登记旗标的真接线（非新开绕过面）；#6：修严面红测先行双落；#7：done 面 warn 降级三面（G2 既有 :347-364 / G4 / N2-C）+ legacy-gate-exempt.yaml 既有通道（本审实证四字段格式头注在案）；#10：F-W6-05 unreachable 分档不误报；#14：前后数字/现态实证输出入自检结论文本（非仓外文件）；#15：双闸落表 blocks_hats 含 20,30 / 30 且机检咬住（上行实测） |
| 基线节数字独立复跑 | ✅ 全中（N2-C 前基线一项口径差 → A1） | 本审复跑（HEAD `b461b34` ✓ · 工作区 untracked = 本 task 1 件 ✓ 与声称一致 · tag `v2.4.2` 在 ✓）：`npm test` **810 tests / 154 suites / 809 pass / 0 fail / 1 skip**（duration 98.3s · 基线 ≈96s 机差量级）· `npm run typecheck` **0 错** · `node bin/specgate.js pins check` **17/17 PASS** · dependencies = 仅 `js-yaml` ✓ · `docs/harness/audit/` 不存在（glob/ls 实证 ✓）· 与 W5 锁终态逐字一致 ✓ |
| N2-C 前基线独立复测（lintTaskFile 全语料 · 与 task 同方法） | ⚠️ FAIL 数全中 · 总分母/率/规则分布差 ±1（→ A1） | 本审 node --experimental-strip-types 直调 lintTaskFile 扫 `docs/tasks/{done,active}/*.md` 排除 README：**81 件 · FAIL 27（33.3%）**（task 声称 80 件 · 27（33.8%））· 规则分布本审 E3×21/E5×16/E4×9/E2×2/E6×1（task 声称各 +1）· warn 本审 W4×33/W5×14/W6×1/W3×1（task 声称 W4×34/W5×14/W6×1 · 无 W3）——**FAIL 27 件逐文件清单本审枚举全中**（done 目录 27 件 · active 0 件）· 分母差 = active 现 2 件（w1_ci_hotfix 09-16 已入档 + 本 task）均 PASS · 差异属测量时点/口径小疵 · **lint 逃逸率 100% 实质成立**（verify --task 链 :303-410 无 lint 步本审实证 ✓ · 27/27 全逃逸）· task 开工基线节自带 F-W0-05 式「复跑不符则重建基线并登记」通道 ✓ |
| G2 已接线独立实证（重点 1 前提） | ✅ 起草发现属实 | verify --task 存在级 `src/cli/verify.ts:323-328`（缺 → `VERIFY: BLOCKED · missing R<n> review` exit 2 · :326-327 逐字）+ `--allow-no-review` 真豁免留痕 :329-335 + 结论级 :338-371（active failClosed :365-368 · done warn 降级/豁免 :347-364）+ close `evalCloseReview` `src/checks/close-guards.ts:95-111`（存在+结论双判 · CLOSE_GUARD_ORDER 第 6 位 `usage.ts:8-22` ✓）+ **既有回归测试已钉死**（`test/cli-verify-review.test.ts:90-97` 红→绿钉死注释逐字 + :111 双路径 + :142/:153 json 面 + `cli-verify-observability.test.ts:130` + `w2-shell-hook.test.ts:201` hook 阻断面）· yaml gaps G2 closed 2.3.0 ✓ · 真残留 not_wired = statements C1/C2（:206-221 · note「本包未接线（findReview 仅 status 使用）」已被 verify.ts:323 消费证伪 = 过期属实 ✓）· D3 not_wired（:254-261）✓ |
| G4/N2-C/G7 现值实证 | ✅ 全中 | G4 warn-only `src/checks/lint.ts:102-132`（W5/W6/W7 全 warnings 不挡 · D-23-W4-G4-EXIT 注释 :109-110 逐字在案 ✓）· N2-C：cmdVerify --task 链 formatGateCheck :303 → runTestCheck :316 → 审查文闸 :323/:338 → pre-30 invoke hats :374 → 可选 wiki-lint :390 —— **无 lint 步** ✓ · `--allow-lint-fail` 旗标名在 DEF-011 注释 :248 逐字 ✓ · G7：hookguard runGateCommand :53-64 实跑 + 阻断 exit 2 :126-131 ✓ · 执行结果不落任何证据轨（grep 无落盘面 ✓）· yaml gaps G4 closed 2.3.0（warn-only 态即 closed · 重点 2 不对称先例在案）· G6/G7/N2-C deferred ✓ · A5 mechanical gap:G7 / B2 prompt-only gap:G7 ✓ |
| F4 现值实证 | ✅ | statements 字段集 = id/source/summary/status/mechanism/gap/notes/mechanism_quality（A1/B2 条目逐键实证 · **无 trigger 字段** ✓）· source_audit 自述 2026-08-24 人工重盘 ✓ · loadDiscipline 校验仅查三键（:87-89 ✓） |
| cmdAudit 无落盘实锤 | ✅ | `src/cli/gates.ts:172-205`：gate-check + runTestCheck → 打印 `audit: PASS/FAIL`（:200）→ `fail('ICVO audit 未通过', 2)`（:204）· **无任何结构化落盘** ✓ |
| 现码行号抽核（25+ 处 · 2026-09-17 现值 HEAD b461b34） | ✅ 全中（1 处小疵 → A2） | verify.ts（:248 DEF-011 注释 ✓ · :303/:316/:323-328/:329-335/:338-371/:347-364/:374/:390 · 链止 :410 ✓）· gates.ts cmdAudit :172-205 ✓ · task-cmd.ts verdict 三态 :116-168 ✓（BLOCKED :116-124 · READY :126-137 · PASS :144-168）· lint.ts lintTaskFile :21 ✓ · G4 :102-132 ✓ · close-guards.ts evalCloseReview :95-111 ✓ · review-gates.ts findLatestReview :92-114 ✓ · evalReviewConclusion :164-205 ✓ · cli-shared.ts S2_TRUTH_PREFIXES :90-98 ✓ · assertNotS2Abs :123-131 ✓ · cli-lifecycle.ts loadDiscipline :79-91 ✓ · formatDisciplineShow :114-152 ✓ · hookguard.ts :53-64/:126-131 ✓ · usage.ts CLOSE_GUARD_ORDER :8-22 ✓ · VERIFY_BLOCKED_EXIT_CODE :28 ✓ · cli-skills.ts 拒写文案 :367-369 ✓ · invoke-hats.ts PRE30_HATS {10,20,00} :8-9 ✓ · checkPre30InvokeHats :89-100 ✓ |
| W0–W5 前置兑现 | ✅ | W5 done（锁终态 810/154/809/0/1 与本审复跑逐字一致 · HEAD b461b34 = W5 close 归档 commit ✓）· SPEC signed（HG-SPEC-SIGNOFF approved 2026-09-16 ✓）· W2 hooks 执行面已交付（hookguard.ts 实跑面实证 ✓） |

**常规核对结论：无 blocking。** 唯一实测偏差 = N2-C 前基线口径差 ±1（A1），task 开工基线节自带重建通道（「复跑结果与本表不符 → 以复跑实测重建基线并登记」），不阻塞签闸。

---

## 三、五条重点逐条结论（10-task 留下 · 含本审独立复核证据）

### 重点 1 · G2 对账口径（现码已接线 · W6 = 回归锁+实证+回写）——✅ 裁定：**对账口径接受**

- **G2 已接线独立实证**（grep + 逐行实读 · 详见常规核对「G2 已接线独立实证」行）：verify.ts:323-328 存在级 BLOCKED exit 2 + :338-371 结论级 + close-guards.ts:95-111 evalCloseReview + CLOSE_GUARD_ORDER 第 6 位 + **既有测试已钉死**（cli-verify-review.test.ts:90 头注释「红→绿钉死」逐字 + :92-97 BLOCKED 点名用例）——yaml gaps G2 closed 2.3.0 ✓ · 真残留 not_wired = statements C1/C2（note 自述「本包未接线」与现码矛盾 = 过期属实）✓；
- **裁定理由**：① SPEC signed（HG-SPEC-SIGNOFF approved）· 前提偏差（SPEC ③ 按「未接线」起草）不可回改 SPEC · task 以「实证偏差登记 + 工作重定义（回归锁+负向 fixture 实证+C1/C2 回写）」处理 = 诚实且可机检 ✓；② SPEC 验收 2 前半（缺审查文 → BLOCKED 点名负向 fixture 真红）在新口径下**仍可完整兑现**（temp 仓 fixture 即实证闸咬合）· 验收意图零损失 ✓；③ 增益说明：回归锁并非从零——cli-verify-review 套件已覆盖 verify 面存在级/豁免/json · task #5 追加 temp 仓端到端 + close 面 = 加强非重复，登记口径准确 ✓；④ C1/C2 回写（not_wired → mechanical + 锚点刷新）恰是本波 coverage 回写的正当清偿面 ✓。

### 重点 2 · G7 诚实口径 vs SPEC ⑦ 字面（warn-only ⇒ partial · 不回写 closed）——✅ 裁定：**诚实口径优先可接受 · 不须打回 · 偏差登记留 00/维护者裁定**

- **冲突属实**：SPEC ⑦ 字面「对应项 not_wired/deferred → mechanical/closed」· G7 落地 warn-only → A5/B2 只升 partial · gaps G7 不回写 closed = 与字面冲突 · task 不虚标 closed · residual_risks ① 在案 ✓；
- **裁定理由**：① 方向保守（**少声称**非多声称）—— honest under-claim 不制造假合规面 · 与 kit 诚实纪律一致 ✓；② 先例支持 warn-only 落地合法性（D-23-W4-G4-EXIT：合规率未知不升 failClosed · G4 先例同式）✓；③ SPEC 已 signed · 字面修订须重走签署通道 · 偏差登记 + 00/维护者裁定是合规的偏差处置通道 ✓；
- **本审提示的不对称先例（登记级 · 不改裁定）**：yaml 实证 gaps **G4 在 warn-only 态即已 closed 2.3.0**（:39-43 · note「接线为 warn-only 结构断言 W5–W7…closed」）——「warn-only ⇒ 不回写 closed」并非既有先例强制的唯一口径；若 00/维护者认为 G7 应循 G4 先例（warn-only 接线即 closed + statements partial 注记），属 SPEC ⑦ 字面与先例的裁定面 · **本审裁定：task 保守口径可接受，是否回 SPEC 回注归 00 升级维护者裁定，不须 20 打回**；
- **机械化留痕已锁**：S6.6/S6.7 回写口径联动（failClosed→mechanical · warn-only→partial）+ 偏差登记入自检结论 + #9 验收「按落地档」—— 30 执行面无可漂移空间 ✓。

### 重点 3 · 闸行裁决（不设 HG-SCHEMA-CHANGE 三理由）——✅ 复核成立（含 F4 trigger 擦边复核）

- **理由①（coverage 回写 = 数据面）**：status/note/gap 字段按已批准 schema 写数据 · 键形态与字段集零变更 —— 与 W4 闸行裁决②/W5 闸行裁决① 同构 ✓；
- **理由②（C6 = 新增内部格式）**：docs/harness/audit/ 不存在（本审实证）· JSONL 无既有消费者契约可破 · 新文件新机制 ≠ 既有 schema 变更 ✓；
- **理由③（F4 trigger additive 扩键）—— 擦边复核结论：不擦边**：loadDiscipline 校验面仅查 version/as_of_package_version/statements 数组存在性（cli-lifecycle.ts:87-89 本审逐行实证）· additive 键运行时零拒收 ✓；消费面 formatDisciplineShow 只读 id/status/summary（:114-152 实证 · trigger 键不进 show 输出）· --json additive（契约只增先例）· trigger 嵌套 {command, expect} 是**新增可选项**（非既有键语义变更 · 非删键 · 非键改名）—— HG-SCHEMA-CHANGE 的规范对象是「既有 schema 的结构性/语义性变更」，additive 扩键有 W4 error_kind / W5 契约只增先例护航 ✓；
- **升级条款兜底**：执行期发现须改既有键语义/删键/触 host-adapt schema → STOP → 评审文 → 人闸（硬约束 3 顺序兼容 · 触发条件客观可判）✓。**本审不判定须补闸行**。

### 重点 4 · 两个草案裁决——✅ 双双成立（① 附 A3 登记）

- **① audit/*.jsonl 入 .gitignore（观测面 vs 证据面分工）—— 成立**：硬约束 14 规约对象是「被本档/约束条/任务文**引为证据**的材料须入库」· 审计运行流 = 观测面（每跑门禁追加一行 · 非证据本体）· 证据面 = 被引用事件的**摘录入 invoke/自检结论文本**（tracked · W5「证据面 = 自检结论文本」先例一致 · S6.1 + F-W6-10 双落在案）—— 分工边界成立 ✓ · 防每次跑门禁脏工作区的动机正当 ✓ · **附带 advisory A3**：本仓 .gitignore（现值 5 行 · 无 audit 行 · 本审实证）加一行只覆盖**本仓**；消费仓 `docs/harness/audit/` 落盘的脏工作区面未被本裁决覆盖（residual_risks ⑤ 已登记缓解）—— 建议 30 自检结论登记消费仓口径（或归后续 host 物化波次 · 非本波范围）；
- **② 审计默认开落盘且不设 opt-out 旗标 —— 得当**：C6 目标即「不落痕 → 落痕默认开」· 不设 `--no-audit` 类绕过旗标符合硬约束 2 精神（不开新绕过面）✓；不阻断性由 F-W6-01 降级保障（落盘失败 verdict/exit code 零变更 · fixture 断言）· `--audit-file` 仅改落点非绕过（且必经 assertNotS2Abs S2 拒写 + F-W6-07 仓外拒绝双兜底）—— 观测面「默认开 + 不可关 + 不阻断」三角自洽 ✓。

### 重点 5 · G4 升级依据（SPEC 07 ④ signed 即 D-23-W4-G4-EXIT「后续 SPEC 明文裁决」）——✅ 认定成立

- **升级通道原文双实证**：lint.ts:109-110 注释「D-23-W4-G4-EXIT：升 failClosed 唯一路径=后续 SPEC 明文裁决」逐字在案 + yaml G4 gap note :43 同文登记 ✓；
- **SPEC 07 ④ 构成明文裁决**：范围④「G4 · 思考轮控制表闸接线：思考轮控制表存在/完备性**入判定** · 判据接线 + 负向 fixture」+ **SPEC 验收 2 明文「缺思考轮控制表 → BLOCKED 点名」** —— BLOCKED = failClosed 的 SPEC 层明文授权（非 task 自创升级）✓ · signed 状态（HG-SPEC-SIGNOFF approved 2026-09-16）满足「SPEC 明文裁决」形式要件 ✓；
- **不追溯存量面合规**：done 面 warn 降级 + 波及入 legacy-gate-exempt.yaml 既有通道（D-23-W4-TRANSITION 同式 · 硬约束 7 · 豁免清单四字段格式本审实证在案）✓ · 无思考轮节维持豁免（SPEC 承载/bugfix 轨 · W4 语义不动）✓。

### 附 · 闸行裁决复核（task :43 留 20 · 不设 HG-SCHEMA-CHANGE）

三理由成立（详见重点 3 与常规核对表「闸行裁决」行）：① coverage 回写 = 数据面 ✓ · ② C6 = 新增内部格式 ✓ · ③ F4 trigger additive 扩键被 loadDiscipline :87-89 容忍实证 · 不擦「格式变更」边 ✓；升级条款触发条件客观可判 · 通道明确（STOP → 评审文 → 人闸）· 与硬约束 3 顺序兼容。**本审不判定须补闸行**。

---

## 四、发现清单

### Blocking（0 条）

无。

### Advisory（4 条 · 均不阻塞签闸 · 30 执行时落实或自检登记 · 无需改 task）

| # | 级别 | 内容 | 建议落点 |
|---|------|------|----------|
| A1 | 登记级 | **N2-C 前基线复测口径差 ±1**：本审 lintTaskFile 全语料复测 = **81 件 · FAIL 27（33.3%）** · 规则分布 E3×21/E5×16/E4×9/E2×2/E6×1 · warn W4×33（task 基线节 :77 声称 80 件 · 27（33.8%）· 规则各 +1 · W4×34）。**FAIL 27 件逐文件清单本审枚举全中**（done 27 件 · active 0 件）· 分母差 = active 现 2 件均 PASS（w1_ci_hotfix 09-16 已入档 + 本 task · 测量时点/口径差）· **逃逸率 100% 实质结论不受影响**（lint 不在 verify 链实证 ✓ · 27/27 全逃逸 ✓）· 后测硬判据结构（active 面 0%）不受分母 ±1 影响 | 30 执行期：按 task 开工基线节自带纪律（F-W0-05 同式 · 「复跑结果与本表不符 → 以复跑实测重建基线并登记」）以**同脚本同语料**复跑值重建前基线并入自检结论登记（验收 #7 通道已容 · 无需改 task） |
| A2 | 标注级 | **一处行号快照小疵**：必读列表 :208 引 `cli-lifecycle.ts` discipline 子命令分发 `:478-495` · 实测 cmdDiscipline 函数体起 :474（:478 为用法串文本行 · 分发逻辑 :474-495）——锚点语义全中 · 区间头偏 4 行 | 无需改 task（行号口径已声明「实读现值 · 改前复读」）；30 改前复读时以实读为准 |
| A3 | 登记级 | **草案① .gitignore 只覆盖本仓**：F-W6-10/S6.1 裁决 `docs/harness/audit/*.jsonl` 入 .gitignore —— 本仓 .gitignore 现值 5 行无 audit 行（本审实证）· 加一行解决本仓脏面；但审计落盘在 **消费仓** `<target>/docs/harness/audit/` · 消费仓的脏工作区面未被本裁决覆盖（residual_risks ⑤ 已登记缓解 · 未登记消费仓处置口径） | 30 执行期：自检结论登记消费仓口径（如「消费仓需自行 gitignore · 或归后续 host 物化波次统一处理」· 明示非本波范围）· 不改 task 结构 |
| A4 | 登记级 | **W6 invoke 目录现为空（10 invoke 未见落盘）**：`docs/harness/invokes/by-task/3-0-w6-observability-audit/` 不存在（本审实证）· required_invoke_hats=10,20,30,40,00 · pre-30 闸 = required ∩ {10,20,00}（invoke-hats.ts:8-9/:96 实证）—— 30 开工 verify --task 时须 10/20/00 三件齐 · 本审落盘 20 invoke 后仍缺 10/00 | 00 代签 HG-AUDIT-R1 前后：确认 10-task 棒补落 10 invoke + 00 自身代签 invoke 落盘（fail-safe：缺则 verify BLOCKED 点名 · 不会静默穿透 · 无需改 task） |

---

## 五、总结论

**PASS-with-issues**（blocking 0 · advisory 4）—— task 内容与 SPEC/PLAN/硬约束逐项一致，五条重点全部成立（**重点 1**：G2 对账口径接受 · 现码已接线本审独立实证（verify.ts:323-328 +:338-371 + close-guards.ts:95-111 + 既有测试钉死 + yaml G2 closed 2.3.0 + C1/C2 notes 过期属实）· 回归锁+实证+回写口径诚实可机检；**重点 2**：G7 诚实口径优先可接受 · warn-only → partial 不虚标 closed · 偏差登记留 00/维护者 · G4 warn-only 态即 closed 的不对称先例登记在案 · 不须打回；**重点 3**：闸行裁决三理由成立 · F4 trigger additive 扩键经 loadDiscipline :87-89 容忍实证不擦「格式变更」边 · 升级条款兜底在案；**重点 4**：① 观测面/证据面分工成立（运行流非证据面 · 摘录入 invoke = 证据面 · W5 先例一致）· 附消费仓口径登记 A3 · ② 默认开+无 opt-out 得当（硬约束 2 精神 · F-W6-01 保不阻断 · --audit-file 非绕过双兜底）；**重点 5**：G4 升级认定成立 · D-23-W4-G4-EXIT 双实证（lint.ts:109 + yaml :43）· SPEC ⑦ 验收 2 明文「缺控制表 → BLOCKED」= failClosed 明文授权 · done 降级+豁免通道合规），闸行裁决（不设 HG-SCHEMA-CHANGE）复核成立，关键数字（810/154/809/0/1 · 98.3s · typecheck 0 · pins 17/17 · HEAD b461b34 · deps 仅 js-yaml · audit 目录不存在）与 25+ 处行号快照经本审**独立复跑 / lintTaskFile 全语料复测 / grep 实证 / 逐处抽核**（含 G2 已接线全链路实证 · cmdAudit 无落盘实锤 · G4 warn-only 逐字注释 · N2-C FAIL 27 件逐文件枚举全中）。**思考轮审查通过，充分性裁定：充分。**

本审**不代签** HG-AUDIT-R1；签署归 00（维护者 2026-09-16 授权模式）。**因 HG-AUDIT-R1 仍为 pending，按纪律不附 30 Prompt**，仅出维护者签闸清单：

## 维护者签闸（20 后 · 30 前）

- [ ] 已读 R1 审查结论（本文 · 含 advisory A1–A4）
- [ ] 在 task 人工闸表将 HG-AUDIT-R1 改为 approved（00 代签 · 维护者 2026-09-16 授权 · 日期）
- [ ] commit task 文档或确认已签（连同本棒交付：本审查文 + `docs/harness/invokes/by-task/3-0-w6-observability-audit/invoke_20260917_20_3-0-w6-observability-audit.md` · 逐文件显式 add · 禁 `git add -A`）
- [ ] 确认 10 invoke 与 00 代签 invoke 落盘（A4 · pre-30 闸 required ∩ {10,20,00} 须齐 · 缺则 verify --task BLOCKED 点名 · fail-safe）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | R1 · 20-task-audit：常规核对 16 项全过（含基线全量独立复跑逐字一致 + N2-C 前基线 lintTaskFile 全语料复测 + G2 已接线全链路 grep/行号实证 + cmdAudit 无落盘实锤 + G4 warn-only/D-23-W4-G4-EXIT 逐字实证 + F4 无 trigger 字段/loadDiscipline 容忍实证）；五条重点逐条独立复核裁定（G2 对账口径接受 · G7 诚实口径可接受不虚标 closed · 闸行裁决三理由+F4 擦边复核成立 · 两草案双双成立附消费仓登记 · G4 升级认定成立）；独立复跑 npm test 810/154/809/0/1（98.3s）+ typecheck 0 + pins 17/17 + deps 仅 js-yaml + HEAD b461b34 + audit 目录不存在全中；N2-C 复测 81/27/33.3%（FAIL 27 逐文件全中 · 口径差 ±1 → A1）；25+ 处行号抽核全中（1 处小疵 → A2）；gate-check/verify 双机检咬住 HG-AUDIT-R1 pending（双 exit 2）· task lint PASS；总结论 PASS-with-issues（blocking 0 · advisory 4：A1 N2-C 前基线口径差 · A2 行号小疵 · A3 gitignore 消费仓口径 · A4 10/00 invoke 待补）；不代签 HG-AUDIT-R1 |
