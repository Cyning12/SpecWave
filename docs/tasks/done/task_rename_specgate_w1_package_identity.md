# Task：SpecGate W1 · npm identity 双轨（spec-wave@2.1.1）

> **状态**：`done` · **wave**：W1  
> **关联 SPEC**：`rename-specgate` · PLAN B-SEMVER=A · B-BIN-DUAL  
> **依赖**：W0 签收  
> **Open Folder**：仓根（remote 可能已是 SpecGate）

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `rename-specgate-w1-package-identity` |
| **test_strategy** | `required` |
| **test_strategy_note** | version 钉 2.1.1；双 bin；help 含 specgate；改测断言 |
| **freeze_id** | `package.json` name=`spec-wave` · version 保持 **2.1.1** · bin 双轨；**不** publish；**不**大改文档（W2） |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-RENAME | **approved** | — | 2026-09-10 |
| HG-SPEC-SIGNOFF | **approved** | — | spec-wave@2.1.1 · Rename |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 |
| HG-AUDIT-R1 | **approved** | **30** | 00 代签 · R1=`docs/harness/reviews/task_rename_specgate_w1_package_identity_audit_R1_20260910.md` |

---

## 目标

包身份切到 **`spec-wave@2.1.1`**，CLI 双 bin，帮助文案可发现新名；能力与 2.1.1 行为不变。

## 范围

- [x] `package.json`：`name=spec-wave` · `version=2.1.1` · `bin.specgate` + `bin["dsh-coding-kit"]` 同入口  
- [x] `bin/specgate.js`（或等价）与现有 bin 对齐  
- [x] CLI `--help` / `--version` / usage 字符串含 `specgate`（可保留过渡提示旧名）  
- [x] 测钉：ontology/discipline/README 版本断言仍 **2.1.1**；包名断言按需更新  
- [x] description 改为 SpecGate 叙事（短）  
- [x] CHANGELOG Unreleased 一句（改名进行中）  

## 非范围

全文 README/assets 替换（W2）· GitHub Rename 操作（W3/人）· publish/deprecate（W4）

## 验收标准

- [x] `node bin/… --version` / 双 bin 均可跑  
- [x] `npm run typecheck` + 相关测绿  
- [x] version 仍为 **2.1.1**  

### 自检结论（执行者）

PASS · `spec-wave@2.1.1` · 双 bin 同 CLI · 根 help 主推 `npx spec-wave`（旧名过渡提示）· `typecheck`/`test`/`test:lib` 绿 · **未** publish/deprecate · **未** W2 全文 scrub · 仍 active（勿移 done）

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W1-01 | 误 bump 成非 2.1.1 | 拒 |
| W1-02 | 只改 name 无双 bin | 拒 |
| W1-03 | Agent publish | 禁 |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1 代签可 30 |
| 2026-09-10 | 30：spec-wave@2.1.1 双 bin · 测绿 |
| 2026-09-10 | **CLOSE** · 00 归档 · 交 W2 |
| 2026-09-10 | 30 落地：`spec-wave@2.1.1` 双 bin · help · 测钉 · CHANGELOG；仍 active |
