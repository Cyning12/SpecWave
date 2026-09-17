# 审查文：task_3_0_w5_mechanical_cleanup · R1（20-task-audit）

> **hat_id**：20-task-audit · **轮次**：R1 · **日期**：2026-09-17  
> **审查对象**：`docs/tasks/active/task_3_0_w5_mechanical_cleanup.md`（3.0 W5 机械清扫与可诊断性 · HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1=pending）  
> **对照真值**：SPEC `docs/spec/3_0-architecture-leap/06_w5_mechanical_cleanup_v1.md`（signed · 范围 ①–⑥ · 验收 1–6 · F-W5-01–05 · 2.4.2 对账收窄）· PLAN `PLAN_3_0_architecture_leap_v1_zh.md` W5 节（:274-279）+ 硬约束 6/10/14/15（:335,:339,:343,:344）· 格式先例 `task_3_0_w4_semantic_criteria_audit_R1_20260917.md`  
> **审查性质**：书面审查 + 独立复核实测（基线全量复跑 + 正则行为实证 + 行号抽核 + 消费面 grep 复核 + 闸机检）；**未改** task / SPEC / PLAN / src / scripts / test / package.json 实质内容；**不代签** HG-AUDIT-R1（归 00 代签）

---

## 一、结论摘要

| 维度 | 结论 |
|------|------|
| **内容**（可执行性 / 与 SPEC+PLAN 一致性） | **PASS-with-issues**：blocking **0** · advisory **4**（A1 NEW-12 键碰撞语义未登记 · A2 NEW-8 两级皆占点名文案未明示含手动处置指引 · A3 NEW-7 案 B 机检锚建议双锚（注释 + 测试实跑行）· A4 三处行号快照 ±2–3 行小疵；均不阻塞签闸） |
| **流程闸** HG-AUDIT-R1 | **pending**（真值以 task `### 人工闸` 表为准）；本审查文落盘即满足「20 审查文落盘」前置，签署归 **00 代签**（维护者 2026-09-16 授权模式），**pending 期间 30 拒改码**（本审机检实测：`task lint` PASS ✓ · `gate-check` exit 2 ❌ 拒 30 ✓ · `verify` 首输出闸扫描表 + `VERIFY: BLOCKED · HG-AUDIT-R1 pending` exit 2 ✓） |
| 思考轮 R0–R5 | 控制表填全（六轮 early_stop 全 no · residual_risks 五条每条带缓解 · ②③④ 恰对应本审重点 2/5/3 裁定面）· R5 待本轮裁定——**本轮裁定：充分** |

---

