# 审查文 · 2.4.1 patch task R1（NEW-1/NEW-2/NEW-3/NEW-9+N9 + bump）

> **hat**：20-task-audit（书面审查 · R1 · 独立上下文 · 非起草者）
> **日期**：2026-09-14
> **被审对象**：[`docs/tasks/active/task_2_4_1_patch.md`](../../tasks/active/task_2_4_1_patch.md)（slug `2-4-1-patch` · 无独立 SPEC 夹 · 模板照 2.3.1 patch）
> **对照基准**：[`.workbuddy/output/验收报告-SpecWave-2.4.0.md`](../../../.workbuddy/output/验收报告-SpecWave-2.4.0.md) §3 证据节 + §6.1 四组建议 + §6.2 归 3.0 清单 + §7.3「不开 2.5.0」纪律 · [`docs/tasks/done/task_2_3_1_patch.md`](../../tasks/done/task_2_3_1_patch.md)（patch 链路模板）
> **审查方式**：只读通读 task + 报告全文 + 2.3.1 模板；**行号现值抽查 9 组**；**两处正则模拟实测**（临时脚本 `/tmp/w241_audit_sim.mjs` · 未改仓文件）；**未改被审对象任何字节**。

---

## 1. 逐项核对结论

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围严格限 §6.1 四组 | **PASS** | NEW-1（否定守卫）· NEW-2（基参统一+对偶测试）· NEW-3（HTML 锚点 · 维护者定稿修）· NEW-9+N9（精确版本锁定）+ bump 九件套，与报告 §6.1 逐行对应；§7.3「走 2.4.1 不开 2.5.0」纪律承接正确。唯一增量 = cli.ts:1299 exit-1 信封 → 裁决见 §3-3（**确认纳入**） |
| 归 3.0 项在非范围 | **PASS** | NEW-4/NEW-5/NEW-6/7/8/12/NEW-10/NEW-11（广义词表面）/N5 逐条列入非范围表并钉报告 §6.2 出处；publish/deprecate 仅人（tag+push 授权边界明写）· RELEASING 叙事回填待 publish · schema 触即 STOP · assets 仅 semantics 文字——边界无漏 |
| 验收机械可判 | **PASS** | 抽查 NEW-2 验收条：`grep -n 'printJson(process.cwd()' src/cli.ts src/cli-host.ts` → 0 命中（纯 grep 断言 · 可机判）；NEW-1/NEW-3/NEW-9 全部「红测先行（修复前真红复现报告构造）+ exit code 断言 + 对照组零回退」；pins check 16/17 设计红口径、四门全绿、gate-check 闭环均为机械条款。抽查深核：NEW-9 验收「状态格 `` `9.9.9` published`` 同格保留 v-tag → exit 2」与报告 §2 N9 行构造逐字一致 · 可判 |
| failure_paths | **PASS** | F-P2-01~14 成表：闸拒（01）· publish 越权（02）· `git add -A`（03）· NEW-1 误伤窗（04）· 波及静默放过（05）· fixture 误绿（06）· 对偶测试掩盖复发（07）· NEW-9 误伤存量行（08）· 四门红（09）· pin-10 设计红误判（10）· 扩范围修 3.0 项（11）· RELEASING 双重敏感（12）· 忘 manifest rebuild（13）· host validate 兼容（14）——每项对应真实风险 · 无空壳 |
| R0–R5 思考轮 | **PASS** | 控制表在位逐轮回填（R0 证据钉报告节号 + 行号复核声明 · R2 四处方案对比有采纳/弃选理由 · R4 可测性映射验收条 · R5 early_stop=no「待 20 审裁定」正确姿态）；residual_risks 五条与 failure_paths 呼应（② 直言「不行，通过」窗内组合会中——与本审实测一致 · 见 §3-1） |
| 人工闸表 | **PASS** | HG-AUDIT-R1=**pending** blocks 30 · 00 代签授权注记（维护者 2026-09-14）在案 · 签前 30 拒改码明写；HG-SPEC-SIGNOFF=N/A（无独立 SPEC 夹 · 2.3.1 先例）口径正确；HG-TASK-DRAFT blocks `20, 30` 与 2.3.1 模板逐字一致；HG-NEXT-PLAN 注明维护者直接下令 + tag+push 授权边界（publish 仅人） |
| 2.3.1 模板对齐 | **PASS** | 元信息字段集（test_strategy/code_quality_bar/experience_capture/kpi_*）· 闸表结构 · bump 八件套链路（手工 package.json · 不用 npm version · 设计红留痕 · RELEASING 双重敏感 · ACCEPTANCE 档 + spec 索引行）· 存量波及处置先例引用——逐项对齐 |

