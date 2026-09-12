# 规划 · 2.2.0 · 闭环起步（closed-loop start）

> **状态**：`signed` · **HG-SPEC-SIGNOFF=approved** · **HG-NEXT-PLAN=approved**（人 · 2026-09-11 会话预授权 · 00 代签落表）  
> **目标发版**：`spec-wave@2.2.0`（**minor** · 「声明 → 接线 → 可验证」闭环起步）  
> **基线**：`spec-wave@2.1.3` published（npm `latest` · tag `v2.1.3` ↔ 同 commit）· 406 用例 / 54 文件 / 48.7s 全通过 · typecheck 0 错 0 警 · 运行时依赖仅 `js-yaml` · 宿主 4 个  
> **任务来源**：[`.workbuddy/output/PROMPT-2.2.0-落地-交给SpecWave-agent.md`](../.workbuddy/output/PROMPT-2.2.0-落地-交给SpecWave-agent.md)（§3 波次表 · §4 W1/A1 详规 · §6 硬约束）  
> **判断依据**：[`.workbuddy/output/路线研究-SpecWave-2.2-3.0.md`](../.workbuddy/output/路线研究-SpecWave-2.2-3.0.md)（五路取证 · 加权评分 · 波次编排）  
> **文案纪律**：[`.workbuddy/output/推广事实卡-2.1.3.md`](../.workbuddy/output/推广事实卡-2.1.3.md)（§10 黑名单 · §11 禁称清单）  
> **系列 SPEC**：[`docs/spec/2_2-closed-loop-start/`](../spec/2_2-closed-loop-start/)（`draft`）

---

## 一句话

把「声称与接线之间靠人写注释维持诚实」变成 **机械可验证**：W1 版本/身份钉自动化（本次核心），W2–W7 依次为安全封堵、可观测性补字段、上手断档消除、术语表、三宿主扩展、小清理——全部低代价高性价比（路线研究评分 ≥ 4.0），**不动 schema、不动架构、不加 hooks**。

---

## 前提校核（10-spec 实测复核 · 2026-09-11）

> PROMPT 要求：若 `file:line` 证据失效须如实记录、不强行引用。以下逐条复核（只读，未改任何文件）。

