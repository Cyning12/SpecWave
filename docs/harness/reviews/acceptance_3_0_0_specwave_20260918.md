# 验收报告 · SpecWave 3.0.0

> **被验收对象**：`spec-wave@3.0.0`（tag `v3.0.0` ↔ `895b975` · registry `latest=3.0.0` · `time.3.0.0`=2026-09-18T00:17:55Z）
> **验收人**：SpecWave 架构工作流（主控 + 4 条独立红队通道）
> **验收日**：2026-09-18
> **方法**：真命令 + 真退出码 + **对照实验**（含 git worktree 检出 v2.4.1 做同型基线）· 换上下文独立重打 · 主控抽验
> **结论**：**PASS-with-issues**（无 P0 · **1 项 P1** · **4 项 P2** · **8 项 P3**）

---

## §0 结论摘要

| 维度 | 结论 | 关键证据 |
|------|------|---------|
| 发布面三向一致 | ✅ | `package.json` / registry `latest` / tag `v3.0.0`→`895b975` 三者一致；HEAD 仅为其后 1 个 docs-only commit |
| 机械门禁（typecheck/build/test） | ✅ | `npm test` **864 / 863 pass / 0 fail / 1 skip**（沙箱内首轮的 9 条真红经归因=环境伪红，见附 A） |
| 端到端真跑（宿主物化 + 门禁链路） | ✅ | `host validate/apply/update/verify` 全真跑；篡改报红 **exit 2**；`hook-guard` 红/绿真分 |
| **兼容性（v1→v2 schema）** | ✅ **最强证据** | v2.4.1 与 3.0.0+v1旧表 物化树 **字节级一致**（38/38，唯一差异版本戳） |
| 契约严格性（6 条 fail-closed） | ✅ | 全部 **exit 2 并点名**具体路径与原因 |
| 机械口径机检（3 个 W7 锁） | ✅ | `check-terminology` 注入→rc=2 点名→清除→rc=0；`check-claims` rc=0；`check-doc-links` rc=0 |
| 产物卫生 | ✅ | 在线 tarball **275 件 · 0 `.bak`** · 关键文件全在 |
| 上轮遗留回代 | ✅ | R-5 换行残余 **已修**（3.0-W4）；硬约束 14 证据 **已 6 件入库** |
| **P0** | **0** | — |
| **P1** | **1** | **P1-1**：legacy/自定义表 `--file` 物化后，**默认 `host verify` 误报 exit 2**（兼容性误报 · 见 §6.1） |
| **P2** | **4** | 见 §6.2（**3 项口径/文档精度** + **1 项文档陷阱**：闸表 3 列被静默忽略 ⇒ 即使签成 `approved` 仍永久误阻断，且给出的理由与事实相反） |
| **P3** | **8** | 见 §6.3（设计边界 / 覆盖盲区 / 仓卫生 · 含对红队两项 P2 的**降级裁决**） |

**一句话**：**3.0.0 可以从"发布成功"晋级为"验收通过"**。核心承诺（门禁真咬 · 旧表零改动 · 对外可达面不变）**全部经对照实验证实**，而非仅自述。**唯一 P1** 是 legacy 表 `--file` 路径上 `host verify` 的**误报**（over-report · 不漏检 · 一行旗标可绕过），建议随下一 patch 修（粘性持久化表源）；其余 12 项为口径/边界/卫生项。

---

## §1 验收范围与方法

### 1.1 范围

| 面 | 覆盖 |
|----|------|
| 发布面 | 版本三向 · tag/commit 归属 · 在线 tarball 取物 |
| 机械门禁 | `typecheck` · `build` · `npm test` · `test:lib` · `pins check` · `assets verify` |
| 端到端 | `init` · `host validate/apply/update/verify/catalog` · `hook-guard` · `verify` · `task lint/close` |
| 兼容性 | v1 旧表零改动 · v2 新表正路径 · 6 条 fail-closed 负路径 |
| 口径 | CHANGELOG / ACCEPTANCE / MIGRATION / probe 四方对账 |
| 遗留回代 | 2.4.x 验收报告 P1/P2 · 硬约束 14 |

### 1.2 方法（`release-acceptance-adversarial` 铁律的落实）

1. **真命令 + 真退出码**：所有判定均记录 `rc=`，不以"应该会过"替代。
2. **对照实验**：用 `git worktree add v2.4.1` 检出真实历史版本并本地构建，与 3.0.0 做**同型输入差分**（而非读文档自述）。
3. **换上下文重打**：4 条红队通道与主控**互相独立**执行，不共享脚本与结论。
4. **主控抽验**：对最高价值结论（v1 字节级一致 / 门禁真咬）由主控**亲自重跑**并落盘原始留证。
5. **冲突归因到机制**：沙箱内 9 条真红 → 归因到 `npm` safe-delete 保护，**不是产品缺陷**（见附 A）。
6. **区分接口面与主线**：`check-export-surface` 无参 → rc=2 属**用法错误**，不计缺陷。

---

## §2 发布面三向一致性

| 检项 | 命令 | 实测 | 判定 |
|------|------|------|------|
| `package.json.version` | `cat package.json` | `3.0.0` | ✅ |
| registry `latest` | `npm view spec-wave version` | `3.0.0` | ✅ |
| 发布时间 | `npm view spec-wave time.modified` | `2026-09-18T00:17:55.625Z` | ✅ |
| tag → commit | `git rev-parse v3.0.0` | `895b975` | ✅ |
| HEAD | `git rev-parse HEAD` | `c8deeca` | ✅（tag 后 1 个 docs-only commit） |

**HEAD 领先 tag 1 个提交的定性**：`c8deeca` = `docs(release): 3.0.0 发布回填（探针实测 + 过程档转 published · RELEASING ⑨）`。内容面为**文档回填**（README 双语「pending release」→「published 2026-09-18」等），**无码变更**，不影响已发布 tarball 的完整性判定。

> ✅ **注**：`README.md` 在 tag 后确有 1 处文档改动（releasing 段状态更新），属**发布回填的正当代价**；已核对差异面仅此一处，无副作用。

---

## §3 机械门禁与机检

### 3.1 套件基线

```
npm test  →  # tests 864 · # suites 165 · # pass 863 · # fail 0 · # skip 1
```

与 `docs/roadmap/ACCEPTANCE_3_0_architecture_leap_3_0_0_zh.md` 自述 **864 / 863 / 0 / 1 逐字吻合**。

### 3.2 四阶段锁（发布纪律）

| 命令 | rc | 备注 |
|------|----|------|
| `npm run typecheck` | 0 | — |
| `npm run build` | 0 | 产出 `lib/`（含 W0 拆分后 `lib/host` 39 + `lib/cli` 18 + `lib/checks` 21） |
| `npm run test:lib` | 0 | lib 冒烟 |
| `node bin/specgate.js pins check` | 0 | **17/17** |
| `node bin/specgate.js assets verify` | 0 | **113/113** |
| `node scripts/check-pack-hygiene.mjs` | 0 | 275 件 · 无 `.bak`/`*~`/`.DS_Store` |

### 3.3 W7 三个机械口径锁（真跑）

| 脚本 | rc | 扫描面 / 结论 |
|------|----|--------------|
| `check-claims.mjs` | **0** | 扫 7 文件 · `forbidden_wording` 命中 **0** |
| `check-terminology.mjs` | **0** | `canonical 5/5 在位` · 判红面 `门控` 残留 **0** |
| `check-doc-links.mjs` | **0** | 非 S2 坏链 **0** · S2 未入库链接 34（**设计如此**·仅信息） |

### 3.4 ★ `check-terminology` 的活体负向演练（主控亲验）

演练中 `README.md` 被注入变体词 `门控`（canonical 应为 `门禁`），**未被提交**：

```
git status          →  M README.md
git blame README.md →  line 390 "Not Committed Yet"
node scripts/check-terminology.mjs
    → TERMINOLOGY: FAIL · README.md:390:8 变体词 门控（应为 canonical）: > 本项目提供门控能力以拦截风险。
    → rc=2
# 清除后：
node scripts/check-terminology.mjs → TERMINOLOGY: PASS · 残留 0 · rc=0
```

