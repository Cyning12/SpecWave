import { existsSync } from 'node:fs'
import path from 'node:path'
import { fail } from '../cli-shared.ts'

/** core 五 verb：Cursor 扁平 kit-<verb>.md；Claude 子目录 <verb>.md */
const CORE_COMMAND_VERBS = [
  'verify',
  'gate-status',
  'init-guide',
  'apply-standards',
  'hat-reanchor',
] as const

type CoreCommandVerb = (typeof CORE_COMMAND_VERBS)[number]

/**
 * expanded stems：Cursor = kit-<stem>.md；Claude kit/ = <stem>.md → /kit:<stem>
 * 至少五条 hat；另含 graph-check / sync-prompts-guide。禁 kit-30 / kit-publish。
 */
const EXPANDED_COMMAND_STEMS = [
  'hat-00-delegate',
  'hat-10-spec',
  'hat-10-task',
  'hat-20-spec-audit',
  'hat-20-task-audit',
  'graph-check',
  'sync-prompts-guide',
] as const

type ExpandedCommandStem = (typeof EXPANDED_COMMAND_STEMS)[number]

function parseCoreCommandBasename(base: string): CoreCommandVerb | null {
  for (const verb of CORE_COMMAND_VERBS) {
    if (base === `kit-${verb}.md` || base === `${verb}.md`) return verb
  }
  return null
}

function parseExpandedCommandBasename(base: string): ExpandedCommandStem | null {
  for (const stem of EXPANDED_COMMAND_STEMS) {
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

function assertHostProfile(profile: string, cmd: 'host apply' | 'host update', usage: string): void {
  if (profile !== 'core' && profile !== 'expanded') {
    fail(`${cmd} 仅支持 --profile core|expanded（收到: ${profile}）\n用法: ${usage}`)
  }
}

/** 旧 Claude 扁平落点（2.0）：.claude/commands/kit-<verb>.md */
function legacyClaudeFlatCommandRels(): string[] {
  return CORE_COMMAND_VERBS.map((v) => `.claude/commands/kit-${v}.md`)
}

function findLegacyClaudeFlatCommands(target: string): string[] {
  return legacyClaudeFlatCommandRels().filter((rel) => existsSync(path.join(target, rel)))
}

export {
  CORE_COMMAND_VERBS,
  EXPANDED_COMMAND_STEMS,
  parseCoreCommandBasename,
  parseExpandedCommandBasename,
  commandEntryApplies,
  assertHostProfile,
  legacyClaudeFlatCommandRels,
  findLegacyClaudeFlatCommands,
}
export type { CoreCommandVerb, ExpandedCommandStem }
