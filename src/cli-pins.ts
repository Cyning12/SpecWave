/**
 * 2.2.0 W1 · A1 · 版本/身份钉（release pins）· spec-wave pins check / fix
 *
 * 蓝本：docs/spec/2_2-closed-loop-start/01_release_pins_v1.md（唯一 SPEC）。
 * 数据驱动：落点声明全部在 assets/release-pins.yaml（本文件零落点硬编码 · PROMPT §4.a）。
 * 硬纪律：D-PINS-EXIT 偏差 exit 2 · S2 机械拒写无豁免（00 §3 S2）· 无 --force/--allow-*（P0-GATE）。
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fail, isS2RelPath, normalizeSlashPath, takeOption } from './cli-shared.ts'
import { yamlLoad } from './yaml.ts'

const PINS_REL = 'assets/release-pins.yaml'
const PINS_USAGE =
  'npx spec-wave pins check [--target PATH] [--json]' + '\n' +
  '  npx spec-wave pins fix [--target PATH] [--yes]'

type PinExtract = {
  kind: string
  field?: string
  pattern?: string
  flags?: string
  semantics?: string
}
type PinExpected = { kind: string; value?: unknown }
type Pin = {
  id: string
  path: string
  extract: PinExtract
  expected: PinExpected
  required: boolean
  fixable: boolean
  note?: string
}
type PinStatus = 'ok' | 'mismatch' | 'missing' | 'extract_error'
type PinResult = {
  id: string
  path: string
  expected: string
  actual: string | null
  status: PinStatus
  line: number | null
  detail?: string
}
type FixPlan = {
  pin: Pin
  rel: string
  line: number | null
  oldContent: string
  newContent: string
  hunks: Array<{ before: string; after: string }>
}

function loadPins(root: string): Pin[] {
  const abs = path.join(root, PINS_REL)
  if (!existsSync(abs)) {
    fail('PINS: BLOCKED · 声明源缺失: ' + PINS_REL + '（F-A1-01 failClosed）', 2)
  }
  let data: unknown
  try {
    data = yamlLoad(readFileSync(abs, 'utf8'))
  } catch (e) {
    fail('PINS: BLOCKED · 声明源语法错误: ' + PINS_REL + ' · ' + (e as Error).message, 2)
  }
  const pins = (data as { pins?: unknown }).pins
  if (!Array.isArray(pins) || pins.length === 0) {
    fail('PINS: BLOCKED · 声明源缺 pins 列表: ' + PINS_REL + '（F-A1-01 failClosed）', 2)
  }
  for (const p of pins as Pin[]) {
    if (!p || typeof p.id !== 'string' || typeof p.path !== 'string' || !p.extract || !p.expected) {
      fail('PINS: BLOCKED · 声明源行缺 id/path/extract/expected: ' + PINS_REL, 2)
    }
  }
  return pins as Pin[]
}

function readTruthVersion(root: string): string {
  const abs = path.join(root, 'package.json')
  if (!existsSync(abs)) fail('PINS: BLOCKED · 真值源缺失: package.json（exit 2）', 2)
  const pkg = JSON.parse(readFileSync(abs, 'utf8')) as { version?: string }
  if (!pkg.version) fail('PINS: BLOCKED · package.json 缺 version 字段', 2)
  return pkg.version
}

function expectedString(pin: Pin, truth: string): string {
  const k = pin.expected.kind
  if (k === 'self' || k === 'package-version') return truth
  if (k === 'const') return String(pin.expected.value)
  if (k === 'const-map') return JSON.stringify(pin.expected.value)
  return '(unknown expected kind: ' + k + ')'
}

function lineOf(content: string, index: number): number {
  return content.slice(0, index).split('\n').length
}

/** 落点路径安全：仓内相对路径，禁绝对路径与越界（../）。 */
function resolvePinPath(root: string, pin: Pin): { rel: string; abs: string } | null {
  const rel = normalizeSlashPath(pin.path)
  if (path.isAbsolute(pin.path) || rel.split('/').includes('..')) return null
  return { rel, abs: path.resolve(root, rel) }
}

function matchIndices(m: RegExpExecArray): Array<[number, number]> {
  return (m as unknown as { indices: Array<[number, number]> }).indices
}

