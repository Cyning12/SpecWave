# Migration · `@cyning/harness` → `dsh-coding-kit`

> **状态**：文档面就绪（1x-mvp **W3 / F3+F4**）· kit **`1.11.0` 已 npm 发版**（2026-09-09）  
> **包钉**：消费者请钉 `dsh-coding-kit@1.11.0`（与 npm `latest` 一致；本文件不代替 `package.json`）  
> **布局真值（F4 方案 B）**：新落盘根 = **`.coding-kit/`**；**`.cyning-harness/`** = legacy **只读**（探测 / 升级源；**不删除**）  
> **人闸**：`HG-EOS-DATE` 仍 **pending**（阻塞旧包 `npm deprecate`）· kit 本波 **publish 已完成** · **禁止** Agent 执行 `npm deprecate` / 再次擅自 publish

---

## 一句话

换依赖 → `upgrade --yes`（读旧写新）→ 改 CI 字面 →（推荐）刷 IDE 块与 skills。目录目标是 `.coding-kit`，不是继续把 `.cyning-harness` 当新标准。

---

## 最小路径（必做 · 顺序固定）

1. **依赖**：`package.json` 删除 `@cyning/harness`，加入 `dsh-coding-kit`（钉当前文档所述版本）。  
2. **升级**：在仓根执行 `npx dsh-coding-kit upgrade --yes`  
   - **读**：优先 `.coding-kit/manifest.json`，否则 legacy `.cyning-harness/manifest.json`  
   - **写**：一律写入 `.coding-kit/manifest.json`（`version`=包版本，`from_version`=旧号）  
   - **不删** `.cyning-harness/`；S2（`docs/tasks` / `reviews` / `invokes/by-task`）永不覆写  
3. **字面**：CI / 脚本中 `npx @cyning/harness` → `npx dsh-coding-kit`

### 推荐（非最小路径硬依赖）

| 步骤 | 命令 / 动作 |
|------|-------------|
| IDE marker 块刷写 | `npx dsh-coding-kit refresh-ide-blocks`（默认 dry-run）→ 确认后 `--yes` |
| Skills 安装 | `npx dsh-coding-kit skills install`（默认不含 30/40） |
| Starter prompts | `npx dsh-coding-kit sync prompts --yes`（须已有 manifest） |

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

## EOS / deprecate（提案日历 · 待人闸）

> 下列日期为 **提案占位**，**未**经 `HG-EOS-DATE=approved`，**未**执行 `npm deprecate`。  
> 不得对外宣称「旧包已 deprecate」直至维护者实操并更新本表。

| 里程碑 | 提案日（占位） | 状态 |
|--------|----------------|------|
| 公开时间表 + 本文件成文 | 2026-09-09 | **文档面 DONE（W3）** |
| 新注册截止（建议 ≤ EOS） | **TBD** | 待 `HG-EOS-DATE` |
| EOS（End of Support） | **TBD** | 待 `HG-EOS-DATE` |
| `npm deprecate @cyning/harness "…"` | **TBD · 仅人** | 待 `HG-EOS-DATE`（kit `1.11.0` 已发版；deprecate ≠ kit publish） |

### Deprecate 文案草稿（仅人 · 实操时粘贴）

```text
DEPRECATED: use dsh-coding-kit instead. See https://github.com/Cyning12/dsh-coding-kit/blob/main/MIGRATION.md — pin dsh-coding-kit@<published> and run: npx dsh-coding-kit upgrade --yes
```

### 过渡窗规则（成文 · 日历空）

- 过渡期内：旧包仍可安装；挂 deprecate 警告后以 npm 提示为准。  
- 安全修复策略：仅对仍支持的 kit 线发补丁；旧产品线是否补丁 **待 EOS 决议**。  
- 撤销预案：误 deprecate → 维护者按 npm 文档撤销；本仓回滚文案与日历。

### 维护者检查清单（deprecate 前后）

- [ ] `HG-EOS-DATE=approved` 且日历已写入本文件「提案日」列改为「已公布」  
- [ ] deprecate 文案含迁移 URL + kit 版本钉  
- [ ] **人**执行 `npm deprecate`（Agent 禁止）  
- [ ] README「Migrating」节与本文件一致  
- [ ] 未误删消费者 `.cyning-harness/` 数据纪律仍成立

---

## failure_paths（消费者）

| ID | 触发 | 行为 |
|----|------|------|
| M-01 | 只换依赖不跑 upgrade | `check` 可能仍报未接入 / 旧布局；跑 `upgrade --yes` |
| M-02 | 期望 CLI 继续写入 `.cyning-harness` | 自本波起新写在 `.coding-kit`；旧目录保留只读 |
| M-03 | Agent 宣称已 deprecate | 以本文件人闸表为准；未批准则视为文档事故 |

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
