import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
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

// 2.4-W2 S1·N=20：结论节须含实质签收内容（去通过词后非空白 ≥20 字符）· 本 fixture substance=42
const REVIEW_PASS = '# R1 fixture\n\n## 结论\n\nPASS · 零内容阻塞（fixture）\n\n审查结论：fixture 范围与验收全项合规，无阻塞遗留，准予关账。\n'
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
    '| **wiki_delta** | `none` |', // 3.0-W6 N2-C 登记项：lint 入链后 fixture 须 lint-clean（E8）
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
          // 3.0-W4 A1 重锚（20 审 advisory A1 ① · 与 loader 同 commit）：00（fixture）不过 A1 三元判 → 合规形态
          '    authorized_by: 00（2026-09-13 fixture 授权）',
          '',
        ].join('\n'),
      )
      const good = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /豁免命中留痕: w4l_ok（2\.3\.0 前历史关账（fixture） · 2026-09-13 · 00（2026-09-13 fixture 授权））/)
      assert.match(good.combined, /LINT-DONE: PASS/)
    })
  })
})

describe('2.4-W6 N14 · lint-done slug 口径统一（meta 优先 · 文件名兜底 · D-24-W6-N14 · 验收报告 §3.O）', { concurrency: 1 }, () => {
  it('文件名 slug ≠ meta slug：无豁免时缺口点名 meta slug（归一后 · 声明口径）；豁免按 meta slug 命中 → PASS + 留痕（修复前按文件名 slug 永不命中）', async () => {
    await withTemp(async (dir) => {
      // 文件名 task_file_name_slug_v1.md（文件名 slug = file-name-slug）· meta task_slug = meta_slug_x（归一 meta-slug-x）
      await writeRel(dir, 'docs/tasks/done/task_file_name_slug_v1.md', taskMd('meta_slug_x', 'done'))
      // 无豁免 → FAIL · 缺口点名为 meta slug（声明口径 = meta 优先）· 不得点名文件名 slug
      const noExempt = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(noExempt.status, 2, noExempt.combined)
      assert.match(noExempt.combined, /- meta-slug-x/)
      assert.doesNotMatch(noExempt.combined, /file-name-slug/)
      // 四字段豁免（slug = meta_slug_x）→ 豁免命中留痕 · PASS（与帽级判同一取值口径）
      await writeRel(
        dir,
        'docs/harness/legacy-gate-exempt.yaml',
        [
          'version: "1"',
          'invoke_hats:',
          '  - slug: meta_slug_x',
          '    reason: N14 fixture 豁免（meta slug 口径）',
          "    date: '2026-09-14'",
          // 3.0-W4 A1 重锚（20 审 advisory A1 ② · 与 loader 同 commit）
          '    authorized_by: 00（2026-09-14 fixture 授权）',
          '',
        ].join('\n'),
      )
      const good = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /豁免命中留痕: meta_slug_x（N14 fixture 豁免（meta slug 口径） · 2026-09-14 · 00（2026-09-14 fixture 授权））/)
      assert.match(good.combined, /LINT-DONE: PASS/)
    })
  })

  it('文件名 slug ≠ meta slug · invoke 目录按 meta slug 落 → 存在性/帽级双命中 PASS（不再裂成 missing+extra）', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'docs/tasks/done/task_file_name_slug_v1.md', taskMd('meta_slug_x', 'done'))
      for (const hat of ['10', '30', '40']) {
        await writeRel(dir, `docs/harness/invokes/by-task/meta-slug-x/invoke_20260914_${hat}_x.md`, `# invoke ${hat}\n`)
      }
      const r = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /done slugs: 1 · invoke dirs: 1/)
      assert.doesNotMatch(r.combined, /file-name-slug/)
      assert.match(r.combined, /LINT-DONE: PASS/)
    })
  })

  it('生产数据零行为变化回归：真实仓 lint-done PASS（命名合规 · meta==文件名 slug）', () => {
    const r = runCli(['task', 'lint-done'])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /LINT-DONE: PASS/)
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

describe('2.3.1 N11 [P1] · 结论级闸强制结论节（禁止回退全文 · 验收报告 §3.L A2 形态）', { concurrency: 1 }, () => {
  const REVIEW_PASS_NO_SECTION = '# R1 fixture\n\n本次审查通过\n'
  it('A2 形态：只写「通过」二字无结论节 → BLOCKED exit 2；结论节内通过词 → PASS；通过+未通过 仍红（负向守卫不破）', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_n11_a2_v1.md'
      await writeRel(dir, rel, taskMd('n11_a2'))
      await writeRel(dir, 'docs/harness/invokes/by-task/n11-a2/invoke_20260901_10_x.md', '# invoke 10\n')
      // A2：通过词在全文但无结论/签收节 → 禁止回退全文 → 红
      await writeRel(dir, 'docs/harness/reviews/task_n11_a2_audit_R1_20260914.md', REVIEW_PASS_NO_SECTION)
      const bad = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
      assert.match(bad.combined, /无结论/)
      // 通过词落结论节内 → 绿
      await writeRel(dir, 'docs/harness/reviews/task_n11_a2_audit_R1_20260914.md', REVIEW_PASS)
      const good = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /VERIFY: PASS/)
      // 结论节内 通过+未通过 → 负向守卫仍红
      await writeRel(dir, 'docs/harness/reviews/task_n11_a2_audit_R1_20260914.md', '# R1 fixture\n\n## 结论\n\n整体通过但局部未通过项待修\n')
      const neg = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(neg.status, 2, neg.combined)
      assert.match(neg.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
    })
  })

  it('task close 同口径：无结论节 → CLOSE BLOCKED 点名 close_review', async () => {
    await withTemp(async (dir) => {
      const rel = await seedCloseable(dir, 'n11c_a2', '# R1 fixture\n\n通过\n')
      const bad = runCli(['task', 'close', '--file', rel], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /CLOSE: BLOCKED/)
      assert.match(bad.combined, /close_review: 审查文结论不可机读通过/)
      await writeRel(dir, 'docs/harness/reviews/task_n11c_a2_audit_R1_20260913.md', REVIEW_PASS)
      const good = runCli(['task', 'close', '--file', rel], dir)
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /CLOSE: READY/)
    })
  })
})