| # | PROMPT / 路线研究证据 | 复核结果 | 结论 |
|---|----------------------|----------|------|
| 1 | `package.json` `version=2.1.3` · `name=spec-wave` · bin 三入口 | `package.json:2-3` · `:19-23`（`spec-wave`/`specgate`/`dsh-coding-kit`） | ✅ 有效 |
| 2 | `assets/ontology.yaml` `product_semver=2.1.3` | `assets/ontology.yaml:7` | ✅ 有效 |
| 3 | `assets/harness/discipline-coverage.yaml` `as_of_package_version=2.1.3` | 第 14 行 | ✅ 有效 |
| 4 | README 双语 `spec-wave@2.1.3` 出现处 | `README.md` 11 处 · `README.zh-CN.md` 11 处（含 :319 现行包行） | ✅ 有效 |
| 5 | `RELEASING.md` 「现行包 / registry latest」行 | `RELEASING.md:13`（`spec-wave@2.1.3` 已 published · tag `v2.1.3`） | ✅ 有效 |
| 6 | `docs/spec/README.md` 缺 `2_1_3` 行 | 确认：索引末行 `2_1_2-rename-closeout`，无 `2_1_3-*` 行；`docs/spec/` 下亦无 `2_1_3-*` 夹 | ✅ 有效（钉面 #8 偏差属实） |
| 7 | git tag `v2.1.3` | `git tag -l` 存在（v2.1.0–v2.1.3 齐） | ✅ 有效 |
| 8 | `cli-shared.ts:275-277` `resolveTaskPath` 接受任意绝对路径 | 实测代码一致：`path.isAbsolute(taskFile) ? taskFile : path.join(target, taskFile)` | ✅ 有效 |
| 9 | `cli-shared.ts:32-34` `resolveTarget` 无 git-root 归卡校验 | 实测代码一致：仅 `path.resolve(targetArg || cwd)` | ✅ 有效 |
| 10 | `cli.ts:548` 打印 `目标: /abs/path` | **部分修正**：:548 属实（位于 `audit` 命令分支），但同类打印共 **3 处**：`cli.ts:403 / :500 / :548`；`resolveTaskPath` 在 `cli.ts` 有 4 个调用点（:510/:554/:597/:710）。W2 范围应按「全部点位」计 | ✅ 有效（点位需补全） |
| 11 | `ci.yml` test job 无 `timeout-minutes` | 实测 `.github/workflows/ci.yml` 全文无 `timeout-minutes`（亦无 `permissions:`，后者属 C4/2.3 非本次范围） | ✅ 有效 |
| 12 | `## Harness 元信息` 字面量 4 文件 18 处 | 实测 `src/` grep：**恰好 18 处**（cli-checks 5 · cli 2 · cli-shared 8 · cli-task-extra 3） | ✅ 有效 |
| 13 | `mvp-hosts.yaml` 4 个 host_id | dsh / cursor / claude / agents（:9/:26/:46/:66） | ✅ 有效 |
| 14 | 全仓 grep `术语表\|Glossary` 命中 0 | 仓根 / `docs/` 无 `GLOSSARY.md`；命中仅在 `delivery/` 历史档与 `assets/` 模板注释 | ✅ 有效（对外文档面无术语表） |
| 15 | `verify --task /etc/hosts` 被接受（路线研究已复现） | 代码路径复核成立（证据 8 + `cli.ts:510` 调用链）；10-spec 帽下**不重跑该读取**，采信路线研究复现结论 | ✅ 有效（采信复核） |
| 16 | AGENTS.md POINTER `docs/harness/prompts/` | 本仓该目录未物化；条文真值实际读自 `assets/harness/prompts/`（10-spec-requirements.md · FRAGMENT_30_gate_verify_v1_zh.md 等 13 份）。**不影响本任务**，仅留痕 | ⚠️ 路径说明留痕 |

**工作区状态留痕**：`git status` 显示 `delivery/promotion/*` 4 份 + `package.json` 有未提交的 D0 改动，`.workbuddy/` 若干未跟踪——本规划与 SPEC **不触碰**这些文件（见 §硬约束）。

---

## 波次总表

| Wave | ID | 任务 | 状态 |
|------|----|------|------|
| W0 | D0 | 推广物料翻新（`delivery/promotion/` 4 份 + `package.json` description/keywords） | **已完成（上一轮，外部）· 仅引用不重做** |
| **W1** | **A1** | **版本/身份钉自动化：`assets/release-pins.yaml` 单一声明源 + `pins check` / `pins fix` + 门禁接线** | 本次核心 · 待 HG-NEXT-PLAN |
| W2 | C1 + C3 | 封堵任意文件读穿越 + 停止输出绝对路径 | 待 HG-NEXT-PLAN |
| W3 | C2 | `verify --json` 补 `traceId` / `exitCode` / `source` / `injectedFiles` | 待 HG-NEXT-PLAN |
| W4 | D1 + D3 | `init` 后 3 步 quickstart + README 定义核心对象 | 待 HG-NEXT-PLAN |
| W5 | D2 | 新增双语 `GLOSSARY.md` + README 首屏链接 | 待 HG-NEXT-PLAN |
| W6 | B1 | 新增 `copilot` / `codex` / `windsurf` 三宿主 | 待 HG-NEXT-PLAN |
| W7 | E1 + C7 | `HARNESS_META_HEADING` 抽常量 + dest 白名单显式化 | 待 HG-NEXT-PLAN |

**顺序与依赖**：W1 先行（其余各波完成后都受 pins check 保护）；W2/W3 安全与可观测性独立可并行评审；W4/W5 同为对外文档面宜相邻；W6 依赖 W1（新宿主落点版本文案亦入钉面）；W7 收尾。每波一个独立 task、单独提交（`feat(2.2-W<n>): …`），每波完成跑 `npx spec-wave gate-check --task <task.md>`。

---

