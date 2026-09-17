# 审查文：task_3_0_w4_semantic_criteria · R1（20-task-audit）

> **hat_id**：20-task-audit · **轮次**：R1 · **日期**：2026-09-17  
> **审查对象**：`docs/tasks/active/task_3_0_w4_semantic_criteria.md`（3.0 W4 防伪判据语义化 · HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1=pending）  
> **对照真值**：SPEC `docs/spec/3_0-architecture-leap/05_w4_semantic_criteria_v1.md`（signed · 范围 ①–⑧ · 验收 1–6 · F-W4-01–05）· 设计真值 `docs/harness/reviews/w4_semantic_criteria_review_20260917.md`（217 行 · 六判据形态定稿 + 存量全量实测 + OQ-1–OQ-4 + 残余 R-①②③）· PLAN `PLAN_3_0_architecture_leap_v1_zh.md` W4 节（:259-272）+ 硬约束 6/7/11/14/15（:335,:336,:340,:343,:344）· 格式先例 `task_3_0_w3_ontology_graph_audit_R1_20260917.md`  
> **审查性质**：书面审查 + 独立复核实测（含结论闸探针全量复刻复跑）；**未改** task / SPEC / PLAN / src / test / fixtures / yaml 实质内容；**不代签** HG-AUDIT-R1（归 00 代签）

---

## 一、结论摘要

| 维度 | 结论 |
|------|------|
| **内容**（可执行性 / 与 SPEC+评审文+PLAN 一致性） | **PASS-with-issues**：blocking **0** · advisory **4**（A1 NEW-10 A1 将咬 4 处既有豁免 fixture 未列登记面 · A2 pins-consistency :1311 断言 pin-08 semantics「规划中」旧句与 S5.5 改写硬耦合 · A3 验收 #2 算术口径 89 vs 88 注记 · A4 闸行裁决理由①类比标注小疵；均不阻塞签闸） |
| **流程闸** HG-AUDIT-R1 | **pending**（真值以 task `### 人工闸` 表为准）；本审查文落盘即满足「20 审查文落盘」前置，签署归 **00 代签**（维护者 2026-09-16 授权模式），**pending 期间 30 拒改码**（本审机检实测：`task lint` PASS ✓ · `gate-check` exit 2 ❌ 拒 30 ✓ · `verify` 首输出闸扫描表 + `VERIFY: BLOCKED · HG-AUDIT-R1 pending` exit 2 ✓） |
| 思考轮 R0–R5 | 控制表填全（六轮 early_stop 全 no · residual_risks 六条每条带缓解 · ④ 明示「20 审若改档 S」通道 —— 本审裁定**维持档 M**，见重点 1）· R5 待本轮裁定——**本轮裁定：充分** |

---