function evaluatePin(root: string, pin: Pin, truth: string): PinResult {
  const expected = expectedString(pin, truth)
  const base: PinResult = { id: pin.id, path: pin.path, expected, actual: null, status: 'ok', line: null }
  const kind = pin.extract.kind

  if (kind === 'git-tag') {
    const tag = 'v' + truth
    try {
      const out = execFileSync('git', ['tag', '--list', tag], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      if (out.trim() === tag) return { ...base, actual: tag, status: 'ok' }
      return { ...base, expected: tag, actual: '(无)', status: 'missing', detail: 'git tag 缺失 · git 操作仅人（F-A1-05）' }
    } catch {
      return { ...base, expected: tag, status: 'extract_error', detail: 'git 不可用或 target 非 git 仓' }
    }
  }

  const loc = resolvePinPath(root, pin)
  if (!loc) {
    return { ...base, status: 'extract_error', detail: '落点路径越界（绝对路径或 ../ · 拒绝读取）' }
  }
  if (!existsSync(loc.abs)) {
    if (pin.required) return { ...base, status: 'missing', detail: 'required 落点文件缺失（F-A1-02）' }
    return { ...base, actual: '( absent · 非必需 )', status: 'ok' }
  }
  const content = readFileSync(loc.abs, 'utf8')

  if (kind === 'json-field') {
    let obj: Record<string, unknown>
    try {
      obj = JSON.parse(content) as Record<string, unknown>
    } catch (e) {
      return { ...base, status: 'extract_error', detail: 'JSON 解析失败: ' + (e as Error).message }
    }
    const field = pin.extract.field ?? ''
    const actual = obj[field] == null ? null : String(obj[field])
    const lm = new RegExp('^\\s*"' + field + '"', 'm').exec(content)
    const line = lm ? lineOf(content, lm.index) : null
    if (pin.expected.kind === 'self') return { ...base, actual, line, status: 'ok' }
    return { ...base, actual, line, status: actual === expected ? 'ok' : 'mismatch' }
  }

  if (kind === 'json-bin') {
    let obj: { bin?: Record<string, string> }
    try {
      obj = JSON.parse(content) as { bin?: Record<string, string> }
    } catch (e) {
      return { ...base, status: 'extract_error', detail: 'JSON 解析失败: ' + (e as Error).message }
    }
    const want = (pin.expected.value ?? {}) as Record<string, string>
    const got = obj.bin ?? {}
    const diffs: string[] = []
    for (const [k, v] of Object.entries(want)) {
      if (got[k] !== v) diffs.push(k + ': actual=' + (got[k] ?? '(缺)') + ' expected=' + v)
    }
    for (const k of Object.keys(got)) {
      if (!(k in want)) diffs.push(k + ': 多余入口（声明源未列）')
    }
    const lm = /^\s*"bin"/m.exec(content)
    return {
      ...base,
      actual: JSON.stringify(got),
      line: lm ? lineOf(content, lm.index) : null,
      status: diffs.length === 0 ? 'ok' : 'mismatch',
      detail: diffs.length ? diffs.join(' · ') : undefined,
    }
  }

  if (kind === 'regex' || kind === 'regex-all') {
    let re: RegExp
    try {
      re = new RegExp(pin.extract.pattern ?? '', pin.extract.flags ?? 'm')
    } catch (e) {
      return { ...base, status: 'extract_error', detail: 'extract 正则非法: ' + (e as Error).message }
    }
    const matches: Array<{ value: string; index: number }> = []
    let m: RegExpExecArray | null
    while ((m = re.exec(content))) {
      matches.push({ value: m[1], index: m.index })
      if (kind === 'regex') break
      if (m.index === re.lastIndex) re.lastIndex++
    }
    if (matches.length === 0) {
      return {
        ...base,
        status: 'extract_error',
        detail: 'extract 表达式零命中（F-A1-06 failClosed）: ' + (pin.extract.pattern ?? ''),
      }
    }
    const bad = matches.filter((x) => x.value !== expected)
    const actual = Array.from(new Set(matches.map((x) => x.value))).join(', ')
    const line = lineOf(content, (bad[0] ?? matches[0]).index)
    return {
      ...base,
      actual,
      line,
      status: bad.length === 0 ? 'ok' : 'mismatch',
      detail: bad.length ? bad.length + '/' + matches.length + ' 处失配' : undefined,
    }
  }

  if (kind === 'spec-index-row') {
    const dotted = truth
    const under = truth.replace(/\./g, '_')
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i]
      if (t.startsWith('|') && (t.includes(dotted) || t.includes(under))) {
        return { ...base, actual: 'L' + (i + 1) + ' 索引行存在', line: i + 1, status: 'ok' }
      }
    }
    return {
      ...base,
      actual: '(索引表无当前版本行)',
      status: 'mismatch',
      detail: pin.extract.semantics ?? '索引表存在当前 minor 对应行或标注行',
    }
  }

  return { ...base, status: 'extract_error', detail: '未知 extract kind: ' + kind }
}

