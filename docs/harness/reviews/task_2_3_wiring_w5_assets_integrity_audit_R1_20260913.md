# Task Audit R1：2-3-wiring-w5-assets-integrity

> **日期**：2026-09-13 · **hat_id**：`20-task-audit`  
> **对象**：`docs/tasks/active/task_2_3_wiring_w5_assets_integrity.md`  
> **蓝本**：`docs/spec/2_3-wiring-completion/05_w5_assets_integrity_v1.md`（signed · HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）

## 结论摘要

| 维度 | 结论 |
|------|------|
| **内容审查** | **PASS · 零内容阻塞 → 签收（本轮为终轮）** |
| **流程闸 HG-AUDIT-R1** | 审查时 pending → 审查通过后按 2026-09-12 维护者会话授权 **00 代签 approved**（见签收节） |
| **评审文前置（D-23-W4-REVIEW-FIRST）** | **不适用**：W5 属新命令/新数据文件新增，非既有门禁语义变更（SPEC 04 硬前置对象为 W4 闸语义接线）· task R5 已述理由，本审确认成立 |

## 核对项（逐条实测）

| # | 核对点 | 结论 | 证据 |
|---|--------|------|------|
| 1 | 范围与 SPEC 05 §3 一致 | ✅ | task 范围①–⑧ = SPEC ①–④ 转写（①实现源=SPEC①②③载体 · ②=SPEC② · ③=SPEC③ · ④=SPEC①落盘 · ⑤=SPEC④ · ⑥⑦⑧=SPEC §7.5/§7.6 验收落点单列）；无越界项 |
| 2 | 非范围完备 | ✅ | SPEC §4 五项全转写（签名/遥测/代码面/消费者侧/publish）+ 增补六项（对外宣称零改动/RELEASING/build 钩子/pins 并入/拉取修复/--force/schema/S2）均合法纪律性增补 |
| 3 | **形态选择在 SPEC 授权内**（§3②③「随 task 定」） | ✅ | manifest 格式采逐行文本（SPEC §6 荐）；修复采 `assets manifest rebuild` 独立子命令（SPEC §3③「`assets verify --fix` 或 `assets manifest rebuild`（形态 task 定）」明文授权二选一）；dry-run+`--yes` 沿袭 pins fix 语义（SPEC §3③ 同文） |
| 4 | **D-23-W5-GEN-CMD 与 SPEC 自洽性**（生成不挂 build 钩子） | ✅ | SPEC §5.1 明文「工作树内 manifest 须与 assets 同步——这正是门禁存在的意义（改了 assets 没重生成就红）」+ 验收④「破坏后对应步骤红」：若 build 钩子自动重生成则门禁永不可红，自相矛盾；task 定案 verify-only 点位 + 显式生成命令是 SPEC 内唯一自洽解读，论证成立 |
| 5 | **D-23-W5-FIX-TARGET 真值纪律** | ✅ | 修复对象=manifest（声明）、资产=真值永不反向改——与 pins「真值源不反向改」（cli-pins.ts unfixableReason :487）同构，SPEC §5.3 明文 |
| 6 | **D-23-W5-EXCLUDE 排除清单一致性**（F-W5-06） | ✅ | 单一常量双侧消费（生成/verify 同实现源）→ 「双侧排除清单一致」由构造保证；清单项（manifest 自身/`*.bak`/`*~`/`.DS_Store`）覆盖 SPEC §5.1「排除 manifest 自身 · 排除 .bak/临时文件」 |
| 7 | **D-23-W5-NOBAK 合理性** | ✅ | manifest 为派生数据可随时从资产重算（git 即备份）；pins fix .bak 语义针对手工真值文件；且 .bak 落 assets/ 徒增排除面——定案成立，与 pins 语义不冲突（非同类文件） |
| 8 | 验收标准可机械断言 | ✅ | 8 条均命令级：exit 码 / mismatch·missing·extra 输出 / git diff 空 / 幂等无 diff / pack 清单 / 四门命令 / bin 面实测；①–⑥ 逐字对齐 SPEC §7，⑦⑧ 纪律增补与前波同制 |
| 9 | failure_paths | ✅ | 9 行（F-W5-01..08 + F-T-01）含触发/行为/可重试/用户可见；F-W5-08（生成自动化消解门禁）与定案 D-23-W5-GEN-CMD 闭环 |
| 10 | 思考轮 R0–R5 + 控制表 | ✅ | 六轮回填闭合 · early_stop=R5 reason 成立（非门禁语义变更波 · 评审文前置不适用）· residual_risks ×3 具体（同步纪律/消费仓误跑/新命令演进） |
| 11 | 对外文案纪律 | ✅ | 范围⑦ 明文 CHANGELOG 仅 Unreleased Added 一条（未发布口径 · 前波同例）· README/事实卡/对外宣称零改动入非范围——与事实卡 §11 禁称 + W4 评审文 §6（解禁归维护者）一致 |
| 12 | task lint 结构闸 | ✅ | `node bin/specgate.js task lint --file docs/tasks/active/task_2_3_wiring_w5_assets_integrity.md` → LINT: PASS（W3 占位符 warn · draft 期合法）· exit 0 · G4 思考轮三槽（W5/W6/W7）零 warn |
| 13 | 闸扫描拒 30（pending 态正确性） | ✅ | `node bin/specgate.js verify --target . --task .../task_2_3_wiring_w5_assets_integrity.md` → HG-AUDIT-R1 pending ❌ 拒 30 · VERIFY: BLOCKED · exit 2（本审实测） |
| 14 | R0 引证抽验 | ✅ | `grep "cmd === 'assets'" src/ bin/` 零命中属实 · `assets/sha256.manifest` 不存在属实 · package.json :42 与 ci.yml :34 pins 点位属实（sed 抽行）· files 白名单含 assets 属实（package.json :28）· 资产 110 文件/无 symlink/无 .bak 属实（find 复核）· 基线 513/513 + pins 17/17 本审复跑属实 |
| 15 | 测试影响面勘查 | ✅ | ci-workflow-security.test.ts 仅断言 permissions/audit/secrets-scan 存在性（加步安全）· cli-help.test.ts 无命令全集枚举（新命令无需联改）· DEF-009 仅扫 assets/** 引用（task/review 出扫描面）· 本审 grep 复核属实；lib-smoke 增钉面为纯新增不改既有断言 |
| 16 | bin 面硬条款（W3 教训） | ✅ | 验收⑦ 明文①–④ 全部经 `node bin/specgate.js` 实测贴输出 + lib-smoke 钉面；与前波同制 |

## 非阻塞观察（不影响签收 · 留痕备查）

1. **消费仓误跑面**：`assets verify` 对无 assets 目录的 target failClosed exit 2（F-W5-02）——语义正确（该命令定位=包自检），但未来若消费者脚本误接入会红；已在 task residual_risks ② 留痕，输出文案须指明「目录缺失」语义，50 复检时核对。
2. **manifest 格式无版本/元信息头**：逐行纯 `<hash>  <path>` 保持 sha256sum 生态兼容（SPEC §6 荐），代价是格式演进时无自描述版本号；本审认为可接受（格式变更属新波次 · CHANGELOG 明示即可）。
3. **rebuild 对 assets 目录缺失 exit 2**：与 verify 同档 failClosed（不生成空 manifest 伪装绿）——task 范围③ 已含，审认为口径正确。

## 签收

20-task-audit R1 **PASS（内容零阻塞 · 本轮为终轮）** · 2026-09-13。

**HG-AUDIT-R1 → approved**（**2026-09-12 维护者会话授权 00 代签** · 本 R1 审查 pass 零阻塞）· 已落 task 人工闸表。30 开工前仍须 GATE_VERIFY（`verify --target . --task`）实测全绿。

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-13 | R1：零阻塞 pass · 范围/非范围/四定案（GEN-CMD/FIX-TARGET/NOBAK/EXCLUDE）/验收/failure_paths/思考轮全核对 · 非阻塞观察 ×3 · HG-AUDIT-R1 代签落表（2026-09-12 维护者会话授权 00 代签）· task lint PASS + 闸扫描 pending 拒 30 实测 |
