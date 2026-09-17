# Invoke：10（task 起草）· 3-0-w5-mechanical-cleanup

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-w5-mechanical-cleanup` |
| task_paths | `docs/tasks/active/task_3_0_w5_mechanical_cleanup.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要（委派 Prompt）

00 委派（W0–W4 已 CLOSE · W5 = 机械清扫与可诊断性（低风险波 · P3×4+P2 · 已按 2.4.2 对账收窄 · R-1 已交付不重复）· 授权真值：维护者 2026-09-16「签收，授权00签收后续所有文档」）：起草 3.0 W5 task —— ① 必读 SPEC 06（范围 ①–⑥ · 设计要点 §5 · 验收 1–6 · F-W5-01–05）+ PLAN W5 节/硬约束 10（环境依赖可诊断）+ 现码实读（check-pack-hygiene.mjs 黑名单 · package.json files/prepublishOnly · cli-pins.ts 备份清理/git-tag extract_error · cli-shared.ts relativizeOutputValue · 测试套件 git 依赖面）+ W4 done task 格式模板；② 范围规格化六项：NEW-6 卫生门通配语义 · NEW-7 第二控制点两案评估定稿 · NEW-8 pins fix 备份不误删 · NEW-12 相对化覆盖对象 key · R-6 git 分档诊断 + 套件前置探测 · R-1 回归确认（只验不回改）；③ 基线复跑实测写入；④ 闸表 HG-TASK-DRAFT / HG-AUDIT-R1 均 pending · **不签任何闸**。禁区：不实现代码 · 不改 SPEC/PLAN/reviews · 不签闸 · 不 commit · 禁 git add -A。

## 动作与独立复核证据（本帽实测）

- **基线复跑**：HEAD `3664e6f` · npm test **794/150/793 pass/0 fail/1 skip**（≈89s · 与 W4 锁终态逐字一致）· typecheck 0 错 · pins **17/17** · tag v2.4.2 在 · tree clean · 依赖基线 dependencies 仅 `js-yaml`
- **现码行号逐条实读（W0 后新布局）**：`scripts/check-pack-hygiene.mjs:25`（精确后缀 `/\.bak$/i` · 平台分支 :8）· `package.json:35`（`!assets/**/*.bak`）/:43（prepublishOnly 链）· `src/cli-pins.ts:118-131`（git-tag catch 一刀切 extract_error）/:697-699（copyFileSync 覆盖 + unlink 误删实锤面）· `src/cli-shared.ts:433-456`（relativizeOutputValue 键不动 · 契约注释 :433）· `src/host/cmd.ts:162-167`（R-1 现址 · SPEC 快照 cli-host.ts:489-498,552 已随 W0 迁移）· `src/cli-assets.ts:32`（同族精确后缀盘点面）· `.github/workflows/ci.yml:30-33`
- **git 依赖测试面全仓 grep 盘点（4 文件）**：`w2-shell-hook.test.ts` 已具 gitAvailable() probe（:47-49）+ 4 处 t.skip（:84,141,176,194 · 合规先例形态）· `release-tag-identity.test.ts`（:23,33 无探测即 FAIL）· `pins-consistency.test.ts:562`（git init assert 无探测）· `cli-refresh-ide-blocks.test.ts`（initGitRepo :112-116 · 消费点 :324,693 无探测）—— 后三文件定为 R-6 改造面
- **NEW-12 消费面预查**：printJson/relativizeOutputValue 约 30 消费点 · 既有 JSON 信封无一以绝对路径为 key（`cli-json-no-abs-path.test.ts` assertJsonNoAbsRoot 全绿反证）· Object.keys 快照断言面均为固定字段集非路径 key —— 预期零波及（F-W5-05 兜底在案）
- **起草发现（SPEC 示例正则不完备）**：SPEC §5/PLAN 示例 `\.(bak|BAK)(\.|$| )` 拦不住 `.bak2`（`2` 不在边界字符集）· 与验收 1「.bak2 全拦」冲突 —— task 定 fixture 驱动选型口径（候选 `/\.bak/i` 子串级 / 边界扩展式 · 误拦面分析强制入自检结论 · F-W5-10）· 留 20 裁定
- **规格化定稿**：NEW-7 **案 B**（显式声明 + 指认事实第二控制点 = pack-hygiene.test.ts 在 npm test 内实跑 + CI ci.yml:31 每 push 跑 · 案 A 冗余三理由 · 升级通道留 20）· NEW-8 改名避让 `.pins-fix-backup`（避开 .bak 后缀防 NEW-6 通配自咬 · 两级皆占跳过写盘 exit 2 failClosed 零损失优先）· NEW-12 key 经同函数 walkString + 契约注释修订登记 · R-6 additive `error_kind` 三态（git_missing/git_exec_failed/not_git_repo）+ tag 缺失维持 missing · **skip/fail 边界**：skip=套件层语义（环境不具备 t.skip 标注）· CLI 层 git 不可用仍 exit 2 不降级 · 无 exit 0 放行第三条路 · release-tag-identity tag 缺失维持 FAIL 负向对照 · R-1 回归锁 cli-json-no-abs-path.test.ts:536-587 + host/cmd.ts/cli-shared.ts 零 diff 硬锁
- **闸行裁决**：W5 不设 HG-SCHEMA-CHANGE 行（三理由：files 否定项=数据行 · error_kind=additive 扩键契约允许 · NEW-12 契约修订人闸通道=HG-AUDIT-R1）+ yaml 键结构变动 STOP 升级条款 · 留 20-task-audit 复核
- 落 `docs/tasks/active/task_3_0_w5_mechanical_cleanup.md` · `task lint` PASS（仅 W3 占位符 warn · draft 期合法）· failure_paths 继承 F-W5-01–05 + 新增 F-W5-06–12 · 验收 10 条全机械 · R0–R5 五槽 + residual_risks 五条

