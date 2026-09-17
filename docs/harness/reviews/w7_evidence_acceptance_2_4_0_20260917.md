> **provenance · 3.0 W7 S7.8 证据镜像**（硬约束 14 · F-W7-04）
> 来源（仅本地草稿 · 非 tracked）：.workbuddy/output/验收报告-SpecWave-2.4.0.md · 验收报告 · SpecWave 2.4.0
> 镜像日期：2026-09-17 · 文件名带来源+日期 · **内容不改写**（仅本头部注记）· 以 tracked 镜像为真值面。

---
# 验收报告 · SpecWave 2.4.0（「门禁强度补全」）

| 项 | 值 |
|---|---|
| 验收对象 | `spec-wave@2.4.0`（npm 已发布）+ 仓库 HEAD `3e60c0f` |
| 发布 tag | `v2.4.0` → `343025d` |
| 验收方法 | 发布面机械项实测 + 2.3.0 遗留 N1–N14 逐条回代 + 四路**独立对抗验证**（fresh context，红队"找绕过"视角）+ lead 独立复测关键项 |
| 对抗分工 | V1 钉点对抗 · V2 门禁强度/结论级 · V3 相对路径/资产校验 · V4 发布卫生/物料口径 |
| 验收日期 | 2026-09-14 |
| 基线对照 | `.workbuddy/output/验收报告-SpecWave-2.3.0.md`（N1–N14 出处） |

---

## §0 结论（定稿）

**判定：PASS-with-issues（有条件通过）。不推荐"干净通过"。**

- **发布面机械项 12/12 全绿**，无 P0、无假绿（failClosed 方向三处均保持）。
- **2.3.0 遗留 14 项**：**10 项完全闭合 / 3 项部分或设计性残留 / 1 项未闭环**。
  - 完全闭合：N1 · N2 · N3 · N4 · N6 · N7 · N8 · N10 · N13 · N14
  - 部分/设计性：N5（设计性残留·加警示非封堵）· N11（原形态已封·新 P1 同族绕过）· N12（cwd==target 已修·跨目录仍泄漏）
  - **未闭环：N9**（pin-08 状态格裸子串仍可被同格 `v2.4.0` 顶包）
- **本轮新发现 12 项：P1 ×2 / P2 ×3 / P3 ×7**。
- **无发布阻断**（无假绿、无 P0、真实 tarball 卫生归零），但 **NEW-1「结论门禁否定守卫可绕过」与 2.3.0 的 N11 同族，属"门禁语义误判"**——即一份写着"不予通过"的审阅文可被判为通过。建议**最迟 2.4.1 补丁闭环**，不宜拖到 3.0。
- 与 2.3.0 相比方向明确向好：2.3.0 曾出现"已发布产物含 5 个 `.bak`"的**真实产品缺陷**（本轮已归零），且 2.3.0 的 P0（符号链接绕过）在本轮无同族复现。

**路由判定（用户并行提问）：2.5.0 不需要——规划上本就无 2.5 波次，应直接从 2.4.0 到 3.0.0。** 详见 §7。

---

## §1 发布面机械项（12/12）

| # | 检查项 | 命令 | 结果 |
|---|---|---|---|
| 1 | 包版本 | `package.json` | `2.4.0` ✓ |
| 2 | git tag | `git tag -l "v2.4.*"` | `v2.4.0` → `343025d` ✓ |
| 3 | npm 最新版 | `npm view spec-wave@2.4.0 dist-tags.latest` | `2.4.0` ✓（三向一致） |
| 4 | 真实 tarball 条目 | `npm view …dist.tarball` → curl → `tar -tzf` | **188 条** ✓ |
| 5 | tarball 卫生 | `tar -tzf p.tgz \| grep -Ec '\.bak$\|~$\|(^\|/)\.DS_Store$'` | **0**（2.3.0 曾为 **5**）✓ |
| 6 | 钉点一致性 | `spec-wave pins check` | **17/17 落点一致 · exit 0** ✓ |
| 7 | 资产完整性 | `spec-wave assets verify` | **110/110 · exit 0** ✓ |
| 8 | 测试套件 | `npm test` | **582 total / 581 pass / 0 fail / 1 skip · exit 0** ✓ |
| 9 | 打包卫生门 | `node scripts/check-pack-hygiene.mjs` | PASS · 188 files · exit 0 ✓ |
| 10 | 卫生门接线 | `package.json` `prepublishOnly` 末尾 | 已含 `check-pack-hygiene.mjs` ✓ |
| 11 | `files` 否定项 | `package.json` `files[]` | 含 `"!assets/**/*.bak"`；`.gitignore` 含 `*.bak` ✓ |
| 12 | 资产清单 | `assets/sha256.manifest` | 110 条目 ✓ |

