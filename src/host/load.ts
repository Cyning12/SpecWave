import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fail } from '../cli-shared.ts'
import { yamlLoad } from '../yaml.ts'
import { isPlainObject, validateHostAdaptDocDispatch } from './schema.ts'
import { commandSetsOf, explicitHooksHostIdsOf, resolvedHostRows } from './table.ts'
import type { CommandSets, ResolvedHostRow } from './resolve.ts'

/**
 * 3.0 W2 阶段三 · B5 接入面装载层（S3.6 · 验收 #3/#5/#11 · F-W2-02/03/08/09 · 硬约束 12）。
 * 加载优先级（定稿）：--file PATH → 当次整表替换（现状语义逐字保留 · 内置与用户目录均不参与合并）；
 * 无 --file → 内置表恒基底 + ~/.spec-wave/hosts/*.yaml 文件名序合并（用户表只增不改内置）。
 * 合并铁律三面（验收 #3 · U-01 同档 fail-closed · exit 2 零写入）：
 *  ① 用户表可新增宿主 id（物化/verify 对其生效）；
 *  ② 冲突拒绝：用户表 host_id ∩ 内置 ≠ ∅ → 拒 · 用户表间冲突后载者拒（点名 id）；
 *  ③ 表级隔离：损坏表（YAML 解析失败 / schema 非法）→ 点名（路径+原因）· 坏表内容不入合并 · 全命令阻断零写入。
 * catalog.yaml（可选）：sha256 呈现即强制（不符拒载点名 · F-W2-09）· 缺失照载标 integrity: none · 未登记标 uncataloged。
 * 30 裁决登记：
 *  ① 合并后 command_sets 取内置表（基底 · 产品命令资产面）· 用户表 command_sets 仅参与其自身 v2 校验不并入；
 *  ② 用户表资产 from/source 相对**表文件所在目录**解析（内置表相对 pkgRoot · planApply sourceRootOf 注入 ·
 *    第三方宿主资产随表分发 · 硬约束 12 接入面不依赖改包发版）；
 *  ③ 用户表 version/宿主契约不参与 evaluateHostContract（契约面锚定内置表 version · 现状不动）；
 *  ④ 用户目录不存在 = 零加载现状逐字（existsSync 守卫 · 缺失不崩）· 目录不可读 → exit 2 点名（F-W2-08 不静默当无表）。
 */

const USER_HOSTS_DIR_REL = path.join('.spec-wave', 'hosts')
const CATALOG_FILENAME = 'catalog.yaml'

/** 用户级宿主目录（纯函数注入 home · F-W2-08 跨平台语义一致断言锚点 · Windows 经 path.join 分隔符口径） */
export function userHostsDirOf(homeDir: string): string {
  return path.join(homeDir, USER_HOSTS_DIR_REL)
}

export type CatalogEntry = {
  file: string
  source?: string
  version?: string
  sha256?: string
}

export type UserCatalog = {
  version: string
  tables: CatalogEntry[]
}

/** catalog.yaml 装载：缺失 → null · YAML 坏 / 结构非法 → exit 2 点名（catalog 自身 fail-closed） */
export function loadUserCatalog(hostsDir: string): UserCatalog | null {
  const abs = path.join(hostsDir, CATALOG_FILENAME)
  if (!existsSync(abs)) return null
  let data: unknown
  try {
    data = yamlLoad(readFileSync(abs, 'utf8'))
  } catch (err) {
    fail(`catalog.yaml YAML 解析失败: ${abs}（${(err as Error).message}）`, 2)
  }
  if (!isPlainObject(data)) fail(`catalog.yaml 结构非法: ${abs}（根须为对象）`, 2)
  if (typeof data.version !== 'string' || data.version.trim().length < 1) {
    fail(`catalog.yaml 结构非法: ${abs}（version 须为非空字符串）`, 2)
  }
  const rawTables = data.tables
  const tables: CatalogEntry[] = []
  if (rawTables !== undefined) {
    if (!Array.isArray(rawTables)) fail(`catalog.yaml 结构非法: ${abs}（tables 须为数组）`, 2)
    rawTables.forEach((entry, i) => {
      if (!isPlainObject(entry) || typeof entry.file !== 'string' || entry.file.trim().length < 1) {
        fail(`catalog.yaml 结构非法: ${abs}（tables[${i}].file 须为非空字符串）`, 2)
      }
      const out: CatalogEntry = { file: entry.file.trim() }
      for (const key of ['source', 'version', 'sha256'] as const) {
        const v = entry[key]
        if (v !== undefined) {
          if (typeof v !== 'string' || v.trim().length < 1) {
            fail(`catalog.yaml 结构非法: ${abs}（tables[${i}].${key} 须为非空字符串）`, 2)
          }
          out[key] = v.trim()
        }
      }
      tables.push(out)
    })
  }
  return { version: (data.version as string).trim(), tables }
}

/** 用户表文件名序列表（确定性 · 排除 catalog.yaml · 目录缺失 → [] · 目录不可读 → exit 2 点名） */
export function listUserTableFiles(homeDir: string): string[] {
  const dir = userHostsDirOf(homeDir)
  if (!existsSync(dir)) return [] // 裁决④：无目录 = 现状逐字零加载
  let names: string[]
  try {
    names = readdirSync(dir)
  } catch (err) {
    fail(`用户宿主目录不可读: ${dir}（${(err as Error).message} · F-W2-08 不静默当无表）`, 2)
  }
  return names
    .filter((n) => {
      if (n === CATALOG_FILENAME) return false
      if (!n.endsWith('.yaml') && !n.endsWith('.yml')) return false
      try {
        return statSync(path.join(dir, n)).isFile()
      } catch {
        return false
      }
    })
    .sort()
}