describe('2.4-W2 · 结论级闸强度增强（S1·N=20 · 评审文 w2_conclusion_gate_strength_review_20260914 §4 定档）', { concurrency: 1 }, () => {
  // 修复前真红留证：下列薄结论节形态在 2.3.1 码下 verify exit 0（残余缺口复现 · 证据见 task 自检结论节）
  async function seedW2(dir: string, slug: string, review: string, done = false): Promise<string> {
    const rel = `docs/tasks/${done ? 'done' : 'active'}/task_${slug}_v1.md`
    await writeRel(dir, rel, taskMd(slug, done ? 'done' : 'draft'))
    await writeRel(dir, `docs/harness/invokes/by-task/${slug.replace(/_/g, '-')}/invoke_20260901_10_x.md`, '# invoke 10\n')
    await writeRel(dir, `docs/harness/reviews/task_${slug}_audit_R1_20260914.md`, review)
    return rel
  }

  it('① A2 收窄形态：结论节只写「通过」二字 → BLOCKED exit 2 点名 S1·N=20', async () => {
    await withTemp(async (dir) => {
      const rel = await seedW2(dir, 'w2_a2', '# R1 fixture\n\n## 结论\n\n通过\n')
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
      assert.match(r.combined, /内容量不足（去通过词后非空白 4<20 字符/)
      assert.match(r.combined, /2\.4-W2 S1·N=20/)
    })
  })

  it('② 单通行词变体：## 签收\\nPASS / ## 结论\\n零阻塞 → BLOCKED exit 2', async () => {
    await withTemp(async (dir) => {
      const rel = await seedW2(dir, 'w2_var', '# R1 fixture\n\n## 签收\n\nPASS\n')
      const a = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(a.status, 2, a.combined)
      assert.match(a.combined, /内容量不足/)
      await writeRel(dir, 'docs/harness/reviews/task_w2_var_audit_R1_20260914.md', '# R1 fixture\n\n## 结论\n\n零阻塞\n')
      const b = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(b.status, 2, b.combined)
      assert.match(b.combined, /内容量不足/)
    })
  })

  it('③ 合规正向：实质结论节 exit 0 · 存量最低容量代表样本（2_1_1-host-tools-ux w1 审查文原文 · substance=40）回归 exit 0', async () => {
    await withTemp(async (dir) => {
      const rel = await seedW2(dir, 'w2_ok', '# R1 fixture\n\n## 结论\n\nPASS · 零内容阻塞。审查项逐条核对，范围与验收一致，无阻塞遗留，准予关账。\n')
      const good = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /VERIFY: PASS/)
      // 存量代表样本：docs/harness/reviews/task_2_1_1_host_tools_ux_w1_sticky_audit_R1_20260910.md 原文（存量 48 份中节内容量最低档 min=40）
      const legacy = [
        '# 20-task-audit · R1 · `2_1_1-host-tools-ux-w1-sticky`',
        '',
        '> **hat**：20-task-audit · **日期**：2026-09-10 · **结论**：**PASS**（可签 `HG-AUDIT-R1`）',
        '',
        '## 核对',
        '',
        '| 项 | 结论 |',
        '|----|------|',
        '| 范围/非范围清晰 | PASS · 粘性 + `--tools all` |',
        '',
        '## 结论',
        '',
        '**PASS** · 建议 `HG-AUDIT-R1=approved` · 派 **30**。',
        '',
      ].join('\n')
      await writeRel(dir, 'docs/harness/reviews/task_w2_ok_audit_R1_20260914.md', legacy)
      const reg = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(reg.status, 0, reg.combined)
      assert.match(reg.combined, /VERIFY: PASS/)
    })
  })

  it('④ 阈值边界探针：去通过词后恰 19 → exit 2 · 恰 20 → exit 0（N=20 两侧钉死）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedW2(dir, 'w2_edge', '# R1 fixture\n\n## 结论\n\n通过 abcdefghijklmno\n')
      const under = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(under.status, 2, under.combined)
      assert.match(under.combined, /内容量不足（去通过词后非空白 19<20 字符/)
      // 3.0-W4 登记（验收 #11）：恰 20 侧由裸 ASCII 填充重锚为语义合规等长文本（去通过词后非空白恰 20 ·
      // 裸填充形态已被 NEW-5 档 M 逐出合规面 —— 即本波 ① 号负向 fixture 的攻击面本体）；恰 19 侧不动（仍内容量不足先闸）。
      await writeRel(dir, 'docs/harness/reviews/task_w2_edge_audit_R1_20260914.md', '# R1 fixture\n\n## 结论\n\n本审查核对验收范围，通过。abcde\n')
      const at = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(at.status, 0, at.combined)
      assert.match(at.combined, /VERIFY: PASS/)
    })
  })

  it('⑤ 否定守卫回归：通过词 + 实质内容 + 未否定「退回」→ 仍 exit 2（守卫优先 · 2.3-W4 B2 形态不回退）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedW2(dir, 'w2_neg', '# R1 fixture\n\n## 结论\n\n整体通过，但有一处需退回修改后再审，审查项逐条核对完毕。\n')
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
      assert.match(r.combined, /含否定结论词/)
    })
  })

  it('done 目录降级不回退：薄结论节 done task → exit 0 + warn（D-24-W2-NO-RETRO 不追溯存量）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedW2(dir, 'w2_legacy', '# R1 fixture\n\n## 结论\n\n通过\n', true)
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /verify: warn · task_w2_legacy_audit_R1_20260914\.md 结论不可机读通过/)
      assert.match(r.combined, /VERIFY: PASS/)
    })
  })
})

