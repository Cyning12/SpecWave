# Task：2.4.1 patch · 验收报告 NEW-1/NEW-2/NEW-3/NEW-9+N9 四项修复 + bump（2.4.0 → 2.4.1）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（00 代签 · 2026-09-14）· 30+40 闭环完成 · 2026-09-14）  
> **关联证据**：验收报告 [`.workbuddy/output/验收报告-SpecWave-2.4.0.md`](../../../.workbuddy/output/验收报告-SpecWave-2.4.0.md) §3 NEW-1（P1 否定守卫绕过）· NEW-2（P1 cwd≠target/realpath 泄漏）· NEW-3（P2 pin-16 HTML 锚点）· NEW-9+§2 N9 未闭环（P2 pin-08 状态格子串顶包）· §6.1「建议纳入 2.4.1」（**判 PASS-with-issues · 建议 2.4.1 patch 修 4 组 · §7.3 纪律：不开 2.5.0**）  
> **基线**：spec-wave@2.4.0（已发布 · tag `v2.4.0` ↔ `343025d` · registry latest=2.4.0 三向一致）· main HEAD=3e60c0f · 582 total / 581 pass / 0 fail / 1 门控 skip · pins 17/17 · assets 110/110（验收报告 §1 实测值 · **禁前置重跑全量 npm test**）  
> **发版纪律**：[`RELEASING.md`](../../../RELEASING.md)（本波只做修复 + bump 段；**tag+push 维护者已授权 00 代跑 · publish 仅人**）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-4-1-patch` |
| **test_strategy** | `required` |
| **test_strategy_note** | 负向 fixture 先行：NEW-1 B/D/E 三形态（`不予通过` / `不 通过` / `NO PASS` → 判未通过）· NEW-2 cwd≠target + symlink/realpath 入参对偶测试（现 21 测只覆盖 cwd==target 是掩盖源）· NEW-3 `<a href="FOO.md">` 负向 · NEW-9 `v2.4.0` / `2.4.0-beta` 顶包负向；四门（typecheck / test / build / test:lib）+ pins check 为验收硬条款；582 用例基线只增不红（tag-gated 设计红留痕口径同前例） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | patch 级缺陷修复 + bump 簿记；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 修复性 patch，无规范增量；「判据用裸子串/字面连续而非语义边界是同族系统性弱点」（报告 §8 总结论 4）由关账经验总结留痕，晋升 wiki 与否归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身发版系列；合入由维护者 push+tag（本版已授权 00 代跑 tag+push · publish 仍仅人 · 同 2.3.1 先例变形） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · **2026-09-14 维护者直接下令做 2.4.1 · 授权 tag+push（00 代跑）· publish 仅人** |
| HG-SPEC-SIGNOFF | **N/A** | — | 无独立 SPEC 夹（属 `2_4-gate-strength` 验收后 patch · 同 2.3.1 先例） |
| HG-TASK-DRAFT | **approved** | 20, 30 | 00 代签（2026-09-14 维护者授权 · 2.3.1 同模式延续） |
| **HG-AUDIT-R1** | **approved** | 30 | 00 代签 · 2026-09-14 · 维护者授权（「进行2.4.1的修复，完成后直接tag+push」+ 前续过程文档代签授权延续）· 依据审查文 [`docs/harness/reviews/task_2_4_1_patch_audit_R1_20260914.md`](../../harness/reviews/task_2_4_1_patch_audit_R1_20260914.md)（R1 结论 PASS · 零内容阻塞 · 提示级 1 条归 30 定） |

---

## 背景与目标

2.4.0 验收报告判 **PASS-with-issues（有条件通过）**：发布面 12/12 健康、无 P0、tarball 卫生归零；2.3.0 遗留 14 项中 10 完全闭合，但 §8 总结论点名同族系统性弱点——**判据用「裸子串/字面连续」而非语义边界**（N9 未闭环 / N11 新绕过 / N12 部分泄漏三者同源）。§6.1 圈定四组补丁级修复（仅 P1 + 廉价 P2）：

- **NEW-1 [P1]**（§3 · lead 探针 `/tmp/lead-neg-probe.ts` 直调实测）：结论门禁否定守卫可绕过——`REVIEW_NEG_RE`（`src/cli-checks.ts:682`）要求否定词**字面连续**（`不通过`/`未通过`），插入任意字符（予/空格）即断链；否定词表仅中文。实测 B「不予通过」/ D「不 通过」/ E「NO PASS」三形态均误判 PASS ❌（A/C/F 对照正确）。裸 `verify` 与 `task close` 同用 `evalReviewConclusion`（`:689-721`）→ 两处门禁同病。
- **NEW-2 [P1]**（§3 · lead 直接核源码）：`printJson(base, payload)` 基参不一致——`src/cli.ts:1003/1098/1108/1125` 与 `src/cli-host.ts:490/507/524/784` 用 `process.cwd()` 作基（缺陷），同文件 `:565/:655/:781/:875`（cli.ts）与 `:1232/:1406`（cli-host.ts）已用 `target` 作基（正确）。cwd≠target 时无法相对化 → 打印绝对路径；macOS `/tmp → /private/tmp` realpath 子类同根（lexical 前缀失效）。掩盖源：`test/cli-json-no-abs-path.test.ts` 21 测全用 cwd==target 且 `--target` 取 realpath，恰好对齐。**接口面残留**（报告 :109 注记）：`host validate` 无 `--target` 参数，须定稿补 `--target` 还是声明「相对 cwd 输出」口径。
- **NEW-3 [P2]**（§3）：pin-16 漏扫 HTML `<a href="…">`——`README.md` 加 `<a href="FOO.md">` → `pins check` exit 0（对照同文件 `[x](FOO.md)` → exit 2）；`assets/release-pins.yaml:141` 起 pin-16 `semantics` 只声明 inline + reference-definition 两形态。**维护者定稿：修（非排除留痕）**。
- **NEW-9 / N9 [P2]**（§3 + §2 回代 · N9 为 2.3.0 遗留唯一未闭环项）：pin-08 状态格 `statusCell.includes(dotted)`（`src/cli-pins.ts:235`）为**裸子串包含**——同格 `tag `v2.4.0`` 的子串 `2.4.0` 即满足，状态格 `` `2.4.0` published`` 改 `` `9.9.9` published``（同格保留 v-tag）→ **仍 PASS exit 0**；`v2.4.0` / `2.4.0-beta` 皆算合格。注意：报告 §6.1 建议的 `(?<![0-9.])` 左边界**挡不住 `v` 前缀**（v 非数字/点）——判据须 10 棒复核设计后定稿（见 R2 与「定稿建议」节）。

**完成态行为**：否定守卫先判否定再判通过、B/D/E 三形态判未通过且 A/C/F 对照不回退；printJson 基参全部统一取命令 target（realpath 归一），cwd≠target 与 symlink 入参两子类归零，对偶测试防掩盖；pin-16 扫描面纳入 HTML 锚点（semantics 声明同步）；pin-08 状态格精确版本锁定（v 前缀/修饰符顶包判负 · 现行全量索引行零误伤回归）；package.json#version=2.4.1 且 pins 对齐、CHANGELOG `## [2.4.1] - 2026-09-14` 节落账；四门绿。

