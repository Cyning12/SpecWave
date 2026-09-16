# W2 · 门禁入住宿主 e2e 验收文（gates in hosts e2e · 2026-09-16）

> **状态**：`evidence` · **真实宿主硬条计数 1/2（claude PASS · gemini/cursor 环境红）· 验收 #1（≥2 真实宿主）未达 · 已按诚实红线 STOP 回报 00 裁决**（不得伪造 · 不得以 fixture 冒充真实宿主证据 · 不擅自降级硬条）
> **执行**：30 棒（W2 阶段四）· task [`docs/tasks/active/task_3_0_w2_gates_in_hosts.md`](../tasks/active/task_3_0_w2_gates_in_hosts.md) S3.7 · 验收 #1/#5/#10 · F-W2-06/07
> **脚本（可重跑）**：`node --experimental-strip-types scripts/e2e-w2-host-gates.mts`（仓根 · 不入 npm test 默认面 · E3 耗时预算 · temp HOME/temp 仓全隔离 · 零全局状态污染 · 跑完自清理）
> **关联 commit**：`99893c1`（shell-hook 物化 + 验收 #10/#5 npm test 面）· 本文与脚本同 commit 落库

---

## 1. 结论总表

| # | 项 | 结果 | 计数口径 |
|---|----|------|----------|
| A | shell-hook 物化 · temp git 仓真实 git commit（acme-bot · 验收 #10） | **PASS**（脏拒 + 净放） | 证明 shell-hook 族物化闭环 · **不计入** ≥2 真实宿主线（S3.7 口径） |
| B | **claude 真实宿主 e2e**（PreToolUse hook 真实触发 · 验收 #1 件①） | **PASS**（脏提交被宿主内门禁拒绝 · 净提交放行） | **真实宿主 ×1** |
| C | gemini 真实宿主 e2e（BeforeTool hook · 件②候选） | **ENV-BLOCKED**（认证缺席 · F-W2-07 登记） | 件数贡献 0（不伪造） |
| D | cursor-agent 备援探测（加分非硬条） | **ENV-BLOCKED**（认证缺席 · 登记） | 备援不可用 |
| E | acme-bot `--file` 路径双路（验收 #5 路① · 硬约束 12 闭环） | **PASS** | 双路齐（路②用户目录合并见阶段三 npm test `w2-b5-merge`） |

**验收 #1 判定**：真实宿主 = **1/2**（硬条 ≥2 不放行 · S3.7「件数不足则验收 #1 不放行（本波硬条）」）· 阻塞条件 = gemini/cursor 认证皆缺席（§5）· 待 00 裁决（补认证后一条命令重跑即可补齐第二件）。

## 2. 环境版本串登记（20 审 A3）

| 件 | 版本串（本次实测输出） |
|----|------------------------|
| OS | darwin arm64 · 25.6.0（macOS · Apple Silicon） |
| node | v24.15.0 |
| npm | 11.12.1 |
| git | git version 2.53.0 |
| **claude** | **2.1.181 (Claude Code)**（已认证 · `claude -p` 无头探测 OK） |
| **gemini** | **0.60.0**（`@google/gemini-cli` npm temp prefix 安装 · **未认证**） |
| cursor-agent | 2026.05.24-dda726e（**未认证**） |
| spec-wave | 2.4.2（本仓 build · e2e 经 node_modules/.bin 本地 shim 解析 `npx spec-wave` 至本仓 `bin/specgate.js` · 非 registry 包） |

**A3 数据点登记**：20 审在案「gemini CLI 已由 Antigravity CLI 取代的官方横幅」——本次运行 gemini 0.60.0 在 auth 拦截前未输出该横幅（认证检查先于横幅呈现）· 留 F-W2-06/07 复核 · 不影响本波族定稿（gemini 机制族 config-hook 取证依据为官方 hooks 文档 · 若后续 Antigravity 迁移改变 hooks 面 → F-W2-06 通道校准）。

## 3. 件① · claude 真实宿主 e2e 全链证据（PASS）

物化（`host apply --tools claude --yes` → `.claude/settings.json` 摘录）：

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "npx spec-wave hook-guard --trigger pre-commit" }] },
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "npx spec-wave hook-guard --trigger pre-archive" }] }
    ]
  }
}
```

**脏提交演示（须被拒）**：temp git 仓置入 done task 引 spec 无审查文（reviews 缺口）· claude 无头驱动（`claude -p '<commit 指令>' --dangerously-skip-permissions --max-turns 6`）尝试 `git add -A && git commit -m "e2e-demo"` → **PreToolUse hook 真实触发** → 阻断全链输出（claude 原样转述）：

```
PreToolUse:Bash hook error: [npx spec-wave hook-guard --trigger pre-commit]: hook-guard: 命中 pre-commit（git add -A && git commit -m "e2e-demo"）→ 跑门禁: npx spec-wave verify --target .
verify: 仓级 reviews 全量扫描（双路径 docs/harness/reviews + reviews/ · 2.3-W4 FULL-reviews）
done tasks: 1 · active tasks: 0
reviews 缺口（failClosed · 存量过渡豁免走 docs/harness/legacy-gate-exempt.yaml …）:
  - docs/tasks/done/task_9_9_fake.md · missing R<n> review
