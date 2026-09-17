import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, rm, writeFile, mkdir, symlink } from 'node:fs/promises'
import { realpathSync, readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { relativizeOutputValue } from '../src/cli-shared.ts'
import { runCore } from './_helpers/core-harness.ts'

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
    '# R1 fixture\n\n## 结论\n\nPASS · 零内容阻塞（fixture）\n\n审查结论：fixture 范围与验收全项合规，无阻塞遗留，准予关账。\n',
  )
  await writeRel(dir, INVOKE10_REL, '# invoke 10 fixture')
  await writeRel(dir, INVOKE3040_REL, '# invoke 30+40 merged fixture')
  await writeRel(dir, 'docs/coding_wiki/index.md', '# wiki fixture\n')
}

describe('2.4-W3 · --json 全命令面无绝对路径机械断言（D-24-OUTPUT-REL-EXIT）', { concurrency: 1 }, () => {
  it('负向自证：断言组本身能红（人为注入仓根绝对前缀 → 断言 throw）', async () => {
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
      const r = await runCore(['gate-check', '--task', abs, '--json'], dir)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'gate-check')
      assert.equal(obj.task, TASK_REL, `task 字段须为仓内相对形: ${obj.task}`)
      assert.deepEqual(Object.keys(obj), ['command', 'target', 'task', 'blocked', 'verdict'])
    })
  })

  it('verify --spec（绝对入参）--json：spec 字段相对化', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), SPEC_REL)
      const r = await runCore(['verify', '--spec', abs, '--json'], dir)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'verify --spec')
      assert.equal(obj.spec, SPEC_REL, `spec 字段须为仓内相对形: ${obj.spec}`)
    })
  })

  it('verify（裸 · reviews 扫描）--json：仓级扫描面无绝对前缀', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const r = await runCore(['verify', '--json'], dir)
      assertJsonNoAbsRoot(r, fixtureRoots(dir), 'verify bare')
    })
  })

  it('status --task（绝对入参）--json：task_path 干净对照不回退 + 键集钉死', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), TASK_REL)
      const r = await runCore(['status', '--task', abs, '--json'], dir)
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
      const r = await runCore(['timeline', '--task', abs, '--json'], dir)
      assertJsonNoAbsRoot(r, fixtureRoots(dir), 'timeline --task')
    })
  })

  it('task lint --file（绝对入参）--json：file 字段相对化（V2 清单 #1）', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), TASK_REL)
      const r = await runCore(['task', 'lint', '--file', abs, '--json'], dir)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'task lint')
      assert.equal(obj.file, TASK_REL, `file 字段须为仓内相对形: ${obj.file}`)
    })
  })

  it('task close --json READY（dry-run · 绝对入参）：dest 相对化 + 键集钉死（V2 清单 #2a）', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), TASK_REL)
      const r = await runCore(['task', 'close', '--file', abs, '--json'], dir)
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
      const r = await runCore(['task', 'close', '--file', abs, '--yes', '--json'], dir)
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
      const dry = await runCore(['task', 'close', '--file', abs], dir)
      assert.equal(dry.status, 0, dry.combined)
      assert.ok(dry.stdout.includes(`dest: ${DONE_REL}`), `dry-run dest 行须相对化:\n${dry.stdout}`)
      assert.ok(!dry.stdout.includes(realpathSync(dir)), 'dry-run stdout 不得含仓根绝对前缀')
      const r = await runCore(['task', 'close', '--file', abs, '--yes'], dir)
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
      const r = await runCore(['task', 'close', '--file', abs, '--json'], dir)
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
      const r = await runCore(['task', 'lint-wiki-delta', '--target', realpathSync(dir), '--json'], dir)
      assertJsonNoAbsRoot(r, fixtureRoots(dir), 'task lint-wiki-delta')
    })
  })

  it('refresh-ide-blocks --target（绝对入参）--json：单行 JSON 契约保持 + target 相对化', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const r = await runCore(['refresh-ide-blocks', '--target', realpathSync(dir), '--json'], dir)
      assert.equal(r.status, 0, r.combined)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'refresh-ide-blocks')
      assert.equal(obj.target, '.', `target 须相对化为 '.': ${obj.target}`)
    })
  })

  it('graph axioms check --target（绝对入参）--json：无绝对前缀', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const r = await runCore(['graph', 'axioms', 'check', '--target', realpathSync(dir), '--json'], dir)
      assertJsonNoAbsRoot(r, fixtureRoots(dir), 'graph axioms check')
    })
  })

  it('wiki export --json --target（绝对入参）：无绝对前缀', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const r = await runCore(['wiki', 'export', '--json', '--target', realpathSync(dir)], dir)
      assertJsonNoAbsRoot(r, fixtureRoots(dir), 'wiki export')
    })
  })

  it('错误信封（exit 1 + --json）：error.message 内嵌仓内绝对路径剥前缀', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const abs = path.join(realpathSync(dir), 'docs/tasks/active/task_not_exist_v1.md')
      const r = await runCore(['verify', '--task', abs, '--json'], dir)
      assert.equal(r.status, 2, r.combined)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'verify missing task')
      assert.equal(obj.blocked, true)
    })
  })

  it('用法错信封（exit 1 + --json）：未知参数错误面统一出口', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      const r = await runCore(['verify', '--task', `${realpathSync(dir)}/x.md`, '--bogus', '--json'], dir)
      assert.equal(r.status, 1, r.combined)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'usage error envelope')
      assert.equal(obj.exitCode, 1)
      assert.deepEqual(Object.keys(obj), ['command', 'exitCode', 'error'])
    })
  })

  it('pins check --json / assets verify --json：本仓面输出无仓根绝对前缀', async () => {
    const pins = await runCore(['pins', 'check', '--json'], KIT)
    assertJsonNoAbsRoot(pins, [realpathSync(KIT), KIT], 'pins check')
    const assets = await runCore(['assets', 'verify', '--json'], KIT)
    assertJsonNoAbsRoot(assets, [realpathSync(KIT), KIT], 'assets verify')
  })

  it('lifecycle show / discipline show / skills check --json：无仓根绝对前缀', async () => {
    await withTemp(async (dir) => {
      for (const args of [
        ['lifecycle', 'show', '--json'],
        ['discipline', 'show', '--json'],
        ['skills', 'check', '--json'],
      ]) {
        const r = await runCore(args, dir)
        assertJsonNoAbsRoot(r, [realpathSync(KIT), KIT, ...fixtureRoots(dir)], args.join(' '))
      }
    })
  })

  it('host validate --file（绝对入参）--json：file 字段相对化', async () => {
    const abs = path.join(KIT, 'assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')
    const r = await runCore(['host', 'validate', '--file', abs, '--json'], KIT)
    const obj = assertJsonNoAbsRoot(r, [realpathSync(KIT), KIT], 'host validate')
    assert.equal(obj.file, 'assets/ide/host-adapt/examples/mvp-hosts.yaml', `file 须为仓内相对形: ${obj.file}`)
  })
})

