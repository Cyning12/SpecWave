# AICoding 架构设计 · 行业调研报告

> 本文档为《AICoding 架构设计》核心产物之一，定位为**行业调研报告（research_report）模版**。
> 上游输入：主理人转交的用户诉求；
> 下游输出：驱动 `business-architect`（业务架构师）的行业调研判断，最终落入《高层架构设计》的 §3 行业调研章节。

> **工具说明**：由 `research-analyst`（研究分析师 - 查有据）负责产出，经 G2 自动校验与人工审核通过后方可进入下游消费。
> **结构纪律**：全文按「事实 → 对比 → 建议 → 风险」四段式组织，严禁四段之间倒序或跳段。

---

## 模版使用说明（必读）

> ⚠️ **本文件是「模版」而非真实调研报告**。所有文字、表格中出现的业务内容（如"投诉场景 / 实时辅助 / NBA 引擎"等）**仅作为示意，便于读者理解填写思路**，并不代表当前项目的真实调研结论。

**约定的占位符 / 示例标记**：

| 标记 | 含义 | 处理方式 |
| --- | --- | --- |
| `<...>` 或 ``<...>`` | 占位符，需替换为真实调研结果 | **必须**替换或删除 |
| `示例：` / `例：` 前缀 | 仅作为填写参考的示例 | **必须**替换为真实内容，或整行删除 |
| `YYYY-MM-DD` / `<n>` / `<x>` | 待填具体日期 / 数字 / 序号 | **必须**替换为真实数值 |
| `[待验证]` | 调研中无法确认的信息 | 保留至人工审核阶段，最终**必须**标注状态（已验证 / 已排除 / 降级假设） |

**填写纪律**：
1. 文档定稿前，全文不允许残留 `<...>`、`示例：` / `例：`、`YYYY-MM-DD`、`[待验证]` 等占位标识。
2. 表格中的示例行可以直接覆盖，但**列结构（表头）不允许删除**——它代表了硬性约束。
3. 章节中的"硬指标"段落**不是示例**，是该章节产出物必须满足的合格基线，需保留。
4. 所有调研结论必须可追溯到**可核验的公开来源**（官网、技术白皮书、公开基准测试、社区仓库），严禁凭空编造。
5. 附录描述的是生成方法论与工具清单，属于元信息，**不需要按业务替换**。

---

## 0. 元信息：修订记录

> 记录报告版本、调研范围、调研人、调研时间，确保结论可追溯。

```yaml
标题: dsh-coding-kit - 行业调研报告 v1.0
版本: v1.0
状态: Reviewing   # Draft | Reviewing | Approved | Deprecated
创建日期: 2026-09-04
最后更新: 2026-09-04
调研人: research-analyst（研究分析师 · 查有据）
审核人:
  - 主理人（aicoding-architecture-expert-team-lead）

关联文档:
  上游输入:
    - 用户诉求: 启动 AICoding 架构专家团，对当前项目进行完整阅读、审查、评价、未来升级方案路线规划（审查重心四项全选）
    - 调研目标: 服务审查重心 ③ 产品竞争力与生态位 与 ④ 升级路线与版本演进
    - 资料基线: .workbuddy/output/material_digest.md（G1 已通过，冲突 X1–X20）
    - 治理基线: .workbuddy/phase0_charter.md
  下游产出:
    - 高层架构设计 §3 行业调研: 将由 business-architect 整合到此章节
```

| 版本 | 日期 | 作者 | 变更内容 | 评审状态 |
| --- | --- | --- | --- | --- |
| v1.0 | 2026-09-04 | research-analyst（查有据） | 初稿：五家标杆盘点 + 五维加权对比 + 取舍建议 + 风险与待确认项；四个自检节点结论见 §8 | Reviewing |

**阅读与标注约定（全文适用）**：

- **事实** = 有可核验公开来源（官方文档 / 官网公告 / 开源仓库 README / 基金会新闻稿）支撑的陈述，行内标注`已核实`并给出来源编号（SR-xx）。
- **推断** = 由两项及以上事实交叉归纳得来，无单一来源直接陈述，行内标注`推断`并给出归纳所依据的来源。
- **建议** = research-analyst 的取舍倾向，**不构成已冻结决策**；最终业务边界与产品形态由 `business-architect` 在 G3 裁决。
- **风险** = 尚未发生、但有明确触发条件的负面情形，只在 §5 出现。
- **术语**：全文用 **kit** 指代本产品（dsh-coding-kit@1.10.0）；**harness** 仅指旧产品线 `@cyning/harness` 或 DSH Harness 宿主。**「项目过程命令 G1–G7」**（kit 的 CLI 过程命令，如 `check`/`verify`/`task lint`）与**「专家团阶段门 G1–G6」**（本文档所处流程的门）同名不同义；本报告出现的 G2 一律指**专家团阶段门**，涉及 kit 命令时改用命令原名（如 `verify`）。

---

## 1. 调研问题收敛

> 调研启动前，先围绕用户诉求收拢为明确的调研问题集合，确保调研不偏离当前项目背景。

### 1.1 原始调研种子

> 从用户诉求中提取需要调研验证的论题，逐条给出调研优先级。

| 编号 | 待验证论题 | 来源（用户诉求要点） | 调研优先级 | 备注 |
| --- | --- | --- | --- | --- |
| S1 | 主流 AI 编码工具在「**规范注入 + 流程门禁**」上的能力基线是什么？谁做到了、做到什么程度？ | ④ 升级路线与版本演进：kit 的 P0 门禁（`check`/`verify`/`gate-check`/`audit`）是否仍是差异化能力 | 高 | 直接决定 kit 核心竞争力是否成立 |
| S2 | 各大宿主（Claude Code / Cursor / Copilot / DSH / Windsurf 等）的 skill / rule / plugin 机制与发现路径 | ③ 产品竞争力与生态位：kit 作为 DSH bundle 插件，其规范分发生态位在哪 | 高 | 决定 kit 的宿主适配策略 |
| S3 | 从「团队内部编码规范」演化为「可分发的开发者产品」的产品化路径有哪些成熟范式 | ③ 产品竞争力与生态位：kit 已由内部规范演化为 npm 包，下一步形态 | 高 | 决定升级路线的产品形态选项 |
| S4 | 同类工具在**破坏性变更治理与升级路径设计**上的做法 | ④ 升级路线：kit 面临 1.x 演进 + 旧产品线 `@cyning/harness` 迁移双重问题 | 中 | 有可直接抄的行业先例 |
| S5 | AI 编码纪律/门禁赛道的商业模式与社区采纳度现状 | ③ 产品竞争力与生态位：判断是否值得商业化 / 生态扩张 | 中 | 影响路线图投入规模判断 |

**收敛依据（推断）**：用户诉求审查重心四项全选，主理人指定本轮调研直接服务 ③ 与 ④；① 架构与模块化、② 工程质量与测试由 G1 资料摘要与后续 G3/G4 承接，本报告不重复调研（依据：主理人任务书 §4「你的调研直接服务于 ③ 与 ④」）。

### 1.2 调研问题收敛

> 将 §1.1 的种子收敛为 3~5 个可执行的调研问题。每条问题必须明确调研对象、调研目标和产出预期。

| 编号 | 调研问题 | 调研对象 | 调研目标 | 预期产出 | 关联种子 |
| --- | --- | --- | --- | --- | --- |
| Q1 | 主流 AI 编码宿主在「规范注入 → 强制门禁」两级能力上的事实基线是什么？哪些能力是「机械阻断」而非「建议性提示」？ | Claude Code、Cursor、GitHub Copilot/VS Code、Gemini CLI、AWS Kiro 的官方文档 | 区分「上下文注入」（不保证执行）与「确定性拦截」（保证执行）两类能力，给出可核验的机制与配置位 | 能力基线事实表（§2.3 上半） | S1 |
| Q2 | 各宿主的 rule / skill / hook / extension 机制与发现路径（目录约定、作用域、优先级）差异如何？跨宿主分发同一套规范的最小公分母是什么？ | 同上 + `AGENTS.md` 官方站 + Agent Skills 规范站 + Linux Foundation AAIF 公告 | 明确 kit 若要跨宿主分发，必须输出哪些文件、落在哪些路径、谁覆盖谁 | 宿主适配矩阵（§4.1 / §4.3） | S2 |
| Q3 | 从「团队内部编码规范」演化为「可分发的开发者产品」有哪些成熟范式（分发形态、扩展机制、模板优先级、目录约定）？ | GitHub spec-kit、`Ruler`（`@intellectronica/ruler`）、Claude Code 插件市场、Gemini CLI Extensions、Kiro Powers | 抽出可复用的产品化骨架：单一真值源 → 分层覆盖 → 宿主落地 | 产品化范式清单（§3.2 / §4.1） | S3 |
| Q4 | 同类工具在破坏性变更治理、旧产品线迁移与下线时间表上的具体做法？ | AWS 官方 Q Developer 下线公告、Gemini CLI extension `migratedTo`、npm `deprecate` 治理实践 | 为 kit 的 1.x 演进与 `@cyning/harness` 迁移给出可抄的时间表与工具组合 | 迁移治理范式（§4.1 / §4.3 / §5.2） | S4 |
| Q5 | AI 编码纪律 / 门禁赛道的商业模式与社区采纳度现状如何？是否支撑 kit 商业化或生态扩张？ | spec-kit 官方站生态数据、AGENTS.md 采纳数据、awesome-cli-coding-agents 星标榜、各产品公开定价 | 判断 kit 的生态位大小与可行的商业模式边界 | 生态位判断（§3.2 / §5.1） | S5 |

---

## 2. 事实：标杆系统盘点和方案详述

> **四段式「事实」段**。只陈列调研发现的事实，不做引申建议或边界裁决。

### 2.1 行业标杆清单

> 完整盘点调研覆盖的所有标杆系统，给出标签化画像。

**硬指标**：≥ 3 家；至少包含 1 家头部 SaaS 代表 + 1 家开源/自研代表。

**取舍标准（来自主理人任务书 §5）**：优先选与 kit 在「规范注入机制 / 门禁强制性 / 宿主耦合方式 / 分发形态」上可比的对象，而非泛泛的 AI 编码助手。据此从 12 家候选池中收 5 家，择优理由见最后一列。

