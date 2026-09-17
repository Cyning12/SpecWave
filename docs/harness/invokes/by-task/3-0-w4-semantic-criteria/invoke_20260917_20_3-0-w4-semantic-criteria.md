# Invoke：20（task-audit R1）· 3-0-w4-semantic-criteria

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w4-semantic-criteria` |
| task_paths | `docs/tasks/active/task_3_0_w4_semantic_criteria.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |

## 指令摘要

对 W4 task（3.0 防伪判据语义化 · NEW-5 结论闸档 M + R-5 跨行封堵 + NEW-11 词表广义化 + pin-17/pin-08 语义绑定 + NEW-10 exempt 真实性/U1 口径统一 + N5 登记 + 判据两分边界防御）做 R1 书面审查：对照 SPEC 05 / 评审文（w4_semantic_criteria_review_20260917 · 六判据定稿+存量实测）/ PLAN W4+硬约束 6/7/11/14/15 逐项核对范围/非范围/验收/failure_paths/思考轮；逐条复核 10-task 留下的五条重点（档位 M vs S 定夺 · 闸行裁决不设 HG-SCHEMA-CHANGE 三理由+升级条款 · K 断言解锁同 commit 硬锁 · U1 口径统一四面闭环 · 豁免 6 件合规性+自咬链条）；审查文落盘 `docs/harness/reviews/`。**禁止**改 task 实质、代签 HG-AUDIT-R1、改 src/checks/cli-pins/yaml/SPEC/PLAN。

## 独立复核证据（本帽实测）

- `npm test` 全量复跑：**773 tests / 145 suites / 772 pass / 0 fail / 1 skip**（100.5s · 基线 ≈94s 机差量级）· typecheck **0 错** · pins **17/17**（pin-17 现值「13 宿主校验 · 13 双语命中」）· HEAD `9c895db` · 工作区 untracked = 评审文+本 task 2 件 · dependencies 仅 `js-yaml` · lock 非 dev 顶层 = **2** —— 与基线节逐字一致；W3 done 锁终态交叉一致
- **评审文实测数字探针复刻复跑**（evalReviewConclusion 逐行复刻现码 :134-175 · 88 件基线集全量）：PASS 63 / FAIL 25（15/3/7/0）· 词集命中率 VERB 63/63 · SUBJ 57/63 · OBJ 59/63 · GATE 61/63 · **档 M 误伤恰 6 件 / 档 S 恰 10 件（+4 件 2_1_1 系列）枚举个案逐字一致** · NEW-11 五类误伤 0/63 · 284 份 tracked md（88+78+95+23）窄邻接 0 命中 · 行尾 不/未 0 行 · 宽窗口误中恰 1 例 = 08_w7:85 · K fixture 落窄式=true / 跨段落窄式=false · NEW-11 语料普查七数字逐字一致 · spec 索引行 18（L9-L26）/15 含点式串 · S_mid 0/15 · S_narrow 1/15=L10 CLOSED · 双 README 各 10 表 · 签名表各 1（:24-38 · 首格 Host/宿主）· 豁免 34 条（18+16）authorized_by 全同构
- **豁免 6 件逐件核实**：reviews 文件名 6/6 逐字在案 · done task meta task_slug 6/6 = 豁免 slug 连字符原形 · normalizeSlug 双侧归一（loader :45 存键 / verify.ts:168 查键）命中实证 · 建议 authorized_by 形态逐元过 A1 三元判（身份 00 + 全角括号 ISO 日期 + 出处词「授权」）
- 行号抽核 30+ 处全中（review-gates :126-133/:134-141/:143-175/:95-114/:99 · exempt :9/:18-54/:40-44/:42 · close-guards :76-88/:90-108/:90-91 · cli-pins :217-266/:221/:230-232/:238/:382-477/:419-428 · verify :144/:157-170/:319-324/:332-353/:343-347 · cli-task-extra :100-127 · cli-shared :321-323 · cli-assets :86-90 · release-pins.yaml :60-82/:66-78/:173-212/:178-187/:212 · legacy-gate-exempt 147 行/:1-6/:9- · test K 断言 :693-701/对照 :668-691/N13 :704+ · PLAN W4 :259-272/硬约束 :335-344）
- 机检：`task lint` PASS（W3 占位符 warn draft 期合法）· `gate-check` + `verify` 双咬住 HG-AUDIT-R1 pending（❌ 拒 30 · VERIFY: BLOCKED · **双 exit 2**）
- grep 新发现登记补列项：NEW-10 A1 必破 4 处既有豁免 fixture（`00（fixture）` ×3 = cli-w4-gate-wiring :304-320/:336-352 + cli-verify-spec :231-247 · `"00"` ×1 = N13 :720-733）· pins-consistency :1311 断言 pin-08 semantics「规划中」旧句与 S5.5 改写硬耦合 —— 均未列验收 #11 预期登记面（fail-closed 兜住 · advisory 级）

## 结论

**PASS-with-issues**（blocking 0 · advisory 4：A1 四处豁免 fixture 必破须同 commit 重锚 A1 合规形态+登记 · A2 pins-consistency :1311 与 pin-08 semantics 改写硬耦合须登记 · A3 验收 #2 算术口径 89 vs 88 注记 · A4 闸裁决理由①先例标注小疵）—— 五条重点结论：**档 M 定夺维持**（改档不属范围违约定性成立）· 闸行裁决成立 · K 断言同 commit 硬锁表达充分 · U1 真闭环（OQ-3 落）· 豁免 6 件合规且**自咬链条三重机械网闭合自洽**。思考轮审查通过 · 充分性裁定：充分。审查文：`docs/harness/reviews/task_3_0_w4_semantic_criteria_audit_R1_20260917.md`

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 代签 · 维护者 2026-09-16 授权模式）
- ⛔ 未改 task / SPEC / PLAN / src / test / fixtures / yaml 实质内容（S2 只新增：本 invoke + 审查文）
- ⛔ HG-AUDIT-R1 仍 pending ⇒ 未附 30 Prompt，仅出维护者签闸清单

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 20-task-audit R1 审查完成落盘 |
