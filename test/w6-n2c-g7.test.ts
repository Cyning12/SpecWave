import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

// 3.0-W6 阶段三 · S6.5 N2-C lint 入 verify 链（active failClosed · done warn 降级 · --allow-lint-fail 留痕）
// + S6.6 G7 执行证据 warn-only（close 对照审计轨 · 不挡 close · 00 裁定诚实口径）。
// 红→绿钉死：N2-C 修复前 lint 不在 verify 链（lint-FAIL task 逃逸率 100% · 基线在案）·
// --allow-lint-fail 修复前走 DEF-011 fail-fast「未知参数」exit 1（cli-flags 拒绝清单在案 · 本波接线后移出）。

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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w6n2c-'))
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

const BT = String.fromCharCode(96)
const REVIEW_OK =
  '# R1 fixture\n\n## 结论\n\nPASS · 零内容阻塞（fixture）\n\n审查结论：fixture 范围与验收全项合规，无阻塞遗留，准予关账。\n'

function taskMd(slug: string, opts?: { dropAcceptance?: boolean; dropSelfCheckBody?: boolean }): string {
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
  ]
  if (!opts?.dropAcceptance) lines.push('## 验收标准', '', '- [x] fixture item', '')
  lines.push(
    '## 失败路径',
    '',
    '| F | Scenario |',
    '|---|----------|',
    '| F1 | fixture |',
    '',
    '### 自检结论（执行者）',
    '',
    opts?.dropSelfCheckBody ? '（待 30 回填）' : '自检已回填：fixture。',
    '',
  )
  return lines.join('\n')
}

async function seedReviewAndInvoke(dir: string, slug: string): Promise<void> {
  await writeRel(dir, 'docs/harness/reviews/task_' + slug + '_audit_R1_2026-09-17.md', REVIEW_OK)
  await writeRel(dir, 'docs/harness/invokes/by-task/' + slug + '/invoke_20260901_10_' + slug + '.md', '# invoke 10 fixture')
}

describe('3.0-W6 S6.5 N2-C · lint 入 verify 链（逃逸率 100%→0% 硬判据 fixture 面）', { concurrency: 1 }, () => {
  it('active lint-FAIL（缺验收标准 E3）→ VERIFY: BLOCKED · task lint FAIL 点名 E3 · exit 2（failClosed）', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w6n_lintbad_v1.md'
      await writeRel(dir, rel, taskMd('w6n_lintbad', { dropAcceptance: true }))
      await seedReviewAndInvoke(dir, 'w6n_lintbad')
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /VERIFY: BLOCKED · task lint FAIL · task_w6n_lintbad_v1\.md/)
      assert.match(r.combined, /\[E3\] 缺 ## 验收标准 节/, 'E 规则逐条点名')
    })
  })

  it('active lint 仅 warnings（W3 占位自检结论）→ 不挡（warnings warn-only 语义不动）', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w6n_warnonly_v1.md'
      await writeRel(dir, rel, taskMd('w6n_warnonly', { dropSelfCheckBody: true }))
      await seedReviewAndInvoke(dir, 'w6n_warnonly')
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /VERIFY: PASS/)
      assert.doesNotMatch(r.combined, /task lint FAIL/)
    })
  })

  it('done lint-FAIL → warn 降级不挡（VERIFY: PASS + warn 点名 + waived[] 留痕 · 不追溯存量）', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/done/task_w6n_donebad_v1.md'
      await writeRel(dir, rel, taskMd('w6n_donebad', { dropAcceptance: true }))
      await seedReviewAndInvoke(dir, 'w6n_donebad')
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /verify: warn · task lint FAIL（\[E3\] 缺 ## 验收标准 节 · done 目录降级不挡 · D-23-W4-TRANSITION 不追溯存量）/)
      assert.match(r.combined, /VERIFY: PASS/)
      const j = runCli(['verify', '--task', rel, '--target', dir, '--json'])
      const parsed = JSON.parse(j.stdout) as { waived?: string[] }
      assert.ok(parsed.waived?.some((w) => w.includes('task lint FAIL（E3') && w.includes('done 目录审计降级 warn')), 'waived[] 留痕')
    })
  })

  it('--allow-lint-fail 真豁免留痕（active lint-FAIL → PASS + 点名 + waived[] · F-W6-09 非静默）', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w6n_waive_v1.md'
      await writeRel(dir, rel, taskMd('w6n_waive', { dropAcceptance: true }))
      await seedReviewAndInvoke(dir, 'w6n_waive')
      const r = runCli(['verify', '--task', rel, '--target', dir, '--allow-lint-fail'])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /verify: 留痕 · task lint FAIL（\[E3\] 缺 ## 验收标准 节）· --allow-lint-fail 豁免生效/)
      assert.match(r.combined, /VERIFY: PASS/)
      const j = runCli(['verify', '--task', rel, '--target', dir, '--allow-lint-fail', '--json'])
      const parsed = JSON.parse(j.stdout) as { waived?: string[] }
      assert.ok(parsed.waived?.some((w) => w.includes('--allow-lint-fail 豁免')), '--json waived[] 留痕')
    })
  })
})

