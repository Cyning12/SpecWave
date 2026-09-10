# Invoke · 30/40 · 2x-host-adapt-w4-dsh-u01

> **hat**：30-execute → 40-self-check  
> **task**：`docs/tasks/done/task_2x_host_adapt_w4_dsh_u01.md`  
> **日期**：2026-09-10  
> **状态**：`closed`  
> **HG-AUDIT-R1**：approved（00 代签）

---

## 30 执行要点

DSH 行 commands 可空；U-01 不匹配 → 降级提示、禁止静默写坏。见 audit freeze。

## 30 结果（2026-09-10）

- DSH：`mvp-hosts.yaml` `commands: []`；`--tools dsh --yes` exit 0；不写 `.cursor/commands` / kit-* slash；可写 `.dsh/skills`
- U-01：`sniffHostContract`（`src/host-contract.ts`）；表 version 仅 `"1"`；`dsh-tools` 空=CLI-only ok；超出 peer `>=0.0.1-rc.1 <0.2.0` → degraded
- 探测：cwd/kit `node_modules/@deepseek-ai/dsh-tools/package.json`；测钩 `DSH_CK_DSH_TOOLS_VERSION`
- CLI apply/update degraded → exit 2、零写入、文案含 `U-01`；`--json` 含 `contract.status`
- 插件：`init_coding_kit` degraded 拒绝复制；`apply_coding_standards` 可读注入带 U-01 提示
- 测：`test/host-adapt-u01.test.ts` + 既有 host-adapt 20 测；`npm run typecheck`
- 文档：CHANGELOG Unreleased 一句；README 双文件 U-01 一句
- **未 CLOSE task** · 无 bump / publish / 默认 30/40

## 40 自检（`04` §W4）

- [x] `--tools dsh` 不强制 slash  
- [x] U-01 不匹配降级 + 测覆盖零写坏  
- [x] 单测绿；CHANGELOG 一句；无 bump  
- [x] task → done；`04` §W4 勾选

## 40 结果

| 项 | 判定 | 证据 |
|----|------|------|
| DSH 不强制 slash | **pass** | `--tools dsh --yes` exit 0；不写 `.cursor/commands` / kit-* slash；表 `commands: []` 合法 |
| U-01 降级零写坏 | **pass** | U-01 6 项：嗅探 ok/degraded；表 version=99 / peer 超范围 apply+update exit 2 零写；`init_coding_kit` degraded **copied=0** |
| 单测 + 无 bump | **pass** | host-adapt **26/26** pass；包版仍 `1.12.1`；CHANGELOG Unreleased U-01 一句 |
| 关账勾选 | **pass** | task → done；invoke closed；`04` §W4 全勾；PLAN/README W4 DONE |

### 40 复跑命令（2026-09-10）

```text
node --test --experimental-strip-types test/host-adapt-u01.test.ts test/host-adapt-update.test.ts test/host-adapt-apply.test.ts test/host-adapt-validate.test.ts
→ 26 pass · exit 0
```

**结论**：W4 验收全绿；**无阻断缺陷**；未改 `src/`；**W4 CLOSE**。STOP：未 commit / publish / bump / 开 W5 src。

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 00 开棒 · 待 30 |
| 2026-09-10 | 30 完成 · 待 40；未 CLOSE task |
| 2026-09-10 | **40 CLOSE** · 自检全 pass · invoke → closed · task 迁 done |
