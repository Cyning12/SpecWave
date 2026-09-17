> **provenance · 3.0 W7 S7.8 证据镜像**（硬约束 14 · F-W7-04）
> 来源（仅本地草稿 · 非 tracked）：.workbuddy/output/路线研究-SpecWave-2.2-3.0.md · 路线研究 · SpecWave 2.2 → 3.0
> 镜像日期：2026-09-17 · 文件名带来源+日期 · **内容不改写**（仅本头部注记）· 以 tracked 镜像为真值面。

---
# SpecWave 未来路线研究（2.2 → 3.0）

> **研究主持**：齐构成（lead · AICoding 架构专家团）
> **触发**：用户 2026-09-11「已经修复并发版，下面开始研究此库的未来更新路线」
> **范围**：全谱系（近期 2.2 → 中期 2.3 → 远期 3.0）；五维度 = 宿主扩展 / 能力深化 / 工程健康 / DX 与上手 / 可观测性与安全性（不含商业化）
> **方法**：五路研究员并行独立取证 → lead 逐条复核关键结论与冲突 → 加权评分 → 波次编排
> **基线**：`spec-wave@2.1.3`（npm latest · tag `v2.1.3` ↔ 同一 commit）

---

## 0. 执行摘要

**一句话**：SpecWave 的**工程骨架是扎实的**（P0 门禁、S2 硬闸、host-adapt、tarball 白名单、typecheck 全绿都经实测确认），但它有一个**贯穿全仓的系统性问题——"声称"与"接线"之间没有自动化桥梁**。

五路研究独立指向同一个病灶：

| 维度 | 同型问题 |
|---|---|
| 宿主扩展 | `verify` surface 在适配表里**声明了但 `planApply` 从不读取**（`cli-host.ts:900-1097`） |
| 能力深化 | `ontology-check` **声明了但 `src/` grep 命中 0**；4 项闸标 `not_wired` |
| 可观测性/安全 | 安全设计 16 条威胁：**已实现 2 / 部分 9 / 仅纸面 5** |
| DX | README 教 `verify --task` 却**从未定义 task 是什么** |
| 工程健康 | `docs/spec/README.md` 版本停在 2.1.2 而包已是 2.1.3 |

**这不是诚信问题**——恰恰相反，该库对自己的不完整相当诚实（`discipline-coverage.yaml` 如实标 `not_wired`、`ontology.yaml` 注释明示未接线、`cli-status.ts:94` 主动注明是"代理口径"）。**问题在于：诚实是靠人写注释维持的，没有机制强制。**

因此路线图的**第一主线**应该是：**把"声明 → 接线 → 可验证"变成自动化闭环**。其余四条（宿主扩展、能力深化、DX、安全加固）都挂在它下面。

---

## 1. 基线现状（已实测确认）

| 项 | 实测值 | 证据 |
|---|---|---|
| 包 / 版本 | `spec-wave@2.1.3` | `package.json:2-3`、npm `dist-tags.latest` |
| 发布溯源 | tag `v2.1.3` ↔ 同一 commit ↔ 包身份正确 | `git show v2.1.3:package.json` |
| 测试套件 | **406 用例全通过 · 48.7s**（54 个测试文件） | 研究员实测 `npm test` |
| typecheck | **0 错误 0 警告**（~1.1s） | `npm run typecheck` |
| build | 0 错误，19 个 .js + .d.ts，748K | /tmp 副本实测 |
| tarball | 175 文件，**无** test/src/delivery/.workbuddy/.env 泄漏 | `npm pack --dry-run --json` |
| CI | Node 22.x + 24.x 矩阵，`npm ci → typecheck → test → build → test:lib` | `.github/workflows/ci.yml` |
| 宿主覆盖 | **4 个 host_id**（cursor / claude / dsh / agents） | `assets/ide/host-adapt/examples/mvp-hosts.yaml` |

---

## 2. 五维研究发现摘要

### 2.1 宿主扩展

**结构性发现**：候选的 13 个宿主里 **11 个原生读 `AGENTS.md`**（该文件已被 6 万+ 开源项目采用、2025-12 捐入 Linux Foundation AAIF）。而本库 `agents` host 已在物化 `AGENTS.md` —— 这意味着**扩宿主的 always_on 多数可零新资产**，门槛在别处。

