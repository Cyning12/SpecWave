# 05 · Waves 与验收（2.1.2）

> **状态**：`signed` · **CLOSED** · W0–W4 DONE · `2.1.2` published

---

## W0 · 签收

- [x] `HG-NEXT-212=approved`  
- [x] `HG-SPEC-SIGNOFF=approved`（冻 README 表 B-* · 尤其 **B-SEMVER-212** / **B-INIT-YES** / **B-REPORT-SCHEMA**）  
- [x] 拆 W1–W4 task  

## W1 · 身份面 + 迁移文档

- [x] CLI help 首行 + doctor/status 包名  
- [x] 联改 `test/cli-help` · `test/cli-validation`  
- [x] `MIGRATION.md` 终点 SpecWave + deprecate 醒目声明 + 钉点改 `spec-wave@2.1.2`  
- [x] `RELEASING.md` 状态倒挂修正  
- [x] `HG-AUDIT-R1`（00 代签 · 开波）  

## W2 · assets / README / AGENTS

- [x] 审查必清清单（verify.md 矛盾 · POINTER · ONTOLOGY · QUICKREF · prompts · graph templates · `src/index.ts` description）  
- [x] README 双语 DSH 入口 → `spec-wave`  
- [x] `AGENTS.md` local 包名叙事  
- [x] ripgrep 抽检 · 漏改归零（A 类除外）  
- [x] `HG-AUDIT-R1`（00 代签 · 开波）  

## W3 · init `--yes` 非交互

- [x] `--yes` 无 `--tools` → exit 1 · 不阻塞  
- [x] 自动化测（含 isTTY mock 或等价）  
- [x] `HG-AUDIT-R1`（00 代签 · 开波）  

## W4 · bump · tag · 发版

- [x] bump **2.1.2** · 钉点 · CHANGELOG  
- [x] 四门绿  
- [x] `git tag v2.1.2` **于 publish commit**  
- [x] **HG-PUBLISH**（人）· `npm view` = 2.1.2  
- [x] **HG-DEPRECATE-HARNESS**（人）· `@cyning/harness` 文案改指 `spec-wave`  
- [x] ACCEPTANCE 归档 · 更新 `docs/spec/README.md` 状态  
- [x] `HG-AUDIT-R1`（00 代签 · 开波 · **不含** publish）  

---

## 产品验收

| # | 条款 | 来源 |
|---|------|------|
| A1 | `git show v2.1.2:package.json` → `name=spec-wave` · `version=2.1.2` | P0-1 |
| A2 | `npm view spec-wave version` → `2.1.2` | P0-1 |
| A3 | MIGRATION/README 明示 `dsh-coding-kit` deprecated · 直达 `spec-wave@2.1.2` | P0-2 |
| A4 | `@cyning/harness` deprecate 文案含 `spec-wave`（不把废弃中间包当终点） | P0-2 |
| A5 | `npx spec-wave --help` 首行现名；status 无「当前=dsh-coding-kit」矛盾 | P1-1 |
| A6 | 审查 assets 必清清单无同文件新旧矛盾；README DSH 入口为 `spec-wave` | P1-3/4 |
| A7 | `init --yes`（无 `--tools`）exit 1 且不挂起 | P2-1 |
| A8 | 三 bin 仍可用；A 类保留项未误删 | 回归 |

---

## 思考轮（正文摘要）

### R0 · 证据

审查结论：功能可用；改名未达发版完整；推荐 patch **2.1.2** 而非 force-retag。

### R1 · 范围

做：P0×2 · P1 对外 · P2-1。不做：force tag · REPORT_SCHEMA · bin 文件名 · delivery · 新功能。

### R2 · 方案

| 方案 | 说明 | 结论 |
|------|------|------|
| A · force-retag `v2.1.1` | 溯源立刻齐 · 强推伤协作 | **弃选** |
| B · 发 `2.1.2` + 新 tag | 无破坏 · 审查推荐 | **采纳** |
| C · 只改文档不 bump | 对外文案好 · tag/npm 仍裂 | **弃选** |

### R3 · 边界

见 `00` failure_paths；契约类 schema 明确推迟。

### R4 · 可测性

CLI/init = required；迁移 deprecate = 人闸 + 文案抽检；发版 = tag/npm 探针。

### R5 · 签收就绪

本系列 draft 齐；待人冻 B-* 后交 20-spec-audit 或直接 HG-SPEC-SIGNOFF → 00 拆 task。

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
| 2026-09-10 | **signed** · W0 DONE · W1 R1 代签可 30 |
| 2026-09-10 | **CLOSED** · W0–W4 DONE · `2.1.2` published |
