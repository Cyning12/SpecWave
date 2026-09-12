# Task：2.2 W4 · 上手断档（D1 init 3 步 quickstart + D3 README 核心对象）

> **状态**：`draft` · **wave**：W4  
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

- [ ] **D1**：`init` 成功完成（含 `--yes` 非交互路径）打印 3 步 quickstart：① `sync prompts --yes`（物化 prompts 模板）② 按模板建首个 task（说明 task 是什么、放哪）③ `verify --task` 首验；文案语种决策随本 task 定，但须与 D3 节互链
- [ ] **D3**：README 双语（`README.md` / `README.zh-CN.md`）新增「核心对象」节：`task.md` / `spec.md` 的定义（是什么 / 从哪来 = `sync prompts` 模板 / 放哪 = `docs/tasks/active/` 等 / 最小示例）
- [ ] quickstart ↔ 核心对象节 ↔ GLOSSARY.md（W5）三处互链有效
- [ ] 测试：init 输出关键行文本断言（含 `--yes` 路径）；quickstart 提到的命令逐一对照 CLI 真实存在

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

- [ ] `init`（含 `--yes` 非交互路径）输出含 3 步 quickstart 文本（测试断言关键行）
- [ ] quickstart 提到的命令均真实存在（防「文档超前于能力」· 测试或清单核证）
- [ ] 双语 README 均含「核心对象」节且内容对齐（非机翻）
- [ ] quickstart ↔ 核心对象节 ↔ GLOSSARY 三处互链可解析
- [ ] **未**物化任何示例文件进消费者 `docs/tasks/`（S2 红线 · 反向检查）
- [ ] `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` 四门绿（与 `.github/workflows/ci.yml` 一致 · 06 硬纪律 A-2.2-12）
- [ ] `npx --yes spec-wave task lint-wiki-delta --target .` 通过（wiki_delta 预检）
- [ ] 波末 `npx spec-wave gate-check --task <本 task>` 通过（HG-AUDIT-R1=approved 后）

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

（30/40 回填 · 四门验证表 + dogfood 实测）

---

### KPI（00）

（`kpi_aggregator: CLOSE` · 关账回填）

---

### 经验总结

（`experience_capture: recommended` · 关账回填）

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-11 | 初稿 · 10-task 批量拆波（W2–W7 每波一份 · 00 委派）· 预填 Harness 元信息 + wiki_delta |
