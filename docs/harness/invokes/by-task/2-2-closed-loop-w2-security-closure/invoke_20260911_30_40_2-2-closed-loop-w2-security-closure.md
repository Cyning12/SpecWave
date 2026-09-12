# invoke · 30-execute-code + 40-self-check · W2 实现闭环（security closure）

> **hat_id**：`30-execute-code` + `40-self-check`（同 Agent 闭环） · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w2-security-closure`  
> **帽条文**：`assets/harness/prompts/30-execute-code.md` · `40-self-check.md` · `FRAGMENT_30_gate_verify_v1_zh.md`

## 闸扫描（GATE_VERIFY · 首输出 · 读 task 人工闸表非 invoke 字面）

| human_gate_id | task表status | 用户/invoke声称 | 一致？ | blocks_30 | 30可开工？ |
|---------------|--------------|-----------------|--------|-----------|------------|
| HG-SPEC-SIGNOFF | approved | approved | Y | — | — |
| HG-NEXT-PLAN | approved | approved | Y | — | — |
| HG-TASK-DRAFT | approved | approved | Y | Y(20,30) | — |
| HG-AUDIT-R1 | approved | approved | Y | Y(30) | ✅ |

- reviews：`task_2_2_closed_loop_w2_security_closure_audit_R1_20260911.md` 存在且 R1 pass（零阻塞）· 是
- pre-30 invoke：required ∩ {10,20,00} = {10,20,00} 三件齐全 · 是
- 机械辅助：`npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w2_security_closure.md` → **VERIFY: PASS（exit 0）**

## 动作

1. 读 task 全文 + 蓝本 SPEC 02 §W2 / 06 §W2 + 审查文 R1 + 帽条文 30/40 + FRAGMENT gate_verify；盘点 `resolveTaskPath` 全调用面（cli.ts 4 点 + cli-checks/cli-status/cli-timeline 共用方）。
2. **第 0 步簿记**：纯过程档单独提交 `95bea17`（47 文件 · SPEC/reviews/invokes/task archive · 精确 add · 未裹挟 src/test/assets；`.workbuddy/` 非 harness S2 过程档保持未跟踪）。
3. **test_strategy=required 先红**：先写 `test/cli-security-closure.test.ts`（18 测 6 组）→ 红（findGitRoot 不存在 / 拒止未实现）→ 再实现。
4. 实现（`src/cli-shared.ts`）：`findGitRoot`（T-02 向上探测 .git 唯一实现源）；`resolveTaskPath` 单点收口（target 外绝对路径 + `..` 逃逸读前 fail(1) + 迁移指引 · target 内绝对路径放行）；`resolveTarget` 增 `requireGitRoot` 选项；`toRel` 口径收口为永不落绝对路径（`.` / `..` 相对形）。
5. 接线：`src/cli.ts` verify（task+spec 双模）/audit/gate-check 三命令 `requireGitRoot: true`；`目标:` 打印相对化 7 处（cli.ts ×3 + manifest 未接入行 + cli-task-extra ×2 + cli-graph ×1 + cli-refresh-ide-blocks ×1）；`src/index.ts` userOverrideRoot 改复用 findGitRoot（截止语义逐字节不变）。
6. 旧测影响面消解（K7）：8 份 gate 面 fixture `withTemp` seed `.git`（消费者仓仿真 · 用例意图零改动）：gate-semantics / cli-verify-review / cli-verify-invoke-hats / cli-verify-with-wiki-lint / cli-verify-spec / cli-p0 / cli-flags / cli-g1g7。
7. 40 自检：验收 10 条逐条自证（命令真实跑 · 输出贴 task 自检结论）→ 回填 task 验收勾选 + 自检结论 + KPI + 经验（wiki_delta=none 作答）。

## 自证摘录（完整输出见 task 自检结论与交付汇报）

- `verify --target . --task /etc/hosts`（构建产物 `node bin/specgate.js`）→ **exit 1** `错误: --task/--spec 拒绝 target 之外的路径` + 迁移指引；内容泄漏扫描 `127.0.0.1|localhost` 计数 **0**（不留读痕）
- `--task ../../etc/passwd`（`..` 逃逸）→ **exit 1** 同口径；`--spec <target 外>` → exit 1
- `verify/audit --target $(mktemp -d)`（非 git 仓）→ **exit 1** `错误: --target 不在任何 git 仓内（向上未找到 .git）` + git init 指引（F-W2-02）
- stdout 口径：`gate-check/audit/check --target .` 输出 `目标: .` · grep `$(pwd)` 命中 **0**；`--target .` vs `--target <abs>` 输出逐字节稳定（测试断言）
- 四门：typecheck 0 错 · `npm test` **439/439**（421 基线 + 18 新增）· build ✓ · test:lib 4/4；lint-wiki-delta PASS（scanned 54 · missing 0）
- 提交：簿记 `95bea17` + 本波 `1e49052`（`feat(2.2-W2): block path traversal + relative target output` · 精确 add 15 文件 · 无 git add -A · 未裹挟 D0）

## 停点

40 自检全绿 → task close（`--yes` 成功打印 CLOSE: PASS 才算关账）。wiki_delta=none（安全行为变更落 CHANGELOG · 无可晋升 coding_wiki 增量 · 与 task 元信息 note 一致）。

## 已知边界（留痕 · 非阻塞）

- `verify/gate-check --json` 的 `target` 字段仍为绝对路径（JSON 契约只增不改 · W3 非范围 · C3 范围为人读 `目标:` 行）。
- 符号链接逃逸（仓内 symlink 指向仓外）未封堵：本波为词法归卡（task 范围明文）· realpath 档归后续波次。
- `--target` git-root 校验仅接线 verify/audit/gate-check gate 面；init/host/refresh-ide-blocks 等非 git 合法面不校验（refresh-ide-blocks git=none 备份回滚为明示特性）。
