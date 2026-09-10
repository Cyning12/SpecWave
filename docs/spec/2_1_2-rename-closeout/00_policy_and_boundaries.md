# 00 · 政策与边界（2.1.2）

> **状态**：`signed` · 隶属 `2_1_2-rename-closeout`  
> **test_strategy**：`not_applicable`（政策；实现波 `required`）

---

## 1. 目标

1. **发布可溯源**：`git tag v2.1.2` 与 `npm pack`/`npm view spec-wave@2.1.2` 指向**同一** SpecWave 身份 commit。  
2. **迁移可直达**：老用户从任意历史包名，文档与 deprecate 文案均指向 **`npm i spec-wave@2.1.2`**，不经已废弃中间包。  
3. **对外身份一致**：CLI 首行、doctor/status、README/MIGRATION/RELEASING、随包 assets 与现名 **SpecWave / `spec-wave`** 一致。  
4. **非交互不挂起**：`init --yes` 无 `--tools` 时快速失败，不在 PTY 上阻塞读 stdin。

---

## 2. 非范围

| 项 | 理由 |
|----|------|
| 强推 / 重订 `v2.1.1` tag | 破坏已 clone 协作者；审查方案 A **拒绝** |
| 改 Harness 帽语义 / 闸算法 | 与改名无关 |
| OpenSpec / spec-kit 主流程 | 既有边界 |
| 改 `REPORT_SCHEMA` id | 契约消费方风险 · **B-REPORT-SCHEMA=拒绝** |
| 重命名 `bin/specgate.js` | 回归面中等 · 择期 |
| `delivery/` 通篇改名 | 不进 npm tarball · 不挡发版 |
| Agent `npm publish` / `npm deprecate` | **仅人** |
| 新功能轨（workspaces / ontology-check 等） | 属 2.2+ |

---

## 3. 硬纪律

| ID | 条文 |
|----|------|
| SEMVER | 本版 **patch bump → 2.1.2**；仓内钉点（ontology / discipline / README 正则等）与 `package.json` 同号 |
| TAG | publish 前 **必须** `v2.1.2` 指向待发 commit；禁止「先 publish 后补 tag」跳步（对齐 `RELEASING.md`） |
| HUMAN | Agent **禁止** publish / deprecate / force-push tag |
| DUAL-BIN | 过渡期仍保留三 bin：`spec-wave` + `specgate` + `dsh-coding-kit` |
| A-CLASS | CHANGELOG 史实、`cyning-harness` 标记协议、cordis 过渡名等 **有意保留**，不扫成缺陷 |
| S2 / LOCAL | 写盘仍遵守 S2 · local 块不覆写 |
| TEST-LOCK | 改 CLI 自报名须 **同步** 改断言；禁止「半改名仍全绿」 |

---

## 4. failure_paths（摘要）

| 触发 | 行为 |
|------|------|
| 拟 force-retag `v2.1.1` | 拒开工 · 指向 B-SEMVER-212 |
| `init --yes` 无 `--tools`（含 PTY） | **exit 1** · 提示传 `--tools` · **不**阻塞 stdin |
| MIGRATION/deprecate 仍指向 `dsh-coding-kit` 为终点 | 验收 **FAIL** · 阻断 HG-PUBLISH 宣告 |
| tag `v2.1.2` 缺失或指向非 SpecWave `package.json` name | 验收 **FAIL** · 不得 publish |
| 测试仍钉死旧自报名导致半改 | `npm test` 红 · 须联改断言 |

---

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
