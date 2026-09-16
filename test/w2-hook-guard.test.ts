import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  commandMatchesTrigger,
  DEFAULT_GATE_COMMAND,
  extractEventCommand,
} from '../src/host/hookguard.ts'
import { yamlLoad } from '../src/yaml.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const LIVE_TABLE = path.join(KIT, 'assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')

/**
 * 3.0 W2 阶段三 · hook-guard 门禁分发入口（S3.3 ③ · 阶段二物化命令串兑现体）。
 * 红绿 fixture：命中+门禁红 → exit 2 阻断 · 命中+门禁绿 → exit 0 · 未命中 → exit 0 静默（gate 未执行）·
 * 坏 stdin → fail-open exit 0 注记（裁决①）· 空 stdin → 直接调用跑门禁（裁决②）·
 * 缺省 gate = 内置表 hooks.command 逐字（联动断言 · 声明-分发不漂移）。
 */

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string }

function runGuard(args: string[], opts: { input?: string; env?: Record<string, string> } = {}): RunResult {
  const env = { ...process.env, ...opts.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, 'hook-guard', ...args], {
    encoding: 'utf8',
    cwd: KIT,
    env,
    input: opts.input,
  })
  const stdout = r.stdout ?? ''
  const stderr = r.stderr ?? ''
  return { status: r.status, stdout, stderr, combined: `${stdout}\n${stderr}` }
}

const GATE_GREEN = 'node -e "process.exit(0)"'
const GATE_RED = 'node -e "process.exit(2)"'

const CLAUDE_EVENT = (cmd: string) => JSON.stringify({ tool_name: 'Bash', tool_input: { command: cmd } })
const CURSOR_EVENT = (cmd: string) => JSON.stringify({ command: cmd, cwd: '/repo' })
const GEMINI_EVENT = (cmd: string) =>
  JSON.stringify({ tool_name: 'run_shell_command', tool_input: { command: cmd } })

