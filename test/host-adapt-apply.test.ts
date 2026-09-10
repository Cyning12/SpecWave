import assert from 'node:assert/strict'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-host-apply-'))
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

type ApplyJson = {
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

describe('2.x W2 host apply', { concurrency: 1 }, () => {
  it('dry-run 零写入 + 报告含 kit-verify / CLAUDE.md / rules 计划路径', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['host', 'apply', '--tools', 'cursor,claude', '--profile', 'core', '--target', dir, '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.equal(parsed.mode, 'dry-run')
      assert.equal(parsed.ok, true)
      assert.equal(parsed.verdict, 'PASS')
      assert.deepEqual(parsed.written, [])
      const planned = parsed.planned.join('\n')
      assert.match(planned, /\.cursor\/commands\/kit-verify\.md/)
      assert.match(planned, /\.claude\/commands\/kit\/verify\.md/)
      assert.match(planned, /CLAUDE\.md/)
      assert.match(planned, /\.cursor\/rules\//)
      assert.deepEqual(listRelFiles(dir), [])
    })
  })

  it('--yes 在 tmp 仓写入 always_on + core commands；kit-verify.md 存在', async () => {
    await withTemp(async (dir) => {
      const r = runCli([
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
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.equal(parsed.mode, 'apply')
      assert.equal(parsed.ok, true)
      assert.equal(existsSync(path.join(dir, '.cursor', 'commands', 'kit-verify.md')), true)
      assert.equal(existsSync(path.join(dir, '.claude', 'commands', 'kit', 'verify.md')), true)
      assert.equal(existsSync(path.join(dir, '.claude', 'commands', 'kit-verify.md')), false)
      assert.equal(existsSync(path.join(dir, 'CLAUDE.md')), true)
      assert.equal(existsSync(path.join(dir, '.cursor', 'rules', '05-kit-starter.mdc')), true)
      assert.ok(parsed.written.includes('.cursor/commands/kit-verify.md'), JSON.stringify(parsed.written))
      assert.ok(
        parsed.written.includes('.claude/commands/kit/verify.md'),
        JSON.stringify(parsed.written),
      )
    })
  })

  it('S2 target_dir（docs/tasks）→ exit 2、零写入', async () => {
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
          '      always_on:',
          '        - target: .cursor/rules/05-kit-starter.mdc',
          '          source: assets/ide/adapters/cursor-harness-starter.mdc.example',
          '      skills: []',
          '      commands:',
          '        - target_dir: docs/tasks',
          '          from: assets/ide/commands/cursor/*',
          '          profile: core',
          '',
        ].join('\n'),
        'utf8',
      )
      const r = runCli(['host', 'apply', '--tools', 'cursor', '--yes', '--file', file, '--target', target])
      assert.equal(r.status, 2, r.combined)
      assert.deepEqual(listRelFiles(target), [])
    })
  })

  it('已有 CLAUDE.md 含 local 块：apply 后 local 正文仍在', async () => {
    await withTemp(async (dir) => {
      await writeFile(
        path.join(dir, 'CLAUDE.md'),
        [
          '# 我的仓',
          '',
          '<!-- cyning-harness-local:begin -->',
          'LOCAL_KEEP_ME',
          '<!-- cyning-harness-local:end -->',
          '',
        ].join('\n'),
        'utf8',
      )
      const r = runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--yes'])
      assert.equal(r.status, 0, r.combined)
      const body = (await import('node:fs/promises')).readFile(path.join(dir, 'CLAUDE.md'), 'utf8')
      const text = await body
      assert.match(text, /LOCAL_KEEP_ME/)
      assert.match(text, /cyning-harness-local:begin/)
      assert.match(text, /cyning-harness:begin/)
      assert.match(text, /# 我的仓/)
    })
  })

  it('--yes 与 --dry-run 同现 → exit 1', () => {
    const r = runCli(['host', 'apply', '--tools', 'cursor', '--yes', '--dry-run'])
    assert.equal(r.status, 1, r.combined)
  })

  it('缺 --tools → exit 1', () => {
    const r = runCli(['host', 'apply', '--profile', 'core'])
    assert.equal(r.status, 1, r.combined)
  })

  it('dsh 行 commands=[] 不得使 apply 失败', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['host', 'apply', '--tools', 'dsh', '--target', dir, '--yes', '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.equal(parsed.ok, true)
      assert.equal(parsed.verdict, 'PASS')
    })
  })
})
