# 规划 · 2.0 · 宿主适配（F6）

> **状态**：`signed`（**HG-NEXT-2X** / 系列闸 · 2026-09-10 维护者「批准」）  
> **基线**：`dsh-coding-kit@1.12.1` · 1.x 收口 **CLOSED**（见 [`AUDIT_1x_residual_after_1_12_1_zh.md`](./AUDIT_1x_residual_after_1_12_1_zh.md)）  
> **系列 SPEC**：[`docs/spec/2x-host-adapt/`](../spec/2x-host-adapt/)（**signed**）  
> **上游**：高层架构 F6 · Ruler 对标 · OpenSpec commands 借鉴  
> **Open Folder**：`dsh-coding-kit/`  
> **本文件不做**：改 `src/`（须各 wave `HG-AUDIT-R1`）· npm publish · 云 Policy

---

## 一句话

1.x 内部一致性与收口已完成；**现行产品主线 = `2.0.0` F6**：单一规范源 → N 宿主（always_on + skills + **commands**）物化，DSH 仍为首个宿主。

---

## 版本切分

| 版本 | 定位 |
|------|------|
| **1.12.x** | 1.x **CLOSED**（含 patch `1.12.1` docs） |
| **2.0.0** | F6 宿主适配表落地（major） |
| **2.0.x / 2.1** | 可选：更多宿主、workspaces 观察项、ontology-check CLI（另 SPEC） |

---

## 采纳冻结（签收确认）

| ID | 决议 |
|----|------|
| B-CMD | **采纳** commands 表面 + core/expanded |
| B-UPD | **采纳** host update 刷新 skills/commands |
| B-JSON | **采纳** Agent CLI `--json` 补全（commands 调真 CLI） |
| B-PROF | **采纳** profile + delivery 轴 |
| B-SCH | **采纳** 适配表 schema validate |
| B-ONB | **推迟** onboard → expanded 后波 |
| B-EXP | **推迟** explore |
| B-WS | **推迟** OpenSpec workspaces → 2.1+ |
| B-DELTA | **拒绝** OpenSpec delta 作 kit 主流程 |

---

## Waves

| Wave | 覆盖 | 人闸 | 状态 |
|------|------|------|------|
| **W0** | SPEC 定稿 · 本规划签收 · 拆 task | **`HG-SPEC-SIGNOFF`** · **`HG-NEXT-2X`** | **DONE** |
| **W1** | 适配表 schema + validate CLI | `HG-AUDIT-R1` | **DONE** |
| **W2** | Cursor + Claude：always_on + commands(core) | `HG-AUDIT-R1` | **DONE** |
| **W3** | skills 落点 + `host update` | `HG-AUDIT-R1` | **DONE** |
| **W4** | DSH 行 + U-01 | `HG-AUDIT-R1` | **DONE** |
| **W5** | dogfood / CHANGELOG / bump 2.0.0 | **`HG-PUBLISH`** | active · pending |

**MVP 宿主三角**：`dsh` + `cursor` + `claude`。

---

## 明确非范围（2.0.0）

- OpenSpec change/delta 主流程  
- 云四层 Policy / Marketplace  
- 删除 `.cyning-harness/`  
- 默认分发 30/40 execute hats（仍须 T1）  
- Agent publish/deprecate  
- 自研 IDE  

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-NEXT-2X** | **approved**（2026-09-10 · 维护者「批准」） | ~~开 2.x 规划主线~~ |
| **HG-SPEC-SIGNOFF** | **approved**（同上 · 00 代签） | ~~系列定稿~~ |
| **HG-AUDIT-R1** | pending（按 wave） | 各实现 30 |
| **HG-PUBLISH** | pending | `2.0.0` npm publish |

---

## 读序

1. [`AUDIT_1x_residual_after_1_12_1_zh.md`](./AUDIT_1x_residual_after_1_12_1_zh.md)  
2. 本文件  
3. [`../spec/2x-host-adapt/README.md`](../spec/2x-host-adapt/README.md)  
4. `00` → `04` · tasks：`docs/tasks/active/task_2x_host_adapt_w*.md`

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 初稿 |
| 2026-09-10 | **批准**：HG-NEXT-2X + HG-SPEC-SIGNOFF；W0 DONE；拆 W1–W5 |
| 2026-09-10 | W1 **DONE**（schema + host validate · 40 CLOSE） |
| 2026-09-10 | W2 **DONE**（host apply cursor+claude core · 40 CLOSE） |
| 2026-09-10 | W3 **DONE**（skills 落点 + host update · 40 CLOSE） |
| 2026-09-10 | W4 **DONE**（DSH 行 + U-01 · 40 CLOSE） |
