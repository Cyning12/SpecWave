# Invoke：40（review-of-work 独立复核）· 3-0-w1-schema-leap

| 字段 | 值 |
|------|-----|
| hat_id | 40-review-of-work |
| task_slug | `3-0-w1-schema-leap` |
| task_paths | `docs/tasks/active/task_3_0_w1_schema_leap.md`（close 后 `docs/tasks/done/`） |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |
| 复核对象 | HEAD `1101d0c`（W1 五笔：8d2ac26 → 4c3e042 → 3ebea10 → 2a586f9 → 1101d0c） |

## 复核范围（委派 Prompt）

验收 #1–#13 抽核（重点 #1 compat sha256 对 v2.4.2 tag · #2 OQ-2 九条目 fixture 抽跑 · #5 闸泛化双锁重跑 · #6 bin 面泛化渲染实证 · #10 既有测试 diff 空 · #13 留尾口径）；独立复跑 typecheck / build / npm test / test:lib / pins check / assets verify / verify --task；向后兼容红线（planned writes 快照 · v1 表面 · F-W1-03 exit 2 点名）；commit 卫生（五笔逐笔 --stat · 工作树净 · 未 push/tag）；task 收官备料（KPI 97 · 自检回填 · MIGRATION 纯插入）。**禁区遵守**：未改 src/test/SPEC/PLAN/task 文/MIGRATION；本 invoke 单独 commit；未 push/tag；未代签任何闸。

## 独立实测证据（本帽本机复跑 · 不接受「30 说绿」）

| 项 | 命令 | 实测 |
|----|------|------|
| 平台锁 | `npm run typecheck` / `npm run build` | **0 错 / 0 错**（exit 0 · 本帽复跑，build 先于 bin 面实证 · 30 登记教训遵守） |
| 用例锁 | `npm test` 全量 | **tests 667 / suites 130 / pass 666 / fail 0 / skipped 1**（≈76s · 与 30 登记终态逐字一致 · 基线 607 纯加性 · 零意外红） |
| 发布链 | `npm run test:lib` | **6/6 PASS**（exit 0） |
| pins | `node bin/specgate.js pins check` | **17/17 PASS** · pin-14 = `MIGRATION.md:3 = 2.4.2`（钉点行未动实证）· pin-17 = 13 宿主双语命中 |
| assets | `node bin/specgate.js assets verify` | **110/110 PASS** |
| 波末闸 | `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w1_schema_leap.md` | **VERIFY: PASS**（exit 0）· 闸扫描表列 **3 行**（HG-TASK-DRAFT / HG-AUDIT-R1 / **HG-SCHEMA-CHANGE** 均 approved）——泛化渲染 bin 面实证（验收 #6/#7） |
| gate-check | `node bin/specgate.js gate-check --task <W1 task>` | **exit 0** · HG-SCHEMA-CHANGE 行入渲染 `| HG-SCHEMA-CHANGE | approved | 30 | ✅ 可 30 |` |
| #1 compat sha | `git show v2.4.2:assets/ide/host-adapt/examples/mvp-hosts.yaml \| shasum -a 256` 比对 fixture | **逐字一致**：`b80f9a15e7da9051689b957daf737b4799f4a2392d6a9130dcaee770f2203894`（tag 直出与 `test/fixtures/host-adapt/mvp-hosts_2_4_2.yaml` 同值 · 不依赖测试内断言自体） |
| #1 planned writes | `node --test --experimental-strip-types test/w1-v1-compat-lock.test.ts` | **5/5 PASS** · validate/apply --dry-run 零改动通过 + planned writes 与 2.4.2 基线快照逐字一致（含 sha 钉死断言） |
| #2 九条目 | `node --test --experimental-strip-types test/w1-extends-resolve.test.ts` | **17/17 PASS**（标量覆盖/对象深合并/数组 replace/继承/链深 8/9 边界/循环/自继承/未知目标/defaults extends 拒绝面全钉） |
| #5 双锁 | `node --test --experimental-strip-types test/w1-gate-generalization.test.ts` | **15/15 PASS** · 新 fixture（HG-SCHEMA-CHANGE pending）reason 逐字 + may_start_30=false · **A2 存量锁机械重跑**：75 基线文件零翻转 · 行键 232 条逐条一致 · generic 阻塞 0 行 |
| F-W1-03 | `node bin/specgate.js host validate --file test/fixtures/host-adapt/schema-version/schema_version_3.yaml` | **exit 2** · 点名文案逐字：`未知 schema_version: 3（支持：缺省=v1 或 2 · 不得静默按旧格式解析）` |
| #10 零改动 | `git diff 98d2062..HEAD --stat -- test/host-adapt-*.test.ts` + gate 系四件（gate-semantics/cli-p0/cli-flags/cli-status-obs） | **全空（0 行 · exit 0）** —— 11 件 host 测试 + gate 系既有断言零改动（F-W1-13 预期兑现） |
| #8 MIGRATION | `git diff 98d2062..HEAD -- MIGRATION.md` | **纯插入 28+/0−**（草案节 ①–④ 四要点齐 + 修订记录行 · pin-14 钉点行未触 · ④ 落点不变与 pin-17 前提明示） |
| #13 留尾 | task 验收节实读 | #1–#12 已勾 · **#13 未勾**且自检结论明示「task close --yes 待 40 复核 + 00 放行后执行 · 届时勾选」—— 与「待 close」口径一致 ✓ |
| commit 卫生 | 五笔 `git show --stat` + `git status --porcelain` + `git tag --points-at HEAD` | 粒度正确（11/21/34+/6/3 文件 · 阶段边界清晰 · fixture 随阶段 · sha256.manifest 与 schema.json 同步入 4c3e042/3ebea10）· 工作树净 · HEAD 无 tag · 域外 untracked 零裹挟（评审文入 9d7ac5c 系 W1 docs 正件非裹挟） |
| 结构闸 #12 | `node bin/specgate.js task lint --file <W1 task>` | **LINT: PASS**（exit 0 本帽复跑） |
| 收官备料 | task 文实读 | KPI 节在（30 自评 Task_KPI%: 97 · rubric/aggregator 照模板 · 范围守界/质量门两段齐）· 自检结论回填完整（闸扫描表 + 13 条逐项 + 五阶段锁计数表 + 红测先行记录 + 快照比对结论 + 已知未测项四条 + 过程留痕） |

