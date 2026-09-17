# W4 · 判据语义方案评审文（设计评审 · 非实现 · 3.0-W4 硬前置）

> **评审对象**：[`docs/spec/3_0-architecture-leap/05_w4_semantic_criteria_v1.md`](../../spec/3_0-architecture-leap/05_w4_semantic_criteria_v1.md)（signed · HG-SPEC-SIGNOFF=approved 2026-09-16）范围 ①–⑥ 的判据形态设计
> **性质**：设计评审文（D-24-W2-REVIEW-FIRST 先例 · 闸语义变更影响所有消费者 failClosed 行为 · 先评审后动手）。**本文不改任何代码/判据/yaml/SPEC/PLAN · 不签闸**；实现归 W4 task（30）。
> **循例**：2.4-W2《w2_conclusion_gate_strength_review_20260914》（S1·N=20 定档路径）· 2.3.1 N11（闸接线存量波及入豁免先例）
> **实测纪律**：全部证据为 tracked 路径+行号实测（硬约束 14）；存量波及全部真跑（一次性 Node 探针 · 判定逻辑逐行对齐现码），不接受估算
> **行号基准**：2026-09-17 工作树实测（W0 后新布局）

---

## 0. 现码实测基线（评审的事实面）

| 判据面 | 实现 | 行号（实测） |
|--------|------|--------------|
| 结论节抽取 | REVIEW_SECTION_HEAD_RE（「结论/签收」起首 ##/### 节合并） | src/checks/review-gates.ts:134 |
| 通过词 | REVIEW_PASS_RE（PASS/ACCEPT/签收/零阻塞/通过） | src/checks/review-gates.ts:135 |
| 否定守卫 | REVIEW_NEG_RE（退回 · 同句窗口 不[^。；\n]{0,12}通过 / 未… · no/not pass · reject · 内容阻塞） | src/checks/review-gates.ts:136（2.4.2 R-2 口径注释 :126-133） |
| 长度门槛 | REVIEW_MIN_SUBSTANCE = 20（去通过词后非空白字符数） | src/checks/review-gates.ts:137-140（2.4-W2 S1·N=20 定档注释） |
| 结论闸判定面 | evalReviewConclusion（无节 fail → 否定 fail → 无通过词 fail → 内容量 fail → pass） | src/checks/review-gates.ts:143-175 |
| exempt 加载 | 四字段非空字符串判（slug/reason/date/authorized_by · 显式类型判防 falsy） | src/checks/exempt.ts:9,18-54（字段判 :40-44） |
| close 消费 | evalCloseReview / evalCloseInvokeHats —— **不消费 exempt** | src/checks/close-guards.ts:92-108,76-88 |
| 裸 verify 消费 | FULL-reviews done 面 failClosed + exempt.reviews | src/cli/verify.ts:144,157-170 |
| verify --task | 缺审查文 failClosed（无 exempt）· done 目录结论失败 **warn 降级**（无 exempt） | src/cli/verify.ts:319-324,332-353 |
| lint-done 消费 | INVOKE-HATS 帽级 + exempt.invoke_hats | src/cli-task-extra.ts:100-127 |
| pin-08 | spec-index-row：状态格（cells[2]）边界正则 hitA ∧ slug 格 hitB | src/cli-pins.ts:217-266（:226-245）· 数据 assets/release-pins.yaml:60-82 |
| pin-17 | readme-host-row：词锚 ∧ 表行（TABLE_ROW_RE = /^\s*\|/）双命中 | src/cli-pins.ts:382-477（:421-428）· 数据 assets/release-pins.yaml:173-212 |
| K 断言 | 「不\n通过」换行维持 PASS 漏网钉死（防顺手修 R-5） | test/cli-w4-gate-wiring.test.ts:693-701 |

**2.4.2 对账确认（PLAN 校核 #8）**：R-2（同句窗口 + not\s*pass）、R-3（pin-16 无引号属性三选一 src/cli-pins.ts:327）、R-4 均已交付，本文不重复、不再评审；本波只做真残余 R-5（[^。；\n] 窗口显式排除换行符 · src/checks/review-gates.ts:129 注释在案）。