## 二、常规核对（对照 SPEC / PLAN / 硬约束逐项）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 ①–⑥ 与 SPEC §3 | ✅ 逐项对应且规格化 | ① NEW-6→S5.1（通配 fixture 驱动选型 + files 否定项同步 + 同族盘点登记）· ② NEW-7→S5.2（案 B 定稿 · SPEC §6 明授「二选一 · task 定稿」）· ③ NEW-8→S5.3（改名避让 `.pins-fix-backup` + 双占跳过 exit 2）· ④ NEW-12→S5.4（key 经同函数 walkString + 契约注释修订登记）· ⑤ R-6→S5.5（分档四态 + additive error_kind + 三文件前置探测 + PATH 隔离实证）· ⑥ R-1→S5.6（只验不回改 · 零 diff 硬锁）——无自创范围 |
| 非范围与 SPEC §4 + PLAN W5 | ✅ 全继承 + 合规增益 | SPEC 四条全在（架构重做 / 新依赖 / exit code 语义 / R-1 重实现）+ 本棒明示四条（pins 汇总语义零触碰 · `*~`/`.DS_Store` 族不动 · 发布四动作仅人 · R-6 skip 仅限套件层 = CLI 层无 exit 0 第三条路）——与 PLAN W5 非范围（:277）及风险口径（:279 skip≠放行）逐字对齐 · 依赖零新增（dependencies 仅 `js-yaml` 本审实证 package.json:85-86 ✓） |
| 验收标准与 SPEC §7 | ✅ 1–6 全覆盖 + 机械化加强 | SPEC 1→#1（NEW-6 四变体红转绿）· 2→#3（NEW-8 存活 fixture）· 3→#4（NEW-12 key fixture）· 4→#5（R-6 分档四态 + PATH 隔离 skip/fail=0 + error_kind 可区分 + 真偏差对照 + exit code 零变更断言五子项）· 5→#6（R-1 回归锁全绿 + 零 diff + 手工跨目录复跑证据）· 6→#7（typecheck + 全绿 + pins 17/17 + 依赖零新增）；#2 补 SPEC 范围② 无独立验收项之缺（NEW-7 定稿落地 · 二选一以定稿案为准）· #8（F-W2-13 登记纪律）· #9（task lint）· #10（执行粒度 + gate-check 闭环）为加强项，命令+fixture+期望输出全落验收节 |
| failure_paths 与 SPEC §8 | ✅ F-W5-01–05 全继承 | 逐条对应且行为列更具体；新增 F-W5-06–12（避让名双占 · 探测误判须实跑式（w2-shell-hook :48 先例本审实证为 `git --version` status 实跑判 ✓）· win32 PATH 隔离失真 · Object.keys 快照冲突 · 通配选型漏变体 · 裹挟 · 越权发布）逐条必要——06 是 NEW-8 failClosed 取舍的补全 · 10 正是本审重点 1（SPEC 示例正则漏 `.bak2`）的 task 面兑现 |
| 依赖 / 必读列表 | ✅ 充分 | SPEC+PLAN+现码行号（本审抽核 40+ 处全中 · 见下）+ 既有测试面六文件 + CI + 资产锚 + done 先例 + RELEASING |
| 思考轮控制表 R0–R5 | ✅ 填全 | R0 含基线全量复跑 + 行号逐条实读 + git 依赖测试面 4 文件盘点 + 消费面预查 + SPEC 正则不完备起草发现（本审全部独立复现 · 见下）；R1–R3 闭合；R4 验收 10 条全机械 + 非机械点留痕面机械化（误拦面分析 / NEW-7 档位由 20 裁定非自由变量）；R5 待本轮（裁定充分） |
| `### 人工闸` 表可机检性（硬约束 15） | ✅ | 闸表在 `### 人工闸` 节；本审实测 `npx spec-wave gate-check --task …` 渲染两闸行（HG-TASK-DRAFT approved blocks 20,30 / HG-AUDIT-R1 pending → ❌ 拒 30 · **exit 2**）· `verify --target . --task …` 首输出闸扫描表 + `VERIFY: BLOCKED · HG-AUDIT-R1 pending`（**exit 2**）· `task lint` PASS（W3 占位符 warn 属 draft 期合法） |
| 闸行裁决（不设 HG-SCHEMA-CHANGE · task :43 留 20 复核） | ✅ 裁决成立 | 理由①（package.json `files` 否定项 = 数组数据行 · 键形态与字段集零变更）成立——package.json 非 yaml/适配表 · 类比 W4 理由①/W2②「按已批准结构写数据」同构 ✓；理由②（R-6 `error_kind` additive 扩键 · 契约「键集只增不改」显式允许只增）成立——cli-shared.ts:433 注释本审实证在案 ✓；理由③（NEW-12 键改写不增删键集 · 人闸通道 = HG-AUDIT-R1 本表在案）成立——但「不增删键集」仅在无碰撞前提下真（见 advisory A1）；升级条款触发条件客观可判（新增/改名/删除 yaml 键结构或删既有 JSON 键 → STOP → 评审文 → HG-SCHEMA-CHANGE 式人闸）· 与硬约束 3 顺序兼容 · **本审不判定须补闸行** |
| test_strategy 与硬约束 6（修严配负向 fixture） | ✅ 适配正确 | 本波全修严型：NEW-6 四变体 trap（修复前漏网真红留证）· NEW-8 用户既有 `.bak` 存活 fixture（修复前旧码删用户文件真红）· NEW-12 路径 key fixture（修复前 key 原样泄漏真红）· R-6 PATH 隔离环境模拟（skip≠fail · fail=0 断言）——红测先行写进测试策略节与验收节双落 · R-6 负向对照（git 可用 tag 缺失维持 FAIL · release-tag-identity :22-31 在案）咬住 skip/fail 边界 |
| 硬约束 10/14/15 落位 | ✅ | #10：分档四态 + 前置探测 + skip 标注统一锚文案（机检 grep 断言）——2.4.1 教训的完整兑现面；#14：手工复跑证据入自检结论文本非仓外文件（S5.6③ 明示）；#15：双闸落表 blocks_hats 含 20,30 / 30 且机检咬住（上行实测） |
| 基线节数字独立复跑 | ✅ 全中 | 本审复跑（HEAD `3664e6f` ✓ · 工作区 untracked = 本 task 1 件 ✓ 与声称一致 · tag `v2.4.2` 在 ✓）：`npm test` **794 tests / 150 suites / 793 pass / 0 fail / 1 skip**（duration 90.2s · 基线 ≈89s 机差量级）· `npm run typecheck` **0 错** · `node bin/specgate.js pins check` **17/17 PASS** · dependencies = 仅 `js-yaml` ^4.1.0 ✓ · 与 W4 锁终态逐字一致 ✓ |
| NEW-6 现值漏网面实证 | ✅ 起草发现属实 | 本审 node 实证现行 `/\.bak$/i`：`x.bak2` / `x.bak.md` / `x.bak `（尾空格）全漏网（false）· `x.bak` / `x.BAK` / `README.md.bak` 命中 —— 红测面真实存在 ✓ |
| 现码行号抽核（40+ 处 · 2026-09-17 现值 HEAD 3664e6f） | ✅ 全中（3 处 ±2–3 行小疵 → A4） | `check-pack-hygiene.mjs`（黑名单 :25 ✓ · 平台分支 :8 ✓ · 头注释 :1-5 ✓）· `package.json`（files :25-36 ✓ · `!assets/**/*.bak` :35 ✓ · prepublishOnly :43 七节链逐字一致 ✓）· `cli-pins.ts`（git-tag :118-131 ✓ catch 一刀切 :128-130 + detail :129 ✓ · unfixableReason :593-600 ✓ · printCheckHuman :602-622 ✓ · cmdPinsCheck :624-637 ✓ · dry-run 文案 :684「写前备份 <file>.bak」逐字 ✓ · 备份写盘面 :697-699 copyFileSync→writeFileSync→unlinkSync 静默覆盖+删除实锤 ✓）· `cli-shared.ts`（契约注释 :433「键集只增不改」逐字 ✓ · relativizeOutputValue :434-456 ✓ · `out[k] = walk(vv)` :449 ✓ · printJson :458-465 ✓ · findGitRoot :37 ✓ 唯一实现 grep 实证）· `host/cmd.ts`（R-1 :162-167 ✓ :167 `findGitRoot(path.dirname(abs))` 唯一消费点 grep 实证 ✓）· `cli-assets.ts`（同族排除 :32 `basename.endsWith('.bak')` ✓）· `ci.yml`（:30-33 ✓ · npm test :31 ✓ · on: push+pull_request :4-6 ✓ · 无 hygiene 独立步 ✓）· `release-pins.yaml`（pin-10 :102-108 ✓ fixable=false + note「git 操作仅人 F-A1-05」:108 ✓）· `pack-hygiene.test.ts`（:17 spawnSync 实跑脚本 ✓ · 正向 :22-28 ✓ · trap 选型注释 :30-32 ✓）· `w2-shell-hook.test.ts`（gitAvailable :47-48 实跑式探测 ✓ · skip 四点 if 守卫 :84/:141/:176/:194 ✓）· `release-tag-identity.test.ts`（:23/:33 无探测 ✓ · 头注释 :11-17 ✓）· `pins-consistency.test.ts`（git init :562 + assert :563 ✓ · :1429 host_hits 键 = 宿主 id（agents/claude/copilot/cursor…）非路径 ✓）· `cli-refresh-ide-blocks.test.ts`（initGitRepo :112-116 ✓ · 消费点 :324/:693 ✓）· `cli-json-no-abs-path.test.ts`（assertJsonNoAbsRoot :47 ✓ · selfproof 注入系 :161-191 ✓ · R-1 describe :536 起四 fixture :543-545/:557-559/:570-572/:585-587 全中 ✓ · Object.keys 快照七处 :203/:224/:254/:301/:316/:353/:411 全中且皆固定字段集非路径 key ✓） |
| 行为变更类「旧测 grep 影响面」提醒（K7） | ✅ 覆盖 | S5.4 消费面预查（printJson/relativizeOutputValue 消费点本审 grep 实证 34 命中 / 16 src 文件 ≈ task「约 30 处」✓ · `cli-wiki.ts:178` 直调消费点在案 ✓）+ 验收 #8 登记纪律 + F-W5-09 Object.keys 快照冲突面 —— 本审独立复核：assertJsonNoAbsRoot 为**全 stdout 串扫描**（key 含绝对前缀同咬）· npm test 全绿 ⇒ 仓内无路径 key 信封反证成立 ✓ |
| W0–W4 前置兑现 | ✅ | W4 done（锁终态 794/150/793/0/1 与本审复跑逐字一致 · HEAD 3664e6f = W4 close 归档 commit）· SPEC signed（HG-SPEC-SIGNOFF approved 2026-09-16）· 2.4.2 对账在案（R-1 已交付 · host/cmd.ts:162-167 现码实证） |

