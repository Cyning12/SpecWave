# Invoke：40（review-of-work）· 3-0-w4-semantic-criteria

| 字段 | 值 |
|------|-----|
| hat_id | 40-review-of-work |
| task_slug | `3-0-w4-semantic-criteria` |
| task_paths | `docs/tasks/active/task_3_0_w4_semantic_criteria.md` |
| git_branch | `main` |
| created_utc_or_local | 2026-09-17 |
| 复核对象 | `0eb6cd7..cc5d2a7`（HEAD）七 commit |

## 复核范围与方式

独立复核 30 四阶段交付（NEW-5 档 M / NEW-11 词表 / R-5 窄邻接 + K 翻向 / pin-17 双层 / pin-08 S_mid / NEW-10 A1+U1 / N5 登记）。**不接受「30 说绿」**：全部平台锁独立复跑 + 判据行为用 **git worktree 挂 0eb6cd7（修复前码）与 lib/（修复后码）双侧探针**独立重放红绿 + 存量 88 基线集独立复跑比对评审文 §7 逐字 + diff/grep 机检面逐条自跑。探针临件落 /tmp（worktree 已 remove · 工作树净）。

## 独立实测证据（40 本棒自跑）

### 平台锁复跑

| 项 | 实测 | 预期 | 判 |
|----|------|------|----|
| `npm run typecheck` | 0 错（exit 0） | 0 错 | ✓ |
| `npm run build` | exit 0（先于 test:lib） | 0 错 | ✓ |
| `npm test` | **794 tests / 150 suites / 793 pass / 0 fail / 1 skip**（duration ≈97s） | 794/150/793/0/1 | ✓ 逐字 |
| `npm run test:lib` | **6/6 pass**（exit 0） | 6/6 | ✓ |
| `pins check` | **17/17 PASS** | 17/17 | ✓ |
| `verify --task <本 task>` | **VERIFY: PASS**（exit 0 · 双闸 approved 落表） | PASS | ✓ |
| 裸 `verify --target .` | exit 0 · VERIFY: PASS · **豁免留痕 24 条（18 旧+6 新）· invalid 0**（grep -c 实测 24/0） | 24/0 | ✓ |
| `task lint` / `gate-check` | PASS / exit 0 未发现阻塞 | PASS/0 | ✓（验收 #12） |

### 判据红绿独立重放（40 探针 · pre=0eb6cd7 worktree / post=HEAD lib）

| fixture | pre | post | 判 |
|---------|-----|------|----|
| NEW-5① 「通过。」+填充顶包 | PASS（漏网真红） | FAIL 点名缺 SUBJ | ✓ |
| NEW-5② 「本审查通过。」+填充 | PASS（真红） | FAIL 点名缺 OBJ∨GATE | ✓ |
| NEW-5③ 「HG-SPEC-SIGNOFF approved，予以通过。」（偏差①登记后真值版） | PASS（真红） | FAIL 点名缺 SUBJ | ✓ |
| NEW-5④ 诚实边界对照 | PASS | PASS（成段伪造不防 · R-① 边界声明一致） | ✓ |
| R-5 跨行三形态（不\n通过 / 未\n通过 / 未\n予以通过） | PASS×3（真红） | FAIL×3 点名含否定结论词 | ✓ |
| R-5 跨段反向锁（不\n\n通过） | PASS | **PASS 维持**（窄式不跨段钉死） | ✓ |
| NEW-11 不予签收 / vetoed / 未 pass 混入 | PASS×3（真红） | FAIL×3 | ✓ |
| NEW-11 does not pass | FAIL | FAIL（2.4.2 R-2 既有覆盖 · 偏差②登记属实） | ✓ |
| 地板对照「通过\n」 | — | FAIL 内容量不足（substance≥20 地板零回退） | ✓ |
| A1 假授权四形态（张三 / "00" / 有日期无出处词 / 有出处词无日期） | — | **invalid×4 + 不豁免**（loader 探针 · 合规对照收编 1 invalid 0） | ✓ |
| pin-17 伪表行两构造 + pin-08 裸版本串（jest 抽跑） | — | `pins-consistency` 33/33 pass（含 3.0-W4 NEW-4 套件） | ✓ |
| NEW-5/R-5/NEW-10/U1 套件（jest 抽跑） | — | 12/12 pass | ✓ |

### 存量波及独立复跑（验收 #2/#3 · 88 基线集口径）

对 `docs/harness/reviews` **88 基线集**（现 90 件 − 评审文自身 − 本波 R1 审查文 · A3 口径）逐件跑双侧 evalReviewConclusion：

