# Task Audit R1：2.3.1 patch · N1/N11/N13 三项修复 + bump（task_2_3_1_patch）

> **task**：`docs/tasks/active/task_2_3_1_patch.md`（slug: `2-3-1-patch`）
> **证据来源**：`.workbuddy/output/验收报告-SpecWave-2.3.0.md`（2.3.0 验收判 PASS-with-issues · §3.B/§3.L/§3.N · §6「建议 2.3.1」）
> **日期**：2026-09-14
> **角色**：20-task-audit（书面审 · 未改 src / test / assets / .github / package.json · 未改 task 实质内容）
> **帽条文**：`assets/harness/prompts/20-task-audit.md`
> **格式样板**：`docs/harness/reviews/task_2_2_1_patch_audit_R1_20260912.md`（2.2.1 R1 同模式）

---

## 结论摘要

| 维度 | 判定 |
|------|------|
| **内容审查** | **pass · 零内容阻塞 → 签收（本轮为终轮）** |
| **流程闸** | `HG-AUDIT-R1 → approved`（人 · 2026-09-12 维护者会话授权 00 代签 · 2.3.1 同模式延续 · 00 代签落表 · 本审查文 R1 pass） |
| **思考轮审查（阶段 C）** | R0–R5 控制表齐 · 回填闭合 · early_stop 全 no 合理（草稿预置五槽 · R5 充分性留待本审裁定） |
| **下一棒** | 闸已落表 → GATE_VERIFY → 30（30 开工前 `verify --task` 过闸） |

---

## 核对项

| # | 核对点 | 结论 |
|---|--------|------|
| 1 | **范围 4 项 = 报告 §6「建议 2.3.1」逐项对应**：N1 [P1] 六件套（.gitignore `*.bak` · files `"!assets/**/*.bak"` · prepublishOnly 机械断言 failClosed · pins fix 备份策略 · 删本机 7 .bak · pack dry-run 自证）= §6 N1 行 ①②③④ + §3.B 建议 1-3 全覆；N11 [P1] 强制结论节 + A2 负向 fixture = §6 N11 行原案；N13 [P2] 显式类型判 `typeof x === 'string' && x.length > 0` = §6 N13 行原案（连判定式都逐字一致） | ✅ 三项与 §6 建议表一一对应 |
| 2 | **非范围显式排除报告 §6「建议 2.4」全部**：N7（pin-16 refstyle）/ N8（pin-17 表行）/ N9（pin-08 语义格位）/ N12（输出层相对化）/ N2/N5 / N3 / N10/N6/N14 / N4 全列归 2.4；另收边 tag/push/publish/deprecate 仅人 · RELEASING 叙事不回填 · `.workbuddy/` 档本体不碰 · 存量 59 份逐份全量摸底（铁律③）· assets/ 资产本体 | ✅ 与 §6 节奏一致 |
| 3 | **验收 16 条全机械可断言**：check-ignore exit 0 · files 否定项在档 · trap.bak 负向 failClosed 自证（造 .bak → exit 非 0 → 清除 → exit 0）· fix 后无新增 .bak · find 0 命中 · pack .bak=0 且 GLOSSARY/MIGRATION 不回归 · A2 形态 exit 2 + 双对照 · 存量推断落修订记录 + 抽验落自检表 · dogfood 自证 · N13 双 fixture · bump 五落点 · pins 16/17（pin-10 tag-gated 设计红口径同 2.2.1）· 四门绿（534 只增不红）· gate-check exit 0 · 提交边界可证无裹挟 | ✅ 无「改完了」式条款 |
| 4 | **failure_paths 12 行（F-P2-01–12）**：开工闸拦截 · 越权发布 · git add -A 高危窗 · **结论节形态枚举误伤（F-P2-04 · N11 收紧的最大退化方向）** · 存量波及静默放过 · fixture 误绿 · GLOSSARY/MIGRATION 误排除 · **自动清理误删非自写 .bak（F-P2-08）** · 四门红停止 · pin-10 设计红不误判 · 不扩 2.4 · RELEASING 双重敏感必跑全量 test | ✅ 覆盖三项修复各自退化方向 + 簿记/纪律边界 |
| 5 | **思考轮 R0–R5 闭合（阶段 C）**：控制表六轮结论齐 · R0 证据（报告全文 + 00 给定基线 + 7 .bak 已 git status 实证）· R1 范围 · R2 方案（备份自动清理【采纳】并给出对忽略区方案的否决理由 · 逐份摸底【弃】注明前两棒停滞根因 · N13 schema 校验【弃】过度工程）· R3 五条边界 · R4 可测性 · R5 待本审裁定 | ✅ |
| 6 | **锚点技术核验（重点 · 实读源码复核）**：① `src/cli-checks.ts:700` `const text = chunks.length > 0 ? chunks.join('\n') : content` —— 回退全文行**属实**，与 §3.L 根因描述逐字吻合；结论节标题正则 `REVIEW_SECTION_HEAD_RE`（:678）枚举 `#{2,3} + 中文序号前缀 + (结论|签收)` 形态，F-P2-04 残余风险成立且 task 已给 30 兜底指引（30 先读实现确认存量形态全集 + 抽验捕获）② `src/cli-checks.ts:739` `if (!e || !e.slug || !e.reason || !e.date || !e.authorized_by)` —— falsy 判**属实**，`authorized_by: 00` 无引号 → YAML 整型 0 → `!0===true` → invalid 静默失效，与 §3.N 机制吻合 ③ `src/cli-pins.ts:585` `copyFileSync(abs, abs + '.bak')` —— .bak 写盘点**属实**，同文件聚合（:578-588 只写一次只备份一次）语义在案，N1-d 改动须保持聚合语义，task 验收条款已钉「既有 pins 测试零回归」 | ✅ 三锚点全部属实 · 指引充分 |
| 7 | **禁 tag/push/publish（仅人）条款在档**：非范围行 + F-P2-02 + 提交信息约定三处一致；bump 走手工改 package.json 不用 npm version 防顺手 tag | ✅ |
| 8 | **pre-30 invoke 三件套（required ∩ {10,20,00}）**：10、00 已落盘（`invoke_20260914_{10,00}_2-3-1-patch.md`）；本棒补 20 invoke → 三棒齐；元信息字段齐（task_slug / test_strategy=required+note / required_invoke_hats=`10,20,30,40,00` / graph_delta=none / wiki_delta=none / close_pr_policy=exempt） | ✅（本审查文落盘同棒补齐） |
| 9 | **N11 存量波及处置口径合规**：task 明示「不做逐份全量摸底」（采信 W4 入档数据 49/54=90.7% · 5 份 1x 波纯表格结论节已在 `legacy-gate-exempt.yaml` reviews 节豁免 —— 本审已实读该 yaml 核实 10 条 reviews 豁免 + 17 条 invoke_hats 豁免在案）+ 30 阶段抽验 5-8 份 + 波及循 W4 先例（豁免清单补条目或 done warn 降级 · **不得静默放过** · 处置留痕入修订记录）—— 与 SPEC 04 §5.4「闸新行为不追溯存量」机制（D-23-W4-TRANSITION）同构 | ✅ 处置路径有先例可循 |
| 10 | **dogfood 条款自洽**：本审查文自身含「## 结论摘要」节（命中 `REVIEW_SECTION_HEAD_RE` 的 `结论` 起首形态）且通过词「pass · 零内容阻塞 → 签收」落在该节内 —— 新闸（强制结论节）下本文仍可机读通过，dogfood 成立 | ✅ |

