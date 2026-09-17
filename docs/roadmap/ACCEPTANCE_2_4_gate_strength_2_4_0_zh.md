# ACCEPTANCE · 2.4.0 门禁强度补全（gate strength）台账

> **版本**：`spec-wave@2.4.0`（**已 published** · 2026-09-14 · 人执行 publish · dist-tags `latest=2.4.0` · `time.2.4.0`=2026-09-14T10:07:41Z · tag **`v2.4.0`** ↔ bump commit `343025d` · 探针全过）
> **tasks**：[`docs/tasks/done/`](../tasks/done/) `task_2_4_gate_strength_w1..w6_*`（W1–W6 全 CLOSE · release 波无独立 task，走 RELEASING 人 checklist）
> **依据**：[`.workbuddy/output/验收报告-SpecWave-2.3.0.md`](../harness/reviews/w7_evidence_provenance_20260917.md) §6「建议 2.4」八组（N2–N14）+ §6 末对外口径三条 + [`ACCEPTANCE_2_3_1_patch_2_3_1_zh.md`](./ACCEPTANCE_2_3_1_patch_2_3_1_zh.md) 已知残余登记三条；规划 [`PLAN_2_4_gate_strength_v1_zh.md`](./PLAN_2_4_gate_strength_v1_zh.md)（HG-NEXT-PLAN=approved · 维护者授权 00 代签过程闸）

## 修复清单（W1–W6 · 全落地）

| Wave | 项 | 级别 | 修复 | 机械证据 | commit |
|------|----|------|------|----------|--------|
| W1 | N7 pin-16 refstyle 绕过 | P2 | 链接提取补 reference-definition 分支（`^\s*\[[^\]]+\]:\s*(\S+)`）· 与 inline 同一归一/判定管线（D-24-PIN16-REFSTYLE） | 负向 fixture 24W1-N7（refstyle 引用白名单外 `.md` → exit 2）修复前真红留证；对照组入 files 转绿 | `dc0e326` |
| W1 | N8 pin-17 词锚限定表行 | P2 | 词锚∧表行双命中（`^\s*\|` 宽松起首行内命中才算 · tagline/prose 裸词顶包不计入 · D-24-PIN17-TABLEROW） | 负向 fixture 24W1-N8（删适配表行保留枚举句 → exit 2）修复前真红；补表行转绿 | `dc0e326` |
| W1 | N9 pin-08 语义格位锁定 | P2 | 行合格 ⟺ 状态列 cells[2] 含点式 `X.Y.Z` ∧ slug 列行身份辅助判；`X_Y`/`X_Y_Z` 前缀式不计入版本串（D-24-PIN08-SEMCELL） | 负向 fixture 24W1-N9（改坏状态格 → exit 2）+ 真仓对照实验 exit 0→2→0 留痕 · 现行合规文件零误伤 | `dc0e326` |
| W2 | A2 结论节内「只写通过二字」 | P2 | `evalReviewConclusion` 增节内容量判据：剥除全部通过词命中后残余非空白字符 < 20 → 判未通过（S1·N=20 · failClosed exit 2 · 不追溯存量 D-24-W2-NO-RETRO） | 评审先行：评审文 `w2_conclusion_gate_strength_review_20260914` 落盘（S1/S2/S3 对比 · 存量 48 份实测 S1·N=20 误伤 0）；负向 fixture 修复前真红（verify exit 0 复现残余缺口）→ 修复后 exit 2；66 份 done 全量复测波及=0 · 零新增豁免；新增 6 用例 | `38e8ba6` |
| W3 | N12 输出层统一相对化 | P2 | 相对化收敛为输出层统一出口 `printJson`（深遍历字符串值 · 仓根绝对前缀词法判据 · 路径边界 lookaround）· 26 处 stdout JSON 出口收敛；V2 四处泄漏逐项修复 + `host validate --json#file` 同型 | 机械断言 `test/cli-json-no-abs-path.test.ts` 21 测（19 个 `--json` 命令面绝对入参 grep 仓根前缀为空 · 负向自证 4 例真红 · 键集钉死 6 组）；四处修复前后实测对照留证 | `72a44c2` |
| W4 | N2 assets verify 排除项 warning | P2 | 被排除项（`.bak`/`*~`/`.DS_Store`）输出显式 `WARN: 排除项 N 个（不参与哈希校验）` 清单（超 5 截断）· `--json` 增 `excluded: string[]`（键集只增不改 · warning 不升 exit 2） | 构造「assets/ 放 `.bak` → verify exit 0 但 warning 点名」正负向 + 截断 + warning 不掩负向（真实篡改仍 exit 2）· 新增 4 用例 | `fc6dbbc` |
| W4 | N5 rebuild 追认警示 | P2 | `assets manifest rebuild` dry-run 与 `--yes` 两路强制输出追认警示（「追认为真值 · 篡改将随 rebuild 合法化 · 防投毒依赖 provenance（未启用）」） | 快照断言两路；既有 mismatch/missing/extra 三负向 exit 2 不回退 | `fc6dbbc` |
| W5 | N3 物料快照标注 + 口径三调 + N6 aider | P2+P3 | promotion 4 份逐份处置（03 天然快照 · 01/02/04 文首「历史版本快照（2.1.3 时点）」标注）；T-03「可机检」→「防意外漂移」；《安全设计》§5.3.1 A-1 行收窄 + `:77`「篡改发现」→「意外漂移发现」；关账声称以 W2 落地为界；README 双语 aider 行补 `conventions-file: AGENTS.md` | 黑名单词 grep 机检 4 份逐份留证（`四宿主`/`406 用例`/`2.1.3` 现行表述位零命中或快照标注存在）；口径收窄 grep 断言；pins check 全量回归（pin-17 表行命中不破） | `b31515e` |
| W6 | N10 pin-16 大小写口径 | P3 | 链接目标与 `files[]` 成员大小写不敏感比较 + 磁盘存在性二次确认（仓根条目快照同为大小写不敏感）为最终判据（D-24-W6-N10） | 24W6-N10 组 3 用例：双向大小写差异正向 · F-W6-01 负向对照不误放（盘上无任何大小写变体仍 exit 2）· F-W2-07 回归 | `f844256` |
| W6 | N14 lint-done slug 口径 | P3 | slug 级存在性判集合键改 `meta.task_slug ?? 文件名 slug`（meta 优先 · 文件名兜底 · D-24-W6-N14）· 与帽级/豁免判同一真值源 | N14 组 3 用例：豁免 meta slug 命中红转绿 · meta slug invoke 目录双命中 · 真实仓零行为变化回归 | `f844256` |
| W6 | N4 exit 1 档位留痕 | P3 | 仅登记留痕不改行为（§3.E 判定符合 SPEC 00 §2.4 契约 · D-24-N4-REGISTER） | 登记落盘 `assets/harness/discipline-coverage.yaml` gaps `N4-EXIT1-REGISTER`（本棒收口 `closed_in: "2.4.0"`）· `test/cli-discipline-coverage.test.ts` 存在性核查 · exit 1 回归锁 `test/cli-security-closure.test.ts` 不变 | `f844256` + 本棒 |