- **pre：PASS 63 / FAIL 25** —— 与评审文 §0/§7 **逐字一致** ✓
- **post：PASS 57 / FAIL 31（25 旧 + 6 新）** —— 与 30 自检逐字一致 ✓
- **翻转恰 6 件**（00-default-behavior-kit-1-7-1 + 2-4-gate-strength-w{1,3,4,5,6}-* · 全「缺 SUBJ」形态）· **无第 7 件意外误伤** ✓
- 旧 FAIL 25 集零翻绿（判据单调加严）· **NEW-11 词表误伤 0/63**（6 件翻转转因全为 SUBJ 缺 · 无一否定词命中）✓
- 6 条新豁免 `legacy-gate-exempt.yaml:88-111` 四字段齐 · reason 引评审文 §2.3/§7 · authorized_by「00（2026-09-16 维护者双签授权 00 代签）」**自过 A1 三元判**（裸 verify invalid 0 实证）· 头注释 A1/A2/A3 登记在案（:6-9）
- pin-17 26/26 · pin-08 15/15 · exempt 40/40（24+16 loader 收编）—— pins 17/17 + 裸 verify + pins-consistency 三面兜住 ✓

### 机检面抽核

- **#5 K 同 commit**：`45569ec` 单 commit 含 `src/checks/review-gates.ts`（NEG_RE 窄邻接 alternative + 2.4.2 注释封板 :129-134 已改封堵口径）与 `test/cli-w4-gate-wiring.test.ts`（K 断言同 fixture exit 0→2 + 跨段反向锁新增 · 旧「维持漏网」断言零残留）**双侧 diff** ✓（F-W4-09 硬锁兑现）
- **#7 KPI 零 diff**：`git diff 0eb6cd7..HEAD -- src/ test/ | grep -i kpi` **零命中**（exit 1）· close_kpi 零变更 ✓
- **#10 helper 单源**：`resolveExemptEntry` 唯一定义 `src/checks/exempt.ts:36` · 三消费面（verify.ts:169 裸 / :352 done 面 · cli-task-extra.ts:108,125 lint-done）同构调用 · src 内 exempt 表 `.get(normalizeSlug())` 仅 :41 一处（余 Map.get 分属 fileMap/taskMap 无关）✓ · done 面双向 fixture（exempted 留痕含 JSON 键 / 无豁免 warn 维持）在案 · close 不消费不对称显式注释 `close-guards.ts:92` 在案 ✓
- **A1 四处重锚（20 审 advisory）**：全部与 loader 同 commit `89d89d6` —— ① w4l_ok（w4 wiring :313-315）② meta_slug_x（:345-347）③ N13「"00"」语义有意反转 + 注释（:767/:774-775 · 裸名裸号今后即假授权形态）④ cli-verify-spec :240（bare_gap）✓
- **#11 既有面零意外**：`git diff 0eb6cd7..HEAD --name-status` 全量 26 文件逐一比对 —— 15 文件对照 fixture 重锚（抽样 cli-flags/gate-semantics/cli-p0 全为补 OBJ 锚词「范围与验收」同构单行）· K 翻向 · pins-consistency A2 断言同 commit 更新（b7b3cce）· sha256.manifest 随 release-pins.yaml 联动（循 W3 先例）· A1 四处 —— 与自检登记清单逐条对应 · **零意外** ✓
- **N5 零行为变更**：`src/cli-assets.ts` diff 0 行 ✓ · **依赖零新增**：package.json/lock diff 0 行 ✓
- **commit 卫生**：七 commit 逐笔 show --stat 边界干净（scope 与提交信息约定一致）· 工作树净 · main ahead 7 **未 push** · 无新 tag ✓（#13）
- **#4**：评审文 + R1 审查文 `git ls-files` 命中 · 判据两分声明双重在案 ✓

## 收官备料核对

自检结论 13 条逐项回填完整（含锁计数 773→794 纯加性四阶段链 · F-W2-13 登记清单四阶段 · N5 口径 · 豁免 24 条留痕面 · 偏差 5+1 条）· **KPI 自评备料段（:347）在案**（rubric 引照 · 硬约束 6/7/11/14/15 逐项兑现声明 · advisory A1–A4 落地声明）—— 足够 00 填 `### KPI（00）` 节；KPI 节本体未动（硬约束 11）· close_kpi 存在性口径满足（节存在 · 待 00 回填）。

## 发现清单

- **blocking：0**
- **advisory：0**
- 观察注记（非发现 · 不复核则不可见者）：① fixture ③ 换词（HG-AUDIT-R1→HG-SPEC-SIGNOFF）偏差登记属实 —— 40 探针证实底稿字面版会先撞无通过词检查 · 换词后判定意图不变；② 88 基线集口径须同时排除评审文自身与本波 R1 审查文两件方与评审文 §7 逐字对齐 —— A3 口径写明无歧义。

## 结论

**PASS**（blocking 0 · advisory 0）—— 独立复跑全绿 · 红绿证据链经 40 双侧探针独立重放属实 · 存量波及与评审文 §7 逐字一致 · 豁免留痕面完整 · 机检面（K 同 commit / KPI 零 diff / helper 单源 / A1 四处 / 既有面零意外）全部咬住。

## 未做（禁区）

未改 src/test/yaml/SPEC/PLAN/task 文 · 未签任何闸 · 未 push/tag/publish/deprecate（探针 worktree 已清理 · 本棒唯一写面 = 本 invoke 新增）。

## 下一棒

00 放行 → **30 `task close --yes`** 关账（00 收官裁定回填 `### KPI（00）` 节 · 备料充足）· task 归档 done/。
