# 04 · W6 · 三宿主扩展（B1：copilot / codex / windsurf）

> **状态**：`signed`（HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved · 人 2026-09-11 会话预授权 · 00 代签落表）· 隶属 `2_2-closed-loop-start`  
> **test_strategy**：`required`  
> **上游**：PROMPT §3 W6 证据行 + 路线研究 §2.1 宿主扩展

---

## 1. 证据

- 路线研究取证：13 个候选宿主中 **11 个原生读 `AGENTS.md`**；本库 `agents` host 已在物化 `AGENTS.md` 片段 → 新增 AGENTS.md 系宿主**近零新资产**（门槛在 always_on 复用，不在新写资产）。
- 候选优先级（路线研究）：`copilot` > `codex` / `windsurf` / `gemini` > 其余；本波取前三。
- 现状：`assets/ide/host-adapt/examples/mvp-hosts.yaml` 4 个 host_id（dsh / cursor / claude / agents；前提校核 #13 实测）。
- ⚠️ 事实卡 §11：**「跨宿主零新资产扩宿主」尚未发生，对外不得预告未发布的宿主数量**——本波落地前所有对外文案仍写「4 宿主」。

## 2. 范围

- 适配表新增三个 host_id：`copilot` / `codex` / `windsurf`，落点复用 AGENTS.md 片段 + 各宿主原生 skills/commands 目录（若该宿主有；无则仅 AGENTS.md + 文档说明）。
- `host validate` / `host apply --dry-run` / `host update` 对三宿主全链路可用。
- 新宿主相关版本文案落点纳入 W1 钉面（依赖关系）。

## 3. 非范围

| 项 | 理由 |
|----|------|
| host-adapt schema 变更（`extends` / `defaults` / `hooks` surface） | B2/A3 · 2.3–3.0 · 本波若发现必须改 schema → **升级 freeze_id 回 10-spec**，不顺势改 |
| `commands` 动词名入表 | B3 · 3.0 |
| `gemini` / `opencode` 等其余 6 宿主 | B4 · 2.3 |
| 社区插件机制 | B5 · 3.0 |
| 对外宣称「7 宿主」 | 发布后由事实卡维护者更新口径 · 本波不提前宣称 |

## 4. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 复用 `agents` host 资产面 + 表内新增行 | **采纳** | 近零新资产 · 验证「加 host 不改代码」链路 |
| 每宿主新写全套资产 | 弃选 | 违背结构性发现 · 维护面 ×3 |
| 连同 schema 分层（B2）一起做 | 弃选 | 超范围 · 风险升级 |

## 5. 验收要点

1. `host validate` 对含三新宿主的适配表通过。
2. 三宿主 `host apply --dry-run` 落点正确（AGENTS.md 片段 + 该宿主原生目录）；`--yes` 物化后 `host update` 粘性可用。
3. 新增测试钉死三宿主行；现有 4 宿主回归不破。
4. S2 拒写对新宿主落点同样生效（`assertNotS2Abs` 链路无回归）。
5. 发布前对外文档（README 等）宿主数表述与落地状态一致（不允许「文档先行」）。

## 6. 风险与缓解

| 风险 | 缓解 |
|------|------|
| 三宿主实际目录约定与调研不符 | 实现波先 `--dry-run` 实测取证再落表；差异大则回 10-spec |
| 「近零新资产」证伪（需新资产） | 单宿主超出即缩减该宿主范围并留痕，不顺势改 schema |
| 宿主数表述超前 | FACT-CARD 硬纪律兜底 |

## 7. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W6-01 | 落表时发现必须改 schema | STOP · 升级 freeze 回 10-spec 重议范围 |
| F-W6-02 | 新宿主落点指向 S2 | `assertNotS2Abs` 拒写 · 验收 FAIL 若可绕过 |
| F-W6-03 | dry-run 与 `--yes` 落点不一致 | 验收 FAIL |
| F-W6-04 | 对外文案提前写「7 宿主」 | 打回（事实卡 §11） |

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~定稿~~ |
| **HG-NEXT-PLAN** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~开 W6 实现~~（按波次逐波开工） |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | draft · 10-spec |
| 2026-09-11 | signed · 双闸 approved（00 代签 · 审查文 R1 pass） |
