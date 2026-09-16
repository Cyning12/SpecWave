import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const SPECGATE = path.join(KIT, 'bin', 'specgate.js')
const USER_HOME_FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'user-home')

/**
 * 3.0 W2 阶段四 · shell-hook 物化（S3.3 · S3.1 族×触发表 · 验收 #10 · F-W2-11）。
 * acme-bot（shell-hook · pre-commit 声明）：temp git 仓物化 .git/hooks/pre-commit（spec-wave-managed
 * marker + hook-guard 调用 + pre-archive not-materialized 降级留痕注记 + 0755 可执行）·
 * 非本包 hook conflict 不覆写 · 非 git target 零落点（不创 .git）· 真实 git commit 脏拒/净放 e2e
 *（node_modules/.bin 本地 shim 解析 npx spec-wave → 本仓 build · git 不可用显式 skip · 硬约束 10）。
 */

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string }

function runCli(args: string[], opts: { cwd?: string; home?: string; input?: string } = {}): RunResult {
  const env = { ...process.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  if (opts.home) env.HOME = opts.home
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd: opts.cwd ?? KIT,
    env,
    input: opts.input,
  })
  const stdout = r.stdout ?? ''
  const stderr = r.stderr ?? ''
  return { status: r.status, stdout, stderr, combined: `${stdout}\n${stderr}` }
}

function git(args: string[], cwd: string): RunResult {
  const r = spawnSync('git', args, { encoding: 'utf8', cwd })
  const stdout = r.stdout ?? ''
  const stderr = r.stderr ?? ''
  return { status: r.status, stdout, stderr, combined: `${stdout}\n${stderr}` }
}