describe('2.4.1 NEW-1 [P1] · 否定守卫语义判据放宽（B/D/E 形态 · 验收报告-SpecWave-2.4.0 §3）', { concurrency: 1 }, () => {
  // 红测先行：2.4.0 码 REVIEW_NEG_RE 要求否定词字面连续（不通过/未通过 · 仅中文），
  // 插入任意字符即断链 —— 修复前 B/D/E 三形态均误判 PASS（exit 0）· 复现报告探针表。
  async function seedNew1(dir: string, slug: string, review: string): Promise<string> {
    const rel = `docs/tasks/active/task_${slug}_v1.md`
    await writeRel(dir, rel, taskMd(slug))
    await writeRel(dir, `docs/harness/invokes/by-task/${slug.replace(/_/g, '-')}/invoke_20260901_10_x.md`, '# invoke 10\n')
    await writeRel(dir, `docs/harness/reviews/task_${slug}_audit_R1_20260914.md`, review)
    return rel
  }
  const NEG = (line: string): string => `# R1 fixture\n\n## 结论\n\n${line}\n`

  it('B 形态「不予通过」→ BLOCKED exit 2（否定先于通过 · 插字断链封堵）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedNew1(dir, 'new1_b', NEG('本任务不予通过。缺陷清单见探针表 B 行，须修复后重审再签。'))
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
      assert.match(r.combined, /含否定结论词/)
    })
  })

  it('D 形态「不 通过」（空格断链）→ BLOCKED exit 2', async () => {
    await withTemp(async (dir) => {
      const rel = await seedNew1(dir, 'new1_d', NEG('本任务不 通过。缺陷清单见探针表 D 行（空格断链形态），须修复后重审再签。'))
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
      assert.match(r.combined, /含否定结论词/)
    })
  })

  it('E 形态「NO PASS」（英文否定）→ BLOCKED exit 2；Reject 同拦', async () => {
    await withTemp(async (dir) => {
      const rel = await seedNew1(dir, 'new1_e', NEG('NO PASS. Defects listed in probe table row E, must be reworked before signoff.'))
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
      assert.match(r.combined, /含否定结论词/)
      await writeRel(dir, 'docs/harness/reviews/task_new1_e_audit_R1_20260914.md', NEG('Rejected: defect list pending rework, do not sign off this round.'))
      const r2 = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r2.status, 2, r2.combined)
      assert.match(r2.combined, /含否定结论词/)
    })
  })

  it('task close 同口径：B 形态 → CLOSE BLOCKED 点名 close_review', async () => {
    await withTemp(async (dir) => {
      const rel = await seedCloseable(dir, 'new1_close', NEG('本任务不予通过。缺陷清单待修，close 面与裸 verify 同用 evalReviewConclusion，须同病同治。'))
      const r = runCli(['task', 'close', '--file', rel], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /CLOSE: BLOCKED/)
      assert.match(r.combined, /close_review: 审查文结论不可机读通过/)
    })
  })

  it('对照零回退：A（实质通过）exit 0 · C（未通过字面连续）exit 2 · F（只写通过二字）exit 2（S1·N=20 前闸）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedNew1(dir, 'new1_ctrl', NEG('PASS · 零内容阻塞。审查项逐条核对，范围与验收一致，无阻塞遗留，准予关账。'))
      const a = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(a.status, 0, a.combined)
      await writeRel(dir, 'docs/harness/reviews/task_new1_ctrl_audit_R1_20260914.md', NEG('整体通过但局部未通过项待修，审查项逐条核对完毕。'))
      const c = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(c.status, 2, c.combined)
      await writeRel(dir, 'docs/harness/reviews/task_new1_ctrl_audit_R1_20260914.md', NEG('通过\n'))
      const f = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(f.status, 2, f.combined)
      assert.match(f.combined, /内容量不足/)
    })
  })
})

