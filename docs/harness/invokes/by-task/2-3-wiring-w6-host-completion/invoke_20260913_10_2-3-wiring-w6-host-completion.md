# invoke · 10-task · 2.3 W6 B4 宿主补齐 task 起草（SPEC 06 转可验收 task · 取证卡前置）

> **hat_id**：`10-task` · **日期**：2026-09-13  
> **task_slug**：`2-3-wiring-w6-host-completion`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-12 会话授权（00 委派 W6 实现棒走完整链路）· HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文 + 签闸 · 本帽不代签）。

## R0 前提复核（本帽实测 · 全成立无证伪）

- 适配表 `mvp-hosts.yaml` 现 7 行；schema `host-adapt.schema.json` 无 host_id 枚举（:27-30 核读）→ 新增六行纯数据，schema STOP 条款预期不触发。
- pin-17 机制已上线（`src/cli-pins.ts` :333-423 readme-host-row 求值器）：F-W2-06 映射缺失数据债 failClosed + F-W2-05 豁免失陈债机检自执行 → 六宿主落地当刻须同步 host_hits + known_gaps。
- 词锚现命中实测（大小写敏感）：`Gemini`/`opencode`/`Roo Code`/`Zed`/`Cline`/`aider` 双语根 README 均 0 命中；`Roo` 裸词误伤 `projectRoot` ×2、`zed` 小写误伤 `materialized` ×1（锚选型入 D-23-W6-ANCHOR）。
- 基线复跑（干净树）：`pins check` 17/17 PASS · `assets verify` 110/110 PASS · `npm test` fail 0（522 基线）。
- **W2「封闭三条」张力裁决**：W2 task 注记「known_gaps 只许三条（W6 新宿主无豁免新债）」写于 SPEC 06 签署前；SPEC 06 §5.3+F-W6-05 明文六 host_id 按 W2 §5.2 过渡口径处理（过渡口径即 known_gaps 机制）· PROMPT 明文「新宿主豁免条目 until_wave 须合理 · W7 统一关账」→ 后签 SPEC + 当棒 PROMPT 双重授权，豁免扩九条（三旧不动 + 六新四字段），非 SPEC 前提证伪，不 STOP，task R0 与本 invoke 双留痕。

## 取证卡（第一交付物 · 本帽前置完成）

六宿主官方文档/官方仓一手取证（2026-09-13 · 非第三方博客）：

| 宿主 | 落点结论 | 官方出处 |
|------|----------|----------|
| gemini | always_on=**GEMINI.md**（AGENTS.md 不在默认 context.fileName · 官方仓 issue #28227）· skills=`.gemini/skills`（自动发现）· commands=[] （TOML 专属格式归 3.0） | github.com/google-gemini/gemini-cli README + docs/cli/creating-skills.md + docs/cli/custom-commands.md |
| opencode | always_on=AGENTS.md · skills=`.agents/skills`（官方 agent-compatible 路径 · 原生 `.opencode/skills` 并存） | opencode.ai/docs/rules/ + opencode.ai/docs/skills/ |
| roo | always_on=AGENTS.md（官方仓 merged PR #10446 · 2026-01-03 · 创始人 mrubens）· skills 不物化（无官方约定）· 原生 `.roo/rules/` 注释标明 | docs.roocode.com/features/custom-instructions + github.com/RooCodeInc/Roo-Code/pull/10446 |
| zed | always_on=AGENTS.md（官方兼容指令文件清单）· skills=`.agents/skills`（官方 project-local） | zed-industries/zed docs/src/ai/rules.md + docs/src/ai/skills.md |
| cline | always_on=AGENTS.md（官方 rules 表「Standard format for cross-tool compatibility」）· skills=`.cline/skills`（官方 recommended workspace） | docs.cline.bot/features/cline-rules + docs.cline.bot/customization/skills |
| aider | **降级**：always_on=AGENTS.md 复用 + 如实标注（官方约定=CONVENTIONS.md 显式 `--read`/conf · 无自动加载 · issue #4363 open 佐证）· skills 不物化 | aider.chat/docs/usage/conventions.html + github.com/Aider-AI/aider/issues/4363 |

## 动作

1. 起草 `docs/tasks/active/task_2_3_wiring_w6_host_completion.md`（蓝本 SPEC `docs/spec/2_3-wiring-completion/06_w6_host_completion_v1.md` · signed）。
2. 预填 Harness 元信息：test_strategy=required / freeze_id=host-adapt schema 冻结（触即 STOP）/ required_invoke_hats=`10,20,30,40,00` / graph_delta=none / wiki_delta=none / close_pr_policy=exempt。
3. 范围七项：① 适配表六行（取证卡为唯一依据）② pin-17 数据面（host_hits+6 · known_gaps+6 四字段 · 注释修订）③ host-adapt README 矩阵/CLI 行/说明段 ④ 新测试套件 + TEST-LOCK 联改四处 ⑤ assets manifest 同步（W5 纪律）⑥ CHANGELOG Unreleased 一条 ⑦ 全链路实测。
4. 五定案：D-23-W6-REUSE（零新资产 · gemini 复用同 fragment 写 GEMINI.md）· D-23-W6-EXEMPT（豁免四字段 until_wave=W7）· D-23-W6-ANCHOR（词锚防误伤）· D-23-W6-NO-SRC（零 src 目标 · TEST-LOCK 联改四例外）· D-23-W6-NO-CLAIM（对外宣称零改动）。
5. failure_paths 九行（F-W6-01..06 对齐 SPEC §8 + F-W6-07 bin 面 + F-W6-08 manifest + F-T-01 闸纪律）+ R0–R5 思考轮（early_stop=R5 · residual_risks ×4）。
6. `node bin/specgate.js task lint --file docs/tasks/active/task_2_3_wiring_w6_host_completion.md` → **PASS**（初跑缺 `### 自检结论` 节 E5 fail exit 2 → 补节转绿 · 闸真实有效留痕）。

## 未做（禁区）

- 未改 `src/` / `test/` / `assets/` / `package.json` / 根 README（30 的事 · 且 HG-AUDIT-R1=pending）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 git tag / push / npm publish（仅人）
- 未碰 RELEASING.md / host-adapt schema / 根 README 双语宿主表（W7①）

## 下一棒

20-task-audit R1 书面审 → 审查文落盘 `docs/harness/reviews/` → **签 HG-AUDIT-R1=approved**（2026-09-12 维护者会话授权 00 代签）→ 30/40（`feat(2.3-W6): …` · 禁 git add -A · 禁 tag/push/publish）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w6_host_completion.md` 过闸扫描。
