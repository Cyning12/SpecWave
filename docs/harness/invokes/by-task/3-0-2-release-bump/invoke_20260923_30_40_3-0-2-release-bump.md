# invoke · 30-execute + 40-self-check · 3-0-2-release-bump

> **hat_id**：`30` + `40`（同棒 · 接棒 fork 唯一执行体）· **日期**：2026-09-23  
> **task_slug**：`3-0-2-release-bump`  
> **性质**：release 波 bump 簿记（①–⑨ + ⑪–⑫）· **⑩ tag/push 归 00 按 HG-RELEASE-TAG-PUSH=approved 执行 · 本棒未执行**

## GATE_VERIFY（首输出）

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_2_release_bump.md
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_2_release_bump.md
```

## 改动摘要

| 面 | 文件 |
|----|------|
| bump | package.json · package-lock.json（×2） |
| CHANGELOG | `[3.0.2]` 节 + `[3.0.1]` 回填已发布（实测） |
| pins 钉面（fix --yes 写 9 处） | assets/ontology.yaml · discipline-coverage.yaml · README ×2 · RELEASING · host-adapt README · MIGRATION · AGENTS.md |
| 叙事/断言联改 | README ×2（:406 + 迁移节散形态）· 手册（头栏 + 示例 + 章 2 真值 + 修订表）· test ×8（版本断言 3.0.1→3.0.2 · 历史波名/留证保留）· docs-releasing 步骤④正则题面精确化 |
| 新档 | docs/roadmap/ACCEPTANCE_3_0_2_patch_3_0_2_zh.md · 本 invoke |
| 台账 | RELEASING（latest/下沉/主题/验收四行 + 双 checklist）· spec 索引（3.0.2 行 + 3.0.1 回填）· ACCEPTANCE_3_0_1 补注 · assets/sha256.manifest rebuild（~3） |

**未触**：W1–W2 产品码 · host-adapt schema · `eval/` 分支档 · CHANGELOG 历史节 · `npm version` · tag/push/publish/deprecate。

## 自证（A1–A12）

| # | 结果 | 证据 |
|---|------|------|
| A1 | PASS | package.json 3.0.2 + lock ×2 · 无 npm version 痕迹 |
| A2 | PASS | `[3.0.2]` 节齐 · `[3.0.1]` 回填（`time.3.0.1` · tag ↔ `0e6d861`） |
| A3 | PASS（一阶段） | pins check 唯一偏差 = pin-10（设计红）· 17/17 归 00 |
| A4 | PASS | 假「3.0.2 已 published」grep 零命中 · registry latest 一律 3.0.1 |
| A5 | PASS | ACCEPTANCE_3_0_2 落盘 · 3.0.1 补注 |
| A6 | PASS | spec 索引行 pin-08 ok（预验证文本逐字） |
| A7 | PASS | 手册头栏 3.0.2 待发版 · 示例 @3.0.2 · 无已 published |
| A8 | PASS | RELEASING 四行 + 双 checklist · 改后全量 npm test |
| A9 | PASS | MIGRATION :169 在档 |
| A10 | **预勾 · 归 00** | 00 按 HG-RELEASE-TAG-PUSH 执行后回填（tag hash · pins 17/17 · ls-remote） |
| A11 | PASS | typecheck 0 · npm test **929 · 926 pass + 2 设计红 + 1 skip · 0 产品回归** · build 0 · test:lib 6/6 |
| A12 | PASS | gate-check exit 0 + close · 逐文件显式 add · 未 publish/deprecate |

## 两阶段关账留痕

- 第一段：修复 5 处断言/叙事 + 逐文件 stage → 全量 npm test 余 3 红（check-doc-links done/ 任务链接 + 2 tag-gated 设计红 · 均预期）
- 第二段：close mv task → done/ + stage → 复跑仅余 2 设计红（pin-10 族 · 00 代打 tag 后须 17/17 全绿）

## 环境留痕

- 本机 `~/.npm-local` root-owned ⇒ `npm pack` EPERM；`npm_config_cache=/tmp/npm-cache-302` 绕过 · **人 publish 前须根治或设变量**（已入 RELEASING 人 checklist 3.0.2 节第 3 项）。

Wiki: none（发版簿记 · 无规范增量）
