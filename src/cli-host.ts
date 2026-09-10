/**
 * host 子命令（2.x W1–W4）：validate + apply + update。
 * apply：always_on + commands(core) + skills（跳过 30/40）。
 * update：刷新产品 commands/skills；conflict 默认不覆盖（`--force` 显式）。
 * U-01：契约嗅探不匹配 → exit 2 零写入。
 * 本波禁止：bump / publish / 默认分发 30/40 / onboard。
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import {
  assertNotS2Abs,
  fail,
  isS2AbsPath,
  isS2RelPath,
  kitLayoutJoin,
  normalizeSlashPath,
  packageRoot,
  resolveTarget,
  takeOption,
  toRel,
} from './cli-shared.ts'
import { isExecuteHatSkipped } from './cli-skills.ts'
import {
  evaluateHostContract,
  type HostContractResult,
} from './host-contract.ts'
import { yamlLoad } from './yaml.ts'

export { sniffHostContract } from './host-contract.ts'

const HOST_USAGE =
  'host validate [--file PATH] [--json]\n  host apply --tools LIST [--profile core] [--target PATH] [--file PATH] [--json] [--dry-run|--yes]\n  host update [--tools LIST] [--profile core] [--target PATH] [--file PATH] [--json] [--dry-run|--yes] [--force]'

const APPLY_USAGE =
  'host apply --tools cursor,claude [--profile core] [--target PATH] [--file PATH] [--json] [--dry-run|--yes]'

const UPDATE_USAGE =
  'host update [--tools LIST] [--profile core] [--target PATH] [--file PATH] [--json] [--dry-run|--yes] [--force]'

const DEFAULT_EXAMPLE_REL = path.join('assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')

const CORE_COMMAND_FILES = [
  'kit-apply-standards.md',
  'kit-verify.md',
  'kit-gate-status.md',
  'kit-init-guide.md',
  'kit-hat-reanchor.md',
] as const

const CORE_COMMAND_SET = new Set<string>(CORE_COMMAND_FILES)

const PRODUCT_BEGIN = '<!-- cyning-harness:begin -->'
const PRODUCT_END = '<!-- cyning-harness:end -->'
const LOCAL_BEGIN = '<!-- cyning-harness-local:begin -->'
const LOCAL_END = '<!-- cyning-harness-local:end -->'

const BACKUP_KEEP = 5

export type HostValidateIssue = {
  path: string
  code: 'schema' | 's2' | 'parse'
  message: string
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function requireString(obj: Record<string, unknown>, key: string, base: string, issues: HostValidateIssue[]): string | null {
  const v = obj[key]
  if (typeof v !== 'string' || v.trim().length < 1) {
    issues.push({ path: `${base}.${key}`, code: 'schema', message: `须为非空字符串` })
    return null
  }
  return v
}

function checkS2Field(rel: string, fieldPath: string, issues: HostValidateIssue[]): void {
  if (isS2RelPath(rel)) {
    issues.push({
      path: fieldPath,
      code: 's2',
      message: `路径命中 S2 过程域（拒）: ${rel}`,
    })
  }
}

function validateAlwaysOn(entries: unknown, base: string, issues: HostValidateIssue[]): void {
  if (!Array.isArray(entries)) {
    issues.push({ path: base, code: 'schema', message: '须为数组' })
    return
  }
  entries.forEach((item, i) => {
    const p = `${base}[${i}]`
    if (!isPlainObject(item)) {
      issues.push({ path: p, code: 'schema', message: '须为对象' })
      return
    }
    const extra = Object.keys(item).filter((k) => k !== 'target' && k !== 'source')
    if (extra.length > 0) {
      issues.push({ path: p, code: 'schema', message: `未知字段: ${extra.join(', ')}` })
    }
    const target = requireString(item, 'target', p, issues)
    requireString(item, 'source', p, issues)
    if (target) checkS2Field(target, `${p}.target`, issues)
  })
}

function validateDirFrom(
  entries: unknown,
  base: string,
  issues: HostValidateIssue[],
  opts: { allowProfile?: boolean } = {},
): void {
  if (!Array.isArray(entries)) {
    issues.push({ path: base, code: 'schema', message: '须为数组' })
    return
  }
  const allowed = opts.allowProfile
    ? new Set(['target_dir', 'from', 'profile'])
    : new Set(['target_dir', 'from'])
  entries.forEach((item, i) => {
    const p = `${base}[${i}]`
    if (!isPlainObject(item)) {
      issues.push({ path: p, code: 'schema', message: '须为对象' })
      return
    }
    const extra = Object.keys(item).filter((k) => !allowed.has(k))
    if (extra.length > 0) {
      issues.push({ path: p, code: 'schema', message: `未知字段: ${extra.join(', ')}` })
    }
    const targetDir = requireString(item, 'target_dir', p, issues)
    requireString(item, 'from', p, issues)
    if (opts.allowProfile && item.profile !== undefined) {
      const prof = item.profile
      if (typeof prof !== 'string' || !['core', 'expanded', 'custom'].includes(prof)) {
        issues.push({
          path: `${p}.profile`,
          code: 'schema',
          message: `profile 须为 core|expanded|custom（收到: ${String(prof)}）`,
        })
      }
    }
    if (targetDir) checkS2Field(targetDir, `${p}.target_dir`, issues)
  })
}

function validateVerify(v: unknown, base: string, issues: HostValidateIssue[]): void {
  if (v === undefined) return
  if (!isPlainObject(v)) {
    issues.push({ path: base, code: 'schema', message: '须为对象' })
    return
  }
  const extra = Object.keys(v).filter((k) => !['kind', 'bin', 'failClosed'].includes(k))
  if (extra.length > 0) {
    issues.push({ path: base, code: 'schema', message: `未知字段: ${extra.join(', ')}` })
  }
  if (v.kind !== 'cli') {
    issues.push({ path: `${base}.kind`, code: 'schema', message: `须为 "cli"` })
  }
  requireString(v, 'bin', base, issues)
  if (v.failClosed !== undefined && typeof v.failClosed !== 'boolean') {
    issues.push({ path: `${base}.failClosed`, code: 'schema', message: '须为 boolean' })
  }
}

/** 对照 host-adapt.schema.json 的手写校验 + S2 扫描 */
export function validateHostAdaptDoc(data: unknown): HostValidateIssue[] {
  const issues: HostValidateIssue[] = []
  if (!isPlainObject(data)) {
    issues.push({ path: '$', code: 'schema', message: '根须为对象' })
    return issues
  }
  const extraRoot = Object.keys(data).filter((k) => k !== 'version' && k !== 'hosts')
  if (extraRoot.length > 0) {
    issues.push({ path: '$', code: 'schema', message: `未知字段: ${extraRoot.join(', ')}` })
  }
  requireString(data, 'version', '$', issues)
  if (!Array.isArray(data.hosts) || data.hosts.length < 1) {
    issues.push({ path: '$.hosts', code: 'schema', message: '须为非空数组' })
    return issues
  }
  data.hosts.forEach((row, i) => {
    const p = `$.hosts[${i}]`
    if (!isPlainObject(row)) {
      issues.push({ path: p, code: 'schema', message: '须为对象' })
      return
    }
    const extra = Object.keys(row).filter((k) => k !== 'host_id' && k !== 'surfaces')
    if (extra.length > 0) {
      issues.push({ path: p, code: 'schema', message: `未知字段: ${extra.join(', ')}` })
    }
    requireString(row, 'host_id', p, issues)
    const surfaces = row.surfaces
    if (!isPlainObject(surfaces)) {
      issues.push({ path: `${p}.surfaces`, code: 'schema', message: '须为对象' })
      return
    }
    const extraSurf = Object.keys(surfaces).filter(
      (k) => !['always_on', 'skills', 'commands', 'verify'].includes(k),
    )
    if (extraSurf.length > 0) {
      issues.push({
        path: `${p}.surfaces`,
        code: 'schema',
        message: `未知字段: ${extraSurf.join(', ')}`,
      })
    }
    for (const req of ['always_on', 'skills', 'commands'] as const) {
      if (!(req in surfaces)) {
        issues.push({ path: `${p}.surfaces.${req}`, code: 'schema', message: '必填' })
      }
    }
    validateAlwaysOn(surfaces.always_on, `${p}.surfaces.always_on`, issues)
    validateDirFrom(surfaces.skills, `${p}.surfaces.skills`, issues)
    validateDirFrom(surfaces.commands, `${p}.surfaces.commands`, issues, { allowProfile: true })
    validateVerify(surfaces.verify, `${p}.surfaces.verify`, issues)
  })
  return issues
}

