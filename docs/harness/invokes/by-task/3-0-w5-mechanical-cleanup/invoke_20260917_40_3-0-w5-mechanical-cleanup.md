# Invoke：40（review-of-work）· 3-0-w5-mechanical-cleanup

| 字段 | 值 |
|------|-----|
| hat_id | 40-review-of-work |
| task_slug | `3-0-w5-mechanical-cleanup` |
| task_paths | `docs/tasks/active/task_3_0_w5_mechanical_cleanup.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |
| 复核对象 | `40e3f43..5fc9113`（HEAD）五 commit |

## 复核范围与方式

独立复核 30 三阶段交付（NEW-6 卫生门通配 / NEW-7 案 B 双控制点声明 / NEW-8 pins fix 备份避让 / NEW-12 相对化覆盖对象 key / R-6 git 分档诊断+套件前置探测 / R-1 回归确认）。**不接受「30 说绿」**：全部平台锁独立复跑 + 验收 #1–#10 重点项 **40 本棒独立构造 fixture 重放**（trap 文件手自造手自清 · temp 仓自造 · PATH 隔离环境自造 · error_kind 三态各自独立诱发）+ diff/grep 机检面逐条自跑。探针临件全部落 /tmp 或随手清除（工作树净复核在案）。

## 独立实测证据（40 本棒自跑）

### 平台锁复跑

| 项 | 实测 | 预期 | 判 |
|----|------|------|----|
| `npm run typecheck` | 0 错（exit 0） | 0 错 | ✓ |
| `npm run build` | exit 0 | 0 错 | ✓ |
| `npm test` | **810 tests / 154 suites / 809 pass / 0 fail / 1 skip**（duration ≈97.7s） | 810/154/809/0/1 | ✓ 逐字 |
| `npm run test:lib` | **6/6 pass**（exit 0） | 6/6 | ✓ |
| `node bin/specgate.js pins check` | **17/17 PASS** | 17/17 | ✓ |
| `verify --task <本 task>` | **VERIFY: PASS**（exit 0 · 双闸 approved 落表） | PASS | ✓ |
| `task lint --file` / `gate-check --task` | PASS / exit 0 未发现阻塞 | PASS/0 | ✓（验收 #9/#10 前置） |

### 验收抽核（40 独立构造重放）

- **#1 NEW-6 四变体 trap（手自造仓根 README.trap-* · 跑后清除）**：`.bak2` / `.bak.md` / `.BAK` / 尾空格 `.bak ` 四变体逐一 **exit 2 且输出点名该文件名**；正向不误拦 —— `assets/hygiene-legit.bakery` + `.bakxt` 在场时 **exit 0 · PACK HYGIENE: PASS · 269 files**。pack-hygiene.test.ts 定向抽跑 **9/9 pass**（四变体负向 + 正向 + README trap + NEW-7 双锚）。
- **#2 NEW-7 案 B**：`check-pack-hygiene.mjs` 头注释双控制点声明四要素（双控制点声明 / prepublishOnly / pack-hygiene.test.ts / 无第三控制点）实读在案（:7-11）· 机检双锚用例（锚①注释 grep · 锚②实跑行自指断言）在 9/9 内绿。
- **#3 NEW-8 存活（40 自造 temp 仓 · 不复用 30 fixture）**：预置用户自有 `ontology.yaml.bak`（marker）+ 漂移目标 → `pins fix --yes` → **用户 .bak 逐字存活 · 目标已修 9.9.9→3.1.4 · 自写避让备份零残留**（exit 0）。**两级皆占**（.bak 与 .pins-fix-backup 均预置）→ **exit 2**（独立捕获管道退出码实证）· 点名 `ontology.yaml` 含「**请手动处置后重跑**」（A2）· 目标/用户 .bak/stale 三件逐字未动（零写盘零损失 · F-W5-06）。
- **#4 NEW-12（40 直调导出函数）**：`relativizeOutputValue('/tmp/w5-40-base', { '/tmp/w5-40-base/assets/x.yaml': { inner: '/tmp/w5-40-base/bin/y' }, 'plain-key': 'no-path' })` → key 相对化为 `assets/x.yaml` · 内层 value `bin/y` · `plain-key` 逐字不变。契约注释（cli-shared.ts:433-438）实读含 **A1 碰撞句**「相对化后撞名后者覆盖前者 · 信封不得依赖碰撞面」。
- **#5 PATH 隔离（40 自造无 git PATH 独立复跑）**：隔离环境 `command -v git`=NONE → 三改造文件（release-tag-identity / pins-consistency / cli-refresh-ide-blocks）**86 pass / 0 fail / 6 skipped**（与 30 声称逐字一致 · skip 标注统一锚「环境不具备 · 硬约束 10」R6-4 机检在案）；同环境 `pins check --json` → pin-10 `status=extract_error · error_kind=git_missing · detail 含「环境不具备 · 硬约束 10」` 且 **exit 2**（failClosed 不降级 · 无 exit 0 第三条路实证）。**正常环境对照**：同三文件 **92 pass / 0 fail / 0 skipped**（skip 全归因 PATH 隔离实证面 · 无环境红残留）。
- **#6 R-1 零 diff 硬锁**：`git diff 3664e6f..HEAD -- src/host/cmd.ts` = **0 行**；`src/cli-shared.ts` 仅 **NEW-12 两 hunk**（契约注释修订 + `out[walkString(k)]`）· findGitRoot（:37-48）零触碰。手工跨目录复跑：`cd /tmp && node <仓>/bin/specgate.js host validate --file <绝对路径> --json` → 输出 `"file":"assets/ide/host-adapt/examples/mvp-hosts.yaml"` 无绝对路径 · exit 0（与 30 自检逐字一致）。

### error_kind 三态 + 真偏差对照（40 各自独立诱发 · 验收 #5①③④）

| 态 | 诱发方式 | status / error_kind | exit | 判 |
|----|----------|--------------------|------|----|
| git_missing | PATH 隔离无 git | extract_error / git_missing | 2 | ✓ |
| git_exec_failed | 假 git（sh 脚本 stderr+exit 69）前置 PATH | extract_error / git_exec_failed · detail 含 exit 69 + stderr 摘要 | 2 | ✓ |
| not_git_repo | 完整 fixture（含 package.json）但无 .git | extract_error / not_git_repo · detail 点名「非 git 仓」 | 2 | ✓ |
| 真偏差（tag 缺失） | 真 git 仓（init+commit 无 tag） | **missing / error_kind 键缺席（undefined）** · detail「git 操作仅人 F-A1-05」 | 2 | ✓ 可区分 |

四态 exit 全 2（exit code 语义零变更红线实证）· 环境三态挂 additive `error_kind` 而真偏差不挂 —— 归因可区分性成立。

### 既有面零改动（验收 #8 · F-W2-13 同式）

- `git diff 40e3f43..HEAD --stat -- test/`：5 文件 +300/−11 —— pack-hygiene（NEW-6/NEW-7）· pins-consistency（B12/B13 + R6 组 + probe）· cli-json-no-abs-path（NEW-12 组）· release-tag-identity / cli-refresh-ide-blocks（probe 改造）—— 与自检登记清单逐条对应 · **零意外文件**。
- `package.json` diff 仅 `files` 数组内否定项数据行（`"!assets/**/*.bak"` → `"!**/*.bak"` + `"!**/*.bak.*"`）· 键形态/字段集零变更（闸行裁决①属实）· dependencies 仍仅 js-yaml（零新增）。
- `src/cli-assets.ts` diff = 4 行纯注释（同族分叉理由 · 行为零变更）。

### commit 卫生（验收 #10）

五 commit 逐笔 `show --stat`：`40e3f43`（docs 5 文件 task+审查文+invoke 三件套）· `4a26b95`（NEW-6/NEW-7 · 5 文件）· `b6ca7ca`（NEW-8/NEW-12 · 5 文件）· `49117df`（R-6/R-1 · 5 文件）· `5fc9113`（自检回填单文件）—— scope 与提交信息约定一致 · 边界干净。工作树净（40 探针后 `git status --porcelain` 空）· `main ahead 5 未 push` · `git tag --points-at HEAD` 空（无新 tag）· 发布四动作零触碰。

## 收官备料核对

自检结论回填完整：GATE_VERIFY 记录 · 三阶段锁计数链 794→801→806→810 纯加性（40 终态复跑逐字一致）· 验收 #1–#10 逐项勾选 · **NEW-6 误拦面分析+选型理由**（:278 · 对照 S5.1 ⚠️ 起草发现 · 偏离 SPEC 示例理由在案）· **NEW-7 案 B 证据**（:280）· **R-1 零 diff+手工复跑证据**（:282 · 含比对基更正登记）· **已知未测项 4 条**（:284 · win32 PATH 隔离失真 / EACCES 无独立 fixture / 目录级 dir.bak/ 不拦 / 人读输出仅 detail 承载）· **KPI 自评备料**（:286 · rubric 引照 · 硬约束 6/10/14/15 逐项兑现声明 · advisory A1–A4 落地声明 · **待 00 填节**）。F-W2-13 登记清单（:276）引 30 invoke 三阶段全谱。

## 发现清单

- **blocking：0**
- **advisory：0**
- 观察注记（非发现 · 40 探针方法学留痕）：① 双占场景首测误用 `cmd | tail` 管道致 `$?` 取到 tail 退出码（假 exit 0）· 改独立捕获后实证真 exit 2 —— 产品无问题；② not_git_repo 探针首测因 temp 仓缺 package.json 被「真值源缺失」前置拦截 · 补齐完整 fixture 后 `error_kind=not_git_repo` 正常分档 —— 前置拦截自身 failClosed exit 2 行为正确。

## 结论

**PASS**（blocking 0 · advisory 0）—— 平台锁独立复跑全绿且计数逐字一致 · 验收 #1/#3/#4/#5/#6 重点项经 40 独立构造 fixture 重放属实（四变体 exit 2 点名 · 用户 .bak 存活+双占 exit 2 含 A2 文案 · key 相对化+A1 碰撞句 · PATH 隔离 86/0/6 与正常环境 92/0/0 对照 · error_kind 三态+真偏差可区分 · R-1 零 diff）· 既有面零意外 · commit 卫生与未 push/tag 复核在案 · 收官备料足够 00 填 KPI 节。

## 未做（禁区）

未改 src/scripts/package.json/test/SPEC/PLAN/task 文 · 未签任何闸 · 未 push/tag/publish/deprecate（本棒唯一写面 = 本 invoke 新增 · 探针临件全清）。

## 下一棒

00 放行 → **30 `task close --yes`** 关账（00 收官裁定回填 `### KPI（00）` 节 · 备料充足）· task 归档 done/。