**存量语料基线（全量实测 · 非抽样）**：docs/harness/reviews/ 现行 **88** 件。以现口径（evalReviewConclusion 逐行复刻）复跑：**PASS 63 / FAIL 25**（无结论节 15 · 否定命中 3 · 无通过词 7 · 内容量不足 0）。后续所有「误伤」数字的分母均为 **63**（现口径合规集 · 强判据只会把 PASS 翻 FAIL，故误伤只需在此集上枚举）。注：88 件中 w1_/w2_/w3_/w4_ 设计评审类文与 spec_* 文不被 findLatestReview（src/checks/review-gates.ts:99 文件名口径 task_*_audit_R<n>_*）消费，纳入校准属**保守偏严**（把更自由的文书形态也要求合规）。

---

## 1. 判据两分边界声明（硬约束 11 兑现面）

**本文显式声明（PLAN 硬约束 11 · docs/roadmap/PLAN_3_0_architecture_leap_v1_zh.md:340）**：

1. **防伪类判据继续语义化** —— 本波五项全部属防伪类：结论闸 NEW-5/R-5/NEW-11（防「没通过写成通过」）、pin-17 NEW-4 / pin-08（防伪表行顶包 / 版本串漂移）、exempt NEW-10（防假授权顶包）。其共同特征：判据守护的是**对外可证伪的事实陈述**（审没审、发没发、谁授的权），机械语义门槛不替代判断、只提高伪造成本。
2. **自评类判据不语义化** —— KPI 等「给思考打分」的判据**只保留存在性约束**（close_kpi 现状零变更 · SPEC §4 非范围首行 · D-30-KPI-NO-SEM）。理由（维护者裁决原文）：「补了语义可能还会限制思考」—— 机械门槛会反向约束被评对象本身。
3. **禁止以「统一语义化」为名对自评类加机械门槛** —— F-W4-05 兜底：任何后续波次/task/评审文若出现对 KPI 节设分数口径、评分表形态、值域分布等机械判据的提案，**一律拒**，引本节为据。判据分类存疑时按「判据失守是否产生对外假事实」判定：是 → 防伪类；否（只影响自我度量质量）→ 自评类。

---

## 2. NEW-5 · 结论闸语义闸设计（核心）

### 2.1 攻击面（现判据为何不够）

REVIEW_MIN_SUBSTANCE=20 只数非空白字符：构造「## 结论 / 通过。abcdefghijklmnopqr」（2 字动词 + 18 字填充）即过闸（填充 16 字以上任意 ASCII 均同效）。现判据对「结论节是否陈述了一次审查行为」零约束。

### 2.2 候选语义单元清单（对 63 份合规结论节实测命中率）

| 单元类 | 候选词集（评审定稿候选） | 命中 |
|--------|--------------------------|------|
| **结论动词 VERB**（沿用现 PASS_RE，不扩） | 通过 / 签收 / 准予 / 放行 / PASS / ACCEPT / 零阻塞 | 63/63 |
| **审查行为 SUBJ**（签收主体的行为陈述） | 审查 / 评审 / 核对 / 复核 / 审计 / 验收 / 检查 / audit / review | 57/63 |
| **对象锚 OBJ**（被审对象指涉） | 任务 / task / SPEC / PLAN / 范围 / 验收 / 交付 / 变更 / 计划 / 闸 / 钉 / docs/ / src/ / 本波 / W\d | 59/63 |
| **证据痕迹 EVID**（审查工作量的可机读痕迹） | 实测 / 行号 / 逐条 / 逐项 / 清点 / 盘点 / 复跑 / 抽验 / 回归 / fixture / § / L\d+ / 误伤 / 命中 | 25/63 |
| **闸锚 GATE**（流程面指涉） | HG-[A-Z-]+ / approved / 人闸 / 代签 / 闸 | 61/63 |

### 2.3 组合规则与存量合规率实测（分母 = 63 份现口径合规文 · 全量复跑）

