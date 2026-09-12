import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { listKnownHostIds } from '../src/cli-host.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const TABLE_REL = path.join('assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')
const STICKY_REL = path.join('.coding-kit', 'host-tools.json')

/**
 * 2.2 W6 · B1 三宿主扩展（copilot / codex / windsurf）。
 * SPEC: docs/spec/2_2-closed-loop-start/04_host_expansion_v1.md
 * 钉死：三宿主行（AGENTS.md 复用 + 宿主原生 skills 目录 · 近零新资产 · commands=[]）、
 * dry-run 与 --yes 落点一致（F-W6-03）、--yes 后 update 粘性可用、S2 拒写链路（F-W6-02）、
 * 4 旧宿主回归不破。
 */

const NEW_HOSTS = ['copilot', 'codex', 'windsurf'] as const
const OLD_HOSTS = ['dsh', 'cursor', 'claude', 'agents'] as const
/** 表序：旧四行 + 新三行（追加） */
const TABLE_ORDER = [...OLD_HOSTS, ...NEW_HOSTS]
/** 三宿主原生 skills 落点（2026-09 官方文档口径：copilot=.github/skills · codex=.agents/skills · windsurf=.windsurf/skills） */
const SKILLS_DIR: Record<(typeof NEW_HOSTS)[number], string> = {
  copilot: '.github/skills',
  codex: '.agents/skills',
  windsurf: '.windsurf/skills',
}
const HAT_SKILLS = [
  'harness-00-delegate-only',
  'harness-10-spec',
  'harness-10-task',
  'harness-20-spec-audit',
  'harness-20-task-audit',
  'harness-hat-reanchor',
]

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string }

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
  return { status: result.status, stdout, stderr, combined: stdout + '\n' + stderr }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'specwave-w6-hosts-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

type ApplyJson = {
  hosts: string[]
  planned: string[]
  written: string[]
  skipped: string[]
  conflict: string[]
  mode: string
  ok: boolean
}

/** 从适配表文本切出某 host_id 的行块（到下一 host_id 或文件尾） */
function hostBlock(yaml: string, hostId: string): string {
  const re = new RegExp('host_id:\\s*' + hostId + '\\s*$', 'm')
  const m = re.exec(yaml)
  assert.ok(m, '适配表缺 host_id: ' + hostId)
  const rest = yaml.slice(m.index)
  const next = rest.slice(1).search(/host_id:/)
  return next === -1 ? rest : rest.slice(0, next + 1)
}

