# invoke · 30 · 2-4-gate-strength-w2-conclusion-gate（实现留痕）

> **hat**：30 实现棒 · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w2_conclusion_gate.md`
> **双前置核对**：GATE_VERIFY PASS（HG-TASK-DRAFT / HG-AUDIT-R1 双 approved）· 强度方案评审文已落盘 `docs/harness/reviews/w2_conclusion_gate_strength_review_20260914.md`（定档 S1·N=20 · 经 20-task-audit R1）——D-24-W2-REVIEW-FIRST 消解。

## 1. 实现（评审文 §5 伪码照做）

`src/cli-checks.ts` `evalReviewConclusion`：

- 新增 `REVIEW_MIN_SUBSTANCE = 20` 与 `REVIEW_PASS_STRIP_RE = new RegExp(REVIEW_PASS_RE.source, 'gi')`（现 `REVIEW_PASS_RE` 为 `i` 非全局 · strip 须全局避免只去首个命中后残留其他通过词凑数 —— 评审文 §5 注意事项照做）。
- 判据链：否定守卫（不动）→ 通过词落节内（不动）→ **substance = text 去全部通过词命中后非空白字符数 < 20 → 判未通过**（failClosed 方向 · detail 点名 S1·N=20）→ 现有 pass 分支（不动）。
- exit code 语义与豁免机制零改动；新行为不追溯存量（D-24-W2-NO-RETRO · done 面 warn 降级既有路径不动）。

## 2. 红→绿留证

修复前（2.3.1 码 · tmp fixture）：`## 结论\n通过` 与 `## 签收\nPASS` → `verify --task` **exit 0**（残余缺口复现 · 真红）。
修复后：A2 收窄形态 exit 2（非空白 4<20）· 变体 exit 2（2<20 / 4<20）· 边界恰 19 exit 2 / 恰 20 exit 0 · 合规正向 exit 0 · 守卫回归（通过词+实质内容+未否定「退回」）exit 2。命令与输出全文见 task「自检结论（执行者）」节验证表；六形态固化进 `test/cli-w4-gate-wiring.test.ts` 2.4-W2 describe。

## 3. 存量复测（零波及）

`/tmp/w2_retest.mts`（一次性制品 · 真实新 `evalReviewConclusion` · findLatestReview 同名口径 · 双目录最高 R 轮）对 `docs/tasks/done/` 66 份 task 全量复测：无匹配审查文 5 · PASS 48 · FAIL 13 全部死于既有判据（5 无通过词 + 8 无结论节 = 2.3.1 N11 豁免/既有缺口面）· **新判据（内容量不足）波及 = 0**，与评审文 0/48 实测一致 → 零波及登记 · 无新增豁免条目。裸 `verify --target .` PASS（豁免留痕 5 条全为 2.3.1 N11 既有条目）。

## 4. TEST-LOCK 联改

旧测试 fixture 串 `PASS · 零内容阻塞（fixture）` 去通过词后 substance=14<20（R2 变体 19<20）→ grep `零内容阻塞（fixture` 全量留证并联改 15 文件 24 处，统一追加实质结论句（substance=42 ≥20 · 存量 min=40 余量口径内）。

## 5. 其他

`assets/harness/discipline-coverage.yaml` G2 note 回写 2.4-W2 S1·N=20 · `assets manifest rebuild --yes` 重登记（~1 变更）· assets verify PASS 110/110。