describe('2.4.2 R-2 [P2] · 否定词表补 not\\s*pass + 同句共现窗口（验收报告-SpecWave-2.4.1 §3.1 行 G/I/J · §4 R-4 形态）', { concurrency: 1 }, () => {
  // 红测先行：2.4.1 码（不.{0,3}通过|未.{0,3}通过|no\s*pass|reject）—— G「NOT PASS」未覆盖 ·
  // I/J 插 4 字超 {0,3} 窗 → 三形态修复前误判 PASS（exit 0）。
  async function seedR2(dir: string, slug: string, review: string): Promise<string> {
    const rel = `docs/tasks/active/task_${slug}_v1.md`
    await writeRel(dir, rel, taskMd(slug))
    await writeRel(dir, `docs/harness/invokes/by-task/${slug.replace(/_/g, '-')}/invoke_20260901_10_x.md`, '# invoke 10\n')
    await writeRel(dir, `docs/harness/reviews/task_${slug}_audit_R1_20260915.md`, review)
    return rel
  }
  const NEG = (line: string): string => `# R1 fixture\n\n## 结论\n\n${line}\n`
  const assertBlocked = async (dir: string, rel: string): Promise<void> => {
    const r = runCli(['verify', '--task', rel, '--target', dir])
    assert.equal(r.status, 2, r.combined)
    assert.match(r.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
    assert.match(r.combined, /含否定结论词/)
  }

  it('G 形态「NOT PASS」（英文大写否定）→ BLOCKED exit 2', async () => {
    await withTemp(async (dir) => {
      const rel = await seedR2(dir, 'r2_g', NEG('NOT PASS. Defects listed in probe table row G, rework required before any signoff.'))
      await assertBlocked(dir, rel)
    })
  })

  it('I 形态「不最终予以通过」（插 4 字超旧窗）→ BLOCKED exit 2（同句共现窗口）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedR2(dir, 'r2_i', NEG('本任务不最终予以通过。缺陷清单见探针表 I 行，须修复后重审再签。'))
      await assertBlocked(dir, rel)
    })
  })

  it('J 形态「未能够予以通过」（插 4 字超旧窗）→ BLOCKED exit 2；task close 同口径', async () => {
    await withTemp(async (dir) => {
      const rel = await seedR2(dir, 'r2_j', NEG('本任务未能够予以通过。缺陷清单见探针表 J 行，须修复后重审再签。'))
      await assertBlocked(dir, rel)
      const rel2 = await seedCloseable(dir, 'r2_jc', NEG('本任务不最终予以通过。缺陷清单待修，close 面与裸 verify 同用 evalReviewConclusion。'))
      const c = runCli(['task', 'close', '--file', rel2], dir)
      assert.equal(c.status, 2, c.combined)
      assert.match(c.combined, /CLOSE: BLOCKED/)
      assert.match(c.combined, /close_review: 审查文结论不可机读通过/)
    })
  })

  it('对照零回退：A PASS · B/D/E/L（不予通过/不 通过/NO PASS/rejected）FAIL · F FAIL · M（否定+通过并存）FAIL', async () => {
    await withTemp(async (dir) => {
      const rel = await seedR2(dir, 'r2_ctrl', NEG('PASS · 零内容阻塞。审查项逐条核对，范围与验收一致，无阻塞遗留，准予关账。'))
      const a = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(a.status, 0, a.combined)
      const cases: Array<[string, string]> = [
        ['B', '本任务不予通过。缺陷清单见探针表 B 行，须修复后重审再签。'],
        ['D', '本任务不 通过。缺陷清单见探针表 D 行（空格断链形态），须修复后重审再签。'],
        ['E', 'NO PASS. Defects listed in probe table row E, must be reworked before signoff.'],
        ['L', 'Rejected: defect list pending rework, do not sign off this round.'],
        ['M', '整体通过但局部不通过项待修，审查项逐条核对完毕。'],
      ]
      for (const [label, line] of cases) {
        await writeRel(dir, 'docs/harness/reviews/task_r2_ctrl_audit_R1_20260915.md', NEG(line))
        const r = runCli(['verify', '--task', rel, '--target', dir])
        assert.equal(r.status, 2, `${label} 形态须仍判未通过: ${r.combined}`)
      }
      // F（只写「通过」二字）→ S1·N=20 内容量前闸不回退
      await writeRel(dir, 'docs/harness/reviews/task_r2_ctrl_audit_R1_20260915.md', NEG('通过\n'))
      const f = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(f.status, 2, f.combined)
      assert.match(f.combined, /内容量不足/)
    })
  })

  it('K 形态「不\\n通过」换行 → BLOCKED exit 2 点名否定（R-5 窄邻接式封堵兑现 · 3.0-W4 真修 · 2.4.2「维持漏网」锁定语义同 fixture 翻向）', async () => {
    await withTemp(async (dir) => {
      // 判据改造与断言翻向同 commit（F-W4-09 硬锁 · 验收 #5）：同一 fixture exit 0→2 即「修复后转绿」回归锁语义
      const rel = await seedR2(dir, 'r2_k', '# R1 fixture\n\n## 结论\n\n本任务经逐项核对不\n通过式检查均已完成，审查项合规，准予签收。\n')
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, `K 换行形态须封堵（R-5 窄邻接式 · 3.0-W4）: ${r.combined}`)
      assert.match(r.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
      assert.match(r.combined, /含否定结论词/)
    })
  })
})