describe('2.2 W6 · 三宿主扩展（copilot/codex/windsurf）· 适配表结构', { concurrency: 1 }, () => {
  const yaml = readFileSync(path.join(KIT, TABLE_REL), 'utf8')

  it('适配表含 7 个 host_id · 表序 = 旧四 + 新三', () => {
    const known = listKnownHostIds()
    assert.deepEqual(known, TABLE_ORDER)
  })

  it('三新宿主行：always_on 复用 AGENTS.md 片段 · skills 复用 assets/skills/* · commands 为空', () => {
    for (const id of NEW_HOSTS) {
      const block = hostBlock(yaml, id)
      assert.match(block, /target:\s*AGENTS\.md/, id + ' always_on 须落 AGENTS.md')
      assert.match(
        block,
        /source:\s*assets\/ide\/adapters\/AGENTS\.md\.fragment\.example/,
        id + ' always_on 源须复用 agents 片段资产（近零新资产）',
      )
      assert.match(block, /from:\s*assets\/skills\/\*/, id + ' skills 源须复用 assets/skills/*')
      assert.match(block, /commands:\s*\[\s*\]/, id + ' commands 须为空（无宿主专属命令资产）')
    }
  })

  it('三新宿主 skills 落点 = 宿主原生目录（copilot→.github/skills · codex→.agents/skills · windsurf→.windsurf/skills）', () => {
    for (const id of NEW_HOSTS) {
      const block = hostBlock(yaml, id)
      const dirPat = SKILLS_DIR[id].replace(/\./g, '\\.').replace(/\//g, '\\/')
      assert.match(
        block,
        new RegExp('target_dir:\\s*' + dirPat + '\\s*$', 'm'),
        id + ' skills target_dir 须为 ' + SKILLS_DIR[id],
      )
    }
  })

  it('4 旧宿主回归：行仍在且关键落点不变', () => {
    assert.match(hostBlock(yaml, 'dsh'), /target_dir:\s*\.dsh\/skills/)
    assert.match(hostBlock(yaml, 'cursor'), /target:\s*\.cursor\/rules\/05-kit-starter\.mdc/)
    assert.match(hostBlock(yaml, 'claude'), /target:\s*CLAUDE\.md/)
    const agents = hostBlock(yaml, 'agents')
    assert.match(agents, /target:\s*AGENTS\.md/)
    assert.match(agents, /target_dir:\s*\.agents\/skills/)
    assert.match(agents, /commands:\s*\[\s*\]/)
  })

  it('近零新资产：三新宿主行的 source/from 不引入 agents 行之外的新资产路径', () => {
    const agentsBlock = hostBlock(yaml, 'agents')
    const agentAssets = [...agentsBlock.matchAll(/(?:source|from):\s*(\S+)/g)].map((m) => m[1])
    for (const id of NEW_HOSTS) {
      const block = hostBlock(yaml, id)
      const assets = [...block.matchAll(/(?:source|from):\s*(\S+)/g)].map((m) => m[1])
      assert.ok(assets.length > 0, id + ' 须有资产引用')
      for (const a of assets) {
        assert.ok(
          agentAssets.includes(a),
          id + ' 引入新资产 ' + a + '（违背近零新资产 · 单宿主缩减留痕条款）',
        )
      }
    }
  })
})

describe('2.2 W6 · 三宿主 apply 全链路', { concurrency: 1 }, () => {
  it('dry-run：落点 = AGENTS.md + 三宿主原生 skills 目录 · 不写盘不写粘性', async () => {
    await withTemp(async (dir) => {
      const r = runCli([
        'host', 'apply', '--tools', NEW_HOSTS.join(','), '--profile', 'core',
        '--target', dir, '--dry-run', '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.deepEqual(parsed.hosts, [...NEW_HOSTS])
      assert.equal(parsed.mode, 'dry-run')
      assert.ok(parsed.planned.includes('AGENTS.md'), 'planned 须含 AGENTS.md')
      for (const id of NEW_HOSTS) {
        for (const hat of HAT_SKILLS) {
          assert.ok(
            parsed.planned.includes(SKILLS_DIR[id] + '/' + hat + '/SKILL.md'),
            'planned 缺 ' + SKILLS_DIR[id] + '/' + hat + '/SKILL.md',
          )
        }
      }
      // 不越界到旧宿主目录
      for (const rel of parsed.planned) {
        assert.doesNotMatch(rel, /^\.(cursor|claude|dsh)\//, '三宿主 apply 不得落旧宿主目录: ' + rel)
      }
      // dry-run 零写盘
      assert.equal(existsSync(path.join(dir, 'AGENTS.md')), false)
      assert.equal(existsSync(path.join(dir, STICKY_REL)), false)
    })
  })

  it('dry-run 与 --yes 落点一致（F-W6-03）· --yes 物化后文件真实存在', async () => {
    await withTemp(async (dir) => {
      const base = ['host', 'apply', '--tools', NEW_HOSTS.join(','), '--profile', 'core', '--target', dir, '--json']
      const dry = runCli([...base, '--dry-run'])
      assert.equal(dry.status, 0, dry.combined)
      const dryParsed = JSON.parse(dry.stdout) as ApplyJson

      const yes = runCli([...base, '--yes'])
      assert.equal(yes.status, 0, yes.combined)
      const yesParsed = JSON.parse(yes.stdout) as ApplyJson
      assert.equal(yesParsed.mode, 'apply')

      // F-W6-03：dry-run planned == --yes written（且无 conflict）
      assert.deepEqual([...yesParsed.written].sort(), [...dryParsed.planned].sort())
      assert.deepEqual(yesParsed.conflict, [])

      // 物化真实落盘
      assert.equal(existsSync(path.join(dir, 'AGENTS.md')), true)
      const agentsBody = readFileSync(path.join(dir, 'AGENTS.md'), 'utf8')
      assert.match(agentsBody, /cyning-harness:begin/, 'AGENTS.md 须含 harness 产品块 marker')
      for (const id of NEW_HOSTS) {
        for (const hat of HAT_SKILLS) {
          assert.equal(
            existsSync(path.join(dir, ...SKILLS_DIR[id].split('/'), hat, 'SKILL.md')),
            true,
            '缺物化 ' + SKILLS_DIR[id] + '/' + hat + '/SKILL.md',
          )
        }
      }

      // 粘性落盘 = 三宿主
      const sticky = JSON.parse(await readFile(path.join(dir, STICKY_REL), 'utf8')) as {
        host_ids: string[]
        profile: string
      }
      assert.deepEqual(sticky.host_ids, [...NEW_HOSTS])
      assert.equal(sticky.profile, 'core')
    })
  })

  it('--yes 物化后 host update 粘性可用（无 --tools 读粘性 · 幂等 skip_identical）', async () => {
    await withTemp(async (dir) => {
      const apply = runCli([
        'host', 'apply', '--tools', NEW_HOSTS.join(','), '--profile', 'core',
        '--target', dir, '--yes',
      ])
      assert.equal(apply.status, 0, apply.combined)

      const upd = runCli(['host', 'update', '--target', dir, '--yes', '--json'])
      assert.equal(upd.status, 0, upd.combined)
      const parsed = JSON.parse(upd.stdout) as ApplyJson
      assert.deepEqual(parsed.hosts, [...NEW_HOSTS], 'update 无 --tools 须用粘性三宿主')
      assert.equal(parsed.mode, 'update')
      // 幂等：全量 skip_identical · 零写入
      assert.deepEqual(parsed.written, [])
      assert.deepEqual(parsed.conflict, [])
      assert.ok(parsed.skipped.length > 0, '二次刷新须 skip_identical')
    })
  })
})

describe('2.2 W6 · S2 拒写链路对新宿主生效（F-W6-02 回归）', { concurrency: 1 }, () => {
  it('copilot always_on target 命中 docs/tasks → host validate exit 2', async () => {
    await withTemp(async (dir) => {
      const file = path.join(dir, 's2-copilot.yaml')
      await writeFile(
        file,
        [
          'version: "1"',
          'hosts:',
          '  - host_id: copilot',
          '    surfaces:',
          '      always_on:',
          '        - target: docs/tasks/evil.md',
          '          source: assets/ide/adapters/AGENTS.md.fragment.example',
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

  it('windsurf skills target_dir 命中 invokes → host validate exit 2', async () => {
    await withTemp(async (dir) => {
      const file = path.join(dir, 's2-windsurf.yaml')
      await writeFile(
        file,
        [
          'version: "1"',
          'hosts:',
          '  - host_id: windsurf',
          '    surfaces:',
          '      always_on: []',
          '      skills:',
          '        - target_dir: docs/harness/invokes/by-task/x',
          '          from: assets/skills/*',
          '      commands: []',
          '',
        ].join('\n'),
        'utf8',
      )
      const r = runCli(['host', 'validate', '--file', file])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /S2|invokes/i)
    })
  })

  it('codex skills target_dir 命中 reviews → host apply --yes 拒写 exit 2 · 零落盘', async () => {
    await withTemp(async (dir) => {
      const file = path.join(dir, 's2-codex.yaml')
      await writeFile(
        file,
        [
          'version: "1"',
          'hosts:',
          '  - host_id: codex',
          '    surfaces:',
          '      always_on: []',
          '      skills:',
          '        - target_dir: docs/harness/reviews/x',
          '          from: assets/skills/*',
          '      commands: []',
          '',
        ].join('\n'),
        'utf8',
      )
      const r = runCli([
        'host', 'apply', '--tools', 'codex', '--target', dir, '--file', file, '--yes',
      ])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /S2|reviews/i)
      assert.equal(existsSync(path.join(dir, 'docs')), false, 'S2 拒写须零落盘')
    })
  })
})
