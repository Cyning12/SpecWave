# invoke · 40 · 3-0-2-postpublish-dx

> **hat_id**：`40` · **日期**：2026-09-24  
> **task_slug**：`3-0-2-postpublish-dx`  
> **性质**：核验 30 交付 · gate-check · task close · **未**改 `src/` · **未** npm publish/deprecate · **未**新建 tag · **未** git commit

## 结论

**PASS**（blocking 0）· A1–A15 齐 · close → `docs/tasks/done/task_3_0_2_postpublish_dx.md`

## 独立探针（40 重钉 · 禁凭记忆）

| 探针 | 实测 |
|------|------|
| `npm view spec-wave version` | `3.0.2` |
| `dist-tags.latest` | `3.0.2` |
| `time['3.0.2']` | `2026-09-24T00:55:45.386Z`（与 30 一致） |
| `gh release view v3.0.2` | OK · Latest · notes → CHANGELOG `[3.0.2]` · https://github.com/Cyning12/SpecWave/releases/tag/v3.0.2 |
| `gh release list` | `v3.0.2`（Latest）· `v3.0.1` · `v3.0.0` |

## 文档抽检

- README 双语：顶部 Prerequisites（22.19+ / 24+ · Node 20 风险）→ 最小上手 5 步 → 空仓 `test_strategy=required` 最小可绿 · 现行包行 **published**
- RELEASING / CHANGELOG `[3.0.2]` / ACCEPTANCE / spec 索引：均为 **已 published** 真值
- 假叙事：现行对外面无「3.0.2 待发版 / latest 仍 3.0.1」；白名单 = 手册修订史行 · 历史 checklist · 本 task 背景
- **S2**：`docs/tasks/` 仅本 task 文件 · **未**物化示例进消费者 tasks

## 门禁

| 命令 | 结果 |
|------|------|
| `node bin/specgate.js verify --target . --task …` | **VERIFY: PASS** · exit 0 |
| `node bin/specgate.js gate-check --task …` | **exit 0** · 未发现阻塞 |
| `node bin/specgate.js task close --yes --file …` | **CLOSE: PASS** → `docs/tasks/done/task_3_0_2_postpublish_dx.md` |

## Hub / KPI

- 状态改为 `done` · 补 `### KPI（40）` · Hub `docs/tasks/done/README.md` 增行

## 禁令自检

- **未** `npm publish` / `npm deprecate` / 新建或改写 tag / 改 `src/`
- **未** `git commit` / **未** `git add -A`（提交交 00/人 · 见回报清单）

## 建议 commit 文件（逐文件显式 add）

- `CHANGELOG.md`
- `README.md`
- `README.zh-CN.md`
- `RELEASING.md`
- `docs/guides/使用手册-v3.0.0-zh.md`
- `docs/roadmap/ACCEPTANCE_3_0_2_patch_3_0_2_zh.md`
- `docs/spec/README.md`
- `docs/tasks/done/README.md`
- `docs/tasks/done/task_3_0_2_postpublish_dx.md`
- `docs/harness/reviews/task_3_0_2_postpublish_dx_audit_R1_20260924.md`
- `docs/harness/invokes/by-task/3-0-2-postpublish-dx/invoke_20260924_00_3-0-2-postpublish-dx.md`
- `docs/harness/invokes/by-task/3-0-2-postpublish-dx/invoke_20260924_10_3-0-2-postpublish-dx.md`
- `docs/harness/invokes/by-task/3-0-2-postpublish-dx/invoke_20260924_20_3-0-2-postpublish-dx.md`
- `docs/harness/invokes/by-task/3-0-2-postpublish-dx/invoke_20260924_30_3-0-2-postpublish-dx.md`
- `docs/harness/invokes/by-task/3-0-2-postpublish-dx/invoke_20260924_40_3-0-2-postpublish-dx.md`

**勿**纳入：`eval/external-oracle/`
