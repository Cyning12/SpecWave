#!/usr/bin/env node
/**
 * 3.0 W2 阶段四 · e2e 留证脚本（S3.7 · 验收 #1/#5/#10 · F-W2-06/07 · 硬约束 14）。
 *
 * 用法（仓根）：
 *   node --experimental-strip-types scripts/e2e-w2-host-gates.mts
 *
 * 覆盖：
 *   A. shell-hook 物化 temp git 仓 e2e（acme-bot · 真实 git commit 脏拒/净放 · 机械面恒可跑）
 *   B. claude 真实宿主 e2e（PreToolUse hook 真实触发 · 脏提交被宿主内门禁拒绝 · 净提交放行）
 *   C. gemini 真实宿主 e2e（auth 可得则全链 · 否则 F-W2-07 环境红对照登记 · 不得伪造）
 *   D. cursor-agent 备援探测（加分非硬条 · auth 不可得则登记）
 *   E. acme-bot --file 路径双路演示（验收 #5 路①）
 *
 * 隔离纪律：全部 temp HOME/temp 仓 · node_modules/.bin 本地 shim 解析 npx spec-wave → 本仓 build ·
 * 零全局状态污染（不装全局包 · gemini 装 temp prefix · 跑完 rm -rf）。
 * 输出 = stdout 结构化日志（验收文引用 · 重跑即复现）。
 */
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SPECGATE = path.join(KIT, 'bin', 'specgate.js')
const USER_HOME_FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'user-home')
const ACME_FILE_TABLE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'acme-hosts-file.yaml')
const CLAUDE_TIMEOUT_MS = 240_000
const GEMINI_TIMEOUT_MS = 240_000

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string; timedOut: boolean }

