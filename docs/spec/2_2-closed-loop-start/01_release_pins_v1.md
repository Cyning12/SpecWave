# 01 · W1 · A1 · 版本/身份钉自动化（release pins）

> **状态**：`signed`（HG-SPEC-SIGNOFF / HG-NEXT-PLAN=approved · 人 2026-09-11 会话预授权 · 00 代签落表）· 隶属 `2_2-closed-loop-start` · **本次核心波**  
> **test_strategy**：`required`（含破坏性自证与 S2 拒写反向验证）  
> **上游**：PROMPT §4 详细规格 + 路线研究 §4 主线一 A1（价值 9 · 代价 1 · 性价比 9.0）

---

## 1. 目标

把「版本/身份钉」从**人工纪律**变成**机械可验证**：声明一次（数据），机器校验（check），偏差一键修复（fix），发版与 CI 门禁强制（接线）。

## 2. 根因（不是现象）

该偏差已**同版本反复发生 3 次以上**：`RELEASING.md` 在 2.1.1 / 2.1.2 / 2.1.3 各滞后一次；`docs/spec/README.md` 至今未补 2.1.3（前提校核 #6 实测确认：索引末行为 `2_1_2-rename-closeout`，`docs/spec/` 下无 `2_1_3-*` 夹）。

根因**不是「人忘了改」**，而是**「没有机制强制」**——诚实完全靠人写注释维持。本波即路线第一主线「声明 → 接线 → 可验证」的第一步。

## 3. 范围

- 新建单一声明源 `assets/release-pins.yaml`（钉面落为**数据**）。
- **将新增** `spec-wave pins check [--json]`（当前不存在，本波落地）。
- **将新增** `spec-wave pins fix [--yes]`（当前不存在，本波落地）。
- 接入 `prepublishOnly` 与 `.github/workflows/ci.yml`；给 CI test job 补 `timeout-minutes`。
- 补最后一处漂移：`docs/spec/README.md` 的 2.1.3 行（形态见 §7 待决 D-SPEC-213-ROW）。
- 新增测试 `test/pins-consistency.test.ts`（失配时**真失败**）。

## 4. 非范围

| 项 | 理由 |
|----|------|
| 把落点硬编码进 TypeScript | 下次加落点又要改代码 = 没解决根因（PROMPT §4.a 明令） |
| 资产 sha256 完整性清单 / `assets verify` | A2 · 属 2.3 |
| `ontology-check` 独立 CLI | A4 · 属 3.0；本波只读 `product_semver` 字段值，不接 ontology 机检 |
| `delivery/promotion/*` 与 `package.json` 的 D0 未提交改动 | D0-PROT（00 §3） |
| 改 `bin` 文件名 / 包名 | 沿袭 2.1.2 B-BIN-FILE=拒绝 |

## 5. 钉面清单（10 行 · 前提校核 2026-09-11 全部实测复核有效）

| # | 落点 | 字段 / 形态 | 当前实测值 | 必需 | fix 可写 |
|---|------|------------|-----------|------|---------|
| 1 | `package.json` | `version`（**唯一真值源**，其余钉面向它对齐） | `2.1.3`（:3） | 是 | 否（真值源，不反向改） |
| 2 | `package.json` | `name` | `spec-wave`（:2） | 是 | 否 |
| 3 | `assets/ontology.yaml` | `product_semver` | `2.1.3`（:7） | 是 | 是 |
| 4 | `assets/harness/discipline-coverage.yaml` | `as_of_package_version` | `2.1.3`（:14） | 是 | 是 |
| 5 | `README.md` | `spec-wave@X.Y.Z` 出现处（11 处实测） | `2.1.3` | 是 | 是 |
| 6 | `README.zh-CN.md` | 同上（11 处实测） | `2.1.3` | 是 | 是 |
| 7 | `RELEASING.md` | 「现行包 / registry latest」行（:13） | `2.1.3` | 是 | 是 |
| 8 | `docs/spec/README.md` | 当前 minor 的 SPEC 索引行 | **缺 `2_1_3` 行（实测确认）** | 是 | 半（仅可按模板补行，见 D-SPEC-213-ROW） |
| 9 | `package.json` | `bin` 三入口 | `spec-wave` / `specgate` / `dsh-coding-kit`（:19-23） | 是 | 否 |
| 10 | git | tag `vX.Y.Z` | `v2.1.3`（实测存在） | 是 | 否（git 操作仅人） |

> 说明：#1 是真值源，`check` 以它推导期望；#2/#9/#10 只校验不修复；#8 的提取语义（「索引表存在当前 minor 对应行或标注行」）作为数据写入声明源（D-PINS-SCOPE-8）。

## 6. 设计

### 6.1 单一声明源 `assets/release-pins.yaml`（将新增）

每个落点声明为数据，字段至少含：

| 字段 | 含义 |
|------|------|
| `id` | 钉面编号（pin-01 … pin-10） |
| `path` | 落点路径（仓内相对） |
| `extract` | 提取方式（json-pointer / yaml 字段 / 正则 / git 命令），**表达式本身也是数据** |
| `expected` | 期望关系（`=package.json#version` / 常量 / 存在性断言） |
| `required` | 是否必需（必需缺失即偏差） |
| `fixable` | `pins fix` 是否可写该落点（含 S2 判定结果） |

### 6.2 `spec-wave pins check [--json]`（将新增）

