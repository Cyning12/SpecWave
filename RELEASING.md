# RELEASING · SpecWave（`spec-wave`）发版硬步骤 Checklist

> **制度化来源**：DEF-001 教训 —— 曾从未提交工作树 publish，导致发布物与仓库真值漂移、无法溯源。  
> 本清单把「publish 前 commit + tag」固化为**硬步骤**：任何一步未完成即停止，不得跳步。  
> **职责分工（2026-09-09 起）**：**维护 Agent 可执行 ①–⑦ 与 bump/tag**；**⑧ `npm publish` 仅人**；⑨ 可由 Agent 在人 publish 后核验（或人自核）。  
> **仍仅人**：`npm publish` · `npm deprecate`（另须 `HG-EOS-DATE` / `HG-DEPRECATE-HARNESS`）· 云/账号 2FA 操作。  
> **包名**：现行 **`spec-wave`**（产品名 **SpecWave**；曾用名 `dsh-coding-kit`；曾拟裸 `specgate` 遭 E403 相似拒）。

## 最近一次发版

| 项 | 值 |
|----|-----|
| **工作树 / registry `latest`** | **`spec-wave@2.2.0`**（**bump 已落 · 待发版** · 2026-09-11 · tag `v2.2.0` 待人打 · publish 归维护者；registry `latest` 仍为 **2.1.3**，publish 后回填本行） |
| **前一 latest** | **`spec-wave@2.1.2`**（改名收口） |
| **旧包名** | **`dsh-coding-kit`** · **已 deprecate**（文案 → `spec-wave`） |
| **git（史实 · 2.1.1）** | tag **`v2.1.1`** · 改名前身份；**`v2.1.2` / `v2.1.3`** 为 SpecWave 身份可溯源点（**禁止** `git tag -f`） |
| **主题（已发 · 2.1.3）** | README/断言收尾 · 发布溯源测（tag↔package.json） |
| **主题（已发 · 2.1.2）** | SpecWave 改名收口 |
| **前一发版** | **`2.1.2`** · **`2.1.1`** · **`2.1.0`** |
| **更早旧包** | `@cyning/harness` **已 deprecate**（文案指 **`spec-wave`**） |
| **1.x** | **CLOSED** |
| **下一主线** | **2.1.x+ / 2.2**（workspaces / onboard 等观察项；另闸） |
| **验收（2.1.2）** | [`docs/roadmap/ACCEPTANCE_2_1_2_rename_closeout_2_1_2_zh.md`](docs/roadmap/ACCEPTANCE_2_1_2_rename_closeout_2_1_2_zh.md) · **CLOSED** |
| **验收（2.1.1 UX）** | [`docs/roadmap/ACCEPTANCE_2_1_1_host_tools_ux_2_1_1_zh.md`](docs/roadmap/ACCEPTANCE_2_1_1_host_tools_ux_2_1_1_zh.md) |
| **规划 / SPEC（2.1.2）** | [`docs/roadmap/PLAN_2_1_2_rename_closeout_v1_zh.md`](docs/roadmap/PLAN_2_1_2_rename_closeout_v1_zh.md) · [`docs/spec/2_1_2-rename-closeout/`](docs/spec/2_1_2-rename-closeout/) |

### 前一发版（2.0.x–2.1.1）

1. `2.0.0` / `2.0.1` / `2.0.2` 已 npm 发版（人 · 2026-09-10）  
2. `2.1.0` 多平台技能+编排（registry 曾为 `latest=2.1.0`）  
3. `2.1.1` host tools UX（checklist ⑨ 已核 · registry **仍** `latest=2.1.1` 直至 `2.1.2` publish）

> 下方通用硬步骤供勾选；下一发版另开版本号。

## 硬步骤（按序执行 · 全部满足后方可 publish）

