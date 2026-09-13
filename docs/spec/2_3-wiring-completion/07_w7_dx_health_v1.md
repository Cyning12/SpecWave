# 07 · W7 · DX 与工程健康（dx & engineering health）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）· 隶属 `2_3-wiring-completion`  
> **test_strategy**：`required`（W2 机检过校验 + GLOSSARY 措辞与实现一致性断言 + E2 无网络绑定 + E5 typecheck 0 错）  
> **上游**：验收 §4 #4（根 README 7 宿主）· #10/#11（GLOSSARY 两条）· 路线 §4 E2/E5 · PROMPT §3 W7 行  
> **依赖**：W2（README 校验）· W6（宿主表须含新宿主口径）

---

## 1. 背景

四条收尾项（两条验收遗留 [A] + 两条路线工程健康 [R]）：

1. **[A]#4 · 根 README 双语未更新到 7 宿主**：`README.md:5/24-29` tagline 仍「Cursor · Claude Code · optional DSH」、多宿主表只列 4 行，`copilot|codex|windsurf` 在两个根 README 命中 0。属「低估」非「谎称」，但 README 是已打包文件——npm 页面显示 3 宿主而实际支持 7 个。W6 后须到 13 宿主口径。
2. **[A]#10 · GLOSSARY「four gates」未分层**：GLOSSARY 称四个人闸，但 task 模板（`TASK_TEMPLATE.md`）只有 2 个闸行（`HG-TASK-DRAFT` / `HG-AUDIT-R1`）；`HG-SPEC-SIGNOFF` 属 SPEC 级、`HG-RELEASE` 属发版 checklist——首小时读者只见 2 闸，「four gates」不精确。
3. **[A]#11 · GLOSSARY「每帽对应一个 prompt 文件」对 50 不成立**：`sync prompts` 物化 7 个具名帽 + 碎片，**无 `50-independent-reinspect`**。
4. **[R] E2 · `cli-peer-optional` 测试做真实 `pnpm install`**（网络绑定 · 8s · 超时 180s），网络抖动会误杀套件；**E5 · tsconfig 仅 `strict:true`**，缺 `noUncheckedIndexedAccess` 等加严项。

## 2. 目标

对外文档面与能力面齐平（README 宿主表 + GLOSSARY 措辞精确），测试套件去网络绑定，类型加严——全部以「文档与实现一致」为验收基准。

## 3. 范围

| # | 项 | 内容 | 出处 |
|---|----|------|------|
| ① | 根 README 双语宿主表 | `README.md` / `README.zh-CN.md` tagline + 多宿主表更新至现行宿主全集（W6 落地后 13；若 W6 未完成则 7 并注明后续）；与 `assets/ide/host-adapt/README.md` 对齐 | [A]#4 |
| ② | GLOSSARY 修正 ×2 | 「four gates」按 **task 级 / SPEC 级 / 发版级** 分层表述；「每帽对应一个 prompt 文件」措辞修正为与实现一致（sync prompts 物化 7 帽 · `50-independent-reinspect` 无物化文件 · 或补 50 条目说明） | [A]#10/#11 |
| ③ | E2 离线 fixture | `cli-peer-optional` 测试去真实 `pnpm install`：改离线 fixture（伪造 node_modules / 本地 tarball 或 mock · 形态 task 定）；套件无网络绑定 | [R] |
| ④ | E5 tsconfig 加严 | 开启 `noUncheckedIndexedAccess`（+ 评审可选 `noImplicitOverride` 等）；**加严后 typecheck 0 错为验收**——暴露的存量类型错逐一修；工作量超限即停上报（不硬修扩散面） | [R] |

## 4. 非范围

| 项 | 理由 |
|----|------|
| D4 报错国际化 · D6 QUICKSTART walkthrough | 后续评估（PLAN §非范围） |
| D5 `docs/roadmap/` 改名 | **默认不做 · 归 3.0 评估**（D-23-D5-ROADMAP） |
| E3 spawn 削减 · E4 god-file 拆分 | 3.0 |
| `delivery/promotion/` 物料更新 | 推广轨另行（事实卡 2.3.0 版属发布轨） |
| GLOSSARY 大幅重写 | 只修两处点名措辞 + 必要联动行 |

## 5. 设计

### 5.1 README 宿主表（①）

- 表行与 `mvp-hosts.yaml` host_id 一一对应（W2 校验②机检过）。
- tagline「Cursor · Claude Code · optional DSH」更新为全宿主概括表述（双语同步）。
- 落点列与 host-adapt README 对齐；无原生集成的宿主标注入层级（防夸大 · 事实卡纪律）。

### 5.2 GLOSSARY 修正（②）

- 「four gates」→ 分层：task 文件级（`HG-TASK-DRAFT` · `HG-AUDIT-R1`）· SPEC 级（`HG-SPEC-SIGNOFF`）· 发版级（`HG-RELEASE`）；说明 task 模板只见 2 闸是设计而非缺漏。
- 「每帽对应一个 prompt 文件」→ 修正为「sync prompts 物化 7 个具名帽的 prompt；`50-independent-reinspect` 暂无物化 prompt 文件」或等价精确表述；8 帽模型（starter 4 + extended 4）表述保持不变（2.2 W5 已验证正确）。

