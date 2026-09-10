# 00 · 政策与边界（2.1.1）

> **状态**：`draft` · 隶属 `2_1_1-host-tools-ux`  
> **test_strategy**：`not_applicable`（政策；实现波 `required`）

---

## 1. 目标

1. **对齐 OpenSpec**：`init` 配置 AI/IDE 工具；非交互 `--tools all|none|list`；`update` 刷新已配置面。  
2. **粘性**：记住宿主列表与 profile，降低升包后重复传参。  
3. **安全**：无 TTY 时禁止「假装已询问」；无 postinstall 静默写盘。

---

## 2. 非范围

- OpenSpec/spec-kit 主流程与前缀  
- npm postinstall 自动 apply  
- 改变 2.1.0 落点路径语义（仅安装/更新入口）

---

## 3. 硬纪律

| ID | 条文 |
|----|------|
| S2 | 物化 target 永不落 S2 |
| LOCAL | `cyning-harness-local` 不覆写 |
| PREFIX | 仍仅 `kit-` / `harness-` |
| SKIP-3040 | 默认跳过 30/40 |
| DRY | apply/update/init 写盘须 `--yes` 或等价确认（TTY 询问后仍建议 `--yes` 显式） |
| CI | 非 TTY + 无 `--tools` → 非 0（init） |

---

## 4. failure_paths（摘要）

| 触发 | 行为 |
|------|------|
| 非 TTY init 无 `--tools` | exit 1 · 提示对齐 OpenSpec 传 `--tools` |
| update 无粘性且无 `--tools`（**子案 A · 已冻结**） | exit 1 · 提示 apply/init 或 `--tools all` |
| 粘性 JSON 损坏 | exit 2 或回退提示重建（W1 freeze） |

---

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
| 2026-09-10 | UPDATE-DEFAULT=**A** 冻结；W4 完整刷新 host-adapt README |