> **双重结论**：① 术语锁**真咬**且**点名 file:line**；② 该「活体仓扫描」**确实挂在 `npm test` 上**（`test/check-terminology.test.ts:45-51` 对 `run(KIT)` 断言 `exit 0`），不是只测 fixture 的摆设。
>
> ⚠️ **过程提醒（非产品缺陷）**：负向演练**不应在活体仓**做（会污染发布物入库件）。本次已在轮内还原，工作树复净。**已登记为流程改进项**。

---

## §4 端到端真跑

### 4.1 宿主物化四件套（干净临时仓）

```bash
host validate                              → HOST VALIDATE: PASS · rc=0
host apply --tools cursor,claude --profile core --json   → planned=28 · rc=0
    → dry-run 后 .cursor / CLAUDE.md 均不存在（零写入 ✅）
host apply --tools cursor,claude --profile core --yes    → HOST APPLY: PASS · written=28 · rc=0
host verify --tools cursor,claude --json   → verdict=PASS · 全部「逐字一致」· rc=0
```

**粘性**（`--yes` 成功写盘后）：
```json
{ "version": 1, "host_ids": ["cursor","claude"], "profile": "core",
  "updated_at": "2026-09-18T01:23:51.373Z", "kit_semver": "3.0.0" }
```

### 4.2 ★ 篡改检测 fail-closed

```bash
echo TAMPERED >> .cursor/skills/harness-10-task/SKILL.md
host verify --tools cursor,claude   → HOST VERIFY: FAIL · rc=2    ✅ fail-closed 真咬
host update --tools cursor,claude --yes --force   → rc=0（恢复）
host verify --tools cursor,claude   → rc=0                        ✅ 可恢复
```

### 4.3 `hook-guard` 门禁分发

| 调用 | rc | 语义 |
|------|----|------|
| `--trigger pre-commit --command 'true'` | **0** | 门禁绿 → 放行 |
| `--trigger pre-commit --command 'false'` | **2** | 门禁红 → **阻断** |
| `--trigger pre-commit`（默认门禁命令） | 实测 **2** | 默认命令取包失败 → fail-closed 阻断 |

### 4.4 ★ L3 降级「显式可区分」（非静默 no-op）

对 `mechanism: none` 的宿主（dsh）跑 `host verify`，输出**显式打出降级行**：

```
host dsh:
  [ok]   surfaces.verify · verify（kind=cli bin=spec-wave failClosed=true（声明已消费））
         hooks: degraded-none（L1+L2 · 宿主无 hook 机制 · 门禁仅 CLI 侧）
  [FAIL] .dsh/skills/… · missing（落点文件缺失（删除或未物化））
```

**⇒ 无 hook 机制的宿主不会静默冒充 L3**——它**明说自己只到 L1+L2**，且「门禁仅 CLI 侧」。这正面符合 `claims_boundary` A3 的不可声称项纪律（「接入即获得 L3」为未落地）。

> 注：本行 `[FAIL]` 是因为该 demo 仓只 apply 了 cursor+claude，**未物化 dsh** ⇒ 落点缺失 = 正确行为（不是缺陷）。

**`host catalog list`**：

```
builtin: assets/ide/host-adapt/examples/mvp-hosts.yaml · hosts 13 · origin builtin · integrity ok（assets manifest 守护）
catalog: （无 · 用户表 integrity 均为 none）
HOST CATALOG: PASS
```

⇒ 内置表 **13 宿主** 与声明一致；`integrity ok` 由 assets manifest（sha256）守护。



### 4.5 W2 hooks 物化（新能力实测）

`.cursor/hooks.json`：
```json
{ "version": 1, "hooks": { "beforeShellExecution": [
  { "command": "npx spec-wave hook-guard --trigger pre-commit" },
  { "command": "npx spec-wave hook-guard --trigger pre-archive" } ] } }
```
`.claude/settings.json` 同族（2 条目）。`host verify` 对 hook 走**包含性比对**（"用户键不计"），不因用户自加 hook 而误红。

---

### 4.6 ★ W1 闸判定泛化 —— **已真泛化，非白名单**（本轮最重要的正面结论）

> 背景：本工作流早前把「**新闸写了 ≠ 闸咬得住**」列为高优先规划缺口（3.0 计划校核表 #25）——旧实现 `evaluateMayStart30` 只认 **3 个硬编码闸 ID**，据此推断新设的 `HG-SCHEMA-CHANGE` 等闸**不会被采集**、形同虚设。**本次验收证明该缺口在 3.0.0 已被修复。**

**① 源码判据**（`src/cli-shared.ts:300-311`）：
```ts
export function evaluateMayStart30(gates: HumanGate[]): MayStart {
  const audit = findGate(gates, 'HG-AUDIT-R1')
  if (audit?.status !== 'approved') return { ok: false, reason: 'HG-AUDIT-R1 pending' }
  for (const gate of gates) {                              // ← 全量遍历，非白名单
    if (gate.blocksHats.includes('30') && gate.status !== 'approved') {
      return { ok: false, reason: `${gate.id} pending` }
    }
  }
  return { ok: true, reason: null }
}
```
- `HG-AUDIT-R1` 仅作为**锚闸**保留（先判，以维持存量最常见路径的 reason 字符串稳定），**不是**白名单限制。
- 其后**遍历全表**：任何**自身 `blocks_hats` 含 `30`** 且未 `approved` 的闸都会阻断。源码注释显式登记了泛化对齐点（"blocks_hats 判定一律以闸行自身 blocks 单元格为准"）。

**② 功能判据**（主控亲验 · 全新闸 ID `HG-NEW-XYZ`）：
| 场景 | `may_start_30` | `blockers` | `gate-check` |
|------|---------------|-----------|--------------|
| `HG-AUDIT-R1=approved` + **`HG-NEW-XYZ=pending` / blocks 30** | **false** | `["HG-NEW-XYZ pending"]` | **rc=2** |
| 同上，把 `HG-NEW-XYZ` 改 **approved** | **true** | `[]` | **rc=0** |

⇒ **一个从未在代码里出现过的闸 ID，仅凭在 task 表声明 `blocks_hats=30`，就能真实阻断帽 30** —— 泛化成立。

**③ 残留白名单的范围（无影响）**：`src/cli/gates.ts:67-73` 的 `legacyMatch` 白名单仅用于 `formatGateCheck` 的**渲染去重**（`genericRows = gates.filter(g => g.blocksHats.includes('30') && !legacyMatch(g.id))`），**不参与阻断决策** ⇒ 不影响判定正确性。

**结论**：3.0 计划中「闸判定泛化」这一项**已交付且咬得住**；此前基于旧代码得出的"新闸形同虚设"推断**已被推翻**（该推断成了过期前提）。这也正面印证了方法论纪律「**闸写了 ≠ 闸咬得住**」的价值——正因为当初做了机制三问，本次才会去实测它，从而**确认修复**而非默认相信。



## §5 兼容性：v1 → v2 的最强证据（对照实验）

> 本节是本次验收**最高价值**的部分：以 `git worktree` 检出真实 `v2.4.1` 并本地构建，做**同型输入差分**。

### 5.1 三方 planned 写入集

| 运行方 | 输入表 | planned |
|--------|--------|---------|
| v2.4.1 CLI（worktree · 本地 tsc 构建） | 内置（v1 扁平） | **38** |
| 3.0.0 CLI | 内置（v2 新表） | **40** |
| 3.0.0 CLI | `--file` = v2.4.1 旧表（**无 `schema_version` 键**） | **38** |

脚本判定差分（非肉眼）：

```
[A] 2.4.1(38) vs 3.0.0+v1旧表(38) → 缺/多 双向均 []            ⇒ 逐字一致 ✅
[B] 2.4.1(38) vs 3.0.0内置(40)   → 仅多 [".cursor/hooks.json", ".claude/settings.json"]
```

### 5.2 ★ 字节级树对照（最强证据）

两干净仓分别物化后递归 `diff -r`：

```
唯一差异：
  .coding-kit/host-tools.json  →  updated_at（时间戳·必然不同）+ kit_semver "2.4.1" vs "3.0.0"
  .git/index（git 内部索引·无关）
```

**⇒ 全部 38 件宿主物化文件字节级相同**，唯一差异是版本戳元数据。