---

## 范围

- [x] **修 NEW-1 [P1] 否定守卫语义判据**：
  - `src/cli-checks.ts:682` `REVIEW_NEG_RE` 放宽 + `evalReviewConclusion`（`:689-721`）判定顺序核查：否定先于通过判定（现状 :713 否定先于 :714 通过 · 顺序已对，病根在正则覆盖面——30 实读确认后留证）
  - 否定正则放宽为 `不.\{0,3\}通过` / `未.\{0,3\}通过` / `no\s*pass` / `reject`（大小写不敏感 · **10 棒复核修正：报告原文 `不\S{0,3}通过` 盖不住 D 形态「不 通过」（空格非 \S），建议 `.`/`[\s\S]` 口径 · 见 R2 定稿建议**）；既有退回（前置 无需/不/未 除外）与内容阻塞（前置 零 除外）判据不回退
  - 负向 fixture 固化 B/D/E 三形态（`不予通过` / `不 通过` / `NO PASS` → 判未通过 · 红测先行修复前真红复现报告探针表）；对照 A（合法通过）/ C（`未通过` 已拦）/ F（只写「通过」）零回退
  - **存量波及**：放宽后否定词命中面扩大 → 30 阶段用 `evalReviewConclusion` 直评抽验现行 PASS 审查文样本（≥ 5 份 · 覆盖近期 2.4 各波 R1 审查文），误伤即循 W4/2.3.1 先例处置（豁免清单补条目 · **不得静默放过** · 处置留痕入本 task 修订记录）
  - **dogfood**：本 task 自己的 R1 审查文须过新闸
