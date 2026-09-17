# Invoke：40（review-of-work 独立复核）· 3-0-w3-ontology-graph

| 字段 | 值 |
|------|-----|
| hat_id | 40 |
| task_slug | `3-0-w3-ontology-graph` |
| task_paths | `docs/tasks/active/task_3_0_w3_ontology_graph.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |
| 复核对象 | `5fe92df..0ef6741` 七 commit（5fe92df docs / d960bc8 接线 / 28cd0bd 补声明 / b710c0c F2 / e2f775d 判据加固 / a192bd9 F1 / 0ef6741 ONTO-OPEN+挂起登记）· HEAD = `0ef6741` · 工作树净 |

## 复核范围

独立实测复核（不接受「30 说绿」）：八命令独立复跑 + 探针复跑 · 验收 #1–#14 抽核（重点 #1/#2/#3/#6/#7/#8/#5/#12）· 单源断言复核 · 既有面零改动核对 · 两登记项（exit1→2 裁决 · stderr Warning 划界）独立判断 · 七 commit 逐笔粒度核对 · KPI/自检回填核对。禁区遵守：不改 src/test/ontology.yaml/SPEC/PLAN/task 文 · 不代签闸 · 不 push/tag（S2 只新增本 invoke 一件）。

## 独立实测证据（本棒亲跑 · 2026-09-17 · HEAD 0ef6741）

| 命令 | 实测结果 | 判定 |
|------|----------|------|
| `npm run typecheck` | **0 错**（exit 0） | PASS |
| `npm run build` | **0 错**（exit 0） | PASS |
| `npm test` | **773 tests / 145 suites / 772 pass / 0 fail / 1 skip**（duration ≈98.3s · 与预期逐字一致 · 零意外红） | PASS |
| `npm run test:lib` | **6/6 pass · 0 fail**（exit 0） | PASS |
| `node bin/specgate.js pins check` | **17/17 PASS** | PASS |
| `node bin/specgate.js assets verify` | **111/111 PASS** | PASS |
| `node bin/specgate.js verify --target . --task …` | **VERIFY: PASS**（HG-TASK-DRAFT / HG-AUDIT-R1 双 approved · ✅ 可 30） | PASS |
| `node bin/specgate.js task lint --file …` | **LINT: PASS**（验收 #13 · 回填后复跑） | PASS |
| `node scripts/onto-probe.mts` | **conforms: false · Violation ×1 = TraceArtifact（relations[3].object）· exit 2**（挂起锁在案 · 3→1 与校验器同值） | PASS |
| `graph ontology check`（仓内件） | **exit 2 · Violation ×1 = TraceArtifact 点名** · profile `spec-wave-shacl-subset/v1` · --json 键集 {command,ontology,profile,shapes,entities,conforms,violations} 钉死 | PASS |

## 验收抽核要点

- **#1 ontology-check 双向**：`test/ontology-check.test.ts` 抽跑 **11/11**（负向 ×6 报红点名 exit 2 · 合规报绿 · VersionShape 恒 Warning 含 see pin-03 · 不可读/解析失败 exit 2 · 登记项钉 Violation×1）。**profile 声明无 W3C**：grep `W3C` src/ = **零命中**（报告串仅「SHACL 语义子集 · 不声称标准合规」）。
- **#2/#3 挂起分支合规**：**机械锁钉死** —— ontology check 与探针独立复跑双双 exit 2 · Violation ×1 = TraceArtifact（3→1 · 未翻 0）；**登记落点双在案**（task 自检结论 #3 行 + 30 invoke 阶段四「TraceArtifact 挂起登记」节）；**维护者答复口径两处一致**（「倾向 b 但对 Artifact 不明确 · 后续再考虑」· 问法 a/b/c 三态全文入 30 invoke）；**ontology.yaml 实证无声明无豁免**（classes 17 项全读 · 无 TraceArtifact 类 · 头注释无豁免清单 · produces.object 未动）—— 未得确答不动本体 · 未静默放过 · 未擅自二选一：合规。
- **#6 恒等三方 + 单源**：`test/f1-unify.test.ts` 抽跑 **13/13**；**40 独立恒等复验**：`graph yaml compile --graph-id 00_main` 产物与 tracked `00_main.md` **逐字等**（exit 0）· `graph yaml export` 再生成 `shared/graph.json` 与 tracked **逐字等**（git diff 0 字节）；**单源 grep**：src 内 `'flow'/'struct'/'external'` 引号字面量**零残留** · `loadTechGraphVocab` 唯一定义点（cli-graph-yaml.ts:56）+ 三消费点（:91/:154/:481）· A3 第二硬拷贝 KIND_TO_CLASS（:481）实证已迁登记档驱动。
- **#7 零新依赖**：`git diff 5fe92df..HEAD -- package.json package-lock.json` = **空** · dependencies = 仅 `js-yaml ^4.1.0` · lock 非 dev 顶层复算 = **2**（argparse · js-yaml）不增。
- **#8 判据六项**：`test/graph-axioms-hardening.test.ts` 抽跑 **9/9**（附录 A 六构造机械复现 · 真红残留面钉死）；D2 修复源码实读：`hatIdMatchesSegment`（cli-graph-hgm.ts:364-366）= `split('-')[0] === segment` 段边界等值判 · **裸子串已除** · S4.5 hat 词汇面同口径单源复用。
- **#5/#12 文案机检**：`test/onto-open-docs.test.ts` 抽跑 **6/6**；正向 grep：README.md:213 / README.zh-CN.md:213 双含「不提供自定义本体能力」登记句（开放/不开放分述 + 复议触发指向研究文 §7.3）；**40 独立负向 grep**：暗示词表（可扩展本体/自定义本体/custom ontology/extensible ontology）README 面零命中（仅登记句自身否定语境）· docs/ 命中全在豁免清单（研究文/SPEC/PLAN/task/invokes 裁决叙述）；W3C 全仓命中仅限豁免区 · README/docs-ontology/src 零命中。
- **#11 既有面零改动**：`git diff 5fe92df..HEAD --stat -- test/` = **新增 5 件**（ontology-check 288 / cli-f2-asset-source 230 / graph-axioms-hardening 255 / f1-unify 322 / onto-open-docs 128）+ **assets-ontology.test.ts 唯一授权改动**（A4 登记式翻转 · diff 逐字核对 = 30 invoke 登记节：删 /未接线/ 断言 · 增 graph ontology check 钉 + 未接线零残留断言）· w1-detect 不在本波实证零触碰 · cli-g1g7/cli-json-no-abs-path/graph yaml 系/pins-consistency 系零 diff 全绿。
- **#14 粒度**：七 commit `git show --stat` 逐笔核对 —— 各 commit 文件集与主题自洽（d960bc8 接线 6 件 · 28cd0bd 补声明 4 件 · b710c0c F2 2 件 · e2f775d 判据 3 件 · a192bd9 F1 7 件 · 0ef6741 docs+机检 9 件）· 无裹挟域外档 · 工作树净 · HEAD 无 tag · `@{u}..HEAD` = 七笔全未 push。
- **#2 前置真值面保护**：基线节「接线前 3 处」留证未改写（探针头注释与 §6.1 在案 · 现状 3→1 是修复结果非历史改写）。

## 两登记项独立判断（备 20 复核项 · 40 独立裁定）

1. **阶段二 exit1→2 裁决：成立**。task S4.3「exit 2 fail-closed（现状 :57 同口径延续）」字面自相矛盾（:57 旧 fail 缺省 exit 1）；30 采统一 exit 2 —— 40 独立 grep 实证 cli-lifecycle 测试面**零 exit 1 缺件钉** · 全套件 773 绿无隐藏钉面 · fail-closed=exit 2 是仓内一致语义（F-W3-01/ontology-check/loadDiscipline 校验失败同口径）。裁决方向正确 · task 文自相矛盾是起草瑕疵（非 30 责任面）。
2. **阶段三 stderr Warning 划界：成立**。验收 #6「三面输出与 exit 零漂移」vs 钩② stderr 新增 7 条 —— 40 独立复跑计数与 30 invoke 逐字一致（00_main triggers×4 · 10_flow_task_close×2 · 10_flow_verify×1 = 7）· stdout 产物与 tracked 逐字等 · exit 0。钩②是 task S4.5-3 明示的 Warning 级新增面 · F-W3-12 只禁「误咬 exit / 校验结果漂移」· stderr 是设计内可见性通道 —— 「零漂移」按 stdout/产物/exit 划界的登记论证成立。

## 发现清单

**blocking：0**

**advisory：2**

- **A-40-1（信息登记 · 非打回）**：`scripts/onto-probe.mts` 头注释 :13-14「预期：conforms: false，**3 处** VIOLATION」为修复前真值面留证（30 偏差登记 ② 明示保留独立实现作研究证据 · 属有意）；但对今日运行者而言「预期」行已与实测（1 处）不符 —— 建议 3.x TraceArtifact 处置落地（探针随数据面翻 0）时同步刷新该行注记，避免误读。
- **A-40-2（信息登记 · 域外）**：复核实测发现 `graph yaml export` 的出路径旗标为 `--out`（help 在案），误用 `--output` 时静默忽略并写缺省 `shared/graph.json` —— 系既有 CLI 行为 · 非本波 delta（a192bd9 未触碰该解析面）· 本次再生成产物与 tracked 逐字等（git diff 0 字节 · 未造成污染）。未知旗标静默忽略可入 3.x 候选（fail-loud 化），与本 task 验收无关。
- 另注：npm test duration ≈98.3s vs 基线 ≈94s（+4 套件加性）—— 在验收 #10「加性克制」口径内，不构成发现。

## 结论

**PASS**（blocking 0 · advisory 2 皆信息级）—— 十命令独立复跑计数与 30 自检逐字一致（773/145/772/0/1 · typecheck/build 0 错 · test:lib 6/6 · pins 17/17 · assets 111/111 · verify PASS · 探针/校验器双 exit 2 Violation×1）· 验收 #1–#14 抽核全绿（#2/#3 挂起分支合规：机械锁钉死 + 登记双落点 + 答复口径一致 + 本体无声明无豁免实证）· 恒等三方 40 独立复验逐字等 · 单源 grep 零残留 · 既有面仅 A4 授权翻转一件合规登记 · 两登记项独立判断双双成立 · commit 卫生净 · KPI 95 备料与自检回填完整（挂起勾注规范）。

## 下一棒

**30 close --yes**：`npx spec-wave gate-check --task docs/tasks/active/task_3_0_w3_ontology_graph.md`（exit 0）→ `task close --yes` 闭环 → 00 收官（KPI 裁定 · 归档 done/ · TraceArtifact 挂起项归 3.x 对账跟踪）。push 仅人。

## 禁区遵守

- 未改 src / test / ontology.yaml / SPEC / PLAN / task 文 / reviews 既有档（S2 只新增本 invoke 一件 · 单文件显式 add）
- 未代签任何闸 · 未执行 push / tag / publish / deprecate

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 40 独立复核落档：十命令复跑全绿 · 验收 #1–#14 抽核 · 两登记项独立判断成立 · blocking 0 / advisory 2（信息级）· PASS |
