import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const V1_FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'mvp-hosts_2_4_2.yaml')

/**
 * 3.0 W2 阶段二 · hooks 物化（config-hook 三宿主落点 · S3.3 · F-W2-10/F-W2-11 同式 conflict 纪律）+
 * none 宿主降级留痕（验收 #6 · S3.5 · 硬约束 9 L3 负向断言）。
 * 30 裁决登记：
 *  ① 物化条目 command = npx spec-wave hook-guard --trigger <t>（S3.3 分发入口语义 · hook-guard CLI 归后续棒③）
 *  ② cursor hooks.json 根骨架 version: 1 · 既有用户 version 键保留
 *  ③ JSON 冲突 = 结构性冲突（根非对象/hooks 非对象/事件键非数组/JSON 坏）→ conflict 点名 · 内容差异一律深合并保用户键
 *  ④ 外部 v1 表未声明 hooks → degraded 注记静默（仅显式声明 none 留痕 · 本测试钉死）
 *  ⑤ config-hook 声明但无落点映射宿主 → fail exit 2（fail-closed）
 */

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string }

function runCli(args: string[], opts: { cwd?: string } = {}): RunResult {
  const env = { ...process.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd: opts.cwd ?? KIT,
    env,
  })
  const stdout = r.stdout ?? ''
  const stderr = r.stderr ?? ''
  return { status: r.status, stdout, stderr, combined: `${stdout}\n${stderr}` }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'w2-hooks-mat-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

type ApplyJson = {
  hosts: string[]
  planned: string[]
  written: string[]
  skipped: string[]
  conflict: string[]
  removed: string[]
  degraded_none: string[]
  ok: boolean
  verdict: string
}

const CLAUDE_SETTINGS = '.claude/settings.json'
const CURSOR_HOOKS = '.cursor/hooks.json'
const GEMINI_SETTINGS = '.gemini/settings.json'

function guardCmd(trigger: string): string {
  return `npx spec-wave hook-guard --trigger ${trigger}`
}

function expectedClaudeEntries() {
  return [
    { matcher: 'Bash', hooks: [{ type: 'command', command: guardCmd('pre-commit') }] },
    { matcher: 'Bash', hooks: [{ type: 'command', command: guardCmd('pre-archive') }] },
  ]
}

