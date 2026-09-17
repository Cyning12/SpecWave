import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { appendFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { AUDIT_DEFAULT_REL, AUDIT_EVENT_KINDS, readAuditEvents } from '../src/audit/log.ts'
import { isS2RelPath, S2_TRUTH_PREFIXES } from '../src/cli-shared.ts'

// 3.0-W6 阶段一 · S6.1 C6 结构化审计日志落盘（验收 #1 schema 快照 / #2 三产出点+hook_guard /
// #3 F-W6-01 降级 / #4 F-W6-02 S2 拒写 / #10 落点否定断言 · F-W6-06 坏行容错 · F-W6-07 仓外拒）。
// 红→绿钉死：修复前 cmdAudit/verify/close/hook-guard 无任何结构化落盘（docs/harness/audit/ 不存在）。

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string }

function runCli(args: string[], cwd = KIT, input?: string): RunResult {
  const result = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd,
    env: { ...process.env },
    ...(input !== undefined ? { input } : {}),
  })
  const stdout = result.stdout ?? ''
  const stderr = result.stderr ?? ''
  return { status: result.status, stdout, stderr, combined: stdout + '\n' + stderr }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w6audit-'))
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

const REVIEW_BODY =
  '# R1 fixture\n\n## 结论\n\nPASS · 零内容阻塞（fixture）\n\n审查结论：fixture 范围与验收全项合规，无阻塞遗留，准予关账。\n'

function taskMd(slug: string, gateStatus: 'approved' | 'pending'): string {
  return [
    '# Task ' + slug,
    '',
    '> **状态**：`draft`',
    '',
    '## Harness 元信息',
    '',
    '| 字段 | 值 |',
    '|------|-----|',
    '| **task_slug** | `' + slug + '` |',
    '| **test_strategy** | `recommended` |',
    '| **wiki_delta** | `none` |',
    '',
    '### 人工闸',
    '',
    '| human_gate_id | status | blocks_hats | 说明 |',
    '|---------------|--------|-------------|------|',
    '| HG-TASK-DRAFT | approved | 20,30 | fixture |',
    '| HG-AUDIT-R1 | ' + gateStatus + ' | 30 | fixture |',
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
    '（待 30 回填）',
    '',
  ].join('\n')
}

/** verify --task PASS 全合规 fixture（approved 闸 + R1 审查文 + pre-30 invoke 10） */
async function seedVerifyOk(dir: string, slug = 'w6a_ok'): Promise<string> {
  const rel = 'docs/tasks/active/task_' + slug + '_v1.md'
  await writeRel(dir, rel, taskMd(slug, 'approved'))
  await writeRel(dir, 'docs/harness/reviews/task_' + slug + '_audit_R1_2026-09-17.md', REVIEW_BODY)
  await writeRel(dir, 'docs/harness/invokes/by-task/' + slug + '/invoke_20260901_10_' + slug + '.md', '# invoke 10 fixture')
  return rel
}

type Json = Record<string, unknown>

function readJsonl(file: string): Json[] {
  return readFileSync(file, 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as Json)
}

/** 验收 #1：字段集/类型/必填性逐键断言（schema 快照） */
function assertEventSchema(e: Json, expectedKeys: string[], kind: string): void {
  assert.deepEqual(Object.keys(e), expectedKeys, 'audit 事件 Object.keys 快照漂移')
  assert.equal(e.schema_version, '1', 'schema_version 恒 "1"')
  assert.ok(AUDIT_EVENT_KINDS.includes(e.event as never), 'event 枚举值域: ' + String(e.event))
  assert.equal(e.event, kind)
  assert.match(String(e.ts), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, 'ts ISO-8601 UTC')
  assert.ok(['PASS', 'BLOCKED', 'FAIL'].includes(String(e.verdict)), 'verdict 值域')
  assert.equal(typeof e.exit_code, 'number')
  if ('task' in e) assert.equal(typeof e.task, 'string')
  if ('gates' in e) {
    assert.ok(Array.isArray(e.gates))
    for (const g of e.gates as Json[]) {
      assert.equal(typeof g.id, 'string')
      assert.equal(typeof g.status, 'string')
    }
  }
  if ('detail' in e) assert.equal(typeof e.detail, 'string')
  if ('duration_ms' in e) assert.equal(typeof e.duration_ms, 'number')
}

