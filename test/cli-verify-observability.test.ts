import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises'
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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-vobs-'))
  // 2.2-W2 C1-b：verify 的 --target 须落 git 仓内 → fixture seed .git（消费者仓仿真）
  await mkdir(path.join(dir, '.git'), { recursive: true })
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

function taskMd(slug: string): string {
  return [
    `# Task ${slug}`,
    '',
    '> **状态**：`draft`',
    '',
    '## Harness 元信息',
    '',
    '| 字段 | 值 |',
    '|------|-----|',
    `| **task_slug** | \`${slug}\` |`,
    '| **test_strategy** | `recommended` |',
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
    '（30/40 回填）',
    '',
  ].join('\n')
}

const TASK_REL = 'docs/tasks/active/task_vobs_ok_v1.md'
const REVIEW_REL = 'docs/harness/reviews/task_vobs_ok_audit_R1_2026-09-11.md'

async function seedTask(dir: string): Promise<void> {
  await writeRel(dir, TASK_REL, taskMd('vobs_ok'))
  // DEF-003 T5：pre-30 invoke hats（default required ∩ {10,20,00} = {10} 须落盘才 PASS）
  await writeRel(dir, 'docs/harness/invokes/by-task/vobs_ok/invoke_20260901_10_vobs_ok.md', '# invoke 10 fixture')
}

// 2.2-W3 C2（安全设计 §7.2 · SPEC 02 §W3）：verify --json 只增不改补
// traceId / exitCode / source / injectedFiles 四字段。
// 红→绿钉死：补字段前四字段缺失；契约只增不改由「既有键集 + 新增四键」diff 级断言钉死。
const BASE_KEYS = ['command', 'target', 'task', 'blocked', 'verdict'] as const
const OBS_KEYS = ['traceId', 'exitCode', 'source', 'injectedFiles'] as const

function assertObsFields(payload: Record<string, unknown>, expectedExitCode: number, actualStatus: number | null): void {
  // ① traceId：单次运行标识（非空字符串）
  assert.equal(typeof payload.traceId, 'string', `traceId 须为字符串: ${JSON.stringify(payload)}`)
  assert.ok((payload.traceId as string).length > 0, 'traceId 不得为空')
  // ② exitCode：与进程实际退出码一致（同源）
  assert.equal(payload.exitCode, expectedExitCode, 'exitCode 字段值须与判定一致')
  assert.equal(payload.exitCode, actualStatus, 'exitCode 字段值须与进程实际退出码一致')
  // ③ source：判定来源（package / override）
  assert.ok(
    payload.source === 'package' || payload.source === 'override',
    `source 须为 package|override: ${JSON.stringify(payload.source)}`,
  )
  // ④ injectedFiles：注入文件清单（相对路径数组 · C3 不泄绝对路径）
  assert.ok(Array.isArray(payload.injectedFiles), `injectedFiles 须为数组: ${JSON.stringify(payload)}`)
  for (const f of payload.injectedFiles as unknown[]) {
    assert.equal(typeof f, 'string', 'injectedFiles 元素须为字符串')
    assert.equal(path.isAbsolute(f as string), false, `injectedFiles 不得含绝对路径: ${f}`)
  }
}

describe('2.2-W3 C2 · verify --json 可观测四字段', { concurrency: 1 }, () => {
  it('PASS 态：四字段存在 · exitCode=0=进程退出码 · 键集=既有五键+新增四键', async () => {
    await withTemp(async (dir) => {
      await seedTask(dir)
      await writeRel(dir, REVIEW_REL, '# R1 fixture')
      const r = runCli(['verify', '--task', TASK_REL, '--target', dir, '--json'])
      assert.equal(r.status, 0, r.combined)
      const payload = JSON.parse(r.stdout) as Record<string, unknown>
      assertObsFields(payload, 0, r.status)
      // 契约只增不改（diff 级钉死）：无 waived/wiki_lint 旗标时键集 = 既有五键 + 新增四键
      assert.deepEqual(Object.keys(payload).sort(), [...BASE_KEYS, ...OBS_KEYS].sort())
    })
  })

  it('BLOCKED 态（缺 R<n> 审查文）：exitCode=2=进程退出码 · 四字段仍在', async () => {
    await withTemp(async (dir) => {
      await seedTask(dir)
      const r = runCli(['verify', '--task', TASK_REL, '--target', dir, '--json'])
      assert.equal(r.status, 2, r.combined)
      const payload = JSON.parse(r.stdout) as Record<string, unknown>
      assert.equal(payload.blocked, true)
      assert.equal(payload.verdict, 'BLOCKED')
      assertObsFields(payload, 2, r.status)
    })
  })

  it('既有字段回归不变：command/target/task/blocked/verdict 语义保持', async () => {
    await withTemp(async (dir) => {
      await seedTask(dir)
      await writeRel(dir, REVIEW_REL, '# R1 fixture')
      const r = runCli(['verify', '--task', TASK_REL, '--target', dir, '--json'])
      assert.equal(r.status, 0, r.combined)
      const payload = JSON.parse(r.stdout) as Record<string, unknown>
      assert.equal(payload.command, 'verify')
      assert.equal(payload.target, dir)
      assert.equal(payload.task, TASK_REL)
      assert.equal(payload.blocked, false)
      assert.equal(payload.verdict, 'PASS')
      // 未传豁免/追加闸旗标 → waived / wiki_lint 不出现（既有条件字段语义不变）
      assert.equal('waived' in payload, false)
      assert.equal('wiki_lint' in payload, false)
    })
  })

  it('traceId 为单次运行标识：两次运行取值不同', async () => {
    await withTemp(async (dir) => {
      await seedTask(dir)
      await writeRel(dir, REVIEW_REL, '# R1 fixture')
      const r1 = runCli(['verify', '--task', TASK_REL, '--target', dir, '--json'])
      const r2 = runCli(['verify', '--task', TASK_REL, '--target', dir, '--json'])
      assert.equal(r1.status, 0, r1.combined)
      assert.equal(r2.status, 0, r2.combined)
      const t1 = (JSON.parse(r1.stdout) as Record<string, unknown>).traceId
      const t2 = (JSON.parse(r2.stdout) as Record<string, unknown>).traceId
      assert.notEqual(t1, t2, 'traceId 须逐次运行生成（运行级标识）')
    })
  })

  it('--spec 模式同为 verify --json 报告：四字段存在 · exitCode=0', async () => {
    await withTemp(async (dir) => {
      const spec = [
        '# SPEC fixture',
        '',
        '## Harness 元信息',
        '',
        '| 字段 | 值 |',
        '|------|-----|',
        '| **skip_spec_audit** | `true` |',
        '',
      ].join('\n')
      await writeRel(dir, 'docs/spec/SPEC-vobs-fixture_v1.md', spec)
      const r = runCli(['verify', '--spec', 'docs/spec/SPEC-vobs-fixture_v1.md', '--target', dir, '--json'])
      assert.equal(r.status, 0, r.combined)
      const payload = JSON.parse(r.stdout) as Record<string, unknown>
      assert.equal(payload.command, 'verify')
      assert.equal(payload.verdict, 'PASS')
      assertObsFields(payload, 0, r.status)
    })
  })
})
