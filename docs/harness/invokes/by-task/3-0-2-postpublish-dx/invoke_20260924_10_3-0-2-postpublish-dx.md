# invoke · 10-task · 3-0-2-postpublish-dx

> **hat_id**：`10-task` · **日期**：2026-09-24  
> **task_slug**：`3-0-2-postpublish-dx`  
> **性质**：post-publish DX 起草（P0 回填已 published + Prerequisites + GH Release · P1 README 收敛 · 无 src）

## 产出

- `docs/tasks/active/task_3_0_2_postpublish_dx.md`（草稿 · 闸表 4 列 · HG-GH-RELEASE · HG-RELEASE-PUBLISH=N/A · R0–R5 · A1–A15）

## 裁决摘要

1. **单 task** 覆盖 P0+P1（不拆波）
2. `test_strategy=recommended`（无 src 红测；RELEASING 双重敏感仍强制全量 test）
3. GitHub Release：硬勾 `v3.0.2` · **建议同波** `v3.0.0`/`v3.0.1`（A10 可 defer）
4. 默认 **不改** `init` / `src/`；Dirty `RELEASING.md` 以发布态真值为准
5. S2：禁物化示例进消费者 `docs/tasks/`

## 机械闸

- `node bin/specgate.js task lint --file docs/tasks/active/task_3_0_2_postpublish_dx.md` → **PASS**（2026-09-24）

## 交接

- 下一棒：20-task-audit R1 → 人签 HG-TASK-DRAFT / HG-AUDIT-R1 → 30/40 docs · HG-GH-RELEASE 签后 `gh release create`
