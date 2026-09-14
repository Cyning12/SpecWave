# invoke · 30 · 2-4-gate-strength-w4-assets-observability（实现留痕）

> **hat**：30 实现棒 · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w4_assets_observability.md`
> **前置核对**：GATE_VERIFY PASS（HG-TASK-DRAFT / HG-AUDIT-R1 双 approved · R1 指针审查文承接总审 PASS）。

## 1. 实现（SPEC 04 §5 · D-24-W4-WARN-ONLY）

全部改动在 `src/cli-assets.ts`（排除常量 `isExcludedBasename` 单一来源未动）：

- **N2 · verify 排除项 warning**：`collectAssets` 重构为 `scanAssets`（同一趟遍历同出 `entries` + `excluded` 两面 · 生成侧 `collectAssets` 委托取 entries 维持不打哈希）；`sha256.manifest` 为结构性排除（SPEC §3①）不入 warning 清单，`.bak`/`*~`/`.DS_Store` 入清单。人类面输出 `WARN: 排除项 N 个（不参与哈希校验 · D-23-W5-EXCLUDE）: <前 5 条> [… 共 M 个]`（F-W4-01 截断 · `WARN:` 独立前缀 F-W4-02）；`--json` 面新增 `excluded: string[]` 字段（全量 · 键集只增）。exit code 0/1/2 语义未动。
- **N5 · rebuild 追认警示**：`REBUILD_WARN` 常量单一文案——「WARN: 本操作将当前资产状态追认为真值——若资产曾被篡改，篡改将随本次 rebuild 被合法化；防投毒依赖 provenance（未启用）」；dry-run / `--yes` / 幂等空转三路统一在 diff 汇总行后输出；「provenance（未启用）」口径与 `docs/guides/provenance_oidc_trusted_publishing_guide_v1_zh.md:3` 自述一致。rebuild 无 `--json` 面（既有 CLI 面 · 未扩）。

## 2. 红→绿留证（/tmp 靶场 · git stash 旧码复现）

| 面 | 修复前（stash 旧码） | 修复后 |
|----|----------------------|--------|
| 靶场放 `leak.bak` → verify | exit 0 · `PASS · 1/1` · **无任何排除项提示**（§3.C 结构性失明复现） | exit 0 · `WARN: 排除项 1 个…: prompts/leak.bak` · PASS 不变 |
| `--json` | 无 `excluded` 键 | `excluded: ["prompts/leak.bak"]` · status=pass |
| 删除 `.bak` 后 | — | warning 消失 · `excluded: []` |
| rebuild dry-run / --yes | 无追认语义提示 | 两路均输出 REBUILD_WARN（追认 · provenance（未启用）） |

## 3. 机械断言组（SPEC 04 §7 · test_strategy=required）

`test/cli-w5-assets-integrity.test.ts` 新增 describe「2.4-W4」4 用例：

1. N2 构造（验收①）：`.bak` → exit 0 + WARN 点名相对路径 + PASS 行共存 + `--json#excluded` 精确等值 + 删除后消失（正负两路）。
2. F-W4-01 截断：7 个 `.bak` → WARN 行仅前 5 条 + `… 共 7 个` · `--json` 全量 7 条。
3. F-W4-02/F-W4-04 不掩负向：排除项 + 真实篡改并存 → 仍 exit 2 + `[mismatch]` 与 WARN 同显 · `--json status=blocked` 且 `excluded` 在场。
4. N5 快照断言（验收②）：dry-run 与 `--yes` 两路整句快照 + 「追认」「provenance（未启用）」关键词断言 + `--yes` 后 verify exit 0 收敛。

## 4. TEST-LOCK 影响面（grep 留证）

grep `assets verify|sha256.manifest|excluded` 命中文逐处核对：

- `test/cli-w5-assets-integrity.test.ts`：2.3-W5 既有 9 用例**零断言改动**全绿（F-W5-06 排除项用例仅断言 exit 0 · rebuild 各例正则均不被新增 WARN 行破坏）。
- `test/cli-json-no-abs-path.test.ts:418`：`assets verify --json` 新键 `excluded` 值为 posix 相对路径（无仓根绝对前缀）· 断言口径不受影响 · 未联改。
- `test/lib-smoke/cli-lib-smoke.test.ts` S5（bin 面 dogfood）：仓内 assets/ 无排除项（实测 110/110 无 WARN）· PASS 断言不受影响 · 未联改。

## 5. 未做（禁区）

未升排除项为 exit 2（D-24-W4-WARN-ONLY 冻结）· 未加 rebuild 二次确认旗标（20 审默认警示即够）· 未动 `.github/workflows/`（CI 判据零新增）· 未收窄对外口径（归 W5）· 未启用 provenance（仅人）· 未 `git add -A` · 未 tag/push/publish/bump。