## 2. 行号现值抽查（9 组 · 本棒只读实测）

| # | 引用 | 现值 | 结果 |
|---|------|------|------|
| 1 | `src/cli-checks.ts:682` REVIEW_NEG_RE | `:682` 逐字命中（字面连续 `不通过`/`未通过` · 仅中文 · 病根属实） | ✅ |
| 2 | `src/cli-checks.ts:689-721` evalReviewConclusion · `:713-714` 否定先于通过 | `:689` 起 `:721` 收 · `:713` NEG 先于 `:714` PASS（**顺序已对 · 病根确在正则覆盖面** —— task 推断属实）· `:686` REVIEW_MIN_SUBSTANCE=20（2.4-W2 定档已落地 · 注释引评审文在案） | ✅ |
| 3 | `src/cli.ts:1003/1098/1108/1125` cwd 基参缺陷 | 4 处全部命中 `printJson(process.cwd(), …)` | ✅ |
| 4 | `src/cli.ts:1299` exit-1 信封（10 棒增量） | **命中**：`:1299` `printJson(process.cwd(), { command, exitCode: 1, error: { message } })`（错误 message 可携路径 · 同根缺陷属实） | ✅ |
| 5 | `src/cli-host.ts:490/507/524/784` cwd 基参缺陷 | 4 处全部命中 | ✅ |
| 6 | 正确先例 `cli.ts:565/655/781/875` · `cli-host.ts:1232/1406` | 6 处全部 `printJson(target, …)` | ✅ |
| 7 | `src/cli-pins.ts:235` hitA 裸子串 | `:235` `statusCell.includes(dotted)` 逐字命中 | ✅ |
| 8 | `src/cli-shared.ts:412-418` / `:430` · `assets/release-pins.yaml:60-73` / `:141` · `test/cli-json-no-abs-path.test.ts` 21 测 | relativizeOutputValue value-only（key 原样 · NEW-12 出处属实）· printJson :430 · pin-08 semantics :60-73（D-24-PIN08-SEMCELL 已落地）· pin-16 `- id:` 恰在 :141 · 测试文件 `it(` 计数 = **21**（掩盖源规模属实 · runCli 默认 cwd=KIT） | ✅ |
| 9 | 基线数字（582/581+1skip · pins 17/17 · assets 110/110 · HEAD=3e60c0f） | 与报告 §1 实测值一致 · task 明注「禁前置重跑全量 npm test」（纪律正确 · 基线以报告为准） | ✅ |

## 3. 三处修正/增量的裁决（重点审查项）

### 3-1 NEW-1 正则 `\S` → `.`：**采纳（修正成立 · 兜底在位）**

- **正确性**：实测确认——D 形态「不 通过」含空格，报告原文 `不\S{0,3}通过` **盖不住**（空格非 \S）；`不.{0,3}通过` 命中 B「不予通过」（间隔 1 字符）与 D「不 通过」（间隔 1 空格）✓。报告探针表三形态 B/D/E 在新正则下全部转判未通过（本棒单测：B/D/E old=false → new=true ✓）。
- **误伤窗实测**：窗内组合误中形态**真实存在**——「这个方案不行，通过前一个方案」被 `不.{0,3}通过` 命中（本棒单测 new=true）；「不再阻塞，予以通过」（间隔 5 字符 >3）不误中 ✓。**但**：将放宽后正则（含 `no\s*pass`/`reject` · i 旗标）对**现行 51 份 PASS 审查文**结论节全量模拟 → **误伤 0/51**。误伤窗在存量面为零、在理论面存在——task 的 F-P2-04（误伤即打回调窗宽/排除词）+ 验收条「存量抽验 ≥5 份零误伤留证」双兜底与实测结论自洽。
- **已知限制**（不阻塞 · 留痕）：`.` 不跨行，「不\n通过」换行形态仍漏网（单测证实）；task R2 已留 `[\s\S]` 实现选项（节文本为 `\n` 合并 · 30 按实现现状定）。裁决意见：采纳 `.` 口径交付，换行形态作为已知残余留痕（攻击者须主动换行 · 与 NEW-11 广义词表面同属 3.0 语义化议题）。

