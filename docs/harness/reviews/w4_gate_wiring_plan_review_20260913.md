# W4 · A5+A6 闸语义接线方案评审文（D-23-W4-REVIEW-FIRST · 第一交付物）

> **日期**：2026-09-13 · **类型**：接线方案评审（门禁语义变更先行评审 · 非 task 审查文 · 非 SPEC 审查文）  
> **蓝本**：[`docs/spec/2_3-wiring-completion/04_w4_gate_wiring_v1.md`](../spec/2_3-wiring-completion/04_w4_gate_wiring_v1.md)（signed · **修订重签 #2 · commit fa24638** · HG-SPEC-SIGNOFF approved 00 代签）  
> **授权**：2026-09-12 维护者会话授权 00 代签过程文档 · W4 实现棒起草  
> **关联 task**：`docs/tasks/active/task_2_3_wiring_w4_gate_wiring.md`（slug `2-3-wiring-w4-gate-wiring`）  
> **结论**：**评审通过（方案定稿）**——五问逐项有答案 · 存量摸底数据齐 · 「新 task」判定口径定稿 · 豁免格式钉死 · G4 退出条件写死 · 事实卡 §11 处置明确。30 改码另须 HG-AUDIT-R1=approved（task 表为真值）。

---

## 0. 前提复核结论（证伪留痕 · 00 裁决 A 已落地）

W4 棒 R0 证据级复核（HEAD=661f6e2）证伪 SPEC 04 初版 §1 表两项：

| 闸 | 初版声称 | 实测现状（证据） |
|----|----------|------------------|
| G2 | 「verify/close 无 reviews 闸」 | **不成立**：verify --task 已有 R<n> 存在性硬闸（`src/cli.ts:827-833` · b7c15ae DEF-003 T4）；close 已有 close_review 存在性闸（`cli.ts:46` CLOSE_GUARD_ORDER → `evalCloseReview` `cli-checks.ts:184-192` · 5eac847 T6）。真缺口 = **结论级 R1 通过判定**（全 src 无审查文结论解析） |
| INVOKE-HATS | 「close 无 invoke 集合闸」 | **不成立**：close_invoke 帽集合闸已接线（`evalCloseInvokeHats` `cli-checks.ts:170-182` · 同 T6）。真缺口 = **task lint-done 帽级**（`cli-task-extra.ts:323-344` lintDoneInvokes 仅 slug 级存在性） |

根因（机制债）：`discipline-coverage.yaml`（as_of 2.2.1）note 停在 2026-08-24 T4/T5/T6 接线之前未回写，SPEC 初版转录过期 note。00 裁决 A（循 W2 先例）：SPEC 04 修订重签（fa24638），范围②⑤改为「存在级→结论级 / 帽级升级」，范围⑦含 note 回写。本评审文以修订后 SPEC 为准。

## 1. 存量摸底数据（熔断器 F-W4-01 判读）

**SPEC §5.4 已入档**（59 done task · 复用 cli-checks 单一实现源实测）：G2 reviews 存在率 54/59=**91.5%** · INVOKE-HATS 帽集合 43/59=**72.9%** · G4 思考轮节 26/59=**44%**（完整 R0–R5 仅 12/26）。

**本评审新增实测（结论级口径必需）**：存量最高 R 轮审查文 54 份的「结论可机读通过率」。口径演进留痕（负向先行 · 三版修正）：

| 候选口径 | 可解析 | 失败分析 |
|----------|--------|----------|
| v0 行级（结论语境行 + 通过词） | 47/54 | 误伤：节标题与正文分行（`## 结论` + 下行 ACCEPT）；「无需退回/不退回」被否定词误命中 |
| v1 节级抽取 + 否定守卫 | 29/54 | NEG 正则 `内容阻塞(?!.*零)` 方向错误，「零内容阻塞」全灭 |
| v1.1 NEG 修正（`(?<!零)内容阻塞`） | 48/54 | 误伤：`## 非阻塞观察（不影响签收…）` 节标题括号内含「签收」被抽取，节内引用规则文「退回 10-task」误命中 |
| **v2 节标题起首口径（定稿）** | **49/54（90.7%）** | 余 5 份 = 1x 波（2026-09-09/10）结论节为纯表格、无通过词文本（「R1 通过」仅在修订表）——真实不可机读，归豁免 |

