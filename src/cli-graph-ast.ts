/**
 * 3.3 W1 · graph ast check — CLI 面 / peer skip / stub（只报告 · 零写盘 · 不进默认 verify）。
 * 产品钉：SPEC docs/spec/3_3-graph-ast-opt-in/ · task 3-3-w1-graph-ast-cli
 * W1：**不**做 symbol / 有界 call 深检（W2）；无 typescript → skip exit 0 · no_ts_peer（禁止 usage=1）。
 */
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fail, printJson, resolveTarget, takeOption, toRel } from './cli-shared.ts'
import { collectImplementedByPaths, isSkippableIbPath } from './cli-graph-ib.ts'

export type AstIssue = {
  kind: string
  path?: string
  symbol?: string
  source?: string
  node_id?: string
  detail?: string
}

export type AstCheckReport = {
  command: 'graph ast check'
  ok: boolean
  target: string
  input: string
  issues: AstIssue[]
  /** 本波可计的待检 IB 数（TS/TSX path · 非 TBD）；深检前可为 0 或仅计数 */
  checked: number
  skipped_ib: number
  /** 合法 skip：no_ts_peer | ast_not_implemented；无可检项时为 null */
  skipped_reason: string | null
  inform: {
    cross_path_edges: number
  }
}

const TS_EXT = /\.(ts|tsx|mts|cts)$/i

export function isTypescriptPath(p: string): boolean {
  return TS_EXT.test(p.replace(/\\/g, '/'))
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

type Checkable = {
  path: string
  source: string
  nodeId: string
  symbol?: string
}

export function collectAstCheckable(inputRoot: string): {
  checkable: Checkable[]
  skippedIb: number
} {
  const collected = collectImplementedByPaths(inputRoot)
  const checkable: Checkable[] = []
  let skippedIb = 0
  for (const item of collected) {
    if (item.shapeError) {
      skippedIb += 1
      continue
    }
    if (isSkippableIbPath(item.path)) {
      skippedIb += 1
      continue
    }
    if (!isTypescriptPath(item.path)) {
      skippedIb += 1
      continue
    }
    checkable.push({
      path: item.path.replace(/\\/g, '/'),
      source: item.source,
      nodeId: item.nodeId,
    })
  }
  return { checkable, skippedIb }
}

export function runGraphAstCheck(opts: { target: string; inputRoot: string }): AstCheckReport {
  const { checkable, skippedIb } = collectAstCheckable(opts.inputRoot)
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

  if (checkable.length === 0) {
    return base
  }

  if (!hasTypescriptPeer(opts.target)) {
    return {
      ...base,
      checked: 0,
      skipped_reason: 'no_ts_peer',
    }
  }

  // W1 stub：peer 在且有待检项 → 显式未实装，禁止假绿假装已做 symbol/call
  return {
    ...base,
    checked: 0,
    skipped_reason: 'ast_not_implemented',
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
    const detail = d.detail ? ` · ${d.detail}` : ''
    const sym = d.symbol ? ` symbol=${d.symbol}` : ''
    console.log(`  [${d.kind}] ${d.path ?? ''}${sym}${src}${nid}${detail}`)
  }
  if (report.ok) {
    console.log('（只报告 · 不写盘 · opt-in · 不进默认 verify · W1 无深检）')
  }
}

function printUsage(): void {
  console.log(`用法: npx spec-wave graph ast check [--target PATH] [--input DIR] [--json]

opt-in AST 闸（symbol / 有界 call · W2 实装；本版 W1 为契约面 + stub/skip）。
扫描 --input（缺省 docs/_tech_graph）下 *.graph.yaml 的 nodes[].implementedBy。
无 typescript（相对 --target 不可 resolve）→ exit 0 · skipped_reason=no_ts_peer（非 usage）。
无 IB / 无可检 TS 项 → exit 0 · checked=0。
深检未实装 → exit 0 · skipped_reason=ast_not_implemented（不假绿）。
不进默认 verify。只报告不写盘。
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
