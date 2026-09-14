# RELEASING · SpecWave（`spec-wave`）发版硬步骤 Checklist

> **制度化来源**：DEF-001 教训 —— 曾从未提交工作树 publish，导致发布物与仓库真值漂移、无法溯源。  
> 本清单把「publish 前 commit + tag」固化为**硬步骤**：任何一步未完成即停止，不得跳步。  
> **职责分工（2026-09-09 起）**：**维护 Agent 可执行 ①–⑦ 与 bump/tag**；**⑧ `npm publish` 仅人**；⑨ 可由 Agent 在人 publish 后核验（或人自核）。  
> **仍仅人**：`npm publish` · `npm deprecate`（另须 `HG-EOS-DATE` / `HG-DEPRECATE-HARNESS`）· 云/账号 2FA 操作。  
> **包名**：现行 **`spec-wave`**（产品名 **SpecWave**；曾用名 `dsh-coding-kit`；曾拟裸 `specgate` 遭 E403 相似拒）。

## 最近一次发版

| 项 | 值 |
|----|-----|
| **工作树 / registry `latest`** | **`spec-wave@2.4.1`**（**已 published** · 2026-09-14 · 人执行 publish · dist-tags `latest=2.4.1`（registry API 直查实核 · npm CLI 缓存滞后曾显示 2.4.0 已绕缓存）· `time.2.4.1`=2026-09-14T12:47:48Z · tag **`v2.4.1`** ↔ bump commit `c89f92d`（tag+push 00 代跑 · 维护者授权）· ⑨ 探针全过 · 明细见下「人 checklist · 2.4.1」） |
| **前一 latest** | **`spec-wave@2.4.0`**（门禁强度补全 minor · 2026-09-14 · tag **`v2.4.0`** ↔ `343025d`） |
| **旧包名** | **`dsh-coding-kit`** · **已 deprecate**（文案 → `spec-wave`） |
| **git（史实 · 2.1.1）** | tag **`v2.1.1`** · 改名前身份；**`v2.1.2` / `v2.1.3` / `v2.2.0` / `v2.2.1` / `v2.3.0`** 为 SpecWave 身份可溯源点（**禁止** `git tag -f`） |
| **主题（已发 · 2.4.1）** | 2.4.0 验收报告四项修复：NEW-1 结论门禁否定守卫语义放宽（B/D/E 断链封堵 · 存量 76 份零误伤）+ NEW-2 printJson 基参统一命令 target + realpath 双侧归一（host validate 补 `--target`）+ NEW-3 钉面 pin-16 HTML 锚点入扫描面 + NEW-9/N9 钉面 pin-08 状态格边界正则精确锁定（同族弱点「裸子串判定」收口） |
| **主题（已发 · 2.4.0）** | 门禁强度补全（gate strength）：W1 钉面提取三修正（N7 refstyle / N8 表行锚定 / N9 语义格位 + 三负向 fixture）+ W2 结论级闸强度增强（S1·N=20 · 评审先行 · 不追溯存量）+ W3 输出层统一相对化（26 处 JSON 出口收敛 + 无绝对路径断言）+ W4 资产门禁可观测（排除项 warning / rebuild 追认警示）+ W5 物料与对外口径对齐（快照标注 / 口径三调 / aider conventions-file）+ W6 P3 清扫（N10 大小写 / N14 slug / N4 留痕） |
| **主题（已发 · 2.3.1）** | 2.3.0 验收三项修复：N1 .bak 发布卫生（gitignore/files 否定项/prepublishOnly 包内容断言/钉面备份自动清理）+ N11 结论级闸强制结论节（禁回退全文 · 存量 8 份豁免留痕）+ N13 豁免四字段显式类型判 |
| **主题（已发 · 2.3.0）** | 接线补全（wiring completion）：W1 版本/身份钉机制补强（核心 · pin-08 严化 + 三面入钉 12→15 + fixture 补全 + 目录型 slug 修复）+ W2 钉面维度扩展（pin-16/17）+ W3 安全可观测（toRel / JSON 信封 / C4 / C5 指引）+ W4 闸语义接线（G2 结论级 / 裸 verify / lint-done 帽级 / reviews.CLOSE 强证据）+ W5 资产完整性（sha256.manifest + assets verify）+ W6 六宿主（7→13）+ W7 DX/工程健康（README 13 宿主表 / GLOSSARY / E2 / E5） |
| **主题（已发 · 2.2.1）** | 2.2.0 验收报告四项修复：symlink realpath 归卡（P0 · C1 穿透封堵）· 钉面修复按文件聚合（P1 · 同文件多钉面一次收敛）· `.gitignore` 加 `.workbuddy/` / `GLOSSARY.md` 进包（P2 ×2） |
| **主题（已发 · 2.2.0）** | 闭环起步：W1 版本/身份钉自动化（核心）+ W2–W7 安全封堵 / 可观测字段 / 上手断档 / 术语表 / 三宿主 / 小清理 |
| **主题（已发 · 2.1.3）** | README/断言收尾 · 发布溯源测（tag↔package.json） |
| **主题（已发 · 2.1.2）** | SpecWave 改名收口 |
| **前一发版** | **`2.4.1`** · **`2.4.0`** · **`2.3.1`** · **`2.3.0`** · **`2.2.1`** · **`2.2.0`** · **`2.1.3`** · **`2.1.2`** · **`2.1.1`** · **`2.1.0`** |
| **更早旧包** | `@cyning/harness` **已 deprecate**（文案指 **`spec-wave`**） |
| **1.x** | **CLOSED** |
| **下一主线** | **3.0 评估**（2.4.1 **已 published** · 2026-09-14 · 门禁强度补全 W1–W6 + 验收四项修复全 CLOSE）；候选 = 机制债残余（叙事行语义盲区 等）+ workspaces / onboard 观察项 + D5 roadmap 改名评估（归 3.0）+ 路线研究 §5 3.0 候选集（A3 hooks surface 等）+ 2.4.0 验收 §6.2 归 3.0 清单（NEW-4/5/6/7/8/10/11/12 · N5）· 另闸 |
| **验收（2.4.1）** | [`docs/roadmap/ACCEPTANCE_2_4_1_patch_2_4_1_zh.md`](docs/roadmap/ACCEPTANCE_2_4_1_patch_2_4_1_zh.md) · **CLOSED**（**已 published** · 2026-09-14 · 人 publish · tag `v2.4.1` ↔ `c89f92d` · ⑨ 探针全过） |
| **验收（2.4.0）** | [`docs/roadmap/ACCEPTANCE_2_4_gate_strength_2_4_0_zh.md`](docs/roadmap/ACCEPTANCE_2_4_gate_strength_2_4_0_zh.md) · **CLOSED**（**已 published** · 2026-09-14 · 人 · tag `v2.4.0` ↔ `343025d` · ⑨ 探针全过） |
| **验收（2.3.1）** | [`docs/roadmap/ACCEPTANCE_2_3_1_patch_2_3_1_zh.md`](docs/roadmap/ACCEPTANCE_2_3_1_patch_2_3_1_zh.md) · **CLOSED**（**已 published** · 2026-09-14 · 人 · tag `v2.3.1` ↔ `268ca21`） |
| **验收（2.3.0）** | [`docs/roadmap/ACCEPTANCE_2_3_wiring_completion_2_3_0_zh.md`](docs/roadmap/ACCEPTANCE_2_3_wiring_completion_2_3_0_zh.md) · **CLOSED**（**已 published** · 2026-09-14 · 人 · ⑨ 00 代核探针全过） |
| **验收（2.2.1）** | [`docs/roadmap/ACCEPTANCE_2_2_1_patch_2_2_1_zh.md`](docs/roadmap/ACCEPTANCE_2_2_1_patch_2_2_1_zh.md) · **CLOSED** |
| **验收（2.2.0）** | [`docs/roadmap/ACCEPTANCE_2_2_closed_loop_start_2_2_0_zh.md`](docs/roadmap/ACCEPTANCE_2_2_closed_loop_start_2_2_0_zh.md) · **CLOSED** |
| **验收（2.1.2）** | [`docs/roadmap/ACCEPTANCE_2_1_2_rename_closeout_2_1_2_zh.md`](docs/roadmap/ACCEPTANCE_2_1_2_rename_closeout_2_1_2_zh.md) · **CLOSED** |
| **验收（2.1.1 UX）** | [`docs/roadmap/ACCEPTANCE_2_1_1_host_tools_ux_2_1_1_zh.md`](docs/roadmap/ACCEPTANCE_2_1_1_host_tools_ux_2_1_1_zh.md) |
| **task（2.4.1）** | [`docs/tasks/done/task_2_4_1_patch.md`](docs/tasks/done/task_2_4_1_patch.md) · **CLOSED**（无独立 SPEC 夹 · 属 2.4.0 验收后 patch · NEW-1/2/3/9 + N9 闭环 + bump · **已 published**） |
| **task（2.4.0）** | [`docs/tasks/done/`](docs/tasks/done/) `task_2_4_gate_strength_w1..w6_*` · **CLOSED**（W1–W6 全关账 · release 波走本 checklist） |
| **task（2.3.0）** | [`docs/tasks/done/task_2_3_wiring_release.md`](docs/tasks/done/task_2_3_wiring_release.md) · **CLOSED**（2.3.0 接线补全收尾 bump） |
| **task（2.3.1）** | [`docs/tasks/done/task_2_3_1_patch.md`](docs/tasks/done/task_2_3_1_patch.md) · **CLOSED**（无独立 SPEC 夹 · 属 2.3.0 验收后 patch） |
| **task（2.2.1）** | [`docs/tasks/done/task_2_2_1_patch.md`](docs/tasks/done/task_2_2_1_patch.md) · **CLOSED**（无独立 SPEC 夹 · 属 2.2.0 验收后 patch） |
| **规划 / SPEC（2.4.0）** | [`docs/roadmap/PLAN_2_4_gate_strength_v1_zh.md`](docs/roadmap/PLAN_2_4_gate_strength_v1_zh.md) · [`docs/spec/2_4-gate-strength/`](docs/spec/2_4-gate-strength/) |
| **规划 / SPEC（2.3.0）** | [`docs/roadmap/PLAN_2_3_wiring_completion_v1_zh.md`](docs/roadmap/PLAN_2_3_wiring_completion_v1_zh.md) · [`docs/spec/2_3-wiring-completion/`](docs/spec/2_3-wiring-completion/) |
| **规划 / SPEC（2.2.0）** | [`docs/roadmap/PLAN_2_2_closed_loop_start_v1_zh.md`](docs/roadmap/PLAN_2_2_closed_loop_start_v1_zh.md) · [`docs/spec/2_2-closed-loop-start/`](docs/spec/2_2-closed-loop-start/) |
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
- [ ] **⑥ PR 合并 + CI 绿**：发版 PR 已 merge 进 `main` 且 CI 全绿（**CI 未绿禁合**）；**push 须原子或 tag 先行**：`git push origin main vX.Y.Z` 单条原子推（或先推 tag 再推 main），**禁「先 main 后 tag」分推**——main 分支 CI 的 checkout 拉全量 tag，含 tag 存在性闸项，分推存在「CI checkout 时 tag 未达」竞态（2026-09-14 v2.4.1 实测：main CI 24.x job checkout 比 tag 到远端早 ~1s，tag 闸项红 · tag 落远端后重跑转绿）；远端 main 与 tag 指向发布真值。（Agent 可推送，须用户/环境授权）
- [ ] **⑦ npm pack --dry-run 检查**：`npm pack --dry-run` 逐行核对 tarball 清单 —— 无 `test/` 泄漏、无工作区/私仓文件；仅 `package.json#files` 白名单（`bin` / `lib` / `assets` / `cordis.patch.yml` / `README.md` / `LICENSE`）内的内容入包。（Agent 可做）
- [ ] **⑧ npm publish（仅人）**：`npm publish`（`prepublishOnly` 会自动重跑②四门；⑦已核对清单）。**Agent 不得执行本步。**
- [ ] **⑨ publish 后核验 + 过程档状态更新**：`npm view spec-wave version`（及 `dist-tags`）确认新版本已生效；抽样验证；更新过程档状态为已发布。（人 publish 后 · Agent 可代核）

