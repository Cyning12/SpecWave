# 验收归档 · 2.x 宿主适配（F6）· `dsh-coding-kit@2.0.0`

> **状态**：`archived` / **CLOSED**  
> **日期**：2026-09-10  
> **Open Folder**：`dsh-coding-kit/`  
> **registry**：`npm view` → `latest=2.0.0`（人 publish 已核验）  
> **git**：tag `v2.0.0` @ `6c412b0` · 过程档 CLOSE @ `216f04b`  
> **后续 patch**：`2.0.1`（本归档回填入包 · 无产品行为变更）

---

## 一句话

F6「单一规范源 → N 宿主物化」已在 **2.0.0** 落地并 publish；W0–W5 过程档齐套，`HG-PUBLISH=approved`。

---

## 闸结案

| human_gate_id | status | 说明 |
|---------------|--------|------|
| HG-NEXT-2X | approved | 开 2.x 主线 |
| HG-SPEC-SIGNOFF | approved | `docs/spec/2x-host-adapt/` signed |
| HG-AUDIT-R1 | approved（按波） | W1–W5 各有 R1 |
| **HG-PUBLISH** | **approved** | 2026-09-10 · 人 `npm publish` · `latest=2.0.0` |

---

## Wave 归档索引

| Wave | task_slug | 关键交付 | 状态 |
|------|-----------|----------|------|
| W0 | `2x-host-adapt-w0-signoff` | SPEC/PLAN 签收 · 拆单 | done |
| W1 | `2x-host-adapt-w1-schema` | `host validate` · schema | done |
| W2 | `2x-host-adapt-w2-cursor-claude` | `host apply` · core commands | done |
| W3 | `2x-host-adapt-w3-skills-update` | `host update` · skills 矩阵 | done |
| W4 | `2x-host-adapt-w4-dsh-u01` | DSH 空 commands · U-01 | done |
| W5 | `2x-host-adapt-w5-release` | dogfood · bump/tag · **publish** | done |

过程档：`docs/tasks/done/task_2x_host_adapt_w*.md` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/2x-host-adapt-w*/`  
验收勾选真值：[`docs/spec/2x-host-adapt/04_waves_and_acceptance_v1.md`](../spec/2x-host-adapt/04_waves_and_acceptance_v1.md)

---

## F6 验收映射（`00`）

| ID | 结果 |
|----|------|
| F6-A 三类落点 | **pass**（W1–W3） |
| F6-B ≥2 非 DSH | **pass**（Cursor + Claude · W2） |
| F6-C DSH 行 | **pass**（commands=[] · W4） |
| F6-D U-01 | **pass**（degraded 零写坏 · W4） |
| F6-E dry-run + S2 | **pass**（W1–W2） |

---

## 产品面（2.0.0）

| CLI | 行为摘要 |
|-----|----------|
| `host validate` | 表校验；非法 / S2 → 非 0 |
| `host apply` | 默认 dry-run；`--yes` 物化 always_on + commands(+skills) |
| `host update` | conflict 默认不覆盖；`--force` 显式；跳过 30/40 |

资产：`assets/ide/host-adapt/` · `assets/ide/commands/{cursor,claude}/kit-*.md`

---

## 明确未做（仍有效）

- Agent `npm publish` / `npm deprecate`  
- OpenSpec delta 主流程  
- 默认分发 30/40 execute hats  
- 删除消费者 `.cyning-harness/`  
- onboard / explore / workspaces（推迟）

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 人 publish 核验后立档；随 `2.0.1` docs patch 入仓 |
