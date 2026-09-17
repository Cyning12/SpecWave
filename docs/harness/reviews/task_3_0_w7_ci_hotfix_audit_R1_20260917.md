# Task Audit R1：3-0-w7-ci-hotfix

> **审查帽**：20-task-audit · **轮次**：R1 · **日期**：2026-09-17
> **审查对象**：`docs/tasks/active/task_3_0_w7_ci_hotfix.md`（3.0 W7 CI hotfix · **HG-TASK-DRAFT = approved（00 代签）** · **HG-AUDIT-R1 = pending**）
> **审查方式**：书面审查 + 独立复跑（**零改 task 实质 / 不代签任何闸**）
> **依据**：PLAN_3_0 硬约束 1/6/10/14 · SPEC 08 §5.2 链接两级判据 · W1 CI hotfix 先例（`docs/tasks/done/task_3_0_w1_ci_hotfix.md`）

---

## 1. 元信息与工作区实态

| 字段 | 实测值 |
|------|--------|
| task_slug | `3-0-w7-ci-hotfix` |
| 工作区 | `/Users/cyning/Desktop/Projects/dsh-coding-kit` · Open Folder = 仓根 |
| git HEAD | `3d1b9d38c76183c649af10b0523b2237f0582699`（`3d1b9d3`） |
| tag `v3.0.0` | **注解 tag**（`git cat-file -t v3.0.0` = `tag`）→ commit **`3d1b9d3` = HEAD**（`git rev-parse v3.0.0^{commit}` 一致 · 与 task 头部口径吻合） |
| 工作区 | clean + `?? docs/tasks/active/`（唯一 untracked = 本 task 起草件 · 与基线节「+1 untracked」一致） |
| `docs/coding_wiki/` | **不存在**（task `wiki_delta_note` 实证正确） |
| `docs/_tech_graph/` | 存在（task `graph_delta=none` 声明不改本资产 · 本修不触碰） |

---

## 2. 独立复跑证据（本帽实测 · 未采信 task 转述）

### 2.1 发布阻断复现（修前）

| 项 | 命令 | 实测 | 判定 |
|----|------|------|------|
| 本地 checker（假绿） | `node scripts/check-doc-links.mjs` | `非S2=0 · S2=23 / 基线 23 · exit 0` | ✅ 与 task 基线 :104 逐字一致 |
| 干净 clone（真红） | `git clone -q . /tmp/ci-sim && git checkout v3.0.0 && node scripts/check-doc-links.mjs` | `非S2=0 · S2=34 / 基线 23 · exit 2` · `DOC LINKS: FAIL · S2(i)=34 ≠ 基线 23` | ✅ 与 task 基线 :105 逐字一致 |
| S2 集合差 | 本地 vs clone 的 S2(i) 集合 diff | **clone−local = 11**（local−clone = 0）· distinct target = 4：`.workbuddy/output/验收报告-SpecWave-2.2.0.md`×2 / `2.3.0`×3 / `2.4.0`×3 / `2.4.1`×3 | ✅ 与 task :60「11 处」吻合 |

### 2.2 CI 真值（`gh` 独立复核）

| run | 实测 |
|-----|------|
| `35245272523` | `conclusion=failure · event=push · headSha=3d1b9d38... · workflowName=ci` · failure job = `test (22.x)` / `test (24.x)` |
| `35245273138` | `conclusion=failure · event=push · headSha=3d1b9d38... · workflowName=ci` |
| 失败测 | `gh run view 35245272523 --log-failed` 逐字命中 `# Subtest: 正向：真实仓 非S2(i)=0 非S2(ii)=0 · S2 冻结基线 23 · exit 0` + `not ok 1` + `DOC LINKS (i) 非S2 = 0 · S2 = 34 / 冻结基线 23` |

→ task §背景 A-真值（双 run / headSha / 双 job / 唯一失败测 :35）**逐条成立**。

### 2.3 基线节核对

