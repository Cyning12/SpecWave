# Invoke：20（task-audit R1）· 3-0-w7-closeout-external

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w7-closeout-external` |
| task_paths | `docs/tasks/active/task_3_0_w7_closeout_external.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要

对 W7 task（3.0 收尾与对外 · 含 3.0.0 release bump · F3 wiki 双向/增量/冲突 + E3 spawn 收官 + 术语统一 + A3 对外口径边界 + K-1~K-4 台账 + MIGRATION 定稿与真实 2.4.1 仓演练 + 链接两级机检 + 证据入库清偿 + 2.4.2 口径补正搭车 + 3.0.0 bump）做 R1 书面审查：对照 SPEC 08（范围 ①–⑩ · 验收 1–10 · F-W7-01–06 · §10 人工闸）与 PLAN W7 节 + K-1~K-4 台账 + 硬约束 1/7/8/9/14/15/16 逐项核对范围/非范围/验收/failure_paths/思考轮；逐条裁定 10-task 留下的五条重点（E3 重定基 · HG-RELEASE 不拦 30 · 链接 S2 豁免 · 两条实态偏差 · 术语机检边界）；另核 bump 九件套完整性 / 证据清偿清单 / 范围⑩ tag·publish 仅人。审查文落盘 `docs/harness/reviews/`。**禁止**改 task 实质、代签 HG-AUDIT-R1、改 src/assets/SPEC/PLAN/物料。

## 独立复核证据（本帽实测）

- **基线全量复跑**：`npm test` **841 tests / 160 suites / 840 pass / 0 fail / 1 skip**（111.3s · task 108.7s 机差量级）· `typecheck` **0 错** · `pins check` **17/17 PASS · exit 0** · `assets verify` **111/111 PASS** · deps 仅 `js-yaml` ^4.1.0 · HEAD `f4bbaf7`（= W6 close 归档 · 与 task 测量点 e894f64 关系自洽）· 工作区 untracked = 本 task 1 件 · tag `v2.4.2` 在 · `docs/coding_wiki/` 不存在 —— 与基线节逐字一致
- **spawn 671 独立复算**：`runCli(` 行命中 **724** − `function runCli` 定义行 **53** = **671** ✓ · 头部文件逐字全中（pins-consistency 89 · cli-w4-gate-wiring 65 · cli-w5-assets-integrity 34 · cli-verify-spec 34 · cli-json-no-abs-path 34 · cli-skills-install 24 · cli-p0 22 · w2-hooks-materialize 20 · w2-b5-merge 20）· **分布实测 53 文件（task 称 55 → A4）**
- **链接两级自研脚本复测**：**(i) 非 S2 坏链 = 12 精确**（PLAN_2_3×4 · PLAN_2_4×2 · PLAN_2_2×3 · feedback×1 · spec×2）· **S2 = 29 = 起草前 26 + 本 task 3 处**（2 处 W6 断链 + 1 负 fixture 字面）；**(ii) .workbuddy 未入库链 = 36 实例 / 10 distinct 精确**（路线研究 · 验收报告-2.2.0/2.3.0/2.4.0/2.4.1 · PROMPT-2.2.0/2.3.0 · 推广事实卡-2.1.3/2.2.0 · 审查报告-2.1.1）· task 自身 :6/:300 `./task_3_0_w6_observability_audit.md` 断链（W6 实位于 done/ → A2）
- **证据/tracked 复点**：`git ls-files .workbuddy` = **9** ✓ · `.workbuddy/output` 顶层 23 + `_frag` 8 = **31 文件**（task 称 24+9=33 → A3）· W3 研究文 `docs/harness/reviews/w3_ontology_graph_research_20260917.md` tracked ✓
- **K 落点 15 处逐条抽核全中**：research_report **:120/:169/:170/:172/:220/:258/:267/:395**（旧值 30+/105/22 presets/200+/流程性 确在）· 高层架构设计 **:196** · promotion **01:11/01:77/02:12/03:30/04:65/04:66**
- **CHANGELOG 实态实证**：`CHANGELOG.md:10` = **已 published**（非滞后）· commit **1067f32** `docs(release): 2.4.2 发布回填（探针全过 · 过程档转 published）` diff 含 CHANGELOG.md —— 范围⑨滞后确已饱和
- **术语全语料扫描**：非 S2 扫描面（143 件）`人工闸` = **119 处**（全 tracked 450）· `门控` = 16（全 tracked **90** · 非 task 所称 77）· `帽子体系` = **0**；`人工闸` 含 ~45 条 `##` 级节标题（已签 SPEC/PLAN）+ `人工闸表` ×12（含 GLOSSARY.md 自身 :82）——task 豁免仅列 `### 人工闸` → **B1**
- **行号抽核（30+ 处）全中**：`src/cli-wiki.ts` 190 行 · `src/cli/usage.ts` wiki 行 :86 · README.md/README.zh-CN.md :378 published 指针 · AGENTS.md :61 · assets/ide/host-adapt/README.md :61 · docs/spec/README.md :23（pin-08）/:24（3.0 索引行）· MIGRATION.md :3/:4/:7/:85 现行指引 + :126 草案节 + :166 修订 · GLOSSARY.md :11 五保留词 · .gitignore:4 `.workbuddy/` · tag v2.4.1 → c89f92d · W0 M1 E3 实读 580（619−39）→520
- **闸机检**：`task lint` PASS（W3 占位符 warn draft 期合法）· `gate-check` **exit 2** 渲染 2 行（HG-TASK-DRAFT approved / HG-AUDIT-R1 pending ❌ 拒 30 · **HG-RELEASE 因 blocks=— 不渲染**）· `verify --target . --task …` `VERIFY: BLOCKED · HG-AUDIT-R1 pending` **exit 2** · W7 invoke 目录此前不存在（→ A7）

