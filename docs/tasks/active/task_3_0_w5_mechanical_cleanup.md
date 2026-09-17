# Task：3.0 W5 · 机械清扫与可诊断性（NEW-6 卫生门通配语义 + NEW-7 第二控制点定稿 + NEW-8 pins fix 备份不误删 + NEW-12 相对化覆盖对象 key + R-6 git 分档诊断与套件前置探测 + R-1 回归确认）

> **状态**：`draft`（2026-09-17 10-task 起草 · HG-TASK-DRAFT **approved**（2026-09-17 00 代签 · 授权真值：维护者本窗「授权00代签」· task lint PASS）· HG-AUDIT-R1 **approved**（2026-09-17 00 代签 · 授权真值：维护者本窗「授权00代签」· 依据审查文 docs/harness/reviews/task_3_0_w5_mechanical_cleanup_audit_R1_20260917.md · R1 PASS-with-issues blocking 0 · advisory A1–A4 带入 30 执行要求）· 双闸 approved · 30 可开工）
> **SPEC 真值**：[`docs/spec/3_0-architecture-leap/06_w5_mechanical_cleanup_v1.md`](../../spec/3_0-architecture-leap/06_w5_mechanical_cleanup_v1.md)（signed · HG-SPEC-SIGNOFF=approved 2026-09-16 · 范围 ①–⑥ · 验收 1–6 · F-W5-01–05 · 已按 2.4.2 对账收窄 · R-1 已交付不重复）
> **上游 PLAN**：[`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W5 节（:274-279）+ 硬约束 **6**（修严配负向 fixture）/ **10**（环境依赖可诊断 · :339）/ **14**（证据入库）/ **15**（闸不落表即虚设）
> **前置已兑现**：W0–W4 全 done（W4 锁终态 794/150/793 pass/0 fail/1 skip · [`task_3_0_w4_semantic_criteria.md`](../done/task_3_0_w4_semantic_criteria.md)）· SPEC signed（2.4.2 对账在案 · R-1 已由 2.4.2 交付 · 本波仅回归确认）
> **基线（2026-09-17 本棒复跑实测 · 详见「开工基线」节）**：HEAD `3664e6f` · npm test **794 tests / 150 suites / 793 pass / 0 fail / 1 skip** · typecheck 0 错 · pins **17/17**
> **行号口径**：本 task 全部行号为 2026-09-17 本棒实读现值（HEAD `3664e6f` · W0 后新布局 · SPEC 头部 ⚠️ 快照条款（`cli-host.ts:489-498,552` 等起草轮行号）已按 SPEC 自身要求回源码复核 —— R-1 现址 `src/host/cmd.ts:162-167`，见 S5.6）
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-w5-mechanical-cleanup` |
| **test_strategy** | `required` |
| **test_strategy_note** | 验收主体 = 机械锁全绿：NEW-6 变体负向 fixture（`.bak2` / `.bak.md` / `.BAK` / 尾空格 `.bak ` / `README.md.bak` 全拦 · 修复前漏网真红留证）+ NEW-8 用户既有 `.bak` 存活 fixture + NEW-12 路径为 key 相对化 fixture（断言无绝对路径 key）+ R-6 git 不可用环境模拟（PATH 隔离 · 套件显式 skip 标注 · 分档四态 fixture）+ R-1 回归确认（既有锁零回退 · 只验不回改）+ pins 17/17 + 依赖零新增 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 改的是脚本/CLI 机械面与测试探测；图谱/本体/HGM 零触碰 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 无规范增量；R-6 skip/fail 边界口径入代码注释与测试标注（注释面非规范面）· 晋升与否归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-16 维护者本窗签收 PLAN_3_0（上行继承 · 3.0 双签之一） |
| HG-SPEC-SIGNOFF | approved | — | 人 · 2026-09-16 维护者本窗签收 3.0 SPEC 系列（同时授权 00 代签后续过程文档闸 · HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗「授权00代签」· task lint PASS |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-17 00 代签** · 授权真值：维护者本窗「授权00代签」· 依据审查文 docs/harness/reviews/task_3_0_w5_mechanical_cleanup_audit_R1_20260917.md（R1 · PASS-with-issues · blocking 0 · advisory A1–A4 全部带入 30 执行要求：A1 NEW-12 键碰撞语义登记（撞名后者覆盖 · 信封不得依赖碰撞面）· A2 NEW-8 双占点名文案须含「请手动处置后重跑」指引 · A3 NEW-7 机检双锚（脚本头注释 + 测试实跑行）· A4 行号小疵注记） |

> **闸行裁决（留 20-task-audit 复核）：W5 不设 HG-SCHEMA-CHANGE 行**。理由三条：① 本波不改任何 yaml/适配表**结构格式** —— NEW-6 动 `package.json` `files` 数组内的否定项**数据行**（键形态与字段集零变更 · 类比 W4 闸行裁决②按已批准 schema 写数据）；② R-6 若给 pins JSON 信封加 `error_kind` 字段属 **additive 扩键**，契约「键集只增不改」（`src/cli-shared.ts:433` 注释面）显式允许只增；③ NEW-12 的 key 相对化是对既有相对化契约的**修订登记**（键改写不增删键集 · 详见 S5.4），其人闸通道是 HG-AUDIT-R1（本表在案）。**升级条款（30 执行期 STOP 通道）**：若执行期发现须新增/改名/删除 yaml 键结构、或须删除既有 JSON 键 → **STOP**，先评审文 → 走 HG-SCHEMA-CHANGE 式人闸 → 才改码（硬约束 3）。

---

## 背景与目标

2.4.x 验收攒下一批机械面小债与一条真实教训（R-6：git 依赖不可诊断 —— 2.4.1 验收时环境 git 不可用导致门禁红但无法归因）。本波集中清扫，全部为低风险机械面（P3×4+P2 · SPEC §1）。**2.4.2 对账**：R-1（`host validate` 缺省基取仓根）已交付，本波**只回归确认不重新实现**（SPEC 范围⑥ · 只验不回改 · 防本波机械清扫误伤）。

本 task 把 SPEC 范围 ①–⑥ 规格化为 30 可执行面（S5.1–S5.6），每条修严配负向 fixture（红测先行 · 硬约束 6），R-6 落地硬约束 10（环境依赖可诊断）。

---

## 开工基线（2026-09-17 本棒复跑实测 · 验收比对的唯一基准）

> 30 开工时若复跑结果与本表不符，按 F-W0-05 同式纪律处置（以复跑实测重建基线并登记 · 不得沿用旧数字强行比对）。

| 项 | 实测值 | 备注 |
|----|--------|------|
| git HEAD | `3664e6f` | 工作区 clean（本 task 起草后 +1 untracked）· tag `v2.4.2` 存在 |
| `npm test` | **794 tests / 150 suites / 793 pass / 0 fail / 1 skip** | duration ≈89s · 与 W4 锁终态逐字一致（复跑确认） |
| `npm run typecheck` | **0 错** | strict + noUncheckedIndexedAccess |
| `node bin/specgate.js pins check` | **17/17 PASS** | pin-10 = git-tag 钉（`assets/release-pins.yaml:102-108` · fixable=false · git 操作仅人 F-A1-05） |
| NEW-6 现值 | `scripts/check-pack-hygiene.mjs:25` 黑名单 = 精确后缀 `/\.bak$/i` + `/~$/` + `/(^|\/)\.DS_Store$/` | `.bak2` / `.bak.md` / 尾空格 `.bak ` 全**漏网**（本波 fixture 红测面） |
| `package.json` 打包面 | `files` 否定项仅 `"!assets/**/*.bak"`（:35）· `prepublishOnly` 链 :43（typecheck → test → build → test:lib → pins check → assets verify → check-pack-hygiene） | 否定项与卫生门语义已分叉（精确 vs 将改通配）· NEW-7 控制点现状 = 单点 prepublishOnly |
| NEW-7 事实第二控制点 | `test/pack-hygiene.test.ts`（:17 在 `npm test` 内实跑 hygiene 脚本 · 正向 PASS + 负向 trap.bak exit 2）· CI `.github/workflows/ci.yml:30-33` 跑 `npm test` | 卫生门脚本已被 CI 每 push 实跑 —— 定稿建议见 S5.2 |
| NEW-8 现值 | `src/cli-pins.ts:697-699`：`copyFileSync(abs, abs+'.bak')` → 写盘 → `unlinkSync(abs+'.bak')` | 同名既有 `.bak` 被 copyFileSync **静默覆盖**后被 unlink **删除** —— 用户文件零预警损失（实锤面） |
| NEW-12 现值 | `src/cli-shared.ts:434-456` `relativizeOutputValue`：walk 只改字符串 value（:449 `out[k] = walk(vv)` 键名不动）· 契约注释 :433「键集只增不改」 | 对象 **key** 含绝对路径时不相对化（本波 fixture 红测面） |
| R-6 现值 | `src/cli-pins.ts:118-131` git-tag：`execFileSync('git',...)` catch 一刀切 → `extract_error` detail「git 不可用或 target 非 git 仓」（:129） | git 不存在 / 执行失败（如 license 未同意 exit 69）/ 非 git 仓 三因不分 · 不可归因（2.4.1 验收真实教训） |
| git 依赖测试面（全仓盘点） | **4 文件**：`test/w2-shell-hook.test.ts`（:47-49 `gitAvailable()` 探测 + 4 处 `t.skip` 先例 :84,141,176,194 · **已合规**）· `test/release-tag-identity.test.ts`（:23,33 无探测 · git 缺席即 FAIL）· `test/pins-consistency.test.ts:562`（`git init` assert status 0 · 无探测即 FAIL）· `test/cli-refresh-ide-blocks.test.ts`（`initGitRepo` :112-116 · 消费点 :324,693 · 无探测即 FAIL） | 后三文件为本波 R-6 前置探测改造面 · w2-shell-hook 为既有合规范例（硬约束 10 已落地形态） |
| R-1 现址（W0 后新布局） | `src/host/cmd.ts:162-167`（缺省基 = `findGitRoot(path.dirname(abs))` 上溯 · `--target` 显式优先）· `findGitRoot` 唯一实现 `src/cli-shared.ts:37` | SPEC 快照行号 `cli-host.ts:489-498,552` 已随 W0 拆分迁移 · 回归锁 = `test/cli-json-no-abs-path.test.ts:536-587`（2.4.2 R-1 describe · 跨目录缺省基/realpath/仓外/symlink 四 fixture） |
| 依赖基线 | `package.json` dependencies = **仅 `js-yaml`** | 本波零新依赖（非范围 · PLAN W5 明示） |
| CI 卫生门步 | `.github/workflows/ci.yml:30-33` 无 hygiene 独立步（npm test 内含 pack-hygiene.test.ts） | NEW-7 案 A 候选落点 · 本 task 荐案 B（S5.2） |

---

## W5 实现规格（10-task 定稿 · 30 按此实施）

### S5.1 NEW-6 · 卫生门通配语义（SPEC 范围① · 验收 1）

- **改造点**：`scripts/check-pack-hygiene.mjs:25` 黑名单由「精确后缀相等」（`/\.bak$/i`）改「扩展名语义通配」。
- **通配口径（fixture 驱动 · 下述变体全拦为硬判据）**：`.bak` / `.BAK`（大小写）· `.bak2` / `.bak.md`（后续扩展段）· 尾空格 `.bak ` · `README.md.bak`（npm readme 自动入包规则面 · 既有 trap 先例）。
- **⚠️ 起草发现（留 20 复核 · 30 注意）**：SPEC §5/PLAN 示例正则 `\.(bak|BAK)(\.|$| )` **拦不住 `.bak2`**（`2` 不在 `(\.|$| )` 字符集内）—— 正则选型以 fixture 变体全拦为准，候选 `/\.bak/i`（子串级 · 覆盖最全但误拦面最大）或 `/\.bak(\.|$|[0-9]| )/i`（边界扩展式）；选型须连同**误拦面分析**（F-W5-04：合法文件名含 `.bak` 子串的枚举 + 白名单评审口径）一并入自检结论。`*~` 与 `.DS_Store` 两族行为不变。
- **`package.json` `files` 否定项同步**（打包面与卫生门不分叉）：`!assets/**/*.bak`（:35）扩为 glob 可表达面（如 `!**/*.bak` + `!**/*.bak.*` 形态 · 具体以 30 实测 `npm pack --dry-run` 清单为准）；**glob 不可表达面**（npm readme 自动入包规则命中 `README*.bak*` · 既有 trap 注释在案 `test/pack-hygiene.test.ts:30-32`）由卫生门通配兜住 —— 分工注释写入 `check-pack-hygiene.mjs` 头注释与 `package.json` 相邻注释位（JSON 无注释 → 注释落脚本侧 + 本 task 登记）。
- **负向 fixture（红测先行 · 硬约束 6）**：`test/pack-hygiene.test.ts` 扩展 —— 逐变体造 trap 文件（`.bak2` / `.bak.md` / `.BAK` / `尾空格.bak `）→ **修复前漏网（PASS · 真红留证）· 修复后 exit 2 点名**；清除后复绿；正向用例（:22-28）零回退。
- **同族盘点（登记级 · 非扩范围）**：`src/cli-assets.ts:32`（`basename.endsWith('.bak')` · manifest 排除面 D-23-W5-NOBAK/EXCLUDE）为同黑名单家族精确后缀 —— 30 执行期评估是否同步通配：同步则登记既有面 diff，不同步则在该行注释显式声明分叉理由（两口径皆须入自检结论 · 不得静默）。

### S5.2 NEW-7 · 卫生门第二控制点（SPEC 范围② · **本 task 定稿：案 B 显式声明 + 指认事实第二控制点**）

- **两案评估**：
  - **案 A（新增第二控制点）**：`ci.yml` 加 `node scripts/check-pack-hygiene.mjs` 独立步。评估：**冗余** —— `test/pack-hygiene.test.ts:17` 已在 `npm test` 内实跑该脚本（正向 PASS + 负向 trap 自证 failClosed），`ci.yml:31` 每 push 跑 `npm test`；且 `prepublishOnly` 链（:43）自身也是先 `npm test`（内含 hygiene 测试）再独立跑脚本 —— 同一脚本在发布链路已跑两遍。新增 CI 步 = 第三遍同义执行，零新保障面，增 CI 维护面。
  - **案 B（显式声明 · 本 task 荐案采纳）**：核心风险是「以为有双保险」的隐性单点（SPEC §6 表），而非缺执行面 —— 事实第二控制点**已存在**（CI npm test 内含 hygiene 测试）。案 B 将其**显式化**：① `check-pack-hygiene.mjs` 头注释补「控制点声明：本脚本控制点 = prepublishOnly 末端（:43）+ npm test 内 pack-hygiene.test.ts（CI 每 push 实跑 · ci.yml:31）· 无第三控制点 · 勿默认有额外双保险」；② 本 task 登记该口径；③ 机检断言：pack-hygiene.test.ts 增注释锚 grep 断言（声明文案在案 · 防注释被静默删）。
- **升级通道（留 20 裁定）**：若 20-task-audit 认为「测试内实跑 ≠ 独立控制点」（例如担忧测试被整体 skip 时控制点塌缩）→ 改案 A（CI 加独立步）· 属档位裁定非范围违约 · 本 task 两案皆已规格化，切换零返工。

### S5.3 NEW-8 · pins fix 备份不误删（SPEC 范围③ · 验收 2）

- **改造点**：`src/cli-pins.ts:697-699`。现状实锤：`copyFileSync(abs, abs+'.bak')` **静默覆盖**用户同名既有 `.bak`，写盘成功后 `unlinkSync` 将其**删除** —— 用户文件零预警损失。
- **定稿口径（存在即改名/跳过 · SPEC §5）**：写前备份命名 —— `<file>.bak` 空闲则用（旧行为不变）；**已被占 → 改用 `<file>.pins-fix-backup`**（避开 `.bak` 后缀 · 防万一残留被 NEW-6 通配拦下 · 亦与既有 trap 面正交）；**两级皆被占 → 该文件跳过写盘**，输出点名并计入不可修面 exit 2（failClosed · 不无备份写盘 · 用户文件零损失优先于修复便利）。写盘成功后只清理**本次自写**的那份备份（跟踪实际用名 · 2.3.1 N1-d 语义不变：只清自写 · F-P2-08）。
- **dry-run 文案同步**（:684「写前备份 <file>.bak」→ 口径更新为改名避让语义）。
- **负向 fixture（红测先行）**：temp 仓 fixture · 目标文件旁预置用户自有 `<file>.bak`（内容marker）→ `pins fix --yes` → 断言：用户 `.bak` **存活且内容逐字不变** · 目标文件已修 · 自写备份已清理 · 修复前（旧码）该 fixture 真红（用户 `.bak` 被删）留证 · 修复后转绿。

### S5.4 NEW-12 · 相对化覆盖对象 key（SPEC 范围④ · 验收 3）

- **改造点**：`src/cli-shared.ts:434-456` `relativizeOutputValue`：walk 对象分支（:447-451）当前 `out[k] = walk(vv)` 键名不动 → 改为 **key 亦经 walkString 相对化**（`out[walkString(k)] = walk(vv)` · 与 value 同函数同 bases 口径）。
- **契约修订登记**：:433 注释「键集只增不改」修订为「键集只增不改（键**集合**）· 含绝对路径基串的 key 会被相对化改写（NEW-12 · 3.0-W5）」—— 不改键的**存在性集合**语义（相对化是改写非增删）· 消费方若以绝对路径为 key 查表须同步修（F-W5-05）。
- **消费面盘点（F-W5-05 · 本棒已预查）**：全仓 `printJson`/`relativizeOutputValue` 消费点约 30 处（cli-verify / cli-lifecycle / cli-task-cmd / cli-status / cli-graph / cli-assets / cli-pins / host/cmd / host/report 等），既有 JSON 信封**无一以绝对路径为 key**（`cli-json-no-abs-path.test.ts` `assertJsonNoAbsRoot` 全绿反证）· `Object.keys` 快照断言面（:203/:224/:254/:301/:316/:353/:411 等）断言的是固定字段集非路径 key · pins-consistency:1429 `host_hits` 键为宿主 id 非路径 —— **预期零消费面波及**。30 执行期仍以 F-W2-13 同式纪律复核：任何既有断言受影响逐条登记 · 不得静默改断言。
- **fixture（红测先行）**：构造以绝对路径为 key 的对象经 `relativizeOutputValue` → 断言**无绝对路径 key**（key 已相对化）· value 相对化零回退 · 无路径 key 的对象逐字不变（零改写面锁）。落点建议：既有 `cli-json-no-abs-path.test.ts` 扩 selfproof 系（:162-190 同构）或单测直调导出函数。

### S5.5 R-6 · git 分档诊断 + 套件前置探测（SPEC 范围⑤ · 验收 4 · 硬约束 10 落地）

- **CLI 分档（`src/cli-pins.ts:118-131`）**：git-tag extract 的 catch 一刀切 → 按因分档四态：
  1. **git 不存在/不可执行**（spawn ENOENT 等）→ `extract_error` · detail「git 不存在或不可执行（环境不具备 · 硬约束 10）」· 加 additive 字段 `error_kind: 'git_missing'`；
  2. **git 执行失败**（非零 exit 且非「非 git 仓」· 含 license 未同意 exit 69 面）→ `extract_error` · detail 带 exit code/stderr 摘要 · `error_kind: 'git_exec_failed'`；
  3. **非 git 仓**（exit 128 / stderr 含 not a git repository）→ `extract_error` · detail 点名 · `error_kind: 'not_git_repo'`；
  4. **tag 缺失**（git 正常返回但无该 tag）→ 维持既有 `missing` 态（:127 · 「git 操作仅人 F-A1-05」）不改动。
  `error_kind` 为 additive 扩键（契约允许只增 · 闸行裁决②）· 人读输出（printCheckHuman :602-622）同步带分档文案。
- **exit code 语义零变更（非范围红线）**：`extract_error` 仍计入 bad → `pins check` exit 2（cmdPinsCheck :626-636 不动）。**skip/fail 边界口径（本 task 定稿 · SPEC §5 口径机械化）**：**skip 是测试套件语义，不是 CLI 放行** —— 套件层：git 环境不具备 → `t.skip` 显式标注（不算红也不算绿）；CLI 门禁层：git 不可用仍 exit 2（failClosed 不降级），但 detail/`error_kind` 使「环境不具备」与「钉面真偏差（missing/mismatch）」**输出可区分**（前者 `error_kind` 三态 · 后者真偏差仍 exit 2 · SPEC 验收 4 原文「后者仍 exit 2」的完整语义 = 两者 exit 码同为 2 但归因分档可区分 · 不存在第三条 exit 码）。
- **套件前置探测**：对无探测的三文件补齐（以 `w2-shell-hook.test.ts:47-49` `gitAvailable()` 为既有合规范例 · 可抽共享 helper 或各文件同构 · 30 择一并注释口径统一）：
  - `test/release-tag-identity.test.ts`（:23,33）→ describe 级前置探测 · git 不可用 → `t.skip('git 不可用（环境不具备 · 硬约束 10 · R-6）')`。**注意**：git 可用但 tag 缺失 = 真偏差 · 维持 FAIL（发布溯源纪律 · 该文件头注释 :14-16 在案）—— 这正是 skip/fail 边界的负向对照面；
  - `test/pins-consistency.test.ts:562`（git init assert）→ 同口径 skip；
  - `test/cli-refresh-ide-blocks.test.ts`（`initGitRepo` :112-116 · 消费点 :324,693）→ 同口径 skip。
  skip 标注文案统一含「环境不具备 · 硬约束 10」锚（机检 grep 断言 · 与「钉面真偏差 exit 2」输出可区分）。
- **负向实证（红测先行 + 环境模拟）**：PATH 隔离模拟 git 不可用（子进程 env PATH 置换为无 git 目录 · 跨平台注意 `PATHEXT`/win32 · 参照 `check-pack-hygiene.mjs:8` 平台分支先例）→ 跑上述三文件（或其子集）→ 断言：**显式 skip（skipped 计数 + 标注文案）而非 fail（fail=0）**；同环境下 `pins check --json` 对 git-tag pin 输出 `error_kind: 'git_missing'` 分档（与真偏差 `missing`/`mismatch` 形态可区分断言）。

### S5.6 R-1 回归确认（SPEC 范围⑥ · 非实现 · 只验不回改）

- **基线行为（2.4.2 交付 · W0 后现址）**：`src/host/cmd.ts:162-167` 缺省基 = `findGitRoot(path.dirname(abs))` 上溯 · `--target` 显式优先 · `findGitRoot` 唯一实现 `src/cli-shared.ts:37-48`（仓外回落 null → `outside_repo` 面）。
- **回归锁（已存在 · 本波零新增实现）**：`test/cli-json-no-abs-path.test.ts:536-587` 2.4.2 R-1 describe（跨目录缺省基 :543-545 · realpath 入参 :557-559 · 仓外文件 :570-572 · symlink --target :585-587）。
- **本波动作**：① 上述回归锁全绿（npm test 内含）· ② `src/host/cmd.ts:162-167` 与 `src/cli-shared.ts:37-48` **零 diff** 断言（git diff 输出入自检结论）· ③ 手工跨目录复跑一条（`cd /tmp && node <仓>/bin/specgate.js host validate --file <绝对路径> --json` → 无绝对路径输出 · 输出入自检结论 · 硬约束 14 证据面 = 自检结论文本非仓外文件）。**任何回改冲动 = STOP**（本波若发现 R-1 行为偏差 → 登记回 00 · 不在本波修）。

---

## 非范围（SPEC §4 全继承 + 本棒明示）

| 项 | 理由 |
|----|------|
| 重做卫生门架构 | PLAN W5 明示（SPEC §4） |
| 引入新依赖 | PLAN W5 明示（dependencies 仍仅 `js-yaml` · lock 非 dev 顶层不增） |
| 改 exit code 语义 | PLAN W5 明示 —— **R-6 边界**：skip 仅限**测试套件层**「环境不具备」（git 不存在/不可执行）· CLI 门禁层 git 不可用仍 exit 2（failClosed 不降级）· 靠 detail/`error_kind` 分档达成可诊断 · **不存在**「环境不具备 → exit 0 放行」的第三条路 |
| R-1 重新实现 | 已由 2.4.2 交付（SPEC §4）· 本波只回归确认（S5.6 只验不回改） |
| 修改 `pins check` 计数/汇总语义 | PINS PASS/BLOCKED 汇总口径（:616-621）零触碰 · 仅 detail/`error_kind` additive |
| `*~` / `.DS_Store` 黑名单族语义变更 | NEW-6 仅 `.bak` 族通配化 · 其余两族不动 |
| tag/push/publish/deprecate | 仅人（RELEASING.md · 无代跑授权） |

---

## failure_paths

| ID | 触发 | 行为 | 可重试 | 用户可见 |
|----|------|------|--------|----------|
| F-W5-01（继承 SPEC） | git 不存在 / 不可执行 | 套件显式 skip 并标注「环境不具备 · 硬约束 10」· CLI 侧 `extract_error` + `error_kind: 'git_missing'` · exit 2 保持（failClosed 不降级）· 输出与真偏差可区分 · 套件层不算红也不算绿 | 是 | 是 |
| F-W5-02（继承 SPEC） | git 存在但钉面真偏差 | exit 2（failClosed 不降级）· `missing`/`mismatch` 态 + 分档诊断 · 与「环境不具备」三态 `error_kind` 可区分 | 是 | 是 |
| F-W5-03（继承 SPEC） | 用户自有 `.bak` 与 pins fix 备份同名 | 改名避让（`.pins-fix-backup`）· 两级皆占 → 跳过该文件写盘 + exit 2 点名 · 用户文件零损失（NEW-8 目标行为） | 是 | 是 |
| F-W5-04（继承 SPEC） | 卫生门通配误拦合法文件 | 误伤可枚举（fixture 变体表为界）· 白名单修正须评审（不通配到语义模糊面）· 选型误拦面分析入自检结论 | 是 | 是 |
| F-W5-05（继承 SPEC） | 相对化 key 后 JSON 消费方（脚本/测试）依赖旧 key | 消费面盘点（S5.4 已预查 · 预期零波及）· 任何既有断言受影响 → F-W2-13 同式逐条登记 · `Object.keys` 快照断言兜底 | 是 | 是 |
| **F-W5-06（本棒新增）** | `.pins-fix-backup` 避让名亦被占 | 该文件跳过写盘 · 计入不可修面 exit 2 点名（不无备份写盘 · 零损失优先）· 不递增造第三级名（复杂度不引入） | 是 | 是 |
| **F-W5-07（本棒新增）** | git 前置探测误判（git 存在但执行即败 · 如 license 未同意 exit 69） | 探测须实跑 `git --version` 类命令判 status（`w2-shell-hook.test.ts:48` 先例已是实跑式 · 非仅 PATH 查找）· 探测失败 = 不可用 → skip 同口径 | 是 | 是 |
| **F-W5-08（本棒新增）** | PATH 隔离模拟在 win32 失真（PATHEXT/ npm.cmd 面） | 模拟面注释平台假设（POSIX 为主）· win32 差异显式登记 · 参照 `check-pack-hygiene.mjs:8` 平台分支先例 | — | 是 |
| **F-W5-09（本棒新增）** | NEW-12 key 相对化与既有 `Object.keys` 快照断言冲突 | 预期零波及（S5.4 预查）· 若咬到 → 同 commit 更新断言 + F-W2-13 同式登记 · 分批提交致新旧断言并存 → 打回 | 是 | — |
| **F-W5-10（本棒新增）** | NEW-6 通配选型拦不住枚举变体（如照抄 SPEC 示例正则漏 `.bak2`） | fixture 变体表为硬判据（红测先行咬死）· 正则选型偏离 SPEC 示例须注释理由（起草发现已在案 S5.1） | 是 | 是 |
| F-W5-11 | `git add -A` 裹挟域外档 | 打回 · 撤 stage 逐文件显式 add | 是 | — |
| F-W5-12 | 越权执行 tag/push/publish/deprecate | 违禁令 · 打回（四动作全仅人） | — | 是 |

---

## 验收标准（必须自证，不接受「我改完了」）

- [ ] **#1 NEW-6 变体全拦负向 fixture 红转绿**（SPEC 验收 1 · S5.1）：`.bak2` / `.bak.md` / `.BAK` / 尾空格 `.bak ` 四变体 trap 修复前漏网真红留证（30 invoke 留档）· 修复后逐一 exit 2 点名 · 清除后复绿 · 正向用例（pack-hygiene.test.ts:22-28）零回退 · `package.json` `files` 否定项同步 diff 在案 · 误拦面分析 + 选型理由（对照 S5.1 ⚠️ 起草发现）入自检结论
- [ ] **#2 NEW-7 定稿落地**（SPEC 范围② · S5.2）：案 B 显式声明注释入 `check-pack-hygiene.mjs` 头注释（控制点两处指认：prepublishOnly :43 + npm test 内测试/CI ci.yml:31 · 「无第三控制点」明示）· 机检 grep 断言注释锚在案 · **若 20 裁案 A** → ci.yml 独立步 diff + 该步独立红绿自证（二选一 · 验收以定稿案为准）
- [ ] **#3 NEW-8 用户文件存活 fixture 红转绿**（SPEC 验收 2 · S5.3）：预置用户自有 `<file>.bak`（内容 marker）→ `pins fix --yes` → 修复前旧码下用户 `.bak` 被删（真红留证）· 修复后存活且内容逐字不变 · 自写备份（`.bak` 或避让名）已清理 · 两级皆占跳过写盘 exit 2 点名 fixture（F-W5-06）· dry-run 文案同步
- [ ] **#4 NEW-12 key 相对化 fixture 红转绿**（SPEC 验收 3 · S5.4）：以绝对路径为 key 的对象经相对化 → 断言无绝对路径 key · 修复前 key 原样泄漏（真红留证）· 修复后 key 相对化 · 无路径 key 对象逐字不变锁 · 消费面盘点结论（预期零波及）+ `Object.keys` 快照面零意外红入自检结论 · `cli-shared.ts:433` 契约注释修订在案
- [ ] **#5 R-6 分档 + 前置探测 + 环境模拟实证**（SPEC 验收 4 · S5.5 · 硬约束 10）：① 分档四态 fixture（git_missing / git_exec_failed（exit 69 模拟）/ not_git_repo / tag 缺失维持 `missing`）逐态断言 detail + `error_kind`；② PATH 隔离模拟 git 不可用 → 三改造文件套件**显式 skip**（skipped 计数 + 统一标注文案 grep 断言）且 **fail=0**；③ 同环境 `pins check --json` 对 git-tag pin 输出 `error_kind: 'git_missing'` 与真偏差形态可区分断言；④ 真偏差对照：git 可用 tag 缺失仍 exit 2（release-tag-identity  FAIL 语义不变 · skip/fail 边界负向对照）；⑤ exit code 零变更断言（extract_error → exit 2 面 diff 空）
- [ ] **#6 R-1 回归确认**（SPEC 验收 5 · S5.6 · 只验不回改）：`cli-json-no-abs-path.test.ts:536-587` R-1 describe 全绿 · `src/host/cmd.ts:162-167` + `src/cli-shared.ts:37-48` git diff 空（输出入自检结论）· 手工跨目录 `host validate --json` 复跑一条无绝对路径（输出入自检结论）
- [ ] **#7 平台锁**（SPEC 验收 6）：`npm run typecheck` 0 错 · `npm test` 全绿（基线 794 + 新增用例数 · 零意外红 · skip 数变化须逐条归因 = 本波新增探测面 · 环境红先对照实验定性 F-W0-07 同式）· pins **17/17** · 依赖零新增（dependencies diff 空）
- [ ] **#8 既有面零意外改动**（F-W2-13 同式纪律）：除登记项外既有断言零改动全绿 · 登记项逐条列明于自检结论（预期登记面：NEW-12 契约注释 :433 · NEW-8 dry-run 文案 :684 · 三文件 skip 探测新增 · pack-hygiene 头注释 · 若咬到 `Object.keys` 快照逐条登记）
- [ ] **#9 结构闸**：`npx spec-wave task lint --file docs/tasks/active/task_3_0_w5_mechanical_cleanup.md` PASS
- [ ] **#10 执行粒度**：提交逐文件显式 add（禁 `git add -A`）· 每 commit 独立可回退 · 每 commit 前后 npm test 同绿 · 未执行 tag/push/publish/deprecate · 波末 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w5_mechanical_cleanup.md` → exit 0 + `task close --yes` 闭环（待 40 复核后另行 · 00 口径）

---

## 给执行帽的必读列表

1. SPEC [`06_w5_mechanical_cleanup_v1.md`](../../spec/3_0-architecture-leap/06_w5_mechanical_cleanup_v1.md) 全文（范围 ①–⑥ · 非范围 · 验收 1–6 · F-W5-01–05 · §5 设计要点 R-6 口径）· [`00_policy_and_boundaries.md`](../../spec/3_0-architecture-leap/00_policy_and_boundaries.md)（S2/P0/流程边界）
2. PLAN [`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W5 节（:274-279）+ 硬约束 6/10/14/15（:335,:339,:343,:344）
3. 现码（2026-09-17 实读行号 · 改前复读）：`scripts/check-pack-hygiene.mjs`（黑名单 :25 · 平台分支 :8 · 头注释 :1-5）· `package.json`（files :25-36 · prepublishOnly :43）· `src/cli-pins.ts`（git-tag 分档面 :118-131 · unfixableReason :593-600 · printCheckHuman :602-622 · cmdPinsCheck :624-637 · 备份写盘面 :688-704）· `src/cli-shared.ts`（relativizeOutputValue :433-456 · printJson :458-465 · findGitRoot :37-48）· `src/host/cmd.ts`（R-1 缺省基 :162-167 · **零触碰复核**）· `src/cli-assets.ts`（同族排除 :32 · 盘点登记面）
4. 既有测试面：`test/pack-hygiene.test.ts`（全文 · trap 选型注释 :30-32）· `test/pins-consistency.test.ts`（git init :549-576）· `test/release-tag-identity.test.ts`（全文 · 发布溯源纪律头注释 :11-17）· `test/cli-refresh-ide-blocks.test.ts`（initGitRepo :107-116 · 消费点 :324,693）· `test/w2-shell-hook.test.ts`（gitAvailable 先例 :47-49 · t.skip 先例 :84-87）· `test/cli-json-no-abs-path.test.ts`（assertJsonNoAbsRoot :47 · selfproof 系 :162-190 · R-1 回归锁 :536-587）
5. CI：`.github/workflows/ci.yml`（:30-33 · NEW-7 案 A 备选落点）
6. 资产：`assets/release-pins.yaml`（pin-10 git-tag :102-108 · note「git 操作仅人 F-A1-05」）
7. done task 先例：[`task_3_0_w4_semantic_criteria.md`](../done/task_3_0_w4_semantic_criteria.md)（红测先行 · F-W2-13 登记纪律 · 闸行裁决体例）· `task_2_4_gate_strength_w6_p3_cleanup.md`（P3 机械清扫波先例）
8. `RELEASING.md`（发布边界 · 四动作仅人）

---

## 思考轮

### R0 · 证据

SPEC 06（signed · 范围 ①–⑥ · 验收 1–6 · F-W5-01–05）+ PLAN W5 节（:274-279）+ 硬约束 6/10/14/15 + 本棒全量实读复核：基线复跑（794/150/793/0/1 · duration ≈89s · typecheck 0 · pins 17/17 · HEAD `3664e6f` · tree clean · tag v2.4.2 在）· 现码行号逐条实读（hygiene :25 精确后缀 · package.json :35/:43 · cli-pins.ts :118-131,:697-699 · cli-shared.ts :433-456 · host/cmd.ts :162-167 · ci.yml :30-33）· git 依赖测试面全仓 grep 盘点（4 文件 · w2-shell-hook 已具 probe · 余三无）· 消费面预查（printJson 约 30 消费点 · 无路径 key 信封 · assertJsonNoAbsRoot 反证）· **SPEC 示例正则不完备起草发现**（`\.(bak|BAK)(\.|$| )` 拦不住 `.bak2` · S5.1 ⚠️ 在案）。

### R1 · 范围

①–⑥ 照规格化节 S5.1–S5.6（SPEC §3 对照）；非范围照 SPEC §4 全继承 + 本棒明示四条：pins 汇总语义零触碰 · `*~`/`.DS_Store` 族不动 · 发布四动作仅人 · R-6 skip 仅限套件层环境不具备（CLI 层无 exit 0 放行第三条路）。

### R2 · 方案

**NEW-7 案 B 定稿**（显式声明 + 指认事实第二控制点 · 案 A 冗余理由三条：测试内已实跑 + CI 每 push 跑 + 发布链两遍 · 升级通道留 20 裁定）· NEW-6 通配 fixture 驱动选型（候选两式在案 · 误拦面分析强制）· NEW-8 改名避让 `.pins-fix-backup`（避开 `.bak` 后缀防 NEW-6 自咬 · 两级皆占跳过 exit 2 failClosed）· NEW-12 key 经同函数 walkString（口径单一源）· R-6 additive `error_kind` 三态 + tag 缺失维持 `missing`（exit code 零变更红线）· 前置探测复用 w2-shell-hook 先例形态。

### R3 · 边界

S2 只新增（本 task 文件 + 30 执行留档）· **不签任何闸**（双 pending 待 00 翻转）· 闸行裁决（不设 HG-SCHEMA-CHANGE 三理由 + 升级条款）留 20 复核 · 硬约束 6（每条修严负向 fixture 红测先行）· 硬约束 10（分档 + skip 落地）· 硬约束 14（手工复跑证据入自检结论文本）· 硬约束 15（双闸落表 blocks_hats 含 20,30 / 30）· exit code 语义零变更（非范围红线 + 验收 #5⑤ 断言）· pins 钉面零触碰 · 禁 `git add -A` · 发布四动作仅人 · R-1 面零 diff 硬锁（S5.6）。

### R4 · 可测性

验收 10 条全机械可断言（命令 + fixture + 期望输出均落验收节）：NEW-6 四变体红转绿 · NEW-8 存活/避让/双占三 fixture · NEW-12 key 相对化 + 零改写锁 · R-6 分档四态 + PATH 隔离 skip/fail=0 + `error_kind` 可区分断言 · R-1 回归锁全绿 + 零 diff 断言 · NEW-7 注释锚 grep 断言 · 平台锁 · 结构闸 · 执行粒度。唯一非纯机械点 = NEW-6 误拦面分析与 NEW-7 档位裁定（机械化其留痕面：分析文本与理由入自检结论 · 档位由 20 裁定非本波自由变量）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待审查文落盘 + 00 代签 · 维护者 2026-09-16 授权模式）；双闸 pending 待 00 翻转；NEW-7 档位与闸行裁决留 20 复核；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | SPEC signed + PLAN W5 + 基线全量复跑（794/150/793/0/1 · typecheck 0 · pins 17/17 · HEAD 3664e6f）+ 现码行号逐条实读 + git 依赖测试面 4 文件盘点 + 消费面预查零路径 key + SPEC 示例正则不完备起草发现 | no |
| R1 | 范围 ①–⑥ + S5.1–S5.6 规格化 · 非范围 SPEC §4 全继承 + 本棒明示四条 | no |
| R2 | NEW-7 案 B 定稿（案 A 冗余三理由 · 升级通道留 20）· NEW-6 fixture 驱动选型 · NEW-8 避让命名 · NEW-12 同函数口径 · R-6 additive error_kind · 探测复用先例 | no |
| R3 | S2 只新增 · 不签闸 · 闸行裁决留 20 · 硬约束 6/10/14/15 · exit code 零变更 · 禁裹挟 · 发布仅人 · R-1 零 diff 硬锁 | no |
| R4 | 验收 10 条全机械 · 红测先行面明示 · skip/fail 边界负向对照在案 · 非机械点留痕面机械化 | no |
| R5 | 待 20 审 R1 裁定充分性 · 双闸待 00 翻转 · NEW-7 档位 + 闸行裁决留 20 复核 | no |

**residual_risks**：① **NEW-6 通配误拦面**（子串级选型拦 `x.bakery` 类合法名 · 缓解：fixture 变体表为界 + 误拦面分析强制入自检结论 + F-W5-04 白名单评审口径）；② **NEW-7 案 B 被 20 改裁案 A**（缓解：两案皆已规格化 · 切换零返工 · 档位裁定非范围违约）；③ **R-6 PATH 隔离模拟平台失真**（win32 PATHEXT 面 · 缓解：F-W5-08 平台假设注释 + 先例参照 · CI 主跑 Linux/macOS）；④ **NEW-12 契约修订的消费者仓影响**（仓内预查零波及 · 消费者仓若以绝对路径 key 查表将破 · 缓解：相对化语义本就面向消费者仓输出 · 契约注释修订在案 + 升级条款兜结构变更）；⑤ **git 探测 skip 面被滥用为放行**（skip≠fail 边界 · 缓解：skip 标注统一锚文案机检 · release-tag-identity tag 缺失维持 FAIL 负向对照 · CLI 层 exit 2 不降级断言在验收 #5⑤）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 验收主体 = **机械锁全绿**（NEW-6 变体 fixture + NEW-8 存活 fixture + NEW-12 key fixture + R-6 分档四态 + PATH 隔离 skip 实证 + R-1 回归锁零回退 · 命令与判据见验收节），辅以：① **红测先行**（NEW-6/NEW-8/NEW-12 每条修严 fixture 修复前真红留证 · 修复后转绿 · 硬约束 6）；② 每 commit 前后 `npm test` 同绿（基线 794/150/793/0/1 · skip 数变化逐条归因 · 环境红按 F-W0-07 同式对照实验先行定性）；③ 既有面回归（pack-hygiene / pins-consistency / cli-json-no-abs-path / release-tag-identity / cli-refresh-ide-blocks / w2-shell-hook · 登记项逐条列明 · F-W2-13 同式纪律）；④ R-1 面零 diff 硬锁（host/cmd.ts:162-167 + cli-shared.ts:37-48）；⑤ duration 加性克制（基线 ≈89s · PATH 隔离子进程面注意不倍增时长）。**本波是机械清扫波 · 红绿纪律 = 修严面 fixture 先行 · R-6 边界负向对照（skip≠放行）· R-1 只验不回改。**

---

## 提交信息约定

- `feat(3.0-W5): NEW-6 卫生门通配语义（.bak 族变体全拦 · files 否定项同步 · 误拦面分析）+ NEW-7 显式声明（案 B 控制点指认）`
- `fix(3.0-W5): NEW-8 pins fix 备份不误删（存在即改名避让 .pins-fix-backup · 用户既有 .bak 零损失 fixture）`
- `feat(3.0-W5): NEW-12 relativizeOutputValue 覆盖对象 key（契约注释修订 · 路径 key 相对化 fixture）`
- `feat(3.0-W5): R-6 git 分档诊断（error_kind 三态 additive）+ 套件前置探测（三文件补 probe · PATH 隔离 skip 实证 · 硬约束 10）`
- `test(3.0-W5): 负向 fixture 组 + R-1 回归确认（只验不回改 · 零 diff 断言）`
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界（F-W5-11）
- **禁 tag / push / publish / deprecate（仅人 · 无代跑授权）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w5_mechanical_cleanup.md`

---

### 自检结论（执行者）

**GATE_VERIFY 首输出**（30 开工第 0 步 · 三阶段同一口径）：`node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w5_mechanical_cleanup.md` → HG-TASK-DRAFT approved · HG-AUDIT-R1 approved · **VERIFY: PASS**（exit 0 · 各阶段收官复跑同 PASS）。

**执行形态**：三阶段逐棒放行（00 验收 PASS 后放下一棒）· 三 commit 显式逐文件 add：`4a26b95`（阶段一 NEW-6+NEW-7）· `b6ca7ca`（阶段二 NEW-8+NEW-12）· 阶段三 R-6+R-1+收官（本行回填所在 commit 与同波 feat commit · hash 见 git log）· 未 push/tag/publish/deprecate。

**阶段锁计数（纯加性零回退 · skip 恒 1 = 开工基线既有 standing skip · 本波正常环境零新增）**：
`794/150/793/0/1`（开工基线复跑逐字一致）→ `801/152/800/0/1`（阶段一 +7 测试 +2 套件）→ `806/153/805/0/1`（阶段二 +5 测试 +1 套件）→ `810/154/809/0/1`（阶段三 +4 测试 +1 套件 · 终态）。每棒 typecheck 0 错 · build exit 0 · test:lib 6/6 · pins 17/17 · verify --task PASS · 依赖零新增（dependencies 仍仅 js-yaml）。

**验收 10 条逐项**：
- [x] **#1 NEW-6 变体全拦红转绿**：`.bak2`/`.bak.md`/尾空格`.bak ` 三变体修复前漏网真红留证（手工探针 exit 0 + fixture 组 pass5/fail4 · 30 invoke 阶段一节）· `.BAK` 同向对照（旧 `i` 旗标已拦）· 修复后四变体逐一 exit 2 点名清除复绿 · 正向用例零回退 · files 否定项 diff 在案（`!assets/**/*.bak` → `!**/*.bak` + `!**/*.bak.*`）· 误拦面分析+选型理由入 invoke（对照 S5.1 ⚠️ 起草发现：SPEC 示例拦不住 `.bak2` · 选型 `/\.bak(\.|$|[0-9]| )/i` 边界扩展式 · 理由注释落脚本头）
- [x] **#2 NEW-7 案 B 落地**：双控制点声明入 `check-pack-hygiene.mjs` 头注释（prepublishOnly 末端 + npm test 内 pack-hygiene.test.ts 实跑/CI 每 push · 「无第三控制点」明示）· 机检双锚在案（锚①注释四要素 grep 断言 · 锚②测试实跑行存在断言 · 20 审 A3）
- [x] **#3 NEW-8 用户文件存活红转绿**：B12 预置用户自有 `.bak`（内容 marker）修复前被覆盖+删除真红 · 修复后存活逐字不变 · 目标已修 · 自写避让备份（`.pins-fix-backup`）已清理 · B13 两级皆占跳过写盘 exit 2 点名含「请手动处置后重跑」（A2）· dry-run 文案同步
- [x] **#4 NEW-12 key 相对化红转绿**：绝对路径 key 修复前原样泄漏真红 · 修复后 key 相对化（`out[walkString(k)]` 同函数同 bases）· 零改写锁逐字不变 · 消费面复核零波及（全量绿 + JSON 契约面 105/105 + Object.keys 快照零意外红）· `cli-shared.ts:433` 契约注释修订含 A1 碰撞句「相对化后撞名后者覆盖前者 · 信封不得依赖碰撞面」
- [x] **#5 R-6 分档+前置探测+环境模拟实证**：① 分档四态 fixture（R6-1 git_missing PATH 隔离 / R6-2 git_exec_failed 假 git exit 69 / R6-3 not_git_repo / W1-B5 tag 缺失维持 missing 且 error_kind undefined）逐态断言 detail+error_kind；② PATH 隔离三文件 **86 pass / fail=0 / skipped 6**（skip 归因逐条在 invoke · 统一标注锚 TAP 摘录 + R6-4 grep 机检）；③ 同环境真仓 pins check --json → pin-10 `error_kind: git_missing` 与真偏差形态可区分；④ 真偏差对照：release-tag-identity git 可用 tag 缺失维持 FAIL 语义零松动；⑤ exit code 零变更断言（R6-1：环境不具备仍 exit 2 · 无 exit 0 第三条路）
- [x] **#6 R-1 回归确认（只验不回改）**：回归锁 R-1 describe 4/4 绿 · `git diff 3664e6f..HEAD` src/host/cmd.ts **0 行** + src/cli-shared.ts 仅 NEW-12 两 hunk（findGitRoot :37-48 零触碰 · 比对基更正登记见 invoke 偏差 5）· 手工跨目录 `cd /tmp && host validate --json` 输出 `"file":"assets/ide/host-adapt/examples/mvp-hosts.yaml"` 无绝对路径 exit 0（证据文本在 invoke 阶段三节）
- [x] **#7 平台锁**：typecheck 0 错 · npm test 810/154/809/0/1 全绿（零意外红 · skip 数变化=PATH 隔离实证面逐条归因 · 正常环境恒 1）· pins 17/17 · 依赖零新增（diff 空）
- [x] **#8 既有面零意外改动（F-W2-13 同式）**：登记项逐条 = ① pack-hygiene 头注释+正则+FAIL 文案 ② package.json files 否定项数据行 ③ cli-assets.ts:32 分叉注释（纯注释）④ cli-pins.ts 写盘循环+dry-run 文案+PinResult additive 键+git-tag 分档 ⑤ cli-shared.ts:433 契约注释+key 相对化 ⑥ 三文件 probe 新增+R6/W1-B5/A 组断言加性 ⑦ invoke 留档新增 · 此外既有断言零改动全绿 · Object.keys 快照面零波及
- [x] **#9 结构闸**：`npx spec-wave task lint --file` **PASS**（回填前 W3 warn 占位符提示 · 回填后复跑见 close 前置）
- [x] **#10 执行粒度**：三 commit 逐文件显式 add（禁 add -A 遵守 · git status --porcelain 全程审边界）· 每 commit 独立可回退 · 每棒前后 npm test 同绿 · 未执行 tag/push/publish/deprecate · 波末 `gate-check` **exit 0**（task close 待 40 复核后 00 口径另行 · 本棒不执行）

**F-W2-13 同式登记清单**：见验收 #8 登记项 + 30 invoke 三阶段「既有面改动登记/偏差登记」全谱（阶段一 5 条 · 阶段二 5 条 · 阶段三 8 条）。

**NEW-6 误拦面分析与选型理由**：候选子串级 `/\.bak/i`（覆盖最全但误拦 `x.bakery`/`x.bakxt` 等「.bak 后接字母」合法名 · 误拦面最大）否决；定档边界扩展式 `/\.bak(\.|$|[0-9]| )/i`（命中面=「.bak+点/数字/空格/结尾」=备份衍生族语义内）· 合法名正向 fixture 钉死不误拦 · 已知边界登记：目录级 `dir.bak/` 不拦（超变体表不扩）· 白名单修正须评审（F-W5-04）· 偏离 SPEC 示例理由（示例字符集不含数字拦不住 `.bak2` · 已裁定口径=验收 binding 优先 · 示例非约束面 · 不回注 SPEC）注释落脚本头。

**NEW-7 定稿案落地证据**：案 B 显式声明（task S5.2 定稿 · 案 A 冗余三理由在 task）· 头注释四要素+机检双锚 fixture 绿 · 升级通道未触发（20 审 R1 已采纳案 B 口径）。

**R-1 零 diff 与手工复跑证据**：见验收 #6 行 + invoke 阶段三节（含比对基更正登记：初跑误用 v2.4.2 tag 基 diff 929 行= W0–W4 历史变更非 R-1 回改 · 更正波次基 3664e6f 后 0 行/两 hunk）。

**已知未测项（诚实登记）**：① win32 PATH 隔离失真面未实证（F-W5-08 · POSIX 口径实证 · R6-2 假 git sh 脚本 win32 t.skip 护栏在案 · CI 主跑 Linux/macOS）；② EACCES 分支无独立 fixture（与 ENOENT 同档 git_missing · invoke 偏差 4 登记）；③ NEW-6 目录级 `dir.bak/` 变体不拦（超 fixture 变体表 · 边界登记非漏网）；④ 分档人读输出仅经 detail 行承载（error_kind 键 JSON 面专属 · 契约只增口径内）。

**KPI 自评备料（待 00 裁定 · 照 kpi_rubric KPI_RUBRIC_v1_2 存在性口径）**：SPEC 范围①–⑥全销（①NEW-6 ②NEW-7 ③NEW-8 ④NEW-12 ⑤R-6 ⑥R-1 回归确认）· 验收 10 条全机械自证 ✓ · 硬约束 6（每条修严负向 fixture 红测先行：NEW-6 三变体漏网/NEW-8 灭失复现/NEW-12 key 泄漏/R-6 PATH 隔离全谱留证）/10（分档三态+probe+skip≠fail 边界+exit code 零变更）/14（手工复跑证据全入本文与 invoke tracked）/15（双闸落表 blocks_hats 机检）逐项兑现 · 20 审 advisory A1–A4 全落地（A1 碰撞句入契约注释 · A2 手动处置指引入点名文案 · A3 双锚机检 · A4 行号漂移登记）· 锁计数 794→801→806→810 纯加性零回退 · 三阶段零 STOP 零越权（发布四动作零触碰）· 过程瑕疵两起（基线首跑自污染并发 · R-1 比对基误用 tag 基）均被对照实验一拍定性更正并登记 · 未流入交付面。
