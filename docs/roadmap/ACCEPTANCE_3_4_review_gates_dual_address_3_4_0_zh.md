# ACCEPTANCE · 3.4.0 minor（review-gates 址B 双址扫描）台账

> **版本**：`spec-wave@3.4.0`（**已 published 2026-10-15** · 人执行 tag/push/publish · registry `latest=3.4.0` · `time.3.4.0`=2026-10-15T07:09:13.832Z · tag `v3.4.0` ↔ `c4d027b`（tag object `25a4686` · 发版分支 tip · 同 v3.3.0 先例）· PR [#38](https://github.com/Cyning12/SpecWave/pull/38) 合并提交 `4680965` · 00 代核回填 2026-10-15）
> **task**：[`docs/tasks/done/task_3_4_0_release_bump.md`](../tasks/done/task_3_4_0_release_bump.md)（slug `3-4-0-release-bump` · 无独立 SPEC 夹 · 属 3.3.0 后单 feature minor · 2026-10-15）
> **范围主源**：PR [#36](https://github.com/Cyning12/SpecWave/pull/36)（feat(review-gates) · merge commit `008fb6f` · CI 10 项全绿）· issue [#35](https://github.com/Cyning12/SpecWave/issues/35)（下游 ops-desk-api 双址规约 `CONVENTION_review_gate_dual_address_v1_zh.md` 上游根治 · **CLOSED**）
> **依据**：R1 审查文 [`task_3_4_0_release_bump_audit_R1_20261015.md`](../harness/reviews/task_3_4_0_release_bump_audit_R1_20261015.md)（PASS · blocking 0）

## 交付清单（PR #36 · 已合 main）

| 项 | 摘要 | 证据 |
|----|------|------|
| `findLatestReview` 址B 扫描 | 扫描面扩第三址 `docs/audits/task-review/`（址B）· 址B 命名口径 `YYYYMMDD_<slug>_r<n>.md`（normalizeSlug 归一 dash ↔ underscore + 去 `task_` 前缀 + `_v<n>` 后缀剥离）· 命名口径按址绑定不串址 · 跨址合并「最高 R 轮取最新」· 址B 不存在零噪音（`existsSync` continue）· `findReview` 布尔投影同源同治 | `src/checks/review-gates.ts`（+29/−9）· merge `008fb6f` |
| 单测 +4 | 址B 单落 PASS · 址A 式命名落址B 不认反向钉死 · 跨址取最高 R 轮 · `_v<n>` 后缀剥离 | `test/cli-verify-review.test.ts`（+52）· 12/12 |
| 红绿对照 | RED 3 fail（址B 误报 BLOCKED 在案两起：ops-desk-api `task_hitl_auto_resume_claim_race` · B1/B2 同型）→ GREEN 全量 989 | PR #36 body |
| 非范围（follow-up） | spec 审查扫描面（`findSpecReview`）不扩址B（址B 目录语义为 task-review · issue #35 锚点节已登记） | PR #36 body 非范围节 |

## 门禁基线（release 簿记棒实测 · 2026-10-15）

| 门禁 | 结果 |
|------|------|
| `npm run typecheck` | 0 错 |
| `npm test` | bump 时点 1003 tests · 1000 pass + 2 tag-gated 设计红 + 1 skip → **打 tag 后清偿实测：1001 pass · 0 fail · 1 skip**（2026-10-15 本地复跑） |
| `npm run build` / `test:lib` | exit 0 · test:lib **6/6** |
| `pins check` | bump 时点 16/17（唯一偏差 pin-10 设计红）→ **打 tag 后清偿实测：17/17 PASS**（2026-10-15 本地复跑） |
| `assets verify` | **113/113**（pins fix 改写 ontology / discipline-coverage / host-adapt README 后 manifest rebuild ~3） |
| `check-doc-links` | PASS · 非S2(i)=0 非S2(ii)=0 · S2 冻结基线 **34**（新文件入库后复绿 · 基线未动） |

## pin-10 设计红登记与清偿路径

- **登记**：bump 后 `pins check` 唯一可接受偏差 = pin-10（tag `v3.4.0` 不存在 · 打 tag 前必经态 · 同 2.4.x/3.0.x/3.3.0 先例）。
- **清偿（已发生 · 2026-10-15）**：人执行 `git tag -a v3.4.0`（tag object `25a4686` ↔ 发版分支 tip `c4d027b`）+ `git push origin v3.4.0` → 本地复跑实证 `pins check` **17/17** + `release-tag-identity` 转绿 · main CI（合并提交 `4680965`）**4/4 绿** → 人 `npm publish` → 探针（registry HTTP 端点直查：`version=3.4.0` · `dist-tags.latest=3.4.0` · `time.3.4.0`=2026-10-15T07:09:13.832Z）→ ⑨ 回填（CHANGELOG `[3.4.0]` 发布状态 · RELEASING 台账 + 人 checklist 3.4.0 节按实勾 · README 双语现行包行 · spec 索引 3.4.0 行 → published · 手册 / MIGRATION 头栏 · 本档）——00 代核回填 2026-10-15。

## 3.3.0 回填清偿（本波顺带）

人 2026-10-11 publish 3.3.0 后未做 ⑨ 回填，本波按实测清偿（registry `latest=3.3.0` · `time.3.3.0`=2026-10-11T06:33:10.216Z · tag `v3.3.0` ↔ `197b337` · 均 2026-10-15 `npm view`/git 实测）：CHANGELOG `[3.3.0]` 发布状态 · spec 索引行 · RELEASING 台账 + 人 checklist 3.3.0 节（标已完成按实勾选）· 手册头栏 · README 双语现行包行 · MIGRATION 头栏 · ACCEPTANCE_3_3_0 补注。

## 已知残余

- ~~pin-10 / `release-tag-identity` 设计红~~ → **已清偿**（人 2026-10-15 打 tag + publish · pins 17/17 · main CI 4/4 绿）。
- ~~registry `latest` 与「3.4.0 已 published」叙事回填~~ → **已清偿**（⑨ 回填全落 · 00 代核 2026-10-15 · registry 端点实测 `latest=3.4.0`）。
- spec 审查扫描面扩址B = follow-up（issue #35 已裁登记 · 不在本版）。

## 发布边界

- 本波 Agent **未** 执行 `git tag` / `git push` / `npm publish` / `npm deprecate`（HG-RELEASE-TAG-PUSH / HG-RELEASE-PUBLISH = pending · 维护者 2026-10-15 本窗自留「我来操作发版」· **人已全部执行**：tag `25a4686` ↔ `c4d027b` · publish 2026-10-15）。
- RELEASING 人 checklist `3.4.0` 节**已标完成按实勾**（00 代核回填 2026-10-15）。
- 使用手册保留文件名 `docs/guides/使用手册-v3.0.0-zh.md`；头栏钉 `spec-wave@3.4.0`（**已发布**）。
- MIGRATION「3.3.0 → 3.4.0 无强制动作项」在档（additive · 址A 行为逐字不变 · 存量审查文零挪零改）。
- spec 索引 `3.4.0`（minor 收尾行）状态格 = **`3.4.0` published**（00 代核回填 2026-10-15 · pin-08 语义格位合格）。
- 下游 ops-desk-api 收口条件（其 task `verify-upstream-dual-address`）：上游发版后钉版 bump + 实证「址B 单落即绿」+ 解除双址复制强制纪律 —— **条件已满足**（3.4.0 已 published 2026-10-15 · 可启动）。
