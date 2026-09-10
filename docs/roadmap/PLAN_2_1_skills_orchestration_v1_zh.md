# 规划 · 2.1 · 多平台技能 + 编排

> **状态**：`signed`（**HG-NEXT-21** / **HG-SPEC-SIGNOFF=approved** · 2026-09-10 · 维护者「签收」）  
> **目标发版**：`dsh-coding-kit@2.1.0`（minor · 在 `2.0.x` 之上）  
> **基线**：`2.0.0` F6 host-adapt **published** · 现行 docs 钉至 `2.0.2`  
> **系列 SPEC**：[`docs/spec/2_1-skills-orchestration/`](../spec/2_1-skills-orchestration/)（`draft`）  
> **上游**：2.0 [`PLAN_2x_host_adapt_v1_zh.md`](./PLAN_2x_host_adapt_v1_zh.md) · OpenSpec/spec-kit slash 观感对标  
> **Open Folder**：`dsh-coding-kit/`  
> **本文件不做**：改 `src/` / npm publish（须 `HG-NEXT-21` + SPEC 签收 + 各波 `HG-AUDIT-R1`）

---

## 一句话

在 **2.0 已打通的落点管道**（`host validate|apply|update`）之上，把 **Skills（帽子）** 与 **Commands（编排）** 做到 **Cursor · Claude Code · DSH（+ agents）可发现、可调用的产品级 parity**——对齐 OpenSpec「输入 `/` 即见工具」的直观方案，且 **不**吞并 OpenSpec/spec-kit 主流程。

---

## 动机（来自 2.0 dogfood）

| 观察 | 2.0 现状 | 2.1 要补 |
|------|----------|----------|
| Cursor `/h` 可见 `harness-*` 技能 | skills 已物化到 `.cursor/skills` | 保证 `host apply` 默认矩阵 **显式含全宿主 skills**，录屏/验收可勾 |
| Cursor `/kit` · Claude slash | core 五条 `kit-*` 已落扁平文件 | Claude **命名空间观感**（对标 `/opsx:explore` → `/kit:verify`）；Cursor frontmatter 补齐 `name`/`description` |
| DSH | skills → `.dsh/skills`；**commands=[]** | **B-DSH-ORCH=B**：编排意图写入官方 **`.dsh/skills`**（`/` 可调）；**不**造 `.dsh/commands/` |
| OpenSpec 同仓共存 | 前缀纪律已有（禁冒充 `opsx-*`） | 录屏与 README 固化「三前缀并存」：`opsx` / `speckit` / `kit`+`harness` |

---

## 版本切分

| 版本 | 定位 |
|------|------|
| **2.0.0–2.0.2** | F6 管道 + 多宿主 README/录屏（**已发**） |
| **2.1.0** | **本规划**：多平台 **技能发现 + 编排 UX/等价面** · expanded commands（可选 profile） |
| **2.1.x+** | 观察项：workspaces · `ontology-check` CLI · onboard 教学命令（另闸） |

---

## 采纳冻结（维护者已选）

| ID | 决议 | 说明 |
|----|------|------|
| B-SKILL-PARITY | **采纳** | 同一 `assets/skills/*`（跳过 30/40）默认进 cursor/claude/dsh/agents；验收含发现性 |
| B-CMD-UX | **采纳** | Claude：`kit/<verb>.md` → `/kit:verb`；Cursor：扁平 + 完整 frontmatter |
| B-EXPANDED | **采纳** | `profile=expanded` → `kit-hat-*` 薄壳；默认仍 `core` |
| **B-DSH-ORCH** | **采纳 = B（按上游重述）** | 见下节；**禁止**发明无扫描逻辑的 `.dsh/commands/` |
| B-WS | **推迟** | OpenSpec workspaces → 2.1.x+ |
| B-ONB | **推迟** | `kit-onboard` → 后波 |
| B-DELTA | **拒绝** | OpenSpec delta 作 kit 主流程 |

### B-DSH-ORCH = B · 上游对齐（`deepseek-harness`）

维护者选定 **B（要 `/` 可发现的编排面）**。对照本机官方仓（约 `0.1.3-alpha.2` · `docs/subsystems/skills.md` / `commands.md`）：

| 表面 | 官方事实 | 2.1 落点 |
|------|----------|----------|
| **项目本地 slash 指令文件** | 扫描 **`<projectRoot>/.dsh/skills`**（亦可 `.agents/skills`）；用户 `/name` 可调 | 将 **core 五条编排意图** 物化为 DSH skills（如 `kit-verify/SKILL.md` 或约定命名），与 `harness-*` 帽子技能并存 |
| **Human Commands** | **仅插件** `ctx.commands.register()`；**无** `.dsh/commands/*.md` 发现 | 2.1 **不**新建 `.dsh/commands/`；真·command 注册若需要 → 另开「插件 register」子项（非本 B 默认） |

