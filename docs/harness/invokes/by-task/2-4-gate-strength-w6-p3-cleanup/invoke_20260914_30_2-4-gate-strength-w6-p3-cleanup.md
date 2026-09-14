# invoke · 30 · 2-4-gate-strength-w6-p3-cleanup（实现留痕）

> **hat**：30 实现棒 · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w6_p3_cleanup.md`
> **前置核对**：GATE_VERIFY PASS（HG-TASK-DRAFT / HG-AUDIT-R1 双 approved · R1 指针审查文承接总审 PASS）。
> **蓝本**：SPEC 06（signed · D-24-N4-REGISTER 冻结）· 验收报告 §3.K/§3.O/§3.E。

## 1. N10 · pin-16 大小写口径统一（D-24-W6-N10 · §3.K）

- 修复前真红留证：mktemp fixture（链接 `foo.md` · 盘上 `FOO.md` · 白名单含 `FOO.md`）→ 旧码 `pins check` exit 2 假红（`README.md:3 -> foo.md` · macOS 大小写不敏感 FS 触发）。
- 定点 `src/cli-pins.ts` files-whitelist-link 比对区：`inFiles` 改大小写不敏感比较；新增 `existsOnDiskCi`（仓根条目快照 · 同大小写不敏感）作磁盘存在性二次确认最终判据——白名单命中但盘上无任何大小写变体 → 不放行仍 exit 2（F-W6-01 · detail 带标记）；双平台语义一致（不依赖 existsSync 的平台 FS 语义）。白名单外不存在目标不判（F-W2-07）与 npm 自动入包口径保持不变。
- pin-16 semantics 数据声明同步入 `assets/release-pins.yaml`（口径入数据纪律）。

## 2. N14 · lint-done slug 口径统一（D-24-W6-N14 · §3.O）

- 定点 `src/cli-task-extra.ts` lintDoneInvokes：doneSlugs 存在性判集合键由文件名 slug 改为 `meta.task_slug ?? 文件名 slug`（meta 优先 · 文件名兜底 · normalizeSlug 归一沿用 · 读失败文件名兜底 failClosed 方向不变）；帽级/豁免判（:110-113）不动 —— 两级同一真值源。`--help` 文案显式声明口径（留档）。
- 修复前真红留证（stash 旧码复现）：文件名 `task_file_name_slug_v1.md` + meta `meta_slug_x` + 豁免 slug `meta_slug_x` → 旧码 slug 级缺口点名 `file-name-slug`（豁免永不命中）FAIL；新码豁免命中 PASS + 留痕回显。
- 生产零行为变化实证：改前脚本盘点 done 双布局 70 份 meta slug == 文件名 slug（0 diff）；改后真实仓 `task lint-done` PASS（70 slugs 计数与改前一致）。

## 3. N4 · 仅登记留痕（D-24-N4-REGISTER · §3.E · 不改行为）

- 落点定稿（task 授权二选一）：`assets/harness/discipline-coverage.yaml` gaps 新增 `N4-EXIT1-REGISTER`（status closed · closed_in unreleased）——「--task/--spec 仓外路径拒绝走 exit 1（用法档 · 符合 SPEC 00 §2.4）——下游 CI 若需安全事件信号应匹配拒绝文案而非仅 exit 2」；随 2.4.0 ACCEPTANCE 档「留痕」节收口。理由：ACCEPTANCE 2.4.0 尚未开卷（属发版波），覆盖表 note 随包分发下游可查。
- 行为零变更：exit 1 用例组 `test/cli-security-closure.test.ts`（:193/:205/:217/:230）原样全绿未动；留痕存在性机检新增 `test/cli-discipline-coverage.test.ts` ④ 用例。

## 4. 测试与门禁

新增机测 7 用例（pins-consistency 24W6-N10a/b/c · cli-w4-gate-wiring N14 组 ×3 · cli-discipline-coverage ④）；TEST-LOCK grep 影响面逐处复核零联改（旧断言全绿）。四门 + pins 17/17 + assets rebuild→verify 110/110 全绿（assets ~2 变更 = release-pins.yaml / discipline-coverage.yaml）。

## 5. 未做（禁区）

未改 N4 exit 码行为（F-W6-04 锁死）· 未动 lint-done 豁免判定语义本身 · 未做通用大小写策略框架 · 未 `git add -A` · 未 tag/push/publish/bump（属发版波）。
