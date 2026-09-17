# Invoke：20（task-audit R3 · 放行确认）· 3-0-w7-closeout-external

| 字段 | 值 |
|------|-----|
| hat_id | 20-task-audit |
| task_slug | `3-0-w7-closeout-external` |
| task_paths | `docs/tasks/active/task_3_0_w7_closeout_external.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |
| round | R3（放行确认） |

## 指令摘要

00 指令 R3 放行确认：§S7.3 已按 00 最终裁定收敛（撤销对 `人闸` 的弃用方向 · 唯一判红 = 变体词 `门控`）。用自研脚本按新口径复测：保留词（`人闸`/`人工闸`）0 判红 · `门控` 判红面（README 双语/GLOSSARY/RELEASING 非 skip/MIGRATION/promotion）残留 0 · 豁免面按枚举全不红 · `后门控制` 不误报；确认 S7.3↔S7.5 冲突解除；核对 R2 advisory A8–A11；出 R3 结论。**禁止**改 task、代签 HG-AUDIT-R1。

## 独立复核证据（本帽实测）

- **判红面 `门控` 残留 = 0**：`README.md` 0 · `README.zh-CN.md` 0 · `GLOSSARY.md` 0 · `MIGRATION.md` 0 · `delivery/promotion/**` 0 · `RELEASING.md` **3**（全 `门控 skip` · ③ gated-test 豁免）⇒ 残留 0 ✓
- **canonical 0 判红**：脚本对 `人闸`/`人工闸` 无判红规则；GLOSSARY `:11` 五保留词（门禁/过程轨/帽制/人闸/真值源）逐词在位 ✓；行内 `` `## 人工闸` ``/`人工闸表`/`formatGateCheck 人工闸` 全不红 ✓
- **词边界**：`delivery/安全设计.md:566` 的 `后门控制` 含 `门控` 子串 · ③ 词边界排除 + 该文件属豁免面 ⇒ 不判红 ✓（R2 误报点已消）
- **豁免面**：research_report.md 3 行（含 K-3 目标「内核 SDD 门控」）· 安全设计.md 1 · 系统设计.md 0 · docs/spec/** 2 · docs/roadmap/** 11 —— 均在 ③ 名单 ✓
- **K-3 冲突解除**：K-3 目标文本落 `delivery/research_report.md`（③ 豁免面），S7.5 改写不再触发术语闸；task :127 已登记 ⑥ ✓
- **基线计数核对**：`门控` 全 tracked **95**（本审 95；仅 md 为 92 · 差 3 = `test/cli-peer-optional.test.ts`）· 判红面 **3**（全 `RELEASING.md:80/93/104` `门控 skip`）· 残留 **0** ✓；`人闸` 非 S2 **74 计次** ✓（行口径 task 65 vs 本审 67 · ±2 · 信息基线非残留）
- **R2 advisory 落笔**：A8 :112「~46（53−7）」✓ · A9 基线 :87 改最终口径（判红面 3/全 95/残留 0）✓ · A10 S7.7 :174「参数化排除 current task 路径 · active/ 其他新增坏链仍拦」✓ · A11 计次/逐行口径标注 ✓
- **闸机检**：`task lint` PASS（W3 占位符 warn draft 期合法）· `gate-check` **exit 2**（仅渲染 HG-TASK-DRAFT approved + HG-AUDIT-R1 pending 拒 30 · HG-RELEASE 不渲染）

## 结论

**R3 = PASS · 可签（blocking 0 · advisory 2 标注级）**。B1 闭合：00 根因裁定（canonical vs 变体词）正确，判红面 `门控` 残留经本审独立复测为 **0**，K-3↔S7.3 冲突解除，canonical `人闸`/`人工闸` 0 判红、`后门控制` 不误报。Advisory：A12 判红面宜写明「六目标闭集」（防 30 扩面到 `.workbuddy/output/*` · 当前残留仍 0）· A13 `人闸` 行口径 ±2（非残留）。**建议 00 代签 HG-AUDIT-R1=approved（含 A1 显式确认：HG-RELEASE 不适用 blocks-30 · tag 取严留维护者）**。审查文：`docs/harness/reviews/task_3_0_w7_closeout_external_audit_R3_20260917.md`

## 维护者授权边界

- ⛔ 不代签 HG-AUDIT-R1（归 00 代签 · 维护者 2026-09-16 授权模式）
- ⛔ 未改 task / SPEC / PLAN / src / assets / test / package.json / 物料 实质内容（S2 只新增：本 invoke + R3 审查文）
- ⛔ HG-AUDIT-R1 仍 pending ⇒ 未附 30 Prompt，仅出维护者签闸清单；签后 30 可开工

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 20-task-audit R3 放行确认完成落盘 · 判红面残留 0 · K-3 冲突解除 · A8–A11 全落地 · **PASS · 可签**（advisory A12/A13） |
