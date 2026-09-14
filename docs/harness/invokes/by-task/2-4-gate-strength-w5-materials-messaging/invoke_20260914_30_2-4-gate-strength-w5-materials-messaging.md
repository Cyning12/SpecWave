# invoke · 30 · 2-4-gate-strength-w5-materials-messaging（实现留痕）

> **hat**：30 实现棒 · 2026-09-14 · task `docs/tasks/active/task_2_4_gate_strength_w5_materials_messaging.md`
> **前置核对**：GATE_VERIFY PASS（HG-TASK-DRAFT / HG-AUDIT-R1 双 approved · R1 指针审查文承接总审 PASS · T-5 提示级：验收② grep 锚定事实卡防空转）。
> **波段性质**：纯文档波 · **零代码改动**（src/test 未动一字节）。

## 1. N3 · 物料 4 份处置（SPEC 05 §5.1 · task 定稿：快照标注）

逐份定**快照标注**（默认最低代价合规 · 03 发布博客天然快照同标注），4 份文首均插「历史版本快照（2.1.3 时点）」标注行 + 指向仓根 README 现行事实面；正文历史叙事不改写（不伪造历史）。改前黑名单词（`四宿主|406 用例|2\.1\.3`）命中 3/5/7/11 处；改后逐份快照标注行 grep = 1/1/1/1（验收①取「快照标注行存在」支）。

## 2. 口径三调（SPEC 05 §5.2 · §6 末三条）

- **调一（T-03 降调）**：README 双语 grep「可机检」零命中（与 R1 T-5 复核一致）；主落点 = 事实卡 `.workbuddy/output/推广事实卡-2.2.0.md` §11 :221 行——「assets sha256 清单 + assets verify · 仅纸面未实现」改写为「2.3.0 已交付 · 只能声称防意外漂移/防遗忘 · 不得声称防投毒/篡改发现 · 主动投毒防护依赖 provenance（未启用）」。
- **调二（安全设计收窄 · 只收窄不重构 F-W5-03）**：`delivery/安全设计.md` :77「篡改发现」→「意外漂移发现（防主动投毒依赖 provenance · 未启用，见 §5.3.1 A-1）」；:418 T-03 定位行同步标注「防意外漂移口径 · 防主动投毒依赖 provenance · 未启用」；:768 §5.3.1 A-1 行完整性依赖列「assets sha256 清单（方案 A 定稿）」→「（防漂移口径 · 防投毒依赖 provenance · 未启用）」。tarball sha512 / 2FA 等真实控制未动。
- **调三（关账声称恢复）**：对外面 grep「关账必经」唯一出现处 = 事实卡 :234（原禁称行）。W2 已落地（S1·N=20 定档 · 结论节实质内容判据入 `evalReviewConclusion`）→ 按 SPEC 05 §6「落地后恢复」改写为可声称「关账必经结论级审查通过（机读文本闸）」+ 保留「非人工复核等价物」诚实限定；核查结论留档 task 自检结论③。

## 3. N6 · aider 行双语（F-W5-02 表行锚保留）

README.md:38 / README.zh-CN.md:38 aider 行各补 `.aider.conf.yml` 写 `conventions-file: AGENTS.md` 等价写法（V3 官方文档取证属实 · 报告原引 :106 已漂移 · 本棒复核现值 :38）；表行 host 词锚 `**aider**` 未动。

## 4. 随改随跑

`pins check` → PASS 17/17（pin-16 扫描 96 markdown 0 失配 · pin-17 13 宿主双语命中不破）；`assets verify` → PASS 110/110（本棒无 assets/ 变更 · 无需 rebuild）。

## 5. 未做（禁区）

未翻新物料到现行事实面（task 定稿默认快照 · 20 审未提翻新要求）· 未动《安全设计》威胁模型结构 · 未启用 provenance（仅人）· 未把物料纳入钉面（归后续评估）· 未动 src/test/CI · 未 `git add -A` · 未 tag/push/publish/bump（属发版波）。
