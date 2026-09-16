# 审查文：task_3_0_w2_gates_in_hosts · R1（20-task-audit）

> **hat_id**：20-task-audit · **轮次**：R1 · **日期**：2026-09-16  
> **审查对象**：`docs/tasks/active/task_3_0_w2_gates_in_hosts.md`（3.0 W2 门禁入住宿主 + B5 接入面 · **战略目标兑现波** · HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1=pending）  
> **对照真值**：SPEC `docs/spec/3_0-architecture-leap/03_w2_gates_in_hosts_v1.md`（signed · 范围 ①–⑧ · 设计 §5 · 验收 1–7 · F-W2-01–06）· PLAN `PLAN_3_0_architecture_leap_v1_zh.md` W2 节（:228-235）+ 硬约束 9/12/14/15（:337,340,342,343）· schema 评审文 `w1_schema_change_review_20260916.md` §2.2/§2.3/§5 · `00_policy_and_boundaries.md` · 格式先例 `task_3_0_w1_schema_leap_audit_R1_20260916.md`  
> **审查性质**：书面审查 + 独立复核实测（含外部官方文档抽样取证）；**未改** task / SPEC / PLAN / src / test / fixtures 实质内容；**不代签** HG-AUDIT-R1（归 00 代签）

---

## 一、结论摘要

| 维度 | 结论 |
|------|------|
| **内容**（可执行性 / 与 SPEC+PLAN 一致性） | **PASS-with-issues**：blocking **0** · advisory **3**（A1 闸裁决理由③类比强度注记 · A2 行级 verify 断言影响面实测为零 · A3 gemini CLI 产品漂移数据点；均不阻塞签闸） |
| **流程闸** HG-AUDIT-R1 | **pending**（真值以 task `### 人工闸` 表为准）；本审查文落盘即满足「20 审查文落盘」前置，签署归 **00 代签**（维护者 2026-09-16 授权模式），**pending 期间 30 拒改码**（本审 `gate-check` 实测：HG-AUDIT-R1 pending → ❌ 拒 30 · exit 2 · 机检咬住 ✓ · `task lint` PASS ✓） |
| 思考轮 R0–R5 | 控制表填全（六轮 early_stop 全 no · residual_risks 七条每条带缓解）· R5 待本轮裁定——**本轮裁定：充分** |

---

