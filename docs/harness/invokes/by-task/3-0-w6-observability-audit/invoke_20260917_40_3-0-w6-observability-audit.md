# Invoke：40（review-of-work）· 3-0-w6-observability-audit

| 字段 | 值 |
|------|-----|
| hat_id | 40-review-of-work |
| task_slug | `3-0-w6-observability-audit` |
| task_paths | `docs/tasks/active/task_3_0_w6_observability_audit.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |
| 复核对象 | `6e46396..e894f64`（HEAD）五 commit（前一次 40 棒中断未落盘 · 本棒重做） |

## 复核范围与方式

独立复核 30 三阶段交付（C6 结构化审计落盘 · F4 discipline check · G2 回归锁 · G4 failClosed · N2-C lint 入链 · G7 warn-only · coverage 回写）。**不接受「30 说绿」**：平台锁全部独立复跑 + 验收 #1/#3/#4/#5/#8/#9 重点项 **40 本棒自造 fixture 经真实 CLI 重放**（temp target 自造自清 · 42 项断言 · 不复用 30 fixture）+ N2-C 逃逸率脚本同脚本同语料独立复跑 + lint 语料逐文件独立枚举 + diff/git/tag 机检逐条自跑。探针临件全落 /tmp（工作树净复核在案）。

## 独立实测证据（40 本棒自跑）

### 平台锁复跑

| 项 | 实测 | 预期 | 判 |
|----|------|------|----|
| `npm run typecheck` | 0 错（exit 0） | 0 错 | ✓ |
| `npm run build` | exit 0 | 0 错 | ✓ |
| `npm test` | **841 tests / 160 suites / 840 pass / 0 fail / 1 skip** | 841/160/840/0/1 | ✓ 逐字 |
| `npm run test:lib` | **6/6 pass**（exit 0） | 6/6 | ✓ |
| `node bin/specgate.js pins check` | **17/17 PASS** | 17/17 | ✓ |
| `node bin/specgate.js assets verify` | **111/111 PASS** | 111/111 | ✓ |
| `verify --target . --task <本 task>` | **VERIFY: PASS**（exit 0 · 双闸 approved 落表） | PASS | ✓ |
| `discipline check` | **10/10 pass · fail 0 · unreachable 0**（declared vs verified 双列） | 10/10 | ✓ |
| `gate-check --task <本 task>` | exit 0 · 未发现阻塞 | exit 0 | ✓ |

### 验收抽核（40 独立构造重放 · 真实 CLI · pass=42 fail=0）

- **#1 C6 schema + append-only**：`audit` pending-gate fixture → exit 2 · `audit.jsonl` 落盘 · `Object.keys` 逐键快照 = `schema_version,ts,event,verdict,exit_code,task,gates,detail,duration_ms` · schema_version=1 · event=audit · verdict=FAIL · exit_code=2 · ts ISO-8601 UTC · gates[] 非空 · **零绝对路径泄漏** · 二次运行行数=2 且**首行逐字不变**。
- **#4 S2 三域拒写**：`--audit-file` 分别指 `docs/tasks/`、`docs/harness/reviews/`、`docs/harness/invokes/by-task/` → 三域各自 **exit 2 · 点名 F-W6-02「无豁免参数」· 目标路径零落盘**；仓外 `../outside.jsonl` → exit 1（F-W6-07）。
- **#3 G4 双向**：active 有思考轮节缺控制表 → **exit 2 · `VERIFY: BLOCKED · 思考轮控制表缺口（缺 控制表`**；done 同形 → **exit 0 PASS + `verify: warn · 思考轮控制表缺口`，不挡不追溯**。
- **#5 N2-C lint 入链**：active 缺验收标准（E3）→ exit 2·点名 `[E3]`；`--allow-lint-fail` → exit 0 PASS + 豁免留痕；done lint-FAIL → exit 0 PASS + warn。
- **#8 G7 warn-only**：负向（自检结论声称 verify 而审计轨无事件）→ **close exit 0 READY + `close: warn · close_exec_evidence` 不挡**；正向（先真跑 verify 落轨）→ close 无 warn；诚实边界（未声称 verify）不查不 warn。
- **G2 回归锁**：缺 R<n> 审查文 → verify exit 2 点名 + close `close_review` BLOCKED。
- **F-W6-01 降级**：落点目录被同名文件占据 → PASS exit 0 零变更 + stderr 降级 warn + 降级面零落盘。

- **#5 逃逸率独立复跑**（`node scripts/w6-lint-escape-rate.mjs`）：**语料 81 件 · lint FAIL 27 件（33.3%）· 前基线逃逸 100%（27/27）→ 后测穿透率 0.0%**（active 投影 27/27 被 lint 步 `VERIFY: BLOCKED · task lint FAIL` 点名 · 上游闸先拦 0 · 穿透 exit 0 = 0）· done 原位 **79 件零新增 lint/G4 BLOCKED** · done warn 降级 **29 件逐条枚举**。脚本 exit 0。
- **lint 语料逐文件独立枚举**（40 直调 `lintTaskFile` · 不复用脚本）：**81 件 · FAIL 27 · active 0 / done 27** · 规则分布 **E3×21 · E5×16 · E4×9 · E2×2 · E6×1** —— 文件数与「27 件」一致；规则分布与 R1 审独立复测逐字一致（task 开工基线节各 +1 · 即 R1 advisory A1 · 见发现清单）。
- **#9 coverage 终态**：`discipline show` status 计数 = **mechanical 14 · partial 8 · prompt-only 8 · not_wired 0**；gaps **closed 11 · deferred 2**；40 读 yaml 逐条点数与 show **机检一致**（A1/A6/A7/A8/A9/B3/C1/C2/D1/D2/D3/D4/SK1/SK2=14 mechanical · A2/A3/A4/A5/B1/B2/E2/F1=8 partial · A10/B4/B5/C3/C4/E1/F2/F3=8 prompt-only）· C1/C2/D3 已 mechanical · A5/B2 partial（G7 warn-only 档 · 不虚标）· N2-C gap closed · G7 gap 保持 deferred（不回写 closed）· G6 未动。
- **done 不追溯硬条**：影子仓脚本 done 原位 **79/79 零意外 lint/G4 BLOCKED**（覆盖 ≥10 件抽样判据）· 29 件 warn 降级逐条在案 · 存量 27 件 lint-FAIL 全在 done 面（active 面 0 件）。

### F-W6-02 与 gitignore 分工（复核点 4）

- `.gitignore` 新增一行 `docs/harness/audit/*.jsonl` + A3 注释（「本行只覆盖本仓 · 消费仓须自查」）—— 40 实读在案。
- 默认落点 `docs/harness/audit/audit.jsonl` 对 `S2_TRUTH_PREFIXES`（`docs/tasks` · `docs/harness/reviews` · `docs/harness/invokes/by-task` + legacy 裸前缀）逐前缀否定（#10 测试 + 40 实跑 S2 三域拒写）。
- 分工成立性：审计流 = 观测面（gitignore 防脏 · 非证据面）· 证据面 = invoke/自检结论摘录（tracked · 硬约束 14）。F-W6-02 拒写走 `assertNotS2Abs` 单一真值源（`src/cli-shared.ts:90-135`）· 无第二真值源 · 无豁免参数。

### 既有面零改动（复核点 5 · F-W2-13 同式）

- `git diff 6e46396..HEAD --stat -- test/`：**新增 4 件**（w6-audit-log / w6-discipline-check / w6-g2-g4-gates / w6-n2c-g7）+ **既有修改恰 8 件**（cli-flags / cli-p0 / cli-security-closure / cli-verify-invoke-hats / cli-verify-observability / cli-verify-review / cli-verify-with-wiki-lint / cli-w4-gate-wiring）· 逐文件 diff 实读 = 仅 `wiki_delta: none`（E8 lint-clean）+ cli-flags `--allow-lint-fail` 移出 `VERIFY_REJECTED` · **零意外**。
- `package.json` / `package-lock.json` diff 空（依赖零新增 · dependencies 仍仅 js-yaml）。`assets/sha256.manifest` 随 yaml rebuild（assets verify 111/111）。

### commit 卫生（复核点 6）

五 commit 逐笔 `show --stat`：`6e46396`（docs task+R1 审查文+invoke 三件套 · 5 文件）· `cd65eb9`（C6+F4 · 12 文件）· `fde1fe6`（G2+G4 · 8 文件）· `c034157`（N2-C+G7+coverage · 18 文件）· `e894f64`（自检回填+invoke_30 · 2 文件）—— scope 与提交信息一致 · 无 `git add -A` 裹挟面。工作树净（`git status --porcelain` 空）· `main ahead 5 未 push` · `git tag --points-at HEAD` 空（无新 tag）· 发布四动作零触碰。

## 收官备料核对（复核点 7）

自检结论回填完整：GATE_VERIFY 三跑记录 · 三阶段锁计数 810→825→835→841 纯加性（40 终态复跑逐字一致 · stage 增量 +15/+10/+7−1 自洽）· 验收 #1–#13 逐项 · **逃逸率硬数字**（100%→0.0% · 前 27/27 · 后 0 件穿透）· **存量枚举口径**（done warn 29 件 · 27 lint-FAIL 全 done · 9 件 legacy 3 列上游先拦归因 · 投影中性化设计）· **偏差登记 11 条**全留痕 · **KPI 备料**（810→841 +31 · 新增文件 src×2+test×3+scripts×1 · 回写 statements 5+gaps 2 · 待 00 裁定）· `### KPI（00）` 待填节在案。

## 发现清单

- **blocking：0**
- **advisory：3**
  - **A1（承 R1 · 40 独立复测确认）**：task 开工基线节 lint 规则分布 `E3×22/E5×17/E4×10/E2×3/E6×1` 较 40 独立复测（`E3×21/E5×16/E4×9/E2×2/E6×1`）各 +1；FAIL 文件数 27 与逐文件集合一致 · 30 自检结论已按「advisory A1 口径 / 分母时点差」披露并采用 27/81（33.3%）· 非交付缺陷。
  - **A2（40 新增 · 文案计数）**：task 自检结论 #12 行写「既有 fixture 补 wiki_delta **六文件**」，其括号枚举实为 8 件且 `git diff` 实证 8 件 —— 计数口径笔误 · 机械面正确 · 建议 00/下一棒顺手订正。
  - **A3（40 观察 · 留痕）**：coverage yaml 未触及 statements（A2/A3/A4/C3/D1/D2/D4/E2/G1/G2/G3/G4）机制锚点仍为 W0 前 `src/cli.ts#xxx` 旧址。与 task 非范围「只回写本波触及条目 · 禁全量重盘」一致，但 S6.7「明显失效锚点」清扫按窄口径解释（= 本波触及条目）。非交付缺陷 · 建议归后续波次/00 裁定。
- 观察注记（非发现 · 方法学留痕）：逃逸率「active 投影面 27/27 lint 步点名」为影子仓投影（中性化 legacy 3 列闸表 + T4/T5 闸）结果 · in-place done 面只核对无 lint/G4 新增 BLOCKED —— 30 自检已如实披露该投影设计，故不另计发现。

## 结论

**PASS-with-issues**（blocking 0 · advisory 3）—— 平台锁独立复跑全绿且计数逐字一致（841/160/840/0/1 · typecheck 0 · build 0 · test:lib 6/6 · pins 17/17 · assets 111/111 · verify PASS · discipline check 10/10 · gate-check 0）；验收 #1/#3/#4/#5/#8/#9 重点项经 40 独立构造 fixture + 真实 CLI 重放 42/42 属实；逃逸率同脚本同语料独立复跑 **100%→0.0%**、前 27 件与独立枚举一致；coverage 终态 **not_wired=0 · 14/8/8** 与 yaml 机检一致；done 79/79 零意外 BLOCKED（不追溯硬条达成）；S2 拒写三域 + gitignore 观测面/证据面分工成立；既有面零意外 · commit 卫生与未 push/tag 复核在案；收官备料足够 00 填 KPI 节。三条 advisory 均非阻塞。

## 未做（禁区）

未改 src/test/assets/yaml/SPEC/PLAN/task 文 · 未签任何闸 · 未 push/tag/publish/deprecate（本棒唯一写面 = 本 invoke 新增 · 探针临件全清于 /tmp）。

## 下一棒

00 放行 → **30 `task close --yes`** 关账（00 收官裁定回填 `### KPI（00）` 节 · 备料充足）· task 归档 done/。
