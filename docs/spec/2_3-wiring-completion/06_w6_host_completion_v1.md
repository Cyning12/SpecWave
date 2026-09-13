# 06 · W6 · B4 宿主补齐（host completion）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）· 隶属 `2_3-wiring-completion`  
> **test_strategy**：`required`（validate / apply dry-run / update 幂等 + 逐宿主落点取证 + W2 校验联动）  
> **上游**：路线 §2.1 候选矩阵 · §4 B4 · §5 2.3.0 · 2.2 W6 三宿主先例（agents 资产面复用）· PROMPT §3 W6 行  
> **依赖**：W2（宿主↔根 README 校验先行 · 本波落地即受约束）

---

## 1. 背景

路线 §2.1 结构性发现：候选 13 宿主中 **11 个原生读 `AGENTS.md`**，而本仓 `agents` host 已在物化 AGENTS.md——扩宿主的 always_on 多数可**零新资产**。2.2 W6 已验证该链路（copilot/codex/windsurf 复用 agents 资产面 · `host validate` PASS · 落点经官方文档交叉核验），并留下一条教训：**落点须按官方文档逐宿主取证**（codex `.agents/skills` 曾纠偏）。

本波补齐优先级第二档六宿主：`gemini` / `opencode` / `roo` / `zed` / `cline` / `aider`（路线 §2.1 候选矩阵：gemini 优先于其余五个，同属 B4）。

## 2. 目标

宿主覆盖 7 → 13；每宿主落点有官方文档取证出处；复用 agents 资产面先例（近零新资产）；新宿主同步进入 W2 校验与钉面体系。

## 3. 范围

| # | 项 | 内容 |
|---|----|------|
| ① | 逐宿主取证 | 六宿主官方文档落点取证（skills 目录 / always_on 文件 / commands 目录），每宿主留出处 URL + 取证日期，落 task 报告；**查无明确约定的宿主降级为「always_on 仅 AGENTS.md 复用」并如实标注** |
| ② | 适配表新增六行 | `assets/ide/host-adapt/examples/mvp-hosts.yaml`（或现行适配表真值源）新增 `gemini` / `opencode` / `roo` / `zed` / `cline` / `aider`；资产复用 agents 行先例（注释如实写明复用口径，不夸大原生集成） |
| ③ | 宿主专属资产（仅当取证要求） | 若某宿主官方约定非 AGENTS.md/skills 复用可覆盖（如专属文件名/格式），新增最小资产；否则 `commands: []` 保持 |
| ④ | 测试 | 新增 `test/host-adapt-w6-2_3-*.test.ts`（或联改既有 W6 测试）：validate PASS · 六宿主 apply dry-run 落点断言 · update 幂等 · `--tools all` 含 13 |
| ⑤ | W2/W7 联动 | 六宿主 host_id 进入 W2 根 README 表校验域；README 双语表更新属 W7①（若 W6 先行，W7 须含 13 宿主口径） |
| ⑥ | 版本文案钉面 | 新宿主相关版本文案落点若有新增，按 W1② 先例以**纯数据**入钉（不改 pins 代码） |

## 4. 非范围

| 项 | 理由 |
|----|------|
| **host-adapt schema 变更**（extends/defaults/hooks 分层） | **触 schema 即 STOP 上报**（硬约束）；B2/B3/B5 属 3.0 |
| kilo / continue / qwen（候选第三档） | 路线 §2.1 优先级 · 归后续 |
| 根 README 宿主表更新本身 | W7① 职责；本波只保证「不引入超出 W7 可承载面的文案债」 |
| 对外预告「13 宿主」 | 事实卡 §11：发布前禁称；落地前一切文案「将新增」 |
| hooks / 宿主内门禁强制 | A3 · 3.0 |

## 5. 设计

### 5.1 取证先行（每宿主一张取证卡 · 落 task 报告）

| 宿主 | 待取证项 | 降级口径 |
|------|----------|----------|
| gemini | skills/commands 目录约定 · GEMINI.md 或 AGENTS.md | 无确据 → AGENTS.md 复用 |
| opencode | 同上（opencode 官方 docs） | 同上 |
| roo | Roo Code 落点（.roo/ 约定？） | 同上 |
| zed | Zed 落点（.rules / AGENTS.md？） | 同上 |
| cline | .clinerules 约定 | 同上 |
| aider | CONVENTIONS.md / AGENTS.md 读取约定 | 同上 |

- 取证要求：**官方文档**（非第三方博客）· 留 URL 与日期；官方无明确 skills 目录约定者，不强造目录。
- 2.2 W6 纠偏教训：codex 初判 `.codex/skills` → 官方实为 `.agents/skills`；每宿主落点以取证为准，不凭印象。

