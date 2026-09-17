# invoke 30 · 3-0-w2-gates-in-hosts（六阶段实现棒 · 收官留档）

> **帽**：30 执行帽（task 实现 Agent）· **日期**：2026-09-16 · **task**：`docs/tasks/active/task_3_0_w2_gates_in_hosts.md`
> **授权链**：HG-TASK-DRAFT / HG-AUDIT-R1 双 approved（2026-09-16 00 代签 · 授权真值：维护者本窗「授权00代签」）· HG-AUDIT-R1 依据审查文 `docs/harness/reviews/task_3_0_w2_gates_in_hosts_audit_R1_20260916.md`（R1 PASS-with-issues blocking 0 · advisory A1–A3 全带入执行登记）· 闸行裁决（不设 HG-SCHEMA-CHANGE 四理由 · 20 复核在案）· 40 复核 PASS-with-issues blocking 0（留档 d4f7273 · advisory A-40-1 回填已由本棒兑现）。

## GATE_VERIFY（阶段一改码前 · 机械首输出 · 波末复跑同 PASS）

```
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w2_gates_in_hosts.md
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_w2_gates_in_hosts.md
```

## 六阶段交付摘要（00 逐阶段验收放行 · 逐文件显式 add · 每 commit 前后 npm test 同绿 · 未 push/tag）

| 阶段 | commit | 交付 | npm test（t/s/p/f/skip） |
|------|--------|------|--------------------------|
| task 文基线 | f9f9c02 | （W1 锁终态复跑） | 667/130/666/0/1 |
| 开工实测 | e7e868b | 并行 hotfix 棒（CI 空目录 ENOENT 修复 · 非本波改面 · F-W0-05 同式重建基线） | 670/131/669/0/1 |
| 一 · 内置表 v2 化 + 恒等锁 | bdd6e13 | mvp-hosts.yaml → schema_version 2 + command_sets 入表 + 13 宿主全量显式 hooks 声明（3 config-hook + 10 显式 none）+ verify 面 defaults/extends 消重复 · 恒等锁（pre-v2 fixture sha256 钉死 · resolved rows/planned writes 声明面逐字 deepEqual）· F-W2-13 翻转一件登记 · pin-17 四禁守住 | 676/132/675/0/1 |
| 二 · hooks 物化 + host verify + 降级留痕 | 83cbda6 | config-hook 三宿主 JSON 合并落点（深合并保用户键 · 结构性冲突 conflict 零覆写 · F-W2-10）· host verify 子命令（比对三分形态 · fail-closed unreadable · 粘性缺省 · exit 0/2 · --json 五键钉死）· degraded-none human+JSON 同键 · L3 负向断言 | 699/136/698/0/1 |
| 三 · B5 接入面 + hook-guard | 01b4a2e | ~/.spec-wave/hosts 用户目录合并（文件名序 · 无目录零行为差 · 不可读点名）· 合并铁律三面（内置冲突拒/用户间后载者拒/坏表点名 · exit 2 零写入）· catalog.yaml + host catalog list（sha256 呈现即强制 F-W2-09）· hook-guard 分发入口（三族事件形态 · 命中跑门禁 exit 2 阻断）· acme-bot 用户目录路自动化 | 720/139/719/0/1 |
| 四 · shell-hook 物化 + e2e | 99893c1 | .git/hooks/pre-commit 物化（spec-wave-managed marker · hook-guard 调用 · 0755 · F-W2-11 用户 hook conflict 零覆写 · 非 git target 零落点）· temp git 仓真实 commit 脏拒/净放（npm test 常驻 · 验收 #10）· acme --file 路（验收 #5 双路齐） | 726/140/725/0/1 |
| 五 · e2e 留证 + cursor 补齐 + 关账（docs/script-only） | c7c663b / 638355f / 本棒 | e2e 脚本 scripts/e2e-w2-host-gates.mts（不入 npm test 默认面 · temp 全隔离零全局污染）+ 验收文主文（claude 2/2 首跑 1/2 · STOP 诚实上报）+ cursor 补件（认证补齐后 §D 全链 · **验收 #1 2/2 达标**）· 关账回填（自检结论/KPI/勾选/Hub 行/本 invoke） | 726 复跑同值 |

