# done/ · 已完成任务导航（Hub）

> **用途**：日常浏览 **只打开本文件**。  
> **落盘**：`docs/tasks/done/`

---

## harness

| 关账日 | task | 摘要 |
|--------|------|------|
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
