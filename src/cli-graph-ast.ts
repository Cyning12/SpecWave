/**
 * 3.3 W2 · graph ast check — symbol 核对 + 有界 call（只报告 · 零写盘 · 不进默认 verify）。
 * 产品钉：SPEC docs/spec/3_3-graph-ast-opt-in/ · task 3-3-w2-graph-ast-impl
 * W1 面：peer skip=no_ts_peer；W2：替换 stub，真检 symbol / 同 path 有界 call；跨 path 不红。
 */
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fail, printJson, resolveTarget, takeOption, toRel } from './cli-shared.ts'
import { isSkippableIbPath } from './cli-graph-ib.ts'
import { allGraphIds, GraphYamlError, loadYaml, yamlPathFor } from './cli-graph-yaml.ts'

export type AstIssue = {
  kind: 'missing_ib_symbol' | 'missing_bounded_call'
  path?: string
  symbol?: string
  source?: string
  node_id?: string
  from?: string
  to?: string
  detail?: string
}

export type AstCheckReport = {
  command: 'graph ast check'
  ok: boolean
  target: string
  input: string
  issues: AstIssue[]
  /** 已做 AST 核对的 IB 符号项数（含红项） */
  checked: number
  skipped_ib: number
  /** 合法 skip：仅 no_ts_peer；真检路径为 null */
  skipped_reason: string | null
  inform: {
    cross_path_edges: number
  }
}

const TS_EXT = /\.(ts|tsx|mts|cts)$/i

/** 最小 typescript 面（动态 require · 避免硬依赖进 dependencies） */
type TsModule = {
  createSourceFile: (
    fileName: string,
    sourceText: string,
    languageVersion: number,
    setParentNodes?: boolean,
    scriptKind?: number,
  ) => TsNode
  ScriptTarget: { Latest: number }
  ScriptKind: { TS: number; TSX: number }
  SyntaxKind: Record<string, number>
  forEachChild: (node: TsNode, cb: (child: TsNode) => void) => void
  isIdentifier: (node: TsNode) => node is TsNode & { text: string }
  isFunctionDeclaration: (node: TsNode) => boolean
  isClassDeclaration: (node: TsNode) => boolean
  isInterfaceDeclaration: (node: TsNode) => boolean
  isTypeAliasDeclaration: (node: TsNode) => boolean
  isEnumDeclaration: (node: TsNode) => boolean
  isVariableDeclaration: (node: TsNode) => boolean
  isMethodDeclaration: (node: TsNode) => boolean
  isPropertyDeclaration: (node: TsNode) => boolean
  isPropertyAccessExpression: (node: TsNode) => node is TsNode & { name: TsNode }
  isModuleDeclaration: (node: TsNode) => boolean
}

type TsNode = {
  kind: number
  parent?: TsNode
  name?: TsNode
  text?: string
  forEachChild?: (cb: (child: TsNode) => void) => void
}

export function isTypescriptPath(p: string): boolean {
  return TS_EXT.test(p.replace(/\\/g, '/'))
}

export function isSkippableIbSymbol(s: string | undefined): boolean {
  if (s == null) return true
  const t = s.trim()
  return t === '' || t.toUpperCase() === 'TBD'
}

/**
 * 相对 --target 探测 typescript（消费仓零强迫）。
 * 无 package.json 或 resolve 失败 → false（不回落到 kit 包内 node_modules，避免测/CI 假阳性）。
 */
export function hasTypescriptPeer(targetRoot: string): boolean {
  const pkgJson = path.join(targetRoot, 'package.json')
  if (!existsSync(pkgJson)) return false
  try {
    const req = createRequire(pkgJson)
    req.resolve('typescript')
    return true
  } catch {
    return false
  }
}

function loadTypescript(targetRoot: string): TsModule | null {
  const pkgJson = path.join(targetRoot, 'package.json')
  if (!existsSync(pkgJson)) return null
  try {
    const req = createRequire(pkgJson)
    return req('typescript') as TsModule
  } catch {
    return null
  }
}

