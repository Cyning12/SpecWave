# invoke · 10 · 2.3 W7 DX 与工程健康 task 起草（蓝本 SPEC 07 signed · 五定案 · 双冻结）

> **hat_id**：`10-task` · **日期**：2026-09-14  
> **task_slug**：`2-3-wiring-w7-dx-health`  
> **蓝本**：`docs/spec/2_3-wiring-completion/07_w7_dx_health_v1.md`（signed · HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）

## 产出

- `docs/tasks/active/task_2_3_wiring_w7_dx_health.md`（本 invoke 同批落盘 · LINT: PASS exit 0）

## R0 前提复核实测（全量核读/实跑 · 非转述）

| 前提 | 实测 | 证据 |
|------|------|------|
| README 宿主表 4 行 · tagline 旧口径 | ✅ | `README.md` :5/:24-29 · `README.zh-CN.md` :5/:24-29 核读 |
| pin-17 = 13 host_hits + 9 known_gaps（全 until_wave W7）· 失陈债机检在线 | ✅ | `assets/release-pins.yaml` :156-206 · `src/cli-pins.ts` :395-403 核读 |
| 九新宿主词锚双语 0 命中（roo='Roo Code' · zed 大写） | ✅ | W6 task 实测记录（2026-09-13）· 本棒核读 pins 注释 :169-172 |
| GLOSSARY 两处失准（:29/:45/:66/:82） | ✅ | 核读 + grep「four gates / 每帽」定位 |
| sync prompts 物化 7 具名帽 · 无 50 | ✅ | `src/cli-sync-prompts.ts` :7-19（11 文件白名单）· `assets/harness/prompts/` 目录核对 |
| TASK_TEMPLATE 闸表 2 行 | ✅ | `assets/harness/templates/TASK_TEMPLATE.md` :41-44 核读 |
| E2 网络绑定根因 | ✅ | P1-2 真实 `pnpm add -D file:`（`test/cli-peer-optional.test.ts` :55-64）· js-yaml 运行时依赖 + prepare 需 devDeps |
| **E5 爆炸半径量化** | ✅ **62 错 / 11 文件** | 本棒实跑 `tsc --noEmit --noUncheckedIndexedAccess`（cli-graph-hgm 13 · cli-shared 11 · cli-pins 9 · cli-graph-yaml 7 · cli-checks 6 · cli-assets 5 · cli-wiki 4 · cli-task-extra 2 · cli-status 2 · cli-skills 2 · cli-sync 1）→ 熔断阈值内，不触发 F-W7-02 |
| 基线 534/534 · pins 17/17 · assets 110/110 | ✅ | W6 关账自检（72c785e）· 30 开工复跑确认 |

## 定案（冻结）

D-23-W7-TAGLINE（tagline 13 宿主概括 · 钉点串不动）· D-23-W7-TABLE（四行锚形态不变 + 九词锚逐字 · aider 注入层口径 · roo 不夸大）· D-23-W7-PIN17（**关账顺序硬约束**：README 先 → 中间态 exit 2 留痕 → 摘 9 豁免 → 转绿）· D-23-W7-E2（离线伪造布局 + SPEC_WAVE_E2E_NETWORK 门控真装）· D-23-W7-E5（单项加严 · 熔断 >100 错/>15 文件/改测试语义）。

## 闸扫描负向实测

`verify --task`（HG-AUDIT-R1=pending 态）→ ❌ 拒 30 · VERIFY: BLOCKED · exit 2（机制正确性实证 · 留痕）。

## 移交

→ 20-task-audit R1（审查文落盘 `docs/harness/reviews/`）→ HG-AUDIT-R1 00 代签 → 30 GATE_VERIFY 后开工。
