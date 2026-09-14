# Task：2.4 W4 · 资产门禁可观测补全（assets observability）

> **状态**：`done`（HG-TASK-DRAFT=approved · **HG-AUDIT-R1=approved**（00 代签 · 2026-09-14） · 2026-09-14 开单 · 2026-09-14 关账）  
> **wave**：W4（2.4.0 门禁强度补全）  
> **关联 SPEC**：[`docs/spec/2_4-gate-strength/04_w4_assets_observability_v1.md`](../../spec/2_4-gate-strength/04_w4_assets_observability_v1.md)（**唯一蓝本** · signed）· [`00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-4-gate-strength-w4-assets-observability` |
| **test_strategy** | `required` |
| **test_strategy_note** | warning 可见性构造（靶场 .bak → verify exit 0 且 WARN 点名）· rebuild 追认警示快照断言（dry-run 与 --yes 两路）· mismatch/missing/extra 三负向回退锁 |
| **freeze_id** | 2.4.0-W4 · D-24-W4-WARN-ONLY 已冻结（SPEC 04 §6 · HG-SPEC-SIGNOFF approved）；rebuild 是否加二次确认旗标 = 本 task 评审可选项（默认警示文案口径） |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 可观测性补全，不改架构图谱 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 门禁输出口径增强 · 对外口径收窄归 W5 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.2/2.3 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-14 维护者本窗签收 PLAN_2_4 |
| HG-SPEC-SIGNOFF | **approved** | — | 2026-09-14 维护者授权 00 代签 |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-14 维护者授权） |
| **HG-AUDIT-R1** | **approved** | 30 | 00 代签 · 2026-09-14 · 维护者授权 · 依据审查文 [`docs/harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md`](../../harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md)（R1 结论 PASS） |

---

## 背景与目标

2.3-W5 资产完整性校验两处同源缺口（验收报告 §3.C/§3.F · 本棒只读复核有效）：N2 —— `src/cli-assets.ts:29` 双侧排除 `.bak`（D-23-W5-EXCLUDE）致 verify 对排除项**结构性失明**（110 vs 113 实测）；N5 —— 篡改 + `assets manifest rebuild --yes` 可让门禁转绿（V3 实验 · rebuild 追认语义未向操作者明示），威胁模型高估且与 G5《安全设计》`:768`/`:77`/`:418` 口径冲突。目标：排除项「排除但可见」（显式 warning · 不升 exit 2）+ rebuild 强制追认警示（维护者动作口径）；对外口径收窄归 W5。

**已定案（冻结 · 不得翻案）**：D-24-W4-WARN-ONLY（warning 级 · exit code 语义不动 · 排除生成侧维持）。

## 范围

- [x] ① **N2 · verify 排除项 warning**：verify 侧收集被排除项清单 → 输出 `WARN: 排除项 N 个（不参与哈希校验）: <相对路径清单>`（量大截断 + 总数汇总 · F-W4-01）；`--json` 面新增 `excluded` 字段（键集只增 · 合规）；exit code 语义不变。
- [x] ② **N5 · rebuild 追认警示**：dry-run（`src/cli-assets.ts:196`）与 `--yes` 写盘两路均追加警示文案——「本操作将当前资产状态追认为真值 · 若资产曾被篡改将随本次 rebuild 被合法化 · 防投毒依赖 provenance（当前未启用）」；文案快照断言入测试；是否加 `--yes` 外二次确认由本 task 20 审定（默认警示即够）。
- [x] ③ **回退锁**：mismatch / missing / extra 三负向仍 exit 2（2.3-W5 既有用例全绿）；warning 不影响 failClosed（真实篡改仍 exit 2）。

## 非范围

| 项 | 理由 |
|----|------|
| 签名/密钥体系 | 沿用 2.3-W5 边界（仅 sha256 清单） |
| 排除项升 exit 2 | 报告建议原文口径 = warning 级（SPEC 04 §6） |
| 对外口径收窄（T-03 降调 · 安全设计 §5.3.1） | **归 W5**（文案波） |
| provenance/OIDC 启用 | 仅人（00 §3） |
| 外部遥测 | 沿用 2.3-W5 边界 |
| W1–W3/W5/W6 任何实现项 | 各自独立 task |
| minor bump 2.4.0 / tag / publish | 属发版波 · publish 仅人 |

---

## 失败路径（failure_paths · 对齐 SPEC 04 §8）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W4-01 | 排除项数量大 | 清单截断（前 N 条 + `… 共 M 个`） | 是 | WARN 汇总行 |
| F-W4-02 | warning 与 exit 2 输出混淆 | warning 独立 `WARN:` 前缀 / `--json` 独立 `excluded` 字段 · exit code 不变 | 是 | 前缀/字段区分 |
| F-W4-03 | rebuild 警示文案漂移 | 快照断言锁文案（含「追认」「provenance（未启用）」关键词） | 是 | 测试失败 |
| F-W4-04 | CI 将 warning 误判失败 | exit code 语义不动 · CI 接线不增新判据 | 是 | CI 绿 |
| F-W4-05 | 排除清单未来扩项 | 单一常量双侧消费保持（D-23-W5-EXCLUDE 沿袭）· warning 自动跟随 | 是 | 常量单一来源 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（闸扫描阻断） | 是 | 须先 20-task-audit R1 + 00 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑤ 逐字对齐 SPEC 04 §7 五条；⑥–⑧ 为本棒纪律性增补。

- [x] ① **N2 构造**：靶场 `assets/` 放 `.bak` → `assets verify` exit 0 **且** WARN 点名该文件（相对路径）；删除后 warning 消失；`--json` 面含 `excluded` 字段。贴实际命令与输出。
- [x] ② **N5 快照断言**：rebuild dry-run 与 `--yes` 两路输出含追认警示（「追认」「provenance（未启用）」关键词断言）；警示口径与 `docs/guides/provenance_oidc_trusted_publishing_guide_v1_zh.md:3` 自述一致。
- [x] ③ **三负向不回退**：mismatch / missing / extra 仍 exit 2（既有用例全绿）。
- [x] ④ **CI 语义不变**：warning 不影响 failClosed · 无 `continue-on-error` / `|| true` 类削弱引入。
- [x] ⑤ `npm run typecheck` 0 错 · `npm test` 全绿（含新增）。
- [x] ⑥ **行为变更旧测影响面（TEST-LOCK）**：assets 测试夹影响面逐处列出并联改（grep 留证）。
- [x] ⑦ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_4_gate_strength_w4_assets_observability.md` 通过 + `task close --yes` 闭环。
- [x] ⑧ **提交边界**：禁 `git add -A`；逐路径精确 `git add`；提交信息 `feat(2.4-W4): …`。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_4-gate-strength/04_w4_assets_observability_v1.md`](../../spec/2_4-gate-strength/04_w4_assets_observability_v1.md)（**唯一蓝本**）
3. [`docs/spec/2_4-gate-strength/00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)
4. 现状文件：`src/cli-assets.ts`（排除常量 :9/:29 · rebuild 输出 :189/:196）· assets 测试夹 · `docs/guides/provenance_oidc_trusted_publishing_guide_v1_zh.md`（:3 口径）
5. 参考前波：`docs/tasks/done/task_2_3_wiring_w5_assets_integrity.md`（W5 门禁本体先例）
6. 证据原文：`.workbuddy/output/验收报告-SpecWave-2.3.0.md` §3.C/§3.F
7. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w4_assets_observability.md`（GATE_VERIFY）

---

## 测试策略（Harness）

**test_strategy**: `required`

- assets 测试夹扩组：排除项 warning 构造（正/负）· `--json#excluded` 字段断言 · rebuild 警示快照断言 ×2 路 · 三负向回退。
- 破坏性自证（验收 ①②）为硬条款；改行为必联改断言（TEST-LOCK）。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| `src/cli-assets.ts` verify 排除项 warning | ✅ | `scanAssets` 双侧同扫收集 excluded（manifest 自身为结构性排除不入 warning）· 人类面 `WARN: 排除项 N 个（不参与哈希校验 · D-23-W5-EXCLUDE）: <前 5 条> … 共 M 个`（F-W4-01 截断）· `--json` 新增 `excluded` 字段（键集只增）· exit code 语义不动 |
| `src/cli-assets.ts` rebuild 追认警示 | ✅ | `REBUILD_WARN` 常量单一文案 · dry-run 与 `--yes` 两路（含幂等空转路）均输出「追认为真值 · 篡改将随 rebuild 被合法化 · provenance（未启用）」· 口径同 guide :3 自述 |
| 测试扩组 + 三负向回退锁 | ✅ | `test/cli-w5-assets-integrity.test.ts` 新增 describe ×4 用例（N2 构造正负/截断/warning 不掩负向 · N5 快照断言两路）· 2.3-W5 既有 9 用例全绿未改断言 |

### 自检结论（执行者）

- **验证命令与退出码**：`npm run typecheck` 0 错 · `npm test` 574 pass / 0 fail / 1 skipped（含新增 4）· `npm run build` OK · `npm run test:lib` 6/6 · `node bin/specgate.js pins check` 17/17 · `node bin/specgate.js assets verify` PASS 110/110（仓内无排除项 · 无 WARN）
- **验收① N2 构造（先红后绿）**：红 = stash 旧码靶场放 `leak.bak` → verify exit 0 且无排除项提示（结构性失明复现）；绿 = 新码 exit 0 + `WARN: 排除项 1 个…: prompts/leak.bak` · `--json` 含 `excluded: ["prompts/leak.bak"]` · 删除后 warning 消失
- **验收② N5 快照断言**：dry-run 与 `--yes` 两路输出均含「追认」「provenance（未启用）」· 测试内整句快照断言锁文案（F-W4-03）
- **验收③ 三负向不回退**：mismatch/missing/extra 既有用例全绿仍 exit 2；新增「排除项+篡改并存 → exit 2」用例钉死 warning 不掩负向
- **验收④ CI 语义不变**：exit code 0/1/2 口径未动 · 未触 `.github/workflows/` · 无 `continue-on-error`/`|| true` 引入
- **验收⑥ TEST-LOCK 影响面**：grep `assets verify|sha256.manifest|excluded` → `cli-w5-assets-integrity.test.ts`（本波扩组）· `cli-json-no-abs-path.test.ts`（`--json` 新键为相对路径 · 无绝对前缀 · 不需联改）· `lib-smoke/cli-lib-smoke.test.ts` S5（仓内无排除项 · PASS 断言不受影响）· 旧断言零改动
- **已知未测项**：无（F-W4-01 截断、F-W4-02 字段/前缀区分均有用例）
- **Task_KPI**：范围 3/3 · 验收 ①–⑥⑧ 自证齐 · ⑦ 见关账记录

### KPI（00）

Task_KPI%: 96（验收 8/8 自证通过 · N2 先红后绿留证（stash 旧码复现静默 PASS → 新码 WARN 点名 + `--json#excluded`）· N5 快照断言两路锁文案 · 机械断言 +4 测全绿 · 三负向回退锁含「warning 不掩负向」新钉 · 四门绿 574 pass+1 既有门控 skip · pins 17/17 · assets 110/110 无 WARN · TEST-LOCK 3 处核对零联改 · exit code/CI 判据不动 · 不 bump 版本号）

### 经验总结

可观测性补全的关键判据是「warning 与 failClosed 严格分层」：`WARN:` 前缀 + `--json` 独立 `excluded` 字段让排除项可见而不改变 exit code 契约（D-24-W4-WARN-ONLY），CI 零判据新增即不干扰既有判读；manifest 自身属结构性排除须从 warning 清单剔除，否则每次 verify 恒定告警反而消解信号。rebuild 警示用单一常量文案 + 三路（dry-run/--yes/幂等）统一输出 + 快照断言锁定，防文案漂移（F-W4-03）。

---

## 思考轮（10-task）

### R0 · 证据

SPEC 04 为唯一蓝本（signed）；前提本棒只读复核有效：排除点 :29 · 双侧消费注释 :9 · rebuild 输出 :189/:196 · guide :3 自述未启用 · 安全设计三处口径。

### R1 · 范围

范围 = SPEC 04 §3 三项逐字承接；非范围 = 04 §4 + 纪律增补（对外口径归 W5 是本波最重要的边界）。

### R2 · 方案

D-24-W4-WARN-ONLY 定案；rebuild 二次确认旗标 = 20 审可选项（默认警示即够 · freeze_id 行已注明）。

### R3 · 边界

30 开工硬边界 = HG-AUDIT-R1 翻 approved（本帽不签发）；exit code 不动 · CI 不增判据 · 排除常量单一来源保持；提交边界 = 禁 `git add -A`。

### R4 · 可测性

验收 8 条全部可机械/可观测：构造输出断言、快照断言、三负向回退、四门命令、gate-check、提交边界。

### R5 · 派工就绪

task 结构对齐 lint E1–E8；pre-30 invoke（10）同棒落盘。**下一棒**：20-task-audit R1 → HG-AUDIT-R1 签闸（00 代签 · 2026-09-14 维护者授权）→ 30/40。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC signed + 行号复核 + guide 口径） | no |
| R1 | 范围/非范围划定（04 §3/§4 + 口径归 W5 边界） | no |
| R2 | WARN-ONLY 定案 · 二次确认留 20 审可选 | no |
| R3 | 边界四条（开工闸 / exit code / CI / 提交）落入 task | no |
| R4 | 验收 8 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此 | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 已 signed，D-24-W4-WARN-ONLY 冻结，现状行号复核闭合，无新增开放问题。  
**residual_risks**：① warning 级信号依赖人读（W5 口径收窄配套缓解）；② 「防漂移非防投毒」认知回潮（rebuild 警示 + W5 双侧钉死）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | 开单 · 10-task · 蓝本 SPEC 04（signed）· 行号只读复核（cli-assets.ts:9/:29/:189/:196） |