export function sha256OfFile(abs: string): string {
  return createHash('sha256').update(readFileSync(abs)).digest('hex')
}

export type UserTableReport = {
  file: string
  hosts: string[]
  source: string
  /** ok = sha256 校验通过 · none = 无完整性声明（catalog 缺失或条目无 sha256）· uncataloged = catalog 未登记 */
  integrity: 'ok' | 'none' | 'uncataloged'
}

export type MergedHostTables = {
  rows: ResolvedHostRow[]
  commandSets: CommandSets
  explicitHooksHostIds: string[]
  /** 宿主 → 资产解析根（内置 → pkgRoot · 用户表宿主 → 表文件所在目录 · 裁决②） */
  sourceRootOf: (hostId: string) => string
  userTables: UserTableReport[]
  catalog: UserCatalog | null
}

/**
 * 用户目录合并（无 --file 时调用 · 内置恒基底）：装载/校验/冲突/完整性任一失败 → fail exit 2 点名
 *（零写入 · 调用点均在物化计划之前 · U-01 同档）。目录缺失 → 原样返回基底（零行为差）。
 */
export function mergeUserHostTables(opts: {
  baseData: unknown
  homeDir: string
  pkgRoot: string
}): MergedHostTables {
  const baseRows = resolvedHostRows(opts.baseData)
  const base: MergedHostTables = {
    rows: baseRows,
    commandSets: commandSetsOf(opts.baseData),
    explicitHooksHostIds: explicitHooksHostIdsOf(opts.baseData),
    sourceRootOf: () => opts.pkgRoot,
    userTables: [],
    catalog: null,
  }
  const files = listUserTableFiles(opts.homeDir)
  if (files.length === 0) {
    // catalog 可独立于表存在与否（目录存在但无表 · 仍读 catalog 供 host catalog list 一致口径）
    const dir = userHostsDirOf(opts.homeDir)
    if (existsSync(dir)) base.catalog = loadUserCatalog(dir)
    return base
  }
  const dir = userHostsDirOf(opts.homeDir)
  const catalog = loadUserCatalog(dir)
  base.catalog = catalog
  const catalogByFile = new Map((catalog?.tables ?? []).map((t) => [t.file, t]))

  const known = new Set(baseRows.map((r) => r.host_id))
  const rootByHost = new Map<string, string>()
  const rows = [...baseRows]
  const explicitIds = [...base.explicitHooksHostIds]
  const reports: UserTableReport[] = []

  for (const name of files) {
    const abs = path.join(dir, name)
    // catalog 完整性（F-W2-09 · 呈现即强制）：声明 sha256 与实测不符 → 拒载点名 exit 2 零写入
    const entry = catalogByFile.get(name)
    if (entry?.sha256 !== undefined) {
      const actual = sha256OfFile(abs)
      if (actual !== entry.sha256) {
        fail(
          `catalog 完整性不符（F-W2-09 · 拒载）: ${name} · 声明 sha256 ${entry.sha256} ≠ 实测 ${actual}`,
          2,
        )
      }
    }
    // 铁律③：损坏表点名（路径+原因）· 坏表内容不入合并 · 全命令阻断零写入
    let data: unknown
    try {
      data = yamlLoad(readFileSync(abs, 'utf8'))
    } catch (err) {
      fail(`用户适配表 YAML 解析失败（表级隔离 · 拒载）: ${abs}（${(err as Error).message}）`, 2)
    }
    const issues = validateHostAdaptDocDispatch(data)
    if (issues.length > 0) {
      fail(
        `用户适配表无效（表级隔离 · 拒载）: ${abs}\n${issues.map((e) => `  - [${e.code}] ${e.path}: ${e.message}`).join('\n')}`,
        2,
      )
    }
    const tableRows = resolvedHostRows(data)
    // 铁律②：冲突拒绝 —— 用户表 host_id ∩ 内置 → 拒 · 用户表间冲突后载者拒（点名 · exit 2 零写入）
    const conflicts = tableRows.map((r) => r.host_id).filter((id) => known.has(id))
    if (conflicts.length > 0) {
      fail(
        `用户适配表宿主冲突（合并铁律 · 拒载）: ${abs} · 冲突 host_id: ${conflicts.join(', ')}（内置与先载用户表不可覆盖 · 内置零污染）`,
        2,
      )
    }
    for (const row of tableRows) {
      known.add(row.host_id)
      rootByHost.set(row.host_id, dir)
      rows.push(row)
    }
    for (const id of explicitHooksHostIdsOf(data)) explicitIds.push(id)
    reports.push({
      file: name,
      hosts: tableRows.map((r) => r.host_id),
      source: entry?.source ?? '（未标注）',
      integrity: catalog === null ? 'none' : entry?.sha256 !== undefined ? 'ok' : entry ? 'none' : 'uncataloged',
    })
  }

  base.rows = rows
  base.explicitHooksHostIds = explicitIds
  base.sourceRootOf = (hostId) => rootByHost.get(hostId) ?? opts.pkgRoot
  base.userTables = reports
  return base
}