## 验收 #1–#13 抽核结论

#1 ✅（sha256 独立比对 + compat 锁 5/5 重跑）· #2 ✅（九条目 17/17 重跑）· #3 ✅（hooks 红绿 fixture 在 npm test 全绿面内 · 双轨已知未测项=JSON schema runner 30 已登记 W7）· #4 ✅（667 全绿含 11 件历史波次 + pins 17/17）· #5 ✅（双锁 15/15 重跑 · A2 口径机械执行）· #6 ✅（bin 面 verify/gate-check 渲染 HG-SCHEMA-CHANGE 行实证 · 先 build 后实证）· #7 ✅（闸行 blocks 含 30 · 本 task 即证 + 机检）· #8 ✅（纯插入 · 四要点齐 · pin-14 实证）· #9 ✅（667/130/666/0/1 + typecheck/build 0 错）· #10 ✅（diff 全空）· #11 ✅（OQ-6 单锚 fixture 全绿面内）· #12 ✅（task lint 复跑 PASS）· #13 ⏳ 符合口径（五 commit 显式 add/独立可回退/未 tag-push-publish-deprecate 均实证 · 仅余 close --yes 尾步留待放行）。

## 结论

**PASS**（blocking **0** · advisory **1**）—— 七项独立复跑（typecheck/build/test/test:lib/pins/assets/verify）全部本机复现 30 登记值逐字一致；三重保险（compat reader + 版本探测 + MIGRATION）与闸泛化双锁机械可证成立；commit 粒度与禁区面全部合规。**建议 00 放行 `task close --yes`。**

## 发现（advisory · 不阻塞放行）

1. **unpushed 计数口径差**（标注级）：委派 Prompt 预期 `git log origin/main..HEAD` = 15 笔（W0 八 + docs 两 + W1 五），本帽实测 **17 笔** —— 组成 = W0 线十笔（b51acf3/1a34242/161a9aa/8dc8bfd/4bebcf9/67e57d4/2ad3e2f/540d5fa/ff11de0/98d2062 · 含 PLAN/SPEC 与 W0 审查文两笔 docs）+ W1 docs 两笔（9d7ac5c/e695b09）+ W1 五笔，全部合法 lineage、零域外 commit、未 push/tag。系 Prompt 计数口径差（未计 ff11de0/98d2062 两笔），非违规（push 因网络未恢复已登记非违规 · 维护者仅人 push）。

## 下一棒

**00 放行 → 30 close --yes**：`node bin/specgate.js task close --yes`（或 npx 等价）—— 本 invoke 为 close_invoke 守卫五件套（10/20/30/40/00）之 40 件，落盘后 close 前置齐备；close 时 task 迁移 done/ 并勾选 #13（逐文件显式 add · 禁 `git add -A`）。关账后归 00：KPI 收官裁定（30 自评 97 备料在 task KPI 节）· PLAN 波次表回写 · W2 可排程。

## 禁区遵守

未改 src/test/SPEC/PLAN/task 文/MIGRATION/既有 reviews/fixture 基线；本 invoke 单文件显式 add 独立 commit（`docs(3.0-W1): 40 invoke 留档（review-of-work 复核）`）；未 push/tag/publish/deprecate；未代签任何闸；扫描器未裸跑（A2 锁重跑走测试内机械比对 · 未再生成 rescan 产物）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 40 review-of-work 独立复核：PASS（blocking 0 · advisory 1）· 七项复跑逐字复现（667/130/666/0/1 · 17/17 · 110/110 · 6/6 · VERIFY: PASS）· compat sha256 对 tag 独立一致 · A2 锁/九条目/compat 锁三测试文件重跑全绿 · bin 面泛化渲染实证 · #10 diff 空 · MIGRATION 纯插入 · 本 invoke 留档 |
