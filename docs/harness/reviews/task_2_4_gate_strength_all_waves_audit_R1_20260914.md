# 审查文 · 2.4.0 门禁强度补全 · 六波 task 逐份审查（R1）

> **hat**：20-task-audit（书面审查 · R1 · 独立上下文 · 非起草者）
> **日期**：2026-09-14
> **被审对象**：`docs/tasks/active/task_2_4_gate_strength_w1_pins_extract.md` ~ `_w6_p3_cleanup.md`（6 份 · 均 active · HG-TASK-DRAFT=approved · **HG-AUDIT-R1=pending**）
> **对照基准**：各波蓝本 SPEC（`docs/spec/2_4-gate-strength/` 01–06 · signed）+ 00 政策文件 · PLAN_2_4 · 验收报告 §6/§3 · 姊妹审查文 [`spec_2_4_gate_strength_audit_R1_20260914.md`](./spec_2_4_gate_strength_audit_R1_20260914.md)（S1-1 等发现由 task 定稿位承接）
> **审查方式**：只读通读 6 份 + 行号现值抽查（见 SPEC 审查文 §3 抽查表 12 处 · 本夹复用不重复粘贴）+ **6 份全部跑 `node bin/specgate.js task lint --file …` → 全 exit 0**（结构对齐 lint E1–E8 自述属实）+ pre-30 invoke 落盘核查（`docs/harness/invokes/by-task/2-4-gate-strength-*` 6 目录齐 · hat 10 快照在同）。
> **未改任何被审文件。**

---

## 1. 逐份核对结论

| task | 结论 | 关键核对 |
|------|------|----------|
| **W1** `task_2_4_gate_strength_w1_pins_extract.md` | **PASS-with-issues**（条件见 §3 T-1） | 范围 ①②③ 逐字承接 SPEC 01 §3；非范围含「禁 --force/--allow-*」「RELEASING 双重敏感」纪律增补；验收 8 条全机械可判（三负向 fixture 修复前真红 + 全量回归 + TEST-LOCK 影响面 + gate-check + 提交边界）；failure_paths 对齐 SPEC 01 §8 + F-T-01 闸拒；行号 `cli-pins.ts:295/:348-390/:221-258` · `yaml:60-73` 抽核准确。**T-1（内容级 · 承 S1-1）**：R2 定稿位建议值「状态列含 `X.Y.Z` 点式即算行身份合格」**在现行文档上不可行**——`docs/spec/README.md:20`（2.3.1 待发版 patch 收尾行）状态格无点式串，按该建议值新口径落地即红且 F-W1-06 禁修文档；F-W1-05 定稿位未覆盖「待发版 patch 收尾行」类 |
| **W2** `task_2_4_gate_strength_w2_conclusion_gate.md` | **PASS** | **特别审查项全中**：① 评审先行写成硬前置——人工闸表下方独立注记块「评审文落盘且经 20-task-audit R1 · 缺一不可」+ F-W2-04「评审文未落盘即派 30 → 拒开工」+ 验收 ①「30 动手前硬核对」+ 必读列表第 4 条评审文；② 不追溯存量（D-24-W2-NO-RETRO）入非范围 + 范围 ④ 波及处置循 2.3.1 N11 先例（8 份豁免 · 留痕 18 · 本棒抽核 ACCEPTANCE 2.3.1 台账数字一致）；③ **档位 S1/S2/S3 未在 task 内定死**——freeze_id 行明注「强度档位本身未冻结 · 由评审文定夺后回填本 task」· R2「档位不定死 · 留评审文」。引用 `cli-checks.ts:680-704` 抽核准确；`docs/harness/legacy-gate-exempt.yaml` 存在（抽核）；D-23-W4-TRANSITION 先例在 `docs/tasks/done/task_2_3_wiring_w4_gate_wiring.md` 抽核在位 |
| **W3** `task_2_4_gate_strength_w3_output_rel.md` | **PASS-with-issues**（提示级） | 范围三项承接 SPEC 03；统一出口定案 + 形态自由度留 30（R2）合理；机械断言组含自身负向自证（验收 ②）可判性强；契约键集不动 + 冻结文案不动入非范围/failure_paths。**T-3（提示级 · 承 S3-1）**：背景节引 close 人类输出 `:1167`/`:1171`，现值 `:1168`/`:1172`（差 1 行 · 语义指向正确）；验收 ④ 判定不依赖该行号 |
| **W4** `task_2_4_gate_strength_w4_assets_observability.md` | **PASS** | 范围三项（warning · 追认警示 · 回退锁）承接 SPEC 04；rebuild 二次确认旗标 = 20 审可选项（freeze_id 行注明 · 默认警示即够 · 报告原文「如要求」非强制口径一致）；「对外口径收窄归 W5」边界在非范围明列；行号 `cli-assets.ts:9/:29/:189/:196` + guide `:3` 抽核准确；验收 8 条机械可判（WARN 构造 · 快照断言 ×2 路 · 三负向回退 · CI 不增判据） |
| **W5** `task_2_4_gate_strength_w5_materials_messaging.md` | **PASS**（提示级备注） | 纯文档波边界锁死（非范围「任何代码/测试改动」）；物料 4 份逐份处置默认快照口径明确；口径三调与 W2/W4 的依赖序（W2 落地前关账声称维持保守）入范围 ④ + F-W5-05；行号 `README.md:38`（aider 行 · 双语同步抽核 zh-CN:38 同位）· 安全设计 `:77/:418/:768` 抽核准确；promotion 4 份黑名单词实测 28 处命中（事实面属实）。**提示**：验收 ② grep「可机检」现行双语 README 零命中（本棒实测），主落点 = 事实卡 `.workbuddy/output/推广事实卡-2.2.0.md`（必读列表已含）；30 执行时贴 grep 输出须含事实卡面，防断言空转 |
| **W6** `task_2_4_gate_strength_w6_p3_cleanup.md` | **PASS** | N10 大小写不敏感 + 磁盘存在性二次确认（双平台语义一致）· N14 meta slug 优先统一 · N4 仅留痕不改行为（F-W6-04 锁死）均承接 SPEC 06；行号 `cli-pins.ts:295-325` · `cli-task-extra.ts:73/:110-113` 抽核准确；验收 7 条机械可判（fixture 双向 · 生产数据零行为变化回归 · exit 1 回归 · 留痕存在性） |

