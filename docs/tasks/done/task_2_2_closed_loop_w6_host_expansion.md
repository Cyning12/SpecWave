# Task：2.2 W6 · 三宿主扩展（B1：copilot / codex / windsurf）

> **状态**：`done`（HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-11） · **wave**：W6  
> **关联 SPEC**：[`docs/spec/2_2-closed-loop-start/04_host_expansion_v1.md`](../../spec/2_2-closed-loop-start/04_host_expansion_v1.md)（B1 全篇）· [`06_waves_and_acceptance_v1.md`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W6  
> **依赖**：**W1**（[`task_2_2_closed_loop_w1_release_pins.md`](task_2_2_closed_loop_w1_release_pins.md) · 新宿主相关版本文案落点纳入钉面数据更新 · 依赖其 `assets/release-pins.yaml` 落地）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-2-closed-loop-w6-host-expansion` |
| **test_strategy** | `required` |
| **test_strategy_note** | 新增测试钉死三宿主行 + 4 旧宿主回归 + S2 拒写（assertNotS2Abs 链路）无回归；dry-run 与 --yes 落点一致性断言 |
| **code_quality_bar** | `strict` |
| **freeze_id** | host-adapt schema 冻结：发现必须改 schema（extends/defaults/hooks surface）→ STOP · 升级 freeze_id 回 10-spec 重议范围（F-W6-01） |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | host 适配表数据 + 测试；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 宿主矩阵落适配表与 README（落地后才可对外宣称）；不晋升 coding_wiki |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身发版系列；合入由维护者 push+tag（同 2.1.2 先例） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-11 会话预授权 · 00 代签落表（[`docs/harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md`](../../harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md)） |
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-11 会话预授权 · 00 代签落表（同上审查文） |
| HG-TASK-DRAFT | **approved** | 20, 30 | 人 · 2026-09-11 会话预授权 · 00 代签 |
| HG-AUDIT-R1 | **approved** | ~~30~~ | 人 · 2026-09-11 会话预授权 · 00 代签落表 · R1 pass（[`docs/harness/reviews/task_2_2_closed_loop_w6_host_expansion_audit_R1_20260911.md`](../../harness/reviews/task_2_2_closed_loop_w6_host_expansion_audit_R1_20260911.md)） |

---

## 背景与目标

路线研究取证：13 个候选宿主中 11 个原生读 `AGENTS.md`；本库 `agents` host 已在物化 AGENTS.md 片段 → 新增 AGENTS.md 系宿主**近零新资产**（门槛在 always_on 复用，不在新写资产）。候选优先级：`copilot` > `codex` / `windsurf` > 其余；本波取前三。现状 `assets/ide/host-adapt/examples/mvp-hosts.yaml` 4 个 host_id。

**完成态行为**：三新宿主落表且 `host validate` / `apply --dry-run` / `apply --yes` / `update` 全链路可用；落地前对外文案仍写「4 宿主」。

---

## 范围

- [x] 适配表新增三个 host_id：`copilot` / `codex` / `windsurf`——落点复用 AGENTS.md 片段 + 各宿主原生 skills/commands 目录（若该宿主有；无则仅 AGENTS.md + 文档说明）
- [x] `host validate` 对含三新宿主的适配表通过
- [x] 三宿主 `host apply --dry-run` 落点正确；`--yes` 物化后 `host update` 粘性可用
- [x] 新增测试钉死三宿主行；现有 4 宿主回归不破
- [x] 新宿主相关版本文案落点纳入 W1 钉面（`release-pins.yaml` **数据**更新，不改代码 · 依赖 W1 落地）

## 非范围

| 项 | 理由 |
|----|------|
| host-adapt schema 变更（`extends` / `defaults` / `hooks` surface） | B2/A3 · 2.3–3.0 · 若发现必须改 schema → **升级 freeze_id 回 10-spec**，不顺势改 |
| `commands` 动词名入表 | B3 · 3.0 |
| `gemini` / `opencode` 等其余 6 宿主 | B4 · 2.3 |
| 社区插件机制 | B5 · 3.0 |
| 对外宣称「7 宿主」 | 发布后由事实卡维护者更新口径 · 本波不提前宣称（F-W6-04） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| 落表时发现必须改 schema（F-W6-01） | **STOP** · 升级 freeze 回 10-spec 重议范围 | — | 是 |
| 新宿主落点指向 S2（F-W6-02） | `assertNotS2Abs` 拒写 · 若可绕过则验收 FAIL | — | 是 |
| dry-run 与 `--yes` 落点不一致（F-W6-03） | 验收 FAIL | 是（修一致重验） | 是 |
| 对外文案提前写「7 宿主」（F-W6-04） | 打回（事实卡 §11） | — | — |
| 三宿主实际目录约定与调研不符 | 先 `--dry-run` 实测取证再落表；差异大则回 10-spec | 是 | — |
| 「近零新资产」证伪（需新资产） | 单宿主超出即缩减该宿主范围并留痕，不顺势改 schema | — | — |

---

## 验收标准

- [x] `host validate` 对含三新宿主的适配表通过
- [x] 三宿主 `host apply --dry-run` 落点正确（AGENTS.md 片段 + 该宿主原生目录）；`--yes` 物化后 `host update` 粘性可用
- [x] 新增测试钉死三宿主行；现有 4 宿主回归不破
- [x] S2 拒写对新宿主落点同样生效（`assertNotS2Abs` 链路无回归）
- [x] 新宿主版本文案落点已入 `release-pins.yaml` 数据（W1 落地后）
- [x] 发布前对外文档（README 等）宿主数表述与落地状态一致（不允许「文档先行」）
- [x] `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` 四门绿（与 `.github/workflows/ci.yml` 一致 · 06 硬纪律 A-2.2-12）
- [x] `npx --yes spec-wave task lint-wiki-delta --target .` 通过（wiki_delta 预检）
- [x] 波末 `npx spec-wave gate-check --task <本 task>` 通过（HG-AUDIT-R1=approved 后）

---

## 给执行帽的必读列表

1. SPEC：[`04_host_expansion_v1.md`](../../spec/2_2-closed-loop-start/04_host_expansion_v1.md) 全篇 · [`06`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W6 + A-2.2-09
2. `assets/ide/host-adapt/README.md` · `assets/ide/host-adapt/examples/mvp-hosts.yaml`（现 4 host_id）
3. W1 task：[`task_2_2_closed_loop_w1_release_pins.md`](task_2_2_closed_loop_w1_release_pins.md)（钉面数据依赖）
4. 事实卡 `.workbuddy/output/推广事实卡-2.1.3.md` §11（宿主数禁提前宣称）
5. `src/` host-adapt 相关模块（`assertNotS2Abs` 链路 · 30 自行定位）

---

## 思考轮

### R0 · 证据

SPEC 04 §1（13 候选 11 读 AGENTS.md · 优先级 · 现 4 host_id 实测 · 事实卡 §11 警示）。

### R1 · 范围

copilot/codex/windsurf 三宿主落表 + 链路可用 + 钉面数据更新；schema / 动词名 / 其余 6 宿主 / 社区插件 / 提前宣称均出范围。

### R2 · 方案

SPEC 04 §4 已定：复用 `agents` host 资产面 + 表内新增行【采纳 · 近零新资产 · 验证「加 host 不改代码」链路】；每宿主新写全套资产【弃】；连 schema 分层同做【弃 · 超范围】。（20 审复核即可，不重开。）

### R3 · 边界

schema 冻结（F-W6-01 STOP 条款）· S2 拒写 · 事实卡宿主数口径 · 钉面只动数据不动代码。

### R4 · 可测性

三宿主行测试 + 4 旧宿主回归 + S2 拒写断言 + dry-run/--yes 一致性断言。

### R5 · 签收就绪

本槽由 20-task-audit R1 复核后判充分；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 结构性发现（11/13 读 AGENTS.md）为本波基石 | no |
| R1 | 前三宿主 · 其余归 B4 2.3 | no |
| R2 | 复用 agents 资产面（SPEC 已定 · 20 复核） | no |
| R3 | schema 冻结 + 事实卡口径 | no |
| R4 | 四类断言钉死 | no |
| R5 | 待 20 审裁定 | no |

**residual_risks**：三宿主实际目录约定与调研可能不符（缓解：先 dry-run 实测取证 · 差异大回 10-spec）；「近零新资产」可能被证伪（缓解：单宿主缩减留痕）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 新增宿主行测试先红后绿；4 旧宿主回归与 S2 拒写断言必须仍绿。

---

## 提交信息约定

- 提交信息：`feat(2.2-W6): …`（独立提交 · 前缀不变）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟 D0 未提交改动**（`delivery/promotion/` 4 份 + `package.json` description/keywords · F-X-06 / D0-PROT）
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w6_host_expansion.md`

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 2026-09-11 · 全部命令真实执行 · 完整输出见 invoke `invoke_20260911_30_40_2-2-closed-loop-w6-host-expansion.md` 与交付汇报）

**验证命令与退出码**（cwd=仓根 · 物化实测在 mktemp 临时目录）：

| 命令 | exit | 结果 |
|------|------|------|
| `npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w6_host_expansion.md` | 0 | VERIFY: PASS（开工前 GATE_VERIFY · HG-AUDIT-R1=approved 与声称一致） |
| 先红：新测试首跑 | 1 | `host apply 未知 host_id: copilot, codex, windsurf`（红→绿闭环） |
| `node bin/specgate.js host validate` | 0 | HOST VALIDATE: PASS（含三新宿主的 7 行适配表） |
| `host apply --tools copilot,codex,windsurf --target <tmp> --dry-run` | 0 | planned 24 项 = AGENTS.md + `.github/skills`（copilot）+ `.agents/skills`（codex · 官方 repo 级目录）+ `.windsurf/skills`（windsurf）· written 0 · 零写盘零粘性 |
| 同参 `--yes` | 0 | 物化 24 文件 + 粘性 `host_ids=[copilot,codex,windsurf]` · dry-run planned 与 written 集合一致（F-W6-03 测试钉死） |
| `host update --yes`（无 --tools · 读粘性） | 0 | HOST UPDATE: PASS · 粘性三宿主 · 幂等 skip_identical · 零写入 |
| S2 三向 fixture（copilot→docs/tasks · windsurf→invokes · codex→reviews） | 2 | validate/apply 均拒写 · 零落盘（F-W6-02 链路无回归 · 测试钉死） |
| `npx spec-wave pins check` | 0 | `PINS: PASS · 12/12 落点一致`（新增 pin-11/12 = host-adapt README 版本文案落点 · 只动数据） |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **459/459 pass**（447 基线 + W6 新增 11 测 + pins C组新增 1 测） |
| `npm run build` | 0 | — |
| `npm run test:lib` | 0 | 4/4 pass |
| `npx spec-wave task lint-wiki-delta --target .` | 0 | LINT-WIKI-DELTA: PASS |
| `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w6_host_expansion.md` | 0 | 闸检查：未发现阻塞 |

**验收 9 条全部 pass**：①②③ 适配表三行 + validate/dry-run/--yes/update 全链路实测（上表）；④ S2 拒写三向钉死；⑤ pin-11/12 数据落钉面（pins 代码零改动）；⑥ 对外口径自查——根 README 双语 / 推广物料未动（发布前仍 4 宿主表述），仅仓内技术文档按落地事实更新，无「7 宿主」预告（F-W6-04）；⑦ 四门绿；⑧ wiki-delta 预检 PASS；⑨ gate-check exit 0。

**schema 冻结核查（F-W6-01）**：schema 无 host_id 枚举，新增三行纯数据，**STOP 条款未触发** · 零 src 改动（「加 host 不改代码」链路验证成立）。

**已知未测项**：三宿主真实 IDE/CLI 内加载行为（属宿主侧运行时 · 本仓只能证落点与官方文档目录约定一致 · 目录约定已经官方文档取证：copilot=`.github/skills` · codex=`.agents/skills`（**纠正**部分第三方教程的 `.codex/skills` 口径）· windsurf=`.windsurf/skills`）。

---

### KPI（00）

Task_KPI%: 100（验收 9/9 自证通过 · 四门绿 459/459 · 全链路临时目录实测 · S2 三向拒写钉死 · schema 冻结零触发 · 零 src 改动达成加宿主）

---

### 经验总结

1. **「加 host 不改代码」链路验证成立**：host-adapt 表数据驱动设计兑现——三宿主落表零 src 改动，唯二联改是 TEST-LOCK 断言（`--tools all` 全表集合）与 pins 数据形态断言，均属性质正确的硬钉。
2. **目录约定须以官方文档为准**：codex 的 repo 级 skills 目录官方口径是 `.agents/skills`（扫描 $CWD 至 repo root），部分第三方教程写 `.codex/skills` 已过期；先取证再落表的 failure_path 设计避免了落错点。
3. **codex 与 agents 落点完全同构**（AGENTS.md + `.agents/skills`）：AGENTS.md 系宿主的「近零新资产」论断在 codex 上达到极致——整行资产引用与 agents 行逐项相同，由「近零新资产」测试机械钉死（任何未来新资产引入会真失败）。
4. wiki_delta=none 维持：宿主矩阵落适配表与 host-adapt README（仓内技术文档），无可复用编码规范增量，不晋升 coding_wiki。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-11 | 初稿 · 10-task 批量拆波（W2–W7 每波一份 · 00 委派）· 预填 Harness 元信息 + wiki_delta |
| 2026-09-11 | W6 实现落地 · 30+40 闭环：适配表 +copilot/codex/windsurf 三行（零 src 改动 · 复用 agents 资产面）· host-adapt README 矩阵 · release-pins 数据 +pin-11/12 · 新增 11 测 + TEST-LOCK 联改 · 验收 9/9 自证全过（四门 459/459 · 临时目录全链路实测 · S2 三向拒写） |
