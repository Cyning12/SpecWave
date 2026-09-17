import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

// 3.0-W6 阶段二 · S6.3 G2 reviews 存在性闸回归锁（现码已接线 · 起草发现在案 · 防回退）+
// S6.4 G4 思考轮控制表闸升 failClosed（SPEC 07 ④ signed · D-23-W4-G4-EXIT 兑现 · 验收 #3）。
// 红→绿钉死：G4 修复前 verify --task 链无思考轮步（缺控制表 fixture 曾 PASS · warn-only 现状实证
// 见 cli-w4-gate-wiring W5–W7）；修复后 active BLOCKED 点名 / done warn 降级不挡。

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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w6g4-'))
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

const BT = String.fromCharCode(96) // 反引号（meta 值形态）
const REVIEW_OK =
  '# R1 fixture\n\n## 结论\n\nPASS · 零内容阻塞（fixture）\n\n审查结论：fixture 范围与验收全项合规，无阻塞遗留，准予关账。\n'

type ThinkOpts = { slots?: string[]; table?: boolean; earlyYesNoReason?: boolean }

function taskMd(slug: string, think?: ThinkOpts): string {
  const lines = [
    '# Task ' + slug,
    '',
    '> **状态**：' + BT + 'draft' + BT,
    '',
    '## Harness 元信息',
    '',
    '| 字段 | 值 |',
    '|------|-----|',
    '| **task_slug** | ' + BT + slug + BT + ' |',
    '| **test_strategy** | ' + BT + 'recommended' + BT + ' |',
    '| **wiki_delta** | ' + BT + 'none' + BT + ' |',
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
    '自检已回填：fixture。',
    '',
  ]
  if (think) {
    lines.push('## 思考轮', '')
    for (const s of think.slots ?? []) lines.push('### ' + s + ' · fixture', '', 'x', '')
    if (think.table) {
      lines.push('### 思考轮控制', '', '| 轮 | 结论 | early_stop |', '|----|------|------------|')
      if (think.earlyYesNoReason) lines.push('| R5 | 派工就绪 | **yes** |')
      else lines.push('| R0 | fixture | no |')
      lines.push('')
    }
  }
  return lines.join('\n')
}

const ALL_SLOTS = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5']

/** verify --task 全合规要素（审查文 + pre-30 invoke 10） */
async function seedReviewAndInvoke(dir: string, slug: string): Promise<void> {
  await writeRel(dir, 'docs/harness/reviews/task_' + slug + '_audit_R1_2026-09-17.md', REVIEW_OK)
  await writeRel(dir, 'docs/harness/invokes/by-task/' + slug + '/invoke_20260901_10_' + slug + '.md', '# invoke 10 fixture')
}

describe('3.0-W6 S6.3 G2 · reviews 存在性闸回归锁（已接线 · 防回退）', { concurrency: 1 }, () => {
  it('verify --task 缺 R<n> 审查文 → BLOCKED 点名 exit 2（存在级回归锁）', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w6g2_v1.md'
      await writeRel(dir, rel, taskMd('w6g2'))
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /VERIFY: BLOCKED · missing R<n> review · task_w6g2_v1\.md/)
    })
  })

  it('task close 缺审查文 → CLOSE: BLOCKED · close_review 点名（close 面回归锁）', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w6g2c_v1.md'
      await writeRel(dir, rel, taskMd('w6g2c'))
      const r = runCli(['task', 'close', '--file', rel], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /CLOSE: BLOCKED · w6g2c/)
      assert.match(r.combined, /close_review: missing R<n> review/)
    })
  })

  it('审查文结论不可机读通过 → active BLOCKED 点名（结论级回归锁）', async () => {
    await withTemp(async (dir) => {
      const slug = 'w6g2bad'
      const rel = 'docs/tasks/active/task_' + slug + '_v1.md'
      await writeRel(dir, rel, taskMd(slug))
      await writeRel(dir, 'docs/harness/reviews/task_' + slug + '_audit_R1_2026-09-17.md', '# R1\n\n## 结论\n\nFAIL · 有阻塞\n')
      await writeRel(dir, 'docs/harness/invokes/by-task/' + slug + '/invoke_20260901_10_' + slug + '.md', '# invoke 10')
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
    })
  })
})

