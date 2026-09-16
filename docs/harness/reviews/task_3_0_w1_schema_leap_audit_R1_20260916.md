# 审查文：task_3_0_w1_schema_leap · R1（20-task-audit）

> **hat_id**：20-task-audit · **轮次**：R1 · **日期**：2026-09-16  
> **审查对象**：`docs/tasks/active/task_3_0_w1_schema_leap.md`（3.0 W1 适配表 schema 跃迁 + 闸判定泛化 · **breaking 波** · HG-SCHEMA-CHANGE=approved（00 代签）· HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1=pending）  
> **对照真值**：SPEC `docs/spec/3_0-architecture-leap/02_w1_schema_leap_v1.md`（signed · 范围 ①–⑦ · 验收 1–9 · F-W1-01–07）· schema 评审文 `docs/harness/reviews/w1_schema_change_review_20260916.md`（00 已批准 · §2/§3/§5/§6/§7）· PLAN `PLAN_3_0_architecture_leap_v1_zh.md` W1 节 + 硬约束 3/4/6/12/15 · `00_policy_and_boundaries.md` · 格式先例 `task_3_0_w0_refactor_prep_audit_R1_20260916.md`  
> **审查性质**：书面审查 + 独立复核实测；**未改** task / SPEC / PLAN / src / test / fixtures / 脚本实质内容；**不代签** HG-AUDIT-R1（仅 00 代签）  
> **过程事故透明登记**：本审首次验证快照可再生成性时**裸跑** `scan-human-gates-baseline.mts`（其默认 out 即基线路径），误将 fixture 覆写为含 W1 task 的 76 文件版；随即按「挪开 W1 task → 确定性再生成 → 结构 diff 仅差 W1 条目 → 复原」流程**逐字复原**（复原件 78898 字节与原 ls 实测一致 · generated_at 同为 2026-09-16 · summary 75/232/12/0/11 全中）。该事故本身转化为重点 2 的正向证据与 advisory A1。

---

## 一、结论摘要

| 维度 | 结论 |
|------|------|
| **内容**（可执行性 / 与 SPEC+评审文一致性） | **PASS-with-issues**：blocking **0** · advisory **3**（A1 扫描器使用警示 · A2 行级比对有效锁口径 · A3 F-W1-11 可选机械加强；均不阻塞签闸） |
| **流程闸** HG-AUDIT-R1 | **pending**（真值以 task `### 人工闸` 表为准）；本审查文落盘即满足「20 审查文落盘」前置，签署归 **00 代签**（维护者 2026-09-16 授权模式），**pending 期间 30 拒改码**（本审 `spec-wave verify` 实测：VERIFY BLOCKED · HG-AUDIT-R1 pending · 机检咬住 ✓） |
| 思考轮 R0–R5 | 控制表填全（六轮 early_stop 全 no · residual_risks 七条每条带缓解）· R5 待本轮裁定——**本轮裁定：充分** |

---

