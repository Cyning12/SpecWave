# Invoke：00 · 3-0-1-w3-pins-io-failclosed · 代签 → 派 30

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-1-w3-pins-io-failclosed` |
| review | `docs/harness/reviews/task_3_0_1_w3_pins_io_failclosed_audit_R1_20260918.md` |
| created | 2026-09-18 |

## 代签

| 闸 | 状态 | 依据 |
|----|------|------|
| HG-TASK-DRAFT | approved | lint PASS · invoke 齐 |
| HG-AUDIT-R1 | approved | R1 PASS · blocking 0 |

授权：维护者「授权签收过程文档」· HG-RELEASE 不在范围。

## 带入 30

1. `readTruthVersion` try/catch → exit 2 + `PINS: BLOCKED`（对齐 loadPins）
2. 收敛 existsSync/read TOCTOU；**缺文件原分支文案保留**
3. 三负向：截断 JSON / chmod 000 / 冲突标记 → exit 2 + 前缀
4. 不改 pins check PASS / pins fix / 其他 exit 档位

## 下一棒

30/40：GATE_VERIFY → 实现 → 四门 → `task close --yes` · 建议 `fix(3.0.1-W3): …` · **不要 git commit**

## 修订

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 00 代签双闸 · 派 30/40 |
