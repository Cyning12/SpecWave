# AICoding 架构设计 · UserStory

> 本文档为《AICoding 架构设计》核心产物之一，定位为**产品需求与用户故事（UserStory）**。
> 上游输入：《高层架构设计》中的需求概要、行业调研、业务架构、产品原型（已冻结 G3 通过）；
> 下游输出：驱动《系统设计》《部署设计》《安全设计》的具体功能实现。
>
> **本项目边界提示**：本项目为本地 CLI + npm 分发的 Node 包（同时是 DSH bundle 插件），无云资源、无后端服务、无管理端 UI；本文档的用户故事以「CLI 终端输出」「宿主内工具调用返回」与「落盘文件路径」为主要交互形态。
>
> **术语提示（与本文档其它章节同名不同义）**：
>
> - 文中出现的 **G1–G7** 一律指 kit CLI 的「项目过程命令」（`task` / `lifecycle` / `status` / `timeline` 等面向流程的命令集合），**不指专家团阶段门 G1–G6**；当需要指专家团阶段门时用「G1 资料摘要」「G3 阶段门」等明确写法。
> - **DSH** = DeepSeek Harness，宿主运行时；本项目（kit）是它的 bundle 插件（`dsh plugin add` 安装面）。
> - **hat** = 角色帽制（00 delegate-only / 10 / 20 / 30 / 40 execute）。
> - **ICVO** = Inform · Constrain · Verify · Orchestrate，方法论内核。
> - **S2 过程域** = `docs/tasks/` + `docs/harness/reviews/` + `docs/harness/invokes/by-task/`，是「永不覆写」硬约束覆盖的目录集合。
> - **P0 门禁** = `check` / `verify` / `gate-check` / `audit` 四个机械判定命令。
> - **kit** = 本产品 dsh-coding-kit；**harness** 在本文中仅指旧产品线 `@cyning/harness`，**不指代本产品**。

---



## 1. 业务背景与价值

> 本章整合业务背景、行业方案、方案收益与术语清单，为 §4 角色清单 / §5 用户旅程提供统一语境；与《高层架构设计》§1 保持一致。



### 1.1 业务背景

- **当前业务现状**：`dsh-coding-kit`（kit）是一款已发布至 1.10.0 的 npm 包，同时是 DeepSeek Harness（DSH）宿主运行时的 bundle 插件。它的方法论内核是 **ICVO（Inform · Constrain · Verify · Orchestrate）**，叠加 **hat 角色帽制**（00 委派 / 10 / 20 / 30 / 40 执行）给 AI 编码过程加纪律。kit 提供**双入口**：
  - **插件面**：DSH 宿主内的工具 `apply_coding_standards`（注入规范）与 `init_coding_kit`（初始化落盘），通过 `dsh plugin add` 安装。
  - **CLI 面**：`npx dsh-coding-kit <subcommand>`，含 P0 门禁（`check` / `verify` / `gate-check` / `audit`）与项目过程命令 G1–G7（`task` / `lifecycle` / `status` / `timeline` / `sync` / `refresh-ide-blocks` / `compile-graph`）。
- **触发本次需求的事件**：项目 Owner 启动 AICoding 架构专家团，对 kit 做完整阅读、审查、评价与未来升级路线规划（审查重心四项全选：架构与模块化 / 工程质量与测试 / 产品竞争力与生态位 / 升级路线与版本演进）；本轮发现的四个内部一致性缺口（X7 S2 前缀分裂 / X6 SPEC 版本钉失真 / X11 `.cyning-harness` 双重语义 / X12 / X19 / X3 工程口径矛盾）倒逼 MVP 收敛。
- **本系统在产品矩阵中的位置**：kit 在「AI 编码纪律工具」价值主线中承担**「纪律的机械判定 + 过程轨留档 + 角色分帽（ICVO + hat）」**的核心职责，与「规范注入（assets 适配器）」「分发底座（npm + GitHub Releases）」共同形成完整业务闭环。本系统是「跨宿主规范分发器」演进方向上的**已有系统扩展**（D1 决策）—— 1.x 收敛内部一致性、2.0 引入宿主适配表（经中间确认的 D2 决策）。



### 1.2 行业方案

> 本节只给读者判断「同类问题是否有更优解」，不重复 G2 调研结论（完整对标见 `.workbuddy/output/research_report.md` 与《高层架构设计》§3）。


| 标杆                  | 借鉴之处                                                               | 不借鉴之处                                 |
| ------------------- | ------------------------------------------------------------------ | ------------------------------------- |
| Ruler（B4）           | 单一规范源 + 声明式适配表 + `npx ruler apply` 编译落地（形态与适配表设计）                  | Beta 实现、与宿主格式对齐的零碎拼装                  |
| GitHub spec-kit（B3） | 四层模板优先级（本地 > Presets > Extensions > Core）+ 安装期物化 + 产物入仓可审          | 与上游 GitHub 深度绑定的安装器形态                 |
| Claude Code（B1）     | 退出码 2 / `permissionDecision: deny` 阻断语义、约 30 个钩子事件、项目级 hooks 随仓库共享 | 宿主绑定 + 商业订阅（与 kit 零云资源冲突）             |
| Cursor（B2）          | 四层优先级 + `loop_limit` + `failClosed` 失败即阻断                          | IDE 绑定 + 商业订阅（与 kit 零云资源冲突）           |
| AWS Kiro（B5）        | 旧产品线迁移治理范式（12 个月过渡窗 / 新注册截止先于 EOS 日 / 旧渠道挂废弃公告 / 按渠道给迁移指南）         | 端到端 IDE 形态 + AWS/Bedrock 绑定（**否决形态**） |


**结论摘要**：五家标杆中**无任何一家提供「P0 门禁 + 过程轨留档 + 角色分帽（ICVO + hat 00/10/20/30/40）」的等价物**——这是 kit 不被 Ruler 类工具替代的根因，也是护城河所在（与高层架构 §4.1「差异化价值」一致）。

### 1.3 方案收益与价值


| 项      | 说明                                                                                                                                                     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 功能模块   | 规范注入（Inform/Constrain）+ P0 门禁（Verify：check/verify/gate-check/audit + D5 测试制品探测）+ 过程轨留档（Orchestrate：tasks/reviews/invokes）+ 方法论内核（ICVO + hat）+ 旧产品线迁移治理 |
| 预期价值收益 | 给 AI 编码过程加"可证明的纪律"——让编码过程可追溯、可审计、可复现；消除对外承诺失真与内部真值源分裂；为 2.0 跨宿主规范分发器化提供可扩展底座                                                                           |
| 量化标准   | S2 过程域前缀硬编码份数 4 → 1（V1，一致率 100%）；SPEC 版本钉偏差 8 版本 → 0（V2）；`.cyning-harness` 语义数 2 → 1（V3）；P0 门禁语义文档化（V4）；重复常量归零（V5，2.0）                                 |




### 1.4 术语清单

> 统一文档专有名词；与高层架构 / 系统设计 / 安全设计共用同一术语基线。


| 术语                     | 含义                                                                                                                                                                 | 同名不同义警告                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| kit / dsh-coding-kit   | 本产品 npm 包                                                                                                                                                          | **不得**用 `harness` 指代本产品；`harness` 仅指旧产品线 `@cyning/harness` 或 DSH Harness 宿主 |
| DSH / DeepSeek Harness | kit 的首个宿主（cordis 加载），由 `dsh plugin add` 安装                                                                                                                         | 宿主运行时，非 kit 的一部分                                                            |
| ICVO                   | Inform · Constrain · Verify · Orchestrate 方法论内核                                                                                                                    | 不指任何产品名                                                                     |
| hat                    | 角色帽制 00 / 10 / 20 / 30 / 40                                                                                                                                        | 00=委派 / 40=执行；帽号从 invoke 文件名中提取（`cli-sync.ts:6 extractHatId`）               |
| S2 过程域                 | `docs/tasks/` + `docs/harness/reviews/` + `docs/harness/invokes/by-task/` 三组目录的统称                                                                                  | 「永不覆写」硬约束覆盖范围；任何命令命中即阻断                                                     |
| P0 门禁                  | `check` / `verify` / `gate-check` / `audit` 四个机械判定命令；`gate-check` 失败退出码 2 阻断                                                                                       | **不指** G1–G7 阶段门 / 任何专家团 Gate                                               |
| 项目过程命令 G1–G7           | kit CLI 内的过程命令族，命令名原名（`task` / `lifecycle` / `status` / `timeline` / `sync` / `refresh-ide-blocks` / `compile-graph`）；具体含义见 `src/cli.ts` 与 `material_digest.md` D9 | **同名不同义**：与 AICoding 架构专家团 G1–G6 阶段门无关                                      |
| D5 测试制品探测              | `test_strategy=required` 时强制探测 `test/` 下制品；缺失即门禁失败                                                                                                                 | 门禁子能力，非阶段门                                                                  |
| 双入口                    | 插件面（`apply_coding_standards` + `init_coding_kit`）+ CLI 面（`npx dsh-coding-kit`）                                                                                     | 不互替代                                                                        |
| 旧产品线                   | `@cyning/harness` → kit 迁移；`from_version` 字段记录旧版本号                                                                                                                 | 版本号跨产品线不可比                                                                  |
| `from_version`         | 迁移场景下，记录旧产品线的版本号字段                                                                                                                                                 | 不作语义比较；只用于迁移路径匹配                                                            |
| `.cyning-harness`      | kit 现行落盘的「kit 本体」目录名（语义在 X11 治理后收敛为单一定义）                                                                                                                           | 不指代旧产品线包名 `@cyning/harness`                                                 |
| `.dsh/skills`          | DSH 宿主的 skills 白名单根（kit 的 skills 仅落在此白名单内，见 `cli-skills.ts:272-283`）                                                                                               | 与 `.coding-kit` 不同                                                          |
| `.coding-kit`          | kit 在消费者仓库落盘的工程目录                                                                                                                                                  | 不与 `.dsh/skills` 同义                                                         |


---



## 2. 范围与边界

> 本章以《高层架构设计》§6.1 需求边界（In-Scope / Out-of-Scope）与 §5.2 系统依赖为直接依据，划定系统内模块、系统外模块与外部依赖三类边界。



### 2.1 系统内模块及功能

> 沿用《高层架构设计》§6.2「产品模块全景图」的模块边界，本节只列模块与一级功能归属，详见 §3 功能清单。

**接入层 / 触点端**：

- CLI 面：`npx dsh-coding-kit <subcommand>`（消费者仓库命令行入口）
- 插件面：`apply_coding_standards`（宿主内注入规范）+ `init_coding_kit`（宿主内初始化落盘）

**业务能力层 / 核心模块**：

- 规范注入器（Inform + Constrain）—— MVP 复用 assets 适配器；2.0 抽为声明式适配表（F6）
- P0 门禁器（Verify：check / verify / gate-check / audit + D5）—— MVP 仅做语义层对齐（F2）
- 过程轨留档器（Orchestrate：tasks / reviews / invokes）—— MVP 仅做 S2 真值源唯一化（F1）
- 方法论内核（ICVO + hat 帽制 00/10/20/30/40）—— MVP 仅做最小对外表达文档
- 迁移治理器（旧产品线 → kit）—— MVP 落地时间表 + MIGRATION 文档（F3 + F4）

