import { existsSync, readFileSync, statSync } from 'node:fs'
import os from 'node:os'
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
import {
  buildTableSourceForSticky,
  loadHostToolsSticky,
  uniqueKeepOrder,
  writeHostToolsSticky,
  type HostToolsSticky,
} from './sticky.ts'
import { assertHostProfile, findLegacyClaudeFlatCommands } from './commands.ts'
import { commitPlannedWrites, planApply, remapUpdateConflicts } from './materialize.ts'
import { checkPlannedItem, isVerifyRed, type HostVerifyCheck } from './verify.ts'
import type { ResolvedHostRow } from './resolve.ts'
import {
  listUserTableFiles,
  loadUserCatalog,
  mergeUserHostTables,
  sha256OfFile,
  userHostsDirOf,
  type MergedHostTables,
} from './load.ts'
import { asHostRows, kitPackageSemver } from './table.ts'
import { configHookSpecOf } from './hooks.ts'
import {
  emitHostFail,
  emitU01Degraded,
  printHostHuman,
  tableVersionOf,
  type HostWriteReport,
} from './report.ts'

/** 3.0.1 W6：非映射宿主 + config-hook → 可见性 WARN（不改 exit / PASS） */
const CONFIG_HOOK_MAPPED_HOSTS_LABEL = 'claude/cursor/gemini'

export function collectConfigHookUnmappedWarnings(data: unknown): string[] {
  const warnings: string[] = []
  for (const row of resolvedHostRows(data)) {
    if (row.surfaces.hooks.mechanism !== 'config-hook') continue
    if (configHookSpecOf(row.host_id)) continue
    warnings.push(
      `宿主 ${row.host_id} 声明 mechanism: config-hook 但不在 config-hook 落点映射表内（${CONFIG_HOOK_MAPPED_HOSTS_LABEL}）⇒ host apply 将 fail-closed；如需仅 L1+L2 请用 mechanism: none`,
    )
  }
  return warnings
}

const HOST_USAGE =
  'host validate [--file PATH] [--target PATH] [--json]\n  host apply --tools LIST|all [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes] [--pin-hook-version[=SEMVER]]（实验性 · 缺省关闭）\n  host update [--tools LIST|all] [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes] [--force] [--pin-hook-version[=SEMVER]]（实验性 · 缺省关闭）\n  host verify [--tools LIST|all] [--profile core|expanded] [--target PATH] [--file PATH] [--json]\n  host catalog list [--target PATH] [--json]'

const APPLY_USAGE =
  'host apply --tools cursor,claude|all [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes] [--pin-hook-version[=SEMVER]]（实验性 · 缺省关闭）'

const UPDATE_USAGE =
  'host update [--tools LIST|all] [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes] [--force] [--pin-hook-version[=SEMVER]]（实验性 · 缺省关闭）'

const VERIFY_USAGE =
  'host verify [--tools LIST|all] [--profile core|expanded] [--target PATH] [--file PATH] [--json]'

const CATALOG_USAGE = 'host catalog list [--target PATH] [--json]'

/**
 * 合并装载（3.0 W2 阶段三 · B5 · S3.6）：--file → 当次整表替换（单表语义逐字现状）；
 * 无 --file → 内置恒基底 + 用户目录合并（mergeUserHostTables · 失败 exit 2 零写入 · 目录缺失零行为差）。
 */
function loadMergedTables(data: unknown, fileArg: string | undefined): MergedHostTables {
  if (fileArg !== undefined) {
    return {
      rows: resolvedHostRows(data),
      commandSets: commandSetsOf(data),
      explicitHooksHostIds: explicitHooksHostIdsOf(data),
      sourceRootOf: () => packageRoot(),
      userTables: [],
      catalog: null,
    }
  }
  return mergeUserHostTables({ baseData: data, homeDir: os.homedir(), pkgRoot: packageRoot() })
}

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