| 编号 | 标杆系统 | 厂商 / 社区 | 部署形态 | 场景覆盖 | 技术亮点 | 商业模式 | 调研来源 | 入选理由（与 kit 可比性） |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B1 | Claude Code（含 Hooks / Agent Skills / Plugins & Marketplace） | Anthropic | 本地 CLI + 云模型 | 终端原生 agentic 编码 | 约 30 个生命周期钩子事件；`PreToolUse` 可 `deny`、退出码 2 可阻断；插件可打包 skills/agents/hooks/MCP/LSP | 订阅制（Pro 约 20 USD/月起）+ 用量计费 | SR-01, SR-02, SR-03, SR-10 | 门禁强制性最强、且有完整分发形态（marketplace）的宿主，是 kit「P0 门禁 + npm 分发」的直接对照 |
| B2 | Cursor（Rules + Hooks + Skills） | Anysphere（Cursor） | 桌面 IDE（VS Code fork）+ 云 | IDE 内 agentic 编码 / 补全自动 | `.cursor/rules/*.mdc` 四激活模式；`.cursor/hooks.json` 含 `failClosed` / `loop_limit`；四层配置优先级 Enterprise > Team > Project > User | 订阅制（Pro 约 20 USD/月起） | SR-04, SR-05 | 唯一提供「钩子失败即阻断」与「组织级强制下发」的 IDE 宿主，对照 kit 的「组织级规范强制」诉求 |
| B3 | GitHub spec-kit（`specify` CLI） | GitHub（开源，MIT） | 本地 CLI + 模板文件 | 规范驱动开发（SDD）全过程 | Constitution→Specify→Clarify→Plan→Tasks→Analyze→Implement 门控流程；扩展/预设/项目本地覆盖四层模板优先级；30+ agent 集成 | 开源免费（可自建 catalog，离线/防火墙内可用） | SR-06, SR-07 | 与 kit「过程轨 + 模板资产 + 不覆写」最接近的开源方法论产品，且其 30 宿主集成正面对应 kit 的单宿主困境 |
| B4 | Ruler（`@intellectronica/ruler`） | intellectronica（开源，MIT） | 本地 CLI（npm 分发） | 集中式 AI 编码规范管理与分发 | `.ruler/` 单一规范源 + `ruler.toml` 声明，`ruler apply` 编译分发到 32 类 agent 原生配置位 | 开源免费（npm） | SR-11 | **与 kit 定位重合度最高**：同为 npm 分发的规范产品、同为「集中规范源 → 多宿主落盘」，是 kit 生态位的最直接参照物 |
| B5 | AWS Kiro（Specs + Steering + Hooks + Powers） | Amazon Web Services | 桌面 IDE（Code OSS fork）+ CLI + AWS 云 | 规格驱动的 agentic 开发环境 | Specs 三阶段产物入仓；Steering 文件三种加载模式；事件驱动 Hooks；Powers 为可组合能力模块 | 订阅制（Free / Pro / Pro+ / Power 多档） | SR-12, SR-13 | 规格驱动 + 门禁 + 分发的完整闭环，且**正在执行一条旧产品线（Amazon Q Developer）下线迁移**——直接对应 kit 的旧产品线迁移课题 |

**未入选候选及理由（推断）**：OpenAI Codex CLI / Agents SDK、Google Gemini CLI、Aider、Continue、Cline / Roo Code、Windsurf / Cascade、OpenHands、Sourcegraph Cody —— 其规范注入与门禁机制已被 AGENTS.md / Agent Skills 两大开放标准统一（见 §2.3），作为独立标杆已无增量信息；其中 Gemini CLI 的 extension `migratedTo` 字段仍作为 S4 的补充证据在 §2.3 与 §4.1 引用（SR-14）。Amazon Q Developer 未单列，因其已并入 B5 的下线迁移叙事。

### 2.2 标杆方案详述

> 每家标杆逐一展开（至少 3 家必须有详述）；每段要区分「已核实的事实」与「推断/假设」。

#### 2.2.1 B1 - Claude Code（Anthropic）

| 维度 | 内容 | 置信度 |
| --- | --- | --- |
| 产品定位 | 终端原生的 agentic 编码工具；通过 Hooks / Skills / Subagents / Plugins 四层机制把「团队约定」从建议升级为确定性行为 | 已核实（SR-01, SR-03） |
| 目标用户 | 习惯终端工作流的专业开发者；需要把工程纪律固化进 agent 循环的团队 | 已核实（SR-02） |
| 核心能力 | ① Hooks：约 30 个生命周期事件（`PreToolUse`/`PostToolUse`/`Stop`/`SubagentStop`/`UserPromptSubmit`/`SessionStart`/`PreCompact`/`ConfigChange`/`FileChanged`/`CwdChanged` 等）；② Skills：渐进式加载的 `SKILL.md`；③ Subagents；④ Plugins 打包 skills/commands/agents/hooks/MCP/LSP/monitors/bin/settings | 已核实（SR-01, SR-03） |
| 架构特点 | Hook 为进程外脚本：stdin 收 JSON、stdout 回 JSON、退出码决定语义；`PreToolUse` 走 `hookSpecificOutput.permissionDecision`（allow/deny/ask/defer），`PostToolUse`/`Stop` 走顶层 `decision: block` | 已核实（SR-01） |
| 部署形态 | 本地 CLI 运行，模型走 Anthropic 云；配置分 user / project / local / managed 四种作用域 | 已核实（SR-03） |
| 集成方式 | 项目级 hooks 写入 `.claude/settings.json` 并随仓库提交，团队自动获得；插件经 `/plugin marketplace add` 从 GitHub / Git URL / 本地目录 / npm / pip 安装，`claude plugin validate .` 校验 | 已核实（SR-02, SR-03） |
| 定价模式 | 订阅制 + 用量计费（公开资料口径：Pro 档约 20 USD/月起） | 综合归纳（SR-01, SR-20） |
| 优势 | 官方定位近乎明示地对比了「CLAUDE.md 是请求，不是保证」与「Hook 是确定性代码」——把纪律从「通常会听」变成「不能跳过」，与 kit 的 P0 门禁哲学同源 | 综合归纳（SR-02） |
| 局限 | 门禁能力深度绑定宿主进程：Enterprise 托管策略（`managed-settings.json`）可覆盖项目级配置；hook 语义随版本演进（文档已出现 `InstructionsLoaded`、`ConfigChange` 等新事件） | 已核实 + 推断（SR-01, SR-03） |
| 对本项目的参考价值 | kit 的 `verify`/`gate-check` 是**进程内机械判定**，不依赖宿主 hook 是否存在——这是相对 B1 的差异化；但 B1 证明了「阻断语义必须用退出码/JSON 决策表达，而不是提示词表达」这一行业共识，值得 kit 在对外文档与 hook 互操作层对齐 | 推断（依据 SR-01, SR-02 + kit README §Host usage） |

#### 2.2.2 B2 - Cursor

| 维度 | 内容 | 置信度 |
| --- | --- | --- |
| 产品定位 | AI 优先的 IDE（VS Code fork），以 Rules 注入上下文、以 Hooks 在 agent 循环关键节点确定性发生行为 | 已核实（SR-04, SR-05） |
| 目标用户 | 以 IDE 为主战场的开发者与团队；需要组织级统一策略的工程组织 | 已核实（SR-04） |
| 核心能力 | ① Project Rules：`.cursor/rules/*.mdc`，frontmatter 三字段 `description`/`globs`/`alwaysApply` 决定四种激活模式；② Hooks：`.cursor/hooks.json`（schema `version: 1`），含 agent 钩子、Tab 钩子与 `workspaceOpen` 生命周期钩子；③ Skills；④ Commands | 已核实（SR-04, SR-05） |
| 架构特点 | Hook 支持 `command` 与 `prompt` 两种执行类型；退出码 0=放行、2=阻断、其他=非阻断放行；`failClosed: true` 使崩溃/超时/非法 JSON **也阻断**（默认 false）；`loop_limit`（默认 5）用于 `stop` 钩子的自动续跑 | 已核实（SR-05） |
| 部署形态 | 桌面 IDE；配置四层来源：Enterprise（系统级）/ Team（云仪表盘分发）/ Project（随仓库）/ User（`~/.cursor/`），优先级 Enterprise > Team > Project > User | 已核实（SR-05） |
| 集成方式 | 项目级 `.cursor/hooks.json` 随 git 提交即团队共享；脚本通过 stdin/stdout JSON 双向通信，可用 `CURSOR_PROJECT_DIR` 等环境变量 | 已核实（SR-05） |
| 定价模式 | 订阅制（公开资料口径：Pro 约 20 USD/月，团队/企业档更高） | 综合归纳（SR-20） |
| 优势 | 唯一把「失败即阻断（`failClosed`）」与「组织级强制下发（Enterprise/Team 层不可被低优先级覆盖）」做成一等公民的宿主，最贴近企业级规范强制的真实诉求 | 已核实 + 推断（SR-05） |
| 局限 | Rules 只作用于 Agent chat，**不作用于 Tab 补全、Inline Edit 与 Bugbot**；`.cursorrules` 官方措辞是「legacy and will be deprecated」但**未公布移除版本与日期**；官方文档明确「规则是指令而非门禁，规则通过不代表代码能跑」 | 已核实（SR-04, SR-19） |
| 对本项目的参考价值 | 直接印证 kit README §Host usage 的判断——「Gates / 门禁：Skills 覆盖不了，必须走 CLI `verify`」；同时 B2 的四层优先级是 kit 若要做「组织级规范下发」时应照抄的分层模型 | 推断（依据 SR-04, SR-05 + kit README:238） |

#### 2.2.3 B3 - GitHub spec-kit

| 维度 | 内容 | 置信度 |
| --- | --- | --- |
| 产品定位 | 规范驱动开发（Spec-Driven Development, SDD）工具包：先写规范再写代码，主张「代码服务于规范，而非规范服务于代码」 | 已核实（SR-07） |
| 目标用户 | 想把 AI 编码过程结构化、并希望产物可审查可版本化的团队；需要跨 agent 一致工作流的组织 | 已核实（SR-07） |
| 核心能力 | 门控流程：`constitution`（治理原则）→ `specify`（需求与用户旅程）→ `clarify`（澄清）→ `checklist`（质量清单）→ `plan`（技术方案）→ `tasks`（任务拆解）→ `analyze`（跨产物一致性）→ `implement`（执行）；另有 `taskstoissues`、`converge` | 已核实（SR-06） |
| 架构特点 | 模板四层解析优先级：项目本地覆盖（`.specify/templates/overrides/`）> 预设 Presets > 扩展 Extensions > 内核 Core；命令文件在安装时写入各 agent 目录，多个 preset/extension 提供同名命令时高优先级胜出，移除后自动回退次高 | 已核实（SR-06） |
| 部署形态 | 以 `uvx --from git+… specify init` 加 `--integration` 参数（取值为 copilot / claude / codex 等宿主名）初始化；明确声明可离线、在防火墙内、跨 Windows/macOS/Linux 运行；组织可自建 extension 与 preset catalog | 已核实（SR-06, SR-07） |
| 集成方式 | 30+ AI 编码 agent 集成（Copilot、Gemini、Codex、Windsurf、Claude、Forge、Kiro 等）；对支持 skills mode 的集成可用 `--integration-options="--skills"` 改为安装 Agent Skills 而非斜杠命令文件 | 已核实（SR-06, SR-07） |
| 定价模式 | 开源（MIT），零许可成本；社区扩展 105 个（60+ 作者）、预设 22 个、贡献者 200+ | 已核实（SR-07） |
| 优势 | 「分层覆盖 + 安装期物化 + 优先级回退」三件套，让一套方法论内核能同时服务 30 个宿主而不分叉；且完全离线可用，无云依赖 | 综合归纳（SR-06, SR-07） |
| 局限 | 门控是**流程性**的（阶段产物存在性与一致性检查），不是**机械性**的（不验证代码能否编译/测试通过）；这条边界与其自身定位一致，但也意味着它不覆盖 kit P0 门禁所覆盖的那一层 | 推断（依据 SR-06 命令语义） |
| 对本项目的参考价值 | 与 kit 的「过程轨（tasks/reviews/invokes）永不覆写 + 模板资产 + 命令族 G1–G7」高度同构；其四层模板优先级正是 kit 治理 X7（S2 过程域前缀四份硬编码互不统一）所需的「单一真值源 + 分层覆盖」范式的现成答案 | 推断（依据 SR-06 + material_digest X7） |