## 二、常规核对（对照 SPEC / 评审文 / PLAN / 硬约束逐项）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 ①–⑧ 与 SPEC §3 | ✅ 逐项对应且规格化 | ① NEW-5→S5.1（档 M 组合判+词集单点+四 fixture+6 件豁免表）· ② R-5→S5.2（窄邻接+K 翻向+跨段反向锁+2.4.2 注释登记）· ③ NEW-11→S5.3（五类+残余四类登记+0/63 回归锁）· ④ NEW-4→S5.4（cells[0] 主键列+表头签名双判）· ⑤ pin-08→S5.5（S_mid 同格共现+S_narrow 弃用登记）· ⑥ NEW-10→S5.6（A1 三元判+A2 可选+U1 四面）· ⑦ N5→S5.7（零行为变更）· ⑧ 评审文已销（落盘在案）——评审文定稿形态逐字继承，无自创 |
| 非范围与 SPEC §4 | ✅ 全继承 + 合规增益 | SPEC 六条全在（KPI 语义化为首行防御条 · R-2/R-3/R-4 · 结论节存在性 · 豁免机制存在性 · 不追溯 · RUBRIC 引而不随包）+ 本棒明示八条（NG 首批不入 · A2 不强制/A3 弃选 · 宽窗口不引 · U2/U3 弃选 · KPI 零触碰 · 词表不承诺完备 · 动 S2 既有档 · 新依赖 · 发布四动作）——与评审文 §3.1/§3.3/§6/§8 弃选在案项一一对应，无扩权 |
| 验收标准与 SPEC §7 | ✅ 1–6 全覆盖 + 机械化加强 | #1/#8/#9/#10↔验收 1（五面负向 fixture 红转绿）· #2↔2（存量波及复跑+豁免留痕四字段+exempted 留痕）· #3↔3（正例零回退五面 57/63+0/63+26/26+15/15+34/34）· #4↔4（评审文+边界声明双重在案）· #5↔5（K 断言配对更新+同 commit 硬锁）· #6↔6（typecheck+全绿+pins 17/17+依赖零新增）；新增 #7（KPI 零 diff 机检 · F-W4-05 兑现面）/#11（F-W2-13 登记纪律）/#12（task lint）/#13（执行粒度）为加强项，命令+fixture+期望输出全落验收节 |
| failure_paths 与 SPEC §8 | ✅ F-W4-01–05 全继承 | 逐条对应且行为列更具体；新增 F-W4-06–11（成段伪造 R-① · 窄式理论误伤 R-② · A1 形态不锁事实 R-③ · K 断言顺序 · 裹挟 · 越权发布）逐条必要——06–08 正是评审文残余 R-①②③ 的 task 面兑现，09 是 SPEC residual_risks ③ 的硬锁面 |
| 依赖 / 必读列表 | ✅ 充分 | 评审文全文+SPEC+PLAN W4/硬约束+现码行号（本审抽核 30+ 处全中 · 见下）+资产锚点+既有测试面+done 先例（task_2_3_1_patch N11 豁免先例实证在案）+RELEASING；**唯**既有测试面漏列 4 处豁免 fixture + 1 处 pin-08 semantics 断言耦合（见 advisory A1/A2） |
| 思考轮控制表 R0–R5 | ✅ 填全 | R0 含基线全量复跑+行号逐条复核+6 件误伤名单落盘核实（本审全部独立复现 · 见下）；R1–R3 闭合；R4 验收 13 条全机械+红测先行面明示+差异归因留痕机械化；R5 待本轮（裁定充分） |
| `### 人工闸` 表可机检性（硬约束 15） | ✅ | 闸表在 `### 人工闸` 节；本审实测 `npx spec-wave gate-check --task …` 渲染两闸行（HG-TASK-DRAFT approved / HG-AUDIT-R1 pending → ❌ 拒 30 · **exit 2**）· `verify --target . --task …` 首输出闸扫描表 + `VERIFY: BLOCKED · HG-AUDIT-R1 pending`（**exit 2**）· `task lint` PASS（W3 占位符 warn 属 draft 期合法）；不设 HG-SCHEMA-CHANGE 行的裁决见重点 2 |
| test_strategy 与硬约束 6（修严配负向 fixture） | ✅ 适配正确 | 本波全修严型：六判据负向 fixture 面全列（填充顶包三件套+诚实边界对照 · 跨行翻向+跨段反向锁 · 词表五类 · 伪表行两构造+誊抄边界 · 裸版本串 · 假授权+exempted 双向）+ 红测先行写进测试策略节 + 存量波及豁免留痕兜住 + 正例五面零回退 |
| 硬约束 7/11/14/15 落位 | ✅ | #7：不追溯=新判据不翻旧案 · 6 件入豁免留痕非静默（循 N11 先例实证）；#11：判据两分边界声明双落（背景节+非范围首行）+ S5.8 零触碰机检入验收 #7；#14：复跑数字入自检结论（评审文证据全 tracked）；#15：双闸落表 blocks_hats 含 30/20,30 且机检咬住（上行实测） |
| 基线节数字独立复跑 | ✅ 全中 | 本审复跑（HEAD `9c895db` ✓ · 工作区 untracked = 评审文+本 task 2 件 ✓ 与声称一致）：`npm test` **773 tests / 145 suites / 772 pass / 0 fail / 1 skip**（duration 100.5s · 基线 ≈94s 机差量级）· `npm run typecheck` **0 错** · `node bin/specgate.js pins check` **17/17 PASS**（pin-17 现值「13 宿主校验 · 13 双语命中」✓）· dependencies = 仅 `js-yaml` ✓ · lock 非 dev 顶层 = **2**（argparse · js-yaml）✓ · 其上 `2b3c60c`/`0ef6741` = W3 收官 ✓ · W3 done 锁终态（773/145/772/0/1）交叉一致 |
| **评审文实测数字独立复刻复跑**（本审探针 · evalReviewConclusion 逐行复刻自 :134-175 现码） | ✅ 逐字一致 | reviews 全量 **89** 件（88 tracked + 评审文自身 untracked · 预期差 1 ✓）；对 88 基线集复跑：**PASS 63 / FAIL 25**（无结论节 **15** · 否定命中 **3** · 无通过词 **7** · 内容量不足 **0**）逐字一致 ✓；词集命中率：**VERB 63/63 · SUBJ 57/63 · OBJ 59/63 · GATE 61/63** 与评审文 §2.2 全中 ✓；**档 M 误伤恰 6 件**、**档 S 误伤恰 10 件**（=6+4 件 2_1_1 系列）与 §2.3 枚举个案逐字一致 ✓；NEW-11 五类新增形态对 63 合规结论节误伤 **0/63** ✓；284 份 tracked md（88+78+95+23 分目录实测=284 ✓）：窄邻接式 **0 命中** · 行尾 不/未 **0 行** · 宽窗口 **1 例误中** = `08_w7_closeout_external_v1.md:85` 逐字一致 ✓；K fixture 形态「不\n通过式」落窄式=true · 跨段「不\n\n通过」落窄式=false（反向锁语义成立）✓；NEW-11 语料普查（不通过 5 · 未通过 6 · 不予通过 1 · 不 通过 2 · 不签收 1 · not pass 4 · reject* 21）逐字一致 ✓ |
| spec 索引行 / 双 README 表实测 | ✅ 全中 | `docs/spec/README.md`：表 L7-L26 · 数据行 **18**（L9–L26）✓ · 状态格含点式串 **15** ✓ · S_mid 不合规 **0/15** ✓ · S_narrow 不合规 **1/15** = L10「CLOSED（1.12.0+1.12.1）」✓ · 当前版本行 L23「2.4.2 published」✓；双 README 各解析 **10 表** ✓ · 宿主签名表各恰 **1 张**（README.md:24-38 / README.zh-CN.md:24-38 · 首表头格「Host」/「宿主」· 各 13 数据行）✓ · 13 宿主词锚全部落 cells[0]（26/26 · pins 17/17 兜住交叉一致）✓ |
| 现码行号抽核（30+ 处 · 2026-09-17 现值） | ✅ 全中 | `review-gates.ts`（REVIEW_SECTION_HEAD_RE :134 ✓ · PASS_RE :135 ✓ · NEG_RE :136 ✓ · MIN_SUBSTANCE 注释 :137-140 ✓ · 常量区 :134-141 ✓ · 2.4.2 R-2 口径注释 :126-133 含 :129「窗口显式排除 `\n` → R-5…K 断言钉死」逐字在案 ✓ · evalReviewConclusion :143-175 ✓ 判定链四序与 S5.1 描述一致 ✓ · findLatestReview :95-114 ✓ · 文件名口径 RE :99 ✓）· `exempt.ts`（REL :9 ✓ · loader :18-54 ✓ · 显式类型判 :40-44 ✓ · invalid 面 :42 ✓ · normalizeSlug 双侧归一 :45 ✓）· `close-guards.ts`（evalCloseInvokeHats :76-88 ✓ · evalCloseReview :90-108 ✓ · 头注释 :90-91 含「close 天然只闸新关账不追溯存量 · D-23-W4-TRANSITION」✓）· `cli-pins.ts`（pin-08 :217-266 ✓ · 分工注释「发布态归 pin-10」:221 ✓ · dottedExactRe :230-232 ✓ · 切格 :238 ✓ · pin-17 :382-477 ✓ · TABLE_ROW_RE/hitInTableRow :419-428 ✓）· `verify.ts`（裸 verify exempt 消费 :144,157-170 ✓ · --task 存在性闸 :319-324 ✓ · 结论面 :332-353 ✓ · done warn 降级 :343-347 ✓）· `cli-task-extra.ts`（lint-done :100-127 ✓）· `cli-shared.ts`（normalizeSlug :321-323 仅下划线→连字符 ✓）· `cli-assets.ts`（N5 REBUILD_WARN :86-90 ✓）· `release-pins.yaml`（pin-08 :60-82 · semantics :66-78 ✓ · pin-17 :173-212 · semantics :178-187 ✓ · known_gaps :212 ✓ · D-23-W2-CHECK-FORM「语义/映射/豁免全入数据」注释 :64-65/:177 在案 ✓）· `legacy-gate-exempt.yaml`（147 行 ✓ · 头注释四字段纪律 :1-6 ✓ · reviews 节 :9- ✓ · 实测 reviews 18 + invoke_hats 16 = 34 条 ✓ · authorized_by 34/34 同构「00（2026-09-12 维护者会话授权）」✓）· `cli-w4-gate-wiring.test.ts`（对照零回退 :668-691 ✓ · K 断言 :693-701 逐字「维持 PASS 漏网 · 防顺手修」✓ · N13 :704+ ✓）· PLAN 锚点（W4 节 :259-272 ✓ · 硬约束 6/7/11/14/15 = :335/:336/:340/:343/:344 ✓） |
| 行为变更类「旧测 grep 影响面」提醒（K7） | ⚠️ 部分覆盖 → advisory A1/A2 | S5.6 兜底通道「exempt.ts:42 同通道」+ 验收 #11 登记纪律在案；但本审独立 grep 发现 **4 处既有豁免 fixture 断言「豁免命中」所用 authorized_by 形态过不了 A1**（`00（fixture）` ×3 + `"00"` ×1）+ **1 处 pin-08 semantics 文案断言**与 S5.5 改写硬耦合 —— 均未列入验收 #11 预期登记面（详见证清单） |
| W0–W3 前置兑现 | ✅ | W3 done（三闸 approved · 锁终态 773/145/772/0/1 与本审复跑逐字一致）· 评审文落盘（D-24-W2-REVIEW-FIRST 循例兑现 · SPEC 范围⑧已销）· 2.4.2 对账在案（R-2/R-3/R-4 已交付 · 现码 :136/:129 注释实证） |