**常规核对结论：无 blocking。** 唯一新增登记缺口 = NEW-12 键碰撞语义（A1），有 fail-closed 机械兜底（零改写面锁 fixture + F-W2-13 登记纪律），不阻塞签闸。

---

## 三、五条重点逐条结论（10-task 留下 · 含本审独立复核证据）

### 重点 1 · SPEC 示例正则不完备（fixture 驱动选型 vs SPEC 字面）——✅ 裁定：**task 口径可接受 · 30 正则形态不须回 SPEC 回注**

- **起草发现独立实证**：本审 node 复跑 SPEC §3/PLAN 示例 `\.(bak|BAK)(\.|$| )` —— `x.bak2` → **false**（`2` 不在 `(\.|$| )` 边界字符集内）· 而 SPEC 验收 1 要求 `.bak2` 全拦 ⇒ SPEC 字面示例与验收意图冲突属实 ✓；
- **裁定理由**：① SPEC §3 原文「`\.(bak|BAK)(\.|$| )` **等**」——「等」字使示例为 illustrative 非 binding；验收 1（`.bak2`/`.bak.md`/尾空格均被拦）才是 binding 判据，task 以 fixture 变体全拦为硬判据 = **验收意图优先于示例字面**，正当；② SPEC 已 signed（HG-SPEC-SIGNOFF approved）· 字面修订须重走签署通道 · 成本不抵收益（示例非约束面）；③ 偏离留痕三面已锁：S5.1 ⚠️ 起草发现在案 + F-W5-10「正则选型偏离 SPEC 示例须注释理由」+ 验收 #1「选型理由入自检结论」—— 30 实现时注释理由落码即可，**不须回 SPEC 回注**（若 30 选定形态后 00/维护者认为 SPEC 示例应勘误，属 SPEC 修订独立动作 · 非本波范围）；
- **候选选型边界在案**：`/\.bak/i`（子串级 · 误拦面最大）vs `/\.bak(\.|$|[0-9]| )/i`（边界扩展式）—— 两候选对 `x.bakery` 行为分叉（前者误拦 · 后者放行），误拦面分析强制入自检结论（F-W5-04 评审口径）⇒ 选型自由度被 fixture 表 + 误拦分析双约束，非任意发挥 ✓。

