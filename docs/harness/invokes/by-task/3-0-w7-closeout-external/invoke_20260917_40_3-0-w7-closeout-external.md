# Invoke：40（review-of-work）· 3-0-w7-closeout-external

| 字段 | 值 |
|------|-----|
| hat_id | 40-review-of-work |
| task_slug | `3-0-w7-closeout-external` |
| task_paths | `docs/tasks/active/task_3_0_w7_closeout_external.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |
| 复核对象 | `b354bfa..260fbe3`（HEAD）十一 commit（task/审查文/invoke 三件套 → E3 → F3 → 术语 → A3 → K 台账 → MIGRATION+演练 → 证据+2.4.2 → 链接 → bump+探针 → 收官备料） |
| 复核结论 | **PASS-with-issues**（blocking 0 · advisory 3）· 下一棒 `30 close --yes` |

## 复核范围与方式

独立复核 30 四阶段交付（F3 wiki 双向/增量/冲突 · E3 spawn 重定基 671→270 · 术语机检 · A3 claims 边界 · K-1~K-4 台账 · MIGRATION 定稿 + 真实 2.4.1 仓演练 · 链接两级机检 · 证据入库清偿 · 2.4.2 口径零残留 · 3.0.0 bump 九件套 + 发版探针）。

**不接受「30 说绿」**：平台锁全部独立复跑；术语/claims/链接三 checker **40 本棒自造 temp root 注入真红重放**（不复用 30 fixture）；F3 三能力 **CLI 独立重放**（backlinks 对偶 / 增量=全量逐字 / `--check-conflicts` exit 2）；E3 `e3-spawn-count.mjs` 同脚本独立复跑；compat 首项独立复跑；bump 完整性逐面实读 + `pins check` 实证；diff/git/tag 机检逐条自跑。temp 临件全落 `/tmp` 并已清（工作树净复核在案）。

## 独立实测证据（40 本棒自跑）

### 平台锁复跑

| 项 | 实测 | 预期 | 判 |
|----|------|------|----|
| `npm run typecheck` | 0 错（exit 0） | 0 错 | ✓ |
| `npm run build` | exit 0 | 0 错 | ✓ |
| `npm test` | **859 tests / 164 suites / 856 pass / 2 fail / 1 skip** | 859/…/856 pass/2 fail/1 skip | ✓ 逐字 |
| `npm run test:lib` | **6/6 pass**（exit 0） | 6/6 | ✓ |
| `node bin/specgate.js pins check` | **16/17 · 仅 pin-10 `[missing]` expected `v3.0.0`**（exit 2） | 16/17 | ✓ 设计红 |
| `node bin/specgate.js assets verify` | **113/113 PASS** | 113/113 | ✓ |
| `verify --target . --task <本 task>` | **VERIFY: PASS**（HG-TASK-DRAFT / HG-AUDIT-R1 approved） | PASS | ✓ |
| `task lint --file <本 task>` | **LINT: PASS** | PASS | ✓ |
| `gate-check --task <本 task>` | exit 0 · 未发现阻塞 | exit 0 | ✓ |
| `node scripts/check-terminology.mjs` | **PASS · canonical 5/5 · 判红面 门控 残留 0** | PASS | ✓ |
| `node scripts/check-claims.mjs` | **PASS · 7 文件 · forbidden 零命中** | PASS | ✓ |
| `node scripts/check-doc-links.mjs` | **PASS · 非 S2 (i)=0 / (ii)=0 · S2=23=冻结基线** | PASS | ✓ |
| `node scripts/e3-spawn-count.mjs` | **spawn=270**（call 323 − def 53 · 53 文件） | ≤300 | ✓ |
| `host validate --file test/fixtures/host-adapt/mvp-hosts_2_4_2.yaml` | **PASS exit 0**（compat 红线首项） | exit 0 | ✓ |

**2 设计红独立定性**：`npm test` 唯二失败 = ① `pins-consistency` A 组「pins check 在真实仓 exit 0 且打印 PINS: PASS」② `release-tag-identity`「tag v3.0.0 存在…」—— 二者**同因** = `package.json#version=3.0.0` 但 git tag `v3.0.0` 未打（`git tag -l 'v3.0*'` 空）。与 `pins check` 的 pin-10 `[missing]` **同一根因** · 均 tag-gated 设计红 · **非代码回归**。打 tag 后须全转绿。

### 验收抽核（40 独立构造重放）

