# dsh-coding-kit

> 给 AI 编码加「可证明的纪律」——规范注入、机械门禁、过程轨留档。

[![npm version](https://img.shields.io/npm/v/dsh-coding-kit.svg)](https://www.npmjs.com/package/dsh-coding-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![AGENTS.md](https://img.shields.io/badge/AGENTS.md-friendly-green.svg)](https://agents.md)
[![Node](https://img.shields.io/node/v/dsh-coding-kit)](https://nodejs.org)

**dsh-coding-kit** (kit) 是一个本地 CLI + npm 包，把 AI 编码过程的纪律从"建议性提示词"升级为"机械性门禁 + 留档可审计的过程轨"。零云、零服务端、MIT 开源。

- **CLI 面**：`npx dsh-coding-kit check / verify / gate-check / audit`
- **插件面**：在 DSH 宿主内用 `apply_coding_standards` / `init_coding_kit`
- **核心方法论**：ICVO（Inform · Constrain · Verify · Orchestrate）
- **角色帽制**：hat 00（delegate-only）/ 10 / 20 / 30 / 40（execute）

---

## 它解决什么问题

把 `AGENTS.md` / `CLAUDE.md` 当作"团队规范"的人都知道三个痛点：

1. **规范散落、版本不一致**——同一个规范在 4 个文件里被硬编码，门禁结论在命令之间漂移
2. **规范"不被执行"**——它是 prompt，不是 gate。规范被违反也不会阻断流程
3. **没有过程留档**——AI 做了什么、什么时候做的、产物在哪里，没法复盘，没法审计

kit 把这三件事用**一次 `npx` 之内**的闭环解决：

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
npx --yes dsh-coding-kit@latest check

# 钉住一个版本做 CI 校验（推荐）
npx --yes dsh-coding-kit@1.10.0 verify

# 启动过程轨（task close / status / timeline）
npx dsh-coding-kit task close <id>
npx dsh-coding-kit status
npx dsh-coding-kit timeline
```

**退出码语义**（与 Claude Code / Cursor 行业共识对齐）：
- `0` = 放行
- `2` = 阻断
- `1` = 通用失败（非阻断）

---

## 核心概念

### ICVO — 纪律资产方法论

| 阶段 | 含义 | 落点 |
|------|------|------|
| **Inform** | 注入规范与上下文（团队约定、最佳实践） | `apply_coding_standards` 插件工具、`assets/` 适配器 |
| **Constrain** | 约束产物形态与过程边界（角色帽制、S2 永不覆写） | hat 00/10/20/30/40、S2_TRUTH_PREFIXES 共享常量 |
| **Verify** | 机械验证（不依赖宿主是否执行了 hook） | `check` / `verify` / `gate-check` / `audit` P0 门禁 |
| **Orchestrate** | 过程留档（任务关闭、评审、调用） | `docs/tasks/` + `docs/harness/reviews/` + `docs/harness/invokes/by-task/`（S2 永不覆写） |

### hat 帽制（角色执行能力分级）

| hat | 能力 |
|-----|------|
| `00` | delegate-only（只下发，不能直接执行） |
| `10` / `20` / `30` / `40` | execute（按帽执行，含日志、含限制） |

### P0 门禁 = 不被提示词绕过的"硬判定"

> README §Host usage 原话：「Gates / 门禁：Skills 覆盖不了，必须走 CLI `verify`」。

kit 的门禁判定走**进程内机械逻辑**，不依赖宿主是否执行了 hook。退出码 2 直接阻断管道，不靠"模型是否听话"。

---

## 与行业方案的关系

| 工具 | 它做什么 | kit 与它的关系 |
|------|---------|---------------|
| **Ruler**（4.40 分） | 单一规范源 → 32 个 agent 原生配置位 | **互补**：Ruler 只做注入不做门禁，kit 补门禁 + 过程轨 |
| **GitHub spec-kit**（4.35 分） | 规范驱动开发、模板四层优先级、过程产物入仓 | **同源**：kit 的 S2 过程域与 spec-kit 范式同构 |
| **Claude Code**（3.90 分） | 门禁语义（退出码 2 / `permissionDecision: deny`） | **对齐**：kit 门禁退出码语义与之完全一致 |
| **Cursor**（3.40 分） | 四层配置优先级（Enterprise > Team > Project > User） | **借鉴**：kit 2.0 宿主适配表将参考其分层模型 |
| **AWS Kiro**（2.55 分） | 规格驱动 + 迁移治理范式 | **借鉴其迁移治理范式**（不是产品形态） |

> 五家标杆中**无任何一家**同时提供「**门禁 + 过程轨留档 + 角色分帽**」的等价物。

---

## 路线图

### 1.x MVP（**DONE · 1.11.0**）

| Feature | 含义 | 状态 |
|---------|------|------|
| **F1** | S2 过程域真源统一 | ✅ 1.11.0 |
| **F2** | P0 门禁语义对齐（exit 2 / failClosed） | ✅ 1.11.0 |
| **F3** | 旧产品线迁移文档面（EOS/deprecate 待人闸） | ✅ 文档 · T1 待 `HG-EOS-DATE` |
| **F4** | `.coding-kit` 写根 + legacy 只读 | ✅ 1.11.0 |
| **F5** | 版本钉方案 B（ontology/discipline/README） | ✅ 1.11.0 |

### 1.x 收口（**DONE · 1.12.0** · 待人 publish）

| 项 | 含义 | 状态 |
|----|------|------|
| C1 | EOS **提案**日历（deprecate 仅人 · `HG-EOS-DATE` pending） | ✅ 文档 |
| C2/C3 | 全量测稳 + dogfood | ✅ |
| O1–O3 | 本体论浅落地（测/投影/口径对齐 · 无新 CLI） | ✅ |
| P6-prep | 宿主落点声明清单 | ✅ prep |
| D1/D2 | releases 短记 + 本路线图回填 | ✅ |

### 下一版（2.0 · 规划）

详见 [`docs/roadmap/PLAN_post_1.11_zh.md`](../../docs/roadmap/PLAN_post_1.11_zh.md)：

- **2.0.0**：F6 宿主适配表（DSH = 首个宿主）· 须独立 SPEC 签收

> 演进纪律：**2.0 引入适配表之前，1.x 内部一致性须先完成**——已于 **1.11.0（MVP）+ 1.12.0（收口）** 达成；跨宿主不得把分裂真值源复制到 N 个宿主。

---

## 落盘目录约定

kit 的新落盘目录（经方案 B 裁决）：

| 路径 | 语义 |
|------|------|
| `.coding-kit/` | kit 主数据根（规范覆盖 + 迁移 + 事件 + 备份） |
| `.dsh/coding-kit/` | DSH 宿主场景（与 `.coding-kit` 语义等价） |
| `.dsh/skills/` / `$HOME/.dsh/skills/` | Skill 落点 |
| `docs/tasks/` + `docs/harness/reviews/` + `docs/harness/invokes/by-task/` | **S2 过程域，永不覆写** |
| `.cyning-harness/`（任意位置） | **legacy 探测标记**——不再作为新落盘目标，仅只读降级 + 提示 `upgrade` |

---

## 链接

- 📦 [npm: dsh-coding-kit](https://www.npmjs.com/package/dsh-coding-kit)
- 📖 完整架构评审见 `delivery/`（5 份主文档 + 调研报告）
- 🛠 [AGENTS.md 规范](https://agents.md) · [Agent Skills 规范](https://github.com/agentskills/agentskills)
- 📝 [RELEASING.md](RELEASING.md) · [CHANGELOG.md](CHANGELOG.md) · [SPEC.md](SPEC.md)

---

**MIT 开源 · 零云 · 一条 `npx` 入门 · 与 `AGENTS.md` 友好**
