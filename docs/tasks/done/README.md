# done/ · 已完成任务导航（Hub）

> **用途**：日常浏览 **只打开本文件**。  
> **落盘**：`docs/tasks/done/`

---

## harness

| 关账日 | task | 摘要 |
|--------|------|------|
| 2026-09-14 | [`task_2_4_gate_strength_w5_materials_messaging.md`](./task_2_4_gate_strength_w5_materials_messaging.md) | 2.4.0 W5 · 物料与对外口径对齐（N3 + 口径三调 + N6 · 纯文档波零代码）：promotion 4 份逐份快照标注（文首「历史版本快照（2.1.3 时点）」+ 指向仓根 README 现行事实面 · 改前黑名单词 3/5/7/11 命中留证）· 口径调一事实卡 :221 行降调（assets verify 2.3.0 已交付但只许声称「防意外漂移/防遗忘」· README/事实卡「可机检」零命中 · R1 T-5 锚定防空转）· 口径调二安全设计三处收窄（:77 篡改发现→意外漂移发现 · :418 同步标注 · :768 A-1 行完整性依赖列追加「防漂移口径 · 防投毒依赖 provenance · 未启用」· 真实控制不动 F-W5-03）· 口径调三关账声称恢复（唯一出现处事实卡 :234 · W2 S1·N=20 已落地 → 可声称「关账必经结论级审查通过（机读文本闸）」+ 非人审等价限定 · 留档自检结论③）· N6 aider 行双语补 `conventions-file: AGENTS.md`（pin-17 表行词锚不破）· 四门绿 574 pass+1 门控 skip · pins 17/17 · assets 110/110 · 不 bump 版本号 |
| 2026-09-14 | [`task_2_4_gate_strength_w4_assets_observability.md`](./task_2_4_gate_strength_w4_assets_observability.md) | 2.4.0 W4 · 资产门禁可观测补全（N2/N5 · D-24-W4-WARN-ONLY）：N2 verify 排除项「排除但可见」——scanAssets 同扫出 excluded 清单（manifest 自身结构性排除不入 warning）· 人类面 `WARN: 排除项 N 个（不参与哈希校验）` 前 5 截断+总数汇总（F-W4-01）· `--json` 新增 `excluded` 字段（键集只增）· N2 先红后绿留证（stash 旧码复现静默 PASS）· N5 rebuild 追认警示单一常量三路（dry-run/--yes/幂等）输出「追认为真值 · 篡改随 rebuild 合法化 · provenance（未启用）」（口径同 guide 自述）· 快照断言两路锁文案（F-W4-03）· 三负向回退锁 +「warning 不掩负向」新钉（排除项+篡改并存仍 exit 2）· exit code/CI 判据零变更 · TEST-LOCK 3 处核对零联改 · 574 pass+1 门控 skip · pins 17/17 · assets 110/110 无 WARN · 不 bump 版本号 |
| 2026-09-14 | [`task_2_4_gate_strength_w3_output_rel.md`](./task_2_4_gate_strength_w3_output_rel.md) | 2.4.0 W3 · 输出层统一相对化（N12 · D-24-OUTPUT-REL-EXIT）：相对化从逐字段打补丁收敛为统一出口（cli-shared printJson/relativizeOutputValue · 深遍历字符串值 · 词法仓根前缀判据 + 路径边界 lookaround 防相对形误改）· 全部 26 处 stdout JSON 出口收敛（写盘面不动）+ V2 四处泄漏逐项修复前后对照留证（task lint#file · close#dest/done_snapshot.path · verify/gate-check#task · close 人类三行 · 另修 host validate#file 同型）+ 机械断言组 test/cli-json-no-abs-path.test.ts 21 测（19 个 --json 命令面绝对入参 · 负向自证 4 例真红 · 键集钉死 6 组）· 键集只增不改 · exit code/冻结文案不动 · TEST-LOCK 2 处联改 · 570 pass+1 门控 skip · pins 17/17 · assets 110/110 · 不 bump 版本号 |
| 2026-09-14 | [`task_2_4_gate_strength_w2_conclusion_gate.md`](./task_2_4_gate_strength_w2_conclusion_gate.md) | 2.4.0 W2 · 结论级闸强度增强（S1·N=20 定档）：评审先行硬前置（评审文 w2_conclusion_gate_strength_review_20260914 · S1/S2/S3 对比 + 存量 48 份实测 S1·N=20 误伤 0、S2 全灭否决）+ evalReviewConclusion 增节内容量判据（去全部通过词命中后非空白 ≥20 字符 · gi 全局 strip · 封堵 A2 收窄形态「结论节只写通过二字」）+ 六形态 fixture（A2 收窄/双变体/19-20 边界/合规正向/守卫回归/done 降级锁 · 修复前真红 exit 0→2 留证）+ 存量 66 份复测新判据波及 0（零波及登记 · 无新增豁免）+ TEST-LOCK 15 文件 24 处联改 · D-24-W2-NO-RETRO 不追溯存量 · 549 pass+1 门控 skip · pins 17/17 · assets 110/110 · 不 bump 版本号 |
| 2026-09-14 | [`task_2_4_gate_strength_w1_pins_extract.md`](./task_2_4_gate_strength_w1_pins_extract.md) | 2.4.0 W1 · pins 提取修正（核心波）：N7 pin-16 补 reference-definition 分支（refstyle 目标与 inline 同一归一/判定管线 · D-24-PIN16-REFSTYLE）+ N8 pin-17 词锚∧表行双命中（tagline/prose 顶包不计入 · D-24-PIN17-TABLEROW）+ N9 pin-08 语义格位锁定（版本真值只认状态列 cells[2] 点式 X.Y.Z · X_Y/X_Y_Z 不计入 · slug 列降为行身份辅助 · D-24-PIN08-SEMCELL）+ 三负向 fixture 固化 V1 构造（修复前逐一真红留证 · §3.H/§3.I/§3.J）+ T-1 消解（spec 索引 2.3.1 行 published 口径追认）+ F-W1-05「规划中」口径定稿入 yaml semantics · 543 pass+1 门控 skip · pins 17/17（pin-08 真仓对照实验 exit 0→2→0）· assets 110/110 · 不 bump 版本号 |
| 2026-09-14 | [`task_2_3_1_patch.md`](./task_2_3_1_patch.md) | 2.3.1 patch · 验收报告 §6 三项修复：N1 .bak 发布卫生六件套（gitignore/files 否定项/prepublishOnly 包内容断言 failClosed/pins fix 备份成功后自动清理 · 生产实证零 .bak 残留）+ N11 结论级闸强制结论节（禁回退全文 · A2 负向真红复现 · 存量波及 8 份循 W4 先例豁免留痕零静默）+ N13 豁免四字段显式类型判（00 无引号无效+留痕/"00" 命中/123 真红锁）+ bump 2.3.1（唯一手工点 + 叙事漂移改回 ×4 + 断言联改 8 文件双模式两轮 + RELEASING 人 checklist 2.3.1 节 + ACCEPTANCE_2_3_1 档 + spec 索引行 + manifest 110/110）· 540+6 新测 · pins 16/17（pin-10 tag-gated 设计红）· 零发布本体越权 |
| 2026-09-14 | [`task_2_3_wiring_release.md`](./task_2_3_wiring_release.md) | 2.3.0 release · 接线补全收尾 bump（2.2.1→2.3.0）：package.json 唯一手工点 + CHANGELOG 2.3.0 节先行（pin-13 首个命中防历史头回写）+ pins fix 9 落点对齐（16/17 + pin-10 tag-gated 设计红待人打 tag）+ 叙事漂移巡检 ×4 + 未钉引用/断言联改（8 测试文件 perl 双模式一轮清零）+ RELEASING 待办节+台账（九步顺序测一轮绿）+ ACCEPTANCE_2_3 档 + PLAN 波次表 + assets manifest 重生成 110/110 · 532/534（2 红 tag-gated 设计红）· 零发布本体越权（tag/push/publish 仅人） |
| 2026-09-14 | [`task_2_3_wiring_w7_dx_health.md`](./task_2_3_wiring_w7_dx_health.md) | 2.3.0 W7 · DX 与工程健康收官：根 README 双语宿主表 4→13（tagline 13 宿主概括 · 四行锚形态不变 + 九词锚逐字 · aider 注入层口径写明 `--read`/`.aider.conf.yml` · roo merged-PR 注明 · 钉点串不动）+ GLOSSARY 两处与实现一致化（four gates 按 task/SPEC/发版三层 · 7 具名帽物化口径 · 50 暂无物化 prompt）+ E2 去网络绑定（离线 fixture 伪造已安装布局 + 依赖闭包直拷 · 真装链路降为 SPEC_WAVE_E2E_NETWORK=1 门控双侧实证）+ E5 tsconfig +noUncheckedIndexedAccess（62 错/11 文件机械收窄 · 零运行时语义变更 · 熔断未触发）+ pin-17 豁免 9→0 关账（失陈债机检中间态 exit 2 worktree 复现留痕）· 534 pass+1 门控 skip · pins 17/17 · assets 110/110 · 不 bump 版本号 |
| 2026-09-13 | [`task_2_3_wiring_w6_host_completion.md`](./task_2_3_wiring_w6_host_completion.md) | 2.3.0 W6 · B4 宿主补齐（7→13）：六宿主取证卡先行（官方一手出处 · gemini 纠偏 GEMINI.md（AGENTS.md 不在默认 context.fileName）· opencode/zed=.agents/skills · cline=.cline/skills · roo=merged PR #10446 · aider 降级如实标注）+ 适配表六行零新资产（复用 agents 面）+ pin-17 数据面 +6 词锚/+6 豁免（四字段 since_wave · until_wave W7 统一关账 · D-23-W6-EXEMPT）+ isMarkdownMergeTarget +GEMINI.md（唯一 src 一行 · 红测擒获裸拷贝退化）+ DEF-009/pin-17 机检双拦截实证 · 534/534 · pins 17/17 · assets 110/110 · 根 README/RELEASING/事实卡宣称零改动（归 W7①/维护者）· 不 bump 版本号 |
| 2026-09-13 | [`task_2_3_wiring_w5_assets_integrity.md`](./task_2_3_wiring_w5_assets_integrity.md) | 2.3.0 W5 · A2 资产完整性校验：`assets/sha256.manifest`（110 条 sha256sum 行格式 · posix 排序 · 自身不入清单）+ `assets verify`（ok/mismatch/missing/extra 四态 · failClosed exit 2 · --json）+ `assets manifest rebuild`（dry-run 默认 · --yes · 幂等 · 修复对象=manifest 资产永不反向改 D-23-W5-FIX-TARGET）+ CI/prepublishOnly verify-only 接线（D-23-W5-GEN-CMD 不挂 build 钩子防门禁消解）+ 排除清单单一常量双侧一致（D-23-W5-EXCLUDE）· 522/522 · pins 17/17 · README/事实卡宣称零改动（解禁归维护者）· 不 bump 版本号 |
| 2026-09-13 | [`task_2_3_wiring_w4_gate_wiring.md`](./task_2_3_wiring_w4_gate_wiring.md) | 2.3.0 W4 · A5+A6 闸语义接线：评审文先行（D-23-W4-REVIEW-FIRST · 前提证伪→00 裁决 A→SPEC 04 修订重签 fa24638）+ G2 存在级→结论级 R1 通过判定（findLatestReview/evalReviewConclusion v2 口径 · close/verify 接入 · done 降级 warn）+ G4 W5–W7 warn-only（退出条件写死 D-23-W4-G4-EXIT）+ 裸 verify 仓级 reviews 扫描（FULL-reviews · done failClosed/active 信息报告）+ lint-done 帽级（INVOKE-HATS）+ reviews.CLOSE 强证据口径（A6 · close_evidence 新键）+ 过渡豁免数据 legacy-gate-exempt.yaml（26 项四字段留痕 · D-23-W4-TRANSITION 不追溯存量）+ discipline-coverage 四闸 closed 回写 · 513/513 · pins 17/17 · 不 bump 版本号 |
| 2026-09-12 | [`task_2_3_wiring_w3_security_observability.md`](./task_2_3_wiring_w3_security_observability.md) | 2.3.0 W3 · 安全与可观测性补全：C3 补漏 toRel 相对化（三处 --json target + 六面错误文案 · D-23-JSON-TARGET-REL 契约值变更 CHANGELOG 明示）+ exit 1 JSON 信封（exitWithCliError 单一实现源 · bin 接线擒获修复 + lib-smoke S4 钉面 · D-23-W3-ENVELOPE）+ quickstart 第 0 步 git 前提（双语 README 同步）+ C4 CI 顶层 permissions ×2 + audit job fail-closed（js-yaml 4.2.0→4.3.2 修平 · D-23-W3-AUDIT-GATE）+ secrets-scan job（gitleaks 8.28.0 --no-git · D-23-W3-GITLEAKS-FORM）+ C5 provenance/OIDC 指引（未启用 · 配置仅人 · RELEASING 零改动）· 505/505 · pins 17/17 · 不 bump 版本号 |
| 2026-09-12 | [`task_2_3_wiring_w2_pin_dimensions.md`](./task_2_3_wiring_w2_pin_dimensions.md) | 2.3.0 W2 · 钉面维度扩展（关联面一致性两维入钉）：前置修复 MIGRATION.md 入 files（R0 证伪 SPEC 前提 · 安装后真死链 [A]#3 同型）+ pin-16 files-whitelist-link（仓根级 + npm 自动入包并集白名单 · D-23-W2-CHECK-FORM）+ pin-17 readme-host-row（7 宿主双语分侧 · known_gaps 三宿主 until_wave: W7 + 失陈债机检自执行 · D-23-W2-W7-EXEMPTION）+ 测试 W2-B1..B10 · 495/495 · pins 17/17 · 不 bump 版本号 |
| 2026-09-12 | [`task_2_3_wiring_w1_pins_hardening.md`](./task_2_3_wiring_w1_pins_hardening.md) | 2.3.0 W1 · pins 机制补强（核心波）：pin-08 弱钉改严（D-23-PIN08-STRICT 双判 · 别行 prose 兜底反例杀伤）+ 三面入钉 pin-13/14/15（CHANGELOG 发布头 / MIGRATION / AGENTS · 纯数据）+ 失配 fixture 补 pin-04/06/07/10/11/12 + `extractSpecSlug` 目录型 slug 修复（D-23-SPEC-SLUG）+ unfixable 误报评估（结论不修）· 484/484 · pins 15/15 · 不 bump 版本号 |
| 2026-09-12 | [`task_2_2_1_patch.md`](./task_2_2_1_patch.md) | 2.2.1 patch · 验收报告 PASS-with-issues 四项修复：`resolveTaskPath` 双侧 realpath 归卡（C1 symlink 穿透封堵 · 四调用点单点收口）+ `pins fix` 按文件聚合（同文件多钉面一次写盘收敛）+ `.gitignore` 加 `.workbuddy/` + `files` 加 GLOSSARY.md · bump 2.2.1（pins 11/12 · pin-10 tag-gated 设计红待人打）· 462/464（2 红 tag-gated 设计红）· 提交 d77b707 + c828e5e · 零发布本体越权 |
| 2026-09-11 | [`task_2_2_closed_loop_w1_release_pins.md`](./task_2_2_closed_loop_w1_release_pins.md) | 2.2.0 W1 · A1 版本/身份钉自动化：`release-pins.yaml` 声明源 + `pins check/fix` + 门禁接线（D-PINS-EXIT exit 2 · S2 机械拒写）· 验收 ①–⑪ 自证 · 不 bump 版本号 |
| 2026-09-11 | [`task_2_2_closed_loop_w2_security_closure.md`](./task_2_2_closed_loop_w2_security_closure.md) | 2.2.0 W2 · C1+C3 安全封堵：`resolveTaskPath` 单点收口拒 target 外路径（D-W2-ABS-PATH-UX exit 1 + 迁移指引）· `--target` git-root 归属校验（gate 面）· `目标:` 打印相对化 · 439/439 测试 · 不 bump 版本号 |
| 2026-09-11 | [`task_2_2_closed_loop_w3_verify_json_fields.md`](./task_2_2_closed_loop_w3_verify_json_fields.md) | 2.2.0 W3 · C2 可观测字段：`verify --json` 只增不改补 `traceId`/`exitCode`/`source`/`injectedFiles`（inject-collect 收口 · exitCode 同源常量 · task/spec 双模）· 444/444 测试 · 不 bump 版本号 |
| 2026-09-11 | [`task_2_2_closed_loop_w4_dx_onboarding.md`](./task_2_2_closed_loop_w4_dx_onboarding.md) | 2.2.0 W4 · D1+D3 上手断档：`init` 完成打印 3 步 quickstart（sync prompts 隐式前置显式化 · 双路径同打印 · 命令对照 usage 存在性断言）+ README 双语「核心对象」节（task.md/spec.md 是什么/从哪来/放哪/最小骨架 · GLOSSARY 先行链）· 447/447 测试 · 不 bump 版本号 |
| 2026-09-11 | [`task_2_2_closed_loop_w5_glossary.md`](./task_2_2_closed_loop_w5_glossary.md) | 2.2.0 W5 · D2 双语 GLOSSARY：仓根 `GLOSSARY.md`（中英分节 · 4 组首小时概念 + 事实卡 §12 保留词 · 双语 5+5 对齐 · 回链 README 核心对象节）+ README 双语首屏链接 + W4 先行链互链闭合 · 447/447 测试 · 不 bump 版本号 |
| 2026-09-11 | [`task_2_2_closed_loop_w6_host_expansion.md`](./task_2_2_closed_loop_w6_host_expansion.md) | 2.2.0 W6 · B1 三宿主扩展：适配表 +copilot/codex/windsurf（原生读 AGENTS.md · 复用 agents 资产面 · 零 src 改动 · skills 落点 .github/.agents/.windsurf 官方口径取证）· release-pins 数据 +pin-11/12 · 459/459 测试 · 发布前对外不宣称新宿主数（F-W6-04）· 不 bump 版本号 |
| 2026-09-11 | [`task_2_2_closed_loop_w8_release_prep.md`](./task_2_2_closed_loop_w8_release_prep.md) | 2.2.0 W8 · 发版前 bump 2.1.3→2.2.0：pins fix 对齐 7 钉面 + 叙事漂移修复 ×3 + 断言联改 8 测试文件 · CHANGELOG 2.2.0 节归拢 W1–W7 · spec 索引行 IMPLEMENTED · 拦截早产 tag v2.2.0（维护者已删 · pin-10 待人打）· 457/459（2 红 tag-gated 设计红）· 提交 60b8640 · 零发布本体越权 |
| 2026-09-11 | [`task_2_2_closed_loop_w7_hygiene.md`](./task_2_2_closed_loop_w7_hygiene.md) | 2.2.0 W7 · E1+C7 工程健康：`HARNESS_META_HEADING` 单一常量替换 18 处字面量（模板插值保输出字节等价）+ `KIT_DEST_WHITELIST` dest 白名单单一真值（init / inject 探测 / skills 拒写同源性收口 · `.cyning-harness` 仅 legacy 只读探测显式排除）· 447/447 测试 · 不 bump 版本号 |
| 2026-08-28 | [`task_self_tech_graph_w4_closeout.md`](./task_self_tech_graph_w4_closeout.md) | self-tech-graph W4 dogfood 互链 + Docs · **已发 1.9.1** |
| 2026-08-28 | [`task_self_tech_graph_w3_ci_migrate.md`](./task_self_tech_graph_w3_ci_migrate.md) | self-tech-graph W3 CI + 02_version + inventory 迁回 · 随 1.9.1 发布 |
| 2026-08-28 | [`task_self_tech_graph_w2_yaml.md`](./task_self_tech_graph_w2_yaml.md) | self-tech-graph W2 yaml L0+L2 dogfood · 随 1.9.1 发布 |
| 2026-08-28 | [`task_self_tech_graph_w1_struct.md`](./task_self_tech_graph_w1_struct.md) | self-tech-graph W1 `01_struct` · ledger DEF-028~033 · HG-GRAPH-MODULES · 随 1.9.1 发布 |
| 2026-08-27 | [`task_self_tech_graph_w0_inventory.md`](./task_self_tech_graph_w0_inventory.md) | self-tech-graph W0 外置三树盘点 · 迁留定稿 · 随 1.9.1 发布 |
| 2026-08-27 | [`task_sync_prompts.md`](./task_sync_prompts.md) | sync prompts 子命令 · SHA-256 三分 · v1.9.0 |
| 2026-08-27 | [`task_prompts_ci_alignment.md`](./task_prompts_ci_alignment.md) | prompts/模板与 CI 对齐（K4/K6/K7）· v1.8.0（拟） |
| 2026-08-27 | [`task_close_done_snapshot.md`](./task_close_done_snapshot.md) | task close PASS 快照 + --json · v1.8.0（拟） |
| 2026-08-27 | [`task_verify_with_wiki_lint.md`](./task_verify_with_wiki_lint.md) | verify --with-wiki-lint 追加闸 · 与 CI 锁步 · v1.8.0（拟） |
| 2026-08-27 | [`task_wiki_delta_section_diagnostics.md`](./task_wiki_delta_section_diagnostics.md) | wiki_delta 错节诊断码 + task lint E8 · v1.8.0（拟） |
| 2026-08-26 | [`task_00_default_behavior_kit_1_7_1.md`](./task_00_default_behavior_kit_1_7_1.md) | 00 默认编排纪律入 Starter · v1.7.1 |
| 2026-08-26 | [`task_doc_health_close_binding.md`](./task_doc_health_close_binding.md) | doc-health CLOSE 强绑定 W1–W4 · v1.7.0 |

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-08-26 | 初建 Hub（doc-health 关账） |
| 2026-08-27 | 增 sync-prompts 关账行 |
| 2026-08-28 | 增 self-tech-graph W1 关账行 |
| 2026-08-28 | 增 self-tech-graph W2 关账行 |
| 2026-08-28 | 增 self-tech-graph W3 关账行 |
| 2026-08-28 | 增 self-tech-graph W4 关账行 |
| 2026-08-28 | 1.9.1 已发布（npm latest · tag v1.9.1） |
| 2026-09-11 | 增 2.2.0 W1 release-pins 关账行 |
| 2026-09-11 | 增 2.2.0 W2 security-closure 关账行 |
| 2026-09-11 | 增 2.2.0 W3 verify-json-fields 关账行 |
| 2026-09-11 | 增 2.2.0 W6 host-expansion 关账行 |
| 2026-09-11 | 增 2.2.0 W7 hygiene 关账行 |
| 2026-09-12 | 增 2.3.0 W1 pins-hardening 关账行 |
| 2026-09-12 | 增 2.3.0 W2 pin-dimensions 关账行 |
| 2026-09-13 | 增 2.3.0 W3 security-observability 关账行 |
| 2026-09-13 | 增 2.3.0 W4 gate-wiring 关账行 |
| 2026-09-14 | 增 2.4.0 W2 conclusion-gate 关账行 |
| 2026-09-14 | 增 2.4.0 W4 assets-observability 关账行 |
