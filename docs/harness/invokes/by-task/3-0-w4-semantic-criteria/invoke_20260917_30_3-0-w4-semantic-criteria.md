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

## 维护者授权边界

- ⛔ 未 tag / push / publish / deprecate（四动作仅人）
- ⛔ 未触碰 HG 闸表 / SPEC / PLAN / KPI 判据面
- 本棒仅阶段一；R-5 跨行封堵（S5.2）/ pin-17（S5.4）/ pin-08（S5.5）/ NEW-10（S5.6）/ N5（S5.7）归后续阶段
