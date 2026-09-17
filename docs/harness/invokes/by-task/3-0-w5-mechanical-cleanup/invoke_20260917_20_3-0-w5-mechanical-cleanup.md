# Invoke：20（task-audit R1）· 3-0-w5-mechanical-cleanup

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w5-mechanical-cleanup` |
| task_paths | `docs/tasks/active/task_3_0_w5_mechanical_cleanup.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要

对 W5 task（3.0 机械清扫与可诊断性 · NEW-6 卫生门通配 + NEW-7 第二控制点定稿 + NEW-8 pins fix 备份不误删 + NEW-12 key 相对化 + R-6 git 分档诊断/前置探测 + R-1 回归确认）做 R1 书面审查：对照 SPEC 06 / PLAN W5+硬约束 6/10/14/15 逐项核对范围/非范围/验收/failure_paths/思考轮；逐条裁定 10-task 留下的五条重点（SPEC 示例正则不完备处置 · NEW-7 案 B 事实第二控制点认定 · NEW-12 契约修订与消费面零波及 · R-1 行号迁移与回归锁 · NEW-8 避让命名 failClosed 取舍）；审查文落盘 `docs/harness/reviews/`。**禁止**改 task 实质、代签 HG-AUDIT-R1、改 src/scripts/package.json/SPEC/PLAN。

## 独立复核证据（本帽实测）

- `npm test` 全量复跑：**794 tests / 150 suites / 793 pass / 0 fail / 1 skip**（90.2s · 基线 ≈89s 机差量级）· typecheck **0 错** · pins **17/17 PASS** · HEAD `3664e6f`（= W4 close 归档 commit）· 工作区 untracked = 本 task 1 件（与声称一致）· tag `v2.4.2` 在 · dependencies 仅 `js-yaml` ^4.1.0 —— 与基线节逐字一致；W4 锁终态交叉一致
- **SPEC 示例正则不完备 node 实证**：`\.(bak|BAK)(\.|$| )` 对 `x.bak2` → **false**（起草发现属实）· 现行 `/\.bak$/i` 对 `.bak2`/`.bak.md`/尾空格 `.bak ` 全漏网（红测面真实）
- **NEW-8 现值实锤确认**：`cli-pins.ts:697-699` copyFileSync(abs, abs+'.bak') → writeFileSync → unlinkSync —— 用户同名既有 `.bak` 静默覆盖+删除成立
- **NEW-12 消费面复核**：printJson 34 命中 / 16 src 文件 + cli-wiki.ts:178 直调 ≈ task「约 30 处」✓ · assertJsonNoAbsRoot 为全 stdout 串扫描（key 含绝对前缀同咬）· npm test 全绿 ⇒ 无路径 key 信封反证成立 · Object.keys 快照七处（:203/:224/:254/:301/:316/:353/:411）皆固定字段集 · pins-consistency:1429 host_hits 键 = 宿主 id 非路径
- **R-1 迁移映射实证**：`src/cli-host.ts` 现为 21 行纯 barrel（W0 D-30-BARREL :10-13）· R-1 唯一实现面 `src/host/cmd.ts:162-167` · `findGitRoot` 唯一实现 `cli-shared.ts:37`（grep 全 src 单一定义）· `findGitRoot(path.dirname(...)` 唯一消费点 host/cmd.ts:167 · 回归锁 cli-json-no-abs-path.test.ts:536 起四 fixture（跨目录/realpath/仓外/symlink --target）锚点全中
- 行号抽核 40+ 处全中（3 处 ±2–3 行快照小疵 → advisory A4）：hygiene :25/:8/:1-5 · package.json :35/:43 · cli-pins :118-131/:129/:593-600/:602-622/:624-637/:684/:697-699 · cli-shared :433/:434-456/:449/:458-465/:37 · host/cmd :162-167 · cli-assets :32 · ci.yml :30-33/:31 + on push+PR :4-6 · release-pins.yaml :102-108 · pack-hygiene.test :17/:22-28/:30-32 · w2-shell-hook :47-48（实跑式探测实证）/:84/:141/:176/:194 · release-tag-identity :23/:33/:11-17 · pins-consistency :562-563/:1429 · cli-refresh-ide-blocks :112-116/:324/:693 · cli-json-no-abs-path :47/:161-191/:536-589
- 机检：`task lint` PASS（W3 占位符 warn draft 期合法）· `gate-check` + `verify` 双咬住 HG-AUDIT-R1 pending（❌ 拒 30 · VERIFY: BLOCKED · **双 exit 2**）

## 结论

**PASS-with-issues**（blocking 0 · advisory 4：A1 NEW-12 键碰撞语义未登记（撞名后者覆盖前者 · 契约注释修订须补一句）· A2 NEW-8 双占点名文案须含手动处置指引 · A3 NEW-7 机检锚建议双锚（注释 + 测试实跑行）· A4 三处行号快照 ±2–3 行小疵）—— 五条重点结论：**① fixture 驱动选型可接受 · 验收意图优先于 SPEC 示例字面（「等」字非绑定）· 30 正则形态不须回 SPEC 回注**；**② 测试内实跑构成事实第二控制点认定成立 · 塌缩最坏退回显式单点仍有 prepublishOnly 硬闸 · 零闸窗不存在 · 不须案 A 兜底 · 维持案 B**；**③ 契约修订成立 · 仓内零波及独立实证 · 消费者仓口径足够**；**④ 迁移映射成立（cli-host.ts = 21 行纯 barrel）· 回归锁行为+代码+证据三重充分**；**⑤ 避让命名 failClosed 取舍成立 · 第三条路以报错文案指引形态满足 · 不须新开设计面**。闸行裁决（不设 HG-SCHEMA-CHANGE）三理由+升级条款复核成立。思考轮审查通过 · 充分性裁定：充分。审查文：`docs/harness/reviews/task_3_0_w5_mechanical_cleanup_audit_R1_20260917.md`

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 代签 · 维护者 2026-09-16 授权模式）
- ⛔ 未改 task / SPEC / PLAN / src / scripts / test / package.json 实质内容（S2 只新增：本 invoke + 审查文）
- ⛔ HG-AUDIT-R1 仍 pending ⇒ 未附 30 Prompt，仅出维护者签闸清单

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 20-task-audit R1 审查完成落盘 |
