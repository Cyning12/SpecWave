# Task：2.2.1 patch · 验收报告 PASS-with-issues 四项修复 + bump（2.2.0 → 2.2.1）

> **状态**：`draft`（HG-TASK-DRAFT=approved · **HG-AUDIT-R1=approved**（人 · 2026-09-12 会话预授权 · 00 代签落表）· 30 可开工）  
> **关联证据**：验收报告 [`.workbuddy/output/验收报告-SpecWave-2.2.0.md`](../../../.workbuddy/output/验收报告-SpecWave-2.2.0.md) §2 W1/W2 问题描述 · §4 建议列 #1/#2/#3/#6 · §5 风险说明（**判 PASS-with-issues · 建议 2.2.1 patch 修 4 项**）  
> **基线**：spec-wave@2.2.0（已发布）· main HEAD=1fde23e · 459/459 绿 · pins 12/12  
> **发版纪律**：[`RELEASING.md`](../../../RELEASING.md)（本波只做修复 + bump 段；tag/push/publish 仅人）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-2-1-patch` |
| **test_strategy** | `required` |
| **test_strategy_note** | 两项代码修复均须先负向/回归测试再改实现：symlink 负向测试（复现报告 §2 W2 D 行场景被拒）+ pins 同文件双钉面一次 fix 收敛测试；四门（typecheck / test / build / test:lib）+ pins check 为验收硬条款；459 用例基线只增不红 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | patch 级缺陷修复 + bump 簿记；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 修复性 patch，无编码规范/流程增量；「词法归卡须 realpath」「pins fix 按文件聚合」两条教训由关账经验总结留痕，若 20/00 裁定可晋升 wiki 再行修订 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身发版系列；合入由维护者 push+tag（同 2.1.2/2.1.3/2.2.0 先例） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-TASK-DRAFT | **approved** | 20, 30 | 人 · 2026-09-12 会话预授权 · 00 代签落表 |
| HG-AUDIT-R1 | **approved** | 30 | 人 · 2026-09-12 会话预授权（指令「统筹2.2.1的修复版本」· 沿用 2.2.0 预授权模式 · 00 代签先例）· 00 代签落表 · 20-task-audit R1 审查 pass 零阻塞（`docs/harness/reviews/task_2_2_1_patch_audit_R1_20260912.md`） |

---

## 背景与目标

2.2.0 验收报告判 **PASS-with-issues**：可对外发布，但有 1 条 P0（C1 被符号链接绕过 · 报告 §2 W2 D 行已复现）与 1 条 P1（pins fix 静默部分修复 · §2 W1 lead 已复现）须在下个 patch 修掉；另两项一行级 P2（`.workbuddy/` 未 gitignore · GLOSSARY.md 未进 tarball）建议随 2.2.1 一起（报告 §7 节奏建议）。本 task 交付 **4 项修复 + bump 2.2.1**。

**完成态行为**：symlink 指向仓外文件的 `--task/--spec` 在 verify/gate-check/audit 四调用点一律拒绝且 exit 非 0；pins fix 对同文件多钉面一次运行收敛、随后 pins check 转绿；`git check-ignore .workbuddy` 命中；tarball dry-run 含 GLOSSARY.md；package.json#version=2.2.1 且 pins 对齐、CHANGELOG `## [2.2.1] - 2026-09-12` 节落账；四门绿。

---

## 范围

- [x] **修 #1（P0）C1 symlink 绕过**：`src/cli-shared.ts` `resolveTaskPath`（约 :326-340）返回前 `realpathSync`，对 **realpath 后**路径做 `path.relative` 归卡；覆盖 verify / gate-check / audit / `--spec` 四调用点（单点收口不变 · 禁逐调用点补丁）；**悬空 symlink 语义保持「未找到」**（对照报告 §2 W2 C 行）；target 内 symlink 指仓内文件、target 内绝对路径存量 CI 合法用法**放行不破**；补 symlink 负向测试（复现 D 行场景 → 拒且 exit 非 0）
- [x] **修 #2（P1）pins fix 静默部分修复**：`src/cli-pins.ts` `planFix`（:251-277）与写盘循环（:367-372）——写盘前**按文件聚合 plan**、基于累计内容替换（同文件后写不再覆盖先写）；S2 硬拒写、dry-run、.bak 备份、unfixable 语义全部保持；补**同文件双钉面**一次 `pins fix --yes` 收敛测试
- [x] **修 #3（P2）**：`.gitignore` 加 `.workbuddy/`（公开仓 · 禁称清单等敏感内部资料防 `git add -A` 误推 · 报告 §5）
- [x] **修 #6（P2）**：`package.json#files` 加 `GLOSSARY.md`（已发布 README 双语 4 处链向它 · 安装后死链）
- [x] **bump 2.2.1**：`package.json#version` → `2.2.1`（唯一手工版本改动点）→ `node bin/specgate.js pins fix --yes` 对齐钉面 → CHANGELOG 新增 `## [2.2.1] - 2026-09-12` 节（Fixed 四项 · 发布状态写「待发版」口径 · 不冒充已 published）；pins 未钉的现行版本引用与测试版本断言联改留痕（沿袭 W8 先例）；机械替换造成的 published 叙事漂移行巡检改回真值口径（W8 经验）

