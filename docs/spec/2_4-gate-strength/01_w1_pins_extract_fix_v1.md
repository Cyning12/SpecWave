# 01 · W1 · pins 提取修正（pins extract fix）· 本次核心波

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-14 维护者本窗授权 00 代签）· 隶属 `2_4-gate-strength` · **本次核心波**  
> **test_strategy**：`required`（三负向 fixture 修复前真红 + 现行文档全量回归）  
> **上游**：PLAN_2_4 W1 · 验收报告 §6「建议 2.4」N7/N8/N9 · 证据 §3.H/§3.I/§3.J（V1 三路构造 + lead 复现）

---

## 1. 背景

2.3.0 W1/W2 把 pins 机制补强与钉面维度扩展接线（pin-08 严化 D-23-PIN08-STRICT · pin-16 文档↔files 白名单 · pin-17 宿主↔根 README），2.3.1 未动提取层。V1 对抗式验证在**三条提取口径**上实锤绕过（全部 P2）：

1. **N7 · pin-16 refstyle 不扫**（§3.H）：`src/cli-pins.ts:295` 的 `linkRe = /!?\[[^\]]*\]\(...\)/g` 只匹配 inline 链接，**不匹配 reference-style 定义** `[id]: FOO.md`。V1 构造：在 `files[]` 内 markdown 以 `[r1]: FOO.md` 引用白名单外仓根级 `.md`（`README.md:393`）→ `pins check` **PASS exit 0**；对照（`FOO.md` 入 `files[]` 后 inline 全绿、refstyle 仍不扫）证明是**真缺口非误报**。
2. **N8 · pin-17 词锚不认表行**（§3.I）：`src/cli-pins.ts:348-390` 的 `host_hits` 是裸词/词锚（`re.test(readmeBodies[i])` · :374/:388），README 任意位置命中即算该侧命中。V1 决定性构造：**删掉 `aider` 适配表行**但保留 `README.md:5` tagline 枚举句「13 hosts (… aider)」→ pin-17 **PASS exit 0**；对照：连枚举句里 `Zed` 一起删 → exit 2 → 证明 tagline 在顶包、表行未被独立校验——与 2.3 SPEC 02 §5.2「须在根 README **表内**」不符。
3. **N9 · pin-08 不认语义格位**（§3.J）：`src/cli-pins.ts:221-258` 双判 (A) 状态/描述列含版本串 + (B) slug 列含版本串或 `X_Y-` 前缀。V1 + lead 复现：把 `docs/spec/README.md:19` **状态格** `2.3.0` 改 `9.9.9` → pin-08 **仍 PASS**——同行末尾归档链接文件名含下划线式 `2_3_0`（归一化后 = 当前版本），(B) 被 slug 前缀 `2_3-` 满足，(A) 被同行/同表其他格的版本形态串满足。**状态格里写什么版本号对结果毫无影响**，与 2.3-W1 验收档 §7.1 自述「改坏版本串→exit 2」直接矛盾。

## 2. 目标

三条提取口径「钉到语义位置」：pin-16 扫全 markdown 合法链接形态、pin-17 认表行、pin-08 认状态格——全部**定点修复**，不动 pins 引擎架构；每条配负向 fixture 固化 V1 构造（修复前真红、修复后转绿）。

## 3. 范围

| # | 项 | 形态 | 出处 |
|---|----|------|------|
| ① | **N7**：pin-16 提取补 reference-definition 分支（`^\s*\[[^\]]+\]:\s*(\S+)`），refstyle 定义目标入扫描面（同样走白名单/存在性判定） | `src/cli-pins.ts:295` 提取区定点 + `test/pins-consistency.test.ts` refstyle 负向 fixture | §3.H · D-24-PIN16-REFSTYLE |
| ② | **N8**：pin-17 词锚限定**表格行**内匹配——对每 host 断言「词锚命中 ∧ 命中位在表行内」双命中（表行机械形态：以 `|` 起首的行），替代裸词全文命中 | `src/cli-pins.ts:348-390` 命中逻辑定点 + 负向 fixture（删 aider 表行留 tagline → exit 2） | §3.I · D-24-PIN17-TABLEROW |
| ③ | **N9**：pin-08 提取锁定**语义格位**（状态列 = cells[2]）：版本串判据只认状态列，排除同行路径/链接/文件名/slug 中的版本形态串；`X_Y` / `X_Y_Z` 前缀式一律不计入版本串 | `src/cli-pins.ts:221-258` 双判定稿改格位锁 + `assets/release-pins.yaml:60-73` semantics 数据声明更新 + 「改坏状态格 → exit 2」回归锁 fixture | §3.J · D-24-PIN08-SEMCELL |

