# 06 · Waves 与验收（2.2.0 闭环起步）

> **状态**：`signed`（**HG-SPEC-SIGNOFF=approved** · **HG-NEXT-PLAN=approved** · 人 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass）  
> 每波独立 task · 独立提交（`feat(2.2-W<n>): …`）· 波末 `npx spec-wave gate-check --task <task.md>`

---

## W0 · 签收（**已签收** · 2026-09-11）

- [x] `HG-SPEC-SIGNOFF=approved`（人 · 2026-09-11 会话预授权 · 00 代签落表 · 冻结 D-PINS-EXIT / D-SPEC-213-ROW / D-PINS-SCOPE-8 / D-W2-ABS-PATH-UX · 全部采纳推荐）
- [x] `HG-NEXT-PLAN=approved`（人 · 2026-09-11 会话预授权 · 00 代签落表 · 此前**零实现代码改动**）
- [x] 20-spec-audit 书面审落盘 [`../harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md`](../harness/reviews/spec_2_2_closed_loop_start_audit_R1_20260911.md)（R1 pass 零阻塞）
- [ ] 00 拆 W1–W7 task（每波一个 · **W1 已开单**：`docs/tasks/active/task_2_2_closed_loop_w1_release_pins.md`）

> W0/D0「推广物料翻新」已由上一轮外部完成（`delivery/promotion/` 4 份 + `package.json` description/keywords，工作区未提交），**仅引用不重做**；各波提交不得裹挟这些未提交改动（D0-PROT）。

## W1 · A1 · 版本/身份钉自动化（核心）

- [ ] `assets/release-pins.yaml` 单一声明源（10 行钉面全落数据：path / extract / expected / required / fixable）
- [ ] `spec-wave pins check [--json]`：干净树 exit 0；偏差非 0（口径按 D-PINS-EXIT）· `--json` 含 `path/expected/actual/status`
- [ ] `spec-wave pins fix [--yes]`：默认 dry-run · 写前备份 · **S2 机械拒写** · 幂等
- [ ] 门禁接线：`prepublishOnly` 追加 `pins check` · `ci.yml` 增步骤 + test job 补 `timeout-minutes`
- [ ] `docs/spec/README.md` 补 2.1.3 行（形态按 D-SPEC-213-ROW）
- [ ] 新增 `test/pins-consistency.test.ts`
- [ ] **破坏性自证**（验收硬条款 · 报告须贴真实命令与完整输出）：
  - [ ] ontology `product_semver` 改 `9.9.9` → `pins check` 报错且指出文件与行
  - [ ] `pins fix --yes` 改回 `2.1.3`
  - [ ] 同法证 `pins-consistency` 测试在失配时真失败
- [ ] **反向验证**：`pins fix` 对 S2 目录拒写（实际尝试或测试）
- [ ] 四门绿（typecheck / test / build / test:lib）· `HG-AUDIT-R1`（开波前人签）· 波末 `gate-check`

## W2 · C1 + C3 · 安全封堵

- [ ] `--task` / `--spec` 拒 target 外绝对路径（`resolveTaskPath` 层收口 · 覆盖 cli.ts 4 调用点）
- [ ] `--target` git-root 归属校验
- [ ] `verify --task /etc/hosts` 类输入非 0 退出且不留读痕（负向测试）
- [ ] `cli.ts:403/500/548` 三处 `目标:` 打印改相对路径 · stdout 无绝对目标路径断言
- [ ] 拒止报错含迁移指引（D-W2-ABS-PATH-UX）
- [ ] 回归：合法相对路径全绿 · 四门绿 · `HG-AUDIT-R1` · `gate-check`

## W3 · C2 · `verify --json` 补字段

- [ ] `--json` 增 `traceId` / `exitCode` / `source` / `injectedFiles`（契约只增不改）
- [ ] 测试断言四字段 + 旧字段回归
- [ ] 四门绿 · `HG-AUDIT-R1` · `gate-check`

## W4 · D1 + D3 · 上手断档

- [ ] `init` 成功输出 3 步 quickstart（含 `sync prompts --yes` 显式化 · 命令全部真实存在）
- [ ] README 双语「核心对象」节（task.md / spec.md：是什么 / 从哪来 / 放哪 / 最小示例）
- [ ] **未**物化任何示例文件进消费者 `docs/tasks/`（S2 红线 · 反向检查）
- [ ] 四门绿 · `HG-AUDIT-R1` · `gate-check`

## W5 · D2 · 术语表

- [ ] 仓根 `GLOSSARY.md` 双语 · 4 组概念（task/spec · Harness · hat · kit-*）+ 事实卡 §12 保留词
- [ ] README 双语首屏链接有效
- [ ] 无事实卡 §10/§11 违禁表述 · 无无出处数字
- [ ] 四门绿 · `HG-AUDIT-R1` · `gate-check`

## W6 · B1 · 三宿主

- [ ] `copilot` / `codex` / `windsurf` 落表 · `host validate` 过
- [ ] 三宿主 `apply --dry-run` 落点正确 · `--yes` 物化 + `update` 粘性链路通
- [ ] 新增测试钉死 · 4 旧宿主回归不破 · S2 拒写无回归
- [ ] 新宿主版本文案落点入钉面（`release-pins.yaml` 数据更新，不改代码）
- [ ] 对外文案未提前宣称新宿主数
- [ ] 四门绿 · `HG-AUDIT-R1` · `gate-check`