| 项 | task 声明 | 本帽实测 |
|----|-----------|----------|
| `npm test` | 859 / 164 / 858 pass / 0 fail / 1 skip | **859 tests / 164 suites / 858 pass / 0 fail / 1 skip**（61.97s）✅ |
| `npm run typecheck` | 0 错 | **exit 0** ✅ |
| `node bin/specgate.js pins check` | 17/17 PASS exit 0 | **17/17 PASS · exit 0**（pin-10 = tag `v3.0.0`）✅ |
| tag `v3.0.0` | `3d1b9d3` = HEAD | 注解 tag → commit `3d1b9d3` = HEAD ✅ |
| 本地 / clone | 23 假绿 / 34 真红 | 23 / 34 ✅ |
| `ACCEPTANCE` 三处 23 | :35 / :45 / :62 | grep 命中 **:35 / :45 / :62** ✅ |
| `w7_release_probe` | grep 零引用 23 | **NONE** ✅（零改动口径成立） |
| 已归档排除路径 | `S2_PARAM_EXCLUDE` 指向的 W7 task 已 done | `docs/tasks/active/task_3_0_w7_closeout_external.md` **不存在** · 实体在 `docs/tasks/done/` ✅（条目失效属实） |

### 2.4 三组对照实验独立复现（`/private/tmp` 探针副本 · 仓内零改动）

以 `scripts/check-doc-links.mjs` 现值逐字派生三变体，对**本地根**与**干净 clone** 双跑：

| 变体 | 判据 | 本地 S2 | clone S2 | 非S2(i) | 本地↔clone S2 集合 |
|------|------|---------|----------|---------|--------------------|
| 修前 base | `existsSync` | 23 | 34 | 0 | ✗（差 11） |
| A 字面最小式 | `inRepo ? gitTracked.has(rel) : existsSync(abs)` | 42 | 42 | **48** | IDENTICAL |
| B +目录前缀 | `… || trackedDirs.has(rel)` | 34 | 34 | **1** | IDENTICAL |
| **C 法定（+`-z` 原样读取）** | 目录前缀 + `-c core.quotepath=false ls-files -z` | **34** | **34** | **0** | **IDENTICAL** |

- A 的 48 处全为**目录链**（`../spec/…/` / `../tasks/done/` 等），与 F-HOT2-04 逐字吻合。
- B 的 1 处 = `../../guides/DOGFOOD_host_adapt_cursor_claude_录屏清单_v1_zh.md`；独立验证 `git ls-files` 默认对非 ASCII 输出八进制转义（`"…\345\275\225…"`），`-c core.quotepath=false` 后原样（F-HOT2-05 成立）。
- C 双端 S2 集合 **逐条 IDENTICAL**、非 S2 归零 ⇒ **法定修法三件套缺一即回归** 的因果链**独立成立**。

### 2.5 环境无关 fixture 与 (ii) 复绿分支（重点 2 实证）

| 场景 | pre-fix（base） | post-fix（变体 C） |
|------|-----------------|--------------------|
| 临时 root `git init` + `.gitignore .workbuddy/` + 实体 `.workbuddy/x.md` + S2 md 引用 | `S2=0` · `--s2-baseline 0` → **exit 0（被掩盖）** · baseline 1 → exit 2 | `S2=1` · `--s2-baseline 1` → **exit 0** · `--s2-baseline 0` → **exit 2** |
| 既有 (ii) fixture 复绿分支（`./tracked.md` 写在临时目录） | exit 0（`existsSync` 判「可解析」） | **无 `git add` → exit 2 转红**；`git init` + `git add docs/roadmap/tracked.md` → **exit 0** |

⇒ 范围 2② 与 2③ 的要求**均属真实且必需**，fixture 设计成立。

### 2.6 结构闸与脚本快扫核对

