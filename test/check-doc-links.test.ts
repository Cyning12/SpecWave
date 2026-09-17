import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

// 3.0 W7 · S7.7 文档链接两级机检（验收 #4）：非 S2 (i)/(ii) 硬判 0 · S2 冻结基线 · 负向 red→green。
// 红测先行锚点：脚本不存在时 spawn 失败（status null）→ 本文件真红。
const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(KIT, 'scripts', 'check-doc-links.mjs')

function run(root: string, extra: string[] = []): { status: number | null; combined: string } {
  const r = spawnSync(process.execPath, [SCRIPT, '--root', root, ...extra], { encoding: 'utf8', cwd: KIT })
  return { status: r.status, combined: `${r.stdout ?? ''}\n${r.stderr ?? ''}` }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-links-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

async function writeRel(root: string, rel: string, body: string): Promise<void> {
  const abs = path.join(root, rel)
  await mkdir(path.dirname(abs), { recursive: true })
  await writeFile(abs, body, 'utf8')
}

describe('3.0-W7 S7.7 · check-doc-links（两级机检 failClosed）', { concurrency: 1 }, () => {
  it('正向：真实仓 非S2(i)=0 非S2(ii)=0 · S2 冻结基线 23 · exit 0', () => {
    const r = run(KIT)
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /非S2\(i\)=0 非S2\(ii\)=0/)
    assert.match(r.combined, /冻结基线 23/)
  })

  it('负向 (i) red→green：非 S2 注入 ./nope.md → exit 2 点名；删除复绿', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'docs/roadmap/x.md', '# x\n\n[bad](./nope.md)\n')
      const bad = run(dir, ['--s2-baseline', '0'])
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /DOC LINKS: FAIL/)
      assert.ok(bad.combined.includes('docs/roadmap/x.md'), bad.combined)
      await rm(path.join(dir, 'docs', 'roadmap', 'x.md'), { force: true })
      const good = run(dir, ['--s2-baseline', '0'])
      assert.equal(good.status, 0, good.combined)
    })
  })

  it('负向 (ii) red→green：非 S2 指向 .workbuddy 且未入库 → exit 2；改指仓内 tracked 目标复绿', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, '.workbuddy/output/foo.md', '# foo\n')
      await writeRel(dir, 'docs/roadmap/y.md', '# y\n\n[w](../../.workbuddy/output/foo.md)\n')
      const bad = run(dir, ['--s2-baseline', '0'])
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /\(ii\)/)
      await writeRel(dir, 'docs/roadmap/y.md', '# y\n\n[w](./tracked.md)\n')
      await writeRel(dir, 'docs/roadmap/tracked.md', '# t\n')
      const good = run(dir, ['--s2-baseline', '0'])
      assert.equal(good.status, 0, good.combined)
    })
  })

  it('S2 冻结基线：新增 S2 坏链使计数超基线 → exit 2（active 新增仍拦）', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'docs/tasks/a.md', '# a\n\n[bad](./nope.md)\n')
      const r = run(dir, ['--s2-baseline', '0'])
      assert.equal(r.status, 2, r.combined)
    })
  })
})