### 人 checklist · `2.4.1` 发版（**已完成** · 2026-09-14 · 人执行 publish · tag/push 00 代跑（维护者授权）· 探针/回填 00+release 棒代核）

> 内容：2.4.0 验收报告 PASS-with-issues §6.1「建议纳入 2.4.1」四项修复 —— NEW-1 [P1] 结论门禁否定守卫语义放宽（`不.{0,3}通过`/`未.{0,3}通过`/`no\s*pass`/`reject` · B/D/E 断链封堵 · 存量 76 份零误伤）· NEW-2 [P1] `printJson` 基参统一命令 target + realpath 双侧归一（cli.ts×5 含 :1299 信封增量 + cli-host.ts×4 · `host validate` 补 `--target` additive · cwd≠target/symlink 对偶测试 ×6）· NEW-3 [P2] pin-16 HTML `<a href>` 入扫描面（yaml semantics 三形态同步）· NEW-9/N9 [P2] pin-08 状态格边界正则精确锁定（`(?<![0-9A-Za-z._-])X\.Y\.Z(?![0-9A-Za-z._-])` · 三负向 + 存量索引行零误伤）。task `2-4-1-patch`。
>
> **授权注记（2026-09-14 维护者）**：**tag + push 已授权 00 代跑**（`git tag v2.4.1` + `git push origin main v2.4.1`）；**publish 仅人**（Agent 禁令不变）。

