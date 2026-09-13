# invoke · 30+40 · 2.3 W6 B4 六宿主补齐实现与自证（适配表 +6 · pin-17 数据面 · 零新资产 · bin 面全链路实测）

> **hat_id**：`30-execute-code` / `40-self-check`（同 Agent 闭环）· **日期**：2026-09-13  
> **task_slug**：`2-3-wiring-w6-host-completion`  
> **蓝本**：`docs/tasks/active/task_2_3_wiring_w6_host_completion.md`（HG-AUDIT-R1=approved · 2026-09-12 维护者会话授权 00 代签）

## GATE_VERIFY 首输出（30 开工前）

```
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_2_3_wiring_w6_host_completion.md
| HG-TASK-DRAFT | approved | 22, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_2_3_wiring_w6_host_completion.md · EXIT=0
```

## 实现清单

1. **`assets/ide/host-adapt/examples/mvp-hosts.yaml`**：+gemini/opencode/roo/zed/cline/aider 六行（表序旧七+新六）；落点严格按 task 取证卡——gemini=GEMINI.md+`.gemini/skills` · opencode/zed=AGENTS.md+`.agents/skills` · cline=AGENTS.md+`.cline/skills` · roo/aider=AGENTS.md+skills 不物化；commands 全六行 `[]`；注释写明复用口径与 aider 降级标注。
2. **`src/cli-host.ts`（唯一 src 改动 · +5/-1）**：`isMarkdownMergeTarget` 白名单 +GEMINI.md。触发过程：新测试「GEMINI.md marker 块须唯一」红（0≠1）→ 定位 :626 白名单仅 CLAUDE.md/AGENTS.md → 不入则 gemini always_on 退化裸拷贝（无 marker · 升级整文件覆写 · 违背 SPEC §5.2 marker merge 幂等前提）→ 按 D-23-W6-NO-SRC 检视条款核查：**非 schema 变更**（schema 零改动）→ 一行扩展 + 注释留痕。**负向测试先行的实证价值**（若不钉 marker，此缺陷静默通过）。
3. **`assets/release-pins.yaml` pin-17 纯数据**：host_hits +6 词锚（gemini=`Gemini` · opencode=`opencode` · roo=`Roo Code` · zed=`Zed` · cline=`Cline` · aider=`aider`）· known_gaps +6 四字段条目（since_wave: W6 · until_wave: W7）· D-23-W2-W7-EXEMPTION 注释修订（三旧+六新 · W7 统一关账）。pins 代码零改动。
4. **`assets/ide/host-adapt/README.md`**：矩阵 +6 行 + 2.3 W6 取证说明段（逐宿主 + aider 降级如实标注）· CLI 行/TTY 行词表 13 · pin-11/12 落点零新增。
5. **`test/host-adapt-w6-2_3-six-hosts.test.ts`**（新增 12 测）+ TEST-LOCK 联改三处（w6-three-hosts 表序改前缀式 · update/sticky all 列表 7→13 · pins-consistency pin-17 键集 13/豁免 9/词锚逐字/四字段断言）。
6. **`CHANGELOG.md`** Unreleased Added 一条（未发布口径）。
7. **`assets/sha256.manifest`** rebuild --yes ×2（110 条 · 文件数不变 · hash 随内容）→ assets verify 110/110 PASS。
8. **DEF-009 联动实证**：取证注释初版含 `docs/cli/creating-skills.md` 仓内相对路径形 token → DEF-009 悬空引用机检红（3 处）→ 改述官方文档名转绿。

## 验收自证（逐条 · 全部真实命令 · bin 面经 `node bin/specgate.js`）

| 命令 | exit | 结果 |
|------|------|------|
| `node bin/specgate.js verify --target . --task …w6_host_completion.md` | 0 | VERIFY: PASS（开工闸 · 双 approved 与声称一致） |
| 先红：新套件首跑 | 1 | 9 红「适配表缺 host_id: gemini」→ 落表后 12/12 绿（红→绿留痕） |
| `node bin/specgate.js host validate` | 0 | HOST VALIDATE: PASS（13 行适配表） |
| `host apply --tools gemini,opencode,roo,zed,cline,aider --target <tmp> --dry-run` | 0 | planned 34 = AGENTS.md+GEMINI.md+四宿主官方 skills 目录 · **零写盘**（tmp 目录 ls=0）零粘性 |
| 同参 `--yes` | 0 | HOST APPLY: PASS · AGENTS.md/GEMINI.md marker 块各唯一（grep -c=1）· `.gemini/skills`/`.cline/skills`/`.agents/skills` 六帽物化 · roo 无 `.roo` 目录（不强造目录实证）· dry-run planned==--yes written（测试钉死 F-W6-03） |
| `host update --yes`（无 --tools 读粘性） | 0 | HOST UPDATE: PASS · 粘性六宿主 · 幂等 skip_identical 零写入零 conflict（测试钉死） |
| `host apply --tools all --dry-run --json` | 0 | hosts(13)=dsh,cursor,claude,agents,copilot,codex,windsurf,gemini,opencode,roo,zed,cline,aider |
| pin-17 负向：摘 aider 豁免条目 | **2** | `[mismatch] pin-17 … aider · 缺 README.md（EN 侧） · aider · 缺 README.zh-CN.md（ZH 侧）` → 还原后 PASS（F-W6-05 机制实证 · 不绕过校验） |
| `node bin/specgate.js pins check` | 0 | `PINS: PASS · 17/17` · pin-17=`13 宿主校验 · 4 双语命中 · 过渡豁免 copilot@W7,…,aider@W7 ×9` |
| `node bin/specgate.js assets manifest rebuild --yes` + `assets verify` | 0 | 110 条（+0/-0 增删 · hash 随三资产文件更新）· ASSETS: PASS 110/110（F-W6-08 同步纪律） |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **534/534 pass**（522 基线 + 12 新测 · DEF-009 联动红→绿已含） |
| `npm run build` | 0 | —（bin 面实测均基于新 lib） |
| `npm run test:lib` | 0 | 6/6 pass |
| `node bin/specgate.js task lint-wiki-delta --target .` | 0 | LINT-WIKI-DELTA: PASS |
| `node bin/specgate.js gate-check --task …w6_host_completion.md` | 0 | 闸检查：未发现阻塞 |

**验收 9 条全过**：① 取证卡六宿主（URL+日期+落点+降级标注 · task 内）② validate 13 行 PASS ③ 六宿主 apply/update 全链路实测（上表）④ `--tools all` 含 13 · 新测试 12/12 且先红后绿 ⑤ W2 校验域 13 host_id（pin-17 输出钉字 + 负向摘豁免 exit 2 实证）⑥ 注释复用口径如实 · 对外宣称零改动（git diff 名清单：根 README 双语/RELEASING/事实卡未动 · CHANGELOG 仅 Unreleased 行）⑦ 四门绿 + pins 17/17 + assets 110/110 ⑧ bin 面全经 `node bin/specgate.js` 实测 ⑨ gate-check exit 0（close 后归档）。

**schema 冻结核查（freeze_id / F-W6-04）**：schema 零改动（无 host_id 枚举 · 六行纯数据）；唯一 src 改动为 isMarkdownMergeTarget 白名单 +GEMINI.md（非 schema · 检视条款留痕）· **STOP 条款未触发**。

**已知未测项**：六宿主真实 IDE/CLI 内加载行为（属宿主侧运行时 · 本仓只能证落点与官方文档目录约定一致 · 取证卡已逐宿主留出处）。