describe('3.0 W2 阶段二 · hooks 物化（config-hook 三宿主落点 · S3.3）', { concurrency: 1 }, () => {
  it('claude：apply --yes 物化 .claude/settings.json（PreToolUse × 2 trigger 逐字）· dry-run 计划含落点零写入', async () => {
    await withTemp(async (dir) => {
      const dry = runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--json'])
      assert.equal(dry.status, 0, dry.combined)
      const dryParsed = JSON.parse(dry.stdout) as ApplyJson
      assert.ok(dryParsed.planned.includes(CLAUDE_SETTINGS), JSON.stringify(dryParsed.planned))
      assert.equal(existsSync(path.join(dir, CLAUDE_SETTINGS)), false)

      const r = runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--yes', '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.ok(parsed.written.includes(CLAUDE_SETTINGS), JSON.stringify(parsed.written))
      const settings = JSON.parse(await readFile(path.join(dir, CLAUDE_SETTINGS), 'utf8')) as {
        hooks?: { PreToolUse?: unknown[] }
      }
      assert.deepEqual(settings.hooks?.PreToolUse, expectedClaudeEntries())
    })
  })

  it('claude：JSON 深合并保用户键（F-W2-10）—— 用户根键/用户 hook 条目全保留 · 产品条目追加', async () => {
    await withTemp(async (dir) => {
      await mkdir(path.join(dir, '.claude'), { recursive: true })
      const userEntry = { matcher: 'WebFetch', hooks: [{ type: 'command', command: 'user-custom-hook' }] }
      await writeFile(
        path.join(dir, CLAUDE_SETTINGS),
        JSON.stringify({ userRootKey: true, hooks: { PreToolUse: [userEntry], SessionStart: [{ matcher: '*', hooks: [{ type: 'command', command: 'user-session' }] }] } }, null, 2) + '\n',
      )
      const r = runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--yes', '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.ok(parsed.written.includes(CLAUDE_SETTINGS))
      const settings = JSON.parse(await readFile(path.join(dir, CLAUDE_SETTINGS), 'utf8')) as {
        userRootKey?: boolean
        hooks?: { PreToolUse?: unknown[]; SessionStart?: unknown[] }
      }
      assert.equal(settings.userRootKey, true, '用户根键被覆写')
      assert.deepEqual(settings.hooks?.SessionStart, [{ matcher: '*', hooks: [{ type: 'command', command: 'user-session' }] }], '用户其他事件键被覆写')
      const preToolUse = settings.hooks?.PreToolUse ?? []
      assert.deepEqual(preToolUse[0], userEntry, '用户条目须原位保留（前）')
      assert.deepEqual(preToolUse.slice(1), expectedClaudeEntries())
    })
  })

  it('claude：幂等 —— 二次 apply skipped 含落点 · written 不再含', async () => {
    await withTemp(async (dir) => {
      runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--yes'])
      const second = runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--yes', '--json'])
      assert.equal(second.status, 0, second.combined)
      const parsed = JSON.parse(second.stdout) as ApplyJson
      assert.ok(parsed.skipped.includes(CLAUDE_SETTINGS), JSON.stringify(parsed))
      assert.ok(!parsed.written.includes(CLAUDE_SETTINGS))
    })
  })

  it('claude：本包管理条目被篡改 → apply 原位修复回声明逐字（marker = hook-guard 命令串识别）', async () => {
    await withTemp(async (dir) => {
      runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--yes'])
      const abs = path.join(dir, CLAUDE_SETTINGS)
      const tampered = JSON.parse(await readFile(abs, 'utf8')) as { hooks: { PreToolUse: { matcher: string; hooks: { type: string; command: string }[] }[] } }
      tampered.hooks.PreToolUse[0]!.matcher = 'Tampered'
      await writeFile(abs, JSON.stringify(tampered, null, 2) + '\n')
      const r = runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--yes', '--json'])
      assert.equal(r.status, 0, r.combined)
      const settings = JSON.parse(await readFile(abs, 'utf8')) as { hooks: { PreToolUse: unknown[] } }
      assert.deepEqual(settings.hooks.PreToolUse, expectedClaudeEntries(), '被篡改条目须修复回声明逐字')
    })
  })

  it('claude：结构性冲突（hooks 非对象 / JSON 损坏）→ conflict 点名 · 用户文件零覆写（F-W2-10）', async () => {
    await withTemp(async (dir) => {
      await mkdir(path.join(dir, '.claude'), { recursive: true })
      const abs = path.join(dir, CLAUDE_SETTINGS)
      const badShape = JSON.stringify({ hooks: 'user-string-not-object' }) + '\n'
      await writeFile(abs, badShape)
      const r = runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--yes', '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.ok(parsed.conflict.includes(CLAUDE_SETTINGS), JSON.stringify(parsed))
      assert.equal(await readFile(abs, 'utf8'), badShape, '冲突不得覆写用户配置')

      const broken = '{not-json\n'
      await writeFile(abs, broken)
      const r2 = runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--yes', '--json'])
      assert.equal(r2.status, 0, r2.combined)
      const parsed2 = JSON.parse(r2.stdout) as ApplyJson
      assert.ok(parsed2.conflict.includes(CLAUDE_SETTINGS))
      assert.equal(await readFile(abs, 'utf8'), broken, 'JSON 损坏不得覆写用户配置')
    })
  })

  it('cursor：物化 .cursor/hooks.json（version 1 + beforeShellExecution × 2 · exit 2=deny 语义归 hook-guard）', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['host', 'apply', '--tools', 'cursor', '--target', dir, '--yes', '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.ok(parsed.written.includes(CURSOR_HOOKS), JSON.stringify(parsed.written))
      const hooks = JSON.parse(await readFile(path.join(dir, CURSOR_HOOKS), 'utf8')) as {
        version?: number
        hooks?: { beforeShellExecution?: unknown[] }
      }
      assert.equal(hooks.version, 1)
      assert.deepEqual(hooks.hooks?.beforeShellExecution, [
        { command: guardCmd('pre-commit') },
        { command: guardCmd('pre-archive') },
      ])
    })
  })

  it('gemini：物化 .gemini/settings.json（BeforeTool matcher run_shell_command × 2）', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['host', 'apply', '--tools', 'gemini', '--target', dir, '--yes', '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.ok(parsed.written.includes(GEMINI_SETTINGS), JSON.stringify(parsed.written))
      const settings = JSON.parse(await readFile(path.join(dir, GEMINI_SETTINGS), 'utf8')) as {
        hooks?: { BeforeTool?: unknown[] }
      }
      assert.deepEqual(settings.hooks?.BeforeTool, [
        { matcher: 'run_shell_command', hooks: [{ type: 'command', command: guardCmd('pre-commit') }] },
        { matcher: 'run_shell_command', hooks: [{ type: 'command', command: guardCmd('pre-archive') }] },
      ])
    })
  })

  it('update：hooks 落点幂等（二次 update skipped 含落点 · 用户键随合并保留）', async () => {
    await withTemp(async (dir) => {
      runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--yes'])
      const abs = path.join(dir, CLAUDE_SETTINGS)
      const cur = JSON.parse(await readFile(abs, 'utf8')) as Record<string, unknown>
      cur.userLaterKey = 'kept'
      await writeFile(abs, JSON.stringify(cur, null, 2) + '\n')
      const r = runCli(['host', 'update', '--tools', 'claude', '--target', dir, '--yes', '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as ApplyJson
      assert.ok(parsed.skipped.includes(CLAUDE_SETTINGS), JSON.stringify(parsed))
      const after = JSON.parse(await readFile(abs, 'utf8')) as { userLaterKey?: string }
      assert.equal(after.userLaterKey, 'kept')
    })
  })

  it('fail-closed：config-hook 声明但无落点映射的宿主 → apply exit 2 点名（族映射表外宿主不静默）', async () => {
    await withTemp(async (dir) => {
      const table = [
        'version: "1"',
        'schema_version: 2',
        'command_sets:',
        '  core: [verify]',
        '  expanded: [graph-check]',
        'hosts:',
        '  - host_id: acme-cfg',
        '    surfaces:',
        '      always_on: []',
        '      skills: []',
        '      commands: []',
        '      hooks:',
        '        mechanism: config-hook',
        '        triggers: [pre-commit]',
        '        command: "npx spec-wave verify --target ."',
        '',
      ].join('\n')
      const tableAbs = path.join(dir, 'acme-cfg-hosts.yaml')
      await writeFile(tableAbs, table)
      const targetDir = path.join(dir, 'target')
      await mkdir(targetDir, { recursive: true })
      const r = runCli(['host', 'apply', '--tools', 'acme-cfg', '--file', tableAbs, '--target', targetDir, '--yes'])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /acme-cfg/)
      assert.match(r.combined, /config-hook.*落点|落点.*config-hook|无物化落点/)
    })
  })
})

