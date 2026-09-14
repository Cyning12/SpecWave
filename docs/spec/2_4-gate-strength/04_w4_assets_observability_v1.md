# 04 · W4 · 资产门禁可观测补全（assets observability）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-14 维护者本窗授权 00 代签）· 隶属 `2_4-gate-strength`  
> **test_strategy**：`required`（warning 可见性构造 + rebuild 警示文案快照断言 + 三负向回退锁）  
> **上游**：PLAN_2_4 W4 · 验收报告 §6「建议 2.4」N2/N5 · 证据 §3.C（结构性失明）/ §3.F（篡改+rebuild 绕过 · V3 对抗实验）

---

## 1. 背景

2.3-W5 交付资产完整性校验（`assets/sha256.manifest` + `assets verify` failClosed exit 2 + CI 接线）。对抗验收实锤两处**同源**缺口（§3.F 同源观察：威胁模型假设「manifest 是可信声明」，但 manifest 可被任何能跑 CLI 的人重写）：

1. **N2 · 排除项结构性失明**（§3.C）：`src/cli-assets.ts:29` `if (basename.endsWith('.bak')) return true`（D-23-W5-EXCLUDE）——生成与 verify **双侧排除** `.bak`。实测 manifest 110 条 vs 实际 113 文件（差额 = manifest 自身 + 2 个 `.bak`）→ `assets verify` 仍 PASS 110/110 exit 0。SPEC 识别了 `.bak` 混入风险（F-W5-06）却用双侧排除消解——**排除了检测，没有排除成因**，后果正是 N1（门禁全绿、垃圾上架；N1 本体已随 2.3.1 修复发布卫生，本波补可观测性）。
2. **N5 · rebuild 追认绕过**（§3.F · V3 实验）：篡改资产 → `assets verify` exit 2（对照正确）；篡改 + `assets manifest rebuild --yes` → manifest 写入被篡改内容的哈希 → verify exit 0——**门禁对「先篡改再顺手 rebuild」的主动投毒无效**。rebuild 职责即追认现状（非代码缺陷），但威胁模型被高估，与 G5《安全设计》`delivery/安全设计.md:768`（§5.3.1 A-1 行）/ `:77`（「篡改发现」）/ `:418`（T-03 定位）的口径直接冲突；真正有效的 provenance **未启用**（`docs/guides/provenance_oidc_trusted_publishing_guide_v1_zh.md:3` 自述）。

## 2. 目标

资产门禁的真实价值锚定为「**防意外漂移 / 防遗忘**」：排除项从「静默排除」升级为「排除但可见」（显式 warning）；rebuild 从「静默追认」升级为「强制警示追认语义」（维护者动作口径）。对外口径收窄归 W5 落地，本波只补 CLI 侧可观测性。

## 3. 范围

| # | 项 | 形态 | 出处 |
|---|----|------|------|
| ① | **N2**：`assets verify` 对 `assets/` 内被排除项（`.bak` 等）输出**显式 warning 清单**（排除生成侧维持不打哈希 · warning 不升 exit 2 · 独立字段/前缀区别于 failClosed 输出） | `src/cli-assets.ts:29` 排除点旁补可见性 + 测试构造 | §3.C · D-24-W4-WARN-ONLY |
| ② | **N5**：`assets manifest rebuild` 输出强制警示「此操作将追认当前资产状态为真值」类文案（人类输出与 `--json` 面同口径）；是否需 `--yes` 之外再带显式确认由 task 阶段评审定（默认：警示文案即够 · 报告建议原文为「如要求」非强制） | `src/cli-assets.ts:189/:196` 输出区 + 快照断言 | §3.F · D-24-W4-WARN-ONLY |

## 4. 非范围

| 项 | 理由 |
|----|------|
| 签名/密钥体系 | 沿用 2.3-W5 边界（仅 sha256 清单） |
| 排除项升级为 exit 2 | 报告建议原文口径 = warning 级（「不必然 exit 2，但必须可见」） |
| rebuild 加交互确认/双人复核 | 默认不做（警示文案口径）· 评审若定则属本波可选项上限 |
| 对外口径收窄（T-03 降调 · 安全设计 §5.3.1） | **归 W5**（文案波 · 本波落地后文案有据可依） |
| provenance/OIDC 启用 | 仅人（路线 §7 · 00 §3） |
| 外部遥测 | 沿用 2.3-W5 边界 |

## 5. 设计

### 5.1 verify 排除项 warning（N2）

