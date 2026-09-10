# 验收草稿 · 2.1.2 · SpecWave 改名收口

> **包**：`spec-wave@2.1.2`  
> **状态**：**W4 准备中 / 待人 publish**（**未**声称 `HG-PUBLISH=approved` · **未** published）  
> **规划**：[`PLAN_2_1_2_rename_closeout_v1_zh.md`](./PLAN_2_1_2_rename_closeout_v1_zh.md)  
> **SPEC**：[`../spec/2_1_2-rename-closeout/`](../spec/2_1_2-rename-closeout/) · 验收条款见 [`05_waves_and_acceptance_v1.md`](../spec/2_1_2-rename-closeout/05_waves_and_acceptance_v1.md)  
> **溯源 SPEC**：[`01_release_traceability_v1.md`](../spec/2_1_2-rename-closeout/01_release_traceability_v1.md)  
> **task**：[`../tasks/active/task_2_1_2_rename_closeout_w4_release.md`](../tasks/active/task_2_1_2_rename_closeout_w4_release.md)

---

## Waves

| Wave | 结论 |
|------|------|
| W0 | DONE · 签收 |
| W1 | DONE · CLI 身份 + MIGRATION/RELEASING |
| W2 | DONE · assets / README / AGENTS |
| W3 | DONE · init `--yes` 非交互 |
| W4 | **准备中** · bump/钉点/四门/本草稿 · **publish 仅人** |

---

## 产品验收 A1–A8

| # | 条款 | 状态 |
|---|------|------|
| A1 | `git show v2.1.2:package.json` → `name=spec-wave` · `version=2.1.2` | **pending**（等人 `git tag v2.1.2`） |
| A2 | `npm view spec-wave version` → `2.1.2` | **pending**（等人 `npm publish` · `HG-PUBLISH`） |
| A3 | MIGRATION/README 明示 `dsh-coding-kit` deprecated · 直达 `spec-wave@2.1.2` | **PASS（仓内）** · registry 发版后复核 |
| A4 | `@cyning/harness` deprecate 文案含 `spec-wave` | **pending**（仅人 · `HG-DEPRECATE-HARNESS`） |
| A5 | `npx spec-wave --help` 首行现名；status 无「当前=dsh-coding-kit」矛盾 | **PASS（仓内 · W1）** |
| A6 | 审查 assets 必清清单无同文件新旧矛盾；README DSH 入口为 `spec-wave` | **PASS（仓内 · W2）** |
| A7 | `init --yes`（无 `--tools`）exit 1 且不挂起 | **PASS（仓内 · W3）** |
| A8 | 三 bin 仍可用；A 类保留项未误删 | **PASS（仓内 · 回归）** |

---

## 仓内准备（Agent 可做 · 本轮）

| 项 | 状态 |
|----|------|
| `package.json` version=`2.1.2` | [x] |
| ontology / discipline / README 钉点 | [x] |
| CHANGELOG `[2.1.2]` 节 | [x] |
| 四门：typecheck → test → build → test:lib | [x] · FOUR_GATES_EXIT=0 |
| 本 ACCEPTANCE 草稿 | [x] |

---

## 人 checklist（**仅人** · Agent 禁止执行）

路径真值亦见 [`RELEASING.md`](../../RELEASING.md)「人 checklist · `2.1.2`」。

1. [ ] 工作树 commit 干净（含 bump · CHANGELOG · 钉点）  
2. [ ] `git tag v2.1.2 <publish-commit>`（**禁止** `git tag -f`）  
3. [ ] `npm publish`（`spec-wave@2.1.2`）  
4. [ ] 探针：`git show v2.1.2:package.json` · `npm view spec-wave version`  
5. [ ] 更新 `@cyning/harness` deprecate 文案指向 **`spec-wave`**（勿以废弃中间包为终点）  
6. [ ] 签 **`HG-PUBLISH`** · **`HG-DEPRECATE-HARNESS`**（task 表 · 仅人）  
7. [ ] 回填本档 A1/A2/A4 + Waves W4 → published；派 00 CLOSE（移 `done/`）

### 建议 deprecate 文案（人改写后执行）

```text
DEPRECATED: use spec-wave instead. See https://github.com/Cyning12/SpecWave/blob/main/MIGRATION.md — pin spec-wave@2.1.2 and run: npx spec-wave upgrade --yes
```

---

## 史实注记（2.1.1）

| 对象 | 说明 |
|------|------|
| tag `v2.1.1` | 改名前 `dsh-coding-kit` 身份 · **保留不动** |
| npm `spec-wave@2.1.1` | 改名后身份 · **保留不动** |
| `2.1.2` | 首个目标「tag ↔ npm 同 commit」可溯源点 |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | W4 草稿 · A1/A2/A4 pending · 仓内项待四门勾选 |
| 2026-09-10 | 四门绿 · 仓内准备项齐 · publish 仍 pending |
