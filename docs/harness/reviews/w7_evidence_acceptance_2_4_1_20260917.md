> **provenance · 3.0 W7 S7.8 证据镜像**（硬约束 14 · F-W7-04）
> 来源（仅本地草稿 · 非 tracked）：.workbuddy/output/验收报告-SpecWave-2.4.1.md · 验收报告 · SpecWave 2.4.1
> 镜像日期：2026-09-17 · 文件名带来源+日期 · **内容不改写**（仅本头部注记）· 以 tracked 镜像为真值面。

---
# 验收报告 · SpecWave 2.4.1（patch · 2.4.0 验收报告 NEW-1/2/3/9 修复）

| 项 | 值 |
|---|---|
| 验收对象 | `spec-wave@2.4.1`（npm 已发布）+ 仓库 HEAD `3ef69ad` |
| 发布 tag | `v2.4.1` → `c89f92d`（`fix(2.4.1): 验收报告 NEW-1/2/3/9 修复 + bump`） |
| 验收方法 | 机械面实测 + 真 tarball 取证 + **四修复项独立复攻**（自写探针，不采信自述）+ **环境对照实验** |
| 基线对照 | `.workbuddy/output/验收报告-SpecWave-2.4.0.md`（NEW-1/2/3/9 出处 · §6.1 建议 2.4.1） |
| 验收日期 | 2026-09-15 |

---

## §0 结论（定稿）

**判定：PASS-with-issues（有条件通过）。较 2.4.0 显著收窄：无 P1，仅 3×P2 + 3×P3。**

- **机械面全绿**（含环境对照后）：三向版本一致 · 真实 tarball 188/坏文件 0 · `pins check` 17/17 · `assets verify` 110/110 · `npm test` **596/595 pass/0 fail/1 skip exit 0** · `check-pack-hygiene` PASS。
- **四项修复全部真落地**，且**主形态均独立复攻确认封堵**：
  - **NEW-1**（否定守卫）：`不予通过` / `不 通过` / `NO PASS` / `rejected` 全部转红 ✅
  - **NEW-2**（路径基）：`task lint` 跨目录相对化**真修好**；`printJson(process.cwd())` **0 命中** ✅
  - **NEW-3**（pin-16 HTML）：双引号 / 单引号 / 大写 / 属性序**全部转红** ✅
  - **NEW-9/N9**（pin-08）：**N9 原攻击（同格 `v2.4.1` 顶包）真闭环**，外加 `-beta` / `2.4.10` / 全删全部转红 ✅
- **但四项各留残余，其中 2 条为 2.4.0 报告未预见的新面**：`NOT PASS`（英文否定变体）· `<a href=X.md>`（无引号属性）· `host validate` 缺省基仍为 cwd。
- **1 条环境级发现**（非 2.4.1 缺陷，但值得登记）：测试套件与 `pins` 对 `git` 二进制**硬依赖**，本机 `/usr/bin/git`（Xcode license 未同意）导致 **5 测全红 + pin-10 报红**，且错误信息不分档，极易被误判为产品缺陷。

---

## §1 发布面机械项

| # | 检查项 | 命令 | 结果 |
|---|---|---|---|
| 1 | 包版本 | `package.json` | `2.4.1` ✓ |
| 2 | git tag | `git tag -l "v2.4*"` | `v2.4.0` · **`v2.4.1`** → `c89f92d` ✓ |
| 3 | npm 最新版 | `npm view spec-wave dist-tags.latest` | `2.4.1` ✓（三向一致） |
| 4 | 真实 tarball | `npm view spec-wave@2.4.1 dist.tarball` → curl → `tar -tzf` | **188 条**（与 2.4.0 同）✓ |
| 5 | tarball 卫生 | `grep -Ec '\.bak$\|~$\|(^\|/)\.DS_Store$'` | **0** ✓ |
| 6 | 含 GLOSSARY/MIGRATION | `grep -Ec 'GLOSSARY.md\|MIGRATION.md'` | **2** ✓ |
| 7 | 钉点一致性 | `spec-wave pins check` | **17/17 PASS · exit 0** ✓（详见 §2.1 环境说明） |
| 8 | 资产完整性 | `spec-wave assets verify` | **110/110 · exit 0** ✓ |
| 9 | 测试套件 | `npm test` | **596 / 595 pass / 0 fail / 1 skip · exit 0** ✓（详见 §2.1） |
| 10 | 打包卫生门 | `node scripts/check-pack-hygiene.mjs` | PASS · 188 files · exit 0 ✓ |
| 11 | 路径基残留 | `grep -c 'printJson(process.cwd()' src/cli.ts src/cli-host.ts` | **0 / 0** ✓ |

