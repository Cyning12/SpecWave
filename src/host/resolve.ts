import type { HostValidateIssue } from './schema.ts'
import type { AlwaysOnEntry, CommandsEntry, DirFromEntry, HostRow } from './table.ts'

/**
 * 3.0 W1 · resolved 内部模型（S2.4/S2.5 · 评审文 §2.4/§3.2 · F-W1-11 一次性展开）。
 * v1 兼容桥（阶段一）+ v2 defaults/extends 解析器（阶段二）+ hooks 合并与 command_sets 数据源
 * （阶段三）：校验后、消费前一次性展开为全量 resolved rows，下游（materialize/report/pins）
 * 只消费展开后行、零感知 extends/defaults。内建 command_sets 目录字面量锚定本文件（OQ-6 单锚 ·
 * commands.ts 常量已删除 · F-W1-08）。
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
export type HooksDecl =
  | { mechanism: 'none' }
  | {
      mechanism: 'shell-hook' | 'config-hook'
      /** OQ-1 定稿两值（pre-close 合并入 pre-archive · task S2.2 论证） */
      triggers: ('pre-commit' | 'pre-archive')[]
      command: string
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
  /**
   * 显式 hooks 声明宿主（3.0 W2 阶段二 · S3.5 降级留痕锚点）：v2 表 hooks 键来自声明
   * （行级或经 defaults/extends 合并）的 host_id 集；v1 = []（未声明缺省注入 · 与显式 none 可区分 ·
   * 30 裁决：degraded 注记仅显式声明 none 留痕 · v1/外部表静默零行为变化）。
   */
  explicitHooksHostIds: string[]
}

/** v1/v2 兼容桥缺省 hooks（评审文 §3.2 行④：无 hooks 键 → {mechanism: none} · 未声明缺省） */
export const V1_DEFAULT_HOOKS: HooksDecl = { mechanism: 'none' }

/** extends 链深上限（S2.4 拒绝面 · 评审文 §2.4 防御上限）：链深 = 自 host 起沿 extends 边的跳数 · ≤8 合法 · ≥9 报红 */
export const MAX_EXTENDS_DEPTH = 8

/**
 * 内建 command_sets 目录字面量（S2.5 v1 兼容桥注入面 · 评审文 §3.2 行⑤）。
 * = 原 commands.ts:6-28 常量现值（3.0 W1 阶段三常量删除 · 本组字面量成为唯一真值锚）。
 * forbidden = kit-30 / kit-publish（原 commands.ts:17-19 注释纪律的机检化 · 永不可被表声明移除）。
 * OQ-6/F-W1-08：逐字 fixture 锁定（test/w1-schema-version-detect.test.ts）。
 */
export const BUILTIN_CORE_COMMANDS = [
  'verify',
  'gate-status',
  'init-guide',
  'apply-standards',
  'hat-reanchor',
] as const

export const BUILTIN_EXPANDED_COMMANDS = [
  'hat-00-delegate',
  'hat-10-spec',
  'hat-10-task',
  'hat-20-spec-audit',
  'hat-20-task-audit',
  'graph-check',
  'sync-prompts-guide',
] as const

export const BUILTIN_FORBIDDEN_COMMANDS = ['kit-30', 'kit-publish'] as const

/** 内建 command_sets 目录（v1 兼容桥注入面 · 逐字 = 原常量现值） */
export function builtinCommandSets(): CommandSets {
  return {
    core: [...BUILTIN_CORE_COMMANDS],
    expanded: [...BUILTIN_EXPANDED_COMMANDS],
    forbidden: [...BUILTIN_FORBIDDEN_COMMANDS],
  }
}

/**
 * 有效 command_sets（S2.5）：v2 表声明值 + forbidden 并集语义 —— 内建禁词（kit-30/kit-publish）
 * 永不可被表声明移除，表声明 forbidden 在其上追加自定义禁词。前置：声明已经 validateCommandSets 校验。
 */
export function effectiveCommandSets(declared: CommandSets | undefined): CommandSets {
  if (!declared) return builtinCommandSets()
  return {
    core: [...declared.core],
    expanded: [...declared.expanded],
    forbidden: [...new Set([...BUILTIN_FORBIDDEN_COMMANDS, ...(declared.forbidden ?? [])])],
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
    explicitHooksHostIds: [], // v1 白名单不含 hooks ⇒ 必为未声明缺省（S3.5 静默口径）
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
  | { ok: true; rows: ResolvedHostRow[]; explicitHooksHostIds: string[] }
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
  const explicitHooksHostIds: string[] = []
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
    // 显式声明判定（S3.5）：合并结果含 hooks 键 = 声明来自行级或 defaults/extends 链（显式）
    if ('hooks' in acc) explicitHooksHostIds.push(hostId)
    rows.push({
      host_id: hostId,
      // hooks：声明（含 defaults/extends 深合并结果）保留 · 未声明注入 {mechanism:none} 缺省（评审文 §3.2 行④）
      surfaces: { ...acc, hooks: acc.hooks ?? { ...V1_DEFAULT_HOOKS } } as ResolvedHostRow['surfaces'],
    })
  }
  if (issues.length > 0) return { ok: false, issues }
  // 输出序 = 表声明序（byId 按首次声明插入 · 与 v1 asHostRows 行序同口径）
  return { ok: true, rows, explicitHooksHostIds }
}

/**
 * v2 适配表 → resolved 模型（S2.4/S2.5）：resolved rows 一次性展开 + 表数据 command_sets
 * （阶段三 · v2 表必含 command_sets（F-W1-07 校验保证）· forbidden 并集语义见 effectiveCommandSets）。
 * 前置：调用方已完成 validateHostAdaptDocV2 结构校验且零 issue。
 */
export function resolveV2Model(
  data: unknown,
): { ok: true; model: ResolvedHostAdaptModel } | { ok: false; issues: HostValidateIssue[] } {
  const root = data as { version: string; command_sets: CommandSets }
  const resolved = resolveV2Rows(data)
  if (!resolved.ok) return { ok: false, issues: resolved.issues }
  return {
    ok: true,
    model: {
      schemaVersion: 2,
      version: root.version,
      commandSets: effectiveCommandSets(root.command_sets),
      rows: resolved.rows,
      explicitHooksHostIds: resolved.explicitHooksHostIds,
    },
  }
}
