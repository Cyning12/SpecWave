import { isS2RelPath } from '../cli-shared.ts'
import { resolveV2Model } from './resolve.ts'

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

/**
 * v2 partial 级 verify 校验（S2.3/S2.4 · 深合并中间层）：键白名单 + 呈现键型别；
 * 完备性（kind 必为 "cli" · bin 必填）在 resolved 展开后由 validateVerify 全量复核。
 */
function validateVerifyPartial(v: unknown, base: string, issues: HostValidateIssue[]): void {
  if (!isPlainObject(v)) {
    issues.push({ path: base, code: 'schema', message: '须为对象' })
    return
  }
  const extra = Object.keys(v).filter((k) => !['kind', 'bin', 'failClosed'].includes(k))
  if (extra.length > 0) {
    issues.push({ path: base, code: 'schema', message: `未知字段: ${extra.join(', ')}` })
  }
  if (v.kind !== undefined && v.kind !== 'cli') {
    issues.push({ path: `${base}.kind`, code: 'schema', message: `须为 "cli"` })
  }
  if (v.bin !== undefined) requireString(v, 'bin', base, issues)
  if (v.failClosed !== undefined && typeof v.failClosed !== 'boolean') {
    issues.push({ path: `${base}.failClosed`, code: 'schema', message: '须为 boolean' })
  }
}

/**
 * v2 单级 surfaces partial 校验（defaults.surfaces / 带 extends 的 host 行 · S2.4）：
 * 键白名单（always_on/skills/commands/verify · hooks 归后续阶段 · 出现即 未知字段 fail-closed）；
 * 出现的节按 v1 同口径校验形状（数组条目全量校验 · verify 走 partial）；三节必填在 resolved 展开后复核。
 */
function validateV2SurfacesLevel(surfaces: unknown, base: string, issues: HostValidateIssue[]): void {
  if (!isPlainObject(surfaces)) {
    issues.push({ path: base, code: 'schema', message: '须为对象' })
    return
  }
  const extra = Object.keys(surfaces).filter(
    (k) => !['always_on', 'skills', 'commands', 'verify'].includes(k),
  )
  if (extra.length > 0) {
    issues.push({ path: base, code: 'schema', message: `未知字段: ${extra.join(', ')}` })
  }
  if ('always_on' in surfaces) validateAlwaysOn(surfaces.always_on, `${base}.always_on`, issues)
  if ('skills' in surfaces) validateDirFrom(surfaces.skills, `${base}.skills`, issues)
  if ('commands' in surfaces) {
    validateDirFrom(surfaces.commands, `${base}.commands`, issues, { allowProfile: true })
  }
  if ('verify' in surfaces) validateVerifyPartial(surfaces.verify, `${base}.verify`, issues)
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

/**
 * v2 完整校验（S2.1 v2 路径 · S2.3 verify 承接 · S2.4 defaults/extends · 阶段二填实入口桩）：
 * ① 结构级：根/defaults/行键白名单 + 各级 surfaces partial 形状校验（出现节按 v1 同口径 · verify 走 partial）；
 * ② extends 解析：循环报链（含自继承）· 未知目标点名 · 链深 >8 · host_id 重复（resolveV2Model 同口径）；
 * ③ resolved 完备性：三节必填（展开后仍缺即报红）+ verify 全量校验（validateVerify 语义保留承接）。
 * hooks/command_sets 校验归后续阶段：surfaces 白名单暂不含 hooks · 根白名单暂不含 command_sets
 * （出现即 未知字段 fail-closed · F-W1-07 机检随 command_sets 阶段接入）。
 */
export function validateHostAdaptDocV2(data: unknown): HostValidateIssue[] {
  const issues: HostValidateIssue[] = []
  if (!isPlainObject(data)) {
    issues.push({ path: '$', code: 'schema', message: '根须为对象' })
    return issues
  }
  const extraRoot = Object.keys(data).filter(
    (k) => !['version', 'schema_version', 'hosts', 'defaults'].includes(k),
  )
  if (extraRoot.length > 0) {
    issues.push({ path: '$', code: 'schema', message: `未知字段: ${extraRoot.join(', ')}` })
  }
  requireString(data, 'version', '$', issues)
  if (data.schema_version !== 2) {
    issues.push({ path: '$.schema_version', code: 'schema', message: 'v2 表 schema_version 须为整数 2' })
  }
  if (data.defaults !== undefined) {
    if (!isPlainObject(data.defaults)) {
      issues.push({ path: '$.defaults', code: 'schema', message: '须为对象' })
    } else {
      if ('extends' in data.defaults) {
        issues.push({
          path: '$.defaults.extends',
          code: 'schema',
          message: 'defaults 自身不得 extends（拒）',
        })
      }
      const extraDefaults = Object.keys(data.defaults).filter((k) => k !== 'surfaces' && k !== 'extends')
      if (extraDefaults.length > 0) {
        issues.push({
          path: '$.defaults',
          code: 'schema',
          message: `未知字段: ${extraDefaults.join(', ')}`,
        })
      }
      if ('surfaces' in data.defaults) {
        validateV2SurfacesLevel(data.defaults.surfaces, '$.defaults.surfaces', issues)
      }
    }
  }
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
    const extra = Object.keys(row).filter((k) => !['host_id', 'surfaces', 'extends'].includes(k))
    if (extra.length > 0) {
      issues.push({ path: p, code: 'schema', message: `未知字段: ${extra.join(', ')}` })
    }
    requireString(row, 'host_id', p, issues)
    if (row.extends !== undefined && (typeof row.extends !== 'string' || row.extends.trim().length < 1)) {
      issues.push({
        path: `${p}.extends`,
        code: 'schema',
        message: '须为非空字符串（host_id 或 "defaults"）',
      })
    }
    if ('surfaces' in row) validateV2SurfacesLevel(row.surfaces, `${p}.surfaces`, issues)
  })
  if (issues.length > 0) return issues
  // ② extends 解析（拒绝面同 S2.4 · resolveV2Model 单口径）
  const resolved = resolveV2Model(data)
  if (!resolved.ok) return resolved.issues
  // ③ resolved 完备性（resolved rows 与 hosts 声明序一一对应 · resolveV2Rows 输出序 = 声明序）
  resolved.model.rows.forEach((row, i) => {
    const p = `$.hosts[${i}].surfaces`
    const surfaces = row.surfaces as Record<string, unknown>
    for (const req of ['always_on', 'skills', 'commands'] as const) {
      if (!(req in surfaces)) {
        issues.push({
          path: `${p}.${req}`,
          code: 'schema',
          message: '必填（defaults/extends 展开后仍缺失）',
        })
      }
    }
    if (surfaces.verify !== undefined) validateVerify(surfaces.verify, `${p}.verify`, issues)
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
 * v2 → validateHostAdaptDocV2 完整校验（结构级 + extends 解析 + resolved 完备性 · 阶段二填实）；
 * invalid → 探测 issue（F-W1-03）。
 */
export function validateHostAdaptDocDispatch(data: unknown): HostValidateIssue[] {
  const probe = probeHostAdaptSchemaVersion(data)
  if (probe.kind === 'invalid') return probe.issues
  if (probe.kind === 'v2') return validateHostAdaptDocV2(data) // v2 完整校验（阶段二填实 · S2.3/S2.4）
  return validateHostAdaptDoc(data)
}