## 2. 公共结构核对（6 份通用项 · 一次核对）

- **人工闸表**：6 份全部正确——HG-NEXT-PLAN/HG-SPEC-SIGNOFF=approved（授权出处注明 2026-09-14 维护者本窗）· HG-TASK-DRAFT=approved（00 代签）· **HG-AUDIT-R1=pending · blocks 30** · 明注「维护者 2026-09-14 授权 00 代签 · 20-task-audit R1 审查文落盘后由 00 签 approved · 签前 30 拒改码」。无一份闸态越权预签。
- **范围纪律**：6 份范围均严格限于 N2–N14/A2 各自分组，无 3.0 架构项混入；非范围表均显式（含「W 其他波实现项归各自 task」互斥声明 + 「publish/tag 仅人」）。
- **failure_paths**：6 份均成表且含 F-T-01（HG-AUDIT-R1=pending 即派 30 → 拒开工）闸拒条款；各波专属 F 项与 SPEC §8 对齐。
- **验收机械可判性抽查**（≥1 处深核）：W3 验收 ②「构造任一命令传绝对路径入参 → stdout grep 仓根绝对前缀为空 + 断言组注入一处绝对路径自证真红」——纯 exit code/grep 断言 · **可机判**；W1 验收 ①–③「修复前真红复现 §3.H/§3.I/§3.J · 修复后 exit 2」——fixture 对照式 · 可机判；W5 验收 ① 黑名单词 grep + 快照标注存在性 · 可机判。未发现「我改完了」式不可判条款。
- **思考轮 R0–R5**：6 份控制表均在位；R5 early_stop=**yes（R5 止）**并附 reason + residual_risks——蓝本 SPEC 已 signed、D-24-* 冻结值落入，止轮理由成立；R0 均声明「前提只读复核有效」且与本棒抽核结果一致（除 T-3 两处差 1 行外全部属实）。
- **结构闸**：6 份 `task lint` 全 exit 0（本棒实测 · 见审查方式行）。
- **TEST-LOCK**：行为变更类波（W1/W2/W3/W4/W6）验收均含「旧测 grep 影响面逐处列出并联改」条款（20-task-audit checklist 要求项 · 齐）；W5 纯文档波以「文档影响面 grep 三组前后对照」等价承接。

## 3. 问题清单（分级）

- **T-1（内容级 · W1 · 承 SPEC 审 S1-1）**：F-W1-05 定稿位建议值不覆盖「待发版 patch 收尾行」（`docs/spec/README.md:20` 状态格无点式 `2.3.1`）。**处置要求（签闸条件 · 本棒不改稿）**：00 代签 W1 HG-AUDIT-R1 时须附带——30 动手前由 10/00 将 F-W1-05 定稿扩到该行类（口径覆盖 or 裁决修订 D-SPEC-213-ROW 模板写法 · 后者与「不修文档」冲突须显式裁决）并回填 task 注记；未消解则 30 拒开工。本 20 审**不予确认** R2 现有建议值（「状态列含点式即算行身份合格」）。
- **T-3（提示级 · W3）**：`:1167`/`:1171` → 现值 `:1168`/`:1172`；30 自检时以现值为准并留更正注记。
- **T-5（提示级 · W5）**：验收 ② grep「可机检」主落点锚定事实卡（README 零命中 · 防断言空转）。

**无 FAIL 级问题**：无范围混入 3.0 项 · 无验收不可机判 · 无闸表错误 · 无越权预签。

## 4. R1 总结论

**PASS-with-issues（6 份 · 无 FAIL · 可进入 00 代签 HG-AUDIT-R1 流程）**

- **W2 / W4 / W5 / W6 四份：零内容阻塞**，审查文已落盘，00 可依 2026-09-14 维护者授权逐波代签 HG-AUDIT-R1。
- **W3：零内容阻塞**（仅提示级行号漂移），可签。
- **W1：带条件可签**——签闸时把 T-1 写入 task（或签闸注记）作为 30 开工前置条件；T-1 未消解前 30 拒开工（与 F-W1-05/F-T-01 同链）。若 00 认为条件须由 10 棒先改稿再签，退回 W1 task 给 10-task 亦为合规路径（本审不预设）。

## 维护者签闸（20 后 · 30 前）

> 本版 HG-AUDIT-R1 由 **00 代签**（2026-09-14 维护者书面授权 · PLAN_2_4 人工闸表在案）。每波签闸前核对：

- [ ] 已读本 R1 审查结论（含 §3 问题清单）
- [ ] （仅 W1）T-1 消解方案已落定稿位/签闸注记
- [ ] 在对应 task 人工闸表将 HG-AUDIT-R1 改为 approved（00 代签 · 注明授权出处与日期）
- [ ] commit task 文档（禁 `git add -A`）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

**签名**：20 审查棒（20-task-audit · R1）· 2026-09-14 · 独立上下文非起草者 · 仅书面审查未改被审对象任何字节。
