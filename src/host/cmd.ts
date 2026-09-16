import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import {
  fail,
  findGitRoot,
  packageRoot,
  printJson,
  resolveTarget,
  takeOption,
  toRel,
} from '../cli-shared.ts'
import { evaluateHostContract } from '../host-contract.ts'
import { yamlLoad } from '../yaml.ts'
import {
  commandSetsOf,
  explicitHooksHostIdsOf,
  resolveValidateFile,
  resolvedHostRows,
} from './table.ts'
import { validateHostAdaptDocDispatch } from './schema.ts'
import { loadHostToolsSticky, uniqueKeepOrder, writeHostToolsSticky } from './sticky.ts'
import { assertHostProfile, findLegacyClaudeFlatCommands } from './commands.ts'
import { commitPlannedWrites, planApply, remapUpdateConflicts } from './materialize.ts'
import { checkPlannedItem, isVerifyRed, type HostVerifyCheck } from './verify.ts'
import type { ResolvedHostRow } from './resolve.ts'
import {
  emitHostFail,
  emitU01Degraded,
  printHostHuman,
  tableVersionOf,
  type HostWriteReport,
} from './report.ts'

const HOST_USAGE =
  'host validate [--file PATH] [--target PATH] [--json]\n  host apply --tools LIST|all [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes]\n  host update [--tools LIST|all] [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes] [--force]\n  host verify [--tools LIST|all] [--profile core|expanded] [--target PATH] [--file PATH] [--json]'

const APPLY_USAGE =
  'host apply --tools cursor,claude|all [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes]'

const UPDATE_USAGE =
  'host update [--tools LIST|all] [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes] [--force]'

const VERIFY_USAGE =
  'host verify [--tools LIST|all] [--profile core|expanded] [--target PATH] [--file PATH] [--json]'

/**
 * 解析 --tools LIST|all（`none` 仅 init，apply/update 拒）。
 * `all` = 适配表全部 host_id（表顺序）。
 */
function resolveToolsList(
  toolsArg: string,
  knownIds: string[],
  cmd: string,
  usage: string,
): string[] {
  const tokens = uniqueKeepOrder(
    toolsArg
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  )
  if (tokens.length < 1) {
    fail(`${cmd} 须 --tools LIST|all（逗号分隔 host_id）\n用法: ${usage}`)
  }
  if (tokens.includes('none')) {
    fail(`${cmd} 不支持 --tools none（仅 init）\n用法: ${usage}`)
  }
  if (tokens.includes('all')) {
    if (tokens.length !== 1) {
      fail(`${cmd} --tools all 不可与其它 host_id 混用\n用法: ${usage}`)
    }
    return uniqueKeepOrder(knownIds)
  }
  return tokens
}

/**
 * 显式降级宿主（3.0 W2 阶段二 · S3.5 验收 #6）：toolIds 中显式声明 hooks {mechanism:none} 者。
 * v1/外部表未声明缺省 none 不在此列（explicitHooksHostIdsOf = [] ⇒ 静默零行为变化 · 30 裁决④）。
 */
function degradedNoneHosts(
  toolIds: string[],
  rows: ResolvedHostRow[],
  explicitIds: string[],
): string[] {
  const explicit = new Set(explicitIds)
  const byId = new Map(rows.map((r) => [r.host_id, r]))
  return toolIds.filter(
    (id) => explicit.has(id) && byId.get(id)?.surfaces.hooks.mechanism === 'none',
  )
}

function takeOptionalFlag(
  args: string[],
  name: string,
  usage: string,
  cmd = 'host apply',
): { value: string | undefined; rest: string[] } {
  const idx = args.indexOf(name)
  if (idx === -1) return { value: undefined, rest: args }
  if (idx + 1 >= args.length || args[idx + 1]!.startsWith('-')) {
    fail(`${cmd} ${name} 须跟值\n用法: ${usage}`)
  }
  return takeOption(args, name)
}

