# 02 · W2 · 钉面维度扩展（pin dimensions）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）· 隶属 `2_3-wiring-completion`  
> **test_strategy**：`required`（双向负向靶场 exit 2 + 正向回归）  
> **上游**：验收报告 §7「对称现象」机制化建议（[A]#3/#4 同型根因）· PROMPT §3 W2 行

---

## 1. 背景

2.2.0 验收 §7 指出一对方向相反、根因相同的缺口：

- **文档跑在打包前面**：W5 新增 `GLOSSARY.md` 并让 README 双语 4 处链向它，但没同步 `package.json#files` → 安装后死链（[A]#3 · 2.2.1 已手工修复）。
- **能力跑在文档前面**：W6 把宿主从 4 扩到 7，但根 README 双语均未更新 → npm 页面低估自己（[A]#4 · 未修，W7 收口文档面）。

验收 §7 原文建议：「2.3 可考虑把『新增文档须在 files 白名单内』『新增宿主须在根 README 表内』也纳入机械校验——这两条比版本号钉更容易漏，且同样可数据化。」A1 目前只覆盖**版本号**一维，本波把钉面扩展到**关联面一致性**两维。

## 2. 目标

「改了一处，没把它的关联面一起改」这类漏改，从人工记忆变成机械门禁（failClosed exit 2 · 与 pins 同语义）。

## 3. 范围

| # | 校验 | 机械化口径（建议 · task 定稿） |
|---|------|-------------------------------|
| ① | **文档↔files 白名单**：凡被打包文档（README 双语 / RELEASING 等 files 内文件）以相对链接引用的仓根级文档，须在 `package.json#files` 白名单内 | 扫描 files 内 markdown 的相对链接 `](X.md)` → 每个被引用且存在于仓根的 `X.md` 须 ∈ files |
| ② | **宿主↔根 README 表**：适配表（`mvp-hosts.yaml`）每个 `host_id` 须在根 README 双语（`README.md` + `README.zh-CN.md`）多宿主表述中出现 | 适配表 host_id 集合 → 每个 id 在两根 README 中可机检命中（宿主名/落点目录名映射入数据） |

- 形态（D-23-W2-CHECK-FORM · 已定案优先级）：**优先 `release-pins.yaml` 纯数据扩展**；pins 数据模型表达不了「集合包含」语义时，落**独立 check**（新 extract kind 或独立子命令），复用 pins 门禁语义（exit 2 · prepublishOnly + CI 接线）。
- 两条校验的「被引用文档清单」「宿主名→README 命中形态」映射均落为数据。

## 4. 非范围

| 项 | 理由 |
|----|------|
| 通用「文档-实现一致性」框架 | 本波只做这两条已发生过的同型校验，不抽象 |
| 校验 README 链接的远端可达性（http） | 网络绑定 · 离线纪律 |
| `delivery/promotion/` 物料的 links 校验 | 非打包面 · 属推广轨 |
| 修改 W6 尚未落地宿主的 README 行 | W6/W7 职责；本波只建校验机制（机制先行，W6 落地即受约束） |
| pins 引擎架构重构 | 定点扩展；独立 check 也是最小实现 |

## 5. 设计

### 5.1 校验①：文档↔files

- 输入：`package.json#files` 数组 + files 内全部 markdown 文件的相对链接目标集合（仅仓内相对路径 · 不含 http/锚点）。
- 判定：链接目标存在于仓根（非目录内相对）且为 `.md` → 须在 files 白名单（含 glob/目录前缀匹配，如 `assets` 覆盖 `assets/**`）。
- 失配输出：指出 `引用文件:行号` + 被引用文件 + 建议（`files` 加白 or 移除链接）。
- 2.2.1 现状应 PASS（GLOSSARY.md 已入 files）——以现状为正向回归基线。

### 5.2 校验②：宿主↔根 README

- 输入：适配表 `host_id` 集合（当前 7）+ 每个 host 的 README 命中形态映射（数据：host_id → 命中字符串，如 `copilot` → `Copilot` / `.github/skills`）。
- 判定：每个 host 的命中形态在 `README.md` 与 `README.zh-CN.md` **双双**可机检命中。
- 现状预期：**fail**（[A]#4 未修 · copilot/codex/windsurf 在根 README 命中 0）→ 本波机制落地后由 W7① 修文档面转绿；**两波协同：W2 落地时允许该校验以「已知偏差清单」数据豁免过渡（豁免入数据 · 有截止波次 W7），或 W2 排在 W7① 之后接线**——协同口径随 task 定稿（评审点）。
- W6 新宿主落地即受本校验约束（无豁免新债）。

