# 2.4.0 · 门禁强度补全（gate strength）· SPEC 系列

> **状态**：`signed`（**HG-SPEC-SIGNOFF=approved** · **HG-NEXT-PLAN=approved** · 2026-09-14 维护者本窗签收 PLAN 并书面授权 00 代签本版后续全部过程闸 · 与 2.3.0 同模式；HG-RELEASE 不在授权范围）  
> **spec_slug**：`2_4-gate-strength`  
> **目标包**：`spec-wave@2.4.0`（**minor**）  
> **上游规划**：[`PLAN_2_4_gate_strength_v1_zh.md`](../../roadmap/PLAN_2_4_gate_strength_v1_zh.md)（approved · 含 10 组范围校核）  
> **判断依据（范围主源）**：[`.workbuddy/output/验收报告-SpecWave-2.3.0.md`](../../harness/reviews/w7_evidence_provenance_20260917.md) §6「建议 2.4（minor）—— 门禁强度补全」（N2–N14 八组 · 证据见报告 §3.B–§3.O）+ §6 末「建议同步调整的对外口径」  
> **残余登记（并入范围）**：[`../../roadmap/ACCEPTANCE_2_3_1_patch_2_3_1_zh.md`](../../roadmap/ACCEPTANCE_2_3_1_patch_2_3_1_zh.md)「已知残余（主动登记 · 归 2.4）」节（A2 结论节内强度增强 · N9 未修留痕）  
> **路线背景（非范围/风险口径）**：[`.workbuddy/output/路线研究-SpecWave-2.2-3.0.md`](../../harness/reviews/w7_evidence_route_research_2_2_to_3_0_20260917.md) §6 非范围冻结 · §7 风险表  
> **基线**：`spec-wave@2.3.1` **published**（npm `latest` = 2.3.1 · tag `v2.3.1` ↔ bump `268ca21` · N1/N11/N13 已随 2.3.1 落地，不在本版范围）  
> **Open Folder**：本仓根（本地目录可仍名 `dsh-coding-kit/`）

---

## 一句话

2.3.0 把门禁「接线」补齐、2.3.1 把 P1 修掉；2.4.0 收四路对抗式验证（V1–V4）实锤的**强度缺口**：**W1 pins 提取修正**（核心 · N7 refstyle 不扫 / N8 词锚不认表行 / N9 不认语义格位），W2 结论级闸强度增强（A2 · **评审先行**），W3 输出层统一相对化（N12），W4 资产门禁可观测（N2/N5），W5 物料与对外口径对齐（N3 + 口径三调 + N6），W6 P3 清扫（N10/N14/N4 留痕）——**不动 host-adapt schema、不拉 3.0 架构项、S2 永不覆写**。

---

## 读序

1. 验收报告 §6「建议 2.4」+ §3.B–§3.O（范围与证据主源）→ 2.3.1 验收档「已知残余」节 → PLAN_2_4（含范围校核）
2. [`00_policy_and_boundaries.md`](./00_policy_and_boundaries.md)（S2 禁区 · P0 门禁 · 范围外声明 · 冻结项 · 修严必配负向 fixture）
3. [`01_w1_pins_extract_fix_v1.md`](./01_w1_pins_extract_fix_v1.md)（**W1 · pins 提取修正 · 本次核心**）
4. [`02_w2_conclusion_gate_strength_v1.md`](./02_w2_conclusion_gate_strength_v1.md)（W2 结论级闸强度增强 · **评审先行**）
5. [`03_w3_output_rel_unified_v1.md`](./03_w3_output_rel_unified_v1.md)（W3 输出层统一相对化）
6. [`04_w4_assets_observability_v1.md`](./04_w4_assets_observability_v1.md)（W4 资产门禁可观测补全）
7. [`05_w5_materials_messaging_v1.md`](./05_w5_materials_messaging_v1.md)（W5 物料与对外口径对齐）
8. [`06_w6_p3_cleanup_v1.md`](./06_w6_p3_cleanup_v1.md)（W6 P3 清扫）

---

## 待决冻结项（00 代签已定案 · 采纳推荐）