#### 2.2.4 B4 - Ruler（`@intellectronica/ruler`）

| 维度 | 内容 | 置信度 |
| --- | --- | --- |
| 产品定位 | 集中式 AI 编码助手指令（规范）管理器：单一真值源 → 自动分发到各 agent 的原生配置文件 | 已核实（SR-11） |
| 目标用户 | 同时使用多个 AI 编码工具、厌倦为每个工具维护一份配置的团队 | 已核实（SR-11） |
| 核心能力 | `.ruler/` 目录递归收集 `*.md`（按字母序拼接，每段前置来源标记以便追溯）；`ruler.toml` 主控行为与目标 agent；`ruler apply` 生成各 agent 原生配置；支持 MCP 服务器配置传播与 `.gitignore` 自动维护 | 已核实（SR-11） |
| 架构特点 | 声明式编译：规范源（Markdown）→ agent 适配表（内置）→ 目标文件；覆盖 32 类 agent 目标 | 已核实（SR-11） |
| 部署形态 | 本地 CLI，npm 全局安装或 `npx` 运行；无服务端、无云依赖 | 已核实（SR-11） |
| 集成方式 | 输出各 agent 的原生文件：Copilot→`AGENTS.md`、Claude Code→`CLAUDE.md`、Codex/Jules/Cursor/Windsurf/Gemini CLI/Kilo/OpenCode/Qwen/RooCode/Zed/Factory/Mistral→`AGENTS.md`、Cline→`.clinerules`、Aider→`AGENTS.md` + `.aider.conf.yml`、Kiro→`.kiro/steering/ruler_kiro_instructions.md`、OpenHands→`.openhands/microagents/repo.md`、Crush→`CRUSH.md`、Warp→`WARP.md` 等 | 已核实（SR-11） |
| 定价模式 | 开源（MIT），npm 免费 | 已核实（SR-11） |
| 优势 | 与 kit 同为「npm 分发的规范产品 + 本地 CLI + 零云资源」；它把「跨宿主适配」做成了配置而非代码，覆盖面达 32 个目标 | 已核实（SR-11） |
| 局限 | 官方自述 **Beta Research Preview**（要求谨慎测试并反馈问题）；**只做规范注入，不做任何门禁/校验**——没有 hook、没有 gate、没有过程轨；且 32 个目标中过半数已收敛为输出同一个 `AGENTS.md` | 已核实（SR-11） |
| 对本项目的参考价值 | 这是本报告对 kit 最重要的一条外部事实：**市场上已存在与 kit 分发形态几乎一致的产品，且它选择拥抱 `AGENTS.md` 作为跨宿主公分母**。kit 若继续只把自己定义为「规范分发器」，将直接正面对撞且处于后发；kit 真正的空档是 Ruler 完全没做的那一半——**过程门禁 + 过程轨留档**，这与 kit README §Host usage 自述的能力缺口表恰好互补 | 推断（依据 SR-11 + kit README:233-240） |

#### 2.2.5 B5 - AWS Kiro

| 维度 | 内容 | 置信度 |
| --- | --- | --- |
| 产品定位 | 面向规格驱动开发（spec-driven development）的 agentic 开发环境（IDE + CLI），AWS 出品 | 已核实（SR-12） |
| 目标用户 | 需要「先规划后编码」、需要规范可审查可留档、或有强合规约束的团队（含 AWS GovCloud 场景） | 已核实（SR-12, SR-20） |
| 核心能力 | ① Specs：需求→设计→任务三阶段，产物为 Markdown 入仓；② Steering files：`.kiro/steering/*.md`，Always / fileMatch / manual 三种加载模式；③ Hooks：事件驱动（文件保存、提交等）自动触发 agent 执行；④ 自定义子智能体；⑤ Powers：可组合能力模块（含可选 MCP Server） | 已核实（SR-12） |
| 架构特点 | 把「规范」提升为工作单元：Hook 让规范与代码持续同步，而不是一次性脚手架 | 已核实（SR-12） |
| 部署形态 | 桌面 IDE（Code OSS fork，兼容 VS Code 生态）+ CLI；模型经 Amazon Bedrock 路由 | 已核实（SR-12, SR-20） |
| 集成方式 | 原生 MCP 支持；Powers 作为预打包的领域能力模块（含 MCP Server）按需加载；与 AWS 服务（CodeCatalyst / Bedrock / IAM）深度集成 | 已核实（SR-12, SR-20） |
| 定价模式 | 订阅制多档：Free（约 50 interactions/月）/ Pro（约 19–20 USD/月）/ Pro+ / Power | 综合归纳（SR-12, SR-20） |
| 优势 | 唯一同时具备「结构化规范产物 + 事件驱动自动执行 + 组织级合规部署」的商用方案；且**正在完整执行一次旧产品线迁移** | 已核实（SR-12, SR-13） |
| 局限 | 自成 IDE 闭环，外部工具难以作为「分发目标」嵌入；强绑定 AWS/Bedrock 与专有许可 | 已核实 + 推断（SR-12, SR-20） |
| 对本项目的参考价值 | 其核心价值**不在产品形态而在迁移治理范式**：AWS 官方公告给出了一条完整、可抄的旧产品线下线路径（12 个月过渡窗、新注册截止日先于 EOS 日、四个 IDE 市场上保留插件并挂废弃公告、按 IDE 分别提供迁移指南、过渡期内继续推关键修复）。这正是 kit 处理 `@cyning/harness` 迁移所缺的那份模板 | 推断（依据 SR-13 + 主理人任务书 §6 项 X11） |

### 2.3 关键技术能力横向事实

> 不评分、不排序，仅按能力维度横陈各方案事实。

| 能力维度 | B1 Claude Code | B2 Cursor | B3 spec-kit | B4 Ruler | B5 Kiro | 说明 / 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| 规范注入载体 | `CLAUDE.md` + `.claude/rules/` + Skills | `.cursor/rules/*.mdc`（frontmatter 三字段） | `.specify/templates/` 四层 + 各 agent 命令文件 | `.ruler/*.md` → 编译为各 agent 原生文件 | `.kiro/steering/*.md`（Always / fileMatch / manual） | SR-01, SR-04, SR-06, SR-11, SR-12 |
| 注入是否保证生效 | **否**（官方定位：CLAUDE.md 是请求不是保证） | **否**（官方明示「规则是指令而非门禁」）；Rules 不覆盖 Tab / Inline Edit / Bugbot | 部分（阶段产物存在性检查） | 否（纯文件生成，无执行保证） | 部分（Steering 每次交互加载 + Hook 兜底） | SR-02, SR-19, SR-06 |
| 机械阻断能力 | **有**：`PreToolUse` 返回 `deny`；退出码 2 阻断；`Stop` 钩子可拒绝结束 | **有**：退出码 2 阻断；`failClosed: true` 使失败/超时也阻断（默认 false） | 无 | 无 | 有（事件驱动 Hook 触发 agent 执行） | SR-01, SR-05, SR-12 |
| 阻断失败时的默认行为 | 非 0 且非 2 的退出码 = 非阻断放行（文档专门提示「退出码 1 不会阻断，要拦就退 2」） | 默认失败放行；可用 `failClosed` 反转 | 不适用 | 不适用 | 不适用 | SR-02, SR-05 |
| 组织级强制下发 | 有：`managed-settings.json`（管理员只读） | 有：Enterprise > Team > Project > User，低优先级不可覆盖高优先级 | 有：组织可自建 extension/preset catalog | 无（无服务端） | 有（订阅与 IAM 集中管理） | SR-03, SR-05, SR-07 |
| 分发形态 | Plugins + Marketplace（GitHub / Git URL / 本地目录 / npm / pip） | 项目文件随 git 提交 + Team 云分发 | `uvx --from git+… specify init`；离线可用；可自建 catalog | npm 全局/临时包（`npx`） | IDE + Powers 市场 | SR-03, SR-05, SR-06, SR-11, SR-12 |
| 扩展/定制机制 | Skills / Commands / Agents / Hooks / MCP / LSP / monitors / bin | Hooks（command 与 prompt 两种）+ Skills + Commands | Extensions（加能力）+ Presets（改内核）+ 项目本地 overrides | `ruler.toml` + `.ruler/*.md` 递归拼接 | Powers（含可选 MCP Server）+ 自定义子智能体 | SR-03, SR-05, SR-06, SR-11, SR-12 |
| 模板/规则优先级模型 | 作用域 user / project / local / managed | Enterprise > Team > Project > User | 项目本地覆盖 > Presets > Extensions > Core | 字母序拼接（无优先级，仅拼接顺序） | Always > fileMatch > manual | SR-03, SR-05, SR-06, SR-11, SR-12 |
| 过程留档（过程轨） | 无内置；靠 `.claude/` 目录与 git | 无内置 | **有**：spec / plan / tasks / checklist 全部入仓可审查 | 无（且自动维护 `.gitignore` 排除生成物） | **有**：requirements / design / tasks 入仓 | SR-06, SR-11, SR-12 |
| 跨宿主覆盖 | 1（自身） | 1（自身） | 30+ 个 agent 集成 | 32 类 agent 目标 | 1（自身，另有 Spec Kit 兼容声明） | SR-06, SR-07, SR-11 |
| 无云/离线可用 | 否（依赖 Anthropic 云） | 否（IDE 云同步、Team 云分发） | **是**（明确声明离线、防火墙内可用） | **是**（纯本地 CLI，无服务） | 否（Bedrock / AWS） | SR-07, SR-11, SR-12 |
| 旧产品线迁移机制 | 未公开 | `.cursorrules` 保留为 legacy、未公布移除日期；官方给出四步迁移指引 | 未涉及 | 未涉及 | **有完整机制**（见下行） | SR-04, SR-13 |
| 破坏性变更 / 迁移治理 | 未公开专项机制 | 「legacy，将被废弃」措辞，无日期 | 未涉及 | 未涉及 | **Q Developer IDE 插件与付费订阅 2027-04-30 终止支持，给 12 个月过渡；2026-05-15 起停止新注册；四个 IDE 市场保留插件并挂废弃公告；按 IDE 提供迁移指南；过渡期内继续推关键修复** | SR-12, SR-13 |
| 生态内建的迁移字段 | 无 | 无 | 无 | 无 | 有（订阅升级路径 `Upgrade to Kiro`）；另 Gemini CLI extension manifest 内置 `migratedTo` 字段，CLI 会自动检查新源并迁移安装（SR-14） | SR-13, SR-14 |
| 商业模式 | 订阅 + 用量 | 订阅 | 开源（MIT），零许可成本 | 开源（MIT），零许可成本 | 订阅（Free / Pro / Pro+ / Power） | SR-07, SR-11, SR-12, SR-20 |

**跨切事实（支撑 S2 / S5）**：

