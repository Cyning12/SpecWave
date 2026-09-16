# invoke 30 · 3-0-w1-schema-leap（五阶段实现棒 · 收官留档）

> **帽**：30 执行帽（task 实现 Agent）· **日期**：2026-09-16 · **task**：`docs/tasks/active/task_3_0_w1_schema_leap.md`
> **授权链**：HG-SCHEMA-CHANGE / HG-TASK-DRAFT / HG-AUDIT-R1 三闸 approved（2026-09-16 00 代签 · 授权真值：维护者本窗「授权00代签」）· schema 评审文 00 已批准（`docs/harness/reviews/w1_schema_change_review_20260916.md`）。

## GATE_VERIFY（阶段一改码前 · 机械首输出）

```
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_w1_schema_leap.md
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_w1_schema_leap.md
```

（阶段一 verify 渲染器为白名单 3 闸口径故表列 2 行；HG-SCHEMA-CHANGE 闸行在阶段四泛化交付后首次入渲染 · live 实证 `| HG-SCHEMA-CHANGE | approved | 30 | ✅ 可 30 |`。）

## 五阶段交付摘要（00 逐阶段验收放行 · 每阶段一笔 commit · 逐文件显式 add · 未 push/tag）

| 阶段 | commit | 交付 | npm test（t/s/p/f/skip） |
|------|--------|------|--------------------------|
| 基线 | 98d2062 | （复跑实测 · 原 4 环境红已消） | 607/116/606/0/1 |
| 一 | 8d2ac26 | schema_version 探测树 + v1 兼容桥（内建目录/hooks 缺省 resolved 模型层）+ compat 回归锁（2.4.2 表逐字 fixture + planned writes 快照 core 104/expanded 118）+ OQ-6 fixture + F-W1-03 fixture | 623/120/622/0/1 |
| 二 | 4c3e042 | defaults/extends 解析器（resolved rows 一次性展开 · OQ-2 九条目 11 fixture · 循环/未知/链深 8/9/defaults extends 拒绝面）+ verify 承接 + F-W1-11 下游零感知（类型+运行时双轨）+ JSON schema 同步 | 640/123/639/0/1 |
| 三 | 3ebea10 | hooks 节校验（OQ-1 enum · F-W1-10 含跨层矛盾 · 12 fixture）+ command_sets 替硬编码（F-W1-07 · forbidden 并集机检 · 常量删除 · materialize 消费切换 · e2e 双证）+ JSON schema 同步 | 652/126/651/0/1 |
| 四 | 2a586f9 | 闸判定泛化（evaluateMayStart30 声明式全闸 · formatGateCheck 泛化渲染 · F-W1-05 缺行即拒保留 · F-W1-13 三红线）+ 双回归锁（新 fixture reason 逐字 + A2 口径存量重扫零翻转）+ live 渲染转正 | 667/130/666/0/1 |
| 五 | 本棒 | MIGRATION.md「2.4.2 → 3.0.0（breaking）」草案节（MIGRATION.md:126-164 · pin-14 实证）+ task 收官备料（自检结论/KPI 自评/勾选）+ 本 invoke | 667 复跑同值（docs-only） |

## 锁终态（阶段四末 · 本棒复跑同值）

- `npm test`：**667 tests / 130 suites / 666 pass / 0 fail / 1 skip**（基线 607 纯加性 +60 测 +14 套件 · 零回退）
- `npm run typecheck` 0 错 · `npm run build` 0 错 · `npm run test:lib` 6/6 · `node bin/specgate.js pins check` **17/17**（pin-14 = MIGRATION.md:3 未动 · pin-17 = 13 宿主双语命中）· assets verify 110/110
- **11 件 host 测试 + gate 系（gate-semantics/cli-p0/cli-flags/cli-status-obs）全阶段 git diff 为空**（验收 #10 · F-W1-13 预期兑现 · 无一断言需更新）
- 波末 `gate-check --task <W1 task>` exit 0 · `task lint` PASS · `verify` VERIFY: PASS（泛化后复跑）
- `package.json` exports/files · `bin/` 零改动 · 无新增 `./lib/*` · 未执行 tag/push/publish/deprecate（仅人）

## 三重保险落位（硬约束 4）

① back-compat reader 探测树（无键=v1 原样 · 整数 2=v2 · >2 fail-closed · 非整数报红）；② v1→新模型语义等价映射（内建 command_sets 注入 + hooks none 缺省 · 评审文 §3.2 六行恒等）；③ compat 回归锁 fixture（2.4.2 表逐字拷贝零改动通过 + planned writes 逐字快照）+ MIGRATION 草案人文面。

## 偏差登记汇总（五阶段 20 条 · 均无阻断 · 逐棒已报 00 验收）

**阶段一（3）**：开工 HEAD 前移两笔上游 docs commit（基线数逐字一致 · 纯加性）· 整数 <2 保守并入 fail-closed（SPEC 未定义口径裁定）· 快照以 nextText sha256 钉逐字。
**阶段二（5）**：桩 fixture 转正（改名 schema_version_2_valid.yaml · 父预告授权）· host_id 重复 v2-only 拒（目标歧义 fail-closed 补位）· 链深=跳数口径裁定（含 defaults 末跳 · ≤8）· F-W1-07 归阶段三（v2 根白名单暂拒 command_sets）· hooks 占位归阶段三（v2 surfaces 暂拒 hooks 键）。
**阶段三（6）**：OQ-6 双向断言→单锚（常量删除授权）· 阶段二 fixtures 机械补 command_sets（F-W1-07 连锁 · 语义不变）· forbidden=并集裁定（内建永禁 ∪ 表声明）· hooks merge 级 partial + resolved 完备性收口 · parse/legacy 参数化（行为逻辑零改动 · 75/75 历史波次证）· v1 白名单原样（hooks/command_sets 键照报未知字段）。
**阶段四（4）**：reason 取舍裁定（锚闸恒先 + 声明序首个）· HG-GRAPH-MODULES blocks 格对齐（旧特判不看 blocks · 存量零此行形态 · A2 锁担保零误伤）· 扫描器 additive 小改（blocks_30_generic 列 · A2 授权）· bin 面命中旧 build 教训（实证前须先 build）。
**阶段五（2·本棒）**：① MIGRATION 草案节首稿字面 `spec-wave@3.0.0` 触发 pin-14（regex-all 口径 · F-W1-12 按设计拦截）→ 按 pin note 指引改述「`spec-wave` 3.0.0」（不动 pin 数据口径）→ 17/17 复绿（正例登记）；② 验收 #13 勾选留尾（task close --yes 待 40 复核 + 00 放行后执行 · 其余执行粒度面均已兑现）。

## 禁区执行确认

未改 SPEC/PLAN/reviews/评审文/fixture 基线（baseline_20260916.json）· 扫描器永不裸跑（--out 必填 · 产物比对后删除）· 未碰表文件路径/13 宿主 id/hosts 数组形态/行级 host_id（pin-17 四禁）· 未碰 W2 物化面（hooks/verify 仍零消费 · 对外文案未暗示已生效 · 硬约束 9）· 未执行 git add -A / tag / push / publish / deprecate。

## 下一棒

40 复核（五 commit 全量 diff + 锁计数复跑 + 验收 #1–#13 自证面抽查）→ PASS 后 00 放行 `task close --yes`（#13 勾选 + 状态行由 close 命令处理）· 波末 KPI 由 00 收官裁定（30 自评备料 Task_KPI%: 97）。