### 3-2 NEW-9 边界正则：**采纳（修正成立 · 零误伤推断实测成立）**

- **报告原建议缺陷属实**：`(?<![0-9.])` 左边界挡不住 `v2.4.0`（v 非数字/点 · 本棒单测证实）。
- **10 棒修正版 `(?<![0-9A-Za-z._-])X\.Y\.Z(?![0-9A-Za-z._-])` 全量模拟**（对 `docs/spec/README.md` 全部表行状态格 cells[2] · truth=`2.4.0`）：
  - 存量行**零误伤成立**：全表仅 L21（`2_4-gate-strength` 行 · 状态格 `` **`2.4.0` published** ``）命中，old=true / new=true ✓；无任何存量行从命中变不命中。
  - 攻击/边界形态：`` `v2.4.0` `` → 拦 ✓ · `` `2.4.0-beta` `` → 拦 ✓ · `12.4.0` / `2.4.0.1` / `2.4.0rc1` → 拦 ✓ · 「9.9.9 同格保留 ``tag `v2.4.0```」（N9 原构造）→ 拦 ✓ · `` `2.4.0` `` / `**`2.4.0`**` / `spec-wave@2.4.0` → 放行 ✓（反引号/星号/@ 均不在排除类）。
- **附带确认**：F-W1-05「`X.Y.Z 规划中` 含点式即合格」口径不受影响（`规划中` 在版本串右侧之外 · 右边界只看紧邻字符）。hitB 不动 + suspects 同口径的写法与现行实现一致（:235-238 实读）。

### 3-3 NEW-2 增量 `cli.ts:1299` exit-1 信封纳入：**确认（合理范围延展 · 非膨胀）**

- **同根同族同文件同函数**：`:1299` 与报告所列 4 处同为 `printJson(process.cwd(), …)`，且 `error.message` 恰是携仓内绝对路径的高发面（fail 文案常含路径）——同根缺陷无疑。
- **内部一致性必需**：task 自身验收条「`grep -n 'printJson(process.cwd()' src/cli.ts src/cli-host.ts` → **0 命中**」若不修 :1299 则永不可达——纳入是验收自洽的必要条件，不是顺手工。
- **风险面**：exit-1 信封改动面小（单点）· F-P2 表已有对偶测试与零回退条款覆盖。裁决：纳入本波范围，验收条维持 grep 0 命中口径。

## 4. 发现的问题

**无 FAIL 级 · 无内容级阻塞**。提示级 1 条：NEW-1 换行形态（`不\n通过`）漏网为已知限制（§3-1 已留痕 · task R2 已留 `[\s\S]` 选项 · 归 30 实现定）——不构成退回理由。

## 结论

**R1 总结论：PASS · 零内容阻塞 · 可进 00 代签 HG-AUDIT-R1 → 30 开工。**

范围严格限报告 §6.1 四组 + :1299 同根增量（裁决确认）；三处 10 棒修正/增量全部经实测裁定成立（NEW-1 `\S`→`.` · NEW-9 边界正则挡 v 前缀 · :1299 纳入）；归 3.0 项与非范围边界无漏；验收全机械可判；failure_paths 14 条与思考轮 R0–R5 在位；闸表正确（HG-AUDIT-R1=pending blocks 30 · 00 代签授权注记 · publish 仅人）；行号抽查 9 组全部与现值吻合。

## 维护者签闸（20 后 · 30 前）

> 本 task HG-AUDIT-R1 由 **00 代签**（2026-09-14 维护者授权 · 2.3.1 同模式延续 · task 人工闸表在案）：

- [ ] 已读 R1 审查结论（含 §3 三裁决）
- [ ] 在 task 人工闸表将 HG-AUDIT-R1 改为 approved（00 代签 · 注明授权出处与日期 · status 格恰为 `**approved**` · 注记落说明列——2.4.0 闸格混格教训勿复发）
- [ ] commit task 文档（禁 `git add -A`）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

**签名**：20 审查棒（20-task-audit · R1）· 2026-09-14 · 独立上下文非起草者 · 仅书面审查未改被审对象任何字节。
