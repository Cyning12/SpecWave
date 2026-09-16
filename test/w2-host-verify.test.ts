import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { chmod, mkdtemp, readFile, rm, unlink, writeFile, appendFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const V1_FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'mvp-hosts_2_4_2.yaml')

/**
 * 3.0 W2 阶段二 · host verify 物化校验（S3.4 · 验收 #2/#9 · F-W2-04 fail-closed）。
 * 比对三分形态：① 逐字（skills/commands 全文件管理落点）② marker 产品块（CLAUDE/AGENTS/GEMINI.md ·
 * 用户 local 块与块外定制不计篡改）③ JSON 包含性（settings/hooks.json 产品条目 ⊆ 实况）。
 * 30 裁决登记：
 *  ① --json 顶层键集钉死 = {command, target, hosts, checks, verdict}
 *  ② --profile 缺省 = 粘性 profile → 否则 core（与 apply 缺省兼容 · 更贴合实取物化态）
 *  ③ verify 节消费呈现 = 每宿主一条 kind:'verify' check（kind/bin/failClosed 随报告输出 · 硬约束 9 转正）
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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'w2-host-verify-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

type VerifyCheck = { host_id: string; target: string; kind: string; status: string; detail?: string }
type VerifyJson = {
  command: string
  target: string
  hosts: string[]
  checks: VerifyCheck[]
  verdict: string
}

/** apply 全量宿主 core 物化（含 claude/cursor/gemini hooks 落点） */
function applyAll(dir: string, extraArgs: string[] = []): void {
  const r = runCli(['host', 'apply', '--tools', 'all', '--target', dir, '--yes', ...extraArgs])
  assert.equal(r.status, 0, r.combined)
}

