import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const DEFAULT_EXAMPLE = path.join(KIT, 'assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')

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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-host-adapt-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

describe('2.x W1 host validate', { concurrency: 1 }, () => {
  it('合法示例表 → exit 0', () => {
    const r = runCli(['host', 'validate', '--file', DEFAULT_EXAMPLE])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /HOST VALIDATE:\s*PASS/i)
  })

  it('缺省读包内示例表 → exit 0', () => {
    const r = runCli(['host', 'validate'])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /HOST VALIDATE:\s*PASS/i)
  })

  it('缺文件 → exit 1', async () => {
    await withTemp(async (dir) => {
      const missing = path.join(dir, 'no-such-table.yaml')
      const r = runCli(['host', 'validate', '--file', missing])
      assert.equal(r.status, 1, r.combined)
    })
  })

  it('用法错误（未知子命令 / 未知参数）→ exit 1', () => {
    const unknownSub = runCli(['host', 'nope'])
    assert.equal(unknownSub.status, 1, unknownSub.combined)
    const unknownFlag = runCli(['host', 'validate', '--nope'])
    assert.equal(unknownFlag.status, 1, unknownFlag.combined)
    const bare = runCli(['host'])
    assert.equal(bare.status, 1, bare.combined)
  })

  it('schema 非法 → exit 2', async () => {
    await withTemp(async (dir) => {
      const bad = path.join(dir, 'invalid.yaml')
      await writeFile(
        bad,
        ['version: "1"', 'hosts:', '  - host_id: cursor', '    surfaces: {}', ''].join('\n'),
        'utf8',
      )
      const r = runCli(['host', 'validate', '--file', bad])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /HOST VALIDATE:\s*(FAIL|BLOCKED)|schema|非法/i)
    })
  })

  it('target 命中 S2（docs/tasks/...）→ exit 2', async () => {
    await withTemp(async (dir) => {
      const file = path.join(dir, 's2-target.yaml')
      await writeFile(
        file,
        [
          'version: "1"',
          'hosts:',
          '  - host_id: cursor',
          '    surfaces:',
          '      always_on:',
          '        - target: docs/tasks/evil.md',
          '          source: assets/ide/adapters/x.md',
          '      skills: []',
          '      commands: []',
          '',
        ].join('\n'),
        'utf8',
      )
      const r = runCli(['host', 'validate', '--file', file])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /S2|docs\/tasks/i)
    })
  })

  it('target_dir 命中 S2 → exit 2', async () => {
    await withTemp(async (dir) => {
      await mkdir(dir, { recursive: true })
      const file = path.join(dir, 's2-target-dir.yaml')
      await writeFile(
        file,
        [
          'version: "1"',
          'hosts:',
          '  - host_id: cursor',
          '    surfaces:',
          '      always_on: []',
          '      skills:',
          '        - target_dir: docs/tasks/skills',
          '          from: assets/skills/*',
          '      commands: []',
          '',
        ].join('\n'),
        'utf8',
      )
      const r = runCli(['host', 'validate', '--file', file])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /S2|docs\/tasks/i)
    })
  })

  it('--json 合法表 → exit 0 且含 verdict', () => {
    const r = runCli(['host', 'validate', '--json'])
    assert.equal(r.status, 0, r.combined)
    const parsed = JSON.parse(r.stdout) as { ok: boolean; verdict: string; command: string }
    assert.equal(parsed.ok, true)
    assert.equal(parsed.verdict, 'PASS')
    assert.match(parsed.command, /host validate/)
  })
})
