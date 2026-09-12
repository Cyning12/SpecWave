# Task：2.2 W1 · A1 · 版本/身份钉自动化（release pins）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-11）  
> **wave**：W1（2.2.0 核心波）  
> **关联 SPEC**：[`docs/spec/2_2-closed-loop-start/01_release_pins_v1.md`](../../spec/2_2-closed-loop-start/01_release_pins_v1.md)（**唯一蓝本**）· [`00_policy_and_boundaries.md`](../../spec/2_2-closed-loop-start/00_policy_and_boundaries.md) · [`06_waves_and_acceptance_v1.md`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md)  
> **审查文**：[`docs/harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md`](../../harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md)（20-spec-audit R1 · pass 零阻塞）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-2-closed-loop-w1-release-pins` |
| **test_strategy** | `required` |
| **test_strategy_note** | 新增 `test/pins-consistency.test.ts`（失配时真失败 · 破坏性自证）；`pins fix` S2 拒写反向验证；四门绿（typecheck / test / build / test:lib） |
| **freeze_id** | 2.2.0-W1 · D-* 已冻结（D-PINS-EXIT=exit 2 · D-SPEC-213-ROW=补索引行不建夹 · D-PINS-SCOPE-8=钉面#8 入 yaml · D-W2-ABS-PATH-UX=拒止+迁移指引 exit 1）· minor bump 至 2.2.0 不在本波 |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 本波为 CLI 新子命令 + 数据文件，不改架构图谱（00 §2 F1 架构冻结） |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 产品机制新增（pins 命令），非编码规范/流程增量 · 无 wiki 落点 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.1.2 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-11 会话预授权 · 00 代签落表 |
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-11 会话预授权 · 00 代签落表（D-* 已冻结采纳推荐） |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-11） |
| **HG-AUDIT-R1** | **approved** | 30 | 人 · 2026-09-11 会话预授权 · 00 代签落表 · 20-task-audit R1 pass（零阻塞 · 审查文 `task_2_2_closed_loop_w1_release_pins_audit_R1_20260911.md`） |

---

## 背景与目标

把「版本/身份钉」从人工纪律变成机械可验证：声明一次（`assets/release-pins.yaml` 数据），机器校验（`pins check`），偏差一键修复（`pins fix`），发版与 CI 门禁强制（接线）。根因：同版本偏差已反复发生 3 次以上（RELEASING.md 2.1.1/2.1.2/2.1.3 各滞后一次；docs/spec/README.md 至今无 2.1.3 行），不是「人忘了改」而是「没有机制强制」。本波是 2.2.0「声明 → 接线 → 可验证」主线第一步。

**已定案（冻结 · 不得翻案）**：

- **D-PINS-EXIT**：`pins check` 任一偏差 → **exit 2**（P0 门禁 failClosed 阻断档）。
- **D-SPEC-213-ROW**：`docs/spec/README.md` 补 2.1.3 patch 收尾索引行，**不建** `2_1_3-*` 夹。
- **D-PINS-SCOPE-8**：钉面 #8（docs/spec/README.md 当前 minor 索引行）提取语义「索引表存在当前 minor 对应行或标注行」作为**数据**写入 `release-pins.yaml`。
- **D-W2-ABS-PATH-UX**：属 W2 范围，本波仅知悉，不实现。

## 范围

- [x] 新建单一声明源 `assets/release-pins.yaml`（钉面 10 行全落数据：`id` / `path` / `extract` / `expected` / `required` / `fixable`；extract 表达式本身也是数据）
- [x] **已新增** `spec-wave pins check [--json]`（当前不存在）：干净树 exit 0 · 任一偏差 **exit 2**（D-PINS-EXIT）· `--json` 输出每落点 `path`/`expected`/`actual`/`status` · 偏差输出指出文件与行
- [x] **已新增** `spec-wave pins fix [--yes]`（当前不存在）：默认 dry-run · `--yes` 才写盘 · 写前备份（`.bak` 或等价）· **S2 目录机械拒写（非 warn · 无豁免参数）** · 只修 `fixable` 落点 · 真值源 #1 与 git #10 永不反向改 · 幂等
- [x] 门禁接线：`prepublishOnly` 现有链（`typecheck && test && build && test:lib`）之后追加 `pins check`；`.github/workflows/ci.yml` test job 增 `pins check` 步骤 + 补 `timeout-minutes`（当前缺失）
- [x] 补最后一处漂移：`docs/spec/README.md` 的 2.1.3 行（形态按 D-SPEC-213-ROW，见「验收标准」增补 ②）
- [x] 新增测试 `test/pins-consistency.test.ts`（钉面失配时**真失败**）
- [x] 钉面清单以 SPEC 01 §5 十行为准（package.json version/name/bin · ontology `product_semver` · discipline-coverage `as_of_package_version` · README 双语 `spec-wave@X.Y.Z` · RELEASING 现行包行 · docs/spec 索引 minor 行 · git tag `vX.Y.Z`）

## 非范围

| 项 | 理由 |
|----|------|
| 把落点硬编码进 TypeScript | 下次加落点又要改代码 = 没解决根因（PROMPT §4.a 明令；01 §4） |
| 资产 sha256 完整性清单 / `assets verify` | A2 · 属 2.3 |
| `ontology-check` 独立 CLI / 接 ontology 机检 | A4 · 属 3.0；本波只读 `product_semver` 字段值 |
| `delivery/promotion/*` 与 `package.json` 的 D0 未提交改动 | D0-PROT（00 §3）· 本波 `package.json` 仅允许 prepublishOnly 接线所需的精确编辑，**禁动** D0 的 description/keywords 改动语义，提交时精确 add |
| 改 `bin` 文件名 / 包名 | 沿袭 2.1.2 B-BIN-FILE=拒绝 |
| 给 `pins` 或任何既有门禁加 `--force` / `--allow-*` 绕过参数 | P0-GATE 硬纪律 · 拒设计 |
| minor bump 2.2.0 / tag / publish | 属后续发版波 · publish 仅人 |
| W2–W7 任何实现项 | 各自独立 task |

---

## 失败路径（failure_paths · 对齐 SPEC 01 §9）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-A1-01 | `release-pins.yaml` 缺失 / 语法坏 | `pins check` 非 0 退出 · 报错指文件（failClosed） | 是 | 报错含文件路径 |
| F-A1-02 | 钉面落点文件缺失且 `required=true` | 判偏差 · 非 0 · `--json` `status=missing` | 是 | 偏差列出缺失落点 |
| F-A1-03 | `fix` 无 `--yes` | dry-run · 零写盘 | 是 | 打印将改文件与 diff 摘要 |
| F-A1-04 | `fix` 目标落 S2 | **机械拒写** · 报错 · 不产生备份残留 | 是 | 拒写报错（无豁免参数） |
| F-A1-05 | git tag 缺失（钉面 #10） | check 报偏差 · fix 不动 git · 提示仅人操作 | 是 | 提示「git 操作仅人」 |
| F-A1-06 | 正则脆性致 README 提取失败 | 报 `extract_error` · failClosed · 不静默跳过 | 是 | 报错指文件与 extract 表达式 |
| F-A1-07 | CI 无 timeout 卡死 | 本波补 `timeout-minutes` 消解 | — | CI job 有超时时限 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（`npx spec-wave verify --task` 闸扫描阻断） | 是 | 须先 20-task-audit R1 + 人签 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑤ 逐字对齐 SPEC 01 §8 五条；⑥⑦ 为审查文 R1 非阻塞观察移交的增补项。

- [x] ① `npx spec-wave pins check` 在干净树上 **exit 0**。
- [x] ② **破坏性自证**：故意把 `assets/ontology.yaml#product_semver` 改成 `9.9.9` → `pins check` 必须**报错并指出该文件与行**；`pins fix --yes` 必须**改回 `2.1.3`**；交付报告须贴这两步的**实际命令与完整输出**。
- [x] ③ 新增测试 `test/pins-consistency.test.ts` 在钉面失配时**真的失败**——同样用上面的破坏法自证一次（贴真实输出）。
- [x] ④ `npm run typecheck` 0 错误；`npm test` 全通过（含新增测试）。
- [x] ⑤ **反向验证**：`pins fix` 不得把 S2 目录（`docs/tasks` / `docs/harness/reviews` / `docs/harness/invokes/by-task`）纳入可写范围——用一次实际尝试或测试证明它**拒写**（贴证据）。
- [x] ⑥ **增补（审查文非阻塞观察 2 移交）**：`docs/spec/README.md` 的 `2_2-closed-loop-start` 索引行状态列由 `draft · HG-SPEC-SIGNOFF=pending` 更新为 **signed**（人 · 2026-09-11 会话预授权 · 00 代签落表口径）。
- [x] ⑦ **增补（D-SPEC-213-ROW 定案）**：`docs/spec/README.md` 索引补 2.1.3 patch 收尾行，标注「2.1.3 · 溯源自动化 · patch · 属 `2_1_2-rename-closeout` 系列残留修复（git 8797b76 + 82fe0dc）· 无独立 SPEC 夹」；**不建** `2_1_3-*` 夹。
- [x] ⑧ 门禁接线自检：`package.json` `prepublishOnly` 链含 `pins check`；`.github/workflows/ci.yml` test job 含 `pins check` 步骤且有 `timeout-minutes`（贴 diff 摘要）。
- [x] ⑨ 四门绿：`npm run typecheck` → `npm test` → `npm run build` → `npm run test:lib`。
- [x] ⑩ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w1_release_pins.md` 通过。
- [x] ⑪ **提交边界**：禁 `git add -A`（工作区有 D0 未提交改动：`delivery/promotion/*` · `package.json` · `docs/spec/README.md` 等）；逐路径精确 `git add`；提交信息 `feat(2.2-W1): release pin check + fix`；D0 改动不裹挟进本波 commit。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_2-closed-loop-start/01_release_pins_v1.md`](../../spec/2_2-closed-loop-start/01_release_pins_v1.md)（**唯一蓝本** · §5 钉面 10 行 / §6 设计 / §8 验收 / §9 failure_paths）
3. [`docs/spec/2_2-closed-loop-start/00_policy_and_boundaries.md`](../../spec/2_2-closed-loop-start/00_policy_and_boundaries.md)（§3 硬纪律：S2 / P0-GATE / FACT-CARD / TEST-LOCK / D0-PROT）
4. [`docs/spec/2_2-closed-loop-start/README.md`](../../spec/2_2-closed-loop-start/README.md)（D-* 冻结定案）与 [`06_waves_and_acceptance_v1.md`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md)（W1 清单 + A-2.2-01–03）
5. [`docs/harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md`](../../harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md)（非阻塞观察 1–4）
6. `assets/harness/prompts/30-*.md`（帽条文）· `assets/standards/`（编码基线模板）
7. 现状文件：`package.json` · `.github/workflows/ci.yml` · `assets/ontology.yaml` · `assets/harness/discipline-coverage.yaml` · `README.md` / `README.zh-CN.md` · `RELEASING.md` · `docs/spec/README.md`
8. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w1_release_pins.md`（GATE_VERIFY · HG-AUDIT-R1=pending 时**拒开工**）

---

## 测试策略（Harness）

**test_strategy**: `required`

- 新增 `test/pins-consistency.test.ts`：覆盖钉面一致（绿）与失配（真失败）两向；含 S2 拒写反向用例与 `--json` 四字段断言。
- 破坏性自证为验收硬条款（验收 ②③），不接受口头声称。
- 改行为必联改断言（TEST-LOCK），禁止「半改仍全绿」。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| `assets/release-pins.yaml` | ✅ | 钉面 10 行全落数据（pin-01..pin-10 · id/path/extract/expected/required/fixable · 钉面#8 语义入 `extract.semantics` · D-PINS-SCOPE-8） |
| `pins check` / `pins fix` | ✅ | `src/cli-pins.ts`（新）+ `src/cli.ts` 接线；check 干净树 exit 0 / 偏差 exit 2 指出文件与行 / --json 四字段；fix 默认 dry-run · --yes 写盘 · 写前 `.bak` 备份 · S2 机械拒写（先判后写零残留）· 幂等 |
| 门禁接线（prepublishOnly + ci.yml） | ✅ | `package.json:40` 链尾 `&& node bin/specgate.js pins check`；`ci.yml` test job `timeout-minutes: 15` + `pins check` 步骤（build/test:lib 之后） |
| `test/pins-consistency.test.ts` | ✅ | 15 测 3 组：A 真实仓一致（失配真失败锚点）· B fixture 行为 10 测 · C 声明源数据形态 4 测 |
| docs/spec/README.md 两行（增补 ⑥⑦） | ✅ | ⑦ 2.1.3 patch 收尾行（无独立夹 · git 8797b76+82fe0dc 标注）；⑥ `2_2-closed-loop-start` 行 draft/pending → signed |
| 破坏性自证 + S2 反向验证输出 | ✅ | 真实命令与完整输出见「自检结论」与 invoke_20260911_30_40 |

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 2026-09-11 · 全部命令真实执行 · 完整输出见 invoke `invoke_20260911_30_40_2-2-closed-loop-w1-release-pins.md` 与交付汇报）

**验证命令与退出码**（cwd=仓根）：

| 命令 | exit | 结果 |
|------|------|------|
| `npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w1_release_pins.md` | 0 | VERIFY: PASS（开工前 GATE_VERIFY · HG-AUDIT-R1=approved 与声称一致） |
| `npx spec-wave pins check`（干净树） | 0 | `PINS: PASS · 10/10 落点一致` |
| 破坏 `assets/ontology.yaml#product_semver` → `9.9.9` 后 `npx spec-wave pins check` | **2** | `[mismatch] pin-03 assets/ontology.yaml:7 · actual="9.9.9" expected="2.1.3"`（指出文件与行） |
| 破坏态跑 `node --test --experimental-strip-types test/pins-consistency.test.ts` | **1** | 15 测 14 pass / **1 fail**（A组真实仓一致用例真失败 · 验收③） |
| `npx spec-wave pins fix`（无 --yes · 破坏态） | 0 | dry-run 打印将改 1 处 diff 摘要 · 零写盘 · 无 .bak（F-A1-03） |
| `npx spec-wave pins fix --yes`（破坏态） | 0 | 写回 `2.1.3` · 备份 `assets/ontology.yaml.bak` 留存写前旧值 |
| 复跑 `npx spec-wave pins check` | 0 | PINS: PASS（破坏-修复闭环） |
| 复跑 `npx spec-wave pins fix --yes` | 0 | `无偏差 · 0 处修改（幂等）` |
| S2 反向验证：fixture 声明 fixable 落点 `docs/tasks/evil.md` → `pins fix --yes` | **2** | `REFUSED · S2 拒写（机械 · 无豁免参数）` · 文件未改写 · 零备份残留（F-A1-04）；另由测试 B5 钉死 |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **421/421 pass**（含新增 pins-consistency 15 测） |
| `npm run build` | 0 | — |
| `npm run test:lib` | 0 | 4/4 pass |
| `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w1_release_pins.md` | 0 | 闸检查：未发现阻塞 |

**验收 ①–⑪ 全部 pass**（①②③⑤ 见上表破坏-修复链；④⑨ 四门绿；⑥⑦ docs/spec/README.md 两行已落；⑧ 接线 diff：package.json:40 链尾 + ci.yml timeout/pins 步骤；⑩ gate-check exit 0；⑪ D0 预提交 `a072c0d` 精确 5 路径 · 本波提交逐路径 add 无 `git add -A`）。

**已知未测项**：CI workflow 实跑（yaml 步骤与本地四门同源 · 本地等价已绿）；`pins` 不支持 pre-release 版本形态（仓史均纯 x.y.z · 超本波范围）。

### KPI

Task_KPI%: 100（验收 11/11 自证通过 · 四门绿 · 破坏-修复-S2 拒写三链实测 · 测试 15 测新增全绿）

---

## 思考轮（10-task）

### R0 · 证据

SPEC 01 为唯一蓝本（20-spec-audit R1 pass 零阻塞）；钉面 10 行前提校核 2026-09-11 全部实测复核有效；D-* 四项已冻结（README 待决表 + 审查文签闸节双出处）；01 §2 根因分析（同版本偏差 ≥3 次）成立。task 元信息字段对齐 `lintTaskFile`（E1–E8）与 verify pre-30 硬闸（required ∩ {10,20,00} = {10,00} 由本棒落盘，20 由审查棒补）。

### R1 · 范围

范围 = SPEC 01 §3 六项 + 审查文移交增补两项（⑥⑦）；非范围 = 01 §4 五类 + P0-GATE/D0-PROT/发版动作。增补 ⑥⑦ 均为文档级、属 W1 钉面机制同波落地（residual_risks 第三条：2.1.3 补行须与 pins 机制同波以免再滞后）。

### R2 · 方案

方案对比已在 SPEC 01 §7 定案（声明源 yaml 数据驱动 / exit 2 / S2 硬拒写 / patch 收尾行），本帽不重复比选，仅把定案转为可验收条款。task 结构选型：`required_invoke_hats=10,20,30,40,00` 显式列表（覆盖 full 帽面去 CLOSE）+ profile=default 双写；`close_pr_policy=exempt`（main 直推仓例）。

### R3 · 边界

30 开工硬边界 = HG-AUDIT-R1 翻 approved（本帽不签发）；提交边界 = 禁 `git add -A` + 精确 add（工作区实测有 D0 未提交改动 6 项）；S2/P0/FACT-CARD 三条硬纪律原样转入 failure_paths 与非范围。

### R4 · 可测性

验收 11 条全部可机械/可观测：exit 码断言、破坏-修复两步输出、测试真失败自证、四门命令、gate-check、grep 可查的接线 diff、git 提交边界检查。无「改完了」式条款。

### R5 · 派工就绪

task 结构满足 lint E1–E8；pre-30 invoke（10/00）落盘；簿记（SPEC 各文档闸表翻转）同棒完成。**下一棒**：20-task-audit R1 书面审（落盘 `docs/harness/reviews/` + invoke_\*_20_\*）→ 人签 HG-AUDIT-R1 → 30 派工。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC signed + 审查 R1 pass + D-* 冻结 + lint/verify 结构要求已核源） | no |
| R1 | 范围/非范围划定（01 §3/§4 + 增补 ⑥⑦） | no |
| R2 | 方案沿用 SPEC 定案 · task 结构选型定 | no |
| R3 | 边界三条（开工闸 / 提交 / 硬纪律）落入 task | no |
| R4 | 验收 11 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此（内容完备 · 无遗留阻塞） | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 已 signed 且审查零阻塞，方案层决策全部冻结，本帽职责（结构化转写 + 闸/invoke 配置）已闭合，无新增开放问题。  
**residual_risks**：① 钉面 #8 的「索引行存在性」提取语义依赖 ⑥⑦ 同波落地，若 30 只做机制不补行则 check 长红（缓解：验收 ⑥⑦ 列为硬性 checkbox）；② README 双语正则脆性（缓解：F-A1-06 failClosed + 正则入数据）；③ D0 未提交改动与 W1 提交混杂风险（缓解：验收 ⑪ + 00 §3 D0-PROT）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | 开单 · 10-task · 蓝本 SPEC 01（signed）· D-* 冻结值落入 · 增补验收 ⑥⑦（审查文非阻塞观察移交） |
| 2026-09-11 | W1 实现落地 · 30+40 闭环：release-pins.yaml + pins check/fix + 门禁接线 + pins-consistency 15 测 + spec README 两行 · 验收 ①–⑪ 自证全过（破坏-修复 · S2 拒写实测） |
