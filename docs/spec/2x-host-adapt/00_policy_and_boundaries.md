# 00 · 政策与边界（2.x 宿主适配）

> **状态**：`signed` · 隶属 `2x-host-adapt`  
> **受众**：00/10 规划 · 20-spec-audit · 30 执行前必读  
> **上游规划**：[`../../roadmap/PLAN_2x_host_adapt_v1_zh.md`](../../roadmap/PLAN_2x_host_adapt_v1_zh.md)（**signed**）  
> **Open Folder**：`dsh-coding-kit/`  
> **打开本文件 ≠ 授权改 `src/`**（仍须 task + `HG-AUDIT-R1`）

---

## 1. 本系列定位

| 是 | 不是 |
|----|------|
| F6「规范分发器化」的 **需求契约草稿** | 已实现的适配引擎说明书 |
| 对 1.12 P6-prep 盘点的 **扩展**（补 commands / profile / JSON 面） | 推翻 P6-prep 已签表 |
| 2.0 task 与验收的输入 | OpenSpec / Ruler 的再实现 |

---

## 2. 演进纪律（强制）

1. **MVP ⊂ 完整版**：1.x（F1–F5 + 1.12 收口）已满足「先统一真值源」；禁止为赶工给单宿主写死适配再反推表。  
2. **DSH = 首个宿主，非唯一**：适配表须能表达「DSH 用 tools/skills；Cursor/Claude 用 rules+commands」等差异行。  
3. **零云**：不引入远程 Policy / Marketplace 强制下发（F2 分层强制保持文档级）。  
4. **双入口不合并**：插件面与 CLI 面职责不变；commands **不得**把 `init_coding_kit` 与 CLI `init` 混成同一动词而不加 POINTER。  
5. **永不覆写 S2**：物化/编译 **禁止**写入 `S2_TRUTH_PREFIXES` 保护域。  
6. **Verify 真值在 CLI**：slash/command 只编排与解释；P0 结论以 `verify` / `gate-check` / `audit` 的 **exit 2 failClosed** 为准。

---

## 3. 非目标（整包强制 · draft）

1. 复制 OpenSpec 的 change/delta/archive 产品形态作为 kit 主流程。  
2. 在 command 正文复制 L1/L2 / hat 全文（须 POINTER 到 assets / skills）。  
3. `/kit-execute`（或等价）绕过 `HG-AUDIT-R1` / 人工闸。  
4. 自研 IDE、商业化计费、第二分发通道、云 SaaS。  
5. 删除消费者仓既有 `.cyning-harness/`（legacy 只读策略不变）。  
6. Agent 执行 `npm publish` / `npm deprecate`。

---

## 4. 授权阶梯（目标态）

```text
本系列 HG-SPEC-SIGNOFF=approved
  → 00 按 wave 起草 2.0 task
    → 20-task-audit + HG-AUDIT-R1
      → 30 改码（适配表 / 物化 / commands 资产）
        → 人签 HG-PUBLISH → npm publish 2.0.0
```

---

## 5. 验收方向（草案 · 非冻结）

| ID | 草案 |
|----|------|
| F6-A | 声明式适配表（YAML 或等价）覆盖 ≥ **always_on + skills + commands** 三类落点 |
| F6-B | ≥ **2** 个非 DSH 宿主可物化（建议 Cursor + Claude Code） |
| F6-C | DSH 行：tools + skills 为原生；commands 可空或降级 |
| F6-D | U-01：契约版本嗅探 + 不匹配降级（不静默写坏） |
| F6-E | 物化路径遵守 S2；`--dry-run` / 报告 JSON（对齐现有 CLI 习惯） |

---

## 6. 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 初稿：commands 一等公民 + Verify/S2/双入口纪律 |
| 2026-09-10 | **HG-SPEC-SIGNOFF=approved**；状态 → signed |
