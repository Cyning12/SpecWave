# 03 · W3 · 安全与可观测性补全（security & observability）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）· 隶属 `2_3-wiring-completion`  
> **test_strategy**：`required`（绝对路径零泄漏断言 + JSON 信封解析 + 非 git 靶场 + CI 配置断言）  
> **上游**：验收 §4 #5（C3 补漏）· §2 W3（exit 1 无 JSON 信封）· §2 W4 #9（git 前提）· 路线 §5 C4/C5 · PROMPT §3 W3 行

---

## 1. 背景

2.2.0 W2/W3 完成了安全封堵与 `--json` 四字段，对抗验收留下四条补漏与一个路线项：

1. **[A]#5 · C3 未覆盖 `--json` 与错误文案**：`verify --json` / `gate-check --json` 的 `target` 字段回吐**绝对路径**（本棒复核：`test/cli-verify-observability.test.ts:149` 仍把 `payload.target` 钉死为绝对路径 `dir`，属实）；错误信息（`--target 不在任何 git 仓内: /etc` · `未找到 --task 文件 /abs/path`）仍泄漏绝对路径。2.2.0 只改了人类输出的 `目标:` 行。
2. **[A]W3-P2 · exit 1 用法错时 `--json` 不产出 JSON 信封**（空 stdout）：JSON 消费者无法从结构化字段读错误原因。
3. **[A]#9 · quickstart 第 3 步暗含 git 前提**：`verify --task` 要求 git 仓，init/quickstart 全文未提 `git init`；非 git 目录机械照做在第 3 步 EXIT 1（2.2.0 验收实测复现）。
4. **[R] C4 · CI 最小权限与扫描**：`ci.yml` 无 `permissions:` 块、无依赖/密钥扫描（路线 §2.5 T-01/T-15 部分）。
5. **[R] C5 · 发布 provenance/OIDC**：仅出**配置指引文档**；账号配置**仅人**（PROMPT 使用说明 4 拍板）。

## 2. 目标

绝对路径零泄漏（含 `--json` 与错误面）、JSON 消费者在全退出码档可读结构化错误、quickstart 机械照做不再暗坑、CI 权限最小化并有依赖/密钥扫描。

## 3. 范围

| # | 项 | 内容 | 出处 |
|---|----|------|------|
| ① | C3 补漏 | `--json` `target` 字段与**全部错误文案**统一 `toRel` 相对化；`cli-verify-observability.test.ts:149` 期望值同步改为相对口径 | [A]#5 |
| ② | exit 1 JSON 信封 | 用法错（exit 1）+ `--json` → stdout 输出 JSON 信封（含 `command` / `exitCode` / `error` 结构化字段 · 键集只增不改原则适用于既有成功档） | [A]W3-P2 |
| ③ | quickstart git 前提 | init 3 步 quickstart 第 3 步（或第 0 步提示行）补「确保项目已 `git init`」 | [A]#9 |
| ④ | C4 CI 加固 | `.github/workflows/` 顶层/job 级 `permissions:` 最小权限（`contents: read` 起步）+ 依赖扫描（`npm audit` 或等价）+ 密钥扫描（如 gitleaks 或 GitHub 原生 secret scanning 配置文档化） | [R] |
| ⑤ | C5 指引文档 | 发布 provenance/OIDC **配置指引文档**（落 `RELEASING.md` 节或独立 doc）：npm `--provenance` · GitHub OIDC `id-token: write` · trusted publishing 步骤；**账号配置仅人** | [R] |

## 4. 非范围

| 项 | 理由 |
|----|------|
| `gate-check --json` / `audit` 补四字段（[A]W3-P2 其二） | 验收定为行为面不一致的低优项；本波只做 `verify --json` 面与错误信封；扩展归后续评估 |
| C6 审计日志落盘 | 3.0 |
| C5 账号侧实际配置（npm/GitHub 后台） | **仅人**；agent 禁代劳 |
| 报错国际化（D4） | 后续评估；本波只做相对化不做翻译 |
| 改 `--json` 既有键名/类型/顺序 | 2.2.0 契约「只增不改」（键集维度）保持 |

## 5. 设计

### 5.1 toRel 相对化（D-23-JSON-TARGET-REL · 已定案）

- `--json` `target` 字段：绝对 → **相对**（相对 cwd · 与 2.2.0 人类输出 `目标:` 行同口径）。
- **契约注意**：这是**值**变更非键集变更——2.2.0 契约钉的是键名/类型/顺序；target 绝对路径属安全泄漏（C3 范围内未竟项），按修复定性，**CHANGELOG 2.3.0 必须明示此行为变更**。
- 错误文案：`--target 不在任何 git 仓内: /abs` · `未找到 --task 文件 /abs` 等统一 `toRel`；无法相对化（如 cwd 外 /etc）时以原样相对化策略（`path.relative` 结果含 `..`）或脱敏占位二选一，task 定稿（推荐：`path.relative` 原样输出，与 2.2.0 人类面一致）。
- 测试：`:149` 期望改相对；新增「输出不含 `dir` 绝对前缀」断言（含 /tmp 靶场）。

### 5.2 exit 1 JSON 信封

- 触发：用法错误档（exit 1）且传 `--json`。
- 信封最小字段：`command` · `exitCode: 1` · `error`（`{ message, hint? }` · message 已相对化）；stdout 可 `JSON.parse` 且无人类文本污染。
- 不改 exit 码本身（1 保持）；不传 `--json` 时人类错误输出不变。

### 5.3 quickstart git 前提