**lead 独立复测**（非采信代理自述）：第 4/5 项由 lead 亲自 `curl`+`tar` 复跑，得 188 / 0，与 V4 一致。

---

## §2 2.3.0 遗留 N1–N14 回代

| # | 2.3 严重度 | 2.4.0 状态 | 证据（实测） |
|---|---|---|---|
| **N1** | P1 | ✅ **已闭合** | 真实 tarball 188 条 / 坏文件 0（2.3.0=193/5）。lead 独立复测一致。残余见 NEW-6 |
| **N2** | P2 | ✅ **已闭合** | 放 `.bak`+`*~`+`.DS_Store` → `assets verify` 输出 `WARN: 排除项 3 个（…）`，`--json` 含 `excluded:[…]`，exit 0（警告不升档）；真实篡改 → exit **2**（failClosed 保留） |
| **N3** | P2 | ✅ **已闭合** | 4 份 `delivery/promotion/` 文首均含 `历史版本快照（2.1.3 时点）`（4/4）；`四宿主`/`406 用例` 在 `README.md`/`README.zh-CN.md` grep 零命中 |
| **N4** | P3 | ✅ **已闭合（留痕档）** | `assets/harness/discipline-coverage.yaml:79` `N4-EXIT1-REGISTER`「安全拒绝 exit 1 档位登记（非缺陷·仅留痕）」 |
| **N5** | P2 | ⚠️ **设计性残留（加警示·非封堵）** | `assets manifest rebuild`（dry-run 与 `--yes` 两路）均输出 `WARN: 本操作将当前资产状态追认为真值…防投毒依赖 provenance（未启用）`；复测 `real1.txt` 改 PWNED → verify exit 2；`rebuild --yes` → verify exit **0**（篡改被追认合法化）。**门禁对"篡改+rebuild"结构性无效**，与 2.3 威胁模型裁决（provenance 明确未启用）一致 |
| **N6** | P3 | ✅ **已闭合** | `README.md:38` / `README.zh-CN.md:38` 含 `.aider.conf.yml` with `conventions-file: AGENTS.md`；`pins check` 17/17 未被踩（pin-17 = 13 宿主 · 13 双语命中） |
| **N7** | P2 | ✅ **已封堵** | `README.md` 加 `[r1]: FOO.md`（白名单外）→ `pins check` exit **2**（`README.md:386 -> FOO.md`）；对照白名单内 `[r1]: GLOSSARY.md` → exit 0 |
| **N8** | P2 | ✅ **已封堵** | 删 `aider` 表行留 tagline → pin-17 exit **2**（aider 缺 EN 侧表行）；对照表行在 → exit 0 |
| **N9** | P2 | ❌ **未闭环** | 状态格 `` `2.4.0` published`` 改 `` `9.9.9` published``（同格保留 `tag `v2.4.0``）→ pin-08 **仍 PASS exit 0**。根因 `src/cli-pins.ts:235` `statusCell.includes(dotted)` 为 **裸子串包含**：`v2.4.0` 的子串 `2.4.0` 即满足。清空整格（含 v-tag）才 exit 2 |
| **N10** | P3 | ✅ **已闭合** | 盘 `FOO.md`(大写) + 白名单 `foo.md`(小写) + 文档链 `foo.md` → exit **0**；对照删盘文件 → exit **2**（F-W6-01 不放行） |
| **N11** | P1 | ⚠️ **部分（原形态已封·新 P1 同族）** | 无结论节的"通过" → FAIL；结论节只写"通过" → FAIL（去通过词残余 4<20）。**但否定守卫可绕过 → 见 NEW-1** |
| **N12** | P2 | ⚠️ **部分（cwd==target 已修）** | cwd=target 下四处原泄漏全归零（`task lint`/`close`/`verify`/人类输出 均相对）。**但 cwd≠target / realpath 入参仍泄漏 → 见 NEW-2** |
| **N13** | P2 | ✅ **已闭合** | 未引号 `00` / 数字 `123` → invalid 拒收；`"00"` / `"123"` 字符串 → 收编。四字段类型判扎实 |
| **N14** | P3 | ✅ **已闭合** | 构造 `fileSlug=dummy_zzz` ≠ `metaSlug=2_1_1-host-tools-ux-w0-planning`：旧逻辑（仅文件名）MISS 误报；新逻辑（`meta ?? file`）HIT 豁免。`cli-task-extra.js:50-61` 口径 = `meta.task_slug ?? 文件名 slug`，`:107` 豁免查 `metaSlug ?? slug` |

