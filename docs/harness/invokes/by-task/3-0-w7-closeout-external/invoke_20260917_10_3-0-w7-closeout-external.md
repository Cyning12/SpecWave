# Invoke：10（task 起草）· 3-0-w7-closeout-external

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-w7-closeout-external` |
| task_paths | `docs/tasks/active/task_3_0_w7_closeout_external.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要（委派 Prompt）

00 委派（3.0 W0–W6 全 done · W7 = 收尾与对外 · 3.0 终局波 · 含 3.0.0 release bump · 授权真值：维护者 2026-09-16「签收，授权00签收后续所有文档」）：起草 3.0 W7 task —— ① 必读 SPEC 08（范围 ①–⑩ · §5 设计要点 K 台账/链接两级/演练 · 验收 1–10 · F-W7-01–06）+ PLAN_3_0 W7 节 + K-1~K-4 台账 + 硬约束 1/7/8/9/14/15/16 + 现码/物料实读；② 范围规格化十项：F3 wiki 双向/增量/冲突 · E3 spawn 收官 · 术语统一 · A3 对外口径边界 · K-1~K-4 台账 · MIGRATION 定稿 + 真实 2.4.1 仓演练 · 链接两级机检 · 证据入库清偿 · 2.4.2 口径补正搭车 · 3.0.0 release bump；③ 基线复跑实测写入；④ 闸表 HG-TASK-DRAFT / HG-AUDIT-R1 均 pending · **不签任何闸**。禁区：不实现代码 · 不改 SPEC/PLAN/reviews · 不签闸 · 不 commit · 禁 git add -A。

## 动作与独立复核证据（本帽实测）

- **基线复跑**：HEAD `e894f64`（起草期 W6 close 归档 `f4bbaf7` docs-only 前进）· npm test **841 tests / 160 suites / 840 pass / 0 fail / 1 skip**（≈108.7s）· typecheck 0 错 · pins **17/17** · assets **111/111** · deps 仅 `js-yaml` · tag `v2.4.2` 在
- **坏链两级实测（自研脚本）**：(i) `docs/**/*.md` 解析失败 **38 处** = S2 域 26（不可修）+ 非 S2 12（PLAN_2_3×4 · PLAN_2_4×2 · PLAN_2_2×3 · feedback×1 · spec×2）；(ii) `.workbuddy/…` 链接目标 `git ls-files` 未命中 **36 实例 / 10 distinct**
- **spawn 现值（W0 口径）**：`runCli(` 行 724 − `function runCli` 定义行 53 = **671**（分布 53 文件 · 头部 pins-consistency 89 / cli-w4-gate-wiring 65 / 34×3 / 24 / 22 / 20×2）
- **证据未入库**：`.workbuddy/output` 顶层 23 + `_frag` 8 = **31 件**（`git ls-files .workbuddy` = 9）· 3.0 依赖主源 4 件（路线研究 + 验收报告 2.4.0/2.4.1 + exports_probe）+ W3 已清偿 2 件
- **K 落点 15 处逐条实读**：research_report `:120/:169/:170/:172/:220/:258/:267/:395` + 高层架构 `:196` + promotion `01:11/01:77/02:12/03:30/04:65/04:66`
- **CHANGELOG 实态**：`:10` = **已 published**（`1067f32` 修正）⇒ 范围⑨已饱和（起草发现 · 30 改零残留确认）
- **F3/术语现值**：`src/cli-wiki.ts` 190 行仅单向 export · 术语 canonical 5 保留词（GLOSSARY）
- **规格化定稿**：S7.1–S7.10 十面 · failure_paths = F-W7-01–06 继承 + 新增 F-W7-07–13 · 验收 14 条全机械 · R0–R5 五槽 + residual_risks 八条
- 落 `docs/tasks/active/task_3_0_w7_closeout_external.md` · `task lint` PASS（仅 W3 占位符 warn · draft 期合法）

## 关键交付与回执（00 授权落笔）

1. **HG-TASK-DRAFT 翻转**（00 回执授权 · 2026-09-17）：pending → approved（00 代签）· 头部状态行同步 · verify 回报（HG-AUDIT-R1 pending 正确拒 30 · exit 2）
2. **20-task-audit R1/R2/R3 裁定回填**（三轮 · 只动 task 文）：R1（BLOCKING 1 + advisory 7）→ §S7.3 采方案 (b) 精确枚举豁免模式 + A1–A7 + B1 落笔 · R2（根因定位：canonical 被当 forbidden）→ A 正名 + B A8–A11 · R3（PASS）→ A12 六目标闭集 + `.workbuddy/output/**` 豁免 + A13 `人闸` 计次/行口径 ±2 登记
3. **HG-AUDIT-R1 代签落笔**（00 决定 · 2026-09-17）：pending → approved · 依据审查文 `docs/harness/reviews/task_3_0_w7_closeout_external_audit_R3_20260917.md`（R3 · PASS · blocking 0 · A12/A13 已搭车修）· **00 显式确认 A1 偏差**（HG-RELEASE 不适用 blocks-30 · tag 取严 = 3.0.0 tag 留维护者）· 头部状态行同步（双闸 approved · 30 可开工）
4. 本两件 invoke（10/00）代笔补落（00 授权 · W0–W6「pre-30 三件套齐」先例）

## 未做（禁区）

- 未实现代码 · 未改 SPEC/PLAN/reviews/src/scripts/assets/test/交付物料既有件（30 的事）
- 未自行签发任何闸（两次落笔均为 00 明确回执授权后执行）
- 未 push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 四动作余者仅人）

## 下一棒

30 实现棒：GATE_VERIFY 首输出（双闸 approved · pre-30 invoke 五件套齐 · VERIFY: PASS）→ 按 task S7.1–S7.10 执行（红测先行 · A1–A13 带入执行要求 · E3 重定基目标 ≤300 规范下限 · 链接 S2 冻结基线 26 + 参数化排除 current task · 术语唯一判红 `门控` 六目标闭集 · 迁移真实 2.4.1 仓演练 compat 红线）→ 验收 14 条全绿 → 40 复核 → `task close --yes` 关账（待 40 后另行 · 00 口径）。
