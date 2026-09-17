# Invoke：30（execute）· 3-0-w4-semantic-criteria（阶段一）

| 字段 | 值 |
|------|-----|
| hat_id | 30-execute |
| task_slug | `3-0-w4-semantic-criteria` |
| task_paths | `docs/tasks/active/task_3_0_w4_semantic_criteria.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要

阶段一（且仅阶段一）：**NEW-5 结论闸档 M 语义化 + NEW-11 否定词表广义化五类 + 6 件存量波及豁免登记**（task S5.1/S5.3 · 验收 #1/#2/#3 对应面）。R-5 跨行封堵 / pin-17 / pin-08 / NEW-10 / N5 归后续阶段，本棒零触碰。

## GATE_VERIFY（第 0 步）

`node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w4_semantic_criteria.md` → HG-TASK-DRAFT approved · HG-AUDIT-R1 approved · **VERIFY: PASS**（exit 0）。

## 红测先行证据（硬约束 6 · 修复前真红）

修复前（2.4.2 码 · HEAD 0eb6cd7 工作区）对新增 fixture 组跑 `--test-name-pattern='3.0-W4 NEW-'`：**pass 2 / fail 7** —— 7 红全部呈现 `VERIFY: PASS · 0 !== 2`（伪造内容过闸 = 真红漏网面）：

- NEW-5 ①「通过。」+16 字 ASCII 填充 → 修复前 PASS（substance=31 过地板）→ 修复后 exit 2 点名「缺审查行为陈述（SUBJ）」
- NEW-5 ②「本审查通过。」+填充 → 修复前 PASS（substance=34）→ 修复后 exit 2 点名「缺对象或闸指涉（OBJ∨GATE）」
- NEW-5 ③ 闸词+approved+通过+填充 → 修复前 PASS（substance=49）→ 修复后 exit 2 点名缺 SUBJ
- NEW-11 四类 14 形态（不予/不/未签收 · doesn't/failed/fails to pass/not approved · declined/vetoed/refused · 不/未 pass、not/no 通过）→ 修复前逐条 PASS 漏网（探针实测 substance 41–90 全达标）→ 修复后全 exit 2 点名「含否定结论词」
- 对照两面修复前后同向（零回退锁）：④ 诚实边界成段合规构造 PASS（R-① 登记面）· ⑤「通过\n」仍内容量不足 FAIL（substance≥20 地板保留）

## 存量波及全量复跑（验收 #2 · A3 口径写明）

复跑口径：**探针分母 = 88 件基线集**（`git ls-tree -r --name-only 9c895db docs/harness/reviews`）· 第 89/90 件单列：评审文自身（w4_semantic_criteria_review_20260917 · 非 `task_*_audit_R<n>_` 形态不入 findLatestReview 消费面）与 R1 审查文（消费形态 · 新判据下 PASS）。

| 口径 | 现判据（2.4.2） | 新判据（档 M + NEW-11） |
|------|------------------|--------------------------|
| 88 基线集 | PASS 63 / FAIL 25（无节 15 · 否定 3 · 无词 7 · 量不足 0） | **PASS 57 · FAIL 31 = 25 旧 + 6 新** |
| FAIL 25 旧集 | — | detail 分布 15/3/7 逐字一致（判据单调加严 ⇒ 旧 FAIL 不可能翻绿） |
| 误伤枚举 | — | **恰为登记 6 件**（00-default-behavior-kit-1-7-1 + 2-4-gate-strength-w{1,3,4,5,6}-* · 全「缺 SUBJ」· 与评审文 §2.3 档 M 枚举逐字一致）· **无第 7 件意外误伤** |
| NEW-11 词表误伤 | — | **0/63**（合规结论节全量 · 若误中必现于 FAIL 集 · 实测 6 件 FAIL 全为缺 SUBJ · 旧否定命中仍 3 件不增） |

## 锁逐项（本棒实测）

- `npm run typecheck` **0 错** · `npm run build` exit 0
- `npm test` **782 tests / 147 suites / 781 pass / 0 fail / 1 skip**（基线 773/145/772/0/1 + 新增 9 测试 / 2 套件 · 零意外红 · duration ≈109s vs 基线 ≈94s）
- `npm run test:lib` **6/6 pass**（S2 真仓裸 verify smoke 含 /豁免命中留痕/ 断言 · 三重机械网之一 ✓）
- `node bin/specgate.js pins check` **17/17 PASS**
- **裸 verify 真仓复跑**：exit 0 · VERIFY: PASS · 豁免命中留痕 24 条 = 18 旧 + **6 新**（NEW-5 六件由 gap 转 exempted ✓ 验收 #2 硬条）
- `verify --task` 复跑 **VERIFY: PASS**
- **判据两分防御（验收 #7 · F-W4-05）**：`git diff -- src/ test/ | grep -i kpi` **零命中** · close-guards.ts/close_kpi 面零变更
- 依赖零新增（本波全部判据落 src/checks/review-gates.ts 既存模块）

## 自咬链条验证（authorized_by 过 A1 三元判）

6 条新豁免 authorized_by = 「00（2026-09-16 维护者双签授权 00 代签）」逐元过 A1（评审文 §6.1 形态）：① 全角括号前身份段「00」非空 ✓ ∧ ② 括号内 ISO 日期「2026-09-16」✓ ∧ ③ 出处关键词「授权」✓ —— 三元齐（探针实测）。loader 收编实测：reviews 18→24 · invoke_hats 16 · **invalid 0** · 6 件 normalizeSlug 键命中 ✓（连字符原形 = done task meta task_slug 逐字 · 6/6 核实在案）。四字段齐 + 显式类型判兜住（exempt.ts:40-44 既有面）。

## 偏差登记（执行期实测偏离底稿处 · 逐条归因）

1. **fixture ③ 闸例换词**：task S5.1 底稿作「HG-AUDIT-R1 approved」—— 实测 HG-AUDIT 内嵌 `AUDIT` 命中 SUBJ 词集（i 旗标 · 评审文 §2.2 词集逐字沿用不扩），该构造在新判据下 SUBJ 维度意外满足。判定意图「GATE 有 · SUBJ 无 → 挡」由同构闸例「HG-SPEC-SIGNOFF approved」承载（fixture 注释在案）。词集本体零变更。
2. **NEW-11 'does not pass' 非红转绿面**：该形态由 2.4.2 R-2 既有 `not\s*pass` 已覆盖（修复前即 FAIL）。类二红转绿代表形 = doesn't / failed / fails to pass / not approved（4 条全真红实测）。
3. **`doesn['’]t\s*pass` 正则笔误一拍即修**：初版落盘漏 `t`（`doesn['’]\s*pass`）→ 类二 fixture 红测咬住 → 修为 `doesn['’]t\s*pass` 转绿。红测先行纪律实效个案。

## 既有面改动登记（验收 #11 · F-W2-13 同式纪律）

- `src/checks/review-gates.ts`：REVIEW_NEG_RE 扩五类 + 词集注释（:132-135 区 · 残余四类登记 · \bNG\b 观察名单）+ REVIEW_SUBJ_RE/OBJ_RE/GATE_RE 三常量单点声明 + evalReviewConclusion 链尾语义组合判 + 否定 detail 括注扩列（/含否定结论词/ 前缀不变）· **R-5 句（:129「窗口显式排除 \n…K 断言钉死」）零触碰**（归阶段二）
- 对照 fixture 重锚 30 处 / 15 文件：标准合规 fixture「审查结论：fixture 全项合规」→「…范围与验收全项合规」（补 OBJ 锚词 · 档 M 下原形态 OBJ∨GATE 双缺必挡）：cli-security-closure · cli-verify-review ×3 · cli-verify-invoke-hats · cli-verify-with-wiki-lint ×3 · gate-semantics · cli-flags · cli-g1g7 · cli-json-no-abs-path · cli-p0 ×5 · cli-status-obs · cli-task-close-guards · cli-task-close-done-snapshot · cli-verify-observability ×4 · cli-lifecycle-guards ×3 · cli-w4-gate-wiring（REVIEW_PASS 常量）
- 阈值边界探针（cli-w4-gate-wiring.test.ts :524 区）：恰 20 侧由裸 ASCII 填充重锚为语义合规等长文本「本审查核对验收范围，通过。abcde」（去通过词后非空白恰 20 · 裸填充即本波 ① 号攻击面本体）· 恰 19 侧不动（substance 先闸仍 内容量不足 FAIL）
- K 断言（:693-701）本阶段**不动**（R-5 归阶段二 · 跨段反向锁同）

---

## 阶段二 · R-5 跨行否定封堵 + K 断言翻向（commit 45569ec · 00 验收 PASS）

- **判据**：REVIEW_NEG_RE 增窄邻接 alternative「(?:不|未)[ \t]*\n[ \t]*(?:予以?|以)?通过」（单换行 · 禁 \n\n 跨段 · 不引字符窗口）。
- **红绿**：修复前 K 翻向 + 跨行三形态（不\n通过 · 未\n通过 · 未\n予以通过）全 exit 0 漏网真红 · 跨段反向锁（不\n\n通过 PASS）双向同向；修复后 3/3 绿（K exit 2 点名含否定结论词）。
- **K 断言翻向**：test :695-705 同 fixture exit 0→2 · 无过时断言 · review-gates.ts:129 区 2.4.2「维持漏网」句封板 · 判据+断言同 commit（F-W4-09 硬锁 · commit body 注明分步必红理由）。
- **回归**：285 份 tracked md（90+78+94+23）窄式 **0 命中** · 行尾 不/未 **0 行** · 88 基线集 57+6+25 不翻（旧 FAIL 集 15/3/7 逐字一致）。
- **锁**：784/148/783/0/1 · typecheck 0 · build ✓ · pins 17/17 · 裸 verify exit 0（24 留痕不翻）· test:lib 首跑 5/6 系 S0 漂移哨兵构建序暂态（lib 未随 src 重建）→ build 后三跑稳定 6/6（00 验收定性成立）。
- **偏差**：前缀形态 (予|以)? 增补 (予以?|以)?（底稿不覆盖「未\n予以通过」· 与同句窗口语素对齐 · 三性质不变 · 00 登记成立）。

## 阶段三 · NEW-4 pin-17 表行语义判 + pin-08 发布态绑定（commit b7b3cce · 00 验收 PASS）

- **判据**：pin-17 = 双命中 + ①词锚剥 \|\s* 行首锚落 cells[0] 主键列 + ②所属表首表头格 /^(Host|宿主)$/ 签名（miss 附注点名 NEW-4 维度 · hitsAll 同口径）；pin-08 = cells[2] 边界点式串 ∧ S_mid {published,已发,released,CLOSED,规划中,planned} 同格共现（裸版本串入 noState 嫌疑点名无发布态措辞）· S_narrow 弃用理由（伤 L10 CLOSED 行 1/15）入 yaml semantics。
- **红绿**：修复前 4 红全顶包（Topic 表注入 / 第二格注入 / 裸版本串 / 不同格全 exit 0）· 修复后 6/6 绿 + 全表誊抄诚实边界 PASS（职责边界固化）+ S_mid 三态正向全 ok。
- **回归**：双 README 各 10 表 · 签名表各恰 1 · 26/26 零误伤（pins「13 宿主校验 · 13 双语命中」）· spec 索引 18 行/15 含点式串 · S_mid 15/15 误伤 0（评审文 §4/§5 逐字吻合）· pins 17/17 · 现行文档零咬。
- **A2 同 commit**：pins-consistency:1311 旧句断言 → S_mid 三条新断言 · 既有五组短语断言保留未破。
- **登记**：W2-B7/B10 脱表补行重锚表内插入 · sha256.manifest 联动重建（assets verify 双面 PASS · 循 W3 先例）。
- **偏差**：cellForm slice(6) off-by-one（\|\s* 实 5 字符）被 failClosed（host_hits 正则非法）咬出一拍即修 anchor.length。
- **锁**：790/149/789/0/1 · typecheck 0 · build ✓ · test:lib 6/6（build 后跑）· 裸 verify exit 0。

## 阶段四 · NEW-10 exempt A1 真实性 + U1 口径统一 + N5 登记 + 收官（commit 见自检结论 · 本 invoke 同波）

- **A1 三元判**（exempt.ts loader）：① 全角括号前身份段非空 ∧ ② 括号内 ISO 日期 ∧ ③ 括号内出处词（授权/批准/会话/答复）· 不合入 invalid warn 不豁免（与缺四字段同通道）· 诚实边界 R-③ 注释在案（锁形态不锁事实 · 终局 S2 留痕+人审）· A2 可选/A3 弃选登记入 yaml 头注释。
- **红绿**：假授权四形态（张三 / "00" / 有日期无出处词 / 有出处词无日期）修复前全豁免真红 → 修复后全 invalid 不豁免 exit 2 点名 A1 三元判 · 合规形态对照 PASS · **存量 40 条（34 旧+6 新）A1 全过 invalid 0**（评审文 34/34 基线 + 阶段一 6 条自过）。
- **四处 fixture 重锚（20 审 advisory A1 · 与 loader 同 commit）**：① w4l_ok（:313 区）· ② meta_slug_x（N14 :345 区）· ③ N13「"00"→豁免命中」语义**有意反转**为 invalid（裸名/裸号即假授权形态 · 类型判层未加引号 00 半段保留 · 绿径改由 A1 合规形态承载）· ④ bare_gap（cli-verify-spec:240 区）。
- **U1**：resolveExemptEntry 单源（exempt.ts · normalizeSlug 内收）· 三消费面同构（裸 verify :168 / lint-done :107,:124 / verify --task done 面新增）· grep 单源断言咬死（src 内无第二份 Map.get 拷贝）· done 面双向 fixture（有豁免 → exempted 留痕含 JSON 条件键（契约只增不改）· 无豁免 → warn 降级维持）· close 不消费设计性不对称显式注释入 close-guards.ts evalCloseReview 头注释（杜绝顺手补消费 · U2/U3 弃选在案）。
- **N5 登记**：rebuild 追认语义不封堵口径标注入 task 自检结论（cli-assets.ts:86-90 警示文案在案复核 · 零行为变更）。
- **偏差**：emitJson 闭包引用后置 const exempted 致 TDZ 运行红（--json 面 5 套件咬住）→ 声明前置一拍即修（测试网实效登记）。
- **锁**：**794/150/793/0/1** · typecheck 0 · build ✓ · test:lib 6/6 · pins 17/17 · 裸 verify exit 0（24 留痕 · invalid 0）· verify --task PASS · gate-check exit 0 · task lint PASS · KPI 零 diff（四阶段机检）。

## 维护者授权边界

- ⛔ 未 tag / push / publish / deprecate（四动作仅人）
- ⛔ 未触碰 HG 闸表 / SPEC / PLAN / KPI 判据面
- 全四阶段完毕（范围①–⑦全销 · ⑧硬前置起草期已销）；波末 task close 待 40 复核后 00 口径
