# Task：2.3 W3 · 安全与可观测性补全（security & observability completion）

> **状态**：`done`（HG-TASK-DRAFT=approved · HG-AUDIT-R1=approved · 30+40 闭环完成 · 2026-09-12）  
> **wave**：W3（2.3.0 接线补全 · 安全与可观测性补全）  
> **关联 SPEC**：[`docs/spec/2_3-wiring-completion/03_w3_security_observability_v1.md`](../../spec/2_3-wiring-completion/03_w3_security_observability_v1.md)（**唯一蓝本** · signed · 2026-09-12）· [`00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)  
> **Open Folder**：仓根

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2-3-wiring-w3-security-observability` |
| **test_strategy** | `required` |
| **test_strategy_note** | `test/cli-verify-observability.test.ts` 扩 W3-B 组（target 相对化 :149 联改 + 零泄漏断言 + exit 1 JSON 信封）· `test/cli-flags.test.ts:147/177` 同步联改 · `test/init.test.ts` quickstart git 前提断言 · 新增 `test/ci-workflow-security.test.ts`（workflow yaml 断言）；真实命令破坏性自证（三类错误面 + 非 git 靶场 quickstart + gitleaks 本地实测）为验收硬条款 |
| **freeze_id** | 2.3.0-W3 · D-23-JSON-TARGET-REL（SPEC 03 §5.1 已冻结）· D-23-W3-REL-BASE / D-23-W3-ENVELOPE / D-23-W3-AUDIT-GATE / D-23-W3-GITLEAKS-FORM / D-23-W3-C5-DOC 本 task R2 定稿（SPEC 03 §5「task 定稿」授权） |
| **required_invoke_hats** | `10,20,30,40,00` |
| **invoke_retention_profile** | `default` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **graph_delta_note** | CLI 输出面/错误文案/CI 配置/文档增补 · 不改架构图谱 |
| **wiki_delta** | `none` |
| **wiki_delta_note** | 产品行为修复与 CI/文档增补 · 非编码规范/流程增量 · 无 wiki 落点 |
| **close_pr_policy** | `exempt` |
| **close_pr_exempt_note** | 仓内 main 直推工作流（与 2.1.2/2.2/2.3-W1/W2 各波同例）· 无 PR 闸 |
| **semi_auto** | `false` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-PLAN | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表 |
| HG-SPEC-SIGNOFF | **approved** | — | 人 · 2026-09-12 维护者会话授权 · 00 代签落表（SPEC 03 signed） |
| HG-TASK-DRAFT | **approved** | 22, 30 | 00 代签（2026-09-12 维护者会话授权） |
| **HG-AUDIT-R1** | **approved** | 30 | **2026-09-12 维护者会话授权 00 代签** · 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w3_security_observability_audit_R1_20260912.md`） |

---

## 背景与目标

SPEC 03 §1：2.2.0 W2/W3 完成安全封堵与 `--json` 四字段，对抗验收留下四条补漏与一个路线项：① [A]#5 C3 未覆盖 `--json` 与错误文案（`verify --json` / `gate-check --json` 的 `target` 字段回吐绝对路径 · 本棒 R0 复核 `test/cli-verify-observability.test.ts:149` 仍钉 `payload.target === dir` 绝对路径 · 属实；`cli-flags.test.ts:147/177` 同型两处）；② [A]W3-P2 exit 1 用法错时 `--json` 空 stdout 无信封；③ [A]#9 quickstart 第 3 步暗含 git 前提；④ [R] C4 CI 无 `permissions:` 与依赖/密钥扫描；⑤ [R] C5 发布 provenance/OIDC 仅出配置指引文档。目标：绝对路径零泄漏（含 `--json` 与错误面）、JSON 消费者全退出码档可读结构化错误、quickstart 机械照做不暗坑、CI 权限最小化并有扫描。

**R0 前提复核（本棒已实测 · 全部成立无证伪）**：

- `src/cli.ts` verify emitJson :777 / verifySpecMode emitJson :654 / gate-check JSON :559 三处 `target` 字段均为绝对路径原值；错误文案泄漏点：`cli-shared.ts:62`（resolveTarget git 仓拒止）· `cli-shared.ts:348`（resolveTaskPath 越界拒止 · 插值用户输入可含绝对路径）· `cli.ts:552/597`（未找到 --task 文件）· `cli.ts:670/674`（--spec 未找到/目录）。
- exit 1 统一收口于 `src/cli.ts:1168` isMain catch（stderr 人类文案 + exitCode）——信封单点落位可行。
- `INIT_QUICKSTART`（`src/cli.ts:180-187`）三步全文无 git 前提；README 双语 :101 quickstart 引用句无 git 前提。
- `npm audit --audit-level=high` 现状：**1 high（js-yaml 4.2.0 · GHSA ×3）· `npm audit fix --dry-run` 实证修复可用 = 4.3.2（`^4.1.0` 区间内 lockfile-only bump · 非 major）**。
- `.github/workflows/ci.yml` 无顶层 `permissions:`；两 workflow（ci/tech-graph）均无扫描 job。
- 事实卡 §11：npm provenance/OIDC = **未启用 · 禁称已支持**（允许口径「规划中/将新增」）。
- 基线实测：`npm test` 495/495 · `pins check` 17/17 PASS（2026-09-12 干净树）。

**已定案（冻结 · 不得翻案）**：

- **D-23-JSON-TARGET-REL**（SPEC 03 §5.1 已冻结）：`--json` `target` 字段绝对 → 相对（toRel 口径）；**契约值变更非键集变更**，CHANGELOG Unreleased 必须明示此行为变更。
- **D-23-W3-REL-BASE**（本 task R2 定稿 · SPEC §5.1 授权「task 定稿」）：相对化基准分两层——**JSON `target` 字段**用 `toRel(process.cwd(), target)`（与 2.2.0 人类面 `目标:` 行同口径）；**错误文案**按所在层取基：`resolveTarget`（持 cwd 参数）→ `toRel(cwd, target)`；`resolveTaskPath`（无 cwd · 归卡基即 target）→ 仅当用户输入为绝对路径时 `toRel(target, taskFile)`，相对输入原样；`cli.ts` 内「未找到 --task/--spec 文件」「--spec 目录」消息 → `toRel(target, abs)`（文件恒在 target 内 · 归卡基最可行动）。cwd 外路径维持 `path.relative` `../..` 原样（F-W3-01 · 与人类面一致 · SPEC §5.1 推荐口径采纳）。
- **D-23-W3-ENVELOPE**（本 task R2 定稿 · SPEC §5.2）：exit 1 用法错 + `--json` → isMain catch 单点出信封 `{ command, exitCode: 1, error: { message } }` 于 stdout（message 为相对化后全文）；stderr 人类文案保持；exit 码 1 不变；command = argv 首个非 `-` 开头 token（兜底 `unknown` · F-W3-07）；成功档/BLOCKED 档既有 payload 键集一字不动（只增不改作用于新增档）。
- **D-23-W3-AUDIT-GATE**（本 task R2 定稿 · SPEC §6「评审定」授权）：30 第一步 `npm audit fix` 修平 js-yaml 4.2.0→4.3.2（lockfile-only · 区间内 · **修漏洞本体，非降级非放行** · F-W3-03 合规），随后 CI `npm audit --audit-level=high` **fail-closed**（独立 audit job）；修复后本地复跑 audit 0 high 实证入自检。
- **D-23-W3-GITLEAKS-FORM**（本 task R2 定稿 · SPEC §6「推荐」采纳并细化）：gitleaks 用**官方 release 二进制（版本钉死）+ `--no-git` 工作树扫描**独立 job，**不用 gitleaks-action**（避 org 仓 GITLEAKS_LICENSE 依赖与 git 历史扫描不确定性 · 离线可跑口径 = 不依赖仓库设置）；误报走 `.gitleaksignore` 数据留痕（F-W3-04）；git 历史扫描档归后续评估。
- **D-23-W3-C5-DOC**（本 task R2 定稿 · SPEC §5.5 授权「task 定」）：独立指引 `docs/guides/provenance_oidc_trusted_publishing_guide_v1_zh.md`；**RELEASING.md 零改动**（双重敏感 · pin-07 + 九步顺序测正则 · 与 W2 非范围同例）；全文口径「**未启用 · 配置仅人 · 规划中**」（事实卡 §11）。

## 范围

- [x] ① **C3 补漏 toRel 相对化**：`verify --json` / `verify --spec --json` / `gate-check --json` 三处 `target` 字段 → `toRel(process.cwd(), target)`；错误文案四处面（resolveTarget git 拒止 · resolveTaskPath 越界 · 未找到 --task 文件 ×2 · --spec 未找到/目录 ×2）→ D-23-W3-REL-BASE 口径；`cli-verify-observability.test.ts:149` + `cli-flags.test.ts:147/177` 期望值联改相对口径；CHANGELOG Unreleased 明示契约值变更。
- [x] ② **exit 1 JSON 信封**：isMain catch 单点实现（D-23-W3-ENVELOPE）；`verify --task X --spec Y` / 未知参数 / 未知命令 等用法错 + `--json` → stdout 可 `JSON.parse` 且无人类文本污染。
- [x] ③ **quickstart git 前提**：`INIT_QUICKSTART` 第 3 步前补前提行（第 0 步提示行 · **保持三步骤结构不变** · F-W3-06）；README 双语 :101 quickstart 引用句各同步一句 git 前提。
- [x] ④ **C4 CI 加固**：`ci.yml` 顶层 `permissions: contents: read`（tech-graph.yml 同补）；新增 `audit` job（`npm audit --audit-level=high` fail-closed · 前置 `npm audit fix` 修平现状）与 `secrets-scan` job（gitleaks 二进制钉版 + `--no-git`）；GitHub 原生 secret scanning/push protection 开启步骤文档化（属仓库设置 · 仅人 · 并入 ⑤ 文档）。
- [x] ⑤ **C5 指引文档**：`docs/guides/provenance_oidc_trusted_publishing_guide_v1_zh.md` —— npm `--provenance` 前提（GitHub Actions `id-token: write` · 仓库 public 或 npm Pro）· trusted publishing 配置步骤 · 回退路径（人手工 publish 不带 provenance 现状保持）· 首行明示「未启用 · 配置仅人」。
- [x] ⑥ **测试扩组与联改**：`cli-verify-observability.test.ts` W3-B 组（target 相对化 :149 联改 + 零泄漏断言 + 信封三档）· `cli-flags.test.ts:147/177` 联改 · `init.test.ts` quickstart git 前提断言 · 新增 `test/ci-workflow-security.test.ts`（顶层 permissions + 两扫描 job yaml 断言）。

## 非范围

| 项 | 理由 |
|----|------|
| `gate-check --json` / `audit` 补可观测四字段（[A]W3-P2 其二） | SPEC 03 §4 明文非范围 · 本波只做 verify 面与错误信封 |
| C6 审计日志落盘 | SPEC 03 §4 · 3.0 |
| C5 账号侧实际配置（npm/GitHub 后台 · trusted publishing 登记） | **仅人** · agent 禁代劳 |
| 报错国际化（D4） | SPEC 03 §4 · 只做相对化不做翻译 |
| 改 `--json` 既有键名/类型/顺序 | SPEC 03 §4 · 2.2.0 契约「只增不改」键集维度保持 |
| `assertNotS2Abs` / host / refresh-ide-blocks 面错误文案相对化 | SPEC 03 §7① 三类错误面之外（host 写盘面 · 无验收要求）；留痕 residual_risks 后续评估 |
| RELEASING.md 任何措辞/结构改动 | 双重敏感（pin-07 + 九步顺序测正则 · `docs-releasing.test.ts`）· D-23-W3-C5-DOC 已定独立文档落点 |
| gitleaks git 历史扫描档 / gitleaks-action 形态 | D-23-W3-GITLEAKS-FORM 已定 `--no-git` 二进制档 · 历史扫描后续评估 |
| host-adapt schema / mvp-hosts.yaml 实质内容 | 00 §3 · 触 schema 即 STOP |
| S2 目录任何 CLI 写（物化 target） | 00 §1 · 机械拒写无豁免（本 task 过程档由 agent 按流程撰写 · 非 CLI 物化） |
| W4–W7 任何实现项 / minor bump 2.3.0 / tag / publish | 各自独立 task · publish 仅人 |
| 给 pins 或任何既有门禁加 `--force` / `--allow-*` 绕过参数 | P0-GATE 硬纪律（00 §2）· 拒设计 |

---

## 失败路径（failure_paths · 对齐 SPEC 03 §8 + 本 task 增补）

| ID | 触发条件 | 系统行为 | 可重试 | 用户可见 |
|----|----------|----------|--------|----------|
| F-W3-01 | cwd 外路径相对化产生 `../../etc` 形态 | 维持 `path.relative` 原样（与人类面一致）；不引入新泄漏 | 是 | 相对形路径 |
| F-W3-02 | 错误发生在 `--json` 参数解析之前（如未知命令） | isMain catch 兜底：argv 含 `--json` 即出信封（command 取首个非旗标 token）；不能则 exit 1 + 人类文案 · 留痕已知边界 | 是 | 信封或人类文案 |
| F-W3-03 | `npm audit` 现状带 high 漏洞 | 已实测：js-yaml 4.2.0 → 4.3.2 修复可用（区间内）→ `npm audit fix` 修平后 CI fail-closed；**不擅自降级或放行** | 是 | task 报告如实列出 |
| F-W3-04 | gitleaks 误报（测试 fixture 内假密钥如 SENTINEL） | `.gitleaksignore` 或配置允许清单 · 数据化留痕 | 是 | CI 日志指出指纹 |
| F-W3-05 | C5 文档被误读为「已启用」 | 文档标题与首行明示「未启用 · 配置仅人」；验收核对事实卡 §11 | — | 文档首行口径 |
| F-W3-06 | quickstart 提示改动破坏既有测试（init 输出断言） | 联改测试期望值 · 保持三步骤结构不变（第 0 步提示行不计步骤） | 是 | — |
| F-W3-07 | 信封 command 字段解析失败（argv 首 token 为旗标） | 兜底 `unknown`；exit 码与 message 不受影响 | 是 | 信封 command: unknown |
| F-T-01 | HG-AUDIT-R1=pending 即派 30 改码 | 30 **拒开工**（`npx spec-wave verify --task` 闸扫描阻断） | 是 | 须先 20-task-audit R1 + 签闸 |

---

## 验收标准（必须自证，不接受「我改完了」）

> ①–⑦ 逐字对齐 SPEC 03 §7；⑧⑨ 为本棒纪律性增补（gate-check+close / 提交边界）。

- [x] ① **零泄漏**：`verify --task --json`（PASS 与 BLOCKED 两档）+ 三类错误（target 非 git 仓 · task 未找到 · 路径越界）输出中**不含 target 绝对路径前缀**；测试断言 + 真实命令实测贴输出（含 /tmp 靶场）。
- [x] ② `:149` 期望值改相对口径后测试通过（`cli-flags.test.ts:147/177` 同步）；既有 `--json` 键集回归（只增不改 · diff 级断言保持绿）。
- [x] ③ **信封**：用法错 + `--json` → stdout `JSON.parse` 成功 · 含 `exitCode:1` 与 `error.message`（相对化）；不传 `--json` 时人类错误输出逐字不变。
- [x] ④ **quickstart**：非 git 目录跑 init → 输出含 git 前提提示；`git init` 后三步走通（实测贴输出 · 2.2.0 验收实测路径回归）。
- [x] ⑤ **CI**：workflow 含顶层 `permissions:`（`test/ci-workflow-security.test.ts` yaml 断言）；audit/secrets-scan job 存在于 workflow 文件；本地 `npm audit` 摸底与修复结果入本 task 自检（修复后 0 high）；gitleaks 二进制本地 `--no-git` 实测 0 泄漏（或 `.gitleaksignore` 留痕逐条列出）。
- [x] ⑥ **C5 文档**：指引文档落盘 · 口径「未启用 · 配置仅人」；事实卡 §11 禁称未破；RELEASING.md 零改动（`git diff` 留证）。
- [x] ⑦ `npm run typecheck` 0 错 · `npm test` 全绿（基线 495 + 新增）· `node bin/specgate.js pins check` 17/17 exit 0。
- [x] ⑧ 波末 `npx spec-wave gate-check --task docs/tasks/active/task_2_3_wiring_w3_security_observability.md` 通过 + `task close --yes` 闭环。
- [x] ⑨ **提交边界**：禁 `git add -A`；逐路径精确 `git add`；提交信息 `feat(2.3-W3): …`；S2 过程档与实现文件逐路径列明。

---

## 给执行帽（30）的必读列表

1. `AGENTS.md`（产品块 + local 块 · S2 禁区）
2. [`docs/spec/2_3-wiring-completion/03_w3_security_observability_v1.md`](../../spec/2_3-wiring-completion/03_w3_security_observability_v1.md)（**唯一蓝本** · §3 范围 / §5 设计 / §7 验收 / §8 failure_paths）
3. [`docs/spec/2_3-wiring-completion/00_policy_and_boundaries.md`](../../spec/2_3-wiring-completion/00_policy_and_boundaries.md)（S2 / P0-GATE / 范围外 / RELEASING 双重敏感）
4. 现状文件：`src/cli.ts`（emitJson :654/:777 · gate-check JSON :559 · isMain catch :1167-1173 · INIT_QUICKSTART :180-187 · 未找到消息 :552/597/670/674）· `src/cli-shared.ts`（resolveTarget :54-68 · resolveTaskPath :326-355 · toRel :368-372）· `test/cli-verify-observability.test.ts`（:149 + BASE_KEYS/OBS_KEYS :92-93）· `test/cli-flags.test.ts`（:147/:177）· `test/init.test.ts`（:203-243）· `.github/workflows/ci.yml` · `tech-graph.yml` · `.workbuddy/output/推广事实卡-2.2.0.md` §10/§11
5. 参考前波：`docs/tasks/done/task_2_3_wiring_w2_pin_dimensions.md`（同制链路 · 自检结论格式先例）
6. 改码前必跑 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w3_security_observability.md`（GATE_VERIFY · HG-AUDIT-R1=pending 时**拒开工**）

---

## 测试策略（Harness）

**test_strategy**: `required`

- `test/cli-verify-observability.test.ts` W3-B 组（/tmp git fixture 仓 · 承 withTemp 模式）：
  - target 相对化：:149 联改为 `toRel(KIT, dir)` 期望 + `path.isAbsolute(payload.target)===false` + stdout 不含 `dir` 绝对前缀；BLOCKED 档同断言。
  - 零泄漏错误面：target 非 git 仓（stderr 不含 abs）· task 未找到（stderr 不含 abs）· 路径越界 `--task /etc/hosts`（stderr 不含 `/etc/hosts` 原样绝对前缀 · 相对形 `../` 允许）。
  - 信封：`verify --task X --spec Y --json`（互斥用法错）+ 未知参数 + 未知命令 → stdout `JSON.parse` 成功 · `command`/`exitCode:1`/`error.message` 三键 · stderr 人类文案仍在；不传 `--json` stdout 无信封（人类面回归）。
- `test/cli-flags.test.ts:147/177` 联改相对口径（verify + gate-check 两处）。
- `test/init.test.ts`：INIT_QUICKSTART 含 git 前提关键词断言（`git init` 字面）· 三步骤结构保持（1/2/3 行仍在 · F-W3-06）；既有「提到的命令在 usage 真实存在」断言不破（前提行不得引入新 `npx spec-wave` 命令字面）。
- `test/ci-workflow-security.test.ts`（新增）：ci.yml 顶层 `permissions:` 含 `contents: read` · 存在 audit job 含 `npm audit --audit-level=high` · 存在 secrets-scan job 含 gitleaks `--no-git`；tech-graph.yml 顶层 `permissions:` 同断言。
- 真实命令自证（验收 ①④⑤）为硬条款：三类错误面 /tmp 靶场实测 · 非 git 目录 init→提示→`git init`→三步走通 · `npm audit fix` 前后对照 · gitleaks 二进制本地下载实测；不接受口头声称。

---

## 实现备忘（子 Agent 回填）

| 项 | 状态 | 备注 |
|----|------|------|
| `package-lock.json` js-yaml 4.2.0→4.3.2 | ✅ | 30 第一步 `npm audit fix`（区间内 lockfile-only · D-23-W3-AUDIT-GATE）· 修复后 `npm audit` 0 漏洞 · package.json 未动 |
| `src/cli-shared.ts` 错误文案相对化 | ✅ | resolveTarget（cwd 基）· resolveTaskPath（绝对输入 → target 基 toRel · F-W3-01 口径） |
| `src/cli.ts` ①②③ | ✅ | 三处 --json target → toRel(cwd)（:559/:654/:777 原位）· 未找到/目录消息 ×4 → toRel(target) · exitWithCliError 导出（信封单一实现源）· INIT_QUICKSTART 第 0 步 git 前提 |
| `bin/specgate.js` / `bin/dsh-coding-kit.js` | ✅ | 错误出口改接 exitWithCliError（**实现期擒获**：bin 自有 catch 不经 isMain · 真实命令验收擒获 · lib-smoke S4 钉面） |
| `.github/workflows/` ×2 | ✅ | 顶层 `permissions: contents: read` ×2 · ci.yml 新增 audit job（fail-closed）+ secrets-scan job（gitleaks 8.28.0 钉版 + `--no-git`） |
| `docs/guides/provenance_oidc_trusted_publishing_guide_v1_zh.md` | ✅ | C5 指引（首行「未启用 · 配置仅人」· 路径 A/B + 回退 + GitHub 原生扫描开启步骤）· RELEASING.md 零改动 |
| `README.md` / `README.zh-CN.md` :101 | ✅ | quickstart 引用句各补 git 前提一句（双语） |
| `CHANGELOG.md` Unreleased | ✅ | 契约值变更明示（Changed 节 · D-23-JSON-TARGET-REL）+ Added ×4 + Fixed ×2 |
| 测试 | ✅ | cli-verify-observability W3-B ×5 + :149 联改 · cli-flags:147/177 联改 · init ③ 断言 · ci-workflow-security 新增 ×4 · lib-smoke S4 |

---

### 自检结论（执行者）

（30/40 同 Agent 闭环 · 2026-09-12 · 全部命令真实执行 · 完整留痕见 invoke `invoke_20260912_30_40_2-3-wiring-w3-security-observability.md`）

**验证命令与退出码**（cwd=仓根）：

| 命令 | exit | 结果 |
|------|------|------|
| `node bin/specgate.js verify --target . --task docs/tasks/active/task_2_3_wiring_w3_security_observability.md`（开工前 GATE_VERIFY） | 0 | 闸扫描 HG-TASK-DRAFT/HG-AUDIT-R1 均 approved · VERIFY: PASS |
| `npm audit --audit-level=high`（摸底 · F-W3-03） | 0 | **1 high（js-yaml 4.2.0 · GHSA ×3）**· `npm audit fix --dry-run` 实证修复 4.3.2 区间内可用 |
| `npm audit fix`（30 第一步 · D-23-W3-AUDIT-GATE） | 0 | js-yaml 4.2.0→4.3.2（lockfile-only · package.json 未动）· 复跑 `found 0 vulnerabilities` |
| W3 四测试文件红→绿（负向先行） | — | 实现前 12 fail（:149/flags×2/W3-B×4/init③/ci-workflow×4 · 钉面真触发实证）→ 实现后 38/38 pass |
| `/tmp/w3-gitleaks/gitleaks detect --source . --no-git --redact --exit-code 1`（8.28.0 二进制本地实测） | 0 | `scanned ~5261689 bytes` · `no leaks found`（F-W3-04 未触发 · 无需 .gitleaksignore） |
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **505/505 pass**（基线 495 + 新增 10：W3-B×5 + ci-workflow×4 + init③×1） |
| `npm run build && npm run test:lib` | 0 | lib 冒烟 5/5（含新增 S4 bin 面信封钉面） |
| `node bin/specgate.js pins check` | 0 | PINS: PASS · 17/17（pin-13 锚 CHANGELOG.md:25 regex 首命中未破） |
| `npm run prepublishOnly`（全链 typecheck→test→build→test:lib→pins check） | 0 | 全链 exit 0 |

**真实命令验收（/tmp 靶场 · bin 面终态）**：

| 验收 | 命令与输出摘 |
|------|--------------|
| ①a PASS 档 | `verify --task … --target /tmp/w3-acc --json` → `"target": "../../../../../tmp/w3-acc"` · verdict PASS · exitCode 0 · isAbsolute False |
| ①b BLOCKED 档 | 同上（缺审查文）→ target 同相对形 · verdict BLOCKED · exitCode 2 |
| ①c target 非 git 仓 | `verify --target /tmp/w3-nogit` → exit 1 · `错误: --target 不在任何 git 仓内…: ../../../../../tmp/w3-nogit`（无绝对 token） |
| ①d task 未找到 | `gate-check --task docs/…/task_missing.md --target /tmp/w3-acc` → exit 1 · `错误: 未找到 --task 文件 docs/tasks/active/task_missing.md` |
| ①e 路径越界 | `verify --task /etc/hosts --target /tmp/w3-acc` → exit 1 · `拒绝 target 之外的路径: ../../etc/hosts`（F-W3-01 相对形既定口径） |
| ②a 互斥+--json | stdout 信封 `{ "command": "verify", "exitCode": 1, "error": { "message": "verify：--task 与 --spec 互斥" } }` · exit 1 · stderr 人类文案保持 |
| ②b 未知命令+--json | `frobnicate --json` → 信封 `command: "frobnicate"`（F-W3-02 兜底）· exit 1 |
| ②c 不传 --json | stdout 空（无信封）· stderr `verify：--task 与 --spec 互斥`（人类面逐字回归） |
| ④a 非 git 目录 init | quickstart 第 0 步提示可见：`Prerequisite: your project must be a git repository (run 'git init' …)` |
| ④b git init 后三步 | 步1 `sync prompts --yes` 落模板 ✓ → 步2 复制 TASK_TEMPLATE 建 task ✓ → 步3 `verify --task` 出闸扫描表（模板闸 pending → BLOCKED 为首验正确语义 · 无 git 暗坑） |
| ⑤ CI/C5 | `test/ci-workflow-security.test.ts` 4 断言绿 · gitleaks 本地 0 泄漏 · C5 文档首行「未启用 · 配置仅人」· `git diff RELEASING.md` = 0 行（双重敏感零改动留证） |

**验收 ①–⑨ 逐条**：① 五面零泄漏实测见上表（①a–e · 测试侧 W3-B absTokenHit 断言钉死）；② :149/flags:147/177 联改后全绿 · 键集 diff 级断言（BASE_KEYS+OBS_KEYS）保持绿；③ 信封三档实测（②a/b/c）+ W3-B 四用例 + lib-smoke S4（bin 面）；④ quickstart 实测（④a 提示可见 · ④b 三步走通）；⑤ ci.yml/tech-graph.yml 顶层 permissions + audit/secrets-scan job（yaml 断言 ×4 绿）· audit 摸底 1 high→修复 0 · gitleaks 本地 0 泄漏；⑥ C5 文档落盘 · 口径「未启用 · 配置仅人 · 规划中」· 事实卡 §11 禁称未破 · RELEASING 零改动；⑦ typecheck 0 错 · npm test 505/505 · pins 17/17；⑧⑨ 见修订记录（gate-check + close · 逐路径 add 无 git add -A）。

**实现期调试留痕（负向/真实命令先行的第二次实证）**：信封首版落在 `src/cli.ts` `isMain()` 内 —— `bin/*.js` 发布入口自带 catch 不经 isMain，真实命令验收 ②a 当场擒获「src 测试全绿但 bin 面无信封」；修复 = `exitWithCliError` 导出为单一实现源 + 双 bin 接线 + lib-smoke S4 钉面防回归。（lib 新鲜度注记：仓内 `npm pack` 类测试经 `prepare` 钩子副作用重建 lib/ · src 套件不消费 lib · 以 S0 漂移哨兵 + S4 为 bin 面真值。）

**已知未测项**：CI workflow 实跑（本地 yaml 断言 + gitleaks/audit 同命令本地实测等价）；gitleaks git 历史扫描（`--no-git` 档既定 · 非范围留痕）；assertNotS2Abs/host 写盘面错误文案（非验收三类面 · residual_risks 留痕后续评估）。

### KPI

Task_KPI%: 100（验收 9/9 自证通过 · prepublishOnly 全链 exit 0 · 测试 505/505 含新增 10 · pins 17/17 · bin 面信封擒获-修复-钉面闭环）

---

## 思考轮（10-task）

### R0 · 证据

SPEC 03 signed 为唯一蓝本（HG-SPEC-SIGNOFF approved · 2026-09-12 00 代签）。前提复核本棒全部实测：`cli-verify-observability.test.ts:149` 钉 `payload.target===dir`（绝对）属实 + `cli-flags.test.ts:147/177` 同型两处（SPEC 未点名 · 本棒 R0 扩列联改面）；三处 JSON `target` 绝对值源码定位（:654/:777/:559）；错误文案六处泄漏点定位；exit 1 单点收口 isMain catch :1168；INIT_QUICKSTART 全文无 git 前提；README 双语 :101 引用句定位；`npm audit` 摸底 1 high（js-yaml）+ `--dry-run` 实证修复 4.3.2 区间内可用；ci.yml/tech-graph.yml 无 `permissions:` 无扫描 job；事实卡 §11 provenance 未启用禁称；基线 495/495 + pins 17/17（干净树实测）。pin-13 CHANGELOG 钉面为 regex 首命中非行号钉 → Unreleased 加条目不破钉（R0 核 `assets/release-pins.yaml:108-117`）。

### R1 · 范围

范围 = SPEC 03 §3 五项 + CHANGELOG 明示（§5.1 契约义务）+ 测试联改；非范围 = SPEC §4 五项 + 本 task 增补（assertNotS2Abs/host 面文案 · RELEASING 零改动 · gitleaks 历史档 · W4–W7 · 发版动作 · --force 禁新增 · host schema · S2 CLI 写）。

### R2 · 方案

**D-23-W3-REL-BASE**：JSON `target` 字段基 = cwd（与人类面 `目标:` 同口径 · 消费者可拼回）；错误文案分层取基（resolveTarget→cwd · resolveTaskPath/未找到→target 归卡基 · 最可行动）——推演：全统一 cwd 基在 cli-shared 层不可得（resolveTaskPath 无 cwd 参数 · 加参数 = 签名变更扩散四调用点），分层基皆为相对口径满足零泄漏且不扩散签名。**D-23-W3-ENVELOPE**：单点 catch 优于逐命令埋点（六处 fail 调用点 + 未来命令全覆盖 · F-W3-02 参数解析前错误同兜底）；信封走 stdout（2.2.0 W3 契约 · SPEC §6 弃 stderr 案采纳）；stderr 人类文案保留（JSON 消费者读 stdout · 人类读 stderr · 双通道不冲突）。**D-23-W3-AUDIT-GATE**：摸底后三选一（fail-closed 需先修平 / warn 起步 / 放行）——修复区间内可用且为漏洞本体修复，选「修复 + fail-closed」；warn 起步留 high 在树 = 扫描形同虚设，弃；放行违反 F-W3-03，弃。**D-23-W3-GITLEAKS-FORM**：gitleaks-action 有 org license 依赖 + 默认扫 git 历史（历史误报不可控 → main 红风险），二进制 + `--no-git` 工作树档确定性最高且版本钉死，采纳。**D-23-W3-C5-DOC**：RELEASING.md 双重敏感（pin-07 + docs-releasing.test.ts 九步正则）→ 独立文档落点 `docs/guides/`（已有 guide 先例），RELEASING 零改动。

### R3 · 边界

30 开工硬边界 = HG-AUDIT-R1 翻 approved（本帽不签发）；提交边界 = 禁 git add -A + 逐路径 add；S2/P0-GATE/RELEASING 双重敏感/host schema 四条硬纪律入非范围与 failure_paths；信封不改任何 exit 码；成功档/BLOCKED 档键集一字不动（diff 级断言钉死）；C5 文档口径首行明示「未启用 · 配置仅人」；`npm audit fix` 仅接受区间内 lockfile-only bump（若升 major 须 STOP 上报 00 评审）；gitleaks 误报只走数据留痕（.gitleaksignore）不调低规则强度。

### R4 · 可测性

验收 9 条全部可机械/可观测：isAbsolute 断言 · stderr 前缀断言 · JSON.parse + 三键断言 · init 输出关键词 + 三步走通实测 · yaml 断言 · audit/gitleaks 实测输出 · 四门命令 · gate-check/close · 提交边界。无「改完了」式条款。

### R5 · 派工就绪

task 结构满足 lint E1–E10；pre-30 invoke（10/00）同棒落盘。**下一棒**：20-task-audit R1 书面审（落盘 `docs/harness/reviews/` + invoke_\*_20_\*）→ HG-AUDIT-R1 签闸（2026-09-12 维护者会话授权 00 代签）→ 30/40。

### 思考轮控制

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据齐（SPEC signed + 前提复核全实测无证伪 + 基线 495/495 · 17/17 + 泄漏点/联改面定位 + pin-13 不破钉核对） | no |
| R1 | 范围/非范围划定（SPEC §3/§4 + 纪律增补） | no |
| R2 | D-23-W3-REL-BASE / ENVELOPE / AUDIT-GATE / GITLEAKS-FORM / C5-DOC 五决策定稿并完成推演 | no |
| R3 | 边界八条（开工闸 / 提交 / 硬纪律 / exit 码 / 键集 / C5 口径 / audit fix 边界 / gitleaks 误报路径）落入 task | no |
| R4 | 验收 9 条全部可机械验证 | no |
| R5 | 派工就绪 · 止于此（内容完备 · 无遗留阻塞） | **yes（R5 止）** |

**reason（early_stop）**：蓝本 SPEC signed，前提复核全部实测成立无需 STOP 上报，本帽职责（结构化转写 + 五决策定稿 + 闸/invoke 配置）已闭合，无新增开放问题。  
**residual_risks**：① `--json` `target` 值变更对既有消费者的破坏面（缓解：CHANGELOG Unreleased 明示 · 安全修复定性 · SPEC 同名留痕）；② assertNotS2Abs/host 写盘面错误文案仍含绝对路径（非验收三类面 · 后续波次评估）；③ gitleaks `--no-git` 不覆盖 git 历史中的密钥（历史扫描档后续评估 · CI 形态已在 R2 钉死二进制版）；④ 信封 command 对极畸形 argv 兜底 `unknown`（F-W3-07 留痕 · 不影响 exit 码与 message）。

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | 开单 · 10-task · 蓝本 SPEC 03 signed 版 · R0 前提复核全实测成立（:149 + cli-flags 两处联改面扩列 · 六处泄漏点定位 · npm audit 摸底 js-yaml 1 high 修复可用）· D-23-W3-REL-BASE / ENVELOPE / AUDIT-GATE / GITLEAKS-FORM / C5-DOC 五决策 R2 定稿 |
| 2026-09-12 | 20-task-audit R1 pass 零阻塞（审查文 `task_2_3_wiring_w3_security_observability_audit_R1_20260912.md` · 非阻塞观察 ×3）· HG-AUDIT-R1 approved（2026-09-12 维护者会话授权 00 代签） |
| 2026-09-12 | W3 实现落地 · 30+40 闭环：npm audit fix 修平 js-yaml + toRel 相对化（三处 JSON target + 六面错误文案）+ exitWithCliError 信封（bin 接线擒获修复）+ quickstart 第 0 步 + CI permissions/audit/secrets-scan + C5 指引 + CHANGELOG 明示 · 验收 ①–⑨ 自证全过（505/505 · pins 17/17 · prepublishOnly 全链 exit 0） |