### 重点 2 · NEW-7 案 B 档位（测试内实跑 = 事实第二控制点）——✅ 认定成立 · 塌缩面不须案 A 兜底 · 维持案 B

- **事实面独立实证**：`pack-hygiene.test.ts:17` `spawnSync(process.execPath, [SCRIPT])` 真跑脚本（非 mock · 正向 PASS + 负向 trap exit 2 自证 failClosed）· `ci.yml:31` `npm test`（on: push+pull_request :4-6 实证）· prepublishOnly 链 :43 = `npm test`（内含 hygiene 测试）→ 末端再独立跑脚本 —— **发布链路脚本实跑两遍**属实 ✓；
- **「测试内实跑构成事实第二控制点」认定成立**：控制目标 = `.bak` 类非交付物不入发布包。两处独立拦截点：(a) CI 每 push/PR 经 npm test 内测试实跑脚本（拦截「不发布但合入」面）· (b) prepublishOnly 末端（发布前最后闸）。两点物理独立（CI 配置 vs package.json 发布链）· 失效模式独立 —— 满足「第二控制点」实质 ✓；
- **塌缩面分析（若 CI 的 npm test 被 skip/裁剪）**：① 单删 pack-hygiene.test.ts → 基线计数纪律咬住（验收 #7「基线 794 + 新增用例数 · 零意外红 · skip 数变化逐条归因」· 每 commit 前后 npm test 同绿）—— 794+ 计数钉死使静默删测不可存活 ✓；② ci.yml 删 npm test 步 → CI 侧控制点消失，但**发布端 prepublishOnly 硬闸仍在**（failClosed exit 2 · 发布面无洞）· 且 ci.yml 变更必经 PR 评审可见 —— 降级非穿洞 ✓；③ 结论：塌缩最坏情形 = 退回 SPEC §6 表的「显式单点」（发布端仍有闸），**不存在零闸窗** ⇒ 不须案 A 兜底；案 A 的「第三遍同义执行」零新保障面评估成立；
- **案 B 显式化的必要性与充分性**：核心风险是「以为有双保险」的隐性单点（SPEC §6）· 案 B 头注释声明 + task 登记 + 注释锚 grep 断言三面兑现「显式化」✓；机检锚覆盖面见 advisory A3（建议双锚）。

