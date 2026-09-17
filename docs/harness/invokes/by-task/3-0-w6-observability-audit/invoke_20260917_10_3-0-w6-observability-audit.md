# Invoke：10（task 起草）· 3-0-w6-observability-audit

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-w6-observability-audit` |
| task_paths | `docs/tasks/active/task_3_0_w6_observability_audit.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要（委派 Prompt）

00 委派（W0–W5 已 CLOSE · W6 = 可观测与审计（倒数第二波 · 消费前序波次产出的真值面）· 授权真值：维护者 2026-09-16「签收，授权00签收后续所有文档」）：起草 3.0 W6 task —— ① 必读 SPEC 07（范围 ①–⑦ · 设计要点 §5 · 验收 1–6 · F-W6-01–05）+ PLAN W6 节/硬约束 1/14/15 + discipline-coverage.yaml 实证现值 + 现码实读（W0 后新布局：verify.ts / task-cmd.ts / review-gates.ts / invoke-hats.ts / gates.ts）+ W5 done task 格式模板；② 范围规格化七项：C6 结构化审计日志落盘（落点定稿永不入 S2 三域）· F4 S2 公理接真实触发源 · G2/G4 闸接线 · N2-C verify --task 补 lint（FAIL 率须实测下降 · 基线实测方法设计）· G7 执行证据 · coverage 回写；③ 基线复跑实测写入；④ 闸表 HG-TASK-DRAFT / HG-AUDIT-R1 均 pending · **不签任何闸**。禁区：不实现代码 · 不改 SPEC/PLAN/reviews · 不签闸 · 不 commit · 禁 git add -A。

## 动作与独立复核证据（本帽实测）

- **基线复跑**：HEAD `b461b34` · npm test **810/154/809 pass/0 fail/1 skip**（≈96s · 与 W5 锁终态逐字一致）· typecheck 0 错 · pins **17/17** · tag v2.4.2 在 · tree clean · 依赖基线 dependencies 仅 `js-yaml` · `docs/harness/audit/` 不存在（glob 实证）
- **现码行号逐条实读（W0 后新布局）**：`src/cli/verify.ts` cmdVerify --task 链 :303-410（formatGateCheck :303 → runTestCheck :316 → 审查文存在级 :323-328 + 结论级 :338-371 → pre-30 invoke hats :374 → wiki-lint :390 · **无 lint 步**）· `src/cli/gates.ts` cmdAudit :172-205（打印 PASS/FAIL 后 fail(:204) · **零结构化落盘实锤**）· `src/cli/task-cmd.ts` close verdict 三态 :116-168 · `src/checks/lint.ts` lintTaskFile :21 + G4 warn-only W5–W7 :102-132（D-23-W4-G4-EXIT 注释 :109-110）· `src/checks/close-guards.ts` evalCloseReview :95-111 · `src/checks/review-gates.ts` findLatestReview :92-114 / evalReviewConclusion :164-205 · `src/cli-shared.ts` S2_TRUTH_PREFIXES :90-98 + assertNotS2Abs :123-131 · `src/cli/usage.ts` CLOSE_GUARD_ORDER :8-22 / VERIFY_BLOCKED_EXIT_CODE :28 · `src/cli-lifecycle.ts` loadDiscipline :79-91 / formatDisciplineShow :114-152 · `src/host/hookguard.ts` runGateCommand :53-64 / 阻断 exit 2 :126-131 · `src/cli-skills.ts:367-369` S2 拒写先例文案
- **起草发现三条（全留 20 复核）**：① **G2 reviews 存在性闸现码已接线**（verify.ts:323-328 + close-guards.ts:95-111 · yaml gaps G2 已 closed 2.3.0 · 真残留 = statements C1/C2/D3 not_wired）—— SPEC ③ 前提与现码偏差 · W6 的 G2 定为回归锁 + 负向 fixture 实证 + C1/C2 回写（非新接线）；② yaml 机制锚点全为 W0 前 `src/cli.ts#xxx` 旧址（W0 拆分漂移未回写 · 回写时逐条刷新）；③ SPEC 示例行号与现值偏差面按 SPEC 自身快照条款回源码复核
- **N2-C 前基线实测（lintTaskFile 全语料直调 · node --experimental-strip-types 单进程 · 与 test 同运行形态）**：语料 80 件（排除非 task 的 README.md）· lint FAIL **27（33.8%）** · 规则分布 E3×22/E5×17/E4×10/E2×3/E6×1 · **逃逸率 100%**（lint 不在链 · 27/27 全逃逸）· warn 面 W4×34/W5×14/W6×1 —— FAIL 率指标定稿 = lint 逃逸率（防「存量不合规率不追溯导致指标不动」口径陷阱）· 后测硬判据 = active 面逃逸率 100%→0%
- **规格化定稿**：C6 落点 `docs/harness/audit/audit.jsonl`（候选采纳 · 不在 S2_TRUTH_PREFIXES 实证 · append-only JSONL · 字段集必填五键 schema_version/event/ts/verdict/exit_code + 可选五键）· 三产出点同一 appendAuditEvent 单一源 · F-W6-01 降级不阻断 / F-W6-02 assertNotS2Abs 拒写无豁免 · 草案裁决 gitignore 观测面分工（留 20）· F4 定稿 discipline check 实跑验证（additive trigger 字段 · loadDiscipline :87-89 容忍实证 · declared/verified 双列可区分 · v1 收窄 S2 公理面）· G4 升级通道 = SPEC 07 ④ signed 兑现 D-23-W4-G4-EXIT（active failClosed · done warn 降级）· N2-C lint 步插 runTestCheck 后（lintTaskFile 复用 · --allow-lint-fail DEF-011 旗标接线留痕）· G7 warn-only 落地（合规率未知 · 先例同式 · 诚实口径不回写 closed）· S2 拒写复用 assertNotS2Abs 单一真值源
- **闸行裁决**：W6 不设 HG-SCHEMA-CHANGE 行（三理由：coverage 回写=数据面 · C6 schema=新增内部格式 · F4 trigger=additive 扩键被容忍）+ STOP 升级条款 · 留 20-task-audit 复核
- 落 `docs/tasks/active/task_3_0_w6_observability_audit.md` · `task lint` PASS（仅 W3 占位符 warn · draft 期合法）· failure_paths 继承 F-W6-01–05 + 新增 F-W6-06–12 · 验收 14 条全机械 · R0–R5 五槽 + residual_risks 五条

