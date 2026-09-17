# 审查文：task_3_0_w7_closeout_external · R3（20-task-audit · 放行确认）

> **hat_id**：20-task-audit · **轮次**：R3 · **日期**：2026-09-17  
> **审查对象**：`docs/tasks/active/task_3_0_w7_closeout_external.md`（§S7.3 按 00 最终裁定收敛（撤销 `人闸` 弃用方向 · 唯一判红 = 变体词 `门控`）· HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1=pending）  
> **对照真值**：GLOSSARY 真值（`:11` 五保留词 · `:44/:81` gate=门禁 · `:45/:82` human gate=人闸）· R1/R2 审查文 · SPEC 08 §3 ③ · PLAN W7 + 硬约束 7/9/14  
> **审查性质**：放行确认（独立复测新口径 · 撤销方向核验 · R2 advisory A8–A11 落笔核对）；**未改** task 实质；**不代签** HG-AUDIT-R1

---

## 一、结论摘要

| 维度 | 结论 |
|------|------|
| **B1 是否闭合** | ✅ **闭合** —— 00 最终裁定纠正根因（把 canonical 保留词 `人闸` 误当弃用词），撤销对 `人闸`/`人工闸` 的 forbidden/豁免枚举；唯一判红对象收窄为**变体词 `门控`（应为 `门禁`）**，且限自述/对外面。本审独立复测：**判红面 `门控` 残留 = 0** · canonical 词 0 判红 · `后门控制` 不误报 · GLOSSARY 五词在位 |
| **S7.3↔S7.5 冲突** | ✅ **已解除** —— K-3 目标文本（内核 SDD `门控`）落 `delivery/research_report.md`，属 ③ 豁免面 ⇒ S7.5 执行 K-3 改写不再触发术语闸（⑥ 已登记） |
| **R2 advisory A8–A11 落笔** | ✅ 全部落地（A8 `~46` · A9 基线 :87 改最终口径 · A10 S7.7 参数化排除 current task 路径 · A11 计次/逐行口径标注） |
| **流程闸** HG-AUDIT-R1 | **仍 pending**；本审复跑：`task lint` PASS（W3 占位符 warn draft 期合法）· `gate-check` exit 2（仅 2 行 · HG-RELEASE 不渲染 · 仅 HG-AUDIT-R1 拒 30） |
| **结论** | **PASS · 可签**（blocking 0 · advisory 2 标注级）· 建议 00 代签 HG-AUDIT-R1（含 A1 显式确认） |

---

## 二、B1 闭合判定（新口径独立复测）

### 2.1 判据逐条复测（本审自研脚本 · 按 §S7.3 ②③④⑤）

