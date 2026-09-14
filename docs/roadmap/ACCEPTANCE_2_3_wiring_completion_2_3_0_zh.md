# 验收档 · 2.3.0 · 接线补全（wiring completion）

> **包**：`spec-wave@2.3.0`（**已 published** · 2026-09-14 · 人 · tag **`v2.3.0`** ↔ bump commit `87dfa6f`）  
> **状态**：**CLOSED · 已 published**（⑨ 00 代核探针：`npm view spec-wave version`=`2.3.0` · `dist-tags.latest`=`2.3.0` · `time.2.3.0`=2026-09-14T01:15:25Z · `npm pack spec-wave@2.3.0 --dry-run` 193 文件 · `git show v2.3.0:package.json` name/version 正确 · 打 tag 后复跑 pins 17/17 · npm test 534 pass/0 fail/1 skip）  
> **规划**：[`PLAN_2_3_wiring_completion_v1_zh.md`](./PLAN_2_3_wiring_completion_v1_zh.md)  
> **SPEC**：[`../spec/2_3-wiring-completion/`](../spec/2_3-wiring-completion/)（signed · HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）  
> **task**：[`../tasks/done/task_2_3_wiring_release.md`](../tasks/done/task_2_3_wiring_release.md)（收口 task · 余七波见 Waves 表）

---

## Waves

| Wave | 结论 | feat 提交 |
|------|------|-----------|
| W1（pins 机制补强 · 核心） | **DONE** · pin-08 弱钉改严（D-23-PIN08-STRICT 双判）+ 三面入钉 pin-13/14/15（CHANGELOG 发布头 / MIGRATION / AGENTS · 纯数据）+ 失配 fixture 补全 + `extractSpecSlug` 目录型修复 + unfixable 误报评估 | `a675e78` |
| W2（钉面维度扩展） | **DONE** · pin-16 文档↔files 白名单 + pin-17 宿主↔根 README + MIGRATION.md 前置修复入 files | `cf1b17d` |
| W3（安全与可观测性） | **DONE** · C3 补漏 toRel 相对化 + exit 1 JSON 信封 + quickstart git 前提 + C4 CI 加固（permissions/audit/secrets-scan）+ C5 provenance 指引 | `661f6e2` |
| W4（A5+A6 闸语义接线） | **DONE** · G2 结论级 + G4 W5–W7 warn-only + 裸 verify 仓级 reviews + lint-done 帽级 + reviews.CLOSE 强证据 + 豁免数据 + 覆盖表回写 | `a62ca45` |
| W5（A2 资产完整性） | **DONE** · `assets/sha256.manifest` 110 条 + `assets verify` / `manifest rebuild` 子命令（failClosed exit 2）+ CI/prepublishOnly 接线 | `880ced6` |
| W6（B4 宿主补齐 7→13） | **DONE** · 六宿主官方取证（gemini / opencode / roo / zed / cline / aider）· 零新资产复用 agents 面 · pin-17 +6 锚/+6 豁免 | `72c785e` |
| W7（DX 与工程健康） | **DONE** · 根 README 双语宿主表 4→13 + GLOSSARY 两处一致化 + E2 离线 fixture（SPEC_WAVE_E2E_NETWORK 门控真装）+ E5 noUncheckedIndexedAccess + pin-17 豁免 9→0 关账 | `317446e` |
| release | **DONE** · bump `2.3.0` · pins fix 对齐 9 落点 · CHANGELOG 2.3.0 节 · RELEASING 待办节 + 台账 · 本档落盘 · CLOSE: PASS | 本 bump 提交（`chore(release): bump to 2.3.0 — wiring completion`） |

> 八 task 全 CLOSE · `docs/tasks/done/task_2_3_wiring_w*`（W1–W7）+ `task_2_3_wiring_release.md`。

---

## 门禁基线（bump 提交时点 · 2026-09-14 实测）

| 门禁 | 结果 |
|------|------|
| `npm test` | **534 pass + 1 门控 skip**（`SPEC_WAVE_E2E_NETWORK` 真装链路默认 skip · 设计）· 基线只增不红；tag-gated 设计红 ×2（release-tag-identity「缺少 git tag v2.3.0」+ pins-consistency 真实仓 pins check 因 pin-10）待人打 tag 后复跑转绿 |
| `node bin/specgate.js pins check` | **16/17** · 唯一偏差 pin-10「git tag v2.3.0 缺失 · git 操作仅人（F-A1-05）」= **设计红 · 待人打 tag 后复跑须 17/17 exit 0**（同 2.2.0/2.2.1 口径） |
| `node bin/specgate.js assets verify` | **110/110 PASS · exit 0**（manifest 已随本 bump 重生成 · 修复对象=manifest 资产未反向改） |
| `npm run typecheck` / `npm run build` / `npm run test:lib` | 全绿 · exit 0 |
| 闸扫描 | 本 task HG-TASK-DRAFT / HG-AUDIT-R1 均 approved（2026-09-12 维护者会话授权 00 代签）· GATE_VERIFY PASS · gate-check exit 0 |

---

## 已知残余（不挡发版 · 留痕）

1. **pin-10 tag-gated 设计红**：`v2.3.0` tag 缺失 → pins check 16/17 · npm test 2 红（release-tag-identity + pins-consistency 真实仓组）；维护者打 tag 后复跑须全绿（RELEASING ⑤ 既定序）。
2. **叙事行语义盲区**（2.2.0 债 2 沿存）：「待发版 ↔ 已 published」叙事行不在钉面内，本棒已手工巡检修回 ×4（RELEASING :13 · README 双语 :375 · MIGRATION :3 描述）；publish 后 ⑨ 回填仍须人工/Agent 执行。
3. **pins fix `.bak` 备份**靠人工清理（本棒 8 个留本机未入库 · 2.2.0 债 3 沿存）。
4. **对外宣称口径**：事实卡 §10/§11 未发布能力口径不变 · 事实卡本体更新归维护者（本棒未动 `.workbuddy`）。

---

## 人 checklist（待执行 · RELEASING ⑥–⑨）

1. [ ] 确认工作树已 commit（bump 提交 · CHANGELOG · 钉点 16/17+pin-10 设计红 · 四门绿）  
2. [ ] `git tag v2.3.0 <publish-commit>`（annotated · **禁止** `git tag -f`）+ push main + push tag  
3. [ ] `npm publish`（`spec-wave@2.3.0`）  
4. [ ] 探针 PASS：`npm view spec-wave version` → `2.3.0` · `git show v2.3.0:package.json` → name/version 一致 · 远端 main/tag  
5. [ ] 回填本档 / RELEASING / README 双语 / CHANGELOG / spec 索引为已 published（Agent 代核 ⑨ · 含 pin-10 复跑 17/17 与 npm test 全绿确认）

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12~14 | W1–W7 feat 落地 · 逐波 CLOSE（a675e78 → 317446e） |
| 2026-09-14 | release 波 bump `2.3.0` · pins 16/17+pin-10 设计红 · assets 110/110 · 534 pass+1 门控 skip · task close · **待发版**落档 |
