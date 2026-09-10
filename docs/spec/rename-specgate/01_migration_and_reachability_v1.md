# 01 · 迁移与可达性（SpecWave）

> **状态**：`draft` · 隶属 `rename-specgate`

---

## 1. GitHub

| 动作 | 旧地址 | 新地址 | 可达 |
|------|--------|--------|------|
| **Rename（链）** | `…/dsh-coding-kit` · `…/SpecGate` | `github.com/Cyning12/SpecWave` | **是** · 旧名 301（勿再占用旧名） |
| 新空仓 | 旧仓仍在或归档 | 新仓 | **否**自动跳转 · 须 README 指针 |

clone / Issues / Stars：Rename 方案随仓迁移；新空仓需自行搬迁。

---

## 2. npm

| 包 | 动作 |
|----|------|
| **`spec-wave`** | 新人 publish（版本策略见 PLAN B-SEMVER） |
| **`dsh-coding-kit`** | 站稳后 **deprecate**：文案含 `npm i spec-wave@…` / 迁移链 |
| 无 redirect | `npm i dsh-coding-kit` **不会**自动变成新包 |

---

## 3. 消费者最短路径

```text
1. package.json: dsh-coding-kit → spec-wave
2. CI / 脚本: npx dsh-coding-kit → npx spec-wave（过渡期旧 bin 仍可用）
3. 可选: npx spec-wave refresh-ide-blocks --yes（若 W2 已加映射）
```

---

## 4. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
| 2026-09-10 | 包名 → `spec-wave`（E403 相似拒改签） |
