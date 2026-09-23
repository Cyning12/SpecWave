# invoke · 10-task · 3-0-2-w2-pins-consumer

> **hat_id**：`10-task` · **日期**：2026-09-23  
> **task_slug**：`3-0-2-w2-pins-consumer`  
> **性质**：PLAN_3_0_2 W2 起草棒（消费侧反馈 F-3+F-4 · additive 能力波）

## 产出

- [`docs/tasks/done/task_3_0_2_w2_pins_consumer.md`](../../../../tasks/done/task_3_0_2_w2_pins_consumer.md)（初稿 · 闸表 4 列裸 id · R0–R5 预置 · A1–A13）

## 关键实读（行号钉）

- `src/cli-pins.ts:62-83`（loadPins 缺档 failClosed · F-3 不可用根因）· `:85-106`（readTruthVersion version 硬读 · F-4 根因 `:104`）
- `:590-594` runPinsCheck · `:612-652` planFix/unfixableReason · `:676-798` cmdPinsCheck/cmdPinsFix/cmdPins 旗标环（复用面）
- `src/cli/usage.ts:87-88`（usage pins 节）

## 关键取舍（入 R2）

声明源存在即替代默认钉面 · 逐文件合成具体 pin 不扩 Pin schema · ^/~ 归一+WARN 不硬拒 · `--truth` 限 --consumer 域。

## 机械闸

- `task lint` PASS（W3 占位提醒为 draft 期合法）

## 交接

- 下一棒：20-task-audit R1 → 00 代签 HG-AUDIT-R1 → 30/40（**须待 W1 close 后串行派发 · 同工作区**）