**三条能力缺口**（均经代码确认）：
1. **`verify` surface 是死配置** —— `validateVerify`（`cli-host.ts:362-379`）只做 schema 校验，`planApply`（`:900-1097`）从不消费 `row.surfaces.verify`
2. **schema 无 `hooks` surface**（`host-adapt.schema.json:35-53`）—— 而 Claude Code / Cursor 的强制门禁恰恰靠 hooks。**本库最大卖点"P0 门禁"无法装进宿主，只能停在"文档注入"层级**（而文档注入不保证执行，正是要区别于竞品的地方）
3. **`commands` 动词名硬编码**（`cli-host.ts:203-241`）—— 表只能改 `target_dir`/`profile`，改不了动词名

**架构瓶颈**：适配表无 `extends`/`defaults` 分层；无社区插件机制（新增宿主必须改 npm 包发版）。

**候选宿主优先级**：`copilot`（需求最强：47%/29-37% 占用、28M 开发者）> `codex` / `windsurf` / `gemini` > `opencode` / `roo` / `zed` / `cline` / `aider` > `kilo` / `continue` / `qwen`。

### 2.2 能力深化

**能力线整体成熟**：P0 门禁、task 生命周期、status/timeline、graph(yaml)、skills、host、sync、refresh-ide-blocks 均为"完整"；`wiki` 为骨架。

**未接线项**（`discipline-coverage.yaml` 自行登记，诚实标注）：
- `not_wired` 4 项：**G2**（reviews 留档闸）、**G4**（思考轮结构，仅 W4 warn-only）、**FULL-reviews**（裸 verify 不查 reviews）、**INVOKE-HATS**（多帽集合闸）
- `deferred` 3 项：G6（git 行为层）、G7（执行证据）、N2-C（verify --task 含 lint）

**两处结构性割裂**：
1. **双图谱系统零共享 schema** —— HGM 事件溯源图（`cli-graph-hgm.ts`）与 tech-graph 编译图（`cli-graph-yaml.ts`，`inform_graph.v3`）完全独立
2. **本体论是"声明但不被消费"** —— `assets/ontology.yaml` 建模完整，但 `src/` 全量 grep `ontology` **命中 0**

**一处门禁语义缺口**（经我复核，定性修正）：`reviews.CLOSE` 是**代理指标**（`cli-status.ts:94-107`），代码注释主动写明"非「close 审查通过」强证据"。即**存在"未审查即可关账"的路径**——对以 P0 门禁为卖点的产品，这是真实缺口，但不是隐瞒的 bug。

### 2.3 工程健康

**⚠️ 本维度推翻了 lead 此前上报的数字。**

| lead 上轮上报 | 本轮实测 | 结论 |
|---|---|---|
| `cli-refresh-ide-blocks.test.ts` ≈128s | **4.3s**（我亲自复测） | 无法复现 |
| 3 文件串行 >120s 被 SIGKILL | 11s，exit 0 | 无法复现 |
| 整包 `npm test` 跑不完 | **406 用例 48.7s 跑完** | 无法复现 |

该测试文件在 2.1.2→2.1.3 间仅改 1 行，**解释不了 25× 差异** → 我那个数字是**环境异常导致的离群值**，不是套件属性。**以本轮实测为准**，路线图不携带"测试套件慢"这条伪债项。

**真实的结构性风险**（虽当前健康，但会反弹）：
- **354 次 `runCli` spawn**（`cli-g1g7` 45 次、`cli-refresh-ide-blocks` 41 次为最）——整包 ~49s 主要由此构成。fixture 一变大会立刻反弹
- `cli-peer-optional` 做**真实 `pnpm install`**（网络绑定，8s，超时设 180s），网络抖动会误杀套件
- 三个 god-file：`cli-host.ts` **1450 行**、`cli.ts` **1105 行**、`cli-checks.ts` **844 行**
- `## Harness 元信息` 字面量重复 **18 处**（4 文件）
- `ci.yml` 的 test job **无 `timeout-minutes`**（卡死会空跑 6h）
- `tsconfig` 仅 `strict:true`，缺 `noUncheckedIndexedAccess` 等

### 2.4 DX 与上手体验

**做对的**：README 第 9 行即「Which entry to choose」，30 秒内能判断走插件面还是 CLI 面；双语结构对齐（非机翻）。

