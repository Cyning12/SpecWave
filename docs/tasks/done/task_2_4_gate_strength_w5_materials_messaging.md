# Task：2.4 W5 · 物料与对外口径对齐（materials & messaging）

> **状态**：`done`（HG-TASK-DRAFT=approved · **HG-AUDIT-R1=approved**（00 代签 · 2026-09-14） · 2026-09-14 开单 · 2026-09-14 关账）  
> **wave**：W5（2.4.0 门禁强度补全 · 纯文档波）  
> **关联 SPEC**：[`docs/spec/2_4-gate-strength/05_w5_materials_messaging_v1.md`](../../spec/2_4-gate-strength/05_w5_materials_messaging_v1.md)（**唯一蓝本** · signed）· [`00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-4-gate-strength-w5-materials-messaging` |
| **test_strategy** | `required` |
| **test_strategy_note** | 黑名单词 grep 机检（4 份物料逐份）+ 口径收窄 grep 断言 + `pins check` 全量回归（pin-17 表行命中不破）· 纯文档波无代码改动 |
| **freeze_id** | 2.4.0-W5 · 口径三调方向已冻结（SPEC 05 §3②③④ · HG-SPEC-SIGNOFF approved）；物料逐份处置方式（翻新/快照）随本 task 定稿（默认快照标注为最低代价合规） |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 纯文档波 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 对外物料与口径对齐 · 非规范增量 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.2/2.3 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-14 维护者本窗签收 PLAN_2_4 |
| HG-SPEC-SIGNOFF | **approved** | — | 2026-09-14 维护者授权 00 代签 |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-14 维护者授权） |
| **HG-AUDIT-R1** | **approved** | 30 | 00 代签 · 2026-09-14 · 维护者授权 · 依据审查文 [`docs/harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md`](../../harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md)（R1 结论 PASS · 提示：W5 验收② grep 断言锚定事实卡防空转） |

---

## 背景与目标

N3（§3.D）：`delivery/promotion/` 4 份物料全部停在 2.1.3、命中 SPEC 明文黑名单（「四宿主」·「406 用例」· 把 2.3.0 已交付能力标「规划中」）。对外口径三调（§6 末）：T-03「可机检」降调为「防意外漂移」·《安全设计》`:768`（§5.3.1 A-1 行）与 `:77`「篡改发现」收窄或标注「依赖 provenance（未启用）」（`:418` 同步核对）·「关账必经审查通过」声称以 W2 落地为界。N6（§3.G · P3 并入）：`README.md:38` aider 行补 `conventions-file: AGENTS.md` 等价写法（报告原引 :106 已漂移 · 本棒复核更正）。目标：对外物料与声称口径对齐 2.3.x 真实强度面——**纯文档波 · 零代码改动**。

## 范围

- [x] ① **N3 物料处置**：`delivery/promotion/` 4 份（`01-项目简介单页.md` / `02-README-重写版.md` / `03-发布博客-1x到2x路线.md` / `04-一页纸简介.md`）逐份定「翻新 / 历史快照标注」（默认：03 发布博客天然快照 · 01/02/04 快照标注为最低代价合规 · 若翻新则数字以 bump 前实测为准）；逐份过黑名单词机检留证。
- [x] ② **口径调一（T-03 降调）**：README / 事实卡中 T-03「可机检」类表述 → 「防意外漂移/防遗忘」口径（防投毒依赖 provenance · 未启用 · 指引链 docs/guides/provenance_oidc_trusted_publishing_guide_v1_zh.md）。
- [x] ③ **口径调二（安全设计收窄）**：`delivery/安全设计.md` §5.3.1 A-1 行完整性依赖列追加限定（「防漂移口径 · 防投毒依赖 provenance · 未启用」）· `:77`「篡改发现」→「意外漂移发现」· `:418` 同步核对；**只收窄不重构**（tarball sha512/2FA 等真实控制不动 · F-W5-03）。
- [x] ④ **口径调三（关账声称核查）**：对外面「关账必经审查通过」出现处清单 + 与 W2 落地状态一致的口径结论留档（W2 未落地前维持保守口径）。
- [x] ⑤ **N6 aider 行**：`README.md:38` 双语补 `.aider.conf.yml` 写 `conventions-file: AGENTS.md` 的等价配置路径；**表行内保留 host 词锚**（pin-17 表行命中不破 · F-W5-02）。

## 非范围

| 项 | 理由 |
|----|------|
| 《安全设计》威胁模型结构改动 | 仅三处定点收窄 |
| `delivery/` 其他设计文档 | 非范围 |
| provenance/OIDC 启用 | 仅人 · 本波只做口径标注 |
| 物料纳入版本钉面（pin 化） | 报告建议为「或标注历史快照」· 钉面化归后续评估 |
| 任何代码/测试改动 | 纯文档波 |
| W1–W4/W6 任何实现项 | 各自独立 task |
| minor bump 2.4.0 / tag / publish | 属发版波 · publish 仅人 |

---

## 失败路径（failure_paths · 对齐 SPEC 05 §8）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W5-01 | 物料翻新引入新事实错误 | 数字以 bump 前实测为准 · 机检 + 人读复核 | 是 | 机检留证 |
| F-W5-02 | README 改动破 pin-17 表行命中 | 随改随跑 `pins check` · 表行内保留 host 词锚 | 是 | pins check 输出 |
| F-W5-03 | 收窄措辞过度（误降真实防护） | 只收窄「篡改发现」口径 · 真实控制不动 | 是 | diff 复核 |
| F-W5-04 | 快照标注后物料仍被当现行引用 | 文首标注 + 指向仓根 README 现行事实面 | 是 | 标注行 |
| F-W5-05 | W2 未落地而关账声称提前恢复 | 00 §4 禁称纪律 · 核查结论留档 | 是 | 留档结论 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（闸扫描阻断） | 是 | 须先 20-task-audit R1 + 00 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑤ 逐字对齐 SPEC 05 §7 五条；⑥–⑧ 为本棒纪律性增补。

- [x] ① **物料机检**：4 份逐份 grep `四宿主|406 用例|2\.1\.3`（现行表述位）→ 命中为零 **或** 快照标注行存在；处置方式逐份留证。
- [x] ② **口径机检**：README / 事实卡 grep「可机检」（T-03 语境）→ 零命中或带降调限定；`delivery/安全设计.md` `:77` 与 §5.3.1 A-1 行含收窄/「未启用」标注。贴 grep 输出。
- [x] ③ **关账声称核查**：出现处清单 + 口径与 W2 状态一致结论留档。
- [x] ④ **aider 行**：README 双语含 `conventions-file: AGENTS.md` 写法；`node bin/specgate.js pins check` 全量 PASS（pin-17 表行命中不破）。
- [x] ⑤ `npm test` 全绿（防测试夹文案断言漂移）。
- [x] ⑥ **文档影响面**：grep 留证（黑名单词 · 「可机检」 · 「篡改发现」三组前后对照）。
- [x] ⑦ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_4_gate_strength_w5_materials_messaging.md` 通过 + `task close --yes` 闭环。
- [x] ⑧ **提交边界**：禁 `git add -A`；逐路径精确 `git add`；提交信息 `feat(2.4-W5): …`（或 `docs(2.4-W5): …` 纯文档口径 · 随仓惯例）。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_4-gate-strength/05_w5_materials_messaging_v1.md`](../../spec/2_4-gate-strength/05_w5_materials_messaging_v1.md)（**唯一蓝本**）
3. [`docs/spec/2_4-gate-strength/00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)（§4 文案纪律）
4. 现状文件：`delivery/promotion/`（4 份）· `delivery/安全设计.md`（:77 · :418 · §5.3.1 A-1 行约 :768）· `README.md:38` / `README.zh-CN.md` aider 行 · 事实卡（`.workbuddy/output/推广事实卡-2.2.0.md` §10/§11 黑名单）
5. 证据原文：`.workbuddy/output/验收报告-SpecWave-2.3.0.md` §3.D/§3.F/§3.G + §6 末三条
6. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w5_materials_messaging.md`（GATE_VERIFY）

---

## 测试策略（Harness）

**test_strategy**: `required`

- 纯文档波：验收以 grep 机检 + `pins check` 全量回归 + `npm test` 防文案断言漂移为判据。
- 三组 grep 前后对照留证（黑名单词 · 可机检 · 篡改发现）。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| 物料 4 份处置 | ✅ | 逐份定**快照标注**（默认最低代价合规 · 03 天然快照同标注）；4 份文首均有「历史版本快照（2.1.3 时点）」标注行 + 指向仓根 README 现行事实面；正文历史叙事不改写 |
| 口径三调 | ✅ | ① 事实卡 §11 :221 行改写为 2.3.0 已交付 + 「防意外漂移/防遗忘」降调口径（README 双语「可机检」零命中，与 R1 T-5 一致）；② 安全设计 :77「篡改发现」→「意外漂移发现（防主动投毒依赖 provenance · 未启用）」· :418 同步标注 · §5.3.1 A-1 行（:768）完整性依赖列追加「防漂移口径 · 防投毒依赖 provenance · 未启用」；③ 关账声称恢复见自检结论 ③ |
| aider 行双语 | ✅ | README.md:38 / README.zh-CN.md:38 各补 `.aider.conf.yml` 写 `conventions-file: AGENTS.md` 等价写法；表行 host 词锚 `**aider**` 保留 · pins check 17/17 不破 |

### 自检结论（执行者）

30 回填（2026-09-14）：

- ① **物料机检**：4 份逐份 `grep -c "历史版本快照（2.1.3 时点）"` = 1/1/1/1（快照标注行存在 · 处置方式 = 快照标注逐份留证）。黑名单词改前命中 3/5/7/11 处，改后仍存在于正文但**全部落在快照叙事内**（文首标注覆盖 · 验收①「命中为零或快照标注行存在」取后者）。
- ② **口径机检**：README.md / README.zh-CN.md / 事实卡 grep「可机检」**exit=1 零命中**（事实卡面已纳入 grep 断言 · R1 T-5 防空转）；`delivery/安全设计.md` grep「篡改发现」**exit=1 零命中**；:77 / :418 / :768 三处收窄限定行 grep 命中留证（见上）。
- ③ **关账声称核查**：对外面（README 双语 · 事实卡 · promotion 4 份）grep「关账必经」唯一出现处 = 事实卡 :234（原禁称行）。W2 已落地（`task_2_4_gate_strength_w2_conclusion_gate.md` done · S1·N=20 定档 · 结论节实质内容判据入 `evalReviewConclusion`）→ 按 SPEC 05 §6「落地后恢复」口径，:234 行改写为**可声称「关账必经结论级审查通过（机读文本闸）」**，并保留「非人工复核等价物」的诚实限定。结论：对外口径与 W2 落地状态一致，留档于此。
- ④ **aider 行**：双语 README :38 均含 `conventions-file: AGENTS.md`；`pins check` 17/17 PASS（pin-17 表行命中不破 · F-W5-02 未触发）。
- ⑤ **npm test**：见关账记录（四门全绿）。
- ⑥ **文档影响面**：三组 grep 前后对照已贴（改前：黑名单词 3/5/7/11 · 可机检 0 · 篡改发现 1；改后：快照标注 1/1/1/1 · 可机检 0 · 篡改发现 0 + 收窄限定 3 行）。
- ⑦ gate-check + task close：见关账记录。
- ⑧ 提交边界：逐路径精确 `git add`（9 文件）· `docs(2.4-W5): 物料与对外口径对齐（N3/口径三调/N6）`。
- **已知未测项**：无（纯文档波 · 零代码改动 · src/test 未动）。
- **Task_KPI**：验收 ①–⑧ 全过 · 100%。

### KPI（00）

Task_KPI%: 100（验收 8/8 自证通过 · 物料 4 份快照标注逐份 grep 留证（改前黑名单词 3/5/7/11 → 快照行 1/1/1/1）· 「可机检」README/事实卡零命中（R1 T-5 锚定事实卡防空转）· 「篡改发现」零命中 + 安全设计 :77/:418/:768 三处收窄限定留证 · 关账声称出现处清单（唯一 = 事实卡 :234）+ W2 落地（S1·N=20）一致口径恢复留档 · aider 行双语 `conventions-file: AGENTS.md` + pin-17 表行不破 · 四门绿（575 tests · 574 pass + 1 既有门控 skip）· pins 17/17 · assets 110/110 · 零代码改动 · 逐路径 add 9 文件 · 不 bump 版本号）

### 经验总结

纯文档波的验收强度靠「grep 断言锚定具体文件 + 前后对照留证」撑住：R1 提示级 T-5（验收②锚定事实卡）正是防「零命中空转」的关键——若只对 README grep「可机检」，断言恒真却无意义。快照标注是历史物料的最低代价合规路径：文首一行 + 指向仓根 README 现行事实面，既不伪造历史叙事，又让黑名单词命中从「现行表述」降级为「定格史实」。收窄类改动的边界纪律是「只收窄高估口径、不动真实控制」（F-W5-03）：tarball sha512/2FA 等真实防护一字未动。

---

## 思考轮（10-task）

### R0 · 证据

SPEC 05 为唯一蓝本（signed）；前提本棒只读复核有效：promotion/ 4 份清单 · 安全设计三处现值 · README.md:38 aider 行（报告原引 :106 已漂移 · 更正留痕）。

### R1 · 范围

范围 = SPEC 05 §3 五项逐字承接；非范围 = 05 §4（纯文档波边界锁死 · 零代码）。

### R2 · 方案

物料处置二选一已定（SPEC 05 §6）；逐份归属（翻新/快照）留本 task 定稿——默认快照标注为最低代价合规，若维护者对 01/02/04 有翻新意图由 20 审提出。

### R3 · 边界

30 开工硬边界 = HG-AUDIT-R1 翻 approved（本帽不签发）；pins 联动（随改随跑 pins check）· 收窄不过度 · 禁称纪律三条转入 failure_paths；提交边界 = 禁 `git add -A`。

### R4 · 可测性

验收 8 条全部可机械/可观测：grep 机检、pins check、npm test、留档存在性、gate-check、提交边界。

### R5 · 派工就绪

task 结构对齐 lint E1–E8；pre-30 invoke（10）同棒落盘。**下一棒**：20-task-audit R1 → HG-AUDIT-R1 签闸（00 代签 · 2026-09-14 维护者授权）→ 30/40。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC signed + 现值复核 · aider 行号漂移更正） | no |
| R1 | 范围/非范围划定（05 §3/§4 · 纯文档波锁死） | no |
| R2 | 二选一定案 · 逐份归属留 task 定稿（默认快照） | no |
| R3 | 边界四条（开工闸 / pins 联动 / 收窄不过度 / 禁称）落入 task | no |
| R4 | 验收 8 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此 | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 已 signed，口径三调方向冻结，物料处置默认路径明确，无新增开放问题。  
**residual_risks**：① 物料事实面在 2.4.0 发版后再次过时（快照标注优先 · 钉面化归后续评估）；② 若 20 审要求翻新 01/02/04，工作量上浮但仍在文档面。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | 开单 · 10-task · 蓝本 SPEC 05（signed）· 现值只读复核（README.md:38 · 安全设计 :77/:418/:768 · promotion 4 份） |