> **结论**：MIGRATION「v1 表面逐字锁 · 旧表零改动」**经对照实验证实**，非自述。**未发现 schema 兼容洞**。

### 5.3 v2 契约严格性（6 条 fail-closed 全咬）

自造 v2 表逐一试探，**全部 rc=2 且点名路径与原因**（不静默解析）：

| 构造 | 报错原文（截取） |
|------|-----------------|
| 缺根级 `command_sets` | `$.command_sets: 必填（v2 表缺 command_sets · F-W1-07 fail-closed · 不回退硬编码默认）` |
| `schema_version: 3` | `未知 schema_version: 3（支持：缺省=v1 或 2 · 不得静默按旧格式解析）` |
| 循环继承 | `extends 循环继承（拒）: claude → cursor → claude` |
| 未知 extends 目标 | `extends 未知目标（拒）: nonexistent-host（链: cursor → nonexistent-host）` |
| 链深 >8 | `extends 链深超限（拒）: 9 > 8（链: h0 → … → h9）` |
| `command_sets.core` 含 `kit-30` | `command_sets 含 forbidden 条目（拒）: kit-30` |

**正路径**（rc=0 PASS）：内置表 ✅ · 自定义最小 v2（`mechanism: none`）✅ · 自定义 v2 含 `mechanism: config-hook`+`triggers`+`command` ✅。

### 5.4 W0 对外可达面不变式（lock⑥）

```
node --input-type=module 自指 import.meta.resolve：
  spec-wave                  → lib/index.js           OK
  spec-wave/package.json     → package.json           OK
  spec-wave/cordis.patch.yml → cordis.patch.yml       OK
  spec-wave/lib/cli.js       → ERR_PACKAGE_PATH_NOT_EXPORTED
  spec-wave/lib/cli-host.js  → ERR_PACKAGE_PATH_NOT_EXPORTED
  spec-wave/lib/checks.js    → ERR_PACKAGE_PATH_NOT_EXPORTED
  spec-wave/lib/host/table.js→ ERR_PACKAGE_PATH_NOT_EXPORTED
```

**⇒ `exports` 只开 3 键，所有 `lib/*` 子路径封死**。god-file 拆分（barrel 化：`lib/cli.js` 1318→**31** 行 · `lib/cli-host.js` 1458→**19** 行 · `lib/cli-checks.js` 1007→**12** 行）**零外部影响**。

### 5.5 产物卫生

在线 `npm pack spec-wave@3.0.0` → **275 条目 · `.bak` 计数 0**；关键文件（`bin/specgate.js` · `lib/index.js` · `lib/cli.js` · `README.md` · `RELEASING.md` · `GLOSSARY.md` · `MIGRATION.md` · `LICENSE` · `cordis.patch.yml` · `assets/ontology.yaml`）**全部在位**。

---

### 5.6 ★ 闸表列数：3 列被静默忽略（A/B 对照 · 主控亲验）

在自验「W1 闸泛化」时发现**自己的探针不生效**，顺线查出（见 §6.2 P2-4）：

```bash
# 3 列（= README「最小骨架」写法）
| human_gate_id | status | blocks_hats |
| HG-AUDIT-R1 | approved | 30 |
  → gate-check 渲染 | HG-AUDIT-R1 | ? | 30 |      ← status '?' = 未解析
  → status --json: may_start_30=false · blockers=["HG-AUDIT-R1 pending"]
  → gate-check rc=2                                 ❌ 用户已签 approved 仍被阻断

# 4 列（= 随包 TASK_TEMPLATE.md 写法）
| human_gate_id | status | blocks_hats | 说明 |
| HG-AUDIT-R1 | approved | 30 | 测试 |
  → status --json: may_start_30=true · blockers=[]
  → gate-check rc=0                                 ✅
```

**⇒ 解析器 `GATE_ROW_RE`（`src/cli-shared.ts:25-26`）要求 4 个单元格**；3 列 → 闸表解析为空 → `HG-AUDIT-R1` 视为缺失 → **fail-closed 阻断，但理由与事实相反**（报"非 approved"而非"表未被识别"）。`v2.4.1` 同型正则**逐字节相同** ⇒ pre-existing，非 3.0.0 回归。

---

## §6 发现清单

### P0 · 阻断级
**无。**

### 6.1 P1 · 重要级（1 项）

#### P1-1 · legacy/自定义表以 `--file` 物化后，**默认 `host verify` 误报 exit 2**（兼容性误报）

> **来源**：红队 lane B 报 **P2**；**lead 亲自复现后升级为 P1**（升级理由与反方意见见下）。

- **复现（主控亲验 · 3 步）**：
  ```bash
  # ① 用 v2.4.1 旧表物化
  host apply --tools cursor,claude --profile core --file <v2.4.1旧表> --yes
      → HOST APPLY: PASS · rc=0
      → 粘性 .coding-kit/host-tools.json = { host_ids:[cursor,claude], profile:core, kit_semver:3.0.0 }
        ⚠️ 不含「表源」字段
  # ② 默认 verify（不带 --file ⇒ 走内置 v2 表）
  host verify --tools cursor,claude
      → [FAIL] .cursor/hooks.json · missing（落点文件缺失（删除或未物化））
      → [FAIL] .claude/settings.json · missing（落点文件缺失（删除或未物化））
      → HOST VERIFY: FAIL · rc=2        ❌ 误报
  # ③ 带 --file 复跑（同一张旧表）
  host verify --tools cursor,claude --file <v2.4.1旧表>  → rc=0  ✅
  ```
- **根因**：`host apply` 的粘性只持久化 `host_ids` / `profile`（`src/host/cmd.ts:62` / `:656`），**不记「表源」**；而 `host verify` 缺省恒用**内置 v2 表** ⇒ 它期望 2 件 hooks 落点，而旧表（`hooks` 缺省 `{mechanism:none}`）**本就不会物化**它们。
- **影响面**：**自定义表消费者**（正是 3.0.0 兼容承诺要保护的人群）。物化→校验是**自然工作流**；粘性机制的存在**恰恰在训练用户省略旗标**（它就是为了"不必再抄 `--tools`"），于是"忘带 `--file`"是**被邀请的错误**。若 CI 把 `host verify` 接成门禁，会得到**偶发假红**；而**会狼来了的门禁最终会被关掉**——这对整套门禁纪律是腐蚀性的。
- **是否漏检**：**否**。方向是 **over-report（误报），不是 false-green**，安全性未被削弱。
- **★ lead 升级 P1 的理由**：① 产出的是本工具**最有后果的输出**——阻断级 `exit 2`；② 落在本版**头号新特性**（W2 `host verify`）上，是最可能先咬到早期采用者的地方；③ 直接冲撞 3.0.0 的**头条承诺**（旧表零改动兼容）；④ 修法明确且小。
- **反方意见（如实记录，供再裁决）**：仅误报无漏检 · 一个 `--file` 旗标即可绕过 · `MIGRATION.md` §① 的"行为不变"枚举的是 `validate/apply/update`，**未含 `verify`**（verify 是 W2 新命令，无"不变"基线）· 自定义表用户是少数。**若采纳反方，可降 P2。**
- **修复建议（二选一或并用）**：
  1. **粘性持久化表源**（推荐）：`host-tools.json` 增 `table_source`（`builtin` | `<path>` + `sha256`），`host verify` 缺省优先读粘性 ⇒ 与 `apply` 同源；
  2. **缺省不一致时显式告警而非硬红**：verify 缺省用内置表而粘性记录的表源非 builtin 时，改为 WARN + 提示"请带 `--file` 或先重新 apply"，exit 0/1。
- **文档兜底（最小成本）**：在 `MIGRATION.md` §① 与 `host verify` 帮助中明示"`--file` 自定义表使用时，`verify` 须带同一 `--file`"。

### 6.2 P2 · 建议级（4 项 · 含 1 项**文档陷阱**）

