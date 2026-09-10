# 验收归档 · 2.1.1 · host tools UX

> **包**：`dsh-coding-kit@2.1.1`  
> **日期**：2026-09-10  
> **规划**：[`PLAN_2_1_1_host_tools_ux_v1_zh.md`](./PLAN_2_1_1_host_tools_ux_v1_zh.md)  
> **SPEC**：[`../spec/2_1_1-host-tools-ux/`](../spec/2_1_1-host-tools-ux/)  
> **实现状态**：W0–W4 **DONE** · **HG-PUBLISH=pending**（仅人）

---

## Waves

| Wave | 结论 |
|------|------|
| W0 | 签收 · UPDATE-DEFAULT=A |
| W1 | 粘性 + `--tools all` |
| W2 | update 缺省 A（BREAKING 小） |
| W3 | init `--tools` / TTY（对齐 OpenSpec） |
| W4 | host-adapt README 全文 + bump 2.1.1 · 四门绿（30 自检 + 00 复跑 `FOUR_GATES_EXIT=0`） |

## 产品验收 A1–A5

| # | 状态 |
|---|------|
| A1–A5 | 文档与行为已对齐（见 SPEC `03`） |

## 待人

1. release **commit**（含 bump/docs/src）  
2. annotated tag **`v2.1.1`**（可选 push）  
3. **`npm publish`** → 签 `HG-PUBLISH=approved` · 回填 CHANGELOG「已 npm 发版」

Agent **禁止** publish。
