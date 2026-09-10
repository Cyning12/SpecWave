# 1.x MVP · 内部一致性收敛 · SPEC 系列

> **状态**：`signed`（**HG-SPEC-SIGNOFF=approved** · 2026-09-09 维护者对话「签收」· **整包一次签**）  
> **spec_slug**：`1x-mvp`  
> **版本**：`v0` · `2026-09-09`  
> **track**：`epic` / `1.x-mvp`  
> **拟发版窗口**：`dsh-coding-kit@1.x`（具体 patch/minor 由 00 拆 task 锁定）  
> **test_strategy**（下游 task 默认）：`required`（F1/F2/F5 改码面）；F3 以文档+人闸为主可标 `recommended`  
> **上游**：`delivery/高层架构设计.md` §4.3 / §6.1 / §6.3 · `delivery/系统设计.md` §2.4 / §4.5 · `delivery/UserStory.md` §3.1  
> **Open Folder**：`dsh-coding-kit/`  
> **本系列不做**：F6 宿主适配表（2.0）· 自研 IDE · 商业化 · 第二分发通道 · 云 SaaS

---

## 一句话

把 1.x MVP 的五条冻结路线（F1–F5）拆成可独立开 task 的 SPEC 系列；**已整包签收**，授权 00 按 wave 起草实现 task（30 仍须 `HG-AUDIT-R1`）。

---

## F 编号真值（冻结）

> 以《高层架构设计》**§6.3 功能清单** +《系统设计》§2.4.1 + 宣传物料为准。  
> ⚠️ 《高层架构设计》§6.1 In-Scope 文案中 F4/F5 **对调**，本系列**不采用** §6.1 编号；以 §6.3 为准。

| ID | 名称 | 对齐痛点 / 目标 | 主落点 | 依赖 |
|----|------|-----------------|--------|------|
| **F1** | S2 过程域真值源唯一化 | X7 → V1 | `src/cli-shared.ts` 共享常量 + 全命令引用 | 无（地基） |
| **F2** | P0 门禁语义对齐 | R3 → V4 | 退出码 2 / failClosed / 文档契约 | **依赖 F1**（结论一致才谈语义） |
| **F3** | 旧产品线迁移治理 | R4 → V3 | `npm deprecate` + EOS + MIGRATION | 与 F4 并行可；T1 后人闸 |
| **F4** | `.cyning-harness` 语义收敛 | X11 → V3 | 方案 B：新落盘 `.coding-kit` | 与 F3 协同（T2） |
| **F5** | SPEC 钉版一致性校验 | X6 → V2 | 发布前自动校验阻断 | 可独立；建议与发版闸同波 |

**F6**（宿主适配表）= **本系列外** · 2.0。

---

## 读序

1. 本文件（总纲 · wave · 人闸 · 编号真值）
2. [`00_policy_and_boundaries.md`](./00_policy_and_boundaries.md) — 整包政策 / 非目标 / 授权阶梯
3. [`F1_s2_truth_source.md`](./F1_s2_truth_source.md)
4. [`F2_gate_semantics.md`](./F2_gate_semantics.md)
5. [`F3_legacy_migration.md`](./F3_legacy_migration.md)
6. [`F4_directory_semantics.md`](./F4_directory_semantics.md)
7. [`F5_spec_version_pin.md`](./F5_spec_version_pin.md)

---

## 目录树

```text
docs/spec/1x-mvp/
├── README.md
├── 00_policy_and_boundaries.md
├── F1_s2_truth_source.md
├── F2_gate_semantics.md
├── F3_legacy_migration.md
├── F4_directory_semantics.md
└── F5_spec_version_pin.md
```

---

## Wave 建议（签收后由 00 拆 task）

| Wave | 覆盖 | 理由 |
|------|------|------|
| **W1** | F1 · **DONE 2026-09-09** | 真值源是跨命令地基；未收敛前改 F2/F4 会放大分裂 |
| **W2** | F2 · **DONE 2026-09-09** | 语义文档 + 退出码契约对齐；回归依赖 F1 一致率 |
| **W3** | F4 + F3 文档面 · **DONE 2026-09-09** | 目录收敛（方案 B）与迁移时间表同属迁移治理域 |
| **W4** | F5 · **DONE 2026-09-09**（`HG-F5-PIN-MODE=B`） | 纳入 `prepublishOnly` / RELEASING 硬闸 |

**禁止**：跳过 F1 直接铺宿主适配（F6）；未过 `HG-AUDIT-R1` 即开 30 改码。

---

## 整包范围 / 非范围

**范围**：F1–F5 契约正文（背景 · 范围 · 非范围 · 验收 · failure_paths · 思考轮草案）。

**非范围**：实现代码 · npm publish · deprecate 实操（仅人）· F6 · 改云拓扑 · 改产品双入口形态。

---

## 验收标准（整包）

- [x] 专属夹 `docs/spec/1x-mvp/`；非根级裸 `SPEC-*.md`
- [x] README 含 F 编号真值表、读序、wave、人闸
- [x] F1–F5 各有专文；每文含范围/非范围/验收/failure_paths
- [x] F4 明确引用系统设计 **方案 B**（`.coding-kit` + legacy 只读）
- [x] 标明 §6.1 vs §6.3 编号冲突裁决
- [x] `HG-SPEC-SIGNOFF=approved`（2026-09-09 · 整包一次签）
- [x] `docs/spec/README.md` 已索引本系列