## 二、常规核对（对照 SPEC / PLAN / 评审文 / 政策逐项）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 ①–⑧ 与 SPEC §3 | ✅ 逐项对应且规格化 | ①–⑧ 照 SPEC 全继承并转写为 S3.1–S3.8 可实施规格（机制族物化模板 / verify 比对三分形态 / 合并铁律三面 / catalog 格式 / 降级留痕）；SPEC §5.1 授权「具体族划分以 W2 task 复核各宿主文档后定稿」⇒ S3.1 族划分定稿与 13 行 hooks 声明落表均在授权面内 |
| 范围 ⑨（内置表 v2 化 · 本棒新增） | ✅ 可溯源 · 非越权 | SPEC §2 目标 1（hooks 物化到 13 宿主落点）的表数据前提；评审文 §2.3 已点名「13 宿主 verify 声明逐字重复 13 遍 · 正是 B2 要消的重复面」· §5.1 明示「表内容改写 pin-17 前提仍成立」⇒ 新增 ⑨ 属上游设计已预期的动作，登记为「本棒新增」诚实标注 ✓ |
| 非范围与 SPEC §4 | ✅ 全继承 + 合规增益 | SPEC 五条全在（hook 运行时 / 远程分发 / 新增内置宿主 / 接入即 L3 / schema 不再变）+ 本棒裁决登记（codex/opencode/AGENTS 系继承/shell-hook pre-archive）+ 发布四动作仅人 + 不追溯存量——与政策边界 §3/§6 同向，无扩权 |
| 验收标准与 SPEC §7 | ✅ 1–7 全覆盖 + 机械化加强 | #1↔1（≥2 真实宿主 e2e · tracked 验收文）· #2↔2（verify 双向四类红 + fail-closed 红）· #3↔3（合并铁律三面负 fixture）· #4↔4（pins 17/17 + validate + compat 不回退）· #5↔5（acme-bot 双路 e2e）· #6↔6（degraded-none 快照 + L3 负向断言）· #7↔7（typecheck 0 + npm test 全绿 + 耗时预算）；新增 #8–#14（恒等锁 / 比对口径边界 / shell-hook e2e / catalog 正负面 / 既有面零改动 / task lint / 执行粒度）为加强项，命令+fixture+期望输出全落验收节 |
| failure_paths 与 SPEC §8 | ✅ F-W2-01–06 全继承 | F-W2-01–06 逐条对应且行为列更具体（点名/exit 码/登记义务）；新增 F-W2-07–15（环境红 / 平台差异 / 完整性 / 配置冲突 / git hook 冲突 / 恒等锁 / 登记纪律 / 裹挟 / 越权）逐条必要（见重点与下文盘点） |
| 依赖 / 必读列表 | ✅ 充分 | SPEC 全文 + 评审文 §2.2/2.3/5 + PLAN W2+硬约束 + 现码行号（本审抽核 30+ 处全中 · 见下）+ 表/schema/README + 机制族证据出处 + 既有测试面 + W0/W1 先例 + RELEASING/MIGRATION |
| 思考轮控制表 R0–R5 | ✅ 填全 | R0 证据含基线复跑 + 行号全量复核 + 七宿主官方文档核查 + live 表消费面盘点；R1–R3 闭合；R4 验收 14 条全机械 + 红测先行面明示；R5 待本轮（裁定充分）；residual_risks 七条逐条带缓解，⑤ 明示「若 20 审偏好续行须 R1 提出」（本审不提出 · 见重点 4） |
| `### 人工闸` 表可机检性（硬约束 15） | ✅ | 闸表在 `### 人工闸` 节（parseHumanGates 采集面内）；HG-TASK-DRAFT `blocks_hats` 含 20,30 · HG-AUDIT-R1 含 30；本审实测 `npx spec-wave gate-check --task …` → 渲染两行闸 · HG-AUDIT-R1 pending → ❌ 拒 30 · exit 2；`task lint` PASS |
| test_strategy 与硬约束 6（修严配负向 fixture） | ✅ 适配正确 | 本波为行为兑现波（hooks 物化 + verify 消费 + B5 合并 · 修严面 = 合并铁律/verify fail-closed/catalog 完整性/hooks conflict）：负 fixture 面全列 + 红测先行写进测试策略节 + 旧行为由 compat fixture/恒等锁/pins 三重回归锁兜住；e2e 脚本不入 npm test 默认面（E3 耗时预算 · 基线 ≈81s 本审实测 77.4s ✓） |
| 硬约束 9/12/14/15 落位 | ✅ | #9：none 宿主禁 L3 暗示（负向断言「输出不含 L3」）+ verify 转正后文案联动登记 W7；#12：acme-bot 非内置 id 双路（--file + catalog）走通即「不依赖改包发版」证明；#14：e2e 证据落 `docs/harness/reviews/w2_gates_in_hosts_e2e_<date>.md`（tracked）；#15：闸已落 task 表且本审机检实证咬住 |
| 基线节数字独立复跑 | ✅ 全中 | 本审复跑（HEAD `f9f9c02` · 工作区仅 active/ untracked 与 task 声称一致）：`npm test` **667 tests / 130 suites / 666 pass / 0 fail / 1 skip**（duration 77.4s）· `npm run typecheck` **0 错** · `node bin/specgate.js pins check` **17/17 PASS**（含 pin-17 13 宿主双语命中 · pin-14 MIGRATION.md:3=2.4.2）——与基线节逐字一致 |
| 现码行号抽核（30+ 处） | ✅ 全中 | `schema.ts`（HOOK_MECHANISMS/HOOK_TRIGGERS :141-142 · validateHooks :151-226 · validateVerify/Partial :93-132 · 探测树 :483-510 · 分派 :517-522 · checkS2Field :23-31）· `resolve.ts`（HooksDecl :24-31 · ResolvedHostRow :45-54 · V1_DEFAULT_HOOKS :66 · BUILTIN_* :77-95 = core 5/expanded 7/forbidden 2 ✓ · resolveV2Rows :179-255）· `table.ts`（DEFAULT_EXAMPLE_REL :8 · resolvedHostRows :51-61 · resolveValidateFile :73-76 · listKnownHostIds :79-97）· `materialize.ts`（PlannedItem :34-43 无 hook kind ✓ 复证「hooks 零物化」· planApply :197-205 · remapUpdateConflicts :398 · marker-merge :85-98）· `cmd.ts`（cmdHost :504-524 仅 validate/apply/update ✓ 复证「verify 零消费」· U-01 degraded :255-258 · --file 解析 :93/:198/:363 · 粘性缺省 :415-428 · s2 收集 :269-285）· `cli-pins.ts:385-394`（直接 yamlLoad hosts[].host_id 不过 schema ✓）· `w1-schema-version-detect.test.ts:116`（断言原文逐字在案 ✓）· `mvp-hosts.yaml`（219 行 ✓ · `verify:` ×13 ✓ · 无 `schema_version` ✓ · `host_id:` ×13 ✓）· 测试引用锚点（validate:49 · w2-commands-ux:105 · w3-dsh-orch:118 · w4-expanded:119 · w6-three-hosts:13 · w6-2_3-six-hosts:13 · cli-json-no-abs-path:436/501/538 · pins-consistency:1335）· W1 done task S2.2 矩阵 :116-122 ✓ · host-adapt README :1/:61 钉点行 + :81-107 矩阵 ✓ · 2.2/2.3 W6 取证卡文件名实存 ✓ |
| 行为变更类「旧测 grep 影响面」提醒（K7） | ✅ 已覆盖 | S3.2「v1 消费面回归影响盘点」8 行表 + F-W2-13 登记纪律；本审独立 grep 复核（见重点 3）：行级 verify 断言影响面实测为 **零** |
| W1 前置兑现（政策 §6「W2 不得抢跑」） | ✅ | W1 done（三闸 approved · schema v2 已交付）· W0 done；B5 前置（W1 catalog/schema 定稿）已就绪 |

