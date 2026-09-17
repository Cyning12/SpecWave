import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { CliError } from '../src/cli-shared.ts'
import { cmdGraph } from '../src/cli-graph.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// 3.0 W3 · S4.4 判据加固六项（验收 #8 · 研究文 §5 首次对抗复攻 · 附录 A 配方机械复现）。
// 修复前真值面留证：研究文 §5.1 在案 + 本棒开工复跑逐字一致（30 invoke 留档）。
// 逐条处置（task S4.4 定稿）：
//   ADV-A1/A2 · D2 裸子串（必修）→ 段边界等值判（hat_id split('-') 首段 === '30' · 禁裸子串）：
//     a1（130-helper 过配）转绿 · a2（execute-code 漏配）D2 正确不管 —— 未声明帽由 S4.5 HGM 实例校验
//     hat 词汇面 Warning 兜住（F-W3-09 · 阶段三 · 本测登记钉 D2 边界行为）。
//   ADV-B1/B2 · rejected→draft（接真 (i)）→ ① ingest 补发 TaskStatusChanged（task md status 与事件轨
//     投影漂移时 · 幂等键照 idempotencyKey 既有口径扩展）——清偿路径入公开管道，b2 不再唯一手段；
//     ② 公理新语义（30 按 task 定稿自由度定稿）：清偿后继 = TaskStatusChanged(draft) ∨ 同闸
//     GateStatusChanged(≠rejected)（重审流转 · 公开管道可达）——b1 转绿 · rejected 后静默搁置仍真红。
//   ADV-C1 · D3 空转（移除）→ CHECKED 边不可构造 · 恒 warn 噪声 · 无消费者（研究文 §5.3）· 接真归 W6 G7。
//   ADV-C2 · S2 死判据（移除+口径登记）→ SYNCED 边不可构造 · 恒绿假安全感；S2 真保护在 sync 执行侧
//     拦截面（isS2RelPath · cli-sync），非 axioms 事后判定。

type RunResult = { status: number; stdout: string; stderr: string; combined: string }

// 进程内直调（E3 下沉口径同 test/cli-g1g7.test.ts makeCore · 零子进程）
function makeCore(fn: (args: string[]) => Promise<void>): (args: string[]) => Promise<RunResult> {
  return async (args) => {
    const out: string[] = []
    const err: string[] = []
    const origLog = console.log
    const origError = console.error
    const origWrite = process.stdout.write
    console.log = (...a: unknown[]) => {
      out.push(a.map(String).join(' '))
    }
    console.error = (...a: unknown[]) => {
      err.push(a.map(String).join(' '))
    }
    process.stdout.write = ((chunk: unknown) => {
      out.push(String(chunk).replace(/\n$/, ''))
      return true
    }) as typeof process.stdout.write
    let status = 0
    try {
      await fn(args)
    } catch (e) {
      if (e instanceof CliError) {
        status = e.exitCode
        if (e.message) err.push(e.message)
      } else {
        throw e
      }
    } finally {
      console.log = origLog
      console.error = origError
      process.stdout.write = origWrite
    }
    const stdout = out.length > 0 ? out.join('\n') + '\n' : ''
    const stderr = err.length > 0 ? err.join('\n') + '\n' : ''
    return { status, stdout, stderr, combined: `${stdout}\n${stderr}` }
  }
}

const runGraph = makeCore(cmdGraph)

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'spec-wave-axioms-hardening-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

type EvSpec = { id: string; type: string; subject: string; data: Record<string, unknown>; at: string }
function evLine(e: EvSpec): string {
  return JSON.stringify({
    event_id: e.id,
    type: e.type,
    occurred_at: e.at,
    actor: 'fixture',
    subject: e.subject,
    data: e.data,
    source: 'fixture',
  })
}

async function seedEvents(dir: string, events: EvSpec[]): Promise<void> {
  await mkdir(path.join(dir, '.coding-kit', 'events'), { recursive: true })
  await writeFile(path.join(dir, '.coding-kit', 'events', '2026-08.jsonl'), events.map(evLine).join('\n') + '\n')
}

function currentMonthEventsFile(dir: string): string {
  const now = new Date()
  return path.join(
    dir, '.coding-kit', 'events',
    `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}.jsonl`,
  )
}

const AT1 = '2026-08-01T00:00:00Z'
const AT2 = '2026-08-02T00:00:00Z'

