# invoke · 30-execute-code + 40-self-check · W4 实现闭环（init quickstart + README 核心对象）

> **hat_id**：`30-execute-code` + `40-self-check`（同 Agent 闭环） · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w4-dx-onboarding`  
> **帽条文**：`assets/harness/prompts/30-execute-code.md` · `40-self-check.md`

## 闸扫描（GATE_VERIFY · 首输出 · 读 task 人工闸表非 invoke 字面）

| human_gate_id | task表status | 用户/invoke声称 | 一致？ | blocks_30 | 30可开工？ |
|---------------|--------------|-----------------|--------|-----------|------------|
| HG-SPEC-SIGNOFF | approved | approved | Y | — | — |
| HG-NEXT-PLAN | approved | approved | Y | — | — |
| HG-TASK-DRAFT | approved | approved | Y | Y(20,30) | — |
| HG-AUDIT-R1 | approved | approved | Y | Y(30) | ✅ |

- reviews：`task_2_2_closed_loop_w4_dx_onboarding_audit_R1_20260911.md` 存在且 R1 pass · 是
- pre-30 invoke：required ∩ {10,20,00} = {10,20,00} 三件齐全 · 是
- 机械辅助：`npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w4_dx_onboarding.md` → **VERIFY: PASS（exit 0）**

## 动作

1. 读 task 全文 + 蓝本 SPEC 03 §W4（D1+D3）/ 06 §W4 + 事实卡 §10/§11/§12（黑名单 · 禁称 · 中文术语保留词）+ W5 task（互链对端口径）+ 帽条文 30/40。
2. **test_strategy=required 先红**：先写 `test/init.test.ts` 3 测（--yes 路径关键行断言 · dry-run 路径同打印断言 · quickstart 提到的命令对照 CLI usage 存在性 F-W4-01）→ 红（`INIT_QUICKSTART` 未导出 · 模块加载即败）→ 再实现。
3. 实现：
   - **D1** `src/cli.ts`：新增导出常量 `INIT_QUICKSTART`（3 步：① `sync prompts --yes` 显式化隐式前置 ② 按 TASK_TEMPLATE 建首个 task（说明是什么/放哪 · 仅指引文本不物化）③ `verify --task` 首验）；`cmdInit` 末尾两路径（`--yes` 与 dry-run）一致打印；语种英文先行（R2 口径 · 与 README 现状一致）· 文案与 README「Core objects」节互链。
   - **D3** `README.md` / `README.zh-CN.md`：入口区之后新增「Core objects / 核心对象」节——`task.md`（是什么/从哪来=sync prompts 模板/放哪=docs/tasks/active→done/最小骨架）+ `spec.md`（是什么/从哪来=帽 10 撰写/放哪=docs/spec/）；节内互链 init quickstart 与 GLOSSARY.md（W5 先行链）。
4. 40 自检：验收 8 条逐条自证（命令真实跑 · 输出贴 task 自检结论）→ 回填 task 验收勾选 + 自检结论 + KPI + 经验（wiki_delta=none 作答）。

## 自证摘录（完整输出见 task 自检结论与交付汇报）

- 先红：新增 3 测在实现前模块加载即败（`INIT_QUICKSTART` 不存在）；实现后 `node --test --experimental-strip-types test/init.test.ts` → **12/12 pass**（9 存量 + 3 新增）
- 实测 1（dry-run · --tools none · 临时目录）：`init 完成。` 后打印 3 步 quickstart · exit 0
- 实测 2（--yes 非交互 · --tools cursor · 临时目录）：`HOST APPLY: PASS` 后打印同一 quickstart · exit 0（两路径输出一致 · F-W4 表第 4 行）
- README grep 断言：`^## Core objects` / `^## 核心对象` 各 1 节 · `TASK_TEMPLATE.md` 各 2 处 · `docs/tasks/active/` 各 1 处 · `GLOSSARY.md` 各 1 处（双语对齐）
- 四门：typecheck 0 错 · `npm test` **447/447**（444 基线 + 3 新增）· build ✓ · test:lib 4/4；lint-wiki-delta PASS（scanned 54 · missing 0）
- S2 反向检查：`git status --porcelain` 仅 4 个本波文件（README×2 · src/cli.ts · test/init.test.ts）· **零新增文件**进 `docs/tasks/`（F-W4-02 反向自证）
- 事实卡自查：无 §10 黑名单表述（产品名 SpecWave / 命令 npx spec-wave）；无 §11 禁称（quickstart 只提已存在命令 · GLOSSARY 标注「lands with wave W5」未落地口径）；§12 中文术语保留词（门禁/帽制/人闸）一致
- 波末 `npx spec-wave gate-check --task <本 task>` → **exit 0 · 未发现阻塞**

## 停点

40 自检全绿 → task close（`--yes` 成功打印 CLOSE: PASS 才算关账）。wiki_delta=none（DX 文案落仓 README 与 init 输出 · 无可晋升 coding_wiki 增量 · 与 task 元信息 note 一致）。

## 已知边界（留痕 · 非阻塞）

- GLOSSARY.md 尚不存在（W5 对端）：README 双语「核心对象」节内为**先行链**，W5 落地后链接可解析并由 W5 补回链（task 依赖行 + residual_risks 已授权此形态；若 W4 单独合并，验收第 4 条以该口径挂起）。
- quickstart 英文先行（R2 荐 · 20 审 R1 pass 确认）；中文入口经 README.zh-CN「核心对象」节互链覆盖，不做双语同打印（弃 · 噪声）。
- init 既有输出（已写入 manifest / init 完成。）保持中文不动——本波只增不改既有文案（非范围：报错国际化 D4 · 2.3）。
