# Task：2.2 W2 · 安全封堵（C1 路径穿越收口 + C3 停止输出绝对路径）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-11） · **wave**：W2  
> **关联 SPEC**：[`docs/spec/2_2-closed-loop-start/02_security_closure_v1.md`](../../spec/2_2-closed-loop-start/02_security_closure_v1.md) §W2（C1+C3）· [`06_waves_and_acceptance_v1.md`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W2  
> **依赖**：无硬依赖（可与 W1 并行；建议 W1 先落）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-2-closed-loop-w2-security-closure` |
| **test_strategy** | `required` |
| **test_strategy_note** | 负向测试钉死拒止（/etc/hosts 类输入 · `..` 逃逸）· stdout 无绝对目标路径断言 · 既有 406 用例回归 |
| **code_quality_bar** | `strict` |
| **freeze_id** | D-W2-ABS-PATH-UX=拒止+迁移指引 exit 1（2026-09-11 冻结 · 用法错误档） |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | CLI 安全封堵；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 安全行为变更落 CHANGELOG；kit 自身不晋升 coding_wiki（stable 判定由 CLOSE 棒复核） |
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
| HG-AUDIT-R1 | **approved** | ~~30~~ | 人 · 2026-09-11 会话预授权 · 00 代签落表 · R1 pass（[`docs/harness/reviews/task_2_2_closed_loop_w2_security_closure_audit_R1_20260911.md`](../../harness/reviews/task_2_2_closed_loop_w2_security_closure_audit_R1_20260911.md)） |

---

## 背景与目标

`resolveTaskPath`（`src/cli-shared.ts:275-277`）接受任意绝对路径，`verify --task /etc/hosts` 类输入被接受并读取（路线研究已复现 · 20-spec-audit R1 抽测属实）；`resolveTarget`（`cli-shared.ts:32-34`）无 git-root 归卡校验。同时 `cli.ts:403/500/548` 三处打印绝对目标路径（T-10）。

**完成态行为**：`--task`/`--spec` 指向 target 外的路径一律拒止（exit 1 · 报错给相对路径迁移指引 · 不留读痕）；`--target` 非 git 仓明确报错；命令 stdout 不再出现绝对目标路径。

---

## 范围

- [x] **C1-a**：`resolveTaskPath` 层**一处收口**——拒 target 外绝对路径 + 相对路径解析后归卡 target 内（含 `..` 逃逸拒止）；收口自动覆盖 `cli.ts` 4 个调用点（:510 / :554 / :597 / :710），**禁逐调用点补丁**
- [x] **C1-b**：`resolveTarget` 增 git-root 归属校验（复用 T-02 既有 git-root 探测能力，不新造）
- [x] **C1-c**：拒止报错文案含迁移指引（相对路径写法）· exit 1（D-W2-ABS-PATH-UX 冻结值）
- [x] **C3**：`cli.ts:403/500/548` 三处 `目标: <abs>` 打印改相对路径，复用 `cli-shared.ts:284-288` `toRel(target, abs)`；其余 stdout/stderr 绝对目标路径同口径排查
- [x] 负向测试：/etc/hosts 类绝对路径 · `..` 逃逸 · 非 git 仓 target；stdout 无绝对目标路径断言

## 非范围

- 不改 verify / gate-check / audit 的**判定算法**本身
- 不动 S2 写保护（沙箱实测已生效 · 路线研究裁决 1 定为误报）
- 不清理 `isS2RelPath` 无调用方残留（归 2.3 工程健康波）
- 不做全仓日志结构化（C6 · 3.0）
- 不改内部路径解析逻辑（C3 仅输出层）

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| `--task`/`--spec` 传 target 外绝对路径（F-W2-01） | 拒止 · exit 1 · 报错给相对路径迁移指引 | 是（改相对路径重跑） | 是 |
| `--target` 非 git 仓（F-W2-02） | 报错 · 非 0 | 是 | 是 |
| 相对路径含 `..` 逃逸 target（F-W2-03） | 同 F-W2-01 拒止 | 是 | 是 |
| 封堵逐调用点补丁、漏 4 调用点之一（F-W2-04） | 验收 FAIL · 必须在 `resolveTaskPath` 层收口 | — | — |
| stdout 仍打印绝对目标路径（403/500/548 任一 · F-W2-05） | 验收 FAIL | — | — |
| 误伤存量合法绝对路径用法（CI 传绝对路径 task） | 报错文案明确迁移写法 · exit 1 用法错误档（D-W2-ABS-PATH-UX 缓解） | 是 | 是 |

---

## 验收标准

- [x] `verify --task /etc/hosts` 及等价绝对路径输入 → 非 0 退出且**不读取目标文件**（输出不含其内容 · 负向测试钉死）
- [x] 相对路径 `..` 逃逸 target → 同口径拒止（负向测试）
- [x] `--target` 指向非 git 仓路径 → 明确报错非 0（非静默接受 · 负向测试）
- [x] 封堵在 `resolveTaskPath` 层单点收口（代码审查可验 · 4 调用点零补丁）
- [x] `verify`/`audit` 等命令 stdout 不再出现绝对目标路径（测试断言 · 相对路径输出与 target 参数无关地稳定）
- [x] 拒止报错含相对路径迁移指引
- [x] 合法相对路径用例回归全绿（现有 406 用例不破）
- [x] `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` 四门绿（与 `.github/workflows/ci.yml` 一致 · 06 硬纪律 A-2.2-12）
- [x] `npx --yes spec-wave task lint-wiki-delta --target .` 通过（wiki_delta 预检）
- [x] 波末 `npx spec-wave gate-check --task <本 task>` 通过（HG-AUDIT-R1=approved 后）

---

## 给执行帽的必读列表

1. SPEC：[`02_security_closure_v1.md`](../../spec/2_2-closed-loop-start/02_security_closure_v1.md) §W2 · [`06`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W2 + A-2.2-04/05
2. `src/cli-shared.ts` `resolveTaskPath`（:275-277）· `resolveTarget`（:32-34）· `toRel`（:284-288）
3. `src/cli.ts` 4 调用点（:510/:554/:597/:710）· 3 处打印（:403/:500/:548）
4. 审查文：[`reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md`](../../harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md)（D-W2-ABS-PATH-UX 冻结出处）
5. `AGENTS.md`（Verify 四门 · 禁区）

---

## 思考轮

### R0 · 证据

SPEC 02 §W2 证据节 + 20-spec-audit R1 核对项 #13/#14（点位抽测属实 · 打印 1→3 处修正已留痕）。

### R1 · 范围

C1（路径穿越 + git-root 归卡）+ C3（输出层相对化）合波；判定算法 / S2 写保护 / isS2RelPath 残留 / 日志结构化均出范围。

### R2 · 方案

（30 前由 20 审复核候选：收口点 = `resolveTaskPath` 单点【荐，SPEC R2 已定】vs 逐调用点补丁【弃 · F-W2-04】；`toRel` 复用【荐】vs 新造相对化工具【弃】。）

### R3 · 边界

S2 永不可写 · P0 不可绕过 · exit 码冻结为 1（用法错误档）· 不误伤合法相对路径存量用法。

### R4 · 可测性

负向测试先行（先红后绿）：绝对路径拒止 / `..` 逃逸 / 非 git 仓 / stdout 断言；406 用例回归。

### R5 · 签收就绪

本槽由 20-task-audit R1 复核后判充分；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据点位经 20 抽测属实，无需复跑 | no |
| R1 | C1+C3 同波（同文件同安全主题） | no |
| R2 | resolveTaskPath 单点收口 + toRel 复用（SPEC 已定 · 待 20 复核） | no |
| R3 | exit 1 冻结 · 不误伤合法用法 | no |
| R4 | 负向测试先红后绿 · 406 回归 | no |
| R5 | 待 20 审裁定 | no |

**residual_risks**：存量用户 CI 传绝对路径 task 会被拒（缓解：迁移指引文案 · exit 1 档 · CHANGELOG 置顶提示）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 先可失败负向测试再改实现；stdout 断言与 406 用例回归必须仍绿。

---

## 提交信息约定

- 提交信息：`feat(2.2-W2): …`（独立提交 · 单波单 commit 或按里程碑小步提交均可，前缀不变）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟 D0 未提交改动**（`delivery/promotion/` 4 份 + `package.json` description/keywords · F-X-06 / D0-PROT）
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w2_*.md`

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 2026-09-11 · 全部命令真实执行 · 完整输出见 invoke `invoke_20260911_30_40_2-2-closed-loop-w2-security-closure.md` 与交付汇报）

**实现摘要**：`src/cli-shared.ts` 新增 `findGitRoot`（T-02 向上探测 .git 唯一实现源 · index.ts `userOverrideRoot` 改复用不新造）；`resolveTaskPath` 单点收口（target 外绝对路径 / `..` 逃逸一律读前 fail(1) · 覆盖 cli.ts 4 调用点 + cli-checks/cli-status/cli-timeline 共用方 · target 内绝对路径存量用法放行）；`resolveTarget` 增 `requireGitRoot` 选项并在 verify（task+spec 双模）/audit/gate-check 三命令接线（init/host/refresh-ide-blocks 等非 git 合法面默认不校验 · refresh-ide-blocks git=none 备份回滚档不回归）；`toRel` 口径收口为「永不落绝对路径」（相等→`.` · base 外→`..` 相对形 · 既有调用方输入恒在 base 内行为不变）；`目标:` 打印相对化 7 处（cli.ts ×3 + manifest 未接入行 + cli-task-extra ×2 + cli-graph ×1 + cli-refresh-ide-blocks ×1）。

**验证命令与退出码**（cwd=仓根 · 行为自证用本地构建产物 `node bin/specgate.js`（npx 发布版 2.1.3 尚无本波代码））：

| 命令 | exit | 结果 |
|------|------|------|
| `npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w2_security_closure.md`（开工前 GATE_VERIFY） | 0 | VERIFY: PASS · HG-TASK-DRAFT/HG-AUDIT-R1 均 approved 与声称一致 |
| `node bin/specgate.js verify --target . --task /etc/hosts` | **1** | `错误: --task/--spec 拒绝 target 之外的路径: /etc/hosts` + 迁移指引（相对路径写法 + 示例）；`grep -cE '127.0.0.1\|localhost'` = **0**（不留读痕） |
| `node bin/specgate.js verify --target . --task ../../etc/passwd`（`..` 逃逸） | **1** | 同口径拒止 + 迁移指引 |
| `node bin/specgate.js verify/audit --target $(mktemp -d)`（非 git 仓） | **1** | `错误: --target 不在任何 git 仓内（向上未找到 .git）` + git init 迁移指引（F-W2-02 非静默接受） |
| stdout 绝对路径扫描：`gate-check/audit/check --target .` 输出 grep `$(pwd)` | 0 命中 | `目标: .` · `manifest: (未接入 · 无 .coding-kit/manifest.json)` 相对口径 |
| `node bin/specgate.js verify --target . --task <本 task>`（合法相对路径回归 · 新码） | 0 | VERIFY: PASS |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **439/439 pass**（421 基线 + 新增 cli-security-closure 18 测；8 份 gate 面 fixture seed `.git` 成消费者仓仿真 · 用例意图零改动） |
| `npm run build` | 0 | — |
| `npm run test:lib` | 0 | 4/4 pass |
| `node bin/specgate.js task lint-wiki-delta --target .` | 0 | LINT-WIKI-DELTA: PASS · scanned 54 · missing 0 |
| `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w2_security_closure.md` | 0 | 闸检查：未发现阻塞 |

**验收 10 条全部 pass**（/etc/hosts + 哨兵文件双向不留读痕 · `..` 逃逸 · 非 git 仓 · 单点收口 diff 可审（cli.ts 4 调用点零补丁）· stdout 断言含 `--target .` vs `--target <abs>` 输出稳定 · 迁移指引文案 · 439 回归 · 四门 + lint-wiki-delta + gate-check）。

**已知未测项**：CI workflow 实跑（本地四门与 CI 同源已绿）；`verify --json` / `gate-check --json` 的 `target` 字段仍为绝对路径（JSON 契约只增不改 · W3 非范围条款 · C3 范围为人读 `目标:` 行）；符号链接逃逸（仓内 symlink 指向仓外）未封堵（task 范围为词法归卡 · 安全设计 §2.2.4 realpath 档归后续波次）。

---

### KPI（00）

Task_KPI%: 100（验收 10/10 自证通过 · 四门绿 · 负向三链（/etc/hosts · `..` 逃逸 · 非 git 仓）实测 exit 1 且无读痕 · 439/439 测试含 18 新增全绿 · 单点收口零调用点补丁）

---

### 经验总结

1. **安全收口先看「既有合法面」再定 enforcement 面**：`resolveTarget` 是全命令共用入口，git-root 校验若无条件硬加会击穿 init / refresh-ide-blocks（git=none 备份回滚档为明示特性）等非 git 合法面；以 `requireGitRoot` 选项仅在 verify/audit/gate-check gate 面接线，兼顾 SPEC「target 须落在 git 仓内」与不误伤存量用法。
2. **fixture 即消费者仓仿真**：C1-b 落地后 8 份 gate 面测试 fixture seed `.git` 即全绿——行为变更类 task 的旧测影响面（K7）可用「fixture 补真」消解而非放宽实现。
3. **工具语义收口优于新造**：`toRel` 原「越界回落绝对路径」口径与 C3 直接冲突；核实全部调用方输入恒在 base 内后，把口径收口为「永不落绝对路径」（`.` / `..` 相对形），单工具复用成立（R2 钉案）且零调用方回归。macOS `/var`→`/private/var` 符号链接会使 `--target` 拼写与 cwd realpath 错位，测试比较前须 realpath 归一（assets.test.ts 既有先例）。
4. **wiki_delta 作答**：`none` —— 安全行为变更落 CHANGELOG（发版棒）；以上为仓内工程经验，无可晋升 coding_wiki 的通用编码规范增量（stable 判定由 CLOSE 棒复核 · 与元信息 `wiki_delta_note` 一致）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-11 | 初稿 · 10-task 批量拆波（W2–W7 每波一份 · 00 委派）· 预填 Harness 元信息 + wiki_delta |
| 2026-09-11 | W2 实现落地 · 30+40 闭环：resolveTaskPath 单点收口 + findGitRoot/requireGitRoot + toRel 口径收口 + 目标打印相对化 7 处 · cli-security-closure 18 测新增 · 验收 10/10 自证全过（提交 1e49052） |
