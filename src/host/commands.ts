import { existsSync } from 'node:fs'
import path from 'node:path'
import { fail } from '../cli-shared.ts'

/**
 * commands 动词名解析与 profile 行为逻辑（3.0 W1 阶段三 · S2.5 数据源入表后）。
 * 数据（core/expanded/forbidden 目录）已迁移：v1 = src/host/resolve.ts 内建目录字面量（OQ-6 单锚）·
 * v2 = 表根级 command_sets（F-W1-07 必填 · forbidden=kit-30/kit-publish 机检在 schema.ts validateCommandSets）。
 * 本文件只保留行为逻辑（parse / profile 判定 / legacy 扁平落点探测）——动词列表一律由调用方传入。
 */

/** core basename 解析：Cursor 扁平 kit-<verb>.md；Claude 子目录 <verb>.md */
function parseCoreCommandBasename(base: string, verbs: readonly string[]): string | null {
  for (const verb of verbs) {
    if (base === `kit-${verb}.md` || base === `${verb}.md`) return verb
  }
  return null
}

/** expanded basename 解析：Cursor = kit-<stem>.md；Claude kit/ = <stem>.md → /kit:<stem> */
function parseExpandedCommandBasename(base: string, stems: readonly string[]): string | null {
  for (const stem of stems) {
    if (base === `kit-${stem}.md` || base === `${stem}.md`) return stem
  }
  return null
}

/** expanded ⊇ core：请求 expanded 时仍物化 profile:core 条目 */
function commandEntryApplies(entryProfile: string | undefined, requested: string): boolean {
  if (!entryProfile) return true
  if (entryProfile === requested) return true
  if (requested === 'expanded' && entryProfile === 'core') return true
  return false
}

function assertHostProfile(profile: string, cmd: string, usage: string): void {
  if (profile !== 'core' && profile !== 'expanded') {
    fail(`${cmd} 仅支持 --profile core|expanded（收到: ${profile}）\n用法: ${usage}`)
  }
}

/** 旧 Claude 扁平落点（2.0）：.claude/commands/kit-<verb>.md */
function legacyClaudeFlatCommandRels(verbs: readonly string[]): string[] {
  return verbs.map((v) => `.claude/commands/kit-${v}.md`)
}

function findLegacyClaudeFlatCommands(target: string, verbs: readonly string[]): string[] {
  return legacyClaudeFlatCommandRels(verbs).filter((rel) => existsSync(path.join(target, rel)))
}

export {
  parseCoreCommandBasename,
  parseExpandedCommandBasename,
  commandEntryApplies,
  assertHostProfile,
  legacyClaudeFlatCommandRels,
  findLegacyClaudeFlatCommands,
}