- 干净树（全部钉面一致）→ **exit 0**；任一偏差 → **非 0 退出**。
- exit 码口径：**推荐 exit 2**（与 P0 门禁 `failClosed` 一致；事实卡 §5：exit 2 = 门禁阻断档）。`check` 恒 exit 0 的既有约定只适用信息性 `check` 命令，`pins check` 是发版门禁。→ 待决 **D-PINS-EXIT**（备选 exit 1）。
- `--json` 输出每处落点 `path` / `expected` / `actual` / `status`。
- 偏差输出必须**指出文件与行**（破坏性自证的可观测前提）。

### 6.3 `spec-wave pins fix [--yes]`（将新增）

- **默认 dry-run**（打印将改动的文件与 diff 摘要）；仅 `--yes` 才写盘。
- **S2 目录（`docs/tasks` / `docs/harness/reviews` / `docs/harness/invokes/by-task`）永不可写**：命中即机械拒写（非 warn、无豁免参数）。
- **写前备份**（原文件 `.bak` 或等价机制，随实现 task 定细节，但备份行为本身属验收点）。
- 只修 `fixable` 落点；真值源（#1）与 git（#10）永不反向改。
- 幂等：重复执行第二次应无 diff。

### 6.4 门禁接线

- `prepublishOnly` 现有链 `typecheck && test && build && test:lib` 之后追加 `pins check`。
- `.github/workflows/ci.yml` test job 增 `pins check` 步骤 + 补 `timeout-minutes`（当前缺失，卡死会空跑 6h；前提校核 #11 实测确认）。
- 不新增任何 `--force` / `--allow-*` 绕过参数（P0-GATE 硬纪律）。

### 6.5 补最后一处漂移（`docs/spec/README.md` 2.1.3 行）

- **推荐形态（D-SPEC-213-ROW）**：索引表补一行 patch 收尾行，标注「2.1.3 · 溯源自动化 · patch · 属 `2_1_2-rename-closeout` 系列残留修复（git 8797b76 + 82fe0dc）· 无独立 SPEC 夹」。
- **依据**：仓内先例——`doc-health` 行即为无独立版本夹的索引行；2.1.3 全部内容确为 2.1.2 系列残留（git log 实证）；为它新建 `2_1_3-*` 夹成本高于价值。
- 备选：建 `2_1_3-traceability` 夹（**不推荐**）。

## 7. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 声明源 = `assets/release-pins.yaml` 数据驱动 | **采纳** | 加落点不改代码 · 根因解法 |
| 声明源 = TS 硬编码 | 弃选 | PROMPT §4.a 明令禁止 |
| check 偏差 exit 2 | **推荐（D-PINS-EXIT）** | failClosed 一致 |
| check 偏差 exit 1 | 备选 | 较宽松 · 与「非阻断失败」档语义不符（偏差在发版语境即阻断） |
| fix 对 S2 硬拒写 | **采纳** | S2 硬纪律 · 无豁免 |
| fix 对 S2 warn-only | 弃选 | warn 会被忽略 = 假保护 |
| 只做 check 不做 fix | 弃选 | 路线研究 §7：校验会持续报红 |

## 8. 验收标准（必须自证，不接受「我改完了」）

1. `npx spec-wave pins check` 在干净树上 **exit 0**。
2. **破坏性自证**：故意把 `assets/ontology.yaml#product_semver` 改成 `9.9.9` →
   - `pins check` 必须**报错并指出该文件与行**；
   - `pins fix --yes` 必须**改回 `2.1.3`**；
   - 交付报告须贴这两步的**实际命令与完整输出**。
3. 新增测试 `test/pins-consistency.test.ts` 在钉面失配时**真的失败**——同样用上面的破坏法自证一次。
4. `npm run typecheck` 0 错误；`npm test` 全通过（含新增测试）。
5. **反向验证**：`pins fix` 不得把 S2 目录纳入可写范围——用一次实际尝试或测试证明它**拒写**。

## 9. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-A1-01 | `release-pins.yaml` 缺失 / 语法坏 | `pins check` 非 0 退出 · 报错指文件（failClosed） |
| F-A1-02 | 钉面落点文件缺失且 `required=true` | 判偏差 · 非 0 · `--json` `status=missing` |
| F-A1-03 | `fix` 无 `--yes` | dry-run · 零写盘 |
| F-A1-04 | `fix` 目标落 S2 | **机械拒写** · 报错 · 不产生备份残留 |
| F-A1-05 | git tag 缺失（钉面 #10） | check 报偏差 · fix 不动 git · 提示仅人操作 |
| F-A1-06 | 正则脆性致 README 提取失败 | 报 `extract_error` · failClosed · 不静默跳过 |
| F-A1-07 | CI 无 timeout 卡死 | 本波补 `timeout-minutes` 消解 |

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~定稿 · 冻结 D-PINS-EXIT / D-SPEC-213-ROW / D-PINS-SCOPE-8~~（已冻结 · 采纳推荐） |
| **HG-NEXT-PLAN** | **approved**（人 · 2026-09-11 会话预授权 · 00 代签落表 · 审查文 R1 pass） | ~~开 W1 实现~~ · 授权落表后可拆 task 开工 |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | draft · 10-spec · 钉面 10 行全部实测复核 |
| 2026-09-11 | signed · 双闸 approved（00 代签 · 审查文 R1 pass）· D-* 冻结采纳推荐 |