---

## §2 关键方法说明

### 2.1 ⚠️ 环境对照实验（本报告最重要的一节）

**首次裸跑的结果是"红的"**：`npm test` **596 / 590 pass / 5 fail / exit 1**；`pins check` **exit 2 · 1/17 偏差**（pin-10）。

**失败信息原文**（决定性证据）：

```
git init -q: You have not agreed to the Xcode license agreements.
Please run 'sudo xcodebuild -license' ...
69 !== 0
```

本机 `/usr/bin/git` 是 Xcode 的 `xcrun` shim，而 Xcode license 未同意 → 任何 `git` 调用返回 **69**。受影响 5 条用例：

| # | 用例 | 依赖 |
|---|---|---|
| 35 | R-07 refresh-ide-blocks | `git init -q` |
| 36 | DEF-029 无 marker 文件旧字面仅报告 | git 仓构造 |
| 101 | W1-A1 release pins · A组 真实仓钉面一致 | pin-10 |
| 103 | 2.3-W1 pins hardening | pin-10 |
| 111 | release tag identity · git tag ↔ package.json | git tag |

**对照实验**（把可用 git 前置到 PATH 后重跑）：

| 命令 | 裸跑（坏 git） | 对照（homebrew git） |
|---|---|---|
| `npm test` | 596 / 590 pass / **5 fail** / exit 1 | **596 / 595 pass / 0 fail / 1 skip / exit 0** |
| `pins check` | **exit 2**（pin-10 `[extract_error]`） | **17/17 PASS · exit 0** |

**结论**：5 条失败与 pin-10 报红 **100% 为环境产物，非 2.4.1 缺陷**。对照结果与 2.4.1 ACCEPTANCE 档自述（"打 tag 后复跑 595 pass / 0 fail / pins 17/17"）**逐字吻合**。

→ 由此产生一条新登记项 **[P3] 见 §3.4**：套件对 git 的硬依赖缺可诊断性。

### 2.2 复攻方法

四项修复**不采信 commit message 与 ACCEPTANCE 档自述**，一律自写探针独立复测：

- **NEW-1 / NEW-9**：`node --experimental-strip-types` 直调真实 `evalReviewConclusion` 与真实 CLI（13 组构造）
- **NEW-3 / NEW-9**：临时改写 `README.md` / `docs/spec/README.md` 后跑真实 `pins check`，逐形态取 exit code，**finally 还原并校验 `git status` 干净**
- **NEW-2**：真实 CLI 跨目录调用（cwd=仓库根 vs cwd=`/tmp`）+ 显式 `--target` + `/private` symlink 形态

---

## §3 四项修复复攻结果

### 3.1 NEW-1 · 结论门禁否定守卫（**主形态闭环 · 4 处残余**）

| 构造 | 2.4.0 报告期望 | 2.4.1 实测 | 判定 |
|---|---|---|---|
| A 合法通过（对照） | PASS | **PASS** | ✓ 零回退 |
| B `不予通过`（原攻击） | FAIL | **FAIL** | ✅ 封堵 |
| C `未通过`（字面连续） | FAIL | **FAIL** | ✓ |
| D `不 通过`（空格断链） | FAIL | **FAIL** | ✅ 封堵 |
| E `NO PASS` | FAIL | **FAIL** | ✅ 封堵 |
| L `rejected` | FAIL | **FAIL** | ✅ 封堵 |
| F 结论节只写"通过" | FAIL | **FAIL** | ✓ S1·N=20 生效 |
| **G `NOT PASS`** | — | **PASS** ❌ | **未覆盖**（`no\s*pass` 不含 "NOT PASS"） |
| H `不予以通过`（插 2 字） | — | FAIL | ✓ 窗内 |
| **I `不最终予以通过`（插 4 字）** | — | **PASS** ❌ | **窗宽 `{0,3}` 不足** |
| **J `未能够予以通过`（插 4 字）** | — | **PASS** ❌ | 同上 |
| **K `不\n通过`（换行）** | — | **PASS** ❌ | 已声明残余（R1 §3-1 · 归 3.0） |
| M 否定+通过并存 | FAIL | **FAIL** | ✓ |

