# Invoke：10（task 起草）· 3-0-w2-gates-in-hosts

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-w2-gates-in-hosts` |
| task_paths | `docs/tasks/active/task_3_0_w2_gates_in_hosts.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 指令摘要（委派 Prompt）

00 委派（W0/W1 已 CLOSE · schema v2 已交付 · 授权真值：维护者 2026-09-16「签收，授权00签收后续所有文档」）：起草 3.0 W2 task —— ① 必读 SPEC 03（范围 ①–⑧ · §5 设计 · 验收 1–7 · F-W2-01–06）+ PLAN W2 节/硬约束 9/12/14/15 + W1 评审文 §2.2 + 现码实读（W0/W1 后新布局 `src/host/*` `src/cli/gates.ts` `mvp-hosts.yaml` 219 行 v1 `host-adapt/README.md`）+ W1 done task（格式模板）；② **W2 特有硬动作**：机制族划分取证定稿（13 宿主逐格证据）· 内置表 v2 化方案（含 defaults/extends 消重复做/不做评估 · pin-17 四禁 · v1 消费面回归盘点）· 闸行设计裁决（是否需 HG-SCHEMA-CHANGE 行）· e2e 证据方案（≥2 真实宿主 + 第三方自定义 agent 双路 · 硬约束 12）· B5 设计规格化（catalog/用户级目录/--file 优先级/合并铁律/平台差异）· host verify 语义定稿 · 降级留痕；③ 基线复跑实测写入；④ 闸表落 HG-TASK-DRAFT / HG-AUDIT-R1 均 pending · **不签任何闸**。禁区：不实现代码 · 不改 SPEC/PLAN/reviews · S2 只新增 task 文件 · 禁 git add -A · 不 commit。

## 动作与独立复核证据（本帽实测）

- **基线复跑**：HEAD `f9f9c02` · npm test **667/130/666 pass/0 fail/1 skip**（≈81s）· typecheck 0 错 · pins 17/17（pin-17 13 宿主双语命中）· 内置表实测仍为 v1（`w1-schema-version-detect.test.ts:116` 断言在案）
- **机制族取证定稿**（S3.1 · 13 格证据表 · 官方文档全文读取 + 检索 2026-09-16）：claude=config-hook（code.claude.com/docs/en/hooks · 项目级 settings.json 可入库 · PreToolUse matcher Bash · exit 2 阻断）· cursor=config-hook **修正：候选→定稿**（cursor.com/docs/hooks · beforeShellExecution · exit 2=deny · 非 2 fail-open 口径登记）· gemini=config-hook **修正：none→定稿**（geminicli.com/docs/hooks + 官方 writing-hooks.md · BeforeTool deny · 官方 block-secrets-in-commits 示例 · 无头可自动化 ⇒ e2e 第二宿主）· codex=none 本波（learn.chatgpt.com/docs/hooks · 信任门原文查得 · 候选登记 3.x）· opencode=none（plugin=代码运行时 · 不符声明式定义）· 其余 8 宿主 none（2.2/2.3 W6 取证卡 tracked + 本棒检索 · F-W2-06 取证点保留）
- **内置表 v2 化方案**（S3.2）：schema_version: 2 + command_sets（5+7+2 逐字）+ 13 行全量显式 hooks 声明 · **消重复裁决=做（仅限 verify 面）**（defaults.surfaces.verify + extends: defaults · AGENTS 系继承登记不做）· pin-17 四禁守住（`cli-pins.ts:385-394` 直读原始 YAML 论证）· v1 消费面影响盘点 8 行表（compat fixture 零影响 · :116 有意翻转 · planned 快照新增登记）· 恒等锁（验收 #8）
- **B5 定稿**（S3.6）：`--file` = 当次整表替换（现状逐字保留 · 合并仅无 --file 时内置+用户目录）· 合并铁律 = 表级隔离 + exit 2 零写入（U-01 同档）· catalog.yaml 可选 + sha256 呈现即强制 + `host catalog list` · 纯函数注入 home 跨平台断言
- **host verify 语义定稿**（S3.4）：比对三分形态（逐字 / marker 产品块 / JSON 包含性 · 用户定制不计篡改）· fail-closed 无法读取按红（verify.failClosed 声明锚点）· 粘性缺省解析 · exit 0/2
- **e2e 方案**（S3.7）：首选对 claude+gemini（无头可自动化 · cursor 加分非硬条）· acme-bot 第三方双路（`--file` + 用户目录/catalog）· shell-hook temp git 仓 e2e（git 不可用 skip）· 计数口径登记
- **闸行裁决**：W2 不设 HG-SCHEMA-CHANGE 行（四理由落闸表下注 · 留 20-task-audit 复核）
- 落 `docs/tasks/active/task_3_0_w2_gates_in_hosts.md`（365 行）· `task lint` PASS · 新增 F-W2-07–15 九条 · 验收 14 条全机械 · R0–R5 五槽 + residual_risks 七条

## 关键交付与回执（00 授权落笔）

1. **HG-TASK-DRAFT 翻转**（00 回执授权 · 2026-09-16）：pending → approved（00 代签 · 授权真值：维护者本窗「授权00代签」· task lint PASS）· 头部闸态同步 · verify 回报（HG-AUDIT-R1 pending 正确拒 30 · exit 2 · 泛化渲染两行如实）
2. **两修**（00 回执授权）：S3.8/R5 两处 HG-TASK-DRAFT 草稿时点表述同步为 approved 口径（纯表述 · 闸行未再动）
3. **HG-AUDIT-R1 代签落笔**（00 裁定 · 2026-09-16）：pending → approved · 依据审查文 `docs/harness/reviews/task_3_0_w2_gates_in_hosts_audit_R1_20260916.md`（R1 · PASS-with-issues · blocking 0 · advisory A1–A3 全部带入 30 执行登记：A1 闸裁决理由③类比强度注记 · A2 F-W2-13 登记口径可按实测收窄（行级 verify 断言影响面=零）· A3 e2e 验收文须登记 CLI 版本串（gemini CLI 已由 Antigravity CLI 取代的官方横幅数据点 · F-W2-06/07 兜底））· 头部同步
4. 本两件 invoke 补落（00 裁定授权 · W1「pre-30 三件套齐」先例 · 格式对齐 W1 目录件）

## 未做（禁区）

- 未实现代码 · 未改 SPEC/PLAN/reviews/src/test 既有件（30 的事 · 本帽只起草）
- 未自行签发任何闸（三次落笔均为 00 明确回执授权后执行）
- 未 push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 四动作余者仅人）
- 未裹挟并行链 untracked 产物（CI hotfix task 文/审查文/invoke 目录逐路径排除）

## 下一棒

30 实现棒：GATE_VERIFY 首输出（双闸 approved · may_start_30=true · pre-30 invoke 三件套齐）→ 按 task 范围 ①–⑨ 执行（hooks 物化 · host verify · hook-guard 分发 · B5 合并铁律/catalog/用户目录 · 内置表 v2 化）→ 验收 14 条全绿（红测先行 + 恒等锁 + 真实宿主 e2e 留证）→ `task close --yes` 关账。20 审 A1/A2/A3 带入 30 执行登记（见 HG-AUDIT-R1 行注明）。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 10-task 起草完成 + 机制族取证定稿（两处修正）+ 三次 00 授权落笔（双闸翻转 + 两修）· 00 授权后补落本 invoke（三件套之一） |
