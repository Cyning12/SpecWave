# Task Audit R2：3-0-w7-tty-color-hotfix

> **审查帽**：20-task-audit · **轮次**：**R2（B1 闭合复核）** · **日期**：2026-09-18  
> **审查对象**：`docs/tasks/active/task_3_0_w7_tty_color_hotfix.md`（B1 + A1–A5 回填后 · **HG-TASK-DRAFT = approved** · **HG-AUDIT-R1 = pending**）  
> **前置**：R1 审查文 `docs/harness/reviews/task_3_0_w7_tty_color_hotfix_audit_R1_20260918.md`（BLOCKED · BLOCKING 1 B1 · advisory 5）  
> **复核方式**：只读复核 + 残留扫描 + `task lint`；按 00 指令**不复跑全量**（R1 基线 2026-09-18 已实测；本轮仅 task 文档变更、测试面零动 ⇒ R1 基线继续有效）  
> **禁区遵守**：未改 task / test / src · **未代签** HG-AUDIT-R1（归 00）

---

## 1. 工作区实态与流程闸

| 项 | 实测 |
|----|------|
| git HEAD | `fad0637`（未变） |
| git status | 仅 S2 新增：`docs/harness/reviews/task_3_0_w7_tty_color_hotfix_audit_R1_20260918.md` + `docs/harness/invokes/by-task/3-0-w7-tty-color-hotfix/`；`docs/tasks/active/` untracked（含本 task）。**`test/` / `src/` 零 tracked 改动** |
| `npx spec-wave task lint --file …` | **LINT: PASS** · exit 0 |
| `npx spec-wave verify --target . --task …` | **VERIFY: BLOCKED** · HG-TASK-DRAFT approved（不拦）· **HG-AUDIT-R1 pending ⇒ 拒 30** · exit 2（闸表未变 · 待 00 签） |
| 全量复跑 | **本轮未跑**（按 00 指令 · R1 实测基线：普通 860/164/859/0/1 · FC=1 860/857/2/1 · pty 全量 860/858/1 · pins 17/17 · typecheck 0） |

---

## 2. B1 闭合判定：**闭合**

**单一取值** `{ ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }` 在全部相关落点一致，且「候选并列 / 30 定稿回填」已删除：

| # | 落点 | 行 | 现值 | 判定 |
|---|------|----|------|------|
| 1 | helper 代码片段 return | :81 | `{ ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }` | ✅ 组合单值 |
| 2 | 取值契约句 | :88 | 「恒为 `FORCE_COLOR:'0'+NO_COLOR:'1'` · 输出无色且零 stderr 互斥警告 · **30 只验证不选型**（无候选并列 · 无回填项）」 | ✅ 无二择一 |
| 3 | 修复锁 | :95 | 子进程 `NO_COLOR==='1'` ∧ `FORCE_COLOR==='0'` ∧ stdout 无 ANSI ∧ stderr 零互斥警告 ∧ `includes('文件数: 0')` | ✅ 与单值一致 |
| 4 | 契约锁 | :96 | `plainEnv()` 恒返回 `FORCE_COLOR==='0'` ∧ `NO_COLOR==='1'`（ambient 任意组合下均确定） | ✅ 与单值一致 |
| 5 | 范围 #1 | :126 | `{ ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }` | ✅ 与片段同 |
| 6 | R2 方案 | :218 | `FORCE_COLOR:'0'` + `NO_COLOR:'1'` | ✅ 与单值一致 |

**残留扫描**（`候选｜二择一｜二选一｜定稿｜回填`）：仅 4 命中且**均非缺陷**——

- :27 「3.x/W5 候选」= 通用守卫面晋升候选（与 plainEnv 选型无关）；
- :88 「**无**候选并列 · **无**回填项」= 否定句；
- :265 「（待回填）」= 执行者自检槽（未开工，正常）；
- :281 = 修订记录**史实**（登记「删候选 a/b 与 30 定稿回填」这一动作）。

⇒ B1 四处（片段/契约/锁/范围）+ R2 一致 · 无残留「二择一」· **闭合成立**。

---

## 3. A1–A5 逐条核对：**全忠实落点**

