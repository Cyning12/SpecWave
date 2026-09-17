import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fail, relativizeOutputValue, resolveTarget, takeOption } from './cli-shared.ts'

export const WIKI_GRAPH_SCHEMA = 'harness.wiki_graph.v1'
// 3.0 W7 S7.1-b：增量缓存件 schema（落 <target>/.coding-kit/wiki-cache.json · S2 三域之外）。
export const WIKI_CACHE_SCHEMA = 'harness.wiki_cache.v1'

export type WikiNode = { id: string; path: string; title: string }
export type WikiEdge = { source: string; target: string; kind: string }
// S7.1-a：双向链接（每个节点入边来源）——由 edges 反向聚合，单一真值源，不重扫文件。
export type WikiBacklink = { id: string; from: { source: string; kind: string }[] }
// S7.1-c：结构化冲突（悬空引用 / 同名 stem / 重复 title）。
export type WikiDangling = {
  kind: 'dangling_link'
  link: string
  source: string
  link_kind: 'wikilink' | 'md_link'
}
export type WikiConflict =
  | { kind: 'same_stem'; stem: string; paths: string[] }
  | { kind: 'duplicate_title'; title: string; paths: string[] }
  | WikiDangling

export type WikiGraph = {
  schema: string
  root: string
  nodes: WikiNode[]
  edges: WikiEdge[]
  backlinks: WikiBacklink[]
  warnings: string[]
  conflicts: WikiConflict[]
  skipped_illustrative: number
}

/** 缓存键 = 文件相对路径 → { mtimeMs, size, contentHash } + 该文件解析产物（续用免重解析）。 */
type WikiFileCache = {
  mtimeMs: number
  size: number
  contentHash: string
  title: string
  edges: { target: string; kind: string }[]
  warnings: string[]
  conflicts: WikiDangling[]
  skipped_illustrative: number
}
type WikiCache = { schema: string; root: string; files: Record<string, WikiFileCache> }

function sha256(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex')
}

function wikiCachePath(repoRoot: string): string {
  return path.join(repoRoot, '.coding-kit', 'wiki-cache.json')
}

