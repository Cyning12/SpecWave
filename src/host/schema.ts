import { isS2RelPath } from '../cli-shared.ts'

export type HostValidateIssue = {
  path: string
  code: 'schema' | 's2' | 'parse'
  message: string
}

export function isPlainObject(v: unknown): v is Record<string, unknown> {
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

// ─── 3.0 W1 阶段一 · schema_version 探测树（S2.1 · 评审文 §2.1/§3.1 · F-W1-03） ───

/** schema_version 探测结果（S2.1 探测树三分支） */
export type HostAdaptSchemaProbe =
  | { kind: 'v1' } // 键不存在 → v1 旧扁平语义（恒等）
  | { kind: 'v2' } // 整数 2 → v2 解析路径（本阶段为入口桩）
  | { kind: 'invalid'; issues: HostValidateIssue[] } // 非整数报红 / 未知整数 fail-closed

/**
 * schema_version 整数探测（S2.1 探测树 · 评审文 §3.1）：
 * 键不存在 → v1；整数 2 → v2 入口；整数 ≠ 2 → fail-closed「未知 schema_version」
 * （F-W1-03 明文覆盖 >2 · 探测树未定义 <2 整数语义，保守并入同一 fail-closed · 不得静默按旧格式解析）；
 * 非整数 → schema 校验报红。
 * 歧义边界（评审文 §2.1）：v1 根白名单仅 allow version/hosts ⇒ 合法 v1 表不可能含本键，探测无灰色地带。
 */
export function probeHostAdaptSchemaVersion(data: unknown): HostAdaptSchemaProbe {
  if (!isPlainObject(data)) return { kind: 'v1' } // 根非对象：交由 v1 校验报「根须为对象」（既有行为原样）
  if (!('schema_version' in data)) return { kind: 'v1' }
  const v = data['schema_version'] // 'schema_version' in data 守卫后读取（noUncheckedIndexedAccess 口径）
  if (typeof v === 'number' && Number.isInteger(v)) {
    if (v === 2) return { kind: 'v2' }
    return {
      kind: 'invalid',
      issues: [
        {
          path: '$.schema_version',
          code: 'schema',
          message: `未知 schema_version: ${v}（支持：缺省=v1 或 2 · 不得静默按旧格式解析）`,
        },
      ],
    }
  }
  return {
    kind: 'invalid',
    issues: [
      {
        path: '$.schema_version',
        code: 'schema',
        message: `schema_version 须为整数（收到: ${JSON.stringify(v) ?? String(v)}）`,
      },
    ],
  }
}

/**
 * 探测分派校验（S2.1 · 装载路径统一入口）：v1 → validateHostAdaptDoc 语义原样（逐字不变）；
 * v2 → 入口桩 fail-closed（全新校验 + defaults/extends 解析归 W1 后续阶段 · 不静默放行）；
 * invalid → 探测 issue（F-W1-03）。
 */
export function validateHostAdaptDocDispatch(data: unknown): HostValidateIssue[] {
  const probe = probeHostAdaptSchemaVersion(data)
  if (probe.kind === 'invalid') return probe.issues
  if (probe.kind === 'v2') {
    return [
      {
        path: '$.schema_version',
        code: 'schema',
        message:
          'schema_version 2 解析未实现（3.0 W1 后续阶段填充 · 本阶段仅探测树 + v1 兼容桥 · fail-closed 不静默）',
      },
    ]
  }
  return validateHostAdaptDoc(data)
}
