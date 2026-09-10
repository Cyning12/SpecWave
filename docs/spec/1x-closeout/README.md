# 1.x 收口 · 1.12.0 · SPEC 系列

> **状态**：`signed` / **done（W1–W4 齐 · tag `v1.12.0` · 待人 publish）**  
> **spec_slug**：`1x-closeout`  
> **拟发版**：`dsh-coding-kit@1.12.0`  
> **上游规划**：[`docs/roadmap/PLAN_post_1.11_zh.md`](../../roadmap/PLAN_post_1.11_zh.md)（**signed** · 下一版=1.12）  
> **上游验收**：`.workbuddy/output/验收报告-1.11.0-F1-F5.md`（通过）  
> **Open Folder**：`dsh-coding-kit/`  
> **本系列不做**：F6 多宿主编译 · 2.0 major · Agent publish/deprecate

---

## 一句话

在 1.11.0（F1–F5）已验收前提下，收口 1.x 残余：EOS/deprecate、测稳、本体论浅落地、F6 预备清单——再发 **1.12.0**。

---

## 范围索引（对齐规划 P0–P3）

| ID | 名称 | Wave | test_strategy |
|----|------|------|---------------|
| **C1** | EOS 日历 +（同波更佳）`npm deprecate @cyning/harness` | W2 | recommended（文档）· deprecate **仅人** |
| **C2** | 全量 `npm test` / CI 稳定 | W1 | required |
| **C3** | 消费者 dogfood（check/verify exit） | W1 | recommended |
| **O1–O3** | 本体论浅落地（脚本/测优先，无新 CLI） | W3 | required（若改码） |
| **P6-prep** | 宿主落点声明清单（草稿） | W4 | recommended |
| **D1–D2** | releases / promotion 文档 | W4 | recommended |

---

## Wave

| Wave | 覆盖 | 人闸 | 状态 |
|------|------|------|------|
| **W0** | 本系列起草 · task 拆分 | `HG-CLOSEOUT-SIGNOFF` | **signed** |
| **W1** | C2 + C3 | 无硬闸 | 见 task |
| **W2** | C1 | **`HG-EOS-DATE`**（deprecate 实操仅人） | 日历提案成文；deprecate 仍人 |
| **W3** | O1–O3 | `HG-AUDIT-R1` | 见 task |
| **W4** | P6-prep + D1/D2 · 发版准备 | 人 publish | 见 task |

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-NEXT-PLAN** | **approved** | ~~版本选型~~（「先 1.12」） |
| **HG-CLOSEOUT-SIGNOFF** | **approved**（00 代签 · 2026-09-10 · 用户「授权00签收，开始完成此版本」） | 系列正文定稿 |
| **HG-EOS-DATE** | **pending** | W2 deprecate 实操（日历提案可先成文） |
| **HG-PUBLISH** | pending | 1.12.0 **publish 仅人**（Agent 可 bump/tag） |

---

## 读序

1. [`PLAN_post_1.11_zh.md`](../../roadmap/PLAN_post_1.11_zh.md)  
2. 本 README  
3. 各 wave task（`docs/tasks/` · W1–W4）

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 系列夹初立；规划签收下一版=1.12 |
| 2026-09-10 | **HG-CLOSEOUT-SIGNOFF=approved**（00 代签）；开 W1–W4 收口 |
