import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { appendAuditEvent, stampAuditEvent } from '../audit/log.ts'
import { fail, resolveTarget, takeOption } from '../cli-shared.ts'
import { isPlainObject } from './schema.ts'

/**
 * 3.0 W2 阶段三 · hook-guard 门禁分发入口（S3.3 ③ · 阶段二物化命令串的兑现体）。
 * 物化条目的 command = npx spec-wave hook-guard --trigger <t>：读宿主经 stdin 传入的事件 JSON →
 * 提取被拦截命令串（三族协议形态 · 数据驱动）→ 按 trigger 匹配（pre-commit=git commit ·
 * pre-archive=spec-wave task close）→ 命中则跑门禁 command（缺省 = 内置表 hooks.command 逐字 ·
 * --command 可覆盖）→ 门禁红 exit 2 阻断 · 未命中/放行 exit 0。
 * 非范围：不实现宿主 hook 运行时本身（被宿主运行时调用的命令 · SPEC ③ 形态）。
 * 30 裁决登记：
 *  ① 坏 stdin（非空但 JSON 解析失败 / 无 command 字段）→ **fail-open exit 0** + stderr 注记
 *    （宿主事件协议漂移不可判定时不全阻断 · cursor 非 2 退出 fail-open 口径一致 · 门禁主防线 = CLI 侧 L1+L2 机械面）；
 *  ② 空 stdin（直接调用 / 未来 shell-hook git 层无宿主事件形态）→ 按命中处理（跑门禁）；
 *  ③ cursor fail-open 注记：阻断语义精确 exit 2（非 2 = 放行）· 与物化模板文档口径一致（F-W2-06 校准位）。
 */

export const HOOK_GUARD_USAGE =
  'hook-guard --trigger pre-commit|pre-archive [--command GATE_CMD] [--target PATH]'

/** 缺省门禁命令 = 内置表 hooks.command 逐字（mvp-hosts.yaml config-hook 三宿主声明值 · w2 测试钉死联动） */
export const DEFAULT_GATE_COMMAND = 'npx spec-wave verify --target .'

export type HookTrigger = 'pre-commit' | 'pre-archive'

/** 事件 JSON → 被拦截命令串（claude PreToolUse / gemini BeforeTool = tool_input.command · cursor beforeShellExecution = 顶层 command） */
export function extractEventCommand(event: unknown): string | null {
  if (!isPlainObject(event)) return null
  const toolInput = event.tool_input
  if (isPlainObject(toolInput) && typeof toolInput.command === 'string') return toolInput.command
  if (typeof event.command === 'string') return event.command
  return null
}

/** 被拦截命令串匹配（命令串收窄 · 词界/链界符口径：git commit · [npx] spec-wave task close） */
export function commandMatchesTrigger(command: string, trigger: HookTrigger): boolean {
  if (trigger === 'pre-commit') return /(^|[\s;&|])git\s+commit([\s;&|]|$)/.test(command)
  return /(^|[\s;&|])(npx\s+)?spec-wave\s+task\s+close([\s;&|]|$)/.test(command)
}

function readStdinText(): string {
  if (process.stdin.isTTY) return ''
  try {
    return readFileSync(0, 'utf8')
  } catch {
    return ''
  }
}

/** 门禁执行（shell 形态命令串 · 门禁输出直传 stderr 供宿主阻断时呈递） */
export function runGateCommand(gateCommand: string, cwd: string): number {
  const r = spawnSync(gateCommand, {
    shell: true,
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  if (r.stdout) process.stderr.write(r.stdout)
  if (r.stderr) process.stderr.write(r.stderr)
  if (r.error) return 127
  return r.status ?? 1
}

export async function cmdHookGuard(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`用法: npx spec-wave ${HOOK_GUARD_USAGE}`)
    return
  }
  if (!args.includes('--trigger')) {
    fail(`hook-guard 须 --trigger pre-commit|pre-archive\n用法: ${HOOK_GUARD_USAGE}`)
  }
  const tIdx = args.indexOf('--trigger')
  if (tIdx + 1 >= args.length || args[tIdx + 1]!.startsWith('-')) {
    fail(`hook-guard 须 --trigger pre-commit|pre-archive\n用法: ${HOOK_GUARD_USAGE}`)
  }
  const { value: triggerArg, rest: r1 } = takeOption(args, '--trigger')
  let rest = r1
  if (triggerArg !== 'pre-commit' && triggerArg !== 'pre-archive') {
    fail(`hook-guard 未知 trigger: ${String(triggerArg)}（值域 pre-commit|pre-archive）\n用法: ${HOOK_GUARD_USAGE}`)
  }
  const trigger = triggerArg
  let gateCommand = DEFAULT_GATE_COMMAND
  if (rest.includes('--command')) {
    const cIdx = rest.indexOf('--command')
    if (cIdx + 1 >= rest.length || rest[cIdx + 1]!.startsWith('-')) {
      fail(`hook-guard --command 须跟值\n用法: ${HOOK_GUARD_USAGE}`)
    }
    const taken = takeOption(rest, '--command')
    gateCommand = taken.value!
    rest = taken.rest
  }
  const { value: targetArg, rest: r2 } = takeOption(rest, '--target')
  rest = r2
  if (rest.length > 0) fail(`hook-guard 未知参数: ${rest.join(' ')}\n用法: ${HOOK_GUARD_USAGE}`)
  const target = resolveTarget(process.cwd(), targetArg)

  const stdinText = readStdinText().trim()
  let matched: boolean
  if (stdinText.length === 0) {
    // 裁决②：空 stdin = 直接调用形态（无宿主事件可判）→ 按命中跑门禁
    matched = true
  } else {
    let event: unknown
    try {
      event = JSON.parse(stdinText)
    } catch {
      // 裁决①：坏 stdin fail-open（不崩 · 不全阻断）
      console.error('hook-guard: 宿主事件 JSON 解析失败 · 协议漂移 fail-open 放行（门禁主防线 = CLI 侧 verify）')
      return
    }
    const command = extractEventCommand(event)
    if (command === null) {
      console.error('hook-guard: 宿主事件无 command 字段 · 协议漂移 fail-open 放行（门禁主防线 = CLI 侧 verify）')
      return
    }
    matched = commandMatchesTrigger(command, trigger)
    if (!matched) {
      // 未命中：静默放行（S3.3）
      return
    }
    console.error(`hook-guard: 命中 ${trigger}（${command.trim().slice(0, 80)}）→ 跑门禁: ${gateCommand}`)
  }

  const gateStartedAt = Date.now()
  const gateStatus = runGateCommand(gateCommand, target)
  // 3.0-W6 S6.6 G7 执行证据：门禁真跑过即留证（审计轨 hook_guard 事件 · exit_code 与门禁真实出口吻合）。
  // 观测面旁路（F-W6-01 降级不阻断）；hook-guard 不设 --audit-file（内部命令面 · 落点恒默认 · 留 20 复核）。
  appendAuditEvent(
    target,
    stampAuditEvent({
      event: 'hook_guard',
      verdict: gateStatus === 0 ? 'PASS' : 'BLOCKED',
      exit_code: gateStatus,
      detail: `trigger=${trigger} · command=${gateCommand}`.slice(0, 300),
      duration_ms: Date.now() - gateStartedAt,
    }),
  )
  if (gateStatus !== 0) {
    // 阻断语义精确 exit 2（裁决③ · cursor 非 2 退出 fail-open 口径）
    console.error(`hook-guard: 门禁红（exit ${gateStatus}）· 阻断 ${trigger}`)
    process.exit(2)
  }
}
