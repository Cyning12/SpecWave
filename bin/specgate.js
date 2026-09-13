#!/usr/bin/env node
import { exitWithCliError, runCli } from '../lib/cli.js'

// 2.3-W3 ②（D-23-W3-ENVELOPE）：错误出口单一实现源在 lib/cli.js
// （exit 1 用法错 + --json → stdout JSON 信封 · 与 src 直跑同口径）
runCli(process.argv.slice(2)).catch((err) => {
  exitWithCliError(err, process.argv.slice(2))
})