**基础能力层 / 底座与数据**：

- assets 资产库（standards / skills / adapters / graph）—— 现状散落为硬编码，复用前须抽为声明式清单
- S2 过程域真值源（统一硬编码前缀）—— MVP 必须唯一化（F1）
- 分发底座（npm registry + GitHub Releases + GitHub Actions）—— 维持现状，零云
- 运行时（TypeScript + Node + js-yaml 唯一运行时依赖）



### 2.2 系统外模块及功能


| 编号  | 不做的事                         | 原因                                                                    | 后续计划                      |
| --- | ---------------------------- | --------------------------------------------------------------------- | ------------------------- |
| O1  | 自研 IDE / 深度绑定单一宿主（R7）        | 与 npm 包形态与零云优势冲突；投入产出不成立（对标 B5 评分 2.55）                               | 不做                        |
| O2  | 商业化计费 / 团队席位（R8）             | 赛道内最贴近形态的 B3/B4 均为 MIT 开源零许可；内部一致性未收敛前商业化会暴露信任风险                      | MVP 外，另行评估                |
| O3  | 第二分发通道 / 第三方 marketplace（R6） | 引入云依赖与第三方审核，击穿「无任何云资源」约束                                              | 后移 G5 部署设计与安全设计           |
| O4  | 云服务 / SaaS 化                 | 本项目是本地 CLI + npm 分发的 Node 包，无任何云资源                                    | 不做                        |
| O5  | kit 业务方 web 控台 / SaaS 后台     | 与 O4 同因；产品形态为 CLI + 文件落盘，无服务端                                         | 不做                        |
| O6  | 跨宿主规范分发器化（F6 / 2.0 阶段）       | MVP 阶段只做内部一致性收敛，跨宿主适配表必须建立在唯一真值源之上                                    | 2.0 阶段；至少落地 2 个非 DSH 宿主适配 |
| O7  | DB / 表结构设计 / 资源规格            | 本项目不规定，由下游 `system-architect` / `platform-architect` 在《系统设计》《部署设计》中裁决 | 不在本产物范围                   |




### 2.3 外部依赖


| 依赖系统            | 提供方      | 依赖能力                                                                           | 接入方式                                                             | 接口人                                                         |
| --------------- | -------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| DSH 宿主运行时       | DeepSeek | 插件安装面 `dsh plugin add`、宿主内工具注册 `apply()`、cordis 加载                             | 宿主进程内同步调用                                                        | DSH 维护者；契约版本锚定 0.1.0-rc.8，需版本嗅探 + 不匹配降级（U-01）               |
| npm registry    | npm      | 包分发与版本解析、`npm deprecate` 迁移治理                                                  | HTTPS / npm CLI（同步）                                              | npm 官方；凭据分级与轮转归 `security-architect`                        |
| GitHub Actions  | GitHub   | CI（`prepublishOnly` 四道闸门）、发布制品                                                 | OIDC 令牌 + workflow（异步）                                           | kit 维护者；`npm test` 不覆盖 `test/lib-smoke/`（X10），须走 `test:lib` |
| GitHub Releases | GitHub   | 版本制品归档、`docs/releases/` 来源                                                     | HTTPS                                                            | kit 维护者                                                     |
| 消费者仓库           | 各消费者     | 门禁执行 + 过程轨留盘                                                                   | CLI 进程 + 文件落盘（`.dsh/skills` / `.coding-kit` / `.cyning-harness`） | 消费者；仓库级隔离，无服务端多租户                                           |
| assets 资产目录（本仓） | kit 维护者  | 规范 / skills / 适配器 / 图谱资产                                                       | 文件读取                                                             | kit 维护者；适配关系散落为硬编码，2.0 前抽为声明式清单                             |
| S2 过程域真值源（本仓）   | kit 维护者  | `docs/tasks/` + `docs/harness/reviews/` + `docs/harness/invokes/by-task/` 三组目录 | 文件读取 + 唯一前缀真值                                                    | kit 维护者；MVP 必须唯一化（F1）                                       |


---



## 3. 功能清单

> **定位**：全景骨架表，进入「角色 / 场景 / US」之前先看到完整功能版图。下表与《高层架构设计》§6.3 功能清单（F1–F6）**逐项对齐**，未做任何新增或裁剪。



### 3.1 功能清单结构（建议字段）


| 编号  | 一级模块                   | 二级模块    | 功能项                                                                                                            | 优先级 | MVP 范围 | 完整版范围 | 对齐目标 | US 映射                                   |
| --- | ---------------------- | ------- | -------------------------------------------------------------------------------------------------------------- | --- | ------ | ----- | ---- | --------------------------------------- |
| F1  | 过程轨留档（Orchestrate）     | S2 真值源  | S2 真值源唯一化（X7）：`docs/tasks/`、`docs/harness/reviews/`、`docs/harness/invokes/by-task/` 三组目录的前缀硬编码（4 份）收敛为 1 份共享常量 | P0  | ✅      | ✅     | V1   | US-7、US-8                               |
| F2  | P0 门禁（Verify）          | 门禁语义    | P0 门禁语义对齐行业（R3）：退出码 2 = 阻断、`gate-check` 失败即放行（退出码 1）、`failClosed` 默认策略、分层强制写入 README/SPEC                      | P0  | ✅      | ✅     | V4   | US-1、US-4、US-7                          |
| F3  | 迁移治理                   | 旧产品线迁移  | 旧产品线迁移时间表（R4）：`@cyning/harness` 挂 `npm deprecate` + EOS 日 + MIGRATION 文档 + 过渡窗；`from_version` 字段记录旧版本号         | P0  | ✅      | ✅     | V3   | US-6                                    |
| F4  | 迁移治理                   | 目录语义收敛  | `.cyning-harness` 语义收敛（X11）：双重语义（现行落盘 vs legacy 标记）→ 单一定义（统一为「kit 本体目录」）                                       | P0  | ✅      | ✅     | V3   | US-3、US-6、US-8                          |
| F5  | 版本钉治理                  | SPEC 钉版 | SPEC 版本钉一致性校验（X6 → R5）：SPEC.md 版本钉必须与 `package.json` version 一致，发布前自动校验阻断                                      | P0  | ✅      | ✅     | V2   | US-7                                    |
| F6  | 规范注入（Inform/Constrain） | 宿主适配表   | 规范分发器化（R2，2.0 阶段）：单一规范源 → `AGENTS.md` / `CLAUDE.md` 等 N 宿主原生配置位，声明式适配表                                         | P1  | ❌      | ✅     | V1   | （推迟至 2.0；本产物范围外，但 US-2 / US-3 隐含承接宿主感知） |


**硬指标校验**：

- 每个 P0 功能（F1–F5）在 MVP 范围内为 ✅；F6 是 P1 且 MVP 范围为 ❌，与高层架构一致。
- 每个功能均能反向映射到高层架构 §2.5 功能缺口 + §2.3 期待目标（V1–V5），无新增。



### 3.2 §3 自检报告（中间确认触发判定）

> 按协议 §2.4 在功能清单完成后插入自检；按 §2.1 判定 + §2.3 反向验证 3 问输出。

**§2.1 触发标准 #1（方案分歧型）判定**：

1. 当前决策点（F1–F5 的优先级 / MVP 归属）是否存在 ≥2 种方案？—— **不存在**；优先级与 MVP 归属在《高层架构设计》§6.3 已冻结，逐项一致。
2. 是否影响下游成员的产出？—— 是，但下游是承接冻结结论而非再裁决。
3. 用户原始诉求 / 上游冻结文档是否已对该决策点做出明确选择？—— **是**；《高层架构设计》§6.3 + §2.3 期待目标已对 F1–F6 全部锁定。

→ **未命中 #1**。

**§2.3 反向验证 3 问**（即使未命中 #1 仍必须显式回答）：


| 问题                     | 答案       | 证据                                                                                                                                                            |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1：3 个月后被推翻，返工成本？      | **可控**   | 返工范围仅 §3 一张表与 §5 中映射行（< §5 总篇幅的 5%）；切换成本 < 0.1 人月；表结构对齐上游，仅字段值变化，不改章节骨架                                                                                       |
| Q2：用户 / 客户 / 监管能感知吗？   | **感知不到** | F1–F5 是「内部一致性收敛 + 文档工程」，**对外可见行为零变化**（CLI 命令名、退出码语义、落盘路径均不变）；仅 F6（2.0 跨宿主）才产生用户可见形态变化，而 F6 已明确标记 2.0 范围、MVP 不做。依据：《高层架构设计》§4.3「MVP 阶段不改变产品形态」+ §6.1「F6 ❌ MVP」 |
| Q3：与用户原始诉求显式提及的能力是否一致？ | **一致**   | 用户原始诉求 = 审查四项全选 + 收敛内部一致性 + 不偏离已冻结边界；F1–F5 全是收敛项，与诉求一致。`material_digest.md` §0 与高层架构 §2.3 V1–V5 直接对应                                                          |


→ **未命中 #2**；§3 无需发起 `[中间确认]`，可直接冻结。

---



## 4. 角色与场景

> 本章沿用《高层架构设计》§2.1「核心角色关注点」五类角色与 §6.4 / §6.5 触点端，输出角色清单与关键场景清单，作为 §5 用户旅程的输入。



### 4.1 角色清单

> 沿用《高层架构设计》§2.1「核心角色关注点」五类角色，不做细分（细分会改变下游模块边界与功能归属，属越权）。


| 角色                    | 业务身份                              | 主要操作                                                                               | 核心关注点                                                                                                |
| --------------------- | --------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| R1 项目 Owner / kit 维护者 | kit 维护者 / 产品方向决策者                 | 决定宿主策略、MVP 范围、版本发布、迁移时间表；执行 `prepublishOnly` 四道闸门                                  | 在 `AGENTS.md` 规范注入层已标准化的背景下，能否守住「P0 门禁 + 过程轨留档 + 角色分帽（ICVO + hat）」的差异化护城河；MVP 收敛后 2.0 跨宿主的可扩展底座是否准备好 |
| R2 宿主内开发者（最终用户 A）     | 在 DSH 宿主内跑 AI 编码的工程师              | 触发 `apply_coding_standards`（注入规范）/ `init_coding_kit`（初始化落盘）                        | 纪律注入是否无侵入、不打断编码流程；规范是否随版本一致可预期；S2 过程域保护是否生效（命中即阻断，不误删历史轨迹）                                           |
| R3 CLI 门禁执行者（最终用户 B）  | 消费者仓库中跑门禁的开发者 / CI 流程             | 执行 `npx dsh-coding-kit check` / `verify` / `gate-check` / `audit` 等 P0 命令；CI 中接入门禁 | 门禁判定是否机械、可信、可解释；退出码语义是否明确（阻断 vs 放行）；D5 测试制品探测是否生效；`failClosed` 默认策略是否生效                              |
| R4 旧产品线用户（受影响方）       | `@cyning/harness` 既有使用者 / 试点反馈人   | 从旧产品线迁移到 kit；阅读 MIGRATION 文档                                                       | 迁移时间表与迁移成本是否明确、可预期；`from_version` 字段能否精确匹配迁移路径；过渡窗是否够长；旧渠道是否还接收 deprecate 提示                         |
| R5 外部评估者（受影响方）        | 依据 SPEC / README 评估 kit 的潜在用户与贡献者 | 阅读 SPEC.md / README / CHANGELOG / docs/releases/                                   | 对外承诺（SPEC 版本钉、能力边界、退出码语义）与实际能力是否一致；版本钉是否随发布保持同步；发布回顾是否覆盖到当前版本（X3）                                    |