1. [x] 确认工作树已 commit（含 bump `2.4.1` · CHANGELOG `## [2.4.1] - 2026-09-14` · 钉点 16/17（pin-10 tag-gated 设计红 · 打 tag 后须 17/17）· 四门绿）
2. [x] `git tag v2.4.1`（annotated · 00 代跑 · 维护者已授权）+ push（tag `v2.4.1` ↔ `c89f92d` 已上 origin）。**教训留痕**：首次按「先 main 后 tag」分推触发竞态——main CI `test (24.x)` checkout 比 tag 到远端早 ~1s，tag 存在性闸项红（run 34843339145）；tag 落远端后 `gh run rerun --failed` 转绿。流程修正已入硬步骤 ⑥（原子推或 tag 先行）
3. [x] `npm publish`（包名 `spec-wave` · 版本 `2.4.1` · **仅人** · 人执行；dist-tags `latest=2.4.1` · `time.2.4.1`=2026-09-14T12:47:48Z · `prepublishOnly` 末段包内容卫生断言过）
4. [x] 探针（00 实测 · 全过）：registry API 直查 dist-tags `latest=2.4.1`（npm CLI 缓存滞后曾显示 2.4.0 · 已绕缓存实核）；`git show v2.4.1:package.json` → `version=2.4.1`；真 tarball `spec-wave@2.4.1` 清单 188 文件（对照 2.4.0 一致）· 无 `.bak` / `*~` / `.DS_Store`
5. [x] 打 tag 后复跑（00 实测）：`pins check` **17/17 PASS · exit 0**（设计红全转绿）· `npm test` **595 pass / 0 fail / 1 门控 skip**
6. [x] 回填 ACCEPTANCE / 过程档为已 published（本棒 · 00+release 棒代核 ⑨：本表勾选 · RELEASING「最近一次发版」表 · README 双语现行包行（bump 时已联改 2.4.1 · 钉面受控）· spec 索引行状态 `待发版 → published` · ACCEPTANCE 头部与已知残余转绿注记）

