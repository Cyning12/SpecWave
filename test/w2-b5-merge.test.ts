import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { chmod, cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { userHostsDirOf } from '../src/host/load.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const V1_FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'mvp-hosts_2_4_2.yaml')
const USER_HOME_FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'user-home')

/**
 * 3.0 W2 阶段三 · B5 用户级目录加载 + 多表合并（S3.6 · 验收 #3/#5 · F-W2-02/03/08 · 硬约束 12）。
 * 合并铁律三面负 fixture：① 新增宿主生效（acme-bot 物化+verify 预演）② 冲突拒绝（内置∩用户 ·
 * 用户间后载者拒 · 点名零写入）③ 表级隔离（YAML 坏 / schema 非法点名零写入）。
 * --file = 当次整表替换（现状逐字）· 无用户目录 = 现状逐字（existsSync 守卫）。
 * HOME 注入：子进程 env HOME=temp（POSIX os.homedir 口径）· 纯函数 userHostsDirOf 跨平台断言。
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

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'w2-b5-merge-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

/** temp HOME + 拷入 acme fixture 用户目录（.spec-wave/hosts/acme-hosts.yaml + acme-assets/） */
async function withAcmeHome(fn: (home: string) => Promise<void>): Promise<void> {
  await withTemp(async (home) => {
    await cp(path.join(USER_HOME_FIXTURE, '.spec-wave'), path.join(home, '.spec-wave'), { recursive: true })
    await fn(home)
  })
}

function acmeTableExtra(hostId: string): string {
  return [
    'version: "1"',
    'schema_version: 2',
    'command_sets:',
    '  core: [verify]',
    '  expanded: [graph-check]',
    'hosts:',
    `  - host_id: ${hostId}`,
    '    surfaces:',
    '      always_on: []',
    '      skills: []',
    '      commands: []',
    '',
  ].join('\n')
}