describe('3.0-W4 R-5 [范围②] · 跨行否定封堵（窄邻接式：单换行 · 禁 \\n\\n 跨段 · 不引字符窗口 · 评审文 §3.1/§3.2 定稿）', { concurrency: 1 }, () => {
  // 红测先行（硬约束 6）：修复前（2.4.2+阶段一码）跨行三形态全部 exit 0 PASS 漏网
  //（既有同句窗口 [^。；\nn]{0,12} 显式排除换行符 · 真红证据见 30 invoke 留档）· 修复后 exit 2 点名否定。
  // 跨段反向锁：「不\\n\\n通过」维持 PASS —— 08_w7_closeout_external_v1.md:85 宽窗口误中案例固化为
  //「禁止未来顺手把窗口改宽」的回归锁（评审文 §3.2 · 284 份 tracked md 窄式 0 命中实测）。
  async function seedW4r5(dir: string, slug: string, review: string): Promise<string> {
    const rel = `docs/tasks/active/task_${slug}_v1.md`
    await writeRel(dir, rel, taskMd(slug))
    await writeRel(dir, `docs/harness/invokes/by-task/${slug.replace(/_/g, '-')}/invoke_20260901_10_x.md`, '# invoke 10\n')
    await writeRel(dir, `docs/harness/reviews/task_${slug}_audit_R1_20260917.md`, review)
    return rel
  }
  const R5 = (line: string): string => `# R1 fixture\n\n## 结论\n\n${line}\n`

  it('跨行三形态：不\\n通过 · 未\\n通过 · 未\\n予以通过 → BLOCKED exit 2 点名否定（修复前全 PASS 真红）', async () => {
    await withTemp(async (dir) => {
      const cases: Array<[string, string]> = [
        ['w4r5_bu', '本任务经审查不\n通过：缺陷三项待修，范围已逐项核毕，重审后再签。'],
        ['w4r5_wei', '本任务经审查未\n通过：缺陷三项待修，范围已逐项核毕，重审后再签。'],
        ['w4r5_yuyi', '本审查结论：未\n予以通过。缺陷三项待修，范围已逐项核毕，重审后再签。'],
      ]
      for (const [slug, line] of cases) {
        const rel = await seedW4r5(dir, slug, R5(line))
        const r = runCli(['verify', '--task', rel, '--target', dir])
        assert.equal(r.status, 2, `${slug} 跨行否定须封堵: ${r.combined}`)
        assert.match(r.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
        assert.match(r.combined, /含否定结论词/)
      }
    })
  })

  it('跨段反向锁：「不\\n\\n通过」（跨段空行）维持 PASS（窄式不跨段 · 08_w7:85 误中案例固化 · 禁顺手改宽窗口）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedW4r5(dir, 'w4r5_span', R5('本任务经逐项核对不\n\n通过式检查均已完成，审查项合规，验收范围一致，准予签收。'))
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 0, `跨段形态须维持 PASS（窄邻接式不跨段）: ${r.combined}`)
      assert.match(r.combined, /VERIFY: PASS/)
    })
  })
})

describe('2.3.1 N13 [P2] · 豁免四字段显式类型判（falsy 陷阱 · 验收报告 §3.N）', { concurrency: 1 }, () => {
  async function seedHatGap(dir: string): Promise<void> {
    await writeRel(dir, 'docs/tasks/done/task_n13_falsy_v1.md', taskMd('n13_falsy', 'done'))
    await writeRel(dir, 'docs/harness/invokes/by-task/n13-falsy/invoke_20260901_30_x.md', '# invoke 30\n')
  }
  function exemptYaml(authorizedBy: string): string {
    return [
      'version: "1"',
      'invoke_hats:',
      '  - slug: n13_falsy',
      '    reason: falsy 陷阱 fixture',
      "    date: '2026-09-14'",
      `    authorized_by: ${authorizedBy}`,
      '',
    ].join('\n')
  }
  it('authorized_by: 00（无引号 → YAML 整型 0）→ 无效不豁免；"00"（加引号裸名）→ A1 有意反转 invalid 不豁免；A1 合规形态 → 豁免命中 PASS', async () => {
    await withTemp(async (dir) => {
      await seedHatGap(dir)
      await writeRel(dir, 'docs/harness/legacy-gate-exempt.yaml', exemptYaml('00'))
      const bad = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /豁免条目无效（不豁免）/)
      // 3.0-W4 A1 重锚（20 审 advisory A1 ③ · 与 loader 同 commit）：加引号裸名 "00" 原断言语义被 A1 有意反转 ——
      // 裸名/裸号今后即假授权形态（无括号日期无出处词）→ invalid 不豁免；类型判层（未加引号 00 → 整型）保留在前
      await writeRel(dir, 'docs/harness/legacy-gate-exempt.yaml', exemptYaml('"00"'))
      const bare = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(bare.status, 2, bare.combined)
      assert.match(bare.combined, /豁免条目无效（不豁免）/)
      assert.match(bare.combined, /A1 三元判/)
      // A1 合规形态 → 豁免命中 PASS（保 N13 类型面绿径）
      await writeRel(dir, 'docs/harness/legacy-gate-exempt.yaml', exemptYaml('00（2026-09-14 fixture 授权）'))
      const good = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /豁免命中留痕: n13_falsy/)
      assert.match(good.combined, /LINT-DONE: PASS/)
    })
  })
  it('authorized_by: 123（非字符串标量）→ 条目无效不豁免（旧 falsy 判会静默 String() 收编 · 真红锁）', async () => {
    await withTemp(async (dir) => {
      await seedHatGap(dir)
      await writeRel(dir, 'docs/harness/legacy-gate-exempt.yaml', exemptYaml('123'))
      const bad = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /豁免条目无效（不豁免）/)
    })
  })
})