### 重点 3 · NEW-12 契约修订（:433「键集只增不改」随 key 相对化修订）——✅ 独立复核成立 · 消费面零波及实证 · 消费者仓口径足够（键碰撞语义补登记 → A1）

- **契约修订定性成立**：本审实证 :433 注释原文「仅改字符串值（键名不动 · 契约『键集只增不改』）」· :449 `out[k] = walk(vv)` 键名不动 —— NEW-12 改 `out[walkString(k)]` 后「键名不动」半句失效须修订属实；key 相对化 = 同函数同 bases 的**改写**（非增删键集合）· task 修订口径「键集只增不改（键集合）· 含绝对路径基串的 key 会被相对化改写」语义准确 ✓；
- **消费面预查零波及 · 本审独立复核成立**：① `assertJsonNoAbsRoot`（cli-json-no-abs-path.test.ts:47 实证）对 **stdout 全文串扫描**仓根绝对前缀（realpath+词法双形态）—— key 含绝对路径同咬 · npm test 全绿 ⇒ 仓内 **--json 信封无一以绝对路径为 key** 反证成立 ✓；② `Object.keys` 快照七处（:203/:224/:254/:301/:316/:353/:411 本审逐处抽核）断言皆**固定字段集**（command/target/task/verdict 等）非路径 key ✓；③ pins-consistency:1429 `host_hits` 键 = 13 宿主 id（agents/claude/copilot/cursor…本审实证）非路径 ✓；④ printJson 消费面 34 命中 / 16 src 文件 + cli-wiki.ts:178 直调 —— task「约 30 处」声称成立 ✓；
- **消费者仓理论风险口径（residual_risks ④）足够**：相对化契约（D-24-OUTPUT-REL-EXIT · printJson :458-462 注释在案）本就面向**输出给消费者**的面 —— 消费者若以绝对路径为 key 查表，在 **value** 面早已被相对化打破（2.4 起即如此）· key 面相对化是同一契约的补全而非新约束方向；契约注释修订在案 + 闸行裁决升级条款兜结构变更 ⇒ 口径足够 ✓；
- **本审新增发现（advisory A1）**：「键改写不增删键集」**仅在无碰撞前提下真** —— 若同对象内两 key 相对化后撞名（如 `/abs/base/x` 与既有 `x`），JS 对象语义后者覆盖前者 = 键集实缩 + value 丢失。仓内现值零波及（无路径 key 信封 ⇒ 无碰撞面），但契约注释修订应**登记碰撞语义**（如「相对化改写撞名时后者覆盖前者（JS 对象语义）· 信封设计不得依赖碰撞面」）或入 30 自检结论 —— 登记级 · 不阻塞。