- `AGENTS.md` 由 OpenAI 于 2025 年 8 月发布，已被 **60,000+ 开源项目**与 Amp、Codex、Cursor、Devin、Factory、Gemini CLI、GitHub Copilot、Jules、VS Code 等采用；2025-12-09 与 Anthropic 的 MCP、Block 的 goose 一同捐入 Linux Foundation 新设的 **Agentic AI Foundation（AAIF）**，白金成员含 AWS、Anthropic、Block、Bloomberg、Cloudflare、Google、Microsoft、OpenAI。（已核实，SR-08, SR-09）
- Agent Skills（`SKILL.md` + YAML frontmatter + 三级渐进加载）由 Anthropic 发起并作为开放标准发布，规范仓 `agentskills/agentskills`；官方与各平台文档给出的目录约定包括 `.claude/skills/`、` .github/skills/`、` .cursor/skills/`、` .gemini/skills/`、` .windsurf/skills/`、` .codex/skills/`、` .kiro/skills/`、` .opencode/skills/`。（已核实，SR-10）
- GitHub 官方「Copilot customization cheat sheet」把自定义指令、提示文件、自定义 agent、子 agent、Agent Skills、Hooks、MCP 七类定制能力并列成表，并给出各能力的文件位置；其中 Hooks 在 VS Code 为预览（P），在 Copilot CLI 与 GitHub.com 为支持（✓）。（已核实，SR-15）
- 上述三条合并可见一条**推断**：「规范注入」这一层已经标准化（`AGENTS.md` + Agent Skills 双标准 + 基金会中立治理），**赛道竞争已从「能不能注入」转移到「注入后是否确定执行、产物是否留档可审」**。

---

## 3. 对比：对比矩阵与加权评分

> **四段式「对比」段**。在 §2 的事实基础上建立对比矩阵，赋予权重并打分。

### 3.1 对比矩阵

> **每行权重之和 = 1.00**。评估维度与权重可根据本次调研问题调整，但必须保留并给出理由。

| 评估维度 | 权重 | 权重理由 | B1 得分 | B2 得分 | B3 得分 | B4 得分 | B5 得分 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 场景契合度 | 0.30 | kit 的核心场景是「规范注入 + 流程门禁 + 可分发的 CLI 产品」三件事同时成立；本项直接衡量标杆在这三件事上与 kit 的可比性，权重最高 | 4 | 3 | 4 | 5 | 3 |
| 技术成熟度 | 0.20 | 借鉴对象的机制若自身仍在 Beta 或语义频繁变更，kit 抄过去会带入不稳定；但成熟度不是越强越好（过成熟=已被宿主锁定），故不与契合度同权 | 5 | 5 | 4 | 2 | 4 |
| 集成难度（反向） | 0.15 | kit 是零云资源的 npm 包，借鉴方案若要求换 IDE 或引入服务端，会直接击穿约束；本项为门槛项而非加分项，权重取中低 | 3 | 3 | 4 | 5 | 1 |
| 成本（反向） | 0.15 | kit 当前为 MIT 开源、无任何云资源与订阅收入，商业采购成本须谨慎；但本轮目标是「借鉴范式」而非「采购产品」，故权重取低 | 3 | 3 | 5 | 5 | 2 |
| 合规可控性 | 0.20 | 涵盖可私有化、可离线、可防火墙内部署、无数据出境；kit 现有底座（npm + GitHub Releases + GitHub Actions，无任何云资源）把这条写成了硬约束，权重与成熟度同级 | 4 | 3 | 5 | 5 | 2 |
| **加权总分** | **1.00** | — | **3.90** | **3.40** | **4.35** | **4.40** | **2.55** |

**评分标尺**：每项 1~5 分，1 = 严重不符合，3 = 基本满足但存在明显局限，5 = 完美契合。

**逐项打分依据（事实可回溯）**：

- 场景契合度：B4 与 kit 同为 npm 分发的本地规范产品（5 分）；B3 同为「方法论内核 + 过程轨 + 模板资产 + 多宿主」（4 分）；B1 门禁语义与 kit P0 门禁同源，但它是宿主而非规范分发产品（4 分）；B2 四层强制下发与 kit 的组织级诉求同类，但 IDE 绑定（3 分）；B5 三者俱全却自成闭环、不可作为分发目标（3 分）。
- 技术成熟度：B1/B2 均为大规模商用、文档完备（5 分）；B3 有 30+ 集成与 200+ 贡献者，但 CLI 仍走 `uvx --from git+…`（4 分）；B5 商用但产品较新（4 分）；**B4 官方自述 Beta Research Preview**（2 分）。
- 集成难度（反向）：B4 一条 `npx` 即完成（5 分）；B3 一次 `specify init` 且离线可用（4 分）；B1/B2 需写 `settings.json` / `hooks.json` 并把脚本纳入仓库（3 分）；**B5 需要更换 IDE**（1 分）。
- 成本（反向）：B3/B4 开源零许可 + 零云资源（5 分）；B1/B2 订阅制约 20 USD/月起（3 分）；B5 多档订阅且最高档约 200 USD/月（2 分）。
- 合规可控性：B3/B4 明确离线与防火墙内可用、无服务端（5 分）；B1 本地执行但依赖 Anthropic 云（4 分）；B2 IDE 云同步且 Team 层由云仪表盘分发（3 分）；B5 绑定 AWS/Bedrock（2 分）。

### 3.2 评分结论

> 基于 §3.1 加权总分，形成分层结论。每层结论必须引用得分作为依据。

- **优先借鉴**：**B4 Ruler（加权总分 4.40，场景契合度 5/5、集成难度 5/5、合规可控性 5/5）** 与 **B3 GitHub spec-kit（4.35，合规可控性 5/5、成本 5/5、跨宿主 30+ 集成）** —— 二者互补而非互斥：**B4 给出「分发形态」的答案**（单一规范源 + 声明式适配表 + `ruler apply` 编译落地，且与 kit 同为 npm 分发、零云资源），**B3 给出「过程门禁与模板治理」的答案**（四层模板优先级 + 安装期物化 + 优先级回退 + 产物入仓可审）。二者相加恰好覆盖 kit 的「规范注入 + 过程门禁 + 可分发的 CLI 产品」三要素。注意 B4 成熟度仅 2/5，借鉴其**形态与适配表设计**，不借鉴其实现（且须评估其 Beta 状态下的语义漂移风险）。
- **部分借鉴**：**B1 Claude Code（3.90，技术成熟度 5/5、门禁强制性最强）** —— 借鉴点：① 阻断语义用「退出码 2 / `permissionDecision: deny`」而非提示词表达，并把「退出码 1 不阻断」这类反直觉行为写进官方文档；② 插件 Marketplace 的分发形态与 `plugin validate` 的本地校验命令；③ 项目级 hooks 随仓库提交即团队共享的落地路径。不借鉴的部分：宿主绑定、托管策略对项目级配置的覆盖能力。**B2 Cursor（3.40）** —— 借鉴点：① 四层配置优先级 Enterprise > Team > Project > User，且低优先级不可覆盖高优先级；② `failClosed` 把「失败放行」反转为「失败阻断」；③ `loop_limit` 让 `stop` 钩子可驱动 agent 续跑。不借鉴的部分：IDE 绑定、云仪表盘分发（与 kit 零云资源约束冲突）。
- **不借鉴（否决）**：**B5 AWS Kiro（加权总分 2.55，集成难度 1/5、成本 2/5、合规可控性 2/5）** —— 否决理由：借鉴其产品形态意味着要求用户更换 IDE 并接受 AWS/Bedrock 绑定，与 kit 既有的「npm 包 + 本地 CLI + 无任何云资源」硬约束直接冲突，成本不可接受且合规不可控。**但本否决只针对产品形态**：B5 的**旧产品线迁移治理范式**（12 个月过渡窗、新注册截止日先于 EOS 日、旧渠道保留并挂废弃公告、按渠道分别给迁移指南、过渡期内续推关键修复）是本轮调研中可直接抄用、且 kit 当前最缺的一块，已在 §4.1 单列为建议项。

### 3.3 方案组合分析（如有）

> 如果调研发现"单一方案无法覆盖全部需求，需要组合"，则在此小节展开。

调研结论是：**单一方案确实无法覆盖 kit 的需求，必须组合**，且组合方式由 kit 自身的三段式结构决定。

| 组合方式 | 覆盖哪些能力 | 未覆盖能力 | 组合复杂度 | 总体成本估算 |
| --- | --- | --- | --- | --- |
| B4 形态（分发）+ B3 治理（模板优先级与过程轨）+ B1/B2 语义（阻断语义与分层强制） | 跨宿主规范注入、模板单一真值源与分层覆盖、过程产物入仓可审、阻断语义对齐行业、组织级强制下发 | ① IDE 内实时补全面（Cursor 自身也承认 Rules 不覆盖 Tab/Inline Edit）；② 商业订阅与云托管通道；③ 旧产品线迁移的执行（需另配 B5 范式） | 中（三者均为文件/命令行级组合，无服务间集成；主要复杂度在宿主适配表的维护） | 低（全部为开源范式借鉴 + 本地 CLI 扩展，无许可成本、无云账单；工程量集中在宿主适配表与模板解析层，量级为周级而非月级） |
| 上述组合 + B5 迁移范式（仅取治理，不取形态） | 追加：破坏性变更治理、旧产品线下线时间表、废弃公告与迁移指南 | 无新增缺口 | 低（纯文档与发布流程工程） | 极低（npm `deprecate` 为内置命令；迁移指南与废弃公告为一次性文档投入） |
| 上述组合 + B1/B2 云市场作为第二分发通道 | 追加：生态可发现性、一键安装 | 引入云依赖与第三方审核门槛，击穿「无任何云资源」约束 | 高（需接受第三方 marketplace 的 manifest 规范与审核） | 中（无直接许可成本，但有持续合规与维护成本） |

**组合取舍提示**：第一行组合是本报告的推荐基线。第三行组合（追加第二分发通道）是本报告唯一可能改变 kit 对外形态与合规基线的选项 —— **经中间确认**，宿主策略已裁决为「乙 · 两步走」，且该裁决的落脚点是「规避宿主单点依赖」而非「取得市场可发现性」，因此第三行**不作为既定方向**，其评估点后移至 G5 部署设计与安全设计（见 §5.3 D-03）。

---

## 4. 建议：取舍决策支持

> **四段式「建议」段**。基于 §2 事实 + §3 对比，给出可被 `business-architect` 直接采用的建议。本节是建议而非最终裁决，最终边界由业务架构师冻结。

### 4.1 自研 / 采购 / 复用边界建议

