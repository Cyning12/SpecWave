# 规划 · 产品改名 · SpecWave（去 DSH 强绑定叙事）

> **状态**：`signed`（**HG-RENAME** · **HG-SPEC-SIGNOFF** = **approved** · 2026-09-10）  
> **基线**：`dsh-coding-kit@2.1.1` **published**  
> **目标**：npm **`spec-wave@2.1.1`** · GitHub **`Cyning12/SpecWave`**（Rename）  
> **系列 SPEC**：[`docs/spec/rename-specgate/`](../spec/rename-specgate/)（`signed`）  
> **Open Folder**：本机目录可仍名 `dsh-coding-kit/`；remote → SpecWave  
> **禁**：Agent `npm publish` / `npm deprecate`（仅人 · `HG-PUBLISH` / `HG-DEPRECATE`）

---

## 一句话

把对外身份从「DSH 插件包」改为 **SpecWave**：CLI + 多宿主 IDE 落点为主、DSH plugin 为可选入口；**旧 GitHub / 旧 npm 可过渡可达**。

---

## 命名冻结（已签收）

| 层 | 取值 | 依据 |
|----|------|------|
| **产品名 / 文案** | **SpecWave** | 维护者改签（对齐 npm `spec-wave`；曾用 SpecGate） |
| **npm `name`** | **`spec-wave`** | 禁止大写；禁用 `spec-gate`（已占用）；裸 `specgate` E403 相似拒 |
| **semver** | **`spec-wave@2.1.1`** | **B-SEMVER=A**（与现行能力线对齐） |
| **bin** | `spec-wave` + `specgate` + 过渡 `dsh-coding-kit` | B-BIN-DUAL（三入口） |
| **GitHub** | **`Cyning12/SpecWave`** | **B-REPO=Rename** · `dsh-coding-kit` / `SpecGate` 旧 URL 301 |
| **本地目录** | 可选不改 | 非 git 硬约束 |

---

## 动机

- 2.0–2.1.1 后主面已是 **多宿主 + P0 CLI**，不再是「强绑 DSH 的插件」。  
- 名 `dsh-coding-kit` 误导发现与介绍页首屏。  
- 需可回退迁移：旧 URL / 旧包名不能瞬间蒸发。

---

## 采纳冻结（维护者已选 · 2026-09-10）

| ID | 决议 | 说明 |
|----|------|------|
| **B-NPM** | **采纳 `spec-wave`** | E403 相似拒后改签（原拟裸 `specgate`） |
| **B-BIN-DUAL** | **采纳** | 三 bin：`spec-wave` + `specgate` + `dsh-coding-kit` |
| **B-REPO** | **采纳 = Rename** | → **`SpecWave`**（经 `SpecGate`）；`dsh-coding-kit` / `SpecGate` URL 301 |
| **B-DEPRECATE** | **采纳** | 新包站稳后 deprecate 旧包（仅人） |
| **B-REFRESH** | **采纳** | refresh：旧 `npx dsh-coding-kit` / `npx specgate` → `npx spec-wave` |
| **B-SEMVER** | **采纳 = A** | **`spec-wave@2.1.1`** |
| **B-DSH** | **保留可选** | plugin 降为可选 Host |
| **B-SCOPE** | **拒绝** | 不改帽语义 / OpenSpec 主流程 |

---

## Waves

| Wave | 覆盖 | 人闸 | 状态 |
|------|------|------|------|
| **W0** | 签收 · 冻 B-* · 拆 task | HG-RENAME · HG-SPEC-SIGNOFF | **DONE** |
| **W1** | name/bin 双轨 · help/测钉 · 保持 version **2.1.1** | HG-AUDIT-R1 | **DONE** |
| **W2** | 文档/assets/prompts/refresh 映射 | HG-AUDIT-R1 | **DONE** |
| **W3** | GitHub Rename · remote/CI 核对 · URL scrub | 人已授权 Rename | **DONE**（现名 **`SpecWave`**） |
| **W4** | `spec-wave` publish · 旧包 deprecate | HG-PUBLISH · HG-DEPRECATE | **DONE**（人已 publish + deprecate） |

---

## 明确非范围

- OpenSpec/spec-kit 主流程 · 默认 30/40 · Agent publish/deprecate · 占用 `spec-gate`

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-RENAME** | **approved** | 开实现 · 2026-09-10 |
| **HG-SPEC-SIGNOFF** | **approved** | `spec-wave@2.1.1` · Rename · 2026-09-10 |
| **HG-AUDIT-R1** | pending（W2+）/ W1 **approved** | 各 30 |
| **HG-PUBLISH** | **approved** | `spec-wave@2.1.1` 首发（人 · 2026-09-10） |
| **HG-DEPRECATE** | **approved** | 旧包 deprecate（人 · 2026-09-10） |

---

## 验收一句话

```bash
npm view spec-wave version          # → 2.1.1
npx spec-wave --version
# https://github.com/Cyning12/dsh-coding-kit  → 301 → …/SpecWave
# https://github.com/Cyning12/SpecGate         → 301 → …/SpecWave
```

---

## 读序

1. 本文件  
2. [`../spec/rename-specgate/README.md`](../spec/rename-specgate/README.md)  
3. Tasks：`docs/tasks/active/task_rename_specgate_w*.md` / `done/` W0

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 立项 |
| 2026-09-10 | **签收**：SEMVER=A · REPO=Rename · 开 W1/W3 |
| 2026-09-10 | **E403 相似拒** → B-NPM / 目标 / B-REFRESH 改签 **`spec-wave`**（产品文案仍 SpecGate） |
| 2026-09-10 | **产品/仓** 改签 **SpecWave**；GitHub `SpecGate`→`SpecWave`（旧名 301）；W4 人发版 DONE |