### 重点 4 · R-1 行号迁移（SPEC 快照 cli-host.ts:489-498,552 → host/cmd.ts:162-167）——✅ 迁移映射复核成立 · 回归锁充分

- **迁移映射独立实证**：`src/cli-host.ts` 现为 **21 行纯 barrel**（W0 拆分 · :10-13 注释「实现搬迁至 src/host/* …本文件降级为纯 barrel · D-30-BARREL · 零行为变更」逐字在案）—— SPEC 快照行号（489-498,552）已随 W0 失效属实 ✓；R-1 唯一实现面 = `src/host/cmd.ts:162-167`（:162-166 2.4.2 R-1 注释 + :167 `findGitRoot(path.dirname(abs))`）· `findGitRoot` 唯一实现 `cli-shared.ts:37`（grep 实证全 src 仅一定义）· `findGitRoot(path.dirname(...)` 唯一消费点 host/cmd.ts:167（grep 实证）✓；
- **回归锁充分性**：`cli-json-no-abs-path.test.ts:536` 起 2.4.2 R-1 describe 四 fixture —— 跨目录缺省基（:540-549 · cwd=/tmp 靶场 + 仓内示例表绝对路径入参 → file 相对形）· realpath 入参（:551-563 · /tmp vs /private/tmp 子类）· 仓外文件（:565-577 · outside_repo:true + basename 占位 + 校验行为不回退三断言）· symlink --target 显式优先（:579-589）—— 行为四面覆盖 R-1 全部语义面（缺省基上溯 / realpath 双形态 / 仓外回落 / --target 优先）· 本审复跑 npm test 该 describe 全绿（794 内含）✓；叠加 S5.6 双硬锁（host/cmd.ts:162-167 + cli-shared.ts:37-48 **零 diff 断言** + 手工跨目录复跑证据入自检结论）—— **行为锁 + 代码锁 + 证据锁三重** · 充分 ✓；「任何回改冲动 = STOP · 登记回 00 不在本波修」边界明确 ✓。

### 重点 5 · NEW-8 避让命名 failClosed 取舍（`.pins-fix-backup` · 双占跳过 exit 2）——✅ 取舍成立 · 第三条路以报错文案形态满足（A2）· 不须新开设计面

- **避让命名正当性**：`.pins-fix-backup` 避开 `.bak` 后缀 —— 防 NEW-6 通配自咬（万一备份残留工作树，`.bak` 名会被本波卫生门通配拦下 · 与既有 trap 面正交）· 亦避开 `files` 否定项面 —— 命名与本波 NEW-6 改造自洽 ✓；
- **双占跳过取舍成立**：两级皆占 → 跳过写盘 + exit 2 点名（不无备份写盘）= SPEC §5「**绝不无条件 unlink**」与 F-W5-03「用户文件零损失」的正当兑现 · 零损失优先于修复便利的排序符合 SPEC 目标行为 ✓；「只清本次自写备份（跟踪实际用名）」守住 2.3.1 N1-d 语义（F-P2-08）不回退 ✓；
- **与「pins fix 可用性」张力评估**：双占场景须用户同时持有 `<file>.bak` 与 `<file>.pins-fix-backup` 两同名文件 —— 面窄（`.pins-fix-backup` 为本波新造名 · 存量零占用）· 且 pins fix 可重跑（用户处置后重跑即恢复可用）⇒ 非永久不可用 ✓；
- **第三条路裁定**：不须新开设计面（不递增造第三级名 —— F-W5-06「复杂度不引入」裁定正确 · 避免无限避让链）—— **「提示用户手动处置的报错文案」即第三条路**：task 现值「输出点名并计入不可修面 exit 2」未明示文案须含处置指引（用户见到点名但不知须删/改名哪个文件后重跑）→ 落 advisory A2：30 实现时点名文案须含「备份两级名均被占 · 请手动处置 `<file>.bak` / `<file>.pins-fix-backup` 后重跑」级指引 · 属实现自由裁量内的文案质量要求 · 不改 task 结构。

### 附 · 闸行裁决复核（task :43 留 20 · 不设 HG-SCHEMA-CHANGE）

三理由成立（详见常规核对表「闸行裁决」行）：① package.json `files` 否定项 = JSON 数组数据行非 yaml schema 面 ✓ · ② `error_kind` additive 扩键 = 契约显式允许面 ✓ · ③ NEW-12 键改写人闸通道 = HG-AUDIT-R1 本表在案 ✓；升级条款触发条件客观可判（yaml 键结构增/删/改名 · JSON 删既有键）· 通道明确（STOP → 评审文 → 人闸）· 与硬约束 3 顺序兼容。**本审不判定须补闸行**；A1 键碰撞语义登记不影响该裁决（碰撞语义属注释完备性 · 非键集结构变更）。

---

## 四、发现清单

### Blocking（0 条）

无。

### Advisory（4 条 · 均不阻塞签闸 · 30 执行时落实或自检登记 · 无需改 task）

| # | 级别 | 内容 | 建议落点 |
|---|------|------|----------|
| A1 | 登记级 | **NEW-12 键碰撞语义未登记**：task :43/:106「键改写不增删键集」仅在无碰撞前提下真 —— 同对象两 key 相对化后撞名（如 `/abs/base/x` 与既有 `x`）时 `out[walkString(k)]` 后者覆盖前者 = 键集实缩 + value 丢失（JS 对象语义）。仓内现值零波及（无路径 key 信封 ⇒ 无碰撞面 · 本审实证），但契约注释修订若只写「改写非增删」将留下一个语义黑洞 | 30 执行期：`cli-shared.ts:433` 契约注释修订稿补一句碰撞语义登记（如「相对化撞名时后者覆盖前者（JS 对象语义）· 信封设计不得依赖碰撞面」）· 入自检结论登记清单（验收 #8 通道已容 · 无需改 task） |
| A2 | 登记级 | **NEW-8 双占点名文案未明示含手动处置指引**：S5.3/F-W5-06「输出点名并计入不可修面 exit 2」—— 用户两级皆占时见到点名但文案若不含「处置哪个文件、如何恢复」指引，则 fix 完全不可用态无可操作出口 | 30 执行期：双占点名文案含「备份两级名均被占 · 请手动处置 `<file>.bak` / `<file>.pins-fix-backup` 后重跑」级指引（实现自由裁量内的文案质量 · 无需改 task） |
| A3 | 标注级 | **NEW-7 案 B 机检锚建议双锚**：task 现值机检断言 = 注释锚 grep（脚本头注释 + 声明文案在案 · 防注释被静默删）—— 未锚「测试实跑脚本」面（`pack-hygiene.test.ts:17` spawnSync SCRIPT 行）：理论残余 = 注释在而测试被改为不实跑（不删文件 · 计数纪律咬不到） | 30 执行期：注释锚 grep 断言建议扩为双锚（脚本头注释锚 + 测试文件实跑锚 · 如 `spawnSync`+SCRIPT 同现断言）· 或自检结论登记单锚理由；塌缩面残余已由计数纪律 + prepublishOnly 硬闸兜住（重点 2 分析）· 不阻塞 |
| A4 | 标注级 | **三处行号快照 ±2–3 行小疵**（锚点全中 · 区间尾略偏）：① R-1 回归锁 task 引 :536-587 · 实测 describe 末 fixture 收尾至 :589（closing braces 至 :597）· 四 fixture 锚点（:543-545/:557-559/:570-572/:585-587）全中；② findGitRoot task 引 cli-shared.ts:37-48 · 实测函数体止 :45（:47-48 为下一 JSDoc 头）；③ release-tag-identity 头注释 S5.5 引 :14-16 · 必读列表引 :11-17 · 实测 JSDoc 块 :11-17 —— 两处口径不一致但皆落在块内 | 无需改 task（行号口径已声明「实读现值」· 锚点全中不影响执行）；30 改前复读时以实读为准（必读列表 :186 已含「改前复读」纪律） |

---

## 五、总结论

**PASS-with-issues**（blocking 0 · advisory 4）—— task 内容与 SPEC/PLAN/硬约束逐项一致，五条重点全部成立（**重点 1**：fixture 驱动选型口径可接受 · 验收意图优先于 SPEC 示例字面（「等」字非绑定）· 偏离注释理由三面已锁 · 30 正则形态不须回 SPEC 回注；**重点 2**：测试内实跑构成事实第二控制点认定成立 · 塌缩最坏情形退回显式单点仍有发布端硬闸 · 零闸窗不存在 · 不须案 A 兜底 · 维持案 B；**重点 3**：契约修订定性成立 · 消费面零波及本审独立实证（assertJsonNoAbsRoot 全文串扫描反证 + Object.keys 七处固定字段集 + host_hits 宿主 id）· 消费者仓口径足够 · 键碰撞语义补登记 A1；**重点 4**：迁移映射实证成立（cli-host.ts = 21 行纯 barrel · findGitRoot 唯一实现/唯一消费点 grep 双实证）· 回归锁行为+代码+证据三重充分；**重点 5**：避让命名与双占 failClosed 取舍成立 · 第三条路以报错文案指引形态满足（A2）· 不须新开设计面），闸行裁决（不设 HG-SCHEMA-CHANGE）三理由 + 升级条款复核成立，关键数字（794/150/793/0/1 · 90.2s · typecheck 0 · pins 17/17 · HEAD 3664e6f · deps 仅 js-yaml）与 40+ 处行号快照经本审**独立复跑 / node 正则实证 / grep 复核 / 逐处抽核**（含 SPEC 示例正则 `\.(bak|BAK)(\.|$| )` 拦不住 `.bak2` 的独立复现 · NEW-8 现值 :697-699 静默覆盖+删除实锤确认）。**思考轮审查通过，充分性裁定：充分。**

本审**不代签** HG-AUDIT-R1；签署归 00（维护者 2026-09-16 授权模式）。**因 HG-AUDIT-R1 仍为 pending，按纪律不附 30 Prompt**，仅出维护者签闸清单：

## 维护者签闸（20 后 · 30 前）

- [ ] 已读 R1 审查结论（本文 · 含 advisory A1–A4）
- [ ] 在 task 人工闸表将 HG-AUDIT-R1 改为 approved（00 代签 · 维护者 2026-09-16 授权 · 日期）
- [ ] commit task 文档或确认已签（连同本棒交付：本审查文 + `docs/harness/invokes/by-task/3-0-w5-mechanical-cleanup/invoke_20260917_20_3-0-w5-mechanical-cleanup.md` · 逐文件显式 add · 禁 `git add -A`）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | R1 · 20-task-audit：常规核对 13 项全过（含基线全量独立复跑逐字一致 + SPEC 示例正则不完备 node 实证 + NEW-8 现值静默覆盖删除实锤）；五条重点逐条独立复核裁定（fixture 驱动选型可接受不须 SPEC 回注 · 案 B 认定成立塌缩不须案 A 兜底 · 契约修订成立消费面零波及实证 · R-1 迁移映射+三重回归锁充分 · 避让命名取舍成立第三条路以文案形态满足）；闸行裁决三理由+升级条款复核成立；独立复跑 npm test 794/150/793/0/1（90.2s）+ typecheck 0 + pins 17/17 + deps 仅 js-yaml + HEAD 3664e6f 全中；40+ 处行号抽核全中（3 处 ±2–3 行小疵）；gate-check/verify 双机检咬住 HG-AUDIT-R1 pending（双 exit 2）· task lint PASS；总结论 PASS-with-issues（blocking 0 · advisory 4：A1 NEW-12 键碰撞语义登记 · A2 NEW-8 双占文案处置指引 · A3 NEW-7 机检锚双锚建议 · A4 行号快照小疵）；不代签 HG-AUDIT-R1 |