**断档（核心）**：
- **无「首次任务」引导链** —— `init` 跑完只打印 manifest 写入，**无任何"下一步"**；README 教 `verify --task <task.md>` 却**全篇未定义 task 是什么、从哪来、放哪**
- **`sync prompts --yes` 是隐式前置依赖** —— 不跑就没有 `TASK_TEMPLATE.md`，而这条链在 init 输出与 README 上手段落里**从未提及**
- **报错全中文，README 英文优先** —— 英文读者读英文文档却得到中文报错
- **全仓无术语表**（grep `术语表|Glossary` 命中 0），而 `task.md/spec.md`、`Harness`、`hat`、`kit-*` 四组首小时必懂概念**完全无解释**
- **`docs/roadmap/` 名不副实** —— 12 份全是 `_zh.md` 的内部规格/验收/审计归档，不是前瞻路线图；英文用户在此目录完全不可读
- **推广物料与包身份脱节**（§4 D0 · 本轮补充）—— `delivery/promotion/` 4 份仍写 `dsh-coding-kit` 旧名、内容停在 1.x→2.0；`package.json` keywords 仍为 `dsh-plugin`/`deepseek-harness`/`cordis`，description 只列 3 宿主而漏 `agents`。**对外发博客/一页纸的源料即此，不翻新则外部认知永远滞后一个改名周期**

### 2.5 可观测性与安全性

**16 条威胁落地度：已实现 2 / 部分实现 9 / 仅纸面 5。**

**已真落地（实测确认）**：T-09 tarball 白名单、T-14 S2 硬闸（沙箱实测拦截 exit 2）、T-11 24k 注入截断、T-02 git-root 探测。

**最重的三条缺口**：
1. **T-03 资产完整性校验缺失（仅纸面）** —— 无 `sha256` 清单、无 `assets verify`。**提示词供应链投毒完全不可检测**
2. **T-13 任意文件读穿越（已复现）** —— 我亲自复核：`verify --task /etc/hosts` 被**接受并读取**（`resolveTaskPath` `cli-shared.ts:275-277` 接受任意绝对路径；`resolveTarget` `:32-34` 无 git-root 归卡校验）
3. **T-01/T-15 发布面无 provenance/OIDC/最小权限（仅纸面）** —— 无 release workflow、`npm publish` 无 `--provenance`、`ci.yml` 无 `permissions:` 块

**可观测性**：`audit` 不支持 `--json` 且**不落任何审计留痕**（纯 stdout）；`verify --json` 缺 `traceId`/`exitCode`（§7.2 明文要求的字段）；全仓无结构化日志。**出问题时基本无法凭产物定位原因**。

---

## 3. 冲突裁决（lead 必须给出的明确结论）

### 裁决 1：`S2_TRUTH_PREFIXES` 是死代码吗？→ **否，误报**

工程健康路报"`S2_TRUTH_PREFIXES`/`isS2AbsPath`/`isS2RelPath` 零调用方 → 写保护可能失效"。

**我复核后裁定：误报。** 该常量通过 `assertNotS2Abs` **函数级间接接线**：

```
cli-shared.ts:88    export function assertNotS2Abs(...)   ← 内部消费 S2_TRUTH_PREFIXES
cli-host.ts:25      import { ..., assertNotS2Abs, ... }
cli-host.ts:867     for (const item of toWrite) assertNotS2Abs(item.destAbs)
cli-refresh-ide-blocks.ts:17/334/506                    ← 同样接线
```

且安全性路已**沙箱实测** S2 拦截生效（`docs/tasks`/`reviews`/`invokes` 全部 BLOCKED exit 2）。

**误报根因**：该路 grep 的是常量名本身，漏掉函数级间接。**该债项从 P0 降级**，但保留一条真实的小改进：`isS2RelPath` 确实无生产调用方，可清理。

### 裁决 2：测试套件是否慢？→ **否，我上轮的数字已失效**

以本轮实测为准（406 用例 48.7s）。**我的 128s 是离群值**。路线图**不**列"测试套件性能"为债项，但**保留** spawn 数量的结构性风险（fixture 变大即反弹）。

### 裁决 3：能力深化维度出现双份报告 → **取并集，交叉验证**

原 `road-capability`（框架报失败但实际产出完整报告）与重派的 `road-capability-2` 结论高度一致（ontology 未接线、4 项 not_wired、双图割裂），属**独立复核互相印证**。两份报告的差异部分取并集：`road-capability` 补充了 `reviews.CLOSE` 代理口径问题与 `cli_surface_1.2.2.md` 文档锚定滞后；`road-capability-2` 补充了 `docs/spec/README.md` 版本钉滞后。

---

## 4. 候选路线项全集与加权评分

**评分口径**：价值 = 用户价值(0-5) + 风险削减(0-5)；代价 = 实现代价(1-5，越高越贵)；性价比 = 价值 / 代价。