**统计：✅ 10 ／ ⚠️ 3 ／ ❌ 1（共 14）**

---

## §3 本轮新发现（12 项）

### P1（2 项 · 建议 2.4.1 闭环）

**NEW-1 [P1] 结论门禁「否定守卫」可绕过 —— 写着"不予通过"的审阅文被判通过**

- **最小复现**（lead 独立复测，探针 `/tmp/lead-neg-probe.ts` 直调 `evalReviewConclusion`）：

  | 输入结论节 | 期望 | 实测 |
  |---|---|---|
  | `A 合法通过`（边界清晰…同意签收） | PASS | **PASS** ✓ |
  | `B 本任务不予通过。缺陷清单详见上文第 3 节…` | FAIL | **PASS** ❌ |
  | `C 本任务未通过。缺陷清单详见…` | FAIL | **FAIL** ✓ |
  | `D 本任务不 通过。缺陷清单详见…` | FAIL | **PASS** ❌ |
  | `E NO PASS. Defects listed in section 3…` | FAIL | **PASS** ❌ |
  | `F 结论节只写"通过"` | FAIL | **FAIL** ✓ |

- **根因**：`src/cli-checks.ts:681-682` `REVIEW_NEG_RE = /((?<!无需)(?<!不)(?<!未)退回|未通过|不通过|(?<!零)内容阻塞)/` —— 否定词要求**字面连续**（`不通过`/`未通过`），插入任意字符（予/空格/换行）即断链；而 `REVIEW_PASS_RE` 仍命中"通过"。且否定词表**仅中文**（`:689-721`）。
- **影响面**：裸 `verify` 与 `task close` **同用该函数** → 两处门禁均可被误绿。
- **判定**：与 2.3.0 的 N11 同族（结论级判据被绕过），性质为**门禁语义误判**。虽需审阅者"真写否定句"才触发（非纯构造攻击），但正是门禁最该拦住的情形。

**NEW-2 [P1] `task close` / `host validate` 在 `cwd ≠ target` 时 `--json` 仍泄漏绝对路径**

- **根因（lead 直接核源码）**：同一文件内基参不一致——

  | 文件 | 用 `target` 作基（正确） | 用 `process.cwd()` 作基（缺陷） |
  |---|---|---|
  | `src/cli.ts` | `565` / `655` / `781` / `875` | **`1003`（D-24-OUTPUT-REL-EXIT 统一出口）/ `1098` / `1108` / `1125`** |
  | `src/cli-host.ts` | `1232` / `1406` | **`490` / `507` / `524` / `784`** |