describe('3.0 W2 阶段三 · B5 合并铁律（验收 #3 · 三面 fixture）', { concurrency: 1 }, () => {
  it('铁律①正 + 硬约束 12 预演：用户目录 acme-bot（非内置）合并加载 → apply 物化 ACME.md → verify 绿 → 篡改红 · 内置 13 零污染', async () => {
    await withAcmeHome(async (home) => {
      await withTemp(async (target) => {
        // 合并加载得证：acme-bot 非内置 id · 无 --file 可 apply（未合并则 未知 host_id exit 1）
        const r = runCli(['host', 'apply', '--tools', 'acme-bot', '--target', target, '--yes', '--json'], { home })
        assert.equal(r.status, 0, r.combined)
        const parsed = JSON.parse(r.stdout) as { written: string[]; hosts: string[] }
        assert.deepEqual(parsed.hosts, ['acme-bot'])
        assert.ok(parsed.written.includes('ACME.md'), JSON.stringify(parsed.written))
        // 资产相对表文件所在目录解析（裁决② · 资产随表分发）
        const acmeBody = await readFile(path.join(target, 'ACME.md'), 'utf8')
        const fixtureBody = await readFile(
          path.join(USER_HOME_FIXTURE, '.spec-wave', 'hosts', 'acme-assets', 'ACME.md.fragment.example'),
          'utf8',
        )
        assert.equal(acmeBody, fixtureBody)
        // 粘性写入（verify 缺省可走粘性）
        assert.ok(existsSync(path.join(target, '.coding-kit', 'host-tools.json')))

        // host verify 对其生效：绿 → 篡改 → 红
        const okV = runCli(['host', 'verify', '--tools', 'acme-bot', '--target', target, '--json'], { home })
        assert.equal(okV.status, 0, okV.combined)
        assert.equal((JSON.parse(okV.stdout) as { verdict: string }).verdict, 'PASS')
        await writeFile(path.join(target, 'ACME.md'), acmeBody + '\nTAMPERED\n')
        const redV = runCli(['host', 'verify', '--tools', 'acme-bot', '--target', target, '--json'], { home })
        assert.equal(redV.status, 2, redV.combined)
        const redObj = JSON.parse(redV.stdout) as { verdict: string; checks: { target: string; status: string }[] }
        assert.equal(redObj.verdict, 'FAIL')
        assert.ok(redObj.checks.some((c) => c.target === 'ACME.md' && c.status === 'mismatch'))

        // 内置零污染：内置宿主在同一 HOME 下照常（dsh apply 正常 · catalog 见内置 13 + acme）
        const dsh = runCli(['host', 'apply', '--tools', 'dsh', '--target', target, '--yes', '--json'], { home })
        assert.equal(dsh.status, 0, dsh.combined)
        const cat = runCli(['host', 'catalog', 'list', '--target', target, '--json'], { home })
        assert.equal(cat.status, 0, cat.combined)
        const catObj = JSON.parse(cat.stdout) as { tables: { origin: string; hosts: number; host_ids?: string[] }[] }
        assert.equal(catObj.tables[0]!.origin, 'builtin')
        assert.equal(catObj.tables[0]!.hosts, 13, '内置 13 不受用户表污染')
        assert.deepEqual(catObj.tables[1]!.host_ids, ['acme-bot'])
      })
    })
  })

  it('铁律②：用户表 host_id ∩ 内置（cursor）→ apply exit 2 点名冲突 · 零写入（U-01 同档）', async () => {
    await withAcmeHome(async (home) => {
      await writeFile(
        path.join(home, '.spec-wave', 'hosts', 'aaa-conflict.yaml'),
        acmeTableExtra('cursor'),
      )
      await withTemp(async (target) => {
        const r = runCli(['host', 'apply', '--tools', 'cursor', '--target', target, '--yes'], { home })
        assert.equal(r.status, 2, r.combined)
        assert.match(r.combined, /宿主冲突/)
        assert.match(r.combined, /cursor/)
        assert.match(r.combined, /aaa-conflict\.yaml/)
        // 零写入：无落点无粘性
        assert.equal(existsSync(path.join(target, '.cursor')), false)
        assert.equal(existsSync(path.join(target, '.coding-kit')), false)
      })
    })
  })

  it('铁律②b：用户表间冲突（后载者 zzz-dup 与先载 acme 同 id）→ exit 2 点名 · 零写入', async () => {
    await withAcmeHome(async (home) => {
      await writeFile(
        path.join(home, '.spec-wave', 'hosts', 'zzz-dup.yaml'),
        acmeTableExtra('acme-bot'),
      )
      await withTemp(async (target) => {
        const r = runCli(['host', 'apply', '--tools', 'acme-bot', '--target', target, '--yes'], { home })
        assert.equal(r.status, 2, r.combined)
        assert.match(r.combined, /宿主冲突/)
        assert.match(r.combined, /acme-bot/)
        assert.match(r.combined, /zzz-dup\.yaml/)
        assert.equal(existsSync(path.join(target, '.coding-kit')), false)
      })
    })
  })

  it('铁律③：损坏表（YAML 解析失败 / schema 非法）→ exit 2 点名路径+原因 · 零写入 · 不误伤内置与他表', async () => {
    await withAcmeHome(async (home) => {
      await writeFile(path.join(home, '.spec-wave', 'hosts', 'broken-yaml.yaml'), 'hosts: [{{{\n')
      await withTemp(async (target) => {
        const r = runCli(['host', 'apply', '--tools', 'dsh', '--target', target, '--yes'], { home })
        assert.equal(r.status, 2, r.combined)
        assert.match(r.combined, /YAML 解析失败/)
        assert.match(r.combined, /broken-yaml\.yaml/)
        assert.equal(existsSync(path.join(target, '.dsh')), false)
        assert.equal(existsSync(path.join(target, '.coding-kit')), false)
      })
      await rm(path.join(home, '.spec-wave', 'hosts', 'broken-yaml.yaml'))
      await writeFile(path.join(home, '.spec-wave', 'hosts', 'broken-schema.yaml'), 'version: "1"\nhosts: []\n')
      await withTemp(async (target) => {
        const r = runCli(['host', 'apply', '--tools', 'dsh', '--target', target, '--yes'], { home })
        assert.equal(r.status, 2, r.combined)
        assert.match(r.combined, /用户适配表无效/)
        assert.match(r.combined, /broken-schema\.yaml/)
        assert.equal(existsSync(path.join(target, '.coding-kit')), false)
      })
    })
  })

  it('验收 #5 路①：acme-bot --file 路径（整表替换）→ apply 物化 + verify 绿 → 篡改红（双路齐 · 硬约束 12 闭环 · 阶段四补）', async () => {
    const ACME_FILE_TABLE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'acme-hosts-file.yaml')
    await withTemp(async (target) => {
      // validate → apply → verify 绿（source 相对包根解析 · --file 语义逐字现状）
      const val = runCli(['host', 'validate', '--file', ACME_FILE_TABLE])
      assert.equal(val.status, 0, val.combined)
      const r = runCli(['host', 'apply', '--tools', 'acme-bot', '--file', ACME_FILE_TABLE, '--target', target, '--yes', '--json'])
      assert.equal(r.status, 0, r.combined)
      const parsed = JSON.parse(r.stdout) as { written: string[] }
      assert.ok(parsed.written.includes('ACME.md'), JSON.stringify(parsed.written))
      const okV = runCli(['host', 'verify', '--tools', 'acme-bot', '--file', ACME_FILE_TABLE, '--target', target, '--json'])
      assert.equal(okV.status, 0, okV.combined)
      assert.equal((JSON.parse(okV.stdout) as { verdict: string }).verdict, 'PASS')
      const acmeAbs = path.join(target, 'ACME.md')
      const body = await readFile(acmeAbs, 'utf8')
      await writeFile(acmeAbs, body + '\nTAMPERED\n')
      const redV = runCli(['host', 'verify', '--tools', 'acme-bot', '--file', ACME_FILE_TABLE, '--target', target, '--json'])
      assert.equal(redV.status, 2, redV.combined)
      const redObj = JSON.parse(redV.stdout) as { checks: { target: string; status: string }[] }
      assert.ok(redObj.checks.some((c) => c.target === 'ACME.md' && c.status === 'mismatch'))
    })
  })

  it('--file = 当次整表替换（现状逐字）：用户目录 acme 在场 · --file 2.4.2 表 → acme-bot 未知 host_id exit 1（合并不参与）', async () => {
    await withAcmeHome(async (home) => {
      await withTemp(async (target) => {
        const r = runCli(
          ['host', 'apply', '--tools', 'acme-bot', '--file', V1_FIXTURE, '--target', target, '--yes'],
          { home },
        )
        assert.equal(r.status, 1, r.combined)
        assert.match(r.combined, /未知 host_id.*acme-bot|acme-bot/)
        // 内置表（--file 指定）自身照常
        const ok = runCli(
          ['host', 'apply', '--tools', 'cursor', '--file', V1_FIXTURE, '--target', target, '--yes', '--json'],
          { home },
        )
        assert.equal(ok.status, 0, ok.combined)
      })
    })
  })

  it('无用户目录 = 现状逐字（existsSync 守卫 · 缺失不崩零加载）：空 HOME 内置 apply/verify/catalog 全正常', async () => {
    await withTemp(async (home) => {
      await withTemp(async (target) => {
        const r = runCli(['host', 'apply', '--tools', 'dsh', '--target', target, '--yes', '--json'], { home })
        assert.equal(r.status, 0, r.combined)
        const parsed = JSON.parse(r.stdout) as { degraded_none: string[] }
        assert.deepEqual(parsed.degraded_none, ['dsh'])
        const v = runCli(['host', 'verify', '--tools', 'dsh', '--target', target], { home })
        assert.equal(v.status, 0, v.combined)
        const cat = runCli(['host', 'catalog', 'list', '--target', target, '--json'], { home })
        assert.equal(cat.status, 0, cat.combined)
        const catObj = JSON.parse(cat.stdout) as { tables: unknown[]; verdict: string }
        assert.equal(catObj.tables.length, 1)
        assert.equal(catObj.verdict, 'PASS')
      })
    })
  })

  it('F-W2-08：用户目录不可读 → exit 2 点名（不静默当无表）· 纯函数 home 注入跨平台断言', async (t) => {
    // 纯函数跨平台语义（Windows 口径 = path.join 分隔符 · 登记）
    assert.equal(userHostsDirOf('/home/u'), path.join('/home/u', '.spec-wave', 'hosts'))
    assert.equal(userHostsDirOf('C:\\Users\\u'), path.join('C:\\Users\\u', '.spec-wave', 'hosts'))
    if (process.platform === 'win32') {
      t.skip('POSIX chmod 语义用例')
      return
    }
    await withAcmeHome(async (home) => {
      const dir = path.join(home, '.spec-wave', 'hosts')
      await chmod(dir, 0o000)
      try {
        await withTemp(async (target) => {
          const r = runCli(['host', 'apply', '--tools', 'dsh', '--target', target, '--yes'], { home })
          assert.equal(r.status, 2, r.combined)
          assert.match(r.combined, /不可读/)
        })
      } finally {
        await chmod(dir, 0o755)
      }
    })
  })
})
