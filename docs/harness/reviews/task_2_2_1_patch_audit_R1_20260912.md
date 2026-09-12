# Task Audit R1：2.2.1 patch · 四项修复 + bump（task_2_2_1_patch）

> **task**：`docs/tasks/active/task_2_2_1_patch.md`（slug: `2-2-1-patch`）  
> **证据来源**：`.workbuddy/output/验收报告-SpecWave-2.2.0.md`（2.2.0 验收判 PASS-with-issues · §2 W1/W2 · §4 表 #1/#2/#3/#6 · §7 节奏建议）  
> **日期**：2026-09-12  
> **角色**：20-task-audit（书面审 · 未改 src / test / assets / .github / package.json · 未改 task 实质内容）  
> **帽条文**：`assets/harness/prompts/20-task-audit.md`  
> **格式样板**：`docs/harness/reviews/task_2_2_closed_loop_w1_release_pins_audit_R1_20260911.md`（W1 R1）

---

## 结论摘要

| 维度 | 判定 |
|------|------|
| **内容审查** | **pass · 零内容阻塞 → 签收（本轮为终轮）** |
| **流程闸** | `HG-AUDIT-R1 → approved`（人 · 2026-09-12 会话预授权「统筹2.2.1的修复版本」· 沿用 2.2.0 预授权模式 · 00 代签落表 · 本审查文 R1 pass） |
| **思考轮审查（阶段 C）** | R0–R5 控制表齐 · 回填闭合 · early_stop 全 no 合理（草稿预置五槽 · R5 充分性留待本审裁定） |
| **下一棒** | 人签已落表 → 00 派 30（30 开工前 GATE_VERIFY 过闸） |

---

## 核对项

| # | 核对点 | 结论 |
|---|--------|------|
| 1 | **范围 5 项 = 报告 §4 #1/#2/#3/#6 + §7 节奏建议**：#1 P0 在 `resolveTaskPath` 单点收口内 realpath 归卡（报告 §4 #1 建议原案逐字对应 · 四调用点同口径 · 悬空保持「未找到」· 负向测试）；#2 P1 写盘前按文件聚合 plan 累计替换（报告 §4 #2 建议原案 · 同文件双钉面测试）；.gitignore 加 `.workbuddy/`（报告 §4 #6 + §5 风险）；files 加 GLOSSARY.md（报告 §4 #3）；bump 2.2.1 走 W8 已验证链路（§7「P0+P1 合入 2.2.1 · .gitignore 与 GLOSSARY.md 随行」） | ✅ 五项与 §7 建议一致（编号标签互换见非阻塞观察 1） |
| 2 | **非范围显式排除报告 §4 其余项**：#4（README 7 宿主）/ #5（--json 与错误文案）/ #7（pin-08 弱钉）/ #8（三面纳入钉）/ #9–#12 / P3 #13/#14 全列归 2.3；另收边 tag/push/publish/deprecate 仅人 · RELEASING 叙事不回填 · `.workbuddy/` 档本体不碰 | ✅ 与 §7「其余并入 2.3」一致 |
| 3 | **验收 9 条全机械可断言**：symlink 负向四调用点拒且 exit 非 0（对照悬空 exit 1 / 仓内放行）· pins 同文件双钉面一次 fix 收敛且 check 转绿（禁「二跑收敛」）· `git check-ignore .workbuddy` exit 0 · `npm pack --dry-run` 含 GLOSSARY.md · version=2.2.1 + CHANGELOG 节 · pins 12/12（pin-10 tag-gated 设计红口径同 W8）· 四门绿（459 只增不红）· 波末 gate-check exit 0 · 提交边界可证无裹挟 | ✅ 无「改完了」式条款 |
| 4 | **failure_paths 11 行（F-P1-01–11）**：开工闸拦截 · 越权发布 · git add -A 高危窗（恰在 .gitignore 生效前 · 点明本 task 自身风险）· realpath 误伤存量合法用法 · 悬空语义漂移 · S2/dry-run/.bak/unfixable 语义保持 · 不许二跑收敛 · 四门红停止 · pin-10 设计红不误判 · .bak 不入库 · 不扩范围修 2.3 项 | ✅ 覆盖两大修复各自退化方向 + 簿记/纪律边界 |
| 5 | **思考轮 R0–R5 闭合（阶段 C）**：控制表六轮结论齐 · R0 证据（验收报告全文 + 基线 459/459 · pins 12/12）· R1 范围 · R2 方案全采纳报告 §4 原案（逐调用点补丁弃 · 二跑幂等弃——「正是要消的病」）· R3 四条边界 · R4 可测性 · R5 待本审裁定 · early_stop 全 no 合理 | ✅ |
| 6 | **R2 残余风险 ② 技术核验（重点）**：实读 `src/cli-shared.ts:326-340`——现为纯词法 `path.relative(target, abs)` 判断；若仅对 task 路径 `realpathSync` 而不同步归一 target，macOS 下 `/tmp`→`/private/tmp` 前缀错位将使 `path.relative` 产出 `..` 开头 → **仓内合法路径被误拒，风险成立**。task 已在 residual_risks ② 明示「双侧 realpath」+ 范围 #1 列放行面 + F-P1-04 回归测试兜底 + F-P1-05 悬空语义（realpathSync 抛错须保持「未找到」exit 1）→ **给 30 的指引足够** | ✅ 风险真实 · 指引充分 |
| 7 | **禁 tag/push/publish（仅人）条款在档**：非范围行（RELEASING · Agent 禁令）+ F-P1-02 + 提交信息约定「禁 tag / push / publish / deprecate（仅人）」三处一致；bump 走手工改 package.json 不用 npm version 防顺手 tag | ✅ |
| 8 | **pre-30 invoke 三件套（required ∩ {10,20,00}）**：10、00 已落盘；本棒补 20 invoke → 三棒齐；元信息字段齐（task_slug / test_strategy=required+note / required_invoke_hats=`10,20,30,40,00` / graph_delta=none / wiki_delta=none / close_pr_policy=exempt） | ✅（本审查文落盘同棒补齐） |

