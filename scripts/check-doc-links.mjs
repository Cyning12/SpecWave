#!/usr/bin/env node
// 3.0 W7 · S7.7 文档链接两级机检（task_3_0_w7_closeout_external · 验收 #4 · 硬约束 1/14）
//
// 两级判据（SPEC 08 §5.2）：
//   (i)  可解析：docs/**/*.md 的 Markdown 相对链接（inline + reference-definition + <a href>）解析后目标须存在。
//   (ii) 目标已入库：docs/ 内指向 `.workbuddy/…` 的链接目标须 `git ls-files` 命中（可解析但未入库 = 坏链）。
// S2 域（docs/tasks/ · docs/harness/reviews/ · docs/harness/invokes/by-task/）整体豁免 + 冻结基线
//   （永不覆写 · 历史 stale 链接不可修 · 硬约束 1）：S2 (i) 处数须 == 冻结基线（参数化排除 current task 路径）
//   · active/ 其他新增 S2 坏链仍拦。非 S2 域硬判 (i)=0 / (ii)=0。
// 接线：npm test（test/check-doc-links.test.ts 正负 fixture）。
// 用法：node scripts/check-doc-links.mjs [--root DIR] [--json] [--s2-baseline N] [--top N]
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// S2 过程域前缀（与 src/cli-shared.ts S2_TRUTH_PREFIXES 同口径的 docs/ 视角）
export const S2_PREFIXES = ['docs/tasks/', 'docs/harness/reviews/', 'docs/harness/invokes/by-task/']
// 冻结基线（F-W0-05 式复跑重建）：30 复跑实测 = 23（参数化排除 current task 路径后）。
// 起草快照口径 = 26（task 基线节 · 含 fenced/inline code 样例 .md 链接）；本脚本跳过代码块口径更窄
// + W7 新增 S2 镜像/演练/登记件进入 S2 域 ⇒ 重建为 23。新增 S2 坏链使计数 >23 即红。
export const S2_FROZEN_BASELINE = 23
// 参数化排除 current task 路径（本 W7 task · 其自身坏链不计入冻结基线）
export const S2_PARAM_EXCLUDE = ['docs/tasks/active/task_3_0_w7_closeout_external.md']

export function isS2(rel) {
  const n = rel.replace(/\\/g, '/')
  return S2_PREFIXES.some((p) => n.startsWith(p))
}

