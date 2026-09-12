# invoke · 30-execute-code + 40-self-check · W8 bump 闭环（2.1.3 → 2.2.0 发版准备）

> **hat_id**：`30-execute-code` + `40-self-check`（同 Agent 闭环 · DSH 子代理执行） · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w8-release-prep`  
> **帽条文**：`assets/harness/prompts/30-execute-code.md` · `40-self-check.md`

## 闸扫描（GATE_VERIFY · 首输出 · 读 task 人工闸表非 invoke 字面）

| human_gate_id | task表status | 用户/invoke声称 | 一致？ | blocks_30 | 30可开工？ |
|---------------|--------------|-----------------|--------|-----------|------------|
| HG-SPEC-SIGNOFF | approved | approved | Y | — | — |
| HG-NEXT-PLAN | approved | approved | Y | — | — |
| HG-TASK-DRAFT | approved | approved | Y | Y(20,30) | — |
| HG-AUDIT-R1 | approved | approved | Y | Y(30) | ✅ |

- reviews：`task_2_2_closed_loop_w8_release_prep_audit_R1_20260911.md` 存在且 R1 pass · 是
- pre-30 invoke：required ∩ {10,20,00} = {10,20,00} 三件齐全 · 是
- 机械辅助：`npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w8_release_prep.md` → **VERIFY: PASS（exit 0）**；`task lint --file` → LINT: PASS

## 动作

1. 读 RELEASING.md 硬步骤 ①–⑤ + task 全文 + release-pins.yaml 钉面声明；基线 pins check @2.1.3 = 12/12 PASS。
2. package.json version → 2.2.0（唯一手工版本改动点；不用 `npm version` 防顺手打 tag 越界）。
3. `pins check` → 7 钉面失配（pin-03/04/05/06/07/11/12）→ `pins fix --yes` 写入 7 处 → 复跑 pin-11 仍失配 → 定位同文件双钉面（pin-11/12）串行写覆盖缺陷 → 二跑幂等收敛。
4. 手工修正留痕：叙事漂移 ×3（README 双语 :363 · RELEASING :13 被机械改成「2.2.0 已 published」假叙事 → 改回「待发版 · 当前 published=2.1.3」真值）；pins 未钉现行版本引用联改（README 迁移节 ×4 · MIGRATION ×5 · AGENTS dogfood 行 · kit_semver 示例）；测试断言联改 8 文件（含正则转义形态二轮 perl 补齐）。
5. CHANGELOG Unreleased 归拢为 `## [2.2.0] - 2026-09-11`（W1–W7 全汇总 · 待发版口径）；docs/spec/README.md `2_2-closed-loop-start` 行 → signed · IMPLEMENTED · 待发版。
6. **重大发现上报**：本地早产轻量 tag `v2.2.0`（指 823325f@2.1.3 · origin 远端无）→ release-tag-identity 红 · 上报 parent；维护者侧已删除 → pin-10 转「git tag 缺失」设计红。
7. 四门：typecheck ✓ · build ✓ · test:lib 4/4 ✓ · npm test 457/459（2 红均 tag-gated 设计红）；gate-check exit 0。
8. 提交 `60b8640` `chore(release): bump to 2.2.0 — closed-loop start`（19 文件精确 add · 禁 git add -A · 无 .workbuddy/.bak 裹挟）→ 40 自检回填 task（验收 8/8 · 自检结论真实命令表 · KPI 95 · 经验 4 条）。

## 停点

40 自检完成 → task close（`--yes` 打印 CLOSE: PASS 才算关账）。**未执行**：git tag · git push · npm publish/deprecate（发布本体归维护者 · 禁令守住）。wiki_delta=none（发版簿记无规范增量 · 与 task 元信息一致）。

## 已知边界（留痕 · 非阻塞）

- pins check 12/12 与 npm test 459/459 须维护者在 60b8640 上打 `v2.2.0` 后复跑确认（RELEASING ⑤ 既定序）。
- `.bak` 备份 ×6 留本机回滚（未入库）。
- pins fix 同文件双钉面串行写覆盖缺陷 = 候选债项（CHANGELOG 2.2.0 Docs 节已留痕）。