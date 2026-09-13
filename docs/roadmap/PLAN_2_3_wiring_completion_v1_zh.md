# 规划 · 2.3.0 · 接线补全（wiring completion）

> **状态**：`signed` · **HG-SPEC-SIGNOFF=approved** · **HG-NEXT-PLAN=approved**（2026-09-12 维护者会话授权 00 代签 · 与 2.2.0/2.2.1 同模式）  
> **目标发版**：`spec-wave@2.3.0`（**minor** · 「声明 → 接线 → 可验证」主线之接线补全）  
> **基线**：`spec-wave@2.2.1` published（npm `latest` · tag `v2.2.1` ↔ 包身份一致）· 464 用例全通过 · `pins check` 12/12 PASS（本棒实测 2026-09-12 · exit 0）· typecheck 0 错 0 警 · 运行时依赖仅 `js-yaml` · 宿主 7 个  
> **任务来源**：[`.workbuddy/output/PROMPT-2.3.0-落地-交给SpecWave-agent.md`](../.workbuddy/output/PROMPT-2.3.0-落地-交给SpecWave-agent.md)（§3 波次表 · §4 硬约束 · §5 人闸模式）  
> **判断依据**：[`.workbuddy/output/路线研究-SpecWave-2.2-3.0.md`](../.workbuddy/output/路线研究-SpecWave-2.2-3.0.md)（§5 波次编排出处）· [`.workbuddy/output/验收报告-SpecWave-2.2.0.md`](../.workbuddy/output/验收报告-SpecWave-2.2.0.md)（§4 问题清单 §7 机制化建议 · 本次范围主源）  
> **文案纪律**：[`.workbuddy/output/推广事实卡-2.2.0.md`](../.workbuddy/output/推广事实卡-2.2.0.md)（§10 黑名单 · §11 禁称清单）  
> **系列 SPEC**：[`docs/spec/2_3-wiring-completion/`](../spec/2_3-wiring-completion/)（`signed`）

---

## 一句话

把 2.2.0 对抗验收留下的「门禁建了但钉不严、闸标了但没接线、能力加了但关联面没跟上」三类缺口机制化收口：W1 pins 机制补强（本次核心 · 验收遗留 [A] 集中区），W2 钉面维度扩展，W3 安全与可观测性补漏，W4 闸语义接线（先评审后动手），W5 资产完整性校验，W6 六宿主补齐，W7 DX 与工程健康——**不动 host-adapt schema、不扩大范围、S2 永不覆写**。

---

## 前提校核（10-spec 实测复核 · 2026-09-12）

> PROMPT 要求：若某 [A]# 已被 2.2.1 顺带修掉或 `file:line` 失效，如实记录、不强行按错误前提规划。以下逐条复核（只读）。