describe('3.0 W2 阶段二 · host verify 绿径（S3.4 · 验收 #2 正 fixture）', { concurrency: 1 }, () => {
  it('合规仓（apply 后未篡改）→ exit 0 · HOST VERIFY: PASS · degraded-none 降级行 · 输出不含 L3', async () => {
    await withTemp(async (dir) => {
      applyAll(dir)
      const r = runCli(['host', 'verify', '--tools', 'all', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /HOST VERIFY:\s*PASS/)
      assert.match(r.combined, /degraded-none（L1\+L2 · 宿主无 hook 机制 · 门禁仅 CLI 侧）/)
      assert.ok(!r.combined.includes('L3'), '不得暗示 L3（硬约束 9）')
    })
  })

  it('--json 键集钉死（command/target/hosts/checks/verdict）· verify 节声明已被消费（kind/bin 随报告）', async () => {
    await withTemp(async (dir) => {
      applyAll(dir)
      const r = runCli(['host', 'verify', '--tools', 'all', '--target', dir, '--json'])
      assert.equal(r.status, 0, r.combined)
      const obj = JSON.parse(r.stdout) as VerifyJson
      assert.deepEqual(Object.keys(obj).sort(), ['checks', 'command', 'hosts', 'target', 'verdict'])
      assert.equal(obj.command, 'host verify')
      assert.equal(obj.verdict, 'PASS')
      assert.equal(obj.hosts.length, 13)
      const verifyDeclChecks = obj.checks.filter((c) => c.kind === 'verify')
      assert.equal(verifyDeclChecks.length, 13, '每宿主一条 verify 节消费条目')
      for (const c of verifyDeclChecks) {
        assert.equal(c.status, 'ok')
        assert.match(c.detail ?? '', /bin=spec-wave/)
        assert.match(c.detail ?? '', /failClosed=true/)
      }
      const degraded = obj.checks.filter((c) => c.status === 'degraded-none')
      assert.equal(degraded.length, 10, '10 个显式 none 宿主降级条目（不计红绿）')
      assert.ok(obj.checks.every((c) => c.status === 'ok' || c.status === 'degraded-none'))
    })
  })

  it('用户定制绿边界（验收 #9）：AGENTS.md 块外追加 + local 块 · settings.json 用户其他键 → 仍 PASS', async () => {
    await withTemp(async (dir) => {
      applyAll(dir)
      // 块外用户内容 + local 块（产品块外 · 不计篡改）
      await appendFile(
        path.join(dir, 'AGENTS.md'),
        '\n<!-- cyning-harness-local:begin -->\n用户自定义区\n<!-- cyning-harness-local:end -->\n\n## 用户追加章节\n',
      )
      const settingsAbs = path.join(dir, '.claude', 'settings.json')
      const settings = JSON.parse(await readFile(settingsAbs, 'utf8')) as Record<string, unknown>
      settings.userExtraKey = { nested: true }
      await writeFile(settingsAbs, JSON.stringify(settings, null, 2) + '\n')
      const r = runCli(['host', 'verify', '--tools', 'all', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /HOST VERIFY:\s*PASS/)
    })
  })

  it('v1 表（2.4.2 fixture）apply + verify 全绿 · checks 零 degraded-none（未声明静默裁决）', async () => {
    await withTemp(async (dir) => {
      const a = runCli(['host', 'apply', '--tools', 'all', '--file', V1_FIXTURE, '--target', dir, '--yes'])
      assert.equal(a.status, 0, a.combined)
      const r = runCli(['host', 'verify', '--tools', 'all', '--file', V1_FIXTURE, '--target', dir, '--json'])
      assert.equal(r.status, 0, r.combined)
      const obj = JSON.parse(r.stdout) as VerifyJson
      assert.equal(obj.verdict, 'PASS')
      assert.equal(obj.checks.filter((c) => c.status === 'degraded-none').length, 0)
    })
  })

  it('粘性缺省：apply 后无 --tools 走粘性 → PASS · 无粘性无 --tools → exit 1 提示', async () => {
    await withTemp(async (dir) => {
      const a = runCli(['host', 'apply', '--tools', 'cursor,claude', '--target', dir, '--yes'])
      assert.equal(a.status, 0, a.combined)
      const sticky = runCli(['host', 'verify', '--target', dir])
      assert.equal(sticky.status, 0, sticky.combined)
      assert.match(sticky.combined, /HOST VERIFY:\s*PASS/)
    })
    await withTemp(async (dir) => {
      const r = runCli(['host', 'verify', '--target', dir])
      assert.equal(r.status, 1, r.combined)
      assert.match(r.combined, /粘性|--tools/)
    })
  })
})

describe('3.0 W2 阶段二 · host verify 红径四类（验收 #2 负 fixture · 报红点名落点 exit 2）', { concurrency: 1 }, () => {
  it('红① 篡改逐字类落点（skill 文件追加一行）→ exit 2 点名路径 mismatch', async () => {
    await withTemp(async (dir) => {
      applyAll(dir)
      const victim = path.join(dir, '.cursor', 'commands', 'kit-verify.md')
      await appendFile(victim, '\nTAMPERED\n')
      const r = runCli(['host', 'verify', '--tools', 'all', '--target', dir, '--json'])
      assert.equal(r.status, 2, r.combined)
      const obj = JSON.parse(r.stdout) as VerifyJson
      assert.equal(obj.verdict, 'FAIL')
      const red = obj.checks.filter((c) => c.status === 'mismatch')
      assert.ok(red.some((c) => c.target === '.cursor/commands/kit-verify.md'), JSON.stringify(red))
    })
  })

  it('红② 删除落点文件（claude core command）→ exit 2 点名 missing', async () => {
    await withTemp(async (dir) => {
      applyAll(dir)
      await unlink(path.join(dir, '.claude', 'commands', 'kit', 'verify.md'))
      const r = runCli(['host', 'verify', '--tools', 'all', '--target', dir, '--json'])
      assert.equal(r.status, 2, r.combined)
      const obj = JSON.parse(r.stdout) as VerifyJson
      assert.equal(obj.verdict, 'FAIL')
      const red = obj.checks.filter((c) => c.status === 'missing')
      assert.ok(red.some((c) => c.target === '.claude/commands/kit/verify.md'), JSON.stringify(red))
    })
  })

  it('红③ 篡改 JSON 配置内产品 hook 条目（删一条 / 改 command）→ exit 2 点名 settings.json', async () => {
    await withTemp(async (dir) => {
      applyAll(dir)
      const abs = path.join(dir, '.claude', 'settings.json')
      const settings = JSON.parse(await readFile(abs, 'utf8')) as { hooks: { PreToolUse: unknown[] } }
      settings.hooks.PreToolUse = settings.hooks.PreToolUse.slice(1) // 删 pre-commit 产品条目
      await writeFile(abs, JSON.stringify(settings, null, 2) + '\n')
      const r = runCli(['host', 'verify', '--tools', 'all', '--target', dir, '--json'])
      assert.equal(r.status, 2, r.combined)
      const obj = JSON.parse(r.stdout) as VerifyJson
      assert.equal(obj.verdict, 'FAIL')
      const red = obj.checks.filter((c) => c.status === 'mismatch' && c.target === '.claude/settings.json')
      assert.equal(red.length, 1, JSON.stringify(obj.checks.filter((c) => c.target === '.claude/settings.json')))
      assert.match(red[0]!.detail ?? '', /pre-commit/)

      // 改 command 串（条目数不变内容变）同红
      applyAll(dir)
      const s2 = JSON.parse(await readFile(abs, 'utf8')) as { hooks: { PreToolUse: { matcher: string; hooks: { type: string; command: string }[] }[] } }
      s2.hooks.PreToolUse[0]!.hooks[0]!.command = 'npx spec-wave hook-guard --trigger pre-commit --evil'
      await writeFile(abs, JSON.stringify(s2, null, 2) + '\n')
      const r2 = runCli(['host', 'verify', '--tools', 'all', '--target', dir])
      assert.equal(r2.status, 2, r2.combined)
      assert.match(r2.combined, /\.claude\/settings\.json/)
      assert.match(r2.combined, /HOST VERIFY:\s*FAIL/)
    })
  })

  it('红④ 篡改 marker 产品块（AGENTS.md 产品块内改一行）→ exit 2 点名 AGENTS.md', async () => {
    await withTemp(async (dir) => {
      applyAll(dir)
      const abs = path.join(dir, 'AGENTS.md')
      const body = await readFile(abs, 'utf8')
      assert.ok(body.includes('cyning-harness:begin'))
      await writeFile(abs, body.replace('单源真值', 'TAMPERED-真值'))
      const r = runCli(['host', 'verify', '--tools', 'all', '--target', dir, '--json'])
      assert.equal(r.status, 2, r.combined)
      const obj = JSON.parse(r.stdout) as VerifyJson
      assert.equal(obj.verdict, 'FAIL')
      const red = obj.checks.filter((c) => c.status === 'mismatch' && c.target === 'AGENTS.md')
      assert.ok(red.length >= 1, JSON.stringify(obj.checks.filter((c) => c.target === 'AGENTS.md')))
    })
  })

  it('红⑤ fail-closed：落点无法读取（chmod 000）→ 按红处理点名 unreadable（F-W2-04 · 不静默跳过）', async (t) => {
    if (process.platform === 'win32') {
      t.skip('POSIX chmod 语义用例')
      return
    }
    await withTemp(async (dir) => {
      applyAll(dir)
      const victim = path.join(dir, '.cursor', 'commands', 'kit-gate-status.md')
      await chmod(victim, 0o000)
      try {
        const r = runCli(['host', 'verify', '--tools', 'all', '--target', dir, '--json'])
        assert.equal(r.status, 2, r.combined)
        const obj = JSON.parse(r.stdout) as VerifyJson
        assert.equal(obj.verdict, 'FAIL')
        const red = obj.checks.filter((c) => c.status === 'unreadable')
        assert.ok(red.some((c) => c.target === '.cursor/commands/kit-gate-status.md'), JSON.stringify(red))
      } finally {
        await chmod(victim, 0o644)
      }
    })
  })
})
