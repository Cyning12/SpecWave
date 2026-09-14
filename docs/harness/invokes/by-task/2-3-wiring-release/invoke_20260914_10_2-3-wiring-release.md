# invoke · 10 · 2.3.0 release bump task 起草（W1–W7 全 CLOSE 后收尾 · 同 2.2.0 W8 / 2.2.1 先例制）

> **hat_id**：`10-task` · **日期**：2026-09-14  
> **task_slug**：`2-3-wiring-release`  
> **蓝本**：`docs/spec/2_3-wiring-completion/README.md`（signed · HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）+ done task `task_2_2_closed_loop_w8_release_prep.md` / `task_2_2_1_patch.md`（bump 链路先例）

## 产出

- `docs/tasks/active/task_2_3_wiring_release.md`（本 invoke 同批落盘 · `task lint` → LINT: PASS exit 0 实测）

## R0 前提复核实测（全量实跑/核读 · 非转述）

| 前提 | 实测 | 证据 |
|------|------|------|
| W1–W7 全部 CLOSE | ✅ | `docs/tasks/done/task_2_3_wiring_w*.md` ×7 · done/README.md hub 七行 |
| 基线 HEAD=317446e · 工作树干净 | ✅ | `git log --oneline` / `git status --porcelain`（空）· branch=main |
| 版本真值源 2.2.1 · pins 17/17 PASS | ✅ | `node bin/specgate.js pins check` → 17/17 · exit 0（pin-10=v2.2.1 在位） |
| 测试基线 534 pass + 1 门控 skip | ✅ | `npm test` → tests 535 · pass 534 · fail 0 · skipped 1（duration ≈60s） |
| typecheck / build / test:lib 绿 | ✅ | 本棒实跑 exit 0（tsc 0 错 · lib 冒烟 0 fail） |
| pin-13 首个命中语义（CHANGELOG 先行硬约束） | ✅ | `assets/release-pins.yaml` :108-117 核读：`^## \[(\d+\.\d+\.\d+)\]` flags:m 首个命中 + capture group 1 回写——不先落 2.3.0 节则 fix 回写 `## [2.2.1]` 历史头（F-R-09 入 task 失败路径） |
| RELEASING 双重敏感 | ✅ | `test/docs-releasing.test.ts` :20-51 核读：九步首命中递增断言 · `/版本钉|pins/` 等 9 正则 · pin-07 落点 :13（先例 1fde23e） |
| 断言联改 8 文件清单 | ✅ | grep 实测：cli-p0 / cli-validation / cli-upgrade-compat / cli-docs-121 / cli-docs-122 / init / cli-refresh-ide-blocks / cli-discipline-coverage（含 `2\.2\.1` 转义形态）；历史标题不动面确认（cli-security-closure 2.2.1 P0 · pins-consistency B11 2.2.1 P1） |
| pins 未钉现行引用联改面 | ✅ | grep 实测：README 双语 :289/:290/:309/:311（裸 `2.2.1` 形态 ×8）· MIGRATION :17 · host-adapt README `kit_semver` :41 |

## 定案（顺序硬约束）

package.json 手工 bump（唯一手工点 · 不用 npm version 防顺手 tag）→ **CHANGELOG 2.3.0 节先落盘**（pin-13 防历史腐化）→ spec 索引行 → pins fix --yes → 叙事漂移巡检（RELEASING :13 / README 双语 :375 / 其余误伤面）→ pins 未钉引用 + 断言联改 → RELEASING 待办节 + ACCEPTANCE 档 + PLAN 台账 → 四门 + assets verify → gate-check → close → 独立 commit。

## 闸扫描负向实测

`verify --task`（HG-AUDIT-R1=pending 态）→ ❌ 拒 30 · VERIFY: BLOCKED · exit 2（机制正确性实证 · 留痕于 20 审查文）。

## 移交

→ 20-task-audit R1（审查文落盘 `docs/harness/reviews/`）→ HG-AUDIT-R1 00 代签（2026-09-12 维护者会话授权）→ 30 GATE_VERIFY 后开工。