## 锁终态（阶段四末 · 本棒复跑同值）

- `npm test`：**726 tests / 140 suites / 725 pass / 0 fail / 1 skip**（基线 667 纯加性 +59 测 +10 套件 · 零回退 · duration ≈91–97s E3 预算内）
- `npm run typecheck` 0 错 · `npm run build` 0 错 · `npm run test:lib` 6/6 · `pins check` **17/17**（pin-17 = 13 宿主双语命中 · 四禁全守）· `assets verify` 110/110（阶段一 manifest rebuild 正规流程一行 diff · 余阶段零资产变更）
- **11 件 host 测试 + w1 系 6 件 + gate/cli 系全阶段 git diff 为空**（验收 #12 · 除 F-W2-13 已登记翻转一件：w1-schema-version-detect.test.ts:116 v1→v2 · 行级 verify 断言影响面实测为零 · 20 审 A2 口径成立）
- 波末 `task lint` PASS · `gate-check` exit 0 · `verify` VERIFY: PASS 复跑 · 未执行 tag/push/publish/deprecate（仅人）

## 战略目标兑现面（硬约束 9/12/14/15）

门禁随包内置兑现（13 宿主 hooks 声明 + config-hook 三宿主物化 + host verify 消费转正 · verify 节不再零消费）· 接入面不依赖改包发版兑现（acme-bot 非内置 id 双路走通 · 硬约束 12）· 证据入库兑现（e2e 主文 + cursor 补件 tracked · 硬约束 14）· 闸不落表即虚设无涉（本波无新闸 · 泛化机检咬住双闸）· 降级留痕不暗示 L3（硬约束 9 · L3 负向断言钉死 · L3 以 e2e 证据为准 = claude/cursor 两件）。

## 偏差登记汇总（六阶段 · 逐棒已报 00 验收 · 均闭环）

**阶段一（1）**：开工基线与 task 文 667 不符（并行 hotfix +3 已落库 e7e868b）→ F-W0-05 同式以实测 670 重建基线比对。
**阶段二（10 裁决 · 零偏差）**：hook-guard 命令串物化先行（CLI 归阶段三）· cursor 骨架 version:1 · JSON 冲突=结构性冲突 · shell-hook 彼时零落点 · config-hook 无映射宿主 fail exit 2 · degraded 仅显式 none 留痕（v1 静默）· verify profile 缺省=粘性→core · --json 五键钉死 · verify 节消费=每宿主 check 条目 · 恒等锁=声明面恒等+物化面差异另立断言（00 裁定）。
**阶段三（6 裁决 · 零偏差）**：合并后 command_sets 取内置基底 · 用户表资产相对表目录解析（硬约束 12）· 用户表 version 不参与宿主契约 · hook-guard 坏 stdin fail-open 注记 / 空 stdin 跑门禁 · cursor 精确 exit 2 · catalog 内置锚包根相对形。
**阶段四（3 裁决 + 1 STOP）**：shell-hook 非 git target 零落点不创 .git · pre-archive not-materialized 留痕=脚本头注记 · e2e npx 解析=node_modules/.bin shim（PATH shim 被 npx 忽略实证）· **STOP 一次**：验收 #1 首跑真实宿主 1/2（gemini/cursor 认证缺席 F-W2-07 对照实验定性 · 零伪造零冒充）→ 00 呈报维护者补 agent login → cursor §D 补齐全链 2/2 闭环。
**阶段五（本棒 · 0）**：无。

## 禁区执行确认

schema 零改动（无 F-W2-05 触发）· 未碰 SPEC/PLAN/reviews 既有档改写（S2 只增：e2e 主文 + cursor 补件互引 · 主文未回改）· pin-17 四禁 + pin-11/12/14 钉点行未动 · 未执行 git add -A（全程 git status --porcelain 审边界 · 并行 hotfix 零交叠）· 未执行 tag/push/publish/deprecate · e2e 零全局状态污染（temp HOME/temp 仓/gemini temp prefix · 跑完自清理）。

## 下一棒

00 收官：归档 commit（done task + Hub 行 + 本 invoke）· KPI 裁定（30 自评备料 Task_KPI%: 97）· 统一呈报后由维护者 push（本地余 638355f/d4f7273/归档三笔）。
