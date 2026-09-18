/**
 * 3.0.1 W3 · pins IO fail-closed（P3-8）
 * A1 截断 JSON / A2 坏 pins.yaml / A3 chmod 000 / A4 冲突标记 /
 * A5 缺文件原文案 / A6 基线 pins check rc=0。
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmodSync, existsSync, unlinkSync } from 'node:fs'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { runCore } from './_helpers/core-harness.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

const MIN_PINS_YAML = [
  'version: "1"',
  'truth_source: package.json#version',
  'pins:',
  '  - id: pin-01',
  '    path: package.json',
  '    extract: { kind: json-field, field: version }',
  '    expected: { kind: self }',
  '    required: true',
  '    fixable: false',
  '',
].join('\n')

const GOOD_PKG = JSON.stringify({ name: 'spec-wave', version: '3.1.4', bin: { 'spec-wave': 'bin/specgate.js' } }, null, 2) + '\n'

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'w3-pins-io-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

async function makeMinFixture(dir: string): Promise<void> {
  await mkdir(path.join(dir, 'assets'), { recursive: true })
  await writeFile(path.join(dir, 'assets', 'release-pins.yaml'), MIN_PINS_YAML, 'utf8')
  await writeFile(path.join(dir, 'package.json'), GOOD_PKG, 'utf8')
}

function runCliSpawn(args: string[], cwd: string): { status: number | null; combined: string } {
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd,
    env: { ...process.env },
  })
  return { status: r.status, combined: (r.stdout ?? '') + '\n' + (r.stderr ?? '') }
}

describe('3.0.1 W3 · pins IO fail-closed（P3-8）', { concurrency: 1 }, () => {
  it('A1 截断 JSON ⇒ exit 2 + PINS: BLOCKED', async () => {
    await withTemp(async (dir) => {
      await makeMinFixture(dir)
      await writeFile(path.join(dir, 'package.json'), '{', 'utf8')
      const r = await runCore(['pins', 'check', '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /PINS: BLOCKED/)
      assert.match(r.combined, /不可解析或不可读/)
    })
  })

  it('A2 坏 pins.yaml ⇒ exit 2 + PINS: BLOCKED（对称不回退）', async () => {
    await withTemp(async (dir) => {
      await makeMinFixture(dir)
      await writeFile(path.join(dir, 'assets', 'release-pins.yaml'), 'pins: [[[[ not yaml', 'utf8')
      const r = await runCore(['pins', 'check', '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /PINS: BLOCKED/)
      assert.match(r.combined, /声明源/)
    })
  })

  it('A3 chmod 000 ⇒ exit 2 + PINS: BLOCKED', async () => {
    await withTemp(async (dir) => {
      await makeMinFixture(dir)
      const abs = path.join(dir, 'package.json')
      chmodSync(abs, 0o000)
      try {
        // 权限位在子进程更稳（进程内可能仍可读同 uid 文件 · 用 spawn）
        const r = runCliSpawn(['pins', 'check', '--target', dir], dir)
        assert.equal(r.status, 2, r.combined)
        assert.match(r.combined, /PINS: BLOCKED/)
        assert.match(r.combined, /不可解析或不可读/)
      } finally {
        chmodSync(abs, 0o644)
      }
    })
  })

  it('A4 残留 git 冲突标记 ⇒ exit 2 + PINS: BLOCKED', async () => {
    await withTemp(async (dir) => {
      await makeMinFixture(dir)
      const conflicted = [
        '{',
        '<<<<<<< HEAD',
        '  "version": "3.1.4"',
        '=======',
        '  "version": "9.9.9"',
        '>>>>>>> other',
        '}',
        '',
      ].join('\n')
      await writeFile(path.join(dir, 'package.json'), conflicted, 'utf8')
      const r = await runCore(['pins', 'check', '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /PINS: BLOCKED/)
      assert.match(r.combined, /不可解析或不可读/)
    })
  })

  it('A5 缺 package.json ⇒ 原文案「真值源缺失」· exit 2', async () => {
    await withTemp(async (dir) => {
      await makeMinFixture(dir)
      unlinkSync(path.join(dir, 'package.json'))
      assert.equal(existsSync(path.join(dir, 'package.json')), false)
      const r = await runCore(['pins', 'check', '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /PINS: BLOCKED · 真值源缺失: package\.json（exit 2）/)
      assert.doesNotMatch(r.combined, /不可解析或不可读/)
    })
  })

  it('A6 完好仓 pins check：pin-10 tag 缺失为设计红，其余须对齐', () => {
    const r = runCliSpawn(['pins', 'check'], KIT)
    const onlyPin10 =
      r.status === 2 &&
      /\[missing\] pin-10 /.test(r.combined) &&
      !/\[mismatch\]/.test(r.combined) &&
      !/\[missing\] pin-(?!10\b)/.test(r.combined)
    if (onlyPin10) {
      assert.match(r.combined, /git tag 缺失/)
      return
    }
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /PINS: PASS/)
  })
})