**常规核对结论：无 blocking。** 唯一系统性缺口 = 既有断言面盘点漏项（A1/A2），均有 fail-closed 机械兜底（npm test 全绿硬条 + F-W2-13 登记纪律），不阻塞签闸。

---

## 三、五条重点逐条结论（10-task 留下 · 含本审独立复核证据）

### 重点 1 · 档位裁定（OQ-1 档 M 采纳 · 档 S 备选通道在案）——✅ 裁定：**维持档 M** · 改档不属范围违约的定性成立

- **误伤枚举独立复现**：本审探针（evalReviewConclusion 逐行复刻现码 + 档 M/S 词集按评审文 §2.2 重组）对 88 件基线集全量复跑 —— 档 M 误伤**恰 6 件**（`task_00_default_behavior_kit_1_7_1_audit_R1_ACCEPT` + `task_2_4_gate_strength_w{1,3,4,5,6}_*` 五件）· 档 S 误伤**恰 10 件**（多出的 4 件 = `task_2_1_1_host_tools_ux_w{1,2,3,4}_*` 逐字命中）—— 与评审文 §2.3 表枚举个案**逐字一致**，非估算；
- **误伤形态抽核属实**：item 1 结论节「ACCEPT。范围限于 prompts 入包 + 版本钉；无 CLI 行为变更…」VERB=ACCEPT 有 · SUBJ（审查行为词）缺 → 档 M 误伤成立 ✓；item 2（w1-pins-extract）结论节「W1 结论：PASS · 零内容阻塞，与总审文 §4…一致」同形态（GATE/OBJ 有「闸/§4」· SUBJ 缺）✓；
- **维持档 M 的裁定理由**：① 档 S 多伤的 4 件 2_1_1 系列结论是「维度表形态」合法审查结论（内容审查|流程闸 表格 · 无对象锚词属文书风格而非缺陷），边际强度增量（OBJ 由可选升为必需）不抵 4 件留痕成本；② 档 L 把 SUBJ 降为可选（EVID 词集如 § / L\d+ 易被引用性文本顺带命中）直接削弱防伪核心维度，评审文拒 L 理由成立；③ 档 M 误伤 6 件全部形态同构、留痕路径（N11 先例）实证可行（34 条存量豁免机制在案）；④ VERB 沿用不扩（63/63）+ substance≥20 地板保留 = 双保险，防伪强度/误伤成本比最优；
- **改档定性**：SPEC §5.1 明示「具体形态集合与误伤档位由评审文据存量合规率实测定夺」+ 评审文 OQ-1 明授「20-task-audit 据 §2.3 表定夺；若改 S，4 件 2_1_1 系列补入豁免清单」—— 档位定夺权在流程内被显式让渡给本帽，task 内置档 S 备选通道（S5.1 末段）与该让渡逐字对齐 ⇒ **改档确属档位裁定、不算范围违约**的定性成立。本审不行使改档：**档 M 定夺维持**。

