import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { CliError, findGitRoot, resolveTaskPath, resolveTarget, toRel } from '../src/cli-shared.ts'

// 2.2-W2 · C1 路径穿越收口 + C3 停止输出绝对路径（红→绿钉死 · task_2_2_closed_loop_w2_security_closure）
// D-W2-ABS-PATH-UX 冻结：拒止 + 迁移指引 · exit 1（用法错误档）

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string }

function runCli(args: string[], cwd = KIT): RunResult {
  const result = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd,
    env: { ...process.env },
  })
  const stdout = result.stdout ?? ''
  const stderr = result.stderr ?? ''
  return { status: result.status, stdout, stderr, combined: `${stdout}\n${stderr}` }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w2sec-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

/** git 仓 fixture：seed .git（C1-b git-root 归属校验后的合法 target 形态） */
async function withTempRepo(fn: (dir: string) => Promise<void>): Promise<void> {
  await withTemp(async (dir) => {
    await mkdir(path.join(dir, '.git'), { recursive: true })
    await fn(dir)
  })
}

async function writeRel(root: string, rel: string, body: string): Promise<string> {
  const abs = path.join(root, rel)
  await mkdir(path.dirname(abs), { recursive: true })
  await writeFile(abs, body, 'utf8')
  return abs
}

const SENTINEL = 'SENTINEL_SECRET_7f3a9c2e'

function taskMd(slug: string): string {
  return [
    `# Task ${slug}`,
    '',
    '> **状态**：`draft`',
    '',
    '## Harness 元信息',
    '',
    '| 字段 | 值 |',
    '|------|-----|',
    `| **task_slug** | \`${slug}\` |`,
    '| **test_strategy** | `recommended`',
    '',
    '### 人工闸',
    '',
    '| human_gate_id | status | blocks_hats | 说明 |',
    '|---------------|--------|-------------|------|',
    '| HG-TASK-DRAFT | approved | 20,30 | fixture |',
    '| HG-AUDIT-R1 | approved | 30 | fixture |',
    '',
    '## 验收标准',
    '',
    '- [x] fixture item',
    '',
    '## 失败路径',
    '',
    '| F | Scenario |',
    '|---|----------|',
    '| F1 | fixture |',
    '',
    '### 自检结论（执行者）',
    '',
    '（30/40 回填）',
    '',
  ].join('\n')
}

const TASK_REL = 'docs/tasks/active/task_w2sec_ok_v1.md'

async function seedPassingTask(dir: string): Promise<void> {
  await writeRel(dir, TASK_REL, taskMd('w2sec_ok'))
  await writeRel(dir, 'docs/harness/reviews/task_w2sec_ok_audit_R1_20260911.md', '# R1 fixture')
  await writeRel(dir, 'docs/harness/invokes/by-task/w2sec_ok/invoke_20260911_10_w2sec_ok.md', '# invoke 10 fixture')
}

describe('2.2-W2 C1 · resolveTaskPath 单点收口（单元）', () => {
  it('target 内绝对路径放行（存量合法用法不误伤）', () => {
    const target = path.join(os.tmpdir(), 'w2sec-unit-target')
    const inside = path.join(target, 'docs', 'tasks', 'active', 't.md')
    assert.equal(resolveTaskPath(target, inside), path.normalize(inside))
  })

  it('target 外绝对路径拒止 · CliError exit 1 · 文案含迁移指引', () => {
    const target = path.join(os.tmpdir(), 'w2sec-unit-target')
    assert.throws(
      () => resolveTaskPath(target, '/etc/hosts'),
      (e: unknown) => {
        assert.ok(e instanceof CliError)
        assert.equal((e as CliError).exitCode, 1)
        assert.match((e as Error).message, /拒绝|target 之外/)
        assert.match((e as Error).message, /相对路径/)
        return true
      },
    )
  })

  it('相对路径 .. 逃逸 target 拒止（F-W2-03）', () => {
    const target = path.join(os.tmpdir(), 'w2sec-unit-target')
    assert.throws(() => resolveTaskPath(target, '../escape.md'), /相对路径/)
    assert.throws(() => resolveTaskPath(target, 'docs/../../escape.md'), /相对路径/)
  })

  it('合法相对路径归卡 target 内', () => {
    const target = path.join(os.tmpdir(), 'w2sec-unit-target')
    assert.equal(
      resolveTaskPath(target, 'docs/tasks/active/t.md'),
      path.join(target, 'docs', 'tasks', 'active', 't.md'),
    )
  })
})