function gitAvailable(): boolean {
  return spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'w2-shell-hook-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

/** temp HOME（acme 用户目录）+ temp git 仓（本地 .bin shim · npx spec-wave 解析本仓 build） */
async function withGitRepo(
  fn: (ctx: { home: string; repo: string }) => Promise<void>,
): Promise<void> {
  await withTemp(async (root) => {
    const home = path.join(root, 'home')
    const repo = path.join(root, 'repo')
    await mkdir(home, { recursive: true })
    await cp(path.join(USER_HOME_FIXTURE, '.spec-wave'), path.join(home, '.spec-wave'), { recursive: true })
    await mkdir(path.join(repo, 'node_modules', '.bin'), { recursive: true })
    const shim = `#!/bin/sh\nexec ${process.execPath} ${SPECGATE} "\$@"\n`
    await writeFile(path.join(repo, 'node_modules', '.bin', 'spec-wave'), shim, { mode: 0o755 })
    git(['init', '-q'], repo)
    git(['config', 'user.email', 'e2e@example.com'], repo)
    git(['config', 'user.name', 'e2e'], repo)
    git(['commit', '-q', '--allow-empty', '-m', 'init'], repo)
    await fn({ home, repo })
  })
}

const HOOK_REL = path.join('.git', 'hooks', 'pre-commit')

describe('3.0 W2 阶段四 · shell-hook 物化（验收 #10 · F-W2-11）', { concurrency: 1 }, () => {
  it('物化：.git/hooks/pre-commit 写入（marker + hook-guard 调用 + 0755）· 幂等 skip_identical · pre-archive 声明降级注记', async (t) => {
    if (!gitAvailable()) {
      t.skip('git 不可用（硬约束 10 显式 skip）')
      return
    }
    await withGitRepo(async ({ home, repo }) => {
      const r = runCli(['host', 'apply', '--tools', 'acme-bot', '--target', repo, '--yes', '--json'], { home })
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as { written: string[] }
      assert.ok(parsed.written.some((p) => p.endsWith(path.join('.git', 'hooks', 'pre-commit'))), JSON.stringify(parsed.written))
      const hookAbs = path.join(repo, HOOK_REL)
      const body = await readFile(hookAbs, 'utf8')
      assert.match(body, /^#!\/bin\/sh/)
      assert.match(body, /spec-wave-managed/)
      assert.match(body, /exec npx spec-wave hook-guard --trigger pre-commit/)
      // acme fixture 仅声明 pre-commit ⇒ 无 pre-archive 注记（留痕仅在实际声明了 pre-archive 时出现）
      assert.ok(!body.includes('pre-archive: not-materialized'))
      assert.ok((statSync(hookAbs).mode & 0o111) !== 0, 'git hook 须可执行')

      const second = runCli(['host', 'apply', '--tools', 'acme-bot', '--target', repo, '--yes', '--json'], { home })
      assert.equal(second.status, 0, second.combined)
      const p2 = JSON.parse(second.stdout) as { skipped: string[]; written: string[] }
      assert.ok(p2.skipped.some((p) => p.endsWith('pre-commit')))
      assert.ok(!p2.written.some((p) => p.endsWith('pre-commit')))

      // pre-archive 声明（S3.1 族×触发表 · 无宿主原生事件锚点）→ 脚本头降级留痕注记 · 不静默
      await writeFile(
        path.join(home, '.spec-wave', 'hosts', 'note-bot.yaml'),
        [
          'version: "1"',
          'schema_version: 2',
          'command_sets:',
          '  core: [verify]',
          '  expanded: [graph-check]',
          'hosts:',
          '  - host_id: note-bot',
          '    surfaces:',
          '      always_on: []',
          '      skills: []',
          '      commands: []',
          '      hooks:',
          '        mechanism: shell-hook',
          '        triggers: [pre-commit, pre-archive]',
          '        command: "npx spec-wave verify --target ."',
          '',
        ].join('\n'),
      )
      const noteRepo = path.join(home, '..', 'note-repo')
      await mkdir(path.join(noteRepo, 'node_modules', '.bin'), { recursive: true })
      git(['init', '-q'], noteRepo)
      const rn = runCli(['host', 'apply', '--tools', 'note-bot', '--target', noteRepo, '--yes'], { home })
      assert.equal(rn.status, 0, rn.combined)
      const noteBody = await readFile(path.join(noteRepo, HOOK_REL), 'utf8')
      assert.match(noteBody, /pre-archive: not-materialized（无宿主原生事件锚点 · spec-wave 降级留痕 · S3\.1 族×触发表）/)
    })
  })

  it('F-W2-11：既有非本包 git hook → conflict 点名 · 用户 hook 零覆写', async (t) => {
    if (!gitAvailable()) {
      t.skip('git 不可用（硬约束 10 显式 skip）')
      return
    }
    await withGitRepo(async ({ home, repo }) => {
      const hookAbs = path.join(repo, HOOK_REL)
      await mkdir(path.dirname(hookAbs), { recursive: true })
      const userHook = '#!/bin/sh\n# user custom hook\necho user\n'
      await writeFile(hookAbs, userHook, { mode: 0o755 })
      const r = runCli(['host', 'apply', '--tools', 'acme-bot', '--target', repo, '--yes', '--json'], { home })
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as { conflict: string[] }
      assert.ok(parsed.conflict.some((p) => p.endsWith('pre-commit')), JSON.stringify(parsed))
      assert.equal(await readFile(hookAbs, 'utf8'), userHook, '不得覆写用户既有 git hook')
    })
  })

  it('非 git target（无 .git）→ shell-hook 零落点不创 .git（30 裁决 · apply/verify 同口径无红）', async () => {
    await withTemp(async (root) => {
      const home = path.join(root, 'home')
      const target = path.join(root, 'plain')
      await mkdir(home, { recursive: true })
      await mkdir(target, { recursive: true })
      await cp(path.join(USER_HOME_FIXTURE, '.spec-wave'), path.join(home, '.spec-wave'), { recursive: true })
      const r = runCli(['host', 'apply', '--tools', 'acme-bot', '--target', target, '--yes', '--json'], { home })
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as { planned: string[]; written: string[] }
      assert.ok(!parsed.written.some((p) => p.includes('.git')), JSON.stringify(parsed.written))
      assert.equal(existsSync(path.join(target, '.git')), false, '不得创建 .git')
      const v = runCli(['host', 'verify', '--tools', 'acme-bot', '--target', target, '--json'], { home })
      assert.equal(v.status, 0, v.combined)
    })
  })

  it('host verify：物化后绿 · 篡改 hook 脚本 → exit 2 逐字 mismatch 点名', async (t) => {
    if (!gitAvailable()) {
      t.skip('git 不可用（硬约束 10 显式 skip）')
      return
    }
    await withGitRepo(async ({ home, repo }) => {
      runCli(['host', 'apply', '--tools', 'acme-bot', '--target', repo, '--yes'], { home })
      const okV = runCli(['host', 'verify', '--tools', 'acme-bot', '--target', repo, '--json'], { home })
      assert.equal(okV.status, 0, okV.combined)
      const hookAbs = path.join(repo, HOOK_REL)
      await writeFile(hookAbs, (await readFile(hookAbs, 'utf8')) + '\n# TAMPERED\n')
      const redV = runCli(['host', 'verify', '--tools', 'acme-bot', '--target', repo, '--json'], { home })
      assert.equal(redV.status, 2, redV.combined)
      const obj = JSON.parse(redV.stdout) as { checks: { target: string; status: string }[] }
      assert.ok(obj.checks.some((c) => c.target.endsWith('pre-commit') && c.status === 'mismatch'), JSON.stringify(obj.checks))
    })
  })

  it('e2e 真实 git commit：脏场景（reviews 缺口）hook 触发门禁拒绝 · 净场景放行（验收 #10 硬条）', async (t) => {
    if (!gitAvailable()) {
      t.skip('git 不可用（硬约束 10 显式 skip）')
      return
    }
    await withGitRepo(async ({ home, repo }) => {
      runCli(['host', 'apply', '--tools', 'acme-bot', '--target', repo, '--yes'], { home })

      // 脏场景：done task 缺审查文 → 裸 verify BLOCKED → hook 阻断 commit
      await mkdir(path.join(repo, 'docs', 'tasks', 'done'), { recursive: true })
      await mkdir(path.join(repo, 'docs', 'spec', '9_9-fake'), { recursive: true })
      await writeFile(path.join(repo, 'docs', 'spec', '9_9-fake', '01_fake_spec_v1.md'), '# FAKE SPEC\n')
      await writeFile(
        path.join(repo, 'docs', 'tasks', 'done', 'task_9_9_fake.md'),
        '# Task：9.9 fake\n> **SPEC 真值**：[`docs/spec/9_9-fake/01_fake_spec_v1.md`](../../spec/9_9-fake/01_fake_spec_v1.md)\n',
      )
      git(['add', '-A'], repo)
      const dirty = git(['commit', '-m', 'dirty'], repo)
      assert.notEqual(dirty.status, 0, `脏提交须被拒: ${dirty.combined}`)
      assert.match(dirty.combined, /hook-guard: 门禁红/)
      assert.match(dirty.combined, /阻断 pre-commit/)
      assert.match(dirty.combined, /VERIFY: BLOCKED/)
      // commit 未发生（HEAD 仍是 init）
      const log = git(['log', '--oneline'], repo)
      assert.ok(!log.stdout.includes('dirty'), '脏 commit 不得落库')

      // 净场景：移除脏文件 → verify 绿 → commit 放行
      await rm(path.join(repo, 'docs'), { recursive: true, force: true })
      git(['add', '-A'], repo)
      const clean = git(['commit', '-m', 'clean'], repo)
      assert.equal(clean.status, 0, `净提交须放行: ${clean.combined}`)
      const log2 = git(['log', '--oneline'], repo)
      assert.ok(log2.stdout.includes('clean'), '净 commit 须落库')
    })
  })
})