describe('3.0-W6 S6.4 G4 · 思考轮控制表闸升 failClosed（active 咬 · done warn 降级）', { concurrency: 1 }, () => {
  it('active 缺控制表（槽位齐）→ BLOCKED 点名「控制表」exit 2', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w6g4a_v1.md'
      await writeRel(dir, rel, taskMd('w6g4a', { slots: ALL_SLOTS }))
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /VERIFY: BLOCKED · 思考轮控制表缺口（缺 控制表 点名）· task_w6g4a_v1\.md/)
    })
  })

  it('active 缺 R1–R5 槽位 → BLOCKED 点名「槽位 R1/R2/R3/R4/R5」exit 2', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w6g4b_v1.md'
      await writeRel(dir, rel, taskMd('w6g4b', { slots: ['R0'], table: true }))
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /思考轮控制表缺口（缺 槽位 R1\/R2\/R3\/R4\/R5 点名）/)
    })
  })

  it('active 控制表 early_stop=yes 缺 reason → BLOCKED 点名「early_stop reason」exit 2', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w6g4c_v1.md'
      await writeRel(dir, rel, taskMd('w6g4c', { slots: ALL_SLOTS, table: true, earlyYesNoReason: true }))
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /思考轮控制表缺口（缺 early_stop reason 点名）/)
    })
  })

  it('done 面缺控制表 → warn 降级不挡（VERIFY: PASS + waived[] 留痕 · 不追溯存量）', async () => {
    await withTemp(async (dir) => {
      const slug = 'w6g4done'
      const rel = 'docs/tasks/done/task_' + slug + '_v1.md'
      await writeRel(dir, rel, taskMd(slug, { slots: ALL_SLOTS }))
      await seedReviewAndInvoke(dir, slug)
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /verify: warn · 思考轮控制表缺口（缺 控制表 · done 目录降级不挡 · D-23-W4-TRANSITION 不追溯存量）/)
      assert.match(r.combined, /VERIFY: PASS · task_w6g4done_v1\.md/)
      const j = runCli(['verify', '--task', rel, '--target', dir, '--json'])
      assert.equal(j.status, 0, j.combined)
      const parsed = JSON.parse(j.stdout) as { verdict: string; waived?: string[] }
      assert.equal(parsed.verdict, 'PASS')
      assert.ok(parsed.waived?.some((w) => w.includes('思考轮控制表缺口') && w.includes('done 目录审计降级 warn')), 'waived[] 留痕')
    })
  })

  it('无思考轮节 → 维持豁免 PASS（SPEC 承载 / bugfix 轨语义不动）', async () => {
    await withTemp(async (dir) => {
      const slug = 'w6g4free'
      const rel = 'docs/tasks/active/task_' + slug + '_v1.md'
      await writeRel(dir, rel, taskMd(slug))
      await seedReviewAndInvoke(dir, slug)
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /VERIFY: PASS/)
      assert.doesNotMatch(r.combined, /思考轮控制表缺口/)
    })
  })

  it('控制表齐备（全槽位 + 表 + 无 yes 缺 reason）→ PASS 正向对照', async () => {
    await withTemp(async (dir) => {
      const slug = 'w6g4ok'
      const rel = 'docs/tasks/active/task_' + slug + '_v1.md'
      await writeRel(dir, rel, taskMd(slug, { slots: ALL_SLOTS, table: true }))
      await seedReviewAndInvoke(dir, slug)
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /VERIFY: PASS · task_w6g4ok_v1\.md/)
    })
  })

  it('G4 判据单一实现源：verify 闸与 task lint W5–W7 同族（evalThinkingRoundStructure 直调一致性）', async () => {
    const { evalThinkingRoundStructure } = await import('../src/checks/lint.ts')
    const noTable = taskMd('x', { slots: ALL_SLOTS })
    const r = evalThinkingRoundStructure(noTable)
    assert.equal(r.hasSection, true)
    assert.deepEqual(r.missingSlots, [])
    assert.equal(r.missingTable, true)
    assert.equal(r.earlyStopNoReason, false)
    const free = evalThinkingRoundStructure(taskMd('y'))
    assert.equal(free.hasSection, false, '无思考轮节豁免')
  })
})
