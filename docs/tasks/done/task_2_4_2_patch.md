# Task：2.4.2 patch · 验收报告 R-1/R-2/R-3 三项修复 + bump（2.4.1 → 2.4.2）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved（00 代签 · 2026-09-15）· 30+40 闭环完成 · 2026-09-15）  
> **关联证据**：验收报告 [`.workbuddy/output/验收报告-SpecWave-2.4.1.md`](../../../.workbuddy/output/验收报告-SpecWave-2.4.1.md) §3.2（R-1 host validate 缺省基 cwd）· §3.1（R-2 `NOT PASS` 漏网 + R-4 窗宽不足 · 行 G/I/J）· §3.3（R-3 无引号 HTML 属性 · pin-16 末行）· §4 残余登记（R-4 建议形态 `不[^。；\n]{0,12}通过`）· §6.1「建议纳入 2.4.2」（**判 PASS-with-issues · 无 P1 · 三条 P2 均小改**）  
> **基线**：spec-wave@2.4.1（已发布 · tag `v2.4.1` ↔ `c89f92d` · registry latest=2.4.1 三向一致 · CI 全绿）· main HEAD=3ef69ad · 596 total / 595 pass / 0 fail / 1 门控 skip · pins 17/17 · assets 110/110 · tarball 188 条卫生 0（验收报告 §1 实测值 · **禁前置重跑全量 npm test**）  
> **发版纪律**：[`RELEASING.md`](../../../RELEASING.md)（本波只做修复 + bump 段；**tag/push/publish/deprecate 仅人**——报告 §6.3 明示 2.4.1 的 tag+push 代跑系 2026-09-14 一次性书面授权 · 不自动延续）  
> **环境警示**（2026-09-15 日志登记 · 报告 §2.1 同型教训）：本机 `/usr/bin/git` 是 Xcode shim 可能 exit 69——git 调用返回 69/异常时用 `PATH="/opt/homebrew/bin:$PATH"` 前置重跑；**裸跑全红须先做对照实验再下结论**（R-6 可诊断性本体归 3.0 W5）  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-4-2-patch` |
| **test_strategy** | `required` |
| **test_strategy_note** | 负向 fixture 先行：R-1 跨目录调用（cwd=/tmp · 缺省 --target → 无绝对路径 · 仓外文件标 `outside_repo: true`）· R-2 `NOT PASS` / `不最终予以通过` / `未能够予以通过` 三形态判未通过 · R-3 `<a href=AGENTS.md>` 无引号形态报红；**R-2 同句共现放宽配存量误伤实测硬条款**（见验收 R-2-c）；四门（typecheck / test / build / test:lib）+ pins check 为验收硬条款；596 用例基线只增不红（tag-gated 设计红留痕口径同前例） |
| **code_quality_bar** | `strict` |
| **invoke_retention_profile** | `default` |
| **required_invoke_hats** | `10,20,30,40,00` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | patch 级缺陷修复 + bump 簿记；不改图谱资产 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 修复性 patch，无规范增量；「git 环境对照实验先行（5 红变 0 红）」教训（报告 §2.1/§7.3）由关账经验总结留痕，晋升 wiki 与否归 20/00 裁定 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | kit 自身发版系列；合入由维护者 push+tag（仅人 · 2.4.1 代跑授权不延续 · 报告 §6.3） |
| **experience_capture** | `recommended` |
| **kpi_rubric** | `KPI_RUBRIC_v1_2` |
| **kpi_aggregator** | `CLOSE` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · **2026-09-15 维护者直接下令「针对性开启 2.4.2」** |
| HG-SPEC-SIGNOFF | **N/A** | — | 无独立 SPEC 夹（属 `2_4-gate-strength` 验收后 patch · 同 2.3.1/2.4.1 先例） |
| HG-TASK-DRAFT | **approved** | 20, 30 | 00 代签（维护者授权 00 代签模式延续） |
| **HG-AUDIT-R1** | **approved** | 30 | 00 代签 · 2026-09-15 · 维护者授权模式延续 · 依据审查文 [`docs/harness/reviews/task_2_4_2_patch_audit_R1_20260915.md`](../../harness/reviews/task_2_4_2_patch_audit_R1_20260915.md)（R1 结论 PASS · 零内容阻塞 · R-2 误伤模拟 0/67+0/76 · 提示级行号漂移 2 处不影响开工） |

---

## 背景与目标

2.4.1 验收报告判 **PASS-with-issues（无 P1）**：四项前修（NEW-1/2/3/9）全部真实落地、主形态均经独立复攻封堵（N9 真闭环 · 存量 76 份审查文波及抽验不静默放过）。残余集中在「覆盖面对齐」三条 P2（§6.1 圈定入 2.4.2）：

- **R-1 [P2]**（§3.2 第 5/7 行）：2.4.1 给 `host validate` 补了 additive `--target`（`src/cli-host.ts:476-484` 一带），但**缺省基仍为 cwd**——`host validate --json` 从 `/tmp` 调用（缺省 `--target`）→ `file` 打印绝对路径 ❌；`--file /private/tmp/…` 同型 ❌。「任何 `--json` 输出不得含绝对路径」规则在缺省调用下仍被违反。修复口径（§6.1）：基参改取 **`--file` 所在仓根**（`findGitRoot` 上溯 · `src/cli-shared.ts:37` · 与 task lint/close 2.4.1 修法同口径）；仓外文件回落保持现有行为并在 JSON 标 **`outside_repo: true`** 而非直接打印绝对路径。
- **R-2 [P2]**（§3.1 行 G + §4 R-4 窗口 · §6.1 R-2 行明说「顺带把 R-4 的窗口放宽为同句共现语义判」· **两处以 §6.1 为准纳入本补丁**）：`REVIEW_NEG_RE`（`src/cli-checks.ts:686` · 2.4.1 形态 `不.{0,3}通过|未.{0,3}通过|no\s*pass|reject|…`）两处残余——`NOT PASS` 未覆盖（G 行实测 PASS ❌）；窗宽 `{0,3}` 不足，`不最终予以通过`（插 4 字）/ `未能够予以通过` 判 PASS ❌（I/J 行）。修复：词表补 `not\s*pass`（i 旗标已有）；`不/未` 两分支窗口从 `{0,3}` 放宽为**同句共现**语义判 `不[^。；\n]{0,12}通过` / `未[^。；\n]{0,12}通过`（§4 R-4 建议形态 · 窗口显式排除 `\n` → **R-5 换行形态维持已登记残余不动 · 归 3.0**）。
- **R-3 [P2]**（§3.3 pin-16 末行）：`htmlARe`（`src/cli-pins.ts:325` · 现行 `/<a\s[^>]*?href\s*=\s*["']([^"']+)["'][^>]*>/gi`）只匹配带引号属性值——`<a href=AGENTS.md>`（合法 HTML5 无引号形态）放行 exit 0 ❌（对照：双引号/单引号/大写/属性序四形态均报红 ✓）。修复：属性值改 `"([^"]+)"|'([^']+)'|([^\s>]+)` 三选一。

