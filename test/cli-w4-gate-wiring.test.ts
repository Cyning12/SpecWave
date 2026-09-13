import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

// 2.3-W4 · A5+A6 闸语义接线（SPEC 04 修订重签#2 · 评审文 w4_gate_wiring_plan_review_20260913 定稿口径）：
// G2 结论级（close/verify）· G4 W5–W7 warn-only · FULL-reviews 裸 verify · INVOKE-HATS lint-done 帽级 ·
// 过渡豁免数据 docs/harness/legacy-gate-exempt.yaml（D-23-W4-EXEMPT-FORMAT · F-W4-04 四字段留痕）。
// 红→绿钉死：修复前 裸 verify=用法错 exit 1 / close_review 仅存在性 / lint-done 仅 slug 级 / lint 无 W5–W7。

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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w4gw-'))
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

const REVIEW_PASS = '# R1 fixture\n\n## 结论\n\nPASS · 零内容阻塞（fixture）\n'
const REVIEW_NO_PASS = '# R1 fixture\n\n## 结论\n\n| 项 | 判定 |\n|----|------|\n| 仅文档 | 是 |\n'

// verify 面最小 task fixture（闸全 approved · test_strategy=recommended）
function taskMd(slug: string, status = 'draft'): string {
  return [
    `# Task ${slug}`,
    '',
    `> **状态**：\`${status}\``,
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
    '自检已回填：fixture。',
    '',
  ].join('\n')
}

// close 面全齐 fixture（对齐 cli-task-close-guards 口径：KPI/豁免 PR/wiki/graph 全配）
function closeTaskMd(slug: string): string {
  const meta: [string, string][] = [
    ['task_slug', slug],
    ['test_strategy', 'recommended'],
    ['graph_delta', 'none'],
    ['graph_delta_note', 'fixture 无图谱增量'],
    ['wiki_delta', 'none'],
    ['wiki_delta_note', 'fixture 无 wiki 增量'],
    ['experience_capture', 'recommended'],
    ['kpi_aggregator', 'CLOSE'],
    ['close_pr_policy', 'exempt'],
    ['close_pr_exempt_note', 'fixture'],
  ]
  return [
    `# Task ${slug}`,
    '',
    '> **状态**：`done`',
    '',
    '## Harness 元信息',
    '',
    '| 字段 | 值 |',
    '|------|-----|',
    ...meta.map(([k, v]) => `| **${k}** | \`${v}\` |`),
    '',
    '## 验收标准',
    '',
    '- [x] fixture item',
    '',
    '### 自检结论（执行者）',
    '',
    '自检已回填：fixture close。',
    '',
    '### KPI（00）',
    '',
    'Task_KPI%: 87',
    '',
  ].join('\n')
}

async function seedCloseable(dir: string, slug: string, reviewBody: string | null): Promise<string> {
  const rel = `docs/tasks/active/task_${slug}_v1.md`
  await writeRel(dir, rel, closeTaskMd(slug))
  const inv = `docs/harness/invokes/by-task/${slug.replace(/_/g, '-')}`
  await writeRel(dir, `${inv}/invoke_20260901_10_x.md`, '# invoke 10\n')
  await writeRel(dir, `${inv}/invoke_20260902_30_40_x.md`, '# invoke 30+40\n')
  if (reviewBody !== null) {
    await writeRel(dir, `docs/harness/reviews/task_${slug}_audit_R1_20260913.md`, reviewBody)
  }
  return rel
}

describe('2.3-W4 G2 · 结论级 R1 通过判定（verify --task）', { concurrency: 1 }, () => {
  it('active：审查文无通过词 → BLOCKED exit 2；补通过词 → PASS；--allow-no-review 豁结论级留痕', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w4v_ok_v1.md'
      await writeRel(dir, rel, taskMd('w4v_ok'))
      await writeRel(dir, 'docs/harness/invokes/by-task/w4v-ok/invoke_20260901_10_x.md', '# invoke 10\n')
      await writeRel(dir, 'docs/harness/reviews/task_w4v_ok_audit_R1_20260913.md', REVIEW_NO_PASS)
      const bad = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
      // --allow-no-review 同豁结论级（无新旗标 · 留痕）
      const waived = runCli(['verify', '--task', rel, '--target', dir, '--allow-no-review'])
      assert.equal(waived.status, 0, waived.combined)
      assert.match(waived.combined, /--allow-no-review 豁免生效/)
      // 补通过词 → PASS
      await writeRel(dir, 'docs/harness/reviews/task_w4v_ok_audit_R1_20260913.md', REVIEW_PASS)
      const good = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /VERIFY: PASS/)
    })
  })

  it('done 目录降级：结论不可机读 → exit 0 + warn 行（D-23-W4-TRANSITION 不追溯存量）', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/done/task_w4v_legacy_v1.md'
      await writeRel(dir, rel, taskMd('w4v_legacy', 'done'))
      await writeRel(dir, 'docs/harness/invokes/by-task/w4v-legacy/invoke_20260901_10_x.md', '# invoke 10\n')
      await writeRel(dir, 'docs/harness/reviews/task_w4v_legacy_audit_R1_20260901.md', REVIEW_NO_PASS)
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /verify: warn · task_w4v_legacy_audit_R1_20260901\.md 结论不可机读通过/)
      assert.match(r.combined, /VERIFY: PASS/)
    })
  })
})