| 能力项 | 建议方式 | 建议依据 | 候选方案 / 系统 | 关键前提 |
| --- | --- | --- | --- | --- |
| 规范注入层（Inform / Constrain 资产 → 各宿主原生配置位） | 复用（已有底座）+ 自研扩展适配表 | kit 已有 `assets/ide/adapters/` 4 份适配器与 `assets/skills/` 8 份 Skill 封装；B4 证明「声明式适配表 + 单一规范源」可在 32 类目标上跑通，且无需服务端 | 复用 kit 现有 `assets/ide/adapters/`，对标 B4 的适配表设计 | 须先把适配关系从代码硬编码（现状：`isS2Dest` / `S2_RE` / `s2Prefixes` 等分散常量，见 material_digest X7/X12）抽为声明式清单 |
| 流程门禁（`check` / `verify` / `gate-check` / `audit` / D5 测试制品探测） | 自研（保持 kit 进程内机械判定） | kit README §Host usage 明示「Gates / pre-30 / may_start_30：Skills 覆盖不了，必须走 CLI `verify`」；B1/B2 的 hooks 是宿主进程内的，可被更高优先级配置层覆盖，而 kit 的判定独立于宿主 | 维持 kit 现有 P0 门禁；语义层对齐 B1（退出码 2 / deny）与 B2（`failClosed`） | 门禁真值源必须唯一化；当前 S2 过程域前缀有 4 份互不相同的硬编码（material_digest X7），门禁本身的正确性先于门禁的强制性 |
| 过程轨留档（tasks / reviews / invokes，永不覆写） | 自研 + 借鉴 B3 | B3 把 spec/plan/tasks/checklist 全部入仓可审查，并给出四层模板优先级与「移除后自动回退次高优先级」的机制；kit 的过程轨语义（S2 永不覆写）比 B3 更硬，但治理范式可直接抄 | B3 spec-kit 的四层解析优先级（项目本地覆盖 > Presets > Extensions > Core） | 先解决 X7：统一 S2 前缀真值源，否则「永不覆写」这条硬约束在不同命令下含义不一致 |
| 方法论内核（ICVO = Inform · Constrain · Verify · Orchestrate；hat 帽制 00/10/20/30/40） | 自研（不外包、不对标） | 五家标杆中无任何一家提供「按角色分帽 + 四段式内核」的等价物；这是 kit 的差异化资产，也是它不能被 Ruler 类工具替代的根因 | — | 需有可对外表达的最小文档；当前 SPEC.md 钉在 1.2.0 而包已 1.10.0（material_digest X6），对外承诺失真 |
| 宿主适配矩阵（跨宿主分发） | 自研扩展 —— **经中间确认**，采用「乙 · 两步走」：**1.x 阶段先收敛内部一致性，2.0 阶段再引入宿主适配表** | 用户已裁决演化为跨宿主规范分发器以规避宿主单点依赖（R-02，严重程度高）。技术侧依据三条：① `AGENTS.md` 已于 2025-12-09 随 AAIF 进入基金会中立治理、60,000+ 项目采用，跨宿主分发的技术与锁定风险大幅下降；② B4 的 32 个目标中过半已收敛为输出同一个 `AGENTS.md`，证明「声明式适配表 + 单一规范源」可跑通；③ **「规范注入」这一层已随 `AGENTS.md` 标准化，不再是差异化** —— kit 的差异化在**门禁 + 过程轨留档 + 角色分帽**，与只做注入、不做门禁的 B4 互补而非对撞 | 以 `AGENTS.md` 为默认落点 + 各宿主特化落点为补充（对标 B4 输出表）；DSH 由「唯一宿主」转为「**首个宿主**」（见 §5.3 D-01） | **两步走的硬前置**：2.0 引入适配表之前，1.x 必须先完成三项内部一致性收敛 —— X7 统一 S2 过程域真值源、X6 SPEC 钉版治理、X11 `.cyning-harness` 语义收敛；三项未完成即铺开跨宿主，等于把分裂的真值源复制到 N 个宿主。另需先确认 DSH 宿主自身的发现路径与契约版本（见 §5.2 U-01） |
| 旧产品线迁移治理（`@cyning/harness` → kit） | 自研（流程工程，非技术工程） | B5 给出可抄的完整范式：EOS 日 2027-04-30、12 个月过渡窗、新注册截止 2026-05-15 早于 EOS 日、四个 IDE 市场保留插件并挂废弃公告、按渠道分别给迁移指南、过渡期续推关键修复；npm 侧有 `npm deprecate` 作为等价工具 | B5 时间表范式 + `npm deprecate` + 仓库内 MIGRATION 文档 | kit 侧缺失的是**时间表本身**而非工具；且当前 `.cyning-harness` 目录名存在双重语义（X11），迁移前须先收敛 |
| 分发通道 | 复用（已有）为主 —— **经中间确认**的「乙 · 两步走」**不等同于上架第三方市场**：跨宿主分发在 2.0 由本地适配表 + npm 完成，不引入云依赖；第二通道（Claude Code Plugin Marketplace / skills.sh）维持「不引入」，评估点后移至 G5 | kit 现行 npm + GitHub Releases + GitHub Actions，与 B3/B4 的离线、零云、可自建 catalog 路线一致，且这正是 B3/B4 在合规可控性上拿到 5/5 的原因；用户裁决乙方案的落脚点是「规避宿主单点依赖」，而非「取得市场可发现性」，二者可用本地手段解耦 | 维持 npm + GitHub Releases；若未来确需可发现性，只考虑「自建 catalog、仅索引不托管」形态 | 任何引入云托管的方案须先在 G5 部署设计与安全设计过审（见 §5.3 D-03）；第三方 marketplace 的准入细则仍属待确认信息（见 §5.2 U-04） |
| 破坏性变更治理（1.x 演进） | 自研（流程）+ 复用（工具） | 行业共识做法为四件套：先在次版本发运行时废弃告警 → 提供逐条变更的迁移指南 → 用 `npm deprecate` 按 semver 范围精确圈定受影响版本（只圈定旧主版本，不波及新版）→ 旧主版本保留安全补丁窗口（常见 6–12 个月）；Gemini CLI 甚至在 extension manifest 内置 `migratedTo` 字段让 CLI 自动迁移安装源 | `npm deprecate`（按 semver 范围）+ MIGRATION 文档 + 可选 codemod | 需建立「几个主版本提供安全回补」的书面支持策略并对外公布 |

### 4.2 MVP 范围建议

> 对用户诉求中的 P0/P1 功能给出"是否可在 MVP 内实现"的调研侧建议。

用户诉求为「审查 + 评价 + 升级路线规划」，未给功能清单；下表按诉求重心 ③④ 收敛出的候选举措逐条给出建议。

| 功能（对齐用户诉求） | 建议 MVP？ | 理由 |
| --- | --- | --- |
| R1 统一 S2 过程域真值源，消除 4 份互不相同的硬编码（material_digest X7） | ✅ | B3 已验证「单一真值源 + 四层覆盖解析」是可行且低成本的范式；本项为纯内部重构，无外部依赖，且是「永不覆写 S2」这一核心硬约束能否成立的前提 |
| R2 规范分发器化：一份规范源 → N 个宿主原生配置位 | ✅（**经中间确认**：乙 · 两步走 —— 1.x 收敛内部一致性，2.0 引入适配表，故本项落在 2.0 而非 1.x MVP） | 用户已裁决演化为跨宿主规范分发器。B4 已在 32 类目标上跑通，且 `AGENTS.md` 已成为基金会治理下的稳定公分母；kit 已有 `assets/ide/adapters/` 底座，增量工程是写适配表而非改架构。**硬前置**：X7 / X6 / X11 三项内部一致性收敛未完成前不启动 2.0 适配表，否则跨宿主会把分裂的真值源复制到 N 个宿主 |
| R3 P0 门禁语义对齐行业（退出码 2 阻断 / `failClosed` 失败即阻断 / 分层强制） | ✅ | B1 与 B2 已把这套语义做成事实标准，对齐成本仅为常量与文档；且能直接提升 kit 门禁在跨宿主场景下的可解释性 |
| R4 旧产品线迁移治理（`@cyning/harness` 废弃时间表 + MIGRATION 文档 + `npm deprecate`） | ✅ | B5 提供完整可抄范式，npm 提供内置工具；缺失的只是时间表决策与文档撰写，无技术不确定性 |
| R5 版本钉治理：SPEC.md 与包版本解耦或自动校验（material_digest X6） | ✅ | 纯流程工程；可参照行业做法把「版本钉一致性」做成发布前检查项（与 kit 现有 RELEASING.md 硬检查单同构） |
| R6 第二分发通道（上架 Claude Code Plugin Marketplace / skills.sh） | ❌（维持 MVP 外；属「后移」而非「否决」） | **经中间确认**选定的乙方案落脚于「规避宿主单点依赖」，而跨宿主分发在 2.0 可由本地适配表 + npm 完整实现，**不需要第三方市场**；上架会同时改变产品形态（对外承诺）与合规基线（第三方审核、数据驻留），与「无任何云资源」的现状约束冲突。评估点后移至 G5 部署设计与安全设计（见 §5.3 D-03） |
| R7 自研 IDE 或深度绑定单一宿主以换取端到端体验 | ❌（否决） | B5 是该路线的成熟样本，评分 2.55（集成难度 1/5、成本 2/5）；对 kit 而言意味着放弃 npm 包形态与零云优势，投入产出不成立 |
| R8 商业化（订阅计费 / 团队席位） | ❌（MVP 外） | 赛道内 B3/B4 两个最贴近 kit 形态的产品均为 MIT 开源零许可成本；在 kit 尚未解决 X6/X7/X11 等内部一致性问题前商业化，会把「规范产品」的信任基础暴露在风险下 |

### 4.3 技术栈参考建议

| 技术层 | 推荐方案 | 替代方案 | 选择理由 |
| --- | --- | --- | --- |
| 跨宿主规范落点（默认） | `AGENTS.md` | 每宿主一份私有文件 | `AGENTS.md` 由 OpenAI 发布、被 60,000+ 项目与主流 agent 采用，并于 2025-12-09 捐入 Linux Foundation 的 AAIF（白金成员含 AWS/Google/Microsoft/OpenAI）——中立治理降低了单一厂商锁定的长期风险 |
| 能力封装格式 | Agent Skills（`SKILL.md` + YAML frontmatter，三级渐进加载） | kit 私有 skill 生成逻辑 | Skills 已是开放标准，主流宿主给出各自的 skills 目录约定；kit 保留私有生成逻辑，但**输出物应符合开放标准**，使产物可被非 kit 用户消费 |
| 宿主适配声明 | 声明式清单（单一 YAML/JSON 适配表：宿主 → 目标路径 → 文件格式 → 优先级） | 每宿主一份 TS 模块（现状） | B4 用适配表覆盖 32 类目标；kit 现状的分散硬编码（X7 / X12）正是缺少这一层的代价 |
| 门禁执行位置 | 双轨：kit CLI 进程内机械判定为**唯一真值**，宿主 hooks 为**可选加速与拦截前置** | 纯宿主 hooks | kit README §Host usage 已判定门禁不能被 Skills 覆盖；而 B1/B2 证明 hooks 会被更高优先级配置层覆盖——故宿主 hooks 只能做前置拦截，不能做终局判定 |
| 阻断语义 | 退出码 2 = 阻断；非 0 非 2 = 非阻断放行（并显式写进文档） | 任意非 0 即阻断 | B1/B2 一致采用此语义，B1 官方文档还专门澄清「退出码 1 不阻断」这一易错点；对齐可避免用户跨工具复用 hook 脚本时行为漂移 |
| 失败策略 | 关键门禁默认 `failClosed`（失败即阻断），非关键门禁默认放行 | 一律放行 | B2 已把 `failClosed` 做为一等配置项，官方定位是「对安全关键的钩子有用」；kit 的 P0 门禁在语义上属于安全关键 |
| 破坏性变更工具链 | `npm deprecate` 带包名加 semver 范围参数与迁移指引文案（含迁移文档 URL）+ 仓库内 MIGRATION 文档 + 旧主版本安全回补窗口 | 直接发 breaking major | `npm deprecate` 不移除版本、不破坏现有构建，只在安装时告警并可携带迁移 URL，是「优雅路径」；直接 unpublish 会破坏下游构建且违背版本不可变信任 |
| 迁移自动化（可选） | 在 manifest 内置 `migratedTo` 型字段，由 CLI 自动检查新源并迁移 | 仅靠文档告知 | Gemini CLI extension manifest 已内置 `migratedTo`，CLI 会自动检查新源并迁移安装；kit 的 `from_version` 字段（记录旧产品线版本）已具备同类信息，可升级为自动迁移触发点 |
| 分发通道 | npm + GitHub Releases + GitHub Actions（维持现状） | 追加第三方 marketplace / skills.sh | B3 与 B4 都证明「离线可用、可自建 catalog、零云依赖」是拿到合规可控性 5/5 的关键；**经中间确认**的乙 · 两步走由本地适配表 + npm 落地，不依赖第三方市场，故替代方案仅列为 G5 的备选（见 §5.3 D-03） |