| id | 要求 | 实测落点 | 判定 |
|----|------|----------|------|
| A1 | 验收 #1 补 +N | :165 → `860+N tests / 859+N pass / 0 fail / 1 skip`（与 #2 :166 同式） | ✅ |
| A2 | 同族计数一致 | :193 → 「37 命中 / 32 文件中除真红 B 外的 **36 处 / 31 文件**」；:189 同 37/32 | ✅ |
| A3 | 范围 #2 grep 补 -r | :91、:128、:189 均为 `grep -rn` | ✅ |
| A4 | 去重 npm deprecate | :104、:140 各单次 | ✅ |
| A5a | 契约锁措辞 | :96 → 「在 ambient `FORCE_COLOR`/`NO_COLOR` 任意组合下均确定」 | ✅ |
| A5b | core-harness 行号核正 | :179 → `:45-50`（console 捕获）· `:51-59`（stdout.write 捕获）；实读 core-harness.ts :45-50 console / :51-59 stdout.write **逐字吻合** | ✅ |
| A5c | 影响面补注 2 fail 前提 | :61 → 「**2 fail 依赖 ambient `NO_COLOR=1`**（B 机制）；**真 TTY 无 NO_COLOR 仅 1 fail**（A 机制）」 | ✅ |

---

## 4. 回归与闸

- 本轮**仅 task 文档变更**（R1 已证 test/src 零改动 · 本轮 git status 未见 tracked 变更），R1 的三态基线、pins、typecheck 继续有效；无需复跑（00 亦明示）。
- 结构闸：**task lint PASS**；verify 渲染 **HG-AUDIT-R1 pending ⇒ 拒 30**（真值以 task 表为准 · 待 00 代签后转绿）。
- 未发现回填引入的新矛盾：L19/L249 测试策略与 :88/:95/:96/:218 口径自洽；:120/:165/:166 的 +N 口径一致。

### 残余非阻断观察（1 · 不影响可签）

| id | 项 | 建议 |
|----|----|------|
| R2-A1 | 修复锁 :95「断言**子进程** `NO_COLOR==='1' ∧ FORCE_COLOR==='0'`」的**可观测性** | 扫描器 stdout 不输出 env；30 可以「进程内断言 `plainEnv()` 字段（即 :96 契约锁）+ 另 spawn 探针」任一方式满足，二者等价。仅是执行澄清，**非阻断**。 |

---

## 结论（R2 · 机读）

~~~yaml
verdict: PASS                # B1 闭合 · A1–A5 全忠实 · 可签
blocking_count: 0
advisory_count: 1            # R2-A1（非阻断）
B1: CLOSED
A1_A5_verified: true
gate_HG_TASK_DRAFT: approved
gate_HG_AUDIT_R1: pending    # 本帽不代签 · 00 可代签
can_sign: true
next_hat_after_sign: 30
~~~

**总结论：PASS —— B1 闭合 · A1–A5 忠实落点 · blocking 0 · advisory 1（非阻断）· 可签。**  
单一取值 `FORCE_COLOR:'0'+NO_COLOR:'1'` 在片段/契约/两把锁/范围/R2 六处一致，无「二择一」残留；A1–A5 全部落点经行号核正。结构闸 task lint PASS；闸表不变（HG-AUDIT-R1 pending，**本帽不代签**）。

**带入 30 的执行要求（00 指定 · 随签闸口径）**：
1. 修复 commit 后以**最终 commit 的新鲜 clone** 复跑 scan/cli-discipline 与相关面（干净态判定）；
2. **pty 双态复跑**（`env -u NO_COLOR TERM=xterm-256color script -q /dev/null …`）确认 TTY 态 0 fail；
3. S2 相关基线若涉及，以最终 commit 克隆实测为准。

---

## 5. 维护者签闸（R2 通过 · 可签）

- [ ] 已读 R2 审查结论（**PASS · B1 闭合 · blocking 0**）
- [ ] 在 task 人工闸表将 **HG-AUDIT-R1 改为 approved**（维护者 / 00 代签 · 日期）
- [ ] commit task 文档或确认已签
- [ ] 再下发 Harness 30 Prompt（含上述 3 条带入 30 执行要求）

30 Agent 将以 task 表为准；`pending` 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | 20-task-audit **R2** 完成落盘 · B1 **闭合**（单值 `FORCE_COLOR:'0'+NO_COLOR:'1'` 六处一致 · 无二择一残留）· A1–A5 全忠实 · task lint PASS · verify 仍 BLOCKED（HG-AUDIT-R1 pending · 本帽不代签）· 结论 **PASS · 可签** |