describe('2.2-W2 C1 · findGitRoot / resolveTarget git-root 归属（单元）', () => {
  it('findGitRoot：自身含 .git / 祖先含 .git / 无 git 仓 → null', async () => {
    await withTemp(async (dir) => {
      assert.equal(findGitRoot(dir), null, '无 .git 的 tmp 目录应判 null')
      await mkdir(path.join(dir, '.git'), { recursive: true })
      assert.equal(findGitRoot(dir), dir)
      const nested = path.join(dir, 'a', 'b')
      await mkdir(nested, { recursive: true })
      assert.equal(findGitRoot(nested), dir, '嵌套子目录应归属祖先 git root')
    })
  })

  it('resolveTarget requireGitRoot：非 git 仓 target → CliError exit 1 且文案明确', async () => {
    await withTemp(async (dir) => {
      assert.throws(
        () => resolveTarget(process.cwd(), dir, { requireGitRoot: true }),
        (e: unknown) => {
          assert.ok(e instanceof CliError)
          assert.equal((e as CliError).exitCode, 1)
          assert.match((e as Error).message, /git/)
          return true
        },
      )
      await mkdir(path.join(dir, '.git'), { recursive: true })
      assert.equal(resolveTarget(process.cwd(), dir, { requireGitRoot: true }), dir)
    })
  })

  it('resolveTarget 默认不带 git-root 校验（init/host 等非 git 合法面不回归）', async () => {
    await withTemp(async (dir) => {
      assert.equal(resolveTarget(process.cwd(), dir), dir)
    })
  })
})

describe('2.2-W2 C3 · toRel 输出口径（单元）', () => {
  it('target==cwd → 「.」；仓内 → 相对；仓外 → .. 相对形（均非绝对路径）', () => {
    const cwd = path.join(os.tmpdir(), 'w2sec-torel-cwd')
    assert.equal(toRel(cwd, cwd), '.')
    assert.equal(toRel(cwd, path.join(cwd, 'sub', 'dir')), 'sub/dir')
    const outside = toRel(cwd, os.tmpdir())
    assert.equal(path.isAbsolute(outside), false, `仓外回落不得为绝对路径: ${outside}`)
    assert.ok(outside.startsWith('..'), `仓外回落应为 .. 相对形: ${outside}`)
  })
})