- `npx spec-wave task lint --file docs/tasks/active/task_3_0_w7_ci_hotfix.md` → **LINT: PASS**（E1–E8 / W5–W7：R0–R5 槽位 + 控制表齐）。
- `npx spec-wave verify --target . --task …` → 闸表**可机检**：渲染 `HG-TASK-DRAFT approved` + `HG-AUDIT-R1 pending → ❌ 拒 30`，`VERIFY: BLOCKED`。**pending 机械拦 30 成立**（真值以 task 表为准）。
- §同类面快扫引用的行号**逐条命中**：`scan-human-gates-baseline.mts:105` · `check-terminology.mjs:29,41` · `check-claims.mjs:27,39` · `check-export-surface.mjs:49,73` · `check-doc-links.mjs:117`（git 读取）；`scripts/` 内以 FS 存在性充当可达性判据的**唯一真红面** = `check-doc-links.mjs:96`。

---

## 3. 常规核对结论

| 核对项 | 结论 |
|--------|------|
| **范围唯一性** | **成立**。唯一实质改点 = `scripts/check-doc-links.mjs`（(i) 判据 + tracked 读取 + 基线常量 + `S2_PARAM_EXCLUDE`）；配套 = test 三改 + `ACCEPTANCE` 三处标注 + 模拟 CI 留证。四项均指向同一缺陷面，无夹带。 |
| **非范围** | **成立且明确**：排除 `src/~/lib/~/bin/` 产品面、34 处冻结坏链追债、`.workbuddy~/`.gitignore~/`git add -f` 掩盖、tag 移动/重打、CI workflow/其他 check 脚本、`git tag/push/publish/deprecate`、历史留档 23。与 §根因红线 + F-HOT2-08 自洽。 |
| **验收 #1–#6 可执行性** | **全可执行且已钉真值**：#1 clone 真红→绿（本帽复现两端）、#2 双跑同值（本帽集合 IDENTICAL 复现）、#3 fixture 红→绿（本帽 pre/post 复现）、#4 `npm test` 858+N（基线复现）、#5 typecheck/pins（复现 0 错 / 17/17）、#6 task lint PASS（复现）。**注**：task 实为 **6 条**（审查指令称「5 条」，以 task 现值为准，无缺项）。 |
| **failure_paths** | **闭合**：F-HOT2-**00–08 全 9 条**均在表内定义，范围/验收/根因节引用无悬挂 id；#1↔F-HOT2-01、#2↔F-HOT2-02/04/05/07、#3↔F-HOT2-05/08、#4↔F-HOT2-06 映射可追。指令括注「F-HOT2-01..05」为子集，实际覆盖面更宽。 |
| **R0–R5** | **填全**：五槽 + 控制表齐（early_stop 全 no · 无 yes 缺 reason）；R0 证据给足（CI 双 run + 双跑 + 三组实验 + fixture 预演 + 基线）；R5 就绪声明成立。**唯一文案 stale** 见 advisory A4。 |
| **闸表可机检** | **成立**：verify 渲染 2 行（`HG-NEXT-PLAN/HG-SPEC-SIGNOFF=approved` · `blocks=—` 不渲染；`HG-AUDIT-R1=pending` · blocks 30 ❌）。 |
| **基线数字** | **全中**（见 §2.3；本地 23 / clone 34 / pins 17/17 / npm test 859-164-858-0-1 / typecheck 0）。 |

---

## 4. 三条重点（逐条裁定）

### 重点 1 —— 法定修法三件套是否被机检锁死：**成立**

- 三件分别有**failure_paths 定义 + 验收硬拦**：① 仓外 `existsSync` = F-HOT2-02；② 目录前缀 = F-HOT2-04（缺则非 S2(i) 0→**48**）；③ `-z`/`quotepath=false` 原样读取 = F-HOT2-05（缺则 0→**1**）。三者任一缺失都会使**验收 #2「非 S2(i)=0 且非 S2(ii)=0」**红，机检闭环成立。
- **字面单行式已显式列为反例**：task :69 对照表 + :200 R2「**不**采字面式最小改法（实测非 S2(i) 0→48 硬回归）」。本帽独立复现 48 / 1 / 0 三档，与 task 逐字一致。
- 结论：**缺一即拦**成立；30 复跑三组对照实验的**实质**已由验收 #2 真实仓回归面强制（见 advisory A3 的隔离 fixture 建议，属增强非阻断）。

