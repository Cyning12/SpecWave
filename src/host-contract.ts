/**
 * U-01：宿主适配表 version + 可选 @deepseek-ai/dsh-tools peer 嗅探。
 * 手写简化 semver 范围（无新 npm 依赖）；不匹配 → degraded，调用方须零写入。
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { packageRoot } from './cli-shared.ts'

export const SUPPORTED_HOST_ADAPT_TABLE_VERSION = '1'
export const DEFAULT_DSH_TOOLS_PEER_RANGE = '>=0.0.1-rc.1 <0.2.0'
export const DSH_TOOLS_VERSION_ENV = 'DSH_CK_DSH_TOOLS_VERSION'
const DSH_TOOLS_PKG = '@deepseek-ai/dsh-tools'

export type HostContractStatus = 'ok' | 'degraded'

export type HostContractResult = {
  status: HostContractStatus
  reasons: string[]
}

export type SniffHostContractInput = {
  tableVersion: string
  dshToolsVersion?: string | null
  peerRange: string
}

type SemVer = { major: number; minor: number; patch: number; pre: string[] }

function parseSemVer(raw: string): SemVer | null {
  const m = raw.trim().match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/)
  if (!m) return null
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    pre: m[4] ? m[4].split('.') : [],
  }
}

function cmpIdent(a: string, b: string): number {
  const aNum = /^\d+$/.test(a)
  const bNum = /^\d+$/.test(b)
  if (aNum && bNum) return Number(a) - Number(b)
  if (aNum && !bNum) return -1
  if (!aNum && bNum) return 1
  return a < b ? -1 : a > b ? 1 : 0
}

function cmpSemVer(a: SemVer, b: SemVer): number {
  if (a.major !== b.major) return a.major - b.major
  if (a.minor !== b.minor) return a.minor - b.minor
  if (a.patch !== b.patch) return a.patch - b.patch
  if (a.pre.length === 0 && b.pre.length === 0) return 0
  if (a.pre.length === 0) return 1
  if (b.pre.length === 0) return -1
  const n = Math.max(a.pre.length, b.pre.length)
  for (let i = 0; i < n; i++) {
    if (i >= a.pre.length) return -1
    if (i >= b.pre.length) return 1
    const c = cmpIdent(a.pre[i]!, b.pre[i]!)
    if (c !== 0) return c
  }
  return 0
}

/** 简化范围：空格分隔的 `>=X` `>X` `<=X` `<X` `=X` 合取。 */
export function versionSatisfiesRange(version: string, range: string): boolean {
  const v = parseSemVer(version)
  if (!v) return false
  const tokens = range.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return false
  for (const token of tokens) {
    const m = token.match(/^(>=|>|<=|<|=)(.+)$/)
    if (!m) return false
    const bound = parseSemVer(m[2]!)
    if (!bound) return false
    const c = cmpSemVer(v, bound)
    const op = m[1]!
    const ok =
      op === '>=' ? c >= 0 : op === '>' ? c > 0 : op === '<=' ? c <= 0 : op === '<' ? c < 0 : c === 0
    if (!ok) return false
  }
  return true
}

export function sniffHostContract(input: SniffHostContractInput): HostContractResult {
  const reasons: string[] = []
  if (input.tableVersion !== SUPPORTED_HOST_ADAPT_TABLE_VERSION) {
    reasons.push(
      `U-01: 适配表 version=${JSON.stringify(input.tableVersion)} 不受支持（仅 "${SUPPORTED_HOST_ADAPT_TABLE_VERSION}"）`,
    )
  }
  const ver = typeof input.dshToolsVersion === 'string' ? input.dshToolsVersion.trim() : ''
  if (ver.length > 0) {
    const range =
      typeof input.peerRange === 'string' && input.peerRange.trim().length > 0
        ? input.peerRange.trim()
        : DEFAULT_DSH_TOOLS_PEER_RANGE
    if (!versionSatisfiesRange(ver, range)) {
      reasons.push(`U-01: ${DSH_TOOLS_PKG}@${ver} 超出 peer 范围 ${range}`)
    }
  }
  return reasons.length > 0 ? { status: 'degraded', reasons } : { status: 'ok', reasons: [] }
}

export function readKitDshToolsPeerRange(kitRoot = packageRoot()): string {
  try {
    const raw = readFileSync(path.join(kitRoot, 'package.json'), 'utf8')
    const pkg = JSON.parse(raw) as { peerDependencies?: Record<string, string> }
    const range = pkg.peerDependencies?.[DSH_TOOLS_PKG]
    if (typeof range === 'string' && range.trim().length > 0) return range.trim()
  } catch {
    /* 回落默认范围 */
  }
  return DEFAULT_DSH_TOOLS_PEER_RANGE
}

/** 测钩 `DSH_CK_DSH_TOOLS_VERSION` 覆盖探测值；空/未设则读 cwd 再 kit 的 node_modules。 */
export function probeDshToolsVersion(opts?: { cwd?: string; kitRoot?: string }): string | undefined {
  if (Object.prototype.hasOwnProperty.call(process.env, DSH_TOOLS_VERSION_ENV)) {
    const t = (process.env[DSH_TOOLS_VERSION_ENV] ?? '').trim()
    return t.length > 0 ? t : undefined
  }
  const cwd = opts?.cwd ?? process.cwd()
  const kitRoot = opts?.kitRoot ?? packageRoot()
  const roots = cwd === kitRoot ? [cwd] : [cwd, kitRoot]
  for (const root of roots) {
    const abs = path.join(root, 'node_modules', '@deepseek-ai', 'dsh-tools', 'package.json')
    if (!existsSync(abs)) continue
    try {
      const pkg = JSON.parse(readFileSync(abs, 'utf8')) as { version?: unknown }
      if (typeof pkg.version === 'string' && pkg.version.trim().length > 0) {
        return pkg.version.trim()
      }
    } catch {
      continue
    }
  }
  return undefined
}

export function evaluateHostContract(tableVersion: string): HostContractResult {
  return sniffHostContract({
    tableVersion,
    dshToolsVersion: probeDshToolsVersion(),
    peerRange: readKitDshToolsPeerRange(),
  })
}