## W1 · A1 · 版本/身份钉自动化（本次核心）

> 详规：[`docs/spec/2_2-closed-loop-start/01_release_pins_v1.md`](../spec/2_2-closed-loop-start/01_release_pins_v1.md)

- **范围**：新建 `assets/release-pins.yaml` 单一声明源（10 行钉面清单落为数据）；**将新增** `spec-wave pins check [--json]` 与 `spec-wave pins fix [--yes]`；接入 `prepublishOnly` 与 `.github/workflows/ci.yml`；给 CI test job 补 `timeout-minutes`；补 `docs/spec/README.md` 的 2.1.3 漂移行。
- **非范围**：不硬编码落点进 TypeScript；不做资产 sha256（A2 · 2.3）；不动 `delivery/promotion/*` 与 `package.json` 的 D0 改动；S2 目录永不可写。
- **依赖**：无前置波；结论项 D-PINS-EXIT（exit 码口径）与 D-SPEC-213-ROW（2.1.3 补行形态）待人签冻结。
- **验收要点**（详 §SPEC 01）：干净树 `pins check` exit 0；破坏性自证（ontology 改 `9.9.9` → check 报错指出文件与行 → fix 改回）；新增测试在失配时真失败；四门绿；S2 拒写反向验证。
- **风险**：若只做校验不做修复会持续报红（路线研究 §7，已由 fix 配套消解）；README 双语钉面提取方式的脆性（以声明源数据驱动、正则入 yaml 缓解）。

## W2 · C1 + C3 · 安全封堵

> 详规：[`02_security_closure_v1.md`](../spec/2_2-closed-loop-start/02_security_closure_v1.md)

- **范围**：`--task` / `--spec` 拒绝任意绝对路径（归卡 target 内）；`--target` 增 git-root 归属校验；`cli.ts` 三处 `目标: <abs>` 打印改相对路径（前提校核 #10）。
- **非范围**：不改 verify/gate-check/audit 判定算法；不动 S2 闸语义（已有沙箱实测拦截，路线研究裁决 1）。
- **依赖**：无；与 W1 独立。
- **验收要点**：`verify --task /etc/hosts` 类输入被拒（非 0 退出且不留读痕）；合法相对路径回归全绿；stdout 不再出现绝对目标路径。
- **风险**：绝对路径可能是存量用户 CI 的合法用法 → 拒止口径与报错文案须明确（failure_paths 列出迁移指引）。

## W3 · C2 · `verify --json` 补字段

> 详规：`02_security_closure_v1.md` §W3

- **范围**：`--json` 输出补 `traceId` / `exitCode` / `source` / `injectedFiles`（对齐安全设计 §7.2 明文要求）。
- **非范围**：不改既有字段语义（契约只增不改）；不做 `audit --json`、不做审计落盘（C6 · 3.0）。
- **验收要点**：四字段存在且有测；旧字段不变；事实卡 §11 对 `traceId` 的禁称在本波落地前不得解除。

## W4 · D1 + D3 · 上手断档

> 详规：[`03_dx_onboarding_v1.md`](../spec/2_2-closed-loop-start/03_dx_onboarding_v1.md)

- **范围**：`init` 完成后打印 3 步 quickstart（含 `sync prompts --yes` 隐式前置的显式化）；README 双语新增「核心对象」节（task.md / spec.md 是什么 / 从哪来 / 放哪 / 最小示例）。
- **非范围**：**不物化示例 task 进消费者仓 `docs/tasks/`**（S2 纪律：示例以模板/指引形式给出，不代写过程域）；不做 `docs/guides/QUICKSTART` walkthrough（D6 · 2.3）。
- **验收要点**：init 输出含下一步链（dry-run 与实测各一）；README 双语该节存在且互相引用一致。
- **风险**：示例 task 形态若处理不当会诱使 agent 写 S2 → SPEC 已显式冻结为「不物化」。

## W5 · D2 · 术语表

> 详规：`03_dx_onboarding_v1.md` §W5