- [x] **修 NEW-2 [P1] printJson 基参统一**：
  - `src/cli.ts:1003/1098/1108/1125` 与 `src/cli-host.ts:490/507/524/784` 的 `printJson(process.cwd(), …)` 改取**命令 target（realpath 归一）**——realpath 归一须在基参与入参双侧生效（堵 `/tmp → /private/tmp` 子类 · 报告 :107）
  - **10 棒复核增量发现**：`src/cli.ts:1299` exit-1 JSON 信封同为 `printJson(process.cwd(), …)`（报告 §6.1 未列 · 同根同修 · 错误 message 亦可能携路径）——纳入本项范围，20 审确认
  - `host validate` 接口面残留（报告 :109）**定稿建议 = 补 `--target` 参数（additive · 默认仍 cwd 保持兼容 · 与 verify/pins 等命令面一致）**，弃选「声明相对 cwd 输出」（口径残留即下一处泄漏 · 与统一出口方向相悖）；最终口径 20 审定后回填本节
  - 补对偶测试：cwd≠target（从非 target 目录调用 · `--target` 传绝对路径）+ symlink/realpath 入参（`--target /tmp/x` 而路径经 realpath 为 `/private/tmp/x`）两类 · 现 21 测（cwd==target）零回退
- [x] **修 NEW-3 [P2] pin-16 HTML 锚点**（定稿：修）：
  - `src/cli-pins.ts` pin-16 提取补 HTML `<a href="…">` 形态（与 inline/refstyle 走同一归一/判定管线：剥锚点 · scheme/纯锚点跳过 · 仓根级且存在的 `.md` ∈ 白名单）
  - `assets/release-pins.yaml:141` 起 pin-16 `semantics` 声明同步扩为三形态（数据声明与实现一致 · D-23-W2-CHECK-FORM 纪律）
  - 负向 fixture：`<a href="FOO.md">`（FOO.md 白名单外且仓根级存在）→ `pins check` exit 2（红测先行复现报告构造）；对照入白名单转绿
  - **assets 联动纪律**：yaml semantics 改动触发 manifest 哈希面变化 → `assets manifest rebuild --yes` + `assets verify` 收口（2.3-W5 既有流程）
- [x] **修 NEW-9 / N9 [P2] pin-08 状态格精确版本锁定**：
  - `src/cli-pins.ts:235` `hitA` 由裸子串 `statusCell.includes(dotted)` 改**边界正则匹配**（10 棒定稿建议见下 · 30 按定稿实现）
  - **定稿建议（10 棒复核设计 · 20 审确认）**：`(?<![0-9A-Za-z._-])X\.Y\.Z(?![0-9A-Za-z._-])`（X.Y.Z 为当前版本 regex 转义）——左边界排除数字/字母/点/下划线/连字符（拦 `v2.4.0` 的 `v` 前缀 · 拦 `12.4.0`），右边界同口径（拦 `2.4.0-beta` 的 `-` · 拦 `2.4.0.1` / `2.4.0rc1`）；放行 `` `2.4.0` published ``（反引号/空格不在排除类）· 拦 `9.9.9` 改坏（版本串不匹配即不满足 hitA · 既有行为保持）。报告 §6.1 原建议 `(?<![0-9.])` 左边界挡不住 `v` 前缀（v 非 [0-9.]）· 本建议为其修正版
  - 负向 fixture ×3：状态格改 `` `9.9.9` published`` 同格保留 v-tag → exit 2（复现 §2 N9 构造）· `` `v2.4.0` published`` → exit 2 · `` `2.4.0-beta` `` → exit 2（红测先行）
  - **全量回归**：现行 `docs/spec/README.md` 全部存量索引行（含 2.1.3/2.2.1/2.3.1 patch 收尾行与 `2_4-gate-strength` 规划行）新判据下 `pins check` 全 PASS 零误伤；`assets/release-pins.yaml` pin-08 semantics 声明同步更新（`X.Y.Z 规划中` 行口径 F-W1-05 既定 · 边界正则不影响反引号包裹形态 · 声明文字写清边界口径）+ manifest rebuild 联动（同 NEW-3 纪律）
  - hitB（slug 列行身份辅助判）不动；兜底嫌疑行诊断（suspects）沿用同边界口径防误列
- [x] **bump 2.4.1**（参照 87dfa6f / 268ca21 先例）：
  - `package.json#version` → `2.4.1`（**唯一手工版本改动点** · 不用 npm version 防顺手 tag）
  - CHANGELOG 发布头 `## [2.4.1] - 2026-09-14` 先落盘（Fixed 四项 · 发布状态写「待发版」口径 · 不冒充已 published）
  - `node bin/specgate.js pins fix --yes` 对齐钉面 → pin-10「git tag v2.4.1 缺失」**设计红留痕**（口径同 2.3.1 · 待 tag 后复跑须 17/17）
  - 机械替换造成的 published 叙事漂移行巡检改回真值口径（2.3.1 经验）
  - pins 未钉的现行版本引用与测试版本断言联改留痕（沿袭 2.3.1 先例 · perl 双模式两轮覆盖字面+转义形态 · 2.3.1 教训）
  - RELEASING 台账 + 人 checklist 2.4.1 节【**双重敏感**：改后全量 npm test】
  - ACCEPTANCE_2_4_1 验收台账档落 `docs/roadmap/` + `docs/spec/README.md` 索引行（pin-08 行随精确锁定判据补行 · 状态格 `` `2.4.1` `` 点式 + 发布态词）
  - **tag+push 由 00 代跑（维护者 2026-09-14 授权）· publish 仅人**

