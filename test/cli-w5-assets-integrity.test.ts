import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile, mkdir, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

// 2.3-W5 · A2 资产完整性校验（SPEC 05 · 蓝本 docs/spec/2_3-wiring-completion/05_w5_assets_integrity_v1.md）：
// assets verify（ok/mismatch/missing/extra 四态 · failClosed exit 2）· assets manifest rebuild（dry-run 默认 ·
// --yes 写 · 幂等 · 修复对象=manifest 永不反向改资产 D-23-W5-FIX-TARGET）· 排除清单双侧一致（D-23-W5-EXCLUDE）。
// 红→绿钉死：实现前 assets 为未知子命令 exit 1；三档负向/fix/failClosed 均为本波新增行为。
// 2.4-W4（蓝本 docs/spec/2_4-gate-strength/04_w4_assets_observability_v1.md · D-24-W4-WARN-ONLY）：
// verify 排除项 WARN 清单（exit 0 不升 2 · --json excluded 字段 · F-W4-01 截断）· rebuild 追认警示快照断言两路。

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
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w5ai-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

async function writeRel(root: string, rel: string, body: string | Buffer): Promise<string> {
  const abs = path.join(root, rel)
  await mkdir(path.dirname(abs), { recursive: true })
  await writeFile(abs, body)
  return abs
}

// 最小资产靶场：两文件（含嵌套目录验证 posix 路径）
async function seedAssets(root: string): Promise<void> {
  await writeRel(root, 'assets/README.md', '# fixture assets\n')
  await writeRel(root, 'assets/prompts/hat.md', 'hat prompt body\n')
}

async function rebuildYes(root: string): Promise<RunResult> {
  return runCli(['assets', 'manifest', 'rebuild', '--target', root, '--yes'])
}