### 5.3 E2（③）

- 现状：`test/cli-peer-optional*.test.ts` 真实 `pnpm install`。
- 目标：离线 fixture——预造最小 node_modules 结构或本地 file: 依赖；测试断言行为不变。
- 验收：断网/无 registry 环境下该测试文件通过（实测方式 task 定 · 可用网络隔离或 mock 证明无外网调用）。

### 5.4 E5（④）

- `tsconfig.json` 加 `noUncheckedIndexedAccess: true`（主项）；其余加严项（`noImplicitOverride` / `exactOptionalPropertyTypes` 等）task 阶段逐项试开，**任一导致大规模改动即不纳入本波**（留评估结论）。
- 暴露的索引访问类型错逐一修（预期模式：数组/Record 索引后 `| undefined` 收窄）。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| README 表与适配表一一对应 + W2 机检 | **采纳** | 机制化防再漂移（[A]#4 根因解法） |
| README 只列「主流宿主」其余见 host-adapt README | 弃选 | 正是 [A]#4 的低估问题本身 |
| GLOSSARY「four gates」分层表述 | **采纳** | 与实现一致 · 首小时读者不误导 |
| GLOSSARY 补 50 帽物化文件 | 弃选（本波） | 50 帽物化属资产面扩展；本波只修措辞使其与实现一致 |
| E2 离线 fixture | **采纳** | 去网络绑定 · 套件抗抖动 |
| E2 保留真安装但加重试 | 弃选 | 不除根（网络绑定本质） |
| E5 仅开 `noUncheckedIndexedAccess` | **采纳** | 路线点名主项 · 爆炸半径可控 |
| E5 一次全开 strict 全家桶 | 弃选 | 工作量不可控 · 本波是收尾波不是重构波 |

## 7. 验收标准

1. **README**：双语宿主表过 W2 校验②（机检）；tagline 与表一致；与 host-adapt README 对齐抽检。
2. **GLOSSARY**：两处修正后措辞与实现一致（grep `sync prompts` 物化清单比对；task 模板闸行数比对）；双语条目对齐。
3. **E2**：离线环境该测试文件通过；套件无 `pnpm install` 网络调用（测试内断言或隔离实测）。
4. **E5**：加严后 `npm run typecheck` 0 错；`npm test` 全绿；若某加严项放弃则评估结论落 task 报告。
5. `pins check` PASS（README 双语版本钉面 pin-05/06 联动回归）。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W7-01 | W6 未完成时 W7 先行 | README 表按 7 宿主落地并注明「更多宿主规划中」；W6 完成后回改（波次顺序已规避：W7 收尾） |
| F-W7-02 | E5 暴露存量类型错超工作量阈值 | **停上报**：回退该项开关 · 评估结论落盘 · 不硬修扩散面 |
| F-W7-03 | E2 fixture 与真实 pnpm 行为漂移 | fixture 行为差异写入测试注释；关键路径保留一个带网络标记的可选手动测试（非 CI 默认） |
| F-W7-04 | README 改动触发 pin-05/06 失配 | `pins fix --yes` 对齐（版本串不受影响时无需）；RELEASING 类敏感面本波不动 |
| F-W7-05 | GLOSSARY 修正与 task 模板未来变更脱节 | 措辞引用「现行模板」口径 + 本波 W2 不覆盖该面（留痕已知边界） |
| F-W7-06 | 双语不同步 | 双语互检（行数/条目 diff）入验收 |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = 验收 §4 #4/#10/#11 + 路线 §2.3 E2/E5 + 2.2 W5 验收（GLOSSARY 已成立但措辞两处不精确） | no |
| R1 | 范围 = ①–④；非范围 = D4/D5/D6/E3/E4/promotion/GLOSSARY 重写 | no |
| R2 | §6 表：README 机检对齐 **荐** / 主流节选 弃 · 分层 **荐** / 补物化 弃 · 离线 fixture **荐** / 重试 弃 · 单项加严 **荐** / 全家桶 弃 | no |
| R3 | 边界：E5 熔断 · E2 漂移注释 · pin 联动 · 双语同步 | no |
| R4 | `test_strategy=required`：W2 机检 + 一致性断言 + 离线证明 + typecheck 0 错 | no |
| R5 | **已签收**（2026-09-12 · HG-SPEC-SIGNOFF=approved · 00 代签）· 下一棒：00 拆 W7 task（收尾波 · 宜最后执行） | no |

**residual_risks**：E5 爆炸半径未知（熔断 F-W7-02 兜底）；README 表与 W6 取证结论的最终对齐依赖波次顺序（W7 收尾 · 计划层已保证）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-12 维护者会话授权 00 代签 · 与 2.2.0/2.2.1 同模式） | ~~本 SPEC 定稿~~ |
| HG-AUDIT-R1（W7 task） | pending | W7 30 改码前（task 阶段 00 代签） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | draft · 10-spec · README/GLOSSARY 文档面 + E2/E5 工程健康 |
| 2026-09-12 | signed · HG-SPEC-SIGNOFF approved（00 代签） |
