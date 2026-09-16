# Invoke：10（task 起草）· 3-0-w1-schema-leap

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-w1-schema-leap` |
| task_paths | `docs/tasks/active/task_3_0_w1_schema_leap.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-16 |

## 指令摘要（委派 Prompt）

00 委派（W0 已 CLOSE · schema 评审文落盘并经 00 批准 · HG-SCHEMA-CHANGE 代签成立 · 授权真值：维护者 2026-09-16「签收，授权00签收后续所有文档」）：起草 3.0 W1 task —— ① 必读评审文（schema v2 设计真值 · §2/§3/§5/§6/§7）+ SPEC 02 + PLAN W1/硬约束 3/4/12/15 + W0 done task（格式模板）+ 现码实读（W0 后新布局）；② **OQ 三硬动作**：OQ-1 hooks 触发点枚举钉死（定稿值 + 机制族×触发点×13 宿主适用性论证）· OQ-5 闸泛化基线快照（统一口径扫描脚本 + 逐行判定快照固化为 fixture · 差值归因）· OQ-2 确认登记（数组=replace · fixture 九条目）；③ 基线复跑实测写入（npm test / typecheck / pins check）；④ 闸表按评审文 §7 落（HG-SCHEMA-CHANGE/HG-TASK-DRAFT/HG-AUDIT-R1 均 pending · **不签任何闸**）。禁区：不实现代码 · 不改 SPEC/PLAN/reviews/评审文 · S2 只新增 task 文件（+ OQ-5 快照 fixture 与扫描脚本属本棒交付）· 禁 git add -A。

## 动作与独立复核证据（本帽实测）

- **OQ-1 定稿**：triggers 枚举 = `pre-commit`/`pre-archive` 两值（候选 pre-close 合并入 pre-archive · 本仓 close 即归档同一事件 · `cmdTaskClose` renameSync → done/ · done_snapshot 唯绑归档事件 · 一事件两值不可钉 fixture）· mechanism 三族不留扩展位（未知值 enum fail-closed · 扩展走 v3 HG-SCHEMA-CHANGE）· none 矛盾声明报红（F-W1-10）· 适用性矩阵：shell-hook 13 宿主 pre-commit 全适用（git 层中立）· config-hook = claude 首选/cursor 候选（W2 取证校准）· 其余 11 宿主 none 显式降级（2.2/2.3 W6 取证卡无 hook 面）
- **OQ-5 闭环**：统一口径扫描器 `scripts/scan-human-gates-baseline.mts`（直接 import 现行 `parseHumanGates`/`findGate`/`evaluateMayStart30` · 与机检逐字同口径）+ 快照 `test/fixtures/human-gates/baseline_20260916.json`（**75 文件 / 232 闸行 / 12 种闸 ID** · blocks 含 30 行 139 · 翻转候选 **0** ⇒ 泛化零误伤 · 文件级缺行即拒 11）· 差值归因（评审文 284/17 = 文本级粗口径混入节外 failure_paths 行与状态粘连伪 ID · SPEC 229/13 = 时点差+口径未机械固定 ⇒ 以本快照为唯一基线）
- **OQ-2 确认登记**：数组 = replace（评审文裁定继承）· fixture 九条目规格（覆盖/深合并/replace/继承/循环/自继承/未知目标/链深 8 边界双条/defaults extends 拒）
- **基线复跑**：HEAD `98d2062` · npm test **607/116/606 pass/0 fail/1 skip**（原 4 环境红已消）· typecheck 0 错 · pins 17/17（pin-17 13 宿主双语命中）· 行号全量回源码复核现值（W0 后新布局）
- 落 `docs/tasks/active/task_3_0_w1_schema_leap.md`；`task lint` PASS（仅 W3 draft 合法占位）· gate-check 实证闸表可机检（exit 2 正确拒 30 · 白名单不渲染 HG-SCHEMA-CHANGE 行 = 泛化病根活例）

## 关键交付与回执（00 授权落笔）

1. **HG-SCHEMA-CHANGE / HG-TASK-DRAFT 翻转**（00 回执授权 · 2026-09-16）：pending → approved（00 代签 · 授权真值：维护者本窗「授权00代签」· W1 schema 签属请示答复）· 头部闸态同步 · verify 回报（HG-AUDIT-R1 pending 正确拒 30）
2. **A1 修扫描器**（20 审 advisory · 00 裁定）：`--out` 改必填（无默认 · 防裸跑覆写）+ 目标已存在拒写（fail-closed）+ 绝对路径原样使用 · 三实证（裸跑报错 / 指既有 fixture 拒写 / 重扫 manifest 交集 75 文件逐字一致 · 结构 diff 恰为 W1 task 条目 · baseline sha256 `002f3fc2` 不变）· task 基线节再生成命令同步（A1 建议落点）
3. **HG-AUDIT-R1 代签落笔**（00 裁定 · 2026-09-16）：pending → approved，依据审查文 `docs/harness/reviews/task_3_0_w1_schema_leap_audit_R1_20260916.md`（R1 · PASS-with-issues · blocking 0 · advisory A1–A3 · A1 已修扫描器 · A2/A3 带入 30 执行要求）· 头部同步
4. 本两件 invoke 补落（00 裁定授权 · W0「pre-30 三件套齐」先例 · verify 实测缺 10,00 挡 30 → 补落后 VERIFY: PASS）

## 未做（禁区）

- 未实现代码 · 未改 SPEC/PLAN/reviews/评审文/src/test 既有件（30 的事 · 本帽只起草）
- 未自行签发任何闸（三次翻闸均为 00 明确回执授权后落笔）
- 未执行 git push / tag / publish（commit 两笔为 00 当次书面授权 · 四动作余者仅人）
- 未裹挟工作区上游 untracked 产物

## 下一棒

30 实现棒：GATE_VERIFY 首输出（三闸 approved · may_start_30=true · pre-30 invoke 三件套齐）→ 按 task 范围 ①–⑦ 执行（schema v2 双轨校验 · defaults/extends 合并器 · command_sets 入表 + v1 兼容桥 · 闸判定泛化 · MIGRATION 草案节）→ 验收 13 条全绿（三重保险机械锁 + 红测先行）→ `task close --yes` 关账。20 审 A2（#5② 行级比对有效锁 = 文件级 may_start_30 逐文件不变 + 行键集不变）/A3（F-W1-11 可选类型层加强）带入 30 执行要求。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-16 | 10-task 起草完成 + OQ 三硬动作 + 两次代签落笔（00 授权）+ A1 修扫描器 · 00 授权后补落本 invoke（三件套之一） |
