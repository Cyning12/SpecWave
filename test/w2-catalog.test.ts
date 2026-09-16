import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { cp, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const USER_HOME_FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'user-home')
const ACME_TABLE = path.join(USER_HOME_FIXTURE, '.spec-wave', 'hosts', 'acme-hosts.yaml')

/**
 * 3.0 W2 阶段三 · B5 catalog（S3.6-4/5 · 验收 #11 · F-W2-09）。
 * catalog.yaml（~/.spec-wave/hosts/ · 可选）：sha256 呈现即强制（不符拒载点名 exit 2 ·
 * catalog list 呈现 mismatch 红 + FAIL）· 缺失照载标 integrity: none · 未登记标 uncataloged ·
 * catalog 自身坏/结构非法 exit 2。host catalog list --json 顶层键集钉死。
 */

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string }

function runCli(args: string[], opts: { home?: string } = {}): RunResult {
  const env = { ...process.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  if (opts.home) env.HOME = opts.home
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd: KIT,
    env,
  })
  const stdout = r.stdout ?? ''
  const stderr = r.stderr ?? ''
  return { status: r.status, stdout, stderr, combined: `${stdout}\n${stderr}` }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'w2-catalog-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

async function withAcmeHome(fn: (home: string) => Promise<void>): Promise<void> {
  await withTemp(async (home) => {
    await cp(path.join(USER_HOME_FIXTURE, '.spec-wave'), path.join(home, '.spec-wave'), { recursive: true })
    await fn(home)
  })
}

function acmeSha256(): string {
  return createHash('sha256').update(readFileSync(ACME_TABLE)).digest('hex')
}

function catalogYaml(sha256: string): string {
  return [
    'version: "1"',
    'tables:',
    '  - file: acme-hosts.yaml',
    '    source: fixture-local',
    '    version: "1.0.0"',
    `    sha256: "${sha256}"`,
    '',
  ].join('\n')
}

type CatalogJson = {
  command: string
  target: string
  catalog: { present: boolean; file?: string; version?: string }
  tables: {
    file: string
    origin: string
    hosts: number
    host_ids?: string[]
    source: string
    integrity: string
    status: string
    detail?: string
  }[]
  verdict: string
}

describe('3.0 W2 阶段三 · B5 catalog（验收 #11 · F-W2-09）', { concurrency: 1 }, () => {
  it('绿：sha256 符 → apply 照载 · catalog list exit 0 · --json 键集钉死 · 内置 13 origin builtin', async () => {
    await withAcmeHome(async (home) => {
      await writeFile(path.join(home, '.spec-wave', 'hosts', 'catalog.yaml'), catalogYaml(acmeSha256()))
      await withTemp(async (target) => {
        const apply = runCli(['host', 'apply', '--tools', 'acme-bot', '--target', target, '--yes'], { home })
        assert.equal(apply.status, 0, apply.combined)

        const r = runCli(['host', 'catalog', 'list', '--target', target, '--json'], { home })
        assert.equal(r.status, 0, r.combined)
        const obj = JSON.parse(r.stdout) as CatalogJson
        assert.deepEqual(Object.keys(obj).sort(), ['catalog', 'command', 'tables', 'target', 'verdict'])
        assert.equal(obj.command, 'host catalog list')
        assert.equal(obj.verdict, 'PASS')
        assert.deepEqual(obj.catalog, { present: true, file: 'catalog.yaml', version: '1' })
        assert.equal(obj.tables.length, 2)
        const [builtin, user] = obj.tables
        assert.equal(builtin!.origin, 'builtin')
        assert.equal(builtin!.hosts, 13)
        assert.equal(builtin!.integrity, 'ok')
        assert.equal(user!.origin, 'user')
        assert.equal(user!.integrity, 'ok')
        assert.equal(user!.source, 'fixture-local')
        assert.deepEqual(user!.host_ids, ['acme-bot'])
        assert.equal(user!.status, 'ok')
      })
    })
  })

  it('红（F-W2-09）：sha256 不符 → apply 拒载 exit 2 点名（声明值/实测值）· catalog list 呈现 mismatch + FAIL exit 2', async () => {
    await withAcmeHome(async (home) => {
      const badSha = '0'.repeat(64)
      await writeFile(path.join(home, '.spec-wave', 'hosts', 'catalog.yaml'), catalogYaml(badSha))
      await withTemp(async (target) => {
        const apply = runCli(['host', 'apply', '--tools', 'acme-bot', '--target', target, '--yes'], { home })
        assert.equal(apply.status, 2, apply.combined)
        assert.match(apply.combined, /F-W2-09/)
        assert.match(apply.combined, /acme-hosts\.yaml/)
        assert.match(apply.combined, new RegExp(badSha))
        assert.match(apply.combined, /实测/)

        const r = runCli(['host', 'catalog', 'list', '--target', target, '--json'], { home })
        assert.equal(r.status, 2, r.combined)
        const obj = JSON.parse(r.stdout) as CatalogJson
        assert.equal(obj.verdict, 'FAIL')
        assert.equal(obj.tables[1]!.integrity, 'mismatch')
        assert.match(obj.tables[1]!.detail ?? '', /sha256 不符/)
      })
    })
  })

  it('catalog 缺失 → 照载 integrity: none · list PASS', async () => {
    await withAcmeHome(async (home) => {
      await withTemp(async (target) => {
        const r = runCli(['host', 'catalog', 'list', '--target', target, '--json'], { home })
        assert.equal(r.status, 0, r.combined)
        const obj = JSON.parse(r.stdout) as CatalogJson
        assert.deepEqual(obj.catalog, { present: false })
        assert.equal(obj.tables[1]!.integrity, 'none')
        assert.equal(obj.verdict, 'PASS')
      })
    })
  })

  it('catalog 未登记该表 → 照载标 uncataloged · list PASS（不阻断）', async () => {
    await withAcmeHome(async (home) => {
      await writeFile(
        path.join(home, '.spec-wave', 'hosts', 'catalog.yaml'),
        'version: "1"\ntables: []\n',
      )
      await withTemp(async (target) => {
        const apply = runCli(['host', 'apply', '--tools', 'acme-bot', '--target', target, '--yes'], { home })
        assert.equal(apply.status, 0, apply.combined)
        const r = runCli(['host', 'catalog', 'list', '--target', target, '--json'], { home })
        assert.equal(r.status, 0, r.combined)
        const obj = JSON.parse(r.stdout) as CatalogJson
        assert.equal(obj.tables[1]!.integrity, 'uncataloged')
        assert.equal(obj.verdict, 'PASS')
      })
    })
  })

  it('catalog 自身坏（YAML 解析失败 / 结构非法缺 version）→ exit 2 点名（catalog fail-closed）', async () => {
    await withAcmeHome(async (home) => {
      const catAbs = path.join(home, '.spec-wave', 'hosts', 'catalog.yaml')
      await writeFile(catAbs, 'tables: [{{{\n')
      await withTemp(async (target) => {
        const r = runCli(['host', 'catalog', 'list', '--target', target], { home })
        assert.equal(r.status, 2, r.combined)
        assert.match(r.combined, /catalog\.yaml YAML 解析失败/)
      })
      await writeFile(catAbs, 'tables: []\n')
      await withTemp(async (target) => {
        const r = runCli(['host', 'catalog', 'list', '--target', target], { home })
        assert.equal(r.status, 2, r.combined)
        assert.match(r.combined, /catalog\.yaml 结构非法/)
        assert.match(r.combined, /version/)
      })
    })
  })
})
