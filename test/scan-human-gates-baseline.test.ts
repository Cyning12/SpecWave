/**
 * 3.0 W1 hotfix · 闸基线扫描器缺失目录健壮性负向锁（验收 #1 · F-HOT-03/F-HOT-04）
 *
 * 背景：CI run 35066550895 红 —— 新鲜 checkout 中 docs/tasks/active/（空目录 · git 不跟踪）
 * 不存在，scanner readdirSync 裸调用 ENOENT 崩溃。本套件在**无 active/（及无 done/）的
 * 临时目录树**中 spawn 扫描器，钉死修复后行为：
 *   - exit 0 · 缺失目录按零文件处理（不崩）
 *   - console skipped-missing 注记逐字断言（F-HOT-03 可诊断）
 *   - snapshot meta.skipped_missing_dirs 加性键逐字断言（双通道诊断）
 *   - 目录存在时零注记零 meta 键（F-HOT-01 零行为差的套件内半锁）
 * 本套件在临时树中运行，与仓内 docs/tasks/active/ 实际状态无关（CI 恒跑）。
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCANNER = path.join(KIT, 'scripts', 'scan-human-gates-baseline.mts')

const SKIPPED_NOTE_PREFIX = 'skipped-missing 目录（缺失按零文件处理）: '

/**
 * 最小临时树：scanner 的 REPO_ROOT 自 import.meta.url 推导（scripts/ 上一级），
 * 故须保 scripts/scan-human-gates-baseline.mts + src/cli-shared.ts 相对结构
 * （cli-shared.ts 仅依赖 node 内置模块 · 实读复核）。
 */
function makeTempTree(opts: { active?: boolean; done?: boolean }): { root: string; out: string } {
  const root = mkdtempSync(path.join(os.tmpdir(), 'w1-scan-missing-dirs-'))
  mkdirSync(path.join(root, 'scripts'), { recursive: true })
  mkdirSync(path.join(root, 'src'), { recursive: true })
  copyFileSync(SCANNER, path.join(root, 'scripts', 'scan-human-gates-baseline.mts'))
  copyFileSync(path.join(KIT, 'src', 'cli-shared.ts'), path.join(root, 'src', 'cli-shared.ts'))
  if (opts.active) mkdirSync(path.join(root, 'docs', 'tasks', 'active'), { recursive: true })
  if (opts.done) mkdirSync(path.join(root, 'docs', 'tasks', 'done'), { recursive: true })
  return { root, out: path.join(root, 'snapshot.json') }
}

function runScanner(root: string, out: string): { status: number | null; stdout: string; stderr: string } {
  const r = spawnSync(
    process.execPath,
    ['--experimental-strip-types', path.join(root, 'scripts', 'scan-human-gates-baseline.mts'), `--out=${out}`],
    { encoding: 'utf8', cwd: root },
  )
  return { status: r.status, stdout: r.stdout ?? '', stderr: r.stderr ?? '' }
}

describe('3.0 W1 hotfix · 扫描器缺失目录负向锁（验收 #1 · F-HOT-03/04 · CI 恒跑）', { concurrency: 1 }, () => {
  it('双目录均缺失（无 active/ 且无 done/）→ exit 0 · 文件数 0 · skipped 注记逐字 · meta 双目录', () => {
    const { root, out } = makeTempTree({})
    try {
      const r = runScanner(root, out)
      assert.equal(r.status, 0, `stdout=${r.stdout}
stderr=${r.stderr}`)
      // F-HOT-03：console skipped-missing 注记逐字断言
      assert.ok(
        r.stdout.includes(SKIPPED_NOTE_PREFIX + 'docs/tasks/active + docs/tasks/done'),
        `console 缺 skipped 注记:
${r.stdout}`,
      )
      assert.ok(r.stdout.includes('文件数: 0'), `缺失目录应按零文件处理:
${r.stdout}`)
      const snap = JSON.parse(readFileSync(out, 'utf8')) as {
        meta: { skipped_missing_dirs?: string[] }
        summary: { files_scanned: number; total_gate_rows: number }
        files: unknown[]
      }
      // 双通道诊断：snapshot meta 加性键逐字断言（F-HOT-04：active/done 双目录同式守卫）
      assert.deepEqual(snap.meta.skipped_missing_dirs, ['docs/tasks/active', 'docs/tasks/done'])
      assert.equal(snap.summary.files_scanned, 0)
      assert.equal(snap.summary.total_gate_rows, 0)
      assert.deepEqual(snap.files, [])
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('仅 active/ 缺失（done/ 存在）→ exit 0 · 注记/meta 只列 active（双目录守卫各自独立）', () => {
    const { root, out } = makeTempTree({ done: true })
    try {
      const r = runScanner(root, out)
      assert.equal(r.status, 0, `stdout=${r.stdout}
stderr=${r.stderr}`)
      assert.ok(
        r.stdout.includes(SKIPPED_NOTE_PREFIX + 'docs/tasks/active'),
        `console 缺 skipped 注记:
${r.stdout}`,
      )
      assert.ok(!r.stdout.includes(SKIPPED_NOTE_PREFIX + 'docs/tasks/active + docs/tasks/done'), r.stdout)
      const snap = JSON.parse(readFileSync(out, 'utf8')) as {
        meta: { skipped_missing_dirs?: string[] }
        summary: { files_scanned: number }
      }
      assert.deepEqual(snap.meta.skipped_missing_dirs, ['docs/tasks/active'])
      assert.equal(snap.summary.files_scanned, 0)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('双目录均在（空目录）→ exit 0 · 零 skipped 注记 · meta 无 skipped_missing_dirs 键（F-HOT-01 零行为差半锁）', () => {
    const { root, out } = makeTempTree({ active: true, done: true })
    try {
      const r = runScanner(root, out)
      assert.equal(r.status, 0, `stdout=${r.stdout}
stderr=${r.stderr}`)
      assert.ok(!r.stdout.includes('skipped-missing'), `有目录时不得出现 skipped 注记:
${r.stdout}`)
      const snap = JSON.parse(readFileSync(out, 'utf8')) as { meta: Record<string, unknown> }
      assert.ok(!('skipped_missing_dirs' in snap.meta), '有目录时 meta 不得含 skipped_missing_dirs 键（加性键零差异）')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
