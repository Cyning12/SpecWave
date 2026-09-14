# 06 · W6 · P3 清扫（P3 cleanup）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-14 维护者本窗授权 00 代签）· 隶属 `2_4-gate-strength`  
> **test_strategy**：`required`（N10/N14 各配 fixture · N4 仅留痕存在性核查）  
> **上游**：PLAN_2_4 W6 · 验收报告 §6「建议 2.4」N10/N6/N14 · N4 · 证据 §3.K/§3.O/§3.E（N6 已并入 W5⑤）

---

## 1. 背景

三个 P3 级收尾项（低风险 · 无耦合 · 垫底吸收前序波溢出小项）：

1. **N10 · pin-16 大小写假阳**（§3.K）：pin-16 白名单成员用**精确串比较**（提取/比对区 `src/cli-pins.ts:295-325`）——文档链接写 `foo.md` 而磁盘为 `FOO.md` 时判 out-of-whitelist **假阳**（macOS 默认文件系统大小写不敏感更易触发）。不构成绕过，但合法文档误红损害门禁可信度。
2. **N14 · lint-done slug 口径不一致**（§3.O）：`task lint-done` 的 **slug 级存在性判**用文件名 slug（`src/cli-task-extra.ts:73` · `extractTaskSlug(path.basename(file))`），**帽级/豁免判**用 meta slug（`:110-113` · `meta.task_slug ?? slug`）——二者不一致时豁免永不命中。生产遵循 `task_<slug>` 命名，低危。
3. **N4 · 安全拒绝 exit 1 vs exit 2**（§3.E）：`--task/--spec` 拒绝 target 之外路径返回 exit 1（用法档），与 SPEC 00 §2.4 一致、**符合契约**。仅提示：安全类拒绝与普通用法错误共享退出码，下游 CI 仅以 exit 2 作「安全事件」信号会漏读。**非缺陷 · 留痕即可**。

## 2. 目标

N10/N14 口径统一（低成本定点 · 各配 fixture）；N4 登记留痕（不改行为）。本波为 2.4.0 收尾清扫，无结构性变更。

## 3. 范围

| # | 项 | 形态 | 出处 |
|---|----|------|------|
| ① | **N10**：pin-16 白名单比较统一大小写口径——比较时大小写不敏感 + **磁盘存在性二次确认**为最终判据（双平台语义一致） | `src/cli-pins.ts:295-325` 比对区定点 + 大小写差异 fixture | §3.K |
| ② | **N14**：lint-done slug 口径统一——统一取 meta slug（`meta.task_slug`），或显式声明「meta 优先 · 文件名兜底」优先级并留档 | `src/cli-task-extra.ts:73/:110-113` 定点 + slug 不一致 fixture | §3.O |
| ③ | **N4**：留痕登记——安全拒绝 exit 1 档位的下游提示写入 2.4.0 ACCEPTANCE 档（或覆盖表 note），**不改行为** | 文档留痕（发版波收口时落入 ACCEPTANCE） | §3.E · D-24-N4-REGISTER |

## 4. 非范围

| 项 | 理由 |
|----|------|
| 通用「大小写策略」框架 | 只治 pin-16 一处假阳 · 不扩大 |
| lint-done 豁免语义本身 | 只统一 slug 取值口径 · 豁免判定逻辑不动 |
| N4 行为变更（exit 1 → exit 2） | 报告判定符合契约 · 改行为反而破 SPEC 00 §2.4 |
| W1–W5 任何实现项 | 各自独立 task |

## 5. 设计

### 5.1 N10 大小写口径

- 判据：链接目标与 `files[]` 白名单成员比较时**大小写不敏感**命中 → 再以磁盘存在性（`existsSync`）二次确认；存在即放行（不误红），不存在按既有 out-of-whitelist/missing 口径处理。
- 双平台注意：Linux CI 大小写敏感 FS 上 `foo.md` vs `FOO.md` 是真的两个文件——以「磁盘存在性」为最终判据可保双平台语义一致（大小写不敏感命中但盘上无该名文件 → 不放行）。

### 5.2 N14 slug 口径