**F-W4-01 判读**：若追溯存量，INVOKE-HATS（72.9%）与 G4（44%）必然触发大面积红 → 支持 §5.4 定案（不追溯）；reviews 结论级追溯面 = 5 无审查文 + 5 不可解析 = 10 项 → 数据清单豁免消解（§4）。**不触发熔断，不 STOP**。

## 2. 五问逐项定稿（SPEC §5.1）

### 2.1 G2 · reviews 留档闸（存在级 → 结论级 R1 通过判定）

1. **触发点**：`task close`（close_review 守卫升级）+ `verify --task`（T4 判定升级）。单一实现源：cli-checks 新增 `findLatestReview`（最高 R 轮审查文路径 · 与 findReview 同双路径同命名口径）+ `evalReviewConclusion`（结论解析）；findReview 保留（存在性消费者 status/dry-run 不变）。
2. **失败档**：failClosed exit 2（close → BLOCKED；verify → BLOCKED）。豁免沿用既有 `--allow-no-review`（同豁存在性与结论级 · 留痕文案不变 · **无新旗标**）。
3. **存量误伤面**：见 §1——结论可机读率 49/54；close 面天然零追溯（只闸新关账）；verify 面追溯保护见 §3 目录分档。
4. **过渡机制**：目录分档（§3）+ 存量 10 项入豁免数据（§4 · 裸 verify 面消费）。
5. **事实卡联动**：见 §6——**禁称维持**。

**结论解析机读约定（定稿 v2）**：
- 抽取：节标题正则 `/^#{2,3}\s*(?:[一二三四五六七八九十]+[、.]\s*)?(结论|签收)/` 起首的节（多节合并；全文无匹配节 → 回退全文扫描，宁可误红）。
- 通过词：`\bPASS\b` / `ACCEPT` / `签收` / `通过` / `零内容阻塞` / `零阻塞`（大小写不敏感）。
- 否定守卫：`(?<!无需)(?<!不)(?<!未)退回` / `未通过` / `不通过` / `(?<!零)内容阻塞` —— 命中即判不通过。
- 判定：**通过词命中且无否定命中 → pass**；否则 fail（failClosed：不可解析 = 不通过，不误绿）。
- 多轮：仅判**最高 R 轮**文件（终轮结论为真值；R2 通过覆盖 R1 退回）。

### 2.2 G4 · 思考轮结构（warn-only 过渡 · 定案）

1. **触发点**：`task lint`（lintTaskFile · cli-checks 既有 W4 处延伸）。
2. **失败档**：**warn-only（SPEC §5.4 定案 · 不升 failClosed）**——新增三条 warn 级规则（编号续既有 W1–W4，不占用旧包 E8–E10 语义）：
   - **W5**：存在思考轮节（`### R0` 或 思考轮标题）但 R0–R5 槽位不全；
   - **W6**：存在思考轮节但缺思考轮控制表（`| 轮 | 结论 | early_stop |` 表头口径）；
   - **W7**：控制表存在 early_stop=yes 但缺 `reason` 回填行。
   exit 码不变（warn 不挡 LINT: PASS）。
3. **存量误伤面**：有节 26 项中完整 R0–R5 仅 12/26（46%）——若 failClosed 则 14 项历史 task 红 → warn-only 正确性实证。
4. **过渡机制**：warn-only + 退出条件写死（§5）。**TASK_TEMPLATE 本波不改**（控制范围；2.2/2.3 波实践已预置 R0–R5 槽，无须模板强制）。
5. **事实卡联动**：无（G4 不涉对外能力宣称）。

### 2.3 FULL-reviews · 裸 verify 全量 reviews + 双路径

1. **触发点**：`verify`（**无 --task/--spec**）新增仓级 reviews 扫描模式（现行为用法错 exit 1 · `cli.ts:775`）。
2. **失败档**：分面定档——
   - **done/ 面 failClosed exit 2**：每个 done task 须 R<n> 审查文存在（双路径 docs/harness/reviews + reviews/）**且**最高 R 轮结论可机读通过（与 G2 同一实现源 · 同 v2 约定）；缺口逐条列出后 `VERIFY: BLOCKED` exit 2。
   - **active/ 面仅信息报告**：计数 + 缺 reviews 列表以 warn 打印（draft 期无审查文合法 · 不 exit 2）。