### 主线一：**"声明 → 接线 → 可验证"闭环**（系统性，跨维度）

| ID | 候选项 | 价值 | 代价 | 性价比 | 证据 |
|---|---|---|---|---|---|
| **A1** | **版本/身份钉自动化**：发版前自动校验 package.json ↔ ontology ↔ discipline ↔ README 双文件 ↔ docs/spec/README ↔ tag 全链偏差=0 | 9 | 1 | **9.0** | 该偏差已**同版出现 3 次**（RELEASING 2.1.1/2.1.2/2.1.3 各滞后一次 + docs-spec 2.1.3 滞后） |
| **A2** | **资产完整性校验**：构建期生成 `assets/sha256.manifest` + `assets verify` 命令 + CI 门禁 | 9 | 3 | **3.0** | T-03 仅纸面；提示词供应链投毒不可检测 |
| **A3** | **host-adapt `verify`/`hooks` surface 落地**：实现 `planApply` 消费 verify + schema 增 `hooks` | 9 | 4 | 2.25 | `cli-host.ts:900-1097` 不读 verify；schema 无 hooks。**P0 门禁装不进宿主 = 最大卖点悬空** |
| **A4** | **`ontology-check` 接线**：让 `ontology.yaml` 从声明变为可机检真值 | 6 | 3 | 2.0 | `src/` grep `ontology` = 0 |
| **A5** | **4 项 not_wired 闸接线**：G2 reviews / G4 思考轮 / FULL-reviews / INVOKE-HATS | 7 | 3 | 2.33 | `discipline-coverage.yaml` 自标 not_wired |
| **A6** | **`reviews.CLOSE` 语义补强**：从"已归档"代理口径升级为"close 审查通过"强证据 | 7 | 2 | 3.5 | `cli-status.ts:94-107` 注释自认代理口径 |

### 主线二：宿主扩展

| ID | 候选项 | 价值 | 代价 | 性价比 | 证据 |
|---|---|---|---|---|---|
| **B1** | 新增 `copilot` + `codex` + `windsurf`（AGENTS.md 原生 + skills 目录现成，近零新资产） | 8 | 2 | **4.0** | 三者需求强度 Top，11/13 候选原生读 AGENTS.md |
| **B2** | 适配表分层：增 `defaults` + host 级 `extends` | 6 | 3 | 2.0 | `mvp-hosts.yaml` 扁平全量，10+ 宿主将大量重复 |
| **B3** | `commands` 动词名入表（去硬编码） | 5 | 3 | 1.67 | `cli-host.ts:203-241` |
| **B4** | 补齐 `gemini`/`opencode`/`roo`/`zed`/`cline`/`aider` | 6 | 3 | 2.0 | 见 2.1 候选矩阵 |
| **B5** | 宿主适配包插件机制（多表合并 + 用户级目录加载） | 6 | 4 | 1.5 | 无 catalog，新增宿主必须改包发版 |

### 主线三：安全与可观测性加固

| ID | 候选项 | 价值 | 代价 | 性价比 | 证据 |
|---|---|---|---|---|---|
| **C1** | **封堵任意文件读穿越**：`--task` 拒绝绝对路径 + `--target` git-root 归属校验 | 9 | 2 | **4.5** | 已复现 `--task /etc/hosts` 被接受（`cli-shared.ts:275-277`, `:32-34`） |
| **C2** | **`--json` 补 `traceId`/`exitCode`/`source`/`injectedFiles`** | 7 | 1 | **7.0** | `verify --json` 字段不全；§7.2 明文要求 |
| **C3** | **停止输出绝对路径**（T-10） | 6 | 1 | **6.0** | `cli.ts:548` 打印 `目标: /abs/path`，违反 §7.2① |
| **C4** | CI 最小 `permissions:` + `timeout-minutes` + `npm audit` + secret scanning | 7 | 2 | 3.5 | `ci.yml` 无 permissions/timeout |
| **C5** | 发布 workflow 带 `--provenance` / OIDC | 6 | 2 | 3.0 | T-01/T-15 仅纸面 |
| **C6** | 结构化审计日志落盘（独立于 S2 过程轨） | 6 | 3 | 2.0 | `audit` 不落痕 |
| **C7** | dest 白名单显式化（`.coding-kit`/`.dsh/coding-kit`） | 5 | 1 | 5.0 | T-16 |

### 主线四：DX 与上手