## 关键交付与回执（00 授权落笔）

1. **HG-TASK-DRAFT 翻转**（00 回执授权 · 2026-09-17）：pending → approved（00 代签 · 授权真值：维护者本窗「授权00代签」· task lint PASS）· 头部状态行同步 · verify 回报（HG-AUDIT-R1 pending 正确拒 30 · exit 2）
2. **HG-AUDIT-R1 代签落笔**（00 裁定 · 2026-09-17）：pending → approved · 依据审查文 `docs/harness/reviews/task_3_0_w6_observability_audit_audit_R1_20260917.md`（R1 · PASS-with-issues · blocking 0 · advisory A1–A4 带入 30 执行要求 · **G7 落地档裁定：00 接受 warn-only 诚实口径不虚标 closed · SPEC ⑦ 字面偏差登记**）· 头部状态行同步（双闸 approved · 30 可开工）
3. 本两件 invoke 代笔补落（00 裁定授权 · W1–W5「pre-30 三件套齐」先例 · 格式对齐 W5 目录件 · 20 审 A4 清偿）

## 未做（禁区）

- 未实现代码 · 未改 SPEC/PLAN/reviews/src/scripts/assets/test 既有件（30 的事 · 本帽只起草+按 00 授权落笔闸行）
- 未自行签发任何闸（两次落笔均为 00 明确回执授权后执行）
- 未 push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 四动作余者仅人）
- 未裹挟域外档（commit 逐文件显式 add）

## 下一棒

30 实现棒：GATE_VERIFY 首输出（双闸 approved · pre-30 invoke 三件套齐 · VERIFY: PASS）→ 按 task S6.1–S6.7 执行（红测先行 · **A1 N2-C 基线复跑重建登记（27 件枚举一致 · 分母时点差 · 以复跑实测重建并登记）** · A2 行号小疵改前复读现值（cmdDiscipline 分发 :474-495）· A3 gitignore 只覆盖本仓 · 消费仓脏面口径自检登记 · G4/N2-C done 面 warn 降级不追溯 · FAIL 逃逸率 100%→0% 硬判据不降不得完成 · G7 warn-only 落地档回写 partial）→ 验收 14 条全绿 → `task close --yes` 关账（待 40 复核后另行 · 00 口径）。20 审 A1–A4 带入 30 执行要求（见 00 invoke 裁定节与 HG-AUDIT-R1 行注明）。