| # | 前提 | 复核结果 | 结论 |
|---|------|----------|------|
| 1 | 基线 `spec-wave@2.2.1` · pins 12/12 | `package.json:3` = 2.2.1；本棒实跑 `node bin/specgate.js pins check` → **12/12 PASS · exit 0** | ✅ 有效 |
| 2 | [A]#1 P0 symlink 穿透 —— **不在 2.3 范围** | CHANGELOG `[2.2.1]` 已修（`src/cli-shared.ts:330-338` realpath 双侧归卡 · 四调用点） | ✅ 2.2.1 已修 · 正确排除 |
| 3 | [A]#2 P1 pins fix 静默部分修复 —— **不在 2.3 范围** | CHANGELOG `[2.2.1]` 已修（`src/cli-pins.ts:253/:347/:384` 按文件聚合 plan） | ✅ 2.2.1 已修 · 正确排除 |
| 4 | [A]#3 GLOSSARY 未进 tarball / [A]#6 `.workbuddy/` 未 gitignore | `package.json#files` 含 `GLOSSARY.md`；`.gitignore` 含 `.workbuddy/` | ✅ 2.2.1 已修 · 正确排除 |
| 5 | [A]#7 pin-08 弱钉 | `assets/release-pins.yaml:60-73`：extract kind=`spec-index-row`，机械化口径仅「存在含版本串的 `|` 行」——弱钉属实，本棒复核与验收 §2 一致 | ✅ 有效（W1①） |
| 6 | [A]#8 CHANGELOG / MIGRATION / AGENTS 三面未入钉 | `release-pins.yaml` 现有 pin-01..12 无此三落点；`MIGRATION.md`、`AGENTS.md` 的 `spec-wave@X` 出现处确认存在 | ✅ 有效（W1② · 纯数据） |
| 7 | [A]#14 pin-04/06/07/10/11/12 缺失配 fixture | `test/pins-consistency.test.ts` 失配 fixture 仅覆盖 pin-01/02/03/05/08/09（+2.2.1 新增 B11 同文件聚合回归） | ✅ 有效（W1③） |
| 8 | [D] `verify --spec` 目录型 slug 推导 | `src/cli-checks.ts:553-557` `extractSpecSlug`：spec_slug 元信息优先，回退 basename 去前缀/版本后缀——传目录夹 README（如 `docs/spec/<slug>/README.md`）时 basename=`README` → slug 误推为 `readme`，审查文存在性闸（findSpecReview :576-594）按错 slug 查找 → 误判 | ✅ 有效（W1④） |
| 9 | [A]#5 C3 未覆盖 `--json` 与错误文案 | `test/cli-verify-observability.test.ts:149` 仍把 `payload.target` 钉死为绝对路径 `dir`（实测确认） | ✅ 有效（W3①） |
| 10 | [A]#9 quickstart 未提 git 前提 | `init` quickstart 文案 3 步无 `git init` 提示（2.2.0 验收 §2 W4 实测结论沿用） | ✅ 有效（W3③） |
| 11 | [A]#10/#11 GLOSSARY 两处措辞 | `GLOSSARY.md`「four gates」未分层 ·「每帽对应一个 prompt 文件」对 `50-independent-reinspect` 不成立（sync prompts 物化 7 帽无 50） | ✅ 有效（W7②） |
| 12 | [A]#4 根 README 未更新 7 宿主 | `README.md` / `README.zh-CN.md` grep `copilot\|codex\|windsurf` 口径沿用验收 §2 W6（P2-4 未随 2.2.1 修复） | ✅ 有效（W7①） |
| 13 | A5 4 项 not_wired 闸 | `assets/harness/discipline-coverage.yaml`：G2(:31) / G4(:41) / FULL-reviews(:66) / INVOKE-HATS(:76) 均 `status: not_wired`（实测确认）；`reviews.CLOSE` 代理口径注释 `src/cli-status.ts:94` 沿用 | ✅ 有效（W4） |
| 14 | HEAD=`6bdf3ad`（00 实测值） | 本棒实测 HEAD=`4030242`（`docs(release): mark 2.2.1 published` 发布簿记提交 · 工作树干净） | ⚠️ 微偏差：00 取值时点早于发布簿记提交，不影响任何规划前提，如实留痕 |

**范围边界确认**：PROMPT §3 七波与 00 委派范围逐条对齐，无增无减；`test/cli-verify-observability.test.ts:149`、`cli-checks.ts:553-557`、`discipline-coverage.yaml` 四处 not_wired 均经本棒只读复核，证据未失效。

---

## 波次总表

| Wave | 主题 | 内容 | 出处 | 状态 |
|------|------|------|------|------|
| **W1** | **pins 机制补强（本次核心）** | ① pin-08 弱钉改严（提取须含版本且落状态单元格 [A]#7）② CHANGELOG 最新发布头 / MIGRATION `spec-wave@X` / AGENTS `npx spec-wave@X` 三面入钉（纯数据 [A]#8）③ pin-04/06/07/10/11/12 失配 fixture 补全（[A]#14）④ `verify --spec` 目录型 slug 推导修复（[D]）⑤ 同文件钉面模式重叠 unfixable 误报候选债评估（[D] · 可只留评估结论） | 验收 §2/§4 · 债留痕 | 待 HG-NEXT-PLAN |
| W2 | 钉面维度扩展 | 「新增文档须在 `package.json#files` 白名单内」+「新增宿主须在根 README 多宿主表内」两条机械校验数据化（release-pins.yaml 或独立 check） | 验收 §7 对称现象 | 待 HG-NEXT-PLAN |
| W3 | 安全与可观测性补全 | ① C3 补漏：`--json` target 字段与错误文案统一 toRel 相对化（test:149 期望同步 [A]#5）② exit 1 用法错时 `--json` 补 JSON 信封（[A]W3-P2）③ quickstart 第 3 步补 git init 前提（[A]#9）④ C4：CI `permissions:` 最小权限 + 依赖/密钥扫描（[R]）；附：C5 provenance/OIDC 仅出配置指引文档（账号配置仅人） | 验收 §4 · 路线 §5 | 待 HG-NEXT-PLAN |
| W4 | A5+A6 闸语义接线 | 4 项 not_wired 闸接线（G2 / G4 / FULL-reviews / INVOKE-HATS）+ `reviews.CLOSE` 语义补强。**门禁语义变更须先出接线方案评审再动手** | 路线 §5 主线一 | 待 HG-NEXT-PLAN |
| W5 | A2 资产完整性校验 | `assets/sha256.manifest` + `spec-wave assets verify` + CI 接线（failClosed exit 2 · 修复命令配套防持续报红） | 路线 §5 主线一 | 待 HG-NEXT-PLAN |
| W6 | B4 宿主补齐 | gemini / opencode / roo / zed / cline / aider 六宿主（复用 agents 资产面先例 · 落点按官方文档逐宿主取证 · 新宿主同步触发 W2 README 表校验） | 路线 §5 主线二 | 待 HG-NEXT-PLAN |
| W7 | DX 与工程健康 | ① 根 README 双语更新宿主表（[A]#4）② GLOSSARY「four gates」分层 +「每帽一 prompt 文件」措辞修正（[A]#10/#11）③ E2 离线 fixture + E5 tsconfig 加严（[R]） | 验收 §4 · 路线 §5 | 待 HG-NEXT-PLAN |

