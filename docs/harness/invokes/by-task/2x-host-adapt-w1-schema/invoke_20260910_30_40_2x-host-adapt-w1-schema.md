# Invoke · 30/40 · 2x-host-adapt-w1-schema

> **hat**：30-execute → 40-self-check  
> **task**：`docs/tasks/done/task_2x_host_adapt_w1_schema.md`  
> **日期**：2026-09-10  
> **状态**：`closed`  
> **HG-AUDIT-R1**：approved（00 代签 · `docs/harness/reviews/task_2x_host_adapt_w1_schema_audit_R1_20260910.md`）

---

## 30 执行要点

1. **先测后码**（`test_strategy=required`）  
   - 新建 `test/host-adapt-validate.test.ts`（或等价）：合法表 → 0；缺文件 → 1；schema 非法 → 2；`target`/`target_dir` 命中 S2 → 2。  
   - 测试须**可先红**再接线，禁止无测改 CLI。
2. **资产**  
   - `assets/ide/host-adapt/`：JSON Schema（或 YAML schema）+ 合法示例表（覆盖 `always_on`/`skills`/`commands` 列；MVP 宿主三角骨架即可）。  
3. **CLI**（freeze）  
   - `npx dsh-coding-kit host validate [--file PATH] [--json]`  
   - 复用 `isS2RelPath` / `S2_TRUTH_PREFIXES`；**禁止**第二份 S2 前缀表。  
   - **禁止** `host apply` 写盘。  
4. 文档：README 一句（若有入口说明处）+ `CHANGELOG` Unreleased 一句。  
5. 禁止：bump `2.0.0` · `npm publish` · 动 W2–W5 物化码 · 删 `.cyning-harness` · OpenSpec delta 主流程。

## 40 自检（对照 `04` §W1）

- [x] schema 落 `assets/ide/host-adapt/`  
- [x] `host validate` dry-run/默认可跑 exit 0（合法示例）  
- [x] 非法表非 0；S2 target → exit 2  
- [x] 相关单测绿；`npm run typecheck` 不红  
- [x] 无 `host apply`；无 publish/bump  
- [x] invoke 本文件回填结果；task 勾选/迁 done；`04` §W1 勾选；CHANGELOG 一句

## 30 结果

| 项 | 结果 |
|----|------|
| 资产 | `assets/ide/host-adapt/host-adapt.schema.json` + `examples/mvp-hosts.yaml`（dsh/cursor/claude） |
| CLI | `src/cli-host.ts` · `cli.ts` 注册 `host`；仅 `validate` |
| 单测 | `test/host-adapt-validate.test.ts` · **8/8 pass** |
| typecheck | `npm run typecheck` · **exit 0** |

### 命令与 exit（本机实测）

```text
node --test --experimental-strip-types test/host-adapt-validate.test.ts
→ 8 pass · exit 0

node --experimental-strip-types src/cli.ts host validate
→ exit 0 · HOST VALIDATE: PASS

node --experimental-strip-types src/cli.ts host validate --file /tmp/missing.yaml
→ exit 1

（非法表 / S2 target|target_dir）→ exit 2（单测覆盖）

node --experimental-strip-types src/cli.ts host apply
→ exit 1（未知子命令）
```

**未做**：`host apply` · bump · publish · CLOSE task（交 40）

## 40 结果

| 项 | 判定 | 证据 |
|----|------|------|
| schema / 示例 | **pass** | `assets/ide/host-adapt/host-adapt.schema.json` + `examples/mvp-hosts.yaml` |
| `host validate` 合法表 | **pass** | exit 0 · `HOST VALIDATE: PASS` |
| 非法表 / S2 target | **pass** | 单测 → exit 2；缺文件 → exit 1 |
| 单测 + typecheck | **pass** | 8/8 · `tsc --noEmit` exit 0 |
| 无 apply / publish / bump | **pass** | `host apply` 未知子命令；包版仍 `1.12.1`；S2 复用 `cli-shared` 单表 |
| 关账勾选 | **pass** | task → done；`04` §W1 全勾；PLAN/README W1 DONE |

### 40 复跑命令（2026-09-10）

```text
node --test --experimental-strip-types test/host-adapt-validate.test.ts
→ 8 pass · exit 0

node --experimental-strip-types src/cli.ts host validate
→ exit 0 · HOST VALIDATE: PASS

npm run typecheck
→ exit 0
```

**结论**：W1 验收全绿；**无阻断缺陷**；未改 `src/`；**W1 CLOSE**。

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 00 开棒 · 待 30 |
| 2026-09-10 | 30 完成 · 待 40 自检 |
| 2026-09-10 | **40 CLOSE** · 自检全 pass · invoke → closed · task 迁 done |