| 档 | 组合规则（节内共现 · 与现有否定/通过词/内容量判据 AND） | 误伤 | 误伤枚举 |
|----|----------------------------------------------------------|------|----------|
| **S（严）** | VERB ∧ SUBJ ∧ OBJ | **10/63** | task_00_default_behavior_kit_1_7_1_audit_R1_ACCEPT · task_2_1_1_host_tools_ux_w{1,2,3,4}_*（4 件）· task_2_4_gate_strength_w{1,3,4,5,6}_*（5 件） |
| **M（中 · 推荐）** | VERB ∧ SUBJ ∧ (OBJ ∨ GATE) | **6/63** | task_00_default_behavior_kit_1_7_1_audit_R1_ACCEPT（「ACCEPT。范围限于…」无审查行为词）· task_2_4_gate_strength_w{1,3,4,5,6}_*（5 件短结论：「Wn 结论：PASS · 零内容阻塞，与总审文 §4…一致」） |
| **L（宽）** | VERB ∧ (SUBJ ∨ EVID) ∧ (OBJ ∨ GATE) | **1/63** | task_00_default_behavior_kit_1_7_1_audit_R1_ACCEPT |
| 参照 D4 | VERB ∧ SUBJ | 6/63 | 同 M |
| 参照 D5 | VERB ∧ (SUBJ ∨ EVID) | 1/63 | 同 L |

**定档建议：档 M**（VERB ∧ SUBJ ∧ (OBJ ∨ GATE)，节内共现，不要求同行同句）。理由：① 把攻击面从「16 字任意填充」抬到「须伪造审查行为词 + 对象/闸指涉 + 20 字实质文本」三件套；② 误伤 6 件全部可枚举、形态同构（5 件为 2.4 系列波次短结论 + 1 件 1.7.1 ACCEPT 体），循 2.3.1 N11 先例入 legacy-gate-exempt.yaml 留痕（非追溯改写 · 硬约束 7）；③ 档 L 只多保 1 件却让「审查行为」维度降为可选（EVID 词集如 § / L\d+ 易被引用性文本顺带命中），防伪强度损失不值；④ 档 S 多伤 4 件 2_1_1 系列（其结论为维度表「内容审查|流程闸」形态 · 无对象锚词），边际强度收益低于留痕成本。REVIEW_MIN_SUBSTANCE=20 **保留**为并列地板（63/63 已过 · 零新增误伤 · 双保险防「词齐但仍是碎句」）。

### 2.4 伪合规构造的对抗分析（档 M）

| 构造 | 现闸 | 档 M |
|------|------|------|
| 「通过。」+ 16 字随机填充 | **过**（substance≥20） | **挡**（无 SUBJ/OBJ/GATE） |
| 「本审查通过。」+ 填充 | 过 | **挡**（SUBJ 有 · OBJ/GATE 无） |
| 「HG-AUDIT-R1 approved」+ 填充 | 过 | **挡**（GATE 有 · SUBJ 无） |
| 「本审查核对验收标准与范围，无阻塞，通过。」（+补足 20 字） | 过 | **过** —— 诚实边界：机械判据不防「成段伪造一次并未发生的审查」；该残余由 invoke 留痕（close_invoke 帽集合闸）与 HG-AUDIT-R1 人签兜住，语义闸的职责是把「裸长度/裸动词顶包」逐出合规面 |
| 真合规文（维度表 / 「与总审文 §4 一致」散文） | 过 | 过（57/63 直接过 · 6 件枚举入豁免留痕） |

---

## 3. R-5 跨行否定封堵 + NEW-11 词表广义化

### 3.1 跨行窗口语义与冲突面实测

对 **284 份** tracked markdown（docs/harness/reviews + docs/tasks/done + docs/spec + docs/roadmap 全量）实测：