---

## 5. 风险与待确认项

> **四段式「风险」段**。列出调研中发现的主要风险、不确定信息、待业务架构师进一步裁决的依赖项，以及仍需人工补充调研的部分。

### 5.1 主要风险清单

| 编号 | 风险描述 | 触发条件 | 影响范围 | 严重程度 | 缓解建议 |
| --- | --- | --- | --- | --- | --- |
| R-01 | **kit 的「强制门禁」差异化被宿主原生 hooks 稀释**：B1 已提供约 30 个钩子事件与 `deny`/退出码 2 阻断，B2 已提供 `failClosed` 与组织级强制下发；当主流宿主把「确定性拦截」做成标配，kit 仅靠「能拦住」将不再构成卖点 | 主流宿主持续增强 hooks 能力并向组织级下发延伸（B2 已具备 Enterprise/Team 层） | 核心竞争力叙事；生态位判断（重心 ③） | 高 | 把差异化从「能不能拦」迁移到「拦什么」：过程轨语义（`docs/tasks/`、`reviews`、`invokes/by-task` 永不覆写）+ 跨宿主一致性 + 方法论内核（ICVO / hat 帽制）。这三项在五家标杆中均无等价物 |
| R-02 | **宿主单点依赖**：kit 当前是 DSH bundle 插件，而 DSH 的 skill 扫描/加载属「上游运行时的行为契约，随上游版本演进」（kit README 自述，锚定 0.1.0-rc.8） | DSH 上游变更发现路径、frontmatter 校验规则或工具契约 | 生态位与可用性（重心 ③） | 高 | 引入宿主抽象层 + 至少落地 2 个非 DSH 宿主的适配（以 `AGENTS.md` 为默认落点，成本最低）；对 DSH 契约做版本嗅探并在不匹配时降级为「仅生成文件、不校验」 |
| R-03 | **规范分发器赛道被 Ruler 类产品挤压**：B4 已覆盖 32 类 agent 目标，与 kit 同为 npm 分发的本地规范产品 | B4 摆脱 Beta 状态、或出现同类产品补齐门禁能力 | 产品定位与用户增长（重心 ③） | 中 | 明确护城河在 Ruler 完全未覆盖的一半（过程门禁 + 过程轨留档 + 角色分帽），并在这半边建立不可替代性；同时评估与 Ruler 兼容/共建（其输出 `AGENTS.md`/`CLAUDE.md` 与 kit 落点并不冲突） |
| R-04 | **对外承诺失真**：SPEC.md 钉在 1.2.0 而包已 1.10.0（material_digest X6），且 SPEC 不随 npm 包分发；潜在用户以 SPEC 判断能力边界时会系统性低估或误判 | 外部用户/贡献者依据仓根 SPEC.md 评估 kit | 产品信任与文档竞争力（重心 ③） | 中 | 把「版本钉一致性」做成发布前检查项（与 RELEASING.md 硬检查单同构）；或将 SPEC 拆分：冻结版保留为历史规约，新增随包分发的现行规约入口 |
| R-05 | **第二分发通道击穿零云约束**：若采纳 Claude Code Plugin Marketplace / skills.sh 等通道，将引入第三方 manifest 规范、审核流程与潜在的数据驻留问题 | 决定上架第三方 marketplace | 合规基线、部署形态（重心 ④；并传导至 G5 部署设计与安全设计） | 中 | 若确需可发现性，优先采用「仅索引、不托管」的形态（自建 catalog 文件，用户仍从 npm 安装）；任何引入云托管的方案须先在 G5 部署设计与安全设计过审 |
| R-06 | **旧产品线迁移无时间表导致双轨长期并行**：`.cyning-harness` 目录名当前存在双重语义（4 处为现行落盘位置，`src/index.ts:186` 又当作 legacy 布局探测标记，material_digest X11） | 未设定 `@cyning/harness` 的 deprecate 与 EOS 时间点 | 品牌与维护成本（重心 ④） | 中 | 直接套用 B5 范式：先定 EOS 日 → 前推 12 个月设过渡窗 → 过渡窗内先停新接入 → 旧包挂废弃公告并给迁移指南 → 过渡期内续推关键修复；同时先把 X11 的双重语义收敛为单一定义 |

### 5.2 待确认项（需主理人 / 业务方反馈）

> 调研中因外部信息不可得而暂不能确认的事实。

| 编号 | 待确认项 | 不确定性说明 | 若无法确认的备选路径 |
| --- | --- | --- | --- |
| U-01 | DSH 宿主自身的 skill 发现路径、frontmatter 校验规则与 gate 能力边界 | kit README 明示扫描/加载属「上游运行时的行为契约，随上游版本演进」，锚定 0.1.0-rc.8；无对外版本化契约文档可查 | 以 0.1.0-rc.8 的锚点（README 给出的 docs 章节与 index.ts 行号）为基线快照，设计「宿主契约版本探测 + 不匹配时降级」；同时在 §5.3 D-01 交 business-architect 在 G3 裁决宿主耦合边界 |
| U-02 | kit 是否已支持 / 计划支持非 DSH 宿主（Copilot、Cursor、Codex、Gemini CLI 等）的规范落盘 | 现有资产目录含 `assets/ide/adapters/` 4 份，但适配覆盖面与优先级未在公开资料中声明 | 按 B4 的 32 目标表做差距分析，先补齐 `AGENTS.md`（覆盖 Agent Skills 标准的大多数宿主）与 `CLAUDE.md` 两个落点 |
| U-03 | kit 是否有商业化意图（订阅 / 团队席位 / 企业版） | 仓库为 MIT，README 与 SPEC 未出现任何计费或席位表述；但产品已具备团队级规范强制能力 | 维持 MIT 开源、不做计费，商业化留待 G3 之后单独评估；本报告 §4.2 R8 已按「MVP 外」处理 |
| U-04 | 第三方 marketplace（Claude Code Plugin Marketplace / skills.sh）的上架门槛、审核周期，以及是否允许私有 registry / 区域限制 | 市场规则由第三方运营方制定，本报告仅能确认这些通道存在且被广泛使用，无法确认其准入细则 | 宿主策略已经中间确认为乙 · 两步走且由本地手段落地，**本项不再阻塞 2.0 适配表**；维持 npm + GitHub Releases，若未来确需可发现性再采用自建 catalog 的「仅索引不托管」形态，并在 G5 过审（§5.3 D-03） |
| U-05 | 旧包 `@cyning/harness` 当前在 npm 上是否已标记 deprecated、以及是否仍有活跃下载 | 需 npm registry 实时数据（可通过 `npm view @cyning/harness deprecated` 与下载量 API 核实），本报告未执行该查询 | 在 G3/G5 前补一次 registry 核实；若仍有活跃下载，迁移过渡窗应参考行业常见的 6–12 个月并适当延长 |
| U-06 | `.cyning-harness` 目录名的双重语义（X11）应如何收敛：保留为现行落盘位置，还是统一改为 legacy 标记 | 资料摘要中两说并列保留、未裁决；属内部一致性问题而非外部事实 | 视为 G4 系统设计的重构项处理；在收敛前，任何迁移对外文档都不得承诺「目录名不变」 |

### 5.3 需业务架构持续关注的依赖项

> 调研中发现但不由 `research-analyst` 裁决的下游问题。

| 编号 | 依赖项 | 说明 | 建议关注阶段 |
| --- | --- | --- | --- |
| D-01 | 宿主耦合边界：**经中间确认已定调 —— DSH 是「首个宿主」而非「唯一宿主」**；待 G3 冻结的是抽象层形态与适配优先级，方向本身不再重开 | 用户已裁决演化为跨宿主规范分发器（乙 · 两步走）。本报告 §5.1 R-02 已把单宿主依赖列为高风险，该裁决正是对 R-02 的处置；G3 需在此基础上冻结宿主抽象层的边界、首批适配宿主清单与 1.x→2.0 的切换判据 | 高层架构设计 §业务边界（G3） |
| D-02 | 真值源唯一化：S2 过程域前缀四份硬编码（X7）、`INVOKE_DIR_CANDIDATES` 重复定义（X12）、SPEC 钉版落后（X6） | 「任何命令永不覆写 S2」是 kit 的核心硬约束，但其实现本身是分裂的；真值源不唯一会导致门禁结论随命令不同而不同 | 系统设计 §模块划分与常量治理（G4） |
| D-03 | 第二分发通道是否引入云依赖 | 会同时改变产品形态与合规基线；本报告 §5.1 R-05 与 §5.2 U-04 已标出风险与不确定性，并已上报 `[中间确认]` | 部署设计 + 安全设计（G5） |
| D-04 | 旧产品线迁移时间表与破坏性变更支持策略 | 需确定 `@cyning/harness` 的 deprecate 与 EOS 时间点、几个主版本提供安全回补；B5 范式可直接抄，但时间点属业务决策 | 高层架构设计 §演进路线（G3） |
| D-05 | 门禁语义对外承诺的措辞 | 若对齐 B1/B2 的「退出码 2 阻断 / `failClosed`」，需在 README 与 SPEC 中明确写出默认阻断策略，否则构成对外承诺歧义 | 高层架构设计 §对外契约（G3）+ 术语统一（G6） |

---

## 6. 关键来源目录

> 集中列出全部调研所使用的公开资料、官方文档、社区仓库、分析报告等。每条来源不低于 URL 粒度，关键来源应给出具体章节或段落。

**硬指标**：
- ≥ 3 条来源，至少覆盖每家标杆。
- 关键数据（准确率、性能基准、定价）必须指定来源段落/图表位置。

