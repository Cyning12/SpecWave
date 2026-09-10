# Task：SpecGate W3 · GitHub Rename 核对

> **状态**：`done` · **wave**：W3  
> **依赖**：维护者已授权 Rename；可与 W1 并行  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `rename-specgate-w3-github-rename` |
| **test_strategy** | `recommended` |
| **test_strategy_note** | 人工/gh 核对 redirect；更新文档内 GitHub URL |
| **freeze_id** | 仓名 **SpecGate**；旧 path redirect；不 publish |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-RENAME | approved | — | 含授权执行 Rename |
| HG-SPEC-SIGNOFF | approved | — | B-REPO=Rename |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签 |
| HG-AUDIT-R1 | **approved** | **30** | 00 代签 · 人已授权 Rename · R1=`docs/harness/reviews/task_rename_specgate_w3_github_rename_audit_R1_20260910.md` |

---

## 目标

GitHub 仓 **Rename → SpecGate**；核对旧 URL 可达；文档/CI 中的 github.com 链接更新；`git remote` 对齐。

## 范围

- [x] 执行或确认 `gh repo rename SpecGate`（已授权）· **DONE 2026-09-10** · `…/dsh-coding-kit` → **301** → SpecGate  
- [x] 浏览器/curl 核对 `…/dsh-coding-kit` → SpecGate（curl `HTTP/2 301` → `…/SpecGate` · 2026-09-10）  
- [x] `git remote -v` 更新 → `git@github.com:Cyning12/SpecGate.git`  
- [x] 文档内硬编码旧 repo URL 替换（README 双文件 · package.json repository/bugs/homepage · MIGRATION · CHANGELOG · docs/releases · delivery · assets；RELEASING 无旧 URL）  
- [x] Actions/badge 若碎则修（workflows `ci`/`tech-graph` state=active；README 无 shields badge；无硬编码旧仓 path）  

## 非范围

npm publish/deprecate

## 验收标准

- [x] `https://github.com/Cyning12/SpecGate` 存在  
- [x] 旧 URL 仍打开到新仓（301）  
- [x] remote 指向新 path  

### 自检结论（执行者）

30 · 文档/配置 GitHub URL scrub 完成；`package.json` **name 未改**（仍 `dsh-coding-kit`，归 W1）。残留旧 GitHub path：**2 行**（故意保留：`docs/spec/rename-specgate/01_*.md` 旧→新对照表 · `docs/roadmap/PLAN_rename_specgate_v1_zh.md` 验收 301 句）。未移 done · 待 00 CLOSE。未 publish。

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W3-01 | Rename 名冲突 | 停 · 报人 |
| W3-02 | remote 未更新导致 push 失败 | 修 remote |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · 人授权 Rename · R1 代签 |
| 2026-09-10 | 30 · URL scrub + CI 核对 · 范围项勾满 · 仍 active |
| 2026-09-10 | **CLOSE** · 00 归档 done · [W3 URL scrub](3d9b5357-af73-4c2b-bff8-a9e2bf908647) |
