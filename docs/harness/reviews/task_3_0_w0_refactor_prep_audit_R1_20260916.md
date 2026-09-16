# 审查文：task_3_0_w0_refactor_prep · R1（20-task-audit）

> **hat_id**：20-task-audit · **轮次**：R1 · **日期**：2026-09-16  
> **审查对象**：`docs/tasks/active/task_3_0_w0_refactor_prep.md`（3.0 W0 重构预备 · HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1=pending）  
> **对照真值**：SPEC `docs/spec/3_0-architecture-leap/01_w0_refactor_prep_v1.md`（signed）· `00_policy_and_boundaries.md` · 系列 `README.md`（D-30-VERSION-ROUTE / D-30-BARREL 定案 · W0-SPLIT 待决归本 task）· PLAN `PLAN_3_0_architecture_leap_v1_zh.md` W0.1–W0.7 · 硬约束 #1/#2/#5/#6/#8/#14/#16  
> **审查性质**：书面审查 + 独立复核实测；**未改** task / SPEC / PLAN / src / test；**不代签** HG-AUDIT-R1（仅 00 代签）

---

## 一、结论摘要

| 维度 | 结论 |
|------|------|
| **内容**（可执行性 / 与 SPEC 一致性） | **PASS-with-issues**：blocking **0** · advisory **4**（均标注/加强级，不阻塞签闸） |
| **流程闸** HG-AUDIT-R1 | **pending**（真值以 task `### 人工闸` 表为准）；本审查文落盘即满足「20 审查文落盘」前置，签署归 **00 代签**（维护者 2026-09-16 授权模式），**pending 期间 30 拒改码** |
| 思考轮 R0–R5 | 控制表填全（六轮 early_stop 全 no · residual_risks 五条）· R5 待本轮裁定——**本轮裁定：充分** |

---

## 二、常规核对（对照 SPEC / PLAN 逐项）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 ①–⑥ 与 SPEC §3 | ✅ 逐项对应 | ①②③ 拆分三文件 + barrel、④ E3 第一批（cli-g1g7/refresh · 另起 commit 隔离）、⑤ 锁③快照脚本、⑥ M1 验收文，全部照 SPEC；SPEC「40+ 符号」被精确化为实测 43/9/7（本审核独立 `grep -c '^export'` 复核：cli-checks **43** · cli-host **9** · cli **7** ✓）；行数 1458/1318/1007=3783（本审核 `wc -l` 复核一致 ✓） |
| 非范围与 SPEC §4 | ✅ 一致且有合规增益 | SPEC 五条全继承；增补的「四发布动作仅人 / SPEC·PLAN·reviews 不改动 / 上游 untracked 档不裹挟 / 不动 `src/index.ts` 等 16 模块 / W1+ 一行不碰」均与政策边界 §1/§3/§6 同向，无扩权 |
| 验收标准与 SPEC §7 | ✅ 全覆盖且机械化加强 | SPEC 五条（六重锁 / 每 commit 同绿 / E3 等价 / M1 / exports·files·bin 零改动）全部落到可执行判据；锁⑥ 五项逐条比对清单化；执行粒度（顺序 checks→host→cli · 独立可回退 · 禁 `git add -A`）与 PLAN W0.6 一致 |
| failure_paths 与 SPEC §8 | ✅ F-W0-01–06 全继承 | 新增 F-W0-00（闸未签拒开工）/07（npm cache 环境红对照）/08（spawn 口径重建）/09（`git add -A` 裹挟）/10（git shim）/11（越权发布）——六条均为本仓既有教训的固化，方向正确 |
| 依赖 / 必读列表 | ✅ 充分 | SPEC 三件 + PLAN W0 + 三 god-file 全文 + 锁② 消费者清单 + scripts 先例 + lib-smoke 本体 + done 先例 task_2_4_2 + RELEASING.md；并明示「W0.4 已被本 task 定稿表取代 · 以本 task 为准」（PLAN 授权的 task 定稿权 · SPEC §3 注同款） |
| 思考轮控制表 R0–R5 | ✅ 填全 | R0 证据含 2 处 SPEC 快照偏差（消费者 ×4 · spawn 口径）· R1–R3 范围/方案/边界闭合 · R4 可测性逐条机械可断言 · R5 待本轮（本审裁定充分）· early_stop 全 no · residual_risks 五条每条带缓解 |
| `### 人工闸` 表可机检性（硬约束 15） | ✅ | 闸表在 task 文 `### 人工闸` 节（`parseHumanGates` 采集面内）· HG-AUDIT-R1 行 `blocks_hats` **显式含 30** · 状态 pending——机检可咬；SPEC 档闸表的「复制进 task 表」要求已兑现 |
| test_strategy 与硬约束 6（负向 fixture） | ✅ 适配正确 | 本波零行为变更、**非修严型变更**，硬约束 6 的「修严配负向 fixture」义务不触发；task 以「E3 等价单测先补后删 + 六重锁」作红绿纪律形态，并在测试策略节明示理由——定性准确 |
| 硬约束 #1 S2 / #2 无绕过 / #5 分离 / #8 禁 add -A / #14 证据入库 / #16 版本路由 | ✅ 逐条落位 | S2：非范围明示只新增 M1；#2：无新增绕过参数；#5：E3 与 E4 隔离 commit；#8：提交节约 + F-W0-09 双落；#14：M1「不得只引 .workbuddy/」+ 证据入 tracked；#16：不迁 2.5.0（D-30-VERSION-ROUTE）· commit 前缀 `refactor/test(3.0-W0)`（本审注：SPEC 头部写 `feat(3.0-W0)`，task 用 `refactor/test` 更贴非功能波语义且 SPEC §5.4 同款 `refactor(3.0-W0): …` —— 以 SPEC §5.4 为准，无冲突） |
| 行为变更类 task「旧测 grep 影响面」提醒（K7 checklist） | ✅ 不适用项已等价覆盖 | 本 task 非行为变更类；锁② 消费者清单即「影响面」的机械化形态，且经本审独立 grep 复核（见重点 1） |

