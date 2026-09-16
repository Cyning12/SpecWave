import { CORE_COMMAND_VERBS, EXPANDED_COMMAND_STEMS } from './commands.ts'
import type { HostRow } from './table.ts'

/**
 * 3.0 W1 · resolved 内部模型（S2.5 v1 兼容桥 + 评审文 §3.2 六行恒等映射 · F-W1-11 一次性展开）。
 * 本阶段（阶段一）：仅 v1 兼容桥 —— v1 旧扁平格式语义等价映射入新模型，v1 表面行为逐字不变；
 * 下游消费改造（materialize 改读表 command_sets · commands.ts 常量删除）与 defaults/extends
 * 展开归 W1 后续阶段；本文件先行钉住 resolved 模型形态与内建目录真值（OQ-6/F-W1-08）。
 */

/** 根级 command_sets 形态（S2.5 · 评审文 §2.5）：core/expanded/forbidden 三节 */
export type CommandSets = {
  core: string[]
  expanded: string[]
  forbidden: string[]
}

/**
 * hooks 声明（S2.2 · W1 只声明与物化 · 运行时归宿主）。
 * 本阶段仅 v1 缺省形态 mechanism: none（评审文 §3.2 映射行④ · 与现状零行为差）；
 * shell-hook/config-hook 枚举校验归 v2 校验器（后续阶段）。
 */
export type HooksDecl = {
  mechanism: 'none'
}

/**
 * resolved host 行 = v1 行 + 缺省注入 hooks。
 * v1 surfaces 白名单不含 hooks 键（schema.ts 行白名单 · additionalProperties:false 口径）
 * ⇒ 合法 v1 表必无 hooks，缺省注入永不覆写表值。
 */
export type ResolvedHostRow = Omit<HostRow, 'surfaces'> & {
  surfaces: HostRow['surfaces'] & { hooks: HooksDecl }
}

/** resolved 适配表模型（校验后、消费前一次性展开 · 下游不感知 extends/缺省注入） */
export type ResolvedHostAdaptModel = {
  schemaVersion: 1 | 2
  /** version 字符串字段原样保留（评审文 §3.2 行① · 报告面 tableVersionOf 既有消费不动） */
  version: string
  commandSets: CommandSets
  rows: ResolvedHostRow[]
}

/** v1 兼容桥缺省 hooks（评审文 §3.2 行④：无 hooks 键 → {mechanism: none} · 未声明缺省） */
export const V1_DEFAULT_HOOKS: HooksDecl = { mechanism: 'none' }

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
 * 前置：调用方已经探测分派（validateHostAdaptDocDispatch）判 v1 且零 issue。
 * 不 mutate 入参（rows/surfaces 浅拷贝后注入 · v1 表面行为逐字不变）。
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
