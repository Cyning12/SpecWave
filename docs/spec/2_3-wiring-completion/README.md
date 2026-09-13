# 2.3.0 · 接线补全（wiring completion）· SPEC 系列

> **状态**：`signed`（**HG-SPEC-SIGNOFF=approved** · **HG-NEXT-PLAN=approved** · 2026-09-12 维护者会话授权 00 代签 · 与 2.2.0/2.2.1 同模式）  
> **spec_slug**：`2_3-wiring-completion`  
> **目标包**：`spec-wave@2.3.0`（**minor**）  
> **上游规划**：[`PLAN_2_3_wiring_completion_v1_zh.md`](../../roadmap/PLAN_2_3_wiring_completion_v1_zh.md)（含 14 条前提校核）  
> **任务来源**：[`.workbuddy/output/PROMPT-2.3.0-落地-交给SpecWave-agent.md`](../../../.workbuddy/output/PROMPT-2.3.0-落地-交给SpecWave-agent.md)  
> **判断依据**：[`.workbuddy/output/路线研究-SpecWave-2.2-3.0.md`](../../../.workbuddy/output/路线研究-SpecWave-2.2-3.0.md)（§5）· [`.workbuddy/output/验收报告-SpecWave-2.2.0.md`](../../../.workbuddy/output/验收报告-SpecWave-2.2.0.md)（§4/§7 · 范围主源）  
> **文案纪律**：[`.workbuddy/output/推广事实卡-2.2.0.md`](../../../.workbuddy/output/推广事实卡-2.2.0.md)（§10 黑名单 · §11 禁称清单）  
> **基线**：`spec-wave@2.2.1` **published**（464 用例全通过 · `pins check` 12/12 PASS · typecheck 0 错 0 警 · 宿主 7 个）  
> **Open Folder**：本仓根（本地目录可仍名 `dsh-coding-kit/`）

---

## 一句话

2.3.0 收口 2.2.0 对抗验收（PASS-with-issues）留下的接线缺口：**W1 pins 机制补强**（核心 · 弱钉改严 + 三面入钉 + fixture 补全 + slug 推导修复），W2 钉面维度扩展（文档↔files · 宿主↔README 两条机械校验），W3 安全与可观测性补漏（C3 补漏 + JSON 信封 + quickstart git 前提 + C4），W4 闸语义接线（4 项 not_wired + reviews.CLOSE · **先评审后动手**），W5 资产完整性校验（A2），W6 六宿主补齐（B4），W7 DX 与工程健康（README 宿主表 + GLOSSARY 修正 + E2/E5）——**不动 schema、不扩大范围、S2 永不覆写**。

---

## 读序

1. 验收报告 §4/§7（范围主源）→ 路线研究 §5 → 规划 PLAN_2_3（含前提校核）
2. [`00_policy_and_boundaries.md`](./00_policy_and_boundaries.md)（S2 禁区 · P0 门禁 · 范围外声明 · 冻结项）
3. [`01_w1_pins_hardening_v1.md`](./01_w1_pins_hardening_v1.md)（**W1 · pins 机制补强 · 本次核心**）
4. [`02_w2_pin_dimensions_v1.md`](./02_w2_pin_dimensions_v1.md)（W2 钉面维度扩展）
5. [`03_w3_security_observability_v1.md`](./03_w3_security_observability_v1.md)（W3 安全与可观测性 · 含 C5 指引文档）
6. [`04_w4_gate_wiring_v1.md`](./04_w4_gate_wiring_v1.md)（W4 A5+A6 闸语义接线 · 先评审后动手）
7. [`05_w5_assets_integrity_v1.md`](./05_w5_assets_integrity_v1.md)（W5 A2 资产完整性校验）
8. [`06_w6_host_completion_v1.md`](./06_w6_host_completion_v1.md)（W6 B4 六宿主补齐）
9. [`07_w7_dx_health_v1.md`](./07_w7_dx_health_v1.md)（W7 DX 与工程健康）

---

## 待决冻结项（00 代签已定案 · 采纳推荐）

