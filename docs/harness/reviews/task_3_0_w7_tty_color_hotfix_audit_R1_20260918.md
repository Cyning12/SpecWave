# Task Audit R1：3-0-w7-tty-color-hotfix

> **审查帽**：20-task-audit · **轮次**：R1 · **日期**：2026-09-18  
> **审查对象**：`docs/tasks/active/task_3_0_w7_tty_color_hotfix.md`（3.0 W7 TTY 色彩确定性 hotfix · **HG-TASK-DRAFT = approved（00 代签）** · **HG-AUDIT-R1 = pending**）  
> **审查方式**：书面审查 + 独立复跑（**零改 task 实质 / 不代签任何闸 / 未改 test/src**）  
> **依据**：PLAN_3_0 硬约束 **6**（修严型配负向锁）/ **10**（环境依赖必须可诊断）· 同族先例 `docs/tasks/done/task_3_0_w7_ci_hotfix.md`（结构模板）

---

## 1. 元信息与工作区实态

| 字段 | 实测值 |
|------|--------|
| task_slug | `3-0-w7-tty-color-hotfix` |
| 工作区 | `/Users/cyning/Desktop/Projects/dsh-coding-kit` · Open Folder = 仓根 |
| git HEAD | `fad0637cff09eadd8551ac7a40460a74551dff2e`（`fad0637`）✅ 与 task 基线一致 |
| 工作区 | clean + `?? docs/tasks/active/`（唯一 untracked = 本 task 起草件 · 与基线「+1 untracked」一致） |
| Node / npm | `v24.15.0` / `11.12.1`（满足 `^22.19.0 或 >=24.0.0`） |
| agent shell env | `TERM=dumb` · `NO_COLOR=1` · `FORCE_COLOR` unset ⇒ 与 task「agent shell 非 TTY 全绿」成因吻合 |
| tag `v3.0.0` | 在（pins pin-10 现绿 · 17/17） |
| `docs/coding_wiki/` | **不存在**（task `wiki_delta_note` 实证正确） |
| `docs/_tech_graph/` | 未触碰（task `graph_delta=none`） |

---

## 2. 独立复跑证据（本帽实测 · 未采信 task 转述）

### 2.1 三态影响面（全量复现 · 本帽实测）

| 状态 | 命令 | 实测 | 判定 |
|------|------|------|------|
| 普通 | `npm test` | **860 tests / 164 suites / 859 pass / 0 fail / 1 skip** · exit 0（62.2s） | ✅ 与 task 基线 :116 逐字一致 |
| 合成 `FORCE_COLOR=1`（agent shell 带 `NO_COLOR=1`） | `FORCE_COLOR=1 npm test` | **860 / 164 / 857 pass / 2 fail / 1 skip** · exit 1 | ✅ 与 task 基线 :117 逐字一致 |
| 真 TTY（pty） | `env -u NO_COLOR TERM=xterm-256color script -q /dev/null npm test` | **860 / 164 / 858 pass / 1 fail / 1 skip** · exit 1 · 唯一红 = `scan-human-gates-baseline.test.ts:52` | ✅ 与 task 基线 :118「1 fail = scan」一致（**本帽补足全量 pty 复跑 · task 仅列单测**） |

`FORCE_COLOR=1` 两条红面逐字（ANSI 还原后）：

~~~text
test at test/cli-discipline-coverage.test.ts:81:3
✖ ③ discipline show --json exit 0 · statements 计数与 yaml 一致 · 含口径注记
  SyntaxError: Unexpected non-whitespace character after JSON at position 17681 (line 444 column 1)
      at JSON.parse ... test/cli-discipline-coverage.test.ts:85:25