**常规核对结论：无 blocking。**

---

## 三、五条重点逐条结论（含本审独立复核证据）

### 重点 1 · 闸行裁决（W2 不设 HG-SCHEMA-CHANGE 行 · 四理由）——✅ 裁决成立（理由③ 附强度注记 advisory A1）

- **理由①（schema 格式零改动）成立**：本审复核 `host-adapt.schema.json` 与 `src/host/schema.ts` 校验器均不在本波改动面（task 必读 5 明示「本波零改动 · 动即 F-W2-05」）；硬约束 3 的闸对象 = host-adapt **schema（格式）变更**，格式未变即闸不触发，且 F-W2-05 保留「发现洞即 STOP 回退补闸」通道 ✓；
- **理由②（内置表 v1→v2 = 按已批准 v2 写数据）成立**：v2 schema（schema_version/hooks/defaults/command_sets 全部新增节）已经 W1 `HG-SCHEMA-CHANGE=approved`（2026-09-16 00 代签 · 本审 grep 实证 W1 done task :41 闸行在案）批准；评审文 §2.3 更已**点名**「13 宿主 verify 逐字重复 13 遍正是 B2 要消的重复面」· §5.1 明示「表内容改写 pin-17 前提仍成立」⇒ 内置表 v2 化是已批准设计的**数据层兑现**，非新格式变更 ✓；
- **理由③（catalog = 新 artifact 自有格式）成立 · 附注记**：catalog.yaml 不触碰 host-adapt schema（既不改校验器也不改适配表结构）· 自带 `version: "1"` 整数探测同思路 fail-closed——闸对象（host-adapt schema 格式）论自足。类比先例 `.coding-kit/host-tools.json` 自有 `version: 1`（本审实证 `src/host/sticky.ts:44-46` version 非 1 即拒 · fail-closed 同构）确未触发 schema 闸；**但**该先例部分平凡——HG-SCHEMA-CHANGE 为 3.0 新增闸、host-tools.json（2.1.1）先于闸存在，「从未触发」非强先例。**裁决结论不变**（operative 论据 = 闸对象限定 + 新 artifact 自有格式），类比强度降级注记为 advisory A1，不阻塞；
- **理由④（schema 洞走 F-W2-05 回退通道）成立**：与 SPEC §4 末行「发现 schema 洞 → 回退 W1 补 · 本波不得夹带 breaking」逐字对齐 · 与硬约束 3 顺序（评审文 → 闸 → 改码）兼容 ✓；
- **本审不判定 catalog 应补闸行**：catalog 是可选的发现性索引（缺失照载 · 呈现即强制仅约束完整性声明真实性），不改适配表解析语义 ⇒ 无需补闸行+顺序重排。

### 重点 2 · 机制族两处修正（cursor 候选→定稿 · gemini none→定稿）与 codex 保守裁决——✅ 证据抽样核实成立 · codex 裁决认可

本审对 S3.1 证据表做**外部官方文档抽样取证**（claude/cursor/gemini/codex 四件 · 2026-09-16 读取）：

