#!/usr/bin/env node
// 3.0 W0 锁③（范围⑤ · task_3_0_w0_refactor_prep）：god-file 拆分 barrel 化的公共导出面快照锁。
// 提取 lib/cli.d.ts / lib/cli-checks.d.ts / lib/cli-host.d.ts 的导出符号名集合（排序），
// 拆分前 --snapshot 存基线 · 拆分后 --check 逐字比对（failClosed exit 2 · 先例 check-pack-hygiene.mjs）。
// 前置：lib/ 系 build 产物（gitignored）——须先 npm run build 再跑本脚本。
// 用法：
//   node scripts/check-export-surface.mjs --snapshot <file>   # 存基线快照
//   node scripts/check-export-surface.mjs --check <file>      # 与基线逐字比对
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const TARGETS = ['lib/cli.d.ts', 'lib/cli-checks.d.ts', 'lib/cli-host.d.ts']

function extractExportNames(dtsPath) {
  const text = readFileSync(dtsPath, 'utf8')
  const names = new Set()
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim()
    if (!line.startsWith('export')) continue
    let m = line.match(/^export\s+declare\s+(?:async\s+)?(?:function|class)\s+([A-Za-z_$][\w$]*)/)
    if (m) { names.add(m[1]); continue }
    m = line.match(/^export\s+declare\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)/)
    if (m) { names.add(m[1]); continue }
    m = line.match(/^export\s+(?:declare\s+)?(?:type|interface|enum)\s+([A-Za-z_$][\w$]*)/)
    if (m) { names.add(m[1]); continue }
    m = line.match(/^export\s+(?:type\s+)?\{([^}]*)\}(?:\s*from\s*['"][^'"]+['"])?\s*;?\s*$/)
    if (m) {
      for (const part of m[1].split(',')) {
        let tok = part.trim()
        if (!tok) continue
        tok = tok.replace(/^type\s+/, '')
        const as = tok.split(/\s+as\s+/)
        names.add((as.length === 2 ? as[1] : as[0]).trim())
      }
      continue
    }
    if (/^export\s+default\b/.test(line)) { names.add('default'); continue }
    // failClosed：出现未识别的 export 形态即报错（防解析器漂移漏符号）
    console.error('EXPORT SURFACE: FAIL · 未识别的 export 形态（' + dtsPath + ':' + (i + 1) + '）: ' + line)
    process.exit(2)
  }
  return [...names].sort()
}

function render() {
  const chunks = []
  for (const rel of TARGETS) {
    if (!existsSync(rel)) {
      console.error('EXPORT SURFACE: FAIL · 缺 build 产物 ' + rel + '（先 npm run build）')
      process.exit(2)
    }
    const names = extractExportNames(rel)
    chunks.push('## ' + rel + ' (' + names.length + ')\n' + names.join('\n'))
  }
  return chunks.join('\n\n') + '\n'
}

const args = process.argv.slice(2)
const mode = args[0]
const file = args[1]
if ((mode !== '--snapshot' && mode !== '--check') || !file) {
  console.error('用法: node scripts/check-export-surface.mjs --snapshot|--check <file>')
  process.exit(2)
}
const current = render()
if (mode === '--snapshot') {
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, current)
  console.log('EXPORT SURFACE: SNAPSHOT · ' + file + ' · ' + TARGETS.length + ' 份 d.ts 导出集合已存')
  process.exit(0)
}
if (!existsSync(file)) {
  console.error('EXPORT SURFACE: FAIL · 基线快照不存在: ' + file)
  process.exit(2)
}
const baseline = readFileSync(file, 'utf8')
if (baseline !== current) {
  console.error('EXPORT SURFACE: FAIL · 导出符号集合与基线不逐字一致（diff <baseline> <current>）:')
  const b = baseline.split('\n')
  const c = current.split('\n')
  const max = Math.max(b.length, c.length)
  for (let i = 0; i < max; i += 1) {
    if (b[i] !== c[i]) {
      console.error('  L' + (i + 1) + ' baseline: ' + JSON.stringify(b[i]))
      console.error('  L' + (i + 1) + ' current : ' + JSON.stringify(c[i]))
    }
  }
  process.exit(2)
}
console.log('EXPORT SURFACE: PASS · ' + TARGETS.join(' / ') + ' 导出集合与基线逐字一致')