| ID | 定案（采纳推荐） | 说明 |
|----|------|------|
| **D-23-PIN08-STRICT** | **pin-08 改严口径 = 「索引行须含当前版本串且版本串落在状态/描述单元格（非任意 `|` 行 prose）」** | [A]#7；提取语义作为数据声明写入 release-pins.yaml（沿袭 D-PINS-SCOPE-8 先例）；以现行 `docs/spec/README.md` 全部行回归防误伤 |
| **D-23-PIN-3FACES** | **CHANGELOG 最新发布头 / MIGRATION `spec-wave@X` / AGENTS `npx spec-wave@X` 三面以纯数据新增钉面（pin-13/14/15），不改 pins 代码** | [A]#8；fixable 矩阵随 SPEC 01 定 |
| **D-23-SPEC-SLUG** | **目录型 `--spec` 回退：basename ∈ {README, index} 时取父目录名作 slug** | [D]；`extractSpecSlug` 单点修复（`src/cli-checks.ts:553-557`），审查文存在性闸误判消解 |
| **D-23-W2-CHECK-FORM** | **W2 两条校验形态：优先 release-pins.yaml 纯数据扩展；pins 数据模型表达不了「集合包含」语义时，落独立 check（复用 exit 2 门禁语义）** | 评审点：task 阶段 R2 定稿 |
| **D-23-W4-REVIEW-FIRST** | **W4 门禁语义变更：30 改码前须有接线方案评审文落盘 `docs/harness/reviews/` 且经 20-task-audit R1** | PROMPT §3 W4 行硬性要求 |
| **D-23-JSON-TARGET-REL** | **`--json` `target` 字段改相对路径（契约值变更 · 非键集变更）** | [A]#5；2.2.0 契约「只增不改」对象为键名/类型/顺序，值相对化属安全泄漏修复；CHANGELOG 须明示 |
| **D-23-D5-ROADMAP** | **`docs/roadmap/` 改名默认不做 · 归 3.0 评估** | 维护者决策项（PROMPT 使用说明 4 推荐值）；注记留痕 |

---

## 思考轮控制（10-spec · 系列级）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = PROMPT-2.3.0 + 验收报告 §4/§7 + 路线研究 §5 + 事实卡-2.2.0；主题 = minor 2.3.0「接线补全」，非架构轨 | no |
| R1 | 范围 = W1–W7（三源并轨：[A] 验收遗留 · [D] 机制债 · [R] 路线）；非范围 = A3/A4/B2/B3/B5/C6/D4/D5(默认)/D6/E3/E4/F1（PLAN §非范围表） | no |
| R2 | 各波 SPEC 内给出 ≥2 方案对比：pin-08 严化口径（状态单元格 **荐** / 行首列 弃）、W2 校验形态（纯数据 **荐** / 独立 check 备）、JSON target（相对化 **荐** / 保留绝对 弃 · 安全泄漏）、assets verify 修复配套（重生成命令 **荐** / 仅校验 弃 · 持续报红） | no |
| R3 | 边界：S2 永不覆写；P0 门禁不可绕过；不动 host-adapt schema（触即 STOP）；W4 先评审后动手；对外文案受事实卡 §10/§11 约束（sha256/provenance/13 宿主落地前「将新增/规划中」） | no |
| R4 | `test_strategy=required`：W1 破坏性自证 + fixture 真失败；W2/W3/W5 负向靶场 exit 2；W4 每闸负向真失败；W6 落点取证 + validate/apply/update 实测；W7 机检 + typecheck 0 错 | no |
| R5 | **已签收**（2026-09-12 · HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved · 00 代签 · 授权出处「2026-09-12 维护者会话授权 00 代签」）· 下一棒：00 逐波拆 task（10-task）→ 20-task-audit（审查文落盘）→ HG-AUDIT-R1 代签 → 30/40 | no |

**residual_risks**：① pin-08 严化与三面入钉的正则/提取脆性（缓解：表达式入 yaml 数据 · 现行文档全量回归）；② `--json` target 值变更影响既有 JSON 消费者（缓解：CHANGELOG 明示 · 安全泄漏修复定性）；③ W4 闸严化误伤存量 task（缓解：评审决定过渡档 · warn-only 先例）；④ W6 六宿主官方落点文档时效性（缓解：逐宿主取证留出处 · 查无确据降级 always_on 复用并标注）。

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-12 维护者会话授权 00 代签 · 与 2.2.0/2.2.1 同模式） | ~~SPEC 系列定稿 · 冻结 D-23-* 待决项~~（已冻结 · 采纳推荐） |
| **HG-NEXT-PLAN** | **approved**（2026-09-12 维护者会话授权 00 代签） | ~~开 W1 task~~ · 授权落表后可由 00 逐波拆 task 开工 |
| HG-AUDIT-R1（每波 ×7） | pending | 各波 30 改码前（10-task → 20-task-audit → 00 代签，逐波独立） |
| HG-RELEASE（2.3.0 发版） | pending | publish（仅人） |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | draft 立档 · 10-spec · 源自 PROMPT-2.3.0 + 验收报告 §4/§7 + 路线研究 §5 |
| 2026-09-12 | signed · 双闸 approved（00 代签 · 2026-09-12 维护者会话授权）· 思考轮控制 R5 回填「已签收」 |
