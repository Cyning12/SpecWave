/**
 * 3.3 W2 · graph ast check（symbol + 有界 call）
 * 旧测影响面（20 审 N5）：改写 W1 A4 stub；additive 深检；不进默认 verify；
 * 既有 graph ib / indexes / drift / yaml 缺省 stdout/exit 零改语义。
 * 临时 fixture · 勿污染本仓 docs/_tech_graph dogfood。
 */
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { runCore } from './_helpers/core-harness.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'sw-ast-'))
  await mkdir(path.join(dir, '.git'), { recursive: true })
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

function flowYaml(opts: {
  nodes?: Array<{
    id: string
    kind?: string
    path?: string
    symbol?: string
  }>
  edges?: Array<{ from: string; to: string }>
}): string {
  const nodes =
    opts.nodes ??
    ([
      { id: 'A', kind: 'flow', path: undefined as string | undefined, symbol: undefined as string | undefined },
      { id: 'B', kind: 'flow' },
    ] as const)
  const nodeLines = nodes
    .map((n) => {
      let ib = ''
      if (n.path != null) {
        ib = `
    implementedBy:
      path: "${n.path}"${
          n.symbol != null
            ? `
      symbol: "${n.symbol}"`
            : ''
        }`
      }
      return `  - id: "${n.id}"
    label: "${n.id}"
    kind: "${n.kind ?? 'flow'}"${ib}`
    })
    .join('\n')
  const edges = opts.edges ?? [{ from: 'A', to: 'B' }]
  const edgeLines = edges.map((e) => `  - from: "${e.from}"\n    to: "${e.to}"\n    label: "->"`).join('\n')
  return `schema_version: inform_graph.v3
graph_id: "10_flow_ast"
title: "ast fixture"
nodes:
${nodeLines}
edges:
${edgeLines}
`
}

async function seedGraph(
  dir: string,
  opts: {
    path?: string
    symbol?: string
    withIb?: boolean
    pkgJson?: boolean
    yaml?: string
  } = {},
): Promise<string> {
  const input = path.join(dir, 'docs/_tech_graph')
  await mkdir(input, { recursive: true })
  const body =
    opts.yaml ??
    flowYaml({
      nodes:
        opts.withIb === false
          ? [
              { id: 'A', kind: 'flow' },
              { id: 'B', kind: 'flow' },
            ]
          : [
              {
                id: 'A',
                kind: 'flow',
                path: opts.path,
                symbol: opts.symbol,
              },
              { id: 'B', kind: 'flow' },
            ],
    })
  await writeFile(path.join(input, '10_flow_ast.graph.yaml'), body)
  if (opts.pkgJson !== false) {
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'sw-ast-fixture', version: '0.0.0', private: true }, null, 2) + '\n',
    )
  }
  return input
}

