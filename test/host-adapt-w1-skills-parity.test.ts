/**
 * 2.1 W1 · Skills 多宿主 parity
 * host apply --tools cursor,claude,dsh --profile core --yes
 * → 三方 skills 根含六条 harness；默认不物化 30/40
 */
import assert from 'node:assert/strict'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

/** freeze：六条默认 harness skills（跳过 30/40） */
const CORE_HARNESS_SKILLS = [
  'harness-00-delegate-only',
  'harness-10-spec',
  'harness-10-task',
  'harness-20-spec-audit',
  'harness-20-task-audit',
  'harness-hat-reanchor',
] as const

const SKILL_ROOTS = ['.cursor/skills', '.claude/skills', '.dsh/skills'] as const

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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w1-skills-'))
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

function skillPresent(root: string, skillRoot: string, name: string): boolean {
  const dir = path.join(root, skillRoot, name)
  const skillMd = path.join(dir, 'SKILL.md')
  const flat = path.join(root, skillRoot, `${name}.md`)
  return (existsSync(dir) && existsSync(skillMd)) || existsSync(flat)
}

type ApplyJson = {
  command: string
  mode: string
  ok: boolean
  verdict: string
  written: string[]
}

describe('2.1 W1 skills parity（三方 harness 六条）', { concurrency: 1 }, () => {
  it('apply cursor,claude,dsh --profile core --yes：三方含六条；无 30/40', async () => {
    await withTemp(async (dir) => {
      const r = runCli([
        'host',
        'apply',
        '--tools',
        'cursor,claude,dsh',
        '--profile',
        'core',
        '--target',
        dir,
        '--yes',
        '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.equal(parsed.ok, true)
      assert.equal(parsed.verdict, 'PASS')

      for (const skillRoot of SKILL_ROOTS) {
        assert.equal(existsSync(path.join(dir, skillRoot)), true, `缺目录 ${skillRoot}`)
        for (const name of CORE_HARNESS_SKILLS) {
          assert.equal(
            skillPresent(dir, skillRoot, name),
            true,
            `缺 skill ${skillRoot}/${name}`,
          )
        }
      }

      const files = listRelFiles(dir)
      assert.equal(
        files.some((f) => f.includes('harness-30-execute')),
        false,
        JSON.stringify(files.filter((f) => f.includes('harness-30'))),
      )
      assert.equal(
        files.some((f) => f.includes('harness-40-self-check')),
        false,
        JSON.stringify(files.filter((f) => f.includes('harness-40'))),
      )
      const joined = [...parsed.written, ...files].join('\n')
      assert.doesNotMatch(joined, /harness-30-execute/)
      assert.doesNotMatch(joined, /harness-40-self-check/)
    })
  })
})