describe('3.0-W6 S6.1 C6 · 结构化审计日志落盘（audit.jsonl）', { concurrency: 1 }, () => {
  it('验收 #10：默认落点不在 S2 三域（逐前缀否定断言 + 正向 sanity）', () => {
    for (const prefix of S2_TRUTH_PREFIXES) {
      assert.equal(isS2RelPath(AUDIT_DEFAULT_REL), false, '落点命中 S2 前缀: ' + prefix)
    }
    assert.equal(isS2RelPath('docs/tasks/x.md'), true, 'sanity: docs/tasks 须命中')
    assert.equal(isS2RelPath('docs/harness/reviews/x.md'), true, 'sanity: reviews 须命中')
    assert.equal(isS2RelPath('docs/harness/invokes/by-task/s/x.md'), true, 'sanity: invokes 须命中')
  })

  it('验收 #1/#2 ①：cmdAudit 主产出点 · FAIL 事件 schema 快照 + append-only（只增不覆写）', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w6a_pending_v1.md'
      await writeRel(dir, rel, taskMd('w6a_pending', 'pending'))
      const file = path.join(dir, AUDIT_DEFAULT_REL)
      const r1 = runCli(['audit', '--target', dir, '--task', rel])
      assert.equal(r1.status, 2, r1.combined)
      assert.match(r1.combined, /audit: FAIL/)
      assert.ok(existsSync(file), 'audit.jsonl 须落盘')
      const firstLine = readFileSync(file, 'utf8').split('\n')[0]!
      const events = readJsonl(file)
      assert.equal(events.length, 1)
      assertEventSchema(
        events[0]!,
        ['schema_version', 'ts', 'event', 'verdict', 'exit_code', 'task', 'gates', 'detail', 'duration_ms'],
        'audit',
      )
      assert.equal(events[0]!.verdict, 'FAIL')
      assert.equal(events[0]!.exit_code, 2)
      assert.equal(events[0]!.task, rel)
      assert.ok((events[0]!.gates as unknown[]).length >= 2, '闸态快照非空')
      assert.match(String(events[0]!.detail), /gate-check FAIL/)
      // append-only：二次运行行数递增 · 首行逐字不变（无覆写）
      const r2 = runCli(['audit', '--target', dir, '--task', rel])
      assert.equal(r2.status, 2, r2.combined)
      const lines = readFileSync(file, 'utf8').split('\n').filter((l) => l.trim())
      assert.equal(lines.length, 2, 'append-only：行数递增')
      assert.equal(lines[0], firstLine, '首行内容逐字不变（无覆写）')
    })
  })

  it('验收 #2 ②：verify --task PASS/BLOCKED 双 verdict 落轨 · gates[] 非空', async () => {
    await withTemp(async (dir) => {
      const okRel = await seedVerifyOk(dir)
      const pass = runCli(['verify', '--task', okRel, '--target', dir])
      assert.equal(pass.status, 0, pass.combined)
      const pendRel = 'docs/tasks/active/task_w6a_pend_v1.md'
      await writeRel(dir, pendRel, taskMd('w6a_pend', 'pending'))
      const blocked = runCli(['verify', '--task', pendRel, '--target', dir])
      assert.equal(blocked.status, 2, blocked.combined)
      const events = readJsonl(path.join(dir, AUDIT_DEFAULT_REL))
      assert.equal(events.length, 2)
      assertEventSchema(
        events[0]!,
        ['schema_version', 'ts', 'event', 'verdict', 'exit_code', 'task', 'gates', 'duration_ms'],
        'verify',
      )
      assert.equal(events[0]!.verdict, 'PASS')
      assert.equal(events[0]!.exit_code, 0)
      assert.ok((events[0]!.gates as unknown[]).length >= 2, '有 --task 时 gates[] 非空')
      assertEventSchema(events[1]!, ['schema_version', 'ts', 'event', 'verdict', 'exit_code', 'task', 'gates', 'duration_ms'], 'verify')
      assert.equal(events[1]!.verdict, 'BLOCKED')
      assert.equal(events[1]!.exit_code, 2)
    })
  })

  it('验收 #2 ③：task close verdict 三态（READY dry-run / PASS 归档 / BLOCKED）落轨', async () => {
    await withTemp(async (dir) => {
      // 全合规 fixture（close 守卫全过 · 参照 cli-task-close-guards seedComplete 口径）
      const slug = 'w6a_close'
      const rel = 'docs/tasks/active/task_' + slug + '_v1.md'
      const okBody = taskMd(slug, 'approved')
        .replace('> **状态**：`draft`', '> **状态**：`done`')
        .replace('| **test_strategy** | `recommended` |', '| **test_strategy** | `recommended` |\n| **invoke_retention_profile** | `default` |\n| **graph_delta** | `none` |\n| **graph_delta_note** | `fixture 无图谱增量` |\n| **wiki_delta_note** | `fixture 无 wiki 增量` |\n| **experience_capture** | `recommended` |\n| **kpi_aggregator** | `CLOSE` |\n| **close_pr_policy** | `exempt` |\n| **close_pr_exempt_note** | `fixture close guards` |')
        .replace('（待 30 回填）', '自检已回填：fixture close 三态。')
      await writeRel(dir, rel, okBody + '### KPI（00）\n\nTask_KPI%: 87\n\n### 经验总结\n\nfixture 经验总结：无。\n')
      await writeRel(dir, 'docs/harness/reviews/task_' + slug + '_audit_R1_2026-09-17.md', REVIEW_BODY)
      await writeRel(dir, 'docs/harness/invokes/by-task/' + slug + '/invoke_20260901_10_' + slug + '.md', '# invoke 10')
      await writeRel(dir, 'docs/harness/invokes/by-task/' + slug + '/invoke_20260902_30_40_' + slug + '.md', '# invoke 30+40')
      const dry = runCli(['task', 'close', '--file', rel], dir)
      assert.equal(dry.status, 0, dry.combined)
      assert.match(dry.combined, /CLOSE: READY/)
      const yes = runCli(['task', 'close', '--file', rel, '--yes'], dir)
      assert.equal(yes.status, 0, yes.combined)
      assert.match(yes.combined, /CLOSE: PASS/)
      const events = readJsonl(path.join(dir, AUDIT_DEFAULT_REL))
      assert.equal(events.length, 2)
      for (const e of events) {
        assertEventSchema(e as Json, ['schema_version', 'ts', 'event', 'verdict', 'exit_code', 'task', 'detail', 'duration_ms'], 'task_close')
        assert.equal(e.verdict, 'PASS')
        assert.equal(e.exit_code, 0)
        assert.equal(e.task, slug)
      }
      assert.match(String(events[0]!.detail), /READY（dry-run · 未执行归档）/, 'READY 映射 PASS + detail 点名（偏差登记面）')
      assert.match(String(events[1]!.detail), /归档 → docs\/tasks\/done\//)
      // BLOCKED 态：占位自检 fixture
      const badSlug = 'w6a_closebad'
      const badRel = 'docs/tasks/active/task_' + badSlug + '_v1.md'
      await writeRel(dir, badRel, taskMd(badSlug, 'approved'))
      const blocked = runCli(['task', 'close', '--file', badRel], dir)
      assert.equal(blocked.status, 2, blocked.combined)
      const after = readJsonl(path.join(dir, AUDIT_DEFAULT_REL))
      const last = after[after.length - 1]!
      assert.equal(last.event, 'task_close')
      assert.equal(last.verdict, 'BLOCKED')
      assert.equal(last.exit_code, 2)
      assert.equal(last.task, badSlug)
    })
  })

  it('验收 #8 前半：hook_guard 事件落轨（PASS exit_code 0 / BLOCKED exit_code 吻合）', async () => {
    await withTemp(async (dir) => {
      const ok = runCli(['hook-guard', '--trigger', 'pre-commit', '--command', 'true', '--target', dir], dir, '')
      assert.equal(ok.status, 0, ok.combined)
      const bad = runCli(['hook-guard', '--trigger', 'pre-commit', '--command', 'exit 3', '--target', dir], dir, '')
      assert.equal(bad.status, 2, bad.combined)
      const events = readJsonl(path.join(dir, AUDIT_DEFAULT_REL))
      assert.equal(events.length, 2)
      assertEventSchema(events[0]!, ['schema_version', 'ts', 'event', 'verdict', 'exit_code', 'detail', 'duration_ms'], 'hook_guard')
      assert.equal(events[0]!.verdict, 'PASS')
      assert.equal(events[0]!.exit_code, 0)
      assert.match(String(events[0]!.detail), /trigger=pre-commit · command=true/)
      assert.equal(events[1]!.verdict, 'BLOCKED')
      assert.equal(events[1]!.exit_code, 3, 'exit_code 与门禁真实出口吻合（G7 判据）')
    })
  })

  it('验收 #4 F-W6-02：--audit-file 指向 S2 三域逐一拒写点名（exit 2 · 无文件落盘）', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w6a_pending_v1.md'
      await writeRel(dir, rel, taskMd('w6a_pending', 'pending'))
      for (const s2 of ['docs/tasks/evil.jsonl', 'docs/harness/reviews/evil.jsonl', 'docs/harness/invokes/by-task/x/evil.jsonl']) {
        const r = runCli(['audit', '--target', dir, '--task', rel, '--audit-file', s2])
        assert.equal(r.status, 2, s2 + ' · ' + r.combined)
        assert.match(r.combined, /拒写：--audit-file 命中 S2 过程域（F-W6-02 · 无豁免参数）/)
        assert.equal(existsSync(path.join(dir, s2)), false, 'S2 路径零落盘: ' + s2)
      }
    })
  })

  it('F-W6-07：--audit-file 指向仓外 → 拒（exit 1 用法档）', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['audit', '--target', dir, '--audit-file', '../outside.jsonl'])
      assert.equal(r.status, 1, r.combined)
      assert.match(r.combined, /--audit-file 须落 target 仓内（拒仓外路径 · F-W6-07）/)
    })
  })

  it('验收 #3 F-W6-01：落盘失败降级 warning 不阻断（verdict/exit 零变更 · PASS/BLOCKED 双对照）', async () => {
    await withTemp(async (dir) => {
      // 落点目录被同名文件占据 → mkdirSync ENOTDIR 失败
      await writeRel(dir, 'docs/harness/audit', 'i-am-a-file')
      const okRel = await seedVerifyOk(dir, 'w6a_deg_ok')
      const pass = runCli(['verify', '--task', okRel, '--target', dir])
      assert.equal(pass.status, 0, pass.combined)
      assert.match(pass.combined, /VERIFY: PASS/)
      assert.match(pass.stderr, /warn: audit 落盘失败（降级 · 门禁主流程不受影响）/)
      const pendRel = 'docs/tasks/active/task_w6a_deg_pend_v1.md'
      await writeRel(dir, pendRel, taskMd('w6a_deg_pend', 'pending'))
      const blocked = runCli(['verify', '--task', pendRel, '--target', dir])
      assert.equal(blocked.status, 2, blocked.combined)
      assert.match(blocked.combined, /VERIFY: BLOCKED/)
      assert.match(blocked.stderr, /warn: audit 落盘失败（降级 · 门禁主流程不受影响）/)
      assert.equal(existsSync(path.join(dir, AUDIT_DEFAULT_REL)), false, '降级面零落盘')
    })
  })

  it('F-W6-06：坏行混入不拒写新事件 · readAuditEvents 逐行容错（skip + 计数）', async () => {
    await withTemp(async (dir) => {
      const rel = 'docs/tasks/active/task_w6a_pending_v1.md'
      await writeRel(dir, rel, taskMd('w6a_pending', 'pending'))
      runCli(['audit', '--target', dir, '--task', rel])
      const file = path.join(dir, AUDIT_DEFAULT_REL)
      await appendFile(file, '{broken json line\n', 'utf8')
      const r = runCli(['audit', '--target', dir, '--task', rel])
      assert.equal(r.status, 2, r.combined)
      const { events, badLines } = readAuditEvents(file)
      assert.equal(badLines, 1, '坏行 skip + 计数')
      assert.equal(events.length, 2, '坏行不拒写/不拒读后续事件')
      assert.ok(events.every((e) => e.event === 'audit'))
    })
  })
})