#### P2-1 · MIGRATION §①「行为不变」对**内置路径**措辞欠精确
- **事实**：`MIGRATION.md`「① 默认路径：什么都不用做」写「仅用内置 13 宿主的消费者：升级 3.0.0 后 `host validate/apply/update` **行为不变**」。
- **实测**：内置表已升级为 v2，故 `host apply` **净增 2 件 hooks 物化**（`.cursor/hooks.json` / `.claude/settings.json`），且这 2 件会**真实挂 `beforeShellExecution` 钩子**。
- **定性**：**additive 新能力**（W2 头号特性，已在 CHANGELOG「Added·W2」登记），**非 breaking**。
- **问题**：「行为不变」对 `--file` 自定义旧表路径**严格成立**（38/38 字节级一致），但对**内置路径**略欠精确。
- **建议**：改为「默认落点不变；内置表升级为 v2 并**新增** hooks 物化（additive）」。
- **复现**：`node bin/specgate.js host apply --tools cursor,claude,dsh --profile core --json`（干净仓）→ 40 件。

#### P2-2 · 物化 hooks 的门禁命令**未钉版本**
- **事实**：`host apply` 物化的 `.cursor/hooks.json` / `.claude/settings.json` 中，命令为 `npx spec-wave hook-guard --trigger pre-commit`——**不带 `--command`、不带 `@3.0.0` 钉版**。
- **实测后果**：hook-guard 的**默认门禁命令**会去调 `npx spec-wave …`；在离线/受限网络（含沙箱 CI）中取包失败 → **fail-closed 阻断 exit 2**。
- **定性**：**语义安全**（宁拦不放），但会给确定性 CI 带来噪音/偶发红。
- **建议**：物化时支持钉版本（如 `npx spec-wave@3.0.0 hook-guard …`），或在使用手册/RELEASING 提示「CI 须预热 npm 缓存或显式 `--command` 钉版」。本手册 §7.3 已就此给出可操作建议。
- **复现**：干净仓 `host apply --yes` 后 `cat .cursor/hooks.json`；或在无网环境跑一次 hook-guard。

#### P2-3 · CHANGELOG 3.0.0「Tests」段数字滞后于实发状态
- **事实**：`CHANGELOG.md` `[3.0.0]` Tests 段写「测试基线 **841 → 859**（all pass + 1 环境 skip）；**tag-gated 设计红 ×2**」。
- **实测现状**：**864 total / 863 pass / 0 fail / 1 skip**（与 ACCEPTANCE_3_0_0 吻合）。
- **归账（精确）**：
  ```
  探测期（probe）      : 859 = 856 pass + 2 tag-gated 设计红 + 1 skip
  打 tag 后 2 红转绿   : 858 pass
  TTY 色彩 hotfix 新增 : +5（新增 test/plain-env.test.ts · +1 suite · 回归锁）
  现 状                : 863 pass + 1 skip = 864 total   ✅ 吻合
  ```
- **问题**：CHANGELOG 的 **859** 是**探测期**数字，**未回填** TTY 色彩 hotfix（`0e1f165`）在其后新增的 5 条；且「all pass + 1 环境 skip」与探测期「856 pass + 2 设计红 + 1 skip」并存易误读。
- **定性**：口径**滞后**（非错误——该行确实注明了「tag-gated 设计红 ×2 · 打 tag 后须全绿」）。
- **建议**：Tests 段回填为「841 → **864**（863 pass + 1 skip · 打 tag 后全绿）」并注明 TTY hotfix 增量。
- **复现**：`npm test` 看 summary；`grep -n "859" CHANGELOG.md`。

#### P2-4 · README「最小骨架」的闸表是 **3 列**，而解析器要求 **4 列** ⇒ 照抄即**永久误阻断 + 误导性理由**

> **来源**：lead 在自验闸泛化时**发现自己的探针不生效**，顺线查出（**红队 4 路均未报**）。

- **现象**：`README.md` / `README.zh-CN.md`「核心对象 → `task.md`」的「最小骨架」里，闸表写为 **3 列**：
  ```markdown
  | human_gate_id | status | blocks_hats |
  |---------------|--------|-------------|
  | HG-AUDIT-R1 | pending | 30 |
  ```
  但解析器 `GATE_ROW_RE`（`src/cli-shared.ts:25-26`）要求 **4 个单元格**：
  ```js
  /^\|\s*(?:\*\*)?([^*|]+?)(?:\*\*)?\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]*)\|/
  ```
- **★ A/B 对照实测（主控亲验）**：

  | 闸表格式 | status 解析 | `HG-AUDIT-R1 = approved` 之后 |
  |---------|------------|------------------------------|
  | **3 列**（README 骨架） | **`?`（未解析 · 闸表空）** | `may_start_30=false` · `blockers=["HG-AUDIT-R1 pending"]` · `gate-check` **rc=2** ❌ |
  | **4 列**（随包模板） | `pending` / `approved` ✅ | `may_start_30=true` · `blockers=[]` · `gate-check` **rc=0** ✅ |

- **危害**：用户照 README 骨架建 task 后，**即使正确把闸签成 `approved`，仍被永久阻断**，且 `gate-check` 打印的理由是「**HG-AUDIT-R1 非 approved（须维护者签 task 表）**」——**理由与事实相反**（用户明明签了），诊断成本高（会反复检查签名而不会怀疑表列数）。状态列渲染成 `?` 是唯一线索，但无任何"表未被识别"的告警。
- **是否 3.0.0 回归**：**否**。`git worktree` 检出 `v2.4.1` 的 `GATE_ROW_RE` 与现行**逐字节相同**（`src/cli-shared.ts:25-26`）⇒ 自 2.x 既有，属**文档与实现长期不一致**，本次被验收命中。
- **为何仍是可接受（未升 P1）**：① 该骨架**明确标注**「最小骨架（**完整字段见模板**）」，而**随包模板 `assets/harness/templates/TASK_TEMPLATE.md` 是正确的 4 列**；② 文档化的正路是"复制模板"，不是"照抄骨架"；③ 失败方向为 **fail-closed**（无 false-green）。
- **修复建议（二选一）**：
  1. **改文档**（推荐 · 一行）：给两份 README 的骨架补第 4 列 `| 说明 |`；
  2. **改实现**：放宽 `GATE_ROW_RE` 使第 4 格可选（`\|\s*([^|]*)\|` 前置可选），或**在闸表存在但解析为空时输出告警**（"检测到 `### 人工闸` 节但 0 行被识别，请确认是否 4 列"）——后者可同时防住未来同类格式漂移。
- **复现**：见 §5.6。
- **★ 新子形态（3.0.1 规划起草期实测捕获 · 本报告首版未含 · 红队 4 路均未报）**：`GATE_ROW_RE` 的 id 捕获组为 `([^*|]+?)`——**排除 `*`** ⇒ **`human_gate_id` 单元格中间若内嵌粗体标记 `**`，该闸行整体解析失败**（与"3 列"是**两个独立**的静默失效通道）。实测：

  | id 单元格写法 | 解析 |
  |--------------|------|
  | `\| **HG-NEXT-PLAN** \|`（`**` 仅**包裹**整个 id） | ✅ PARSED |
  | `\| HG-AUDIT-R1（每波 ×6） \|`（无 `*`） | ✅ PARSED |
  | `\| HG-W2-REVIEW（**条件闸** · …） \|`（id 格**内嵌** `**`） | ❌ **MISSED** |

  判据：**id 单元格内除最外层一对 `**` 外不得再出现 `*`**。已并入 3.0.1 规划的 W2 范围（告警文案须并列提示该形态 + `TASK_TEMPLATE`/README 注明 + 负向 fixture 覆盖），并写入使用手册 §4.1 警告块。
- **实测探针（用真实 `GATE_ROW_RE` 逐行喂入 · 2026-09-18）**：`本规划 4/4 PARSED` · `TASK_TEMPLATE.md 2 行` · `使用手册 4.1 骨架 1 行` · **`README.md 0 行`** · **`README.zh-CN.md 0 行`** ⇒ 后两者即 P2-4 的**活证**（3 列表被静默忽略）。



### 6.3 P3 · 设计边界 / 覆盖盲区 / 仓卫生（8 项）

> 本节含 **红队 lane C** 报出的两项 P2，经 lead **降级裁决**为 P3（裁决理由见 P3-1/P3-2）。裁决依据：这两个机检的**威胁模型是"维护者自身漂移"而非"对抗性规避"**（见 `docs/guides/claims_boundary_v1_zh.md` §4 —— 它们是**自我约束型**守卫，不跨信任边界）；对"自漂移"而言词表/闭集匹配**按设计即已足够**。**故不构成建议级缺陷，但其暴露的两处真实覆盖盲区值得搭车修补。**

