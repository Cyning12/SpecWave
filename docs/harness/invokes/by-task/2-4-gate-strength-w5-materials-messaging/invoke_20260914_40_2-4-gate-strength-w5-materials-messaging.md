# invoke · 40 · 2-4-gate-strength-w5-materials-messaging（自检）

> **hat**：40-self-check · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w5_materials_messaging.md`
> **自检结论全文**：task 文件「自检结论（执行者）」节（验收 ①–⑧ 逐条 · 三组 grep 前后对照 · 关账声称核查留档 · Task_KPI）

## 动作

1. 逐条核对验收 ①–⑧：GATE_VERIFY PASS → 4 份物料快照标注行逐份 grep = 1/1/1/1（改前黑名单词 3/5/7/11 命中留证）→ README/事实卡「可机检」零命中（exit=1 · 事实卡面纳入断言 · R1 T-5 防空转）→ 安全设计「篡改发现」零命中 + :77/:418/:768 三处收窄限定行 grep 留证 → 关账声称出现处清单（唯一 = 事实卡 :234）+ W2 落地一致口径留档 → aider 行双语 `conventions-file: AGENTS.md` 落地 + pin-17 表行命中不破。
2. 四门：`npm run typecheck` 0 错 · `npm test` 575 tests · 574 pass · 0 fail · 1 skipped（既有门控 skip · 与 2.3.1 基线同形态）· `npm run build` 通过 · `npm run test:lib` 6/6。
3. `node bin/specgate.js pins check` → PINS: PASS 17/17；`assets verify` → PASS 110/110。
4. 波末 `verify --task` PASS + `gate-check --task` 通过 → `task close --yes` 归档闭环（见关账记录）。

## 未做（禁区）

未 `git add -A`（9 文件逐路径精确 add）· 未 tag/push/publish/bump · 未动 src/test/CI（纯文档波零代码）· 未翻新物料正文（快照标注为定稿处置）· 未收窄真实防护控制（仅「篡改发现」口径三处定点 · F-W5-03 未触发）。

## 已知未测项

无。验收 ①–④ 全部 grep/pins 机械可判且已留证；⑤–⑧ 由四门 + 关账命令覆盖。