### 重点 2 · 闸行裁决（W4 不设 HG-SCHEMA-CHANGE · 三理由 + 升级条款）——✅ 裁决成立 · 与 W2/W3 先例边界一致（理由①类比标注小疵 advisory A4）

- **理由①（semantics 字段内文案更新 = 数据面）成立**：本审实证 `release-pins.yaml` pin-08 :64-65 / pin-17 :177 注释「D-23-W2-CHECK-FORM · 语义/映射/豁免全入数据 · 提取语义作为数据声明（非硬编码）」—— semantics 字段自 2.3-W2 起即既定数据面；S5.4/S5.5 的改动 = 该字段**值内文案**更新（键形态与字段集零变更）；硬约束 3 的闸对象 = schema（**结构格式**）变更，格式未变即闸不触发 ✓。与 W2 理由②「内置表 v1→v2 = 按已批准 schema 写数据」同构（W4 文自引「类比 W3 闸行裁决②」—— W3② 实为「缺陷修复既定处置」论，标注小疵落 advisory A4；operative 论据自足，结论不变）；
- **理由②（豁免增 6 条 = 既有列表增数据行）成立**：`legacy-gate-exempt.yaml` reviews 节为既有列表结构（本审实测 18 条 · 四字段格式），增 6 条数据行键形态零变更；**N11 先例实证在案**（现清单 :51-80 八条 2.3.1 N11 豁免条目 reason 均引「接线前合法 · task_2_3_1_patch 抽验核因」· spec README L20 索引行「存量 8 份循 W4 先例豁免」交叉一致）—— 非首创通道 ✓；
- **理由③（判据语义变更的人闸通道 = 评审先行 + HG-AUDIT-R1）成立**：判据语义变更落在 **src 代码行为面**（review-gates/cli-pins/exempt 判据加强），本就不属硬约束 3 的 schema 闸对象；其专属人闸通道由 SPEC 头部明定（「判据语义变更 = 闸行为变更 · 先出评审文落盘再动手 · 循 D-24-W2-REVIEW-FIRST」）—— 评审文已落盘（范围⑧已销）+ 本 task 双闸在表（HG-TASK-DRAFT / HG-AUDIT-R1 blocks 30）⇒ 人闸通道完整闭合，无逃逸面 ✓；
- **边界对照 W2/W3 两先例**：三波裁决共享同一 operative 原则（闸对象限定为**结构格式**变更 · 已批准结构内的数据行/数据文案变更不触发）；W2 附「新 artifact 自有格式」类比注记、W3 附同型注记 —— W4 未依赖该类比（理由①②均为数据面原则直引），先例边界内**最干净**的一例；
- **升级条款（STOP 兜底）足够**：触发条件客观可判（exempt 条目增字段 / release-pins 增 extract 子键 / 词表外置数据文件 —— 全是 yaml 键结构变动 · 30 执行期可机械自判）· 通道明确（STOP → 评审文 → HG-SCHEMA-CHANGE 式人闸 → 才改码）· 与硬约束 3 顺序兼容。**本审不判定须补闸行**。

