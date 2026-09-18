# ACCEPTANCE · 3.0.1 patch（W1–W6 信号质量收口）台账

> **版本**：`spec-wave@3.0.1`（**待发版** · 2026-09-18 bump 已落 · tag `v3.0.1` **待人打** · registry `latest` 仍为 `3.0.0` 直至人 publish · **未**执行 tag / push / publish / deprecate）
> **task**：[`docs/tasks/done/task_3_0_1_release_bump.md`](../tasks/done/task_3_0_1_release_bump.md)（slug `3-0-1-release-bump` · 无独立 SPEC 夹 · 属 3.0.0 验收后 patch · **CLOSE: PASS** · 2026-09-18）
> **规划**：[`PLAN_3_0_1_patch_v1_zh.md`](PLAN_3_0_1_patch_v1_zh.md)（HG-NEXT-PLAN=approved）
> **依据**：W1–W6 done tasks + R1 审查文（各波 PASS · blocking 0）

## 修复清单（W1–W6 · 全 CLOSE: PASS）

| 波 | 级别 | 摘要 | task |
|----|------|------|------|
| W1 | P1 | 粘性可选 `table_source`；默认 `host verify` 取表与 `apply` 同源；非内置表源不可用 fail-closed，不静默退回内置 | [`task_3_0_1_w1_sticky_table_source.md`](../tasks/done/task_3_0_1_w1_sticky_table_source.md) |
| W2 | P2 | README 双语最小骨架 4 列 + 空解析告警（含 id 内嵌粗体子形态）；不放宽 `GATE_ROW_RE` | [`task_3_0_1_w2_gate_table_contract.md`](../tasks/done/task_3_0_1_w2_gate_table_contract.md) |
| W3 | P3 | `readTruthVersion` 坏 `package.json` → exit 2 + `PINS: BLOCKED`（与 `loadPins` 同形态） | [`task_3_0_1_w3_pins_io_failclosed.md`](../tasks/done/task_3_0_1_w3_pins_io_failclosed.md) |
| W4 | P2+P3 | MIGRATION §① 措辞精确化 · CHANGELOG `[3.0.0]` Tests 864 回填 · `files` 列 README.zh-CN · 研究文作者数区间化 · check-doc-links 注释口径 | [`task_3_0_1_w4_docs_precision.md`](../tasks/done/task_3_0_1_w4_docs_precision.md) |
| W5 | P2 | 可选 `--pin-hook-version`（实验性 · 缺省关闭）；不带旗标时物化与 3.0.0 逐字节一致 | [`task_3_0_1_w5_pin_hook_version.md`](../tasks/done/task_3_0_1_w5_pin_hook_version.md) |
| W6 | P3 | `check-terminology` 扫 CHANGELOG；`host validate` 对非映射宿主 `config-hook` 输出 PASS + WARN（apply 仍 fail-closed） | [`task_3_0_1_w6_mech_coverage.md`](../tasks/done/task_3_0_1_w6_mech_coverage.md) |

## 门禁基线（本棒实测 · 2026-09-18）

| 门禁 | 结果 |
|------|------|
| `npm run typecheck` | 0 错 |
| `npm test` | **906 tests / 903 pass / 2 tag-gated 设计红 / 1 门控 skip**（设计红 = `release-tag-identity` + `pins-consistency` A 组 pin-10 · **不是**产品回归 · 打 tag 后须全绿） |
| `npm run build` / `test:lib` | exit 0 · test:lib **6/6** |
| `pins check` | **16/17** · 唯一偏差 = pin-10 git tag `v3.0.1` 缺失（**设计红** · 待人打 tag 后复跑须 17/17） |
| `assets verify` | **113/113**（pins 改 ontology / discipline-coverage / host-adapt README 后 manifest rebuild ~3） |

## 已知残余

- pin-10 / `release-tag-identity` 在打 `v3.0.1` 前为**设计红**（F-REL-07）· 不记为产品回归。
- registry `latest` 与「已 published」叙事回填归人 publish 后 ⑨，本档不冒充已发布。

## 发布边界

- 本棒只做 bump 簿记。**未**执行 `git tag` / `git push` / `npm publish` / `npm deprecate`。**未**用 `npm version`。**未**改 W1–W6 产品行为 · **未**触 host-adapt schema。
- RELEASING 人 checklist `3.0.1` 节已备（全未勾选 · 含原子推规则 · 打 tag 后 pins 17/17）。
- 使用手册保留文件名 `docs/guides/使用手册-v3.0.0-zh.md`；头栏钉 `spec-wave@3.0.1`（待发版）。
- MIGRATION 已补「3.0.0 → 3.0.1 无强制动作项」。