## W7 · E1 + C7 · 小清理

- [ ] `HARNESS_META_HEADING` 常量 · 18 处字面量 grep 归零 · 输出字节无漂移
- [ ] dest 白名单显式常量（`.coding-kit` / `.dsh/coding-kit`）· `.cyning-harness` 排除注释
- [ ] 四门绿 · `HG-AUDIT-R1` · `gate-check`

---

## 产品验收（2.2.0 发版前 · 汇总）

| # | 条款 | 来源波 |
|---|------|--------|
| A-2.2-01 | `pins check` 干净树 exit 0 · 破坏性自证两步输出已贴报告 | W1 |
| A-2.2-02 | `pins fix` S2 拒写已反向验证 | W1 |
| A-2.2-03 | `prepublishOnly` 与 CI 含 `pins check` · CI test job 有 `timeout-minutes` | W1 |
| A-2.2-04 | 任意绝对路径 `--task` 被拒且有负向测试 | W2 |
| A-2.2-05 | 命令 stdout 无绝对目标路径 | W2 |
| A-2.2-06 | `verify --json` 含 `traceId/exitCode/source/injectedFiles` | W3 |
| A-2.2-07 | `init` 输出 3 步 quickstart · README 双语定义核心对象 | W4 |
| A-2.2-08 | 双语 `GLOSSARY.md` + README 首屏链接 | W5 |
| A-2.2-09 | 7 宿主（4+3）`host validate/apply/update` 链路通（落地后才可对外宣称） | W6 |
| A-2.2-10 | `## Harness 元信息` 字面量归零 · dest 白名单单一真值 | W7 |
| A-2.2-11 | 全程：S2 零覆写 · P0 门禁零绕过参数 · 事实卡零违禁 | 硬纪律 |
| A-2.2-12 | `npm run typecheck` + `npm test` 每波绿 · 发版前 `pins check` exit 0 | 硬纪律 |

---

## failure_paths（跨波汇总 · 各主题文档为准）

| ID | 触发 | 行为 |
|----|------|------|
| F-X-01 | 未获 HG-NEXT-PLAN 即改实现 | 拒开工（00 §4） |
| F-X-02 | 任何写盘落 S2 | 机械拒写 · 验收 FAIL |
| F-X-03 | 引入 `--force` / `--allow-*` 绕过门禁 | 拒设计（P0-GATE） |
| F-X-04 | 文案违禁（事实卡 §10/§11）或宣称未落地能力 | 打回（FACT-CARD） |
| F-X-05 | 范围蠕入 2.3/3.0 项（A2–A6 / B2–B5 / C4–C6 / D4–D6 / E2–E5 / F1） | 退回（00 §2） |
| F-X-06 | 提交裹挟 D0 未提交改动 | 打回重提（D0-PROT） |
| F-X-07 | W6 发现需改 schema | STOP · freeze 升级回 10-spec |

---

## 思考轮（正文摘要）

### R0 · 证据

PROMPT-2.2.0（§3 波次表 · §4 W1 详规 · §6 硬约束）+ 路线研究（五路取证 · 加权评分 ≥4.0 入 2.2）+ 事实卡（文案纪律）；16 条前提校核全部实测复核，仅 cli.ts 绝对路径打印点位由 1 修正为 3。

### R1 · 范围

做 W1–W7；不做 A2–A6 / B2–B5 / C4–C6 / D4–D6 / E2–E5 / F1（00 §2 非范围表逐条归属 2.3/3.0）。

### R2 · 方案

各主题文档 ≥2 方案对比已给：声明源数据驱动（荐）· exit 2（荐）· S2 硬拒写（荐）· patch 收尾行（荐）· 复用 agents 资产面（荐）· 常量集中 cli-shared（荐）。

### R3 · 边界

S2 永不可写（含 pins fix 与消费者仓示例 task）；P0 不可绕过；契约只增不改；schema 冻结。

### R4 · 可测性

W1/W2/W3/W6/W7 = required（W1 含破坏性自证 + S2 拒写反向验证）；W4/W5 = 文本断言 + 抽检；全程四门绿。

### R5 · 签收就绪

本系列 draft 齐备。（**2026-09-11 已签收**：HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved · 人 会话预授权 · 00 代签落表 · 20-spec-audit R1 pass 零阻塞 · D-* 冻结采纳推荐。）**下一棒**：00 拆 W1–W7 task（W1 已开单）→ 各波 20-task-audit R1 + 人签 HG-AUDIT-R1 → 30 派工。

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~SPEC 定稿 · 冻结全部 D-*~~（已冻结 · 采纳推荐） |
| **HG-NEXT-PLAN** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~开 W1 实现~~ · 授权落表后可拆 task 开工 |
| HG-AUDIT-R1（W1–W7 每波） | pending | 各波 30 改码前 |
| HG-RELEASE（2.2.0） | pending | publish · **仅人** |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | draft · 10-spec |
| 2026-09-11 | signed · 双闸 approved（00 代签 · 审查文 R1 pass）· W0 清单同步 · W1 task 开单 |
