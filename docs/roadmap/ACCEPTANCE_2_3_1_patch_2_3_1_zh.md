# ACCEPTANCE · 2.3.1 patch（发布卫生与闸语义修复）台账

> **版本**：`spec-wave@2.3.1`（**待发版** · bump 已落 2026-09-14 · tag/push/publish 仅人）
> **task**：[`docs/tasks/done/task_2_3_1_patch.md`](../tasks/done/task_2_3_1_patch.md)（slug `2-3-1-patch` · 无独立 SPEC 夹 · 属 2_3-wiring-completion 验收后 patch）
> **依据**：[`.workbuddy/output/验收报告-SpecWave-2.3.0.md`](../harness/reviews/w7_evidence_provenance_20260917.md) §3.B/§3.L/§3.N · §6「建议 2.3.1」（判 PASS-with-issues）

## 修复清单（§6 建议 2.3.1 三项 · 全落地）

| 项 | 级别 | 修复 | 机械证据 |
|----|------|------|----------|
| N1 | P1 | .bak 发布卫生六件套：.gitignore `*.bak` · files `"!assets/**/*.bak"` · `prepublishOnly` 接 `scripts/check-pack-hygiene.mjs`（包内不得含 `*.bak`/`*~`/`.DS_Store` · failClosed exit 2）· `pins fix` 备份写盘成功后自动清理 · 本机 7 个 .bak 已删 | `npm pack --dry-run` 188 files · .bak=0 · 含 GLOSSARY/MIGRATION；trap 负向（README.trap.bak → exit 2 点名）自证 |
| N11 | P1 | `evalReviewConclusion` 无结论/签收节 → 直接判未通过（禁止回退全文）· 通过词须落结论节内 | A2 负向 fixture（只写「通过」二字无结论节 → exit 2）修复前真红 = 验收报告 A2 组复现；结论节内通过词 exit 0；负向词守卫不破 |
| N13 | P2 | `loadLegacyGateExempt` 四字段改显式类型判（`typeof === 'string' && length > 0`）+ yaml 引号规范注释 | fixture ×3：`authorized_by: 00`（无引号 → 整型 0）无效+留痕 · `"00"` 命中 · `123` 非字符串拒收（旧 falsy 判静默收编 · 真红锁） |

## 存量波及处置（N11 · 循 W4 先例 D-23-W4-TRANSITION · 非静默放过）

- 裸 `verify`（FULL-reviews done 面）实测波及 **8 份** 2.3.0 前历史关账审查文：`2_1_2-rename-closeout` w1–w4 + `rename-specgate` w1–w4（2026-09-10 前关账 · 无结论/签收节 · 通过词在全文 · 旧回退全文口径 2026-09-13 接线前合法）。
- 抽验 9 份样本：波及侧 4 份核因属实（grep：结论节标题 0 · 全文通过词 4-6 处）；近期侧 5 份（2_3-wiring-release / w4 / w7 / 2_2_1-patch / 本 task R1 审查文 dogfood）新闸全 PASS · 零误伤。
- 处置：8 条入 `docs/harness/legacy-gate-exempt.yaml` reviews 节（四字段齐 · reason 点名 N11 接线波及 · date 2026-09-14）→ 裸 verify 复跑 PASS（豁免命中留痕 18）。

## 门禁基线（本棒实测 · 2026-09-14）

| 门禁 | 结果 |
|------|------|
| `npm run typecheck` | 0 错 0 警 |
| `npm test` | **541 tests / 540 pass / 0 fail / 1 门控 skip**（基线 534 → 540 = +6 新测 · 打 tag 后复跑须全绿） |
| `npm run build` / `test:lib` | exit 0 · 6/6 |
| `pins check` | **16/17** · 唯一偏差 = pin-10 git tag `v2.3.1` 缺失（**设计红** · 待人打 tag 后复跑须 17/17 · 口径同 W8/2.2.1） |
| `assets verify` | 110/110（bump 后 manifest rebuild · ~3 变更 = pins fix 三钉面） |
| 裸 `verify` / `task lint-done` | PASS（豁免命中 18 全留痕） |
| `npm pack --dry-run` | 188 files · .bak=0 · 无 *~ / .DS_Store |

## 已知残余（主动登记 · 归 2.4）

- 验收报告 §6「建议 2.4」全部未动：N7（pin-16 refstyle）· N8（pin-17 表行锚定）· N9（pin-08 语义格位）· N12（输出层统一相对化）· N2/N5 · N3 · N10/N6/N14 · N4。
- pin-08 本棒按 D-SPEC-213-ROW 人工补行（unfixable 为设计语义）；其「状态格版本串顶包」弱点（N9）未修 · 归 2.4。
- 结论节内「只写通过二字」仍可机读过闸（A2 绕过面从全文收窄为结论节内 · 报告 §6 N11 建议原文即此口径；进一步强度增强归 2.4 权衡）。
- pin-10 tag-gated 设计红待人打 `v2.3.1` 后复跑转绿。

## 发布边界

- 本棒未执行 `git tag` / `git push` / `npm publish` / `npm deprecate`（仅人）· 未用 `--force`/`--allow-*`。
- RELEASING 人 checklist 2.3.1 节已备（含「打 tag 后复跑 pins 17/17 + npm test 全绿」与「pack 清单无 .bak 对照 2.3.0」探针）。