describe('2.2-W2 C1 · CLI 负向（/etc/hosts 类 · 不留读痕）', () => {
  it('verify --task /etc/hosts → 非 0 · 输出不含目标文件内容', () => {
    if (!existsSync('/etc/hosts')) return
    const r = runCli(['verify', '--target', '.', '--task', '/etc/hosts'])
    assert.notEqual(r.status, 0, r.combined)
    assert.equal(r.combined.includes('127.0.0.1'), false, '不得读取 /etc/hosts 内容')
    assert.equal(r.combined.includes('localhost'), false, '不得读取 /etc/hosts 内容')
    assert.match(r.combined, /相对路径/, '报错须含相对路径迁移指引')
  })

  it('verify --task <target 外绝对路径> → exit 1 · 不含文件内容哨兵 · 含迁移指引', async () => {
    await withTempRepo(async (repo) => {
      await withTemp(async (outside) => {
        const secret = await writeRel(outside, 'secret.md', SENTINEL)
        const r = runCli(['verify', '--target', repo, '--task', secret])
        assert.equal(r.status, 1, r.combined)
        assert.equal(r.combined.includes(SENTINEL), false, '不得读取 target 外文件内容')
        assert.match(r.combined, /相对路径/)
      })
    })
  })

  it('verify --spec <target 外绝对路径> → exit 1（--spec 路径同口径收口）', async () => {
    await withTempRepo(async (repo) => {
      await withTemp(async (outside) => {
        const secret = await writeRel(outside, 'spec.md', SENTINEL)
        const r = runCli(['verify', '--target', repo, '--spec', secret])
        assert.equal(r.status, 1, r.combined)
        assert.equal(r.combined.includes(SENTINEL), false)
        assert.match(r.combined, /相对路径/)
      })
    })
  })

  it('audit / gate-check --task <target 外绝对路径> → exit 1（4 调用点同收口）', async () => {
    await withTempRepo(async (repo) => {
      await withTemp(async (outside) => {
        const secret = await writeRel(outside, 'secret.md', SENTINEL)
        for (const cmd of ['audit', 'gate-check']) {
          const r = runCli([cmd, '--target', repo, '--task', secret])
          assert.equal(r.status, 1, `${cmd}: ${r.combined}`)
          assert.equal(r.combined.includes(SENTINEL), false, `${cmd} 不得读取 target 外文件`)
        }
      })
    })
  })

  it('verify --task ../escape.md（.. 逃逸）→ exit 1 · 不含哨兵', async () => {
    await withTempRepo(async (repo) => {
      const escapeAbs = path.join(repo, '..', `escape-${path.basename(repo)}.md`)
      await writeFile(escapeAbs, SENTINEL, 'utf8')
      try {
        const r = runCli(['verify', '--target', repo, '--task', `../escape-${path.basename(repo)}.md`])
        assert.equal(r.status, 1, r.combined)
        assert.equal(r.combined.includes(SENTINEL), false)
        assert.match(r.combined, /相对路径/)
      } finally {
        await rm(escapeAbs, { force: true })
      }
    })
  })

  it('verify --target <非 git 仓> → 非 0 · 明确 git 仓报错（F-W2-02）', async () => {
    await withTemp(async (dir) => {
      const r = runCli(['verify', '--target', dir, '--task', 'docs/tasks/active/t.md'])
      assert.notEqual(r.status, 0, r.combined)
      assert.match(r.combined, /git/)
    })
  })

  it('audit / gate-check --target <非 git 仓> → 非 0（同口径）', async () => {
    await withTemp(async (dir) => {
      for (const cmd of ['audit', 'gate-check']) {
        const r = runCli([cmd, '--target', dir, '--task', 'docs/tasks/active/t.md'])
        assert.notEqual(r.status, 0, `${cmd}: ${r.combined}`)
        assert.match(r.combined, /git/, `${cmd}: ${r.combined}`)
      }
    })
  })
})

describe('2.2.1 · P0 C1 symlink 穿透封堵（验收报告 §2 W2 D 行复现 · realpath 归卡）', () => {
  it('仓内 symlink → 仓外文件：verify / gate-check / audit / --spec 四调用点一律拒 · exit 非 0 · 不留读痕', async () => {
    await withTempRepo(async (repo) => {
      await withTemp(async (outside) => {
        const secret = await writeRel(outside, 'secret-task.md', SENTINEL)
        await mkdir(path.join(repo, 'docs', 'tasks', 'active'), { recursive: true })
        await symlink(secret, path.join(repo, 'docs', 'tasks', 'active', 'link.md'))
        const points: Array<[string, string]> = [
          ['verify', '--task'],
          ['gate-check', '--task'],
          ['audit', '--task'],
          ['verify', '--spec'],
        ]
        for (const [cmd, flag] of points) {
          const r = runCli([cmd, '--target', repo, flag, 'docs/tasks/active/link.md'])
          const label = cmd + ' ' + flag
          assert.notEqual(r.status, 0, label + ': ' + r.combined)
          assert.equal(r.combined.includes(SENTINEL), false, label + ' 不得读取仓外文件内容')
          assert.match(r.combined, /相对路径/, label + ' 报错须含迁移指引')
        }
      })
    })
  })

  it('resolveTaskPath 单元：symlink 穿仓即拒（realpath 归卡 · 双侧 realpath）', async () => {
    await withTempRepo(async (repo) => {
      await withTemp(async (outside) => {
        const secret = await writeRel(outside, 'secret.md', SENTINEL)
        const link = path.join(repo, 'link.md')
        await symlink(secret, link)
        assert.throws(() => resolveTaskPath(repo, 'link.md'), /拒绝|target 之外/)
      })
    })
  })

  it('悬空 symlink 保持「未找到」语义（F-P1-05 · existsSync 跟随兜底 · 与缺失文件同口径）', async () => {
    await withTempRepo(async (repo) => {
      await mkdir(path.join(repo, 'docs', 'tasks', 'active'), { recursive: true })
      await symlink('no-such-target.md', path.join(repo, 'docs', 'tasks', 'active', 'dangling.md'))
      // verify：缺失文件口径 exit 2 BLOCKED「文件不存在」（不得漂移成他种报错）
      const v = runCli(['verify', '--target', repo, '--task', 'docs/tasks/active/dangling.md'])
      assert.equal(v.status, 2, v.combined)
      assert.match(v.combined, /文件不存在|未找到/)
      // gate-check：exit 1「未找到」
      const g = runCli(['gate-check', '--target', repo, '--task', 'docs/tasks/active/dangling.md'])
      assert.equal(g.status, 1, g.combined)
      assert.match(g.combined, /未找到|文件不存在/)
    })
  })

  it('仓内 symlink → 仓内文件 放行不破（F-P1-04 · 存量合法用法）', async () => {
    await withTempRepo(async (repo) => {
      await seedPassingTask(repo)
      await symlink(path.basename(TASK_REL), path.join(repo, 'docs', 'tasks', 'active', 'link_ok.md'))
      // 单点收口：symlink 解析后仍归卡仓内 → 不拒（gate-check 无 review/invoke 依赖，纯闸面放行证据）
      const abs = resolveTaskPath(repo, 'docs/tasks/active/link_ok.md')
      assert.equal(abs, path.join(repo, 'docs', 'tasks', 'active', 'link_ok.md'))
      const r = runCli(['gate-check', '--target', repo, '--task', 'docs/tasks/active/link_ok.md'])
      assert.equal(r.status, 0, r.combined)
    })
  })
})

