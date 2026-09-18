import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fail } from '../cli-shared.ts'
import { atomicWrite } from './backup.ts'
import { isPlainObject } from './schema.ts'
import { hostToolsStickyAbs, kitPackageSemver } from './table.ts'

/** 粘性表源（可选 · version 保持 1 · 缺省 = 走内置，同 3.0.0） */
export type HostToolsTableSource =
  | { kind: 'builtin' }
  | { kind: 'file'; path: string; sha256: string }

export type HostToolsSticky = {
  version: number
  host_ids: string[]
  profile: string
  updated_at: string
  kit_semver?: string
  /** 可选：apply/update 实际使用的表源；缺省时 verify 走内置 */
  table_source?: HostToolsTableSource
}

export function uniqueKeepOrder(ids: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of ids) {
    if (seen.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out
}

function parseTableSource(raw: unknown): HostToolsTableSource | undefined {
  if (raw === undefined) return undefined
  if (!isPlainObject(raw)) {
    fail('粘性文件 schema 无效: table_source 须为对象；请删除后重建', 2)
  }
  const kind = raw.kind
  if (kind === 'builtin') {
    return { kind: 'builtin' }
  }
  if (kind === 'file') {
    if (typeof raw.path !== 'string' || raw.path.trim().length < 1) {
      fail('粘性文件 schema 无效: table_source.path 须为非空字符串；请删除后重建', 2)
    }
    if (typeof raw.sha256 !== 'string' || raw.sha256.trim().length < 1) {
      fail('粘性文件 schema 无效: table_source.sha256 须为非空字符串；请删除后重建', 2)
    }
    return {
      kind: 'file',
      path: raw.path.trim(),
      sha256: raw.sha256.trim().toLowerCase(),
    }
  }
  fail(
    `粘性文件 schema 无效: table_source.kind 须为 builtin|file（收到: ${String(kind)}）；请删除后重建`,
    2,
  )
}

/** 解析并校验粘性 JSON；损坏 → exit 2；未知根字段忽略（反向兼容） */
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
  const tableSource = parseTableSource(data.table_source)
  if (tableSource !== undefined) sticky.table_source = tableSource
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

/**
 * 由 apply/update 实际表绝对路径构造粘性表源。
 * - fileArg 缺省 → builtin
 * - 否则 path 相对仓根（target）；sha256 记取证（verify 哈希不符仅 WARN）
 */
export function buildTableSourceForSticky(
  target: string,
  fileAbs: string,
  fileArg: string | undefined,
): HostToolsTableSource {
  if (fileArg === undefined) return { kind: 'builtin' }
  const rel = path.relative(target, fileAbs)
  const stored =
    rel.length > 0 && !path.isAbsolute(rel) ? rel.split(path.sep).join('/') : fileAbs
  const sha256 = createHash('sha256').update(readFileSync(fileAbs)).digest('hex')
  return { kind: 'file', path: stored, sha256 }
}

/** apply/update --yes 成功写盘后写入/更新粘性（dry-run 不调用） */
export function writeHostToolsSticky(
  target: string,
  hostIds: string[],
  profile: string,
  tableSource?: HostToolsTableSource,
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
  if (tableSource !== undefined) body.table_source = tableSource
  mkdirSync(path.dirname(abs), { recursive: true })
  atomicWrite(abs, `${JSON.stringify(body, null, 2)}\n`)
}
