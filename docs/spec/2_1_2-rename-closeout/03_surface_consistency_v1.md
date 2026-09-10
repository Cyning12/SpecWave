# 03 · 对外身份一致性（2.1.2）

> **状态**：`signed` · 隶属 `2_1_2-rename-closeout`  
> **对应缺陷**：审查 **P1-1～P1-4**（CLI 自报名 · RELEASING 倒挂 · assets 残留 · DSH/AGENTS）  
> **test_strategy**：`required`（CLI 断言联改；assets 清单勾选）

---

## 1. CLI 自报名与 status（P1-1）

| 位置 | 现状 | 目标 |
|------|------|------|
| `src/cli.ts` help 首行 | `specgate CLI (v…)` | **`SpecWave CLI (v…)`** 或 `spec-wave CLI (v…)`（冻一种） |
| doctor/status 跨产品线句 | 写「当前 = dsh-coding-kit 2.1.1」却建议 `npx spec-wave` | 当前包 = **`spec-wave ${pkgVersion}`**；建议句保持 `npx spec-wave …` |
| `test/cli-help.test.ts` | 钉 `/specgate CLI \(v/` | 同步新首行 |
| `test/cli-validation.test.ts` | 钉 `/dsh-coding-kit 2\.1\.1/` | 同步新身份 + **2.1.2** |

**纪律**：改文案与改断言同一 PR；禁止半改名全绿。

**推荐冻文案（待签）**：help 首行 = `SpecWave CLI (v${version})`。

---

## 2. 维护者文档（P1-2）

| 文件 | 要求 |
|------|------|
| `RELEASING.md` | 旧包 **已 deprecate**；`spec-wave@2.1.1` **已 published**；现主题推进 **2.1.2**；现名统一 SpecWave |
| CHANGELOG | 2.1.2 节列改名收口项；注明 2.1.1 tag/npm 史实 |

---

## 3. 随包 assets 与仓根（P1-3 / P1-4）

### 必清（审查已点名）

- `assets/ide/commands/claude/kit/verify.md` · `assets/ide/commands/cursor/kit-verify.md`（同文件 description/正文矛盾）  
- `assets/harness/templates/ONTOLOGY_consumer_slice_v1.md`  
- `assets/docs/POINTER_*.md`（审查 4 处）  
- `assets/harness/templates/QUICKREF_v1_zh.md`  
- `assets/harness/prompts/00-orchestrator.md`  
- `assets/graph/templates/README.md` · `99_mermaid_protocol.md`  
- `src/index.ts` · DSH `apply_coding_standards` description  
- `AGENTS.md` local 块 · npm 包名叙事  

### 仓根入口

- `README.md` / `README.zh-CN.md` · DSH `plugin add` → `spec-wave` + deprecate 提示  

### 本版明确不改

- `REPORT_SCHEMA = 'dsh-coding-kit/refresh-ide-blocks-report@1'`（**B-REPORT-SCHEMA**）  
- `bin/specgate.js` 文件名（**B-BIN-FILE**）  
- `delivery/**`（**B-DELIVERY**）  
- A 类保留项（三 bin、CHANGELOG 史实、cordis 过渡名等）

---

## 4. 抽检命令（W2）

实现后维护者/30 应跑一次（示意）：

```text
rg -n "dsh-coding-kit|specgate CLI|SpecGate 最短路径" README.md README.zh-CN.md MIGRATION.md RELEASING.md AGENTS.md assets src --glob '!CHANGELOG.md' --glob '!delivery/**'
```

命中须逐条归类：A 类保留 / 已改 / 漏改（漏改 → FAIL）。

---

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
