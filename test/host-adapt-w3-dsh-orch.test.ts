/**
 * 2.1 W3 · DSH 编排 skills（B-DSH-ORCH=B）
 * host apply --tools dsh --profile core --yes
 * → .dsh/skills 含 harness 六条 + kit-* 五条；禁止 .dsh/commands
 */
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

const CORE_HARNESS_SKILLS = [
  'harness-00-delegate-only',
  'harness-10-spec',
  'harness-10-task',
  'harness-20-spec-audit',
  'harness-20-task-audit',
  'harness-hat-reanchor',
] as const

const CORE_ORCH_SKILLS = [
  'kit-verify',
  'kit-gate-status',
  'kit-init-guide',
  'kit-apply-standards',
  'kit-hat-reanchor',
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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w3-dsh-orch-'))
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
  planned: string[]
}

describe('2.1 W3 DSH 编排 skills（B · 无 .dsh/commands）', { concurrency: 1 }, () => {
  it('资产：skills-orch 五条 SKILL.md；正文禁口头代闸 / 必跑 CLI', () => {
    for (const id of CORE_ORCH_SKILLS) {
      const skill = path.join(KIT, 'assets', 'ide', 'skills-orch', id, 'SKILL.md')
      assert.equal(existsSync(skill), true, `缺编排 skill 源 ${skill}`)
      const body = readFileSync(skill, 'utf8')
      assert.match(body, /^---\n[\s\S]*?\n---\n/)
      assert.match(body, new RegExp(`^name:\\s*${id}\\s*$`, 'm'))
      assert.match(body, new RegExp(`kit_command_id:\\s*${id}`))
    }
    const verify = readFileSync(
      path.join(KIT, 'assets', 'ide', 'skills-orch', 'kit-verify', 'SKILL.md'),
      'utf8',
    )
    assert.match(verify, /npx spec-wave verify --task/)
    assert.match(verify, /failClosed|exit\s*2|门禁阻断/)
    assert.match(verify, /禁止.*闸已通过|禁止用本 skill 假装闸过|口头代闸/)
  })

  it('mvp-hosts.yaml：dsh skills 双 from；commands 为空', async () => {
    const yaml = await readFile(
      path.join(KIT, 'assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml'),
      'utf8',
    )
    assert.match(yaml, /host_id:\s*dsh/)
    assert.match(yaml, /from:\s*assets\/skills\/\*/)
    assert.match(yaml, /from:\s*assets\/ide\/skills-orch\/\*/)
    assert.match(yaml, /target_dir:\s*\.dsh\/skills/)
    // dsh 段 commands 必须为空数组（禁止物化 .dsh/commands）
    const dshBlock = yaml.split(/host_id:\s*dsh/)[1]?.split(/host_id:/)[0] ?? ''
    assert.match(dshBlock, /commands:\s*\[\s*\]/)
    assert.doesNotMatch(dshBlock, /target_dir:\s*\.dsh\/commands/)
    assert.doesNotMatch(dshBlock, /from:.*commands/)
  })

  it('apply --tools dsh：harness 六 + kit 五；不存在 .dsh/commands', async () => {
    await withTemp(async (dir) => {
      const r = runCli([
        'host',
        'apply',
        '--tools',
        'dsh',
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

      const skillRoot = '.dsh/skills'
      assert.equal(existsSync(path.join(dir, skillRoot)), true)
      for (const name of CORE_HARNESS_SKILLS) {
        assert.equal(skillPresent(dir, skillRoot, name), true, `缺 harness ${name}`)
      }
      for (const name of CORE_ORCH_SKILLS) {
        assert.equal(skillPresent(dir, skillRoot, name), true, `缺编排 ${name}`)
        assert.equal(
          existsSync(path.join(dir, skillRoot, name, 'SKILL.md')),
          true,
          `缺 ${skillRoot}/${name}/SKILL.md`,
        )
      }

      assert.equal(existsSync(path.join(dir, '.dsh', 'commands')), false, '禁止创建 .dsh/commands')
      const files = listRelFiles(dir)
      assert.equal(
        files.some((f) => f === '.dsh/commands' || f.startsWith('.dsh/commands/')),
        false,
        JSON.stringify(files.filter((f) => f.includes('.dsh/commands'))),
      )
      const joined = [...parsed.written, ...parsed.planned, ...files].join('\n')
      assert.doesNotMatch(joined, /\.dsh\/commands/)
      assert.ok(
        parsed.written.some((p) => p === '.dsh/skills/kit-verify/SKILL.md'),
        JSON.stringify(parsed.written.filter((p) => p.includes('kit-'))),
      )
    })
  })

  it('dry-run：计划含 kit-verify；零写入且不出现 .dsh/commands', async () => {
    await withTemp(async (dir) => {
      const r = runCli([
        'host',
        'apply',
        '--tools',
        'dsh',
        '--profile',
        'core',
        '--target',
        dir,
        '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.equal(parsed.mode, 'dry-run')
      assert.deepEqual(parsed.written, [])
      assert.ok(
        parsed.planned.some((p) => p.includes('.dsh/skills/kit-verify/SKILL.md')),
        JSON.stringify(parsed.planned.filter((p) => p.includes('kit-'))),
      )
      assert.doesNotMatch(parsed.planned.join('\n'), /\.dsh\/commands/)
      assert.equal(existsSync(path.join(dir, '.dsh')), false)
    })
  })
})
