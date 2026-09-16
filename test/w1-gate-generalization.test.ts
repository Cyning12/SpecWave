import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { formatGateCheck } from '../src/cli/gates.ts'
import { evaluateMayStart30, parseHumanGates, type HumanGate } from '../src/cli-shared.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const FIX_DIR = path.join(KIT, 'test', 'fixtures', 'gate-generalization')
const PENDING_FIXTURE = path.join(FIX_DIR, 'task_schema_change_pending.md')
const APPROVED_FIXTURE = path.join(FIX_DIR, 'task_schema_change_approved.md')
const BASELINE = path.join(KIT, 'test', 'fixtures', 'human-gates', 'baseline_20260916.json')
const SCANNER = path.join(KIT, 'scripts', 'scan-human-gates-baseline.mts')

function runCli(args: string[]): { status: number | null; stdout: string; combined: string } {
  const env = { ...process.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd: KIT,
    env,
  })
  return {
    status: r.status,
    stdout: r.stdout ?? '',
    combined: `${r.stdout ?? ''}\n${r.stderr ?? ''}`,
  }
}

const g = (id: string, status: string, blocksHats: string): HumanGate => ({ id, status, blocksHats })

describe('3.0 W1 阶段四 · evaluateMayStart30 声明式泛化（S2.6 · HG-GENERIC）', { concurrency: 1 }, () => {
  it('验收 #5①：fixture（HG-AUDIT-R1 approved + HG-SCHEMA-CHANGE pending|30）→ {ok:false, reason:\'HG-SCHEMA-CHANGE pending\'}', () => {
    const gates = parseHumanGates(readFileSync(PENDING_FIXTURE, 'utf8'))
    assert.deepEqual(evaluateMayStart30(gates), { ok: false, reason: 'HG-SCHEMA-CHANGE pending' })
  })

  it('绿径：白名单外闸 approved → ok:true', () => {
    const gates = parseHumanGates(readFileSync(APPROVED_FIXTURE, 'utf8'))
    assert.deepEqual(evaluateMayStart30(gates), { ok: true, reason: null })
  })

  it('F-W1-05 保留：HG-AUDIT-R1 缺行即拒（fail-closed by absence · 恒先通道）', () => {
    assert.deepEqual(evaluateMayStart30([]), { ok: false, reason: 'HG-AUDIT-R1 pending' })
    assert.deepEqual(evaluateMayStart30([g('HG-SCHEMA-CHANGE', 'approved', '30')]), {
      ok: false,
      reason: 'HG-AUDIT-R1 pending',
    })
  })

  it('blocks_hats 不含 30 的 pending 闸不拒（白名单外 · blocks 格为准）', () => {
    const gates = [g('HG-AUDIT-R1', 'approved', '30'), g('HG-PUBLISH', 'pending', '20')]
    assert.deepEqual(evaluateMayStart30(gates), { ok: true, reason: null })
  })

  it('多未过闸 reason 取舍（裁定钉死）：锚闸恒先 · 其后声明序首个 blocks-30 未过闸', () => {
    const gates = [
      g('HG-AUDIT-R1', 'approved', '30'),
      g('HG-ZZZ-NEW', 'pending', '30'),
      g('HG-SCHEMA-CHANGE', 'pending', '30'),
    ]
    assert.deepEqual(evaluateMayStart30(gates), { ok: false, reason: 'HG-ZZZ-NEW pending' })
  })

  it('既有 reason 形态保留：draft/graph pending（blocks 30）→ `<ID> pending` 逐字', () => {
    const audit = g('HG-AUDIT-R1', 'approved', '30')
    assert.deepEqual(evaluateMayStart30([audit, g('HG-TASK-DRAFT', 'pending', '20, 30')]), {
      ok: false,
      reason: 'HG-TASK-DRAFT pending',
    })
    assert.deepEqual(evaluateMayStart30([audit, g('HG-GRAPH-MODULES', 'pending', '30')]), {
      ok: false,
      reason: 'HG-GRAPH-MODULES pending',
    })
  })

  it('泛化对齐（登记）：HG-GRAPH-MODULES pending 但 blocks 格不含 30 → 不拒（旧特判不看 blocks 格 · 存量零此行形态）', () => {
    const gates = [g('HG-AUDIT-R1', 'approved', '30'), g('HG-GRAPH-MODULES', 'pending', '—')]
    assert.deepEqual(evaluateMayStart30(gates), { ok: true, reason: null })
  })
})

