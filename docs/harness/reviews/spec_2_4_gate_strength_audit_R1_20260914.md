# 审查文 · 2.4.0 门禁强度补全 · SPEC 夹整体审查（R1）

> **hat**：20-spec-audit（书面审查 · R1 · 独立上下文 · 非起草者）
> **日期**：2026-09-14
> **被审对象**：`docs/spec/2_4-gate-strength/` 全夹 8 份（README + 00_policy_and_boundaries + 01–06 六份 wave spec · 均 signed · HG-SPEC-SIGNOFF=approved 00 代签）
> **对照基准**：[`PLAN_2_4_gate_strength_v1_zh.md`](../../roadmap/PLAN_2_4_gate_strength_v1_zh.md)（HG-NEXT-PLAN=approved）· [`.workbuddy/output/验收报告-SpecWave-2.3.0.md`](../../../.workbuddy/output/验收报告-SpecWave-2.3.0.md) §6「建议 2.4」八组 + §3.B–§3.O + §6 末口径三条 · [`ACCEPTANCE_2_3_1_patch_2_3_1_zh.md`](../../roadmap/ACCEPTANCE_2_3_1_patch_2_3_1_zh.md)「已知残余（归 2.4）」节
> **审查方式**：只读通读 8 份 + PLAN + 验收报告 §6/§3 + 残余登记；**行号现值抽查 12 处**（见 §3 抽查表）；**未改任何被审文件**。

---

## 1. 审查范围与核对项

- 范围是否严格限于 N2–N14 各组 + A2 残余（无 3.0 架构项混入 · N1/N11/N13 不重复进场）
- 非范围是否显式成表
- 验收标准是否机械化可判定（exit code / 负向 fixture / grep 断言 / 快照断言）
- failure_paths 是否列出且与风险对应
- R0–R5 思考轮控制表是否在位且回填闭合
- 人工闸表是否正确（HG-SPEC-SIGNOFF approved · HG-AUDIT-R1 pending blocks 30 · 00 代签授权注记 · HG-RELEASE 不在授权范围）
- 引用行号与现值是否一致（抽查）

## 2. 逐份核对结论

| 文件 | 结论 | 说明 |
|------|------|------|
| `README.md`（系列索引） | **PASS** | 范围八组与 PLAN 范围校核表逐组一致（N7/N8/N9→W1 · A2→W2 · N12→W3 · N2/N5→W4 · N3+口径三调+N6→W5 · N10/N14/N4→W6 · N4 仅留痕）；D-24-* 八条待决项冻结表在位；R0–R5 表在位（R5 回填「已签收」）；人工闸表正确（HG-RELEASE 明注不在授权范围） |
| `00_policy_and_boundaries.md` | **PASS** | S2 禁区 / P0 门禁 / 范围外声明（3.0 架构项 A3/A4/B2/B3/B5/C6/E3/E4/F1 · 冻结项 · C5 仅人 · N1/N11/N13 已落地）成表且与 PLAN 非范围表一致；「修严必配负向 fixture」纪律明文；对外文案三调落地前禁称口径明确 |
| `01_w1_pins_extract_fix_v1.md` | **PASS-with-issues** | 范围/非范围/方案对比/验收五条（三负向 fixture 修复前真红 + 全量回归 + 四门命令）齐备且机械可判。**问题 S1-1（内容级 · 见 §4）**：N9 定稿口径「版本真值只认状态列（cells[2]）点式串」与现行 `docs/spec/README.md:20`（2.3.1 patch 收尾行 · 待发版）冲突——该行状态格**不含点式 `2.3.1`**，新口径下现行文档将转红，与本 SPEC 验收 #4「零误伤」及 F-W1-06「误伤即返修口径不修文档」三者不能同时成立；F-W1-05 定稿位只点名「规划中」行，未覆盖「待发版 patch 收尾行」类。次要注意：§1 引用 pin-17 裸词测试行 `:374/:388`，现值为 `:373/:388`（差 1 行 · 提示级）；§1 V1 构造引用 `README.md:393`，现行 README 仅 385 行（历史实验位置 · 漂移可接受 · 提示级） |
| `02_w2_conclusion_gate_strength_v1.md` | **PASS** | **评审先行（D-24-W2-REVIEW-FIRST）为硬前置**且写入人工闸表 blocks；**候选档位 S1/S2/S3 只列不选**（§5.2 明注「评审文定夺 · 本 SPEC 不定死档位」）；不追溯存量（D-24-W2-NO-RETRO）循 D-23-W4-TRANSITION 先例且波及处置走 `legacy-gate-exempt.yaml` 留痕非静默放过；现状口径引用 `cli-checks.ts:680-704` 经抽核**全部准确**（见 §3）；验收五条机械可判（评审文存在性 · 负向 fixture exit 码对照 · 负面词守卫回归 · 波及登记与豁免留痕数核对） |
| `03_w3_output_rel_unified_v1.md` | **PASS-with-issues** | 范围三项（统一出口 + V2 四处清单 + 机械断言）与非范围（键集只增不改 · exit code 不动 · C6 归 3.0）清晰；验收 #2 断言组含**自身负向自证**（注入一处绝对路径 → 断言真红），机械可判性强。**问题 S3-1（提示级）**：背景表引用 `task close` 人类输出 `moved:`/`:1167` 与 `done_snapshot·path`/`:1171`，现值实为 `src/cli.ts:1168` 与 `:1172`（均差 1 行）；语义指向正确，不影响验收判定 |
| `04_w4_assets_observability_v1.md` | **PASS** | N2 warning 级（不升 exit 2 · 报告建议原文口径）与 N5 rebuild 追认警示范围准确；非范围含「对外口径收窄归 W5」边界正确；引用 `cli-assets.ts:9/:29/:189/:196`、安全设计 `:77/:418/:768`、guide `:3` 经抽核**全部准确**；验收五条（warning 构造 · 快照断言 · 三负向回退 · CI 语义不变 · 四门命令）机械可判 |
| `05_w5_materials_messaging_v1.md` | **PASS** | N3 物料四份二选一判据、口径三调、N6 aider 行范围与 PLAN/验收报告一致；非范围锁死纯文档波；验收五条 grep 机检可判。提示级备注（不降级）：验收 #2 的「README / 事实卡 grep『可机检』」——现行双语 README **零命中**（本棒 grep 实测），主落点实为事实卡 `.workbuddy/output/推广事实卡-2.2.0.md`；30 执行时断言应锚定事实卡防空转 |
| `06_w6_p3_cleanup_v1.md` | **PASS** | N10/N14 口径统一 + N4 仅留痕与 PLAN 一致；非范围含「N4 改行为即超 SPEC」锁死；引用 `cli-pins.ts:295-325`、`cli-task-extra.ts:73/:110-113` 经抽核**准确**；验收四条机械可判（fixture 双向 · 留痕存在性 · exit 1 回归） |