## 二、常规核对（对照 SPEC / 评审文 / PLAN 逐项）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 ①–⑦ 与 SPEC §3 | ✅ 逐项对应且规格化 | ①–⑦ 照 SPEC 全继承，并把评审文 §2 设计转写为 S2.1–S2.7 可实施规格（schema_version 整数探测树 / hooks enum 定稿 / verify 承接 / 合并器裁定值 / command_sets / 闸泛化 / MIGRATION 要点）；SPEC 范围②形态列「schema+合并器+正负 fixture」与 task ② 一致（表改写登记为可选，见重点 4） |
| 非范围与 SPEC §4 | ✅ 全继承 + 合规增益 | SPEC 六条全在；增补 pin-17 四禁（hosts map 化 / host_id 移行级 / 13 id 变 / 表路径变）· hooks 物化归 W2（硬约束 9 文案口径）· `version` 串字段不动 · 追加语法不做 · 发布四动作仅人 · S2 不改 · 不裹挟 untracked——均与政策边界 §1/§3/§6 同向，无扩权 |
| 验收标准与 SPEC §7 | ✅ 1–9 全覆盖 + 机械化加强 | #1↔1（逐字拷贝 fixture + planned writes 逐字断言，评审文 §3.3）· #2↔2（OQ-2 九条目全固化 · 链深 8/9 边界双条）· #3↔3（双轨红绿各一组）· #4↔4（pins 17/17）· #5↔5（双锁 + manifest/行键口径）· #6↔6（泛化渲染快照断言）· #7↔7（本审 gate-check 机检实证 ✓）· #8↔8（pin-14 零改动）· #9↔9；新增 #10–#13（11 件零改动 / OQ-6 逐字 / task lint / 执行粒度）为加强项 |
| failure_paths 与 SPEC §8 | ✅ F-W1-01–07 全继承 | F-W1-07 措辞由 SPEC「某宿主表缺 commands 节」演进为「v2 表缺 command_sets 或含 forbidden」——与评审文 §2.5 fail-closed 口径一致且更准（语义等价收严）；新增 F-W1-00（沿 W0 例）+ F-W1-08–15（见重点 5） |
| 依赖 / 必读列表 | ✅ 充分 | 评审文全文 + SPEC 两件 + PLAN + 现码行号（本审抽核 12 处全中，见下）+ 表/schema + 快照与生成器 + 既有测试面 + W0 先例 + MIGRATION/RELEASING |
| 思考轮控制表 R0–R5 | ✅ 填全 | R0 证据含 OQ-5 快照固化与既有 gate 断言面实测 · R1–R3 闭合 · R4 十三条验收全机械 · R5 待本轮（裁定充分）· early_stop 全 no · residual_risks 七条逐条带缓解 |
| `### 人工闸` 表可机检性（硬约束 15） | ✅ | 闸表在 `### 人工闸` 节（parseHumanGates 采集面内 · GATE_ROW_RE `cli-shared.ts:25-26` 四单元格口径复核 ✓）；HG-SCHEMA-CHANGE / HG-TASK-DRAFT / HG-AUDIT-R1 三行 `blocks_hats` 均**显式含 30**；本审 `npx spec-wave gate-check --task …` 实测机检咬住（HG-AUDIT-R1 pending → ❌ 拒 30）· `verify` 首输出 BLOCKED ✓ |
| test_strategy 与硬约束 6（修严配负向 fixture） | ✅ 适配正确 | 本波修严型居多（schema 新校验 + 闸泛化 fail-closed 面 + command_sets 禁词机检化）：负 fixture 面明示（hooks 矛盾声明 / command_sets 缺失·禁词 / schema_version>2·非整数 / extends 循环·自继承·未知目标·链深 9 / 闸泛化新 fixture）+ 红测先行写进测试策略节；SPEC `test_strategy=required` 继承 ✓ |
| 向后兼容红线（硬约束 4）三重保险 → 可执行验收 | ✅ 三保险全落机械锁 | 保险①探测树 = S2.1（歧义边界钉死：v1 根白名单仅 `version`/`hosts` · `schema.ts:118-121` 复核 ✓）；保险②映射六行恒等 = 范围⑤ + S2.5 v1 兼容桥 + OQ-6 逐字 fixture（验收 #11）；保险③ = 验收 #1（2.4.2 表逐字拷贝 fixture + validate/apply 零改动通过 + planned writes 逐字一致快照断言）；MIGRATION 人文面 = 验收 #8 |
| 基线节数字独立复跑 | ✅ 全中 | 本审复跑：`npm test` **607 tests / 116 suites / 606 pass / 0 fail / 1 skip**（duration ≈78s · 原 4 环境红已消与 task 一致）· `npm run typecheck` **0 错** · `pins check` **17/17 PASS**（含 pin-17 13 宿主双语命中 · pin-14 MIGRATION.md:3=2.4.2）· HEAD `98d2062` ✓ |
| 现码行号抽核（12 处） | ✅ 全中 | `schema.ts`（checkS2Field :22-30 · validateVerify :92-109 · validateHostAdaptDoc :112-164 · 根白名单 :118-121 · 行白名单 :133-136 · surfaces 白名单 :143-144 · 三节必填 :153-157）· `commands.ts`（常量 :6-28 · parse :32-44 · commandEntryApplies :47-52 · legacy :60-67）· `materialize.ts:337-372`（basename 解析+missing）· `table.ts`（:7/:40-48/:51-68）· `cmd.ts:503-512`（仅 validate/apply/update · 无 `host verify` ✓）· `cli-shared.ts`（GATE_ROW_RE :25-26 · parseHumanGates :270-286 · evaluateMayStart30 :292-306 白名单 3 闸 ✓）· `gates.ts:54-98`（formatGateCheck 只渲染 3 行 ✓）· `cli-pins.ts:382-395`（直接 yamlLoad hosts[].host_id 不过 schema ✓）；`schema.json` verify :52,:86-95 ✓ · `mvp-hosts.yaml` verify 13 处（grep -c=13 ✓）· `grep hooks src` = 0 复证 ✓ |
| 行为变更类「旧测 grep 影响面」提醒（K7） | ✅ 已等价覆盖 | 本波是行为变更波；task 以验收 #10 + F-W1-13 + R0「既有 gate 测试断言面实测」落影响面，本审 grep 独立复核成立（见重点 3） |
| 硬约束 3/4/12/15 落位 | ✅ | #3：评审文先落盘 → 闸落表 blocks 含 30 → 00 代签 approved → 顺序与 OQ-7 一致；#4：见上三重保险行；#12：v1 兼容桥注入内建目录 + `--file` 自定义表零改动可读（不依赖改包发版）；#15：闸已落 task 表且机检实证 |