---

## failure_paths（整包）

| ID | 触发 | 行为 | 可重试 |
|----|------|------|--------|
| F-SERIES-01 | 人按 §6.1 编号拆 task（F4=版本钉） | 00/10 拒开工；指向本 README 编号真值表 | 是 |
| F-SERIES-02 | 无 task / 无 `HG-AUDIT-R1` 即改 `src/` | 00/20 拒开工；须先拆 wave task 并过人闸 | 是 |
| F-SERIES-03 | 跳过 F1 直接做 F6 | 拒；演进纪律见高层架构 §4.3 | 是 |
| F-SERIES-04 | F4 仍写「kit 本体=.cyning-harness」 | 打回；以方案 B 为准 | 是 |

---

## 人工闸

| human_gate_id | status | blocks | 说明 |
|---------------|--------|--------|------|
| **HG-SPEC-SIGNOFF** | **approved** | ~~00 出实现 task~~（已放行）· 30 仍须 task 闸 | 2026-09-09 维护者「签收」· **整包一次签** F1–F5 |
| **HG-EOS-DATE** | **approved**（2026-09-10） | ~~F3 T1 `npm deprecate`~~ | EOS / 新注册截止 / deprecate 已执行（见 `MIGRATION.md`） |
| **HG-PUBLISH** | **approved（1.12.0）** | ~~本波 npm publish~~ | 2026-09-10 人已发版 · `npm view latest=1.12.0`；前一波 1.11.0 见史实 |
| **HG-F5-PIN-MODE** | **approved = B** | ~~F5 W4 选型~~ | 2026-09-09 维护者「选择 B」：废除仓根 SPEC 版本钉检查；只钉 ontology / discipline / README |

---

## 思考轮控制（整包摘要）

| 轮 | 结论摘要 | early_stop |
|----|----------|------------|
| R0 | 上游 G3–G6 已冻结 F1–F5；本系列只拆 SPEC，不重开架构辩论 | no |
| R1 | 五文拆分；共享 00 政策；编号以 §6.3 为准 | no |
| R2 | 推荐「系列夹 + 分 F 专文」；弃选「五套独立 slug 夹」（索引碎）与「单文件五章」（难分签） | no |
| R3 | F1→F2 硬依赖；F3/F4 协同；F5 可并行；人闸 EOS/publish | no |
| R4 | 改码面 `test_strategy=required`；F3 文档面可 recommended | no |
| R5 | **已签收**；残余见下 | no |

**签收决议（2026-09-09）**

| # | 问题 | 决议 |
|---|------|------|
| 1 | 整包签 vs 分 F 签 | **整包一次签**（本闸） |
| 2 | F3 EOS 日 | **approved**（2026-09-10 · 见 `MIGRATION.md` 已公布日历） |
| 3 | F5 钉点模式 A vs B | **B**（2026-09-09）→ 只钉 ontology/discipline/README；仓根 SPEC = 历史 epic |
| 4 | F2 分层强制粒度 | **默认文档-only**（1.x 不引入云/远程四层引擎；若 task 需代码分层再开补充闸） |

**residual_risks**：本体论深化 / F6 见 [`docs/roadmap/PLAN_post_1.11_zh.md`](../../roadmap/PLAN_post_1.11_zh.md)（EOS/deprecate 已闭环）。

---

## 关联路径

| 路径 | 说明 |
|------|------|
| `delivery/高层架构设计.md` | F 清单 · MVP 边界 · V1–V4 |
| `delivery/系统设计.md` §4.5 | F4 方案 B 定稿 |
| `delivery/UserStory.md` §3.1 | US ↔ F 映射 |
| `src/index.ts:13` 等 | X7 四份硬编码锚点 |
| `SPEC.md`（archived） / `package.json` | X6：史实 epic vs 包真值；钉闸见 F5=B |
| `RELEASING.md` | 发布前 pins（已与自动闸对齐） |

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-09 | v0-draft：自高层架构 1.x 五路线拆出 SPEC 系列初稿 |
| 2026-09-09 | **HG-SPEC-SIGNOFF=approved**（整包一次签）；开放项收敛为 EOS / F5-PIN-MODE |
| 2026-09-09 | **W1/F1 落地完成**（`S2_TRUTH_PREFIXES` · task `1x-mvp-w1-s2-truth`） |
| 2026-09-09 | **W2/F2 落地完成**（exit 2 / failClosed 文档 + `test/gate-semantics.test.ts`） |
| 2026-09-09 | **W3/F4+F3 文档面落地**（`.coding-kit` 写根 · `MIGRATION.md` · EOS 仍 pending） |
| 2026-09-09 | **`HG-F5-PIN-MODE=B` + W4/F5 落地**（版本钉闸不含仓根 SPEC） |
| 2026-09-09 | **`dsh-coding-kit@1.11.0` npm 已发版**（`npm view` · PR #30 · `HG-PUBLISH` 本波 approved） |
| 2026-09-10 | **`HG-EOS-DATE` / 1.12 `HG-PUBLISH` approved**：日历已公布 · deprecate 已核 · `latest=1.12.0` |

---

## 给 Cursor / 下一棒

`1x-mvp` W1–W4 **DONE** · **1.11.0 published** · 三方验收通过；**1.12.0 published** + `@cyning/harness` deprecated · 见 [`docs/spec/1x-closeout/`](../1x-closeout/)