**硬指标**：≥3 条（甲方决策者 / 最终用户 / 受影响方各至少一行）—— 已满足（R1 = 甲方决策者；R2 + R3 = 最终用户；R4 + R5 = 受影响方）。

### 4.2 关键场景清单


| 编号  | 角色           | 触发条件                                     | 期望结果                                                                               | 频率（预估）           |
| --- | ------------ | ---------------------------------------- | ---------------------------------------------------------------------------------- | ---------------- |
| S1  | R2 宿主内开发者    | 在 DSH 宿主内首次打开项目工作区                       | 调用 `apply_coding_standards` 注入规范，落盘到 `.dsh/skills` 白名单                             | 项目级一次性           |
| S3  | R2 宿主内开发者    | 在 DSH 宿主内首次为某个仓库启用 kit                   | 调用 `init_coding_kit` 在消费者仓库初始化 `.coding-kit` 与 `.cyning-harness`                   | 仓库级一次性           |
| S4  | R3 CLI 门禁执行者 | 开发者本地提交前 / CI 流水线                        | 执行 `verify` 或 `gate-check`；失败退出码 2 阻断合并                                            | 日均数十次 / 每仓库      |
| S5  | R3 CLI 门禁执行者 | 发布或重大改动前                                 | 执行 `audit` 全面审计；命中 P0 失败即阻断发布                                                      | 每周 / 每仓库         |
| S6  | R3 CLI 门禁执行者 | 开发者提交涉及 task / review / invoke 文档        | `check` 命中 S2 过程域前缀时**永不覆写**并显式提示                                                  | 日均数次 / 每仓库       |
| S7  | R1 kit 维护者   | 新版本发布前                                   | 执行 `prepublishOnly` 四道闸门 + SPEC 版本钉一致性校验 + S2 真值源回归                                | 每次发布             |
| S8  | R1 kit 维护者   | 准备 1.x → 2.0 演进评审                        | 用 `lifecycle dry-run` / `status` 等过程命令评估过渡窗与现有制品                                   | 每阶段门             |
| S9  | R1 kit 维护者   | 存量 IDE 块需要随版本刷新                          | 执行 `refresh-ide-blocks`（cli-refresh-ide-blocks.ts）改写消费者仓库的 `.DSH/skills` 等存量 IDE 块 | 每适配器版本变化         |
| S10 | R1 kit 维护者   | 调整 S2 路径规则或新增 hats 后需要重建图谱               | 执行 `compile-graph`（cli-graph-hgm.ts）重生成自技术图谱                                       | 每月 / 每阶段         |
| S11 | R4 旧产品线用户    | 仍使用 `@cyning/harness`，运行 `npx harness …` | npm `deprecate` 提示命中，附 MIGRATION 链接与过渡窗结束日                                         | 旧产品线活跃期          |
| S12 | R5 外部评估者     | 阅读 SPEC.md 与 README 评估 kit               | SPEC 版本钉 = 包版本；能力边界与 §6.3 一致；发布回顾覆盖到当前版本                                           | 评估期（评估人数 ≪ 使用人数） |




### 4.3 §4 自检报告（中间确认触发判定）

> 按协议 §2.4 在角色与场景清单完成后插入自检。

**§2.1 触发标准 #1 判定**：是否存在 ≥2 种方案且影响下游 + 上游未明确？—— **不存在**；R1–R5 在《高层架构设计》§2.1 已冻结，逐项一致。

**§2.3 反向验证 3 问**：


| 问题                     | 答案       | 证据                                                                 |
| ---------------------- | -------- | ------------------------------------------------------------------ |
| Q1：3 个月后被推翻，返工成本？      | **可控**   | 返工范围 = §4.1 表 5 行 + §4.2 表 12 行；切换成本 < 0.2 人月（仅改表格，不改下游模块拆分）       |
| Q2：用户 / 客户 / 监管能感知吗？   | **感知不到** | 角色清单是内部工程划分，不改变 CLI 命令、落盘位置、退出码语义                                  |
| Q3：与用户原始诉求显式提及的能力是否一致？ | **一致**   | `material_digest.md` §D1（README 双入口 / 宿主内工具清单）+ D11（迁移治理）明确指向这五类角色 |


→ **未命中 #2**；§4 无需发起 `[中间确认]`，可直接冻结。

---



## 5. 用户旅程（UserStory）

> 每条 US 按 **业务场景 / 业务流程 / UE 原型 / 业务逻辑 / 数据描述 / 验收标准 / 外部集成接口** 七段式展开。



### 5.1 US-1

> **故事名**：DSH 宿主内开发者首次注入编码规范（视角 R2）



#### 5.1.1 业务场景

- **视角**：R2 宿主内开发者
- **描述逻辑**：在 DSH 宿主内首次打开新仓库的工作区，希望把 kit 提供的 ICVO 规范一次性落到 DSH 的原生配置位（`.dsh/skills` 白名单内）；不希望被打断编码节奏，也不希望历史 task / invoke 文件被误覆盖。



#### 5.1.2 业务流程

- **视角**：用户；**描述方式**：Given / When / Then 时序表述本旅程的产品表现流程与退出码语义。

```
Given 开发者已在 DSH 宿主进程内加载 kit 插件（dsh plugin add 完成），工作区为新仓库
And   当前 .dsh/skills 白名单为空（或仅有旧产品线遗留）
And   kit 版本为 1.x
When  开发者通过 DSH 宿主内工具面板触发 apply_coding_standards(profile="l1" | "l1+l2" | "full")
Then  kit 在 .dsh/skills 白名单内落盘对应 profile 的 skills（仅命中白名单）
And   任何命中 S2 过程域（docs/tasks、docs/harness/reviews、docs/harness/invokes/by-task）的路径不写入，仅返回 "S2_PROTECTED: skipped: <rel-path>" 文本
And   落盘完成后返回落盘文件清单（含路径 / hat 帽号 / profile 档位）
And   若失败，返回非阻断提示（exit_code ≠ 2），开发者可继续编码
```



#### 5.1.3 UE 原型

> 本项目无 web UI；UE 原型 = 宿主内工具面板调用返回文本 + 文件落盘路径。示意（非真实输出格式）：

```
$ dsh> apply_coding_standards --profile l1
[INFO]  profile=l1，落盘目标 .dsh/skills/
[INFO]  写入：.dsh/skills/standards/l1/SKILL.md         hat=20
[INFO]  写入：.dsh/skills/standards/l1/SKILL-graph.md    hat=30
[WARN]  S2_PROTECTED: skipped: docs/tasks/done/T-001-001.md
[WARN]  S2_PROTECTED: skipped: docs/harness/invokes/by-task/T-001/invoke-20.md
[OK]    写入 2 个文件；跳过 2 个 S2 受保护路径；exit_code=0
```



#### 5.1.4 业务逻辑

- **视角**：业务系统（kit 内部，单进程同步、本地 fs）；**描述方式**：时序表述系统视角的判定、落盘与退出码决策流程。

```
DSH 宿主内 apply() 钩子
    └─ apply_coding_standards(profile)
         ├─ 加载 S2 过程域真值源（F1 收敛后的 1 份共享常量）
         ├─ 加载 .dsh/skills 白名单（cli-skills.ts:272-283）
         ├─ 遍历 profile 对应的 assets/standards/ 模板
         │    ├─ 若目标路径命中 S2 → 记 SKIPPED（S2_PROTECTED），不写入
         │    └─ 若目标路径在 .dsh/skills 白名单内 → 写入文件
         └─ 返回落盘清单 + 跳过清单 + exit_code
```



#### 5.1.5 数据描述

- **输入**：profile ∈ {l1, l1+l2, full}（必填）；目标工作区路径（由宿主提供）
- **核心数据流转**：
  - S2 前缀真值源 → 1 份共享常量（`src/index.ts` 导出，见 `cli-refresh-ide-blocks.ts:299` / `cli-graph-hgm.ts:367` / `cli-skills.ts:272-283` 共用）
  - assets/standards//SKILL*.md → `.dsh/skills/standards/<profile>/SKILL*.md`
  - 跳过清单 → 标准输出 stderr 行（含 `S2_PROTECTED:` 前缀）
- **副作用**：仅命中 `.dsh/skills` 白名单的路径写入；S2 过程域路径只读



#### 5.1.6 验收标准 AC

- **验收口径**：以下 AC 以 Given / When / Then 结构化表述，覆盖正常路径与异常路径（含 failClosed 阻断分支），可直接转化为回归测试用例。

```
AC-1（正常路径）
  Given DSH 宿主已加载 kit，.dsh/skills 为空
  When  调用 apply_coding_standards(profile="l1")
  Then  .dsh/skills/standards/l1/ 下生成完整 SKILL 文件集
  And   返回 exit_code=0
  And   落盘清单条数 = assets/standards/l1/ 下文件数

AC-2（异常路径 - S2 命中）
  Given 工作区存在 docs/tasks/done/T-001.md
  When  调用 apply_coding_standards(profile="full")
  Then  docs/tasks/done/T-001.md 文件内容不变（hash 前后一致）
  And   stderr 含 "S2_PROTECTED: skipped: docs/tasks/done/T-001.md"
  And   exit_code ∈ {0, 1}（非 2，不阻断编码流）

AC-3（异常路径 - profile 非法）
  When  调用 apply_coding_standards(profile="invalid")
  Then  返回 exit_code=1
  And   stderr 含 "E-PROFILE: profile must be one of l1|l1+l2|full"
  And   不写入任何文件

AC-4（异常路径 - 白名单外路径）
  Given assets 模板试图写入 .claude/skills/（不在 .dsh/skills 白名单）
  When  调用 apply_coding_standards(profile="full")
  Then  不写入 .claude/ 路径
  And   stderr 含 "W-WHITELIST: skipped: <rel-path>"
  And   exit_code=0（仅警告）

AC-6（性能基线 — 建议基线，不作硬阻断；经中间确认方案 B）
  Given 工作区文件数 ≤ 1k
  When  调用 apply_coding_standards(profile="full")
  Then  P95 端到端耗时参考 §6.2 建议基线（< 3s，推荐运行环境；不构成 SLA，不作硬阻断）
```



#### 5.1.7 外部集成接口

