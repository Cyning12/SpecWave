# W7 · 发版探针记录 · 3.0.0（release probe）

> **任务**：`docs/tasks/active/task_3_0_w7_closeout_external.md` S7.10 · 验收 #9 · 硬约束 4（compat 首项 = 发版红线）
> **日期**：2026-09-17 · **执行**：30 执行帽 · **版本**：`package.json#version = 3.0.0`（bump 后 · **待发版**）
> **发布边界**：**tag / push / publish / deprecate 四动作全仅人** —— 本记录不代打 tag、不 publish。
> **诚实红线**：`pin-10`（git tag `v3.0.0`）**打 tag 前为设计红** · `release-tag-identity` 同因设计红；**待维护者 tag `v3.0.0` 后须转绿（pins 17/17）**。**不得伪造 tag/绿。**

## 探针六项

### ① ★「旧格式适配表在新版零改动可用」（向后兼容红线 · 硬约束 4）

```bash
node bin/specgate.js host validate --file test/fixtures/host-adapt/mvp-hosts_2_4_2.yaml   # v1 旧扁平表（2.4.2 逐字拷贝）
```

```text
file: test/fixtures/host-adapt/mvp-hosts_2_4_2.yaml
HOST VALIDATE: PASS
exit=0
```

**PASS**（与 S7.6 真实 v2.4.1 仓演练**同一判据** · 见 [`w7_migration_rehearsal_2_4_1_20260917.md`](w7_migration_rehearsal_2_4_1_20260917.md)）。不过 → **不得发版**（未触发）。

### ② 四门全绿（与 prepublishOnly 同四门）

```text
npm run typecheck  → 0 错
npm test           → 859 tests / 164 suites · 856 pass / 2 fail（tag-gated 设计红）/ 1 skip（859 = 856 + 2 设计红 + 1 skip）· 设计红 = pins-consistency A 组 · release-tag-identity（打 tag 后转绿）
npm run build      → 0 错
npm run test:lib   → 6/6
```

### ③ npm pack --dry-run + 包内容卫生

```text
PACK HYGIENE: PASS · 275 files · 无 *.bak/*~/.DS_Store · 含 GLOSSARY.md / MIGRATION.md
npm pack --dry-run --json → filename=spec-wave-3.0.0.tgz · files=275
```

无 `test/` 泄漏 · 仅 `package.json#files` 白名单入包。

### ④ 17 钉面（`pins check`）

```text
pins check · 真值源 package.json#version = 3.0.0 · 落点 17
[ok] pin-01..pin-09, pin-11..pin-17（16 绿）
[missing] pin-10 git · expected="v3.0.0" · git tag 缺失 · git 操作仅人（F-A1-05）
PINS: BLOCKED · 1 偏差 / 17 落点（exit 2）
```

**16/17** —— pin-10 为**设计红**（tag 仅人）；**打 tag `v3.0.0` 后须 17/17**。

### ⑤ host validate + apply（内置表 v2）

```bash
node bin/specgate.js host validate --file assets/ide/host-adapt/examples/mvp-hosts.yaml          # 内置 v2 表
node bin/specgate.js host apply --tools cursor --target <tmp> --dry-run --file <same>
```

```text
HOST VALIDATE: PASS
HOST APPLY: PASS   （planned writes 正常）
```

### ⑥ 依赖零新增

```text
dependencies = {"js-yaml":"^4.1.0"}   （与 2.4.2 基线一致 · 零新增）
```

## 结论

- **compat 首项 PASS**（向后兼容红线未破）· 其余 5 项 PASS（pins 16/17 = pin-10 设计红 · **非回归**）。
- **可进入人 tag/publish 段**：tag `v3.0.0` → push（原子推或 tag 先行）→ `npm publish`（仅人）→ ⑨ 回填。
- 打 tag 后复跑：`pins check` 17/17 · `npm test` 全绿（2 设计红转绿）。
