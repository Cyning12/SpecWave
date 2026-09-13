# Task：2.3 W6 · B4 宿主补齐（六宿主：gemini / opencode / roo / zed / cline / aider · 取证先行 · 复用 agents 资产面）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-13）  
> **wave**：W6（2.3.0 接线补全 · B4 host completion）  
> **关联 SPEC**：[`docs/spec/2_3-wiring-completion/06_w6_host_completion_v1.md`](../../spec/2_3-wiring-completion/06_w6_host_completion_v1.md)（**唯一蓝本** · signed · HG-SPEC-SIGNOFF=approved 2026-09-12 维护者会话授权 00 代签）· [`00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)  
> **依赖**：W2（pin-17 宿主↔根 README 校验已上线 · 本波落地即受约束）· 2.2 W6 三宿主先例（agents 资产面复用）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-3-wiring-w6-host-completion` |
| **test_strategy** | `required` |
| **test_strategy_note** | 负向先行（新宿主未知 host_id 先红）· 六宿主行结构断言 + dry-run/--yes 落点一致 + update 幂等 + 多宿主 AGENTS.md marker 唯一（F-W6-03）+ S2 拒写回归；bin 面真实命令验收为硬条款（W3 教训）· pins C 组 TEST-LOCK 联改 |
| **code_quality_bar** | `strict` |
| **freeze_id** | host-adapt schema 冻结：任何宿主表达需求触 schema（extends/defaults/hooks/字段新增）→ **STOP 上报** · 该宿主移出本波（F-W6-04 / SPEC §4 首条） |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 适配表数据行 + pins 数据 + 测试；不改架构图谱 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 宿主矩阵落适配表与 host-adapt README（仓内技术文档）；无可复用编码规范增量，不晋升 coding_wiki |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.1.2/2.2/2.3-W1–W5 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表 |
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表（SPEC 06 signed） |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-12 维护者会话授权） |
| **HG-AUDIT-R1** | **approved** | ~~30~~ | **2026-09-12 维护者会话授权 00 代签** · 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w6_host_completion_audit_R1_20260913.md` · 非阻塞观察 ×3） |

---

## 背景与目标

SPEC 06（signed）：路线 §2.1 候选矩阵第二档六宿主 `gemini` / `opencode` / `roo` / `zed` / `cline` / `aider` 一波补齐；复用 2.2 W6 验证过的「agents 资产面复用 · 加 host 不改代码」链路；**落点须按官方文档逐宿主取证**（2.2 W6 codex `.agents/skills` 纠偏为鉴 · 不凭印象猜落点）；查无确据降级 always_on 复用并如实标注。宿主覆盖 7 → 13（仓内数据面口径；**对外宣称归维护者/W7**，本波不改根 README 宿主表）。

**R0 前提复核（本棒已实测 · SPEC 06 前提全部成立）**：

- `assets/ide/host-adapt/examples/mvp-hosts.yaml` 现 7 行（dsh/cursor/claude/agents/copilot/codex/windsurf）；schema `host-adapt.schema.json` **无 host_id 枚举**（HostRow.host_id 仅 minLength）→ 新增六行纯数据，schema 冻结 STOP 条款预期不触发（实测核读 :27-30）。
- pin-17（`assets/release-pins.yaml` :156-190 + `src/cli-pins.ts` :333-423）机制已上线：适配表 host 无 host_hits 映射 → 数据债 failClosed（F-W2-06）；known_gaps 过渡豁免带 until_wave 截止 + 失陈债机检自执行（F-W2-05）。**六宿主落地当刻必须同步补 host_hits 映射 + known_gaps 豁免**，否则 pins check 变红。
- 六宿主词锚现命中实测（2026-09-13 · 大小写敏感）：`Gemini`/`opencode`/`Roo Code`/`Zed`/`Cline`/`aider` 在 README.md / README.zh-CN.md **双语均 0 命中**（`Roo` 裸词误伤 `projectRoot` ×2 · `zed` 小写误伤 `materialized` ×1 → 锚选型见 D-23-W6-ANCHOR）。
- 基线实测（干净树）：`pins check` **17/17** PASS · `assets verify` **110/110** PASS · `npm test` 基线见自检结论（522/522 沿袭 W5 关账基线复跑）。
- W2 时代注记「known_gaps 封闭三条（无豁免新债）」与 W6 SPEC 06 §5.3「六 host_id 进入校验域（W7① 修 README 前按 W2 SPEC §5.2 过渡口径处理）」存在张力——**裁决**：SPEC 06 签署晚于 W2 task 且 PROMPT 明文「新宿主豁免条目 until_wave 须合理 · W7 将统一关账」，本波按 SPEC 06 执行：豁免清单扩至九条（三旧 + 六新 · 全 until_wave: W7），W2 yaml 注释同步修订；非 SPEC 前提证伪，不 STOP（留痕于此与审查文）。

## 取证卡（六宿主 · 取证日 2026-09-13 · 官方文档/官方仓一手出处）

> 逐宿主：官方出处 URL + 落点结论 + 证据摘录 + 降级标注。本卡为 30 落表的唯一依据；评审与 W7 关账可复核。

| 宿主 | always_on 落点 | skills 落点 | 官方出处（URL） | 证据摘录 | 降级标注 |
|------|----------------|-------------|------------------|----------|----------|
| `gemini` | **GEMINI.md**（复用 AGENTS.md 片段资产 · 内容宿主中立） | `.gemini/skills` | https://github.com/google-gemini/gemini-cli#readme · https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/creating-skills.md · https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/custom-commands.md | README「Custom context files (GEMINI.md) to tailor behavior for your projects」；creating-skills「Gemini CLI automatically discovers skills in the `.gemini/skills` directory」；custom-commands「`<your-project-root>/.gemini/commands/` … `.toml` file extension」 | **非降级但注意**：AGENTS.md 不在默认 `context.fileName` 列表（官方仓 issue #28227 open · v0.49.0 实证口径）→ always_on 落 GEMINI.md 而非 AGENTS.md；commands 为 TOML 专属格式，本波 `[]`（3.0 A3 轨） |
| `opencode` | AGENTS.md（复用 agents 片段） | `.agents/skills` | https://opencode.ai/docs/rules/ · https://opencode.ai/docs/skills/ | rules「You can provide custom instructions to opencode by creating an `AGENTS.md` file」「Place an `AGENTS.md` in your project root for project-specific rules」；skills「Project agent-compatible: `.agents/skills/<name>/SKILL.md`」 | 无降级；原生 `.opencode/skills` 亦官方支持，选 `.agents/skills` 复用 agents 资产面（注释如实写明） |
| `roo` | AGENTS.md（复用 agents 片段） | 不物化（无官方 skills 目录约定） | https://docs.roocode.com/features/custom-instructions · https://github.com/RooCodeInc/Roo-Code/pull/10446 | custom-instructions「Preferred Method: Directory (`.roo/rules/`)」；PR #10446（官方仓 · 作者= Roo 创始人 mrubens · **merged 2026-01-03**）「feat: recursively load .roo/rules and AGENTS.md from subdirectories」 | **半降级标注**：AGENTS.md 加载证据为官方仓 merged PR（docs 站 custom-instructions 页未单列 AGENTS.md）；原生约定为 `.roo/rules/` 目录（需新资产 · 本波不建 · 注释如实写明） |
| `zed` | AGENTS.md（复用 agents 片段） | `.agents/skills` | https://github.com/zed-industries/zed/blob/main/docs/src/ai/rules.md · https://github.com/zed-industries/zed/blob/main/docs/src/ai/skills.md | rules「Other instruction filenames are also supported for compatibility with other agents. The first matching file is used: `.rules` … `AGENTS.md` …」；skills「copy the skill's folder into … your project's `.agents/skills/` folder for project-local use」 | 无降级；Zed v1.4.0 起 Rules 由 Skills/Instructions 取代，`.rules` 仅兼容留存——不建 `.rules`，AGENTS.md 在兼容清单内 |
| `cline` | AGENTS.md（复用 agents 片段） | `.cline/skills` | https://docs.cline.bot/features/cline-rules · https://docs.cline.bot/customization/skills | rules「| AGENTS.md | `AGENTS.md`, `~/.agents/AGENTS.md` | Standard format for cross-tool compatibility |」；skills「Place skill directories in `.cline/skills/` (workspace) … Cline will detect them automatically」「`.cline/skills/` (recommended)」 | 无降级；原生 rules 目录 `.clinerules/` 为替代约定（不建 · 注释如实写明） |
| `aider` | AGENTS.md（复用 agents 片段） | 不物化 | https://aider.chat/docs/usage/conventions.html · https://github.com/Aider-AI/aider/issues/4363 | conventions「create a file like `CONVENTIONS.md` … load the conventions file with `/read CONVENTIONS.md` or `aider --read CONVENTIONS.md`」「configure aider to always load … `.aider.conf.yml` … `read: CONVENTIONS.md`」；issue #4363（open · 2025-07-19）「Documentation Suggestion: Recommend AGENTS.md …」（佐证官方无自动加载） | **降级（如实标注）**：aider 官方约定 = CONVENTIONS.md **显式** `--read` 或 conf 配置，**无 AGENTS.md 自动加载**；落 AGENTS.md 为跨工具注入层价值（同仓其它 AGENTS.md 系宿主受益），aider 侧须用户自行 `--read AGENTS.md` 或 `.aider.conf.yml` 配置 `read: AGENTS.md` |

**取证纪律**：全部为一手官方文档/官方仓（非第三方博客）；skills 目录无官方约定者（roo/aider）**不强造目录**（SPEC §5.1）；两宿主同目录（`.agents/skills`：agents/codex/opencode/zed 四行）语义同一（同源 `assets/skills/*`）→ 不构成 F-W6-02 冲突。

## 已定案（冻结 · 不得翻案）

- **D-23-W6-REUSE**：六宿主 always_on/skills **全量复用 agents 行资产**（`AGENTS.md.fragment.example` + `assets/skills/*`）——**零新资产**；gemini 行 source 同名复用该 fragment（内容宿主中立 · target=GEMINI.md 按取证），注释写明复用口径，不夸大原生集成。
- **D-23-W6-EXEMPT**：pin-17 数据面扩 `host_hits` 六键 + `known_gaps` 六条（四字段 `{ host_id, since_wave: W6, until_wave: W7, note }` · until_wave=W7 合理：W7① 统一修 README 双语表并关账摘豁免）；三旧条目保持原三字段不改动（最小 diff）。W2 注释「封闭三条」同步修订为「三旧（W2）+ 六新（W6 · SPEC 06 §5.3）· W7 统一关账」。失陈债机检不变：任一豁免宿主双语双双命中即 exit 2 强制摘除。
- **D-23-W6-ANCHOR**：host_hits 词锚逐宿主核对（2026-09-13 实测双语 0 命中 · 大小写敏感）：gemini=`Gemini` · opencode=`opencode` · roo=`Roo Code`（**不用**裸 `Roo` · 误伤 projectRoot）· zed=`Zed`（大写 · 小写误伤 materialized）· cline=`Cline` · aider=`aider`。
- **D-23-W6-NO-SRC**：目标零 src 改动（「加 host 不改代码」链路二次验证）；**例外仅 TEST-LOCK 联改四处**（硬钉全表集合的既有断言）：`host-adapt-w6-three-hosts.test.ts` 表序断言 · `host-adapt-update.test.ts` all 列表 · `host-adapt-sticky.test.ts` all 列表 ×2 · `pins-consistency.test.ts` pin-17 键集/豁免集。若实现中发现必须改 src → 检视是否触 schema（触即 STOP）。
- **D-23-W6-NO-CLAIM**：根 README 双语 / 事实卡 / RELEASING / 一切对外宣称**零改动**（W7① 职责 · 事实卡 §11）；host-adapt README 为仓内技术文档可按落地事实更新；CHANGELOG 仅 Unreleased 一条（未发布口径 · 前波同例）。

## 范围

- [x] ① **适配表新增六行**：`assets/ide/host-adapt/examples/mvp-hosts.yaml` 追加 `gemini` / `opencode` / `roo` / `zed` / `cline` / `aider`（表序=旧七+新六）；落点严格按取证卡；注释如实写明复用口径与降级标注；`commands: []` 全六行（2.2 W6 先例 · 不暗示 P0 门禁在新宿主内生效）。
- [x] ② **pin-17 数据面**（`assets/release-pins.yaml` 纯数据 · 不改 pins 代码）：host_hits +6 键（D-23-W6-ANCHOR 锚）· known_gaps +6 条（D-23-W6-EXEMPT 四字段）· 注释修订。
- [x] ③ **host-adapt README 更新**：`assets/ide/host-adapt/README.md` 宿主×表面矩阵 +6 行 · CLI 行 `--tools` 词表 · init TTY 多选行 · 2.3 W6 说明段（取证口径 + 降级标注 + 复用口径）；**不新增 `spec-wave@X.Y.Z` 出现处**（pin-11 零新增落点）；标题版本行不动（pin-12）。
- [x] ④ **测试**：新增 `test/host-adapt-w6-2_3-six-hosts.test.ts`（六行结构断言 · dry-run 落点 · dry-run/--yes 一致 + marker 唯一 · update 幂等 · S2 拒写 · 近零新资产钉死）；TEST-LOCK 联改四处（D-23-W6-NO-SRC 例外清单）。
- [x] ⑤ **assets manifest 同步**（W5 纪律）：assets/ 三文件改动后 `node bin/specgate.js assets manifest rebuild --yes` + `assets verify` PASS（110/110 · 文件数不变仅 hash 变）。
- [x] ⑥ **CHANGELOG**：Unreleased `### Added` 一条（六宿主落表 + 取证口径 · 未发布口径 · 注明对外宣称归维护者/W7）。
- [x] ⑦ **全链路实测**（/tmp 靶场 + bin 面）：`host validate` 13 行 PASS · 六宿主 `apply --dry-run`/`--yes` 落点与取证卡一致 · `update` 幂等 · `--tools all` 含 13 · 多宿主共存 AGENTS.md marker 唯一。

## 非范围

| 项 | 理由 |
|----|------|
| **host-adapt schema 任何变更**（extends/defaults/hooks/新字段） | SPEC 06 §4 首条 · **触即 STOP 上报**（freeze_id 硬约束） |
| 根 README 双语宿主表更新 | W7① 职责（SPEC §4 · 本波只保不引入超 W7 承载面文案债） |
| 对外预告「13 宿主」/ 事实卡 / 任何宣称性文案 | 事实卡 §11 禁称 · 解禁归维护者 |
| **RELEASING.md 任何改动** | 双重敏感（pin-07 + 九步顺序测）· 与 W2–W5 同例 |
| kilo / continue / qwen（候选第三档） | 路线 §2.1 · 归后续 |
| gemini TOML commands / roo `.roo/rules` 专属资产 / cline `.clinerules/` / 各宿主原生深度集成 | 3.0 A3 轨 · 本波复用面已可用（SPEC §6） |
| hooks / 宿主内门禁强制 | A3 · 3.0 |
| npm publish / tag / push / bump | 仅人 · 发版属独立波次 |
| 给任何既有门禁加 `--force` / `--allow-*` | P0-GATE 硬纪律 |
| S2 目录任何 CLI 写 | 机械拒写无豁免 |

---

## 失败路径（failure_paths · 对齐 SPEC 06 §8 + 本 task 增补）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W6-01 | 官方文档变动/查无落点约定 | 降级 always_on 复用 + 如实标注 · 不强造目录（aider 已实例化此路径） | 是 | 取证卡标注 |
| F-W6-02 | 两宿主落点目录冲突（同名目录不同语义） | **STOP 上报评审** · 不擅自合并（本波 `.agents/skills` 四行同源同语义 · 不触发） | — | 是 |
| F-W6-03 | AGENTS.md marker merge 幂等被新宿主行破坏 | 测试断言多宿主共存 apply 后 marker 块唯一且完整 | 是 | 测试红 |
| F-W6-04 | 需要 schema 新字段才能表达某宿主 | **STOP 上报**（硬约束）· 该宿主移出本波 | — | 是 |
| F-W6-05 | W2 校验因新宿主变红（README 未更） | 按 D-23-W6-EXEMPT 数据豁免过渡（until_wave: W7）· 不绕过校验 · 不碰 README | 是 | pins 输出注明过渡豁免 |
| F-W6-06 | 版本文案新增落点未入钉 | 本波**不新增** `spec-wave@X.Y.Z` 落点（D-23-W6-NO-CLAIM）→ 机制上不触发；若遗漏 → 按 W1② 先例纯数据补钉 | 是 | pins 红 |
| F-W6-07 | bin 面与 src 行为分叉（W3 教训） | validate/apply/update/pins/assets 全部经 `node bin/specgate.js` 真实命令验收贴输出 | 是 | 验收实测输出 |
| F-W6-08 | 改 assets/ 后 manifest 未同步（W5 门禁） | `assets verify` 红 → `assets manifest rebuild --yes` 收敛 → 复验绿（范围⑤） | 是 | ASSETS 红→绿 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（verify 闸扫描阻断） | 是 | 须先 20 R1 + 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑦ 对齐 SPEC 06 §7；⑧⑨ 为本棒纪律性增补（bin 面 / manifest / gate-check+close / 提交边界）。

- [x] ① **取证卡**：六宿主官方出处 URL + 取证日期 + 落点结论（含降级标注）落本 task（见上「取证卡」节）· 评审抽读可复核。
- [x] ② `node bin/specgate.js host validate` PASS（13 host_id）。
- [x] ③ 六宿主 `host apply --tools <id> --yes` 实测物化落点与取证卡一致；`host update` 幂等（skipped/conflict=0 口径沿袭 2.2 W6）；dry-run planned == --yes written。
- [x] ④ `--tools all` 含 13；新测试全绿且**先红后绿留痕**（首跑报未知 host_id）。
- [x] ⑤ W2 校验域含 13 host_id：`pins check` PASS 且 pin-17 输出 `13 宿主校验 · 4 双语命中 · 过渡豁免 …@W7 ×9`；负向实测：摘掉任一豁免 → exit 2 指该宿主缺失侧（EN/ZH）。
- [x] ⑥ 适配表注释复用口径如实（评审抽读）；无文案暗示新宿主内门禁生效；根 README/事实卡/RELEASING 零改动（git diff 名清单自证）。
- [x] ⑦ `npm run typecheck` 0 错 · `npm test` 全绿 · `pins check` PASS 17/17 · `assets verify` PASS 110/110。
- [x] ⑧ **bin 面真实命令验收**（W3 教训）：②③⑤ 全部经 `node bin/specgate.js`（非仅 src 套件）实测贴输出；assets manifest rebuild+verify 同步留痕（F-W6-08）。
- [x] ⑨ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_3_wiring_w6_host_completion.md` 通过 + `task close --yes` 闭环；提交禁 `git add -A` · 逐路径 add · `feat(2.3-W6): …`。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_3-wiring-completion/06_w6_host_completion_v1.md`](../../spec/2_3-wiring-completion/06_w6_host_completion_v1.md)（**唯一蓝本** · §3 范围 / §5 设计 / §7 验收 / §8 failure_paths）
3. [`docs/spec/2_3-wiring-completion/00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)（S2 / P0-GATE / RELEASING 双重敏感 / 对外文案纪律）
4. 本 task「取证卡」节（**落表唯一依据** · 落点与摘录逐字可复核）
5. 现状文件：`assets/ide/host-adapt/examples/mvp-hosts.yaml`（7 行先例）· `assets/release-pins.yaml` pin-17（:156-190）· `src/cli-pins.ts` readme-host-row 求值器（:333-423 · 只读不改）
6. 测试蓝本：`test/host-adapt-w6-three-hosts.test.ts`（2.2 W6 同型套件）· `test/pins-consistency.test.ts` C 组（:889-997 TEST-LOCK）
7. 参考前波：`docs/tasks/done/task_2_2_closed_loop_w6_host_expansion.md`（三宿主先例）· `docs/tasks/done/task_2_3_wiring_w5_assets_integrity.md`（同制链路 · bin 面硬条款 · manifest 纪律）
8. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w6_host_completion.md`（GATE_VERIFY · HG-AUDIT-R1=pending 时**拒开工**）

---

## 测试策略（Harness）

**test_strategy**: `required`

- **负向先行**：先写 `test/host-adapt-w6-2_3-six-hosts.test.ts` 首跑须红（`未知 host_id: gemini…`）留痕，再落表转绿。
- 新测试用例组（与 2.2 W6 套件同模式 · spawn `--experimental-strip-types src/cli.ts`）：
  - 结构：适配表 13 host_id · 表序=旧七+新六；六行 always_on/skills/commands 逐行断言（gemini→GEMINI.md+.gemini/skills · opencode/zed→AGENTS.md+.agents/skills · cline→AGENTS.md+.cline/skills · roo/aider→AGENTS.md+skills [] · 全六行 commands []）。
  - 近零新资产：六行 source/from ⊆ agents 行资产集（机械钉死 · 任何未来新资产引入真失败）。
  - dry-run：planned = AGENTS.md/GEMINI.md + 各宿主原生 skills 目录 · 零写盘零粘性 · 不越界旧宿主目录。
  - dry-run 与 --yes 落点一致 + --yes 物化真实存在 + 粘性=六宿主。
  - **F-W6-03**：`agents` 与六宿主同选 apply → AGENTS.md 内 `cyning-harness:begin` marker 块**唯一**且完整（gemini 的 GEMINI.md 同断）。
  - update：无 --tools 读粘性六宿主 · 幂等 skip_identical 零写入。
  - S2 拒写回归：新宿主 fixture 命中 docs/tasks / reviews → validate/apply exit 2 零落盘（至少两向）。
- pins C 组 TEST-LOCK 联改：pin-17 host_hits 键集 7→13 · known_gaps 集合 3→9（新六条四字段断言 · until_wave 全 W7）。
- 既有 TEST-LOCK 联改：`host-adapt-w6-three-hosts.test.ts` 表序断言改前缀式（2.3 W6 追加六行）· `host-adapt-update.test.ts` / `host-adapt-sticky.test.ts` all 列表 7→13。
- 既有 522 基线只增不红；pins 17/17；assets verify 110/110。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| `assets/ide/host-adapt/examples/mvp-hosts.yaml` | ✅ | +gemini/opencode/roo/zed/cline/aider 六行（表序旧七+新六）· 头部注释 + 六行取证注释（URL 口径 · 降级标注）· 零新资产（source/from 全复用 agents 行） |
| `assets/release-pins.yaml` pin-17 | ✅ | 纯数据：host_hits +6 词锚（D-23-W6-ANCHOR）· known_gaps +6 四字段条目（since_wave: W6/until_wave: W7）· D-23-W2-W7-EXEMPTION 注释修订（三旧+六新 · W7 统一关账）· pins 代码零改动 |
| `assets/ide/host-adapt/README.md` | ✅ | 矩阵 +6 行 + 2.3 W6 取证说明段（逐宿主口径 + aider 降级标注）· CLI 行/TTY 行词表 13 · 未新增 `spec-wave@X.Y.Z` 出现处（pin-11 零新增落点）· 标题版本行不动（pin-12） |
| `src/cli-host.ts` | ✅ | **唯一 src 改动（+5/-1）**：`isMarkdownMergeTarget` 白名单 +GEMINI.md——取证发现 gemini 官方上下文文件为 GEMINI.md，不入白名单则 always_on 退化为裸拷贝（无 marker 包裹 · 升级整文件覆写 · local 块不保留），违背 SPEC §5.2「marker merge 幂等」前提；**非 schema 变更**（host-adapt.schema.json 零改动 · freeze STOP 条款未触发 · 按 D-23-W6-NO-SRC 检视条款执行并留痕） |
| `test/host-adapt-w6-2_3-six-hosts.test.ts` | ✅ | 新增 12 测（结构 ×5 · apply 链路 ×5 · S2 拒写 ×2）· 先红后绿留痕（首跑 9 红「适配表缺 host_id: gemini」） |
| TEST-LOCK 联改 | ✅ | 三处既有套件：w6-three-hosts 表序断言改前缀式 · update/sticky all 列表 7→13 · pins-consistency pin-17 键集 13/豁免 9 + 词锚逐字 + 四字段断言 |
| `CHANGELOG.md` | ✅ | Unreleased Added 一条（六宿主 + 取证口径 + 降级标注 · 未发布口径 · 对外宣称归维护者/W7 注明） |
| `assets/sha256.manifest` | ✅ | 两次 rebuild --yes（资产改后同步 · 110 条数不变 · hash 随内容更新）· assets verify 110/110 PASS |
| DEF-009 联动 | ✅ | 取证注释初版含 `docs/cli/creating-skills.md` 类仓内相对路径形 token → DEF-009 悬空引用机检擒获（红）→ 改述为官方文档名（去 `docs/` 路径形）转绿——负向机检真实生效的实证 |

---

## 提交信息约定

- 提交信息：`feat(2.3-W6): …`（独立提交 · 前缀不变）
- **禁 `git add -A`**：逐文件显式 add
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_3_wiring_w6_host_completion.md`

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 2026-09-13 · 全部命令真实执行 · 完整输出见 invoke `invoke_20260913_30_40_2-3-wiring-w6-host-completion.md`）

**验证命令与退出码**（cwd=仓根 · 物化实测在 mktemp 临时目录 · bin 面全经 `node bin/specgate.js`）：

| 命令 | exit | 结果 |
|------|------|------|
| `node bin/specgate.js verify --target . --task docs/tasks/active/task_2_3_wiring_w6_host_completion.md` | 0 | VERIFY: PASS（开工前 GATE_VERIFY · 双闸 approved 与声称一致） |
| 先红：新套件首跑 | 1 | 9 红「适配表缺 host_id: gemini」（红→绿闭环留痕） |
| `node bin/specgate.js host validate` | 0 | HOST VALIDATE: PASS（13 行） |
| 六宿主 `host apply --dry-run`（tmp） | 0 | planned 34 = AGENTS.md+GEMINI.md+四宿主官方 skills 目录 · 零写盘零粘性（tmp ls=0） |
| 同参 `--yes` | 0 | HOST APPLY: PASS · AGENTS.md/GEMINI.md marker 各唯一 · roo 无 `.roo` 目录（不强造目录实证）· planned==written（F-W6-03 测试钉死） |
| `host update --yes`（读粘性） | 0 | HOST UPDATE: PASS · 幂等 skip_identical 零写入零 conflict |
| `host apply --tools all --dry-run --json` | 0 | hosts(13) 全表钉字 |
| pin-17 负向（摘 aider 豁免） | **2** | mismatch 指 aider 缺 EN/ZH 两侧 · 还原后 PASS（F-W6-05 不绕过校验实证） |
| `node bin/specgate.js pins check` | 0 | 17/17 · pin-17=`13 宿主校验 · 4 双语命中 · 过渡豁免 ×9@W7` |
| `assets manifest rebuild --yes` + `assets verify` | 0 | 110 条同步（hash 随三资产更新 · 增删 ±0）· ASSETS: PASS 110/110 |
| `npm run typecheck` / `npm test` / `npm run build` / `npm run test:lib` | 0 | 0 错 · **534/534**（522+12）· — · 6/6 |
| `task lint-wiki-delta --target .` / `gate-check --task …` | 0 | LINT-WIKI-DELTA: PASS · 闸检查：未发现阻塞 |

**验收 9 条全部 pass**：① 取证卡六宿主（官方一手出处 + 降级标注 · 本 task 内）② validate 13 行 ③ 六宿主 apply/update 全链路 tmp 实测 ④ all 含 13 · 新测 12/12 先红后绿 ⑤ pin-17 校验域 13 + 负向摘豁免 exit 2 ⑥ 注释口径如实 · 对外宣称零改动（git diff 名清单自证：根 README 双语/RELEASING/事实卡未动）⑦ 四门绿 + pins 17/17 + assets 110/110 ⑧ bin 面实测（本表）⑨ gate-check exit 0 + close --yes 归档。

**schema 冻结核查（F-W6-04）**：schema 零改动；唯一 src 改动 = `isMarkdownMergeTarget` 白名单 +GEMINI.md（+5/-1 · 非 schema · 新测试「GEMINI.md marker 唯一」先行擒获裸拷贝退化 → 按 D-23-W6-NO-SRC 检视条款留痕）· **STOP 条款未触发**。

**过程实证**：① DEF-009 悬空引用机检擒获取证注释初版三处 `docs/….md` 路径形 token（红→改述→绿）——负向机检真实生效；② pin-17 失陈/缺失负向在真实仓破坏-还原链上实测（exit 2 → 0）。

---

### KPI（00）

Task_KPI%: 100（验收 9/9 自证通过 · 四门绿 534/534 · pins 17/17 · assets 110/110 · bin 面全链路 tmp 实测 · pin-17 负向 exit 2 实证 · schema 冻结零触发 · 零新资产达成六宿主落地）

---

### 经验总结

1. **取证先行再次证值**：gemini 的「印象落点」会是 AGENTS.md，但官方默认 `context.fileName` 不含它（issue #28227）——取证纠偏为 GEMINI.md；zed 的 skills 落点 `.agents/skills`、opencode 的 agent-compatible 路径同为仅凭印象必错之项。六宿主取证卡（URL+摘录+日期）是落表的唯一依据。
2. **负向测试先行的复利**：若未钉「GEMINI.md marker 唯一」，`isMarkdownMergeTarget` 白名单缺 GEMINI.md 导致的裸拷贝退化会静默通过（dry-run/落点断言全绿但升级语义缺失）——红测先擒获，一行修复，语义与 AGENTS.md/CLAUDE.md 拉齐。
3. **「加宿主近零改动」链路二次验证成立**：六宿主落地 = 适配表数据 + pins 数据 + 文档/测试；src 仅一行白名单扩展（取证驱动），schema 零触。
4. **机检网真实拦截本棒两处返工**（DEF-009 悬空引用 · pin-17 摘豁免变红）——2.3 系列前几波建的闸在本波以「擒获真问题」兑现价值。
5. **W2→W6 跨波口径衔接须显式裁决留痕**：「封闭三条」注记与后签 SPEC 06 的张力未当证伪 STOP，而是以后签 SPEC + PROMPT 双重授权裁决并在 task R0/审查文/yaml 注释三处留痕——W7 关账面（九条豁免全摘）由此明确。

---

## 思考轮

### R0 · 证据

SPEC 06（signed）+ 2.2 W6 先例与纠偏教训 + R0 前提复核全实测（schema 无枚举 · pin-17 机制 · 词锚 0 命中 · 基线 522/17/110）+ 六宿主官方文档/官方仓一手取证（取证卡）。W2「封闭三条」注记与 SPEC 06 §5.3 张力已裁决（SPEC 06 后签 + PROMPT 明文 · 非证伪不 STOP · 留痕）。

### R1 · 范围

范围①–⑦ = SPEC ①–⑥ 转写 + manifest 同步单列（W5 纪律）；非范围十条含 schema STOP / README 表 / 宣称 / RELEASING / 第三档宿主 / 深度集成 / hooks / publish / --force / S2。

### R2 · 方案

SPEC 06 §6 已定：复用 agents 资产面【采纳】· 一波补齐【采纳】· 降级落地【采纳】。（20 审复核即可，不重开。）形态选择三定案：gemini target=GEMINI.md 复用同 fragment（D-23-W6-REUSE）· 豁免四字段扩列（D-23-W6-EXEMPT）· 词锚选型（D-23-W6-ANCHOR）。

### R3 · 边界

schema 冻结（F-W6-04 STOP）· 落点冲突 STOP（F-W6-02）· marker 幂等（F-W6-03 测试钉死）· W2 过渡豁免不绕过（F-W6-05）· 钉面零新增（F-W6-06）· bin 面实测（F-W6-07）· manifest 同步（F-W6-08）· 开工闸（F-T-01）。

### R4 · 可测性

新套件六组断言 + pins C 组联改 + 既有三处 TEST-LOCK 联改；验收 9 条全部命令级可机械验证。

### R5 · 签收就绪

本槽由 20-task-audit R1 复核后判充分；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 前提复核全实测成立 + 六宿主取证完成 + W2 张力裁决留痕 | no |
| R1 | 范围/非范围划定（SPEC §3/§4 + 纪律增补） | no |
| R2 | 方案定稿（SPEC §6 + 形态三定案 REUSE/EXEMPT/ANCHOR） | no |
| R3 | 边界八条（schema STOP / 冲突 STOP / marker / 豁免 / 钉面 / bin / manifest / 开工闸） | no |
| R4 | 验收 9 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此（数据面波 · 非既有闸语义变更 · 评审文前置类阻塞不适用） | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 已 signed 且 §6 方案对比定稿主体形态；取证卡已完成（第一交付物前置）；W6 属数据面新增非既有门禁语义变更（D-23-W4-REVIEW-FIRST 不适用 · 与 W5 同型）；无新增开放问题。  
**residual_risks**：① 六宿主官方文档时效性（取证日 2026-09-13 口径 · 未来官方变动须新波次复核）；② roo 的 AGENTS.md 证据为官方仓 merged PR 而非 docs 站专页（缓解：如实标注 · W7 关账复核）；③ aider 降级行对用户「开箱即用」预期有差（缓解：注释/取证卡/host-adapt README 三处如实标注「注入层支持 · 须 --read 或配置」· 对外宣称归维护者）；④ gemini 复用 AGENTS.md 片段写 GEMINI.md 的命名表观（缓解：yaml 注释写明内容宿主中立 · 测试钉死 source 一致）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-13 | 开单 · 10-task · 蓝本 SPEC 06（signed）· R0 前提复核全实测成立 · **六宿主取证卡完成**（官方文档/官方仓一手出处 · aider 降级标注）· D-23-W6-REUSE/EXEMPT/ANCHOR/NO-SRC/NO-CLAIM 五定案 · W2「封闭三条」张力裁决留痕 |
| 2026-09-13 | 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w6_host_completion_audit_R1_20260913.md` · 非阻塞观察 ×3）· HG-AUDIT-R1 approved（2026-09-12 维护者会话授权 00 代签） |
| 2026-09-13 | W6 实现落地 · 30+40 闭环：适配表 +六行（零新资产 · 取证卡落点）· pin-17 数据面 +6 锚/+6 豁免 · isMarkdownMergeTarget +GEMINI.md（唯一 src 一行 · 红测擒获）· host-adapt README 矩阵/说明段 · 新增 12 测 + TEST-LOCK 联改三处 · CHANGELOG Unreleased · manifest 同步 110/110 · 验收 9/9 自证全过（534/534 · pins 17/17 · bin 面 tmp 实测 · pin-17 负向 exit 2）· gate-check PASS + close --yes 归档 |
