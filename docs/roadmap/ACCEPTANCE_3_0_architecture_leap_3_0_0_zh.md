# ACCEPTANCE · SpecWave 3.0.0 · 架构跃迁（architecture leap）

> **状态**：**待发版**（**PENDING PUBLISH** · 2026-09-17 bump · tag `v3.0.0` **待人打** · `npm publish` **仅人** · `HG-RELEASE=pending`）
> **SPEC**：[3_0-architecture-leap SPEC 系列](../spec/3_0-architecture-leap/) · 规划 [`PLAN_3_0_architecture_leap_v1_zh.md`](PLAN_3_0_architecture_leap_v1_zh.md)
> **task**：[`docs/tasks/done/task_3_0_w7_closeout_external.md`](../tasks/done/task_3_0_w7_closeout_external.md)（W7 收尾与对外 · **CLOSED** · 双闸 approved · 40 复核 PASS-with-issues）
> **探针**：[`docs/harness/reviews/w7_release_probe_3_0_0_20260917.md`](../harness/reviews/w7_release_probe_3_0_0_20260917.md)（6 项）
> **发布边界（诚实红线）**：**tag / push / publish / deprecate 四动作全仅人** —— 本档与探针**不代打 tag、不 publish**；`pin-10`（git tag `v3.0.0`）**打 tag 前为设计红**，打 tag 后须 17/17。

## 一、八波汇总（W0–W7）

| 波 | 主题 | 关键交付 |
|----|------|---------|
| W0 | 重构预备 | god-file 拆分 barrel 化 + 六重锁 + 独立验收文（不迁 2.5.0）· spawn 首轮下沉 |
| W1 | 适配表 schema 跃迁 + 闸判定泛化（核心） | schema v2（`defaults`/`extends`/`command_sets`/`surfaces.hooks`）+ v1 兼容桥 + blocks-30 全闸泛化 |
| W2 | 门禁入宿主 + B5 接入面 | hooks 物化（config-hook 3 / shell-hook 中立 / 无机制降级 L1+L2）+ `host verify` + `hook-guard` + catalog |
| W3 | 本体图谱统一 | 本体/图谱接线 + OWL 评估（否决 · 3.x 复议）+ 研究文/探针入库 |
| W4 | 防伪判据语义化 | 结论级闸 + 自评类豁免 + 表行语义判 |
| W5 | 机械清扫 | 快照标注 / 口径对齐 / 文件类型卫生 |
| W6 | 可观测与审计 | 审计事件轨 + G2/G4/G7 闸 + discipline check 收窄（逃逸率 100%→0%） |
| W7 | 收尾与对外 | F3 wiki（双向/增量/冲突）· E3 spawn 671→270 · 术语/A3/链接三机检 · K 台账区间化 · MIGRATION 定稿 + 2.4.1 演练 · 证据入库清偿 · 3.0.0 bump |

## 二、锁数字（W7 四阶段实测 · 纯加性）

| 阶段 | commit | tests | pass | fail | skip | spawn | 三 checker |
|------|--------|-------|------|------|------|-------|-----------|
| 基线（W6 终态） | — | 841 | 840 | 0 | 1 | **671** | — |
| 阶段一（F3+E3） | `da1a4e4`+`7e9ee37` | 845 | 844 | 0 | 1 | **270** | — |
| 阶段二（术语+A3+K） | `2243489`+`5473319`+`33ae2b4` | 855 | 854 | 0 | 1 | 270 | terms/claims PASS |
| 阶段三（迁移+链接+证据） | `0d06c1f`+`d2d1c1e`+`7c5f2c9` | 859 | 858 | 0 | 1 | 270 | links PASS（非 S2 (i)/(ii)=0） |
| 阶段四（bump） | 见 RELEASING / 本档 | 859 | 856 | **2（tag-gated 设计红）** | 1 | 270 | 三 checker PASS |