**常规核对结论：无 blocking。**

---

## 三、五条重点逐条结论（含本审独立复核证据）

### 重点 1 · OQ-1 触发点两点定稿（{pre-commit, pre-archive} · pre-close 合并）——✅ 论证充分、口径一致

- **「close=归档同一事件」实证**：`src/cli/task-cmd.ts:34-37`（cmdTaskClose 入口 · 注释「done_snapshot 唯绑归档事件」就在码内）与 `:138-143`（`renameSync(abs, dest)` → done/ · 真归档后 `buildDoneSnapshot`）复核全中——close 与归档是同一次 renameSync 事件，一事件两枚举值（pre-close / pre-archive）确实不可钉 fixture 且语义冗余，**合并论证充分**；
- **两值与 PLAN W2 验收语言对齐**：PLAN W2 验收①「门禁拒绝**脏提交**」（pre-commit）· W2 范围③「脏提交/脏归档」（pre-archive）⇒ 两点恰好覆盖 W2 验收语言，无第三点在 PLAN 中有对应物；
- **mechanism 三族不留扩展位**：fail-closed（未知枚举报红）+ 扩展 = schema 变更走 HG-SCHEMA-CHANGE（v3 复议）——与本仓「修严 fail-closed」纪律（硬约束 6 · P0 纪律 §2.2 禁绕过）同构，且评审文 OQ-1 处置口径（「三族定稿 · 扩展留 v3 复议 · 异议须闸批注提出」）已被 HG-SCHEMA-CHANGE=approved 吸收 ⇒ **得当**；
- **适用性矩阵与 PLAN W2 机制族口径一致性**：PLAN W2「按 W1 的『机制族』抽象：**shell-hook / config-hook / 无 hook 降级**」与 task 三族逐字一致 ✓；「shell-hook 13 宿主 git 层中立 · config-hook = claude 首选/cursor 候选（W2 取证校准）· 其余 11 宿主 none 显式降级」与 PLAN W2 验收⑥「无 hook 宿主的降级留痕 · 不得静默装作已进 L3」同向 ✓；per-host 族归属写表归 W2（F-W2-06 取证校准）的边界划分不过界。

### 重点 2 · OQ-5 比对面纪律（F-W1-09）与快照可再生成性——✅ 豁免可接受、再生成性实证成立（附使用警示 advisory A1）

- **豁免口径（本 task 闸行不入比对面）可接受**：本审实证——含 W1 task 重扫 = 76 文件 / 237 行 / 13 闸 ID / 1 行级翻转 / 12 文件级 false；与快照 75/232/12/0/11 的**结构 diff 恰好且仅为 `docs/tasks/active/task_3_0_w1_schema_leap.md` 一个文件条目**（共有 75 文件逐字相等 · meta 除 generated_at 外全等）。比对面以「快照 manifest 文件集 + 行键（file, gate_id, 出现序）」为准 ⇒ 新增文件豁免是**可机检执行**的（manifest 交集比对），非口头豁免；验收 #5② 无需改写为含本 task 口径；
- **可再生成性实证**：挪开 W1 task 后以同脚本再生成 → summary 全中（75 文件 / 232 行 / 12 闸 ID / 行级 blocks=0 / 文件级 false=11）· 行级计数复核 232 行中 `blocks_hats` 含 30 = **139** · `blocks含30 ∧ status≠approved` = **0** · 无闸节 11 文件清单与 task 点名一致（done/README + 10 份古早 planning/signoff）——脚本确直接 `import { parseHumanGates, findGate, evaluateMayStart30 } from '../src/cli-shared.ts'`（同口径实证 ✓）；
- **⚠️ 使用警示（advisory A1）**：脚本**默认 out 即基线 fixture 路径**（裸跑即覆写基线 · 本审亲历）；且 `--out=/abs/path` 会被 `path.join(REPO_ROOT, outRel)` 拼成仓内相对路径（`/tmp/x.json` → `<repo>/tmp/x.json` · 本审实证）。30 重扫一律用**仓内相对路径** `--out=test/fixtures/human-gates/rescan_<date>.json` 且**永不裸跑**；脚本/fxiture 不在本审可改范围，故作执行纪律提示（30 自检登记 · 或 10-task 下轮顺手补一句警示）。

