import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { toRel } from '../cli-shared.ts'

/**
 * task close 真归档后，把 docs 里「解析后正好指向刚搬走的那个文件」的 Markdown 链接
 * 改到新路径。只改链接目标，以及该链接标签里的仓内旧路径。
 * 围栏、行内代码、指向其它文件的链接不动。
 * 与 scripts/check-doc-links.mjs extractLinks 同口径：跳过 ``` 围栏与行内代码。
 */
const INLINE_RE = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g
const REF_RE = /^\s*!?\[[^\]]+\]:\s*(\S+)/
const HTML_RE = /<a\s[^>]*href=["']?([^"'\s>]+)/gi

function maskInlineCode(line: string): string {
  return line.replace(/`[^`]*`/g, (m) => ' '.repeat(m.length))
}

function isExternal(target: string): boolean {
  return /^(#|https?:\/\/|mailto:|tel:|data:|\/\/)/i.test(target)
}

function pointsAt(sourceAbs: string, url: string, fromAbs: string): boolean {
  const clean = url.split('#')[0]
  if (!clean || isExternal(url)) return false
  return path.resolve(path.dirname(sourceAbs), clean) === path.resolve(fromAbs)
}

function linkHref(fromFileAbs: string, toAbs: string, hash: string): string {
  let rel = path.relative(path.dirname(fromFileAbs), toAbs).split(path.sep).join('/')
  if (!rel.startsWith('.')) rel = `./${rel}`
  return hash ? `${rel}${hash}` : rel
}

type Hit = { start: number; end: number; text: string }

function consider(
  hits: Hit[],
  line: string,
  urlStart: number,
  url: string,
  sourceAbs: string,
  fromAbs: string,
  toAbs: string,
  root: string,
  labelStart: number,
  labelEnd: number,
): boolean {
  if (!pointsAt(sourceAbs, url, fromAbs)) return false
  const hash = url.includes('#') ? url.slice(url.indexOf('#')) : ''
  hits.push({ start: urlStart, end: urlStart + url.length, text: linkHref(sourceAbs, toAbs, hash) })
  if (labelStart >= 0 && labelEnd > labelStart) {
    const fromRel = toRel(root, fromAbs)
    const toRelPath = toRel(root, toAbs)
    const label = line.slice(labelStart, labelEnd)
    if (fromRel && fromRel !== '.' && label.includes(fromRel)) {
      hits.push({ start: labelStart, end: labelEnd, text: label.split(fromRel).join(toRelPath) })
    }
  }
  return true
}

function applyHits(line: string, hits: Hit[]): string {
  const sorted = [...hits].sort((a, b) => b.start - a.start)
  let out = line
  for (const h of sorted) out = out.slice(0, h.start) + h.text + out.slice(h.end)
  return out
}

/** 改一份 Markdown。count 只计被改写的链接目标，不计标签。 */
export function retargetMarkdown(
  content: string,
  sourceAbs: string,
  fromAbs: string,
  toAbs: string,
  root: string,
): { text: string; count: number } {
  const lines = content.split('\n')
  let inFence = false
  let count = 0
  const out = lines.map((line) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      return line
    }
    if (inFence) return line
    const masked = maskInlineCode(line)
    const hits: Hit[] = []
    INLINE_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = INLINE_RE.exec(masked)) !== null) {
      const url = m[1]
      if (!url) continue
      const urlStart = m.index + m[0].indexOf('(') + 1
      const labelStart = m.index + (m[0].startsWith('!') ? 2 : 1)
      const labelEnd = m.index + m[0].indexOf('](')
      if (consider(hits, line, urlStart, url, sourceAbs, fromAbs, toAbs, root, labelStart, labelEnd)) count += 1
    }
    HTML_RE.lastIndex = 0
    while ((m = HTML_RE.exec(masked)) !== null) {
      const url = m[1]
      if (!url) continue
      const urlStart = m.index + m[0].lastIndexOf(url)
      if (consider(hits, line, urlStart, url, sourceAbs, fromAbs, toAbs, root, -1, -1)) count += 1
    }
    const ref = REF_RE.exec(masked)
    if (ref?.[1]) {
      const urlStart = ref.index + ref[0].lastIndexOf(ref[1])
      if (consider(hits, line, urlStart, ref[1], sourceAbs, fromAbs, toAbs, root, -1, -1)) count += 1
    }
    return hits.length === 0 ? line : applyHits(line, hits)
  })
  return { text: out.join('\n'), count }
}

function walkMd(dir: string, out: string[]): void {
  if (!existsSync(dir)) return
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walkMd(p, out)
    else if (/\.md$/i.test(ent.name)) out.push(p)
  }
}

/** 扫描 root/docs 下全部 Markdown，改写指向 fromAbs 的链接。返回改写条数。 */
export function retargetClosedTaskLinks(root: string, fromAbs: string, toAbs: string): number {
  const files: string[] = []
  walkMd(path.join(root, 'docs'), files)
  let total = 0
  for (const file of files) {
    const before = readFileSync(file, 'utf8')
    const { text, count } = retargetMarkdown(before, file, fromAbs, toAbs, root)
    if (count === 0 || text === before) continue
    writeFileSync(file, text)
    total += count
  }
  return total
}