| § | task 判据 | 本审独立复测 | 判定 |
|---|-----------|-------------|------|
| ① | canonical 保留词（门禁/过程轨/帽制/人闸/真值源）任何位置不判红 · 撤销二者 forbidden | GLOSSARY `:11` 含五词（本审逐词命中 YES）· 脚本对 `人闸`/`人工闸` **无任何判红规则**（canonical 保留词 0 判红） | ✅ |
| ② | 唯一判红 = `门控` · 仅六目标面 | 判红面逐文件：`README.md`/`README.zh-CN.md`/`GLOSSARY.md`/`MIGRATION.md` = **0** · `RELEASING.md` = **3**（全 `门控 skip`）· `delivery/promotion/**` = **0** | ✅ |
| ③ | 豁免面逐条（research_report / 安全设计 / 系统设计 / docs/spec / 历史 PLAN / `门控 skip` / 词边界） | research_report.md 3 行 · 安全设计.md 1 行 · 系统设计.md 0 · docs/spec/** 2 行 · docs/roadmap/** 11 行 —— 均在豁免面 | ✅ |
| ④ | `门控` 判红面命中 = 0 | **判红面命中 3 · 全为 `门控 skip`（gated-test 语义）已豁免 ⇒ 残留 = 0** | ✅ |
| ⑤ | 正负 fixture | `人闸`/`人工闸`（含行内 `## 人工闸` · `人工闸表`）不红 · promotion 注入 `门控` 真红 · research_report 的 `门控`/`门控 skip`/`后门控制` 不红 —— 落 S7.3 ⑤ 与验收 #1 | ✅（fixture 规格可机检） |
| ⑥ | K-3 冲突解除登记 | :127 明文「K-3 目标文本『内核 SDD 门控』位于 research_report.md（③ 豁免面）⇒ 与 S7.3 自洽」 | ✅ |

### 2.2 判红面残留（决定性 · 全部列出）

| 落点 | 文本 | 处置 |
|------|------|------|
| `RELEASING.md:80` | `1 门控 skip` | ③ 豁免（gated-test） |
| `RELEASING.md:93` | `1 门控 skip` | ③ 豁免 |
| `RELEASING.md:104` | `1 门控 skip` | ③ 豁免 |

⇒ 判红面 `门控` **残留 = 0**；`README.md`/`README.zh-CN.md`/`GLOSSARY.md`/`MIGRATION.md`/`delivery/promotion/**` 均零 `门控`。

### 2.3 词边界与误报复核

- `后门控制`（`delivery/安全设计.md:566`）含 `门控` 子串 —— ③ 词边界排除 + 该文件属豁免面 ⇒ **不判红**（R2 误报点已消）✅；
- 行内 `` `## 人工闸` ``（`delivery/系统设计.md:1284`）与 `人工闸表`/`formatGateCheck 人工闸` 全形态 —— canonical/结构位，① 撤销后 **0 判红** ✅；
- `门控 skip`（环境门控语义）与 `spec-kit 门控`（竞品义）—— 前者 ③ 豁免；判红面内实测 3 处全为 `门控 skip` ✅。

### 2.4 基线计数核对（与 task §S7.3 基线块一致）

| 项 | task 声称 | 本审复测（git grep 全 tracked 口径） | 判定 |
|----|-----------|-----------------------------------|------|
| `门控` 全 tracked | **95 计次** | **95**（全文件口径；仅 md 为 92 · 差 3 = `test/cli-peer-optional.test.ts`） | ✅ |
| `门控` 判红面 | **3**（全 `门控 skip`） | **3**（全 `RELEASING.md:80/93/104` · 全 skip） | ✅ |
| `门控` 残留 | **0** | **0** | ✅ |
| `人闸` 非 S2 | **74 计次 / 65 行** | **74 计次 ✓ / 67 行**（行口径 ±2 · 信息基线 · canonical 非残留） | ✅（±2 见 A13） |

---

## 三、R2 advisory A8–A11 落笔核对

| # | R2 要求 | 落笔 | 判定 |
|---|---------|------|------|
| A8 | :112「~48」→ ~46 | :112「其余 **~46 文件（53−7）**」 | ✅ |
| A9 | 基线 :87 `门控` 77 → 最终口径 | :87「唯一判红 = 变体词 `门控` · 判红面实测 **3**（全 `RELEASING` 的 `门控 skip` 已豁免）· 全 tracked **95 计次** · **残留守 0**」 | ✅ |
| A10 | S7.7 in-flight 口径措辞 | :174「**参数化排除 current task 路径（本 W7 task）· 基线取 26** · **active/ 其他新增坏链仍拦**」 | ✅ |
| A11 | 冻结计数计次/逐行口径 | §S7.3 ④「**计次 / 逐行口径标注**」+ 基线块「计次 / 逐行口径」；验收 #1 ④ 同文 | ✅ |

（A1–A7 已在 R2 逐条确认，本轮未回退；A1 显式确认项仍在 :47/:212。）

---

## 四、发现清单

### Blocking（0 条）

无。

### Advisory（2 条 · 标注级 · 不阻塞签闸）

| # | 内容 | 建议 |
|---|------|------|
| A12 | **判红面是开集措辞**：② 列六目标，但未写「判红面 = 此六目标闭集」；若 30 误把扫描面扩到全非 S2，会命中 `.workbuddy/output/research_report.md`（3 处 `门控`）与 `.workbuddy/output/安全设计.md`（1 处）——二者路径不在 ③ 豁免名单（③ 只列 `delivery/research_report.md`/`delivery/安全设计.md`）；`CHANGELOG.md` 4 处则全为 `门控 skip`（若纳入亦豁免） | S7.3 ② 补一句「判红面 = 本六目标（闭集）· 其余 tracked 不扫」，或把 `.workbuddy/output/**` 明确列入豁免（二者当前残留均 0 · 仅防 30 扩面误伤） |
| A13 | **`人闸` 行口径 ±2**：task 基线 **65 行** · 本审 `git grep -n` 全 tracked 非 S2 = **67 行**（计次 74 一致）· 属行计数定义差（多匹配行/合并） | 30 按 F-W0-05 式复跑登记（**信息基线仅 · canonical 非残留 · 不影响判据**） |

---

## 五、R3 总结论

**R3 = PASS · 可签（blocking 0 · advisory 2）**。00 的根因裁定正确且经本审独立复测成立：`人闸` 是 GLOSSARY `:11` 五保留词之一（canonical）、`人工闸` 是 task 文件节名/表名，二者均合法；R1/R2 的 B1 实为「把 canonical 词当弃用词」的判据错配，撤销该方向后 **唯一判红对象收窄为变体词 `门控`（应为 `门禁`）· 仅自述/对外面**。独立复测：**判红面 `门控` 残留 = 0**（仅 `RELEASING.md` 3 处 `门控 skip`，已豁免）· `README` 双语/`GLOSSARY`/`MIGRATION`/`delivery/promotion` 零 `门控` · canonical `人闸`/`人工闸` 0 判红 · `后门控制` 词边界不误报 · GLOSSARY 五词在位 · K-3 目标文本落豁免面 ⇒ **S7.3↔S7.5 冲突解除**；基线计数与 task 声称一致（`门控` 95/判红 3/残留 0；`人闸` 74 计次一致）。R2 的 A8–A11 全部落地；A1–A7 未回退。

**可签判定**：**建议 00 代签 HG-AUDIT-R1=approved**（含 A1 显式确认：**HG-RELEASE 不适用 blocks-30 强制** · **tag 取严 · 3.0.0 tag 留维护者** · 差异登记留 W7 报告）。签后 30 可开工（`gate-check` 将不再因 HG-AUDIT-R1 拒 30）。遗留：A12（判红面闭集措辞）· A13（`人闸` 行口径 ±2）· A10/A7（10/00 invoke 待落）——均标注级，30 执行期按基线节 F-W0-05 纪律登记即可。

本审**不代签** HG-AUDIT-R1。**因 HG-AUDIT-R1 仍为 pending，按纪律不附 30 Prompt**，仅出维护者签闸清单：

## 维护者签闸（R3 后 · 30 前）

- [ ] 已读 R1 + R2 + R3 审查结论（R3 = PASS · 可签 · blocking 0 · advisory 2）
- [ ] 在 task 人工闸表将 **HG-AUDIT-R1 改为 approved**（00 代签 · 维护者 2026-09-16 授权 · 含 **A1 显式确认**：HG-RELEASE 不适用 blocks-30 · tag 取严 · 3.0.0 tag 留维护者）
- [ ] commit task 文档或确认已签（连同本棒交付：R3 审查文 + `docs/harness/invokes/by-task/3-0-w7-closeout-external/invoke_20260917_20_3-0-w7-closeout-external_R3.md` · 逐文件显式 add · 禁 `git add -A`）
- [ ] 确认 10/00 invoke 落盘（pre-30 闸 required ∩ {10,20,00} 须齐 · 缺则 verify --task BLOCKED 点名）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；approved 后方可开工。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | R3 · 20-task-audit 放行确认：独立复测新口径（判红面 `门控` 残留 0 · canonical 0 判红 · 词边界/GLOSSARY/K-3 冲突解除）· 基线 95/3/0 与 74 计次一致 · A8–A11 全落地 · **PASS · 可签**（advisory A12 判红面闭集措辞 · A13 `人闸` 行口径 ±2）· 建议 00 代签 HG-AUDIT-R1（含 A1 确认） |
