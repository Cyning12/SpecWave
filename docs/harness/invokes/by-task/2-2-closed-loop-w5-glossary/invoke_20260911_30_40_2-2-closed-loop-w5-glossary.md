# invoke · 30-execute-code + 40-self-check · W5 实现闭环（双语 GLOSSARY + README 首屏链接）

> **hat_id**：`30-execute-code` + `40-self-check`（同 Agent 闭环） · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w5-glossary`  
> **帽条文**：`assets/harness/prompts/30-execute-code.md` · `40-self-check.md`

## 闸扫描（GATE_VERIFY · 首输出 · 读 task 人工闸表非 invoke 字面）

| human_gate_id | task表status | 用户/invoke声称 | 一致？ | blocks_30 | 30可开工？ |
|---------------|--------------|-----------------|--------|-----------|------------|
| HG-SPEC-SIGNOFF | approved | approved | Y | — | — |
| HG-NEXT-PLAN | approved | approved | Y | — | — |
| HG-TASK-DRAFT | approved | approved | Y | Y(20,30) | — |
| HG-AUDIT-R1 | approved | approved | Y | Y(30) | ✅ |

- reviews：`task_2_2_closed_loop_w5_glossary_audit_R1_20260911.md` 存在且 R1 pass · 是
- pre-30 invoke：required ∩ {10,20,00} = {10,20,00} 三件齐全 · 是
- 机械辅助：`npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w5_glossary.md` → **VERIFY: PASS（exit 0）**

## 动作

1. 读 task 全文 + 蓝本 SPEC 03 §W5（D2）/ 06 §W5 + 事实卡 §10/§11/§12（黑名单 · 禁称 · 中文术语保留词）+ W4 done task（互链对端 · 先行链口径）+ README 双语「核心对象」节现状 + 帽条文 30/40。
2. `git status --porcelain` 核查边界：仅 `.workbuddy/` 未跟踪档（D0 域 · 本波不触碰）；`delivery/promotion/` 与 `package.json` 无未提交改动（F-X-06 / D0-PROT 不裹挟）。
3. 实现（test_strategy=recommended · 文档面）：
   - 仓根新增 `GLOSSARY.md`：中英分节双语（R2 荐 · 20 审 R1 pass 确认）——4 组首小时概念 `task.md`/`spec.md` · `Harness` · `hat`（帽制 8 帽两组 · starter 4 + extended 4 · 事实卡 §4 口径）· `kit-*`（编排薄壳 · verify 真值在 CLI）+ 事实卡 §12 保留词组（门禁 / 人闸 / 过程轨 / 帽制 / 真值源 / S2）；双语 `###` 条目 5+5 一一对齐；回链 README「核心对象」节锚点（`README.md#core-objects` / `README.zh-CN.md#核心对象`）不重复定义。
   - `README.md` / `README.zh-CN.md`：首屏（第 9 行 blockquote 内）各加 GLOSSARY 链接 1 处；W4 留的「lands with wave W5 先行链」caveat 改为已落地互链文案（互链闭合）。
4. 40 自检：验收 8 条逐条自证（命令真实跑 · 输出贴 task 自检结论）→ 回填 task 验收勾选 + 自检结论 + KPI + 经验（wiki_delta=none 作答）。

## 自证摘录（完整输出见 task 自检结论与交付汇报）

- GLOSSARY 关键条目：`task.md`×6 · `spec.md`×6 · `Harness`×4 · `hat`×12 · `kit-*`×2（4 组齐备）；§12 保留词：门禁×4 · 过程轨×4 · 帽制×5 · 人闸×4 · 真值源×3
- 双语对齐：`grep -c "^### " GLOSSARY.md` = 10（EN 5 + ZH 5 同名对齐）
- README 首屏：`head -30` 双语各命中第 9 行 GLOSSARY 链接 · 目标文件存在（相对链接仓内可解析）
- 互链：GLOSSARY 回链 README 核心对象节锚点 ×2+×2；`lands with wave W5` / `随 W5 落地` 残留 grep 零命中（先行链闭合）
- 事实卡自查：§10 黑名单（dsh-coding-kit/SpecGate/60+ 测试/1.10.0）GLOSSARY 零命中；§11 无禁称（门禁写「CLI 进程内判定 · 不依赖宿主 hook」· 未提 hooks 注入/审计落盘/provenance/本体机检）；数字仅引事实卡 §4/§5（8 帽 4+4 · 4 人闸 · exit 2）
- 四门：typecheck 0 错 · `npm test` **447/447 pass**（基线 447 · 纯文档面无新增测试）· build ✓ · test:lib 4/4；lint-wiki-delta PASS（scanned 54 · missing 0 · issues 0）
- 波末 `npx spec-wave gate-check --task <本 task>` → **exit 0 · 未发现阻塞**

## 停点

40 自检全绿 → task close（`--yes` 成功打印 CLOSE: PASS 才算关账）。wiki_delta=none（GLOSSARY 属仓根对外文档 · 非 coding_wiki 晋升对象 · 术语口径以事实卡 §12 为准 · 与 task 元信息 note 一致）。

## 已知边界（留痕 · 非阻塞）

- GitHub 渲染锚点跳转未实测：`#core-objects` / `#核心对象` 按 GitHub slugify 规则推导，相对链接目标文件在仓内存在已实证；若渲染锚点不符，后续波次修正（文档面 · 可重试）。
- 术语口径未来若事实卡改版须同步 GLOSSARY（task residual_risks 已留痕 · 修订记录即同步点）。