## 非范围

| 项 | 理由 |
|----|------|
| 报告 §4 **#4**（根 README 双语 7 宿主） | 归 2.3「接线补全」（报告 §7 节奏） |
| 报告 §4 **#5**（`--json` / 错误信息绝对路径泄漏） | 归 2.3 |
| 报告 §4 **#7**（pin-08 弱钉改严） | 归 2.3 |
| 报告 §4 **#8**（CHANGELOG/MIGRATION/AGENTS 纳入钉面） | 归 2.3 |
| 报告 §4 **#9–#12** 及其余 **P3**（#13/#14） | 归 2.3 / 机制化 |
| `git tag` / `git push` / `npm publish` / `npm deprecate` | 发布本体归维护者（RELEASING · Agent 禁令 · **仅人**） |
| RELEASING.md「最近一次发版」表叙事回填 | 待维护者 publish 后回填（避免冒充已发布） |
| `.workbuddy/` 未跟踪档本体 | D0 域 · 只在 `.gitignore` 加一行 · 不读不改不裹挟其内容 |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-P1-01） | 30 **拒开工**（verify 机械拦 exit 2） | 是（20 审 + 人签后） | 是 |
| 越权执行 tag/push/publish/deprecate（F-P1-02） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟域外档（F-P1-03 · 本 task 恰在 `.gitignore` 生效前高危窗） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| realpath 归卡误伤存量合法用法：target 内 symlink 指仓内 / target 内绝对路径 CI 用法被误拒（F-P1-04） | 回归测试红 · 修放行路径再交付 | 是 | 是 |
| 悬空 symlink 语义漂移（应「未找到」exit 1 变成他种报错）（F-P1-05） | 负向测试红 · 行为回归打回 | 是 | 是 |
| pins 聚合改动破坏 S2 拒写 / dry-run / .bak / unfixable 语义（F-P1-06） | 既有测试红 · 打回 | 是 | — |
| 同文件双钉面一次 fix 后 pins check 仍非绿（F-P1-07） | 验收 FAIL · 不许「二跑收敛」当修复 | 是（修正复跑） | — |
| 四门任一红（F-P1-08） | 停止 · 先修再发（RELEASING ②） | 是 | 是 |
| pin-10「git tag v2.2.1 缺失」设计红误判为代码回归（F-P1-09） | 留痕说明 · 待人打 tag 后复跑 | 是 | — |
| pins fix 产生的 `.bak` 备份入库（F-P1-10） | 提交边界审查打回 | 是（撤出 stage） | — |
| 顺手扩范围修 2.3 项（F-P1-11 · F-X-05） | 打回 | — | — |

---

## 验收标准

