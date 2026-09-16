// 3.0 W0（E4 · task_3_0_w0_refactor_prep 模块边界定稿表）：实现搬迁至 src/cli/*
//（main / usage / init / gates / verify / task-cmd），本文件降级为纯 barrel——
// re-export 全部 7 个既有导出（runCli / exitWithCliError 为 bin 冻结面 ·
// bin/specgate.js 与 bin/dsh-coding-kit.js 经 ../lib/cli.js 消费 · 消费者一行不改）。
// 自举块（isMain + if (isMain())）直留本文件：import.meta.url 自指语义须以本文件
// 路径为判基（node src/cli.ts 直跑与 node lib/cli.js 入口行为不变 · 零行为变更硬约束）。
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { exitWithCliError, runCli } from './cli/main.ts'

export { runCli, exitWithCliError } from './cli/main.ts'
export { INIT_QUICKSTART, isInteractiveInit, parseInitToolsArg, promptInitTools } from './cli/init.ts'
export type { InitToolsSelection } from './cli/init.ts'

function isMain(): boolean {
  const entry = process.argv[1]
  if (!entry) return false
  try {
    const resolved = path.resolve(entry)
    const self = fileURLToPath(import.meta.url)
    if (resolved === self) return true
    return path.basename(resolved) === path.basename(self)
  } catch {
    return false
  }
}

if (isMain()) {
  runCli(process.argv.slice(2)).catch((err: unknown) => {
    exitWithCliError(err, process.argv.slice(2))
  })
}
