# Task：3.0 W1 · 适配表 schema 跃迁 + 闸判定泛化（schema leap · **本次核心 · breaking**）

> **状态**：`draft`（10-task 初稿 · HG-SCHEMA-CHANGE=**approved**（2026-09-16 00 代签 · 授权真值：维护者本窗「授权00代签」· W1 schema 签属请示答复）· HG-TASK-DRAFT=**approved**（2026-09-16 00 代签 · 同授权）· HG-AUDIT-R1=**approved**（2026-09-16 00 代签 · 同授权 · 依据 R1 审查文 PASS-with-issues）· **三闸全 approved**）  
> **SPEC 真值**：[`docs/spec/3_0-architecture-leap/02_w1_schema_leap_v1.md`](../../spec/3_0-architecture-leap/02_w1_schema_leap_v1.md)（signed · HG-SPEC-SIGNOFF=approved · 范围 ①–⑦ · 验收 1–9 · F-W1-01–07）  
> **schema v2 设计真值**：[`docs/harness/reviews/w1_schema_change_review_20260916.md`](../../harness/reviews/w1_schema_change_review_20260916.md)（**已经 00 批准** · HG-SCHEMA-CHANGE 代签成立（2026-09-16 · 授权真值：维护者本窗「授权00代签」· W1 schema 签属请示答复）· 本闸行已同步翻转 approved）  
> **上游 PLAN**：[`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W1 节 + 硬约束 **3**（先评审文→闸→改码）/ **4**（向后兼容红线）/ **12**（接入面不依赖改包发版）/ **15**（闸不落表即虚设）  
> **前置已兑现**：W0 done（[`task_3_0_w0_refactor_prep.md`](../done/task_3_0_w0_refactor_prep.md) · 新布局 `src/host/*` / `src/cli/*` / `src/checks/*`）· M1 验收文（[`w0_refactor_prep_acceptance_M1_20260916.md`](../../harness/reviews/w0_refactor_prep_acceptance_M1_20260916.md) · 早于 W1 动 schema 硬前置）  
> **基线（2026-09-16 本棒复跑实测 · 详见「开工基线」节）**：HEAD `98d2062` · npm test **607 tests / 116 suites / 606 pass / 0 fail / 1 skip**（原 4 环境红已消）· typecheck 0 错 · pins check **17/17**（含 pin-17 13 宿主双语命中）  
> **行号口径**：本 task 全部行号为 2026-09-16 本棒实读现值（W0 后新布局 · SPEC 头部快照行号已按 SPEC 自身条款回源码复核更新）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `3-0-w1-schema-leap` |
| **test_strategy** | `required` |
| **test_strategy_note** | 验收主体 = 三重保险机械锁：compat 回归锁 fixture（2.4.2 表逐字拷贝零改动通过 + planned writes 逐字一致）+ extends/defaults 正负 fixture（OQ-2 九条目）+ hooks 红绿 + command_sets 缺失/禁词红 + 闸泛化双锁（新 fixture 断言 HG-SCHEMA-CHANGE pending 拒 30 + 存量快照 232 行逐条不变）+ gate-check 泛化渲染快照断言 + 11 件既有 host 测试零改动全绿 + pins 17/17；schema/闸新行为一律**红测先行**（负 fixture 先红后绿） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | 适配表 schema + 闸判定机制变更；不改图谱资产（`docs/_tech_graph/` 零触碰） |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 无规范增量；breaking 迁移指引落 `MIGRATION.md` 草案节（范围 ⑦ · W7 定稿），wiki 晋升与否归 20/00 裁定 |
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
| HG-SCHEMA-CHANGE | **approved** | 30 | **2026-09-16 00 代签** · 授权真值：维护者本窗「授权00代签」（W1 schema 签属请示答复）· 依据：schema 评审文 [`docs/harness/reviews/w1_schema_change_review_20260916.md`](../../harness/reviews/w1_schema_change_review_20260916.md) 落盘并经 00 批准（OQ-1/OQ-2 按文裁定执行 · OQ-5 已由本 task 快照闭环）。泛化交付后由 evaluateMayStart30 机检咬住（F-W1-04）· 交付前靠人工纪律 + GATE_VERIFY 扫描兜底（硬约束 3/15 · OQ-7） |
| HG-TASK-DRAFT | **approved** | 20, 30 | **2026-09-16 00 代签** · 同授权 · task lint PASS |
| HG-AUDIT-R1 | **approved** | 30 | **2026-09-16 00 代签** · 授权真值：维护者本窗「授权00代签」· 依据审查文 [`docs/harness/reviews/task_3_0_w1_schema_leap_audit_R1_20260916.md`](../../harness/reviews/task_3_0_w1_schema_leap_audit_R1_20260916.md)（R1 · PASS-with-issues · blocking 0 · advisory A1–A3 · A1 已修扫描器 · A2/A3 带入 30 执行要求） |

---

## 背景与目标

**A3（2026-09-16 本棒复核 · 与评审文 §1.2/§1.3 一致）**：schema **有** `verify`（`host-adapt.schema.json:52,86-95`）且 13 宿主全声明逐字重复 13 遍（`mvp-hosts.yaml:24-27, 44-47, 64-67, 78-81, 93-96, 107-110, 121-124, 150-153, 164-167, 176-179, 190-193, 204-207, 216-219`），`validateVerify`（`src/host/schema.ts:92-109`）只做校验——**全仓零消费**（`src/host/cmd.ts:503-512` 仅 validate/apply/update 三子命令 · 无 `host verify`）；`hooks` **不存在**（`grep hooks src` = 0 · surfaces 白名单 `schema.ts:143-144` 仅 always_on/skills/commands/verify · 任何带 hooks 键的表今天即被 additionalProperties:false 口径拒红）。产品最大卖点悬空。

**B2/B3**：13 宿主适配表扁平全量重复（无分层继承）；commands 动词名硬编码于 `src/host/commands.ts:6-28`（`CORE_COMMAND_VERBS` 5 项 · `EXPANDED_COMMAND_STEMS` 7 项 · `kit-30`/`kit-publish` 禁令仅为注释纪律 :17-19 · 无机检）。

**闸判定（存量既存缺口 · 本棒统一口径重扫 · OQ-5 闭环）**：`evaluateMayStart30`（`src/cli-shared.ts:292-306`）与 `formatGateCheck`（`src/cli/gates.ts:54-98`）**只认 3 个白名单闸 ID**（HG-AUDIT-R1 / HG-TASK-DRAFT / HG-GRAPH-MODULES）。统一机检口径（= parseHumanGates 采集面）实测存量 **75 文件 / 232 条 HG 行 / 12 种闸 ID**，其中 **`blocks_hats` 含 30 的行 139 条**，白名单外闸（HG-SPEC-SIGNOFF 等 9 种）语义上应拒 30 却**从不被检查** ⇒ 3.0 新设 `HG-SCHEMA-CHANGE` 若不改机制即「写了闸也咬不住」（自指依赖：该闸是 W1 自己的准入闸 · OQ-7）。**兼容性实测**：232 行中 `blocks含30 ∧ status≠approved` = **0 行** ⇒ 泛化对存量行级**零误伤**（快照固化见「开工基线」节）。

目标（SPEC §2 继承）：① schema_version 化 + hooks/verify 声明节 + 向后兼容读旧扁平格式；② B2 分层（defaults + extends）；③ B3 动词名入表去硬编码；④ 闸判定泛化（声明式全闸 + 缺行即拒保留）；⑤ 向后兼容红线（硬约束 4 · 旧表零改动仍可读）。

---

## 开工基线（2026-09-16 本棒复跑实测 · 验收比对的唯一基准）

> 30 开工时若复跑结果与本表不符，按 F-W0-05 同式纪律处置（以复跑实测重建基线并登记 · 不得沿用旧数字强行比对）。

| 项 | 实测值 | 备注 |
|----|--------|------|
| git HEAD | `98d2062` | 工作区 untracked：评审文（上游产物 · 不得裹挟）+ 本棒交付 `scripts/scan-human-gates-baseline.mts` 与 `test/fixtures/`（见下） |
| `npm test` | **607 tests / 116 suites / 606 pass / 0 fail / 1 skip** | **原 4 环境红（F-W0-07 · npm cache EPERM）已消** · 本棒裸跑全绿 · duration ≈72s |
| `npm run typecheck` | **0 错** | strict + noUncheckedIndexedAccess |
| `node bin/specgate.js pins check` | **17/17 PASS** | 含 pin-17 = 13 宿主双语命中（`cli-pins.ts:382-395` 直接 yamlLoad 原始表 · 不过 schema 校验 · W1 设计约束见范围②/非范围表） |
| 闸基线快照（OQ-5） | **75 文件 / 232 行 / 12 种闸 ID** · `blocks含30` 行 **139** · 翻转候选 **0** · 文件级 may_start_30=false **11** | 快照 = `test/fixtures/human-gates/baseline_20260916.json`（本棒已落盘 · 验收 #5 比对基线）· 生成器 = `scripts/scan-human-gates-baseline.mts` · 再生成命令：`node --experimental-strip-types scripts/scan-human-gates-baseline.mts --out=test/fixtures/human-gates/rescan_<date>.json`（**--out 必填 · 目标已存在拒写 · 永不裸跑** · R1 advisory A1 已落实） |

### OQ-5 快照口径与差值归因（SPEC residual_risks ② 闭环 · 20-task-audit 核对点）

**统一口径**（唯一自洽于判定逻辑的口径）：行 = `### 人工闸` 节内 GATE_ROW_RE（`cli-shared.ts:25-26` · 四单元格）命中 + id 以 `HG-` 开头 + 滤 `human_gate` 表头行（= `parseHumanGates` 实际采集行集）；行级判定 = 现行白名单 3 闸逻辑下该行是否致 may_start_30=false；缺行即拒为**文件级**行为（不入行级计数）。

| 口径 | 文件 | 行 | 闸 ID 种 | 差值归因 |
|------|------|-----|---------|----------|
| SPEC §1/§5.3 快照（2026-09-15 校核 #25） | 73 | 229 | 13 | **时点差**（其后 W0 task 落盘 · done/ 74 task + README = 75 文件）+ 口径未机械固定 ⇒ 不逐行对账，以本快照为唯一基线 |
| 评审文 §1.5 快测（2026-09-16 · 文本级 粗口径 `行首竖线+HG-` 全文件面） | — | 284 | 17 | 粗口径混入：① 节外 `竖线 HG-…` 起首行（failure_paths 表如 F-W0-00 行 · 文本级去重实测出现 25 种「ID」其中 13 种为 F-* 行/状态粘连变体）② 节内 parse 拒收行（不足四单元格/表头变体）；17 种含 `HG-GRAPH-MODULES pending`、`HG-AUDIT-R1 · 调度 30→40→CLOSE` 等 status/说明粘连伪 ID |
| **本快照（统一机检口径 · parseHumanGates 同口径）** | **75**（active 0 + done 75） | **232** | **12** | 判定逻辑真实看到的行集 · 与机检逐字一致（扫描器直接 import src/cli-shared.ts 三函数） |

- 文件级 may_start_30=false 的 **11** 个文件 = 零采集行文件（`docs/tasks/done/README.md` + 10 份无闸节 planning/signoff 古早 task）→ 全部经「缺 HG-AUDIT-R1 行即拒」（fail-closed by absence · F-W1-05）· **泛化后此文件级行为逐字保留**；64 个有采集行文件行级 blocks=0。
- **比对面纪律**（F-W1-09）：验收 #5 比对以快照 manifest 文件集 + 行键（file, gate_id, 出现序）为准；30 时点新增文件（**含本 task 自身**及其闸行翻转）**不入比对面**；快照内既有文件的行内容若变动须 STOP 登记。

---

## schema v2 实现规格（评审文 §2 设计真值转写 + OQ-1/OQ-2 本棒闭环 · 30 按此实施）

### S2.1 `schema_version` 整数探测（评审文 §2.1 裁定：整数 · 不复用 `version: "1"` 字符串字段）

```
parse(yaml) → root
  ├─ root 含 'schema_version' 键？
  │    ├─ 是 · 整数 2   → v2 解析路径（全新校验 + defaults/extends 解析）
  │    ├─ 是 · 整数 > 2 → fail-closed「未知 schema_version」（F-W1-03 · 不得静默按旧格式解析）
  │    └─ 是 · 非整数   → schema 校验报红
  └─ 否                 → v1 解析路径：既有 validateHostAdaptDoc 语义原样（白名单/必填/S2 扫描不动）→ 语义等价映射入新内部模型
```

- **歧义边界已钉死**：v1 根白名单仅 allow `version`/`hosts`（`schema.ts:118-121`）⇒ 任何合法 v1 表不可能已含 `schema_version` 键（含则今天即报红）· 探测无灰色地带。
- `version` 字符串字段**保留不动**（`tableVersionOf` 等报告面既有消费不回归 · 非范围）。

### S2.2 `hooks` 节（host 级 `surfaces.hooks` · 只声明与物化 · 运行时归宿主）+ **OQ-1 定稿**

**schema enum 具体形态（定稿 · 进 JSON schema enum + 手写校验器双轨）**：

```yaml
surfaces:
  hooks:                        # 可选节 · v1 旧表无此节 → 内部模型映射 {mechanism: none}（未声明缺省 · 与现状零行为差）
    mechanism: shell-hook       # enum: shell-hook | config-hook | none · 节出现即必填
    triggers: [pre-commit]      # enum 数组 · 值域 {pre-commit, pre-archive} · mechanism≠none 时必填且非空
    command: "npx spec-wave verify --target ."   # 非空字符串 · mechanism≠none 时必填
```

- **约束（负 fixture 钉死）**：`mechanism: none` 时 `triggers`/`command` **禁出现**（出现即报红 · 防「声明降级又给命令」矛盾语义 · F-W1-10）；mechanism≠none 时 triggers 空数组报红、command 缺失/空串报红；**未知 mechanism 值 / 未知 triggers 值一律 enum fail-closed 报红**（不留扩展位 · 扩展 = schema 变更走 HG-SCHEMA-CHANGE · v3 复议 · OQ-1 处置口径）。
- **OQ-1 · triggers 枚举定稿 = `pre-commit` · `pre-archive`（两值）**：两点直接对应 PLAN W2 验收语言「门禁拒绝**脏提交**/**脏归档**」（PLAN W2 节 · W2 验收①）。候选 `pre-close` **合并入 `pre-archive`**：本仓 close 即归档同一事件（`cmdTaskClose` renameSync → done/ · `src/cli/task-cmd.ts:34-37,138-143` · done_snapshot 唯绑归档事件），一事件两枚举值不可钉 fixture 且语义冗余。维护者若对两点定稿或 pre-close 合并有异议，须在 HG-SCHEMA-CHANGE 闸批注中提出（OQ-1 处置口径沿用）。
- **机制族 × 触发点 × 13 宿主适用性论证**（声明层 · per-host 族归属写表属 W1 可选动作 · W2 按官方文档取证校准 · F-W2-06）：

| 机制族 | pre-commit | pre-archive | 13 宿主适用性 |
|--------|-----------|-------------|---------------|
| `shell-hook`（shell/git 钩子注入 · 如 `.git/hooks/pre-commit`、wrapper 脚本） | **全 13 宿主适用**（git 层钩子与宿主无关 · 凡经 git 提交的工作流即可承载） | 可经 shell 包装承载（close 入口 wrapper）· 无宿主原生事件锚点 · 承载强度低于 pre-commit · W2 物化模板须留痕说明 | 族资格宿主中立；是否计入某宿主声明属 W2 物化策略 |
| `config-hook`（宿主配置文件声明式钩子） | claude：官方 hooks 配置系统（settings.json `hooks` · 工具调用事件可匹配 `git commit` 命令串）⇒ 可承载 | claude：同机制匹配 `task close` 命令串 ⇒ 可承载 | **claude** = config-hook 首选；**cursor** = 候选（W1 声明层登记 · **W2 取证校准** · 不符则落 none 显式降级）；其余 11 宿主（dsh/agents/copilot/codex/windsurf/gemini/opencode/roo/zed/cline/aider）：本仓 2.2/2.3 W6 逐宿主官方文档取证卡（[`task_2_3_wiring_w6_host_completion`](../done/task_2_3_wiring_w6_host_completion.md)）未含任何 hook 机制面 ⇒ 不声明 config-hook |
| `none`（无 hook 能力 · 显式降级） | — | — | 上表 11 宿主在「shell-hook 不计入宿主声明」口径下声明 `mechanism: none` ⇒ 与 v1 缺省同语义 · 对应 PLAN W2「无 hook 能力的宿主显式降级留痕」 |

- **W1 边界**：schema 校验 + 声明入表 + 可机检（非法报红 / 合法报绿 · 验收 #3）即止；**物化归 W2 · 运行时永不归 SpecWave**。S2 扫描沿用：hooks 无落盘路径字段（command 为执行串非路径）· 不扩展 `checkS2Field`（`schema.ts:22-30`）。

### S2.3 `verify` 节承接

v1 `surfaces.verify: {kind, bin, failClosed?}` **原样承接**进 v2 同位置；`validateVerify`（`schema.ts:92-109`）校验语义保留接入新 schema；**W1 仍只校验不消费**（`host verify` 物化归 W2 · 对外文案不得暗示 verify 已生效 · 硬约束 9）；verify 节可入 `defaults` 参与 §S2.4 合并（13 遍逐字重复正是 B2 要消的面）。

### S2.4 `defaults` + host 级 `extends` 合并语义（评审文 §2.4 裁定 · **OQ-2 确认登记：数组 = replace**）

- 形态：根 `defaults.surfaces`（可选 · partial）· host 行 `extends: <host_id | "defaults">`（可选）· host 行 `surfaces` 只写差异面。
- **解析序**：defaults → extends 链（拓扑序）→ host 自身 surfaces · 后者覆盖前者。
- **合并规则（裁定值 · OQ-2 按 replace 确认 · 异议须闸前已提出 · 无）**：标量子覆盖父 · 对象**逐键深合并** · 数组（always_on/skills/commands 条目列表）**整体替换**（子声明该键即以子数组为准 · 未声明则继承）· 追加语法（`+key` 等）**显式不做**（留 v3 复议）。
- **拒绝面**：循环继承（A→B→A · 含自继承 A→A）拒绝并报循环链 · 未知 extend 目标拒绝并点名 · 链深上限 **8** 超限报红 · `extends: defaults` 合法但 defaults 自身不得 extends。
- **resolved rows 一次性展开**（F-W1-11 架构约束）：校验后、消费前一次性解析为全量展开的内部模型 —— 下游（materialize / pins / report）**只看到展开后的行 · 无需感知 extends**。
- **fixture 条目规格（OQ-2 登记 · 九条 · 逐一成 fixture）**：① 标量覆盖（子 verify.bin 覆盖父）② 对象深合并（子只写 failClosed 继承父 kind/bin）③ 数组整体替换（子声明即以子数组为准）④ 数组未声明则继承 ⑤ 循环继承拒绝（A→B→A 报循环链）⑥ 自继承拒绝（A→A）⑦ 未知 extend 目标拒绝并点名 ⑧ 链深 8 合法 / 9 层报红（边界双条）⑨ `extends: defaults` 合法 + defaults 自身 extends 报红。
- **pin-17 设计约束（评审文 §5.1 · 硬）**：v2 **禁止**把 `hosts` 改为 map 形态 · 禁止把 `host_id` 移出行级（pin-17 提取逻辑 `cli-pins.ts:389-392` 直接读原始 YAML `hosts[].host_id` · 不过 schema 校验 · 违反即 extract_error fail-closed）；表文件路径不变（`release-pins.yaml` 钉死 `assets/ide/host-adapt/examples/mvp-hosts.yaml`）· 13 宿主 id 不变。表内容用 defaults/extends 消重复属 **W1 可选动作**（做与不做 pin-17 前提均成立）。

### S2.5 `command_sets` 入表（B3 · 替硬编码）+ v1 兼容桥

- 新增**根级** `command_sets` 节：`core`（= `CORE_COMMAND_VERBS` 现 5 项 · `commands.ts:6-12`）· `expanded`（= `EXPANDED_COMMAND_STEMS` 现 7 项 · `:20-28`）· `forbidden`（`kit-30` · `kit-publish` · 注释纪律 `:17-19` 机检化 · 出现在 core/expanded 即报红）；core/expanded 非空数组 · 逐项非空字符串。
- **消费改造**：`materialize.ts:337-372` basename 解析 + `missing` 完整性检查（`:352/:365`）改读表数据；`commands.ts` 常量删除（parse 函数保留 · 数据源入表）。
- **fail-closed（F-W1-07）**：v2 表缺 `command_sets` → 报红 · **不回退硬编码默认**。
- **v1 兼容桥**：v1 路径（无 `command_sets` 键）由 back-compat reader **注入内建目录** = 当前常量现值（5+7 逐字）· 使旧表行为逐字不变；**OQ-6 漂移防护**：fixture 断言内建目录 = 现 5+7 项逐字值 · 删除常量时同步（F-W1-08）。
- **profile 语义不动**：`commandEntryApplies`（`commands.ts:47-52` · expanded ⊇ core）为行为逻辑保留；`CommandsEntry.profile` 枚举（`schema.ts:80-86`）不变。

### S2.6 闸判定泛化（范围④ · HG-GENERIC · 本闸的机制前提）

- `evaluateMayStart30`（`cli-shared.ts:292-306`）：白名单 3 闸 → **声明式全闸扫描** —— 任何 `blocksHats` 含 `30` 且 `status ≠ approved` 的闸行 → 拒 30 并点名闸 ID（reason 形如 `HG-SCHEMA-CHANGE pending`）；**保留 HG-AUDIT-R1 缺行即拒**（fail-closed by absence · F-W1-05 · 缺行/非 approved 双通道都咬）。
- `formatGateCheck`（`src/cli/gates.ts:54-98`）：泛化渲染**全部** `blocks_hats` 含 30 的命中行（不再只列 3 行 · 验收 #6）；exit code / `--json` 键集（command/target/task/blocked/verdict）语义不变。
- **回归锁（双锁）**：① 新 fixture（只含 `HG-SCHEMA-CHANGE | pending | 30` 一行的 task）断言 `evaluateMayStart30()` 返回 `{ok:false, reason:'HG-SCHEMA-CHANGE pending'}` 且 `may_start_30 === false`；② 存量快照 `test/fixtures/human-gates/baseline_20260916.json` **232 行判定结果逐条不变**（比对口径与 manifest 纪律见「开工基线」节 · OQ-5 闭环）。
- **自指依赖（OQ-7）**：顺序 = 评审文 → 00 代签闸（本表翻转）→ 30 改码（含泛化）；泛化落码前闸的约束靠人工纪律 + task 闸表 + GATE_VERIFY 扫描兜底（硬约束 15）。

### S2.7 `MIGRATION.md` 草案节要点（范围⑦ · 评审文 §4 素材 · W7 定稿）

落「2.4.2 → 3.0.0（breaking）」节（现状 `MIGRATION.md` 仅 1.12/改名线 · 无 3.0 节）：① 默认路径什么都不用做（内置 13 宿主消费者升级后行为不变 · 旧表含 `--file` 自定义表零改动继续可读）；② 自定义表作者可选迁移（表首加 `schema_version: 2` · 可选提 defaults/extends · **必做**声明 `command_sets` · 可选声明 hooks）；③ 禁止事项（不写 schema_version>2 · command_sets 不含 kit-30/kit-publish）；④ 落点不变。**约束**：草案节追加不得动既有钉点行（pin-14 = `MIGRATION.md:3` 版本串 · F-W1-12）。

---

## 范围

- [ ] **① A3 上半 · schema 增节**（SPEC §3-① · S2.1/S2.2/S2.3）：`schema_version` 整数探测 · `hooks` 节（enum 定稿：mechanism 三族 × triggers 两值 · 双轨 = `host-adapt.schema.json` + `src/host/schema.ts` 手写校验器）· `verify` 原样承接；`mvp-hosts.yaml` 增 `schema_version: 2` 及新节（表内容改写幅度以保 pin-17 前提为限 · 可选）
- [ ] **② B2 分层**（SPEC §3-② · S2.4）：`defaults` + host 级 `extends` 合并器（标量覆盖 / 对象深合并 / **数组 replace** / 循环拒绝 / 未知目标拒绝 / 链深上限 8）· **resolved rows 一次性展开** · 正负 fixture 九条目
- [ ] **③ B3 动词名入表**（SPEC §3-③ · S2.5）：根级 `command_sets`（core/expanded/forbidden）· `materialize.ts` 消费改造 · `commands.ts` 常量删除 · v1 兼容桥注入内建目录 + OQ-6 逐字 fixture
- [ ] **④ 闸判定泛化**（SPEC §3-④ · S2.6）：`evaluateMayStart30` 声明式全闸 · `formatGateCheck` 泛化渲染 · HG-AUDIT-R1 缺行即拒保留 · 双锁 fixture
- [ ] **⑤ 向后兼容 reader**（SPEC §3-⑤ · S2.1 探测树 + 评审文 §3.2 映射表六行恒等）：v1 旧扁平格式零改动通过 · compat 回归锁 fixture（2.4.2 版 `mvp-hosts.yaml` **逐字拷贝**固化 · `host validate` / `host apply --dry-run` 零改动通过 + **planned writes 与 2.4.2 基线逐字一致**快照断言）
- [ ] **⑥ `HG-SCHEMA-CHANGE` 闸设立**（SPEC §3-⑥ · 硬约束 3/15）：评审文已落盘 `docs/harness/reviews/` · 闸行已落本 task `### 人工闸` 表且 `blocks_hats` 含 `30`（本文件即证 · 验收 #7）
- [ ] **⑦ `MIGRATION.md` 迁移节草案**（SPEC §3-⑦ · S2.7）：「2.4.2 → 3.0.0（breaking）」节落盘 · 不动 pin-14 钉点行

## 非范围

| 项 | 理由 |
|----|------|
| 改 13 宿主既有落点路径 | 物化目标不变（物化归 W2 兑现面 · SPEC §4） |
| 改 pin-17「表行 ∧ 词锚」判据 · 改 `hosts` 数组形态 / 行级 `host_id` / 13 宿主 id / 表文件路径 | pin-17 前提（评审文 §5.1 · `cli-pins.ts:382-395` 直接读原始 YAML）· 语义判归 W4 |
| hooks/verify **物化**与运行时（`host verify` 命令 · hooks 落点模板） | 归 W2（SPEC §4 · 评审文 §2.2/§2.3 · OQ-4：W1 窗口期 verify 仍零消费 · 对外文案不得暗示已生效 · 硬约束 9） |
| 引入第二份适配表 · B5 catalog / 用户级目录 / 多表合并 | PLAN W1 明示 · 归 W2（B5 依赖本波 schema · 不得抢跑） |
| 追溯存量 task 闸表改写 | 不追溯存量（硬约束 7 · D-24-W2-NO-RETRO 沿用）· 泛化对存量零误伤已由快照实证 |
| `version` 字符串字段语义/类型变更 · 报告面消费改造 | 评审文 §2.1 · 保留不动 |
| hooks 追加语法（`+key`）· triggers/mechanism 枚举扩展位 | 评审文 §2.4/OQ-1 · 显式不做 · 留 v3 复议 |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（无代跑授权） |
| SPEC / PLAN / reviews 既有档改动 | S2 只新增不覆写 · 本棒/本波均不改 |
| 工作区 untracked 档（评审文 · 上游产物）裹挟提交 | 禁 `git add -A` · 逐文件显式 add（F-W1-14） |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-W1-00 · 沿 W0 例） | 30 **拒开工**（verify 机械拦 exit 2 · 闸真值以本表为准） | 是（20 审 + 00 签后） | 是 |
| HG-SCHEMA-CHANGE=pending 即 30 改码（F-W1-04 前置形态 · OQ-7） | 泛化交付前：人工纪律 + GATE_VERIFY 扫描兜底拒开工；泛化交付后：`evaluateMayStart30` 声明式机检拒 30 并点名 | 是（00 代签翻转后） | 是 |
| 旧格式适配表含未知新字段（F-W1-01） | 按 additionalProperties:false 既有口径拒绝并点名字段；旧格式本身不受影响 | 是 | 是 |
| `extends` 循环继承 A→B→A / 自继承 A→A（F-W1-02） | 合并器拒绝并报循环链 · 负向 fixture 固化（S2.4 条目⑤⑥） | 是 | 是 |
| `schema_version` > 2 或非整数（F-W1-03） | fail-closed 报「未知 schema_version」/ schema 报红 · 不得静默按旧格式解析 | 是 | 是 |
| 闸表存在 `blocks_hats=30` 且 pending 的新闸 ID（F-W1-04 · 泛化目标行为） | 拒 30 并在 `gate-check` 输出点名该闸 | 是 | 是 |
| task 文无 `### 人工闸` 节 / 无 HG-AUDIT-R1 行（F-W1-05） | 保留缺行即拒（fail-closed by absence · 存量 11 文件现态即此行为 · 泛化后逐字保留） | 是 | 是 |
| 泛化对存量 task 判定翻转（F-W1-06） | 验收 #5 回归锁拦截（快照 232 行逐条比对）· 不得放行；确需翻转的须评审文论证并入豁免留痕 | 是 | 是 |
| v2 表缺 `command_sets` 或含 forbidden 条目（F-W1-07） | 按表数据缺失 fail-closed 报红（不回退硬编码默认）· 13 宿主流转前全量校验 | 是 | 是 |
| v1 兼容桥内建目录与 `commands.ts` 常量删除后漂移（F-W1-08 · 本棒新增 · OQ-6） | fixture 断言内建目录 = 现 5+7 项逐字值拦截 · 删除常量时同步 | 是 | — |
| 快照比对面漂移（30 时点新增/改动 task 文件）（F-W1-09 · 本棒新增） | 比对以快照 manifest 文件集 + 行键为准 · 新增文件（含本 task 自身）不入比对面 · 快照内既有文件行变动 STOP 登记 | 是 | — |
| hooks 矛盾声明（`mechanism: none` 带 triggers/command · 非 none 缺 triggers/command · 未知枚举值）（F-W1-10 · 本棒新增 · OQ-1） | schema 校验报红（enum fail-closed）· 负 fixture 固化 | 是 | 是 |
| resolved rows 未一次性展开致下游感知 extends（F-W1-11 · 本棒新增） | 架构约束：materialize/pins/report 只消费展开后行 · code review 拦截；pin-17 原始 YAML 提取路径不动 | 是 | — |
| MIGRATION.md 草案动既有钉点行（F-W1-12 · 本棒新增） | pin-14（`MIGRATION.md:3` = 2.4.2）pins check 拦截 · 草案节只追加 | 是 | — |
| 既有 gate 系测试含 3 行渲染字面断言（F-W1-13 · 本棒新增） | 泛化渲染是有意行为变更：同步更新受影响断言并逐条登记（exit code / --json 键集 / 「→ 30 不可开工」文案语义不变 · 本棒实测现有断言面 = exit code + JSON 键集 + 文案片段 · 预期零改动通过） | 是 | — |
| `git add -A` 裹挟域外档（评审文 untracked 等）（F-W1-14） | 打回 · 撤 stage 逐文件显式 add | 是 | — |
| 越权执行 tag/push/publish/deprecate（F-W1-15） | 违禁令 · 打回（四动作全仅人） | — | 是 |

---

## 验收标准（必须自证，不接受「我改完了」）

- [ ] **#1 向后兼容回归锁**（SPEC 验收 1）：2.4.2 版 `mvp-hosts.yaml` **逐字拷贝**固化为 fixture（建议 `test/fixtures/host-adapt/mvp-hosts_2_4_2.yaml`）→ 新版 `host validate` / `host apply --dry-run` **零改动通过**；断言物化计划（planned writes）与 2.4.2 基线**逐字一致**（planned writes 快照同步固化 · 防映射漂移 · 评审文 §3.3）
- [ ] **#2 extends/defaults 合并语义 fixture**（SPEC 验收 2 · OQ-2 九条目全固化）：正 = 标量覆盖 / 对象深合并 / 数组 replace / 未声明继承 / 链深 8 边界 / `extends: defaults`；负 = 循环继承拒绝（含自继承 · 报循环链）/ 未知目标点名 / 链深 9 报红 / defaults 自身 extends 报红
- [ ] **#3 hooks 节可机检**（SPEC 验收 3 · OQ-1 enum）：合法声明（shell-hook/config-hook × pre-commit/pre-archive · mechanism: none）报绿；非法报红 = 未知 mechanism / 未知 trigger / none 带 triggers 或 command / 非 none 缺 command / triggers 空数组（JSON schema + 手写校验器双轨各一组）
- [ ] **#4 13 宿主端到端不回归**（SPEC 验收 4）：`host apply` / `host update` 全宿主绿；`node bin/specgate.js pins check` **17/17** 仍绿（含 pin-17 13 宿主双语命中）
- [ ] **#5 闸判定泛化回归锁（双锁）**（SPEC 验收 5 · OQ-5）：① 新 fixture 构造**只含** `HG-SCHEMA-CHANGE | pending | 30` 一行的 task，断言 `evaluateMayStart30()` 返回 `{ ok:false, reason:'HG-SCHEMA-CHANGE pending' }` 且 `status` 的 `may_start_30 === false`；② 存量快照 `test/fixtures/human-gates/baseline_20260916.json` **232 行判定结果逐条不变**（泛化后重扫比对 · manifest 文件集 + 行键口径 · F-W1-09 纪律）
- [ ] **#6 gate-check 泛化渲染**（SPEC 验收 6）：输出表列出**所有** `blocks_hats` 含 30 的闸行（不再只列 3 行 · fixture task 含白名单外闸断言渲染命中）· 快照断言；exit code / --json 键集语义不变
- [ ] **#7 HG-SCHEMA-CHANGE 闸已落本 task 闸表**（SPEC 验收 7 · 硬约束 15）：`### 人工闸` 表该行 `blocks_hats` 含 `30`（本文件即证 · `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w1_schema_leap.md` 可机检）
- [ ] **#8 MIGRATION.md 草案节落盘**（SPEC 验收 8）：「2.4.2 → 3.0.0（breaking）」节含 S2.7 四要点 · W7 定稿前可评审形态 · pin-14 钉点行零改动
- [ ] **#9 平台锁**（SPEC 验收 9）：`npm run typecheck` 0 错 · `npm test` 全绿（含新增 fixture · 以基线 607 + 新增用例数为准 · 零意外红 · 环境红先对照实验定性）
- [ ] **#10 既有测试零改动全绿**：11 件 host 系测试（评审文 §5.2 表 · `test/host-adapt-*.test.ts` 全 11 件）+ gate 系既有断言（cli-p0 C5 / gate-semantics / cli-flags 等）**零改动全绿**；如因泛化渲染确需改动（F-W1-13）须逐条登记并限渲染字面
- [ ] **#11 command_sets 内建目录 fixture**（OQ-6）：断言 v1 兼容桥注入目录 = `verify, gate-status, init-guide, apply-standards, hat-reanchor` + `hat-00-delegate, hat-10-spec, hat-10-task, hat-20-spec-audit, hat-20-task-audit, graph-check, sync-prompts-guide` 逐字（5+7）
- [ ] **#12 结构闸**：`npx spec-wave task lint --file docs/tasks/active/task_3_0_w1_schema_leap.md` PASS
- [ ] **#13 执行粒度**：提交逐文件显式 add（禁 `git add -A`）· 每 commit 独立可回退 · 每 commit 前后 npm test 同绿 · 未执行 tag/push/publish/deprecate · 波末 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w1_schema_leap.md` → exit 0 + `task close --yes` 闭环

---

## 给执行帽的必读列表

1. **schema v2 设计真值** [`docs/harness/reviews/w1_schema_change_review_20260916.md`](../../harness/reviews/w1_schema_change_review_20260916.md) **全文**（§2 设计 · §3 三重保险 · §5 测试面 · §6 OQ · §7 闸行）——30 实施以本文 + 本 task「schema v2 实现规格」节为准
2. SPEC [`02_w1_schema_leap_v1.md`](../../spec/3_0-architecture-leap/02_w1_schema_leap_v1.md)（范围 ①–⑦ · 非范围 · 验收 1–9 · F-W1-01–07）· [`00_policy_and_boundaries.md`](../../spec/3_0-architecture-leap/00_policy_and_boundaries.md)（S2/P0/流程边界）
3. PLAN [`PLAN_3_0_architecture_leap_v1_zh.md`](../../roadmap/PLAN_3_0_architecture_leap_v1_zh.md) W1 节 + 硬约束 3/4/9/12/15
4. 现码（2026-09-16 实读行号 · 改前复读）：`src/host/schema.ts`（validateHostAdaptDoc :112-164 · 根白名单 :118-121 · 行白名单 :133-136 · surfaces 白名单 :143-144 · 三节必填 :153-157 · validateVerify :92-109 · checkS2Field :22-30）· `src/host/commands.ts`（常量 :6-28 · parse :32-44 · commandEntryApplies :47-52 · legacy 扁平 :60-67）· `src/host/materialize.ts:337-372`（命令物化 + missing 完整性检查）· `src/host/table.ts`（DEFAULT_EXAMPLE_REL :7 · resolveValidateFile :45-48 · listKnownHostIds :51-68 · asHostRows :40-43）· `src/host/cmd.ts:503-512`（子命令分派）· `src/cli-shared.ts`（GATE_ROW_RE :25-26 · normalizeCell :209-211 · parseHumanGates :270-286 · findGate :288-290 · evaluateMayStart30 :292-306）· `src/cli/gates.ts:54-98`（formatGateCheck）· `src/cli-pins.ts:382-395`（pin-17 提取 · 直接 yamlLoad 不过 schema 校验）
5. 表与 schema：`assets/ide/host-adapt/host-adapt.schema.json`（97 行 · **现址无 schema/ 中间层** · OQ-8 登记）· `assets/ide/host-adapt/examples/mvp-hosts.yaml`（219 行 · 13 宿主 verify 逐字重复 13 遍）· `assets/ide/host-adapt/README.md`（宿主×表面矩阵）
6. **闸基线快照** `test/fixtures/human-gates/baseline_20260916.json` + 生成器 `scripts/scan-human-gates-baseline.mts`（验收 #5 比对基线 · 再生成命令见「开工基线」节 · 口径/归因见同节 OQ-5 表）
7. 既有测试面：`test/host-adapt-*.test.ts` 全 11 件（零改动全绿硬条）· `test/cli-p0.test.ts`（C5 文案断言）· `test/gate-semantics.test.ts` · `test/cli-flags.test.ts`（--json 键集钉死）
8. done task [`task_3_0_w0_refactor_prep.md`](../done/task_3_0_w0_refactor_prep.md)（格式/基线复跑/逐文件 add 先例）+ M1 验收文 [`w0_refactor_prep_acceptance_M1_20260916.md`](../../harness/reviews/w0_refactor_prep_acceptance_M1_20260916.md)
9. `MIGRATION.md`（现状 1.12/改名线 · pin-14 钉 `MIGRATION.md:3` 版本串 · 草案节只追加）· `RELEASING.md`（发布边界 · 四动作仅人）

---

## 思考轮

### R0 · 证据

评审文（00 已批）+ SPEC 02（signed）+ PLAN W1/硬约束 + 本棒全量实读复核：新布局行号现值（schema.ts/commands.ts/materialize.ts/table.ts/cmd.ts/cli-shared.ts/gates.ts/cli-pins.ts · 见必读 4）· schema.json 97 行现址无 schema/ 层（OQ-8）· mvp-hosts.yaml 13 宿主 verify 逐字重复 13 遍 · `grep hooks src`=0 复证 · 基线复跑 607/116/606/0/1 + typecheck 0 错 + pins 17/17（原 4 环境红已消）· **OQ-5 统一口径重扫 75/232/12（快照已固化）** · 既有 gate 测试断言面 = exit code + JSON 键集 + 文案片段（泛化渲染影响面实测可控）。

### R1 · 范围

①–⑦ 照 SPEC §3 + 评审文 §2 规格化落 S2.1–S2.7；非范围照 SPEC §4 + 物化归 W2 + 不追溯存量 + pin-17 四禁（hosts map 化 / host_id 移行级 / 宿主 id 变 / 表路径变）+ 发布四动作仅人。表内容用 defaults/extends 消重复登记为 **W1 可选动作**（pin-17 前提成立性不变 · 评审文 §5.1）。

### R2 · 方案

评审文裁定全继承：schema_version 整数（OQ-3 非 blocking 复核通过 · 不复用 version 串）· hooks 只声明与物化 · 数组 replace（**OQ-2 确认** · 追加语法不做）· resolved rows 一次性展开 · command_sets 根级三节 + v1 兼容桥 · 闸泛化声明式 + 缺行即拒保留。**本棒定稿新增**：OQ-1 triggers 枚举 = `pre-commit`/`pre-archive` 两值（pre-close 合并论证落 S2.2 · 一事件一值可钉 fixture）· hooks none 矛盾声明报红（F-W1-10）· OQ-6 内建目录逐字 fixture（F-W1-08）。

### R3 · 边界

S2 只新增（本 task + scripts/test fixtures 为本棒交付 · 不改 SPEC/PLAN/reviews）· 不签任何闸（HG-SCHEMA-CHANGE/HG-TASK-DRAFT pending 落表待 00 翻转）· 发布四动作仅人 · 禁 `git add -A`（评审文 untracked 裹挟风险实测存在）· MIGRATION.md 草案只追加不动 pin-14 钉点行 · W2 职责（物化/运行时/catalog）一行不碰 · 对外文案不得暗示 verify/hooks 已生效（硬约束 9）。

### R4 · 可测性

验收 13 条全机械可断言（命令 + fixture 路径 + 期望输出均落入验收节）：compat 回归锁双断言（validate/apply 通过 + planned writes 逐字）· OQ-2 九条目逐一成 fixture · hooks 红绿双轨 · 闸泛化双锁（新 fixture reason 逐字 + 快照 232 行逐条）· 渲染快照断言 · pins 17/17 · 11+gate 系既有测试零改动。红测先行面 = schema 负 fixture + 闸泛化新 fixture（先红后绿）。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待审查文落盘 + 00 代签 · 维护者 2026-09-16 授权模式）；HG-SCHEMA-CHANGE / HG-TASK-DRAFT 待 00 翻转；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 评审文已批 + SPEC signed + 行号全量复核现值 + 基线复跑（607/606/0/1 · typecheck 0 · pins 17/17）+ OQ-5 快照 75/232/12 固化 | no |
| R1 | 范围 ①–⑦ + S2.1–S2.7 规格化 · 非范围含 pin-17 四禁 + W2 职责不碰 | no |
| R2 | 评审文裁定全继承 + OQ-1 两值定稿（pre-close 合并）+ OQ-2 replace 确认 + OQ-6 fixture 化 | no |
| R3 | S2 只新增 · 不签闸 · 发布仅人 · 禁裹挟 · pin-14 不动 · 硬约束 9 文案口径 | no |
| R4 | 验收 13 条全机械 · 红测先行面明示 · 双锁/双轨/九条目可钉 | no |
| R5 | 待 20 审 R1 裁定充分性 · 双闸待 00 翻转 | no |

**residual_risks**：① **breaking 面最广**（全部宿主消费者）——三重保险（compat reader + 版本探测 + MIGRATION）任一缺失即不可放行（缓解：验收 #1/#2/#4 硬锁 + planned writes 逐字断言）；② OQ-1 触发点两点定稿与 pre-close 合并裁决若维护者有异议须闸批注提出（缓解：S2.2 论证落盘 · enum fail-closed 无扩展位 · 扩展走 v3 HG-SCHEMA-CHANGE）；③ per-host mechanism 族归属在 W1 仅声明层适用性论证 · 写表归 W2 取证校准（缓解：F-W2-06 机制 · W1 表内容改写登记为可选且受 pin-17 四禁约束）；④ 基线快照与 SPEC/评审文历史数字不可逐行对账（口径+时点双差 · 缓解：归因表落盘 · 以本快照为唯一基线 · F-W1-09 比对面纪律）；⑤ 闸泛化交付前 HG-SCHEMA-CHANGE 约束靠人工纪律（OQ-7 自指 bootstrap · 缓解：顺序已明 + task 闸表 + GATE_VERIFY 兜底）；⑥ v1 兼容桥内建目录与常量删除存在同步漂移窗（缓解：OQ-6 逐字 fixture · F-W1-08）；⑦ 泛化渲染对既有 gate 系测试存在字面断言耦合风险（缓解：F-W1-13 · 本棒实测断言面为 exit code/JSON 键集/文案片段 · 预期零改动 · 确需改动逐条登记限渲染字面）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 验收主体 = **三重保险机械锁全绿**（compat 回归锁 + extends/defaults 正负 fixture + 闸泛化双锁 · 命令与判据见验收节），辅以：① **红测先行**（schema 负 fixture（hooks/command_sets/schema_version/extends 拒绝面）+ 闸泛化新 fixture 先红后绿）；② 每 commit 前后 `npm test` 同绿（基线 607/116/606/0/1 · 环境红按 F-W0-07 同式对照实验先行定性）；③ 快照比对自证（验收 #5② 重扫脚本对 manifest 文件集逐行 diff 为空）；④ 11 件 host 测试 + gate 系既有断言零改动全绿（行为逐字不变的另一半证明）。**本波是行为变更波（schema 新能力 + 闸泛化）· 红绿纪律 = 新行为全部 fixture 先行 · 旧行为全部回归锁兜住。**

---

## 提交信息约定

- `feat(3.0-W1): schema v2 校验与探测（schema_version 整数探测 + hooks enum + verify 承接 · 双轨）`
- `feat(3.0-W1): defaults/extends 合并器（resolved rows 一次性展开 · OQ-2 九条目 fixture）`
- `feat(3.0-W1): command_sets 入表（materialize 消费改造 + v1 兼容桥 + OQ-6 fixture）`
- `feat(3.0-W1): 闸判定泛化（evaluateMayStart30 声明式 + formatGateCheck 泛化渲染 + 双锁）`
- `docs(3.0-W1): MIGRATION.md 2.4.2 → 3.0.0 迁移节草案（不动 pin-14 钉点行）`
- 表内容消重复（可选动作）若做：独立 commit `feat(3.0-W1): mvp-hosts.yaml defaults/extends 消重复（pin-17 四禁守住）`
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界（评审文等 untracked 属上游 · F-W1-14）
- **禁 tag / push / publish / deprecate（仅人 · 无代跑授权）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_3_0_w1_schema_leap.md`

---

### 自检结论（执行者）

（30 执行后回填：GATE_VERIFY 首输出闸扫描表 · 验收 13 条逐项实测 · 红测先行记录 · 快照比对 diff 结论 · 已知未测项）

### KPI（00）

（00 收官回填 · rubric `KPI_RUBRIC_v1_2`）

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 初稿 · 10-task（评审文 00 批准后拆单）：行号全量回源码复核现值（W0 后新布局 · SPEC 快照行号更新）· 基线复跑（npm test 607/116/606/0/1 原 4 环境红已消 · typecheck 0 错 · pins 17/17 · HEAD 98d2062）· **OQ-1 定稿**：triggers 枚举 = pre-commit/pre-archive 两值（pre-close 合并入 pre-archive · 论证落 S2.2）+ 机制族×触发点×13 宿主适用性矩阵 · **OQ-5 闭环**：统一口径扫描器 `scripts/scan-human-gates-baseline.mts` + 快照 `test/fixtures/human-gates/baseline_20260916.json`（75 文件/232 行/12 闸 ID · 差值归因落基线节 · 本棒交付件）· **OQ-2 确认登记**：数组 replace · fixture 九条目规格 · 闸表按评审文 §7 落（HG-SCHEMA-CHANGE/HG-TASK-DRAFT/HG-AUDIT-R1 均 pending 待 00 翻转 · 本棒不签任何闸）· 新增 F-W1-08–15（OQ-6 漂移/比对面纪律/hooks 矛盾声明/resolved rows 约束/pin-14/渲染断言耦合/裹挟/越权） |
