# AICoding 架构专家团 · Phase 0 治理基线（G0 证据）

- **Team**：`dsh-coding-kit-arch`
- **主理人**：齐构成（aicoding-architecture-expert-team-lead）
- **目标项目**：`/Users/cyning/Desktop/Projects/dsh-coding-kit`（dsh-coding-kit@1.10.0）
- **建立时间**：2026-09-02
- **交付语言**：简体中文

---

## 1. 用户原始诉求（原文引用）

> 「启动 AICoding 架构专家团，对我当先的项目进行完整阅读、审查、评价、未来升级方案路线规划」

用户后续确认的细化选择：
- 运行时配置：**按推荐配置继续**
- 交付范围：**全量五份主文档**
- 审查重心：**架构与模块化 / 工程质量与测试 / 产品竞争力与生态位 / 升级路线与版本演进**（四项全选）

---

## 2. 运行时决策（Runtime Decisions）

| 字段 | 取值 | 依据 |
|------|------|------|
| `need_ingest` | **true** | 项目自带 130+ 份一手资料：`docs/`（80 md，含 tasks/spec/harness/feedback/releases）、`assets/`（61 md + 10 example + 5 yaml）、`src/`（17 ts）、`test/`（40）、`SPEC.md`/`CHANGELOG.md`/`README(.zh-CN)`/`RELEASING.md`/`package.json`。必须先归一化为统一结构化输入，否则下游成员各自读代码会得出不一致的基线。 |
| `need_research` | **true** | 用户明确要求「评价」与「未来升级方案路线规划」，需要外部标杆证据链（Claude Code Hooks / Cursor Rules / GitHub spec-kit / OpenAI Agents / Aider / Continue 等同类编码规范与流程门禁方案），否则「评价」退化为自说自话。 |
| `need_cloud_baseline_check` | **false** | 本项目是**本地 CLI + npm 分发**的 Node 包（`bin/dsh-coding-kit.js`、`main: lib/index.js`、`files: [bin,lib,assets,...]`），**没有任何云资源**（无 VPC / 子网 / 云厂商资源清单）。用户已确认按推荐配置，即同意关闭云现状核对。 |

### 由此产生的语义适配裁定（主理人裁决，全员必须遵守）

模板《部署设计》《安全设计》正文以云上业务系统为默认语境（VPC / CIDR / WAF / 安全组）。本项目必须按下列语义适配，**不得生造云资源、不得写"无"了事**：

| 模板章节 | 本项目语义适配 | 权威方 |
|---------|--------------|--------|
| §2.2 云资源清单 | 改为**分发与运行环境清单**：npm registry / GitHub Releases / GitHub Actions runner / Node engines 矩阵 / 消费者仓库落盘位置 | platform-architect |
| §3 部署拓扑 | 改为**分发拓扑**：源码仓库 → CI → npm publish → 消费者 `npx`/`dsh plugin add` → 落盘路径（`.dsh/skills`、`$HOME/.dsh/skills`、`.coding-kit`） | platform-architect |
| §4 部署流程 / 流水线 | 沿用：GitHub Actions CI、`prepublishOnly` 四道闸门、npm provenance、版本通道（latest / next / pinned） | platform-architect |
| §5.2.1 WAF 厂商与版本 | 不适用（无南北向流量）→ 改为**发布面防护**：npm 2FA、token 作用域、provenance 签名、依赖漏洞扫描 | security-architect（权威） |
| §6.1 密钥分级与存储 | 改为 **npm token / GITHUB_TOKEN / 发布凭据** 分级与轮转 | security-architect（权威） |
| §7.2 审计日志 | 改为 **发布审计与制品可追溯**：npm audit / provenance / CHANGELOG / git tag 签名 | security-architect（权威） |
| §5.1 网络分区 | 收敛为**信任域划分**：上游依赖域 / 构建域 / 发布域 / 消费者运行时域 | security-architect |

---

