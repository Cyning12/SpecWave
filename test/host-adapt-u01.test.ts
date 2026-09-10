import assert from 'node:assert/strict'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { apply } from '../src/index.ts'
import { sniffHostContract } from '../src/host-contract.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const PEER = '>=0.0.1-rc.1 <0.2.0'

type RunResult = {
  status: number | null
  stdout: string
  stderr: string
  combined: string
}

function runCli(
  args: string[],
  opts: { cwd?: string; env?: NodeJS.ProcessEnv } = {},
): RunResult {
  const env = { ...process.env, ...opts.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  if (opts.env && 'DSH_CK_DSH_TOOLS_VERSION' in opts.env) {
    const v = opts.env.DSH_CK_DSH_TOOLS_VERSION
    if (v !== undefined) env.DSH_CK_DSH_TOOLS_VERSION = v
  }
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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-host-u01-'))
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

type HostJson = {
  command: string
  ok: boolean
  verdict: string
  written: string[]
  contract?: { status: string; reasons: string[] }
}

type RegisteredTool = {
  name: string
  execute: (args: unknown, exec: unknown) => Promise<unknown>
}

function createFakeCtx() {
  const registered: RegisteredTool[] = []
  const ctx = {
    get() {
      return undefined
    },
    tools: {
      register(def: RegisteredTool) {
        registered.push(def)
        return () => {}
      },
    },
  }
  return { ctx, registered }
}

describe('2.x W4 DSH + U-01', { concurrency: 1 }, () => {
  it('纯函数：范围内 ok、超范围 / 表 version 非 1 degraded', () => {
    const inRc = sniffHostContract({
      tableVersion: '1',
      dshToolsVersion: '0.0.1-rc.1',
      peerRange: PEER,
    })
    assert.equal(inRc.status, 'ok')
    assert.deepEqual(inRc.reasons, [])

    const inMinor = sniffHostContract({
      tableVersion: '1',
      dshToolsVersion: '0.1.0',
      peerRange: PEER,
    })
    assert.equal(inMinor.status, 'ok')

    const cliOnly = sniffHostContract({
      tableVersion: '1',
      dshToolsVersion: undefined,
      peerRange: PEER,
    })
    assert.equal(cliOnly.status, 'ok')

    const cliOnlyEmpty = sniffHostContract({
      tableVersion: '1',
      dshToolsVersion: '',
      peerRange: PEER,
    })
    assert.equal(cliOnlyEmpty.status, 'ok')

    const over = sniffHostContract({
      tableVersion: '1',
      dshToolsVersion: '9.0.0',
      peerRange: PEER,
    })
    assert.equal(over.status, 'degraded')
    assert.ok(over.reasons.length > 0)

    const badTable = sniffHostContract({
      tableVersion: '99',
      dshToolsVersion: undefined,
      peerRange: PEER,
    })
    assert.equal(badTable.status, 'degraded')
  })

  it('--tools dsh --yes：exit 0；无 .cursor/commands；可有 .dsh/skills', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['host', 'apply', '--tools', 'dsh', '--target', dir, '--yes', '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as HostJson
      assert.equal(parsed.ok, true)
      assert.equal(parsed.contract?.status, 'ok')
      const files = listRelFiles(dir)
      assert.equal(
        files.some((f) => f === '.cursor/commands' || f.startsWith('.cursor/commands/')),
        false,
        JSON.stringify(files),
      )
      assert.equal(
        files.some((f) => /(^|\/)kit-/.test(path.basename(f))),
        false,
        JSON.stringify(files),
      )
      assert.equal(existsSync(path.join(dir, '.cursor', 'commands')), false)
      if (existsSync(path.join(dir, '.dsh', 'skills'))) {
        assert.ok(files.some((f) => f.startsWith('.dsh/skills/')))
      }
    })
  })

  it('表 version=99：apply → exit 2、零写入；--json 含 contract.status=degraded', async () => {
    await withTemp(async (dir) => {
      const target = path.join(dir, 'repo')
      await mkdir(target)
      const file = path.join(dir, 'v99.yaml')
      await writeFile(
        file,
        [
          'version: "99"',
          'hosts:',
          '  - host_id: dsh',
          '    surfaces:',
          '      always_on: []',
          '      skills:',
          '        - target_dir: .dsh/skills',
          '          from: assets/skills/*',
          '      commands: []',
          '',
        ].join('\n'),
        'utf8',
      )
      const r = runCli([
        'host',
        'apply',
        '--tools',
        'dsh',
        '--yes',
        '--file',
        file,
        '--target',
        target,
        '--json',
      ])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /U-01/)
      const parsed = JSON.parse(r.stdout) as HostJson
      assert.equal(parsed.contract?.status, 'degraded')
      assert.deepEqual(listRelFiles(target), [])
    })
  })

  it('DSH_CK_DSH_TOOLS_VERSION=9.0.0：apply → exit 2、零写入', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['host', 'apply', '--tools', 'dsh', '--target', dir, '--yes', '--json'], {
        env: { ...process.env, DSH_CK_DSH_TOOLS_VERSION: '9.0.0' },
      })
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /U-01/)
      const parsed = JSON.parse(r.stdout) as HostJson
      assert.equal(parsed.contract?.status, 'degraded')
      assert.deepEqual(listRelFiles(dir), [])
    })
  })

  it('host update 在 U-01 degraded 时 exit 2、零写入', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['host', 'update', '--tools', 'dsh', '--target', dir, '--yes', '--json'], {
        env: { ...process.env, DSH_CK_DSH_TOOLS_VERSION: '9.0.0' },
      })
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /U-01/)
      const parsed = JSON.parse(r.stdout) as HostJson
      assert.equal(parsed.contract?.status, 'degraded')
      assert.deepEqual(listRelFiles(dir), [])
    })
  })

  it('init_coding_kit 在 degraded 下拒绝复制（copied=0）', async () => {
    const prev = process.env.DSH_CK_DSH_TOOLS_VERSION
    process.env.DSH_CK_DSH_TOOLS_VERSION = '9.0.0'
    const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-u01-plugin-'))
    const prevCwd = process.cwd()
    try {
      process.chdir(dir)
      const fake = createFakeCtx()
      apply(fake.ctx as never)
      const tool = fake.registered.find((t) => t.name === 'init_coding_kit')
      assert.ok(tool)
      const out = String(await tool.execute({}, { signal: new AbortController().signal }))
      assert.match(out, /U-01/)
      assert.match(out, /degraded/i)
      assert.equal(existsSync(path.join(dir, '.coding-kit')), false)
      assert.equal(existsSync(path.join(dir, '.dsh', 'coding-kit')), false)
      assert.deepEqual(listRelFiles(dir), [])
    } finally {
      process.chdir(prevCwd)
      if (prev === undefined) delete process.env.DSH_CK_DSH_TOOLS_VERSION
      else process.env.DSH_CK_DSH_TOOLS_VERSION = prev
      await rm(dir, { recursive: true, force: true })
    }
  })
})