3. **存量误伤面**：10 项（5 无审查文 + 5 结论不可机读）→ 全入豁免数据（§4 reviews 节）。
4. **过渡机制**：数据清单豁免（§4）；消费仓升级后首跑裸 verify 若红，输出含豁免格式指引（谁/何时/理由 · F-W4-04）。
5. **事实卡联动**：裸 verify 为新命令面 · README 用法区同步（pin-16 文档↔files 白名单核对）；无能力宣称变化。

**裸 verify 输出形态（定稿）**：人类面 = 扫描计数（active/done）+ 缺口列表 + `VERIFY: PASS|BLOCKED`；`--json` 复用既有信封形态（command/verdict/exitCode + gaps 列表 · 键集只增不改）。--task/--spec 互斥保持。

### 2.4 INVOKE-HATS · lint-done 帽级升级

1. **触发点**：`task lint-done`（lintDoneInvokes 升级 · cli-task-extra）。
2. **失败档**：failClosed exit 2——done task 按各自 Harness 元信息解析 required 帽集合（`resolveRequiredInvokeHats` 单一实现源 · 显式 required_invoke_hats 优先于 profile · 缺省 default=10,30,40），`missingInvokeHats` 判定缺帽 → `LINT-DONE: FAIL` 并列缺帽明细；既有 slug 级存在性闸保留。
3. **存量误伤面**：72.9%（16 项缺帽：rename/2.1.1/2.1.2 波缺 30/40 · w0 规划类缺 00 等）→ 全入豁免数据（§4 invoke_hats 节）。
4. **过渡机制**：数据清单豁免（§4 · 与裸 verify 同文件分节）。
5. **事实卡联动**：无。

### 2.5 A6 · reviews.CLOSE 语义补强（观测面）

1. **触发点**：`status` 输出面（`cli-status.ts:94-97` 代理口径注释处）。
2. **判定口径（定稿）**：`reviews.CLOSE` = 归档态（CLOSE_STATUSES 或 done/ 目录 · 既有）**且** 最高 R 轮审查文结论可机读通过（复用 G2 同一实现源）。JSON 键集只增不改：`reviews` 增 `close_evidence` 字符串（如 `R1 审查文结论通过 · task_..._audit_R1_...` / `已归档但审查结论不可机读` / `未归档`）；`cli-status.ts` 注释升级为强证据口径说明。
3. **存量误伤面**：存量 done 中结论不可机读 5 项 → 其 status `reviews.CLOSE` 变 false（**如实披露** · status 是观测面非闸门 · 不打红任何流程）。
4. **过渡机制**：无需（观测面如实化即正确终态）。
5. **事实卡联动**：见 §6——**禁称维持**。

## 3. 「新 task」判定口径（§5.4③ 定稿）

不引入时间戳/git 历史依赖（确定性 · 跨消费仓可移植）：

| 面 | 判定口径 | 正确性论证 |
|----|----------|-----------|
| close（G2 结论级） | **天然只闸新关账**（close 仅作用于 active→done 转移） | 存量 done 永不重走 close |
| verify --task（G2 结论级） | **目录分档**：task 位于 `*/active/` → failClosed；位于 `*/done/` → warn 降级（审计提示 · 不 exit 2） | 正常流程进 done 必经 close；2.3.0 起 close 含结论级 → 新 done 恒合规；存量 done 复验只提示 |
| lint-done（INVOKE-HATS 帽级） | **数据清单豁免**（默认 failClosed · 存量一次性入单） | lint-done 全量扫 done 无目录可分；数据清单是唯一定定性锚（§5.4③ 三候选之「数据清单」） |
| 裸 verify（FULL-reviews done 面） | **数据清单豁免**（同上 · 同文件 reviews 节） | 同上 |
| 裸 verify（FULL-reviews active 面） | 信息报告制（不闸） | draft 期无审查文合法 |