**完成态行为**：`host validate --json` 缺省调用跨目录不泄漏绝对路径（仓外文件标 `outside_repo: true`）；`NOT PASS` 与插 4 字否定形态判未通过且存量审查文误伤实测留痕；pin-16 三形态 HTML 属性值全覆盖；package.json#version=2.4.2 且 pins 对齐、CHANGELOG `## [2.4.2] - 2026-09-15` 节落账；四门绿。

---

## 范围

- [x] **修 R-1 [P2] host validate 缺省基**：
  - `src/cli-host.ts` `cmdHostValidate`（`:463-545`）三面 printJson（解析失败 `:495` · issues 失败 `:512` · PASS `:529`）+ 人类输出 `toRel(process.cwd(), abs)`（`:543`）的基参统一改取 **`--file` 所在仓根**：`findGitRoot(path.dirname(abs))`（`src/cli-shared.ts:37` 既有实现）上溯；`--target` 显式传入时仍以 target 为准（2.4.1 接口面不动）
  - **仓外文件**（findGitRoot 上溯为 null）：回落保持现有行为（校验照常进行），JSON 输出 `file` 字段改占位/相对化不可得时**标 `outside_repo: true`**（键集只增 · 合规），**不直接打印绝对路径**；人类输出同口径（占位 + 提示）
  - 负向 fixture（红测先行）：cwd=`/tmp` 靶场 · 缺省 `--target` 调 `host validate --json --file <仓内示例表绝对路径>` → 修复前 `file` 为绝对路径（复现 §3.2 第 5 行）· 修复后为仓内相对路径；仓外文件用例 → JSON 含 `outside_repo: true` 且无绝对路径
  - 既有用例零回退（含 2.4.1 补的 `--target` 用例 · emitHostFail 基参透传面 `:781-799` 核查同步）
