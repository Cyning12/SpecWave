/**
 * 3.0.1 W5 · 物化 hooks 可选钉版旗标（P2-2）
 * A1 无旗标 = 3.0.0 字面 · A2 带旗标含 @semver · A3 verify rc=0 ·
 * A5 帮助「实验性·缺省关闭」· 非法 semver exit 1 · 未钉版仍识别。
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { runCore } from './_helpers/core-harness.ts'
import {
  hookGuardCommand,
  isPackageManagedHookEntry,
  buildShellHookScript,
} from '../src/host/hooks.ts'
import { kitPackageSemver } from '../src/host/table.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

const UNPINNED_PRE = 'npx spec-wave hook-guard --trigger pre-commit'
const UNPINNED_ARCHIVE = 'npx spec-wave hook-guard --trigger pre-archive'

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string }

function runCli(args: string[], opts: { cwd?: string } = {}): RunResult {
  const env = { ...process.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd: opts.cwd ?? KIT,
    env,
  })
  return {
    status: r.status,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? '',
    combined: `${r.stdout ?? ''}\n${r.stderr ?? ''}`,
  }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'w5-pin-hook-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

function kitSemver(): string {
  const v = kitPackageSemver()
  assert.ok(v, 'package.json#version 须可读（缺省 kit_semver）')
  return v
}

describe('3.0.1 W5 · pin-hook-version（可选 · 实验性 · 缺省关闭）', { concurrency: 1 }, () => {
  it('A1 单元：无 pin 时 hookGuardCommand / shell-hook 与 3.0.0 逐字节一致', () => {
    assert.equal(hookGuardCommand('pre-commit'), UNPINNED_PRE)
    assert.equal(hookGuardCommand('pre-archive'), UNPINNED_ARCHIVE)
    assert.equal(
      buildShellHookScript(['pre-commit']),
      [
        '#!/bin/sh',
        '# spec-wave-managed: pre-commit hook（3.0 W2 · 门禁随包物化 · 勿手改 · host apply/update 幂等管理）',
        'exec npx spec-wave hook-guard --trigger pre-commit',
        '',
      ].join('\n'),
    )
  })

  it('A1/A2 CLI：同 target 无旗标 vs 带旗标 · cursor/claude 仅钉版段 diff', async () => {
    await withTemp(async (dirA) => {
      await withTemp(async (dirB) => {
        const ver = kitSemver()
        const a = await runCore([
          'host',
          'apply',
          '--tools',
          'cursor,claude',
          '--target',
          dirA,
          '--yes',
          '--json',
        ])
        assert.equal(a.status, 0, a.combined)
        const b = await runCore([
          'host',
          'apply',
          '--tools',
          'cursor,claude',
          '--target',
          dirB,
          '--yes',
          '--pin-hook-version',
          '--json',
        ])
        assert.equal(b.status, 0, b.combined)

        const cursorA = await readFile(path.join(dirA, '.cursor/hooks.json'), 'utf8')
        const cursorB = await readFile(path.join(dirB, '.cursor/hooks.json'), 'utf8')
        const claudeA = await readFile(path.join(dirA, '.claude/settings.json'), 'utf8')
        const claudeB = await readFile(path.join(dirB, '.claude/settings.json'), 'utf8')

        assert.ok(cursorA.includes(UNPINNED_PRE), '无旗标须无 @semver')
        assert.ok(!cursorA.includes(`spec-wave@`), '无旗标禁止 @')
        assert.ok(cursorB.includes(`npx spec-wave@${ver} hook-guard --trigger pre-commit`))
        assert.ok(!cursorB.includes(UNPINNED_PRE), '带旗标不得残留未钉版字面')

        // 仅钉版段差异：把 @ver 剥掉后应与无旗标逐字节一致
        const strip = (s: string) => s.replaceAll(`spec-wave@${ver}`, 'spec-wave')
        assert.equal(strip(cursorB), cursorA)
        assert.equal(strip(claudeB), claudeA)
        assert.ok(claudeA.includes(UNPINNED_ARCHIVE))
        assert.ok(claudeB.includes(`npx spec-wave@${ver} hook-guard --trigger pre-archive`))
      })
    })
  })

  it('A2 显式 SEMVER：--pin-hook-version=9.9.9 写入指定版本', async () => {
    await withTemp(async (dir) => {
      const r = await runCore([
        'host',
        'apply',
        '--tools',
        'cursor',
        '--target',
        dir,
        '--yes',
        '--pin-hook-version=9.9.9',
        '--json',
      ])
      assert.equal(r.status, 0, r.combined)
      const body = await readFile(path.join(dir, '.cursor/hooks.json'), 'utf8')
      assert.ok(body.includes('npx spec-wave@9.9.9 hook-guard --trigger pre-commit'))
    })
  })

  it('A3 带旗标物化后 host verify rc=0', async () => {
    await withTemp(async (dir) => {
      const apply = await runCore([
        'host',
        'apply',
        '--tools',
        'cursor,claude',
        '--target',
        dir,
        '--yes',
        '--pin-hook-version',
      ])
      assert.equal(apply.status, 0, apply.combined)
      const v = await runCore(['host', 'verify', '--tools', 'cursor,claude', '--target', dir])
      assert.equal(v.status, 0, v.combined)
      assert.match(v.combined, /HOST VERIFY:\s*PASS/)
    })
  })

  it('A5 帮助含实验性与缺省关闭；非法 semver exit 1', () => {
    const help = runCli(['host', 'apply', '--help'])
    assert.equal(help.status, 0, help.combined)
    assert.match(help.combined, /实验性/)
    assert.match(help.combined, /缺省关闭/)
    assert.match(help.combined, /pin-hook-version/)

    const bad = runCli([
      'host',
      'apply',
      '--tools',
      'cursor',
      '--target',
      os.tmpdir(),
      '--pin-hook-version=not-a-semver',
      '--json',
    ])
    assert.equal(bad.status, 1, bad.combined)
    assert.match(bad.combined, /SEMVER|semver|非法/i)

    const empty = runCli([
      'host',
      'apply',
      '--tools',
      'cursor',
      '--target',
      os.tmpdir(),
      '--pin-hook-version=',
      '--json',
    ])
    assert.equal(empty.status, 1, empty.combined)
  })

  it('update 同挂旗标（禁静默忽略）· 帮助可见', () => {
    const help = runCli(['host', 'update', '--help'])
    assert.equal(help.status, 0, help.combined)
    assert.match(help.combined, /pin-hook-version/)
    assert.match(help.combined, /实验性/)
  })

  it('marker 双形态：未钉版与钉版均可 isPackageManagedHookEntry', () => {
    const unpinned = { command: UNPINNED_PRE }
    const pinned = { command: `npx spec-wave@3.0.0 hook-guard --trigger pre-commit` }
    assert.equal(isPackageManagedHookEntry(unpinned, 'pre-commit'), true)
    assert.equal(isPackageManagedHookEntry(pinned, 'pre-commit'), true)
    assert.equal(isPackageManagedHookEntry({ command: 'user-custom' }, 'pre-commit'), false)
  })

  it('文档锁：CHANGELOG / RELEASING / 使用手册含实验性钉版与 CI 建议', () => {
    const changelog = readFileSync(path.join(KIT, 'CHANGELOG.md'), 'utf8')
    assert.match(changelog, /pin-hook-version/)
    assert.match(changelog, /实验性/)
    assert.match(changelog, /缺省关闭/)

    const releasing = readFileSync(path.join(KIT, 'RELEASING.md'), 'utf8')
    assert.match(releasing, /pin-hook-version|预热.*npm|npm.*缓存/)
    assert.ok(
      /hook-guard --command|--command/.test(releasing) || /预热/.test(releasing),
      'RELEASING 须含确定性 CI 三选一建议',
    )

    const guide = readFileSync(path.join(KIT, 'docs/guides/使用手册-v3.0.0-zh.md'), 'utf8')
    assert.match(guide, /pin-hook-version/)
    assert.match(guide, /实验性/)
    assert.match(guide, /缺省关闭/)
    assert.match(guide, /--command/)
  })
})
