/**
 * 3.0.1 W2 · 闸表契约封堵（P2-4）
 * A/B：3 列告警 / 4 列无告警+may_start · id 内嵌 ** 负向 ·
 * README/模板逐字入测 · docs/tasks 存量解析零变化 · GATE_ROW_RE 不放宽。
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  EMPTY_GATE_TABLE_WARNING,
  evaluateMayStart30,
  parseHumanGates,
  type HumanGate,
} from '../src/cli-shared.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

function runCli(
  args: string[],
  cwd = KIT,
): { status: number | null; stdout: string; stderr: string } {
  const env = { ...process.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd,
    env,
  })
  return { status: r.status, stdout: r.stdout ?? '', stderr: r.stderr ?? '' }
}

function extractFirstMarkdownFence(src: string): string {
  const m = src.match(/```markdown\r?\n([\s\S]*?)\r?\n```/)
  assert.ok(m?.[1], 'expected ```markdown fence')
  return m[1]!
}

function taskBody(gateTable: string): string {
  return [
    '# Task: w2-fixture',
    '',
    '> **状态**：`draft`',
    '',
    '## Harness 元信息',
    '',
    '| 字段 | 值 |',
    '|------|-----|',
    '| **task_slug** | `w2-fixture` |',
    '',
    '### 人工闸',
    '',
    gateTable,
    '',
    '## 范围',
    '',
    '- [ ] x',
    '',
  ].join('\n')
}

const COL3_APPROVED = `| human_gate_id | status | blocks_hats |
|---------------|--------|-------------|
| HG-AUDIT-R1 | approved | 30 |`

const COL4_APPROVED = `| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-AUDIT-R1 | approved | 30 | ok |`

const COL3_PENDING = `| human_gate_id | status | blocks_hats |
|---------------|--------|-------------|
| HG-AUDIT-R1 | pending | 30 |`

const COL4_EMBEDDED_BOLD = `| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-W2-REVIEW（**条件闸**） | pending | 30 | miss |`

function listTaskMdFiles(): string[] {
  const out: string[] = []
  for (const sub of ['active', 'done']) {
    const dir = path.join(KIT, 'docs', 'tasks', sub)
    for (const name of readdirSync(dir)) {
      if (!name.endsWith('.md') || name === 'README.md') continue
      out.push(path.join(dir, name))
    }
  }
  return out.sort()
}

function gatesFingerprint(gates: HumanGate[]): string {
  return JSON.stringify(gates.map((g) => ({ id: g.id, status: g.status, blocksHats: g.blocksHats })))
}

describe('3.0.1 W2 · gate table contract（P2-4）', { concurrency: 1 }, () => {
  it('A3①：3 列 + HG-AUDIT-R1=approved ⇒ 空解析告警 · may_start 仍 false · exit 语义由 CLI 另测', () => {
    const warnings: string[] = []
    const gates = parseHumanGates(taskBody(COL3_APPROVED), { warnings })
    assert.equal(gates.length, 0)
    assert.equal(warnings.length, 1)
    assert.equal(warnings[0], EMPTY_GATE_TABLE_WARNING)
    assert.match(warnings[0]!, /4 列/)
    assert.match(warnings[0]!, /\*\*/)
    assert.deepEqual(evaluateMayStart30(gates), { ok: false, reason: 'HG-AUDIT-R1 pending' })
  })

  it('A3②：4 列同内容 ⇒ 无告警且 may_start_30=true', () => {
    const warnings: string[] = []
    const gates = parseHumanGates(taskBody(COL4_APPROVED), { warnings })
    assert.equal(gates.length, 1)
    assert.equal(gates[0]!.id, 'HG-AUDIT-R1')
    assert.equal(gates[0]!.status, 'approved')
    assert.equal(warnings.length, 0)
    assert.deepEqual(evaluateMayStart30(gates), { ok: true, reason: null })
  })

  it('A3③：3 列 + pending 既有阻断不回退', () => {
    const warnings: string[] = []
    const gates = parseHumanGates(taskBody(COL3_PENDING), { warnings })
    assert.equal(gates.length, 0)
    assert.equal(warnings.length, 1)
    assert.deepEqual(evaluateMayStart30(gates), { ok: false, reason: 'HG-AUDIT-R1 pending' })
  })

  it('A4：4 列但 id 内嵌 ** ⇒ 行 miss + 告警', () => {
    const warnings: string[] = []
    const gates = parseHumanGates(taskBody(COL4_EMBEDDED_BOLD), { warnings })
    assert.equal(gates.length, 0)
    assert.equal(warnings.length, 1)
    assert.equal(warnings[0], EMPTY_GATE_TABLE_WARNING)
  })

  it('A5：README.md / README.zh-CN.md / TASK_TEMPLATE 骨架逐字入测', () => {
    const en = extractFirstMarkdownFence(readFileSync(path.join(KIT, 'README.md'), 'utf8'))
    const zh = extractFirstMarkdownFence(readFileSync(path.join(KIT, 'README.zh-CN.md'), 'utf8'))
    const tpl = readFileSync(path.join(KIT, 'assets', 'harness', 'templates', 'TASK_TEMPLATE.md'), 'utf8')

    const enGates = parseHumanGates(en)
    const zhGates = parseHumanGates(zh)
    const tplGates = parseHumanGates(tpl)

    assert.ok(enGates.length >= 1, `README.md skeleton parsed empty: ${enGates.length}`)
    assert.ok(zhGates.length >= 1, `README.zh-CN.md skeleton parsed empty: ${zhGates.length}`)
    assert.ok(tplGates.length >= 1, `TASK_TEMPLATE parsed <1: ${tplGates.length}`)
    assert.ok(enGates.some((g) => g.id.startsWith('HG-AUDIT-R1')))
    assert.ok(zhGates.some((g) => g.id.startsWith('HG-AUDIT-R1')))
  })

  it('A1 文档提示：README / 模板含 4 列与 id 禁内嵌粗体', () => {
    const en = readFileSync(path.join(KIT, 'README.md'), 'utf8')
    const zh = readFileSync(path.join(KIT, 'README.zh-CN.md'), 'utf8')
    const tpl = readFileSync(path.join(KIT, 'assets', 'harness', 'templates', 'TASK_TEMPLATE.md'), 'utf8')
    assert.match(en, /blocks_hats \| 说明/)
    assert.match(zh, /blocks_hats \| 说明/)
    assert.match(tpl, /blocks_hats \| 说明/)
    assert.match(en, /4 columns|4 列/i)
    assert.match(zh, /4 列/)
    assert.match(tpl, /id 单元格内不要用粗体/)
    assert.match(en, /bold|粗体|\*\*/)
    assert.match(zh, /粗体/)
  })

  it('A6：docs/tasks 全量解析结果零变化（二次相等 · 有闸行则无空解析告警）', () => {
    const files = listTaskMdFiles()
    assert.ok(files.length >= 20, `expected many task files, got ${files.length}`)
    const first: Record<string, string> = {}
    for (const abs of files) {
      const rel = path.relative(KIT, abs).replace(/\\/g, '/')
      const content = readFileSync(abs, 'utf8')
      const warnings: string[] = []
      const gates = parseHumanGates(content, { warnings })
      first[rel] = gatesFingerprint(gates)
      if (gates.length > 0) {
        assert.equal(warnings.length, 0, `${rel} had gates but empty-table warning`)
      }
    }
    for (const abs of files) {
      const rel = path.relative(KIT, abs).replace(/\\/g, '/')
      const gates = parseHumanGates(readFileSync(abs, 'utf8'))
      assert.equal(gatesFingerprint(gates), first[rel], rel)
    }
  })

  it('A7：GATE_ROW_RE 未放宽（3 列仍空 · 源码仍四单元格）', () => {
    const src = readFileSync(path.join(KIT, 'src', 'cli-shared.ts'), 'utf8')
    assert.match(src, /GATE_ROW_RE\s*=\s*\n?\s*\/\^\\\|/)
    // 四捕获组形态保留（第 4 列必选）
    assert.match(src, /\(\[\^\*\|\]\+\?\)/)
    assert.match(src, /\(\[\^\|\]\*\)\\\|/)
    assert.equal(parseHumanGates(taskBody(COL3_APPROVED)).length, 0)
    assert.equal(parseHumanGates(taskBody(COL4_APPROVED)).length, 1)
  })

  it('CLI：gate-check --json 3 列 ⇒ warnings[] · blocked 仍 true · stdout 无 WARN', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'w2-gate-3col-'))
    try {
      const git = spawnSync('git', ['init'], { cwd: dir, encoding: 'utf8' })
      assert.equal(git.status, 0, git.stderr)
      const taskRel = 'task_w2_3col.md'
      writeFileSync(path.join(dir, taskRel), taskBody(COL3_APPROVED), 'utf8')
      const r = runCli(['gate-check', '--target', dir, '--task', taskRel, '--json'], dir)
      assert.equal(r.status, 2, r.stderr + r.stdout)
      const payload = JSON.parse(r.stdout) as { blocked: boolean; warnings?: string[]; verdict: string }
      assert.equal(payload.blocked, true)
      assert.equal(payload.verdict, 'BLOCKED')
      assert.ok(Array.isArray(payload.warnings) && payload.warnings.length === 1)
      assert.equal(payload.warnings![0], EMPTY_GATE_TABLE_WARNING)
      assert.match(r.stderr, /WARN:/)
      assert.doesNotMatch(r.stdout, /WARN:/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('CLI：gate-check --json 4 列 approved ⇒ 无 warnings · PASS', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'w2-gate-4col-'))
    try {
      const git = spawnSync('git', ['init'], { cwd: dir, encoding: 'utf8' })
      assert.equal(git.status, 0, git.stderr)
      const taskRel = 'task_w2_4col.md'
      writeFileSync(path.join(dir, taskRel), taskBody(COL4_APPROVED), 'utf8')
      const r = runCli(['gate-check', '--target', dir, '--task', taskRel, '--json'], dir)
      assert.equal(r.status, 0, r.stderr + r.stdout)
      const payload = JSON.parse(r.stdout) as { blocked: boolean; warnings?: string[]; verdict: string }
      assert.equal(payload.blocked, false)
      assert.equal(payload.verdict, 'PASS')
      assert.equal(payload.warnings, undefined)
      assert.doesNotMatch(r.stderr, /WARN:.*0 行/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
