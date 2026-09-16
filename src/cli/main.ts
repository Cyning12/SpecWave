import path from 'node:path'
import { fail, printJson } from '../cli-shared.ts'
import { cmdGraph } from '../cli-graph.ts'
import { cmdHost } from '../cli-host.ts'
import { cmdRefreshIdeBlocks } from '../cli-refresh-ide-blocks.ts'
import { cmdDiscipline, cmdLifecycle } from '../cli-lifecycle.ts'
import { cmdSkills } from '../cli-skills.ts'
import { cmdStatus, cmdTimeline } from '../cli-status.ts'
import { cmdSync } from '../cli-sync.ts'
import { cmdAssets } from '../cli-assets.ts'
import { cmdPins } from '../cli-pins.ts'
import { cmdWiki } from '../cli-wiki.ts'
import { readPkgVersion, usage } from './usage.ts'
import { cmdInit, cmdUpgrade } from './init.ts'
import { cmdAudit, cmdCheck, cmdGateCheck } from './gates.ts'
import { cmdVerify } from './verify.ts'
import { cmdTask } from './task-cmd.ts'

export async function runCli(argv: string[]): Promise<void> {
  const pkgVersion = await readPkgVersion()
  if (argv.length === 0 || argv[0] === '-h' || argv[0] === '--help') {
    usage(pkgVersion)
    return
  }
  if (argv.includes('--version') || argv.includes('-V')) {
    console.log(pkgVersion)
    return
  }
  const [cmd, ...rest] = argv
  if (cmd === 'init') {
    await cmdInit(rest, pkgVersion)
    return
  }
  if (cmd === 'upgrade') {
    await cmdUpgrade(rest, pkgVersion)
    return
  }
  if (cmd === 'check') {
    await cmdCheck(rest, pkgVersion)
    return
  }
  if (cmd === 'refresh-ide-blocks') {
    await cmdRefreshIdeBlocks(rest)
    return
  }
  if (cmd === 'audit') {
    await cmdAudit(rest)
    return
  }
  if (cmd === 'gate-check') {
    await cmdGateCheck(rest)
    return
  }
  if (cmd === 'verify') {
    await cmdVerify(rest)
    return
  }
  if (cmd === 'task') {
    await cmdTask(rest)
    return
  }
  if (cmd === 'status') {
    await cmdStatus(rest)
    return
  }
  if (cmd === 'timeline') {
    await cmdTimeline(rest)
    return
  }
  if (cmd === 'lifecycle') {
    await cmdLifecycle(rest)
    return
  }
  if (cmd === 'discipline') {
    await cmdDiscipline(rest)
    return
  }
  if (cmd === 'skills') {
    await cmdSkills(rest)
    return
  }
  if (cmd === 'host') {
    await cmdHost(rest)
    return
  }
  if (cmd === 'sync') {
    await cmdSync(rest)
    return
  }
  if (cmd === 'graph') {
    await cmdGraph(rest)
    return
  }
  if (cmd === 'wiki') {
    await cmdWiki(rest)
    return
  }
  if (cmd === 'pins') {
    await cmdPins(rest)
    return
  }
  if (cmd === 'assets') {
    await cmdAssets(rest)
    return
  }
  fail(`未知命令: ${cmd}\n`)
}

/**
 * 统一 CLI 错误出口（src 直跑 isMain 与 bin/\*.js 发布入口共用 · 单一实现源）。
 * 2.3-W3 ②（D-23-W3-ENVELOPE · [A]W3-P2）：exit 1 用法错 + --json → stdout 补 JSON 信封
 * （command / exitCode / error.message · message 为相对化后全文）。单点收口覆盖全部
 * 命令与参数解析前错误（F-W3-02）；stderr 人类文案保持；exit 码不变；
 * 成功档/BLOCKED 档既有 payload 键集一字不动（只增不改作用于新增档）。
 */
export function exitWithCliError(err: unknown, argv: string[]): never {
  const e = err as { message?: string; exitCode?: number }
  const exitCode = typeof e.exitCode === 'number' ? e.exitCode : 1
  if (exitCode === 1 && argv.includes('--json')) {
    const command = argv.find((a) => !a.startsWith('-')) ?? 'unknown' // F-W3-07 兜底
    // 2.4.1 NEW-2（R1 §3-3 增量纳入）：exit-1 信封基参同取命令 target —— argv 携 --target 则
    // 以其（cwd 解析）为基，缺省回落 cwd；error.message 内嵌仓内绝对路径经统一出口剥前缀
    const tIdx = argv.indexOf('--target')
    const tVal = tIdx !== -1 ? argv[tIdx + 1] : undefined
    const target = tVal && !tVal.startsWith('-') ? path.resolve(process.cwd(), tVal) : process.cwd()
    printJson(target, { command, exitCode: 1, error: { message: e.message ?? '' } })
  }
  if (e.message) console.error(e.message)
  process.exit(exitCode)
}
