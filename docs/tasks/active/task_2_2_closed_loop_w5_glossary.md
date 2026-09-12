# Task：2.2 W5 · 双语 GLOSSARY.md（D2）

> **状态**：`draft` · **wave**：W5  
> **关联 SPEC**：[`docs/spec/2_2-closed-loop-start/03_dx_onboarding_v1.md`](../../spec/2_2-closed-loop-start/03_dx_onboarding_v1.md) §W5（D2）· [`06_waves_and_acceptance_v1.md`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W5  
> **依赖**：无硬依赖；W4 README 核心对象节互链对端（双向互链以先落地一方先链、后落地一方补链，或同波合并前对齐）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-2-closed-loop-w5-glossary` |
| **test_strategy** | `recommended` |
| **test_strategy_note** | SPEC 03 头部口径：文档面 = 抽检 + 链接与文本断言（4 组概念齐备 · 双语条目一一对齐 · README 首屏链接可解析 · 事实卡保留词一致 · 零违禁表述抽查） |
| **code_quality_bar** | `recommended` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 纯文档面（仓根 GLOSSARY.md + README 首屏链接）；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | GLOSSARY.md 属仓根对外文档（非 coding_wiki 晋升对象）；术语口径以事实卡 §12 为准 |
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
| HG-AUDIT-R1 | **approved** | ~~30~~ | 人 · 2026-09-11 会话预授权 · 00 代签落表 · R1 pass（[`docs/harness/reviews/task_2_2_closed_loop_w5_glossary_audit_R1_20260911.md`](../../harness/reviews/task_2_2_closed_loop_w5_glossary_audit_R1_20260911.md)） |

---

## 背景与目标

全仓无对外术语表（前提校核 #14 复核：仓根 / `docs/` 无 `GLOSSARY.md`）；4 组首小时必懂概念完全无解释：`task.md`/`spec.md` · `Harness` · `hat` · `kit-*`。

**完成态行为**：仓根 `GLOSSARY.md` 双语覆盖 4 组概念 + 事实卡 §12 保留词；README 双语首屏（首 30 行内）链接可解析。

---

## 范围

- [ ] 仓根新增 `GLOSSARY.md`（双语：中英分节或双栏，与 README 双语风格一致）
- [ ] 覆盖 4 组概念：`task.md`/`spec.md` · `Harness` · `hat` · `kit-*`
- [ ] 覆盖事实卡 §12 既定中文术语：门禁 / 过程轨 / 帽制 / 人闸 / 真值源 等
- [ ] README 双语首屏（首 30 行内）链接 `GLOSSARY.md`
- [ ] 与 W4 README「核心对象」节互链（不重复展开定义）

## 非范围

- 不改 `docs/roadmap/` 目录名（D5 · 2.3）
- 不做报错国际化（D4 · 2.3）
- 不引入无出处数字 / 未落地能力描述（FACT-CARD 硬纪律 · F-W5-01b）
- 不重复 W4 核心对象节正文（互链不复制）

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| 术语与事实卡保留词冲突（F-W5-01） | 验收 FAIL | 是（对齐后重验） | — |
| GLOSSARY 引入无出处数字/未落地能力（F-W5-01b） | 验收 FAIL（FACT-CARD 硬纪律） | 是 | — |
| README 首屏链接不可解析（相对路径错） | 验收 FAIL | 是（修链接重验） | 是 |
| 双语条目未一一对齐 | 验收 FAIL · 对齐后重验 | 是 | — |
| 与 W4 核心对象节定义口径冲突 | 打回 · 以先落地一方为准对齐或同波协商 | 是 | — |

---

## 验收标准

- [ ] `GLOSSARY.md` 存在且 4 组概念齐备、双语条目一一对齐
- [ ] README 双语首屏（首 30 行内）链接可解析
- [ ] 术语口径与事实卡 §12 保留词（门禁 / 过程轨 / 帽制 / 人闸 / 真值源）一致
- [ ] 无事实卡 §10/§11 违禁表述 · 无无出处数字（grep 自查）
- [ ] 与 W4 核心对象节互链有效
- [ ] `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` 四门绿（与 `.github/workflows/ci.yml` 一致 · 06 硬纪律 A-2.2-12）
- [ ] `npx --yes spec-wave task lint-wiki-delta --target .` 通过（wiki_delta 预检）
- [ ] 波末 `npx spec-wave gate-check --task <本 task>` 通过（HG-AUDIT-R1=approved 后）

---

## 给执行帽的必读列表

1. SPEC：[`03_dx_onboarding_v1.md`](../../spec/2_2-closed-loop-start/03_dx_onboarding_v1.md) §W5 · [`06`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W5 + A-2.2-08
2. 事实卡 `.workbuddy/output/推广事实卡-2.1.3.md` §10/§11/§12（禁称清单 + 保留词）
3. `README.md` / `README.zh-CN.md` 首屏现状（双语风格参照）
4. W4 task：[`task_2_2_closed_loop_w4_dx_onboarding.md`](task_2_2_closed_loop_w4_dx_onboarding.md)（互链对端）

---

## 思考轮

### R0 · 证据

SPEC 03 §W5 证据节（前提校核 #14 复核无 GLOSSARY · 4 组概念无解释）。

### R1 · 范围

仅仓根 GLOSSARY + README 首屏链接；roadmap 改名 / 报错 i18n / 定义复制均出范围。

### R2 · 方案

（30 前由 20 审复核：双语形态——中英分节【荐 · 与 README 双语分文件风格最接近】vs 双栏表格【备选 · 条目多时难维护】；条目排序按首小时学习路径【荐】。）

### R3 · 边界

FACT-CARD 硬纪律：零违禁表述 · 零无出处数字 · 保留词口径以事实卡 §12 为唯一真值。

### R4 · 可测性

抽检 + 链接/文本断言（4 组概念关键词存在性 · README 首屏链接正则 · 保留词对照表）。

### R5 · 签收就绪

本槽由 20-task-audit R1 复核后判充分；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 缺口证据属实 | no |
| R1 | 单文件 + 首屏链接 · 最小面 | no |
| R2 | 中英分节（待 20 复核） | no |
| R3 | 事实卡 §12 为唯一真值 | no |
| R4 | 抽检 + 链接断言 | no |
| R5 | 待 20 审裁定 | no |

**residual_risks**：与 W4 并行时互链对端暂不存在（同 W4 residual · 后落地一方补链）；术语口径未来若事实卡改版须同步（留痕于修订记录即可）。

---

## 测试策略（Harness）

**test_strategy**: `recommended` —— 文档面抽检 + 链接与文本断言（SPEC 03 头部口径）；无实现代码改动，四门中 typecheck/build 预期无感。

---

## 提交信息约定

- 提交信息：`feat(2.2-W5): …`（独立提交 · 前缀不变）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟 D0 未提交改动**（`delivery/promotion/` 4 份 + `package.json` description/keywords · F-X-06 / D0-PROT）
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w5_glossary.md`

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
