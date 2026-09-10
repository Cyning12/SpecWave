/**
 * 2.1 W4 · profile=expanded
 * core：无 kit-hat-*；expanded：有五条 hat + graph/sync；update conflict/--force 同 2.0
 * 禁 kit-30 / kit-publish；仍跳过 30/40 skills
 */
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

const HAT_STEMS = [
  'hat-00-delegate',
  'hat-10-spec',
  'hat-10-task',
  'hat-20-spec-audit',
  'hat-20-task-audit',
] as const

const EXTRA_STEMS = ['graph-check', 'sync-prompts-guide'] as const

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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w4-expanded-'))
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
  mode: string
  ok: boolean
  verdict: string
  planned: string[]
  written: string[]
  conflict: string[]
  skipped: string[]
}

describe('2.1 W4 profile=expanded（kit-hat-*）', { concurrency: 1 }, () => {
  it('资产：Cursor 扁平 kit-hat-* + Claude kit/hat-*；无 kit-30/kit-publish', () => {
    for (const stem of HAT_STEMS) {
      const cursor = path.join(KIT, 'assets', 'ide', 'commands', 'cursor', `kit-${stem}.md`)
      const claude = path.join(KIT, 'assets', 'ide', 'commands', 'claude', 'kit', `${stem}.md`)
      assert.equal(existsSync(cursor), true, `缺 Cursor ${cursor}`)
      assert.equal(existsSync(claude), true, `缺 Claude ${claude}`)
      const body = readFileSync(cursor, 'utf8')
      assert.match(body, new RegExp(`^name:\\s*"/kit-${stem}"`, 'm'))
      assert.match(body, new RegExp(`^kit_command_id:\\s*kit-${stem}\\s*$`, 'm'))
      assert.match(body, /harness-|POINTER|勿贴/)
    }
    for (const stem of EXTRA_STEMS) {
      assert.equal(
        existsSync(path.join(KIT, 'assets', 'ide', 'commands', 'cursor', `kit-${stem}.md`)),
        true,
      )
      assert.equal(
        existsSync(path.join(KIT, 'assets', 'ide', 'commands', 'claude', 'kit', `${stem}.md`)),
        true,
      )
    }
    const forbidden = ['kit-30.md', 'kit-publish.md', '30.md', 'publish.md']
    for (const name of forbidden) {
      assert.equal(existsSync(path.join(KIT, 'assets', 'ide', 'commands', 'cursor', name)), false)
      assert.equal(
        existsSync(path.join(KIT, 'assets', 'ide', 'commands', 'claude', 'kit', name)),
        false,
      )
    }
  })

  it('mvp-hosts.yaml 含 profile: expanded 条目', async () => {
    const yaml = await readFile(
      path.join(KIT, 'assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml'),
      'utf8',
    )
    assert.match(yaml, /profile:\s*expanded/)
    assert.match(yaml, /profile:\s*core/)
  })

  it('apply --profile core：无 kit-hat-* / graph-check / sync-prompts-guide', async () => {
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
      const files = listRelFiles(dir)
      const hats = files.filter(
        (f) =>
          /kit-hat-0|kit-hat-1|kit-hat-2|\/hat-0|\/hat-1|\/hat-2/.test(f) ||
          f.includes('graph-check') ||
          f.includes('sync-prompts-guide'),
      )
      assert.deepEqual(hats, [], JSON.stringify(hats))
      assert.equal(existsSync(path.join(dir, '.cursor', 'commands', 'kit-verify.md')), true)
      assert.equal(existsSync(path.join(dir, '.claude', 'commands', 'kit', 'verify.md')), true)
      assert.equal(existsSync(path.join(dir, '.cursor', 'commands', 'kit-hat-00-delegate.md')), false)
      assert.equal(
        existsSync(path.join(dir, '.claude', 'commands', 'kit', 'hat-00-delegate.md')),
        false,
      )
      assert.equal(
        files.some((f) => f.includes('harness-30-execute') || f.includes('harness-40-self-check')),
        false,
      )
    })
  })

  it('apply --profile expanded：写出 hat 五条 + graph/sync；仍无 30/40 skills', async () => {
    await withTemp(async (dir) => {
      const r = runCli([
        'host',
        'apply',
        '--tools',
        'cursor,claude',
        '--profile',
        'expanded',
        '--target',
        dir,
        '--yes',
        '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as HostJson
      assert.equal(parsed.ok, true)

      for (const stem of HAT_STEMS) {
        assert.equal(
          existsSync(path.join(dir, '.cursor', 'commands', `kit-${stem}.md`)),
          true,
          `缺 Cursor kit-${stem}.md`,
        )
        assert.equal(
          existsSync(path.join(dir, '.claude', 'commands', 'kit', `${stem}.md`)),
          true,
          `缺 Claude kit/${stem}.md`,
        )
      }
      assert.equal(existsSync(path.join(dir, '.cursor', 'commands', 'kit-graph-check.md')), true)
      assert.equal(
        existsSync(path.join(dir, '.cursor', 'commands', 'kit-sync-prompts-guide.md')),
        true,
      )
      assert.equal(existsSync(path.join(dir, '.claude', 'commands', 'kit', 'graph-check.md')), true)
      assert.equal(
        existsSync(path.join(dir, '.claude', 'commands', 'kit', 'sync-prompts-guide.md')),
        true,
      )
      // expanded ⊇ core
      assert.equal(existsSync(path.join(dir, '.cursor', 'commands', 'kit-verify.md')), true)
      assert.equal(existsSync(path.join(dir, '.claude', 'commands', 'kit', 'verify.md')), true)

      const files = listRelFiles(dir)
      assert.equal(files.some((f) => f.includes('harness-30-execute')), false)
      assert.equal(files.some((f) => f.includes('harness-40-self-check')), false)
      assert.equal(files.some((f) => /kit-30|kit-publish/.test(f)), false)
    })
  })

  it('update expanded：conflict 默认不覆盖；--force 覆盖', async () => {
    await withTemp(async (dir) => {
      const cmdDir = path.join(dir, '.cursor', 'commands')
      await mkdir(cmdDir, { recursive: true })
      const dest = path.join(cmdDir, 'kit-hat-00-delegate.md')
      await writeFile(dest, 'OLD_HAT_BODY\n', 'utf8')

      const noForce = runCli([
        'host',
        'update',
        '--tools',
        'cursor',
        '--profile',
        'expanded',
        '--target',
        dir,
        '--yes',
        '--json',
      ])
      assert.equal(noForce.status, 0, noForce.combined)
      const parsed = JSON.parse(noForce.stdout) as HostJson
      assert.ok(
        parsed.conflict.some((p) => p.includes('.cursor/commands/kit-hat-00-delegate.md')),
        JSON.stringify(parsed.conflict),
      )
      assert.equal(await readFile(dest, 'utf8'), 'OLD_HAT_BODY\n')

      const withForce = runCli([
        'host',
        'update',
        '--tools',
        'cursor',
        '--profile',
        'expanded',
        '--target',
        dir,
        '--yes',
        '--force',
        '--json',
      ])
      assert.equal(withForce.status, 0, withForce.combined)
      const forced = JSON.parse(withForce.stdout) as HostJson
      assert.equal(
        forced.conflict.some((p) => p.includes('.cursor/commands/kit-hat-00-delegate.md')),
        false,
      )
      const next = await readFile(dest, 'utf8')
      assert.notEqual(next, 'OLD_HAT_BODY\n')
      assert.match(next, /harness-00-delegate-only|kit-hat-00-delegate/)
    })
  })

  it('非法 profile → exit 1', () => {
    const r = runCli(['host', 'apply', '--tools', 'cursor', '--profile', 'custom'])
    assert.equal(r.status, 1, r.combined)
    assert.match(r.combined, /core\|expanded/)
  })
})
