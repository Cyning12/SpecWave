# ACCEPTANCE · 2.4.1 patch（验收报告 NEW-1/2/3/9 修复）台账

> **版本**：`spec-wave@2.4.1`（**待发版** · bump 已落 2026-09-14 · **tag+push 维护者已授权 00 代跑 · publish 仅人**）
> **task**：[`docs/tasks/done/task_2_4_1_patch.md`](../tasks/done/task_2_4_1_patch.md)（slug `2-4-1-patch` · 无独立 SPEC 夹 · 属 2_4-gate-strength 验收后 patch · 已关账 CLOSED）
> **依据**：`.workbuddy/output/验收报告-SpecWave-2.4.0.md` §3（NEW-1/2/3/9）· §2 N9 · §6.1「建议纳入 2.4.1」（判 PASS-with-issues · §7.3 不开 2.5.0）· R1 审查文 `docs/harness/reviews/task_2_4_1_patch_audit_R1_20260914.md`（PASS · 三裁决照其定稿执行）

## 修复清单（§6.1 建议 2.4.1 四组 · 全落地）

| 项 | 级别 | 修复 | 机械证据 |
|----|------|------|----------|
| NEW-1 | P1 | `REVIEW_NEG_RE` 语义放宽：`不.{0,3}通过` / `未.{0,3}通过` / `no\s*pass` / `reject`（i · R1 §3-1 定稿 · 报告原文 `\S` 盖不住「不 通过」空格形态）· 否定先于通过判定顺序不动 · 退回/内容阻塞判据不回退 | 负向 fixture B「不予通过」/ D「不 通过」/ E「NO PASS」+ Reject + task close 同口径（`test/cli-w4-gate-wiring.test.ts`）修复前全真红（exit 0 误绿复现报告探针表）修复后全 exit 2；A/C/F 对照零回退 |
| NEW-2 | P1 | `printJson` 基参统一取命令 target：cli.ts task lint / task close×3 / exit-1 信封 :1299（R1 §3-3 增量纳入）+ cli-host.ts host validate×3 / emitHostFail（emitU01Degraded 透传）；`relativizeOutputValue` 统一出口 realpath 双侧归一（词法 + realpath 双基 · 悬空回落最近现存祖先）；`host validate` 补 `--target`（additive · 缺省 cwd · 接口面残留定稿落地） | `grep -n 'printJson(process.cwd()' src/cli.ts src/cli-host.ts` → **0 命中**；对偶测试 ×6（cwd≠target / symlink 入参 / realpath 双侧 / host validate --target / task lint 异目录 / exit-1 信封）修复前全真红（dest/file/message 绝对前缀泄漏复现报告 §3 代理实验）修复后全绿；现 21 测零回退 |
| NEW-3 | P2 | pin-16 扫描面纳入 HTML `<a href="…">`（单/双引号同口径 · 与 inline/refstyle 同一归一/判定管线）；yaml pin-16 semantics 扩为三形态（D-23-W2-CHECK-FORM 数据声明一致） | 负向 fixture `<a href="FOO.md">` 修复前 exit 0（复现报告对照实验）修复后 exit 2 指 `README.md:行号 -> FOO.md` · 入 files 转绿 · scheme/纯锚点跳过不回退 |
| NEW-9 / N9 | P2 | pin-08 状态格 `hitA` 裸子串 → 边界正则 `(?<![0-9A-Za-z._-])X\.Y\.Z(?![0-9A-Za-z._-])`（R1 §3-2 定稿 · 报告原建议 `(?<![0-9.])` 挡不住 v 前缀 · 本为其修正版）；hitB 不动 · suspects 沿用；yaml pin-08 semantics 同步边界口径 | 三负向修复前真红（9.9.9 同格保留 ``tag `vX.Y.Z` `` / `` `vX.Y.Z` `` / `` `X.Y.Z-beta` `` 旧码全 exit 0 顶包）修复后全 exit 2；正向 `` `X.Y.Z` published `` + 加长版本号（X.Y.Z.N / X.Y.Zrc1）两侧钉死；**现行 `docs/spec/README.md` 全量索引行 `pins check` 回归零误伤**（F-P2-08） |

## 存量波及抽验（NEW-1 · 非静默放过）

- 否定正则放宽后命中面扩大 → `evalReviewConclusion` 直评现行 **76 份**审查文（`docs/harness/reviews/*.md` 全量 · 修复前/后双跑对比）：pass/fail 名单**逐字一致**（57 pass / 19 fail · 19 份 fail 为修复前既有的既红面 · 零新增误伤 · **无需豁免**）。
- R1 审查文模拟结论（51 份 PASS 基数误伤 0/51）经 30 真实复测坐实；本 task R1 审查文自身过新闸（dogfood）。
- 已知残余（R1 §3-1 裁决留痕）：`.` 不跨行，「不\n通过」换行形态仍漏网（攻击者须主动换行 · 与 NEW-11 广义词表面同属 3.0 语义化议题）。

## 门禁基线（本棒实测 · 2026-09-14）

| 门禁 | 结果 |
|------|------|
| `npm run typecheck` | 0 错 |
| `npm test` | **596 tests / 593 pass / 0 意外红 / 1 门控 skip**（基线 582 → 596 · 仅 2 条 tag-gated 设计红：release-tag-identity + pins A 组 pin-10 · 打 tag 后复跑须全绿） |
| `npm run build` / `test:lib` | exit 0 |
| `pins check` | **16/17** · 唯一偏差 = pin-10 git tag `v2.4.1` 缺失（**设计红** · tag 后复跑须 17/17 · 口径同 2.3.1） |
| `assets verify` | **110/110**（yaml semantics 双变更触发 manifest rebuild · ~4 变更 = pins fix 钉面 + yaml · F-P2-13 收口） |
| 裸 `verify` / `verify --task` | PASS（GATE_VERIFY 闸扫描表全 approved · invoke 三件套齐） |

## 已知残余（主动登记 · 归 3.0）

- 验收报告 §6.2 归 3.0 清单全部未动：NEW-4（pin-17 伪表行）· NEW-5（S1·N=20 非语义闸）· NEW-6/7/8/12（机械清扫类）· NEW-10（exempt 数据后门）· NEW-11（广义词表面）· N5（assets rebuild 追认设计性残留）。
- pin-10 tag-gated 设计红待打 `v2.4.1` 后复跑转绿（须 17/17）。
- NEW-1 换行形态「不\n通过」漏网（见上 · R1 留痕口径）。

## 发布边界

- 本棒未执行 `git tag` / `git push` / `npm publish` / `npm deprecate`（**tag+push 维护者 2026-09-14 已授权 00 代跑 · publish 仅人**）· 未用 `--force` / `git add -A`。
- RELEASING 人 checklist 2.4.1 节已备（含授权注记 · 打 tag 后复跑 pins 17/17 + npm test 全绿 · pack 清单无 .bak 探针）。
