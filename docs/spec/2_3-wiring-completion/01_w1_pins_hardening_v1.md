# 01 · W1 · pins 机制补强（pins hardening）· 本次核心波

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）· 隶属 `2_3-wiring-completion` · **本次核心波**  
> **test_strategy**：`required`（破坏性自证 + 失配 fixture 真失败 + 负向靶场）  
> **上游**：验收报告 §2 W1（pin-08 弱钉 / 三面未入钉 / 测试覆盖缺口）· §4 #7/#8/#14 · 机制债 [D] ×2 · PROMPT §3 W1 行

---

## 1. 背景

2.2.0 W1 建起了版本/身份钉门禁（12 钉面 · exit 2 · S2 拒写无豁免），2.2.1 修掉了 P1 静默部分修复。对抗验收仍留下四处「门禁建了但钉不严」的缺口：

1. **[A]#7 · pin-08 是弱钉**：`release-pins.yaml:60-73` 的 `spec-index-row` 提取口径是「索引表存在含当前版本串的 `|` 行」——把该行版本改成 `9.9.9` 后，同表另一处 prose 仍含版本串即可兜底 PASS，**抓不到真实的版本漂移**（验收 §2 W1 实测）。
2. **[A]#8 · 三个醒目版本面未纳入钉**：`CHANGELOG.md` 最新发布头、`MIGRATION.md` 的 `spec-wave@X`、`AGENTS.md` 的 `npx spec-wave@X`——bump 后静默过期而 `pins check` 仍绿（本棒复核：pin-01..12 无此三落点，属实）。
3. **[A]#14 · 失配 fixture 覆盖缺口**：`test/pins-consistency.test.ts` 失配 fixture 仅覆盖 pin-01/02/03/05/08/09，pin-04/06/07/10/11/12 无失配用例（P3）。
4. **[D] · `verify --spec` 目录型 slug 推导**：`src/cli-checks.ts:553-557` `extractSpecSlug` 回退取文件名 basename——传 `docs/spec/<slug>/README.md` 时 slug 误推为 `readme`，SPEC 审查文存在性闸（findSpecReview :576-594）按错 slug 查找 → **存在性闸误判**（本棒只读复核确认）。
5. **[D] · 同文件钉面模式重叠 unfixable 误报候选**：pin-11/12 同落 `assets/ide/host-adapt/README.md`，2.2.1 已按文件聚合修复写盘覆盖；残留候选债：同文件多钉面 `extract` 模式重叠时（如 regex-all 命中面覆盖 regex 单点面），fix 替换可能互相踩踏被判 unfixable → **本波只出评估结论，实现与否由评估定**。

## 2. 目标

钉面「声明即严」：弱钉改严、醒目版本面全入钉、每个钉面有失配负向、slug 推导按目录型正确归一——全部以**数据/定点修复**完成，不动 pins 引擎架构。

## 3. 范围

| # | 项 | 形态 | 出处 |
|---|----|------|------|
| ① | pin-08 弱钉改严：提取须命中「含当前版本串 **且版本串落在索引行状态/描述单元格**」的行（非任意 prose 行） | 提取语义数据声明更新（沿袭 D-PINS-SCOPE-8 先例）+ 提取实现定点改严 | [A]#7 |
| ② | CHANGELOG 最新发布头 / MIGRATION `spec-wave@X` / AGENTS `npx spec-wave@X` 三面入钉（pin-13/14/15） | **纯数据**新增 `release-pins.yaml` 钉面 · 不改 pins 代码 | [A]#8 |
| ③ | pin-04/06/07/10/11/12 失配 fixture 补全 | `test/pins-consistency.test.ts` 新增失配用例（真失败自证） | [A]#14 |
| ④ | `extractSpecSlug` 目录型回退修复：basename ∈ {`README`, `index`}（大小写不敏感）时取父目录名为 slug | `src/cli-checks.ts` 单点修复 + 目录型 `--spec` 负向/正向测试 | [D] |
| ⑤ | 同文件钉面模式重叠 unfixable 误报评估 | **评估文落盘**（结论：修 / 不修 + 理由）；实现非必须 | [D] |

## 4. 非范围