### 3.2 NEW-2 · `--json` 路径基（**主线闭环 · 1 处接口面残余**）

| 场景 | 实测 `file`/`dest` | 判定 |
|---|---|---|
| `task lint --json` cwd=仓库根 | `docs/tasks/done/task_2_4_1_patch.md` | ✓ 相对 |
| **`task lint --json` cwd=`/tmp`** | `docs/tasks/done/task_2_4_1_patch.md` | ✅ **相对（真修好）** |
| `task lint` 人类输出 cwd=`/tmp` | 绝对路径出现 **0** 次 | ✅ |
| `host validate --json` cwd=仓库根 | `assets/ide/host-adapt/examples/mvp-hosts.yaml` | ✓ 相对 |
| **`host validate --json` cwd=`/tmp`（缺省）** | `/Users/cyning/…/mvp-hosts.yaml` | ❌ **仍泄漏** |
| **`host validate --json --target <repo>` cwd=`/tmp`** | `assets/ide/…/mvp-hosts.yaml` | ✅ 相对（新参数生效） |
| `host validate --file /private/tmp/../../…` | 绝对 | ❌ 同型 |
| `grep -c 'printJson(process.cwd()'` | `cli.ts:0` · `cli-host.ts:0` | ✅ 全清 |

> **定性**：`task lint`/`task close` 的基参改用 **task 文件所在仓根 `findGitRoot` 上溯** → 真修好。`host validate` 走的是 **additive `--target`（缺省 cwd）** 路线 —— 缺省调用下"任何 `--json` 不得含绝对路径"的规则**仍被违反**。

### 3.3 NEW-3 / NEW-9 · pins 覆盖（**主形态闭环 · 各 1 处残余**）

**pin-16**（靶：`README.md` 追加指向白名单外 `AGENTS.md` 的链接）：

| 形态 | 结果 |
|---|---|
| inline `[x](AGENTS.md)` | 报红 exit 2 ✓ |
| inline 尖括号 `[x](<AGENTS.md>)` | 报红 ✓ |
| refstyle `[r1]: AGENTS.md` | 报红 ✓ |
| **HTML 双引号 `<a href="AGENTS.md">`** | **报红 ✓（NEW-3 修复生效）** |
| **HTML 单引号 `<a href='AGENTS.md'>`** | **报红 ✓** |
| **HTML 大写 `<A HREF="…">`** | **报红 ✓** |
| **HTML 属性序 `<a target=_blank href='…'>`** | **报红 ✓** |
| **HTML 无引号 `<a href=AGENTS.md>`** | **放行 exit 0 ❌**（合法 HTML5 写法 · 未覆盖） |

**pin-08 / N9**（靶：`docs/spec/README.md:22` 状态格）：

| 变体 | 结果 |
|---|---|
| A 基线 | 放行 exit 0 ✓ |
| **B N9 原攻击：状态格 `2.4.1`→`9.9.9`，同格留 ``tag `v2.4.1` ``** | **报红 exit 2 ✅ N9 真闭环** |
| C 解耦：`9.9.9` + 同格把 `` `v2.4.1` `` 改 `` `2.4.1` ``（去 v 前缀） | 放行 ❌ |
| D `2.4.1-beta` | 报红 ✓ |
| E `2.4.10`（加长） | 报红 ✓ |
| F 状态格全删版本串 | 报红 ✓ |

> **C 的性质**：边界正则解决了"邻接顶包"，但**版本串仍未与发布态措辞绑定** —— 状态格里任意位置出现边界完整的 `2.4.1` 即算合格行。属已登记的"判据语义化"议题（归 3.0）。

---

## §4 本轮新发现（3×P2 + 3×P3）

> 四项修复的**残余**统一登记于此，避免与"修复未落地"混淆。