describe('3.3 W2 · graph ast check', { concurrency: 1 }, () => {
  it('A1 · graph --help 列出 ast check', async () => {
    const r = await runCore(['graph', '--help'], KIT)
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /graph ast check/)
  })

  it('A1b · graph ast check --help 可见旗标与有界语义', async () => {
    const r = await runCore(['graph', 'ast', 'check', '--help'], KIT)
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /--target/)
    assert.match(r.combined, /--input/)
    assert.match(r.combined, /--json/)
    assert.match(r.combined, /missing_ib_symbol|有界 call/)
    assert.doesNotMatch(r.combined, /ast_not_implemented/)
  })

  it('A2 · 无 typescript peer → exit 0 · skipped_reason=no_ts_peer（非 usage=1）', async () => {
    await withTemp(async (dir) => {
      await seedGraph(dir, { path: 'src/foo.ts', symbol: 'bar' })
      const r = await runCore(['graph', 'ast', 'check', '--target', dir], KIT)
      assert.equal(r.status, 0, r.combined)
      assert.notEqual(r.status, 1, '禁止 peer 缺失走 usage=1')
      assert.match(r.combined, /skipped_reason:\s*no_ts_peer|no_ts_peer/)
    })
  })

  it('A3 · 无 IB → exit 0 · checked=0', async () => {
    await withTemp(async (dir) => {
      await seedGraph(dir, { withIb: false })
      const r = await runCore(['graph', 'ast', 'check', '--target', dir, '--json'], KIT)
      assert.equal(r.status, 0, r.combined)
      const payload = JSON.parse(r.stdout.trim()) as {
        command: string
        ok: boolean
        checked: number
        skipped_reason: string | null
        issues: unknown[]
      }
      assert.equal(payload.command, 'graph ast check')
      assert.equal(payload.ok, true)
      assert.equal(payload.checked, 0)
      assert.equal(payload.skipped_reason, null)
      assert.equal(payload.issues.length, 0)
    })
  })

  it('A4 · symbol 正：真符号存在 → exit 0（消除 stub）', async () => {
    await withTemp(async (dir) => {
      // 复用 KIT 的 typescript peer（target=KIT）+ 临时 input；源文件在 kit 仓内
      const kitInput = path.join(dir, 'kit_input')
      await mkdir(kitInput, { recursive: true })
      await writeFile(
        path.join(kitInput, '10_flow_ast.graph.yaml'),
        flowYaml({
          nodes: [
            { id: 'A', kind: 'method', path: 'src/cli-graph-ast.ts', symbol: 'runGraphAstCheck' },
            { id: 'B', kind: 'flow' },
          ],
        }),
      )
      const r = await runCore(
        ['graph', 'ast', 'check', '--target', KIT, '--input', kitInput, '--json'],
        KIT,
      )
      assert.equal(r.status, 0, r.combined)
      const payload = JSON.parse(r.stdout.trim()) as {
        ok: boolean
        skipped_reason: string | null
        issues: Array<{ kind: string }>
        checked: number
      }
      assert.equal(payload.ok, true)
      assert.equal(payload.skipped_reason, null)
      assert.notEqual(payload.skipped_reason, 'ast_not_implemented')
      assert.equal(payload.issues.length, 0)
      assert.ok(payload.checked >= 1)
    })
  })

  it('A5 · symbol 负：假符号 → exit 2 · missing_ib_symbol', async () => {
    await withTemp(async (dir) => {
      const kitInput = path.join(dir, 'kit_input')
      await mkdir(kitInput, { recursive: true })
      await writeFile(
        path.join(kitInput, '10_flow_ast.graph.yaml'),
        flowYaml({
          nodes: [
            { id: 'A', kind: 'method', path: 'src/cli-graph-ast.ts', symbol: 'NoSuchSymbol_ZZZ' },
            { id: 'B', kind: 'flow' },
          ],
        }),
      )
      const r = await runCore(
        ['graph', 'ast', 'check', '--target', KIT, '--input', kitInput, '--json'],
        KIT,
      )
      assert.equal(r.status, 2, r.combined)
      const payload = JSON.parse(r.stdout.trim()) as {
        ok: boolean
        issues: Array<{ kind: string; symbol?: string }>
        skipped_reason: string | null
      }
      assert.equal(payload.ok, false)
      assert.equal(payload.skipped_reason, null)
      assert.ok(payload.issues.some((i) => i.kind === 'missing_ib_symbol'))
      assert.ok(payload.issues.some((i) => i.symbol === 'NoSuchSymbol_ZZZ'))
    })
  })

  async function linkTsPeer(dir: string): Promise<void> {
    await mkdir(path.join(dir, 'node_modules'), { recursive: true })
    const { symlink } = await import('node:fs/promises')
    const dest = path.join(dir, 'node_modules/typescript')
    try {
      await symlink(path.join(KIT, 'node_modules/typescript'), dest)
    } catch {
      /* exists */
    }
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'sw-ast-fixture', version: '0.0.0', private: true }, null, 2) + '\n',
    )
  }

  it('A6 · 有界 call 同 path 负 → exit 2 · missing_bounded_call', async () => {
    await withTemp(async (dir) => {
      await mkdir(path.join(dir, 'src'), { recursive: true })
      await linkTsPeer(dir)
      await writeFile(
        path.join(dir, 'src', 'pair.ts'),
        'export function callerFn() { return 1 }\nexport function calleeFn() { return 2 }\n',
      )
      const input = await seedGraph(dir, {
        yaml: flowYaml({
          nodes: [
            { id: 'Caller', kind: 'method', path: 'src/pair.ts', symbol: 'callerFn' },
            { id: 'Callee', kind: 'method', path: 'src/pair.ts', symbol: 'calleeFn' },
          ],
          edges: [{ from: 'Caller', to: 'Callee' }],
        }),
        pkgJson: false,
      })
      const r = await runCore(
        ['graph', 'ast', 'check', '--target', dir, '--input', input, '--json'],
        KIT,
      )
      assert.equal(r.status, 2, r.combined)
      const payload = JSON.parse(r.stdout.trim()) as {
        issues: Array<{ kind: string }>
      }
      assert.ok(payload.issues.some((i) => i.kind === 'missing_bounded_call'), r.combined)
    })
  })

  it('A7 · 有界 call 同 path 正 → exit 0', async () => {
    await withTemp(async (dir) => {
      await mkdir(path.join(dir, 'src'), { recursive: true })
      await linkTsPeer(dir)
      await writeFile(
        path.join(dir, 'src', 'pair.ts'),
        'export function calleeFn() { return 2 }\nexport function callerFn() { return calleeFn() }\n',
      )
      const input = await seedGraph(dir, {
        yaml: flowYaml({
          nodes: [
            { id: 'Caller', kind: 'method', path: 'src/pair.ts', symbol: 'callerFn' },
            { id: 'Callee', kind: 'method', path: 'src/pair.ts', symbol: 'calleeFn' },
          ],
          edges: [{ from: 'Caller', to: 'Callee' }],
        }),
        pkgJson: false,
      })
      const r = await runCore(
        ['graph', 'ast', 'check', '--target', dir, '--input', input, '--json'],
        KIT,
      )
      assert.equal(r.status, 0, r.combined)
      const payload = JSON.parse(r.stdout.trim()) as {
        ok: boolean
        issues: unknown[]
        skipped_reason: string | null
      }
      assert.equal(payload.ok, true)
      assert.equal(payload.issues.length, 0)
      assert.equal(payload.skipped_reason, null)
    })
  })

  it('A8 · 跨 path 边不红 · inform.cross_path_edges', async () => {
    await withTemp(async (dir) => {
      await mkdir(path.join(dir, 'src'), { recursive: true })
      await linkTsPeer(dir)
      await writeFile(path.join(dir, 'src', 'a.ts'), 'export function aFn() { return 1 }\n')
      await writeFile(path.join(dir, 'src', 'b.ts'), 'export function bFn() { return 2 }\n')
      const input = await seedGraph(dir, {
        yaml: flowYaml({
          nodes: [
            { id: 'A', kind: 'method', path: 'src/a.ts', symbol: 'aFn' },
            { id: 'B', kind: 'method', path: 'src/b.ts', symbol: 'bFn' },
          ],
          edges: [{ from: 'A', to: 'B' }],
        }),
        pkgJson: false,
      })
      const r = await runCore(
        ['graph', 'ast', 'check', '--target', dir, '--input', input, '--json'],
        KIT,
      )
      assert.equal(r.status, 0, r.combined)
      const payload = JSON.parse(r.stdout.trim()) as {
        ok: boolean
        issues: Array<{ kind: string }>
        inform: { cross_path_edges: number }
      }
      assert.equal(payload.ok, true)
      assert.ok(!payload.issues.some((i) => i.kind === 'missing_bounded_call'))
      assert.ok(payload.inform.cross_path_edges >= 1)
    })
  })

  it('A9 · TBD symbol 跳过 · 不红', async () => {
    await withTemp(async (dir) => {
      await linkTsPeer(dir)
      const input = await seedGraph(dir, {
        path: 'src/foo.ts',
        symbol: 'TBD',
        pkgJson: false,
      })
      const r = await runCore(
        ['graph', 'ast', 'check', '--target', dir, '--input', input, '--json'],
        KIT,
      )
      assert.equal(r.status, 0, r.combined)
      const payload = JSON.parse(r.stdout.trim()) as {
        ok: boolean
        checked: number
        issues: unknown[]
      }
      assert.equal(payload.ok, true)
      assert.equal(payload.checked, 0)
      assert.equal(payload.issues.length, 0)
    })
  })

  it('A10 · --json 信封字段（peer 缺失）', async () => {
    await withTemp(async (dir) => {
      await seedGraph(dir, { path: 'src/foo.ts', symbol: 'x' })
      const r = await runCore(['graph', 'ast', 'check', '--target', dir, '--json'], KIT)
      assert.equal(r.status, 0, r.combined)
      const payload = JSON.parse(r.stdout.trim()) as {
        command: string
        ok: boolean
        issues: unknown[]
        skipped_reason: string | null
        checked: number
        skipped_ib: number
        inform: { cross_path_edges: number }
      }
      assert.equal(payload.command, 'graph ast check')
      assert.equal(typeof payload.ok, 'boolean')
      assert.ok(Array.isArray(payload.issues))
      assert.equal(payload.skipped_reason, 'no_ts_peer')
      assert.equal(typeof payload.checked, 'number')
      assert.equal(typeof payload.skipped_ib, 'number')
      assert.equal(typeof payload.inform.cross_path_edges, 'number')
    })
  })

  it('A11 · verify 不强制跑 graph ast check', async () => {
    const r = await runCore(
      ['verify', '--target', '.', '--task', 'docs/tasks/done/task_3_3_w2_graph_ast_impl.md'],
      KIT,
    )
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /VERIFY: PASS/)
    assert.doesNotMatch(r.combined, /graph ast check/)
  })

  it('A12 · 只读：红路径后 fixture 图谱仍在且未被改写', async () => {
    await withTemp(async (dir) => {
      const kitInput = path.join(dir, 'kit_input')
      await mkdir(kitInput, { recursive: true })
      const yamlPath = path.join(kitInput, '10_flow_ast.graph.yaml')
      await writeFile(
        yamlPath,
        flowYaml({
          nodes: [
            { id: 'A', kind: 'method', path: 'src/cli-graph-ast.ts', symbol: 'NoSuch_Readonly' },
            { id: 'B', kind: 'flow' },
          ],
        }),
      )
      const before = await import('node:fs/promises').then((fs) => fs.readFile(yamlPath, 'utf8'))
      const r = await runCore(
        ['graph', 'ast', 'check', '--target', KIT, '--input', kitInput],
        KIT,
      )
      assert.equal(r.status, 2, r.combined)
      const after = await import('node:fs/promises').then((fs) => fs.readFile(yamlPath, 'utf8'))
      assert.equal(after, before)
    })
  })

  it('A13 · 既有 ib / indexes 命令面零回归', async () => {
    const r = await runCore(['graph', '--help'], KIT)
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /graph ib check/)
    assert.match(r.combined, /graph indexes check/)
    assert.match(r.combined, /graph ast check/)
  })
})
