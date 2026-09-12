# 05 · W7 · 工程健康小清理（E1 + C7）

> **状态**：`signed`（HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved · 人 2026-09-11 会话预授权 · 00 代签落表）· 隶属 `2_2-closed-loop-start`  
> **test_strategy**：`required`  
> **上游**：PROMPT §3 W7 证据行 + 路线研究 §2.3 / §4（E1 性价比 5.0 · C7 性价比 5.0）

---

## 1. 证据

- `## Harness 元信息` 字面量在 `src/` **4 文件重复 18 处**（前提校核 #12 实测：cli-checks 5 · cli 2 · cli-shared 8 · cli-task-extra 3，与路线研究口径一致）。
- dest 白名单（T-16）当前隐式；事实卡 §4 既定落盘目录为 `.coding-kit/`（主数据根）与 `.dsh/coding-kit/`（DSH 场景等价），`.cyning-harness/` 仅 legacy 只读探测。

## 2. 范围

- 抽 `HARNESS_META_HEADING` 单一常量，替换全部 18 处字面量。
- dest 白名单显式化为常量/常量集：`.coding-kit` · `.dsh/coding-kit`，供 init / host apply / 写盘路径判定统一消费。

## 3. 非范围

| 项 | 理由 |
|----|------|
| 拆 god-file（cli-host 1450 / cli 1105 / cli-checks 844 行） | E4 · 3.0 |
| 测试 spawn 削减（354 次） | E3 · 3.0 |
| `.cyning-harness` 入白名单 | 仅 legacy 只读探测 · 显式排除并加注释 |
| `isS2RelPath` 无调用方清理 | 2.3 工程健康波 |

## 4. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 常量集中在 `cli-shared.ts` 导出 | **采纳** | 现有公共层 · 18 处消费方均已 import 该模块 |
| 新建 constants 模块 | 备选 | 本波规模下过度设计 |
| 白名单散落各调用点 | 弃选 | 正是本波要消的病 |

## 5. 验收要点

1. `## Harness 元信息` 字面量 grep 归零（常量定义处除外）；行为无回归（406 用例全绿）。
2. 白名单单一真值；`.cyning-harness` 不在其中且代码注释明示「legacy 只读探测」。
3. typecheck 0 错 0 警。

## 6. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W7-01 | 替换遗漏（grep 仍有字面量残留） | 验收 FAIL |
| F-W7-02 | 常量替换改变输出字节（换行/空格漂移） | 测试红 · 回归 FAIL |
| F-W7-03 | 白名单误纳 `.cyning-harness` | 验收 FAIL · 违事实卡 §10 |

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~定稿~~ |
| **HG-NEXT-PLAN** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~开 W7 实现~~（按波次逐波开工） |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | draft · 10-spec |
| 2026-09-11 | signed · 双闸 approved（00 代签 · 审查文 R1 pass） |
