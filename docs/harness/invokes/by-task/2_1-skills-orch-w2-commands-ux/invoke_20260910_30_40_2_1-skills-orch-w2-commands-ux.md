# Invoke · 30/40 · 2_1-skills-orch-w2-commands-ux

| 字段 | 值 |
|------|-----|
| task_slug | `2_1-skills-orch-w2-commands-ux` |
| hat_id | `30（含 40）` |
| opened | 2026-09-10 |
| status | **closed** |
| notes | 00 派发 · HG-AUDIT-R1=approved · W1 DONE |

## 关棒摘要（≤10 行）

1. Claude 源迁 `assets/ide/commands/claude/kit/<verb>.md`；`mvp-hosts` `from`/`target_dir` → `.claude/commands/kit`  
2. Cursor `kit-*.md` frontmatter：`name`/`id`/`description`/`kit_command_id`  
3. `cli-host` apply/update：写新布局；旧扁平 `.claude/commands/kit-*.md` **备份后删除**（`removed`）；禁双份  
4. 测：`test/host-adapt-w2-commands-ux.test.ts` 5/5 · host-adapt 全套 32/32 · typecheck 0  
5. 未碰 W3/W4/bump/publish/commit；`04` §W2 前三项已勾（R1 待 00）

## 开棒 Prompt（交给 30）

Open Folder = `dsh-coding-kit/`。读 task + R1 freeze + SPEC `02`/`03` §Claude。

实现：

1. Claude 资产迁到 `assets/ide/commands/claude/kit/<verb>.md`；适配表 `from` 更新  
2. Cursor frontmatter 补 `name`/`description`（及建议 id）  
3. apply/update：写出 `.claude/commands/kit/…`；旧扁平 `kit-*.md` 按 R1 **备份后清除**，禁双份  
4. 单测覆盖落点 + frontmatter + 迁移  
5. **禁止** W3/W4/bump/publish/commit  

回填 task 自检 + invoke 关棒 ≤10 行。

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开棒 |
| 2026-09-10 | 关棒 · 测绿 · closed |