- 现状分歧点：`:73` 存在性判用文件名 slug · `:110` `meta.task_slug ?? slug`（meta 优先已是帽级判口径）。
- 统一：存在性判集合的键同样以 `meta.task_slug ?? 文件名 slug` 归一（meta 优先 · 文件名兜底），豁免查找键不变（`:113` 已 normalizeSlug 双查）——使「文件名 ≠ meta」样本的豁免命中行为与声明口径一致。

### 5.3 N4 留痕

- 落盘口径：「`--task/--spec` 仓外路径拒绝走 exit 1（用法档 · 符合 SPEC 00 §2.4）——下游 CI 若需安全事件信号，应匹配拒绝文案而非仅 exit 2」；随 2.4.0 ACCEPTANCE 档「已知残余/留痕」节收口。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| N10 = 大小写不敏感 + 磁盘存在性二次确认 | **采纳** | 双平台语义一致 · 报告建议原文口径 |
| N10 = 强制大小写敏感 + 文档约束链接写法 | 弃选 | macOS 开发面持续假阳 · 治标不治本 |
| N14 = meta slug 优先统一 | **采纳** | 报告建议原文 · 与帽级判既有口径对齐 |
| N14 = 文件名 slug 唯一真值 | 弃选 | meta 是闸态真值源惯例（task 文件真值 > 文件名） |
| N4 = 仅留痕 | **采纳（D-24-N4-REGISTER）** | 报告判定符合契约 |

## 7. 验收标准（必须自证，不接受「我改完了」）

1. **N10 fixture**：构造链接 `foo.md` vs 盘上 `FOO.md`（白名单内含 `FOO.md`）→ 修复前假红（复现 §3.K）· 修复后 PASS；负向对照（盘上不存在任何大小写变体）→ 仍 exit 2 不误放。
2. **N14 fixture**：构造文件名 slug ≠ meta slug 的 done task 样本 → 豁免命中行为与声明口径一致（有测）；现状生产数据（命名合规）零行为变化回归。
3. **N4**：留痕文本落盘位置明确（ACCEPTANCE 档接口或覆盖表 note）· 行为零变更（exit 1 用例回归）。
4. `npm run typecheck` 0 错 · `npm test` 全绿（含新增）· `node bin/specgate.js pins check` exit 0。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W6-01 | 大小写不敏感命中但盘上无该名 | 不放行（磁盘存在性为最终判据）· 按既有口径报 mismatch/missing |
| F-W6-02 | 同名不同大小写两文件并存（Linux） | 存在性确认命中其一即放行 · 歧义不升级 |
| F-W6-03 | meta slug 缺失且文件名不合规 | 文件名兜底 + normalizeSlug 归一 · 豁免仍不命中则按缺口报（failClosed 现状语义） |
| F-W6-04 | N4 被误当缺陷改行为 | task 非范围锁死 · 改 exit 码即超出本 SPEC |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = §3.K/§3.O/§3.E + 本棒只读复核现值（cli-pins.ts:295-325 · cli-task-extra.ts:73/:110-113） | no |
| R1 | 范围 = ①–③；非范围 = 通用框架 / 豁免语义 / N4 行为变更 | no |
| R2 | §6 表：N10/N14 各两组口径对比 | no |
| R3 | 边界：双平台语义一致 · 生产数据零行为变化 · N4 锁死不改 | no |
| R4 | `test_strategy=required`：N10/N14 fixture 真红转绿 · N4 留痕存在性核查 | no |
| R5 | **已签收**（2026-09-14 · HG-SPEC-SIGNOFF=approved · 00 代签）· 下一棒：00 拆 W6 task → 20-task-audit → HG-AUDIT-R1 → 30/40 | no |

**residual_risks**：① N10 大小写不敏感在极端同名冲突下的歧义（评估低危 · F-W6-02 口径明示）；② N14 统一后若有外部脚本依赖文件名 slug 口径（本仓内机制 · 无外部消费者证据）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-14 维护者本窗授权 00 代签） | ~~本 SPEC 定稿~~ · 冻结 D-24-N4-REGISTER |
| HG-AUDIT-R1（W6 task） | pending | W6 30 改码前（20 审查文落盘后 00 代签） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | draft · 10-spec · 行号经本棒只读复核 |
| 2026-09-14 | signed · HG-SPEC-SIGNOFF approved（00 代签 · 2026-09-14 维护者授权） |
