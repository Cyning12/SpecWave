import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { planApply } from '../src/host/materialize.ts'
import { validateHostAdaptDocDispatch } from '../src/host/schema.ts'
import { asHostRows } from '../src/host/table.ts'
import { yamlLoad } from '../src/yaml.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'mvp-hosts_2_4_2.yaml')
const SNAPSHOT = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'planned-writes-2_4_2.json')

// 2.4.2 版 mvp-hosts.yaml 逐字拷贝的内容锁（2026-09-16 与 git tag v2.4.2:assets/ide/host-adapt/examples/mvp-hosts.yaml diff 为空实测）
const FIXTURE_SHA256 = 'b80f9a15e7da9051689b957daf737b4799f4a2392d6a9130dcaee770f2203894'

type RunResult = { status: number | null; combined: string }

function runCli(args: string[]): RunResult {
  const env = { ...process.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd: KIT,
    env,
  })
  return { status: r.status, combined: `${r.stdout ?? ''}\n${r.stderr ?? ''}` }
}

type SnapshotItem = {
  hostId: string
  kind: string
  destRel: string
  sourceRel: string
  op: string
  sha256: string
}
type SnapshotProfile = { items: SnapshotItem[]; s2: string[] }
type Snapshot = {
  source_fixture: string
  source_sha256: string
  toolIds: string[]
  profiles: { core: SnapshotProfile; expanded: SnapshotProfile }
}

function plannedProfile(rows: ReturnType<typeof asHostRows>, profile: string): SnapshotProfile {
  const target = mkdtempSync(path.join(os.tmpdir(), 'w1-compat-lock-'))
  try {
    const { items, s2 } = planApply({
      target,
      rows,
      toolIds: rows.map((r) => r.host_id),
      profile,
      pkgRoot: KIT,
    })
    return {
      items: items.map((i) => ({
        hostId: i.hostId,
        kind: i.kind,
        destRel: i.destRel,
        sourceRel: i.sourceRel,
        op: i.op,
        sha256: createHash('sha256').update(i.nextText).digest('hex'),
      })),
      s2,
    }
  } finally {
    rmSync(target, { recursive: true, force: true })
  }
}

describe('3.0 W1 验收 #1 · compat 回归锁（2.4.2 表零改动通过 + planned writes 逐字一致 · 评审文 §3.3）', { concurrency: 1 }, () => {
  it('fixture 内容锁：sha256 与 2.4.2 逐字拷贝基线一致（防 fixture 被漂移）', () => {
    const sha = createHash('sha256').update(readFileSync(FIXTURE)).digest('hex')
    assert.equal(sha, FIXTURE_SHA256)
  })

  it('fixture 为 v1 形态（无 schema_version 键）· 探测分派零 issue', () => {
    const doc = yamlLoad(readFileSync(FIXTURE, 'utf8')) as Record<string, unknown>
    assert.ok(!('schema_version' in doc))
    assert.deepEqual(validateHostAdaptDocDispatch(doc), [])
  })

  it('新版 host validate 零改动通过（exit 0 · PASS）', () => {
    const r = runCli(['host', 'validate', '--file', FIXTURE])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /HOST VALIDATE:\s*PASS/i)
  })

  it('新版 host apply --dry-run 零改动通过（core + expanded · exit 0 · planned 非空）', () => {
    for (const profile of ['core', 'expanded']) {
      const target = mkdtempSync(path.join(os.tmpdir(), 'w1-compat-apply-'))
      try {
        const r = runCli([
          'host', 'apply', '--tools', 'all', '--profile', profile, '--dry-run',
          '--file', FIXTURE, '--target', target,
        ])
        assert.equal(r.status, 0, `${profile}: ${r.combined}`)
        assert.match(r.combined, /planned|计划|write/i)
      } finally {
        rmSync(target, { recursive: true, force: true })
      }
    }
  })

  it('planned writes 与 2.4.2 基线快照逐字一致（core + expanded · 防映射漂移）', () => {
    const snap = JSON.parse(readFileSync(SNAPSHOT, 'utf8')) as Snapshot
    assert.equal(snap.source_sha256, FIXTURE_SHA256) // 快照自洽：钉的就是本 fixture
    const rows = asHostRows(yamlLoad(readFileSync(FIXTURE, 'utf8')))
    assert.deepEqual(rows.map((r) => r.host_id), snap.toolIds)
    for (const profile of ['core', 'expanded'] as const) {
      const actual = plannedProfile(rows, profile)
      assert.deepEqual(actual, snap.profiles[profile], `profile=${profile} planned writes 漂移`)
    }
  })
})