## 非范围

| 项 | 理由 |
|----|------|
| NEW-4（pin-17 伪表行顶包）· NEW-5（S1·N=20 非语义闸） | 归 3.0（报告 §6.2 · 与 A4 ontology-check 同向合并设计） |
| NEW-6（pack-hygiene 非通配）· NEW-7（卫生门单一控制点）· NEW-8（pins fix 无条件删同名 .bak）· NEW-12（relativizeOutputValue 不改 key） | 归 3.0 / 任一补丁顺带（报告 §6.2 机械清扫类 · 不阻塞） |
| NEW-10（exempt 数据后门 + close 逻辑分叉）· NEW-11（否定词表仅中文的**广义**词表面） | 归 3.0（报告 §6.2 · authorized_by 真实性核验依赖 provenance/OIDC 未启用；NEW-1 已纳入 `no\s*pass`/`reject` 基本英文形态，NEW-11 残余词表归 3.0） |
| N5（assets rebuild 追认 · 设计性残留） | 报告 §6.2 明示归 3.0（2.4-W4 已落警示文案 · 威胁模型议题属 3.0） |
| 对外口径调整 / 物料翻新 | 2.4.0 W5 已落地 · 本 patch 不返工 |
| `npm publish` / `npm deprecate` | **仅人**（RELEASING · Agent 禁令 · 维护者授权仅含 tag+push） |
| RELEASING.md「最近一次发版」表叙事回填 | 待维护者 publish 后回填（避免冒充已发布） |
| host-adapt schema / pins 引擎架构 | 00 政策块 · 触 schema 即 STOP |
| assets/ 资产本体内容修改 | 仅 yaml semantics 声明文字（NEW-3/NEW-9 联动 · 哈希面经 rebuild 收口）；其余资产零触碰 |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-P2-01） | 30 **拒开工**（verify 机械拦 exit 2） | 是（20 审 + 00 签后） | 是 |
| 越权执行 publish/deprecate（F-P2-02） | 违禁令 · 打回（tag+push 已授权 · publish 仅人） | — | 是 |
| `git add -A` 裹挟域外档（F-P2-03） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| NEW-1 否定正则放宽误伤合法审查文（如「不再退回，予以通过」类表述被 `不.{0,3}通过` 误中）（F-P2-04） | 抽验样本红 · 打回调边界（.{0,3} 窗宽 / 排除词）再交付 | 是 | 是 |
| 存量波及未处置即关账（新闸把 done 面复验打红却静默放过）（F-P2-05） | 违 W4/2.3.1 先例 · 打回 | 是（循豁免先例处置） | 是 |
| 负向 fixture 误绿（fixture 构造未命中目标形态）（F-P2-06） | 红测不红 = 无效测试 · 打回 | 是 | — |
| NEW-2 对偶测试仍对齐 cwd==target（掩盖源复发）（F-P2-07） | 打回 · 对偶用例必须真异目录 + 真 symlink | 是 | — |
| NEW-9 边界正则误伤存量索引行（反引号/星号包裹形态未回归）（F-P2-08） | 全量回归红 · 打回调排除类字符集 | 是 | 是 |
| 四门任一红（F-P2-09） | 停止 · 先修再发（RELEASING ②） | 是 | 是 |
| pin-10「git tag v2.4.1 缺失」设计红误判为代码回归（F-P2-10） | 留痕说明 · 待 tag 后复跑 | 是 | — |
| 顺手扩范围修 3.0 项（NEW-4..12 / N5）（F-P2-11） | 打回 | — | — |
| RELEASING 台账 + 人 checklist 2.4.1 节改动后未跑全量 npm test（F-P2-12 · 双重敏感条款） | 验收 FAIL · 补跑 | 是 | — |
| yaml semantics 改动后忘 manifest rebuild（assets verify 转红）（F-P2-13） | rebuild --yes + verify 收口（既有流程） | 是 | 是 |
| host validate 补 --target 破坏既有无参调用（F-P2-14） | --target 可选 · 默认 cwd · 既有用例零回退为验收 | 是 | 是 |

