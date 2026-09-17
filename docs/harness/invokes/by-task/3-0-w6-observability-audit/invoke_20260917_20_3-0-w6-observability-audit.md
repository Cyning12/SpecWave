# Invoke：20（task-audit R1）· 3-0-w6-observability-audit

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w6-observability-audit` |
| task_paths | `docs/tasks/active/task_3_0_w6_observability_audit.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要

对 W6 task（3.0 可观测与审计 · C6 结构化审计日志落盘 + F4 S2 公理接真实触发源 + G2/G4 闸接线 + N2-C verify 补 lint + G7 执行证据 + coverage 回写）做 R1 书面审查：对照 SPEC 07 / PLAN W6+硬约束 1/2/6/7/10/14/15 逐项核对范围/非范围/验收/failure_paths/思考轮；逐条裁定 10-task 留下的五条重点（G2 对账口径 · G7 诚实口径 vs SPEC ⑦ 字面 · 闸行裁决不设 HG-SCHEMA-CHANGE · 两个草案裁决（gitignore 观测面分工 / 默认开无 opt-out）· G4 升级依据）；审查文落盘 `docs/harness/reviews/`。**禁止**改 task 实质、代签 HG-AUDIT-R1、改 src/assets/SPEC/PLAN。

## 独立复核证据（本帽实测）

- `npm test` 全量复跑：**810 tests / 154 suites / 809 pass / 0 fail / 1 skip**（98.3s · 基线 ≈96s 机差量级）· typecheck **0 错** · pins **17/17 PASS** · HEAD `b461b34`（= W5 close 归档 commit）· 工作区 untracked = 本 task 1 件（与声称一致）· tag `v2.4.2` 在 · dependencies 仅 `js-yaml` ^4.1.0 · `docs/harness/audit/` 不存在（实证）—— 与基线节逐字一致；W5 锁终态交叉一致
- **G2 已接线实证**：verify.ts:323-328 存在级 `VERIFY: BLOCKED · missing R<n> review` exit 2 + :329-335 `--allow-no-review` 真豁免留痕 + :338-371 结论级（active failClosed :365-368 · done warn 降级/豁免 :347-364）+ close-guards.ts:95-111 evalCloseReview（存在+结论双判）+ CLOSE_GUARD_ORDER 第 6 位 close_review（usage.ts:8-22）+ 既有测试钉死（cli-verify-review.test.ts:90-97 红→绿钉死注释逐字 + :111/:142/:153 + cli-verify-observability.test.ts:130 + w2-shell-hook.test.ts:201）· yaml gaps G2 closed 2.3.0 ✓ · 真残留 = statements C1/C2 not_wired（note「本包未接线（findReview 仅 status 使用）」被 verify.ts:323 消费证伪 = 过期属实）· D3 not_wired ✓
- **G4 warn-only 实证**：lint.ts:102-132（W5/W6/W7 全 warnings 不挡 LINT: PASS）· D-23-W4-G4-EXIT 注释 :109-110 逐字「升 failClosed 唯一路径=后续 SPEC 明文裁决」+ yaml G4 note :43 同文 · gaps G4 warn-only 态即 closed 2.3.0（重点 2 不对称先例在案）
- **N2-C 实证**：verify --task 链 :303-410 无 lint 步（formatGateCheck :303 → runTestCheck :316 → 审查文闸 :323/:338 → pre-30 invoke :374 → wiki-lint :390）· `--allow-lint-fail` 在 DEF-011 注释 :248 逐字 · **前基线复测**（lintTaskFile 全语料 · node --experimental-strip-types 直调 · 与 task 同方法）：**81 件 · FAIL 27（33.3%）** vs task 声称 80/27/33.8% —— FAIL 27 件逐文件枚举全中（done 27 · active 0）· 规则分布本审 E3×21/E5×16/E4×9/E2×2/E6×1（声称各 +1）· 逃逸率 100% 实质成立（27/27 全逃逸）→ advisory A1
- **F4 实证**：statements 字段集 id/source/summary/status/mechanism/gap/notes/mechanism_quality 无 trigger 键（A1/B2 条目逐键）· loadDiscipline 校验仅查 version/as_of/statements（cli-lifecycle.ts:87-89）→ additive 扩键容忍成立
- **cmdAudit 无落盘实锤**：gates.ts:172-205 打印 `audit: PASS/FAIL`（:200）→ `fail('ICVO audit 未通过', 2)`（:204）· 零结构化落盘
- **G7 实证**：hookguard.ts runGateCommand :53-64 实跑 + 阻断 exit 2 :126-131 · 执行结果不落证据轨 · A5 mechanical gap:G7 / B2 prompt-only gap:G7 · gaps G6/G7/N2-C deferred ✓
- 行号抽核 25+ 处全中（1 处小疵 → advisory A2）：verify.ts :248/:303/:316/:323-335/:338-371/:347-364/:374/:390/:410 · gates.ts :172-205 · task-cmd.ts :116-168 三态 · lint.ts :21/:102-132 · close-guards.ts :95-111 · review-gates.ts :92-114/:164-205 · cli-shared.ts :90-98/:123-131 · cli-lifecycle.ts :79-91/:87-89/:114-152（分发 :474-495 实测 vs 引 :478-495 小疵）· hookguard.ts :53-64/:126-131 · usage.ts :8-22/:28 · cli-skills.ts :367-369 · invoke-hats.ts :8-9/:89-100
- 机检：`task lint` PASS（W3 占位符 warn draft 期合法）· `gate-check` + `verify` 双咬住 HG-AUDIT-R1 pending（❌ 拒 30 · VERIFY: BLOCKED · **双 exit 2**）
- .gitignore 现值 5 行无 audit 行（实证 · 草案① 加一行只覆盖本仓 → advisory A3）· legacy-gate-exempt.yaml 四字段格式头注在案 ✓ · W6 invoke 目录此前不存在（10 invoke 未落盘 → advisory A4 · pre-30 闸 required ∩ {10,20,00} fail-safe）

