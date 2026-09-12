# invoke · 30-execute-code + 40-self-check · W6 实现闭环（三宿主扩展 B1）

> **hat_id**：`30-execute-code` + `40-self-check`（同 Agent 闭环） · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w6-host-expansion`  
> **帽条文**：`assets/harness/prompts/30-execute-code.md` · `40-self-check.md` · `FRAGMENT_30_gate_verify_v1_zh.md`

## 闸扫描（GATE_VERIFY · 首输出 · 读 task 人工闸表非 invoke 字面）

| human_gate_id | task表status | 用户/invoke声称 | 一致？ | blocks_30 | 30可开工？ |
|---------------|--------------|-----------------|--------|-----------|------------|
| HG-SPEC-SIGNOFF | approved | approved | Y | — | — |
| HG-NEXT-PLAN | approved | approved | Y | — | — |
| HG-TASK-DRAFT | approved | approved | Y | 20,30 | — |
| HG-AUDIT-R1 | approved | approved | Y | 30 | ✅ |

- reviews：`task_2_2_closed_loop_w6_host_expansion_audit_R1_20260911.md` 存在且 R1 pass · 是
- pre-30 invoke：required ∩ {10,20,00} = {10,20,00} 三件齐全（同目录 00/10/20 三件）· 是
- 机械辅助：`npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w6_host_expansion.md` → **VERIFY: PASS（exit 0）**

## 动作

1. 读 task 全文 + 蓝本 SPEC 04 + 06 §W6 + 事实卡 §11 + 帽条文 30/40 + `assets/ide/host-adapt/README.md` + 现 4 宿主演配表 + `src/cli-host.ts`（validate / planApply / assertNotS2Abs 链路）+ W1 task（钉面依赖）。
2. **目录约定取证**（residual_risks 第一条缓解）：官方文档实测 —— copilot 项目级 skills = `.github/skills`（GitHub Docs）；codex repo 级 skills = `.agents/skills`（developers.openai.com/codex 官方 · **非** `.codex/skills`，第三方教程口径过期）；windsurf workspace skills = `.windsurf/skills`（docs.devin.ai/desktop/cascade/skills）。三者原生读 `AGENTS.md` 与调研一致。
3. **schema 冻结核查（F-W6-01）**：host-adapt schema 无 host_id 枚举 · 新增三行纯数据 → **无需改 schema · STOP 条款未触发**。
4. **test_strategy=required 先红**：先写 `test/host-adapt-w6-three-hosts.test.ts`（11 测）→ 红（`host apply 未知 host_id: copilot, codex, windsurf`）→ 再落表。
5. 实现（**零 src 改动** · 验证「加 host 不改代码」链路）：`mvp-hosts.yaml` 追加 copilot/codex/windsurf 三行（always_on 复用 AGENTS.md 片段 · skills 复用 assets/skills/* · commands=[] · verify 同构）；host-adapt README 矩阵 + 词表 + TTY 询问文案三处数据行。
6. 钉面数据（只动数据不改 pins 代码）：`assets/release-pins.yaml` 增 pin-11（host-adapt README `spec-wave@X.Y.Z` regex-all · fixable）+ pin-12（同文件标题版本 `CLI（X.Y.Z）` regex · fixable）。
7. TEST-LOCK 联改断言：`pins-consistency` C组（10→12 行 + fixable 面 + 新增 pin-11/12 形态用例）；`host-adapt-sticky` / `host-adapt-update` 的 `--tools all` 全表断言（4→7 宿主）。
8. 40 自检：验收 9 条逐条自证（命令真实跑 · 输出贴 task 自检结论）→ 回填 task「自检结论（执行者）」+ KPI + 勾选 + 经验。

## 自证摘录（完整输出见交付汇报）

- `node bin/specgate.js host validate` → **HOST VALIDATE: PASS（exit 0）**（含三新宿主的适配表）
- 临时目录 `host apply --tools copilot,codex,windsurf --dry-run` → planned 24 项 = AGENTS.md + `.github/skills`（copilot）+ `.agents/skills`（codex）+ `.windsurf/skills`（windsurf）各 7 文件（6 帽子 SKILL.md + 1 references）· written 0 · **零写盘零粘性**
- 同参 `--yes` → 物化 24 文件 + 粘性 `host_ids=[copilot,codex,windsurf]`；`host update --yes`（无 --tools）→ 读粘性三宿主 · 幂等 skip_identical · **HOST UPDATE: PASS**
- dry-run planned 与 --yes written 集合一致（F-W6-03 · 测试钉死）
- S2 拒写（F-W6-02）：copilot always_on→docs/tasks、windsurf skills→invokes、codex skills→reviews 三向 fixture 均 **exit 2 拒写零落盘**（测试钉死）
- `npx spec-wave pins check` → **exit 0** `PINS: PASS · 12/12 落点一致`
- 四门：typecheck 0 错 · `npm test` **459/459**（447 基线 + 12 新增）· build ✓ · test:lib 4/4 · `lint-wiki-delta` PASS
- `gate-check --task` → exit 0 未发现阻塞

## F-W6-04 口径自查

根 README 双语 / 推广物料**未动**（发布前对外仍 4 宿主表述 · 与已发布包 2.1.3 一致）；仅仓内技术文档（host-adapt README 矩阵 / 适配表注释 / 测试）按落地事实更新，无「7 宿主」宣传数字预告。

## 停点

40 自检全绿 → task close（`--yes` 成功打印 CLOSE: PASS 才算关账）。wiki_delta=none（宿主矩阵落适配表与 README · 不晋升 coding_wiki · note 已在 task 元信息）。