---

## 验收标准

- [x] **NEW-1 负向 ×3（红测先行）**：fixture 审查文结论节分别写 `本任务不予通过。缺陷清单…` / `本任务不 通过。缺陷清单…` / `NO PASS. Defects listed…` → `verify --task` **exit 2**（修复前真红复现报告探针 B/D/E 行）；对照 A（合法通过含实质内容）exit 0 · C（`未通过`）仍 exit 2 · F（只写「通过」二字）仍 exit 2（2.3.1/2.4-W2 两道前闸不回退）；`task close` 同口径 BLOCKED
- [x] **NEW-1 存量**：`evalReviewConclusion` 直评抽验 ≥ 5 份现行 PASS 审查文（覆盖 2.4 W1–W6 各波 R1）零误伤留证；波及则循 W4/2.3.1 先例豁免处置留痕（不得静默放过）
- [x] **NEW-1 dogfood**：本 task R1 审查文自身过新闸
- [x] **NEW-2 基参统一**：`grep -n 'printJson(process.cwd()' src/cli.ts src/cli-host.ts` → **0 命中**（含 :1299 exit-1 信封 · 10 棒增量项）；cli.ts:1003/1098/1108/1125 与 cli-host.ts:490/507/524/784 全改 target（realpath 归一）
- [x] **NEW-2 对偶测试**：新增 cwd≠target 用例（从非 target 目录调用 `task close --json --target <abs>` → 输出无绝对前缀）+ symlink/realpath 用例（`/tmp` vs `/private/tmp` 形态 · macOS 实跑 / Linux CI 以 symlink 构造等价）两类真红先行（修复前复现报告代理实验：dest=绝对路径）；现 21 测零回退
- [x] **NEW-2 host validate 接口面**：按 20 审定稿口径落地（10 棒建议 = 补 `--target` additive 默认 cwd）；验收写明二选一结果；既有 host validate 无参调用零回退（F-P2-14）
- [x] **NEW-3 负向（红测先行）**：`files[]` 内 markdown 加 `<a href="FOO.md">`（FOO.md 白名单外仓根级存在）→ 修复前 `pins check` exit 0（复现报告构造）· 修复后 **exit 2** 指 `文件:行号`；对照（FOO.md 入 files[]）转绿；inline/refstyle 两形态既有用例零回退；yaml semantics 声明三形态与实现一致
- [x] **NEW-9/N9 负向 ×3（红测先行）**：状态格 `` `9.9.9` published`` 同格保留 ``tag `v2.4.0``` → exit 2（复现 §2 N9 构造）· `` `v2.4.0` published`` → exit 2 · `` `2.4.0-beta` `` → exit 2；正向 `` `2.4.0` published`` 行 PASS
- [x] **NEW-9 全量回归**：现行 `docs/spec/README.md` 全部存量索引行新判据下 `pins check` PASS 零误伤（F-P2-08）
- [x] **bump**：`package.json#version` = `2.4.1`（唯一手工点）· CHANGELOG 含 `## [2.4.1] - 2026-09-14` 节 · RELEASING 台账 + 人 checklist 2.4.1 节 · ACCEPTANCE_2_4_1 档 · spec 索引行 · assets manifest rebuild 后 `assets verify` 全绿
- [x] `node bin/specgate.js pins check` → 16/17，唯一偏差 = pin-10 git tag v2.4.1 缺失（**设计红** · 待 tag 后复跑须 17/17 · 口径同 2.3.1）
- [x] 四门全绿：`npm run typecheck` 0 错 · `npm test`（基线 582 只增不红 · tag-gated 设计红留痕口径同前例）· `npm run build` · `npm run test:lib`
- [x] 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_4_1_patch.md` → exit 0（PASS）+ `task close --yes` 闭环
- [x] 提交边界：`git diff --cached` 可证无裹挟；tag+push 由 00 代跑（维护者授权）· 未执行 publish/deprecate（仅人）

---

## 给执行帽的必读列表

1. 验收报告 [`.workbuddy/output/验收报告-SpecWave-2.4.0.md`](../../../.workbuddy/output/验收报告-SpecWave-2.4.0.md) §3（NEW-1/2/3/9）· §2 N9 行 · §6.1 / §6.2 / §7.3（只读结论 · 不碰档本体）
2. `src/cli-checks.ts`（REVIEW_NEG_RE :682 · evalReviewConclusion :689-721 · 否定先于通过 :713-714）
3. `src/cli.ts`（printJson 缺陷位 :1003/:1098/:1108/:1125 + 增量位 :1299 · 正确先例 :565/:655/:781/:875）· `src/cli-host.ts`（:490/:507/:524/:784 缺陷 · :1232/:1406 正确）· `src/cli-shared.ts`（printJson :430 · relativizeOutputValue :412-418）
4. `src/cli-pins.ts`（pin-08 hitA :235 · pin-16 提取区）· `assets/release-pins.yaml`（pin-08 semantics :60-73 · pin-16 semantics :141 起）
5. `test/cli-json-no-abs-path.test.ts`（21 测掩盖源 · 对偶测试落点）· pins/reviews 测试夹
6. done task [`task_2_3_1_patch.md`](../done/task_2_3_1_patch.md)（patch 链路 + 存量波及处置 + bump 八件套先例）· [`task_2_4_gate_strength_w1_pins_extract.md`](../done/)（pin-08/16 修严先例）
7. `RELEASING.md` 硬步骤（bump 段 · 人 checklist）
8. `docs/standards/` 涉码 L2（30 自裁引用）

---

## 思考轮

### R0 · 证据

验收报告 PASS-with-issues 全文（§3 NEW-1 lead 探针六行实测表 · NEW-2 lead 核源码基参不一致表 + 代理复现 + realpath 子类 · NEW-3 对照实验 · NEW-9/§2 N9 同格子串顶包构造 · §6.1 四组建议 · §6.2 归 3.0 清单 · §7.3 不开 2.5.0 纪律）；基线 582/581+1skip · pins 17/17 · assets 110/110 · HEAD=3e60c0f（报告 §1 实测值 · 未前置重跑）；全部行号本棒只读复核现值吻合（cli-checks.ts:682 · cli.ts:1003/1098/1108/1125+1299 增量 · cli-host.ts:490/507/524/784 · cli-pins.ts:235 · yaml:60-73/:141）。

### R1 · 范围

修 NEW-1（否定守卫语义判据 + B/D/E fixture + 存量抽验）+ NEW-2（基参统一 + 对偶测试 + host validate 接口面定稿 + :1299 增量）+ NEW-3（HTML 锚点 · 定稿修）+ NEW-9/N9（精确版本锁定 · 10 棒边界正则定稿建议）+ bump 2.4.1 九件套；NEW-4..12 与 N5 显式归 3.0；publish 仅人（tag+push 授权 00）。

### R2 · 方案

- NEW-1 正则：报告原文 `不\S{0,3}通过` **盖不住 D 形态「不 通过」**（空格非 \S）→ 定稿建议 `不.{0,3}通过` / `未.{0,3}通过`（节文本按行评估则 `.` 足够；跨行合并文本用 `[\s\S]` · 30 按实现现状定 · F-P2-04 误伤窗宽兜底）/ `no\s*pass` / `reject`（i 旗标）；判定顺序现状已是否定先于通过（:713/:714 · 30 实读留证）。
- NEW-2 host validate：补 `--target`（additive 默认 cwd）【**10 棒建议采纳** · 与全命令面一致 · 弃「相对 cwd 输出」声明——口径残留即下一处泄漏（N12 病根同族）】；最终 20 审定。
- NEW-2 基参归一：target 经 realpath 双侧归一【采纳 · 堵 /tmp→/private/tmp 子类】；仅 lexical 前缀【弃 · 子类漏网】。
- NEW-9 边界正则：`(?<![0-9A-Za-z._-])X\.Y\.Z(?![0-9A-Za-z._-])`【**10 棒定稿建议** · 拦 v 前缀/修饰符/加长版本号 · 放行反引号包裹】；报告原建议 `(?<![0-9.])`【弃 · 挡不住 `v2.4.0`】；「发布态词+版本同格共现」备选【弃 · 中文态词表脆 · 「规划中」行要另开豁免 · 复杂度高】。
- NEW-3：修（维护者定稿）· 三形态同一判定管线。
- bump 走 2.3.1 已验证链路（手工改 package.json · 不用 npm version · perl 双模式两轮）。

### R3 · 边界

S2 过程档可写（本 task/invoke/review）；`.workbuddy/` 不碰档本体；publish 仅人（tag+push 授权内）；3.0 项一行不碰；assets/ 仅 yaml semantics 声明文字（rebuild 收口）；豁免清单只在「抽验证实波及」时循先例补条目；host validate 补参为 additive 不破坏无参调用。

### R4 · 可测性

NEW-1 B/D/E 三 fixture 红先行 + A/C/F 对照 · NEW-2 grep 0 命中 + 对偶测试两子类 · NEW-3 负向构造 · NEW-9 三负向 + 全量回归 · pins check 机械断言 · 四门全机械可断言。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待 00 代签 · 维护者 2026-09-14 授权）；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 验收报告判 PASS-with-issues · §6.1 建议 2.4.1 修 4 组 · 行号全复核 | no |
| R1 | NEW-1/2/3/9+N9 + bump 九件套 · NEW-4..12/N5 显式归 3.0 | no |
| R2 | 正则修正（\S→.）· host validate 补 --target 建议 · 边界正则定稿建议 · realpath 双侧归一 | no |
| R3 | S2/.workbuddy/publish 仅人/3.0 项/assets 联动边界明示 | no |
| R4 | 负向 fixture ×9 形态 + 机械断言面齐 | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① pin-10（git tag v2.4.1）在 tag 前 pins check / release-tag-identity / pins-consistency 相关处为 tag-gated 设计红（2.3.1 同构 · tag 后复跑须全绿）；② NEW-1 否定正则窗宽 `. {0,3}` 对「不」字远距离误中（如「不再…通过」超 3 字符不中 · 窗内组合如「不行，通过」会中——抽验环节捕获 · F-P2-04 返修窗宽）；③ NEW-9 边界正则对存量行包裹形态（`**` 星号 / 反引号）的兼容依赖全量回归兜底（F-P2-08）；④ host validate 补 --target 属接口面新增（additive · 契约只增不改合规 · CHANGELOG 明示）；⑤ :1299 exit-1 信封纳入为 10 棒增量项（报告未列 · 20 审确认是否同波修）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 先写可失败测试再改实现：① NEW-1 B/D/E 三形态负向 fixture（判未通过 · 修复前真红）；② NEW-2 对偶测试（cwd≠target + symlink/realpath 两子类 · 修复前复现绝对路径泄漏）；③ NEW-3 `<a href>` 负向；④ NEW-9 三负向（9.9.9 同格 v-tag / v 前缀 / -beta 修饰）+ 全量索引行回归。四门回归 + pins check 为验收硬条款。

---

## 提交信息约定

- 修复提交：`fix(2.4.1): ...`（NEW-1 / NEW-2 / NEW-3 / NEW-9 可独立提交 · 逐文件显式 add）
- bump 提交：`chore(release): bump to 2.4.1`（独立提交）
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界
- **不裹挟** `.workbuddy/` 未跟踪档
- **tag+push 由 00 代跑（维护者 2026-09-14 授权）· 禁 publish / deprecate（仅人）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_4_1_patch.md`

