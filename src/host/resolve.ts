import { CORE_COMMAND_VERBS, EXPANDED_COMMAND_STEMS } from './commands.ts'
import type { HostValidateIssue } from './schema.ts'
import type { AlwaysOnEntry, CommandsEntry, DirFromEntry, HostRow } from './table.ts'

/**
 * 3.0 W1 · resolved 内部模型（S2.4/S2.5 · 评审文 §2.4/§3.2 · F-W1-11 一次性展开）。
 * v1 兼容桥（阶段一）+ v2 defaults/extends 解析器（阶段二）：校验后、消费前一次性展开为
 * 全量 resolved rows，下游（materialize/report/pins）只消费展开后行、零感知 extends/defaults。
 * 下游消费改造（materialize 改读表 command_sets · commands.ts 常量删除）归 W1 后续阶段。
 */

/** 根级 command_sets 形态（S2.5 · 评审文 §2.5）：core/expanded/forbidden 三节 */
export type CommandSets = {
  core: string[]
  expanded: string[]
  forbidden: string[]
}

/**
 * hooks 声明（S2.2 · W1 只声明与物化 · 运行时归宿主）。
 * 本阶段仅缺省形态 mechanism: none（评审文 §3.2 映射行④ · 与现状零行为差）；
 * shell-hook/config-hook 枚举校验归 hooks 阶段（v2 校验器扩展位）。
 */
export type HooksDecl = {
  mechanism: 'none'
}

/** verify 声明（S2.3 · v1 原样承接进 v2 同位置 · 可入 defaults 参与深合并） */
export type VerifyDecl = {
  kind: 'cli'
  bin: string
  failClosed?: boolean
}

/**
 * resolved host 行 = 全量展开后的行（F-W1-11：不得残留 extends/defaults 键 · 类型层无该键）。
 * v1 行：hooks 缺省注入（v1 surfaces 白名单不含 hooks ⇒ 注入永不覆写表值）。
 * v2 行：defaults → extends 链（拓扑序）→ 自身 surfaces 合并结果 + hooks 缺省注入。
 */
export type ResolvedHostRow = {
  host_id: string
  surfaces: {
    always_on: AlwaysOnEntry[]
    skills: DirFromEntry[]
    commands: CommandsEntry[]
    verify?: VerifyDecl
    hooks: HooksDecl
  }
}

/** resolved 适配表模型（校验后、消费前一次性展开 · 下游不感知 extends/缺省注入） */
export type ResolvedHostAdaptModel = {
  schemaVersion: 1 | 2
  /** version 字符串字段原样保留（评审文 §3.2 行① · 报告面 tableVersionOf 既有消费不动） */
  version: string
  commandSets: CommandSets
  rows: ResolvedHostRow[]
}

/** v1/v2 兼容桥缺省 hooks（评审文 §3.2 行④：无 hooks 键 → {mechanism: none} · 未声明缺省） */
export const V1_DEFAULT_HOOKS: HooksDecl = { mechanism: 'none' }

/** extends 链深上限（S2.4 拒绝面 · 评审文 §2.4 防御上限）：链深 = 自 host 起沿 extends 边的跳数 · ≤8 合法 · ≥9 报红 */
export const MAX_EXTENDS_DEPTH = 8

/**
 * 内建 command_sets 目录 = commands.ts:6-28 常量现值（S2.5 v1 兼容桥注入面 · 评审文 §3.2 行⑤）。
 * forbidden = kit-30 / kit-publish（commands.ts:17-19 注释纪律的机检化形态）。
 * OQ-6/F-W1-08：常量删除后本目录即唯一真值 · 逐字 fixture 锁定（test/w1-schema-version-detect.test.ts）。
 */
export function builtinCommandSets(): CommandSets {
  return {
    core: [...CORE_COMMAND_VERBS],
    expanded: [...EXPANDED_COMMAND_STEMS],
    forbidden: ['kit-30', 'kit-publish'],
  }
}

/**
 * v1 兼容桥（S2.5）：v1 旧扁平格式 → resolved 模型语义等价映射（评审文 §3.2 六行恒等）。
 * 前置：调用方已按探测分派（validateHostAdaptDocDispatch）判 v1 且零 issue。
 * 不 mutate 入参（rows/surfaces 浅拷贝注入 · v1 表面行为逐字不变）。
 */
export function resolveV1CompatModel(data: unknown): ResolvedHostAdaptModel {
  const root = data as { version: string; hosts: HostRow[] }
  return {
    schemaVersion: 1,
    version: root.version,
    commandSets: builtinCommandSets(),
    rows: root.hosts.map((row) => ({
      ...row,
      surfaces: { ...row.surfaces, hooks: { ...V1_DEFAULT_HOOKS } },
    })),
  }
}

// ─── 3.0 W1 阶段二 · defaults/extends 解析器（S2.4 · 评审文 §2.4 裁定表） ───

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

/**
 * surfaces 合并（S2.4 合并语义 · OQ-2 裁定）：标量子覆盖父 · 对象逐键深合并（递归）·
 * 数组整体替换（子声明该键即以子数组为准 · 未声明则继承）· 追加语法（+key 等）显式不做（留 v3 复议）。
 * 不 mutate 入参（每层浅拷贝后合并）。
 */
