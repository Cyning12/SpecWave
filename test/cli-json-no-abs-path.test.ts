import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises'
import { realpathSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string }

function runCli(args: string[], cwd = KIT): RunResult {
  const result = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd,
    env: { ...process.env },
  })
  const stdout = result.stdout ?? ''
  const stderr = result.stderr ?? ''
  return { status: result.status, stdout, stderr, combined: `${stdout}\n${stderr}` }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-rel-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

async function writeRel(root: string, rel: string, body: string): Promise<string> {
  const abs = path.join(root, rel)
  await mkdir(path.dirname(abs), { recursive: true })
  await writeFile(abs, body, 'utf8')
  return abs
}

/**
 * 机械断言（2.4-W3 · D-24-OUTPUT-REL-EXIT · SPEC 03 §5.2）：任何 --json 命令面
 * stdout 须整体可 JSON.parse 且不得含仓根绝对路径前缀（realpath 与词法双形态）。
 * 返回解析后对象供键集/字段值追加断言。
 */
function assertJsonNoAbsRoot(
  r: RunResult,
  roots: string[],
  label: string,
): Record<string, unknown> {
  const out = r.stdout.trim()
  assert.ok(out.length > 0, `${label}: stdout 为空（--json 面须出 JSON 信封）\n${r.combined}`)
  let obj: Record<string, unknown>
  try {
    obj = JSON.parse(out) as Record<string, unknown>
  } catch {
    assert.fail(`${label}: stdout 非 JSON: ${r.combined}`)
  }
  for (const root of new Set(roots)) {
    assert.ok(
      !r.stdout.includes(root),
      `${label}: stdout 泄漏仓根绝对前缀 ${root}\n${r.stdout}`,
    )
  }
  return obj
}

function fixtureRoots(dir: string): string[] {
  return [realpathSync(dir), dir]
}

function taskMd(): string {
  const meta: [string, string][] = [
    ['task_slug', 'rel_ok'],
    ['test_strategy', 'recommended'],
    ['invoke_retention_profile', 'default'],
    ['graph_delta', 'none'],
    ['graph_delta_note', 'fixture 无图谱增量'],
    ['wiki_delta', 'none'],
    ['wiki_delta_note', 'fixture 无 wiki 增量'],
    ['experience_capture', 'recommended'],
    ['kpi_aggregator', 'CLOSE'],
    ['close_pr_policy', 'exempt'],
    ['close_pr_exempt_note', 'fixture output rel'],
  ]
  return [
    '# Task rel_ok',
    '',
    '> **状态**：`done`',
    '',
    '## Harness 元信息',
    '',
    '| 字段 | 值 |',
    '|------|-----|',
    ...meta.map(([k, v]) => `| **${k}** | \`${v}\` |`),
    '',
    '### 人工闸',
    '',
    '| human_gate_id | status | blocks_hats | 说明 |',
    '|---------------|--------|-------------|------|',
    '| HG-TASK-DRAFT | approved | 20,30 | fixture |',
    '| HG-AUDIT-R1 | approved | 30 | fixture |',
    '',
    '## 验收标准',
    '',
    '- [x] fixture item',
    '',
    '## 失败路径',
    '',
    '| F | Scenario |',
    '|---|----------|',
    '| F1 | fixture |',
    '',
    '### 自检结论（执行者）',
    '',
    '自检已回填：fixture output rel。',
    '',
    '### KPI（00）',
    '',
    'Task_KPI%: 87',
    '',
    '### 经验总结',
    '',
    'fixture 经验总结：无。',
    '',
  ].join('\n')
}

const TASK_REL = 'docs/tasks/active/task_rel_ok_v1.md'
const DONE_REL = 'docs/tasks/done/task_rel_ok_v1.md'
const SPEC_REL = 'docs/spec/fixture/SPEC_rel_ok_v1.md'
const REVIEW_REL = 'docs/harness/reviews/task_rel_ok_audit_R1_2026-09-14.md'
const INVOKE10_REL = 'docs/harness/invokes/by-task/rel_ok/invoke_20260901_10_rel_ok.md'
const INVOKE3040_REL = 'docs/harness/invokes/by-task/rel_ok/invoke_20260902_30_40_rel_ok.md'

