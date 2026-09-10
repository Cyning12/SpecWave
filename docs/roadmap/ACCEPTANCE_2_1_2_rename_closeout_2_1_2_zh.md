# 验收档 · 2.1.2 · SpecWave 改名收口

> **包**：`spec-wave@2.1.2`（**published**）  
> **状态**：**CLOSED** · **HG-PUBLISH=approved** · **HG-DEPRECATE-HARNESS=approved**（人已执行 · 00 2026-09-10 核验落表）  
> **规划**：[`PLAN_2_1_2_rename_closeout_v1_zh.md`](./PLAN_2_1_2_rename_closeout_v1_zh.md)  
> **SPEC**：[`../spec/2_1_2-rename-closeout/`](../spec/2_1_2-rename-closeout/)  
> **task**：[`../tasks/done/task_2_1_2_rename_closeout_w4_release.md`](../tasks/done/task_2_1_2_rename_closeout_w4_release.md)

---

## Waves

| Wave | 结论 |
|------|------|
| W0 | **DONE** · 签收 |
| W1 | **DONE** · CLI 身份 + MIGRATION/RELEASING |
| W2 | **DONE** · assets / README / AGENTS |
| W3 | **DONE** · init `--yes` 非交互 |
| W4 | **DONE** · bump · tag `v2.1.2` · publish · deprecate 链切断 |

---

## 产品验收 A1–A8

| # | 条款 | 状态 |
|---|------|------|
| A1 | `git show v2.1.2:package.json` → `name=spec-wave` · `version=2.1.2` | **PASS** |
| A2 | `npm view spec-wave version` → `2.1.2` | **PASS** · `latest=2.1.2` |
| A3 | MIGRATION/README 明示 `dsh-coding-kit` deprecated · 直达 `spec-wave` | **PASS** |
| A4 | `@cyning/harness` deprecate 文案含 `spec-wave` | **PASS** · 人已执行 |
| A5 | help 首行 SpecWave；status 无矛盾 | **PASS** |
| A6 | assets / README DSH 入口 | **PASS** |
| A7 | `init --yes` 无 tools → exit 1 不挂起 | **PASS** |
| A8 | 三 bin · A 类保留 | **PASS** |

---

## 人 checklist（已完成）

1. [x] commit（`0af1dde`）  
2. [x] `git tag v2.1.2`  
3. [x] `npm publish`（E409 二次 publish = 已 staged；registry 确认 `2.1.2`）  
4. [x] 探针 PASS  
5. [x] `@cyning/harness` + `dsh-coding-kit` deprecate 文案改指 `spec-wave@2.1.2`  
6. [x] HG-PUBLISH / HG-DEPRECATE-HARNESS **approved**  
7. [x] 本档归档 · W4 CLOSE  

### registry 核验（00 · 2026-09-10）

```text
npm view spec-wave version → 2.1.2
npm view @cyning/harness deprecated → … use spec-wave … pin spec-wave@2.1.2 …
npm view dsh-coding-kit deprecated → Package renamed to spec-wave@2.1.2 …
```

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | W4 草稿 |
| 2026-09-10 | 四门绿 · publish pending |
| 2026-09-10 | **CLOSED** · 人 publish + deprecate · 00 核验落表 |