**顺序与依赖**：W1 先行（核心 · 其余各波完成后受 pins check 保护；W1② 三面入钉后 bump 2.3.0 时不再静默过期）；W2 紧随（W6 新宿主落地即受 W2 README 表校验约束）；W3 安全可观测独立；W4 门禁语义变更最重、须先评审，排在机制债收口之后；W5 独立；W6 依赖 W2（校验先行）；W7 收尾（README 宿主表须含 W6 新宿主口径）。**每波一个独立 task、单独提交（`feat(2.3-W<n>): …`）**，每波链路：10-task → 20-task-audit（审查文落盘 `docs/harness/reviews/`）→ HG-AUDIT-R1（00 代签）→ 30/40（GATE_VERIFY 首输出 → 实现 → 自证 → `gate-check` → `task close --yes`）。

---

## W1 · pins 机制补强（本次核心）

> 详规：[`docs/spec/2_3-wiring-completion/01_w1_pins_hardening_v1.md`](../spec/2_3-wiring-completion/01_w1_pins_hardening_v1.md)

- **范围**：pin-08 提取改严（须含版本且落状态单元格）；release-pins.yaml 纯数据新增 CHANGELOG / MIGRATION / AGENTS 三钉面；`test/pins-consistency.test.ts` 补 pin-04/06/07/10/11/12 失配 fixture；`extractSpecSlug` 目录型回退修复；同文件钉面模式重叠 unfixable 误报评估（结论留档即可，实现与否由评估定）。
- **非范围**：不改 pins 引擎既有语义（除 pin-08 提取口径与 slug 推导两处定点）；不实现 unfixable 误报修复（除非评估结论为低成本）；不动 S2。
- **验收要点**：pin-08 严化后破坏性自证（版本漂移被抓 · 状态单元格外版本串不再兜底）；三面入钉后 `pins check` 落点数增长且全 PASS；bump 场景三面不再静默过期；目录型 `--spec docs/spec/<slug>/README.md` 审查文闸按正确 slug 判定；新增失配 fixture 真失败。
- **风险**：pin-08 严化可能误伤既有合规索引行 → 以现行 `docs/spec/README.md` 全部行做回归；三面入钉的正则脆性 → 表达式入 yaml 数据（既有先例）。

## W2 · 钉面维度扩展

> 详规：[`02_w2_pin_dimensions_v1.md`](../spec/2_3-wiring-completion/02_w2_pin_dimensions_v1.md)

- **范围**：两条新机械校验——「新增文档须在 `package.json#files` 白名单内」（GLOSSARY 死链类 [A]#3 同型）·「新增宿主须在根 README 多宿主表内」（7 宿主低估类 [A]#4 同型）；数据化入 release-pins.yaml 或独立 check（方案对比见 SPEC）。
- **非范围**：不做通用「文档-实现一致性」框架；不改 pins 引擎架构（若选独立 check 则复用 pins 门禁语义 exit 2）。
- **验收要点**：构造「文档进 README 链接但未进 files」与「适配表有宿主而根 README 表无」两个负向靶场 → 校验 exit 2 且指出落点；正向全绿。
- **风险**：README 表格式的解析脆性 → 校验口径以「宿主持久 id 出现于根 README 双语」机械化表述。

## W3 · 安全与可观测性补全

> 详规：[`03_w3_security_observability_v1.md`](../spec/2_3-wiring-completion/03_w3_security_observability_v1.md)

