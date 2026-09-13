# invoke · 30+40 · 2.3 W4 A5+A6 闸语义接线实现与验收闭环

> **hat_id**：`30-execute-code` + `40-verify` · **日期**：2026-09-13  
> **task_slug**：`2-3-wiring-w4-gate-wiring`  
> **帽条文**：`assets/harness/prompts/30-execute-code.md` / `40-verify.md`

## 授权来源

维护者 2026-09-12 会话授权（00 委派 W4 实现棒走完整链路）· HG-AUDIT-R1 = approved（00 代签 · 评审文落盘+20 R1 通过前置满足）。开工前 GATE_VERIFY 实测：`node bin/specgate.js verify --target . --task docs/tasks/active/task_2_3_wiring_w4_gate_wiring.md` → 闸扫描全 approved · VERIFY: PASS · exit 0。

## 动作（30）

1. **G2 结论级**：`src/cli-checks.ts` 新增 findLatestReview（findReview 改布尔投影单一实现源）+ evalReviewConclusion（评审文 §2.1 v2 节标题起首口径 · 否定守卫三版修正留痕于评审文 §1）；evalCloseReview 升结论级；`src/cli.ts` verify --task 接入（active failClosed · done warn 降级 · --allow-no-review 同豁 · 无新旗标）。
2. **G4**：lintTaskFile 新增 W5（R0–R5 槽位）/W6（控制表）/W7（early_stop=yes 缺 reason）三条 warn-only（exit 码不变 · 不占旧包 E8–E10 语义 · 台账名单不动）。
3. **FULL-reviews**：`verifyBareReviewsMode` 裸 verify 仓级扫描（done failClosed 存在+结论级 · active 信息报告 · --json 键集只增不改含 reviews_scan · --with-wiki-lint 正交同生效）；原「须指定 --task/--spec」用法错语义由本模式取代（三处钉面联改）。
4. **INVOKE-HATS**：lintDoneInvokes 帽级（resolveRequiredInvokeHats/missingInvokeHats 复用 · 缺帽点名 FAIL exit 2）；slug 级缺口同消费豁免（实现期发现基线已红 2 项 · 评审文修订补记）。
5. **A6**：status reviews.CLOSE = 归档 ∧ 最高 R 轮结论可机读通过；reviews 增 close_evidence 键（只增不改）；注释升强证据口径。
6. **⑦⑧**：discipline-coverage.yaml 四闸 closed（closed_in 2.3.0 · note 含 src 行号证据 · as_of 保 2.2.1）+ A6 mechanical + A7 同步；`docs/harness/legacy-gate-exempt.yaml` 落盘（reviews 10 + invoke_hats 16 · 四字段齐）。
7. **测试**：新增 `test/cli-w4-gate-wiring.test.ts` 8 用例；联改 12 文件（评审文 §8 影响面全项）；513/513。
8. **文档**：CHANGELOG Unreleased 五条行为变更明示；README 双语裸 verify 用法行；RELEASING.md 零改动（`git diff` 留证）；事实卡 §11 禁称维持。

## 动作（40 · 验收自证）

全部经 `node bin/specgate.js` 真实命令（W3 教训 · 非仅 src 套件）：/tmp/w4-acc 靶场 exit 码硬断言——close 负向 2 / 正向 0 · verify active 负向 2 · 裸 verify 负向 2 → 豁免 0 · lint-done 负向 2 → 豁免 0 · status --json close_evidence 三态 · G4 W5/W7 bin 实测 exit 0；本仓 dogfood 裸 verify/lint-done 双 PASS（豁免留痕 28 项回显）；typecheck 0 错 · npm test 513/513 · build + test:lib 5/5 · pins 17/17 · lint-wiki-delta PASS · discipline show 分布变化（gaps not_wired 4→0）。逐项证据入 task 自检结论表。

## 未做（禁区）

- 未 tag / push / npm publish（仅人）· 未 bump 版本号（release 波）· 未动 RELEASING.md / host-adapt schema / 事实卡
- 未用 --force/--allow-* 绕门禁 · 未 git add -A · S2 仅手写新增无覆写
- 未扩范围（TASK_TEMPLATE 未改 · G4 未升 failClosed · deferred 三项未碰）

## 下一棒

00：task close --yes 归档 → 独立 commit `feat(2.3-W4): …` → 交付报告。