- **DSH 宿主运行时**：cordis `apply()` 钩子；kit 通过 `cordis.patch.yml` 注册两个宿主内工具（`apply_coding_standards` / `init_coding_kit`）。契约版本锚定 DSH 0.1.0-rc.8；若不匹配触发降级（U-01），fallback 到 CLI 面 `npx dsh-coding-kit apply --profile <p>`。
- **assets 资产目录**：本地文件读取（同步）。
- **不涉及**：npm registry（安装时已下载）、网络调用、第三方服务。

---



### 5.2 US-2：DSH 宿主内开发者为新仓库初始化 kit 落盘

> **定位**：插件面 init_coding_kit 在消费者仓库一键初始化 .coding-kit / .cyning-harness 与 S2 过程域空骨架（视角 R2，对应 F4 语义收敛）。



#### 5.2.1 业务场景

- **视角**：R2 宿主内开发者
- **描述逻辑**：开发者在一个全新（或既有）仓库首次启用 kit，希望通过宿主内工具一键初始化 `.coding-kit` / `.cyning-harness` 工程目录与 S2 过程域；不希望宿主工具阻塞或要求重启。



#### 5.2.2 业务流程（Given / When / Then）

- **视角**：用户；**描述方式**：Given / When / Then 时序表述本旅程的产品表现流程与退出码语义。

```
Given 仓库根目录无 .coding-kit/ 与 .cyning-harness/
And   kit 已作为 DSH bundle 插件加载
When  开发者通过宿主内工具面板触发 init_coding_kit
Then  kit 创建 .coding-kit/ 标准结构（config + tasks skeleton + reviews skeleton + invokes skeleton）
And   kit 创建 .cyning-harness/ 作为 kit 本体目录（F4 语义收敛后唯一含义）
And   S2 过程域三组目录（docs/tasks/、docs/harness/reviews/、docs/harness/invokes/by-task/）以空目录形式就绪
And   返回落盘清单与 .cyning-harness/ 语义提示（说明 .cyning-harness/ 仅指 kit 本体，不再是 legacy 探测标记）
```



#### 5.2.3 UE 原型

- 核心路径 / 节点的 UE 原型；本项目为 CLI 文本输出 + 落盘路径（无 web UI），以下为示意输出。

```
$ dsh> init_coding_kit
[INFO]  初始化目标 .coding-kit/、.cyning-harness/、docs/tasks/、docs/harness/reviews/、docs/harness/invokes/by-task/
[INFO]  写入：.coding-kit/config.yaml          （空骨架 + 默认 profile=l1）
[INFO]  写入：.coding-kit/tasks/.gitkeep
[INFO]  写入：.coding-kit/reviews/.gitkeep
[INFO]  写入：.coding-kit/invokes/.gitkeep
[INFO]  写入：.cyning-harness/README.md        （含 F4 语义收敛说明）
[WARN]  S2 已就绪：docs/tasks/、docs/harness/reviews/、docs/harness/invokes/by-task/ 已建空骨架
[OK]    初始化完成；exit_code=0
```



#### 5.2.4 业务逻辑

- **视角**：业务系统（kit 内部，单进程同步、本地 fs）；**描述方式**：时序表述系统视角的判定、落盘与退出码决策流程。

```
DSH 宿主内 apply() 钩子
    └─ init_coding_kit(target)
         ├─ 检查 .coding-kit/ 是否已存在 → 若存在则询问（默认不覆盖）
         ├─ 检查 .cyning-harness/ 是否已存在 → 若存在则跳过（F4 唯一语义下不重复创建）
         ├─ 创建 .coding-kit/ 标准结构
         ├─ 创建 S2 过程域空骨架（不允许覆写已有 task / review / invoke 文件）
         └─ 返回落盘清单
```



#### 5.2.5 数据描述

- **输入**：目标仓库根路径（由宿主提供）
- **核心数据流转**：
  - kit 内部默认配置 → `.coding-kit/config.yaml`（含默认 profile）
  - F4 唯一语义说明 → `.cyning-harness/README.md`（明确「kit 本体目录」单一定义）
  - S2 真值源共享常量 → 决定 docs/tasks/、docs/harness/reviews/、docs/harness/invokes/by-task/ 三组路径
- **副作用**：仅当目标不存在时创建；绝不覆写已有 S2 内容



#### 5.2.6 验收标准 AC

- **验收口径**：以下 AC 以 Given / When / Then 结构化表述，覆盖正常路径与异常路径（含 failClosed 阻断分支），可直接转化为回归测试用例。

```
AC-1（正常路径 - 全新仓库）
  Given 仓库根无 .coding-kit/、.cyning-harness/
  When  调用 init_coding_kit
  Then  .coding-kit/ 标准结构创建完成
  And   .cyning-harness/ 创建完成（含 F4 语义说明 README）
  And   docs/{tasks,harness/reviews,harness/invokes/by-task}/ 空骨架就绪
  And   exit_code=0

AC-2（异常路径 - 二次初始化）
  Given .coding-kit/ 已存在
  When  调用 init_coding_kit
  Then  不修改任何现有文件（hash 全部不变）
  And   stderr 含 "E-EXISTS: .coding-kit/ already exists, refusing to overwrite"
  And   exit_code=1

AC-3（异常路径 - S2 冲突）
  Given docs/tasks/done/T-001.md 已存在
  When  调用 init_coding_kit
  Then  docs/tasks/done/T-001.md 文件不变
  And   docs/tasks/ 新建的空骨架与已有文件不冲突
  And   exit_code=0（仅警告 S2 已就绪）

AC-4（异常路径 - 仓库根不可写）
  Given 仓库根为只读
  When  调用 init_coding_kit
  Then  不创建任何文件
  And   stderr 含 "E-PERMISSION: target is read-only: <path>"
  And   exit_code=2（阻断，因失败即阻断 failClosed）
```



#### 5.2.7 外部集成接口

- **DSH 宿主运行时**：cordis `apply()` 钩子（同 US-1）；契约版本嗅探 + 不匹配降级（U-01）。
- **本地文件系统**：直接 `mkdir` / `writeFile`（同步）。
- **不涉及**：网络、第三方。

---



### 5.3 US-3：CLI 门禁执行者跑 P0 门禁校验

> **定位**：CLI 面 verify 对仓库做机械判定，退出码语义对齐行业（2 阻断 / 1 非阻断 / 0 全通过），覆盖 D5 测试制品探测与 S2 保护（视角 R3，对应 F1 / F2）。



#### 5.3.1 业务场景

- **视角**：R3 CLI 门禁执行者
- **描述逻辑**：开发者在本地提交前，或 CI 流水线在合并前，希望通过单一命令机械验证「本次改动是否触发 P0 级违规」；开发者关心退出码语义是否明确、命中项是否可解释、D5 测试制品探测是否生效。



#### 5.3.2 业务流程（Given / When / Then）

- **视角**：用户；**描述方式**：Given / When / Then 时序表述本旅程的产品表现流程与退出码语义。

```
Given 仓库已安装 kit（通过 package.json devDependency 或 dsh plugin add）
And   仓库存在 docs/tasks/done/T-001.md 等历史 task 文件
When  开发者在仓库根执行 npx dsh-coding-kit verify
Then  kit 遍历门禁规则，对每条命中项输出：
       - rule_id / rule_name / file / line / message
And   累计 P0 失败条数 = 0 → exit_code=0（放行）
And   累计 P0 失败条数 ≥ 1 → exit_code=2（阻断；failClosed 默认策略）
And   仅 P1/P2 警告（无 P0 失败）→ exit_code=1（非阻断放行）
And   任何命中 S2 过程域路径的写入尝试被拦截（永不覆写），并附 S2_PROTECTED 文本
```



#### 5.3.3 UE 原型

- 核心路径 / 节点的 UE 原型；本项目为 CLI 文本输出 + 落盘路径（无 web UI），以下为示意输出。

```
$ npx dsh-coding-kit verify
[INFO]  kit=1.10.0 (commit <hash>); 加载 S2 真值源（共享常量）
[P0]   S2_OVERWRITE_RISK   docs/tasks/done/T-001.md     "不应改写 S2 过程域"
[P0]   S2_OVERWRITE_RISK   docs/harness/reviews/2025-Q3.md  "不应改写 S2 过程域"
[P1]   HAT_ROLE_GAP        assets/standards/l1/SKILL.md  "未声明 hat 帽号"
[FAIL]  P0 失败 = 2 / 警告 = 1
[FAIL]  exit_code=2 （阻断，failClosed）
```

正常路径：

```
$ npx dsh-coding-kit verify
[INFO]  kit=1.10.0; S2 真值源 OK
[OK]    无 P0 失败
[OK]    exit_code=0 （放行）
```



#### 5.3.4 业务逻辑

- **视角**：业务系统（kit 内部，单进程同步、本地 fs）；**描述方式**：时序表述系统视角的判定、落盘与退出码决策流程。

```
npx dsh-coding-kit verify [target]
    └─ 加载 cli.ts 注册的 verify 子命令（cli.ts:verify_cmd）
         ├─ 加载 S2 过程域真值源（1 份共享常量；F1）
         ├─ 加载门禁规则族（cli-checks.ts 等）
         ├─ D5：若 test_strategy=required，探测 test/ 下制品（X10 要求走 test:lib）
         ├─ 遍历仓库规则命中点：
         │    ├─ P0 命中 → 累计 +1
         │    ├─ P1/P2 命中 → 累计警告
         │    └─ S2 过程域写入尝试 → 拦截 + S2_PROTECTED 文本
         └─ 按退出码语义输出（F2 对齐行业：2=阻断 / 1=非阻断 / 0=全通过）
```



#### 5.3.5 数据描述

- **输入**：仓库根路径（可选，默认 cwd）；可选 `--target <dir>`；可选 `--severity p0|p1|p2`
- **核心数据流转**：
  - F1 S2 真值源共享常量 → 决定 S2 路径集合
  - cli-checks.ts:14 反向 import 的 `WIKI_DELTA_LITERALS` / `WIKI_DELTA_PATHISH_RE` → wiki_delta 校验
  - cli-task-extra.ts:168-282 的 `loadTaskSidecar` / `validateTaskSidecar` / `collectTaskSidecars` / `detectDependsOnCycle` → task sidecar 校验
  - 命中项 → stdout（rule_id / file / line / message / severity）
- **副作用**：仅 stdout / stderr 输出 + 退出码；**不修改任何文件**



#### 5.3.6 验收标准 AC

- **验收口径**：以下 AC 以 Given / When / Then 结构化表述，覆盖正常路径与异常路径（含 failClosed 阻断分支），可直接转化为回归测试用例。

