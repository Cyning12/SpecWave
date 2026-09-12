import { existsSync } from 'node:fs'
import { copyFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { isS2RelPath } from './cli-shared.ts'
import {
  evaluateHostContract,
  SUPPORTED_HOST_ADAPT_TABLE_VERSION,
  type HostContractResult,
} from './host-contract.ts'
import { defaultAssetsRoot, loadMarkdownBundle, type Profile } from './inject-collect.ts'

export const name = 'coding-kit'
export const inject = ['tools', 'systemPrompt']

// 2.2-W3 C2：注入收集实现收口 inject-collect.ts（cordis-free · CLI verify 同口径复用）；
// 本再导出保持插件面契约（loadMarkdownBundle 自 index.ts 可导入）不变。
export { loadMarkdownBundle } from './inject-collect.ts'

const CONTEXT_NAME = 'coding-kit.standards'

interface SystemPromptApi {
  context: (entry: {
    name: string
    order: number
    text: string | (() => string)
  }) => () => void
}

export async function copyDirNoClobber(
  src: string,
  dest: string,
): Promise<{ copied: string[]; skipped: string[] }> {
  const copied: string[] = []
  const skipped: string[] = []
  const walk = async (current: string, destCurrent: string, rel: string): Promise<void> => {
    if (!existsSync(current)) return
    const entries = await readdir(current, { withFileTypes: true })
    await mkdir(destCurrent, { recursive: true })
    for (const ent of entries) {
      const from = path.join(current, ent.name)
      const to = path.join(destCurrent, ent.name)
      const childRel = rel ? `${rel}/${ent.name}` : ent.name
      if (isS2RelPath(childRel)) {
        skipped.push(childRel)
        continue
      }
      if (ent.isDirectory()) {
        if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue
        await walk(from, to, childRel)
      } else if (ent.isFile()) {
        if (existsSync(to)) {
          skipped.push(childRel)
          continue
        }
        await copyFile(from, to)
        copied.push(childRel)
      }
    }
  }
  await walk(src, dest, '')
  return { copied, skipped }
}

function pluginHostContract(): HostContractResult {
  return evaluateHostContract(SUPPORTED_HOST_ADAPT_TABLE_VERSION)
}

function u01DegradeLines(contract: HostContractResult): string[] {
  return ['U-01: 宿主契约不匹配（degraded）', ...contract.reasons]
}

function maybeLegacyHint(): string {
  const markers = [
    path.join(process.cwd(), '.cyning-harness'),
    path.join(process.cwd(), 'docs', 'harness'),
  ]
  if (markers.some((p) => existsSync(p))) {
    return 'hint: detected legacy cyning-harness layout; this plugin does not run verify/gate-check. See README.'
  }
  return ''
}

export function apply(ctx: Context): void {
  const systemPrompt = ctx.get('systemPrompt') as SystemPromptApi | undefined
  let disposeContext: (() => void) | undefined

  ctx.tools.register(defineTool({
    name: 'apply_coding_standards',
    description:
      'Load ICVO coding standards and coding_wiki from spec-wave assets ' +
      '(or project .coding-kit override) and inject them into this session. ' +
      'Does nothing until explicitly called. Use when the user asks to apply coding standards, ' +
      'follow the coding kit, or generate code under project discipline.',
    parameters: {
      profile: {
        type: 'string',
        enum: ['l1', 'l1+l2', 'full'],
        description: 'l1 = L1 + wiki; l1+l2 = all standards + wiki (default); full: currently equivalent to l1+l2, reserved for extended bundles.',
      },
      persist: {
        type: 'boolean',
        description: 'Default true: register systemPrompt.context for later turns. False: one-shot tool result only.',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: String(value) }],
    },
    async execute(args) {
      const profile = (args.profile as Profile | undefined) ?? 'l1+l2'
      const persist = args.persist !== false
      const bundle = await loadMarkdownBundle(profile)
      const hint = maybeLegacyHint()
      const contract = pluginHostContract()
      const degrade = contract.status === 'degraded' ? u01DegradeLines(contract) : []

      if (bundle.files.length === 0) {
        return [
          ...degrade,
          `apply_coding_standards: no markdown files under ${bundle.root} (source=${bundle.source}).`,
        ].filter(Boolean).join('\n')
      }

      if (persist) {
        if (!systemPrompt) {
          return [
            ...degrade,
            'apply_coding_standards: persist requested but systemPrompt service is unavailable.',
            `source=${bundle.source} files=${bundle.files.length}`,
            'Fallback: one-shot preview follows.',
            hint,
            '',
            bundle.markdown.slice(0, 4000),
          ].filter(Boolean).join('\n')
        }
        disposeContext?.()
        disposeContext = systemPrompt.context({
          name: CONTEXT_NAME,
          order: 50,
          text: bundle.markdown,
        })
      }

      const lines = [
        ...degrade,
        persist
          ? 'Coding standards registered into system prompt context `coding-kit.standards`.'
          : 'Coding standards returned one-shot (not persisted into system prompt).',
        `profile=${profile} source=${bundle.source} root=${bundle.root}`,
        `files=${bundle.files.length} truncated=${bundle.truncated} chars=${bundle.markdown.length}`,
        ...bundle.files.map((f) => `- ${f}`),
        hint,
      ]
      if (!persist) {
        lines.push('', bundle.markdown)
      }
      return lines.filter(Boolean).join('\n')
    },
  }))

  ctx.tools.register(defineTool({
    name: 'init_coding_kit',
    description:
      'Copy coding-kit template assets into this project without overwriting existing files. ' +
      'Never writes docs/tasks, reviews, or invokes/by-task (S2). Call only when the user asks to initialize templates.',
    parameters: {
      dest: {
        type: 'string',
        enum: ['.coding-kit', '.dsh/coding-kit'],
        description: 'Destination relative to process.cwd(). Default .coding-kit',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: String(value) }],
    },
    async execute(args) {
      const destRel = (args.dest as string | undefined) ?? '.coding-kit'
      if (destRel !== '.coding-kit' && destRel !== '.dsh/coding-kit') {
        return 'init_coding_kit: dest not allowed'
      }
      const contract = pluginHostContract()
      if (contract.status === 'degraded') {
        return [
          'init_coding_kit: U-01 宿主契约不匹配（degraded），拒绝复制（copied=0）',
          ...contract.reasons,
        ].join('\n')
      }
      const dest = path.resolve(process.cwd(), destRel)
      const src = defaultAssetsRoot()
      if (!existsSync(src)) {
        return `init_coding_kit failed: package assets not found at ${src}`
      }
      const result = await copyDirNoClobber(src, dest)
      return [
        `init_coding_kit: dest=${dest}`,
        `copied=${result.copied.length} skipped_existing_or_s2=${result.skipped.length}`,
        result.copied.length ? `copied:\n${result.copied.map((f) => `- ${f}`).join('\n')}` : '',
        result.skipped.length
          ? `skipped:\n${result.skipped.slice(0, 50).map((f) => `- ${f}`).join('\n')}`
          : '',
      ].filter(Boolean).join('\n')
    },
  }))
}