type CheckableIb = {
  path: string
  symbol: string
  source: string
  nodeId: string
  kind: string
}

type GraphEdgeRef = {
  from: string
  to: string
  source: string
}

function collectAstGraph(inputRoot: string): {
  byNodeId: Map<string, CheckableIb>
  edges: GraphEdgeRef[]
  skippedIb: number
} {
  const byNodeId = new Map<string, CheckableIb>()
  const edges: GraphEdgeRef[] = []
  let skippedIb = 0
  if (!existsSync(inputRoot)) return { byNodeId, edges, skippedIb }

  let ids: string[]
  try {
    ids = allGraphIds(inputRoot, { recursive: true })
  } catch (err) {
    if (err instanceof GraphYamlError) fail(`graph ast check: ${err.message}`, 2)
    throw err
  }

  for (const id of ids) {
    const yamlAbs = yamlPathFor(inputRoot, id)
    let data
    try {
      data = loadYaml(yamlAbs)
    } catch (err) {
      if (err instanceof GraphYamlError) fail(`graph ast check: ${err.message}`, 2)
      throw err
    }
    const source = path.basename(yamlAbs)
    const nodes = data.nodes || []
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i] as {
        id?: string
        kind?: string
        implementedBy?: unknown
      }
      if (n == null || typeof n !== 'object') continue
      if (!('implementedBy' in n) || n.implementedBy == null) continue
      const nodeId = n.id != null ? String(n.id) : `nodes[${i}]`
      const kind = n.kind != null ? String(n.kind) : ''
      // kind 过滤不硬编码七域/词表字面量（F1 单源）；空/TBD path·symbol 与非 TS 在此跳过
      const ib = n.implementedBy
      if (ib == null || typeof ib !== 'object' || Array.isArray(ib)) {
        skippedIb += 1
        continue
      }
      const obj = ib as { path?: unknown; symbol?: unknown }
      if (typeof obj.path !== 'string') {
        skippedIb += 1
        continue
      }
      if (isSkippableIbPath(obj.path)) {
        skippedIb += 1
        continue
      }
      if (!isTypescriptPath(obj.path)) {
        skippedIb += 1
        continue
      }
      const symbol = typeof obj.symbol === 'string' ? obj.symbol : undefined
      if (isSkippableIbSymbol(symbol)) {
        skippedIb += 1
        continue
      }
      const item: CheckableIb = {
        path: obj.path.replace(/\\/g, '/'),
        symbol: (symbol as string).trim(),
        source,
        nodeId,
        kind,
      }
      byNodeId.set(nodeId, item)
    }
    for (const e of data.edges || []) {
      if (e == null || typeof e !== 'object') continue
      const from = e.from != null ? String(e.from) : ''
      const to = e.to != null ? String(e.to) : ''
      if (!from || !to) continue
      edges.push({ from, to, source })
    }
  }
  return { byNodeId, edges, skippedIb }
}

/** 供测与 CLI：可检 IB 列表（有有效 path+symbol 的 TS 项） */
export function collectAstCheckable(inputRoot: string): {
  checkable: Array<{ path: string; symbol?: string; source: string; nodeId: string }>
  skippedIb: number
} {
  const { byNodeId, skippedIb } = collectAstGraph(inputRoot)
  return {
    checkable: [...byNodeId.values()].map((c) => ({
      path: c.path,
      symbol: c.symbol,
      source: c.source,
      nodeId: c.nodeId,
    })),
    skippedIb,
  }
}

