# ACCEPTANCE · 2.4.2 patch（验收报告 R-1/R-2/R-3 修复）台账

> **版本**：`spec-wave@2.4.2`（**待发版** · bump 已落 2026-09-15 · **本版 tag/push/publish/deprecate 全仅人**——2.4.1 代跑授权系一次性不延续 · 报告 §6.3）
> **task**：[`docs/tasks/done/task_2_4_2_patch.md`](../tasks/done/task_2_4_2_patch.md)（slug `2-4-2-patch` · 无独立 SPEC 夹 · 属 2_4-gate-strength 验收后 patch · 已关账 CLOSED）
> **依据**：`.workbuddy/output/验收报告-SpecWave-2.4.1.md` §3.1/§3.2/§3.3 + §4 残余登记 + §6.1（判 PASS-with-issues 无 P1）· R1 审查文 `docs/harness/reviews/task_2_4_2_patch_audit_R1_20260915.md`（PASS · R-2 误伤预判模拟 0/67+0/76 · 提示级行号漂移 2 处以现值为准）

## 修复清单（§6.1 建议 2.4.2 三条 · 全落地）

| 项 | 级别 | 修复 | 机械证据 |
|----|------|------|----------|
| R-1 | P2 | `host validate` 缺省基改取 `--file` 所在仓根（`findGitRoot(path.dirname(abs))` 上溯 · 与 task lint/close 2.4.1 同口径 · cmdHostValidate 三面 printJson + 人类输出同改）；`--target` 显式传入仍以 target 为准（2.4.1 接口面不动）；仓外文件（上溯 null）不打印绝对路径 —— JSON 标 `outside_repo: true` + `file` 取 basename 占位（键集只增）· 人类输出同口径占位 | 负向 ×2 修复前真红（cwd=/tmp 靶场缺省调用 file=绝对路径 · 复现 §3.2 第 5 行；realpath 同型）· 修复后仓内相对形；仓外文件用例 `outside_repo: true` + basename + 无绝对路径 + verdict PASS 不回退；`--target` 显式/缺省 cwd=仓根用例零回退；`grep -c 'printJson(process.cwd()' src/cli.ts src/cli-host.ts` 维持 0/0 |
| R-2 | P2 | `REVIEW_NEG_RE` 补 `not\s*pass`（i 沿用 · 封堵 `NOT PASS` · §3.1 行 G）；`不/未` 两分支窗口 `{0,3}` → 同句共现 `不[^。；\n]{0,12}通过` / `未[^。；\n]{0,12}通过`（封堵插 4 字「不最终予以通过」「未能够予以通过」· 行 I/J · §4 R-4 建议形态）；排除 `。；` 限同句防跨句误中；**窗口显式排除 `\n` → R-5 换行形态维持已登记残余（归 3.0 · K 断言钉死防顺手修）** | 三负向修复前真红（G/I/J 旧码全 exit 0 误绿 · 复现 §3.1 探针行）修复后全 exit 2 点名「含否定结论词」· close 同口径；对照 A PASS · B/D/E/L/F/M 仍 FAIL 零回退 · **K 换行形态维持 PASS 漏网断言入测** |
| R-3 | P2 | pin-16 `htmlARe` 属性值三选一 `"([^"]+)"\|'([^']+)'\|([^\s>]+)`（合法 HTML5 无引号形态入扫描面）；消费点联改 `m[1] ?? m[2] ?? m[3]`（捕获组 1/2/3 按形态互斥 · E5 收窄注释同步 · F-P3-07）；yaml pin-16 `semantics` 声明同步含无引号形态 | 负向 `<a href=AGENTS.md>` 修复前 exit 0（复现 §3.3 末行）修复后 exit 2 指行号 · 入 files 转绿；双引号/单引号/大写/属性序四形态 + 无引号混合各指行号（三捕获组取值实测）· 既有用例零回退 |

## R-2-c 存量误伤实测（硬条款 · 双跑对比 · 2026-09-15）

- **样本面**：A 面 = `docs/tasks/done/` 全量 task 最新审查文（findLatestReview · 机读闸真实消费面）**总量 72（5 份无审查文 · 实评 67 份）**；B 面 = `docs/harness/reviews/` 全件直评 **77 份**（含本 task R1 审查文 · dogfood 顺带）。合计 149 行判定记录。
- **方法**：修复前/后 `evalReviewConclusion` 全判定链（节抽取 → 否定守卫 → 通过词 → S1·N=20）双跑快照，逐字 diff。
- **结果**：**双跑判定名单逐字一致（IDENTICAL）——翻转 0**：措辞巧合误伤 **0** · 真实否定语义翻转 **0**（远低于 >3 份回退阈值 · **无需回退保守档**）；R1 预判模拟（0/67+0/76）经 30 真实复测坐实（B 面 77 = R1 模拟 76 + 本 task R1 审查文新增 1）。
- 处置留痕：无误伤无需豁免（F-P3-05 不适用）；理论误伤窗（「不再阻塞，予以通过」类同句共现）存量零命中 · F-P3-04 阈值机制保留在案。

## 门禁基线（本棒实测 · 2026-09-15）

| 门禁 | 结果 |
|------|------|
| `npm run typecheck` | 0 错 |
| `npm test` | **607 tests / 604 pass / 0 意外红 / 1 门控 skip**（基线 596 → 607 = +11 新测（R-1×4 · R-2×5 · R-3×2）· 仅 2 条 tag-gated 设计红：release-tag-identity + pins A 组 pin-10 · 打 tag 后复跑须全绿） |
| `npm run build` / `test:lib` | exit 0 |
| `pins check` | **16/17** · 唯一偏差 = pin-10 git tag `v2.4.2` 缺失（**设计红** · 待人打 tag 后复跑须 17/17 · 口径同 2.4.1） |
| `assets verify` | **110/110**（pin-16 semantics 变更触发 manifest rebuild ~4 变更收口 · F-P3-13） |
| 裸 `verify` / `verify --task` | PASS（GATE_VERIFY 闸扫描表全 approved · invoke 三件套齐） |

## 已知残余（主动登记 · 归 3.0）

- R-5（`不\n通过` 换行形态）维持漏网（2.4.1 R1 §3-1 裁决 + 本波窗口显式排除 `\n` · K 断言钉死）· 归 3.0。
- R-6（git 可诊断性 · shim exit 69 分档/前置探测）归 3.0 W5（本波仅登记环境警示 + F-P3-14 对照实验条款）。
- pin-08 版本↔发布态绑定（§3.3 C 形态）· pin-17 伪表行（NEW-4）· S1·N=20 非语义闸（NEW-5）· NEW-6..12 · NEW-10/NEW-11 · pin-16 语义面 —— 全部归 3.0 W4/W5（报告 §6.2 · PLAN_3_0 已启动）。
- pin-10 tag-gated 设计红待人打 `v2.4.2` 后复跑转绿（须 17/17）。

## 发布边界

- 本棒未执行 `git tag` / `git push` / `npm publish` / `npm deprecate`（**全仅人** · 2.4.1 代跑授权不延续）· 未用 `--force` / `git add -A`。
- RELEASING 人 checklist 2.4.2 节已备（含发布边界注记 + 原子推教训保持 + 打 tag 后复跑 pins 17/17 + npm test 全绿 + pack 清单无 .bak 探针）。