| 编号 | 来源类型 | 标题 / 名称 | URL / 路径 | 相关章节 | 最后访问日期 |
| --- | --- | --- | --- | --- | --- |
| SR-01 | 官方文档 | Automate actions with hooks — Claude Code Docs（退出码语义、`permissionDecision` deny、`Stop` 阻断、`ConfigChange`/`FileChanged` 事件表） | https://code.claude.com/docs/en/hooks-guide | B1, §2.2.1, §2.3 | 2026-09-04 |
| SR-02 | 官方课程 | Hooks · Claude Code 101 · Claude Academy（「CLAUDE.md 是请求不是保证，Hook 是确定性代码」定位；退出码 0/2/其他；项目级 `.claude/settings.json` 随仓库提交） | https://academy.claude.com/courses/claude-code-101/hooks | B1, §2.2.1, §3.1 | 2026-09-04 |
| SR-03 | 官方文档 | Create plugins — Claude Code Docs（插件根目录结构、`.claude-plugin/plugin.json`、skills/commands/agents/hooks/.mcp.json/.lsp.json/monitors/bin/settings.json、四种安装作用域、`claude plugin validate .`、marketplace 源类型） | https://code.claude.com/docs/en/plugins | B1, §2.2.1, §2.3 | 2026-09-04 |
| SR-04 | 官方文档 | Rules — Cursor Docs（`.cursor/rules/` 与 `.mdc` 格式、`description`/`globs`/`alwaysApply` 三字段、四种激活模式、`.cursorrules` legacy 措辞、Team > Project > User 优先级、规则不作用于 Tab/Inline Edit/Bugbot、500 行上限） | https://docs.cursor.com/context/rules | B2, §2.2.2, §2.3 | 2026-09-04 |
| SR-05 | 官方文档 | Hooks — Cursor Docs（`.cursor/hooks.json` schema `version: 1`、事件清单、退出码 2 阻断、`failClosed` 默认 false 与语义、`loop_limit` 默认 5、Enterprise > Team > Project > User 四层优先级与工作目录规则、matcher 规则） | https://cursor.com/en-US/docs/hooks | B2, §2.2.2, §2.3, §3.1 | 2026-09-04 |
| SR-06 | 开源仓库 | github/spec-kit · README（斜杠命令全表、Extensions/Presets/项目本地覆盖四层模板优先级与运行时解析、安装期写入 agent 目录、同名命令优先级与移除回退、`--integration-options="--skills"`） | https://github.com/github/spec-kit | B3, §2.2.3, §2.3 | 2026-09-04 |
| SR-07 | 官方站点 | GitHub Spec Kit（SDD 定位、Spec→Plan→Tasks→Implement 内核、30 integrations、105 community extensions / 60+ authors、22 presets、200+ contributors、离线与防火墙内可用、可自建 catalog） | https://github.github.com/spec-kit/ | B3, §2.2.3, §2.3, §5.1 | 2026-09-04 |
| SR-08 | 官方标准站 | AGENTS.md（定位为「面向 agent 的 README」、60k+ 开源项目采用、嵌套 AGENTS.md 就近优先） | https://agents.md/ | §2.3, §4.1, §4.3 | 2026-09-04 |
| SR-09 | 基金会新闻稿 | Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF)（2025-12-09；MCP / goose / AGENTS.md 三项创始捐赠；AGENTS.md 由 OpenAI 于 2025 年 8 月发布、60,000+ 项目采用、采用方列举 Amp/Codex/Cursor/Devin/Factory/Gemini CLI/GitHub Copilot/Jules/VS Code；白金成员名单） | https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation | §2.3, §4.3 | 2026-09-04 |
| SR-10 | 开放标准规范 | Agent Skills Specification（SKILL.md 结构、frontmatter 字段、三级渐进加载模型、各平台项目/全局目录约定、平台兼容矩阵） | https://agentskills.io/ ；规范仓 https://github.com/agentskills/agentskills | §2.3, §4.3 | 2026-09-04 |
| SR-11 | 开源仓库 | intellectronica/ruler（README：Beta Research Preview 声明、MIT、npm `@intellectronica/ruler`、`.ruler/` 与 `ruler.toml`、`ruler apply`、Supported AI Agents 表 32 类目标与对应文件路径、MCP 传播与 `.gitignore` 自动化） | https://github.com/intellectronica/ruler | B4, §2.2.4, §2.3, §3.1 | 2026-09-04 |
| SR-12 | 官方公告（节选引用） | Amazon Q Developer end-of-support announcement — AWS DevOps Blog（Kiro 能力：Specs / Hooks / Steering files / 自定义子智能体 / Powers；EOS 2027-04-30、12 个月过渡、2026-05-15 起停止新注册、四市场保留插件并挂废弃公告、过渡期续推关键修复） | https://aws.amazon.com/blogs/devops/amazon-q-developer-end-of-support-announcement | B5, §2.2.5, §2.3, §4.1, §5.1 | 2026-09-04 |
| SR-13 | 官方产品页 | Amazon Q Developer — AWS（产品页顶部 End of support notice：2027-04-30 停止支持 IDE 插件，引导至 Kiro） | https://aws.amazon.com/q/developer/ | B5, §2.2.5 | 2026-09-04 |
| SR-14 | 官方文档 | Gemini CLI · Extension reference（`gemini-extension.json` manifest 字段；`migratedTo` 字段语义：CLI 自动检查新源并迁移安装；`contextFileName` / `excludeTools` / `plan`） | https://geminicli.com/docs/extensions/reference/ | §2.3, §4.1, §4.3 | 2026-09-04 |
| SR-15 | 官方文档 | Copilot customization cheat sheet — GitHub Docs（七类定制能力与文件位置对照表；Hooks 在 VS Code 为预览 P、在 Copilot CLI 与 GitHub.com 为支持 ✓；Agent Skills 目录 `.github/skills/`、`.claude/skills/`、`.agents/skills/`） | https://docs.github.com/copilot/reference/customization-cheat-sheet | §2.3 | 2026-09-04 |
| SR-16 | 官方文档 | Use custom instructions in VS Code（`.github/copilot-instructions.md`、AGENTS.md、CLAUDE.md 三类 always-on 指令；`.instructions.md` 的 `applyTo` glob；各作用域默认目录） | https://code.visualstudio.com/docs/copilot/customization/custom-instructions | §2.3 | 2026-09-04 |
| SR-17 | 社区榜单 | bradAGI/awesome-cli-coding-agents（90+ CLI 编码 agent 的星标与定位清单，用于社区采纳度横评） | https://github.com/bradagi/awesome-cli-coding-agents | §5.1（采纳度背景） | 2026-09-04 |
| SR-18 | 内部资料（本项目） | README.md §Host usage（第 224–242 行）：「Skills 不能覆盖全部过程能力；Host 需 Process Kernel + CLI Capability + PromptAssembly 槽」；能力覆盖表中「Gates / pre-30 / may_start_30 = **No**：CLI `verify`」；DSH skill 扫描属上游运行时行为契约，锚定 0.1.0-rc.8（第 218–222 行） | `README.md:218-242`（项目仓根） | §2.2.1, §2.2.4, §4.1, §5.2 U-01 | 2026-09-04 |
| SR-19 | 第三方技术分析 | Cursor Rules 深度指南（规则只作用于 Agent chat、不覆盖 Tab/Inline Edit/Bugbot；「规则是指令而非门禁，规则通过不代表代码能跑」；`.cursorrules` 官方措辞为「legacy and will be deprecated」但未公布移除版本） | https://www.worldprogramming.org/posts/cursor-rules-how-to-configure-cursor-ai-for-your-codebase-ybexpx | B2, §2.2.2, §2.3 | 2026-09-04 |
| SR-20 | 第三方横评（定价与生态位，置信度：综合归纳） | Kiro vs Cursor vs Claude Code 横评（Kiro Free/Pro/Pro+/Power 档位与 credits；Cursor 约 20 USD/月；Claude Code 约 20 USD/月起；Kiro 与 Cursor 的社区规模与生态对比） | https://blog.getbind.co/?p=3541 ；https://agentmarketcap.ai/blog/2026/04/11/aws-kiro-spec-driven-ai-ide-deep-dive | B1/B2/B5 定价行，§2.3, §3.1 | 2026-09-04 |
| SR-21 | 工程实践（npm 治理） | Semantic Versioning: Breaking Changes Guide 2026（破坏性变更四步法：先发次版本废弃告警 → 迁移指南 → 主版本时间线 → 文档版本化；`npm deprecate` 按 semver 范围圈定；旧主版本 6–12 个月安全回补） | https://www.pkgpulse.com/blog/semantic-versioning-guide-breaking-changes-2026 | §4.1, §4.3 | 2026-09-04 |
| SR-22 | 工程实践（npm 治理） | Publishing a Package: exports, Provenance & JSR（`npm deprecate` 语义：不移除版本、只在安装时告警、可携带迁移指向；unpublish 仅限 72 小时且无下游依赖） | https://javascriptcodex.com/publishing | §4.1, §4.3 | 2026-09-04 |

**来源使用声明**：SR-01…SR-16 为一手官方来源（厂商文档、基金会公告、标准站、开源仓库），事实陈述优先引用这些；SR-19/SR-20/SR-21/SR-22 为二手来源，仅用于补充「官方未公开的定价口径、社区横评、工程惯例」，凡引用处已在正文标注置信度为「综合归纳」或「推断」，未作为单一事实的唯一定论依据。SR-18 为本项目内部资料，用于校准 kit 自身定位，不计入外部标杆证据。

---

## 7. 硬指标清单

> 汇总本模板所有章节的硬指标，供自动校验与人工审核使用。

| 章节 | 硬指标项 | 当前状态 | 备注 |
| --- | --- | --- | --- |
| §1 | 调研问题已收敛为 ≥ 3 条可执行问题 | ✅ | 收敛为 Q1–Q5 共 5 条，逐条映射 S1–S5 五颗种子；§1.1 说明为何不覆盖重心 ①② |
| §2.1 | 标杆系统 ≥ 3 家，含 ≥ 1 家头部 SaaS | ✅ | 共 5 家；头部 SaaS 代表 B1 Claude Code（订阅制）、B2 Cursor（订阅制）、B5 Kiro（订阅制多档） |
| §2.1 | 标杆系统 ≥ 1 家开源或自研代表 | ✅ | 开源代表 B3 GitHub spec-kit（MIT）、B4 Ruler（MIT，npm 分发） |
| §2.2 | 每家标杆有独立详述卡片 | ✅ | 五张卡片（§2.2.1–§2.2.5），每张 10 维度逐行标注置信度 |
| §2.3 | 关键能力横向事实无遗漏 | ✅ | 14 个能力维度 × 5 家 + 4 条跨切事实；不评分不排序，仅陈列 |
| §3.1 | 对比矩阵含 5 维度 + 权重 + 评分 | ✅ | 权重和 = 1.00（0.30 + 0.20 + 0.15 + 0.15 + 0.20）；逐项打分依据可回溯至 §2 事实 |
| §3.2 | 评分结论含优先/部分/不借鉴三层 | ✅ | 优先 B4 4.40 / B3 4.35；部分 B1 3.90 / B2 3.40；不借鉴 B5 2.55（仅取其迁移范式） |
| §4.1 | 自研/采购/复用边界有明确建议 | ✅ | 8 个能力项逐条给建议方式、依据、候选方案与关键前提；全部标注为建议 |
| §4.2 | MVP 范围建议与用户诉求对齐 | ✅ | R1–R8 逐条对齐重心 ③④；4 项建议入 MVP、4 项否决或延期 |
| §5.1 | 主要风险 ≥ 3 条，有缓解建议 | ✅ | 6 条（R-01…R-06），每条含触发条件、影响范围、严重程度、缓解建议 |
| §6 | 关键来源可追溯（URL / 章节） | ✅ | 22 条来源，覆盖全部 5 家标杆；一手来源 16 条，二手来源标注置信度 |
| 全文 | 明确区分事实 / 推断 / 建议 / 风险 | ✅ | §0 给出四类标注约定；§2.2 逐行标置信度；§4 全节标注「建议而非裁决」；风险只出现在 §5 |
| 全文 | 不存在编造来源或占位符 | ✅ | 模板元信息区之外无尖括号占位符、无示范前缀、无待填日期、无遗留待验证标记；术语：kit ≠ harness，专家团阶段门 G1–G6 ≠ kit 项目过程命令 G1–G7 |

