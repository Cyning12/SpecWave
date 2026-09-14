# Task：2.4 W1 · pins 提取修正（pins extract fix）· 本次核心波

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（00 代签 · 2026-09-14 · 维护者授权 · T-1 已消解）· 30+40 闭环完成 · 2026-09-14）  
> **wave**：W1（2.4.0 门禁强度补全 · 核心波）  
> **关联 SPEC**：[`docs/spec/2_4-gate-strength/01_w1_pins_extract_fix_v1.md`](../../spec/2_4-gate-strength/01_w1_pins_extract_fix_v1.md)（**唯一蓝本** · signed）· [`00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-4-gate-strength-w1-pins-extract` |
| **test_strategy** | `required` |
| **test_strategy_note** | `test/pins-consistency.test.ts` 扩组（N7 refstyle 负向 · N8 删表行留 tagline 负向 + 对照 · N9 改坏状态格负向 + 回归锁）；破坏性自证为验收硬条款 |
| **freeze_id** | 2.4.0-W1 · D-24-PIN16-REFSTYLE / D-24-PIN17-TABLEROW / D-24-PIN08-SEMCELL 已冻结（SPEC 01 §6 采纳推荐 · HG-SPEC-SIGNOFF approved 冻结） |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 定点修复，不改架构图谱（F1 架构项归 3.0） |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 产品机制修严（pins 提取口径定点），非编码规范/流程增量 · 无 wiki 落点 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.2/2.3 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-14 维护者本窗签收 PLAN_2_4 |
| HG-SPEC-SIGNOFF | **approved** | — | 2026-09-14 维护者授权 00 代签（D-24-* 三定案已冻结） |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-14 维护者授权） |
| **HG-AUDIT-R1** | **approved** | 30 | 00 代签 · 2026-09-14 · 维护者授权 · 依据审查文 [`docs/harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md`](../../harness/reviews/task_2_4_gate_strength_all_waves_audit_R1_20260914.md)（R1 结论 PASS-with-issues）· **带条件签**：30 开工前置 = 消解 T-1（N9 新口径与 `docs/spec/README.md:20` 陈旧「待发版」行冲突——该行 2.3.1 实际已 published，30 须先把该行状态格修为含点式 `2.3.1` 的现行口径，并在 invoke notes 留痕偏离 F-W1-05 的理由） |

---

## 背景与目标

V1 对抗式验证在 pins 三条提取口径实锤 P2 绕过（验收报告 §3.H/§3.I/§3.J · 前提经本棒只读复核有效）：pin-16 `linkRe`（`src/cli-pins.ts:295`）不扫 reference-style 定义；pin-17 `host_hits`（`src/cli-pins.ts:348-390`）裸词全文命中、tagline 枚举句可顶包表行；pin-08 双判（`src/cli-pins.ts:221-258`）被同行归档链接 `X_Y_Z` 与 slug `X_Y-` 前缀顶包、状态格写什么都 PASS。目标：三条提取口径钉到语义位置——全部定点修复 + 三负向 fixture 固化 V1 构造（修复前真红），不动 pins 引擎架构。

**已定案（冻结 · 不得翻案）**：D-24-PIN16-REFSTYLE（补 refstyle 分支 `^\s*\[[^\]]+\]:\s*(\S+)`）· D-24-PIN17-TABLEROW（词锚 ∧ 表行双命中断言优先）· D-24-PIN08-SEMCELL（版本真值只认状态列点式串 · `X_Y*` 前缀式不计入）。

## 范围

- [x] ① **N7 · pin-16 refstyle 分支**（`src/cli-pins.ts:295` 提取区）：补 reference-definition 提取，目标与 inline 走同一归一/判定管线（去锚 · 仓根级且存在的 `.md` ∈ 白名单 ∪ npm 自动入包）；`test/pins-consistency.test.ts` 增 refstyle 负向 fixture（白名单外 `.md` 被 refstyle 引用 → exit 2 · 修复前真红复现 §3.H）。
- [x] ② **N8 · pin-17 表行锚定**（`src/cli-pins.ts:348-390`）：对每 host 每侧 README 断言「存在表行（`^\s*\|` 起首）使 host_hits 至少一 pattern 命中该行」；tagline/prose 命中不计入；负向 fixture = 删 aider 适配表行留 tagline → exit 2（修复前真红复现 §3.I）+ 连枚举句 Zed 也删的对照仍 exit 2；`dsh` known_gaps 豁免失陈债机制行为不变。
- [x] ③ **N9 · pin-08 语义格位锁定**（`src/cli-pins.ts:221-258` + `assets/release-pins.yaml:60-73` semantics 数据声明更新）：行合格 ⟺ **状态列（cells[2]）**含当前版本**点式** `X.Y.Z`；`X_Y`/`X_Y_Z` 下划线式不计入版本串（slug/文件名顶包排除）；slug 列 (B) 判保留为行身份辅助；「`2.4.0 规划中` 类非发布态」行口径本 task 定稿并写入 yaml semantics（F-W1-05）；负向 fixture = 状态格改 `9.9.9`（同行归档链接保留 `2_3_x` 形态）→ exit 2（修复前真红复现 §3.J lead 实验）。

## 非范围

| 项 | 理由 |
|----|------|
| pins 引擎架构改动（新 extract kind 体系等） | SPEC 01 §4 · 三处全为定点 |
| pin-16 大小写口径（N10 假阳） | 归 W6（P3）· 本波只补 refstyle 扫描面 |
| S2 目录任何写（pins fix 拒写语义保持） | 00 §1 · 机械拒写无豁免 |
| git tag 自动化（pin-10 fixable） | git 操作仅人 |
| RELEASING.md 措辞改动 | 双重敏感（pin-07 + 九步顺序测）· 本波零改动 |
| 给 pins 或任何既有门禁加 `--force` / `--allow-*` 绕过参数 | P0-GATE 硬纪律（00 §2）· 拒设计 |
| host-adapt schema / W2–W6 任何实现项 | 00 §3 · 各自独立 task |
| minor bump 2.4.0 / tag / publish | 属发版波 · publish 仅人 |

---

## 失败路径（failure_paths · 对齐 SPEC 01 §8）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W1-01 | refstyle 目标为 URL/纯锚点/不存在文件 | 沿用 inline 同口径排除/跳过 · 不误报 | 是 | 失配输出指出 `文件:行号` |
| F-W1-02 | README 表格式变动（列增删 · 行首空格） | 表行判定以 `^\s*\|` 宽松起首 · 加须经钉面评审 | 是 | mismatch 点名 host |
| F-W1-03 | 新宿主仅改 tagline 未补表行 | pin-17 exit 2 点名缺表行（failClosed · 本波目标行为） | 是 | mismatch 指出 host 与侧（EN/ZH） |
| F-W1-04 | spec 索引表列序变更（状态列非 cells[2]） | 列位口径 yaml note 声明 · 失配 exit 2 不静默 | 是 | mismatch 含语义说明 |
| F-W1-05 | 状态列写 `2.4.0 规划中` 类非发布态 | 口径本 task 定稿（含版本串即算行身份合格 · 发布态准确性归 pin-10 联动）· 入 yaml semantics | 是 | semantics 文案可查 |
| F-W1-06 | 修严误伤存量合规行 | 验收④全量回归兜底 · 误伤即返修口径不修文档 | 是 | 回归清单 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（`npx spec-wave verify --task` 闸扫描阻断） | 是 | 须先 20-task-audit R1 + 00 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑤ 逐字对齐 SPEC 01 §7 五条；⑥–⑧ 为本棒纪律性增补（TEST-LOCK 影响面 / gate-check+close / 提交边界）。

- [x] ① **N7 负向真红转绿**：refstyle 引用白名单外仓根级 `.md` → 修复前 exit 0（复现 §3.H）· 修复后 exit 2 指 `文件:行号`；对照（目标入 `files[]`）转绿。贴实际命令与输出。
- [x] ② **N8 负向真红转绿**：删 aider 表行留 tagline → 修复前 exit 0 · 修复后 exit 2；连枚举句 Zed 也删的对照仍 exit 2；表行恢复转绿。贴实际命令与输出。
- [x] ③ **N9 负向真红转绿**：当前版本索引行状态格改 `9.9.9`（同行链接/别行 prose 保留正确版本形态串）→ 修复前 exit 0（复现 §3.J lead 实验）· 修复后 exit 2；改回 PASS。贴实际命令与输出。
- [x] ④ **全量回归**：现行 README 双语（13 宿主）与 `docs/spec/README.md` 全部存量行（含 `2_4-gate-strength` 规划行）新口径下 `pins check` 全 PASS 零误伤；三新 fixture 固化入测试套件。
- [x] ⑤ `npm run typecheck` 0 错 · `npm test` 全绿（含新增）· `node bin/specgate.js pins check` exit 0。
- [x] ⑥ **行为变更旧测影响面（TEST-LOCK）**：pin-08/16/17 口径变严影响面逐处列出并联改（grep 留证）；禁「半改仍全绿」。
- [x] ⑦ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_4_gate_strength_w1_pins_extract.md` 通过 + `task close --yes` 闭环。
- [x] ⑧ **提交边界**：禁 `git add -A`；逐路径精确 `git add`；提交信息 `feat(2.4-W1): …`。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_4-gate-strength/01_w1_pins_extract_fix_v1.md`](../../spec/2_4-gate-strength/01_w1_pins_extract_fix_v1.md)（**唯一蓝本** · §3 范围 / §5 设计 / §7 验收 / §8 failure_paths）
3. [`docs/spec/2_4-gate-strength/00_policy_and_boundaries.md`](../../spec/2_4-gate-strength/00_policy_and_boundaries.md)（S2 / P0-GATE / 修严必配负向 fixture）
4. 现状文件：`src/cli-pins.ts`（linkRe :295 · host_hits 命中 :348-390 · spec-index-row 双判 :221-258 · fix 聚合/备份清理 :574-589）· `assets/release-pins.yaml`（pin-08 :60-73 · pin-16 :137-155 · pin-17 :156-180）· `test/pins-consistency.test.ts`
5. 参考前波：`docs/tasks/done/task_2_3_wiring_w1_pins_hardening.md`（pins 严化 + fixture 纪律先例）
6. 证据原文：`.workbuddy/output/验收报告-SpecWave-2.3.0.md` §3.H/§3.I/§3.J（V1 构造细节）
7. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_4_gate_strength_w1_pins_extract.md`（GATE_VERIFY · HG-AUDIT-R1=pending 时**拒开工**）

---

## 测试策略（Harness）

**test_strategy**: `required`

- `test/pins-consistency.test.ts` 扩组：N7 refstyle 负向（+对照入白名单转绿）· N8 删表行负向（+Zed 对照）· N9 状态格负向（+同行链接保留形态串）· 三 fixture 修复前逐一真红留证。
- 全量回归：README 双语 13 宿主 + spec 索引全存量行新口径全 PASS（含 `2_4-gate-strength` 规划行 · F-W1-05 口径定稿后）。
- 破坏性自证（验收 ①–③）为硬条款，不接受口头声称；改行为必联改断言（TEST-LOCK）。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| `src/cli-pins.ts` N7 refstyle 分支 | ✅ | `refRe = /^\s*!?\[[^\]]+\]:\s*(\S+)/gm`（:299）；inline/refstyle 双通道汇 `found[]` 后走**同一**归一/判定管线（剥尖括号 · 去锚 · scheme/纯锚点跳过 · 仓根级且存在 ∈ 白名单） |
| `src/cli-pins.ts` N8 表行锚定 | ✅ | `hitInTableRow`（:382-383 · `^\s*\|` 宽松起首 ∧ host_hits pattern 行内命中）；`hitsAll` 与逐 host 双侧判定同走该函数；miss 文案 `（EN/ZH 侧适配表行）` |
| `src/cli-pins.ts` + yaml N9 格位锁定 | ✅ | 行合格 ⟺ 状态列 cells[2] 含点式 `X.Y.Z` ∧ slug 列行身份辅助判；`X_Y`/`X_Y_Z` 不计入；兜底嫌疑行 = 行内含版本形态串但状态格无点式串；yaml pin-08 semantics 重写（列序约定 + F-W1-05「规划中」定稿入数据） |
| `test/pins-consistency.test.ts` 三 fixture | ✅ | 24W1-N7/N8/N9 三负向（修复前逐一真红 actual=0/expected=2 留证）+ 对照组（N7 入 files 转绿 · N8 删枚举词仍红/补表行转绿 · N9 改回转绿 + 下划线式状态格回归锁）；C 组 pin-08 语义断言联改（TEST-LOCK）· W2-B7 miss 文案断言联改 ×4 |

### 自检结论（执行者）

**验证命令与退出码**（2026-09-14 · 30 棒实测）：

| 命令 | 结果 |
|------|------|
| `npx spec-wave verify --target . --task <本task>`（开工 GATE_VERIFY） | **VERIFY: PASS**（首输出 BLOCKED 两处 → 桥接后过闸 · 见 invoke_20260914_30 §1） |
| 三负向 fixture 修复前 | **真红**：N7 `pin-16 = 扫描 3 个 markdown · 0 失配 · PINS: PASS`（exit 0 = §3.H 复现）· N8 `pin-17 = 2 宿主校验 · 2 双语命中 · PASS`（exit 0 = §3.I 复现）· N9 `[ok] pin-08 · L3 索引行存在 · PASS`（exit 0 = §3.J lead 复现）· 三 it actual=0/expected=2 |
| 三负向 fixture 修复后 | **转绿**：exit 2 指 `README.md:行号 -> FOO.md` / `beta · 缺 README.zh-CN.md（ZH 侧适配表行）` / `[mismatch] pin-08`；对照组全部符合 |
| `node bin/specgate.js pins check`（真实仓 · build 后） | **PINS: PASS · 17/17**（pin-08 `L20 索引行存在（语义格位口径 D-24-PIN08-SEMCELL）` · pin-16 扫 96 markdown 0 失配 · pin-17 13 宿主双语表行命中 · 零误伤） |
| pin-08 真仓对照实验 | 状态格 `2.3.1`→`9.9.9`（同行归档链接 `ACCEPTANCE_2_3_1_patch_2_3_1_zh.md` 保留）→ **exit 2** 兜底嫌疑行 L20 点名 · 恢复后 PASS · `grep -c 9.9.9` = 0 确认还原 |
| `npm run typecheck` | 0 错 |
| `npm test` | **543 pass + 1 skipped（SPEC_WAVE_E2E_NETWORK 门控）· 0 fail** |
| `npm run build` | 通过（lib 产物同步 · bin 面跑通新口径） |
| `npm run test:lib` | 6/6 pass（含 S5 assets verify bin 钉面） |
| `node bin/specgate.js assets verify` | **PASS 110/110**（release-pins.yaml 变更已 `assets manifest rebuild --yes` 重登记 · 资产为真值未反向改） |
| `npx spec-wave gate-check --task <本task>` | 闸检查：未发现阻塞 |

**验收 ①–⑧**：① N7 真红转绿（上表 · exit 0→2 · 对照入 files 转绿）✅ ② N8 真红转绿（删表行留 tagline exit 0→2 · 删枚举词对照仍 2 · 表行恢复转绿）✅ ③ N9 真红转绿（状态格 9.9.9 + 同行 `3_1_4` 归档链接 exit 0→2 · 改回 PASS · 下划线式状态格回归锁 exit 2）✅ ④ 全量回归（真仓 pins check 17/17 零误伤 · 含 2.3.1 patch 行与 2_4 规划行 · 三 fixture 固化入套件）✅ ⑤ typecheck 0 错 · npm test 543+1skip · pins check exit 0 ✅ ⑥ TEST-LOCK 影响面 grep 留证：三 kind（files-whitelist-link/readme-host-row/spec-index-row）仅 `test/pins-consistency.test.ts` 消费 · 联改 = C 组 pin-08 语义断言重写 + W2-B7 miss 文案断言 ×4 + makeFixture 注释口径 · 无半改 ✅ ⑦ gate-check 通过 + task close --yes 闭环（见提交）✅ ⑧ 提交边界：逐路径精确 add · 无 `git add -A` · `feat(2.4-W1): …` ✅

**已知未测项**：refstyle 折叠写法 `[id]: <path>` 已由 N7 fixture（`[r2]: <BAR.md>`）覆盖；pin-16 大小写口径（N10）归 W6 非本波。

**Task_KPI**：验收 8/8 逐条自证 · 范围 ①②③ 全落地 · 非范围零触碰（RELEASING/pin-10/引擎架构/S2 均未动）· 100%。

---

### KPI（00）

Task_KPI%: 100（验收 8/8 自证通过 · 四门绿 543 pass+1 门控 skip · pins 17/17（pin-08 真仓对照实验 exit 0→2→0 留痕）· assets 110/110 · 三负向 fixture 修复前真红留证 · T-1 消解 + GATE_VERIFY 两桥接留痕 invoke · 不 bump 版本号）

### 经验总结

1. **机读闸与签闸注记的格式契约不可混格**：HG-AUDIT-R1 代签注记写入 status 格即被机读闸判 pending（normalizeCell 后须恰为 `approved`）——先例口径 = status 格纯值、注记落说明列。同理 R1 总审文文件名须按 `task_<task文件名>_audit_R<n>_*.md` 逐 task 落（或配指针文），否则 verify/close 的 findLatestReview 发现不了已签发的审查。
2. **修严类钉面的红→绿纪律价值**：三负向 fixture 先在旧码上跑出「exit 0 顶包」真红（断言 actual=0/expected=2），把验收报告 §3.H/§3.I/§3.J 的对抗构造固化进套件——否则「修严」无法与「没改」区分。

---

## 思考轮（10-task）

### R0 · 证据

SPEC 01 为唯一蓝本（signed · HG-SPEC-SIGNOFF approved 00 代签）；三项前提本棒逐只读复核有效：pin-16 `linkRe` :295 仅 inline 形态 · pin-17 :374/:388 裸词 `re.test` 全 body · pin-08 :221-258 双判 (A) tail 含描述列（归档链接顶包通道）+ (B) slug `X_Y-` 前缀。基线口径：2.3.1 published · pins 机制面 2.3.x 链路有效。

### R1 · 范围

范围 = SPEC 01 §3 三项逐字承接；非范围 = 01 §4 + 00 §2/§3 纪律增补（RELEASING 双重敏感 · 禁 --force/--allow-* · schema/W2–W6 · 发版动作）。

### R2 · 方案

方案对比已在 SPEC 01 §6 定案（refstyle 分支 / 双命中断言优先 / 状态列点式唯一真值），本帽职责是转可验收条款；「规划中」行口径（F-W1-05）留本 task 定稿位：建议 = 状态列含 `X.Y.Z` 点式即算行身份合格（发布态准确性由 pin-10 tag 闸分工），30 前随 20 审确认。

### R3 · 边界

30 开工硬边界 = HG-AUDIT-R1 翻 approved（本帽不签发 · 2026-09-14 维护者授权 00 代签 · 待 20 审查文落盘）；提交边界 = 禁 `git add -A`；S2/P0-GATE/RELEASING/git 仅人四条硬纪律转入 failure_paths 与非范围。

### R4 · 可测性

验收 8 条全部可机械/可观测：exit 码断言、修复前后对照、全量回归清单、四门命令、gate-check、grep 影响面留证、提交边界。

### R5 · 派工就绪

task 结构对齐 lint E1–E8；pre-30 invoke（10）同棒落盘。**下一棒**：20-task-audit R1 书面审（落盘 `docs/harness/reviews/` + invoke_\*_20_\*）→ HG-AUDIT-R1 签闸（2026-09-14 维护者授权 00 代签）→ 30/40。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC signed + 三项前提只读复核有效 + 现值行号核对） | no |
| R1 | 范围/非范围划定（01 §3/§4 + 纪律增补） | no |
| R2 | 方案沿用 SPEC 定案 · F-W1-05 定稿位预留 | no |
| R3 | 边界四条（开工闸 / 提交 / 硬纪律 / 表格式与列序）落入 task | no |
| R4 | 验收 8 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此（内容完备 · 无遗留阻塞） | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 已 signed，D-24-* 三定案冻结，本帽职责（结构化转写 + 闸/invoke 配置 + F-W1-05 定稿位）已闭合，无新增开放问题。  
**residual_risks**：① 「规划中」口径若 20 审否决建议值须返修本 task（低风险 · 定稿位已隔离）；② 表行判定对非适配表表格的误判面（SPEC 01 residual 已登记 · task 定稿时可限定适配表节内）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | 开单 · 10-task · 蓝本 SPEC 01（signed）· D-24-* 冻结值落入 · 行号只读复核（cli-pins.ts:295/:348-390/:221-258 · yaml:60-73） |
| 2026-09-14 | 30+40 闭环：N7 refstyle 分支 / N8 表行锚定 / N9 语义格位锁定落地 + 三负向 fixture 修复前真红留证 + T-1 消解（spec 索引 2.3.1 行 published 口径）+ GATE_VERIFY 两桥接（闸表格式归一 · R1 逐 task 指针文）· 543 pass+1 skip · pins 17/17 · assets 110/110 · gate-check PASS · close 归档 done |
