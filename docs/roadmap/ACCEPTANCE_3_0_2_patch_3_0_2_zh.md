# ACCEPTANCE · 3.0.2 patch（消费侧反馈收口 W1–W2）台账

> **版本**：`spec-wave@3.0.2`（**待发版（publish 仅人）** · 2026-09-23 bump 已落 · tag `v3.0.2` **由 00 按维护者 2026-09-23 授权代打并随 `main` 原子推** · registry `latest` 真值 `3.0.1` 直至人 publish · **未**执行 npm publish / deprecate）
> **task**：[`docs/tasks/done/task_3_0_2_release_bump.md`](../tasks/done/task_3_0_2_release_bump.md)（slug `3-0-2-release-bump` · 无独立 SPEC 夹 · 属消费侧反馈 patch · 2026-09-23）
> **规划**：[`PLAN_3_0_2_patch_v1_zh.md`](PLAN_3_0_2_patch_v1_zh.md)（HG-NEXT-PLAN=approved · 授权 00 代签过程闸 + 验收后 tag/push 代跑）
> **范围主源**：ops-desk-api 反馈文 `FEEDBACK_spec_wave_3_0_1_from_ops_desk_api_20260923.md`（F-1~F-4 · 仓外 `docs/harness/evidence/`）
> **依据**：W1 / W2 done tasks + R1 审查文（各波 PASS · blocking 0）

## 修复清单（W1–W2 · 全 CLOSE: PASS）

| 波 | 反馈 | 摘要 | task |
|----|------|------|------|
| W1 | F-1① | tech-graph 词汇登记档补 `branches`/`triggers`（LangGraph 系普适边型）——消费仓 37+16 处不可行动 warning 清零 · 纯数据波 · `src/` 零改动 · 渲染零漂移（恒等 fixture 机械证明）· 本仓 dogfood 同款 4 处清零 | [`task_3_0_2_w1_tech_graph_vocab.md`](../tasks/done/task_3_0_2_w1_tech_graph_vocab.md)（commit `3358eaa`） |
| W2 | F-3/F-4 | `pins check/fix --consumer` 消费侧钉版保鲜闸：真值回退链（devDeps→deps→version）+ `--truth` + `.spec-wave/pins-consumer.yaml` 声明源（显式 > 缺省 · 存在且坏 failClosed）+ 内置 CI workflow 字面钉面（数字锚预筛）+ ^/~ 归一 WARN + S2 拒写复用 · **release 模式逐字不变**（pins-consistency 64/64 钉死）· A1–A7 十九用例 | [`task_3_0_2_w2_pins_consumer.md`](../tasks/done/task_3_0_2_w2_pins_consumer.md)（commit `297f881`） |

**延 3.1.0**：F-2 `graph drift` 图谱漂移机械闸 · F-1② 仓级词汇扩展档（`.spec-wave/graph-vocab.yaml` · 与 `.spec-wave/` 配置目录约定同波设计）。

## 门禁基线（release 簿记棒实测 · 2026-09-23）

| 门禁 | 结果 |
|------|------|
| `npm run typecheck` | 0 错 |
| `npm test` | **929 tests**（W2 +19）· 打 tag 前 926 pass + **2 tag-gated 设计红**（`release-tag-identity` + `pins-consistency` A 组 pin-10）+ 1 skip · **不是**产品回归 · 00 代打 tag 后须全绿 |
| `npm run build` / `test:lib` | exit 0 · test:lib **6/6** |
| `pins check` | **16/17** · 唯一偏差 = pin-10 git tag `v3.0.2` 缺失（**设计红** · 00 代打后复跑须 **17/17** · 清偿记录由 00 回填本档） |
| `assets verify` | **113/113**（pins fix 改写 ontology / discipline-coverage / host-adapt README 后 manifest rebuild ~3） |

## pin-10 设计红登记与清偿路径

- **登记**：bump 后 `pins check` 唯一偏差 = pin-10（tag `v3.0.2` 不存在 · 打 tag 前必经态 · 同 2.4.x/3.0.x 先例）。
- **清偿**：00 按 HG-RELEASE-TAG-PUSH=approved 执行 `git tag -a v3.0.2` → 复跑 `pins check` **17/17** + 全量 `npm test` 全绿 → `git push origin main v3.0.2` 原子推 → 探针代核（`git show v3.0.2:package.json` · `npm view` 仍 3.0.1 · `git ls-remote` 一致）。
- **回填位**：tag ↔ `<hash 由 00 回填>` · 17/17 复跑时间 `<由 00 回填>`。

## 3.0.1 回填清偿（本波顺带）

人 2026-09-18 publish 3.0.1 后未做 ⑨ 回填，本波按实测清偿（registry `latest=3.0.1` · `time.3.0.1`=2026-09-18T07:42:30Z · tag `v3.0.1` ↔ `0e6d861` · 均 2026-09-23 `npm view`（绕缓存）/git 实测）：CHANGELOG `[3.0.1]` 发布状态 · spec 索引行 · RELEASING 台账 + 人 checklist 3.0.1 节（标已完成按实勾选）· 手册头栏 · ACCEPTANCE_3_0_1 补注。

## 已知残余

- pin-10 / `release-tag-identity` 在 00 代打 `v3.0.2` 前为**设计红**（F-REL-07）· 不记为产品回归。
- registry `latest` 与「3.0.2 已 published」叙事回填归人 publish 后 ⑨ · 本档与全仓文档**不冒充已发布**（registry 真值一律写 `3.0.1`）。
- 本机 `~/.npm-local` 缓存含 root-owned 文件 ⇒ `npm pack` EPERM（环境问题 · `npm_config_cache=/tmp` 可绕过）· **人 publish 前须 `sudo chown -R 501:20 ~/.npm-local` 或设 `npm_config_cache`**（已入 RELEASING 人 checklist 3.0.2 节第 3 项）。

## 发布边界

- 本棒只做 bump 簿记（①–⑨）。**未**执行 `git tag` / `git push`（归 00 按 HG-RELEASE-TAG-PUSH 授权执行 · 前置 = 验收全绿）· **未**执行 `npm publish` / `npm deprecate`（仅人 · HG-RELEASE-PUBLISH 不在授权面）· **未**用 `npm version` · **未**改 W1–W2 产品行为 · **未**触 host-adapt schema · **未**动 `eval/` 分支搭车档。
- RELEASING 人 checklist `3.0.2` 节已备（tag/push 预勾留哈希回填位 · publish 及之后全未勾）· 3.0.1 节标已完成。
- 使用手册保留文件名 `docs/guides/使用手册-v3.0.0-zh.md`；头栏钉 `spec-wave@3.0.2`（待发版 · publish 待人）。
- MIGRATION「3.0.1 → 3.0.2 无强制动作项」在档（W2 段7 已写）。
- spec 索引 `3.0.2`（patch 收尾行）经 pin-08 语义格位机检合格（行文本 10-task 棒探针预验证 PASS）。