| 宿主 | task 口径 | 本审抽样实证 | 结论 |
|------|-----------|--------------|------|
| cursor（升级定稿） | `.cursor/hooks.json` 项目级 · `beforeShellExecution` 权限类 · **exit 2 = deny** · 非 2 退出码默认 fail-open · cloud agents 跑仓内 hooks | 官方 hooks 文档逐字命中：「Exit code `2` - Block the action (equivalent to returning `permission: "deny"`)」「Other exit codes - Hook failed, action proceeds (fail-open by default)」「cloud agents run command-based hooks from your repository · `.cursor/hooks.json` at the root」· matcher 串收窄（`"matcher": "curl\|wget\|nc"` 同构示例） | ✅ 升级证据真实 · fail-open 口径与 task 警示一致 |
| gemini（升级定稿） | `.gemini/settings.json` hooks 对象 · `BeforeTool` 正则 matcher · exit 2 / decision deny 阻断 | 官方 hooks reference 逐字命中：hooks defined in `settings.json` within the `hooks` object · `matcher` = "A regex (for tools)" · 「`2`: System Block. The action is blocked; `stderr` is used as the rejection reason」· stdin JSON 输入（hook-guard 分发设计前提 ✓） | ✅ 升级证据真实 |
| claude（首选维持） | `.claude/settings.json` 项目级可入库 · `PreToolUse` matcher `Bash` · exit 2 阻断 | 官方 hooks reference 命中：PreToolUse 事件在 agentic loop 每次工具调用触发 · command hook stdin JSON · 项目级 settings 文档面存在 | ✅ |
| codex（保守落 none） | `.codex/hooks.json` · `PreToolUse` · block 语义存在 · **但**「Non-managed hooks must be reviewed and trusted before they run」信任门 ⇒ 无人值守摩擦 | 官方文档**逐字命中**信任门原文；`<repo>/.codex/hooks.json` 与 `PreToolUse` 同页在案 | ✅ 机制存在与信任门均属实 ⇒ 保守裁决有据 |

- **反方观点（本波扩 codex）复核**：codex 机制面（config-hook 资格）确实存在，但「首次运行须交互信任」直接破坏 W2 e2e 的无头脚本化（F-W2-07 硬条依赖 `claude -p`/`gemini -p` 无人值守）与「装一次全局可用」体验；且 task 已留 3.x 复议入口 + F-W2-06 取证点登记。**本审认可保守裁决**——扩 codex 的收益（第三件 e2e 证据）可由 cursor 加分项替代，代价（交互信任门破坏自动化）不可逆。
- **两处修正扩大 SPEC 草案预期面**属 SPEC §5.1 明示授权（「具体族划分以 W2 task 复核各宿主文档后定稿」）· 证据逐格落 S3.1 表 + 反方向风险由 F-W2-06 兜住（residual_risks ② 含「gemini 实测不符 → 族内校准落 none · 属数据修正非 schema 变更」——与重点 1 闸裁决自洽 ✓）。

### 重点 3 · 消重复「做」的裁决（defaults 挪 verify · pin-17 四禁）——✅ 论证充分 · 影响面实测比 task 估计更小（advisory A2）

- **四禁论证充分**：本审实证 `src/cli-pins.ts:385-394` 直接 `yamlLoad` 原始表逐行取 `hosts[].host_id`、**不过 schema 校验、不做 defaults/extends 解析**（与评审文 §5.1 前提论证逐字一致）；S3.2 改写保持 `hosts` 数组形态 + `host_id` 行级 + 13 id + 表路径四要素不动 ⇒ pin-17 提取面零影响；pins 17/17 又列为验收 #4 硬条，漂移即红 ✓；
- **行级 verify 断言测试影响面——本审 grep 全量盘点结论：实测为零**。全 `test/` 引用 live 表 `mvp-hosts.yaml` 共 14 处（9 文件），逐处核读：**无一断言行级 `verify:` 键**；`w*.test.ts` 中 `verify:` 字面命中全部在 `w1-extends-resolve.test.ts` 的合成 fixture（内联对象 · 非 live 表）；task 点名hedge 的 `w2-commands-ux.test.ts:19` 实为 `CORE_VERBS` 动词名 `'verify'`（命令动词 · 与 surfaces.verify 无关）。⇒ task「凡断言行级 verify 键者须登记更新」的担忧**高估而非低估**了影响面；真实影响面 = ① `w1-schema-version-detect.test.ts:116` 有意翻转（已登记）② planned writes 快照 hooks 落点新增（已登记）③ validate live 表 v1→v2 路径切换（预期零改动 · 已登记）。F-W2-13 登记纪律保留得当（30 执行期实读复核义务不因本审实测免除），登记口径可按本审结论收窄（advisory A2 · 30 自检引用即可 · 无需改 task）；
- **「做」的利弊评估成立**：利（B2 设计面 dogfood + 恒等锁兜底 + resolved 恒等可机检证明）> 弊（pin-17 四禁已证不受影响 + 影响面实测为零）；AGENTS 系 always_on/skills 继承**不做**的裁决（各行 target_dir 不同 · extends 链复杂化真值表得不偿失）分寸得当 ✓。