describe('3.0 W2 阶段二 · none 宿主降级留痕（验收 #6 · S3.5 · 硬约束 9）', { concurrency: 1 }, () => {
  it('显式 none（内置表 dsh）：apply human 含 degraded-none 降级行 · --json degraded_none 同键 · 输出不含 L3（负向断言）', async () => {
    await withTemp(async (dir) => {
      const human = runCli(['host', 'apply', '--tools', 'dsh', '--target', dir])
      assert.equal(human.status, 0, human.combined)
      assert.match(human.combined, /dsh · hooks: degraded-none（L1\+L2 · 宿主无 hook 机制 · 门禁仅 CLI 侧）/)
      assert.ok(!human.combined.includes('L3'), '输出不得暗示 L3（硬约束 9）')

      const json = runCli(['host', 'apply', '--tools', 'dsh', '--target', dir, '--json'])
      assert.equal(json.status, 0, json.combined)
      const parsed = JSON.parse(json.stdout) as ApplyJson
      assert.deepEqual(parsed.degraded_none, ['dsh'])
      assert.ok(!json.stdout.includes('L3'))
    })
  })

  it('外部 v1 表未声明 hooks → degraded 静默（裁决④：仅显式声明 none 留痕 · 外部表零行为变化）', async () => {
    await withTemp(async (dir) => {
      const human = runCli(['host', 'apply', '--tools', 'dsh', '--file', V1_FIXTURE, '--target', dir])
      assert.equal(human.status, 0, human.combined)
      assert.ok(!human.combined.includes('degraded-none'), 'v1 未声明缺省 none 不得打印降级行')

      const json = runCli(['host', 'apply', '--tools', 'dsh', '--file', V1_FIXTURE, '--target', dir, '--json'])
      assert.equal(json.status, 0, json.combined)
      const parsed = JSON.parse(json.stdout) as ApplyJson
      assert.deepEqual(parsed.degraded_none, [])
    })
  })

  it('config-hook 宿主不出现 degraded 注记（claude apply → degraded_none 空）', async () => {
    await withTemp(async (dir) => {
      const json = runCli(['host', 'apply', '--tools', 'claude', '--target', dir, '--json'])
      assert.equal(json.status, 0, json.combined)
      const parsed = JSON.parse(json.stdout) as ApplyJson
      assert.deepEqual(parsed.degraded_none, [])
    })
  })
})
