import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

// 3.0-W6 阶段一 · S6.2 F4：discipline check 真实触发源（declared 纸面 vs verified 实跑双列 ·
// F-W6-05 unreachable 分档不误报 fail）。红→绿钉死：修复前无 check 子命令（discipline 子命令未知）。
// 负向 fixture 三面（task 指定）：坏 trigger 形态 / unreachable 分档 / declared≠verified 双列呈现。

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
  return { status: result.status, stdout, stderr, combined: stdout + '\n' + stderr }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w6dc-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

function yamlWithStatement(triggerBlock: string): string {
  return [
    'version: "1"',
    'as_of_package_version: "2.4.2"',
    'scope: fixture',
    'statements:',
    '  - id: X1',
    '    source: fixture.md',
    '    summary: fixture 声明',
    '    status: mechanical',
    triggerBlock,
    '',
  ].join('\n')
}

async function seedConsumerYaml(dir: string, body: string): Promise<void> {
  const abs = path.join(dir, 'assets', 'harness', 'discipline-coverage.yaml')
  await mkdir(path.dirname(abs), { recursive: true })
  await writeFile(abs, body, 'utf8')
}

describe('3.0-W6 S6.2 F4 · discipline check 真实触发源', { concurrency: 1 }, () => {
  it('包内 yaml v1 收窄面 10 条全绿（A1/A5/A6/A7/A9/B2/B4/C1/C2/D3 · declared vs verified 双列 · exit 0）', () => {
    const r = runCli(['discipline', 'check'])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /declared（纸面） \| verified（实跑）/)
    for (const id of ['A1', 'A5', 'A6', 'A7', 'A9', 'B2', 'B4', 'C1', 'C2', 'D3']) {
      assert.match(r.combined, new RegExp('\\| ' + id + ' \\| '), '缺行: ' + id)
    }
    assert.match(r.combined, /汇总: pass 10 · fail 0 · unreachable 0/)
    assert.match(r.combined, /审计轨 hook_guard 事件在轨/, 'B2 G7 佐证面（审计轨 hook_guard 事件）')
    // 阶段三收官：C1/C2/D3 全回写 mechanical（not_wired 清零）· A5/B2 G7 warn-only 档 partial 直呈（不虚标）
    assert.match(r.combined, /\| C1 \| mechanical \| pass \|/)
    assert.match(r.combined, /\| C2 \| mechanical \| pass \|/)
    assert.match(r.combined, /\| D3 \| mechanical \| pass \| exit 2 吻合期望 2 \|/)
    assert.match(r.combined, /\| A5 \| partial \| pass \|/, 'G7 warn-only 档 declared=partial（诚实口径）')
    assert.match(r.combined, /\| B2 \| partial \| pass \|/)
    assert.match(r.combined, /\| A9 \| mechanical \| pass \| exit 2 吻合期望 2 \|/, 'N2-C 挂接面（lint 入链 failClosed）')
    assert.doesNotMatch(r.combined, /\| fail \|/, '零 fail 行')
  })

  it('负向 ①：declared≠verified（实跑 fail）→ 双列呈现 + exit 2 点名', async () => {
    await withTemp(async (dir) => {
      await seedConsumerYaml(
        dir,
        yamlWithStatement(
          [
            '    trigger:',
            "      command: '$CLI verify --target $FIXTURE --task docs/tasks/active/task_w6dc_pending_v1.md'",
            '      expect: 0',
          ].join('\n'),
        ),
      )
      const r = runCli(['discipline', 'check', '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\| X1 \| mechanical \| fail \| exit 2 ≠ 期望 0 \|/, 'declared vs verified 双列直呈')
      assert.match(r.combined, /discipline check: verified=fail 1 条/)
    })
  })

  it('负向 ②：触发源不可达 → verified=unreachable 分档 + 原因点名 · 不误报 fail · exit 0', async () => {
    await withTemp(async (dir) => {
      await seedConsumerYaml(
        dir,
        yamlWithStatement(
          [
            '    trigger:',
            "      command: 'definitely-not-a-real-binary-w6xyz --foo'",
            '      expect: 0',
          ].join('\n'),
        ),
      )
      const r = runCli(['discipline', 'check', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /\| X1 \| mechanical \| unreachable \| 命令不可达（exit 127/, 'F-W6-05 分档')
      assert.match(r.combined, /汇总: pass 0 · fail 0 · unreachable 1/)
      assert.doesNotMatch(r.combined, /verified=fail/, 'unreachable 不误报 fail')
    })
  })

  it('负向 ③：坏 trigger 形态 → unreachable 原因点名（不静默）· exit 0', async () => {
    await withTemp(async (dir) => {
      await seedConsumerYaml(
        dir,
        yamlWithStatement(
          [
            '    trigger:',
            "      command: '$CLI verify --target $FIXTURE --task docs/tasks/active/task_w6dc_pending_v1.md'",
            '      expect: "two"',
          ].join('\n'),
        ),
      )
      const r = runCli(['discipline', 'check', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /\| X1 \| mechanical \| unreachable \| trigger.expect 缺\/非整数/)
    })
  })

  it('additive 容忍：discipline show 对含 trigger 的 yaml 照常只读输出（loadDiscipline 校验面零变更）', async () => {
    await withTemp(async (dir) => {
      await seedConsumerYaml(
        dir,
        yamlWithStatement(
          [
            '    trigger:',
            "      command: 'true'",
            '      expect: 0',
          ].join('\n'),
        ),
      )
      const r = runCli(['discipline', 'show', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /## statements \(1\)/)
      assert.match(r.combined, /\[mechanical\] X1/)
    })
  })

  it('--json：rows 机读面（declared/verified 双字段 · 契约只增）', async () => {
    await withTemp(async (dir) => {
      await seedConsumerYaml(
        dir,
        yamlWithStatement(
          [
            '    trigger:',
            "      command: 'true'",
            '      expect: 0',
          ].join('\n'),
        ),
      )
      const r = runCli(['discipline', 'check', '--target', dir, '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as {
        command: string
        rows: { id: string; declared: string; verified: string }[]
        pass: number
        fail: number
        unreachable: number
      }
      assert.equal(parsed.command, 'discipline check')
      assert.equal(parsed.rows.length, 1)
      assert.deepEqual(
        { id: parsed.rows[0]!.id, declared: parsed.rows[0]!.declared, verified: parsed.rows[0]!.verified },
        { id: 'X1', declared: 'mechanical', verified: 'pass' },
      )
      assert.equal(parsed.pass, 1)
      assert.equal(parsed.fail, 0)
      assert.equal(parsed.unreachable, 0)
    })
  })
})
