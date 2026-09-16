# Task：3.0 W2 · 门禁入住宿主 + 接入面开放（gates in hosts + B5 · **战略目标兑现波**）

> **状态**：`draft`（2026-09-16 10-task 初稿 · HG-TASK-DRAFT / HG-AUDIT-R1 **双 approved**（均 2026-09-16 00 代签 · 授权真值：维护者本窗「授权00代签」· HG-AUDIT-R1 依据审查文 `task_3_0_w2_gates_in_hosts_audit_R1_20260916.md` R1 PASS-with-issues blocking 0 · advisory A1–A3 带入 30 执行登记）· 30 可开工）  
> **SPEC 真值**：[`docs/spec/3_0-architecture-leap/03_w2_gates_in_hosts_v1.md`](../../spec/3_0-architecture-leap/03_w2_gates_in_hosts_v1.md)（signed · HG-SPEC-SIGNOFF=approved · 范围 ①–⑧ · 验收 1–7 · F-W2-01–06）  
> **schema v2 设计真值**（hooks 声明结构 · 已批准定稿）：[`docs/harness/reviews/w1_schema_change_review_20260916.md`](../../harness/reviews/w1_schema_change_review_20260916.md) §2.2（host 级 `surfaces.hooks` · mechanism 三族 × triggers 两值 · 只声明与物化 · 运行时归宿主）  
> **上游 PLAN**：[`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W2 节 + 硬约束 **9**（对外文案事实卡）/ **12**（接入面不依赖改包发版）/ **14**（证据必须入库）/ **15**（闸不落表即虚设）  
> **前置已兑现**：W1 done（[`task_3_0_w1_schema_leap.md`](../done/task_3_0_w1_schema_leap.md) · schema v2 已交付：schema_version 探测 · hooks 三族 × {pre-commit, pre-archive} 声明 · defaults/extends · command_sets · 闸泛化机检咬住 blocks 含 30 任意闸）· W0 done（[`task_3_0_w0_refactor_prep.md`](../done/task_3_0_w0_refactor_prep.md) · 新布局 `src/host/*` / `src/cli/*`）  
> **基线（2026-09-16 本棒复跑实测 · 详见「开工基线」节）**：HEAD `f9f9c02` · npm test **667 tests / 130 suites / 666 pass / 0 fail / 1 skip** · typecheck 0 错 · pins check **17/17**（含 pin-17 13 宿主双语命中）  
> **行号口径**：本 task 全部行号为 2026-09-16 本棒实读现值（W0/W1 后新布局 · SPEC 头部快照行号已按 SPEC 自身条款回源码复核废弃）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-w2-gates-in-hosts` |
| **test_strategy** | `required` |
| **test_strategy_note** | 验收主体 = 机械锁全绿：host verify 双向 fixture（篡改/删除/合规）+ 合并铁律负向 fixture（内置 id 冲突拒载点名零污染 · 损坏表隔离）+ 第三方自定义 agent 双路 e2e（`--file` + 用户目录 · acme-bot）+ 降级快照断言（mechanism none 输出可区分）+ 内置表 v2 化恒等锁（resolved rows ≡ v1 展开 · planned writes 零漂移）+ ≥2 真实宿主 e2e 留证（claude + gemini · 脚本化演示日志入 tracked）+ pins 17/17；新行为一律**红测先行**（负 fixture 先红后绿）· e2e 脚本**不入** npm test 默认面（E3 耗时预算 · 基线 duration ≈81s） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | hooks 物化 + host verify + B5 接入面；不改图谱资产（`docs/_tech_graph/` 零触碰） |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 无规范增量；B5 用户指引落 host-adapt README 与 catalog 输出自描述，wiki 晋升与否归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身 3.0 波次系列；合入由维护者 push（仅人 · 无代跑授权） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | approved | — | 人 · 2026-09-16 维护者本窗签收 PLAN_3_0（3.0 双签之一） |
| HG-SPEC-SIGNOFF | approved | — | 人 · 2026-09-16 维护者本窗签收 3.0 SPEC 系列（同时授权 00 代签后续过程文档闸 · HG-RELEASE / npm publish / tag / push 不在授权范围 · 仍仅人） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-16 00 代签** · 授权真值：维护者本窗「授权00代签」· task lint PASS |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-16 00 代签** · 授权真值：维护者本窗「授权00代签」· 依据审查文 [`docs/harness/reviews/task_3_0_w2_gates_in_hosts_audit_R1_20260916.md`](../../harness/reviews/task_3_0_w2_gates_in_hosts_audit_R1_20260916.md)（R1 · PASS-with-issues · blocking 0 · advisory A1–A3 · 全部带入 30 执行登记：A1 闸裁决理由③类比强度注记 · A2 F-W2-13 登记口径可按实测收窄（行级 verify 断言影响面=零）· A3 e2e 验收文须登记 CLI 版本串（gemini CLI 已由 Antigravity CLI 取代的官方横幅数据点 · F-W2-06/07 兜底）） |

> **闸行裁决（留 20-task-audit 复核）**：W2 **不新设 HG-SCHEMA-CHANGE 行**。理由四条：① 硬约束 3 的闸对象 = host-adapt **schema（格式）** 变更 · 本波对 `host-adapt.schema.json` 与 `src/host/schema.ts` 校验器**零改动**（schema 格式未变 · 变则 F-W2-05 回退 W1）；② 内置表 `mvp-hosts.yaml` v1→v2 是按 **W1 已批准**（HG-SCHEMA-CHANGE approved · 2026-09-16 00 代签）的 v2 schema 写**数据** —— 数据迁移非格式变更；③ catalog.yaml 是**新 artifact 的自有格式**（`version: "1"` 自描述 · 类比 `.coding-kit/host-tools.json` 粘性文件自有 `version` 字段 · 历史上从未触发 schema 闸）· 非适配表 schema 变更；④ 执行期若发现 schema 洞（如 hooks 声明不足以表达物化需求）→ F-W2-05 通道回退 W1 补 schema 走 HG-SCHEMA-CHANGE · 本波不得夹带 breaking（SPEC §4 末行）。

---

## 背景与目标

**W1 交付声明层、本波交付兑现面**（SPEC §1）：schema v2 已支持 hooks 三族声明（`src/host/schema.ts:141-226` HOOK_MECHANISMS/HOOK_TRIGGERS · validateHooks 双模式校验）与 verify 节承接（`schema.ts:93-132`），resolved 模型已带 `hooks` 缺省注入（`src/host/resolve.ts:24-31,45-54,66` V1_DEFAULT_HOOKS）——但 **hooks 零物化**（`src/host/materialize.ts` planApply :197-205 只计划 always_on/skills/commands 三类 · PlannedItem.kind :34-43 无 hook）、**verify 零消费**（`src/host/cmd.ts:504-524` 子命令仅 validate/apply/update · 无 `host verify`）、**内置表仍为 v1**（`mvp-hosts.yaml` 219 行无 `schema_version` 键 · `test/w1-schema-version-detect.test.ts:116` 断言在案）。产品最大卖点（门禁随包内置 + 多宿主物化）仍悬空。

**B5 准确缺口**（SPEC §1 复核修正 · 非「外部表接不进来」）：`--file` 早已可用（`src/host/table.ts:73-76` resolveValidateFile 有 fileArg 即用、否则回包内默认 `DEFAULT_EXAMPLE_REL` :8）· 真正缺 = ① catalog（不可发现 · 无版本/完整性声明）② 用户级目录（须每次手传 `--file`）③ 多表合并（不能「内置 13 + 我的增量」）。

目标（SPEC §2 继承）：① hooks 按机制族物化到 13 宿主落点；② `host verify` 物化校验（篡改报红）；③ P0 门禁宿主内真生效（≥2 真实宿主 e2e）；④ B5 插件机制（catalog + 用户级目录 + 多表合并）；⑤ 无 hook 宿主显式降级 L1+L2 可区分。

---

## 开工基线（2026-09-16 本棒复跑实测 · 验收比对的唯一基准）

> 30 开工时若复跑结果与本表不符，按 F-W0-05 同式纪律处置（以复跑实测重建基线并登记 · 不得沿用旧数字强行比对）。

| 项 | 实测值 | 备注 |
|----|--------|------|
| git HEAD | `f9f9c02` | 工作区 clean（本棒交付 = 本 task 文件一件 · untracked） |
| `npm test` | **667 tests / 130 suites / 666 pass / 0 fail / 1 skip** | duration ≈81s · 与 W1 锁终态逐字一致（纯加性零回退后的复跑确认） |
| `npm run typecheck` | **0 错** | strict + noUncheckedIndexedAccess |
| `node bin/specgate.js pins check` | **17/17 PASS** | 含 pin-17 = 13 宿主双语命中（`src/cli-pins.ts:385-394` 直接 yamlLoad 原始表读 `hosts[].host_id` · 不过 schema 校验 · pin-17 四禁见 S3.2） |
| 内置表形态 | **v1**（219 行 · 无 `schema_version` 键 · 13 宿主 verify 逐字重复 13 遍 · 零 hooks 声明） | `test/w1-schema-version-detect.test.ts:116「现行包内表仍为 v1」断言在案（本波有意翻转 · F-W2-13 登记纪律） |
| compat 回归锁 | fixture `test/fixtures/host-adapt/mvp-hosts_2_4_2.yaml`（2.4.2 逐字拷贝 · sha256 钉死）+ `planned-writes-2_4_2.json` | W1 验收 #1 已锁 · **内置表 v2 化不影响本 fixture**（独立文件 · v1 路径永存） |

---

## W2 实现规格（10-task 定稿 · 30 按此实施）

### S3.1 机制族划分取证定稿（13 宿主 · 每格证据出处）

> SPEC §5.1 授权「具体族划分以 W2 task 复核各宿主文档后定稿」。本棒逐宿主核查官方文档（2026-09-16 检索 + 全文读取）· **对 SPEC 草案预期（claude=config-hook 首选 · cursor=候选 · 其余 none）作两处证据驱动修正**：cursor 候选→定稿 · gemini none→定稿（理由见表）。族抽象不为单宿主开特判分支（F-W2-06）。

| # | host_id | 机制族定稿 | 证据出处（tracked 路径 / 官方文档 / W2 执行期取证点） |
|---|---------|-----------|------------------------------------------------------|
| 1 | claude | **config-hook** | 官方 `code.claude.com/docs/en/hooks`（+hooks-guide）：项目级 `.claude/settings.json` **可入库共享**（Hook locations 表 · Single project · Shareable）· `PreToolUse` matcher `Bash` + `if: Bash(git commit *)` 命令串收窄（官方 block-rm 示例同构）· **exit 2 阻断**。仓内交叉证：W1 task S2.2 矩阵（`docs/tasks/done/task_3_0_w1_schema_leap.md:116-122`）· 本仓 dogfood 宿主（`.claude/` 已物化）。执行期取证点：`if` 条件语法在物化版本的实测校准（F-W2-06） |
| 2 | cursor | **config-hook**（修正：候选→定稿） | 官方 `cursor.com/docs/hooks`：项目级 `.cursor/hooks.json` · `beforeShellExecution` 权限类 hook · **exit 2 = 阻断（等价 permission:"deny"）** · cloud agents 跑仓内 hooks（repo 级生效旁证）。注意口径：**非 2 退出码默认 fail-open**（hook 脚本必须精确 exit 2 才阻断 · 物化模板与文档须写明）· 功能较新（Cursor 1.7 beta 起源）→ F-W2-06 执行期校准义务 |
| 3 | gemini | **config-hook**（修正：SPEC 预期 none→定稿） | 官方 `geminicli.com/docs/hooks` + `github.com/google-gemini/gemini-cli` docs/hooks/writing-hooks.md：`.gemini/settings.json` **项目层最高优先级**（四层合并序首位）· `BeforeTool` **正则 matcher**（`run_shell_command`）· `{"decision":"deny"}` 或 **exit 2 阻断** · 官方「Block secrets in commits」示例 = pre-commit 直接对应。升级理由：npm 可装 + `-p` headless 无头自动化 ⇒ **e2e 第二真实宿主可脚本化**（cursor-agent 无头自动化不确定 · S3.7）。执行期取证点：hooks 功能在当前 release 的稳定性实测（F-W2-06） |
| 4 | codex | **none**（本波 · 候选登记 3.x） | 证据已查得 `learn.chatgpt.com/docs/hooks`：`<repo>/.codex/hooks.json` · `PreToolUse` · block 语义存在 —— **但**「Non-managed hooks must be reviewed and trusted before they run」信任门 ⇒ 无人值守物化/e2e 摩擦（首次运行须交互信任 · 违「装一次全局可用」体验）。保守裁决落 none + F-W2-06 取证点登记 · **20-task-audit 复核点**（是否本波扩 codex） |
| 5 | opencode | **none** | 官方 `opencode.ai/docs/plugins`：plugin = **JS/TS 代码运行时**（非声明式配置）· 不符 config-hook「宿主配置文件声明式钩子」定义（评审文 §2.2）· 物化可执行代码的运行时边界模糊（非范围「替宿主实现 hook 运行时」擦边）· 3.x 可复议。仓内证：2.3 W6 取证卡（`docs/tasks/done/task_2_3_wiring_w6_host_completion.md`）未含 hook 面 |
| 6 | dsh | **none** | 本仓自有宿主（DeepSeek Harness）· 无文档化 hooks 配置面 · W2 执行期取证点（若 DSH 后续出 hooks 面 → 3.x 复议） |
| 7 | agents | **none** | 通用 markdown 注入层（AGENTS.md 协议）· 无宿主运行时 · 无 hook 机制可言 |
| 8 | copilot | **none** | 2.2 W6 取证卡（`docs/tasks/done/task_2_2_closed_loop_w6_host_expansion.md`）未含 hook 机制面 · 无项目级阻断 hooks 官方文档 · W2 执行期取证点 |
| 9 | windsurf | **none** | 同 2.2 W6 取证卡 · 无 hooks 配置面官方文档 · W2 执行期取证点 |
| 10 | roo | **none** | 官方仅 notification hook 提案（`RooCodeInc/Roo-Code` issue #12025 · 未成配置面）· 2.3 W6 取证卡未含 hook 面 |
| 11 | zed | **none** | 外部 agent 经 ACP 接入（`zed.dev/docs/ai/external-agents`）· 无 hooks 配置面 |
| 12 | cline | **none** | 无文档化 hooks 配置面 · 2.3 W6 取证卡未含 hook 面 |
| 13 | aider | **none** | 有 lint/test auto-run 配置（`--auto-lint` 等）但**非 pre-commit 阻断型 hook 机制**（事后跑非拦截）· 2.3 W6 取证卡（降级标注在案） |

**族 × 触发点承载定稿**：

| 机制族 | pre-commit | pre-archive |
|--------|-----------|-------------|
| config-hook（claude/cursor/gemini） | **物化**（拦截 `git commit` 命令串 → 跑门禁 → 红则阻断） | **物化**（拦截 `spec-wave task close` 命令串 → 跑门禁 → 红则阻断 · 与 pre-commit 同机制不同匹配串） |
| shell-hook（无内置宿主声明 · 第三方族） | **物化**（`.git/hooks/pre-commit` 脚本注入 · git 层宿主中立） | **不物化 · 降级留痕**（无宿主原生事件锚点 · W1 矩阵已登记承载强度低 · 声明了该 trigger 的 shell-hook 宿主 → 物化输出标 `pre-archive: not-materialized` · 不静默） |
| none（10 宿主） | —（显式降级 L1+L2 · S3.5） | — |

### S3.2 内置表 v2 化方案（`mvp-hosts.yaml` 219 行 → schema_version: 2）

**改写内容**（一处 commit 独立交付）：

1. 表首增 `schema_version: 2`（探测分派走 v2 完整校验 · `schema.ts:517-522`）。
2. 增根级 `command_sets`：core 5 + expanded 7 + forbidden 2（= `resolve.ts:77-95` BUILTIN_* 逐字值 · F-W1-07 v2 表缺 command_sets 报红 ⇒ 必填）。
3. **13 宿主全量显式 hooks 声明**（降级锚点 · S3.5 前提）：
   - claude / cursor / gemini：`hooks: {mechanism: config-hook, triggers: [pre-commit, pre-archive], command: "npx spec-wave verify --target ."}`（command 与评审文 §2.2 示例逐字）。
   - 其余 10 宿主：`hooks: {mechanism: none}`（F-W1-10 口径 · 禁带 triggers/command）。
4. **defaults/extends 消重复 —— 裁决：做**（搭车 · 仅限 verify 面）：根 `defaults.surfaces.verify = {kind: cli, bin: spec-wave, failClosed: true}` + 每宿主 `extends: defaults`。利弊评估：利 = 13 遍 verify 逐字重复正是 B2 设计要消的面（评审文 §2.3 点名）· 真值表自身 dogfood defaults 路径（否则 defaults 能力只有 fixture 证明、真值表零使用）· resolved 展开恒等由恒等锁证明（验收 #8）；弊 = 触碰 pin-17 直读的原始 YAML（**但 host_id 保持行级 · 前提不受影响**）· 行级 verify 结构断言测试须登记更新（F-W2-13 · 实测影响面见下表）。**AGENTS 系 10 行的 always_on/skills 进一步继承（agents 基行）登记为不做**（各行 target_dir 不同 · extends 链语义复杂化真值表得不偿失 · 3.x 可复议）。
5. **pin-17 四禁守住**（评审文 §5.1 · `cli-pins.ts:385-394` 直接 yamlLoad 原始表 · 不过 schema 校验）：禁 `hosts` 改 map 形态 · 禁 `host_id` 移出行级 · 禁 13 宿主 id 变更 · 禁表文件路径变更（`release-pins.yaml` 钉死 `assets/ide/host-adapt/examples/mvp-hosts.yaml`）。

**v1 消费面回归影响盘点**（本棒实测 · 30 执行期复核）：

| 消费面 | 影响 | 处置 |
|--------|------|------|
| compat fixture（`test/fixtures/host-adapt/mvp-hosts_2_4_2.yaml` + `planned-writes-2_4_2.json`） | **零影响**（独立 v1 拷贝 · sha256 钉死 · v1 兼容桥永存） | 不动 |
| `test/w1-schema-version-detect.test.ts:116`「现行包内表仍为 v1」 | **有意翻转**（v1→v2 即本波动作） | 改写断言为「包内表为 v2 · 探测分派零 issue」· F-W2-13 登记 |
| `test/host-adapt-validate.test.ts:49`（validate live 表 PASS） | v1→v2 校验路径切换 · 合法 v2 表仍 PASS | 预期零改动 · 红了按 F-W2-13 登记 |
| 读 live 表 raw YAML 断言结构（`host-adapt-w2-commands-ux.test.ts:105` · `w3-dsh-orch.test.ts:118` · `w4-expanded.test.ts:119` · `w6-three-hosts.test.ts:13` · `w6-2_3-six-hosts.test.ts:13`） | 行级 always_on/skills/commands **不动** ⇒ 预期零改动；凡断言行级 `verify` 键者（verify 挪入 defaults 后行级消失 · 如 `w2-commands-ux.test.ts:19` 附近）须登记更新 | 30 执行期实读盘点 · F-W2-13 逐条登记 |
| planned writes（live 表） | claude/cursor/gemini 新增 hooks 物化落点 ⇒ planned 列表**增加**条目 · 「包含」语义断言零改动 · 「精确等于」快照须登记更新 | 30 盘点 · 快照更新登记 |
| `cli-json-no-abs-path.test.ts:436,501,538`（路径相对化） | 表路径不变 | 零改动 |
| `pins-consistency.test.ts:1335`（pin-17 路径） | 表路径不变 | 零改动 |
| **恒等锁（新增 · 验收 #8）** | v2 化内置表 resolved rows ≡ 升级前 v1 resolved rows（除 hooks 键逐点登记：3 行 config-hook + 10 行显式 none ≡ v1 缺省注入）· planned writes 非 hooks 落点逐字一致 | 红测先行 fixture |

### S3.3 hooks 物化（范围① · 机制族物化器 · 运行时归宿主）

- `materialize.ts` planApply 扩展：PlannedItem.kind 增 `'hook'`（或同级结构 · 30 细节裁决）· 按 resolved rows 的 `surfaces.hooks.mechanism` 分族物化 · **族抽象不为单宿主开特判分支**（族内按宿主声明的配置落点模板数据驱动）。
- **config-hook 物化模板**（三宿主落点 · 声明条目 → 宿主配置）：

| 宿主 | 配置落点 | 物化条目形态（语义规格 · 字面 30 定稿） |
|------|----------|------------------------------------------|
| claude | `.claude/settings.json` | `hooks.PreToolUse[]` 追加产品条目：matcher `Bash` + 命令串收窄（`git commit` / `task close`）· command 调门禁分发（下）· exit 2 阻断 |
| cursor | `.cursor/hooks.json` | `hooks.beforeShellExecution[]` 追加产品条目 · command 同上 · **exit 2 = deny（fail-open 默认口径文档化 · 脚本必须精确 exit 2）** |
| gemini | `.gemini/settings.json` | `hooks.BeforeTool[]` 追加产品条目：matcher `run_shell_command` · command 同上 · exit 2 / decision deny 阻断 |

- **门禁分发**（③ 生效机制 · 语义规格）：物化条目的 command 调用 spec-wave 提供的 hook 分发入口（如 `npx spec-wave hook-guard --trigger <pre-commit|pre-archive>` · 命名 30 裁决）：读宿主经 stdin 传入的事件 JSON → 按 trigger 匹配被拦截命令串（`git commit …` / `spec-wave task close …`）→ 命中则跑声明的门禁 command（`npx spec-wave verify --target .`）→ 红则 **exit 2 阻断** · 未命中 exit 0 静默放行。分发逻辑属「宿主侧 hook 脚本/config」范畴（SPEC ③ 形态明示）· **不实现宿主 hook 运行时本身**（非范围）。
- **JSON 合并落点口径**（F-W2-10）：落点文件已存在且含用户键 → **JSON 深合并保用户键**（产品条目追加 · 以可识别标记如 matcher/command 串或 `spec-wave` 命名键标识为本包管理）；产品位已有**非本包管理**条目且内容不同 → conflict op skip 点名（同 `remapUpdateConflicts` 既有语义 · `materialize.ts:398`）· **不得覆写用户配置**。
- **shell-hook 物化**：`.git/hooks/pre-commit` 写入门禁脚本（含 `spec-wave-managed` marker 行）；已存在**非本包管理** hook → conflict skip 点名（F-W2-11 · 不得静默覆盖用户既有 git hook）；已存在本包 marker → 幂等更新（skip_identical/merge 同既有口径）。
- **S2 扫描沿用**：hooks 物化落点经既有 S2 拒绝面（`schema.ts:23-31` checkS2Field + planApply s2 收集 · `cmd.ts:269-285`）· hooks 声明本身无落盘路径字段（评审文 §2.2 · 不扩展 checkS2Field）· 物化落点常量（`.claude/` `.cursor/` `.gemini/` `.git/hooks/`）全部非 S2。

### S3.4 `host verify` 物化语义（范围② · SPEC §5.2 定稿）

- **新子命令**：`host verify [--tools LIST|all] [--target PATH] [--file PATH] [--json]`（`cmd.ts` cmdHost :504-524 增分派）。`--tools` 缺省解析 = **粘性 host_ids**（`sticky.ts` loadHostToolsSticky · 与 host update 方案 A 同口径 `cmd.ts:415-428`）· 无粘性且无 `--tools` → exit 1 提示。
- **比对口径三分形态**（读取宿主侧已物化内容 ↔ resolved 声明逐项比对）：
  1. **全文件管理落点**（skills/commands 物化文件 · 独立 hook 脚本）→ **逐字比对**：内容不一致/文件缺失 → 报红点名落点。
  2. **marker-merge 落点**（CLAUDE.md/AGENTS.md/GEMINI.md）→ **产品块比对**（`cyning-harness:begin/end` 包裹段逐字 · local 块与块外用户内容**不计入** —— 用户定制不构成「篡改」· 正例绿 fixture）。
  3. **JSON 合并落点**（`.claude/settings.json` / `.cursor/hooks.json` / `.gemini/settings.json`）→ **包含性比对**：声明的产品 hook 条目须逐字存在于宿主配置相应位置（用户其他键不计）· 条目被删/被改 → 报红点名。
- **fail-closed**（F-W2-04 · 与 W1 verify 节声明对接）：落点无法读取（权限/IO 错）→ **按红处理**（不得静默跳过）· resolved 行 `surfaces.verify.failClosed: true`（13 宿主全声明）即本口径的声明锚点 —— `host verify` 是 verify 节声明的**首个消费面**；报告面展示 verify 声明已被消费（kind/bin 随报告输出 · 硬约束 9：此后 verify 不再是「只声明零消费」· 对外文案可转正 · W7 口径联动登记）。
- **mechanism none 宿主**：hooks 面无落点可比 → 输出 `hooks: degraded-none` 状态行（S3.5）· **不计红绿比对项**（无 hook 不是缺陷 · 是显式降级）。
- **输出**：逐宿主逐落点状态 + `HOST VERIFY: PASS|FAIL` · exit 0（全绿）/ 2（任一红）· `--json` 键集（command/target/hosts/checks/verdict · 30 定稿后以 cli-flags 键集 fixture 钉死）。

### S3.5 降级留痕（范围⑧ · F-W2-01）

- **声明锚点**：内置表 13 行全量显式 hooks 声明（S3.2-3）⇒ 「显式降级」与「未声明缺省」在表数据层可区分。
- **物化期**：apply/update 报告中 mechanism none 宿主带显式降级行（语义：`hooks: degraded-none（L1+L2 · 宿主无 hook 机制 · 门禁仅 CLI 侧）` · 字面 30 定稿）· human 输出与 `--json` 同键呈现。
- **校验期**：host verify 同口径降级状态行（S3.4）。
- **快照断言点**：report 渲染器（`report.ts` printHostHuman / printJson 面）· 降级行入快照 fixture · **不得出现 L3 / 已生效 暗示字样**（硬约束 9 · 负向断言「输出不含 L3」）。
- L1/L2/L3 口径（文档化）：L3 = 宿主内门禁生效（hook 真实触发阻断）· L1+L2 = CLI 侧 verify + 声明物化 · config-hook 宿主物化完成 ≠ L3（L3 以 e2e 证据为准）。

### S3.6 B5 设计定稿（范围④⑤⑥ · SPEC §5.3 草案 → 定稿）

**加载优先级与合并（定稿）**：

1. `--file PATH` 给出 → **当次整表替换**（现状语义逐字保留 · `table.ts:73-76` · 向后兼容红线）：该文件 alone · 内置与用户目录均不参与合并。第三方 `--file` 路径行为与 2.4.2 逐字一致。
2. 无 `--file` → **内置表恒为基底 + 用户级目录增量合并**：`~/.spec-wave/hosts/*.yaml|*.yml`（`catalog.yaml` 除外）按**文件名序**确定性加载 · 逐表独立探测分派（v1/v2 用户表均可）。
3. **合并铁律**（F-W2-02/F-W2-03 · fail-closed · U-01 同档先例 `cmd.ts:255-258` exit 2 零写入）：
   - 用户表 host_id 与**内置 13** 冲突 → **该表整表跳过 + 报错点名冲突 id + exit 2 零写入**（dry-run 同口径报红 · 内置表零污染断言）。
   - 用户表**之间**同 host_id → 后加载表整表跳过 + 报错点名 + exit 2 零写入（文件名序决定先后 · 确定性）。
   - 损坏表（YAML 解析失败 / schema 非法）→ 整表跳过 + 报错点名（文件路径 + 原因）+ exit 2 零写入 · **坏表内容不入合并 · 不污染内置与其他用户表**（隔离性）。
   - 合并结果 = resolved 模型（内置基底行 + 增量行）· 下游 `resolvedHostRows`/`commandSetsOf`/`listKnownHostIds` 消费面同构扩展（init 询问面随之可见自定义宿主 · 登记为消费点）。
4. **catalog 格式**（④ 可发现 + 版本/完整性声明 · 新 artifact 自有格式 · 非适配表 schema 变更 · 闸行裁决③）：`~/.spec-wave/hosts/catalog.yaml`（**可选**）——
   ```yaml
   version: "1"            # catalog 自身格式版（整数探测同思路 · 未知版 fail-closed）
   tables:
     - file: acme-hosts.yaml        # 同目录表文件名（禁路径逃逸 · 禁绝对路径）
       source: "acme 内部 agent 适配 · 张三 2026-10"   # 来源声明（人读）
       table_version: "1"           # 与表内 version 串一致性提示（不符 → 警告不拒载）
       sha256: "<hex>"              # 完整性声明（呈现即强制 · 不符 → 该表拒载点名 · F-W2-09）
   ```
   - catalog 缺失 → 目录内 *.yaml 全量照载（`host catalog list` 标 `integrity: none`）· catalog 呈现但表无条目 → 照载 + 标 `uncataloged`（可发现性如实呈现 · 不拒载）。
   - 新子命令 `host catalog list [--json]`：列内置 13（`origin: builtin`）+ 用户表（origin/source/integrity 状态）· ④「可发现」兑现面。
5. **平台差异口径**（F-W2-08 · SPEC residual_risks ②）：路径解析 = **纯函数可注入 home**（`userHostsDirOf(home)` · 单测跨平台语义一致断言 · 沿用 2.4 W6 双平台先例）；运行时 home = `os.homedir()`；Windows = `%USERPROFILE%\.spec-wave\hosts\`；测试经 home 注入/HOME env 重定向（**永不触碰真实用户目录**）。

### S3.7 e2e 证据方案（范围③⑦ · 硬约束 12/14）

- **≥2 真实宿主端到端**（SPEC 验收 1 · 硬条）：首选对 = **claude**（headless `claude -p` 驱动 Bash 工具执行 `git commit` → PreToolUse hook 触发 → 脏提交被拒）+ **gemini**（`gemini -p` headless · BeforeTool(run_shell_command) 触发 → deny 拒）。cursor 若 cursor-agent/环境可得 → 追加第三件证据（**不作硬条** · S3.1 不确定性登记）。
  - 留证形态：**脚本化演示**（`scripts/e2e-w2-host-gates.mts` · **不入 npm test 默认面** · E3 耗时预算）+ 输出日志 + 验收文落 `docs/harness/reviews/w2_gates_in_hosts_e2e_<date>.md`（硬约束 14 tracked）。每件证据含：环境版本串 → hook 被宿主真实触发 → 脏提交被拒（exit 非 0 / deny 决策）→ 合规提交放行。
  - e2e 硬条 = **pre-commit 拒绝脏提交**（两宿主）；pre-archive 以 fixture + host verify 断言（物化条目存在且未被篡改）· pre-archive 真实触发演示登记为加分项（执行期环境允许则做）。
  - 环境不可用（claude/gemini 未装/版本不符）→ F-W2-07：环境红对照实验定性 · **不得用 fixture 冒充真实宿主证据** · 件数不足则验收 #1 不放行（本波硬条）。
- **第三方自定义 agent e2e**（SPEC 验收 5 · 硬约束 12 · 在 npm test 内可跑）：fixture 表 `test/fixtures/host-adapt/acme-hosts.yaml`（`host_id: acme-bot` · **非内置 13** · surfaces 三节 + `hooks: {mechanism: shell-hook, triggers: [pre-commit], command: "npx spec-wave verify --target ."}`）——
  - **路①（--file 现状路径）**：`host validate --file` PASS → `host apply --file acme-hosts.yaml --tools acme-bot --yes`（temp target）物化 → `host verify --file … --tools acme-bot` 绿 → 篡改落点 → 红。
  - **路②（catalog/用户目录 B5 路径）**：注入 home 的 `.spec-wave/hosts/` 放表 → 无 `--file` `host apply --tools acme-bot`（合并解析出 acme-bot）→ `host catalog list` 可见 → host verify 绿。
  - **负向**：同目录放冲突表（`host_id: cursor`）→ 拒载 + 点名 + 内置 cursor 行 resolved 零污染断言。
  - **shell-hook 族端到端**（temp git 仓 · git 可用性前置探测 · 不可用显式 skip · 硬约束 10）：acme-bot 物化 `.git/hooks/pre-commit` → 真实 `git commit` 脏提交被拒 · 合规放行。**计数口径**：本条证明 shell-hook 族物化闭环 · **不计入**「≥2 真实宿主」件数（真实宿主 = claude/gemini 专有运行时）。

### S3.8 闸行裁决（已在闸表下注 · 摘要）

W2 不设 HG-SCHEMA-CHANGE 行（四理由见闸表下注）· 留 20-task-audit 复核（重点：catalog 定性③）。本 task 闸表 = HG-TASK-DRAFT | **approved**（2026-09-16 00 代签 · 授权真值：维护者本窗「授权00代签」）| 20,30 + HG-AUDIT-R1 | pending | 30 · 双 approved 后 30 方可改码。

---

## 范围

- [ ] **① hooks 物化**（SPEC §3-① · S3.1/S3.3）：机制族物化器（config-hook 三宿主落点模板 + shell-hook git 钩子注入 + none 降级无落点）· JSON 深合并保用户键 + conflict skip 点名 · marker 幂等
- [ ] **② `host verify` 物化**（SPEC §3-② · S3.4）：新子命令 · 比对口径三分形态（逐字 / 产品块 / 包含性）· fail-closed 无法读取按红 · 粘性缺省解析 · exit 0/2 + --json
- [ ] **③ P0 门禁宿主内生效**（SPEC §3-③ · S3.3 门禁分发 + S3.7）：hook-guard 分发入口 · ≥2 真实宿主 e2e 留证（claude + gemini · tracked 验收文）
- [ ] **④ B5 catalog**（SPEC §3-④ · S3.6-4/5）：catalog.yaml 格式（来源/版本/sha256 完整性）· `host catalog list` · 完整性呈现即强制（不符拒载点名）
- [ ] **⑤ B5 用户级目录**（SPEC §3-⑤ · S3.6-2/5）：`~/.spec-wave/hosts/` 自动加载 · 文件名序确定性 · 纯函数注入 home 跨平台断言
- [ ] **⑥ B5 多表合并**（SPEC §3-⑥ · S3.6-3）：内置恒基底 + 增量合并 · 合并铁律三面（内置冲突拒 / 用户间冲突拒 / 损坏隔离）· exit 2 零写入 · 负向 fixture 固化
- [ ] **⑦ 第三方自定义 agent e2e**（SPEC §3-⑦ · S3.7）：acme-bot 非内置 id · `--file` 与 catalog **双路**走通 · host verify 对其生效（绿→篡改→红）
- [ ] **⑧ 无 hook 宿主降级留痕**（SPEC §3-⑧ · S3.5）：10 宿主显式 `mechanism: none` 声明 · 降级行输出可区分 · 快照断言 · 无 L3 暗示
- [ ] **⑨ 内置表 v2 化**（本 task 新增 · S3.2 · SPEC §2 目标 1 的表数据前提）：`schema_version: 2` + command_sets + 13 行 hooks 声明 + defaults/extends 消 verify 重复 · pin-17 四禁守住 · 恒等锁

## 非范围

| 项 | 理由 |
|----|------|
| 替宿主实现 hook 运行时 | SPEC §4 · 口径既定「只声明与物化 · 运行时归宿主」（hook-guard 是被宿主运行时调用的命令 · 非运行时本身） |
| 远程/在线适配表分发 | SPEC §4 · 第二分发通道已冻结（路线 §6）· catalog 仅本地 |
| 新增**内置**宿主 | SPEC §4 · B4 已于 2.3 完成 13 宿主 · 本波只开放接入面 |
| 承诺「接入即获得 L3」 | SPEC §4 · 无 hook 能力宿主降级 L1+L2 · 对外文案受硬约束 9 |
| W1 schema 再变更 | SPEC §4 · schema 定稿于 W1 · 发现洞 → F-W2-05 回退 W1 走 HG-SCHEMA-CHANGE · 本波不得夹带 breaking |
| codex 升 config-hook / opencode plugin 物化 / AGENTS 系 always_on/skills 进一步继承 | S3.1/S3.2 裁决登记 · 3.x 复议入口保留 |
| pre-archive 的 shell-hook 物化 | S3.1 族×触发表 · 无宿主原生事件锚点 · 降级留痕 |
| 追溯存量 task / 改 pins 判据语义（pin-17 语义判归 W4） | 硬约束 7 · PLAN W4 |
| 发布四动作（tag/push/publish/deprecate） | 仅人 · 无代跑授权（RELEASING.md） |

---

## failure_paths

| 触发 | 行为 | 可重试 | 用户可见 |
|------|------|--------|----------|
| 宿主声明 hooks 但环境无可用机制（F-W2-01） | 显式降级 L1+L2 · 输出可区分（degraded-none 状态行 · 快照断言）· 不静默装 L3 | 是 | 是 |
| 用户表与内置宿主 id 冲突（F-W2-02） | 该表整表拒载 + 报错点名冲突 id + exit 2 零写入 · 内置零污染（负向 fixture） | 是（修表后） | 是 |
| 用户表损坏（YAML 解析失败 / schema 非法）（F-W2-03） | 该表跳过 + 报错点名（路径+原因）· 坏表内容不入合并 · 不影响内置与他表 · exit 2 零写入 | 是（修表后） | 是 |
| `host verify` 无法读取宿主落点（F-W2-04） | fail-closed 按红处理并点名 · 不得静默跳过（verify.failClosed 声明锚点） | 是 | 是 |
| W1 schema 洞在物化时暴露（F-W2-05） | STOP 回退 W1 补 schema（走 HG-SCHEMA-CHANGE）· 本波不得夹带 breaking | 是 | 是 |
| 宿主 hook 文档与实际行为不符（F-W2-06） | 机制族内按实测校准 · 校准记录留痕（e2e 验收文登记）· 族抽象不为单宿主开特判分支 | 是 | 是 |
| e2e 宿主 CLI 环境不可用 / 版本不符（F-W2-07 · 本棒新增） | 环境红对照实验定性（F-W0-07 同式）· 不得计入测试红 · **不得用 fixture 冒充真实宿主证据** · 件数不足验收 #1 不放行 | 是 | 是 |
| 用户目录加载平台差异（~ 解析 / Windows 路径）（F-W2-08 · 本棒新增） | 纯函数注入 home · 跨平台语义一致断言 · 目录不可读报错点名（不静默当无表） | 是 | 是 |
| catalog sha256 完整性声明与表文件不符（F-W2-09 · 本棒新增） | 该表拒载 + 点名（file + 声明值/实测值）· exit 2 零写入 | 是（修声明或表） | 是 |
| hooks 物化落点与用户既有配置冲突（settings.json 已有非本包 hooks 条目）（F-W2-10 · 本棒新增） | JSON 深合并保用户键 · 非本包管理条目内容不同 → conflict skip 点名 · 不得覆写用户配置 | 是（--force 归 update 既有语义 / 手工裁决） | 是 |
| `.git/hooks/pre-commit` 已存在非本包管理 hook（F-W2-11 · 本棒新增） | conflict skip 点名 · 不得静默覆盖用户既有 git hook | 是 | 是 |
| 内置表 v2 化后 resolved 展开与 v1 语义不恒等（除 hooks 注入键）（F-W2-12 · 本棒新增） | 恒等锁 fixture 拦截（验收 #8）· 不得放行 | 是 | 是 |
| live 表消费测试因 v2 化需改（F-W2-13 · 本棒新增） | F-W1-13 同式纪律：逐条登记 · 限「现行包内表仍为 v1」有意翻转 + 行级 verify 结构断言 + planned 精确快照 · 行为断言面零改动 | 是 | — |
| `git add -A` 裹挟域外档（F-W2-14） | 打回 · 撤 stage 逐文件显式 add | 是 | — |
| 越权执行 tag/push/publish/deprecate（F-W2-15） | 违禁令 · 打回（四动作全仅人） | — | 是 |

---

## 验收标准（必须自证，不接受「我改完了」）

- [ ] **#1 ≥2 真实宿主 e2e 留证**（SPEC 验收 1 · S3.7）：claude + gemini 脚本化演示各一件 · 每件含环境版本串 + hook 真实触发 + 脏提交被拒 + 合规放行 · 日志与验收文落 `docs/harness/reviews/w2_gates_in_hosts_e2e_<date>.md`（tracked · 硬约束 14）· cursor 第三件为加分非硬条
- [ ] **#2 host verify 双向**（SPEC 验收 2 · S3.4）：正 fixture 合规报绿 exit 0 · 负 fixture 四类红（篡改全文件落点内容 / 删除落点文件 / 篡改 JSON 配置内产品 hook 条目 / 篡改或删除 marker 产品块）报红**点名落点** exit 2 · 无法读取落点 fail-closed 红
- [ ] **#3 合并铁律负向 fixture**（SPEC 验收 3 · S3.6-3）：内置 id 冲突表拒载 + 点名 + 内置行 resolved 零污染断言 · 用户表间冲突后载者拒 · 损坏表跳过点名 exit 2 零写入 · 正向增量宿主正常物化绿
- [ ] **#4 pins + validate 全绿**（SPEC 验收 4）：`node bin/specgate.js pins check` **17/17**（含 pin-17 双语命中）· v2 化内置表 `host validate` PASS（v2 校验路径）· 2.4.2 compat fixture 仍零改动通过（W1 回归锁不回退）
- [ ] **#5 第三方双路 e2e**（SPEC 验收 5 · 硬约束 12 · S3.7）：acme-bot 非内置 id · 路① `--file` 全程走通 · 路② 用户目录+catalog 全程走通 · host verify 对其生效（绿→篡改→红）· **证明接入面不依赖改包发版**
- [ ] **#6 降级留痕可区分**（SPEC 验收 6 · S3.5）：mechanism none 宿主 apply/verify 输出含 degraded-none 降级行 · 快照断言 · 输出**不含** L3/已生效暗示字样（负向断言）
- [ ] **#7 平台锁**（SPEC 验收 7）：`npm run typecheck` 0 错 · `npm test` 全绿（基线 667 + 新增用例数 · 零意外红 · 环境红先对照实验定性 · duration 控制在基线 ≈81s 加性克制 · e2e 脚本不入默认面）
- [ ] **#8 内置表 v2 化恒等锁**（S3.2 · F-W2-12）：v2 化内置表 resolved rows ≡ 升级前 v1 resolved rows（hooks 键差异逐点登记 = 3 行 config-hook + 10 行显式 none ≡ 缺省注入）· planned writes 非 hooks 落点逐字一致
- [ ] **#9 verify 比对口径边界**（S3.4）：marker-merge 落点用户 local 块/块外编辑**绿**（不计篡改）· JSON 合并落点用户其他键编辑**绿** · 产品块/产品条目被篡改**红**（正负双例 fixture）
- [ ] **#10 shell-hook 族 e2e**（S3.7 · npm test 内）：temp git 仓 acme-bot pre-commit 物化 → 真实 git commit 脏拒/合规放行 · git 不可用显式 skip（硬约束 10）
- [ ] **#11 catalog 正负面**（S3.6-4/5）：`host catalog list` 列内置 13（origin: builtin）+ 用户表（source/integrity 状态）· sha256 符→载 / 不符→拒载点名 · catalog 缺失照载标 `integrity: none` · uncataloged 标注
- [ ] **#12 既有测试面零改动全绿**：11 件 `test/host-adapt-*.test.ts` + w1 系 6 件 + gate 系 + cli-flags/cli-json 系（**除 F-W2-13 登记项**）· 登记项逐条列明于自检结论
- [ ] **#13 结构闸**：`npx spec-wave task lint --file docs/tasks/active/task_3_0_w2_gates_in_hosts.md` PASS
- [ ] **#14 执行粒度**：提交逐文件显式 add（禁 `git add -A`）· 每 commit 独立可回退 · 每 commit 前后 npm test 同绿 · 未执行 tag/push/publish/deprecate · 波末 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w2_gates_in_hosts.md` → exit 0 + `task close --yes` 闭环

---

## 给执行帽的必读列表

1. SPEC [`03_w2_gates_in_hosts_v1.md`](../../spec/3_0-architecture-leap/03_w2_gates_in_hosts_v1.md) **全文**（范围 ①–⑧ · §5 设计 · 验收 1–7 · F-W2-01–06）· [`00_policy_and_boundaries.md`](../../spec/3_0-architecture-leap/00_policy_and_boundaries.md)（S2/P0/流程边界）
2. **schema v2 设计真值** [`w1_schema_change_review_20260916.md`](../../harness/reviews/w1_schema_change_review_20260916.md) §2.2（hooks 声明结构）· §2.3（verify 承接）· §5（pins/测试面）
3. PLAN [`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W2 节（:228-235）+ 硬约束 9/12/14/15（:337,340,342,343）
4. 现码（2026-09-16 实读行号 · 改前复读）：`src/host/cmd.ts`（cmdHost 分派 :504-524 · U-01 degraded exit 2 零写入先例 :255-258 · --file 解析 :93/:198/:363 · 粘性缺省 :415-428）· `src/host/table.ts`（DEFAULT_EXAMPLE_REL :8 · resolvedHostRows :51-61 · resolveValidateFile :73-76 · listKnownHostIds :79-97）· `src/host/schema.ts`（validateHooks :151-226 · validateVerify :93-109 · 探测树 :483-510 · 分派 :517-522 · checkS2Field :23-31）· `src/host/resolve.ts`（HooksDecl :24-31 · ResolvedHostRow :45-54 · V1_DEFAULT_HOOKS :66 · resolveV2Rows :179-255）· `src/host/materialize.ts`（PlannedItem :34-43 · planApply :197-205 · remapUpdateConflicts :398 · marker-merge :85-98）· `src/host/report.ts`（printHostHuman/printJson 渲染面 · 降级断言点）· `src/host/sticky.ts`（loadHostToolsSticky）· `src/host-contract.ts`（evaluateHostContract）· `src/cli-pins.ts:385-394`（pin-17 提取 · 直接 yamlLoad 不过 schema 校验）
5. 表与文档：`assets/ide/host-adapt/examples/mvp-hosts.yaml`（219 行 · v1 · S3.2 改写对象）· `assets/ide/host-adapt/README.md`（宿主×表面矩阵 :81-107 · 本波须随 hooks 物化更新 · pin-11/12 钉版本串行 :1/:61 不动）· `assets/ide/host-adapt/host-adapt.schema.json`（本波零改动 · 动即 F-W2-05）
6. 机制族证据（S3.1 表 · 执行期 F-W2-06 校准义务）：claude `code.claude.com/docs/en/hooks` · cursor `cursor.com/docs/hooks` · gemini `geminicli.com/docs/hooks` + gemini-cli 仓 docs/hooks/writing-hooks.md · codex `learn.chatgpt.com/docs/hooks`（信任门登记）
7. 既有测试面：11 件 `test/host-adapt-*.test.ts` + w1 系 6 件（`w1-schema-version-detect` :116 翻转登记 · `w1-v1-compat-lock` · `w1-extends-resolve` · `w1-hooks-command-sets` · `w1-gate-generalization` · `host-adapt-w1-skills-parity`）· fixture `test/fixtures/host-adapt/`（2.4.2 compat 两件不动 · acme-hosts.yaml 本波新增）
8. done task [`task_3_0_w1_schema_leap.md`](../done/task_3_0_w1_schema_leap.md)（格式/基线复跑/逐文件 add/红测先行/登记纪律先例 · S2.2 机制族×触发点矩阵 :116-122）· [`task_3_0_w0_refactor_prep.md`](../done/task_3_0_w0_refactor_prep.md)（F-W0-05 基线重建/F-W0-07 环境红对照实验先例）
9. `RELEASING.md`（发布边界 · 四动作仅人）· `MIGRATION.md`（W1 草案节已落 · 本波若补 B5 用户指引只追加不动钉点行 pin-14 :3）

---

## 思考轮

### R0 · 证据

SPEC 03（signed）+ PLAN W2/硬约束 + W1 评审文 §2.2 + 本棒全量实读复核：新布局行号现值（cmd/table/schema/resolve/materialize/report/sticky/cli-pins · 见必读 4）· hooks 零物化/verify 零消费/内置表 v1 三事实复证（planApply 无 hook kind · cmdHost 三分支 · w1-schema-version-detect:116 断言）· 基线复跑 667/130/666/0/1 + typecheck 0 + pins 17/17（HEAD f9f9c02）· **机制族逐宿主官方文档核查**（claude/cursor/gemini/codex/opencode/roo/zed 七宿主全文读取 + 检索 · 两处证据驱动修正：cursor 候选→定稿 · gemini none→定稿）· live 表消费测试影响面 grep 盘点（9 文件 · S3.2 表）。

### R1 · 范围

①–⑧ 照 SPEC §3 + 本棒新增 ⑨（内置表 v2 化 · SPEC §2 目标 1 的表数据前提）规格化落 S3.1–S3.8；非范围照 SPEC §4 + 运行时/远程分发/新增内置宿主/接入即 L3/schema 不再变 + 本棒裁决登记（codex/opencode/AGENTS 系继承/shell-hook pre-archive 不做）+ 发布四动作仅人 + 不追溯存量。

### R2 · 方案

SPEC §6 裁定全继承（机制族抽象 · 显式降级 · 增量合并+内置不可覆盖）。**本棒定稿新增**：机制族映射 13 格（S3.1 证据表）· `--file` = 当次整表替换（现状逐字保留 · 向后兼容红线最优解 · 合并仅在无 --file 时发生 → 规则一句话可陈述）· 合并铁律 = 表级隔离 + exit 2 零写入（U-01 先例对齐 · 行级剔除会静默丢宿主故弃选）· catalog 可选 + sha256 呈现即强制 · verify 比对三分形态（逐字/产品块/包含性 —— 用户定制不计篡改 · 防 verify 误伤真实合规仓）· defaults 消重复**做**（仅限 verify 面 · dogfood 真值表 + 恒等锁兜底 · AGENTS 系继承不做）· e2e 首选对 claude+gemini（无头可自动化优先 · cursor 加分项）。

### R3 · 边界

S2 只新增（本 task 文件 · 不改 SPEC/PLAN/reviews 既有档）· 不签任何闸（双 pending 待 00 翻转 · HG-SCHEMA-CHANGE 不设新行理由落闸表下注 · 留 20 复核）· schema 零改动（动即 F-W2-05 STOP）· pin-17 四禁 · 硬约束 9 文案口径（none 宿主不得暗示 L3 · verify 转正后文案联动登记 W7）· 硬约束 12（acme-bot 双路证明）· 硬约束 14（e2e 证据入 tracked · 外部文档 URL 仅作检索出处 · 取证结论落仓内文）· 禁 `git add -A` · 发布四动作仅人。

### R4 · 可测性

验收 14 条全机械可断言（命令 + fixture 路径 + 期望输出均落验收节）：verify 双向四类红 · 合并铁律三面负 fixture · acme-bot 双路 e2e · 降级快照 + L3 负向断言 · 恒等锁 · catalog 正负面 · shell-hook temp git 仓 e2e（git 不可用 skip）· pins 17/17 · 登记项列明义务。红测先行面 = 合并铁律负 fixture + verify 负 fixture + catalog 完整性负 fixture + hooks 物化 conflict 负 fixture（先红后绿）。真实宿主 e2e 为脚本化留证（不入 npm test 默认面 · 件数硬条不放行）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待审查文落盘 + 00 代签 · 维护者 2026-09-16 授权模式）；HG-TASK-DRAFT 已 approved（2026-09-16 00 代签 · 授权真值：维护者本窗「授权00代签」）；闸行裁决（不设 HG-SCHEMA-CHANGE）留 20 复核；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | SPEC signed + 行号全量复核现值 + 基线复跑（667/130/666/0/1 · typecheck 0 · pins 17/17）+ 机制族七宿主官方文档核查（两处修正）+ live 表消费面盘点 | no |
| R1 | 范围 ①–⑨ + S3.1–S3.8 规格化 · 非范围含 SPEC §4 五项 + 本棒裁决登记四条 | no |
| R2 | SPEC §6 全继承 + --file 整表替换定稿 + 合并铁律表级隔离 + verify 比对三分形态 + 消重复做（限 verify）+ e2e 首选对定稿 | no |
| R3 | S2 只新增 · 不签闸 · schema 零改动 · pin-17 四禁 · 硬约束 9/12/14 · 禁裹挟 · 发布仅人 | no |
| R4 | 验收 14 条全机械 · 红测先行面明示 · e2e 留证形态与件数硬条 · 环境红纪律 | no |
| R5 | 待 20 审 R1 裁定充分性 · 双闸待 00 翻转 · 闸行裁决留 20 复核 | no |

**residual_risks**：① **真实宿主 e2e 环境依赖**（claude/gemini CLI 版本漂移 · hooks 功能成熟度 · cursor-agent 无头不确定）——缓解：首选对均为无头可自动化宿主 · F-W2-06 校准通道 · F-W2-07 环境红纪律 · 但件数硬条不放行 ⇒ 本波交付期受宿主环境可得性约束（SPEC residual_risks ① 同源）；② cursor hooks 较新（1.7 beta 起源）+ 非 2 退出码 fail-open 默认 —— 缓解：物化模板精确 exit 2 + 文档化 + F-W2-06 校准；**gemini 升级为定稿若执行期实测不符 → 族内校准落 none + 校准留痕**（内件表 hooks 声明随校准翻转 · 属数据修正非 schema 变更）；③ 内置表 v2 化触碰 pin-17 直读面 —— 缓解：四禁守住 + 恒等锁 + pins 17/17 验收硬条 · 行级 verify 断言测试登记纪律（F-W2-13）；④ 用户目录加载平台差异（~ 解析 · Windows）—— 缓解：纯函数注入 home + 跨平台语义一致断言（2.4 W6 先例 · SPEC residual_risks ②）；⑤ 合并铁律 exit 2 零写入对「有一张坏表的用户」是全命令阻断 —— 裁决已采 fail-closed（U-01 同档）· 若 20 审或维护者偏好「跳过续行」需在 R1 审查提出（当前定稿 = 阻断 + 点名 · 可诊断性优先）；⑥ hooks 物化 JSON 深合并与用户既有配置交互面复杂（三宿主配置格式各异）—— 缓解：包含性比对口径 + conflict skip 先例 + F-W2-10/F-W2-11 负 fixture；⑦ 机制族修正（cursor/gemini 升级）扩大 SPEC 草案预期面 —— 缓解：证据逐格落 S3.1 表 + 留 20-task-audit 复核 · 反方向风险（取证推翻）由 F-W2-06 兜住。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 验收主体 = **机械锁全绿**（host verify 双向 fixture + 合并铁律负向 fixture + 第三方双路 e2e + 降级快照断言 + 恒等锁 + catalog 正负面 · 命令与判据见验收节），辅以：① **红测先行**（合并铁律/verify/catalog 完整性/hooks conflict 负 fixture 先红后绿）；② 每 commit 前后 `npm test` 同绿（基线 667/130/666/0/1 · 环境红按 F-W0-07 同式对照实验先行定性）；③ 真实宿主 e2e = 脚本化演示 + tracked 留证（**不入 npm test 默认面** · E3 耗时预算 · 基线 duration ≈81s）；④ 11 件 host 测试 + w1 系 + gate 系既有断言（除 F-W2-13 登记项）零改动全绿；⑤ git 依赖测试显式 skip 纪律（硬约束 10）。**本波是行为兑现波（hooks 物化 + verify 消费 + B5 合并）· 红绿纪律 = 新行为全部 fixture 先行 · 旧行为全部回归锁兜住（compat fixture + 恒等锁 + pins）。**

---

## 提交信息约定

- `feat(3.0-W2): 内置表 v2 化（schema_version: 2 + command_sets + 13 行 hooks 声明 + defaults 消 verify 重复 · pin-17 四禁守住 + 恒等锁）`
- `feat(3.0-W2): hooks 物化器（config-hook 三宿主落点模板 + shell-hook git 注入 + JSON 深合并/conflict skip）`
- `feat(3.0-W2): host verify 子命令（比对三分形态 + fail-closed + 粘性缺省 + exit 0/2）`
- `feat(3.0-W2): hook-guard 门禁分发 + 降级留痕（degraded-none 快照断言）`
- `feat(3.0-W2): B5 用户级目录加载 + 多表合并（合并铁律三面 + exit 2 零写入）`
- `feat(3.0-W2): B5 catalog（格式 + host catalog list + sha256 完整性强制）`
- `test(3.0-W2): 第三方 acme-bot 双路 e2e + shell-hook temp git 仓 e2e + 负向 fixture 组`
- `docs(3.0-W2): e2e 验收文 + host-adapt README hooks 落点矩阵更新（不动 pin-11/12 钉点行）`
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界（F-W2-14）
- **禁 tag / push / publish / deprecate（仅人 · 无代跑授权）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w2_gates_in_hosts.md`

---

### 自检结论（执行者）

> 30 执行棒回填（GATE_VERIFY 首输出闸扫描表 + 验收 14 条逐项实测 + 锁计数汇总 + 快照比对 diff 结论 + 已知未测项 + 过程留痕）。本棒（10-task）不填。

### KPI（00）

> 00 收官裁定回填（30 自评备料 + rubric `KPI_RUBRIC_v1_2`）。本棒（10-task）不填。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 初稿 · 10-task（W1 done 后拆单）：行号全量回源码复核现值（W0/W1 后新布局 · SPEC 快照行号废弃）· 基线复跑（npm test 667/130/666/0/1 · typecheck 0 错 · pins 17/17 · HEAD f9f9c02）· **机制族取证定稿**（S3.1 · 13 格证据表 · 两处证据驱动修正：cursor 候选→定稿 [cursor.com/docs/hooks · beforeShellExecution exit 2=deny] · gemini none→定稿 [.gemini/settings.json BeforeTool deny · 官方 block-secrets-in-commits 示例 · 无头可自动化 ⇒ e2e 第二宿主] · codex 信任门登记候选 3.x）· **内置表 v2 化方案**（S3.2 · 消重复裁决=做仅限 verify 面 · 影响面 8 行盘点表）· **B5 定稿**（S3.6 · --file=当次整表替换 · 合并铁律表级隔离 exit 2 零写入 · catalog 可选+sha256 呈现即强制）· **host verify 语义定稿**（S3.4 · 比对三分形态 · 用户定制不计篡改）· **e2e 方案**（S3.7 · claude+gemini 首选对 · acme-bot 双路 · shell-hook temp git 仓）· **闸行裁决**（不设 HG-SCHEMA-CHANGE 四理由 · 留 20 复核）· 新增 F-W2-07–15（环境红/平台差异/完整性/配置冲突/git hook 冲突/恒等锁/登记纪律/裹挟/越权） |
