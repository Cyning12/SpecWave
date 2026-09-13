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
 * 2.3 W6 · B4 六宿主补齐（gemini / opencode / roo / zed / cline / aider）。
 * SPEC: docs/spec/2_3-wiring-completion/06_w6_host_completion_v1.md
 * task: docs/tasks/active/task_2_3_wiring_w6_host_completion.md（取证卡 2026-09-13）
 * 钉死：六宿主行落点按官方文档取证卡（gemini→GEMINI.md+.gemini/skills ·
 * opencode/zed→AGENTS.md+.agents/skills · cline→AGENTS.md+.cline/skills ·
 * roo/aider→AGENTS.md+skills 不物化）、近零新资产（全量复用 agents 行）、
 * dry-run 与 --yes 落点一致、多宿主共存 AGENTS.md/GEMINI.md marker 唯一（F-W6-03）、
 * update 粘性幂等、S2 拒写链路（F-W6-02 机制回归）、7 旧宿主回归不破。
 */

const NEW_HOSTS = ['gemini', 'opencode', 'roo', 'zed', 'cline', 'aider'] as const
const OLD_HOSTS = ['dsh', 'cursor', 'claude', 'agents', 'copilot', 'codex', 'windsurf'] as const
/** 表序：旧七行 + 新六行（追加） */
const TABLE_ORDER = [...OLD_HOSTS, ...NEW_HOSTS]
/** 六宿主 always_on 落点（取证卡 2026-09-13：gemini 官方上下文文件为 GEMINI.md；其余五宿主 AGENTS.md） */
const ALWAYS_ON_TARGET: Record<(typeof NEW_HOSTS)[number], string> = {
  gemini: 'GEMINI.md',
  opencode: 'AGENTS.md',
  roo: 'AGENTS.md',
  zed: 'AGENTS.md',
  cline: 'AGENTS.md',
  aider: 'AGENTS.md',
}
/** 官方取证的 skills 目录（roo/aider 无官方 skills 目录约定 → 不物化 · SPEC §5.1 不强造目录） */
const SKILLS_DIR: Partial<Record<(typeof NEW_HOSTS)[number], string>> = {
  gemini: '.gemini/skills',
  opencode: '.agents/skills',
  zed: '.agents/skills',
  cline: '.cline/skills',
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
  return { status: result.status, stdout, stderr, combined: stdout + stderr }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'kit-w6-2-3-'))
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

/** 统计 marker 出现次数（F-W6-03 幂等钉） */
function countMarker(body: string): number {
  return (body.match(/cyning-harness:begin/g) ?? []).length
}

