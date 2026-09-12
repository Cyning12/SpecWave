# SPEC Audit R1：2_2-closed-loop-start（2.2.0 闭环起步）

> **SPEC**：`docs/spec/2_2-closed-loop-start/`（slug: `2_2-closed-loop-start` · README + 00–06 全 8 份）  
> **PLAN**：`docs/roadmap/PLAN_2_2_closed_loop_start_v1_zh.md`  
> **日期**：2026-09-11  
> **角色**：20-spec-audit（书面审 · 未改 src / test / assets / .github / delivery / package.json）  
> **帽条文**：`assets/harness/prompts/20-spec-audit.md`  
> **上游**：`.workbuddy/output/PROMPT-2.2.0-落地-交给SpecWave-agent.md`（§3 波次表 · §4 W1 详规 · §5 流程 · §6 硬约束 · §7 报告格式）  
> **文案纪律**：`.workbuddy/output/推广事实卡-2.1.3.md`（§10/§11 禁称清单）

---

## 结论摘要

| 维度 | 判定 |
|------|------|
| **内容审查** | **pass · 零内容阻塞 → 签收** |
| **流程闸** | `HG-SPEC-SIGNOFF=approved` · `HG-NEXT-PLAN=approved`（00 依维护者 2026-09-11 会话预授权代签） |
| **待决冻结** | 4 项 D-* 全部采纳推荐值（见「签闸」节） |
| **下一棒** | 00 拆 W1–W7 task（每波一个）→ 各波 HG-AUDIT-R1 → 30 派工 |

---

## 核对项

| # | 核对点 | 结论 |
|---|--------|------|
| 1 | **W1–W7 与 PROMPT §3 一一对应无漏波**：W1 A1 / W2 C1+C3 / W3 C2 / W4 D1+D3 / W5 D2 / W6 B1 / W7 E1+C7；W0/D0 标「已完成 · 仅引用不重做」 | ✅ PLAN 波次总表 + 06 全覆盖，IDs 逐字一致 |
| 2 | **W1 钉面 10 行与 PROMPT §4.3 一致**：package.json version/name/bin · ontology `product_semver` · discipline-coverage `as_of_package_version` · README 双语 · RELEASING · docs/spec 索引 minor 行 · git tag | ✅ 01 §5 十行齐 · 含实测值与 fix 可写列 |
| 3 | **release-pins.yaml 数据驱动**（PROMPT §4.a 禁 TS 硬编码） | ✅ 01 §6.1：extract 表达式本身也是数据；§4 非范围首条禁硬编码 |
| 4 | **pins check / fix 规格**（PROMPT §4.b/c）：check 偏差非 0 · `--json` 四字段 path/expected/actual/status · fix 默认 dry-run `--yes` 才写 · S2 永不可写 · 写前备份 | ✅ 01 §6.2/§6.3 · 另增幂等约定（合理增强） |
| 5 | **S2 拒写为机械拒写非 warn** · 验收含反向验证 | ✅ 01 §6.3/§8.5 · F-A1-04 · 00 §3 S2 硬纪律 |
| 6 | **验收 5 条含破坏性自证**（PROMPT §4.5）：干净树 exit 0 · ontology 改 `9.9.9` → check 报错指文件与行 → fix 改回 → 贴真实输出 · 测试失配真失败 · typecheck/test 绿 · S2 拒写反向验证 | ✅ 01 §8 五条逐字对应 · 06 W1 清单同口径 |
| 7 | **门禁接线**：prepublishOnly 追加 pins check · ci.yml 增步骤 + test job 补 `timeout-minutes` | ✅ 01 §6.4（前提校核 #11 实测缺失属实） |
| 8 | **PROMPT §6 硬约束全部落入 00**：S2 永不覆写 → §3 S2 · P0 不可绕过 → §3 P0-GATE · 事实卡约束 → §3 FACT-CARD · 不扩范围（A2–A6 属 2.3/3.0）→ §2 非范围表 · 不动架构 → §2 F1 · 每波 typecheck+test → §3 TEST-LOCK | ✅ 全部落位，另增 SEMVER / PROCESS / D0-PROT（合理增强） |
| 9 | **待决推荐值自洽**：D-PINS-EXIT=exit 2（事实卡 §5 门禁阻断档 · PROMPT §4.b 同建议）· D-SPEC-213-ROW=补索引行不建夹（PROMPT §4.e 授权仓内公约定案 · 依据 git 8797b76+82fe0dc 与 doc-health 先例已写入 SPEC）· D-PINS-SCOPE-8=钉面 #8 语义入 yaml 数据（与数据驱动设计一致）· D-W2-ABS-PATH-UX=拒止+迁移指引 exit 1（事实卡 §5 用法错误档 · 与 02 F-W2-01 口径一致） | ✅ 四项均自洽且有出处 |
| 10 | **事实卡 §10/§11 合规抽查**：pins / traceId / 新宿主一律「将新增 · 当前不存在」表述（01 §3、§6.2/§6.3 标题级标注）；禁称项仅出现于非范围/纪律语境（sha256→A2 2.3 · ontology-check→A4 3.0 · 审计落盘→C6 3.0 · provenance→C5）；「7 宿主」写作验收事实并明注「落地后才可对外宣称」（06 A-2.2-09 · 04 非范围+F-W6-04 双重兜底） | ✅ grep 全目录零违禁宣称 |
| 11 | **R0–R5 思考轮闭合**：README 控制表 R0 证据→R5 签收就绪逐轮回填，early_stop 全 no；06 正文摘要同口径；residual_risks 三条（正则脆性 / W2 误伤存量 CI / 2.1.3 补行同波落地）均有缓解 | ✅ |
| 12 | **范围/非范围/验收/failure_paths 四件套**：00（政策+摘要 failure_paths）· 01（§3/§4/§8/§9）· 02 · 03 · 04 · 05 各齐；06 跨波汇总 F-X-01–07 不替代各文档 | ✅ |
| 13 | **PROMPT 前提修正已如实留痕**（PROMPT §7 义务）：cli.ts 绝对路径打印 1 处→实测 3 处（403/500/548）· resolveTaskPath 调用点 4 处（510/554/597/710）——本帽复核源码属实；W2 范围已按全部点位计 | ✅ PLAN 前提校核 #10 + 02 证据节 |
| 14 | **证据点位本帽抽测**：`cli-shared.ts:275-277` resolveTaskPath 接受任意绝对路径 ✅ · `docs/spec/README.md` 无 `2_1_3` 行且无 `2_1_3-*` 夹 ✅（钉面 #8 偏差属实） | ✅ |