async function cmdHostValidate(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`用法: npx spec-wave ${HOST_USAGE}`)
    return
  }
  const json = args.includes('--json')
  let rest = args.filter((a) => a !== '--json')
  // --file 出现但无值 → 用法错误 exit 1
  const fileIdx = rest.indexOf('--file')
  if (fileIdx !== -1 && (fileIdx + 1 >= rest.length || rest[fileIdx + 1]!.startsWith('-'))) {
    fail(`host validate 须 --file PATH\n用法: ${HOST_USAGE}`)
  }
  const { value: fileArg, rest: r1 } = takeOption(rest, '--file')
  rest = r1
  // 2.4.1 NEW-2 接口面定稿（10 棒建议 · 20 审确认）：补 --target（additive · 缺省 cwd 兼容
  // 既有无参调用 · 与 verify/pins 等命令面一致）——--json 基参与相对化口径统一取命令 target
  const { value: targetArg, rest: r2 } = takeOption(rest, '--target')
  rest = r2
  if (rest.length > 0) fail(`host validate 未知参数: ${rest.join(' ')}\n用法: ${HOST_USAGE}`)

  const target = resolveTarget(process.cwd(), targetArg)
  const abs = resolveValidateFile(fileArg)
  if (!existsSync(abs)) {
    fail(`host validate 文件不存在: ${abs}`)
  }
  // 2.4.2 R-1（验收报告-SpecWave-2.4.1 §3.2）：缺省基改取 --file 所在仓根（findGitRoot 上溯 ·
  // 与 task lint/close 2.4.1 修法同口径）——缺省 cwd 在跨目录调用下无法相对化（绝对泄漏病根）；
  // --target 显式传入仍以 target 为准（2.4.1 接口面不动 · F-P3-08）；
  // 仓外文件（上溯为 null）不打印绝对路径：JSON 标 outside_repo: true + file 取 basename 占位
  //（键集只增合规 · 校验行为照常），人类输出同口径占位。
  const fileRepoRoot = targetArg !== undefined ? target : findGitRoot(path.dirname(abs))
  const outsideRepo = targetArg === undefined && fileRepoRoot === null
  const base = fileRepoRoot ?? target
  const fileOut = outsideRepo ? path.basename(abs) : abs
  const outsideField = outsideRepo ? { outside_repo: true } : {}

  let data: unknown
  try {
    data = yamlLoad(readFileSync(abs, 'utf8'))
  } catch (err) {
    const msg = `YAML 解析失败: ${(err as Error).message}`
    if (json) {
      printJson(base, {
        command: 'host validate',
        file: fileOut,
        ...outsideField,
        ok: false,
        verdict: 'FAIL',
        errors: [{ path: '$', code: 'parse', message: msg }],
      })
    } else {
      console.error(msg)
      console.log('HOST VALIDATE: FAIL')
    }
    fail('', 2)
  }

  const issues = validateHostAdaptDocDispatch(data)
  if (issues.length > 0) {
    if (json) {
      printJson(base, {
        command: 'host validate',
        file: fileOut,
        ...outsideField,
        ok: false,
        verdict: 'FAIL',
        errors: issues,
      })
    } else {
      for (const e of issues) {
        console.error(`  - [${e.code}] ${e.path}: ${e.message}`)
      }
      console.log('HOST VALIDATE: FAIL')
    }
    fail('', 2)
  }

  if (json) {
    printJson(base, {
      command: 'host validate',
      file: fileOut,
      ...outsideField,
      ok: true,
      verdict: 'PASS',
    })
    return
  }
  // 2.4-W3 + 2.4.2 R-1：人类输出路径值同口径相对化（基与 JSON 面同一 · 仓外占位不打印绝对路径）
  console.log(`file: ${outsideRepo ? fileOut + '（仓外文件 · outside_repo · 不打印绝对路径）' : toRel(base, abs)}`)
  console.log('HOST VALIDATE: PASS')
}