## 门禁基线（本棒实测 · 2026-09-14）

| 门禁 | 结果 |
|------|------|
| `npm run typecheck` | 0 错 0 警 |
| `npm test` | **582 tests / 579 pass / 2 fail（均 tag-gated 设计红：pins check 真实仓 + release-tag-identity）/ 1 门控 skip**（基线 541 → 582 = +41 · 打 tag 后复跑须全绿） |
| `npm run build` / `test:lib` | exit 0 · 6/6 |
| `pins check` | **16/17** · 唯一偏差 = pin-10 git tag `v2.4.0` 缺失（**设计红** · 待人打 tag 后复跑须 17/17 · 口径同 2.3.x 先例） |
| `assets verify` | 110/110（bump 后 manifest rebuild ×2：pins fix 三钉面 ~3 变更 + N4 条目收口 ~1 变更 · 追认警示输出正常） |
| 裸 `verify` / `task lint-done` | PASS（豁免命中留痕全为 2.3.1 N11 既有条目） |
| `npm pack --dry-run` | 188 files（对照 2.3.1 的 188 一致）· .bak=0 · 无 *~ / .DS_Store · `check-pack-hygiene` PASS · 含 GLOSSARY/MIGRATION |

## 已知残余（主动登记）

- **pin-10 tag-gated 设计红**：~~待人打 `v2.4.0` tag 后复跑转绿~~ **已转绿**——tag `v2.4.0` ↔ `343025d` 落位后 `pins check` **17/17 PASS · exit 0**（00 实测 2026-09-14）· 口径同 2.3.x 先例（F-A1-05 git 操作仅人）。
- **W3 已知未测项**（task `2-4-gate-strength-w3` 登记）：仓外 target（/tmp 靶场）toRel 语义沿用既有（F-W3-02 · 断言判据只认仓根前缀）；`emitHostFail` base 取 `process.cwd()`（cwd≠target 时仓内绝对值兜底为原样 · 与既有 toRel 调用点口径一致）。
- **W6 已知未测项**（task `2-4-gate-strength-w6` 登记）：**F-W6-02 无机测 fixture**——Linux 同名不同大小写两文件并存场景（macOS FS 不支持同名两变体 · 口径 = 存在性确认命中其一即放行 · 仓根条目快照天然覆盖）；N10 负向在 Linux CI 的等价性由「快照大小写不敏感」实现保证（非 existsSync 平台语义）。residual_risks：N10 同名冲突歧义（低危 · 口径明示）；N14 统一后外部脚本依赖文件名 slug（本仓内机制 · 无外部消费者证据）。
- **N4 留痕收口**：`assets/harness/discipline-coverage.yaml` gaps `N4-EXIT1-REGISTER`（`closed_in: "2.4.0"`）——exit 1 档位判定符合契约、行为零变更，本台账「留痕」引用即收口。

## 发布边界

- 本棒（bump/release）未执行 `git tag` / `git push` / `npm publish` / `npm deprecate`（仅人 · HG-RELEASE 不在 00 代签授权范围）· 未用 `--force`/`--allow-*`。
- RELEASING 人 checklist 2.4.0 节已备（含「打 tag 后复跑 pins 17/17 + npm test 全绿」与「pack 清单无 .bak 对照 2.3.1 的 188 文件」探针）。
- pin-10 设计红待人打 `v2.4.0` 后复跑转绿（见上「已知残余」第 1 条 · **已转绿**）。
- **发布完成回填（2026-09-14 · 人 publish 后 00+release 棒代核 ⑨）**：tag `v2.4.0` ↔ `343025d` 已 push；registry dist-tags `latest=2.4.0`（`time.2.4.0`=2026-09-14T10:07:41Z）；探针全过（`npm view`=2.4.0 · `git show v2.4.0:package.json`=2.4.0 · 真 tarball 188 文件对照 2.3.1 一致 · .bak/*~/.DS_Store=0）；打 tag 后复跑 `pins check` 17/17 · `npm test` 581 pass / 0 fail / 1 门控 skip。