- **spawn 重定基**：671 → **270**（`scripts/e3-spawn-count.mjs` · 达标 ≤300）。
- **术语**：判红面 `门控` 残留 **0**（`terminology.yaml` + `check-terminology`）。
- **A3**：`claims-boundary.yaml` + `check-claims`（forbidden/expired 零命中）。
- **链接**：非 S2 (i)=**0** · (ii)=**0** · S2 冻结基线 **34**（`check-doc-links`）。
  - **口径补注（2026-09-17 CI hotfix）**：旧值 **23** 系「文件系统存在性」判据下的本机假绿口径（本机 `.workbuddy/` 实体在 ⇒ 少计 11 · CI 干净 clone 34 真红）；判据改**入库状态**（tracked 文件 ∪ tracked 目录前缀 · `ls-files -z` 原样读取）后本地/干净 clone 双跑同值 **34**（S2 (i) 集合逐条 IDENTICAL）· 环境无关。
- **pins**：打 tag 前 **16/17**（pin-10 设计红）· assets **113/113** · typecheck/build/test:lib **6/6** · 依赖零新增。

## 三、验收 #1–#14（task_3_0_w7_closeout_external）

| # | 项 | 结果 |
|---|----|------|
| 1 | 术语一致性机检 | ✅ 判红面残留 0（canonical 正名） |
| 2 | MIGRATION 真实 2.4.1 仓演练 | ✅ 旧格式零改动 + 新能力可选启用均 PASS · 无兼容洞 |
| 3 | 对外文案黑名单机检 | ✅ `check-claims` 零命中 |
| 4 | 相对链接两级机检 | ✅ 非 S2 (i)/(ii)=0 · S2 冻结基线 34（旧 23 系 FS 存在性假绿口径） |
| 5 | K-1~K-4 竞品口径台账 | ✅ 区间 + as_of · 单值旧数零命中 |
| 6 | 证据入库清偿 | ✅ 4 镜像 + 7 登记 · 非 S2 直链 0 |
| 7 | E3 spawn 重定基 | ✅ 671→270（≤300） |
| 8 | 2.4.2 口径补正搭车 | ✅ 零残留确认 · 提交说明含义务 |
| 9 | 3.0.0 发版探针含 compat 项 | ✅ 6 项（见探针记录） |
| 10 | 平台锁 | ✅ 四门 + pins 16/17 + assets 113/113 + 依赖零新增 |
| 11 | F3 wiki fixture | ✅ 双向/增量等价/冲突 red-green |
| 12 | 既有面零意外改动 | ✅ 登记项逐条（见 task 自检） |
| 13 | 结构闸 | ✅ task lint PASS |
| 14 | 执行粒度与发布边界 | ✅ 逐文件显式 add · 未 tag/push/publish |

## 四、已知残余 / 待人项（诚实登记）

1. **tag `v3.0.0` 待人打**（HG-RELEASE 仅人）：打 tag 后 `pin-10` 转绿 → `pins 17/17` · `release-tag-identity` 转绿。
2. **`npm publish` 仅人**（`HG-RELEASE=pending`）：publish 后回填本档 / RELEASING / README / spec 索引为已 published（checklist ⑨）。
3. **SPEC 范围②「<50」spawn**：按 00 重定基裁定不可达 · 实现 671→270（≤300 规范下限）· 余量归 3.x/后续波次。
4. **链接 S2 域冻结基线 34**：S2 永不覆写（硬约束 1）· 历史 stale 链接不可修 · 非 S2 硬判 0（旧 23 系 FS 存在性假绿口径 · 34 为入库状态重建值）。
5. **`docs/feedback` 历史断链**：目标 `02_agent_host_plan_v0.md` 不存在 ⇒ 就地登记「历史本地件 · 未入库 · 不在仓」。
6. **版面上 2.x 旧 manifest 的跨产品线迁移文案**：3.0.0 起 2.x 版本数值低于包版本 ⇒ `check` 走「可升级」（原「跨产品线迁移」分支仅当 manifest 版本数值更高时触发）；语义更准确 · 测试 fixture 已按 bump 调整（见 task 自检偏差）。
7. **`.workbuddy/` 未入库证据**：4 件镜像入 `docs/harness/reviews/` · 其余 7 件登记「仅本地草稿」；本机保留未删。

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-17 | 初版 · 3.0 W7 S7.10（八波汇总 + 四阶段锁 + 验收 14 条 + 待人项 · 待 tag/publish 仅人） |
