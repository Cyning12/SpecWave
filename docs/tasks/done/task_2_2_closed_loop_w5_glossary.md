# Task：2.2 W5 · 双语 GLOSSARY.md（D2）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-11） · **wave**：W5  
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

- [x] 仓根新增 `GLOSSARY.md`（双语：中英分节或双栏，与 README 双语风格一致）
- [x] 覆盖 4 组概念：`task.md`/`spec.md` · `Harness` · `hat` · `kit-*`
- [x] 覆盖事实卡 §12 既定中文术语：门禁 / 过程轨 / 帽制 / 人闸 / 真值源 等
- [x] README 双语首屏（首 30 行内）链接 `GLOSSARY.md`
- [x] 与 W4 README「核心对象」节互链（不重复展开定义）

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

- [x] `GLOSSARY.md` 存在且 4 组概念齐备、双语条目一一对齐
- [x] README 双语首屏（首 30 行内）链接可解析
- [x] 术语口径与事实卡 §12 保留词（门禁 / 过程轨 / 帽制 / 人闸 / 真值源）一致
- [x] 无事实卡 §10/§11 违禁表述 · 无无出处数字（grep 自查）
- [x] 与 W4 核心对象节互链有效
- [x] `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` 四门绿（与 `.github/workflows/ci.yml` 一致 · 06 硬纪律 A-2.2-12）
- [x] `npx --yes spec-wave task lint-wiki-delta --target .` 通过（wiki_delta 预检）
- [x] 波末 `npx spec-wave gate-check --task <本 task>` 通过（HG-AUDIT-R1=approved 后）

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

（30/40 同 Agent 闭环 · 2026-09-11 · 全部命令真实执行 · 完整输出见 invoke `invoke_20260911_30_40_2-2-closed-loop-w5-glossary.md` 与交付汇报）

**实现摘要**：仓根新增 `GLOSSARY.md`（中英分节双语 · 4 组首小时概念 `task.md`/`spec.md` · `Harness` · `hat`（帽制 8 帽两组）· `kit-*` + 事实卡 §12 保留词组：门禁 / 人闸 / 过程轨 / 帽制 / 真值源 / S2 · 双语 `###` 条目 5+5 一一对齐 · 回链 README「核心对象」节锚点不重复定义）；`README.md` / `README.zh-CN.md` 首屏（第 9 行 blockquote 内）各加 GLOSSARY 链接 1 处，并把 W4 留的「lands with wave W5 先行链」口径改为已落地互链文案（互链闭合）。

**验证命令与退出码**（cwd=仓根）：

| 命令 | exit | 结果 |
|------|------|------|
| `npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w5_glossary.md`（开工前 GATE_VERIFY） | 0 | VERIFY: PASS · HG-TASK-DRAFT/HG-AUDIT-R1 均 approved 与声称一致 |
| GLOSSARY 关键条目 grep | 0 | `task.md`×6 · `spec.md`×6 · `Harness`×4 · `hat`×12 · `kit-*`×2（4 组齐备） |
| §12 保留词 grep | 0 | 门禁×4 · 过程轨×4 · 帽制×5 · 人闸×4 · 真值源×3 |
| 双语条目对齐：`grep -c "^### " GLOSSARY.md` | 0 | 10 = EN 5 + ZH 5（同名条目一一对齐） |
| README 首屏链接：`head -30 README{,.zh-CN}.md \| grep GLOSSARY.md` | 0 | 双语各命中第 9 行（首 30 行内）· 目标 `GLOSSARY.md` 存在 |
| 互链回链 grep | 0 | GLOSSARY 含 `README.md#core-objects` ×2 + `README.zh-CN.md#核心对象` ×2（回链 W4 核心对象节） |
| 先行链残留：`grep "lands with wave W5\|随 W5 落地" README×2 GLOSSARY` | 0 | 零残留（NO-STALE-FORWARD-LINK） |
| 事实卡 §10 黑名单 grep（dsh-coding-kit/SpecGate/60+ 测试/1.10.0） | 0 | GLOSSARY CLEAN |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **447/447 pass**（基线 447 · 纯文档面无新增测试 · 48.9s） |
| `npm run build` | 0 | — |
| `npm run test:lib` | 0 | 4/4 pass |
| `npx --yes spec-wave task lint-wiki-delta --target .` | 0 | LINT-WIKI-DELTA: PASS · scanned 54 · missing 0 · issues 0 |
| `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w5_glossary.md`（波末） | 0 | 闸检查：未发现阻塞 |

