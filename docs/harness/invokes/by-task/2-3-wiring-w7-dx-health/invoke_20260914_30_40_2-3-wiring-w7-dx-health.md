# invoke · 30+40 · 2.3 W7 DX 与工程健康（README 双语 13 宿主表 · GLOSSARY 两处 · E2 离线 fixture · E5 tsconfig 加严 · pin-17 豁免关账）

> **hat_id**：`30-execute-code` / `40-self-check`（同 Agent 闭环 · 续棒：前任 30 中段两次中断，本棒重验①②后续完③④与收官）· **日期**：2026-09-14  
> **task_slug**：`2-3-wiring-w7-dx-health`  
> **蓝本**：`docs/tasks/active/task_2_3_wiring_w7_dx_health.md`（HG-AUDIT-R1=approved · 2026-09-12 维护者会话授权 00 代签）· SPEC `docs/spec/2_3-wiring-completion/07_w7_dx_health_v1.md`（signed）

## GATE_VERIFY 首输出（本棒开工复跑）

```
$ npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w7_dx_health.md
| HG-TASK-DRAFT | approved | 22, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_2_3_wiring_w7_dx_health.md
```

## 实现清单

**①②（前任棒落地 · 本棒逐条重验属实）**：

1. **`README.md` / `README.zh-CN.md`**：tagline 由「Cursor · Claude Code · optional DSH」扩为 13 宿主概括（`spec-wave@2.2.1` 钉点串不动）；宿主表 4 → 13 行（既有四行行首锚 `| **Cursor** |` 等形态不变 · 新增九行逐字命中 pin-17 词锚）；aider 行「注入层支持」口径（写明 `aider --read AGENTS.md` / `.aider.conf.yml` · 不暗示原生自动加载）· roo 行注明官方仓 merged PR 证据；落点列与 `assets/ide/host-adapt/README.md` 矩阵抽检一致（gemini=GEMINI.md · roo/aider 无 skills 目录）。
2. **`GLOSSARY.md`**：「four gates」按 task 文件级（HG-TASK-DRAFT · HG-AUDIT-R1 —— 现行模板闸表恰 2 行是设计非缺漏）/ SPEC 级（HG-SPEC-SIGNOFF）/ 发版级（HG-RELEASE）三层表述（双语）；「每帽一 prompt 文件」修正为「sync prompts 物化 7 具名帽 · `50-independent-reinspect` 暂无物化 prompt 文件」（双语）；8 帽模型不动；Changelog 节 +1 行。
3. **`assets/release-pins.yaml` pin-17 纯数据**：known_gaps 9 条全摘（`known_gaps: []`）+ D-23-W2-W7-EXEMPTION 注释修订（W7① 已关账 · 机制保留供未来新宿主过渡）；pins 代码零改动。
4. **`test/pins-consistency.test.ts` C 组联改**：豁免集断言 9 → 0（`assert.deepEqual(gaps, [])` · 钉字含关账口径）。

**③④（本棒实现）**：

5. **`test/cli-peer-optional.test.ts`（D-23-W7-E2）**：P1-2 拆分——① 默认离线 fixture：tmp 伪造已安装布局（本仓 `bin/` `lib/` `package.json` `cordis.patch.yml` → `node_modules/spec-wave/` · 运行时依赖闭包 js-yaml→argparse BFS 直拷 · `lib/` 缺失时仓内离线 `npm run build`（tsc 本地 · F-W7-07））；三 bin 名单取自 fixture 内 package.json#bin 实读，`process.execPath` 直跑 `--help` 断言 exit 0 + 输出含 `spec-wave`；默认路径无 registry 访问点。② 原真实 `pnpm add -D file:` 全链路保留为 `SPEC_WAVE_E2E_NETWORK=1` 门控手动测试（默认 skip · F-W7-03 差异写注释）。P1-1 静态断言不动。
6. **`tsconfig.json` + src/ 类型收窄（D-23-W7-E5）**：+`"noUncheckedIndexedAccess": true` 单项加严；62 错 / 11 文件逐一机械收窄（循环界内索引 / 正则捕获组 / split 首元 `!` 钉死 · `?.`/`??` 等价改写 · cli-graph-yaml 键集合类型钉死 phase/doc/infra 纯类型收紧）——**运行时语义零变更 · 不改任何测试语义 · 熔断阈值内（62 ≤ 100 · 11 ≤ 15）**。其余加严项（noImplicitOverride / exactOptionalPropertyTypes 等）不纳入本波（SPEC §6 弃选 · 留此评估结论）。
7. **`assets/sha256.manifest`** rebuild --yes（110 条 · +0/-0/~1 仅 release-pins.yaml hash 变）→ assets verify 110/110 PASS。
8. **`CHANGELOG.md`** Unreleased `### Added` 一条（未发布口径 · 发布头零改动）。