### P2

| # | 发现 | 证据 | 建议 |
|---|---|---|---|
| **R-1** | `host validate --json` **缺省**基为 cwd → 跨目录调用**仍泄漏绝对路径** | §3.2 第 5/7 行；commit 自述"缺省 cwd 零回退" | 基参改取 **`--file` 所在仓根**（`findGitRoot` 上溯 · 与 task lint/close 同口径），或至少对仓外文件输出占位而非绝对路径 |
| **R-2** | `NOT PASS` 未被否定词表覆盖 → 判 **PASS** | §3.1 行 G | `no\s*pass` 扩为 `no[tn]?\s*(a\s+)?pass` 或加 `not\s+pass`；建议同批纳入广义否定词表 |
| **R-3** | pin-16 漏扫**无引号** HTML 属性 `<a href=X.md>` | §3.3 pin-16 末行 | `htmlARe` 属性值改 `"([^"]+)"\|'([^']+)'\|([^\s>]+)` 三选一 |

### P3

| # | 发现 | 证据 |
|---|---|---|
| **R-4** | 否定窗口 `{0,3}` 不足 → `不最终予以通过` / `未能够予以通过` 判 PASS | §3.1 行 I/J。建议改"否定词与通过词的**同句共现**"语义判（`不[^。；\n]{0,12}通过`），或与 R-2 一并纳入广义词表 |
| **R-5** | `不\n通过` 换行形态漏网 | §3.1 行 K —— **已由 2.4.1 主动登记归 3.0**（R1 §3-1 裁决留痕） |
| **R-6** | **测试套件与 `pins` 对 `git` 二进制硬依赖，且错误信息不分档** | §2.1。`[extract_error] pin-10 · git 不可用或 target 非 git 仓` 把「git 不存在 / git 执行失败（如 license 未同意，exit 69）/ 非 git 仓 / tag 缺失」**四因混为一谈**；本机场景下 5 测全红 + 门禁红，**极易被误判为产品回归**。建议：① extract_error 分档细化 reason；② 套件加 git 可用性前置探测（不可用则显式 skip 并标注，而非 fail） |

---

## §5 台账对账

| 台账自述（`ACCEPTANCE_2_4_1_patch_2_4_1_zh.md`） | 实测 | 一致 |
|---|---|---|
| `npm test` 595 pass / 0 fail / 1 门控 skip | 对照实验 **595 / 0 / 1** | ✓ 逐字吻合 |
| `pins check` 17/17（打 tag 后） | 对照实验 **17/17 · exit 0** | ✓ |
| 真实 tarball 188 文件 · `.bak`/`*~`/`.DS_Store`=0 | **188 / 0** | ✓ |
| NEW-1 存量波及：76 份审查文 pass/fail 逐字一致（57/19 · 零误伤） | 未独立复跑全量 76 份（采信 + 本报告 §3.1 A/C/F 对照零回退旁证） | ⚠️ 部分核验 |
| 已知残余登记（NEW-4/5/6/7/8/10/11/12 + N5 + `不\n通过`） | 与本报告 §4 残余清单一致 | ✓ |

**非缺陷说明**：HEAD `3ef69ad`（`docs(release): 2.4.1 发布回填`）比 tag `v2.4.1`(`c89f92d`) 多 2 个纯文档/checklist commit，版本号未变 → 属正常发布回填。

---

## §6 处置建议

### 6.1 建议纳入 2.4.2（补丁级 · 三条 P2，均小改）

| 项 | 动作 | 落点 |
|---|---|---|
| R-1 | `host validate` 基参改取 `--file` 所在仓根（`findGitRoot` 上溯；仓外文件回落后保持现有行为并**在 JSON 中标 `outside_repo: true`** 而非直接打印绝对路径） | `src/cli-host.ts`（validate 三面）+ `src/cli-shared.ts` |
| R-2 | 否定词表补 `not\s*pass`（大小写不敏感）；顺带把 R-4 的窗口从 `{0,3}` 放宽为**同句共现**语义判 | `src/cli-checks.ts:REVIEW_NEG_RE` |
| R-3 | `htmlARe` 属性值支持无引号形态 | `src/cli-pins.ts` |