- **范围**：新增双语 `GLOSSARY.md`（task.md/spec.md · Harness · hat · `kit-*` 四组首小时必懂概念）；README 双语首屏链接。
- **非范围**：不改 `docs/roadmap/` 目录名（D5 · 2.3）；不做报错国际化（D4 · 2.3）。
- **验收要点**：grep 可命中；双语条目对齐；链接有效。

## W6 · B1 · 三宿主扩展

> 详规：[`04_host_expansion_v1.md`](../spec/2_2-closed-loop-start/04_host_expansion_v1.md)

- **范围**：适配表新增 `copilot` / `codex` / `windsurf`（三者原生读 `AGENTS.md`，复用 `agents` host 已在物化的资产面，近零新资产）。
- **非范围**：不动 host-adapt schema（无 `extends`/hooks）；不预告对外「7 宿主」文案直至发布（事实卡 §11）。
- **依赖**：W1（新宿主版本文案落点纳入钉面）。
- **验收要点**：`host validate` 过；三宿主 `apply --dry-run` 落点正确；测试覆盖；宿主数实测更新事实卡口径。

## W7 · E1 + C7 · 小清理

> 详规：[`05_hygiene_v1.md`](../spec/2_2-closed-loop-start/05_hygiene_v1.md)

- **范围**：抽 `HARNESS_META_HEADING` 常量替换 `## Harness 元信息` 18 处字面量（4 文件）；dest 白名单显式化为 `.coding-kit` / `.dsh/coding-kit`。
- **非范围**：不拆 god-file（E4 · 3.0）；不削 spawn（E3 · 3.0）；`.cyning-harness` 仍仅 legacy 只读探测，不入白名单。
- **验收要点**：字面量 grep 归零；白名单常量单一真值；回归全绿。

---

## 非范围（属 2.3 / 3.0，本次明确不做）

| 项 | 归属 |
|----|------|
| A2 资产完整性校验（sha256 manifest + `assets verify`） | 2.3 |
| A3 host-adapt `hooks`/`verify` surface 落地 | 3.0（战略级 · 含 schema breaking） |
| A4 `ontology-check` 接线 | 3.0 |
| A5 4 项 `not_wired` 闸接线 · A6 `reviews.CLOSE` 语义补强 | 2.3 |
| B2–B5 适配表分层 / 动词名入表 / 补 6 宿主 / 插件机制 | 2.3–3.0 |
| C4 CI `permissions:` / 依赖扫描 · C5 发布 provenance · C6 审计落盘 | 2.3–3.0 |
| D4 报错国际化 · D5 `docs/roadmap/` 改名 · D6 QUICKSTART | 2.3 |
| E2 离线 fixture · E3 spawn 削减 · E4 god-file 拆分 · E5 tsconfig 加严 | 2.3–3.0 |
| F1 双图谱统一 等架构项 | 3.0 |

---

## 硬约束（沿用 PROMPT §6 + 本仓纪律）

1. **S2 过程域永不覆写**：`docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`。
2. **P0 门禁不可绕过**：禁止任何 `--force` / `--allow-*` 绕过 `verify` / `gate-check` / `audit`。
3. **对外文案受事实卡约束**：未落地能力只写「将新增 / 规划中」；禁止无出处数字。
4. **D0 物料与 `package.json` 现有未提交改动不动**（除 W1 钉面要求的版本字段机械维护外，且须与 D0 改动方协调提交边界）。
5. 每波提交前 `npm run typecheck` + `npm test` 必过；每波单独提交并注明波 ID。
6. Agent **禁止** `npm publish` / `npm deprecate`（仅人）。

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表） | ~~SPEC 定稿 · 冻结 D-PINS-EXIT / D-SPEC-213-ROW 等待决项~~（已冻结 · 采纳推荐） |
| **HG-NEXT-PLAN** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表） | ~~开 W1 实现~~ |
| HG-AUDIT-R1（每波） | pending | 各波 30 改码前（task 阶段填） |
| HG-RELEASE（2.2.0 发版） | pending | publish（仅人） |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | draft · 10-spec 起草；PROMPT §3/§4/§6 全吸收；前提校核 16 条实测复核 |