describe('3.0-W4 NEW-5 [范围①] · 结论闸语义化（档 M：VERB∧SUBJ∧(OBJ∨GATE) 节内共现 · 评审文 w4_semantic_criteria_review_20260917 §2 定稿 · OQ-1 档 M 采纳 · 20 审维持）', { concurrency: 1 }, () => {
  // 红测先行（硬约束 6 · 评审文 §2.4 对抗表机械复现）：修复前（2.4.2 码）填充顶包三件套全部
  // exit 0 PASS 漏网 —— 「通过。」+16 字任意 ASCII 填充即过 substance≥20 地板（真红实测证据见
  // docs/harness/invokes/by-task/3-0-w4-semantic-criteria/invoke_20260917_30_3-0-w4-semantic-criteria.md）；
  // 修复后 exit 2 · detail 点名缺失维度（缺审查行为陈述 SUBJ / 缺对象或闸指涉 OBJ∨GATE）。
  async function seedW4n5(dir: string, slug: string, review: string): Promise<string> {
    const rel = `docs/tasks/active/task_${slug}_v1.md`
    await writeRel(dir, rel, taskMd(slug))
    await writeRel(dir, `docs/harness/invokes/by-task/${slug.replace(/_/g, '-')}/invoke_20260901_10_x.md`, '# invoke 10\n')
    await writeRel(dir, `docs/harness/reviews/task_${slug}_audit_R1_20260917.md`, review)
    return rel
  }
  const N5 = (line: string): string => `# R1 fixture\n\n## 结论\n\n${line}\n`
  const assertBlocked5 = async (dir: string, rel: string, dim: RegExp): Promise<void> => {
    const r = runCli(['verify', '--task', rel, '--target', dir])
    assert.equal(r.status, 2, r.combined)
    assert.match(r.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
    assert.match(r.combined, dim)
  }

  it('① 填充顶包「通过。」+16 字填充 → BLOCKED exit 2 点名缺审查行为陈述 SUBJ（无 SUBJ/OBJ/GATE · 修复前 PASS 真红）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedW4n5(dir, 'w4n5_pad', N5('通过。abcdefghijklmnop'))
      await assertBlocked5(dir, rel, /缺审查行为陈述（SUBJ）/)
    })
  })

  it('② 「本审查通过。」+填充（SUBJ 有 · OBJ/GATE 无）→ BLOCKED exit 2 点名缺对象或闸指涉 OBJ∨GATE（修复前 PASS 真红）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedW4n5(dir, 'w4n5_subj', N5('本审查通过。abcdefghijklmnop'))
      await assertBlocked5(dir, rel, /缺对象或闸指涉（OBJ∨GATE）/)
    })
  })

  it('③ 「HG-SPEC-SIGNOFF approved，予以通过。」+填充（GATE 有 · SUBJ 无）→ BLOCKED exit 2 点名缺 SUBJ（修复前 PASS 真红）', async () => {
    await withTemp(async (dir) => {
      // 偏差登记：task S5.1 底稿闸例作「HG-AUDIT-R1 approved」—— HG-AUDIT 内嵌 AUDIT 命中 SUBJ 词集
      // （i 旗标 · 评审文 §2.2 定稿词集逐字沿用），判定意图「GATE 有 · SUBJ 无 → 挡」由 HG-SPEC-SIGNOFF 同构承载。
      const rel = await seedW4n5(dir, 'w4n5_gate', N5('HG-SPEC-SIGNOFF approved，予以通过。abcdefghijkl'))
      await assertBlocked5(dir, rel, /缺审查行为陈述（SUBJ）/)
    })
  })

  it('④ 诚实边界对照：成段合规构造「本审查核对验收标准与范围，无阻塞，通过。」维持 PASS（机械判据不防成段伪造 · R-① 登记面 · 由 invoke 留痕 + HG-AUDIT-R1 人签兜底 · 评审文 §2.4 末行）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedW4n5(dir, 'w4n5_honest', N5('本审查核对验收标准与范围，无阻塞，通过。逐项核毕。'))
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /VERIFY: PASS/)
    })
  })

  it('⑤ substance≥20 地板保留对照：「通过\\n」仍内容量不足 FAIL（语义组合判在地板之后 · 既有 F 形态零回退）', async () => {
    await withTemp(async (dir) => {
      const rel = await seedW4n5(dir, 'w4n5_floor', N5('通过\n'))
      const r = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /内容量不足/)
    })
  })
})