describe('3.0 W2 阶段三 · hook-guard 分发（S3.3 ③ · 红绿 fixture）', { concurrency: 1 }, () => {
  it('--help → 用法 exit 0', () => {
    const r = runGuard(['--help'])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /hook-guard --trigger/)
  })

  it('命中 pre-commit（三族事件形态）+ gate 绿 → exit 0 · gate 红 → exit 2 阻断', () => {
    for (const [label, event] of [
      ['claude', CLAUDE_EVENT('git commit -m x')],
      ['cursor', CURSOR_EVENT('git commit -m x')],
      ['gemini', GEMINI_EVENT('git commit -m x')],
    ] as const) {
      const green = runGuard(['--trigger', 'pre-commit', '--command', GATE_GREEN], { input: event })
      assert.equal(green.status, 0, `${label} 绿: ${green.combined}`)
      const red = runGuard(['--trigger', 'pre-commit', '--command', GATE_RED], { input: event })
      assert.equal(red.status, 2, `${label} 红: ${red.combined}`)
      assert.match(red.combined, /阻断 pre-commit/)
    }
  })

  it('命中 pre-archive（spec-wave task close · npx 前缀两形态）→ gate 红 exit 2', () => {
    for (const cmd of ['spec-wave task close --task docs/tasks/active/t.md --yes', 'npx spec-wave task close --yes']) {
      const r = runGuard(['--trigger', 'pre-archive', '--command', GATE_RED], {
        input: CLAUDE_EVENT(cmd),
      })
      assert.equal(r.status, 2, `${cmd}: ${r.combined}`)
      assert.match(r.combined, /阻断 pre-archive/)
    }
    // pre-archive trigger 不匹配 git commit（触发点隔离）
    const miss = runGuard(['--trigger', 'pre-archive', '--command', GATE_RED], {
      input: CLAUDE_EVENT('git commit -m x'),
    })
    assert.equal(miss.status, 0, miss.combined)
  })

  it('未命中（git status / git commit 子串误植 gitscommit）→ exit 0 静默 · gate 未执行（marker 零副作用）', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'w2-hook-guard-'))
    try {
      const marker = path.join(dir, 'gate-ran.marker')
      const gateMarker = `node -e "require('fs').writeFileSync(process.env.HOOK_GUARD_MARKER,'x')"`
      for (const cmd of ['git status', 'git add .', 'gitscommit -m x', 'echo "git commit"']) {
        const r = runGuard(['--trigger', 'pre-commit', '--command', gateMarker], {
          input: CURSOR_EVENT(cmd),
          env: { HOOK_GUARD_MARKER: marker },
        })
        assert.equal(r.status, 0, `${cmd}: ${r.combined}`)
        assert.equal(existsSync(marker), false, `${cmd} 不得执行 gate`)
      }
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('坏 stdin（非 JSON / 无 command 字段）→ fail-open exit 0 + stderr 注记（裁决① · 不崩不全阻断）', () => {
    const bad = runGuard(['--trigger', 'pre-commit', '--command', GATE_RED], { input: 'not-json{' })
    assert.equal(bad.status, 0, bad.combined)
    assert.match(bad.combined, /fail-open 放行/)
    const noCmd = runGuard(['--trigger', 'pre-commit', '--command', GATE_RED], {
      input: JSON.stringify({ tool_name: 'Bash', tool_input: { file_path: '/x' } }),
    })
    assert.equal(noCmd.status, 0, noCmd.combined)
    assert.match(noCmd.combined, /fail-open 放行/)
  })

  it('空 stdin → 直接调用形态按命中跑门禁（裁决② · 未来 shell-hook git 层口径）', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'w2-hook-guard-direct-'))
    try {
      const marker = path.join(dir, 'direct.marker')
      const gateMarker = `node -e "require('fs').writeFileSync(process.env.HOOK_GUARD_MARKER,'x')"`
      const r = runGuard(['--trigger', 'pre-commit', '--command', gateMarker], {
        input: '',
        env: { HOOK_GUARD_MARKER: marker },
      })
      assert.equal(r.status, 0, r.combined)
      assert.equal(existsSync(marker), true, '空 stdin 须跑门禁')
      const red = runGuard(['--trigger', 'pre-commit', '--command', GATE_RED], { input: '' })
      assert.equal(red.status, 2, red.combined)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('用法错：缺 --trigger / 未知 trigger → exit 1', () => {
    const missing = runGuard([])
    assert.equal(missing.status, 1, missing.combined)
    assert.match(missing.combined, /--trigger/)
    const unknown = runGuard(['--trigger', 'pre-push'])
    assert.equal(unknown.status, 1, unknown.combined)
    assert.match(unknown.combined, /未知 trigger.*pre-push/)
  })

  it('缺省 gate = 内置表 hooks.command 逐字（声明-分发联动不漂移 · S3.3）', () => {
    assert.equal(DEFAULT_GATE_COMMAND, 'npx spec-wave verify --target .')
    const doc = yamlLoad(readFileSync(LIVE_TABLE, 'utf8')) as {
      hosts: { host_id: string; surfaces: { hooks?: { command?: string } } }[]
    }
    for (const id of ['claude', 'cursor', 'gemini']) {
      const row = doc.hosts.find((h) => h.host_id === id)!
      assert.equal(row.surfaces.hooks?.command, DEFAULT_GATE_COMMAND, `${id} 声明 command 漂移`)
    }
  })

  it('纯函数单测：extractEventCommand 三族形态 + commandMatchesTrigger 词界', () => {
    assert.equal(extractEventCommand(JSON.parse(CLAUDE_EVENT('git commit'))), 'git commit')
    assert.equal(extractEventCommand(JSON.parse(CURSOR_EVENT('ls'))), 'ls')
    assert.equal(extractEventCommand(JSON.parse(GEMINI_EVENT('pwd'))), 'pwd')
    assert.equal(extractEventCommand({}), null)
    assert.equal(extractEventCommand('str'), null)
    assert.equal(commandMatchesTrigger('git commit -m x', 'pre-commit'), true)
    assert.equal(commandMatchesTrigger('git commit', 'pre-commit'), true)
    assert.equal(commandMatchesTrigger('git  commit', 'pre-commit'), true)
    assert.equal(commandMatchesTrigger('gitscommit', 'pre-commit'), false)
    assert.equal(commandMatchesTrigger('git commitish', 'pre-commit'), false)
    assert.equal(commandMatchesTrigger('spec-wave task close --yes', 'pre-archive'), true)
    assert.equal(commandMatchesTrigger('npx spec-wave task close --yes', 'pre-archive'), true)
    assert.equal(commandMatchesTrigger('spec-wave task closer', 'pre-archive'), false)
    assert.equal(commandMatchesTrigger('git commit', 'pre-archive'), false)
  })
})
