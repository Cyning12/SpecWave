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