test at test/scan-human-gates-baseline.test.ts:52:3
✖ 双目录均缺失（无 active/ 且无 done/）…
  AssertionError [ERR_ASSERTION]: 缺失目录应按零文件处理:
  文件数: \u001b[33m0\u001b[39m · 含闸节文件: \u001b[33m0\u001b[39m
      at ... test/scan-human-gates-baseline.test.ts:64:14
~~~

定向两测：`FORCE_COLOR=1` = **8 tests / 6 pass / 2 fail**；`FORCE_COLOR=0` = **8 / 8 pass / 0 fail**（task :169 口径成立）。pty 单测 = 3 / 2 pass / 1 fail。

### 2.2 机制 A / B 独立复现

**机制 A（数字实参着色）——成立**：

~~~text
$ FORCE_COLOR=1 node -e "console.log('文件数:', 0)" | od -c
文 件 数 :  033 [ 3 3 m 0 033 [ 3 9 m \n        ← 数字实参经 util.inspect 注色
$ FORCE_COLOR=1 node -e "console.log('文件数:', String(0))"   → 文件数: 0（string 实参零注色）
~~~

**注入源 = `node --test`（非 npm）——成立**（`/tmp` 探针 · 仓内零改动）：

| 场景 | `PROBE_FORCE_COLOR` |
|------|----------------------|
| pty + `TERM=xterm-256color` + `NO_COLOR` unset | **`"1"`** |
| 管道 + `TERM=xterm-256color` | `undefined` |
| pty + `TERM=dumb` | `undefined` |

**机制 B（stderr 警告污染 JSON.parse）——成立**：

| 环境 | stderr |
|------|--------|
| `FORCE_COLOR=1 NO_COLOR=1` | `Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.` |
| `FORCE_COLOR=0 NO_COLOR=1` | **空**（警告仅在 `FORCE_COLOR` 为真值 1/2/3 时触发） |
| `NO_COLOR=1` / `FORCE_COLOR=1` 单独 | 空 / 空 |

子进程 `src/cli.ts discipline show --json` 在 `FORCE_COLOR=1 NO_COLOR=1` 下：stdout 为完整 JSON（exit 0），stderr = 警告；`JSON.parse(stdout)` OK，`JSON.parse(stdout+'\n'+stderr)` 失败于 `position = 17681`（= stdout 长度 + 1）。与 task :57 逐字吻合。

### 2.3 `plainEnv()` 取值矩阵（重点 3 的判据 · 本帽实测）

对 spawn 子进程 `console.log('文件数:', 0)` 检 ANSI / 互斥警告：

| env 构造 | ambient `FORCE_COLOR=1,NO_COLOR=1` | ambient `FORCE_COLOR=1` only |
|----------|-------------------------------------|-------------------------------|
| 不钉（继承 ambient） | ANSI=true · WARN=true | ANSI=true · WARN=false |
| 候选 (a) `{...env, FORCE_COLOR:'0'}` | **false / false** | **false / false** |
| 候选 (b) 字面 `{...env, NO_COLOR:'1'}`（不删 ambient FC） | **ANSI=true · WARN=true（契约不达标）** | **ANSI=true · WARN=true** |
| 候选 (b2) `{...env, NO_COLOR:'1'}` + `delete env.FORCE_COLOR` | false / false | false / false |
| 组合 `{...env, FORCE_COLOR:'0', NO_COLOR:'1'}` | **false / false** | **false / false** |

⇒ 候选 (a)、候选 (b2)、组合三者均满足「无色 ∧ 零互斥警告」；**字面候选 (b) 不满足**。pty 双态复跑：ambient 无 FC/NC 时 pty 输出有 ANSI；`FORCE_COLOR=0` 或组合下 pty 输出零 ANSI。

### 2.4 结构闸与其余基线

| 项 | 实测 |
|----|------|
| `npx spec-wave task lint --file docs/tasks/active/task_3_0_w7_tty_color_hotfix.md` | **LINT: PASS** · exit 0 |
| `npx spec-wave verify --target . --task …` | HG-TASK-DRAFT approved（不拦）· **HG-AUDIT-R1 pending ⇒ 拒 30 · VERIFY: BLOCKED** · exit 2 |
| `node bin/specgate.js pins check` | **17/17 PASS** · exit 0 |
| `npm run typecheck` | **0 错** · exit 0 |
| 同族 grep `env: { ...process.env }` in `test/` | **37 命中 / 32 文件** ✅ 与 task :190 一致（**但 :194 写「35 处」· 见 A2**） |
| 引用行号快扫 | `scan-human-gates-baseline.mts:195` ✓ · `cli-lifecycle.ts:374`/`cli-graph.ts:312`/`cli-task-extra.ts:400,455`/`cli/verify.ts:103` 均为 **string 实参模板串** ✓ · `w6-lint-escape-rate.mjs:37,108` 为数字实参但 `test/` **零引用** ✓ |

---

## 3. 常规核对结论

| 核对项 | 结论 |
|--------|------|
| **范围唯一性** | **成立**。唯一实质改点 = 测试侧三件：新 helper `test/_helpers/plain-env.ts`（`test/*.test.ts` glob 不收集 ⇒ 不污染套件）+ 两处 spawn 改 `plainEnv()`（`runScanner` :42-49 / `runCli` :41-45）+ 回归锁 `test/plain-env.test.ts`。与红线节自洽。 |
| **非范围** | **成立且明确**：不改 `src/`/`scripts/` 产品输出 · 不改 `package.json` test/prepublishOnly · 不改 CI workflow · 不放宽断言 · 不 tag/push/publish/deprecate · 不动历史留档。 |
| **验收 #1–#6 可执行性** | **基本可执行**：#2/#4/#5/#6 已本帽复现；#3 设计闭环（红测先行）；**#1 数字口径缺 +N（A1）**；**#3 契约锁与修法节冲突（B1 · 阻断）**。 |
| **failure_paths** | **闭合**：F-TC-00–04 五 id 全定义，另 3 行（双环境基线 / 产品越改 / 越权）= 8 行；验收/非范围引用无悬挂 id。 |
| **R0–R5** | **填全**：五槽 + 控制表齐 · `early_stop` 全 no 且无「yes 缺 reason」；R0 证据给足且本帽独立复现全中。 |
| **闸表可机检** | **成立**：verify 渲染 HG-TASK-DRAFT approved + HG-AUDIT-R1 pending → 拒 30。 |
| **基线数字** | **全中**（普通 860/164/859/0/1 · FORCE_COLOR=1 860/857/2/1 · pty 1 fail · pins 17/17 · typecheck 0）。 |

---

## 4. 三条重点（逐条裁定）

### 重点 1 —— 双机制 A/B 分列是否准确：**成立**

- A 与 B **独立复现**，且**因果链可分离**：A 只需 `FORCE_COLOR=1`（纯 TTY 态红 1 测 · 不依赖 `NO_COLOR`）；B 需 `FORCE_COLOR=1 ∧ NO_COLOR=1`（警告只在 FC 为真值时触发；`FORCE_COLOR=0` 不触发）。task :57/:59-62 的三态归因与实测**逐条吻合**。
- 注入源「`node --test` 在 `stdout.isTTY && TERM≠dumb` 下注入 `FORCE_COLOR=1` · 非 npm」经本帽探针实证（`PROBE_FORCE_COLOR="1"` vs 管道/dumb `undefined`）。
- A 的着色载体精确：**数字实参**（`label: <number>`）经 `util.inspect` 注色，string 实参不注色 —— 这解释了同族大量「模板串 `console.log`」免疫。裁定 **成立 · 无需修正**。

### 重点 2 —— 三态影响面口径是否接受：**接受**（无需收敛为单一口径；TTY 探针已具备）

- 三态（普通 0 fail / `FORCE_COLOR=1` 2 fail / 真 TTY 1 fail）本帽**全量复跑全中**；`FORCE_COLOR=1` 是「A+B 合成超集」，真 TTY 是「仅 A」的实际用户态。
- **TTY 探针已在验收 #4 保留**（`env -u NO_COLOR TERM=xterm-256color script -q /dev/null …`），且本帽已验证 macOS BSD `script` 语法可用。因此**不要求**再补探针或收敛单一口径。
- 唯一需明示的口径前提：`FORCE_COLOR=1 npm test = 2 fail` **以 ambient `NO_COLOR=1` 为条件**（agent shell 常态）；无 `NO_COLOR` 的机器上该命令只复现 1 fail。task :57/:61 已注明「agent shell 亦带 NO_COLOR=1」，**口径可接受**（A5 建议在验收 #1 再点明）。

### 重点 3 —— `plainEnv` 契约与回归锁设计：**不充分 · 需回填（B1 阻断）**

- **契约内部自相矛盾**：修法节 :82 代码片段返回**候选 (a)**（`{...process.env, FORCE_COLOR:'0'}`，无 `NO_COLOR`），:89 明示「候选 (a)/(b) **二选一** · 30 实测两态后**定稿并回填**」；而范围 #1 :127、验收 #3 契约锁 :97、R2 :219 **硬编码组合** `FORCE_COLOR:'0' + NO_COLOR:'1'`。
  - 若 30 依「**默认**候选 (a)」（:81 字面标注默认）实现，则契约锁 :97 断言 `NO_COLOR==='1'` **必红** ⇒ 30 无法同时满足两条任务指令。**这是可执行性硬缺陷，非文案瑕疵。**
- **字面候选 (b) 事实不成立**：:89 称「候选 (a)/(b) 均零 ANSI + 零警告」，但 `{...process.env, NO_COLOR:'1'}` 在 `node --test` 注入 `FORCE_COLOR=1` 的真实 ambient 下 **ANSI=true · WARN=true**（见 §2.3）。候选 (b) 须显式 `delete env.FORCE_COLOR` 才达标（b2）。task 未写明此删除 ⇒ 按字面实现会复现机制 B。
- **回归锁其余设计充分**：现象锁（显式 `FORCE_COLOR:'1'` + `delete NO_COLOR`）在 TTY/非 TTY 双态**确定性可红/绿**（FC=1 管道也注色）；修复锁直接断言 `plainEnv()` 输出**零 ANSI**（不靠 stripAnsi 才过）符合 F-TC-02；`stripAnsi` 仅断言；pty 复跑保留。
- **同族 37 处 spawn 面判定可接受**：全量 `FORCE_COLOR=1`（2 红）与全量 pty（1 红）**双向实测兜底**，证明无额外真红面；`runScanner`（隐式继承）与 `runCli`（显式展开）两处确为仅有的真红。免疫证据（模板串/JSON/exit 码 + core-harness `a.map(String)` 进程内捕获）与引用行号**逐条属实**。
- **修法建议（B1 二择一）**：**推荐 Option 1（改动最小 · 与现有范围/验收/R2 自洽）**——把 `plainEnv()` **单值钉死**为组合 `{ ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }`；删去 :80-89 的「候选 (a)/(b) 二选一 · 30 定稿回填」措辞，让 :82 片段返回组合；契约锁 :97 保持。**Option 2**：钉候选 (a) `FORCE_COLOR:'0'`（`NO_COLOR` 不设），同步改 :127、:97、:219 只断言 `FORCE_COLOR==='0'`。二者均须**单一取值**，禁止「30 定稿」形态。

---

## 5. 思考轮审查（阶段 C）

| 轮 | 书面审查 |
|----|----------|
| R0 证据 | **充分**：三态基线 + 机制 A/B 双复现 + pty 注入探针 + plainEnv 组合实测 + pins/tag；本帽独立复现**全中**（并补全量 pty：1 fail）。 |
| R1 范围 | 唯一测试侧三件 · 非范围清楚；无范围外夹带。 |
| R2 方案 | spawn 边界钉 env + stripAnsi 仅断言 + 双面回归锁 · 否四类掩盖式；**但「二择一 30 定稿」与契约锁冲突（B1）**。 |
| R3 边界 | 只改 `test/` · 禁裹挟 · 不签闸 · 发布四动作零触碰。 |
| R4 可测性 | 验收 6 条基本机械 · 双环境同绿硬判据 · 红测先行面明示；**#1 数字缺 +N（A1）**、**#3 取值冲突（B1）**。 |
| R5 就绪 | 五槽齐 · HG-TASK-DRAFT approved · HG-AUDIT-R1 pending；**因 B1 尚不可送签 · 须先回填**。 |

控制表 R0–R5 全槽位 + 表齐 · `early_stop` 全 no。
**充分性裁定：不充分**（B1 自相矛盾 · 须回填后重审）。

---

## 6. 阻塞 / 非阻塞

### BLOCKING（1 · 内容层 · 退回 10-task）

| id | 项 | 回填要求（10-task） |
|----|----|---------------------|
| **B1** | `plainEnv()` **取值契约自相矛盾**：「候选 (a)/(b) 二选一 · 30 定稿回填」（:81/:89/:82 片段）与范围 #1 :127 / 契约锁 :97 / R2 :219 的硬编码组合冲突；且字面候选 (b) 在 ambient `FORCE_COLOR=1` 下不达「零 ANSI ∧ 零警告」（须 `delete FORCE_COLOR`）。**默认候选 (a)** 会让契约锁必红，30 无解。 | 钉**单一取值**（推荐组合 `{...process.env, FORCE_COLOR:'0', NO_COLOR:'1'}`）；删「二择一/30 定稿回填」措辞；令 :82 代码片段与 :127/:97/:219 一致；如保留 (b) 须写明 `delete env.FORCE_COLOR`。改后重跑 task lint 并交 **20 R2 复审**。 |

### ADVISORY（5 · 非阻断 · 建议随 B1 一并修正）

| id | 项 | 说明与建议 |
|----|----|------------|
| A1 | 验收 #1 数字口径缺 +N | #1（唯一放行条件）硬编码 `860 tests / 859 pass`，但范围 #4 新增锁测 ⇒ 修后应为 `860+N / 859+N pass / 0 fail`（#2 :167 已用 +N 口径）。建议 #1 同步用 +N，并补 suite 数 +1（新测试文件新增 1 suite）。 |
| A2 | 同族计数不一致 | :190 写「37 命中 / 32 文件」（本帽复核正确），:194 却写「32 文件 **35 处**」。按「37 − 真红 B 1」应为 **36 处 / 31 文件**。建议统一为「37 命中 / 32 文件 · 其中真红 1 处」。 |
| A3 | 范围 #2 grep 命令缺 -r | :92 `grep -n "env: { ...process.env }" test/` 实测报 `test/: Is a directory`；应统一为 :129 的 `grep -rn`。 |
| A4 | 非范围表重复词 | :141 行重复 `npm deprecate`（:105 单次）；建议删一。 |
| A5 | 文案/行号精度 | 契约锁「与父 `process.env` 无关」不精确（`plainEnv()` 展开 `process.env`，仅返回字段被钉死）；`core-harness.ts` 引作 :45-59 而 `withCaptured` 起于 :39；建议在验收 #1 再点明「2 fail 复现以 ambient `NO_COLOR=1` 为条件」。 |

---

## 结论（R1 · 机读）

~~~yaml
verdict: BLOCKED            # 内容审查未通过
blocking_count: 1           # B1
advisory_count: 5           # A1..A5
next_hat: 10-task           # 退回 10-task 回填 B1 · 禁止附 30 Prompt
reaudit_required: 20-task-audit-R2
focus_1_mechanism_AB: PASS
focus_2_three_state_scope: PASS
focus_3_plainenv_contract: FAIL   # B1
baseline_normal: {tests: 860, suites: 164, pass: 859, fail: 0, skip: 1}
baseline_force_color_1: {tests: 860, suites: 164, pass: 857, fail: 2, skip: 1}
baseline_pty_full: {tests: 860, suites: 164, pass: 858, fail: 1, skip: 1}
pins: "17/17 PASS"
typecheck: "0 error"
task_lint: PASS
gate_HG_TASK_DRAFT: approved
gate_HG_AUDIT_R1: pending    # 本帽不代签
~~~

**总结论：BLOCKED —— 内容阻塞 1（B1 · plainEnv() 取值契约自相矛盾 + 字面候选 (b) 不达零警告）· advisory 5**。  
范围唯一、非范围清晰、failure_paths 闭合、R0–R5 填全、闸表可机检、**基线数字全中**；双机制 A/B 分列**准确**（重点 1 成立）、三态口径**接受**（重点 2 成立）、plainEnv 契约**不充分**（重点 3 阻断）。因 B1，本轮**退回 10-task 回填**，回填后交 20 R2 复审。

---

## 7. 回填清单（退回 10-task）

| # | task 小节标题 | 回填点 |
|---|---------------|--------|
| B1 | 「根因与修法（给 30 的执行口径）」+「范围」+「验收标准」 | 钉 `plainEnv()` 单一取值（推荐组合 `FORCE_COLOR:'0', NO_COLOR:'1'`）；令 :82 片段 = :127 = :97 = :219；删「候选 (a)/(b) 二选一 · 30 定稿回填」；如保留 (b) 写明 `delete env.FORCE_COLOR` |
| A1 | 「验收标准」#1 | `860+N tests / 859+N pass / 0 fail`；补 suite 数 +1 |
| A2 | 「同类面快扫登记」 | 统一 37/32 口径 · 修正「35 处」 |
| A3 | 「范围」#2 | grep -n → grep -rn |
| A4 | 「非范围」 | 删重复 npm deprecate |
| A5 | 「验收标准」/「必读列表」 | 措辞与行号精度（可选） |

---

## 8. 维护者签闸（本轮不可签）

- [ ] 已读本 R1 审查结论（**BLOCKED · B1**）
- [ ] **本轮不签 HG-AUDIT-R1**：B1 未回填、无 R2 复审 ⇒ 闸维持 pending
- [ ] 先交 10-task 回填 B1（+ A1–A5）→ task lint PASS → 20 R2 复审
- [ ] R2 通过后再签 HG-AUDIT-R1 = approved（维护者 · 日期），方可下发 30 Prompt

30 Agent 以 task 表为准；HG-AUDIT-R1 = pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 20-task-audit R1 审查完成落盘 · 总结论 **BLOCKED**（BLOCKING 1 B1 · advisory 5）· 三重点：A/B 分列成立 · 三态口径接受 · plainEnv 契约不充分（阻断）· 独立复跑全中（普通 860/164/859/0/1 · FORCE_COLOR=1 860/857/2/1 · 全量 pty 860/858/1 · pins 17/17 · typecheck 0 · task lint PASS · verify BLOCKED）· 本帽不代签 HG-AUDIT-R1 |