```
AC-1（正常路径 - 全通过）
  Given 仓库无 P0 违规
  When  执行 npx dsh-coding-kit verify
  Then  exit_code=0
  And   stdout 含 "[OK]"
  And   无任何 S2_PROTECTED 文本

AC-2（正常路径 - 仅 P1 警告）
  Given 仓库存在 P1 警告但无 P0 失败
  When  执行 npx dsh-coding-kit verify
  Then  exit_code=1（非阻断）
  And   stdout 含 P1 警告条数

AC-3（异常路径 - P0 命中）
  Given 仓库存在 P0 失败（≥1）
  When  执行 npx dsh-coding-kit verify
  Then  exit_code=2（阻断，failClosed）
  And   stdout 含每条 P0 失败的 rule_id / file / line / message

AC-4（异常路径 - S2 覆写尝试）
  Given 命令内部某规则试图写入 docs/tasks/done/T-001.md
  When  执行 npx dsh-coding-kit verify --fix-unsafe （假设的修复旗标）
  Then  实际不修改文件
  And   stderr 含 "S2_PROTECTED: skipped: docs/tasks/done/T-001.md"
  And   exit_code=2（阻断，且不修改）

AC-5（异常路径 - D5 缺失）
  Given config.yaml 设 test_strategy=required，但 test/ 下无制品
  When  执行 npx dsh-coding-kit verify
  Then  触发 D5 失败
  And   exit_code=2（阻断）
  And   stderr 含 "E-D5: test artifacts missing under test/"

AC-6（异常路径 - 重复规则一致）
  Given 同时执行 verify 和 audit
  Then  两命令对同一仓库的 S2 命中结论完全一致（F1 真值源唯一化的直接体现）
```



#### 5.3.7 外部集成接口

- **消费者仓库**：直接 fs 读取（同步）；**不修改任何文件**。
- **S2 真值源**：1 份共享常量（F1），跨 verify / audit / check / gate-check 共用。
- **不涉及**：网络、npm registry、第三方服务。

---



### 5.4 US-4：CI 流水线接入 gate-check 做合并门禁

> **定位**：CI 合并前调用 gate-check，P0 失败退出码 2 阻断合并、P1 警告放行，退出码直接可被 GitHub Actions / GitLab CI 解读（视角 R3，对应 F2）。



#### 5.4.1 业务场景

- **视角**：R3 CLI 门禁执行者（含 CI 流水线）
- **描述逻辑**：CI 在合并 PR 前调用 `gate-check`，希望「P0 失败即阻断合并，P1 警告可放行」语义对齐行业（Claude Code 退出码 2 / `permissionDecision: deny`），并希望退出码可直接被 GitHub Actions / GitLab CI 解读。



#### 5.4.2 业务流程（Given / When / Then）

- **视角**：用户；**描述方式**：Given / When / Then 时序表述本旅程的产品表现流程与退出码语义。

```
Given CI 工作流已配置 npx dsh-coding-kit gate-check 作为合并前必过项
And   本次 PR 改动了 docs/tasks/done/T-002.md（F4 收敛后这是 S2 过程域路径）
When  CI 触发 gate-check
Then  kit 命中 S2 写入尝试规则
And   拦截并输出 S2_PROTECTED 文本
And   exit_code=2（阻断 PR 合并）
And   CI 流水线读取退出码 2，PR 被自动标记为 ❌
```



#### 5.4.3 UE 原型

- 核心路径 / 节点的 UE 原型；本项目为 CLI 文本输出 + 落盘路径（无 web UI），以下为示意输出。

CI 日志节选：

```
Run npx dsh-coding-kit gate-check
[INFO]  gate-check: PR #<n>; base=<branch>; changed_files=<N>
[P0]   S2_OVERWRITE_RISK   docs/tasks/done/T-002.md   "S2 过程域不应改写"
[FAIL]  exit_code=2
Error: Process completed with exit_code 2.
```



#### 5.4.4 业务逻辑

- **视角**：业务系统（kit 内部，单进程同步、本地 fs）；**描述方式**：时序表述系统视角的判定、落盘与退出码决策流程。

```
npx dsh-coding-kit gate-check [--base <branch>]
    └─ 加载 cli.ts:gate_check_cmd
         ├─ 解析 PR 改动集（git diff --name-only <base>..HEAD）
         ├─ 对每条改动的路径：
         │    ├─ 命中 S2 过程域前缀（F1 共享常量）→ 标记 P0 失败 + S2_PROTECTED
         │    └─ 命中其他 P0 规则 → 累计 P0
         └─ 按 F2 退出码语义输出
```



#### 5.4.5 数据描述

- **输入**：可选 `--base <branch>`（默认 `main` 或 `master`）；可选 `--head <ref>`
- **核心数据流转**：
  - `git diff --name-only` → 改动路径列表
  - S2 真值源共享常量 → 命中判定
  - 命中结果 → stdout / stderr + exit_code
- **副作用**：零文件修改；仅产出 CI 日志



#### 5.4.6 验收标准 AC

- **验收口径**：以下 AC 以 Given / When / Then 结构化表述，覆盖正常路径与异常路径（含 failClosed 阻断分支），可直接转化为回归测试用例。

```
AC-1（正常路径 - 放行）
  Given PR 未改动 S2 过程域路径且无其他 P0 失败
  When  CI 执行 npx dsh-coding-kit gate-check
  Then  exit_code=0
  And   CI 标记 PR 为 ✅ 可合并

AC-2（异常路径 - S2 命中阻断）
  Given PR 改动 docs/tasks/done/T-002.md
  When  CI 执行 gate-check
  Then  exit_code=2（CI 解读为阻断）
  And   stderr 含 S2_PROTECTED 文本
  And   CI 标记 PR 为 ❌

AC-3（异常路径 - 退出码契约）
  Then  退出码 ∈ {0, 1, 2}，与 F2 行业对齐契约一致：
         0 = 全通过 / 1 = 非阻断放行 / 2 = 阻断

AC-4（异常路径 - 与 verify 一致）
  Given 同一 PR 同时执行 verify 和 gate-check
  Then  两命令对 S2 路径的命中结论完全一致（F1 真值源唯一化）
```



#### 5.4.7 外部集成接口

- **git CLI**（本地仓库内）：`git diff --name-only`（同步）。
- **CI 系统**：GitHub Actions / GitLab CI 读取退出码（异步）。
- **不涉及**：云端 API、第三方。

---



### 5.5 US-5：维护者执行 prepublishOnly 做版本发布前四道闸门

> **定位**：维护者发布 1.x 前执行 prepublishOnly 四道闸门（npm test + test:lib + SPEC 版本钉一致 + S2 真值源回归），任一道失败即阻断发布（视角 R1，对应 F1 / F5 / V2）。



#### 5.5.1 业务场景

- **视角**：R1 kit 维护者
- **描述逻辑**：维护者准备发布 1.x 版本，必须跑 `prepublishOnly` 的四道闸门（`npm test` + `test:lib` + SPEC 版本钉一致性 + S2 真值源回归），任何一道失败必须阻断发布；这是消除 X6 / X19 / X3 工程口径矛盾的最后一道硬闸。



#### 5.5.2 业务流程（Given / When / Then）

- **视角**：用户；**描述方式**：Given / When / Then 时序表述本旅程的产品表现流程与退出码语义。

```
Given 维护者在仓库 main 分支，工作树干净
And   SPEC.md 版本钉 = "1.10.0"（假设本次发布目标）
And   package.json version = "1.10.0"（已 bump）
When  维护者执行 npm run prepublishOnly
Then  闸门 1：npm test 全通过（含 test/*.test.ts 39 文件）
And   闸门 2：npm run test:lib 通过（含 test/lib-smoke/，X10 修复）
And   闸门 3：SPEC.md 版本钉与 package.json version 一致（F5）；不一致则阻断
And   闸门 4：S2 真值源回归（F1）：4 份硬编码前缀共享常量跨命令门禁结论一致率 100%
And   四道闸门全过 → 发布继续（npm publish）
And   任一道失败 → exit_code=2，发布中止
```



#### 5.5.3 UE 原型

- 核心路径 / 节点的 UE 原型；本项目为 CLI 文本输出 + 落盘路径（无 web UI），以下为示意输出。

```
$ npm run prepublishOnly
> 闸门 1/4  npm test          ... PASS (39 files, 0 fail)
> 闸门 2/4  npm run test:lib  ... PASS (lib-smoke)
> 闸门 3/4  SPEC pin check    ... PASS (SPEC.md=1.10.0 = package.json=1.10.0)
> 闸门 4/4  S2 truth-source regression ... PASS (跨命令一致率 100%)
[OK]    四道闸门全过；可继续发布
```



#### 5.5.4 业务逻辑

- **视角**：业务系统（kit 内部，单进程同步、本地 fs）；**描述方式**：时序表述系统视角的判定、落盘与退出码决策流程。

```
npm run prepublishOnly
    └─ 串联四道闸门：
         ├─ npm test                  → 39 文件根级 + node:test + strip-types
         ├─ npm run test:lib          → test/lib-smoke/ 1 文件（X10 修复）
         ├─ bin/check-spec-pin.*      → SPEC.md 版本钉 == package.json version（F5）
         └─ bin/check-s2-truth.*      → 4 处原硬编码路径全部指向 1 份共享常量（F1）
```



#### 5.5.5 数据描述

- **输入**：SPEC.md 版本钉（`SPEC.md:1` / `:49` 之一）；`package.json:version`；仓库工作树状态
- **核心数据流转**：
  - `npm test` → 39 文件根级 + node:test 报告 → 退出码
  - `test:lib` → `test/lib-smoke/*.test.ts` → 退出码
  - F5 校验器 → 比较 SPEC.md 版本钉 vs package.json version → 一致性布尔
  - F1 校验器 → 抽取 4 个原硬编码点的常量化引用 → 全部指向 `src/index.ts` 共享常量
- **副作用**：仅 stdout / stderr；发布前不修改任何发布制品



#### 5.5.6 验收标准 AC

- **验收口径**：以下 AC 以 Given / When / Then 结构化表述，覆盖正常路径与异常路径（含 failClosed 阻断分支），可直接转化为回归测试用例。

```
AC-1（正常路径 - 四道全过）
  Given 工作树干净，SPEC.md 版本钉 == package.json version
  And   S2 真值源已收敛为 1 份共享常量
  When  执行 npm run prepublishOnly
  Then  四道闸门依序通过
  And   exit_code=0（可继续 npm publish）

AC-2（异常路径 - SPEC 版本钉偏差）
  Given SPEC.md 钉 "1.2.0"，package.json "1.10.0"（X6 现象）
  When  执行 npm run prepublishOnly
  Then  闸门 3 失败
  And   stderr 含 "E-SPEC-PIN: SPEC.md=1.2.0 != package.json=1.10.0"
  And   exit_code=2（阻断发布）

AC-3（异常路径 - S2 真值源分裂）
  Given S2 前缀硬编码仍有 ≥2 份独立字面量（F1 未完成）
  When  执行 npm run prepublishOnly
  Then  闸门 4 失败
  And   stderr 含 "E-S2-TRUTH: <file>:<line> 仍为独立硬编码，应引用 src/shared/s2-truth.ts"
  And   exit_code=2（阻断发布）

AC-4（异常路径 - npm test 失败）
  Given 任一 test 文件失败
  When  执行 npm run prepublishOnly
  Then  闸门 1 失败
  And   exit_code=2（阻断发布）

AC-5（异常路径 - test:lib 失败 / 未跑）
  Given test:lib 未单独跑（X10 现象）
  When  执行 npm run prepublishOnly
  Then  prepublishOnly 主动调 test:lib
  And   若 lib-smoke 失败 → 闸门 2 失败 → exit_code=2
```



