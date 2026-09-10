import assert from 'node:assert/strict'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-host-update-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

function listRelFiles(root: string): string[] {
  if (!existsSync(root)) return []
  const out: string[] = []
  const walk = (dir: string): void => {
    for (const name of readdirSync(dir)) {
      const abs = path.join(dir, name)
      if (statSync(abs).isDirectory()) walk(abs)
      else out.push(path.relative(root, abs).split(path.sep).join('/'))
    }
  }
  walk(root)
  return out.sort()
}

type UpdateJson = {
  command: string
  mode: string
  hosts: string[]
  planned: string[]
  written: string[]
  skipped: string[]
  conflict: string[]
  backup: string | null
  ok: boolean
  verdict: string
}

describe('2.x W3 host update', { concurrency: 1 }, () => {
  it('dry-run 报告含 skills 计划路径且零写入', async () => {
    await withTemp(async (dir) => {
      const r = runCli([
        'host',
        'update',
        '--tools',
        'cursor',
        '--profile',
        'core',
        '--target',
        dir,
        '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as UpdateJson
      assert.equal(parsed.command, 'host update')
      assert.equal(parsed.mode, 'dry-run')
      assert.equal(parsed.ok, true)
      assert.deepEqual(parsed.written, [])
      const planned = parsed.planned.join('\n')
      assert.match(planned, /\.cursor\/skills\/harness-10-spec/)
      assert.deepEqual(listRelFiles(dir), [])
    })
  })

  it('--yes 写入 skills 目录；不出现 harness-30-execute / harness-40-self-check', async () => {
    await withTemp(async (dir) => {
      const r = runCli([
        'host',
        'update',
        '--tools',
        'cursor',
        '--profile',
        'core',
        '--target',
        dir,
        '--yes',
        '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as UpdateJson
      assert.equal(parsed.mode, 'update')
      assert.equal(parsed.ok, true)
      const files = listRelFiles(dir)
      assert.ok(
        files.some((f) => f.includes('.cursor/skills/harness-10-spec')),
        JSON.stringify(files),
      )
      assert.equal(
        files.some((f) => f.includes('harness-30-execute')),
        false,
        JSON.stringify(files),
      )
      assert.equal(
        files.some((f) => f.includes('harness-40-self-check')),
        false,
        JSON.stringify(files),
      )
      const joined = [...parsed.planned, ...parsed.written, ...files].join('\n')
      assert.doesNotMatch(joined, /harness-30-execute/)
      assert.doesNotMatch(joined, /harness-40-self-check/)
    })
  })

  it('已存在且内容不同的 command：无 --force 不覆盖；--force --yes 覆盖', async () => {
    await withTemp(async (dir) => {
      const cmdDir = path.join(dir, '.cursor', 'commands')
      await mkdir(cmdDir, { recursive: true })
      const dest = path.join(cmdDir, 'kit-verify.md')
      await writeFile(dest, 'OLD_COMMAND_BODY\n', 'utf8')
      const noForce = runCli([
        'host',
        'update',
        '--tools',
        'cursor',
        '--target',
        dir,
        '--yes',
        '--json',
      ])
      assert.equal(noForce.status, 0, noForce.combined)
      const parsed = JSON.parse(noForce.stdout) as UpdateJson
      assert.ok(
        parsed.conflict.some((p) => p.includes('.cursor/commands/kit-verify.md')),
        JSON.stringify(parsed.conflict),
      )
      assert.equal(await readFile(dest, 'utf8'), 'OLD_COMMAND_BODY\n')

      const withForce = runCli([
        'host',
        'update',
        '--tools',
        'cursor',
        '--target',
        dir,
        '--yes',
        '--force',
        '--json',
      ])
      assert.equal(withForce.status, 0, withForce.combined)
      const forced = JSON.parse(withForce.stdout) as UpdateJson
      assert.equal(
        forced.conflict.some((p) => p.includes('.cursor/commands/kit-verify.md')),
        false,
      )
      const next = await readFile(dest, 'utf8')
      assert.notEqual(next, 'OLD_COMMAND_BODY\n')
      assert.match(next, /kit-verify|verify/i)
    })
  })

  it('S2 target_dir → exit 2、零写入', async () => {
    await withTemp(async (dir) => {
      const target = path.join(dir, 'repo')
      await mkdir(target)
      const file = path.join(dir, 's2.yaml')
      await writeFile(
        file,
        [
          'version: "1"',
          'hosts:',
          '  - host_id: cursor',
          '    surfaces:',
          '      always_on: []',
          '      skills:',
          '        - target_dir: docs/tasks',
          '          from: assets/skills/*',
          '      commands: []',
          '',
        ].join('\n'),
        'utf8',
      )
      const r = runCli(['host', 'update', '--tools', 'cursor', '--yes', '--file', file, '--target', target])
      assert.equal(r.status, 2, r.combined)
      assert.deepEqual(listRelFiles(target), [])
    })
  })

  it('--yes 与 --dry-run 同现 → exit 1', () => {
    const r = runCli(['host', 'update', '--yes', '--dry-run'])
    assert.equal(r.status, 1, r.combined)
  })
})

describe('2.1.1 W2 host update 缺省 = 方案 A', { concurrency: 1 }, () => {
  it('无粘性 + 无 --tools → exit 1 + 提示 apply/init 或 --tools', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['host', 'update', '--target', dir, '--json'])
      assert.equal(r.status, 1, r.combined)
      assert.match(r.combined, /无粘性|未传 --tools/)
      assert.match(r.combined, /apply|init/)
      assert.match(r.combined, /--tools/)
      assert.deepEqual(listRelFiles(dir), [])
    })
  })

  it('有粘性：host update --yes（无 --tools）只刷粘性 host_ids', async () => {
    await withTemp(async (dir) => {
      const stickyDir = path.join(dir, '.coding-kit')
      await mkdir(stickyDir, { recursive: true })
      await writeFile(
        path.join(stickyDir, 'host-tools.json'),
        `${JSON.stringify(
          {
            version: 1,
            host_ids: ['cursor'],
            profile: 'core',
            updated_at: '2026-09-10T00:00:00.000Z',
            kit_semver: '2.1.0',
          },
          null,
          2,
        )}\n`,
        'utf8',
      )
      const r = runCli(['host', 'update', '--target', dir, '--yes', '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as UpdateJson
      assert.deepEqual(parsed.hosts, ['cursor'])
      assert.equal(
        parsed.hosts.includes('claude') || parsed.hosts.includes('dsh') || parsed.hosts.includes('agents'),
        false,
      )
      const files = listRelFiles(dir)
      assert.ok(files.some((f) => f.includes('.cursor/')), JSON.stringify(files))
      assert.equal(files.some((f) => f.includes('.claude/')), false, JSON.stringify(files))
      assert.equal(files.some((f) => f.includes('.dsh/')), false, JSON.stringify(files))
    })
  })

  it('显式 --tools 优先于粘性', async () => {
    await withTemp(async (dir) => {
      const stickyDir = path.join(dir, '.coding-kit')
      await mkdir(stickyDir, { recursive: true })
      await writeFile(
        path.join(stickyDir, 'host-tools.json'),
        `${JSON.stringify(
          {
            version: 1,
            host_ids: ['cursor'],
            profile: 'core',
            updated_at: '2026-09-10T00:00:00.000Z',
          },
          null,
          2,
        )}\n`,
        'utf8',
      )
      const r = runCli([
        'host',
        'update',
        '--tools',
        'claude',
        '--target',
        dir,
        '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as UpdateJson
      assert.deepEqual(parsed.hosts, ['claude'])
    })
  })

  it('显式 --tools all 仍可用（无视粘性子集）', async () => {
    await withTemp(async (dir) => {
      const stickyDir = path.join(dir, '.coding-kit')
      await mkdir(stickyDir, { recursive: true })
      await writeFile(
        path.join(stickyDir, 'host-tools.json'),
        `${JSON.stringify(
          {
            version: 1,
            host_ids: ['cursor'],
            profile: 'core',
            updated_at: '2026-09-10T00:00:00.000Z',
          },
          null,
          2,
        )}\n`,
        'utf8',
      )
      const r = runCli([
        'host',
        'update',
        '--tools',
        'all',
        '--target',
        dir,
        '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as UpdateJson
      assert.deepEqual(parsed.hosts, ['dsh', 'cursor', 'claude', 'agents'])
    })
  })
})
