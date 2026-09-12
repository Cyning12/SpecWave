import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

function runCli(args: string[], cwd = KIT) {
  const result = spawnSync(
    process.execPath,
    ['--experimental-strip-types', CLI_TS, ...args],
    { encoding: 'utf8', cwd, env: { ...process.env } },
  )
  return {
    status: result.status,
    combined: `${result.stdout ?? ''}\n${result.stderr ?? ''}`,
  }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-gate-'))
  // 2.2-W2 C1-b：verify/audit/gate-check 的 --target 须落 git 仓内 → fixture seed .git（消费者仓仿真）
  await mkdir(path.join(dir, '.git'), { recursive: true })
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

async function writeRel(root: string, rel: string, body: string): Promise<void> {
  const abs = path.join(root, rel)
  await mkdir(path.dirname(abs), { recursive: true })
  await writeFile(abs, body, 'utf8')
}

function pendingTask(slug: string): string {
  return `# Task ${slug}

> **状态**：\`draft\`

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | \`${slug}\` |
| **test_strategy** | \`recommended\` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-TASK-DRAFT | pending | 22-R1, 30 | fixture |
| HG-AUDIT-R1 | pending | 30 | fixture |

## 验收标准

- [ ] fixture

## failure_paths

| ID | 触发 | 行为 | 可重试 | 可见 |
|----|------|------|--------|------|
| F1 | x | y | 是 | 测 |
`
}

function requiredD5Task(slug: string): string {
  return pendingTask(slug).replace(
    '| **test_strategy** | `recommended` |',
    '| **test_strategy** | `required` |',
  ).replace(
    '| HG-TASK-DRAFT | pending | 22-R1, 30 | fixture |\n| HG-AUDIT-R1 | pending | 30 | fixture |',
    '| HG-TASK-DRAFT | approved | 22-R1, 30 | fixture |\n| HG-AUDIT-R1 | approved | 30 | fixture |',
  )
}

describe('F2 P0 gate semantics (failClosed)', { concurrency: 1 }, () => {
  it('README 中英契约关键字成文', async () => {
    const en = await readFile(path.join(KIT, 'README.md'), 'utf8')
    const zh = await readFile(path.join(KIT, 'README.zh-CN.md'), 'utf8')
    for (const [label, body] of [
      ['EN', en],
      ['ZH', zh],
    ] as const) {
      assert.match(body, /failClosed/, `${label} failClosed`)
      assert.match(body, /Gate BLOCKED|门禁阻断/, `${label} block wording`)
      assert.match(body, /Layered enforcement|分层强制/, `${label} layered`)
      assert.match(body, /\|\s*\*\*2\*\*/, `${label} exit 2 row`)
    }
  })

  it('--help 列出 Exit codes 0/1/2', () => {
    const r = runCli(['--help'])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /Exit codes/)
    assert.match(r.combined, /gate BLOCKED/i)
  })

  it('verify pending → exit 2', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_f2_pending.md'
      await writeRel(dir, rel, pendingTask('f2_pending'))
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /VERIFY: BLOCKED/)
    })
  })

  it('gate-check pending → exit 2', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_f2_gc.md'
      await writeRel(dir, rel, pendingTask('f2_gc'))
      const r = runCli(['gate-check', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
    })
  })

  it('audit pending → exit 2', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_f2_audit.md'
      await writeRel(dir, rel, pendingTask('f2_audit'))
      const r = runCli(['audit', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
    })
  })

  it('D5 required 无制品 → verify/audit exit 2', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_f2_d5.md'
      await writeRel(dir, rel, requiredD5Task('f2_d5'))
      await writeRel(dir, 'docs/harness/reviews/task_f2_d5_audit_R1_20260909.md', '# R1')
      await writeRel(
        dir,
        'docs/harness/invokes/by-task/f2_d5/invoke_20260909_10_f2_d5.md',
        '# invoke 10',
      )
      const v = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(v.status, 2, v.combined)
      assert.match(v.combined, /D5/)
      const a = runCli(['audit', '--task', rel, '--target', dir])
      assert.equal(a.status, 2, a.combined)
      assert.match(a.combined, /D5/)
    })
  })

  it('用法错误 → exit 1（非阻断族）', () => {
    const r = runCli(['gate-check', '--no-such-flag'])
    assert.equal(r.status, 1, r.combined)
  })

  it('check 恒 exit 0', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['check', '--target', dir])
      assert.equal(r.status, 0, r.combined)
    })
  })

  it('S2 拒写 refresh --yes target∈docs/tasks → exit 2（与 F1 联测）', async () => {
    await withTemp(async (dir) => {
      const body = [
        '<!-- cyning-harness:begin -->',
        '- `npx @cyning/harness verify`',
        '<!-- cyning-harness:end -->',
        '',
      ].join('\n')
      await writeRel(dir, 'docs/tasks/x/AGENTS.md', body)
      const target = path.join(dir, 'docs', 'tasks', 'x')
      const r = runCli(['refresh-ide-blocks', '--yes', '--target', target], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /S2|拒写/)
    })
  })
})