### 重点 3 · K 断言解锁顺序（判据改造与断言翻向同 commit 硬锁）——✅ 验收 #5 表达充分 · 三重落点闭合

- **同 commit 硬锁三面落位**：S5.2 标题行「解锁顺序硬锁 · 判据改造与断言翻向同 commit」+ 验收 #5「git log 单 commit 含两侧 diff 证明」+ F-W4-09「分批提交致新旧断言并存 → 打回」+ 提交信息约定 `fix(3.0-W4): R-5…（…同 commit）` —— 若分两步，中间态 = 新判据已封堵 + 旧 K 断言仍断言「维持 PASS 漏网」→ npm test 必红（机械咬死），矛盾断言窗不可存活 ⇒ 表达充分 ✓；
- **配对替换不留过时断言**：S5.2-2「两断言配对替换原 K 断言 · 不留过时断言（SPEC residual_risks ③）」—— 本审实证原 K 断言 :693-701 语义（「不\n通过式」+ 实质内容 → exit 0 / VERIFY: PASS · 防顺手修钉死），翻向后同 fixture exit 0→2 即「修复后转绿」回归锁语义成立；跨段反向锁（不\n\n通过 维持 PASS）把 08_w7:85 误中案例固化为禁改宽锁 —— 本审探针实证「跨段形态不落窄式」（false）· 「K fixture 形态落窄式」（true），两断言的判定方向均有实测支撑 ✓；
- **2.4.2 原锁定语义的同步更新登记明确**：S5.2-3 点名 `review-gates.ts:126-133` 注释（本审实证 :129「窗口显式排除 `\n` → R-5 换行形态维持已登记残余不动（归 3.0 · K 断言钉死）」逐字在案）改为已封堵口径 + 入验收 #11 既有面登记清单 —— 原「防顺手修」锁定语义的注销路径显式，不会留「注释说维持、判据已封堵」的第二矛盾面 ✓。