function readWikiCache(repoRoot: string): WikiCache | null {
  const p = wikiCachePath(repoRoot)
  if (!existsSync(p)) return null
  try {
    const parsed = JSON.parse(readFileSync(p, 'utf8')) as WikiCache
    if (
      !parsed ||
      parsed.schema !== WIKI_CACHE_SCHEMA ||
      typeof parsed.files !== 'object' ||
      parsed.files === null
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeWikiCache(repoRoot: string, rootRel: string, perFile: Map<string, WikiFileCache>): void {
  const p = wikiCachePath(repoRoot)
  mkdirSync(path.dirname(p), { recursive: true })
  const files: Record<string, WikiFileCache> = {}
  for (const rel of [...perFile.keys()].sort()) files[rel] = perFile.get(rel)! // keys 来自 perFile（E5 收窄）
  writeFileSync(p, `${JSON.stringify({ schema: WIKI_CACHE_SCHEMA, root: rootRel, files }, null, 2)}\n`)
}

export function exportWikiGraph(
  repoRoot: string,
  options: { root?: string; incremental?: boolean } = {},
): WikiGraph {
  const rootRel = (options.root || 'docs/coding_wiki').replace(/^\.\/+/, '').replace(/\\/g, '/')
  const absRoot = path.join(repoRoot, rootRel)
  if (!existsSync(absRoot)) {
    const err = new Error(`wiki 根不存在: ${rootRel}`) as Error & { code?: string }
    err.code = 'wiki_root_missing'
    throw err
  }
  const files = listMarkdownFiles(absRoot)
  const entries = files.map((abs) => {
    const rel = path.relative(repoRoot, abs).replace(/\\/g, '/')
    const content = readFileSync(abs, 'utf8')
    const st = statSync(abs)
    const stem = path.basename(abs, path.extname(abs))
    return { abs, rel, content, stem, mtimeMs: st.mtimeMs, size: st.size, hash: sha256(content) }
  })

  const cache = options.incremental ? readWikiCache(repoRoot) : null
  // 缓存失效：语义根不同 / 文件集变化（新增或删除 ⇒ 解析表与先到者可能变）⇒ 全量重解析。
  const relKey = entries.map((e) => e.rel).sort().join('\n')
  const cacheKey = cache ? Object.keys(cache.files).sort().join('\n') : ''
  const cacheUsable = Boolean(cache && cache.root === rootRel && cacheKey === relKey)

  // 先定 title（未变文件复用缓存），再建全局解析表，最后仅重解析变更文件。
  const titles = new Map<string, string>()
  for (const e of entries) {
    const c = cacheUsable ? cache!.files[e.rel] : undefined
    if (c && c.contentHash === e.hash && c.size === e.size) titles.set(e.rel, c.title)
    else titles.set(e.rel, extractTitle(e.content) || e.stem)
  }
  const nodes: WikiNode[] = entries.map((e) => ({ id: e.rel, path: e.rel, title: titles.get(e.rel)! })) // titles 已逐个写入（E5 收窄）
  const nodeByStem = new Map<string, WikiNode>()
  const nodeByRel = new Map<string, WikiNode>()
  for (const n of nodes) {
    nodeByRel.set(n.path, n)
    const stem = path.basename(n.path, path.extname(n.path)).toLowerCase()
    if (!nodeByStem.has(stem)) nodeByStem.set(stem, n) // 同名先到者（既有 resolveWikilink 语义）
  }

  const edges: WikiEdge[] = []
  const warnings: string[] = []
  const dangling: WikiDangling[] = []
  const perFile = new Map<string, WikiFileCache>()
  let skippedIllustrative = 0

  for (const e of entries) {
    const c = cacheUsable ? cache!.files[e.rel] : undefined
    if (c && c.contentHash === e.hash && c.size === e.size) {
      for (const ed of c.edges) edges.push({ source: e.rel, target: ed.target, kind: ed.kind })
      warnings.push(...c.warnings)
      dangling.push(...c.conflicts)
      skippedIllustrative += c.skipped_illustrative
      perFile.set(e.rel, c)
      continue
    }
    const parsed = parseWikiFile(e.rel, e.content, e.abs, absRoot, repoRoot, nodeByStem, nodeByRel)
    for (const ed of parsed.edges) edges.push({ source: e.rel, target: ed.target, kind: ed.kind })
    warnings.push(...parsed.warnings)
    dangling.push(...parsed.conflicts)
    skippedIllustrative += parsed.skipped_illustrative
    perFile.set(e.rel, {
      mtimeMs: e.mtimeMs,
      size: e.size,
      contentHash: e.hash,
      title: titles.get(e.rel)!,
      edges: parsed.edges,
      warnings: parsed.warnings,
      conflicts: parsed.conflicts,
      skipped_illustrative: parsed.skipped_illustrative,
    })
  }

  if (options.incremental) writeWikiCache(repoRoot, rootRel, perFile)

  return {
    schema: WIKI_GRAPH_SCHEMA,
    root: rootRel,
    nodes,
    edges,
    backlinks: buildBacklinks(nodes, edges),
    warnings,
    conflicts: buildConflicts(nodes, dangling),
    skipped_illustrative: skippedIllustrative,
  }
}

/** 单文件解析：wikilink + md 相对链 → 已解析 edges / warnings / 结构化悬空冲突。（变更文件才调用。） */
function parseWikiFile(
  rel: string,
  content: string,
  abs: string,
  absRoot: string,
  repoRoot: string,
  nodeByStem: Map<string, WikiNode>,
  nodeByRel: Map<string, WikiNode>,
): { edges: { target: string; kind: string }[]; warnings: string[]; conflicts: WikiDangling[]; skipped_illustrative: number } {
  const dir = path.dirname(abs)
  const edges: { target: string; kind: string }[] = []
  const warnings: string[] = []
  const conflicts: WikiDangling[] = []
  const seen = new Set<string>()
  const pushEdge = (target: string, kind: string): void => {
    if (!target || target === rel) return // 自链跳过（既有语义）
    const key = `${target}|${kind}`
    if (seen.has(key)) return
    seen.add(key)
    edges.push({ target, kind })
  }
  let skipped = 0
  for (const name of extractWikilinks(content)) {
    const target = resolveWikilink(name, nodeByStem, nodeByRel, repoRoot, dir)
    if (target) {
      pushEdge(target, 'wikilink')
      continue
    }
    if (isIllustrativeWikilink(name)) {
      skipped += 1
      continue
    }
    warnings.push(`未解析 wikilink [[${name}]] @ ${rel}`)
    conflicts.push({ kind: 'dangling_link', link: name, source: rel, link_kind: 'wikilink' })
  }
  for (const href of extractMdRelLinks(content)) {
    const targetAbs = path.resolve(dir, href.split('#')[0]!) // split 恒 ≥1 元（E5 收窄）
    if (!targetAbs.startsWith(absRoot)) continue
    if (!existsSync(targetAbs)) {
      warnings.push(`md 链目标不存在: ${href} @ ${rel}`)
      conflicts.push({ kind: 'dangling_link', link: href, source: rel, link_kind: 'md_link' })
      continue
    }
    const targetRel = path.relative(repoRoot, targetAbs).replace(/\\/g, '/')
    if (nodeByRel.has(targetRel)) pushEdge(targetRel, 'md_link')
  }
  return { edges, warnings, conflicts, skipped_illustrative: skipped }
}

function buildBacklinks(nodes: WikiNode[], edges: WikiEdge[]): WikiBacklink[] {
  const byTarget = new Map<string, { source: string; kind: string }[]>()
  for (const e of edges) {
    if (!byTarget.has(e.target)) byTarget.set(e.target, [])
    byTarget.get(e.target)!.push({ source: e.source, kind: e.kind })
  }
  return nodes.map((n) => ({ id: n.id, from: byTarget.get(n.id) ?? [] }))
}

function buildConflicts(nodes: WikiNode[], dangling: WikiDangling[]): WikiConflict[] {
  const out: WikiConflict[] = []
  const byStem = new Map<string, string[]>()
  for (const n of nodes) {
    const stem = path.basename(n.path, path.extname(n.path)).toLowerCase()
    if (!byStem.has(stem)) byStem.set(stem, [])
    byStem.get(stem)!.push(n.path)
  }
  for (const [stem, paths] of [...byStem.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))) {
    if (paths.length > 1) out.push({ kind: 'same_stem', stem, paths: [...paths].sort() })
  }
  const byTitle = new Map<string, string[]>()
  for (const n of nodes) {
    const title = n.title.trim()
    if (!title) continue
    if (!byTitle.has(title)) byTitle.set(title, [])
    byTitle.get(title)!.push(n.path)
  }
  for (const [title, paths] of [...byTitle.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))) {
    if (paths.length > 1) out.push({ kind: 'duplicate_title', title, paths: [...paths].sort() })
  }
  out.push(...dangling)
  return out
}

function listMarkdownFiles(dir: string): string[] {
  const out: string[] = []
  const walk = (d: string): void => {
    for (const ent of readdirSync(d, { withFileTypes: true })) {
      if (ent.name.startsWith('.')) continue
      const p = path.join(d, ent.name)
      if (ent.isDirectory()) walk(p)
      else if (/\.md$/i.test(ent.name)) out.push(p)
    }
  }
  walk(dir)
  return out.sort()
}

function extractTitle(content: string): string | null {
  const m = content.match(/^#\s+(.+)$/m)
  return m ? m[1]!.trim() : null // 捕获组必参与（E5 收窄）
}

function extractWikilinks(content: string): string[] {
  const names: string[] = []
  const re = /\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(content)) !== null) names.push(m[1]!.trim()) // 捕获组必参与（E5 收窄）
  return names
}

