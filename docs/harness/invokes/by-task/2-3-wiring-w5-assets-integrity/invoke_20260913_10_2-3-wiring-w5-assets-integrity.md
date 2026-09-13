# invoke · 10-task · 2.3 W5 A2 资产完整性校验 task 起草（SPEC 05 转可验收 task）

> **hat_id**：`10-task` · **日期**：2026-09-13  
> **task_slug**：`2-3-wiring-w5-assets-integrity`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-12 会话授权（00 委派 W5 实现棒走完整链路）· HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文 + 签闸 · 本帽不代签）。

## R0 前提复核（本帽实测 · SPEC 05 前提全部成立 · 无证伪项）

- 无 `assets/sha256.manifest` · 全 src/bin 无 `assets` 子命令（grep `cmd === 'assets'` 零命中 · runCli 分发表 cli.ts:1220-1292 无 assets 分支）。
- 接线点位：package.json prepublishOnly 链尾 pins check（:42）· ci.yml test job 末步 pins check（:34）· files 白名单已含 assets（:28 · `npm pack --dry-run` 基线 184 文件）。
- 资产摸底：110 文件 · 512K · 无 symlink · 无 .bak/真临时文件/dotfile（`tmp|temp` grep 仅命中 templates 目录名误报）· 全量 sha256 实测 16ms（F-W5-05 秒级内）。
- 基线实测（干净树）：typecheck 0 错 · `npm test` 513/513 · `pins check` 17/17 PASS。
- 测试影响面勘查：ci-workflow-security.test.ts 仅断言 permissions/audit/secrets-scan 存在性（加步安全）· cli-help.test.ts 无命令全集枚举 · DEF-009 仅扫 assets/** 引用（task/review 出扫描面）· init.test.ts quickstart 命令存在性不受影响。

## 动作

1. 起草 `docs/tasks/active/task_2_3_wiring_w5_assets_integrity.md`（蓝本 SPEC 05）。
2. 预填 Harness 元信息：test_strategy=required / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / wiki_delta=none / invoke_retention_profile=default / close_pr_policy=exempt。
3. 范围八项：①cli-assets 实现 ②assets verify 子命令 ③manifest rebuild 修复 ④manifest 首版落盘 ⑤CI+prepublishOnly 接线 ⑥测试（含 lib-smoke 钉面）⑦CHANGELOG ⑧tarball 验证。
4. 四定案冻结：D-23-W5-GEN-CMD（生成=显式命令非 build 钩子 · 防门禁消解 F-W5-08）· D-23-W5-FIX-TARGET（修复对象=manifest 永不反向改资产）· D-23-W5-NOBAK（派生数据无 .bak）· D-23-W5-EXCLUDE（排除清单单一常量双侧消费）。
5. 非范围 11 项显式列（含对外文档宣称零改动 · RELEASING 零改动 · build 钩子 · pins 并入 · 发版动作 · --force · schema · S2 CLI 写）。
6. 验收 8 条全部机械可断言（①–⑥ 对齐 SPEC 05 §7 · ⑦ bin 面硬条款（W3 教训）· ⑧ close+提交边界）+ failure_paths 9 行（F-W5-01..08 + F-T-01）+ R0–R5 思考轮槽 + 控制表（early_stop=R5 · reason 回填 · residual_risks ×3）。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / package.json / ci.yml（30 的事 · 且 HG-AUDIT-R1=pending）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 git tag / push / npm publish（仅人）
- 未扩大范围 · 未碰 RELEASING.md / host-adapt schema / 事实卡 / README 宣称

## 下一棒

20-task-audit R1 书面审 → 审查文落盘 `docs/harness/reviews/` + invoke_\*_20_\* → **签 HG-AUDIT-R1=approved**（2026-09-12 维护者会话授权 00 代签）→ 30/40（`feat(2.3-W5): …` · 禁 git add -A · 禁 tag/push/publish）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w5_assets_integrity.md` 过闸扫描。