## 结论

**PASS-with-issues**（blocking 0 · advisory 4：A1 N2-C 前基线复测口径差 ±1（81/27/33.3% vs 80/27/33.8% · FAIL 27 逐文件全中 · 逃逸率 100% 实质成立 · 30 按基线节自带纪律复跑重建）· A2 cmdDiscipline 行号小疵 :478-495→:474-495 · A3 草案① gitignore 只覆盖本仓 · 消费仓脏面口径须自检登记 · A4 10/00 invoke 待补（fail-safe 闸在案））—— 五条重点结论：**① G2 对账口径接受（现码已接线独立实证 · 回归锁+实证+C1/C2 回写诚实可机检）**；**② G7 诚实口径优先可接受（warn-only → partial 不虚标 closed · 偏差登记留 00/维护者 · G4 warn-only 态即 closed 不对称先例登记 · 不须打回不须回 SPEC 回注由 20 强制）**；**③ 闸行裁决三理由成立（F4 trigger additive 扩键经 loadDiscipline :87-89 容忍实证不擦「格式变更」边 · 升级条款兜底）**；**④ 两草案双双成立（观测面/证据面分工成立 · 默认开+无 opt-out 得当 · F-W6-01 保不阻断）**；**⑤ G4 升级认定成立（D-23-W4-G4-EXIT 双实证 · SPEC 验收 2 明文 BLOCKED = failClosed 明文授权 · done 降级+豁免通道合规）**。思考轮审查通过 · 充分性裁定：充分。审查文：`docs/harness/reviews/task_3_0_w6_observability_audit_audit_R1_20260917.md`

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 代签 · 维护者 2026-09-16 授权模式）
- ⛔ 未改 task / SPEC / PLAN / src / assets / test / package.json 实质内容（S2 只新增：本 invoke + 审查文）
- ⛔ HG-AUDIT-R1 仍 pending ⇒ 未附 30 Prompt，仅出维护者签闸清单

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 20-task-audit R1 审查完成落盘 |