async function cmdHostApply(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`用法: npx spec-wave ${APPLY_USAGE}`)
    return
  }
  const yes = args.includes('--yes')
  const dryRunFlag = args.includes('--dry-run')
  const json = args.includes('--json')
  if (yes && dryRunFlag) {
    fail(`host apply: --yes 与 --dry-run 不可同现\n用法: ${APPLY_USAGE}`)
  }
  let rest = args.filter((a) => a !== '--yes' && a !== '--dry-run' && a !== '--json')
  if (!rest.includes('--tools')) {
    fail(`host apply 须 --tools LIST|all（逗号分隔 host_id）\n用法: ${APPLY_USAGE}`)
  }
  const toolsIdx = rest.indexOf('--tools')
  if (toolsIdx + 1 >= rest.length || rest[toolsIdx + 1]!.startsWith('-')) {
    fail(`host apply 须 --tools LIST|all\n用法: ${APPLY_USAGE}`)
  }
  const { value: toolsArg, rest: rTools } = takeOption(rest, '--tools')
  rest = rTools
  const { value: profileArg, rest: rProfile } = takeOptionalFlag(rest, '--profile', APPLY_USAGE)
  rest = rProfile
  const { value: targetArg, rest: rTarget } = takeOptionalFlag(rest, '--target', APPLY_USAGE)
  rest = rTarget
  const { value: fileArg, rest: rFile } = takeOptionalFlag(rest, '--file', APPLY_USAGE)
  rest = rFile
  if (rest.length > 0) fail(`host apply 未知参数: ${rest.join(' ')}\n用法: ${APPLY_USAGE}`)

  const profile = profileArg ?? 'core'
  assertHostProfile(profile, 'host apply', APPLY_USAGE)

  const target = resolveTarget(process.cwd(), targetArg)
  if (!existsSync(target) || !statSync(target).isDirectory()) {
    fail(`host apply target 不存在或不是目录: ${target}`)
  }

  const fileAbs = resolveValidateFile(fileArg)
  if (!existsSync(fileAbs)) fail(`host apply 文件不存在: ${fileAbs}`)

  const mode: 'dry-run' | 'apply' = yes ? 'apply' : 'dry-run'
  const baseReport = {
    command: 'host apply' as const,
    mode,
    hosts: [] as string[],
    planned: [] as string[],
    written: [] as string[],
    skipped: [] as string[],
    conflict: [] as string[],
    removed: [] as string[],
    backup: null as string | null,
    degraded_none: [] as string[],
  }

  let data: unknown
  try {
    data = yamlLoad(readFileSync(fileAbs, 'utf8'))
  } catch (err) {
    const msg = `YAML 解析失败: ${(err as Error).message}`
    emitHostFail(json, 'host apply', target, { ...baseReport, errors: [{ path: '$', code: 'parse', message: msg }] }, [msg])
  }

  const issues = validateHostAdaptDocDispatch(data)
  if (issues.length > 0) {
    emitHostFail(
      json,
      'host apply',
      target,
      { ...baseReport, errors: issues },
      issues.map((e) => `  - [${e.code}] ${e.path}: ${e.message}`),
    )
  }

  const rows = resolvedHostRows(data)
  const knownIds = rows.map((r) => r.host_id)
  const known = new Set(knownIds)
  const toolIds = resolveToolsList(toolsArg ?? '', knownIds, 'host apply', APPLY_USAGE)
  baseReport.hosts = toolIds
  baseReport.degraded_none = degradedNoneHosts(toolIds, rows, explicitHooksHostIdsOf(data))
  const unknown = toolIds.filter((id) => !known.has(id))
  if (unknown.length > 0) {
    fail(`host apply 未知 host_id: ${unknown.join(', ')}\n用法: ${APPLY_USAGE}`)
  }

  const contract = evaluateHostContract(tableVersionOf(data))
  if (contract.status === 'degraded') {
    emitU01Degraded(json, 'host apply', target, baseReport, contract)
  }

  const commandSets = commandSetsOf(data)
  const { items, s2 } = planApply({
    target,
    rows,
    toolIds,
    profile,
    pkgRoot: packageRoot(),
    commandSets,
  })
  if (s2.length > 0) {
    const uniq = uniqueKeepOrder(s2)
    emitHostFail(
      json,
      'host apply',
      target,
      {
        ...baseReport,
        errors: uniq.map((p) => ({
          path: p,
          code: 's2' as const,
          message: `路径命中 S2 过程域（拒）: ${p}`,
        })),
      },
      uniq.map((p) => `  - [s2] ${p}`),
    )
  }

  const planned = items.filter((i) => i.op === 'write' || i.op === 'merge').map((i) => i.destRel)
  const skipped = items.filter((i) => i.op === 'skip_identical').map((i) => i.destRel)
  const conflict = items.filter((i) => i.op === 'conflict').map((i) => i.destRel)
  // Claude 在工具列表时：清除旧扁平 kit-*.md，禁止与 kit/<verb>.md 双份并存
  const legacyRemove = toolIds.includes('claude')
    ? findLegacyClaudeFlatCommands(target, commandSets.core)
    : []

  let written: string[] = []
  let removed: string[] = []
  let backup: string | null = null
  if (yes) {
    const committed = commitPlannedWrites(target, items, 'host-apply', legacyRemove)
    written = committed.written
    removed = committed.removed
    backup = committed.backup
    writeHostToolsSticky(target, toolIds, profile)
  }

  const report: HostWriteReport = {
    command: 'host apply',
    mode,
    hosts: toolIds,
    planned,
    written: yes ? written : [],
    skipped,
    conflict,
    removed: yes ? removed : legacyRemove,
    backup,
    degraded_none: baseReport.degraded_none,
    contract,
    ok: true,
    verdict: 'PASS',
  }
  if (json) printJson(target, report)
  else printHostHuman(report)
}

