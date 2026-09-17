import path from 'node:path'
import { CliError, printJson } from '../../src/cli-shared.ts'
import { runCli as runCliFromMain } from '../../src/cli/main.ts'

/**
 * E3（3.0 W7 · task_3_0_w7_closeout_external · S7.2）· spawn 下沉共享 harness。
 *
 * 单实现源：本模块收敛 W0 `makeCore` 判据（test/cli-g1g7.test.ts :54 先例），
 * 供套件各文件复用；不复制判据。两层能力：
 *   ① `makeCore(fn)` —— 进程内直调被测 `cmd*`（零子进程）；console/写流捕获 +
 *      `CliError.exitCode → status`（逐字对齐 bin/exitWithCliError 行为）。
 *   ② `runCore(argv, runtime?)` —— 进程内 argv 分发（走 `src/cli/main.ts` 唯一分发器），
 *      等价 spawn `runCli`（含 exit-1 + --json 信封还原），零子进程；支持调用级 cwd/env。
 *
 * 第二参兼容两种既有调用形：string = cwd；对象 = { cwd?, env?, input? }。
 * `input`（stdin）仅登记不消费（进程内无法等价喂 stdin 的调用点须保留 spawn 烟测）。
 */
export type RunResult = {
  status: number | null
  stdout: string
  stderr: string
  combined: string
}

export type CoreRuntime = {
  cwd?: string
  env?: NodeJS.ProcessEnv
  input?: string
}

/**
 * W0 makeCore 判据（逐字保留语义）：进程内直调 `cmd*` + console 捕获 +
 * `CliError.exitCode → status` / `message → stderr`。
 */
export function makeCore(fn: (args: string[]) => Promise<void>): (args: string[]) => Promise<RunResult> {
  return (args) => withCaptured(() => fn(args))
}

async function withCaptured(call: () => Promise<void>): Promise<RunResult> {
  const out: string[] = []
  const err: string[] = []
  const origLog = console.log
  const origError = console.error
  const origWrite = process.stdout.write
  console.log = (...a: unknown[]) => {
    out.push(a.map(String).join(' '))
  }
  console.error = (...a: unknown[]) => {
    err.push(a.map(String).join(' '))
  }
  process.stdout.write = ((chunk: unknown, ...rest: unknown[]) => {
    // 仅捕获字符串写（CLI 输出全为 string）；非字符串（node --test runner 的
    // Buffer IPC 帧）透传原流，避免 runner 协议被误纳入 stdout 断言面。
    if (typeof chunk !== 'string') {
      return (origWrite as (...a: unknown[]) => boolean).call(process.stdout, chunk, ...rest)
    }
    out.push(chunk.replace(/\n$/, ''))
    return true
  }) as typeof process.stdout.write
  let status = 0
  try {
    await call()
  } catch (e) {
    if (e instanceof CliError) {
      status = e.exitCode
      if (e.message) err.push(e.message)
    } else {
      throw e
    }
  } finally {
    console.log = origLog
    console.error = origError
    process.stdout.write = origWrite
  }
  const stdout = out.length > 0 ? out.join('\n') + '\n' : ''
  const stderr = err.length > 0 ? err.join('\n') + '\n' : ''
  return { status, stdout, stderr, combined: `${stdout}\n${stderr}` }
}

/** 进程内 argv 分发：bin→CLI 全链语义（含 exit-1 + --json 信封），零子进程。 */
export async function runCore(
  argv: string[],
  runtime?: string | CoreRuntime,
  env?: NodeJS.ProcessEnv,
): Promise<RunResult> {
  const opts: CoreRuntime = typeof runtime === 'string' ? { cwd: runtime, env } : runtime ?? {}
  const prevCwd = process.cwd()
  const envBackup = { ...process.env }
  try {
    if (opts.cwd && path.resolve(opts.cwd) !== prevCwd) process.chdir(opts.cwd)
    if (opts.env) {
      // spawn env 语义 = 整体替换（既有 helper 均传 {...process.env, ...} 超集）
      for (const k of Object.keys(process.env)) delete process.env[k]
      Object.assign(process.env, opts.env)
    }
    return await withCaptured(async () => {
      try {
        await runCliFromMain(argv)
      } catch (e) {
        if (e instanceof CliError && e.exitCode === 1 && argv.includes('--json')) {
          // 还原 bin/exitWithCliError 的 exit-1 JSON 信封（单点形态与 src 逐字一致）
          const command = argv.find((a) => !a.startsWith('-')) ?? 'unknown'
          const tIdx = argv.indexOf('--target')
          const tVal = tIdx !== -1 ? argv[tIdx + 1] : undefined
          const target =
            tVal && !tVal.startsWith('-') ? path.resolve(process.cwd(), tVal) : process.cwd()
          printJson(target, { command, exitCode: 1, error: { message: e.message ?? '' } })
          // stdin/stderr 文案由 withCaptured 统一映射（CliError → status/stderr），
          // 此处重抛以保留 exitCode→status 语义（不吞错）
          throw e
        }
        throw e
      }
    })
  } finally {
    for (const k of Object.keys(process.env)) delete process.env[k]
    Object.assign(process.env, envBackup)
    if (process.cwd() !== prevCwd) process.chdir(prevCwd)
  }
}