### 重点 4 · 合并铁律 fail-closed 档位（exit 2 零写入 · 阻断式）——✅ 认可阻断式 · 不提出续行

- **U-01 同档先例实证**：`cmd.ts:255-258` degraded → `emitU01Degraded` exit 2 零写入在案 ✓；与政策 §2.1「exit 2 = failClosed 阻断档」纪律同向；
- **表级隔离 × 阻断式组合自洽性**：二者作用于**不同层**——隔离 = 数据层（坏表内容不入合并 · 内置与其他表 resolved 零污染 · 负 fixture 断言）；阻断 = 命令层（任一表冲突/损坏 → 全命令 exit 2 零写入 · 点名可诊断）。组合语义 = 「**数据不污染 + 结果不半成**」，逻辑闭合无矛盾；
- **对反方（跳过续行 exit 0）的复核**：续行会让「有一张坏表的用户」带着部分合并结果静默物化——坏表宿主悄悄缺席，违 P0「不得静默降级」纪律与 F-W2-02/03「点名」初衷；阻断+点名的可诊断性严格更优，且可重试（修表后即成）。residual_risks ⑤ 已明示「若 20 审偏好续行须 R1 提出」——**本审不提出**，阻断式定稿成立；
- `--file` 路径与合并面正交（当次整表替换 · 现状逐字保留 `table.ts:73-76` ✓）· 坏表阻断不影响 `--file` 用户 · 向后兼容红线守住 ✓。

### 重点 5 · e2e 件数硬条（≥2 真实宿主不放行）的环境风险——✅ 硬条必要 · 留证形态满足硬约束 14 · 附两个环境数据点（advisory A3）

- **硬条必要性**：本波是**战略目标兑现波**（产品卖点 = 门禁宿主内真生效）；若允许 fixture 冒充或件数豁免，战略 claim 即无证据 ⇒ 「件数不足验收 #1 不放行 + 不得用 fixture 冒充真实宿主证据（F-W2-07）」对本波定位是**必要而非过严**；
- **首选对无头可脚本化**：claude `-p` headless + gemini `-p` headless 均为官方非交互模式；hook 触发链（PreToolUse(Bash) / BeforeTool(run_shell_command)）已由重点 2 官方文档抽样证实 · hook-guard 分发（stdin 事件 JSON → 命令串匹配）与两宿主的 stdin 协议兼容 ✓；
- **留证形态满足硬约束 14**：脚本化演示（`scripts/e2e-w2-host-gates.mts` · 不入 npm test 默认面）+ 输出日志 + 验收文落 `docs/harness/reviews/w2_gates_in_hosts_e2e_<date>.md`（tracked）· 每件含环境版本串 → 真实触发 → 脏拒 → 合规放行四要素 —— 证据入库纪律闭合 ✓；
- **环境风险登记**（本审实测两个数据点 · advisory A3）：① 本审环境 `claude` v2.1.181 与 `cursor-agent` 在 · `gemini` CLI **缺席**（task 已注 npm 可装 · 30 执行期若同环境须先装）；② 本审读取 `geminicli.com/docs/hooks` 时官方页面横幅载「Gemini CLI 已由 Antigravity CLI 取代（2026-06-18 · 免费层/Google One 用户）」——CLI 产品漂移的具象数据点，建议在 e2e 验收文环境版本串中如实记录 · F-W2-06/07 通道已兜住（环境不可用 → 环境红对照实验定性 · 件数不足不放行）；
- **hooks 机制成熟度与 CLI 版本漂移**：F-W2-06（族内校准 · 不开特判分支）+ F-W2-07（环境红纪律）双通道 + cursor 第三件仅加分非硬条 —— 风险敞口已被诚实登记且兜底通道可机检执行 ✓。

---