- **范围**：`--json` `target` 字段与错误文案统一 toRel 相对化（`cli-verify-observability.test.ts:149` 期望值同步改为相对口径）；exit 1 用法错时 `--json` 输出 JSON 信封（错误原因结构化）；init quickstart 第 3 步补 git init 前提提示；CI `permissions:` 最小权限 + 依赖/密钥扫描；C5 发布 provenance/OIDC **仅出配置指引文档**（账号配置仅人）。
- **非范围**：不做 `audit --json` 四字段扩展（[A]W3-P2 其二 · 归后续评估）；不做 C6 审计落盘（3.0）；C5 账号侧配置仅人。
- **验收要点**：`--json` 输出与错误文案无任何绝对路径泄漏（含 /tmp 靶场）；用法错 + `--json` → stdout 可 JSON.parse 且含错误字段；非 git 目录照做 quickstart 全三步走通；CI workflow 含最小 `permissions:` 与扫描步骤。
- **风险**：toRel 相对化改变 `--json` target 字段既有值（绝对 → 相对）属契约变更 → 标 freeze_id 级注意：字段语义变更须在 CHANGELOG 明示（2.2.0 契约「只增不改」对象为键集，值为相对化修复安全泄漏，评审定口径）。

## W4 · A5+A6 闸语义接线

> 详规：[`04_w4_gate_wiring_v1.md`](../spec/2_3-wiring-completion/04_w4_gate_wiring_v1.md)

- **范围**：G2（reviews 留档闸）/ G4（思考轮结构 · 现仅 W4 warn-only）/ FULL-reviews（裸 verify 查 reviews）/ INVOKE-HATS（多帽 invoke 集合闸）四项 not_wired 接线 + `reviews.CLOSE` 从代理口径升级为「close 审查通过」强证据。
- **硬前置**：**先出接线方案评审文（落盘 docs/harness/reviews/）再动手**——门禁语义变更影响所有消费者的 failClosed 行为，评审通过前 30 拒改码。
- **非范围**：不动 deferred 三项（G6 / G7 / N2-C）；不加 hooks；不改闸豁免旗标既有语义。
- **验收要点**：接线后 `discipline-coverage.yaml` 四项状态从 not_wired 变更（pin-04 联动）；每项新闸有负向靶场真失败；`reviews.CLOSE` 新语义有测；事实卡 §11「关账必经审查通过」禁称口径同步评审。
- **风险**：G4 思考轮结构严化可能大面积误伤存量 task → 评审决定 warn-only 过渡窗或默认档；这是本波最大不确定点。

## W5 · A2 资产完整性校验

> 详规：[`05_w5_assets_integrity_v1.md`](../spec/2_3-wiring-completion/05_w5_assets_integrity_v1.md)

- **范围**：构建期生成 `assets/sha256.manifest`；新子命令 `spec-wave assets verify`（failClosed exit 2 · 与 pins 同门禁语义）；修复命令配套（重生成 manifest · 防持续报红）；CI 接线。
- **非范围**：不做签名/密钥体系（仅 sha256 清单）；不接外部遥测；manifest 本身不含 S2 内容。
- **验收要点**：篡改任一 assets 文件 → verify exit 2 指出文件；修复命令收敛；tarball 含 manifest；事实卡 §11「assets sha256 完整性清单」禁称在本波落地前不得解除（文案只写「将新增」）。
- **风险**：manifest 自更新时机的竞态（构建期生成 vs 工作树漂移）→ 以「发布物为校验对象」定口径。

## W6 · B4 宿主补齐

> 详规：[`06_w6_host_completion_v1.md`](../spec/2_3-wiring-completion/06_w6_host_completion_v1.md)

- **范围**：适配表新增 gemini / opencode / roo / zed / cline / aider 六宿主；落点**按官方文档逐宿主取证**（2.2 W6 codex `.agents/skills` 纠偏为鉴）；复用 agents 资产面先例（近零新资产）；新宿主同步触发 W2 的根 README 表校验。
- **非范围**：**不动 host-adapt schema**（schema 变更即 STOP 上报）；不做 B2/B3/B5（3.0）；落地前对外文案不得预告「13 宿主」（事实卡 §11）。
- **验收要点**：`host validate` PASS；六宿主 `apply --dry-run` 落点与官方文档取证一致（每宿主留出处）；`host update` 幂等；W2 README 表校验覆盖 13 宿主。
- **风险**：六宿主官方落点文档可能变动或查无明确约定 → 逐宿主留取证出处，查无确据的宿主降级为「always_on 仅 AGENTS.md 复用」并如实标注。

