# A3 · 对外口径边界（hooks / verify 可声称程度）v1

> **状态**：定稿 · 3.0 W7 S7.4（task `task_3_0_w7_closeout_external.md` · 验收 #3 · SPEC 08 范围④ · 硬约束 9）
> **真值源（数据）**：[`assets/harness/claims-boundary.yaml`](../../assets/harness/claims-boundary.yaml)（capabilities status + forbidden_wording）
> **机检**：`node scripts/check-claims.mjs`（入 `npm test`：`test/check-claims.test.ts` 正负 fixture）· 扫 `delivery/promotion/**` + 根 README 双语 + `GLOSSARY.md`，forbidden_wording 零命中，违则 exit 2。
> **as_of**：2026-09（W2 交付事实面）。

## 1. 背景

W2 已交付「门禁随包内置 + host-adapt 多宿主物化 + host verify」；2.x 时代 facts card §11 仍写「host-adapt hooks surface **未实现**」、README.zh-CN 曾写「kit P0 不依赖宿主 hooks」——**黑名单过期**。本文件把可声称 / 不可声称边界定稿，并由 `check-claims.mjs` 机械钉死（未落地一律「将新增 / 规划中」）。

## 2. 可声称（shipped）

| 能力 | 可声称口径 | 边界 |
|------|-----------|------|
| P0 门禁 | **门禁随包内置**：`check` / `verify` / `gate-check` / `audit` 进程内 CLI 判定 · 阻断 exit **2**（failClosed）· **不依赖宿主是否执行 hook** | 判定在 CLI 进程内 |
| hooks 物化 | hooks **可物化**到支持机制族的宿主落点：**config-hook 3 宿主** / **shell-hook = git 层宿主中立** / **无机制宿主显式降级 L1+L2** | 「可物化」≠「所有宿主都有 hook 拦截」 |
| host verify | `host verify` 校验宿主落点与适配表声明一致（篡改/删除报红 exit 2） | 校验物化产物，不代宿主执行 |
| 端到端真跑 | P0 门禁在 **≥2 个真实宿主**端到端真跑（claude + cursor · e2e tracked 留证） | 其余宿主为降级/声明面 |

## 3. 不可声称 / 未落地（planned）

| 表述 | 状态 | 正确写法 |
|------|------|---------|
| 「**接入即获得 L3**」 | 未落地（无 hook 宿主降级 L1+L2） | 「将新增 / 规划中」 |
| 「**13 宿主全部有 hook 拦截**」 | 未落地 | 「config-hook 3 宿主 · 其余显式降级」 |
| pre-archive 宿主内真实触发 | 未落地（仅 fixture + host verify 兜底） | 「将新增 / 规划中」 |
| catalog 远程在线分发 | 冻结 | 「规划中」 |
| npm provenance / OIDC | 未启用 | 「规划中」 |

## 4. 机检判据（failClosed）

- `forbidden_wording`（未落地过度声称 · 见 yaml）在扫描面**零命中**：`接入即 L3` · `接入即获得 L3` · `13 宿主全部有 hook` · `13 宿主全 hook` · `门禁靠宿主 hook 强制` · `靠 hook 强制` · `hook 强制注入`。
- `expired_wording`（过期事实自述 · 与 S7.5 K 台账对齐）**零命中**：`四宿主`（2.1.3 旧宿主数 · 现行 13）· `406 用例`（2.1.3 旧测试规模 · 现行以仓根 README 为准）。
- 负向 fixture：注入一条 forbidden（如「门禁靠宿主 hook 强制」）→ 脚本 exit 2 点名；清除后复绿。
- **过期事实自述**（四宿主 / 406 用例 / 2.1.3 等历史快照）由 S7.5 K-1~K-4 台账修订对齐真值面；`dsh-coding-kit` 为合法 deprecated 过渡 bin 名（pin-09 + README 迁移指引），不做裸串判红。

## 5. 关联

- facts card §11（`.workbuddy/output/推广事实卡-2.2.0.md`）为**未入库起草源** ⇒ 黑名单机检**不依赖**未入库件（硬约束 14）；该件按 S7.8 镜像或显式登记后同步（F-W7-09）。
- 术语命门另见 [`GLOSSARY.md`](../../GLOSSARY.md)（canonical 保留词）与 S7.3 `terminology.yaml`。

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-17 | 初版 · 3.0 W7 S7.4（W2 实交事实面 + 可声称/不可声称双列 + 机检黑名单） |