## 3. 行号现值抽查表（12 处 · 本棒只读实测）

| # | 引用 | 现值核对 | 结果 |
|---|------|----------|------|
| 1 | `src/cli-pins.ts:295` linkRe 仅 inline 形态 | :295 `const linkRe = /!?\[[^\]]*\]\(\s*(<)?([^)\s>]+)(>)?\s*\)/g` · 无 reference-definition 分支 | ✅ 准确 |
| 2 | `src/cli-pins.ts:221-258` pin-08 双判 | :233 `tail = cells.slice(2).join(' | ')`（含描述列）· :237 slug `startsWith(minorUnder + '-')` | ✅ 准确 |
| 3 | `src/cli-pins.ts:348-390` host_hits 裸词全文命中 | :373/:388 `re.test(readmeBodies[i])` 全 body 测试 | ⚠️ SPEC 引 `:374` 实为 `:373`（差 1 · 提示级） |
| 4 | `src/cli-checks.ts:680-704` reviews 闸现状 | :680 REVIEW_SECTION_HEAD_RE · :681 REVIEW_PASS_RE · :684 evalReviewConclusion · :702-704 无节判未通过 | ✅ 准确 |
| 5 | `src/cli-assets.ts:29` `.bak` 双侧排除 | :29 `if (basename.endsWith('.bak')) return true`（:9 D-23-W5-EXCLUDE 头注 · :189/:196 rebuild 输出均命中） | ✅ 准确 |
| 6 | `src/cli.ts:1017-1037` task lint JSON 直出 | :1024-1026 `lintTaskFile` 结果 `JSON.stringify(result)` 直出（`result.file` 未相对化） | ✅ 准确 |
| 7 | `src/cli.ts:571 / :899` verify/gate-check `task: taskFile` 原值 | :571（gate-check）· :899（verify）均原值入 JSON（`target` 已 toRel · `task` 未） | ✅ 准确 |
| 8 | `src/cli.ts:1106-1114 / :1148-1164` close dest 解析 + JSON 直出 | dest 绝对（:1108/:1112）· JSON 含 `dest`/`done_snapshot.path` 未相对化（:1155/:1158） | ✅ 准确 |
| 9 | `src/cli.ts:1136 / :1167 / :1171` close 人类输出 | `dest:` 在 :1136 ✅；`moved:` 实在 **:1168**（引 :1167）· `done_snapshot · path:` 实在 **:1172**（引 :1171） | ⚠️ 两处差 1 行（提示级） |
| 10 | `src/cli-status.ts:111` toRel 干净对照 | :111 `task_path: toRel(target, absTask)` | ✅ 准确 |
| 11 | `src/cli-task-extra.ts:73 / :110-113` slug 口径分歧 | :73 `extractTaskSlug(path.basename(file))` · :110 `meta.task_slug ?? slug` · :113 豁免双查 | ✅ 准确 |
| 12 | `README.md:38` aider 行 · `assets/release-pins.yaml:60-73/:137-155/:156-180` · `delivery/安全设计.md:77/:418/:768` · guide `:3` | 逐处命中（aider 行原文一致 · pin-08/16/17 数据块区间正确 · 安全设计三处口径原文在位 · guide 自述「未启用」） | ✅ 准确 |