---

### 自检结论（执行者）

**30 实现棒回填（2026-09-14）**：

**GATE_VERIFY**：`node bin/specgate.js verify --target . --task docs/tasks/active/task_2_4_1_patch.md` → PASS（闸扫描表 HG-TASK-DRAFT/HG-AUDIT-R1 全 approved · 补落 00 invoke 后三件套齐）。

**红→绿证据**：
- NEW-1：B「不予通过」/ D「不 通过」/ E「NO PASS」+ close 同口径 4 条修复前全真红（exit 0 误绿 · 复现报告探针表 · B/D fixture 首版误含「未通过」字面已修正为干净形态重证红）；修复后全 exit 2 点名「含否定结论词」；对照 A exit 0 / C exit 2 / F exit 2（S1·N=20）零回退。
- NEW-2：对偶 ×6 修复前全真红（① dest=/private/var/... 绝对泄漏 · ② symlink 形态绝对泄漏 · ③ realpath 双侧错配 · ④ host validate 无 --target 用法错 · ⑤ task lint 异目录泄漏 · ⑥ exit-1 信封 message 携绝对 target）；修复后全绿 + 现 21 测零回退（27/27）。
- NEW-3：`<a href="FOO.md">` 修复前 exit 0（复现报告对照实验）→ 修复后 exit 2 指 `README.md:行号 -> FOO.md` · 入 files 转绿。
- NEW-9：三负向修复前真红（9.9.9 同格保留 ``tag `v3.1.4` `` / `` `v3.1.4` `` / `` `3.1.4-beta` `` 旧码全 exit 0 顶包）→ 修复后全 exit 2；正向 `` `3.1.4` published `` PASS · `3.1.4.1`/`3.1.4rc1` 拦。