- **#1 术语**：正/负注入 —— `README.md` 注入 `门控` → `FAIL README.md:1:3` exit 2；仅 `后门控制` → exit 0（词边界排除生效）；GLOSSARY 缺 `真值源` → missingCanonical exit 2；canonical 5/5 在位。判红面残留 0 独立复跑属实。
- **#3 claims**：`delivery/promotion/x.md` 注入 `接入即获得 L3` → exit 2 点名；注入过期 `四宿主` → exit 2 点名；合法文案 → exit 0。真红面成立。
- **#4 链接**：temp git 仓 `docs/a.md`(非 S2 坏链) + `docs/b.md`(`.workbuddy` 未入库) → 非 S2 (i)=2 · (ii)=1 exit 2；仅 S2 坏链 → S2=1≠基线 23 exit 2；同语料 `--s2-baseline 1` → exit 0。非 S2 硬判 + S2 冻结基线机检成立。
- **#5 K 台账**：`delivery/research_report.md` / `高层架构设计.md:196` / `promotion/*` 中旧单值 `30+`/`105`/`22 个`/`200+`/`不是机械性` **0 命中**；`as_of 2026-09` 区间化在位（:120/:169/:170/:172/:220/:258/:267/:395 + 高层架构 :196 + promotion 01–04）；差异化迁移「内置零装配 + 多宿主物化」在案。
- **#6 证据**：`git ls-files docs/harness/reviews/w7_evidence_*` = **5 件 tracked**（路线研究 / 验收 2.4.0 / 验收 2.4.1 / exports_probe 四镜像 + provenance 登记表）；provenance 逐件列来源+日期+处置（4 镜像 + W3 2 件核对 + 7 件「仅本地草稿」）。
- **#7 E3**：独立复跑 **671→270**（`call 323 − def 53` · ≤300 硬判据达成）；`test/_helpers/core-harness.ts` 为单实现源 `makeCore`(W0 判据) + `runCore`(进程内 argv 分发)，非删测凑数（841→859 纯加性）。
- **#8 2.4.2**：`CHANGELOG.md:35` 2.4.2 = **已 published**（1067f32）；提交 `d2d1c1e` 说明含「补正 2.4.2 口径滞后（复核已由 1067f32 修正 · 本波零残留确认）」；`git show v2.4.2` = 原 `2557119`（tag 未移动）。
- **#9 探针六项**：记录 `w7_release_probe_3_0_0_20260917.md` 六项齐（① compat ② 四门 ③ pack ④ pins ⑤ host validate+apply ⑥ 依赖）；**① compat 独立复跑 exit 0**；内置 v2 表 `host validate` 亦 exit 0。
- **#11 F3**：CLI 独立重放 —— 输出键 `schema,root,nodes,edges,backlinks,warnings,conflicts`（键只增）；backlinks 对偶断言 **edges=4 · badbacklinks=0**；`--check-conflicts` 命中 same_stem + dangling_link → **exit 2**；增量缓存落 `<target>/.coding-kit/wiki-cache.json`；改一文件后「增量 vs 全量」`nodes+edges+backlinks+conflicts+warnings` **逐字 EQUIVALENT=true**；默认 `wiki export`（不带新选项）**exit 0 零回退**。
- **#2 演练**：`v2.4.1` = `c89f92d`（tag 实证）；其适配表 `version: "1"` · `schema_version` 计数 **0**（真 v1）；compat fixture `mvp-hosts_2_4_2.yaml` 与 `git show v2.4.2:…` **逐字 IDENTICAL** 且同为 v1 → 演练锚在真实 v1 表 · **无兼容洞**（F-W7-01 未触发）。
- **#12 既有面**：`git diff b354bfa..HEAD --stat -- src/` = 仅 `src/cli-wiki.ts` + `src/cli/usage.ts`（登记面）；`assets/` = terminology/claims/discipline-coverage/ontology/host-adapt README/sha256.manifest（均登记）；`test/` 改动 = E3 共享 harness 改造 + 版本断言联改 + 新增（与自检偏差 #7/#12 登记一致）· 零意外。
- **#13**：task lint PASS。 **#14**：逐文件显式 add（无 `git add -A`）· gate-check exit 0 · **未 tag/push/publish/deprecate**。

### bump 完整性独立核

| 面 | 实测 | 判 |
|----|------|----|
| `package.json#version` | **3.0.0** | ✓ |
| `CHANGELOG.md` | `## [Unreleased]` 空 · **`## [3.0.0] - 2026-09-17`** 节（major/breaking 明示 + 迁移指引指针） | ✓ |
| `pins check` | **pin-14 MIGRATION.md:3 = 3.0.0**；17 落点 16 绿 + pin-10 设计红 | ✓ |
| `MIGRATION.md` | :3/:4/:7 = `spec-wave@3.0.0`；`v2.4.2` tag 仍指 `2557119`（未碰） | ✓ |
| `RELEASING.md` | 「最近一次发版」= 3.0.0 待发版 + **`### 人 checklist · 3.0.0 发版` 节** | ✓ |
| ACCEPTANCE | `docs/roadmap/ACCEPTANCE_3_0_architecture_leap_3_0_0_zh.md` 在 | ✓ |
| `docs/spec/README.md` | :24 `3_0-architecture-leap` 行 = 3.0.0 待发版（planned） | ✓ |
| git tag | `git tag -l 'v3.0*'` **空**（新 tag 未打 · 发布四动作仅人） | ✓ 设计态 |

