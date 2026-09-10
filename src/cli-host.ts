/**
 * host 子命令（2.x W1）：仅 validate（只读）；禁止 apply / 物化写盘。
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fail, isS2RelPath, packageRoot, takeOption } from './cli-shared.ts'
import { yamlLoad } from './yaml.ts'

const HOST_USAGE =
  'host validate [--file PATH] [--json]\n  （本波仅 validate；无 host apply）'

const DEFAULT_EXAMPLE_REL = path.join('assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')

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
  fail(`host 子命令未知: ${sub}\n用法: ${HOST_USAGE}`)
}