| 项 | 理由 |
|----|------|
| pins 引擎架构改动（新 extract kind 体系、并行化等） | 本波只做定点；引擎语义 2.2.0/2.2.1 已稳定 |
| unfixable 误报的实现修复 | ⑤ 明确「可只留评估结论不实现」（PROMPT §3 W1） |
| S2 目录任何写 | S2 永不覆写；pins fix 拒写语义保持 |
| git tag 自动化（pin-10 fixable） | git 操作仅人（F-A1-05 沿袭） |
| pin-01 不可独立证伪（[A]#14 前半 · P3） | 设计使然（真值源 self），验收报告已定性，不处理 |

## 5. 设计

### 5.1 pin-08 严化口径（D-23-PIN08-STRICT · 已定案采纳推荐）

- 现状机械化口径：「当前版本 X.Y.Z → 索引表存在含 X.Y.Z 或 X_Y_Z 的 `|` 行」。
- 严化后：命中行还须满足**版本串落在该行的状态/描述单元格**（即该行本身是当前版本的索引行，而非别行 prose 顺带提到版本号）。「单元格」的机械判定（按 `|` 分列后第 N 列 / 或「该行 slug 列与版本 minor 一致」）随 task 定稿，但**口径必须能把验收 §2 的反例（改坏版本行 + 别行 prose 兜底）判为 mismatch**。
- 回归约束：现行 `docs/spec/README.md` 全部存量行（含 2.1.3 / 2.2.1 patch 收尾行）在严化口径下必须全部 PASS。

### 5.2 三面入钉（D-23-PIN-3FACES · 已定案）

| 新钉 | 落点 | 提取建议（数据） | fixable |
|------|------|------------------|---------|
| pin-13 | `CHANGELOG.md` | 最新发布头 `## [X.Y.Z]`（首个非 Unreleased 节） | true（可按真值源改版本号 · 不动日期行其余） |
| pin-14 | `MIGRATION.md` | `spec-wave@X.Y.Z` 出现处（regex-all · 沿袭 pin-05/06 先例） | true |
| pin-15 | `AGENTS.md` | `npx spec-wave@X.Y.Z` 出现处（regex-all） | true |

- 注意事项：`AGENTS.md` 含 cyning-harness 产品块（host apply 维护），fix 写入须与块维护纪律兼容（只替换版本串，不动块结构）；MIGRATION.md 若含**历史版本叙事行**（如「从 spec-wave@2.1.x 迁移」），extract 口径须只钉「现行指引」出现处——随 task 定稿时在 yaml note 中写清。

### 5.3 失配 fixture 补全

- 每钉一个失配用例：构造该钉面偏差 → `pins check` exit 2 且输出指出正确 `文件:行号`。
- pin-10（git tag）失配以「tag 不存在」场景构造（测试内 git 环境隔离，不真打 tag）。

### 5.4 目录型 slug 修复（D-23-SPEC-SLUG · 已定案）

- `extractSpecSlug`：spec_slug 元信息优先（现状保持）；回退链 basename 去 `SPEC[-_]` 前缀与 `_v<n>` 后缀后，若结果 ∈ {`readme`, `index`} → 取父目录名（normalize 后）为 slug。
- 验收：`--spec docs/spec/<slug>/README.md` 与 `--spec docs/spec/<slug>/SPEC_<slug>_v1.md` 两形态对同一审查文的判定一致。

### 5.5 unfixable 误报评估（可只留结论）

- 评估问题：同文件多钉面 extract 模式重叠（regex-all 覆盖面包含 regex 单点面）时，按文件聚合写盘（2.2.1）后是否出现「actual 已正确却被判 unfixable / mismatch」的误报路径。
- 产出：评估结论落盘（随本波 task 的过程档或 reviews/），含「修 / 不修 + 理由 + 若修的代价估算」。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| pin-08 严化 = 版本串落状态/描述单元格 | **采纳（D-23-PIN08-STRICT）** | 精确杀死验收反例 · 语义可数据化 |
| pin-08 严化 = 行首 slug 列含 minor | 弃选 | patch 收尾行无 slug 夹列（2.1.3/2.2.1 先例），误伤合规行 |
| 三面入钉 = 纯数据 pin-13/14/15 | **采纳（D-23-PIN-3FACES）** | 沿袭数据驱动先例 · 不改代码 |
| 三面入钉 = 改 pins 引擎支持「最新发布头」kind | 弃选 | CHANGELOG 头可用既有 regex kind 表达（`## [(d+.d+.d+)]` 首个命中） |
| slug 回退取父目录名 | **采纳（D-23-SPEC-SLUG）** | 目录夹是本仓 SPEC 主流形态（doc-health 公约） |
| slug 回退扫描目录内首个 SPEC_*.md | 备选 | 实现复杂 · 与「传哪个文件就按哪个文件」直觉不符 |
| unfixable 评估后实现修复 | 评估定 | PROMPT 明确允许只留结论 |