- `printJson(base, payload)` → `relativizeOutputValue(base, …)`（`src/cli-shared.ts:430 / 412`）以 `base` 为相对化基准。base 取 `process.cwd()` 时，从非 target 目录调用即**无法相对化 → 打印绝对路径**。
- **代理复现**：`cd 仓库根 && node …/cli.ts task close --json --file /private/tmp/v3fix/…/active/x.md --target /tmp/v3fix` → exit 0，`dest=/private/tmp/v3fix/docs/tasks/done/x.md`（**绝对**）；exit 2 BLOCKED 时 `blocker` 亦含绝对段。
- **子类**：macOS `/tmp → /private/tmp`。`--target /tmp/v3fix` 而传入 realpath `/private/tmp/v3fix/…` 时，lexical 前缀判据失效 → 泄漏 realpath。与 cwd≠target 同根。
- **掩盖效应**：现有 `test/cli-json-no-abs-path.test.ts`（21 测）全绿，但其用 cwd==target 且 `--target` 取 realpath，**恰好对齐**，掩盖了 cwd≠target / symlink 两类泄漏。
- 注：`host validate` 无 `--target` 参数，其唯一基是 cwd——这属**接口面残留**，需在设计上决定是补 `--target` 还是接受"相对 cwd 输出"。

### P2（3 项）

**NEW-3 [P2] pin-16 覆盖缺口：漏扫 HTML `<a href="…">`**
- `README.md` 加 `<a href="FOO.md">` → `pins check` exit **0**（96 个 md 0 失配）；对照同文件 `[x](FOO.md)` → exit **2**。
- `assets/release-pins.yaml:141-153` pin-16 `semantics` **只声明两形态**：inline + reference-definition。HTML 锚点是 markdown 内的合法相对链接形态，属**声明面窄于"全部相对链接"** 的覆盖缺口。

**NEW-4 [P2] pin-17 可被「伪表行」顶包**
- 删真 `aider` 适配表行 + 正文插 `| aider | 占位伪表行 |` → pin-17 **仍 PASS exit 0**。
- 判据为 `^\s*\|` + 词锚（宿主 id 在行内出现即算），宿主表"漏行"这一核心病害可被任意伪管道行满足。（SPEC §9① 已列为已知残留，本版未修。）

**NEW-5 [P2] S1·N=20 内容量判据形同虚设（非语义闸）**
- 阈值**机械正确**：`通过`+15 填充（残余 19）→ FAIL；`通过`+16 填充（残余 20）→ PASS，无 off-by-one。
- 但"通过"+任意 16 个填充字符即过 —— 等价给攻击者"提速 16 字符"，**语义强度≈0**。`src/cli-checks.ts:686 / 716`。
- 相关：strip 绕过变体（`通過`/`P-A-S-S`）不被 strip 掉、可作填充计入 substance，但普通填充即可达同样效果，无额外风险。

### P3（7 项）

| # | 发现 | 证据 / 根因 |
|---|---|---|
| **NEW-6** | `check-pack-hygiene.mjs` 黑名单**非通配语义** | 正则 `/\.bak$/i \|\| /~$/ \|\| /(^\|\/)\.DS_Store$/` 仅命中**精确 `.bak` 后缀**。实证（`files:["assets"]` 复刻真实根因）：`npm pack` 把 `foo.bak2` / `notes.bak.md` / `trailing.bak `（尾空格）全打入，脚本仅 flag 1/5。`files` 否定项 `!assets/**/*.bak` 同病。建议改 `/.\.(bak\|BAK)(\.\|$\| )/` 或显式覆盖常见备份后缀 |
| **NEW-7** | 卫生门**单一控制点** | 断言仅接 `prepublishOnly`；`npm publish --ignore-scripts` 可整体跳过（需主动意图，设计面残留） |
| **NEW-8** | `pins fix` **无条件删同名既有 `.bak`** | `src/cli-pins.js:608-610`：`copyFileSync(abs, abs+'.bak')` → 写 → `unlinkSync(abs+'.bak')`。V1 预置 `README.md.bak`（同名哨兵）被销毁；V4 预置 `user-notes.bak`（无关）存活。**lead 裁决**：机制成立、触发条件明确（"用户已存在与被改写文件同名备份"），**P3 低危**——但代码注释"只清本次自写 .bak"与实际不符，应改为"存在即改名/跳过"而非无条件 unlink |
| **NEW-9** | pin-08 `v`/修饰符**子串过宽** | 与 N9 同根：状态格写 `v2.4.0` / `2.4.0-beta` 皆算合格，发布态标注可被轻改而门禁不红 |
| **NEW-10** | `legacy-gate-exempt.yaml` **数据后门 + 逻辑分叉** | 裸 `verify` 中 slug 命中 `exempt.reviews` 即**压制失败缺口**：同一份 FAILING 审查文（结论仅"通过"）exit 2 → 加一条**自填** `authorized_by` 的条目后 exit 0。`authorized_by` 仅校验"非空字符串"、无真实性核验。另 `task close` **不消费 exempt**（`cli-checks.ts:187` `evalCloseReview` 未引 exempt），与裸 verify 逻辑分叉 |
| **NEW-11** | 否定词表**仅中文** | `NO PASS` / `rejected` 无对应否定词 → 同样可过。（与 NEW-1 同源） |
| **NEW-12** | `relativizeOutputValue` **只改 value 不改 key** | `src/cli-shared.ts:412-418`：`out[k] = relativizeOutputValue(base, v)`，key 原样复制。当前枚举 `verify`/`pins`/`status` 的 JSON 键均为固定字符串，无 path-as-key 输出；但任何以路径为键的命令（未来/边缘）会漏 —— 残留风险 |