function resolveValidateFile(fileArg: string | undefined): string {
  if (fileArg) return path.resolve(process.cwd(), fileArg)
  return path.join(packageRoot(), DEFAULT_EXAMPLE_REL)
}

async function cmdHostValidate(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`用法: npx dsh-coding-kit ${HOST_USAGE}`)
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
  if (rest.length > 0) fail(`host validate 未知参数: ${rest.join(' ')}\n用法: ${HOST_USAGE}`)

  const abs = resolveValidateFile(fileArg)
  if (!existsSync(abs)) {
    fail(`host validate 文件不存在: ${abs}`)
  }

  let data: unknown
  try {
    data = yamlLoad(readFileSync(abs, 'utf8'))
  } catch (err) {
    const msg = `YAML 解析失败: ${(err as Error).message}`
    if (json) {
      console.log(
        JSON.stringify(
          {
            command: 'host validate',
            file: abs,
            ok: false,
            verdict: 'FAIL',
            errors: [{ path: '$', code: 'parse', message: msg }],
          },
          null,
          2,
        ),
      )
    } else {
      console.error(msg)
      console.log('HOST VALIDATE: FAIL')
    }
    fail('', 2)
  }

  const issues = validateHostAdaptDoc(data)
  if (issues.length > 0) {
    if (json) {
      console.log(
        JSON.stringify(
          {
            command: 'host validate',
            file: abs,
            ok: false,
            verdict: 'FAIL',
            errors: issues,
          },
          null,
          2,
        ),
      )
    } else {
      for (const e of issues) {
        console.error(`  - [${e.code}] ${e.path}: ${e.message}`)
      }
      console.log('HOST VALIDATE: FAIL')
    }
    fail('', 2)
  }

  if (json) {
    console.log(
      JSON.stringify(
        {
          command: 'host validate',
          file: abs,
          ok: true,
          verdict: 'PASS',
        },
        null,
        2,
      ),
    )
    return
  }
  console.log(`file: ${abs}`)
  console.log('HOST VALIDATE: PASS')
}

