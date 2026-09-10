/**
 * 2.1 W2 · Commands UX
 * Claude：.claude/commands/kit/<verb>.md；旧扁平 kit-*.md 备份后删除
 * Cursor：kit-*.md frontmatter 含 name / description（及 id / kit_command_id）
 */
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

const CORE_VERBS = [
  'verify',
  'gate-status',
  'init-guide',
  'apply-standards',
  'hat-reanchor',
] as const

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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w2-cmd-ux-'))
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
  removed: string[]
  backup: string | null
}

describe('2.1 W2 commands UX（Claude /kit: + Cursor frontmatter + 扁平迁移）', { concurrency: 1 }, () => {
  it('资产：Claude kit/<verb>.md 五条存在；Cursor frontmatter 含 name/description', () => {
    for (const verb of CORE_VERBS) {
      const claude = path.join(KIT, 'assets', 'ide', 'commands', 'claude', 'kit', `${verb}.md`)
      assert.equal(existsSync(claude), true, `缺 Claude 源 ${claude}`)
      const flatLegacy = path.join(KIT, 'assets', 'ide', 'commands', 'claude', `kit-${verb}.md`)
      assert.equal(existsSync(flatLegacy), false, `不得保留旧扁平源 ${flatLegacy}`)
    }
    for (const verb of CORE_VERBS) {
      const cursor = path.join(KIT, 'assets', 'ide', 'commands', 'cursor', `kit-${verb}.md`)
      assert.equal(existsSync(cursor), true, `缺 Cursor 源 ${cursor}`)
      const body = readFileSync(cursor, 'utf8')
      assert.match(body, /^---\n[\s\S]*?\n---\n/)
      assert.match(body, new RegExp(`^name:\\s*"/kit-${verb}"`, 'm'))
      assert.match(body, /^description:\s*.+/m)
      assert.match(body, new RegExp(`^id:\\s*"kit-${verb}"`, 'm'))
      assert.match(body, new RegExp(`^kit_command_id:\\s*kit-${verb}\\s*$`, 'm'))
    }
  })

  it('mvp-hosts.yaml claude from 指向 assets/ide/commands/claude/kit/*', async () => {
    const yaml = await readFile(
      path.join(KIT, 'assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml'),
      'utf8',
    )
    assert.match(yaml, /from:\s*assets\/ide\/commands\/claude\/kit\/\*/)
    assert.match(yaml, /target_dir:\s*\.claude\/commands\/kit/)
  })

  it('apply claude：写出 kit/<verb>.md；无旧扁平双份', async () => {
    await withTemp(async (dir) => {
      const r = runCli([
        'host',
        'apply',
        '--tools',
        'claude',
        '--profile',
        'core',
        '--target',
        dir,
        '--yes',
        '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as HostJson
      assert.equal(parsed.ok, true)
      for (const verb of CORE_VERBS) {
        assert.equal(
          existsSync(path.join(dir, '.claude', 'commands', 'kit', `${verb}.md`)),
          true,
          `缺落点 kit/${verb}.md`,
        )
        assert.equal(
          existsSync(path.join(dir, '.claude', 'commands', `kit-${verb}.md`)),
          false,
          `不得残留扁平 kit-${verb}.md`,
        )
      }
      assert.ok(
        parsed.written.some((p) => p === '.claude/commands/kit/verify.md'),
        JSON.stringify(parsed.written),
      )
    })
  })

  it('apply/update：旧扁平 kit-*.md 备份后删除，禁止新旧双份', async () => {
    await withTemp(async (dir) => {
      const cmds = path.join(dir, '.claude', 'commands')
      await mkdir(cmds, { recursive: true })
      for (const verb of CORE_VERBS) {
        await writeFile(path.join(cmds, `kit-${verb}.md`), `LEGACY_${verb}\n`, 'utf8')
      }

      const apply = runCli([
        'host',
        'apply',
        '--tools',
        'claude',
        '--profile',
        'core',
        '--target',
        dir,
        '--yes',
        '--json',
      ])
      assert.equal(apply.status, 0, apply.combined)
      const applied = JSON.parse(apply.stdout) as HostJson
      assert.ok(applied.removed.length >= 1, JSON.stringify(applied.removed))
      assert.ok(
        applied.removed.includes('.claude/commands/kit-verify.md'),
        JSON.stringify(applied.removed),
      )
      assert.ok(applied.backup, '须产生 backup')
      assert.equal(
        existsSync(path.join(dir, applied.backup!, '.claude/commands/kit-verify.md')),
        true,
      )

      for (const verb of CORE_VERBS) {
        assert.equal(existsSync(path.join(cmds, 'kit', `${verb}.md`)), true)
        assert.equal(existsSync(path.join(cmds, `kit-${verb}.md`)), false)
      }

      // 再造一份扁平冲突，update 亦须清掉
      await writeFile(path.join(cmds, 'kit-verify.md'), 'LEGACY_AGAIN\n', 'utf8')
      const upd = runCli([
        'host',
        'update',
        '--tools',
        'claude',
        '--profile',
        'core',
        '--target',
        dir,
        '--yes',
        '--force',
        '--json',
      ])
      assert.equal(upd.status, 0, upd.combined)
      const updated = JSON.parse(upd.stdout) as HostJson
      assert.ok(updated.removed.includes('.claude/commands/kit-verify.md'), JSON.stringify(updated.removed))
      assert.equal(existsSync(path.join(cmds, 'kit-verify.md')), false)
      assert.equal(existsSync(path.join(cmds, 'kit', 'verify.md')), true)

      const files = listRelFiles(dir)
      const flatLeft = files.filter((f) => /^\.claude\/commands\/kit-[^/]+\.md$/.test(f))
      assert.deepEqual(flatLeft, [], JSON.stringify(flatLeft))
    })
  })

  it('dry-run：旧扁平列入 removed，零删除零写入', async () => {
    await withTemp(async (dir) => {
      const cmds = path.join(dir, '.claude', 'commands')
      await mkdir(cmds, { recursive: true })
      await writeFile(path.join(cmds, 'kit-verify.md'), 'LEGACY\n', 'utf8')
      const r = runCli([
        'host',
        'apply',
        '--tools',
        'claude',
        '--target',
        dir,
        '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as HostJson
      assert.equal(parsed.mode, 'dry-run')
      assert.deepEqual(parsed.written, [])
      assert.ok(parsed.removed.includes('.claude/commands/kit-verify.md'))
      assert.equal(existsSync(path.join(cmds, 'kit-verify.md')), true)
      assert.equal(existsSync(path.join(cmds, 'kit', 'verify.md')), false)
    })
  })
})
