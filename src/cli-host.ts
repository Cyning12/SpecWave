/**
 * host 子命令（2.x W1–W4）：validate + apply + update。
 * apply：always_on + commands(core|expanded) + skills（跳过 30/40）。
 * update：刷新产品 commands/skills；conflict 默认不覆盖（`--force` 显式）。
 * U-01：契约嗅探不匹配 → exit 2 零写入。
 * 2.1.1 W1：`.coding-kit/host-tools.json` 粘性；`--tools all`；成功 --yes 写粘性。
 * 2.1.1 W2：`host update` 解析序 A — CLI `--tools` → 粘性 → 否则 exit 1。
 * 2.1.1 W3：`init --tools` 同进程可调用 `cmdHost(['apply', …])`（勿 shell 自调）。
 * 本波禁止：bump / publish / 默认分发 30/40 / onboard / kit-30 slash。
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
  unlinkSync,
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
  'host validate [--file PATH] [--json]\n  host apply --tools LIST|all [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes]\n  host update [--tools LIST|all] [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes] [--force]'

const APPLY_USAGE =
  'host apply --tools cursor,claude|all [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes]'

const UPDATE_USAGE =
  'host update [--tools LIST|all] [--profile core|expanded] [--target PATH] [--file PATH] [--json] [--dry-run|--yes] [--force]'

const DEFAULT_EXAMPLE_REL = path.join('assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')

/** 粘性文件（相对 `.coding-kit/`） */
const HOST_TOOLS_STICKY_REL = 'host-tools.json'

export type HostToolsSticky = {
  version: number
  host_ids: string[]
  profile: string
  updated_at: string
  kit_semver?: string
}

function hostToolsStickyAbs(target: string): string {
  return kitLayoutJoin(target, HOST_TOOLS_STICKY_REL)
}

function kitPackageSemver(): string | undefined {
  try {
    const raw = readFileSync(path.join(packageRoot(), 'package.json'), 'utf8')
    const pkg = JSON.parse(raw) as { version?: unknown }
    return typeof pkg.version === 'string' && pkg.version.trim().length > 0
      ? pkg.version.trim()
      : undefined
  } catch {
    return undefined
  }
}

/** 解析并校验粘性 JSON；损坏 → exit 2 */
export function parseHostToolsSticky(raw: string): HostToolsSticky {
  let data: unknown
  try {
    data = JSON.parse(raw) as unknown
  } catch {
    fail(
      '粘性文件 JSON 损坏: .coding-kit/host-tools.json（请删除后重新 host apply / update）',
      2,
    )
  }
  if (!isPlainObject(data)) {
    fail(
      '粘性文件 schema 无效: .coding-kit/host-tools.json（根须为对象；请删除后重建）',
      2,
    )
  }
  if (data.version !== 1) {
    fail(
      `粘性文件 schema 无效: version 须为 1（收到: ${String(data.version)}）；请删除后重建`,
      2,
    )
  }
  if (
    !Array.isArray(data.host_ids) ||
    data.host_ids.length < 1 ||
    !data.host_ids.every((id) => typeof id === 'string' && id.trim().length > 0)
  ) {
    fail(
      '粘性文件 schema 无效: host_ids 须为非空字符串数组；请删除后重建',
      2,
    )
  }
  if (typeof data.profile !== 'string' || data.profile.trim().length < 1) {
    fail('粘性文件 schema 无效: profile 须为非空字符串；请删除后重建', 2)
  }
  if (typeof data.updated_at !== 'string' || data.updated_at.trim().length < 1) {
    fail('粘性文件 schema 无效: updated_at 须为非空字符串；请删除后重建', 2)
  }
  if (data.kit_semver !== undefined && typeof data.kit_semver !== 'string') {
    fail('粘性文件 schema 无效: kit_semver 须为字符串；请删除后重建', 2)
  }
  const sticky: HostToolsSticky = {
    version: 1,
    host_ids: uniqueKeepOrder(
      (data.host_ids as string[]).map((s) => s.trim()).filter((s) => s.length > 0),
    ),
    profile: data.profile.trim(),
    updated_at: data.updated_at.trim(),
  }
  if (typeof data.kit_semver === 'string' && data.kit_semver.trim().length > 0) {
    sticky.kit_semver = data.kit_semver.trim()
  }
  return sticky
}

/** 读取粘性；缺失 → null；损坏 → exit 2 */
export function loadHostToolsSticky(target: string): HostToolsSticky | null {
  const abs = hostToolsStickyAbs(target)
  if (!existsSync(abs)) return null
  let raw: string
  try {
    raw = readFileSync(abs, 'utf8')
  } catch {
    fail('粘性文件无法读取: .coding-kit/host-tools.json（请删除后重建）', 2)
  }
  return parseHostToolsSticky(raw)
}

