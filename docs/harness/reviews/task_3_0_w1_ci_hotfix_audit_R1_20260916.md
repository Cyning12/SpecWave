# 审查文：task_3_0_w1_ci_hotfix · 20-task-audit R1（mini task 快审）

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| 轮次 | R1 |
| 审查对象 | `docs/tasks/active/task_3_0_w1_ci_hotfix.md`（CI hotfix · bugfix 双轨跳 SPEC · mini） |
| 日期 | 2026-09-16 |
| 方法 | 书面审查 + 关键声明独立实证（行号抽核 · 全仓 readdirSync 快扫复核 · git-archive 模拟 CI 复现实验 ×2） |

## 结论摘要

- **内容**：**PASS（零阻塞 · advisory 2）** —— 范围唯一、非范围理由充分、验收 6 条全机械可执行、F-HOT-00–05 与 R0–R5 填全、residual 三条有缓解。三条重点逐条复核均成立（见下）。
- **流程闸**：`HG-AUDIT-R1 = pending`（blocks 30）—— 机检复跑 `npx spec-wave verify` → **VERIFY BLOCKED · exit 2 · ❌ 拒 30**，闸表可机检性确认。`HG-TASK-DRAFT = approved`（00 代签 · 授权真值注记在案）· `task lint` PASS（本帽复跑 PASS）。**本审查文不代签、不附 30 Prompt**，签闸清单见文末。

## 三条重点复核（10-task 留下）

### ① 验收 #4 充分性 —— 结论：**充分**

本帽独立重做模拟实验（非转述 R0）：

- **场景 A（修复前真红复现）**：`git archive HEAD | tar -x` → `git init && git add -A && git commit` → `rm -rf docs/tasks/active` → `npm ci` → 跑 `test/w1-gate-generalization.test.ts`：**恰 1 红**（叶测 14 过 1 红 · 红者即 :179 重扫锁 · `ENOENT ... scandir '.../docs/tasks/active'` at `scan-human-gates-baseline.mts:101:22`）—— 与 CI run 35066550895 真值逐字吻合，可复现性确认。
- **场景 B（掩盖实证 · residual ① 证真）**：同法 fresh clone 但把本 task 文件置入 `docs/tasks/active/`（模拟 task 提交后状态）→ **未做任何修复，15/15 全绿（0 ✖ · exit 0）**。即：本 task 文件一旦提交入 active/，CI 红即被顺带掩盖 —— residual ① 不是理论风险而是实测成立。
- **充分性推理**：验收 #4 强制临时拷贝中显式 `rm -rf docs/tasks/active`（缺陷必被激活，不受 task 文件掩盖影响）+ 必须 `git init`（防裸 archive 带出 3 个 gate-check 测红假象 · R0 已登记、本帽命令路径一致）；更关键的是验收 **#1 负向 fixture 入永久测试套件**（无 active/ 临时树 → exit 0 + skipped 注记逐字断言），该测一旦提交即在每次 CI 恒跑 —— 无守卫则恒红，**与 active/ 实际状态无关**。叠加 residual ① 明示禁令「30 不得以 CI 已绿替代守卫交付」，30 在硬约束 6 下无以「CI 已绿」蒙混的通道。**负向锁设计充分。**

### ② F-HOT-01 边界 —— 结论：**口径写清，判定充分（附 1 条 advisory）**

- 实证 `test/w1-gate-generalization.test.ts:190-191`：baseline 与 rescan 均仅解构 `{ files: FileV[] }` 键 —— **A2 比对不读 meta 任何键**；console 面 :187 仅断言 exit status 不断言 stdout。故 snapshot meta 新增 `skipped_missing_dirs`（加性键）对既有回归锁**零风险**，console 新增 skipped 行同理。
- task 层面口径：非范围首行「守卫只许影响『目录缺失』分支 · 有目录时零行为差（F-HOT-01）」+ 验收 #2（15 测全绿含 232 行逐条）/#5（manifest 文件集 + 行键逐条一致）双锁 —— 有目录路径零行为差的证明义务已机械落位。
- 既有 meta 五键（`generated_at/generator/semantics/scan_dirs/criteria` · 本帽读 fixture 核实）语义不受加性键影响；scanner :20 已 import existsSync（:173 在用），修复零新依赖。**留白**：task 未逐字明写「既有 meta 键语义零改动」，`skipped_missing_dirs` 为例式命名、最终键名/注记文案由 30 定 —— 属可接受自由度，记 advisory A2 请 30/40 守住加性原则。

### ③ 同类面登记 —— 结论：**快扫结论成立（计数瑕疵记 advisory）**