describe('3.0-W4 NEW-11 [范围③] · 否定词表广义化（五类 · 评审文 §3.3 定稿 · 不承诺完备 · 误伤 0/63 回归锁）', { concurrency: 1 }, () => {
  // 红测先行（硬约束 6）：修复前（2.4.2 词表）下表各形态与通过词同节并存均判 PASS 漏网
  // （逐条真红实测 · substance 全达标 · 证据见 30 invoke 留档）；修复后 REVIEW_NEG_RE 命中 → exit 2 点名否定。
  // 覆盖：中文签收面（不予/不/未签收）· 英文否定完成式（doesn't/fail to pass/not approv*）·
  // 英文否决族（decline/veto/refuse）· 中英混入（不/未+pass · not/no+通过）。
  // 注一：'does not pass' 由 2.4.2 R-2 既有 not\s*pass 已覆盖（修复前即 FAIL · 非本波红转绿面），
  //       本类红转绿代表形 = doesn't / failed / fails / not approved。
  // 注二：\bNG\b 不入首批（OQ-4 观察名单 · 消费者英文 prose 或有他义）→ 无 fixture，登记于 review-gates.ts 词表注释；
  //       残余四类（日韩德法俄/符号/拆字/拼音 · F-W4-02 不承诺完备）同处登记。
  async function seedW4n11(dir: string, slug: string, review: string): Promise<string> {
    const rel = `docs/tasks/active/task_${slug}_v1.md`
    await writeRel(dir, rel, taskMd(slug))
    await writeRel(dir, `docs/harness/invokes/by-task/${slug.replace(/_/g, '-')}/invoke_20260901_10_x.md`, '# invoke 10\n')
    await writeRel(dir, `docs/harness/reviews/task_${slug}_audit_R1_20260917.md`, review)
    return rel
  }
  const N11 = (line: string): string => `# R1 fixture\n\n## 结论\n\n${line}\n`
  const assertNeg = async (dir: string, slug: string, line: string): Promise<void> => {
    const rel = await seedW4n11(dir, slug, N11(line))
    const r = runCli(['verify', '--task', rel, '--target', dir])
    assert.equal(r.status, 2, r.combined)
    assert.match(r.combined, /VERIFY: BLOCKED · 审查文结论不可机读通过/)
    assert.match(r.combined, /含否定结论词/)
  }

  it('类一 · 中文签收面：不予签收 / 不签收 / 未签收 → BLOCKED exit 2（修复前全 PASS 真红）', async () => {
    await withTemp(async (dir) => {
      await assertNeg(dir, 'w4n11_sign1', '本审查核对后不予签收：缺陷三项待修复后再审，结论状态回退为待签。')
      await assertNeg(dir, 'w4n11_sign2', '本审查核对后不签收：缺陷三项待修复后再审，结论状态回退为待签。')
      await assertNeg(dir, 'w4n11_sign3', '本审查核对后未签收：缺陷三项待修复后再审，结论状态回退为待签。')
    })
  })

  it('类二 · 英文否定完成式：doesn\'t pass / failed to pass / fails to pass / not approved → BLOCKED exit 2（修复前全 PASS 真红）', async () => {
    await withTemp(async (dir) => {
      await assertNeg(dir, 'w4n11_en1', "Review verdict: it doesn't pass. Three defects found in the audit round, rework required.")
      await assertNeg(dir, 'w4n11_en2', 'The change failed to pass review: three defects confirmed, rework required before signoff.')
      await assertNeg(dir, 'w4n11_en3', 'The change fails to pass review: three defects confirmed, rework required before signoff.')
      await assertNeg(dir, 'w4n11_en4', 'Verdict: not approved. Originally marked PASS in the draft; the audit found three defects, rework required.')
    })
  })

  it('类三 · 英文否决族：declined / vetoed / refused → BLOCKED exit 2（修复前全 PASS 真红）', async () => {
    await withTemp(async (dir) => {
      await assertNeg(dir, 'w4n11_veto1', 'Declined by reviewer: verdict originally recorded as accepted, three defects pending rework.')
      await assertNeg(dir, 'w4n11_veto2', 'Verdict vetoed: originally recorded as accepted, three defects pending rework before signoff.')
      await assertNeg(dir, 'w4n11_veto3', 'Signoff refused: originally recorded as accepted, three defects pending rework.')
    })
  })

  it('类四 · 中英混入：不 pass / 未 pass / not 通过 / no 通过 → BLOCKED exit 2（修复前全 PASS 真红）', async () => {
    await withTemp(async (dir) => {
      await assertNeg(dir, 'w4n11_mix1', '本审查结论为不 pass：缺陷三项待修复后再审，范围已逐项核毕。')
      await assertNeg(dir, 'w4n11_mix2', '本审查结论为未 pass：缺陷三项待修复后再审，范围已逐项核毕。')
      await assertNeg(dir, 'w4n11_mix3', 'Verdict: not 通过。缺陷三项待修复后再审，范围已逐项核毕。')
      await assertNeg(dir, 'w4n11_mix4', 'Verdict: no 通过。缺陷三项待修复后再审，范围已逐项核毕。')
    })
  })
})

