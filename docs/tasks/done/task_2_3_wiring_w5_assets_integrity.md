# Task：2.3 W5 · A2 资产完整性校验（assets integrity · sha256.manifest + assets verify + 修复 + 门禁接线）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-13）  
> **wave**：W5（2.3.0 接线补全 · A2 资产完整性校验）  
> **关联 SPEC**：[`docs/spec/2_3-wiring-completion/05_w5_assets_integrity_v1.md`](../../spec/2_3-wiring-completion/05_w5_assets_integrity_v1.md)（**唯一蓝本** · signed · HG-SPEC-SIGNOFF=approved）· [`00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-3-wiring-w5-assets-integrity` |
| **test_strategy** | `required` |
| **test_strategy_note** | 篡改/missing/extra 三档负向 exit 2 + manifest 缺失/语法坏 failClosed + 修复 dry-run 零写盘/--yes 收敛/二次幂等 + tarball 含 manifest；bin 面真实命令验收为硬条款（W3 教训）· lib-smoke 钉面 |
| **freeze_id** | 2.3.0-W5 · D-23-W5-GEN-CMD（生成=显式命令非 build 钩子）· D-23-W5-FIX-TARGET（修复对象=manifest · 资产永不反向改）· D-23-W5-NOBAK（manifest 派生数据不写 .bak） |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | CLI 新子命令 + 数据文件（manifest）· 不改架构图谱 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 资产完整性机检与门禁接线 · 非编码规范/流程增量 · 无 wiki 落点 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.1.2/2.2/2.3-W1–W4 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表 |
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表（SPEC 05 signed） |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-12 维护者会话授权） |
| **HG-AUDIT-R1** | **approved** | 30 | **2026-09-12 维护者会话授权 00 代签** · 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w5_assets_integrity_audit_R1_20260913.md` · 非阻塞观察 ×3） |

---

## 背景与目标

SPEC 05（signed）：路线研究 T-03——本包分发的核心价值是 `assets/` 下提示词/模板/适配表资产，但无 sha256 清单、无 `assets verify`，**提示词供应链投毒完全不可检测**（npm 包被篡改 / 镜像污染 / 本地资产被意外改写三场景均无机制发现）。事实卡 §11 现行列禁称：落地前只能说「将新增/规划中」；本波落地后**本波也不改对外文档宣称**（口径变更归维护者 · W4 评审文 §6 已定）。

**R0 前提复核（本棒已实测 · SPEC 05 前提全部成立）**：

- `assets/` 无 sha256.manifest · 全 src/bin 无 `assets` 子命令（grep 实证 `cmd === 'assets'` 零命中 · runCli 分发表 :1220-1292 无 assets 分支）。
- 接线点位现状：`package.json` prepublishOnly 链尾 = `node bin/specgate.js pins check`（:42）· `.github/workflows/ci.yml` test job 末步 = pins check（:34）——W5 与 pins 同点位追加。
- files 白名单已含 `assets`（package.json :28）→ tarball 覆盖 manifest 无须改 files；`npm pack --dry-run` 基线 184 文件（实测）。
- 资产摸底：110 文件 · 512K · 无 symlink · 无 .bak/真临时文件/dotfile（`grep -iE 'tmp|temp'` 仅命中 templates 目录名误报）；全量 sha256 实测 **16ms**（F-W5-05 秒级内 · 远超阈值余量）。
- 基线实测（干净树）：`npm run typecheck` 0 错 · `npm test` **513/513** · `pins check` **17/17** PASS。

**已定案（冻结 · 不得翻案）**：

- **D-23-W5-GEN-CMD**：manifest 生成走**显式命令**（`assets manifest rebuild --yes`），**不挂 build/prepare 钩子**——若构建链自动重生成，门禁永不可红，与 SPEC 05 §5.1「工作树内 manifest 须与 assets 同步——这正是门禁存在的意义（改了 assets 没重生成就红）」自相矛盾；SPEC 验收④「破坏后对应步骤红」要求门禁点位 verify-only。SPEC §5.1「构建期生成」按「生成能力随包交付 · 改 assets 后必跑生成命令（F-W5-03 文档写明）」解读落实。
- **D-23-W5-FIX-TARGET**（SPEC §5.3 同构 pins）：修复对象 = manifest（声明），**资产是真值永不反向改**；修复命令零网络绑定。
- **D-23-W5-NOBAK**：manifest 重生成**不写 .bak**——manifest 是派生数据（可随时从资产重算 · git 即备份）；pins fix 的 .bak 语义针对手工真值文件，不适用于派生声明；且 .bak 落 assets/ 会被排除清单覆盖但徒增噪音。
- **D-23-W5-EXCLUDE**（F-W5-06 数据化）：排除清单 = manifest 自身（`sha256.manifest`）+ `*.bak` + `*~` + `.DS_Store`；生成与 verify 双侧消费同一常量（单一实现源 · 一致由构造保证）。

## 范围

- [x] ① **`src/cli-assets.ts` 新增**（单一实现源）：资产遍历（排除清单 D-23-W5-EXCLUDE · posix 相对路径 · 确定性排序）· sha256 计算 · manifest 生成/解析/比对（ok/mismatch/missing/extra 四态）。
- [x] ② **`spec-wave assets verify` 子命令**：`[--target PATH] [--json]`；逐文件比对 → 全 ok exit 0 · 任一偏差 **exit 2**（failClosed · D-PINS-EXIT 同语义）；manifest 缺失/语法坏 exit 2 指 manifest 本身（F-W5-01）；assets 目录缺失 exit 2 不静默（F-W5-02）；`--json` 输出每文件 status + counts；cli.ts 分发 + usage 行。
- [x] ③ **`spec-wave assets manifest rebuild`**：`[--target PATH] [--yes]`；默认 **dry-run**（打印将更新/新增/移除条目数 · 零写盘）· `--yes` 写 `assets/sha256.manifest`（唯一写盘对象 · 永不改其他资产 · 无 .bak）· 幂等（内容一致报无变化）。
- [x] ④ **`assets/sha256.manifest` 首版生成落盘**：逐行 `<sha256>  <posix relpath>`（sha256sum 生态一致 · 两空格分隔 · 确定性排序 · manifest 自身不入清单）。
- [x] ⑤ **CI + prepublishOnly 接线（verify-only 点位）**：package.json prepublishOnly 链尾 pins check 后追加 `&& node bin/specgate.js assets verify`；ci.yml test job pins check 步后追加同名步（与 pins 同点位同门禁语义 · D-23-W5-GEN-CMD 下破坏即红）。
- [x] ⑥ **测试**：新增 `test/cli-w5-assets-integrity.test.ts`（/tmp 靶场 fixture：篡改/missing/extra/manifest 缺失/manifest 语法坏/assets 目录缺失/dry-run 零写盘/--yes 收敛/二次幂等/--json 键集/排除清单双侧一致）；lib-smoke 增 assets verify 本仓 dogfood 钉面（bin 面 · W3 教训）。
- [x] ⑦ **CHANGELOG**：Unreleased `### Added` 一条（新子命令 + manifest + 门禁接线 · 未发布口径）；**README/README.zh-CN/事实卡/一切对外文档宣称零改动**（SPEC §5.4 · 解禁归维护者）。
- [x] ⑧ **tarball 验证**：`npm pack --dry-run` 含 `assets/sha256.manifest` 且相对基线无新泄漏（files 白名单 assets 已覆盖 · 只增 1 文件）。

## 非范围

| 项 | 理由 |
|----|------|
| 签名 / 密钥体系（Sigstore · GPG）· 外部遥测 / 在线比对 | SPEC 05 §4 · 零云纪律 |
| `src/` `bin/` 代码完整性 · 消费者仓 `.coding-kit/` 落盘物校验 | SPEC 05 §4 · 对象=包内资产 |
| **README 双语 / 事实卡 / 任何对外文档宣称变更**（含「已支持 sha256 校验」类表述） | 事实卡 §11 解禁归维护者（W4 评审文 §6 · SPEC §5.4）· 本波零文案动作 |
| **RELEASING.md 任何改动** | 双重敏感（pin-07 + 九步顺序测）· 与 W2/W3/W4 同例 |
| 生成挂 build/prepare 钩子自动重生成 | D-23-W5-GEN-CMD（自动重生成消解门禁意义） |
| pins 并入为新 extract kind | SPEC 05 §6 弃选（语义族不同） |
| 修复 = 从 npm 重新拉取资产 | SPEC 05 §6 弃选（网络绑定） |
| npm publish / tag / push / minor bump 2.3.0 | 仅人 · 发版属独立波次 |
| 给任何既有门禁加 `--force` / `--allow-*` | P0-GATE 硬纪律（00 §2） |
| host-adapt schema 任何改动 | 00 §3 · 触即 STOP 上报 |
| S2 目录任何 CLI 写 | 00 §1 · 机械拒写无豁免 |

---

## 失败路径（failure_paths · 对齐 SPEC 05 §8 + 本 task 增补）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W5-01 | manifest 缺失 / 语法坏 / 重复路径行 | verify exit 2 · 报错指 manifest 本身（failClosed · F-A1-01 同构） | 是 | ASSETS: BLOCKED 指明 manifest |
| F-W5-02 | assets 目录缺失 | verify/rebuild exit 2 · 不静默通过 | 是 | ASSETS: BLOCKED 指明目录缺失 |
| F-W5-03 | 改 assets 未重生成致工作树红 | rebuild 收敛（设计内场景 · 非缺陷）；CHANGELOG/task 写明「改 assets 后必跑 rebuild」 | 是 | verify 红 → rebuild --yes → 绿 |
| F-W5-04 | 跨平台路径分隔符差异 | manifest 内路径 posix 化（`/`）；verify 比对前 `normalizeSlashPath` 归一 | 是 | 无（设计内吸收） |
| F-W5-05 | 大文件性能 | 全量哈希实测耗时入自检（基线 110 文件 16ms · 秒级内） | — | 自检结论表 |
| F-W5-06 | .bak / 临时文件混入 | 排除清单单一常量双侧消费（D-23-W5-EXCLUDE）；测试断言生成/verify 一致排除 | 是 | 测试红 |
| F-W5-07 | bin 面与 src 行为分叉（W3 教训） | verify/rebuild 全部经 `node bin/specgate.js` 真实命令验收 · lib-smoke 钉面 | 是 | 验收实测输出 |
| F-W5-08 | 生成自动化消解门禁（build 钩子自动重生成 → 永不红） | D-23-W5-GEN-CMD 冻结：门禁点位 verify-only · 生成仅显式命令 | — | 验收④破坏实测红 |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（verify 闸扫描阻断） | 是 | 须先 20 R1 + 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑥ 逐字对齐 SPEC 05 §7；⑦⑧ 为本棒纪律性增补（bin 面 / gate-check+close / 提交边界）。

- [x] ① **篡改负向**：改动 `assets/` 任一文件一字节 → `assets verify` exit 2 指出该文件 `mismatch`；贴命令与输出（/tmp 靶场 + 本仓实测双档）。
- [x] ② **missing / extra 两档**：删一个登记文件 → `missing` exit 2；新增未登记文件 → `extra` exit 2。
- [x] ③ **修复收敛**：`assets manifest rebuild` dry-run 零写盘（git diff 为空）· `--yes` 后 verify exit 0 · 二次执行幂等无 diff。
- [x] ④ **门禁点位**：prepublishOnly 链（破坏资产后跑到链尾 assets verify 步红 · exit≠0）与 CI 点位（破坏后同命令红 · yml diff 留证）；恢复后全链绿。
- [x] ⑤ **tarball**：`npm pack --dry-run` 含 `assets/sha256.manifest` 且相对基线 184 文件只增 1 无新泄漏。
- [x] ⑥ 新增测试真失败自证（红→绿留痕）；`npm run typecheck` 0 错 · `npm test` 全绿 · `pins check` PASS 17/17。
- [x] ⑦ **bin 面真实命令验收**（W3 教训）：①–④ 全部经 `node bin/specgate.js`（非仅 src 套件）实测贴输出；lib-smoke 钉面更新。
- [x] ⑧ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_3_wiring_w5_assets_integrity.md` 通过 + `task close --yes` 闭环；提交禁 `git add -A` · 逐路径 add · `feat(2.3-W5): …`。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_3-wiring-completion/05_w5_assets_integrity_v1.md`](../../spec/2_3-wiring-completion/05_w5_assets_integrity_v1.md)（**唯一蓝本** · §3 范围 / §5 设计 / §7 验收 / §8 failure_paths）
3. [`docs/spec/2_3-wiring-completion/00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)（S2 / P0-GATE / RELEASING 双重敏感 / 对外文案纪律 §4）
4. 现状文件：`src/cli-pins.ts`（failClosed/dry-run/--yes/usage 同构蓝本）· `src/cli.ts`（runCli 分发 :1220-1292 · usage :88-127）· `src/cli-shared.ts`（fail/takeOption/normalizeSlashPath）· `bin/specgate.js`（发布入口）
5. 接线点位：`package.json` prepublishOnly（:42）· `.github/workflows/ci.yml` test job（:34）
6. 测试蓝本：`test/cli-w4-gate-wiring.test.ts`（/tmp 靶场 spawn src 模式）· `test/lib-smoke/cli-lib-smoke.test.ts`（bin 面钉面）
7. 参考前波：`docs/tasks/done/task_2_3_wiring_w4_gate_wiring.md`（同制链路 · bin 面硬条款）
8. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w5_assets_integrity.md`（GATE_VERIFY · HG-AUDIT-R1=pending 时**拒开工**）

---

## 测试策略（Harness）

**test_strategy**: `required`

- 负向先行：先写红测（fixture 违规 → exit 2 定档）再实现。
- `test/cli-w5-assets-integrity.test.ts` 用例组（/tmp 靶场 · spawn `--experimental-strip-types src/cli.ts` · 与 W4 测试同模式）：
  - 正向：生成 manifest → verify exit 0 PASS · `--json` status=pass 键集断言。
  - 篡改负向：改一字节 → exit 2 · 输出含 `mismatch` 与路径。
  - missing 负向：删登记文件 → exit 2 含 `missing`；extra 负向：新增未登记文件 → exit 2 含 `extra`。
  - F-W5-01：manifest 缺失 exit 2 指 manifest · 语法坏（非 `<hash>  <path>` 行）exit 2 · 重复路径行 exit 2。
  - F-W5-02：assets 目录缺失 → verify/rebuild 均 exit 2 不静默。
  - 修复：dry-run 后 manifest 内容不变（零写盘）· `--yes` 写后 verify exit 0 · 二次 rebuild 报无变化（幂等）。
  - F-W5-06：`x.bak`/`.DS_Store` 混入资产 → 生成与 verify 双侧同排除（不入清单 · 不判 extra）。
  - F-W5-04：manifest posix 路径在 verify 比对前归一（构造 `\\` 分隔不出现于 manifest · 断言生成内容无反斜杠）。
- lib-smoke 增钉面：bin `assets verify` 本仓 dogfood exit 0 PASS（发布产物最小路径）。
- 既有 513 基线只增不红；pins 17/17。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| `src/cli-assets.ts` | ✅ | 单一实现源：collectAssets（排除清单 D-23-W5-EXCLUDE · posix 路径 F-W5-04 · 确定性排序）· sha256File · renderManifest（sha256sum 行格式）· loadManifest（F-W5-01 缺失/语法坏/重复/越界 failClosed）· runAssetsVerify（F-W5-02 目录缺失优先判）· verify 四态 + --json · rebuild dry-run/--yes/幂等（D-23-W5-FIX-TARGET/NOBAK） |
| `src/cli.ts` | ✅ | import cmdAssets · runCli 分发 assets 分支 · usage 两行（verify / manifest rebuild） |
| `assets/sha256.manifest` | ✅ | 首版落盘 110 条（posix 排序 · manifest 自身不入清单） |
| `package.json` | ✅ | prepublishOnly 链尾 pins check 后追加 `&& node bin/specgate.js assets verify`（verify-only 点位 D-23-W5-GEN-CMD） |
| `.github/workflows/ci.yml` | ✅ | test job pins check 步后追加 assets verify 步（注释留痕门禁语义） |
| `CHANGELOG.md` | ✅ | Unreleased Added 一条（未发布口径 · 注明对外文档口径归维护者）· README/事实卡零改动 |
| 测试 | ✅ | 新增 `test/cli-w5-assets-integrity.test.ts` 9 用例全绿（红→绿自证：分发禁用 9 fail → 恢复 9 pass）· lib-smoke 增 S5 bin 面钉面（6/6）· 522/522 |
| bin 面验收 | ✅ | /tmp/w5-acc 靶场 + 本仓篡改双档全部经 `node bin/specgate.js`（exit 码硬断言） |

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 2026-09-13 · 全部命令真实执行）

**验证命令与退出码**（cwd=仓根 · 另注靶场）：

| 命令 | exit | 结果 |
|------|------|------|
| `node bin/specgate.js verify --target . --task docs/tasks/active/task_2_3_wiring_w5_assets_integrity.md`（开工前 GATE_VERIFY） | 0 | HG-TASK-DRAFT/HG-AUDIT-R1 均 approved（G2 结论级审查文闸通过 · dogfood）· VERIFY: PASS |
| `node bin/specgate.js assets manifest rebuild --target /tmp/w5-acc --yes` | 0 | `[written] assets/sha256.manifest（2 条）` |
| 靶场①篡改一字节 → `node bin/specgate.js assets verify --target /tmp/w5-acc` | 2 | `[mismatch] README.md · actual=4f0afec8227f… expected=02aa4cf66b34…` → ASSETS: BLOCKED |
| 靶场②删登记文件 / 增未登记文件 → verify | 2 / 2 | `[missing] prompts/hat.md` / `[extra] stray.md` 各 exit 2 |
| 靶场③ dry-run → manifest md5 不变（fdec84af…前后一致）· verify 仍 2；--yes → verify 0；二次 rebuild | 0 | `无变化 · 2 条已同步（幂等 · 零写盘）` |
| 本仓①篡改 `assets/README.md` 一字节 → `node bin/specgate.js assets verify` | 2 | `[mismatch] README.md · 1 偏差 / 110 登记`；`git checkout` 恢复后 PASS 110/110（资产为真值 · 不反向改） |
| ④ prepublish 链逐步（typecheck→npm test→build→test:lib→pins check 全绿本树实测）→ 注入篡改 → 链尾 assets verify | 2 | 链在 assets verify 步断红（`[mismatch] standards/README.md`）· 恢复后 exit 0 |
| `npm run prepublishOnly`（全链真跑 · 恢复后） | 0 | typecheck + 522 测试 + build + lib 6/6 + pins 17/17 + ASSETS PASS 全链绿 |
| `npm pack --dry-run --json` | 0 | 188 文件（基线 184 + lib/cli-assets.{js,d.ts,js.map} + assets/sha256.manifest）· manifest 在包 · 泄漏扫描 0 |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **522/522**（基线 513 + 新增 9 · 联改仅 lib-smoke 纯新增 S5） |
| 新增测试红→绿自证 | — | 分发临时禁用 9 fail → 恢复 9 pass（真失败实证） |
| `node bin/specgate.js pins check` | 0 | PINS: PASS · 17/17 |
| `node bin/specgate.js task lint --file docs/tasks/active/task_2_3_wiring_w5_assets_integrity.md` | 0 | LINT: PASS（draft 期 W3 占位符 warn · 回填后零 warn） |

**验收 ①–⑧ 逐条**：① 篡改负向 bin 双档（/tmp 靶场 + 本仓）exit 2 mismatch 贴输出（上表）；② missing/extra 两档 bin 靶场 exit 2（上表）；③ dry-run 零写盘（md5 前后一致）· --yes 后 verify 0 · 二次幂等无变化（上表）；④ 门禁点位：prepublish 链尾注入篡改断红 exit 2 + 恢复全链绿（prepublishOnly 真跑 exit 0）· CI 点位 yml 步追加留证（同命令红绿已证 · CI 实跑归 push 后已知未测项）；⑤ tarball 含 manifest · 188=184+4（3 个 lib 产物 + manifest 本身）· 无泄漏；⑥ 红→绿 9 fail→9 pass · typecheck 0 错 · 522/522 · pins 17/17；⑦ ①–④ 全部经 `node bin/specgate.js` 真实命令 · lib-smoke S5 钉面 6/6；⑧ 见修订记录（gate-check + close · 逐路径 add 无 git add -A）。

**实现期发现留痕**：① verify 初版先判 manifest 后判 assets 目录 → F-W5-02 场景报文指错对象（测试擒获）· 修正为目录缺失优先判；② npm pack 基线 184 → 188 的 +4 全部可解释（新模块 3 个 lib 产物 + manifest 本身）；③ F-W5-05 性能：110 文件 512K 全量哈希 16ms（实测 · 秒级阈值内两个数量级余量）。

**已知未测项**：CI 实跑（push 后由 ci.yml 同命令执行 · 本地同命令红绿均已实证等价）；跨平台（Windows）路径分隔符实机（posix 化有测试断言 manifest 无反斜杠 · 归一复用既有 normalizeSlashPath 实现）。

### KPI（00）

Task_KPI%: 100（验收 8/8 自证通过 · 522/522 含新增 9 · pins 17/17 · bin 面 exit 码硬断言全过 · 红→绿真失败自证 · 对外文档宣称零改动纪律遵守）

### 经验总结

（experience_capture 未声明 required · 关账自愿回填）

---

## 思考轮（10-task）

### R0 · 证据

SPEC 05（signed）为唯一蓝本。前提复核本棒全部实测：无 manifest/无 assets 子命令（grep + runCli 分发表实证）· 接线点位现状（package.json :42 · ci.yml :34）· files 白名单已覆盖（:28 · pack 基线 184 文件）· 资产摸底 110 文件 512K 无 symlink 无 .bak/临时文件 · 全量哈希 16ms · 基线 513/513 + pins 17/17 + typecheck 0 错。前提无证伪项。

### R1 · 范围

范围 = SPEC 05 §3 ①–④ 转写为 ①–⑧（②③ 拆分为实现/子命令 · ⑥ 测试 · ⑦ CHANGELOG · ⑧ tarball 验证单列）；非范围 = SPEC §4 五项 + 纪律增补（对外文档宣称 · RELEASING · build 钩子 · pins 并入 · 拉取修复 · 发版动作 · --force · schema · S2 CLI 写）。

### R2 · 方案

SPEC §6 已定：独立 `assets verify` 子命令（荐 · 不并 pins）· manifest 逐行文本 `<hash>  <path>`（荐 · sha256sum 生态）· 修复=重生成 manifest（荐 · 资产为真值）。形态选择（SPEC 授权 task 定）：修复命令采 `assets manifest rebuild` 独立子命令（与 pins check/fix 分离同构 · 职责清晰）而非 `verify --fix`；生成时机采显式命令（D-23-W5-GEN-CMD · 论证见定案节）；排除清单单一常量（D-23-W5-EXCLUDE）；无 .bak（D-23-W5-NOBAK）。

### R3 · 边界

30 开工硬边界 = HG-AUDIT-R1 翻 approved；failClosed 不稀释 = 新闸默认红无过渡档（无存量负担 · 新文件新命令）；对外文档宣称零改动（事实卡 §11）；RELEASING/S2/schema/--force 四纪律入非范围；JSON 为新命令无存量契约；bin 面验收硬条款；提交禁 git add -A。

### R4 · 可测性

验收 8 条全部可机械/可观测：exit 码断言 · mismatch/missing/extra 输出断言 · dry-run git diff 空断言 · 幂等无 diff 断言 · pack 清单断言 · 四门命令 · bin 面实测。无「改完了」式条款。

### R5 · 派工就绪

task 结构满足 lint E1–E8 + G4 思考轮三槽；pre-30 invoke（10/00）同棒落盘。**下一棒**：20-task-audit R1 书面审（落盘 docs/harness/reviews/ + invoke_\*_20_\*）→ HG-AUDIT-R1 签闸（2026-09-12 维护者会话授权 00 代签）→ GATE_VERIFY → 30/40。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC signed + 前提复核全实测 + 资产摸底 + 基线 513/513） | no |
| R1 | 范围/非范围划定（SPEC §3/§4 + 纪律增补） | no |
| R2 | 方案定稿（独立子命令 + rebuild 形态 + 显式生成 + 排除清单常量 + 无 bak 四定案） | no |
| R3 | 边界八条（开工闸 / failClosed / 文案纪律 / RELEASING / S2 / schema / bin 面 / 提交）落入 task | no |
| R4 | 验收 8 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此（无评审文前置类阻塞 · W5 非门禁语义变更波 · D-23-W4-REVIEW-FIRST 不适用） | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC 已 signed 且 §6 方案对比定稿主体形态，本帽职责（结构化转写 + 形态选择四定案 + 闸/invoke 配置）闭合，无新增开放问题；W5 属新命令新增非既有闸语义变更，D-23-W4-REVIEW-FIRST 评审文前置不适用。  
**residual_risks**：① manifest 与 assets 同步纪律本质是「又一个要记的关联面」（缓解：门禁强制 · 改了不修 CI/prepublish 即红 · F-W5-03 文档写明）；② 消费仓误跑 `assets verify` 对其无 assets 目录 failClosed 红（缓解：输出指明目录缺失语义 · 该命令定位=包自检/分发源校验 · SPEC §4 消费者侧出范围）；③ `assets verify` 新命令面对未来脚本化消费者的行为演进（缓解：本波即定 exit 码/JSON 键集 · CHANGELOG Unreleased 明示）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-13 | 开单 · 10-task · 蓝本 SPEC 05（signed）· R0 前提复核全实测成立（无证伪项）· D-23-W5-GEN-CMD/FIX-TARGET/NOBAK/EXCLUDE 四定案 |
| 2026-09-13 | 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w5_assets_integrity_audit_R1_20260913.md` · 非阻塞观察 ×3）· HG-AUDIT-R1 approved（2026-09-12 维护者会话授权 00 代签） |
| 2026-09-13 | W5 实现落地 · 30+40 闭环：cli-assets 单一实现源 + assets verify/manifest rebuild 子命令 + manifest 110 条落盘 + CI/prepublishOnly verify-only 接线 + 9 新测 + lib-smoke S5 · 验收 ①–⑧ 自证全过（522/522 · pins 17/17 · bin 双档靶场）· gate-check PASS + close --yes 归档 |