function run(
  cmd: string,
  args: string[],
  opts: { cwd?: string; env?: NodeJS.ProcessEnv; input?: string; timeoutMs?: number; shell?: boolean } = {},
): RunResult {
  const env = { ...process.env, ...opts.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  const r = spawnSync(cmd, args, {
    encoding: 'utf8',
    cwd: opts.cwd ?? KIT,
    env,
    input: opts.input,
    timeout: opts.timeoutMs,
    shell: opts.shell ?? false,
  })
  const stdout = r.stdout ?? ''
  const stderr = r.stderr ?? ''
  return {
    status: r.status,
    stdout,
    stderr,
    combined: `${stdout}\n${stderr}`,
    timedOut: r.signal === 'SIGTERM',
  }
}

function cli(args: string[], opts: Parameters<typeof run>[2] = {}): RunResult {
  return run(process.execPath, ['--experimental-strip-types', path.join(KIT, 'src', 'cli.ts'), ...args], opts)
}

function git(args: string[], cwd: string): RunResult {
  return run('git', args, { cwd })
}

function section(title: string): void {
  console.log(`\n===== ${title} =====`)
}

function show(label: string, r: RunResult, tail = 30): void {
  console.log(`--- ${label}（exit ${r.status}）---`)
  const lines = r.combined.trimEnd().split('\n')
  for (const line of lines.slice(-tail)) console.log(line)
}

function versionOf(cmd: string, args = ['--version']): string {
  const r = run(cmd, args, { timeoutMs: 30_000 })
  return r.status === 0 ? (r.stdout.trim().split('\n')[0] ?? '(empty)') : `(不可得: exit ${r.status})`
}

function mkShim(repo: string): void {
  mkdirSync(path.join(repo, 'node_modules', '.bin'), { recursive: true })
  writeFileSync(
    path.join(repo, 'node_modules', '.bin', 'spec-wave'),
    `#!/bin/sh\nexec ${process.execPath} ${SPECGATE} "\$@"\n`,
    { mode: 0o755 },
  )
}

function mkGitRepo(root: string, name: string): string {
  const repo = path.join(root, name)
  mkdirSync(repo, { recursive: true })
  mkShim(repo)
  git(['init', '-q'], repo)
  git(['config', 'user.email', 'e2e@example.com'], repo)
  git(['config', 'user.name', 'e2e'], repo)
  git(['commit', '-q', '--allow-empty', '-m', 'init'], repo)
  return repo
}

/** 脏场景脚手架：done task 引 spec 无审查文 → 裸 verify BLOCKED exit 2 */
function makeDirty(repo: string): void {
  mkdirSync(path.join(repo, 'docs', 'tasks', 'done'), { recursive: true })
  mkdirSync(path.join(repo, 'docs', 'spec', '9_9-fake'), { recursive: true })
  writeFileSync(path.join(repo, 'docs', 'spec', '9_9-fake', '01_fake_spec_v1.md'), '# FAKE SPEC\n')
  writeFileSync(
    path.join(repo, 'docs', 'tasks', 'done', 'task_9_9_fake.md'),
    '# Task：9.9 fake\n> **SPEC 真值**：[`docs/spec/9_9-fake/01_fake_spec_v1.md`](../../spec/9_9-fake/01_fake_spec_v1.md)\n',
  )
  git(['add', '-A'], repo)
}

const COMMIT_PROMPT =
  'Execute exactly these two shell commands in order, then stop: git add -A && git commit -m "e2e-demo". ' +
  'Do not modify any file contents yourself. Do not explain. If the commit command fails, report the failure output verbatim.'

// ─── 0 环境版本串 ───
section('0 环境版本串（验收文登记 · A3）')
console.log(`OS: ${process.platform} ${process.arch} · ${os.release()}`)
console.log(`node: ${versionOf(process.execPath)}`)
console.log(`npm: ${versionOf('npm')}`)
console.log(`git: ${versionOf('git')}`)
console.log(`claude: ${versionOf('claude')}`)
console.log(`cursor-agent: ${versionOf('cursor-agent')}`)
const geminiPre = run('gemini', ['--version'], { timeoutMs: 30_000 })
console.log(`gemini（预装探测）: ${geminiPre.status === 0 ? geminiPre.stdout.trim() : '(缺席 · 将装 temp prefix)'}`)
console.log(`spec-wave（本仓 build）: ${versionOf(SPECGATE)}`)

const root = mkdtempSync(path.join(os.tmpdir(), 'w2-e2e-hosts-'))
console.log(`\ntemp root: ${root}（跑完清理）`)
const summary: string[] = []

try {
  // ─── A shell-hook e2e（机械面） ───
  section('A shell-hook 物化 · temp git 仓真实 git commit（acme-bot · 验收 #10）')
  {
    const home = path.join(root, 'home-a')
    mkdirSync(home, { recursive: true })
    cpSync(path.join(USER_HOME_FIXTURE, '.spec-wave'), path.join(home, '.spec-wave'), { recursive: true })
    const repo = mkGitRepo(root, 'repo-a')
    const apply = cli(['host', 'apply', '--tools', 'acme-bot', '--target', repo, '--yes'], { env: { HOME: home } })
    show('A1 apply acme-bot（shell-hook 物化）', apply, 12)
    const hookBody = readFileSync(path.join(repo, '.git', 'hooks', 'pre-commit'), 'utf8')
    console.log('--- A2 物化脚本 ---')
    console.log(hookBody.trimEnd())
    makeDirty(repo)
    const dirty = git(['commit', '-m', 'dirty-e2e'], repo)
    show('A3 脏提交（须被 hook 拒绝）', dirty, 15)
    const dirtyBlocked = dirty.status !== 0 && dirty.combined.includes('阻断 pre-commit')
    rmSync(path.join(repo, 'docs'), { recursive: true, force: true })
    git(['add', '-A'], repo)
    const clean = git(['commit', '-m', 'clean-e2e'], repo)
    show('A4 净提交（须放行）', clean, 8)
    const cleanOk = clean.status === 0 && git(['log', '--oneline'], repo).stdout.includes('clean-e2e')
    console.log(`A verdict: 脏拒=${dirtyBlocked ? 'PASS' : 'FAIL'} · 净放=${cleanOk ? 'PASS' : 'FAIL'}`)
    summary.push(`A shell-hook e2e: ${dirtyBlocked && cleanOk ? 'PASS' : 'FAIL'}`)
  }

  // ─── B claude 真实宿主 ───
  section('B claude 真实宿主 e2e（PreToolUse hook 真实触发 · 验收 #1 件①）')
  {
    if (versionOf('claude').startsWith('(不可得')) {
      console.log('F-W2-07 环境红：claude CLI 不可得')
      summary.push('B claude e2e: ENV-BLOCKED（CLI 缺席）')
    } else {
      const home = path.join(root, 'home-b')
      mkdirSync(home, { recursive: true })
      const repo = mkGitRepo(root, 'repo-b')
      const apply = cli(['host', 'apply', '--tools', 'claude', '--target', repo, '--yes'], { env: { HOME: home } })
      show('B1 apply claude（config-hook 物化 .claude/settings.json）', apply, 10)
      console.log('--- B2 物化配置摘录（.claude/settings.json） ---')
      console.log(readFileSync(path.join(repo, '.claude', 'settings.json'), 'utf8').trimEnd())

      makeDirty(repo)
      const dirty = run(
        'claude',
        ['-p', COMMIT_PROMPT, '--dangerously-skip-permissions', '--max-turns', '6'],
        { cwd: repo, timeoutMs: CLAUDE_TIMEOUT_MS },
      )
      show('B3 脏提交演示（claude 驱动 · hook 须阻断）', dirty, 40)
      const logAfterDirty = git(['log', '--oneline'], repo).stdout
      const dirtyBlocked =
        !logAfterDirty.includes('e2e-demo') &&
        /门禁红|阻断 pre-commit|PreToolUse|hook/i.test(dirty.combined)

      rmSync(path.join(repo, 'docs'), { recursive: true, force: true })
      git(['add', '-A'], repo)
      const clean = run(
        'claude',
        ['-p', COMMIT_PROMPT, '--dangerously-skip-permissions', '--max-turns', '6'],
        { cwd: repo, timeoutMs: CLAUDE_TIMEOUT_MS },
      )
      show('B4 净提交演示（claude 驱动 · 须放行）', clean, 25)
      const cleanOk = git(['log', '--oneline'], repo).stdout.includes('e2e-demo')
      console.log(`B verdict: 脏拒=${dirtyBlocked ? 'PASS' : 'FAIL'} · 净放=${cleanOk ? 'PASS' : 'FAIL'}`)
      summary.push(`B claude e2e: ${dirtyBlocked && cleanOk ? 'PASS' : dirtyBlocked ? 'PARTIAL（脏拒证 · 净放未证）' : 'FAIL'}`)
    }
  }

  // ─── C gemini 真实宿主（auth 探测 → 全链或环境红登记） ───
  section('C gemini 真实宿主 e2e（BeforeTool hook · 验收 #1 件②候选）')
  {
    let geminiBin = 'gemini'
    if (geminiPre.status !== 0) {
      const prefix = path.join(root, 'npm-gemini')
      console.log(`gemini 缺席 → npm install --prefix ${prefix} @google/gemini-cli（temp · 零全局污染）`)
      const inst = run('npm', ['install', '--prefix', prefix, '@google/gemini-cli'], { timeoutMs: 300_000 })
      show('C0 npm install gemini-cli', inst, 5)
      geminiBin = path.join(prefix, 'node_modules', '.bin', 'gemini')
    }
    console.log(`gemini version: ${versionOf(geminiBin)}`)
    const authProbe = run(geminiBin, ['-p', 'Reply with exactly: OK'], { cwd: root, timeoutMs: 90_000 })
    const authed = authProbe.status === 0 && !/Auth|GEMINI_API_KEY|credentials/i.test(authProbe.combined)
    if (!authed) {
      show('C1 auth 探测（F-W2-07 环境红对照 · 不伪造）', authProbe, 12)
      console.log('F-W2-07 登记：gemini CLI 已装但无认证（GEMINI_API_KEY/OAuth/GCP 皆缺席）· 无法真实驱动 LLM ⇒ hook 不可真实触发 · 不得用 fixture 冒充 · 件数贡献 0')
      summary.push('C gemini e2e: ENV-BLOCKED（认证缺席 · F-W2-07 登记）')
    } else {
      const home = path.join(root, 'home-c')
      mkdirSync(home, { recursive: true })
      const repo = mkGitRepo(root, 'repo-c')
      const apply = cli(['host', 'apply', '--tools', 'gemini', '--target', repo, '--yes'], { env: { HOME: home } })
      show('C1 apply gemini（config-hook 物化 .gemini/settings.json）', apply, 10)
      console.log('--- C2 物化配置摘录（.gemini/settings.json） ---')
      console.log(readFileSync(path.join(repo, '.gemini', 'settings.json'), 'utf8').trimEnd())
      makeDirty(repo)
      const dirty = run(geminiBin, ['-p', COMMIT_PROMPT], { cwd: repo, timeoutMs: GEMINI_TIMEOUT_MS })
      show('C3 脏提交演示（gemini 驱动 · hook 须阻断）', dirty, 40)
      const dirtyBlocked =
        !git(['log', '--oneline'], repo).stdout.includes('e2e-demo') &&
        /门禁红|阻断 pre-commit|BeforeTool|hook|deny/i.test(dirty.combined)
      rmSync(path.join(repo, 'docs'), { recursive: true, force: true })
      git(['add', '-A'], repo)
      const clean = run(geminiBin, ['-p', COMMIT_PROMPT], { cwd: repo, timeoutMs: GEMINI_TIMEOUT_MS })
      show('C4 净提交演示（gemini 驱动 · 须放行）', clean, 25)
      const cleanOk = git(['log', '--oneline'], repo).stdout.includes('e2e-demo')
      console.log(`C verdict: 脏拒=${dirtyBlocked ? 'PASS' : 'FAIL'} · 净放=${cleanOk ? 'PASS' : 'FAIL'}`)
      summary.push(`C gemini e2e: ${dirtyBlocked && cleanOk ? 'PASS' : dirtyBlocked ? 'PARTIAL' : 'FAIL'}`)
    }
  }

  // ─── D cursor 真实宿主 e2e（beforeShellExecution hook · 验收 #1 件② · 备援转正） ───
  // cursor 语义（20 审取证口径）：exit 2 = deny 阻断 · 非 2 默认 fail-open —— 判定锚要求真 exit 2 路径
  //（hook-guard 门禁红精确 exit 2）· fail-open 注记留痕（F-W2-06 校准位）。
  section('D cursor 真实宿主 e2e（beforeShellExecution hook · 验收 #1 件②）')
  {
    const probe = run('cursor-agent', ['-p', 'Reply with exactly: OK', '--force', '--trust'], { cwd: root, timeoutMs: 60_000 })
    show('D1 auth 探测', probe, 8)
    const authed = probe.status === 0 && !/Authentication required|login/i.test(probe.combined)
    if (!authed) {
      console.log('F-W2-07 登记：cursor-agent 无认证（agent login / CURSOR_API_KEY 缺席）· 备援不可用 · 不伪造')
      summary.push('D cursor e2e: ENV-BLOCKED（认证缺席 · F-W2-07 登记）')
    } else {
      const home = path.join(root, 'home-d')
      mkdirSync(home, { recursive: true })
      const repo = mkGitRepo(root, 'repo-d')
      const apply = cli(['host', 'apply', '--tools', 'cursor', '--target', repo, '--yes'], { env: { HOME: home } })
      show('D2 apply cursor（config-hook 物化 .cursor/hooks.json）', apply, 10)
      console.log('--- D3 物化配置摘录（.cursor/hooks.json） ---')
      console.log(readFileSync(path.join(repo, '.cursor', 'hooks.json'), 'utf8').trimEnd())

      makeDirty(repo)
      const dirty = run(
        'cursor-agent',
        ['-p', COMMIT_PROMPT, '--force', '--trust'],
        { cwd: repo, timeoutMs: CLAUDE_TIMEOUT_MS },
      )
      show('D4 脏提交演示（cursor 驱动 · hook 须 deny 阻断）', dirty, 40)
      const logAfterDirty = git(['log', '--oneline'], repo).stdout
      const dirtyBlocked =
        !logAfterDirty.includes('e2e-demo') &&
        /门禁红|阻断 pre-commit|deny|denied|hook/i.test(dirty.combined)

      rmSync(path.join(repo, 'docs'), { recursive: true, force: true })
      git(['add', '-A'], repo)
      const clean = run(
        'cursor-agent',
        ['-p', COMMIT_PROMPT, '--force', '--trust'],
        { cwd: repo, timeoutMs: CLAUDE_TIMEOUT_MS },
      )
      show('D5 净提交演示（cursor 驱动 · 须放行）', clean, 25)
      const cleanOk = git(['log', '--oneline'], repo).stdout.includes('e2e-demo')
      console.log(`D verdict: 脏拒=${dirtyBlocked ? 'PASS' : 'FAIL'} · 净放=${cleanOk ? 'PASS' : 'FAIL'}`)
      console.log('注记：cursor 非 2 退出默认 fail-open · 阻断语义精确 exit 2（物化模板口径 · F-W2-06 校准位）')
      summary.push(`D cursor e2e: ${dirtyBlocked && cleanOk ? 'PASS' : dirtyBlocked ? 'PARTIAL（脏拒证 · 净放未证）' : 'FAIL'}`)
    }
  }

  // ─── E acme --file 双路 ───
  section('E acme-bot --file 路径双路演示（验收 #5 路① · 硬约束 12 闭环）')
  {
    const target = path.join(root, 'repo-e')
    mkdirSync(target, { recursive: true })
    const apply = cli(['host', 'apply', '--tools', 'acme-bot', '--file', ACME_FILE_TABLE, '--target', target, '--yes'])
    show('E1 apply --file acme-hosts-file.yaml', apply, 10)
    const verify = cli(['host', 'verify', '--tools', 'acme-bot', '--file', ACME_FILE_TABLE, '--target', target])
    show('E2 host verify --file（绿）', verify, 8)
    summary.push(`E acme --file 双路: ${apply.status === 0 && verify.status === 0 ? 'PASS' : 'FAIL'}`)
  }

  section('SUMMARY')
  for (const s of summary) console.log(s)
} finally {
  rmSync(root, { recursive: true, force: true })
  console.log(`\ntemp root 已清理: ${root}`)
}