async function seedFixture(dir: string): Promise<void> {
  // requireGitRoot（verify/gate-check）仅需 .git 存在性（findGitRoot · existsSync 口径）
  await mkdir(path.join(dir, '.git'), { recursive: true })
  await writeRel(dir, TASK_REL, taskMd())
  await writeRel(dir, SPEC_REL, '# SPEC fixture\n\n> **状态**：`draft`\n')
  await writeRel(
    dir,
    REVIEW_REL,
    '# R1 fixture\n\n## 结论\n\nPASS · 零内容阻塞（fixture）\n\n审查结论：fixture 全项合规，无阻塞遗留，准予关账。\n',
  )
  await writeRel(dir, INVOKE10_REL, '# invoke 10 fixture')
  await writeRel(dir, INVOKE3040_REL, '# invoke 30+40 merged fixture')
  await writeRel(dir, 'docs/coding_wiki/index.md', '# wiki fixture\n')
}

describe('2.4-W3 · --json 全命令面无绝对路径机械断言（D-24-OUTPUT-REL-EXIT）', { concurrency: 1 }, () => {
  it('负向自证：断言组本身能红（人为注入仓根绝对前缀 → 断言 throw）', () => {
    const root = '/tmp/dsh-ck-rel-selfproof'
    const injectedValue: RunResult = {
      status: 0,
      stdout: `${JSON.stringify({ file: `${root}/docs/tasks/active/x.md` }, null, 2)}\n`,
      stderr: '',
      combined: '',
    }
    assert.throws(
      () => assertJsonNoAbsRoot(injectedValue, [root], 'selfproof-value'),
      /泄漏仓根绝对前缀/,
      '整串值注入 → 断言须真红',
    )
    const injectedEmbed: RunResult = {
      status: 0,
      stdout: `${JSON.stringify({ error: { message: `错误: 未找到 ${root}/docs/x.md` } }, null, 2)}\n`,
      stderr: '',
      combined: '',
    }
    assert.throws(
      () => assertJsonNoAbsRoot(injectedEmbed, [root], 'selfproof-embed'),
      /泄漏仓根绝对前缀/,
      '长文案内嵌注入 → 断言须真红',
    )
    const injectedBare: RunResult = {
      status: 0,
      stdout: `${JSON.stringify({ target: root }, null, 2)}\n`,
      stderr: '',
      combined: '',
    }
    assert.throws(
      () => assertJsonNoAbsRoot(injectedBare, [root], 'selfproof-bare'),
      /泄漏仓根绝对前缀/,
      '裸仓根注入 → 断言须真红',
    )
    const notJson: RunResult = { status: 0, stdout: 'CLOSE: PASS\n', stderr: '', combined: '' }
    assert.throws(
      () => assertJsonNoAbsRoot(notJson, [root], 'selfproof-nonjson'),
      /非 JSON/,
      'stdout 非 JSON → 断言须真红',
    )
  })

  it('verify --task（绝对入参）--json：task 字段相对化 + 键集钉死', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), TASK_REL)
      const r = runCli(['verify', '--task', abs, '--json'], dir)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'verify --task')
      assert.equal(obj.task, TASK_REL, `task 字段须为仓内相对形: ${obj.task}`)
      assert.deepEqual(Object.keys(obj), [
        'command',
        'target',
        'task',
        'blocked',
        'verdict',
        'traceId',
        'exitCode',
        'source',
        'injectedFiles',
      ])
    })
  })

  it('gate-check --task（绝对入参）--json：task 字段相对化 + 键集钉死', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), TASK_REL)
      const r = runCli(['gate-check', '--task', abs, '--json'], dir)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'gate-check')
      assert.equal(obj.task, TASK_REL, `task 字段须为仓内相对形: ${obj.task}`)
      assert.deepEqual(Object.keys(obj), ['command', 'target', 'task', 'blocked', 'verdict'])
    })
  })

  it('verify --spec（绝对入参）--json：spec 字段相对化', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), SPEC_REL)
      const r = runCli(['verify', '--spec', abs, '--json'], dir)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'verify --spec')
      assert.equal(obj.spec, SPEC_REL, `spec 字段须为仓内相对形: ${obj.spec}`)
    })
  })

  it('verify（裸 · reviews 扫描）--json：仓级扫描面无绝对前缀', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const r = runCli(['verify', '--json'], dir)
      assertJsonNoAbsRoot(r, fixtureRoots(dir), 'verify bare')
    })
  })

  it('status --task（绝对入参）--json：task_path 干净对照不回退 + 键集钉死', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), TASK_REL)
      const r = runCli(['status', '--task', abs, '--json'], dir)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'status --task')
      assert.equal(obj.task_path, TASK_REL, `task_path 相对口径保持: ${obj.task_path}`)
      assert.ok(!path.isAbsolute(String(obj.task_path)))
      assert.deepEqual(Object.keys(obj), [
        'schema_version',
        'task_slug',
        'task_path',
        'status',
        'gates',
        'may_start_30',
        'blockers',
        'last_invoke',
        'reviews',
        'verify_preview',
        'hgm',
        'kpi_section',
        'next_hint',
      ])
    })
  })

  it('timeline --task（绝对入参）--json：无绝对前缀', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), TASK_REL)
      const r = runCli(['timeline', '--task', abs, '--json'], dir)
      assertJsonNoAbsRoot(r, fixtureRoots(dir), 'timeline --task')
    })
  })

  it('task lint --file（绝对入参）--json：file 字段相对化（V2 清单 #1）', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), TASK_REL)
      const r = runCli(['task', 'lint', '--file', abs, '--json'], dir)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'task lint')
      assert.equal(obj.file, TASK_REL, `file 字段须为仓内相对形: ${obj.file}`)
    })
  })

  it('task close --json READY（dry-run · 绝对入参）：dest 相对化 + 键集钉死（V2 清单 #2a）', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), TASK_REL)
      const r = runCli(['task', 'close', '--file', abs, '--json'], dir)
      assert.equal(r.status, 0, r.combined)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'task close READY')
      assert.equal(obj.status, 'READY')
      assert.equal(obj.dest, DONE_REL, `READY dest 须为仓内相对形（dry-run 尚不存在亦相对化）: ${obj.dest}`)
      assert.equal(obj.done_snapshot, null)
      assert.deepEqual(Object.keys(obj), ['ok', 'status', 'slug', 'dest', 'traces', 'done_snapshot'])
    })
  })

  it('task close --json --yes PASS（绝对入参）：dest/done_snapshot.path 相对化（V2 清单 #2b）', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), TASK_REL)
      const r = runCli(['task', 'close', '--file', abs, '--yes', '--json'], dir)
      assert.equal(r.status, 0, r.combined)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'task close PASS')
      assert.equal(obj.status, 'PASS')
      assert.equal(obj.dest, DONE_REL, `dest 须为仓内相对形: ${obj.dest}`)
      const snap = obj.done_snapshot as { path?: string } | null
      assert.equal(snap?.path, DONE_REL, `done_snapshot.path 须为仓内相对形: ${snap?.path}`)
      assert.deepEqual(Object.keys(obj), ['ok', 'status', 'slug', 'dest', 'traces', 'done_snapshot'])
    })
  })

  it('task close 人类输出：moved:/dest:/done_snapshot·path 相对化 + CLOSE 冻结文案不动（V2 清单 #4）', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), TASK_REL)
      const dry = runCli(['task', 'close', '--file', abs], dir)
      assert.equal(dry.status, 0, dry.combined)
      assert.ok(dry.stdout.includes(`dest: ${DONE_REL}`), `dry-run dest 行须相对化:\n${dry.stdout}`)
      assert.ok(!dry.stdout.includes(realpathSync(dir)), 'dry-run stdout 不得含仓根绝对前缀')
      const r = runCli(['task', 'close', '--file', abs, '--yes'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.stdout, /CLOSE: PASS · rel_ok/, 'CLOSE: PASS 冻结文案不动')
      assert.ok(
        r.stdout.includes(`moved: ${TASK_REL} → ${DONE_REL}`),
        `moved 行须相对化:\n${r.stdout}`,
      )
      assert.ok(
        r.stdout.includes(`done_snapshot · path: ${DONE_REL}`),
        `done_snapshot path 行须相对化:\n${r.stdout}`,
      )
      assert.ok(!r.stdout.includes(realpathSync(dir)), 'PASS stdout 不得含仓根绝对前缀')
    })
  })

  it('task close --json BLOCKED：blockers 内嵌绝对路径剥前缀 + 键集钉死', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      // 预占 dest → 触发「目标已存在（不覆盖）: <path>」blocker
      await writeRel(dir, DONE_REL, taskMd())
      const abs = path.join(realpathSync(dir), TASK_REL)
      const r = runCli(['task', 'close', '--file', abs, '--json'], dir)
      assert.equal(r.status, 2, r.combined)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'task close BLOCKED')
      assert.equal(obj.status, 'BLOCKED')
      assert.deepEqual(Object.keys(obj), ['ok', 'status', 'slug', 'blockers', 'traces'])
      const blockers = (obj.blockers as string[]).join('\n')
      assert.ok(blockers.includes(DONE_REL), `blocker 须含相对化 dest: ${blockers}`)
    })
  })

  it('task lint-wiki-delta --target（绝对入参）--json：无绝对前缀', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const r = runCli(['task', 'lint-wiki-delta', '--target', realpathSync(dir), '--json'], dir)
      assertJsonNoAbsRoot(r, fixtureRoots(dir), 'task lint-wiki-delta')
    })
  })

  it('refresh-ide-blocks --target（绝对入参）--json：单行 JSON 契约保持 + target 相对化', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const r = runCli(['refresh-ide-blocks', '--target', realpathSync(dir), '--json'], dir)
      assert.equal(r.status, 0, r.combined)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'refresh-ide-blocks')
      assert.equal(obj.target, '.', `target 须相对化为 '.': ${obj.target}`)
    })
  })

  it('graph axioms check --target（绝对入参）--json：无绝对前缀', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const r = runCli(['graph', 'axioms', 'check', '--target', realpathSync(dir), '--json'], dir)
      assertJsonNoAbsRoot(r, fixtureRoots(dir), 'graph axioms check')
    })
  })

  it('wiki export --json --target（绝对入参）：无绝对前缀', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const r = runCli(['wiki', 'export', '--json', '--target', realpathSync(dir)], dir)
      assertJsonNoAbsRoot(r, fixtureRoots(dir), 'wiki export')
    })
  })

  it('错误信封（exit 1 + --json）：error.message 内嵌仓内绝对路径剥前缀', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), 'docs/tasks/active/task_not_exist_v1.md')
      const r = runCli(['verify', '--task', abs, '--json'], dir)
      assert.equal(r.status, 2, r.combined)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'verify missing task')
      assert.equal(obj.blocked, true)
    })
  })

  it('用法错信封（exit 1 + --json）：未知参数错误面统一出口', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const r = runCli(['verify', '--task', `${realpathSync(dir)}/x.md`, '--bogus', '--json'], dir)
      assert.equal(r.status, 1, r.combined)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'usage error envelope')
      assert.equal(obj.exitCode, 1)
      assert.deepEqual(Object.keys(obj), ['command', 'exitCode', 'error'])
    })
  })

  it('pins check --json / assets verify --json：本仓面输出无仓根绝对前缀', () => {
    const pins = runCli(['pins', 'check', '--json'], KIT)
    assertJsonNoAbsRoot(pins, [realpathSync(KIT), KIT], 'pins check')
    const assets = runCli(['assets', 'verify', '--json'], KIT)
    assertJsonNoAbsRoot(assets, [realpathSync(KIT), KIT], 'assets verify')
  })

  it('lifecycle show / discipline show / skills check --json：无仓根绝对前缀', async () => {
    await withTemp(async (dir) => {
      for (const args of [
        ['lifecycle', 'show', '--json'],
        ['discipline', 'show', '--json'],
        ['skills', 'check', '--json'],
      ]) {
        const r = runCli(args, dir)
        assertJsonNoAbsRoot(r, [realpathSync(KIT), KIT, ...fixtureRoots(dir)], args.join(' '))
      }
    })
  })

  it('host validate --file（绝对入参）--json：file 字段相对化', () => {
    const abs = path.join(KIT, 'assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')
    const r = runCli(['host', 'validate', '--file', abs, '--json'], KIT)
    const obj = assertJsonNoAbsRoot(r, [realpathSync(KIT), KIT], 'host validate')
    assert.equal(obj.file, 'assets/ide/host-adapt/examples/mvp-hosts.yaml', `file 须为仓内相对形: ${obj.file}`)
  })
})