**常规核对结论：无 blocking。**

---

## 三、五条重点逐条结论（含本审独立复核证据）

### 重点 1 · D6 消费者增补（锁② 零 diff 断言面 10 文件）——✅ 成立，清单无漏无多

**本审独立 grep 复核**（口径：`from '.*cli-checks` / `from '.*cli-host` / `lib/cli\.js`，另补动态 `import(`/`require(` 宽口径 = **零命中**）：

- `cli-checks` 静态消费者（码面）：`src/cli-lifecycle.ts:7` · `src/cli-status.ts:18` · `src/cli-task-extra.ts:20` · `src/cli.ts:27`（拆分对象本身）· `test/cli-wiki-delta-section.test.ts:9` —— 与 SPEC §5.2 一致；
- `cli-host` 静态消费者（码面）：`src/cli.ts:8` + **4 个测试**：`test/host-adapt-sticky.test.ts`（import 块实测 :10-14，`loadHostToolsSticky`/`parseHostToolsSticky`/`HostToolsSticky`）· `test/init.test.ts:17`（`listKnownHostIds`/`parseHostToolsSticky`）· `test/host-adapt-w6-three-hosts.test.ts:9` · `test/host-adapt-w6-2_3-six-hosts.test.ts:9`（均 `listKnownHostIds`）—— **D6 增补属实**，SPEC §5.2 表确实只列了 `src/cli.ts:8`；
- `lib/cli.js` 消费者：`bin/specgate.js:2` · `bin/dsh-coding-kit.js:2`（`runCli`/`exitWithCliError`）；`package.json#bin` 实测三 bin 名 `spec-wave`/`specgate`→`bin/specgate.js`、`dsh-coding-kit`→`bin/dsh-coding-kit.js`（2 个 js 文件全在清单内 ✓）；
- 其余命中均为注释/证据字符串（`test/cli-docs-def003` 的 evidence 字段 · `assets/*.yaml` note · CHANGELOG 等），**非 import**，barrel 保路径不变即不受影响；
- 附带核实：`src/cli.ts` 的直接测试消费者**仅 `test/init.test.ts` 一个**（`grep -l "from '../src/cli.ts'"` 单命中），且已在 10 文件清单内 ⇒ 锁② 面对 ③ 亦无缺口。