| ID | 候选项 | 价值 | 代价 | 性价比 | 证据 |
|---|---|---|---|---|---|
| **D0** | **推广物料翻新**：`delivery/promotion/` 4 份改名 + 更新 npm keywords/description（**本轮新增**） | 8 | 1 | **8.0** | 4 份物料全部仍写 `dsh-coding-kit`（旧名）+ 1.x→2.0 内容；`package.json` keywords 仍为 `dsh-plugin`/`deepseek-harness`/`cordis`；description 只提 3 宿主，漏 `agents` |
| **D1** | **`init` 后打印 3 步 quickstart** + 提示 `sync prompts --yes` + 生成示例 task | 9 | 1 | **9.0** | 实测 init 无任何下一步引导 |
| **D2** | **新增 `GLOSSARY.md`（双语）** 并在 README 首屏链接 | 8 | 1 | **8.0** | grep `术语表|Glossary` = 0；4 组必懂术语无解释 |
| **D3** | **README 定义核心对象** task.md / spec.md（是什么/放哪/最小示例） | 8 | 1 | **8.0** | README 直接教 `verify --task` 却未定义 task |
| **D4** | 报错国际化（或 README 明示报错语言） | 6 | 2 | 3.0 | 英文 README vs 中文报错 |
| **D5** | `docs/roadmap/` 改名 `docs/spec-archive/` + 新建真正前瞻 `ROADMAP.md`（双语） | 7 | 2 | 3.5 | 目录名误导 + 英文不可达 |
| **D6** | 新增用户向 `docs/guides/QUICKSTART`（首个 task 完整 walkthrough，双语） | 7 | 2 | 3.5 | `docs/guides/` 仅内部 dogfood 录屏清单 |

### 主线五：工程健康

| ID | 候选项 | 价值 | 代价 | 性价比 | 证据 |
|---|---|---|---|---|---|
| **E1** | 抽 `HARNESS_META_HEADING` 常量，替换 18 处字面量 | 5 | 1 | **5.0** | 4 文件 18 处重复 |
| **E2** | `cli-peer-optional` 改离线 fixture（去真实 `pnpm install`） | 6 | 2 | 3.0 | 网络绑定，8s，抖动会误杀套件 |
| **E3** | 测试 spawn 削减（354 → <50）：核心逻辑单测 + 少量烟测 | 6 | 4 | 1.5 | `cli-g1g7` 45×、`refresh` 41× |
| **E4** | 拆分三个 god-file（cli-host 1450 / cli 1105 / cli-checks 844 行） | 6 | 5 | 1.2 | 单文件认知负荷与回归面 |
| **E5** | `tsconfig` 开启 `noUncheckedIndexedAccess` 等 | 5 | 2 | 2.5 | 仅 `strict:true` |

### 主线六：架构级（远期）

| ID | 候选项 | 价值 | 代价 | 性价比 |
|---|---|---|---|---|
| **F1** | 双图谱统一（HGM ↔ tech-graph 共享 schema） | 6 | 5 | 1.2 |
| **F2** | `discipline`/`lifecycle show` 改读消费者资产（O3 真口径对齐） | 5 | 3 | 1.67 |
| **F3** | wiki 能力补全（双向/增量/冲突） | 4 | 3 | 1.33 |
| **F4** | S2 公理接真实触发源 | 4 | 3 | 1.33 |

---

## 5. 波次编排

### 2.2.0 · 「闭环起步」（性价比 ≥ 4.0 的 10 项，全部低代价）

| 波 | 项 | 说明 |
|---|---|---|
| W0 | **D0** 推广物料翻新（本轮新增） | 4 份物料旧名 + npm 元信息滞后，**零代码、其他推广动作的前提** |
| W1 | **A1** 版本/身份钉自动化 | 消除已发生 3 次的文档滞后，建 CI 校验 |
| W2 | **C1 + C3** 封堵任意文件读 + 停止绝对路径输出 | 安全，已复现缺口 |
| W3 | **C2** `--json` 补 traceId/exitCode | 可观测性最小闭环 |
| W4 | **D1 + D3** init quickstart + README 定义核心对象 | 消除上手断档 |
| W5 | **D2** `GLOSSARY.md` 双语 | 降低术语门槛 |
| W6 | **B1** 新增 copilot / codex / windsurf | 近零新资产，验证"加 host 不改代码"链路 |
| W7 | **E1 + C7** `HARNESS_META_HEADING` 常量 + dest 白名单 | 小清理 |

**2.2 不做什么**：不动 schema、不动架构、不加钩子 —— 保持低风险。

### 2.3.0 · 「接线补全」