function parseSourceFile(ts: TsModule, absPath: string): TsNode {
  const text = readFileSync(absPath, 'utf8')
  const isTsx = /\.tsx$/i.test(absPath)
  return ts.createSourceFile(
    absPath,
    text,
    ts.ScriptTarget.Latest,
    true,
    isTsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
}

function namedDeclName(ts: TsModule, node: TsNode): string | null {
  if (
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isEnumDeclaration(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isPropertyDeclaration(node) ||
    ts.isModuleDeclaration(node)
  ) {
    const name = node.name
    if (name && ts.isIdentifier(name)) return name.text
  }
  if (ts.isVariableDeclaration(node) && node.name && ts.isIdentifier(node.name)) {
    return node.name.text
  }
  return null
}

function collectDeclaredNames(ts: TsModule, sf: TsNode): Set<string> {
  const names = new Set<string>()
  const visit = (node: TsNode): void => {
    const n = namedDeclName(ts, node)
    if (n) names.add(n)
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return names
}

function isDeclarationName(ts: TsModule, node: TsNode): boolean {
  const parent = node.parent
  if (!parent) return false
  if (!ts.isIdentifier(node)) return false
  if (parent.name === node && namedDeclName(ts, parent) === node.text) return true
  return false
}

/** 有界引用：Identifier / PropertyAccess 名匹配，排除声明名自身 */
function hasSymbolReference(ts: TsModule, sf: TsNode, symbol: string): boolean {
  let found = false
  const visit = (node: TsNode): void => {
    if (found) return
    if (ts.isIdentifier(node) && node.text === symbol && !isDeclarationName(ts, node)) {
      found = true
      return
    }
    if (ts.isPropertyAccessExpression(node)) {
      const name = node.name
      if (name && ts.isIdentifier(name) && name.text === symbol) {
        found = true
        return
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return found
}

const sourceCache = new Map<string, { ts: TsModule; sf: TsNode } | 'missing'>()

function getParsed(
  ts: TsModule,
  targetRoot: string,
  relPath: string,
): { sf: TsNode } | null {
  const abs = path.join(targetRoot, relPath)
  const key = abs
  const hit = sourceCache.get(key)
  if (hit === 'missing') return null
  if (hit) return { sf: hit.sf }
  if (!existsSync(abs)) {
    sourceCache.set(key, 'missing')
    return null
  }
  const sf = parseSourceFile(ts, abs)
  sourceCache.set(key, { ts, sf })
  return { sf }
}

export function runGraphAstCheck(opts: { target: string; inputRoot: string }): AstCheckReport {
  sourceCache.clear()
  const { byNodeId, edges, skippedIb } = collectAstGraph(opts.inputRoot)
  const base: AstCheckReport = {
    command: 'graph ast check',
    ok: true,
    target: opts.target,
    input: opts.inputRoot,
    issues: [],
    checked: 0,
    skipped_ib: skippedIb,
    skipped_reason: null,
    inform: { cross_path_edges: 0 },
  }

  if (byNodeId.size === 0) {
    return base
  }

  if (!hasTypescriptPeer(opts.target)) {
    return {
      ...base,
      checked: 0,
      skipped_reason: 'no_ts_peer',
    }
  }

  const ts = loadTypescript(opts.target)
  if (!ts) {
    return {
      ...base,
      checked: 0,
      skipped_reason: 'no_ts_peer',
    }
  }

  const issues: AstIssue[] = []
  let checked = 0

  for (const item of byNodeId.values()) {
    const parsed = getParsed(ts, opts.target, item.path)
    if (!parsed) {
      // path 缺失：跳过（分责给 graph ib check）
      continue
    }
    checked += 1
    const decls = collectDeclaredNames(ts, parsed.sf)
    if (!decls.has(item.symbol)) {
      issues.push({
        kind: 'missing_ib_symbol',
        path: item.path,
        symbol: item.symbol,
        source: item.source,
        node_id: item.nodeId,
      })
    }
  }

  for (const edge of edges) {
    const fromIb = byNodeId.get(edge.from)
    const toIb = byNodeId.get(edge.to)
    if (!fromIb || !toIb) continue
    if (fromIb.path !== toIb.path) {
      base.inform.cross_path_edges += 1
      continue
    }
    const parsed = getParsed(ts, opts.target, fromIb.path)
    if (!parsed) continue
    if (!hasSymbolReference(ts, parsed.sf, toIb.symbol)) {
      issues.push({
        kind: 'missing_bounded_call',
        path: fromIb.path,
        symbol: toIb.symbol,
        source: edge.source,
        from: edge.from,
        to: edge.to,
        detail: `caller=${fromIb.symbol} → callee=${toIb.symbol}（同 path 有界）`,
      })
    }
  }

  return {
    ...base,
    ok: issues.length === 0,
    issues,
    checked,
    skipped_reason: null,
  }
}

function printHuman(report: AstCheckReport, cwd: string): void {
  console.log(`graph ast check: ${report.ok ? 'PASS' : 'FAIL'}`)
  console.log(`target: ${toRel(cwd, report.target)}`)
  console.log(`input: ${toRel(cwd, report.input)}`)
  if (report.skipped_reason) {
    console.log(`skipped_reason: ${report.skipped_reason}`)
  }
  console.log(
    `checked: checked=${report.checked} skipped_ib=${report.skipped_ib} issues=${report.issues.length}` +
      ` inform.cross_path_edges=${report.inform.cross_path_edges}`,
  )
  for (const d of report.issues) {
    const src = d.source ? ` @ ${d.source}` : ''
    const nid = d.node_id ? ` node=${d.node_id}` : ''
    const edge = d.from && d.to ? ` ${d.from}->${d.to}` : ''
    const detail = d.detail ? ` · ${d.detail}` : ''
    const sym = d.symbol ? ` symbol=${d.symbol}` : ''
    console.log(`  [${d.kind}] ${d.path ?? ''}${sym}${edge}${src}${nid}${detail}`)
  }
  if (report.ok) {
    console.log('（只报告 · 不写盘 · opt-in · 不进默认 verify · 有界 call ≠ callgraph）')
  }
}

function printUsage(): void {
  console.log(`用法: npx spec-wave graph ast check [--target PATH] [--input DIR] [--json]

opt-in AST 闸：核对 implementedBy.symbol 存在性 + 同 path 有界 call（非完整 callgraph）。
扫描 --input（缺省 docs/_tech_graph）下 *.graph.yaml。
无 typescript（相对 --target 不可 resolve）→ exit 0 · skipped_reason=no_ts_peer（非 usage）。
无 IB / 无可检 TS 项 → exit 0 · checked=0。
symbol 缺失 → exit 2 · missing_ib_symbol；同 path 引用缺失 → exit 2 · missing_bounded_call。
跨 path 边不红（inform.cross_path_edges）。不进默认 verify。只报告不写盘。
`)
}

export async function cmdGraphAst(args: string[]): Promise<void> {
  const [action, ...actionRest] = args
  if (action !== 'check') {
    fail(`graph ast 动作未知: ${action ?? '(空)'}（支持: check）`)
  }
  let rest = actionRest
  if (rest.includes('--help') || rest.includes('-h')) {
    printUsage()
    return
  }
  const { value: targetArg, rest: r1 } = takeOption(rest, '--target')
  rest = r1
  const { value: inputArg, rest: r2 } = takeOption(rest, '--input')
  rest = r2
  const json = rest.includes('--json')
  rest = rest.filter((a) => a !== '--json')
  if (rest.length > 0) fail(`graph ast check 未知参数: ${rest.join(' ')}`)

  const cwd = process.cwd()
  const target = resolveTarget(cwd, targetArg)
  const inputRoot = inputArg
    ? path.resolve(cwd, inputArg)
    : path.resolve(target, 'docs', '_tech_graph')

  const report = runGraphAstCheck({ target, inputRoot })
  if (json) printJson(cwd, report)
  else printHuman(report, cwd)
  if (!report.ok) fail(`graph ast check 发现问题 × ${report.issues.length}`, 2)
}
