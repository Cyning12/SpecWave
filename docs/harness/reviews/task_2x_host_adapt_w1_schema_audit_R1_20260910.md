# Task Audit R1：2x-host-adapt-w1-schema

> **task**：`docs/tasks/active/task_2x_host_adapt_w1_schema.md`  
> **日期**：2026-09-10  
> **角色**：20-task-audit（00 统筹代签 · 维护者授权本窗 W1 全过程档）  
> **对照**：SPEC `00` / `01` / `04` §W1 · PLAN_2x W1 · 采纳 B-SCH

---

## 结论

| 项 | 判定 |
|----|------|
| 验收可测 | 是（合法表 / 非法表 / S2 target 拒；CLI dry-run 可跑） |
| failure_paths | 是（W1-01..03） |
| 与 SPEC 对齐 | 是（F6-A 表骨架 + F6-E 校验面；不越界 apply） |
| test_strategy | `required` · 充分（先落可失败测，再接线 validate） |
| 非范围 | 清晰（无 `host apply` / W2 物化 / bump / publish） |
| freeze 充分 | 是（见下） |
| **签收** | **HG-AUDIT-R1=approved** · 可 30 |

**零阻塞**：范围与 `04` §W1 勾选一一对应；S2 拒写复用 `S2_TRUTH_PREFIXES` / `isS2RelPath`（禁止第二份前缀表）。

---

## Freeze（本波生效）

| ID | 冻结值 |
|----|--------|
| CLI | `npx dsh-coding-kit host validate [--file PATH] [--json]`（缺省读包内示例表或 `--file`） |
| 资产根 | `assets/ide/host-adapt/`（schema + ≥1 合法示例表；可选 1 份故意非法 fixture 仅测用可放 `test/fixtures/`） |
| 表面列 | schema **须**表达 `always_on` · `skills` · `commands`（及可选 `verify`）；对齐 `01` §1 |
| S2 | 任一 `target` / `target_dir` 相对路径命中 `isS2RelPath` → **拒 · exit 2**（W1-02） |
| 缺件/用法 | 缺 schema/文件/非法 flag → **exit 1**（W1-01） |
| 表非法 | schema 校验失败 → **exit 2**（与 failClosed 校验闸一致；stdout/stderr 须可读原因） |
| 写盘 | **禁止**本波实现 `host apply` 或任何物化写消费者仓 |

---

## 对照清单

| 来源 | 要求 | R1 |
|------|------|----|
| `04` W1 | schema 落 `assets/` | 纳入 30 |
| `04` W1 | `host validate` dry-run 可跑 | 纳入 30 |
| `04` W1 | 非法表非 0；S2 target 拒 | 纳入单测 + CLI |
| `00` §2 | Verify 真值在 CLI；永不覆写 S2 | validate 只读；S2 硬拒 |
| `00` §3 | 非 OpenSpec delta 主流程 | 本波无 delta |
| PLAN B-SCH | 适配表 schema validate | 本波唯一产品目标 |
| task 非范围 | 无 apply / 无 bump | 30 禁区 |

---

## 缺口（不阻塞开工 · 30 须自消）

1. 示例表可仅覆盖 MVP 宿主三角行骨架（`dsh`/`cursor`/`claude`）；完整物化属 W2+。  
2. README 一句 + CHANGELOG Unreleased 一句（有产品面时）。  
3. `host` 子命令树：本波仅 `validate`；未知子命令 → exit 1。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | R1 通过 · 00 代签 HG-AUDIT-R1 |