## 内容阻塞

**无。**

## 非阻塞观察（不影响签收 · 留痕备查）

1. **N1-d 备份策略 R2 已定稿「成功后自动清理」**，task 行文写「倾向…R2 详判后定稿」保留了 30 实现期微调余地；若 30 实读后改采「写忽略区」，须在修订记录留痕改判理由（F-P2-08 边界不变：只清/只写本次自生产物）。不构成退回。
2. **REVIEW_PASS_RE 含裸「通过」二字**，新闸下「结论节内只写『通过』二字」仍可机读过闸 —— 即 A2 绕过面从「全文任意位置」收窄为「结论节内」。验收报告 §6 N11 行建议原文即「强制结论节 + 通过词落结论节内 + A2 负向 fixture」，task 范围忠实于该建议；是否进一步要求「结论节须有实质内容」属强度增强，归 2.4 权衡，本 patch 不扩。留痕备查。
3. **prepublishOnly 断言形态**（独立 script 文件 vs inline node -e）task 未钉死，归 30 实现裁量；验收条款（trap.bak 负向自证三模式 + GLOSSARY/MIGRATION 不回归）已锁行为面，形态自由不影响验收。

## 机械闸留证（`verify --task` 实测）

审查文 + invoke 20 落盘、闸表 approved 后实测（2026-09-14 · GATE_VERIFY）：

```
$ npx spec-wave verify --target . --task docs/tasks/active/task_2_3_1_patch.md
task: task_2_3_1_patch.md
| gate | status | blocks_30 | 30 影响 |
|------|--------|-----------|--------|
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |

VERIFY: PASS · task_2_3_1_patch.md
（exit 0）
```

（本棒时序：审查文与 invoke 20 先落盘、闸表代签后一次过闸 · 无前轮 BLOCKED 留证 · 如实记录）

## 签闸

- **HG-AUDIT-R1 → approved**（人 · 2026-09-12 维护者会话授权 00 代签 · 2.3.1 同模式延续 · 沿用 2.2.0/2.2.1 代签先例 · 00 代签落表 · 本 R1 审查 pass 零阻塞）· 出处：维护者授权链（与 HG-TASK-DRAFT 同授权 · 00 编排员 PROMPT 明示「HG-AUDIT-R1 代签」链路）
- 审查文结论：**签收 · 关闭（R1 为终轮）**

## 下一棒

GATE_VERIFY（`npx spec-wave verify --target . --task docs/tasks/active/task_2_3_1_patch.md` · 预期 PASS）→ 30 开工。**本帽不改实现码 · 不派 30。**

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | R1：零阻塞 pass · 核对 10 项（含三锚点实读源码复核 :700/:739/:585 全部属实）· 非阻塞观察 ×3（N1-d 定稿微调余地 · 结论节内「通过」二字残余面归 2.4 · 断言形态归 30 裁量）· HG-AUDIT-R1 代签落表（2026-09-12 维护者会话授权 · 2.3.1 同模式延续）· verify 前后两轮输出如实留证 |