## 4. 豁免数据格式钉死（F-W4-04）

**落点**：`docs/harness/legacy-gate-exempt.yaml`（**非 S2**——S2 = docs/tasks · docs/harness/reviews · docs/harness/invokes/by-task；本文件为手写数据 · 非 host 物化 target · pins fix 不写）。

```yaml
version: "1"
note: 2.3-W4 过渡豁免 · 新增条目必须 slug/reason/date/authorized_by 四字段齐（谁/何时/理由）· 缺字段条目视为无效并 warn
reviews:        # FULL-reviews 裸 verify done 面 + verify --task done 复验
  - slug: 1x-closeout-w1-ci-dogfood
    reason: 2.3.0 前历史关账 · 结论节为表格无可机读通过词（接线前合法）
    date: 2026-09-13
    authorized_by: 00（2026-09-12 维护者会话授权）
invoke_hats:    # task lint-done 帽级
  - slug: rename-specgate-w1-package-identity
    reason: 2.3.0 前历史关账 · 该波由 00 直执无 30/40 invoke（接线前合法）
    date: 2026-09-13
    authorized_by: 00（2026-09-12 维护者会话授权）
```

本波一次性入单：**reviews 10 项**（5 无审查文 w0 类 + 5 结论不可机读 1x 波）· **invoke_hats 16 项**（§1 摸底明细）。滥用防线：四字段强制 + 缺口输出永远打印豁免命中留痕（谁/何时/理由随 BLOCKED/豁免提示回显）。

## 5. G4 warn-only 退出条件（写死 · 防「永久 warn」）

1. W5–W7 告警**持续输出**（任何 PR 不得删除/静默）；
2. 每波 release 评审（2.3.0 起）须回看 `task lint` 对当期新 task 的 W5–W7 告警基线并入 release 评审记录；
3. **升级 failClosed 的唯一合法路径**：维护者/00 在后续 SPEC 明文裁决（须附告警基线数据）；未裁决前保持 warn-only，任何「顺手升 error」视为纪律违规（P0-GATE）。

## 6. 事实卡 §11 处置（F-W4-05）

本波落地后，「关账必经审查通过」在机制上成立（close_review 结论级 + 存在性 failClosed）。但事实卡 `.workbuddy/output/推广事实卡-2.2.0.md` §11 行（L234「reviews.CLOSE 是代理指标」表述纪律）的正式更新属**维护者口径**——本波评审结论：**禁称维持**，对外文案一字不改；留待维护者在 2.3.0 发版评审时明文解禁。SPEC 验收 ④「禁称处置结论落评审文」= 本条。

## 7. discipline-coverage 回写方案（范围⑦）

- gaps `G2` / `G4` / `FULL-reviews` / `INVOKE-HATS`：status `not_wired` → `closed` · `closed_in: "2.3.0"` · note 含接线证据（src 实际行号 · 实现后回填实测值）。
- statements `A6`（invoke 快照落盘）：status `partial` → `mechanical` · mechanism 更新为「task lint-done 帽集合校验（src/cli-task-extra.ts）+ close_invoke 帽集合闸（src/cli-checks.ts evalCloseInvokeHats）」；notes 保留旧包史实行（②b 测试约束：`evaluateInvokeHatsRetention` 仅许出现在含「旧包史实」的行）。
- statements `A7` notes 补「status reviews.CLOSE 已升结论级口径（src/cli-status.ts · 2.3-W4）」一句（discipline show 输出同步 · SPEC ⑥）。
- `as_of_package_version` **保持 "2.2.1"**（pin-04 强制 = package.json version · 版本 bump 属 release 波非本波）。
- F-W4-06 联防：四条 note 均含 `src/` 引用（测试断言候选）。

## 8. 旧测 grep 影响面（行为变更类 task 必备项）