#### 5.5.7 外部集成接口

- **npm CLI**（`npm test` / `npm run test:lib` / `npm publish`）：本地执行（同步）。
- **node:test 框架**：内置（同步）。
- **本地 git**：发布前检查工作树状态（可选）。
- **不涉及**：云端 CI（GitHub Actions 是发布后的事，非本 US 范围）。

---



### 5.6 US-6：旧产品线用户迁移到 kit

> **定位**：旧产品线 @cyning/harness 用户运行旧命令时收到 deprecate 横幅 + MIGRATION 链接 + EOS 时间表，过渡窗内不阻断（视角 R4，对应 F3 / F4 / V3）。



#### 5.6.1 业务场景

- **视角**：R4 旧产品线用户（`@cyning/harness` 既有使用者）
- **描述逻辑**：用户仍在使用 `@cyning/harness`，运行 `npx harness …` 时收到 npm `deprecate` 提示与 MIGRATION 链接，希望按时间表与迁移指南无损迁移到 kit。



#### 5.6.2 业务流程（Given / When / Then）

- **视角**：用户；**描述方式**：Given / When / Then 时序表述本旅程的产品表现流程与退出码语义。

```
Given 旧产品线 @cyning/harness 仍可用，但 npm deprecate 提示已挂出
And   MIGRATION.md 已发布，含 from_version 字段映射表
And   过渡窗为自发布日起 12 个月（AWS Kiro 范式）
When  旧产品线用户执行 npx harness <old-cmd>
Then  stdout 提示 DEPRECATION 横幅，包含：
       - 推荐替换命令（npx dsh-coding-kit <new-cmd>）
       - from_version → to_version 映射行（精确匹配用户当前旧版本）
       - MIGRATION 文档链接
       - 过渡窗结束日（EOS 日期）
And   旧命令仍可执行（过渡窗内不阻断），但 deprecate 横幅每次都打
```



#### 5.6.3 UE 原型

- 核心路径 / 节点的 UE 原型；本项目为 CLI 文本输出 + 落盘路径（无 web UI），以下为示意输出。

```
$ npx harness verify
[DEPRECATION] @cyning/harness 已进入迁移期（from_version=1.5.0 → kit=1.10.0）
[DEPRECATION] 推荐替换：npx dsh-coding-kit verify
[DEPRECATION] 迁移指南：https://github.com/<org>/dsh-coding-kit/blob/main/MIGRATION.md#from-1.5.0
[DEPRECATION] 过渡窗结束日：2027-09-04（自 2026-09-04 起 12 个月）
[WARN]  本命令仍可执行，但建议尽快迁移
... （旧命令正常执行输出） ...
```



#### 5.6.4 业务逻辑

- **视角**：业务系统（kit 内部，单进程同步、本地 fs）；**描述方式**：时序表述系统视角的判定、落盘与退出码决策流程。

```
npm deprecate @cyning/harness "<message with from_version hint>"
    └─ 旧命令入口（harness CLI）
         ├─ 检测 from_version（来自用户本地 package.json 或 lockfile）
         ├─ 输出 deprecate 横幅（含迁移映射 + EOS 日 + 文档链接）
         └─ 执行原命令（过渡窗内不阻断）
```



#### 5.6.5 数据描述

- **输入**：旧产品线版本号（`from_version`，从用户本地 lockfile 推断）
- **核心数据流转**：
  - `from_version` 映射 → 推荐命令表（从 MIGRATION.md 加载）
  - 当前日期 → 是否在过渡窗内（影响「横幅仅警告」vs「即将阻断」）
  - 横幅内容 → stdout
- **副作用**：仅 stdout / stderr；**不修改用户文件**；不阻止旧命令执行



#### 5.6.6 验收标准 AC

- **验收口径**：以下 AC 以 Given / When / Then 结构化表述，覆盖正常路径与异常路径（含 failClosed 阻断分支），可直接转化为回归测试用例。

```
AC-1（正常路径 - 横幅提示）
  Given 用户本地安装 @cyning/harness@1.5.0
  When  执行 npx harness verify
  Then  stdout 含 "[DEPRECATION]" 横幅
  AND   横幅含 from_version=1.5.0 → kit=1.10.0 映射
  AND   横幅含 MIGRATION 链接
  AND   旧命令正常执行（exit_code 与原行为对齐）

AC-2（异常路径 - from_version 未知）
  Given 用户本地 @cyning/harness 版本不在映射表
  When  执行 npx harness verify
  Then  stdout 含 "[DEPRECATION] from_version=<unknown>，请查阅 MIGRATION.md#unmapped"
  AND   不阻断（exit_code 与原行为对齐）

AC-3（正常路径 - 过渡窗临近结束）
  Given 当前日期距 EOS ≤ 30 天
  When  执行 npx harness verify
  Then  横幅追加 "[DEPRECATION] 过渡窗即将结束，请尽快迁移"
  AND   旧命令仍可执行（不阻断）

AC-4（异常路径 - 过渡窗结束）
  Given 当前日期 ≥ EOS
  When  执行 npx harness verify
  Then  exit_code=2（阻断）
  AND   stderr 含 "E-EOS: @cyning/harness 已停止支持，请迁移到 kit"
```



#### 5.6.7 外部集成接口

- **npm registry**：`npm deprecate` 设置横幅消息（异步；维护者侧）。
- **MIGRATION.md**（本仓）：版本映射表文档。
- **不涉及**：云服务、第三方通知系统。

---



### 5.7 US-7：维护者编译自技术图谱（compile-graph）

> **定位**：维护者调整 S2 规则或新增 hats 后重建 docs/_tech_graph/ 图谱族（ontology.yaml + dot/svg），图谱不随 npm 包发布（视角 R1，对应 F1 真值源）。



#### 5.7.1 业务场景

- **视角**：R1 kit 维护者
- **描述逻辑**：维护者在调整 S2 路径规则或新增 hats 后，需要重建 kit 自技术图谱（`docs/_tech_graph/`*），用于内部审查、版本回顾与外部评估者参考。



#### 5.7.2 业务流程（Given / When / Then）

- **视角**：用户；**描述方式**：Given / When / Then 时序表述本旅程的产品表现流程与退出码语义。

```
Given docs/_tech_graph/ 目录存在（13 份图谱文件）
And   S2 真值源已收敛为 1 份共享常量（F1）
When  维护者执行 npx dsh-coding-kit compile-graph
Then  kit 扫描 assets/ + src/ + docs/，重新生成图谱族：
       - ontology.yaml（hat × 命令 × S2 路径交叉表）
       - <graph-id>.dot / .svg（架构图）
       - 自技术图谱不随 npm 包发布（保留在 docs/_tech_graph/）
And   退出码语义遵循 F2：0 = 全通过；非 0 = 失败
```



#### 5.7.3 UE 原型

- 核心路径 / 节点的 UE 原型；本项目为 CLI 文本输出 + 落盘路径（无 web UI），以下为示意输出。

```
$ npx dsh-coding-kit compile-graph
[INFO]  扫描 assets/ + src/ + docs/...
[INFO]  生成 ontology.yaml       (hat×cmd×S2 交叉表)
[INFO]  生成 1-graph-overview.dot / .svg
[INFO]  生成 2-graph-s2-truth.dot / .svg
...
[OK]    生成 13 份图谱；exit_code=0
```



#### 5.7.4 业务逻辑

- **视角**：业务系统（kit 内部，单进程同步、本地 fs）；**描述方式**：时序表述系统视角的判定、落盘与退出码决策流程。

```
npx dsh-coding-kit compile-graph
    └─ 加载 cli-graph-hgm.ts:compile_graph_cmd
         ├─ 扫描 assets/standards/、assets/skills/、src/*.ts、docs/_tech_graph/
         ├─ 应用 S2 真值源共享常量（cli-graph-hgm.ts:367 收敛为 1 份）
         ├─ 生成 ontology.yaml 与若干 .dot / .svg
         └─ 写到 docs/_tech_graph/（不写入 docs/ 其它位置；S2 保护）
```



#### 5.7.5 数据描述

- **输入**：可选 `--out <dir>`（默认 `docs/_tech_graph/`）
- **核心数据流转**：
  - F1 S2 真值源共享常量 → 图谱交叉表列维度
  - assets + src + docs 扫描结果 → 图谱节点与边
  - 图谱族 → 写入 docs/_tech_graph/（**不随 npm 包发布**）
- **副作用**：仅写 docs/_tech_graph/；不触碰 S2 过程域



#### 5.7.6 验收标准 AC

- **验收口径**：以下 AC 以 Given / When / Then 结构化表述，覆盖正常路径与异常路径（含 failClosed 阻断分支），可直接转化为回归测试用例。

```
AC-1（正常路径）
  Given S2 真值源已收敛，工作树干净
  When  执行 npx dsh-coding-kit compile-graph
  Then  docs/_tech_graph/ 下 13 份图谱全部刷新
  And   exit_code=0

AC-2（异常路径 - S2 真值源分裂）
  Given S2 真值源仍分裂（F1 未完成）
  When  执行 npx dsh-coding-kit compile-graph
  Then  exit_code=2（阻断，因 failClosed）
  And   stderr 含 "E-S2-TRUTH: 应在 compile-graph 之前先做 F1 收敛"

AC-3（异常路径 - 落盘失败）
  Given docs/_tech_graph/ 为只读
  When  执行 npx dsh-coding-kit compile-graph
  Then  不写任何文件
  And   exit_code=2
  And   stderr 含 "E-PERMISSION: <path> is read-only"

AC-4（正常路径 - 跨命令一致）
  Given 同时执行 compile-graph 与 verify
  Then  两命令对 S2 路径的判定完全一致（F1 直接体现）
```



#### 5.7.7 外部集成接口

- **本地文件系统**：仅写 `docs/_tech_graph/`。
- **图谱渲染工具**：可选 `dot`/`graphviz`（若生成 .svg）；若不可用则仅写 .dot。
- **不涉及**：网络、第三方。

---



### 5.8 US-8：维护者刷新 IDE 块存量（refresh-ide-blocks）

> **定位**：IDE / 宿主格式版本变化时批量刷新消费者仓库存量 IDE 块，命中 S2 过程域一律跳过（永不覆写）（视角 R1，对应 F1 / F4）。



#### 5.8.1 业务场景

- **视角**：R1 kit 维护者
- **描述逻辑**：当 kit 适配的 IDE / 宿主格式版本变化时（例如 DSH 升级、`.dsh/skills` 白名单调整），维护者需要批量更新消费者仓库中已落盘的存量 IDE 块（如 `.claude/skills/` 等）；同时绝不能覆写 S2 过程域（这是 X7 / X11 治理的最敏感场景）。



#### 5.8.2 业务流程（Given / When / Then）

- **视角**：用户；**描述方式**：Given / When / Then 时序表述本旅程的产品表现流程与退出码语义。