## 四、发现清单

### Blocking（0 条）

无。

### Advisory（3 条 · 均不阻塞签闸 · 30 执行时落实或自检登记 · 无需改 task）

| # | 级别 | 内容 | 建议落点 |
|---|------|------|----------|
| A1 | 标注级 | 闸行裁决理由③的 `host-tools.json` 类比**部分平凡**（HG-SCHEMA-CHANGE 为 3.0 新增闸 · host-tools.json 2.1.1 先于闸存在 ·「从未触发」非强先例）；裁决的 operative 论据 = 硬约束 3 闸对象限定为 host-adapt schema 格式变更 + catalog 属新 artifact 自有格式（自带 version 整数探测 fail-closed · `sticky.ts:44-46` 同构实证）——该论据自足，**裁决结论不变** | 30/00 引用该裁决时以闸对象论为主论据；类比仅作旁证（本审已按此口径复核通过） |
| A2 | 口径级 | 行级 verify 断言影响面**实测为零**（本审全量 grep：14 处 live 表引用无一行级 `verify:` 断言 · `w2-commands-ux.test.ts:19` 是 CORE_VERBS 动词名非 verify 面断言）；F-W2-13 登记义务保留，但 30 自检可按「预期影响面 = :116 翻转 + planned 快照新增 + validate 路径切换」收窄登记 | 30 自检结论引用本审 A2 口径 · 逐条登记纪律不变 |
| A3 | 环境级 | ① 本审环境 `gemini` CLI 缺席（`claude` 2.1.181 / `cursor-agent` 在）⇒ 30 执行期若同环境须先 `npm i -g` 安装第二硬条宿主；② `geminicli.com` 官方横幅载「Gemini CLI 已由 Antigravity CLI 取代（2026-06-18 · 免费层/Google One）」——e2e 验收文环境版本串须如实记录 CLI 版本/产品名漂移 · F-W2-06/07 通道兜底 | 30 执行期 e2e 取证时落实 · 验收文登记 |

---

## 五、总结论

**PASS-with-issues**（blocking 0 · advisory 3）—— task 内容与 SPEC/PLAN/评审文/政策边界逐项一致，五条重点全部成立（闸行裁决四理由成立 · 机制族两处修正经外部官方文档抽样取证真实且 codex 保守裁决有据 · 消重复「做」的四禁论证充分且影响面实测比 task 估计更小 · 合并铁律阻断式认可且与表级隔离组合自洽 · e2e 件数硬条必要且留证形态满足硬约束 14），关键数字（667/130/666/0/1 · typecheck 0 · pins 17/17 · HEAD f9f9c02）与 30+ 处行号快照经本审**独立复跑/抽核/grep/外部取证复现**。**思考轮审查通过，充分性裁定：充分。**

本审**不代签** HG-AUDIT-R1；签署归 00（维护者 2026-09-16 授权模式）。**因 HG-AUDIT-R1 仍为 pending，按纪律不附 30 Prompt**，仅出维护者签闸清单：

## 维护者签闸（20 后 · 30 前）

- [ ] 已读 R1 审查结论（本文）
- [ ] 在 task 人工闸表将 HG-AUDIT-R1 改为 approved（00 代签 · 维护者 2026-09-16 授权 · 日期）
- [ ] commit task 文档或确认已签（连同本棒交付：本审查文 + `docs/harness/invokes/by-task/3-0-w2-gates-in-hosts/invoke_20260916_20_3-0-w2-gates-in-hosts.md` · 逐文件显式 add · 禁 `git add -A`）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | R1 · 20-task-audit：常规核对 12 项全过；五条重点逐条独立复核（闸行裁决四理由 · 机制族外部文档抽样取证 claude/cursor/gemini/codex 四件 · 消重复四禁码证 + verify 行级断言全量 grep 实测为零 · 合并铁律 U-01 先例与隔离×阻断分层自洽 · e2e 硬条必要性 + 两个环境数据点）；独立复跑 npm test 667/130/666/0/1（77.4s）+ typecheck 0 + pins 17/17 + HEAD f9f9c02 全中；30+ 处行号抽核全中；gate-check 机检咬住 HG-AUDIT-R1 pending（exit 2）· task lint PASS；总结论 PASS-with-issues（blocking 0 · advisory 3：A1 闸裁决类比强度注记 · A2 verify 断言影响面实测为零 · A3 gemini CLI 缺席 + Antigravity 漂移数据点）；不代签 HG-AUDIT-R1 |