### 人 checklist · `2.4.0` 发版（**已完成** · 2026-09-14 · 人执行 tag/push/publish · 探针/回填 00+release 棒代核）

> 内容：2.3.0 验收报告 §6「建议 2.4」八组门禁强度补全 + 对外口径三条 + 2.3.1 残余登记三条 —— W1 pins 提取三修正（N7 refstyle / N8 表行锚定 / N9 语义格位 + 三负向 fixture）· W2 结论级闸强度增强（S1·N=20 · 评审先行 · 不追溯存量）· W3 输出层统一相对化（26 处 `--json` 出口收敛 + 无绝对路径断言）· W4 assets verify 排除项 warning + rebuild 追认警示 · W5 物料快照标注 + 口径三调 + aider conventions-file · W6 N10 大小写口径 / N14 slug 口径 / N4 留痕。tasks `2-4-gate-strength-w1..w6`（`docs/tasks/done/`）。

1. [x] 确认工作树已 commit（含 bump `2.4.0` · CHANGELOG `## [2.4.0] - 2026-09-14` · 钉点 16/17（pin-10 tag-gated 设计红 · 打 tag 后须 17/17）· 四门绿 · bump commit `343025d`）
2. [x] `git tag v2.4.0`（annotated · 人执行）+ `git push origin main && git push origin v2.4.0`（tag `v2.4.0` ↔ bump commit `343025d` 实核存在 · 已 push）
3. [x] `npm publish`（包名 `spec-wave` · 版本 `2.4.0` · 人执行；dist-tags `latest=2.4.0` · `time.2.4.0`=2026-09-14T10:07:41Z · `prepublishOnly` 末段包内容卫生断言过）
4. [x] 探针（00 实测 · 全过）：`npm view spec-wave version` → `2.4.0`；`git show v2.4.0:package.json` → `version=2.4.0`；真 tarball `spec-wave@2.4.0` 清单 188 文件（对照 2.3.1 一致）· 无 `.bak` / `*~` / `.DS_Store`
5. [x] 打 tag 后复跑（00 实测）：`pins check` **17/17 PASS · exit 0**（设计红全转绿）· `npm test` **581 pass / 0 fail / 1 门控 skip**
6. [x] 回填 ACCEPTANCE / 过程档为已 published（本棒 · 00+release 棒代核 ⑨：本表勾选 · RELEASING「最近一次发版」表 · README 双语现行包行（bump 时已联改 2.4.0 · 钉面受控）· spec 索引行状态 · ACCEPTANCE 头部与已知残余转绿注记）