---

## §4 台账对账

| 台账自述 | 实测 | 一致 |
|---|---|---|
| `RELEASING.md:72` 用例数 | `582 total / 581 pass / 0 fail / 1 skip` | ✓ 可复现 |
| `pins check` 17 钉面 | 17/17 落点一致 · exit 0 | ✓ |
| `assets verify` 110 条目 | 110/110 · exit 0 | ✓ |
| tarball 文件数 | 188 | ✓ |
| RELEASING 九步顺序 | ②四门 = `prepublishOnly` 同四门；末段接 `check-pack-hygiene`；⑧publish 仅人 | ✓ 自洽 |
| 版本三向 | `package.json` 2.4.0 = tag `v2.4.0` = npm `latest` 2.4.0 | ✓ |

**非缺陷说明**：HEAD `3e60c0f`（`docs(release): 2.4.0 发布回填`）比 tag `v2.4.0`(`343025d`) 多 1 个纯文档 commit，版本号未变 —— 属正常发布回填，**不计缺陷**。

---

## §5 正向发现

1. **修复闭合率显著跃升**：2.3.0 的 14 项被 2.4.0 打到 **10 项完全闭合**；且 2.3.0 唯一"已发布产物含 5 个 `.bak`"的**真实产品缺陷已归零**（lead 复测确认）。
2. **修严型变更均配负向 fixture 回归锁**（2.4 PLAN 硬约束 9）：N7 / N8 / N10 / N13 / N14 全部有"修复前真红 → 修复后转绿"的对照实验，直接回应了 2.3.0 的 §3.J 教训（"自验结论与独立复测不符"）。
3. **failClosed 方向三处保持**：`pins check` / `assets verify` / `check-pack-hygiene` 在 npm 失败、JSON 不可解析、未装等情况一律 `exit 2`，**无假绿**。
4. **发布卫生链条首次闭环**：`files` 否定项 + `.gitignore` + `check-pack-hygiene` + `prepublishOnly` 四道同时到位。
5. **存量不追溯纪律被正确执行**：`D-24-W2-NO-RETRO`——48 份现行 PASS 审查文误伤 0，未搞"一刀切回填"。
6. **真实 tarball 取证成为标准动作**：本轮 V4 用 `npm view → curl → tar -tzf` 取**真实发布产物**（而非 `npm pack --dry-run`），堵住了 2.3.0 时代"本地 dry-run ≠ 线上产物"的验证盲区。

---

## §6 处置建议

### 6.1 建议纳入 2.4.1（补丁级 · 仅 P1 + 廉价 P2）