## 结论

**BLOCKING 1 · advisory 7 —— 退回 10-task 回填 §S7.3 后再送 00 代签**。**B1**：术语机检对 `人闸↔人工闸` 的 forbid/allowlist 口径不足以「不误伤」（非 S2 面 119 处 · ~45 条已签 SPEC/PLAN 的 `##` 级标题 + `人工闸表` ×12 · 豁免仅 `###`），与「不得整体放宽 / 不追溯存量」自相冲突，须收窄 forbid 面或精确枚举豁免模式并冻结计数（+fixture）。**advisory**：A1 HG-RELEASE 裁定实体成立（机械效果本审实证）但须补 SPEC §10 :133 字面偏差登记 + tag 权限三处冲突（SPEC ⑩/RELEASING ⑤/README :380 言 Agent 可 tag vs task 言仅人）· A2 task 自身 2 处 W6 断链 + S2 冻结基线须定义 in-flight task · A3 证据件数 33→实测 31 · A4 E3 分布 55→实测 53 · A5 F-W7-07 目标「建议 ≤300」宜升规范下限 · A6 bump 清单漏点名 `release-tag-identity` · A7 10/00 invoke 待补。五条重点结论：**① E3 重定基诚实口径接受（数字链 580→520→671 独立复算自洽）+ A5**；**② HG-RELEASE 不拦 30 实体裁定成立（gate-check 仅 2 行 · 仅 HG-AUDIT-R1 拒 30）+ A1**；**③ 链接 S2 冻结基线等价口径可签（非 S2=12 / (ii)=36·10 精确）+ A2**；**④ 两条实态偏差（CHANGELOG 1067f32 / K 内容锚）双双属实**；**⑤ 术语口径不足 → B1**。思考轮审查：R0–R5 填全 · 充分性裁定**不足**。审查文：`docs/harness/reviews/task_3_0_w7_closeout_external_audit_R1_20260917.md`

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 代签 · 维护者 2026-09-16 授权模式）
- ⛔ 未改 task / SPEC / PLAN / src / assets / test / package.json / 物料 实质内容（S2 只新增：本 invoke + 审查文）
- ⛔ 存在 blocking（B1）且 HG-AUDIT-R1 仍 pending ⇒ **未附 30 Prompt**，仅出维护者签闸清单；下一棒 = 10-task 回填 §S7.3

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 20-task-audit R1 审查完成落盘 · 总结论 BLOCKING 1 + advisory 7 · 退回 10-task |