describe('2.3-W4 G2 · 结论级（task close）', { concurrency: 1 }, () => {
  it('审查文无通过词 → close BLOCKED 点名 close_review；--allow-no-review 豁免留痕 → READY', async () => {
    await withTemp(async (dir) => {
      const rel = await seedCloseable(dir, 'w4c_ok', REVIEW_NO_PASS)
      const bad = runCli(['task', 'close', '--file', rel], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /CLOSE: BLOCKED/)
      assert.match(bad.combined, /close_review: 审查文结论不可机读通过/)
      const waived = runCli(['task', 'close', '--file', rel, '--allow-no-review'], dir)
      assert.equal(waived.status, 0, waived.combined)
      assert.match(waived.combined, /留痕 · close_review/)
      assert.match(waived.combined, /CLOSE: READY/)
      // 补通过词 → READY（无豁免）
      await writeRel(dir, 'docs/harness/reviews/task_w4c_ok_audit_R1_20260913.md', REVIEW_PASS)
      const good = runCli(['task', 'close', '--file', rel], dir)
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /CLOSE: READY/)
    })
  })
})

describe('2.3-W4 G4 · 思考轮结构 W5–W7（warn-only 过渡 · exit 码不变）', { concurrency: 1 }, () => {
  const base = (extra: string[]): string =>
    [
      '# Task w4g',
      '',
      '> **状态**：`draft`',
      '',
      '## Harness 元信息',
      '',
      '| 字段 | 值 |',
      '|------|-----|',
      '| **task_slug** | `w4g` |',
      '| **test_strategy** | `recommended` |',
      '| **wiki_delta** | `none` |',
      '| **wiki_delta_note** | `fixture` |',
      '',
      '## 验收标准',
      '',
      '- [ ] x',
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
      ...extra,
      '',
    ].join('\n')

  it('有节缺 R2–R5 槽位 → W5 warn · exit 0', async () => {
    await withTemp(async (dir) => {
      const rel = await writeRel(
        dir,
        'docs/tasks/active/task_w4g_v1.md',
        base(['## 思考轮（10-task）', '', '### R0 · 证据', '', 'x', '', '### R1 · 范围', '', 'y']),
      )
      const r = runCli(['task', 'lint', '--file', rel], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /\[W5\]/)
      assert.match(r.combined, /缺 R2\/R3\/R4\/R5/)
      assert.match(r.combined, /LINT: PASS/)
    })
  })

  it('有节全槽但缺控制表 → W6 warn；early_stop=yes 无 reason → W7 warn', async () => {
    await withTemp(async (dir) => {
      const slots = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5'].flatMap((x) => [`### ${x}`, '', 'x', ''])
      const rel = await writeRel(dir, 'docs/tasks/active/task_w4g_v1.md', base(['## 思考轮（10-task）', '', ...slots]))
      const r = runCli(['task', 'lint', '--file', rel], dir)
      assert.equal(r.status, 0, r.combined)
      assert.doesNotMatch(r.combined, /\[W5\]/)
      assert.match(r.combined, /\[W6\]/)
      // 补控制表含 yes 但无 reason → W7
      const withYes = base([
        '## 思考轮（10-task）',
        '',
        ...slots,
        '### 思考轮控制',
        '',
        '| 轮 | 结论 | early_stop |',
        '|----|------|------------|',
        '| R5 | 派工就绪 | **yes** |',
      ])
      await writeRel(dir, 'docs/tasks/active/task_w4g_v1.md', withYes)
      const r2 = runCli(['task', 'lint', '--file', rel], dir)
      assert.equal(r2.status, 0, r2.combined)
      assert.doesNotMatch(r2.combined, /\[W6\]/)
      assert.match(r2.combined, /\[W7\]/)
    })
  })

  it('无思考轮节 → 维持 W4（不新增 W5–W7 · SPEC 承载/bugfix 豁免口径回归）', async () => {
    await withTemp(async (dir) => {
      const rel = await writeRel(dir, 'docs/tasks/active/task_w4g_v1.md', base([]))
      const r = runCli(['task', 'lint', '--file', rel], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /\[W4\]/)
      assert.doesNotMatch(r.combined, /\[W5\]|\[W6\]|\[W7\]/)
    })
  })
})

