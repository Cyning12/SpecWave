#!/usr/bin/env node
// 3.0 W7 · S7.4 A3 对外口径边界机检（task_3_0_w7_closeout_external · 验收 #3 · 硬约束 9）
//
// 判据（数据源 assets/harness/claims-boundary.yaml）：
//   扫 scan_targets（delivery/promotion/** + 根 README 双语 + GLOSSARY）的对外文案，
//   对 forbidden_wording 断言零命中（allowlist 声明的行例外）→ 违则 exit 2 点名 文件:行:列。
// 接线：npm test（test/check-claims.test.ts 正负 fixture）。
// 用法：node scripts/check-claims.mjs [--root DIR] [--config FILE] [--json]
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { load as yamlLoad } from 'js-yaml'

export function loadClaimsConfig(file) {
  const parsed = yamlLoad(readFileSync(file, 'utf8'))
  if (!parsed || typeof parsed !== 'object') throw new Error('claims-boundary.yaml 不可解析: ' + file)
  return parsed
}

/** 展开扫描面：`dir/**` = 递归全文件；否则 = 单文件。 */
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

export function checkClaims({ root, config }) {
  const forbidden = [...(config.forbidden_wording || []), ...(config.expired_wording || [])]
  const allowlist = config.allowlist || []
  const violations = []
  const counts = []
  for (const target of config.scan_targets || []) {
    for (const abs of expandTargets(root, target)) {
      const rel = path.relative(root, abs).split(path.sep).join('/')
      const lines = readFileSync(abs, 'utf8').split('\n')
      let occ = 0
      lines.forEach((line, i) => {
        if (allowlist.some((a) => line.includes(a))) return
        for (const phrase of forbidden) {
          let idx = line.indexOf(phrase)
          while (idx !== -1) {
            occ += 1
            violations.push({ file: rel, phrase, line: i + 1, col: idx + 1, text: line.trim() })
            idx = line.indexOf(phrase, idx + 1)
          }
        }
      })
      counts.push({ file: rel, occ })
    }
  }
  return { violations, counts }
}

function main() {
  const args = process.argv.slice(2)
  const opt = (name, dflt) => {
    const i = args.indexOf(name)
    return i !== -1 && args[i + 1] ? args[i + 1] : dflt
  }
  const root = path.resolve(opt('--root', process.cwd()))
  const configFile = path.resolve(opt('--config', path.join(root, 'assets', 'harness', 'claims-boundary.yaml')))
  const json = args.includes('--json')
  const config = loadClaimsConfig(configFile)
  const { violations, counts } = checkClaims({ root, config })
  const total = violations.length
  if (json) {
    console.log(JSON.stringify({ root, config: configFile, violations, counts, total }, null, 2))
  } else {
    console.log('CLAIMS: 扫描面 ' + counts.length + ' 文件 · forbidden_wording 命中 ' + total)
    for (const v of violations) console.error('CLAIMS: FAIL · ' + v.file + ':' + v.line + ':' + v.col + ' forbidden「' + v.phrase + '」: ' + v.text)
  }
  if (total > 0) {
    if (!json) console.error('CLAIMS: FAIL · forbidden_wording 残留 ' + total)
    process.exit(2)
  }
  if (!json) console.log('CLAIMS: PASS · forbidden_wording 零命中（allowlist ' + (config.allowlist || []).length + ' 条）')
  process.exit(0)
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main()
