# GLOSSARY · 术语表

[English](#english) | [简体中文](#简体中文)

> First-hour terms for SpecWave (`spec-wave`) — read this before your first `verify --task`.  
> 首小时必懂术语——在你第一次跑 `verify --task` 之前读这一页。
>
> The two core file-level objects are defined (with a minimal skeleton) in the README "Core objects" section — this glossary links there instead of repeating it: [README.md · Core objects](README.md#core-objects) · [README.zh-CN.md · 核心对象](README.zh-CN.md#核心对象).  
> 两个文件级核心对象的定义（含最小骨架）在 README「核心对象」节——本表互链过去，不重复展开。三步上手链（quickstart）由 `npx spec-wave init` 完成时打印。
>
> 中文保留词口径：**门禁 / 过程轨 / 帽制 / 人闸 / 真值源**（事实卡 §12）。

---

## English

### task.md / spec.md

- **task.md** — one executable, verifiable unit of work: scope, non-goals, failure paths, acceptance criteria, Harness metadata and the human-gate table, in a single Markdown file. Lives in `docs/tasks/active/` while in flight; `npx spec-wave task close --yes` archives it to `docs/tasks/done/`.
- **spec.md** — the signed-off requirement spec a task traces back to via `关联 SPEC`; lives under `docs/spec/`.
- Full definitions (where they come from, where they live, minimal skeleton): [README.md · Core objects](README.md#core-objects).

### Harness

The name of this repository's process framework and discipline assets: `task.md`/`spec.md` files + the hat system + human gates + the process track (S2 records). Discipline assets follow **ICVO** (Inform · Constrain · Verify · Orchestrate). The mechanical truth stays in the CLI — `npx spec-wave verify --task <task.md>` reads the files, not chat claims.

### hat (hat system)

A **hat** is the phase role an agent wears (e.g. drafting a task vs. executing code vs. self-check). Each hat is defined by a prompt file, materialized by `npx spec-wave sync prompts --yes` into `docs/harness/prompts/`. The hat model has **8 hats in two groups**:

| Group | Hats |
|-------|------|
| starter (4) | `10-task` · `20-task-audit` · `30-execute-code` · `40-self-check` |
| extended (4) | `00-orchestrator` · `10-spec` · `20-spec-audit` · `50-independent-reinspect` |

Key rule: hat 30 (code execution) may only start when `HG-AUDIT-R1` is `approved` in the task's human-gate table.

### `kit-*`

The prefix of the **orchestration commands/skills** materialized onto hosts (e.g. `kit-verify` · `kit-gate-status` · `kit-init-guide` · `kit-apply-standards` · `kit-hat-reanchor`). They are thin shells that **orchestrate** the CLI from inside your IDE/host — the verify truth stays in the CLI (`failClosed` exit **2**); IDE slash-commands only orchestrate.

### Gates & process terms

- **gate (门禁)** — the P0 mechanical checks enforced **in-process by the CLI**; a blocking verdict exits **2** (`failClosed`) and stops the pipeline. Gates do **not** depend on the host executing any hook.
- **human gate (人闸)** — a human sign-off recorded as a row in the task file's gate table. The four gates: `HG-TASK-DRAFT` · `HG-SPEC-SIGNOFF` · `HG-AUDIT-R1` · `HG-RELEASE`. The table is the truth — chat claims do not count.
- **process track (过程轨)** — the written process records (task files, review documents, invoke snapshots) that make the workflow auditable after the fact.
- **source of truth (真值源)** — for each question there is exactly one authoritative file or command (e.g. gate status truth = the task gate table, read by `verify --task`).
- **S2** — the never-overwrite process domains: `docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`. Materialization (`sync prompts` / `host apply`) never writes into them; creating files there is always your explicit action.

---

## 简体中文

### task.md / spec.md

- **task.md** —— 一个可执行、可验收的工作单元：范围、非范围、失败路径、验收标准、Harness 元信息与人工闸表，装在一个 Markdown 文件里。在途放 `docs/tasks/active/`；`npx spec-wave task close --yes` 验收归档至 `docs/tasks/done/`。
- **spec.md** —— task 通过 `关联 SPEC` 回溯的已签需求规格；放 `docs/spec/`。
- 完整定义（从哪来 / 放哪 / 最小骨架）：[README.zh-CN.md · 核心对象](README.zh-CN.md#核心对象)。

### Harness

本仓过程框架与纪律资产的总称：`task.md`/`spec.md` 文件 + 帽制 + 人闸 + 过程轨（S2 留档）。纪律资产遵循 **ICVO**（Inform · Constrain · Verify · Orchestrate）。机械真值在 CLI——`npx spec-wave verify --task <task.md>` 读的是文件，不是聊天声称。

### hat（帽制）

**hat（帽子）** 是 Agent 在某阶段戴上的角色（如起草 task ≠ 执行改码 ≠ 自检）。每顶帽由一份 prompt 文件定义，经 `npx spec-wave sync prompts --yes` 物化到 `docs/harness/prompts/`。帽制模型共 **8 帽、分两组**：

| 组 | 帽子 |
|----|------|
| starter（4） | `10-task` · `20-task-audit` · `30-execute-code` · `40-self-check` |
| extended（4） | `00-orchestrator` · `10-spec` · `20-spec-audit` · `50-independent-reinspect` |

关键规则：帽 30（执行改码）仅当 task 人工闸表中 `HG-AUDIT-R1` 为 `approved` 时才可开工。

### `kit-*`

物化到各宿主的**编排命令/技能**的统一前缀（如 `kit-verify` · `kit-gate-status` · `kit-init-guide` · `kit-apply-standards` · `kit-hat-reanchor`）。它们是薄壳，只负责在 IDE/宿主内**编排** CLI——verify 真值仍在 CLI（`failClosed` exit **2**）；IDE slash/command 只编排。

### 门禁与过程术语

- **门禁（gate）** —— P0 机械检查，由 **CLI 进程内**判定；阻断性结论以 exit **2**（`failClosed`）拦停管道。门禁**不**依赖宿主是否执行了任何 hook。
- **人闸（human gate）** —— 记录在 task 文件人工闸表里的人工签收，共 4 个：`HG-TASK-DRAFT` · `HG-SPEC-SIGNOFF` · `HG-AUDIT-R1` · `HG-RELEASE`。闸表即真值——聊天声称不算数。
- **过程轨（process track）** —— 让过程事后可审计的书面留档（task 文件、审查文、invoke 快照）。
- **帽制（hat system）** —— 见上方 [hat（帽制）](#hat帽制) 条目。
- **真值源（source of truth）** —— 每个问题有且仅有一个权威文件或命令（如闸态真值 = task 人工闸表，由 `verify --task` 读取）。
- **S2** —— 永不覆写的过程域：`docs/tasks/` · `docs/harness/reviews/` · `docs/harness/invokes/by-task/`。物化（`sync prompts` / `host apply`）永不写入；是否落文件永远由你显式执行。

---

## 修订记录 · Changelog

| 日期 Date | 说明 Note |
|------|------|
| 2026-09-11 | 初版 · 2.2 W5（D2）· 4 组首小时概念 + 事实卡 §12 保留词 · 与 README「核心对象」节互链闭合 |