⇒ **10 文件清单（3 兄弟模块 + 5 测试 + 2 bin）经独立复核：无漏、无多。** 唯一瑕疵：task 写 host-adapt-sticky 行号 `:11-15`，实测 import 块为 `:10-14`（标注级 · advisory A1）。

### 重点 2 · 锁① 基线口径（607 total 不变 + 有效基线 606 pass+1 skip）——✅ 充分，本审独立复现

**本审独立复跑（2026-09-16 · 同机）**：
- `npm test` 全量：**tests 607 / suites 116 / pass 602 / fail 4 / skipped 1** —— 与 task 基线节**逐字一致**；
- 4 红的「✖ failing tests」清单：**D8（cli-docs-122）· D8（cli-p0）· pack-hygiene 正向 · pack-hygiene 负向** —— 与 task 点名的 3 文件 4 用例**完全一致**；失败形态实测为 `npm pack --dry-run 执行失败（exit 255）`（EPERM 系）；
- **干净 cache 对照实验本审独立重做**：`npm_config_cache=$(mktemp -d)` 复跑 3 文件 → **24/24 pass / 0 fail** —— task「24/24 转绿」结论复现 ✓；
- HEAD `1067f32`、工作区 untracked 档（SPEC 系列/PLAN/审查文 + `docs/spec/README.md` 改动）与 task 基线节描述一致 ✓。

**判据充分性判断**：「环境红先对照」能防两个方向的误判 —— ① 防 30 拿环境红当借口：4 红已**点名到测试文件+用例名**，锁① 另要求「**零意外红**」⇒ 任何第 5 个红不在豁免口径内，须先过 F-W0-07 对照实验才能定性环境；② 防产品红误判为环境红：F-W0-07 明示「仍红才定性产品问题」的反向通道 +「不得为修环境改产品代码」。**判据充分**（advisory A3 仅建议 M1 登记粒度写明「文件+用例名」以消除口径游移）。

### 重点 3 · E3 烟测档位（≤5 条/文件）——✅ 档位恰当，验收已闭环

- **不过松**：44/40 调用下沉到 ≤5 条烟测 ≈ 保留 11%，且「保住 bin→CLI 全链至少一条」+ 锁④ test:lib 6/6 全链冒烟兜底，端到端面不塌；
- **不过紧**：R2 明示「建议档 · 30 可按断言聚簇微调但须保住全链烟测」，留有执行弹性；
- **「删了不补=未完成」已落验收**：验收「E3 下沉等价性」条要求 M1 列**删/补对照表** + 同口径 spawn 前后数字；F-W0-03 拒过条款 + 测试策略节「先补后删」红绿形态双落 ✓；
- SPEC §7.3 的「总 spawn 较 354 下降」被 task 按 F-W0-08 重建为同口径 ≈588 基线（本审用 `runCli(` 口径实测全套件 619 行含 39 定义行 ⇒ 580 调用，与 ≈588 存在口径差 —— task 只认「同口径前后对比」，口径选择权在 30 但须在 M1 登记 ⇒ advisory A2）。

### 重点 4 · 锁③ 快照脚本交付形态——✅ 具体可照做

- 落点 `scripts/` 先例实证存在（`scripts/check-pack-hygiene.mjs` ✓），建议名 `check-export-surface.mjs`；
- 规格四要素齐：**输入**（`lib/cli.d.ts`/`lib/cli-checks.d.ts`/`lib/cli-host.d.ts` 导出符号名集合 · 排序）· **流程**（拆前存快照 → 拆后断言逐字一致）· **前置**（`lib/` gitignore ⇒ 快照须 build 后取，已写进 R3 与 residual_risks ③）· **留证**（脚本入 git + 快照产物路径 M1 可引用）；
- 判据只要求「同一脚本前后比对 diff 为空」，提取方式的实现自由度不构成歧义（自比对自洽）。**30 可照做无歧义。**

