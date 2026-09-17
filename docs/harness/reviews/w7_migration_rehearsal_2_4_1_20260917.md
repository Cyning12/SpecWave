# W7 · 迁移演练记录 · 真实 v2.4.1 仓（适配表 schema v1 → v2 · 2.4.2 → 3.0.0）

> **任务**：`docs/tasks/active/task_3_0_w7_closeout_external.md` S7.6 · 验收 #2 · F-W7-01/05
> **日期**：2026-09-17 · **执行**：30 执行帽
> **演练形态**：`git worktree add` 挂 **真实 tag `v2.4.1`**（非 mock）· worktree commit **`c89f92d`**（`fix(2.4.1): 验收报告 NEW-1/2/3/9 修复 + bump`）
> **被测码**：当前 main（含 3.0 W1 schema v2 实现 · 版本钉仍 `package.json#version=2.4.2`；3.0.0 bump 归 S7.10）
> **交叉锁**：本记录 compat 项 = S7.10 发版探针第 1 项「旧格式适配表在新版零改动可用」（同一判据 · 不得两套）

## 0. 演练基线

```bash
git worktree add /tmp/dsh-ck-w7-rehearsal-v241 v2.4.1
# Preparing worktree (detached HEAD c89f92d)
git -C /tmp/dsh-ck-w7-rehearsal-v241 rev-parse HEAD
# c89f92d7c0464fa80ad5a5afe70d2f29fe233edf
```

v2.4.1 版适配表 `assets/ide/host-adapt/examples/mvp-hosts.yaml`：`version: "1"` · **无 `schema_version`**（v1 旧扁平语义）· 13 宿主行。

## ① 旧格式适配表零改动可用（红线 · 硬约束 4）

### ①a `host validate --file`（v2.4.1 v1 表）

```bash
node bin/specgate.js host validate --file /tmp/dsh-ck-w7-rehearsal-v241/assets/ide/host-adapt/examples/mvp-hosts.yaml
```

```text
file: assets/ide/host-adapt/examples/mvp-hosts.yaml
HOST VALIDATE: PASS
exit=0
```

### ①b `host apply --dry-run`（v1 表 · planned writes）

```bash
mkdir -p /tmp/dsh-ck-w7-apply
node bin/specgate.js host apply --tools dsh,cursor --target /tmp/dsh-ck-w7-apply --file <v2.4.1 table> --dry-run
```

```text
…（planned writes 列出 dsh/cursor skills/commands 落点）
removed (0):
  (无)
HOST APPLY: PASS
exit=0
```

**结论**：v1 旧格式表（无 `schema_version`）**零改动**通过 validate + apply；未回退硬编码默认（内建 command_sets 目录桥接 = 2.4.2 常量现值）。

## ② 新能力可选启用（schema v2）

最小 v2 表（`/tmp/dsh-ck-w7-v2-table.yaml`）：表首 `schema_version: 2` + 根级 `command_sets`（core/expanded/forbidden）+ `defaults.surfaces.verify` + 每行 `extends: defaults` + `surfaces.hooks`（cursor `config-hook` / dsh `none`）。

### ②a `host validate --file`（v2 表）

```bash
node bin/specgate.js host validate --file /tmp/dsh-ck-w7-v2-table.yaml
```

```text
file: dsh-ck-w7-v2-table.yaml（仓外文件 · outside_repo · 不打印绝对路径）
HOST VALIDATE: PASS
exit=0
```

### ②b `host apply --dry-run`（v2 表）

```bash
node bin/specgate.js host apply --tools cursor,dsh --target /tmp/dsh-ck-w7-apply --file /tmp/dsh-ck-w7-v2-table.yaml --dry-run
```

```text
HOST APPLY: dry-run
  .cursor/hooks.json                     ← cursor config-hook 物化
degraded-none (1):
  dsh · hooks: degraded-none（L1+L2 · 宿主无 hook 机制 · 门禁仅 CLI 侧）
HOST APPLY: PASS
exit=0
```

**结论**：新能力（`schema_version:2` + `command_sets` + `defaults`/`extends` + `surfaces.hooks`）**可选启用**且 `host validate` 通过；无机制宿主显式降级 L1+L2（与 A3 边界一致）。

## ③ 发现与裁决

- **未发现 schema 兼容洞** ⇒ **F-W7-01 未触发**（无需回退 W1 补 back-compat）。
- v1 → v2 为「**零改动默认路径 + 可选新能力**」：旧表语义等价映射入新内部模型（内建 command_sets 桥接 + hooks 缺省 `{mechanism: none}`）。
- 发版探针（S7.10）第 1 项与本记录同判据：旧格式适配表在 3.0.0 版零改动可用 —— 不过则不得发版（F-W7-05）。

## 附：演练环境清理

`git worktree remove /tmp/dsh-ck-w7-rehearsal-v241`（演练后清理 · 不留工作树）。
