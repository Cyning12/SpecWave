# Invoke：40（review-of-work 独立复核）· 3-0-w2-gates-in-hosts

| 字段 | 值 |
|------|-----|
| hat_id | 40 |
| task_slug | `3-0-w2-gates-in-hosts` |
| task_paths | `docs/tasks/active/task_3_0_w2_gates_in_hosts.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |
| 复核对象 | `2daaacd..638355f` 七 commit（bdd6e13 / 83cbda6 / 01b4a2e / 99893c1 / c7c663b / 638355f + 2daaacd docs）· HEAD = `638355f` · 工作树净 |

## 复核范围

独立实测复核（不接受「30 说绿」）：七命令独立复跑 · 验收 #1–#14 抽核 · pin-17 四禁实证 · 七 commit 逐笔粒度核对 · KPI/自检回填核对。禁区遵守：不改 src/test/SPEC/PLAN/task 文 · 不代签闸 · 不 push/tag（S2 只新增本 invoke 一件）。

## 独立实测证据（本棒亲跑 · 2026-09-16 · HEAD 638355f）

| 命令 | 实测结果 | 判定 |
|------|----------|------|
| `npm run typecheck` | **0 错**（exit 0） | PASS |
| `npm run build` | **0 错**（exit 0） | PASS |
| `npm test` | **726 tests / 140 suites / 725 pass / 0 fail / 1 skip**（duration ≈89.7s · 与预期逐字一致 · 零意外红） | PASS |
| `npm run test:lib` | **6/6 pass · 0 fail**（exit 0） | PASS |
| `node bin/specgate.js pins check` | **17/17 PASS**（pin-17 = 13 宿主校验 · 13 双语命中） | PASS |
| `node bin/specgate.js assets verify` | **110/110 PASS** | PASS |
| `node bin/specgate.js verify --target . --task …` | **VERIFY: PASS**（HG-TASK-DRAFT / HG-AUDIT-R1 双 approved · ✅ 可 30） | PASS |
| `node bin/specgate.js task lint --file …` | **LINT: PASS**（验收 #13） | PASS |

## 验收抽核要点

- **#1 e2e 双件在 tracked**：主文 `docs/harness/reviews/w2_gates_in_hosts_e2e_20260916.md`（c7c663b · claude 2.1.181 全链：版本串登记表 §2 含 OS/node/npm/git/claude/gemini/cursor-agent/spec-wave · 脏拒=PreToolUse 真实触发 exit 2 阻断且 commit 未落库 · 净放=commit 落库 · gemini/cursor 认证缺席 F-W2-07 诚实登记 1/2 STOP）+ 补件 `w2_gates_in_hosts_e2e_cursor_addon_20260916.md`（638355f · cursor-agent 2026.05.24-dda726e §D 全链：beforeShellExecution 真实触发 · 脏拒 exit 2=deny 语义锚定 · 净放 PASS · **#1 真实宿主 2/2 达标**）。A3（CLI 版本串登记）兑现。脚本 `scripts/e2e-w2-host-gates.mts` tracked 且不入 npm test 默认面（E3 口径守住）。
- **#2 verify 双向**：`w2-host-verify.test.ts` 抽跑 **10/10**（绿径 5：合规 PASS / --json 键集钉死 / 用户定制绿边界 #9 / v1 表兼容 / 粘性缺省；红径 5：四类红=篡改逐字落点·删除落点·篡改 JSON 产品 hook 条目·篡改 marker 产品块 + fail-closed chmod 000 按红点名 · 全 exit 2 点名落点）。
- **#3 合并铁律三面**：`w2-b5-merge.test.ts` 抽跑 **8/8**（铁律①正向增量 acme-bot 物化绿→篡改红·内置 13 零污染 · ②内置 id 冲突 exit 2 点名零写入 · ②b 用户间冲突后载者拒 · ③损坏表隔离点名 · 附 --file 整表替换 / 空 HOME 守卫 / F-W2-08 不可读点名）。
- **#5 acme 双路**：路②用户目录合并闭环在 w2-b5-merge 首条 · 路① --file 双路在该套件第 5 条（硬约束 12 闭环）· 主文 §E 同证。
- **#6 降级留痕**：`w2-hooks-materialize.test.ts` 抽跑 **12/12**，其中降级面 3 条：显式 none（dsh）apply human/--json 同键 degraded-none + **输出不含 L3 负向断言** · 外部 v1 未声明静默 · config-hook 宿主零 degraded 注记。
- **#8 恒等锁**：`w2-builtin-table-v2-identity.test.ts` 抽跑 **7/7**（resolved rows 恒等 deepEqual · hooks 逐点登记 10 显式 none≡v1 缺省+3 config-hook · command_sets ≡ 内建逐字 · planned writes 非 hook 落点逐字恒等 · hooks 物化面差异登记）。
- **#10 shell-hook temp 仓 e2e**：npm test 常驻面 `w2-shell-hook.test.ts` **5/5**（物化 marker+0755 幂等 · F-W2-11 既有 hook conflict 零覆写 · 非 git target 不创 .git · verify 篡改红 · **真实 git commit 脏拒/净放 e2e**）。
- **#11 catalog**：`w2-catalog.test.ts` 抽跑 **5/5**（sha256 符载/不符拒载点名 · 缺失 integrity:none · uncataloged 标注 · catalog 自身坏 fail-closed）。
- **#12 既有面零改动**：`git diff 2daaacd..HEAD --stat -- "test/host-adapt-*.test.ts"` = **空**（11 件零改动）。唯一被改既有测试 = `test/w1-schema-version-detect.test.ts`（7 行 · 仅 bdd6e13 一笔）——diff 逐字核对 = F-W2-13 授权翻转（「现行包内表仍为 v1」→「包内表为 v2」· probe kind v1→v2 · 注释登记恒等锁指针）· 无其他行为断言被触碰。
- **#14 粒度**：七 commit `git show --stat` 逐笔核对 —— 2daaacd 纯 docs 5 件 · bdd6e13 表+恒等锁+授权翻转 5 件 · 83cbda6 hooks 物化+verify+降级 12 件 · 01b4a2e B5 接入面 11 件 · 99893c1 shell-hook 6 件 · c7c663b/638355f 各 2 件 docs+script —— 各 commit 文件集与主题自洽 · 无裹挟域外档迹象 · 工作树净 · HEAD 无 tag。
- **pin-17 四禁实证**：表实读 —— `hosts:` 数组形态保持（`- host_id:` 行级 ×13：dsh/cursor/claude/agents/copilot/codex/windsurf/gemini/opencode/roo/zed/cline/aider · 13 id 零变更）· 表路径 `assets/ide/host-adapt/examples/mvp-hosts.yaml` 不变（pins check pin-17 行实测通过）· `schema_version: 2` + command_sets + defaults.surfaces.verify 落表首。

## 发现清单

**blocking：0**

**advisory：2**

- **A-40-1（待 30 close 前补 · 非打回）**：task 文「自检结论（执行者）」节未回填（`git diff 2daaacd..HEAD -- docs/tasks/active/task_3_0_w2_gates_in_hosts.md` = 空）——验收 #12 要求「登记项逐条列明于自检结论」· 30 close --yes 前须回填（F-W2-13 翻转登记 + 锁计数汇总 + 已知未测项）。KPI（00）节依规留 00 收官填。
- **A-40-2（信息登记）**：复核简报称「本地 ahead 6 待推」· 实测 `origin/main = c7c663b` · 仅 638355f 一笔 ahead（六笔已在远端 · push 属维护者动作 · 不违「30 不 push」禁区）。另注：`2daaacd..HEAD` 区间含并行链 e7e868b（W1 CI hotfix 另 task · scan-human-gates-baseline.test.ts +118 归其 · 已从 W2 既有面零改动判定中剔除）。

## 结论

**PASS-with-issues**（blocking 0 · advisory 2）—— 14 条验收抽核全绿 · 七命令独立复跑计数与预期逐字一致 · pin-17 四禁守住 · 既有面零改动（唯一授权翻转合规登记）· e2e 双件证据真实完整（版本串/脏拒/净放链齐 · F-W2-07 诚实纪律全程守住）。A-40-1 为 close 前置待补项 · 不构成打回。

## 下一棒

**30 close --yes**：① 回填 task 文「自检结论（执行者）」节（A-40-1 · 验收 #12 登记义务）→ ② `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w2_gates_in_hosts.md`（exit 0）→ ③ `task close --yes` 闭环 → 00 收官（KPI 回填 · 归档 done/）。push 仅人。

## 禁区遵守

- 未改 src / test / SPEC / PLAN / task 文 / reviews 既有档（S2 只新增本 invoke 一件 · 单文件显式 add）
- 未代签任何闸 · 未执行 push / tag / publish / deprecate

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 40 独立复核落档：七命令复跑全绿 · 验收 #1–#14 抽核 · blocking 0 / advisory 2 · PASS-with-issues |
