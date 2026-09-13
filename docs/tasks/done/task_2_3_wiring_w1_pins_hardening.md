# Task：2.3 W1 · pins 机制补强（pins hardening）· 本次核心波

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-12）  
> **wave**：W1（2.3.0 接线补全 · 核心波）  
> **关联 SPEC**：[`docs/spec/2_3-wiring-completion/01_w1_pins_hardening_v1.md`](../../spec/2_3-wiring-completion/01_w1_pins_hardening_v1.md)（**唯一蓝本** · signed）· [`00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-3-wiring-w1-pins-hardening` |
| **test_strategy** | `required` |
| **test_strategy_note** | `test/pins-consistency.test.ts` 扩组（pin-04/06/07/10/11/12 失配 fixture 真失败 + pin-13/14/15 三面破坏-修复 + pin-08 严化反例）；`test/cli-verify-spec.test.ts` 增目录型 slug 正/负向；破坏性自证为验收硬条款 |
| **freeze_id** | 2.3.0-W1 · D-23-PIN08-STRICT / D-23-PIN-3FACES / D-23-SPEC-SLUG 已冻结（SPEC 01 §6 采纳推荐 · HG-SPEC-SIGNOFF approved 冻结） |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 定点修复 + 数据新增，不改架构图谱（00 §3 F1 架构项归 3.0） |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 产品机制补强（pins 数据 + 单点修复），非编码规范/流程增量 · 无 wiki 落点 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.1.2/2.2 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表 |
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表（D-23-* 三定案已冻结） |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-12 维护者会话授权） |
| **HG-AUDIT-R1** | **approved** | 30 | **2026-09-12 维护者会话授权 00 代签** · 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w1_pins_hardening_audit_R1_20260912.md`） |

---

## 背景与目标

2.2.0 W1 建起版本/身份钉门禁（12 钉面 · exit 2 · S2 拒写无豁免），2.2.1 修掉 P1 静默部分修复；对抗验收仍留四处「门禁建了但钉不严」缺口（SPEC 01 §1 五项，前提经 10-spec 只读复核 + 本棒复核有效：pin-08 弱钉见 `src/cli-pins.ts:213-229` 仅要求「`|` 行含版本串」· 三面未入钉见 `assets/release-pins.yaml` pin-01..12 无 CHANGELOG/MIGRATION/AGENTS 落点 · slug 回退见 `src/cli-checks.ts:554-561` basename 无 README/index 父目录归一）。目标：钉面「声明即严」——弱钉改严、醒目版本面全入钉、每钉面有失配负向、slug 推导按目录型正确归一；全部以**数据/定点修复**完成，不动 pins 引擎架构。

**已定案（冻结 · 不得翻案）**：

- **D-23-PIN08-STRICT**：pin-08 严化 = 版本串落状态/描述单元格 + 行身份双判（机械口径见「范围 ①」，本 task 定稿）。
- **D-23-PIN-3FACES**：三面入钉 = 纯数据 pin-13/14/15（不改 pins 代码）。
- **D-23-SPEC-SLUG**：`extractSpecSlug` 回退 basename ∈ {`README`, `index`}（大小写不敏感）→ 取父目录名为 slug。

## 范围

- [x] ① **pin-08 弱钉改严**（`src/cli-pins.ts` spec-index-row 提取实现定点改严 + `assets/release-pins.yaml` pin-08 semantics 数据声明更新）。机械口径（本 task 定稿 · D-23-PIN08-STRICT 落地）：对 `docs/spec/README.md` 逐行扫描，行以 `|` 开头 → 按 `|` 分列 trim 去首末空单元格 → cells[0]=slug 列 / cells[1]=路径列 / cells[2]=状态列 / cells[3+]=描述列。**行合格 ⟺ (A) 状态列或描述列含版本串（点式 `X.Y.Z` 或下划线式 `X_Y_Z`）且 (B) slug 列含版本串（点式/下划线式）或 slug 列去反引号后以 `X_Y-` 前缀开头（minor 主题夹行）**。无合格行 → mismatch（exit 2），detail 附「兜底嫌疑行」= 满足 (A) 不满足 (B) 的行号列表（指出别行 prose 兜底位置）；fixable=false 保持（人工补行，沿袭现状 F-W1-01）。
- [x] ② **三面入钉（纯数据 pin-13/14/15 · 不改 pins 代码）**：
  - pin-13 `CHANGELOG.md`：`regex` `^## \[(\d+\.\d+\.\d+)\]` flags m（首个非 Unreleased 发布头 · Unreleased 无数字天然跳过）· fixable=true（capture group 回写版本号 · 不动日期行其余）。
  - pin-14 `MIGRATION.md`：`regex-all` `spec-wave@(\d+\.\d+\.\d+)` flags g（沿袭 pin-05/06 先例）· fixable=true。yaml note 写清：现行 4 处（:3/:4/:7/:85）全为现行指引；历史叙事行均为 `dsh-coding-kit@…`/`@cyning/harness` 形态，不被本模式命中（2026-09-12 逐行核对）。
  - pin-15 `AGENTS.md`：`regex-all` `npx spec-wave@(\d+\.\d+\.\d+)` flags g · fixable=true。fix 只替换版本串 capture group，不动 cyning-harness 产品块/marker 结构（F-W1-04；现行唯一出现处 :61 在 local 块）。
- [x] ③ **失配 fixture 补全**（`test/pins-consistency.test.ts`）：pin-04/06/07/10/11/12 每钉一个失配用例（构造该钉面偏差 → `pins check` exit 2 且输出指出正确 `文件:行号`）；pin-10 以「git 仓无该 tag」构造（测试内 `git init` 隔离环境，**不真打 tag**）。
- [x] ④ **`extractSpecSlug` 目录型回退修复**（`src/cli-checks.ts:554-561` 单点）：spec_slug 元信息优先（现状保持）；回退链 basename 去 `SPEC[-_]` 前缀与 `_v<n>` 后缀后，若结果 ∈ {`readme`, `index`}（大小写不敏感）→ 取父目录名为 slug（normalize 归一在 findSpecReview 既有 `normalizeSlug` 消费侧生效）。**附带止血**：`verify --spec` 传目录路径本身（非文件）由裸 EISDIR 崩溃收口为干净「用法错」fail(exit 1)（F-W1-05 · 不新增目录直读能力）。测试：`test/cli-verify-spec.test.ts` 增目录型正/负向（`docs/spec/<slug>/README.md` 与 `SPEC_<slug>_v1.md` 两形态对同一审查文判定一致；目录路径 exit 1）。
- [x] ⑤ **同文件钉面模式重叠 unfixable 误报评估**：评估「regex-all 覆盖面包含 regex 单点面」时 2.2.1 按文件聚合写盘后是否出现「actual 已正确却被判 unfixable/mismatch」误报路径；评估文落盘 `docs/harness/invokes/by-task/2-3-wiring-w1-pins-hardening/eval_unfixable_overlap_20260912.md`（结论：修 / 不修 + 理由 + 若修代价估算）；结论摘要入本 task 自检结论。**实现非必须**（SPEC 01 §4 明列）。

## 非范围

| 项 | 理由 |
|----|------|
| pins 引擎架构改动（新 extract kind 体系、并行化等） | SPEC 01 §4 · 本波只做定点 |
| unfixable 误报的实现修复 | ⑤ 明确「可只留评估结论不实现」 |
| S2 目录任何写（pins fix 拒写语义保持） | 00 §1 · 机械拒写无豁免 |
| git tag 自动化（pin-10 fixable） | git 操作仅人（F-A1-05 沿袭） |
| pin-01 不可独立证伪 | 设计使然（真值源 self）· 验收报告已定性 |
| RELEASING.md 措辞改动 | 双重敏感（pin-07 + 九步顺序测正则）· 本波零改动；若被迫动措辞必跑全量 npm test |
| 给 pins 或任何既有门禁加 `--force` / `--allow-*` 绕过参数 | P0-GATE 硬纪律（00 §2）· 拒设计 |
| host-adapt schema / W2–W7 任何实现项 | 00 §3 · 各自独立 task |
| minor bump 2.3.0 / tag / publish | 属发版波 · publish 仅人 |

---

## 失败路径（failure_paths · 对齐 SPEC 01 §8）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W1-01 | pin-08 严化后索引行缺失/版本漂移 | exit 2 · 指出 `docs/spec/README.md` 兜底嫌疑行号 · fixable=false（人工补行） | 是 | mismatch 含 detail 诊断 |
| F-W1-02 | CHANGELOG 无发布头（仅 Unreleased） | pin-13 零命中 → extract_error · exit 2 · 不静默跳过 | 是 | 报错指文件与 extract 表达式 |
| F-W1-03 | MIGRATION/AGENTS 含历史版本叙事行 | extract 口径只钉现行出现处（yaml note 写清）；误钉则返修数据 | 是 | 失配输出指出 `文件:行号` |
| F-W1-04 | fix 写 AGENTS.md 触碰产品块结构 | 只替换版本串（regex capture group 回写）· 不动 marker 块；测试断言块标记完整 | 是 | 块标记完整由测试钉死 |
| F-W1-05 | `--spec` 传目录路径本身（非文件） | 干净「用法错」fail(exit 1)（止血裸 EISDIR 崩溃）· 不新增目录直读能力 | 是 | 用法错文案 |
| F-W1-06 | slug 父目录名含大写/非法字符 | normalizeSlug 归一后比对；归一后仍不匹配 → 审查文缺失 exit 2（failClosed 现状语义） | 是 | missing spec R<n> review |
| F-W1-07 | 评估结论为「不修」 | 评估文落盘即关账 · 不视为范围缺口 | — | 评估文含理由 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（`npx spec-wave verify --task` 闸扫描阻断） | 是 | 须先 20-task-audit R1 + 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑦ 逐字对齐 SPEC 01 §7 七条；⑧–⑩ 为本棒纪律性增补（TEST-LOCK 影响面 / gate-check+close / 提交边界）。

- [x] ① **pin-08 严化破坏性自证**：把 `docs/spec/README.md` 当前版本行（L18 `2.2.1` patch 收尾行）版本串改 `9.9.9`（保持别行 prose 含正确版本，如向 `2_3-wiring-completion` 行一句话列注入 `spec-wave@2.2.1`）→ `pins check` **exit 2** 且输出指出该文件与兜底嫌疑行；改回后 PASS。贴实际命令与输出。
- [x] ② **严化回归**：现行 `docs/spec/README.md` 全部存量行在新口径下 PASS（15/15 钉面全绿）。
- [x] ③ **三面入钉**：`pins check` 落点数 12 → 15 且全 PASS；分别对 CHANGELOG 最新发布头 / MIGRATION `spec-wave@X` / AGENTS `npx spec-wave@X` 制造偏差 → 各报 `文件:行号` exit 2 → `pins fix --yes` 收敛（贴实际命令与输出）。
- [x] ④ **fixture 真失败**：pin-04/06/07/10/11/12 六个新失配用例逐一破坏自证真失败（可抽查式贴证据，全量随 npm test 绿）。
- [x] ⑤ **slug 修复**：目录型 `--spec` 正/负向测试通过；`docs/spec/<slug>/README.md` 与 `docs/spec/<slug>/SPEC_<slug>_v1.md` 两形态对同一审查文的判定一致；`--spec` 传目录本身 exit 1（用法错 · 非 EISDIR 裸崩溃）。
- [x] ⑥ **评估文落盘**：⑤ 结论含「修/不修 + 理由 + 若修代价估算」。
- [x] ⑦ `npm run typecheck` 0 错 · `npm test` 全绿（基线 464 + 新增）· `node bin/specgate.js pins check` 15/15 exit 0。
- [x] ⑧ **行为变更旧测影响面（TEST-LOCK）**：pin-08 口径变严影响面 = `test/pins-consistency.test.ts` B1 fixture 索引行（slug 列须满足口径 B）+ C组 pin-08 语义断言（逐处列出并联改 · grep 留证）；禁「半改仍全绿」。
- [x] ⑨ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_3_wiring_w1_pins_hardening.md` 通过 + `task close --yes` 闭环。
- [x] ⑩ **提交边界**：禁 `git add -A`；逐路径精确 `git add`；提交信息 `feat(2.3-W1): …`；S2 过程档与实现文件同 commit 系列但逐路径列明。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_3-wiring-completion/01_w1_pins_hardening_v1.md`](../../spec/2_3-wiring-completion/01_w1_pins_hardening_v1.md)（**唯一蓝本** · §3 范围 / §5 设计 / §7 验收 / §8 failure_paths）
3. [`docs/spec/2_3-wiring-completion/00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)（S2 / P0-GATE / 范围外 / RELEASING 双重敏感）
4. 现状文件：`assets/release-pins.yaml`（pin-01..12）· `src/cli-pins.ts`（spec-index-row :213-229 · planFix 聚合 :256-287）· `src/cli-checks.ts`（extractSpecSlug :554-561 · findSpecReview :579-600）· `test/pins-consistency.test.ts` · `test/cli-verify-spec.test.ts`
5. 参考前波：`docs/tasks/done/task_2_2_closed_loop_w1_release_pins.md`（ pins 机制首建 · 自检结论格式先例）
6. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w1_pins_hardening.md`（GATE_VERIFY · HG-AUDIT-R1=pending 时**拒开工**）

---

## 测试策略（Harness）

**test_strategy**: `required`

- `test/pins-consistency.test.ts` 扩组：B 组增 pin-04/06/07/10/11/12 失配用例 + pin-13/14/15 破坏-修复用例 + F-W1-02（仅 Unreleased → extract_error）+ F-W1-04（AGENTS 块标记完整断言）；C 组数据形态断言更新 12 → 15（TEST-LOCK 联改）。
- `test/cli-verify-spec.test.ts` 增目录型 slug 正/负向 + 目录路径 exit 1。
- pin-10 失配：测试内 `git init` 隔离环境，不真打 tag（git 操作仅人）。
- 破坏性自证（验收 ①③）为硬条款，不接受口头声称；改行为必联改断言（TEST-LOCK）。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| `src/cli-pins.ts` pin-08 严化 | ✅ | spec-index-row 双判（(A) 状态/描述列含版本串 + (B) slug 列含版本串或 `X_Y-` 前缀）· mismatch detail 附兜底嫌疑行号（D-23-PIN08-STRICT） |
| `assets/release-pins.yaml` | ✅ | pin-08 semantics 数据声明严化 + pin-13/14/15 纯数据新增（CHANGELOG 发布头 / MIGRATION regex-all / AGENTS npx regex-all · 均 fixable） |
| `src/cli-checks.ts` slug 修复 | ✅ | extractSpecSlug basename ∈ {readme,index}（大小写不敏感）→ 父目录名（D-23-SPEC-SLUG）· 元信息 spec_slug 优先不破 |
| `src/cli.ts` 目录止血 | ✅ | verifySpecMode：--spec 传目录 → 干净「用法错」fail(exit 1)（F-W1-05 · 止血裸 EISDIR · 不新增目录直读） |
| `test/pins-consistency.test.ts` | ✅ | 新增 W1-B1..B12（pin-04/06/07/10/11/12 失配真失败 · pin-10 git init 隔离 · pin-13/14/15 破坏-修复 · F-W1-02/F-W1-04 · pin-08 严化反例）+ C组 TEST-LOCK 联改 12→15 + B1 fixture 索引行口径 B 兼容化 |
| `test/cli-verify-spec.test.ts` | ✅ | 新增目录型 slug describe 7 测（README/index 正向 · 两形态一致 · 负向钉死 readme 误推回归 · F-W1-05/F-W1-06 · 元信息优先） |
| ⑤ unfixable 评估文 | ✅ | `docs/harness/invokes/by-task/2-3-wiring-w1-pins-hardening/eval_unfixable_overlap_20260912.md` · 结论**不修**（零触发 · failClosed 方向 · 代价不匹配 · 监控缓解已就位） |

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 2026-09-12 · 全部命令真实执行 · 完整输出见 invoke `invoke_20260912_30_40_2-3-wiring-w1-pins-hardening.md` 与交付汇报）

**验证命令与退出码**（cwd=仓根）：

| 命令 | exit | 结果 |
|------|------|------|
| `node bin/specgate.js verify --target . --task docs/tasks/active/task_2_3_wiring_w1_pins_hardening.md`（开工前 GATE_VERIFY） | 0 | 闸扫描表 HG-TASK-DRAFT/HG-AUDIT-R1 均 approved · VERIFY: PASS |
| `node bin/specgate.js pins check`（15 钉面干净树） | 0 | `PINS: PASS · 15/15 落点一致`（12 → 15） |
| 破坏 docs/spec/README.md L18（2.2.1→9.9.9 点式+下划线）+ L19 一句话列注入 `spec-wave@2.2.1` → `pins check` | **2** | `[mismatch] pin-08 docs/spec/README.md · actual="(索引表无当前版本合格行)"` · detail 附`兜底嫌疑行: L19`（[A]#7 反例杀伤 · 验收①） |
| `git checkout -- docs/spec/README.md` 后复跑 `pins check` | 0 | PINS: PASS 15/15（严化回归 · 验收②：存量行全兼容） |
| 破坏 CHANGELOG `## [2.2.1]`→`## [9.9.9]` → `pins check` | **2** | `[mismatch] pin-13 CHANGELOG.md:9 · actual="9.9.9" expected="2.2.1"` |
| `pins fix --yes`（CHANGELOG 破坏态） | 0 | 写回 `## [2.2.1]` · 日期行不动 · 备份 .bak · 复跑 check PASS（验收③-1） |
| 破坏 MIGRATION `spec-wave@2.2.1`→`9.9.9`（4 处）→ `pins check` | **2** | `[mismatch] pin-14 MIGRATION.md:3 · 4/4 处失配` → fix --yes 收敛（验收③-2） |
| 破坏 AGENTS `npx spec-wave@2.2.1`→`9.9.9` → `pins check` | **2** | `[mismatch] pin-15 AGENTS.md:61` → fix --yes 收敛 · `cyning-harness:begin/end` marker 完整（验收③-3 · F-W1-04） |
| `node --test --experimental-strip-types test/pins-consistency.test.ts test/cli-verify-spec.test.ts` | 0 | 53/53 pass（含 W1-B1..B12 逐一真失败自证 + 目录型 slug 7 测） |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **484/484 pass**（基线 464 + 新增 20 · 耗时 ~56s） |
| `node bin/specgate.js pins check`（最终） | 0 | PINS: PASS · 15/15 |

**验收 ①–⑩ 逐条**：① 见上表破坏-恢复链（exit 2 + 嫌疑行 L19 + 改回 PASS）；② 严化回归 15/15 全绿（含 2.1.3/2.2.1 patch 收尾行与 2_3 minor 夹行存量兼容）；③ 三面分别破坏 → 各报 `文件:行号` exit 2 → fix --yes 收敛（上表三链实测）；④ pin-04/06/07/10/11/12 失配 fixture W1-B2..B7 逐一真失败（npm test 全量绿 · 抽查证据：W1-B5 pin-10 git init 隔离 missing · W1-B8 严化反例）；⑤ 目录型 slug 正/负向 7 测全过（README/index → 父目录 slug · 两形态一致 · `--spec` 目录 exit 1 干净用法错）；⑥ 评估文 `eval_unfixable_overlap_20260912.md` 落盘（结论不修 + 理由 + 代价估算）；⑦ typecheck 0 错 · npm test 484/484 · pins check 15/15 exit 0；⑧ TEST-LOCK 影响面联改（B1 fixture 索引行口径 B 兼容化 + C组 pin-08 语义断言改严化关键词 + ids/fixable 12→15 · grep 留证 `当前 minor` 旧断言已替换）；⑨ gate-check + close 见修订记录；⑩ 提交逐路径精确 add（无 `git add -A`）。

**已知未测项**：CI workflow 实跑（本地四门等价已绿）；pin-13 对「Unreleased 异形头含数字」的边界（评审非阻塞观察 2 留痕 · F-W1-02 failClosed 兜底方向正确）。

### KPI

Task_KPI%: 100（验收 10/10 自证通过 · 四门绿 · 破坏-修复四链实测 · 测试 484/484 含新增 20 测）

---

## 思考轮（10-task）

### R0 · 证据

SPEC 01 为唯一蓝本（signed · HG-SPEC-SIGNOFF approved 00 代签）；SPEC §1 五项前提本棒逐只读复核有效：pin-08 弱钉（`cli-pins.ts:217-228` 仅查 `|` 行含版本串 · 无单元格/行身份约束）· 三面未入钉（yaml pin-01..12 无 CHANGELOG/MIGRATION/AGENTS 落点）· 失配覆盖缺口（test 仅 pin-01/02/03/05/08/09 + B11 双钉面）· slug 回退债（`cli-checks.ts:554-561` basename 无父目录归一）· unfixable 候选债（planFix 同文件聚合后 `newContent===oldContent → null → unfixable` 路径存在）。基线实测：`pins check` 12/12 PASS · `--spec` 传目录裸 EISDIR exit 1。task 结构对齐 `lintTaskFile` E1–E8 与 verify pre-30 硬闸（required ∩ {10,20,00} 由 10/00/20 三 invoke 落盘满足）。

### R1 · 范围

范围 = SPEC 01 §3 五项（①–⑤）逐字承接；非范围 = 01 §4 五项 + 00 §2/§3 纪律增补（RELEASING 双重敏感 · 禁 --force/--allow-* · host schema/W2–W7 · 发版动作）。④ 附带止血（目录路径干净 exit 1）判属 F-W1-05 既有语义收口，不新增能力，纳入 ④ 不另列项。

### R2 · 方案

方案对比已在 SPEC 01 §6 定案（pin-08 严化口径 / 纯数据三面 / slug 父目录回退 / unfixable 评估定），本帽职责是把定案转为可验收条款。pin-08 机械口径本 task 定稿（SPEC 授权「随 task 定稿」）：双判 (A) 状态/描述列含版本串 + (B) slug 列含版本串或 `X_Y-` 前缀；反例杀伤性推演：改坏当前行后别行 prose（一句话列）注入正确版本 → 满足 (A) 不满足 (B) → mismatch ✓；存量回归推演：2.2.1 patch 行 slug 列含 `2.2.1` ✓ · 未来 2.3.0 minor 夹行 `2_3-wiring-completion` 前缀 + 状态列 `2.3.0 规划中` ✓ · 2.1.3 先例同构 ✓。

### R3 · 边界

30 开工硬边界 = HG-AUDIT-R1 翻 approved（本帽不签发）；提交边界 = 禁 `git add -A` + 精确 add；S2/P0-GATE/RELEASING 双重敏感/git 仅人四条硬纪律转入 failure_paths 与非范围；pin-14/15 yaml note 须写明叙事行口径核对结论（F-W1-03）；AGENTS.md fix 不动产品块（F-W1-04 测试钉死）。

### R4 · 可测性

验收 10 条全部可机械/可观测：exit 码断言、破坏-修复链输出、fixture 真失败、两形态判定一致断言、评估文路径存在性、四门命令、gate-check、grep 影响面留证、git 提交边界。无「改完了」式条款。

### R5 · 派工就绪

task 结构满足 lint E1–E8；pre-30 invoke（10/00）同棒落盘。**下一棒**：20-task-audit R1 书面审（落盘 `docs/harness/reviews/` + invoke_\*_20_\*）→ HG-AUDIT-R1 签闸（2026-09-12 维护者会话授权 00 代签）→ 30/40。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC signed + 五项前提只读复核有效 + 基线 12/12 实测 + lint/verify 结构核源） | no |
| R1 | 范围/非范围划定（01 §3/§4 + 纪律增补 · ④ 止血归类判定） | no |
| R2 | 方案沿用 SPEC 定案 · pin-08 机械口径定稿并完成反例/回归双向推演 | no |
| R3 | 边界四条（开工闸 / 提交 / 硬纪律 / 叙事行与产品块）落入 task | no |
| R4 | 验收 10 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此（内容完备 · 无遗留阻塞） | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 已 signed，D-23-* 三定案冻结，本帽职责（结构化转写 + pin-08 机械口径定稿 + 闸/invoke 配置）已闭合，无新增开放问题。  
**residual_risks**：① pin-08 严化口径对「别行 状态列 含正确版本」极端反例仍兜底（如未来某行状态列合法提及当前版本号——当前存量无此行，评估为可接受 · 口径再严化属 W2 维度扩展）；② pin-13 正则对「Unreleased 空节」边界依赖 F-W1-02 failClosed 兜底（已入测试）；③ MIGRATION 叙事行未来若引入 `spec-wave@X.Y.Z` 历史形态会误钉（缓解：yaml note + F-W1-03 返修数据路径）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | 开单 · 10-task · 蓝本 SPEC 01（signed）· D-23-* 冻结值落入 · pin-08 机械口径定稿（双判 A+B · 反例/回归双向推演） |
| 2026-09-12 | 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w1_pins_hardening_audit_R1_20260912.md`）· HG-AUDIT-R1 approved（2026-09-12 维护者会话授权 00 代签） |
| 2026-09-12 | W1 实现落地 · 30+40 闭环：pin-08 严化 + pin-13/14/15 三面入钉 + 失配 fixture ×6 + slug 目录型修复 + unfixable 评估（不修）· 验收 ①–⑩ 自证全过（484/484 · pins 15/15） |