describe('2.4.1 NEW-2 [P1] · printJson 基参统一 target + realpath 双侧归一（cwd≠target / symlink 对偶 · 验收报告-SpecWave-2.4.0 §3）', { concurrency: 1 }, () => {
  // 掩盖源钉死：本节用例全部 cwd≠target 或 symlink/realpath 错配（现 21 测 cwd==target 恰好对齐）。
  // 红测先行：2.4.0 码下 ①②⑤ 基参=process.cwd() → 绝对前缀泄漏；③ --target 词法形 vs realpath 值形态错配；
  // ④ host validate 无 --target（用法错）；⑥ exit-1 信封基参=cwd。

  it('① cwd≠target：task close --json --file（realpath 绝对）从他目录调用 → dest 相对化（报告 §3 代理复现构造）', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      await withTemp(async (other) => {
        const abs = path.join(realpathSync(dir), TASK_REL)
        const r = await runCore(['task', 'close', '--file', abs, '--json'], other)
        assert.equal(r.status, 0, r.combined)
        const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'task close cwd≠target')
        assert.equal(obj.dest, DONE_REL, `dest 须为仓内相对形: ${obj.dest}`)
      })
    })
  })

  it('② symlink 入参：task close --file 经 symlink 路径（cwd 第三地）→ 无 link/real 绝对前缀', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      await withTemp(async (other) => {
        const link = path.join(other, 'close-link')
        await symlink(realpathSync(dir), link, 'dir')
        const abs = path.join(link, TASK_REL)
        const r = await runCore(['task', 'close', '--file', abs, '--json'], KIT)
        assert.equal(r.status, 0, r.combined)
        const obj = assertJsonNoAbsRoot(r, [link, realpathSync(link), ...fixtureRoots(dir)], 'task close symlink')
        assert.equal(obj.dest, DONE_REL, `dest 须为仓内相对形: ${obj.dest}`)
      })
    })
  })

  it('③ realpath 双侧归一：verify --target <symlink> --task <realpath 绝对> → task 字段相对化（词法基 vs realpath 值错配子类）', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      await withTemp(async (other) => {
        const link = path.join(other, 'verify-link')
        await symlink(realpathSync(dir), link, 'dir')
        const absTask = path.join(realpathSync(dir), TASK_REL)
        const r = await runCore(['verify', '--target', link, '--task', absTask, '--json'], KIT)
        assert.equal(r.status, 0, r.combined)
        const obj = JSON.parse(r.stdout) as { task: string; target: string }
        // 值侧 realpath 形 / 基参词法形错配：realpath 双侧归一后 task 须剥至仓内相对形
        assert.equal(obj.task, TASK_REL, `task 字段须为仓内相对形: ${obj.task}`)
        // target 字段为 toRel(cwd, target) 的 '..' 相对形（F-W3-01 既定口径 · 非绝对泄漏）
        assert.ok(!path.isAbsolute(obj.target), `target 不得为绝对形: ${obj.target}`)
        for (const root of [link, realpathSync(link), ...fixtureRoots(dir)]) {
          assert.ok(!obj.task.includes(root) && !path.isAbsolute(obj.task), `task 不得含仓根前缀 ${root}`)
        }
      })
    })
  })

  it('④ host validate --target（additive）：--target <symlink→KIT> + --file realpath 绝对入参 → file 相对化', async () => {
    await withTemp(async (other) => {
      const link = path.join(other, 'validate-link')
      await symlink(realpathSync(KIT), link, 'dir')
      const relYaml = path.join('assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')
      const absYaml = path.join(realpathSync(KIT), relYaml)
      const r = await runCore(['host', 'validate', '--file', absYaml, '--target', link, '--json'], other)
      assert.equal(r.status, 0, r.combined)
      const obj = assertJsonNoAbsRoot(r, [link, realpathSync(KIT), KIT], 'host validate --target')
      assert.equal(obj.file, relYaml.split(path.sep).join('/'), `file 须相对 --target: ${obj.file}`)
    })
  })

  it('⑤ task lint --json 从他目录调用（--file 绝对入参）→ file 字段按仓根相对化', async () => {
    await withTemp(async (dir) => {
      await seedFixture(dir)
      await withTemp(async (other) => {
        const abs = path.join(realpathSync(dir), TASK_REL)
        const r = await runCore(['task', 'lint', '--file', abs, '--json'], other)
        const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'task lint cwd≠target')
        assert.equal(obj.file, TASK_REL, `file 字段须为仓内相对形: ${obj.file}`)
      })
    })
  })

  it('⑥ exit-1 错误信封（cli.ts:1299 增量）：--target 为基 —— message 携绝对 target 相对化', async () => {
    await withTemp(async (dir) => {
      await withTemp(async (other) => {
        const missing = path.join(realpathSync(dir), 'no-such-target')
        const r = await runCore(['host', 'apply', '--tools', 'all', '--target', missing, '--json'], other)
        assert.equal(r.status, 1, r.combined)
        const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'exit-1 envelope --target base')
        assert.equal(obj.exitCode, 1)
        assert.equal(obj.command, 'host')
      })
    })
  })
})

