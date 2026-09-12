# invoke · 30-execute-code + 40-self-check · W7 实现闭环（E1 HARNESS_META_HEADING 常量 + C7 dest 白名单显式化）

> **hat_id**：`30-execute-code` + `40-self-check`（同 Agent 闭环） · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w7-hygiene`  
> **帽条文**：`assets/harness/prompts/30-execute-code.md` · `40-self-check.md`

## 闸扫描（GATE_VERIFY · 首输出 · 读 task 人工闸表非 invoke 字面）

| human_gate_id | task表status | 用户/invoke声称 | 一致？ | blocks_30 | 30可开工？ |
|---------------|--------------|-----------------|--------|-----------|------------|
| HG-SPEC-SIGNOFF | approved | approved | Y | — | — |
| HG-NEXT-PLAN | approved | approved | Y | — | — |
| HG-TASK-DRAFT | approved | approved | Y | Y(20,30) | — |
| HG-AUDIT-R1 | approved | approved | Y | Y(30) | ✅ |

- reviews：`task_2_2_closed_loop_w7_hygiene_audit_R1_20260911.md` 存在且 R1 pass · 是
- pre-30 invoke：required ∩ {10,20,00} = {10,20,00} 三件齐全 · 是
- 机械辅助：`npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w7_hygiene.md` → **VERIFY: PASS（exit 0）**

## 动作

1. 读 task 全文 + 蓝本 SPEC 05（E1+C7 全篇）/ 06 §W7 + 帽条文 30/40；开工前重新 grep 实况：`## Harness 元信息` 字面量 4 文件 18 处（cli-checks 5 · cli 2 · cli-shared 8 · cli-task-extra 3）与 task 口径一致（W2/W3 未改这些行）。
2. 基线先行：`npm test` 447/447 绿（改前快照）。
3. E1：`src/cli-shared.ts` 导出 `HARNESS_META_HEADING = '## Harness 元信息' as const`；18 处全替换——代码点位直接引用常量，用户可见文案改模板插值 `${HARNESS_META_HEADING}`（含 CANONICAL_META_FALLBACK 反引号转义个案），注释点位改引常量名；输出字节等价。
4. C7：`src/cli-shared.ts` 增 `KIT_DSH_LAYOUT_DIR = '.dsh/coding-kit'` + `KIT_DEST_WHITELIST = [KIT_LAYOUT_DIR, KIT_DSH_LAYOUT_DIR] as const`（注释显式排除 `.cyning-harness`：仅 legacy 只读探测 · 事实卡 §10）；消费方收口——`index.ts`（init_coding_kit enum/校验/默认值）· `inject-collect.ts`（DEF-017 探测候选）· `cli-skills.ts`（isCodingKitDest 拒写判定 · 后缀匹配语义不变）。
5. `git status --porcelain` 核查边界：仅 7 个目标 src 文件改动；`.workbuddy/` 未跟踪档（D0 域）不触碰；`package.json` / `delivery/` 无裹挟（F-X-06 / D0-PROT）。
6. 40 自检：验收 7 条逐条自证（命令真实跑 · 输出贴 task 自检结论）→ 回填验收勾选 + 自检结论 + KPI + 经验（wiki_delta=none 作答维持）。

## 自证摘录（完整输出见 task 自检结论）

- `grep -rn '## Harness 元信息' src/` → 仅剩常量定义 1 处（cli-shared.ts · 常量值本身即该字符串，验收口径明示除外）
- `grep -rn "'.dsh/coding-kit'" src/` → 仅剩 `KIT_DSH_LAYOUT_DIR` 定义 1 处 · 白名单无散落字面量
- 四门：typecheck 0 错 · `npm test` **447/447 pass**（基线 447 · 纯重构零新增零失败）· build ✓ · test:lib 4/4
- 输出字节抽查：`npx tsx src/cli.ts --help` 与 `task lint-wiki-delta --help` 中 `## Harness 元信息` 文案原样保留（插值字节等价）
- `npx --yes spec-wave task lint-wiki-delta --target .` → LINT-WIKI-DELTA: PASS（scanned 54 · missing 0 · issues 0）
- 波末 `npx spec-wave gate-check --task <本 task>` → **exit 0 · 未发现阻塞**

## 停点

40 自检全绿 → 提交 `feat(2.2-W7): harness meta heading constant + dest whitelist`（逐文件显式 add · 禁 git add -A · 不 bump 版本）→ task close（`--yes` 成功打印 CLOSE: PASS 才算关账）。wiki_delta=none（纯内部重构无对外语义变更 · 不晋升 coding_wiki · 与 task 元信息 note 一致）。

## 已知边界（留痕 · 非阻塞）

- task 文案「406 用例」为拆波时旧数；实况基线 447（W1–W5 已合入新增用例），以实况为准并已在自检结论注明。
- `cli-skills.ts` help/fail 用户可见文案中 `.coding-kit` / `.dsh/coding-kit` 字样保留原样（输出零漂移红线）；白名单**定义**已单一真值化，残留均为消息文本非判定逻辑。