## 内容阻塞

**无。**

## 非阻塞观察（不影响签收 · 留痕备查）

1. **PROMPT §4.5-5 字面写「pins check 不得把 S2 纳入可写范围」**，SPEC 01 §8.5 修正为 `pins fix`（check 本不写盘）——语义修正正确，属对上游笔误的合理解读，非偏差。
2. **`docs/spec/README.md` 已有 `2_2-closed-loop-start` draft 索引行**（10-spec 立档时所加），PLAN 校核 #6 的「索引末行为 2_1_2」表述因此略有陈旧，但实质主张（无 `2_1_3` 行、无 `2_1_3-*` 夹）成立；该索引行状态列仍写 `HG-SPEC-SIGNOFF=pending`，本次授权仅覆盖三处闸表翻转，未动此文件——建议 00 下一棒同步或留 W1 钉面机制处理。
3. **doc-health 先例表述**：01 §6.5「doc-health 行即为无独立版本夹的索引行」——doc-health 实有主题夹而非版本夹，措辞准确（「无独立**版本**夹」），先例援用成立。
4. **机械闸已知局限（工具侧 · 非 SPEC 内容问题）**：目录型 SPEC 以 `README.md` 为入口且无 `## Harness 元信息` 节，`extractSpecSlug` 回退 basename `README`，与本审查文命名的 slug 段（`2_2_closed_loop_start` → normalize `2-2-closed-loop-start`）不匹配，`verify --spec` 实测仍报 `missing spec R<n> review`（输出见下）。与帽条文所注「PRD_DEF-003 后续棒」同源。审查文实体已落盘 `docs/harness/reviews/`，存在性事实成立；00 下一棒如需过机械闸，可用登记豁免 `--allow-no-spec-review`（留痕）或将该 slug 推导局限登记 PRD_DEF-003。**本帽不强行通过机械闸。**

## 机械闸留证（`verify --spec` 实测）

审查文落盘前（2026-09-11）：

```
$ npx spec-wave verify --target . --spec docs/spec/2_2-closed-loop-start/README.md
VERIFY: BLOCKED · missing spec R<n> review · README.md
（exit 2）
```

审查文落盘后复跑（2026-09-11）：

```
$ npx spec-wave verify --target . --spec docs/spec/2_2-closed-loop-start/README.md
VERIFY: BLOCKED · missing spec R<n> review · README.md
（exit 2 · 原因见非阻塞观察 4：slug 推导回退 README，与审查文 slug 段不匹配；审查文实体存在于 docs/harness/reviews/）
```

## 签闸

- **HG-SPEC-SIGNOFF → approved**（00 依维护者 2026-09-11 会话预授权代签）
- **HG-NEXT-PLAN → approved**（00 依维护者 2026-09-11 会话预授权代签 · 出处：维护者本会话明示「授权签收此次 spec 及其相关后续所有过程文档」，与 PROMPT §5 例外条款同构）
- **待决项冻结 · 采纳推荐（同日同授权）**：
  - **D-PINS-EXIT = exit 2**（pins check 偏差 → 门禁阻断档）
  - **D-SPEC-213-ROW = 补索引行不建夹**（docs/spec/README.md 补 2.1.3 patch 收尾行 · 属 2_1_2 系列残留）
  - **D-PINS-SCOPE-8 = 钉面 #8 入 yaml 数据**（「索引表存在当前 minor 对应行或标注行」语义作数据声明）
  - **D-W2-ABS-PATH-UX = 拒止 + 迁移指引 · exit 1**（用法错误档 · 报错给相对路径写法）

## 下一棒

00 拆 W1–W7 task（每波一个 · `feat(2.2-W<n>): …`）→ 各波 HG-AUDIT-R1（人签）→ 30 派工。**本帽不附 30 Prompt · 不拆 task。**

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | R1：零阻塞 pass · 双闸代签（维护者会话预授权）· 4 项 D-* 冻结采纳推荐 · 机械闸 slug 局限如实留证 |