**补充实测**：`delivery/promotion/` 4 份物料黑名单词（`四宿主|406 用例|2\.1\.3`）命中 28 处（4 份全中）——N3 事实面属实；`docs/spec/README.md:21` 已含 `2_4-gate-strength` 规划行（W1 回归约束对象在位）；`package.json` version = 2.3.1（pin-08 truth 现值）。

## 4. 问题清单（分级）

- **S1-1（内容级 · SPEC 01 / 归 W1 task 定稿位消解）**：N9「版本真值只认状态列（cells[2]）点式串」口径下，现行 `docs/spec/README.md:20`（2.3.1 patch 收尾行）状态格 = 「**signed** · **待发版**（bump 已落 · tag/push/publish 仅人）· 属 `2_3-wiring-completion` 验收后 patch …」——**不含点式 `2.3.1`**（该行当前 PASS 走旧口径 (A) 归档链接 `2_3_1` 顶包 + (B) slug `2.3.1`）。pin-08 truth 现值 = 2.3.1，新口径落地后 pins check 将对现行文档转红，与验收 #4「全部存量行零误伤」直接冲突；而 F-W1-06 纪律是「误伤即返修口径**不修文档**」。F-W1-05 定稿位只点名「`2.4.0 规划中` 类」——**「待发版 patch 收尾行」（D-SPEC-213-ROW 模板行 · 状态格惯例不含点式版本串）未被任何定稿位覆盖**。对照：2.1.3/2.2.1 收尾行状态格含点式版本（「`2.1.3` published」），2_4 规划行状态格含 `2.4.0`——**唯一缺口恰好是当前版本行**。处置建议（裁决权在 00/10 · 本棒不改稿）：30 动手前 F-W1-05 定稿须显式扩到「待发版/patch 收尾行」类（口径覆盖 or 明许修订 D-SPEC-213-ROW 模板写法——后者与「不修文档」冲突须裁决），否则 W1 验收 #4 不可达成、task 无法关账。
- **S1-2 / S3-1（提示级 · 行号漂移）**：SPEC 01 引 `:374` 实 `:373`；SPEC 03 引 `:1167`/`:1171` 实 `:1168`/`:1172`；SPEC 01 引 `README.md:393` 为 V1 实验时点位置（现 README 385 行）。均不影响语义指向与验收判定，建议各 W 波 30 自检时以现值为准并在自检结论中留更正注记。
- **S5-0（提示级）**：SPEC 05 验收 #2 grep「可机检」主落点应锚定事实卡（README 现零命中 · 断言易空转）。

**无 FAIL 级问题**：未发现 3.0 架构项混入（A3 hooks / B2/B3/B5 / C6 / E3/E4 / F1 均在非范围表明列）；未发现验收不可机判项；闸表无错误（HG-SPEC-SIGNOFF=approved 00 代签注记齐 · HG-AUDIT-R1=pending blocks 30 · HG-RELEASE 明注仅人不在授权范围）。

## 5. R0–R5 思考轮核对

- 8 份全部含 R0–R5 控制表且逐轮回填（非空壳）：R0 均钉证据出处（§3.x + 只读复核现值）；R1 范围/非范围分界与正文一致；R2 方案对比成表且有采纳/弃选理由（非单方案硬塞）；R3 边界与 00 政策文件一致；R4 `test_strategy=required` 与验收条款对应；R5 均回填「已签收」（HG-SPEC-SIGNOFF=approved · 00 代签 · 授权出处注明 2026-09-14 维护者本窗）。
- early_stop 全系列 = `no`（10-spec 棒 · 各份 R 轮走完）· 合理。
- residual_risks 各份在位且与 failure_paths 呼应；SPEC 01 residual 未预见 S1-1（待发版行类缺口）——已记入 §4 问题清单。

## 结论

**R1 总结论：PASS-with-issues（8 份 · 无 FAIL · 可进入 HG-AUDIT-R1 签闸流程）**

- 7 份直过（README · 00 · 02 · 04 · 05 · 06 · 另 03 仅提示级行号漂移）。
- SPEC 01 一项内容级问题 S1-1：**不构成退回**（定稿位机制本为吸收此类口径开放点而设 · F-W1-05 + R2 定稿位 + 20 审确认链路在位），但 00 代签 W1 HG-AUDIT-R1 时须附带条件：**30 动手前 F-W1-05 定稿显式覆盖「待发版 patch 收尾行」类并将定稿结论回填 task/SPEC 注记**，否则不予放行 30。
- 流程闸：HG-SPEC-SIGNOFF 已 approved（00 代签 · 授权链完整）；本审查不触碰闸态本身。

---

**签名**：20 审查棒（20-spec-audit · R1）· 2026-09-14 · 独立上下文非起草者 · 仅书面审查未改被审对象任何字节。