- **A2** 资产完整性校验（sha256 manifest + `assets verify` + CI）
- **A5** 4 项 not_wired 闸接线（G2 / G4 / FULL-reviews / INVOKE-HATS）
- **A6** `reviews.CLOSE` 语义补强
- **C4 + C5** CI 最小权限 / timeout / 依赖与密钥扫描 / 发布 provenance
- **B4** 补齐 gemini / opencode / roo / zed / cline / aider
- **D5 + D6** `docs/spec-archive/` 改名 + `ROADMAP.md` + `QUICKSTART`
- **E2 + E5** 离线 fixture + tsconfig 加严

### 3.0.0 · 「架构跃迁」

- **A3** host-adapt `hooks` surface + `verify` 物化 —— **把 P0 门禁真正装进宿主**（战略级）
- **B2 + B3** 适配表分层 + commands 动词名入表
- **A4** `ontology-check` 接线
- **B5** 宿主适配包插件机制（社区众包冲 30+ 宿主）
- **F1** 双图谱统一
- **E3 + E4** 测试分层重构 + god-file 拆分
- **C6 + F2 + F3 + F4** 审计日志 / 口径对齐 / wiki / 公理

---

## 6. 非范围与冻结项（沿用既有决议）

| 项 | 决议 | 来源 |
|---|---|---|
| 自研 IDE | **冻结** | 历史决议 |
| 第二分发通道 | **冻结** | 历史决议 |
| 远程 Policy 引擎 | **冻结**（1.x 已定：无云策略引擎，分层强制为文档级） | `README.md:170` |
| 商业模式 / 商业化路线 | **本次非范围**（用户未勾选该维度） | 本次 scoping |
| 1.x 老产品线 | **CLOSED** | `RELEASING.md` |
| `@cyning/harness` / `dsh-coding-kit` | **已 deprecate**，仅保留迁移指引 | npm registry |

---

## 7. 风险与依赖

| 风险 | 说明 | 缓解 |
|---|---|---|
| **A3 依赖 schema 变更** | 加 `hooks` surface 是 breaking change（适配表格式变） | 走新 minor + 向后兼容读旧格式 |
| **C5 OIDC/provenance 需人授权** | 涉及 npm/GitHub 账号配置 | 明确标注"仅人"，Agent 不代劳 |
| **B5 社区机制需长期投入** | 插件机制不是一次发版能完成 | 3.0 立项，不设硬期限 |
| **A1 若只做校验不做修复** | 校验会持续报红 | 配套"一键修复"或降级为 warn |
| **测试 spawn 反弹** | 当前 48.7s 健康，但 354 次 spawn 是结构性隐患 | E3 中期处理，**不列为 2.2 债项** |

---

## 8. 建议的下一步

1. **确认波次编排**：2.2 的 10 项（含本轮新增的 D0 推广物料翻新）是否符合你的预期？有无需要提前或延后的？
2. **2.2 立项**：按该库既有惯例，应产出 `docs/roadmap/PLAN_2_2_*_v1_zh.md` + `docs/spec/2_2-*/`，并走 `HG-NEXT-PLAN` 人闸
3. **A3 的战略定性**：把「P0 门禁装进宿主 hooks」作为 3.0 的核心命题是否成立？这是本路线里唯一能拉开与 Ruler/spec-kit 差距的方向（它们只做注入、不做门禁）
4. **D5 的目录改名**：`docs/roadmap/` → `docs/spec-archive/` 涉及大量交叉引用，需评估是否值得

---

## 附：研究方法与可信度说明

- **五路独立取证**：宿主扩展 / 能力深化 / 工程健康 / DX / 可观测性与安全性，各自只读研究、互不通信，全部经 lead 中转
- **lead 独立复核的关键结论**：S2 接线（裁决误报）、任意文件读穿越（复现确认）、测试耗时（复测推翻自身旧数据）、版本钉偏差（确认）、ontology 未被消费（确认）
- **可信度标注**：本报告所有"已实测/已复现"项均有命令输出支撑；"推测/外部证据"项（如宿主市场份额）已由研究员标注来源（WebSearch，2026-09-11）
- **一处研究员自陈的不确定**：宿主市场份额数据来自第三方横评，量级可信、具体百分比有波动

---

_本报告由齐构成（lead）于 2026-09-11 汇总五路研究成果产出。五路研究员：road-host（宿主扩展）、road-capability + road-capability-2（能力深化，双路交叉验证）、road-enghealth（工程健康）、road-dx（DX 与上手）、road-obs-sec（可观测性与安全性）。_
