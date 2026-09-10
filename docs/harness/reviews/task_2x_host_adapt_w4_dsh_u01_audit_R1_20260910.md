# Task Audit R1：2x-host-adapt-w4-dsh-u01

> **task**：`docs/tasks/active/task_2x_host_adapt_w4_dsh_u01.md`  
> **日期**：2026-09-10  
> **角色**：20-task-audit（00 代签）  
> **对照**：SPEC `00` F6-C/D · `04` §W4 · 依赖 W3 **DONE**

---

## 结论

| 项 | 判定 |
|----|------|
| 验收可测 | 是（`--tools dsh` 空 commands 成功；契约不匹配 → 降级且零写坏） |
| failure_paths | 是（W4-01 写盘须红；W4-02 强迫 DSH slash 打回） |
| **签收** | **HG-AUDIT-R1=approved** · 可 30 |

---

## Freeze

| ID | 冻结值 |
|----|--------|
| DSH 行 | commands 允许 `[]`；skills → `.dsh/skills`；`--tools dsh` apply/update **不得**因无 slash 失败，也 **不得**伪造 kit-* 进 DSH |
| U-01 纯函数 | 导出 `sniffHostContract(...)`（建议 `src/cli-host.ts` 或 `src/host-contract.ts`）：输入 table `version`、可选探测到的 `dsh-tools` semver、kit `peerDependencies` 范围；输出 `{ status: 'ok' \| 'degraded', reasons: string[] }` |
| 表版本 | 仅支持 `"1"`；其它 → degraded / apply·update **exit 2 零写入** |
| 宿主 peer | 若探测到 `@deepseek-ai/dsh-tools` 且 **超出** `package.json` peer 范围 → degraded |
| 探测 | 读 `node_modules/@deepseek-ai/dsh-tools/package.json`（缺失 = CLI-only → **ok**，不降级） |
| 测试钩子 | `DSH_CK_DSH_TOOLS_VERSION` 覆盖探测值（仅测） |
| 插件 `apply(ctx)` | degraded 时：仍可注册工具，但 `init_coding_kit` **拒绝复制**（返回降级文案、copied=0）；禁止静默写盘 |
| CLI | apply/update 在 degraded → **exit 2**、stdout/stderr 含 `U-01` 或 `degraded` 可读原因；`--json` 含 `contract.status` |
| 非范围 | copilot/codex 全表 · bump 2.0 |

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | R1 通过 · 00 代签 |
