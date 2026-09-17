#!/usr/bin/env node
// 3.0 W7 · S7.3 术语 canonical 正名机检（task_3_0_w7_closeout_external · 验收 #1）
//
// 判据（00 最终裁定 2026-09-17 · 数据源 assets/harness/terminology.yaml）：
//   ① canonical 保留词存在性正向断言（GLOSSARY 五词在位）——任何位置不判红（含 `人闸`/`人工闸` 全形态）；
//   ② 唯一判红对象 = 变体词 `门控`（应为 `门禁`）· 判红面 = 六目标闭集（闭集外不扫）；
//   ③ 豁免面逐条枚举（research_report/安全设计/系统设计/docs/spec/docs/roadmap/.workbuddy）+ `门控 skip`；
//   ④ 词边界排除 `后门控制`；命中 → exit 2 点名 文件:行:列。
// 接线：npm test（test/check-terminology.test.ts 正负 fixture）。
// 用法：node scripts/check-terminology.mjs [--root DIR] [--config FILE] [--json]
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { load as yamlLoad } from 'js-yaml'

export function loadTerminologyConfig(file) {
  const parsed = yamlLoad(readFileSync(file, 'utf8'))
  if (!parsed || typeof parsed !== 'object') throw new Error('terminology.yaml 不可解析: ' + file)
  return parsed
}

/** 展开判红面目标：`dir/**` = 递归全文件；否则 = 单文件。 */
export function expandTargets(root, pattern) {
  const norm = String(pattern).replace(/\\/g, '/')
  if (norm.endsWith('/**')) {
    const base = path.join(root, norm.slice(0, -3))
    const out = []
    const walk = (d) => {
      if (!existsSync(d)) return
      for (const ent of readdirSync(d, { withFileTypes: true })) {
        if (ent.name.startsWith('.')) continue
        const p = path.join(d, ent.name)
        if (ent.isDirectory()) walk(p)
        else out.push(p)
      }
    }
    walk(base)
    return out.sort()
  }
  const abs = path.join(root, norm)
  return existsSync(abs) ? [abs] : []
}

/**
 * 扫描并返回结构化结果。
 * violations：判红命中（{file, variant, line, col, text}）。
 * counts：每目标（file × variant）的计次 / 行数。
 */
export function checkTerminology({ root, config }) {
  const canonicalFile = path.join(root, config.canonical_assertion.file)
  const canonicalText = existsSync(canonicalFile) ? readFileSync(canonicalFile, 'utf8') : ''
  const missingCanonical = (config.canonical || []).filter((w) => !canonicalText.includes(w))

  const violations = []
  const counts = []
  for (const v of config.variants || []) {
    const excludes = v.word_boundary_excludes || []
    const exemptPatterns = v.exempt_patterns || []
    for (const target of v.targets || []) {
      for (const abs of expandTargets(root, target)) {
        const rel = path.relative(root, abs).split(path.sep).join('/')
        const lines = readFileSync(abs, 'utf8').split('\n')
        let occ = 0
        let redLines = 0
        lines.forEach((line, i) => {
          let idx = line.indexOf(v.variant)
          let lineHit = false
          while (idx !== -1) {
            const inExclude = excludes.some((ex) => {
              const at = ex.indexOf(v.variant)
              return at !== -1 && line.slice(idx - at, idx - at + ex.length) === ex
            })
            const inExempt = exemptPatterns.some((p) => line.startsWith(p, idx))
            if (!inExclude && !inExempt) {
              occ += 1
              if (!lineHit) {
                redLines += 1
                lineHit = true
              }
              violations.push({ file: rel, variant: v.variant, line: i + 1, col: idx + 1, text: line.trim() })
            }
            idx = line.indexOf(v.variant, idx + 1)
          }
        })
        counts.push({ file: rel, variant: v.variant, occ, lines: redLines })
      }
    }
  }
  return { missingCanonical, violations, counts }
}

function main() {
  const args = process.argv.slice(2)
  const opt = (name, dflt) => {
    const i = args.indexOf(name)
    return i !== -1 && args[i + 1] ? args[i + 1] : dflt
  }
  const root = path.resolve(opt('--root', process.cwd()))
  const configFile = path.resolve(opt('--config', path.join(root, 'assets', 'harness', 'terminology.yaml')))
  const json = args.includes('--json')
  const config = loadTerminologyConfig(configFile)
  const { missingCanonical, violations, counts } = checkTerminology({ root, config })
  const totalOcc = counts.reduce((n, c) => n + c.occ, 0)
  const totalLines = counts.reduce((n, c) => n + c.lines, 0)

  if (json) {
    console.log(JSON.stringify({ root, config: configFile, missingCanonical, violations, counts, totalOcc, totalLines }, null, 2))
  } else {
    console.log('TERMINOLOGY: canonical=' + (config.canonical || []).join('/') + ' · 判红面 门控 残留 计次 ' + totalOcc + ' / 行 ' + totalLines)
    for (const c of counts) {
      if (c.occ > 0) console.log('  [red] ' + c.file + ' · ' + c.variant + ' × ' + c.occ)
    }
    for (const m of missingCanonical) console.error('  [missing] canonical 保留词缺位: ' + m + ' @ ' + config.canonical_assertion.file)
    for (const v of violations) console.error('TERMINOLOGY: FAIL · ' + v.file + ':' + v.line + ':' + v.col + ' 变体词 ' + v.variant + '（应为 canonical）: ' + v.text)
  }

  if (missingCanonical.length > 0 || violations.length > 0) {
    if (!json) console.error('TERMINOLOGY: FAIL · canonical 缺位 ' + missingCanonical.length + ' · 判红面残留 ' + violations.length)
    process.exit(2)
  }
  if (!json) console.log('TERMINOLOGY: PASS · canonical ' + (config.canonical || []).length + '/5 在位 · 判红面 门控 残留 0')
  process.exit(0)
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main()
