# 2.2.0 · 闭环起步（closed-loop start）· SPEC 系列

> **状态**：`signed`（**HG-SPEC-SIGNOFF=approved** · **HG-NEXT-PLAN=approved** · 人 · 2026-09-11 会话预授权 · 00 代签落表）  
> **spec_slug**：`2_2-closed-loop-start`  
> **目标包**：`spec-wave@2.2.0`（**minor**）  
> **上游规划**：[`PLAN_2_2_closed_loop_start_v1_zh.md`](../../roadmap/PLAN_2_2_closed_loop_start_v1_zh.md)（含 16 条前提校核）  
> **任务来源**：[`.workbuddy/output/PROMPT-2.2.0-落地-交给SpecWave-agent.md`](../../../.workbuddy/output/PROMPT-2.2.0-落地-交给SpecWave-agent.md)  
> **判断依据**：[`.workbuddy/output/路线研究-SpecWave-2.2-3.0.md`](../../../.workbuddy/output/路线研究-SpecWave-2.2-3.0.md)  
> **文案纪律**：[`.workbuddy/output/推广事实卡-2.1.3.md`](../../../.workbuddy/output/推广事实卡-2.1.3.md)  
> **基线**：`spec-wave@2.1.3` **published**（406 用例 / 54 文件 / 48.7s 全通过 · typecheck 0 错 0 警）  
> **Open Folder**：本仓根（本地目录可仍名 `dsh-coding-kit/`）

---

## 一句话

2.2.0 只做高性价比、低代价的「闭环起步」：**W1（A1）版本/身份钉自动化**把反复发生的版本文档滞后变成机械可验证；W2–W7 依次封堵任意文件读、补 `--json` 可观测字段、消除上手断档、补术语表、扩三宿主、做小清理——**不动 schema、不动架构、不加 hooks**。

---

## 读序

1. 路线研究（证据）→ 规划 PLAN_2_2（含前提校核）
2. [`00_policy_and_boundaries.md`](./00_policy_and_boundaries.md)（S2 禁区 · P0 门禁 · 范围外声明）
3. [`01_release_pins_v1.md`](./01_release_pins_v1.md)（**W1 · A1 · 本次核心**）
4. [`02_security_closure_v1.md`](./02_security_closure_v1.md)（W2 C1+C3 · W3 C2）
5. [`03_dx_onboarding_v1.md`](./03_dx_onboarding_v1.md)（W4 D1+D3 · W5 D2）
6. [`04_host_expansion_v1.md`](./04_host_expansion_v1.md)（W6 B1）
7. [`05_hygiene_v1.md`](./05_hygiene_v1.md)（W7 E1+C7）
8. [`06_waves_and_acceptance_v1.md`](./06_waves_and_acceptance_v1.md)（每波验收 + failure_paths 汇总 + 思考轮）

---

## 待决冻结项（**已冻结 · 采纳推荐** · 人 2026-09-11 会话预授权 · 00 代签落表）

| ID | 定案（采纳推荐） | 说明 |
|----|------|------|
| **D-PINS-EXIT** | **定案：`pins check` 偏差 → exit 2** | 与 P0 门禁 `failClosed` 语义一致（事实卡 §5：`verify`/`gate-check`/`audit` 均 exit 2）；`check` 恒 exit 0 的约定仅适用信息性 `check` 命令，`pins check` 是发版门禁不是信息命令。备选：exit 1（用法/非阻断失败档） |
| **D-SPEC-213-ROW** | **定案：补 patch 收尾行，不建 `2_1_3` 夹** | 依据：2.1.3 无独立 SPEC 夹，其内容为 2.1.2 改名收口残留修复（git 8797b76 `rename closeout residual fixes` + 82fe0dc mark published）；按 `doc-health` 行例在 `docs/spec/README.md` 索引补一行标注「patch 收尾 · 属 2_1_2 系列残留」。备选：建 `2_1_3-traceability` 夹（成本高于价值） |
| **D-PINS-SCOPE-8** | **钉面 #8（`docs/spec/README.md` minor 行）语义入 `release-pins.yaml` 数据** | 提取方式 = 「索引表存在当前 minor 对应行或标注行」，作为数据声明而非硬编码 |
| **D-W2-ABS-PATH-UX** | **定案：绝对路径输入 → 拒止 + 报错给迁移指引 · exit 1** | 存量 CI 可能合法使用绝对路径；拒止文案须给出相对路径写法。exit 码定 1（用法错误档），已签 |

---

## 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = PROMPT-2.2.0 + 路线研究（五路取证）+ 事实卡；主题 = minor 2.2.0「闭环起步」，非架构轨 | no |
| R1 | 范围 = W1–W7（W0/D0 已完成仅引用）；非范围 = A2–A6 / B2–B5 / C4–C6 / D4–D6 / E2–E5 / F1（属 2.3/3.0，见 00 §2） | no |
| R2 | 各主题文档内给出 ≥2 方案对比：pins 声明源（yaml 数据驱动 **荐** / TS 硬编码 弃）、exit 码（2 **荐** / 1 备）、2.1.3 补行（索引行 **荐** / 建夹 弃）、S2 保护（硬拒写 **荐** / warn 弃） | no |
| R3 | 边界：S2 永不可写（含 pins fix）；P0 门禁不可绕过；W4 不物化示例 task 进消费者 `docs/tasks/`；对外文案受事实卡 §10/§11 约束 | no |
| R4 | `test_strategy=required`（W1/W2/W3/W6/W7 均要求新增/联改测试；W1 含破坏性自证与 S2 拒写反向验证）；W4/W5 为文档面以抽检 + 链接/文本断言为准 | no |
| R5 | **已签收**（2026-09-11 · HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved · 人 会话预授权 · 00 代签落表 · 20-spec-audit R1 pass 零阻塞 · D-* 冻结采纳推荐）· 下一棒：00 拆 W1–W7 task（W1 已开单）→ 各波 HG-AUDIT-R1 → 30 派工 | no |

**residual_risks**：钉面对 README 双语正则有脆性（缓解：正则入 `release-pins.yaml` 数据、fix 幂等）；W2 拒止绝对路径可能误伤存量 CI（缓解：D-W2-ABS-PATH-UX 迁移指引）；`docs/spec/README.md` 的 2.1.3 补行属对既有文档的手工修复，须在 W1 内与 pins 机制同波落地以免再滞后。

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表） | ~~SPEC 定稿 · 冻结 D-PINS-EXIT / D-SPEC-213-ROW / D-PINS-SCOPE-8 / D-W2-ABS-PATH-UX~~（已冻结 · 采纳推荐） |
| **HG-NEXT-PLAN** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表） | ~~开 W1 实现~~ · 授权落表后可由 00 拆 task 开工 |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | draft 立档 · 10-spec · 源自 PROMPT-2.2.0 + 路线研究 |
| 2026-09-11 | signed · 双闸 approved（00 代签 · 审查文 R1 pass）· 思考轮控制表 R5 回填「已签收」 |