## 3. 模板 → 产物 → Owner → Gate 映射表

| 成员 | 主文档 | 模板路径 | 输出路径 | Gate |
|------|--------|---------|---------|------|
| knowledge-ingest-engineer（闻资料） | 资料摘要 | `<expert>/skills/aicoding-team-bootstrap/templates/material_digest.md` | `.workbuddy/output/material_digest.md` | G1 |
| research-analyst（查有据） | 调研报告 | `<expert>/.../templates/research_report.md` | `.workbuddy/output/research_report.md` | G2 |
| business-architect（许边界） | 高层架构设计 | `<expert>/.../templates/高层架构设计.md` | `.workbuddy/output/高层架构设计.md` | G3 |
| system-architect（高见远） | 系统设计 | `<expert>/.../templates/系统设计.md` | `.workbuddy/output/系统设计.md` | G4 |
| product-story-designer（顾全景） | UserStory | `<expert>/.../templates/UserStory.md` | `.workbuddy/output/UserStory.md` | G4 |
| platform-architect（毕落地） | 部署设计 | `<expert>/.../templates/部署设计.md` | `.workbuddy/output/部署设计.md` | G5 |
| security-architect（严守正） | 安全设计 | `<expert>/.../templates/安全设计.md` | `.workbuddy/output/安全设计.md` | G5 |

`<expert>` = `/Users/cyning/.workbuddy/plugins/cache/experts/aicoding-architecture-expert-team/1.0.0`

---

## 4. 自动校验命令（Gate 硬前置）

```bash
python3 bin/validate_template_compliance.py --output-dir .workbuddy/output --filter <文件名>
```

- 校验器由主理人补齐至 `bin/validate_template_compliance.py`（项目原本缺失）。
- 检查项：模板必填章节覆盖（缺章 = FAIL）、章节顺序、空章节、残留占位符（FAIL）、全文规模、硬指标章节存在性。
- **FAIL > 0 即不得进入人工审核**，退回 Owner 返工。
- WARN 不阻塞，但必须在 Gate 审核弹窗中向用户披露。

### 校验器全局硬约束（主理人裁定，全员适用）

校验器按模板标题做缺章比对，**只做结构合规、不做语义判定**——把「数据库设计」写成落盘格式 schema、把「部署架构」写成 npm 包形态、把「网络架构」写成分发链路，一概不判 FAIL；但把 `### 4.2 单表设计` 改成 `### 4.2 落盘格式设计`，立刻判 `E-MISSING-SECTION` → FAIL。

#### A 档 · 默认：保留标题，正文内做语义适配

> **保留模板原标题文字，只在正文内做语义适配。禁止改标题、禁止合并标题。**
> 例外：模板中的参数化标题（含 `<...>` 或 `~`，如 `### 5.2 US-2 ~ US-N（结构同 US-1）`）允许按前缀自行命名。

#### B 档 · 例外：声明式裁剪（Declared Omission）

《系统设计》模板第 7–13 行自带「**模版使用约定（按需裁剪）**」条款（其余六份模板无此条款），允许整节略过。校验器不得比模板更严，故全队统一执行：

| 规则 | 内容 |
|------|------|
| 允许略过 | 须在 §0 修订记录声明：`未启用：§x.x（理由：...）` |
| 层级继承 | 声明 `§4.4` 自动覆盖 `§4.4.1`/`§4.4.2`/`§4.4.3`，无需逐条声明 |
| **禁止序号顺延** | 保留原编号、允许不连续。**唯一收紧项**，理由：G5 交叉一致性 diff 按固定编号跨文档比对（部署 §2.2.4 ↔ 安全 §6.1、部署 §3.2 ↔ 安全 §5.1），顺延会导致跨文档引用与交叉 diff 全部错位 |
| 未声明而缺章 | 判 FAIL，错误信息直接提示应补的声明格式 |
| 已声明 | 记 `INFO I-DECLARED-OMISSION`，不阻塞 |
| 顺延检测 | 新增 `W-NUMBER-REUSE` WARN |