- [x] **修 R-2 [P2] 否定词表 + 同句共现窗口**：
  - `src/cli-checks.ts:686` `REVIEW_NEG_RE` 补 `not\s*pass`（i 旗标沿用）；`不.{0,3}通过` / `未.{0,3}通过` 两分支放宽为 `不[^。；\n]{0,12}通过` / `未[^。；\n]{0,12}通过`（同句共现 · 窗宽 12 · 显式排除 `。；\n`）
  - 负向 fixture（红测先行 · 复现报告 §3.1 行）：G `NOT PASS` → 判未通过 · I `不最终予以通过` → 判未通过 · J `未能够予以通过` → 判未通过；对照零回退：A（合法通过）PASS · B/D/E/L（`不予通过`/`不 通过`/`NO PASS`/`rejected`）仍 FAIL · F（只写「通过」）仍 FAIL · M（否定+通过并存）仍 FAIL · K（`不\n通过` 换行）**维持 PASS 漏网**（R-5 已登记归 3.0 · 窗口排除 `\n` 即此口径 · 不得顺手修）
  - **存量误伤实测（硬条款 · 见验收 R-2-c）**：`evalReviewConclusion` 直评 `docs/tasks/done/` 全量 + `docs/harness/reviews/` 现行件；误伤超阈值 → 回退保守档并留痕（阈值与处置口径见验收节）
  - **dogfood**：本 task 自己的 R1 审查文须过新闸
- [x] **修 R-3 [P2] pin-16 无引号 HTML 属性**：
  - `src/cli-pins.ts:325` `htmlARe` 属性值改三选一 `"([^"]+)"|'([^']+)'|([^\s>]+)`；**注意捕获组从单组变三组**——消费点（`:336` 现取 `m[1]` 且注释「捕获组 1 必参与（E5 收窄）」）须改 `m[1] ?? m[2] ?? m[3]` 取值并更新该注释（E5 收窄语义随结构联改 · TEST-LOCK）
  - `assets/release-pins.yaml` pin-16 `semantics` 声明同步（HTML 锚点含无引号形态 · 数据声明与实现一致 · D-23-W2-CHECK-FORM 纪律）+ manifest rebuild 联动（`assets manifest rebuild --yes` + `assets verify` 收口 · 2.4-W4 既有流程）
  - 负向 fixture（红测先行）：`<a href=AGENTS.md>`（白名单外仓根级存在）→ 修复前 `pins check` exit 0（复现 §3.3 末行）· 修复后 **exit 2**；对照（入白名单）转绿；带引号/大写/属性序四形态既有用例零回退
- [x] **bump 2.4.2**（参照 c89f92d / 268ca21 先例）：
  - `package.json#version` → `2.4.2`（**唯一手工版本改动点** · 不用 npm version 防顺手 tag）
  - CHANGELOG 发布头 `## [2.4.2] - 2026-09-15` 先落盘（Fixed 三项 · 发布状态写「待发版」口径 · 不冒充已 published）
  - `node bin/specgate.js pins fix --yes` 对齐钉面 → pin-10「git tag v2.4.2 缺失」**设计红留痕**（待人打 tag 后复跑须 17/17 · 口径同 2.4.1）
  - 机械替换造成的 published 叙事漂移行巡检改回真值口径（2.3.1/2.4.1 经验）
  - pins 未钉的现行版本引用与测试版本断言联改留痕（perl 双模式两轮覆盖字面+转义形态 · 2.3.1 教训）
  - RELEASING 台账 + 人 checklist 2.4.2 节【**双重敏感**：改后全量 npm test】
  - ACCEPTANCE_2_4_2 验收台账档落 `docs/roadmap/` + `docs/spec/README.md` 索引行（pin-08 精确锁定判据下状态格 `` `2.4.2` `` 点式 + 发布态词 · 2.4.1 已验证形态沿用）
  - **tag / push / publish / deprecate 仅人**（2.4.1 代跑授权不延续 · 报告 §6.3）

## 非范围