| 既有断言 | 位置 | 影响与处置 |
|----------|------|-----------|
| 裸 verify 用法错 `须指定 --task FILE 或 --spec FILE` | `test/cli-verify-spec.test.ts:220` · `test/lib-smoke/cli-lib-smoke.test.ts:63,72` | **语义变更**：裸 verify 变真实模式 → 三处联改为新行为断言（靶场缺口 BLOCKED / 全绿 PASS） |
| close_review 存在性即 pass | `test/cli-task-close-guards.test.ts` | 增补结论级用例（无通过词 → BLOCKED · 有通过词 → 维持 pass）· 既有存在性用例 fixture 审查文须含通过词（联改） |
| verify --task R<n> 存在性 | `test/cli-verify-review.test.ts` | 同上：fixture 审查文补通过词 · 新增结论级负向 + done 目录 warn 降级用例 |
| lint-done slug 级 | `test/cli-g1g7.test.ts:448-460` · `test/cli-p0.test.ts:157` | 既有用例 fixture 补帽集合或入豁免 · 新增帽级 FAIL/豁免两档 |
| status reviews.CLOSE 代理口径 | `test/cli-status-obs.test.ts` | reviews.CLOSE 期望值联改 + close_evidence 新键断言（只增不改） |
| task lint W1–W4 | 无 W5–W7 既有断言（grep 实证） | 纯新增 W5/W6/W7 三组 warn 用例 · 无联改 |
| NOT_WIRED_MECHANISMS 台账 | `test/cli-discipline-coverage.test.ts:21-27` | 不动（G4 新规则用 W5–W7 编号 · 不占 E8–E10；四闸接线面不涉及台账名单机制名） |
| bin 面（W3 教训） | `test/lib-smoke/cli-lib-smoke.test.ts` | 裸 verify 三档经 bin 真实命令验收（src 套件绿 ≠ bin 面正确） |

## 9. 负向靶场设计（验收 ② 映射）

| 闸 | 靶场 | 期望 |
|----|------|------|
| G2 close | /tmp fixture：active task + 审查文无通过词 | `task close` → BLOCKED exit 2；补通过词 → READY |
| G2 verify | 同 fixture active | `verify --task` → BLOCKED exit 2；done 目录同 fixture → PASS + warn 行 |
| G4 | fixture task 有思考轮节缺 R2–R5 / 缺控制表 / early_stop=yes 无 reason | `task lint` → PASS（exit 0）+ W5/W6/W7 warn 各行 |
| FULL-reviews | /tmp 靶场 done task 无审查文 | 裸 `verify` → BLOCKED exit 2 列缺口；入豁免 → PASS |
| INVOKE-HATS | /tmp 靶场 done task invoke 目录缺 30/40 | `task lint-done` → FAIL exit 2 列缺帽；入豁免 → PASS |
| A6 | status --json 对结论不可机读 done task | `reviews.CLOSE=false` + `close_evidence` 如实说明；补通过词 → true |

## 10. 结论

**评审通过（方案定稿 · 零遗留开放问题）**。五问逐项有答案（§2）· 存量摸底数据齐（§1 · 含 F-W4-01 判读：不触发熔断）· 「新 task」判定口径定稿（§3）· 豁免格式钉死（§4）· G4 退出条件写死（§5）· 事实卡 §11 维持禁称（§6）· 覆盖表回写方案（§7）· 旧测影响面完备（§8）。failClosed 语义全程不稀释：所有新闸默认红，过渡只走「目录分档 + 数据留痕豁免」两条显式路径。

**下一步**：20-task-audit R1 书面审（审本文 + task 草稿）→ HG-AUDIT-R1 签闸（00 代签）→ 30+40。

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-13 | 初版 · W4 实现棒（10-task 帽）· 前提证伪留痕（00 裁决 A · SPEC 04 修订重签#2 后）· 五问定稿 + 摸底数据 + 豁免格式 + G4 退出条件 |
| 2026-09-13 | 30 实现期发现并补记：本仓 lint-done **slug 级存在性在基线（HEAD=661f6e2）即为红**（2 项 w0 规划 task 无 invoke 目录：2_1-skills-orch-w0-planning · 2x-host-adapt-w0-signoff · 预存机制债非本波引入）。处置：slug 级缺口与帽级同属「接线前合法」存量类，**同一豁免清单 invoke_hats 节消费**（failClosed 默认不变：未入单 slug 级缺失仍 FAIL）；两项已在单内（缺 00/00,10 理由覆盖）· 本增补不改变既有闸对未豁免对象的语义 |
