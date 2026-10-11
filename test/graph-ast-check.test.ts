/**
 * 3.3 W1 · graph ast check 契约锁（CLI 面 / peer skip / stub）
 * 旧测影响面（20 审 N5）：additive 新子命令；不进默认 verify；
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

function flowYaml(opts: { path?: string; symbol?: string; withIb?: boolean }): string {
  const withIb = opts.withIb !== false
  const ib =
    withIb && opts.path != null
      ? `
    implementedBy:
      path: "${opts.path}"${
          opts.symbol != null
            ? `
      symbol: "${opts.symbol}"`
            : ''
        }`
      : ''
  return `schema_version: inform_graph.v3
graph_id: "10_flow_ast"
title: "ast fixture"
nodes:
  - id: "A"
    label: "A"
    kind: "flow"${ib}
  - id: "B"
    label: "B"
    kind: "flow"
edges:
  - from: "A"
    to: "B"
    label: "->"
`
}

async function seedGraph(
  dir: string,
  opts: { path?: string; symbol?: string; withIb?: boolean; pkgJson?: boolean } = {},
): Promise<void> {
  const input = path.join(dir, 'docs/_tech_graph')
  await mkdir(input, { recursive: true })
  await writeFile(
    path.join(input, '10_flow_ast.graph.yaml'),
    flowYaml({
      path: opts.path,
      symbol: opts.symbol,
      withIb: opts.withIb,
    }),
  )
  if (opts.pkgJson !== false) {
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'sw-ast-fixture', version: '0.0.0', private: true }, null, 2) + '\n',
    )
  }
}

describe('3.3 W1 · graph ast check', { concurrency: 1 }, () => {
  it('A1 · graph --help 列出 ast check', async () => {
    const r = await runCore(['graph', '--help'], KIT)
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /graph ast check/)
  })

  it('A1b · graph ast check --help 可见旗标', async () => {
    const r = await runCore(['graph', 'ast', 'check', '--help'], KIT)
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /--target/)
    assert.match(r.combined, /--input/)
    assert.match(r.combined, /--json/)
  })

  it('A2 · 无 typescript peer → exit 0 · skipped_reason=no_ts_peer（非 usage=1）', async () => {
    await withTemp(async (dir) => {
      await seedGraph(dir, { path: 'src/foo.ts', symbol: 'bar' })
      // 无 node_modules/typescript · createRequire(target/package.json) 失败
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

  it('A4 · stub 不假绿：有 peer 待检项 → ast_not_implemented', async () => {
    // 以 KIT 自身为 target（devDep 含 typescript）+ 临时 input
    await withTemp(async (dir) => {
      const input = path.join(dir, 'docs/_tech_graph')
      await mkdir(input, { recursive: true })
      await writeFile(
        path.join(input, '10_flow_ast.graph.yaml'),
        flowYaml({ path: 'src/cli.ts', symbol: 'main' }),
      )
      const r = await runCore(
        ['graph', 'ast', 'check', '--target', KIT, '--input', input, '--json'],
        KIT,
      )
      assert.equal(r.status, 0, r.combined)
      const payload = JSON.parse(r.stdout.trim()) as {
        ok: boolean
        skipped_reason: string | null
        issues: unknown[]
      }
      assert.equal(payload.ok, true)
      assert.equal(payload.skipped_reason, 'ast_not_implemented')
      assert.equal(payload.issues.length, 0)
      assert.doesNotMatch(r.combined, /missing_ib_symbol|missing_bounded_call/)
    })
  })

  it('A5 · --json 信封字段', async () => {
    await withTemp(async (dir) => {
      await seedGraph(dir, { path: 'src/foo.ts' })
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

  it('A6 · verify 不强制跑 graph ast check', async () => {
    const r = await runCore(
      ['verify', '--target', '.', '--task', 'docs/tasks/done/task_3_3_w1_graph_ast_cli.md'],
      KIT,
    )
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /VERIFY: PASS/)
    assert.doesNotMatch(r.combined, /graph ast check/)
  })

  it('A7 · 只读：skip 后 fixture 图谱仍在且未被改写', async () => {
    await withTemp(async (dir) => {
      await seedGraph(dir, { path: 'src/foo.ts', symbol: 'x' })
      const yamlPath = path.join(dir, 'docs/_tech_graph/10_flow_ast.graph.yaml')
      const before = await import('node:fs/promises').then((fs) => fs.readFile(yamlPath, 'utf8'))
      const r = await runCore(['graph', 'ast', 'check', '--target', dir], KIT)
      assert.equal(r.status, 0, r.combined)
      const after = await import('node:fs/promises').then((fs) => fs.readFile(yamlPath, 'utf8'))
      assert.equal(after, before)
    })
  })

  it('A8 · 既有 ib check 命令面零回归（仍可发现）', async () => {
    const r = await runCore(['graph', '--help'], KIT)
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /graph ib check/)
    assert.match(r.combined, /graph indexes check/)
  })
})