function extractMdRelLinks(content: string): string[] {
  const hrefs: string[] = []
  const re = /\[[^\]]*\]\((\.\/[^)\s]+\.md(?:#[^)\s]*)?|\.\.\/[^)\s]+\.md(?:#[^)\s]*)?)\)/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(content)) !== null) hrefs.push(m[1]!.trim()) // 捕获组必参与（E5 收窄）
  return hrefs
}

function resolveWikilink(
  name: string,
  nodeByStem: Map<string, { path: string }>,
  nodeByRel: Map<string, { path: string }>,
  repoRoot: string,
  fromDir: string,
): string | null {
  const cleaned = name.replace(/\\/g, '/').replace(/\.md$/i, '')
  const byStem = nodeByStem.get(path.basename(cleaned).toLowerCase())
  if (byStem) return byStem.path
  const asRel = cleaned.replace(/^\.\/+/, '')
  if (nodeByRel.has(asRel)) return asRel
  if (nodeByRel.has(`${asRel}.md`)) return `${asRel}.md`
  const fromRepo = path.relative(repoRoot, path.resolve(fromDir, cleaned)).replace(/\\/g, '/')
  if (nodeByRel.has(fromRepo)) return fromRepo
  if (nodeByRel.has(`${fromRepo}.md`)) return `${fromRepo}.md`
  return null
}

export function isIllustrativeWikilink(name: string): boolean {
  const n = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\.md$/i, '')
  if (!n) return true
  if (/^(wikilink|page|name|link|title|placeholder|example|foo|bar|baz)$/i.test(n)) return true
  if (/^[.…·]+$/.test(n) || n === '...' || n === '…') return true
  return false
}