| 项 | 理由 |
|----|------|
| R-4 超窗形态之外的判据语义化（pin-17 伪表行 NEW-4 · S1·N=20 非语义闸 NEW-5 · NEW-10/NEW-11） | 归 3.0 W4（报告 §6.2 · PLAN_3_0 已启动） |
| R-5（`不\n通过` 换行形态） | **已登记归 3.0**（2.4.1 R1 §3-1 裁决留痕 · 本波窗口显式排除 `\n` 即维持此口径 · 不得顺手修） |
| R-6（git 可诊断性 · extract_error 分档 / 套件前置探测）· NEW-6/7/8/12 | 归 3.0 W5（报告 §6.2）；本波仅在 task 头部与环境警示中登记 shim/exit 69 处置口径 |
| pin-08 版本↔发布态绑定（§3.3 C 形态：边界完整 `2.4.1` 任意位置即合格） | 归 3.0 W4（报告 §3.3 注记 + §6.2 · 判据语义化议题） |
| pin-16 语义面（白名单外且不存在目标不判等） | 归 3.0 W4 |
| 对外口径调整 / 物料 | 2.4.0 W5 已落地 · 本 patch 不返工 |
| `git tag` / `push` / `npm publish` / `npm deprecate` | **仅人**（报告 §6.3 · 2.4.1 的 tag+push 代跑系一次性授权不延续） |
| RELEASING.md「最近一次发版」表叙事回填 | 待维护者 publish 后回填（避免冒充已发布） |
| host-adapt schema / pins 引擎架构 | 触 schema 即 STOP |
| assets/ 资产本体内容修改 | 仅 pin-16 yaml semantics 声明文字（R-3 联动 · rebuild 收口）；其余零触碰 |

---

## 失败路径

| 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----------|----------|--------|----------|
| HG-AUDIT-R1=pending 即 30 改码（F-P3-01） | 30 **拒开工**（verify 机械拦 exit 2） | 是（20 审 + 00 签后） | 是 |
| 越权执行 tag/push/publish/deprecate（F-P3-02） | 违禁令 · 打回（本波四动作全仅人 · 2.4.1 代跑授权不延续） | — | 是 |
| `git add -A` 裹挟域外档（F-P3-03） | 打回（撤 stage 逐文件显式 add） | 是 | — |
| R-2 同句共现放宽误伤存量合法审查文（措辞巧合如「不再…通过」句内共现）（F-P3-04） | 存量实测捕获 → 误伤 ≤ 阈值逐份核因处置留痕；**超阈值回退保守档**（`{0,3}` + 仅补 `not\s*pass`）· 同句共现归 3.0 W4 · 回退决策与实测数据入 task 修订记录 + reviews/ 留痕 | 是 | 是 |
| 存量波及未处置即关账（新判据打红存量却静默放过）（F-P3-05） | 违 W4/2.3.1/2.4.1 先例 · 打回 | 是（循豁免/处置先例） | 是 |
| 负向 fixture 误绿（fixture 未命中目标形态 · 如无引号 fixture 误写成带引号）（F-P3-06） | 红测不红 = 无效测试 · 打回 | 是 | — |
| R-3 捕获组变三组后消费点漏改（`m[1]` 对无引号形态为 undefined）（F-P3-07） | 测试钉死三形态取值（`m[1] ?? m[2] ?? m[3]`）· E5 收窄注释联改 | 是 | — |
| R-1 仓外文件占位口径与既有 `--target` 用例冲突（F-P3-08） | `--target` 显式传入优先（2.4.1 接口面不动）· 既有用例零回退为验收 | 是 | 是 |
| 四门任一红（F-P3-09） | 停止 · 先修再发（RELEASING ②） | 是 | 是 |
| pin-10「git tag v2.4.2 缺失」设计红误判为代码回归（F-P3-10） | 留痕说明 · 待人打 tag 后复跑 | 是 | — |
| 顺手扩范围修 3.0 项（R-5/R-6/NEW-4..12/pin-08 语义绑定）（F-P3-11） | 打回（R-5 换行形态**不得顺手修** · 见范围 R-2 对照口径） | — | — |
| RELEASING 台账 + 人 checklist 2.4.2 节改动后未跑全量 npm test（F-P3-12 · 双重敏感条款） | 验收 FAIL · 补跑 | 是 | — |
| yaml semantics 改动后忘 manifest rebuild（assets verify 转红）（F-P3-13） | rebuild --yes + verify 收口（既有流程） | 是 | 是 |
| git shim exit 69 致 pins/测试裸跑全红被误判产品回归（F-P3-14 · 环境警示条款） | **先做对照实验**：`PATH="/opt/homebrew/bin:$PATH"` 前置重跑；仍红才定性产品问题（报告 §2.1 教训 · R-6 本体归 3.0） | 是 | 是 |

---

## 验收标准

