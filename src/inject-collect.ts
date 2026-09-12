import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { findGitRoot, packageRoot } from './cli-shared.ts'

// 2.2-W3 C2：M1 规范注入收集逻辑从 index.ts 收口本模块（cordis-free），
// 供插件面（index.ts loadMarkdownBundle 再导出 · 插件面契约不变）与 CLI 面
// （verify --json 可观测字段 source/injectedFiles · 安全设计 §7.2）共用同一实现源，禁止两处各算。
const MAX_INJECT_CHARS = 24_000
export type Profile = 'l1' | 'l1+l2' | 'full'
export type AssetSource = 'override' | 'package'

export function defaultAssetsRoot(): string {
  return path.join(packageRoot(), 'assets')
}

// DEF-017: 从 cwd 逐级向上探测 .coding-kit / .dsh/coding-kit，
// 在最近的含 .git 的祖先目录处截止（git root 内向上查找；无 .git 时查到文件系统根）。
// 2.2-W2 C1-b：git-root 探测复用 cli-shared.findGitRoot（T-02 唯一实现源 · 不新造）；
// 截止语义不变——git root 层自身仍先探候选再就地截止，不越过 git root 向上。
function userOverrideRoot(): string | undefined {
  let dir = process.cwd()
  const gitRoot = findGitRoot(dir)
  for (;;) {
    const candidates = [
      path.join(dir, '.coding-kit'),
      path.join(dir, '.dsh', 'coding-kit'),
    ]
    const hit = candidates.find((candidate) => existsSync(candidate))
    if (hit) return hit
    if (gitRoot !== null && dir === gitRoot) return undefined
    const parent = path.dirname(dir)
    if (parent === dir) return undefined
    dir = parent
  }
}

function resolveReadRoot(): { root: string; source: AssetSource } {
  const override = userOverrideRoot()
  if (override) return { root: override, source: 'override' }
  return { root: defaultAssetsRoot(), source: 'package' }
}

async function listMarkdownFiles(dir: string): Promise<string[]> {
  if (!existsSync(dir)) return []
  const out: string[] = []
  const walk = async (current: string): Promise<void> => {
    const entries = await readdir(current, { withFileTypes: true })
    for (const ent of entries) {
      const full = path.join(current, ent.name)
      if (ent.isDirectory()) {
        if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue
        await walk(full)
      } else if (ent.isFile() && ent.name.endsWith('.md')) {
        out.push(full)
      }
    }
  }
  await walk(dir)
  out.sort((a, b) => a.localeCompare(b))
  return out
}

function includeForProfile(profile: Profile, relFromRoot: string): boolean {
  const n = relFromRoot.replace(/\\/g, '/')
  const inStandards = n.startsWith('standards/')
  const inWiki = n.startsWith('coding_wiki/')
  if (!inStandards && !inWiki) return false
  if (profile === 'l1' && inStandards) {
    return n.includes('L1') || n.endsWith('README.md') || n.includes('SOURCES')
  }
  return true
}

export async function loadMarkdownBundle(profile: Profile): Promise<{
  markdown: string
  files: string[]
  truncated: boolean
  source: AssetSource
  root: string
}> {
  const { root, source } = resolveReadRoot()
  const files: string[] = []
  for (const relDir of ['standards', 'coding_wiki']) {
    const found = await listMarkdownFiles(path.join(root, relDir))
    for (const abs of found) {
      const rel = path.relative(root, abs)
      if (!includeForProfile(profile, rel)) continue
      files.push(abs)
    }
  }

  const parts: string[] = [
    '# Coding Standards',
    '',
    'Follow these project coding standards and context wiki when generating or modifying code.',
    'Do not ignore these constraints in favor of generic style.',
    '',
  ]
  // DEF-017: 按文件边界截断——追加下一文件前预算长度，超限则跳过该文件及其余文件；
  // files 只列实际注入的文件，被略文件可由 root 下全集减去 files 推出。
  const injectedFiles: string[] = []
  let truncated = false
  for (const file of files) {
    const rel = path.relative(root, file)
    const body = (await readFile(file, 'utf8')).trim()
    const candidate = [...parts, `## ${rel}`, '', body, ''].join('\n')
    if (candidate.length > MAX_INJECT_CHARS) {
      truncated = true
      break
    }
    parts.push(`## ${rel}`, '', body, '')
    injectedFiles.push(rel)
  }

  let markdown = parts.join('\n')
  if (truncated) {
    markdown = `${markdown}\n\n<!-- truncated at ${MAX_INJECT_CHARS} chars -->\n`
  }
  return {
    markdown,
    files: injectedFiles,
    truncated,
    source,
    root,
  }
}