### 重点 4 · U1 口径统一（分叉四面 · 双向 fixture · close 不对称显式注释）——✅ 分叉统一真闭环 · OQ-3 落

- **抽共同 helper 的具体面明确**：S5.6-1 点名两存量消费面（裸 verify `verify.ts:157-170` · lint-done `cli-task-extra.ts:102-127`）+ helper 职责（slug → exempt 条目解析 + invalid 留痕回显）+ 验收 #10「helper 单源 grep 断言（src 内无第二份 slug→条目解析拷贝）」—— 本审实证两面当前各自实现 slug 归一查找（verify.ts:168 `exempt.reviews.get(normalizeSlug(slug))` · cli-task-extra.ts:124 双键兜底），抽单源后 grep 断言可机械咬死 ✓；
- **verify --task done 面双向 fixture 闭环**：有豁免 → exempted 留痕（不再 warn）· 无豁免 → 维持 D-23-W4-TRANSITION warn 不挡 —— 双向各一件 fixture 钉死（验收 #10），现状面（:343-347 warn 降级分支）本审实证在案 ✓；**OQ-3 字段命名对齐落**：裸 verify 面变量名 `exempted`（:149 实证）· --task 面现用 `waived`（:325 实证）· S5.6-2 明示「字段命名 waived/exempted 与裸 verify 对齐」—— 对齐方向（向 `exempted` 看齐）有据可依，实现细节归 30，OQ-3 口径不空泛 ✓；
- **close 不消费的显式不对称注释落点明确且必要**：本审实证 `close-guards.ts:90-91` 头注释现已有「close 天然只闸新关账不追溯存量 · D-23-W4-TRANSITION」半句，但**无**「不消费 exempt = 设计性不对称非缺陷 · 杜绝顺手补消费」的显式句 —— S5.6-3 要求补写正是对症（U2/U3 弃选理由在评审文 §6.2 在案：U2 豁免反噬 · U3 34 条瞬间全红违反不追溯）；注释落点、措辞意图、弃选在案三者齐 ⇒ 闭环 ✓；
- **残余风险⑥（补消费引入的字段面对既有快照断言影响）登记在案**：本审 grep 复核 --task done warn 降级文案断言面小（temp fixture 自种子 · 无真仓快照耦合），F-W2-13 登记纪律兜住 ✓。

### 重点 5 · 豁免清单合规性（6 件循 N11 先例）——✅ 逐件核实全中 · 自咬链条自洽（机械网闭合）

