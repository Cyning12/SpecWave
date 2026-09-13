# Task：2.3 W2 · 钉面维度扩展（pin dimensions）· 关联面一致性两维入钉

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-12）  
> **wave**：W2（2.3.0 接线补全 · 钉面维度扩展）  
> **关联 SPEC**：[`docs/spec/2_3-wiring-completion/02_w2_pin_dimensions_v1.md`](../../spec/2_3-wiring-completion/02_w2_pin_dimensions_v1.md)（**唯一蓝本** · signed · 2026-09-12 修订重签）· [`00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-3-wiring-w2-pin-dimensions` |
| **test_strategy** | `required` |
| **test_strategy_note** | `test/pins-consistency.test.ts` 扩组（pin-16 负向/反误报/目录前缀 + pin-17 负向 EN/ZH 分侧/豁免失陈债/映射缺失 failClosed）+ C 组 TEST-LOCK 联改 15→17；真实仓破坏性自证（FOO.md 构造链 + dummy host 构造链）为验收硬条款 |
| **freeze_id** | 2.3.0-W2 · D-23-W2-CHECK-FORM / D-23-W2-W7-EXEMPTION 本 task R2 定稿（SPEC 02 §3/§6 授权「随 task 定稿」）· D-23-W2-NPM-AUTOINCLUDE / D-23-W2-ROOTSCOPE 承 00 裁决 Q1A/Q2（SPEC 02 修订重签冻结） |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | pins 定点扩展（两新 extract kind · 与 spec-index-row 先例同构）+ 数据新增，不改架构图谱 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 产品门禁机制扩展（pins 数据 + 两 kind 求值器），非编码规范/流程增量 · 无 wiki 落点 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.1.2/2.2/2.3-W1 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表 |
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表（修订重签 · Q1A/Q2仓根/Q3预留） |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-12 维护者会话授权） |
| **HG-AUDIT-R1** | **approved** | 30 | **2026-09-12 维护者会话授权 00 代签** · 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w2_pin_dimensions_audit_R1_20260912.md`） |

---

## 背景与目标

2.2.0 验收 §7 一对同型根因缺口（SPEC 02 §1）：文档跑在打包前面（[A]#3 GLOSSARY 死链 · 2.2.1 已手工修复）· 能力跑在文档前面（[A]#4 宿主 4→7 但根 README 双语未更新 · 未修）。A1 只覆盖版本号一维，本波把钉面扩展到**关联面一致性**两维：① 文档↔files 白名单；② 宿主↔根 README 表。目标：「改了一处没把关联面一起改」从人工记忆变机械门禁（failClosed exit 2 · 与 pins 同语义）。

**前提证伪留痕（SPEC 02 §5.1 已收录）**：原稿「2.2.1 现状应 PASS」经本波 10-task R0 实测证伪——`README.md:273` 链 `MIGRATION.md` 未入 files 且 npm 不自动入包（`npm pack --dry-run` 实证 · 安装后真死链）；`README.zh-CN.md` 未列 files 但 npm `README*` 规则自动入包（naive 口径误报）。00 裁决 Q1A/Q2仓根/Q3预留，SPEC 02 修订重签（commit 80eaa14）。

**已定案（冻结 · 不得翻案）**：

- **D-23-W2-NPM-AUTOINCLUDE**（00 裁决 Q1A · SPEC 修订重签）：白名单 = `files[]`（含目录前缀匹配）∪ npm 自动入包规则（`README*` / `LICEN(S)E*` 变体按 basename 视同白名单）。
- **D-23-W2-ROOTSCOPE**（00 裁决 Q2 · SPEC 修订重签）：校验①判定对象仅限**仓根级** `.md` 被引用目标；`docs/` 下任意深度链接出本波范围。
- **D-23-W2-CHECK-FORM**（本 task R2 定稿 · SPEC 02 §6 优先方案采纳）：`release-pins.yaml` 纯数据扩展——新增 pin-16（extract kind `files-whitelist-link`）+ pin-17（extract kind `readme-host-row`）；`src/cli-pins.ts` 最小扩展两个 kind 求值器（与 spec-index-row 先例同构：语义/映射全入 yaml 数据，TS 零口径硬编码）。**零新接线点**：复用 `pins check` 既有门禁语义（exit 2 · prepublishOnly 链尾 + CI test job 原位生效）。
- **D-23-W2-W7-EXEMPTION**（本 task R2 定稿 · SPEC 02 §5.2 协同口径两选一中选定「数据豁免过渡」）：pin-17 extract 数据含 `known_gaps` 清单（copilot/codex/windsurf · 每条带 `until_wave: W7` + [A]#4 出处注记）；**截止自执行（F-W2-05 落地）**：豁免宿主一旦双语 README 双双命中（W7① 落地）→ 校验自身报**豁免失陈债** exit 2，强制 W7 task 关账前移除豁免条目；known_gaps 出现不在适配表的 host_id 同判失陈债。main 不长期红 + 豁免有明确机检截止条件。

## 范围

- [x] ① **前置修复（SPEC 02 §5.1 授权 · 30 第一步）**：`MIGRATION.md` 入 `package.json#files`（一行 · 与 2.2.1 GLOSSARY 修复同型）。修的是安装后真死链（npm pack 实证），非措辞改动。
- [x] ② **pin-16 文档↔files 白名单**（`assets/release-pins.yaml` 数据 + `src/cli-pins.ts` 新 kind `files-whitelist-link`）。机械口径（本 task 定稿）：读 `package.json#files` → 展开其中 markdown（目录前缀递归 · **缺失的 files 条目跳过不判**，如未构建的 `lib`）→ 逐文件扫相对链接 `!\?\[[^\]]*\]\((<)?([^)\s]+)(>)?\)`（剥 `#锚点` 与尖括号 · `^[a-z]+:` scheme 与纯 `#` 锚跳过 · 图片链接同口径 · F-W2-01）→ 目标解析后**仓根级**（相对路径不含 `/`）且 **存在** 且为 `.md` → 须 ∈ 白名单（files 精确/目录前缀 ∪ npm 自动入包 `/^readme(\..+)?$/i` · `/^licen[cs]e(\..+)?$/i` 按 basename · D-23-W2-NPM-AUTOINCLUDE）。**不存在的目标本钉不判**（死链属另一维度 · 留痕 residual_risks）。失配 detail：`引用文件:行号 -> 被引用文件` 逐条 + 建议（files 加白 or 移除链接）。fixable=false。
- [x] ③ **pin-17 宿主↔根 README 表**（yaml 数据 + 新 kind `readme-host-row` · path=`assets/ide/host-adapt/examples/mvp-hosts.yaml`）。机械口径（本 task 定稿）：解析适配表 `hosts[].host_id` 集合 → 每个 host 在 `README.md` 与 `README.zh-CN.md` **分别**判定：该 host 的命中形态 patterns（数据 · 任一命中即该侧命中）→ 缺失按 EN/ZH 分侧报告。`host_hits` 映射（F-W2-04 逐宿主核对 @2026-09-12 · 带表格行上下文锚防误命中）：cursor=`\|\s*\*\*Cursor\*\*` · claude=`\|\s*\*\*Claude Code\*\*` · dsh=`\|\s*\*\*DSH\*\*` · agents=`\|\s*\*\*agents\*\*`（以上四宿主现状双语表行命中 :26-29）· copilot=`Copilot` · codex=`Codex` · windsurf=`Windsurf`（三新宿主词锚 · 现状双语 0 命中 → 挂 known_gaps）。**适配表 host 无映射数据 → mismatch 报数据债**（F-W2-06 failClosed · 新宿主落地即受约束 · SPEC §5.2 末行）。known_gaps 豁免与失陈债检测见 D-23-W2-W7-EXEMPTION。fixable=false。
- [x] ④ **测试扩组**（`test/pins-consistency.test.ts`）：W2-B 组 fixture 用例（pin-16 负向 FOO.md 构造链/入 files 转绿/目录前缀 F-W2-02/锚点尖括号变体 F-W2-01 · pin-16 反误报 README.zh-CN.md 口径用例 · pin-17 负向 dummy host EN/ZH 分侧/豁免失陈债 F-W2-05/映射缺失 F-W2-06）+ C 组 TEST-LOCK 联改（钉面 15→17 · ids/fixable 断言 · 新增 pin-16/17 数据形态断言）。
- [x] ⑤ **门禁接线实证**：pin-16/17 挂载既有 `pins check`（D-23-W2-CHECK-FORM · 零新接线点）；接线点位 = `package.json#prepublishOnly` 链尾 + `.github/workflows/ci.yml:30` test job 同一命令；破坏性自证（验收 ①②）即「改动触发即红」实证，波末 `npm run prepublishOnly` 全链实测。

## 非范围

| 项 | 理由 |
|----|------|
| 通用「文档-实现一致性」框架 | SPEC 02 §4 · 本波只做两条已发生同型校验 |
| 校验链接远端可达性（http） | SPEC 02 §4 · 离线纪律 |
| 不存在链接目标的死链校验 | SPEC 口径 = 「存在于仓根」；死链属另一维度（residual_risks 留痕） |
| `docs/` 任意深度链接口径（含 S2 链接判定实效化） | D-23-W2-ROOTSCOPE（00 裁决 Q2）· F-W2-03 全深度预留注记 |
| `delivery/promotion/` 物料 links | SPEC 02 §4 · 非打包面 |
| 修改根 README 双语宿主表（copilot/codex/windsurf 行） | **W7① 职责** · 本波只建机制 + 数据豁免过渡（机制先行） |
| pins 引擎架构重构 / 独立子命令形态 | SPEC 02 §4/§6 · D-23-W2-CHECK-FORM 已定 pins 内扩展 |
| 给 pins 或任何既有门禁加 `--force` / `--allow-*` 绕过参数 | P0-GATE 硬纪律（00 §2）· 拒设计（过渡豁免走数据清单非旗标 · SPEC §5.3） |
| RELEASING.md 措辞改动 | 双重敏感（pin-07 + 九步顺序测正则）· 本波零改动；若被迫动必跑全量 npm test |
| host-adapt schema / mvp-hosts.yaml 实质内容（除验收② 临时构造后还原） | 00 §3 · 触 schema 即 STOP |
| S2 目录任何写（pins fix 拒写语义保持） | 00 §1 · 机械拒写无豁免 |
| W3–W7 任何实现项 / minor bump 2.3.0 / tag / publish | 各自独立 task · publish 仅人 |

---

## 失败路径（failure_paths · 对齐 SPEC 02 §8 + 本 task 增补）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W2-01 | README 链接写法变体（锚点 `](X.md#sec)` · 尖括号 `](<X.md>)` · 图片 `![..](X.md)`） | 锚点剥除后判定 · 图片同口径 · 解析失败 → extract_error failClosed 不静默 | 是 | extract_error 指文件与口径 |
| F-W2-02 | files 用目录前缀（`assets`）而非逐文件 | 前缀匹配算入白名单（`assets/x.md` ∈ `assets`） | 是 | — |
| F-W2-03 | （预留 · 全深度口径）链接指向 S2 目录文档 | 仓根级口径（D-23-W2-ROOTSCOPE）下**永不触发**；全深度口径预留：S2 非打包面 → 判失配并提示 | — | 预留注记 |
| F-W2-04 | 宿主命中形态误命中（如 `agents` 命中普通单词） | 命中形态入数据并带表格行上下文锚（`\|\s*\*\*agents\*\*`）；逐宿主核对结论入 yaml note | 是 | 失配指出 host_id 与缺失侧 |
| F-W2-05 | 过渡豁免超期/失陈（W7① 已落地仍挂豁免 · 或豁免 host 已不在适配表） | 校验自身报**豁免失陈债** exit 2（mismatch · 指出须移除的 known_gaps 条目）· 机检自执行无人工追踪 | 是 | mismatch detail 列失陈条目 |
| F-W2-06 | 适配表 host 无 `host_hits` 映射数据（新宿主落地未配数据） | mismatch failClosed 报数据债（指出 host_id）· 不静默跳过 | 是 | mismatch detail 指 host_id |
| F-W2-07 | 已打包 markdown 链接不存在的仓根级目标 | 本钉不判（死链另一维度 · 留痕）；不因此 extract_error | — | — |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（`npx spec-wave verify --task` 闸扫描阻断） | 是 | 须先 20-task-audit R1 + 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑤ 逐字对齐 SPEC 02 §7（修订后五条）；⑥ 为 SPEC §8 F-W2-05 的机检自执行实证；⑦–⑨ 为本棒纪律性增补（TEST-LOCK / gate-check+close / 提交边界）。

- [x] ① **校验①负向**：真实仓构造「仓根新增 `FOO.md` + README.md 加相对链接 + 不入 files」→ `pins check` **exit 2** 且输出指出 `README.md:行号` 与 `FOO.md`；`FOO.md` 入 files 后转绿；全量还原（贴实际命令与输出）。fixture 侧同构用例随 npm test。
- [x] ② **校验②负向**：真实仓构造「适配表加 dummy host + 根 README 无对应行」→ **exit 2** 指出 host_id 与缺失侧（EN/ZH 分别）；还原（贴实际命令与输出）。fixture 侧同构用例随 npm test。
- [x] ③ **前置修复后 PASS**：`MIGRATION.md` 入 files 落地后现状 `pins check` 17/17 PASS；npm 自动入包口径下 `README.zh-CN.md`（npm `README*` 规则）**不误报**（fixture 用例钉死：packaged README 链接 `README.zh-CN.md` 且 files 未列名 → 仍 PASS）；校验② 按豁免过渡 PASS（known_gaps 三宿主在数据 · 无失陈）。
- [x] ④ **接线点位实测命中**：`prepublishOnly` 链尾与 CI test job 跑同一 `pins check`（grep 留证 `package.json` / `.github/workflows/ci.yml:30`）；验收①② 破坏态下该命令即红（改动触发即红）；波末 `npm run prepublishOnly` 全链 exit 0。
- [x] ⑤ `npm run typecheck` 0 错 · `npm test` 全绿（基线 484 + 新增）· `node bin/specgate.js pins check` 17/17 exit 0。
- [x] ⑥ **豁免失陈债机检负向**：构造「known_gaps 宿主在双语 README 已双双命中」→ exit 2 报豁免失陈债指出该条目；构造「known_gaps 含适配表外 host」→ 同判失陈（F-W2-05 自执行实证 · fixture 用例）。
- [x] ⑦ **TEST-LOCK 联改**：C 组钉面断言 15→17（ids 列表 / fixable 面 / pin-16/17 数据形态）逐处列出并联改；禁「半改仍全绿」。
- [x] ⑧ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_3_wiring_w2_pin_dimensions.md` 通过 + `task close --yes` 闭环。
- [x] ⑨ **提交边界**：禁 `git add -A`；逐路径精确 `git add`；提交信息 `feat(2.3-W2): …`；S2 过程档与实现文件同 commit 系列但逐路径列明。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_3-wiring-completion/02_w2_pin_dimensions_v1.md`](../../spec/2_3-wiring-completion/02_w2_pin_dimensions_v1.md)（**唯一蓝本** · §3 范围 / §5 设计含前提证伪留痕 / §7 验收 / §8 failure_paths · 修订重签版）
3. [`docs/spec/2_3-wiring-completion/00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)（S2 / P0-GATE / 范围外 / RELEASING 双重敏感）
4. 现状文件：`assets/release-pins.yaml`（pin-01..15）· `src/cli-pins.ts`（evaluatePin :109-257 · spec-index-row :217-254 先例）· `package.json`（files :29-38 · prepublishOnly）· `assets/ide/host-adapt/examples/mvp-hosts.yaml`（7 host_id）· `README.md` :24-29 / `README.zh-CN.md` :26-29（四宿主表行现状）· `test/pins-consistency.test.ts`（fixture 模式 + C 组 :608-709）
5. 参考前波：`docs/tasks/done/task_2_3_wiring_w1_pins_hardening.md`（同制链路 · 自检结论格式先例）
6. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w2_pin_dimensions.md`（GATE_VERIFY · HG-AUDIT-R1=pending 时**拒开工**）

---

## 测试策略（Harness）

**test_strategy**: `required`

- `test/pins-consistency.test.ts` W2-B 组（fixture 仓 · 承 makeExtFixture 模式）：
  - pin-16：负向（仓根 FOO.md 被 packaged README 链接且不入 files → exit 2 指 `README.md:行号 -> FOO.md`）· 入 files 转绿 · 目录前缀白名单（F-W2-02）· 锚点/尖括号/图片变体（F-W2-01）· **反误报**：链接 `README.zh-CN.md` 未列 files 仍 PASS（npm README* 自动入包 · D-23-W2-NPM-AUTOINCLUDE 钉死）。
  - pin-17：负向（适配表加 dummy host + 映射数据 + README 无命中 → exit 2 指 host_id 与 EN/ZH 缺失侧分别）· 豁免失陈债（known_gaps 宿主已双双命中 → exit 2 · F-W2-05）· 豁免含适配表外 host → 失陈 · 映射缺失（F-W2-06 failClosed）。
- C 组 TEST-LOCK 联改：钉面 15→17 · ids/fixable 断言 · pin-16/17 数据形态（kind/path/expected.kind/known_gaps.until_wave 字段存在性）。
- 真实仓破坏性自证（验收 ①②）为硬条款，不接受口头声称；破坏后须全量还原再跑 npm test。
- 行为变更联改断言（TEST-LOCK）；`npm run build` + `npm run test:lib` 随 prepublishOnly 全链实测。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| `package.json` MIGRATION.md 入 files | ✅ | 前置修复（30 第一步 · :34 · pack 实证 183→184 入包） |
| `assets/release-pins.yaml` pin-16/17 | ✅ | 纯数据 · semantics 声明 + host_hits 7 宿主映射 + known_gaps 三条 until_wave: W7（封闭 · 无豁免新债） |
| `src/cli-pins.ts` 两新 kind | ✅ | files-whitelist-link / readme-host-row 求值器（零口径硬编码 · 与 spec-index-row 先例同构）· 相对化 bug 由 W2-B2/B5 擒获修复 |
| `test/pins-consistency.test.ts` | ✅ | W2-B1..B10（负向/反误报/前缀/变体/分侧/失陈债/映射缺失）+ C 组 15→17 TEST-LOCK 联改 |

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 2026-09-12 · 全部命令真实执行 · 完整留痕见 invoke `invoke_20260912_30_40_2-3-wiring-w2-pin-dimensions.md`）

**验证命令与退出码**（cwd=仓根）：

| 命令 | exit | 结果 |
|------|------|------|
| `node bin/specgate.js verify --target . --task docs/tasks/active/task_2_3_wiring_w2_pin_dimensions.md`（开工前 GATE_VERIFY） | 0 | 闸扫描 HG-TASK-DRAFT/HG-AUDIT-R1 均 approved · VERIFY: PASS |
| `node bin/specgate.js pins check`（17 钉面干净树） | 0 | `PINS: PASS · 17/15→17/17` · pin-16 `扫描 96 个 markdown · 0 失配` · pin-17 `7 宿主校验 · 4 双语命中 · 过渡豁免 copilot@W7,codex@W7,windsurf@W7` |
| 破坏：仓根 FOO.md + README.md 加链接（不入 files）→ `pins check` | **2** | `[mismatch] pin-16 package.json · README.md:375 -> FOO.md · 建议: files 加白 or 移除链接`（验收①） |
| FOO.md 入 files → 复跑 → 还原（README/FOO 还原 · package.json 保留 MIGRATION 前置修复） | 0 | PINS: PASS 17/17（验收① 转绿+还原） |
| 破坏：mvp-hosts.yaml 加 dummy9 + host_hits 映射 → `pins check` | **2** | `[mismatch] pin-17 · dummy9 · 缺 README.md（EN 侧） · dummy9 · 缺 README.zh-CN.md（ZH 侧）`（验收② EN/ZH 分侧）→ 还原后 17/17 |
| `npm pack --dry-run --json` | 0 | 184 文件（183→184）· MIGRATION.md packed=true（前置修复实证） |
| `node --test --experimental-strip-types test/pins-consistency.test.ts` | 0 | 41/41 pass（含 W2-B1..B10 逐一真失败自证 + C 组 17 钉面形态） |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **495/495 pass**（基线 484 + 新增 11 · 耗时 2m34s） |
| `npm run prepublishOnly`（全链：typecheck→test→build→test:lib→pins check） | 0 | 全链 PASS（验收④ 接线点位实测 · 链尾 pins check 17/17） |

**验收 ①–⑨ 逐条**：① 见上表 FOO.md 破坏-修复-还原链（exit 2 指 `README.md:375 -> FOO.md` · 入 files 转绿 · fixture W2-B2 同构）；② dummy9 链 EN/ZH 分侧 exit 2（fixture W2-B7 同构 · 仅 EN 补行后只剩 ZH 侧缺失）；③ MIGRATION.md 入 files 后 17/17 PASS · W2-B3 反误报钉死（README.zh-CN.md npm README* 自动入包不误报）· 校验② 豁免过渡 PASS 无失陈；④ 接线零新点位（grep `package.json:42` / `ci.yml:30` 同一 `pins check`）· 破坏态即红实证 · prepublishOnly 全链 exit 0；⑤ typecheck 0 错 · npm test 495/495 · pins 17/17；⑥ W2-B10 双向失陈债（豁免宿主双双命中 exit 2 报债 · 豁免含适配表外 host 同判）；⑦ C 组 TEST-LOCK 联改四处（ids 15→17 / fixable 面 / PinRow 类型 / pin-16·17 数据形态断言含 YAML 正则逐字核对）；⑧⑨ 见修订记录（gate-check + close · 逐路径 add 无 git add -A）。

**实现期调试留痕**：pin-16 求值器首版 `path.join(dir, target)` 未相对化 → 全部目标因含 `/` 被跳过（钉面永不触发）· W2-B2/B5 fixture 真失败擒获 → 改 `path.relative(root, path.resolve(dir, target))` 收敛（负向靶场先行的实证价值）。

**已知未测项**：CI workflow 实跑（本地 prepublishOnly 全链等价已绿）；`docs/` 全深度链接口径（D-23-W2-ROOTSCOPE 排除 · F-W2-03 预留）；不存在链接目标的死链维度（F-W2-07 留痕）。

### KPI

Task_KPI%: 100（验收 9/9 自证通过 · 四门绿 · 破坏-修复-还原双链实测 · 测试 495/495 含新增 11 测）

---

## 思考轮（10-task）

### R0 · 证据

SPEC 02 修订重签版为唯一蓝本（commit 80eaa14 · HG-SPEC-SIGNOFF approved 00 代签）。前提复核本棒已实测（前提证伪 → STOP 上报 → 00 裁决 Q1A/Q2/Q3 → SPEC 修订）：`README.md:273`→`MIGRATION.md` 真死链（npm pack --dry-run 实证不在包内 183 文件）· `README.zh-CN.md` npm 自动入包实证 · 校验②现状红（copilot/codex/windsurf 双语 0 命中 · 四宿主表行 :24-29/:26-29 vs 适配表 7 host）。基线实测：`pins check` 15/15 PASS · npm test 484/484（W1 关账值）。pins 引擎结构只读复核：evaluatePin kind 分派（:112-256）· spec-index-row 语义入数据先例（:217-254）· loadPins 宽松校验透传扩展字段（:70-74）· expectedString const 支持（:89）。TEST-LOCK 影响面只读定位：C 组 :619-694（ids 15 行 · fixable 面 · pin 形态断言）。task 结构对齐 lintTaskFile E1–E10 与 verify pre-30 硬闸。

### R1 · 范围

范围 = SPEC 02 §3 两条校验 + 修订新增前置修复（MIGRATION.md 入 files · §5.1 授权）+ 测试/接线实证；非范围 = 02 §4 五项 + D-23-W2-ROOTSCOPE 排除项（docs/ 深度 · 不存在目标死链）+ 00 §2/§3 纪律增补（RELEASING 双重敏感 · 禁 --force/--allow-* · host schema · 发版动作）+ **根 README 宿主表修复归 W7①**（本波机制先行 + 豁免过渡）。

### R2 · 方案

**D-23-W2-CHECK-FORM 定稿**：采纳 SPEC 02 §6 优先方案——release-pins.yaml 新增 pin-16/17 两新 extract kind。推演：纯数据装不下「集合包含」的**求值器**，但装得下全部**口径与映射**（semantics/host_hits/known_gaps/until_wave 皆数据）；TS 侧两 kind 求值器与 spec-index-row 先例同构（~各 60 行 · 零口径硬编码）；复用 pins check 门禁 → 零新接线点（prepublishOnly/CI 原位生效）· 零新子命令表面 · JSON 输出/失配 detail/S2 拒写全部继承。备选（独立子命令）弃：新增命令表面 + 单独接线两点，违背「最小实现」。**D-23-W2-W7-EXEMPTION 定稿**：选「数据豁免过渡」不选「W2 排在 W7① 后」——波序 W2 先于 W7，机制先行是 SPEC §4 明文立场；豁免入数据（until_wave: W7）+ 失陈债机检自执行（豁免宿主双双命中即 exit 2 报债）→ main 不红 + 截止条件机检强制，PROMPT「不得让 main 长期红 + 豁免须有明确截止条件」双满足。命中形态逐宿主核对（F-W2-04）：四存量宿主取双语表行锚 `\|\s*\*\*X\*\*`（:26-29 实测命中 · 普通单词误伤免疫）；三新宿主取官方名词锚（Copilot/Codex/Windsurf · 现状 0 命中挂豁免 · W7① 落地后词锚即命中触发失陈债 → 强制摘豁免，闭环）。

### R3 · 边界

30 开工硬边界 = HG-AUDIT-R1 翻 approved（本帽不签发）；提交边界 = 禁 git add -A + 逐路径 add；S2/P0-GATE/RELEASING 双重敏感/host schema 四条硬纪律入非范围与 failure_paths；破坏性温仓自证后必须全量还原（git checkout + rm）再跑 npm test；known_gaps 只许 copilot/codex/windsurf 三条（W6 新宿主无豁免新债 · SPEC §5.2）。

### R4 · 可测性

验收 9 条全部可机械/可观测：exit 码断言、破坏-修复-还原链输出、fixture 真失败、反误报用例、失陈债负向、四门命令、grep 接线留证、TEST-LOCK 联改清单、gate-check/close、提交边界。无「改完了」式条款。

### R5 · 派工就绪

task 结构满足 lint E1–E10；pre-30 invoke（10/00）同棒落盘。**下一棒**：20-task-audit R1 书面审（落盘 `docs/harness/reviews/` + invoke_\*_20_\*）→ HG-AUDIT-R1 签闸（2026-09-12 维护者会话授权 00 代签）→ 30/40。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC 修订重签 + 前提证伪留痕 + 基线 15/15 · 484/484 + 引擎/测试结构核源） | no |
| R1 | 范围/非范围划定（02 §3/§4 + 前置修复 + 纪律增补 + W7① 边界） | no |
| R2 | D-23-W2-CHECK-FORM / D-23-W2-W7-EXEMPTION 定稿并完成双向推演（形态取舍 · 豁免闭环 · 命中锚核对） | no |
| R3 | 边界五条（开工闸 / 提交 / 硬纪律 / 还原纪律 / 豁免清单封闭）落入 task | no |
| R4 | 验收 9 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此（内容完备 · 无遗留阻塞） | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 修订重签，00 裁决三点冻结，本帽职责（结构化转写 + D-23-W2-CHECK-FORM/W7-EXEMPTION 定稿 + 闸/invoke 配置）已闭合，无新增开放问题。  
**residual_risks**：① 不存在的仓根级链接目标本钉不判（死链维度 · 后续波次评估）；② 命中形态词锚对双语文案未来改写的脆性（缓解：映射入数据 + F-W2-04 返修数据路径 · SPEC residual 同名留痕）；③ W7① 若不改表行而改散文提及宿主，词锚仍命中即触发失陈债——豁免移除由 W7 task 关账强制，机制无空窗。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | 开单 · 10-task · 蓝本 SPEC 02 修订重签版（commit 80eaa14）· R0 前提复核触发 STOP 上报 → 00 裁决 Q1A/Q2仓根/Q3预留 · D-23-W2-CHECK-FORM（pin-16/17 新 kind 纯数据扩展）/ D-23-W2-W7-EXEMPTION（数据豁免 + 失陈债自执行）R2 定稿 |
| 2026-09-12 | 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w2_pin_dimensions_audit_R1_20260912.md` · 非阻塞观察 ×3）· HG-AUDIT-R1 approved（2026-09-12 维护者会话授权 00 代签） |
| 2026-09-12 | W2 实现落地 · 30+40 闭环：MIGRATION.md 前置修复入 files + pin-16/17 两新 kind（files-whitelist-link / readme-host-row）+ 测试扩组 W2-B1..B10 + C 组 15→17 · 验收 ①–⑨ 自证全过（495/495 · pins 17/17 · prepublishOnly 全链 exit 0） |