export function runPinsCheck(root: string): { truth: string; results: PinResult[] } {
  const pins = loadPins(root)
  const truth = readTruthVersion(root)
  return { truth, results: pins.map((p) => evaluatePin(root, p, truth)) }
}

function diffLines(oldC: string, newC: string): Array<{ before: string; after: string }> {
  const a = oldC.split('\n')
  const b = newC.split('\n')
  const hunks: Array<{ before: string; after: string }> = []
  const n = Math.max(a.length, b.length)
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) hunks.push({ before: a[i] ?? '(eof)', after: b[i] ?? '(eof)' })
  }
  return hunks
}

/** 为可修偏差计算新内容（regex/regex-all：capture group 1 替换为期望值）。 */
function planFix(root: string, pin: Pin, truth: string, result: PinResult): FixPlan | null {
  const kind = pin.extract.kind
  if (result.status !== 'mismatch') return null
  if (!pin.fixable) return null
  if (kind !== 'regex' && kind !== 'regex-all') return null
  const loc = resolvePinPath(root, pin)
  if (!loc || !existsSync(loc.abs)) return null
  const oldContent = readFileSync(loc.abs, 'utf8')
  const flags = (pin.extract.flags ?? 'm') + 'd'
  const re = new RegExp(pin.extract.pattern ?? '', flags)
  const spans: Array<[number, number]> = []
  let m: RegExpExecArray | null
  while ((m = re.exec(oldContent))) {
    spans.push(matchIndices(m)[1])
    if (kind === 'regex') break
    if (m.index === re.lastIndex) re.lastIndex++
  }
  if (spans.length === 0) return null
  let newContent = oldContent
  for (let i = spans.length - 1; i >= 0; i--) {
    const [s, e] = spans[i]
    newContent = newContent.slice(0, s) + truth + newContent.slice(e)
  }
  if (newContent === oldContent) return null
  return { pin, rel: loc.rel, line: result.line, oldContent, newContent, hunks: diffLines(oldContent, newContent) }
}

function unfixableReason(pin: Pin, result: PinResult): string {
  if (result.status === 'missing') return '落点缺失不自动新建（须人工）'
  if (result.status === 'extract_error') return '提取失败须人工（F-A1-06）'
  if (pin.extract.kind === 'git-tag') return 'git 操作仅人（F-A1-05）'
  if (pin.expected.kind === 'self') return '真值源不反向改（SPEC 01 §5 #1）'
  if (pin.extract.kind === 'spec-index-row') return '仅可按 D-SPEC-213-ROW 模板人工补行'
  return 'fixable=false · 不可修（须人工）'
}

function printCheckHuman(truth: string, results: PinResult[]): void {
  console.log('pins check · 真值源 package.json#version = ' + truth + ' · 落点 ' + results.length)
  for (const r of results) {
    const where = r.line != null ? r.path + ':' + r.line : r.path
    if (r.status === 'ok') {
      console.log('[ok] ' + r.id + ' ' + where + ' = ' + (r.actual ?? ''))
    } else {
      console.log(
        '[' + r.status + '] ' + r.id + ' ' + where +
          ' · actual=' + JSON.stringify(r.actual) + ' expected=' + JSON.stringify(r.expected) +
          (r.detail ? ' · ' + r.detail : ''),
      )
    }
  }
  const bad = results.filter((r) => r.status !== 'ok')
  if (bad.length === 0) {
    console.log('PINS: PASS · ' + results.length + '/' + results.length + ' 落点一致')
  } else {
    console.log('PINS: BLOCKED · ' + bad.length + ' 偏差 / ' + results.length + ' 落点（D-PINS-EXIT · exit 2）')
  }
}

