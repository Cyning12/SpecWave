# Task：2.2 W8 · 发版前 bump（2.1.3 → 2.2.0 · closed-loop start 发版准备）

> **状态**：`active`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 2026-09-11 会话预授权 · 00 代签落表） · **wave**：W8（2.2.0 收尾发版准备）  
> **关联 SPEC**：[`docs/spec/2_2-closed-loop-start/README.md`](../../spec/2_2-closed-loop-start/README.md)（目标包 `spec-wave@2.2.0` minor）· [`01_release_pins_v1.md`](../../spec/2_2-closed-loop-start/01_release_pins_v1.md)（pins 机制 · 本波首次实战消费）  
> **发版纪律**：[`RELEASING.md`](../../../RELEASING.md) 硬步骤 ①–⑤（本波只做 bump 段；⑧ publish 仅人）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-2-closed-loop-w8-release-prep` |
| **test_strategy** | `required` |
| **test_strategy_note** | 四门（typecheck / test / build / test:lib）+ `pins check` 复跑 exit 0（12/12）为验收硬条款；459 用例基线全绿 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 版本钉 bump 机械动作；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 发版簿记 bump，无编码规范/流程增量；不晋升 coding_wiki |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身发版系列；合入由维护者 push+tag（同 2.1.2/2.1.3 先例） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-11 会话预授权 · 00 代签落表（沿用 [`spec_2_2_closed_loop_start_audit_R1_20260911.md`](../../harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md)） |
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-11 会话预授权 · 00 代签落表（同上审查文） |
| HG-TASK-DRAFT | **approved** | 20, 30 | 人 · 2026-09-11 会话预授权 · 00 代签落表 |
| HG-AUDIT-R1 | **approved** | ~~30~~ | 人 · 2026-09-11 会话预授权 · 00 代签落表 · R1 pass（[`task_2_2_closed_loop_w8_release_prep_audit_R1_20260911.md`](../../harness/reviews/task_2_2_closed_loop_w8_release_prep_audit_R1_20260911.md)）· bump 为维护者直接下令的机械动作 |

---

## 背景与目标

W1–W7 全部 CLOSE（459/459 绿），pins 机制（`assets/release-pins.yaml` 12 钉面）已上线。维护者直接下令执行 2.2.0 发版前 bump：版本真值源 `package.json#version` 2.1.3 → 2.2.0，pins fix 一键对齐 12 钉面，CHANGELOG 归拢 2.2.0 节，docs/spec 索引行转 IMPLEMENTED。**发布本体（push / tag / npm publish）归维护者，本 task 禁止。**

**完成态行为**：`node bin/specgate.js pins check` → 12/12 exit 0；CHANGELOG `## [2.2.0] - 2026-09-11` 节落账；docs/spec/README.md `2_2-closed-loop-start` 行转 IMPLEMENTED；四门全绿；feat 提交落账。

---

## 范围

- [x] `package.json` `version` → `2.2.0`（唯一手工改动点 · 真值源）
- [x] `node bin/specgate.js pins check` 观察偏差清单（7 钉面失配）→ `pins fix --yes` 一键对齐 → 复跑 11/12 + pin-10「git tag 缺失」（**设计红 · 待人打**，见自检结论留痕；发现并绕开同文件双钉面串行写覆盖缺陷）
- [x] CHANGELOG.md：Unreleased 节归档为 `## [2.2.0] - 2026-09-11`（W1–W7 全汇总 · 发布状态=待发版口径 · 格式沿用既有版本节）
- [x] docs/spec/README.md：`2_2-closed-loop-start` 行状态列 → **signed · IMPLEMENTED · 待发版**
- [x] pins fix 未覆盖/误伤落点手工修正并留痕：① pin-11/12 同文件串行写覆盖 → 二跑幂等收敛；② 机械 fix 造成的「已 published」叙事漂移 3 行手工改回「待发版」真值；③ pins 未钉的现行版本引用（README 迁移节 pin 行 ×4、MIGRATION、AGENTS dogfood 行、host-adapt kit_semver 示例、测试断言含转义形态）同步联改
- [x] 四门：typecheck ✓ · build ✓ · test:lib 4/4 ✓ · `npm test` 457/459（2 红均为 tag-gated 设计红：release-tag-identity「缺少 git tag v2.2.0」+ pins-consistency 真实仓 pins check 因 pin-10 缺失 exit 2；打 tag 后复跑即全绿）
- [x] feat 提交：`chore(release): bump to 2.2.0 — closed-loop start`（60b8640 · 精确 add 19 文件 · 无域外裹挟）

