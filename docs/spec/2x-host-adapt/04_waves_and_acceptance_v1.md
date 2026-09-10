# 04 · Waves 与验收（2.0.0）

> **状态**：`signed` · 隶属 `2x-host-adapt`  
> **上游规划**：[`../../roadmap/PLAN_2x_host_adapt_v1_zh.md`](../../roadmap/PLAN_2x_host_adapt_v1_zh.md)

---

## 1. Wave 验收勾选

### W0 · 签收

- [x] `HG-NEXT-2X=approved`  
- [x] `HG-SPEC-SIGNOFF=approved`（本系列 `00`–`04` + borrow 采纳表）  
- [x] 00 拆出 W1–W5 task 文件（active）

### W1 · Schema

- [x] 适配表 JSON Schema 或 YAML schema 落 `assets/`  
- [x] `npx dsh-coding-kit host validate`（名待 freeze）dry-run 可跑  
- [x] 非法表 → 非 0；S2 路径出现在 target → 拒  
- [x] **`HG-AUDIT-R1`** for `task_2x_host_adapt_w1_schema`（2026-09-10 · 00 代签 · R1 pass）

### W2 · Cursor + Claude 物化

- [x] `host apply --tools cursor,claude --profile core --dry-run` 报告完整  
- [x] `--yes` 写入 always_on + **commands(core)**；不碰 S2  
- [x] Cursor 命令面板可见 `kit-verify` 等（手工或脚本断言文件存在）  
- [x] local / 用户块不被覆写（对标 marker-local 纪律）  
- [x] **`HG-AUDIT-R1`** for `task_2x_host_adapt_w2_cursor_claude`（2026-09-10 · 00 代签 · R1 pass）

### W3 · Skills + update

- [x] skills 落点行进表；与 `skills install` 路径矩阵成文一致  
- [x] `host update` 刷新产品 commands/skills；conflict 默认不覆盖（`--force` 显式）  
- [x] **`HG-AUDIT-R1`** for `task_2x_host_adapt_w3_skills_update`（2026-09-10 · 00 代签 · R1 pass）

### W4 · DSH + U-01

- [ ] DSH 行：commands 允许空；tools/skills 为主  
- [ ] U-01：契约/宿主版本不匹配 → 降级提示 + 非静默写坏（测覆盖）  
- [ ] **`HG-AUDIT-R1`** for `task_2x_host_adapt_w4_dsh_u01`

### W5 · 发版

- [ ] 四门绿 · F5 钉点 → `2.0.0`  
- [ ] dogfood：干净仓 apply cursor+claude  
- [ ] 人 `npm publish`（**HG-PUBLISH**）

---

## 2. 与 F6 验收草案映射

| F6-ID（`00`） | Wave |
|---------------|------|
| F6-A 三类落点 | W1–W3 |
| F6-B ≥2 非 DSH | W2 |
| F6-C DSH 行 | W4 |
| F6-D U-01 | W4 |
| F6-E dry-run + S2 | W1–W2 |

---

## 3. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 初稿 |
| 2026-09-10 | 签收：W0 勾选完成；W1–W5 挂 audit 闸 |
| 2026-09-10 | W1 验收全勾 · task CLOSE |
| 2026-09-10 | W2 验收全勾 · task CLOSE |
| 2026-09-10 | W3 验收全勾 · task CLOSE |
