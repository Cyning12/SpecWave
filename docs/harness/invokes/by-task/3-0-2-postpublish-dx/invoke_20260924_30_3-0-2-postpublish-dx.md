# invoke · 30 · 3-0-2-postpublish-dx

> **hat_id**：`30` · **日期**：2026-09-24  
> **task_slug**：`3-0-2-postpublish-dx`  
> **性质**：post-publish DX 实现（docs 回填已 published + README Prerequisites/首屏收敛 + GitHub Releases · **无** `npm publish` / 新建 tag / `src/`）

## GATE_VERIFY（开工）

```text
npx spec-wave verify --target . --task docs/tasks/active/task_3_0_2_postpublish_dx.md
| HG-TASK-DRAFT | approved | — |
| HG-AUDIT-R1   | approved | ✅ 可 30 |
VERIFY: BLOCKED · missing pre-30 invoke hats: 00
```

- **闸表真值**：HG-AUDIT-R1=approved → **未因闸拒开工**（内容可 30）
- **过程债**：缺 00 invoke（`required_invoke_hats` 含 00）· 本窗按 00 派单授权继续；**未**伪造 00 invoke

## 探针实测（禁凭记忆）

| 探针 | 值 |
|------|-----|
| `npm view spec-wave version` | `3.0.2` |
| `dist-tags.latest` | `3.0.2` |
| `time['3.0.2']` | `2026-09-24T00:55:45.386Z` |
| `git rev-parse v3.0.2^{commit}` | `3d71b90d3c6e6070fcdb7eceeea8d506043f9934` |
| `git show v3.0.2:package.json#version` | `3.0.2` |
| engines | `^22.19.0 \|\| >=24.0.0` |

## 产出 · 改动文件

- `RELEASING.md`（latest / 验收 / 人 checklist 3.0.2 → 已 published · **保留 pin-07 紧凑表格式** · 排版-only dirty 已丢弃）
- `docs/roadmap/ACCEPTANCE_3_0_2_patch_3_0_2_zh.md`
- `CHANGELOG.md` `[3.0.2]` 发布状态行
- `docs/guides/使用手册-v3.0.0-zh.md`（头栏 + 章 2）
- `docs/spec/README.md`（3.0.2 → published）
- `README.md` / `README.zh-CN.md`（Prerequisites · 最小上手 · 空仓 required 指引 · 现行包 published · 改名脚注）
- 过程档链卫生（未入库相对链 → 路径字面量）：10/20 invoke · R1 审查文（S2 基线 38→34）

## GitHub Releases（HG-GH-RELEASE=approved）

| tag | 结果 |
|-----|------|
| `v3.0.2` | **created** · https://github.com/Cyning12/SpecWave/releases/tag/v3.0.2 · notes → CHANGELOG `[3.0.2]` · **Latest** |
| `v3.0.0` | **created** · notes → CHANGELOG `[3.0.0]` |
| `v3.0.1` | **created** · notes → CHANGELOG `[3.0.1]` |

- **未**新建 / 改写 git tag（挂既有 tag）
- 创建后曾误标 Latest=`v3.0.1` → 已 `gh release edit v3.0.2 --latest` 纠正

## 验证

| 门 | 结果 |
|----|------|
| `pins check` | **17/17 PASS** |
| `npm run typecheck` | 0 错 |
| `npm test` | 全绿（exit 0） |
| `npm run build` | exit 0 |
| `npm run test:lib` | exit 0 |
| `gh release view v3.0.2` | OK · isLatest |
| 叙事巡检 | 现行对外面无「3.0.2 待发版 / latest 仍 3.0.1」；白名单 = 手册修订史 2026-09-23 行 · 历史 checklist 措辞 · 本 active task 背景 |

## 禁令自检

- **未** `npm publish` / `npm deprecate`
- **未** 新建 / 改写 tag
- **未** 改 `src/` / init
- **未** 物化示例进 `docs/tasks/`
- **未** `git add -A` / **未** commit / **未** `task close`

## 验收勾选建议（A1–A14）

- A1–A13：建议勾（本棒完成）
- A14：四门绿（已跑）
- A15：留 40/00（gate-check · task close · 显式 add）

## 风险 / 待 40

1. verify 仍报 missing 00 invoke · 关账前补 00 过程 invoke 或调 `required_invoke_hats`
2. Dirty RELEASING 排版态已丢弃（以 HEAD 钉面格式 + 发布态真值为准）
3. 未跑 `task close`（按派单）
