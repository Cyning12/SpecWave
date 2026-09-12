import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { CliError } from '../src/cli-shared.ts'
import {
  loadHostToolsSticky,
  parseHostToolsSticky,
  type HostToolsSticky,
} from '../src/cli-host.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const STICKY_REL = path.join('.coding-kit', 'host-tools.json')

type RunResult = {
  status: number | null
  stdout: string
  stderr: string
  combined: string
}

function runCli(args: string[], opts: { cwd?: string } = {}): RunResult {
  const env = { ...process.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  const result = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd: opts.cwd ?? KIT,
    env,
  })
  const stdout = result.stdout ?? ''
  const stderr = result.stderr ?? ''
  return {
    status: result.status,
    stdout,
    stderr,
    combined: `${stdout}\n${stderr}`,
  }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-host-sticky-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

function assertStickyShape(raw: string, expect: { host_ids: string[]; profile: string }): HostToolsSticky {
  const sticky = parseHostToolsSticky(raw)
  assert.equal(sticky.version, 1)
  assert.deepEqual(sticky.host_ids, expect.host_ids)
  assert.equal(sticky.profile, expect.profile)
  assert.equal(typeof sticky.updated_at, 'string')
  assert.ok(sticky.updated_at.length > 0)
  assert.equal(typeof sticky.kit_semver, 'string')
  assert.ok((sticky.kit_semver ?? '').length > 0)
  return sticky
}

describe('2.1.1 W1 host-tools sticky + --tools all', { concurrency: 1 }, () => {
  it('apply --yes 写入 .coding-kit/host-tools.json；dry-run 不写', async () => {
    await withTemp(async (dir) => {
      const dry = runCli([
        'host',
        'apply',
        '--tools',
        'cursor,claude',
        '--profile',
        'core',
        '--target',
        dir,
        '--json',
      ])
      assert.equal(dry.status, 0, dry.combined)
      assert.equal(existsSync(path.join(dir, STICKY_REL)), false)

      const yes = runCli([
        'host',
        'apply',
        '--tools',
        'cursor,claude',
        '--profile',
        'core',
        '--target',
        dir,
        '--yes',
        '--json',
      ])
      assert.equal(yes.status, 0, yes.combined)
      const stickyPath = path.join(dir, STICKY_REL)
      assert.equal(existsSync(stickyPath), true)
      const raw = await readFile(stickyPath, 'utf8')
      assertStickyShape(raw, { host_ids: ['cursor', 'claude'], profile: 'core' })
    })
  })

  it('update --yes 更新粘性；update dry-run 不写', async () => {
    await withTemp(async (dir) => {
      const apply = runCli([
        'host',
        'apply',
        '--tools',
        'cursor',
        '--profile',
        'core',
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(apply.status, 0, apply.combined)
      const before = await readFile(path.join(dir, STICKY_REL), 'utf8')
      assertStickyShape(before, { host_ids: ['cursor'], profile: 'core' })

      const dry = runCli([
        'host',
        'update',
        '--tools',
        'cursor,dsh',
        '--profile',
        'expanded',
        '--target',
        dir,
        '--json',
      ])
      assert.equal(dry.status, 0, dry.combined)
      assert.equal(await readFile(path.join(dir, STICKY_REL), 'utf8'), before)

      const upd = runCli([
        'host',
        'update',
        '--tools',
        'cursor,dsh',
        '--profile',
        'expanded',
        '--target',
        dir,
        '--yes',
        '--json',
      ])
      assert.equal(upd.status, 0, upd.combined)
      const after = await readFile(path.join(dir, STICKY_REL), 'utf8')
      assertStickyShape(after, { host_ids: ['cursor', 'dsh'], profile: 'expanded' })
      assert.notEqual(after, before)
    })
  })

  it('--tools all = 适配表全部 host_id（2.2 W6 后含 copilot,codex,windsurf）', async () => {
    await withTemp(async (dir) => {
      const r = runCli([
        'host',
        'apply',
        '--tools',
        'all',
        '--profile',
        'core',
        '--target',
        dir,
        '--yes',
        '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as { hosts: string[] }
      assert.deepEqual(parsed.hosts, [
        'dsh',
        'cursor',
        'claude',
        'agents',
        'copilot',
        'codex',
        'windsurf',
      ])
      const raw = await readFile(path.join(dir, STICKY_REL), 'utf8')
      assertStickyShape(raw, {
        host_ids: ['dsh', 'cursor', 'claude', 'agents', 'copilot', 'codex', 'windsurf'],
        profile: 'core',
      })
    })
  })

  it('粘性 JSON 损坏 → loadHostToolsSticky exit 2', async () => {
    await withTemp(async (dir) => {
      const stickyPath = path.join(dir, STICKY_REL)
      await mkdir(path.dirname(stickyPath), { recursive: true })
      await writeFile(stickyPath, '{not-json', 'utf8')
      assert.throws(
        () => loadHostToolsSticky(dir),
        (err: unknown) => {
          assert.ok(err instanceof CliError)
          assert.equal(err.exitCode, 2)
          assert.match(err.message, /损坏|重建/)
          return true
        },
      )
    })
  })

  it('粘性 schema 缺 host_ids → parse exit 2', () => {
    assert.throws(
      () => parseHostToolsSticky(JSON.stringify({ version: 1, profile: 'core', updated_at: 'x' })),
      (err: unknown) => {
        assert.ok(err instanceof CliError)
        assert.equal(err.exitCode, 2)
        return true
      },
    )
  })

  it('W2：有粘性时 update 无 --tools 用粘性 host_ids', async () => {
    await withTemp(async (dir) => {
      const apply = runCli([
        'host',
        'apply',
        '--tools',
        'cursor',
        '--profile',
        'core',
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(apply.status, 0, apply.combined)

      const upd = runCli(['host', 'update', '--target', dir, '--yes', '--json'])
      assert.equal(upd.status, 0, upd.combined)
      const parsed = JSON.parse(upd.stdout) as { hosts: string[] }
      assert.deepEqual(parsed.hosts, ['cursor'])
      const raw = await readFile(path.join(dir, STICKY_REL), 'utf8')
      assertStickyShape(raw, { host_ids: ['cursor'], profile: 'core' })
    })
  })
})