describe('2.3-W5 · assets 资产完整性校验（SPEC 05）', { concurrency: 1 }, () => {
  it('正向：rebuild --yes 生成 manifest → verify exit 0 PASS · --json 键集（status/manifest/counts/files）', async () => {
    await withTemp(async (dir) => {
      await seedAssets(dir)
      const rb = await rebuildYes(dir)
      assert.equal(rb.status, 0, rb.combined)
      assert.match(rb.combined, /\[written\] assets\/sha256\.manifest（2 条）/)
      const mf = await readFile(path.join(dir, 'assets', 'sha256.manifest'), 'utf8')
      assert.match(mf, /^[0-9a-f]{64}  README\.md$/m, 'manifest 行格式 = sha256+两空格+posix 路径')
      assert.match(mf, /^[0-9a-f]{64}  prompts\/hat\.md$/m, '嵌套路径 posix 化（/ 分隔）')
      assert.ok(!mf.includes('\\\\'), 'manifest 不得含反斜杠（F-W5-04）')
      assert.ok(!mf.includes('sha256.manifest'), 'manifest 自身不入清单（SPEC §3①）')
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 0, v.combined)
      assert.match(v.combined, /ASSETS: PASS · 2\/2 文件一致/)
      const j = runCli(['assets', 'verify', '--target', dir, '--json'])
      assert.equal(j.status, 0, j.combined)
      const payload = JSON.parse(j.stdout) as Record<string, unknown>
      assert.equal(payload.status, 'pass')
      assert.equal(payload.manifest, 'assets/sha256.manifest')
      assert.deepEqual(payload.counts, { registered: 2, ok: 2, mismatch: 0, missing: 0, extra: 0 })
      assert.equal((payload.files as unknown[]).length, 2)
    })
  })

  it('篡改负向（验收①）：改资产一字节 → verify exit 2 指出该文件 mismatch', async () => {
    await withTemp(async (dir) => {
      await seedAssets(dir)
      await rebuildYes(dir)
      await writeRel(dir, 'assets/README.md', '# fixture assets TAMPERED\n')
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 2, v.combined)
      assert.match(v.combined, /\[mismatch\] README\.md/)
      assert.match(v.combined, /ASSETS: BLOCKED · 1 偏差 \/ 2 登记/)
      const j = runCli(['assets', 'verify', '--target', dir, '--json'])
      assert.equal(j.status, 2, j.combined)
      const payload = JSON.parse(j.stdout) as { status: string; counts: { mismatch: number }; files: Array<{ path: string; status: string }> }
      assert.equal(payload.status, 'blocked')
      assert.equal(payload.counts.mismatch, 1)
      assert.equal(payload.files.find((f) => f.path === 'README.md')?.status, 'mismatch')
    })
  })

  it('missing / extra 两档（验收②）：删登记文件 → missing exit 2 · 新增未登记文件 → extra exit 2', async () => {
    await withTemp(async (dir) => {
      await seedAssets(dir)
      await rebuildYes(dir)
      await unlink(path.join(dir, 'assets', 'prompts', 'hat.md'))
      const v1 = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v1.status, 2, v1.combined)
      assert.match(v1.combined, /\[missing\] prompts\/hat\.md/)
    })
    await withTemp(async (dir) => {
      await seedAssets(dir)
      await rebuildYes(dir)
      await writeRel(dir, 'assets/stray.md', 'unregistered\n')
      const v2 = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v2.status, 2, v2.combined)
      assert.match(v2.combined, /\[extra\] stray\.md/)
    })
  })

  it('F-W5-01 failClosed：manifest 缺失 / 语法坏 / 重复路径 → exit 2 指 manifest 本身', async () => {
    await withTemp(async (dir) => {
      await seedAssets(dir)
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 2, v.combined)
      assert.match(v.combined, /manifest 缺失: assets\/sha256\.manifest/)
      assert.match(v.combined, /F-W5-01/)
    })
    await withTemp(async (dir) => {
      await seedAssets(dir)
      await writeRel(dir, 'assets/sha256.manifest', 'not-a-valid-line\n')
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 2, v.combined)
      assert.match(v.combined, /manifest 语法错误.*第 1 行/)
    })
    await withTemp(async (dir) => {
      await seedAssets(dir)
      const h = 'a'.repeat(64)
      await writeRel(dir, 'assets/sha256.manifest', `${h}  README\.md\n${h}  README\.md\n`)
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 2, v.combined)
      assert.match(v.combined, /manifest 路径重复/)
    })
    await withTemp(async (dir) => {
      await seedAssets(dir)
      const h = 'b'.repeat(64)
      await writeRel(dir, 'assets/sha256.manifest', `${h}  \.\./package\.json\n`)
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 2, v.combined)
      assert.match(v.combined, /manifest 路径越界/)
    })
  })

  it('F-W5-02 failClosed：assets 目录缺失 → verify / rebuild 均 exit 2 不静默', async () => {
    await withTemp(async (dir) => {
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 2, v.combined)
      assert.match(v.combined, /assets 目录缺失/)
      const rb = runCli(['assets', 'manifest', 'rebuild', '--target', dir, '--yes'])
      assert.equal(rb.status, 2, rb.combined)
      assert.match(rb.combined, /assets 目录缺失/)
      assert.equal(existsSync(path.join(dir, 'assets', 'sha256.manifest')), false, '不得生成空 manifest 伪装绿')
    })
  })

  it('修复收敛（验收③）：dry-run 零写盘 → --yes 后 verify exit 0 → 二次 rebuild 幂等无变化', async () => {
    await withTemp(async (dir) => {
      await seedAssets(dir)
      await rebuildYes(dir)
      const mfBefore = await readFile(path.join(dir, 'assets', 'sha256.manifest'), 'utf8')
      await writeRel(dir, 'assets/README.md', '# changed content\n') // 篡改制造偏差
      const dry = runCli(['assets', 'manifest', 'rebuild', '--target', dir])
      assert.equal(dry.status, 0, dry.combined)
      assert.match(dry.combined, /dry-run · 以上为将写计划/)
      assert.match(dry.combined, /~1 变更/)
      const mfAfterDry = await readFile(path.join(dir, 'assets', 'sha256.manifest'), 'utf8')
      assert.equal(mfAfterDry, mfBefore, 'dry-run 零写盘')
      const v1 = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v1.status, 2, 'dry-run 后偏差仍在（未被静默修复）')
      const yes = await rebuildYes(dir)
      assert.equal(yes.status, 0, yes.combined)
      const v2 = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v2.status, 0, v2.combined)
      const again = await rebuildYes(dir)
      assert.equal(again.status, 0, again.combined)
      assert.match(again.combined, /无变化 · 2 条已同步（幂等 · 零写盘）/)
    })
  })

  it('F-W5-06 排除清单双侧一致：x.bak / .DS_Store / tail~ 不入清单也不判 extra', async () => {
    await withTemp(async (dir) => {
      await seedAssets(dir)
      await writeRel(dir, 'assets/x.bak', 'backup\n')
      await writeRel(dir, 'assets/.DS_Store', 'junk')
      await writeRel(dir, 'assets/prompts/draft~', 'temp\n')
      const rb = await rebuildYes(dir)
      assert.equal(rb.status, 0, rb.combined)
      assert.match(rb.combined, /登记 2 文件 /)
      const mf = await readFile(path.join(dir, 'assets', 'sha256.manifest'), 'utf8')
      assert.ok(!mf.includes('.bak') && !mf.includes('.DS_Store') && !mf.includes('draft~'), '排除项不入清单')
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 0, v.combined + '（排除项不得判 extra）')
    })
  })

  it('用法错 exit 1：未知子命令 / 未知参数 · --json 信封（D-23-W3-ENVELOPE 同口径）', async () => {
    await withTemp(async (dir) => {
      const u1 = runCli(['assets', 'bogus', '--target', dir])
      assert.equal(u1.status, 1, u1.combined)
      assert.match(u1.combined, /assets 子命令未知/)
      const u2 = runCli(['assets', 'manifest', 'bogus', '--target', dir])
      assert.equal(u2.status, 1, u2.combined)
      assert.match(u2.combined, /assets manifest 动作未知/)
      const u3 = runCli(['assets', 'verify', '--frobnicate', '--target', dir])
      assert.equal(u3.status, 1, u3.combined)
      assert.match(u3.combined, /assets 未知参数/)
      const j = runCli(['assets', 'bogus', '--json'])
      assert.equal(j.status, 1, j.combined)
      const payload = JSON.parse(j.stdout) as { command: string; exitCode: number }
      assert.equal(payload.command, 'assets')
      assert.equal(payload.exitCode, 1)
    })
  })

  it('本仓 dogfood：assets verify 仓根 exit 0 · 110+ 文件一致（src 面 · bin 面见 lib-smoke S5）', () => {
    const v = runCli(['assets', 'verify'])
    assert.equal(v.status, 0, v.combined)
    assert.match(v.combined, /ASSETS: PASS · (\d+)\/\1 文件一致/)
  })
})