## 4. 非范围

| 项 | 理由 |
|----|------|
| pins 引擎架构改动（新 extract kind 体系等） | 本波三处全为定点；引擎语义 2.2–2.3 已稳定 |
| pin-16 大小写口径（N10 假阳） | 归 W6（P3）；本波只补 refstyle 扫描面 |
| pin-08 对「别行状态列合法提及当前版本」的极端兜底 | 2.3-W1 task residual 已登记为可接受 · 本波格位锁定后该面进一步收窄，不再单列 |
| S2 目录任何写 | S2 永不覆写；pins fix 拒写语义保持 |
| git tag 自动化（pin-10 fixable） | git 操作仅人 |
| host-adapt schema / W2–W6 任何实现项 | 00 §3 · 各自独立 task |

## 5. 设计

### 5.1 pin-16 refstyle 分支（D-24-PIN16-REFSTYLE）

- 现状：`linkRe`（`src/cli-pins.ts:295`）逐文件 `new RegExp(linkRe.source, 'g')` 扫 inline（:301-304）。
- 修正：增补 reference-definition 提取 `^\s*\[[^\]]+\]:\s*(\S+)`（flags m），捕获目标后与 inline 目标走**同一**归一/判定管线（去 `#` 锚 · 仓根级且存在的 `.md` ∈ 白名单 ∪ npm 自动入包）。
- 边界：图片 refstyle `![id]: path` 一并计入（`!?` 可选前缀）；URL（`http(s):`）与锚点沿用既有排除口径。

### 5.2 pin-17 表行锚定（D-24-PIN17-TABLEROW）

- 现状：`hostHits[id]` 各 pattern 对 README body 整体 `re.test`（:374/:388）——裸词命中即算。
- 修正（优先方案）：对每 host 每侧 README，断言「存在**表行**（`^\|` 起首行）使该 host 的 host_hits 至少一 pattern 命中该行」；tagline/prose 命中不再计入。即「词锚 ∧ 表行」双命中，**不**把表行形态编进单一复杂正则（防 README 双语表格式脆性）。
- 回归约束：现行 `README.md` / `README.zh-CN.md` 13 宿主在双命中小径下必须全部 PASS（含 `dsh` 双命中后 known_gaps 豁免失陈债机制行为不变）。

### 5.3 pin-08 语义格位锁定（D-24-PIN08-SEMCELL）

- 现状病根：双判 (A) 的 `tail = cells.slice(2).join(' | ')` 含**描述列**（归档链接文件名带 `2_3_0` 顶包）；(B) 的 slug `X_Y-` 前缀与版本号语义无关（`2_3-wiring-completion` 顶包）。
- 修正：行合格 ⟺ **状态列（cells[2]）**含当前版本**点式** `X.Y.Z`（下划线式 `X_Y_Z` 不再计入版本串——slug/文件名形态一律排除）。slug 列 (B) 判保留但只作行身份辅助；**版本真值只认状态列点式串**。「规划中/draft」行的机械口径（状态列含 `X.Y.Z 规划中` 是否算命中）随 task 定稿并写入 yaml semantics 数据声明。
- 回归约束：现行 `docs/spec/README.md` 全部存量行（含 2.1.3/2.2.1/2.3.1 patch 收尾行与 `2_4-gate-strength` 规划中行）在新口径下全 PASS；列序约定（cells[0]=slug · cells[1]=路径 · cells[2]=状态）入 release-pins.yaml 数据 note。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| pin-17 = 词锚 ∧ 表行双命中断言 | **采纳（D-24-PIN17-TABLEROW）** | 表行形态与词锚解耦 · 双语表格式脆性最小 · V1 反例直接杀死 |
| pin-17 = 单一复杂正则（`^\|\s*\*\*<name>\*\*` 表行形态入 yaml） | 弃选 | README 表格式变动即假红 · 脆性集中在数据表达式 |
| pin-08 = 状态列点式版本串唯一真值 | **采纳（D-24-PIN08-SEMCELL）** | 杀死 §3.J 两类顶包（归档链接 `X_Y_Z` · slug `X_Y-` 前缀）· 语义格位即版本语义所在 |
| pin-08 = 沿用双判仅排除链接列 | 弃选 | slug 前缀顶包仍在 · 补丁式收窄（即 N12 同型教训） |
| pin-16 = 补 refstyle 分支 | **采纳（D-24-PIN16-REFSTYLE）** | 报告建议原文 · 与 inline 同一判定管线 |
| pin-16 = 全量 markdown AST 解析 | 弃选 | 引入依赖/复杂度 · 与 pins 数据驱动先例不符 |