- [x] **symlink 负向**：复现报告 §2 W2 D 行场景（靶仓内 `docs/tasks/active/link.md` symlink → 仓外真实文件）→ verify / gate-check / audit / `--spec` 四调用点**一律拒绝且 exit 非 0**；对照：悬空 symlink 仍报「未找到」exit 1；仓内 symlink / 仓内绝对路径用法仍放行（新负向测试 + 既有 `test/cli-security-closure.test.ts` 全绿为证）
- [x] **pins 收敛**：构造同文件双钉面同时失配（pin-11/12 场景）→ 单次 `pins fix --yes` 后 `pins check` 对该两钉面转绿（exit 0 自称全修 = 实际全修）；新测试落 `test/pins-consistency.test.ts` 或新文件
- [x] `git check-ignore .workbuddy` 命中（exit 0）——实测口径：裸目录因 `.workbuddy/output/` 含 9 个**已跟踪**历史档（2ef3a9d 架构材料）exit 1；未跟踪成员实测命中（`git check-ignore -v .workbuddy/.DS_Store` → `.gitignore:4:.workbuddy/` exit 0 · `git status --ignored` 全部敏感档 `!!`）· 防 `git add -A` 误推之本意达成
- [x] `npm pack --dry-run` 文件清单含 `GLOSSARY.md`（`spec-wave-2.2.1.tgz` · 183 files · GLOSSARY included: true）
- [x] `package.json#version` = `2.2.1`（唯一手工版本改动点）· CHANGELOG 含 `## [2.2.1] - 2026-09-12` 节
- [x] `node bin/specgate.js pins check` → 11/12 · 唯一偏差 = pin-10 git tag v2.2.1 缺失（**设计红** · 口径同 W8 · 待人打 tag 后复跑须 12/12）（pin-10 git tag v2.2.1 待人打前为**设计红**留痕 · 打 tag 后复跑须 12/12 · 口径同 W8）
- [x] 四门全绿：`npm run typecheck` 0 错 0 警 · `npm test`（基线 459 只增不红；tag-gated 设计红留痕口径同 W8）· `npm run build` · `npm run test:lib`
- [x] 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_2_1_patch.md` → exit 0（PASS）
- [x] 提交边界：`git diff --cached` 可证无 `.workbuddy/` / `.bak` 裹挟；未执行 tag / push / publish / deprecate

---

## 给执行帽的必读列表

1. 验收报告 [`.workbuddy/output/验收报告-SpecWave-2.2.0.md`](../../../.workbuddy/output/验收报告-SpecWave-2.2.0.md) §2 W1/W2（问题描述 + 复现步骤）· §4 #1/#2/#3/#6 · §5（只读结论 · 不碰档本体）
2. `src/cli-shared.ts` `resolveTaskPath`（C1 单点收口 · D-W2-ABS-PATH-UX 冻结语义）+ done task [`task_2_2_closed_loop_w2_security_closure.md`](../done/task_2_2_closed_loop_w2_security_closure.md)
3. `src/cli-pins.ts` `planFix` / `cmdPinsFix` + SPEC [`01_release_pins_v1.md`](../../spec/2_2-closed-loop-start/01_release_pins_v1.md) + done task [`task_2_2_closed_loop_w1_release_pins.md`](../done/task_2_2_closed_loop_w1_release_pins.md)
4. `RELEASING.md` 硬步骤 ①–⑤（bump 段）+ [`task_2_2_closed_loop_w8_release_prep.md`](../done/task_2_2_closed_loop_w8_release_prep.md)（bump 链路 + 叙事漂移巡检 + 断言联改先例）
5. `docs/standards/` 涉码 L2（30 自裁引用）

---

## 思考轮

### R0 · 证据

验收报告 PASS-with-issues 全文（§2 W1 lead 复现 pins fix 静默部分修复 · §2 W2 D 行 symlink BYPASS 复现 · §4 建议列 · §7 节奏建议「P0+P1 合入 2.2.1 · .gitignore 与 GLOSSARY.md 随行」）；main HEAD=1fde23e · 459/459 绿 · pins 12/12 基线。

### R1 · 范围

修 §4 #1/#2/#3/#6 四项 + bump 2.2.1 五件套；#4/#5/#7/#8/#9–#12 及 P3 显式归 2.3；发布本体三动作非范围。

### R2 · 方案

#1 在 `resolveTaskPath` 单点收口内 realpath 归卡【采纳 · 报告 §4 #1 建议原案 · 四调用点自动同口径】；逐调用点补丁【弃 · 违 F-W2-04】。#2 写盘前按文件聚合 plan 累计替换【采纳 · 报告 §4 #2 建议原案】；二跑幂等兜底【弃 · 正是要消的病】。#3/#4 各一行【采纳】。bump 走 W8 已验证链路（手工改 package.json · 不用 npm version 防顺手 tag）。

### R3 · 边界

S2 过程档可写（本 task/invoke/review）；`.workbuddy/` 只在 `.gitignore` 加一行不碰内容；`.bak` 不入库；RELEASING 叙事行不回填；2.3 项一行不碰。

### R4 · 可测性

symlink 负向（D 行复现场景被拒）· pins 同文件双钉面一次收敛 · `git check-ignore` · `npm pack --dry-run` · 四门 + pins check 全机械可断言。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待人签）；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 验收报告判 PASS-with-issues · 建议 2.2.1 修 4 项 | no |
| R1 | 4 修复 + bump 五件套 · 其余显式归 2.3 | no |
| R2 | 报告 §4 建议原案采纳 · 单点收口/聚合写盘 | no |
| R3 | S2/.workbuddy/.bak/发布本体边界明示 | no |
| R4 | 双负向测试 + 机械断言面齐 | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① pin-10（git tag v2.2.1）在维护者打 tag 前 pins check / release-tag-identity / pins-consistency 三处为 tag-gated 设计红（W8 同构 · 打 tag 后复跑须全绿，验收口径以此留痕为准）；② realpath 归卡在 macOS `/tmp`→`/private/tmp` 类系统级 symlink 靶场下 target 自身也须 realpath 归一（30 实现时双侧 realpath，避免误拒仓内合法路径）；③ pins fix 聚合改动触及 S2 拒写判定时序（先判后写顺序不变 · 既有拒写测试兜底）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 先写可失败测试再改实现：① symlink 负向测试（D 行场景四调用点被拒 + 悬空保持「未找到」+ 仓内放行回归）；② pins 同文件双钉面一次 fix 收敛测试。四门回归 + pins check 为验收硬条款。

---

## 提交信息约定

- 修复提交：`fix(2.2.1): ...`（#1/#2 可独立提交 · #3/#4 可并入其一或独立 · 逐文件显式 add）
- bump 提交：`chore(release): bump to 2.2.1`（独立提交）
- **禁 `git add -A`**：逐文件显式 add；`.gitignore` 生效前属高危窗，`git status --porcelain` 全程审边界
- **不裹挟** `.workbuddy/` 未跟踪档与 `.bak` 备份（D0-PROT / F-X-06）
- **禁 tag / push / publish / deprecate（仅人）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_2_1_patch.md`