```
Given 消费者仓库已落盘 IDE 块（含 .dsh/skills/ 与/或 .claude/skills/ 等）
And   kit 新版适配器模板就绪
And   S2 真值源已收敛（F1）
When  维护者执行 npx dsh-coding-kit refresh-ide-blocks --profile <new-profile>
Then  kit 遍历仓库中所有现存 IDE 块路径
And   对每个块：
       - 若命中 S2 过程域 → 跳过（永不覆写）+ 输出 S2_PROTECTED 文本
       - 若块格式版本低于当前 kit 期望 → 重写（带 profile 标记）
       - 若块已是当前版本 → 跳过（无变更）
And   退出码：0 = 全部一致或全部成功刷新；2 = 任一失败阻断
```



#### 5.8.3 UE 原型

- 核心路径 / 节点的 UE 原型；本项目为 CLI 文本输出 + 落盘路径（无 web UI），以下为示意输出。

```
$ npx dsh-coding-kit refresh-ide-blocks --profile l1+l2
[INFO]  扫描现存 IDE 块...
[INFO]  更新：.dsh/skills/standards/l1/SKILL.md         (v1 → v2)
[INFO]  更新：.dsh/skills/standards/l1/SKILL-graph.md    (v1 → v2)
[WARN]  S2_PROTECTED: skipped: docs/tasks/done/T-001.md  （含 IDE 块注释？不写入）
[SKIP]  .dsh/skills/standards/l2/SKILL.md              (已是 v2)
[OK]    更新 2 个；跳过 1 个 S2 + 1 个已最新；exit_code=0
```



#### 5.8.4 业务逻辑

- **视角**：业务系统（kit 内部，单进程同步、本地 fs）；**描述方式**：时序表述系统视角的判定、落盘与退出码决策流程。

```
npx dsh-coding-kit refresh-ide-blocks
    └─ 加载 cli-refresh-ide-blocks.ts:refresh_cmd
         ├─ 加载 S2 真值源共享常量（cli-refresh-ide-blocks.ts:299 收敛）
         ├─ 加载 assets/ide/adapters/ 4 份适配器（cli-refresh-ide-blocks.ts 引用）
         ├─ 遍历消费者仓库现存 IDE 块：
         │    ├─ 命中 S2 → 跳过（S2_PROTECTED）
         │    ├─ 版本陈旧 → 重写（带 profile）
         │    └─ 已是最新 → 跳过
         └─ 按 F2 退出码语义输出
```



#### 5.8.5 数据描述

- **输入**：可选 `--profile`；可选 `--target <dir>`；可选 `--dry-run`
- **核心数据流转**：
  - F1 S2 真值源共享常量 → 跳过判定（cli-refresh-ide-blocks.ts:299 共用）
  - 4 份适配器（assets/ide/adapters/） → 块格式与目标版本
  - 仓库现存 IDE 块 → 现状盘点
  - 重写结果 → 落盘到原路径（profile 标记）
- **副作用**：仅写 IDE 块；绝不写 S2 过程域



#### 5.8.6 验收标准 AC

- **验收口径**：以下 AC 以 Given / When / Then 结构化表述，覆盖正常路径与异常路径（含 failClosed 阻断分支），可直接转化为回归测试用例。

```
AC-1（正常路径 - 全部刷新）
  Given 仓库 .dsh/skills/standards/l1/SKILL.md 为 v1，kit 期望 v2
  When  执行 refresh-ide-blocks --profile l1
  Then  文件被重写为 v2（含 profile 标记）
  And   exit_code=0

AC-2（异常路径 - S2 命中）
  Given 仓库存在 docs/tasks/done/T-001.md 且包含类 IDE 块结构（异常输入）
  When  执行 refresh-ide-blocks
  Then  docs/tasks/done/T-001.md 不变
  And   stderr 含 S2_PROTECTED 文本
  And   exit_code ∈ {0, 2}（取决于是否有其它失败）

AC-3（异常路径 - 已是最新）
  Given IDE 块已是当前版本
  When  执行 refresh-ide-blocks
  Then  不修改任何文件（hash 不变）
  And   stdout 含 "[SKIP]"

AC-4（异常路径 - dry-run）
  When  执行 refresh-ide-blocks --dry-run
  Then  列出将变更的路径（不实际写入）
  And   exit_code=0（仅预览）
```



#### 5.8.7 外部集成接口