- 本帽独立全仓 grep `readdirSync`（src 26 处 + scripts 1 处）并逐面抽核守卫：`scanner:101` 确为**唯一对 git 不跟踪（可空）目录的裸 readdirSync**；`docs/tasks/*` 其余读取面（cli-status:35,57 · cli-sync:20,62 · cli-task-extra:33,93,306）全部 existsSync 守卫（本帽读码核实）；try/catch 族（test-artifacts:8-12,45-49 · cli-graph-yaml:141-145）与 failClosed（cli-assets:49）核实无误。
- 残余 3 组低危候选复核：`cli-wiki.ts:82`（walk 入口裸读 · wiki root 缺失即 ENOENT · 属实）；`cli-skills.ts:74,282`（promptsDir/skills 源裸读 · 但指向 git 跟踪非空资产 docs/harness/prompts · 「恒在」归类成立）；`cli-pins.ts:299,307`（target root 恒在 · 成立）。低危定性合理，归 W5/W7 裁定、本棒不修的边界正确。

## 常规核对（mini 精简）

| 项 | 结论 |
|----|------|
| 范围唯一性 | ✅ 单文件 `scripts/scan-human-gates-baseline.mts`（:99-104 · 改点 :101）· 双目录同式守卫 + 诊断输出，无裹挟 |
| 非范围（.gitkeep 禁令理由） | ✅ 论证成立：空目录 = 合法语义态（零采集）· .gitkeep 制造虚假不变量并掩盖根因 · 与 residual ① 实证互洽（本帽场景 B 亲证掩盖效应） |
| 验收 6 条可执行性 | ✅ 全机械：#1 负向 fixture 逐字断言 · #2 15 测 · #3 667+N 零回退+pins 17/17 · #4 git-archive 显式删目录（命令本帽逐字验证可跑 · node v24.15.0 `--experimental-strip-types` 可用 · npm ci 缓存下 230ms）· #5 manifest 逐条 · #6 task lint（本帽复跑 PASS） |
| F-HOT-00–05 | ✅ 六行填全 · 触发/行为/可重试/用户可见齐备 |
| R0–R5 | ✅ 五槽 + 控制表 early_stop 全 no + residual_risks 三条带缓解 |
| 闸表可机检性 | ✅ verify exit 2 · `HG-AUDIT-R1 pending blocks 30` ❌ 拒 30 · blocks 格含 30 |
| 基线数字抽核 | ✅ fixture 实测 75 文件 / 232 行 / 11 假 —— 与 task、:179 断言三方一致 · HEAD `f9f9c02` 核实 · active/ 零 git 跟踪（`git ls-files` 零命中）核实 |
| 行为变更类「旧测 grep 影响面」（K7） | ✅ 视同已列：本变更为健壮性修严、新行为仅限目录缺失分支 · 旧测影响面由验收 #2/#3 覆盖，不退回 |

## 发现清单

**Blocking：0**

**Advisory（不阻签闸 · 30/40 留意）**：

- **A1 · 登记节计数瑕疵**：「同类面快扫登记」称「已守卫面 16 处」，但其自列 existsSync 族清单实为 19 处（另漏列 cli-status:57、cli-skills:211 等有守卫点）。不影响「scanner:101 唯一真红面」结论与范围，归 W5/W7 排查 task 立项时订正即可。
- **A2 · F-HOT-01 加性原则成文留白**：task 未逐字写「既有 meta 五键语义零改动」；`skipped_missing_dirs` 为例式命名。30 实现时须守加性原则（不改既有 meta 键语义 · 有目录路径 console/snapshot 输出零差异），建议 40/00 复核时盯此点；验收 #2/#5 已提供机械兜底。

## 维护者签闸（20 后 · 30 前）

- [ ] 已读 R1 审查结论（内容 PASS · advisory 2 · HG-AUDIT-R1 仍 pending）
- [ ] 在 task 人工闸表将 HG-AUDIT-R1 改为 approved（维护者 · 日期；本棒授权模式下由 00 代签翻转 · 授权真值须同注）
- [ ] commit task 文档或确认已签
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 独立实证附录（本帽亲跑 · 非转述）

| 实验 | 结果 |
|------|------|
| 场景 A：git archive + git init + `rm -rf docs/tasks/active` + npm ci + 跑 w1-gate-generalization | 叶测 14 过 **1 红**（:179 · ENOENT scanner:101:22）· 与 CI 逐字吻合 |
| 场景 B：fresh clone + 本 task 文件入 active/（未修复） | **15/15 全绿 exit 0** —— residual ① 掩盖效应实证成立 |
| `npx spec-wave verify --task <本 task>` | BLOCKED · exit 2 · HG-AUDIT-R1 pending ❌ 拒 30 |
| `npx spec-wave task lint --file <本 task>` | PASS |
| fixture `baseline_20260916.json` | 75 files / 232 rows / 11 may_start_30=false · meta 五键 |
| 全仓 readdirSync 快扫 | src 26 + scripts 1 · scanner:101 唯一无守卫且面向可空目录 |

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | R1 快审落盘：内容 PASS（blocking 0 · advisory A1/A2）· 三条重点全成立 · 场景 A/B 双实证 · 流程闸 pending 不附 30 Prompt |