### 重点 3 · 验收 #10（11 件 host 测试零改动）与 F-W1-13（渲染断言耦合）——✅ 「预期零改动」grep 复核成立，豁免必要且足够窄

- **既有断言面实测**（本审 grep）：`test/cli-p0.test.ts` C5 = exit code 非 0 + `/→ 30 不可开工|BLOCKED/` 文案片段；`test/gate-semantics.test.ts` = exit code（pending → exit 2）；`test/cli-flags.test.ts` = exit code + `--json` 键集（command/target/task/blocked/verdict）+ 未知参数拒绝；**test/ 内全部 `| HG-… |` 字面命中（8 件）均为输入 fixture 构造行**（造 task 文喂给 CLI），**无一断言渲染输出的行数/行字面**；`formatGateCheck` 在 test/ **零 import**、无快照断言 ⇒ 「现有断言面 = exit code + JSON 键集 + 文案片段 · 预期零改动」**复核成立**；
- **豁免必要性与窄度**：泛化渲染（3 行 → 全部 blocks 含 30 行）是有意行为变更（SPEC 验收 6 要求）；豁免钉死三条不变红线（exit code / --json 键集 / 「→ 30 不可开工」文案语义），仅放渲染行集合变化且须**逐条登记限渲染字面**——必要且足够窄；
- **11 件 host 测试**：`ls test/host-adapt-*.test.ts` = **11 件**与评审文 §5.2 表一致 ✓，全部跑 v1 格式 ⇒ 本身即 compat 锁另一半。

### 重点 4 · pin-17 四禁 + pin-14 钉点封闭性 · S2.4「可选」与 SPEC ② 相容性——✅ 封闭、相容

- **四禁封闭**：非范围表（pin-17 判据 · hosts 数组形态/行级 host_id/13 id/表路径）+ S2.4 pin-17 设计约束（违反即 extract_error fail-closed）双落；本审实证 `cli-pins.ts:382-395` 直接 `yamlLoad` 原始表逐行取 `hosts[].host_id`、**不过 schema 校验不做 extends 解析** ✓；`release-pins.yaml` pin-17 `path` 钉死 `assets/ide/host-adapt/examples/mvp-hosts.yaml` + 13 宿主 `host_hits` 键集 ✓；
- **pin-14**：`MIGRATION.md:3` = 2.4.2 版本串（pins check 实测 `[ok] pin-14` ✓）；F-W1-12 落法 = pins check 机检拦截 + 「草案节只追加」纪律——封闭；
- **「可选」相容性**：SPEC 范围②形态列 = 「schema + 合并器 + 正/负 fixture」，**未将表内容改写列为必须**；评审文 §5.1 明示「表内容改写属 W1 task 的**可选**动作 · 做与不做 pin-17 前提均成立」；task 登记为可选 + 提交信息约定将其隔离为独立 commit（pin-17 四禁守住）⇒ 与 SPEC ② 相容，且避免把不可回退面混入主 commit 序列。

### 重点 5 · F-W1-08–15 八条新增必要性——✅ 逐条必要；F-W1-11 现锁够底线、可选加强（advisory A3）

| ID | 必要性论证 | 结论 |
|----|-----------|------|
| F-W1-08 内建目录漂移 | 评审文 OQ-6 登记处置的 fixture 化（常量删除与 v1 兼容桥存在同步漂移窗 · 硬约束 4 红线的数据源）· 验收 #11 逐字断言落地 | 必要 |
| F-W1-09 比对面纪律 | SPEC residual_risks ② 闭环配套；无此条则 30 时点新增文件（含本 task 自身闸行翻转）会污染 232 行比对（本审实测污染恰为 5 行/1 翻转） | 必要 |
| F-W1-10 hooks 矛盾声明 | OQ-1 enum 定稿的直接负面（none 带 command = 「声明降级又给命令」矛盾语义）；评审文 §2.2 + 硬约束 6 负 fixture 义务 | 必要 |
| F-W1-11 resolved rows 一次性展开 | 评审文 §2.4「解析时机」架构约束落 failure_path；防下游感知 extends 致 pins/materialize 行为分裂 | 必要（可验证性见下） |
| F-W1-12 pin-14 钉点 | MIGRATION 草案「只追加」纪律的机检兜底（pins check 拦截） | 必要 |
| F-W1-13 渲染断言耦合 | 泛化渲染是有意行为变更的登记通道；本审 grep 实证现断言面无行字面耦合（预期零改动），该条兜住「万一」 | 必要 |
| F-W1-14 裹挟 / F-W1-15 越权 | 沿 W0 F-W0-09/11 先例固化；评审文 untracked 裹挟风险实测存在（本审 `git status` 复核：评审文 + active/ + 脚本 + fixtures 全 untracked ✓） | 必要 |