> 三条均为"扩大覆盖面"的单点正则/基参改动，**无架构影响**，符合 patch 语义。

### 6.2 建议并入 3.0.0

见 [`PLAN_3_0_architecture_leap_v1_zh.md`](../../docs/roadmap/PLAN_3_0_architecture_leap_v1_zh.md) **W4（判据语义化统一）**与 **W5（机械清扫与可诊断性）**：

- R-4 / R-5 / pin-16 语义面 / pin-08 版本↔发布态绑定 / NEW-4 / NEW-5 / NEW-10 / NEW-11 → W4
- R-6（git 依赖可诊断性）· NEW-6 / NEW-7 / NEW-8 / NEW-12 → W5

### 6.3 冻结 / 仅人

无新增。`git tag` / `push` / `npm publish` / `deprecate` 维持**仅人**（2.4.1 的 tag+push 系维护者 2026-09-14 书面授权 00 代跑，已留痕）。

---

## §7 总结论

1. **2.4.1 是一次高质量的定点补丁**：四项修复（NEW-1/2/3/9）**全部真实落地**，且**四项的主形态均经独立复攻确认封堵** —— 尤其 N9（2.3.0 遗留的唯一未闭环项）终于真闭环，且 2.4.1 主动做了**存量 76 份审查文的波及抽验**（不静默放过），方法上比 2.3.1 更完整。
2. **判定 PASS-with-issues**：无 P1、无假绿、机械面全绿；残余集中在"覆盖面对齐"（3×P2）与"可诊断性"（1×P3），**均非架构问题**。
3. **一条环境级教训值得沉淀**：本轮"裸跑全红"若不做对照实验，会得出"2.4.1 测试大面积失败"的**错误结论**。**"换可用 git 重跑"这一个动作，把 5 红变 0 红** —— 这是本轮方法上最有价值的一步。
4. 路由不变：**不开 2.5.0**，残余按"补丁 vs 3.0"二分处置；**3.0.0 详细规划已启动**（另见 `docs/roadmap/PLAN_3_0_architecture_leap_v1_zh.md`）。

---

## 附 A 实验卫生

- 全部临时件落 `/tmp`：`/tmp/tb241`（tarball 靶场）· `/tmp/probe-neg-241.ts` · `/tmp/probe-pin16.py` · `/tmp/probe-pin08.py` · `/tmp/sw241-test.log` · `/tmp/sw241-test2.log`。
- 涉及仓库的两份探针（pin-16 / pin-08）均**先备份原文 → 逐变体改写 → finally 还原**，并以 `git status --short` 校验**空输出（干净）**。
- 未写 `docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`（S2 过程域）。
- 未执行 `git tag` / `push` / `npm publish` / `deprecate`。
- 未使用 `--force` / `git add -A`。

## 附 B 证据索引

| 项 | 位置 |
|---|---|
| 否定守卫 | `src/cli-checks.ts:REVIEW_NEG_RE`（2.4.1 放宽为 `不.{0,3}通过\|未.{0,3}通过\|no\s*pass\|reject` · `i`） |
| 长度阈值 | `src/cli-checks.ts:REVIEW_MIN_SUBSTANCE=20` |
| 路径基 | `src/cli.ts`（task lint/close×3/exit-1 信封）· `src/cli-host.ts`（validate×3/emitHostFail）—— `process.cwd()` 已清零 |
| 相对化出口 | `src/cli-shared.ts:relativizeOutputValue`（2.4.1 加 realpath 双侧归一） |
| pin-16 HTML | `src/cli-pins.ts:htmlARe`（`/i` · 仅带引号） |
| pin-08 边界 | `src/cli-pins.ts:dottedExactRe`（`(?<![0-9A-Za-z._-])X\.Y\.Z(?![0-9A-Za-z._-])`） |
| 打包卫生 | `scripts/check-pack-hygiene.mjs` |
| 2.4.1 验收档 | `docs/roadmap/ACCEPTANCE_2_4_1_patch_2_4_1_zh.md` |
| 修复 commit | `c89f92d`（tag `v2.4.1` 指向） |
| 2.4.0 基线 | `.workbuddy/output/验收报告-SpecWave-2.4.0.md` |