### 重点 5 · W0-SPLIT 降级与 M1 衔接——✅ 现有约束够用，建议一处加强（不阻塞）

- 已有约束链完整：F-W0-02 要求**降级决策入 M1 验收文与修订记录**；README 待决表把 W0-SPLIT 归属本 task；「W1 只依赖 cli-host（②），不被阻塞」有 SPEC §6 收窄版 + PLAN W0.7 双真值；验收「执行粒度」条注明降级时 cli commit 不交付；
- 降级态下 M1 仍完整：锁①④⑤⑥ 与锁②（10 文件整文件零 diff）与 cli.ts 是否拆分**无关**，可照常断言；锁③ 对 `lib/cli.d.ts` 的快照在降级态下 trivially 一致（基线自封）；
- **建议加强（advisory A4）**：M1 模板宜含显式「交付范围 = 完整 / 降级（W0-SPLIT）」字段，降级时须同步写明 ① W0b 余量去向（00 排程登记）② 锁③ 对 cli.d.ts 写「未拆分 · 快照基线自封」而非跳过不写——防止降级态的证据面出现「沉默的格子」。现有 task 文已能兜住底线，此为加强项而非缺口。

---

## 四、发现清单

### Blocking（0 条）

无。

### Advisory（4 条 · 均不阻塞签闸 · 退回 10-task 下轮顺手修或 30/M1 执行时落实）

| # | 级别 | 内容 | 建议落点 |
|---|------|------|----------|
| A1 | 标注级 | task 写 `host-adapt-sticky.test.ts:11-15`，实测 import 块为 `:10-14`（文件与符号均无误） | 10-task 下轮修订记录顺手校正 |
| A2 | 口径级 | spawn 基线 ≈588 与本审 `runCli(` 口径实测（619 行 / 净 580 调用）存在口径差；task 已靠「同口径前后对比 + F-W0-08」兜底 | 30 在 M1 写明所用精确口径（含是否含定义行/其他 helper）与前后数字 |
| A3 | 加强级 | 锁① 环境红豁免已点名 4 用例；建议 M1 环境红登记统一为「测试文件 + 用例名 + 对照实验结果」三字段，任何新红一律先按产品红处置直至对照反证 | 30 落 M1 时执行（task F-W0-07 语义内，无需改 task） |
| A4 | 加强级 | W0-SPLIT 降级态下 M1 宜含显式「交付范围」字段 + W0b 去向登记 + 锁③ 对未拆文件写「基线自封」不留沉默格子 | 30 落 M1 时执行；如维护者认为须入 task 文，退回 10-task 增补一句即可 |

---

## 五、总结论

**PASS-with-issues**（blocking 0 · advisory 4）—— task 内容与 SPEC/PLAN/政策边界逐项一致，五条重点核对全部成立，关键数字（607/602+4+1 · 24/24 对照转绿 · 43/9/7 export · 10 文件消费者清单 · 行数 3783）经本审**独立复跑/grep 复现**。**思考轮审查通过，充分性裁定：充分。**

本审**不代签** HG-AUDIT-R1；签署归 00（维护者 2026-09-16 授权模式）。**因 HG-AUDIT-R1 仍为 pending，按纪律不附 30 Prompt**，仅出维护者签闸清单：

## 维护者签闸（20 后 · 30 前）

- [ ] 已读 R1 审查结论（本文）
- [ ] 在 task 人工闸表将 HG-AUDIT-R1 改为 approved（00 代签 · 维护者 2026-09-16 授权 · 日期）
- [ ] commit task 文档或确认已签
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | R1 · 20-task-audit：常规核对 10 项全过；五条重点逐条独立复核（grep + npm test 全量复跑 + 干净 cache 对照实验重做）；总结论 PASS-with-issues（blocking 0 · advisory 4）；不代签 HG-AUDIT-R1 |