### 5.2 适配表行形态（复用先例）

- always_on：复用 agents 行 AGENTS.md 片段资产（marker merge 幂等）。
- skills：官方有约定目录 → 指向该目录（资产复用）；无约定 → 不物化。
- commands：默认 `[]`（2.2 W6 先例 · 门禁失实核查：不暗示 P0 门禁在新宿主内生效）。
- 适配表注释如实写明复用口径。

### 5.3 校验联动

- `host validate` 全表 PASS（13 行）。
- W2 宿主↔README 校验：六 host_id 进入校验域（W7① 修 README 前按 W2 SPEC §5.2 过渡口径处理）。
- 若新增版本文案落点 → 纯数据入 `release-pins.yaml`（pin-16+）。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 复用 agents 资产面（AGENTS.md + 官方 skills 目录） | **采纳** | 2.2 W6 已验证 · 11/13 原生读 AGENTS.md |
| 每宿主原生深度集成（专属格式/commands） | 弃选 | 代价高 · 2.2 先例证明复用面已可用；原生集成属 3.0 A3 轨 |
| 六宿主一波补齐 | **采纳** | 同型操作 · 单 task 可承载（PROMPT 既定） |
| 分两波（gemini 先行） | 弃选 | 机制相同 · 拆波只增流程成本 |
| 查无确据宿主不落地 | 弃选 | 降级 always_on 复用即有价值（AGENTS.md 注入）· 如实标注即可 |

## 7. 验收标准

1. **取证卡**：六宿主各留官方文档 URL + 取证日期 + 落点结论（含降级标注）；入 task 报告。
2. `host validate` PASS（13 host_id）。
3. 六宿主 `host apply --tools <id> --yes` 实测物化落点与取证一致；`host update` 幂等（skipped/conflict=0 口径沿袭 2.2 W6）。
4. `--tools all` 含 13；新测试全绿。
5. W2 校验域含 13 host_id（联动测试或人工核验）。
6. 适配表注释复用口径如实（评审抽读）；无文案暗示新宿主内门禁生效。
7. `npm run typecheck` 0 错 · `npm test` 全绿 · `pins check` PASS。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W6-01 | 官方文档变动/查无落点约定 | 降级 always_on 复用 + 如实标注 · 不强造目录 |
| F-W6-02 | 两宿主落点目录冲突（如同名 skills 目录不同语义） | STOP 上报评审 · 不擅自合并 |
| F-W6-03 | AGENTS.md marker merge 幂等被新宿主行破坏 | 测试断言多宿主共存 apply 后 marker 块唯一且完整 |
| F-W6-04 | 需要 schema 新字段才能表达某宿主 | **STOP 上报**（硬约束）· 该宿主移出本波 |
| F-W6-05 | W2 校验因新宿主变红（README 未更） | 按 W2 §5.2 过渡口径 · 不绕过校验 |
| F-W6-06 | 版本文案新增落点未入钉 | 按 W1② 先例纯数据补钉 · task 内完成 |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = 路线 §2.1/§4 B4/§5 + 2.2 W6 先例与纠偏教训 + 事实卡 §3/§11 | no |
| R1 | 范围 = ①–⑥；非范围 = schema / 第三档宿主 / README 表本身 / 预告 / hooks | no |
| R2 | §6 表：复用 **荐** / 深度集成 弃 · 一波 **荐** / 两波 弃 · 降级 **荐** / 不落地 弃 | no |
| R3 | 边界：schema STOP · 落点冲突 STOP · marker 幂等 · W2 过渡 · 钉面补全 | no |
| R4 | `test_strategy=required`：validate/apply/update 三实测 + 取证卡 + 联动 | no |
| R5 | **已签收**（2026-09-12 · HG-SPEC-SIGNOFF=approved · 00 代签）· 下一棒：00 拆 W6 task（取证为第一交付物） | no |

**residual_risks**：六宿主官方文档时效性（取证日口径）；roo/cline/aider 的 AGENTS.md 支持度未经官方明示时按降级处理，可能与用户预期「深度支持」有差——文案保持「注入层支持」口径。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-12 维护者会话授权 00 代签 · 与 2.2.0/2.2.1 同模式） | ~~本 SPEC 定稿~~ |
| HG-AUDIT-R1（W6 task） | pending | W6 30 改码前（task 阶段 00 代签） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | draft · 10-spec · 六宿主取证先行 · 复用 agents 先例 · schema STOP 红线 |
| 2026-09-12 | signed · HG-SPEC-SIGNOFF approved（00 代签） |