function cmdPinsCheck(root: string, json: boolean): void {
  const { truth, results } = runPinsCheck(root)
  const bad = results.filter((r) => r.status !== 'ok')
  if (json) {
    console.log(JSON.stringify({
      truth_version: truth,
      status: bad.length === 0 ? 'pass' : 'blocked',
      pins: results,
    }, null, 2))
  } else {
    printCheckHuman(truth, results)
  }
  if (bad.length > 0) fail('PINS: BLOCKED · ' + bad.length + ' 偏差（详见上方）', 2)
}

function cmdPinsFix(root: string, yes: boolean): void {
  const pins = loadPins(root)
  const truth = readTruthVersion(root)
  const results = pins.map((p) => evaluatePin(root, p, truth))
  const deviations = results.filter((r) => r.status !== 'ok')
  if (deviations.length === 0) {
    console.log('PINS FIX: 无偏差 · 0 处修改（幂等）')
    return
  }
  const byId = new Map(pins.map((p) => [p.id, p]))
  const plans: FixPlan[] = []
  const unfixable: Array<{ result: PinResult; reason: string }> = []
  for (const r of deviations) {
    const pin = byId.get(r.id)!
    const plan = planFix(root, pin, truth, r)
    if (plan) plans.push(plan)
    else unfixable.push({ result: r, reason: unfixableReason(pin, r) })
  }
  // S2 硬拒写：任何拟写落点命中 S2 → 整体拒写（先判后写 · 零备份残留 · 无豁免参数 · F-A1-04 / 00 §3）
  const s2hits = plans.filter((p) => isS2RelPath(p.rel))
  if (s2hits.length > 0) {
    for (const p of s2hits) {
      console.error('PINS FIX: REFUSED · S2 拒写（机械 · 无豁免参数）: ' + p.rel)
    }
    fail('PINS FIX: REFUSED · S2 目录永不可写 · 本次零写盘零备份', 2)
  }
  for (const p of plans) {
    const where = p.line != null ? p.rel + ':' + p.line : p.rel
    console.log('[' + (yes ? 'fix' : 'dry-run') + '] ' + p.pin.id + ' ' + where)
    for (const h of p.hunks) {
      console.log('  - ' + h.before)
      console.log('  + ' + h.after)
    }
  }
  for (const u of unfixable) {
    console.log('[unfixable] ' + u.result.id + ' ' + u.result.path + ' · ' + u.reason)
  }
  if (!yes) {
    console.log('PINS FIX: dry-run · 以上 ' + plans.length + ' 处将改（--yes 才写盘 · 写前备份 <file>.bak）')
    if (unfixable.length > 0) fail('PINS FIX: ' + unfixable.length + ' 处不可修（须人工）', 2)
    return
  }
  for (const p of plans) {
    const abs = path.resolve(root, p.rel)
    copyFileSync(abs, abs + '.bak')
    writeFileSync(abs, p.newContent)
    console.log('[written] ' + p.rel + '（备份 ' + p.rel + '.bak）')
  }
  console.log('PINS FIX: 写入 ' + plans.length + ' 处 · 不可修 ' + unfixable.length + ' 处')
  if (unfixable.length > 0) fail('PINS FIX: ' + unfixable.length + ' 处不可修（须人工 · 真值源/git 永不反向改）', 2)
}

export async function cmdPins(args: string[]): Promise<void> {
  const [sub, ...rest0] = args
  if (sub !== 'check' && sub !== 'fix') {
    fail('pins 子命令未知: ' + (sub ?? '(空)') + '\n用法: ' + PINS_USAGE, 1)
  }
  const t = takeOption(rest0, '--target')
  const rest: string[] = []
  let json = false
  let yes = false
  for (const a of t.rest) {
    if (a === '--json' && sub === 'check') { json = true; continue }
    if (a === '--yes' && sub === 'fix') { yes = true; continue }
    rest.push(a)
  }
  if (rest.length > 0) fail('pins 未知参数: ' + rest.join(' ') + '\n用法: ' + PINS_USAGE, 1)
  const root = path.resolve(t.value ?? process.cwd())
  if (sub === 'check') cmdPinsCheck(root, json)
  else cmdPinsFix(root, yes)
}
