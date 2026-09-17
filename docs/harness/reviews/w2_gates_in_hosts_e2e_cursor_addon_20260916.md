# W2 · 门禁入住宿主 e2e 补件（cursor-agent 第二真实宿主 · 验收 #1 补齐 · 2026-09-16）

> **状态**：`evidence-final` · **验收 #1 真实宿主 2/2 达标**（件① claude §B · 件② cursor §D）
> **性质**：补件（S2 只增不覆写）· 主文 [`w2_gates_in_hosts_e2e_20260916.md`](./w2_gates_in_hosts_e2e_20260916.md)（§B claude 全链 + §A shell-hook + §E 双路 + C/D 当时环境红登记）不改一字 · 本文落 §D 补齐全链
> **背景**：主文落盘时 cursor-agent 认证缺席（F-W2-07 环境红）· 2026-09-16 维护者完成 `agent login`（cyning12@gmail.com · 全局 per-user 认证）· 00 放行补齐棒 · 30 执行
> **脚本**：`node --experimental-strip-types scripts/e2e-w2-host-gates.mts`（§D 已由探测扩为全链 · 与 §B claude 同构 · 可重跑复核）

---

## 1. 结论

| 件 | 宿主 | 结果 |
|----|------|------|
| ① | claude 2.1.181（PreToolUse hook） | **PASS**（主文 §3 全链在案） |
| ② | **cursor-agent 2026.05.24-dda726e**（beforeShellExecution hook） | **PASS**（本文 §2 全链） |

**验收 #1 = 2/2 达标**（≥2 真实宿主硬条兑现 · 宿主内门禁真实阻断脏提交 + 放行净提交双场景全证）。gemini 0.60.0 认证缺席登记沿用主文 §5（F-W2-07 · 不伪造 · 不影响达标判定 · 认证补齐后可同法补第三件）。

## 2. §D cursor 全链证据（2026-09-16 重跑实录摘录）

**认证路径**：维护者 `agent login`（账号 cyning12@gmail.com · cursor-agent 全局 per-user 认证态）· 脚本探测 `cursor-agent -p 'Reply with exactly: OK' --force --trust` → 应答 `OK` exit 0。

**物化**（`host apply --tools cursor --yes` → `.cursor/hooks.json` 逐字摘录）：

```json
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [
      { "command": "npx spec-wave hook-guard --trigger pre-commit" },
      { "command": "npx spec-wave hook-guard --trigger pre-archive" }
    ]
  }
}
```

**脏提交演示（须被拒）**：temp git 仓置 reviews 缺口脏条件 → cursor-agent 无头驱动真实发起 `git add -A && git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>" -m "e2e-demo"` → **beforeShellExecution hook 真实触发** → 阻断全链原文：

```
hook-guard: 命中 pre-commit（git add -A && git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.c…）→ 跑门禁: npx spec-wave verify --target .
verify: 仓级 reviews 全量扫描（双路径 docs/harness/reviews + reviews/ · 2.3-W4 FULL-reviews）
done tasks: 1 · active tasks: 0
reviews 缺口（failClosed · 存量过渡豁免走 docs/harness/legacy-gate-exempt.yaml …）:
  - docs/tasks/done/task_9_9_fake.md · missing R<n> review
VERIFY: BLOCKED · 仓级 reviews 缺口 1
hook-guard: 门禁红（exit 2）· 阻断 pre-commit
```

判定锚：`git log` 无 `e2e-demo`（commit 未落库）· **阻断路径为真 exit 2**（cursor 语义：exit 2 = deny · 非 2 默认 fail-open —— hook-guard 门禁红精确 exit 2 · fail-open 注记留痕 F-W2-06 校准位）= **脏拒 PASS**。

**净提交演示（须放行）**：移除脏条件后同指令驱动 → commit 落库（`git log` 见 `e2e-demo` · Model: Composer）= **净放 PASS**。

## 3. 重跑合计（2026-09-16 本棒）

```
A shell-hook e2e: PASS
B claude e2e: PASS
C gemini e2e: ENV-BLOCKED（认证缺席 · F-W2-07 登记）
D cursor e2e: PASS
E acme --file 双路: PASS
```

## 4. 留痕

- cursor hooks 功能较新（Cursor 1.7 beta 起源）· 本件证明当前 cursor-agent 2026.05.24 仓级 `.cursor/hooks.json` beforeShellExecution 真实生效（F-W2-06 校准点转正 · 无文档-行为偏差）。
- 环境/版本漂移 → 重跑脚本即复测（F-W2-07 通道沿用）。
- e2e 脚本不入 npm test 默认面（E3 耗时预算）· 机械回归锁常驻 npm test（`w2-shell-hook` / `w2-host-verify` / `w2-hooks-materialize` / `w2-b5-merge` / `w2-catalog` / `w2-hook-guard`）。

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-16 | 30 棒补齐 · cursor-agent 认证就位后 §D 扩全链 · 验收 #1 真实宿主 2/2 达标 |
