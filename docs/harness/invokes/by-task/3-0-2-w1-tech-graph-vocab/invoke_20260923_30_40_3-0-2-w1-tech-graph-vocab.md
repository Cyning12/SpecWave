# invoke · 30-execute + 40-self-check · 3-0-2-w1-tech-graph-vocab

> **hat_id**：`30` + `40` · **日期**：2026-09-23  
> **task_slug**：`3-0-2-w1-tech-graph-vocab`  
> **性质**：W1 tech-graph 词汇登记档补登记 branches/triggers（F-1① · 纯数据波）  
> **⚠️ 例外句（00 记）**：实现与红→绿闭环由 30/40 子 Agent（`79f0145b`）完成；该子 Agent 在 40 机械步阶段空转（两轮中断 + 批次令后磁盘零进展），**剩余机械步（暂存 / 全量四门复跑 / 回填 / 本 invoke / gate-check / close）由 00 亲自执行**——非实现码改动，00 delegate-only 纪律的实现部分仍由子 Agent 所产。

## GATE_VERIFY（首输出 · 子 Agent 留证）

```text
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_3_0_2_w1_tech_graph_vocab.md
| HG-TASK-DRAFT | approved | 20, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_3_0_2_w1_tech_graph_vocab.md
```

## 改动摘要（子 Agent 所产）

| 文件 | 变更 |
|------|------|
| `assets/tech-graph-vocab.yaml` | edge_types + `branches` / `triggers`（F-1 来源注释 · 「登记 ≠ 封闭」原则声明 · version 维持 `"1"`） |
| `test/f1-unify.test.ts` | `:213` 内容钉四条→六条 · 新增 g3 fixture（branches+triggers ⇒ 零词汇告警）· `:291` 可见性钉翻转（00_main 零 `[warning]` · 注明实测依据） |
| `assets/sha256.manifest` | 资产哈希同步（`assets manifest rebuild --yes` · 113 条 · ~1 变更）——子 Agent 顺带捕获的设计内联动红 |

**未触**：`src/` 零改动（A6 硬边界 · `git diff --stat` 机械断言通过）· 语料 / 模板 · W2 · bump · tag/push/publish。

## 红→绿闭环（子 Agent 留证）

- 红（改登记档前）：`:213` 内容钉 actual 四条 ≠ expected 六条 · g3 fixture stderr 点名 branches/triggers 未登记 · `:291` 00_main stderr 4 行 triggers warning
- 绿（改登记档后）：`node --test test/f1-unify.test.ts` → **tests 14 · pass 14 · fail 0**（00 独立复验一致）

## 自证（A1–A8 · 00 复跑四门）

| # | 结果 | 证据 |
|---|------|------|
| A1 登记档六条 | PASS | `edge_types = [depends_on, async_calls, condition, has_metadata, branches, triggers]` · version/namespace/kinds 不变 |
| A2 已登记零告警 | PASS | g3 fixture compile exit 0 · stderr 无「未在 tech-graph 词汇登记档」（f1-unify 新增用例） |
| A3 未登记仍告警 | PASS | 钩② bogus_edge 用例绿（开放惯例不回退） |
| A4 仓内语料清零 | PASS | `:291` 翻转用例绿：compile 00_main stderr 零 `[warning]` |
| A5 恒等零漂移 | PASS | `:218-237` 恒等 fixture（5 语料 compile ≡ tracked md · export ≡ graph.json）绿 |
| A6 非范围钉死 | PASS | `git diff --stat` 仅 assets×2 + test×1（+ 过程档）· src 零改动 · 未开 W2 · 未 bump |
| A7 四门 | PASS | typecheck exit 0 · **npm test 910 · 909 pass · 0 fail · 1 skip** · build exit 0 · test:lib 6/6（00 复跑 · `npm_config_cache=/tmp` 绕本机缓存 EPERM） |
| A8 关账 | PASS | gate-check exit 0 + `task close --yes`（见 task 自检结论）· 未 commit/tag/push/publish（commit 由 00 执行） |

## 环境留痕（非本波引入）

- 本机 `~/.npm-local` 缓存含 root-owned 文件 ⇒ `npm pack --dry-run` EPERM（pack-hygiene 红 · exit 255）；`npm_config_cache=/tmp/npm-cache-302` 绕过即绿。**人 publish 时 `prepublishOnly` 同受影响 · 须 `sudo chown -R 501:20 ~/.npm-local` 或设 `npm_config_cache`（已列入 00 发版提醒）**。
- check-doc-links「S2(i) ≠ 基线 34」为 3.0.2 in-flight 过程件未入库的已知形态（3.0.1 W3 经验）· 逐文件显式 add 后复绿（本波实测 55 → 复绿）。

Wiki: none（资产数据波 · 无规范增量）