## W7 · DX 与工程健康

> 详规：[`07_w7_dx_health_v1.md`](../spec/2_3-wiring-completion/07_w7_dx_health_v1.md)

- **范围**：根 README 双语多宿主表更新（含 W6 新宿主 · [A]#4）；GLOSSARY「four gates」按 task / SPEC / 发版分层 +「每帽对应一个 prompt 文件」措辞修正（[A]#10/#11）；E2 `cli-peer-optional` 改离线 fixture（去真实 `pnpm install`）；E5 tsconfig 加严（`noUncheckedIndexedAccess` 等）。
- **非范围**：不做 D4 报错国际化 / D6 QUICKSTART（归后续评估）；不拆 god-file（E4 · 3.0）；不削 spawn（E3 · 3.0）。
- **验收要点**：README 双语宿主机检过 W2 校验；GLOSSARY 两处措辞与实现一致（8 帽模型 · 闸分层）；E2 后套件无网络绑定；E5 加严后 typecheck 0 错。
- **风险**：E5 tsconfig 加严可能暴露存量类型错 → 以「加严后 0 错」为验收，超出工作量即停上报（不硬修扩散面）。

---

## 非范围（明确不做 · 属 3.0 或冻结）

| 项 | 归属 | 说明 |
|----|------|------|
| A3 host-adapt `hooks`/`verify` surface 落地 | 3.0（战略级 · 含 schema breaking） | 本版**不动 schema**，触 schema 即 STOP |
| A4 `ontology-check` 接线 | 3.0 | — |
| B2 / B3 / B5 适配表分层 / 动词名入表 / 插件机制 | 3.0 | — |
| C6 审计日志落盘 | 3.0 | — |
| D4 报错国际化 · D6 QUICKSTART walkthrough | 后续评估 | 本版不承诺 |
| **D5 `docs/roadmap/` 改名 `docs/spec-archive/`** | **默认不做 · 推荐归 3.0 评估** | 维护者决策项（PROMPT §使用说明 4）：交叉引用面广，改名涉及 pins 落点（pin-08 路径）、SPEC 索引、AGENTS/README 指引联动，宜与 3.0 架构轨一并评估；本计划注记留痕 |
| E3 测试 spawn 削减 · E4 god-file 拆分 | 3.0 | — |
| F1 双图谱统一 等架构项 | 3.0 | — |
| npm publish / deprecate / tag / push | **仅人**（或按维护者当次授权） | Agent 禁止 |

---

## 硬约束（沿用 PROMPT §4 + 本仓纪律）

1. **S2 过程域永不覆写**：`docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`（只新增不覆写）。
2. **P0 门禁不可绕过**：禁止任何 `--force` / `--allow-*` 新绕过参数（verify / gate-check / audit / pins / assets verify）。
3. **对外文案受事实卡-2.2.0 约束**：未落地能力（sha256 校验 · ontology-check · hooks surface · audit 落盘 · provenance · 未发布宿主数）一律「将新增 / 规划中」口径。
4. **不动 host-adapt schema**：schema 变更即 STOP 上报。
5. **RELEASING.md 双重敏感**（pin-07 落点 + 九步顺序测 `/版本钉|pins/` 正则首个命中）：改措辞后必跑全量 `npm test`（先例 1fde23e）。
6. 每波提交前 `npm run typecheck` + `npm test` 必过；每波单独提交 `feat(2.3-W<n>): …` · **禁 `git add -A`**。
7. **W4 门禁语义变更须先出接线方案评审再动手**（评审文落盘 `docs/harness/reviews/`）。
8. Agent **禁止** `npm publish` / `npm deprecate`（仅人）。

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-12 维护者会话授权 00 代签 · 与 2.2.0/2.2.1 同模式） | ~~SPEC 系列定稿~~ |
| **HG-NEXT-PLAN** | **approved**（2026-09-12 维护者会话授权 00 代签） | ~~开 W1 task 起草~~ |
| HG-AUDIT-R1（每波 ×7） | pending | 各波 30 改码前（task 阶段逐波走 10-task → 20-task-audit → 00 代签） |
| HG-RELEASE（2.3.0 发版） | pending | publish（仅人） |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | draft · 10-spec 起草；PROMPT-2.3.0 §3/§4/§5 全吸收；前提校核 14 条实测复核（13 ✅ · 1 ⚠️ HEAD 簿记偏差留痕） |
| 2026-09-12 | signed · HG-SPEC-SIGNOFF / HG-NEXT-PLAN approved（00 代签 · 2026-09-12 维护者会话授权） |