## 非范围

| 项 | 理由 |
|----|------|
| `git tag` / `git push` / `npm publish` / `npm deprecate` | 发布本体归维护者（RELEASING ⑧ 仅人；Agent 禁令） |
| RELEASING.md「最近一次发版」表叙事回填 | 待维护者 publish 后回填（避免冒充已发布） |
| CHANGELOG 2.2.0 节标「已 published」 | 同上 · 本波只写「待发版」口径 |
| `docs/tasks` / `docs/harness` 以外的 S2 之外的任何代码/测试行为变更 | bump 机械动作 · 零产品行为变更 |
| `.workbuddy/` 未跟踪档 | D0 域 · 不裹挟（F-X-06 / D0-PROT） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| 越权执行 publish/tag/push（F-W8-01） | 违禁令 · 打回 | — | 是 |
| `git add -A` 裹挟 `.workbuddy/` 等域外档（F-W8-02 · F-X-06） | 打回（撤 stage 逐文件 add） | 是 | — |
| pins fix 后 pins check 仍非 12/12（F-W8-03） | 验收 FAIL · 手工修漏网钉面留痕 | 是（修正复跑） | — |
| 四门任一红（F-W8-04） | 停止 bump · 先修再发（RELEASING ②） | 是 | 是 |
| CHANGELOG 残留 Unreleased 条目遗漏（F-W8-05 · RELEASING ③） | 验收 FAIL | 是（补归拢） | — |
| 顺手扩范围（改码/改测试/改 RELEASING 叙事） | 打回（F-X-05 范围蠕入） | — | — |

---

## 验收标准

- [x] `package.json#version` = `2.2.0` 且为唯一手工版本改动点（其余版本落点全部由 pins fix / 联改承载）
- [x] `node bin/specgate.js pins check` → 11/12 一致 · 唯一偏差 pin-10「git tag 缺失（git 操作仅人 · F-A1-05）」= **设计红留痕**；早产 tag v2.2.0（指 823325f@2.1.3）发现→上报→维护者侧已删，打 tag 后复跑即 12/12 exit 0
- [x] CHANGELOG `## [2.2.0] - 2026-09-11` 节归拢 W1–W7 无遗漏；Unreleased 仅留空壳
- [x] docs/spec/README.md `2_2-closed-loop-start` 行 = signed · IMPLEMENTED · 待发版
- [x] 四门：typecheck 0 错 0 警 ✓ · build ✓ · test:lib 4/4 ✓ · `npm test` 457/459（2 红均为 tag-gated 设计红 · 非代码回归 · RELEASING ⑤「须先有 vX.Y.Z tag 再期望测绿」既定序）
- [x] feat 提交精确 add 19 文件（60b8640）· `git diff --cached` 全程可证无 `.workbuddy/` / `.bak` 裹挟
- [x] 波末 `npx spec-wave gate-check --task <本 task>` → exit 0 · 未发现阻塞
- [x] 未执行：git tag · git push · npm publish/deprecate（全程零发布本体动作）

---

## 给执行帽的必读列表

1. `RELEASING.md` 硬步骤 ①–⑤（bump 段约定 · ④ 钉点同步现已由 pins 机制承载）
2. `assets/release-pins.yaml`（12 钉面声明 · fixable 矩阵 · S2 机械拒写）
3. `CHANGELOG.md` Unreleased 节 + 既有 2.1.3/2.1.2 版本节格式
4. SPEC：[`01_release_pins_v1.md`](../../spec/2_2-closed-loop-start/01_release_pins_v1.md) §5（钉面清单）

---

## 思考轮

### R0 · 证据

维护者直接下令 bump；W1–W7 done 档 + 459/459 绿基线；pins 机制 W1 已上线（12 钉面 · pins check 现 12/12 PASS @2.1.3）。

### R1 · 范围

bump 四件套（package.json / pins fix / CHANGELOG / spec 索引行）+ 四门 + 提交；发布本体三动作（push/tag/publish）非范围。

### R2 · 方案

pins fix 一键对齐【采纳 · W1 机制设计用途即此】；逐钉面手工改【弃 · 正是 W1 要消的病】；npm version 命令【备选 · 会顺手打 tag，违本波「tag 归维护者」边界，故手工改 package.json】。