- **逐件核实（6/6）**：reviews 文件名六件全部存在且与 S5.1 表逐字一致（`task_00_default_behavior_kit_1_7_1_audit_R1_ACCEPT.md` + `task_2_4_gate_strength_w{1,3,4,5,6}_*_audit_R1_20260914.md`）· 对应 done task 六件 meta `task_slug` 逐字 = 豁免 slug 连字符原形（`00-default-behavior-kit-1-7-1` / `2-4-gate-strength-w{1,3,4,5,6}-*`）—— **normalizeSlug 命中实证**：loader `exempt.ts:45` 存键前归一、消费面 `verify.ts:168` 查键前归一，双侧同函数归一 ⇒ 连字符原形直填即命中（下划线形态亦等价命中，连字符与 meta 原形一致更直读）✓；
- **四字段齐 + 显式类型判兜底**：`exempt.ts:40-44` nonEmpty typeof 判在案（本审实证）；建议 authorized_by 形态「00（2026-09-16 维护者双签授权 00 代签）」以数字起首但含全角字符 ⇒ YAML 解析为字符串（存量 34 条同构形态 34/34 加载成功实证）· 未加引号亦不触 N13 falsy 陷阱 ✓；
- **authorized_by 过 A1 三元判（本审逐元验证）**：① 非空身份段「00」（全角括号前非空 ✓）∧ ② 全角括号内 ISO 日期「（2026-09-16 …）」✓ ∧ ③ 出处关键词「授权」✓ —— 三元齐；reason 引评审文 §2.3/§7 + 各件形态句的底稿要求在案（S5.1 表 + :108）· date = 30 执行日 · 不追溯语义（新判据不翻旧案 · 豁免留痕非静默放过）✓；
- **自咬链条核验（6 件新豁免 vs NEW-10 A1）—— 自洽且机械网闭合**：若 6 件 authorized_by 形态不合 A1 → loader 入 invalid **不豁免** → NEW-5 上线后该 6 件结论节 FAIL → 裸 verify 仓级扫描转为 **gap**（非 exempted）→ 三重机械网咬住：① 验收 #2 硬条「裸 verify 输出该 6 件由 gap 转 **exempted** 留痕」直接失败；② `test:lib` S2（`cli-lib-smoke.test.ts:61-66` 对**真仓**跑裸 verify 断言 exit 0 + /豁免命中留痕/）转红（prepublishOnly 链路含 test:lib）；③ 30 每 commit npm test 同绿纪律 + F-W4-04 全量复跑通道。链条每一环都有 fail-closed 判据 · 无静默面 ⇒ **自咬不可能静默通过**，且 task 把「authorized_by 须过 A1 形态判（S5.6 · 建议形态…三元齐）」写死在 S5.1 :108 —— 规格面已预防 · 机检面三道兜住 · 链条自洽 ✓；
- **附**：6 件入库与 NEW-5 判据改造同 commit（提交信息约定首行实证）⇒ 不存在「判据已上线而豁免未入库」的中间红窗 ✓。

---

## 四、发现清单

### Blocking（0 条）

无。

### Advisory（4 条 · 均不阻塞签闸 · 30 执行时落实或自检登记 · 无需改 task）

| # | 级别 | 内容 | 建议落点 |
|---|------|------|----------|
| A1 | 登记级 | **NEW-10 A1 将咬 4 处既有豁免 fixture，未列入验收 #11 预期登记面**：① `test/cli-w4-gate-wiring.test.ts:304-320`（2.3-W4 四字段齐 → 豁免命中 PASS · authorized_by `00（fixture）` · A1 ②③ 不合）；② 同文件 :336-352（N14 meta slug 豁免命中 · 同形态）；③ 同文件 :720-733（N13 · `authorized_by: "00"` → 豁免命中 —— 该断言语义被 A1 **有意反转**：裸名/裸号今后即假授权形态 · NEW-10 负向 fixture ① `张三` 恰为此类）；④ `test/cli-verify-spec.test.ts:231-247`（bare verify 豁免命中 · `00（fixture）`）。A1  loader 上线后四件**必红**（机械断言 npm test 全绿硬条 · 无法静默滑过） | 30 执行期：四件 fixture 的 authorized_by 重锚为 A1 合规形态（如 `00（2026-09-13 fixture 授权）` · 保持 quoted 数字起首以续测 N13 类型面）· 与 NEW-10 loader 改动**同 commit** · 逐条入 F-W2-13 登记清单；N13 未加引号 `00` → invalid 半段保留不动（类型判层仍在 A1 之先/并列） |
| A2 | 登记级 | `test/pins-consistency.test.ts:1301-1311` 断言真仓 pin-08 semantics 文案含 `/规划中.*行身份合格\|行身份合格.*规划中/s`（现行 :76-77「规划中」类非发布态行…即算行身份合格」旧句）—— S5.5 的 S_mid 绑定把「规划中/planned」纳入发布态集 · 旧句描述的是**将被替换的宽松口径**（纯追加保留旧句 = 数据声明自相矛盾），实质必改写 ⇒ 该断言必破须同 commit 登记更新；同测试 :1305-1309 其余五组短语（语义格位口径/状态列 cells[2]/点式 X.Y.Z/X_Y 不计入/兜底嫌疑行）若保留旧文则不破 | 30 执行期：pin-08 semantics 改写与 pins-consistency :1311 断言更新同 commit · 入 F-W2-13 登记清单；建议新文案保留既有五组被断言短语以减少波及面 |
| A3 | 口径级 | 验收 #2「reviews 全量复跑（**89 件**…）· 新判据后 PASS 57 + exempted 6 + FAIL 25（FAIL 集与现口径逐字一致）」算术和 = **88** —— 第 89 件 = 评审文自身（无结论/签收节 · 若入探针则 FAIL 无结论节 · 但不被 findLatestReview 消费 · task :66 已登记分母不变）。30 复跑若按字面全量 89 件跑探针将见 FAIL 26（含评审文自身）而与「逐字一致」幻影冲突 | 30 自检结论写明复跑口径：「探针分母 = 88 件基线集 · 评审文自身单列（非 task_*_audit_R 形态 · 不入 findLatestReview 消费面）」· 无需改 task（:66 登记已足 · 此处仅防误读） |
| A4 | 标注级 | 闸行裁决理由①自引「类比 W3 闸行裁决②按已批准 schema 写数据」—— W3② 实为「缺陷修复既定处置（SPEC §3-③ 已批准动作）」论；「按已批准 schema 写数据」系 **W2** 理由②原文。援引标注小疵 · operative 论据（硬约束 3 闸对象=结构格式 + D-23-W2-CHECK-FORM 数据面既定 · 本审实证 yaml :64-65/:177 注释）自足 | 30/00 引用该裁决时以闸对象论+数据面既定论为主论据；先例标注以 W2②/W3② 各自原义为准 · 裁决结论不变 |