**B 的产品语义（冻结）**：DSH 上编排与 Cursor/Claude 一样能 **用 `/` 点出来**，真值仍跑 `npx dsh-coding-kit …`；实现载体 = **官方 skills 根**，不是虚构 commands 目录。

---

## Waves（草案）

| Wave | 覆盖 | 人闸 | 状态 |
|------|------|------|------|
| **W0** | 本规划 + SPEC 系列定稿 · 冻结 B-* · 拆实现 task | **`HG-NEXT-21`** · **`HG-SPEC-SIGNOFF`** | **DONE**（2026-09-10 签收） |
| **W1** | Skills 多宿主 parity 断言 + README/录屏镜头 | `HG-AUDIT-R1` | **DONE**（测绿 · 无 src 缺口） |
| **W2** | Commands UX：Claude `/kit:` · Cursor frontmatter · `host apply/update` | `HG-AUDIT-R1` | **DONE** |
| **W3** | DSH：core 编排 → `.dsh/skills`（B 已冻结）+ `/name` dogfood + 测 | `HG-AUDIT-R1` | **DONE** |
| **W4** | `profile=expanded`（kit-hat-* 等）+ conflict/`update` | `HG-AUDIT-R1` | **DONE** |
| **W5** | dogfood（Cursor+Claude+DSH）· CHANGELOG · bump **2.1.0** | **`HG-PUBLISH`**（仅人） | **DONE（git/tag）** · publish pending |

---

## 明确非范围（2.1.0）

- OpenSpec / spec-kit 主流程或冒充其前缀  
- 默认分发 `harness-30-execute` / `harness-40-self-check`（仍须 T1）  
- Agent `npm publish` / deprecate  
- 云 Policy / Marketplace / 自研 IDE  
- 删除 `.cyning-harness/`  

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-NEXT-21** | **approved**（2026-09-10 · 维护者「签收」） | ~~开 2.1 实现主线（W1+）~~ |
| **HG-SPEC-SIGNOFF** | **approved**（同上） | ~~`2_1-skills-orchestration` 定稿~~ |
| **HG-AUDIT-R1** | pending（各波） | 各实现 30 |
| **HG-PUBLISH** | pending | `2.1.0` npm publish（仅人） |

`pending` → `approved` **仅人**（各波 R1 / publish）；系列闸已签收。

---

## 验收一句话（产品）

在干净演示仓执行：

```bash
npx dsh-coding-kit@2.1.0 host apply --tools cursor,claude,dsh --profile core --yes
```

- Cursor：`/h` 见 harness 技能；`/kit` 见 core 编排  
- Claude：`/kit:…` 见同语义编排；skills 可发现  
- DSH：帽子 + **编排** skills 均在 `.dsh/skills`；`/` 可调；**同一 CLI 真值**（verify exit 2）  
- 与 OpenSpec `opsx*` 同仓不冲突  

宣讲流程见 SPEC [`05_demo_narrative_v1.md`](../spec/2_1-skills-orchestration/05_demo_narrative_v1.md)；验收勾选见 [`04`](../spec/2_1-skills-orchestration/04_waves_and_acceptance_v1.md)。

---

## 读序

1. 本文件  
2. [`../spec/2_1-skills-orchestration/README.md`](../spec/2_1-skills-orchestration/README.md)  
3. `00` → `05`  
4. Task：`docs/tasks/active/task_2_1_skills_orch_w0_planning.md`

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 初稿：维护者确认「多平台技能+编排」进 **2.1**；闸 pending |
| 2026-09-10 | **B-DSH-ORCH=B** 按 `deepseek-harness` 重述（skills `/name`，禁 `.dsh/commands`）；补 Demo 双轴叙事 |
| 2026-09-10 | **签收**：HG-NEXT-21 + HG-SPEC-SIGNOFF=approved；W0 DONE；拆 W1–W5 |
| 2026-09-10 | **W1 DONE**（三方 skills 断言测绿 · 无 src 缺口）· 开 W2 |
| 2026-09-10 | **W2 DONE**（Claude `kit/<verb>` + Cursor frontmatter + 扁平迁移）· 开 W3 |
| 2026-09-10 | **W3 DONE**（DSH `.dsh/skills/kit-*` · 禁 `.dsh/commands`）· 开 W4 |
| 2026-09-10 | **W4 DONE**（expanded kit-hat-*）· 开 W5 bump 2.1.0（禁 Agent publish） |
