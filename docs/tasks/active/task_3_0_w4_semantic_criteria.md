# Task：3.0 W4 · 防伪判据语义化（结论闸档 M + R-5 跨行封堵 + 词表广义化 + pin-17/pin-08 语义绑定 + exempt 真实性/U1 口径统一）

> **状态**：`active`（2026-09-17 10-task 起草 · HG-TASK-DRAFT / HG-AUDIT-R1 双 approved（00 代签 · 授权真值：维护者本窗「授权00代签」· R1 审查文 PASS-with-issues blocking 0 · advisory A1–A4 带入 30 执行要求）· 30 可开工）
> **SPEC 真值**：[`docs/spec/3_0-architecture-leap/05_w4_semantic_criteria_v1.md`](../../spec/3_0-architecture-leap/05_w4_semantic_criteria_v1.md)（signed · HG-SPEC-SIGNOFF=approved 2026-09-16 · 范围 ①–⑧ · 验收 1–6 · F-W4-01–05）
> **设计真值（评审先行 · 硬前置已兑现）**：[`docs/harness/reviews/w4_semantic_criteria_review_20260917.md`](../../harness/reviews/w4_semantic_criteria_review_20260917.md)（217 行 · 六判据形态定稿 + 存量全量实测 + 判据两分边界声明 · OQ-1 档 M / OQ-2 A1 强制+A2 可选 / OQ-3 字段命名对齐 / OQ-4 NG 观察名单 荐案全采纳 · 残余 R-①②③ 登记）
> **上游 PLAN**：[`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W4 节（:259-272）+ 硬约束 **6**（修严配负向 fixture）/ **7**（不追溯存量）/ **11**（判据两分）· 配套 **14**（证据入库）/ **15**（闸不落表即虚设）
> **前置已兑现**：W0–W3 全 done（W3 锁终态 773/145/772 pass/0 fail/1 skip · [`task_3_0_w3_ontology_graph.md`](../done/task_3_0_w3_ontology_graph.md)）· 评审文落盘（D-24-W2-REVIEW-FIRST 循例兑现 · SPEC 范围⑧已销）· 2.4.2 对账在案（R-2/R-3/R-4 已交付 · 本波只做真残余 R-5）
> **基线（2026-09-17 本棒复跑实测 · 详见「开工基线」节）**：HEAD `9c895db` · npm test **773 tests / 145 suites / 772 pass / 0 fail / 1 skip** · typecheck 0 错 · pins **17/17**
> **行号口径**：本 task 全部行号为 2026-09-17 本棒实读现值（HEAD `9c895db` · 与评审文行号基准逐条复核一致 · SPEC 头部 ⚠️ 快照条款已按 SPEC 自身要求回源码复核）
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-w4-semantic-criteria` |
| **test_strategy** | `required` |
| **test_strategy_note** | 验收主体 = 机械锁全绿：每条修严配负向 fixture 修复前真红/修复后转绿（NEW-5 填充顶包三件套 · R-5 跨行形态 · NEW-11 五类词形 · NEW-4 伪表行两构造 · pin-08 裸版本串 · NEW-10 假授权）+ K 断言翻向配对锁（exit 0→2 + 跨段反向锁）+ 存量波及全量复跑登记（评审文数字为基线 · 30 复跑核对归因）+ 正例零回退五面（63 合规集 57 直接过+6 豁免 · 词表 0/63 · pin-17 26/26 · pin-08 15/15 · exempt 34/34）+ pins 17/17 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 改的是 checks/pins 判据面与 exempt loader + yaml 数据声明文案；图谱/本体/HGM 零触碰 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 无规范增量；NEW-11 残余形态登记入词表代码注释（注释面非规范面）· 晋升与否归 20/00 裁定 |
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
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗「授权00代签」· 依据审查文 docs/harness/reviews/task_3_0_w4_semantic_criteria_audit_R1_20260917.md（R1 · PASS-with-issues · blocking 0 · advisory A1–A4 全部带入 30 执行要求：A1 NEW-10 A1 将咬 4 处既有豁免 fixture 须同 commit 重锚+F-W2-13 登记 · A2 pins-consistency:1311 semantics 断言须同 commit 更新登记 · A3 复跑分母=88 基线集写明 · A4 标注小疵注记） |

> **闸行裁决（留 20-task-audit 复核）：W4 不设 HG-SCHEMA-CHANGE 行**。理由三条：① 硬约束 3 的闸对象 = schema（**结构格式**）变更 —— 本波对 `assets/release-pins.yaml` 的改动是在 pin-08/pin-17 既有 `semantics` 字段内更新**数据声明文案**（该字段自 2.3-W2 D-23-W2-CHECK-FORM 起即「语义/映射/豁免全入数据」的既定数据面 · 键形态与字段集零变更 · 类比 W3 闸行裁决②按已批准 schema 写数据非格式变更）；② `docs/harness/legacy-gate-exempt.yaml` 增 6 条 = 在既有 reviews 列表结构内增数据行（四字段格式不变 · 循 2.3.1 N11 同清单先例）；③ 判据语义变更的人闸通道是**评审先行 + HG-AUDIT-R1**（评审文已落盘 · 本 task 双闸在表）· 非 schema 闸。**升级条款（30 执行期 STOP 通道）**：若执行期发现须新增/改名/删除 yaml 键结构（如 exempt 条目增字段、release-pins 增 extract 子键、词表外置数据文件）→ **STOP**，先评审文 → 走 HG-SCHEMA-CHANGE 式人闸 → 才改码（硬约束 3）。

---

## 背景与目标

**评审已闭环、形态已定稿（本 task 不重议）**：2.4.x 序列把门禁强度打到 PASS-with-issues 无 P1，仍攒下一批**防伪类弱判据**债（长度门槛 / 裸子串 / 字面连续可被构造顶包）。W4 评审文（设计真值）完成六判据形态定稿 + 存量全量实测（reviews 88 件现口径 PASS 63 / FAIL 25 · 索引行 18 · 豁免 34 条 · md 284 份 · 双 README 表 20）+ 判据两分边界声明（硬约束 11 兑现面）+ OQ-1–OQ-4 荐案。本 task 把评审文定稿形态规格化为 30 可执行面：**结论闸档 M 语义化 · R-5 跨行窄邻接封堵 + K 断言翻向 · NEW-11 词表五类广义化 · pin-17 主键列+表头签名双判 · pin-08 S_mid 同格共现绑定 · NEW-10 A1 形态三元判 + U1 口径统一 · N5 口径登记（零行为变更）· 判据两分边界防御**。每条修严配负向 fixture（修复前真红 · 修复后转绿 · 硬约束 6）· 误伤 6 件循 2.3.1 N11 先例入豁免留痕（硬约束 7 不追溯 = 新判据不翻旧案）。

**判据两分边界显式声明（硬约束 11 · F-W4-05 · 评审文 §1 逐字继承）**：本波六项全部属**防伪类**（判据守护对外可证伪的事实陈述：审没审、发没发、谁授的权）；**本波不触 KPI/自评类判据** —— `close_kpi` 现状零变更（仅存在性约束 · D-30-KPI-NO-SEM）；任何以「统一语义化」为名对 KPI 节设分数口径/评分表形态/值域分布等机械判据的提案**一律拒**（引评审文 §1 为据）；判据分类存疑时按「判据失守是否产生对外假事实」判定（是 → 防伪类 · 否 → 自评类）。

---

## 开工基线（2026-09-17 本棒复跑实测 · 验收比对的唯一基准）

> 30 开工时若复跑结果与本表不符，按 F-W0-05 同式纪律处置（以复跑实测重建基线并登记 · 不得沿用旧数字强行比对）。

| 项 | 实测值 | 备注 |
|----|--------|------|
| git HEAD | `9c895db` | 工作区仅评审文 1 件 untracked（+ 本 task 起草后 2 件）· 其上 `2b3c60c`/`0ef6741` = W3 收官 |
| `npm test` | **773 tests / 145 suites / 772 pass / 0 fail / 1 skip** | duration ≈94s · 与 W3 锁终态逐字一致（复跑确认） |
| `npm run typecheck` | **0 错** | strict + noUncheckedIndexedAccess |
| `node bin/specgate.js pins check` | **17/17 PASS** | pin-17 现值「13 宿主校验 · 13 双语命中」 |
| reviews 存量 | **89 件 md**（评审文基线 88 + 评审文自身入库 = 预期差 1） | 评审文非 `task_*_audit_R<n>_*` 形态不被 findLatestReview 消费（`src/checks/review-gates.ts:99`）· 分母 63 预期不变 |
| 结论闸现口径复跑基线 | **PASS 63 / FAIL 25**（无结论节 15 · 否定命中 3 · 无通过词 7 · 内容量不足 0） | 评审文 §0 全量实测（evalReviewConclusion 逐行复刻）· 30 复跑核对 · 差异须归因登记 |
| 豁免清单 | **34 条目**（reviews 18 + invoke_hats 16 · `docs/harness/legacy-gate-exempt.yaml` 147 行） | authorized_by 全部同构「00（2026-09-12 维护者会话授权）」· A1 形态判 34/34 合规（评审文 §6.1） |
| spec 索引行 | `docs/spec/README.md` **18 行**（L9–L26 · 15 行状态格含点式串） | S_mid 措辞集 0/15 不合规 · S_narrow 1/15（L10 CLOSED 行 · 弃用理由）· 当前版本行 L23「2.4.2 published」 |
| 跨行语料 | **284 份** tracked md 全量：窄邻接式 0 命中 · 行尾 不/未 0 行 · 宽窗口 1 例误中（`docs/spec/3_0-architecture-leap/08_w7_closeout_external_v1.md:85`） | 评审文 §3.1 · 窄式定档的实测依据 |
| 双 README 表 | 各解析 **10 张** · 宿主签名表各恰 **1 张**（README.md:24-38 / README.zh-CN.md:24-38 · 各 13 行） | 13 宿主词锚全部落 cells[0] · 26/26 合规 · 误伤 0（评审文 §4） |
| NEW-11 语料普查 | 不通过 5 · 未通过 6 · 不予通过 1 · 不 通过 2 · 不签收 1 · not pass 4 · reject* 21 | 评审文 §3.3 · 新增候选对 63 份合规结论节误伤全 0 |
| K 断言现值 | `test/cli-w4-gate-wiring.test.ts:693-701` | 「不\n通过」换行维持 PASS 漏网钉死（防顺手修 R-5）· 本波解锁真修 |
| N5 现状 | `src/cli-assets.ts:86-90` 追认警示文案已在案（2.4-W4 N5 落地 · 快照断言锁文案） | 本波仅口径登记 · 零行为变更 |
| 依赖基线 | `package.json` dependencies = **仅 `js-yaml`** · lock 非 dev 顶层 = **2**（argparse + js-yaml） | 本波零新依赖（全部判据落既存模块） |
| normalizeSlug | `src/cli-shared.ts:321-323`（下划线→连字符） | 豁免条目 slug 填 meta task_slug 原形（连字符形态）即可命中消费面 |

---

## W4 实现规格（10-task 定稿 · 30 按此实施）

### S5.1 NEW-5 · 结论闸语义化（范围① · 档 M · 评审文 §2 定稿）

- **改造点**：`src/checks/review-gates.ts` `evalReviewConclusion`（:143-175）在现有判定链（无节 fail → 否定 fail → 无通过词 fail → 内容量 fail）之后增**语义组合判**；词集单点声明于 :134-141 常量区（与 REVIEW_*_RE 同处）。
- **组合规则（档 M · OQ-1 荐案采纳）**：**VERB ∧ SUBJ ∧ (OBJ ∨ GATE)** · 结论/签收节内共现（不要求同行同句）· 与现有否定守卫 / 通过词 / substance≥20 全部 **AND 保留**（REVIEW_MIN_SUBSTANCE=20 并列地板不动 · 双保险防「词齐但仍是碎句」）。
- **词集（评审文 §2.2 定稿 · 63 份合规结论节实测命中率在案）**：
  - **VERB** = 现有 REVIEW_PASS_RE（:135 · 通过/签收/零内容阻塞/零阻塞/PASS/ACCEPT · **沿用不扩** · 63/63）；
  - **SUBJ_RE**（审查行为词）：审查 / 评审 / 核对 / 复核 / 审计 / 验收 / 检查 / audit / review（i 旗标 · 57/63）；
  - **OBJ_RE**（对象锚）：任务 / task / SPEC / PLAN / 范围 / 验收 / 交付 / 变更 / 计划 / 闸 / 钉 / docs/ / src/ / 本波 / W\d（59/63）；
  - **GATE_RE**（闸锚）：HG-[A-Z-]+ / approved / 人闸 / 代签 / 闸（61/63）。
- **failClosed 方向**：缺 SUBJ 或缺 (OBJ∨GATE) → `{ pass: false }` · detail 点名缺失维度（「结论节缺审查行为陈述（SUBJ）」/「缺对象或闸指涉（OBJ∨GATE）」· 与既有 detail 文案同构）。
- **负向 fixture（红测先行 · 硬约束 6 · 评审文 §2.4 对抗表机械复现）**：
  1. 「通过。」+ 任意填充凑过 substance≥20 地板 → **修复前 PASS 真红留证 · 修复后 FAIL**（无 SUBJ/OBJ/GATE）；
  2. 「本审查通过。」+ 填充 → 修复后仍 **FAIL**（SUBJ 有 · OBJ/GATE 无）；
  3. 「HG-AUDIT-R1 approved」+ 填充 → 修复后仍 **FAIL**（GATE 有 · SUBJ 无）；
  4. 诚实边界对照：「本审查核对验收标准与范围，无阻塞，通过。」（+补足 20 字）→ **PASS**（成段伪造不防 · R-① 登记面 · fixture 固化为「机械判据职责边界」声明）。
- **存量波及处置（循 2.3.1 N11 先例 · 硬约束 7）**：误伤 **6 件**（评审文 §2.3 档 M 枚举 · 形态同构）入 `docs/harness/legacy-gate-exempt.yaml` reviews 节 —— 四字段齐（slug/reason/date/authorized_by · 显式类型判既有面 exempt.ts:40-44 自动兜住）· **不追溯语义 = 新判据不翻旧案 · 豁免留痕非静默放过**：

  | # | slug（meta task_slug 原形 · normalizeSlug 命中） | 误伤形态（reason 底稿） |
  |---|--------------------------------------------------|--------------------------|
  | 1 | `00-default-behavior-kit-1-7-1` | `task_00_default_behavior_kit_1_7_1_audit_R1_ACCEPT.md`：「ACCEPT。范围限于…」无审查行为词（SUBJ 缺） |
  | 2 | `2-4-gate-strength-w1-pins-extract` | `task_2_4_gate_strength_w1_pins_extract_audit_R1_20260914.md`：「W1 结论：PASS · 零内容阻塞，与总审文 §4…一致」短结论 SUBJ 缺 |
  | 3 | `2-4-gate-strength-w3-output-rel` | 同形态（W3 短结论） |
  | 4 | `2-4-gate-strength-w4-assets-observability` | 同形态（W4 短结论） |
  | 5 | `2-4-gate-strength-w5-materials-messaging` | 同形态（W5 短结论） |
  | 6 | `2-4-gate-strength-w6-p3-cleanup` | 同形态（W6 短结论） |

  reason 统一引评审文（「3.0-W4 NEW-5 档 M 语义闸接线存量波及 · 评审文 w4_semantic_criteria_review_20260917 §2.3/§7 枚举 · 接线前合法 · 循 2.3.1 N11 先例不追溯」+ 各件形态句）· date = 30 执行日 · authorized_by 须过 A1 形态判（S5.6 · 建议形态「00（2026-09-16 维护者双签授权 00 代签）」· 身份+全角括号 ISO 日期+出处词三元齐）。
- **档 S 备选通道（留 20-task-audit 裁定 · 非默认）**：若 20 审改档 S（VERB ∧ SUBJ ∧ OBJ），4 件 `task_2_1_1_host_tools_ux_w{1,2,3,4}_*` 系列（维度表形态无对象锚 · 评审文 §2.3 档 S 枚举）须**补入豁免清单**（误伤 10/63）· 判据词集与 fixture 同步换档 · 此属档位裁定非范围违约。

### S5.2 R-5 · 跨行否定封堵（范围② · 窄邻接式 · 评审文 §3.1/§3.2 定稿）

- **封堵形态**：REVIEW_NEG_RE（:136）增 alternative「`不[ \t]*\n[ \t]*(予|以)?通过` · `未[ \t]*\n[ \t]*(予|以)?通过`」—— **仅单换行邻接 · 禁 `\n\n` 跨段 · 不引入字符窗口**（评审文 §3.1 实测定档依据：宽窗口 `不[^。；]{0,12}\n[^。；]{0,12}通过` 有 1 例实测误中 08_w7:85 · 凡允许 `\n` 进字符窗口即等于允许跨段误配；窄邻接 284 份 md 0 命中 · 行尾 不/未 0 行）。英文侧 `not\s*pass` 既有 `\s*` 已含换行（评审文 §3.1 实测 0 冲突 · 不动）。
- **K 断言翻向 + 跨段反向锁（SPEC 验收 5 · 解锁顺序硬锁 · 判据改造与断言翻向同 commit）**：
  1. `test/cli-w4-gate-wiring.test.ts:693-701` K 断言**同 fixture 翻向**：「不\n通过式」结论 → exit **0 → 2**（VERIFY: PASS → BLOCKED · 「修复后转绿」的回归锁语义）；
  2. **新增跨段反向锁**：「不\n\n通过」（跨段空行）必须**维持 PASS** —— 把 08_w7:85 误中案例固化为「禁止未来顺手把窗口改宽」的回归锁；
  3. 两断言配对替换原 K 断言 · **不留过时断言**（SPEC residual_risks ③）。
- **2.4.2 口径注释同步更新（登记项）**：`review-gates.ts:126-133` 注释中「窗口显式排除 `\n` → R-5 换行形态维持已登记残余不动（归 3.0 · K 断言钉死）」改为已封堵口径（窄邻接入表 · 跨段仍排除 · 指向评审文 §3.1 实测）· 入既有面改动登记清单（验收 #11）。

### S5.3 NEW-11 · 否定词表广义化（范围③ · 评审文 §3.3 定稿 · 不承诺完备）

- **五类新增入 REVIEW_NEG_RE**（评审文定稿清单 · 对 63 份合规结论节误伤实测全 0）：
  1. **中文签收面**：不予签收 / 不签收 / 未签收（现词表只有「通过」族 · 语料实见 1 例）；
  2. **英文否定完成式**：`does n['’]t pass` · `does not pass` · `fail(ed|s)? to pass` · `not approv*`；
  3. **英文否决族**：`\bdeclined?\b` · `\bveto(ed)?\b` · `\brefused?\b`；
  4. **中英混入**：`(不|未)\s*pass` · `not 通过` · `no 通过`；
  5. **`\bNG\b` 不入首批**（OQ-4 · 观察名单：本仓 284 份 0 命中 · 但消费者英文 prose 中 "NG" 或有他义 → 若日后入，限结论节作用域 · 入词表注释登记）。
- **残余显式登记（F-W4-02 兑现 · 入词表注释 · 不承诺完备）**：① 日韩德法俄等全形态（不合格 / 불합격 / nicht bestanden / rejeté …）；② 符号形态（❌ ✗ 👎）；③ 谐音/拆字/全角混入（不 通 过 · 不─通过）；④ 拼音。注释尾注：「后续发现新形态 → 补词表 + fixture · 循本次同流程」。
- **fixture**：每类至少一件红转绿（结论节含该形态 + substance 达标 → 修复前 PASS 真红 · 修复后 FAIL 点名否定命中）· **误伤 0/63 回归锁**（63 份合规结论节全量复跑 · 验收 #3）。

### S5.4 NEW-4 · pin-17 表行语义判（范围④ · 评审文 §4 定稿）

- **升级判据**（`src/cli-pins.ts:382-477` · 在 D-24-PIN17-TABLEROW 双命中 :419-428 基础上加两层）：
  1. **主键列判**：命中行切格（`cells = split('|').slice(1,-1).map(trim)` · 与 pin-08 :238 同式）· host_hits 词锚（剥 `\|\s*` 行首锚后的 cell 域形态）须对 **cells[0]** 复判命中 —— 词锚落任意其他格不计；
  2. **表头结构判**：命中行所属表（表头行 + 分隔行 `/^\s*\|[\s:\-|]+/` + 连续表行解析）**首表头格**须匹配宿主表签名 `/^(Host|宿主)$/`（双语 · 与现行两 README 实测表头一致）。
- **数据声明入 `assets/release-pins.yaml` pin-17 semantics**（:178-187 区 · 数据面文案更新 · 非结构变更 · 闸行裁决②）。
- **负向 fixture（红测先行）**：① 非签名表（「你是谁」表 / Topic 表形态）注入「| **Cursor** | …」词锚行 → **挡**（表头签名不符）；② 签名表内追加行把词锚写进第二格（「| foo | Copilot |」）→ **挡**（主键列判）；③ 全表誊抄伪造（伪造整张建签名表 + 13 行加粗宿主名）→ 可通过 —— **诚实边界登记**（机械判据防机会式单行注入 · 全表誊抄不造成信息失真 · 评审文 §4 对抗分析 · 入 fixture 注释）。
- **存量零回退**：双 README 各 10 表 · 签名表各 1 · 26/26 合规 · pins 17/17 兜住（验收 #3/#6）。

### S5.5 pin-08 · 版本串↔发布态绑定（范围⑤ · 评审文 §5 定稿）

- **绑定规则**：**同格共现** —— cells[2]（状态格）内边界点式串（既有 dottedExactRe :230-232 · N9 边界正则不动）∧ **S_mid 发布态措辞集** `{published, 已发, released, CLOSED, 规划中, planned}` · 非同行非跨格（实测 15 行版本串与措辞本就同格 · 跨格会把 slug/描述格措辞卷入稀释语义）。
- **弃用/不入集登记（入 yaml semantics 文案）**：S_narrow（published/已发/released）弃用 —— 实测伤 L10「**CLOSED**（1.12.0+1.12.1）」现行合法形态（1/15）；IMPLEMENTED/deprecated/DONE/CLOSE/draft **不入**发布态集 —— 生命周期/包态措辞与「该版本串已发布」无语义绑定关系（稀释判据）；规划中/planned 入集 —— 规划态亦是显式状态绑定（F-W1-05 既定行形态）。
- **分工注释保持**：规划中伪装已发行 → 行已自陈规划态 · 版本真实性归 pin-10 tag 闸分工（`cli-pins.ts:221` 注释口径不动）。
- **负向 fixture（红测先行）**：裸「| slug | path | 2.4.2 |」状态格（边界完整但无任何态词）→ **修复前 ok 真红 · 修复后 mismatch**（点名缺发布态措辞）。
- **yaml semantics 更新**（:66-78 区 · 增 S_mid 同格共现绑定段 + S_narrow 弃用理由）· **存量 15/15 零误伤**（评审文 §5 实测 · 30 复跑核对）。

### S5.6 NEW-10 · exempt 真实性 + close/verify 口径统一（范围⑥ · 评审文 §6 定稿 · U1）

- **A1 形态三元判（强制 · OQ-2 荐案采纳）**：loader（`src/checks/exempt.ts:40-44` 字段判之上）对 `authorized_by` 增形态判 —— ① 非空身份段（全角括号前非空）∧ ② 全角括号内 ISO 日期 `（YYYY-MM-DD …）` ∧ ③ 出处关键词（授权/批准/会话/答复 任一）—— **不合 → 入 invalid 留痕 warn · 不豁免**（与既有「缺四字段」同处置面 · exempt.ts:42 同通道）。存量 34/34 合规零误伤（评审文 §6.1 实测 · 回归锁）。
- **A2 可选登记（不强制）**：新条目可自愿在 reason/authorized_by 引用 tracked 记录（invoke 快照/审查文/答复记录）为强形态 · 强制则与不追溯冲突（实测 0/34 · 评审文 §6.1）· 入 yaml 头注释登记。A3（date ↔ 内嵌日期相等）弃选登记（语义两回事 · 评审文 §6.1）。
- **诚实边界注释（R-③）**：A1 锁「授权陈述的可稽核形态」· 不能机检「维护者是否真的说过」—— 真实性终局靠 S2 留痕 + 人审 · 注释写显式（与 NEW-5 同哲学）。
- **U1 口径统一（消费分叉四面 · 评审文 §6.2 表在案）**：
  1. **抽共同 helper**（slug → exempt 条目解析 + invalid 留痕回显）供两个存量消费面同构使用 —— 裸 verify（`src/cli/verify.ts:144,157-170`）与 lint-done（`src/cli-task-extra.ts:102-127`）· grep 单源断言（验收 #10）；
  2. **verify --task done 面补消费 exempt.reviews**（`src/cli/verify.ts:343-347` warn 降级分支）：有豁免条目 → 留痕 **exempted**（不再 warn · 字段命名 waived/exempted 与裸 verify 对齐 · OQ-3 口径）· 无豁免 → 维持 D-23-W4-TRANSITION warn 降级不挡（现状不变）；
  3. **close 不消费 exempt = 设计性不对称非缺陷** —— close 只闸**新关账** · 新关账无「接线前合法存量」可言（D-23-W4-TRANSITION）· 把该不对称写成 `evalCloseReview` 头注释（`src/checks/close-guards.ts:90-91`）的显式口径 · **杜绝后人「顺手补消费」**（U2 弃选：豁免机制反噬 · U3 弃选：34 条合法豁免瞬间全红违反不追溯）。
- **负向 fixture（红测先行）**：① 假授权 `authorized_by: 张三`（无括号日期无出处词）→ **修复前被豁免真红 · 修复后 invalid warn + 不豁免**；② verify --task done 面：有豁免条目 → exempted 留痕 fixture · 无豁免 → warn 维持 fixture（双向钉死）。

### S5.7 N5 口径登记（范围⑦ · 零行为变更）

- 复核 `src/cli-assets.ts:86-90` 追认警示文案在案（2.4-W4 N5 已落地 · 快照断言锁文案 F-W4-03(2.4)）· 本波**仅口径登记**：自检结论显式标注「`assets manifest rebuild` 追认语义在 provenance 未启用前提下**不封堵** · 只做口径标注 · 若日后动归 W7 对外口径」· 文案/逻辑/快照断言**零变更**（改动即打回）。

### S5.8 判据两分边界防御（硬约束 11 · F-W4-05 兑现面）

- **KPI/自评类零触碰机检**：本波 diff 对 `close_kpi` 及 KPI 判据相关行零变更（git diff + grep 断言入验收 #7）· 任何「统一语义化」名义的 KPI 机械门槛提案 → **拒**（引评审文 §1 边界声明）。
- 判据分类判定规则入本 task 背景节（已写 · 防伪/自评边界显式声明段）· 防御性非范围条入非范围表首行。

---

## 范围

- [ ] **① NEW-5 结论闸语义化（档 M）**（SPEC §3-① · S5.1）：VERB ∧ SUBJ ∧ (OBJ∨GATE) 节内共现 + 否定/substance≥20 地板保留 · 负向 fixture 四件 · **6 件误伤入 legacy-gate-exempt.yaml 留痕**（四字段齐 · 循 N11 先例 · 不追溯）
- [ ] **② R-5 跨行封堵（窄邻接式）**（SPEC §3-② · S5.2）：NEG_RE 增单换行邻接 alternative · K 断言同 fixture 翻向 exit 0→2 + 跨段反向锁（不\n\n通过 维持 PASS）· 2.4.2 注释同步更新（登记）· 同 commit
- [ ] **③ NEW-11 词表广义化**（SPEC §3-③ · S5.3）：五类新增（中文签收面/英文完成式/英文否决族/中英混入 · NG 观察名单不入首批）· 残余显式登记入注释 · 误伤 0/63 回归锁
- [ ] **④ NEW-4 pin-17 表行语义判**（SPEC §3-④ · S5.4）：词锚落 cells[0] 主键列 ∧ 表头签名 `/^(Host|宿主)$/` · yaml semantics 数据声明 · 伪表行负向 fixture 两构造 + 誊抄诚实边界登记
- [ ] **⑤ pin-08 发布态绑定**（SPEC §3-⑤ · S5.5）：cells[2] 同格共现（边界点式串 ∧ S_mid 措辞集）· S_narrow 弃用原因登记 · yaml semantics 更新 · 裸版本串负向 fixture
- [ ] **⑥ NEW-10 exempt 真实性 + U1 口径统一**（SPEC §3-⑥ · S5.6）：A1 形态三元判入 loader invalid 面 · A2 可选登记 · helper 单源 · verify --task done 面补消费 exempt.reviews（exempted 留痕）· close 不消费设计性不对称显式注释
- [ ] **⑦ N5 口径登记**（SPEC §3-⑦ · S5.7）：rebuild 追认语义不封堵口径标注（零行为变更 · 警示文案在案复核）
- [x] **⑧ W4 评审文（硬前置）**（SPEC §3-⑧ · **已销**）：评审文落盘 `docs/harness/reviews/w4_semantic_criteria_review_20260917.md`（217 行 · 六判据定稿 + 判据两分边界声明 + 存量全量实测）· 本 task 起草即兑现复核

## 非范围

| 项 | 理由 |
|----|------|
| **KPI 语义化 / 每帽 KPI / 移除 `### KPI` 节 / 对 KPI 设任何机械门槛** | **已裁决不做**（D-30-KPI-NO-SEM · 硬约束 11 · `close_kpi` 零变更 · F-W4-05 防御条 · 评审文 §1 边界声明） |
| R-2 / R-3 / R-4 | **已由 2.4.2 交付**（评审文 §0 对账 · SPEC §4）· 不重复进 3.0 |
| 改结论节存在性判定（无节 fail 口径） | 2.3.1 N11 已定 · 本波只改节内强度 |
| 改豁免机制的存在性 / 移除豁免清单 | 只加真实性约束（NEW-10 A1）· 机制本体不动 |
| 追溯存量 done task / 翻旧案 | 硬约束 7（D-24-W2-NO-RETRO 沿用）· 误伤入豁免留痕非改写 |
| `KPI_RUBRIC_v1_2` 引而不随包 | 本波不处理 · 归 W7 对外口径（若日后动） |
| `\bNG\b` 入词表首批 | OQ-4 观察名单（消费者英文 prose 或有他义）· 若日后入限结论节作用域 |
| A2 强制（链 tracked 授权记录）/ A3（date↔内嵌日期相等） | 实测 0/34 合规 · 强制即与不追溯冲突（评审文 §6.1 弃选在案）· A2 仅登记为可选强形态 |
| 宽字符窗口跨行否定（`不[^。；]{0,12}\n…通过`） | 实测 1 例误中（08_w7:85）· 窄邻接式为唯一定档（评审文 §3.1） |
| U2（close 也消费 exempt）/ U3（裸 verify 不消费） | 评审文 §6.2 弃选（豁免反噬 / 违反不追溯） |
| 词表完备多语言承诺 | 不可达成 · 只承诺常见形态覆盖 + 残余显式登记（评审文 §3.3） |
| 动 S2 三域既有档（`docs/tasks` / `docs/harness/reviews` / `invokes/by-task` 改写） | 硬约束 1 · 本波只新增（本 task + 30 执行留档 + 豁免清单 6 条数据行） |
| 新增任何运行时依赖 | 全部判据落既存模块 · 依赖基线仅 js-yaml 不增 |
| 发布四动作（tag/push/publish/deprecate） | 仅人 · 无代跑授权（RELEASING.md） |

---

## failure_paths

| 触发 | 行为 | 可重试 | 用户可见 |
|------|------|--------|----------|
| 语义判据过严误伤真实合规文（F-W4-01） | 定档以「误伤率可枚举、豁免可留痕」为界（评审文 §7 总表 · 档 M 误伤 6/63 全枚举入豁免）· 30 复跑发现枚举外新误伤 → STOP 回 20/00 复核档位（档 S/L 备选通道 S5.1） | 是 | 是 |
| 跨语言否定形态漏网（F-W4-02） | 显式登记残余（词表注释四类 · 不承诺完备）· 后续发现新形态补词表+fixture 循本次同流程 | 是 | 是 |
| 跨行窗口与正常换行排版冲突（F-W4-03） | 窄邻接式定档（284 份 0 命中 + 行尾 不/未 0 行实测 · 非拍脑袋）· 跨段反向锁钉死禁改宽 | 是 | 是 |
| exempt 真实性核验误伤存量合法豁免（F-W4-04） | 存量 34 条全量复跑（A1 实测 34/34 合规 · 评审文 §6.1）· 波及入豁免登记（循 2.3.1 N11 先例）· invalid 留痕 warn 不静默 | 是 | 是 |
| 有人以「统一语义化」为名给 KPI 加机械门槛（F-W4-05） | **拒**（硬约束 11 · D-30-KPI-NO-SEM · 评审文 §1 边界声明兜底）· S5.8 零触碰机检 | — | 是 |
| **成段伪造审查行为顶包（F-W4-06 · 本棒新增 · R-① 登记不防）** | 语义闸不防「成段伪造一次并未发生的审查」（评审文 §2.4 末行诚实边界）—— 由 invoke 留痕（close_invoke 帽集合闸）与 HG-AUDIT-R1 人签兜底 · fixture 固化为职责边界声明 · **不在机械判据面追加防御** | — | 是 |
| **窄式跨行封堵理论误伤（F-W4-07 · 本棒新增 · R-②）** | 消费者仓「恰在 不/未 后硬换行且下行以 通过 起首」排版 → 理论误伤（本仓 0/284 实测 · 行尾 不/未 0 行）· 误伤可枚举 + 豁免可留痕（F-W4-01 同通道） | 是 | 是 |
| **A1 只锁形态不锁事实（F-W4-08 · 本棒新增 · R-③ 登记）** | authorized_by 形态合规但授权事实伪造 → 机械面不可检（诚实边界注释在案）· 终局靠 S2 留痕 + 人审 · A2 可选强形态登记为自愿路径 | — | 是 |
| **K 断言解锁顺序颠倒留矛盾断言（F-W4-09 · 本棒新增 · SPEC residual_risks ③）** | 判据改造与断言翻向**同 commit** 硬锁（S5.2）· 分批提交致新旧断言并存 → 打回 | 是 | — |
| `git add -A` 裹挟域外档（F-W4-10） | 打回 · 撤 stage 逐文件显式 add | 是 | — |
| 越权执行 tag/push/publish/deprecate（F-W4-11） | 违禁令 · 打回（四动作全仅人） | — | 是 |

---

## 验收标准（必须自证，不接受「我改完了」）

- [ ] **#1 NEW-5 档 M 负向 fixture 红转绿**（SPEC 验收 1 · S5.1）：填充顶包 fixture 修复前 PASS 真红留证（30 invoke 留档）· 修复后 FAIL（exit 2 · detail 点名缺 SUBJ / 缺 OBJ∨GATE 维度）· §2.4 对抗三行 fixture（本审查通过+填充挡 · HG approved+填充挡 · 诚实合规构造过）· substance≥20 地板保留（既有 F 形态「通过\n」仍内容量不足 FAIL · 对照零回退）
- [ ] **#2 存量波及实测登记 + 豁免留痕**（SPEC 验收 2 · S5.1/S5.6）：reviews 全量复跑（89 件 · 评审文基线 88 + 自身 1 · 分母 63）· 新判据后 **PASS 57 + exempted 6 + FAIL 25**（FAIL 集与现口径逐字一致 · 任何差异归因登记）· **6 条豁免**入 `legacy-gate-exempt.yaml` reviews 节（slug 名单照 S5.1 表钉死 · 四字段齐 · reason 引评审文 §7 · authorized_by 过 A1）· 裸 verify 输出该 6 件由 gap 转 **exempted** 留痕 · 30 复跑数字与评审文 §7 基线核对入自检结论
- [ ] **#3 正例零回退五面**（SPEC 验收 3）：① 63 份现口径合规文除 6 件枚举豁免外全部直接 PASS（57/63）；② NEW-11 词表对 63 份合规结论节误伤 **0**；③ pin-17 双 README **26/26**；④ pin-08 索引行 **15/15**；⑤ exempt **34/34** —— 复跑脚本输出入自检结论
- [ ] **#4 评审文 + 边界声明**（SPEC 验收 4 · 已清偿复核）：评审文落盘在案（`git ls-files` 命中）· 防伪/自评边界声明（评审文 §1）在案 · 本 task 背景节 + 非范围首行双重声明 · S5.8 机检面落地
- [ ] **#5 R-5 + K 断言配对更新**（SPEC 验收 5 · S5.2）：K 断言同 fixture 翻向 exit 0→2 · 跨段反向锁新增（不\n\n通过 维持 PASS）· 不留过时断言 · 判据改造与断言翻向同 commit（git log 单 commit 含两侧 diff 证明）· 284 份 md 窄式 0 命中复跑锁
- [ ] **#6 平台锁**（SPEC 验收 6）：`npm run typecheck` 0 错 · `npm test` 全绿（基线 773 + 新增用例数 · 零意外红 · 环境红先对照实验定性 F-W0-07 同式）· pins **17/17** · 依赖零新增（dependencies diff 空 · lock 非 dev 顶层 = 2 不增）
- [ ] **#7 判据两分边界防御**（S5.8 · F-W4-05）：`close_kpi` / KPI 判据相关行零 diff（git diff + grep 断言输出入自检结论）· 非范围表防御条在案
- [ ] **#8 pin-17 语义判 fixture**（SPEC 验收 1 · S5.4）：伪表行顶包两构造挡（非签名表注入词锚 · 签名表第二格注入）红转绿 · 全表誊抄诚实边界登记（fixture 注释）· 26/26 零回退（pins 17/17 兜住）
- [ ] **#9 pin-08 绑定 fixture**（SPEC 验收 1 · S5.5）：裸版本串无态词 → 修复前 ok 真红 · 修复后 mismatch 点名缺发布态措辞 · S_mid 集 + S_narrow 弃用理由入 yaml semantics（release-pins.yaml pin-08 段）· 15/15 零误伤
- [ ] **#10 NEW-10 A1 + U1 fixture**（SPEC 验收 1 · S5.6）：假授权（随手填名）→ invalid warn + 不豁免红转绿 · 34/34 零误伤 · verify --task done 面 exempted 留痕 fixture + 无豁免维持 warn fixture（双向钉死 · 字段命名与裸 verify 对齐 OQ-3）· helper 单源 grep 断言（裸 verify / lint-done 同一 helper · src 内无第二份 slug→条目解析拷贝）· close 不消费不对称显式注释在案（close-guards.ts evalCloseReview 头注释）
- [ ] **#11 既有面零意外改动**（F-W2-13 同式纪律）：除登记项外既有断言零改动全绿 · 登记项逐条列明于自检结论（预期登记面：K 断言翻向 · review-gates.ts:126-133 口径注释更新 · close-guards.ts 头注释 · 词表残余登记注释 · 对照零回退 fixture 若受影响逐条登记）
- [ ] **#12 结构闸**：`npx spec-wave task lint --file docs/tasks/active/task_3_0_w4_semantic_criteria.md` PASS
- [ ] **#13 执行粒度**：提交逐文件显式 add（禁 `git add -A`）· 每 commit 独立可回退 · 每 commit 前后 npm test 同绿 · 未执行 tag/push/publish/deprecate · 波末 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w4_semantic_criteria.md` → exit 0 + `task close --yes` 闭环（待 40 复核后另行 · 00 口径）

---

## 给执行帽的必读列表

1. **设计真值全文** [`w4_semantic_criteria_review_20260917.md`](../../harness/reviews/w4_semantic_criteria_review_20260917.md)（§0 现码基线 · §1 判据两分边界 · §2 档 M 词集+对抗表+误伤枚举 · §3 窄邻接定档+K 断言方案+词表清单 · §4 pin-17 双层判 · §5 S_mid 措辞集 · §6 A1/U1 四面分叉表 · §7 强度档与波及处置总表（豁免登记清单底稿）· §8 OQ/R 登记）
2. SPEC [`05_w4_semantic_criteria_v1.md`](../../spec/3_0-architecture-leap/05_w4_semantic_criteria_v1.md) 全文（范围 ①–⑧ · 非范围 · 验收 1–6 · F-W4-01–05 · 思考轮）· [`00_policy_and_boundaries.md`](../../spec/3_0-architecture-leap/00_policy_and_boundaries.md)（S2/P0/流程边界）
3. PLAN [`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W4 节（:259-272）+ 硬约束 6/7/11/14/15（:335,:336,:340,:343,:344 区）
4. 现码（2026-09-17 实读行号 · 改前复读）：`src/checks/review-gates.ts`（REVIEW_*_RE :134-141 · 2.4.2 R-2 口径注释 :126-133 · evalReviewConclusion :143-175 · findLatestReview :95-114）· `src/checks/exempt.ts`（loader :18-54 · 四字段判 :40-44 · invalid 面 :42）· `src/checks/close-guards.ts`（evalCloseReview :90-108 · evalCloseInvokeHats :76-88）· `src/cli-pins.ts`（pin-08 spec-index-row :217-266 · dottedExactRe :230-232 · 切格 :238 · pin-17 readme-host-row :382-477 · TABLE_ROW_RE/hitInTableRow :419-428）· `src/cli/verify.ts`（裸 verify done 面 :144,157-170 · --task 面 :319-324,332-353 · done warn 降级 :343-347）· `src/cli-task-extra.ts`（lint-done :100-127）· `src/cli-shared.ts`（normalizeSlug :321-323）· `src/cli-assets.ts`（N5 追认警示 :86-90 · 零触碰复核）
5. 资产：`assets/release-pins.yaml`（pin-08 :60-82 semantics :66-78 · pin-17 :173-212 semantics :178-187 · known_gaps :212）· `docs/harness/legacy-gate-exempt.yaml`（147 行 · reviews 节 :9- · 头注释四字段纪律 :1-6）
6. 既有测试面：`test/cli-w4-gate-wiring.test.ts`（K 断言 :693-701 · 对照零回退 :668-691 · N13 四字段判 :704+）· pins-consistency 系 · cli-g1g7 / cli-json-no-abs-path 系（既有面登记纪律）
7. done task 先例：`docs/tasks/done/` 内 `task_2_3_1_patch`（N11 豁免先例 · 8 份循 W4 先例入豁免）· 评审文 `w2_conclusion_gate_strength_review_20260914`（S1·N=20 定档路径 · 评审先行范本）· [`task_3_0_w3_ontology_graph.md`](../done/task_3_0_w3_ontology_graph.md)（闸行裁决体例 · F-W2-13 登记纪律 · 红测先行）
8. `RELEASING.md`（发布边界 · 四动作仅人）

---

## 思考轮

### R0 · 证据

SPEC 05（signed）+ 评审文 217 行全文（六判据定稿 · 存量全量实测：reviews 88/现 PASS 63/FAIL 25 · 索引行 18/15 · 豁免 34 · md 284 · 双 README 表 20）+ PLAN W4 节 + 硬约束 6/7/11/14/15 + 本棒全量实读复核：基线复跑（773/145/772/0/1 · duration ≈94s · typecheck 0 · pins 17/17 · HEAD `9c895db`）· 现码行号与评审文基准逐条复核一致（review-gates.ts:134-141,143-175 · exempt.ts:9,18-54,40-44 · close-guards.ts:76-88,90-108 · cli-pins.ts:217-266,230-232,382-477,419-428 · verify.ts:144,157-170,319-324,332-353 · cli-task-extra.ts:100-127 · release-pins.yaml:60-82,173-212 · K 断言 test:693-701）· **6 件误伤名单落盘核实**（reviews 文件名 + done task meta task_slug 逐字：00-default-behavior-kit-1-7-1 + 2-4-gate-strength-w{1,3,4,5,6}-* · normalizeSlug :321-323 只归下划线 ⇒ 连字符原形直填即命中）· 结论节文本抽核 3 件与评审文形态描述一致 · N5 现状复核（cli-assets.ts:86-90 警示在案）· reviews 89 = 88 + 评审文自身（预期差 1 归因在案）。

### R1 · 范围

①–⑧ 照规格化节 S5.1–S5.8（SPEC §3 对照 · ⑧评审文已销）；非范围照 SPEC §4 全继承 + 本棒明示七条：NG 首批不入（OQ-4）· A2 不强制/A3 弃选 · 宽字符窗口不引（08_w7:85 实测反例）· U2/U3 弃选 · KPI/自评类零触碰（硬约束 11 防御条）· 词表不承诺完备 · 零新依赖。

### R2 · 方案

评审文定稿全继承：**OQ-1 档 M 采纳**（S 伤 10 边际强度不值留痕成本 · L 降 SUBJ 为可选防伪强度损失不值 · 评审文 §2.3 理由四条）· **OQ-2 A1 强制 + A2 可选**（强制 A2 实测 0/34 与不追溯冲突）· **OQ-3** waived/exempted 字段命名与裸 verify 对齐 · **OQ-4** NG 观察名单限结论节作用域 · S_mid 措辞集（CLOSED/规划中入集理由 · IMPLEMENTED 等不入集理由）· 窄邻接式（单换行 · 禁跨段 · 不引窗口）· pin-17 主键列+表头签名双层 · helper 单源 U1（close 不对称显式注释）· 档 S 备选通道留 20 裁定（4 件 2_1_1 系列补豁免）。

### R3 · 边界

S2 只新增（本 task 文件 + 30 执行留档 + 豁免清单 6 条数据行 · 既有档零改写）· **不签任何闸**（双 pending 待 00 翻转）· 闸行裁决（不设 HG-SCHEMA-CHANGE 三理由 + 升级条款）留 20 复核 · 硬约束 6（每条修严负向 fixture）· 硬约束 7（不追溯 = 新判据不翻旧案 · 豁免留痕非静默）· 硬约束 11（KPI 零触碰机检）· 硬约束 14（复跑数字入自检结论 tracked）· 硬约束 15（双闸落表 blocks_hats 含 30 / 20,30）· pins 钉面（pin-05/06 等）零触碰 · 禁 `git add -A` · 发布四动作仅人 · 判据改造与 K 断言翻向同 commit（F-W4-09）。

### R4 · 可测性

验收 13 条全机械可断言（命令 + fixture 路径 + 期望输出均落验收节）：六判据负向 fixture 全部先红后绿（红测先行面 = 填充顶包三件套+诚实边界对照 · 跨行翻向+跨段反向锁 · 词表五类 · 伪表行两构造 · 裸版本串 · 假授权+exempted 双向）· 存量波及复跑数字与评审文基线核对（89/63 · PASS 57+exempted 6+FAIL 25 · 词表 0/63 · 26/26 · 15/15 · 34/34）· 正例零回退五面 · helper 单源 grep 断言 · KPI 零 diff 断言 · pins 17/17 · task lint。唯一非纯机械点 = 复跑差异归因（若与评审文基线不符须逐件归因登记 · 机械化其留痕面）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待审查文落盘 + 00 代签 · 维护者 2026-09-16 授权模式）；双闸 pending 待 00 翻转；闸行裁决与档 S 备选通道留 20 复核；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | SPEC signed + 评审文 217 行定稿全文 + 基线全量复跑（773/145/772/0/1 · typecheck 0 · pins 17/17 · HEAD 9c895db）+ 现码行号逐条复核一致 + 6 件误伤名单落盘核实（文件名+slug 逐字）+ N5 现状在案 + 89=88+1 归因 | no |
| R1 | 范围 ①–⑧ + S5.1–S5.8 规格化 · 非范围 SPEC §4 全继承 + 本棒明示七条 | no |
| R2 | OQ-1 档 M / OQ-2 A1 强制+A2 可选 / OQ-3 字段对齐 / OQ-4 NG 观察名单采纳 · S_mid · 窄邻接 · pin-17 双层 · U1 helper 单源 · 档 S 备选通道留 20 | no |
| R3 | S2 只新增 · 不签闸 · 闸行裁决留 20 · 硬约束 6/7/11/14/15 · pins 钉面零触碰 · 禁裹挟 · 发布仅人 · 断言翻向同 commit | no |
| R4 | 验收 13 条全机械 · 红测先行面明示 · 存量复跑基线核对 · 正例零回退五面 · 差异归因留痕机械化 | no |
| R5 | 待 20 审 R1 裁定充分性 · 双闸待 00 翻转 · 闸行裁决+档 S 备选留 20 复核 | no |

**residual_risks**：① **R-① 成段伪造不防**（机械判据职责边界 · 缓解：invoke 留痕 + HG-AUDIT-R1 人签兜底 · F-W4-06 fixture 固化边界声明）；② **R-② 窄式对消费者仓排版的理论误伤**（恰在 不/未 后硬换行 · 本仓 0/284 · 缓解：误伤可枚举 + 豁免可留痕 · F-W4-07）；③ **R-③ A1 只锁形态不锁事实**（缓解：诚实边界注释 + S2 留痕 + 人审终局 + A2 可选强形态 · F-W4-08）；④ **20-task-audit 若改档 S**（豁免清单扩 4 件 2_1_1 系列 · 缓解：备选通道 S5.1 在案 · 档位裁定非范围违约）；⑤ **复跑数字与评审文基线漂移**（reviews 88→89 已归因 · 若 30 复跑出现枚举外差异 → STOP 回 20/00 · F-W0-05 同式基线重建纪律）；⑥ **verify --task done 面补消费 exempt 引入的文案/JSON 字段面对既有快照断言的影响**（OQ-3 实现细节 · 缓解：30 执行期盘点 + F-W2-13 同式登记纪律 · 字段命名对齐裸 verify）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 验收主体 = **机械锁全绿**（六判据负向 fixture + K 断言翻向配对锁 + 存量波及全量复跑登记 + 正例零回退五面 + helper 单源/KPI 零 diff grep 断言 + pins 17/17 · 命令与判据见验收节），辅以：① **红测先行**（每条修严 fixture 修复前真红留证 · 修复后转绿 · 硬约束 6）；② 每 commit 前后 `npm test` 同绿（基线 773/145/772/0/1 · 环境红按 F-W0-07 同式对照实验先行定性）；③ 既有面回归（cli-w4-gate-wiring 系 / pins-consistency 系 / cli-g1g7 / cli-json-no-abs-path · 登记项逐条列明 · F-W2-13 同式纪律）；④ 判据改造与 K 断言翻向同 commit（F-W4-09 硬锁）；⑤ duration 加性克制（基线 ≈94s）。**本波是判据修严波（机械→语义边界）· 红绿纪律 = 每条修严负向 fixture 先行 · 存量波及豁免留痕兜住 · 正例五面零回退。**

---

## 提交信息约定

- `feat(3.0-W4): NEW-5 结论闸语义化（档 M 组合判 VERB∧SUBJ∧(OBJ∨GATE) · 6 件存量波及入豁免留痕 · 负向 fixture）`
- `fix(3.0-W4): R-5 跨行否定封堵（窄邻接式 · K 断言翻向 exit 0→2 + 跨段反向锁 · 同 commit）`
- `feat(3.0-W4): NEW-11 否定词表广义化（五类新增 · 残余显式登记 · NG 观察名单不入首批）`
- `feat(3.0-W4): pin-17 表行语义判 + pin-08 发布态绑定（cells[0] 主键列 + 表头签名 / S_mid 同格共现 · yaml semantics 数据声明）`
- `feat(3.0-W4): NEW-10 exempt A1 真实性 + U1 口径统一（helper 单源 · verify --task done 面补消费 · close 不对称注释）`
- `test(3.0-W4): 对抗 fixture 组 + 存量波及复跑登记（评审文基线核对）`
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界（F-W4-10）
- **禁 tag / push / publish / deprecate（仅人 · 无代跑授权）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w4_semantic_criteria.md`

---

### 自检结论（执行者）

**30 全四阶段收官回填 · 2026-09-17 · 基线 HEAD 0eb6cd7 → 终态 3640a67+45569ec+b7b3cce+89d89d6**

**GATE_VERIFY（第 0 步首输出）**：`node bin/specgate.js verify --target . --task <本 task>` → 闸扫描表 HG-TASK-DRAFT approved · HG-AUDIT-R1 approved · **VERIFY: PASS**（exit 0 · 双闸真值以人工闸表为准）。波末 `gate-check` exit 0 · `task lint` PASS。

**阶段锁计数（纯加性 · 每阶段前后同绿）**：773/145/772/0/1（基线）→ 782/147/781/0/1（阶段一 +9 测/2 套件）→ 784/148/783/0/1（阶段二 +2 测/1 套件 · K 原地翻向不计数）→ 790/149/789/0/1（阶段三 +6 测/1 套件）→ **794/150/793/0/1**（阶段四 +4 测/1 套件）· 零意外红 · 零回退。

**验收 13 条逐项**：
- **#1 NEW-5 档 M 红转绿** ✓（填充顶包三件套修复前真红 substance=31/34/49 漏网 → 修复后 exit 2 点名缺 SUBJ/缺 OBJ∨GATE · 诚实边界对照 PASS · 「通过\n」地板 FAIL 零回退）
- **#2 存量波及 + 豁免留痕** ✓（88 基线集复跑 PASS 57 · FAIL 31=25 旧+6 新 · 误伤恰枚举 6 件无第 7 件 · 6 条豁免四字段齐入清单 · 裸 verify 由 gap 转 exempted · A3 口径：评审文自身非消费形态单列）
- **#3 正例零回退五面** ✓（57/63 直接过 · 词表 0/63 · pin-17 26/26 · pin-08 15/15 · exempt 40/40（34 旧+6 新 A1 全过 invalid 0））
- **#4 评审文 + 边界声明** ✓（评审文 tracked 在案 · §1 判据两分声明 + 本 task 背景节/非范围首行双重声明 · S5.8 机检落地）
- **#5 R-5 + K 断言配对** ✓（窄邻接式入 NEG_RE · K 断言同 fixture exit 0→2 翻向 + 跨段反向锁新增 · 判据与断言同 commit 45569ec 单 commit 含两侧 diff · 285 份 md 窄式 0 命中 · 行尾 不/未 0 行）
- **#6 平台锁** ✓（typecheck 0 错 · npm test 793/794 全绿 · build exit 0 · test:lib 6/6 · pins 17/17 · 依赖零新增：dependencies 仍仅 js-yaml · lock 非 dev 顶层=2）
- **#7 判据两分边界防御** ✓（四阶段 `git diff | grep -i kpi` 均零命中 · close_kpi 零变更 · 非范围表防御条在案）
- **#8 pin-17 语义判 fixture** ✓（非签名表注入/签名表第二格注入双构造修复前真红 → 修复后 exit 2 · 全表誊抄诚实边界 fixture 注释登记 · 26/26 零回退 pins 兜住）
- **#9 pin-08 绑定 fixture** ✓（裸版本串/不同格两构造修复前 ok 真红 → 修复后 mismatch 点名无发布态措辞 · S_mid 集+S_narrow 弃用理由入 yaml semantics · 15/15 零误伤）
- **#10 NEW-10 A1 + U1** ✓（假授权四形态修复前全豁免真红 → 修复后 invalid warn 不豁免 · 40/40 零误伤 · done 面双向 fixture（有豁免 exempted 留痕含 JSON 键 · 无豁免 warn 维持）· helper 单源 grep 断言咬死（src 内无第二份 Map.get 拷贝）· close 不对称显式注释在案 close-guards.ts evalCloseReview 头注释）
- **#11 既有面零意外改动** ✓（登记面逐条列下 · 此外既有断言零改动全绿）
- **#12 结构闸** ✓（task lint PASS · gate-check exit 0）
- **#13 执行粒度** ✓（四 commit 逐文件显式 add 无 -A · 每 commit 前后 npm test 同绿 · 未 tag/push/publish/deprecate · 波末 task close 待 40 复核后 00 口径）

**F-W2-13 既有面登记清单（全波汇总）**：① 阶段一：对照 fixture 重锚 30 处/15 文件（标准合规 fixture 补 OBJ 锚词「范围与验收」）+ 阈值边界探针恰 20 侧重锚等长语义合规文本 + 否定 detail 括注扩列 + 词集注释；② 阶段二：K 断言翻向 + review-gates.ts:129 R-5 句封板；③ 阶段三：W2-B7/B10 脱表补行重锚表内插入 + pins-consistency:1311 A2 断言随 semantics 改写同 commit 更新 + sha256.manifest 随 release-pins.yaml 联动重建（循 W3 先例）；④ 阶段四：A1 四处豁免 fixture 重锚（w4l_ok / meta_slug_x / N13「"00"」语义有意反转 + 注释 / bare_gap）+ N13 类型面绿径改由 A1 合规形态承载。

**N5 口径登记（范围⑦ · 零行为变更）**：`assets manifest rebuild` 追认语义在 provenance 未启用前提下**不封堵**（REBUILD_WARN 警示文案 cli-assets.ts:86-90 在案复核 · 快照断言锁文案零触碰）· 本波仅口径标注 · 若日后动归 W7 对外口径。

**豁免 24 条留痕面**：裸 verify 真仓 exit 0 · 豁免命中留痕 24 条（18 旧 + 6 新 NEW-5）· invalid 0 · loader 收编 reviews 24 + invoke_hats 16。

**偏差登记（全波 5 条）**：① fixture ③ 闸例 HG-AUDIT-R1→HG-SPEC-SIGNOFF（AUDIT 词素 i 旗标命中 SUBJ 集 · 判定意图不变）；② NEW-11 'does not pass' 系 2.4.2 R-2 既有覆盖非红转绿面；③ NEG_RE 笔误 `doesn['’]\s*pass` 漏 t 被红测咬住即修；④ R-5 前缀形态 (予|以)? 增补 (予以?|以)?（底稿不覆盖「未\n予以通过」· 三性质不变 · 00 验收登记成立）；⑤ pin-17 cellForm slice(6) off-by-one（\|\s* 实 5 字符）被 failClosed 咬出一拍即修为 anchor.length。另：阶段四 emitJson 闭包引用后置 const 致 TDZ 运行红（5 套件 --json 面咬住）→ exempted 声明前置即修（登记为实现笔误 · 测试网实效）。

**已知未测项/挂账（残余显式登记）**：R-① 成段伪造审查行为不防（invoke 留痕 + HG-AUDIT-R1 人签兜底 · fixture 固化边界）· R-② 窄式对消费者仓「恰在 不/未 后硬换行」排版理论误伤（本仓 0/285 · 误伤可枚举+豁免可留痕通道）· R-③ A1 只锁形态不锁事实（诚实边界注释在案 · A2 可选强形态登记入 yaml 头注释）· \bNG\b 观察名单（OQ-4 · 若日后入限结论节作用域）。

**过程留痕**：`docs/harness/invokes/by-task/3-0-w4-semantic-criteria/invoke_20260917_30_3-0-w4-semantic-criteria.md`（四阶段红绿证据全谱）。

**KPI 自评备料（待 00 裁定 · 照 kpi_rubric KPI_RUBRIC_v1_2 存在性口径 · 本波硬约束 11 不补语义闸）**：六判据范围①–⑦全销（⑧评审文硬前置起草期已销）· 验收 13 条全机械自证 ✓ · 硬约束 6（每条修严负向 fixture 红测先行）/7（不追溯 · 误伤 6 件豁免留痕）/11（KPI 零触碰四阶段机检）/14（复跑数字全入本节 tracked）/15（双闸落表机检咬住）逐项兑现 · advisory A1–A4 全落地（A1 四处重锚同 commit · A2 断言同 commit · A3 口径写明 · A4 援引以闸对象论为准）。

### KPI（00）

（00 收官裁定回填 · rubric `KPI_RUBRIC_v1_2` · close_kpi 只验存在性 —— 本波硬约束 11：不补语义闸 · KPI 判据零触碰）