describe('2.4.2 R-1 [P2] · host validate 缺省基改取 --file 所在仓根（findGitRoot 上溯 · 验收报告-SpecWave-2.4.1 §3.2）', { concurrency: 1 }, () => {
  // 红测先行：2.4.1 码缺省基=cwd —— 跨目录缺省调用 file 打印绝对路径（§3.2 第 5/7 行）。
  const EXAMPLE_REL = path.join('assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')

  it('R-1-a 负向：cwd=/tmp 靶场 · 缺省 --target · --file 仓内示例表绝对路径 → file 为仓内相对形（修复前绝对）', async () => {
    await withTemp(async (other) => {
      const absYaml = path.join(realpathSync(KIT), EXAMPLE_REL)
      const r = await runCore(['host', 'validate', '--file', absYaml, '--json'], other)
      assert.equal(r.status, 0, r.combined)
      const obj = assertJsonNoAbsRoot(r, [realpathSync(KIT), KIT], 'host validate 缺省基跨目录')
      assert.equal(obj.file, EXAMPLE_REL.split(path.sep).join('/'), `file 须为仓内相对形: ${obj.file}`)
      assert.equal(obj.outside_repo, undefined, '仓内文件不得标 outside_repo')
    })
  })

  it('R-1-a2 同型：--file 经 realpath 形态指 temp 仓内文件（/tmp vs /private/tmp 子类）→ file 相对该仓根', async () => {
    await withTemp(async (dir) => {
      await mkdir(path.join(dir, '.git'), { recursive: true })
      await writeFile(path.join(dir, 'hosts.yaml'), readFileSync(path.join(KIT, EXAMPLE_REL), 'utf8'))
      await withTemp(async (other) => {
        const absYaml = path.join(realpathSync(dir), 'hosts.yaml')
        const r = await runCore(['host', 'validate', '--file', absYaml, '--json'], other)
        assert.equal(r.status, 0, r.combined)
        const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'host validate realpath 入参')
        assert.equal(obj.file, 'hosts.yaml', `file 须相对 --file 所在仓根: ${obj.file}`)
      })
    })
  })

  it('R-1-b 仓外文件：findGitRoot 上溯为 null → JSON 标 outside_repo: true + file 占位（basename）· 无绝对路径 · 校验行为不回退', async () => {
    await withTemp(async (dir) => {
      // os.tmpdir() 下无 .git 祖先 → 仓外
      await writeFile(path.join(dir, 'outside.yaml'), readFileSync(path.join(KIT, EXAMPLE_REL), 'utf8'))
      const absYaml = path.join(dir, 'outside.yaml')
      const r = await runCore(['host', 'validate', '--file', absYaml, '--json'], KIT)
      assert.equal(r.status, 0, r.combined)
      const obj = assertJsonNoAbsRoot(r, fixtureRoots(dir), 'host validate 仓外文件')
      assert.equal(obj.outside_repo, true, '仓外文件须标 outside_repo: true')
      assert.equal(obj.file, 'outside.yaml', `仓外 file 取 basename 占位: ${obj.file}`)
      assert.equal(obj.verdict, 'PASS', '校验行为本身不回退')
    })
  })

  it('R-1-c 零回退：--target 显式优先（2.4.1 接口面）+ 缺省 cwd=仓根用例 + 人类输出相对化', async () => {
    await withTemp(async (other) => {
      const link = path.join(other, 'v242-link')
      await symlink(realpathSync(KIT), link, 'dir')
      const absYaml = path.join(realpathSync(KIT), EXAMPLE_REL)
      // --target 显式 → 仍以 target 为基（不动 2.4.1 口径）
      const r = await runCore(['host', 'validate', '--file', absYaml, '--target', link, '--json'], other)
      assert.equal(r.status, 0, r.combined)
      const obj = assertJsonNoAbsRoot(r, [link, realpathSync(KIT), KIT], 'host validate --target 显式')
      assert.equal(obj.file, EXAMPLE_REL.split(path.sep).join('/'))
      assert.equal(obj.outside_repo, undefined)
    })
    // 缺省 cwd=仓根（既有主用例形态 · 与人类输出同口径）
    const absYaml = path.join(KIT, EXAMPLE_REL)
    const r2 = await runCore(['host', 'validate', '--file', absYaml], KIT)
    assert.equal(r2.status, 0, r2.combined)
    assert.ok(r2.stdout.includes(`file: ${EXAMPLE_REL.split(path.sep).join('/')}`), `人类输出 file 须相对化:\n${r2.stdout}`)
  })
})

