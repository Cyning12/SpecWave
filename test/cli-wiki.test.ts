import assert from 'node:assert/strict'
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { makeCore } from './_helpers/core-harness.ts'
import { cmdWiki } from '../src/cli-wiki.ts'

// 3.0 W7 · S7.1 F3 wiki 能力补全 fixture（验收 #11）：
// 双向 backlinks 对偶 · 增量=全量等价（逐字）· 冲突检测 red/green（默认 exit 0 / --check-conflicts exit 2）。
// 红测先行锚点：修复前无 backlinks / conflicts / --incremental 键与选项 ⇒ 本文件真红。
const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FIXTURE = path.join(KIT, 'test', 'fixtures', 'wiki')
const runWiki = makeCore(cmdWiki)

type WikiDoc = {
  nodes: Array<{ id: string; path: string; title: string }>
  edges: Array<{ source: string; target: string; kind: string }>
  backlinks?: Array<{ id: string; from: Array<{ source: string; kind: string }> }>
  warnings: string[]
  conflicts?: Array<Record<string, unknown> & { kind: string }>
}

function json(r: { stdout: string }): WikiDoc {
  return JSON.parse(r.stdout) as WikiDoc
}

async function withWiki(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-wiki-'))
  try {
    cpSync(FIXTURE, path.join(dir, 'docs', 'coding_wiki'), { recursive: true })
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

function edgeKey(source: string, target: string, kind: string): string {
  return `${source}|${target}|${kind}`
}

/** 增量 = 全量（硬判据）：nodes+edges+backlinks+warnings+conflicts 逐字一致。 */
function assertGraphEqual(inc: WikiDoc, full: WikiDoc, label: string): void {
  for (const key of ['nodes', 'edges', 'backlinks', 'warnings', 'conflicts'] as const) {
    assert.deepEqual(inc[key], full[key], `${label}: ${key} 增量与全量须逐字一致`)
  }
}

describe('3.0-W7 S7.1 F3 · wiki backlinks/增量/冲突（验收 #11）', { concurrency: 1 }, () => {
  it('a) backlinks 双向对偶：每条 edge 的 target 反向收录 source，且每条 backlink 必有对应 edge', async () => {
    await withWiki(async (dir) => {
      const r = await runWiki(['export', '--json', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      const g = json(r)
      assert.ok(Array.isArray(g.backlinks), 'wiki export 输出须含 backlinks 键（键只增）')
      const fromMap = new Map(g.backlinks!.map((b) => [b.id, b.from]))
      for (const e of g.edges) {
        const froms = fromMap.get(e.target) ?? []
        assert.ok(
          froms.some((f) => f.source === e.source && f.kind === e.kind),
          `edge ${e.source} -> ${e.target}（${e.kind}）须在 target backlinks 中`,
        )
      }
      const edgeSet = new Set(g.edges.map((e) => edgeKey(e.source, e.target, e.kind)))
      for (const b of g.backlinks!) {
        for (const f of b.from) {
          assert.ok(
            edgeSet.has(edgeKey(f.source, b.id, f.kind)),
            `backlink ${f.source} -> ${b.id}（${f.kind}）须有对应 edge（反向对偶）`,
          )
        }
      }
      // fixture 最小语料点名：a ⇄ b 双向
      const idA = g.nodes.find((n) => n.path.endsWith('/a.md'))!.id
      const idB = g.nodes.find((n) => n.path.endsWith('/b.md'))!.id
      assert.ok(fromMap.get(idB)!.some((f) => f.source === idA), 'b 的 backlinks 须含 a')
      assert.ok(fromMap.get(idA)!.some((f) => f.source === idB), 'a 的 backlinks 须含 b')
    })
  })

  it('b) --incremental 等价全量：同语料与「全量→改一文件→增量」两次均逐字一致', async () => {
    await withWiki(async (dir) => {
      const full1 = json(await runWiki(['export', '--json', '--target', dir]))
      const inc1 = await runWiki(['export', '--json', '--target', dir, '--incremental'])
      assert.equal(inc1.status, 0, inc1.combined)
      assert.equal(
        existsSync(path.join(dir, '.coding-kit', 'wiki-cache.json')),
        true,
        '--incremental 须落缓存件 <target>/.coding-kit/wiki-cache.json',
      )
      assertGraphEqual(json(inc1), full1, '首次增量=全量')

      // 改一文件（d.md 悬空 → 实链）
      writeFileSync(
        path.join(dir, 'docs', 'coding_wiki', 'd.md'),
        '# Delta\n\nNow links [[a]].\n',
        'utf8',
      )
      const full2 = json(await runWiki(['export', '--json', '--target', dir]))
      const inc2 = await runWiki(['export', '--json', '--target', dir, '--incremental'])
      assert.equal(inc2.status, 0, inc2.combined)
      assertGraphEqual(json(inc2), full2, '改一文件后增量=全量')
    })
  })

  it('c) 冲突检测：默认 export exit 0 + 结构化 conflicts；--check-conflicts 命中 exit 2 点名', async () => {
    await withWiki(async (dir) => {
      const def = await runWiki(['export', '--json', '--target', dir])
      assert.equal(def.status, 0, def.combined)
      const g = json(def)
      assert.ok(Array.isArray(g.conflicts), '输出须含结构化 conflicts 键')
      const kinds = g.conflicts!.map((c) => c.kind)
      assert.ok(kinds.includes('same_stem'), `同名 stem 冲突须检出: ${JSON.stringify(kinds)}`)
      assert.ok(kinds.includes('duplicate_title'), '重复 title 冲突须检出')
      assert.ok(
        g.conflicts!.some((c) => c.kind === 'dangling_link' && c.link === 'missing'),
        '悬空 [[missing]] 须结构化检出',
      )
      assert.ok(g.warnings.length > 0, '既有 warnings 语义保持（键只增）')

      const chk = await runWiki(['export', '--json', '--target', dir, '--check-conflicts'])
      assert.equal(chk.status, 2, chk.combined)
      assert.match(chk.combined, /conflict/, '--check-conflicts 须点名冲突')
      assert.match(chk.combined, /same_stem|dangling/, '点名须含冲突类别/条目')
    })
  })

  it('d) 无冲突语料：--check-conflicts exit 0；--no-backlinks 省略键（键只增语义）', async () => {
    await withWiki(async (dir) => {
      const wikiDir = path.join(dir, 'docs', 'coding_wiki')
      writeFileSync(path.join(wikiDir, 'd.md'), '# Delta\n\nClean page.\n', 'utf8')
      // 消除同名 stem（nested/c.md）：留最小无冲突语料
      rmSync(path.join(wikiDir, 'nested', 'c.md'), { force: true })
      const ok = await runWiki(['export', '--json', '--target', dir, '--check-conflicts'])
      assert.equal(ok.status, 0, ok.combined)
      const withBl = json(ok)
      assert.ok(Array.isArray(withBl.backlinks), '默认 backlinks 开')
      const noBl = await runWiki(['export', '--json', '--target', dir, '--no-backlinks'])
      assert.equal(noBl.status, 0, noBl.combined)
      assert.equal(Object.hasOwn(json(noBl), 'backlinks'), false, '--no-backlinks 须省略键')
      assert.ok(Array.isArray(json(noBl).conflicts), 'conflicts 与 backlinks 开关解耦')
    })
  })
})