- init 输出 quickstart 第 3 步前补提示（如「前提：项目须为 git 仓（`git init`）——verify 有 git-root 归属校验」）；README「核心对象」/quickstart 引用处同步一句（双语）。
- 验收：非 git 目录照做 quickstart，提示可见；`git init` 后三步走通（2.2.0 验收实测路径回归）。

### 5.4 C4 CI

- `permissions: contents: read` 顶层最小化（release 相关若需写权限，job 级显式声明并注释理由）。
- 依赖扫描：CI 增 `npm audit --audit-level=high`（或等价 · 失败档随 task 定：推荐 warn 起步转 fail 的口径评审）。
- 密钥扫描：GitHub 原生 secret scanning / push protection 开启步骤文档化（属仓库设置 · 仅人），CI 侧可加 gitleaks job（离线可跑 · 推荐）。

### 5.5 C5 指引文档（仅文档）

- 内容：npm publish `--provenance` 前提（GitHub Actions `id-token: write` · 仓库 public 或 npm Pro）· trusted publishing 配置步骤 · 回退路径（人手工 publish 不带 provenance 的现状保持）。
- 落点：`RELEASING.md` 新增节或 `docs/` 独立指引（task 定）；**全文口径「未启用 · 配置仅人」**（事实卡 §11 禁称保持）。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| `--json` target 相对化 + CHANGELOG 明示 | **采纳（D-23-JSON-TARGET-REL）** | 安全泄漏修复 · 与人类面一致 |
| target 保留绝对 + 仅错误文案相对化 | 弃选 | 泄漏面留一半 · C3 不闭环 |
| exit 1 信封复用成功档键集 + `error` 键 | **采纳** | JSON 消费者单一解析路径 |
| exit 1 信封走 stderr | 弃选 | stdout 既定为 JSON 通道（2.2.0 W3 契约） |
| CI 密钥扫描 = gitleaks job | **推荐** | 离线可跑 · 不依赖仓库设置 |
| CI 密钥扫描 = 仅文档化 GitHub 原生 | 备选 | 配置仅人 · 无 CI 内强制 |
| `npm audit` 失败即 exit 非 0 | 评审定 | 既有依赖现状若带 high 漏洞会立刻红 · 推荐先摸清现状再定档 |

## 7. 验收标准

1. **零泄漏**：`verify --task --json`（PASS 与 BLOCKED 两档）+ 三类错误（target 非 git 仓 · task 未找到 · 路径越界）输出中**不含 target 绝对路径前缀**；测试断言。
2. `:149` 期望值改相对口径后测试通过；既有 `--json` 键集回归（只增不改）。
3. **信封**：用法错 + `--json` → stdout `JSON.parse` 成功 · 含 `exitCode:1` 与 `error.message`（相对化）。
4. **quickstart**：非 git 目录跑 init → 输出含 git 前提提示；`git init` 后三步走通（实测贴输出）。
5. **CI**：workflow 含顶层 `permissions:`；扫描 job 存在于 workflow 文件（测试或人工核验 yaml）；本地 `npm audit` 现状摸底结果入 task 报告。
6. **C5 文档**：指引文档落盘 · 口径「未启用 · 配置仅人」；事实卡禁称未破。
7. `npm run typecheck` 0 错 · `npm test` 全绿 · `pins check` 12+/12+ PASS。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W3-01 | cwd 外路径相对化产生 `../../etc` 形态 | 维持 `path.relative` 原样（与人类面一致）；不引入新泄漏 |
| F-W3-02 | 错误发生在 `--json` 解析参数之前 | 信封兜底：参数解析失败的用法错也尽量输出信封（不能则 exit 1 + 人类文案 · 留痕已知边界） |
| F-W3-03 | `npm audit` 现状带 high 漏洞 | task 报告如实列出；失败档评审定（不擅自降级或放行） |
| F-W3-04 | gitleaks 误报（测试 fixture 内假密钥） | `.gitleaksignore` 或配置允许清单 · 数据化留痕 |
| F-W3-05 | C5 文档被误读为「已启用」 | 文档标题与首行明示「未启用 · 配置仅人」；评审核对事实卡 §11 |
| F-W3-06 | quickstart 提示改动破坏既有测试（init 输出断言） | 联改测试期望值 · 保持三步骤结构不变 |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = 验收 §4 #5 · §2 W3/W4 + 路线 §2.5/§5 C4/C5 + 本棒复核 test:149 | no |
| R1 | 范围 = ①–⑤；非范围 = audit 四字段扩展 / C6 / C5 账号配置 / D4 / 键集变更 | no |
| R2 | §6 表：target 相对化 / 信封通道 / 密钥扫描形态 / audit 失败档 | no |
| R3 | 边界：cwd 外相对化 · 参数解析前错误 · audit 现状漏洞 · gitleaks 误报 · C5 口径 | no |
| R4 | `test_strategy=required`：零泄漏断言 + 信封解析 + 非 git 靶场 + workflow 断言 | no |
| R5 | **已签收**（2026-09-12 · HG-SPEC-SIGNOFF=approved · 00 代签）· 下一棒：00 拆 W3 task | no |

**residual_risks**：`--json` target 值变更对既有消费者的破坏面（缓解：CHANGELOG 明示 · 安全修复定性）；`npm audit` 失败档未定（task 阶段摸底后评审）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-12 维护者会话授权 00 代签 · 与 2.2.0/2.2.1 同模式） | ~~本 SPEC 定稿 · 冻结 D-23-JSON-TARGET-REL~~（已冻结） |
| HG-AUDIT-R1（W3 task） | pending | W3 30 改码前（task 阶段 00 代签） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | draft · 10-spec · C3 补漏 + 信封 + git 前提 + C4 + C5 指引 |
| 2026-09-12 | signed · HG-SPEC-SIGNOFF approved（00 代签） |