## 7. 验收标准（必须自证，不接受「我改完了」）

1. **pin-08 严化破坏性自证**：把 `docs/spec/README.md` 当前版本行版本串改 `9.9.9`（保持别行 prose 含正确版本）→ `pins check` **exit 2** 且指出该行；改回后 PASS。贴实际命令与输出。
2. **严化回归**：现行 `docs/spec/README.md` 全部存量行在新口径下 PASS（12+3 钉面全绿）。
3. **三面入钉**：`pins check` 落点数 12 → 15 且全 PASS；分别对 CHANGELOG / MIGRATION / AGENTS 制造偏差 → 各报 `文件:行号` exit 2 → `pins fix --yes` 收敛。
4. **fixture 真失败**：pin-04/06/07/10/11/12 六个新失配用例逐一破坏自证真失败（可抽查式贴证据，全量随 npm test 绿）。
5. **slug 修复**：目录型 `--spec` 正/负向测试通过；两个形态（README / SPEC_*_v1）对同一审查文判定一致。
6. **评估文落盘**：⑤ 结论含「修/不修 + 理由」。
7. `npm run typecheck` 0 错 · `npm test` 全绿（含新增）· `pins check` exit 0。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W1-01 | pin-08 严化后索引行缺失/版本漂移 | exit 2 · 指出 `docs/spec/README.md` 行号 · fixable=false（人工补行，沿袭现状） |
| F-W1-02 | CHANGELOG 无发布头（仅 Unreleased） | pin-13 判 missing/mismatch · exit 2 · 不静默跳过 |
| F-W1-03 | MIGRATION/AGENTS 含历史版本叙事行 | extract 口径只钉现行出现处（yaml note 写清）；误钉则 task 阶段返修数据 |
| F-W1-04 | fix 写 AGENTS.md 触碰产品块结构 | 只替换版本串（regex capture group 回写），不动 marker 块；测试断言块标记完整 |
| F-W1-05 | `--spec` 传目录路径本身（非文件） | 维持既有「未找到/用法错」语义（exit 1），不新增目录直读能力 |
| F-W1-06 | slug 父目录名含大写/非法字符 | normalizeSlug 归一后比对；归一后仍不匹配 → 审查文缺失 exit 2（failClosed 现状语义） |
| F-W1-07 | 评估结论为「不修」 | 评估文落盘即关账 · 不视为范围缺口 |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = 验收 §2 W1 / §4 #7/#8/#14 + 机制债 [D]×2 + 本棒只读复核（yaml:60-73 · cli-checks:553-557 · test 覆盖） | no |
| R1 | 范围 = ①–⑤ 五项；非范围 = 引擎架构 / unfixable 实现 / S2 / git 自动化 / pin-01 证伪 | no |
| R2 | §6 表：严化口径 / 入钉形态 / slug 回退三组 ≥2 方案 | no |
| R3 | 边界：AGENTS 产品块兼容 · MIGRATION 历史叙事行 · S2 拒写保持 · git 仅人 | no |
| R4 | `test_strategy=required`：破坏性自证 ×2（pin-08 · 三面）+ fixture 真失败 + slug 正/负向 | no |
| R5 | **已签收**（2026-09-12 · HG-SPEC-SIGNOFF=approved · 00 代签）· 下一棒：00 拆 W1 task → 20-task-audit → HG-AUDIT-R1 → 30/40 | no |

**residual_risks**：CHANGELOG 头正则对「Unreleased 空节」的边界（F-W1-02）；MIGRATION 叙事行口径需 task 阶段逐行核对；严化口径对 patch 收尾行的兼容（回归验收 #2 兜底）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-12 维护者会话授权 00 代签 · 与 2.2.0/2.2.1 同模式） | ~~本 SPEC 定稿 · 冻结 D-23-PIN08-STRICT / D-23-PIN-3FACES / D-23-SPEC-SLUG~~（已冻结 · 采纳推荐） |
| HG-AUDIT-R1（W1 task） | pending | W1 30 改码前（task 阶段 00 代签） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | draft · 10-spec · 五项范围全部经只读复核（证据未失效） |
| 2026-09-12 | signed · HG-SPEC-SIGNOFF approved（00 代签） |
