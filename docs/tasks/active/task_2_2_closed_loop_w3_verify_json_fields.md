# Task：2.2 W3 · `verify --json` 补可观测字段（C2）

> **状态**：`draft` · **wave**：W3  
> **关联 SPEC**：[`docs/spec/2_2-closed-loop-start/02_security_closure_v1.md`](../../spec/2_2-closed-loop-start/02_security_closure_v1.md) §W3（C2）· [`06_waves_and_acceptance_v1.md`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W3  
> **依赖**：无硬依赖（建议 W2 先落，避免 `--json` 与拒止路径输出改动相互打架）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-2-closed-loop-w3-verify-json-fields` |
| **test_strategy** | `required` |
| **test_strategy_note** | 四字段测试断言 + 既有字段回归断言；契约只增不改由 diff 级测试钉死 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | CLI JSON 输出字段增量；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | JSON 契约增量落 CHANGELOG；不晋升 coding_wiki |
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
| HG-AUDIT-R1 | **approved** | ~~30~~ | 人 · 2026-09-11 会话预授权 · 00 代签落表 · R1 pass（[`docs/harness/reviews/task_2_2_closed_loop_w3_verify_json_fields_audit_R1_20260911.md`](../../harness/reviews/task_2_2_closed_loop_w3_verify_json_fields_audit_R1_20260911.md)） |

---

## 背景与目标

`verify --json` 缺 `traceId` / `exitCode` / `source` / `injectedFiles`，而安全设计 §7.2 明文要求（事实卡 §11 亦列其为缺字段）。

**完成态行为**：`verify --json` 输出在既有字段之上**只增不改**地补四字段；traceId 为单次运行级标识（不接外部遥测 · 零云纪律）。

---

## 范围

- [ ] `verify --json` 补 `traceId`（单次运行标识）
- [ ] 补 `exitCode`（与进程退出码一致）
- [ ] 补 `source`（判定来源）
- [ ] 补 `injectedFiles`（注入文件清单）
- [ ] 测试断言四字段存在与语义 + 既有字段回归不变

## 非范围

- **契约只增不改**：既有字段名与语义不变（下游可能已消费 · F-W3-01）
- `audit --json`、审计落盘不做（C6 · 3.0）
- traceId 不接外部遥测（零云纪律）
- 落地前对外文案**仍不得**宣称 JSON 可观测性完整（事实卡 §11 禁称 · 发布后由事实卡维护者解除）

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| `--json` 改既有字段语义（F-W3-01） | 验收 FAIL · 契约只增不改 | — | — |
| `exitCode` 与进程实际退出码不一致 | 测试断言红 · 验收 FAIL | 是（修实现重跑） | 是 |
| traceId 试图接外部遥测/网络 | 拒设计（零云纪律）· 打回 | — | — |
| 对外文案提前宣称 JSON 可观测性完整 | 打回（事实卡 §11 · F-X-04） | — | — |

---

## 验收标准

- [ ] `verify --json` 输出含 `traceId` / `exitCode` / `source` / `injectedFiles` 四字段且有测试断言
- [ ] `exitCode` 字段值与进程退出码一致（测试断言）
- [ ] 既有字段回归不变（测试断言 · 契约只增不改）
- [ ] 对外文案零违禁宣称（grep 自查 · 事实卡 §11）
- [ ] `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` 四门绿（与 `.github/workflows/ci.yml` 一致 · 06 硬纪律 A-2.2-12）
- [ ] `npx --yes spec-wave task lint-wiki-delta --target .` 通过（wiki_delta 预检）
- [ ] 波末 `npx spec-wave gate-check --task <本 task>` 通过（HG-AUDIT-R1=approved 后）

---

## 给执行帽的必读列表

1. SPEC：[`02_security_closure_v1.md`](../../spec/2_2-closed-loop-start/02_security_closure_v1.md) §W3 · [`06`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W3 + A-2.2-06
2. `src/cli.ts` verify 命令 `--json` 输出组装点（30 自行定位 · 注意与 W2 拒止路径的 exit 码一致性）
3. 安全设计 §7.2 字段要求（SPEC 02 §W3 证据行所引）
4. 事实卡 `.workbuddy/output/推广事实卡-2.1.3.md` §11（禁称清单）

---

## 思考轮

### R0 · 证据

SPEC 02 §W3：缺四字段属实（PROMPT §3 W3 行 + 事实卡 §11 双源）。

### R1 · 范围

仅 `verify --json` 四字段增量；audit --json / 审计落盘 / 遥测均出范围。

### R2 · 方案

（30 前由 20 审复核：traceId 生成口径——进程内随机/时间戳基运行标识【荐 · 零依赖】vs 引入 uuid 依赖【弃 · 零云零依赖纪律】；injectedFiles 来源复用 verify 既有注入清单数据流【荐】。）

### R3 · 边界

契约只增不改 · 零云 · exitCode 必须与真实退出码同源（禁止两处各算）。

### R4 · 可测性

四字段存在性 + exitCode 一致性 + 旧字段回归三类断言先红后绿。

### R5 · 签收就绪

本槽由 20-task-audit R1 复核后判充分；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 双源证据一致 | no |
| R1 | 单命令四字段 · 最小增量 | no |
| R2 | 运行级标识零依赖（待 20 复核） | no |
| R3 | 契约只增不改 · exitCode 同源 | no |
| R4 | 三类断言先红后绿 | no |
| R5 | 待 20 审裁定 | no |

**residual_risks**：下游若已按字段序/字段全集做严格校验可能感知新增字段（缓解：CHANGELOG 明示新增四字段 · 属只增契约允许面）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 先可失败字段断言再改实现；旧字段回归必须仍绿。

---

## 提交信息约定

- 提交信息：`feat(2.2-W3): …`（独立提交 · 前缀不变）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟 D0 未提交改动**（`delivery/promotion/` 4 份 + `package.json` description/keywords · F-X-06 / D0-PROT）
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w3_verify_json_fields.md`

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