- **F-W1-11 可验证性判断**：现锁 = code review + 间接机械锁——九条目 fixture 断言合并输出语义（必经 resolved rows 取得）· 13 宿主 e2e · pins 17/17 · planned writes 逐字断言：若下游感知未展开行，这些断言必破 ⇒ **间接锁有实质咬合力，够底线**。可选加强（**不阻塞**）：30 可在类型层令 resolved 行类型不含 `extends` 键（编译期保证）或增一条「resolved 模型无 extends 残留」机械断言（advisory A3）。

---

## 四、发现清单

### Blocking（0 条）

无。

### Advisory（3 条 · 均不阻塞签闸 · 30 执行时落实或 10-task 下轮顺手修）

| # | 级别 | 内容 | 建议落点 |
|---|------|------|----------|
| A1 | 标注级 | 快照扫描器**默认 out 即基线 fixture**（裸跑覆写基线）· `--out` 绝对路径被 `path.join(REPO_ROOT, outRel)` 拼成仓内路径（本审实证 `/tmp/x` → `<repo>/tmp/x`）。30 重扫须用仓内相对 `--out=test/fixtures/human-gates/rescan_<date>.json` 且永不裸跑 | 30 自检结论登记；或 10-task 下轮在基线节再生成命令后补一句警示（退回非必须） |
| A2 | 口径级 | 验收 #5② 行级比对的**有效锁** = 泛化后重扫的「75 文件级 `may_start_30` 逐文件不变 + 行键集不变」（文件级走真 `evaluateMayStart30` import · 泛化后自动反映新逻辑）；扫描器行级 `verdictRow` 系旧白名单语义硬编码复刻，泛化后重扫其行级 `blocks_30_current` **不反映新行级语义**，不得以其恒等充当「零误伤」证据 | 30 写 #5② 比对断言时按此口径实施（task manifest+行键纪律内 · 无需改 task） |
| A3 | 加强级 | F-W1-11（resolved rows 一次性展开）可加类型层机械保证（resolved 行类型不含 `extends`）或「resolved 模型无 extends 残留」断言；现有间接锁（九条目 + e2e + pins + planned writes 逐字）已够底线 | 30 实施时采纳与否均可 · 采纳则登记自检结论 |

---

## 五、总结论

**PASS-with-issues**（blocking 0 · advisory 3）—— task 内容与 SPEC/评审文/PLAN/政策边界逐项一致，五条重点全部成立，关键数字（607/116/606/0/1 · typecheck 0 · pins 17/17 · 快照 75/232/12/139/0/11 · 12 处行号）经本审**独立复跑/grep/再生成比对复现**。**思考轮审查通过，充分性裁定：充分。** OQ-3（schema_version 整数 · 评审文裁定 · 委托本帽复核）：歧义边界论证复核成立（v1 根白名单仅 `version`/`hosts` ⇒ 合法 v1 表不可能含 `schema_version` 键），**复核通过**。

本审**不代签** HG-AUDIT-R1；签署归 00（维护者 2026-09-16 授权模式）。**因 HG-AUDIT-R1 仍为 pending，按纪律不附 30 Prompt**，仅出维护者签闸清单：

## 维护者签闸（20 后 · 30 前）

- [ ] 已读 R1 审查结论（本文）
- [ ] 在 task 人工闸表将 HG-AUDIT-R1 改为 approved（00 代签 · 维护者 2026-09-16 授权 · 日期）
- [ ] commit task 文档或确认已签（连同本棒交付 `scripts/scan-human-gates-baseline.mts` + `test/fixtures/human-gates/baseline_20260916.json` · 逐文件显式 add · 评审文 untracked 属上游勿裹挟）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | R1 · 20-task-audit：常规核对 12 项全过；五条重点逐条独立复核（close=归档码证 · 快照再生成结构 diff · gate 系断言 grep · pin-17/pin-14 码证 · F-W1-08–15 逐条）；独立复跑 npm test 607/606/0/1 + typecheck 0 + pins 17/17；过程事故（裸跑覆写 fixture）已确定性复原并转为 A1 证据；总结论 PASS-with-issues（blocking 0 · advisory 3）；不代签 HG-AUDIT-R1 |
