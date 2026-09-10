# Task：2.1.1 W3 · `init` 询问 IDE/宿主（对齐 OpenSpec）

> **状态**：`done` · **wave**：W3  
> **关联 SPEC**：`02_init_interactive_v1.md`  
> **依赖**：W1 CLOSE（粘性）；建议 W2 CLOSE（update A）后联调  
> **Open Folder**：`dsh-coding-kit/`

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1_1-host-tools-ux-w3-init-tools` |
| **test_strategy** | `required` |
| **test_strategy_note** | 非 TTY 无 `--tools` → exit 1；`--tools none` 跳过物化；TTY 可用 mock stdin |
| **freeze_id** | 对齐 OpenSpec：`--tools all\|none\|LIST`；默认跳过 30/40；无 postinstall |
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
| HG-SPEC-SIGNOFF | approved | — | |
| HG-TASK-DRAFT | **approved** | 22, 30 | 2026-09-10 · 00 代签 |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2_1_1_host_tools_ux_w3_init_tools_audit_R1_20260910.md` · W2 CLOSE |

---

## 目标

`init` 支持宿主选型：TTY 默认询问；非交互须 `--tools`；可选联动 `host apply` 并写粘性。

## 范围

- [x] CLI：`init ... [--tools all\|none\|LIST] [--profile ...] [--host-adapt\|--no-host-adapt]`  
- [x] 非 TTY + 无 `--tools` → exit 1  
- [x] TTY 无 `--tools` → 询问（多选 / all / none）；测可用 mock  
- [x] `tools≠none` 且未 `--no-host-adapt` → 同进程 apply + 写粘性  
- [x] `--tools none`：过程根照常；**不**物化 host  
- [x] 更新 `test/init.test.ts` + CHANGELOG  

## 非范围

host-adapt README 全文（W4）· bump · publish · OpenSpec delta

## 验收标准

- [x] SPEC `03` §W3 勾选  
- [x] 非 TTY 无 `--tools` → exit 1  
- [x] `--tools none` 不物化；非 none 可联动 apply + 粘性  
- [x] `test/init.test.ts` 等相关测绿  

### 自检结论（执行者）

- VERIFY PASS · HG-AUDIT-R1=approved  
- freeze：`--no-host-adapt` → **不** apply **且不**写粘性（已测）  
- 测：`test/init.test.ts` W3 全绿；顺修 `cli-validation` / `cli-p0` 加 `--tools none`  
- 未动：host-adapt README · bump · publish · 默认 30/40 · postinstall  

### 实现备忘

- 同进程：`await cmdHost(['apply', …])`（复用 W1 粘性写路径）  
- 导出：`parseInitToolsArg` / `promptInitTools` / `isInteractiveInit` / `listKnownHostIds`  
- 既有 `init --yes` CI 用例须显式 `--tools none`（BREAKING 小 · CHANGELOG 已记）

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W3-01 | CI 无 `--tools` 假装已询问 | exit 1 |
| W3-02 | postinstall 静默写盘 | 禁 |
| W3-03 | HG-AUDIT-R1 pending | 拒开工 |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1 pending |
| 2026-09-10 | W2 CLOSE · R1 代签可 30 |
| 2026-09-10 | 30 实现：`--tools` / TTY / 同进程 apply；`--no-host-adapt` 不写粘性 |
| 2026-09-10 | **CLOSE** · 00 复测 init 8 + sticky/update 15 · 归档 · 交 W4 |
