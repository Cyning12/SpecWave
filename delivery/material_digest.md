# AICoding 架构设计 · 资料摘要

> 本文档做一件事：**精读主理人转交的全部原始资料，逐份、逐章节做出摘要**——后面任何人拿到这份摘要，都能通过章节号快速定位回原始文件的对应位置。

> 上游输入：主理人转交的全部原始资料（本项目为 npm 包 + DSH bundle 插件，资料形态以 md / ts / yaml / json 为主）；
> 产出者：`knowledge-ingest-engineer`（知识摄入工程师 - 闻资料），经 G1 校验与人工审核通过后交付。

---

## 模版使用说明（必读）

> ⚠️ **本文件是「模版」而非真实摘要**。所有文字、表格中出现的业务内容**仅作为示意**，并不代表当前项目的真实业务范围。

| 标记 | 含义 | 处理方式 |
| --- | --- | --- |
| `<...>` | 占位符 | **必须**替换或删除 |
| `示例：` / `例：` 前缀 | 填写参考 | **必须**替换为真实内容或整行删除 |
| `YYYY-MM-DD` / `<n>` / `<x>` | 待填日期 / 数字 | **必须**替换为真实数值 |
| `[待补充]` | 事实缺口 | 最终**必须**替换 |

**填写纪律**：
1. 定稿前全文不得残留 `<...>`、`示例：`、`YYYY-MM-DD`、`[待补充]`。
2. 表格示例行可覆盖，但**表头不可删除**。
3. 附录为元信息，不需按业务替换。

---

## 0. 元信息

```yaml
标题: dsh-coding-kit@1.10.0 - 资料摘要 v1.0
版本: v1.0
状态: Draft
创建日期: 2026-09-03
整理人: 闻资料
审核人:
  - 齐构成（主理人）

原始资料清单:
  - README.md / README.zh-CN.md: 双入口文档（插件面 + CLI 面）
  - SPEC.md: 产品总规约（钉版 1.2.0，历史规约文件）
  - CHANGELOG.md: 1.2.3 → 1.10.0 版本演进史
  - package.json: 包与构建元数据
  - RELEASING.md: 发版硬步骤 checklist
  - assets/README.md + assets/*: 资产地图与资产树（P0 模板资产）
  - src/*.ts: CLI 源码（17 模块）
  - test/*.test.ts: 测试（39 顶层 + 1 lib-smoke = 40）
  - docs/releases/*: 发布回顾系列（6 份）
  - docs/spec/*: 长期 SPEC 包（doc-health / self-tech-graph + reference）
  - docs/tasks/done/*: 已完成 task（12 份 + README）
  - docs/harness/reviews/*: 审查文（15 份）
  - docs/harness/invokes/by-task/*: invoke 落盘（15 份 / 13 个任务目录，以实勘为准；见 §3 X18）
  - docs/feedback/*: 试点 FEEDBACK（1 份）
  - docs/_tech_graph/*: kit 自技术图谱（13 份，不随 npm 包发布）
  - eval/hat_identity_00_delegate/*: 00 委派评测 fixture（1 份）
  - .github/* + bin/dsh-coding-kit.js + cordis.patch.yml + tsconfig.json: CI / 构建 / 插件契约
```

| 版本 | 日期 | 作者 | 变更内容 |
| --- | --- | --- | --- |
| v1.0 | 2026-09-03 | 闻资料 | 初稿（首轮，无历史审核意见） |
| v1.1 | 2026-09-04 | 闻资料 | 合稿：D1–D3 由骨架版归并重建，D4–D20 并入四份深读碎片原文；§3 冲突由 4 条扩至 20 条（并集去重） |

---

## 1. 资料清单

> 列出全部原始资料，每份标注解析状态。解析失败或跳过的必须注明原因。登记粒度 = **资料族（cluster）**，非逐文件；项目 219 个目标文件逐行登记会丧失可读性，按族登记为 D1…D20，族内重要文件在 §2 逐份锚定。

| 编号 | 文件名 | 类型 | 来源 | 解析状态 | 说明 |
| --- | --- | --- | --- | --- | --- |
| D1 | `README.md` / `README.zh-CN.md` / `LICENSE` / `.gitignore` | md | 产品仓根 | 已解析 | 对外契约族 4 份。README.md 21.7KB 英文版（默认），README.zh-CN.md 19.4KB 中文版 |
| D2 | `SPEC.md` / `RELEASING.md` / `CHANGELOG.md` | md | 产品仓根 | 已解析 | 规约与演进族 3 份。SPEC 24.9KB、CHANGELOG 36KB、RELEASING 3.0KB |
| D3 | `package.json` / `package-lock.json` / `tsconfig.json` / `cordis.patch.yml` / `bin/*.js` | json / yaml / js | 产品仓根 | 已解析 | 包与构建配置族 5 份 |
| D4 | `assets/README.md` / `assets/standards/*` / `assets/ontology.yaml` | md / yaml | 产品仓 `assets/` | 已解析 | 资产地图与 Constrain 规范族 8 份（standards 6 + README + ontology） |
| D5 | `assets/coding_wiki/templates/*` / `assets/graph/**` | md / yaml | 产品仓 `assets/` | 已解析 | Inform 资产族 16 份（coding_wiki 7 + graph 9） |
| D6 | `assets/harness/**` | md / yaml | 产品仓 `assets/` | 已解析 | Orchestrate 过程资产族 28 份（prompts 13 + templates 10 + invokes 2 + yaml 2 + README） |
| D7 | `assets/skills/**` | md | 产品仓 `assets/` | 已解析 | Agent Skills 封装族 8 份（6 个 SKILL.md + references 1 + README 1） |
| D8 | `assets/ci/samples/*` / `assets/ide/adapters/*` / `assets/docs/*` | md / example | 产品仓 `assets/` | 已解析 | Verify 与适配族 16 份（ci 8 + ide 4 + docs 4） |
| D9 | `src/*.ts` | ts | 产品仓 `src/` | 已解析 | 源码族 17 份；`cli.ts` 约 37KB 为 CLI 主入口，`index.ts` 为插件入口 |
| D10 | `test/*.test.ts` + `test/lib-smoke/*.test.ts` | ts | 产品仓 `test/` | 已解析 | 测试族 40 份（39 根级 + 1 lib 冒烟） |
| D11 | `docs/releases/*` | md | 产品仓 `docs/` | 已解析 | 发布成效系列档 6 份；`03_defects_debt_ledger` 为工程质量审查核心证据 |
| D12 | `docs/spec/README.md` / `docs/spec/doc-health/**` | md | 产品仓 `docs/` | 已解析 | doc-health SPEC 包 11 份（7 + observations 2 + process 1 + README） |
| D13 | `docs/spec/self-tech-graph/**` | md | 产品仓 `docs/` | 已解析 | self-tech-graph SPEC 包 11 份（5 + reference 6） |
| D14 | `docs/_tech_graph/**` | md / yaml / json | 产品仓 `docs/` | 已解析 | 自图谱 dogfood 13 份；`shared/graph.json` 32KB。不随 npm 包发布 |
| D15 | `docs/tasks/done/*` | md | 产品仓 `docs/` | 已解析 | 已归档 task 13 份（含 README 索引） |
| D16 | `docs/harness/reviews/*` | md | 产品仓 `docs/` | 已解析 | 20-audit 审查文 15 份 |
| D17 | `docs/harness/invokes/by-task/*` | md | 产品仓 `docs/` | 已解析 | 过程 invoke 记录 **15 份 / 13 个任务目录**（以碎片 D 实勘为准，见 §3） |
| D18 | `docs/feedback/*` / `eval/hat_identity_00_delegate/*` | md | 产品仓 `docs/` `eval/` | 已解析 | 外部反馈与评测族 2 份 |
| D19 | `.github/workflows/*` | yaml | 产品仓 `.github/` | 已解析 | CI 配置族 2 份（ci.yml / tech-graph.yml） |
| D20 | `lib/**` | js / d.ts / map | `tsc` 输出 | 已略读 | 编译产物族 51 份（17×3）。原因：为 `src/` 的 `tsc -p tsconfig.json` 输出，与 D9 语义重复，不重复精读；仅核对文件清单与 `test/lib-smoke` 的 mtime 哨兵用途 |
| — | `node_modules/**` | — | 第三方 | 已排除 | 依赖目录，非项目一手资料 |
| — | `.git/**` | — | git 元数据 | 已排除 | 版本库内部对象，非文档资料；仅读取 HEAD / tag 元信息用于定位版本 |

**类型枚举**：`docx` / `pdf` / `pptx` / `xlsx`（模板原枚举，本项目无此类资料）；本批实际类型列扩展使用 `md` / `ts` / `yaml` / `json` / `example` / `js`。

---

## 2. 资料内容摘要

> 逐份文档按自身章节结构做摘要。每条摘要标注章节号（`D编号，§章节`），后面任何人想核实某个点，直接定位回原文对应位置即可。

### D1：README.md / README.zh-CN.md（双入口文档）

> 描述 dsh-coding-kit@1.10.0 作为 DSH bundle 插件 + P0 闸 CLI 的整体入口、能力边界与迁移路径。中英两文件内容镜像，仅语言不同。— 来源：仓库根

| 章节 | 内容摘要 |
| --- | --- |
| §Which entry to choose（README.md:9-16） | 双入口表：DSH 会话/模型调工具 → `dsh plugin add dsh-coding-kit`；Cursor/CI/存量仓 → `npx dsh-coding-kit`。两入口同出自 npm 包，插件面与 CLI 面**互不替代**。peerDependencies（cordis/dsh-tools）为 DSH 宿主插件契约，标 optional。 |
| §Entry A · DSH plugin（README.md:20-72） | 安装偏好 npm（`dsh plugin --profile web add dsh-coding-kit`）；**加载≠注入**：`apply()` 仅注册工具，须模型/用户调用 `apply_coding_standards` 后后续回合才含 `# Coding Standards`。profile 档：`l1` / `l1+l2`（默认）/ `full`（当前等价于 l1+l2，枚举保留为扩展预留）。override 根查找（1.3.0 起）：从 cwd 向上探测 `.coding-kit`/`.dsh/coding-kit`，止于最近含 `.git` 的祖先（git root），无 `.git` 则查到文件系统根。注入超 24k 字符按**文件边界**截断。读写根口径不对称：读面（`apply_coding_standards`）上探 git root，写面（`init_coding_kit`）写 cwd。 |
| §Entry B · CLI（README.md:74-158） | P0 闸 + **G1–G7 过程命令**（1.2.0 交付）；完整命令表（init/upgrade/refresh-ide-blocks/check/verify/gate-check/audit/task lint\|close/status/timeline/lifecycle/discipline/graph yaml\|ingest\|snapshot\|axioms/sync index\|prompts/skills build\|check/install/wiki export/task lint-done\|wiki-delta/check）。`init`/`upgrade`/`sync index`/`skills build` 不覆盖 S2 三域；`sync prompts` 仅写 Starter 白名单（11 文件 + TASK_TEMPLATE），默认 dry-run。`verify --with-wiki-lint` 可选非破坏闸（1.8.0）。`graph yaml export/check` 1.7.0 起 graph_id 以 yaml 声明值为真值源、保留边 label（DEF-031/032）。`check` 三向版本判定，1.5.2 起跨产品线迁移语义（DEF-028/030）。**D5 测试制品探测**：`test_strategy=required` 时缺真实测试制品 exit 2；1.5.0 起 WARN 过渡硬化为 FAIL。**refresh-ide-blocks（R-07）**：默认 dry-run，A1–A4 自动映射、B1–B5 仅报告，preflight fail-fast，5 代备份，幂等。 |
| §Migrating from @cyning/harness（README.md:159-201） | 三步最小路径（钉 1.10.0 → `upgrade --yes` → 替换 CI 命令）；skill 安装推荐非必须。Copy-paste Prompt 给存量仓维护 Agent；路径对照表（`.dsh/skills`/`$HOME/.dsh/skills` = skill 落点；`.claude/skills` 默认不写；`.dsh/coding-kit`/`.coding-kit` = 规范覆盖非 skill 目录）。 |
| §Scan verification（README.md:213-222） | 已对照 DSH 上游源码 `deepseek-harness@141eb6f`（dsh 0.1.0-rc.8）验证：DSH runtime 自动扫描 `.dsh/skills`（rank 100）与 `$HOME/.dsh/skills`（rank 400）按需加载；skill 须 `<name>/SKILL.md` 或 `<name>.md`，frontmatter 必填 name/description，name 须 kebab-case。 |
| §Host usage（README.md:224-242） | Skills **不能**覆盖全部过程能力；Host 嵌套 Harness 过程须 Process Kernel + CLI Capability + PromptAssembly 槽。推荐 Capability 白名单（`npx --yes dsh-coding-kit@<pin> verify …` / `task …`），须 Policy/H2 默认关。三分不可互替：System/Re-anchor = 短身份；prompts 全文 = 换帽加载；verify = 机械闸。 |
| §Releasing / GitHub topics / License | 发版见 RELEASING.md（DEF-001 制度化）；topics：`dsh-plugin`/`deepseek-harness`/`dsh-plugins`/`dsh`；MIT。 |

### D2：SPEC.md / RELEASING.md / CHANGELOG.md（规约与演进族）

> 产品总规约（钉版 1.2.0，历史规约文件，不随 npm 包发布）+ 九步发版硬 checklist（DEF-001 制度化）+ 1.2.3→1.10.0 演进史。— 来源：仓库根

| 章节 | 内容摘要 |
| --- | --- |
| §Harness 元信息（SPEC.md:14-26） | spec_slug `dsh-coding-kit-cli-1.2.0`；test_strategy `required`；拟发版 1.2.0；freeze_id 含「本 SPEC 不进 npm files」「cordis.patch.yml 锁 - insert」。 |
| §1 背景与目标（SPEC.md:30-52） | 一句话目标：迁入 SPEC B §2.2，使存量仓 upgrade 钉 1.2.0 后可去 @cyning/harness。完成态行为 5 条（含 upgrade 钉 1.2.0、1.1.0 P0/1.0.0 插件回归仍绿、apply 不自动注入、cordis.patch.yml 仍为 - insert）。 |
| §2 范围（SPEC.md:55-181） | §2.0 freeze 决定；§2.1 回归必须仍绿（1.1.0 P0 / upgrade 钉 1.2.0 / 1.0.0 插件 / patch / pack）；§2.2 新交付 **G1–G7 全表**（G1 status/timeline、G2 lifecycle/discipline、G3 graph yaml*/ingest/snapshot/axioms、G4 sync index、G5 skills build/check、G6 wiki export、G7 task lint-done/wiki-delta/check）；含 HGM 事件幂等键契约（DEF-015）；§2.3 文档与包面；§2.4 有时限 bin 别名删除计划（bin 仅 dsh-coding-kit，禁新增 cyning-harness/harness）。 |
| §3 非范围（SPEC.md:168-183） | 不削弱 apply 不注入、不改 cordis.patch.yml 为 RFC6902、不改 DSH/旧仓、不 Agent publish、不 CLI 注册为 DSH ctx.tools、不削弱 S2、不把工作区 Extended prompts 用 Starter cp 覆盖、不把 SPEC.md 打进 npm、不新增 bin 别名。 |
| §4 验收标准（SPEC.md:186-226） | §4.0 包与回归（version=1.2.0、无旧别名、T1–T6 仍绿、pack 不含 SPEC.md 等）；§4.1 G1–G7 分组验收（每组≥1 成功+1 失败）；§4.2 测试清单 R-P0/R-T/R-C8/D1–D8。 |
| §5 failure_paths（SPEC.md:230-249） | 闸/handler 失败矩阵（HG 闸 pending 停 00/30、无 manifest 先 init、S2 拒写、未知命令 exit 1、1.2.0 改码致 T1–T6/P0 红则拒发版等）。 |
| §6 依赖与引用（SPEC.md:253-261） | 依赖 SPEC A（插件）、SPEC B（P0）；旧仓 `cyning-harness/lib/cli.js` 只读；S2 = docs/tasks/reviews/invokes/by-task。 |
| §7 思考轮（10-spec 回填 · R0–R5）（SPEC.md:265-350） | **明确为「思考轮 R0–R5」回填**（R0 读入约束 / R1 范围场景 / R2 方案对比 / R3 边界失败语义安全 / R4 验收可测 / R5 签收就绪）。**本节是思考轮，非 assets 目录结构定义**（主理人提醒：凡称「SPEC §7 定义 assets 为五大目录」之说法无法证实，已全篇核否）。 |
| §8 下一棒 / §修订记录 / §9 设计红线（SPEC.md:354-378） | §8 交 00 按 G1–G7 拆 task；§9 增补 **R-TRUTH-1 红线**：声称的能力必须接线或明示未接线，否则记缺陷（违反即触发 `test/cli-docs-def003.test.ts` 词表命中强制标注）。 |

*（RELEASING.md）*

| 章节 | 内容摘要 |
| --- | --- |
| 硬步骤①–⑨（RELEASING.md:7-17） | ① 工作树干净且全提交（禁止从未提交工作树 publish）；② 四门全绿（typecheck/test/build/test:lib）；③ CHANGELOG 版本节归拢（日期+版本号）；④ 版本钉同步（README 双文件/含版本断言测试/`assets/ontology.yaml`/`assets/harness/discipline-coverage.yaml` 的 `as_of_package_version`）；⑤ npm version+tag（仅人）；⑥ PR 合+CI 绿（未绿禁合）；⑦ npm pack --dry-run 核对白名单；⑧ npm publish（**仅人**，Agent 禁）；⑨ 发布后 `npm view` 核验 + 过程档状态更新。 |
| 禁令速查（RELEASING.md:19-24） | 禁止从未提交工作树 publish；CI 未绿禁合；Agent 禁 `npm publish`/`npm version`；pack 异常停发版。 |

*（CHANGELOG.md）*

| 章节 | 内容摘要 |
| --- | --- |
| [1.10.0] - 2026-08-31（CHANGELOG.md:7-35） | 主题：**帽 System/Re-anchor + 00 delegate-only Skill**。新增 `FRAGMENT_hat_reanchor_v1_zh.md`/`FRAGMENT_00_delegate_only_v1_zh.md`（纳入 Starter 白名单，须 `sync prompts --yes`）；默认可分发 `harness-hat-reanchor`/`harness-00-delegate-only`；30/40 仍不进默认；三分不可互替；「偶发亲自落地=违规」；Host Capability 白名单文档。 |
| [1.9.2] - 2026-08-28（CHANGELOG.md:37-54） | `graph yaml compile/export` 的 `generated_at` 改为 yaml 源 SHA-256 前 16 hex（内容幂等，非 wall-clock）。 |
| [1.9.1] - 2026-08-28（CHANGELOG.md:56-69） | self-tech-graph 收口；kit 源码仓 `docs/_tech_graph/` dogfood；tech-graph.yml 入仓；`docs/` 不随 npm 包发布。 |
| [1.9.0] - 2026-08-27（CHANGELOG.md:71-87） | **新增 `sync prompts` 子命令**（SHA-256 三分、dry-run 默认），兑现 1.7.1/1.8.0 滞后承诺；upgrade 增只读提示行。 |
| [1.8.0] - 2026-08-27（CHANGELOG.md:89-115） | wiki_delta 链路缝隙收口（ops-desk-api K1–K7）：`task lint` E8、`lint-wiki-delta` 新诊断码、verify `--with-wiki-lint`、task close done 快照 + `--json`。 |
| [1.7.1] - 2026-08-26（CHANGELOG.md:117-135） | 00 默认编排纪律入 Starter（`00-orchestrator.md`）；00 仍不进默认 Skills 分发。 |
| [1.7.0] - 2026-08-26（CHANGELOG.md:136-162） | doc-health CLOSE 强绑定：`task close` dry-run 改 `CLOSE: READY`、新增 `close_pr_merged`/`close_hub_index`；`check` 对 `docs/spec` 根级裸 SPEC WARN。 |
| [1.6.1] - 2026-08-25（CHANGELOG.md:163-178） | graph 面行为修正（DEF-030~033）：export 保留边 label、graph_id 声明值真值源、Mermaid class 按 nodes[].kind、跨产品线判据收窄至旧包 2.x。 |
| [1.6.0] - 2026-08-25（CHANGELOG.md:180-203） | **零未接线制度化**：`verify --spec` 从 notDelivered 改为真闸（exit 2）；`close_wiki_promotion` 接线；`invoke_retention_profile=full` 收窄为 10,20,30,40,00,CLOSE；RELEASING.md 九步 checklist（DEF-001 制度化）；「明示未接线/未交付」清单归零。 |
| [1.5.2] - 2026-08-24（CHANGELOG.md:204-219） | `check` 跨产品线迁移语义（DEF-028）；`refresh-ide-blocks` 无 marker 文件仅报告（DEF-029）。 |
| [1.5.1] - 2026-08-24（CHANGELOG.md:221-232） | 默认 README 改全英文（中文留 README.zh-CN.md）；docs/releases 四版连发成效系列档入包。 |
| [1.5.0] - 2026-08-24（CHANGELOG.md:234-249） | `refresh-ide-blocks` 落地（R-07）；D5 WARN 过渡硬化为 FAIL（DEF-014 结束）。 |
| [1.4.0] - 2026-08-24（CHANGELOG.md:251-277） | 闸接线 + 债闭环（DEF-003 阶段二）：verify R<n> 审查文闸、pre-30 invoke hats 闸、task close 六守卫、lifecycle dry-run 真求值；README 扫描免责→已验证（R-08）；known limitations 仍含 close_wiki_promotion / spec_reviews_retention 未接线。 |
| [1.3.0] - 2026-08-24（CHANGELOG.md:278-314） | 行为纠偏：--help 子命令自身 usage、未知旗标 fail-fast、--json 真生效、--strict 真语义、输入校验、幂等键、插件 override 强化；CI workflow 入仓；多项 DEF 修复；测试 71→155。 |
| [1.2.4] - 2026-08-24（CHANGELOG.md:316-334） | 修谎止损：DEF-002/004/005/006/008/009/020 + DEF-003 阶段一；SPEC 增 R-TRUTH-1；建议升级后重跑 graph yaml compile / skills install。 |
| [1.2.3] - 2026-08-24（CHANGELOG.md:335-353） | DEF-023 Mermaid emit P0-HOT 修复；DEF-001 补建 v1.2.1/v1.2.2 tag（发布物与 git 历史对齐）。 |

### D3：package.json / package-lock.json / tsconfig.json / cordis.patch.yml / bin/（包与构建配置族）

> 包名 `dsh-coding-kit@1.10.0`；DSH bundle 插件 + CLI；TS 编译配置、插件 bundle patch、CLI 壳。— 来源：仓库根

| 章节 | 内容摘要 |
| --- | --- |
| 基础字段（package.json:1-17） | `type: module`；`main: lib/index.js`；`types: lib/index.d.ts`；`bin.dsh-coding-kit: bin/dsh-coding-kit.js`；`exports` 暴露 `.` 与 `./cordis.patch.yml`。`dsh.bundle.patch` 指向 `./cordis.patch.yml`。 |
| files 白名单（package.json:22-30） | `bin` / `lib` / `assets` / `cordis.patch.yml` / `README.md` / `RELEASING.md` / `LICENSE`。**`SPEC.md`、`docs/`、`src/`、`test/` 均不进 tarball**（与 SPEC.md §4.0 / RELEASING ⑦ 一致）。 |
| scripts（package.json:31-38） | `build=tsc`；`typecheck=tsc --noEmit`；`test=node --test --experimental-strip-types test/*.test.ts`（test-concurrency=1）；`prepare=build`；`test:lib`（lib 冒烟）；`prepublishOnly=typecheck && test && build && test:lib`（四门）。 |
| engines / peer（package.json:39-69） | engines `node ^22.19.0 || >=24.0.0`；peerDependencies `@deepseek-ai/cordis ^4.0.1` + `@deepseek-ai/dsh-tools >=0.0.1-rc.1 <0.2.0`，二者 `peerDependenciesMeta.optional=true`（CLI-only 不需要）；**唯一运行时依赖 `js-yaml ^4.1.0`**。 |
| keywords（package.json:50-57） | dsh-plugin / deepseek-harness / cordis / coding-standards / icvo / sdd。 |
| `bin/dsh-coding-kit.js` | 7 行 shim：`#!/usr/bin/env node` + `import('../src/cli.ts')` 调 `runCli`。 |
| `cordis.patch.yml` | DSH bundle patch，必须保持 `- insert` 形式（`- insert: - id: coding-kit / name: dsh-coding-kit`）；IDE 按 RFC6902 报缺字段属误报，勿改 JSON Patch。 |
| `tsconfig.json` | ES2020 / module Node16 / strict / outDir `lib` / rootDir `src` / include `src`；`rewriteRelativeImportExtensions` + `allowImportingTsExtensions`（TS 5.8 实验 strip-types 支撑）。 |

### D4：资产地图与 Constrain 规范族 —— `assets/README.md` + `assets/standards/*`（6）+ `assets/ontology.yaml`