/** 提取 Markdown 相对链接目标（inline / reference-definition / <a href> · 图片同口径）。 */
export function extractLinks(content) {
  const out = []
  const lines = content.split('\n')
  const push = (raw, i) => {
    if (!raw) return
    let t = raw.trim()
    if (t.startsWith('<') && t.endsWith('>')) t = t.slice(1, -1).trim()
    // 去 title：`path "title"` / `path 'title'`
    t = t.replace(/\s+["'][^"']*["']\s*$/, '').trim()
    if (!t) return
    out.push({ target: t, line: i + 1 })
  }
  let inFence = false
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      return
    }
    if (inFence) return
    // 剥行内代码：代码样例中的 `[x](FOO.md)` 不计（起草口径）
    const scan = line.replace(/`[^`]*`/g, ' ')
    const inline = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g
    let m
    while ((m = inline.exec(scan)) !== null) push(m[1], i)
    const ref = /^\s*!?\[[^\]]+\]:\s*(\S+)/.exec(scan)
    if (ref) push(ref[1], i)
    const html = /<a\s[^>]*href=["']?([^"'"\s>]+)/gi
    while ((m = html.exec(scan)) !== null) push(m[1], i)
  })
  return out
}

function isExternal(t) {
  return /^(#|https?:\/\/|mailto:|tel:|data:|\/\/)/i.test(t)
}

export function checkDocLinks({ root, gitTracked, s2Baseline = S2_FROZEN_BASELINE }) {
  const docsDir = path.join(root, 'docs')
  const mdFiles = []
  const walk = (d) => {
    if (!existsSync(d)) return
    for (const ent of readdirSync(d, { withFileTypes: true })) {
      if (ent.name.startsWith('.')) continue
      const p = path.join(d, ent.name)
      if (ent.isDirectory()) walk(p)
      else if (/\.md$/i.test(ent.name)) mdFiles.push(p)
    }
  }
  walk(docsDir)
  mdFiles.sort()

  const broken = { nonS2: { i: [], ii: [] }, s2: { i: [], ii: [] } }
  for (const abs of mdFiles) {
    const rel = path.relative(root, abs).split(path.sep).join('/')
    const content = readFileSync(abs, 'utf8')
    const dir = path.dirname(abs)
    for (const { target, line } of extractLinks(content)) {
      if (isExternal(target)) continue
      const clean = target.split('#')[0]
      if (!clean) continue
      const targetAbs = path.resolve(dir, clean)
      const targetRel = path.relative(root, targetAbs).split(path.sep).join('/')
      const inRepo = !targetRel.startsWith('..') && !path.isAbsolute(targetRel)
      const isWorkbuddy = /(^|\/)\.workbuddy\//.test(targetRel) || clean.includes('.workbuddy/')
      const exists = existsSync(targetAbs)
      const entry = { file: rel, line, target: clean, resolve: targetRel }
      const bucket = isS2(rel) ? broken.s2 : broken.nonS2
      if (!exists) bucket.i.push(entry)
      if (isWorkbuddy && inRepo && !gitTracked.has(targetRel)) bucket.ii.push(entry)
      else if (isWorkbuddy && !inRepo && !exists) bucket.ii.push(entry)
    }
  }
  const s2Count = broken.s2.i.filter((e) => !S2_PARAM_EXCLUDE.includes(e.file)).length
  return { broken, s2Count, s2Baseline, nonS2i: broken.nonS2.i.length, nonS2ii: broken.nonS2.ii.length }
}

function main() {
  const args = process.argv.slice(2)
  const opt = (name, dflt) => {
    const i = args.indexOf(name)
    return i !== -1 && args[i + 1] ? args[i + 1] : dflt
  }
  const root = path.resolve(opt('--root', process.cwd()))
  const json = args.includes('--json')
  const top = Number(opt('--top', '0'))
  const ls = spawnSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
  const gitTracked = new Set((ls.stdout || '').split('\n').filter(Boolean))
  const s2Baseline = Number(opt('--s2-baseline', String(S2_FROZEN_BASELINE)))
  const res = checkDocLinks({ root, gitTracked, s2Baseline })
  if (json) {
    console.log(JSON.stringify(res, null, 2))
  } else {
    console.log('DOC LINKS (i) 非S2 = ' + res.nonS2i + ' · S2 = ' + res.s2Count + ' / 冻结基线 ' + res.s2Baseline + ' · (ii) 非S2 = ' + res.nonS2ii)
    for (const e of res.broken.nonS2.i) console.error('  [(i) 非S2] ' + e.file + ':' + e.line + ' -> ' + e.target + ' (解析为 ' + e.resolve + ')')
    for (const e of res.broken.nonS2.ii) console.error('  [(ii) 非S2] ' + e.file + ':' + e.line + ' -> ' + e.target)
    if (top > 0) for (const e of res.broken.s2.i) console.error('  [(i) S2 · 冻结豁免] ' + e.file + ':' + e.line + ' -> ' + e.target)
  }
  const fail = res.nonS2i > 0 || res.nonS2ii > 0 || res.s2Count !== res.s2Baseline
  if (fail) {
    if (!json) console.error('DOC LINKS: FAIL · 非S2(i)=' + res.nonS2i + ' 非S2(ii)=' + res.nonS2ii + ' · S2(i)=' + res.s2Count + ' ≠ 基线 ' + res.s2Baseline)
    process.exit(2)
  }
  if (!json) console.log('DOC LINKS: PASS · 非S2(i)=0 非S2(ii)=0 · S2 冻结基线 ' + res.s2Baseline + ' 处（current task 参数化排除）')
  process.exit(0)
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main()