- [x] **R-1-a 负向（红测先行）**：cwd=/tmp 靶场 · 缺省 `--target` 调 `host validate --json --file <仓内示例表绝对路径>` → 修复前 `file` 绝对（复现 §3.2 第 5 行）· 修复后仓内相对路径；`--file /private/tmp/…` 同型修复
- [x] **R-1-b 仓外文件**：`--file` 指仓外文件 → JSON 含 `outside_repo: true` 且输出无绝对路径（占位口径）；校验行为本身不回退
- [x] **R-1-c 零回退**：`--target` 显式用例（2.4.1 补）与缺省 cwd=仓根用例全绿；`grep -c 'printJson(process.cwd()' src/cli.ts src/cli-host.ts` 维持 0/0
- [x] **R-2-a 负向 ×3（红测先行）**：`NOT PASS` / `不最终予以通过` / `未能够予以通过` → `verify --task` **exit 2**（复现报告 §3.1 行 G/I/J）；`task close` 同口径 BLOCKED
- [x] **R-2-b 对照零回退**：A PASS · B/D/E/L FAIL · F FAIL · M FAIL · **K（`不\n通过`）维持 PASS 漏网**（R-5 已登记 · 窗口排除 `\n` 口径断言入测防顺手修）
- [x] **R-2-c 存量误伤实测（硬条款）**：`evalReviewConclusion` 直评 `docs/tasks/done/` 全量 + `docs/harness/reviews/` 现行件（2.4.1 已抽验 76 份为先例 · 本次全量）；**判定口径**：① 原 PASS 改判 FAIL 且核因为**真实否定语义**（如退回/未通过史）→ 不算误伤 · 属闸变严正确拦截 · 逐份核因留痕循豁免先例处置；② 核因为**措辞巧合**（合法通过文被同句共现误中）→ 记误伤；**阈值：措辞巧合误伤 > 3 份 → 回退保守档**（`{0,3}` 窗口保留 + 仅补 `not\s*pass` · 同句共现归 3.0 W4 · 回退决策+实测数据入本 task 修订记录与 reviews/ 留痕）；≤ 3 份 → 逐份处置（修措辞或收窄窗口/排除字符集）留痕。实测样本数与核因表落自检结论
- [x] **R-2 dogfood**：本 task R1 审查文自身过新闸
- [x] **R-3 负向（红测先行）**：`<a href=AGENTS.md>`（白名单外）→ 修复前 `pins check` exit 0（复现 §3.3 末行）· 修复后 **exit 2** 指 `文件:行号`；对照入白名单转绿；带引号（双/单）/大写/属性序四形态零回退；三捕获组取值有测（F-P3-07）；yaml semantics 声明与实现一致
- [x] **bump**：`package.json#version` = `2.4.2`（唯一手工点）· CHANGELOG 含 `## [2.4.2] - 2026-09-15` 节 · RELEASING 台账 + 人 checklist 2.4.2 节 · ACCEPTANCE_2_4_2 档 · spec 索引行 · assets manifest rebuild 后 `assets verify` 全绿
- [x] `node bin/specgate.js pins check` → 16/17，唯一偏差 = pin-10 git tag v2.4.2 缺失（**设计红** · 待人打 tag 后复跑须 17/17 · 口径同 2.4.1）
- [x] 四门全绿：`npm run typecheck` 0 错 · `npm test`（基线 596 只增不红 · tag-gated 设计红留痕口径同前例）· `npm run build` · `npm run test:lib`
- [x] 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_4_2_patch.md` → exit 0（PASS）+ `task close --yes` 闭环
- [x] 提交边界：`git diff --cached` 可证无裹挟；未执行 tag / push / publish / deprecate（仅人）

---

## 给执行帽的必读列表

1. 验收报告 [`.workbuddy/output/验收报告-SpecWave-2.4.1.md`](../../../.workbuddy/output/验收报告-SpecWave-2.4.1.md) §2.1（环境对照实验）· §3.1/§3.2/§3.3 · §4 残余登记 · §6.1/§6.2/§6.3（只读结论 · 不碰档本体）
2. `src/cli-host.ts`（cmdHostValidate :463-545 · 三面 printJson :495/:512/:529 · target 解析 :484 · 人类输出 :543 · emitHostFail :781-799）· `src/cli-shared.ts`（findGitRoot :37 · printJson/relativizeOutputValue）
3. `src/cli-checks.ts`（REVIEW_NEG_RE :686 · 否定判定 :717 · evalReviewConclusion 函数体）
4. `src/cli-pins.ts`（htmlARe :325 · 消费点 :336）· `assets/release-pins.yaml` pin-16 semantics
5. done task [`task_2_4_1_patch.md`](../done/task_2_4_1_patch.md)（否定守卫放宽 + 存量 76 份抽验 + bump 链路先例）· [`task_2_3_1_patch.md`](../done/task_2_3_1_patch.md)（存量波及处置先例）
6. `RELEASING.md` 硬步骤（bump 段 · 人 checklist · 2.4.1 硬步骤⑥原子推规则参考）
7. `docs/standards/` 涉码 L2（30 自裁引用）

---

## 思考轮

### R0 · 证据

验收报告 PASS-with-issues 全文（§0 无 P1 · §2.1 环境对照实验（git shim exit 69 · 5 红变 0 红）· §3.1 行 G/I/J/K · §3.2 第 5/7 行 + commit 自述「缺省 cwd 零回退」· §3.3 pin-16 末行 + pin-08 C 形态注记 · §4 R-4 建议形态 · §6.1 三条 · §6.2 归 3.0 清单（PLAN_3_0 W4/W5 已挂）· §6.3 tag/push/publish 仅人）；基线 596/595+1skip · pins 17/17 · assets 110/110 · HEAD=3ef69ad（报告 §1 实测值 · 未前置重跑）；行号本棒只读复核现值吻合（cli-host.ts:463-545/:495/:512/:529 · cli-shared.ts:37 · cli-checks.ts:686 · cli-pins.ts:325/:336）。

### R1 · 范围

修 R-1（findGitRoot 基参 + outside_repo 占位）+ R-2（`not\s*pass` + 同句共现窗口 · §6.1 口径优先于 §4 登记）+ R-3（无引号属性值三选一）+ bump 2.4.2 九件套；R-5/R-6/pin-08 语义绑定/NEW-4..12 显式归 3.0（R-5 不得顺手修 · K 形态断言钉死）；tag/push/publish/deprecate 仅人（2.4.1 代跑授权不延续）。

### R2 · 方案

- R-1：基参取 `--file` 所在仓根 findGitRoot 上溯【采纳 · §6.1 原案 · 与 task lint/close 2.4.1 修法同口径】；仓外文件标 `outside_repo: true` 占位【采纳 · §6.1 原案 · 键集只增合规】；缺省维持 cwd 仅文档声明【弃 · 即 R-1 病根本身】；`--target` 显式优先不动（2.4.1 接口面）。
- R-2：窗口 `不[^。；\n]{0,12}通过` / `未[^。；\n]{0,12}通过`【采纳 · §4 R-4 建议形态 + §6.1 纳入指令 · 排除 `\n` 维持 R-5 登记口径】；广义否定词表整体重构【弃 · 归 3.0 W4】；放宽配存量误伤实测 + 回退阈值（>3 份措辞巧合误伤 → 保守档）【采纳 · 维护者明令条款】。
- R-3：三选一属性值【采纳 · §6.1 原案】；捕获组三组取值 `m[1] ?? m[2] ?? m[3]` + E5 注释联改（F-P3-07 TEST-LOCK）。
- bump 走 2.4.1/2.3.1 已验证链路（手工 package.json · perl 双模式两轮 · 双重敏感全量 npm test）。

### R3 · 边界

S2 过程档可写（本 task/invoke/review）；`.workbuddy/` 不碰档本体；发布四动作仅人（无代跑授权延续）；3.0 项一行不碰（R-5 换行形态断言钉死防顺手修）；assets/ 仅 pin-16 semantics 声明文字（rebuild 收口）；豁免清单只在实测波及时循先例补条目；git shim 环境坑先对照实验再定性。

### R4 · 可测性

R-1 双负向（跨目录/仓外）+ grep 0/0 · R-2 三负向 + 七对照（含 K 漏网断言）+ 全量误伤实测阈值判 · R-3 负向 + 四形态回退 + 三组取值 · pins check 机械断言 · 四门全机械可断言。

### R5 · 签收就绪

草稿预置五槽完毕；充分性由 20-task-audit R1 复核（HG-AUDIT-R1 待 00 代签 · 维护者授权模式延续）；residual_risks 见控制表下。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 验收报告判 PASS-with-issues 无 P1 · §6.1 三条入 2.4.2 · 行号全复核 | no |
| R1 | R-1/R-2/R-3 + bump 九件套 · R-5/R-6/语义化项显式归 3.0 | no |
| R2 | findGitRoot 基参 + outside_repo 占位 · 同句共现窗口 + 误伤回退阈值 · 三选一属性值 | no |
| R3 | S2/.workbuddy/发布仅人/R-5 钉死/git 环境对照边界明示 | no |
| R4 | 负向 fixture ×6 形态 + 误伤实测阈值判 + 机械断言面齐 | no |
| R5 | 待 20 审 R1 裁定充分性 | no |

**residual_risks**：① pin-10（git tag v2.4.2）在维护者打 tag 前 pins check / release-tag-identity / pins-consistency 相关处为 tag-gated 设计红（2.4.1 同构 · 打 tag 后复跑须全绿）；② R-2 同句共现窗宽 12 与排除字符集（`。；\n`）对英文审查文的覆盖边界（英文句号 `.` 未排除 · 跨句误中风险由存量实测捕获 · F-P3-04 阈值兜底）；③ R-1 仓外文件占位口径改变 JSON `file` 字段值形态（绝对 → 占位 · 值级修复定性同 D-23-JSON-TARGET-REL 先例 · CHANGELOG 明示）；④ git shim exit 69 在本机的复发风险（F-P3-14 对照实验条款 · R-6 本体归 3.0 W5）。

---

## 测试策略（Harness）

**test_strategy**: `required` —— 先写可失败测试再改实现：① R-1 跨目录 + 仓外文件双负向（修复前复现绝对路径泄漏）；② R-2 三负向（NOT PASS / 插 4 字两形态）+ 七对照（含 K 换行漏网断言 · 防顺手修 R-5）；③ R-3 无引号属性负向 + 三捕获组取值测；④ R-2 存量误伤实测（done 全量 + reviews 现行件 · 阈值判与回退路径）。四门回归 + pins check 为验收硬条款。

---

## 提交信息约定

- 修复提交：`fix(2.4.2): ...`（R-1 / R-2 / R-3 可独立提交 · 逐文件显式 add）
- bump 提交：`chore(release): bump to 2.4.2`（独立提交）
- **禁 `git add -A`**：逐文件显式 add；`git status --porcelain` 全程审边界
- **不裹挟** `.workbuddy/` 未跟踪档
- **禁 tag / push / publish / deprecate（仅人 · 2.4.1 代跑授权不延续）**
- 波末跑 `npx spec-wave gate-check --task docs/tasks/active/task_2_4_2_patch.md`

---

### 自检结论（执行者）

**30 实现棒回填（2026-09-15）**：

**GATE_VERIFY**：`node bin/specgate.js verify --target . --task docs/tasks/active/task_2_4_2_patch.md` → PASS（闸扫描表 HG-TASK-DRAFT/HG-AUDIT-R1 全 approved · 补落 00 invoke 后三件套齐）。

**红→绿证据**：
- R-1：三负向修复前真红 —— ① cwd=/tmp 靶场缺省调用 `file: /Users/.../mvp-hosts.yaml` 绝对泄漏（复现 §3.2 第 5 行原文形态）· ② realpath 同型（temp 仓 .git + realpath 入参）· ③ 仓外文件缺 outside_repo 标；修复后 file 仓内相对形 / 仓外标 `outside_repo: true` + basename 占位无绝对路径 · R-1-c 对照（--target 显式 + 缺省 cwd=仓根 + 人类输出）全程绿。
- R-2：G「NOT PASS」/ I「不最终予以通过」/ J「未能够予以通过」修复前全 exit 0 误绿（复现 §3.1 行 G/I/J）→ 修复后全 exit 2 点名「含否定结论词」· close 同口径 BLOCKED；对照 A PASS · B/D/E/L/M 仍 FAIL · F 仍 FAIL（S1·N=20）· **K「不\n通过」维持 PASS 漏网断言入测**（R-5 归 3.0 · 防顺手修）。
- R-3：`<a href=AGENTS.md>` 无引号修复前 exit 0（复现 §3.3 末行）→ 修复后 exit 2 指 `README.md:行号 -> AGENTS.md` · 入 files 转绿；双引号/单引号/大写/属性序 + 无引号混合各指行号（三捕获组取值实测 · F-P3-07）；既有用例零回退。

**R-2-c 存量误伤实测（硬条款）**：evalReviewConclusion 全判定链直评双跑快照逐字 diff —— A 面 done task 全量最新审查文 **总量 72（5 份无审查文 · 实评 67）** · B 面 reviews 全件 **77 份**（含本 task R1 审查文 dogfood ✓）；**结果 IDENTICAL 零翻转**：措辞巧合误伤 **0** · 真实否定语义翻转 **0**（远低于 >3 份回退阈值 · 无需回退保守档 · F-P3-04/05 不适用）；R1 预判模拟（0/67+0/76）坐实（B 面 77 = 模拟 76 + 本 task R1 审查文新增 1）。临时脚本用后已删。

**全门禁读数**：`npm run typecheck` 0 错 · `npm test` **607 tests / 604 pass / 0 意外红 / 1 门控 skip**（基线 596 → 607 = +11 新测 · 2 红 = tag-gated 设计红 release-tag-identity + pins A 组 pin-10 · F-P3-10 留痕）· `npm run build` ✓ · `npm run test:lib` 6/6 · `pins check` **16/17**（唯一偏差 pin-10 设计红）· `assets verify` **110/110**（pin-16 semantics 变更 → manifest rebuild ~4 变更收口 · F-P3-13）· 裸 `verify` PASS · `gate-check` exit 0 · `grep -c 'printJson(process.cwd()' src/cli.ts src/cli-host.ts` 维持 0/0。

**bump 簿记**：package.json#version 2.4.1→2.4.2（唯一手工点 · 未用 npm version）· package-lock 同步 · CHANGELOG `## [2.4.2] - 2026-09-15`（待发版口径 · 发布边界全仅人明写）· pins fix --yes 对齐 9 落点 · 叙事漂移巡修改回真值 ×4（RELEASING:13 假 published→待发版 · README 双语 :375 published 指针→2.4.1 · MIGRATION:3 定性联改）· README 未钉引用联改 ×8（:289/:290/:309/:311）· 测试断言联改 8 文件（perl 双模式 · 历史标题与「2.4.1 码」红测留证注释保留）· RELEASING 台账 ×2 + 人 checklist 2.4.2 节（含发布边界注记 + 原子推教训保持 · 改后全量 npm test 复跑 · F-P3-12）· ACCEPTANCE_2_4_2 档（三节式）· spec 索引 2.4.2 patch 收尾行（pin-08 边界正则下 `` `2.4.2` 待发版 `` 形态实测过闸）。