| 项 | 动作 | 落点 |
|---|---|---|
| NEW-1 | 否定守卫改**语义判据**：先判否定再判通过，否定正则放宽为 `不\S{0,3}通过` / `未\S{0,3}通过` / `no\s*pass` / `reject`（大小写不敏感）；补负向 fixture（B/D/E 三形态固化为回归锁） | `src/cli-checks.ts:681-682` + `test/` |
| NEW-2 | `printJson` 基参统一取命令 `target`（realpath 归一），替换 `process.cwd()` | `src/cli.ts:1003/1098/1108/1125`、`src/cli-host.ts:490/507/524/784` |
| NEW-2 补 | 补"cwd≠target + symlink/realpath 入参"对偶测试（现 21 测只覆盖 cwd==target，是掩盖源） | `test/cli-json-no-abs-path.test.ts` |
| NEW-3 | pin-16 扫描面纳入 HTML `<a href>`（或在 pins 语义声明中**显式排除并留痕**，二选一，不可沉默） | `assets/release-pins.yaml:141` + `src/cli-pins.ts` |
| NEW-9 / N9 | pin-08 状态格判据改**精确版本锁定**：正则加数字/点边界（如 `(?<![0-9.])X\.Y\.Z(?![0-9.])`）并排除 `v` 前缀顶包；或要求"发布态词 + 版本"同格共现 | `src/cli-pins.ts:235` |

> 2.4.1 走**补丁**而非新 minor —— 沿用 2.3.1 对 2.3.0 的先例（详见 §7）。

### 6.2 建议并入 3.0.0（战略级 / 清扫类）

| 项 | 归属理由 |
|---|---|
| NEW-4（伪表行）/ NEW-5（N=20 非语义闸） | 本质是"判据语义化升级"，与 3.0 主线 **A4 `ontology-check` 接线**（"声明→接线→可验证"闭环）同向，宜合并设计 |
| NEW-6 / NEW-7 / NEW-8 / NEW-12 | 机械清扫类，可随 3.0 或任一补丁顺带，不阻塞 |
| NEW-10 / NEW-11 | 安全面：`authorized_by` 真实性核验依赖 **provenance/OIDC（当前未启用）** → 归 3.0 的 **C6 审计落盘** 与 provenance 启用议题 |
| N5（设计性残留） | 同上，与 provenance 启用绑定；本版"加警示 + 口径收窄"已是当前约束下的合理选择 |

### 6.3 冻结 / 仅人

- 无新增冻结项。
- `npm publish` / `deprecate` / tag / push 维持**仅人**（Agent 禁止），本轮所有代理均未触网发布。

---

## §7 路由判定：是否跳过 2.5.0 直接到 3.0.0

**结论：不需要 2.5.0——规划上本就无此波次，应直接从 2.4.0 → 3.0.0。**

### 7.1 三处规划真值互证

| 证据源 | 事实 | 含义 |
|---|---|---|
| `docs/roadmap/` 目录 | 仅 `PLAN_2_1` / `2_1_1` / `2_1_2` / `2_2` / `2_3` / `2_4`，**无 `PLAN_2_5*`** | 2.5 从未立项 |
| `路线研究-SpecWave-2.2-3.0.md` §5「波次编排」 | 只定义 **2.2.0「闭环起步」→ 2.3.0「接线补全」→ 3.0.0「架构跃迁」** 三波；全文"2.5"仅出现 2 次，一次是章节号 `§2.5 可观测性与安全性`，一次是评分表分数 `2.5` | **无 2.5 波次** |
| `PLAN_2_4_gate_strength_v1_zh.md` §非范围（L108–117） | A3 hooks surface / A4 ontology-check / B2·B3·B5 / C6 / E3·E4 / F1 **「路线研究 §5 3.0.0 波次既定归属，不进 2.4」**；N1/N11/N13「已随 2.3.1 落地」 | 2.4 即 2.x 末班车 |
| `src/` 全量扫描 | `2.5.0` **零命中** | 代码侧无 2.5 预留 |

### 7.2 结构性原因

3.0.0 的核心命题是 **A3「把 P0 门禁真正装进宿主 hooks」**——这会改 host-adapt 适配表格式，是 **breaking change**（路线研究 §7 已把"A3 依赖 schema 变更 → 走新 minor + 向后兼容读旧格式"列为风险）。**触 schema 的变更只能走 major**。而能塞进 minor 的接线/加固类工作，已在 2.3.0（接线补全）+ 2.3.1 + 2.4.0（门禁强度）三波里**基本清空**——本轮 N1–N14 的 10/14 完全闭合即是证据。

### 7.3 纪律建议

