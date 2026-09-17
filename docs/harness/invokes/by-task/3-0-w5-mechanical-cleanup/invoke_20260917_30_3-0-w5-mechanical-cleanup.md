# Invoke：30（execute）· 3-0-w5-mechanical-cleanup（阶段一）

| 字段 | 值 |
|------|-----|
| hat_id | 30-execute |
| task_slug | `3-0-w5-mechanical-cleanup` |
| task_paths | `docs/tasks/active/task_3_0_w5_mechanical_cleanup.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要

阶段一（且仅阶段一）：**NEW-6 卫生门通配语义（四变体全拦 + files 否定项同步）+ NEW-7 案 B 显式声明（机检双锚）**（task S5.1/S5.2 · 验收 #1/#2 · 20 审 A3）。NEW-8 / NEW-12 / R-6 / R-1 归后续阶段，本棒零触碰。

## GATE_VERIFY（第 0 步）

`node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w5_mechanical_cleanup.md` → HG-TASK-DRAFT approved · HG-AUDIT-R1 approved · **VERIFY: PASS**（exit 0）。

## 红测先行证据（硬约束 6 · 修复前真红留证）

**手工探针（修复前 · 精确后缀 `/\.bak$/i` 口径）**：`assets/` 下造四变体 trap，`npm pack --dry-run` 清单实测 `.bak2` / `.bak.md` / 尾空格 `.bak ` 三变体在包 → `node scripts/check-pack-hygiene.mjs` 输出 `PACK HYGIENE: PASS · 270 files` **exit 0 漏网真红**；`.BAK` 未入清单（npm glob nocase · 被 `!assets/**/*.bak` 打包层先滤）→ 改经仓根 `README.trap-case.BAK` 探针实证：readme 自动入包规则（`/^readme(\..+)?$/i`）**免疫 files 否定项**必达闸门。

**新 fixture 组修复前实跑**（`test/pack-hygiene.test.ts` 扩展 · 旧脚本）：**pass 5 / fail 4** ——
- `.bak2` / `.bak.md` / 尾空格 `.bak ` 三变体负向：期望 exit 2 实测 exit 0（漏网真红 · 与 task 基线表 :65 预告逐字一致）
- NEW-7 锚①（脚本头双控制点声明 grep 断言）：红（声明未落）
- 同向对照（零回退锁 · 修复前即绿）：`.BAK`（旧 `i` 旗标已拦）· 正向合法名 `.bakery/.bakxt` 不误拦 · 锚②实跑行存在

**修复后同组 9/9 全绿**（四变体逐一 exit 2 点名 · 清除后复绿 · 正向零误拦 · 双锚在案）。

## NEW-6 通配选型与误拦面分析（验收 #1 · F-W5-04 · 20 审重点 1 口径）

- **选型**：`/\.bak(\.|$|[0-9]| )/i`（边界扩展式）。**偏离 SPEC §5/PLAN 示例 `\.(bak|BAK)(\.|$| )` 之理由**：示例字符集 `(\.|$| )` 不含数字 → 拦不住 `.bak2`（task S5.1 ⚠️ 起草发现在案）；已裁定口径 = 验收 binding 优先 · 示例非约束面 · 不回注 SPEC · 理由注释落 `scripts/check-pack-hygiene.mjs` 头注释。
- **误拦面分析**：对照候选子串级 `/\.bak/i`（覆盖最全但误拦面最大 —— 拦 `x.bakery` / `x.bakxt` 等「.bak 后接字母」合法名）；本选型命中面 = 「.bak + 点/数字/空格/结尾」= 备份衍生族语义内。合法名枚举 `.bakery` / `.bakxt` 不误拦（正向 fixture 钉死 · 修复前后同绿）。未来合法格式命中 → 白名单修正须评审（不通配到语义模糊面）。
- **已知边界登记**：目录级 `dir.bak/文件` 不在变体表内（不拦 · 超 fixture 边界不扩 · 头注释在案）。
- **files 否定项同步 diff**：`"!assets/**/*.bak"` → `"!**/*.bak"` + `"!**/*.bak.*"`。/tmp 隔离探针实测分工：glob 可表达面（`.bak` 精确 · nocase 含 `.BAK` · `.bak.*` 扩展段）打包层先滤；glob 不可表达面（`.bak2` 数字续段 · 尾空格 `.bak ` · README\*.bak\* readme 自动入包免疫否定项）由卫生门通配兜住 —— 分工注释落脚本头注释（JSON 无注释位 · task S5.1 口径）。

## NEW-7 案 B 落地（验收 #2 · 20 审 A3 机检双锚）

脚本头注释补「双控制点声明」：① `package.json` prepublishOnly 链末端（发布链路）② `test/pack-hygiene.test.ts` 在 npm test 内实跑（CI 每 push 覆盖 · `.github/workflows/ci.yml`）· **无第三控制点**明示。机检双锚：锚①=测试 grep 断言声明文案四要素（双控制点声明/prepublishOnly/pack-hygiene.test.ts/无第三控制点 · 防注释被静默删）；锚②=测试自指断言实跑行 `spawnSync(process.execPath, [SCRIPT]` 存在（防注释在而实跑被摘）。

## 锁逐项（本棒实测）

- `npm run typecheck` **0 错** · `npm run build` exit 0
- `npm test` **801 tests / 152 suites / 800 pass / 0 fail / 1 skip**（基线 794/150/793/0/1 复跑逐字一致 + 新增 7 测试 / 2 套件 · 零意外红 · skip 数不变 · duration ≈91s vs 基线 ≈88s）
- `npm run test:lib` **6/6 pass**
- `node bin/specgate.js pins check` **17/17 PASS**
- verify --task 复跑 **VERIFY: PASS**
- pack 系测试（cli-docs-122 / cli-p0 / pack-hygiene）**31/31 全绿** · 卫生门修严后对现行包内容零误伤（正向用例 PASS · 270 files 现包无 .bak 族残留）
- 依赖零新增（dependencies diff 空 · 仍仅 js-yaml）

## 偏差登记（执行期实测偏离底稿处 · 逐条归因）

1. **HEAD 差异**：task 基线 HEAD `3664e6f` → 本棒开工 HEAD `40e3f43`（task 文件自身入库所致 · tree clean · 基线数字复跑逐字一致 · 非行为偏差）。
2. **同族盘点裁定（S5.1 登记级）**：`src/cli-assets.ts:32` manifest 排除面**不同步通配**（资产命名本仓自控 · 精确后缀已足 · 不通配到语义模糊面 F-W5-04）· 分叉理由注释落该行（两口径之「注释声明」支 · 未静默）。
3. **`.BAK` 变体非红转绿面**：修复前 `/\.bak$/i` 之 `i` 旗标已拦（同向对照 · task 基线表 :65 预告漏网仅三变体逐字一致）· 本用例兼作零回退锁。
4. **trap 落点统一仓根 `README.trap-*`**（task 未指定落点）：readme 自动入包规则免疫 files 否定项 · 四变体必达闸门 · 与打包层 glob 分工解耦（单测闸门语义本身）· 理由注释在测试文件。
5. **基线首跑自污染事件（F-W0-07 同式对照定性）**：首跑基线 npm test 与手工 trap 探针并发 → assets 完整性用例红（4 偏差恰 = 自造 4 trap · 环境非代码）· trap 清除 + tree clean 后复跑逐字一致（794/150/793/0/1）· 定性为并发自污染非回归 · 后续全程串行。

## 既有面改动登记（验收 #8 · F-W2-13 同式纪律）

- `scripts/check-pack-hygiene.mjs`：头注释扩（NEW-7 双控制点声明 + NEW-6 通配口径/选型理由/误拦面分析/分工）· 黑名单正则 `/\.bak$/i` → `/\.bak(\.|$|[0-9]| )/i` · FAIL 文案「\*.bak」→「.bak 族」
- `package.json`：files 否定项 `"!assets/**/*.bak"` → `"!**/*.bak"` + `"!**/*.bak.*"`（数据行非结构变更 · 闸行裁决①在案）
- `src/cli-assets.ts`：:32 同族分叉理由注释（纯注释 · 行为零变更）
- `test/pack-hygiene.test.ts`：扩 NEW-6 四变体负向 + 正向不误拦 + NEW-7 双锚（+7 测试 +2 套件）· 既有正向/负向用例零改动全绿

---

## 阶段二 · NEW-8 pins fix 备份不误删 + NEW-12 相对化覆盖对象 key（00 验收放行后开工）

### 红测先行证据（硬约束 6 · 修复前真红留证）

新 fixture 组修复前实跑（`--test-name-pattern='NEW-8|NEW-12|B12|B13'` · 旧码）：**pass 2 / fail 4** ——
- **B12**（用户既有 `.bak` 存活 fixture）：修复前旧码 `copyFileSync(abs, abs+'.bak')` 静默覆盖用户文件 → `unlinkSync` 删除 → 用户 `.bak` 灭失（真红 · 零预警损失实锤面复现）
- **B13**（两级皆占 fixture）：修复前 exit **0**（期望 2 · 旧码无占用语义照样覆盖删除写盘）
- **NEW-12 key fixture**：修复前以绝对路径为 key 的对象经 `relativizeOutputValue` 后 key 原样泄漏（断言无绝对路径 key → 真红）
- 同向通过（锁面）：零改写锁（无路径 key 对象逐字不变 · 修复前后同绿）

修复后同组全绿（B12 用户文件逐字存活 + 避让备份自清理 · B13 exit 2 点名含指引 · NEW-12 key 相对化 + 碰撞登记语义）。

### NEW-8 定稿口径落地（S5.3 · 验收 #3 · F-W5-03/F-W5-06）

`src/cli-pins.ts` 写盘循环：`<file>.bak` 空闲则用（旧行为不变）· 已被占 → 避让 `<file>.pins-fix-backup`（刻意避开 .bak 后缀防 NEW-6 通配自咬）· **两级皆占 → 跳过写盘 + exit 2 点名**（不无备份写盘 · 不递增第三级名）。写盘成功后只清本次自写备份（跟踪实际用名 `backup` 变量 · 2.3.1 N1-d / F-P2-08 语义不变）。

**A2 文案样例（实测输出串）**：
- `[skipped] assets/ontology.yaml（备份两级皆占：.bak 与 .pins-fix-backup 均存在 · 不无备份写盘 · 请手动处置后重跑）`
- `PINS FIX: 1 处备份两级皆占跳过写盘（不无备份写盘 · 请手动处置后重跑）`（exit 2 · failClosed）

dry-run 文案同步（:684）：「写前备份 <file>.bak（已被占则避让为 <file>.pins-fix-backup · 两级皆占则跳过写盘 exit 2）· 写盘成功后自动清理自写备份」。

### NEW-12 定稿口径落地（S5.4 · 验收 #4 · F-W5-05）

`src/cli-shared.ts` `relativizeOutputValue` 对象分支 `out[k]` → `out[walkString(k)]`（key 与 value 同函数同 bases 口径）。

**契约注释 diff（:433 区 · 含 A1 碰撞句）**：
```diff
-/** 深遍历 JSON 载荷：仅改字符串值（键名不动 · 契约「键集只增不改」）。 */
+/**
+ * 深遍历 JSON 载荷：字符串值与对象键名同经相对化（3.0-W5 NEW-12 契约修订）。
+ * 契约「键集只增不改」= 键**集合**（存在性集合）语义不变 —— 相对化是改写非增删；
+ * 含绝对路径基串的 key 会被相对化改写（与 value 同函数同 bases 口径 · 消费方以绝对路径 key 查表须同步修 · F-W5-05）。
+ * 键碰撞语义（20 审 A1 登记）：相对化后撞名后者覆盖前者 · 信封不得依赖碰撞面。
+ */
```

**消费面复核结论（F-W5-05 · 预期零波及实锤）**：全量 npm test 绿 = `assertJsonNoAbsRoot` 全 stdout 串扫描面（cli-json-no-abs-path 全 describe · 含 R-1 回归锁）+ `Object.keys` 固定字段集快照面（verify/gate-check/pins 等）+ JSON 契约面合跑 105/105（cli-flags 路径边界反向 fixture 含）**零意外红** —— 现网无以绝对路径为 key 的信封（与 S5.4 预查一致）· 零断言改动零快照更新。

### 锁逐项（阶段二本棒实测）

- `npm run typecheck` **0 错** · `npm run build` exit 0
- `npm test` **806 tests / 153 suites / 805 pass / 0 fail / 1 skip**（阶段一终态 801/152/800/0/1 + 新增 5 测试 / 1 套件 · 零意外红 · skip 数不变 · duration ≈97s）
- `npm run test:lib` **6/6 pass** · pins **17/17 PASS** · verify --task 复跑 **VERIFY: PASS**
- JSON 输出契约面（cli-flags + cli-json-no-abs-path + pins-consistency 合跑）**105/105 全绿**
- 依赖零新增

### 偏差登记（阶段二）

1. **NEW-12 fixture 落点**：task S5.4 建议「selfproof 系扩或单测直调」二选一 —— 取**直调导出函数**式但落于 `cli-json-no-abs-path.test.ts` 同文件（新 describe · 与 selfproof 系邻接 · 两全其建议形态）。
2. **碰撞语义用例非红转绿面**：「撞名后者覆盖前者」为新行为本体（修复前两 key 并存必红）· 与 key fixture 同红转绿组一并留证 · A1 登记语义钉死。
3. **dry-run 文案具体措辞 30 定**（task 仅要求口径更新为改名避让语义 · B3 用例 `/dry-run/` 断言零回退实测绿）。
4. **跳过计数为加性尾注**：`PINS FIX: 写入 N 处 · 不可修 M 处` 行尾追加「· 备份两级皆占跳过 X 处」（既有汇总口径零触碰 · 仅加性 · 非范围红线遵守）。
5. **B12/B13 编号接 B11 后**（既有文件 B10 在 B11 后 · 编号序本非严格 · 沿用文件内就近插入体例）。

---

## 阶段三 · R-6 git 分档诊断 + 套件前置探测 + R-1 回归 + 收官备料（00 验收放行后开工）

### R-6 分档实现（S5.5 · 验收 #5 · 硬约束 10 · exit code 零变更红线）

`src/cli-pins.ts`：`PinResult` additive 扩键 `error_kind?: 'git_missing' | 'git_exec_failed' | 'not_git_repo'`（契约「键集只增不改」允许只增 · 闸行裁决②）· git-tag extract catch 一刀切 → 按因分档三态（ENOENT/EACCES → git_missing · exit 128/stderr「not a git repository」→ not_git_repo · 其余非零 exit → git_exec_failed 带 exit code+stderr 摘要）· tag 缺失维持既有 missing 不挂 error_kind（F-A1-05 面零触碰）· 人读输出经既有 detail 行同步带分档文案。**exit code 零变更**：extract_error 仍计入 bad → exit 2（failClosed 不降级 · 无 exit 0 第三条路 · R6-1 fixture 断言钉死）。

**error_kind 三态输出样例（实测）**：
- git_missing（PATH 隔离真仓 pins check --json）：`"detail": "git 不存在或不可执行（环境不具备 · 硬约束 10 · R-6）", "error_kind": "git_missing"` · exit 2
- git_exec_failed（假 git exit 69 模拟 license 未同意面）：`"detail": "git 执行失败（环境不具备 · 硬约束 10 · R-6 · exit 69 · fatal: xcode license has not been accepted）", "error_kind": "git_exec_failed"` · exit 2
- not_git_repo（真 git · temp 非 git 仓）：`"detail": "target 非 git 仓（环境不具备 · 硬约束 10 · R-6 · not a git repository）", "error_kind": "not_git_repo"` · exit 2
- 真偏差对照（git 可用 tag 缺失 · W1-B5）：status=missing · detail「git tag 缺失 · git 操作仅人」· **error_kind undefined**（与环境三态可区分断言钉死）

### PATH 隔离实证（验收 #5② 核心 · POSIX 口径）

`env PATH=/tmp/nogit-bin node --test 三改造文件`：**92 tests / 86 pass / fail=0 / skipped 6** —— skip 归因逐条：release-tag-identity 1 + pins-consistency（A 组 1 · W1-B5 1 · R6-3 1）+ cli-refresh-ide-blocks（M12 1 · D29-5 1）。TAP 摘录：`ok 1 - tag v2.4.2 存在… # SKIP git 不可用（环境不具备 · 硬约束 10 · R-6）`（统一锚 grep 机检 = R6-4 fixture 钉三文件）。同环境真仓 `pins check --json` → pin-10 `error_kind: git_missing` · exit 2（锁口径「pin-10 分档预期」✓）。负向对照：正常环境三文件 92/92 pass **0 skip**（probe 不误触发 · tag 缺失维持 FAIL 语义零松动）。

### 套件前置探测（三文件 · 各文件同构支）

实跑式 `gitAvailable()`（`git --version` 判 status · 非 which 式 · F-W5-07）落三文件（与 w2-shell-hook.test.ts:47-49 先例同构 · 注释口径统一声明）：release-tag-identity 单 it（skip/fail 边界注释在案）· pins-consistency A 组 + W1-B5（行号漂移登记见下）· cli-refresh-ide-blocks M12/D29-5（initGitRepo 两消费点）。

### R-1 回归确认（S5.6 · 只验不回改 · 零 diff 硬锁 · 验收 #6）

- `git diff 3664e6f..HEAD -- src/host/cmd.ts` = **0 行**（波次基比对口径 · 见偏差 5）
- `git diff 3664e6f..HEAD -- src/cli-shared.ts` = 仅 NEW-12 两 hunk（:430 注释 + :451 实现）· findGitRoot :37-48 **零触碰**
- 回归锁 `cli-json-no-abs-path.test.ts` R-1 describe **4/4 绿**（跨目录缺省基/realpath/仓外/symlink 四 fixture）
- 手工跨目录复跑（`cd /tmp && node <仓>/bin/specgate.js host validate --file <绝对路径> --json`）：`{"command":"host validate","file":"assets/ide/host-adapt/examples/mvp-hosts.yaml","ok":true,"verdict":"PASS"}` exit 0 · 无绝对路径 ✓（硬约束 14 证据面 = 本文本）

### 锁逐项（阶段三终态 · 本棒实测）

- `npm run typecheck` **0 错** · `npm run build` exit 0
- `npm test` **810 tests / 154 suites / 809 pass / 0 fail / 1 skip**（806 基线 + R6 describe 4 测试 1 套件 · 零意外红 · skip 恒 1 = 开工基线既有 standing skip · 本波正常环境零新增 · ≈98s）
- `npm run test:lib` **6/6 pass** · pins **17/17 PASS**（PATH 隔离下 pin-10 行为符合分档预期 · 样例在案）· verify --task 复跑 **VERIFY: PASS**
- 结构闸 `task lint` **PASS** · 波末 `gate-check` **exit 0**（task close 待 40 复核后 00 口径另行 · 本棒不执行）
- 依赖零新增

### 偏差登记（阶段三）

1. **pins-consistency 行号漂移**：task 盘点「:562 git init assert」现址 :615-616（W1-B5 内 · 本波 B12/B13 插入致漂移 · 20 审 A4 行号小疵同型登记）。
2. **A 组真实仓 pins check 亦依赖 git（pin-10 git-tag）· task 盘点未列**：PATH 隔离 fail=0 判据所必需 → 同口径 probe 覆盖 A 组 it（非静默扩面 · 登记在案）。
3. **probe 形态择「各文件同构」支**（task S5.5 许二择一 · 免新增共享 helper 文件面 · 三文件注释口径统一声明）。
4. **EACCES 并入 git_missing 档**（「不可执行」语义 · 与 ENOENT 同档 · 无独立 fixture · 登记）。
5. **R-1 零 diff 比对基更正**：初跑误用 v2.4.2 tag 基 → diff 929 行（含 W0–W4 历史变更 · 非 R-1 回改）· 更正为波次基 3664e6f → host/cmd.ts 0 行 · cli-shared.ts 仅 NEW-12 两 hunk（tag 基≠波次基 · 口径登记）。
6. **build 时序教训**：bin/specgate.js 消费 lib/ 构建产物 · src 改后须 rebuild 方反映（首跑 PATH 隔离 pins check 样例为旧 lib 输出「git 不可用或 target 非 git 仓」· rebuild 后复取得分档样例 · 一拍即修过程登记）。
7. **R6-2 假 git sh 脚本 POSIX 限定**（win32 t.skip 护栏在案 · F-W5-08 win32 PATH 隔离失真风险登记 · CI 主跑 Linux/macOS）。
8. **R6-4 统一锚机检落 pins-consistency**（grep 断言三文件均含「环境不具备 · 硬约束 10」· 与真偏差 exit 2 输出可区分）。