describe('3.0-W5 NEW-12 · relativizeOutputValue 覆盖对象 key（验收 #4 · 红测先行：修复前 key 原样泄漏真红）', () => {
  const BASE = '/tmp/dsh-ck-new12-base'

  it('以绝对路径为 key 的对象：key 相对化 · 无绝对路径 key · value 相对化零回退', async () => {
    const out = relativizeOutputValue(BASE, {
      [BASE + '/docs/tasks/active/x.md']: { hits: 2, note: BASE + '/assets/a.yaml' },
      'plain-key': 'plain-value',
    }) as Record<string, unknown>
    const keys = Object.keys(out)
    assert.ok(
      !keys.some((k) => k.includes(BASE)),
      '断言无绝对路径 key（修复前 key 原样泄漏 = 真红面）: ' + keys.join(','),
    )
    assert.ok(keys.includes('docs/tasks/active/x.md'), 'key 已相对化为仓内相对形: ' + keys.join(','))
    const entry = out['docs/tasks/active/x.md'] as { hits: number; note: string }
    assert.equal(entry.note, 'assets/a.yaml', 'value 相对化零回退')
    assert.equal(out['plain-key'], 'plain-value')
  })

  it('零改写锁：无路径 key 的对象逐字不变（键集与值零触碰面）', async () => {
    const input = { alpha: 'x', beta: { gamma: 'y' }, list: ['z', 1, true, null] }
    assert.deepEqual(relativizeOutputValue(BASE, input), input)
  })

  it('键碰撞语义登记（20 审 A1）：相对化后撞名后者覆盖前者 · 信封不得依赖碰撞面', async () => {
    const out = relativizeOutputValue(BASE, {
      'docs/x.md': 'first',
      [BASE + '/docs/x.md']: 'second',
    }) as Record<string, string>
    assert.deepEqual(Object.keys(out), ['docs/x.md'])
    assert.equal(out['docs/x.md'], 'second', 'A1 登记语义：撞名后者覆盖前者')
  })
})