| ID | 定案（采纳推荐） | 说明 |
|----|------|------|
| **D-24-PIN16-REFSTYLE** | **pin-16 提取补 reference-definition 分支（`^\s*\[[^\]]+\]:\s*(\S+)`）+ refstyle 负向 fixture** | N7（验收报告 §3.H · V1 对照实验证真缺口）；定点改 `src/cli-pins.ts:295` 提取区 |
| **D-24-PIN17-TABLEROW** | **pin-17 词锚限定表格行内匹配：优先「词锚 ∧ 表行」双命中断言（非单一复杂正则）** | N8（§3.I · V1 决定性对照：删枚举句 Zed → exit 2）；实现区 `src/cli-pins.ts:348-390` |
| **D-24-PIN08-SEMCELL** | **pin-08 提取锁定语义格位（状态列）：排除同行路径/链接/slug 中的版本形态串 · `X_Y`/`X_Y_Z` 前缀式不计入版本串 + 「改坏状态格 → exit 2」回归锁** | N9（§3.J · V1 + lead 复现 · 与 2.3-W1 自验 §7.1 矛盾）；实现区 `src/cli-pins.ts:221-258` |
| **D-24-W2-REVIEW-FIRST** | **W2 闸语义变更：30 改码前须有强度方案评审文落盘 `docs/harness/reviews/` 且经 20-task-audit R1** | 循 2.3-W4 D-23-W4-REVIEW-FIRST 先例；强度档位由评审文定夺 |
| **D-24-W2-NO-RETRO** | **W2 新行为不追溯存量 done task** | 循 2.3-W4 D-23-W4-TRANSITION 与 2.3.1 N11 波及处置先例（波及入 `legacy-gate-exempt.yaml` 留痕，非静默放过） |
| **D-24-OUTPUT-REL-EXIT** | **N12 相对化收敛为输出层统一出口 + 「任何 `--json` 输出不得含绝对路径」机械断言** | §3.M；契约「只增不改」对象为键集，值相对化循 2.3-W3 D-23-JSON-TARGET-REL 定性（安全泄漏修复 · CHANGELOG 明示） |
| **D-24-W4-WARN-ONLY** | **assets verify 排除项 = 显式 warning（不升 exit 2）· rebuild 增强追认提示（维护者动作口径）** | N2/N5（§3.C/§3.F · 报告建议原文口径） |
| **D-24-N4-REGISTER** | **N4 仅登记留痕，不改行为** | §3.E 判定符合契约（exit 1 = 用法档） |

---

## 思考轮控制（10-spec · 系列级）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = 验收报告 §6 建议 2.4 + §3.B–§3.O 十四项新发现 + 2.3.1 残余登记 + 路线研究 §6/§7；主题 = minor 2.4.0「门禁强度补全」，非架构轨 | no |
| R1 | 范围 = W1–W6（N7/N8/N9 · A2 · N12 · N2/N5 · N3+口径三调+N6 · N10/N14/N4）；非范围 = 3.0 架构项（A3/A4/B2/B3/B5/C6/E3/E4/F1）· 冻结项（自研 IDE/第二分发通道/远程 Policy 引擎）· C5 启用（仅人）· N1/N11/N13（2.3.1 已落地） | no |
| R2 | 各波 SPEC 内给出方案对比：pin-17 表行口径（双命中断言 **荐** / 单一复杂正则 弃）、pin-08 格位锁定（状态列语义格 **荐** / 行首 slug 前缀沿用 弃 · 即 N9 病根）、输出层相对化（统一出口 **荐** / 逐字段补丁 弃 · 即 N12 病根）、assets 排除项（warning **荐** / 升 exit 2 弃 · 报告原文口径） | no |
| R3 | 边界：S2 永不覆写；P0 门禁不可绕过；不动 host-adapt schema（触即 STOP）；W2 先评审后动手 + 不追溯存量；对外文案三调落地前维持禁称；provenance/OIDC 启用仅人 | no |
| R4 | `test_strategy=required`：W1 三负向 fixture 修复前真红（V1 构造固化）+ 现行文档全量回归；W2 负向 fixture + 存量波及实测登记；W3 机械断言全命令面；W4 warning/警示文案快照断言；W5 黑名单词机检；W6 双平台语义一致断言 | no |
| R5 | **已签收**（2026-09-14 · HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved · 00 代签 · 授权出处「2026-09-14 维护者本窗签收 PLAN 并授权 00 代签本版后续全部过程文档闸」）· 下一棒：00 逐波拆 task（10-task）→ 20-task-audit（审查文落盘）→ HG-AUDIT-R1 代签 → 30/40 | no |

**residual_risks**：① pin-08 格位锁定依赖 spec 索引表列序约定（缓解：列位口径入 release-pins.yaml 数据 · 表结构变更同步评审）；② pin-17 表行形态对 README 双语表格式的解析脆性（缓解：双命中断言优先 · 现行 README 全量回归）；③ W2 强度档位过严误伤真实合规审查文（缓解：评审文附存量合规率实测 · 豁免可留痕）；④ 统一输出出口改动面宽可能遗漏直接 print（缓解：机械断言兜底全绿为验收）；⑤ 物料与 pins 钉面联动（W1 修严后 W5 文案改动受 pins check 约束 · 随改随跑）。

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-14 维护者本窗授权 00 代签 · 与 2.3.0 同模式） | ~~SPEC 系列定稿~~ · 冻结 D-24-* 待决项（采纳推荐） |
| **HG-NEXT-PLAN** | **approved**（2026-09-14 维护者本窗签收 PLAN） | ~~开 W1 task~~ · 授权落表后可由 00 逐波拆 task 开工 |
| HG-AUDIT-R1（每波 ×6） | pending | 各波 30 改码前（10-task → 20-task-audit → 00 代签，逐波独立） |
| HG-RELEASE（2.4.0 发版） | pending | publish（**仅人** · 不在 00 代签授权范围） |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | draft 立档 · 10-spec · 源自验收报告 §6 建议 2.4 + 2.3.1 残余登记 + PLAN_2_4（approved） |
| 2026-09-14 | signed · 双闸 approved（00 代签 · 2026-09-14 维护者本窗授权）· 思考轮控制 R5 回填「已签收」 |