describe('3.0-W6 S6.6 G7 · 执行证据 warn-only（close 对照审计轨）', { concurrency: 1 }, () => {
  // 全合规 close fixture（13 守卫全过 · 参照 cli-task-close-guards seedComplete 口径）
  function closeableTask(slug: string, selfCheckBody: string): string {
    return taskMd(slug)
      .replace('> **状态**：' + BT + 'draft' + BT, '> **状态**：' + BT + 'done' + BT)
      .replace(
        '| **wiki_delta** | ' + BT + 'none' + BT + ' |',
        '| **invoke_retention_profile** | ' + BT + 'default' + BT + ' |\n| **graph_delta** | ' + BT + 'none' + BT + ' |\n| **graph_delta_note** | ' + BT + 'fixture 无图谱增量' + BT + ' |\n| **wiki_delta** | ' + BT + 'none' + BT + ' |\n| **wiki_delta_note** | ' + BT + 'fixture 无 wiki 增量' + BT + ' |\n| **experience_capture** | ' + BT + 'recommended' + BT + ' |\n| **kpi_aggregator** | ' + BT + 'CLOSE' + BT + ' |\n| **close_pr_policy** | ' + BT + 'exempt' + BT + ' |\n| **close_pr_exempt_note** | ' + BT + 'fixture close guards' + BT + ' |',
      )
      .replace('自检已回填：fixture。', selfCheckBody)
      .concat('### KPI（00）\n\nTask_KPI%: 87\n\n### 经验总结\n\nfixture 经验总结：无。\n')
  }
  async function seedCloseable(dir: string, slug: string, selfCheckBody: string): Promise<string> {
    const rel = 'docs/tasks/active/task_' + slug + '_v1.md'
    await writeRel(dir, rel, closeableTask(slug, selfCheckBody))
    await writeRel(dir, 'docs/harness/reviews/task_' + slug + '_audit_R1_2026-09-17.md', REVIEW_OK)
    await writeRel(dir, 'docs/harness/invokes/by-task/' + slug + '/invoke_20260901_10_' + slug + '.md', '# invoke 10')
    await writeRel(dir, 'docs/harness/invokes/by-task/' + slug + '/invoke_20260902_30_40_' + slug + '.md', '# invoke 30+40')
    return rel
  }

  it('负向：自检结论声称 verify 而审计轨无事件 → close warn 点名不挡（exit 0 READY）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedCloseable(dir, 'w6g7_neg', '自检已回填：verify 已跑通（fixture 声称）。')
      const r = runCli(['task', 'close', '--file', rel], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /CLOSE: READY · w6g7_neg/)
      assert.match(r.combined, /close: warn · close_exec_evidence · 自检结论声称 verify 而审计轨无对应 verify PASS 事件（G7 warn-only · 不挡 close/, 'warn 点名呈现 · 不挡 close')
    })
  })

  it('正向：审计轨有对应 verify PASS 事件（先真跑 verify）→ close 无 warn', async () => {
    await withTemp(async (dir) => {
      const rel = await seedCloseable(dir, 'w6g7_pos', '自检已回填：verify 已跑通（fixture 声称）。')
      // 真跑 verify --task（C6 落 verify PASS 事件 · G7 证据面 = 审计轨在轨且 exit_code 吻合）
      const v = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(v.status, 0, v.combined)
      const r = runCli(['task', 'close', '--file', rel], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /CLOSE: READY · w6g7_pos/)
      assert.doesNotMatch(r.combined, /close_exec_evidence/)
    })
  })

  it('诚实边界：自检结论未声称 verify → 不查不 warn（防误报）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedCloseable(dir, 'w6g7_silent', '自检已回填：fixture 未跑门禁（诚实声称）。')
      const r = runCli(['task', 'close', '--file', rel], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /CLOSE: READY · w6g7_silent/)
      assert.doesNotMatch(r.combined, /close_exec_evidence/)
    })
  })
})