/** apply/update --yes 成功写盘后写入/更新粘性（dry-run 不调用） */
export function writeHostToolsSticky(
  target: string,
  hostIds: string[],
  profile: string,
): void {
  const abs = hostToolsStickyAbs(target)
  const body: HostToolsSticky = {
    version: 1,
    host_ids: uniqueKeepOrder(hostIds),
    profile,
    updated_at: new Date().toISOString(),
  }
  const semver = kitPackageSemver()
  if (semver) body.kit_semver = semver
  mkdirSync(path.dirname(abs), { recursive: true })
  atomicWrite(abs, `${JSON.stringify(body, null, 2)}\n`)
}

/**
 * 解析 --tools LIST|all（`none` 仅 init，apply/update 拒）。
 * `all` = 适配表全部 host_id（表顺序）。
 */
function resolveToolsList(
  toolsArg: string,
  knownIds: string[],
  cmd: 'host apply' | 'host update',
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

/** core 五 verb：Cursor 扁平 kit-<verb>.md；Claude 子目录 <verb>.md */
const CORE_COMMAND_VERBS = [
  'verify',
  'gate-status',
  'init-guide',
  'apply-standards',
  'hat-reanchor',
] as const

type CoreCommandVerb = (typeof CORE_COMMAND_VERBS)[number]

/**
 * expanded stems：Cursor = kit-<stem>.md；Claude kit/ = <stem>.md → /kit:<stem>
 * 至少五条 hat；另含 graph-check / sync-prompts-guide。禁 kit-30 / kit-publish。
 */
const EXPANDED_COMMAND_STEMS = [
  'hat-00-delegate',
  'hat-10-spec',
  'hat-10-task',
  'hat-20-spec-audit',
  'hat-20-task-audit',
  'graph-check',
  'sync-prompts-guide',
] as const

type ExpandedCommandStem = (typeof EXPANDED_COMMAND_STEMS)[number]

function parseCoreCommandBasename(base: string): CoreCommandVerb | null {
  for (const verb of CORE_COMMAND_VERBS) {
    if (base === `kit-${verb}.md` || base === `${verb}.md`) return verb
  }
  return null
}

function parseExpandedCommandBasename(base: string): ExpandedCommandStem | null {
  for (const stem of EXPANDED_COMMAND_STEMS) {
    if (base === `kit-${stem}.md` || base === `${stem}.md`) return stem
  }
  return null
}

/** expanded ⊇ core：请求 expanded 时仍物化 profile:core 条目 */
function commandEntryApplies(entryProfile: string | undefined, requested: string): boolean {
  if (!entryProfile) return true
  if (entryProfile === requested) return true
  if (requested === 'expanded' && entryProfile === 'core') return true
  return false
}

function assertHostProfile(profile: string, cmd: 'host apply' | 'host update', usage: string): void {
  if (profile !== 'core' && profile !== 'expanded') {
    fail(`${cmd} 仅支持 --profile core|expanded（收到: ${profile}）\n用法: ${usage}`)
  }
}

/** 旧 Claude 扁平落点（2.0）：.claude/commands/kit-<verb>.md */
function legacyClaudeFlatCommandRels(): string[] {
  return CORE_COMMAND_VERBS.map((v) => `.claude/commands/kit-${v}.md`)
}

function findLegacyClaudeFlatCommands(target: string): string[] {
  return legacyClaudeFlatCommandRels().filter((rel) => existsSync(path.join(target, rel)))
}

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

/** 适配表 host_id 列表（表顺序）；供 init 询问 / `--tools` 校验复用 */
export function listKnownHostIds(fileArg?: string): string[] {
  const fileAbs = resolveValidateFile(fileArg)
  if (!existsSync(fileAbs)) {
    fail(`host 适配表不存在: ${fileAbs}`)
  }
  let data: unknown
  try {
    data = yamlLoad(readFileSync(fileAbs, 'utf8'))
  } catch (err) {
    fail(`host 适配表 YAML 解析失败: ${(err as Error).message}`)
  }
  const issues = validateHostAdaptDoc(data)
  if (issues.length > 0) {
    fail(
      `host 适配表无效:\n${issues.map((e) => `  - [${e.code}] ${e.path}: ${e.message}`).join('\n')}`,
    )
  }
  return asHostRows(data).map((r) => r.host_id)
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
  /** 旧 Claude 扁平 kit-*.md 将删/已删（备份后清除，禁新旧双份） */
  removed: string[]
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
  const sections: Array<
    ['planned' | 'written' | 'skipped' | 'conflict' | 'removed', string[]]
  > = [
    ['planned', report.planned],
    ['written', report.written],
    ['skipped', report.skipped],
    ['conflict', report.conflict],
    ['removed', report.removed],
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
      removed: [],
      backup: null,
      contract,
    },
    extraLines,
  )
}

