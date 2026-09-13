# 验收档 · 2.2.1 · 验收报告四项修复（patch）

> **包**：`spec-wave@2.2.1`（**published**）  
> **状态**：**CLOSED** · 发布归维护者（人已执行 · Agent 2026-09-12 核验落表 · RELEASING ⑨）  
> **task**：[`../tasks/done/task_2_2_1_patch.md`](../tasks/done/task_2_2_1_patch.md)（CLOSE: PASS）  
> **验收报告**：`.workbuddy/output/验收报告-SpecWave-2.2.0.md`（PASS-with-issues · 内部资料 · 已 `.gitignore` 不入 git；本档为对账口径落盘）  
> **属**：2.2.0 验收后 patch（无独立 SPEC 夹 · 主线归档见 [`ACCEPTANCE_2_2_closed_loop_start_2_2_0_zh.md`](./ACCEPTANCE_2_2_closed_loop_start_2_2_0_zh.md)）

---

## 修复对账（验收报告 §4 → 2.2.1 落地）

| 报告 # | 级别 | 问题 | 2.2.1 处置 | 状态 |
|--------|------|------|-----------|------|
| #1 | **P0** | C1 被符号链接绕过，可读仓外任意文件（verify / gate-check / audit / `--spec` 四调用点） | `resolveTaskPath`（`src/cli-shared.ts` 单点收口）词法归卡之上叠加 **realpath 归卡**：仓内 symlink 指 target 之外一律拒止（exit 1 · 含迁移指引 · 不留读痕）；双侧 realpath 避免 macOS `/tmp`→`/private/tmp` 误拒；悬空 symlink 保持「未找到」语义；仓内 symlink 指仓内、target 内绝对路径存量 CI 用法放行不破 | **FIXED** |
| #2 | **P1** | `pins fix` 静默部分修复：exit 0 自称全修却留坏值（同文件多钉面互相覆盖） | `src/cli-pins.ts` 写盘前**按文件聚合 plan**：同文件多钉面（pin-11/12 场景）基于累计内容依序替换、一次写盘、只备份一次；单次 `pins fix --yes` 即收敛；S2 硬拒写 / dry-run / `.bak` 备份 / unfixable 语义全部保持 | **FIXED** |
| #3 | **P2** | `GLOSSARY.md` 未进 npm tarball，已打包 README 双语 4 处相对链接死链 | `package.json#files` 加 `GLOSSARY.md`（一行） | **FIXED** |
| #6 | **P2** | `.workbuddy/` 未被 gitignore（公开仓 · `git add -A` 误推风险 · 报告 §5） | `.gitignore` 加 `.workbuddy/`（一行） | **FIXED** |

> feat 提交：`d77b707`（fix(2.2.1): symlink realpath containment + pins fix per-file aggregation）· bump 提交：`c828e5e`（chore(release): bump to 2.2.1）。

---

## 产品验收（发布溯源）

| # | 条款 | 状态 |
|---|------|------|
| T1 | `npm view spec-wave version` / `dist-tags.latest` → `2.2.1` | **PASS** |
| T2 | tag `v2.2.1` ↔ bump commit `c828e5e` · `git show v2.2.1:package.json` → `name=spec-wave` · `version=2.2.1` | **PASS** |
| T3 | origin/main = `6bdf3ad`（task close 归档）· tag 已推远端（`refs/tags/v2.2.1`） | **PASS** |
| T4 | `node bin/specgate.js pins check` → **12/12 PASS · exit 0**（pin-10 tag 钉随 `v2.2.1` 落位转绿） | **PASS** |
| T5 | `npm test` → **464/464 · exit 0**（含 tag-gated 设计红转绿：release-tag-identity / pins pin-10） | **PASS** |
| T6 | `npm run typecheck` → **0 错 · exit 0** | **PASS** |
| T7 | 测试基线 **459 → 464**（symlink 负向：四调用点穿透拒止 + 悬空「未找到」+ 仓内放行回归；同文件双钉面一次收敛：`test/cli-security-closure.test.ts` · `test/pins-consistency.test.ts` B11） | **PASS** |

### registry 核验（Agent · 2026-09-12）

```text
npm view spec-wave version          → 2.2.1
npm view spec-wave dist-tags.latest → 2.2.1
git rev-parse v2.2.1^{commit}       → c828e5ed11585c0131d6dc05dcbfbe04d5f86e80
git ls-remote origin main           → 6bdf3ad6ea4ac517b9559a6ab5b5e3ff5e1c79d7
```

---

## 归 2.3 清单（验收报告残留 + 机制债）

**其余 8 P2**（验收报告 §4 未入 2.2.1 者）：

1. #4 · 根 README 双语未更新到 7 宿主（多宿主表补 copilot/codex/windsurf 三行）
2. #5 · C3 未覆盖 `--json` 与错误信息（`target` 与错误文案统一走 `toRel` · 补 `--json` 断言）
3. #7 · pin-08 弱钉抓不到 `docs/spec/README.md` 版本漂移（改严提取：须含版本且落在状态单元格）
4. #8 · `CHANGELOG` / `MIGRATION` / `AGENTS` 三处版本面未纳入钉（纯数据新增钉面）
5. #9 · quickstart 第 3 步暗含 git 前提未提示（补「确保项目已 `git init`」）
6. #10 · GLOSSARY「four gates」未分层（task / SPEC / 发版三层说明）
7. #11 · GLOSSARY「每帽对应一个 prompt 文件」对 `50` 不成立（弱化措辞或补条目）
8. #12 · C7 dest 白名单零测试覆盖（补接受 + 拒写两条断言）

**2 P3**：

1. #13 · ACCEPTANCE 台账快照过期类失准（origin/main 行）——并入债 2 机制化
2. #14 · pin-01 不可独立证伪 · pin-04/06/07/10/11/12 缺失配测试 fixture

**机制债**：

1. **叙事行语义盲区**（2.2.0 债 2 · 本档及 c3fe3e0 先例仍属手工回填）：「待发版 ↔ 已 published」叙事行不在钉面内；候选 2.3 机制化（发布状态钉面或叙事行 lint）
2. `pins fix` 遗留 `.bak` 备份靠人工清理（2.2.0 债 3；是否自动清理另议）

---

## 人 checklist（已完成）

1. [x] 工作树已 commit（feat `d77b707` · bump `c828e5e` · CHANGELOG · 钉点 12/12 · 四门绿）  
2. [x] `git tag v2.2.1`（annotated · 禁 `-f`）+ push main（`6bdf3ad`）+ push tag  
3. [x] `npm publish`（`spec-wave@2.2.1` · registry `latest=2.2.1`）  
4. [x] 探针 PASS（registry · tag↔package.json · 远端 main/tag）  
5. [x] 回填 ACCEPTANCE / RELEASING / README 双语 / CHANGELOG / spec 索引为已 published（Agent 代核 ⑨）

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | feat `d77b707` 四项修复落地 · 测试 459 → 464 |
| 2026-09-12 | bump `2.2.1`（`c828e5e`）· 钉点 12/12 · task close（`6bdf3ad`） |
| 2026-09-12 | **CLOSED** · 人 publish `spec-wave@2.2.1`（tag `v2.2.1` ↔ `c828e5e` · origin/main `6bdf3ad`）· Agent 代核 ⑨ 落表 |