**存量复测**：NEW-1 放宽后 `evalReviewConclusion` 直评现行 **76 份**审查文（修复前/后双跑 · pass/fail 名单逐字一致 57/19 · **零误伤零豁免** · R1 模拟 0/51 坐实 · 本 task R1 审查文过新闸 dogfood ✓）；NEW-9 现行 `docs/spec/README.md` 全量索引行 `pins check` 回归零误伤（A 组真实仓钉面测绿 · F-P2-08 兜底成立）。

**全门禁读数**：`npm run typecheck` 0 错 · `npm test` **596 tests / 593 pass / 0 意外红 / 1 门控 skip**（基线 582 → 596 只增不红 · 2 条 tag-gated 设计红 = release-tag-identity + pins A 组 pin-10 · 待 tag `v2.4.1` 后复跑须全绿）· `npm run build` ✓ · `npm run test:lib` 6/6 · `pins check` **16/17**（唯一偏差 pin-10 设计红留痕 · F-P2-10）· `assets verify` **110/110**（yaml semantics 双变更 → manifest rebuild ~4 变更收口 · F-P2-13）· 裸 `verify` PASS · `grep -n 'printJson(process.cwd()' src/cli.ts src/cli-host.ts` → **0 命中**。

**bump 簿记**：package.json#version 2.4.0→2.4.1（唯一手工点 · 未用 npm version）· package-lock 同步 · CHANGELOG `## [2.4.1] - 2026-09-14`（待发版口径）· pins fix --yes 对齐 9 落点 · 叙事漂移巡修改回真值 ×4（RELEASING:13 假 published → 待发版真值 · README 双语 :375 published 指针 → 2.4.0 · MIGRATION:3 minor→patch 定性）· 未钉现行版引用联改 README 双语 ×8（:289/:290/:309/:311）· 测试断言联改 8 文件（perl 双模式 · 历史标题与「2.4.0 码」红测留证注释保留）· RELEASING 台账 ×2 + 人 checklist 2.4.1 节（含「publish 仅人 · tag/push 已授权 00 执行」注记 · 改后全量 npm test 已复跑 · F-P2-12）· ACCEPTANCE_2_4_1_patch_2_4_1_zh.md 落盘（三节式照 2.3.1）· spec 索引 2.4.1 patch 收尾行（pin-08 D-SPEC-213-ROW 人工补行 · 状态格 `` `2.4.1` 待发版 `` 点式精确锁定形态）。

