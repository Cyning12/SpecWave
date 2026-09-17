/**
 * 3.0 W7 TTY 色彩 hotfix · 测试 spawn env 确定化回归锁（验收 #1/#3 · F-TC-01/02 · R2-A1）
 *
 * 三把锁（先红后绿：本文件在 `test/_helpers/plain-env.ts` 建成前因 import 失败而红）：
 *  ① 契约锁 —— plainEnv() 在 ambient FORCE_COLOR/NO_COLOR 任意组合下恒为
 *     FORCE_COLOR='0' ∧ NO_COLOR='1'（R2-A1：进程内字段断言满足「子进程 env 钉死」可观测性）；
 *  ② 现象锁 —— 显式 FORCE_COLOR=1 spawn 扫描器 ⇒ stdout 确实含 ANSI，且 stripAnsi()
 *     可把数字实参着色还原为「文件数: 0」（证明 B 机制真实存在 + 断言侧可还原）；
 *  ③ 修复锁 —— plainEnv() spawn 扫描器 ⇒ stdout 零 ANSI ∧ stderr 零
 *     NO_COLOR/FORCE_COLOR 互斥警告 ∧ 子进程 env 经 spawn 探针证实钉死 ∧ 含「文件数: 0」。
 *
 * stripAnsi 仅用于断言还原（现象锁）；修复锁直接断言零 ANSI，不依赖 stripAnsi（F-TC-02）。
 * 本套件在临时目录树中 spawn 扫描器（与仓内 docs/tasks/* 实态无关 · CI 恒跑）。
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { plainEnv, stripAnsi } from './_helpers/plain-env.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCANNER = path.join(KIT, 'scripts', 'scan-human-gates-baseline.mts')

const ANSI_RE = /\u001b\[/
const NO_COLOR_WARNING = "The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set"
const FORCE_COLOR_WARNING = "The 'FORCE_COLOR' env is ignored due to the 'NO_COLOR' env being set"

/** 最小临时树：scanner 的 REPO_ROOT 自 import.meta.url 推导，故保 scripts/ + src/ 相对结构。 */
function makeTempTree(): { root: string; out: string } {
  const root = mkdtempSync(path.join(os.tmpdir(), 'w7-plain-env-'))
  mkdirSync(path.join(root, 'scripts'), { recursive: true })
  mkdirSync(path.join(root, 'src'), { recursive: true })
  copyFileSync(SCANNER, path.join(root, 'scripts', 'scan-human-gates-baseline.mts'))
  copyFileSync(path.join(KIT, 'src', 'cli-shared.ts'), path.join(root, 'src', 'cli-shared.ts'))
  return { root, out: path.join(root, 'snapshot.json') }
}

function spawnScanner(env: NodeJS.ProcessEnv): { status: number | null; stdout: string; stderr: string } {
  const { root, out } = makeTempTree()
  try {
    const r = spawnSync(
      process.execPath,
      ['--experimental-strip-types', path.join(root, 'scripts', 'scan-human-gates-baseline.mts'), `--out=${out}`],
      { encoding: 'utf8', cwd: root, env },
    )
    return { status: r.status, stdout: r.stdout ?? '', stderr: r.stderr ?? '' }
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

/** 现象锁 env：显式强制着色；删 NO_COLOR 以隔离「仅 A 机制（着色）」面（防互斥警告混入）。 */
function forcedColorEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env, FORCE_COLOR: '1' }
  delete env.NO_COLOR
  return env
}

