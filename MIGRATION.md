# Migration · `@cyning/harness` / `dsh-coding-kit` → **SpecWave**（`spec-wave`）

> **⚠️ `dsh-coding-kit` 已 deprecate** —— 请**直接**安装正式包：`npm i spec-wave@2.2.1`（验收后 patch 版；**tag/npm 同 commit 发版**后以 registry `latest` 为准）。**勿再**把废弃中间包当作迁移终点。  
> **现行包**：**`spec-wave@2.2.1`**（正式包名 / 正式 bin；曾用名 `dsh-coding-kit`）  
> **过渡 bin（同入口 · 非终点）**：`specgate` · `dsh-coding-kit`（仍可调用，**不要**再 `npm i dsh-coding-kit` 当终点）  
> **状态**：1.12 收口 **DONE** · kit **`2.0.0` published** · `@cyning/harness` **已 deprecate**（2026-09-10）· **`dsh-coding-kit` 已 deprecate**（文案指向 `spec-wave`）  
> **包钉**：请钉 `spec-wave@2.2.1`（本文件不代替 `package.json`）  
> **布局真值（F4 方案 B）**：新落盘根 = **`.coding-kit/`**；**`.cyning-harness/`** = legacy **只读**（探测 / 升级源；**不删除**）  
> **人闸**：`HG-EOS-DATE` / `HG-PUBLISH` = **approved**（人实操 · 2026-09-10）· **禁止** Agent 执行 `npm deprecate` / `npm publish`  
> **F6 归档**：[`docs/roadmap/ACCEPTANCE_2x_host_adapt_2_0_0_zh.md`](docs/roadmap/ACCEPTANCE_2x_host_adapt_2_0_0_zh.md) · 规划 [`docs/roadmap/PLAN_2x_host_adapt_v1_zh.md`](docs/roadmap/PLAN_2x_host_adapt_v1_zh.md)  
> **改名规划**：[`docs/roadmap/PLAN_rename_specgate_v1_zh.md`](docs/roadmap/PLAN_rename_specgate_v1_zh.md) · 收口 [`docs/roadmap/PLAN_2_1_2_rename_closeout_v1_zh.md`](docs/roadmap/PLAN_2_1_2_rename_closeout_v1_zh.md)

---

## SpecWave 最短路径（现行）

1. **依赖**：`package.json` 将 `dsh-coding-kit`（或 `@cyning/harness`）改为 **`spec-wave`**（钉 `2.2.1`；CHANGELOG 见 `[2.2.1]` 节）。  
2. **升级**：`npx spec-wave upgrade --yes`  
3. **字面**：CI / 脚本 `npx dsh-coding-kit` / `npx @cyning/harness` → **`npx spec-wave`**  
4. **推荐**：`npx spec-wave refresh-ide-blocks --yes`（默认 dry-run；含 B-REFRESH：旧 `npx dsh-coding-kit` / `npx specgate` → `npx spec-wave`）

过渡期：正式 bin **`spec-wave`** 与过渡 bin **`specgate`** / **`dsh-coding-kit`** 同入口；**安装终点始终是 `spec-wave`**，不要再装已 deprecate 的 `dsh-coding-kit`。

---

## 一句话（历史：`@cyning/harness` → kit → SpecWave）

换依赖到 **`spec-wave`** → `upgrade --yes`（读旧写新）→ 改 CI 字面 →（推荐）刷 IDE 块与 skills。目录目标是 `.coding-kit`，不是继续把 `.cyning-harness` 当新标准。

---

## 最小路径（必做 · 顺序固定 · 历史 kit 线）

1. **依赖**：`package.json` 删除 `@cyning/harness` / `dsh-coding-kit`，加入 **`spec-wave`**（钉当前文档所述版本）。  
2. **升级**：在仓根执行 `npx spec-wave upgrade --yes`  
   - **读**：优先 `.coding-kit/manifest.json`，否则 legacy `.cyning-harness/manifest.json`  
   - **写**：一律写入 `.coding-kit/manifest.json`（`version`=包版本，`from_version`=旧号）  
   - **不删** `.cyning-harness/`；S2（`docs/tasks` / `reviews` / `invokes/by-task`）永不覆写  
3. **字面**：CI / 脚本中 `npx @cyning/harness` → `npx spec-wave`（若仍写 `npx dsh-coding-kit`，一并改为 `npx spec-wave`）

### 推荐（非最小路径硬依赖）

| 步骤 | 命令 / 动作 |
|------|-------------|
| IDE marker 块刷写 | `npx spec-wave refresh-ide-blocks`（默认 dry-run）→ 确认后 `--yes` |
| Skills 安装 | `npx spec-wave skills install`（默认不含 30/40） |
| Starter prompts | `npx spec-wave sync prompts --yes`（须已有 manifest） |

备份目录（仅本机回滚）：`.coding-kit/backups/refresh-ide-blocks/`（建议 `.gitignore`）。

---

## 布局对照（F4）

| 路径 | 角色 |
|------|------|
| `.coding-kit/manifest.json` | **现行** manifest（init / upgrade 写入） |
| `.coding-kit/events/` · `graph/snapshot.json` · `invoke_index.json` · `local.json` · `backups/` | **现行** 过程落盘 |
| `.cyning-harness/*` | **legacy 只读**：可读、可作 upgrade 源；**新命令默认不写入** |
| `.coding-kit/` / `.dsh/coding-kit`（规范覆盖） | DSH `apply_coding_standards` / `init_coding_kit` 覆盖根（≠ skill 目录） |