### R3 · 边界

S2 过程档可写（本 task/invoke/review）；pins fix 自身 S2 机械拒写；`.workbuddy/` 不碰；RELEASING 叙事行不回填（待 publish）。

### R4 · 可测性

pins check 12/12 exit 0 机械验；四门绿机械验；`git status --porcelain` 审提交边界。

### R5 · 签收就绪

本槽由 20-task-audit R1 复核后判充分；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 维护者下令 + W1–W7 绿基线 | no |
| R1 | bump 四件套 · 发布本体非范围 | no |
| R2 | pins fix 一键对齐 · 手工改 package.json（不用 npm version 防顺手 tag） | no |
| R3 | S2/禁区边界明示 | no |
| R4 | pins check + 四门双机械验 | no |
| R5 | 20 审 R1 pass · 30/40 闭环完成（设计红留痕见自检结论） | no |

**residual_risks**：pin-10（git tag v2.2.0）在维护者打 tag 前 pins check 必报该面偏差——须实测其 exit 语义并在汇报留痕（若 exit 2 则 bump 后 pins check 红属预期态，复跑 12/12 的验收口径以 pin-10 待人打说明为准）；README 双语正则有脆性（缓解：正则入 yaml 数据 · fix 幂等 · W1 已留破坏性自证测）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 无新行为故无新测试义务；四门回归 + pins check 12/12 为验收硬条款；若版本断言联改（既有测钉 2.1.3 处）则同步联改并留痕。

---

## 提交信息约定