---

## 8. 中间确认自检报告

> 本节为 `research-analyst` 自检记录，供 G2 人工审核追溯。协议依据：`skills/aicoding-team-bootstrap/protocols/intermediate_confirmation.md`。

### 8.1 节点一：§1 调研问题收敛完成后

**§2.1 方案分歧判定：未命中。** 收敛方向由用户诉求显式给定（审查重心四项全选，主理人指定服务 ③ 与 ④），Q1–Q5 与五颗种子 S1–S5 一一对应，不存在两种以上合理且需用户裁决的收敛方向。

**§2.3 反向验证（强制三问）**：

- **Q1（3 个月后被推翻，返工成本）**：返工范围 = §1.1 与 §1.2 两张表（共 10 行）+ §2.1 标杆清单表 + §2.2 五张卡片 + §3.1 打分五行；切换成本估算 ≈ 0.2 人月（重跑一轮检索 + 重打分 + 重写五张卡片）。**判为可控**。
- **Q2（用户 / 客户 / 监管能否感知）**：三方均感知不到。判断依据：本阶段产物为内部证据基线，不随 npm 包分发（kit `package.json` `files` 白名单不含 `.workbuddy/`），不修改任何 CLI 行为或对外文档，不构成客户合同、SLA 或监管口径的一部分。
- **Q3（与用户原始诉求是否一致）**：一致。用户诉求原文「**启动 AICoding 架构专家团，对我当先的项目进行完整阅读、审查、评价、未来升级方案路线规划**」，主理人任务书 §4 明确「你的调研直接服务于 ③ 与 ④」。§1 的 Q1–Q5 未新增用户未提及的调研方向。

### 8.2 节点二：§2.1 标杆清单完成后

**§2.1 方案分歧判定：未命中。** 主理人任务书 §5 已给出取舍标准（「优先选与 kit 在『规范注入机制 / 门禁强制性 / 宿主耦合方式 / 分发形态』上可比的对象，而非泛泛的 AI 编码助手」），模板硬指标亦已规定下限（≥3 家且含 ≥1 家头部 SaaS + ≥1 家开源），专业判断可单方裁决，无需用户取舍。

**§2.3 反向验证（强制三问）**：

- **Q1**：返工范围 = §2.1 增行 + §2.2 增卡片 + §2.3 增列 + §3.1 增列 + §6 增来源；切换成本 ≈ 0.15 人月/每增一家标杆。**判为可控**。
- **Q2**：三方均感知不到。判断依据同节点一（证据基线不对外）；另候选池本身由主理人任务书给出，清单取舍不引入新的对外承诺。
- **Q3**：一致。用户诉求原文「③ 产品竞争力与生态位」要求判断 kit「在行业里处在什么位置」，必须引入外部可比对象；主理人任务书 §5 已给出可比性标准，本报告按该标准从 12 家候选收 5 家并在 §2.1 末列说明未入选理由。

### 8.3 节点三：§3.1 设定权重前

**§2.1 方案分歧判定：未命中。** 采用模板默认权重（0.30 / 0.20 / 0.15 / 0.15 / 0.20），未重设。§3.1 已逐行给出默认权重在本项目中同样适用的理由；按默认权重打分未出现「明显不适用并反转推荐排名」的情形（B4 4.40 与 B3 4.35 接近但同为优先层，B1/B2 落部分层，B5 落否决层的分层结论对权重扰动不敏感：即使把技术成熟度上调至 0.30、场景契合度下调至 0.20，B5 仍为最低分 2.85，分层不变）。

**§2.3 反向验证（强制三问）**：

- **Q1**：返工范围 = §3.1 权重列与 5 行得分 + §3.2 三层结论措辞；切换成本 ≈ 0.05 人月（纯表内重算，无需重新检索）。**判为可控**。
- **Q2**：三方均感知不到。判断依据：加权打分是**评估而非授权**；§3.2 全部结论均标注为「建议 / 借鉴 / 否决」而非「已冻结决策」，§4 抬头明示「本节是建议而非最终裁决，最终边界由业务架构师冻结」，保留了 `business-architect` 的完整裁决空间。
- **Q3**：一致。用户诉求未显式提及任何权重或评分口径；模板已给定默认权重与「权重和 = 1.00」硬约束，采用默认不偏离用户显式诉求，也不改变产品形态。

### 8.4 节点四：§5.2 待确认项整理时（最后一次完整复核）

**§2.1 方案分歧判定：未命中。** §5.2 的 U-01…U-06 全部是「外部信息不可得」的事实缺口，不是方案分歧；报告未对其中任何一项做静默选择，逐项给出「若无法确认的备选路径」。

**§2.3 反向验证（强制三问）**：

- **Q1**：返工范围 = §5.2 六行 + §4.1「宿主适配矩阵」与「分发通道」两行 + §2.2.4 中依赖 U-01 的表述；切换成本 ≈ 0.1 人月。**判为可控**。
- **Q2**：**部分可感知，但本阶段未做选择**。具体：U-01（DSH 宿主契约）若后续据此新增宿主抽象层，属于内部重构，用户不可感知；U-04（第二分发通道）若最终采纳，用户可感知（安装方式从「仅 npm」变为「 marketplace 一键装」）、监管可感知（第三方审核与数据驻留）。判断依据：§4.1 分发通道行的原文为「**第二通道是否引入，已作为 `[中间确认]` 论题上报，未经用户裁决前不作为既定方向**」；§5.3 已把该点列为 D-03，交 `business-architect` 在 G5 部署设计与安全设计阶段裁决。本阶段**未替下游选择**。
- **Q3**：一致。用户诉求原文未显式提及分发通道；项目现状「分发：npm + GitHub Releases + GitHub Actions，**没有任何云资源**」（主理人任务书 §3）在报告中作为约束被维持，而非被改变——第二通道仅列为待评估项且已上报。

### 8.5 节点五：§4.1 取舍建议产出后（追加自检 · 已命中并已发起）

**§2.1 方案分歧判定：命中。** 三项条件全部成立：

1. 存在 ≥2 种合理方案且无法由研究侧单方裁决 —— 方案甲：维持 DSH 单一宿主深度绑定，把 kit 做成 DSH 生态内的独占过程内核；方案乙：演化为跨宿主规范分发器，以 `AGENTS.md` 为公分母覆盖多宿主。二者的取舍是**业务定位与资源投入判断**，不是可由证据单方决定的技术判断（证据只说明两条路各自的风险与收益，见 §5.1 R-01/R-02/R-03）。
2. 该决策直接影响下游成员产出 —— 决定 `business-architect` 在 G3 冻结的业务边界、抽象层投入与非功能需求。
3. 用户原始诉求未对该决策点做出明确选择 —— 用户诉求原文仅要求「审查、评价、未来升级方案路线规划」，未指定宿主策略。

**处置**：已按协议 §3 以 `[中间确认]` 前缀向主理人发起单题确认（论题 = kit 的生态位定位与宿主策略）。**阻塞范围** = §4.1「宿主适配矩阵」「分发通道」两行的最终建议措辞、§4.2 R2/R6 的最终判定、§8.5 结论收口；**可并行** = §5、§6、§7 全部内容、全文落盘、模板合规自动校验与回传。在答复回注前，§4.1 相关行保持「建议 + 关键前提」表述，不写成既定方向。

**裁决回注结果（2026-09-04）**：用户经主理人转交裁决为「**乙 · 两步走**」—— 演化为跨宿主规范分发器；1.x 阶段先收敛内部一致性（X7 统一 S2 真值源 / X6 SPEC 钉版治理 / X11 `.cyning-harness` 语义收敛），2.0 阶段再引入宿主适配表。§4.1「宿主适配矩阵」「分发通道」、§4.2 R2/R6、§4.3「宿主适配声明」「分发通道」、§5.2 U-04、§5.3 D-01 已按此裁决修订并标注「经中间确认」；本论题关闭，同一阶段不再重复发起。

**§2.3 反向验证（强制三问）**：

- **Q1**：返工范围 = §4.1 两行 + §4.2 R2/R6 两行 + §4.3「宿主适配声明」「分发通道」两行 + §5.1 R-02/R-03 的缓解建议措辞；切换成本 ≈ 0.3 人月（选乙需新增适配表与 2 个非 DSH 宿主适配，选甲则维持现状并加深 DSH 契约依赖）。**判为可控，但高于前四个节点**，这也是发起中间确认的理由之一。
- **Q2**：**用户可感知**。具体感知点：选乙会改变 kit 的对外形态（从「DSH 插件」变为「跨宿主 CLI 工具」，README 与安装方式随之变化）与对外承诺（宣称支持的宿主清单）；选甲则会把「仅支持 DSH」固化为长期承诺。客户与监管侧：本决策不触及 SLA 与数据出境（两条路均为本地 CLI、无云资源），故客户与监管不可感知。
- **Q3**：**用户诉求未显式提及此点**。用户诉求原文为「启动 AICoding 架构专家团，对我当先的项目进行完整阅读、审查、评价、未来升级方案路线规划」，以及审查重心「③ 产品竞争力与生态位」。「生态位」一词与宿主策略高度相关，但诉求**未指定** kit 应当做单宿主还是跨宿主；主理人任务书 §3 现状描述「npm 包，同时是 DeepSeek Harness（DSH）的 bundle 插件」亦为事实陈述而非方向选择。故不构成「用户已明确事项」，发起中间确认不违反协议 §6。

### 8.6 自检小结

| 节点 | §2.1 判定 | Q1 返工可控 | Q2 可感知方 | Q3 与诉求一致 | 是否发起 |
| --- | --- | --- | --- | --- | --- |
| 一 · §1 收敛后 | 未命中 | 是（≈0.2 人月） | 无 | 一致 | 否 |
| 二 · §2.1 清单后 | 未命中 | 是（≈0.15 人月/家） | 无 | 一致 | 否 |
| 三 · §3.1 权重前 | 未命中 | 是（≈0.05 人月） | 无 | 一致 | 否 |
| 四 · §5.2 待确认后 | 未命中 | 是（≈0.1 人月） | U-04 部分可感知，但本阶段未选择 | 一致 | 否 |
| 五 · §4.1 取舍后 | **命中（方案分歧）** | 是（≈0.3 人月，高于前四节点） | **用户可感知**（产品形态与对外承诺） | 诉求未显式提及 | **是（已发起）** |

---