双目录并存时：`check` / `upgrade` 读新优先；stdout 可能提示 legacy 只读。

---

## EOS / deprecate（已公布）

> **`HG-EOS-DATE=approved`**（2026-09-10 · 人实操）· registry 已挂 deprecate 警告。  
> 核验：`npm view @cyning/harness deprecated` · `npm view dsh-coding-kit deprecated`。

| 里程碑 | 公布日 | 状态 |
|--------|--------|------|
| 公开时间表 + 本文件成文 | **2026-09-10** | **已公布** |
| 新注册截止（建议） | **2026-10-10** | **已公布** |
| EOS（End of Support） | **2026-12-31** | **已公布** |
| `npm deprecate @cyning/harness "…"` | **2026-09-10**（人） | **已执行** · 文案曾钉 `dsh-coding-kit@1.12.0`（**待人**改指 `spec-wave` · `HG-DEPRECATE-HARNESS`） |
| `npm deprecate dsh-coding-kit "…"` | **2026-09-10**（人） | **已执行** · 文案指向 `spec-wave` |

### Deprecate 文案（registry · `@cyning/harness` 现行 · 待改）

```text
DEPRECATED: use dsh-coding-kit instead. See https://github.com/Cyning12/SpecWave/blob/main/MIGRATION.md — pin dsh-coding-kit@1.12.0 and run: npx spec-wave upgrade --yes
```

> **链式风险**：上列 harness 文案仍指向已 deprecate 的 `dsh-coding-kit`。**请忽略该钉点**，直接 `npm i spec-wave@2.2.1`。registry 改文案仅人（`HG-DEPRECATE-HARNESS`）。

### 过渡窗规则

- 过渡期内：旧包仍可安装；安装时出现 deprecate 警告（以 npm 提示为准）。  
- **安装终点**：始终 **`spec-wave`**；不要再钉 / 安装 `dsh-coding-kit` 作终点。  
- 安全修复策略：仅对仍支持的 SpecWave（`spec-wave`）线发补丁；旧产品线是否补丁以 EOS（2026-12-31）决议为准。  
- 撤销预案：误 deprecate → `npm deprecate <pkg> ""`；本仓回滚文案与日历。

### 维护者检查清单（deprecate 前后）

- [x] `HG-EOS-DATE=approved` 且日历「已公布」  
- [x] `dsh-coding-kit` deprecate 文案含迁移 URL + 指向 `spec-wave`  
- [ ] `@cyning/harness` deprecate 文案改指 `spec-wave`（**仅人** · `HG-DEPRECATE-HARNESS`）  
- [x] **人**执行 `npm deprecate`（Agent 禁止）  
- [x] README「Migrating」节与本文件一致（发版后回填）  
- [x] 未误删消费者 `.cyning-harness/` 数据纪律仍成立
---

## failure_paths（消费者）

| ID | 触发 | 行为 |
|----|------|------|
| M-01 | 只换依赖不跑 upgrade | `check` 可能仍报未接入 / 旧布局；跑 `upgrade --yes` |
| M-02 | 期望 CLI 继续写入 `.cyning-harness` | 自本波起新写在 `.coding-kit`；旧目录保留只读 |
| M-03 | Agent 宣称 deprecate 状态 | 以本文件人闸表 + `npm view` 为准 |
| M-04 | 按旧文案安装 `dsh-coding-kit` 当终点 | **错误路径** · 改装 `spec-wave` |

---

## 关联

| 路径 | 说明 |
|------|------|
| `docs/spec/1x-mvp/F3_legacy_migration.md` | F3 SPEC |
| `docs/spec/1x-mvp/F4_directory_semantics.md` | F4 方案 B |
| `README.md` · Migrating | 最短三步 + Prompt |
| `RELEASING.md` | 维护者发版（含 deprecate 仅人） |

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-09 | W3 初版：方案 B 布局 + 最小路径 + EOS 提案占位（`HG-EOS-DATE` pending） |
| 2026-09-09 | kit **1.11.0** 已 npm 发版；本文件包钉与状态条对齐 `latest` |
| 2026-09-10 | W2：填入 EOS **提案**日历（announce 2026-09-10 · 新注册截止 2026-10-10 · EOS 2026-12-31）；`HG-EOS-DATE` 仍 pending · **未** deprecate |
| 2026-09-10 | **人**：kit `1.12.0` publish + `@cyning/harness` deprecate；`HG-EOS-DATE` / `HG-PUBLISH` approved；日历改「已公布」 |
| 2026-09-10 | **拟发 `1.12.1`**：docs patch（RELEASING 顺序 + 过程档回填入包）；publish 后消费者可钉 `1.12.1`；deprecate registry 文案仍为 `1.12.0` |
| 2026-09-10 | **`1.12.1` published**（npm `latest`）；1.x CLOSED；下一主线 2.0 F6 规划 |
| 2026-09-10 | **`2.0.0` published**（F6 宿主适配）；归档 `ACCEPTANCE_2x_host_adapt_2_0_0_zh.md`；拟发 `2.0.1` docs patch |
| 2026-09-10 | **`2.1.0` published**（多平台技能+编排）；当时消费者钉 `dsh-coding-kit@2.1.0`（史实；现已 deprecate） |
| 2026-09-10 | **W1 收口**：终点改 SpecWave；`spec-wave` 非过渡 bin；醒目声明 `dsh-coding-kit` deprecated；钉点仅推荐 `spec-wave` |