type AlwaysOnEntry = { target: string; source: string }
type DirFromEntry = { target_dir: string; from: string }
type CommandsEntry = { target_dir: string; from: string; profile?: string }
type HostRow = {
  host_id: string
  surfaces: {
    always_on: AlwaysOnEntry[]
    skills: DirFromEntry[]
    commands: CommandsEntry[]
  }
}

type PlannedOp = 'write' | 'merge' | 'skip_identical' | 'conflict'

type PlannedItem = {
  hostId: string
  kind: 'always_on' | 'command' | 'skill'
  destRel: string
  destAbs: string
  sourceRel: string
  sourceAbs: string
  op: PlannedOp
  nextText: string
}

type HostWriteReport = {
  command: 'host apply' | 'host update'
  mode: 'dry-run' | 'apply' | 'update'
  hosts: string[]
  planned: string[]
  written: string[]
  skipped: string[]
  conflict: string[]
  backup: string | null
  contract?: HostContractResult
  ok: boolean
  verdict: 'PASS' | 'FAIL'
}

type SkillSource = { sourceRel: string; innerRel: string }

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

function uniqueKeepOrder(ids: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of ids) {
    if (seen.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out
}

function asHostRows(data: unknown): HostRow[] {
  const root = data as { hosts: HostRow[] }
  return root.hosts
}

function isMarkdownMergeTarget(destRel: string): boolean {
  const base = path.basename(destRel)
  return base === 'CLAUDE.md' || base === 'AGENTS.md'
}

function isKitManagedContent(content: string): boolean {
  if (content.includes(PRODUCT_BEGIN) || content.includes(PRODUCT_END)) return true
  if (content.includes('# Harness Starter（业务仓')) return true
  if (content.includes('Harness Starter — 读序、task、人工闸与 Verify 纪律')) return true
  return false
}

function extractProductInner(source: string): string {
  const text = source.replace(/\r\n/g, '\n')
  const b = text.indexOf(PRODUCT_BEGIN)
  const e = text.indexOf(PRODUCT_END)
  if (b !== -1 && e !== -1 && e > b) {
    return text.slice(b + PRODUCT_BEGIN.length, e).replace(/^\n/, '').replace(/\n$/, '')
  }
  return text.replace(/\s+$/, '')
}

function wrapProductBlock(inner: string): string {
  const body = inner.replace(/\s+$/, '')
  return `${PRODUCT_BEGIN}\n${body}\n${PRODUCT_END}\n`
}

function productSpanHasLocal(text: string): boolean {
  const b = text.indexOf(PRODUCT_BEGIN)
  const e = text.indexOf(PRODUCT_END)
  if (b === -1 || e === -1 || e < b) return false
  const span = text.slice(b, e + PRODUCT_END.length)
  return span.includes(LOCAL_BEGIN) || span.includes(LOCAL_END)
}

function mergeMarkdownAlwaysOn(existing: string | null, sourceBody: string): string {
  const block = wrapProductBlock(extractProductInner(sourceBody))
  if (existing === null) return block
  const text = existing.replace(/\r\n/g, '\n')
  const b = text.indexOf(PRODUCT_BEGIN)
  const e = text.indexOf(PRODUCT_END)
  if (b === -1 || e === -1 || e < b) {
    const prefix = text.endsWith('\n') ? text : `${text}\n`
    return `${prefix}\n${block}`
  }
  let rest = text.slice(e + PRODUCT_END.length)
  if (rest.startsWith('\n')) rest = rest.slice(1)
  return text.slice(0, b) + block + rest
}

function expandFromGlob(fromPat: string, root: string): string[] {
  const n = normalizeSlashPath(fromPat).replace(/^\.\//, '')
  if (n.endsWith('/*')) {
    const dirRel = n.slice(0, -2)
    const dirAbs = path.join(root, dirRel)
    if (!existsSync(dirAbs) || !statSync(dirAbs).isDirectory()) return []
    return readdirSync(dirAbs)
      .filter((f) => statSync(path.join(dirAbs, f)).isFile())
      .map((f) => normalizeSlashPath(path.join(dirRel, f)))
      .sort()
  }
  const abs = path.join(root, n)
  if (existsSync(abs) && statSync(abs).isFile()) return [n]
  return []
}

function expandSkillSources(fromPat: string, root: string): SkillSource[] {
  const n = normalizeSlashPath(fromPat).replace(/^\.\//, '')
  const out: SkillSource[] = []
  const walkFiles = (absDir: string, sourceDirRel: string, innerPrefix: string): void => {
    if (!existsSync(absDir) || !statSync(absDir).isDirectory()) return
    for (const name of readdirSync(absDir).sort()) {
      const abs = path.join(absDir, name)
      const st = statSync(abs)
      const sourceRel = normalizeSlashPath(path.join(sourceDirRel, name))
      const innerRel = normalizeSlashPath(path.join(innerPrefix, name))
      if (st.isDirectory()) {
        if (isExecuteHatSkipped(absDir, name, false)) continue
        walkFiles(abs, sourceRel, innerRel)
      } else if (st.isFile()) {
        out.push({ sourceRel, innerRel })
      }
    }
  }
  if (n.endsWith('/*')) {
    const parentRel = n.slice(0, -2)
    const parentAbs = path.join(root, parentRel)
    if (!existsSync(parentAbs) || !statSync(parentAbs).isDirectory()) {
      fail(`host 缺 skills 源目录: ${parentRel}`, 2)
    }
    for (const name of readdirSync(parentAbs).sort()) {
      const abs = path.join(parentAbs, name)
      if (!statSync(abs).isDirectory()) continue
      if (isExecuteHatSkipped(parentAbs, name, false)) continue
      walkFiles(abs, normalizeSlashPath(path.join(parentRel, name)), name)
    }
    return out.sort((a, b) => a.sourceRel.localeCompare(b.sourceRel))
  }
  const abs = path.join(root, n)
  if (existsSync(abs) && statSync(abs).isDirectory()) {
    if (!isExecuteHatSkipped(path.dirname(abs), path.basename(n), false)) {
      walkFiles(abs, n, path.basename(n))
    }
  }
  return out.sort((a, b) => a.sourceRel.localeCompare(b.sourceRel))
}

type BackupFamily = 'host-apply' | 'host-update'

function backupsRoot(target: string, family: BackupFamily): string {
  return kitLayoutJoin(target, 'backups', family)
}

function backupFile(target: string, genDir: string, rel: string): string {
  const src = path.join(target, rel)
  const dest = path.join(genDir, rel)
  mkdirSync(path.dirname(dest), { recursive: true })
  copyFileSync(src, dest)
  return dest
}

function atomicWrite(abs: string, body: string): void {
  mkdirSync(path.dirname(abs), { recursive: true })
  const tmp = `${abs}.tmp-host-apply-${process.pid}`
  writeFileSync(tmp, body, 'utf8')
  renameSync(tmp, abs)
}

function pruneBackups(target: string, family: BackupFamily): void {
  const root = backupsRoot(target, family)
  if (!existsSync(root)) return
  const gens = readdirSync(root)
    .filter((n) => statSync(path.join(root, n)).isDirectory())
    .sort()
  for (const old of gens.slice(0, Math.max(0, gens.length - BACKUP_KEEP))) {
    rmSync(path.join(root, old), { recursive: true, force: true })
  }
}

function hostBanner(command: HostWriteReport['command']): string {
  return command === 'host update' ? 'HOST UPDATE' : 'HOST APPLY'
}

function printHostHuman(report: HostWriteReport): void {
  const banner = hostBanner(report.command)
  console.log(`${banner}: ${report.mode}`)
  console.log(`hosts: ${report.hosts.join(', ')}`)
  const sections: Array<['planned' | 'written' | 'skipped' | 'conflict', string[]]> = [
    ['planned', report.planned],
    ['written', report.written],
    ['skipped', report.skipped],
    ['conflict', report.conflict],
  ]
  for (const [label, items] of sections) {
    console.log(`${label} (${items.length}):`)
    if (items.length === 0) console.log('  (无)')
    else for (const p of items) console.log(`  ${p}`)
  }
  if (report.backup) console.log(`backup: ${report.backup}`)
  console.log(`${banner}: ${report.verdict}`)
}

function emitHostFail(
  json: boolean,
  command: HostWriteReport['command'],
  payload: Omit<HostWriteReport, 'ok' | 'verdict'> & { errors?: HostValidateIssue[]; message?: string },
  extraLines: string[],
): never {
  if (json) {
    console.log(
      JSON.stringify(
        {
          ...payload,
          ok: false,
          verdict: 'FAIL',
        },
        null,
        2,
      ),
    )
  } else {
    for (const line of extraLines) console.error(line)
    console.log(`${hostBanner(command)}: FAIL`)
  }
  fail('', 2)
}

function tableVersionOf(data: unknown): string {
  if (isPlainObject(data) && typeof data.version === 'string') return data.version
  return ''
}

function emitU01Degraded(
  json: boolean,
  command: HostWriteReport['command'],
  base: Omit<HostWriteReport, 'ok' | 'verdict' | 'contract'>,
  contract: HostContractResult,
): never {
  const extraLines = [
    'U-01: 宿主契约不匹配（degraded），拒绝写盘',
    ...contract.reasons.map((r) => `  - ${r}`),
  ]
  emitHostFail(
    json,
    command,
    {
      ...base,
      planned: [],
      written: [],
      skipped: [],
      conflict: [],
      backup: null,
      contract,
    },
    extraLines,
  )
}

function commitPlannedWrites(
  target: string,
  items: PlannedItem[],
  family: BackupFamily,
): { written: string[]; backup: string | null } {
  const toWrite = items.filter((i) => i.op === 'write' || i.op === 'merge')
  for (const item of toWrite) assertNotS2Abs(item.destAbs)
  const needBackup = toWrite.filter((i) => existsSync(i.destAbs))
  let backup: string | null = null
  let genDir: string | null = null
  if (needBackup.length > 0) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-')
    genDir = path.join(backupsRoot(target, family), ts)
    mkdirSync(genDir, { recursive: true })
    backup = toRel(target, genDir)
  }
  const written: string[] = []
  for (const item of toWrite) {
    if (genDir && existsSync(item.destAbs)) backupFile(target, genDir, item.destRel)
    atomicWrite(item.destAbs, item.nextText)
    written.push(item.destRel)
  }
  if (needBackup.length > 0) pruneBackups(target, family)
  return { written, backup }
}

function planApply(opts: {
  target: string
  rows: HostRow[]
  toolIds: string[]
  profile: string
  pkgRoot: string
}): { items: PlannedItem[]; s2: string[] } {
  const items: PlannedItem[] = []
  const s2: string[] = []
  const rowById = new Map(opts.rows.map((r) => [r.host_id, r]))

  const pushDest = (destRelRaw: string, destAbs: string): string => {
    const destRel = normalizeSlashPath(destRelRaw)
    if (isS2RelPath(destRel) || isS2AbsPath(destAbs)) s2.push(destRel)
    return destRel
  }

  for (const hostId of opts.toolIds) {
    const row = rowById.get(hostId)
    if (!row) continue
    for (const entry of row.surfaces.always_on) {
      const sourceRel = normalizeSlashPath(entry.source)
      const sourceAbs = path.join(opts.pkgRoot, sourceRel)
      const destAbs = path.resolve(opts.target, entry.target)
      const destRel = pushDest(toRel(opts.target, destAbs), destAbs)
      if (!existsSync(sourceAbs)) {
        fail(`host apply 缺 always_on 源文件: ${sourceRel}`, 2)
      }
      const sourceBody = readFileSync(sourceAbs, 'utf8')
      const exists = existsSync(destAbs)
      const existing = exists ? readFileSync(destAbs, 'utf8') : null
      if (isMarkdownMergeTarget(destRel)) {
        if (existing && productSpanHasLocal(existing)) {
          items.push({
            hostId,
            kind: 'always_on',
            destRel,
            destAbs,
            sourceRel,
            sourceAbs,
            op: 'conflict',
            nextText: existing,
          })
          continue
        }
        const nextText = mergeMarkdownAlwaysOn(existing, sourceBody)
        let op: PlannedOp = exists ? 'merge' : 'write'
        if (existing !== null && existing === nextText) op = 'skip_identical'
        items.push({
          hostId,
          kind: 'always_on',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op,
          nextText,
        })
        continue
      }
      // .mdc 及其他 always_on：缺失则写；已存在不同内容：kit 管理则覆写，否则 conflict
      if (!exists) {
        items.push({
          hostId,
          kind: 'always_on',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op: 'write',
          nextText: sourceBody,
        })
        continue
      }
      if (existing === sourceBody) {
        items.push({
          hostId,
          kind: 'always_on',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op: 'skip_identical',
          nextText: sourceBody,
        })
        continue
      }
      if (isKitManagedContent(existing ?? '')) {
        items.push({
          hostId,
          kind: 'always_on',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op: 'write',
          nextText: sourceBody,
        })
      } else {
        items.push({
          hostId,
          kind: 'always_on',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op: 'conflict',
          nextText: sourceBody,
        })
      }
    }

    // skills：与表一致物化；跳过 30/40（isExecuteHatSkipped）
    for (const entry of row.surfaces.skills ?? []) {
      const sources = expandSkillSources(entry.from, opts.pkgRoot)
      for (const src of sources) {
        const sourceAbs = path.join(opts.pkgRoot, src.sourceRel)
        const destAbs = path.resolve(opts.target, entry.target_dir, src.innerRel)
        const destRel = pushDest(toRel(opts.target, destAbs), destAbs)
        const sourceBody = readFileSync(sourceAbs, 'utf8')
        const exists = existsSync(destAbs)
        const existing = exists ? readFileSync(destAbs, 'utf8') : null
        let op: PlannedOp = 'write'
        if (exists && existing === sourceBody) op = 'skip_identical'
        items.push({
          hostId,
          kind: 'skill',
          destRel,
          destAbs,
          sourceRel: src.sourceRel,
          sourceAbs,
          op,
          nextText: sourceBody,
        })
      }
    }

    for (const entry of row.surfaces.commands) {
      if (entry.profile && entry.profile !== opts.profile) continue
      const matched = expandFromGlob(entry.from, opts.pkgRoot).filter((rel) =>
        CORE_COMMAND_SET.has(path.basename(rel)),
      )
      const have = new Set(matched.map((rel) => path.basename(rel)))
      const missing = CORE_COMMAND_FILES.filter((n) => !have.has(n))
      if (missing.length > 0) {
        fail(
          `host apply 缺 core 命令资产（from=${entry.from}）: ${missing.join(', ')}`,
          2,
        )
      }
      for (const sourceRelRaw of matched) {
        const sourceRel = normalizeSlashPath(sourceRelRaw)
        const sourceAbs = path.join(opts.pkgRoot, sourceRel)
        const destAbs = path.resolve(opts.target, entry.target_dir, path.basename(sourceRel))
        const destRel = pushDest(toRel(opts.target, destAbs), destAbs)
        const sourceBody = readFileSync(sourceAbs, 'utf8')
        const exists = existsSync(destAbs)
        const existing = exists ? readFileSync(destAbs, 'utf8') : null
        let op: PlannedOp = 'write'
        if (exists && existing === sourceBody) op = 'skip_identical'
        items.push({
          hostId,
          kind: 'command',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op,
          nextText: sourceBody,
        })
      }
    }
  }
  return { items, s2 }
}

function remapUpdateConflicts(items: PlannedItem[], force: boolean): void {
  for (const item of items) {
    if ((item.kind === 'command' || item.kind === 'skill') && item.op === 'write' && existsSync(item.destAbs)) {
      if (!force) item.op = 'conflict'
    }
    if (item.kind === 'always_on' && item.op === 'conflict' && force) {
      const existing = existsSync(item.destAbs) ? readFileSync(item.destAbs, 'utf8') : ''
      if (!productSpanHasLocal(existing)) item.op = 'write'
    }
  }
}

async function cmdHostApply(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`用法: npx dsh-coding-kit ${APPLY_USAGE}`)
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
    fail(`host apply 须 --tools LIST（逗号分隔 host_id）\n用法: ${APPLY_USAGE}`)
  }
  const toolsIdx = rest.indexOf('--tools')
  if (toolsIdx + 1 >= rest.length || rest[toolsIdx + 1]!.startsWith('-')) {
    fail(`host apply 须 --tools LIST\n用法: ${APPLY_USAGE}`)
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

  const toolIds = uniqueKeepOrder(
    (toolsArg ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  )
  if (toolIds.length < 1) fail(`host apply 须 --tools LIST（逗号分隔 host_id）\n用法: ${APPLY_USAGE}`)

  const profile = profileArg ?? 'core'
  if (profile !== 'core') {
    fail(`host apply 本波仅支持 --profile core（收到: ${profile}）\n用法: ${APPLY_USAGE}`)
  }

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
    hosts: toolIds,
    planned: [] as string[],
    written: [] as string[],
    skipped: [] as string[],
    conflict: [] as string[],
    backup: null as string | null,
  }

  let data: unknown
  try {
    data = yamlLoad(readFileSync(fileAbs, 'utf8'))
  } catch (err) {
    const msg = `YAML 解析失败: ${(err as Error).message}`
    emitHostFail(json, 'host apply', { ...baseReport, errors: [{ path: '$', code: 'parse', message: msg }] }, [msg])
  }

  const issues = validateHostAdaptDoc(data)
  if (issues.length > 0) {
    emitHostFail(
      json,
      'host apply',
      { ...baseReport, errors: issues },
      issues.map((e) => `  - [${e.code}] ${e.path}: ${e.message}`),
    )
  }

  const rows = asHostRows(data)
  const known = new Set(rows.map((r) => r.host_id))
  const unknown = toolIds.filter((id) => !known.has(id))
  if (unknown.length > 0) {
    fail(`host apply 未知 host_id: ${unknown.join(', ')}\n用法: ${APPLY_USAGE}`)
  }

  const contract = evaluateHostContract(tableVersionOf(data))
  if (contract.status === 'degraded') {
    emitU01Degraded(json, 'host apply', baseReport, contract)
  }

  const { items, s2 } = planApply({
    target,
    rows,
    toolIds,
    profile,
    pkgRoot: packageRoot(),
  })
  if (s2.length > 0) {
    const uniq = uniqueKeepOrder(s2)
    emitHostFail(
      json,
      'host apply',
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

  let written: string[] = []
  let backup: string | null = null
  if (yes) {
    const committed = commitPlannedWrites(target, items, 'host-apply')
    written = committed.written
    backup = committed.backup
  }

  const report: HostWriteReport = {
    command: 'host apply',
    mode,
    hosts: toolIds,
    planned,
    written: yes ? written : [],
    skipped,
    conflict,
    backup,
    contract,
    ok: true,
    verdict: 'PASS',
  }
  if (json) console.log(JSON.stringify(report, null, 2))
  else printHostHuman(report)
}

async function cmdHostUpdate(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`用法: npx dsh-coding-kit ${UPDATE_USAGE}`)
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
  if (profile !== 'core') {
    fail(`host update 本波仅支持 --profile core（收到: ${profile}）\n用法: ${UPDATE_USAGE}`)
  }

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
    backup: null as string | null,
  }

  let data: unknown
  try {
    data = yamlLoad(readFileSync(fileAbs, 'utf8'))
  } catch (err) {
    const msg = `YAML 解析失败: ${(err as Error).message}`
    emitHostFail(json, 'host update', { ...baseReport, errors: [{ path: '$', code: 'parse', message: msg }] }, [
      msg,
    ])
  }

  const issues = validateHostAdaptDoc(data)
  if (issues.length > 0) {
    emitHostFail(
      json,
      'host update',
      { ...baseReport, errors: issues },
      issues.map((e) => `  - [${e.code}] ${e.path}: ${e.message}`),
    )
  }

  const rows = asHostRows(data)
  const knownIds = rows.map((r) => r.host_id)
  const known = new Set(knownIds)
  let toolIds: string[]
  if (toolsArg === undefined) {
    toolIds = uniqueKeepOrder(knownIds)
  } else {
    toolIds = uniqueKeepOrder(
      toolsArg
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    )
    if (toolIds.length < 1) fail(`host update 须 --tools LIST（逗号分隔 host_id）\n用法: ${UPDATE_USAGE}`)
  }
  const unknown = toolIds.filter((id) => !known.has(id))
  if (unknown.length > 0) {
    fail(`host update 未知 host_id: ${unknown.join(', ')}\n用法: ${UPDATE_USAGE}`)
  }
  baseReport.hosts = toolIds

  const contract = evaluateHostContract(tableVersionOf(data))
  if (contract.status === 'degraded') {
    emitU01Degraded(json, 'host update', baseReport, contract)
  }

  const { items, s2 } = planApply({
    target,
    rows,
    toolIds,
    profile,
    pkgRoot: packageRoot(),
  })
  remapUpdateConflicts(items, force)
  if (s2.length > 0) {
    const uniq = uniqueKeepOrder(s2)
    emitHostFail(
      json,
      'host update',
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

  let written: string[] = []
  let backup: string | null = null
  if (yes) {
    const committed = commitPlannedWrites(target, items, 'host-update')
    written = committed.written
    backup = committed.backup
  }

  const report: HostWriteReport = {
    command: 'host update',
    mode,
    hosts: toolIds,
    planned,
    written: yes ? written : [],
    skipped,
    conflict,
    backup,
    contract,
    ok: true,
    verdict: 'PASS',
  }
  if (json) console.log(JSON.stringify(report, null, 2))
  else printHostHuman(report)
}

export async function cmdHost(args: string[]): Promise<void> {
  const [sub, ...rest] = args
  if (sub === '--help' || sub === '-h') {
    console.log(`用法: npx dsh-coding-kit ${HOST_USAGE}`)
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
  fail(`host 子命令未知: ${sub}\n用法: ${HOST_USAGE}`)
}