**已知未测项**：pin-10 须 tag 后复跑（设计红留痕）；NEW-1 换行形态「不\n通过」漏网（R1 §3-1 裁决留痕 · 归 3.0 语义化议题）。

**Task_KPI%**：见下「### KPI（00）」节。

### KPI（00）

Task_KPI%: 95（验收 14/14 落地（pins 16/17 与 npm test 596/593 含 pin-10 tag-gated 设计红留痕 · 如实不冒充绿）· 红先行纪律执行（NEW-1 B/D/E 三形态 + NEW-2 对偶 ×6 + NEW-3 `<a href>` + NEW-9 三负向修复前全真红复现报告构造 · B/D fixture 污染自首修重证）· NEW-1 存量 76 份直评双跑零误伤零豁免零静默 · NEW-9 全量索引行回归零误伤 · 零发布本体越权（未 tag/push/publish）· 提交边界逐路径 add · 三裁决照 R1 定稿执行）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同 Agent 闭环 · 一次通过无返工（NEW-1 fixture 首版误含「未通过」字面属实现期自发现自修 · 改干净形态即真红）
- 范围守界：仅 task 四项 + bump · 未碰 3.0 项（NEW-4..12/N5）· 未回填 RELEASING「最近一次发版」published 叙事 · 未碰 .workbuddy/ 档本体 · assets/ 仅 yaml semantics 声明文字
- 质量门：typecheck 0 错 · npm test 596 tests/593 pass/0 意外红/1 门控 skip · build/test:lib 6/6 · pins 16/17（pin-10 设计红）· assets 110/110 · gate-check PASS exit 0

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-14 | 初稿 · 10-task（验收报告 §6.1 建议 2.4.1 → NEW-1/NEW-2/NEW-3/NEW-9+N9 四项修复 + bump）· 预填 Harness 元信息 + wiki_delta=none · HG-TASK-DRAFT=approved（00 代签 · 2026-09-14 维护者授权 · 2.3.1 同模式延续）· HG-AUDIT-R1=pending 待 20 审 + 00 代签；行号全量只读复核；两处报告建议修正留证（NEW-1 `\S`→`.` · NEW-9 左边界挡 v 前缀）+ 一处增量发现（cli.ts:1299 exit-1 信封同根） |
| 2026-09-14 | 30 实现棒回填：四项修复 + bump 2.4.1 全落地（自检结论节详见）· 存量波及抽验零误伤零豁免（无需循 W4/2.3.1 先例补豁免条目 · F-P2-05 不适用）· NEW-1 换行形态采 R1 §3-1 裁决「`.` 口径交付 + 换行残余留痕」；红→绿证据与全门禁读数见自检结论节 |
