import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

// 3.0 W7 · S7.3 术语机检（验收 #1）：canonical 正名判据 + 七目标闭集 + 豁免/词边界正负 fixture。
// 红测先行锚点：脚本不存在时 spawn 失败（ENOENT status null）→ 本文件真红。
const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(KIT, 'scripts', 'check-terminology.mjs')
const CONFIG = path.join(KIT, 'assets', 'harness', 'terminology.yaml')
const CANON = ['门禁', '过程轨', '帽制', '人闸', '真值源']

function run(root: string): { status: number | null; combined: string } {
  const r = spawnSync(process.execPath, [SCRIPT, '--root', root, '--config', CONFIG], {
    encoding: 'utf8',
    cwd: KIT,
  })
  return { status: r.status, combined: `${r.stdout ?? ''}\n${r.stderr ?? ''}` }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-term-'))
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

/** 最小合规语料：GLOSSARY 五词在位（其余判红面为空 ⇒ 无残留）。 */
async function seedClean(root: string): Promise<void> {
  await writeRel(root, 'GLOSSARY.md', `# G\n\n${CANON.join(' / ')}\n`)
}

describe('3.0-W7 S7.3 · check-terminology（canonical 正名 · 七目标闭集）', { concurrency: 1 }, () => {
  it('正向：真实仓判红面 门控 残留 0 · canonical 5/5 在位 · exit 0', () => {
    const r = run(KIT)
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /TERMINOLOGY: PASS/)
    assert.match(r.combined, /canonical 5\/5 在位/)
    assert.match(r.combined, /判红面 门控 残留 0/)
  })

  it('负向 red→green：delivery/promotion 注入 门控 → exit 2 点名；清除后复绿', async () => {
    await withTemp(async (dir) => {
      await seedClean(dir)
      const f = path.join(dir, 'delivery', 'promotion', 'inject.md')
      await writeRel(dir, 'delivery/promotion/inject.md', '# x\n\n本条含门控变体词\n')
      const bad = run(dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /TERMINOLOGY: FAIL/)
      assert.ok(bad.combined.includes('delivery/promotion/inject.md'), bad.combined)
      await rm(f, { force: true })
      const good = run(dir)
      assert.equal(good.status, 0, good.combined)
    })
  })

  it('canonical 不判红：README 注入 人闸/人工闸 → exit 0（正名非弃用词大扫）', async () => {
    await withTemp(async (dir) => {
      await seedClean(dir)
      await writeRel(dir, 'README.md', '# R\n\n人闸与人工闸表（canonical）\n')
      const r = run(dir)
      assert.equal(r.status, 0, r.combined)
    })
  })

  it('豁免面：RELEASING 的 门控 skip（gated-test 语义）不计残留 → exit 0', async () => {
    await withTemp(async (dir) => {
      await seedClean(dir)
      await writeRel(dir, 'RELEASING.md', '# R\n\n1 门控 skip\n')
      const r = run(dir)
      assert.equal(r.status, 0, r.combined)
    })
  })

  it('词边界：后门控制 含 门控 子串 → 不误报 · exit 0', async () => {
    await withTemp(async (dir) => {
      await seedClean(dir)
      await writeRel(dir, 'delivery/promotion/backdoor.md', '# B\n\n后门控制为测试注入\n')
      const r = run(dir)
      assert.equal(r.status, 0, r.combined)
    })
  })

  it('canonical 缺位：GLOSSARY 缺 帽制 → exit 2 点名', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'GLOSSARY.md', '# G\n\n门禁 / 过程轨 / 人闸 / 真值源\n')
      const r = run(dir)
      assert.equal(r.status, 2, r.combined)
      assert.ok(r.combined.includes('帽制'), r.combined)
      assert.match(r.combined, /canonical 保留词缺位|cannot|缺位/)
    })
  })

  it('闭集外不扫：docs/spec/** 与 .workbuddy/output/** 的门控不判红 → exit 0', async () => {
    await withTemp(async (dir) => {
      await seedClean(dir)
      await writeRel(dir, 'docs/spec/x.md', '# S\n\n门控（已签结构位 · 不追溯）\n')
      await writeRel(dir, '.workbuddy/output/y.md', '# Y\n\n门控\n')
      const r = run(dir)
      assert.equal(r.status, 0, r.combined)
    })
  })
})
