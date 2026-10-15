# invoke · 30/40 · 3-4-0-release-bump

> **hat_id**：`30/40`（合并留痕 · execute hats 不物化独立档 · 仓例 AGENTS.md 禁区「默认不物化 30/40 execute hats」）  
> **日期**：2026-10-15  
> **task_slug**：`3-4-0-release-bump`

## 30 执行摘要（簿记棒 · 范围 ①–⑪）

- ① bump：`package.json` / `package-lock.json` 各仅 version 行 `3.3.0`→`3.4.0`（未用 `npm version`）。
- ② CHANGELOG：`[3.4.0] - 2026-10-15` 节（先于 pins fix）· `[3.3.0]` 回填已发布（registry 实测）。
- ③ `pins fix --yes` 写 9 处 → 复跑 16/17（唯一偏差 pin-10 设计红）。
- ④ 叙事巡检：pins fix 漂移全修回真值（registry latest 一律实测值 · 无「3.4.0 已 published」假叙事）。
- ⑤ ACCEPTANCE_3_4 新建 · ACCEPTANCE_3_3_0 头栏回填。
- ⑥ spec 索引 3.4.0 行（pin-08 合格）· 3.3.0 行回填 published。
- ⑦ 手册头栏钉 3.4.0 · ⑧ RELEASING 台账 + 人 checklist（双重敏感 · 改后全量 test）· ⑨ MIGRATION「3.3.0 → 3.4.0 无强制动作项」。
- ⑩ 禁区守住：Agent 零 tag / push（版本 tag）/ publish / deprecate · 逐文件显式 add（无 `-A`）。
- ⑪ 关账：PR [#38](https://github.com/Cyning12/SpecWave/pull/38) 合 main（`4680965`）· 人 tag `v3.4.0`（object `25a4686` ↔ `c4d027b`）+ publish（registry `latest=3.4.0` · `time.3.4.0`=2026-10-15T07:09:13.832Z · 端点实测）。

## ⑨ 回填棒（publish 后 · 2026-10-15）

CHANGELOG `[3.4.0]` 发布状态 · RELEASING 台账三处 + 3.4.0 checklist 标已完成按实勾 · README 双语现行包行 + 迁移节钉版漂移 6 处修齐（3.3.0→3.4.0）· spec 索引 3.4.0 行 → published · 手册头栏/§2 翻真 + 命令示例钉 30 处 · MIGRATION 头栏/§2/钉行 + 变更表 · ACCEPTANCE_3_4 pin-10 设计红清偿登记。

## 40 自证（门禁实测）

| 时点 | 结果 |
|------|------|
| bump 簿记棒（打 tag 前） | typecheck 0 错 · npm test 1003 · 1000 pass + 2 tag-gated 设计红 + 1 skip · build ✓ · test:lib 6/6 · pins 16/17（仅 pin-10）· assets 113/113 · doc-links PASS（S2 基线 34 未动） |
| 打 tag 后（清偿实证） | pins **17/17** · `release-tag-identity` 转绿 · main CI（`4680965`）4/4 success |
| ⑨ 回填棒末 | npm test **1003 · 1002 pass · 0 fail · 1 skip**（全绿 · 含 DEF-001 T5 步骤⑥正则首命中顺序假红修复留痕）· task lint PASS · verify PASS |

## 断言联改留痕（F-REL-07）

7 个测试文件 `3.3.0`→`3.4.0` 字面钉例行更新（含转义双模式）+ README Prompt 块钉版 + DEF-001 T5 顺序假红措辞修复（RELEASING L13「CI 4/4 绿」→ success）。历史标题与红测留证注释未动。
