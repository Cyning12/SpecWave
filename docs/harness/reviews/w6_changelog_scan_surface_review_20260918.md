# 契约评审 · HG-W6-REVIEW · W6 CHANGELOG 扫描面口径

> **hat**：20-task-audit（条件闸评审 · 书面裁定 · 非起草者）  
> **日期**：2026-09-18  
> **闸**：`HG-W6-REVIEW`（blocks 30 · **本波启用**）  
> **被审 task**：[`docs/tasks/done/task_3_0_1_w6_mech_coverage.md`](../../tasks/done/task_3_0_1_w6_mech_coverage.md)  
> **对照**：[`docs/roadmap/PLAN_3_0_1_patch_v1_zh.md`](../../roadmap/PLAN_3_0_1_patch_v1_zh.md) **W6** + 硬约束 **3/5/9** + **风险 4** · [`acceptance_3_0_0_specwave_20260918.md`](./acceptance_3_0_0_specwave_20260918.md) §6.3 P3-2 · 同源形态 [`w2_gate_parse_warning_contract_review_20260918.md`](./w2_gate_parse_warning_contract_review_20260918.md)  
> **性质**：裁定 `check-terminology`（及 claims 是否同口径）对 `CHANGELOG.md` 的**扫描面契约**；**不代签**；**未改** task / `src/`。

---

## 1. 触发理由（为何本波启用条件闸）

| 判据 | 结论 |
|------|------|
| PLAN 风险 4 明示「历史节扫描面须评审」 | **是** |
| 全文件纳入会改变基线绿/红（契约面） | **是** · 活证 `:134` 全文件纳入 ⇒ terminology **真红** |
| 是否仅「实现细节已钉死、无契约变更」 | **否** · 全量 / 缩面 / 加白 三选一对判红面有实质影响 |
| 条件闸启用是否正当 | **正当** · 同源 HG-W2-REVIEW；须本评审文落盘后方可由 00 代签 |
| 可否改 N/A | **否** · 本棒明确 **启用** |

---

## 2. 活证再钉（CHANGELOG.md:134）

| 项 | 现值（2026-09-18 本棒实读） |
|----|------------------------------|
| 行 | **`CHANGELOG.md:134`** |
| 节 | **`## [2.3.0] - 2026-09-14`**（历史节 · 非 Unreleased / 非 `[3.0.0]`） |
| 原文片段 | `` `SPEC_WAVE_E2E_NETWORK=1` 门控手动测试 · 默认 skip `` |
| 与 `exempt_patterns: ["门控 skip"]` | **不匹配**（整串是「门控手动测试」，不是「门控 skip」） |
| 同文件已豁免位 | `:49` / `:65` / `:99` 含 **`门控 skip`** → 现豁免可过 |
| 现行节 | `## [Unreleased]` + `## [3.0.0]` **无**「门控」子串 |

**结论**：风险 4 活证成立；若采用「全文件 targets 追加」且不处置 `:134`，基线 `check-terminology` 将 exit 2（F-W6-01）。

---

## 3. 三方案对照与裁定

| 方案 | 做法 | 优点 | 缺点 | 本波 |
|------|------|------|------|------|
| **S1 全量扫** | `terminology.yaml` targets **追加** `CHANGELOG.md`（整文件） | 对齐 P3-2「对外可见活文件」；无静默缩面；实现最简单（与现六目标同形） | 须处置历史真红（`:134`） | **采纳** |
| **S2 只扫现行版本节** | 脚本/配置只扫 Unreleased + 最新 `## [x.y.z]` | 立刻避开历史红 | **永久历史盲区**；实现需节解析（新增能力面风险 · 硬约束 3 边缘）；易被认定为「静默缩面」（硬约束 5 / F-W6-02） | **不采纳** |
| **S3 历史节加白 / 路径豁免** | 对历史节整段或文件级 allow · 或扩大量 exempt | 少改史 | 豁免面膨胀；「加白历史」≈缩面的另一种静默；难审计 | **不采纳作主方案** |

### 裁定 S-TERM（terminology）

```text
扫描面：CHANGELOG.md 整文件纳入 check-terminology targets（闭集 6→7 · 同步脚本头注释计数/表述）
禁止：默认改为「仅扫现行版本节」或整段历史豁免（视为静默缩面）
:134 处置：改措辞（优先）——将「门控手动测试」改为 canonical 族措辞
          推荐：「门禁手动测试」或「环境门禁手动测试」（语义不变 · 去掉变体词「门控」）
禁止优先：新增 exempt_patterns「门控手动测试」（除非改措辞与 pins/史实冲突且 00 书面例外；本裁定默认不走）
负向：向现行可写位（建议 Unreleased 或 [3.0.0] Tests/Changed）注入「门控」⇒ exit 2 点名
边界：「后门控制」「门控 skip」不误报 · 存量六目标零回归
```