> 若本轮 P1（NEW-1 / NEW-2）及廉价 P2 需要收口，**走 2.4.1 补丁**（沿用 2.3.1 对 2.3.0 的先例），**不要**为它单开 2.5.0 minor。否则等于用一个新 minor 承接本该是补丁的活，反而把 3.0 的 schema 战线拉长。

---

## §8 总结论

1. **2.4.0 发布面机械项 12/12 全绿**，无 P0、无假绿，真实产物卫生归零。
2. **2.3.0 遗留 14 项：10 完全闭合 / 3 部分或设计性 / 1 未闭环（N9）**。
3. **本轮新发现 12 项：P1×2 / P2×3 / P3×7**；其中 **NEW-1（否定守卫）与 NEW-2（跨目录路径泄漏）建议最迟 2.4.1 闭环**，与 2.3.0 的 N11/N12 属同族延续，不应拖到 3.0。
4. **判定：PASS-with-issues（有条件通过）**——可以认为 2.4.0 的"门禁强度补全"目标**方向达成且大部分落地**，但门禁判据仍存在"语义可绕过"这一**同族系统性弱点**（N9 未闭环 / N11 新绕过 / N12 部分泄漏三者同源：**判据用"裸子串/字面连续"而非语义边界**）。
5. **路由：确认跳过 2.5.0，直接推进 3.0.0**；残留 P1 走 2.4.1 补丁收口。

> **一句话**：2.4.0 把 2.3.0 报告里最"硬"的三处（`.bak` 真实产物缺陷、refstyle 绕过、表行顶包）真修好了；但**门禁判据的"子串/字面"根因未除**——这也是 3.0 把 A3/A4 定为战略级命题的现实依据。

---

## 附 A 实验卫生

- 四路代理**只读**为主，临时文件全部落 `/tmp`（`/tmp/v4-n1`、`/tmp/v4-n14`、`/tmp/lead-tb240`、`/tmp/lead-neg-probe.ts` 等）。
- 代理侧 `git status` 全程干净；未写 `docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`（S2 过程域）。
- V1 的仓库改动已 `git checkout` 还原。
- lead 独立复测三项：真实 tarball（188/0）、否定守卫探针（B/D/E 判 PASS）、路径基源码（`printJson(process.cwd(),…)` 8 处）。
- 未执行任何 `npm publish` / `deprecate` / `git tag` / `git push`。

## 附 B 证据索引

| 项 | 位置 |
|---|---|
| 否定守卫根因 | `src/cli-checks.ts:681-682`（`REVIEW_NEG_RE`）/ `:689-721`（`evalReviewConclusion`） |
| 内容量阈值 | `src/cli-checks.ts:686`（`REVIEW_MIN_SUBSTANCE=20`）/ `:716` |
| exempt 消费差异 | `src/cli-checks.ts:187`（`evalCloseReview` 未引 exempt）/ `src/cli.ts:765` |
| 路径基不一致 | `src/cli.ts:1003/1098/1108/1125`、`src/cli-host.ts:490/507/524/784`（`process.cwd()`）vs `src/cli.ts:565/655/781/875`、`src/cli-host.ts:1232/1406`（`target`） |
| 相对化实现 | `src/cli-shared.ts:412-418`（value-only）/ `:430`（`printJson`） |
| pin-08 判据 | `src/cli-pins.ts:235`（`statusCell.includes(dotted)`） |
| pin-16 语义声明 | `assets/release-pins.yaml:141-153`（仅 inline + refstyle 两形态） |
| 打包卫生脚本 | `scripts/check-pack-hygiene.mjs` |
| pins fix 备份清理 | `src/cli-pins.js:608-610` |
| 豁免格式校验 | `src/cli-checks.ts:723-733`（四字段）/ `docs/harness/legacy-gate-exempt.yaml` |
| N4 留痕 | `assets/harness/discipline-coverage.yaml:79` |
| 掩盖源测试 | `test/cli-json-no-abs-path.test.ts`（21 测 · cwd==target） |
| 2.3.0 基线 | `.workbuddy/output/验收报告-SpecWave-2.3.0.md`（N1–N14 出处） |
