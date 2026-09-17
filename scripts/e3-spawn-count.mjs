#!/usr/bin/env node
// 3.0 W7 · E3 spawn 重定基计数脚本（task_3_0_w7_closeout_external · S7.2）
//
// 指标口径（同 W0 · 唯一合法口径）：
//   spawn 值 = 静态 `runCli(` 字面命中行数 − `function runCli` 定义行数
// 二者均按「行」计：一行内多处 runCli( 仍计 1（字面行口径）。
// 扫描面：test/**/*.ts（含 .test.ts 与 _helpers）。
// 用法：
//   node scripts/e3-spawn-count.mjs            # 人类可读（总览 + 逐文件降序）
//   node scripts/e3-spawn-count.mjs --json     # JSON 输出
//   node scripts/e3-spawn-count.mjs --top N    # 仅打印前 N 个文件
// exit 0 = 信息型（不计红）；判据由 task/自检结论消费。
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const TEST_DIR = path.join(ROOT, 'test')

function walk(dir) {
  const out = []
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...walk(p))
    else if (/\.ts$/.test(ent.name)) out.push(p)
  }
  return out
}

function countFile(abs) {
  const text = readFileSync(abs, 'utf8')
  const lines = text.split('\n')
  let callLines = 0
  let defLines = 0
  for (const line of lines) {
    if (line.includes('runCli(')) callLines += 1
    if (/function\s+runCli\s*\(/.test(line)) defLines += 1
  }
  return { callLines, defLines }
}

const files = walk(TEST_DIR).filter((f) => statSync(f).isFile())
const rows = []
let totalCalls = 0
let totalDefs = 0
for (const abs of files) {
  const { callLines, defLines } = countFile(abs)
  if (callLines === 0 && defLines === 0) continue
  const rel = path.relative(ROOT, abs).split(path.sep).join('/')
  rows.push({ file: rel, callLines, defLines, net: callLines - defLines })
  totalCalls += callLines
  totalDefs += defLines
}
rows.sort((a, b) => b.callLines - a.callLines || a.file.localeCompare(b.file))

const args = process.argv.slice(2)
const json = args.includes('--json')
const topIdx = args.indexOf('--top')
const top = topIdx !== -1 ? Number(args[topIdx + 1]) : rows.length
const shown = rows.slice(0, Number.isFinite(top) ? top : rows.length)
const total = totalCalls - totalDefs

if (json) {
  console.log(
    JSON.stringify(
      {
        metric: 'runCli( 字面行 − function runCli 定义行',
        total,
        callLines: totalCalls,
        defLines: totalDefs,
        fileCount: rows.length,
        files: shown,
      },
      null,
      2,
    ),
  )
  process.exit(0)
}

console.log('E3 SPAWN COUNT（runCli( 字面行 − function runCli 定义行）')
console.log('  总调用行 = ' + totalCalls + ' · 定义行 = ' + totalDefs + ' · spawn 值 = ' + total)
console.log('  文件数 = ' + rows.length + ' · 目标 ≤300 · 降序前 ' + shown.length + ' 个：')
for (const r of shown) {
  console.log('  ' + String(r.callLines).padStart(4) + '  ' + r.file + (r.defLines ? '  (−def ' + r.defLines + ')' : ''))
}
