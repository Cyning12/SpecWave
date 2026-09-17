# 审查文：task_3_0_w7_closeout_external · R2（20-task-audit · 复审）

> **hat_id**：20-task-audit · **轮次**：R2 · **日期**：2026-09-17  
> **审查对象**：`docs/tasks/active/task_3_0_w7_closeout_external.md`（R1 后 10-task 按 B1 + A1–A6 回填 · HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1=pending）  
> **对照真值**：R1 审查文 `task_3_0_w7_closeout_external_audit_R1_20260917.md`（blocking B1 · advisory A1–A7）· SPEC 08 · PLAN W7 + 硬约束 1/7/8/9/14/15/16 · `RELEASING.md`  
> **审查性质**：复审（逐条复核 R1 发现是否闭合）+ 独立复测（自研豁免模拟脚本对 task 自述 forbidden 面逐行扫描 · 链接机检 · 闸机检）；**未改** task 实质；**不代签** HG-AUDIT-R1

---

## 一、结论摘要

| 维度 | 结论 |
|------|------|
| **B1 是否闭合** | **❌ 未闭合（仍 blocking）** —— task 采纳的方案 (b) 精确枚举豁免，在 task 自述 forbidden 面 ①（README 双语/GLOSSARY/RELEASING/MIGRATION/delivery/**/docs/ontology/**）独立复测残留 **9 处**（`人工闸` 5 + `门控` 4）；①+docs/spec ⑤ 残留 **16 处**（人工闸 11 + 门控 5）。**「豁免后余量 = 0」不成立**。且见 2.3 的 **S7.5 K-3 ↔ S7.3 门控 自冲突**（K-3 强制写入的文本本身即残留） |
| **A1–A6 落笔** | ✅ **全部落地且忠实**（A1 裁定块 + :47/:212 · A2 :6/:297 断链已修 + S7.7 排除 in-flight active · A3 31 件 · A4 53 文件 · A5 ≤300 硬判据 · A6 `release-tag-identity` 补点名）；另有 3 处残留小口径（A8–A10 · 标注级） |
| **流程闸** HG-AUDIT-R1 | **仍 pending**；本审机检复跑：`task lint` PASS（W3 占位符 warn draft 期合法）· `gate-check` exit 2（仅渲染 HG-TASK-DRAFT approved + HG-AUDIT-R1 pending 拒 30 · HG-RELEASE 不渲染） |
| **结论** | **仍退回 10-task**（B1 未闭合，不可签）；A1–A6 可确认。最小闭合路径见五 |

---

## 二、B1 闭合判定（独立复测）

### 2.1 冻结计数核对（task ③ vs 本审实测）

| 项 | task ③ 冻结值 | 本审 R2 实测 | 判定 |
|----|--------------|-------------|------|
| `人工闸` 非 S2 | **119** | **119（出现计数）** · 按行计 98 行 | ✅ 数值一致（口径注见 2.4） |
| `人工闸` 全 tracked | **450** | **450** | ✅ |
| `门控` 扫描面 | **16** | **16** | ✅ |
| `门控` 全 tracked | **90** | **90** | ✅ |

### 2.2 ② 逐条豁免模式实测残留（本审独立模拟）

模拟口径：按 task ② 的 5 条豁免（`^#{2,6}\s*.*人工闸` / `人工闸表` / `formatGateCheck 人工闸` / `parseHumanGates`·`human_gate`·`GATE` / `### 人工闸`）与 `门控` 两条（`门控 skip` / `spec-kit 门控`）逐行判定，扫描 task ① / ⑤ 自述的 forbidden 面。

| 扫描面 | `人工闸` 残留 | `门控` 残留 | 合计 |
|--------|--------------|-------------|------|
| **① forbidden 面** | **5** | **4** | **9** |
| ① + docs/spec（⑤） | 11 | 5 | **16** |

**① forbidden 面残留（9 · 决定性）**：

| # | 落点 | 残留文本（节选） | 为何未被 ② 覆盖 |
|---|------|------------------|------------------|
| 1 | `delivery/安全设计.md:217` | 「人工闸（HG-*）仍需人签」 | 裸散文 `人工闸` · 非 表/非 GATE token |
| 2 | `delivery/安全设计.md:290` | 「谁能签发人工闸」 | 裸散文 |
| 3 | `delivery/安全设计.md:598` | 「人工闸（HG-*）独立留档」 | 裸散文 |
| 4 | `delivery/安全设计.md:780` | 「绕过人工闸」 | 裸散文 |
| 5 | `delivery/系统设计.md:1284` | 「+ `## 人工闸` 表」 | `^#{2,6}` **行首锚**，此处为行内 `` `## 人工闸` `` ⇒ 不匹配（标题层级无关 ≠ 位置无关） |
| 6 | `delivery/research_report.md:120` | 「…Implement **门控**流程」 | 竞品义 门控 · 非 `spec-kit 门控` |
| 7 | `delivery/research_report.md:166` | 「**门控**流程：constitution→…」 | 竞品义 |
| 8 | `delivery/research_report.md:172` | 「**门控**是流程性的…」 | K-3 目标行（见 2.3） |
| 9 | `delivery/安全设计.md:566` | 「后门控**制**」 | `后门控制` 含 `门控` 子串——**裸子串误报**，② 未定义词边界 |

**① + docs/spec 追加残留（7 · ⑤ 面）**：`docs/spec/2x-host-adapt/00_policy_and_boundaries.md:36`（绕过 HG-AUDIT-R1 / 人工闸）· `02_commands_catalog_draft_v1.md:15`（扫人工闸与 status）· `03_borrow_research_openspec_and_peers_v1.md:118`（人工闸 / verify exit）· `docs/spec/self-tech-graph/reference/architecture_1.2.2.md:14`（人工闸解析）· `cli_surface_1.2.2.md:47`（仅人工闸投影）· `cli_surface_1.2.2.md:57`（W2 缺人工闸节）· `docs/spec/3_0-architecture-leap/08_w7_closeout_external_v1.md:62`（K-3 改后文本「内核 SDD 门控为流程性」——**也含 `门控`**）。

### 2.3 决定性自冲突：S7.5 K-3 与 S7.3 `门控` 豁免不兼容

- S7.5 K-3（task :153）**强制**把 `delivery/research_report.md:172` 改为「**内核 SDD 门控为流程性；但扩展生态已含机械门禁类…**」；该目标文本含 `门控`，且**不带 `spec-kit` 前缀**（既非 `门控 skip`，也非 `spec-kit 门控`）。
- S7.3 ② 的 `门控` 豁免只有两条字面（`门控 skip` / `spec-kit 门控`）⇒ 30 一旦落实 K-3，就会在 forbidden 面制造一处**新残留** ⇒ **S7.3 与 S7.5 互相拆台**，无论 30 如何枚举都无法同时满足「K-3 定稿」与「门控豁免后余量=0」。
- 同类：`research_report.md:120`（K-1 行）与 `:166` 的 `门控流程` 均非 K 台账改动对象，改 K-1/K-2 数值后仍在，forever residual。

### 2.4 口径小疵（A11）

冻结计数 `人工闸` 119 为**出现次数**（本审 R1 同法），而同表 `门控` 16 偏**行数口径**；若 30 脚本按「逐行 `文件:行号` 报告 + 行计数」实现，则 `人工闸` 会读出 98 行 ≠ 冻结 119 ⇒ 可能触发「数字漂移即红」自锁。建议 ③ 写明「计次 or 计行」。

---

## 三、A1–A6 落笔核对（逐条）

| # | R1 要求 | 落笔落点（本审实读） | 判定 |
|---|---------|---------------------|------|
| A1 | HG-RELEASE 偏差登记 + tag 权限统一取严 | :47 裁定块补「**00 将于代签 HG-AUDIT-R1 时显式确认本偏差** · 建议 10-spec 给 SPEC §10 加注记 · **tag 权限统一取严**：SPEC §3⑩ / RELEASING ⑤ / README:380 的『Agent 可 tag』本波不执行 · 3.0.0 tag 留维护者 · 差异登记留 W7 报告」；:212 ⑤ 同文 | ✅ 忠实 |
| A2 | 修 :6/:300 断链 + S2 冻结基线含 in-flight 口径 | :6 → `../done/task_3_0_w6_observability_audit.md` ✓；:297（原 :300）→ `../done/…` ✓；S7.7 :172/:178 写明「**冻结基线口径 = 排除 current in-flight active task（即本 W7 task 自身）· 基线取 26** · 新增 S2 坏链仍须拦 · 含 active/ 新档」 | ✅ 忠实（本审链接机检：task 自身仅剩 1 处坏链 = :180 负 fixture 字面 `../.workbuddy/output/nope.md`，属设计示例且被「排除 active task」口径覆盖） |
| A3 | 证据件数 33 → 31 | :84「实测 **31 件**（`.workbuddy/output/` 23 + `_frag/` 8 · 30 复跑重建口径）」；R0 :306 同步 31；residual_risks ⑤ 「31 件」 | ✅ 忠实 |
| A4 | E3 分布 55 → 53 | 基线 :78「分布 **53 个文件（671 精确）**」；R0 :306「53 文件」 | ✅ 忠实（唯 :112 仍写「其余 ~48 文件」→ A8） |
| A5 | E3 目标升 ≤300 硬判据 | S7.2 :109「AFTER 目标定稿 = **≤300（机检硬判据）**」；:116 F-W7-07「沉降后复跑仍未达 **≤300（规范下限 · 机检）** → STOP」；验收 #7 :276 同文；residual_risks ① 同文 | ✅ 忠实 |
| A6 | bump 清单补点名 release-tag-identity | :217 测试清单补「**`release-tag-identity`（tag-gated · 打 tag 前设计红）**」（`version-pins-f5` 在 ④ :211） | ✅ 忠实 |

---

## 四、发现清单

### Blocking（1 条 · 继承 R1 B1 · 未闭合）

| # | 小节 | 内容 | 闭合建议 |
|---|------|------|----------|
| **B1** | **§S7.3 术语统一** | 方案 (b) 的 ② 豁免枚举**不足以令残留归零**：① 面实测残留 **9**（`人工闸` 5 · `门控` 4）· ①+docs/spec **16**；其中 `delivery/系统设计.md:1284` 为**行内** `` `## 人工闸` ``（`^#{2,6}` 行首锚不匹配）· `delivery/安全设计.md:566` 为 `后门控制` **裸子串误报**（无词边界）· `research_report.md:120/166/172` 与 SPEC :62 的 `门控` 为**竞品义**（非 `spec-kit 门控` 字面）；且 **(2.3) K-3 强制写入的 `门控` 文本本身就是残留** ⇒ S7.3 与 S7.5 自冲突 | 二选一（均须 fixture 钉死）：**(a) 拆分语义**——`门控` 移出术语机检（交 S7.4 `check-claims` 做**声明级**判据，术语机检只留 `门禁` 替换类），`人工闸` 豁免补「**位置无关结构位** = 行内含 `` `#{2,6} 人工闸` `` 或 `人工闸（HG-`/`HG-*`」+ 明确**词边界**（排除 `后门控制`）；或 **(b) 收窄 forbidden 面**——把 `delivery/安全设计.md`·`delivery/系统设计.md`（内部架构档）移出自述散文面（但 `research_report.md` 必留 ⇒ 仍须解决 `门控` 竞品义）。同时把残留「消除方案」写进 S7.3 修正条（改文本 or 扩枚举，逐条登记），不得只声称余量为 0 |

### Advisory（4 条 · 标注级 · 不阻塞 A 面）

| # | 内容 | 建议 |
|---|------|------|
| A8 | 基线 :78 已改 53，但 :112 批次序仍写「其余 **~48** 文件」（7 + 48 = 55 旧口径；53 应为 ~46） | 10-task 改 `~46` |
| A9 | 基线 :87 术语现值仍写 `门控` **77 处**，与 S7.3③ 冻结（扫描面 **16** · 全 **90**）不一致 | 10-task 同步 :87 为 16/90（或标「全 tracked 口径」） |
| A10 | S7.7「**排除 current in-flight active task**」与「新增 S2 坏链仍须拦 · **含 active/ 新档**」措辞易读成互斥（本 task 自身也是 active/ 新档） | 30 脚本参数化「current task path」排除；S7.7 补一句「排除的是『当前 W7 task 自身』这一路径，其他 active/ 新档照拦」 |
| A11 | 冻结计数 `人工闸` 119（出现）vs 行计数 98 口径未标（见 2.4） | S7.3③ 写明计次/计行 |

---

## 五、R2 总结论

**R2 = 仍 BLOCKING（B1 未闭合）· 不可签为「通过」**。A1–A6 六条回填**全部落地且忠实**（本审逐条实读 + 链接机检 + 闸机检复跑：`task lint` PASS · `gate-check` exit 2），但 **B1 的闭合判据「豁免后余量 = 0」经本审独立模拟不成立**：task 自述 forbidden 面 ① 残留 **9 处**、①+docs/spec 残留 **16 处**，并存在 **S7.5 K-3 ↔ S7.3 `门控` 豁免自冲突**（K-3 强制写入的 `门控` 文本本身就是残留）。故 R1 的 blocking 未消除，**不可进入 00 代签**；须 10-task 按四·B1 的 (a)/(b) 任一路径闭合（含词边界与位置无关结构位、K-3/门控 裁决、残留消除逐条登记）后，由 20 出 R3 或由本 R2 后续复审确认。

**可签条件（供 00）**：B1 残留归零（① 面 = 0）且 S7.3/S7.5 冲突解除后，本审的 A1–A6 结论可直接沿用，无需重审其余面（R1 常规核对与四路径均已过）。

本审**不代签** HG-AUDIT-R1。**因仍存 blocking 且 HG-AUDIT-R1 pending，按纪律不附 30 Prompt**，下一棒仍为 **10-task**：

## 维护者签闸（R2 后 · 30 前）

- [ ] 已读 R1 + R2 审查结论（R2 含 B1 残留 9/16 逐条清单与 A1–A6 核对）
- [ ] **先下 10-task**：按四·B1 的 (a)/(b) 路径闭合术语机检（残留归零 + K-3/门控 裁决 + 词边界/位置无关结构位 + 逐条消除登记）
- [ ] B1 归零后，R2 可确认/出 R3，再将 HG-AUDIT-R1 改为 approved（00 代签 · 维护者 2026-09-16 授权 · 含 A1 显式确认）
- [ ] commit task 文档或确认已签（连同本棒交付：R2 审查文 + `docs/harness/invokes/by-task/3-0-w7-closeout-external/invoke_20260917_20_3-0-w7-closeout-external_R2.md` · 逐文件显式 add · 禁 `git add -A`）
- [ ] 确认 10/00 invoke 落盘（pre-30 闸 required ∩ {10,20,00} 须齐）
- [ ] 再下发 Harness 30 Prompt

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | R2 · 20-task-audit 复审：A1–A6 逐条核对全落地；B1 独立模拟未闭合（① 面残留 9 · ①+docs/spec 16；含行内 `## 人工闸` 行首锚失效、`后门控制` 裸子串误报、`门控` 竞品义未枚举、K-3 写入文本即残留）；闸复跑 task lint PASS / gate-check exit 2（仅 2 行）；结论 **仍 blocking · 不可签**，退回 10-task |