## 关键交付与回执（00 授权落笔）

1. **HG-TASK-DRAFT 翻转**（00 回执授权 · 2026-09-17）：pending → approved（00 代签 · 授权真值：维护者本窗「授权00代签」· task lint PASS）· 头部状态行同步 · verify 回报（HG-AUDIT-R1 pending 正确拒 30 · exit 2）
2. **HG-AUDIT-R1 代签落笔**（00 裁定 · 2026-09-17）：pending → approved · 依据审查文 `docs/harness/reviews/task_3_0_w5_mechanical_cleanup_audit_R1_20260917.md`（R1 · PASS-with-issues · blocking 0 · advisory A1–A4 全部带入 30 执行要求）· 头部状态行同步（双闸 approved · 30 可开工）
3. 本两件 invoke 代笔补落（00 裁定授权 · W1/W2/W3/W4「pre-30 三件套齐」先例 · 格式对齐 W4 目录件）

## 未做（禁区）

- 未实现代码 · 未改 SPEC/PLAN/reviews/src/scripts/package.json/test 既有件（30 的事 · 本帽只起草+按 00 授权落笔闸行）
- 未自行签发任何闸（两次落笔均为 00 明确回执授权后执行）
- 未 push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 四动作余者仅人）
- 未裹挟域外档（commit 逐文件显式 add）

## 下一棒

30 实现棒：GATE_VERIFY 首输出（双闸 approved · pre-30 invoke 三件套齐 · VERIFY: PASS）→ 按 task S5.1–S5.6 执行（红测先行 · NEW-6 误拦面分析强制 · NEW-8 双占文案含「请手动处置后重跑」（A2）· NEW-7 机检双锚（A3）· R-6 PATH 隔离 skip 实证 · R-1 只验不回改零 diff）→ 验收 10 条全绿 → `task close --yes` 关账（待 40 复核后另行 · 00 口径）。20 审 A1–A4 带入 30 执行要求（见 00 invoke 裁定节与 HG-AUDIT-R1 行注明）。
