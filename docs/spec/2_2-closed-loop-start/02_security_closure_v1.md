# 02 · W2 安全封堵（C1+C3）· W3 可观测字段（C2）

> **状态**：`signed`（HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved · 人 2026-09-11 会话预授权 · 00 代签落表）· 隶属 `2_2-closed-loop-start`  
> **test_strategy**：`required`  
> **上游**：PROMPT §3 W2/W3 证据行 + 路线研究 §2.5（T-13 / T-10 / §7.2 字段缺口）

---

## W2 · C1 · 封堵任意文件读穿越

### 证据（前提校核 #8/#9/#15 复核有效）

- `cli-shared.ts:275-277` `resolveTaskPath`：`path.isAbsolute(taskFile) ? taskFile : path.join(target, taskFile)` —— **接受任意绝对路径**。
- `cli-shared.ts:32-34` `resolveTarget`：仅 `path.resolve(targetArg || cwd)` —— **无 git-root 归卡校验**。
- 路线研究已复现：`verify --task /etc/hosts` 被**接受并读取**（10-spec 帽下不重跑，采信 lead 复核结论）。
- `resolveTaskPath` 在 `cli.ts` 有 4 个调用点（:510 / :554 / :597 / :710，覆盖 verify / audit / spec / task 相关命令），封堵须在 `resolveTaskPath` 层一处收口而非逐调用点补丁。

### 范围

- `--task` / `--spec` 文件参数：拒绝指向 target 之外的任意绝对路径；相对路径解析后归卡 target 内。
- `--target`：增 git-root 归属校验（target 须落在 git 仓内；既有 T-02 git-root 探测已落地，本波复用其能力而非新造）。
- 报错文案给迁移指引（相对路径写法）。

### 非范围

- 不改 verify / gate-check / audit 的**判定算法**本身。
- 不动 S2 写保护（沙箱实测已生效，路线研究裁决 1 定为误报）。
- 不清理 `isS2RelPath` 无调用方残留（路线研究裁决 1 尾巴；归 2.3 工程健康波）。

### 验收要点

1. `verify --task /etc/hosts` 及等价绝对路径输入 → **非 0 退出**且**不读取目标文件**（输出不得含其内容）。
2. 合法相对路径用例回归全绿（现有 406 用例不破）。
3. `--target` 指向非 git 仓路径 → 明确报错（非静默接受）。
4. 新增负向测试钉死上述拒止。

### 风险与缓解

- **误伤存量合法用法**：用户 CI 可能传绝对路径 task。缓解：报错文案明确给迁移写法；exit 码建议 1（用法错误档）→ 待决 **D-W2-ABS-PATH-UX**。

---

## W2 · C3 · 停止输出绝对路径（T-10）

### 证据

- `cli.ts:548` 打印 `目标: ${target}`（绝对路径）——前提校核 #10 确认属实，且**同型打印共 3 处：`cli.ts:403 / :500 / :548`**（PROMPT 只列 :548，范围按全部点位计）。
- `cli-shared.ts:284-288` 已有 `toRel(target, abs)` 工具可直接复用。

### 范围

- `cli.ts` 全部 `目标: <abs>` 打印改相对路径（相对 cwd 或 target，以 `toRel` 口径为准）；其余 stdout/stderr 中绝对目标路径同口径排查。

### 非范围

- 不改内部路径解析逻辑（仅输出层）。
- 不做全仓日志结构化（C6 · 3.0）。

### 验收要点

1. `verify` / `audit` 等命令 stdout 不再出现绝对目标路径（测试断言）。
2. 相对路径输出与 target 参数无关地稳定（可测）。

---

## W3 · C2 · `verify --json` 补字段

### 证据

- `verify --json` 缺 `traceId` / `exitCode` / `source` / `injectedFiles`，而安全设计 §7.2 明文要求（PROMPT §3 W3 行；事实卡 §11 亦列其为缺字段）。

### 范围

- `verify --json` 输出补四字段：`traceId`（单次运行标识）/ `exitCode`（与进程退出码一致）/ `source`（判定来源）/ `injectedFiles`（注入文件清单）。

### 非范围

- **契约只增不改**：既有字段名与语义不变（下游可能已消费）。
- `audit --json`、审计落盘不做（C6 · 3.0）。
- traceId 只做运行级标识，不接外部遥测（零云纪律）。

### 验收要点

1. `--json` 输出含四字段且有测试断言。
2. 既有字段回归不变。
3. 落地前对外文案**仍不得**宣称 JSON 可观测性完整（事实卡 §11 禁称，发布后由事实卡维护者解除）。

---

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W2-01 | `--task`/`--spec` 传 target 外绝对路径 | 拒止 · exit 1 · 报错给相对路径迁移指引 |
| F-W2-02 | `--target` 非 git 仓 | 报错 · 非 0 |
| F-W2-03 | 相对路径含 `..` 逃逸 target | 同 F-W2-01 拒止 |
| F-W2-04 | 封堵实现逐调用点补丁、漏掉 4 个 `resolveTaskPath` 调用点之一 | 验收 FAIL · 必须在 `resolveTaskPath` 层收口 |
| F-W2-05 | stdout 仍打印绝对目标路径（403/500/548 任一） | 验收 FAIL |
| F-W3-01 | `--json` 改既有字段语义 | 验收 FAIL · 契约只增不改 |

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~定稿 · 冻结 D-W2-ABS-PATH-UX~~（已冻结 · 拒止+迁移指引 exit 1） |
| **HG-NEXT-PLAN** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~开 W2/W3 实现~~（按波次逐波开工） |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | draft · 10-spec · cli.ts 绝对路径打印点位由 1 修正为 3 |
| 2026-09-11 | signed · 双闸 approved（00 代签 · 审查文 R1 pass） |