async function cmdHostUpdate(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`用法: npx spec-wave ${UPDATE_USAGE}`)
    return
  }
  const yes = args.includes('--yes')
  const dryRunFlag = args.includes('--dry-run')
  const json = args.includes('--json')
  const force = args.includes('--force')
  if (yes && dryRunFlag) {
    fail(`host update: --yes 与 --dry-run 不可同现\n用法: ${UPDATE_USAGE}`)
  }
  let rest = args.filter(
    (a) => a !== '--yes' && a !== '--dry-run' && a !== '--json' && a !== '--force',
  )
  let toolsArg: string | undefined
  if (rest.includes('--tools')) {
    const toolsIdx = rest.indexOf('--tools')
    if (toolsIdx + 1 >= rest.length || rest[toolsIdx + 1]!.startsWith('-')) {
      fail(`host update 须 --tools LIST\n用法: ${UPDATE_USAGE}`)
    }
    const taken = takeOption(rest, '--tools')
    toolsArg = taken.value
    rest = taken.rest
  }
  const { value: profileArg, rest: rProfile } = takeOptionalFlag(
    rest,
    '--profile',
    UPDATE_USAGE,
    'host update',
  )
  rest = rProfile
  const { value: targetArg, rest: rTarget } = takeOptionalFlag(
    rest,
    '--target',
    UPDATE_USAGE,
    'host update',
  )
  rest = rTarget
  const { value: fileArg, rest: rFile } = takeOptionalFlag(rest, '--file', UPDATE_USAGE, 'host update')
  rest = rFile
  if (rest.length > 0) fail(`host update 未知参数: ${rest.join(' ')}\n用法: ${UPDATE_USAGE}`)

  const profile = profileArg ?? 'core'
  assertHostProfile(profile, 'host update', UPDATE_USAGE)

  const target = resolveTarget(process.cwd(), targetArg)
  if (!existsSync(target) || !statSync(target).isDirectory()) {
    fail(`host update target 不存在或不是目录: ${target}`)
  }

  const fileAbs = resolveValidateFile(fileArg)
  if (!existsSync(fileAbs)) fail(`host update 文件不存在: ${fileAbs}`)

  const mode: 'dry-run' | 'update' = yes ? 'update' : 'dry-run'
  const baseReport = {
    command: 'host update' as const,
    mode,
    hosts: [] as string[],
    planned: [] as string[],
    written: [] as string[],
    skipped: [] as string[],
    conflict: [] as string[],
    removed: [] as string[],
    backup: null as string | null,
    degraded_none: [] as string[],
  }

  let data: unknown
  try {
    data = yamlLoad(readFileSync(fileAbs, 'utf8'))
  } catch (err) {
    const msg = `YAML 解析失败: ${(err as Error).message}`
    emitHostFail(json, 'host update', target, { ...baseReport, errors: [{ path: '$', code: 'parse', message: msg }] }, [
      msg,
    ])
  }

  const issues = validateHostAdaptDocDispatch(data)
  if (issues.length > 0) {
    emitHostFail(
      json,
      'host update',
      target,
      { ...baseReport, errors: issues },
      issues.map((e) => `  - [${e.code}] ${e.path}: ${e.message}`),
    )
  }

  const rows = resolvedHostRows(data)
  const knownIds = rows.map((r) => r.host_id)
  const known = new Set(knownIds)
  // W2 方案 A：CLI `--tools` → 粘性 host_ids → 否则 exit 1（相对 2.1.0 全表为 BREAKING 小）
  let toolIds: string[]
  if (toolsArg !== undefined) {
    toolIds = resolveToolsList(toolsArg, knownIds, 'host update', UPDATE_USAGE)
  } else {
    const sticky = loadHostToolsSticky(target)
    if (sticky !== null && sticky.host_ids.length >= 1) {
      toolIds = uniqueKeepOrder(sticky.host_ids)
    } else {
      fail(
        `host update 无粘性且未传 --tools：请先 host apply / init，或传 --tools LIST / --tools all\n用法: ${UPDATE_USAGE}`,
      )
    }
  }
  const unknown = toolIds.filter((id) => !known.has(id))
  if (unknown.length > 0) {
    fail(`host update 未知 host_id: ${unknown.join(', ')}\n用法: ${UPDATE_USAGE}`)
  }
  baseReport.hosts = toolIds
  baseReport.degraded_none = degradedNoneHosts(toolIds, rows, explicitHooksHostIdsOf(data))

  const contract = evaluateHostContract(tableVersionOf(data))
  if (contract.status === 'degraded') {
    emitU01Degraded(json, 'host update', target, baseReport, contract)
  }

  const commandSets = commandSetsOf(data)
  const { items, s2 } = planApply({
    target,
    rows,
    toolIds,
    profile,
    pkgRoot: packageRoot(),
    commandSets,
  })
  remapUpdateConflicts(items, force)
  if (s2.length > 0) {
    const uniq = uniqueKeepOrder(s2)
    emitHostFail(
      json,
      'host update',
      target,
      {
        ...baseReport,
        errors: uniq.map((p) => ({
          path: p,
          code: 's2' as const,
          message: `路径命中 S2 过程域（拒）: ${p}`,
        })),
      },
      uniq.map((p) => `  - [s2] ${p}`),
    )
  }

  const planned = items.filter((i) => i.op === 'write' || i.op === 'merge').map((i) => i.destRel)
  const skipped = items.filter((i) => i.op === 'skip_identical').map((i) => i.destRel)
  const conflict = items.filter((i) => i.op === 'conflict').map((i) => i.destRel)
  const legacyRemove = toolIds.includes('claude')
    ? findLegacyClaudeFlatCommands(target, commandSets.core)
    : []

  let written: string[] = []
  let removed: string[] = []
  let backup: string | null = null
  if (yes) {
    const committed = commitPlannedWrites(target, items, 'host-update', legacyRemove)
    written = committed.written
    removed = committed.removed
    backup = committed.backup
    writeHostToolsSticky(target, toolIds, profile)
  }

  const report: HostWriteReport = {
    command: 'host update',
    mode,
    hosts: toolIds,
    planned,
    written: yes ? written : [],
    skipped,
    conflict,
    removed: yes ? removed : legacyRemove,
    backup,
    degraded_none: baseReport.degraded_none,
    contract,
    ok: true,
    verdict: 'PASS',
  }
  if (json) printJson(target, report)
  else printHostHuman(report)
}