### 人 checklist · `2.3.1` 发版（**已完成** · 2026-09-14 · 人执行 tag/push/publish · 2.4.0 release 棒代核回填）

> 内容：2.3.0 验收报告 PASS-with-issues §6「建议 2.3.1」三项修复 —— N1 [P1] .bak 发布卫生（.gitignore `*.bak` · files `"!assets/**/*.bak"` · prepublishOnly 包内容机械断言 `scripts/check-pack-hygiene.mjs` failClosed · pins fix 备份成功后自动清理）· N11 [P1] 结论级闸强制结论节（禁回退全文 · 存量 8 份循 W4 先例豁免留痕）· N13 [P2] 豁免四字段显式类型判。task `2-3-1-patch`。

1. [x] 确认工作树已 commit（含 bump `2.3.1` · CHANGELOG `## [2.3.1] - 2026-09-14` · 钉点 16/17（pin-10 tag-gated 设计红 · 打 tag 后须 17/17）· 四门绿）
2. [x] `git tag v2.3.1`（annotated · 人执行）+ `git push origin main && git push origin v2.3.1`（tag `v2.3.1` ↔ bump commit `268ca21` 本棒实核存在）
3. [x] `npm publish`（包名 `spec-wave` · 版本 `2.3.1` · 人执行；`prepublishOnly` 末段含包内容卫生断言 —— 若红即停止：包内含 `*.bak`/`*~`/`.DS_Store`）
4. [x] 探针：`npm view spec-wave version` → `2.3.1`（本棒实核 registry `latest=2.3.1`）；`git show v2.3.1:package.json` → `version=2.3.1`；`npm pack spec-wave@2.3.1 --dry-run` 清单无 `.bak`（对照 2.3.0 的 5 个）
5. [x] 打 tag 后复跑：`pins check` 17/17（本棒 bump 前实测 exit 0）· `npm test` 全绿（tag-gated 设计红转绿）
6. [x] 回填 ACCEPTANCE / 过程档为已 published（含本表勾选 · RELEASING「最近一次发版」表 · README 双语现行包行 · spec 索引行状态）