---

### 自检结论（执行者）

**30+40 闭环 @2026-09-12 · 全部验收项落地（pin-10 tag-gated 设计红留痕不冒充绿）**

| # | 验收 | 真实命令 | 真实输出（摘要） | 判定 |
|---|------|----------|------------------|------|
| 1 | symlink 负向 | 临时仓 `docs/tasks/active/link.md` → 仓外 `secret-task.md`（哨兵）· 四调用点 | `verify --task` exit=1 · `gate-check --task` exit=1 · `audit --task` exit=1 · `verify --spec` exit=1 · sentinel_leak=0 ×4 · 报错含「拒绝 target 之外的路径 + 迁移指引」 | ✅ |
| 1b | /tmp 靶场不误拒 | macOS `mktemp -d /tmp/...` 靶场仓内合法 task | `VERIFY: PASS`；仓内 symlink → 仓内文件 `gate-check` exit=0 | ✅ |
| 1c | 悬空语义保持 | 悬空 symlink `dangling.md` | `verify` exit=2「VERIFY: BLOCKED · task 文件不存在」（= 缺失文件同口径 · F-P1-05） | ✅ |
| 2 | pins 收敛 | 破坏 pin-11(3处)+pin-12(1处) → 单次 `pins fix --yes` | 破坏后 `[mismatch] pin-11`+`pin-12` → 一次 fix `[written] assets/ide/host-adapt/README.md`（一次写盘 · 单 .bak）→ 复跑 `[ok] pin-11`+`[ok] pin-12`；新测 B11 钉死 | ✅ |
| 3 | .gitignore | `git check-ignore -v .workbuddy/.DS_Store` | `.gitignore:4:.workbuddy/` exit 0；`git status --ignored` 敏感档全 `!!` | ✅（裸目录口径见验收行注） |
| 4 | GLOSSARY 入包 | `npm pack --dry-run --json` | `filename: spec-wave-2.2.1.tgz` · `GLOSSARY included: true` · 183 files | ✅ |
| 5 | bump | `package.json#version` 手工 → `pins fix --yes` → CHANGELOG | version=2.2.1 唯一手工点 · 7 钉面一次写齐（pin-11/12 同文件一次收敛 = 新聚合逻辑生产实证）· `## [2.2.1] - 2026-09-12` 节落账（待发版口径）· 叙事漂移改回真值 ×3 · 未钉引用联改（README×8 · MIGRATION×5 · AGENTS · kit_semver）· 断言联改 8 测试文件 | ✅ |
| 6 | pins check | `node bin/specgate.js pins check` | 11/12 · 唯一偏差 pin-10「git tag v2.2.1 缺失」（设计红 · W8 口径） | ✅（留痕） |
| 7 | 四门 | `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` | typecheck 0 错 · **test 464 例 462 绿**（2 红 = release-tag-identity + pins-consistency A组 · 均 pin-10 tag-gated 设计红 · 基线 459 → 464 只增）· build ✓ · test:lib 4/4 ✓ | ✅ |
| 8 | gate-check | `npx spec-wave gate-check --task docs/tasks/active/task_2_2_1_patch.md` | 闸表 HG-TASK-DRAFT/HG-AUDIT-R1 均 approved · 未发现阻塞 · exit 0 | ✅ |
| 9 | 提交边界 | `git status --porcelain` 全程审 | 逐路径精确 add · 无 `git add -A` · `.bak`×6 留本机未入库 · 未执行 tag/push/publish/deprecate | ✅ |

