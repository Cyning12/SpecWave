# Task：2.2 W2 · 安全封堵（C1 路径穿越收口 + C3 停止输出绝对路径）

> **状态**：`draft` · **wave**：W2  
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

- [ ] **C1-a**：`resolveTaskPath` 层**一处收口**——拒 target 外绝对路径 + 相对路径解析后归卡 target 内（含 `..` 逃逸拒止）；收口自动覆盖 `cli.ts` 4 个调用点（:510 / :554 / :597 / :710），**禁逐调用点补丁**
- [ ] **C1-b**：`resolveTarget` 增 git-root 归属校验（复用 T-02 既有 git-root 探测能力，不新造）
- [ ] **C1-c**：拒止报错文案含迁移指引（相对路径写法）· exit 1（D-W2-ABS-PATH-UX 冻结值）
- [ ] **C3**：`cli.ts:403/500/548` 三处 `目标: <abs>` 打印改相对路径，复用 `cli-shared.ts:284-288` `toRel(target, abs)`；其余 stdout/stderr 绝对目标路径同口径排查
- [ ] 负向测试：/etc/hosts 类绝对路径 · `..` 逃逸 · 非 git 仓 target；stdout 无绝对目标路径断言

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

- [ ] `verify --task /etc/hosts` 及等价绝对路径输入 → 非 0 退出且**不读取目标文件**（输出不含其内容 · 负向测试钉死）
- [ ] 相对路径 `..` 逃逸 target → 同口径拒止（负向测试）
- [ ] `--target` 指向非 git 仓路径 → 明确报错非 0（非静默接受 · 负向测试）
- [ ] 封堵在 `resolveTaskPath` 层单点收口（代码审查可验 · 4 调用点零补丁）
- [ ] `verify`/`audit` 等命令 stdout 不再出现绝对目标路径（测试断言 · 相对路径输出与 target 参数无关地稳定）
- [ ] 拒止报错含相对路径迁移指引
- [ ] 合法相对路径用例回归全绿（现有 406 用例不破）
- [ ] `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` 四门绿（与 `.github/workflows/ci.yml` 一致 · 06 硬纪律 A-2.2-12）
- [ ] `npx --yes spec-wave task lint-wiki-delta --target .` 通过（wiki_delta 预检）
- [ ] 波末 `npx spec-wave gate-check --task <本 task>` 通过（HG-AUDIT-R1=approved 后）

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