**已知未测项**：pin-10 须 tag 后复跑（设计红留痕）；R-5 换行形态维持漏网（登记归 3.0）；git shim exit 69 本波未复发（F-P3-14 条款在位未触发）。

**Task_KPI%**：见下「### KPI（00）」节。

### KPI（00）

Task_KPI%: 95（验收 15/15 落地（pins 16/17 与 npm test 607/604 含 pin-10 tag-gated 设计红留痕 · 如实不冒充绿）· 红先行纪律执行（R-1 ×3 + R-2 ×3 + R-3 ×2 修复前全真红复现报告构造）· R-2-c 存量 67+77 份双跑零翻转零误伤零静默 · K 形态漏网断言钉死未顺手修 R-5 · 零发布本体越权（tag/push/publish/deprecate 全仅人）· 提交边界逐路径 add · 三裁决照 R1 定稿执行）

- rubric：`KPI_RUBRIC_v1_2` · 30+40 同 Agent 闭环 · 一次通过无返工（R-2 fixture 描述行含「未通过」字面的 2.4.1 教训未复发 · 本波 fixture 一次成干净形态）
- 范围守界：仅 task 三项 + bump · 未碰 3.0 项（R-5/R-6/pin-08 绑定/NEW-4..12）· 未回填 RELEASING「最近一次发版」published 叙事 · 未碰 .workbuddy/ 档本体 · assets/ 仅 pin-16 semantics 声明文字
- 质量门：typecheck 0 错 · npm test 607 tests/604 pass/0 意外红/1 门控 skip · build/test:lib 6/6 · pins 16/17（pin-10 设计红）· assets 110/110 · gate-check PASS exit 0

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-15 | 初稿 · 10-task（验收报告 §6.1 建议 2.4.2 → R-1/R-2/R-3 三项修复 + bump）· 预填 Harness 元信息 + wiki_delta=none · HG-TASK-DRAFT=approved（00 代签 · 维护者授权模式延续）· HG-AUDIT-R1=pending 待 20 审 + 00 代签；行号全量只读复核（cli-host.ts:463-545 · cli-shared.ts:37 · cli-checks.ts:686 · cli-pins.ts:325/:336）；R-2 误伤实测阈值条款落表（>3 份措辞巧合误伤 → 回退保守档留痕）；R-5 换行形态「不得顺手修」K 断言钉死；发布四动作仅人（2.4.1 代跑授权不延续 · 报告 §6.3）；git shim exit 69 环境警示落头部 + F-P3-14 |
| 2026-09-15 | 30 实现棒回填：三项修复 + bump 2.4.2 全落地（自检结论节详见）· R-2-c 存量误伤实测 67+77 份双跑零翻转（远低于 >3 回退阈值 · 无需回退保守档 · 无需豁免）· K 形态漏网断言钉死（R-5 未顺手修）· 发布四动作全仅人未越权 |
