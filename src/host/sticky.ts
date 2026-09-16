import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fail } from '../cli-shared.ts'
import { atomicWrite } from './backup.ts'
import { isPlainObject } from './schema.ts'
import { hostToolsStickyAbs, kitPackageSemver } from './table.ts'

export type HostToolsSticky = {
  version: number
  host_ids: string[]
  profile: string
  updated_at: string
  kit_semver?: string
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