export function mergeSurfaces(
  parent: Record<string, unknown>,
  child: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...parent }
  for (const [key, value] of Object.entries(child)) {
    const parentValue = out[key]
    if (isRecord(value) && isRecord(parentValue)) {
      out[key] = mergeSurfaces(parentValue, value) // 对象逐键深合并（如 verify：子只写 failClosed 继承父 kind/bin）
    } else {
      out[key] = value // 标量覆盖 · 数组整体替换
    }
  }
  return out
}

/** v2 解析结果：resolved rows 或解析 issue（循环/未知目标/链深/host_id 重复） */
export type ResolveV2Result =
  | { ok: true; rows: ResolvedHostRow[] }
  | { ok: false; issues: HostValidateIssue[] }

type RawV2Row = { host_id: string; extends?: string; surfaces?: Record<string, unknown> }

/**
 * v2 defaults/extends 解析器（S2.4 · resolved rows 一次性展开）：
 * 解析序 defaults → extends 链（自最深祖先向 host 依次合并）→ host 自身 surfaces。
 * 拒绝面：循环继承报循环链（含自继承 A→A）· 未知 extend 目标点名 · 链深 >8 报红 ·
 * host_id 重复拒（extends 目标歧义 fail-closed · v2 only）。
 * defaults 自身 extends 的拒绝在结构校验层（schema.ts · 本函数不重复判）。
 * 前置：调用方已完成 v2 结构校验（行/键形态合法）。
 */
export function resolveV2Rows(data: unknown): ResolveV2Result {
  const root = data as { hosts: RawV2Row[]; defaults?: { surfaces?: Record<string, unknown> } }
  const issues: HostValidateIssue[] = []
  const byId = new Map<string, { index: number; row: RawV2Row }>()
  root.hosts.forEach((row, i) => {
    if (byId.has(row.host_id)) {
      issues.push({
        path: `$.hosts[${i}].host_id`,
        code: 'schema',
        message: `host_id 重复（v2 extends 目标歧义 · 拒）: ${row.host_id}`,
      })
      return
    }
    byId.set(row.host_id, { index: i, row })
  })
  if (issues.length > 0) return { ok: false, issues }

  const defaultsSurfaces: Record<string, unknown> = root.defaults?.surfaces ?? {}
  const rows: ResolvedHostRow[] = []
  for (const [hostId, { index, row }] of byId) {
    // 自 host 起沿 extends 边走链：chain = [起始 host, …祖先…]（末节点可为 defaults 伪节点）
    const chain: string[] = []
    let cur: string | null = hostId
    let failed = false
    while (cur !== null) {
      if (chain.includes(cur)) {
        const cycle = chain.slice(chain.indexOf(cur)).concat(cur)
        issues.push({
          path: `$.hosts[${index}].extends`,
          code: 'schema',
          message: `extends 循环继承（拒）: ${cycle.join(' → ')}`,
        })
        failed = true
        break
      }
      chain.push(cur)
      if (cur === 'defaults') break
      const entry = byId.get(cur)
      if (!entry) {
        issues.push({
          path: `$.hosts[${index}].extends`,
          code: 'schema',
          message: `extends 未知目标（拒）: ${cur}（链: ${chain.join(' → ')}）`,
        })
        failed = true
        break
      }
      cur = entry.row.extends ?? null
    }
    if (failed) continue
    const depth = chain.length - 1 // 链深 = extends 跳数（含指向 defaults 的最后一跳）
    if (depth > MAX_EXTENDS_DEPTH) {
      issues.push({
        path: `$.hosts[${index}].extends`,
        code: 'schema',
        message: `extends 链深超限（拒）: ${depth} > ${MAX_EXTENDS_DEPTH}（链: ${chain.join(' → ')}）`,
      })
      continue
    }
    // 一次性展开：自最深祖先向 host 依次合并（后者覆盖前者）
    let acc: Record<string, unknown> = {}
    for (let i = chain.length - 1; i >= 0; i -= 1) {
      const nodeId = chain[i]! // i 在 chain 下标界内（E5 收窄）
      const surfaces =
        nodeId === 'defaults' ? defaultsSurfaces : (byId.get(nodeId)!.row.surfaces ?? {})
      acc = mergeSurfaces(acc, surfaces)
    }
    rows.push({
      host_id: hostId,
      surfaces: { ...acc, hooks: { ...V1_DEFAULT_HOOKS } } as ResolvedHostRow['surfaces'],
    })
  }
  if (issues.length > 0) return { ok: false, issues }
  // 输出序 = 表声明序（byId 按首次声明插入 · 与 v1 asHostRows 行序同口径）
  return { ok: true, rows }
}

/**
 * v2 适配表 → resolved 模型（S2.4/S2.5）：resolved rows 一次性展开 + 内建 command_sets 目录
 * （v2 表 command_sets 入表校验归下一阶段 · 本阶段模型层先以内建目录承载 · F-W1-07 机检随后接入）。
 * 前置：调用方已完成 validateHostAdaptDocV2 结构校验且零 issue。
 */
export function resolveV2Model(
  data: unknown,
): { ok: true; model: ResolvedHostAdaptModel } | { ok: false; issues: HostValidateIssue[] } {
  const root = data as { version: string }
  const resolved = resolveV2Rows(data)
  if (!resolved.ok) return { ok: false, issues: resolved.issues }
  return {
    ok: true,
    model: {
      schemaVersion: 2,
      version: root.version,
      commandSets: builtinCommandSets(),
      rows: resolved.rows,
    },
  }
}