| 候选形态 | 命中 | 分析 |
|----------|------|------|
| 严格邻接 (不|未)[ \t]*\n[ \t]*(予|以)?通过（单换行 · 禁空行跨段） | **0** | 存量零冲突 ✅（K fixture 形态「不\n通过式」正落此式） |
| 字符窗口跨行 不[^。；]{0,12}\n[^。；]{0,12}通过 | **1（误中）** | docs/spec/3_0-architecture-leap/08_w7_closeout_external_v1.md:85：「不接受『我改完了』**）\n\n** 1. **术语一致性机检通**过」—— 窗口放行 \n\n 跨段，把「不接受…」与下节「机检通过」错配为否定。**实证：凡允许 \n 进字符窗口即等于允许跨段误配** |
| 行尾落 不/未（正常硬换行风险面） | **0 行** | 本仓 284 份无任何行以 不/未 收尾 ⇒ 窄式对存量与现行排版习惯零冲突 |
| not\s*\n\s*pass | 0 | 英文侧同窄式处理 |

**封堵定稿建议**：REVIEW_NEG_RE 增 alternative「不[ \t]*\n[ \t]*(予|以)?通过 | 未[ \t]*\n[ \t]*(予|以)?通过」（**仅单换行邻接 · 禁 \n\n 跨段 · 不引入字符窗口**）。F-W4-03 兑现：窗口参数非拍脑袋 —— 宽窗口有实测反例（08_w7:85），窄邻接有 284 份零冲突实测。消费者仓排版不可知 ⇒ 窄式是把误伤风险压到「恰好在 不/未 后硬换行且下行以 通过 起首」这一极小形态的唯一定档。

### 3.2 K 断言同步更新方案（验收 #5 兑现设计）

现 K 断言（test/cli-w4-gate-wiring.test.ts:693-701）钉死「换行形态 + 实质内容达标 → exit 0 PASS（漏网维持）」。R-5 真修后**同 fixture 翻向**：「不\n通过式」结论 → exit 2 FAIL（exit 0 → 2 即「修复后转绿」的回归锁语义）。**同步新增反向锁**：「不\n\n通过」（跨段）必须**维持 PASS** —— 把 08_w7:85 误中案例固化为「禁止未来顺手把窗口改宽」的回归锁。两断言配对替换原 K 断言，不留过时断言（SPEC residual_risks ③ 的解锁顺序硬锁在此兑现：判据改造与断言翻向同 commit）。

### 3.3 NEW-11 跨语言词表：常见形态覆盖清单 + 残余显式登记（不承诺完备）

词表现状（语料普查 · reviews 全文）：不通过 5 · 未通过 6 · 不予通过 1 · 不 通过 2 · 不签收 1 · not pass 4 · reject* 21。候选新增项对 63 份合规结论节**误伤实测全 0**：