---

## 4. check-claims 同口径裁定

| 项 | 结论 |
|----|------|
| PLAN 要求 | 「按同口径**评估**是否一并纳入」· **非**强制纳入 |
| 实证 | 若把 `CHANGELOG.md` 加入 `claims-boundary.yaml` `scan_targets`，`:94` 历史叙述中的 **`四宿主`** / **`406 用例`**（expired_wording · 快照语境）将 **真红** |
| 威胁模型 | claims = 对外**宣称面**防自漂移（README / GLOSSARY / `delivery/promotion/**`）；CHANGELOG 历史节合法复述旧口径属**史实记录**，与宣称主面不同 |
| **裁定 S-CLAIMS** | **本波不纳入** `CHANGELOG.md` 入 claims `scan_targets` |
| 硬约束 5 合规 | **禁止沉默**：30 自检结论 / 关账经验须**显式**写本条理由（满足 task **A5**）；可选一行注释留在 yaml 近旁「W6 评估：CHANGELOG 不入 claims · 见本评审文」 |
| 仍禁止 | 改 `check-claims.mjs` 为语义/同义匹配（P3-1 · 非范围） |

---

## 5. 与 validate WARN 的边界（本闸范围外但对齐）

本闸**只**钉 terminology/claims 扫描面。P3-7 WARN 通道沿用 W2 契约：

- stderr + `--json#warnings` 只增不改  
- exit / `HOST VALIDATE: PASS` 不升 FAIL  
- **不改** apply fail-closed · **不扩** `CONFIG_HOOK_HOSTS`

（细节见 R1 §4 · 不在本文件重开争议。）

---

## 6. 契约变更定性（供 00 代签口径）

```text
变更类型：scan-surface contract（terminology 闭集扩至 CHANGELOG 整文件）
breaking：对既有六目标扫描行为 = 否；对 CHANGELOG 基线 = 须先改 :134 措辞后保持 rc=0
缩面：否（明确拒绝「仅现行节」）
claims：评估完成 · 本波不纳入（显式理由 · 非 silent skip）
实现形态：yaml targets 追加 + 头注释同步 + :134 改词 + 负向测
```

**结论**：本波**构成** HG-W6-REVIEW 所定义的「扫描面口径变更」，范围已钉死为 **全量扫 + 改史措辞 + claims 显式不纳入**。本评审文落盘后，**00 可代签 `HG-W6-REVIEW → approved`**（维护者已授权过程闸 · 以 task 表为准），再连同 `HG-TASK-DRAFT` / `HG-AUDIT-R1` 进入 30。

---

## 7. 明确禁止（硬约束 3/5/9 对齐）

- 禁止静默改为「只扫现行版本节」或整段历史加白（F-W6-02）
- 禁止不处置 `:134` 就宣称基线绿（F-W6-01）
- 禁止默认靠扩 exempt 掩盖「门控」变体（优先改措辞）
- 禁止静默跳过 claims 评估或不写 A5 理由
- 禁止借机重写 claims 语义匹配 / 触 schema / 扩映射 / 松 apply（硬约束 3 → STOP）
- 硬约束 9 已满足（W4 CLOSE）· 本波不得再重开 W4 归因混乱

---

## 8. 与 task 验收映射

| 裁定 | task 锚点 |
|------|-----------|
| S-TERM 全量扫 + `:134` 改词 | 范围① · A1–A4 · F-W6-01/08/09 |
| S-CLAIMS 不纳入 + 显式理由 | 范围② · A5 · F-W6-02 |
| 禁缩面 / 禁静默 | 硬约束 5 · F-W6-02 |
| HG-W6-REVIEW 启用 | 闸表 · F-W6-00b |

---

## 9. 签收就绪声明

| 项 | 状态 |
|----|------|
| 扫描面三选一已裁定（全量扫） | ✅ |
| `:134` 处置已钉（改措辞优先） | ✅ |
| claims 同口径评估结论已落盘 | ✅ 不纳入 |
| 可支撑 00 代签 HG-W6-REVIEW | ✅ **是** |
| 本帽代签 | ❌ **禁** |

---

**签名**：20 审查棒（契约评审 · HG-W6-REVIEW）· 2026-09-18 · **未改 task / 未改实现码 · 未代签**。
