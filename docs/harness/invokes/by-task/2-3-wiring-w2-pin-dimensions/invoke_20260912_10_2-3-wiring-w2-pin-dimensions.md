# invoke · 10-task · 2.3 W2 钉面维度扩展 task 起草（SPEC 02 两校验转可验收 task）

> **hat_id**：`10-task` · **日期**：2026-09-12  
> **task_slug**：`2-3-wiring-w2-pin-dimensions`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-12 会话授权（00 委派 W2 实现棒走完整链路）· HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文 + 签闸 · 本帽不代签）。

## R0 前提复核（本帽实测 · 触发 STOP 上报已闭环）

- 校验① SPEC 原稿「2.2.1 现状应 PASS」**实测证伪**：自写 probe 扫 files[] 内 95 个 markdown 相对链接 → `README.md:273`→`MIGRATION.md` 未入 files；`npm pack --dry-run --json` 实证 MIGRATION.md 不在包内（183 文件）= 安装后真死链（[A]#3 同型残留）；`README.zh-CN.md` 实证被 npm `README*` 规则自动入包（naive 口径误报）。
- 按 PROMPT 硬约束 **STOP 上报 00** → 00 裁决 **Q1A**（npm 自动入包视同白名单）/ **Q2 仓根级**（docs/ 深度出范围）/ **Q3 预留**（F-W2-03 改写）→ SPEC 02 修订重签（commit 80eaa14）。
- 校验②前提复核成立（现状必红）：copilot/codex/windsurf 双语根 README 0 命中 · 双语宿主表 :24-29/:26-29 仅 4 宿主 vs 适配表 7 host_id。

## 动作

1. 起草 `docs/tasks/active/task_2_3_wiring_w2_pin_dimensions.md`（蓝本 SPEC `docs/spec/2_3-wiring-completion/02_w2_pin_dimensions_v1.md` 修订重签版 · signed）。
2. 预填 Harness 元信息：test_strategy=required / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / **wiki_delta=none（预填）** / invoke_retention_profile=default / close_pr_policy=exempt。
3. 范围五项：① 前置修复 MIGRATION.md 入 files（SPEC 02 §5.1 授权 · 30 第一步）；② pin-16 `files-whitelist-link`（仓根级 + npm 自动入包并集白名单 · 机械口径本 task 定稿）；③ pin-17 `readme-host-row`（host_hits 逐宿主表行锚/词锚核对 + known_gaps 数据豁免 until_wave: W7）；④ 测试扩组 W2-B + C 组 TEST-LOCK 15→17；⑤ 接线实证（零新接线点 · 复用 pins check）。
4. **D-23-W2-CHECK-FORM 本 task R2 定稿**：采纳 SPEC §6 优先方案（yaml 纯数据 + 两新 extract kind · 与 spec-index-row 先例同构 · 零口径硬编码）；备选独立子命令弃（新增命令表面 + 单独接线 · 违背最小实现）。
5. **D-23-W2-W7-EXEMPTION 本 task R2 定稿**：SPEC §5.2 两选一选定「数据豁免过渡」——known_gaps 三宿主入数据（until_wave: W7 · [A]#4 出处注记）+ **失陈债机检自执行**（豁免宿主双双命中即 exit 2 报债 · 强制 W7 关账摘除）→ main 不长期红 + 截止条件机检强制。
6. 非范围显式列：通用框架 / http 远端 / 不存在目标死链 / docs 全深度 / promotion 物料 / **根 README 宿主行修复归 W7①** / 引擎架构 / --force 禁新增 / RELEASING 措辞 / host schema / S2 写 / W3–W7 / 发版动作。
7. 验收 9 条全部机械可断言（①–⑤ 对齐 SPEC 02 §7 修订五条 · ⑥ F-W2-05 失陈债机检实证 · ⑦–⑨ TEST-LOCK / gate-check+close / 提交边界）。
8. failure_paths 8 行（F-W2-01..05 对齐 SPEC §8 修订版 + F-W2-06 映射缺失 failClosed + F-W2-07 不存在目标不判 + F-T-01 闸纪律）+ R0–R5 思考轮槽 + 控制表（early_stop=R5 · residual_risks ×3）。
9. `node bin/specgate.js task lint --file docs/tasks/active/task_2_3_wiring_w2_pin_dimensions.md` → **PASS**（W3 自检结论占位符警告 · draft 期合法 · close 前回填）。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / `package.json` / 任何文档面（30 的事 · 且 HG-AUDIT-R1=pending）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 git tag / push / npm publish（仅人）
- 未扩大范围到 W3–W7 · 未碰 RELEASING.md / host-adapt schema

## 下一棒

20-task-audit R1 书面审 → 审查文落盘 `docs/harness/reviews/` → **签 HG-AUDIT-R1=approved**（2026-09-12 维护者会话授权 00 代签）→ 30/40（`feat(2.3-W2): …` · 禁 git add -A · 禁 tag/push/publish）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w2_pin_dimensions.md` 过闸扫描。
