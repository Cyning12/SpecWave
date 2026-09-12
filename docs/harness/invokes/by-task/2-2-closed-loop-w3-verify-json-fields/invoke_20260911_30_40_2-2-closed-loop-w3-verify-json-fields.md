# invoke · 30-execute-code + 40-self-check · W3 实现闭环（verify --json observability fields）

> **hat_id**：`30-execute-code` + `40-self-check`（同 Agent 闭环） · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w3-verify-json-fields`  
> **帽条文**：`assets/harness/prompts/30-execute-code.md` · `40-self-check.md`

## 闸扫描（GATE_VERIFY · 首输出 · 读 task 人工闸表非 invoke 字面）

| human_gate_id | task表status | 用户/invoke声称 | 一致？ | blocks_30 | 30可开工？ |
|---------------|--------------|-----------------|--------|-----------|------------|
| HG-SPEC-SIGNOFF | approved | approved | Y | — | — |
| HG-NEXT-PLAN | approved | approved | Y | — | — |
| HG-TASK-DRAFT | approved | approved | Y | Y(20,30) | — |
| HG-AUDIT-R1 | approved | approved | Y | Y(30) | ✅ |

- reviews：`task_2_2_closed_loop_w3_verify_json_fields_audit_R1_20260911.md` 存在且 R1 pass（零阻塞）· 是
- pre-30 invoke：required ∩ {10,20,00} = {10,20,00} 三件齐全 · 是
- 机械辅助：`npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w3_verify_json_fields.md` → **VERIFY: PASS（exit 0）**

## 动作

1. 读 task 全文 + 蓝本 SPEC 02 §W3 / 06 §W3（A-2.2-06）+ 安全设计 §7.2（delivery/安全设计.md:997/1002 字段语义：source=package/override · injectedFiles 为提示词供应链 T-03 取证基线 · traceId 单次 CLI 调用标识）+ 事实卡 §11（禁称「JSON 可观测性完整」· 本波不解除）+ 帽条文 30/40。
2. **test_strategy=required 先红**：先写 `test/cli-verify-observability.test.ts`（5 测：PASS/BLOCKED 双态四字段 + exitCode=进程退出码 + 键集 diff 级钉死 + 旧字段回归 + traceId 运行级 + --spec 模式）→ 红（四字段缺失 · traceId 两次运行均 undefined）→ 再实现。
3. 实现（契约只增不改）：
   - 新模块 `src/inject-collect.ts`（cordis-free）：M1 注入收集逻辑自 `index.ts` 收口（resolveReadRoot / listMarkdownFiles / includeForProfile / 24k 截断 · 逐字节搬迁），供 CLI 面复用 —— cordis/dsh-tools 为 devDependencies，CLI 不得经 index.ts 传递依赖。
   - `src/index.ts`：改 import + 再导出 `loadMarkdownBundle`（插件面契约不变 · assets.test.ts 原路径导入仍绿）。
   - `src/cli.ts`：`VERIFY_BLOCKED_EXIT_CODE=2` 唯一常量（exitCode 同源纪律 R3 · JSON 字段与 fail() 共用 · 9 处 fail('',2) 全部改引常量 · gate-check/audit/close 等其他命令不动）；`collectVerifyObservability()`（traceId=`verify-<ts36>-<4B hex>` 进程内生成 · 零依赖零云 · 不接外部遥测；source/injectedFiles 复用 loadMarkdownBundle 默认档 l1+l2）；task/spec 两模式 emitJson 同口径补四字段，位置在既有字段之后、条件字段（waived/wiki_lint/skipped）之前。
4. 40 自检：验收 7 条逐条自证（命令真实跑 · 输出贴 task 自检结论）→ 回填 task 验收勾选 + 自检结论 + KPI + 经验（wiki_delta=none 作答）。

## 自证摘录（完整输出见 task 自检结论与交付汇报）

- PASS 态：`node bin/specgate.js verify --target . --task <本 task> --json`（本地构建产物 · npx 发布版 2.1.3 尚无本波代码）→ **exit 0** · traceId=`verify-mtxt8gzf-7e0d98c7` · exitCode=**0**=进程退出码 · source=`package` · injectedFiles=**13** 个（全相对路径）· command/verdict/blocked/target/task 回归不变
- BLOCKED 态（临时消费者仓 fixture · 缺 R<n> 审查文）：**BLOCKED_PROC_EXIT=2** · JSON exitCode=**2**=进程退出码 · verdict=BLOCKED · 四字段仍在（PASS_PROC_EXIT=0 对照）
- traceId 运行级：两次运行取值不同（测试断言）
- 四门：typecheck 0 错 · `npm test` **444/444**（439 基线 + 5 新增）· build ✓ · test:lib 4/4；lint-wiki-delta PASS（scanned 54 · missing 0）
- 事实卡 §11 自查：diff grep「可观测性完整 / observability complete」**0 命中**；事实卡本体不动（解除归发布后维护者）
- 提交：`da66325`（`feat(2.2-W3): verify --json observability fields` · 精确 add 5 文件：src/cli.ts · src/index.ts · src/inject-collect.ts · test/cli-verify-observability.test.ts · CHANGELOG.md · 无 git add -A · 未裹挟 D0）

## 停点

40 自检全绿 → task close（`--yes` 成功打印 CLOSE: PASS 才算关账）。wiki_delta=none（JSON 契约增量落 CHANGELOG Unreleased · 无可晋升 coding_wiki 增量 · 与 task 元信息 note 一致）。

## 已知边界（留痕 · 非阻塞）

- `--json` 的 `target` 字段维持现状（W2 留痕 · 契约只增不改只允许新增字段）。
- `audit --json` / 审计落盘不做（C6 · 3.0 非范围）；traceId 不接外部遥测（零云纪律 · 进程内时间戳+随机）。
- 下游若按字段全集严格校验将感知新增四字段（task residual_risks 已登记 · 属只增契约允许面 · CHANGELOG 已明示）。