### 重点 2 —— 环境无关 fixture（唯一硬证）：**成立**

- 临时 root `git init` + gitignore 但实体在的 `.workbuddy/x.md`：pre-fix `S2=0`（FS 存在性掩盖 · baseline 0 exit 0）；post-fix `S2=1`（baseline 1 exit 0 / baseline 0 exit 2）—— 本帽独立搭台复现，与 task :152 逐字一致。
- (ii) 既有 fixture 复绿分支：post-fix 无 `git add` → **转红 exit 2**；补 `git init + git add docs/roadmap/tracked.md` → **复绿 exit 0**。范围 2③ 的修改要求**正确且必需**。
- 设计成立：该 fixture 是「环境无关性」不可由真实仓替代的唯一硬证（真实仓本地恰有实体 · 无法构造缺失环境的稳定断言）。

### 重点 3 —— 边界与防自咬：**成立**

- **S2 只新增**：`w7_release_probe` grep **零引用 23 ⇒ 零改动**（ACCEPTANCE 只改三处数字 + 一行补注）；历史留档（done task / W7 invoke）列入非范围；无覆写来源文件。
- **禁掩盖式假绿**：F-HOT2-08 + 非范围明示「删 `.workbuddy` / `git add -f` / 改 `.gitignore` = 打回」，红线节重申「修环境无关，非环境相同」。
- **`S2_PARAM_EXCLUDE` 改本 task 路径 = 防自咬守卫**：现路径已因归档失效（本帽证实 active 缺 / done 在）；改为 in-flight 本 task 路径沿用 W7 参数化排除口径。**advisory A2**（排除面仅 task 路径，未覆盖审查文/invoke）。
- **tag 决策归 00**：F-HOT2-03 + 非范围「移动/重打/删除 tag」；本 task 零触碰。
- **git 不可诊断性只登记不裹挟**：§同类面快扫「残余低危候选」+ residual ②，明示「硬约束 10 尚差一步 · 建议升 W5/3.x · 本棒只登记」；不扩大本 task 范围。

---

## 5. 思考轮审查（阶段 C）

| 轮 | 书面审查 |
|----|----------|
| R0 证据 | 充分：CI 双 run 真值 + 本地/clone 双跑 + 三组对照实验 + fixture 预演 + 基线（859/858/0/1 · 0 错 · 17/17）；本帽独立复现**全中**。 |
| R1 范围 | 唯一改点 + 非范围清楚；无范围外夹带。 |
| R2 方案 | (i)/(ii) 同真值源 + 目录前缀 + `-z` + 基线重建 + 防自咬；明示不采字面式与掩盖式。 |
| R3 边界 | S2 只新增 / 不签闸 / 禁裹挟 / 标注级边界明确。 |
| R4 可测性 | 验收 6 条全机械 · 双跑同值为硬判据 · 红测先行面明示。 |
| R5 就绪 | 草稿可送签；**文案 stale** 见 A4（实质就绪不受影响）。 |

控制表：R0–R5 **全槽位 + 表齐**，early_stop 全 no 且无「yes 缺 reason」。
**充分性裁定：充分**（无证据空洞、无自相矛盾）。

---

## 6. 阻塞 / 非阻塞

### BLOCKING（0）

**零阻塞**。内容层无必须回填项；30 开工前置仅为流程闸（HG-AUDIT-R1 人签）。

### ADVISORY（6 · 非阻断 · 建议 30/00 顺手处理）