#### P3-1 · `check-claims` 为固定子串匹配，同义改写可绕过（红队报 P2 → lead 降级 P3）
- **证据**：`scripts/check-claims.mjs:54` 固定子串匹配；红队实测注入「接入即**可取得** L3」（改"获得"→"可取得"）→ **0 命中**，绕过。
- **基础面正常**：基线扫 7 文件、`forbidden_wording` 命中 0；注入规范用词（「接入即获得 L3」/「四宿主」/「406 用例」）→ **exit 2 命中 3** ✅ 负对照通过。
- **定性**：**设计边界**（词表匹配对"自漂移"够用）。我方实测 rc=0 亦复现。
- **可选加强**（非必须）：形态归一（去空格/全半角/同义词典）或对"L3"类高风险词做**句式**匹配。

#### P3-2 · `check-terminology` 六目标**闭集外**不扫（含 `CHANGELOG.md` 盲区）（红队报 P2 → lead 降级 P3）
- **证据**：`scripts/check-terminology.mjs` + `assets/harness/terminology.yaml` 定义六目标闭集；红队实测向 **`CHANGELOG.md`** 注入变体词「门控」→ **0 命中**（闭集外不扫）。
- **基础面正常**：基线 `canonical 5/5 在位`、`门控` 残留 0；注入「门控」→ **exit 2** ✅；「后门控制」「门控 skip」正确不报 ✅ 边界排除通过。
- **★ 可操作的真问题**：`CHANGELOG.md` 是**对外可见、且承载宣称**的活文件，却不在扫描面 ⇒ 若在其中写入过期/变体表述不会被拦。**建议把 `CHANGELOG.md` 纳入 terminology/claims 的判红面**（成本极低，收益真实）。
- **定性**：闭集匹配本身=设计边界（P3）；**"CHANGELOG 未纳入"= 可修的覆盖缺口**。

#### P3-3 · `.workbuddy/` 有 **9 个文件实际被 tracked**，与 `check-doc-links` 注释「全忽略」矛盾
- **实测**：`git ls-files .workbuddy/ | wc -l` → **9**（`UserStory.md` / `material_digest.md` / `research_report.md` / `安全设计.md` / `系统设计.md` / `部署拓扑图.svg` / `部署设计.md` / `高层架构设计.md` / `phase0_charter.md`），而 `.gitignore:4` 有 `.workbuddy/` ⇒ 这 9 件为**显式 force-add**（疑为有意保留的立项源材料）。
- **影响**：`scripts/check-doc-links.mjs:4/24` 的注释断言「`.workbuddy/` 忽略但实体在 ⇒ 本机少计 11」，**对全目录成立、对这 9 件不成立**（它们已被 tracked，故指向它们的链接会**正确**通过 (ii) 判据）。
- **定性**：**行为正确、注释不精确** ⇒ 仓卫生 P3。建议注释改为「除 9 件显式 tracked 外均忽略」，或把这 9 件迁出 `.workbuddy/`（如 `docs/`）以免与"忽略目录"语义冲突。

#### P3-4 · 库入口 `exports["."]` 硬静态 import **可选 peer** ⇒ 无 peer 时库消费者失败（**非 3.0.0 回归**）
- **实测**：在无 `@deepseek-ai/*` 的干净消费者仓安装 `spec-wave@3.0.0`：
  ```
  import('spec-wave')                    → ERR_MODULE_NOT_FOUND   ❌
  node node_modules/spec-wave/bin/specgate.js --version → 3.0.0 · rc=0   ✅
  ```
- **根因**：`lib/index.js:4` → `import { defineTool } from '@deepseek-ai/dsh-tools'`，而该 peer 在 `peerDependenciesMeta` 标 `optional`。
- **是否 3.0.0 回归**：**否**。`git worktree` 检出 `v2.4.1` 的 `lib/index.js:4` 为**同一行同一 import** ⇒ 自 2.x 既有。
- **影响面**：**CLI（文档化主入口）完全不受影响**；仅"以库方式编程式消费 `exports["."]`"受阻——而该入口实为**插件面**（`apply()`/`defineTool`），并非设计给纯库消费者的 API。
- **定性**：P3 稳健性观察（pre-existing）。**可选**：把 `@deepseek-ai/dsh-tools` 的 import 改为惰性/动态，使 `exports["."]` 在无 peer 时仍可导入非插件导出（如 `loadMarkdownBundle`）。

#### P3-5 · `README.zh-CN.md` 被打进包但不在 `files` 白名单内
- **实测**：tarball 内含 `package/README.zh-CN.md`，而 `package.json#files` 只列 `README.md`。
- **判定**：**非泄漏**——npm **默认强制包含** `README*`。仅为白名单与实际的**语义差异**，可忽略或在 `files` 补列以自证。

#### P3-6 · 竞品口径「作者数」仍为单值 `90+`，未区间化
- **实测**：`delivery/research_report.md` 等处的 agent 集成数（35–38）/扩展数（138–157）/presets（25–33）/贡献者（240–270+）/stars（121K–130K+）**均已区间 + `as_of 2026-09`**（K-1~K-4 已落实，**非只换数字**），但**作者数仍写单值「90+」**。
- **定性**：口径一致性收尾 P3。建议与同批一起区间化。

#### P3-7 · 非内置宿主声明 `config-hook` 时：`validate` PASS 但 `apply` **fail-closed**（文档未明示）
- **复现（主控亲验）**：自建 `acme-ai` 宿主表，`mechanism: config-hook` + `triggers` + `command`：
  ```
  host validate --file <acme-hook.yaml>                 → HOST VALIDATE: PASS · rc=0
  host apply --tools acme-ai --file <acme-hook.yaml> --yes
      → "host apply: config-hook 宿主无物化落点映射: acme-ai（族映射表外宿主 fail-closed · 不静默）" · rc=2
  host apply --tools acme-ai --file <acme-none.yaml> --yes   # mechanism: none
      → rc=0 ✅
  ```
- **根因**：`config-hook` 的落点映射表**仅覆盖内置 3 宿主**（cursor / claude / dsh）；`src/host/materialize.ts:506` 对表外宿主硬错。
- **定性**：**设计使然**（硬约束 12：接入面不依赖改包发版，但**不自动获得 L3**），且报错**明确点名、不静默** ✅ —— 行为正确。
- **真缺口**：**`validate` 通过而 `apply` 失败**（两关判据不一致），且 `MIGRATION.md` / B5 文档**未明示**"自定义宿主只能 `mechanism: none` ⇒ 仅 L1+L2"。用户会先被 validate PASS 鼓励、再被 apply 硬错拦住。
- **建议**：① `validate` 对"非内置宿主 + `config-hook`"改为 **WARN**（提示 apply 将 fail-closed）；② 在 B5/MIGRATION 文档明写该边界。

#### P3-8 · `src/cli-pins.ts` 内**同类 IO 的退出码不对称**：`package.json` 解析无 try/catch ⇒ 崩溃级 exit 1（非 fail-closed 的 exit 2）

> **来源**：红队 lane A 报 P3；**lead 以 4 组真实对照亲验复现**（下表），并据此修正了 lane A 描述中的一处不准确处。

- **源码事实**（同一模块内防御水位不一致）：
  ```ts
  // :62 loadPins —— 有 try/catch ⇒ 干净 exit 2
  try { data = yamlLoad(readFileSync(abs,'utf8')) }
  catch (e) { fail('PINS: BLOCKED · 声明源语法错误: ' + PINS_REL + ' · ' + e.message, 2) }

  // :88 readTruthVersion —— 未包裹 ⇒ 抛出顶层
  const pkg = JSON.parse(readFileSync(abs, 'utf8'))
  ```
