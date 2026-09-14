# Task：2.4 W3 · 输出层统一相对化（output relativization unified exit）

> **状态**：`active`（HG-TASK-DRAFT=approved · **HG-AUDIT-R1=approved**（00 代签 · 2026-09-14） · 2026-09-14 开单）  
> **wave**：W3（2.4.0 门禁强度补全）  
> **关联 SPEC**：[`docs/spec/2_4-gate-strength/03_w3_output_rel_unified_v1.md`](../../spec/2_4-gate-strength/03_w3_output_rel_unified_v1.md)（**唯一蓝本** · signed）· [`00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-4-gate-strength-w3-output-rel` |
| **test_strategy** | `required` |
| **test_strategy_note** | 新增「任何 `--json` 输出不得含绝对路径」机械断言组（全命令面 · 含断言自身负向自证）；V2 泄漏清单四处逐项实测转相对 |
| **freeze_id** | 2.4.0-W3 · D-24-OUTPUT-REL-EXIT 已冻结（SPEC 03 §6 · HG-SPEC-SIGNOFF approved）；契约口径 = 键集只增不改 · 值相对化循 D-23-JSON-TARGET-REL 定性 |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 输出层收敛，不改架构图谱 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 安全泄漏修复（输出口径），非规范/流程增量 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.2/2.3 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-14 维护者本窗签收 PLAN_2_4 |
| HG-SPEC-SIGNOFF | **approved** | — | 2026-09-14 维护者授权 00 代签 |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-14 维护者授权） |
| **HG-AUDIT-R1** | **approved** | 30 | 00 代签 · 2026-09-14 · 维护者授权 · 依据审查文 [`docs/harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md`](../../harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md)（R1 结论 PASS-with-issues · 提示级行号漂移不影响开工，30 以现值为准） |

---

## 背景与目标

C3「绝对路径零泄漏」逐字段打补丁，V2 实测四处仍泄漏（§3.M · 本棒只读复核现值）：`task lint --json#file`（`src/cli.ts:1017-1037` · :1025 JSON 直出 `result.file` 未相对化）· `task close --json#dest/done_snapshot.path`（`:1148-1164` · dest 解析 :1106-1114 为绝对）· `verify/gate-check --json#task`（`:571`/`:899` `task: taskFile` 原值）· `task close` 人类输出 `moved:`/`dest:`/`done_snapshot·path`（`:1136`/`:1167`/`:1171`）；干净对照 `status --json#task_path` 已相对化（`src/cli-status.ts:111`）。目标：相对化收敛为**输出层统一出口** + 机械断言兜底全命令面。

**已定案（冻结 · 不得翻案）**：D-24-OUTPUT-REL-EXIT（统一出口优先 · 逐字段补丁弃选——即 N12 病根）；契约「只增不改」对象为键集，值相对化属安全泄漏修复（CHANGELOG 明示 · 发版波落地）。

## 范围

- [ ] ① **输出层统一出口**：JSON 序列化出口统一经 `printJson` 类助手（深遍历字符串值 · 仓内绝对路径 → toRel）；人类输出路径值经同一口径；复用 `src/cli-shared.ts` toRel 既有实现；仓外路径行为沿用既有语义。
- [ ] ② **V2 清单四处逐项修复**：`task lint --json#file` · `task close --json#dest/done_snapshot.path` · `verify/gate-check --json#task` · `task close` 人类输出三处——逐项实测留证（含传绝对路径入参形态）。
- [ ] ③ **机械断言组**：遍历全部 `--json` 命令面（verify / gate-check / audit / task lint / task close / status / pins / assets 等）· 断言 stdout 可 `JSON.parse` 且不含仓根绝对路径前缀；断言组自身负向自证（人为注入一处绝对路径输出 → 断言真红）。

## 非范围

| 项 | 理由 |
|----|------|
| exit code 语义变更 | 0/1/2 口径保持（00 §2） |
| `--json` 信封键集变更 | 契约只增不改（2.2.0 既定） |
| 错误文案措辞改写 | 只相对化 · 文案不动（RELEASING 敏感面见 00 §5） |
| 日志/审计落盘（C6） | 3.0 |
| W1/W2/W4–W6 任何实现项 | 各自独立 task |
| minor bump 2.4.0 / tag / publish | 属发版波 · publish 仅人 |

---

## 失败路径（failure_paths · 对齐 SPEC 03 §8）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W3-01 | 命令绕过统一出口直接 print | 机械断言兜底打红 · 返修出口覆盖 | 是 | 测试失败点名命令 |
| F-W3-02 | 仓外 target（/tmp 靶场） | toRel 沿用 cli-shared 既有语义 · 断言判据只认仓根绝对前缀 | 是 | 输出口径稳定 |
| F-W3-03 | JSON 消费者依赖绝对路径值 | 值相对化属安全泄漏修复 · CHANGELOG 明示（发版波） | — | CHANGELOG 条目 |
| F-W3-04 | 深遍历误改非路径串 | 判据限「存在且位于仓内的路径」· 误改即返修判据 | 是 | fixture 钉死 |
| F-W3-05 | close 人类输出冻结文案变动 | `CLOSE: PASS · <slug>` 冻结行不动 · 仅路径值相对化 | 是 | 冻结文案回归测 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（闸扫描阻断） | 是 | 须先 20-task-audit R1 + 00 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑤ 逐字对齐 SPEC 03 §7 五条；⑥–⑧ 为本棒纪律性增补。

- [ ] ① **V2 清单逐项转相对**：四条命令实测（含绝对路径入参）→ 输出无仓内绝对路径 · 贴实际命令与输出。
- [ ] ② **机械断言全绿**：断言组覆盖全部 `--json` 命令面 · 任一命令传绝对路径入参 → stdout grep 仓根绝对前缀为空；断言组负向自证真红留证。
- [ ] ③ **干净对照不回退**：`status --json#task_path` 相对口径保持；既有 `--json` 信封键集不变（键名 diff 断言）。
- [ ] ④ **人类输出**：`task close` 的 `moved:`/`dest:`/`done_snapshot·path` 相对化 · CLOSE: PASS 冻结文案不变。
- [ ] ⑤ `npm run typecheck` 0 错 · `npm test` 全绿（含新增）· CHANGELOG 2.4.0 值相对化条目留接口说明（发版波落正式条目）。
- [ ] ⑥ **行为变更旧测影响面（TEST-LOCK）**：输出断言影响面逐处列出并联改（grep 留证）。
- [ ] ⑦ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_4_gate_strength_w3_output_rel.md` 通过 + `task close --yes` 闭环。
- [ ] ⑧ **提交边界**：禁 `git add -A`；逐路径精确 `git add`；提交信息 `feat(2.4-W3): …`。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_4-gate-strength/03_w3_output_rel_unified_v1.md`](../../spec/2_4-gate-strength/03_w3_output_rel_unified_v1.md)（**唯一蓝本**）
3. [`docs/spec/2_4-gate-strength/00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)
4. 现状文件：`src/cli.ts`（cmdTaskLint :1017-1037 · cmdTaskClose :1039-1175 · verify/gate-check task 字段 :571/:899）· `src/cli-shared.ts`（toRel）· `src/cli-status.ts`（:111 干净对照）
5. 参考前波：`docs/tasks/done/task_2_3_wiring_w3_security_observability.md`（2.3-W3 相对化先例 · D-23-JSON-TARGET-REL）
6. 证据原文：`.workbuddy/output/验收报告-SpecWave-2.3.0.md` §3.M
7. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w3_output_rel.md`（GATE_VERIFY）

---

## 测试策略（Harness）

**test_strategy**: `required`

- 新增机械断言组（全 `--json` 命令面 · 绝对路径入参 · 仓根前缀 grep 为空）+ 断言自身负向自证。
- 键集 diff 断言（既有信封键名/类型/顺序不变）。
- 破坏性自证（验收 ①②）为硬条款；改行为必联改断言（TEST-LOCK）。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| 输出层统一出口 | ⬜ | — |
| V2 清单四处逐项修复 | ⬜ | — |
| 机械断言组 | ⬜ | — |

### 自检结论（执行者）

（30/40 回填：验证命令与退出码表 · 验收 ①–⑧ 逐条 · 已知未测项 · Task_KPI%）

---

## 思考轮（10-task）

### R0 · 证据

SPEC 03 为唯一蓝本（signed）；V2 清单四处行号本棒只读复核有效（见背景节）；toRel 既有实现与 status 干净对照确认。

### R1 · 范围

范围 = SPEC 03 §3 三项逐字承接；非范围 = 03 §4 + 纪律增补。

### R2 · 方案

统一出口已定案（D-24-OUTPUT-REL-EXIT）；出口助手具体形态（printJson 包装 vs 调用点收敛）留 30 实现自由度，验收以机械断言全绿为准。

### R3 · 边界

30 开工硬边界 = HG-AUDIT-R1 翻 approved（本帽不签发）；契约键集不动 · 冻结文案不动 · 仓外路径口径沿用；提交边界 = 禁 `git add -A`。

### R4 · 可测性

验收 8 条全部可机械/可观测：逐项实测、断言组（含自证）、键集 diff、冻结文案回归、四门命令、gate-check、提交边界。

### R5 · 派工就绪

task 结构对齐 lint E1–E8；pre-30 invoke（10）同棒落盘。**下一棒**：20-task-audit R1 → HG-AUDIT-R1 签闸（00 代签 · 2026-09-14 维护者授权）→ 30/40。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC signed + 清单行号复核 + toRel 现状） | no |
| R1 | 范围/非范围划定（03 §3/§4 + 纪律增补） | no |
| R2 | 统一出口定案 · 形态自由度留 30 | no |
| R3 | 边界四条（开工闸 / 契约 / 冻结文案 / 提交）落入 task | no |
| R4 | 验收 8 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此 | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 已 signed，D-24-OUTPUT-REL-EXIT 冻结，泄漏清单行号复核闭合，无新增开放问题。  
**residual_risks**：① 断言命令面清单完备性依赖人工枚举（清单入测试数据 · 新命令接入时评审）；② 深遍历性能（输出体量小 · 可忽略）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | 开单 · 10-task · 蓝本 SPEC 03（signed）· V2 清单行号只读复核 |