## 内容阻塞

**无。**

## 非阻塞观察（不影响签收 · 留痕备查）

1. **范围项 #3/#6 编号标签与报告 §4 编号互换**：task「修 #3」内容（`.gitignore` 加 `.workbuddy/`）对应报告 §4 **#6**；「修 #6」内容（files 加 GLOSSARY.md）对应报告 §4 **#3**。每项自身已写全文件+动作+理由，集合引用「#1/#2/#3/#6」正确，30 按内容执行不会跑偏；属簿记瑕疵，30/40 回填自检时可顺手对齐口径，不构成退回。
2. **行为变更类「旧测 grep 影响面」提醒适用性**：本 task 收紧校验（symlink 拒止）属校验语义变更；test_strategy_note 已列「459 用例基线只增不红」且验收 ① 点名既有 `test/cli-security-closure.test.ts` 全绿为证 + 仓内放行回归，实质覆盖该提醒精神，无需退回补列。

## 机械闸留证（`verify --task` 实测）

闸表翻 approved 后、审查文落盘前（2026-09-12）：

```
$ npx spec-wave verify --target . --task docs/tasks/active/task_2_2_1_patch.md
task: task_2_2_1_patch.md
| gate | status | blocks_30 | 30 影响 |
|------|--------|-----------|--------|
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |

VERIFY: BLOCKED · missing R<n> review · task_2_2_1_patch.md
（exit 2 · 原因：本审查文尚未落盘 · 闸扫描表已确认 HG-AUDIT-R1=approved）
```

审查文 + 20 invoke 落盘后复跑（2026-09-12）：

```
$ npx spec-wave verify --target . --task docs/tasks/active/task_2_2_1_patch.md
task: task_2_2_1_patch.md
| gate | status | blocks_30 | 30 影响 |
|------|--------|-----------|--------|
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |

VERIFY: PASS · task_2_2_1_patch.md
（exit 0）
```

## 签闸

- **HG-AUDIT-R1 → approved**（人 · 2026-09-12 会话预授权「统筹2.2.1的修复版本」· 沿用 2.2.0 预授权模式 · 00 代签先例 · 00 代签落表 · 本 R1 审查 pass 零阻塞）· 出处：维护者本会话指令（与 HG-TASK-DRAFT 同授权链 · 00 代签先例）
- 审查文结论：**签收 · 关闭（R1 为终轮）**

## 下一棒

00 派 **30**（派工前 30 须 GATE_VERIFY：`npx spec-wave verify --target . --task docs/tasks/active/task_2_2_1_patch.md` · 预期 PASS）。**本帽不改实现码 · 不派 30。**

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | R1：零阻塞 pass · 非阻塞观察 ×2（#3/#6 编号标签互换 · 行为变更旧测面已由回归条款实质覆盖）· HG-AUDIT-R1 代签落表（维护者会话预授权）· verify 前后两轮输出如实留证 |
