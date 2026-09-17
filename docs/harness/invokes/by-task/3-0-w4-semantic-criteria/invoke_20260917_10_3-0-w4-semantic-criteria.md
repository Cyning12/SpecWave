# Invoke：10（task 起草）· 3-0-w4-semantic-criteria

| 字段 | 值 |
|------|-----|
| hat_id | 10-task |
| task_slug | `3-0-w4-semantic-criteria` |
| task_paths | `docs/tasks/active/task_3_0_w4_semantic_criteria.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要（委派 Prompt）

00 委派（W0–W3 已 CLOSE · W4 评审文已落盘 `docs/harness/reviews/w4_semantic_criteria_review_20260917.md`（217 行 · 六判据形态定稿 + 存量全量实测 + 判据两分边界声明）· 授权真值：维护者 2026-09-16「签收，授权00签收后续所有文档」）：起草 3.0 W4 task —— ① 必读评审文全文（六判据形态 / §7 强度档与波及处置总表（误伤枚举=豁免登记清单底稿）/ OQ-1–OQ-4 荐案（档 M · A1 强制+A2 可选）/ 残余 R-①②③）+ SPEC 05（范围 ①–⑧ · 验收 1–6 · F-W4-01–05）+ PLAN W4 节/硬约束 6/7/11 + 现码实读（review-gates/exempt/close-guards/cli-pins/release-pins.yaml + 2.4.2 K 断言位置）+ W3 done task 格式模板；② 范围规格化七项：NEW-5 档 M 结论闸语义化 · R-5 跨行窄邻接封堵 + K 断言翻向 · NEW-11 词表五类广义化 · pin-17 主键列+表头签名双判 · pin-08 S_mid 同格共现绑定 · NEW-10 A1 形态三元判 + U1 口径统一 · 判据两分边界防御（硬约束 11）；③ 基线复跑实测写入；④ 闸表 HG-TASK-DRAFT / HG-AUDIT-R1 均 pending · **不签任何闸**。禁区：不实现代码 · 不改 SPEC/PLAN/reviews/yaml · 不签闸 · 不 commit · 禁 git add -A。

## 动作与独立复核证据（本帽实测）

- **基线复跑**：HEAD `9c895db` · npm test **773/145/772 pass/0 fail/1 skip**（≈94s · 与 W3 锁终态逐字一致）· typecheck 0 错 · pins 17/17（pin-17 现值「13 宿主校验 · 13 双语命中」）· 依赖基线 dependencies 仅 `js-yaml` · lock 非 dev 顶层 = 2
- **现码行号与评审文基准逐条复核一致**：review-gates.ts:126-133（2.4.2 R-2 口径注释 :129「窗口显式排除 \n → R-5…K 断言钉死」在案）/:134-141/:143-175 · exempt.ts:9,18-54,40-44 · close-guards.ts:76-88,90-108 · cli-pins.ts:217-266（dottedExactRe :230-232 · 切格 :238）,382-477（TABLE_ROW_RE/hitInTableRow :419-428）· verify.ts:144,157-170,319-324,332-353（done warn 降级 :343-347）· cli-task-extra.ts:100-127 · release-pins.yaml pin-08:60-82（semantics :66-78）/pin-17:173-212（semantics :178-187 · known_gaps :212）· K 断言 test/cli-w4-gate-wiring.test.ts:693-701 · N5 现状 cli-assets.ts:86-90 警示在案
- **6 件误伤名单落盘核实**：reviews 文件名 + done task meta task_slug 逐字（`00-default-behavior-kit-1-7-1` + `2-4-gate-strength-w{1,3,4,5,6}-*`）· normalizeSlug（cli-shared.ts:321-323 仅下划线→连字符）⇒ 连字符原形直填即命中消费面 · 结论节文本抽核 3 件与评审文形态描述一致（ACCEPT 体 SUBJ 缺 / 2.4 系列短结论「Wn 结论：PASS · 零内容阻塞，与总审文 §4…一致」SUBJ 缺）
- **规格化定稿**：档 M（VERB=现 PASS_RE 沿用不扩 ∧ SUBJ ∧ (OBJ∨GATE) 节内共现 · substance≥20 地板保留）· R-5 窄邻接式（单换行 · 禁 \n\n 跨段 · 不引字符窗口 —— 宽窗口 08_w7:85 实测误中 1 例为定档依据）+ K 断言同 fixture 翻向 exit 0→2 + 跨段反向锁 + 判据改造与断言翻向同 commit 硬锁 · NEW-11 五类入表 + NG 观察名单（OQ-4）+ 残余四类显式登记 · pin-17 cells[0] 主键列 + 表头签名 /^(Host|宿主)$/ · pin-08 S_mid 同格共现 + S_narrow 弃用登记 · NEW-10 A1 三元判 + A2 可选 + U1（helper 单源 · verify --task done 面补消费 exempted 留痕 · close 不消费显式不对称注释）· N5 口径登记零行为变更 · 档 S 备选通道留 20 裁定（4 件 2_1_1 系列补豁免）
- **闸行裁决**：W4 不设 HG-SCHEMA-CHANGE 行（三理由：semantics 字段值内文案更新=数据面非结构变更（D-23-W2-CHECK-FORM 既定）· 豁免增 6 条=既有列表增数据行（N11 先例）· 判据语义变更人闸通道=评审先行+HG-AUDIT-R1）+ yaml 键结构变动 STOP 升级条款 · 留 20-task-audit 复核
- 落 `docs/tasks/active/task_3_0_w4_semantic_criteria.md`（318 行）· `task lint` PASS（仅 W3 占位符 warn · draft 期合法）· failure_paths 继承 F-W4-01–05 + 新增 F-W4-06–11 · 验收 13 条全机械 · R0–R5 五槽 + residual_risks 六条

## 关键交付与回执（00 授权落笔）

1. **HG-TASK-DRAFT 翻转**（00 回执授权 · 2026-09-17）：pending → approved（00 代签 · 授权真值：维护者本窗「授权00代签」· task lint PASS）· 头部状态行同步 · verify 回报（HG-AUDIT-R1 pending 正确拒 30 · exit 2）
2. **HG-AUDIT-R1 代签落笔**（00 裁定 · 2026-09-17）：pending → approved · 依据审查文 `docs/harness/reviews/task_3_0_w4_semantic_criteria_audit_R1_20260917.md`（R1 · PASS-with-issues · blocking 0 · advisory A1–A4 全部带入 30 执行要求）· 头部状态行同步（draft → active · 30 可开工）
3. 本两件 invoke 代笔补落（00 裁定授权 · W1/W2/W3「pre-30 三件套齐」先例 · 格式对齐 W3 目录件）

## 未做（禁区）

- 未实现代码 · 未改 SPEC/PLAN/reviews/src/test/yaml 既有件（30 的事 · 本帽只起草+按 00 授权落笔闸行）
- 未自行签发任何闸（两次落笔均为 00 明确回执授权后执行）
- 未 push / tag / publish / deprecate（commit 一笔为 00 当次书面授权 · 四动作余者仅人）
- 未裹挟域外档（commit 逐文件显式 add）

## 下一棒

30 实现棒：GATE_VERIFY 首输出（双闸 approved · pre-30 invoke 三件套齐 · VERIFY: PASS）→ 按 task 范围 ①–⑦ 执行（红测先行 + K 断言同 commit 硬锁 + 存量波及复跑与评审文 §7 基线核对）→ 验收 13 条全绿 → `task close --yes` 关账（待 40 复核后另行 · 00 口径）。20 审 A1–A4 带入 30 执行要求（见 00 invoke 裁定节与 HG-AUDIT-R1 行注明）。
