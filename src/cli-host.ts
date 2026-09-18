/**
 * host 子命令（2.x W1–W4）：validate + apply + update。
 * apply：always_on + commands(core|expanded) + skills（跳过 30/40）。
 * update：刷新产品 commands/skills；conflict 默认不覆盖（`--force` 显式）。
 * U-01：契约嗅探不匹配 → exit 2 零写入。
 * 2.1.1 W1：`.coding-kit/host-tools.json` 粘性；`--tools all`；成功 --yes 写粘性。
 * 2.1.1 W2：`host update` 解析序 A — CLI `--tools` → 粘性 → 否则 exit 1。
 * 2.1.1 W3：`init --tools` 同进程可调用 `cmdHost(['apply', …])`（勿 shell 自调）。
 * 本波禁止：bump / publish / 默认分发 30/40 / onboard / kit-30 slash。
 * 3.0 W0（E4 · task_3_0_w0_refactor_prep 模块边界定稿表）：实现搬迁至 src/host/*
 * （table / sticky / schema / commands / materialize / backup / report / cmd），
 * 本文件降级为纯 barrel——re-export 全部 9 个既有导出，消费者一行不改（D-30-BARREL · 零行为变更）；
 * sniffHostContract 系 ./host-contract.ts 的 re-export，直留 barrel 不归新模块（定稿差异 D3）。
 */
export { sniffHostContract } from './host-contract.ts'
export { listKnownHostIds } from './host/table.ts'
export type { HostToolsSticky, HostToolsTableSource } from './host/sticky.ts'
export {
  buildTableSourceForSticky,
  loadHostToolsSticky,
  parseHostToolsSticky,
  writeHostToolsSticky,
} from './host/sticky.ts'
export { validateHostAdaptDoc } from './host/schema.ts'
export type { HostValidateIssue } from './host/schema.ts'
export { cmdHost } from './host/cmd.ts'