### 既有面零改动 / commit 卫生

- `docs/tasks/active/` **仅本 task** · `git status --porcelain` 空（工作树净）。
- `main...origin/main [ahead 11]`（`origin/main` 停在 `965aaf1`）· `git tag --points-at HEAD` 空 —— **未 push / 未 tag**。
- 11 笔逐笔 `show --stat` scope 与提交信息一致（b354bfa 三件套 9 文件 · da1a4e4 E3 18 文件 · 7e9ee37 F3 8 文件 · 2243489 术语 4 · 5473319 A3 5 · 33ae2b4 K 6 · 0d06c1f 迁移 2 · d2d1c1e 证据 6 · 7c5f2c9 链接 15 · 5bb46a2 bump 22 · 260fbe3 备料 2）· 无裹挟面。

## 发现清单

- **blocking：0** —— 平台锁/deep 项全绿，2 设计红与 pin-10 同因（tag-gated），bump 完整、证据入库、无越权 tag/push。
- **advisory：3**
  - **A1（40 新增 · 计数笔误）**：探针记录 ②、task 自检结论「二、锁计数」阶段四行、ACCEPTANCE「二、锁数字」阶段四行均写 **`857 pass`（探针另写 `163 suites`）**；40 独立复跑实测 **859 tests / 164 suites / 856 pass / 2 fail / 1 skip**。859 = 856 + 2 + 1 才自洽，`857` 为 +1 笔误（`859+2+1−857=…` 不成立）。**机械面正确、非交付缺陷**，建议 00/下一棒顺手订正三处数字。
  - **A2（40 新增 · 机检口径）**：任务 #8「全仓无 `2.4.2.*待发版` / `v2.4.2.*待人打`」字面机检**未严格为零** —— 命中集中在历史 S2（`docs/tasks/done/task_2_4_2_patch.md` · 2.4.2 invoke，硬约束 1 永不覆写）与历史归档 `ACCEPTANCE_2_4_2…`（K-4 不回改已外发/历史物料）；**当前对外面（`CHANGELOG.md:35` 2.4.2=已 published · RELEASING latest）正确无滞后**。故「零残留」就 live/对外面成立，字面全仓口径属可枚举的历史豁免 —— 非交付缺陷，登记供 00 知悉。
  - **A3（40 新增 · 收官备料）**：本 task 缺 `### KPI（00）` / 「KPI 备料（待 00 裁定）」节（W6 先例有）；metadata `kpi_rubric=KPI_RUBRIC_v1_2` + `kpi_aggregator=CLOSE` 在位，原始备料（841→845→855→859 纯加性 · spawn 671→270 · 三 checker · 8 波）可从自检结论「二/三/四」提取。**建议 00 关账时补 KPI 节并落 Task_KPI%**。

## 结论

**PASS-with-issues**（blocking 0 · advisory 3）—— 平台锁独立复跑全绿且与预期逐字一致（typecheck 0 · build 0 · **859/164/856/2/1** · test:lib 6/6 · pins 16/17 pin-10 设计红 · assets 113/113 · verify PASS · task lint PASS · gate-check 0 · 三 checker PASS）；**2 红独立定性与 pin-10 同因（tag `v3.0.0` 未打）· 纯 tag-gated 设计红**；#1 术语/#3 claims/#4 链接经 40 自造 temp root **注入真红**全部按预期 exit 2；#5 K 旧单值零命中；#6 五件证据 tracked；#7 E3 独立复跑 **671→270（≤300）**；#11 F3 CLI 重放 backlinks 对偶 0 反例 / 增量=全量逐字 / `--check-conflicts` exit 2；#2 v2.4.1（`c89f92d`）真 v1 表 + 2.4.2 逐字 fixture 无兼容洞；#9 compat 首项 exit 0；bump 完整性（version/CHANGELOG/RELEASING/ACCEPTANCE/spec 索引/16+1 钉面）成立；`v2.4.2` tag 未移动；既有面零意外 · commit 卫生 · **未 push/tag** 在案。三条 advisory 均非阻塞（A1 计数笔误 · A2 机检口径历史豁免 · A3 KPI 节待 00 补）。

## 未做（禁区）

未改 src/test/assets/SPEC/PLAN/task/delivery/CHANGELOG/MIGRATION/package.json · 未签任何闸 · **未 tag/push/publish/deprecate** · 本棒唯一写面 = 本 invoke（S2 只新增 · 单文件显式 add）。

## 下一棒

00 放行 → **30 `task close --yes`** 关账（00 收官裁定 + 回填 `### KPI（00）` · 顺手订正 A1 计数）· task 归档 `docs/tasks/done/`。**发布段仍仅人**：`git tag v3.0.0` → 原子推 → `npm publish`；打 tag 后复跑 `pins` 17/17 + `npm test` 全绿（2 设计红转绿）。
