# 00 · 政策与命名（SpecWave）

> **状态**：`draft` · 隶属 `rename-specgate`  
> **test_strategy**：`not_applicable`（政策；实现波 `required`）

---

## 1. 硬约束

| ID | 条文 |
|----|------|
| NPM-CASE | npm 包名 **不得含大写** → 禁止 publish `SpecWave` / `SpecGate` |
| NPM-TAKEN | **禁止**使用 `spec-gate`（registry 已有 `0.1.8`） |
| NPM-SIMILAR | **禁止**裸名 **`specgate`**：npm 判与 `spec-gate` 过似 → E403（2026-09-10 实测） |
| NPM-NEW | **采纳 `spec-wave`**（404；避开相似拒）· 产品文案 **SpecWave** |
| DUAL-BIN | 过渡期 bin：`spec-wave` + `specgate` + `dsh-coding-kit` |
| REPO | GitHub **`Cyning12/SpecWave`**（`dsh-coding-kit` / `SpecGate` 301） |
| HUMAN | Agent **禁止** `npm publish` / `npm deprecate` / 擅自 GitHub Rename（可准备清单，操作等人） |
| NO-S2 | 改名写盘仍遵守 S2 / local 不覆写 |

---

## 2. 非范围

- 改 Harness 帽语义、闸算法  
- OpenSpec/spec-kit 前缀吞并  
- 强制外部仓同日改依赖  

---

## 3. failure_paths（摘要）

| 触发 | 行为 |
|------|------|
| 误用 `SpecGate` 作 npm name | publish 失败 / 拒开工 |
| 误抢 `spec-gate` | 与他人包冲突 · 拒 |
| 裸名 `specgate` | E403 相似拒 · 改用 `spec-wave` |
| 无双 bin 即 deprecate | 消费者瞬断 · 违规 |

---

## 4. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
| 2026-09-10 | NPM-NEW → `spec-wave`（E403 相似拒改签） |
