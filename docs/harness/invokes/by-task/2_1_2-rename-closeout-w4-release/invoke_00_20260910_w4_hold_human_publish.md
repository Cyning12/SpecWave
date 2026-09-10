# invoke · 00 · W4 准备完成 · 等人 publish

> **hat_id**：`00` · **日期**：2026-09-10  
> **task**：`docs/tasks/active/task_2_1_2_rename_closeout_w4_release.md`（未移 done）

## 状态

- W0–W3 **CLOSE** · W4 **实现准备 DONE** · 四门绿 · `spec-wave@2.1.2` 工作树已 bump  
- **HG-PUBLISH** / **HG-DEPRECATE-HARNESS** = **pending（仅人）**  
- 本窗 **未** publish / deprecate / tag  

## 人动作（复制）

见 `RELEASING.md`「人 checklist · 2.1.2」与 `docs/roadmap/ACCEPTANCE_2_1_2_rename_closeout_2_1_2_zh.md`。

摘要：

1. 审 diff / 提交（若未提交）  
2. `git tag v2.1.2 <publish-commit>` · push tag  
3. `npm publish`（包名 `spec-wave`）  
4. 更新 `@cyning/harness` deprecate 文案 → 指向 `spec-wave`  
5. 签 HG-PUBLISH / HG-DEPRECATE-HARNESS · 通知 00 CLOSE W4  

## 已派 / 待派

- 已派 30：W1 · W2 · W3 · W4 准备  
- 待派：无（等人闸）  
- 本窗未改实现码（实现均由 30）