## 验收自证（逐条 · 全部真实命令 · bin 面经 `node bin/specgate.js`）

| 命令 | exit | 结果 |
|------|------|------|
| `npx spec-wave verify --target . --task …w7_dx_health.md` | 0 | VERIFY: PASS（双闸 approved 与声称一致） |
| pin-17 三段留痕①关账前（git worktree HEAD 原样）`pins check --target` | 0 | pin-17=`13 宿主校验 · 4 双语命中 · 过渡豁免 copilot@W7,…,aider@W7 ×9` · PASS 17/17 |
| ②中间态（worktree HEAD + 新双语 README · 豁免未摘）`pins check --target` | **2** | `[mismatch] pin-17 … 9 项偏差（豁免失陈债 F-W2-05 · 逐宿主「双语已双双命中 · 须移除豁免条目」）` · PINS: BLOCKED exit 2（机检自执行实证） |
| ③关账后（摘 9 豁免 · 本仓工作树）`node bin/specgate.js pins check` | 0 | pin-17=`13 宿主校验 · 13 双语命中`（零豁免段）· PINS: PASS 17/17 |
| E5 先红留痕：开开关首跑 `tsc --noEmit` | 2 | **62 错 / 11 文件**（与 R0 预试开量化一致 · 清单留 /tmp 并见 task 自检结论） |
| E5 转绿：逐修后 `npm run typecheck` | 0 | **0 错**（noUncheckedIndexedAccess 生效下） |
| E2 默认套件 `node --test test/cli-peer-optional.test.ts` | 0 | P1-1 ✔ · P1-2 离线 fixture ✔（161ms · 原真装 8s 网络绑定解除）· P1-2-network 默认 skip（门控留痕） |
| E2 门控实证 `SPEC_WAVE_E2E_NETWORK=1 node --test …` | 0 | 3/3 pass（真实 pnpm 链路 2781ms exit 0 · 门控非死代码） |
| `npm test`（全套件） | 0 | **535 tests · 534 pass · 0 fail · 1 skipped**（skipped = P1-2-network 门控 · 534 基线只增不红）· 55.1s |
| `npm run build` | 0 | tsc 通过（bin 面实测基于新 lib） |
| `npm run test:lib` | 0 | 6/6 pass（S0 漂移哨兵含） |
| `node bin/specgate.js assets manifest rebuild --yes` + `assets verify` | 0 | 110 条（+0/-0/~1 · release-pins.yaml hash 随内容）· ASSETS: PASS 110/110 |
| `node bin/specgate.js task lint-wiki-delta --target .` | 0 | LINT-WIKI-DELTA: PASS |
| 版本面零漂移（freeze 双冻结） | — | `git diff --name-only` 无 package.json/RELEASING.md · CHANGELOG diff 无 `## [` 发布头行（grep 实测 0 行）· pin-05/06/07/13 全绿 |

**验收 10 条全过**：① pin-17 三段对照留痕（上表 · exit 2 中间态实证）② README 双语 13 行（pin-17 机检即证 · aider `--read` grep 自证 · 矩阵抽检一致）③ GLOSSARY 与实现一致（`SYNC_PROMPT_FILES` 7 具名帽+3 FRAGMENT+1 TEMPLATE 无 50 · TASK_TEMPLATE 闸行=2 核读）④ E2 默认零网络 + 门控 skip/实证双侧 ⑤ E5 0 错 · 熔断未触发 ⑥ 四门绿（534 基线只增）⑦ assets 110/110 ⑧ 版本面零漂移 ⑨ bin 面真实命令（本表）⑩ gate-check + close（见 task 自检结论收尾）。

**熔断核查（D-23-W7-E5 / F-W7-02）**：62 错 ≤ 100 · 11 文件 ≤ 15 · 零测试语义/运行时行为改动 —— **未触发**。

**疑虑留痕**：① cli-task-extra.ts `--registry` 旗标缺值沿用既有行为（`rest[i+1]!` 不新增 fail 分支 · 与 `--file` 同口径 · 改语义超本波范围）；② 离线 fixture 不覆盖 pnpm peer 解析/.bin shim 生成（F-W7-03 已声明 · 门控真装测试保留）；③ GLOSSARY「现行模板」口径未来漂移为已知边界（F-W7-05）。
