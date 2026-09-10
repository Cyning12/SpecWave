# Task：2.1.1 W2 · `host update` 缺省 = 方案 A

> **状态**：`done` · **wave**：W2  
> **关联 SPEC**：`01` §3 · PLAN B-UPDATE-DEFAULT=**A**  
> **依赖**：W1 CLOSE  
> **Open Folder**：`dsh-coding-kit/`

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1_1-host-tools-ux-w2-update-default` |
| **test_strategy** | `required` |
| **test_strategy_note** | 有粘性 / 无粘性 / 显式 `--tools` / `--tools all` 四路径可失败测先写 |
| **freeze_id** | **A**：无粘性 + 无 `--tools` → **exit 1**；有粘性则用粘性；BREAKING 小须 CHANGELOG |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-211 | approved | — | |
| HG-SPEC-SIGNOFF | approved | — | A 已冻 |
| HG-TASK-DRAFT | **approved** | 22, 30 | 2026-09-10 · 00 代签 |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2_1_1_host_tools_ux_w2_update_default_audit_R1_20260910.md` · W1 CLOSE |

---

## 目标

实现 `host update` 解析序：**CLI `--tools` → 粘性 → exit 1**（方案 A）。

## 范围

- [x] 有粘性：`host update --yes`（无 `--tools`）只刷粘性 `host_ids`  
- [x] 无粘性 + 无 `--tools` → **exit 1** + 可理解提示（apply/init 或 `--tools`/`all`）  
- [x] 显式 `--tools` / `all` 仍可用  
- [x] 更新既有 `test/host-adapt-update.test.ts` 中依赖「无参=全表」的断言  
- [x] CHANGELOG：**Changed/Breaking** 标明 vs 2.1.0  

## 非范围

init · README 全文（W4）· bump · publish

## 验收标准

- [x] SPEC `03` §W2 勾选  
- [x] 有粘性无 `--tools` → 只刷粘性 host_ids  
- [x] 无粘性无 `--tools` → exit 1  
- [x] CHANGELOG Breaking/Changed 标明 vs 2.1.0  

### 自检结论（执行者）

**PASS（30）** · 2026-09-10  
- 解析序 A 已落地于 `src/cli-host.ts` `cmdHostUpdate`：CLI `--tools` → 粘性 → exit 1  
- 测：`npx --yes tsx --test test/host-adapt-update.test.ts test/host-adapt-sticky.test.ts` → **15/15 exit 0**  
- apply 仍须 `--tools`（未改）；未动 init / host-adapt README / bump  
- 交 00：可派 40；**勿移 done**  

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W2-01 | 无粘性无 tools 仍全表写盘 | 测 FAIL / 产品违规 |
| W2-02 | HG-AUDIT-R1 pending | 拒开工 |
| W2-03 | 破坏 apply 必须 `--tools` 纪律 | 拒 |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1 pending（等 W1） |
| 2026-09-10 | W1 CLOSE · R1 代签可 30 |
| 2026-09-10 | 30 落地方案 A · 测 15/15 · 待 40 · 未移 done |
| 2026-09-10 | **CLOSE** · 00 复测 15/15 · 归档 done · 交 W3 |