- 提交信息：`chore(release): bump to 2.2.0 — closed-loop start`（独立提交）
- **禁 `git add -A`**：逐文件显式 add（package.json / CHANGELOG.md / pins fix 触及文件 / docs/spec/README.md / 本 task + invokes + review 过程档）
- **不裹挟** `.workbuddy/` 未跟踪档（D0-PROT / F-X-06）
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w8_release_prep.md`

---

### 自检结论（执行者）

**30+40 闭环 · 2026-09-11 · bump 机械动作完成（2.1.3 → 2.2.0）· 零发布本体越权（无 tag/push/publish）**

**bump 链路**：package.json version → 2.2.0（唯一手工版本改动点）→ `pins check` 报 7 钉面失配（pin-03/04/05/06/07/11/12）→ `pins fix --yes` 写入 7 处（自动 .bak 备份）→ 复跑发现 pin-11 仍 2.1.3 → 定位 **pins fix 同文件双钉面缺陷**（pin-11 与 pin-12 同写 `assets/ide/host-adapt/README.md`，单次运行内串行写互相覆盖）→ 二跑 `pins fix --yes` 幂等收敛 → 12 落点中 11 一致。

**手工修正留痕（pins 机制未覆盖/误伤面）**：
1. **叙事漂移修复 ×3**：pins fix 机械替换把 README 双语 :363 与 RELEASING :13 的「现行包」行改成「2.2.0 已 published · tag v2.1.3」自相矛盾假叙事 → 手工改为「bump 已落 · 待发版 · 当前已 published=2.1.3（tag v2.1.3）」真值口径。
2. **pins 未钉的现行版本引用联改**：README 双语迁移节「pin 2.1.3」×4 · MIGRATION.md ×5 · AGENTS.md dogfood 刷新行 · host-adapt README `kit_semver` 示例 → 同步 2.2.0（沿袭 2.1.3 bump commit 8797b76 先例）。
3. **测试版本断言联改**：8 个测试文件（cli-validation / cli-p0 / cli-upgrade-compat / cli-docs-121 / cli-docs-122 / init / cli-refresh-ide-blocks / cli-discipline-coverage）——首轮 sed 漏网**正则转义形态**（断言正则里反斜杠转义点号的写法），perl 二轮补齐。

**重大发现（已上报 parent/维护者）**：本地存在**早产轻量 tag `v2.2.0`** 指向 823325f（W6 close · package.json=2.1.3）→ 触发 release-tag-identity 红（tag 版本 2.1.3 ≠ 当前 2.2.0 · 2.1.1 身份错位防重演机制正常工作）；核实 origin 远端无此 tag 后上报，维护者侧已删除。pin-10 现为「git tag 缺失」设计红，待维护者在 bump 提交（60b8640）上打 `v2.2.0`。

**验证命令（cwd=仓根 · 真实运行）**：

| 命令 | 退出码 | 关键输出 |
|------|--------|----------|
| `npx spec-wave verify --target . --task <本 task>`（GATE_VERIFY 首输出） | 0 | VERIFY: PASS · HG-AUDIT-R1=approved ✅ 可 30 |
| `npx spec-wave task lint --file <本 task>` | 0 | LINT: PASS |
| `node bin/specgate.js pins check`（bump 后首轮） | 2 | BLOCKED · 7 偏差 / 12 落点 |
| `node bin/specgate.js pins fix --yes` ×2 | 0 | 写入 7 处 + 二跑补 pin-11 · 自动 .bak 备份 |
| `node bin/specgate.js pins check`（终态） | 2 | 11/12 一致 · 唯一偏差 pin-10「git tag 缺失 · git 操作仅人（F-A1-05）」= 设计红待人打 |
| `npm run typecheck` | 0 | tsc --noEmit · 0 错 0 警 |
| `npm test` | 1 | **457/459 pass**（基线 459）· 2 红均为 tag-gated 设计红：`release-tag-identity`「缺少 git tag v2.2.0」+ `pins-consistency`「真实仓 pins check exit 0」（因 pin-10）；维护者打 tag 后复跑即 459/459 |
| `npm run build` | 0 | tsc 构建通过 |
| `npm run test:lib` | 0 | 4/4 pass（lib 冒烟） |
| `npx spec-wave gate-check --task <本 task>` | 0 | 闸检查: 未发现阻塞 |

**提交**：`60b8640` `chore(release): bump to 2.2.0 — closed-loop start`（19 文件精确 add · `git diff --cached --stat` 可证无 `.workbuddy/` / `.bak` 裹挟）。

**已知未测项**：pins check 12/12 与 npm test 459/459 须维护者打 `v2.2.0` tag 后复跑确认（设计序 · RELEASING ⑤）；`.bak` 备份文件留作本机回滚（未入库 · 维护者可自行清理）。

---

### KPI（00）

Task_KPI%: 95（验收 8/8 落地（其中 pins 12/12 与 459/459 为 tag-gated 设计红 · 留痕如实不冒充绿）· 零发布本体越权 · 提交边界干净 · 额外产出 2 项机制级发现：pins fix 同文件双钉面串行写覆盖缺陷 + 早产 tag 拦截实证）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同 Agent 闭环 · 无返工（机制缺陷二跑幂等收敛 · 非重做）
- 范围守界：bump 四件套 + pins 触及面 + 断言联改 · 未碰 src/ 产品代码 · 未回填 RELEASING 叙事为已发布 · 未碰 .workbuddy/
- 质量门：typecheck/build/test:lib 绿 · npm test 457/459（2 红设计序）· gate-check PASS

---

### 经验总结

（`experience_capture: recommended` · 关账回填）

- **pins fix 同文件多钉面需二跑兜底**：同一文件被 ≥2 个 fixable 钉面（本次 pin-11/12）命中时，单次 `pins fix --yes` 串行写会互相覆盖（后写者持旧快照）；幂等设计使二跑收敛。候选债项：fix 实现按文件分组一次性写盘（2.2.1/2.3 候选 · 已在 CHANGELOG 2.2.0 Docs 节留痕）。
- **机械替换不含叙事语义**：pins fix 只换版本号不换叙事，「现行包 · 已 published」类行在 bump 后 publish 前会短暂自相矛盾； bump 后须人工巡检「published/latest/tag」叙事行（本次 ×3）。候选改进：钉面数据加 narrative-hold 注记或 bump 态专用文案模板。
- **早产 tag 会被两道独立闸同时拦截**（pin-10 存在性 + release-tag-identity 内容一致性），溯源机制实战有效；维护者删 tag 后两道闸转设计红，正是 RELEASING ⑤「先 tag 再期望测绿」的既定序。
- wiki_delta=none 作答维持：发版簿记 bump 无编码规范/流程增量，不晋升 coding_wiki（与元信息 note 一致）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-11 | 初稿 · 10-task（维护者直接下令 bump · W8 发版准备）· 预填 Harness 元信息 + wiki_delta=none |
| 2026-09-11 | 30+40 闭环：验收勾选 + 自检结论 + KPI + 经验回填（bump 60b8640 · pins 11/12 + pin-10 设计红待人打 · 457/459 两道 tag-gated 设计红）|
