# 00 · 2.3.0 政策与边界（policy and boundaries）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）  
> **隶属**：`2_3-wiring-completion` · 目标 `spec-wave@2.3.0`（minor）

---

## 1. S2 禁区（过程域 · 永不覆写）

| 目录 | 纪律 |
|------|------|
| `docs/tasks/` | 只新增不覆写；task 文件是闸态真值源（非聊天 / invoke 字面） |
| `docs/harness/reviews/` | 只新增不覆写；20-task-audit / 20-spec-audit / W4 接线方案评审文落盘处 |
| `docs/harness/invokes/by-task/` | 只新增不覆写 |

- `pins fix` / 未来 `assets verify` 修复命令对 S2 **机械拒写、无豁免参数**（2.2.0 已接线，本版保持）。
- S2 目录**勿当 host 物化 target**（AGENTS.md local 块既有约定）。

## 2. P0 门禁纪律

1. 判定走**进程内机械逻辑**，exit 2 = failClosed 阻断档；本版新增校验（W2 扩展钉面 / W5 assets verify）沿用同一语义。
2. **禁止**新增任何 `--force` / `--allow-*` 绕过参数。
3. 既有豁免旗标（如 `--allow-no-spec-review`）语义不变。
4. `verify` / `gate-check` / `audit` / `pins check` / `assets verify`（W5 将新增）退出码口径：0 放行 · 1 用法错误/非阻断 · 2 门禁阻断。

## 3. 范围外声明（本版明确不做）

| 项 | 归属 |
|----|------|
| A3 host-adapt `hooks`/`verify` surface（schema breaking） | 3.0 · **触 schema 即 STOP 上报** |
| A4 `ontology-check` 接线 | 3.0 |
| B2 / B3 / B5（适配表分层 / 动词名入表 / 插件机制） | 3.0 |
| C6 审计日志落盘 | 3.0 |
| D4 报错国际化 · D6 QUICKSTART | 后续评估 |
| **D5 `docs/roadmap/` 改名** | **默认不做 · 归 3.0 评估**（维护者决策项 · 推荐值） |
| E3 spawn 削减 · E4 god-file 拆分 | 3.0 |
| F1 双图谱统一等架构项 | 3.0 |
| `npm publish` / `npm deprecate` / tag / push | **仅人**（或按维护者当次授权） |

## 4. 对外文案纪律（事实卡-2.2.0 §10/§11）

- 未落地能力一律「将新增 / 规划中」：assets sha256 清单 + `assets verify`（W5 前）· provenance/OIDC（W3 指引文档落地前）· 「13 宿主」（W6 发布前）·「关账必经审查通过」（W4 reviews.CLOSE 接线前）。
- 禁称清单其余项（ontology-check · hooks surface · audit 落盘）本版**不落地**，继续禁称。
- 事实卡黑名单过期表述（`dsh-coding-kit` 产品名 · 「四宿主」 · 「406 用例」等）不得回潮。

## 5. 流程边界（本棒与后续棒）

- 本棒（10-spec）只产出 PLAN + SPEC 系列夹；**不改实现代码 `src/` `bin/` `assets/`**。
- 后续每波独立链路：10-task → 20-task-audit（审查文落盘 `docs/harness/reviews/`）→ HG-AUDIT-R1（00 代签）→ 30/40（GATE_VERIFY 首输出 → 实现 → 自证 → `gate-check` → `task close --yes`）→ 独立提交 `feat(2.3-W<n>): …`（禁 `git add -A`）。
- **W4 硬前置**：门禁语义变更须先出接线方案评审文（落盘 reviews/）再动手；评审通过前 30 拒改码。
- RELEASING.md 双重敏感（pin-07 落点 + 九步顺序测正则首个命中）：改措辞后必跑全量 `npm test`。

## 6. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-12 维护者会话授权 00 代签） | ~~本文件定稿~~ |

## 7. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | draft · 10-spec · 政策与边界自立（S2 / P0 / 范围外 / 文案 / 流程） |
| 2026-09-12 | signed · HG-SPEC-SIGNOFF approved（00 代签） |