/** 宽松 SEMVER（MAJOR.MINOR.PATCH 可选 pre/build · 非法 → 用法错误 exit 1） */
const PIN_HOOK_SEMVER_RE =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/

/**
 * 解析 `--pin-hook-version[=SEMVER]`（3.0.1 W5 · 实验性 · 缺省关闭）。
 * 裸旗标 / 无值 → 缺省 = package.json#version（kit_semver 同源）；空 `=` / 非法 → exit 1。
 * 不可复用 takeOptionalFlag（后者强制跟值 · 无法表达裸旗标）。
 */
function takePinHookVersionFlag(
  args: string[],
  usage: string,
  cmd: string,
): { pinVersion: string | undefined; rest: string[] } {
  const rest: string[] = []
  let raw: string | undefined
  let present = false
  for (let i = 0; i < args.length; i++) {
    const a = args[i]!
    if (a === '--pin-hook-version') {
      present = true
      const next = args[i + 1]
      if (next !== undefined && !next.startsWith('-')) {
        raw = next
        i++
      } else {
        raw = undefined
      }
      continue
    }
    if (a.startsWith('--pin-hook-version=')) {
      present = true
      raw = a.slice('--pin-hook-version='.length)
      continue
    }
    rest.push(a)
  }
  if (!present) return { pinVersion: undefined, rest: args }
  if (raw === '') {
    fail(
      `${cmd} --pin-hook-version= 须为非空 SEMVER（实验性 · 缺省关闭）\n用法: ${usage}`,
    )
  }
  const resolved = raw ?? kitPackageSemver()
  if (resolved === undefined || resolved.trim().length < 1) {
    fail(
      `${cmd} --pin-hook-version 无法解析缺省 kit_semver（package.json#version）\n用法: ${usage}`,
    )
  }
  const semver = resolved.trim()
  if (!PIN_HOOK_SEMVER_RE.test(semver)) {
    fail(`${cmd} --pin-hook-version 非法 SEMVER: ${semver}\n用法: ${usage}`)
  }
  return { pinVersion: semver, rest }
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

  // 3.0.1 W6（P3-7）：非映射 + config-hook → WARN；exit/PASS 不变（硬约束 5 · 与 W2 告警契约同源）
  const warnings = collectConfigHookUnmappedWarnings(data)

  if (json) {
    printJson(base, {
      command: 'host validate',
      file: fileOut,
      ...outsideField,
      ok: true,
      verdict: 'PASS',
      ...(warnings.length > 0 ? { warnings } : {}),
    })
    return
  }
  for (const w of warnings) console.error(`WARN: ${w}`)
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
  const { pinVersion: hookPinVersion, rest: rPin } = takePinHookVersionFlag(
    rest,
    APPLY_USAGE,
    'host apply',
  )
  rest = rPin
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

  const merged = loadMergedTables(data, fileArg)
  const rows = merged.rows
  const knownIds = rows.map((r) => r.host_id)
  const known = new Set(knownIds)
  const toolIds = resolveToolsList(toolsArg ?? '', knownIds, 'host apply', APPLY_USAGE)
  baseReport.hosts = toolIds
  baseReport.degraded_none = degradedNoneHosts(toolIds, rows, merged.explicitHooksHostIds)
  const unknown = toolIds.filter((id) => !known.has(id))
  if (unknown.length > 0) {
    fail(`host apply 未知 host_id: ${unknown.join(', ')}\n用法: ${APPLY_USAGE}`)
  }

  const contract = evaluateHostContract(tableVersionOf(data))
  if (contract.status === 'degraded') {
    emitU01Degraded(json, 'host apply', target, baseReport, contract)
  }

  const commandSets = merged.commandSets
  const { items, s2 } = planApply({
    target,
    rows,
    toolIds,
    profile,
    pkgRoot: packageRoot(),
    commandSets,
    sourceRootOf: merged.sourceRootOf,
    hookPinVersion,
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
    writeHostToolsSticky(
      target,
      toolIds,
      profile,
      buildTableSourceForSticky(target, fileAbs, fileArg),
    )
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
  const { pinVersion: hookPinVersion, rest: rPin } = takePinHookVersionFlag(
    rest,
    UPDATE_USAGE,
    'host update',
  )
  rest = rPin
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

  const merged = loadMergedTables(data, fileArg)
  const rows = merged.rows
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
  baseReport.degraded_none = degradedNoneHosts(toolIds, rows, merged.explicitHooksHostIds)

  const contract = evaluateHostContract(tableVersionOf(data))
  if (contract.status === 'degraded') {
    emitU01Degraded(json, 'host update', target, baseReport, contract)
  }

  const commandSets = merged.commandSets
  const { items, s2 } = planApply({
    target,
    rows,
    toolIds,
    profile,
    pkgRoot: packageRoot(),
    commandSets,
    sourceRootOf: merged.sourceRootOf,
    hookPinVersion,
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
    writeHostToolsSticky(
      target,
      toolIds,
      profile,
      buildTableSourceForSticky(target, fileAbs, fileArg),
    )
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
 * host verify 取表优先级（3.0.1 W1 · P1-1）：
 * `--file` 显式 > 粘性 `table_source` > 内置。
 * 相对路径基准 = 仓根（`--target`）。
 * file 表源不可用 → exit 2 点名路径 + 可操作提示（严禁静默退回内置）；
 * sha256 不符 → 仅 WARN，不硬红（审查文 §3.1）。
 */
function resolveVerifyTableFile(
  target: string,
  fileArg: string | undefined,
  sticky: HostToolsSticky | null,
  json: boolean,
): { fileAbs: string; mergeFileArg: string | undefined } {
  if (fileArg !== undefined) {
    const fileAbs = resolveValidateFile(fileArg)
    if (!existsSync(fileAbs)) fail(`host verify 文件不存在: ${fileAbs}`)
    return { fileAbs, mergeFileArg: fileArg }
  }

  const ts = sticky?.table_source
  if (ts?.kind === 'file') {
    const fileAbs = path.isAbsolute(ts.path) ? path.normalize(ts.path) : path.resolve(target, ts.path)
    if (!existsSync(fileAbs)) {
      emitVerifyFail(
        json,
        target,
        [
          `host verify 粘性表源不可用: 记录路径 ${ts.path}（解析=${fileAbs}）不存在。`,
          '请带同一 --file 复跑，或重新 host apply / update 刷新粘性。',
          '（严禁静默退回内置表 · 3.0.1 W1）',
        ].join('\n'),
      )
    }
    let actualSha: string
    try {
      actualSha = sha256OfFile(fileAbs)
    } catch (err) {
      emitVerifyFail(
        json,
        target,
        [
          `host verify 粘性表源不可读: ${ts.path}（${fileAbs}）: ${(err as Error).message}`,
          '请带 --file 或重新 host apply / update。',
        ].join('\n'),
      )
    }
    if (actualSha !== ts.sha256.toLowerCase()) {
      console.error(
        `WARN: 粘性 table_source.sha256 不符（记录=${ts.sha256} 实际=${actualSha} · 路径=${ts.path}）；本波仅 WARN，仍用该表继续 verify。建议重新 host apply 刷新哈希。`,
      )
    }
    // mergeFileArg 非 undefined → 单表语义（与显式 --file 同）
    return { fileAbs, mergeFileArg: fileAbs }
  }

  const fileAbs = resolveValidateFile(undefined)
  if (!existsSync(fileAbs)) fail(`host verify 文件不存在: ${fileAbs}`)
  return { fileAbs, mergeFileArg: undefined }
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

  // 先读粘性：取表优先级依赖 table_source；--tools/--profile 缺省亦依赖粘性
  const sticky = loadHostToolsSticky(target)
  const { fileAbs, mergeFileArg } = resolveVerifyTableFile(target, fileArg, sticky, json)

  let data: unknown
  try {
    data = yamlLoad(readFileSync(fileAbs, 'utf8'))
  } catch (err) {
    const hint =
      mergeFileArg !== undefined && fileArg === undefined
        ? `\n粘性表源: ${sticky?.table_source && sticky.table_source.kind === 'file' ? sticky.table_source.path : fileAbs}\n请带 --file 或重新 host apply / update。`
        : ''
    emitVerifyFail(json, target, `YAML 解析失败: ${(err as Error).message}${hint}`)
  }
  const issues = validateHostAdaptDocDispatch(data)
  if (issues.length > 0) {
    emitVerifyFail(
      json,
      target,
      issues.map((e) => `  - [${e.code}] ${e.path}: ${e.message}`).join('\n'),
    )
  }

  const merged = loadMergedTables(data, mergeFileArg)
  const rows = merged.rows
  const knownIds = rows.map((r) => r.host_id)
  const known = new Set(knownIds)
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

  const commandSets = merged.commandSets
  const { items, s2 } = planApply({
    target,
    rows,
    toolIds,
    profile,
    pkgRoot: packageRoot(),
    commandSets,
    sourceRootOf: merged.sourceRootOf,
    // F-W2-04 fail-closed：落点无法读取不在计划层崩溃（exit 1）· 由比对层按 unreadable 报红点名 exit 2
    tolerateUnreadableDest: true,
  })
  if (s2.length > 0) {
    emitVerifyFail(json, target, uniqueKeepOrder(s2).map((p) => `  - [s2] ${p}`).join('\n'))
  }

  const byId = new Map(rows.map((r) => [r.host_id, r]))
  const explicit = new Set(merged.explicitHooksHostIds)
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

/**
 * host catalog list（3.0 W2 阶段三 · B5 catalog · S3.6-4/5 · 验收 #11 · F-W2-09）：
 * 列内置 13（origin builtin）+ 用户表（source/integrity 状态）· sha256 呈现即强制
 *（不符 → mismatch 红 + verdict FAIL exit 2 点名）· catalog 缺失照载标 integrity: none · 未登记标 uncataloged。
 * --json 顶层键集钉死 = {command, target, catalog, tables, verdict}（30 定稿 · 测试钉死）。
 */
type CatalogTableEntry = {
  file: string
  origin: 'builtin' | 'user'
  hosts: number
  host_ids?: string[]
  source: string
  integrity: 'ok' | 'none' | 'uncataloged' | 'mismatch'
  status: 'ok' | 'error'
  detail?: string
}

async function cmdHostCatalogList(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`用法: npx spec-wave ${CATALOG_USAGE}`)
    return
  }
  const json = args.includes('--json')
  let rest = args.filter((a) => a !== '--json')
  const { value: targetArg, rest: r1 } = takeOption(rest, '--target')
  rest = r1
  if (rest.length > 0) fail(`host catalog list 未知参数: ${rest.join(' ')}\n用法: ${CATALOG_USAGE}`)
  const target = resolveTarget(process.cwd(), targetArg)

  const homeDir = os.homedir()
  const dir = userHostsDirOf(homeDir)
  const catalog = loadUserCatalog(dir) // 缺失 → null · 坏 → exit 2 点名（fail-closed）
  const files = listUserTableFiles(homeDir)
  const catalogByFile = new Map((catalog?.tables ?? []).map((t) => [t.file, t]))

  const builtinAbs = resolveValidateFile(undefined)
  let builtinHosts = 0
  try {
    builtinHosts = asHostRows(yamlLoad(readFileSync(builtinAbs, 'utf8'))).length
  } catch {
    builtinHosts = 0
  }
  const tables: CatalogTableEntry[] = [
    {
      file: toRel(packageRoot(), builtinAbs), // 包内资产锚定包根相对形（稳定自描述 · 不随 target 走 ../ 上溯）
      origin: 'builtin',
      hosts: builtinHosts,
      source: 'package',
      integrity: 'ok', // 内置完整性由 assets sha256.manifest 守护（W5 面）
      status: 'ok',
    },
  ]
  let failFlag = false
  for (const name of files) {
    const abs = path.join(dir, name)
    const entry = catalogByFile.get(name)
    let integrity: CatalogTableEntry['integrity']
    let detail: string | undefined
    if (entry?.sha256 !== undefined) {
      const actual = sha256OfFile(abs)
      if (actual !== entry.sha256) {
        integrity = 'mismatch'
        detail = `sha256 不符（F-W2-09）: 声明 ${entry.sha256} ≠ 实测 ${actual}`
        failFlag = true
      } else {
        integrity = 'ok'
      }
    } else if (catalog === null) {
      integrity = 'none'
    } else if (entry) {
      integrity = 'none'
    } else {
      integrity = 'uncataloged'
    }
    let status: CatalogTableEntry['status'] = 'ok'
    let hostIds: string[] = []
    try {
      const data = yamlLoad(readFileSync(abs, 'utf8'))
      const issues = validateHostAdaptDocDispatch(data)
      if (issues.length > 0) {
        status = 'error'
        detail = [detail, `schema 非法: ${issues[0]!.path}: ${issues[0]!.message}`].filter(Boolean).join(' · ')
        failFlag = true
      } else {
        hostIds = asHostRows(data).map((r) => r.host_id)
      }
    } catch (err) {
      status = 'error'
      detail = [detail, `YAML 解析失败: ${(err as Error).message}`].filter(Boolean).join(' · ')
      failFlag = true
    }
    tables.push({
      file: name,
      origin: 'user',
      hosts: hostIds.length,
      host_ids: hostIds,
      source: entry?.source ?? '（未标注）',
      integrity,
      status,
      ...(detail !== undefined ? { detail } : {}),
    })
  }

  const verdict: 'PASS' | 'FAIL' = failFlag ? 'FAIL' : 'PASS'
  if (json) {
    printJson(target, {
      command: 'host catalog list',
      target,
      catalog: catalog
        ? { present: true, file: 'catalog.yaml', version: catalog.version }
        : { present: false },
      tables,
      verdict,
    })
  } else {
    console.log('HOST CATALOG')
    const b = tables[0]!
    console.log(`builtin: ${b.file} · hosts ${b.hosts} · origin builtin · integrity ok（assets manifest 守护）`)
    console.log(
      catalog
        ? `catalog: catalog.yaml · version "${catalog.version}"`
        : 'catalog: （无 · 用户表 integrity 均为 none）',
    )
    const users = tables.slice(1)
    console.log(`user tables (${users.length}):`)
    if (users.length === 0) console.log('  (无)')
    for (const t of users) {
      console.log(
        `  ${t.file} · hosts ${t.hosts}${t.host_ids && t.host_ids.length > 0 ? `（${t.host_ids.join(', ')}）` : ''} · source ${t.source} · integrity ${t.integrity}${t.status === 'error' ? ' · status error' : ''}${t.detail ? ` · ${t.detail}` : ''}`,
      )
    }
    console.log(`HOST CATALOG: ${verdict}`)
  }
  if (verdict === 'FAIL') fail('', 2)
}

async function cmdHostCatalog(args: string[]): Promise<void> {
  const [sub, ...rest] = args
  if (sub === '--help' || sub === '-h') {
    console.log(`用法: npx spec-wave ${CATALOG_USAGE}`)
    return
  }
  if (!sub) fail(`host catalog 子命令未知: (空)\n用法: ${CATALOG_USAGE}`)
  if (sub === 'list') {
    await cmdHostCatalogList(rest)
    return
  }
  fail(`host catalog 子命令未知: ${sub}\n用法: ${CATALOG_USAGE}`)
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
  if (sub === 'catalog') {
    await cmdHostCatalog(rest)
    return
  }
  fail(`host 子命令未知: ${sub}\n用法: ${HOST_USAGE}`)
}
