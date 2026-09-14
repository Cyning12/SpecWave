/**
 * 2.2.0 W1 · A1 · 版本/身份钉（release pins）· spec-wave pins check / fix
 *
 * 蓝本：docs/spec/2_2-closed-loop-start/01_release_pins_v1.md（唯一 SPEC）。
 * 数据驱动：落点声明全部在 assets/release-pins.yaml（本文件零落点硬编码 · PROMPT §4.a）。
 * 硬纪律：D-PINS-EXIT 偏差 exit 2 · S2 机械拒写无豁免（00 §3 S2）· 无 --force/--allow-*（P0-GATE）。
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fail, isS2RelPath, normalizeSlashPath, printJson, takeOption } from './cli-shared.ts'
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
  // 2.3-W2 · D-23-W2-CHECK-FORM：readme-host-row 数据面（语义/映射/豁免全入 yaml）
  readmes?: string[]
  host_hits?: Record<string, string[]>
  known_gaps?: Array<{ host_id: string; until_wave?: string; note?: string }>
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
      matches.push({ value: m[1]!, index: m.index }) // pin 正则必带捕获组 1（E5 收窄）
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
    const line = lineOf(content, (bad[0] ?? matches[0])!.index) // matches.length === 0 已提前 return（E5 收窄）
    return {
      ...base,
      actual,
      line,
      status: bad.length === 0 ? 'ok' : 'mismatch',
      detail: bad.length ? bad.length + '/' + matches.length + ' 处失配' : undefined,
    }
  }

  // D-24-PIN08-SEMCELL（2.4-W1 · 验收报告 §3.J · 语义数据声明见 release-pins.yaml pin-08）：
  // 行合格 ⟺ 状态列（cells[2] · 列序约定 cells[0]=slug/cells[1]=路径/cells[2]=状态）含当前版本
  // 点式 X.Y.Z，且 slug 列（B）行身份辅助判成立（含版本串或以 X_Y- 前缀开头 · minor 主题夹行）。
  // 下划线式 X_Y/X_Y_Z 一律不计入版本串（slug/文件名/归档链接顶包排除 · §3.J 两类顶包杀伤）；
  // 「X.Y.Z 规划中」类非发布态行：状态列含点式串即算行身份合格（F-W1-05 定稿 · 发布态归 pin-10）。
  if (kind === 'spec-index-row') {
    const dotted = truth
    const under = truth.replace(/\./g, '_')
    const minorUnder = truth.split('.').slice(0, 2).join('_')
    const lines = content.split('\n')
    const suspects: number[] = []
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i]! // i < lines.length 循环界内（E5 收窄）
      if (!t.startsWith('|')) continue
      const cells = t.split('|').slice(1, -1).map((c) => c.trim())
      if (cells.length < 3) continue
      const slugCell = (cells[0] ?? '').replace(/`/g, '')
      const statusCell = cells[2] ?? '' // cells.length >= 3 已守卫（E5 收窄）
      const hitA = statusCell.includes(dotted)
      const hitB =
        slugCell.includes(dotted) || slugCell.includes(under) || slugCell.startsWith(minorUnder + '-')
      if (hitA && hitB) {
        return {
          ...base,
          actual: 'L' + (i + 1) + ' 索引行存在（语义格位口径 D-24-PIN08-SEMCELL）',
          line: i + 1,
          status: 'ok',
        }
      }
      // 兜底嫌疑：行内其他位置（描述列/prose/归档链接）含版本形态串但状态格无点式串
      if (!hitA && (t.includes(dotted) || t.includes(under))) suspects.push(i + 1)
    }
    return {
      ...base,
      actual: '(索引表无当前版本合格行)',
      status: 'mismatch',
      detail:
        (pin.extract.semantics ?? '索引表存在当前 minor 对应行或标注行') +
        (suspects.length
          ? ' · 兜底嫌疑行（行内含版本形态串但状态格无点式版本串 · D-24-PIN08-SEMCELL）: L' + suspects.join(', L')
          : ''),
    }
  }

  // D-23-W2-CHECK-FORM（2.3-W2 · [A]#3 GLOSSARY 死链类）：文档↔files 白名单。
  // 语义数据声明见 release-pins.yaml pin-16 · 本求值器零口径硬编码以外的最小逻辑：
  // 扫 files[] 内 markdown 相对链接 → 仓根级且存在的 .md 目标 ∈ 白名单
  // （files[] 精确/目录前缀 ∪ npm 自动入包 README*/LICEN(S)E* · D-23-W2-NPM-AUTOINCLUDE）；
  // 仓根级以外（docs/ 任意深度）出范围（D-23-W2-ROOTSCOPE）；不存在的目标不判（F-W2-07）。
  if (kind === 'files-whitelist-link') {
    let pkg: { files?: unknown }
    try {
      pkg = JSON.parse(content) as { files?: unknown }
    } catch (e) {
      return { ...base, status: 'extract_error', detail: 'JSON 解析失败: ' + (e as Error).message }
    }
    const files = Array.isArray(pkg.files) ? pkg.files.filter((f): f is string => typeof f === 'string') : []
    if (files.length === 0) {
      return { ...base, status: 'extract_error', detail: 'package.json 缺 files 数组（failClosed）' }
    }
    const prefixes = files.map((f) => normalizeSlashPath(f).replace(/\/+$/, ''))
    const inFiles = (rel: string): boolean =>
      prefixes.some((p) => rel === p || rel.startsWith(p + '/'))
    const isNpmAuto = (baseName: string): boolean =>
      /^readme(\..+)?$/i.test(baseName) || /^licen[cs]e(\..+)?$/i.test(baseName)
    const sources: string[] = []
    const walk = (abs: string): void => {
      for (const e of readdirSync(abs, { withFileTypes: true })) {
        const p = path.join(abs, e.name)
        if (e.isDirectory()) walk(p)
        else if (e.name.toLowerCase().endsWith('.md')) sources.push(p)
      }
    }
    for (const f of prefixes) {
      const abs = path.resolve(root, f)
      if (!existsSync(abs)) continue // 缺失的 files 条目跳过不判（如未构建的 lib）
      if (statSync(abs).isDirectory()) walk(abs)
      else if (f.toLowerCase().endsWith('.md')) sources.push(abs)
    }
    const linkRe = /!?\[[^\]]*\]\(\s*(<)?([^)\s>]+)(>)?\s*\)/g
    // D-24-PIN16-REFSTYLE（2.4-W1 · 验收报告 §3.H）：reference-definition `^\s*[id]: target` 入扫描面，
    // 与 inline 目标走同一归一/判定管线（去锚 · 剥尖括号 · scheme/纯锚点跳过 · 仓根级且存在 ∈ 白名单）。
    const refRe = /^\s*!?\[[^\]]+\]:\s*(\S+)/gm
    const misses: string[] = []
    for (const abs of sources) {
      const relSrc = normalizeSlashPath(path.relative(root, abs))
      const srcContent = readFileSync(abs, 'utf8')
      const dir = path.dirname(abs)
      const found: Array<{ raw: string; index: number }> = []
      let m: RegExpExecArray | null
      const re = new RegExp(linkRe.source, 'g')
      while ((m = re.exec(srcContent))) found.push({ raw: m[2]!, index: m.index }) // linkRe 捕获组 2 必参与（E5 收窄）
      while ((m = refRe.exec(srcContent))) found.push({ raw: m[1]!, index: m.index }) // refRe 捕获组 1 必参与（E5 收窄）
      for (const f of found) {
        let target = f.raw
        if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1) // refstyle 尖括号折叠写法
        target = target.split('#')[0]!
        if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue // scheme / 纯锚点跳过
        if (!target.toLowerCase().endsWith('.md')) continue
        const rel = normalizeSlashPath(path.relative(root, path.resolve(dir, target)))
        if (rel.startsWith('..')) continue
        if (rel.includes('/')) continue // D-23-W2-ROOTSCOPE：仅仓根级目标
        if (!existsSync(path.resolve(root, rel))) continue // F-W2-07：不存在的目标本钉不判
        if (!inFiles(rel) && !isNpmAuto(rel)) {
          misses.push(relSrc + ':' + lineOf(srcContent, f.index) + ' -> ' + rel)
        }
      }
    }
    if (misses.length === 0) {
      return { ...base, actual: '扫描 ' + sources.length + ' 个 markdown · 0 失配', status: 'ok' }
    }
    return {
      ...base,
      actual: misses.length + ' 处仓根级文档未入白名单',
      status: 'mismatch',
      detail:
        misses.join(' · ') +
        ' · 建议: package.json#files 加白 or 移除链接（语义见 yaml pin-16 semantics）',
    }
  }

  // D-23-W2-CHECK-FORM（2.3-W2 · [A]#4 宿主低估类）：宿主↔根 README 表。
  // 语义/映射/豁免全入 yaml 数据（pin-17 host_hits / known_gaps / readmes）。
  // known_gaps 过渡豁免（D-23-W2-W7-EXEMPTION · until_wave 截止）：
  // 豁免宿主双双命中（W7① 落地）或已不在适配表 → 豁免失陈债 exit 2（F-W2-05 机检自执行）。
  if (kind === 'readme-host-row') {
    let table: { hosts?: unknown }
    try {
      table = yamlLoad(content) as { hosts?: unknown }
    } catch (e) {
      return { ...base, status: 'extract_error', detail: '适配表 YAML 解析失败: ' + (e as Error).message }
    }
    const hostIds = (Array.isArray(table.hosts) ? table.hosts : [])
      .map((h) => (h && typeof (h as { host_id?: unknown }).host_id === 'string'
        ? (h as { host_id: string }).host_id : null))
      .filter((x): x is string => x !== null)
    if (hostIds.length === 0) {
      return { ...base, status: 'extract_error', detail: '适配表缺 hosts[].host_id（failClosed）' }
    }
    const readmes = pin.extract.readmes ?? ['README.md', 'README.zh-CN.md']
    const hostHits = pin.extract.host_hits ?? {}
    const knownGaps = pin.extract.known_gaps ?? []
    const readmeBodies: string[] = []
    for (const r of readmes) {
      const abs = path.resolve(root, normalizeSlashPath(r))
      if (!existsSync(abs)) {
        return { ...base, status: 'extract_error', detail: 'README 缺失（failClosed）: ' + r }
      }
      readmeBodies.push(readFileSync(abs, 'utf8'))
    }
    const sideOf = (r: string): string => (/zh[-_]cn/i.test(r) ? 'ZH' : 'EN')
    const compileAll = (patterns: string[]): RegExp[] | null => {
      const out: RegExp[] = []
      for (const p of patterns) {
        try {
          out.push(new RegExp(p))
        } catch {
          return null
        }
      }
      return out
    }
    // D-24-PIN17-TABLEROW（2.4-W1 · 验收报告 §3.I）：词锚限定表格行内匹配 —— 命中 ⟺ 存在表行
    // （^\s*\| 宽松起首 · F-W1-02）使 host_hits 至少一 pattern 命中该行；tagline/prose 裸词命中不计入。
    const TABLE_ROW_RE = /^\s*\|/
    const hitInTableRow = (body: string, res: RegExp[]): boolean =>
      body.split('\n').some((l) => TABLE_ROW_RE.test(l) && res.some((re) => re.test(l)))
    const hitsAll = (id: string): boolean | null => {
      const res = compileAll(hostHits[id] ?? [])
      if (res === null || res.length === 0) return null
      return readmeBodies.every((b) => hitInTableRow(b, res))
    }
    const dataDebts: string[] = []
    const misses: string[] = []
    for (const id of hostIds) {
      const patterns = hostHits[id]
      if (!Array.isArray(patterns) || patterns.length === 0) {
        dataDebts.push('host ' + id + ' 无 host_hits 映射数据（F-W2-06 failClosed · 新宿主落地即受约束）')
        continue
      }
      const res = compileAll(patterns)
      if (res === null) {
        return { ...base, status: 'extract_error', detail: 'host_hits 正则非法（failClosed）: ' + id }
      }
      readmes.forEach((r, i) => {
        if (!hitInTableRow(readmeBodies[i]!, res)) { // readmeBodies 与 readmes 等长（E5 收窄）
          misses.push(id + ' · 缺 ' + r + '（' + sideOf(r) + ' 侧适配表行）')
        }
      })
    }
    const gapSet = new Set(knownGaps.map((g) => g.host_id))
    const stale: string[] = []
    for (const g of knownGaps) {
      if (!hostIds.includes(g.host_id)) {
        stale.push(g.host_id + '（已不在适配表 · 须移除豁免条目）')
        continue
      }
      if (hitsAll(g.host_id) === true) {
        stale.push(g.host_id + '（双语已双双命中 · W7① 落地 · 豁免失陈债 F-W2-05 · 须移除豁免条目）')
      }
    }
    const effMisses = misses.filter((m) => !gapSet.has(m.split(' · ')[0]!)) // split 恒 ≥1 元（E5 收窄）
    const problems = [...dataDebts, ...stale, ...effMisses]
    if (problems.length === 0) {
      const exempt = knownGaps.length > 0
        ? ' · 过渡豁免 ' + knownGaps.map((g) => g.host_id + '@' + (g.until_wave ?? '?')).join(',')
        : ''
      return {
        ...base,
        actual:
          hostIds.length + ' 宿主校验 · ' + (hostIds.length - gapSet.size) + ' 双语命中' + exempt,
        status: 'ok',
      }
    }
    return {
      ...base,
      actual: problems.length + ' 项偏差（失配/数据债/豁免失陈）',
      status: 'mismatch',
      detail: problems.join(' · '),
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

/**
 * 为可修偏差计算新内容（regex/regex-all：capture group 1 替换为期望值）。
 * baseContent（2.2.1 · P1 同文件多钉面聚合）：提供时以其为基准累计替换，
 * 避免同文件后写覆盖先写（验收报告 §2 W1 · 静默部分修复）；不提供则读盘（旧口径）。
 */
function planFix(
  root: string,
  pin: Pin,
  truth: string,
  result: PinResult,
  baseContent?: string,
): FixPlan | null {
  const kind = pin.extract.kind
  if (result.status !== 'mismatch') return null
  if (!pin.fixable) return null
  if (kind !== 'regex' && kind !== 'regex-all') return null
  const loc = resolvePinPath(root, pin)
  if (!loc || !existsSync(loc.abs)) return null
  const oldContent = baseContent ?? readFileSync(loc.abs, 'utf8')
  const flags = (pin.extract.flags ?? 'm') + 'd'
  const re = new RegExp(pin.extract.pattern ?? '', flags)
  const spans: Array<[number, number]> = []
  let m: RegExpExecArray | null
  while ((m = re.exec(oldContent))) {
    spans.push(matchIndices(m)[1]!) // fixable pin 正则必带捕获组 1（E5 收窄）
    if (kind === 'regex') break
    if (m.index === re.lastIndex) re.lastIndex++
  }
  if (spans.length === 0) return null
  let newContent = oldContent
  for (let i = spans.length - 1; i >= 0; i--) {
    const [s, e] = spans[i]! // i 在 spans 界内（E5 收窄）
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
    printJson(root, {
      truth_version: truth,
      status: bad.length === 0 ? 'pass' : 'blocked',
      pins: results,
    })
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
  // 2.2.1 · P1 按文件聚合：同文件多钉面基于累计内容依序 plan，写盘只写最终内容一次
  const cumulative = new Map<string, string>()
  for (const r of deviations) {
    const pin = byId.get(r.id)!
    const loc = resolvePinPath(root, pin)
    const plan = planFix(root, pin, truth, r, loc ? cumulative.get(loc.rel) : undefined)
    if (plan) {
      plans.push(plan)
      cumulative.set(plan.rel, plan.newContent)
    } else {
      unfixable.push({ result: r, reason: unfixableReason(pin, r) })
    }
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
    console.log('PINS FIX: dry-run · 以上 ' + plans.length + ' 处将改（--yes 才写盘 · 写前备份 <file>.bak · 写盘成功后自动清理）')
    if (unfixable.length > 0) fail('PINS FIX: ' + unfixable.length + ' 处不可修（须人工）', 2)
    return
  }
  // 同文件只写一次（最终累计内容）· 只备份一次（写前旧值 · F-P1-07 一次收敛）
  // 2.3.1 N1-d：备份在写盘成功后自动清理（只清本次自写 .bak · F-P2-08）——
  // 备份唯一消费场景是写盘失败回滚；留存会被 npm publish 从工作树打入包内（验收报告 §3.B）。
  const written = new Set<string>()
  for (const p of plans) {
    if (written.has(p.rel)) continue
    let final = p
    for (const q of plans) if (q.rel === p.rel) final = q
    const abs = path.resolve(root, p.rel)
    copyFileSync(abs, abs + '.bak')
    writeFileSync(abs, final.newContent)
    unlinkSync(abs + '.bak') // 写盘成功 → 自动清理本次备份（2.3.1 N1-d）
    written.add(p.rel)
    console.log('[written] ' + p.rel + '（写前备份已于成功后自动清理 · 2.3.1）')
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
