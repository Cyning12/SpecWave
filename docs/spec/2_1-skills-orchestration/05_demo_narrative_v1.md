# 05 · 对外 Demo 执行流程（宣讲）

> **状态**：`draft` · 隶属 `2_1-skills-orchestration`  
> **用途**：对外录屏 / 路演口播；**不是**把五项 `kit-*` 当成帽链顺序。

---

## 1. 先分清两条轴（常被混）

| 轴 | 是什么 | 用户看到 | 是否「按任务推进」排序 |
|----|--------|----------|------------------------|
| **推进轴 · Hats / Skills** | 00→10→20→（闸）→30→40 角色工作流 | `harness-00` · `10-spec` · `10-task` · `20-*` ·（可选 30/40） | **是** — 按 SPEC/task 生命周期推进 |
| **编排轴 · kit Commands** | 跨阶段运维：落仓说明、规范、闸状态、verify、丢帽重锚 | `/kit-verify` · `/kit-gate-status` · … | **否** — **横切**；任意阶段可调用 |

**结论**：五项 core 编排 **不是**按「下一顶帽子」排的；它们服务的是 **同一套 CLI 真值**（init / standards / status / verify / reanchor）。  
任务推进方向在 **Skills（及 expanded 的 `kit-hat-*` 薄壳）**；对外 demo 必须 **两轴都演**，否则听众会以为 `/kit-*` = OpenSpec 式 propose→apply 流水线。

```
推进轴（Skills）     00 ──► 10-spec ──► 10-task ──► 20-audit ──► [闸] ──► 30* ──► 40*
                              │            │            │
编排轴（kit-*）       init-guide / apply-standards / gate-status / verify / hat-reanchor
                              └──────── 随时可插 ────────┘
* 30/40 默认不分发；demo 可口头说明「须 HG-AUDIT-R1」后停。
```

---

## 2. 推荐对外 Demo 脚本（约 8–12 分钟）

> Open Folder = **干净临时演示仓**（勿在 kit 源码仓写）。包钉：`npx dsh-coding-kit@2.1.1`（registry 未更新前可用本仓源码/`2.0.2` 演管道；口播钉 2.1 UX）。升包后：`host update --yes`（粘性已选）。

### 镜 0 · 一句话定位（30s）

> 同一 npm 包：把 **帽子技能** 和 **闸编排** 物化到 Cursor / Claude / DSH；**过闸只认终端 exit**，slash 不当闸。

### 镜 1 · 落地（1.5min）

```bash
npx dsh-coding-kit host apply --tools cursor,claude,dsh --profile core --yes
# 可选：--profile expanded   # 宣讲「推进轴也有 slash 薄壳」时再开
```

展示：`.cursor/commands` · `.claude/commands/kit/` · `.cursor/skills` · `.dsh/skills`。  
Skills 镜录屏勾选口径（Cursor `/h` 六条 · 跳过 30/40）：见 [`DOGFOOD_host_adapt_cursor_claude_录屏清单_v1_zh.md`](../../guides/DOGFOOD_host_adapt_cursor_claude_录屏清单_v1_zh.md) **§5.1**。

### 镜 2 · 编排轴 · 入门（1min）

Cursor 或 Claude：`/kit-init-guide`（或 `/kit:init-guide`）  
口播：插件 `init_coding_kit` ≠ CLI `init`；本 demo 用 CLI 过程根即可。

可选：`/kit-apply-standards` — 加载 ≠ 注入。

### 镜 3 · 推进轴 · 写需求（3–4min）

1. `/harness-10-spec`（或 expanded `/kit-hat-10-spec`）— 写/改一小段 SPEC  
2. `/harness-10-task` — 写对应 task（含验收、failure_paths、人工闸表）  
3. `/harness-20-task-audit` — 对照 SPEC 审 task（书面，不改码）

口播：这是 **任务推进**；与 OpenSpec `opsx-propose` 职责不同，可同仓共存。

### 镜 4 · 编排轴 · 过闸（2min）

1. `/kit-gate-status` — 读闸表 + `status`（声称与表冲突则 STOP）  
2. `/kit-verify` — **必跑** `npx dsh-coding-kit verify --task …`，念 exit **0 / 1 / 2**  
3. 故意缺 task 或未满足条件 → 展示 **exit 2**，强调 failClosed  

### 镜 5 · DSH 同语义（1.5min）

在 DSH Web：输入 `/` 找 **同名 skill**（2.1 B-DSH-ORCH：编排意图落在官方 `.dsh/skills`，可 `/name` 调用；**不是**虚构的 `.dsh/commands/`）。  
再跑同一条 `verify` CLI，证明 **真值不随宿主变**。

### 镜 6 · 收束（30s）

| 说 | 不说 |
|----|------|
| 两轴：推进=帽子；编排=闸与入口 | 「五项 kit 就是开发流水线顺序」 |
| 30 默认不装；publish 仅人 | 在 demo 里假装闸已过 |

---

## 3. 五项 core 在 demo 中的位置（对照表）

| 命令 | 属于哪轴 | Demo 何时用 |
|------|----------|-------------|
| `kit-init-guide` | 编排 | 镜 2 · 开场分入口 |
| `kit-apply-standards` | 编排 | 镜 2 · 可选 |
| `kit-hat-reanchor` | 编排（救急） | 长对话跑偏时；短 demo 可跳过 |
| `kit-gate-status` | 编排 | 镜 4 · verify 前 |
| `kit-verify` | 编排 | 镜 4 · 高潮 / 一票否决 |

推进顺序 **不要**改成 verify→spec→task；那是反叙事。

---

## 4. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft · 回答「五项是否按任务推进」+ 宣讲脚本 |
| 2026-09-10 | 镜 1 交叉指针 DOGFOOD §5.1（Skills / `/h`） |
| 2026-09-10 | W5：包钉 → `2.1.0` |
| 2026-09-10 | 2.1.1 W4：包钉 → `2.1.1` |