### 5.3 门禁接线

- `pins check` 内（若纯数据形态）或独立 check 挂 `prepublishOnly` 链尾 + CI test job（与 pins 同点位）。
- exit 2 failClosed · 无新豁免参数（过渡豁免走数据清单，非命令行旗标）。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 纯数据扩展 release-pins.yaml（新 extract kind：`files-whitelist-link` / `readme-host-row`） | **优先（D-23-W2-CHECK-FORM）** | 沿袭「新增落点只改 yaml」根因解法 |
| 独立子命令（如 `pins check --dimensions` / `docs check`） | 备选 | pins 数据模型若装不下集合语义则落此；复用 exit 2 门禁 |
| 只做 lint 警告（warn-only） | 弃选 | 验收 §7 定性「机械校验」；warn 会被忽略 = 假保护（2.2 SPEC 01 既有裁决） |
| 校验②现状 fail 即硬接线无过渡 | 弃选 | W7 文档面未修会立刻红；过渡豁免入数据（含截止波次）保持诚实 |

## 7. 验收标准

1. **校验①负向**：构造「仓根新增 `FOO.md` + README 加相对链接 + 不入 files」→ 校验 exit 2 指出 `README.md:行号` 与 `FOO.md`；入 files 后转绿。
2. **校验②负向**：构造「适配表加 dummy host + 根 README 无对应行」→ exit 2 指出 host_id 与缺失侧（EN/ZH 分别）。
3. **正向回归**：现状（7 宿主 · GLOSSARY 已入 files）下校验① PASS；校验②按 §5.2 协同口径（豁免过渡或 W7 后）PASS。
4. CI / prepublishOnly 接线点位实测命中（改动触发即红）。
5. `npm run typecheck` 0 错 · `npm test` 全绿。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W2-01 | README 链接写法变体（锚点 `](X.md#sec)` · 尖括号 · 图片） | 锚点剥除后判定；图片链接同口径；解析失败 → 报 `extract_error` failClosed 不静默 |
| F-W2-02 | files 用目录前缀（`assets`）而非逐文件 | 前缀匹配算入白名单（`assets/x.md` ∈ `assets`） |
| F-W2-03 | 链接指向 S2 目录文档 | S2 非打包面 → 判失配并提示「S2 文档不得被已打包文档链接」 |
| F-W2-04 | 宿主命中形态误命中（如 `agents` 命中普通单词） | 命中形态映射入数据并带上下文锚（如表格行 / 落点目录名），task 定稿逐宿主核对 |
| F-W2-05 | 过渡豁免超期（W7 完成仍挂豁免） | 豁免数据含 `until_wave` 字段；超期存在 → 校验自身报债（或 task 关账时移除） |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = 验收 §7 对称现象原文 + [A]#3/#4 定性 + 2.2.1 已修/未修现状 | no |
| R1 | 范围 = 两条校验 + 接线；非范围 = 通用框架 / 远端链接 / promotion 物料 / README 文档面修复 | no |
| R2 | §6 表：纯数据 **荐** / 独立 check 备 / warn-only 弃 / 无过渡硬接 弃 | no |
| R3 | 边界：解析变体 failClosed · S2 链接判失配 · 宿主命中误伤防数据化 · 豁免过渡不超期 | no |
| R4 | `test_strategy=required`：双向负向靶场 + 正向回归 + 接线点位实测 | no |
| R5 | **已签收**（2026-09-12 · HG-SPEC-SIGNOFF=approved · 00 代签）· 下一棒：00 拆 W2 task（含与 W7① 协同口径定稿） | no |

**residual_risks**：校验②与 W7① 的波次协同（先红后绿 vs 豁免过渡）是最大不确定点，task 阶段 R2 定稿；README 命中形态对双语文案未来改写的脆性（缓解：映射入数据）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-12 维护者会话授权 00 代签 · 与 2.2.0/2.2.1 同模式） | ~~本 SPEC 定稿 · 冻结 D-23-W2-CHECK-FORM~~（已冻结） |
| HG-AUDIT-R1（W2 task） | pending | W2 30 改码前（task 阶段 00 代签） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | draft · 10-spec · 验收 §7 机制化建议数据化 |
| 2026-09-12 | signed · HG-SPEC-SIGNOFF approved（00 代签） |