describe('2.3-W4 INVOKE-HATS · lint-done 帽级（failClosed + 数据豁免）', { concurrency: 1 }, () => {
  it('done task 缺 10/40 帽 → FAIL exit 2 点名；入豁免 → PASS + 留痕回显；缺字段条目无效', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'docs/tasks/done/task_w4l_ok_v1.md', taskMd('w4l_ok', 'done'))
      await writeRel(dir, 'docs/harness/invokes/by-task/w4l-ok/invoke_20260901_30_x.md', '# invoke 30\n')
      const bad = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /missing invoke hats: 10,40/)
      assert.match(bad.combined, /LINT-DONE: FAIL · missing 0 · hat-gaps 1/)
      // 缺字段豁免条目 → 无效（不豁免）+ warn
      await writeRel(
        dir,
        'docs/harness/legacy-gate-exempt.yaml',
        ['version: "1"', 'invoke_hats:', '  - slug: w4l_ok', '    reason: 缺 date/authorized_by', ''].join('\n'),
      )
      const invalid = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(invalid.status, 2, invalid.combined)
      assert.match(invalid.combined, /豁免条目无效（不豁免）/)
      // 四字段齐 → 豁免生效 PASS + 留痕（谁/何时/理由）
      await writeRel(
        dir,
        'docs/harness/legacy-gate-exempt.yaml',
        [
          'version: "1"',
          'invoke_hats:',
          '  - slug: w4l_ok',
          '    reason: 2.3.0 前历史关账（fixture）',
          "    date: '2026-09-13'",
          '    authorized_by: 00（fixture）',
          '',
        ].join('\n'),
      )
      const good = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /豁免命中留痕: w4l_ok（2\.3\.0 前历史关账（fixture） · 2026-09-13 · 00（fixture））/)
      assert.match(good.combined, /LINT-DONE: PASS/)
    })
  })
})

describe('2.3-W4 FULL-reviews · 裸 verify（仓级 reviews 扫描）', { concurrency: 1 }, () => {
  it('active 缺审查文仅信息报告不闸；done 结论不可机读 → BLOCKED；--json 键集含 reviews_scan', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'docs/tasks/active/task_w4b_draft_v1.md', taskMd('w4b_draft'))
      await writeRel(dir, 'docs/tasks/done/task_w4b_noparse_v1.md', taskMd('w4b_noparse', 'done'))
      await writeRel(dir, 'docs/harness/reviews/task_w4b_noparse_audit_R1_20260901.md', REVIEW_NO_PASS)
      const r = runCli(['verify', '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /warn: active 缺 R<n> 审查文（draft 期合法 · 不闸）: w4b_draft/)
      assert.match(r.combined, /task_w4b_noparse_v1\.md · 审查文结论不可机读通过/)
      assert.match(r.combined, /VERIFY: BLOCKED · 仓级 reviews 缺口 1/)
      // --json：键集含 reviews_scan · exitCode=2
      const j = runCli(['verify', '--target', dir, '--json'])
      assert.equal(j.status, 2, j.combined)
      const payload = JSON.parse(j.stdout) as {
        command: string
        verdict: string
        exitCode: number
        reviews_scan: { done: number; active: number; active_missing_reviews: string[]; gaps: unknown[] }
      }
      assert.equal(payload.command, 'verify')
      assert.equal(payload.verdict, 'BLOCKED')
      assert.equal(payload.exitCode, 2)
      assert.equal(payload.reviews_scan.done, 1)
      assert.equal(payload.reviews_scan.active, 1)
      assert.deepEqual(payload.reviews_scan.active_missing_reviews, ['w4b_draft'])
      assert.equal(payload.reviews_scan.gaps.length, 1)
      // 修复 done 缺口（补通过词）→ PASS（active 缺审查文仍仅 warn）
      await writeRel(dir, 'docs/harness/reviews/task_w4b_noparse_audit_R1_20260901.md', REVIEW_PASS)
      const good = runCli(['verify', '--target', dir])
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /VERIFY: PASS（裸 verify · 仓级 reviews 扫描）/)
    })
  })
})