- [ ] **① 工作树干净且所有改动已提交**：`git status --porcelain` 为空；拟发布内容全部进入 git 历史。**禁止从未提交工作树 publish**（DEF-001 教训：工作树残留 = 发布物不可溯源）。（Agent 可做）
- [ ] **② 质量闸门全绿**：`npm run typecheck && npm test && npm run build && npm run test:lib` 依次全绿（与 `prepublishOnly` 同一四门；任一红即停止，先修再发）。（Agent 可做）
- [ ] **③ CHANGELOG 版本节已归拢**：`CHANGELOG.md` 的 `## [Unreleased]` 内容已归入 `## [X.Y.Z] - YYYY-MM-DD` 版本节（日期 + 版本号齐全），无残留 Unreleased 条目遗漏。（Agent 可做）
- [ ] **④ 版本钉（pins）已同步（F5 方案 B）**：新版本号已同步全部**现行钉点** —— `assets/ontology.yaml#product_semver`、`assets/harness/discipline-coverage.yaml#as_of_package_version`、README 双文件中的 `spec-wave@x.y.z`、以及含版本断言的测试。闸测：`test/version-pins-f5.test.ts`（及既有 ontology / discipline 分面测）。**仓根 `SPEC.md` 为 archived epic，不要求与包版本对齐，禁止再把其标题当作现行契约。**（Agent 可做）
- [ ] **⑤ npm version + tag（Agent 默认可做）**：`npm version <patch|minor|major>`（或等价：改 `package.json` + 钉点同步后落 version commit + `vX.Y.Z` tag）；确认 tag 与 CHANGELOG 版本节一致。**禁止**在钉点未同步时 bump。**本仓另有** `test/release-tag-identity.test.ts`：须先有 `vX.Y.Z` tag 再期望测绿。
- [ ] **⑥ PR 合并 + CI 绿**：发版 PR 已 merge 进 `main` 且 CI 全绿（**CI 未绿禁合**）；`git push` 含 `--follow-tags`（或单独 push tag），远端 main 与 tag 指向发布真值。（Agent 可推送，须用户/环境授权）
- [ ] **⑦ npm pack --dry-run 检查**：`npm pack --dry-run` 逐行核对 tarball 清单 —— 无 `test/` 泄漏、无工作区/私仓文件；仅 `package.json#files` 白名单（`bin` / `lib` / `assets` / `cordis.patch.yml` / `README.md` / `LICENSE`）内的内容入包。（Agent 可做）
- [ ] **⑧ npm publish（仅人）**：`npm publish`（`prepublishOnly` 会自动重跑②四门；⑦已核对清单）。**Agent 不得执行本步。**
- [ ] **⑨ publish 后核验 + 过程档状态更新**：`npm view spec-wave version`（及 `dist-tags`）确认新版本已生效；抽样验证；更新过程档状态为已发布。（人 publish 后 · Agent 可代核）

### 人 checklist · `2.1.3` 发版（**已完成** · 2026-09-11）

1. [x] 确认工作树已 commit（含 bump `2.1.3` · CHANGELOG · 钉点 · 四门绿 · tag `v2.1.3`）  
2. [x] `git push origin main && git push origin v2.1.3`（或等价）  
3. [x] `npm publish`（包名 `spec-wave` · 版本 `2.1.3`）  
4. [x] 探针：`npm view spec-wave version` → `2.1.3`；`git show v2.1.3:package.json` → `name=spec-wave` · `version=2.1.3`  
5. [x] （可选）deprecate 文案钉点 — 人以执行时为准  

### 人 checklist · `2.1.2` 发版（**已完成** · 史实）

> 真值闸：`HG-PUBLISH` / `HG-DEPRECATE-HARNESS` = **approved**（人 · 2026-09-10）。

1. [x] 确认工作树已 commit（含 bump `2.1.2` · CHANGELOG · 钉点 · 四门绿证据）  
2. [x] `git tag v2.1.2 <publish-commit>`（**禁止** `git tag -f`）  
3. [x] `npm publish`（包名 `spec-wave` · 版本 `2.1.2`）  
4. [x] 探针：`git show v2.1.2:package.json` → `name=spec-wave` · `version=2.1.2`；`npm view spec-wave version` → `2.1.2`  
5. [x] `npm deprecate @cyning/harness "…"` 文案改指 **`spec-wave`**（勿再把 `dsh-coding-kit` 当终点）  
6. [x] 签 task 表 **`HG-PUBLISH=approved`** · **`HG-DEPRECATE-HARNESS=approved`**  
7. [x] 回填 ACCEPTANCE / 过程档为已 published（00 代核 ⑨）


## 禁令速查

- **禁止从未提交工作树 publish**（① · DEF-001）。
- **CI 未绿禁合**（⑥ · 合并前 CI 必须全绿）。
- **Agent 禁止 `npm publish`**（⑧ 仅人）。**Agent 允许 `npm version` / tag / 钉点同步**（⑤ · 须先过 ①–④）。
- **Agent 禁止 `npm deprecate`**（另闸 `HG-EOS-DATE`）。
- `npm pack --dry-run` 清单异常（`test/` 泄漏、白名单外文件）→ 停止发版，先修 `files` 白名单或 .npmignore 口径（⑦）。
- **CI 不得自动 `npm publish`**（与 Agent 同禁；registry 凭证仅人侧）。
