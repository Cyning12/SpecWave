# 02 · 迁移链切断（2.1.2）

> **状态**：`signed` · 隶属 `2_1_2-rename-closeout`  
> **对应缺陷**：审查 **P0-2**（`@cyning/harness` → `dsh-coding-kit`（已 deprecate）→ `spec-wave`）  
> **test_strategy**：`recommended`（文档/文案抽检；deprecate 为人闸）

---

## 1. 问题陈述

现行链会把新/老用户引入**已废弃中间包**：

```text
@cyning/harness@2.24.0  --deprecated-->  dsh-coding-kit（已 deprecate）
                                              |
                                              v
                                        spec-wave@2.1.1
```

`MIGRATION.md` 未声明 `dsh-coding-kit` 已废弃，且多处仍以 SpecGate / `dsh-coding-kit@2.1.0` 为终点。

---

## 2. 目标最短路径

```text
任意历史入口（@cyning/harness · dsh-coding-kit · SpecGate 文案）
        |
        v
  npm i spec-wave@2.1.2
  npx spec-wave …
```

过渡 bin（`dsh-coding-kit` / `specgate`）仍可用，但 **文档不得再推荐安装废弃包作终点**。

---

## 3. 必改清单（文档 / registry）

| 位置 | 要求 |
|------|------|
| `MIGRATION.md` 标题 / 小节 | 终点 = **SpecWave**；`spec-wave` 为**正式包名**（非「过渡 bin」） |
| `MIGRATION.md` 醒目声明 | **`dsh-coding-kit` 已 deprecate** · 请直接 `npm i spec-wave@2.1.2` |
| `MIGRATION.md` 钉点行 | 禁止再写「钉 `dsh-coding-kit@2.1.0`」类终点指令 |
| README / README.zh-CN DSH 入口 | `dsh plugin add spec-wave`；旁注旧包 deprecate |
| `@cyning/harness` deprecate 文案 | **仅人** · 改为指向 `spec-wave`（含 `npm i spec-wave` / `npx spec-wave upgrade --yes`）· **HG-DEPRECATE-HARNESS** |

---

## 4. failure_paths

| 触发 | 行为 |
|------|------|
| 用户按 `@cyning/harness` 旧文案安装 `dsh-coding-kit` | 视为本版未关闭 · W4 前须人改 deprecate |
| MIGRATION 仍写 SpecGate 为「现行」 | 验收 FAIL |
| 仅改仓内文档、不改 harness deprecate | 链式风险残留 · 人闸未过则不得宣告「迁移完成」 |

---

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
