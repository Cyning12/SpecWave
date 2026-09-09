# F4 · `.cyning-harness` 目录名语义收敛

> **状态**：`signed` · 隶属 `1x-mvp`  
> **feature_id**：`F4` / `F4.1`  
> **对齐**：X11 → V3 · 痛点 P3  
> **test_strategy**：`required`  
> **冻结决策**：系统设计 §4.5 **方案 B「彻底收敛 + 降级兼容」**（2026-09-07 中间确认）  
> **上游**：系统设计 §3.2.M5 / §4.5 / §5.1 · 高层架构 §6.3 F4

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **spec_slug** | `1x-mvp/F4_directory_semantics` |
| **freeze_id（草案）** | 新落盘根 = `.coding-kit/`（DSH 场景 `.dsh/coding-kit` 语义等价）；`.cyning-harness/` = **legacy 只读探测**，禁止作为新写目标 |
| **协同** | F3 T2；R-07 备份路径随方案 B 迁移 |

---

## 1. 背景与目标

`.cyning-harness` **双重语义**：

- 多处仍是**现行落盘**（如 HGM `HGM_DIR`、refresh 备份、cli 探测）  
- `src/index.ts` 又将其当 **legacy 布局** hint  

导致品牌与维护成本双轨长期并行（X11）。

**一句话目标**：语义收敛为单一定义——**新写一律 `.coding-kit`；旧目录只读降级 + `upgrade` 提示；不删除旧内容**。

**完成态行为**

1. `init` / `upgrade` / HGM 事件轨 / refresh 备份等**新写路径**指向 `.coding-kit/`（或 `.dsh/coding-kit`）。  
2. 探测到 `.cyning-harness` → 可读迁移所需文件（manifest/events）+ 提示执行 `upgrade`；**不**再作为默认写入口。  
3. 文档（README / MIGRATION / 本 SPEC）统一口径；消除「kit 本体目录 = `.cyning-harness`」表述。  
4. 回归：旧仓仅有 `.cyning-harness/manifest.json` 时仍可 `upgrade --yes` 迁到新目录。

---

## 2. 范围

### 2.1 In（方案 B 落地动作）

1. 新落盘统一 `.coding-kit`（manifest / events / backups）。  
2. `.cyning-harness` 降级为 legacy 探测标记；保留只读访问。  
3. 探测即提示 `upgrade`；迁移前旧内容可用；**不做删除**。  
4. 交叉同步：迁移治理器、落盘路径表、安全分级文案三处口径一致（系统设计已声明，实现须对齐）。  
5. `refresh-ide-blocks` 备份目录迁到新根（或写新读旧兼容一层）。

### 2.2 非范围

- 不强制批量为所有消费者自动 `mv` 旧目录（由 `upgrade` / 文档引导）  
- 不改 S2 三前缀（F1）  
- 不引入第二产品名 bin 别名  
- 不在本 F 执行 npm deprecate（F3）

---

## 3. 方案要点（R2）——已冻结

| 方案 | 要点 | 结论 |
|------|------|------|
| A. 保留双重语义只改文档 | 不消 X11 | **弃选** |
| **B. 彻底收敛 + 降级兼容** | 新写 `.coding-kit`；旧只读 + 提示 | **已采纳（2026-09-07）** |
| C. 立即删除旧目录支持 | 破坏存量 | **弃选** |

> UserStory 早期「`.cyning-harness` = kit 本体唯一含义」已被方案 B **取代**；本 SPEC 以系统设计为准。

---

## 4. 验收标准

- [ ] 全仓新写路径默认根为 `.coding-kit`（或文档声明的等价 `.dsh/coding-kit`）  
- [ ] `.cyning-harness` 无「创建/写入默认目标」（测试钉死）  
- [ ] legacy 探测：有旧 manifest → 提示 upgrade；可读不报崩  
- [ ] `upgrade --yes`：旧 → 新布局；S2 仍不覆盖  
- [ ] README/MIGRATION 无「新标准目录=.cyning-harness」  
- [ ] 对齐 V3：目录语义数 2 → 1

---

## 5. failure_paths

| ID | 触发 | 行为 | 可重试 |
|----|------|------|--------|
| F4-01 | 新代码仍写入 `.cyning-harness` | 测红；打回 | 是 |
| F4-02 | 实现删除消费者旧目录 | 禁止；安全设计冲突 | 是（改回只读） |
| F4-03 | 只改文档不改 HGM_DIR 等 | X11 仍在；审计 FAIL | 是 |
| F4-04 | 与 F3 文档目录目标不一致 | 系列闸打回 | 是 |

---

## 6. 思考轮（本 F）

| 轮 | 摘要 |
|----|------|
| R0 | X11 + 方案 B 已中间确认 |
| R1 | 代码+文档双改；不删旧数据 |
| R2 | 方案 B 冻结；弃选 A/C |
| R3 | 备份/事件/manifest 三域同迁 |
| R4 | required；写路径与探测路径分测 |
| R5 | 开放：备份目录是否保留一代读旧写新 |

---

## 7. 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-09 | v0-draft（锚定方案 B） |
| 2026-09-09 | 系列签收；方案 B 仍为 F4 真值 |