**分角色适用**：
- `system-architect`：A/B 两档均可用，模板条款明确允许的裁剪对象为 §4.4、§4.5、§3.4 等；模板明列的**不可裁剪章节**为 §1、§2、§3.1、§3.2、§4.1~§4.3、§5、§7。
- `platform-architect` / `security-architect`：模板无按需裁剪条款，**默认走 A 档**。
- `security-architect` 额外限制：云语义章节（§2.3、§5.2.1、§5.4 等）**必须先尝试语义适配**，仅当改写后确认零内容才可声明未启用，且理由须写明「已评估改写为 X，仍无适用内容」——安全设计的覆盖面本身即评审对象，不得轻易裁剪。
- 通用禁令：**不要为凑章节写空话**。改写后无实质内容时，宁可声明 `未启用`，也不要留空表或套话（空章节触发 `W-EMPTY-SECTION`，WARN 在人工审核时逐条披露）。

### 重叠区权威方分配补充（Phase 5 落盘资产归属交叉）

| 重叠项 | 权威方（决策） | 引用方（消费 + 校验） |
|-------|--------------|--------------------|
| 落盘路径清单（位置 / 写入时机 / 覆盖合并语义 / 按命令枚举写入口） | platform-architect | security-architect 消费，不重述、不自行补路径 |
| 落盘资产完整性（检测手段 / 恢复机制 / 对宿主与模型行为的影响评级） | security-architect | platform-architect 消费 |

**依赖链（已提前消除阻塞点）**：《安全设计》§5.2.2「分发可用性」的「下游 CI 熔断回滚通道」依赖《部署设计》§4.5 的 **pinned 回退语义**定义。若 §4.5 未定义 pinned 回退，security-architect 将走 `[中间确认]` 阻塞 Phase 5.3 —— 该要求已预置给 platform-architect。

**三层回滚不得混淆**：① 发布侧回退（维护者撤坏版本，§4.5）② 部署侧回滚机制（§6.1）③ **消费者侧回退**（消费者如何从坏版本退回，本项目独有、最易漏）。

**G5 交叉 diff 新增规则 —— 威胁单点建模**：同一威胁不得在两处建模。STRIDE 主类在 §1 威胁模型表占一行，缓解措施指向具体章节；其余章节只做交叉引用（如 §4.4 对 §5.3）。目的：避免 G5 diff 时同一威胁两处出现，保证威胁—缓解映射链单点可追溯。

**模板未覆盖的独有威胁面（必须显式建模）**：落盘资产被篡改 → 污染 `apply_coding_standards` 注入给模型的规范内容 → 影响模型行为。模板无对应章节，由 security-architect 在 §5.3 建模。

### 已下发的两项结构裁定

- **《系统设计》**（G4）：§4 数据库设计 → 落盘格式 schema 与迁移（manifest.json / graph.json / tasks-reviews 的 yaml+md / `docs/_tech_graph` yaml 源）；§5 部署架构 → npm 包形态与消费者本地落盘路径；§6 网络架构 → 宿主进程内调用 + 分发链路；§7 安全设计 → 只做架构侧引用，权威在 security-architect。
- **《部署设计》**（G5）§3.2.2 内部互联链路表：保留表头不删章，行替换为 5 条分发链路 —— L1 仓库↔CI runner（OIDC 令牌交换）、L2 CI↔npm registry（provenance 签名链）、L3 registry↔安装器（integrity/lockfile 校验、版本通道）、L4 安装器↔落盘路径（`.dsh/skills`/`$HOME/.dsh/skills`/`.coding-kit`/`.dsh/coding-kit` 的不覆盖策略）、L5 宿主进程↔插件包（cordis 加载 + `apply()` 注册工具）。

---

## 5. 阶段门清单