## 7. 验收标准（必须自证，不接受「我改完了」）

1. **N7 负向 fixture 真红转绿**：构造 `files[]` 内 markdown 以 `[r1]: FOO.md` 引用白名单外仓根级 `.md` → 修复前 `pins check` exit 0（复现 §3.H）· 修复后 **exit 2** 指出 `文件:行号`；对照组（`FOO.md` 入 `files[]`）转绿。
2. **N8 负向 fixture 真红转绿**：删 `aider` 适配表行保留 tagline 枚举句 → 修复前 exit 0（复现 §3.I）· 修复后 **exit 2**；连枚举句 `Zed` 也删的对照仍 exit 2；正向（表行恢复）转绿。
3. **N9 负向 fixture 真红转绿**：把当前版本索引行**状态格**改 `9.9.9`（同行归档链接/别行 prose 保留正确版本形态串）→ 修复前 exit 0（复现 §3.J lead 实验）· 修复后 **exit 2**；改回 PASS。
4. **全量回归**：现行 `README.md`（双语 · 13 宿主）与 `docs/spec/README.md`（全部存量行含本版规划行）在新口径下 `pins check` 全 PASS、零误伤；三个新 fixture 固化入 `test/pins-consistency.test.ts`。
5. `npm run typecheck` 0 错 · `npm test` 全绿（含新增）· `node bin/specgate.js pins check` exit 0。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W1-01 | refstyle 目标为 URL / 纯锚点 / 不存在文件 | 沿用 inline 同口径排除/跳过，不误报 |
| F-W1-02 | README 表格式变动（列增删 · 表行行首空格） | 表行判定以 `^\s*\|` 宽松起首为准；判定口径变更加严须走钉面评审 |
| F-W1-03 | 新宿主落地仅改 tagline 未补表行 | pin-17 exit 2 点名该 host 缺表行（failClosed · 即本波目标行为） |
| F-W1-04 | spec 索引表列序变更（状态列不再是 cells[2]） | 列位口径在 yaml note 声明 · 表结构变更时钉面同步评审；失配 exit 2 不静默 |
| F-W1-05 | 状态列写 `2.4.0 规划中` 类非发布态 | task 定稿「规划中」口径（含版本串即算行身份合格 · 发布态准确性与 pin-10 tag 联动分工）；定稿入 yaml semantics |
| F-W1-06 | 修严误伤存量合规行 | 验收 #4 全量回归兜底 · 误伤即返修口径不修文档 |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = §3.H/§3.I/§3.J 三路构造（含 V1 对照与 lead 复现）+ 本棒只读复核现值（`cli-pins.ts:295` linkRe · `:348-390` host_hits 裸词 · `:221-258` 双判 · yaml :60-73/:137-180） | no |
| R1 | 范围 = ①–③ 三项；非范围 = 引擎架构 / N10（归 W6）/ 极端兜底 / S2 / git 自动化 | no |
| R2 | §6 表：pin-17 双命中 vs 单一正则 · pin-08 格位锁 vs 补丁收窄 · pin-16 refstyle vs AST | no |
| R3 | 边界：表格式脆性 · 列序约定入数据 · 「规划中」口径随 task 定稿 · S2 拒写保持 | no |
| R4 | `test_strategy=required`：三负向 fixture 修复前真红（V1 构造固化）+ 全量回归 | no |
| R5 | **已签收**（2026-09-14 · HG-SPEC-SIGNOFF=approved · 00 代签）· 下一棒：00 拆 W1 task → 20-task-audit → HG-AUDIT-R1 → 30/40 | no |

**residual_risks**：① 表行判定对「宿主名出现在非适配表的其他表格」的误判面（缓解：双命中 + 现行 README 回归；必要时限定「适配表节内表行」· task 定稿）；② refstyle 折叠写法（`[id]: <path>` 尖括号）边界（缓解：fixture 覆盖）；③ 「规划中」行口径与 pin-10 tag-gated 设计红的分工须 task 阶段写清（F-W1-05）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-14 维护者本窗授权 00 代签） | ~~本 SPEC 定稿~~ · 冻结 D-24-PIN16-REFSTYLE / D-24-PIN17-TABLEROW / D-24-PIN08-SEMCELL（采纳推荐） |
| HG-AUDIT-R1（W1 task） | pending | W1 30 改码前（20 审查文落盘后 00 代签） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | draft · 10-spec · 三项范围行号经本棒只读复核（cli-pins.ts:295/:348-390/:221-258 · release-pins.yaml:60-73） |
| 2026-09-14 | signed · HG-SPEC-SIGNOFF approved（00 代签 · 2026-09-14 维护者授权） |
