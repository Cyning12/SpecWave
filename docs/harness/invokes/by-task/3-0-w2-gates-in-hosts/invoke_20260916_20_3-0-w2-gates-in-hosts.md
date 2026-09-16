# Invoke：20（task-audit R1）· 3-0-w2-gates-in-hosts

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w2-gates-in-hosts` |
| task_paths | `docs/tasks/active/task_3_0_w2_gates_in_hosts.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 指令摘要

对 W2 task（3.0 战略目标兑现波 · hooks 物化 13 宿主落点 + `host verify` 物化 + P0 门禁宿主内真生效 + B5 接入面 catalog/用户级目录/多表合并 + 内置表 v2 化）做 R1 书面审查：对照 SPEC 03 / PLAN W2+硬约束 9/12/14/15 / schema 评审文 §2.2 / 政策边界逐项核对范围/非范围/验收/failure_paths/思考轮；逐条复核 10-task 留下的五条重点（闸行裁决不设 HG-SCHEMA-CHANGE 四理由 · 机制族 cursor/gemini 两处修正与 codex 保守裁决 · 消重复「做」的 pin-17 四禁与行级 verify 断言影响面 · 合并铁律 fail-closed 阻断式档位 · e2e ≥2 真实宿主硬条环境风险）；审查文落盘 `docs/harness/reviews/`。**禁止**改 task 实质、代签 HG-AUDIT-R1、改 SPEC/PLAN/src/test/fixtures。

## 独立复核证据（本帽实测）

- `npm test` 全量复跑：**667 tests / 130 suites / 666 pass / 0 fail / 1 skip**（77.4s）· typecheck **0 错** · pins **17/17**（pin-14/pin-17 含）· HEAD `f9f9c02` · 工作区仅 active/ untracked —— 与基线节逐字一致
- 行号抽核 30+ 处全中（schema/resolve/table/materialize/cmd/cli-pins/测试锚点/README/done task）；`mvp-hosts.yaml` 219 行 · `verify:`×13 · 无 `schema_version` · `host_id:`×13 复证；PlannedItem 无 hook kind / cmdHost 三分支无 verify 复证「hooks 零物化 · verify 零消费」
- 机制族外部文档抽样取证 4 件（2026-09-16 实读官方文档）：cursor「exit 2 = Block（≡ permission:deny）· 非 2 退出码 fail-open 默认 · cloud agents 跑仓内 `.cursor/hooks.json`」· gemini「settings.json hooks 对象 · BeforeTool regex matcher · exit 2 = System Block」· claude PreToolUse · codex 信任门原文「Non-managed hooks must be reviewed and trusted before they run」逐字命中
- verify 行级断言全量 grep：live 表 14 处引用（9 文件）**无一断言行级 `verify:` 键**（w2-commands-ux:19 = CORE_VERBS 动词名）——影响面实测为零
- 机检：`gate-check` 咬住 HG-AUDIT-R1 pending（❌ 拒 30 · exit 2）· `task lint` PASS
- 环境数据点：本审环境 `claude` 2.1.181 / `cursor-agent` 在 · `gemini` CLI 缺席；geminicli.com 官方横幅载「Gemini CLI 已由 Antigravity CLI 取代（2026-06-18 · 免费层）」

## 结论

**PASS-with-issues**（blocking 0 · advisory 3：A1 闸裁决理由③类比强度注记 · A2 verify 行级断言影响面实测为零 · A3 gemini CLI 缺席 + Antigravity 漂移数据点）—— 审查文：`docs/harness/reviews/task_3_0_w2_gates_in_hosts_audit_R1_20260916.md`

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 代签 · 维护者 2026-09-16 授权模式）
- ⛔ 未改 task / SPEC / PLAN / src / test / fixtures 实质内容（S2 只新增：本 invoke + 审查文）
- ⛔ HG-AUDIT-R1 仍 pending ⇒ 未附 30 Prompt，仅出维护者签闸清单

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 20-task-audit R1 审查完成落盘 |
