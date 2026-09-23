import assert from 'node:assert/strict'
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises'
import { readFileSync, readdirSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { CliError } from '../src/cli-shared.ts'
import { cmdGraph } from '../src/cli-graph.ts'
import { compileGraph, exportGraphJson, loadYaml, validateGraphYaml } from '../src/cli-graph-yaml.ts'
import { buildSnapshot, type HgmSnapshot } from '../src/cli-graph-hgm.ts'
import { checkHgmAgainstTbox, HGM_EDGE_TO_TBOX } from '../src/cli-graph-ontology.ts'
import { yamlLoad } from '../src/yaml.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TECH_GRAPH_DIR = path.join(KIT, 'docs', '_tech_graph')
const ONTO = path.join(KIT, 'assets', 'ontology.yaml')
const VOCAB = path.join(KIT, 'assets', 'tech-graph-vocab.yaml')

// 3.0 W3 · S4.5 F1 受限形态统一（验收 #6 · 研究文 §9.1 批准边界）：
//   ① TBox 内核 = assets/ontology.yaml（两图共享词汇真值）· HGM 全量适配（graph ontology check --hgm）
//   ② tech-graph 浅登记 = assets/tech-graph-vocab.yaml（tech: namespace · 表现层词汇 · 非产品本体类 F-W3-10）
//      —— kind 枚举（原 :87）与 KIND_TO_CLASS（原 :412 · 20 审 R1-A3）双硬拷贝同迁 · 边型钩 Warning 级
//   ③ 单源校验：src 内 flow/struct/external 字面量零残留（grep 机械断言）· HGM 映射表单点声明
// 恒等 fixture：仓内 5 份语料 compile 产物 ≡ tracked md 逐字 · export ≡ tracked shared/graph.json 逐字
// （tracked 产物 = 旧硬编码行为锚 · 本棒三方比对留证：tracked ≡ 改前基线 ≡ 改后产物）。

type RunResult = { status: number; stdout: string; stderr: string; combined: string }

function makeCore(fn: (args: string[]) => Promise<void>): (args: string[]) => Promise<RunResult> {
  return async (args) => {
    const out: string[] = []
    const err: string[] = []
    const origLog = console.log
    const origError = console.error
    const origWrite = process.stdout.write
    console.log = (...a: unknown[]) => { out.push(a.map(String).join(' ')) }
    console.error = (...a: unknown[]) => { err.push(a.map(String).join(' ')) }
    process.stdout.write = ((chunk: unknown) => {
      out.push(String(chunk).replace(/\n$/, ''))
      return true
    }) as typeof process.stdout.write
    let status = 0
    try {
      await fn(args)
    } catch (e) {
      if (e instanceof CliError) {
        status = e.exitCode
        if (e.message) err.push(e.message)
      } else {
        throw e
      }
    } finally {
      console.log = origLog
      console.error = origError
      process.stdout.write = origWrite
    }
    const stdout = out.length > 0 ? out.join('\n') + '\n' : ''
    const stderr = err.length > 0 ? err.join('\n') + '\n' : ''
    return { status, stdout, stderr, combined: `${stdout}\n${stderr}` }
  }
}

const runGraph = makeCore(cmdGraph)

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'spec-wave-f1-unify-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

function taskMd(slug: string, blocks: string): string {
  return [
    `# Task ${slug}`,
    '',
    '> **状态**：`draft`',
    '',
    '## Harness 元信息',
    '',
    '| 字段 | 值 |',
    '|------|-----|',
    `| **task_slug** | \`${slug}\` |`,
    '',
    '### 人工闸',
    '',
    '| human_gate_id | status | blocks_hats | 说明 |',
    '|---------------|--------|-------------|------|',
    `| HG-AUDIT-R1 | pending | ${blocks} | fixture |`,
    '',
  ].join('\n')
}

async function seedRepo(dir: string, blocks: string): Promise<void> {
  await mkdir(path.join(dir, '.coding-kit'), { recursive: true })
  await writeFile(
    path.join(dir, '.coding-kit', 'manifest.json'),
    JSON.stringify({ version: '2.4.2', preset: 'harness-only', ide: [], from_version: null, upgraded_at: '2026-09-17T00:00:00Z' }),
  )
  await mkdir(path.join(dir, 'docs', 'tasks', 'active'), { recursive: true })
  await writeFile(path.join(dir, 'docs', 'tasks', 'active', 'task_f1_v1.md'), taskMd('f1', blocks))
}

describe('3.0-W3 S4.5 · F1 受限统一（HGM 全量适配 + tech-graph 浅登记 + 单源校验）', { concurrency: 1 }, () => {
  it('HGM PASS fixture：真实事件轨（ingest 产出）→ node.kind ⊆ classes · edge.type ⊆ relations · exit 0 · --json 键集钉死', async () => {
    await withTemp(async (dir) => {
      await seedRepo(dir, '30-execute-code')
      const ingest = await runGraph(['ingest', '--target', dir])
      assert.equal(ingest.status, 0, ingest.combined)
      const r = await runGraph(['ontology', 'check', '--hgm', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.stdout, /conforms: true/)
      assert.match(r.stdout, /实体: nodes=\d+ edges=\d+/)
      const json = await runGraph(['ontology', 'check', '--hgm', '--target', dir, '--json'])
      assert.equal(json.status, 0, json.combined)
      const report = JSON.parse(json.stdout) as Record<string, unknown>
      assert.deepEqual(Object.keys(report), ['command', 'ontology', 'target', 'profile', 'shapes', 'entities', 'conforms', 'violations'])
      assert.equal(report.command, 'graph ontology check --hgm')
      assert.equal(report.profile, 'spec-wave-shacl-subset/v1')
      assert.deepEqual(report.shapes, ['HgmInstanceShape', 'HgmEdgeShape', 'HgmHatVocabShape'])
      assert.deepEqual(Object.keys(report.entities as Record<string, unknown>), ['nodes', 'edges'])
      assert.equal(report.conforms, true)
      assert.deepEqual(report.violations, [])
    })
  })

  it('hat 词汇前缀段归一：闸表短形 30 ≡ TBox 30-execute-code → 归一命中零 Warning（F-W3-09 归一面）', async () => {
    await withTemp(async (dir) => {
      await seedRepo(dir, '30')
      await runGraph(['ingest', '--target', dir])
      const r = await runGraph(['ontology', 'check', '--hgm', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.doesNotMatch(r.combined, /HgmHatVocabShape/)
    })
  })

  it('hat 词汇漂移 Warning 点名（兜住 D2-a2 类未声明帽可见性 · 不咬 exit · 不得静默）', async () => {
    await withTemp(async (dir) => {
      await seedRepo(dir, 'execute-code')
      await runGraph(['ingest', '--target', dir])
      const r = await runGraph(['ontology', 'check', '--hgm', '--target', dir])
      assert.equal(r.status, 0, r.combined) // Warning 不咬 exit
      assert.match(r.combined, /\[WARNING\] HgmHatVocabShape @ edges\[\d+\]\.hat_id :: .*execute-code/)
      assert.match(r.combined, /conforms: true/)
      const json = await runGraph(['ontology', 'check', '--hgm', '--target', dir, '--json'])
      const report = JSON.parse(json.stdout) as { violations: { shape: string; severity: string }[] }
      assert.equal(report.violations.length, 1)
      assert.equal(report.violations[0]!.severity, 'Warning')
    })
  })

  it('HGM Violation fixture：TBox 删 Hat 类（--file 漂移 TBox）→ node.kind Hat 未声明 → exit 2 点名 HgmInstanceShape', async () => {
    await withTemp(async (dir) => {
      await seedRepo(dir, '30-execute-code')
      await runGraph(['ingest', '--target', dir])
      const tbox = readFileSync(ONTO, 'utf8').replace('  - id: Hat\n    domain: Instance\n', '')
      const tboxFile = path.join(dir, 'tbox-no-hat.yaml')
      await writeFile(tboxFile, tbox)
      const r = await runGraph(['ontology', 'check', '--hgm', '--target', dir, '--file', tboxFile])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[VIOLATION\] HgmInstanceShape @ nodes\[hat:30-execute-code\]\.kind :: .*未在 TBox 声明: Hat/)
    })
  })

  it('未映射边型 Violation（checkHgmAgainstTbox 直调）：edge.type ∉ HGM_EDGE_TO_TBOX → Violation 点名', () => {
    const ontoDoc = yamlLoad(readFileSync(ONTO, 'utf8')) as Record<string, unknown>
    const snapshot = {
      nodes: {},
      edges: [{ from: 'task:x', to: 'gate:x:HG-X', type: 'WEIRD_EDGE' }],
      projections: { task_status: {}, gate_status: {}, rejected_events: [] },
      generated_at: '2026-09-17T00:00:00Z',
    } as unknown as HgmSnapshot
    const violations = checkHgmAgainstTbox(snapshot, ontoDoc)
    assert.equal(violations.length, 1)
    assert.equal(violations[0]!.shape, 'HgmEdgeShape')
    assert.equal(violations[0]!.severity, 'Violation')
    assert.match(violations[0]!.message, /WEIRD_EDGE/)
  })

  it('映射表单点声明：HGM_EDGE_TO_TBOX ≡ {HAS_GATE→hasGate, BLOCKS→blocks} · 定义点唯一（cli-graph-ontology.ts）', () => {
    assert.deepEqual(HGM_EDGE_TO_TBOX, { HAS_GATE: 'hasGate', BLOCKS: 'blocks' })
    const hitFiles = new Set<string>()
    const scan = (dir: string) => {
      for (const ent of readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, ent.name)
        if (ent.isDirectory()) {
          scan(abs)
          continue
        }
        if (!ent.name.endsWith('.ts')) continue
        if (readFileSync(abs, 'utf8').includes('HGM_EDGE_TO_TBOX')) hitFiles.add(path.relative(KIT, abs))
      }
    }
    scan(path.join(KIT, 'src'))
    // 定义+消费同文件单点（cli-graph-ontology.ts）· 其余 src 零命中（cli-graph.ts 仅经 checkHgmAgainstTbox 间接消费）
    assert.deepEqual([...hitFiles].sort(), ['src/cli-graph-ontology.ts'])
    const ontoSrc = readFileSync(path.join(KIT, 'src', 'cli-graph-ontology.ts'), 'utf8')
    assert.equal(ontoSrc.split('\n').filter((l) => l.includes('export const HGM_EDGE_TO_TBOX')).length, 1, '定义点须唯一')
  })

  it('tech-graph 登记档内容钉：version/namespace/kinds 三类+class 映射/edge_types 六条/头注释非产品本体类', () => {
    const body = readFileSync(VOCAB, 'utf8')
    const doc = yamlLoad(body) as { version: string; namespace: string; kinds: { id: string; class: string }[]; edge_types: string[] }
    assert.equal(doc.version, '1')
    assert.equal(doc.namespace, 'tech:')
    assert.deepEqual(doc.kinds, [
      { id: 'flow', class: 'phase' },
      { id: 'struct', class: 'doc' },
      { id: 'external', class: 'infra' },
    ])
    // 3.0.2 W1（F-1① · ops-desk-api 反馈）：补登记 branches/triggers（LangGraph 系普适边型）· 四条 → 六条
    assert.deepEqual(doc.edge_types, ['depends_on', 'async_calls', 'condition', 'has_metadata', 'branches', 'triggers'])
    assert.match(body, /非产品本体类/)
    assert.match(body, /表现层词汇登记/)
  })

  it('恒等 fixture：仓内 5 份语料登记档驱动 compile ≡ tracked md 逐字 · export ≡ tracked graph.json 逐字（零 breaking 机械证明）', async () => {
    await withTemp(async (dir) => {
      const ids = ['00_main', '10_flow_graph_yaml_pipeline', '10_flow_task_close', '10_flow_upgrade', '10_flow_verify']
      for (const id of ids) {
        const out = path.join(dir, `${id}.md`)
        compileGraph(id, TECH_GRAPH_DIR, out)
        assert.equal(
          readFileSync(out, 'utf8'),
          readFileSync(path.join(TECH_GRAPH_DIR, `${id}.md`), 'utf8'),
          `${id} 产物须与 tracked md（旧硬编码行为锚）逐字一致`,
        )
      }
      const { outPath } = exportGraphJson(TECH_GRAPH_DIR, { outPath: path.join(dir, 'graph.json') })
      assert.equal(
        readFileSync(outPath, 'utf8'),
        readFileSync(path.join(TECH_GRAPH_DIR, 'shared', 'graph.json'), 'utf8'),
        'export 产物须与 tracked shared/graph.json 逐字一致',
      )
    })
  })

  it('kind 校验单源化等价：登记档三类放行 · 第四类报「kind 非法」（与旧硬编码行为一致）', () => {
    const base = { graph_id: 'g', title: 't', nodes: [{ id: 'A', label: 'a' }], edges: [] }
    for (const kind of ['flow', 'struct', 'external']) {
      const errs = validateGraphYaml({ ...base, nodes: [{ id: 'A', label: 'a', kind }] })
      assert.deepEqual(errs, [], `kind=${kind} 须放行`)
    }
    const errs = validateGraphYaml({ ...base, nodes: [{ id: 'A', label: 'a', kind: 'bogus' }] })
    assert.deepEqual(errs, ['nodes[0].kind 非法: bogus'])
  })

  it('边型钩②：显式 edges[].type 未登记 → compile stderr Warning 行 · exit 0 · 产物照出（不咬 exit · 开放惯例保留）', async () => {
    await withTemp(async (dir) => {
      const input = path.join(dir, 'docs', '_tech_graph')
      await mkdir(input, { recursive: true })
      await writeFile(
        path.join(input, 'g1.graph.yaml'),
        [
          'graph_id: "g1"',
          'title: "fixture"',
          'nodes:',
          '  - id: "A"',
          '    label: "Alpha"',
          '  - id: "B"',
          '    label: "Beta"',
          'edges:',
          '  - from: "A"',
          '    to: "B"',
          '    type: "bogus_edge"',
          '',
        ].join('\n'),
      )
      const r = await runGraph(['yaml', 'compile', '--graph-id', 'g1', '--input', input, '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.stderr, /\[warning\] .*edges\[0\]\.type 未在 tech-graph 词汇登记档.*bogus_edge/)
      assert.match(r.stdout, /Generated:/)
      // 合规语料零 Warning（4 边型登记内不显式 drift）
      await writeFile(
        path.join(input, 'g2.graph.yaml'),
        [
          'graph_id: "g2"',
          'title: "fixture2"',
          'nodes: [{ id: "A", label: "Alpha" }, { id: "B", label: "Beta" }]',
          'edges: [{ from: "A", to: "B", type: "depends_on" }]',
          '',
        ].join('\n'),
      )
      const ok = await runGraph(['yaml', 'compile', '--graph-id', 'g2', '--input', input, '--target', dir])
      assert.equal(ok.status, 0, ok.combined)
      assert.doesNotMatch(ok.stderr, /\[warning\]/)
    })
  })

  it('边型钩②·3.0.2 W1 登记面：显式 type: branches / type: triggers ⇒ compile exit 0 · stderr 零「未在 tech-graph 词汇登记档」告警（F-1① 告警疲劳清零 · 未登记仍告警由钩② bogus_edge 覆盖）', async () => {
    await withTemp(async (dir) => {
      const input = path.join(dir, 'docs', '_tech_graph')
      await mkdir(input, { recursive: true })
      await writeFile(
        path.join(input, 'g3.graph.yaml'),
        [
          'graph_id: "g3"',
          'title: "fixture3"',
          'nodes: [{ id: "A", label: "Alpha" }, { id: "B", label: "Beta" }, { id: "C", label: "Gamma" }]',
          'edges:',
          '  - from: "A"',
          '    to: "B"',
          '    type: "branches"',
          '  - from: "B"',
          '    to: "C"',
          '    type: "triggers"',
          '',
        ].join('\n'),
      )
      const r = await runGraph(['yaml', 'compile', '--graph-id', 'g3', '--input', input, '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.doesNotMatch(r.stderr, /未在 tech-graph 词汇登记档/)
      assert.match(r.stdout, /Generated:/)
    })
  })

  // 3.0.2 W1：triggers 已登记 ⇒ 本钉翻转。30 实测仓内语料 stderr 除 triggers 外无其他未登记边型告警（审查 N1 口径成立），故断言零 [warning]
  it('仓内语料浅登记可见性钉（3.0.2 W1 翻转）：compile 00_main → stderr 零「未在 tech-graph 词汇登记档」告警（branches/triggers 已登记 · 告警疲劳清零）', async () => {
    const r = await runGraph(['yaml', 'compile', '--graph-id', '00_main', '--input', TECH_GRAPH_DIR, '--output', path.join(os.tmpdir(), 'f1-00_main.md')])
    assert.equal(r.status, 0, r.combined)
    assert.doesNotMatch(r.stderr, /\[warning\]/)
  })

  it('单源 grep 断言（验收 #6 · A3 口径）：src 内 flow/struct/external 字面量零残留（唯一真值源 = tech-graph-vocab.yaml）', () => {
    const hits: string[] = []
    const scan = (dir: string) => {
      for (const name of readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, name.name)
        if (name.isDirectory()) { scan(abs); continue }
        if (!name.name.endsWith('.ts')) continue
        for (const [i, line] of readFileSync(abs, 'utf8').split('\n').entries()) {
          if (/['"`](flow|struct|external)['"`]/.test(line)) hits.push(`${path.relative(KIT, abs)}#${i + 1}: ${line.trim()}`)
        }
      }
    }
    scan(path.join(KIT, 'src'))
    assert.deepEqual(hits, [], `src 内 flow/struct/external 硬拷贝残留（双份真值）:\n${hits.join('\n')}`)
  })

  it('TBox 单源：classes/relations 唯一真值源 = assets/ontology.yaml（src 零第二份 TBox 拷贝 · HGM 校验只读同一文件）', () => {
    // loadOntologyDocument 是 TBox 唯一读入口（--hgm 与 ontology check 共用 · 单源）
    const ontoSrc = readFileSync(path.join(KIT, 'src', 'cli-graph-ontology.ts'), 'utf8')
    assert.match(ontoSrc, /export function loadOntologyDocument/)
    const graphSrc = readFileSync(path.join(KIT, 'src', 'cli-graph.ts'), 'utf8')
    assert.ok(!graphSrc.includes('classes:'), 'cli-graph.ts 不得含 TBox 拷贝')
    // HGM 适配面读取 TBox 只经 loadOntologyDocument
    assert.match(graphSrc, /loadOntologyDocument\(file\)/)
  })
})
