# 02 · init 交互选平台（对齐 OpenSpec）（2.1.1）

> **状态**：`draft` · 隶属 `2_1_1-host-tools-ux`  
> **对标**：`openspec init --tools <all|none|list>` · 交互式选工具

---

## 1. CLI 形状（草案）

```text
npx dsh-coding-kit init --preset harness-only
  [--tools all|none|cursor,claude,...]
  [--profile core|expanded]
  [--host-adapt|--no-host-adapt]
  [--yes] [--target PATH]
```

| 旗标 | 含义 |
|------|------|
| `--tools` | 非交互必填之一；或 TTY 询问后的结果 |
| `--profile` | 传给联动的 host apply（默认 core） |
| `--host-adapt` | 强制在 init 后跑 apply（若 tools≠none） |
| `--no-host-adapt` | 只 init 过程根，不物化；**freeze（已钉）**：**不写粘性**（避免「记住了却未物化」） |

**推荐默认（TTY）**：询问「是否物化 IDE/宿主？」→ 多选 cursor / claude / dsh / agents / all / skip(none)。

---

## 2. TTY vs 非 TTY

| 环境 | 无 `--tools` |
|------|----------------|
| TTY | **默认询问**（对齐 OpenSpec 交互 init） |
| 非 TTY / CI | **exit 1** · 提示传 `--tools` |

---

## 3. 与现有 `init` 关系

- 保留 `--preset harness-only` 词表  
- 物化为 **可选第二步**（同进程内调用 apply 逻辑，勿 shell 自调）  
- 双入口纪律不变：插件 `init_coding_kit` ≠ CLI `init`

---

## 4. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
| 2026-09-10 | freeze：`--no-host-adapt` 不 apply 且不写粘性 |
