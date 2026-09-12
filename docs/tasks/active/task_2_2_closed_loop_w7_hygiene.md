# Task：2.2 W7 · 工程健康小清理（E1 HARNESS_META_HEADING 常量 + C7 dest 白名单显式化）

> **状态**：`draft` · **wave**：W7  
> **关联 SPEC**：[`docs/spec/2_2-closed-loop-start/05_hygiene_v1.md`](../../spec/2_2-closed-loop-start/05_hygiene_v1.md)（E1+C7 全篇）· [`06_waves_and_acceptance_v1.md`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W7  
> **依赖**：无硬依赖（纯内部重构 · 建议排后减少与 W2/W3 同文件冲突）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-2-closed-loop-w7-hygiene` |
| **test_strategy** | `required` |
| **test_strategy_note** | 行为无回归为第一验收：406 用例全绿 + 输出字节无漂移；grep 归零机械可验 |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 内部常量抽取与白名单显式化；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 纯内部重构无对外语义变更；不晋升 coding_wiki |
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
| HG-AUDIT-R1 | **approved** | ~~30~~ | 人 · 2026-09-11 会话预授权 · 00 代签落表 · R1 pass（[`docs/harness/reviews/task_2_2_closed_loop_w7_hygiene_audit_R1_20260911.md`](../../harness/reviews/task_2_2_closed_loop_w7_hygiene_audit_R1_20260911.md)） |

---

## 背景与目标

`## Harness 元信息` 字面量在 `src/` **4 文件重复 18 处**（前提校核 #12 实测：cli-checks 5 · cli 2 · cli-shared 8 · cli-task-extra 3）；dest 白名单（T-16）当前隐式散落。

**完成态行为**：`HARNESS_META_HEADING` 单一常量替换全部 18 处字面量；dest 白名单（`.coding-kit` · `.dsh/coding-kit`）显式化为常量集，供 init / host apply / 写盘路径判定统一消费；行为与输出字节零漂移。

---

## 范围

- [ ] **E1**：抽 `HARNESS_META_HEADING` 单一常量（集中 `src/cli-shared.ts` 导出 · SPEC R2 已采纳），替换全部 18 处字面量
- [ ] **C7**：dest 白名单显式化为常量/常量集：`.coding-kit` · `.dsh/coding-kit`，供 init / host apply / 写盘路径判定统一消费
- [ ] `.cyning-harness` **显式排除**并加代码注释「legacy 只读探测」（事实卡 §4/§10）
- [ ] typecheck 0 错 0 警 · 406 用例全绿 · 输出字节无漂移验证

## 非范围

| 项 | 理由 |
|----|------|
| 拆 god-file（cli-host 1450 / cli 1105 / cli-checks 844 行） | E4 · 3.0 |
| 测试 spawn 削减（354 次） | E3 · 3.0 |
| `.cyning-harness` 入白名单 | 仅 legacy 只读探测 · 显式排除并加注释 |
| `isS2RelPath` 无调用方清理 | 2.3 工程健康波 |
| 任何行为/输出变更 | 纯重构 · 输出字节零漂移为验收项 |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| 替换遗漏（grep 仍有字面量残留 · F-W7-01） | 验收 FAIL | 是（补替换重验） | — |
| 常量替换改变输出字节（换行/空格漂移 · F-W7-02） | 测试红 · 回归 FAIL | 是（修漂移重验） | 是 |
| 白名单误纳 `.cyning-harness`（F-W7-03） | 验收 FAIL · 违事实卡 §10 | 是（移除加注释） | — |
| 重构顺手扩范围（拆 god-file / 清 spawn） | 打回（F-X-05 范围蠕入） | — | — |

---

## 验收标准

- [ ] `## Harness 元信息` 字面量 grep 归零（常量定义处除外）；行为无回归（406 用例全绿）
- [ ] 白名单单一真值；`.cyning-harness` 不在其中且代码注释明示「legacy 只读探测」
- [ ] `npm run typecheck` 0 错 0 警
- [ ] 输出字节无漂移（既有测试快照/断言全绿即为证 · 如有疑虑补 diff 核证）
- [ ] `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` 四门绿（与 `.github/workflows/ci.yml` 一致 · 06 硬纪律 A-2.2-12）
- [ ] `npx --yes spec-wave task lint-wiki-delta --target .` 通过（wiki_delta 预检）
- [ ] 波末 `npx spec-wave gate-check --task <本 task>` 通过（HG-AUDIT-R1=approved 后）

---

## 给执行帽的必读列表

1. SPEC：[`05_hygiene_v1.md`](../../spec/2_2-closed-loop-start/05_hygiene_v1.md) 全篇 · [`06`](../../spec/2_2-closed-loop-start/06_waves_and_acceptance_v1.md) §W7 + A-2.2-10
2. `src/cli-shared.ts`（常量落点 · 18 处消费方均已 import 该模块）
3. `src/cli-checks.ts`（5 处）· `src/cli.ts`（2 处）· `src/cli-task-extra.ts`（3 处）· `src/cli-shared.ts`（8 处）
4. 事实卡 `.workbuddy/output/推广事实卡-2.1.3.md` §4/§10（dest 既定落盘目录口径）

---

## 思考轮

### R0 · 证据

SPEC 05 §1（18 处实测分布 · 事实卡 §4 既定目录）。

### R1 · 范围

E1（常量替换）+ C7（白名单显式化）合波；god-file / spawn / cyning-harness 入单 / isS2RelPath 清理均出范围。

### R2 · 方案

SPEC 05 §4 已定：常量集中 `cli-shared.ts` 导出【采纳 · 18 处消费方均已 import】；新建 constants 模块【备选 · 本波规模过度设计】；白名单散落各调用点【弃 · 正是要消的病】。（20 审复核即可，不重开。）

### R3 · 边界

纯重构零行为变更 · 输出字节零漂移 · `.cyning-harness` 显式排除加注释（事实卡 §10）。

### R4 · 可测性

406 用例回归 + grep 归零机械验 + typecheck 0 错 0 警。

### R5 · 签收就绪

本槽由 20-task-audit R1 复核后判充分；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 18 处分布实测一致 | no |
| R1 | E1+C7 同波（同工程健康主题 · 同小体量） | no |
| R2 | 常量集中 cli-shared（SPEC 已定 · 20 复核） | no |
| R3 | 零行为变更红线 | no |
| R4 | 回归 + grep 归零双验 | no |
| R5 | 待 20 审裁定 | no |

**residual_risks**：grep 归零判定须排除常量定义处自身（验收文案已明示）；与 W2/W3 并行时同文件（cli.ts/cli-shared.ts）可能冲突（缓解：建议排后 · 依赖行已注）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 无新行为故无新测试义务；406 用例回归 + grep 机械验 + typecheck 0 错 0 警为验收硬条款。

---

## 提交信息约定

- 提交信息：`feat(2.2-W7): …`（独立提交 · 前缀不变）
- **禁 `git add -A`**：逐文件显式 add
- **不裹挟 D0 未提交改动**（`delivery/promotion/` 4 份 + `package.json` description/keywords · F-X-06 / D0-PROT）
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_2_closed_loop_w7_hygiene.md`

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
