# 03 · 可借鉴研究 · OpenSpec 与同侪

> **状态**：`draft` · 研究笔记（输入 2.0 SPEC，**非**实现授权）  
> **对照锚点**：本机 `/Users/cyning/Desktop/OpenSpec`（OPSX）· 高层架构 §3.1 Ruler / Spec Kit / Claude Code / Cursor  
> **纪律**：借形态与可发现性；**不**借云绑定；**不**用 OpenSpec 替换 ICVO 门禁护城河

---

## 1. 结论摘要（先读）

| 优先级 | 借鉴项 | 来源 | 对 kit 的落点 |
|--------|--------|------|----------------|
| **P0** | IDE **commands + skills** 双投递；`update` 刷新 | OpenSpec | F6 surfaces.`commands` + host apply/update |
| **P0** | **profile**：core / expanded（+ delivery 轴） | OpenSpec Profiles | 见 `01` / `02` |
| **P0** | Agent 友好 CLI：`--json` status/instructions | OpenSpec CLI | 扩展现有 `--json` 报告族；commands 调 CLI 不调臆测 |
| **P1** | 声明式 schema + template；`schema validate/which` | OpenSpec | 适配表 YAML 校验；**不是**把 hat 改成 OpenSpec artifact DAG |
| **P1** | 单一规范源 → N 落点 `apply` | Ruler | F6 编译器产品形态（已定调） |
| **P1** | 安装期物化 + 产物入仓可审 | Spec Kit | commands/skills 生成物应可 git diff |
| **P2** | `explore` 无结构探索再 commit 流程 | OpenSpec | 可选 `kit-explore`（expanded）；勿替代 10-spec |
| **P2** | soft verify 三维（完整/正确/一致） | OpenSpec `/opsx:verify` | **补充叙事**给 40 自检；**不可**替代 P0 exit 2 |
| **P2** | init `--tools` 多宿主一键勾选 | OpenSpec | host apply `--tools cursor,claude,…` |
| **P3** | workspaces / context-store / initiative（beta） | OpenSpec | **观察**；kit 多仓暂靠工作区 docs，2.0 不默认做 |
| **P3** | community schemas 生态 | OpenSpec | 远期；1.x/2.0 先自洽 |
| **弃选** | change delta → archive 作主流程 | OpenSpec | 与 task/闸/S2 过程轨重叠且削弱差异化 |
| **弃选** | 远程四层 Policy 引擎 | Cursor 云 | 零云冲突；F2 已钉文档级 |
| **已借** | exit 2 / failClosed | Claude Code / Cursor 语义 | F2 **已落地** |
| **已借** | 旧产品线迁移窗 | Kiro 范式 / F3 | **已落地**（deprecate） |

---

## 2. OpenSpec · 逐项

### 2.1 应借

| 项 | 观察 | kit 映射 | 风险 |
|----|------|----------|------|
| **Commands 可发现性** | Cursor `/opsx-*`、Claude `/opsx:*`、Codex skills | `kit-*` commands 目录 | 命名冲突；须稳定前缀 |
| **Skills 与 Commands 同生** | `delivery: both\|skills\|commands` | DSH 偏 skills+tools；Cursor 偏 both | 两套文案漂移 → 单源生成 |
| **`openspec update`** | 升级包后刷新项目内 skills/commands | `host update` / 扩展 `upgrade` | 勿扫 S2；local 块保护 |
| **Profile 分层** | core 短路径 / expanded 细控 | core 五命令；expanded 帽入口 | expanded 勿默认塞 30 |
| **`--json` 给 Agent** | `status` / `instructions` 结构化 | commands 内「先 CLI --json 再解释」 | 已有部分报告 schema，宜统一 |
| **config context/rules 注入** | `openspec/config.yaml` | 消费者 `.coding-kit` + apply profile 已有雏形；可文档化「项目上下文块」 | 勿与 ontology 双真值 |
| **schema fork/validate/which** | 工作流可实验 | **适配表** validate；hat 条文仍 prompts 真值 | 避免第二套方法论引擎 |
| **onboard** | 教学闭环 | `kit-onboard` expanded | 仅教学 |
| **非交互 init `--tools`** | CI/脚本友好 | F6 apply 同款 | 与现 `init --yes` 对齐风格 |

### 2.2 慎借 / 改造后借