VERIFY: BLOCKED · 仓级 reviews 缺口 1
hook-guard: 门禁红（exit 2）· 阻断 pre-commit
```

判定锚：`git log` 无 `e2e-demo`（commit 未落库）· 输出含 hook 阻断链 = **脏拒 PASS**。

**净提交演示（须放行）**：移除脏文件后同指令驱动 → claude 回报 `Done. Commit 44a488f e2e-demo created (16 files, 476 insertions); working tree clean.` · `git log` 见 `e2e-demo` = **净放 PASS**。

## 4. shell-hook 族 e2e 全链证据（验收 #10 · PASS）

物化（`host apply --tools acme-bot --yes` → written: ACME.md + `.git/hooks/pre-commit`）· 物化脚本：

```sh
#!/bin/sh
# spec-wave-managed: pre-commit hook（3.0 W2 · 门禁随包物化 · 勿手改 · host apply/update 幂等管理）
exec npx spec-wave hook-guard --trigger pre-commit
```

- **脏场景**：真实 `git commit` → git 层触发 hook → `VERIFY: BLOCKED · 仓级 reviews 缺口 1` → `hook-guard: 门禁红（exit 2）· 阻断 pre-commit` → commit exit 1 未落库。
- **净场景**：`VERIFY: PASS（裸 verify · 仓级 reviews 扫描）` → commit 落库（`clean-e2e`）。
- npm test 机械锁同案常驻：`test/w2-shell-hook.test.ts`（5/5 · 含 F-W2-11 用户 hook conflict 不覆写 · 非 git target 零落点 · 篡改逐字红 · git 不可用显式 skip）。

## 5. F-W2-07 环境红对照登记（件②/备援不可得 · 不伪造）

| 宿主 | 探测输出（对照实验原文摘录） | 定性 |
|------|------------------------------|------|
| gemini 0.60.0 | `Please set an Auth method in your ~/.gemini/settings.json or specify one of the following environment variables before running: GEMINI_API_KEY, GOOGLE_GENAI_USE_VERTEXAI, GOOGLE_GENAI_USE_GCA`（exit 41） | **环境红**（认证三通道皆缺席 · 另查无 `gcloud` · 无 `~/.gemini`）· 非产品红 · 不计测试红 · 不得冒充 |
| cursor-agent 2026.05.24 | `Error: Authentication required. Please run 'agent login' first, or set CURSOR_API_KEY environment variable.`（exit 1） | **环境红**（备援不可用 · 登记） |

**补齐路径（任一即可重跑补第二件）**：`GEMINI_API_KEY=<key>` 注入后重跑 §C（脚本同命令）· 或 `cursor-agent` 完成 `agent login` 后扩 §D 为全链（脚本已留 C/D 双段结构）。

## 6. acme-bot 双路 e2e（验收 #5 · 硬约束 12 闭环）

- **路②（用户目录合并 · 阶段三已锁）**：`test/w2-b5-merge.test.ts` 铁律①正案（无 `--file` 合并加载 → apply 物化 → verify 绿 → 篡改红 · 内置 13 零污染）。
- **路①（`--file` 整表替换 · 本波补）**：`apply --file acme-hosts-file.yaml → written ACME.md → verify PASS → 篡改 mismatch exit 2`（npm test `w2-b5-merge` 新增案 + 本脚本 §E 实录双证）。
- 双路证明 = **接入面不依赖改包发版**（acme-bot 非内置 13 · 表与资产皆随用户侧分发）。

## 7. 已知边界与留痕

- **pre-archive 真实触发演示**（task S3.7 加分项）：本波以 fixture + host verify 断言兜底（物化条目存在且未被篡改 · `test/w2-host-verify.test.ts` 红③）· 未做宿主内 task close 真实触发（环境允许归后续）。
- **cursor hooks fail-open 口径**：物化模板精确 exit 2（S3.1 注记）· cursor 宿主未实测（认证缺席）· F-W2-06 校准位留痕。
- **gemini 族定稿风险**：若认证补齐后实测 BeforeTool 行为与文档不符 → F-W2-06 族内校准（声明随校准翻转 · 数据修正非 schema 变更）。
- e2e 全量原始日志由脚本 stdout 重现（本文摘录关键段 · 脚本可重跑复核）。

## 8. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-16 | 30 棒 W2 阶段四 · A/B/E PASS + C/D ENV-BLOCKED 全证据落盘 · 验收 #1 真实宿主 1/2 未达硬条 · STOP 回报 00 裁决 |
