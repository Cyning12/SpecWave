# 04 · init 非交互加固（2.1.2）

> **状态**：`signed` · 隶属 `2_1_2-rename-closeout`  
> **对应缺陷**：审查 **P2-1**（PTY 下 `isTTY===true` 时无 `--tools` 会阻塞 stdin；`--yes` 未短路）  
> **test_strategy**：`required`

---

## 1. 问题陈述

2.1.1 声明：「非 TTY 无 `--tools` → exit 1」。实测：

| 环境 | 无 `--tools` | 结果 |
|------|--------------|------|
| 真非 TTY（`</dev/null`） | exit 1 | ✅ |
| PTY（tmux / 部分 CI / agent）+ 无显式 tools | 打印询问后 **阻塞** | ❌ |
| 同上 + **`--yes`** | 仍可能走「交互」分支 | ❌（意图已非交互） |

根因：仅用 `process.stdin.isTTY` 判交互，未把 `--yes` 视为非交互意图。

---

## 2. 行为冻结（B-INIT-YES）

| 条件 | 行为 |
|------|------|
| 存在 `--yes` **且** 无 `--tools` | **exit 1** · 提示传 `--tools` · **禁止**读 stdin |
| 无 `--yes` · `isTTY` · 无 `--tools` | 可询问（保持 2.1.1 交互体验） |
| 无 `--yes` · 非 TTY · 无 `--tools` | **exit 1**（保持） |
| 有 `--tools`（含 `all`/`none`/列表） | 按既有语义执行 |

语义一句话：**`--yes` ⇒ 非交互**；非交互缺 tools ⇒ 快速失败，永不挂起。

---

## 3. 测试要求

至少新增/调整：

1. `init --yes`（无 `--tools`）→ exit 1 · 有限时（不得依赖人工 EOF）。  
2. 可选：mock `isTTY=true` + `--yes` 无 tools → 仍 exit 1（防回归 PTY 挂起）。  

不得用「加长 timeout 等挂起」当绿。

---

## 4. 与 2.1.1 SPEC 关系

补强 [`2_1_1-host-tools-ux/02_init_interactive_v1.md`](../2_1_1-host-tools-ux/02_init_interactive_v1.md) 的 CI 行；**不**重开 2.1.1 人闸。行为差记入 2.1.2 CHANGELOG。

---

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
