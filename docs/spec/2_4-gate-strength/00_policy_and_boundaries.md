# 00 · 2.4.0 政策与边界（policy and boundaries）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-14 维护者本窗授权 00 代签）  
> **隶属**：`2_4-gate-strength` · 目标 `spec-wave@2.4.0`（minor）

---

## 1. S2 禁区（过程域 · 永不覆写）

| 目录 | 纪律 |
|------|------|
| `docs/tasks/` | 只新增不覆写；task 文件是闸态真值源（非聊天 / invoke 字面） |
| `docs/harness/reviews/` | 只新增不覆写；20-task-audit / 20-spec-audit / **W2 强度方案评审文**落盘处 |
| `docs/harness/invokes/by-task/` | 只新增不覆写 |

- `pins fix` / `assets` 修复命令对 S2 **机械拒写、无豁免参数**（2.2.0 已接线，本版保持）。
- S2 目录**勿当 host 物化 target**（AGENTS.md local 块既有约定）。

## 2. P0 门禁纪律

1. 判定走**进程内机械逻辑**，exit 2 = failClosed 阻断档；本版修严的钉面（pin-08/16/17）与新增机械断言（W3 输出层）沿用同一语义。
2. **禁止**新增任何 `--force` / `--allow-*` 绕过参数。
3. 既有豁免旗标语义不变；W2 波及存量审查文时循 2.3.1 N11 先例入 `docs/harness/legacy-gate-exempt.yaml` 留痕（四字段齐 · 显式类型判），**非静默放过**。
4. 退出码口径：0 放行 · 1 用法错误/非阻断 · 2 门禁阻断（N4 登记：安全类拒绝走 exit 1 符合契约 · 下游 CI 若仅以 exit 2 作安全事件信号须自知 · 本版不改）。
5. **修严型变更必须配负向 fixture 回归锁**：凡「修复前真红、修复后转绿」的构造一律固化进测试套件（2.3-W1「自验结论与独立复测不符」· 验收报告 §3.J 教训）。

## 3. 范围外声明（本版明确不做）

| 项 | 归属 |
|----|------|
| A3 host-adapt `hooks`/`verify` surface（schema breaking） | 3.0 · **触 schema 即 STOP 上报** |
| A4 `ontology-check` 接线 · B2/B3/B5（适配表分层/动词名/插件机制）· C6 审计落盘 · E3/E4（spawn 削减/god-file 拆分）· F1 双图谱统一 | 3.0（路线研究 §5 既定归属 · **不进 2.4**） |
| 自研 IDE · 第二分发通道 · 远程 Policy 引擎 | **冻结**（路线研究 §6 沿用既有决议） |
| C5 provenance/OIDC **启用**（npm/GitHub 账号配置） | **仅人**（本版只做口径标注 · W5②） |
| D4 报错国际化 · D5 roadmap 改名 · D6 QUICKSTART | 后续评估 / 3.0（沿用 2.3 PLAN 口径） |
| N1 / N11 / N13 | **已随 2.3.1 落地**（bump `268ca21` · 修复 `d7ef05e`）· 不重复进 2.4 |
| `npm publish` / `npm deprecate` / tag / push | **仅人**（HG-RELEASE 不在 00 代签授权范围） |

## 4. 对外文案纪律（验收报告 §6 末三调 · 落地前维持禁称）

- 「T-03 提示词供应链**可机检**」降调为「防意外漂移」前，事实卡 / README 不得先行改口（W5 落地为准）。
- G5《安全设计》§5.3.1 A-1 行与 `:77`「篡改发现」收窄或标注「依赖 provenance（未启用）」前，不得对外引用该表述作强度声称。
- 「关账必经审查通过」：2.3.1 已强制结论节存在；**结论节内强度（W2）落地前**，对外声称维持保守口径。
- 事实卡黑名单过期表述（`dsh-coding-kit` 产品名 ·「四宿主」·「406 用例」等）不得回潮；W5 物料翻新须逐份过黑名单词机检。

## 5. 流程边界（本棒与后续棒）

- 本棒（10-spec）只产出 SPEC 系列夹；**不改实现代码 `src/` `bin/` `assets/` `test/`**。
- 后续每波独立链路：10-task → 20-task-audit（审查文落盘 `docs/harness/reviews/`）→ HG-AUDIT-R1（00 代签 · 2026-09-14 维护者授权）→ 30/40（GATE_VERIFY 首输出 → 实现 → 自证 → `gate-check` → `task close --yes`）→ 独立提交 `feat(2.4-W<n>): …`（禁 `git add -A`）。
- **W2 硬前置**：闸语义变更须先出强度方案评审文（落盘 reviews/）再动手；评审通过前 30 拒改码（D-24-W2-REVIEW-FIRST）。
- RELEASING.md 双重敏感（pin-07 落点 + 九步顺序测正则首个命中）：改措辞后必跑全量 `npm test`。
- W5 文案改动与 pins 钉面（pin-16/17）联动：W1 修严后随改随跑全量 `pins check`。

## 6. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-14 维护者本窗授权 00 代签） | ~~本文件定稿~~ |

## 7. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | draft · 10-spec · 政策与边界自立（S2 / P0 / 范围外 / 文案 / 流程 · 从 PLAN_2_4 非范围与硬约束节收敛） |
| 2026-09-14 | signed · HG-SPEC-SIGNOFF approved（00 代签 · 2026-09-14 维护者授权） |