/**
 * host verify 物化校验（3.0 W2 阶段二 · S3.4 · 验收 #2 · F-W2-04）：
 * 比对三分形态（逐字 / marker 产品块 / JSON 包含性 · checkPlannedItem 分派）·
 * --tools 缺省 = 粘性 host_ids（与 host update 方案 A 同口径 · 无粘性且无 --tools → exit 1）·
 * 30 裁决②：--profile 缺省 = 粘性 profile → 否则 core（与 apply 缺省兼容 · 贴合实取物化态）；
 * 30 裁决③：verify 节消费呈现 = 每宿主一条 kind:'verify' check（kind/bin/failClosed 随报告输出）；
 * mechanism none 宿主输出 degraded-none 状态行（S3.5 · 不计红绿）· exit 0（全绿）/ 2（任一红）。
 */
function emitVerifyFail(json: boolean, target: string, message: string): never {
  if (json) {
    printJson(target, {
      command: 'host verify',
      target,
      hosts: [],
      checks: [],
      verdict: 'FAIL',
      errors: [message],
    })
  } else {
    console.error(message)
    console.log('HOST VERIFY: FAIL')
  }
  fail('', 2)
}

async function cmdHostVerify(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`用法: npx spec-wave ${VERIFY_USAGE}`)
    return
  }
  const json = args.includes('--json')
  let rest = args.filter((a) => a !== '--json')
  let toolsArg: string | undefined
  if (rest.includes('--tools')) {
    const toolsIdx = rest.indexOf('--tools')
    if (toolsIdx + 1 >= rest.length || rest[toolsIdx + 1]!.startsWith('-')) {
      fail(`host verify 须 --tools LIST|all\n用法: ${VERIFY_USAGE}`)
    }
    const taken = takeOption(rest, '--tools')
    toolsArg = taken.value
    rest = taken.rest
  }
  const { value: profileArg, rest: rProfile } = takeOptionalFlag(
    rest,
    '--profile',
    VERIFY_USAGE,
    'host verify',
  )
  rest = rProfile
  const { value: targetArg, rest: rTarget } = takeOptionalFlag(
    rest,
    '--target',
    VERIFY_USAGE,
    'host verify',
  )
  rest = rTarget
  const { value: fileArg, rest: rFile } = takeOptionalFlag(rest, '--file', VERIFY_USAGE, 'host verify')
  rest = rFile
  if (rest.length > 0) fail(`host verify 未知参数: ${rest.join(' ')}\n用法: ${VERIFY_USAGE}`)

  const target = resolveTarget(process.cwd(), targetArg)
  if (!existsSync(target) || !statSync(target).isDirectory()) {
    fail(`host verify target 不存在或不是目录: ${target}`)
  }
  const fileAbs = resolveValidateFile(fileArg)
  if (!existsSync(fileAbs)) fail(`host verify 文件不存在: ${fileAbs}`)

  let data: unknown
  try {
    data = yamlLoad(readFileSync(fileAbs, 'utf8'))
  } catch (err) {
    emitVerifyFail(json, target, `YAML 解析失败: ${(err as Error).message}`)
  }
  const issues = validateHostAdaptDocDispatch(data)
  if (issues.length > 0) {
    emitVerifyFail(
      json,
      target,
      issues.map((e) => `  - [${e.code}] ${e.path}: ${e.message}`).join('\n'),
    )
  }

  const rows = resolvedHostRows(data)
  const knownIds = rows.map((r) => r.host_id)
  const known = new Set(knownIds)
  const sticky = loadHostToolsSticky(target)
  let toolIds: string[]
  if (toolsArg !== undefined) {
    toolIds = resolveToolsList(toolsArg, knownIds, 'host verify', VERIFY_USAGE)
  } else if (sticky !== null && sticky.host_ids.length >= 1) {
    toolIds = uniqueKeepOrder(sticky.host_ids)
  } else {
    fail(
      `host verify 无粘性且未传 --tools：请先 host apply / init，或传 --tools LIST / --tools all\n用法: ${VERIFY_USAGE}`,
    )
  }
  const unknown = toolIds.filter((id) => !known.has(id))
  if (unknown.length > 0) {
    fail(`host verify 未知 host_id: ${unknown.join(', ')}\n用法: ${VERIFY_USAGE}`)
  }
  const profile = profileArg ?? sticky?.profile ?? 'core'
  assertHostProfile(profile, 'host verify', VERIFY_USAGE)

  const commandSets = commandSetsOf(data)
  const { items, s2 } = planApply({
    target,
    rows,
    toolIds,
    profile,
    pkgRoot: packageRoot(),
    commandSets,
    // F-W2-04 fail-closed：落点无法读取不在计划层崩溃（exit 1）· 由比对层按 unreadable 报红点名 exit 2
    tolerateUnreadableDest: true,
  })
  if (s2.length > 0) {
    emitVerifyFail(json, target, uniqueKeepOrder(s2).map((p) => `  - [s2] ${p}`).join('\n'))
  }

  const byId = new Map(rows.map((r) => [r.host_id, r]))
  const explicit = new Set(explicitHooksHostIdsOf(data))
  const itemChecks = items.map((item) => checkPlannedItem(item))
  const checks: HostVerifyCheck[] = []
  for (const id of toolIds) {
    const row = byId.get(id)!
    const v = row.surfaces.verify
    checks.push({
      host_id: id,
      target: 'surfaces.verify',
      kind: 'verify',
      status: 'ok',
      detail: v
        ? `kind=${v.kind} bin=${v.bin} failClosed=${v.failClosed === true}（声明已消费）`
        : '未声明（可选节）',
    })
    if (explicit.has(id) && row.surfaces.hooks.mechanism === 'none') {
      checks.push({
        host_id: id,
        target: 'hooks',
        kind: 'hooks',
        status: 'degraded-none',
        detail: 'L1+L2 · 宿主无 hook 机制 · 门禁仅 CLI 侧',
      })
    }
    for (const c of itemChecks) {
      if (c.host_id === id) checks.push(c)
    }
  }

  const verdict: 'PASS' | 'FAIL' = checks.some((c) => isVerifyRed(c.status)) ? 'FAIL' : 'PASS'
  if (json) {
    // --json 顶层键集钉死 = {command, target, hosts, checks, verdict}（30 裁决① · cli-flags 键集 fixture 口径）
    printJson(target, { command: 'host verify', target, hosts: toolIds, checks, verdict })
  } else {
    console.log('HOST VERIFY')
    console.log(`hosts: ${toolIds.join(', ')}`)
    for (const id of toolIds) {
      console.log(`host ${id}:`)
      for (const c of checks.filter((x) => x.host_id === id)) {
        if (c.status === 'ok') {
          console.log(`  [ok] ${c.target} · ${c.kind}${c.detail ? `（${c.detail}）` : ''}`)
        } else if (c.status === 'degraded-none') {
          // S3.5 规范行形（与 apply/update 降级行同一字面 · 快照断言锚点）
          console.log(`  ${c.target}: degraded-none（${c.detail ?? ''}）`)
        } else {
          console.log(`  [FAIL] ${c.target} · ${c.status}${c.detail ? `（${c.detail}）` : ''}`)
        }
      }
    }
    console.log(`HOST VERIFY: ${verdict}`)
  }
  if (verdict === 'FAIL') fail('', 2)
}

export async function cmdHost(args: string[]): Promise<void> {
  const [sub, ...rest] = args
  if (sub === '--help' || sub === '-h') {
    console.log(`用法: npx spec-wave ${HOST_USAGE}`)
    return
  }
  if (!sub) fail(`host 子命令未知: (空)\n用法: ${HOST_USAGE}`)
  if (sub === 'validate') {
    await cmdHostValidate(rest)
    return
  }
  if (sub === 'apply') {
    await cmdHostApply(rest)
    return
  }
  if (sub === 'update') {
    await cmdHostUpdate(rest)
    return
  }
  if (sub === 'verify') {
    await cmdHostVerify(rest)
    return
  }
  fail(`host 子命令未知: ${sub}\n用法: ${HOST_USAGE}`)
}