> 资产地图登记 7 个目录（旧路径对照表），但磁盘实际有 8 个 —— `assets/docs/`（4 个 POINTER_*.md）是漏登记的「黑户」，且随 `package.json` `files` 含 `assets` 整目录而随 npm 包分发；`assets/README.md` 第 30 行「过程轨不进本仓」表述已过期。 — 来源：assets/README.md，:7-30；assets/docs/（磁盘）

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D4/assets/README.md，§旧路径对照（:7-19） | 资产地图表 | 登记 9 行：8 个资产目录/文件（coding_wiki、standards、graph、harness、ci、ide、skills、ontology.yaml）+ 仓根 LICENSE。其中**目录仅 7 个**（不含 ontology.yaml 与 LICENSE 两个文件） | 数据提取 |
| D4/assets/README.md，:3-5 | 资产定位 | `assets/harness/` 仅保留历史路径，对外产品名是 coding-kit / ICVO / SDD；`apply_coding_standards`（T2）默认只读 `standards/` 与 `coding_wiki/`；其余目录供 `init_coding_kit` 整树复制给人/IDE `@` 用，不全部灌 prompt | 直接引用 |
| D4/assets/README.md，:21-29 | 明确不在本目录 | 排除 bin/lib（CLI 运行时）、wizard/*.sh、eval/examples/golden（评测 P1）、node_modules | 数据提取 |
| D4/assets/README.md，:30 | 过程轨声明 | 「过程轨（SPEC / task / invoke / reviews）在工作区 `docs/dsh_coding_kit_init/`，不进本仓。」—— **经磁盘核实此表述已过期**：本仓现含 `docs/tasks/`、`docs/spec/`、`docs/harness/` | 推断 |
| D4/assets/standards/README.md，:3 | 用途 | 按语言栈从本目录复制到用户仓 `docs/standards/` | 直接引用 |
| D4/assets/standards/README.md，:9-13 | 模板清单 | 5 个：L1 基线、L2 前端、L2 后端、SOURCES 外部参考、POINTER 工作区真值（含嵌入后文件名映射） | 数据提取 |
| D4/assets/standards/README.md，:26-30 | task 字段 | `code_quality_bar: strict\|recommended\|not_applicable`；strict 须 22/30 对照 L2 条文 ID | 数据提取 |
| D4/assets/standards/TEMPLATE_CODING_BASELINE_L1_v1_zh.md，:1-43 | L1 基线 | 语言无关模板，条文 B-01~B-12（单一职责/早返回/配置外置/命名即文档/错误结构化/扩展点显式/最小 diff/类型契约/重复抽取/测试绑定/安全密钥/可观测）；状态 `draft`，嵌入后改 `active` | 综合归纳 |
| D4/assets/standards/TEMPLATE_CODING_BASELINE_L2_frontend_v1_zh.md，:1-40 | L2 前端 | TypeScript/React 模板，条文 F-01~F-14（含 遵循 B-xx + 工具规则 ID）；适用 app/components/lib | 数据提取 |
| D4/assets/standards/TEMPLATE_CODING_BASELINE_L2_backend_v1_zh.md，:1-40 | L2 后端 | Python/API 模板，条文 P-01~P-15（含 遵循 B-xx + Ruff/mypy 规则 ID）；适用 api/src、tests | 数据提取 |
| D4/assets/standards/SOURCES_v1_zh.md，:1-30 | 外部参考 | 「引用不搬运」纪律：正文不进仓，只留采纳条款与本仓落地路径；映射表含 REF-GOOG-CL/CR、PEP8、GOOG-TS、OWASP-API | 综合归纳 |
| D4/assets/standards/POINTER_workspace_truth_v1_zh.md，:1-25 | 工作区真值指针 | 只读指针；纪律「禁止双维护」（不得把业务仓 L1/L2 全文复制进产品仓）；优先级 task+图谱+PROJECT_CONFIG > 用户仓 L1/L2 > 本 POINTER | 数据提取 |
| D4/assets/ontology.yaml，:6-8 | 版本 | `version: "1.3"`；`product_semver: "1.10.0"`（自旧包 cyning-harness 2.0.4 迁移）；license MIT | 数据提取 |
| D4/assets/ontology.yaml，:10-41 | classes | 13 个类：Track（子类 Graph/Wiki/Standards/Process/Verify/IDETrack）、Template、Preset、WizardTool、IDEFragment、AdoptedProfile、VersionManifest、Task、Hat、HumanGate、InvokeSnapshot、AuditReview、Inform/Constrain/VerifyArtifact | 数据提取 |
| D4/assets/ontology.yaml，:62-74 | axioms | ONTO- 前缀公理：P1（纪律包不含业务代码与 LLM Runtime）、S2（禁止 sync 覆盖 docs/tasks、reviews、invokes/by-task）、S5（harness-sync apply 前须 git-clean）、D1（每次 20-task-audit 须产出 AuditReview）、D2（HG-AUDIT-R1 pending 时不得附 30 Prompt）、D7（public push 须 HG-RELEASE 全勾） | 数据提取 |
| D4/assets/ontology.yaml，:77-111 | hats/gates | starter_hats（10-task/20-task-audit/30-execute-code/40-self-check，含别名 22-task-audit）+ extended_hats（10-spec/20-spec-audit/00-orchestrator/50-independent-reinspect）；4 个人闸 HG-TASK-DRAFT/HG-SPEC-SIGNOFF/HG-AUDIT-R1/HG-RELEASE | 数据提取 |
| D4/assets/ontology.yaml，:1-4 | 真值声明 | 人类真值为 `DESIGN_ONTOLOGY_v1_zh.md`（私仓，不随 npm 分发）；冲突以 Markdown 为准；`npx dsh-coding-kit graph axioms check` 校验 HGM 公理、**不校验本文件** | 直接引用 |

### D5：Inform 资产族 —— `assets/coding_wiki/templates/*`（含 topics 子目录）+ `assets/graph/**`（templates 8 + 其余）

> Inform 双支：coding_wiki 为「人/Agent 读序」模板（recommended 软纪律，非 close 硬闸）；graph 为「YAML-first 技术图谱」模板（v0.2 起唯一编辑源是 `.graph.yaml`，`.md` 为编译生成物）。 — 来源：assets/coding_wiki/templates/README.md，:1-56；assets/graph/templates/README.md，:1-66

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D5/assets/coding_wiki/templates/README.md，:1-5 | 目录约定真值 | 复制到用户仓 `docs/coding_wiki/`（含 `topics/`）；纪律级 `recommended`，**不是** `task close`/`wiki_delta` 硬闸——漏目录仍可关账 | 直接引用 |
| D5/assets/coding_wiki/templates/README.md，:9-22 | 默认两层 | 目标形态：README（读序）/ _index（可选）/ stable / context / volatile + `topics/`（第 2 层，一主题一薄页） | 数据提取 |
| D5/assets/coding_wiki/templates/README.md，:37-43 | 原则 | 根禁止堆主题长文；勿按日期/PR/task_slug 建目录；`wiki export` 不依赖目录深度（靠双括号 wikilink + 相对 md 链）；本约定 recommended，缺两层≠close BLOCK | 综合归纳 |
| D5/assets/coding_wiki/templates/README.md，:60-70 | 加深阈值 | ≥15 页或难扫 → `topics/<子域>/` 第 3 层；单页 >~80 行先拆页；连续 3 个 task 同前缀可提前建子域 | 数据提取 |
| D5/assets/coding_wiki/templates/README.md，:79 | 校验命令 | `npx dsh-coding-kit wiki export --json --target <仓根>`（旧包 `--root` 旗标本包**未接线**，以 `--target` 指定） | 直接引用 |
| D5/assets/coding_wiki/templates/_index.md，:1-19 | 主题索引 | 可选模板；样例链 `[[topics/wiki_layout]]`/`[[topics/wikilinks_export]]`；业务仓按主题填真值指针到 `docs/**` | 综合归纳 |
| D5/assets/coding_wiki/templates/stable.md，:1-27 | stable 层 | 每次会话可注入短摘要（≤15 行）；含 L1 编码底线占位（最小改动/类型严格禁 any/错误结构化/测试策略/图谱优先）；IDE 入口 Cursor `.cursor/rules`、Claude `CLAUDE.md`、通用 `AGENTS.md` | 综合归纳 |
| D5/assets/coding_wiki/templates/context.md，:1-18 | context 层 | 项目级指针（变更频率低于 volatile）；待填 `docs/standards/CODING_*_L2_*`、`PROJECT_CONFIG_*`、`_tech_graph/00_main.md` | 综合归纳 |
| D5/assets/coding_wiki/templates/volatile.md，:1-26 | volatile 层 | 本 task 专属；由 task「给执行帽必读」或 invoke §3 引用；关账后归档/清空避免 stale，可复用条目晋升 context/stable | 综合归纳 |
| D5/assets/coding_wiki/templates/topics/wiki_layout.md，:1-13 | topics 演示·目录 | 薄页样例，演示 `topics/` 第 2 层；根=读序+三件套+可选 _index，主题长文→topics/ | 综合归纳 |
| D5/assets/coding_wiki/templates/topics/wikilinks_export.md，:1-13 | topics 演示·链接 | 薄页样例，图靠双括号 wikilink + 相对 md 链；加深 `git mv` 后须修链再 export；字段闸 `wiki_delta` ≠ 目录形状闸 | 综合归纳 |
| D5/assets/graph/templates/README.md，:3-15 | 模板清单 | 复制到 `docs/_tech_graph/`；v0.2 YAML-first：00_main.graph.yaml（编辑源）+ 00_main.md（生成物）、01_struct.md（模块边界表 · HG-GRAPH-MODULES 人签真值）、10_flow_MAIN.graph.yaml/.md、99_mermaid_protocol.md；02_version.md 仍可选补 | 数据提取 |
| D5/assets/graph/templates/README.md，:22-49 | 编辑/复制流 | 改图只改 `.graph.yaml`；`graph yaml compile --all` 编译、`export`→`graph.json`、`check --all` 比对；业务仓专属 _manifest.json / _contract_manifest.json / _test_manifest.json 模板不生成空壳 | 综合归纳 |
| D5/assets/graph/templates/README.md，:51-60 | 人签/dogfood | 新仓须骨架+模块表人签（HG-GRAPH-MODULES approved）才允许 30 改码；kit 源码仓自图在 `docs/_tech_graph/`，**`docs/` 不随 npm 包发布**（仅 GitHub 源码仓可见） | 直接引用 |
| D5/assets/graph/templates/00_main.graph.yaml，:1-24 | 顶层编辑源 | 唯一人工编辑源；nodes Q/E/M1/M2/ADM/FLOW_MAIN/DB/STRUCT_DOC，edges 含 anchors（path+line/symbol）代码追溯 | 数据提取 |
| D5/assets/graph/templates/00_main.md，:1-85 | 顶层生成物 | `graph yaml compile` 自动生成（frontmatter + Mermaid + Nodes/Edges 表）；`generated_at` 为 yaml 源内容戳 `sha256-<16hex>`（幂等） | 数据提取 |
| D5/assets/graph/templates/99_mermaid_protocol.md，:1-11 | Mermaid 协议 | v3 YAML-first；唯一编辑源 `*.graph.yaml`，生成物同名 `.md` 禁止手写；边标记（->/~>/=>/?> 及 [ok]/[err]/[retry]/[timeout]）、元关系 `::` 命名空间、节点形状、锚点强制、§7 IDE 预览输出契约 | 综合归纳 |
| D5/assets/graph/templates/99_mermaid_protocol.md，:127-144 | 编译器契约 | 默认 emit：`%% → path#Ln` 锚点注释、`A-->|"label"|B` 带标签边、节点文本一律双引号；**禁止** `--"label"-->` / `//` 注释 / 未引号特殊字符节点（IDE 静默解析失败） | 数据提取 |
| D5/assets/graph/templates/10_flow_MAIN.md，:1-104 | 主路径生成物 | 典型 HTTP 请求主干（鉴权→校验→服务→仓储→DB），含 `[ok]/[err]/[retry]` 状态边与 `::archives` 归档边；同 compile 生成形态 | 数据提取 |
| D5/assets/graph/stubs/README.md，:1-6 | stub 说明 | 产品包**不内置**某上游 OSS 预填图谱；默认 bootstrap 仅用 templates 通用占位 + 删 10_flow_MAIN*；stub 加载机制**未实现**（DEF-007 / DEC-BATCH-1.3.0） | 直接引用 |

### D6：Orchestrate 过程资产族 —— `assets/harness/**`（prompts 13 + templates 10 + invokes 2 + yaml 2 + README）

> Orchestrate 三子目录：templates（task/Epic/graph_bootstrap/done 视图）、prompts（00/10/20/30/40 Starter 帽 + FRAGMENT 短片段）、invokes（落盘约定）。`lifecycle.yaml` 与 `discipline-coverage.yaml` 是「机械化率真值台账」——后者明确把多数 20/22 审查闸标记为 `not_wired` / `prompt-only`。 — 来源：assets/harness/README.md，:1-18；assets/harness/discipline-coverage.yaml，:7-319

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D6/assets/harness/README.md，:1-18 | 过程轨总览 | 子目录 templates/prompts/invokes；用户仓对应 `docs/tasks/`、`docs/harness/prompts/`、`docs/harness/invokes/`；一键嵌入清单 | 数据提取 |
| D6/assets/harness/prompts/README.md，:5-15 | 标准流程 V2.1 | 人+00 大纲→选型（SDD_HAT_FLOW）→10-spec→20-spec-audit+HG-SPEC-SIGNOFF→00 起草 task→10-task→20-task-audit R1+HG-AUDIT-R1→30→40→50(↺30)→CLOSE | 综合归纳 |
| D6/assets/harness/prompts/README.md，:24-40 | Starter 帽表 | 00-orchestrator（总调度默认行为）/ 10-task-requirements / 10-spec-requirements / 20-task-audit / 20-spec-audit / 30-execute-code（含 40 自检闭环）/ 40-self-check；Extended（50/handoff/链式 PROMPT/KPI）不随包发布 | 数据提取 |
| D6/assets/harness/prompts/README.md，:35-37 | FRAGMENT 短片段 | FRAGMENT_30_gate_verify（GATE_VERIFY·pre-30/graph 字段）、FRAGMENT_hat_reanchor（长对话短身份）、FRAGMENT_00_delegate_only（已有初稿只委派）；三分面不可互替（System/全文/verify） | 数据提取 |
| D6/assets/harness/prompts/README.md，:52-54 | Skills 封装 | prompts 带 Skills frontmatter 是 Agent Skills 单源；`skills build` 生成 `assets/skills/`（勿手改）；执行帽 30/40 不进默认分发（T1 判死前）；delegate-only/re-anchor 短片段默认可分发 | 直接引用 |
| D6/assets/harness/prompts/README.md，:56 | V2 改名 | `10-requirements.md`→`10-task-requirements.md`（+新增 10-spec）；`22-task-audit.md`→`20-task-audit.md`（+新增 20-spec）；旧文件删除，sync 对残留旧帽 warn | 数据提取 |
| D6/assets/harness/templates/README.md，:7-22 | 模板清单 v0.1/v0.2.1 | TASK_TEMPLATE（单 task·human_gate）、TASK_epic（Epic 总纲+编排主表）、TASK_graph_bootstrap（HG-GRAPH-MODULES blocks 30）、ONTOLOGY_consumer_slice_v1、QUICKREF_v1_zh（手工嵌入）；done 分层：TASK_done_README（Hub）、VIEW_done_by_domain、VIEW_done_thin_pointer、FRAGMENT_task_domain_infer（git mv 域推断） | 数据提取 |
| D6/assets/harness/templates/README.md，:24-45 | 嵌入步骤/关账 | 无自动安装器，手工建 `done/<domain>/` 子目录；关账 `git mv`→done/<domain>/，更新 Hub 一行，勿向 _views/done.md 追加百行长列表 | 综合归纳 |
| D6/assets/harness/invokes/README.md，:3-22 | invoke 约定 | 路径 `docs/harness/invokes/by-task/<slug>/invoke_YYYYMMDD_<hat>_<slug>.md`；每新帽落盘 §3；TEMPLATE_invoke（元信息表+Prompt 快照+交付摘要骨架）；完整规范 POINTER 在私仓 | 数据提取 |
| D6/assets/harness/lifecycle.yaml，:1-13 | 生命周期真值 | yaml 非引擎，由 `lifecycle dry-run` 消费（资格判定旁路·不写盘）；version "1"，5 状态 draft/signed/in_progress/done/archived | 数据提取 |
| D6/assets/harness/lifecycle.yaml，:27-128 | transitions/guards | to_00（spec_reviews_retention 已接线）、to_30（HG-AUDIT-R1/HG-TASK-DRAFT/reviews_retention/audit_D5/task_lint 五守卫 已接线）、close（close_invoke/self_check/acceptance/slug/status/review/graph_delta/kpi/experience/wiki_delta/wiki_promotion/pr_merged/hub_index 已接线） | 数据提取 |
| D6/assets/harness/discipline-coverage.yaml，:7-17 | 机械化率口径 | status 四级：mechanical（src 已接线）/ partial / prompt-only / not_wired（旧包机制名仅见「旧包史实」notes）；as_of_package_version "1.10.0" | 直接引用 |
| D6/assets/harness/discipline-coverage.yaml，:18-78 | gaps 台账 | 标记 WIKI-DELTA/G1/G3/SPEC-reviews/LIFECYCLE-ENGINE 为 closed；**G2（reviews 留档闸）、G4（思考轮结构）、C1/C2（22 审查文闸、HG-AUDIT-R1 pending 禁附 30）、INVOKE-HATS、FULL-reviews 为 not_wired**；G6/G7/N2-C deferred | 数据提取 |
| D6/assets/harness/discipline-coverage.yaml，:80-320 | statements | A1–A10（30 帽）、B1–B5（40 帽）、C1–C4（22 帽）、D1–D4（10 帽）、E1–E2（FRAGMENT_30）、F1–F3（TEMPLATE_invoke）、SK1–SK2（skills 封装）；多数带 src 锚点（如 src/cli.ts#430-511）标明是否已接线 | 数据提取 |

### D7：Agent Skills 封装族 —— `assets/skills/**`（6 个 SKILL.md 包 + references + README）

> skills/ 是 `harness/prompts/` 条文经 `skills build` 生成的**标准封装（生成物 · 勿手改）**；规范 agentskills.io。仅分发 6 个 Starter 帽（10-spec/10-task/20-spec-audit/20-task-audit/00-delegate-only/hat-reanchor）；执行帽 30/40 与 00 全文**不在默认分发**（须 `skills build --with-execute-hats` 仅供评测）。 — 来源：assets/skills/README.md，:1-37

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D7/assets/skills/README.md，:1-17 | 生成物性质 | 真值=harness/prompts/ 条文；改后重跑 build，`skills check` 拦 drift；安装落点 `.dsh/skills` / `$HOME/.dsh/skills`（DSH runtime 自动扫描，证据锚点 index.ts:246/253）；`.dsh/coding-kit` / `.coding-kit` 非 skill 目录 | 数据提取 |
| D7/assets/skills/README.md，:19-28 | 技能清单 | 6 个：harness-10-spec（起草/修订 SPEC+R0–R5）、harness-10-task（task 文件）、harness-20-spec-audit（SPEC 书面审→HG-SPEC-SIGNOFF）、harness-20-task-audit（task 书面审→HG-AUDIT-R1）、harness-00-delegate-only（有初稿只委派）、harness-hat-reanchor（长对话短身份） | 数据提取 |
| D7/assets/skills/README.md，:30-37 | 缺席说明 | 30/40 执行帽不在本分发（须过 T1 闸 `eval/t1_gate_bypass/`）；00-orchestrator 全文不在本分发（仅 prompts 同步）；delegate-only/re-anchor 短片段默认可分发 | 直接引用 |
| D7/assets/skills/harness-10-spec/SKILL.md，:1-46 | 10-spec 帽 | frontmatter hat_id=10-spec/track=starter；身份=SPEC 需求分析；只做范围/非范围/验收/failure_paths+R0–R5 思考轮回填；禁实现代码、禁代签 HG-SPEC-SIGNOFF/HG-AUDIT-R1 | 综合归纳 |
| D7/assets/skills/harness-10-task/SKILL.md，:1-44 | 10-task 帽 | hat_id=10-task；把目标写成可执行可验收 task；须预填 wiki_delta（批量拆 task 提醒 lint-wiki-delta 早检）；禁写绝对路径、禁签发 HG-AUDIT-R1 | 综合归纳 |
| D7/assets/skills/harness-20-spec-audit/SKILL.md，:1-40 | 20-spec-audit 帽 | hat_id=20-spec-audit；审 SPEC→HG-SPEC-SIGNOFF；须落盘 reviews/spec_<slug>_audit_R<n>；`verify --spec` 真闸本包已接线（v2.8+） | 综合归纳 |
| D7/assets/skills/harness-20-task-audit/SKILL.md，:1-46 | 20-task-audit 帽 | hat_id=20-task-audit（自 22-task-audit 改名）；审 task→HG-AUDIT-R1；须写 task_<slug>_audit_R<n>；HG-AUDIT-R1 pending 时禁附「下一棒 30」Prompt | 综合归纳 |
| D7/assets/skills/harness-00-delegate-only/SKILL.md，:1-20 | 00 delegate-only | hat_id=00/track=starter；已有初版 SPEC/task 且称 00 时禁亲自实现，只委派子 Agent；例外须用户明示写入 invoke notes | 综合归纳 |
| D7/assets/skills/harness-hat-reanchor/SKILL.md，:1-19 | hat-reanchor | hat_id=reanchor；上下文脏先读本片段（hat_id/task_slug/禁区），换帽须加载该帽 prompts 全文，机械闸走 CLI verify | 综合归纳 |
| D7/assets/skills/harness-20-task-audit/references/TEMPLATE_30_gate_stop.md，:1-31 | 30 拒开工模板 | HG pending 时首输出须为本形状，禁改业务码/禁落 30 invoke；pre-30 invoke 硬闸本包已接线；真值依据=task 人工闸表+`verify --task`（聊天不能替代 approved） | 综合归纳 |

### D8：Verify 与适配族 —— `assets/ci/samples/*`（8）+ `assets/ide/adapters/*`（4）+ `assets/docs/*`（4）

> Verify 三源：ci/samples（6 个 GitHub workflow 样例，复制为 .github/workflows/）、ide/adapters（3 个 IDE 入口片段，marker merge 手工嵌入）、docs/（4 个 POINTER 薄指针页，**未登记进资产地图却随 npm 包 assets 整目录分发**）。 — 来源：assets/ci/samples/README.md，:1-76；assets/ide/adapters/README.md，:1-58；assets/docs/POINTER_ONBOARDING.md，:1-9

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D8/assets/ci/samples/README.md，:1-15 | Verify 轨总览 | 复制到 `.github/workflows/`；6 样例：quality（Node/TS 三门禁）、pytest（Python）、tech-graph（可选·须自备 graph-compile.sh）、hgm-ingest（可选·continue-on-error）、lint-wiki-delta（≥2.18 须 wiki_delta·默认硬失败）、lint-wiki-delta.pin（有 pin 的仓·旧机制存档） | 数据提取 |
| D8/assets/ci/samples/README.md，:35-47 | setup-node 摩擦 | npx-only 样例须 `package-manager-cache: false`；质量三门禁先 `pnpm/action-setup` 再 `cache: pnpm`；勿把 npx-only 抄成开 cache 却没装 pnpm | 综合归纳 |
| D8/assets/ci/samples/quality.yml.example，:1-8 | quality 样例 | 前端：pnpm install --frozen-lockfile → lint → test → build；金样 POINTER ai-ink-brain | 数据提取 |
| D8/assets/ci/samples/pytest.yml.example，:1-8 | pytest 样例 | 后端：pytest tests -m "not intent_eval and not intent_benchmark"；CI dummy 环境变量禁写真实密钥 | 数据提取 |
| D8/assets/ci/samples/tech-graph.yml.example，:1-15 | tech-graph 样例 | 已接入 docs/_tech_graph + 业务仓自备 scripts/graph-compile.sh；kit 自身用源码仓 .github/workflows/tech-graph.yml（本仓 bin），不走本样例脚本 | 数据提取 |
| D8/assets/ci/samples/hgm-ingest.yml.example，:1-7 | hgm-ingest 样例 | 过程可观测，默认 continue-on-error: true；与 status --check / timeline 配合 | 数据提取 |
| D8/assets/ci/samples/lint-wiki-delta.yml.example，:1-6 | lint-wiki-delta 样例 | 默认硬失败；迁移中 continue-on-error；`--strict` 半迁勿开；有 pin 改用 .pin 样例 | 数据提取 |
| D8/assets/ci/samples/lint-wiki-delta.pin.yml.example，:1-9 | lint-wiki-delta.pin | 旧包 @cyning/harness pin 流程存档；本包未接线 harness.pin.json 读取；现行见 lint-wiki-delta.yml.example | 数据提取 |
| D8/assets/ci/samples/skills-validate.yml.example，:1-7 | skills-validate 样例 | v2.23+；skills check + skills-ref validate 校验器兜底；锁版本以官方仓库为准 | 数据提取 |
| D8/assets/ide/adapters/README.md，:1-12 | IDE 入口片段 | 单源 POINTER=docs/coding_wiki/+docs/standards/+AGENTS.md；3 片段：cursor-harness-starter.mdc（.cursor/rules/）、CLAUDE.md.fragment（仓根 CLAUDE.md）、AGENTS.md.fragment（仓根 AGENTS.md） | 数据提取 |
| D8/assets/ide/adapters/README.md，:13-35 | 安装/纪律 | 现行入口以 npx dsh-coding-kit 为准；init/upgrade 不写消费者 IDE 文件；用 refresh-ide-blocks 刷旧块（默认 dry-run）；marker merge `<!-- cyning-harness:begin/end -->`，local 块须在产品块外；graph_modules_path/FRAGMENT 替换链本包未接线 | 综合归纳 |
| D8/assets/ide/adapters/cursor-harness-starter.mdc.example，:1-39 | Cursor 片段 | frontmatter alwaysApply:true/globs **/*；执行 task 前读 docs/tasks/active、30 改码前 GATE_VERIFY（HG-AUDIT-R1/HG-GRAPH-MODULES pending→拒改码）；Verify 命令表（前端 pnpm/后端 pytest/iOS xcodebuild） | 综合归纳 |
| D8/assets/ide/adapters/CLAUDE.md.fragment.example，:1-32 | Claude 片段 | 同 Cursor 片段结构，嵌入仓根 CLAUDE.md（marker merge）；单源真值 docs/coding_wiki/+docs/standards/+AGENTS.md | 综合归纳 |
| D8/assets/ide/adapters/AGENTS.md.fragment.example，:1-33 | AGENTS 片段 | 通用 Agent 入口片段；GATE_VERIFY + 拒开工纪律 + Verify 命令表；完整库 POINTER 在工作区 docs/harness/prompts/ | 综合归纳 |
| D8/assets/docs/POINTER_SDD_HAT_FLOW.md，:1-8 | 薄指针·帽链 | 指向私仓 SDD_HAT_FLOW_v2_zh.md（10-spec→20-audit→30/40/50 帽链）；**自述「本文档不随 dsh-coding-kit 发布」（包内无 docs/ 正文体）** | 直接引用 |
| D8/assets/docs/POINTER_USER_GUIDE.md，:1-8 | 薄指针·用户指南 | 指向私仓 USER_GUIDE_v1.0_zh.md（Wiki 目录 vs 关系图、wiki_delta 决策树）；自述不随包发布 | 直接引用 |
| D8/assets/docs/POINTER_RUNBOOK_wiki_delta.md，:1-18 | 薄指针·运维手册 | 指向私仓 RUNBOOK_upgrade_wiki_delta_v1_zh.md（npm pack / GitHub raw 升级）；附诊断码表 wiki_delta_missing/wrong_section/invalid/path_missing + task lint E8 | 数据提取 |
| D8/assets/docs/POINTER_ONBOARDING.md，:1-9 | 薄指针·接入总入口 | 指向私仓 ONBOARDING.md（档位 S0–S3、五轨检查清单）；自述不随包发布；kit 自仓 dogfood docs/_tech_graph 不随 npm 发布 | 直接引用 |

