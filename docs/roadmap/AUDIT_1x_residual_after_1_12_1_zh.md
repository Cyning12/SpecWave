# 审计 · 1.12.1 之后 · 1.x 是否还有遗漏

> **日期**：2026-09-10  
> **基线**：npm `latest=1.12.1` · tag `v1.12.1` · `@cyning/harness` deprecated  
> **结论**：**1.x 产品收口无阻塞遗漏** → 可推进 2.x 方案（实现仍须 `2x-host-adapt` 签收）

---

## 1. 对照表（PLAN_post_1.11 · 1x-closeout）

| ID | 规划项 | 状态 | 证据 |
|----|--------|------|------|
| C1 | EOS + deprecate | **DONE** | `MIGRATION.md` 日历；registry deprecate 文案；`HG-EOS-DATE=approved` |
| C2 | 全量测稳 | **DONE** | `task_1x_closeout_w1` done；四门绿 |
| C3 | dogfood | **DONE** | W1 dogfood 纪要 |
| O1–O3 | 本体论浅落地 | **DONE** | `ontology-shallow` 测 + `docs/ontology/*`；**无**新 CLI（按拍板） |
| P6-prep | 宿主落点清单 | **DONE** | `host_landing_inventory_v1.md` signed |
| P6-contract | U-01 成文 | **DONE（1.12 深度）** | inventory §U-01；细化进 2.x |
| D1–D2 | releases / promotion | **DONE** | `06_1_11_to_1_12.md` + promotion DONE |
| F1–F5 | 1.11 MVP | **DONE** | 验收报告通过 · `1.11.0` |

---

## 2. 非阻塞 / 明确后移（不算 1.x 遗漏）

| 项 | 归属 | 说明 |
|----|------|------|
| F6 适配引擎 / commands 物化 | **2.0** | 1.12 明确非范围 |
| 独立 `ontology-check` CLI | 另 SPEC / 可跟 2.x | O3 已成文「未接线」 |
| 删除消费者 `.cyning-harness/` | 非目标 | F4 只读保留 |
| `doc-health` 系列 draft | 平行试点 | **不**挡 F6 |
| deprecate 文案仍钉 `@1.12.0` | 文档/registry 文案债 | **可选**人改；不挡 2.x 规划 |
| 过程档曾写「1.12.1 待 publish」 | 滞后 | 本波回填（见下） |

---

## 3. 本波动作

1. 回填 `RELEASING.md` / `MIGRATION.md` / `CHANGELOG.md`：**1.12.1 已 published**  
2. 标记 `PLAN_post_1.11`：1.x 路径 **CLOSED**  
3. 推进 [`docs/spec/2x-host-adapt/`](../spec/2x-host-adapt/) + [`PLAN_2x_host_adapt_v1_zh.md`](./PLAN_2x_host_adapt_v1_zh.md)

---

## 4. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 初稿：对照收口清单；结论无 1.x 阻塞遗漏 |
