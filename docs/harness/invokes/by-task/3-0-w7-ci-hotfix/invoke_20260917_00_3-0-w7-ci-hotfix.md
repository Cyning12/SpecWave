# Invoke：00（统筹）· 3-0-w7-ci-hotfix

| 字段 | 值 |
|------|-----|
| hat_id | 00 |
| task_slug | `3-0-w7-ci-hotfix` |
| task_paths | `docs/tasks/active/task_3_0_w7_ci_hotfix.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |
| 审查文 | `docs/harness/reviews/task_3_0_w7_ci_hotfix_audit_R1_20260917.md` |

## 人授权（原文意图）

维护者本窗授权 00 代签后续过程文档闸（**授权真值（转录）：tag/push 代跑「授权」+ 过程文档闸代签模式**）；**发布四动作（tag / push / npm publish / npm deprecate）与 tag 决策仍归人 / 00**。本 task = 文档链接机检 CI hotfix（bugfix · 双轨跳独立 SPEC · mini）。**00 只委派不亲自实现**（harness-00-delegate-only 口径）。

## 闸扫描与代签依据

- 上游双闸：HG-NEXT-PLAN=approved · HG-SPEC-SIGNOFF=approved（2026-09-16 维护者本窗 · 上行继承 · 落 task `### 人工闸` 表）
- HG-TASK-DRAFT=approved（**2026-09-17 00 代签** · 授权真值：维护者本窗授权 · task lint PASS）
- HG-AUDIT-R1=approved（**2026-09-17 00 代签** · 同授权 · 依据审查文 `docs/harness/reviews/task_3_0_w7_ci_hotfix_audit_R1_20260917.md`：R1 · PASS-with-issues · blocking 0 · advisory A1–A6 · A4/A5/A6 已搭车修 · A1/A2 带入 30）

## 派发链

10-task 起草（CI 双 run 复核 + 本地假绿/clone 真红 + **三组对照实验证伪字面单行式** 42/48 → 34/1 → 34/0 + 环境无关 fixture 预演 + 基线复跑 859-164-858-0-1 · 见 10 invoke）→ **00 代签 HG-TASK-DRAFT** → 20-task-audit R1（PASS-with-issues · blocking 0 · advisory A1–A6 · 三条重点均成立 · 见 20 invoke 与审查文）→ **00 裁定**：HG-AUDIT-R1 代签 + A4/A5/A6 搭车修 + A1/A2 带入 30 → pre-30 invoke 三件套补落（10/20/00 齐 · W0/W1 先例）→ 30。

## 关键裁定

1. **CI 红根因裁定**：`scripts/check-doc-links.mjs:96` 以**文件系统存在性**判「可解析 (i)」；本机 `.workbuddy/`（gitignore 但实体在）使 11 处 `.workbuddy/output/验收报告-*.md` 链「存在」⇒ 本地 23 假绿；CI/干净 clone 无实体 ⇒ 34 真红。**判据环境依赖**（硬约束 10 同族）· 冻结基线 23 系假绿口径，须重建。
2. **法定修法裁定**：判据改**入库状态**并采三件套 —— ① inRepo = tracked 文件 ∪ **tracked 目录前缀**（缺则非 S2(i) 0→48）· ② tracked 集合**原样读取**（`-c core.quotepath=false ls-files -z` · 缺则 0→1）· ③ 仓外维持 `existsSync`；基线按修后实测重建 **23→34**。**父派单字面单行式经实测证伪**（42/48 与 34/1）· 采 10-task 实验结论 C（34/34 · 非 S2=0 · 双端 IDENTICAL）。
3. **tag 决策归 00**：不移动 / 不重打 / 不删除 tag `v3.0.0`（F-HOT2-03 明确「不在本 task 范围 · 归 00」）；发布四动作仅人不变。
4. **A1/A2 口径裁定（带入 30）**：#1/#2 的 `git clone .` 取**修复 commit 后的 HEAD**（未提交即跑仍是修前脚本）；S2 基线以**最终 commit 克隆实测**为准（过程件若增链按 F-HOT2-01 重建并登记）。A3（隔离 fixture 增强）非阻断不裹挟 · A4/A5/A6 由 10-task 搭车修。
5. **一笔 commit 授权（不 push）**：`docs(3.0-W7): W7 CI hotfix task（双闸 approved）+ R1 审查文 + invoke 三件套` —— task 文 + R1 审查文 + `invokes/by-task/3-0-w7-ci-hotfix/` 三件 · 逐文件显式 add · 禁 add -A · **不 push 不 tag**（修复包 30 交付后由 00 呈维护者放行统一推）。

## 未做（禁区）

- 未亲自实现代码（delegate-only）· 未动 `scripts/` / `test/` / `src/` 来源文件（S2 只新增不覆写 · 修复归 30）。
- 未执行 push / tag / publish / deprecate（仅人 · tag 决策归 00 · commit 不 push）。

## 下一棒

30 实现棒：开工前 `node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w7_ci_hotfix.md` 过 GATE_VERIFY（双闸 approved · VERIFY: PASS · pre-30 invoke 三件套齐）→ 范围唯一（checker 判据三件套 + 基线 23→34 + `S2_PARAM_EXCLUDE` + test 三改 + ACCEPTANCE 三处）→ 验收 6 条（A1 commit 后 clone 复跑 #1/#2 · A2 最终 commit 克隆定基线）→ 波末 `gate-check` exit 0 → 00 呈维护者放行统一 push。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | 00 统筹落档：双签承接 + 双闸代签依据 + 五裁定（CI 红根因 / 法定修法三件套 / tag 决策归 00 / A1-A2 口径 / 一笔 commit 不 push）· 10-task 按 00 授权代笔补落本 invoke（pre-30 三件套之一） |
