# 验收档 · 2.2.0 · 闭环起步（closed-loop start）

> **包**：`spec-wave@2.2.0`（**published**）  
> **状态**：**CLOSED** · 发布归维护者（人已执行 · Agent 2026-09-11 核验落表 · RELEASING ⑨）  
> **规划**：[`PLAN_2_2_closed_loop_start_v1_zh.md`](./PLAN_2_2_closed_loop_start_v1_zh.md)  
> **SPEC**：[`../spec/2_2-closed-loop-start/`](../spec/2_2-closed-loop-start/)  
> **task**：[`../tasks/done/task_2_2_closed_loop_w8_release_prep.md`](../tasks/done/task_2_2_closed_loop_w8_release_prep.md)（收口 task · 余七波见 Waves 表）

---

## Waves

| Wave | 结论 | feat 提交 |
|------|------|-----------|
| W1（A1 · 核心） | **DONE** · 版本/身份钉自动化（release-pins.yaml 12 钉面 · `pins check` / `pins fix` · prepublishOnly + CI 门禁） | `e4be372` |
| W2（C1+C3） | **DONE** · 安全封堵（target 外绝对路径 / `..` 逃逸拒止 · 相对输出） | `1e49052` |
| W3（C2） | **DONE** · `verify --json` 四字段只增（traceId · exitCode · source · injectedFiles） | `da66325` |
| W4（D1+D3） | **DONE** · init quickstart 3 步 + README 双语「核心对象」 | `07a38a4` |
| W5（D2） | **DONE** · 双语 GLOSSARY.md + README 首屏链接 | `2198ef2` |
| W6（B1） | **DONE** · 三宿主扩展（copilot / codex / windsurf · pin-11/12 数据新增） | `83e658c` |
| W7（E1+C7） | **DONE** · 工程健康小清理（HARNESS_META_HEADING 常量 · dest 白名单收口 · 零行为变更） | `a116d8e` |
| W8 | **DONE** · 发版准备：bump `2.2.0` · pins 首次实战对齐 · 钉点 12/12 · CLOSE: PASS | `60b8640`（bump） |

> 八 task 全 CLOSE · `docs/tasks/done/task_2_2_closed_loop_w*`（W1–W8）。

---

## 产品验收（发布溯源）

| # | 条款 | 状态 |
|---|------|------|
| T1 | `npm view spec-wave version` / `dist-tags.latest` → `2.2.0` | **PASS** |
| T2 | tag `v2.2.0`（annotated · 对象 `4d96117`）↔ bump commit `60b8640` · `git show v2.2.0:package.json` → `name=spec-wave` · `version=2.2.0` | **PASS** |
| T3 | origin/main = `3a2b407`（W8 close 归档）· tag 已推远端（`refs/tags/v2.2.0`） | **PASS** |
| T4 | `node bin/specgate.js pins check` → **12/12 PASS · exit 0**（pin-10 tag 钉随 `v2.2.0` 落位转绿） | **PASS** |
| T5 | `npm test` → **459/459 · exit 0**（含 2 个 tag-gated 设计红转绿：release-tag-identity / pins pin-10） | **PASS** |
| T6 | `npm run typecheck` → **0 错 · exit 0** | **PASS** |
| T7 | 测试基线 **406 → 459**（2.2 新增 pins / 安全封堵 / 可观测字段 / 宿主扩展等负向断言） | **PASS** |

### registry 核验（Agent · 2026-09-11）

```text
npm view spec-wave version          → 2.2.0
npm view spec-wave dist-tags.latest → 2.2.0
git show v2.2.0:package.json        → "name": "spec-wave" · "version": "2.2.0"
git rev-parse v2.2.0^{commit}       → 60b864035fbc516ad0cf27816088c36ceef23837
git ls-remote origin main           → 3a2b407e24b715bc47a62d58d35ad9e13b6a176c
```

---

## 机制债留痕（→ 2.3 候选）

1. **pins fix 同文件多钉面覆盖**：同文件双钉面（pin-11/12 · `assets/ide/host-adapt/README.md`）单次运行串行写互相覆盖，二跑幂等收敛；W8 已留痕 `task_2_2_closed_loop_w8_release_prep`，未修实现（候选债项）。  
2. **叙事行语义盲区**：pins 只钉版本号字面，README/RELEASING/CHANGELOG 的「待发版 ↔ 已 published」叙事行不在钉面内，发布前后须人工/Agent 回填（本档及 82fe0dc 先例即此类手工回填）；候选 2.3 机制化（发布状态钉面或叙事行 lint）。  
3. pins fix 遗留 `.bak` 备份靠人工清理（本轮已删 6 个）；是否自动清理另议。

---

## 人 checklist（已完成）

1. [x] 工作树已 commit（bump `60b8640` · CHANGELOG · 钉点 12/12 · 四门绿）  
2. [x] `git tag v2.2.0`（annotated · 禁 `-f`）+ push main（`3a2b407`）+ push tag  
3. [x] `npm publish`（`spec-wave@2.2.0` · registry `latest=2.2.0`）  
4. [x] 探针 PASS（registry · tag↔package.json · 远端 main/tag）  
5. [x] 回填 ACCEPTANCE / RELEASING / README 双语 / CHANGELOG / spec 索引为已 published（Agent 代核 ⑨）

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-11 | W1–W7 feat 落地 · 逐波 CLOSE |
| 2026-09-11 | W8 bump `2.2.0` · pins 12/12 · 459/459 绿 · task close |
| 2026-09-11 | **CLOSED** · 人 publish `spec-wave@2.2.0`（tag `v2.2.0` ↔ `60b8640` · origin/main `3a2b407`）· Agent 代核 ⑨ 落表 |