### 人 checklist · `2.3.0` 发版（**已完成** · 2026-09-14 · 人执行 tag/push/publish · 00 代跑 push · ⑨ 00 代核）

1. [x] 确认工作树已 commit（含 bump `2.3.0` · CHANGELOG · 钉点 17/17（pin-10 随 tag 落位转绿）· 四门绿 · tag `v2.3.0` ↔ bump commit `87dfa6f`）
2. [x] `git tag v2.3.0`（annotated · 人执行）+ `git push origin main && git push origin v2.3.0`（00 代跑 push · 人授权）
3. [x] `npm publish`（包名 `spec-wave` · 版本 `2.3.0` · 人执行）
4. [x] 探针（00 代核）：`npm view spec-wave version` → `2.3.0` · `dist-tags.latest` → `2.3.0` · `time.2.3.0` = 2026-09-14T01:15:25Z · `git show v2.3.0:package.json` → `name=spec-wave` · `version=2.3.0` · `npm pack spec-wave@2.3.0 --dry-run` 193 文件
5. [x] 打 tag 后复跑：`pins check` **17/17 PASS · exit 0**（设计红全转绿）· `npm test` **534 pass / 0 fail / 1 skip**（与 release 棒移交清单一一对应）
6. [x] 回填 ACCEPTANCE / 过程档为已 published（本棒 · 00 代核 ⑨）

### 人 checklist · `2.2.1` 发版（**已完成** · 2026-09-12）

1. [x] 确认工作树已 commit（含 bump `2.2.1` · CHANGELOG · 钉点 12/12 · 四门绿 · tag `v2.2.1` ↔ `c828e5e`）
2. [x] `git push origin main && git push origin v2.2.1`（origin/main = `6bdf3ad`）
3. [x] `npm publish`（包名 `spec-wave` · 版本 `2.2.1`）
4. [x] 探针：`npm view spec-wave version` → `2.2.1`；`git show v2.2.1:package.json` → `name=spec-wave` · `version=2.2.1`
5. [x] 回填 ACCEPTANCE / 过程档为已 published（Agent 代核 ⑨）

### 人 checklist · `2.2.0` 发版（**已完成** · 2026-09-11）

1. [x] 确认工作树已 commit（含 bump `2.2.0` · CHANGELOG · 钉点 12/12 · 四门绿 · tag `v2.2.0` ↔ `60b8640`）
2. [x] `git push origin main && git push origin v2.2.0`（origin/main = `3a2b407`）
3. [x] `npm publish`（包名 `spec-wave` · 版本 `2.2.0`）
4. [x] 探针：`npm view spec-wave version` → `2.2.0`；`git show v2.2.0:package.json` → `name=spec-wave` · `version=2.2.0`
5. [x] 回填 ACCEPTANCE / 过程档为已 published（Agent 代核 ⑨）

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
