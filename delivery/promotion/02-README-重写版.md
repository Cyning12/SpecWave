# SpecWave

> 跨宿主规范分发器——把 AI 编码纪律从"建议性提示词"升级为"机械门禁 + 留档可审计的过程轨"。零云、零服务端、MIT 开源。

[![npm version](https://img.shields.io/npm/v/spec-wave.svg)](https://www.npmjs.com/package/spec-wave)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![AGENTS.md](https://img.shields.io/badge/AGENTS.md-friendly-green.svg)](https://agents.md)
[![Node](https://img.shields.io/node/v/spec-wave)](https://nodejs.org)

**SpecWave**（`spec-wave@2.1.3`）是一个本地 CLI + npm 包，把 AI 编码过程的纪律从"建议性提示词"升级为"机械性门禁 + 留档可审计的过程轨"。零云、零服务端、MIT 开源。前身链为 SpecGate → dsh-coding-kit → SpecWave；过渡 bin `specgate` · `dsh-coding-kit` 仍可用（同一入口），旧包 `@cyning/harness` · `dsh-coding-kit` 均已 deprecate。

- **CLI 面**：`npx spec-wave check / verify / gate-check / audit`
- **插件面**：在 DSH 宿主内用 `apply_coding_standards` / `init_coding_kit`
- **核心方法论**：ICVO（Inform · Constrain · Verify · Orchestrate）
- **角色帽制**：共 8 帽，分 starter 4 + extended 4 两组（见下）

---

## 它解决什么问题

把 `AGENTS.md` / `CLAUDE.md` 当作"团队规范"的人都知道三个痛点：

1. **规范散落、版本不一致**——同一个规范在 4 个文件里被硬编码，门禁结论在命令之间漂移
2. **规范"不被执行"**——它是 prompt，不是 gate。规范被违反也不会阻断流程
3. **没有过程留档**——AI 做了什么、什么时候做的、产物在哪里，没法复盘，没法审计

SpecWave 把这三件事用**一次 `npx` 之内**的闭环解决：

```
规范注入 (Inform/Constrain) → 机械门禁 (Verify) → 过程轨留档 (Orchestrate)
      ↓                          ↓                       ↓
 assets/ 适配器            check / verify /         docs/tasks/ + reviews/ +
                            gate-check / audit       invokes/ (S2 永不覆写)
```

---

## 30 秒上手

```bash
# 在你的项目里跑一次 P0 门禁
npx --yes spec-wave@2.1.3 check

# 钉住一个版本做 CI 校验（推荐）
npx --yes spec-wave@2.1.3 verify --task <task.md>

# 启动过程轨（task close / status / timeline）
npx spec-wave task close <id>
npx spec-wave status
npx spec-wave timeline
```

**退出码语义**（与 Claude Code / Cursor 行业共识对齐）：
- `0` = 放行 / 信息性（`check` 恒 exit 0）
- `1` = 用法错误或非阻断失败
- `2` = 门禁阻断（failClosed，`verify` / `gate-check` / `audit` 失败即 exit 2）

---

## 核心概念

### ICVO — 纪律资产方法论

| 阶段 | 含义 | 落点 |
|------|------|------|
| **Inform** | 注入规范与上下文（团队约定、最佳实践） | `apply_coding_standards` 插件工具、`assets/` 适配器 |
| **Constrain** | 约束产物形态与过程边界（8 帽制、S2 永不覆写） | starter 4 帽 + extended 4 帽、`S2_TRUTH_PREFIXES` 共享常量 |
| **Verify** | 机械验证（不依赖宿主是否执行了 hook） | `check` / `verify` / `gate-check` / `audit` P0 门禁 |
| **Orchestrate** | 过程留档（任务关闭、评审、调用） | `docs/tasks/` + `docs/harness/reviews/` + `docs/harness/invokes/by-task/`（S2 永不覆写） |

### hat 帽制（共 8 帽，分两组）

| 组 | hat_id | 角色 |
|----|--------|------|
| **starter（4）** | `10-task` · `20-task-audit` · `30-execute-code` · `40-self-check` | 起步四帽，覆盖任务起草→审计→执行→自检 |
| **extended（4）** | `00-orchestrator` · `10-spec` · `20-spec-audit` · `50-independent-reinspect` | 扩展四帽，覆盖编排→规格→规格审计→独立复检 |

另有 4 道人闸（human gate）：`HG-TASK-DRAFT` · `HG-SPEC-SIGNOFF` · `HG-AUDIT-R1` · `HG-RELEASE`；生命周期 5 态：`draft → signed → in_progress → done → archived`。

### P0 门禁 = 不被提示词绕过的"硬判定"

SpecWave 的门禁判定走**进程内机械逻辑**，不依赖宿主是否执行了 hook。退出码 2 直接阻断管道，不靠"模型是否听话"——门禁靠 CLI 进程内判定，并不以 hooks 强制注入宿主。

> **诚实卖点**：本库主动公开自己的未接线项——直接跑 `npx spec-wave discipline show`，可见 Starter 范围内 30 条 statements 的分布：**mechanical 11 / partial 7 / prompt-only 9 / not_wired 3**。我们不说"全自动强制"，而是把覆盖度摊开给你看。

---

## 一包多宿主

自 2.0.0 起，一份声明式适配表即可在多个宿主落地原生资产（always_on + skills + commands）。门禁真值始终留在 CLI（failClosed exit 2），IDE 的 slash / commands 只做编排。

| Host | `host apply` 落点（profile `core`） |
|------|--------------------------------------|
| **Cursor** | `.cursor/rules/*.mdc` · `.cursor/commands/kit-*.md` · `.cursor/skills/` |
| **Claude Code** | `CLAUDE.md` 产品标记块 · `.claude/commands/kit/<verb>.md` → **`/kit:verb`** · `.claude/skills/` |
| **DSH** | `.dsh/skills/`（hat skills **+** 编排 `kit-*`，`/` 可发现；**无** `.dsh/commands/`） |
| **agents** | `AGENTS.md` 片段 · `.agents/skills/` |

**安装 / 更新 UX（2.1.1）**

- **sticky**：`host apply|update --yes`、`init`（物化时）成功后写 `.coding-kit/host-tools.json`（`host_ids` + `profile`）；**dry-run 不写**
- **`--tools`**：`LIST`（如 `cursor,claude,dsh`）· `all` · `none`（**仅 `init`** 可用）。`host apply` **恒需** `--tools`
- **`host update` 解析序**：CLI `--tools` → sticky → 否则 **exit 1**
- **`init`**：TTY 无 `--tools` → 询问；非 TTY / CI 无 `--tools` → **exit 1**；`--no-host-adapt` → 不物化且不写 sticky
- **`--profile`**：`core`（默认）/ `expanded`（额外物化 `kit-hat-*` 薄壳）

```bash
npx spec-wave@2.1.3 host apply --tools cursor,claude,dsh --profile core --yes
```

> **关键边界**：**安装 npm 包不会自动物化 IDE 文件**（无 postinstall）。必须显式跑 `init --tools` 或 `host apply`，宿主资产才会落地。

---

## 与行业方案的关系

| 工具 | 它做什么 | SpecWave 与它的关系 |
|------|---------|----------------------|
| **Ruler**（4.40 分） | 单一规范源 → 32 个 agent 原生配置位 | **互补**：Ruler 只做注入不做门禁，SpecWave 补门禁 + 过程轨 |
| **GitHub spec-kit**（4.35 分） | 规范驱动开发、过程产物入仓 | **同源**：SpecWave 的 S2 过程域与其范式同构 |
| **Claude Code**（3.90 分） | 门禁语义（退出码 2 / `permissionDecision: deny`） | **对齐**：SpecWave 门禁退出码语义与之完全一致 |
| **Cursor**（3.40 分） | 四层配置优先级（`failClosed`） | **借鉴**：宿主适配表分层参考其模型 |
| **AWS Kiro**（2.55 分） | 规格驱动 + 迁移治理范式 | **借鉴其迁移治理范式**（不是产品形态） |

> 上述标杆中，**没有一家同时提供「机械门禁 + 过程轨留档 + 角色分帽」三件事的等价物**。

> 以上加权评分（Ruler 4.40 / spec-kit 4.35 / Claude Code 3.90 / Cursor 3.40 / Kiro 2.55）出自 `delivery/research_report.md`，属**本方调研（自评）**，非第三方权威评测；SpecWave 在该表中是差异化列、未给总分，故不称"总分第一"。

---

## 路线图

### 已完成版本史

| 版本 | 主题 |
|------|------|
| **1.11.0** | 1.x MVP —— F1–F5 内部一致性收敛（S2 真源统一 · P0 门禁语义 · 旧线迁移 · 写根收敛 · 版本钉） |
| **1.12.0** | 1.x 收口 —— 本体论浅落地（O1–O3）· 宿主落点声明 prep |
| **2.0.0** | **F6 宿主适配** —— `host validate/apply/update` · Cursor + Claude + DSH 三角物化 · 契约嗅探 U-01 |
| **2.1.0** | **Skills + 编排 parity** —— Claude `/kit:verb` · DSH `.dsh/skills/kit-*` · `--profile expanded` |
| **2.1.1** | **安装/更新 UX** —— sticky 选型 · `--tools` · `init` 交互询问（对齐 OpenSpec） |
| **2.1.2** | **改名收口** —— 身份面统一 SpecWave · 迁移链切断 · tag↔npm 可溯源 |
| **2.1.3** | **溯源自动化** —— `release-tag-identity` 测 · README 双语对齐 · 负向断言防恒真 |

### 下一步（前瞻方向，非已完成）

- **2.2 闭环起步**：在现有 P0 门禁 + 过程轨基础上，进一步打磨从 task 起草到 close 的端到端闭环体验。
- **2.3 接线补全**：以 `discipline show` 当前披露的 `prompt-only` / `not_wired` 项为公开待办逐步接线（含 assets 完整性校验、独立 ontology-check 等**规划中**能力）。
- **3.0 架构跃迁**：面向更大规模过程治理的架构演进。

> 演进纪律：跨宿主不得把分裂真值源复制到 N 个宿主；真值源始终收敛在 CLI 一侧。

---

## 落盘目录约定

SpecWave 的新落盘目录（经方案 B 裁决）：

| 路径 | 语义 |
|------|------|
| `.coding-kit/` | SpecWave 主数据根（规范覆盖 + 迁移 + 事件 + 备份） |
| `.dsh/coding-kit/` | DSH 宿主场景（与 `.coding-kit` 语义等价） |
| `.dsh/skills/` / `$HOME/.dsh/skills/` | Skill 落点 |
| `docs/tasks/` + `docs/harness/reviews/` + `docs/harness/invokes/by-task/` | **S2 过程域，永不覆写** |
| `.cyning-harness/`（任意位置） | **legacy 只读探测**——不再作为新落盘目标，仅只读降级 + 提示 `upgrade` |

---

## 链接

- 📦 [npm: spec-wave](https://www.npmjs.com/package/spec-wave)
- 📖 完整架构评审见 `delivery/`（主文档 + 调研报告）
- 🛠 [AGENTS.md 规范](https://agents.md) · [Agent Skills 规范](https://github.com/agentskills/agentskills)
- 📝 [RELEASING.md](../../RELEASING.md) · [CHANGELOG.md](../../CHANGELOG.md) · [SPEC.md](../../SPEC.md)

---

**MIT 开源 · 零云 · 一条 `npx` 入门 · 与 `AGENTS.md` 友好**
