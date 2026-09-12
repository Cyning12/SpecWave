# invoke · 30-execute-code + 40-self-check · W1 实现闭环（release pins）

> **hat_id**：`30-execute-code` + `40-self-check`（同 Agent 闭环） · **日期**：2026-09-11  
> **task_slug**：`2-2-closed-loop-w1-release-pins`  
> **帽条文**：`assets/harness/prompts/30-execute-code.md` · `40-self-check.md` · `FRAGMENT_30_gate_verify_v1_zh.md`

## 闸扫描（GATE_VERIFY · 首输出 · 读 task 人工闸表非 invoke 字面）

| human_gate_id | task表status | 用户/invoke声称 | 一致？ | blocks_30 | 30可开工？ |
|---------------|--------------|-----------------|--------|-----------|------------|
| HG-TASK-DRAFT | approved | approved | Y | Y | — |
| HG-AUDIT-R1 | approved | approved | Y | Y | ✅ |

- reviews：`task_2_2_closed_loop_w1_release_pins_audit_R1_20260911.md` 存在且 R1 pass（零阻塞）· 是
- pre-30 invoke：required ∩ {10,20,00} = {10,20,00} 三件齐全 · 是
- 机械辅助：`npx spec-wave verify --target . --task docs/tasks/active/task_2_2_closed_loop_w1_release_pins.md` → **VERIFY: PASS（exit 0）**

## 动作

1. 读 task 全文 + 蓝本 SPEC 01 + 00 政策 + 06 波次 + 审查文 R1 + 帽条文 30/40 + 现状文件（package.json / ci.yml / ontology / discipline-coverage / README 双语 / RELEASING / docs/spec/README.md）。
2. **第 0 步（D0-PROT）**：D0 预存改动单独提交 `a072c0d`（精确 5 路径：delivery/promotion/01–04 + package.json 的 description/keywords · 信息 `docs(2.2-W0): promotion refresh + package metadata（D0 · 外部已完成）`）。
3. **test_strategy=required 先红**：先写 `test/pins-consistency.test.ts`（15 测）→ 红（pins 命令不存在 / 声明源缺失）→ 再实现。
4. 实现：`assets/release-pins.yaml`（钉面 10 行数据 · 钉面#8 语义入 `extract.semantics`）；`src/cli-pins.ts`（check/fix）；`src/cli.ts` dispatch + usage。
5. 文档两项：docs/spec/README.md 补 2.1.3 patch 收尾行（D-SPEC-213-ROW · 不建夹）；`2_2-closed-loop-start` 行 draft/pending → signed（⑥）。
6. 门禁接线：package.json `prepublishOnly` 链尾 `&& node bin/specgate.js pins check`；ci.yml test job `timeout-minutes: 15` + pins check 步骤。
7. 40 自检：验收 ①–⑪ 逐条自证（命令真实跑 · 输出贴 task 自检结论与本 invoke）→ 回填 task「自检结论（执行者）」+ KPI + 勾选。

## 自证摘录（完整输出见交付汇报）

- 干净树 `npx spec-wave pins check` → **exit 0** `PINS: PASS · 10/10 落点一致`
- 破坏 `product_semver: "9.9.9"` → `[mismatch] pin-03 assets/ontology.yaml:7 · actual="9.9.9" expected="2.1.3"` → **exit 2**；破坏态 `pins-consistency` 15 测 **1 fail**（A组真失败）；`pins fix` 无 --yes = dry-run 零写盘；`pins fix --yes` 写回 2.1.3 + `.bak` 备份 → 复跑 check **exit 0**；fix 复跑 `无偏差 · 0 处修改（幂等）`
- S2 反向验证：fixture fixable 落点 `docs/tasks/evil.md` → `pins fix --yes` → **exit 2** `REFUSED · S2 拒写（机械 · 无豁免参数）` · 文件未改 · 零备份残留（另由测试 B5 钉死）
- 四门：typecheck 0 错 · `npm test` **421/421** · build ✓ · test:lib 4/4
- `gate-check --task` → exit 0 未发现阻塞

## 停点

40 自检全绿 → task close（`--yes` 成功打印 CLOSE: PASS 才算关账）。wiki_delta=none（产品机制新增 · 非编码规范增量 · note 已在 task 元信息）。