describe('3.0-W3 S4.4 · graph axioms 判据加固（附录 A 机械复现 · 六项逐条）', { concurrency: 1 }, () => {
  it('ADV-A1 · D2 段边界判：闸 pending 阻塞 130-helper（裸子串过配构造）→ 修复后 PASS exit 0', async () => {
    await withTemp(async (dir) => {
      await seedEvents(dir, [
        { id: 'evt:a1:1', type: 'GateStatusChanged', subject: 'gate:t1:HG-X', data: { new_status: 'pending', task_slug: 't1', human_gate_id: 'HG-X', blocks_hats: ['130-helper'] }, at: AT1 },
      ])
      const r = await runGraph(['axioms', 'check', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /axioms: PASS/)
      assert.match(r.combined, /violations: 0/)
    })
  })

  it('ADV-A2 · D2 段边界判：execute-code（未声明帽漂移构造）→ D2 正确不管 PASS（hat 词汇面归 S4.5 · F-W3-09 登记）', async () => {
    await withTemp(async (dir) => {
      await seedEvents(dir, [
        { id: 'evt:a2:1', type: 'GateStatusChanged', subject: 'gate:t1:HG-X', data: { new_status: 'pending', task_slug: 't1', human_gate_id: 'HG-X', blocks_hats: ['execute-code'] }, at: AT1 },
      ])
      const r = await runGraph(['axioms', 'check', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /violations: 0/)
    })
  })

  it('D2 真阳性对照（不削弱）：pending 阻塞 30-execute-code（V2 全形）与短形 30 → 仍 FAIL exit 2 点名 D2', async () => {
    await withTemp(async (dir) => {
      await seedEvents(dir, [
        { id: 'evt:a3:1', type: 'GateStatusChanged', subject: 'gate:t1:HG-X', data: { new_status: 'pending', task_slug: 't1', human_gate_id: 'HG-X', blocks_hats: ['30-execute-code'] }, at: AT1 },
        { id: 'evt:a3:2', type: 'GateStatusChanged', subject: 'gate:t2:HG-Y', data: { new_status: 'pending', task_slug: 't2', human_gate_id: 'HG-Y', blocks_hats: ['30'] }, at: AT1 },
      ])
      const r = await runGraph(['axioms', 'check', '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[D2\/error\] gate gate:t1:HG-X pending 且阻塞 30 帽/)
      assert.match(r.combined, /\[D2\/error\] gate gate:t2:HG-Y pending 且阻塞 30 帽/)
    })
  })

  it('ADV-B1 · rejected→draft 公理新语义：rejected 后同闸重审 approved（公开管道修复）→ 转绿 PASS', async () => {
    await withTemp(async (dir) => {
      await seedEvents(dir, [
        { id: 'evt:b1:1', type: 'GateStatusChanged', subject: 'gate:t1:HG-AUDIT-R1', data: { new_status: 'rejected', task_slug: 't1', human_gate_id: 'HG-AUDIT-R1', blocks_hats: ['30-execute-code'] }, at: AT1 },
        { id: 'evt:b1:2', type: 'GateStatusChanged', subject: 'gate:t1:HG-AUDIT-R1', data: { new_status: 'approved', task_slug: 't1', human_gate_id: 'HG-AUDIT-R1', blocks_hats: ['30-execute-code'] }, at: AT2 },
      ])
      const r = await runGraph(['axioms', 'check', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /violations: 0/)
    })
  })

  it('rejected→draft 真红保留：rejected 后静默搁置（无任何清偿后继）→ 仍 FAIL exit 2 点名', async () => {
    await withTemp(async (dir) => {
      await seedEvents(dir, [
        { id: 'evt:b1r:1', type: 'GateStatusChanged', subject: 'gate:t1:HG-AUDIT-R1', data: { new_status: 'rejected', task_slug: 't1', human_gate_id: 'HG-AUDIT-R1', blocks_hats: ['30-execute-code'] }, at: AT1 },
      ])
      const r = await runGraph(['axioms', 'check', '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[rejected→draft\/error\]/)
      assert.match(r.combined, /gate:t1:HG-AUDIT-R1/)
    })
  })

  it('ADV-B2 · 手写 TaskStatusChanged(draft) 仍清偿（兼容面不收回）→ PASS', async () => {
    await withTemp(async (dir) => {
      await seedEvents(dir, [
        { id: 'evt:b2:1', type: 'GateStatusChanged', subject: 'gate:t1:HG-AUDIT-R1', data: { new_status: 'rejected', task_slug: 't1', human_gate_id: 'HG-AUDIT-R1', blocks_hats: ['30-execute-code'] }, at: AT1 },
        { id: 'evt:b2:2', type: 'TaskStatusChanged', subject: 'task:t1', data: { task_slug: 't1', new_status: 'draft' }, at: AT2 },
      ])
      const r = await runGraph(['axioms', 'check', '--target', dir])
      assert.equal(r.status, 0, r.combined)
    })
  })

  it('ADV-B 接真 (i)：task md status 漂移 → ingest 补发 TaskStatusChanged 入公开管道（幂等）→ rejected→draft 清偿转绿', async () => {
    await withTemp(async (dir) => {
      // 事件轨既有投影：task:x in_progress + 闸 rejected 无后继（修复前 = 永久红场景）
      await seedEvents(dir, [
        { id: 'evt:b3:1', type: 'TaskCreated', subject: 'task:x', data: { task_slug: 'x', title: 'x', status: 'in_progress', path: 'docs/tasks/active/task_x_v1.md' }, at: AT1 },
        { id: 'evt:b3:2', type: 'GateStatusChanged', subject: 'gate:x:HG-AUDIT-R1', data: { new_status: 'rejected', task_slug: 'x', human_gate_id: 'HG-AUDIT-R1', blocks_hats: ['30-execute-code'] }, at: AT2 },
      ])
      const before = await runGraph(['axioms', 'check', '--target', dir])
      assert.equal(before.status, 2, before.combined) // 同轨道修复前真红在案
      // 公开管道修复动作：task md 回 draft（重修）+ 闸表 approved
      await mkdir(path.join(dir, 'docs', 'tasks', 'active'), { recursive: true })
      await writeFile(
        path.join(dir, 'docs', 'tasks', 'active', 'task_x_v1.md'),
        [
          '# Task x',
          '',
          '> **状态**：`draft`',
          '',
          '## Harness 元信息',
          '',
          '| 字段 | 值 |',
          '|------|-----|',
          '| **task_slug** | `x` |',
          '',
          '### 人工闸',
          '',
          '| human_gate_id | status | blocks_hats | 说明 |',
          '|---------------|--------|-------------|------|',
          '| HG-AUDIT-R1 | approved | 30-execute-code | fixture |',
          '',
        ].join('\n'),
      )
      const ingest = await runGraph(['ingest', '--target', dir])
      assert.equal(ingest.status, 0, ingest.combined)
      const jsonl = readFileSync(currentMonthEventsFile(dir), 'utf8')
      assert.ok(jsonl.includes('"type":"TaskStatusChanged"'), 'ingest 须补发 TaskStatusChanged（清偿入公开管道）')
      assert.ok(jsonl.includes('"old_status":"in_progress"') && jsonl.includes('"new_status":"draft"'), '补发须携带漂移前后状态')
      const after = await runGraph(['axioms', 'check', '--target', dir])
      assert.equal(after.status, 0, after.combined)
      // 幂等：投影已对齐 → 重跑不再补发
      const ingest2 = await runGraph(['ingest', '--target', dir])
      assert.equal(ingest2.status, 0, ingest2.combined)
      const jsonl2 = readFileSync(currentMonthEventsFile(dir), 'utf8')
      assert.equal(jsonl2.split('\n').filter((l) => l.includes('"type":"TaskStatusChanged"')).length, 1, '重跑不得重复补发')
    })
  })

  it('ADV-C1 · D3 移除：task in_progress → 零 D3 噪声（violations 无 D3 项 · PASS exit 0）', async () => {
    await withTemp(async (dir) => {
      await seedEvents(dir, [
        { id: 'evt:c1:1', type: 'TaskCreated', subject: 'task:t1', data: { task_slug: 't1', status: 'in_progress' }, at: AT1 },
      ])
      const r = await runGraph(['axioms', 'check', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /violations: 0/)
      assert.doesNotMatch(r.combined, /D3/)
    })
  })

  it('ADV-C2 · S2 移除+登记：手写 SyncApplied touch S2 → 公理已移除（violations 无 S2 项）；真保护在 isS2RelPath 执行侧（登记在案）', async () => {
    await withTemp(async (dir) => {
      await seedEvents(dir, [
        { id: 'evt:c2:1', type: 'SyncApplied', subject: 'repo:x', data: { files_touched: ['docs/tasks/active/task_t1.md'] }, at: AT1 },
      ])
      const r = await runGraph(['axioms', 'check', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /violations: 0/)
      assert.doesNotMatch(r.combined, /\[S2\//)
      // 移除登记：源码注释在案（接真选项归 W6/3.x · 研究文 §5.3）
      const src = readFileSync(path.join(KIT, 'src', 'cli-graph-hgm.ts'), 'utf8')
      assert.match(src, /D3 公理已移除/)
      assert.match(src, /S2 公理已移除/)
      assert.match(src, /isS2RelPath/)
    })
  })
})
