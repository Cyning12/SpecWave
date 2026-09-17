import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

// 3.0 W7 · S7.4 A3 对外口径边界机检（验收 #3）：forbidden_wording 零命中 + 负向 fixture 真红。
// 红测先行锚点：脚本不存在时 spawn 失败（status null）→ 本文件真红。
const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(KIT, 'scripts', 'check-claims.mjs')
const CONFIG = path.join(KIT, 'assets', 'harness', 'claims-boundary.yaml')

function run(root: string): { status: number | null; combined: string } {
  const r = spawnSync(process.execPath, [SCRIPT, '--root', root, '--config', CONFIG], {
    encoding: 'utf8',
    cwd: KIT,
  })
  return { status: r.status, combined: `${r.stdout ?? ''}\n${r.stderr ?? ''}` }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-claims-'))
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

describe('3.0-W7 S7.4 · check-claims（A3 对外口径边界 failClosed）', { concurrency: 1 }, () => {
  it('正向：真实仓对外文案 forbidden_wording 零命中 · exit 0', () => {
    const r = run(KIT)
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /CLAIMS: PASS/)
    assert.match(r.combined, /零命中/)
  })

  it('负向 red→green：promotion 注入「门禁靠宿主 hook 强制」→ exit 2 点名；清除后复绿', async () => {
    await withTemp(async (dir) => {
      const f = path.join(dir, 'delivery', 'promotion', 'inject.md')
      await writeRel(dir, 'delivery/promotion/inject.md', '# x\n\n门禁靠宿主 hook 强制\n')
      const bad = run(dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /CLAIMS: FAIL/)
      assert.ok(bad.combined.includes('delivery/promotion/inject.md'), bad.combined)
      await rm(f, { force: true })
      const good = run(dir)
      assert.equal(good.status, 0, good.combined)
    })
  })

  it('正向口径零命中：诚实边界措辞「不依赖宿主是否执行了 hook」不判红', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'README.md', '# R\n\n门禁随包内置 · 不依赖宿主是否执行了 hook\n')
      const r = run(dir)
      assert.equal(r.status, 0, r.combined)
    })
  })
})
