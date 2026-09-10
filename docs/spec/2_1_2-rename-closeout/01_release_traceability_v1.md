# 01 · 发布溯源（2.1.2）

> **状态**：`signed` · 隶属 `2_1_2-rename-closeout`  
> **对应缺陷**：审查 **P0-1**（`v2.1.1` tag → `dsh-coding-kit`；npm `spec-wave@2.1.1` → 改名 commit；HEAD 无 tag）  
> **test_strategy**：`required`（发版门可脚本核对）

---

## 1. 问题陈述

| 对象 | 现状（2.1.1 线） | 目标（2.1.2） |
|------|------------------|---------------|
| git tag `v2.1.1` | commit `cc61324` · 包名 `dsh-coding-kit` | **保留不动**（史实） |
| npm `spec-wave@2.1.1` | 改名后身份 · 与 tag 错位 | **保留不动**（已 published） |
| 新溯源点 | 无 | **`v2.1.2` + `spec-wave@2.1.2` 同 commit** |

不试图「修正历史 2.1.1」；用新 patch 建立可复现绑定。

---

## 2. 冻结流程（对齐 RELEASING）

```text
1. 本系列 W1–W3 合并至待发分支
2. bump package.json / 钉点 → 2.1.2；CHANGELOG 写清「改名收口 + 溯源」
3. 四门：typecheck → test → build → test:lib（本仓 Verify）
4. git tag v2.1.2 <publish-commit>
5. 人：npm publish（HG-PUBLISH）
6. 核对：git show v2.1.2:package.json name=spec-wave · version=2.1.2
         npm view spec-wave version → 2.1.2
```

任一步未完成 → **停止**，不得跳步。

---

## 3. 验收探针（可复制）

```bash
git show v2.1.2:package.json | grep '"name"'
# → "name": "spec-wave"

git show v2.1.2:package.json | grep '"version"'
# → "version": "2.1.2"

npm view spec-wave version
# → 2.1.2

git rev-parse v2.1.2
# 与发布说明中的 publish commit 一致
```

---

## 4. 文档债

- `RELEASING.md`：纠正 2.1.1 改名期「尚未 publish / 准备中」等**状态倒挂**；记录 `v2.1.2` 为 SpecWave 身份首个「tag↔npm 一致」点。  
- CHANGELOG：明示 2.1.1 存在 tag/npm 双身份史实，消费者应以 **2.1.2+** 为钉点。

---

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