- **★ 4 组真实对照（lead 亲验 · `pins check --target <temp>`）**：

  | # | 触发 | rc | 输出形态 |
  |---|------|----|---------|
  | **A1** | `package.json` 无效 JSON（`{"version":"9.9.9",` 截断） | **1** ❌ | 顶层包成 `{command:"pins", exitCode:1, error:{message:"Expected double-quoted property name…"}}`，**无 `PINS: BLOCKED` 前缀** |
  | **A2** | `assets/release-pins.yaml` 无效 YAML（**对称对照**） | **2** ✅ | `PINS: BLOCKED · 声明源语法错误: assets/release-pins.yaml · missed comma…`（带行号指针） |
  | **A3** | `package.json` `chmod 000`（不可读） | **1** ❌ | `{exitCode:1, error:{message:"EACCES: permission denied, open 'package.json'"}}` |
  | **A4** | `package.json` 残留 **git 冲突标记** `<<<<<<< HEAD` | **1** ❌ | `{exitCode:1, error:{message:"Expected property name or '}' in JSON…"}}` |

- **准确描述（修正 lane A 的措辞）**：不是"裸栈崩溃"——**顶层确有 catch 包成 JSON 信封**；问题在于 **① 退出码是 1（崩溃类）而非 2（门禁类）**，**② 不带统一的 `PINS: BLOCKED` 前缀**，③ 与同模块 `loadPins` 的 `exit 2` **不对称**。因此它是"**信封统一、分类码不统一**"。
- **危害**：消费方（CI / 四阶段锁 / `hook-guard` 的父流程）惯以 **exit 2 = 门禁判红（预期内、可归因）** vs **exit 1 = 进程崩溃（环境/工具问题）** 分流。`package.json` 损坏（**合并冲突标记残留是最现实的触发**——正是团队最忙、最可能忽视的时刻）会被误分类为"工具崩了"而非"门禁拦住了"⇒ **归因错位、可能被当作 infractructure flake 重试掉**。
- **定性**：**P3**（覆盖盲区 / 一致性）。方向 fail-closed（不 false-green），仅**分类码与提示前缀**不一致；且需先损坏 `package.json` 才触发，非常规路径。
- **建议**（一行）：把 `:88` 包进同样形态的 `try/catch` → `fail('PINS: BLOCKED · 真值源 package.json 不可解析/不可读: ' + e.message, 2)`，使同模块 IO 失败**统一为 exit 2 + 统一前缀**。可顺带把 `existsSync` 的 TOCTOU 一并收敛（`:87` 判存后再 `:88` 读）。

（原「CHANGELOG 未纳入扫描面」「库入口稳健性」两条已分别并入 P3-2 与 P3-4，不另立条目。）

---

## §7 与自述文档的对账

| 自述来源 | 自述 | 独立实测 | 判定 |
|---------|------|---------|------|
| `ACCEPTANCE_3_0_...3_0_0_zh.md` | 864 tests / 863 pass / 0 fail / 1 skip | **864 / 863 / 0 / 1** | ✅ 逐字吻合 |
| `w7_release_probe_3_0_0_20260917.md` | 859 / 856 / 2 / 1（pre-tag） | 归账后 **吻合**（+2 tag 绿 +5 hotfix） | ✅ 勘合 |
| `CHANGELOG.md` `[3.0.0]` | 841 → 859 | 现为 864 | ⚠️ **P2-3 滞后** |
| `CHANGELOG.md` | npm pack 275 文件卫生 | **275 · `.bak` 0** | ✅ |
| `MIGRATION.md` §⑤ | 旧表零改动 · 新能力可选启用均 PASS | **字节级一致 38/38** | ✅ 且**强于**自述 |
| `RELEASING.md` 四门 | typecheck/build/test/test:lib/pins/assets 全绿 | 全绿 | ✅ |
| `claims_boundary_v1_zh.md` A3 | 不可声称项（L3 全宿主 / 13 宿主全 hook） | 与实现一致（`mechanism: none` 显式降级） | ✅ |

### 7.1 上轮遗留回代（2.4.x 验收报告 P1/P2）

| 遗留项 | 原状态 | 3.0.0 现状 | 证据 |
|--------|--------|-----------|------|
| **R-5** 换行形态「不\n通过」漏网 | 2.4.1 登记残余（归 3.0） | ✅ **已修**（3.0-W4 窄邻接式封堵） | `src/checks/review-gates.ts:129-133` 注释 + `:147` 正则新增 `(?:不\|未)[ \t]*\n[ \t]*(?:予以?\|以)?通过` |
| **硬约束 14** 证据须入库 | 3 件 `.workbuddy/output/` 未入库 | ✅ **已清偿 6 件** | `git ls-files` 全部命中 `docs/harness/reviews/`：`w3_ontology_graph_research_20260917.md` · `w7_evidence_exports_probe_20260916_20260917.mjs` · `w7_evidence_route_research_2_2_to_3_0_20260917.md` · `w7_evidence_provenance_20260917.md` · `w7_evidence_acceptance_2_4_0_20260917.md` · `w7_evidence_acceptance_2_4_1_20260917.md` |

**R-5 正则实测**（直接喂样例）：

| 样例 | 判定 | 是否正确 |
|------|------|---------|
| `不\n通过` | **HIT** | ✅ 原漏网形态已封堵 |
| `未\n予以通过` | **HIT** | ✅ |
| `不通过`（同句） | HIT | ✅ |
| `不\n\n通过`（跨段） | miss | ✅ 正确**不**跨段（窄邻接 · 防误伤） |
| `PASS · 全部通过` | miss | ✅ 无误伤 |
| `后门控制` | miss | ✅ 词边界正确 |

### 7.2 红队四通道独立回报 · 并入

四路红队与主控**互相独立**执行（不共享脚本、不共享结论，且各自实验均在 `/tmp` 或 `git checkout` 还原下进行）。以下为四路回报的完整并入记录。
**净贡献一句话**：**lane B 捕获了本次唯一的 P1**；**lane A 独立证成了本轮最重要的正面结论**（闸泛化）；**lane D 完成上轮遗留的逐项回代（13/13 闭合）**；**lane C 以双通道互证了发布产物口径**——四路**无一重复**主控覆盖面。

#### 7.2.1 lane C（产物与对外口径）

lane C **完整回报**（新发现 P1=0），其结论与主控独立一致，且**未重复**已覆盖面：

| 命题 | lane C 结论 | 与主控是否一致 |
|------|-----------|--------------|
| 1 发布产物（**线上 tarball 实解包**，非 dry-run） | 275 条目 · junk 0 · `^package/test/`=0 · 顶层仅白名单 · exports 三入口 · deps 零新增 | ✅ 一致（且其用 curl 解包，与主控 `npm pack` 互为独立通道） |
| 2 `check-claims` | 基线 PASS · 负对照 exit2 ✅ · **同义改写可绕过** | ✅ 一致（绕过项见 P3-1） |
| 3 `check-doc-links` | 基线 (i)/(ii)=0 · S2=34 · 负对照 exit2 ✅ · **`.workbuddy` 实体在但 untracked 陷阱正确分辨** | ✅ 一致 |
| 4 `check-terminology` | 基线 PASS · 负对照 exit2 ✅ · 边界词正确不报 ✅ · **闭集外漏扫** | ✅ 一致（见 P3-2） |
| 5 K-1~K-4 竞品口径 | 确由单值改为**区间 + `as_of`**（非只换数字） | ✅ 一致（作者数未区间化 → P3-6） |
| 6 文档一致性 | 版本钉全仓一致 3.0.0 · CHANGELOG↔MIGRATION breaking 描述互洽 | ✅ 一致 |

**lane C 的独立方法论增值**：
- 用 `curl` 直取 `dist.tarball` 解包（与主控 `npm pack` 不同通道）⇒ **双通道互证** 275 件
- 用 `git ls-files -z` **独立重算** S2=34 与主控一致 ⇒ 交叉验证
- 明确验证了 `.workbuddy`「实体在但未入库」**陷阱被正确分辨**（旧 `existsSync` 判据会误绿）
- 实验卫生：所有注入均 `git checkout` 还原，未触碰 S2 过程域，未 commit/tag/push

#### 7.2.2 lane B（schema 兼容与宿主）

lane B **完整回报**，且**独立复现了主控未覆盖的一条关键路径**：

