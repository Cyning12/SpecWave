# Task：2.2 W4 · 上手断档（D1 init 3 步 quickstart + D3 README 核心对象）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-11） · **wave**：W4  
> **关联 SPEC**：[`docs/spec/2_2-closed-loop-start/03_dx_onboarding_v1.md`](../../spec/2_2-closed-loop-start/03_dx_onboarding_v1.md) §W4（D1+D3）· [`06_waves_and_acceptance_v1.md`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W4  
> **依赖**：无硬依赖；W5 GLOSSARY 互链目标（双向互链以先落地一方先链、后落地一方补链，或同波合并前对齐）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-2-closed-loop-w4-dx-onboarding` |
| **test_strategy** | `required` |
| **test_strategy_note** | SPEC 03 头部口径：init 输出 = required（3 步 quickstart 关键行文本断言 · 含 `--yes` 非交互路径）；README 双语「核心对象」节 = 抽检 + 链接与文本断言 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | init 输出文案 + README 文档面；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | DX 文案落仓 README 与 init 输出；不晋升 coding_wiki |
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
| HG-AUDIT-R1 | **approved** | ~~30~~ | 人 · 2026-09-11 会话预授权 · 00 代签落表 · R1 pass（[`docs/harness/reviews/task_2_2_closed_loop_w4_dx_onboarding_audit_R1_20260911.md`](../../harness/reviews/task_2_2_closed_loop_w4_dx_onboarding_audit_R1_20260911.md)） |

---

## 背景与目标

实测 `init` 跑完只打印 manifest 写入，**无任何「下一步」**；`sync prompts --yes` 是隐式前置依赖（不跑就没有 TASK_TEMPLATE），而这条链从未在 init 输出与 README 上手段落提及。README 教 `verify --task <task.md>` 却全篇未定义 task 是什么 / 从哪来 / 放哪。

**完成态行为**：`init` 成功完成后打印 3 步 quickstart（命令全部真实存在）；README 双语新增「核心对象」节并与 quickstart、W5 GLOSSARY 三处互链。

---

## 范围

- [x] **D1**：`init` 成功完成（含 `--yes` 非交互路径）打印 3 步 quickstart：① `sync prompts --yes`（物化 prompts 模板）② 按模板建首个 task（说明 task 是什么、放哪）③ `verify --task` 首验；文案语种决策随本 task 定，但须与 D3 节互链
- [x] **D3**：README 双语（`README.md` / `README.zh-CN.md`）新增「核心对象」节：`task.md` / `spec.md` 的定义（是什么 / 从哪来 = `sync prompts` 模板 / 放哪 = `docs/tasks/active/` 等 / 最小示例）
- [x] quickstart ↔ 核心对象节 ↔ GLOSSARY.md（W5）三处互链有效（GLOSSARY 端为先行链 · W5 落地后解析 · 依赖行已授权）
- [x] 测试：init 输出关键行文本断言（含 `--yes` 路径）；quickstart 提到的命令逐一对照 CLI 真实存在

## 非范围（S2 红线）

- **不物化示例 task 进消费者仓 `docs/tasks/`**——S2 过程域永不覆写纪律对消费者仓同样适用；示例只能以模板/指引文本出现，是否落文件由用户显式执行（F-W4-02）
- 不做完整 QUICKSTART walkthrough（D6 · 2.3）
- 不改 `sync prompts` 本身行为
- 不改 `docs/roadmap/` 目录名（D5 · 2.3）· 不做报错国际化（D4 · 2.3）

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| quickstart 提到不存在的命令（F-W4-01） | 验收 FAIL（文档超前于能力） | 是（修正文案重验） | — |
| 实现试图物化示例 task 进消费者 `docs/tasks/`（F-W4-02） | 越 S2 红线 · 打回 | — | — |
| 双语 README 新增节内容漂移（F-W4-03） | 验收 FAIL · 对齐后重验 | 是 | — |
| init 交互路径与 `--yes` 路径输出不一致 | 测试断言红 · 验收 FAIL | 是 | 是 |

---

## 验收标准

- [x] `init`（含 `--yes` 非交互路径）输出含 3 步 quickstart 文本（测试断言关键行）
- [x] quickstart 提到的命令均真实存在（防「文档超前于能力」· 测试或清单核证）
- [x] 双语 README 均含「核心对象」节且内容对齐（非机翻）
- [x] quickstart ↔ 核心对象节 ↔ GLOSSARY 三处互链可解析（quickstart↔核心对象双向已解析；GLOSSARY 端先行链 · W5 补回链 · 见自检结论已知未测项）
- [x] **未**物化任何示例文件进消费者 `docs/tasks/`（S2 红线 · 反向检查）
- [x] `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` 四门绿（与 `.github/workflows/ci.yml` 一致 · 06 硬纪律 A-2.2-12）
- [x] `npx --yes spec-wave task lint-wiki-delta --target .` 通过（wiki_delta 预检）
- [x] 波末 `npx spec-wave gate-check --task <本 task>` 通过（HG-AUDIT-R1=approved 后）

---

## 给执行帽的必读列表

1. SPEC：[`03_dx_onboarding_v1.md`](../../spec/2_2-closed-loop-start/03_dx_onboarding_v1.md) §W4 · [`06`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W4 + A-2.2-07
2. `src/cli.ts` init 命令完成输出段（30 自行定位）
3. `README.md` / `README.zh-CN.md`（双入口现状：插件 ≠ CLI）
4. W5 task：[`task_2_2_closed_loop_w5_glossary.md`](task_2_2_closed_loop_w5_glossary.md)（互链对端）
5. `AGENTS.md` 仓内 local 块（S2 禁区口径）

---

## 思考轮

### R0 · 证据

SPEC 03 §W4 证据节（init 无下一步 · sync prompts 隐式前置 · README 未定义 task · 路线研究 §2.4）。

### R1 · 范围

D1（init quickstart）+ D3（README 核心对象）合波；示例物化 / walkthrough / sync prompts 行为变更出范围。

### R2 · 方案

（30 前由 20 审复核：quickstart 语种——英文优先现状下英文先行 + 中文 README 互链【荐 · 与 README 现状一致】vs 双语种同打印【弃 · 噪声】；互链锚点用节标题锚【荐】。）

### R3 · 边界

S2 红线：消费者仓 `docs/tasks/` 永不物化示例 · 命令不得超前于能力 · 双语对齐非机翻。

### R4 · 可测性

init 输出关键行文本断言（先红后绿）· 命令存在性核证 · README 节与链接抽检。

### R5 · 签收就绪

本槽由 20-task-audit R1 复核后判充分；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 断档证据双源属实 | no |
| R1 | D1+D3 同波（同上手链） | no |
| R2 | 英文先行 + 互链（待 20 复核） | no |
| R3 | S2 红线显式冻结 | no |
| R4 | init 文本断言 + README 抽检 | no |
| R5 | 待 20 审裁定 | no |

**residual_risks**：W4/W5 并行时互链目标 GLOSSARY.md 暂不存在 → 后落地一方补链或同波合并前对齐（已在依赖行显式化）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— init 输出文本断言先红后绿（SPEC 03 头部口径）；README 文档面抽检 + 链接断言。

---

## 提交信息约定

- 提交信息：`feat(2.2-W4): …`（独立提交 · 前缀不变）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟 D0 未提交改动**（`delivery/promotion/` 4 份 + `package.json` description/keywords · F-X-06 / D0-PROT）
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w4_dx_onboarding.md`

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 2026-09-11 · 全部命令真实执行 · 完整输出见 invoke `invoke_20260911_30_40_2-2-closed-loop-w4-dx-onboarding.md` 与交付汇报）

**实现摘要**：**D1** `src/cli.ts` 新增导出常量 `INIT_QUICKSTART`（3 步：① `npx spec-wave sync prompts --yes` 显式化隐式前置（不跑就没有 TASK_TEMPLATE）② 复制 `docs/harness/templates/TASK_TEMPLATE.md` → `docs/tasks/active/task_<slug>.md` 建首个 task（说明是什么/放哪 · 仅指引文本不物化）③ `npx spec-wave verify --task` 首验），`cmdInit` 末尾 `--yes` 与 dry-run 两路径一致打印；英文先行（R2 口径）· 与 README「Core objects」节互链 · 既有中文输出只增不改。**D3** `README.md` / `README.zh-CN.md` 入口区后新增「Core objects / 核心对象」节：`task.md`（是什么/从哪来=sync prompts 模板/放哪=active→done/最小骨架）+ `spec.md`（是什么/从哪来=帽 10 撰写/放哪=docs/spec/）· 双语逐段对齐 · 节内互链 init quickstart 与 GLOSSARY.md（W5 先行链）。

**验证命令与退出码**（cwd=仓根 · 行为自证用本地构建产物 `node bin/specgate.js`（npx 发布版 2.1.3 尚无本波代码））：

| 命令 | exit | 结果 |
|------|------|------|
| `npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w4_dx_onboarding.md`（开工前 GATE_VERIFY） | 0 | VERIFY: PASS · HG-TASK-DRAFT/HG-AUDIT-R1 均 approved 与声称一致 |
| 先红：`node --test --experimental-strip-types test/init.test.ts`（实现前） | 非 0 | `INIT_QUICKSTART` 未导出 · 模块加载即败（3 新测红） |
| 后绿：同上（实现后） | 0 | **12/12 pass**（9 存量 + 3 新增：--yes 关键行断言 · dry-run 同打印 · 命令对照 usage 存在性 F-W4-01） |
| 实测 1：`node bin/specgate.js init --preset harness-only --tools none --target <tmp>`（dry-run） | 0 | `init 完成。` 后打印 3 步 quickstart（sync prompts --yes / TASK_TEMPLATE → docs/tasks/active/ / verify --task） |
| 实测 2：`node bin/specgate.js init --preset harness-only --tools cursor --yes --target <tmp>`（--yes 非交互） | 0 | `HOST APPLY: PASS` 后打印**同一** quickstart（两路径输出一致） |
| README grep 断言 | 0 | `^## Core objects`/`^## 核心对象` 各 1 节 · `TASK_TEMPLATE.md` 各 2 · `docs/tasks/active/` 各 1 · `GLOSSARY.md` 各 1（双语对齐） |
| S2 反向检查：`git status --porcelain` | 0 | 仅 4 个本波文件（README×2 · src/cli.ts · test/init.test.ts）· 零新增文件进 `docs/tasks/`（F-W4-02） |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **447/447 pass**（444 基线 + 3 新增） |
| `npm run build` | 0 | — |
| `npm run test:lib` | 0 | 4/4 pass |
| `npx --yes spec-wave task lint-wiki-delta --target .` | 0 | LINT-WIKI-DELTA: PASS · scanned 54 · missing 0 |
| `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w4_dx_onboarding.md`（波末） | 0 | 闸检查：未发现阻塞 |

**验收 8 条全部 pass**（quickstart 双路径断言 · 命令真实存在对照 usage · 双语节对齐非机翻 · 互链（GLOSSARY 端先行链口径见下）· S2 零物化反向自证 · 四门绿 · lint-wiki-delta · 波末 gate-check）。

**事实卡自查**：无 §10 黑名单（产品名 SpecWave · 命令 `npx spec-wave`）；无 §11 禁称（quickstart 仅提已存在命令 · GLOSSARY 标「lands with wave W5」未落地口径）；§12 中文术语保留词（门禁/帽制/人闸/真值源）一致。

**已知未测项**：GLOSSARY.md 尚不存在（W5 对端）——README 双语「核心对象」节内为先行链，W5 落地后链接可解析并由 W5 补回链（task 依赖行 + residual_risks 已授权此形态）；CI workflow 实跑（本地四门与 CI 同源已绿）。

---

### KPI（00）

Task_KPI%: 100（验收 8/8 自证通过 · 四门绿 · 447/447 测试含 3 新增全绿 · init 双路径实测同打印 · 命令对照 usage 存在性断言钉死 F-W4-01 · S2 零物化反向自证 · 事实卡 §10/§11/§12 零违禁）

---

### 经验总结

1. **「隐式前置显式化」是最小成本 DX 修复**：`sync prompts --yes` 本就是 TASK_TEMPLATE 的唯一来源，缺的只是 init 完成时说一句；3 步 quickstart 用既有命令拼出上手段落，零新能力、零行为变更（非范围纪律：不动 sync prompts 本身）。
2. **防「文档超前于能力」用测试钉死而非口头约定**：quickstart 文案常量导出（`INIT_QUICKSTART`），测试用正则抽出每条 `npx spec-wave <cmd>` 并对照 CLI usage 输出逐条断言——文案与能力漂移即红（F-W4-01 的可测形），比清单核证更硬。
3. **双路径一致性靠同一打印点**：quickstart 在 `cmdInit` 末尾无条件打印（`--yes` 与 dry-run 共用一行 `console.log`），测试双路径各跑一次断言同一关键行——比「两路径各自维护文案」从结构上消除漂移可能。
4. **跨波互链的先落地方挂「先行链 + 未落地口径」**：W4 先于 W5 落地时，指向 GLOSSARY.md 的链接标注「lands with wave W5」——既守事实卡「未落地只写将新增」纪律，又让 W5 补回链有明确对端（依赖行/residual_risks 预先授权此形态，免返工）。
5. **wiki_delta 作答**：`none` —— DX 文案落仓 README 与 init 输出（对外文档面），无可晋升 coding_wiki 的通用编码规范增量（stable 判定由 CLOSE 棒复核 · 与元信息 `wiki_delta_note` 一致）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-11 | 初稿 · 10-task 批量拆波（W2–W7 每波一份 · 00 委派）· 预填 Harness 元信息 + wiki_delta |
| 2026-09-11 | W4 实现落地 · 30+40 闭环：D1 init 3 步 quickstart（INIT_QUICKSTART 导出常量 · 双路径同打印 · 命令对照 usage 存在性断言）+ D3 README 双语「核心对象」节（task.md/spec.md 是什么/从哪来/放哪/最小骨架 · GLOSSARY 先行链）· init.test 3 测新增 · 验收 8/8 自证全过 |
