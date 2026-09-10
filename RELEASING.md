# RELEASING · dsh-coding-kit 发版硬步骤 Checklist

> **制度化来源**：DEF-001 教训 —— 曾从未提交工作树 publish，导致发布物与仓库真值漂移、无法溯源。  
> 本清单把「publish 前 commit + tag」固化为**硬步骤**：任何一步未完成即停止，不得跳步。  
> **职责分工（2026-09-09 起）**：**维护 Agent 可执行 ①–⑦ 与 bump/tag**；**⑧ `npm publish` 仅人**；⑨ 可由 Agent 在人 publish 后核验（或人自核）。  
> **仍仅人**：`npm publish` · `npm deprecate`（另须 `HG-EOS-DATE`）· 云/账号 2FA 操作。

## 最近一次发版

| 项 | 值 |
|----|-----|
| **npm `latest`** | **`2.0.1`**（registry · 直至人 publish `2.0.2`） |
| **git** | preparing **`2.0.2`** · tag `v2.0.2` 就绪 · **待人 npm publish** |
| **主题** | patch：README 多宿主首屏 + Cursor/Claude 录屏清单（无产品行为变更） |
| **前一发版** | **`2.0.1` published**（2026-09-10 · tag `v2.0.1` · 2.0.0 归档回填） |
| **旧包** | `@cyning/harness` **已 deprecate**（2026-09-10 · registry 文案仍钉 `dsh-coding-kit@1.12.0`） |
| **1.x** | **CLOSED**（见 `docs/roadmap/AUDIT_1x_residual_after_1_12_1_zh.md`） |
| **下一主线** | **2.0.x / 2.1**（更多宿主、workspaces 观察项；另 SPEC） |

### 前一发版（2.0.1）

1. ~~`npm publish`~~ · `latest` → `2.0.1`（人 · 2026-09-10）  
2. 过程档回填后以 **2.0.2** 补多宿主 README 叙事（本 checklist 供 `2.0.2` 勾选）

> 下方 checklist 供下一次发版勾选；勿永久勾死。

## 硬步骤（按序执行 · 全部满足后方可 publish）

- [ ] **① 工作树干净且所有改动已提交**：`git status --porcelain` 为空；拟发布内容全部进入 git 历史。**禁止从未提交工作树 publish**（DEF-001 教训：工作树残留 = 发布物不可溯源）。（Agent 可做）
- [ ] **② 质量闸门全绿**：`npm run typecheck && npm test && npm run build && npm run test:lib` 依次全绿（与 `prepublishOnly` 同一四门；任一红即停止，先修再发）。（Agent 可做）
- [ ] **③ CHANGELOG 版本节已归拢**：`CHANGELOG.md` 的 `## [Unreleased]` 内容已归入 `## [X.Y.Z] - YYYY-MM-DD` 版本节（日期 + 版本号齐全），无残留 Unreleased 条目遗漏。（Agent 可做）
- [ ] **④ 版本钉（pins）已同步（F5 方案 B）**：新版本号已同步全部**现行钉点** —— `assets/ontology.yaml#product_semver`、`assets/harness/discipline-coverage.yaml#as_of_package_version`、README 双文件中的 `dsh-coding-kit@x.y.z`、以及含版本断言的测试。闸测：`test/version-pins-f5.test.ts`（及既有 ontology / discipline 分面测）。**仓根 `SPEC.md` 为 archived epic，不要求与包版本对齐，禁止再把其标题当作现行契约。**（Agent 可做）
- [ ] **⑤ npm version + tag（Agent 默认可做）**：`npm version <patch|minor|major>`（或等价：改 `package.json` + 钉点同步后落 version commit + `vX.Y.Z` tag）；确认 tag 与 CHANGELOG 版本节一致。**禁止**在钉点未同步时 bump。
- [ ] **⑥ PR 合并 + CI 绿**：发版 PR 已 merge 进 `main` 且 CI 全绿（**CI 未绿禁合**）；`git push` 含 `--follow-tags`（或单独 push tag），远端 main 与 tag 指向发布真值。（Agent 可推送，须用户/环境授权）
- [ ] **⑦ npm pack --dry-run 检查**：`npm pack --dry-run` 逐行核对 tarball 清单 —— 无 `test/` 泄漏、无工作区/私仓文件；仅 `package.json#files` 白名单（`bin` / `lib` / `assets` / `cordis.patch.yml` / `README.md` / `LICENSE`）内的内容入包。（Agent 可做）
- [ ] **⑧ npm publish（仅人）**：`npm publish`（`prepublishOnly` 会自动重跑②四门；⑦已核对清单）。**Agent 不得执行本步。**
- [ ] **⑨ publish 后核验 + 过程档状态更新**：`npm view dsh-coding-kit version`（及 `dist-tags`）确认新版本已生效；抽样验证；更新过程档状态为已发布。（人 publish 后 · Agent 可代核）

## 禁令速查

- **禁止从未提交工作树 publish**（① · DEF-001）。
- **CI 未绿禁合**（⑥ · 合并前 CI 必须全绿）。
- **Agent 禁止 `npm publish`**（⑧ 仅人）。**Agent 允许 `npm version` / tag / 钉点同步**（⑤ · 须先过 ①–④）。
- **Agent 禁止 `npm deprecate`**（另闸 `HG-EOS-DATE`）。
- `npm pack --dry-run` 清单异常（`test/` 泄漏、白名单外文件）→ 停止发版，先修 `files` 白名单或 .npmignore 口径（⑦）。
- **CI 不得自动 `npm publish`**（与 Agent 同禁；registry 凭证仅人侧）。
