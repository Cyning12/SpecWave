# 00 · 政策与边界（1.x MVP 系列）

> **状态**：`signed` · 隶属 `1x-mvp`（系列已整包签收）  
> **受众**：00/10 规划 · 20-spec-audit · 30 执行前必读  
> **Open Folder**：`dsh-coding-kit/`  
> **已授权**：00 按 wave 起草 task  
> **仍不直接授权**：30 改码（须 `HG-AUDIT-R1`）/ npm publish / npm deprecate

---

## 1. 本系列定位

| 是 | 不是 |
|----|------|
| 1.x MVP（F1–F5）的 **需求契约真值** | 已发布 npm 行为说明书（发版后以 CHANGELOG 为准） |
| 对 `delivery/` 架构结论的 **可签收拆分** | 重开宿主策略 / MVP 边界辩论 |
| 下游 00 拆 task、30 改码的输入 | F6 / 2.0 宿主适配表设计 |

---

## 2. 与既有资产边界

| 资产 | 本系列关系 | 禁止 |
|------|------------|------|
| 仓根 `SPEC.md` | 历史 epic（钉 1.2.0）；F5 治理其与包版本关系 | 不把本系列正文塞进 npm `files` |
| `docs/spec/doc-health/` | 布局公约正例；CLOSE 契约独立 | 不合并 CLOSE 闸进本系列 |
| `docs/spec/self-tech-graph/` | 图谱轨独立 | 不重开 graph Inform SPEC |
| `delivery/*` | **上游冻结事实** | 不在本夹改写架构主文档（冲突只记裁决） |
| `assets/` / ICVO / hat | 复用底座；本系列不改方法论内核语义 | 不借机重做 hat 00–40 |

---

## 3. 演进纪律（强制）

1. **MVP ⊂ 完整版**：1.x 只做内部一致性；2.0 宿主适配表必须建立在唯一真值源之上。  
2. **先 F1 后跨宿主**：禁止为赶工给单一宿主写死适配再反推适配表。  
3. **永不覆写 S2**：本系列只统一真值源与判定一致性，**不改变**「永不覆写」语义本身。  
4. **零云**：不引入云依赖 / marketplace / SaaS。  
5. **双入口不合并**：插件面与 CLI 面职责不变；本系列不发明第三入口。

---

## 4. 非目标（整包强制）

1. F6 宿主适配表 / Ruler 式 `apply` 多宿主编译。  
2. 自研 IDE、商业化计费、第二分发通道。  
3. 删除消费者仓库中既有 `.cyning-harness` 内容（F4 只读降级，不删）。  
4. Agent 执行 `npm publish` / `npm deprecate` / 填写 EOS 日。  
5. 把 UserStory 中已过时的「kit 本体目录 = `.cyning-harness`」表述当作 F4 真值（以系统设计方案 B 为准）。

---

## 5. 授权阶梯

```text
本系列 signed（HG-SPEC-SIGNOFF=approved · 2026-09-09 · 整包）
  → 00 按 wave 起草 kit task
    → 20-task-audit + HG-AUDIT-R1
      → 30 改码（仅授权路径内文件）
        → Agent 默认可 bump/tag（RELEASING ⑤）；人签 HG-PUBLISH 后仅人 npm publish
        → HG-EOS-DATE 后人签 deprecate（仍仅人）
```

**打开本文件 ≠ 已授权改 `src/`**（仍须 task + `HG-AUDIT-R1`）。

---

## 6. 编号冲突裁决

| 来源 | F4 | F5 | 本系列采用 |
|------|----|----|------------|
| 高层架构 §6.1 In-Scope 列表 | 版本钉治理 | `.cyning-harness` 语义 | ❌ 不采用 |
| 高层架构 §6.3 / 系统设计 / UserStory / promotion | `.cyning-harness` 语义 | SPEC 钉版 | ✅ **采用** |

---

## 7. 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-09 | 初稿 |
| 2026-09-09 | 系列 HG-SPEC-SIGNOFF=approved；授权阶梯前移至 task 闸 |
| 2026-09-09 | 发版职责：Agent 可 bump；人仅 publish |