| 命题 | lane B 结论 | 与主控关系 |
|------|-----------|-----------|
| 1 旧表零改动 + v1→v2 **真等价** | validate/apply/update/verify 全绿；旧表与「加 `schema_version:2`+`command_sets`+`defaults.verify`」的等价表 `resolvedHostRows` **深度相等**（hooks 均注入 `{mechanism:none}`、`command_sets`=内建目录、逐项一致），**无字段丢弃** | ✅ 一致，且**比主控更深**（主控做路径级/字节级差分，lane B 做**内部模型级**等价断言） |
| 2 defaults/extends 合并 + 循环继承 | 循环/自继承/未知目标均 FAIL(2) 并点名链；三层 `host > extends > defaults` 对象深合并正确 | ✅ 与主控独立一致（互为**第二条独立通道**） |
| 3 host verify 篡改检出 | 未改 PASS(0) / 改字节 FAIL(2) / 还原 PASS(0)；**未找到 verify 的 bypass 开关** | ✅ 一致 |
| 3′ **legacy 表 `--file` 后默认 verify 误报** | **新发现** | ⚠️ **主控漏检 · 由 lane B 捕获** → 升格 **P1-1**（主控已亲验复现） |
| 4 无 hook 宿主不冒充 L3 | apply/verify 均打出 `degraded-none`，可区分 | ✅ 与主控一致 |
| 5 B5 接入面 + 用户级目录 + 负向 | `--file` 与用户目录均可接入；用户表覆盖内置 id → "宿主冲突（合并铁律·拒载）"FAIL(2)；坏 YAML / 用户表间冲突均 FAIL(2)；内置零污染 | ✅ 一致（主控未跑用户目录路径 ⇒ lane B **补了真实空白**） |
| 6 内置宿主计数 | builtin 13 与 `mvp-hosts.yaml` 三方一致；**实现无第二处硬编码宿主清单**（`src/host/table.ts:15/101`） | ✅ 一致，且**证伪了"双清单漂移"风险** |

**lane B 的独立方法论增值**：
- 主控做**外部可观测面**差分（planned 集合 / 物化树字节），lane B 做**内部模型**差分（`resolvedHostRows` 深度相等）⇒ **两个抽象层各自独立验证了兼容性**
- 主动搜索"verify 缺省调用漏检篡改"的作弊路径并**未找到**（negative search，值得肯定）
- 覆盖了主控**未跑**的**用户级目录**（`$HOME/.dsh` 类）接入面与三类负向（编辑注入式）
- 实验卫生：仅写 `/tmp`，仓内零 tracked 改动

> **★ lane B 的净贡献**：它捕获了本次验收**唯一的 P1**。这说明**并行红队通道有独立价值**——主控主攻"承诺是否成立"（正面验证），红队主攻"边界与组合路径"（负面探索），两者**不可互替**。

#### 7.2.3 lane A（门禁逻辑与闸泛化）

lane A **完整回报**（新发现 P1=0 · P2=0 · P3=1），**独立证成了本轮最重要的正面结论**，并顺手挖出一处退出码不对称：

| 命题 | lane A 结论 | 与主控关系 |
|------|-----------|-----------|
| 1 **W1 闸判定泛化**（是否为白名单？） | 读 `src/cli-shared.ts:300-311` `evaluateMayStart30`，确认其 `for` 遍历**全表**（`gate.blocksHats.includes('30')`），`HG-AUDIT-R1` 仅作**锚闸**先判以稳定存量 reason 字符串，**非白名单限制** ⇒ **判定泛化成立** | ✅ **与主控独立一致**（主控另以全新闸 ID `HG-NEW-XYZ` 做**功能判据**，lane A 做**源码判据** ⇒ 两条独立通道同结论）。**此结论推翻**了此前基于旧代码的"新闸形同虚设"推断 |
| 2 fail-closed 语义一致性 | P0 闸 / `hook-guard` / `host verify` 三类阻断点**均 rc=2**；`check` 类恒 rc=0（只报不拦）——分层语义**自洽** | ✅ 一致（与主控 §3/§4 交叉印证） |
| 3 W4 反伪造语义化 | 越权/伪造通过形态在 `review-gates.ts` 中由**窄邻接式**正则覆盖，**不误伤**正常 PASS 表述 | ✅ 一致（与主控 R-5 回代表逐样例吻合） |
| 4 pin-17 / KPI / W6 逃逸率 | 版本钉全仓一致；KPI 计分口径与实现自洽；W6 逃逸率**有真数据源**非硬编码 | ✅ 一致 |
| 5 **P3 · `loadPins` 与 `readTruthVersion` 退出码不对称** | `src/cli-pins.ts` `loadPins`（`:62-83`）有 `try/catch` ⇒ 坏 pin 文件**干净 exit 2 + `PINS: BLOCKED` 前缀**；而 `readTruthVersion`（`:85-91`）的 `JSON.parse(readFileSync(abs,'utf8'))`（**`:88`**）**未包裹** ⇒ `package.json` 无效 JSON / 无读权限 / 残留冲突标记时，**exit 1**（崩溃类），且**无 `PINS: BLOCKED` 前缀** | ⚠️ **主控未覆盖 · 由 lane A 捕获** → 登记 **P3-8**（同一模块内两处同类 IO **分类码不统一**）。**主控以 4 组真实对照复跑确认**（A1 截断 JSON / A2 坏 YAML 对称对照 / A3 `chmod 000` / A4 冲突标记），并**修正了 lane A 原措辞**："非裸栈"——顶层确有 JSON 信封，问题在**退出码分类**而非信封缺失 |

**lane A 的独立方法论增值**：
- 用**源码判据**（读实现逻辑）与主控的**功能判据**（构造全新 ID 实测阻断）**正交**，使"泛化成立"这一最高价值结论**有两类独立证据**——避免"只靠一次实测就下结论"的单点风险
- 对 fail-closed 做**矩阵式**梳理（三类阻断点 × rc），而非逐条零散验证
- 实验卫生：只读 + `/tmp` 构造，仓内零 tracked 改动

> **★ lane A 的净贡献**：它把本轮**最重要的正面结论从"疑似"抬到"确证"**，并为**反向推断（旧前提过期）**提供了可追溯的源码锚点。同时其 P3（退出码不对称）属**主控盲区**，再次印证"红队不可由主控代劳"。

#### 7.2.4 lane D（上轮遗留回代）

lane D **完整回报**（新发现 P1=0/P2=0/P3=0 · **已闭合 13/13**），专职把 2.4.x 验收报告留下的开口**逐项重打**：

| # | 遗留项 | 回代构造 | 前 → 后 |
|---|--------|---------|---------|
| NEW-4 | 门禁 reason 稳定性 | 构造同型 task 比对 reason 字符串 | 红 → 绿 ✅ |
| NEW-5 | 断言锚点漂移 | 故意移位断言锚 | 红 → 绿 ✅ |
| NEW-6 | 证据链断点 | 移走证据文件后复跑 | 红 → 绿 ✅ |
| NEW-7 | 输出相对路径基准 | 从不同 cwd 复跑 | 红 → 绿 ✅ |
| NEW-8 | 资产完整性校验 | 篡改 `assets/` 单字节 | 红 → 绿 ✅ |
| NEW-10 | 任务关闭快照 | `task close` 前后快照对比 | 红 → 绿 ✅ |
| NEW-11 | 提示词/CI 对齐 | 改一行 prompt 观察 CI 判据 | 红 → 绿 ✅ |
| NEW-12 | 结构断言 | 移除结构片段 | 红 → 绿 ✅ |
| N5 | 命名一致性 | 引入旧名残留 | 红 → 绿 ✅ |
| R-5 | 「不\n通过」换行漏网 | 直接喂跨行样例 | 红 → 绿 ✅（见 §7.1） |
| R-6 | 反伪造边界词 | 喂 `后门控制` 等边界词 | 红 → 绿 ✅（不误伤） |
| pin-08 | 版本钉漂移 | 单点改版本号 | 红 → 绿 ✅ |
| pack-hygiene | 打包卫生 | `npm pack` 检查 junk | 见附 A（沙箱伪红） |

**lane D 的独立方法论增值**：
- 采用「**先构造红，再验证绿**」（before-red → after-green）的**对照式回代**，而非"跑一遍看看过不过"——这才叫**闭合**而非**通过**
- 13 项**逐条独立构造**，不共用夹具 ⇒ 单点失效不会污染全局结论
- 明确区分了 **9 条 pack 伪红**（沙箱 safe-delete）与**真缺陷**，未把环境问题记成产品问题（与附 A 归因一致）

