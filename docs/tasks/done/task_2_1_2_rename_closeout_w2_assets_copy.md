# Task：2.1.2 W2 · assets / README / AGENTS 对外残留

> **状态**：`done` · **wave**：W2  
> **关联 SPEC**：[`docs/spec/2_1_2-rename-closeout/03_surface_consistency_v1.md`](../../spec/2_1_2-rename-closeout/03_surface_consistency_v1.md)  
> **依赖**：W1 CLOSE  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1_2-rename-closeout-w2-assets-copy` |
| **test_strategy** | `recommended` |
| **test_strategy_note** | ripgrep 抽检必清清单；无新增单测亦可 |
| **freeze_id** | **不**改 REPORT_SCHEMA；**不**改 bin/specgate.js；**不**改 delivery/**；**不** bump |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-212 | **approved** | — | — |
| HG-SPEC-SIGNOFF | **approved** | — | — |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 |
| HG-AUDIT-R1 | **approved** | **30** | 00 代签 · R1=`docs/harness/reviews/task_2_1_2_rename_closeout_w2_assets_copy_audit_R1_20260910.md` |

---

## 目标

随包 assets 与仓根入口无「同文件新旧矛盾」；DSH/AGENTS 叙事指向 `spec-wave`。

## 范围

- [x] 审查必清：claude/cursor `kit*verify.md` · ONTOLOGY slice · POINTER_* · QUICKREF · `00-orchestrator.md` · graph templates · `src/index.ts` description  
- [x] README / README.zh-CN：`dsh plugin add spec-wave` + 旧包 deprecate 提示  
- [x] `AGENTS.md` local：npm 包名 = `spec-wave`  
- [x] ripgrep 抽检（A 类保留除外）漏改归零  

## 非范围

REPORT_SCHEMA · bin 文件名 · delivery · bump/publish · init 行为

## 验收标准

- [x] SPEC `03` 必清清单勾完  
- [x] 同文件 description/正文不再自相矛盾  
- [x] 抽检无未归类命中  

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W2-01 | 误改 REPORT_SCHEMA | 拒 · 回滚 |
| W2-02 | W1 未 CLOSE 开工 | 拒 |

## 自检结论（30 · 2026-09-10）

- **VERIFY**：`npx spec-wave verify` PASS · HG-AUDIT-R1 approved · W1 done  
- **必清**：清单文件已改；verify description ↔ 正文均为 `spec-wave`  
- **抽检**：剩余命中均归 A 类（迁移史实 / 过渡 bin / B-REFRESH 正则 / REPORT_SCHEMA 冻结 / deprecate 声明）  
- **附带清零**：`skills-orch/kit-verify` · `host-adapt` examples bin · ci samples「现行为」句  
- **未做**：bump / publish / deprecate / init `--yes` / 移 done / 改 REPORT_SCHEMA / 改 `bin/specgate.js` / 改 `delivery/**`

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1 待 W1 后代签 |
| 2026-09-10 | **30 实现**：assets/README/AGENTS 必清 + 抽检漏改归零；自检 PASS；仍 `active` 待 40 |
| 2026-09-10 | **CLOSE** · 00 归档 done · 交 W3 |