describe('3.0-W4 NEW-10 [范围⑥] · exempt 授权真实性 A1 三元判 + U1 口径统一（评审文 §6 定稿 · OQ-2/OQ-3 采纳）', { concurrency: 1 }, () => {
  // 红测先行（硬约束 6 · task S5.6 负向 fixture ①）：假授权形态（随手填名「张三」/ 裸号 "00" /
  // 有日期无出处词 / 有出处词无 ISO 日期）修复前全部四字段齐即豁免生效（exit 0 真红漏网）；
  // 修复后 A1 三元判入 invalid 留痕 warn · 不豁免（exit 2 缺口仍在）· 与缺四字段同处置面（exempt.ts 同通道）。
  // 诚实边界（R-③ · 评审文 §6.1 末行）：A1 锁形态不锁事实 —— 真实性终局靠 S2 留痕 + 人审。
  async function seedHatGap10(dir: string): Promise<void> {
    await writeRel(dir, 'docs/tasks/done/task_new10_falsy_v1.md', taskMd('new10_falsy', 'done'))
    await writeRel(dir, 'docs/harness/invokes/by-task/new10-falsy/invoke_20260901_30_x.md', '# invoke 30\n')
  }
  const exemptYaml10 = (authorizedBy: string): string =>
    [
      'version: "1"',
      'invoke_hats:',
      '  - slug: new10_falsy',
      '    reason: NEW-10 A1 fixture',
      "    date: '2026-09-17'",
      `    authorized_by: ${authorizedBy}`,
      '',
    ].join('\n')

  it('A1 负向四面：张三（裸名）/ "00"（裸号）/ 有日期无出处词 / 有出处词无 ISO 日期 → invalid warn + 不豁免（修复前全豁免真红）', async () => {
    await withTemp(async (dir) => {
      await seedHatGap10(dir)
      for (const bad of ['张三', '"00"', '00（2026-09-14 fixture）', '00（fixture 授权）']) {
        await writeRel(dir, 'docs/harness/legacy-gate-exempt.yaml', exemptYaml10(bad))
        const r = runCli(['task', 'lint-done', '--target', dir])
        assert.equal(r.status, 2, `假授权形态 ${bad} 须不豁免: ${r.combined}`)
        assert.match(r.combined, /豁免条目无效（不豁免）/)
        assert.match(r.combined, /A1 三元判/)
      }
    })
  })

  it('A1 正向对照：「00（2026-09-14 fixture 授权）」三元齐 → 豁免命中 PASS + 留痕', async () => {
    await withTemp(async (dir) => {
      await seedHatGap10(dir)
      await writeRel(dir, 'docs/harness/legacy-gate-exempt.yaml', exemptYaml10('00（2026-09-14 fixture 授权）'))
      const r = runCli(['task', 'lint-done', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /豁免命中留痕: new10_falsy/)
      assert.match(r.combined, /LINT-DONE: PASS/)
    })
  })

  it('U1 双向钉死：verify --task done 面有豁免 → exempted 留痕（exit 0 · 命名对齐裸 verify · 不再 warn）· 无豁免 → 维持 warn 降级不挡', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/done/task_u1_done_v1.md'
      await writeRel(dir, rel, taskMd('u1_done', 'done'))
      await writeRel(dir, 'docs/harness/invokes/by-task/u1-done/invoke_20260901_10_x.md', '# invoke 10\n')
      await writeRel(dir, 'docs/harness/reviews/task_u1_done_audit_R1_20260917.md',
        '# R1 fixture\n\n## 结论\n\n本任务不予通过。缺陷清单见探针表，须修复后重审再签，范围已核毕。\n')
      // 无豁免 → 维持 D-23-W4-TRANSITION warn 降级（现状不变 · 反向锁）
      const noExempt = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(noExempt.status, 0, noExempt.combined)
      assert.match(noExempt.combined, /verify: warn · task_u1_done_audit_R1_20260917\.md 结论不可机读通过/)
      assert.match(noExempt.combined, /done 目录降级 · 不挡/)
      // 有豁免 → exempted 留痕（OQ-3 字段命名对齐裸 verify exempted）
      await writeRel(dir, 'docs/harness/legacy-gate-exempt.yaml', [
        'version: "1"',
        'reviews:',
        '  - slug: u1_done',
        '    reason: U1 fixture 豁免（done 面补消费）',
        "    date: '2026-09-17'",
        '    authorized_by: 00（2026-09-17 fixture 授权）',
        '',
      ].join('\n'))
      const exempted = runCli(['verify', '--task', rel, '--target', dir])
      assert.equal(exempted.status, 0, exempted.combined)
      assert.match(exempted.combined, /exempted/)
      assert.match(exempted.combined, /豁免命中留痕: u1_done（U1 fixture 豁免（done 面补消费） · 2026-09-17 · 00（2026-09-17 fixture 授权））/)
      assert.doesNotMatch(exempted.combined, /done 目录降级 · 不挡/)
      assert.match(exempted.combined, /VERIFY: PASS/)
      // JSON 面契约：exempted 键出现且 waived 不出现（只增不改 · cli-verify-observability 契约兼容）
      const j = runCli(['verify', '--task', rel, '--target', dir, '--json'])
      assert.equal(j.status, 0, j.combined)
      const payload = JSON.parse(j.stdout) as Record<string, unknown>
      assert.ok(Array.isArray(payload.exempted), `exempted 须为数组: ${j.stdout}`)
      assert.ok((payload.exempted as string[]).some((x) => x.includes('u1_done')), `exempted 须留痕 slug: ${j.stdout}`)
      assert.equal('waived' in payload, false)
    })
  })

  it('U1 helper 单源 grep 断言：slug→exempt 条目解析仅 exempt.ts resolveExemptEntry 一处 · close 不对称显式注释在案', () => {
    const here = path.dirname(fileURLToPath(import.meta.url))
    const v = readFileSync(path.join(here, '..', 'src', 'cli', 'verify.ts'), 'utf8')
    const t = readFileSync(path.join(here, '..', 'src', 'cli-task-extra.ts'), 'utf8')
    const e = readFileSync(path.join(here, '..', 'src', 'checks', 'exempt.ts'), 'utf8')
    const cg = readFileSync(path.join(here, '..', 'src', 'checks', 'close-guards.ts'), 'utf8')
    assert.doesNotMatch(v, /\.(reviews|invoke_hats)\.get\(/, 'verify.ts 不得再直查 Map（U1 单源）')
    assert.doesNotMatch(t, /\.(reviews|invoke_hats)\.get\(/, 'cli-task-extra.ts 不得再直查 Map（U1 单源）')
    assert.match(e, /export function resolveExemptEntry/)
    assert.match(cg, /设计性不对称/)
  })
})