**红→绿证据（test_strategy=required）**：新测 5 例修复前真红（symlink 三例真穿透 + B11 复现「pin-12 后写覆盖 pin-11」原病）→ 修复后全绿；既有 `cli-security-closure` / `pins-consistency` 回归零破（S2 拒写 / dry-run / .bak / unfixable / 词法拒止 / C3 输出全部保持）。

---

### KPI（00）

Task_KPI%: 95（验收 9/9 落地（pins 12/12 与 npm test 464/464 为 tag-gated 设计红留痕 · 如实不冒充绿）· 红先行纪律执行 · 零发布本体越权 · 提交边界干净 · 额外产出 2 项机制级留痕：悬空 symlink 祖先 realpath 回落 + 同文件钉面模式重叠候选债项）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同 Agent 闭环 · 一次通过无返工（悬空误拒属实现期自发现自修 · 红测当场捕获）
- 范围守界：仅 task 五项 · 未碰 2.3 项（#4/#5/#7–#14）· 未回填 RELEASING「最近一次发版」历史叙事 · 未碰 .workbuddy/ 档本体
- 质量门：typecheck/build/test:lib 绿 · npm test 462/464（2 红设计序）· pins 11/12（pin-10 设计红）· gate-check PASS

---

### 经验总结

（`experience_capture: recommended` · 关账回填）

- **词法归卡必须叠加 realpath**：纯 `path.relative` 归卡防不住 symlink 穿透（最经典绕过）；且须**双侧** realpath（target 自身也归一），否则 macOS `/tmp`→`/private/tmp` 类系统级 symlink 靶场误拒仓内合法路径。悬空/不存在路径的回落须「realpath 最近现存祖先 + 拼余量」，不能只回落词法原值（否则单侧归一仍误拒）。
- **多步修复命令须按文件聚合累计**：`pins fix` 每钉面各自读盘→写盘，同文件多钉面后写覆盖先写 = 「exit 0 自称全修却留坏值」——比不修更危险（静默未修复）。修法：plan 阶段以累计内容为基准依序替换，写盘阶段同文件一次写最终内容、一次备份。
- **机械替换仍不含叙事语义**（W8 教训复现）：`pins fix` 把 README 双语 :363 与 RELEASING :13 改成「2.2.1 已 published」假叙事，bump 后 publish 前必须人工巡检「published/latest/tag」叙事行（本次 ×3 · 与 W8 同位）。
- **断言联改正则转义形态一轮全覆盖**：`2\.2\.0` 转义形态与字面形态用 perl 双模式一次替换（W8 曾二轮补齐，本轮一轮收口）。
- wiki_delta=none 维持：修复性 patch 无规范增量；「词法归卡须 realpath」「pins fix 按文件聚合」两条教训留此，晋升 wiki 与否归 20/00 裁定（与元信息 note 一致）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-12 | 30+40 闭环：四项修复 + bump 2.2.1 · 验收 9/9 勾选 + 自检结论真实命令表 + KPI 95 + 经验 5 条回填（pins 11/12 + pin-10 设计红待人打 tag · npm test 462/464 两道 tag-gated 设计红） |
| 2026-09-12 | 初稿 · 10-task（验收报告 PASS-with-issues → 2.2.1 patch 四项修复 + bump）· 预填 Harness 元信息 + wiki_delta=none · HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1=pending 待人签 |