describe('2.2-W2 回归 · 合法用法不破', () => {
  it('verify 合法相对路径 + git 仓 target → VERIFY: PASS', async () => {
    await withTempRepo(async (repo) => {
      await seedPassingTask(repo)
      const r = runCli(['verify', '--target', repo, '--task', TASK_REL])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /VERIFY: PASS/)
    })
  })

  it('gate-check 合法相对路径 → PASS（target 内绝对路径亦放行）', async () => {
    await withTempRepo(async (repo) => {
      await seedPassingTask(repo)
      const rel = runCli(['gate-check', '--target', repo, '--task', TASK_REL])
      assert.equal(rel.status, 0, rel.combined)
      const abs = runCli(['gate-check', '--target', repo, '--task', path.join(repo, TASK_REL)])
      assert.equal(abs.status, 0, `target 内绝对路径存量用法不得误伤: ${abs.combined}`)
    })
  })
})

describe('2.2-W2 C3 · stdout 无绝对目标路径（断言）', () => {
  it('gate-check / audit / check：--target . 与 --target <abs> 输出稳定且不含绝对路径', async () => {
    await withTempRepo(async (repo0) => {
      // macOS mkdtemp 返回 /var/... 而 spawn cwd 解析为 /private/var/...，统一 realpath 口径
      const repo = await realpath(repo0)
      await seedPassingTask(repo)
      for (const cmd of ['gate-check', 'audit', 'check']) {
        const args = cmd === 'check' ? [cmd, '--target'] : [cmd, '--target']
        const r1 = runCli([...args, '.', ...(cmd === 'check' ? [] : ['--task', TASK_REL])], repo)
        const r2 = runCli([...args, repo, ...(cmd === 'check' ? [] : ['--task', TASK_REL])], repo)
        assert.equal(r1.status, 0, `${cmd} --target .: ${r1.combined}`)
        assert.equal(r2.status, 0, `${cmd} --target abs: ${r2.combined}`)
        assert.equal(
          r1.stdout.includes(repo),
          false,
          `${cmd} stdout 不得含绝对目标路径: ${r1.stdout}`,
        )
        assert.equal(
          r2.stdout.includes(repo),
          false,
          `${cmd} stdout 不得含绝对目标路径: ${r2.stdout}`,
        )
        const line1 = r1.stdout.split('\n').find((l) => l.startsWith('目标:'))
        const line2 = r2.stdout.split('\n').find((l) => l.startsWith('目标:'))
        assert.ok(line1, `${cmd} 应有 目标: 行`)
        assert.equal(line1, line2, `${cmd} 目标行须与 target 参数拼写无关地稳定`)
        assert.equal(line1, '目标: .', `${cmd} 目标行应为相对口径: ${line1}`)
      }
    })
  })
})
