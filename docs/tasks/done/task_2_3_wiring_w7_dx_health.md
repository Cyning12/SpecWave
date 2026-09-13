# Task：2.3 W7 · DX 与工程健康（根 README 双语 13 宿主表 · GLOSSARY 两处措辞 · E2 离线 fixture · E5 tsconfig 加严 · pin-17 豁免关账）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-14）  
> **wave**：W7（2.3.0 接线补全 · 收官波 · DX & engineering health）  
> **关联 SPEC**：[`docs/spec/2_3-wiring-completion/07_w7_dx_health_v1.md`](../../spec/2_3-wiring-completion/07_w7_dx_health_v1.md)（**唯一蓝本** · signed · HG-SPEC-SIGNOFF=approved 2026-09-12 维护者会话授权 00 代签）· [`00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)  
> **依赖**：W2（pin-17 校验机制 + 失陈债机检）· W6（13 宿主数据面落地 · 豁免 until_wave=W7 待本波关账）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-3-wiring-w7-dx-health` |
| **test_strategy** | `required` |
| **test_strategy_note** | 失陈债中间态留痕（README 双语落地后、摘豁免前 pins check 必 exit 2 报 9 条失陈——机检自执行的实证）· pins-consistency 豁免集断言 9→0 先红后绿 · 双语互检（条目/行数 diff）· E2 默认套件零网络断言 · E5 加严先红（62 错）逐修转绿；bin 面真实命令验收为硬条款（W3 教训沿袭） |
| **code_quality_bar** | `strict` |
| **freeze_id** | 双冻结：① RELEASING.md 任何改动（双重敏感 · 政策 §5 · 本波不触）；② `package.json` version / CHANGELOG 发布头（**bump 归 00 后续独立 release 棒** · 本波只写 CHANGELOG Unreleased 一条）——触任一即 **STOP 上报** |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00`（00 invoke 由编排员落盘） |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 文档面 + pins 数据 + 测试 + tsconfig + src 类型收窄；不改架构图谱 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | GLOSSARY 属首小时术语文档（npm files 内），非 coding_wiki 规范增量；无可晋升条目 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.1.2/2.2/2.3-W1–W6 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表 |
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表（SPEC 07 signed） |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-12 维护者会话授权） |
| **HG-AUDIT-R1** | **approved** | ~~30~~ | **2026-09-12 维护者会话授权 00 代签** · 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w7_dx_health_audit_R1_20260914.md` · 非阻塞观察 ×3） |

---

## 背景与目标

SPEC 07（signed）：四条收尾项——① 根 README 双语宿主表 4 行 → 13 行（[A]#4 低估 · npm 页面显示 4 宿主而适配表已 13）；② GLOSSARY 两处措辞与实现不一致（[A]#10「four gates」未分层 · [A]#11「每帽一 prompt 文件」对 50 不成立）；③ E2 `cli-peer-optional` 真实 `pnpm install` 网络绑定；④ E5 tsconfig 缺 `noUncheckedIndexedAccess`。全部以「文档与实现一致」为验收基准。

**R0 前提复核（本棒已实测 · SPEC 07 前提全部成立）**：

- **README 现状**：`README.md:5` tagline「(Cursor · Claude Code · optional DSH)」、`:24-29` 宿主表仅 4 行；`README.zh-CN.md:5/:24-29` 镜像（本棒核读属实）。九新宿主词锚双语 0 命中（W6 实测 2026-09-13 · 大小写敏感：roo='Roo Code' 防误伤 projectRoot · zed 大写防误伤 materialized）。
- **pin-17 现状**（`assets/release-pins.yaml` :156-206 核读）：host_hits 13 键 + known_gaps **9 条全 until_wave: W7**；失陈债机检（`src/cli-pins.ts` :395-403）：豁免宿主双语双双命中即 exit 2 报债——**README 落地后 9 条豁免将全部失陈，本波必须同步全摘，否则 pins check 变红**（这正是机制设计的关账强制）。当前 pins check 输出：`13 宿主校验 · 4 双语命中 · 过渡豁免 ×9@W7`。
- **GLOSSARY 现状**（核读属实）：EN :29「Each hat is defined by a prompt file, materialized by sync prompts…」· EN :45「The four gates: HG-TASK-DRAFT · HG-SPEC-SIGNOFF · HG-AUDIT-R1 · HG-RELEASE」· ZH :66「每顶帽由一份 prompt 文件定义，经 sync prompts 物化」· ZH :82「共 4 个」未分层。实现侧：`SYNC_PROMPT_FILES`（`src/cli-sync-prompts.ts` :7-19）= 7 具名帽（00/10-task/10-spec/20-task/20-spec/30/40）+ 3 FRAGMENT + 1 TEMPLATE = 11 文件，**无 `50-independent-reinspect`**；`TASK_TEMPLATE.md`（`assets/harness/templates/` :41-44）闸表恰 2 行（HG-TASK-DRAFT / HG-AUDIT-R1）。
- **E2 现状**（`test/cli-peer-optional.test.ts` 核读）：P1-2 真实 `pnpm add -D file:<KIT>`——spec-wave 有运行时依赖 `js-yaml` 且 file: 依赖触发 `prepare`（`npm run build` 需 typescript 等 devDeps）→ registry 网络绑定（SPEC §1.4 实测 8s · 超时 180s）。P1-1 静态断言（peerDependenciesMeta optional×2）不依赖网络，是 1.2.2 回归的核心护栏。
- **E5 预试开实测**（本棒执行 `tsc --noEmit --noUncheckedIndexedAccess`）：**62 错 / 11 文件**（cli-graph-hgm 13 · cli-shared 11 · cli-pins 9 · cli-graph-yaml 7 · cli-checks 6 · cli-assets 5 · cli-wiki 4 · cli-task-extra 2 · cli-status 2 · cli-skills 2 · cli-sync 1）——主流模式为索引访问后 `| undefined` 收窄，**在熔断阈值内**（见 D-23-W7-E5）。
- **基线**（W6 关账 72c785e）：`npm test` 534/534 · pins 17/17 · assets verify 110/110 · 工作树干净（30 开工复跑确认）。

## 已定案（冻结 · 不得翻案）

- **D-23-W7-TAGLINE**：双语 tagline 由「Cursor · Claude Code · optional DSH」扩为 13 宿主概括表述；`spec-wave@2.2.1` 钉点串不动（version-pins-f5 机检面）；「DSH 插件面可选」语义保留（不写成默认必装）。
- **D-23-W7-TABLE**：宿主表 4 行 → 13 行；**既有四行行首锚形态不变**（`| **Cursor** |` 等 · pin-17 行锚 `\|\s*\*\*Cursor\*\*` 等零改动）；新增九行须各含 pin-17 词锚词（Copilot / Codex / Windsurf / Gemini / opencode / Roo Code / Zed / Cline / aider · 逐字 · 大小写敏感）。**aider 行措辞 = 「注入层支持」口径**（不暗示 aider 原生自动加载 AGENTS.md · 写明须 `--read` / `.aider.conf.yml` 配置 · 事实卡纪律 + W6 审查文非阻塞观察#3）；roo 行注明 AGENTS.md 加载证据为官方仓 merged PR（不夸大）；落点列与 `assets/ide/host-adapt/README.md` 矩阵对齐。
- **D-23-W7-PIN17（关账顺序硬约束）**：先落地 README 双语 → 此刻 pins check **必 exit 2**（9 条豁免失陈债 · 中间态留痕 = 机检自执行的实证）→ 摘除全部 9 条 known_gaps + 修订 D-23-W2-W7-EXEMPTION 注释（口径：W7① 已关账 · 豁免清零 · 机制保留供未来新宿主过渡使用）→ pins check 转绿 `13 宿主校验 · 13 双语命中`。pins-consistency C 组联改：豁免集断言 9→0 · 输出钉字更新 · 先红后绿留痕。**pins 代码零改动**。
- **D-23-W7-E2**：P1-2 拆分——① **默认离线 fixture**：tmp 目录伪造已安装布局（从本仓拷贝 `bin/` `lib/` `package.json` `cordis.patch.yml` → `node_modules/spec-wave/`，拷贝本仓 `node_modules/js-yaml` → fixture `node_modules/js-yaml`；`lib/` 缺失时先用仓内 typescript 离线 `npm run build`——devDeps 已装 · 零网络）；直跑三 bin `--help` 断言 exit 0 + 输出含 `spec-wave`；全程无 spawn pnpm/npm 联网调用。② 原真实 `pnpm add -D file:` 全链路保留为**环境变量门控可选手动测试**（`SPEC_WAVE_E2E_NETWORK=1` 才执行 · 默认 skip · 非 CI 默认 · F-W7-03）；行为差异与理由写入测试注释。P1-1 静态断言不动（1.2.2 回归护栏留默认套件）。
- **D-23-W7-E5**：只开 `noUncheckedIndexedAccess: true`（SPEC §6 定案 · 单项加严）；62 错逐一修（预期模式：数组/Record 索引后 `| undefined` 显式收窄 · 不改运行时语义）。**熔断阈值**：错误总数 >100 或涉及文件 >15 或修复须改测试语义/运行时行为 → 立即停：回退开关 · 评估结论落本 task 报告与交付报告 · 不硬修扩散面（F-W7-02）。其余加严项（noImplicitOverride / exactOptionalPropertyTypes 等）**不纳入本波**，留一行评估结论。

## 范围

- [x] ① **根 README 双语**：`README.md` / `README.zh-CN.md` tagline + 宿主表 13 行（D-23-W7-TAGLINE/TABLE · 行锚与词锚精确命中 pin-17）。
- [x] ② **pin-17 豁免关账**（`assets/release-pins.yaml` 纯数据）：摘 9 条 known_gaps + 注释修订（D-23-W7-PIN17 顺序硬约束）；`test/pins-consistency.test.ts` C 组联改（豁免集 9→0 · 钉字 `13 双语命中` 零豁免段）。
- [x] ③ **GLOSSARY.md 两处**：「four gates」按 task 级 / SPEC 级 / 发版级分层（双语 · 说明 task 模板只见 2 闸是设计而非缺漏）；「每帽一 prompt 文件」修正为「sync prompts 物化 7 具名帽 prompt · `50-independent-reinspect` 暂无物化 prompt 文件」等价精确表述（双语）；8 帽模型表述保持不变。
- [x] ④ **E2 离线 fixture**：`test/cli-peer-optional.test.ts` 按 D-23-W7-E2 改造。
- [x] ⑤ **E5 tsconfig 加严**：`tsconfig.json` +`noUncheckedIndexedAccess: true`；src/ 存量类型错逐一修（62 处基线 · 熔断条款见 D-23-W7-E5）。
- [x] ⑥ **assets manifest 同步**（W5 纪律）：release-pins.yaml 改动后 `node bin/specgate.js assets manifest rebuild --yes` + `assets verify` PASS。
- [x] ⑦ **CHANGELOG**：Unreleased 一条（README 13 宿主表 + GLOSSARY 修正 + E2/E5 · 未发布口径 · 不动发布头）。
- [x] ⑧ **全链路验收**：pins check 17/17（pin-17=`13 宿主校验 · 13 双语命中` 零豁免）· 四门绿 · 断网口径 E2 默认套件通过。

## 非范围

| 项 | 理由 |
|----|------|
| **`package.json` version bump · CHANGELOG 发布头（`## [2.3.0]` 头）** | **freeze_id 冻结②** · 归 00 后续独立 release 棒（PROMPT 硬约束） |
| **RELEASING.md 任何改动** | **freeze_id 冻结①** · 双重敏感（pin-07 + 九步顺序测 · 政策 §5） |
| host-adapt schema / pins 求值器 / 任何门禁语义变更 | 本波纯文档+数据+类型收窄；pins 代码零改动（D-23-W7-PIN17） |
| `assets/ide/host-adapt/README.md` 改动 | W6 已落地 13 行矩阵（对齐基准方 · 本波是根 README 向它对齐，非反向） |
| delivery/promotion 物料 · 事实卡 · 宣称性新口径（「13 宿主」进宣传文案） | 事实卡 §10/§11 · 解除禁称归维护者（本波仅动 W2/W6 校验对象面=根 README 宿主表/tagline · SPEC 07 §3① 授权） |
| 50 帽物化 prompt 文件新建 | SPEC §6 弃选（本波只修措辞使其与实现一致） |
| GLOSSARY 大幅重写 / noImplicitOverride 等其余加严项 | SPEC §4/§6（留评估结论一行） |
| npm publish / tag / push / deprecate | 仅人 · 发版属独立波次 |
| 给任何既有门禁加 `--force` / `--allow-*` | P0-GATE 硬纪律 |
| S2 目录任何 CLI 写 | 机械拒写无豁免 |

---

## 失败路径（failure_paths · 对齐 SPEC 07 §8 + 本 task 增补）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W7-01 | W6 未完成时 W7 先行 | README 按 7 宿主落地并注明「更多宿主规划中」 | 是 | 文档注明（本波 W6 已 CLOSE · 不触发） |
| F-W7-02 | E5 修复超熔断阈值（>100 错 / >15 文件 / 须改测试语义） | **停上报**：回退开关 · 评估结论落盘 · 不硬修扩散面 | — | task 报告 |
| F-W7-03 | E2 fixture 与真实 pnpm 行为漂移 | 差异写测试注释；真实 pnpm 链路保留为 `SPEC_WAVE_E2E_NETWORK=1` 门控可选手动测试 | 是 | 测试注释 |
| F-W7-04 | README 改动触发 pin-05/06 失配 | 钉点串 `spec-wave@2.2.1` 零改动（D-23-W7-TAGLINE）→ 机制上不触发；若误伤 → 还原钉字 | 是 | pins 红 |
| F-W7-05 | GLOSSARY 修正与 task 模板未来变更脱节 | 措辞引用「现行模板」口径 + 本波 W2 不覆盖该面（已知边界留痕） | 是 | 措辞注明 |
| F-W7-06 | 双语不同步 | 双语互检（条目数/锚词逐侧 grep）入验收②④ | 是 | 验收红 |
| F-W7-07 | CI 干净检出无 `lib/` 致离线 fixture 缺载荷 | fixture 缺失时先跑仓内 `npm run build`（typescript 为 devDep · CI 装 devDeps · 零新增网络） | 是 | 测试自述 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（verify 闸扫描阻断） | 是 | 须先 20 R1 + 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑤ 对齐 SPEC 07 §7；⑥–⑩ 为本棒纪律性增补（bin 面 / manifest / 版本面 / gate-check+close / 提交边界）。

- [x] ① **pin-17 关账前后对照**：关账前 `pins check` pin-17 = `13 宿主校验 · 4 双语命中 · 过渡豁免 ×9@W7`；README 双语落地后未摘豁免的中间态 `pins check` **exit 2** 报 9 条失陈债（留痕）；摘除后 pin-17 = `13 宿主校验 · 13 双语命中`（零豁免段）· `pins check` PASS 17/17。
- [x] ② **README**：双语宿主表各 13 行且与 `mvp-hosts.yaml` host_id 一一对应（pin-17 机检即证）；tagline 双语一致且 `spec-wave@2.2.1` 钉点不变；aider 行注入层口径（grep `--read` 自证 · 不暗示原生自动加载）；与 host-adapt README 矩阵落点抽检一致。
- [x] ③ **GLOSSARY**：两处修正后措辞与实现一致——grep `SYNC_PROMPT_FILES` 比对（7 具名帽 · 无 50）· `TASK_TEMPLATE.md` 闸行数=2 比对；双语条目对齐（互检 diff）。
- [x] ④ **E2**：默认套件全程无 `pnpm install`/`pnpm add` 网络调用（fixture 纯本地拷贝/离线构建 · 断网口径可通过：代码面无 registry 访问点）；`SPEC_WAVE_E2E_NETWORK` 门控测试默认 skip；`npm test` 全绿。
- [x] ⑤ **E5**：`tsconfig.json` 含 `noUncheckedIndexedAccess: true`；`npm run typecheck` 0 错；`npm test` 全绿；若触发熔断则开关回退 + 评估结论落盘（本波按实测 62 错预期不触发）。
- [x] ⑥ **四门**：`npm run typecheck` 0 错 · `npm test` 全绿（534 基线只增不红）· `npm run build` · `npm run test:lib` 6/6。
- [x] ⑦ **assets**：`assets manifest rebuild --yes` 后 `assets verify` PASS 110/110（release-pins.yaml hash 随内容更新 · 文件数不变）。
- [x] ⑧ **版本面零漂移**（freeze_id 双冻结自证）：`package.json` version=2.2.1 未动 · CHANGELOG 无 `## [2.3.0]` 发布头 · RELEASING.md 未动（git diff 名清单自证）· version-pins-f5 绿。
- [x] ⑨ **bin 面真实命令验收**（W3 教训）：①⑦ 全部经 `node bin/specgate.js` 实测贴输出；负向（中间态失陈债 exit 2）留痕。
- [x] ⑩ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_3_wiring_w7_dx_health.md` 通过 + `task close --yes` 闭环；提交禁 `git add -A` · 逐路径 add · `feat(2.3-W7): …`。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_3-wiring-completion/07_w7_dx_health_v1.md`](../../spec/2_3-wiring-completion/07_w7_dx_health_v1.md)（**唯一蓝本** · §3 范围 / §5 设计 / §7 验收 / §8 failure_paths）
3. [`docs/spec/2_3-wiring-completion/00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)（S2 / P0-GATE / RELEASING 双重敏感 / 对外文案纪律 §4）
4. 本 task「已定案」五定案（TAGLINE / TABLE / PIN17 / E2 / E5）——**PIN17 关账顺序为硬约束**
5. 现状文件：`README.md` :5/:24-29 · `README.zh-CN.md` :5/:24-29 · `GLOSSARY.md` :29/:45/:66/:82 · `assets/release-pins.yaml` pin-17（:156-206）· `src/cli-pins.ts` readme-host-row 求值器（:333-423 · 只读不改）· `src/cli-sync-prompts.ts` :7-19 · `assets/harness/templates/TASK_TEMPLATE.md` :41-44 · `test/cli-peer-optional.test.ts` · `tsconfig.json`
6. 对齐基准：`assets/ide/host-adapt/README.md` 宿主×表面矩阵（13 行 · 只读不改）
7. 测试蓝本：`test/pins-consistency.test.ts` C 组（:960-1040 TEST-LOCK 联改点）
8. 参考前波：`docs/tasks/done/task_2_3_wiring_w6_host_completion.md`（同制链路 · pin-17 数据面先例）
9. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w7_dx_health.md`（GATE_VERIFY · HG-AUDIT-R1=pending 时**拒开工**）

---

## 测试策略（Harness）

**test_strategy**: `required`

- **失陈债中间态留痕**（本波特色负向）：README 双语先落地 → `pins check` 必 exit 2 报 9 条豁免失陈 → 摘豁免 → 转绿。三段输出全部留痕（关账前 / 中间态 / 关账后）。
- **pins-consistency C 组联改先红后绿**：豁免集断言改 9→0 后首跑红（yaml 尚有 9 条）→ 摘豁免转绿（或按实施顺序反向留痕 · 二者居一必留）。
- **E2 改造**：行为保持断言（三 bin `--help` exit 0 + 含 `spec-wave`）+ 默认套件零 pnpm/npm spawn 断言（代码面审查点 · 注释注明）+ 门控测试 skip 留痕。
- **E5 加严先红**：开 `noUncheckedIndexedAccess` 后 typecheck 62 错基线留痕 → 逐修转绿；修复不改运行时语义（索引收窄 · 必要时补显式兜底分支）。
- 既有 534 基线只增不红；pins 17/17；assets verify 110/110。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| `README.md` / `README.zh-CN.md` | ✅ | 双语 tagline 13 宿主概括 + 宿主表 13 行 · aider 注入层口径 · roo merged-PR 注明 · 钉点串不动 |
| `assets/release-pins.yaml` pin-17 | ✅ | known_gaps 9→0（纯数据）· 注释修订（机制保留口径）· pins 代码零改动 |
| `test/pins-consistency.test.ts` | ✅ | C 组豁免集断言 9→0（deepEqual [] · 钉字更新） |
| `GLOSSARY.md` | ✅ | four gates 三层（task/SPEC/发版）+ 7 具名帽物化口径（50 暂无物化 prompt）· 双语同步 · Changelog +1 行 |
| `test/cli-peer-optional.test.ts` | ✅ | P1-2 拆离线 fixture（依赖闭包 BFS 直拷 · 三 bin 实读自 package.json#bin）+ `SPEC_WAVE_E2E_NETWORK=1` 门控真装（默认 skip · 双侧实测绿） |
| `tsconfig.json` + src/ 类型收窄 | ✅ | +noUncheckedIndexedAccess · 62 错/11 文件逐一机械收窄 · 运行时语义零变更 · 熔断未触发 |
| `CHANGELOG.md` | ✅ | Unreleased Added 一条（发布头零改动 · grep 自证） |
| `assets/sha256.manifest` | ✅ | rebuild --yes（+0/-0/~1 仅 pins hash）· verify 110/110 |

---

## 提交信息约定

- 提交信息：`feat(2.3-W7): …`（独立提交 · 前缀不变）
- **禁 `git add -A`**：逐文件显式 add
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_3_wiring_w7_dx_health.md`

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 续棒重验①②后续完③④ · 2026-09-14 · 全部命令真实执行 · 完整输出见 invoke `invoke_20260914_30_40_2-3-wiring-w7-dx-health.md`）

**验证命令与退出码**（cwd=仓根 · bin 面全经 `node bin/specgate.js` · pin-17 历史态经 git worktree 复现）：

| 命令 | exit | 结果 |
|------|------|------|
| `npx spec-wave verify --target . --task …w7_dx_health.md` | 0 | VERIFY: PASS（GATE_VERIFY 开工闸 · 双 approved 与声称一致） |
| pin-17 ①关账前（worktree=HEAD 原样）`pins check --target` | 0 | `13 宿主校验 · 4 双语命中 · 过渡豁免 ×9@W7` · PASS 17/17 |
| pin-17 ②中间态（worktree=HEAD+新双语 README · 豁免未摘）`pins check --target` | **2** | 9 项偏差「豁免失陈债 F-W2-05 · 双语已双双命中 · 须移除豁免条目」逐宿主列出 · PINS: BLOCKED（失陈债机检自执行实证） |
| pin-17 ③关账后（摘 9 豁免 · 本仓）`node bin/specgate.js pins check` | 0 | `13 宿主校验 · 13 双语命中` 零豁免 · PASS 17/17 |
| E5 先红：`tsconfig +noUncheckedIndexedAccess` 首跑 `tsc --noEmit` | 2 | 62 错 / 11 文件（与 R0 预试开量化一致） |
| E5 转绿：`npm run typecheck` | 0 | 0 错（62 逐一机械收窄 · 运行时语义零变更） |
| E2 默认：`node --test test/cli-peer-optional.test.ts` | 0 | P1-1 ✔ · P1-2 离线 fixture ✔ 161ms（原 8s 网络绑定解除）· P1-2-network 默认 skip 留痕 |
| E2 门控：`SPEC_WAVE_E2E_NETWORK=1 node --test …` | 0 | 3/3 pass（真实 pnpm 链路 2781ms · 门控非死代码实证） |
| `npm test` 全套件 | 0 | **535 tests · 534 pass · 0 fail · 1 skipped**（skipped=门控真装 · 534 基线只增不红 · 55.1s） |
| `npm run build` / `npm run test:lib` | 0 | tsc 通过 · 6/6（S0 漂移哨兵含 · bin 面实测基于新 lib） |
| `assets manifest rebuild --yes` + `assets verify` | 0 | 110 条（+0/-0/~1 仅 release-pins.yaml hash）· ASSETS: PASS 110/110 |
| `task lint-wiki-delta --target .` | 0 | LINT-WIKI-DELTA: PASS |
| 版本面零漂移 | — | git diff 名清单无 package.json/RELEASING.md · CHANGELOG diff 无发布头行（grep 0 行）· pin-05/06/07/13 绿 |

**验收 10 条全部 pass**：① pin-17 三段对照（关账前 4 命中×9 豁免 → 中间态 exit 2 失陈债 ×9 → 关账后 13 命中零豁免 · worktree 复现留痕）② README 双语 13 行过 pin-17 机检 · aider `--read` 口径 grep 自证 · 与 host-adapt 矩阵抽检一致（gemini=GEMINI.md · roo/aider 无 skills 目录）③ GLOSSARY 与实现一致（SYNC_PROMPT_FILES=7 具名帽+3 FRAGMENT+1 TEMPLATE 无 50 · TASK_TEMPLATE 闸行=2 核读比对）④ E2 默认套件零网络（fixture 纯拷贝/离线构建 · 代码面无 registry 访问点）+ 门控 skip/实证双侧 ⑤ E5 0 错 · 熔断未触发（62≤100 · 11≤15 · 零测试语义改动）⑥ 四门绿 ⑦ assets 110/110 ⑧ 版本面零漂移（双冻结自证）⑨ bin 面真实命令验收（本表全 `node bin/specgate.js`）⑩ gate-check + close 收尾（见提交前记录）。

**熔断核查（D-23-W7-E5 / F-W7-02）**：未触发 —— 62 错 ≤ 100 · 11 文件 ≤ 15 · 全部 `| undefined` 机械收窄（无测试语义/运行时行为改动 · 唯一类型面收紧=cli-graph-yaml 键集合钉死 phase/doc/infra）。其余加严项（noImplicitOverride / exactOptionalPropertyTypes）按 SPEC §6 弃选不纳入本波（评估结论留此）。

---

### KPI（00）

Task_KPI%: 100（验收 10/10 自证通过 · 四门绿 534 pass+1 门控 skip · pins 17/17（pin-17 三段留痕含中间态 exit 2 实证）· assets 110/110 · E2 去网络绑定双侧实测 · E5 62 错修平熔断未触发 · 版本面双冻结零漂移）

---

### 经验总结

1. **失陈债机检的关账强制真实生效**：pin-17「豁免宿主双语双双命中即 exit 2」在本波构成不可绕过的关账顺序——README 落地后豁免必摘，中间态 BLOCKED 经 git worktree 复现留痕（关账前/中间态/关账后三段 exit 0→2→0）。机制设计（W2）到关账执行（W7）跨波闭环，无需人工记忆。
2. **E2 去网络绑定的 fixture 形态**：伪造「已安装布局」比 mock 更贴近真值——bin 名单实读自 fixture 内 package.json#bin、运行时依赖闭包（js-yaml→argparse）BFS 直拷；真实 pnpm 链路降级为 `SPEC_WAVE_E2E_NETWORK=1` 门控手动测试并双侧实测（skip 留痕 + 门控实证非死代码），套件从 8s 网络绑定降为 161ms 纯本地。
3. **E5 预试开量化是熔断条款的前提**：R0 阶段 `tsc --noUncheckedIndexedAccess` 预试开实测 62 错/11 文件入档，30 开工即知爆炸半径；实测修复全为循环界内/捕获组/split 首元的机械 `!` 收窄（+一处纯类型键集合钉死），零运行时语义变更，熔断阈值内收官。
4. **续棒纪律**：前任中断后先逐条重验已落地部分（README/GLOSSARY/pins  yaml 与测试联改核读 + 门禁复跑），确认无缺口再续未完项；历史中间态证据可用 git worktree 无损复现，不需回滚工作树。

---

## 思考轮

### R0 · 证据

SPEC 07（signed）+ 前提复核全实测（README 行位 · pin-17 现状与失陈债机检 · GLOSSARY 行位 · SYNC_PROMPT_FILES 11 文件无 50 · TASK_TEMPLATE 2 闸行 · E2 网络绑定根因=js-yaml+prepare devDeps · E5 预试开 62 错/11 文件）+ 基线 534/17/110。W6 词锚防误伤实测（roo='Roo Code' · zed 大写）直接复用为本波 TABLE 定案输入。

### R1 · 范围

范围①–⑧ = SPEC ①–④ 转写 + pin-17 关账单列（W2/W6 跨波约定 · PROMPT 明示「豁免必须全部摘除」）+ manifest 同步（W5 纪律）+ CHANGELOG 前波同例 + 全链路验收；非范围十条含双冻结（bump / RELEASING）· schema · 宣称 · 50 物化 · publish · --force · S2。

### R2 · 方案

SPEC 07 §6 已定：README 机检对齐【采纳】· 分层【采纳】· 措辞修正【采纳 · 补物化弃选】· 离线 fixture【采纳 · 重试弃选】· 单项加严【采纳 · 全家桶弃选】。形态五定案：TAGLINE / TABLE（锚形态保留 + 九词锚 + aider 注入层口径）/ PIN17（关账顺序硬约束）/ E2（伪造布局 + 门控真装）/ E5（阈值熔断）。

### R3 · 边界

双冻结 STOP（bump / RELEASING）· 失陈债关账顺序（不绕过校验 · 中间态必红）· 词锚防误伤（逐字大小写敏感）· aider/roo 措辞防夸大（事实卡）· E2 门控测试非 CI 默认 · E5 熔断 F-W7-02 · 双语互检 F-W7-06 · CI 无 lib 兜底 F-W7-07 · 开工闸 F-T-01。

### R4 · 可测性

验收 10 条全部命令级可机械验证（exit 码 + 输出钉字 + grep + git diff 名清单）；失陈债三段留痕为机检自执行的实证链。

### R5 · 签收就绪

本槽由 20-task-audit R1 复核后判充分；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 前提复核全实测成立（含 E5 预试开 62/11 量化） | no |
| R1 | 范围/非范围划定（SPEC §3/§4 + 双冻结纪律增补） | no |
| R2 | 方案定稿（SPEC §6 + 形态五定案） | no |
| R3 | 边界九条（冻结 STOP / 关账顺序 / 锚防误伤 / 措辞防夸大 / 门控 / 熔断 / 互检 / CI 兜底 / 开工闸） | no |
| R4 | 验收 10 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此（文档+数据+类型收窄波 · 非既有闸语义变更 · 评审文前置类阻塞不适用） | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 已 signed 且 §6 方案对比定稿主体形态；R0 前提全量化实测（E5 爆炸半径 62/11 已预知）；W7 属文档/数据/测试面收尾，非既有门禁语义变更（D-23-W4-REVIEW-FIRST 不适用 · 与 W5/W6 同型）；无新增开放问题。  
**residual_risks**：① E5 修复中个别点位语义判断（缓解：熔断阈值 + 逐修 diff 复核 · 预期全部为 `| undefined` 机械收窄）；② 离线 fixture 与真实 pnpm 安装布局的残差（缓解：F-W7-03 门控真装测试保留 + 注释写明差异）；③ 双语 13 行表新增词锚与既有文本的意外命中（缓解：落地后立即 pins check · 失陈债/缺失双侧机检兜底）；④ GLOSSARY「现行模板」口径的未来漂移（F-W7-05 已声明已知边界）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | 开单 · 10-task · 蓝本 SPEC 07（signed）· R0 前提复核全实测成立（E5 预试开 62 错/11 文件量化入档）· D-23-W7-TAGLINE/TABLE/PIN17/E2/E5 五定案 · 双冻结 freeze_id（bump / RELEASING） |
| 2026-09-14 | 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w7_dx_health_audit_R1_20260914.md` · 非阻塞观察 ×3）· HG-AUDIT-R1 approved（2026-09-12 维护者会话授权 00 代签） |
| 2026-09-14 | 30/40 闭环（续棒）：①②重验属实（README 双语 13 行 · GLOSSARY 两处 · pin-17 豁免 9→0）+ ③ E2 离线 fixture（门控真装双侧实证）+ ④ E5 加严 62 错修平（熔断未触发）· pin-17 三段留痕（worktree 复现中间态 exit 2）· 四门绿 534+1skip · pins 17/17 · assets 110/110 · 版本面双冻结零漂移 |