describe('3.0 W7 hotfix · 测试 spawn env 确定化回归锁（plainEnv · 验收 #1/#3）', { concurrency: 1 }, () => {
  it('契约锁：plainEnv() 在 ambient 任意组合下恒 FORCE_COLOR=0 ∧ NO_COLOR=1 · stripAnsi 还原单测', () => {
    const combos: NodeJS.ProcessEnv[] = [
      {},
      { FORCE_COLOR: '1' },
      { NO_COLOR: '1' },
      { FORCE_COLOR: '1', NO_COLOR: '1' },
      { FORCE_COLOR: '0' },
      { FORCE_COLOR: '2' },
      { FORCE_COLOR: 'true' },
    ]
    const backup = { ...process.env }
    try {
      for (const combo of combos) {
        delete process.env.FORCE_COLOR
        delete process.env.NO_COLOR
        Object.assign(process.env, combo)
        const env = plainEnv()
        assert.equal(env.FORCE_COLOR, '0', `combo=${JSON.stringify(combo)} 须钉死 FORCE_COLOR=0`)
        assert.equal(env.NO_COLOR, '1', `combo=${JSON.stringify(combo)} 须钉死 NO_COLOR=1`)
      }
    } finally {
      delete process.env.FORCE_COLOR
      delete process.env.NO_COLOR
      if (backup.FORCE_COLOR !== undefined) process.env.FORCE_COLOR = backup.FORCE_COLOR
      if (backup.NO_COLOR !== undefined) process.env.NO_COLOR = backup.NO_COLOR
    }
    assert.equal(stripAnsi('a\u001b[33m0\u001b[39m'), 'a0', 'stripAnsi 须还原 SGR 数字着色')
    assert.equal(stripAnsi('plain'), 'plain', 'stripAnsi 对无色输入恒等')
  })

  it('现象锁：显式 FORCE_COLOR=1 spawn 扫描器 ⇒ stdout 含 ANSI 且 stripAnsi 还原「文件数: 0」', () => {
    const r = spawnScanner(forcedColorEnv())
    assert.equal(r.status, 0, `stderr=${r.stderr}\nstdout=${r.stdout}`)
    assert.ok(
      ANSI_RE.test(r.stdout),
      `FORCE_COLOR=1 下扫描器 stdout 须含 ANSI（数字实参着色 · A 机制）:\n${JSON.stringify(r.stdout)}`,
    )
    assert.ok(
      stripAnsi(r.stdout).includes('文件数: 0'),
      `stripAnsi 后须还原「文件数: 0」:\n${stripAnsi(r.stdout)}`,
    )
  })

  it('修复锁：plainEnv() spawn 扫描器 ⇒ 零 ANSI ∧ 零互斥警告 ∧ 含「文件数: 0」', () => {
    const r = spawnScanner(plainEnv())
    assert.equal(r.status, 0, `stderr=${r.stderr}\nstdout=${r.stdout}`)
    assert.ok(!ANSI_RE.test(r.stdout), `plainEnv() 下 stdout 须零 ANSI:\n${JSON.stringify(r.stdout)}`)
    assert.ok(r.stdout.includes('文件数: 0'), `plainEnv() 下须含「文件数: 0」:\n${r.stdout}`)
    assert.ok(!r.stderr.includes(NO_COLOR_WARNING), `不得出现 NO_COLOR/FORCE_COLOR 互斥警告:\n${r.stderr}`)
    assert.ok(!r.stderr.includes(FORCE_COLOR_WARNING), `不得出现 FORCE_COLOR/NO_COLOR 互斥警告:\n${r.stderr}`)
  })

  it('修复锁增强（R2-A1 spawn 探针）：plainEnv() 子进程实收 NO_COLOR=1 ∧ FORCE_COLOR=0', () => {
    const r = spawnSync(
      process.execPath,
      ['-e', 'process.stdout.write(JSON.stringify({ NO_COLOR: process.env.NO_COLOR, FORCE_COLOR: process.env.FORCE_COLOR }))'],
      { encoding: 'utf8', env: plainEnv() },
    )
    assert.equal(r.status, 0, r.stderr)
    const got = JSON.parse(r.stdout) as { NO_COLOR?: string; FORCE_COLOR?: string }
    assert.equal(got.NO_COLOR, '1', 'plainEnv() 须向子进程传入 NO_COLOR=1')
    assert.equal(got.FORCE_COLOR, '0', 'plainEnv() 须向子进程传入 FORCE_COLOR=0')
  })
})