| Gate | 名称 | 通过条件 |
|------|------|---------|
| G0 | 启动确认 | Team 创建完毕；运行时决策、模板映射、术语表、输出路径、主 Owner 已明确 → **本文件即为 G0 证据** |
| G1 | 资料摘要审核 | `material_digest.md` 自动校验 + 人工审核通过 |
| G2 | 调研报告审核 | `research_report.md` 自动校验 + 人工审核通过 |
| G3 | 高层架构审核 | 《高层架构设计》自动校验 + 人工审核通过 |
| G4 | 中游设计审核 | 《系统设计》与《UserStory》两份均自动校验 + 人工审核通过 |
| G5 | 下游设计审核 | 《部署设计》与《安全设计》两份均自动校验 + 交叉一致性 diff + 人工审核通过 |
| G6 | 全量交付审核 | 术语统一、引用一致、冲突裁决完成，人工确认后归档 `delivery/` |

---

## 6. 术语表（启动时建立，G6 统一校验）

| 术语 | 全称 / 释义 | 备注 |
|------|------------|------|
| DSH | DeepSeek Harness，宿主运行时；本项目是其**插件** | `dsh plugin add` 安装面 |
| ICVO | Inform · Constrain · Verify · Orchestrate，纪律资产的方法论内核 | 项目 slogan |
| 插件面 / CLI 面 | **双入口**。插件面 = `apply_coding_standards` + `init_coding_kit`（宿主内工具）；CLI 面 = `npx dsh-coding-kit`（P0 门禁 + G1–G7 流程命令） | 二者不互相替代 |
| P0 | 门禁检查（`check` / `verify` / `gate-check` / `audit`），机械判定 | `dsh-coding-kit check` |
| G1–G7 | 过程命令（task/lifecycle/status/timeline 等），面向流程 | 与本文档 G1–G6 阶段门**同名不同义**，文档中必须显式区分 |
| hat | 角色帽制（00 delegate-only / 10 / 20 / 30 / 40 execute） | `eval/hat_identity_00_delegate` |
| S2 过程域 | `docs/tasks/`、`docs/harness/reviews/`、`docs/harness/invokes/by-task/`，任何命令**永不覆写** | 硬约束 |
| D5 | `test_strategy=required` 时的测试制品探测硬门禁 | 1.5.0 起 WARN 过渡分支已移除 |
| R-07 | `refresh-ide-blocks`，旧 `@cyning/harness` IDE 块字面量刷新 | A1–A4 自动 / B1–B5 仅报告 |
| HGM | Human Graph Model（`cli-graph-hgm.ts`），技术图谱子系统 | 待 G1 资料摘要确认后定稿 |
| graph yaml | `compile` / `check` / `export` 三件套，源仓库 dogfood 于 `docs/_tech_graph/` | 1.7.0 修正 graph_id 语义 |
| kit | 本项目自检 | 全文统一用 **kit**，不用 harness 指代本产品 |
| 旧产品线 | `@cyning/harness` → `dsh-coding-kit` 迁移，`from_version` 记录旧版本号 | 版本跨产品线不可比 |

---

## 7. 协作铁律（全员）

1. 所有跨成员信息流**必须经主理人中转**，成员之间禁止直连。
2. 每个任务只有一个主 Owner，禁止越权写入他人产物。
3. 未通过自动校验 + AskUserQuestion 人工审核，禁止推进下一阶段。
4. 成员必须**优先执行其 agent 文件中的原生工作流**（Step 0 / Step 1~N / 硬指标 / 定稿纪律），bootstrap 只做运行时注入，不改写流程。
5. 命中《中间确认协议》触发标准时必须以 `[中间确认]` 前缀 SendMessage 发起阻塞，**禁止静默选择**；`knowledge-ingest-engineer` 不适用该协议。
6. 模板是只读参考，但章节骨架与硬指标不得删减；产物中**不得残留任何占位符**。
7. 人工审核意见原样保留进入返工 prompt，主理人不得转述消化。
