# invoke · 30-execute + 40-self-check · 3-0-2-w2-pins-consumer

> **hat_id**：`30` + `40` · **日期**：2026-09-23  
> **task_slug**：`3-0-2-w2-pins-consumer`  
> **性质**：W2 pins consumer 模式（F-3/F-4 · additive 能力波 · release 面冻结）  
> **作者链（delegate-only 全程守住 · 00 未写实现码）**：设计草稿 `c88a94be`（A1 红测档 + 函数级设计草稿）→ 实现草稿 `79f0145b`（cli-pins 全文草稿）→ 誊写接线 `de06a1af` fork（微批①函数层/段6 fix 路径/段8 测试）· 文案 `fc81c6ef` fork（段7）· R-1 设计裁决 00（无字面 workflow 预筛）

## GATE_VERIFY（首输出 · 留证）

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_2_w2_pins_consumer.md
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS
```

## 委派过程留痕（微批化 · 三次节奏干预）

| 批 | 执行体 | 产出 | 验证 |
|----|--------|------|------|
| A1 红测档 + 设计草稿 | c88a94be | test/pins-consumer.test.ts 骨架（A1×4 · 红 4/4 留证）+ 函数级设计 | 红 = `pins 未知参数: --consumer` exit 1 |
| 实现草稿（未落盘 · 全文移交） | 79f0145b | PINS_USAGE/四新函数/printCheckHuman header/命令层/旗标环 + 三注意点（含 R-1 触发点②） | — |
| 微批① 函数层 + check 路径 | de06a1af | src/cli-pins.ts +213/−6 | A1 4/4 转绿 · pins-consistency 64/64 · w3 6/6 · typecheck 0 |
| 段6 fix 路径 | de06a1af | 累计 +231/−8（runPinsFixBody 抽取共享） | 64/64 零回归 · A1 4/4 · typecheck 0 |
| 段7 文案面 | fc81c6ef | usage.ts +3 · README×2 +29/+29 · MIGRATION +11 | pins check 17/17 · terminology PASS · grep 仅 @3.0.1 |
| 段8 A2–A7 测试 | de06a1af | 测试档全文 19 用例（A2×5/A3×3/A4×2/A6×4/A7×1） | 19/19 · 64/64 · 6/6+34/34 · typecheck 0 |

**节奏教训**：两名首派 Agent 在「大体量实现自由生成」环节各空转 3–4 轮（磁盘零产物）；解法是草稿（消息文本）与誊写（fork 微批机械规格）分离 · 三次「中断+收窄+重贴规格」均立即促成交付 · 「零产出≠无产出」（c88a94be 晚产出完整交付）。

## 改动摘要

| 文件 | 变更 |
|------|------|
| `src/cli-pins.ts` | **+231/−8**（全 additive）：consumer 常量/声明源加载（存在且坏≠缺失）/真值归一（^~ 归一+WARN）/readConsumerTruth（--truth+F-4 回退链）/escapeRe/synth 默认钉面（R-1 预筛 · 稳定 id）/printCheckHuman 可选 header/check 与 fix consumer 命令/runPinsFixBody 共享/旗标环（--truth 限域） |
| `test/pins-consumer.test.ts` | 新档 19 用例（A1–A7 全绿 · A4b=R-1 预筛例） |
| `src/cli/usage.ts` | consumer 两行 + 分工注 |
| `README.md` / `README.zh-CN.md` | 各 +29 小节（@<x.y.z> 占位 · pin-05/06 不破） |
| `MIGRATION.md` | 「3.0.1 → 3.0.2 无强制动作项」+ 修订行 |

**未触**：release 模式行为/输出（64/64 逐字钉死）· extract/expected kind · 锁档 · 多包 · F-1②/F-2 · CHANGELOG（release 波）· schema · tag/push/publish。

## 自证（A1–A13）

A1 回退链四态 ✅ · A2 --truth 三态+越界 ✅ · A3 归一 WARN/非精确拒 ✅ · A4 默认钉面闭环（dry-run 零写盘无 .bak → --yes 写盘 → 复跑 PASS · consumer-wf-ci）✅ · A5 零落点提示行 ✅ · A6 声明源（替代语义/package_name/坏不回落/越界）✅ · A7 S2 拒写零写盘 ✅ · A8 release 零回归（pins-consistency 64/64 · w3 6/6 · json-no-abs-path 34/34 多次复跑）✅ · A9 信封只增（mode/truth_source/warnings · printJson 相对化）✅ · A10 输出点名 [consumer]+真值来源 ✅ · A11 文案四件（grep 仅 @3.0.1 命中 · 占位形态）✅ · A12 四门（typecheck 0 · **npm test 929 · 928 pass + 1 skip · 0 fail** · build 0 · test:lib 6/6）✅ · A13 gate-check + close（00 执行 · commit 00）✅

## 环境留痕

- 本机 `~/.npm-local` root-owned ⇒ npm pack EPERM；`npm_config_cache=/tmp/npm-cache-302` 绕过 · **人 publish 前须根治（已入 00 发版提醒）**。
- check-doc-links S2 计数 = in-flight 过程件须保持 tracked（本波过程档全程 staged · 复绿口径同 W1）。

Wiki: none（能力波 · 无规范增量）
