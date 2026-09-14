# invoke · 30 · 2-4-gate-strength-w3-output-rel（实现留痕）

> **hat**：30 实现棒 · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w3_output_rel.md`
> **前置核对**：GATE_VERIFY PASS（HG-TASK-DRAFT / HG-AUDIT-R1 双 approved · R1 指针审查文提示级行号漂移以现值为准）。

## 1. 实现（SPEC 03 §5.1 方案 A · D-24-OUTPUT-REL-EXIT）

`src/cli-shared.ts` 新增统一出口三件套：

- `relativizeOutputString(base, s)`：整串仓内绝对路径 → `toRel`；长文案内嵌 `base/` 前缀 → 剥前缀得相对形；残余裸 base → `'.'`。词法判据不绑 existsSync（READY dry-run dest 尚不存在亦相对化 · F-W3-04 判据细化）；嵌入替换加**路径边界 lookaround**（前导/后随非路径字符或串端）——否则 `../../var/...` 相对形文本包含 base 子串会被误改（`test/cli-flags.test.ts` 既有断言钉死该反向形态）。
- `relativizeOutputValue`：深遍历仅改字符串值（键名不动 · 契约「键集只增不改」）。
- `printJson(base, payload, indent=2)`：`--json` 唯一 stdout 出口；`indent=0` 保 refresh-ide-blocks 单行 JSON 契约。

出口收敛：全部 26 处 stdout `console.log(JSON.stringify(...))` 改经 `printJson`（cli.ts ×9 · cli-status ×3 · cli-task-extra · cli-lifecycle ×3 · cli-pins · cli-assets · cli-host ×6 · cli-skills · cli-refresh-ide-blocks · cli-graph · cli-sync-prompts · cli-wiki export）；写盘 JSON（manifest / HGM snapshot / sync index / graph export 文件等）不在出口面，一律不动。close 人类输出 `moved:`/`dest:`/`done_snapshot · path:` 与 blocker「目标已存在」、host validate 人类 `file:` 行经 `toRel(process.cwd(), …)` 同口径补齐；`CLOSE: PASS · <slug>` 冻结文案不动。

## 2. 红→绿留证（V2 清单四处 · 绝对入参 · /tmp fixture）

修复前（HEAD d70e1bd git worktree 实测）→ 修复后（工作区）：

| 面 | 修复前 | 修复后 |
|----|--------|--------|
| `task lint --json#file` | `/private/tmp/w3-fixture/docs/tasks/active/task_rel_demo_v1.md` | `docs/tasks/active/task_rel_demo_v1.md` |
| `verify`/`gate-check --json#task` | 绝对原值 | `docs/tasks/active/task_rel_demo_v1.md` |
| `close --json#dest`（READY + PASS）· `done_snapshot.path` | `/private/tmp/.../docs/tasks/done/...` | `docs/tasks/done/task_rel_demo_v1.md` |
| close 人类 `moved:`/`dest:`/`done_snapshot · path:` | 绝对 | 相对（`CLOSE: PASS · rel_demo` 不动） |

另发现并同出口修复 `host validate --json#file` 同型泄漏（绝对 → `assets/ide/host-adapt/examples/mvp-hosts.yaml`）。

## 3. 机械断言组（SPEC 03 §5.2）

`test/cli-json-no-abs-path.test.ts` 21 测：19 个 `--json` 命令面（verify --task/--spec/裸/缺文件、gate-check、status、timeline、task lint、task close READY/PASS/BLOCKED/人类面、lint-wiki-delta、refresh-ide-blocks、graph axioms、wiki export、用法错信封、pins、assets、lifecycle、discipline、skills、host validate）· 绝对路径入参 · stdout 整体 `JSON.parse` + 仓根前缀（realpath+词法双形态）grep 为空；**负向自证 4 例**（整串值 / 内嵌文案 / 裸仓根 / 非 JSON 注入 → 断言真红抛 `泄漏仓根绝对前缀`/`非 JSON`）；键集钉死 6 组（verify 9 键 / gate-check 5 键 / status 13 键 / close READY=PASS 6 键 / BLOCKED 5 键 / 错误信封 3 键）。

## 4. TEST-LOCK 联改（grep 留证）

- `test/cli-task-close-done-snapshot.test.ts` dry-run READY 逐字期望：abs dest → `docs/tasks/done/task_snap_ok_v1.md`（标题同步改注 2.4-W3 口径）。
- `test/cli-flags.test.ts` 两例（verify/gate-check PASS）：初版实现把 `toRel` 相对形 `../../../../../var/...` 误剥（base 子串无边界匹配）→ 实现侧加路径边界守卫修复，**旧测零改动**通过（反向证明不误改相对形）。
- 全量基线：`npm test` 571 测 · 570 pass · 0 fail · 1 skipped（既有门控 skip）。