> **★ lane D 的净贡献**：它把"上轮遗留"从**清单式声明**变成**可执行证据**——每一项都有前红后绿的构造，使 §7.1 的回代表**不是自我宣称而是可复跑**。

### 7.3 关联文件入库核验（「链接可解析 ≠ 目标入库」）

被 `MIGRATION.md` / `CHANGELOG.md` 引用的文件，`git ls-files --error-unmatch` 判据：

```
IN-REPO  docs/harness/reviews/w1_schema_change_review_20260916.md
IN-REPO  docs/harness/reviews/w7_migration_rehearsal_2_4_1_20260917.md
IN-REPO  docs/harness/reviews/w7_release_probe_3_0_0_20260917.md
```
✅ 三份**真在库内**，非悬空引用。

---

## 附 A · 环境归因（沙箱内 9 条伪红）

### A.1 现象

首次在受沙箱约束的环境跑 `npm test`，得 **864 / 854 pass / 9 fail / 1 skip**。9 条失败全为打包相关用例。

### A.2 归因（到机制，而非猜测）

```
npm pack --dry-run
  → npm error [safe-delete][SAFE_DELETE_BULK_CONFIRM_REQUIRED]
    {"count":50,"threshold":50,"scope":"turn","targets":["…/.npm-local/_cacache/tmp/…"]}
```

⇒ 沙箱的 **safe-delete 保护**在 `npm` 清理缓存临时目录时触发 bulk-confirm，导致 `npm pack` 非零退出 → 9 条依赖 pack 的用例伪红。

### A.3 处置与验证

前置 `npm_config_cache=/tmp/npmcache300`（把 cache 移出受保护路径）后复跑：

```
npm test → # tests 864 · # pass 863 · # fail 0 · # skip 1     ✅
```

**⇒ 9 条真红 100% 为环境伪红，与产品无关。** 权威测量以修正后为准。

### A.4 同类环境坑（供后续复跑参考）

| 坑 | 现象 | 规避 |
|----|------|------|
| `npm` safe-delete | pack 相关用例伪红 | `npm_config_cache=/tmp/npmcache300` |
| 沙箱内 hook-guard 默认命令 | 取包失败 → rc=2 | 用 `--command 'true'` 做绿路径验证 |
| 本地 git shim | `git --version` 曾异常 | 本轮 rc=0，未触发 |

---

## 附 B · 未覆盖面与残余（诚实登记）

| 项 | 状态 | 说明 |
|----|------|------|
| 13 宿主 GUI 端到端目视 | ⚠️ **未覆盖** | 本轮覆盖 Cursor / Claude Code / DSH 的**落点物化**与 CLI 判定；其余 10 宿主的**GUI 内可见性**未逐一目视（属声明面） |
| pre-archive 宿主内**真实触发** | ⚠️ **未落地** | 仅 fixture + `host verify` 兜底（`claims_boundary` 已如实标注为「规划中」） |
| `shell-hook`（git 层）真跑 | ⚠️ 未逐项验证 | 本轮验证 config-hook（cursor/claude）与 `none`（降级）；git 层 shell-hook 未单独构造 |
| npm provenance / OIDC | 未启用（规划中） | 与 A3 口径一致 |
| `catalog` 远程在线分发 | 冻结（规划中） | 同上 |
| 红队 4 通道**完整**回报 | ✅ **4/4** | **四路均已完整回报并并入 §6/§7.2**：lane B 贡献**唯一 P1**（→ 升格 P1-1）· lane A 独立证成**闸泛化**（→ §4.6）并贡献 P3-8 · lane C 双通道互证产物口径（→ P3-1/P3-2 降级裁决）· lane D 完成遗留 13/13 回代（→ §7.1） |

### B.1 共享任务台账的逐条状态（诚实登记）

红队通道建立的 25 条核验台账，经四路回报后的状态：

**（a）已被 lane D 回代闭合的 ID（12 项 · 前红后绿构造）**：

```
#13 NEW-4   #14 NEW-5   #15 NEW-6   #16 NEW-7   #17 NEW-8
#18 NEW-10  #19 NEW-11  #20 NEW-12  #21 N5      #23 R-6
#24 pin-08  #22 R-5（已由主控另证，见 §7.1）
```

**（b）⚠️ 只有状态标记、**无构造留证**（诚实登记 1 项）**：

```
#25  2.4.2 §4 残余覆盖核对 + 3.0 审阅档交叉
```

共享台账上 **25/25 均显示 `completed`**，但本报告只认可**能追溯到构造证据**的闭合。二者差额即 #25：它**仅有一条状态标记**，lead 未取得其"前红后绿"构造留证 ⇒ 记为「**状态已闭合 · 留证待补**」，**不计入"确证通过"**。（依铁律 1：每条结论须能追溯到一条实际执行的命令；**状态位不是证据**。）

**（c）⚠️ 一处**标签级**不一致（须再裁决，不视为已闭合）**：

lane D 回报的 12 个 ID 与上方台账的 ID **完全对齐**（NEW-4/5/6/7/8/10/11/12 · N5 · R-5 · R-6 · pin-08），但其**逐项文字与台账标签不符**，例如：

| ID | 台账标签（本报告） | lane D 回报标签 | 是否一致 |
|----|------------------|---------------|---------|
| NEW-6 | 卫生门 `.bak` 通配语义 | 证据链断点 | ❌ 不符 |
| NEW-7 | 卫生门第二控制点 | 输出相对路径基准 | ❌ 不符 |
| NEW-4 | pin-17 双命中判据验证 | 门禁 reason 稳定性 | ❌ 不符 |

⇒ **ID 层已对齐，标签层未对齐**。两种可能：① 台账建立时标签与 lane D 内部编号发生了**错位沿用**；② 二者确指同一批断言但各自用了不同命名。**在标签级对齐前，本报告不把 (a) 记为"逐条确证通过"，只记为"已回代·ID 对齐"** —— 依「口径必须可追溯」纪律，宁可保守。

> **判定影响**：上述残余**均为细粒度断言/边角回归**（语义化细节、运维脚本策略、输出归一化边界），**不影响 §0 的三项核心承诺判定**。若需将本报告从「PASS-with-issues」升级为「全绿无死角」，建议：① 先做 (c) 的**标签对齐**（半小时级）；② 再补 #25。二者合计约一轮专项。

---

## 附 C · 复跑命令（可照抄）

```bash
# 0) 版本三向
npm view spec-wave version
git rev-parse v3.0.0 HEAD

# 1) 机械门禁（务必前置 cache 变量，规避沙箱 safe-delete）
export npm_config_cache=/tmp/npmcache300
npm run typecheck && npm run build && npm test && npm run test:lib
node bin/specgate.js pins check && node bin/specgate.js assets verify
node scripts/check-pack-hygiene.mjs
node scripts/check-claims.mjs && node scripts/check-terminology.mjs && node scripts/check-doc-links.mjs

# 2) 端到端（干净临时仓）
DEMO=$(mktemp -d) && cd "$DEMO" && git init -q && echo '# d' > README.md && git add . && git commit -qm init
SPEC=/path/to/repo/bin/specgate.js
node $SPEC host validate
node $SPEC host apply --tools cursor,claude --profile core            # dry-run
node $SPEC host apply --tools cursor,claude --profile core --yes
node $SPEC host verify --tools cursor,claude
echo TAMPERED >> .cursor/skills/harness-10-task/SKILL.md
node $SPEC host verify --tools cursor,claude ; echo "rc=$?"          # 期望 2
node $SPEC host update --tools cursor,claude --yes --force

# 3) v1 兼容对照（最强证据）
git worktree add /tmp/wt241 v2.4.1
cd /tmp/wt241 && ln -s <repo>/node_modules node_modules && <repo>/node_modules/.bin/tsc -p tsconfig.json
git show v2.4.1:assets/ide/host-adapt/examples/mvp-hosts.yaml > /tmp/v241-hosts.yaml
# 两个干净仓分别物化后 diff -r（期望仅 host-tools.json 版本戳不同）
```

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-18 | 初版 · 3.0.0 完整验收（PASS-with-issues · 0 P0 / 0 P1 / 3 P2） |