describe('3.0 W1 阶段四 · formatGateCheck 泛化渲染（验收 #6 · F-W1-13 红线）', { concurrency: 1 }, () => {
  it('泛化渲染：白名单外 blocks-30 行入表 + 阻断行点名（快照断言）', () => {
    const { text, blocked } = formatGateCheck(PENDING_FIXTURE, readFileSync(PENDING_FIXTURE, 'utf8'))
    assert.equal(blocked, true)
    assert.ok(text.includes('| HG-SCHEMA-CHANGE | pending | 30 | ❌ 拒 30 |'), text)
    assert.ok(text.includes('→ 30 不可开工: HG-SCHEMA-CHANGE pending 且 blocks 30'), text)
  })

  it('绿径渲染：白名单外 approved 行入表（✅ 可 30）· blocked=false', () => {
    const { text, blocked } = formatGateCheck(APPROVED_FIXTURE, readFileSync(APPROVED_FIXTURE, 'utf8'))
    assert.equal(blocked, false)
    assert.ok(text.includes('| HG-SCHEMA-CHANGE | approved | 30 | ✅ 可 30 |'), text)
  })

  it('既有三闸渲染逐字不变（F-W1-13 · 全 approved / 全 pending 双快照）', () => {
    const okContent = [
      '### 人工闸',
      '',
      '| human_gate_id | status | blocks_hats | 说明 |',
      '|---------------|--------|-------------|------|',
      '| HG-TASK-DRAFT | approved | 20, 30 | f |',
      '| HG-AUDIT-R1 | approved | 30 | f |',
    ].join('\n')
    const okRender = formatGateCheck('x.md', okContent)
    assert.equal(okRender.blocked, false)
    assert.equal(
      okRender.text,
      [
        'task: x.md',
        '| gate | status | blocks_30 | 30 影响 |',
        '|------|--------|-----------|--------|',
        '| HG-TASK-DRAFT | approved | 20, 30 | — |',
        '| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |',
        '',
        '',
      ].join('\n'),
    )
    const pendingContent = okContent
      .replace('| HG-TASK-DRAFT | approved |', '| HG-TASK-DRAFT | pending |')
      .replace('| HG-AUDIT-R1 | approved |', '| HG-AUDIT-R1 | pending |')
    const pendingRender = formatGateCheck('x.md', pendingContent)
    assert.equal(pendingRender.blocked, true)
    assert.equal(
      pendingRender.text,
      [
        'task: x.md',
        '| gate | status | blocks_30 | 30 影响 |',
        '|------|--------|-----------|--------|',
        '| HG-TASK-DRAFT | pending | 20, 30 | ❌ 拒 30 |',
        '| HG-AUDIT-R1 | pending | 30 | ❌ 拒 30 |',
        '',
        '→ 30 不可开工: HG-AUDIT-R1 非 approved（须维护者签 task 表）',
        '→ 30 不可开工: HG-TASK-DRAFT pending 且 blocks 30',
        '',
      ].join('\n'),
    )
  })
})

