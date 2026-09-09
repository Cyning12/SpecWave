# Invoke · 30/40 · 1x-mvp-w1-s2-truth

> **hat**：30-execute → 40-self-check  
> **task**：`docs/tasks/active/task_1x_mvp_w1_s2_truth.md`  
> **日期**：2026-09-09  
> **HG-AUDIT-R1**：approved（00 代签）

---

## 30 执行要点

1. **W1.1 并集冻结**（相对路径 · 无尾斜杠）
   - `docs/tasks`
   - `docs/harness/reviews`
   - `docs/harness/invokes/by-task`
   - `reviews`（legacy）
   - `invokes/by-task`（legacy）
2. 在 `cli-shared.ts` 导出 `S2_TRUTH_PREFIXES` + `isS2RelPath` + `isS2AbsPath`（`.dsh/skills` 白名单）+ `assertNotS2Abs`。
3. **先**落 `test/s2-truth-source.test.ts`，再改四锚点。
4. 禁止 bump / publish。

## 40 自检

- [x] typecheck
- [x] s2-truth-source 测绿
- [x] init / upgrade / refresh S2 相关不红
- [x] src 无第二份前缀列表

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-09 | 开棒 |

| 2026-09-09 | 30/40 完成 · typecheck + 73 相关测绿 · CLOSE exempt → done/ |