**验收 8 条全部 pass**（4 组概念齐备双语对齐 · 首屏链接可解析 · §12 保留词口径一致 · §10/§11 零违禁零无出处数字（8 帽/4+4、4 人闸、exit 2 均出自事实卡 §4/§5）· W4 互链闭合 · 四门绿 · lint-wiki-delta · 波末 gate-check）。

**事实卡自查**：无 §10 黑名单（产品名 SpecWave · 命令 `npx spec-wave`）；无 §11 禁称（门禁明确写「CLI 进程内判定 · 不依赖宿主 hook」· 未提 hooks 强制注入/审计落盘/provenance/本体机检等未落地能力）；§12 中文术语保留词（门禁/过程轨/帽制/人闸/真值源）全部按既定口径使用。

**已知未测项**：GitHub 渲染后锚点跳转（`#core-objects` / `#核心对象` 按 GitHub slugify 规则推导 · 相对链接目标文件在仓内存在已实证）；CI workflow 实跑（本地四门与 CI 同源已绿）。

---

### KPI（00）

Task_KPI%: 100（验收 8/8 自证通过 · 四门绿 · 447/447 测试全绿 · 文档面 grep 断言全中（4 组概念 · 双语 5+5 对齐 · 首屏链接 · 保留词 · 零违禁）· W4 先行链互链闭合 · 事实卡 §10/§11/§12 零违禁）

---

### 经验总结

1. **互链不复制是防漂移的结构性手段**：`task.md`/`spec.md` 定义只在 README「核心对象」节维护一份，GLOSSARY 以锚点回链（`README.md#core-objects` / `README.zh-CN.md#核心对象`）——本波只动 3 个文件即闭合 W4↔W5 三处互链，定义无第二真值源。
2. **「先行链 + 未落地口径」的收尾方动作要小而准**：W5 作为后落地一方，除新增 GLOSSARY 外只需把 W4 的「lands with wave W5」 caveat 改为已落地文案 + 首屏补链；grep 残留断言（`lands with wave W5` 零命中）把「闭合」变成可机检事实。
3. **术语表的数字纪律同代码**：帽制 8 帽（4+4）、人闸 4 个、exit 2 全部只引事实卡 §4/§5 已实测口径，不新造任何数字；§11 反向用法有效——把「门禁不依赖宿主 hook」写进定义本身，既准确又预防读者误推 hooks 强制注入。
4. **中英分节单文件适配「成对术语」场景**：README 双语是分文件（整篇镜像），GLOSSARY 选中英分节（条目级镜像）——`grep -c "^### "` 5+5 即对齐断言，比双栏表格易维护（R2 荐 · 20 审 R1 pass 确认）。
5. **wiki_delta 作答**：`none` —— GLOSSARY.md 属仓根对外文档（非 coding_wiki 晋升对象），术语口径以事实卡 §12 为准（与元信息 `wiki_delta_note` 一致 · stable 判定由 CLOSE 棒复核）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-11 | 初稿 · 10-task 批量拆波（W2–W7 每波一份 · 00 委派）· 预填 Harness 元信息 + wiki_delta |
| 2026-09-11 | W5 实现落地 · 30+40 闭环：仓根 GLOSSARY.md（中英分节 · 4 组概念 + §12 保留词 · 双语 5+5 对齐 · 回链 README 核心对象节）+ README 双语首屏链接 + W4 先行链口径闭合 · 验收 8/8 自证全过 |