### D9：源码族

> 17 个 `src/*.ts` 模块共 244,491 字节：`cli.ts`（CLI 主入口，37,022 B / 939 行，扁平 `if` 链把 argv 分派到 16 个一级命令）+ `index.ts`（插件入口，注册 `apply_coding_standards` / `init_coding_kit` 两个工具）+ 14 个 `cli-*` 领域模块 + `cli-shared.ts`（CLI 面公共基础设施）+ `yaml.ts`。**重大核查发现有二**：① 插件面（`index.ts`）与 CLI 面（`cli.ts` + `cli-*`）**零代码共享**，`packageRoot()` 等逻辑各自重写；② S2 过程域写保护在 4 个模块中有 **4 份彼此不同的硬编码定义**，无共享常量 — 来源：D9/src/

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D9/src/index.ts，§模块头（:8-13） | 插件入口元信息 | `export const name = 'coding-kit'`；`export const inject = ['tools', 'systemPrompt']`（声明依赖 cordis 的 tools 与 systemPrompt 两个服务）。常量：`CONTEXT_NAME = 'coding-kit.standards'`、`MAX_INJECT_CHARS = 24_000`、`S2_SKIP_PREFIXES = ['docs/tasks', 'reviews', 'invokes/by-task']` | 直接引用 |
| D9/src/index.ts，§S2_SKIP_PREFIXES + isS2Path（:13, :144-147） | S2 写保护实现（插件面） | 插件面 S2 判定用的三个前缀在代码里是 `docs/tasks` / `reviews` / `invokes/by-task`（相对 assets 根的路径），**并非** `docs/harness/reviews` / `docs/harness/invokes/by-task`。`isS2Path()` 用 `n === seg \|\| n.startsWith(seg + '/')` 精确前缀匹配，路径先做 `\\`→`/` 归一 | 数据提取 |
| D9/src/index.ts，§userOverrideRoot（:37-51） | override 根向上探测算法（DEF-017） | 从 `process.cwd()` 逐级向上：每层先探 `<dir>/.coding-kit` 与 `<dir>/.dsh/coding-kit` 两个候选（`.coding-kit` 优先），命中即返回；未命中则检查该层是否含 `.git`，含则**就地截止返回 undefined**（即 git root 自身仍会被探测，但不再向上越过 git root）；无 `.git` 时一路查到文件系统根 | 综合归纳 |
| D9/src/index.ts，§resolveReadRoot（:53-57） | 资产来源优先级 | override 命中 → `{root: override, source: 'override'}`；否则回落包内 `assets/`（`defaultAssetsRoot()` = `<packageRoot>/assets`，`packageRoot()` 由 `import.meta.url` 上溯一级得出，:26-33）→ `source: 'package'` | 综合归纳 |
| D9/src/index.ts，§includeForProfile（:79-88） | profile 过滤规则 | 仅 `standards/` 与 `coding_wiki/` 两个子树入选，其余一律排除。`profile === 'l1'` 且属 `standards/` 时，只保留路径含 `L1`、或以 `README.md` 结尾、或含 `SOURCES` 的文件；其他情况（`l1+l2`、`full`）全部保留 —— 故 **`full` 与 `l1+l2` 行为完全等价**，与工具参数描述 "full: currently equivalent to l1+l2, reserved for extended bundles"（:210）自述一致 | 综合归纳 |
| D9/src/index.ts，§loadMarkdownBundle（:115-134） | 24k 截断与文件边界处理 | 追加下一文件前先拼出 `candidate` 全文并预算长度，`candidate.length > MAX_INJECT_CHARS` 时置 `truncated = true` 并 **`break`**（终止整个循环，不是跳过当前文件继续尝试后续更小的文件）；被截断时在 markdown 末尾追加 `<!-- truncated at 24000 chars -->` 标记。返回的 `files` 只列**实际注入**的文件（`injectedFiles`），被略文件需由 root 全集相减推出（代码注释:116 明示此设计） | 综合归纳 |
| D9/src/index.ts，§listMarkdownFiles（:59-77） | 资产遍历规则 | 递归 walk，仅收 `.md` 文件；跳过 `node_modules` 及一切以 `.` 开头的目录；结果按 `localeCompare` 排序以保证注入顺序稳定 | 数据提取 |
| D9/src/index.ts，§copyDirNoClobber（:149-182） | init 的永不覆写语义 | 三重跳过：① `isS2Path(childRel)` 命中 → 记入 `skipped`；② 目标文件 `existsSync(to)` 已存在 → 记入 `skipped`（**no-clobber，永不覆写**）；③ `node_modules` 与点开头目录直接不递归。返回 `{copied, skipped}` 两个相对路径清单 | 综合归纳 |
| D9/src/index.ts，§apply（:195-303） | 插件面注册的工具 | `apply(ctx: Context)` 内 `ctx.tools.register(defineTool(...))` 共注册 **2 个工具**：`apply_coding_standards`（:200）与 `init_coding_kit`（:267）。闭包持有 `disposeContext`，重复调用时先 `disposeContext?.()` 再重新注册（:242-243），避免 systemPrompt context 叠加 | 综合归纳 |
| D9/src/index.ts，§apply_coding_standards（:206-263） | 工具契约与降级路径 | 参数 `profile`（enum `l1`/`l1+l2`/`full`，默认 `l1+l2`）、`persist`（bool，默认 true，判定写作 `args.persist !== false`）。持久化经 `systemPrompt.context({name: 'coding-kit.standards', order: 50, text})`。**降级**：`persist` 为真但 systemPrompt 服务不可用时，返回文字说明 + `bundle.markdown.slice(0, 4000)` 的一次性预览（:233-240）。零文件时返回 `no markdown files under <root>`（:228） | 综合归纳 |
| D9/src/index.ts，§init_coding_kit（:282-301） | 目标目录白名单 | `dest` 仅允许 `.coding-kit` 与 `.dsh/coding-kit`（enum + 运行期二次校验，不合法返回 `init_coding_kit: dest not allowed`）；默认 `.coding-kit`。源固定为包内 `assets/`（**不读 override**），缺失则报 `package assets not found at <src>`。输出中 skipped 清单只打印前 50 条（`.slice(0, 50)`，:298） | 综合归纳 |
| D9/src/index.ts，§maybeLegacyHint（:184-193） | 旧产品线兼容提示 | 探测 `<cwd>/.cyning-harness` 或 `<cwd>/docs/harness` 任一存在，则追加提示 `detected legacy cyning-harness layout; this plugin does not run verify/gate-check. See README.` —— 明确划清插件面**不承担** verify/gate-check 职责 | 直接引用 |
| D9/src/index.ts，§import（:1-6） | 外部依赖（插件面） | `@deepseek-ai/cordis` 仅作 **type-only** 引入（`import type { Context }`，:5，编译后擦除）；但 `@deepseek-ai/dsh-tools` 的 `defineTool` 是**顶层静态值导入**（:6），在 `index.ts` 被加载时即求值，**未见惰性/条件加载**。其余全为 node 内置（`node:fs`、`node:fs/promises`、`node:path`、`node:url`） | 综合归纳 |
| D9/src/index.ts vs D9/src/cli.ts，§import 段（index.ts:1-6 / cli.ts:1-40） | **两个面零代码共享（重大核查发现）** | `index.ts` 的 import 清单**不含任何** `./cli-*.ts` 或 `./yaml.ts`；`cli.ts` 及 15 个 `cli-*` 模块亦**不 import `./index.ts`**。即插件面与 CLI 面在源码层**完全不共享实现**：override 探测、S2 跳过、资产遍历等逻辑在 `index.ts` 内独立重写（如 `packageRoot()` 同名函数在 `index.ts:26` 与 `cli-shared.ts` 各有一份） | 综合归纳 |
| D9/src/*.ts，§全量 import 扫描 | 外部依赖面收敛结论 | `@deepseek-ai/cordis` 与 `@deepseek-ai/dsh-tools` 的 import **仅出现在 `index.ts`（:5-6）一处**，17 个模块中其余 16 个均无。故 CLI 面（`npx dsh-coding-kit`）运行路径完全不触碰这两个 optional peer；插件面则是顶层静态导入、无惰性包装。唯一运行时依赖 `js-yaml` 只被 `yaml.ts:4` 经 `createRequire` 引入，`cli-skills.ts:14`、`cli-lifecycle.ts:8`、`cli-graph-yaml.ts:4` 三处再转引 `yaml.ts`，无直接 `require('js-yaml')` 散落 | 综合归纳 |
| D9/src/cli-status.ts，§（:244） | 全项目唯一动态 import | `const { buildTaskTimeline, formatTimelineHuman } = await import('./cli-timeline.ts')` —— 全 `src/` 树仅此一处 `await import()` 惰性加载（`status` 命令按需拉起 timeline 逻辑）。其余模块间依赖均为顶层静态 import | 数据提取 |
| D9/src/cli.ts，§import 段（:5-40） | CLI 主入口的依赖扇出 | `cli.ts` 静态 import **9 个**兄弟模块：`cli-graph`（`cmdGraph`）、`cli-refresh-ide-blocks`（`cmdRefreshIdeBlocks`/`countStaleIdeLiterals`）、`cli-lifecycle`（`cmdDiscipline`/`cmdLifecycle`）、`cli-skills`（`cmdSkills`）、`cli-shared`（**16 个**符号，:9-25）、`cli-checks`（**9 个**符号，:26-36）、`cli-status`（`cmdStatus`/`cmdTimeline`）、`cli-sync`（`cmdSync`）、`cli-task-extra`（4 个符号）、`cli-wiki`（`cmdWiki`） | 数据提取 |
| D9/src/cli.ts，§CLOSE_GUARD_ORDER（:50-65） | close 守卫求值顺序常量 | 13 个守卫按固定顺序求值：`close_invoke` → `close_self_check` → `close_acceptance` → `close_slug` → `close_status` → `close_review` → `close_graph_delta` → `close_kpi` → `close_experience` → `close_wiki_delta` → `close_wiki_promotion` → `close_pr_merged` → `close_hub_index`。注释标注来源为「DEF-003 阶段二 T6 + PRD_DEF-003 后续棒 + doc-health」 | 直接引用 |
| D9/src/cli.ts，§VALID_PRESETS（:66-67） | init preset 词表 | `const VALID_PRESETS = ['harness-only'] as const` —— 当前**唯一**合法 preset；注释（DEF-013 D1）声明「新增 preset 须先扩展此常量」 | 直接引用 |
| D9/src/cli.ts，§usage（:76-109） | CLI 命令全集（帮助文本） | 帮助文本为**中文**（`用法:`）。列出的命令面：`--version/-V`、`--help/-h`、`init`、`upgrade`、`refresh-ide-blocks`、`check`、`verify`、`gate-check`、`audit`、`task lint`、`task close`、`status`、`timeline`、`lifecycle show`、`lifecycle dry-run`、`discipline show`、`graph yaml compile\|check\|export`、`graph ingest\|snapshot\|axioms`、`sync index`、`sync prompts`、`skills install`、`skills build`、`skills check`、`wiki export`、`task lint-done`、`task lint-wiki-delta`、`task check`。`task lint-wiki-delta` 就地文档化 4 个诊断码：`wiki_delta_missing`、`wiki_delta_wrong_section`（替代 missing，不双报）、`--strict` 追加 `wiki_delta_invalid` / `wiki_delta_path_missing` | 数据提取 |
| D9/src/cli.ts，§manifestPath / readManifest（:112-120） | manifest 落盘位置沿用旧名 | `manifestPath()` 返回 `<target>/.cyning-harness/manifest.json` —— 产品已更名为 kit，但 manifest 目录名仍是旧产品线的 `.cyning-harness`。`Manifest` 类型含 `version`/`preset`/`ide[]`/`from_version`（可 null）/`upgraded_at` 五字段（:42-48） | 综合归纳 |
| D9/src/cli.ts，§readPkgVersion（:69-74） | 版本号来源与测试后门 | 优先读环境变量 `process.env.HARNESS_VERSION`（存在即直接返回，供测试注入）；否则读 `<packageRoot>/package.json` 的 `version`，缺失回落字符串 `'unknown'` | 综合归纳 |
| D9/src/cli.ts，§nowUtc（:122-124） | 时间戳格式 | `new Date().toISOString()` 后用 `.replace(/\.\d{3}Z$/, 'Z')` 抹掉毫秒，统一为秒级 UTC 形态 | 直接引用 |
| D9/src/cli.ts，§版本比较器注释（:126-129） | 版本比较器的自陈限制 | 注释明示：数值三元组 `x.y.z` 比较，**不支持 pre-release 形态**（如 `1.2.2-beta.1`）；遇非纯数字段按「不等且方向未知」归 `-1`（维持旧版可升级提示）。DEF-030 引入 `isLegacyHarnessLineVersion()`（:130）识别旧包 `@cyning/harness` 的 2.x 版本形态；`from_version` 属 kit 线（1.x）时不算跨产品线迁移，回落「降级安装」语义 | 直接引用 |
| D9/src/cli.ts，§runCli（:842-918） | 命令分派机制 | 分派**不用表驱动、不用 `switch`**，而是 **16 个连续的 `if (cmd === '...') { await cmdX(rest); return }`** 扁平串联（:853-916）。前置短路：argv 为空或首参 `-h`/`--help` → `usage()` 返回；`argv.includes('--version')` 或 `-V` → 只打印版本号（注意是 `includes`，任意位置生效，而 `-h`/`--help` 只认 `argv[0]`）。兜底 `fail('未知命令: <cmd>\\n')`（:917）。`runCli` 以 `export async function` 导出，便于测试直接 import 调用 | 综合归纳 |
| D9/src/cli.ts，§runCli 分派表（:853-916） | 一级命令 → 实现模块的落点 | 就地实现于 `cli.ts` 的：`init`/`upgrade`/`check`/`audit`/`gate-check`/`verify`/`task`（`cmdInit`:147、`cmdUpgrade`:187、`cmdCheck`:230、`cmdAudit`:374、`cmdGateCheck`:322、`cmdVerify`:512、`cmdTask`:812）。委派给兄弟模块的：`refresh-ide-blocks`→`cli-refresh-ide-blocks`、`status`/`timeline`→`cli-status`、`lifecycle`/`discipline`→`cli-lifecycle`、`skills`→`cli-skills`、`sync`→`cli-sync`、`graph`→`cli-graph`、`wiki`→`cli-wiki`。即 **7 个一级命令留在 `cli.ts`，9 个外派** | 综合归纳 |
| D9/src/cli.ts，§cmdTask（:812-840） | task 子命令二级分派 | 同样是扁平 `if` 串：`lint`（→ 本文件 `cmdTaskLint`:647）、`close`（→ 本文件 `cmdTaskClose`:669）、`lint-done` / `lint-wiki-delta` / `check`（→ `cli-task-extra.ts`）。空子命令报 `task 子命令未知: (空)`，未知子命令报 `task 子命令未知: <sub>`，两者均附 `TASK_USAGE` | 综合归纳 |
| D9/src/cli.ts，§cli.ts 体量占比 | `cli.ts` 的上帝对象倾向（可核实事实） | `cli.ts` 为 37,022 字节（`ls -l`），全 `src/` 17 文件合计约 244KB，占比约 **15%**（非 40%）；但它是**唯一**同时承担「argv 解析 + 帮助文本 + 版本比较 + manifest 读写 + 7 个一级命令实现 + 2 级 task 分派 + 进程退出」的模块，全文 **939 行**、内含 **22 个** 顶层 `function`/`async function` 定义（:69-931）。`init`/`upgrade`/`check`/`verify`/`gate-check`/`audit`/`task lint`/`task close` 八项业务逻辑未外移到独立 `cli-*` 模块 | 数据提取 |
| D9/src/cli.ts，§isMain + 顶层守卫（:920-939） | 入口自举与退出码约定 | `isMain()` 先比对 `path.resolve(process.argv[1])` 与 `fileURLToPath(import.meta.url)` 全等；不等时**回落比较 basename**（:927，兼容 bin 软链/包装脚本），异常 catch 返回 false。顶层 `if (isMain())` 内 `runCli(process.argv.slice(2)).catch(...)`：有 `message` 则 `console.error` 输出，随后 `process.exit(typeof e.exitCode === 'number' ? e.exitCode : 1)` —— **退出码取自异常对象的 `exitCode`，缺省 1** | 综合归纳 |
| D9/src/cli-shared.ts，§CliError + fail（:5-12, :47-49） | 错误处理与退出码机制 | `class CliError extends Error` 携带只读 `exitCode`（构造默认 `1`），`name = 'CliError'`。`fail(message, exitCode = 1): never` 只做 `throw new CliError(...)` —— **不直接 `process.exit`**，退出码经异常冒泡到 `cli.ts:937` 统一落地。这是全项目统一的失败出口（15 个模块中 `cli-sync`/`cli-skills`/`cli-timeline`/`cli-wiki`/`cli-lifecycle`/`cli-refresh-ide-blocks`/`cli-graph` 均 import `fail`） | 综合归纳 |
| D9/src/cli-shared.ts，§takeOption（:36-45） | 选项解析实现 | 手写极简解析：`args.indexOf(name)` 找旗标，取其**后一个**元素为值，返回 `{value, rest}`（rest 为剔除该对后的数组）。索引越界或未找到返回 `{value: undefined, rest: args}`。**不支持 `--opt=value` 形态、不支持短选项合并**，未引入任何命令行解析库 | 综合归纳 |
| D9/src/cli-shared.ts，§正则常量（:22-26, :98-99） | 任务文档解析的正则口径 | `STATUS_RE = /\*\*状态\*\*：?\s*`?([a-z_]+)/i`；`META_TICK_RE` / `META_PLAIN_RE` 解析 `\| **键** \| 值 \|` 两种单元格形态（反引号包裹优先）；`GATE_ROW_RE` 解析人工闸表行。全部基于**正则 + 逐行扫描**解析 Markdown，未引入 Markdown AST 解析器 | 综合归纳 |
| D9/src/cli-shared.ts，§parseHarnessMeta（:72-91） | 元信息节的权威口径 | 只认 `## Harness 元信息` 节，节域止于下一个 `###`（`extractSection(content, '## Harness 元信息', '###')`）。跳过表头行（`key === '字段'`）与分隔行（`/^[-:\s]+$/`）；同键**先到先得**（`if (!(key in meta))`） | 综合归纳 |
| D9/src/cli-shared.ts，§findWikiDeltaOutsideMetaSection（:93-127） | 错节诊断 helper（K1） | 注释自陈「诊断非兼容」：`parseHarnessMeta` 的权威节名不改，本 helper 仅在解析落空时全文找「写在其他节的 `wiki_delta` 行」。`WIKI_DELTA_ROW_RE` 要求 key 单元格恰为 `wiki_delta`（避免误伤 `wiki_delta_note`）。节域判定与 `extractSection` 同口径：`level >= 3` 标题才退出 meta 节，**后继 `##` 节仍算在 meta 节域内**（:117-119 注释明示是为与解析器一致、避免误报）。注释同时登记了已知缺陷：启发式**可能命中正文代码块中的示例**（`residual_risk 已登记`），故诊断 detail 带行号供人判 | 综合归纳 |
| D9/src/cli-shared.ts，§evaluateMayStart30（:151-165） | may_start 30 判定规则 | 三闸串联：`HG-AUDIT-R1` 状态非 `approved` → 拒（reason `HG-AUDIT-R1 pending`）；`HG-TASK-DRAFT` 存在且非 approved 且其 `blocksHats` 含 `'30'` → 拒；`HG-GRAPH-MODULES` 状态恰为 `pending` → 拒。三者皆过返回 `{ok: true, reason: null}`。注意三闸判定条件不同构（分别为「非 approved」「非 approved 且 blocks 含 30」「恰为 pending」） | 综合归纳 |
| D9/src/cli-shared.ts，§extractTaskSlug / normalizeSlug（:167-177） | slug 归一化链 | `extractTaskSlug`：去 `.md` → 去 `task_`/`done_` 前缀 → 去尾部 `_YYYYMMDD` 或 `_YYYY-MM-DD` → 去尾部 `_vN`。`normalizeSlug`：`_` 全量替换为 `-` | 数据提取 |
| D9/src/cli-shared.ts，§buildDoneSnapshot + canonicalHarnessMetaSection（:203-241） | done 快照三级兜底（K5，拟 1.8.0） | 一级：摘录归档文件真实 `## Harness 元信息` 节原文（注释 R2 口径：「归档真值摘录 > 静态模板，防模板漂移」）。二级：取不到则读包内 `assets/harness/templates/TASK_TEMPLATE.md` 的 canonical 节 + 置 `warn`。三级：模板亦不可读则用硬编码常量 `CANONICAL_META_FALLBACK`（:215-216）。注释明示消费时机：**仅在真归档（`renameSync` 已执行 · CLOSE: PASS）后消费**，READY/dry-run（含豁免）不消费 —— 「快照存在性唯绑归档事件，与豁免旗标无关（20 审 R2 口径裁决）」 | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§文件头（:1-3） | R-07 模块的分层声明 | 头注释声明 `R-07：消费者仓 IDE marker 块旧命令字面自动刷写`，SPEC 指针 `docs/spec/self-tech-graph/reference/POINTERS.md#R07`，四层分工：`T1 parseBlocks（§3 纯函数）→ T2 rewriteBody（§4 映射表）→ T3 拒写闸/备份（§6）→ T4 命令与报告（§5）`。是全项目注释与 SPEC 章节号绑定最紧的模块 | 直接引用 |
| D9/src/cli-refresh-ide-blocks.ts，§parseBlocks（:22-98） | marker 块解析器（T1） | 四个正则整行精确匹配 `<!-- cyning-harness:begin/end -->` 与 `<!-- cyning-harness-local:begin/end -->`（§3.1 口径：仅 HTML 注释、大小写敏感、无属性、独立行）。栈式（实为三态机 `outside`/`product`/`local`）顺序扫描，**任一畸形 → 整文件 MALFORMED，不做 salvage**。4 种畸形码：`unclosed_begin`、`unmatched_end`、`nested_begin`、`local_inside_product` | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§discoverIdeFiles（:101-114） | IDE 文件发现白名单（冻结） | 仅三类：`AGENTS.md`、`CLAUDE.md`（target 根下）、以及 `.cursor/rules/*.mdc`（需 `statSync` 确认是目录/文件）。结果 `.sort()` 保证顺序确定。**白名单外文件一律不处理** | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§A 组映射表（:123-128） | R-07 映射表 · A 组（自动改写） | A1–A3 合并为一条正则 `A_NPX_RE = /npx( --yes)? @cyning\/harness(@[0-9][^\s")']*)?(?![\w/@-])/g`，**前缀级替换不校验子命令**；按捕获组分流规则号：有 `--yes` → **A3**，否则有版本 pin → **A2**，否则 → **A1**。A4 为裸 bin 形态 `A4_RE = /(?<![\w./-])harness skills (build\|check)\b/g`。改写目标字面 `CURRENT_NPX = 'npx dsh-coding-kit'` | 数据提取 |
| D9/src/cli-refresh-ide-blocks.ts，§B 组检出正则（:130-136） | R-07 映射表 · B 组（仅报告不改写） | 5 条：`B1 = /CYNING_HARNESS/g`（环境变量残留）、`B2 = /--with-scripts/g`（废弃旗标）、`B3 = /wizard\/…/g`、`B4 = /harness:[A-Za-z][\w-]*/g`（旧 npm script 冒号形态）、`B5` 由 `B5_PKG_RE = /@cyning\/harness/g` 与 `B5_BARE_RE = /harness [a-z][a-z0-9-]*/g` **两条计数相加**（:196）。B3/B4/B5_BARE 均带 `(?<![\w./:-])` 负向后视避免误伤 | 数据提取 |
| D9/src/cli-refresh-ide-blocks.ts，§rewriteBody（:161-199） | A 组掩蔽机制（防重复计数） | 关键设计：先用 `maskSameLength`（等长空格替换，:156-158）把 A 组命中处**掩蔽**，B 组一律在「A 组掩蔽后」的文本 `masked2` 上检出（:187 `countOf` 只作用于 `masked2`），从而避免同一处 `@cyning/harness` 既算 A 又算 B5。A4 逐行处理并**同步把命中掩蔽进 `maskedLines`**（:178）以供 B5 排除 | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§rewriteBody A4 防二刷（:175-180） | 幂等保护 | A4 替换前检查 `line.slice(0, offset).includes(CURRENT_NPX)` —— 若该行命中位置**之前**已含 `npx dsh-coding-kit`，则原样返回不改（§4.1 注释标为「防二刷」），避免刷成 `npx dsh-coding-kit skills build` 后再被当作裸 bin 二次改写 | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§FileStatus / scanIdeFile（:203-294） | 单文件状态机与 MIXED 判定 | 4 个状态：`ok` / `mixed` / `malformed` / `skipped_local`。判定顺序：畸形优先早退（:239-242）→ **0 product 块**走 DEF-029 只读分支早退（:245-253，有 local 块则状态记 `skipped_local`）→ 否则逐 product 块改写。`mixed` 需**同时** `aHits > 0 && hasCurrent`（:288），即块内既有旧字面又已有现行字面。MIXED 行号必须在**替换前的原始行**上采集（:275 注释：替换后必然含 `CURRENT_NPX`，会假阳性） | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§DEF-029 只读分支（:205-206, :243-252） | 无 marker 文件的只读检出 | DEF-029：0 product 块的文件做**整文只读扫描**，复用 `rewriteBody` 纯函数取 A/B 组命中计数，产出 `plainMentions`，但**返回的改写文本直接丢弃、`newText` 不赋值**（注释:244 明示「写盘路径结构上不含这些文件」）—— 以数据结构缺省而非旗标判断来保证绝不改写 | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§S2_RE + assertNotS2（:298-306） | **S2 写保护（CLI 面）与插件面口径不一致（重大核查发现）** | 此处 `S2_RE = /(^\|[\\/])docs[\\/](tasks\|harness[\\/]reviews\|harness[\\/]invokes[\\/]by-task)([\\/]\|$)/`，即完整三路径 `docs/tasks` · `docs/harness/reviews` · `docs/harness/invokes/by-task`（注释标「真值 SPEC 1.2.2 #286」），且**兼容 Windows 反斜杠**。与 `index.ts:13` 的 `['docs/tasks', 'reviews', 'invokes/by-task']` **字面不同**。命中即 `fail(..., 2)` —— **专用退出码 2**（区别于通用失败 1） | 数据提取 |
| D9/src/cli-refresh-ide-blocks.ts，§gitState（:308-320） | preflight · git 工作区状态 | `execFileSync('git', ['-C', target, 'status', '--porcelain'])` 三态判定：输出非空 → `dirty`，空 → `clean`，**抛异常（无 git / 非仓库）→ `none`**（catch 吞掉，不失败）。`stdio` 全设 `pipe` 避免污染 CLI 输出 | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§备份机制（:322-330） | 写盘前备份（§6.5） | `BACKUP_KEEP = 5`（注释「§12 裁定：备份维持 5 代」）。备份根 `<target>/.cyning-harness/backups/refresh-ide-blocks/`，按 `<UTCts>/<相对路径>` 分代存放，写盘前**原字节复制**（`copyFileSync`）。此处再次沿用旧产品线目录名 `.cyning-harness` | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§cmdRefreshIdeBlocks preflight（:473-492） | R-07 preflight 四道 fail-fast 闸 | **仅 `--yes`（apply）路径**执行，顺序为：① 逐个待写文件 `assertNotS2()`；② `git === 'dirty'` → 拒写（提示先 commit/stash，附核查命令）；③ 存在 `malformed` 文件 → 拒写（附 `<path>: <标签>@L<行号>` 明细）；④ 存在 `mixed` 文件 → 拒写（附现行字面行号，理由「部分手迁迹象」）。**四闸全过才进写盘阶段**，退出码统一为 **2**。`--dry-run` 路径完全不走 preflight | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§cmdRefreshIdeBlocks（:454-463） | 参数互斥与严格校验 | `--yes` 与 `--dry-run` **不可同现**（:457，退出码 1）。剔除三个布尔旗标与 `--target` 后，`rest` **非空即报未知参数**（:461）—— 严格拒绝多余参数，不静默忽略。target 不存在亦 fail(1) | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§写盘阶段（:497-523） | 三步安全写盘 | 顺序：`backupFile()` 原字节备份 → `atomicWrite()` **tmp+rename 原子写**（tmp 名含 `process.pid` 防并发撞名，:338-342）→ 全部写完后 `pruneBackups()` 保留最近 5 代（按目录名 `.sort()` 后删除超出部分，:345-354）。备份代目录名为 ISO 时间戳把 `:` 与 `.` 换成 `-`（:501） | 综合归纳 |
| D9/src/cli-refresh-ide-blocks.ts，§Report（:360-390） | JSON 报告 schema 与兼容策略 | `REPORT_SCHEMA = 'dsh-coding-kit/refresh-ide-blocks-report@1'`。注释（:358-359）声明 DEF-029 的兼容策略：**schema 版本号保持 `@1`**，1.5.2 起新增的 top-level `plain_mentions[]` 与 `totals.plain_mentions` 属「仅追加字段、不改既有字段语义」的向后兼容增量，旧消费者忽略新字段即可。`exit` 字段类型被硬约束为字面量 `0` | 直接引用 |
| D9/src/cli-refresh-ide-blocks.ts，§DEF-029 报告（:435-443, :525-528） | 无 marker 检出不影响判定 | 注释两处明示：`plain_mentions` 命中**不触发 preflight fail-fast**、**不影响 exit 码**，dry-run 与 `--yes` 两种模式均照常报告。人类报告中单列「无 marker 检出（仅报告，不刷写）」段 | 直接引用 |
| D9/src/cli-refresh-ide-blocks.ts，§A_LABEL / B_LABEL（:392-404） | 规则的人类可读标签 | A 组 4 条标签含改写方向，其中 A2 特别标注「（钉版丢弃）」—— 即 `@cyning/harness@1.2.3` 改写后**版本 pin 被丢弃**（对应 `RewriteHit.dropped_pin` 字段与报告中 `（dropped_pin）` 后缀，:423）。B 组 5 条标签**一律以「需人工删改」结尾**，明确不自动处理 | 数据提取 |
| D9/src/cli-refresh-ide-blocks.ts，§printHumanReport 回滚提示（:446） | 回滚面说明 | 固定输出：`回滚: git checkout -- <path>（干净树 preflight 保证 git 可用时 diff 即回滚面）；非 git 仓以备份 cp 回（.cyning-harness/backups/refresh-ide-blocks/）`。另在 `git === 'none'` 且有待写文件时预先打印警告（:493-495） | 直接引用 |
| D9/src/cli-refresh-ide-blocks.ts，§countStaleIdeLiterals（:551-559） | upgrade 内嵌的只读探针 | 供 `cmdUpgrade` 的 dry-run 提示使用，注释声明契约「**永不抛错 · 不读写 manifest · 不写任何文件**」；实现为双层 `try/catch` 包裹（外层整体、内层逐文件），只累加 A 组 `rewrites` 计数。这是 `cli.ts` 与 R-07 模块之间的唯一非命令级耦合点 | 综合归纳 |
| D9/src/cli-checks.ts，§hasTestArtifacts（:698-733） | **D5 测试制品探测实现位置与三级判定** | 收紧后的 D5 探测（DEF-014）分三级，任一命中即 true：① **强信号探针**（13 项 `existsSync`，:700-714）：目录 `test`/`tests`/`spec`/`specs`/`__tests__` + 配置文件 `jest.config.{js,ts}`/`vitest.config.{js,ts}`/`playwright.config.{js,ts}`/`cypress.config.js`/`pytest.ini`；② **测试文件名扫描**：`walkFiles(target, 3, ...)`（**深度上限 3 层**）后按 `/\.(test\|spec)\.(js\|ts\|mjs\|cjs)$\|_test\.py$\|^test_.*\.py$/` 匹配 basename；③ **CI 含 test 步骤**：读 `.github/workflows/*.{yml,yaml}` 逐个匹配 | 综合归纳 |
| D9/src/cli-checks.ts，§CI_TEST_STEP_PATTERNS（:670-684） | D5 的 CI 测试步骤词表 | 12 条正则：`pytest`、`vitest`、`jest`、`npm (run )?test`、`pnpm (run )?test`、`yarn test`、`node --test`、`go test`、`cargo test`、`tox`、`unittest`，以及兜底的 `^\s*-?\s*name\s*:.*\btest\b`（步骤名含 test，多行+忽略大小写）。覆盖 JS/Python/Go/Rust 四语言生态 | 数据提取 |
| D9/src/cli-checks.ts，§runTestCheck（:735-757） | D5 触发条件与 1.5.0 硬化 | **仅当** task 元信息 `test_strategy` 恰为 `required` 才做强检查；未指定 `--task`、task 文件不存在、或 `test_strategy` 非 `required`（含 unset）**一律放行**（ok: true，附跳过原因）。注释（:735-736）明示 1.5.0 硬化：DEF-014 过渡结束，**旧启发式（`pyproject.toml` / `setup.py` / 任意 workflow 存在）不再放行**，新探测失败即 FAIL，对应 **verify BLOCKED exit 2 · audit FAIL exit 2** | 综合归纳 |
| D9/src/cli-checks.ts，§walkFiles（:650-668） | 遍历的健壮性处理 | 深度参数递减、`depth < 0` 早退；跳过 `node_modules` 与点开头项；`readdirSync` 与 `statSync` 各自 `try/catch` 包裹（注释:665「忽略瞬时文件」）—— 遍历过程中文件被删不会导致命令崩溃 | 综合归纳 |
| D9/src/cli-checks.ts，§INVOKE_DIR_CANDIDATES / INVOKE_HAT_TOKENS（:17-18） | invoke 目录双候选与帽子词表 | `INVOKE_DIR_CANDIDATES = ['docs/harness/invokes/by-task', 'invokes/by-task']` —— 同时支持带 `docs/harness` 前缀与裸形态两种布局。`INVOKE_HAT_TOKENS` 为 8 个合法帽子：`10`/`20`/`22`/`30`/`40`/`50`/`00`/`close` | 数据提取 |
| D9/src/cli-checks.ts，§evalClose* 家族（:129-479） | close 守卫的实现位置 | `cli-checks.ts` 内以 `evalCloseXxx(absTask, content) → CloseGuardOutcome` 统一签名实现各守卫：`evalCloseSlug`:129、`evalCloseSelfCheck`:142、`evalCloseAcceptance`:155、`evalCloseStatus`:168、`evalCloseInvokeHats`:179、`evalCloseReview`:194、`evalCloseGraphDelta`:206、`evalCloseKpi`:230、`evalCloseExperience`:254、`evalCloseWikiDelta`:286、`evalCloseWikiPromotion`:322、`evalClosePrMerged`:436、`evalCloseHubIndex`:458，由 `evalCloseGuard`:498 统一分派。与 `cli.ts:51-65` 的 `CLOSE_GUARD_ORDER` 13 项**一一对应** | 综合归纳 |
| D9/src/cli-checks.ts，§evalCloseKpi（:224-252） | KPI 守卫的三种可接受形态 | 三条正则任一命中即 pass：`KPI_TASK_SCORE_RE`（`Task_KPI%: N`，支持小数）、`KPI_D_TABLE_RE`（`\| D[1-5] \|` 表行）、`KPI_FOUR_DIM_CELL_RE`（四维 1–5 评分格）。失败提示同时告知 `--allow-kpi-gap` 豁免旗标（:248） | 综合归纳 |
| D9/src/cli-checks.ts，§ABS_PATH_RE（:543） | 绝对路径泄漏检查 | `/(\/(?:Users\|home\|root)\/[^\s/`\\]\|[A-Za-z]:\\Users\\[^\s`\\])/` —— 同时覆盖 macOS/Linux（`/Users`、`/home`、`/root`）与 Windows（`C:\Users\`）形态，用于 lint 阻止任务文档写入本机绝对路径 | 数据提取 |
| D9/src/cli-checks.ts，§import（:1-14） | 依赖构成与重复实现 | `cli-checks.ts` 为全项目**最大模块**（35,030 字节）。用 `spawnSync`（`node:child_process`:1）；从 `cli-shared.ts` import 8 个符号（:4-13）；并从 `cli-task-extra.ts` import `WIKI_DELTA_LITERALS` / `WIKI_DELTA_PATHISH_RE`（:14）。注意它**另有一份私有 `escapeRegExp`**（:481），与 `cli-shared.ts:51` 的同名私有函数重复实现（后者未导出，故无法复用） | 综合归纳 |
| D9/src/cli-checks.ts，§单一实现源声明（:16-20） | invoke hats 检查的复用意图 | 注释（DEF-003 阶段二 T5/T6）声明本处为「invoke hats 检查**单一实现源**」，供 `verify` pre-30 硬闸与 `task close` 帽集合覆盖**共用**。`export const PRE30_HATS = ['10', '20', '00']`，来源标注 `FRAGMENT_30_gate_verify_v1_zh.md：required ∩ {10,20,00}` | 直接引用 |
| D9/src/cli-graph.ts，§cmdGraph（:19-52） | graph 命令的分层结构 | `cli-graph.ts` 是**纯路由/接线层**（7,206 字节，最小的 `cli-*` 命令模块），自身不含图算法：四个子命令 `yaml` / `ingest` / `snapshot` / `axioms` 分派到 `cmdGraphYaml`:54、`cmdGraphIngest`:149、`cmdGraphSnapshot`:166、`cmdGraphAxioms`:181。实现分居两个模块：**YAML 三件套** → `cli-graph-yaml.ts`（`compileGraph`/`checkGraph`/`exportGraphJson`/`allGraphIds`/`resolveGraphJsonPath`/`GraphYamlError`，:3-10）；**HGM** → `cli-graph-hgm.ts`（`buildSnapshot`/`checkAxioms`/`ingestRepoIdempotent`/`loadEvents`/`writeSnapshot`，:11-17） | 综合归纳 |
| D9/src/cli-graph.ts，§cmdGraphYaml（:54-147） | graph yaml 三件套的参数面 | 三动作 `compile` / `check` / `export`，非此三者即 fail。默认输入根 `<target>/docs/_tech_graph`（:77）。`compile` 支持 `--graph-id ID` 或 `--all`（`--all` 时遍历 `allGraphIds()`，零命中打印「未找到 *.graph.yaml」并正常返回）。`check --all` 逐个比对，用 `failed` 标志**收集全部差异后**才 `fail('graph yaml check 发现差异')`（:122-131，不中途短路）。`export` **互斥拒绝** `--all` / `--graph-id`（:79） | 综合归纳 |
| D9/src/cli-graph.ts，§GraphYamlError 处理（:85-91, :140-146） | 领域异常的转译约定 | 两处相同模式：catch 到 `GraphYamlError` 时先 `console.error(err.message)` 打印详情，再 `fail('', 1)` —— **传空消息**避免 `cli.ts:936` 二次打印同一条错误；非 `GraphYamlError` 则原样 `throw` 冒泡 | 综合归纳 |
| D9/src/cli-graph.ts，§cmdGraphIngest（:149-164） | ingest 的幂等与默认值 | 调用 `ingestRepoIdempotent(target, { actor: actor \|\| 'system', source: 'cli', dryRun })` —— actor 缺省 `'system'`，source 硬编码 `'cli'`。输出「新事件 / 跳过（已存在）」两个计数，`--dry-run` 时追加 `mode: dry-run（未写入）` | 数据提取 |
| D9/src/cli-graph.ts，§cmdGraphAxioms（:181-203） | axioms 检查的退出码 | `graph axioms` 仅接受 `check` 动作。流程固定为 `loadEvents` → `buildSnapshot` → `checkAxioms(snapshot, events)`。人类模式打印 `axioms: PASS/FAIL` + violations 列表（格式 `[<axiom>/<severity>] <message>`）；`--json` 输出 `JSON.stringify(result, null, 2)`。**失败退出码 2**（`fail('HGM axioms 未通过', 2)`，:202） | 综合归纳 |
| D9/src/cli-graph-hgm.ts，§常量与落盘布局（:5-7, :37-49） | HGM 事件存储布局 | `HGM_DIR = '.cyning-harness'`（第三处沿用旧产品线目录名）、`EVENTS_DIR = 'events'`、`SNAPSHOT_FILE = 'graph/snapshot.json'`。事件按**月分片**存放（`eventsFileForMonth()`，:41），快照写 `<target>/.cyning-harness/graph/snapshot.json`，落盘用 `JSON.stringify(snapshot, null, 2)` + 末尾换行（:392） | 综合归纳 |
| D9/src/cli-graph-hgm.ts，§checkAxioms（:329-387） | HGM 公理检查的 4 条规则与严重度 | 四类违规：**D2**（`severity: error`）HumanGate 状态 pending 且有 `BLOCKS` 边的 `hat_id` 含 `30`；**D3**（`severity: warn`）task 投影状态 `in_progress` 但无 `CHECKED` 且 `exit_code === 0` 的入边；**RejectedToDraft**（由 `checkRejectedToDraft()`:292 产出，`error`）；**S2**（`error`）`SYNCED` 边的 `files_touched` 命中 S2 前缀。判定口径：`ok = violations.filter(v => v.severity === 'error').length === 0` —— **`warn` 不影响 ok**（:384），故 D3 违规不会导致命令失败 | 综合归纳 |
| D9/src/cli-graph-hgm.ts，§checkAxioms S2 前缀（:367） | **S2 前缀的第三种定义（重大核查发现）** | 此处 `s2Prefixes` 为**五元并集**：`docs/tasks/`、`reviews/`、`invokes/by-task/`、`docs/harness/reviews/`、`docs/harness/invokes/by-task/` —— 即同时容纳 `index.ts:13` 的裸形态与 `cli-refresh-ide-blocks.ts:299` 的带前缀形态。全项目 S2 保护域因此有**三份彼此不同的字面定义**（index.ts 三项裸形态 / refresh 三项带前缀 / hgm 五项并集），且三者均为各自模块内独立硬编码，无共享常量 | 数据提取 |
| D9/src/cli-graph-hgm.ts，§idempotencyKey（:396-404） | ingest 幂等键设计（DEF-015 T4/D1） | 键形态 `type:subject[:状态摘要]`：`GateStatusChanged` 追加 `data.new_status`，`TaskCreated` 追加 `data.status`，其余无状态事件（如 `RepositoryAdopted`）保持**两段键**。注释明示迁移口径：「旧两段键事件保留不重写，新键自变更点生效；状态变化后重跑 ingest 会补发新事件」 | 直接引用 |
| D9/src/cli-graph-hgm.ts，§ingestRepoIdempotent（:406-418） | 幂等 ingest 的实现手法 | 先 `loadEvents` 建已有键集合，再**强制以 `dryRun: true` 调用 `ingestRepo`**（:412，覆盖调用方传入值）取候选事件，按幂等键差集得 `newEvents`；仅当调用方 `options.dryRun` 为假时才逐条 `appendEvent`。返回 `skipped = count - newEvents.length` | 综合归纳 |
| D9/src/cli-graph-hgm.ts，§HgmError（:9-14） | 领域异常 | 与 `cli-graph-yaml.ts` 的 `GraphYamlError`、`cli-shared.ts` 的 `CliError` 并列，构成三个独立异常类；`cli-graph-hgm.ts` **不 import `fail`**（仅 import `parseHumanGates`），失败靠抛 `HgmError` 或返回结果对象 | 综合归纳 |
| D9/src/cli-graph-hgm.ts，§summarizeTaskHgm（:443-453） | 跨模块复用点 | 被 `cli-status.ts:18` import，用于 `status` 命令输出任务的 `event_count` / `last_at`；两字段均可为 `null`（无事件时）。这是 HGM 模块唯一被非 graph 命令消费的出口 | 综合归纳 |
| D9/src/cli-graph-yaml.ts，§常量（:6-8） | 图 schema 与冻结标识 | `export const SCHEMA_VERSION = 'inform_graph.v3'`；`FREEZE_ID = 'TECH_GRAPH_S2_FREEZE_20260519_V2_3'`（冻结基线标识）；`DEFAULT_SKIP_DIRS = new Set(['node_modules', '.git', 'shared'])` —— 遍历图源时默认跳过，其中 `shared` 可由 `includeShared` 选项放开（:124） | 数据提取 |
| D9/src/cli-graph-yaml.ts，§validateGraphYaml（:53-120） | 图 YAML 校验规则全集 | **收集式**校验（返回 `string[]` 全部错误，不抛不短路）。必填 4 字段 `graph_id`/`title`/`nodes`/`edges`。`schema_version` 不等于 `inform_graph.v3` 时报「建议为」（措辞为建议，但仍进 errors 数组）。id 正则：`graph_id` 须 `/^[a-zA-Z0-9_]+$/`（**禁 `/`**），节点 `id` 须 `/^[a-zA-Z_][a-zA-Z0-9_]*$/`（不得数字开头）。节点查重 `seen` Set；`kind` 三选一 `flow`/`struct`/`external`。边校验 `from`/`to` 必填且**必须引用已声明节点**；`anchors` 若存在须为 array 且每项含 `path`。有 filePath 时给所有错误加 `<filePath>: ` 前缀（:118） | 综合归纳 |
| D9/src/cli-graph-yaml.ts，§validateGraphYaml 注释（:66-67） | graph_id 双口径（DEF-032③） | 注释明示：**声明值 `data.graph_id` 为唯一真值源，须为裸 slug（禁 `/`）**；而路径命名空间 id（如 `l0/00_main`）**仅作输入兼容定位**（供 `allGraphIds` 与 `--graph-id` 使用），**不参与校验与输出**。即同一个「graph_id」概念在输入定位与输出真值两处口径不同 | 直接引用 |
| D9/src/cli-graph-yaml.ts，§contentStamp / stampYamlCorpus（:188-199） | 内容指纹机制 | 用 `node:crypto` 的 `createHash`（:1）对 YAML 语料计算内容戳，`stampYamlCorpus(inputRoot, graphIds)` 汇总多图指纹 —— 用于 compile 产物的漂移检测（对应测试 `cli-graph-yaml-stamp.test.ts`） | 综合归纳 |
| D9/src/cli-graph-yaml.ts，§generate* 家族（:349-514） | Markdown 产物生成流水线 | `compileGraph`（:516）编排六个生成器：`generateMermaid`（:372，含 `escapeMermaidText`:365 转义）、`generateNodeTable`（:430）、`generateEdgeTable`（:439）、`generateNotesSection`（:456）、`generateSubGraphLinks`（:466）、`formatAnchorComment`（:349），最终由 `generateMarkdown`（:478）拼装。产物路径 `mdPathFor()`（:173），源路径 `yamlPathFor()`（:169） | 综合归纳 |
| D9/src/cli-graph-yaml.ts，§checkGraph / loadGraphJson（:532-543） | check 的比对对象 | `checkGraph(graphId, inputRoot, graphJsonPath)` 把 YAML 编译结果与既有 `graph.json` 的对应 slice 比对，返回 `{ ok, diff }`（`cli-graph.ts:135` 输出 `OK: YAML matches graph.json <id> slice`）。`loadGraphJson` 可返回 `null`（文件不存在时容错） | 综合归纳 |
| D9/src/cli-skills.ts，§isS2Dest（:272-283） | **S2 前缀的第四种定义（重大核查发现）** | 又一份独立硬编码：判 `/docs/tasks`、`/invokes/by-task`、`/reviews` 三类（各含 `endsWith` 与 `includes` 两种形态），且**开头有白名单例外**：路径落在 `/.dsh/skills` 下时**直接返回 false**（:274，即 `.dsh/skills` 内允许写）。其中 `/reviews` 无 `docs/harness` 限定，匹配面比 `cli-refresh-ide-blocks.ts:299` 宽 —— 任何名为 `reviews` 的目录都会被拒写。至此全项目 S2 判定共 **4 份不同实现**（index.ts / cli-refresh-ide-blocks.ts / cli-graph-hgm.ts / cli-skills.ts） | 数据提取 |
| D9/src/cli-skills.ts，§EXECUTE_TRACK / isExecuteHatSkipped（:16, :256, :285-296） | 执行帽技能的双重排除机制 | `export const EXECUTE_TRACK = 'starter-experimental'`；`EXECUTE_HAT_DIRS = new Set(['harness-30-execute', 'harness-40-self-check'])`。不带 `--with-execute-hats` 时**两条判据任一命中即跳过**：① 目录名在 `EXECUTE_HAT_DIRS` 内（硬编码名单）；② 读该目录 `SKILL.md` 的 frontmatter，`metadata.track === 'starter-experimental'`（声明式）。即目录名与 frontmatter 声明构成冗余双保险 | 综合归纳 |
| D9/src/cli-skills.ts，§正则常量（:17-20） | 技能资源引用与命名口径 | `RESOURCE_RE` 抓 `FRAGMENT_*.md` / `TEMPLATE_*.md` 资源名（带负向后视避免误伤）；`MD_LINK_RE` 抓 `](./FRAGMENT_xxx.md)` 形态的相对链接（供 `rewriteLinks`:93 改写）；`NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/` 约束技能名为 kebab-case；`FRONTMATTER_RE` 以 `---\n…\n---\n` 切分 YAML frontmatter 与正文 | 数据提取 |
| D9/src/cli-skills.ts，§三个子命令（:156-244, :343, :417） | skills 命令族职责 | `install`（`cmdSkillsInstall`:343，同步函数）拷贝技能树到目标；`build`（`buildSkills`:183）由 `assets` prompts 生成技能产物；`check`（`checkSkills`:225）校验产物与源一致。核心生成器 `generateSkills`:156 与 `renderSkillMd`:101 / `renderReadme`:110 配合产出 `SKILL.md` 与 README。`readTreeFiles`:208 把目录读成 `Map<相对路径, 内容>` 供 check 做全树比对 | 综合归纳 |
| D9/src/cli-skills.ts，§isCodingKitDest（:262-270） | install 目标合法性 | 判定目标是否落在 `.coding-kit` 或 `.dsh/coding-kit` 内（`endsWith` + `includes` 两形态，路径先经 `posixNorm`:258 归一为正斜杠）—— 与 `index.ts:274` 的 `init_coding_kit` dest 白名单口径呼应，但此处是**路径包含关系**判定而非精确 enum | 综合归纳 |
| D9/src/cli-skills.ts，§validateSkillFrontmatter（:51-71） | frontmatter 校验 | 返回 `string[]` 错误列表（收集式，与 `validateGraphYaml` 同风格）。`cli-skills.ts` 是**唯一同时 import `yaml.ts` 与 `node:os`** 的模块（:11-14，`os` 用于 `--global` 安装时解析 home 目录） | 综合归纳 |
| D9/src/cli-lifecycle.ts，§import 注释（:4-7） | 「单一实现源」复用的显式声明 | 三条注释逐条声明复用意图：DEF-003 T3「dry-run 守卫 adapter 复用 cli-checks 单一实现源（与 verify / status 同口径）」；T6「close_* 守卫复用 cli-checks `evalCloseGuard`（与 task close 同一实现源）」；PRD_DEF-003 后续棒「to_00 `spec_reviews_retention` 复用 cli-checks `evalSpecReviewsRetention`（与 verify --spec 同一实现源）」。即 `cli-checks.ts` 被设计为守卫逻辑的**唯一权威实现**，`lifecycle dry-run`、`verify`、`task close`、`status` 四条路径共用 | 直接引用 |
| D9/src/cli-lifecycle.ts，§loadLifecycle / loadDiscipline（:36-68） | 生命周期数据的外部化 | 两份状态机/纪律数据**不在代码里**，而是读包内 YAML：`<packageRoot>/assets/harness/lifecycle.yaml` 与 `assets/harness/discipline-coverage.yaml`（经 `assetsHarnessFile()`:36）。各自三重校验：文件存在 → `yamlLoad` 解析成功 → 必填字段（lifecycle 要 `version`/`states[]`/`transitions[]`；discipline 要 `version`/`as_of_package_version`/`statements[]`），任一不过即 `fail` | 综合归纳 |
| D9/src/cli-lifecycle.ts，§LifecycleData 类型（:10-26） | 状态机数据结构 | `transitions[]` 每项含 `id`、`from: string[]`（**多源状态**）、`to: string`、可选 `hat`、可选 `description`，以及 `guards[]`（每个 guard 含 `id`、`command_or_check`、`severity`、可选 `allow_flag`）。`allow_flag` 是守卫的豁免旗标声明位，由 `flagsAllow()`（:139）解释 | 数据提取 |
| D9/src/cli-lifecycle.ts，§evalGuard / dryRunTransition（:165-332） | dry-run 求值编排 | `dryRunTransition` 为最大函数（约 120 行），按 transition 声明的 guards 逐个 `evalGuard`（:165）求值；`evalHumanGate`（:157）单独处理人工闸类守卫（走 `parseHumanGates` + `findGate`）。`flagsAllow(flags, allowFlag)`（:139）决定豁免旗标是否放行某守卫。结果经 `formatLifecycleDryRun`（:334）格式化 | 综合归纳 |
| D9/src/cli-lifecycle.ts，§cmdLifecycle / cmdDiscipline（:357, :439） | 两个命令共处一模块 | `lifecycle`（`show` / `dry-run` 两动作）与 `discipline`（`show`）由同一文件导出两个入口，因二者共享 `assetsHarnessFile` 读取与格式化风格；`cli.ts:7` 一次 import 二者 | 综合归纳 |
| D9/src/cli-sync-prompts.ts，§SYNC_PROMPT_FILES（:6-21） | Starter 同步白名单（R1 钉死） | 注释标「R1 钉死 · **不含 README.md**」。11 个 prompt 文件：`00-orchestrator.md`、`10-task-requirements.md`、`10-spec-requirements.md`、`20-task-audit.md`、`20-spec-audit.md`、`30-execute-code.md`、`40-self-check.md`、`FRAGMENT_30_gate_verify_v1_zh.md`、`FRAGMENT_hat_reanchor_v1_zh.md`、`FRAGMENT_00_delegate_only_v1_zh.md`、`TEMPLATE_30_gate_stop.md`；外加 `SYNC_TEMPLATE_FILES = ['TASK_TEMPLATE.md']`。两者均为 `as const` 冻结数组 | 数据提取 |
| D9/src/cli-sync-prompts.ts，§listSyncPromptEntries（:53-68） | 包内→目标的路径映射 | prompts：`assets/harness/prompts/<name>` → `docs/harness/prompts/<name>`；templates：`assets/harness/templates/<name>` → `docs/harness/templates/<name>`。全部路径经 `.replace(/\\/g, '/')` 归一为正斜杠 | 数据提取 |
| D9/src/cli-sync-prompts.ts，§planSyncPrompts（:70-88） | 三分类计划（sha256 比对） | 逐文件按 **sha256 内容哈希**（:45-47）分三类：目标不存在 → `add`；哈希相同 → `skip`；**哈希不同 → `conflict`**。纯计划函数不写盘；`root` 参数默认 `packageRoot()` 但可注入（便于测试） | 综合归纳 |
| D9/src/cli-sync-prompts.ts，§SYNC_PROMPTS_USAGE（:39-43） | sync prompts 的写入语义 | 帮助文本明示：「默认 dry-run（**零写入**）；`--yes` 写入 add 项并创建目标目录；**conflict 默认不覆盖，`--force` 显式覆盖**」。前置条件：目标仓须已有 `.cyning-harness/manifest.json`（先 init）—— `manifestPath()`（:49-50）第三处硬编码该旧目录名 | 直接引用 |
| D9/src/cli-status.ts，§schema 与常量（:20-23） | status 的可观测契约 | `OBS_STATUS_SCHEMA = 'obs_status.v1'`；`CLOSE_STATUSES = new Set(['done', 'completed'])` —— **两个状态词都算已关闭**。`cli-status.ts` 同时导出 `cmdStatus`（:157）与 `cmdTimeline`（:212），后者内部动态 import `cli-timeline.ts`（:244） | 数据提取 |
| D9/src/cli-timeline.ts，§OBS_TIMELINE_SCHEMA（:11） | timeline 的可观测契约 | `OBS_TIMELINE_SCHEMA = 'obs_timeline.v1'`，与 `obs_status.v1` 构成 observability 双 schema。模块仅两个导出函数 `buildTaskTimeline`（:13）与 `formatTimelineHuman`（:79），是最小的命令实现模块（3,332 字节） | 数据提取 |
| D9/src/cli-wiki.ts，§WIKI_GRAPH_SCHEMA + 链接解析（:5, :98-142） | wiki 图导出与链接口径 | `export const WIKI_GRAPH_SCHEMA = 'harness.wiki_graph.v1'`。双链接形态解析：`extractWikilinks`（:98，`[[…]]` 形态）与 `extractMdRelLinks`（:106，Markdown 相对链接），经 `resolveWikilink`（:114）解析目标。`isIllustrativeWikilink`（:133）用于识别「示意性」链接以豁免断链报错 | 综合归纳 |
| D9/src/cli-task-extra.ts，§目录候选常量（:13-21） | 三组目录双/多候选（布局兼容） | `DONE_DIR_CANDIDATES = ['docs/tasks/done', 'docs/harness/tasks/done']`；`INVOKE_DIR_CANDIDATES = ['docs/harness/invokes/by-task', 'invokes/by-task']`（与 `cli-checks.ts:17` **同名同值重复定义**）；`TASK_DIR_CANDIDATES`（:15-21，多项）。反映 kit 需同时兼容 `docs/tasks` 与 `docs/harness/tasks` 两种消费者仓布局 | 数据提取 |
| D9/src/cli-task-extra.ts，§WIKI_DELTA_LITERALS / WIKI_DELTA_PATHISH_RE（:77-78） | wiki_delta 合法值口径 | `WIKI_DELTA_LITERALS = new Set(['none', 'n/a'])` 为豁免字面量；`WIKI_DELTA_PATHISH_RE = /[/.]/` 为「像路径」的极简判据（**只要含 `/` 或 `.` 即算路径形态**）。两者被 `cli-checks.ts:14` 反向 import 复用 | 数据提取 |
| D9/src/cli-task-extra.ts，§sidecar 与依赖环检测（:168-282） | 任务 sidecar 校验 | `SLUG_RE = /^[a-z0-9][a-z0-9_-]*$/`；`loadTaskSidecar`（:170）/ `validateTaskSidecar`（:179）/ `collectTaskSidecars`（:237）构成 sidecar 处理链；`detectDependsOnCycle`（:254）对 `depends_on` 关系做**环检测** —— 全项目唯一的图环检测逻辑 | 综合归纳 |
| D9/src/cli-sync.ts，§generateInvokeIndex（:41-100） | sync index 的产物 | `extractHatId`（:6）从 invoke 文件名取帽号，`collectTaskEntryPoints`（:13）聚合任务入口点，`generateInvokeIndex`（:41）产出索引文本。`cli-sync.ts` 同时承载 `sync index`（本文件）与 `sync prompts`（转发 `cli-sync-prompts.ts` 的 `cmdSyncPrompts`，:3）两个子命令的分派 | 综合归纳 |
| D9/src/yaml.ts，§整文件（:1-15） | YAML 适配层 | 全项目最小模块（423 字节）。用 `createRequire(import.meta.url)` 以 CJS 方式 `require('js-yaml')`（规避 ESM 互操作），并就地手写最小类型断言（仅 `load` / `dump`，`dump` 支持 `lineWidth`）。对外只导出 `yamlLoad()` / `yamlDump()` 两个函数，构成对唯一运行时依赖 `js-yaml` 的**单点封装** | 综合归纳 |

### D10：测试族

> `test/` 共 40 个测试文件（39 个根级 + `test/lib-smoke/` 1 个），全部基于 `node:test` + `node:assert/strict`；主流打法是 `spawnSync` 子进程端到端调 `src/cli.ts`（23 个文件），15 个文件另直接 import `src/*.ts` 做纯函数单测。**核查发现：`npm test` 的 glob 不递归，lib 冒烟须单独跑 `test:lib`** — 来源：D10/test/、D3/package.json

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D10/test/，§目录清点 | 测试文件总量与分布 | 根级 **39 个** `*.test.ts`（`ls -l` 计数），子目录 `test/lib-smoke/` **1 个**（`cli-lib-smoke.test.ts`），合计 40 个。无其他子目录、无 `fixtures/` 专用目录 —— 夹具靠各测试内 `mkdtemp` 临时目录现造，非静态 fixture 目录 | 数据提取 |
| D3/package.json，§scripts.test | **`npm test` 不含 lib 冒烟（重大核查发现）** | `"test": "node --test --test-concurrency=1 --experimental-strip-types test/*.test.ts"` —— glob `test/*.test.ts` **不递归**，故 `test/lib-smoke/` 下的文件**不被 `npm test` 执行**。另有 `"test:lib": "node --test --test-concurrency=1 --experimental-strip-types test/lib-smoke/cli-lib-smoke.test.ts"` 单独覆盖。`"prepublishOnly": "npm run typecheck && npm test && npm run build && npm run test:lib"` —— 发布前四步串联，`test:lib` 排在 `build` **之后**（因其依赖编译产物） | 数据提取 |
| D10/test/lib-smoke/cli-lib-smoke.test.ts，§文件头注释（:10-12） | lib-smoke 单独存在的原因（原文自述） | 注释明示三点：① DEF-018 lib 冒烟针对**发布入口 `bin/dsh-coding-kit.js`（即 `lib/` 编译产物）**跑最小路径；② 「本文件**刻意**放在 `test/lib-smoke/` 子目录：`npm test` 的 glob（`test/*.test.ts`）不递归，**保持 src 套件不依赖 build**」；③ 「lib 冒烟由 `test:lib` 单独触发（`prepublishOnly` 中 build 之后）」。即目录分层是刻意的依赖隔离设计，而非遗漏 | 直接引用 |
| D10/test/lib-smoke/cli-lib-smoke.test.ts，§S0 漂移哨兵（:37-49） | 编译产物新鲜度校验 | S0 用例比对 `lib/cli.js` 与 `src/cli.ts` 的 `statSync().mtimeMs`，要求 `libMtime >= srcMtime`，否则 FAIL 并提示「src→lib 漂移……请 npm run build 后重跑」。`lib/cli.js` 缺失时提示先 `npm run build`。这是全套件唯一的**构建产物与源码一致性哨兵** | 综合归纳 |
| D10/test/lib-smoke/cli-lib-smoke.test.ts，§S1-S3（:51-78） | lib 冒烟的三条最小路径 | S1：`--help` exit 0 且输出含 `verify` 与 `skills install`。S2：`verify` 缺 `--task` 时 exit 非 0 且提示 `verify 须指定 --task`。S3：`skills install --target <mkdtemp 临时目录>` exit 0、输出含 `SKILLS INSTALL: PASS`，且实际落盘 `.dsh/skills/harness-10-spec/SKILL.md`；`finally` 中 `rm(dir, {recursive: true, force: true})` 清理。走 `bin/dsh-coding-kit.js` 而非 `lib/cli.js` 直调，覆盖真实发布入口 | 综合归纳 |
| D10/test/，§测试方法论 · E2E 子进程 | 端到端打法（23 个文件） | 使用 `spawnSync`/`execFileSync` 起子进程的文件：`cli-help`、`cli-flags`、`cli-p0`、`cli-g1g7`、`cli-validation`、`cli-verify-review`、`cli-verify-spec`、`cli-verify-invoke-hats`、`cli-verify-with-wiki-lint`、`cli-task-close-guards`、`cli-task-close-done-snapshot`、`cli-lifecycle-guards`、`cli-discipline-coverage`、`cli-skills-install`、`cli-refresh-ide-blocks`、`cli-sync-prompts`、`cli-status-obs`、`cli-upgrade-compat`、`cli-peer-optional`、`cli-wiki-delta-section`、`cli-graph-yaml-export`、`cli-docs-122`，以及 `lib-smoke/cli-lib-smoke` | 数据提取 |
| D10/test/cli-help.test.ts，§runCli（:17-31） | E2E 调用范式 | 统一范式：`spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], { encoding: 'utf8', cwd, env: {...process.env} })`，即**用当前 node 直跑 `src/cli.ts`（TS 源码，不经 build）**。返回结构含 `status`/`stdout`/`stderr`/`combined`，断言多针对 `combined`（合并流），因此不区分 stdout/stderr 归属。`KIT` 由 `import.meta.url` 上溯一级得出（:7） | 综合归纳 |
| D10/test/，§测试方法论 · 直接 import（15 处） | 纯函数单测的覆盖点 | 直接 import `src/` 的 15 处映射：`refresh-ide-blocks-parser`→`parseBlocks`；`cli-task-close-done-snapshot`→`buildDoneSnapshot`；`cli-graph-yaml-export`→`buildGraphPayload`；`cli-graph-yaml-stamp`→`cli-graph-yaml.ts` 多符号；`assets`→`loadMarkdownBundle`（**插件面**）；`cli-graph-yaml-emit`→`compileGraph`/`generateMarkdown`；`cli-docs-121`→`generateSkills`；`cli-wiki-delta-section`→`lintWikiDeltaMissing` + `lintTaskFile`；`cli-hgm-parser`→`parseHumanGates` + `cli-graph-hgm.ts` 多符号；`cli-skills-install`→`generateSkills`；`apply`→`apply`/`inject`/`name`（**插件面**）；`cli-sync-prompts`→`listSyncPromptEntries`/`SYNC_PROMPT_FILES`；`init`→`copyDirNoClobber`（**插件面**） | 数据提取 |
| D10/test/apply.test.ts + assets.test.ts + init.test.ts | 插件面的专属测试 | 插件面（`src/index.ts`）的三个测试**全部为直接 import 单测、无 E2E**：`apply.test.ts` 验 `apply`/`inject`/`name` 导出与工具注册；`assets.test.ts` 验 `loadMarkdownBundle`（profile 过滤 / 24k 截断）；`init.test.ts` 验 `copyDirNoClobber`（no-clobber 与 S2 跳过）。三者合计 8,882 字节，占测试总量约 2.6% —— 插件面测试密度显著低于 CLI 面 | 综合归纳 |
| D10/test/，§并发设置 | `--test-concurrency=1` 与 describe 级 concurrency | `package.json` 两个 test 脚本均带 `--test-concurrency=1`（进程级串行）；测试文件内 `describe(..., { concurrency: 1 }, ...)` 再次声明串行（如 `cli-help.test.ts:37`、`cli-lib-smoke.test.ts:36`）。原文未明确注明用意，但从测试实现可推断：多数用例创建临时目录并 `spawnSync` 真实 CLI、且部分用例读写共享的 `assets/` 与仓库根路径，串行可避免相互干扰与句柄/端口竞争 | 推断 |
| D10/test/，§文件体量分布 | 测试规模集中度 | 最大 5 个：`cli-refresh-ide-blocks.test.ts`（27,744 B）、`cli-task-close-guards.test.ts`（23,464 B）、`cli-g1g7.test.ts`（22,464 B）、`cli-p0.test.ts`（21,788 B）、`cli-skills-install.test.ts`（17,044 B）。五者合计 112,504 B，占根级 `test/` 总量（317,771 B）约 **35%**。全部 39 个根级测试合计 317,771 B，略大于全部 17 个源码文件合计 244,491 B（**测试代码量约为源码的 1.30 倍**）。最小 3 个：`init.test.ts`（2,105 B）、`cli-docs-r07.test.ts`（2,291 B）、`apply.test.ts`（2,510 B） | 数据提取 |
| D10/test/，§describe 标题清点 | 测试组织方式：按缺陷号/需求号而非按模块 | 39 个根级文件的首个 `describe` 标题显示，测试**以缺陷单号 / 需求项为组织轴**，而非按源码模块：`DEF-001/002/003/004/005/006/009/010/011/013/015/016/020/023/031/032`、`R-07`、`K1/K3/K5`、`C*`、`D1–D7 G1–G7`、`T1–T6`、`I1–I12`、`1.2.1/1.2.2/1.2.4` 等。例如 DEF-003 一个缺陷号横跨 5 个文件（`cli-docs-def003`、`cli-lifecycle-guards` T3、`cli-verify-review` T4、`cli-verify-invoke-hats` T5、`cli-task-close-guards` T6） | 综合归纳 |
| D10/test/，§一级命令覆盖交叉比对 | **所有 16 个一级命令均有测试触及** | 按测试内命令字面 grep 得：`init`（4 文件）、`upgrade`（6）、`check`（6）、`refresh-ide-blocks`（1）、`audit`（2）、`gate-check`（3）、`verify`（8）、`status`（4）、`timeline`（3）、`lifecycle`（6）、`discipline`（4）、`skills`（7）、`wiki`（3）、`task`（多，见下）、`sync`（下）、`graph`（下）。**无一级命令零覆盖** | 数据提取 |
| D10/test/，§子命令覆盖交叉比对 | **5 个子命令仅由 `cli-g1g7.test.ts` 单点覆盖（可核实事实）** | `graph snapshot`、`graph axioms`、`task lint-done`、`task check` 四者**仅**出现在 `cli-g1g7.test.ts` 一个文件中；`sync index` 出现在 `cli-g1g7` 与 `cli-upgrade-compat` 两处。其余子命令有专属文件：`sync prompts`→`cli-sync-prompts`、`graph yaml`→`cli-graph-yaml-{emit,export,stamp}` + `cli-graph-yaml-export`、`graph ingest`→`cli-status-obs` + `cli-g1g7`、`task lint-wiki-delta`→`cli-wiki-delta-section`、`task close`→`cli-task-close-{guards,done-snapshot}` | 数据提取 |
| D10/test/cli-g1g7.test.ts，§`D1–D7 G1–G7 runtime` | 广覆盖枢纽文件 | 22,464 字节，标题为「D1–D7 G1–G7 runtime」，是**项目过程命令 G1–G7** 的运行时总验收；同时也是 `graph snapshot` / `graph axioms` / `task lint-done` / `task check` 四个子命令的唯一覆盖点。与之并列的 `cli-p0.test.ts`（21,788 B，标题「C* CLI P0 runtime」）覆盖 P0 级命令面 | 综合归纳 |
| D10/test/，§源码模块↔测试文件同名比对 | 8 个源码模块无同名测试文件（可核实事实） | 无以其命名的专属测试文件的模块：`cli-shared.ts`、`cli-checks.ts`、`cli-task-extra.ts`、`cli-graph.ts`、`cli-sync.ts`、`cli-timeline.ts`、`cli-wiki.ts`、`yaml.ts`。其中 `cli-shared.ts` 的 `buildDoneSnapshot`/`parseHumanGates` 经 `cli-task-close-done-snapshot`/`cli-hgm-parser` 间接单测，`cli-checks.ts` 的 `lintTaskFile` 经 `cli-wiki-delta-section` 间接单测，`cli-task-extra.ts` 的 `lintWikiDeltaMissing` 同理；而 **`yaml.ts`、`cli-timeline.ts`、`cli-wiki.ts`、`cli-sync.ts`、`cli-graph.ts` 五者未见任何直接 import 单测**，仅经 E2E 命令路径间接覆盖 | 综合归纳 |
| D10/test/，§文档一致性测试子族（9 个文件） | 「D-DOC」族：资产与文档的对齐校验 | 9 个文件专做**文档/资产一致性**而非代码行为：`assets-ontology`（DEF-004 `ontology.yaml` 与包实物对齐）、`assets-prompts-ci-alignment`（命令串真值锚）、`cli-discipline-coverage`（DEF-005 discipline-coverage 与实接线对齐）、`cli-docs-121`（README/renderReadme）、`cli-docs-122`（E2 adapters + README FAQ）、`cli-docs-123`（DEF-002 assets 无现行旧包命令面）、`cli-docs-def003`（资产声称必须接线或明示未接线）、`cli-docs-def009`（assets 相对引用逐一可 resolve）、`cli-docs-def020`（adapters README 声称未实现止血）、`cli-docs-graph-templates`（DEF-006 graph 模板命令面与编译器对齐）、`cli-docs-r07`（R-07 T5 文档 V10）、`docs-releasing`（DEF-001 T5 RELEASING.md checklist 制度化）。即测试套件把**文档漂移**当作可失败的回归项 | 综合归纳 |
| D10/test/cli-peer-optional.test.ts，§`1.2.2 peer optional + default pnpm install` | optional peer 的安装面验证 | 专测 `@deepseek-ai/*` 作为 optional peer 时「默认 `pnpm install` 可通」—— 对应 D9 中「两个 peer 仅 `index.ts` 静态 import」的事实：CLI 面在 peer 缺失时仍须可用 | 综合归纳 |
| D10/test/refresh-ide-blocks-parser.test.ts + cli-refresh-ide-blocks.test.ts | R-07 的双层测试 | 分层与源码分层对应：`refresh-ide-blocks-parser.test.ts`（3,589 B，标题「R-07 T1 块解析器（纯函数）」）直接 import `parseBlocks` 做纯函数测；`cli-refresh-ide-blocks.test.ts`（27,744 B，**全套件最大**）走 E2E 覆盖 T2–T4（映射表 / 拒写闸 / 报告）。另有 `cli-docs-r07.test.ts` 管文档面 | 综合归纳 |
| D10/test/cli-graph-yaml-stamp.test.ts，§标题 | 幂等性专项测试 | 标题「compile/export `generated_at` 源内容派生（幂等 · 非 wall-clock）」—— 明确验证时间戳由**源内容哈希派生**而非挂钟时间，保证同一输入重复编译产物字节一致（对应 `cli-graph-yaml.ts:188` 的 `contentStamp`） | 综合归纳 |
| D10/test/，§「先红」标注 | TDD 痕迹 | 三个文件的 describe 标题显式带「先红」：`cli-hgm-parser.test.ts`（DEF-015 …「T1 先红」）、`cli-status-obs.test.ts`（DEF-016 …「先红」）。表明这些用例按先写失败测试再实现的顺序落地 | 数据提取 |
| D10/test/，§夹具策略 | 临时目录现造，无静态 fixture 目录 | **24 个**根级文件 + lib-smoke 使用 `mkdtemp`（`node:fs/promises`）在 `os.tmpdir()` 下现造隔离目录，用毕 `rm(dir, {recursive: true, force: true})` 清理（典型见 `lib-smoke/cli-lib-smoke.test.ts:65-77`）。`test/` 下**无 `fixtures/` 或 `__fixtures__/` 目录**，静态素材一律取自包内真实 `assets/`。未用 mkdtemp 的多为纯函数单测与文档一致性测试（如 `refresh-ide-blocks-parser`、`apply`、`cli-docs-*`） | 综合归纳 |
| D10/test/，§测试框架依赖面 | 零第三方测试依赖 | 全部测试仅用 Node 内置：`node:test`（`describe`/`it`）、`node:assert/strict`、`node:child_process`、`node:fs`、`node:fs/promises`、`node:os`、`node:path`、`node:url`。**无 jest/vitest/mocha/chai 等任何第三方测试框架或断言库**，与 D3 中「运行时依赖仅 `js-yaml`」的极简依赖策略一致。TS 直跑靠 `--experimental-strip-types`，不经 babel/ts-jest 转译 | 综合归纳 |
| D10/test/，§文件权限异常 | 4 个测试文件权限为 600 | `ls -l` 显示 `assets-prompts-ci-alignment.test.ts`、`cli-task-close-done-snapshot.test.ts`、`cli-verify-with-wiki-lint.test.ts`、`cli-wiki-delta-section.test.ts` 权限为 `-rw-------`（600），其余 36 个为 `-rw-r--r--`（644）。原文未说明原因 | 数据提取 |

### D11：发布成效系列档

> 覆盖 1.2.3→1.5.0 五连发的改造成效、before/after 维度对比、缺陷与债务台账、工程方法与升级指南；本片也是「工程质量与测试」「升级路线与版本演进」两项审查的核心证据。注意：releases 系列只覆盖到 1.5.0，而 03 缺陷台账已追补至 DEF-033（1.5.2/1.6.1），存在范围差；且 README/01 仍写「27 缺陷」，与 03 现列 33 条冲突。 — 来源：docs/releases/*

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D11/01_executive_summary.md，§Five-version theme arc（:7-22） | 五版主题弧 | 1.2.3 对齐历史+MERMAID P0-HOT(DEF-023)；1.2.4 讲真话(R-TRUTH-1)；1.3.0 行为正确(17项+CI)；1.4.0 门真生效(DEF-003 T4-T6)；1.5.0 refresh-ide-blocks 改写存量安装基础，D5 WARN→FAIL | 综合归纳 |
| D11/01_executive_summary.md，§Key numbers（:26-36） | 关键数字 | 缺陷「27(DEF-001…027)全部闭环」；已知债务 18( M-1…M-4, R-01…R-14)；测试 71→222（71/96/155/187/222 分版）；PR #1–#8 全绿；DEF-027 hotfix 修 package-lock 完整性 | 数据提取 |
| D11/01_executive_summary.md，§Current state（:38-44） | 当前状态 | main=`9ee800b`，零未结缺陷；残留债务 R-02/R-09/R-10/R-11/R-14 + R-01 归档人工部分 + R-12 部分；披露未接线项 close_wiki_promotion / spec_reviews_retention | 数据提取 |
| D11/02_before_after.md，§CLI behaviour（:8-15） | CLI 行为 before/after | 未知 flag：吞掉→exit1；子命令 --help：死代码→各自用法；--json：吞掉→五字段结构；--strict：无语义→真收紧；输入校验：init/upgrade/check 多项缺口→词汇表/拒绝/三方版本比较；verify --spec 退出码 2→1 | 数据提取 |
| D11/02_before_after.md，§Gates（:19-25） | 门拦截 before/after | R<n> review 门：从「声称硬门、从不检查」→缺失即 BLOCKED exit2 + 真实 waiver；pre-30 invoke hats：声称→真实 BLOCKED；task close 六守卫：注册但未评估→全部真评估；lifecycle dry-run：永久未评估→真评估；D5 探测：弱启发假阳性→收紧且 1.5.0 硬化 FAIL | 数据提取 |
| D11/02_before_after.md，§Event track & status（:29-33） | 事件轨/状态 | ingest 幂等键：type:subject 无状态→含 status 摘要；任务发现：仅扫 active→扫两目录；status payload：reviews.CLOSE 硬编码 false→接线，event_count 0/null 拆分修正 | 数据提取 |
| D11/02_before_after.md，§Assets,docs,skills（:37-43） | 资源/文档/技能 | 旧包名 @cyning/harness：资产仍指向→全部钉到 dsh-coding-kit；文档声称 vs 实现：未接线能力声称→降级 legacy-only + R-TRUTH-1 测试强制；skills scan：未验证→对 deepseek-harness@141eb6f 验证(rank 100/400)；MERMAID 语法 `//`→`%%` 等；refresh-ide-blocks 改写消费者存量 IDE 块 | 数据提取 |
| D11/02_before_after.md，§Build & CI（:47-51） | 构建/CI | CI：无→node22/24 矩阵 + lib smoke；package-lock：js-yaml 完整性自 9042a73 损坏→单行修正 + cordis/dsh-tools 提 devDeps；npm↔git：1.2.1/1.2.2 无提交→每版可溯源 + commit+tag 前置硬步骤 | 数据提取 |
| D11/03_defects_debt_ledger.md，§Defects（:7） | 缺陷总量（冲突点） | 表头写「Defects (33/33 closed)」，且列至 DEF-033；但 03 正文第3行来源注 register 为 33 项(DEF-001…033)，W1(2026-08-28)补录 DEF-028~033。与 D11/01(:26)、D11/README(:14) 的「27 缺陷」口径不一致 | 数据提取 |
| D11/03_defects_debt_ledger.md，§Defects 表（:11-43） | DEF 逐条登记 | DEF-001 npm 1.2.1/1.2.2 无 git 历史(1.2.3, afe8597/a1b88fb/d8684c0)；DEF-003 声称门未接线(声明1.2.4/接线1.4.0)；DEF-023 MERMAID 断 IDE 预览(P0-HOT,1.2.3)；DEF-027 lock 完整性(经 PR#1 cc6ec81)；DEF-028~033 为 1.5.2/1.6.1 追补（跨产品线版本比较误报/无 marker 无报告/export 丢边 label/graph_id 命名空间/硬编码 id 白名单） | 数据提取 |
| D11/03_defects_debt_ledger.md，§DEF-027 hotfix（:80-90） | DEF-027 全案 | 自 9042a73 潜伏；本地 npm 缓存掩盖；首跑 CI(32711990567) 两矩阵腿 EINTEGRITY 红；单行修正 PR#1(012d258)；伴生发现 npm≥11 不装可选 peer 树→cordis/dsh-tools 提 devDeps；并触发「分支→PR→CI绿→merge→人 publish」模式切换 | 综合归纳 |
| D11/03_defects_debt_ledger.md，§Debts by disposition（:48-78） | 债务处置 | 已结 10(M-1…M-4,R-01部分,R-03,R-04,R-05,R-06,R-13)；转评估交付 2(R-07→refresh-ide-blocks 1.5.0；R-08→上游验证 1.4.0)；残留未结 6(R-01归档人工/R-02 peer风险/R-09+R-14/R-10/R-11/R-12) | 数据提取 |
| D11/04_engineering_method.md，§Role chain（:6-17） | 角色链/人在环 | harness 帽链 00→R1/R2/R3→40 事实审计(B1–B8 PASS,33/33)；HG-AUDIT-R1 批准；npm publish 全程仅人；决策权仅人(decision_log「仅人填写」)；批量授权 DEC-BATCH-1.2.4/1.3.0 | 综合归纳 |
| D11/04_engineering_method.md，§Test-first（:27-41） | 测试先行 | 行为变更以「失败测试提交→紧随修复提交」双提交链落地（如 DEF-003 T4 d433fbc→b7c15ae 等 7 行）；分版验收 71→96→155→187→222，test:lib 4/4 自 1.3.0 | 数据提取 |
| D11/04_engineering_method.md，§Declare-first（:43-48） | 声明优先 R-TRUTH-1 | 1.2.4 在接线前先把超出现有接线的声明降级/标注(DEF-003 phase1, 2a4155c)，SPEC 立 R-TRUTH-1 红线「发布声称须匹配实际接线、由测试强制」；能力本身经 DEC-BATCH-1.3.0 推迟到 1.4.0 | 综合归纳 |
| D11/04_engineering_method.md，§Pipeline evolution（:58-63） | 流水线演进 | 1.2.3–1.3.0 直推 main；1.3.0 引入 CI 首跑抓 DEF-027；hotfix 走 PR#1 后明确模式切换「分支→PR→CI绿→merge→人publish」，PR#2–#8 跟进 | 综合归纳 |
| D11/04_engineering_method.md，§Git concurrency（:65-75） | 并发事故恢复 | 2026-06-25 `add -A` 事故→禁 git add -A/-a、仅提交本轮精确路径；DEF-001 未提交发布事故→补 commit/tag 链 + 「commit+tag before publish」硬规则 | 数据提取 |
| D11/05_upgrade_guide.md，§B/C/D（:17-98） | 升级破坏性变更清单 | 1.2.3 重跑 graph yaml compile；1.2.4 重跑 compile+skills install；1.3.0 未知 flag exit1 / --strict 真语义 / --json 五字段 / 校验收紧（CI 可能转红）；1.4.0 verify 需 R<n> review 与 pre-30 invoke 工件、task close 六守卫（BLOCKED exit2 + 真实 waiver）；1.5.0 D5 WARN→FAIL exit2、refresh-ide-blocks 改写存量 IDE 块(dry-run/--yes/5代备份/幂等) | 数据提取 |
| D11/05_upgrade_guide.md，§Known limitations（:100-104） | 已知限制 | close_wiki_promotion 与 spec_reviews_retention(verify --spec) 仍未接线，仅披露不声称；KPI 四维评分为启发式解析 | 数据提取 |
| D11/README.md，§Files（:8-16） | 系列文件清单 | 01 总览 / 02 before-after(核心交付) / 03 台账(原文称 27 缺陷) / 04 方法 / 05 升级指南；范围 1.2.3→1.5.0，五连发均 2026-08-24 | 数据提取 |
| D11/README.md，§Version timeline（:20-32） | 版本时间线 | 1.2.3 d8684c0 / 1.2.4 8bc343e / 1.3.0 1d6b690(PR#1) / 1.4.0 cef758b(PR#2–5) / 1.5.0 aebf172(PR#6–8)；v1.2.1/v1.2.2 标签在 1.2.3 准备期回溯重建 | 数据提取 |

### D12：doc-health SPEC 包

> 长期 SPEC 包，解决「CLOSE 完成态与文档资产健康度绑死」问题：验收过≠关账完；试点仓 ops-desk-api。已签收(HG-SPEC-SIGNOFF=approved 2026-08-26)但 kit 实现尚未落地(W1–W5 待开 task)。注意：docs/spec/README.md:9 仍标注本包 status 为 `HG-SPEC-SIGNOFF=pending`，与包内 README:3 的 `approved` 不一致。 — 来源：docs/spec/doc-health/** + docs/spec/README.md

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D12/spec/README.md，§索引表（:7-12） | SPEC 总索引 | doc-health=`draft · HG-SPEC-SIGNOFF=pending`；self-tech-graph=`signed · W0–W4 CLOSE · 已发 1.9.1`；新长期 SPEC 落专属夹 `docs/spec/<slug>/`；产品总 SPEC 仍为仓根 SPEC.md | 数据提取 |
| D12/doc-health/README.md，§状态（:3） | 包总纲 | `signed · HG-SPEC-SIGNOFF=approved`（2026-08-26 · 00 签收）；v0；track harness/docs-ops；graph_change_layer=none（不改业务图）；test_strategy=required | 数据提取 |
| D12/doc-health/README.md，§一句话/读序（:19-35） | 核心主张 | `CLOSE 完成` ⟺ 合入证据 + 物理归档 + Hub(若启用)；读序 7 步：总纲→00→01→02(C1)→03(C2)→04(C3)→05→process→observations | 综合归纳 |
| D12/doc-health/README.md，§Wave 总表（:59-70） | 波次总表 | W0 仓内纪律先行 / W1 P0 语义文案 / W2 P0 close_pr_merged / W3 P1 Hub 索引闸 / W4 P1 布局公约 / W5 P2 观察轨；禁止跳波 | 数据提取 |
| D12/doc-health/README.md，§范围/非范围（:74-88） | 范围 | 范围：kit CLOSE/task close/lifecycle 完成态契约+单测草案、SPEC 专属夹公约、过程纪律；非范围：不改 app/ 生产码、不强制 gh pr merge、不绑架 freeze_id、不自动改已发布 npm 包 | 综合归纳 |
| D12/doc-health/README.md，§failure_paths/人闸（:104-121） | 失败路径+人闸 | F-SPEC-01~05 + F-HEALTH-01；人闸 HG-SPEC-SIGNOFF=approved 才允许 00 出实现 task、30 改码 | 数据提取 |
| D12/doc-health/00_policy_and_boundaries.md，§1/2/4（:10-49） | 政策与边界 | 定位=长期契约 SPEC、非单次功能 SPEC、需求真值(非已发布行为说明)；与 coding_wiki/guides/docs/_tech_graph/docs/tasks/既有 close_* 十一闸边界；非目标 5 条 | 综合归纳 |
| D12/doc-health/01_problem_and_goals.md，§1.1（:11-21） | 问题·CLOSE 语义分裂 | invoke 写 CLOSE:PASS 但 task 仍 active；dry-run 也打印 PASS；--yes 才 renameSync；lifecycle close done→archived 词表混；Hub 索引行非机械步骤常漏 | 综合归纳 |
| D12/doc-health/01_problem_and_goals.md，§2（:39-44） | 目标 | DoD 对 Agent/CLI 同义：合入证据(或豁免)+物理归档+(若启用)Hub 索引；文案与机械闸一致；新 SPEC 默认专属夹；健康度有维度表+观察轨 | 数据提取 |
| D12/doc-health/02_close_binding.md，§1 DoD（:10-22） | C1·完成态 DoD | D1 既有十一闸(已接线) / D2 物理归档 dry-run 改打 CLOSE:READY(不兼容旧 PASS) / D3 新增 close_pr_merged / D4 Hub 索引 close_hub_index(条件) / D5 文案禁歧义；完成态= D1∧D2∧(D3∨豁免)∧(D4∨不适用∨豁免) | 数据提取 |
| D12/doc-health/02_close_binding.md，§3/5/6（:39-148） | C1·叠加/豁免/Hub | 既有 11 闸保持、后插 close_pr_merged、再 close_hub_index；豁免旗 --allow-no-pr-merge / --allow-no-hub；PR 探测优先级 related_pr→当前分支 gh→--pr；Hub 方案 A+manifest 可关、仓级默认开 | 综合归纳 |
| D12/doc-health/02_close_binding.md，§7/8（:160-192） | C1·落点/单测 | 落点覆盖 lifecycle.yaml/cli-checks.ts/cli.ts/cli-lifecycle.ts/prompts/templates/CHANGELOG/test；10 个单测名草案(close_pr_merged/hub_index/dry_run 等) | 数据提取 |
| D12/doc-health/03_spec_layout_convention.md，§1/3（:10-61） | C2·布局公约 | 新长期 SPEC 必须落 `docs/spec/<slug>/` 专属夹；根级裸 SPEC-*.md 禁止新增(历史不强制搬、warn)；warn 感知=索引表(立刻)+CLI/verify warn(随发版)；本包自身示范 | 综合归纳 |
| D12/doc-health/04_doc_health_dimensions.md，§2（:19-28） | C3·健康度维度 | 6 维度：新鲜度/可发现性/单源真值/关账闭环/死链孤儿/读者路径；明确非技术债主轴、不重开 graph SPEC；度量脚本本波不强制 | 数据提取 |
| D12/doc-health/04_doc_health_dimensions.md，§3/4（:32-56） | C3·观察清单/模板 | 待观察 6 项(写入 observations 后方可升格契约)；观察日志模板`observations/YYYY-MM-DD_<repo>_<topic>.md`、文首标「观察·非冻结契约」 | 数据提取 |
| D12/doc-health/05_execution_waves.md，§1/2（:8-82） | 波次详表 | W0 仓内纪律(可不改 kit)→W1 文案→W2 close_pr_merged→W3 Hub 闸→W4 公约传播→W5 观察；下游实现清单「尚未实现」(05:82 划除「已由 task doc-health-close-binding 落地 1.7.0」) | 数据提取 |
| D12/doc-health/observations/README.md，§日志表（:9-13） | 观察索引 | 1 篇观察(2026-08-26 ops-desk-api close-vs-archive)，维度=关账闭环·新鲜度；效力默认「观察·非冻结契约」 | 数据提取 |
| D12/doc-health/observations/2026-08-26_*.md，§1（:12-33） | 观察实例 | 现象：invoke 自称 CLOSE:PASS 但 task 仍 active；lifecycle done→archived 词表混；Hub 非机械步骤；dry-run 仍打 PASS；ops-desk-api 根级裸 SPEC 多份 | 综合归纳 |
| D12/doc-health/process/agent_close_discipline.md，§1/2（:10-26） | 过程纪律 W0 | 验收绿仅称「复检通过」；只在「合入证据+task close --yes+Hub」后才准写 CLOSE 完成/PASS；00/CLOSE 棒 7 条清单；先于 npm 发版可在业务仓执行 | 数据提取 |

### D13：self-tech-graph SPEC 包

> 长期 SPEC 包，解决「kit 卖图谱能力却自身无图谱」：为 dsh-coding-kit 建 `docs/_tech_graph/` 三层技术图谱(L0/L1/L2)并全程用自家工具链 dogfood；同时盘点工作区三棵外置文档树给出迁/留判定。已签收并发布 1.9.1(2026-08-28 @ a4e8827，禁 1.10+)。注意：任务提示的「02_version 变更记录」不在本 SPEC 包内，而是 `docs/_tech_graph/02_version.md`（属 D14 自图谱 dogfood 产物）。 — 来源：docs/spec/self-tech-graph/** + reference/**

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D13/self-tech-graph/README.md，§状态/人闸（:3-30） | 包总纲+人闸 | `signed` · HG-SPEC-SIGNOFF=approved(2026-08-27) · HG-GRAPH-MODULES=approved(2026-08-28·签收物 01_struct 17/17 src 实读)；拟发版 1.9.1 已发布(tag v1.9.1 @ a4e8827 · 禁止 1.10+)；track=epic；test_strategy=required | 数据提取 |
| D13/self-tech-graph/README.md，§一句话目标/读序（:34-43） | 目标 | kit 建 `docs/_tech_graph/` 三层(L0 顶层流程/L1 模块边界/L2 关键子流程)用自家 graph yaml compile/export/check dogfood；盘点工作区三树(106文件 init + optimization + tech_graph)给迁回/留外+指针/归档判定 | 综合归纳 |
| D13/self-tech-graph/01_problem_and_goals.md，§1（:9-18） | 问题陈述 | 外置树：optimization/00_inventory(架构真值·锚1.2.2已滞后6版·仓外不可 CI 校验) / init(106文件历史过程树·双轨割裂) / tech_graph(跨仓方法论)；不合理点：能力提供方不 dogfood、仓内无单一架构源、外置文档漂移无闸 | 综合归纳 |
| D13/self-tech-graph/01_problem_and_goals.md，§2/3（:21-32） | 完成态/非目标 | 完成态1-3已落地(_tech_graph 三层齐备、唯一编辑源 .graph.yaml、外置三树盘点执行)；非目标：不新增 graph CLI 能力、不重构其它仓图谱、不搬 tech_graph 跨仓档 | 数据提取 |
| D13/self-tech-graph/02_graph_scheme.md，§1（:7-16） | 02·三层定义 | L0=00_main(L0顶层流程) · L1=01_struct(HG-GRAPH-MODULES 人签·src/模块职责依赖) · L2=4条 10_flow_*(task_close/verify/upgrade/graph_yaml_pipeline) · 辅=02_version.md(版本时间线·W3落)；模块表起点=00_inventory/architecture 1.2.2 锚但须按 1.9.0 src 实读重核禁照抄 | 综合归纳 |
| D13/self-tech-graph/02_graph_scheme.md，§2（:18-28） | 02·dogfood 工具链 | `graph yaml compile --all` / `export` / `check --all` 仓内可跑；CI `.github/workflows/tech-graph.yml`(bin compile/check·红即 fail·md 裸 git diff --exit-code·不 diff shared/graph.json)；graph_yaml_pipeline 自指验证(图谱描述工具、工具校验图谱) | 数据提取 |
| D13/self-tech-graph/02_graph_scheme.md，§3（:30-37） | 02·失败路径 | yaml 与 src 漂移→check 退/重读；未签即改码→30 拒；编译器缺陷→记 DEF 另开 task；02_version 首版从简允许仅里程碑行 | 数据提取 |
| D13/self-tech-graph/03_external_docs_migration.md，§1（:9-31） | 03·盘点判定矩阵 | 树A optimization：00_inventory 内容重生+原文迁 reference(标1.2.2锚)/01_defects 先去重 ledger/02-04 留外+POINTER/05-06 留外；树B init(106文件)全留外(历史SPEC+过程档)；树C tech_graph(json_graph/query_graph 留外+POINTER) | 综合归纳 |
| D13/self-tech-graph/03_external_docs_migration.md，§2（:32-37） | 03·迁移规则 | 迁回落 reference/ 标历史锚+原路径禁改正文；留外指针集中 POINTERS + docs/spec/README；执行后死链 grep；工作区原树不删 | 综合归纳 |
| D13/self-tech-graph/04_execution_waves.md，§波次表（:5-13） | 04·波次 W0-W4 | W0 盘点复核(ledger vs 01_defects 去重) · W1 L1 01_struct(HG-GRAPH-MODULES) · W2 L0+L2 yaml+拟1.9.x · W3 CI+02_version+迁移执行 · W4 收口已发1.9.1；串行依赖(W1 真值→W2 构图→W3 CI)；全部 task CLOSE | 数据提取 |
| D13/self-tech-graph/reference/POINTERS.md，§树A/B/C（:9-33） | 指针索引 | 留外树不删原文件；真值优先级 DEF→03_defects_debt_ledger / 产品SPEC→仓根SPEC.md / 图谱→docs/_tech_graph/；树A 00_inventory 4 份(architecture/cli_surface/plugin_surface/assets_catalog)已迁 reference 标 1.2.2 锚；#R07 锚 refresh-ide-blocks(1.5.0 已交付) | 数据提取 |
| D13/self-tech-graph/reference/*（6 份） | reference 组成 | 5 份：`W0_inventory_diff_20260827.md`(迁留定稿矩阵) + 4 份 1.2.2 锚点复制(architecture/cli_surface/plugin_surface/assets_catalog) + `POINTERS.md`；均为历史锚/指针，非现行真值 | 综合归纳 |

### D14：自图谱 dogfood（docs/_tech_graph/）

> kit 用自家 `graph yaml compile/export/check` 链把 `docs/_tech_graph/` 当被测对象自证闭环。目录按 L0(顶层流程)/L1(模块边界)/L2(关键子流程) 组织；唯一编辑源为 `.graph.yaml`，`.md` 由编译生成。注意：任务提示「13 份 yaml」与实际不符——本目录仅 **5 份 `.graph.yaml`**（00_main + 4 条 10_flow_*），`shared/graph.json` 的 graphs=5、nodes=67、edges=67；「13」疑似与 1.2.2 inventory 的 13 个 CLI `.ts` 混淆。本目录无独立 README；其不随 npm 分发一说见于 SPEC README(D13:19)「docs/ 本就不入 tarball」。 — 来源：docs/_tech_graph/** + shared/graph.json

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D14/00_main.graph.yaml，:3-4 | L0 顶层流程 | 标题「kit 顶层流程：CLI 分发与插件面」；bin 壳→runCli 分发→P0/延展命令族，并行 DSH 插件面(apply_coding_standards/init_coding_kit)，两面互不 import | 数据提取 |
| D14/00_main.md，:8-17 | L0 编译产物 | compile 生成：含 YAML frontmatter + Mermaid flowchart + Nodes/Edges 表；节点 RUNCLI 等；L2 子流程不在本图展开(折叠) | 数据提取 |
| D14/01_struct.md，§1（:16-34） | L1 模块边界表 | 锚 dsh-coding-kit@1.9.0；真值 src/*.ts 17 文件实读；HG-GRAPH-MODULES approved(2026-08-28)；列 17 模块(职责/读/写/被谁调)，手写不编译覆盖 | 数据提取 |
| D14/01_struct.md，§2（:38-56） | 相对 1.2.2 增量 | 1.2.2 inventory 称 13 个 CLI `.ts`；1.9.0 实勘 17(原13+index.ts+cli-checks/cli-refresh-ide-blocks/cli-sync-prompts 三新增拆分)；cli-checks 拆分于 1.4.0、refresh-ide-blocks 1.5.0、sync-prompts 1.9.0 | 数据提取 |
| D14/02_version.md，:3-17 | 版本时间线(手写) | 性质=手写·非 compile 产物；上限 1.10.x(现行 1.10.0)；真值 CHANGELOG/package.json；列里程碑 1.2.3(DEF-023)→1.2.4(DEF-006)→1.6.1(DEF-031~033)→1.9.0(sync prompts)→1.9.1(W2 dogfood 收口)→1.9.2(幂等)→1.10.0(帽 re-anchor) | 数据提取 |
| D14/99_mermaid_protocol.md，§0（:5-11） | YAML-first 协议 | 唯一编辑源 `*.graph.yaml`；`graph yaml compile` 生成同名 `.md`(frontmatter+Mermaid+表)；`generated_at`=yaml 源内容戳 sha256-<16hex>(幂等非 wall-clock)；禁止手写 .md；`graph yaml check` 比 yaml 源与 graph.json 切片(需先 export)；弃用 .ai.md 双轨 | 综合归纳 |
| D14/99_mermaid_protocol.md，§7（:119-144） | 输出契约 | 默认 emit：`%%` 注释 / `src -->\|"label"\| dst` 边 / `id["label"]` 引号节点 / label 实体转义(`#quot;`等)；禁 `--"label"-->`、`//` 注释、未引号特殊字符节点(IDE 静默失败) | 数据提取 |
| D14/10_flow_*.graph.yaml（4 份） | L2 子流程 | `10_flow_task_close`(闸链+done 快照) / `10_flow_verify`(--task/--spec/--with-wiki-lint) / `10_flow_upgrade`(manifest 钉版·幂等) / `10_flow_graph_yaml_pipeline`(compile→export→check 自指 dogfood)；子图 >7 节点折叠为 [[Phase]] | 综合归纳 |
| D14/shared/graph.json（结构抽取） | 聚合图数据 | schema_version=graph_v2；freeze_id=TECH_GRAPH_S2_FREEZE_20260519_V2_3；generated_at=sha256-02c1082d79015876；graphs=5；nodes=67；edges=67；graphs 项含 id/title/source_yaml_path | 数据提取 |
| D14/shared/graph.json（关系） | yaml 源 vs json | `graphs[].source_yaml_path` 指向各 `.graph.yaml`；`nodes/edges` 带 `graph_id` 归属；`export` 由 cli-graph-yaml 写此文件，`check` 按 graph_id 比对 yaml 切片与 json | 推断 |
| D14/（目录组织） | L0/L1/L2 层级 | 实际文件：00_main(L0)+01_struct(L1)+02_version+99_mermaid_protocol+4 条 10_flow_*(L2)+shared/graph.json；`graph yaml compile --all --input docs/_tech_graph` 仓内可跑，CI `.github/workflows/tech-graph.yml` 红即 fail | 综合归纳 |

### D15：已归档 task 族

> kit 的 S2 过程域「任务」侧归档；13 份（12 份已完成任务 + 1 份 README 索引），全部 `状态: done`，均属 `docs/tasks/done/`；版本跨度 v1.7.0 → v1.9.1（1.9.2 前最后一波 self-tech-graph 已随 v1.9.1 发布） — 来源：docs/tasks/done/*

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D15/README.md，§（:1-37） | Hub 导航 | 本文件是「日常浏览只打开」的索引 Hub；落盘 `docs/tasks/done/`；下方 `## harness` 表列 12 份 task 的关账日 + task 文件名 + 一句话摘要；附「修订记录」表（2026-08-26 初建 → 2026-08-28 标记 v1.9.1 已发布 npm latest · tag v1.9.1） | 综合归纳 |
| D15/README.md，§harness（:12-23） | 关账索引 | 12 行摘要：doc-health-close-binding（v1.7.0）· 00-default-behavior-kit-1-7-1（v1.7.1）· wiki-delta-section-diagnostics（v1.8.0 拟）· verify-with-wiki-lint（v1.8.0 拟）· prompts-ci-alignment（v1.8.0 拟）· close-done-snapshot（v1.8.0 拟）· sync-prompts（v1.9.0）· self-tech-graph w0/w1/w2/w3/w4（均随 v1.9.1 发布） | 数据提取 |
| D15/task_doc_health_close_binding.md，§（:1-4） | 任务主题 | 「落地 doc-health CLOSE 强绑定（W1–W4）」；单 task 覆盖 W1 文案 + W2 PR 闸 + W3 Hub 闸 + W4 布局 warn；关联 SPEC `docs/spec/doc-health/`，v1.7.0 | 直接引用 |
| D15/task_00_default_behavior_kit_1_7_1.md，§（:1-4） | 任务主题 | 「入包 00 默认编排纪律（v1.7.1）」；单 patch task，将工作区真值 `Projects/docs/harness/prompts/00-orchestrator.md` 的过程纪律文档/prompts 入包 + 版本钉 | 直接引用 |
| D15/task_wiki_delta_section_diagnostics.md，§（:1-7） | 任务主题 | 「lint-wiki-delta 错节诊断码 + task lint 对齐 close 口径（K1/K2）」；证据来自 ops-desk-api 仓 FEEDBACK §3 K1(P1)/K2(P1)；拟发 1.8.0 | 数据提取 |
| D15/task_verify_with_wiki_lint.md，§（:1-7） | 任务主题 | 「verify --task 纳入 wiki lint（K3）」；单 task 单旗标；证据 ops-desk-api FEEDBACK §3 K3(P2)；拟发 1.8.0 | 数据提取 |
| D15/task_prompts_ci_alignment.md，§（:1-7） | 任务主题 | 「prompts/模板与 CI 对齐（K4 bulk-split 早检 · K6 默认验收 · K7 行为变更旧测提醒）」；证据 ops-desk-api FEEDBACK §3 K4/K6/K7；拟发 1.8.0 | 数据提取 |
| D15/task_close_done_snapshot.md，§（:1-8） | 任务主题 | 「task close 成功输出 done 片段快照（K5）」；单 task：CLI 快照输出 + 30 片段指针；证据 ops-desk-api FEEDBACK §3 K5(P2)·§2 #72（手写 done 绕过 close）；拟发 1.8.0；自检含 `typecheck→npm test(288/288)→build→test:lib(4/4)` 全绿，里程碑 commit `431e1b7` | 数据提取 |
| D15/task_sync_prompts.md，§（:1-8） | 任务主题 | 「新增 sync prompts 子命令（upgrade 不同步 prompts 复发根治）」；单 task 单命令，三波 P1→P2→P3；拟发 v1.9.0 不执行 tag/publish | 数据提取 |
| D15/task_self_tech_graph_w0_inventory.md，§（:1-5） | 任务主题 | 「self-tech-graph W0 外置三树盘点与迁留定稿」；单 task = SPEC W0 整波，纯文档/盘点，无 `src/` 变更；随 v1.9.1 | 直接引用 |
| D15/task_self_tech_graph_w1_struct.md，§（:1-6,36-37） | 任务主题 | 「self-tech-graph W1 L1 模块边界表 + W0 人裁执行」；单 task = SPEC W1 整波 + W0 三项人裁；纯文档；自检 `npm test` **310/310**（基线 279 + 新 9 由 w1 贡献）、`typecheck` PASS、KPI 93%、related_pr `#22` | 数据提取 |
| D15/task_self_tech_graph_w2_yaml.md，§（:1-5） | 任务主题 | 「self-tech-graph W2 L0+L2 graph yaml 构图与 dogfood 校验」；只写 `docs/_tech_graph/*.graph.yaml` + 编译产物，无 `src/` 变更；收口 1.9.1 不 bump | 数据提取 |
| D15/task_self_tech_graph_w3_ci_migrate.md，§（:1-5） | 任务主题 | 「self-tech-graph W3 CI + 02_version + 获批迁移」；新建 `docs/_tech_graph/02_version.md`（时间线非 yaml）；收口 1.9.1 不 bump | 数据提取 |
| D15/task_self_tech_graph_w4_closeout.md，§（:1-5） | 任务主题 | 「self-tech-graph W4 收口 · dogfood 互链 + CHANGELOG Docs」；epic 末棒；**已发布** v1.9.1（2026-08-28 · npm latest · tag `v1.9.1` @ `a4e8827`） | 数据提取 |
| D15/task_*.md，§模板结构（综合 w1-struct:10-211） | 模板结构 | 每份 task 统一含：`## Harness 元信息` 表（task_slug/test_strategy/code_quality_bar/orchestration/audit_profile/required_invoke_hats/git_branch/entry_invoke_30/maintainer_release_hold/related_pr 等）· `### 00 维护者授权` · `### 人工闸` 表 · `## 背景与目标` · `## 范围`（checkbox）· `## 非范围` · `## 失败路径` 表 · `## 验收标准` · `## 给执行帽的必读列表` · `## 思考轮控制` 表 · `## 测试策略` · `### 自检结论（执行者）` · `### KPI（00）` · `### 经验总结` · `## 修订记录`——即具备 SPEC/计划/验收/复盘四要素 | 综合归纳 |

### D16：20-audit 审查文族

> kit 的 S2 过程域「审查」侧；15 份审查文（14 份 task 审 + 1 份 SPEC 审 `spec_self_tech_graph_audit_R1`），均出 `20-task-audit`/`20-spec-audit` 书面审（未改 src/task）；结论分布：14 份内容零阻塞签收、1 份 ACCEPT、2 份 R1 退回（close-done-snapshot / verify-with-wiki-lint）均经 R2 签收 — 来源：docs/harness/reviews/*

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D16/spec_self_tech_graph_audit_R1_20260827.md，§结论摘要（:10-15） | SPEC 审 | self-tech-graph 整 epic SPEC 审；`20-spec-audit`；**内容审查零内容阻塞 → 签收** | 数据提取 |
| D16/task_00_default_behavior_kit_1_7_1_audit_R1_ACCEPT.md，§结论（:5-7） | task 审 | 00-default-behavior-kit-1-7-1；**status: ACCEPT**；范围限于 prompts 入包 + 版本钉，无 CLI 行为变更 | 直接引用 |
| D16/task_doc_health_close_binding_audit_R1_20260826.md，§（:17-19） | task 审 | doc-health-close-binding；**HG-AUDIT-R1=approved · 可 30**；零阻塞，fixture 须 `close_pr_policy=exempt` 免无 gh 环境红片 | 数据提取 |
| D16/task_wiki_delta_section_diagnostics_audit_R1_20260827.md，§结论摘要（:14-15） | task 审 | wiki-delta-section-diagnostics（K1/K2）；**零内容阻塞 → 签收**（可执行、锚点真实、无虚构旗标）；需求真值 ops-desk-api FEEDBACK §1–§3/§5 | 数据提取 |
| D16/task_verify_with_wiki_lint_audit_R1_20260827.md，§结论摘要（:14-16） | task 审 | verify-with-wiki-lint（K3）；**退回 10-task**（2 项内容阻塞 B1/B2）；HG-AUDIT-R1 维持 pending 不签发、无 30 Prompt | 数据提取 |
| D16/task_verify_with_wiki_lint_audit_R2_20260827.md，§结论摘要（:14） | task 审 | verify-with-wiki-lint R2 复审；**零阻塞 · 签收**（B1/B2 落实） | 数据提取 |
| D16/task_prompts_ci_alignment_audit_R1_20260827.md，§结论摘要（:15-16） | task 审 | prompts-ci-alignment（K4/K6/K7）；**内容零阻塞 → 签收**；但 `HG-AUDIT-R1=pending` → 待维护者签闸、30 不得开工（条件通过） | 数据提取 |
| D16/task_sync_prompts_audit_R1_20260827.md，§结论摘要（:15-17） | task 审 | sync-prompts；**零内容阻塞 → 签收**（R1 回填 B1–B4 已写入 task）；下一棒 30+40，三波执行 | 数据提取 |
| D16/task_close_done_snapshot_audit_R1_20260827.md，§结论摘要（:15-16） | task 审 | close-done-snapshot（K5）；**退回 10-task**（B1 锚点文件错误 · B2 `--json` 未声明新增）；HG-AUDIT-R1 维持 pending 不签发 | 数据提取 |
| D16/task_close_done_snapshot_audit_R2_20260827.md，§结论摘要（:15-16） | task 审 | close-done-snapshot R2 复审；**签收**（B1/B2/N1/N2 全落实、无新问题、口径张力已裁决）；仍待维护者/00 依授权签 task 表 HG-AUDIT-R1（条件通过） | 数据提取 |
| D16/task_self_tech_graph_w0_inventory_audit_R1_20260827.md，§结论摘要（:10-14） | task 审 | self-tech-graph W0；`20-task-audit`；**零内容阻塞 → 签收** | 数据提取 |
| D16/task_self_tech_graph_w1_struct_audit_R1_20260828.md，§结论摘要（:10-16） | task 审 | self-tech-graph W1；**零内容阻塞 → 签收**；下一棒 30+40（不把 SPEC `HG-GRAPH-MODULES` pending 当拒开工） | 数据提取 |
| D16/task_self_tech_graph_w2_yaml_audit_R1_20260828.md，§结论摘要（:10-14） | task 审 | self-tech-graph W2；**零内容阻塞 → 签收**；SPEC 侧 `HG-GRAPH-MODULES=approved` | 数据提取 |
| D16/task_self_tech_graph_w3_ci_migrate_audit_R1_20260828.md，§结论摘要（:10-14） | task 审 | self-tech-graph W3；**零内容阻塞 → 签收** | 数据提取 |
| D16/task_self_tech_graph_w4_closeout_audit_R1_20260828.md，§结论摘要（:10-14） | task 审 | self-tech-graph W4；**零内容阻塞 → 签收** | 数据提取 |
| D16/task_*.md，§模板结构（综合 w1-struct:1-57） | 模板结构 | 审查文两种样式：① 标准式 `# Task Audit R1` + 头部 task/日期/角色/证据基线/闸状态 + `## 结论摘要` 表（维度/判定）+ `## 核对项` 表 + `## 内容阻塞` + `## 非阻塞` + `## 签闸` + `## 修订记录`；② 简式 `# Review` + `## 结论` + `## 检查项`（仅 `task_00_default_behavior_kit_1_7_1_audit_R1_ACCEPT.md` 用此式）。退回件在文件名不体现 BLOCK，仅以 R1/R2 递进 | 综合归纳 |

### D17：过程 invoke 记录族

> kit 的 S2 过程域「调用」侧；实际为 **13 个 task 目录 / 15 份文件**（brief 记为 10 目录/13 份，以此处实勘为准）；内容是 00→30→40 的**指令交接留痕（帽级 + 指令摘要）**，非原始 shell 命令日志；唯一含 PROMPT_30 可复制实现稿与 00-intake 的是当前分支 `feat/hat-identity-system-reanchor` 目录 — 来源：docs/harness/invokes/by-task/*

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D17/by-task/*，§目录→task 映射（综合） | 目录编排 | 13 目录名即 task_slug：00-default-behavior-kit-1-7-1 · close-done-snapshot · doc-health-close-binding · hat-identity-system-reanchor · prompts-ci-alignment · self-tech-graph-w0~w4（5 个）· sync-prompts · verify-with-wiki-lint · wiki-delta-section-diagnostics；每个目录对应 D15 同名 task 的 invoke 落盘 | 综合归纳 |
| D17/*/invoke_*_30_40_*.md，§（:1-12） | 内容形态 | 标准结构：`# Invoke：30（含 40）· <task_slug>` + 元信息表（hat_id=30含40 / task_slug / task_paths / git_branch / created）+ `## 指令摘要`（交给执行帽的命令语义摘要，如「cmdTaskClose PASS 分支输出 done 片段快照…先红后绿；四步验证；回填自检」）。即决策/指令留痕，非逐行命令 | 数据提取 |
| D17/00-default-behavior-kit-1-7-1/invoke_*.md，§（:1-12） | 单条 | hat 30,40 · result: pass · 交付 `assets/harness/prompts/00-orchestrator.md` | 数据提取 |
| D17/close-done-snapshot/invoke_*.md，§指令摘要（:13） | 单条 | 指令摘要：cmdTaskClose PASS 分支输出快照 + 新增 `task close --json`（done_snapshot 唯绑归档） + USAGE 同步 + 先红后绿 + 四步验证 | 数据提取 |
| D17/verify-with-wiki-lint/invoke_*.md，§指令摘要 | 单条 | cmdVerify/verifySpecMode 增 `--with-wiki-lint`（复用 lintWikiDeltaMissing · --task/--spec 同生效 · --json wiki_lint 块）；BLOCKED 全串复跑与 CI sample 锁步；与 1.7.1 逐字一致 | 数据提取 |
| D17/prompts-ci-alignment/invoke_*.md，§指令摘要 | 单条 | K4 bulk-split 早检 + K6 TASK_TEMPLATE 默认验收 + K7 20-task-audit 旧测 grep 提醒；grep 断言先红后绿；四步验证 | 数据提取 |
| D17/hat-identity-system-reanchor/invoke_20260831_00_intake_*.md，§（:1-18） | intake 留痕 | `00-intake / 待 30`；branch `feat/hat-identity-system-reanchor`；source=ops-desk-api FEEDBACK hat identity/system prompt；已落盘 FEEDBACK 副本 + `PROMPT_30`；下一棒：打开本仓粘贴 PROMPT_30 执行 → 人发版 1.10.0 → 回 ops-desk-api `upgrade`+`sync prompts` 校验 | 直接引用 |
| D17/hat-identity-system-reanchor/PROMPT_30_*.md，§（:1-95） | 可复制实现稿 | 角色=kit 维护 Agent（实现棒），基线 **1.10.0**；范围 P0 帽级 System/Re-anchor 资产（新增 `FRAGMENT_hat_reanchor_v1_zh.md`/`FRAGMENT_00_delegate_only_v1_zh.md` + 纳入 `SYNC_PROMPT_FILES` + skills build 默认可分发 delegate-only/re-anchor）· P1 降 00 亲自落地（先文档 WARN 级）· P2 Host 衔接文档 · P3 sync/upgrade；验收 `npm run typecheck && npm test && npm run build && npm run test:lib`；**禁止 npm version/publish**（留人发 1.10.0） | 综合归纳 |
| D17/hat-identity-system-reanchor/invoke_20260831_30_40_*.md，§（:1-12） | 实现 invoke | hat 30（含40）· git_branch `feat/hat-identity-system-reanchor` · source=`PROMPT_30_hat_identity_system_reanchor.md` + FEEDBACK 20260831；即当前分支 1.10.0 的实现交接记录 | 数据提取 |
| D17/self-tech-graph-w0~w4/*/invoke_*.md，§（综合 5 份） | 同源 | 5 份 W0–W4 invoke 均 `30（含40）` + 对应 `task/self-tech-graph-wN-*` 分支 + 指令摘要（W1 见 D15 自检 310/310）；纯文档波无 src 变更 | 综合归纳 |

### D18：外部反馈与评测族

> **理解 1.10.0 的钥匙**：当前分支 `feat/hat-identity-system-reanchor` 即由本族驱动。1 份 ops-desk-api 反馈（2026-08-31 · kit 1.9.1 试点）指出「过程帽条文存在但缺稳定 System/Re-anchor 面 + 00 偶现亲自落地」；1 份 eval 文档 fixture 验证「00 + 已有 task → 只委派」—— 来源：docs/feedback/* + eval/hat_identity_00_delegate/*

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D18/FEEDBACK_ops_desk_api_hat_identity_system_prompt_20260831.md，§（:1-9） | 反馈主题 | 试点仓 ops-desk-api · 2026-08-31 · kit `1.9.1`（钉版）· 主题：**过程帽条文存在，但无稳定 System Prompt / re-anchor 面 → 长对话丢帽；00 默认只委派已钉仍偶现亲自落地** | 直接引用 |
| D18/…FEEDBACK…md，§1 场景（:12-18） | 场景 | 三场景：①长对话身份丢失（自称 30 跳 GATE_VERIFY / 自称 00 改 `app/`）②00 偶现亲自落地（无例外句仍直接写实现）③与 Host 交叉（agent-infra Host 缺按帽注入的稳定 system/slot）。**非场景**：不要求业务仓手抄整本 AGENTS.md 当 system | 数据提取 |
| D18/…FEEDBACK…md，§2 现状摘要（:22-32） | 事实现状 | 帽条文真值 `assets/harness/prompts/`→业务仓 `docs/harness/prompts/`；Skills `skills build`：10/20×2 进默认、**30/40 不进默认（T1 闸评测前）**、**00 不进默认 Skills 分发（仅 prompts 同步）**；**System Prompt 无** kit 级按 hat_id 的 system/always 片段；机械闸 `verify`/pre-30/HG-* 挡 30 改码，**不挡「00 自称却写实现」**；Host H2 Policy 可授权高危 CLI 但**尚未**标准 Capability「跑 `npx dsh-coding-kit verify`」 | 数据提取 |
| D18/…FEEDBACK…md，§3 期望vs实际（:35-43） | 期望落差 | 期望：帽身份长对话可 re-anchor（短 system/FRAGMENT）不必重贴全文；声明 00 时默认只委派；Skills 覆盖常用帽开工（00/30/40 不在默认分发）；Host 用 kit 校验过程。实际均部分缺失 | 综合归纳 |
| D18/…FEEDBACK…md，§5 建议 P0（:63-70） | 建议 P0 | 新增可发布碎片：`FRAGMENT_hat_reanchor_v1_zh.md`（≤20 行 · hat_id/task_slug/禁区/上下文脏先读本片段）· `FRAGMENT_00_delegate_only_v1_zh.md`（钉「已有初稿→禁止亲自实现·须例外句」）· 可选 `system/00.md`/`system/30.md` 极短 system；文档钉死 System=短身份 / prompts全文=换帽加载 / verify=机械，三者不可替；`skills build` 为 re-anchor/00-delegate 生成**可默认分发** Skill | 数据提取 |
| D18/…FEEDBACK…md，§5 建议 P1/P2/P3（:72-91） | 建议 P1–P3 | P1 降 00 亲自落地：条文保持 + Eval 增用例 + 可选 `invoke_*_00_*.md` 关账扫描（同窗 git diff 含 `app/**` 且无例外句 → **WARN/FEEDBACK 先 WARN 勿硬 BLOCK**）+ 00 至少提供 delegate-only Skill 默认可装；P2 Host 官方衔接：专节「Host 使用 coding-kit」· Capability `harness.verify`/`harness.task_lint` 白名单 `npx --yes dsh-coding-kit@<pin> verify\|task …`· 须走 H2 Policy 默认关；P3 upgrade/prompts sync 落地新 FRAGMENT | 数据提取 |
| D18/…FEEDBACK…md，§6 Skills 覆盖边界（:94-105） | 覆盖边界 | **钉死结论**：Skills ≠ 全覆盖。10/20 审过程指引能；00 委派纪律弱（不进默认）；30/40 执行弱（不进默认且须 verify）；闸/pre-30/may_start_30 须 CLI verify（否）；帽身份常驻 system 否（Skills 为 on-demand）；Host 业务答题否（产品 Prompt Pack）。→ System/Re-anchor + CLI + Skills 三者互补 | 数据提取 |
| D18/…FEEDBACK…md，§8 issue 标题（:120-126） | 衍生 issue | 可复制标题：`feat(prompts): hat system/re-anchor fragments + 00 delegate-only default skill` · `fix(00): reduce occasional self-implementation despite delegate-only rules` · `docs(host): authorize npx dsh-coding-kit verify via Capability Policy (Skills ≠ full cover)` | 直接引用 |
| D18/eval/hat_identity_00_delegate/README.md，§（:1-22） | 评测夹具 | **性质**：文档 fixture，**不是**可跑评测运行器；仓内**无 `eval/t1_gate_bypass/` 运行器**，机械评分 follow-up；对应 `FRAGMENT_00_delegate_only_v1_zh.md` · FEEDBACK P1；**不要**把「00 窗 app/ diff」做成硬 BLOCK（仅 WARN 级）。结构：给定（你是 00 + 已有 SPEC/task + invoke 无例外句）→ 诱导（顺手改 app/ 或你直接落地）→ 期望人工勾选（含委派句 · 无改 app/src diff · 不把统筹当亲做完） | 数据提取 |
| D18/两文件关联，§综合 | 与 1.10.0 | 该 FEEDBACK（2026-08-31）经 D17 的 `00-intake` 落盘本仓，生成 `PROMPT_30_hat_identity_system_reanchor.md`，实现棒在 `feat/hat-identity-system-reanchor` 分支按 P0–P3 改 prompts/Skills/Host 文档，目标发 **1.10.0**（minor：新 prompts/Skills 面）；人审后 `npm version minor` + publish | 推断 |

### D19：CI 配置族

> kit 仓级 CI 有 2 条 workflow；**ci.yml 确实跑测试**（`npm test` 在 `test` job 四步门禁中），与 D15 多份 task 自检「typecheck→npm test→build→test:lib」四步一致，可自证 D5 硬门禁；tech-graph.yml 仅锁 `docs/_tech_graph` 编译漂移、不跑业务单测 — 来源：.github/workflows/*

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D19/ci.yml，§（:1-25） | 主 CI | `name: ci`；触发 `on: push` + `pull_request`（全量）；job `test`：`runs-on: ubuntu-latest` · `fail-fast: false` · **matrix node `['22.x','24.x']`**（注释对齐 `package.json` engines `^22.19.0 || >=24.0.0`）；steps：`npm ci` → `npm run typecheck` → `npm test` → `npm run build` → `npm run test:lib`。头部注释：DEF-018 D1(a) 仓级 CI 拦截「不发布但合入」的 `src→lib` 漂移（本地 prepublishOnly 之外） | 数据提取 |
| D19/tech-graph.yml，§（:1-29） | tech-graph CI | `name: tech-graph`；触发 `on: pull_request` + `push: branches: [main]`（**仅 push 到 main 才触发，非全量 push**）；job `compile`：`ubuntu-latest` · `timeout-minutes: 10` · **node 单一 `24.x`** 无 matrix；steps：`npm ci` → `node bin/dsh-coding-kit.js graph yaml compile --all --input docs/_tech_graph` → `git diff --exit-code -- docs/_tech_graph/*.md`（未提交编译漂移即失败）→ `graph yaml check --all --input docs/_tech_graph`。注释：用本仓 bin（非 npx 远包）；`generated_at` 幂等；不对 `shared/graph.json` 做 git diff（check 比 yaml↔json 切片） | 数据提取 |
| D19/两 workflow 对比，§综合 | 门禁差异 | ci.yml = 业务四步门禁（含 `npm test` 真跑单测，可证 D5 硬门禁自洽）；tech-graph.yml = 图谱资产锁步（compile+check，仅 push main / PR 触发，无 src 单测）。两 workflow 均未设 `permissions`/`concurrency` 块（原文未明确） | 综合归纳 |

### D20：编译产物族

> 略读：51 份 `lib/**` 均为 `src/*.ts` 经 `tsc` 的编译产物（17 个 src 模块 × 各 3 份 `.js`/`.d.ts`/`.js.map`，与 D9 语义完全重复），不逐份展开；其 CI 新鲜度由 D19 `ci.yml` 的 `npm run build` + `git diff` 锁步保证 — 来源：lib/**（51 份，综合）

| 出处 | 章节 | 内容摘要 | 引用方式 |
|------|------|----------|----------|
| D20/lib/**，§（51 份，综合） | 编译产物 | 51 份 = `lib/*.js` + `lib/*.d.ts` + `lib/*.js.map`（17 个 src 模块 × 3）；HEAD `ad73f07` 当前产物；语义与 D9（src 源码族）重复，非独立知识源；CI 经 `ci.yml` `npm run build` + `test:lib` 校验其与 src 一致（见 D19）。**不逐份读取** | 综合归纳 |

## 3. 冲突记录

> 不同资料对同一事实描述矛盾时，**并列保留两个（含多个）版本**，不做裁决。本版为骨架版 X1–X4 与四份深读碎片回传冲突清单的并集，按主题去重后重编号为 X1…X20。

| 编号 | 冲突主题 | 版本 A | 出处 A | 版本 B | 出处 B | 差异说明 |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | assets 资产地图登记缺口与 POINTER 发布归属矛盾 | `assets/README.md` 旧路径对照表（:7-19）仅登记 7 目录，未含 `assets/docs/`；4 个 `POINTER_*.md` 自述「本文档不随 dsh-coding-kit 发布」（POINTER_SDD_HAT_FLOW.md:6 等）；`coding_wiki/README.md`:54、`graph/templates/README.md` 亦以「原文不随包发布」引用这些 POINTER | `assets/README.md:7-19`；`POINTER_SDD_HAT_FLOW.md:6` / `POINTER_USER_GUIDE.md:6` / `POINTER_RUNBOOK_wiki_delta.md:6` / `POINTER_ONBOARDING.md:6`；`coding_wiki/README.md`:54、`graph/templates/README.md` | `package.json` `files` 含 `assets` 整目录，磁盘确有 `assets/docs/` 4 个 `POINTER_*.md` → 实际随 npm 包分发且未登记资产地图 | 磁盘 `assets/docs/POINTER_ONBOARDING.md` 等 4 文件；`package.json` `files`；主文档 X1（同主题已并入） | 资产地图登记表漏登记 `assets/docs/`，但该目录随 npm 包分发；POINTER 自称不随包发布与实际随包分发矛盾。属文档登记缺陷 + 发布归属矛盾，并列保留并提请补正。 |
| X2 | 过程轨是否进本仓 | `assets/README.md`:30「过程轨（SPEC/task/invoke/reviews）在工作区 docs/dsh_coding_kit_init/，不进本仓」；SPEC.md:7/179/360 亦称过程根在工作区且「禁止写入本仓」 | `assets/README.md`:30；SPEC.md:7/179/360 | 本仓磁盘实含 `docs/tasks/`、`docs/spec/`、`docs/harness/`（含 invokes/by-task、reviews） | 磁盘 `docs/tasks/done/`、`docs/spec/`、`docs/harness/reviews/`、`docs/harness/invokes/by-task/` | `assets/README.md` 与 SPEC.md 多处称过程轨不进本仓，实际已进本仓（主文档 X2 与碎片 A-2 同主题已并入）。并列保留，建议修订 assets/README.md 与 SPEC 相关表述。 |
| X3 | 发布回顾文档时效缺口（releases 系列未覆盖至当前 1.10.0） | `docs/releases/` 系列仅覆盖 **1.2.3→1.5.0**（连发），版本时间线止于 1.5.0；`01_executive_summary` 写「27 缺陷全部闭环」 | `docs/releases/README.md:22-26`、`01_executive_summary.md:38`；碎片 C-5 引 `README.md:3` | 产品当前为 **1.10.0**（CHANGELOG 含 1.5.1→1.10.0 共 15+ 版本节），`02_version.md:4,17` 显示现行 1.10.0；1.5.1–1.10.0 成效未续写，1.0.0–1.2.2 无章节 | `CHANGELOG.md` 全篇（至 [1.10.0] 2026-08-31）；`package.json:3` version=1.10.0；`docs/_tech_graph/02_version.md:4,17` | 发布回顾系列存在文档时效落差：1.5.1–1.10.0 的成效未续写，1.0.0–1.2.2 无章节（主文档 X3 与碎片 C-5 同主题已并入）。属 doc-health 类缺口，并列保留，提示下游评「文档竞争力」以 CHANGELOG 为准。 |
| X4 | discipline-coverage.yaml 接线状态标注与其他「已接线」声明矛盾 | `discipline-coverage.yaml` 标 `G2 reviews 留档闸 = not_wired`、`G4 思考轮结构 = not_wired`（as_of 1.10.0）；`lifecycle.yaml`:46-66 称 to_30 五守卫（含 HG-AUDIT-R1、reviews_retention）「全部已接线」 | `assets/harness/discipline-coverage.yaml`（gaps.G2/G4，as_of 1.10.0）；`assets/harness/lifecycle.yaml`:46-66 | verify/close 的 **R<n> 审查文存在性闸自 1.4.0 已接线**（DEF-003 T4/T6；`src/cli-checks.ts` `findReview`/`evalCloseReview`）；`discipline-coverage.yaml` C1/C2（reviews 留档闸、HG-AUDIT-R1 pending 禁附 30 Prompt，:200-216/:264-272）明确标 `status: not_wired`，旧包机制未接线、计划见 PRD_DEF-003 阶段二 | `CHANGELOG.md:259`（1.4.0）、`src/cli-checks.ts:194,634`、lifecycle.yaml 注释；`discipline-coverage.yaml`:200-216/:264-272 | `discipline-coverage.yaml`（as_of 标 1.10.0）仍标 G2/G4 not_wired，与 1.4.0 起实际接线的 R<n> 审查文闸、及 lifecycle.yaml「全部已接线」声明存在口径差异（主文档 X4 与碎片 A-4 同主题已并入）。可能因 G2/G4 指「独立 lifecycle reviews_retention/HG-AUDIT-R1 状态」而非 verify --task 守卫，但文本易致误读。并列保留，待人工/下游裁决是否更新。 |
| X5 | SPEC §7 实际性质（思考轮回填 vs 目录/资产构成定义） | 主理人所述「assets/README.md 描述的目录构成与 SPEC.md 的关系」，即 SPEC §7 定义 assets 为五大目录 | 主理人任务书口径（经核实不成立） | SPEC.md §7（:265）标题为「思考轮（10-spec 回填 · R0–R5）」，实为思考轮 R0–R5 回填，并非目录/资产构成定义 | `SPEC.md`:265-350 | 「SPEC §7 定义 assets 为五大目录」经全篇精读**无法证实**——SPEC §7 实为思考轮 R0–R5（亦见下方「已核伪说法」）。并列保留，提示下游勿引用该伪说法。 |
| X6 | 产品 SPEC 版本钉落后于当前包版本 | 仓根 `SPEC.md` 标题/冻结钉为 `dsh-coding-kit@1.2.0`（SPEC.md:1、:49） | `SPEC.md`:1、:49 | `ontology.yaml` `product_semver: "1.10.0"`（:7）、`discipline-coverage.yaml` `as_of_package_version: "1.10.0"`（:14）；实发 1.10.0 | `assets/ontology.yaml`:7、`assets/harness/discipline-coverage.yaml`:14；`package.json` version | SPEC.md 钉版 1.2.0 与当前实际包 1.10.0 不一致。SPEC.md 属历史规约文件、不随 npm 包发布（见 §1 D2），与 ontology/package 版本钉脱钩，并列保留。 |
| X7 | S2 过程域前缀存在 4 份互不相同的硬编码（本轮最重要架构发现） | 3 项裸形态 `['docs/tasks', 'reviews', 'invokes/by-task']` — `src/index.ts:13`（`S2_SKIP_PREFIXES`） | `src/index.ts:13` | 3 项带 `docs/harness` 前缀（兼容反斜杠）`docs/tasks` · `docs/harness/reviews` · `docs/harness/invokes/by-task`，注释标「真值 SPEC 1.2.2 #286」— `src/cli-refresh-ide-blocks.ts:299`（`S2_RE`）；5 项并集 `docs/tasks/`、`reviews/`、`invokes/by-task/`、`docs/harness/reviews/`、`docs/harness/invokes/by-task/` — `src/cli-graph-hgm.ts:367`（`s2Prefixes`）；3 项 + 白名单 `/docs/tasks`、`/invokes/by-task`、`/reviews` 且 `/.dsh/skills` 直接放行 — `src/cli-skills.ts:272-283`（`isS2Dest`） | `src/cli-refresh-ide-blocks.ts:299`、`src/cli-graph-hgm.ts:367`、`src/cli-skills.ts:272-283` | 四份定义无共享常量，各模块独立硬编码（版本 A/B/C/D 见出处）。**未做裁决**，并列保留；属本轮最重要架构发现，提示下游统一 S2 前缀真值源。 |
| X8 | cli.ts 体量占比口径 | 「40KB，占全源码约 40%」（主理人任务书） | 主理人任务书 | 实测 `cli.ts` 37,022 B / 939 行，17 个源文件合计 244,491 B，占比约 15.1%（`ls -l src/`、`wc -l src/cli.ts`） | `src/cli.ts`（37,022 B / 939 行）；`src/` 17 文件合计 244,491 B | 主理人「40KB/40%」不成立，按版本 B 记录；cli.ts 为唯一同时承担 argv 解析＋帮助文本＋版本比较＋manifest 读写＋7 个一级命令实现＋task 二级分派＋进程退出的模块，22 个顶层函数，上帝对象倾向（init/upgrade/check/verify/gate-check/audit/task lint/task close 八项业务逻辑未外移）。 |
| X9 | `full` profile 语义 | `profile` 有三档 `l1` / `l1+l2` / `full`（enum 声明）— `src/index.ts:209` | `src/index.ts:209` | `full` 与 `l1+l2` 行为完全等价，工具描述自述「full: currently equivalent to l1+l2, reserved for extended bundles」— `src/index.ts:210` + `includeForProfile` 实现 `src/index.ts:79-88` | `src/index.ts:210` + `src/index.ts:79-88` | `full` 当前为 `l1+l2` 的等价别名（保留为扩展预留），enum 三档中 `full` 不产生独立行为。并列保留。 |
| X10 | `npm test` 是否覆盖 lib 冒烟 | `package.json` scripts 的 glob `test/*.test.ts` 不递归，故 `test/lib-smoke/` 不被 `npm test` 执行 | `package.json` scripts（`test=node --test test/*.test.ts`） | 这是刻意设计而非遗漏，注释明示「本文件刻意放在 `test/lib-smoke/` 子目录……保持 src 套件不依赖 build；lib 冒烟由 `test:lib` 单独触发（prepublishOnly 中 build 之后）」— `test/lib-smoke/cli-lib-smoke.test.ts:10-12` | `test/lib-smoke/cli-lib-smoke.test.ts:10-12` | 结论——**只跑 `npm test` 不会验证编译产物**，必须 `npm run test:lib` 或走 `prepublishOnly`。属设计取舍，并列保留（注：`files` 白名单不含 `src/`/`test/`，消费者安装后无法自行跑测试，见补充交叉信息）。 |
| X11 | 产品更名 kit 但落盘目录仍用旧产品线 `.cyning-harness` | 出现 5 处 `.cyning-harness` 作为现行落盘位置：`src/cli.ts:113`（manifest）、`src/cli-refresh-ide-blocks.ts:325`（备份根）、`src/cli-graph-hgm.ts:5`（HGM_DIR）、`src/cli-sync-prompts.ts:50`（manifest 前置）、R-07 的 marker 字面 `<!-- cyning-harness:begin -->`（`src/cli-refresh-ide-blocks.ts:22-25`） | `src/cli.ts:113`、`src/cli-refresh-ide-blocks.ts:325`、`:22-25`、`src/cli-graph-hgm.ts:5`、`src/cli-sync-prompts.ts:50` | `src/index.ts:186` 把 `.cyning-harness` 当作「legacy 布局」的探测标记并提示 legacy hint —— 同一目录名在一处是**现行落盘位置**、在另一处是**旧布局标志** | `src/index.ts:186` | 同一目录名 `.cyning-harness` 语义分裂（现行落盘 vs legacy 标记），易致维护歧义。并列保留，未裁决。 |
| X12 | `INVOKE_DIR_CANDIDATES` 同名同值重复定义 | `src/cli-checks.ts:17` 定义 `['docs/harness/invokes/by-task', 'invokes/by-task']` | `src/cli-checks.ts:17` | `src/cli-task-extra.ts:14` 各有一份同值定义；两文件间本已有 import 关系（`cli-checks.ts:14` 从 `cli-task-extra.ts` 取符号），未复用 | `src/cli-task-extra.ts:14`；`src/cli-checks.ts:14` | 同值常量重复定义且未抽公共符号，属代码重复（非事实矛盾）。并列保留，提示下游重构去重。 |
| X13 | D11 缺陷计数口径不一致 | `docs/releases/README.md:14` 与 `01_executive_summary.md:26` 写「27 缺陷（DEF-001…DEF-027）全部闭环」 | `docs/releases/README.md:14`、`01_executive_summary.md:26` | `03_defects_debt_ledger.md:7` 表头「Defects (33/33 closed)」并列出 DEF-028~033（W1 2026-08-28 补录，落 1.5.2/1.6.1） | `docs/releases/03_defects_debt_ledger.md:7` | 缺陷总数口径 27 vs 33 不一致（后者含后续补录 DEF-028~033）。属计数口径差异，并列保留。 |
| X14 | doc-health 签收状态与实现落地状态自相矛盾 | `docs/spec/README.md:9` 总索引标 doc-health = `draft · HG-SPEC-SIGNOFF=pending`；`doc-health/README.md:3` 标 `signed · HG-SPEC-SIGNOFF=approved`（2026-08-26）；`doc-health/05_execution_waves.md:82` 划除「已由 task doc-health-close-binding 落地（1.7.0）」，即 kit 实现尚未在本 draft 会话落地（W1–W5 待开 task） | `docs/spec/README.md:9`、`doc-health/README.md:3`、`doc-health/05_execution_waves.md:82` | `HG-SPEC-SIGNOFF=approved`（已签收）与「实现尚未落地（W1–W5 待开 task）」并存——签收 ≠ 已发版 | 同上（`docs/spec/README.md`/`doc-health/README.md`/`05_execution_waves.md`） | 同一 spec 的签收状态（pending vs approved）两处说法相反（碎片 C-2）；且签收 ≠ 已发版，实现仍待开 task（碎片 C-7）。均属状态口径矛盾，并列保留（碎片 C-2 与 C-7 同主题已并入）。 |
| X15 | D14 yaml 数量与任务提示不符 | 任务说明称「13 份 yaml」 | 任务提示口径 | 实勘 Glob + `shared/graph.json` 的 `graphs=5` 显示仅 **5 份** `.graph.yaml`（00_main + 4×10_flow_*）。「13」疑似与 `01_struct.md:40` 所述 1.2.2 inventory 的「13 个 CLI `.ts`」混淆 | 磁盘 Glob 实勘；`docs/_tech_graph/shared/graph.json` `graphs=5`；`01_struct.md:40` | D14 yaml 实为 5 份而非 13 份，计数口径矛盾（13 疑似与 13 个 CLI .ts 混淆）。并列保留。 |
| X16 | D13 的 `02_version.md` 文件落点澄清 | 表述将 `02_version.md` 归在 self-tech-graph SPEC 包内 | 资料表述口径 | `02_version.md` 实际位于 `docs/_tech_graph/02_version.md`（属 D14 自图谱 dogfood 产物，手写、非 compile 生成） | `docs/_tech_graph/02_version.md` | 属表述与文件落点不符，非资料内事实矛盾，仅作落点澄清、并列保留（碎片 C-4）。 |
| X17 | D11 与 RELEASING.md 跨文档引用缺口 | releases 系列仅把 DEF-001 后果记为「commit+tag before publish」硬规则（`01:8`、`README:30-31`） | `docs/releases/01_executive_summary.md:8`、`README.md:30-31` | 根 `README.md:246` 与 `RELEASING.md:3/9/21` 明确「制度化来源 = DEF-001 教训」催生发布硬检查单 | `README.md:246`、`RELEASING.md:3/9/21` | releases 系列未引用 RELEASING.md，跨 doc 缺口；两说互补不矛盾但存在引用断层。并列保留，提示下游补引。 |
| X18 | D17 简报 vs 实勘（invoke 落盘计数） | 任务书称「13 份 / 10 个任务目录」 | 任务书口径 | 实勘 `docs/harness/invokes/by-task/` = **15 份文件 / 13 个任务目录**（hat-identity 目录因含 intake+PROMPT_30+30_40 占 3 份） | 磁盘 `docs/harness/invokes/by-task/` 实勘 | 以实勘 15 份/13 目录为准（§1 D17 已同步更新）。简报计数偏低，属口径差异，并列保留。 |
| X19 | 同一版本期 `npm test` 总数自相矛盾 | `docs/tasks/done/task_self_tech_graph_w1_struct.md:181` 自检称 `npm test → PASS（310/310）` | `docs/tasks/done/task_self_tech_graph_w1_struct.md:181` | `docs/tasks/done/task_close_done_snapshot.md:121,143` 自检称 `npm test 288/288（基线 279 + 新 9）` | `docs/tasks/done/task_close_done_snapshot.md:121,143` | 两文同属 1.9.1 维护期、同引「基线 279」，但总用例数 310 vs 288 不一致。原文未解释差异，属计数口径矛盾，并列保留（提示下游核实基线）。 |
| X20 | 反馈「现状」与实现稿「计划」口径差异 | D18 §2 现状「System Prompt 无 kit 级按 hat_id 的 system/always 片段；30/40 不进默认（T1 前）；00 不进默认 Skills 分发」 | `docs/feedback/*` / `eval/hat_identity_00_delegate/*`（D18） | D17 `PROMPT_30` 计划 P0 提出「可选 `system/00.md`/`system/30.md` 极短 system」+「`skills build` 为 re-anchor/00-delegate 生成可默认分发 Skill」 | `docs/harness/invokes/by-task/` 的 `PROMPT_30`（D17） | 属「现状 vs 规划中改造」，非直接冲突，仅作口径并列保留（碎片 D-3）。 |

**已核伪说法（主理人提醒事项·经全篇精读复核，均无法证实，记录以免下游误引）**：
- 「SPEC.md §7 定义 assets 为五大目录」——**无法证实**：SPEC.md §7 实为「思考轮 R0–R5」（SPEC.md:265-350），全文无任何 assets 目录定义。
- 关于「assets/README §旧路径对照 7 目录 vs 实际 8 目录」：此为主理人已独立核实的真缺陷（见 X1），非伪说法。

---

## 4. 硬指标清单

| 章节 | 硬指标 | 状态 |
| --- | --- | --- |
| §1 | 每份资料有解析状态，失败/跳过注明原因 | ✅（D1–D20 全部标注解析状态；D20 标「已略读」并注明原因，node_modules/.git 标「排除」并注明原因，无「待定」） |
| §2 | 每份文档按章节逐条摘要，每条标注了 `D编号，§章节` | ✅（D1–D20 每族表格按章节摘要并标注 `Dn，§章节/文件` 锚点；高信息密度文件逐章节、同质文件逐份） |
| §3 | 冲突信息并列保留，不做裁决 | ✅（X1–X20 并列保留两个（含多）版本 + 出处，附差异说明；未做裁决；另记录已核伪说法） |

---

## 附录 A：生成流程

### 流程总览

| 步骤 | 动作 | 落入章节 |
| --- | --- | --- |
| Step0 | 读取模板 + 全部原始资料（含主理人运行时注入的路径/范围/裁定） | — |
| Step1 | 盘点资料清单，按族登记 D1–D20，标注解析状态 | §1 |
| Step2 | 逐份打开资料，按自身章节结构逐条摘要（高密文件逐章节、同质文件逐份），锚定 `D编号，§章节` | §2 |
| Step3 | 交叉比对不同资料，发现并记录矛盾（X1–Xn）与已核伪说法 | §3 |
| Step4 | 逐项核验硬指标（§4） | §4 |

```mermaid
flowchart LR
    S0[读取模板与资料] --> S1[盘点资料清单]
    S1 --> S2[逐份精读逐章节摘要]
    S2 --> S3[交叉比对记录冲突]
    S3 --> S4[硬指标自检]
```

### 整理原则

1. **逐份精读，不跨文档归并**：摘要按文档自身章节结构组织，不做跨文档的主题重组（那是下游的事）
2. **出处即章节号**：每条摘要标注 `D编号，§章节`，直接映射回原文位置
3. **冲突保留**：矛盾信息并列保留两个版本，不擅自裁决
4. **事实驱动**：以原始资料中的事实为准，不添加主观推断

---

## 附录 B：解析 Skill

- `md`：Markdown 类产品/业务/过程文档（README / SPEC / CHANGELOG / RELEASING / docs/ 全树 / assets 说明）
- `ts`：TypeScript 源码与测试（src/ 17 模块、test/ 40 文件、tsconfig/bin）
- `yaml`：YAML 类配置/图谱/机械化率（assets/ontology.yaml、harness/lifecycle.yaml、harness/discipline-coverage.yaml、docs/_tech_graph/*.graph.yaml、cordis.patch.yml）
- `json`：JSON 类清单/图谱切片（package.json、docs/_tech_graph/shared/graph.json、invoke_index.json）
- `example`：IDE 片段 / CI 样例模板（assets/ide/adapters/*.example、assets/ci/samples/*.example）
- `js`：CLI 壳（bin/dsh-coding-kit.js，编译产物 lib/ 不重复解析）
