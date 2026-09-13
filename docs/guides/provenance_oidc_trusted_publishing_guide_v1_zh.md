# 发布 provenance / OIDC trusted publishing 配置指引（**未启用 · 配置仅人**）

> **状态口径（2026-09-12 · 事实卡 §11）**：npm provenance / OIDC **当前未启用**，本仓发布仍为人手工 `npm publish`（不带 provenance）。本文仅为**规划中 / 将新增**能力的**配置指引**；**账号侧一切配置仅维护者（人）可执行，Agent 禁代劳**。本文不构成「已支持供应链签名」的任何表述。

## 1. 背景与现状

- 现行发布流程见仓根 `RELEASING.md`（九步硬步骤 · ⑧ `npm publish` **仅人**）。
- npm provenance 让 npm 包携带「由哪个 CI 环境、哪个 commit 构建」的加密溯源声明，消费者在 npm 页面可见 Provenance 徽章。
- 本指引对应路线 §5 C5；落地与否、何时落地由维护者决定。

## 2. 两条启用路径（择一 · 均仅人配置）

### 路径 A · GitHub Actions + `--provenance`（CI 发布）

前提：

1. 仓库为 **public**（或账号具 npm Pro / private 包付费档）。
2. 发布 workflow job 声明 OIDC 权限：
   ```yaml
   permissions:
     id-token: write   # OIDC（provenance 必需）
     contents: read
   ```
3. `npm publish --provenance`（npm CLI ≥ 9.5 · 在 GitHub Actions 内自动签名）。
4. 包 `repository` 字段须指向本仓（`package.json` 现状已具备，启用前复核）。

### 路径 B · trusted publishing（无 token 发布 · npm 11.5.1+ 推荐方向）

配置步骤（全部在账号后台 · 仅人）：

1. npmjs.com → 包 `spec-wave` → Settings → **Trusted Publisher** → 选 GitHub Actions。
2. 登记：仓库 `Cyning12/SpecWave` · workflow 文件名（如 `release.yml`）· 环境名（可选）。
3. 发布后 workflow 内 **无需 NODE_AUTH_TOKEN**：`npm publish` 自动经 OIDC 交换短期凭证，并自动附带 provenance。
4. GitHub 侧：workflow job 同样须 `id-token: write`。

## 3. 回退路径（现状保持）

- 启用前与启用后任何异常，回退 = 维持现状：维护者本地 `npm publish`（不带 provenance · RELEASING.md 九步不变）。
- provenance 未启用不影响包可用性；仅为溯源增强。

## 4. 配套：GitHub 原生密钥扫描（仓库设置 · 仅人）

本仓 CI 已含 gitleaks 工作树扫描 job（2.3-W3 ④ · `--no-git` 档）。GitHub 原生能力为仓库级补强（仅人开启）：

1. 仓库 Settings → **Code security and analysis**。
2. 开启 **Secret scanning** 与 **Push protection**（推送含密钥即拒）。
3. 与 CI gitleaks 的关系：原生扫描覆盖 git 历史与推送拦截，CI job 覆盖工作树门禁，两者互补不替代。

## 5. 禁称提醒（事实卡 §11）

- 在路径 A/B **实际启用并经维护者核验**之前：对外文案**禁止**声称「已支持 provenance / 供应链签名 / OIDC 发布」；允许口径仅为「**规划中 / 将新增**」。
- 启用落地后须同步更新事实卡禁称清单与本节状态口径。