describe('2.3 W6 · 六宿主补齐（gemini/opencode/roo/zed/cline/aider）· 适配表结构', { concurrency: 1 }, () => {
  const yaml = readFileSync(path.join(KIT, TABLE_REL), 'utf8')

  it('适配表含 13 个 host_id · 表序 = 旧七 + 新六', () => {
    const known = listKnownHostIds()
    assert.deepEqual(known, TABLE_ORDER)
  })

  it('六新宿主行：always_on 落点按取证卡 · source 复用 AGENTS.md 片段资产（零新资产）', () => {
    for (const id of NEW_HOSTS) {
      const block = hostBlock(yaml, id)
      const target = ALWAYS_ON_TARGET[id].replace(/\./g, '\\.')
      assert.match(block, new RegExp('target:\\s*' + target + '\\s*$', 'm'), id + ' always_on 须落 ' + ALWAYS_ON_TARGET[id] + '（取证卡）')
      assert.match(
        block,
        /source:\s*assets\/ide\/adapters\/AGENTS\.md\.fragment\.example/,
        id + ' always_on 源须复用 agents 片段资产（D-23-W6-REUSE 零新资产）',
      )
      assert.match(block, /commands:\s*\[\s*\]/, id + ' commands 须为空（无宿主专属命令资产）')
    }
  })

  it('六新宿主 skills 落点 = 官方取证目录（roo/aider 无约定 → 不物化）', () => {
    for (const id of NEW_HOSTS) {
      const block = hostBlock(yaml, id)
      const dir = SKILLS_DIR[id]
      if (dir) {
        const dirPat = dir.replace(/\./g, '\\.').replace(/\//g, '\\/')
        assert.match(block, new RegExp('target_dir:\\s*' + dirPat + '\\s*$', 'm'), id + ' skills target_dir 须为 ' + dir)
        assert.match(block, /from:\s*assets\/skills\/\*/, id + ' skills 源须复用 assets/skills/*')
      } else {
        assert.doesNotMatch(block, /target_dir:/, id + ' 无官方 skills 约定 → 不得物化 skills（SPEC §5.1 不强造目录）')
        assert.match(block, /skills:\s*\[\s*\]/, id + ' skills 须为空数组')
      }
    }
  })

  it('7 旧宿主回归：行仍在且关键落点不变', () => {
    assert.match(hostBlock(yaml, 'dsh'), /target_dir:\s*\.dsh\/skills/)
    assert.match(hostBlock(yaml, 'cursor'), /target:\s*\.cursor\/rules\/05-kit-starter\.mdc/)
    assert.match(hostBlock(yaml, 'claude'), /target:\s*CLAUDE\.md/)
    assert.match(hostBlock(yaml, 'copilot'), /target_dir:\s*\.github\/skills/)
    assert.match(hostBlock(yaml, 'codex'), /target_dir:\s*\.agents\/skills/)
    assert.match(hostBlock(yaml, 'windsurf'), /target_dir:\s*\.windsurf\/skills/)
    const agents = hostBlock(yaml, 'agents')
    assert.match(agents, /target:\s*AGENTS\.md/)
    assert.match(agents, /target_dir:\s*\.agents\/skills/)
  })

  it('近零新资产：六新宿主行的 source/from 不引入 agents 行之外的新资产路径', () => {
    const agentsBlock = hostBlock(yaml, 'agents')
    const agentAssets = [...agentsBlock.matchAll(/(?:source|from):\s*(\S+)/g)].map((m) => m[1])
    for (const id of NEW_HOSTS) {
      const block = hostBlock(yaml, id)
      const assets = [...block.matchAll(/(?:source|from):\s*(\S+)/g)].map((m) => m[1])
      assert.ok(assets.length > 0, id + ' 须有资产引用')
      for (const a of assets) {
        assert.ok(agentAssets.includes(a), id + ' 引入新资产 ' + a + '（违背 D-23-W6-REUSE 零新资产）')
      }
    }
  })
})

describe('2.3 W6 · 六宿主 apply 全链路', { concurrency: 1 }, () => {
  it('dry-run：落点 = AGENTS.md/GEMINI.md + 四宿主官方 skills 目录 · 不写盘不写粘性', async () => {
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
      assert.ok(parsed.planned.includes('GEMINI.md'), 'planned 须含 GEMINI.md（gemini 取证落点）')
      for (const id of NEW_HOSTS) {
        const dir2 = SKILLS_DIR[id]
        if (!dir2) continue
        for (const hat of HAT_SKILLS) {
          assert.ok(parsed.planned.includes(dir2 + '/' + hat + '/SKILL.md'), 'planned 缺 ' + dir2 + '/' + hat + '/SKILL.md')
        }
      }
      // roo/aider 不物化 skills
      assert.ok(!parsed.planned.some((p) => p.startsWith('.roo/')), 'roo 无官方 skills 约定 · 不得物化 .roo/')
      assert.ok(!parsed.planned.some((p) => /aider/i.test(p)), 'aider 降级行不得有专属落点')
      // 不越界到旧宿主专属目录
      for (const rel of parsed.planned) {
        assert.doesNotMatch(rel, /^\.(cursor|claude|dsh|github|windsurf)\//, '六宿主 apply 不得落旧宿主专属目录: ' + rel)
      }
      // dry-run 零写盘
      assert.equal(existsSync(path.join(dir, 'AGENTS.md')), false)
      assert.equal(existsSync(path.join(dir, 'GEMINI.md')), false)
      assert.equal(existsSync(path.join(dir, STICKY_REL)), false)
    })
  })

  it('dry-run 与 --yes 落点一致（F-W6-03）· --yes 物化后文件真实存在且 marker 唯一', async () => {
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

      // 物化真实落盘 + marker 唯一（AGENTS.md 五宿主共享 · GEMINI.md gemini 独占）
      const agentsBody = readFileSync(path.join(dir, 'AGENTS.md'), 'utf8')
      assert.equal(countMarker(agentsBody), 1, 'AGENTS.md marker 块须唯一（五宿主共享 merge 幂等）')
      const geminiBody = readFileSync(path.join(dir, 'GEMINI.md'), 'utf8')
      assert.equal(countMarker(geminiBody), 1, 'GEMINI.md marker 块须唯一')
      for (const id of NEW_HOSTS) {
        const dir2 = SKILLS_DIR[id]
        if (!dir2) continue
        for (const hat of HAT_SKILLS) {
          assert.equal(
            existsSync(path.join(dir, ...dir2.split('/'), hat, 'SKILL.md')),
            true,
            '缺物化 ' + dir2 + '/' + hat + '/SKILL.md',
          )
        }
      }

      // 粘性落盘 = 六宿主
      const sticky = JSON.parse(await readFile(path.join(dir, STICKY_REL), 'utf8')) as {
        host_ids: string[]
        profile: string
      }
      assert.deepEqual(sticky.host_ids, [...NEW_HOSTS])
      assert.equal(sticky.profile, 'core')
    })
  })

  it('agents 与六宿主同选：AGENTS.md marker 块唯一（F-W6-03 多宿主共存钉）', async () => {
    await withTemp(async (dir) => {
      const r = runCli([
        'host', 'apply', '--tools', ['agents', ...NEW_HOSTS].join(','), '--profile', 'core',
        '--target', dir, '--yes',
      ])
      assert.equal(r.status, 0, r.combined)
      const agentsBody = readFileSync(path.join(dir, 'AGENTS.md'), 'utf8')
      assert.equal(countMarker(agentsBody), 1, 'agents+五宿主同写 AGENTS.md 后 marker 须唯一')
      assert.match(agentsBody, /cyning-harness-local:begin/, 'local 块标记须完整')
      const geminiBody = readFileSync(path.join(dir, 'GEMINI.md'), 'utf8')
      assert.equal(countMarker(geminiBody), 1)
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
      assert.deepEqual(parsed.hosts, [...NEW_HOSTS], 'update 无 --tools 须用粘性六宿主')
      assert.equal(parsed.mode, 'update')
      // 幂等：全量 skip_identical · 零写入
      assert.deepEqual(parsed.written, [])
      assert.deepEqual(parsed.conflict, [])
      assert.ok(parsed.skipped.length > 0, '二次刷新须 skip_identical')
    })
  })

  it('--tools all 含 13 宿主（2.2 W6 七 + 2.3 W6 六）', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['host', 'apply', '--tools', 'all', '--profile', 'core', '--target', dir, '--dry-run', '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.deepEqual(parsed.hosts, TABLE_ORDER)
    })
  })
})

describe('2.3 W6 · S2 拒写链路对新宿主生效（F-W6-02 机制回归）', { concurrency: 1 }, () => {
  it('gemini always_on target 命中 docs/tasks → host validate exit 2', async () => {
    await withTemp(async (dir) => {
      const file = path.join(dir, 's2-gemini.yaml')
      await writeFile(
        file,
        [
          'version: "1"',
          'hosts:',
          '  - host_id: gemini',
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

  it('cline skills target_dir 命中 reviews → host apply --yes 拒写 exit 2 · 零落盘', async () => {
    await withTemp(async (dir) => {
      const file = path.join(dir, 's2-cline.yaml')
      await writeFile(
        file,
        [
          'version: "1"',
          'hosts:',
          '  - host_id: cline',
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
        'host', 'apply', '--tools', 'cline', '--target', dir, '--file', file, '--yes',
      ])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /S2|reviews/i)
      assert.equal(existsSync(path.join(dir, 'docs')), false, 'S2 拒写须零落盘')
    })
  })
})