---

## 五、总结论

**PASS-with-issues**（blocking 0 · advisory 4）—— task 内容与 SPEC/评审文/PLAN/硬约束逐项一致，五条重点全部成立（**档 M 定夺维持** · 改档不属范围违约定性成立；闸行裁决三理由成立且升级为三波先例中最干净一例；K 断言同 commit 硬锁三重落点表达充分；U1 分叉统一真闭环含 OQ-3 落点与 close 不对称注释显式化；豁免 6 件逐件核实全中且自咬链条三重机械网闭合自洽），关键数字（773/145/772/0/1 · 100.5s · typecheck 0 · pins 17/17 · HEAD 9c895db · deps 仅 js-yaml · lock 非 dev=2）与 30+ 处行号快照经本审**独立复跑/探针复刻/抽核/grep 复现**；评审文全部实测数字（PASS 63/FAIL 25=15/3/7/0 · 词集命中率 63/57/59/61 · 档 M 误伤恰 6 件/档 S 恰 10 件 · 窄邻接 0/284 · 宽窗口误中 08_w7:85 · NEW-11 误伤 0/63 · S_mid 0/15/S_narrow 1/15=L10 · 双 README 10 表/签名表各 1/26 · 豁免 34 条同构）**逐字复现**。**思考轮审查通过，充分性裁定：充分。**

本审**不代签** HG-AUDIT-R1；签署归 00（维护者 2026-09-16 授权模式）。**因 HG-AUDIT-R1 仍为 pending，按纪律不附 30 Prompt**，仅出维护者签闸清单：

## 维护者签闸（20 后 · 30 前）

- [ ] 已读 R1 审查结论（本文 · 含 advisory A1–A4）
- [ ] 在 task 人工闸表将 HG-AUDIT-R1 改为 approved（00 代签 · 维护者 2026-09-16 授权 · 日期）
- [ ] commit task 文档或确认已签（连同本棒交付：本审查文 + `docs/harness/invokes/by-task/3-0-w4-semantic-criteria/invoke_20260917_20_3-0-w4-semantic-criteria.md` · 逐文件显式 add · 禁 `git add -A`）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | R1 · 20-task-audit：常规核对 13 项全过（含评审文实测数字探针复刻全量复跑逐字一致）；五条重点逐条独立复核（档 M 维持+改档定性成立 · 闸行裁决三理由+升级条款 · K 断言同 commit 三重落点 · U1 helper/双向 fixture/OQ-3/close 注释 · 豁免 6 件 normalizeSlug 双侧归一实证+自咬三重机械网）；独立复跑 npm test 773/145/772/0/1（100.5s）+ typecheck 0 + pins 17/17 + deps/lock 计数 + HEAD 9c895db 全中；30+ 处行号抽核全中；gate-check/verify 双机检咬住 HG-AUDIT-R1 pending（双 exit 2）· task lint PASS；总结论 PASS-with-issues（blocking 0 · advisory 4：A1 四处豁免 fixture 必破须同 commit 重锚登记 · A2 pins-consistency :1311 与 pin-08 semantics 改写硬耦合 · A3 验收 #2 算术口径 89 vs 88 注记 · A4 闸裁决理由①先例标注小疵）；不代签 HG-AUDIT-R1 |