function ensureBackupGen(
  target: string,
  family: BackupFamily,
  genDir: string | null,
): { genDir: string; backup: string } {
  if (genDir) return { genDir, backup: toRel(target, genDir) }
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const next = path.join(backupsRoot(target, family), ts)
  mkdirSync(next, { recursive: true })
  return { genDir: next, backup: toRel(target, next) }
}

function commitPlannedWrites(
  target: string,
  items: PlannedItem[],
  family: BackupFamily,
  legacyRemoveRels: string[] = [],
): { written: string[]; removed: string[]; backup: string | null } {
  const toWrite = items.filter((i) => i.op === 'write' || i.op === 'merge')
  for (const item of toWrite) assertNotS2Abs(item.destAbs)
  const needBackup =
    toWrite.some((i) => existsSync(i.destAbs)) || legacyRemoveRels.length > 0
  let backup: string | null = null
  let genDir: string | null = null
  if (needBackup) {
    const ensured = ensureBackupGen(target, family, null)
    genDir = ensured.genDir
    backup = ensured.backup
  }
  const written: string[] = []
  for (const item of toWrite) {
    if (genDir && existsSync(item.destAbs)) backupFile(target, genDir, item.destRel)
    atomicWrite(item.destAbs, item.nextText)
    written.push(item.destRel)
  }
  const removed: string[] = []
  for (const rel of legacyRemoveRels) {
    const abs = path.join(target, rel)
    if (!existsSync(abs)) continue
    if (!genDir) {
      const ensured = ensureBackupGen(target, family, genDir)
      genDir = ensured.genDir
      backup = ensured.backup
    }
    backupFile(target, genDir, rel)
    unlinkSync(abs)
    removed.push(rel)
  }
  if (needBackup || removed.length > 0) pruneBackups(target, family)
  return { written, removed, backup }
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
      if (!commandEntryApplies(entry.profile, opts.profile)) continue
      const band: 'core' | 'expanded' = entry.profile === 'expanded' ? 'expanded' : 'core'
      const matched = expandFromGlob(entry.from, opts.pkgRoot).filter((rel) => {
        const base = path.basename(rel)
        return band === 'core'
          ? parseCoreCommandBasename(base) !== null
          : parseExpandedCommandBasename(base) !== null
      })
      if (band === 'core') {
        const have = new Set(
          matched
            .map((rel) => parseCoreCommandBasename(path.basename(rel)))
            .filter((v): v is CoreCommandVerb => v !== null),
        )
        const missing = CORE_COMMAND_VERBS.filter((v) => !have.has(v))
        if (missing.length > 0) {
          fail(
            `host apply 缺 core 命令资产（from=${entry.from}）: ${missing.map((v) => `${v}.md|kit-${v}.md`).join(', ')}`,
            2,
          )
        }
      } else {
        const have = new Set(
          matched
            .map((rel) => parseExpandedCommandBasename(path.basename(rel)))
            .filter((v): v is ExpandedCommandStem => v !== null),
        )
        const missing = EXPANDED_COMMAND_STEMS.filter((v) => !have.has(v))
        if (missing.length > 0) {
          fail(
            `host apply 缺 expanded 命令资产（from=${entry.from}）: ${missing.map((v) => `${v}.md|kit-${v}.md`).join(', ')}`,
            2,
          )
        }
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
  const knownIds = rows.map((r) => r.host_id)
  const known = new Set(knownIds)
  const toolIds = resolveToolsList(toolsArg ?? '', knownIds, 'host apply', APPLY_USAGE)
  baseReport.hosts = toolIds
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
  // Claude 在工具列表时：清除旧扁平 kit-*.md，禁止与 kit/<verb>.md 双份并存
  const legacyRemove = toolIds.includes('claude') ? findLegacyClaudeFlatCommands(target) : []

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
    contract,
    ok: true,
    verdict: 'PASS',
  }
  if (json) console.log(JSON.stringify(report, null, 2))
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
  const legacyRemove = toolIds.includes('claude') ? findLegacyClaudeFlatCommands(target) : []

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
  fail(`host 子命令未知: ${sub}\n用法: ${HOST_USAGE}`)
}