| id | 项 | 说明与建议 |
|----|----|------------|
| A1 | 验收 #1/#2 的 clone 语义 | `git clone .` 取 **HEAD（已提交态）**，非工作区。若 30 未 commit 即跑 #1，clone 仍是修前脚本 → 仍红。task 未写明「commit 后 clone」。**建议**：#1/#2 措施补一句「在修复提交后执行 `git clone .`」（或将工作区 `--root .` 与 clone 双跑分列）。 |
| A2 | 排除面仅覆盖 task 路径 | `S2_PARAM_EXCLUDE` 改为本 task 路径后，**审查文 / 30 invoke / 自检回填** 同为 S2 且将入库，若含坏链会使 S2>34 破基线（task :88 已述「过程件会持续增链」但排除面未覆盖它们）。**建议**：30 以**最终 commit 后的 clone 复跑**为准；若过程件增链则按 F-HOT2-01 重建基线并登记，或按需扩展排除清单（须留痕）。 |
| A3 | 两条回归面仅靠真实仓锁 | 目录链 48 / 非 ASCII 1 的回归锁定目前依赖 `ACCEPTANCE` 面的真实仓（验收 #2 非 S2(i)=0），无隔离 fixture；若未来仓内那 1 个非 ASCII 指南或目录链消失，锁失效。**建议**：可选补 1 条隔离 fixture（tracked 目录链 + 非 ASCII tracked 文件名）。 |
| A4 | R5 文案 stale（文档一致性） | :212/:223 仍写「**HG-TASK-DRAFT / HG-AUDIT-R1 双 pending**」，与头部 :3、闸表 :40~:41（`HG-TASK-DRAFT=approved` · 2026-09-17 00 代签）冲突；修订记录 :257 已登记翻转但正文未同步。**建议**：10-task/00 顺手校正文案（不阻断）。 |
| A5 | 行文小疵 | failure_paths 表 F-HOT2-04 行写作「**tagged-based**」，应为「**tracked-based**」；F-HOT2-06 仅在该表定义、验收 #4 以「范围 2③」间接引用（可读性）。 |
| A6 | 计数口径提示 | 审查指令称「验收 5 条 / F-HOT2-01..05」，task 现值为**验收 6 条（#1–#6）+ F-HOT2-00–08**。以 task 现值为真值审定，**无缺项**；提示后续引用统一口径。 |

---

## 结论（R1 总结论）

**总结论：PASS-with-issues —— 内容审查零阻塞（BLOCKING 0 · advisory 6）**。范围唯一、非范围清晰、验收 #1–#6 全可执行、failure_paths F-HOT2-00–08 闭合、R0–R5 填全且充分、闸表可机检。三条重点均裁定**成立**：① 法定修法三件套（仓外 `existsSync` / 目录前缀 / `-z` 原样读取）已被 failure_paths + 验收 #2 机检锁死，字面单行式显式列为反例（本帽独立复现 48/1/0 三档）；② 环境无关 fixture 设计成立（本帽复现 pre `S2=0` / post `S2=1`，(ii) 分支须 `git add` 否则转红）；③ 边界与防自咬成立（S2 只新增 · 禁掩盖 · 排除参数防自咬 · tag 归 00 · git 不可诊断性只登记）。

**流程闸**：HG-TASK-DRAFT = approved（00 代签）· **HG-AUDIT-R1 = pending**；本帽**不代签**。审查文即本文件（`docs/harness/reviews/task_3_0_w7_ci_hotfix_audit_R1_20260917.md`）。30 以 task 表为准，pending 时拒开工。

---

## 7. 维护者签闸（20 后 · 30 前）

- [ ] 已读本 R1 审查结论
- [ ] 在 task 人工闸表将 `HG-AUDIT-R1` 改为 `approved`（维护者 · 日期）
- [ ] commit task 文档或确认已签
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；`pending` 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 20-task-audit R1 审查完成落盘 · 总结论 PASS-with-issues（BLOCKING 0 · advisory 6）· 三条重点均成立 · 独立复跑（本地 23 假绿 / clone 34 真红 / 三组对照 48-1-0 / fixture pre0-post1 / npm test 859-164-858-0-1 / pins 17/17 / typecheck 0 / CI 双 run failure）· 本帽不代签 HG-AUDIT-R1 |