| 项 | 为何慎 | 改造建议 |
|----|--------|----------|
| Artifact DAG（proposal→specs→design→tasks） | kit 已有 SPEC/task/hat/闸 | 保持过程轨；commands 只 **入口** 到既有帽 |
| `/opsx:apply` 流体改 artifact | 与「闸后改码」张力 | apply-standards ≠ 无闸写码 |
| `/opsx:verify` soft | 易被当成 P0 | 改名叙事为「自检清单」；硬闸仍 CLI |
| Delta specs merge | 与 `docs/spec` 产品契约不同义 | 消费者可 **并行** 装 OpenSpec；kit 不吞并 |
| Workspaces beta | 多仓视图有价值 | 2.1+ 再评；不挡 F6 MVP |

### 2.3 不借

| 项 | 原因 |
|----|------|
| 以 OpenSpec 替换 human_gate / S2 | 护城河与 1.x 契约 |
| Telemetry 默认开（可选学 opt-out 文案） | 零云/隐私姿态；若做须默认关 |
| 把「fluid not rigid」做成取消闸 | 与 failClosed 冲突 |

---

## 3. Ruler（B4）· 已定调加深

| 借 | 说明 |
|----|------|
| 声明式适配表 + `apply` 一次物化 | F6 主形态 |
| 多目标同构输出 | 与四类 surface 正交组合 |
| 离线 / npm 一条命令 | 对齐 `npx dsh-coding-kit` |

| 不借 | 说明 |
|------|------|
| Beta 实现细节 / 其目标全集盲抄 | 先 Cursor+Claude+DSH 三角 |
| 无门禁的「只注入文档」产品定位 | kit 必须保留 Verify |

---

## 4. GitHub Spec Kit（B3）

| 借 | 说明 |
|----|------|
| 模板优先级 / 扩展层 | 对标 profile + 包内 core vs 仓内 override |
| 产物入仓可审 | commands/skills 生成物进 git |
| 过程门禁范式 | 与 kit task/CLOSE 同族；保持自研闸语义 |

| 不借 | 说明 |
|------|------|
| 重 Python 仪式 / 过重 phase | 与「易用」冲突；OpenSpec 已证明轻量路径 |

---

## 5. Claude Code / Cursor（门禁与配置）

| 借 | 状态 |
|----|------|
| exit 2 阻断、failClosed | **F2 已做** |
| 项目级可共享配置 | always_on + commands 入仓 |
| hooks 事件模型 | **观察**：2.0 可用「文档建议 hooks 调 verify」，不绑死宿主 hooks API |

| 不借 | 原因 |
|------|------|
| Enterprise 云四层下发 | 零云 |
| IDE 绑定订阅 | 分发靠 npm |

---

## 6. 与「消费者并用 OpenSpec」的边界

ops-desk-ios 等仓可能 **同时** 存在 `openspec/` 与 kit：

| 域 | 归属 |
|----|------|
| 功能行为 propose/apply/archive | OpenSpec（若选用） |
| 人工闸 / verify exit / S2 / standards 注入 | **kit** |
| 命令前缀 | `opsx-*` vs `kit-*` **禁止混用语义** |
| 图谱 `_tech_graph` | kit（或仓脚本）；OpenSpec 不管 |

F6 文档应写清：**共存推荐**，非互斥替换。

---

## 7. 借鉴采纳表（已签 · 与 PLAN_2x 一致）

> **HG-SPEC-SIGNOFF=approved** · 2026-09-10

| ID | 决议 |
|----|------|
| B-CMD | **采纳** commands 表面 + core/expanded |
| B-UPD | **采纳** host update 刷新 skills/commands |
| B-JSON | **采纳** Agent CLI `--json` 契约补全 |
| B-PROF | **采纳** profile + delivery 轴 |
| B-SCH | **采纳** 适配表 schema validate |
| B-ONB | **推迟** onboard → expanded 后波 |
| B-EXP | **推迟** explore |
| B-WS | **推迟** workspaces → 2.1+ |
| B-DELTA | **拒绝** OpenSpec delta 作 kit 主路径 |

---

## 8. 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 初稿：OpenSpec 深挖 + Ruler/Spec Kit/门禁同侪；共存边界 |
| 2026-09-10 | 采纳表随 HG-SPEC-SIGNOFF 冻结 |
