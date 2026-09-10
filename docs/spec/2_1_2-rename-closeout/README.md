# 2.1.2 · SpecWave 改名收口 · SPEC 系列

> **状态**：`signed` · **IMPLEMENTED** · **`2.1.2` published** · **CLOSED**（2026-09-10）  
> **spec_slug**：`2_1_2-rename-closeout`  
> **目标包**：`spec-wave@2.1.2`  
> **上游证据**：[`.workbuddy/output/审查报告-SpecWave-2.1.1-改名验收.md`](../../../.workbuddy/output/审查报告-SpecWave-2.1.1-改名验收.md)（2026-09-10）  
> **基线**：`spec-wave@2.1.1` **published** · 改名未达发版级完整（tag/npm 身份错位 · 链式废弃 · 对外残留）  
> **姊妹系列**：[`rename-specgate/`](../rename-specgate/)（2.1.1 改名主轨 · 功能已通 · 残留收口进本系列）  
> **上游规划**：[`PLAN_2_1_2_rename_closeout_v1_zh.md`](../../roadmap/PLAN_2_1_2_rename_closeout_v1_zh.md)  
> **Open Folder**：本仓根（目录可仍名 `dsh-coding-kit/`）

---

## 一句话

在 **不破坏既有 `v2.1.1` tag** 的前提下，发 **`spec-wave@2.1.2`**：修发布溯源、切断链式废弃迁移、统一对外自报名与随包文案，并加固 `init --yes` 非交互判定。

---

## 读序

1. 审查报告（证据）→ 规划 PLAN_2_1_2  
2. [`00_policy_and_boundaries.md`](./00_policy_and_boundaries.md)  
3. [`01_release_traceability_v1.md`](./01_release_traceability_v1.md)  
4. [`02_migration_chain_v1.md`](./02_migration_chain_v1.md)  
5. [`03_surface_consistency_v1.md`](./03_surface_consistency_v1.md)  
6. [`04_init_noninteractive_v1.md`](./04_init_noninteractive_v1.md)  
7. [`05_waves_and_acceptance_v1.md`](./05_waves_and_acceptance_v1.md)（含思考轮）  

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-NEXT-212** | **approved** | 开实现 · 2026-09-10 人授权 · 00 代签落表 |
| **HG-SPEC-SIGNOFF** | **approved** | 定稿 · B-* 冻结 · 2026-09-10 人授权 · 00 代签落表 |
| **HG-AUDIT-R1** | W1–W4 **approved**（00 代签） | 各波 30 前 |
| **HG-PUBLISH** | **approved** | `spec-wave@2.1.2` · 人 · 2026-09-10 · 00 核验 |
| **HG-DEPRECATE-HARNESS** | **approved** | `@cyning/harness` 文案改指 `spec-wave` · 人 · 2026-09-10 · 00 核验 |

### 过程闸授权（人 · 2026-09-10）

用户明示：**授权 00 签收后续过程文档**。本系列内 00 可代签：

- `HG-TASK-DRAFT` · 各波 `HG-AUDIT-R1` · `docs/harness/reviews/*_audit_R1_*.md`  
- task CLOSE / 归档 `done/` · invoke 过程笔记  

**不可代签**：`HG-PUBLISH` · `HG-DEPRECATE-HARNESS` · `npm publish` / `npm deprecate` / force-push tag。

---

## 采纳冻结（**已签**）

| ID | 决议 | 说明 |
|----|------|------|
| **B-SEMVER-212** | **采纳 = bump `2.1.2`** | 审查方案 B；**拒绝** `git tag -f v2.1.1` |
| **B-TAG-AT-PUBLISH** | **采纳** | publish 前 commit **必须**打 `v2.1.2`；tag 指向与 npm tarball 同 commit |
| **B-DEPRECATE-CHAIN** | **采纳** | MIGRATION/README 切断「装废弃中间包」；`@cyning/harness` deprecate 文案改指 `spec-wave` |
| **B-CLI-IDENTITY** | **采纳** | help 首行 = **`SpecWave CLI (v…)`**；doctor/status 当前包 = `spec-wave`；**同步改测试断言** |
| **B-ASSETS-COPY** | **采纳** | 随包 assets + 仓根 README/AGENTS/RELEASING 对外旧名清到可验收清单 |
| **B-INIT-YES** | **采纳** | `--yes` 存在 → 视为非交互；无 `--tools` → exit 1（不挂起） |
| **B-REPORT-SCHEMA** | **拒绝（本版）** | 保留 `dsh-coding-kit/refresh-ide-blocks-report@1`；2.2+ 另闸 |
| **B-BIN-FILE** | **拒绝（本版）** | 不改 `bin/specgate.js` 文件名 |
| **B-DELIVERY** | **拒绝（本版）** | `delivery/` 内部命名不进本版 |

---

## 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据=改名验收审查；主题=发版级改名收口 + patch bump，非新功能轨 | no |
| R1 | 范围=P0 全做 + P1 对外面 + P2-1 init；非范围=强推 tag / REPORT_SCHEMA / bin 改名 / delivery | no |
| R2 | 推荐 **bump 2.1.2 + 新 tag**；弃选 force-retag `v2.1.1`（破坏协作者）与「只改文档不发版」（溯源仍裂） | no |
| R3 | failure_paths：链式 deprecate、CLI/测钉死旧名、PTY+`--yes` 挂起、publish 无 tag | no |
| R4 | `test_strategy=required`（CLI 身份断言 · init `--yes`）；发版门四门 + `npm view`/`git tag --points-at` | no |
| R5 | **SIGNED** · 交 00 拆 W1–W4 · 派 30 | no |

**residual_risks**：npm 上已存在「同号 2.1.1 双身份」史实无法抹除，只能用 2.1.2 建立新溯源点；`@cyning/harness` deprecate 须人操作，Agent 禁代 deprecate；assets 旧名扫描可能有漏网 → W2 以审查 B5–B13 清单为必清、另加一次 ripgrep 抽检。

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft 立档 · 源自 2.1.1 改名验收审查 |
| 2026-09-10 | **signed** · HG-NEXT-212 / SPEC · 人授权 00 代签过程文档 |
| 2026-09-10 | **CLOSED** · HG-PUBLISH / HG-DEPRECATE-HARNESS approved · npm `2.1.2` |
