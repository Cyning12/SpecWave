# 00 · 政策与边界（2.2.0 闭环起步）

> **状态**：`signed`（HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved · 人 2026-09-11 会话预授权 · 00 代签落表）· 隶属 `2_2-closed-loop-start`  
> **test_strategy**：`not_applicable`（政策；实现波 `required`）

---

## 1. 目标

1. **声明 → 接线 → 可验证**：把版本/身份一致性从人工纪律升级为机械校验 + 一键修复（W1 · A1 · 本版核心）。
2. **安全缺口最小封堵**：任意文件读穿越拒绝（C1）+ 输出不再泄漏绝对路径（C3）+ `verify --json` 补齐安全设计 §7.2 明文要求字段（C2）。
3. **上手断档消除**：`init` 有下一步（D1）、README 定义核心对象（D3）、双语术语表（D2）。
4. **低风险扩张与清理**：三宿主 `copilot`/`codex`/`windsurf`（B1 · 近零新资产）+ 常量与白名单收敛（E1/C7）。

---

## 2. 非范围（属 2.3 / 3.0 · 本次明确声明不做）

| 项 | 归属版本 | 理由 |
|----|----------|------|
| A2 资产完整性校验（`assets/sha256.manifest` + `assets verify`） | 2.3 | 代价 3 · 与 A1 分开降风险 |
| A3 host-adapt `hooks` / `verify` surface | 3.0 | schema breaking · 战略级单独立项 |
| A4 `ontology-check` 接线 | 3.0 | 同上 |
| A5 4 项 `not_wired` 闸接线 · A6 `reviews.CLOSE` 语义补强 | 2.3 | 门禁语义变更需独立评审 |
| B2–B5 适配表分层 / 动词名入表 / 补 6 宿主 / 插件机制 | 2.3–3.0 | 超「低风险」边界 |
| C4 CI `permissions:` / 依赖与密钥扫描 · C5 发布 provenance/OIDC · C6 审计落盘 | 2.3–3.0 | C5 需人授权账号配置 |
| D4 报错国际化 · D5 `docs/roadmap/` 改名 · D6 QUICKSTART 指南 | 2.3 | 文档面单独成波 |
| E2 离线 fixture · E3 spawn 削减 · E4 god-file 拆分 · E5 tsconfig 加严 | 2.3–3.0 | 工程健康非本版主线 |
| F1 双图谱统一 等全部架构项 | 3.0 | 架构冻结 |
| 修改 `delivery/promotion/*` 与 `package.json` 的 D0 未提交改动 | — | 上一轮外部成果 · W1 钉面机械维护除外且须协调提交边界 |
| Agent `npm publish` / `npm deprecate` | — | **仅人** |

---

## 3. 硬纪律

| ID | 条文 |
|----|------|
| SEMVER | 本版 **minor bump → 2.2.0**；全部钉点（ontology / discipline / README 双语 / RELEASING / docs-spec 索引 / tag）与 `package.json` 同号，且由 W1 机制机械守护 |
| S2 | **S2 过程域永不覆写**：`docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`——含 `pins fix` 在内**任何命令永不可写 S2**（机械拒写，非文档承诺） |
| P0-GATE | **P0 门禁不可绕过**：禁止任何 `--force` / `--allow-*` 参数绕过 `verify` / `gate-check` / `audit`；新增门禁命令同样不引入绕过参数 |
| FACT-CARD | 对外文案唯一事实来源 = `推广事实卡-2.1.3.md`：`pins` 命令、`traceId` 字段、新宿主等**未落地能力一律写「将新增 / 规划中」**；禁止无出处数字；禁称清单（sha256 校验 / `ontology-check` / hooks surface / 审计落盘 / provenance / 预告未发布宿主数）在本版全部仍禁 |
| PROCESS | **先规划后执行**：本系列 `draft` → HG-SPEC-SIGNOFF（人）→ HG-NEXT-PLAN（人）→ 00 拆 task；每波独立 task、独立提交（`feat(2.2-W<n>): …`）、波末 `gate-check` |
| TEST-LOCK | 每波提交前 `npm run typecheck` + `npm test` 必过；改行为必联改断言，禁止「半改仍全绿」 |
| D0-PROT | `delivery/promotion/*` 与 `package.json` 现有未提交 D0 改动**不动**；git 工作区混杂状态下各波提交须精确 `add` 路径，禁 `git add -A` 一把梭 |

---

## 4. failure_paths（摘要）

| 触发 | 行为 |
|------|------|
| 未获 HG-NEXT-PLAN 即改 `src/` / `test/` / `assets/` 代码资产 | 拒开工 · 回本闸 |
| `pins fix` 拟写 S2 目录 | **机械拒写**（非 warn）· 验收含反向验证 |
| 试图给 `pins` / 既有门禁加 `--force` / `--allow-*` 绕过 | 拒设计 · 违 P0-GATE |
| 文案出现事实卡 §10 黑名单或 §11 禁称（如宣称 `pins` 已存在） | 20-spec-audit / 维护者打回 |
| W4 拟物化示例 task 进消费者仓 `docs/tasks/` | 越 S2 纪律 · 改以模板/指引形态 |
| 范围蠕入 A2–A6 / F1 等 2.3/3.0 项 | 退回 · 指 §2 非范围表 |
| 提交把 D0 未提交改动裹挟进波次 commit | 打回重提 · 指 D0-PROT |

---

## 5. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表） | ~~SPEC 定稿 · 冻结 README 待决项 D-*~~（已冻结 · 采纳推荐） |
| **HG-NEXT-PLAN** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表） | ~~开 W1 实现~~ |

---

## 6. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | draft · 10-spec |