| 类别 | 新增候选（评审定稿） | 结论节误伤 |
|------|----------------------|-----------|
| 中文签收面 | 不予签收 / 不签收 / 未签收（现词表只有「通过」族 · 语料实见 1 例） | 0/63 |
| 英文否定完成式 | does n['’]t pass · does not pass · fail(ed|s)? to pass · not approv* | 0/63 |
| 英文否决族 | \bdeclined?\b · \bveto(ed)?\b · \brefused?\b | 0/63 |
| 中英混入 | (不|未)\s*pass · not 通过 · no 通过 | 0/63 |
| 工程混入 | \bNG\b（词边界 · 日/工程圈常见判退记号） | 0/63（全文 284 份亦 0 · 但消费者英文 prose 中 "NG" 或有他义 → **入观察名单不入首批**，见 §8 OQ-4） |

**已覆盖声明**：中文「不/未/不予 + 通过/签收」族 · 英文 no/not/doesn't/fail-to + pass · reject/decline/veto/refuse · 退回/内容阻塞（既有）。**残余显式登记（F-W4-02 兑现 · 不承诺完备）**：① 日韩德法俄等全形态（不合格 / 불합격 / nicht bestanden / rejeté …）；② 符号形态（❌ ✗ 👎）；③ 谐音/拆字/全角混入（不 通 过 · 不─通过）；④ 拼音。后续发现新形态 → 补词表 + fixture，循本次同流程。

---

## 4. NEW-4 · pin-17 表行语义判

**现状**（2.4 W1 双命中 · src/cli-pins.ts:421-428）：词锚 ∧ 「存在 /^\s*\|/ 起首行」即命中。顶包面：词锚落**任意表的任意格**即过（如实测 README.md:15「你是谁」表行含「Cursor / Claude Code」裸词 · 若某宿主词锚无加粗约束即可被该行顶包）。

**升级判据（在双命中基础上加两层 · 数据声明入 assets/release-pins.yaml pin-17 semantics）**：

1. **主键列判**：词锚命中位置须落 **cells[0]**（首格 · 去包裹符后的宿主 id 格）—— 实现形态：对命中行切格，将 host_hits 词锚（剥 \|\s* 行首锚后的 cell 域形态）对 cells[0] 复判。
2. **表头结构判**：命中行所属表（表头行 + 分隔行 /^\s*\|[\s:\-|]+/ + 连续表行解析）首表头格须匹配宿主表签名 /^(Host|宿主)$/（双语 · 与现行两 README 实测表头一致）。

**存量合规率实测**：README.md / README.zh-CN.md 各解析出 10 张表，宿主签名表各**恰 1 张**（README.md:24-38 / README.zh-CN.md:24-38 · 各 13 行），13 宿主词锚全部落 cells[0] —— **26/26 合规 · 误伤 0**。对照旧口径 13/13 × 2 亦全中 ⇒ 升级对存量零回退。

**伪表行顶包对抗分析**：① 「你是谁」表 / Topic 表内注入「| **Cursor** | …」—— 表头签名不符，**挡**；② 宿主表内追加行把词锚写进第二格（「| foo | Copilot |」）—— 主键列判，**挡**；③ 伪造整张建签名表 + 13 行加粗宿主名 —— 可通过，但此构造已等价于「把真实表内容抄一遍」，机械判据防的是**机会式单行注入**而非全表誊抄（全表誊抄不造成信息失真，危害面闭合）。

---

## 5. pin-08 · 版本串↔发布态绑定

**现状**（2.4.1 N9 边界正则已锁 · src/cli-pins.ts:230-245）：状态格（cells[2]）含边界完整点式 X.Y.Z 即算行身份合格 —— 裸版本串「2.4.2」不带任何发布态措辞也过。

**候选发布态措辞集合**（对 docs/spec/README.md 18 索引行实测 · 15 行状态格含点式版本串）：

| 措辞集 | 构成 | 存量绑定不合规 |
|--------|------|----------------|
| S_narrow | published / 已发 / released | **1/15**（L10：「**CLOSED**（1.12.0+1.12.1）」无 published 族词） |
| **S_mid（推荐）** | published / 已发 / released / CLOSED / 规划中 / planned | **0/15** |
| S_broad | S_mid + IMPLEMENTED/deprecated/DONE/CLOSE/draft | 0/15 |

**绑定规则定稿建议**：**同格共现**（cells[2] 内版本串 ∧ 发布态措辞 · 非同行 —— 实测 15 行版本串与措辞本就同格；跨格绑定会把 slug 格/描述格的措辞卷入，语义稀释）。取 **S_mid**：CLOSED 入集（L10 为现行合法形态 · 版本串与 CLOSED 同格捆绑是真实的发布态陈述）；规划中/planned 入集（F-W1-05 既定的非发布态行形态 · 规划态亦是显式状态绑定）；IMPLEMENTED/deprecated 等**不**入发布态集（生命周期/包态措辞，与「该版本串已发布」无语义绑定关系 —— 稀释判据）。**对抗面**：裸「| … | 2.4.2 | …」状态格（无任何态词）→ 挡；规划中伪装已发行 → 语义上行已自陈规划态，版本真实性归 pin-10 tag 闸分工（现分工注释 src/cli-pins.ts:221 保持）。**存量合规率：15/15 · 误伤 0**。

---

## 6. NEW-10 · exempt 真实性 + close/verify 口径统一

### 6.1 authorized_by 真实性核验候选（对 docs/harness/legacy-gate-exempt.yaml 34 条目逐条实测）

现行 34 条目（reviews 18 · invoke_hats 16 · :9-147）authorized_by **全部同构**：「00（2026-09-12 维护者会话授权）」。

| 候选 | 判据形态 | 存量合规 |
|------|----------|----------|
| **A1（推荐 · 形态三元）** | 「身份（YYYY-MM-DD + 授权出处描述）」：非空身份 + 全角括号内 ISO 日期 + 出处关键词（授权/批准/会话/答复） | **34/34 合规 · 误伤 0** |
| A2（链 tracked 记录） | authorized_by 须引用 tracked 路径（invoke 快照/审查文/答复记录） | **0/34 合规** —— 若强制则与不追溯（硬约束 7）冲突，且把既有合法豁免全量打成 invalid |
| A3（date 字段 ↔ 内嵌日期相等） | 注册日 == 授权日 | 0/34（现条目授权日 2026-09-12 ≠ 注册日 2026-09-13/14 · 语义本就两回事 · 弃选） |

**定稿建议**：loader（src/checks/exempt.ts:40-44）在非空字符串判之上加 **A1 形态判**（不合 → 入 invalid 留痕 warn · 不豁免 · 与既有「缺四字段」同处置面）；A2 登记为**可选强形态**（新条目可自愿引用 tracked 记录 · 见 §8 OQ-2）。**诚实边界**：A1 锁的是「授权陈述的可稽核形态」，不能机检「维护者是否真的说过」—— 真实性终局靠 S2 留痕 + 人审，机械判据把「随手填个名字」逐出合规面（与 NEW-5 同哲学）。

### 6.2 close / verify 对 exempt 的消费分叉（现码四面实测）

| 消费面 | 严格度 | exempt 消费 | 行号 |
|--------|--------|-------------|------|
| 裸 verify（FULL-reviews done 面） | failClosed | ✅ exempt.reviews | src/cli/verify.ts:144,157-170 |
| lint-done（INVOKE-HATS） | failClosed | ✅ exempt.invoke_hats | src/cli-task-extra.ts:102-127 |
| verify --task（done） | 缺审查文 failClosed · 结论失败 **warn 降级** | ❌ | src/cli/verify.ts:319-324,343-347 |
| task close | failClosed | ❌ | src/checks/close-guards.ts:92-108 |

**分叉定性与统一方案**：

- **U1（推荐）**：抽共同 helper（slug → exempt 条目解析 + invalid 留痕回显）供两个存量消费面（裸 verify / lint-done）同构使用；**verify --task done 面补消费 exempt.reviews**（有豁免条目 → 留痕 exempted 而非 warn · 无 → 维持 D-23-W4-TRANSITION warn 不挡）；**close 不消费 exempt 是设计性不对称而非缺陷** —— close 只闸**新关账**，新关账无「接线前合法存量」可言（D-23-W4-TRANSITION），须把该不对称写成 evalCloseReview 头注释的显式口径，杜绝后人「顺手补消费」。
- U2（close 也消费）：弃选 —— 会把过渡豁免面开放给新工作（豁免机制反噬）。
- U3（裸 verify 不消费）：弃选 —— 34 条存量合法豁免瞬间全红，违反不追溯。

---

## 7. 强度档与波及处置总表

| # | 判据 | 定稿形态（建议） | 存量波及实测 | 误伤枚举 | 豁免路径 | 追溯 |
|---|------|------------------|--------------|----------|----------|------|
| ① | NEW-5 结论闸 | 档 M：VERB ∧ SUBJ ∧ (OBJ∨GATE) 节内共现 · AND 现有否定/通过词/substance≥20 | reviews 88 全量复跑（现 PASS 63 为分母） | **6/63**：task_00_default_behavior_kit_1_7_1_audit_R1_ACCEPT + task_2_4_gate_strength_w{1,3,4,5,6}_*（5 件） | 6 条入 legacy-gate-exempt.yaml reviews 节（四字段齐 · 循 2.3.1 N11 先例） | 不追溯（D-24-W2-NO-RETRO 沿用 · 硬约束 7） |
| ② | R-5 跨行 | (不|未)[ \t]*\n[ \t]*(予|以)?通过 单换行邻接入 NEG_RE · K 断言翻向 + 跨段反向锁 | 284 份 md 全量：窄式 0 命中 · 行尾 不/未 0 行 | **0** | 无需 | 不追溯 |
| ③ | NEW-11 词表 | §3.3 五类新增（NG 入观察名单） | 63 份合规结论节全量 | **0/63** | 无需 | 不追溯 |
| ④ | NEW-4 pin-17 | 词锚落 cells[0] 主键列 ∧ 宿主表头签名 /^(Host|宿主)$/（数据入 yaml semantics） | 双 README 各 10 表 · 宿主表各 1 · 13 宿主 | **0/26** | known_gaps 机制既有（assets/release-pins.yaml:211-212） | 不追溯 |
| ⑤ | pin-08 绑定 | 状态格同格共现：边界点式串 ∧ S_mid 发布态措辞 | docs/spec/README.md 18 行（15 行含点式串） | **0/15** | 无（现行行全合规 · pin-08 fixable:false 人工补行纪律不变） | 不追溯 |
| ⑥ | NEW-10 exempt | A1 形态三元（身份+ISO日期+出处词）入 loader invalid 面 · U1 口径统一 | 34 条目逐条过 | **0/34** | invalid 留痕 warn 既有面（exempt.ts:42） | 不追溯 |

每条修严实现时配负向 fixture（修复前真红 · 修复后转绿 · 硬约束 6）；本表误伤枚举即为实现波的豁免登记清单底稿。

---

## 8. 风险与开放问题

| # | 项 | 定性 | 处置建议 |
|---|----|------|----------|
| OQ-1 | NEW-5 最终定档 M vs S（M 伤 6 · S 伤 10 · 本文荐 M） | **blocking W4 task 定稿**（不 blocking 本文） | 20-task-audit 据 §2.3 表定夺；若改 S，4 件 2_1_1 系列补入豁免清单 |
| OQ-2 | NEW-10 A2 强形态（链 tracked 授权记录）是否写为「推荐形态」口径 | **blocking W4 task 定稿** | 建议 A1 强制 + A2 可选；强制 A2 与不追溯冲突（实测 0/34） |
| OQ-3 | verify --task done 面补消费 exempt 后，「有豁免 → 留痕 exempted」与既有「warn 降级」文案/JSON 字段口径 | 非 blocking（实现细节） | W4 task 内定，保持 waived/exempted 字段命名与裸 verify 对齐 |
| OQ-4 | \bNG\b 入词表的消费者仓误伤面（本仓 284 份 0 命中 · 但英文 prose 或有他义） | 非 blocking | 首批不入 · 观察名单；若入，限结论节作用域（结论节文本量小 · 风险面可控） |
| R-① | 语义闸不防「成段伪造审查行为」（§2.4 末行） | 已登记残余 | 由 invoke 留痕 + HG-AUDIT-R1 人签兜底 · 不属机械判据职责 |
| R-② | 窄式跨行封堵对消费者仓「恰在 不/未 后硬换行」排版的理论误伤 | 低（本仓 0/284 · 行尾 不/未 0 行） | F-W4-03 路径：误伤可枚举 + 豁免可留痕 |
| R-③ | A1 形态判只锁形态不锁事实 | 已登记残余（§6.1 诚实边界） | S2 留痕 + 人审终局 |

**结论**：六条判据形态设计成立，存量波及全部可枚举（最大 6 件），均有留痕路径，建议按本文定稿形态起 W4 task（10-task → 20-task-audit → HG-AUDIT-R1 → 30）。

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-17 | 起草 · W4 判据语义方案评审（设计评审 · 非实现）· 全量实测：reviews 88（现 PASS 63）· 索引行 18 · 豁免 34 条 · md 284 份 · 双 README 表 20 |
