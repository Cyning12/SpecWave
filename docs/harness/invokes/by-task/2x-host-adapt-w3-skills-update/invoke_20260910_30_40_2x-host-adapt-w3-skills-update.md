# Invoke · 30/40 · 2x-host-adapt-w3-skills-update

> **hat**：30-execute → 40-self-check  
> **task**：`docs/tasks/done/task_2x_host_adapt_w3_skills_update.md`  
> **日期**：2026-09-10  
> **状态**：`closed`  
> **HG-AUDIT-R1**：approved（00 代签）

---

## 30 执行要点

`host update`：刷新产品 commands/skills；conflict 默认不覆盖；`--force` 显式；skills 落点与 `skills install` 矩阵成文；不默认 30/40。

## 30 结果（2026-09-10）

- 落地：`host update` 默认 dry-run；`--yes` 写 add / 同内容 skip；conflict skip；`--force --yes` 覆盖并备份 `.coding-kit/backups/host-update/`（5 代）
- skills：表含 dsh/cursor/claude/**agents**；源 `assets/skills/*`；跳过 30/40（`isExecuteHatSkipped`）；矩阵 `assets/ide/host-adapt/README.md`
- `host apply` W3 起同步物化 skills；W2 测保持
- 测：`host-adapt-update` + `host-adapt-apply` + `host-adapt-validate`；`npm run typecheck`
- 文档：README 双文件 usage · CHANGELOG Unreleased 一句
- **未 CLOSE task** · 无 bump / publish

## 40 自检（`04` §W3）

- [x] skills 行进表（含 agents）且 README 矩阵成文  
- [x] `host update` 刷新 commands/skills；conflict 默认不覆盖  
- [x] 单测绿；无 bump/publish；CHANGELOG 一句  
- [x] task → done；`04` §W3 勾选

## 40 结果

| 项 | 判定 | 证据 |
|----|------|------|
| skills 行 + 矩阵 | **pass** | `mvp-hosts.yaml` 含 dsh/cursor/claude/**agents**；`assets/ide/host-adapt/README.md` 成文 |
| `host update` + conflict | **pass** | 默认 dry-run；`--yes` add/skip；conflict 无 `--force` 不覆盖；`--force --yes` 备份后覆盖 |
| 默认跳过 30/40 | **pass** | 单测：物化 skills 不出现 `harness-30-execute` / `harness-40-self-check` |
| 单测 + 无 bump | **pass** | host-adapt 20/20 pass；包版仍 `1.12.1`；CHANGELOG Unreleased 一句 `host update` |
| 关账勾选 | **pass** | task → done；invoke closed；`04` §W3 全勾；PLAN/README W3 DONE |

### 40 复跑命令（2026-09-10）

```text
node --test --experimental-strip-types test/host-adapt-update.test.ts test/host-adapt-apply.test.ts test/host-adapt-validate.test.ts
→ 20 pass · exit 0
```

**结论**：W3 验收全绿；**无阻断缺陷**；未改 `src/`；**W3 CLOSE**。STOP：未 commit / publish / bump / 开 W4 src。

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 00 开棒 · 待 30 |
| 2026-09-10 | 30 完成 · 待 40；未 CLOSE task |
| 2026-09-10 | **40 CLOSE** · 自检全 pass · invoke → closed · task 迁 done |