describe('2.4-W4 · 资产门禁可观测补全（SPEC 04 · D-24-W4-WARN-ONLY）', { concurrency: 1 }, () => {
  it('N2 构造（验收①）：assets/ 放 .bak → verify exit 0 且 WARN 点名 · 删除后消失 · --json excluded 字段', async () => {
    await withTemp(async (dir) => {
      await seedAssets(dir)
      await writeRel(dir, 'assets/prompts/leak.bak', 'leaked\n')
      await rebuildYes(dir)
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 0, v.combined + '（排除项为 warning 级 · 不升 exit 2）')
      assert.match(v.combined, /WARN: 排除项 1 个（不参与哈希校验 · D-23-W5-EXCLUDE）: prompts\/leak\.bak/)
      assert.match(v.combined, /ASSETS: PASS · 2\/2 文件一致/, 'warning 不干扰 PASS 判读（F-W4-04）')
      const j = runCli(['assets', 'verify', '--target', dir, '--json'])
      assert.equal(j.status, 0, j.combined)
      const payload = JSON.parse(j.stdout) as Record<string, unknown>
      assert.equal(payload.status, 'pass')
      assert.deepEqual(payload.excluded, ['prompts/leak.bak'], '--json 面独立 excluded 字段（键集只增）')
      await unlink(path.join(dir, 'assets', 'prompts', 'leak.bak'))
      const v2 = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v2.status, 0, v2.combined)
      assert.ok(!v2.combined.includes('WARN: 排除项'), '删除排除项后 warning 消失')
      const j2 = JSON.parse(runCli(['assets', 'verify', '--target', dir, '--json']).stdout) as Record<string, unknown>
      assert.deepEqual(j2.excluded, [], '无排除项时 excluded 为空数组')
    })
  })

  it('N2 · F-W4-01 截断：排除项 > 5 → 前 5 条 + 「… 共 M 个」汇总 · exit 仍 0', async () => {
    await withTemp(async (dir) => {
      await seedAssets(dir)
      for (const n of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
        await writeRel(dir, `assets/${n}.bak`, 'x\n')
      }
      await rebuildYes(dir)
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 0, v.combined)
      assert.match(v.combined, /WARN: 排除项 7 个（不参与哈希校验 · D-23-W5-EXCLUDE）: a\.bak, b\.bak, c\.bak, d\.bak, e\.bak … 共 7 个/)
      assert.ok(!/f\.bak/.test(v.combined.split('\n').find((l) => l.startsWith('WARN')) ?? ''), 'WARN 行截断不含第 6 条')
      const j = JSON.parse(runCli(['assets', 'verify', '--target', dir, '--json']).stdout) as { excluded: string[] }
      assert.equal(j.excluded.length, 7, '--json 面 excluded 携带全量清单')
    })
  })

  it('N2 · warning 不掩负向：排除项 + 真实篡改并存 → 仍 failClosed exit 2 且 WARN 同显（F-W4-02/F-W4-04）', async () => {
    await withTemp(async (dir) => {
      await seedAssets(dir)
      await writeRel(dir, 'assets/x.bak', 'backup\n')
      await rebuildYes(dir)
      await writeRel(dir, 'assets/README.md', '# TAMPERED\n')
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 2, v.combined + '（真实篡改仍 exit 2 · warning 不削弱 failClosed）')
      assert.match(v.combined, /\[mismatch\] README\.md/)
      assert.match(v.combined, /WARN: 排除项 1 个/)
      const j = runCli(['assets', 'verify', '--target', dir, '--json'])
      assert.equal(j.status, 2, j.combined)
      const payload = JSON.parse(j.stdout) as { status: string; excluded: string[] }
      assert.equal(payload.status, 'blocked')
      assert.deepEqual(payload.excluded, ['x.bak'])
    })
  })

  it('N5 快照断言（验收②）：rebuild dry-run 与 --yes 两路均含追认警示（追认 · provenance（未启用））', async () => {
    await withTemp(async (dir) => {
      await seedAssets(dir)
      await rebuildYes(dir)
      await writeRel(dir, 'assets/README.md', '# changed\n') // 制造偏差使两路均非幂等空转
      const dry = runCli(['assets', 'manifest', 'rebuild', '--target', dir])
      assert.equal(dry.status, 0, dry.combined)
      assert.match(dry.combined, /WARN: 本操作将当前资产状态追认为真值——若资产曾被篡改，篡改将随本次 rebuild 被合法化；防投毒依赖 provenance（未启用）/, 'dry-run 路追认警示')
      assert.match(dry.combined, /追认/)
      assert.match(dry.combined, /provenance（未启用）/)
      const yes = runCli(['assets', 'manifest', 'rebuild', '--target', dir, '--yes'])
      assert.equal(yes.status, 0, yes.combined)
      assert.match(yes.combined, /WARN: 本操作将当前资产状态追认为真值——若资产曾被篡改，篡改将随本次 rebuild 被合法化；防投毒依赖 provenance（未启用）/, '--yes 写盘路追认警示')
      assert.match(yes.combined, /\[written\] assets\/sha256\.manifest/)
      const v = runCli(['assets', 'verify', '--target', dir])
      assert.equal(v.status, 0, v.combined)
    })
  })
})