- 现状：排除清单单一常量双侧消费（D-23-W5-EXCLUDE · `cli-assets.ts:9/:29`）。
- 修正：verify 侧扫描时收集被排除项清单 → 输出 `WARN: 排除项 N 个（不参与哈希校验）: <相对路径清单>`；exit code 语义不变（0/2 口径不动 · warning 不走 exit 1）。
- `--json` 面：warning 入独立字段（如 `excluded: [...]` · 键集「只增不改」为新增键 · 合规）。

### 5.2 rebuild 追认警示（N5）

- 现状输出：`:189` 扫描提示 + `:196` dry-run 提示（已含「修复对象=manifest 声明 · 资产为真值永不反向改」）。
- 修正：dry-run 与 `--yes` 写盘两路均追加**追认警示**：「本操作将当前资产状态追认为真值——若资产曾被篡改，篡改将随本次 rebuild 被合法化；防投毒依赖 provenance（当前未启用）」。文案快照断言入测试。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 排除项 warning（不升 exit 2） | **采纳（D-24-W4-WARN-ONLY）** | 报告建议原文口径 · 排除生成侧合理（F-W5-06 既定） |
| 排除项升 exit 2 | 弃选 | `.bak` 等合法临时态会持续报红 · 与 2.3.1 发布卫生六件套职责重叠 |
| rebuild 警示文案 | **采纳** | 最低代价把「追认语义」摆到操作者眼前 |
| rebuild 强制二次确认旗标 | 备选（task 评审定） | 报告原文为「如要求」非强制 · 防误操作收益 vs 自动化断链代价 |

## 7. 验收标准（必须自证，不接受「我改完了」）

1. **N2 构造**：`assets/` 靶场内放 `.bak` → `assets verify` exit 0 **且**输出 warning 点名该文件（相对路径）；删除后 warning 消失；`--json` 面含 `excluded` 字段。
2. **N5 快照断言**：rebuild dry-run 与 `--yes` 两路输出含追认警示文案（快照/子串断言）；警示中「provenance 未启用」口径与 guide 自述一致。
3. **三负向不回退**：mismatch / missing / extra 仍 exit 2（2.3-W5 既有用例全绿）。
4. **CI 语义不变**：warning 不影响 failClosed（真实篡改仍 exit 2 · 无 `continue-on-error` 类削弱引入）。
5. `npm run typecheck` 0 错 · `npm test` 全绿（含新增）。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W4-01 | 排除项数量大（ warning 刷屏） | 清单截断 + 总数汇总（前 N 条 + `… 共 M 个`） |
| F-W4-02 | warning 与 exit 2 输出混淆 | warning 独立 `WARN:` 前缀 / `--json` 独立字段 · exit code 不变 |
| F-W4-03 | rebuild 警示文案漂移 | 快照断言锁文案（含「追认」「provenance（未启用）」关键词） |
| F-W4-04 | CI 将 warning 误判失败 | exit code 语义不动 · CI 接线不增新判据 |
| F-W4-05 | 排除清单未来扩项 | 单一常量双侧消费保持（D-23-W5-EXCLUDE 沿袭）· warning 自动跟随 |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = §3.C（110 vs 113 实测）+ §3.F（V3 篡改+rebuild 实验 · G5 口径冲突表）+ 本棒只读复核（cli-assets.ts:9/:29/:189/:196 · 安全设计 :77/:418/:768 · guide :3） | no |
| R1 | 范围 = ①②；非范围 = 签名 / exit 2 升级 / 二次确认默认 / 对外口径（归 W5）/ provenance 启用 | no |
| R2 | §6 表：warning vs exit 2 · 警示 vs 二次确认 | no |
| R3 | 边界：exit code 不动 · CI 不增判据 · 排除清单单一常量保持 | no |
| R4 | `test_strategy=required`：warning 构造 + 警示快照断言 + 三负向回退锁 | no |
| R5 | **已签收**（2026-09-14 · HG-SPEC-SIGNOFF=approved · 00 代签）· 下一棒：00 拆 W4 task → 20-task-audit → HG-AUDIT-R1 → 30/40 | no |

**residual_risks**：① warning 级信号依赖人读（缓解：CI 日志可见 · 口径收窄文案 W5 配套）；② 「防漂移非防投毒」的认知仍可能回潮（缓解：W5 文案三调 + rebuild 警示双侧钉死）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-14 维护者本窗授权 00 代签） | ~~本 SPEC 定稿~~ · 冻结 D-24-W4-WARN-ONLY |
| HG-AUDIT-R1（W4 task） | pending | W4 30 改码前（20 审查文落盘后 00 代签） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | draft · 10-spec · 行号经本棒只读复核 |
| 2026-09-14 | signed · HG-SPEC-SIGNOFF approved（00 代签 · 2026-09-14 维护者授权） |