function formatConflict(c: WikiConflict): string {
  if (c.kind === 'dangling_link') return `dangling_link ${c.link_kind} [[${c.link}]] @ ${c.source}`
  if (c.kind === 'same_stem') return `same_stem ${c.stem} → ${c.paths.join(', ')}`
  return `duplicate_title ${c.title} → ${c.paths.join(', ')}`
}

export async function cmdWiki(args: string[]): Promise<void> {
  const [sub, ...rest] = args
  if (!sub || sub === '--help' || sub === '-h') {
    console.log(
      '用法: npx spec-wave wiki export --json [--target PATH] [--root DIR] [--out FILE|-] ' +
        '[--backlinks|--no-backlinks] [--incremental] [--check-conflicts]\n',
    )
    return
  }
  if (sub !== 'export') fail(`wiki 子命令未知: ${sub}\n用法: wiki export --json`)
  let remaining = rest
  const json = remaining.includes('--json')
  remaining = remaining.filter((a) => a !== '--json')
  const backlinks = !remaining.includes('--no-backlinks')
  remaining = remaining.filter((a) => a !== '--no-backlinks' && a !== '--backlinks')
  const incremental = remaining.includes('--incremental')
  remaining = remaining.filter((a) => a !== '--incremental')
  const checkConflicts = remaining.includes('--check-conflicts')
  remaining = remaining.filter((a) => a !== '--check-conflicts')
  const { value: targetArg, rest: r1 } = takeOption(remaining, '--target')
  remaining = r1
  const { value: rootArg, rest: r2 } = takeOption(remaining, '--root')
  remaining = r2
  const { value: outArg, rest: r3 } = takeOption(remaining, '--out')
  remaining = r3
  if (remaining.length > 0) fail(`wiki export 未知参数: ${remaining.join(' ')}`)
  if (!json) fail('wiki export 须 --json')
  const target = resolveTarget(process.cwd(), targetArg)
  let graph
  try {
    graph = exportWikiGraph(target, { root: rootArg, incremental })
  } catch (e) {
    console.error((e as Error).message || String(e))
    fail('', 2)
  }
  const payload = {
    schema: graph.schema,
    root: graph.root,
    nodes: graph.nodes,
    edges: graph.edges,
    // 键只增：--no-backlinks 时省略（默认开 · 既有消费者零回退）
    ...(backlinks ? { backlinks: graph.backlinks } : {}),
    warnings: graph.warnings,
    conflicts: graph.conflicts,
  }
  const text = `${JSON.stringify(relativizeOutputValue(target, payload), null, 2)}\n`
  const out = outArg || '-'
  if (out === '-') process.stdout.write(text)
  else {
    const abs = path.resolve(process.cwd(), out)
    mkdirSync(path.dirname(abs), { recursive: true })
    writeFileSync(abs, text)
    console.error(`wrote: ${abs}`)
  }
  if (graph.warnings.length > 0) {
    for (const w of graph.warnings) console.error(`warn: ${w}`)
  }
  // S7.1-c：默认 export 恒 exit 0；--check-conflicts 命中 → exit 2 点名（failClosed）。
  if (checkConflicts && graph.conflicts.length > 0) {
    for (const c of graph.conflicts) console.error(`conflict: ${formatConflict(c)}`)
    fail(`wiki conflicts: ${graph.conflicts.length}`, 2)
  }
}