- **本地文件系统**：读 + 写 IDE 块路径。
- **assets/ide/adapters/**（本仓）：适配器模板来源。
- **不涉及**：网络、第三方。

---



### 5.9 §5 自检报告（中间确认触发判定）

> 按协议 §2.4 在全部 US 完成后插入自检。

**§2.1 触发标准 #1 判定**：

1. 当前决策点（US 拆分粒度 / AC 严格度）是否存在 ≥2 种方案？—— **部分存在**：
  - **US 拆分粒度**：8 条 US 是「场景维度」（注入 / 初始化 / 门禁 / gate-check / 发布 / 迁移 / compile-graph / refresh-ide-blocks），也可选择「角色维度」聚合（R1/R2/R3 各自一段）。后者会导致每条 US 跨多个核心场景，下游 system-architect 模块拆分需重组。
  - **AC 严格度**：错误率与超时阈值是行业基线（CLI 子秒级；门禁阻断退出码 2）+ 已观察到的事实（kit 1.10.0 已有的 S2 保护、退出码语义），非「研究打分最优」的倾向。
2. 是否影响下游？—— US 粒度影响下游 system-architect 模块拆分粒度（每条 US ≈ 一个核心子能力单元）。
3. 用户原始诉求 / 上游是否明确？—— 上游高层架构 §6.3 已锁定 F1–F6 的功能边界，US 是其展开，非新增；AC 严格度的具体数值（错误率 / P95 耗时）是建议基线而非 SLA 承诺。

→ **未命中 #1**（粒度选择不影响冻结边界；AC 数值以「建议基线」形式给出，不锁 SLA）。

**§2.3 反向验证 3 问**：


| 问题                     | 答案              | 证据                                                                                                                                             |
| ---------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1：3 个月后被推翻，返工成本？      | **可控**          | US 拆分粒度若需调整，仅改 §5 各 US 章节边界，< §5 总篇幅的 20%；切换成本 < 0.5 人月（下游 system-architect 模块拆分是表格层而非接口契约层）                                                   |
| Q2：用户 / 客户 / 监管能感知吗？   | **部分可感知，但路径已锁** | US 对应的 CLI 命令名 / 退出码语义 / 落盘路径与高层架构 §6.4 一致，**对外契约零变化**；可感知的只有「功能是否提供」（如 gate-check 是否阻断合并），而 F2 已明确退出码语义，F1–F5 已明确功能边界。可感知的部分是已冻结的，不在 US 自由裁量内 |
| Q3：与用户原始诉求显式提及的能力是否一致？ | **一致**          | `material_digest.md` §D1（README 双入口）+ §D9（CLI 源码族）+ §D11（迁移治理）对应 US-1–US-8；用户原始诉求四项全选 + 收敛内部一致性与 US-1/2/3/4/5/6/7/8 完全对应                       |


→ **未命中 #2**；§5 无需发起 `[中间确认]`，可直接冻结。

---



## 6. 非功能性需求

> 本节按模板要求的 6.1 ~ 6.4 全部子节展开。**性能目标值（§6.2）经中间确认（用户裁决：方案 B）定位为「推荐运行环境」建议基线，不构成对外 SLA 承诺**；G5 部署资源规格由 platform-architect 单独走确认流程，不依赖 §6.2 数值。



### 6.1 易用性需求

- **CLI 帮助与发现**：`npx dsh-coding-kit --help` 输出顶层命令清单；`npx dsh-coding-kit <subcommand> --help` 输出子命令帮助（含参数、退出码语义、典型用例）。
- **错误反馈一致性**：所有错误行以固定前缀（如 `E-<CODE>: <message>` 或 `W-<CODE>: <message>` 或 `[DEPRECATION]` / `[INFO]` / `[OK]` / `[FAIL]` / `[WARN]` / `[SKIP]`）开头，便于脚本解析与人眼扫读。
- **退出码语义一致**：0 = 全通过 / 1 = 非阻断放行 / 2 = 阻断（failClosed）；此契约必须写入 README 与 SPEC.md（V4）。
- **引导提示**：
  - 首次运行 `init_coding_kit` 输出 F4 语义收敛说明（`.cyning-harness/` 是 kit 本体，不是 legacy 标记）。
  - 首次命中 S2 保护时输出 `S2_PROTECTED: skipped: <path>`，让用户理解「永不覆写」的边界。
  - 命中 deprecate 时输出横幅 + MIGRATION 链接。
- **UI 一致性**：本项目无 web UI；CLI 输出遵循上述固定前缀即可，不引入额外 UI 规范。
- **无障碍支持**：CLI 输出优先 ASCII 兼容（避免 emoji-only 标识符），保证终端阅读无障碍；非英语用户可借助翻译工具（项目本身不强制多语言输出，文档提供 README.zh-CN.md）。



### 6.2 性能响应需求

> 上游《高层架构设计》未给出 P50/P90/P99 与 QPS 目标。**经中间确认（用户裁决：方案 B）**，本节各指标定位为「推荐运行环境」建议基线，**不构成对外 SLA 承诺**；后续若有实测数据可在不动契约的前提下更新基线。


| 指标                                 | 推荐运行环境（建议基线，不构成 SLA）                | 依据                                   |
| ---------------------------------- | ----------------------------------- | ------------------------------------ |
| **冷启动延迟**（npx 拉取 + 解析）             | P95 < 8s（首次安装后缓存）                   | npm 拉取包后本地解析；Node 启动开销               |
| `verify` **P95 端到端**（仓库 ≤ 1k 文件）   | < 3s                                | 基于 1.10.0 实际表现 + cli-checks.ts 全文件扫描 |
| `verify` **P95 端到端**（仓库 1k–10k 文件） | < 15s                               | 同上，含 sidecar 校验                      |
| `gate-check` **P95**               | < 5s（仅扫 git diff 改动集）               | 基于 git diff 范围而非全仓库                  |
| `compile-graph` **P95**            | < 30s（仓库 ≤ 10k 文件）                  | 含 ontology.yaml 与 13 份图谱生成           |
| `refresh-ide-blocks` **P95**       | < 10s（IDE 块数 ≤ 50）                  | 适配器应用 + 落盘                           |
| **并发支持**                           | CLI 单进程；CI 多 job 并行（每个 job 独立仓库工作树） | 本项目无服务端                              |
| **数据规模上限**                         | 单仓库文件数 ≤ 50k；IDE 块数 ≤ 500           | 超出后建议拆分仓库或调整 profile                 |
| **QPS**                            | 不适用（CLI 命令，非服务端 API）                | —                                    |




### 6.3 操作与环境需求

- **Node.js 版本**：≥ 20.x（`--experimental-strip-types` 需 Node 22+；`test:lib` 同要求）。
- **TypeScript 版本**：与 `tsconfig.json` 一致；构建 `tsc`，测试 `node --test --experimental-strip-types`（D4）。
- **操作系统**：macOS / Linux / WSL2（CI 在 ubuntu-latest）；Windows 原生命令行非主测试目标。
- **文件系统**：本地 fs；支持 `~/.npm` 缓存、消费者仓库 `.dsh/skills` / `.coding-kit` / `.cyning-harness` 写入。
- **网络环境**：npm 安装需联网；安装后所有命令离线可用（与 B3/B4 离线零云路线一致）。
- **浏览器兼容性**：不适用（CLI 产品）。
- **CI 环境**：GitHub Actions `ubuntu-latest`；`prepublishOnly` 四道闸门须在 CI 中复跑。



### 6.4 安全性需求

> 本项目为本地 CLI + npm 包（无云资源、无账号体系），安全需求围绕「本地落盘边界」「failClosed 阻断」「S2 永不覆写」「供应链凭据」四项展开；发布凭据分级与轮转归 security-architect 在 G5 锁定。



#### 6.4.1 安全密码设置

- 本项目无账号密码功能（CLI + 本地文件，无身份认证场景）；**不适用**。
- 迁移场景下若用户 `from_version` 推断需要读取 `package-lock.json`，不做任何网络上报，仅本地 fs。



#### 6.4.2 安全软件架构

- **模块通信安全**：本项目是单进程 CLI，无跨进程 IPC；模块间通过 TS import/export，不涉及网络通信。
- **认证与访问控制**：
  - 落盘路径严格限制在 `.dsh/skills` 白名单 + `.coding-kit` + `.cyning-harness` + `docs/_tech_graph/`（compile-graph 专用）。
  - S2 过程域路径（docs/tasks/、docs/harness/reviews/、docs/harness/invokes/by-task/）任何命令不得写入（F1）。
  - 仓库根不可写时，初始化命令退出码 2 阻断（failClosed）。
- **与外部系统接口安全**：
  - DSH 宿主运行时通过 cordis 钩子（同步，进程内）；契约版本嗅探 + 不匹配降级（U-01）。
  - npm registry / GitHub Releases 仅走 HTTPS（凭据分级与轮转归 `security-architect`）。
  - git CLI 仅在本地仓库内执行，不向远端推送任何制品。
- **通讯协议**：本项目无服务端通讯协议（HTTP/gRPC 等）；CLI 命令的 stdout/stderr 仅在本地终端输出。



#### 6.4.3 安全设计

- **认证授权**：本项目无身份认证；CLI 命令以调用者本地文件系统权限运行（failClosed 默认）。
- **失败即阻断（failClosed）**：所有 P0 失败一律退出码 2 阻断；门禁、发布、迁移 EOS 均遵循。
- **S2 保护**：永不覆写 S2 过程域（docs/tasks/、docs/harness/reviews/、docs/harness/invokes/by-task/）—— 这是核心硬约束，跨命令一致（F1 真值源唯一化的直接体现）。
- **白名单落盘**：`.dsh/skills` 内的 skills 必须命中白名单；非白名单路径一律 `W-WHITELIST: skipped`。



#### 6.4.4 安全开发

- **入口参数合法性**：所有 CLI 子命令的输入（profile / path / version / ref）做合法性校验（白名单 / 正则），非法一律退出码 1 非阻断或 2 阻断（按严重度）。
- **输入边界检查**：`from_version` 必须匹配 `^\d+\.\d+\.\d+(-.*)?$`；`--base` 必须匹配 git ref 规范；profile ∈ {l1, l1+l2, full}。
- **高危漏洞防护**：
  - 不使用 `eval` / `Function` / 动态 `require`。
  - 仅一个运行时依赖 `js-yaml`（D4），统一从 `src/yaml.ts` 单点封装。
  - 不解析用户提供的任意 YAML（仅 `ontology.yaml` / `config.yaml`，且 schema 由 kit 自维护）。
- **输入输出过滤**：
  - CLI 输出对路径做规范化（去除 `..` / 绝对路径前缀），避免误导用户。
  - deprecate 横幅中链接必须走 HTTPS，不暴露用户本地路径。
- **代码来源**：仅使用 kit 自维护代码 + js-yaml；禁止动态拉取远程代码。
- **后门防护**：无任何远控通道；CLI 不发起非预期网络请求。



#### 6.4.5 安全测试和部署

- **安全扫描**：CI 中启用 npm audit + `prepublishOnly` 闸门 2（`test:lib`）覆盖 lib-smoke。
- **安全配置基线**：发布前必须 SPEC 版本钉一致（F5）+ S2 真值源收敛（F1）+ 无 P0 失败。
- **安全功能测试**：verify / gate-check 的 failClosed 行为必须有回归测试（参见 D10 测试族）。
- **上线前高危风险**：发布前 `prepublishOnly` 四道闸门（US-5）必须全过；任一 FAIL 即禁止 `npm publish`。



#### 6.4.6 数据安全

- **数据存储与传输加密**：
  - npm 包签名（npm 自身机制）；发布凭据分级（OIDC / GH_TOKEN）由 `security-architect` 在 G5 锁定。
  - 本项目无用户密码 / 鉴权数据；`from_version` 不视为敏感数据（仅是版本号）。
  - 所有文件落盘不加密（消费者仓库本来公开）；敏感场景由消费者自行加密仓库。
- **数据驻留**：完全本地；不向任何服务端上报。
- **审计日志**：CI 闸门日志 + kit 自身 stdout（含 `[INFO]` / `[OK]` / `[FAIL]` / `[WARN]` / `[SKIP]` / `[DEPRECATION]` / `S2_PROTECTED:` 等）即审计源。
- **备份**：消费者仓库自带 git 备份；kit 不引入额外备份机制。

---



### 6.5 §6 自检报告（中间确认触发判定）

> 按协议 §2.4 在非功能需求完成后做最后一次完整复核。

**§2.1 触发标准 #1 判定**：

1. 决策点（§6.2 性能基线 / §6.4 安全策略）是否存在 ≥2 种方案？—— **部分存在**：
  - **§6.2 性能基线**：P95 数值是「建议基线」而非冻结 SLA；业务侧可能希望收紧（< 1s）或放宽（< 10s）。
  - **§6.4 安全策略**：发布凭据分级与轮转归 `security-architect` 在 G5 锁定，本 US 不越权决定。
2. 是否影响下游？—— **性能基线**会直接影响 G5 部署设计的资源规格（CPU/内存/磁盘 IO）；**安全凭据分级**影响 `security-architect` 的 G5 产物。
3. 上游是否已明确？—— **未明确**：
  - 高层架构未给具体 P50/P90/P99 数值；
  - 安全策略中「凭据分级与轮转」明确归 `security-architect`。

→ **部分命中 #1**：性能基线若锁为 SLA 属对外承诺，会进入 SLA 范畴；本节以「建议基线」形式给出是**避免**对 SLA 做单方面决定，但 §6.2 数值一旦被外部脚本或下游直接引用为承诺，会触发 §2.2 (2) 用户可见行为/对外承诺边界。

**§2.3 反向验证 3 问**：


| 问题                     | 答案                      | 证据                                                                                                                 |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Q1：3 个月后被推翻，返工成本？      | **不可控**（若被业务方要求收紧为 SLA） | 返工范围 = §6.2 整表 + 下游 G5 部署设计的资源规格；切换成本 ≈ 0.5 人月（含联调）                                                                |
| Q2：用户 / 客户 / 监管能感知吗？   | **可感知**                 | 用户可感知「门禁是否在可接受时间内完成」（SLA）；监管在企业级采购合规审查时可感知                                                                         |
| Q3：与用户原始诉求显式提及的能力是否一致？ | **一致，但未明示 SLA 数值**      | 用户原始诉求 = 审查四项全选 + 收敛内部一致性 + 区分 npm 包与 DSH 插件形态；未明示 P95 数值。`material_digest.md` §D9 / §D10 仅给出事实（命令族、测试族），未给出量化 SLA |


→ **Q2 命中 §2.2 (2)「对外承诺」**：性能基线一旦被外部引用即成为对外承诺；为避免静默决定，**必须发起** `[中间确认]`，由用户拍板 SLA 数值（或确认「保持建议基线、不作 SLA 承诺」）。

> ✅ **§6 自检命中后已发起中间确认，用户已裁决方案 B**；决议记录见 §7。

---



## 7. 中间确认决议（经中间确认）

> 本节记录 §6.2 性能基线的中间确认决议结果。**用户已裁决：方案 B（保留为建议基线，不构成 SLA）**。§6.2 与 US-1 AC-6 已按方案 B 一次性定稿，不再就同一论题发起确认。



### 7.1 决议结果（经中间确认）


| 项    | 内容                                                                                            |
| ---- | --------------------------------------------------------------------------------------------- |
| 论题   | §6.2 性能响应需求的 P95 / 数据规模上限数值，是否锁定为对外 SLA 承诺，或仅保留为建议基线（不构成 SLA）？                                |
| 用户裁决 | **方案 B：保留为建议基线（不构成 SLA）**                                                                     |
| 落地动作 | §6.2 各指标定位为「推荐运行环境」建议基线；US-1 AC-6 改为「建议基线对齐 §6.2、不作硬阻断」；G5 部署资源规格由 platform-architect 单独走确认流程 |
| 裁决时间 | 2026-09-04（G4 审核期间）                                                                           |
| 追溯标记 | 本决策写入 §6 引言 / §6.2 / US-1 AC-6，均标注「经中间确认」                                                     |




### 7.2 候选方案（历史记录）

**方案 A：锁定为对外 SLA 承诺**

- **简述**：将 §6.2 各指标写入 README / SPEC.md「性能承诺」章节，作为对外可引用的 SLA。
- **优劣**：✅ 明确性能承诺、与 G5 资源规格强绑定；❌ 当前数值是 1.10.0 观察估算、未做正式基准，锁 SLA 有信任风险，调整成本 ≥0.5 人月。
- **下游影响**：G5 产物需据此匹配资源规格；性能门禁 AC 需绑定 SLA 数值。

**方案 B：保留为建议基线（不构成 SLA）** ✅（已采纳）

- **简述**：§6.2 数值仅作「推荐运行环境 / 参考值」写入 README「运行环境」章节，不进入 SPEC.md「承诺」章节。
- **优劣**：✅ 不单方面定 SLA、与上游冻结边界一致、后续可不动契约更新基线；❌ 外部评估者可能误读为「无性能承诺」。
- **下游影响**：性能门禁 AC 改为「建议基线对齐 §6.2、不作硬阻断」；G5 部署设计单独走资源规格确认流程。



### 7.3 推荐项

本 US 倾向方案 B，与用户裁决一致。理由：① 上游未给具体性能数值，本 US 不应单方裁决；② §6.2 数值来自 1.10.0 观察、非正式基准，锁 SLA 风险大于收益；③ 用户诉求未要求锁 SLA；④ 方案 B 保留后续调整灵活性。

---

> **说明**：
>
> 1. 本决议已完成，不再就 §6.2 SLA 论题重复发起确认。
> 2. §1–§5 + §6.1 / §6.3 / §6.4 已冻结；§6.2 按方案 B 定稿。
> 3. **未通过 G4 人工审核不得进入 G5 部署设计 / 安全设计阶段**（与 §5.3 / §6.4 锁定一致）。