describe('3.0 W1 阶段四 · gate-check / status CLI 面（exit code · --json 键集 · may_start_30）', { concurrency: 1 }, () => {
  it('gate-check pending fixture → exit 2 · 渲染含 HG-SCHEMA-CHANGE 行 + 阻断点名', () => {
    const r = runCli(['gate-check', '--task', 'test/fixtures/gate-generalization/task_schema_change_pending.md', '--target', KIT])
    assert.equal(r.status, 2, r.combined)
    assert.match(r.combined, /\| HG-SCHEMA-CHANGE \| pending \| 30 \| ❌ 拒 30 \|/)
    assert.match(r.combined, /→ 30 不可开工: HG-SCHEMA-CHANGE pending/)
  })

  it('gate-check --json 键集不变（command/target/task/blocked/verdict）· blocked=true · verdict=BLOCKED', () => {
    const r = runCli(['gate-check', '--task', 'test/fixtures/gate-generalization/task_schema_change_pending.md', '--target', KIT, '--json'])
    assert.equal(r.status, 2, r.combined)
    const parsed = JSON.parse(r.stdout) as Record<string, unknown>
    assert.deepEqual(Object.keys(parsed).sort(), ['blocked', 'command', 'target', 'task', 'verdict'])
    assert.equal(parsed.blocked, true)
    assert.equal(parsed.verdict, 'BLOCKED')
  })

  it('gate-check approved fixture → exit 0 · 渲染含白名单外闸行', () => {
    const r = runCli(['gate-check', '--task', 'test/fixtures/gate-generalization/task_schema_change_approved.md', '--target', KIT])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /\| HG-SCHEMA-CHANGE \| approved \| 30 \| ✅ 可 30 \|/)
  })

  it('status --task --json：may_start_30 === false 且 blockers 点名（验收 #5① 双通道）', () => {
    const r = runCli(['status', '--task', 'test/fixtures/gate-generalization/task_schema_change_pending.md', '--target', KIT, '--json'])
    assert.equal(r.status, 0, r.combined)
    const parsed = JSON.parse(r.stdout) as { may_start_30: boolean; blockers: string[] }
    assert.equal(parsed.may_start_30, false)
    assert.ok(parsed.blockers.some((b) => b.includes('HG-SCHEMA-CHANGE')), JSON.stringify(parsed.blockers))
  })
})

describe('3.0 W1 阶段四 · 存量快照回归锁（验收 #5② · A2 口径：文件级 may_start_30 + 行键集逐条）', { concurrency: 1 }, () => {
  it('重扫（泛化新逻辑 live import）对基线 75 文件零翻转：may_start_30/reason 一致 · 行键(gate_id,status,blocks,出现序) 逐条一致 · 232 行/11 文件/generic 阻塞 0 行', () => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), 'w1-gate-rescan-'))
    const out = path.join(tmp, 'rescan.json')
    try {
      const scan = spawnSync(process.execPath, ['--experimental-strip-types', SCANNER, `--out=${out}`], {
        encoding: 'utf8',
        cwd: KIT,
      })
      assert.equal(scan.status, 0, `${scan.stdout}\n${scan.stderr}`)
      type Row = { gate_id: string; status: string; blocks_hats: string; blocks_30_generic?: boolean }
      type FileV = { file: string; may_start_30: { ok: boolean; reason: string | null }; rows: Row[] }
      const baseline = JSON.parse(readFileSync(BASELINE, 'utf8')) as { files: FileV[] }
      const rescan = JSON.parse(readFileSync(out, 'utf8')) as { files: FileV[] }
      const rescanByFile = new Map(rescan.files.map((f) => [f.file, f]))
      // F-W1-09 比对面纪律：以基线 manifest 文件集为准 · 30 时点新增文件（含 W1 task 自身）不入比对面
      let rowsTotal = 0
      let falseFiles = 0
      let genericBlockingRows = 0
      for (const base of baseline.files) {
        const re = rescanByFile.get(base.file)
        assert.ok(re, `基线文件在重扫中缺失: ${base.file}`)
        assert.equal(re.may_start_30.ok, base.may_start_30.ok, `文件级翻转: ${base.file}`)
        assert.equal(re.may_start_30.reason, base.may_start_30.reason, `文件级 reason 漂移: ${base.file}`)
        assert.equal(re.rows.length, base.rows.length, `行数漂移: ${base.file}`)
        base.rows.forEach((row, i) => {
          const other = re.rows[i]! // i < re.rows.length 已断言（E5 收窄）
          assert.deepEqual(
            [other.gate_id, other.status, other.blocks_hats],
            [row.gate_id, row.status, row.blocks_hats],
            `行键漂移: ${base.file}#${i}`,
          )
          if (other.blocks_30_generic) genericBlockingRows += 1
        })
        rowsTotal += base.rows.length
        if (!base.may_start_30.ok) falseFiles += 1
      }
      assert.equal(rowsTotal, 232) // 基线行数钉死
      assert.equal(falseFiles, 11) // 文件级 may_start_30=false 恰为 11 个零采集行文件
      assert.equal(genericBlockingRows, 0) // 泛化谓词下存量 blocks-30 未过行 = 0（第三次实证零误伤）
    } finally {
      rmSync(tmp, { recursive: true, force: true }) // rescan 产物比对后删除不入 git（登记口径）
    }
  })
})
