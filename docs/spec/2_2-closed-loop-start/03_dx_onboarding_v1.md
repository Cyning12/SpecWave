# 03 · W4 上手断档（D1+D3）· W5 术语表（D2）

> **状态**：`signed`（HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved · 人 2026-09-11 会话预授权 · 00 代签落表）· 隶属 `2_2-closed-loop-start`  
> **test_strategy**：W4 init 输出 = `required`（文本断言）；W4 README / W5 文档面 = 抽检 + 链接与文本断言  
> **上游**：PROMPT §3 W4/W5 证据行 + 路线研究 §2.4 DX 断档

---

## W4 · D1 · `init` 后 3 步 quickstart

### 证据

- 实测 `init` 跑完只打印 manifest 写入，**无任何「下一步」**（PROMPT §3 W4 行）。
- `sync prompts --yes` 是**隐式前置依赖**——不跑就没有 `TASK_TEMPLATE.md`，而这条链在 init 输出与 README 上手段落里从未提及（路线研究 §2.4）。

### 范围

- `init` 成功完成后打印 **3 步 quickstart**：① `sync prompts --yes`（物化 prompts 模板）② 按模板建首个 task（说明 task 是什么、放哪）③ `verify --task` 首验。
- 输出双语口径与本仓 README 一致（英文 README 优先现状下，quickstart 文案语种决策随实现 task 定，但须与 §D3 节互链）。

### 非范围（S2 红线）

- **不物化示例 task 进消费者仓 `docs/tasks/`**——S2 过程域永不覆写纪律对消费者仓同样适用；示例只能以**模板/指引文本**出现，是否落文件由用户显式执行。
- 不做完整 QUICKSTART walkthrough（D6 · 2.3）。

### 验收要点

1. `init`（含 `--yes` 非交互路径）输出含 3 步 quickstart 文本（测试断言关键行）。
2. quickstart 提到的命令均真实存在（防「文档超前于能力」）。

---

## W4 · D3 · README 定义核心对象

### 证据

- README 教 `verify --task <task.md>` 却**全篇未定义 task 是什么 / 从哪来 / 放哪**（PROMPT §3 W4 行）。

### 范围

- README 双语新增「核心对象」节：`task.md` / `spec.md` 的定义（是什么 / 从哪来 = `sync prompts` 模板 / 放哪 = `docs/tasks/active/` 等 / 最小示例）。
- 与 W5 `GLOSSARY.md` 互链，不重复展开。

### 验收要点

1. 双语 README 均含该节且内容对齐（非机翻）。
2. 该节与 quickstart、GLOSSARY 三处互链有效。

---

## W5 · D2 · 双语 `GLOSSARY.md`

### 证据

- 全仓无对外术语表（前提校核 #14 复核：仓根 / `docs/` 无 `GLOSSARY.md`；grep 命中仅在 `delivery/` 历史档与 `assets/` 模板注释）。
- 4 组首小时必懂概念完全无解释：`task.md`/`spec.md` · `Harness` · `hat` · `kit-*`。

### 范围

- 仓根新增 `GLOSSARY.md`（双语：中英分节或双栏，与 README 双语风格一致），覆盖上述 4 组 + 人闸 / S2 / 过程轨 / 真值源等事实卡 §12 既定中文术语。
- README 双语首屏（首 30 行内）链接 `GLOSSARY.md`。

### 非范围

- 不改 `docs/roadmap/` 目录名（D5 · 2.3）。
- 不做报错国际化（D4 · 2.3）。

### 验收要点

1. `GLOSSARY.md` 存在且 4 组概念齐备、双语条目一一对齐。
2. README 双语首屏链接可解析。
3. 术语口径与事实卡 §12 保留词（门禁 / 过程轨 / 帽制 / 人闸 / 真值源）一致。

---

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W4-01 | quickstart 提到不存在的命令 | 验收 FAIL（文档超前于能力） |
| F-W4-02 | 实现试图物化示例 task 进消费者 `docs/tasks/` | 越 S2 红线 · 打回（00 §3 S2 / §4 failure_paths） |
| F-W4-03 | 双语 README 新增节内容漂移 | 验收 FAIL · 对齐后重验 |
| F-W5-01 | 术语与事实卡保留词冲突 | 验收 FAIL |
| F-W5-01b | GLOSSARY 引入无出处数字/未落地能力 | 验收 FAIL（FACT-CARD 硬纪律） |

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~定稿~~ |
| **HG-NEXT-PLAN** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~开 W4/W5 实现~~（按波次逐波开工） |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | draft · 10-spec · S2 红线显式冻结「不物化示例 task」 |
| 2026-09-11 | signed · 双闸 approved（00 代签 · 审查文 R1 pass） |
