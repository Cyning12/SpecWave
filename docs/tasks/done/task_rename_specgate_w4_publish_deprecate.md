# Task：SpecGate W4 · spec-wave publish + 旧包 deprecate

> **状态**：`done` · **wave**：W4  
> **依赖**：W1–W3 CLOSE  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `rename-specgate-w4-publish-deprecate` |
| **test_strategy** | `recommended` |
| **test_strategy_note** | 四门；publish/deprecate 仅人 |
| **freeze_id** | `spec-wave@2.1.1` 首发；Agent **禁** publish/deprecate |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-RENAME | approved | — | |
| HG-SPEC-SIGNOFF | approved | — | |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_rename_specgate_w4_publish_deprecate_audit_R1_20260910.md` · W1–W3 DONE |
| HG-PUBLISH | **approved** | publish | 人 · 2026-09-10 · `spec-wave@2.1.1` |
| HG-DEPRECATE | **approved** | deprecate | 人 · 2026-09-10 · 文案含 spec-wave |

---

## 目标

准备并发版 **`spec-wave@2.1.1`**；随后 deprecate 旧包并归档 ACCEPTANCE。  
（人决议 2026-09-10：裸 `specgate` E403 → npm **`spec-wave`**；产品/仓后改签 **SpecWave**。）

## 范围

- [x] CHANGELOG / RELEASING / ACCEPTANCE 发版节  
- [x] 四门绿 · tag 策略（可与 2.1.1 同能力说明）  
- [x] 仓内 name/`npx` 字面 → `spec-wave`；三 bin；refresh A8  
- [x] **人** `npm publish`（新包名 `spec-wave`）  
- [x] **人** `npm deprecate dsh-coding-kit@…`（文案指向 `spec-wave`）  
- [x] 过程档 HG-* = approved  

## 非范围

Agent publish/deprecate

## 验收标准

- [x] `npm view spec-wave version` = `2.1.1`  
- [x] 旧包 deprecate 文案含 `spec-wave`  
- [x] SPEC `02` §W4  

### 自检结论（执行者）

**00 CLOSE（2026-09-10）** · HG-PUBLISH / HG-DEPRECATE **approved**（人已发版）  
- npm：`spec-wave@2.1.1` published；`dsh-coding-kit` deprecated  
- GitHub：`Cyning12/SpecWave`；`SpecGate` / `dsh-coding-kit` → 301  
- README / About / `package.json` repository · 产品名 **SpecWave** 已同步  

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W4-01 | Agent publish | 禁 |
| W4-02 | 未多 bin 即 deprecate | 拒 |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 |
| 2026-09-10 | 30 准备档 DONE · 00 等人签 HG-PUBLISH/DEPRECATE |
| 2026-09-10 | 人决议：E403 → npm `spec-wave`；30 改签仓内身份 |
| 2026-09-10 | 人 publish+deprecate · 仓名 SpecWave · W4 → done |
